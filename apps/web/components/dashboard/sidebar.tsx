"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: "grid" },
  { href: "/dashboard/keys", label: "API Keys", icon: "key" },
  { href: "/dashboard/usage", label: "Usage", icon: "chart" },
] as const;

export function DashboardSidebar() {
  const t = useTranslations("common");
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-border/50 bg-muted/20 min-h-[calc(100vh-4rem)]">
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-6">{t("dashboard")}</h2>
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
