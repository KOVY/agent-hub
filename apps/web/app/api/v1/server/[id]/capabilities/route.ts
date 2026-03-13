import { type NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { apiSuccess, apiError } from "@/lib/api/response";
import { fetchServerByIdOrSlug, fetchToolsByServerId } from "@/lib/data";

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

/**
 * GET /api/v1/server/{id}/capabilities — Full server capabilities
 *
 * No auth required. Returns everything an agent needs to decide
 * whether to use this server: tools, pricing, access methods,
 * review summary, and cost information.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const server = await fetchServerByIdOrSlug(id);
  if (!server) {
    return apiError("Server not found", 404);
  }

  const tools = await fetchToolsByServerId(server.id);

  // Get review summary
  let reviewSummary = null;
  const supabase = getServiceClient();
  if (supabase) {
    const { data } = await supabase
      .from("server_review_summary")
      .select("*")
      .eq("server_id", server.id)
      .maybeSingle();
    reviewSummary = data;
  }

  // Calculate cost per call estimate
  const costPerCall =
    server.pricing_model === "free"
      ? 0
      : server.price_monthly > 0
        ? server.price_monthly / Math.max(server.free_tier_calls, 1)
        : 0;

  return apiSuccess({
    server: {
      id: server.id,
      slug: server.slug,
      name: server.name,
      description: server.description,
      long_description: server.long_description,
      category: server.category,
      version: server.version,
      is_verified: server.is_verified,
    },
    pricing: {
      model: server.pricing_model,
      price_monthly: server.price_monthly,
      free_tier_calls: server.free_tier_calls,
      cost_per_call_estimate: Math.round(costPerCall * 10000) / 10000,
      currency: "EUR",
    },
    quality: {
      trust_score: server.trust_score,
      avg_response_ms: server.avg_response_ms,
      uptime_percent: server.uptime_percent,
      total_calls: server.total_calls,
      reviews: reviewSummary
        ? {
            avg_score: reviewSummary.avg_score,
            total_reviews: reviewSummary.total_reviews,
            verified_reviews: reviewSummary.verified_reviews,
            verified_avg_score: reviewSummary.verified_avg_score,
          }
        : { avg_score: null, total_reviews: 0, verified_reviews: 0 },
    },
    access: {
      install_type: server.install_type,
      install_command: server.install_command,
      config_snippet: server.config_snippet,
      endpoint_url: server.endpoint_url,
      documentation_url: server.documentation_url,
      source_url: server.source_url,
    },
    tools: tools.map((t) => ({
      name: t.name,
      description: t.description,
      input_schema: t.input_schema,
      output_schema: t.output_schema,
      example_input: t.example_input,
      example_output: t.example_output,
      avg_response_ms: t.avg_response_ms,
    })),
    tags: server.tags,
  });
}
