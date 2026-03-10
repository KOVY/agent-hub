"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";

interface Server {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  total_tools: number;
  total_calls: number;
  is_verified: boolean;
  created_at: string;
}

export default function MyServersPage() {
  const [servers, setServers] = useState<Server[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/servers")
      .then((r) => r.json())
      .then((data) => {
        setServers(data.servers ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this server?")) return;
    const res = await fetch("/api/dashboard/servers", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setServers((s) => s.filter((srv) => srv.id !== id));
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">My Servers</h1>
        <Link
          href="/dashboard/publish"
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          + Publish New Server
        </Link>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card rounded-xl p-6 animate-pulse">
              <div className="h-5 w-48 bg-muted rounded mb-2" />
              <div className="h-4 w-96 bg-muted rounded" />
            </div>
          ))}
        </div>
      ) : servers.length === 0 ? (
        <div className="glass-card rounded-xl p-12 text-center">
          <h2 className="text-lg font-semibold mb-2">No servers yet</h2>
          <p className="text-muted-foreground mb-6">
            Publish your first MCP server to make it available to AI agents worldwide.
          </p>
          <Link
            href="/dashboard/publish"
            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Publish Your First Server
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {servers.map((server) => (
            <div key={server.id} className="glass-card rounded-xl p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Link
                      href={`/server/${server.slug}`}
                      className="text-lg font-semibold hover:text-primary transition-colors"
                    >
                      {server.name}
                    </Link>
                    {server.is_verified && (
                      <span className="text-xs bg-green-500/10 text-green-600 px-2 py-0.5 rounded-full">
                        Verified
                      </span>
                    )}
                    <span className="text-xs bg-muted px-2 py-0.5 rounded-full capitalize">
                      {server.category}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {server.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{server.total_tools} tools</span>
                    <span>{server.total_calls.toLocaleString()} calls</span>
                    <span>
                      Published {new Date(server.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => handleDelete(server.id)}
                    className="text-xs text-red-500 hover:text-red-600 px-3 py-1 rounded border border-red-500/20 hover:border-red-500/40 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
