import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ServerCard } from "@/components/server-card";
import { fetchServers } from "@/lib/data";

export default async function HomePage() {
  const featuredServers = await fetchServers({ featured: true });

  return <HomeView featuredServers={featuredServers} />;
}

function HomeView({
  featuredServers,
}: {
  featuredServers: Awaited<ReturnType<typeof fetchServers>>;
}) {
  const t = useTranslations();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="gradient-hero w-full h-full" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                <span className="gradient-text">{t("landing.heroTitle")}</span>
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-muted-foreground leading-relaxed">
                {t("landing.heroSubtitle")}
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/registry"
                  className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity text-center"
                >
                  {t("common.viewRegistry")}
                </Link>
                <Link
                  href="/pricing"
                  className="px-8 py-3 border border-border rounded-lg font-medium hover:bg-muted transition-colors text-center"
                >
                  {t("common.getStarted")}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-y border-border/50 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: "24", label: t("landing.statsServers") },
                { value: "84", label: t("landing.statsTools") },
                { value: "Free", label: "Discovery API" },
                { value: "EU", label: "Data Residency" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold gradient-text">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="text-3xl font-bold text-center mb-4">How It Works</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            AgentForge connects AI agents with MCP tool servers. Whether you&apos;re a developer or an AI agent, getting started takes minutes.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* For Humans */}
            <div className="glass-card rounded-2xl p-8">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">H</span>
                For Developers
              </h3>
              <div className="space-y-5">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-bold shrink-0">1</div>
                  <div>
                    <div className="font-medium mb-1">Browse the Registry</div>
                    <div className="text-sm text-muted-foreground">Discover 24+ verified MCP servers — GitHub, Stripe, Supabase, Playwright, and more.</div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-bold shrink-0">2</div>
                  <div>
                    <div className="font-medium mb-1">Copy the Config</div>
                    <div className="text-sm text-muted-foreground">Each server has a ready-to-paste config snippet for Claude Desktop, Cursor, or any MCP client.</div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-bold shrink-0">3</div>
                  <div>
                    <div className="font-medium mb-1">Use the Tools</div>
                    <div className="text-sm text-muted-foreground">Your AI assistant instantly gains access to the server&apos;s tools. No coding required.</div>
                  </div>
                </div>
              </div>
            </div>

            {/* For Agents */}
            <div className="glass-card rounded-2xl p-8">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">A</span>
                For AI Agents
              </h3>
              <div className="space-y-5">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-bold shrink-0">1</div>
                  <div>
                    <div className="font-medium mb-1">Self-Register</div>
                    <pre className="text-xs bg-muted rounded-lg p-2 mt-1 overflow-x-auto"><code>POST /api/v1/agents {`{"name":"my-agent"}`}</code></pre>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-bold shrink-0">2</div>
                  <div>
                    <div className="font-medium mb-1">Discover Servers</div>
                    <pre className="text-xs bg-muted rounded-lg p-2 mt-1 overflow-x-auto"><code>GET /api/v1/discover</code></pre>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-bold shrink-0">3</div>
                  <div>
                    <div className="font-medium mb-1">Connect Directly</div>
                    <div className="text-sm text-muted-foreground">Get install commands + config snippets. Connect to MCP servers via stdio or SSE — no proxy needed.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Servers */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="text-3xl font-bold text-center mb-12">
            {t("landing.featuredTitle")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredServers.map((server) => (
              <ServerCard key={server.id} server={server} />
            ))}
          </div>
        </section>

        {/* Categories */}
        <section className="bg-muted/20 border-y border-border/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <h2 className="text-3xl font-bold text-center mb-12">
              {t("landing.categoriesTitle")}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {(
                [
                  "finance",
                  "legal",
                  "data",
                  "communication",
                  "development",
                  "ai",
                  "productivity",
                  "ecommerce",
                  "healthcare",
                  "education",
                ] as const
              ).map((cat) => (
                <Link
                  key={cat}
                  href="/registry"
                  className="glass-card rounded-xl p-5 text-center hover:border-primary/50 transition-all group hover:shadow-lg hover:shadow-primary/5"
                >
                  <span className="text-sm font-medium group-hover:text-primary transition-colors">
                    {t(`categories.${cat}`)}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            <h2 className="text-3xl font-bold">{t("landing.ctaTitle")}</h2>
            <p className="mt-4 text-muted-foreground text-lg">
              {t("landing.ctaSubtitle")}
            </p>
            <div className="mt-8">
              <Link
                href="/registry"
                className="inline-block px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                {t("common.getStarted")}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
