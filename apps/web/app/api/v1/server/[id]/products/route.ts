import { type NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { apiSuccess, apiError } from "@/lib/api/response";
import { validateApiKey } from "@/lib/api/auth";
import { fetchServerByIdOrSlug } from "@/lib/data";

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

/**
 * GET /api/v1/server/{id}/products — List products for a specific server
 *
 * No auth required.
 * Query params: q, category, max_price, limit, offset
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const server = await fetchServerByIdOrSlug(id);
  if (!server) {
    return apiError("Server not found", 404);
  }

  const supabase = getServiceClient();
  if (!supabase) {
    return apiError("Service unavailable", 503);
  }

  const { searchParams } = request.nextUrl;
  const search = searchParams.get("q") || null;
  const category = searchParams.get("category") || null;
  const maxPrice = searchParams.get("max_price")
    ? parseFloat(searchParams.get("max_price")!)
    : null;
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "20", 10), 100);
  const offset = parseInt(searchParams.get("offset") ?? "0", 10);

  const { data, error } = await supabase.rpc("search_products", {
    search_query: search,
    p_category: category,
    p_max_price: maxPrice,
    p_currency: "EUR",
    p_server_id: server.id,
    p_limit: limit,
    p_offset: offset,
  });

  if (error) {
    return apiError(error.message, 500);
  }

  return apiSuccess({
    server_id: server.id,
    server_name: server.name,
    products: (data ?? []).map((p: Record<string, unknown>) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      category: p.category,
      price: p.price,
      currency: p.currency,
      attributes: p.attributes,
      image_url: p.image_url,
      last_updated: p.last_updated,
      relevance: p.rank,
    })),
    total: (data ?? []).length,
    limit,
    offset,
  });
}

/**
 * POST /api/v1/server/{id}/products — Publish products
 *
 * Auth: X-API-Key header (must be server owner)
 * Body: { products: Array<{ name, description?, category?, price?, currency?, attributes?, image_url? }> }
 */
export async function POST(
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

  const server = await fetchServerByIdOrSlug(id);
  if (!server) {
    return apiError("Server not found", 404);
  }

  // Verify ownership
  const isOwner =
    server.owner_id === key.owner_id ||
    server.agent_id === key.agent_id;
  if (!isOwner) {
    return apiError("You can only publish products for servers you own", 403);
  }

  let body: {
    products: Array<{
      name: string;
      description?: string;
      category?: string;
      price?: number;
      currency?: string;
      attributes?: Record<string, unknown>;
      image_url?: string;
    }>;
  };

  try {
    body = await request.json();
  } catch {
    return apiError("Invalid JSON body", 400);
  }

  if (!Array.isArray(body.products) || body.products.length === 0) {
    return apiError("'products' array is required and must not be empty", 400);
  }

  if (body.products.length > 100) {
    return apiError("Maximum 100 products per request", 400);
  }

  const rows = body.products.map((p) => ({
    server_id: server.id,
    name: p.name.trim(),
    description: p.description?.trim() ?? null,
    category: p.category?.trim() ?? server.category,
    price: p.price ?? null,
    currency: p.currency ?? "EUR",
    attributes: p.attributes ?? {},
    image_url: p.image_url ?? null,
    last_updated: new Date().toISOString(),
  }));

  const invalid = rows.filter((r) => !r.name);
  if (invalid.length > 0) {
    return apiError("All products must have a 'name'", 400);
  }

  const { data, error } = await supabase
    .from("product_listings")
    .insert(rows)
    .select("id, name, category, price, currency");

  if (error) {
    return apiError(`Failed to publish products: ${error.message}`, 500);
  }

  return apiSuccess(
    {
      published: data?.length ?? 0,
      products: data,
      server_id: server.id,
    },
    201
  );
}
