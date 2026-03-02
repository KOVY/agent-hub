"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useParams, useSearchParams } from "next/navigation";
import { createBrowserSupabaseClient } from "@agent-hub/db";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

type AuthMode = "login" | "signup";

export default function LoginPage() {
  const t = useTranslations("common");
  const params = useParams();
  const searchParams = useSearchParams();
  const locale = params.locale as string;
  const nextUrl = searchParams.get("next") || `/${locale}/dashboard`;

  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    const supabase = createBrowserSupabaseClient();

    if (mode === "signup") {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/${locale}/auth/callback`,
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      setMessage(
        "Check your email for a confirmation link. Then you can sign in."
      );
      setLoading(false);
      return;
    }

    // Login
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    // Redirect to dashboard (or the page they were trying to access)
    window.location.href = nextUrl;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="glass-card rounded-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl gradient-hero mx-auto mb-4" />
            <h1 className="text-2xl font-bold">
              {mode === "login" ? t("signIn") : t("signUp")}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {t("appName")}
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex rounded-lg border border-border p-1 mb-6">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setError("");
                setMessage("");
              }}
              className={`flex-1 py-2 text-sm rounded-md transition-colors ${
                mode === "login"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t("signIn")}
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("signup");
                setError("");
                setMessage("");
              }}
              className={`flex-1 py-2 text-sm rounded-md transition-colors ${
                mode === "signup"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t("signUp")}
            </button>
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
                minLength={6}
                className="w-full h-10 rounded-lg border border-border bg-muted px-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              />
            </div>

            {error && (
              <p className="text-sm text-destructive text-center">{error}</p>
            )}
            {message && (
              <p className="text-sm text-success text-center">{message}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-10 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading
                ? "..."
                : mode === "login"
                  ? t("signIn")
                  : t("signUp")}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
