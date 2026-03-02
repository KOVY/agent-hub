"use client";

import { useEffect, useState } from "react";

interface DashboardStats {
  keys_count: number;
  calls_this_month: number;
  total_limit: number;
  remaining: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then((r) => r.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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

      <div className="glass-card rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Quick Start</h2>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>
            1. Create an API key on the{" "}
            <strong className="text-foreground">API Keys</strong> page
          </p>
          <p>2. Discover available MCP servers:</p>
          <pre className="bg-muted rounded-lg p-3 overflow-x-auto text-xs">
            curl https://agentforge.eu/api/v1/discover
          </pre>
          <p>3. Call a tool:</p>
          <pre className="bg-muted rounded-lg p-3 overflow-x-auto text-xs">
{`curl -X POST https://agentforge.eu/api/v1/server/ucetni-prevodnik/call \\
  -H "X-API-Key: YOUR_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"tool":"validate_vat_id","input":{"vat_id":"CZ12345678"}}'`}
          </pre>
        </div>
      </div>
    </div>
  );
}
