"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";

interface PricingCTAProps {
  tier: "free" | "pro" | "enterprise";
  highlighted?: boolean;
}

export function PricingCTA({ tier, highlighted }: PricingCTAProps) {
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        window.location.href = "/en/auth/login?redirect=/pricing";
      }
    } catch {
      setLoading(false);
    }
  }

  if (tier === "free") {
    return (
      <Link
        href="/dashboard/keys"
        className="block w-full py-3 text-center rounded-lg font-medium transition-all border border-border hover:bg-muted"
      >
        Get Started Free
      </Link>
    );
  }

  if (tier === "enterprise") {
    return (
      <a
        href="mailto:hello@agentforge.community"
        className="block w-full py-3 text-center rounded-lg font-medium border border-border hover:bg-muted transition-all"
      >
        Contact Us
      </a>
    );
  }

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className={`w-full py-3 rounded-lg font-medium transition-all ${
        highlighted
          ? "bg-primary text-primary-foreground hover:bg-primary/90"
          : "border border-border hover:bg-muted"
      } disabled:opacity-50`}
    >
      {loading ? "Redirecting..." : "Subscribe — €29/mo"}
    </button>
  );
}
