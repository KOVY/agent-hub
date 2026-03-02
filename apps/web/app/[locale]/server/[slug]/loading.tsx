export default function ServerLoading() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header skeleton */}
      <header className="border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="h-6 w-32 bg-muted rounded animate-pulse" />
          <div className="flex gap-4">
            <div className="h-8 w-20 bg-muted rounded animate-pulse" />
            <div className="h-8 w-20 bg-muted rounded animate-pulse" />
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Back link */}
          <div className="h-4 w-24 bg-muted rounded animate-pulse mb-8" />

          {/* Server header card */}
          <div className="glass-card rounded-2xl p-8 mb-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-muted animate-pulse shrink-0" />
                <div className="space-y-3">
                  <div className="h-8 w-48 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-96 max-w-full bg-muted rounded animate-pulse" />
                  <div className="h-4 w-80 max-w-full bg-muted rounded animate-pulse" />
                  <div className="flex gap-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="h-6 w-16 bg-muted rounded-full animate-pulse" />
                    ))}
                  </div>
                </div>
              </div>
              <div className="glass-card rounded-xl p-5 min-w-[200px] space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                    <div className="h-4 w-12 bg-muted rounded animate-pulse" />
                  </div>
                ))}
                <div className="h-10 w-full bg-muted rounded-lg animate-pulse mt-2" />
              </div>
            </div>
          </div>

          {/* Tools section */}
          <div className="h-6 w-32 bg-muted rounded animate-pulse mb-6" />
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="glass-card rounded-xl p-6 space-y-4">
                <div className="h-5 w-48 bg-muted rounded animate-pulse" />
                <div className="h-4 w-full bg-muted rounded animate-pulse" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-24 bg-muted rounded-lg animate-pulse" />
                  <div className="h-24 bg-muted rounded-lg animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
