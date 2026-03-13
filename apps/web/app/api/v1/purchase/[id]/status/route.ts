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
 * GET /api/v1/purchase/{id}/status — Check purchase request status
 *
 * Auth: X-API-Key header (agent key — must own the request)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const key = await validateApiKey(request);
  if (!key) {
    return apiError("API key required (X-API-Key header)", 401);
  }

  const supabase = getServiceClient();
  if (!supabase) {
    return apiError("Service unavailable", 503);
  }

  // First expire any overdue requests
  await supabase.rpc("expire_purchase_requests");

  const { data: pr, error } = await supabase
    .from("purchase_requests")
    .select(
      `
      id, status, items, total_amount, currency,
      agent_note, owner_note,
      expires_at, approved_at, rejected_at, completed_at,
      created_at, updated_at,
      agents!inner(id, name),
      mcp_servers!inner(id, name, slug)
    `
    )
    .eq("id", id)
    .single();

  if (error || !pr) {
    return apiError("Purchase request not found", 404);
  }

  // Verify ownership (agent must own this request)
  const prAgent = pr.agents as unknown as Record<string, unknown>;
  if (key.agent_id && prAgent.id !== key.agent_id) {
    return apiError("You can only view your own purchase requests", 403);
  }

  const prServer = pr.mcp_servers as unknown as Record<string, unknown>;

  return apiSuccess({
    id: pr.id,
    status: pr.status,
    items: pr.items,
    total_amount: pr.total_amount,
    currency: pr.currency,
    agent: { id: prAgent.id, name: prAgent.name },
    server: { id: prServer.id, name: prServer.name, slug: prServer.slug },
    agent_note: pr.agent_note,
    owner_note: pr.owner_note,
    timeline: {
      created_at: pr.created_at,
      expires_at: pr.expires_at,
      approved_at: pr.approved_at,
      rejected_at: pr.rejected_at,
      completed_at: pr.completed_at,
    },
  });
}
