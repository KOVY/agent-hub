-- AgentForge.eu — Agent Identity & Server Publishing
-- Agent-first API: agents register, get identity, discover & publish servers
-- Inspired by Karpathy's AgentHub agent-first design

-- ============================================================
-- Agents — AI agent identities
-- ============================================================
create table if not exists agents (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  description text,
  homepage_url text,
  capabilities text[] default '{}',

  -- Owner (optional — if registered by a logged-in user via dashboard)
  owner_id uuid references auth.users(id) on delete set null,

  -- API key (auto-generated on registration)
  api_key text unique not null, -- format: af_agent_<hex>

  -- Limits & usage
  monthly_limit integer default 1000,
  calls_this_month integer default 0,

  -- Status
  is_active boolean default true,
  is_verified boolean default false,
  last_seen_at timestamptz,

  -- Arbitrary metadata (capabilities, preferences, config)
  metadata jsonb default '{}',

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create unique index if not exists idx_agents_slug on agents(slug);
create unique index if not exists idx_agents_api_key on agents(api_key);
create index if not exists idx_agents_owner on agents(owner_id);

-- Auto-update timestamps
create trigger agents_updated_at
  before update on agents
  for each row execute function update_updated_at();

-- RLS: public read, owner management, service role for API registration
alter table agents enable row level security;

create policy "Anyone can view agent profiles"
  on agents for select
  using (true);

create policy "Owners can update their agents"
  on agents for update
  using (auth.uid() = owner_id);

create policy "Owners can delete their agents"
  on agents for delete
  using (auth.uid() = owner_id);

-- Note: INSERT for anonymous agent self-registration goes through
-- service role client (bypasses RLS) in the API route.
-- User-created agents go through dashboard with auth.uid() = owner_id.
create policy "Authenticated users can create agents"
  on agents for insert
  with check (owner_id is null or auth.uid() = owner_id);

-- ============================================================
-- Extend mcp_servers: agent_id for agent-published servers
-- ============================================================
alter table mcp_servers
  add column if not exists agent_id uuid references agents(id) on delete set null;

create index if not exists idx_mcp_servers_agent on mcp_servers(agent_id);

-- ============================================================
-- Extend mcp_tools: allow server owners to manage tools
-- ============================================================
create policy "Server owners can insert tools"
  on mcp_tools for insert
  with check (
    server_id in (
      select id from mcp_servers where owner_id = auth.uid()
    )
  );

create policy "Server owners can update tools"
  on mcp_tools for update
  using (
    server_id in (
      select id from mcp_servers where owner_id = auth.uid()
    )
  );

create policy "Server owners can delete tools"
  on mcp_tools for delete
  using (
    server_id in (
      select id from mcp_servers where owner_id = auth.uid()
    )
  );

-- ============================================================
-- RPC: increment agent calls (mirrors increment_calls for keys)
-- ============================================================
create or replace function increment_agent_calls(p_agent_id uuid)
returns void as $$
begin
  update agents
  set calls_this_month = calls_this_month + 1,
      last_seen_at = now()
  where id = p_agent_id;
end;
$$ language plpgsql security definer;

-- ============================================================
-- RPC: reset monthly counters for agents
-- ============================================================
create or replace function reset_agent_monthly_counters()
returns void as $$
begin
  update agents set calls_this_month = 0;
end;
$$ language plpgsql security definer;
