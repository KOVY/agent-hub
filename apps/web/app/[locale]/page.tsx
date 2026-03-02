import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function HomePage() {
  const t = useTranslations();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-hero" />
            <span className="text-xl font-bold">{t("common.appName")}</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/registry"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("common.viewRegistry")}
            </Link>
            <Link
              href="/auth/login"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("common.signIn")}
            </Link>
            <Link
              href="/registry"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              {t("common.getStarted")}
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1">
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
                  href="/registry"
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

        {/* Categories */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
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
                className="glass-card rounded-xl p-4 text-center hover:border-primary/50 transition-colors group"
              >
                <span className="text-sm font-medium group-hover:text-primary transition-colors">
                  {t(`categories.${cat}`)}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-border/50">
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

      {/* Footer */}
      <footer className="border-t border-border/50 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded gradient-hero" />
              <span className="font-semibold">{t("common.appName")}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} KOWEX Co. Holding. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
