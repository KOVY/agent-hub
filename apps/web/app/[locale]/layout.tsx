import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "../globals.css";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://agentforge.eu";

export const metadata: Metadata = {
  title: {
    default: "AgentForge.eu — The EU-First Marketplace for AI Agent Tools",
    template: "%s | AgentForge.eu",
  },
  description:
    "Discover, connect, and pay for MCP tool servers. The open marketplace that lets AI agents autonomously use the tools they need.",
  metadataBase: new URL(APP_URL),
  openGraph: {
    type: "website",
    siteName: "AgentForge.eu",
    title: "AgentForge.eu — Where AI Agents Find Their Tools",
    description:
      "The EU-first marketplace for MCP tool servers. 10+ servers, 30+ tools, ready for your AI agents.",
    images: [{ url: "/api/og", width: 1200, height: 630, alt: "AgentForge.eu" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AgentForge.eu",
    description: "The EU-first marketplace for AI agent tools",
    images: ["/api/og"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} className="dark" suppressHydrationWarning>
      <body className="min-h-screen antialiased bg-background text-foreground">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
