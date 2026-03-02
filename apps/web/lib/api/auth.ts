import { type NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

export interface ValidatedKey {
  id: string;
  owner_id: string;
  name: string;
  monthly_limit: number;
  calls_this_month: number;
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

export async function validateApiKey(
  request: NextRequest
): Promise<ValidatedKey | null> {
  const apiKey = request.headers.get("X-API-Key");
  if (!apiKey || !apiKey.startsWith("af_")) return null;

  const supabase = getServiceClient();
  if (!supabase) return null;

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
  };
}

export function isRateLimited(key: ValidatedKey): boolean {
  return key.calls_this_month >= key.monthly_limit;
}
