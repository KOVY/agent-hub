-- AgentForge — Agent Profiles & Verified Reviews
-- P0: Agent preferences, verified reviews (backed by usage_logs)

-- ============================================================
-- Extend agents: preferences for personalized discovery
-- ============================================================
ALTER TABLE agents
  ADD COLUMN IF NOT EXISTS preferences jsonb DEFAULT '{}';
-- preferences schema: {
--   preferred_categories: string[],
--   budget_range: { min: number, max: number },
--   preferred_pricing: "free" | "freemium" | "paid",
--   auto_discover: boolean,
--   notification_webhook: string
-- }

COMMENT ON COLUMN agents.preferences IS 'Agent owner preferences for personalized discovery and notifications';

-- ============================================================
-- Agent Reviews — verified by actual usage
-- ============================================================
CREATE TABLE IF NOT EXISTS agent_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  server_id uuid NOT NULL REFERENCES mcp_servers(id) ON DELETE CASCADE,

  score integer NOT NULL CHECK (score >= 1 AND score <= 5),
  comment text,

  -- Verification: was this review backed by actual usage?
  is_verified boolean DEFAULT false,
  verified_calls integer DEFAULT 0,  -- how many calls the agent made to this server

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  UNIQUE(agent_id, server_id)  -- one review per agent per server
);

CREATE INDEX idx_agent_reviews_server ON agent_reviews(server_id);
CREATE INDEX idx_agent_reviews_agent ON agent_reviews(agent_id);
CREATE INDEX idx_agent_reviews_verified ON agent_reviews(is_verified) WHERE is_verified = true;

-- ============================================================
-- RLS: public read, agent-authenticated write
-- ============================================================
ALTER TABLE agent_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view agent reviews"
  ON agent_reviews FOR SELECT
  USING (true);

-- INSERT/UPDATE/DELETE go through service role (API routes)
CREATE POLICY "Service role manages agent reviews"
  ON agent_reviews FOR ALL
  USING (true);

-- ============================================================
-- Auto-update timestamp
-- ============================================================
CREATE TRIGGER agent_reviews_updated_at
  BEFORE UPDATE ON agent_reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- View: server review summary (avg score, count, verified count)
-- ============================================================
CREATE OR REPLACE VIEW server_review_summary AS
SELECT
  server_id,
  COUNT(*) AS total_reviews,
  COUNT(*) FILTER (WHERE is_verified) AS verified_reviews,
  ROUND(AVG(score)::numeric, 1) AS avg_score,
  ROUND(AVG(score) FILTER (WHERE is_verified)::numeric, 1) AS verified_avg_score
FROM agent_reviews
GROUP BY server_id;

-- ============================================================
-- RPC: verify review based on usage_logs
-- ============================================================
CREATE OR REPLACE FUNCTION verify_agent_review(p_agent_id uuid, p_server_id uuid)
RETURNS TABLE(is_verified boolean, call_count bigint) AS $$
DECLARE
  v_call_count bigint;
BEGIN
  -- Count calls from this agent's keys to this server
  SELECT COUNT(*) INTO v_call_count
  FROM usage_logs ul
  JOIN agent_keys ak ON ul.agent_key_id = ak.id
  WHERE ak.owner_id IN (
    SELECT owner_id FROM agents WHERE id = p_agent_id AND owner_id IS NOT NULL
    UNION ALL
    SELECT p_agent_id  -- agent identity itself
  )
  AND ul.server_id = p_server_id;

  -- Verified if at least 3 calls
  RETURN QUERY SELECT (v_call_count >= 3), v_call_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
