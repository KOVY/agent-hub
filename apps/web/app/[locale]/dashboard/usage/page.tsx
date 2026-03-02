"use client";

export default function UsagePage() {
  // Demo usage data
  const usageData = [
    { date: "Mar 1", calls: 12 },
    { date: "Mar 2", calls: 8 },
  ];

  const topServers = [
    { name: "Účetní Převodník", calls: 15, percentage: 75 },
    { name: "TranslateHub", calls: 3, percentage: 15 },
    { name: "LegalEagle", calls: 2, percentage: 10 },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Usage Analytics</h1>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="glass-card rounded-xl p-5">
          <div className="text-xs text-muted-foreground mb-1">Total Calls</div>
          <div className="text-2xl font-bold">20</div>
        </div>
        <div className="glass-card rounded-xl p-5">
          <div className="text-xs text-muted-foreground mb-1">This Month</div>
          <div className="text-2xl font-bold gradient-text">20</div>
        </div>
        <div className="glass-card rounded-xl p-5">
          <div className="text-xs text-muted-foreground mb-1">Remaining</div>
          <div className="text-2xl font-bold text-success">80</div>
        </div>
        <div className="glass-card rounded-xl p-5">
          <div className="text-xs text-muted-foreground mb-1">Avg Response</div>
          <div className="text-2xl font-bold">142ms</div>
        </div>
      </div>

      {/* Usage by day */}
      <div className="glass-card rounded-xl p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Daily Usage</h2>
        <div className="flex items-end gap-2 h-32">
          {usageData.map((day) => (
            <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full bg-primary/60 rounded-t-md transition-all"
                style={{
                  height: `${Math.max(4, (day.calls / 20) * 100)}%`,
                }}
              />
              <span className="text-xs text-muted-foreground">{day.date}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Servers */}
      <div className="glass-card rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Top Servers</h2>
        <div className="space-y-3">
          {topServers.map((server) => (
            <div key={server.name}>
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
      </div>
    </div>
  );
}
