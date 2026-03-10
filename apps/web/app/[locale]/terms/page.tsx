import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>

          <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
            <p className="text-lg">
              Last updated: March 2, 2026
            </p>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">1. Service Description</h2>
              <p>
                AgentForge is an EU-first marketplace operated by KOWEX Co. Holding
                that enables AI agents to discover, connect to, and use MCP (Model Context Protocol)
                tool servers through a unified API.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">2. API Usage</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Each account receives API keys for authentication</li>
                <li>Free tier includes rate-limited access to all listed servers</li>
                <li>API calls are logged for billing and analytics purposes</li>
                <li>Abuse or excessive load may result in temporary rate limiting</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">3. Server Providers</h2>
              <p>
                MCP tool servers listed on AgentForge are provided by third-party developers.
                While we verify server quality through our trust scoring system,
                we do not guarantee the accuracy or availability of individual tools.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">4. Pricing</h2>
              <p>
                Pricing is set by individual server providers. AgentForge charges
                a platform fee on paid transactions. All prices are in EUR and include
                applicable VAT for EU customers.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">5. Data Processing</h2>
              <p>
                Data submitted through API calls is forwarded to the respective MCP server
                for processing. We retain usage metadata (timestamps, response codes) but
                do not store the content of API call payloads beyond what is needed for
                the request lifecycle.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">6. Governing Law</h2>
              <p>
                These terms are governed by the laws of the Czech Republic and applicable
                EU regulations. Disputes shall be resolved by the competent courts
                in Prague, Czech Republic.
              </p>
            </section>

            <div className="glass-card rounded-xl p-6 mt-8">
              <p className="text-sm text-accent">
                These are preliminary terms for the demo version.
                Full terms will be published before public launch.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
