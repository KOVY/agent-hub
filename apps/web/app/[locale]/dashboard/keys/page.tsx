"use client";

import { useEffect, useState } from "react";

interface AgentKey {
  id: string;
  name: string;
  api_key: string;
  created_at: string;
  calls_this_month: number;
  monthly_limit: number;
  is_active: boolean;
}

export default function KeysPage() {
  const [keys, setKeys] = useState<AgentKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [creating, setCreating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [newRawKey, setNewRawKey] = useState<string | null>(null);

  useEffect(() => {
    fetchKeys();
  }, []);

  async function fetchKeys() {
    try {
      const res = await fetch("/api/dashboard/keys");
      const data = await res.json();
      setKeys(data.keys ?? []);
    } catch {
      // Failed to load
    } finally {
      setLoading(false);
    }
  }

  async function createKey() {
    if (!newKeyName.trim() || creating) return;
    setCreating(true);

    try {
      const res = await fetch("/api/dashboard/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newKeyName.trim() }),
      });

      const data = await res.json();
      if (data.key) {
        setKeys([data.key, ...keys]);
        setNewRawKey(data.raw_key);
        setNewKeyName("");
        setShowCreate(false);
      }
    } catch {
      // Failed to create
    } finally {
      setCreating(false);
    }
  }

  async function toggleKey(id: string, currentActive: boolean) {
    try {
      const res = await fetch("/api/dashboard/keys", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, is_active: !currentActive }),
      });
      const data = await res.json();
      if (data.key) {
        setKeys(keys.map((k) => (k.id === id ? data.key : k)));
      }
    } catch {
      // Failed to toggle
    }
  }

  function copyKey(text: string, id: string) {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  function maskKey(key: string) {
    return `${key.slice(0, 12)}...${key.slice(-8)}`;
  }

  if (loading) {
    return (
      <div>
        <div className="h-8 w-32 bg-muted rounded animate-pulse mb-8" />
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="glass-card rounded-xl p-6">
              <div className="h-5 w-32 bg-muted rounded animate-pulse mb-3" />
              <div className="h-6 w-64 bg-muted rounded animate-pulse mb-2" />
              <div className="h-3 w-48 bg-muted rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">API Keys</h1>
        <button
          onClick={() => setShowCreate(true)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Create New Key
        </button>
      </div>

      {/* New key reveal */}
      {newRawKey && (
        <div className="glass-card rounded-xl p-6 mb-6 border-success/50">
          <h3 className="font-semibold text-success mb-2">
            New API Key Created
          </h3>
          <p className="text-sm text-muted-foreground mb-3">
            Copy this key now — it won&apos;t be shown again in full.
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-xs bg-muted px-3 py-2 rounded font-mono break-all">
              {newRawKey}
            </code>
            <button
              onClick={() => {
                copyKey(newRawKey, "new");
              }}
              className="px-3 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium shrink-0"
            >
              {copiedId === "new" ? "Copied!" : "Copy"}
            </button>
          </div>
          <button
            onClick={() => setNewRawKey(null)}
            className="text-xs text-muted-foreground mt-3 hover:text-foreground"
          >
            I&apos;ve copied it, dismiss
          </button>
        </div>
      )}

      {/* Create Key Dialog */}
      {showCreate && (
        <div className="glass-card rounded-xl p-6 mb-6">
          <h3 className="font-semibold mb-3">Create API Key</h3>
          <div className="flex gap-3">
            <input
              type="text"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              placeholder="Key name (e.g., Production Agent)"
              className="flex-1 h-10 rounded-lg border border-border bg-muted px-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              onKeyDown={(e) => e.key === "Enter" && createKey()}
            />
            <button
              onClick={createKey}
              disabled={creating}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50"
            >
              {creating ? "..." : "Create"}
            </button>
            <button
              onClick={() => setShowCreate(false)}
              className="px-4 py-2 border border-border rounded-lg text-sm hover:bg-muted"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Keys List */}
      {keys.length === 0 ? (
        <div className="glass-card rounded-xl p-8 text-center">
          <p className="text-muted-foreground">
            No API keys yet. Create one to start using AgentForge.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {keys.map((key) => (
            <div key={key.id} className="glass-card rounded-xl p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold">{key.name}</h3>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        key.is_active
                          ? "bg-success/20 text-success"
                          : "bg-destructive/20 text-destructive"
                      }`}
                    >
                      {key.is_active ? "Active" : "Disabled"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                      {maskKey(key.api_key)}
                    </code>
                    <button
                      onClick={() => copyKey(key.api_key, key.id)}
                      className="text-xs text-primary hover:underline"
                    >
                      {copiedId === key.id ? "Copied!" : "Copy"}
                    </button>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Created: {key.created_at.split("T")[0]} &bull; Usage:{" "}
                    {key.calls_this_month}/{key.monthly_limit} calls this month
                  </div>
                </div>
                <button
                  onClick={() => toggleKey(key.id, key.is_active)}
                  className="text-xs px-3 py-1 border border-border rounded-lg hover:bg-muted"
                >
                  {key.is_active ? "Disable" : "Enable"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
