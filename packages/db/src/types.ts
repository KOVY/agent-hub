// AgentForge.eu — Database Types

export interface McpServer {
  id: string;
  slug: string;
  name: string;
  description: string;
  long_description: string | null;
  category: string;
  icon_url: string | null;
  endpoint_url: string | null;
  owner_id: string | null;

  pricing_model: "free" | "freemium" | "paid";
  price_monthly: number;
  free_tier_calls: number;

  trust_score: number;
  is_verified: boolean;
  is_featured: boolean;

  total_tools: number;
  total_calls: number;
  avg_response_ms: number;
  uptime_percent: number;

  version: string;
  tags: string[];
  documentation_url: string | null;
  source_url: string | null;

  created_at: string;
  updated_at: string;
}

export interface McpTool {
  id: string;
  server_id: string;
  name: string;
  description: string;

  input_schema: Record<string, unknown>;
  output_schema: Record<string, unknown>;
  example_input: Record<string, unknown> | null;
  example_output: Record<string, unknown> | null;

  is_active: boolean;
  avg_response_ms: number;

  created_at: string;
  updated_at: string;
}

export interface AgentKey {
  id: string;
  owner_id: string;
  api_key: string;
  name: string;

  monthly_limit: number;
  calls_this_month: number;

  is_active: boolean;
  last_used_at: string | null;

  created_at: string;
  updated_at: string;
}

export interface UsageLog {
  id: string;
  agent_key_id: string;
  server_id: string;
  tool_name: string;

  status_code: number;
  response_ms: number | null;
  request_tokens: number;
  response_tokens: number;

  cost_credits: number;

  created_at: string;
}

export interface Rating {
  id: string;
  server_id: string;
  user_id: string;

  score: number;
  comment: string | null;

  created_at: string;
  updated_at: string;
}

// Category type for type-safe filtering
export type ServerCategory =
  | "finance"
  | "legal"
  | "data"
  | "communication"
  | "development"
  | "ai"
  | "productivity"
  | "ecommerce"
  | "healthcare"
  | "education";

export const SERVER_CATEGORIES: ServerCategory[] = [
  "finance",
  "legal",
  "data",
  "communication",
  "development",
  "ai",
  "productivity",
  "ecommerce",
  "healthcare",
  "education",
];
