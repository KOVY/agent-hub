import { type NextRequest } from "next/server";
import { apiSuccess, apiError } from "@/lib/api/response";
import { validateApiKey } from "@/lib/api/auth";
import { checkRateLimit } from "@/lib/api/rate-limit";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: _agentId } = await params;

  const key = validateApiKey(request);
  if (!key) {
    return apiError("Missing or invalid API key", 401);
  }

  const rateCheck = checkRateLimit(key.id, key.monthly_limit);

  return apiSuccess({
    key_name: key.name,
    monthly_limit: key.monthly_limit,
    calls_used: rateCheck.used,
    calls_remaining: rateCheck.remaining,
    usage_percent: Math.round(
      (rateCheck.used / key.monthly_limit) * 100
    ),
  });
}
