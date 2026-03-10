import { type NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

export interface ValidatedKey {
  id: string;
  owner_id: string;
  name: string;
  monthly_limit: number;
  calls_this_month: number;
  // Distinguish between user keys and agent keys
  type: "user_key" | "agent";
  agent_id?: string;
}

// Service-role client for API key validation (no user session needed)
function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) return null;

  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

/**
 * Validate API key — checks both agent_keys (user keys) and agents table.
 * Supports:
 *   - af_<hex>       → user-created key (agent_keys table)
 *   - af_agent_<hex> → agent identity key (agents table)
 */
export async function validateApiKey(
  request: NextRequest
): Promise<ValidatedKey | null> {
  const apiKey = request.headers.get("X-API-Key");
  if (!apiKey || !apiKey.startsWith("af_")) return null;

  const supabase = getServiceClient();
  if (!supabase) return null;

  // Check agent identity keys first (af_agent_*)
  if (apiKey.startsWith("af_agent_")) {
    const { data: agent, error } = await supabase
      .from("agents")
      .select("id, owner_id, name, monthly_limit, calls_this_month, is_active")
      .eq("api_key", apiKey)
      .single();

    if (!error && agent && agent.is_active) {
      return {
        id: agent.id,
        owner_id: agent.owner_id ?? agent.id,
        name: agent.name,
        monthly_limit: agent.monthly_limit ?? 1000,
        calls_this_month: agent.calls_this_month ?? 0,
        type: "agent",
        agent_id: agent.id,
      };
    }
  }

  // Fallback to user-created keys (agent_keys table)
  const { data: key, error } = await supabase
    .from("agent_keys")
    .select("id, owner_id, name, monthly_limit, calls_this_month, is_active")
    .eq("api_key", apiKey)
    .single();

  if (error || !key || !key.is_active) return null;

  return {
    id: key.id,
    owner_id: key.owner_id,
    name: key.name,
    monthly_limit: key.monthly_limit ?? 100,
    calls_this_month: key.calls_this_month ?? 0,
    type: "user_key",
  };
}

export function isRateLimited(key: ValidatedKey): boolean {
  return key.calls_this_month >= key.monthly_limit;
}
