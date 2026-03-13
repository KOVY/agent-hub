import { NextResponse } from "next/server";

/**
 * GET /.well-known/agentforge.json — Discovery standard
 *
 * Allows AI agents to discover AgentForge capabilities
 * by fetching a well-known URL (similar to .well-known/openid-configuration).
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}`;

  return NextResponse.json(
    {
      name: "AgentForge",
      description:
        "EU-First MCP Marketplace — discover, connect, and use MCP tool servers",
      version: "1.0.0",
      operator: {
        name: "KOWEX Co. Holding",
        website: "https://kowexconsulting.cz",
        jurisdiction: "EU/CZ",
      },
      api: {
        base_url: `${baseUrl}/api/v1`,
        docs_url: `${baseUrl}/api/v1/docs`,
        health_url: `${baseUrl}/api/v1/health`,
      },
      capabilities: {
        agent_registration: true,
        server_discovery: true,
        tool_calling: true,
        server_publishing: true,
        agent_reviews: true,
        broadcast_search: true,
        product_listings: true,
        purchase_consent_flow: true,
        webmcp: true,
      },
      protocols: {
        mcp: {
          description: "Model Context Protocol — backend server tools (stdio/SSE)",
          discovery: `${baseUrl}/api/v1/discover`,
        },
        webmcp: {
          description: "Web MCP — client-side browser tools via navigator.modelContext (Chrome 146+)",
          discovery: `${baseUrl}/api/v1/webmcp/discover`,
          snippet_generator: `${baseUrl}/api/v1/webmcp/snippet`,
          spec: "https://github.com/webmachinelearning/webmcp",
        },
      },
      authentication: {
        type: "api_key",
        header: "X-API-Key",
        registration_endpoint: `${baseUrl}/api/v1/agents`,
        formats: {
          user_key: "af_<64-hex>",
          agent_key: "af_agent_<64-hex>",
        },
      },
      quick_start: [
        `POST ${baseUrl}/api/v1/agents with {"name":"my-agent"} → get api_key`,
        `GET ${baseUrl}/api/v1/discover → browse MCP servers`,
        `GET ${baseUrl}/api/v1/server/{id}/tools → list server tools`,
        `POST ${baseUrl}/api/v1/server/{id}/call with X-API-Key → call tools`,
      ],
      data_residency: "EU (Frankfurt, Germany)",
      gdpr_compliant: true,
      privacy_policy: `${baseUrl}/en/privacy`,
      terms_of_service: `${baseUrl}/en/terms`,
    },
    {
      headers: {
        "Cache-Control": "public, max-age=3600",
        "Access-Control-Allow-Origin": "*",
      },
    }
  );
}
