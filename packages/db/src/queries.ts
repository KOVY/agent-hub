import type { SupabaseClient } from "@supabase/supabase-js";
import type { McpServer, McpTool, AgentKey, UsageLog, Agent } from "./types";

// ============================================================
// MCP Servers
// ============================================================

export async function getServers(
  supabase: SupabaseClient,
  options?: {
    category?: string;
    search?: string;
    featured?: boolean;
    limit?: number;
    offset?: number;
  }
) {
  let query = supabase
    .from("mcp_servers")
    .select("*")
    .order("trust_score", { ascending: false });

  if (options?.category) {
    query = query.eq("category", options.category);
  }
  if (options?.search) {
    query = query.or(
      `name.ilike.%${options.search}%,description.ilike.%${options.search}%`
    );
  }
  if (options?.featured) {
    query = query.eq("is_featured", true);
  }
  if (options?.limit) {
    query = query.limit(options.limit);
  }
  if (options?.offset) {
    query = query.range(
      options.offset,
      options.offset + (options.limit || 10) - 1
    );
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as McpServer[];
}

export async function getServerBySlug(
  supabase: SupabaseClient,
  slug: string
) {
  const { data, error } = await supabase
    .from("mcp_servers")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) throw error;
  return data as McpServer;
}

export async function getServerById(
  supabase: SupabaseClient,
  id: string
) {
  const { data, error } = await supabase
    .from("mcp_servers")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as McpServer;
}

// ============================================================
// MCP Tools
// ============================================================

export async function getToolsByServerId(
  supabase: SupabaseClient,
  serverId: string
) {
  const { data, error } = await supabase
    .from("mcp_tools")
    .select("*")
    .eq("server_id", serverId)
    .eq("is_active", true)
    .order("name");

  if (error) throw error;
  return data as McpTool[];
}

// ============================================================
// Agent Keys
// ============================================================

export async function getAgentKeyByApiKey(
  supabase: SupabaseClient,
  apiKey: string
) {
  const { data, error } = await supabase
    .from("agent_keys")
    .select("*")
    .eq("api_key", apiKey)
    .eq("is_active", true)
    .single();

  if (error) return null;
  return data as AgentKey;
}

export async function getAgentKeysByOwner(
  supabase: SupabaseClient,
  ownerId: string
) {
  const { data, error } = await supabase
    .from("agent_keys")
    .select("*")
    .eq("owner_id", ownerId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as AgentKey[];
}

export async function createAgentKey(
  supabase: SupabaseClient,
  params: {
    owner_id: string;
    name: string;
    api_key: string;
    monthly_limit?: number;
  }
) {
  const { data, error } = await supabase
    .from("agent_keys")
    .insert({
      owner_id: params.owner_id,
      name: params.name,
      api_key: params.api_key,
      monthly_limit: params.monthly_limit ?? 100,
    })
    .select()
    .single();

  if (error) throw error;
  return data as AgentKey;
}

export async function incrementKeyUsage(
  supabase: SupabaseClient,
  keyId: string
) {
  const { error } = await supabase.rpc("increment_key_usage", {
    key_id: keyId,
  });
  // Fallback if RPC doesn't exist yet
  if (error) {
    await supabase
      .from("agent_keys")
      .update({
        last_used_at: new Date().toISOString(),
      })
      .eq("id", keyId);
  }
}

// ============================================================
// Usage Logs
// ============================================================

export async function logUsage(
  supabase: SupabaseClient,
  params: {
    agent_key_id: string;
    server_id: string;
    tool_name: string;
    status_code: number;
    response_ms?: number;
  }
) {
  const { data, error } = await supabase
    .from("usage_logs")
    .insert({
      agent_key_id: params.agent_key_id,
      server_id: params.server_id,
      tool_name: params.tool_name,
      status_code: params.status_code,
      response_ms: params.response_ms ?? 0,
    })
    .select()
    .single();

  if (error) throw error;
  return data as UsageLog;
}

export async function getUsageByKey(
  supabase: SupabaseClient,
  keyId: string,
  options?: { limit?: number; since?: string }
) {
  let query = supabase
    .from("usage_logs")
    .select("*")
    .eq("agent_key_id", keyId)
    .order("created_at", { ascending: false });

  if (options?.since) {
    query = query.gte("created_at", options.since);
  }
  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as UsageLog[];
}

// ============================================================
// Agents
// ============================================================

export async function getAgentByApiKey(
  supabase: SupabaseClient,
  apiKey: string
) {
  const { data, error } = await supabase
    .from("agents")
    .select("*")
    .eq("api_key", apiKey)
    .eq("is_active", true)
    .single();

  if (error) return null;
  return data as Agent;
}

export async function getAgentBySlug(
  supabase: SupabaseClient,
  slug: string
) {
  const { data, error } = await supabase
    .from("agents")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) return null;
  return data as Agent;
}

export async function getAgentById(
  supabase: SupabaseClient,
  id: string
) {
  const { data, error } = await supabase
    .from("agents")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data as Agent;
}

export async function createAgent(
  supabase: SupabaseClient,
  params: {
    name: string;
    slug: string;
    api_key: string;
    description?: string;
    homepage_url?: string;
    capabilities?: string[];
    owner_id?: string;
    metadata?: Record<string, unknown>;
  }
) {
  const { data, error } = await supabase
    .from("agents")
    .insert({
      name: params.name,
      slug: params.slug,
      api_key: params.api_key,
      description: params.description ?? null,
      homepage_url: params.homepage_url ?? null,
      capabilities: params.capabilities ?? [],
      owner_id: params.owner_id ?? null,
      metadata: params.metadata ?? {},
    })
    .select()
    .single();

  if (error) throw error;
  return data as Agent;
}

export async function listAgents(
  supabase: SupabaseClient,
  options?: { limit?: number; offset?: number }
) {
  let query = supabase
    .from("agents")
    .select("id, name, slug, description, capabilities, is_verified, created_at")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (options?.limit) query = query.limit(options.limit);
  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 20) - 1);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function incrementAgentCalls(
  supabase: SupabaseClient,
  agentId: string
) {
  const { error } = await supabase.rpc("increment_agent_calls", {
    p_agent_id: agentId,
  });
  if (error) {
    // Fallback
    await supabase
      .from("agents")
      .update({ last_seen_at: new Date().toISOString() })
      .eq("id", agentId);
  }
}

// ============================================================
// Server Publishing (for agents & users)
// ============================================================

export async function createServer(
  supabase: SupabaseClient,
  params: {
    name: string;
    slug: string;
    description: string;
    long_description?: string;
    category: string;
    endpoint_url?: string;
    owner_id?: string;
    agent_id?: string;
    pricing_model?: string;
    price_monthly?: number;
    free_tier_calls?: number;
    tags?: string[];
    documentation_url?: string;
    source_url?: string;
    version?: string;
  }
) {
  const { data, error } = await supabase
    .from("mcp_servers")
    .insert({
      name: params.name,
      slug: params.slug,
      description: params.description,
      long_description: params.long_description ?? null,
      category: params.category,
      endpoint_url: params.endpoint_url ?? null,
      owner_id: params.owner_id ?? null,
      agent_id: params.agent_id ?? null,
      pricing_model: params.pricing_model ?? "free",
      price_monthly: params.price_monthly ?? 0,
      free_tier_calls: params.free_tier_calls ?? 100,
      tags: params.tags ?? [],
      documentation_url: params.documentation_url ?? null,
      source_url: params.source_url ?? null,
      version: params.version ?? "1.0.0",
    })
    .select()
    .single();

  if (error) throw error;
  return data as McpServer;
}

export async function updateServer(
  supabase: SupabaseClient,
  id: string,
  params: Partial<{
    name: string;
    description: string;
    long_description: string;
    category: string;
    endpoint_url: string | null;
    pricing_model: string;
    price_monthly: number;
    free_tier_calls: number;
    tags: string[];
    documentation_url: string | null;
    source_url: string | null;
    version: string;
  }>
) {
  const { data, error } = await supabase
    .from("mcp_servers")
    .update(params)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as McpServer;
}

export async function deleteServer(
  supabase: SupabaseClient,
  id: string
) {
  const { error } = await supabase
    .from("mcp_servers")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

export async function getServersByOwner(
  supabase: SupabaseClient,
  ownerId: string
) {
  const { data, error } = await supabase
    .from("mcp_servers")
    .select("*")
    .eq("owner_id", ownerId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as McpServer[];
}

export async function getServersByAgent(
  supabase: SupabaseClient,
  agentId: string
) {
  const { data, error } = await supabase
    .from("mcp_servers")
    .select("*")
    .eq("agent_id", agentId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as McpServer[];
}

// ============================================================
// Usage Stats
// ============================================================

export async function getUsageStats(
  supabase: SupabaseClient,
  ownerId: string
) {
  // Get all keys for owner, then aggregate usage
  const keys = await getAgentKeysByOwner(supabase, ownerId);
  const keyIds = keys.map((k) => k.id);

  if (keyIds.length === 0) {
    return { total_calls: 0, calls_today: 0, keys_count: 0 };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { count: totalCalls } = await supabase
    .from("usage_logs")
    .select("*", { count: "exact", head: true })
    .in("agent_key_id", keyIds);

  const { count: callsToday } = await supabase
    .from("usage_logs")
    .select("*", { count: "exact", head: true })
    .in("agent_key_id", keyIds)
    .gte("created_at", today.toISOString());

  return {
    total_calls: totalCalls ?? 0,
    calls_today: callsToday ?? 0,
    keys_count: keys.length,
  };
}
