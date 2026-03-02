import type { McpServer } from "@agent-hub/db";

interface ProxyResult {
  success: boolean;
  data: Record<string, unknown>;
  response_ms: number;
  placeholder: boolean;
}

export async function proxyMcpCall(
  server: McpServer,
  toolName: string,
  input: Record<string, unknown>
): Promise<ProxyResult> {
  const startTime = Date.now();

  // If server has a real endpoint, forward the request
  if (server.endpoint_url) {
    try {
      const response = await fetch(`${server.endpoint_url}/call`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool: toolName, input }),
        signal: AbortSignal.timeout(30000),
      });

      const data = await response.json();
      return {
        success: response.ok,
        data,
        response_ms: Date.now() - startTime,
        placeholder: false,
      };
    } catch {
      return {
        success: false,
        data: { error: "Server unreachable" },
        response_ms: Date.now() - startTime,
        placeholder: false,
      };
    }
  }

  // Placeholder response for servers without endpoints
  await new Promise((r) => setTimeout(r, 50 + Math.random() * 150));
  return {
    success: true,
    data: {
      placeholder: true,
      server: server.name,
      tool: toolName,
      input_received: input,
      message: `This is a placeholder response from ${server.name}/${toolName}. Connect a real MCP server endpoint to get actual results.`,
      mock_result: generateMockResult(server.slug, toolName, input),
    },
    response_ms: Date.now() - startTime,
    placeholder: true,
  };
}

function generateMockResult(
  _serverSlug: string,
  toolName: string,
  _input: Record<string, unknown>
): Record<string, unknown> {
  // Generic mock based on tool name patterns
  if (toolName.includes("validate")) {
    return { valid: true, issues: [], score: 0.95 };
  }
  if (toolName.includes("convert") || toolName.includes("translate")) {
    return { converted: true, format: "output", confidence: 0.92 };
  }
  if (toolName.includes("analyze") || toolName.includes("review")) {
    return {
      analysis: "Completed",
      risk_level: "low",
      recommendations: ["No action needed"],
    };
  }
  if (toolName.includes("generate")) {
    return { generated: true, url: "https://example.com/output" };
  }
  return { status: "ok", processed: true };
}
