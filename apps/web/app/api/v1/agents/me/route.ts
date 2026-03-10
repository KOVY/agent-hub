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
 * GET /api/v1/agents/me — Get current agent's profile
 *
 * Auth: X-API-Key header (agent key)
 */
export async function GET(request: NextRequest) {
  const apiKey = request.headers.get("X-API-Key");
  if (!apiKey?.startsWith("af_agent_")) {
    return apiError("Agent API key required (X-API-Key header)", 401);
  }

  const supabase = getServiceClient();
  if (!supabase) {
    return apiError("Service unavailable", 503);
  }

  const { data: agent, error } = await supabase
    .from("agents")
    .select("*")
    .eq("api_key", apiKey)
    .eq("is_active", true)
    .single();

  if (error || !agent) {
    return apiError("Agent not found or inactive", 404);
  }

  // Also fetch servers published by this agent
  const { data: servers } = await supabase
    .from("mcp_servers")
    .select("id, slug, name, description, category, total_tools, total_calls, is_verified")
    .eq("agent_id", agent.id)
    .order("created_at", { ascending: false });

  // Update last_seen_at
  await supabase
    .from("agents")
    .update({ last_seen_at: new Date().toISOString() })
    .eq("id", agent.id);

  return apiSuccess({
    agent: {
      id: agent.id,
      name: agent.name,
      slug: agent.slug,
      description: agent.description,
      capabilities: agent.capabilities,
      is_verified: agent.is_verified,
      monthly_limit: agent.monthly_limit,
      calls_this_month: agent.calls_this_month,
      calls_remaining: Math.max(0, agent.monthly_limit - agent.calls_this_month),
      created_at: agent.created_at,
      last_seen_at: agent.last_seen_at,
    },
    servers: servers ?? [],
  });
}

/**
 * PATCH /api/v1/agents/me — Update current agent's profile
 *
 * Auth: X-API-Key header (agent key)
 * Body: { description?, homepage_url?, capabilities?, metadata? }
 */
export async function PATCH(request: NextRequest) {
  const apiKey = request.headers.get("X-API-Key");
  if (!apiKey?.startsWith("af_agent_")) {
    return apiError("Agent API key required (X-API-Key header)", 401);
  }

  const supabase = getServiceClient();
  if (!supabase) {
    return apiError("Service unavailable", 503);
  }

  const { data: agent } = await supabase
    .from("agents")
    .select("id")
    .eq("api_key", apiKey)
    .eq("is_active", true)
    .single();

  if (!agent) {
    return apiError("Agent not found or inactive", 404);
  }

  let body: {
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

  const updates: Record<string, unknown> = {};
  if (body.description !== undefined) updates.description = body.description;
  if (body.homepage_url !== undefined) updates.homepage_url = body.homepage_url;
  if (body.capabilities !== undefined) updates.capabilities = body.capabilities;
  if (body.metadata !== undefined) updates.metadata = body.metadata;

  if (Object.keys(updates).length === 0) {
    return apiError("No fields to update", 400);
  }

  const { data: updated, error } = await supabase
    .from("agents")
    .update(updates)
    .eq("id", agent.id)
    .select("id, name, slug, description, capabilities, homepage_url")
    .single();

  if (error) {
    return apiError(error.message, 500);
  }

  return apiSuccess({ agent: updated });
}
