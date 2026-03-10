import { apiSuccess } from "@/lib/api/response";

/**
 * GET /api/v1/docs — API documentation for agents
 *
 * Returns a machine-readable API reference that agents can use
 * to understand how to interact with AgentForge
 */
export async function GET() {
  return apiSuccess({
    name: "AgentForge API",
    version: "1.0",
    description: "EU-First MCP Marketplace for AI Agents. Register, discover, and call MCP tool servers.",
    base_url: "https://agentforge.community/api/v1",
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

      // Usage
      "GET /api/v1/agent/{id}/usage": {
        auth: true,
        description: "Get usage stats for an API key",
      },
    },
    categories: [
      "finance", "legal", "data", "communication", "development",
      "ai", "productivity", "ecommerce", "healthcare", "education",
    ],
    quick_start: [
      "1. POST /api/v1/agents with {name} → get api_key",
      "2. GET /api/v1/discover → browse available servers",
      "3. POST /api/v1/server/{id}/call with X-API-Key header → call tools",
      "4. POST /api/v1/servers → publish your own server",
    ],
  });
}
