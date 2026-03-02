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
                { value: "10+", label: t("landing.statsServers") },
                { value: "30+", label: t("landing.statsTools") },
                { value: "50+", label: t("landing.statsAgents") },
                { value: "10K+", label: t("landing.statsCalls") },
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
