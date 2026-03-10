"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: "grid" },
  { href: "/dashboard/servers", label: "My Servers", icon: "server" },
  { href: "/dashboard/publish", label: "Publish Server", icon: "plus" },
  { href: "/dashboard/keys", label: "API Keys", icon: "key" },
  { href: "/dashboard/billing", label: "Billing", icon: "creditcard" },
  { href: "/dashboard/usage", label: "Usage", icon: "chart" },
] as const;

export function DashboardSidebar() {
  const t = useTranslations("common");
  const pathname = usePathname();
  const locale = useLocale();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    try {
      await fetch(`/${locale}/auth/signout`, { method: "POST" });
      router.push("/");
      router.refresh();
    } catch {
      setSigningOut(false);
    }
  }

  return (
    <aside className="w-64 border-r border-border/50 bg-muted/20 min-h-[calc(100vh-4rem)] flex flex-col">
      <div className="p-6 flex-1">
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
      <div className="p-6 border-t border-border/50">
        <button
          onClick={handleSignOut}
          disabled={signingOut}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-50"
        >
          {signingOut ? "Signing out..." : "Sign Out"}
        </button>
      </div>
    </aside>
  );
}
