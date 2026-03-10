import { type NextRequest } from "next/server";
import { apiError } from "@/lib/api/response";
import { validateApiKey } from "@/lib/api/auth";
import {
  checkRateLimit,
  recordUsage,
  getRateLimitHeaders,
} from "@/lib/api/rate-limit";
import { proxyMcpCall } from "@/lib/api/proxy";
import { fetchServerByIdOrSlug } from "@/lib/data";
import { NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // 1. Authenticate via Supabase agent_keys
  const key = await validateApiKey(request);
  if (!key) {
    return apiError("Missing or invalid API key. Set X-API-Key header.", 401);
  }

  // 2. Rate limit check (DB-backed)
  const rateCheck = checkRateLimit(key.calls_this_month, key.monthly_limit);
  if (!rateCheck.allowed) {
    const headers = getRateLimitHeaders(key.monthly_limit, 0);
    return NextResponse.json(
      {
        success: false,
        data: null,
        error: `Rate limit exceeded. ${key.monthly_limit} calls/month on your plan. Resets ${headers["X-RateLimit-Reset"]}.`,
      },
      { status: 429, headers }
    );
  }

  // 3. Find server (from Supabase or mock)
  const server = await fetchServerByIdOrSlug(id);
  if (!server) {
    return apiError("Server not found", 404);
  }

  // 4. Parse request body
  let body: { tool: string; input?: Record<string, unknown> };
  try {
    body = await request.json();
  } catch {
    return apiError("Invalid JSON body. Expected: { tool: string, input: object }", 400);
  }

  if (!body.tool) {
    return apiError("Missing 'tool' field in request body", 400);
  }

  // 5. Forward to MCP server (or return placeholder)
  const result = await proxyMcpCall(
    server,
    body.tool,
    body.input ?? {}
  );

  // 6. Record usage in DB (increment counter + write log)
  await recordUsage(
    key.id,
    server.id,
    body.tool,
    result.response_ms,
    result.success,
    key.type
  );

  // 7. Return response with rate limit headers
  const headers = getRateLimitHeaders(
    key.monthly_limit,
    Math.max(0, rateCheck.remaining - 1)
  );

  return NextResponse.json(
    {
      success: result.success,
      data: result.data,
      meta: {
        server: server.name,
        tool: body.tool,
        response_ms: result.response_ms,
        placeholder: result.placeholder,
      },
      error: result.success ? null : "Tool execution failed",
    },
    { status: result.success ? 200 : 502, headers }
  );
}
