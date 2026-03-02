import { type NextRequest } from "next/server";

// Demo agent key for development
const DEMO_KEYS = new Map([
  [
    "af_demo_key_0123456789abcdef0123456789abcdef",
    {
      id: "key-001",
      owner_id: "demo-user",
      name: "Demo Key",
      monthly_limit: 100,
      calls_this_month: 0,
      is_active: true,
    },
  ],
]);

export interface ValidatedKey {
  id: string;
  owner_id: string;
  name: string;
  monthly_limit: number;
  calls_this_month: number;
}

export function validateApiKey(
  request: NextRequest
): ValidatedKey | null {
  const apiKey = request.headers.get("X-API-Key");
  if (!apiKey) return null;

  // Check demo keys first (for development)
  const demoKey = DEMO_KEYS.get(apiKey);
  if (demoKey) return demoKey;

  // TODO: In production, check Supabase agent_keys table
  return null;
}

export function isRateLimited(key: ValidatedKey): boolean {
  return key.calls_this_month >= key.monthly_limit;
}
