# AgentForge — MCP Marketplace for AI Agents

## Stack
- **Monorepo**: Turborepo + pnpm
- **Frontend**: Next.js 15, React 19, Tailwind 4, shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, RLS), Next.js API routes
- **i18n**: next-intl (en, cs, de, sk)
- **Deploy**: Vercel
- **CLI**: `agentforge` NPM package (packages/cli)

## Key Directories
- `apps/web/` — Main Next.js app
- `packages/db/` — Database types, queries, migrations
- `packages/cli/` — AgentForge CLI (auth, discover, call, search, products)
- `packages/ui/` — Shared UI components
- `packages/mcp/` — MCP SDK (Phase 3)

## API Architecture (Agent-First)
- `POST /api/v1/agents` — Agent self-registration (no auth)
- `GET /api/v1/agents/me` — Agent profile + preferences (agent key auth)
- `PATCH /api/v1/agents/me/preferences` — Update discovery preferences (agent key auth)
- `GET /api/v1/agents/recommendations` — Personalized server recommendations (agent key auth)
- `GET /api/v1/discover` — Browse MCP servers with full-text search (no auth)
- `POST /api/v1/search/broadcast` — Multi-server search in one call (API key auth)
- `GET /api/v1/server/{id}/capabilities` — Full server capabilities + pricing (no auth)
- `POST /api/v1/server/{id}/call` — Call tool with X-Cost-Per-Call headers (API key auth)
- `GET /api/v1/server/{id}/reviews` — Server reviews (no auth)
- `POST /api/v1/server/{id}/reviews` — Submit review, auto-verified by usage (API key auth)
- `GET /api/v1/products` — Cross-server product search (no auth)
- `GET /api/v1/server/{id}/products` — Per-server products (no auth)
- `POST /api/v1/server/{id}/products` — Publish products (owner auth)
- `POST /api/v1/purchase/request` — Consent flow purchase request (API key auth)
- `GET /api/v1/purchase/{id}/status` — Purchase status (API key auth)
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
cd packages/cli && pnpm build  # build CLI
```

## Database
Migrations in `packages/db/migrations/` (001-012). Apply via Supabase dashboard or CLI.
Service role client bypasses RLS for API routes.
Key tables: mcp_servers, mcp_tools, agents, agent_keys, agent_reviews, usage_logs, subscriptions, ratings, product_listings, purchase_requests, broadcast_queries.
Full-text search via tsvector on mcp_servers + product_listings.
Views: server_review_summary (avg scores, verified counts).
RPCs: search_servers, search_products, verify_agent_review, expire_purchase_requests.
