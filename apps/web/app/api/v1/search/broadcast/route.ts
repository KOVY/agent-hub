import { type NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { apiSuccess, apiError } from "@/lib/api/response";
import { validateApiKey } from "@/lib/api/auth";

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

/**
 * POST /api/v1/search/broadcast — Multi-server search in one call
 *
 * Auth: X-API-Key header (required)
 * Body: {
 *   query: string,           — natural language search
 *   category?: string,       — filter by category
 *   max_servers?: number,    — max servers to search (default 5, max 20)
 *   max_results_per_server?: number,  — tools per server (default 3)
 *   budget_max?: number,     — max monthly price filter
 *   preferred_pricing?: "free" | "freemium" | "paid"
 * }
 *
 * Returns matched servers with their tools, sorted by relevance.
 * One API call instead of N sequential discover+tools calls.
 */
export async function POST(request: NextRequest) {
  const key = await validateApiKey(request);
  if (!key) {
    return apiError("API key required (X-API-Key header)", 401);
  }

  const supabase = getServiceClient();
  if (!supabase) {
    return apiError("Service unavailable", 503);
  }

  let body: {
    query: string;
    category?: string;
    max_servers?: number;
    max_results_per_server?: number;
    budget_max?: number;
    preferred_pricing?: string;
  };

  try {
    body = await request.json();
  } catch {
    return apiError("Invalid JSON body", 400);
  }

  if (!body.query?.trim()) {
    return apiError("'query' is required", 400);
  }

  const maxServers = Math.min(body.max_servers ?? 5, 20);
  const maxToolsPerServer = Math.min(body.max_results_per_server ?? 3, 10);
  const start = Date.now();

  // Step 1: Full-text search for matching servers
  const { data: servers, error: searchErr } = await supabase.rpc(
    "search_servers",
    {
      search_query: body.query.trim(),
      p_category: body.category ?? null,
      p_featured: null,
      p_limit: maxServers,
      p_offset: 0,
    }
  );

  if (searchErr || !servers?.length) {
    return apiSuccess({
      query: body.query,
      results: [],
      servers_searched: 0,
      total_tools: 0,
      response_ms: Date.now() - start,
    });
  }

  // Step 2: Filter by pricing preferences
  let filteredServers = servers as Array<Record<string, unknown>>;

  if (body.budget_max !== undefined) {
    filteredServers = filteredServers.filter(
      (s) => Number(s.price_monthly) <= body.budget_max!
    );
  }

  if (body.preferred_pricing) {
    filteredServers = filteredServers.filter(
      (s) => s.pricing_model === body.preferred_pricing
    );
  }

  // Step 3: Fetch tools for each matched server (parallel)
  const serverIds = filteredServers.map((s) => s.id as string);

  const { data: allTools } = await supabase
    .from("mcp_tools")
    .select("server_id, name, description, input_schema, output_schema")
    .in("server_id", serverIds)
    .eq("is_active", true)
    .order("name");

  // Step 4: Get review summaries for matched servers
  const { data: reviewSummaries } = await supabase
    .from("server_review_summary")
    .select("*")
    .in("server_id", serverIds);

  const reviewMap = new Map(
    (reviewSummaries ?? []).map((r: Record<string, unknown>) => [
      r.server_id,
      r,
    ])
  );

  // Step 5: Assemble results
  const toolsByServer = new Map<string, Array<Record<string, unknown>>>();
  for (const tool of allTools ?? []) {
    const existing = toolsByServer.get(tool.server_id) ?? [];
    if (existing.length < maxToolsPerServer) {
      existing.push(tool);
      toolsByServer.set(tool.server_id, existing);
    }
  }

  const results = filteredServers.map((s) => {
    const review = reviewMap.get(s.id) as Record<string, unknown> | undefined;
    return {
      server: {
        id: s.id,
        slug: s.slug,
        name: s.name,
        description: s.description,
        category: s.category,
        pricing_model: s.pricing_model,
        price_monthly: s.price_monthly,
        trust_score: s.trust_score,
        is_verified: s.is_verified,
        relevance: s.rank,
      },
      tools: toolsByServer.get(s.id as string) ?? [],
      reviews: review
        ? {
            avg_score: review.avg_score,
            total_reviews: review.total_reviews,
            verified_reviews: review.verified_reviews,
          }
        : null,
      install: {
        type: s.install_type,
        command: s.install_command,
        config: s.config_snippet,
      },
    };
  });

  const totalTools = results.reduce((sum, r) => sum + r.tools.length, 0);

  // Log broadcast query
  await supabase.from("broadcast_queries").insert({
    agent_id: key.agent_id ?? null,
    query: body.query.trim(),
    category: body.category ?? null,
    servers_queried: results.length,
    results_returned: totalTools,
  });

  return apiSuccess({
    query: body.query,
    results,
    servers_searched: results.length,
    total_tools: totalTools,
    response_ms: Date.now() - start,
    search_type: "broadcast_fulltext",
  });
}
