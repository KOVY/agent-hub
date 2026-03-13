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
 * GET /api/v1/products — Cross-server product search
 *
 * No auth required. Search products across all servers.
 * Query params: q, category, max_price, currency, server_id, limit, offset
 */
export async function GET(request: NextRequest) {
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
  const currency = searchParams.get("currency") || "EUR";
  const serverId = searchParams.get("server_id") || null;
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "20", 10), 100);
  const offset = parseInt(searchParams.get("offset") ?? "0", 10);

  const { data, error } = await supabase.rpc("search_products", {
    search_query: search,
    p_category: category,
    p_max_price: maxPrice,
    p_currency: currency,
    p_server_id: serverId,
    p_limit: limit,
    p_offset: offset,
  });

  if (error) {
    return apiError(error.message, 500);
  }

  // Add freshness indicator
  const now = Date.now();
  const products = (data ?? []).map((p: Record<string, unknown>) => {
    const lastUpdated = new Date(p.last_updated as string).getTime();
    const ageHours = (now - lastUpdated) / (1000 * 60 * 60);
    let freshness: "fresh" | "acceptable" | "stale";
    if (ageHours < 24) freshness = "fresh";
    else if (ageHours < 168) freshness = "acceptable"; // 7 days
    else freshness = "stale";

    return {
      id: p.id,
      name: p.name,
      description: p.description,
      category: p.category,
      price: p.price,
      currency: p.currency,
      attributes: p.attributes,
      image_url: p.image_url,
      last_updated: p.last_updated,
      freshness,
      server: {
        id: p.server_id,
        name: p.server_name,
        slug: p.server_slug,
      },
      relevance: p.rank,
    };
  });

  return apiSuccess({
    products,
    total: products.length,
    limit,
    offset,
    search_type: search ? "fulltext" : "browse",
  });
}
