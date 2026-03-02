"use client";

import { useEffect, useState } from "react";

interface DashboardStats {
  calls_this_month: number;
  total_limit: number;
  remaining: number;
  avg_response_ms: number;
  daily_usage: { date: string; calls: number }[];
  top_servers: {
    id: string;
    name: string;
    calls: number;
    percentage: number;
  }[];
}

export default function UsagePage() {
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

  const totalCalls = stats?.daily_usage?.reduce((s, d) => s + d.calls, 0) ?? 0;
  const maxDaily = Math.max(
    ...(stats?.daily_usage?.map((d) => d.calls) ?? [1]),
    1
  );

  if (loading) {
    return (
      <div>
        <div className="h-8 w-44 bg-muted rounded animate-pulse mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="glass-card rounded-xl p-5">
              <div className="h-3 w-20 bg-muted rounded animate-pulse mb-2" />
              <div className="h-8 w-14 bg-muted rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Usage Analytics</h1>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="glass-card rounded-xl p-5">
          <div className="text-xs text-muted-foreground mb-1">
            Total Calls (30d)
          </div>
          <div className="text-2xl font-bold">{totalCalls}</div>
        </div>
        <div className="glass-card rounded-xl p-5">
          <div className="text-xs text-muted-foreground mb-1">This Month</div>
          <div className="text-2xl font-bold gradient-text">
            {stats?.calls_this_month ?? 0}
          </div>
        </div>
        <div className="glass-card rounded-xl p-5">
          <div className="text-xs text-muted-foreground mb-1">Remaining</div>
          <div className="text-2xl font-bold text-success">
            {stats?.remaining ?? 0}
          </div>
        </div>
        <div className="glass-card rounded-xl p-5">
          <div className="text-xs text-muted-foreground mb-1">Avg Response</div>
          <div className="text-2xl font-bold">
            {stats?.avg_response_ms ?? 0}ms
          </div>
        </div>
      </div>

      {/* Usage by day */}
      <div className="glass-card rounded-xl p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Daily Usage</h2>
        {stats?.daily_usage && stats.daily_usage.length > 0 ? (
          <div className="flex items-end gap-1 h-32">
            {stats.daily_usage.map((day) => (
              <div
                key={day.date}
                className="flex-1 flex flex-col items-center gap-1"
              >
                <div
                  className="w-full bg-primary/60 rounded-t-md transition-all min-h-[2px]"
                  style={{
                    height: `${Math.max(2, (day.calls / maxDaily) * 100)}%`,
                  }}
                />
                <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                  {day.date.slice(5)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-8">
            No usage data yet. Make some API calls to see analytics here.
          </p>
        )}
      </div>

      {/* Top Servers */}
      <div className="glass-card rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Top Servers</h2>
        {stats?.top_servers && stats.top_servers.length > 0 ? (
          <div className="space-y-3">
            {stats.top_servers.map((server) => (
              <div key={server.id}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{server.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {server.calls} calls ({server.percentage}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${server.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            No server usage data yet.
          </p>
        )}
      </div>
    </div>
  );
}
