import { type NextRequest } from "next/server";
import { apiSuccess } from "@/lib/api/response";
import { fetchServers } from "@/lib/data";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const category = searchParams.get("category") || undefined;
  const search = searchParams.get("q") || undefined;
  const featured = searchParams.get("featured") === "true" || undefined;
  const limit = parseInt(searchParams.get("limit") ?? "20", 10);
  const offset = parseInt(searchParams.get("offset") ?? "0", 10);

  const servers = await fetchServers({ category, search, featured, limit, offset });
  const total = servers.length;

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
    })),
    total,
    limit,
    offset,
  });
}
