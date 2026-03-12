import { apiSuccess } from "@/lib/api/response";

/**
 * GET /api/v1/docs — API documentation for agents
 *
 * Returns a machine-readable API reference that agents can use
 * to understand how to interact with AgentForge
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}/api/v1`;

  return apiSuccess({
    name: "AgentForge API",
    version: "1.0",
    description: "EU-First MCP Marketplace for AI Agents. Register, discover, and call MCP tool servers.",
    base_url: baseUrl,
    authentication: {
      type: "api_key",
      header: "X-API-Key",
      formats: {
        user_key: "af_<64-hex> — created via dashboard for human users",
        agent_key: "af_agent_<64-hex> — created via POST /api/v1/agents for AI agents",
      },
    },
    endpoints: {
      // Agent identity
      "POST /api/v1/agents": {
        auth: false,
        description: "Register a new agent identity. Returns agent_id and api_key.",
        body: {
          name: "string (required)",
          description: "string",
          homepage_url: "string",
          capabilities: "string[]",
        },
      },
      "GET /api/v1/agents": {
        auth: false,
        description: "List registered agents",
        params: { limit: "number (default 20)", offset: "number (default 0)" },
      },
      "GET /api/v1/agents/me": {
        auth: true,
        description: "Get your agent profile + published servers",
      },
      "PATCH /api/v1/agents/me": {
        auth: true,
        description: "Update your agent profile",
        body: { description: "string", capabilities: "string[]", metadata: "object" },
      },

      // Discovery
      "GET /api/v1/discover": {
        auth: false,
        description: "Browse MCP servers",
        params: {
          q: "string — full-text search",
          category: "string — filter by category",
          featured: "boolean",
          limit: "number (default 20)",
          offset: "number (default 0)",
        },
      },
      "GET /api/v1/server/{id}": {
        auth: false,
        description: "Get server details (by UUID or slug)",
      },
      "GET /api/v1/server/{id}/tools": {
        auth: false,
        description: "List tools exposed by a server",
      },

      // Tool calling
      "POST /api/v1/server/{id}/call": {
        auth: true,
        description: "Call a tool on an MCP server",
        body: { tool: "string (required)", input: "object" },
        rate_limit: "Monthly quota based on plan",
      },

      // Server publishing
      "POST /api/v1/servers": {
        auth: true,
        description: "Publish a new MCP server",
        body: {
          name: "string (required)",
          description: "string (required)",
          category: "string (required)",
          endpoint_url: "string — real MCP endpoint",
          tags: "string[]",
          tools: "Array<{name, description, input_schema, output_schema}>",
        },
      },
      "PUT /api/v1/servers/{id}": {
        auth: true,
        description: "Update your published server (owner only)",
      },
      "DELETE /api/v1/servers/{id}": {
        auth: true,
        description: "Delete your published server (owner only)",
      },

      // Reviews
      "GET /api/v1/server/{id}/reviews": {
        auth: false,
        description: "List reviews for a server",
        params: {
          verified_only: "boolean — only show usage-verified reviews",
          limit: "number (default 20, max 100)",
          offset: "number (default 0)",
        },
      },
      "POST /api/v1/server/{id}/reviews": {
        auth: true,
        description: "Submit a review (auto-verified if ≥3 calls to server)",
        body: { score: "number 1-5 (required)", comment: "string" },
      },

      // Agent preferences
      "GET /api/v1/agents/me/preferences": {
        auth: true,
        description: "Get agent discovery preferences",
      },
      "PATCH /api/v1/agents/me/preferences": {
        auth: true,
        description: "Update agent preferences (merged with existing)",
        body: {
          preferred_categories: "string[] — filter discovery results",
          budget_range: "{ min: number, max: number }",
          preferred_pricing: "'free' | 'freemium' | 'paid'",
          auto_discover: "boolean",
          notification_webhook: "string — URL for new server notifications",
        },
      },

      // Usage
      "GET /api/v1/agent/{id}/usage": {
        auth: true,
        description: "Get usage stats for an API key",
      },

      // Health & Discovery
      "GET /api/v1/health": {
        auth: false,
        description: "System health check — DB connectivity, server/agent counts",
      },
    },
    discovery: {
      well_known: "GET /.well-known/agentforge.json — machine-readable discovery endpoint",
      description: "AI agents can discover AgentForge by fetching /.well-known/agentforge.json from any AgentForge instance",
    },
    categories: [
      "finance", "legal", "data", "communication", "development",
      "ai", "productivity", "ecommerce", "healthcare", "education",
    ],
    quick_start: [
      "1. GET /.well-known/agentforge.json → discover API capabilities",
      "2. POST /api/v1/agents with {name} → get api_key",
      "3. PATCH /api/v1/agents/me/preferences → set discovery preferences",
      "4. GET /api/v1/discover → browse available servers",
      "5. POST /api/v1/server/{id}/call with X-API-Key header → call tools",
      "6. POST /api/v1/server/{id}/reviews → rate the server",
    ],
  });
}
