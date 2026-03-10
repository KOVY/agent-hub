"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";

interface DashboardStats {
  keys_count: number;
  calls_this_month: number;
  total_limit: number;
  remaining: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [serversCount, setServersCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/dashboard/stats").then((r) => r.json()),
      fetch("/api/dashboard/servers").then((r) => r.json()),
    ])
      .then(([statsData, serversData]) => {
        setStats(statsData);
        setServersCount(serversData.servers?.length ?? 0);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="glass-card rounded-xl p-6">
          <div className="text-sm text-muted-foreground mb-1">My Servers</div>
          <div className="text-3xl font-bold">
            {loading ? (
              <div className="h-9 w-8 bg-muted rounded animate-pulse" />
            ) : (
              serversCount
            )}
          </div>
        </div>
        <div className="glass-card rounded-xl p-6">
          <div className="text-sm text-muted-foreground mb-1">API Keys</div>
          <div className="text-3xl font-bold">
            {loading ? (
              <div className="h-9 w-8 bg-muted rounded animate-pulse" />
            ) : (
              stats?.keys_count ?? 0
            )}
          </div>
        </div>
        <div className="glass-card rounded-xl p-6">
          <div className="text-sm text-muted-foreground mb-1">
            Calls This Month
          </div>
          <div className="text-3xl font-bold gradient-text">
            {loading ? (
              <div className="h-9 w-12 bg-muted rounded animate-pulse" />
            ) : (
              stats?.calls_this_month ?? 0
            )}
          </div>
        </div>
        <div className="glass-card rounded-xl p-6">
          <div className="text-sm text-muted-foreground mb-1">Remaining</div>
          <div className="text-3xl font-bold text-success">
            {loading ? (
              <div className="h-9 w-16 bg-muted rounded animate-pulse" />
            ) : (
              `${stats?.remaining ?? 0}/${stats?.total_limit ?? 0}`
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Start for Humans */}
        <div className="glass-card rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Start</h2>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              1.{" "}
              <Link href="/dashboard/publish" className="text-primary font-medium">
                Publish your MCP server
              </Link>{" "}
              to make it available to agents
            </p>
            <p>
              2. Create an{" "}
              <Link href="/dashboard/keys" className="text-primary font-medium">
                API key
              </Link>{" "}
              to start using tools
            </p>
            <p>3. Call any tool:</p>
            <pre className="bg-muted rounded-lg p-3 overflow-x-auto text-xs">
{`curl -X POST https://agentforge.eu/api/v1/server/github/call \\
  -H "X-API-Key: YOUR_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"tool":"search_repos","input":{"query":"mcp"}}'`}
            </pre>
          </div>
        </div>

        {/* Quick Start for Agents */}
        <div className="glass-card rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Agent API</h2>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>AI agents can self-register and interact programmatically:</p>
            <pre className="bg-muted rounded-lg p-3 overflow-x-auto text-xs">
{`# 1. Register agent identity
curl -X POST https://agentforge.eu/api/v1/agents \\
  -H "Content-Type: application/json" \\
  -d '{"name":"my-agent"}'
# Returns: { agent_id, api_key }

# 2. Discover servers
curl https://agentforge.eu/api/v1/discover

# 3. API docs (machine-readable)
curl https://agentforge.eu/api/v1/docs`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
