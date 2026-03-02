import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { McpServer } from "@agent-hub/db";

export function ServerCard({ server }: { server: McpServer }) {
  const t = useTranslations();

  return (
    <Link href={`/server/${server.slug}`} className="block group">
      <div className="glass-card rounded-xl p-6 h-full hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
              {server.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="font-semibold group-hover:text-primary transition-colors">
                {server.name}
              </h3>
              <span className="text-xs text-muted-foreground">
                v{server.version}
              </span>
            </div>
          </div>
          {server.is_verified && (
            <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-success/20 text-success">
              {t("registry.trustedBadge")}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {server.description}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
          <span>{server.total_tools} {t("registry.tools")}</span>
          <span className="text-primary font-medium">
            {server.trust_score.toFixed(1)}/10
          </span>
          <span>{server.uptime_percent}% uptime</span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          <span className="text-xs px-2 py-1 rounded-md bg-muted text-muted-foreground">
            {t(`categories.${server.category}` as Parameters<typeof t>[0])}
          </span>
          {server.pricing_model === "free" ? (
            <span className="text-sm font-medium text-success">{t("registry.free")}</span>
          ) : (
            <span className="text-sm font-medium">
              {server.free_tier_calls > 0 && (
                <span className="text-success mr-2">{t("registry.free")}</span>
              )}
              €{server.price_monthly}{t("server.monthlyPrice")}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
