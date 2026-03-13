import { type NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { apiSuccess } from "@/lib/api/response";
import { fetchServers } from "@/lib/data";

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const category = searchParams.get("category") || null;
  const search = searchParams.get("q") || null;
  const featured = searchParams.get("featured") === "true" ? true : null;
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "20", 10), 100);
  const offset = parseInt(searchParams.get("offset") ?? "0", 10);

  // Use full-text search RPC when available
  const supabase = getServiceClient();
  if (supabase && search) {
    const { data, error } = await supabase.rpc("search_servers", {
      search_query: search,
      p_category: category,
      p_featured: featured,
      p_limit: limit,
      p_offset: offset,
    });

    if (!error && data) {
      // Fetch review summaries for matched servers
      const serverIds = data.map((s: Record<string, unknown>) => s.id);
      const { data: reviews } = await supabase
        .from("server_review_summary")
        .select("*")
        .in("server_id", serverIds);
      const reviewMap = new Map(
        (reviews ?? []).map((r: Record<string, unknown>) => [r.server_id, r])
      );

      return apiSuccess({
        servers: data.map((s: Record<string, unknown>) => {
          const review = reviewMap.get(s.id) as Record<string, unknown> | undefined;
          return {
            id: s.id,
            slug: s.slug,
            name: s.name,
            description: s.description,
            category: s.category,
            pricing_model: s.pricing_model,
            price_monthly: s.price_monthly,
            free_tier_calls: s.free_tier_calls,
            trust_score: s.trust_score,
            is_verified: s.is_verified,
            total_tools: s.total_tools,
            tags: s.tags,
            version: s.version,
            install_type: s.install_type,
            install_command: s.install_command,
            config_snippet: s.config_snippet,
            relevance: s.rank,
            reviews: review
              ? { avg_score: review.avg_score, total: review.total_reviews, verified: review.verified_reviews }
              : null,
          };
        }),
        total: data.length,
        limit,
        offset,
        search_type: "fulltext",
      });
    }
  }

  // Fallback to standard fetch (no search or no Supabase)
  const servers = await fetchServers({
    category: category ?? undefined,
    search: search ?? undefined,
    featured: featured ?? undefined,
    limit,
    offset,
  });

  return apiSuccess({
    servers: servers.map((s) => ({
      id: s.id,
      slug: s.slug,
      name: s.name,
      description: s.description,
      category: s.category,
      pricing_model: s.pricing_model,
      price_monthly: s.price_monthly,
      free_tier_calls: s.free_tier_calls,
      trust_score: s.trust_score,
      is_verified: s.is_verified,
      total_tools: s.total_tools,
      tags: s.tags,
      version: s.version,
      install_type: s.install_type,
      install_command: s.install_command,
      config_snippet: s.config_snippet,
    })),
    total: servers.length,
    limit,
    offset,
    search_type: "basic",
  });
}
