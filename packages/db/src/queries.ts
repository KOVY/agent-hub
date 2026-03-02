import type { SupabaseClient } from "@supabase/supabase-js";
import type { McpServer, McpTool, AgentKey, UsageLog } from "./types";

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
