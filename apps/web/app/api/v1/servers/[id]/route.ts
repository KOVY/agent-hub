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

async function findServer(supabase: ReturnType<typeof getServiceClient>, id: string) {
  if (!supabase) return null;

  // Try slug first
  const { data: bySlug } = await supabase
    .from("mcp_servers")
    .select("*")
    .eq("slug", id)
    .maybeSingle();
  if (bySlug) return bySlug;

  // Try UUID
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
  if (isUuid) {
    const { data: byId } = await supabase
      .from("mcp_servers")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    return byId;
  }

  return null;
}

function isOwner(server: { owner_id: string | null; agent_id: string | null }, key: { owner_id: string; type: string; agent_id?: string }) {
  if (key.type === "agent") {
    return server.agent_id === key.agent_id;
  }
  return server.owner_id === key.owner_id;
}

/**
 * PUT /api/v1/servers/[id] — Update an MCP server
 *
 * Auth: X-API-Key header (must be the owner/publisher)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const key = await validateApiKey(request);
  if (!key) {
    return apiError("API key required", 401);
  }

  const supabase = getServiceClient();
  if (!supabase) {
    return apiError("Service unavailable", 503);
  }

  const server = await findServer(supabase, id);
  if (!server) {
    return apiError("Server not found", 404);
  }

  if (!isOwner(server, key)) {
    return apiError("You can only update servers you published", 403);
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return apiError("Invalid JSON body", 400);
  }

  // Whitelist allowed update fields
  const allowed = [
    "name", "description", "long_description", "category",
    "endpoint_url", "pricing_model", "price_monthly", "free_tier_calls",
    "tags", "documentation_url", "source_url", "version",
  ];

  const updates: Record<string, unknown> = {};
  for (const field of allowed) {
    if (body[field] !== undefined) {
      updates[field] = body[field];
    }
  }

  if (Object.keys(updates).length === 0) {
    return apiError("No valid fields to update", 400);
  }

  const { data: updated, error } = await supabase
    .from("mcp_servers")
    .update(updates)
    .eq("id", server.id)
    .select()
    .single();

  if (error) {
    return apiError(error.message, 500);
  }

  return apiSuccess({ server: updated });
}

/**
 * DELETE /api/v1/servers/[id] — Delete an MCP server
 *
 * Auth: X-API-Key header (must be the owner/publisher)
 * Cascades to mcp_tools via FK constraint.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const key = await validateApiKey(request);
  if (!key) {
    return apiError("API key required", 401);
  }

  const supabase = getServiceClient();
  if (!supabase) {
    return apiError("Service unavailable", 503);
  }

  const server = await findServer(supabase, id);
  if (!server) {
    return apiError("Server not found", 404);
  }

  if (!isOwner(server, key)) {
    return apiError("You can only delete servers you published", 403);
  }

  const { error } = await supabase
    .from("mcp_servers")
    .delete()
    .eq("id", server.id);

  if (error) {
    return apiError(error.message, 500);
  }

  return apiSuccess({ deleted: true, id: server.id, slug: server.slug });
}
