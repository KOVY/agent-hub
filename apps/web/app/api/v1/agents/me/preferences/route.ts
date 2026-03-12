import { type NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { apiSuccess, apiError } from "@/lib/api/response";

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

interface AgentPreferences {
  preferred_categories?: string[];
  budget_range?: { min: number; max: number };
  preferred_pricing?: "free" | "freemium" | "paid";
  auto_discover?: boolean;
  notification_webhook?: string;
}

const VALID_CATEGORIES = [
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

const VALID_PRICING = ["free", "freemium", "paid"];

/**
 * GET /api/v1/agents/me/preferences — Get agent preferences
 *
 * Auth: X-API-Key header (agent key)
 */
export async function GET(request: NextRequest) {
  const apiKey = request.headers.get("X-API-Key");
  if (!apiKey?.startsWith("af_agent_")) {
    return apiError("Agent API key required (X-API-Key header)", 401);
  }

  const supabase = getServiceClient();
  if (!supabase) {
    return apiError("Service unavailable", 503);
  }

  const { data: agent, error } = await supabase
    .from("agents")
    .select("id, name, preferences")
    .eq("api_key", apiKey)
    .eq("is_active", true)
    .single();

  if (error || !agent) {
    return apiError("Agent not found or inactive", 404);
  }

  return apiSuccess({
    agent_id: agent.id,
    agent_name: agent.name,
    preferences: agent.preferences ?? {},
  });
}

/**
 * PATCH /api/v1/agents/me/preferences — Update agent preferences
 *
 * Auth: X-API-Key header (agent key)
 * Body: AgentPreferences (partial update, merged with existing)
 */
export async function PATCH(request: NextRequest) {
  const apiKey = request.headers.get("X-API-Key");
  if (!apiKey?.startsWith("af_agent_")) {
    return apiError("Agent API key required (X-API-Key header)", 401);
  }

  const supabase = getServiceClient();
  if (!supabase) {
    return apiError("Service unavailable", 503);
  }

  const { data: agent, error: fetchErr } = await supabase
    .from("agents")
    .select("id, preferences")
    .eq("api_key", apiKey)
    .eq("is_active", true)
    .single();

  if (fetchErr || !agent) {
    return apiError("Agent not found or inactive", 404);
  }

  let body: AgentPreferences;
  try {
    body = await request.json();
  } catch {
    return apiError("Invalid JSON body", 400);
  }

  // Validate categories
  if (body.preferred_categories) {
    const invalid = body.preferred_categories.filter(
      (c) => !VALID_CATEGORIES.includes(c)
    );
    if (invalid.length > 0) {
      return apiError(
        `Invalid categories: ${invalid.join(", ")}. Valid: ${VALID_CATEGORIES.join(", ")}`,
        400
      );
    }
  }

  // Validate pricing
  if (
    body.preferred_pricing &&
    !VALID_PRICING.includes(body.preferred_pricing)
  ) {
    return apiError(
      `Invalid pricing: ${body.preferred_pricing}. Valid: ${VALID_PRICING.join(", ")}`,
      400
    );
  }

  // Validate budget range
  if (body.budget_range) {
    if (body.budget_range.min < 0 || body.budget_range.max < body.budget_range.min) {
      return apiError("Invalid budget_range: min must be ≥ 0 and max ≥ min", 400);
    }
  }

  // Merge with existing preferences
  const currentPrefs =
    (agent.preferences as AgentPreferences | null) ?? {};
  const merged = { ...currentPrefs, ...body };

  const { data: updated, error: updateErr } = await supabase
    .from("agents")
    .update({ preferences: merged })
    .eq("id", agent.id)
    .select("id, name, preferences")
    .single();

  if (updateErr) {
    return apiError(updateErr.message, 500);
  }

  return apiSuccess({
    agent_id: updated.id,
    agent_name: updated.name,
    preferences: updated.preferences,
  });
}
