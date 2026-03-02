-- AgentForge.eu — Initial Schema
-- MCP Server Marketplace for AI Agents

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ============================================================
-- MCP Servers — the products listed on the marketplace
-- ============================================================
create table mcp_servers (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  name text not null,
  description text not null,
  long_description text,
  category text not null,
  icon_url text,
  endpoint_url text, -- actual MCP server URL (null = placeholder)
  owner_id uuid references auth.users(id),

  -- Pricing
  pricing_model text not null default 'freemium', -- free, freemium, paid
  price_monthly numeric(10,2) default 0,
  free_tier_calls integer default 100,

  -- Trust & Quality
  trust_score numeric(3,1) default 5.0, -- 0.0 - 10.0
  is_verified boolean default false,
  is_featured boolean default false,

  -- Stats (denormalized for fast reads)
  total_tools integer default 0,
  total_calls bigint default 0,
  avg_response_ms integer default 0,
  uptime_percent numeric(5,2) default 99.9,

  -- Metadata
  version text default '1.0.0',
  tags text[] default '{}',
  documentation_url text,
  source_url text,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_mcp_servers_slug on mcp_servers(slug);
create index idx_mcp_servers_category on mcp_servers(category);
create index idx_mcp_servers_featured on mcp_servers(is_featured) where is_featured = true;
create index idx_mcp_servers_trust on mcp_servers(trust_score desc);

-- ============================================================
-- MCP Tools — individual tools exposed by each server
-- ============================================================
create table mcp_tools (
  id uuid primary key default uuid_generate_v4(),
  server_id uuid not null references mcp_servers(id) on delete cascade,
  name text not null,
  description text not null,

  -- Schemas (JSON Schema format)
  input_schema jsonb default '{}',
  output_schema jsonb default '{}',

  -- Example call
  example_input jsonb,
  example_output jsonb,

  -- Metadata
  is_active boolean default true,
  avg_response_ms integer default 0,

  created_at timestamptz default now(),
  updated_at timestamptz default now(),

  unique(server_id, name)
);

create index idx_mcp_tools_server on mcp_tools(server_id);

-- ============================================================
-- Agent Keys — API keys for agent authentication
-- ============================================================
create table agent_keys (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  api_key text unique not null, -- format: af_<32 hex chars>
  name text not null,

  -- Limits
  monthly_limit integer default 100,
  calls_this_month integer default 0,

  -- Status
  is_active boolean default true,
  last_used_at timestamptz,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create unique index idx_agent_keys_api_key on agent_keys(api_key);
create index idx_agent_keys_owner on agent_keys(owner_id);

-- ============================================================
-- Usage Logs — every API call through the marketplace
-- ============================================================
create table usage_logs (
  id uuid primary key default uuid_generate_v4(),
  agent_key_id uuid not null references agent_keys(id),
  server_id uuid not null references mcp_servers(id),
  tool_name text not null,

  -- Request / Response
  status_code integer not null default 200,
  response_ms integer,
  request_tokens integer default 0,
  response_tokens integer default 0,

  -- Billing
  cost_credits numeric(10,4) default 0,

  created_at timestamptz default now()
);

create index idx_usage_logs_key on usage_logs(agent_key_id);
create index idx_usage_logs_server on usage_logs(server_id);
create index idx_usage_logs_created on usage_logs(created_at desc);

-- ============================================================
-- Ratings — user reviews of MCP servers
-- ============================================================
create table ratings (
  id uuid primary key default uuid_generate_v4(),
  server_id uuid not null references mcp_servers(id) on delete cascade,
  user_id uuid not null references auth.users(id),

  score integer not null check (score >= 1 and score <= 5),
  comment text,

  created_at timestamptz default now(),
  updated_at timestamptz default now(),

  unique(server_id, user_id) -- one review per user per server
);

create index idx_ratings_server on ratings(server_id);

-- ============================================================
-- RLS Policies
-- ============================================================

-- MCP Servers: public read, owner write
alter table mcp_servers enable row level security;

create policy "Anyone can view servers"
  on mcp_servers for select
  using (true);

create policy "Owners can update their servers"
  on mcp_servers for update
  using (auth.uid() = owner_id);

create policy "Authenticated users can insert servers"
  on mcp_servers for insert
  with check (auth.uid() = owner_id);

-- MCP Tools: public read
alter table mcp_tools enable row level security;

create policy "Anyone can view tools"
  on mcp_tools for select
  using (true);

-- Agent Keys: owner only
alter table agent_keys enable row level security;

create policy "Owners can view their keys"
  on agent_keys for select
  using (auth.uid() = owner_id);

create policy "Owners can create keys"
  on agent_keys for insert
  with check (auth.uid() = owner_id);

create policy "Owners can update their keys"
  on agent_keys for update
  using (auth.uid() = owner_id);

create policy "Owners can delete their keys"
  on agent_keys for delete
  using (auth.uid() = owner_id);

-- Usage Logs: owner only (through agent key)
alter table usage_logs enable row level security;

create policy "Key owners can view usage"
  on usage_logs for select
  using (
    agent_key_id in (
      select id from agent_keys where owner_id = auth.uid()
    )
  );

-- Ratings: public read, auth write
alter table ratings enable row level security;

create policy "Anyone can view ratings"
  on ratings for select
  using (true);

create policy "Authenticated users can rate"
  on ratings for insert
  with check (auth.uid() = user_id);

create policy "Users can update own ratings"
  on ratings for update
  using (auth.uid() = user_id);

-- ============================================================
-- Auto-update timestamps
-- ============================================================
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger mcp_servers_updated_at
  before update on mcp_servers
  for each row execute function update_updated_at();

create trigger mcp_tools_updated_at
  before update on mcp_tools
  for each row execute function update_updated_at();

create trigger agent_keys_updated_at
  before update on agent_keys
  for each row execute function update_updated_at();

create trigger ratings_updated_at
  before update on ratings
  for each row execute function update_updated_at();

-- ============================================================
-- Monthly reset function for agent key call counters
-- ============================================================
create or replace function reset_monthly_counters()
returns void as $$
begin
  update agent_keys set calls_this_month = 0;
end;
$$ language plpgsql security definer;
