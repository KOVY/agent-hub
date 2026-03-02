"use client";

import { useState } from "react";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  created: string;
  calls: number;
  limit: number;
  active: boolean;
}

const DEMO_KEY: ApiKey = {
  id: "key-001",
  name: "Demo Key",
  key: "af_demo_key_0123456789abcdef0123456789abcdef",
  created: "2026-03-02",
  calls: 0,
  limit: 100,
  active: true,
};

export default function KeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>([DEMO_KEY]);
  const [showCreate, setShowCreate] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  function createKey() {
    if (!newKeyName.trim()) return;
    const hex = Array.from({ length: 32 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("");
    const newKey: ApiKey = {
      id: `key-${Date.now()}`,
      name: newKeyName,
      key: `af_${hex}`,
      created: new Date().toISOString().split("T")[0],
      calls: 0,
      limit: 100,
      active: true,
    };
    setKeys([...keys, newKey]);
    setNewKeyName("");
    setShowCreate(false);
  }

  function copyKey(key: ApiKey) {
    navigator.clipboard.writeText(key.key);
    setCopiedId(key.id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  function toggleKey(id: string) {
    setKeys(
      keys.map((k) => (k.id === id ? { ...k, active: !k.active } : k))
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
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90"
            >
              Create
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
      <div className="space-y-4">
        {keys.map((key) => (
          <div key={key.id} className="glass-card rounded-xl p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold">{key.name}</h3>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      key.active
                        ? "bg-success/20 text-success"
                        : "bg-destructive/20 text-destructive"
                    }`}
                  >
                    {key.active ? "Active" : "Disabled"}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                    {key.key.slice(0, 12)}...{key.key.slice(-8)}
                  </code>
                  <button
                    onClick={() => copyKey(key)}
                    className="text-xs text-primary hover:underline"
                  >
                    {copiedId === key.id ? "Copied!" : "Copy"}
                  </button>
                </div>
                <div className="text-xs text-muted-foreground">
                  Created: {key.created} &bull; Usage: {key.calls}/{key.limit} calls
                </div>
              </div>
              <button
                onClick={() => toggleKey(key.id)}
                className="text-xs px-3 py-1 border border-border rounded-lg hover:bg-muted"
              >
                {key.active ? "Disable" : "Enable"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
