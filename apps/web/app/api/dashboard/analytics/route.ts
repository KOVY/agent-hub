import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

async function getAuthUser() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
      },
    }
  );
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

/**
 * GET /api/dashboard/analytics — Publisher analytics
 *
 * Returns reviews, agent activity, and call stats for the user's servers.
 */
export async function GET() {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getServiceClient();

  // Get user's servers
  const { data: servers } = await supabase
    .from("mcp_servers")
    .select("id, name, slug, total_calls, total_tools")
    .eq("owner_id", user.id);

  if (!servers || servers.length === 0) {
    return NextResponse.json({
      servers: [],
      total_reviews: 0,
      avg_review_score: null,
      total_calls: 0,
      unique_agents: 0,
      recent_reviews: [],
    });
  }

  const serverIds = servers.map((s) => s.id);

  // Get reviews for user's servers
  const { data: reviews } = await supabase
    .from("agent_reviews")
    .select(
      `
      id, score, comment, is_verified, created_at,
      agents!inner(name, slug),
      mcp_servers!inner(name, slug)
    `
    )
    .in("server_id", serverIds)
    .order("created_at", { ascending: false })
    .limit(20);

  // Get review summaries
  const { data: summaries } = await supabase
    .from("server_review_summary")
    .select("*")
    .in("server_id", serverIds);

  const totalReviews = (summaries ?? []).reduce(
    (sum, s) => sum + Number(s.total_reviews),
    0
  );
  const avgScore =
    totalReviews > 0
      ? (summaries ?? []).reduce(
          (sum, s) =>
            sum + Number(s.avg_score ?? 0) * Number(s.total_reviews),
          0
        ) / totalReviews
      : null;

  // Get unique agents that called user's servers (from usage_logs)
  const { data: agentKeys } = await supabase
    .from("agent_keys")
    .select("id")
    .eq("owner_id", user.id);

  const totalCalls = servers.reduce((sum, s) => sum + (s.total_calls ?? 0), 0);

  return NextResponse.json({
    servers: servers.map((s) => {
      const summary = (summaries ?? []).find(
        (r: Record<string, unknown>) => r.server_id === s.id
      );
      return {
        id: s.id,
        name: s.name,
        slug: s.slug,
        total_calls: s.total_calls,
        total_tools: s.total_tools,
        reviews: summary
          ? {
              avg_score: summary.avg_score,
              total: summary.total_reviews,
              verified: summary.verified_reviews,
            }
          : null,
      };
    }),
    total_reviews: totalReviews,
    avg_review_score: avgScore ? Math.round(avgScore * 10) / 10 : null,
    total_calls: totalCalls,
    keys_count: agentKeys?.length ?? 0,
    recent_reviews: (reviews ?? []).map((r: Record<string, unknown>) => ({
      id: r.id,
      score: r.score,
      comment: r.comment,
      is_verified: r.is_verified,
      created_at: r.created_at,
      agent: r.agents,
      server: r.mcp_servers,
    })),
  });
}
