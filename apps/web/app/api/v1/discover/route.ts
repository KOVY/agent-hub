import { type NextRequest } from "next/server";
import { apiSuccess } from "@/lib/api/response";
import { MOCK_SERVERS } from "@/lib/mock-data";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const category = searchParams.get("category");
  const search = searchParams.get("q");
  const featured = searchParams.get("featured");
  const limit = parseInt(searchParams.get("limit") ?? "20", 10);
  const offset = parseInt(searchParams.get("offset") ?? "0", 10);

  let servers = [...MOCK_SERVERS];

  if (category) {
    servers = servers.filter((s) => s.category === category);
  }

  if (search) {
    const q = search.toLowerCase();
    servers = servers.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  if (featured === "true") {
    servers = servers.filter((s) => s.is_featured);
  }

  const total = servers.length;
  servers = servers.slice(offset, offset + limit);

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
