import { createClient } from "@supabase/supabase-js";

export type Plan = "free" | "pro" | "enterprise";

export interface Subscription {
  plan: Plan;
  status: string;
  current_period_end: string | null;
  stripe_customer_id: string | null;
}

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error("Missing Supabase service credentials");
  }

  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

/**
 * Fetch a user's subscription record. Returns a default free-tier
 * subscription object when no row exists in the database.
 */
export async function getUserSubscription(
  userId: string
): Promise<Subscription> {
  const supabase = getServiceClient();

  const { data, error } = await supabase
    .from("subscriptions")
    .select("plan, status, current_period_end, stripe_customer_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch subscription:", error.message);
  }

  if (!data) {
    return {
      plan: "free",
      status: "active",
      current_period_end: null,
      stripe_customer_id: null,
    };
  }

  return {
    plan: data.plan as Plan,
    status: data.status,
    current_period_end: data.current_period_end,
    stripe_customer_id: data.stripe_customer_id,
  };
}

/**
 * Plan-based limits used throughout the application for enforcing
 * quotas on API calls, keys, and server registrations.
 */
export function getPlanLimits(plan: Plan) {
  const limits = {
    free: { monthly_calls: 100, max_keys: 1, max_servers: 3 },
    pro: { monthly_calls: 10_000, max_keys: 10, max_servers: 50 },
    enterprise: { monthly_calls: 999_999, max_keys: 100, max_servers: 999 },
  };
  return limits[plan];
}
