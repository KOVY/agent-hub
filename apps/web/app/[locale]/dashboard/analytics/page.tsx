"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";

interface Analytics {
  servers: Array<{
    id: string;
    name: string;
    slug: string;
    total_calls: number;
    total_tools: number;
    reviews: { avg_score: number; total: number; verified: number } | null;
  }>;
  total_reviews: number;
  avg_review_score: number | null;
  total_calls: number;
  keys_count: number;
  recent_reviews: Array<{
    id: string;
    score: number;
    comment: string | null;
    is_verified: boolean;
    created_at: string;
    agent: { name: string; slug: string };
    server: { name: string; slug: string };
  }>;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/analytics")
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Analytics</h1>
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass-card rounded-xl p-6 animate-pulse">
            <div className="h-5 w-48 bg-muted rounded mb-2" />
            <div className="h-4 w-96 bg-muted rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (!data || data.servers.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-8">Analytics</h1>
        <div className="glass-card rounded-xl p-12 text-center">
          <h2 className="text-lg font-semibold mb-2">No servers yet</h2>
          <p className="text-muted-foreground mb-6">
            Publish a server to see analytics about reviews, calls, and agent
            activity.
          </p>
          <Link
            href="/dashboard/publish"
            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg text-sm font-medium"
          >
            Publish Your First Server
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Analytics</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="glass-card rounded-xl p-5">
          <div className="text-2xl font-bold">{data.total_calls.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground">Total Calls</div>
        </div>
        <div className="glass-card rounded-xl p-5">
          <div className="text-2xl font-bold">{data.total_reviews}</div>
          <div className="text-sm text-muted-foreground">Total Reviews</div>
        </div>
        <div className="glass-card rounded-xl p-5">
          <div className="text-2xl font-bold">
            {data.avg_review_score ?? "—"}
          </div>
          <div className="text-sm text-muted-foreground">Avg Score</div>
        </div>
        <div className="glass-card rounded-xl p-5">
          <div className="text-2xl font-bold">{data.servers.length}</div>
          <div className="text-sm text-muted-foreground">Published Servers</div>
        </div>
      </div>

      {/* Server Breakdown */}
      <div className="glass-card rounded-xl p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Server Performance</h2>
        <div className="space-y-3">
          {data.servers.map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between py-3 border-b border-border/30 last:border-0"
            >
              <div>
                <Link
                  href={`/server/${s.slug}`}
                  className="font-medium hover:text-primary transition-colors"
                >
                  {s.name}
                </Link>
                <div className="text-xs text-muted-foreground">
                  {s.total_tools} tools
                </div>
              </div>
              <div className="flex items-center gap-6 text-sm">
                <div className="text-right">
                  <div className="font-medium">{s.total_calls.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">calls</div>
                </div>
                {s.reviews && (
                  <div className="text-right">
                    <div className="font-medium">
                      {s.reviews.avg_score}/5
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {s.reviews.total} reviews ({s.reviews.verified} verified)
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Reviews */}
      {data.recent_reviews.length > 0 && (
        <div className="glass-card rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Reviews</h2>
          <div className="space-y-4">
            {data.recent_reviews.map((r) => (
              <div
                key={r.id}
                className="border-b border-border/30 pb-4 last:border-0"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">
                      {(r.agent as Record<string, unknown>).name as string}
                    </span>
                    {r.is_verified && (
                      <span className="text-xs bg-green-500/10 text-green-600 px-2 py-0.5 rounded-full">
                        Verified
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">
                      on {(r.server as Record<string, unknown>).name as string}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className={
                          i < r.score ? "text-yellow-500" : "text-muted"
                        }
                      >
                        &#9733;
                      </span>
                    ))}
                  </div>
                </div>
                {r.comment && (
                  <p className="text-sm text-muted-foreground">{r.comment}</p>
                )}
                <div className="text-xs text-muted-foreground mt-1">
                  {new Date(r.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
