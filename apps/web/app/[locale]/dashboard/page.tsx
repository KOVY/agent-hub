"use client";

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-card rounded-xl p-6">
          <div className="text-sm text-muted-foreground mb-1">API Keys</div>
          <div className="text-3xl font-bold">1</div>
        </div>
        <div className="glass-card rounded-xl p-6">
          <div className="text-sm text-muted-foreground mb-1">Calls This Month</div>
          <div className="text-3xl font-bold gradient-text">0</div>
        </div>
        <div className="glass-card rounded-xl p-6">
          <div className="text-sm text-muted-foreground mb-1">Rate Limit</div>
          <div className="text-3xl font-bold text-success">100/mo</div>
        </div>
      </div>

      <div className="glass-card rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Quick Start</h2>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>1. Copy your API key from the <strong className="text-foreground">API Keys</strong> page</p>
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
