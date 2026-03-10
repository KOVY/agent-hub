import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>

          <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
            <p className="text-lg">
              Last updated: March 2, 2026
            </p>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">1. Data Controller</h2>
              <p>
                KOWEX Co. Holding (&quot;we&quot;, &quot;us&quot;) operates AgentForge. We are committed
                to protecting your privacy in compliance with the General Data Protection
                Regulation (GDPR) and applicable EU/Czech law.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">2. Data We Collect</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong className="text-foreground">Account data:</strong> Email address and authentication credentials</li>
                <li><strong className="text-foreground">Usage data:</strong> API call logs, tool usage statistics, timestamps</li>
                <li><strong className="text-foreground">Technical data:</strong> IP address, browser type, device information</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">3. Legal Basis</h2>
              <p>
                We process your data based on: (a) contract performance for providing our services,
                (b) legitimate interest for security and fraud prevention, and
                (c) consent for marketing communications.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">4. Data Storage</h2>
              <p>
                All data is stored within the European Union (eu-central-1 region).
                We use Supabase (hosted on AWS Frankfurt) as our database provider.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">5. Your Rights</h2>
              <p>Under GDPR, you have the right to:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Access your personal data</li>
                <li>Rectify inaccurate data</li>
                <li>Request erasure (&quot;right to be forgotten&quot;)</li>
                <li>Restrict processing</li>
                <li>Data portability</li>
                <li>Object to processing</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">6. Contact</h2>
              <p>
                For privacy inquiries, contact us at{" "}
                <span className="text-primary">privacy@agentforge.community</span>
              </p>
            </section>

            <div className="glass-card rounded-xl p-6 mt-8">
              <p className="text-sm text-accent">
                This is a preliminary privacy policy for the demo version.
                The full policy will be published before public launch.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
