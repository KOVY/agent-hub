import { type NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { apiSuccess, apiError } from "@/lib/api/response";
import { validateApiKey } from "@/lib/api/auth";
import { generateSlug } from "@/lib/api/generate-key";
import { SERVER_CATEGORIES } from "@agent-hub/db";

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

/**
 * POST /api/v1/servers — Publish a new MCP server
 *
 * Auth: X-API-Key header (agent key or user key)
 * Body: {
 *   name: string,
 *   description: string,
 *   category: string,
 *   endpoint_url?: string,
 *   long_description?: string,
 *   pricing_model?: "free" | "freemium" | "paid",
 *   price_monthly?: number,
 *   free_tier_calls?: number,
 *   tags?: string[],
 *   documentation_url?: string,
 *   source_url?: string,
 *   version?: string,
 *   tools?: Array<{
 *     name: string,
 *     description: string,
 *     input_schema?: object,
 *     output_schema?: object,
 *   }>
 * }
 */
export async function POST(request: NextRequest) {
  const key = await validateApiKey(request);
  if (!key) {
    return apiError("API key required. Set X-API-Key header.", 401);
  }

  const supabase = getServiceClient();
  if (!supabase) {
    return apiError("Service unavailable", 503);
  }

  let body: {
    name: string;
    description: string;
    category: string;
    endpoint_url?: string;
    long_description?: string;
    pricing_model?: string;
    price_monthly?: number;
    free_tier_calls?: number;
    tags?: string[];
    documentation_url?: string;
    source_url?: string;
    version?: string;
    tools?: Array<{
      name: string;
      description: string;
      input_schema?: Record<string, unknown>;
      output_schema?: Record<string, unknown>;
      example_input?: Record<string, unknown>;
      example_output?: Record<string, unknown>;
    }>;
  };

  try {
    body = await request.json();
  } catch {
    return apiError("Invalid JSON body", 400);
  }

  // Validation
  if (!body.name?.trim()) return apiError("'name' is required", 400);
  if (!body.description?.trim()) return apiError("'description' is required", 400);
  if (!body.category?.trim()) return apiError("'category' is required", 400);
  if (!SERVER_CATEGORIES.includes(body.category as never)) {
    return apiError(`Invalid category. Must be one of: ${SERVER_CATEGORIES.join(", ")}`, 400);
  }

  const name = body.name.trim();
  let slug = generateSlug(name);

  // Ensure slug uniqueness
  const { data: existing } = await supabase
    .from("mcp_servers")
    .select("slug")
    .eq("slug", slug)
    .maybeSingle();

  if (existing) {
    slug = `${slug}-${Date.now().toString(36)}`;
  }

  // Insert server
  const serverData: Record<string, unknown> = {
    name,
    slug,
    description: body.description.trim(),
    long_description: body.long_description?.trim() ?? null,
    category: body.category,
    endpoint_url: body.endpoint_url?.trim() ?? null,
    pricing_model: body.pricing_model ?? "free",
    price_monthly: body.price_monthly ?? 0,
    free_tier_calls: body.free_tier_calls ?? 100,
    tags: body.tags ?? [],
    documentation_url: body.documentation_url?.trim() ?? null,
    source_url: body.source_url?.trim() ?? null,
    version: body.version ?? "1.0.0",
    total_tools: body.tools?.length ?? 0,
  };

  // Set publisher identity
  if (key.type === "agent") {
    serverData.agent_id = key.agent_id;
  } else {
    serverData.owner_id = key.owner_id;
  }

  const { data: server, error: serverError } = await supabase
    .from("mcp_servers")
    .insert(serverData)
    .select()
    .single();

  if (serverError) {
    return apiError(`Failed to create server: ${serverError.message}`, 500);
  }

  // Insert tools if provided
  let tools: unknown[] = [];
  if (body.tools && body.tools.length > 0) {
    const toolRows = body.tools.map((t) => ({
      server_id: server.id,
      name: t.name,
      description: t.description,
      input_schema: t.input_schema ?? {},
      output_schema: t.output_schema ?? {},
      example_input: t.example_input ?? null,
      example_output: t.example_output ?? null,
    }));

    const { data: insertedTools, error: toolsError } = await supabase
      .from("mcp_tools")
      .insert(toolRows)
      .select();

    if (toolsError) {
      console.error("[publish] Tools insert failed:", toolsError);
    } else {
      tools = insertedTools ?? [];
    }
  }

  return apiSuccess(
    {
      server: {
        id: server.id,
        slug: server.slug,
        name: server.name,
        description: server.description,
        category: server.category,
        endpoint_url: server.endpoint_url,
        pricing_model: server.pricing_model,
        tags: server.tags,
        created_at: server.created_at,
      },
      tools_created: tools.length,
      urls: {
        detail: `/api/v1/server/${server.slug}`,
        tools: `/api/v1/server/${server.slug}/tools`,
        call: `/api/v1/server/${server.slug}/call`,
        web: `/en/server/${server.slug}`,
      },
    },
    201
  );
}
