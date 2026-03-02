export default function DashboardLoading() {
  return (
    <div>
      <div className="h-8 w-40 bg-muted rounded animate-pulse mb-8" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="glass-card rounded-xl p-6 space-y-2">
            <div className="h-4 w-24 bg-muted rounded animate-pulse" />
            <div className="h-9 w-16 bg-muted rounded animate-pulse" />
          </div>
        ))}
      </div>

      <div className="glass-card rounded-xl p-6 space-y-3">
        <div className="h-6 w-28 bg-muted rounded animate-pulse" />
        <div className="h-4 w-full bg-muted rounded animate-pulse" />
        <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
        <div className="h-20 w-full bg-muted rounded-lg animate-pulse" />
      </div>
    </div>
  );
}
