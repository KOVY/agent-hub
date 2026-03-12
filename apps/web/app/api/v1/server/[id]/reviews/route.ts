import { type NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { apiSuccess, apiError } from "@/lib/api/response";
import { fetchServerByIdOrSlug } from "@/lib/data";

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

/**
 * GET /api/v1/server/{id}/reviews — List reviews for a server
 *
 * No auth required. Returns reviews sorted by newest first.
 * Query params: verified_only=true, limit, offset
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const server = await fetchServerByIdOrSlug(id);
  if (!server) {
    return apiError("Server not found", 404);
  }

  const supabase = getServiceClient();
  if (!supabase) {
    return apiError("Service unavailable", 503);
  }

  const { searchParams } = request.nextUrl;
  const verifiedOnly = searchParams.get("verified_only") === "true";
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "20", 10), 100);
  const offset = parseInt(searchParams.get("offset") ?? "0", 10);

  let query = supabase
    .from("agent_reviews")
    .select(
      `
      id, score, comment, is_verified, verified_calls, created_at, updated_at,
      agents!inner(id, name, slug, is_verified)
    `
    )
    .eq("server_id", server.id)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (verifiedOnly) {
    query = query.eq("is_verified", true);
  }

  const { data: reviews, error } = await query;

  if (error) {
    return apiError(error.message, 500);
  }

  // Get summary
  const { data: summary } = await supabase
    .from("server_review_summary")
    .select("*")
    .eq("server_id", server.id)
    .maybeSingle();

  return apiSuccess({
    server_id: server.id,
    server_name: server.name,
    summary: summary ?? {
      total_reviews: 0,
      verified_reviews: 0,
      avg_score: null,
      verified_avg_score: null,
    },
    reviews: (reviews ?? []).map((r: Record<string, unknown>) => ({
      id: r.id,
      score: r.score,
      comment: r.comment,
      is_verified: r.is_verified,
      verified_calls: r.verified_calls,
      created_at: r.created_at,
      agent: r.agents,
    })),
    limit,
    offset,
  });
}

/**
 * POST /api/v1/server/{id}/reviews — Submit a review
 *
 * Auth: X-API-Key header (agent key required)
 * Body: { score: 1-5, comment?: string }
 *
 * Automatically verifies if the agent has used this server (≥3 calls).
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const apiKey = request.headers.get("X-API-Key");
  if (!apiKey?.startsWith("af_")) {
    return apiError("API key required (X-API-Key header)", 401);
  }

  const supabase = getServiceClient();
  if (!supabase) {
    return apiError("Service unavailable", 503);
  }

  // Find agent by key
  let agentId: string | null = null;

  if (apiKey.startsWith("af_agent_")) {
    const { data: agent } = await supabase
      .from("agents")
      .select("id")
      .eq("api_key", apiKey)
      .eq("is_active", true)
      .single();
    agentId = agent?.id ?? null;
  } else {
    // User key — check if they own an agent
    const { data: key } = await supabase
      .from("agent_keys")
      .select("owner_id")
      .eq("api_key", apiKey)
      .eq("is_active", true)
      .single();

    if (key) {
      const { data: agent } = await supabase
        .from("agents")
        .select("id")
        .eq("owner_id", key.owner_id)
        .limit(1)
        .maybeSingle();
      agentId = agent?.id ?? null;
    }
  }

  if (!agentId) {
    return apiError(
      "Agent identity required. Register via POST /api/v1/agents first.",
      403
    );
  }

  // Find server
  const server = await fetchServerByIdOrSlug(id);
  if (!server) {
    return apiError("Server not found", 404);
  }

  // Parse body
  let body: { score: number; comment?: string };
  try {
    body = await request.json();
  } catch {
    return apiError("Invalid JSON body", 400);
  }

  if (!body.score || body.score < 1 || body.score > 5) {
    return apiError("'score' must be between 1 and 5", 400);
  }

  // Verify usage (≥3 calls = verified review)
  const { data: verification } = await supabase.rpc("verify_agent_review", {
    p_agent_id: agentId,
    p_server_id: server.id,
  });

  const verificationResult = Array.isArray(verification)
    ? verification[0]
    : verification;
  const isVerified = verificationResult?.is_verified ?? false;
  const callCount = Number(verificationResult?.call_count ?? 0);

  // Upsert review (one per agent per server)
  const { data: review, error } = await supabase
    .from("agent_reviews")
    .upsert(
      {
        agent_id: agentId,
        server_id: server.id,
        score: Math.round(body.score),
        comment: body.comment?.trim() ?? null,
        is_verified: isVerified,
        verified_calls: callCount,
      },
      { onConflict: "agent_id,server_id" }
    )
    .select("id, score, comment, is_verified, verified_calls, created_at")
    .single();

  if (error) {
    return apiError(`Failed to submit review: ${error.message}`, 500);
  }

  return apiSuccess(
    {
      review,
      verification: {
        is_verified: isVerified,
        calls_to_server: callCount,
        threshold: 3,
        message: isVerified
          ? "Review verified — you have used this server"
          : "Review unverified — use this server at least 3 times for verification",
      },
    },
    201
  );
}
