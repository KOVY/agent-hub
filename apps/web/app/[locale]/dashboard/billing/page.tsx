"use client";

import { useEffect, useState } from "react";

interface SubscriptionInfo {
  plan: string;
  status: string;
  current_period_end: string | null;
}

export default function BillingPage() {
  const [sub, setSub] = useState<SubscriptionInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/subscription")
      .then((r) => r.json())
      .then((data) => {
        setSub(data.subscription ?? data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function handleUpgrade() {
    const res = await fetch("/api/stripe/checkout", { method: "POST" });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
  }

  async function handleManage() {
    const res = await fetch("/api/stripe/portal", { method: "POST" });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
  }

  const isPro = sub?.plan === "pro" && sub?.status === "active";

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Billing</h1>

      {loading ? (
        <div className="glass-card rounded-xl p-8 animate-pulse">
          <div className="h-6 w-32 bg-muted rounded mb-4" />
          <div className="h-4 w-64 bg-muted rounded" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Current Plan */}
          <div className="glass-card rounded-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold mb-1">Current Plan</h2>
                <div className="flex items-center gap-2">
                  <span className={`text-2xl font-bold ${isPro ? "gradient-text" : ""}`}>
                    {sub?.plan === "pro" ? "Pro" : "Free"}
                  </span>
                  {sub?.status && sub.status !== "active" && (
                    <span className="text-xs bg-yellow-500/10 text-yellow-600 px-2 py-0.5 rounded-full">
                      {sub.status}
                    </span>
                  )}
                </div>
              </div>
              {isPro && sub?.current_period_end && (
                <div className="text-sm text-muted-foreground text-right">
                  <div>Next billing date</div>
                  <div className="font-medium">
                    {new Date(sub.current_period_end).toLocaleDateString()}
                  </div>
                </div>
              )}
            </div>

            {/* Plan details */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-muted/50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold">{isPro ? "10,000" : "100"}</div>
                <div className="text-xs text-muted-foreground">calls/month</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold">{isPro ? "10" : "1"}</div>
                <div className="text-xs text-muted-foreground">API keys</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold">{isPro ? "50" : "3"}</div>
                <div className="text-xs text-muted-foreground">servers</div>
              </div>
            </div>

            {/* Actions */}
            {isPro ? (
              <button
                onClick={handleManage}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors underline"
              >
                Manage subscription in Stripe
              </button>
            ) : (
              <button
                onClick={handleUpgrade}
                className="bg-primary text-primary-foreground px-6 py-3 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Upgrade to Pro — €29/month
              </button>
            )}
          </div>

          {/* FAQ */}
          <div className="glass-card rounded-xl p-6">
            <h3 className="font-semibold mb-3">Billing FAQ</h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p><strong className="text-foreground">What happens when I upgrade?</strong> — Your API key limits are increased immediately. Billing starts right away.</p>
              <p><strong className="text-foreground">Can I cancel anytime?</strong> — Yes. Your plan stays active until the end of the billing period.</p>
              <p><strong className="text-foreground">What if I exceed my limit?</strong> — API calls return 429 status. Upgrade or wait for the monthly reset.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
