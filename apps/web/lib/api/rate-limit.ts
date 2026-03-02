// In-memory rate limiting for demo
// Production: use Supabase agent_keys.calls_this_month

const callCounts = new Map<string, number>();

export function checkRateLimit(
  keyId: string,
  monthlyLimit: number
): { allowed: boolean; remaining: number; used: number } {
  const current = callCounts.get(keyId) ?? 0;
  const remaining = Math.max(0, monthlyLimit - current);

  return {
    allowed: current < monthlyLimit,
    remaining,
    used: current,
  };
}

export function incrementRateLimit(keyId: string): void {
  const current = callCounts.get(keyId) ?? 0;
  callCounts.set(keyId, current + 1);
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
