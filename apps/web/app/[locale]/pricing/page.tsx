import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { PricingCTA } from "@/components/pricing-cta";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Simple, transparent pricing for AI agent tool access. Start free, scale as you grow.",
};

const TIERS = [
  {
    name: "Free",
    price: "0",
    period: "forever",
    description: "Perfect for testing and prototyping",
    features: [
      "100 API calls / month",
      "Access to all listed servers",
      "Community support",
      "Standard rate limits",
      "1 API key",
    ],
    cta: "getStarted",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "29",
    period: "/month",
    description: "For production AI agents and teams",
    features: [
      "10,000 API calls / month",
      "Priority access to servers",
      "Email support",
      "Higher rate limits",
      "10 API keys",
      "Usage analytics dashboard",
      "Webhook notifications",
    ],
    cta: "comingSoon",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For organizations running AI at scale",
    features: [
      "Unlimited API calls",
      "Dedicated server instances",
      "24/7 priority support",
      "Custom rate limits",
      "Unlimited API keys",
      "Advanced analytics & reporting",
      "SLA guarantee (99.9%)",
      "On-premise deployment option",
      "Custom MCP server integration",
    ],
    cta: "contactUs",
    highlighted: false,
  },
] as const;

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="gradient-text">Simple, Transparent Pricing</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Start free. Scale as your agents grow. All plans include access to
              every MCP server in the marketplace.
            </p>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {TIERS.map((tier) => (
              <div
                key={tier.name}
                className={`glass-card rounded-2xl p-8 flex flex-col ${
                  tier.highlighted
                    ? "border-primary/50 shadow-lg shadow-primary/10 relative"
                    : ""
                }`}
              >
                {tier.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {tier.description}
                  </p>
                </div>

                <div className="mb-8">
                  <div className="flex items-baseline gap-1">
                    {tier.price !== "Custom" && (
                      <span className="text-sm text-muted-foreground">€</span>
                    )}
                    <span className="text-4xl font-bold">{tier.price}</span>
                    {tier.period && (
                      <span className="text-muted-foreground">
                        {tier.period}
                      </span>
                    )}
                  </div>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <svg
                        className="w-4 h-4 text-success shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <PricingCTA
                  tier={tier.cta === "getStarted" ? "free" : tier.cta === "contactUs" ? "enterprise" : "pro"}
                  highlighted={tier.highlighted}
                />
              </div>
            ))}
          </div>

          {/* FAQ / Info */}
          <div className="glass-card rounded-2xl p-8 max-w-3xl mx-auto">
            <h2 className="text-xl font-bold mb-6 text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-1">What counts as an API call?</h3>
                <p className="text-sm text-muted-foreground">
                  Each request to <code className="text-xs bg-muted px-1 py-0.5 rounded">/api/v1/server/:id/call</code> counts
                  as one API call. Discovery and server info endpoints are free and unlimited.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Do individual servers have their own pricing?</h3>
                <p className="text-sm text-muted-foreground">
                  Yes. Some servers offer free tiers, others require a paid plan.
                  Your AgentForge plan covers the platform fee — individual server
                  costs are billed separately based on usage.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Can I switch plans anytime?</h3>
                <p className="text-sm text-muted-foreground">
                  Yes. Upgrade or downgrade at any time. Changes take effect
                  immediately and billing is prorated.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Is billing GDPR-compliant?</h3>
                <p className="text-sm text-muted-foreground">
                  Absolutely. We use Stripe for payment processing, all data
                  stays in the EU, and we comply with GDPR, PSD2, and Czech
                  accounting regulations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
