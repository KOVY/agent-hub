"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function LoginPage() {
  const t = useTranslations("common");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Demo: skip actual auth, redirect to dashboard
    setTimeout(() => {
      setMessage("Demo mode: redirecting to dashboard...");
      setTimeout(() => {
        window.location.href = `/${document.documentElement.lang}/dashboard`;
      }, 1000);
    }, 500);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="glass-card rounded-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl gradient-hero mx-auto mb-4" />
            <h1 className="text-2xl font-bold">{t("signIn")}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {t("appName")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.eu"
                required
                className="w-full h-10 rounded-lg border border-border bg-muted px-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full h-10 rounded-lg border border-border bg-muted px-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              />
            </div>

            {message && (
              <p className="text-sm text-accent text-center">{message}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-10 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "..." : t("signIn")}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Demo mode — any email/password works
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
