// Unified data layer: tries Supabase, falls back to mock data
// This ensures the app works both in production (with DB) and development (without)

import type { McpServer, McpTool } from "@agent-hub/db";
import { getServers, getServerBySlug, getToolsByServerId } from "@agent-hub/db";
import { MOCK_SERVERS, getMockTools } from "./mock-data";

type SupabaseClient = Parameters<typeof getServers>[0];

async function getSupabaseClient(): Promise<SupabaseClient | null> {
  try {
    const { createServerSupabaseClient } = await import("@agent-hub/db/server");
    return await createServerSupabaseClient();
  } catch {
    return null;
  }
}

// ============================================================
// Servers
// ============================================================

export async function fetchServers(options?: {
  category?: string;
  search?: string;
  featured?: boolean;
  limit?: number;
  offset?: number;
}): Promise<McpServer[]> {
  const supabase = await getSupabaseClient();
  if (supabase) {
    try {
      return await getServers(supabase, options);
    } catch (e) {
      console.warn("[data] Supabase getServers failed, using mock:", e);
    }
  }

  // Fallback to mock data
  let servers = [...MOCK_SERVERS];
  if (options?.category) servers = servers.filter((s) => s.category === options.category);
  if (options?.search) {
    const q = options.search.toLowerCase();
    servers = servers.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.tags.some((t) => t.toLowerCase().includes(q))
    );
  }
  if (options?.featured) servers = servers.filter((s) => s.is_featured);
  if (options?.offset) servers = servers.slice(options.offset);
  if (options?.limit) servers = servers.slice(0, options.limit);
  return servers;
}

export async function fetchServerBySlug(slug: string): Promise<McpServer | null> {
  const supabase = await getSupabaseClient();
  if (supabase) {
    try {
      return await getServerBySlug(supabase, slug);
    } catch (e) {
      console.warn("[data] Supabase getServerBySlug failed, using mock:", e);
    }
  }
  return MOCK_SERVERS.find((s) => s.slug === slug) ?? null;
}

export async function fetchServerByIdOrSlug(idOrSlug: string): Promise<McpServer | null> {
  const supabase = await getSupabaseClient();
  if (supabase) {
    try {
      // Try by slug first, then by id
      const { data } = await supabase
        .from("mcp_servers")
        .select("*")
        .or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`)
        .limit(1)
        .single();
      if (data) return data as McpServer;
    } catch (e) {
      console.warn("[data] Supabase fetchServerByIdOrSlug failed, using mock:", e);
    }
  }
  return MOCK_SERVERS.find((s) => s.id === idOrSlug || s.slug === idOrSlug) ?? null;
}

// ============================================================
// Tools
// ============================================================

export async function fetchToolsByServerId(serverId: string): Promise<McpTool[]> {
  const supabase = await getSupabaseClient();
  if (supabase) {
    try {
      return await getToolsByServerId(supabase, serverId);
    } catch (e) {
      console.warn("[data] Supabase getToolsByServerId failed, using mock:", e);
    }
  }
  // Mock fallback: find server slug by id, then get tools
  const server = MOCK_SERVERS.find((s) => s.id === serverId);
  return server ? getMockTools(server.slug) : [];
}

export async function fetchToolsByServerSlug(slug: string): Promise<McpTool[]> {
  const server = await fetchServerBySlug(slug);
  if (!server) return [];
  return fetchToolsByServerId(server.id);
}

// ============================================================
// All server slugs (for generateStaticParams)
// ============================================================

export async function fetchAllServerSlugs(): Promise<string[]> {
  const supabase = await getSupabaseClient();
  if (supabase) {
    try {
      const { data } = await supabase.from("mcp_servers").select("slug");
      if (data) return data.map((s: { slug: string }) => s.slug);
    } catch {
      // fallback below
    }
  }
  return MOCK_SERVERS.map((s) => s.slug);
}
