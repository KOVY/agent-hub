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
 * GET /api/approve/{token} — Fetch purchase request details by token
 *
 * No auth (token acts as auth). Used by the approval page.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  const supabase = getServiceClient();
  if (!supabase) {
    return apiError("Service unavailable", 503);
  }

  // Auto-expire overdue requests first
  await supabase.rpc("expire_purchase_requests");

  const { data: pr, error } = await supabase
    .from("purchase_requests")
    .select(
      `
      id, status, items, total_amount, currency,
      agent_note, expires_at, created_at,
      agents!inner(name),
      mcp_servers!inner(name)
    `
    )
    .eq("approval_token", token)
    .single();

  if (error || !pr) {
    return apiError("Purchase request not found or expired", 404);
  }

  const agent = pr.agents as unknown as Record<string, unknown>;
  const server = pr.mcp_servers as unknown as Record<string, unknown>;

  return apiSuccess({
    id: pr.id,
    status: pr.status,
    items: pr.items,
    total_amount: pr.total_amount,
    currency: pr.currency,
    agent_name: agent.name,
    server_name: server.name,
    agent_note: pr.agent_note,
    expires_at: pr.expires_at,
    created_at: pr.created_at,
  });
}

/**
 * POST /api/approve/{token} — Approve or reject a purchase request
 *
 * No auth (token acts as auth).
 * Body: { action: "approve" | "reject", note?: string }
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  const supabase = getServiceClient();
  if (!supabase) {
    return apiError("Service unavailable", 503);
  }

  let body: { action: string; note?: string };
  try {
    body = await request.json();
  } catch {
    return apiError("Invalid JSON body", 400);
  }

  if (!["approve", "reject"].includes(body.action)) {
    return apiError("'action' must be 'approve' or 'reject'", 400);
  }

  // Auto-expire first
  await supabase.rpc("expire_purchase_requests");

  // Find the request
  const { data: pr, error: findErr } = await supabase
    .from("purchase_requests")
    .select("id, status")
    .eq("approval_token", token)
    .single();

  if (findErr || !pr) {
    return apiError("Purchase request not found", 404);
  }

  if (pr.status !== "pending") {
    return apiError(`Request is already ${pr.status}`, 409);
  }

  const now = new Date().toISOString();
  const updates: Record<string, unknown> = {
    status: body.action === "approve" ? "approved" : "rejected",
    owner_note: body.note?.trim() ?? null,
  };

  if (body.action === "approve") {
    updates.approved_at = now;
  } else {
    updates.rejected_at = now;
  }

  const { error: updateErr } = await supabase
    .from("purchase_requests")
    .update(updates)
    .eq("id", pr.id);

  if (updateErr) {
    return apiError(`Failed to ${body.action} request: ${updateErr.message}`, 500);
  }

  return apiSuccess({
    id: pr.id,
    status: updates.status,
    action: body.action,
  });
}
