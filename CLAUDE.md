# AgentForge.eu — MCP Marketplace for AI Agents

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
- `GET /api/v1/agents/me` — Agent profile (agent key auth)
- `GET /api/v1/discover` — Browse MCP servers (no auth)
- `POST /api/v1/server/{id}/call` — Call tool (API key auth)
- `POST /api/v1/servers` — Publish server (API key auth)
- `GET /api/v1/docs` — Machine-readable API docs

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
Migrations in `packages/db/migrations/`. Apply via Supabase dashboard or CLI.
Service role client bypasses RLS for API routes.
