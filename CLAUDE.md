# AgentForge — MCP Marketplace for AI Agents

## Stack
- **Monorepo**: Turborepo + pnpm
- **Frontend**: Next.js 15, React 19, Tailwind 4, shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, RLS), Next.js API routes
- **i18n**: next-intl (en, cs, de, sk)
- **Deploy**: Vercel

## Key Directories
- `apps/web/` — Main Next.js app
- `packages/db/` — Database types, queries, migrations
- `packages/ui/` — Shared UI components
- `packages/mcp/` — MCP SDK (Phase 3)

## API Architecture (Agent-First)
- `POST /api/v1/agents` — Agent self-registration (no auth)
- `GET /api/v1/agents/me` — Agent profile + preferences (agent key auth)
- `PATCH /api/v1/agents/me/preferences` — Update discovery preferences (agent key auth)
- `GET /api/v1/discover` — Browse MCP servers with full-text search (no auth)
- `POST /api/v1/server/{id}/call` — Call tool (API key auth)
- `GET /api/v1/server/{id}/reviews` — Server reviews (no auth)
- `POST /api/v1/server/{id}/reviews` — Submit review, auto-verified by usage (API key auth)
- `POST /api/v1/servers` — Publish server (API key auth)
- `GET /api/v1/health` — System health check (no auth)
- `GET /api/v1/docs` — Machine-readable API docs
- `GET /.well-known/agentforge.json` — Agent discovery standard

## Auth
Two types of API keys:
- `af_<hex>` — User-created keys (agent_keys table, via dashboard)
- `af_agent_<hex>` — Agent identity keys (agents table, via API)

Both work for all authenticated endpoints via `validateApiKey()`.

## Development
```bash
pnpm install
pnpm dev        # starts Next.js dev server
pnpm build      # production build
```

## Database
Migrations in `packages/db/migrations/` (001-009). Apply via Supabase dashboard or CLI.
Service role client bypasses RLS for API routes.
Key tables: mcp_servers, mcp_tools, agents, agent_keys, agent_reviews, usage_logs, subscriptions, ratings.
Full-text search via tsvector on mcp_servers (name A, description B, tags C, category D).
Views: server_review_summary (avg scores, verified counts).
