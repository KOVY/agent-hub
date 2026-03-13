import { getApiKey, getBaseUrl } from "./config.js";

interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  error: string | null;
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const baseUrl = getBaseUrl();
  const apiKey = getApiKey();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (apiKey) {
    headers["X-API-Key"] = apiKey;
  }

  const res = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers,
  });

  return (await res.json()) as ApiResponse<T>;
}

export async function register(name: string, description?: string) {
  return request("/agents", {
    method: "POST",
    body: JSON.stringify({ name, description }),
  });
}

export async function discover(opts: {
  q?: string;
  category?: string;
  featured?: boolean;
  limit?: number;
}) {
  const params = new URLSearchParams();
  if (opts.q) params.set("q", opts.q);
  if (opts.category) params.set("category", opts.category);
  if (opts.featured) params.set("featured", "true");
  if (opts.limit) params.set("limit", String(opts.limit));
  return request(`/discover?${params}`);
}

export async function serverInfo(id: string) {
  return request(`/server/${id}/capabilities`);
}

export async function callTool(
  serverId: string,
  tool: string,
  input: Record<string, unknown>
) {
  return request(`/server/${serverId}/call`, {
    method: "POST",
    body: JSON.stringify({ tool, input }),
  });
}

export async function broadcastSearch(
  query: string,
  opts: { category?: string; max_servers?: number }
) {
  return request("/search/broadcast", {
    method: "POST",
    body: JSON.stringify({ query, ...opts }),
  });
}

export async function searchProducts(opts: {
  q?: string;
  category?: string;
  max_price?: number;
  limit?: number;
}) {
  const params = new URLSearchParams();
  if (opts.q) params.set("q", opts.q);
  if (opts.category) params.set("category", opts.category);
  if (opts.max_price) params.set("max_price", String(opts.max_price));
  if (opts.limit) params.set("limit", String(opts.limit));
  return request(`/products?${params}`);
}

export async function me() {
  return request("/agents/me");
}

export async function health() {
  return request("/health");
}
