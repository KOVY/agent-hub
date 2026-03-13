import { type NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { apiSuccess, apiError } from "@/lib/api/response";

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

/**
 * GET /api/v1/webmcp/discover — Discover WebMCP-enabled servers
 *
 * No auth required. Returns servers that support WebMCP (client-side tools).
 * Query params: q, category, limit, offset
 */
export async function GET(request: NextRequest) {
  const supabase = getServiceClient();
  if (!supabase) {
    return apiError("Service unavailable", 503);
  }

  const { searchParams } = request.nextUrl;
  const search = searchParams.get("q") || null;
  const category = searchParams.get("category") || null;
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "20", 10), 100);
  const offset = parseInt(searchParams.get("offset") ?? "0", 10);

  let query = supabase
    .from("mcp_servers")
    .select(
      `
      id, slug, name, description, category,
      pricing_model, trust_score, is_verified,
      total_tools, tags, webmcp_config,
      mcp_tools(name, description, input_schema)
    `
    )
    .not("webmcp_config", "is", null)
    .order("trust_score", { ascending: false })
    .range(offset, offset + limit - 1);

  if (category) {
    query = query.eq("category", category);
  }

  if (search) {
    query = query.or(
      `name.ilike.%${search}%,description.ilike.%${search}%`
    );
  }

  const { data, error } = await query;

  if (error) {
    return apiError(error.message, 500);
  }

  return apiSuccess({
    servers: (data ?? []).map((s: Record<string, unknown>) => {
      const config = s.webmcp_config as Record<string, unknown> | null;
      const tools = s.mcp_tools as Array<Record<string, unknown>> | null;
      return {
        id: s.id,
        slug: s.slug,
        name: s.name,
        description: s.description,
        category: s.category,
        trust_score: s.trust_score,
        is_verified: s.is_verified,
        webmcp: {
          website_url: config?.website_url ?? null,
          api_type: config?.api_type ?? "imperative",
          chrome_version: config?.chrome_version ?? "146",
        },
        tools: (tools ?? []).map((t) => ({
          name: t.name,
          description: t.description,
          parameters: t.input_schema,
        })),
      };
    }),
    total: (data ?? []).length,
    limit,
    offset,
    protocol: "webmcp",
    chrome_requirement: "146+",
  });
}
