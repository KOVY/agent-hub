import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

/**
 * GET /api/v1/health — System health check
 *
 * Returns service status, DB connectivity, and basic stats.
 * No auth required.
 */
export async function GET() {
  const start = Date.now();
  const checks: Record<string, { status: string; latency_ms?: number }> = {};

  // Database check
  const dbStart = Date.now();
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
      checks.database = { status: "unconfigured" };
    } else {
      const supabase = createClient(url, key, {
        auth: { autoRefreshToken: false, persistSession: false },
      });

      const { count: serverCount } = await supabase
        .from("mcp_servers")
        .select("*", { count: "exact", head: true });

      const { count: agentCount } = await supabase
        .from("agents")
        .select("*", { count: "exact", head: true });

      checks.database = {
        status: "healthy",
        latency_ms: Date.now() - dbStart,
      };

      const healthy = Object.values(checks).every(
        (c) => c.status === "healthy"
      );

      return NextResponse.json(
        {
          status: healthy ? "healthy" : "degraded",
          version: "1.0.0",
          uptime_seconds: Math.floor(process.uptime()),
          checks,
          stats: {
            mcp_servers: serverCount ?? 0,
            registered_agents: agentCount ?? 0,
          },
          response_ms: Date.now() - start,
        },
        { status: healthy ? 200 : 503 }
      );
    }
  } catch (err) {
    checks.database = {
      status: "unhealthy",
      latency_ms: Date.now() - dbStart,
    };
  }

  return NextResponse.json(
    {
      status: "degraded",
      version: "1.0.0",
      uptime_seconds: Math.floor(process.uptime()),
      checks,
      response_ms: Date.now() - start,
    },
    { status: 503 }
  );
}
