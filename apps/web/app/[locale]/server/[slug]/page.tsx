import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { useTranslations } from "next-intl";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ToolCard } from "@/components/tool-card";
import { Link } from "@/i18n/navigation";
import {
  fetchServerBySlug,
  fetchToolsByServerSlug,
  fetchAllServerSlugs,
} from "@/lib/data";
import type { McpServer, McpTool } from "@agent-hub/db";

interface ServerPageProps {
  params: Promise<{ slug: string; locale: string }>;
}

export async function generateMetadata({
  params,
}: ServerPageProps): Promise<Metadata> {
  const { slug } = await params;
  const server = await fetchServerBySlug(slug);
  if (!server) return {};

  return {
    title: `${server.name} — MCP Server`,
    description: server.description,
    openGraph: {
      title: `${server.name} | AgentForge.eu`,
      description: server.description,
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(server.name)}&description=${encodeURIComponent(server.description)}`,
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

export default async function ServerPage({ params }: ServerPageProps) {
  const { slug } = await params;
  const server = await fetchServerBySlug(slug);

  if (!server) {
    notFound();
  }

  const tools = await fetchToolsByServerSlug(slug);

  return <ServerDetailView server={server} tools={tools} />;
}

function ServerDetailView({
  server,
  tools,
}: {
  server: McpServer;
  tools: McpTool[];
}) {
  const t = useTranslations();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Back link */}
          <Link
            href="/registry"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t("registry.title")}
          </Link>

          {/* Server Header */}
          <div className="glass-card rounded-2xl p-8 mb-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-bold text-xl shrink-0">
                  {server.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl sm:text-3xl font-bold">
                      {server.name}
                    </h1>
                    {server.is_verified && (
                      <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-success/20 text-success">
                        {t("registry.trustedBadge")}
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground max-w-2xl">
                    {server.long_description || server.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {server.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs bg-muted text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Stats sidebar */}
              <div className="shrink-0 glass-card rounded-xl p-5 min-w-[200px]">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{t("server.trustScore")}</span>
                    <span className="text-lg font-bold text-primary">{server.trust_score.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{t("server.tools")}</span>
                    <span className="font-semibold">{server.total_tools}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Uptime</span>
                    <span className="font-semibold text-success">{server.uptime_percent}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Avg Response</span>
                    <span className="font-semibold">{server.avg_response_ms}ms</span>
                  </div>
                  <div className="border-t border-border/50 pt-3 mt-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-muted-foreground">{t("server.freeTier")}</span>
                      <span className="text-sm font-medium text-success">
                        {server.free_tier_calls} calls
                      </span>
                    </div>
                    {server.price_monthly > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{t("server.pricing")}</span>
                        <span className="text-sm font-medium">
                          €{server.price_monthly}{t("server.monthlyPrice")}
                        </span>
                      </div>
                    )}
                  </div>
                  <button className="w-full mt-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity text-sm">
                    {t("server.connectButton")}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Tools Section */}
          <div>
            <h2 className="text-xl font-bold mb-6">
              {t("server.tools")} ({tools.length})
            </h2>
            {tools.length > 0 ? (
              <div className="space-y-6">
                {tools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            ) : (
              <div className="glass-card rounded-xl p-8 text-center">
                <p className="text-muted-foreground">
                  Tool details coming soon. This server has {server.total_tools} tools available.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export async function generateStaticParams() {
  const slugs = await fetchAllServerSlugs();
  return slugs.map((slug) => ({ slug }));
}
