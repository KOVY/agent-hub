import { type NextRequest } from "next/server";
import { apiError } from "@/lib/api/response";
import { validateApiKey } from "@/lib/api/auth";
import {
  checkRateLimit,
  incrementRateLimit,
  getRateLimitHeaders,
} from "@/lib/api/rate-limit";
import { proxyMcpCall } from "@/lib/api/proxy";
import { MOCK_SERVERS } from "@/lib/mock-data";
import { NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // 1. Authenticate
  const key = validateApiKey(request);
  if (!key) {
    return apiError("Missing or invalid API key. Set X-API-Key header.", 401);
  }

  // 2. Rate limit
  const rateCheck = checkRateLimit(key.id, key.monthly_limit);
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

  // 3. Find server
  const server = MOCK_SERVERS.find(
    (s) => s.id === id || s.slug === id
  );
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

  // 6. Increment rate limit
  incrementRateLimit(key.id);
  const updatedRate = checkRateLimit(key.id, key.monthly_limit);

  // 7. Return response with rate limit headers
  const headers = getRateLimitHeaders(
    key.monthly_limit,
    updatedRate.remaining
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
