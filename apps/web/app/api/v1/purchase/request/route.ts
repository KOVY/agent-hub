import { type NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { apiSuccess, apiError } from "@/lib/api/response";
import { validateApiKey } from "@/lib/api/auth";
import { fetchServerByIdOrSlug } from "@/lib/data";
import { randomBytes } from "crypto";

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

/**
 * POST /api/v1/purchase/request — Create a purchase consent request
 *
 * Auth: X-API-Key header (agent key required)
 * Body: {
 *   server_id: string,
 *   items: Array<{ name, product_id?, price, quantity?, currency? }>,
 *   note?: string,
 *   expires_in?: number (seconds, default 3600, max 86400)
 * }
 *
 * Returns approval_url that the agent's owner clicks to approve.
 */
export async function POST(request: NextRequest) {
  const key = await validateApiKey(request);
  if (!key) {
    return apiError("API key required (X-API-Key header)", 401);
  }

  if (!key.agent_id) {
    return apiError(
      "Agent identity required. Register via POST /api/v1/agents first.",
      403
    );
  }

  const supabase = getServiceClient();
  if (!supabase) {
    return apiError("Service unavailable", 503);
  }

  let body: {
    server_id: string;
    items: Array<{
      name: string;
      product_id?: string;
      price: number;
      quantity?: number;
      currency?: string;
    }>;
    note?: string;
    expires_in?: number;
  };

  try {
    body = await request.json();
  } catch {
    return apiError("Invalid JSON body", 400);
  }

  if (!body.server_id) {
    return apiError("'server_id' is required", 400);
  }

  if (!Array.isArray(body.items) || body.items.length === 0) {
    return apiError("'items' array is required and must not be empty", 400);
  }

  // Validate items
  for (const item of body.items) {
    if (!item.name || item.price === undefined || item.price < 0) {
      return apiError("Each item must have 'name' and 'price' (≥ 0)", 400);
    }
  }

  const server = await fetchServerByIdOrSlug(body.server_id);
  if (!server) {
    return apiError("Server not found", 404);
  }

  // Calculate total
  const totalAmount = body.items.reduce(
    (sum, item) => sum + item.price * (item.quantity ?? 1),
    0
  );
  const currency = body.items[0]?.currency ?? "EUR";

  // Generate approval token
  const approvalToken = randomBytes(32).toString("hex");

  // Set expiry (default 1 hour, max 24 hours)
  const expiresIn = Math.min(body.expires_in ?? 3600, 86400);
  const expiresAt = new Date(Date.now() + expiresIn * 1000);

  const { data: purchaseReq, error } = await supabase
    .from("purchase_requests")
    .insert({
      agent_id: key.agent_id,
      server_id: server.id,
      items: body.items.map((item) => ({
        name: item.name,
        product_id: item.product_id ?? null,
        price: item.price,
        quantity: item.quantity ?? 1,
        currency: item.currency ?? currency,
      })),
      total_amount: totalAmount,
      currency,
      approval_token: approvalToken,
      expires_at: expiresAt.toISOString(),
      agent_note: body.note?.trim() ?? null,
    })
    .select("id, status, total_amount, currency, expires_at, created_at")
    .single();

  if (error) {
    return apiError(`Failed to create purchase request: ${error.message}`, 500);
  }

  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}`;

  return apiSuccess(
    {
      purchase_request: purchaseReq,
      approval: {
        url: `${baseUrl}/approve/${approvalToken}`,
        token: approvalToken,
        expires_at: expiresAt.toISOString(),
        expires_in_seconds: expiresIn,
      },
      instructions:
        "Share the approval URL with the agent's owner. They can approve or reject the purchase.",
    },
    201
  );
}
