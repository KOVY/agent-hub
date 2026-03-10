import { createClient } from "@supabase/supabase-js";

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export function checkRateLimit(
  callsThisMonth: number,
  monthlyLimit: number
): { allowed: boolean; remaining: number; used: number } {
  const remaining = Math.max(0, monthlyLimit - callsThisMonth);
  return {
    allowed: callsThisMonth < monthlyLimit,
    remaining,
    used: callsThisMonth,
  };
}

/**
 * Increment calls_this_month and log usage.
 * Supports both user keys (agent_keys table) and agent keys (agents table).
 */
export async function recordUsage(
  keyId: string,
  serverId: string,
  toolName: string,
  responseMs: number,
  success: boolean,
  keyType: "user_key" | "agent" = "user_key"
): Promise<void> {
  const supabase = getServiceClient();
  if (!supabase) return;

  if (keyType === "agent") {
    // Increment on agents table
    const { error } = await supabase.rpc("increment_agent_calls", {
      p_agent_id: keyId,
    });
    if (error) {
      await supabase
        .from("agents")
        .update({ last_seen_at: new Date().toISOString() })
        .eq("id", keyId);
    }
  } else {
    // Increment on agent_keys table (original flow)
    const { error: rpcError } = await supabase.rpc("increment_calls", {
      key_id: keyId,
    });

    if (rpcError) {
      const { data } = await supabase
        .from("agent_keys")
        .select("calls_this_month")
        .eq("id", keyId)
        .single();

      if (data) {
        await supabase
          .from("agent_keys")
          .update({ calls_this_month: (data.calls_this_month ?? 0) + 1 })
          .eq("id", keyId);
      }
    }

    await supabase
      .from("agent_keys")
      .update({ last_used_at: new Date().toISOString() })
      .eq("id", keyId);
  }

  // Log to usage_logs (agent_key_id works for both — it's the caller ID)
  const { error: logError } = await supabase.from("usage_logs").insert({
    agent_key_id: keyId,
    server_id: serverId,
    tool_name: toolName,
    response_ms: responseMs,
    status_code: success ? 200 : 502,
  });

  if (logError) {
    console.error(
      "[usage_logs] Insert failed: " +
        JSON.stringify({
          code: logError.code,
          msg: logError.message,
          details: logError.details,
          hint: logError.hint,
          keyId,
          serverId,
          toolName,
          responseMs,
        })
    );
  }
}

export function getRateLimitHeaders(
  limit: number,
  remaining: number
): Record<string, string> {
  return {
    "X-RateLimit-Limit": String(limit),
    "X-RateLimit-Remaining": String(remaining),
    "X-RateLimit-Reset": getNextMonthReset(),
  };
}

function getNextMonthReset(): string {
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return nextMonth.toISOString();
}
