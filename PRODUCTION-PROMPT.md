# AgentForge.eu — Production Readiness Prompt

## Pro Claude Code CLI session v /home/kovy/Agent-Hub

```
Pracuješ v monorepu AgentForge.eu — MCP skill marketplace pro AI agenty.
Apka běží na Vercelu: https://agent-hub-web-gamma.vercel.app/en
Repo: /home/kovy/Agent-Hub (Turborepo + pnpm)
Stack: Next.js 15, Supabase (PostgreSQL + Auth), Tailwind 4, shadcn/ui, next-intl (CZ/EN)

## Aktuální stav
- Landing page, registry, server detail, pricing, dashboard, auth — vše funkční
- Supabase DB se schématem (mcp_servers, mcp_tools, agent_keys, usage_logs, ratings)
- REST API: /api/v1/discover, /api/v1/server/[id], /api/v1/server/[id]/call, /api/v1/server/[id]/tools
- API key auth + rate limiting (monthly quotas)
- Mock data fallback (10 KOWEX serverů) — Supabase se připojuje ale pravděpodobně nemá seed data
- MCP proxy: server.endpoint_url → forward; null → placeholder response
- Git: 10 commitů, origin https://github.com/KOVY/agent-hub.git

## Co chybí k produkci (udělej tohle):

### 1. SELF-REGISTRATION FLOW (kritické!)
Firmy/vývojáři musí mít možnost SAMI registrovat své MCP servery:
- Formulář na /dashboard/publish (nebo /dashboard/servers/new)
- Pole: name, slug (auto-generate), description, category, tags, endpoint_url, pricing_model, documentation_url
- Validace: unique slug, platný endpoint_url (pokud zadán), povinné pole
- Po submitu: INSERT do mcp_servers s owner_id = přihlášený uživatel
- Na dashboardu: seznam "My Servers" s edit/delete
- Přidat stránku /dashboard/servers/[id]/edit

### 2. MCP SERVER VALIDATION
Když uživatel zadá endpoint_url, ověř že je to skutečný MCP server:
- Zavolej GET endpoint_url (nebo endpoint_url/list-tools) a parsuj odpověď
- Pokud vrátí validní MCP tool list → automaticky naplň mcp_tools tabulku
- Přidej tlačítko "Refresh Tools" na server detail
- Přidej packages/mcp/src/index.ts — implementuj MCP discovery client

### 3. REAL SEED DATA (nahraď mock)
Vytvoř SQL migraci 004_seed_real_servers.sql s reálnými MCP servery:
- filesystem (modelcontextprotocol/servers) — reference MCP server
- brave-search — web search
- github — GitHub API
- slack — Slack integration  
- postgres — database queries
- Nastav endpoint_url na null (placeholder) ale reálné popisy a tool seznamy
- Přidej alespoň 15 reálných serverů z https://github.com/modelcontextprotocol/servers

### 4. PUBLISH API (pro CLI/agenty)
- POST /api/v1/servers — publish nový server (auth via API key)
- PUT /api/v1/servers/[id] — update server
- DELETE /api/v1/servers/[id] — smazat (soft delete)
- Toto umožní agentům programaticky registrovat servery

### 5. SEARCH VYLEPŠENÍ
- Full-text search přes Supabase (pg_trgm nebo ts_vector)
- Filtr podle pricing_model (free/freemium/paid)
- Filtr podle is_verified
- Sort by: trust_score, total_calls, newest, price
- Přidat na /registry stránku

### 6. SERVER DETAIL VYLEPŠENÍ
- Zobrazit reálné tools (ne jen počet) — už máš ToolCard komponentu
- "Try it" — formulář pro testování tool callu přímo z UI (pokud má uživatel API key)
- Install snippet: zobrazit jak přidat server do OpenClaw/Claude config
  ```json
  // claude_desktop_config.json
  { "mcpServers": { "server-name": { "url": "https://agentforge.eu/api/v1/server/ID/call" } } }
  ```
- Rating/review formulář (pokud přihlášen)

### 7. DOMAIN + BRANDING
- Přidat do next.config.js: domény pro obrázky, OG tags
- Metadata: "AgentForge.eu — EU MCP Marketplace for AI Agents"
- Favicon a OG image s AgentForge logem (použij existující /api/og route)
- Přidat sitemap.xml a robots.txt pro SEO

### 8. DASHBOARD VYLEPŠENÍ
- /dashboard — přehled: moje servery, moje API klíče, usage graf
- /dashboard/servers — seznam mých serverů + tlačítko "Publish New"
- /dashboard/usage — usage graf (chart.js nebo recharts) 
- /dashboard/keys — už existuje, OK

## Pravidla:
- Používej EXISTUJÍCÍ stack (Supabase, Fastify routes v Next.js, Drizzle types)
- Nepřidávej nové DB technologie — zůstaň u Supabase PostgreSQL
- Zachovej mock data fallback pro dev (ale přidej real seed pro Supabase)
- Zachovej CZ/EN lokalizaci (next-intl) — přidej překlady pro nové stránky
- Commituj logicky po feature (ne jeden mega commit)
- Po dokončení spusť `pnpm build` a ověř že buildí bez chyb
```

## Spuštění

```bash
cd /home/kovy/Agent-Hub
claude --print --permission-mode bypassPermissions "$(cat PRODUCTION-PROMPT.md)"
```
