-- Add install instruction columns to mcp_servers
-- Enables registry-first model: agents discover servers and connect directly

ALTER TABLE mcp_servers
  ADD COLUMN IF NOT EXISTS install_type text CHECK (install_type IN ('npm', 'pip', 'docker', 'binary', 'manual')),
  ADD COLUMN IF NOT EXISTS install_command text,
  ADD COLUMN IF NOT EXISTS config_snippet jsonb;
