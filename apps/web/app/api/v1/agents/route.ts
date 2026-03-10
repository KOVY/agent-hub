import { type NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { apiSuccess, apiError } from "@/lib/api/response";
import { generateAgentKey, generateSlug } from "@/lib/api/generate-key";

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

/**
 * POST /api/v1/agents — Register a new agent identity
 *
 * No auth required (agent self-registration).
 * Returns agent_id + api_key for all future API calls.
 *
 * Body: { name: string, description?: string, homepage_url?: string, capabilities?: string[] }
 */
export async function POST(request: NextRequest) {
  const supabase = getServiceClient();
  if (!supabase) {
    return apiError("Service unavailable", 503);
  }

  let body: {
    name: string;
    description?: string;
    homepage_url?: string;
    capabilities?: string[];
    metadata?: Record<string, unknown>;
  };

  try {
    body = await request.json();
  } catch {
    return apiError("Invalid JSON body", 400);
  }

  if (!body.name?.trim()) {
    return apiError("'name' is required", 400);
  }

  const name = body.name.trim();
  let slug = generateSlug(name);

  // Ensure slug uniqueness
  const { data: existing } = await supabase
    .from("agents")
    .select("slug")
    .eq("slug", slug)
    .maybeSingle();

  if (existing) {
    slug = `${slug}-${Date.now().toString(36)}`;
  }

  const apiKey = generateAgentKey();

  const { data: agent, error } = await supabase
    .from("agents")
    .insert({
      name,
      slug,
      api_key: apiKey,
      description: body.description?.trim() ?? null,
      homepage_url: body.homepage_url?.trim() ?? null,
      capabilities: body.capabilities ?? [],
      metadata: body.metadata ?? {},
    })
    .select("id, name, slug, description, capabilities, created_at")
    .single();

  if (error) {
    return apiError(`Registration failed: ${error.message}`, 500);
  }

  return apiSuccess(
    {
      agent: agent,
      api_key: apiKey,
      instructions: {
        authenticate: "Include 'X-API-Key: <your_key>' header in all requests",
        discover: "GET /api/v1/discover — browse available MCP servers",
        call_tool: "POST /api/v1/server/{id}/call — call a tool (requires API key)",
        publish: "POST /api/v1/servers — publish your own MCP server",
        profile: "GET /api/v1/agents/me — view your agent profile",
      },
    },
    201
  );
}

/**
 * GET /api/v1/agents — List registered agents
 *
 * Query params: limit, offset
 */
export async function GET(request: NextRequest) {
  const supabase = getServiceClient();
  if (!supabase) {
    return apiError("Service unavailable", 503);
  }

  const { searchParams } = request.nextUrl;
  const limit = parseInt(searchParams.get("limit") ?? "20", 10);
  const offset = parseInt(searchParams.get("offset") ?? "0", 10);

  const { data, error } = await supabase
    .from("agents")
    .select("id, name, slug, description, capabilities, is_verified, created_at")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    return apiError(error.message, 500);
  }

  return apiSuccess({
    agents: data,
    total: data.length,
    limit,
    offset,
  });
}
