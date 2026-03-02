export default function UsageLoading() {
  return (
    <div>
      <div className="h-8 w-44 bg-muted rounded animate-pulse mb-8" />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="glass-card rounded-xl p-5 space-y-2">
            <div className="h-3 w-20 bg-muted rounded animate-pulse" />
            <div className="h-8 w-14 bg-muted rounded animate-pulse" />
          </div>
        ))}
      </div>

      <div className="glass-card rounded-xl p-6 mb-8">
        <div className="h-6 w-28 bg-muted rounded animate-pulse mb-4" />
        <div className="h-32 w-full bg-muted rounded-lg animate-pulse" />
      </div>

      <div className="glass-card rounded-xl p-6">
        <div className="h-6 w-28 bg-muted rounded animate-pulse mb-4" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between">
                <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                <div className="h-3 w-20 bg-muted rounded animate-pulse" />
              </div>
              <div className="h-2 w-full bg-muted rounded-full animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
