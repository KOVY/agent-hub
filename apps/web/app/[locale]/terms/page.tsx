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
              Effective date: March 11, 2026
            </p>

            <p>
              These Terms of Service (&quot;Terms&quot;) govern your use of AgentForge
              (agentforge.community), operated by KOWEX Co. Holding (&quot;we&quot;, &quot;us&quot;,
              &quot;our&quot;), a company registered in the Czech Republic. By accessing or using
              AgentForge, you agree to be bound by these Terms. If you do not agree, do not
              use the service.
            </p>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">1. Service Description</h2>
              <p>
                AgentForge is a marketplace for MCP (Model Context Protocol) servers that
                enables AI agents and developers to discover, connect to, and use tool servers
                through a unified API. The platform provides:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>MCP server discovery and browsing with trust scoring</li>
                <li>AI agent self-registration and identity management</li>
                <li>Authenticated tool-calling API for invoking MCP server tools</li>
                <li>API key management and usage tracking</li>
                <li>Subscription-based billing for platform access</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">2. Account Types</h2>
              <p>AgentForge supports two types of accounts:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-foreground">Human accounts:</strong> Created via email
                  and password through Supabase Auth. Human users can manage API keys, publish
                  servers, manage subscriptions, and access the dashboard. Each human account
                  is associated with API keys using the af_ prefix.
                </li>
                <li>
                  <strong className="text-foreground">Agent accounts:</strong> Created via the
                  self-registration API (POST /api/v1/agents). Agent accounts receive identity
                  keys using the af_agent_ prefix. Agent accounts are intended for autonomous
                  AI agents and have the same API access as human-created keys.
                </li>
              </ul>
              <p>
                You are responsible for maintaining the confidentiality of your account
                credentials and API keys. You are liable for all activity conducted through
                your account or keys. Notify us immediately at{" "}
                <a href="mailto:legal@agentforge.community" className="text-primary hover:underline">
                  legal@agentforge.community
                </a>
                {" "}if you suspect unauthorized use.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">3. Acceptable Use</h2>
              <p>You agree not to use AgentForge to:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Violate any applicable law or regulation</li>
                <li>
                  Abuse the API through excessive requests beyond your plan&apos;s rate limits,
                  denial-of-service attacks, or deliberate circumvention of rate limiting
                </li>
                <li>
                  Scrape, crawl, or systematically extract data from the platform beyond what
                  is provided through the documented API
                </li>
                <li>
                  Publish or distribute MCP servers that contain malicious code, malware,
                  backdoors, or that perform undisclosed data collection
                </li>
                <li>
                  Distribute illegal content, infringe on intellectual property rights, or
                  facilitate illegal activities through MCP tools
                </li>
                <li>
                  Impersonate other users, agents, or server publishers
                </li>
                <li>
                  Attempt to gain unauthorized access to other users&apos; accounts, data, or
                  API keys
                </li>
              </ul>
              <p>
                We reserve the right to suspend or terminate accounts that violate these terms,
                with or without prior notice depending on the severity of the violation.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">4. API Usage and Rate Limits</h2>
              <p>
                API access is governed by your subscription plan. Current limits are as follows:
              </p>
              <div className="glass-card rounded-xl p-6 space-y-4">
                <div>
                  <strong className="text-foreground">Free tier:</strong>
                  <ul className="list-disc pl-5 space-y-1 mt-1">
                    <li>100 API calls per month</li>
                    <li>1 API key</li>
                    <li>No SLA or uptime guarantee</li>
                    <li>Community support only</li>
                  </ul>
                </div>
                <div>
                  <strong className="text-foreground">Pro tier:</strong>
                  <ul className="list-disc pl-5 space-y-1 mt-1">
                    <li>10,000 API calls per month</li>
                    <li>Up to 10 API keys</li>
                    <li>Priority support</li>
                  </ul>
                </div>
              </div>
              <p>
                Requests that exceed your plan&apos;s rate limits will receive an HTTP 429
                (Too Many Requests) response. We may adjust rate limits with 30 days&apos;
                notice. Unused API calls do not carry over between billing periods.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">5. Server Publishers</h2>
              <p>
                MCP servers listed on AgentForge are provided by third-party publishers.
                Publishers are solely responsible for:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>The functionality, accuracy, and availability of their servers</li>
                <li>Complying with applicable laws in the jurisdictions where their tools operate</li>
                <li>Ensuring their servers do not process personal data without proper legal basis</li>
                <li>Providing accurate descriptions of their server&apos;s capabilities</li>
              </ul>
              <p>
                AgentForge assigns trust scores to servers based on automated verification,
                community feedback, and editorial review. Trust scores are informational only
                and do not constitute a warranty, endorsement, or guarantee of any
                server&apos;s quality, security, or fitness for a particular purpose.
              </p>
              <p>
                By publishing a server on AgentForge, publishers grant us a non-exclusive,
                worldwide license to list, describe, and facilitate API access to their server
                through the platform.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">6. Billing and Payments</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  All payment processing is handled by Stripe. By subscribing to a paid plan,
                  you also agree to Stripe&apos;s terms of service.
                </li>
                <li>
                  All prices are displayed and charged in EUR. For EU customers, prices include
                  applicable VAT. VAT rates are determined by your country of residence.
                </li>
                <li>
                  Subscriptions are billed monthly and auto-renew at the start of each billing
                  period unless cancelled.
                </li>
                <li>
                  You may cancel your subscription at any time through the dashboard. Cancellation
                  takes effect at the end of the current billing period. You retain access to
                  paid features until the period ends.
                </li>
                <li>
                  No refunds are provided for partial billing periods. If you cancel mid-period,
                  you will not be charged again but will not receive a prorated refund.
                </li>
                <li>
                  We reserve the right to change pricing with 30 days&apos; advance notice.
                  Price changes apply to the next billing period after the notice period.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">7. Intellectual Property</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-foreground">Platform:</strong> AgentForge, including
                  its design, code, API, documentation, and branding, is owned by KOWEX Co.
                  Holding. All rights reserved.
                </li>
                <li>
                  <strong className="text-foreground">Publishers:</strong> Server publishers
                  retain all intellectual property rights to their MCP servers, tools, and
                  associated content. Listing on AgentForge does not transfer IP ownership.
                </li>
                <li>
                  <strong className="text-foreground">Users:</strong> Users retain ownership of
                  all data they submit to the platform, including account information and data
                  passed through API calls.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">8. Limitation of Liability</h2>
              <p>
                The AgentForge platform is provided &quot;as is&quot; and &quot;as
                available&quot; without warranties of any kind, whether express or implied,
                including but not limited to implied warranties of merchantability, fitness
                for a particular purpose, and non-infringement.
              </p>
              <p>
                We do not warrant that:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>The service will be uninterrupted, timely, secure, or error-free</li>
                <li>Third-party MCP servers will function correctly or be available</li>
                <li>Results obtained through MCP tools will be accurate or reliable</li>
              </ul>
              <p>
                To the maximum extent permitted by applicable law, our total aggregate liability
                for any claims arising from or related to your use of AgentForge shall not
                exceed the total fees you have paid to us in the 12 months preceding the
                claim. This limitation applies to all causes of action, whether in contract,
                tort (including negligence), strict liability, or otherwise.
              </p>
              <p>
                Nothing in these Terms excludes or limits liability for death or personal
                injury caused by negligence, fraud, or any liability that cannot be excluded
                under applicable law.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">9. Termination</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-foreground">By you:</strong> You may delete your
                  account at any time through the dashboard or by contacting us. Active
                  subscriptions should be cancelled before account deletion to prevent further
                  charges.
                </li>
                <li>
                  <strong className="text-foreground">By us:</strong> We may suspend or terminate
                  your account immediately for material violations of these Terms (such as abuse,
                  illegal activity, or security threats). For non-material violations, we will
                  provide 14 days&apos; notice and an opportunity to remedy the issue.
                </li>
                <li>
                  <strong className="text-foreground">Effect of termination:</strong> Upon
                  termination, your API keys are immediately deactivated. Personal data is
                  handled in accordance with our Privacy Policy, including applicable retention
                  periods.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">10. Data Protection</h2>
              <p>
                We process personal data in compliance with the GDPR and applicable Czech data
                protection law. Full details are provided in our{" "}
                <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>,
                which forms an integral part of these Terms.
              </p>
              <p>
                For MCP server publishers who process personal data through the platform, a
                Data Processing Agreement (DPA) is available upon request at{" "}
                <a href="mailto:legal@agentforge.community" className="text-primary hover:underline">
                  legal@agentforge.community
                </a>
                .
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">11. Modifications to Terms</h2>
              <p>
                We may modify these Terms from time to time. For material changes, we will
                notify you by email at least 30 days before the changes take effect. Your
                continued use of AgentForge after the effective date of modified Terms
                constitutes acceptance. If you do not agree to the modified Terms, you must
                stop using the service and may delete your account.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">12. Governing Law and Disputes</h2>
              <p>
                These Terms are governed by and construed in accordance with the laws of the
                Czech Republic and applicable European Union regulations, without regard to
                conflict of law principles.
              </p>
              <p>
                Any disputes arising from or in connection with these Terms shall be submitted
                to the exclusive jurisdiction of the competent courts in Prague, Czech Republic.
              </p>
              <p>
                For EU consumers: you may also use the European Commission&apos;s Online
                Dispute Resolution platform at{" "}
                <a
                  href="https://ec.europa.eu/consumers/odr"
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ec.europa.eu/consumers/odr
                </a>
                .
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">13. Severability</h2>
              <p>
                If any provision of these Terms is held to be invalid or unenforceable, the
                remaining provisions shall continue in full force and effect. The invalid
                provision shall be replaced by a valid provision that most closely reflects
                the original intent.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">14. Contact</h2>
              <p>
                For questions about these Terms of Service, contact us at:
              </p>
              <div className="glass-card rounded-xl p-6">
                <p>
                  <strong className="text-foreground">KOWEX Co. Holding</strong>
                </p>
                <p>
                  Email:{" "}
                  <a href="mailto:legal@agentforge.community" className="text-primary hover:underline">
                    legal@agentforge.community
                  </a>
                </p>
                <p>
                  Privacy inquiries:{" "}
                  <a href="mailto:privacy@agentforge.community" className="text-primary hover:underline">
                    privacy@agentforge.community
                  </a>
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
