import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get user's keys
  const { data: keys } = await supabase
    .from("agent_keys")
    .select("id, monthly_limit, calls_this_month")
    .eq("owner_id", user.id);

  const keysCount = keys?.length ?? 0;
  const totalCallsThisMonth =
    keys?.reduce((sum, k) => sum + (k.calls_this_month ?? 0), 0) ?? 0;
  const totalLimit =
    keys?.reduce((sum, k) => sum + (k.monthly_limit ?? 100), 0) ?? 0;

  // Get usage logs for this user's keys (last 30 days)
  const keyIds = keys?.map((k) => k.id) ?? [];
  let recentLogs: { created_at: string; server_id: string; response_ms: number }[] = [];

  if (keyIds.length > 0) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: logs } = await supabase
      .from("usage_logs")
      .select("created_at, server_id, response_ms")
      .in("agent_key_id", keyIds)
      .gte("created_at", thirtyDaysAgo.toISOString())
      .order("created_at", { ascending: false })
      .limit(1000);

    recentLogs = logs ?? [];
  }

  // Aggregate daily usage
  const dailyUsage: Record<string, number> = {};
  for (const log of recentLogs) {
    const day = log.created_at.split("T")[0];
    dailyUsage[day] = (dailyUsage[day] ?? 0) + 1;
  }

  // Aggregate by server
  const serverUsage: Record<string, number> = {};
  for (const log of recentLogs) {
    serverUsage[log.server_id] = (serverUsage[log.server_id] ?? 0) + 1;
  }

  // Get server names for top servers
  const topServerIds = Object.entries(serverUsage)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id]) => id);

  let topServers: { id: string; name: string; calls: number; percentage: number }[] = [];
  if (topServerIds.length > 0) {
    const { data: servers } = await supabase
      .from("mcp_servers")
      .select("id, name")
      .in("id", topServerIds);

    const totalCalls = recentLogs.length || 1;
    topServers = topServerIds.map((id) => {
      const server = servers?.find((s) => s.id === id);
      const calls = serverUsage[id] ?? 0;
      return {
        id,
        name: server?.name ?? "Unknown",
        calls,
        percentage: Math.round((calls / totalCalls) * 100),
      };
    });
  }

  // Avg response time
  const avgResponse =
    recentLogs.length > 0
      ? Math.round(
          recentLogs.reduce((sum, l) => sum + (l.response_ms ?? 0), 0) /
            recentLogs.length
        )
      : 0;

  return NextResponse.json({
    keys_count: keysCount,
    calls_this_month: totalCallsThisMonth,
    total_limit: totalLimit,
    remaining: totalLimit - totalCallsThisMonth,
    avg_response_ms: avgResponse,
    daily_usage: Object.entries(dailyUsage)
      .map(([date, calls]) => ({ date, calls }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-14),
    top_servers: topServers,
  });
}
