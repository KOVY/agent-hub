"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { useParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";

const LOCALES = [
  { code: "en", label: "EN" },
  { code: "cs", label: "CS" },
  { code: "de", label: "DE" },
  { code: "sk", label: "SK" },
] as const;

export function Header() {
  const t = useTranslations("common");
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const currentLocale = params.locale as string;

  return (
    <header className="border-b border-border/50 backdrop-blur-md bg-background/80 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg gradient-hero transition-transform group-hover:scale-110" />
          <span className="text-xl font-bold">{t("appName")}</span>
        </Link>

        <nav className="flex items-center gap-4">
          <Link
            href="/registry"
            className="hidden sm:inline-flex text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {t("viewRegistry")}
          </Link>
          <Link
            href="/pricing"
            className="hidden sm:inline-flex text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="/dashboard"
            className="hidden sm:inline-flex text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {t("dashboard")}
          </Link>

          {/* Language switcher */}
          <div className="flex items-center gap-1 rounded-lg border border-border p-1">
            {LOCALES.map((locale) => (
              <button
                key={locale.code}
                onClick={() => {
                  router.replace(pathname, { locale: locale.code });
                }}
                className={`px-2 py-1 text-xs rounded-md transition-colors ${
                  currentLocale === locale.code
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {locale.label}
              </button>
            ))}
          </div>

          <Link
            href="/registry"
            className="px-4 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:opacity-90 transition-opacity"
          >
            {t("getStarted")}
          </Link>
        </nav>
      </div>
    </header>
  );
}
