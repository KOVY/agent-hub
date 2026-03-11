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
              Effective date: March 11, 2026
            </p>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">1. Data Controller</h2>
              <p>
                KOWEX Co. Holding (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;), a company registered in the
                Czech Republic, operates AgentForge (agentforge.community). We are the data
                controller responsible for your personal data in accordance with the General
                Data Protection Regulation (EU) 2016/679 (&quot;GDPR&quot;) and applicable Czech data
                protection law.
              </p>
              <p>
                Data protection contact:{" "}
                <a href="mailto:privacy@agentforge.community" className="text-primary hover:underline">
                  privacy@agentforge.community
                </a>
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">2. What We Collect</h2>
              <p>We collect the following categories of personal data:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-foreground">Account data:</strong> Email address and
                  authentication credentials (password hash managed by Supabase Auth). We do not
                  store plaintext passwords.
                </li>
                <li>
                  <strong className="text-foreground">Usage data:</strong> API call logs including
                  endpoints called, response status codes, timestamps, and rate-limit counters.
                </li>
                <li>
                  <strong className="text-foreground">Technical data:</strong> IP address, user agent
                  string, and request metadata collected automatically during API and website
                  interactions.
                </li>
                <li>
                  <strong className="text-foreground">Billing data:</strong> Subscription plan,
                  payment history, and invoices. All payment card processing is handled by
                  Stripe. We never receive, store, or have access to your full card number, CVV,
                  or card expiration date.
                </li>
                <li>
                  <strong className="text-foreground">Agent identity data:</strong> For AI agents
                  that self-register via our API, we store the agent name, declared capabilities,
                  API key (af_agent_ prefix), and associated usage logs.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">3. How We Use Your Data</h2>
              <p>We process personal data for the following purposes:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-foreground">Service delivery:</strong> Authenticating
                  your account, processing API requests, and providing access to MCP servers.
                </li>
                <li>
                  <strong className="text-foreground">Billing and payments:</strong> Managing
                  subscriptions, processing payments through Stripe, generating invoices, and
                  fulfilling Czech accounting obligations.
                </li>
                <li>
                  <strong className="text-foreground">Security:</strong> Detecting abuse,
                  preventing fraud, enforcing rate limits, and protecting the integrity of the
                  platform.
                </li>
                <li>
                  <strong className="text-foreground">Analytics:</strong> Aggregated, non-identifying
                  usage statistics to understand platform performance and usage patterns.
                </li>
                <li>
                  <strong className="text-foreground">Platform improvement:</strong> Identifying
                  bugs, improving API reliability, and developing new features based on usage
                  patterns.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">4. Legal Basis (GDPR Article 6)</h2>
              <p>We process your personal data on the following legal grounds:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-foreground">Contract performance (Art. 6(1)(b)):</strong>{" "}
                  Processing necessary to provide the AgentForge service, manage your account, and
                  fulfill our contractual obligations to you.
                </li>
                <li>
                  <strong className="text-foreground">Legitimate interest (Art. 6(1)(f)):</strong>{" "}
                  Security monitoring, fraud prevention, platform analytics, and service
                  improvement. We balance our interests against your rights and do not use this
                  basis for profiling or direct marketing.
                </li>
                <li>
                  <strong className="text-foreground">Consent (Art. 6(1)(a)):</strong> Where we
                  send optional marketing communications or newsletters. You may withdraw consent
                  at any time without affecting the lawfulness of prior processing.
                </li>
                <li>
                  <strong className="text-foreground">Legal obligation (Art. 6(1)(c)):</strong>{" "}
                  Retaining billing records as required by Czech accounting and tax law.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">5. Data Storage and Transfers</h2>
              <p>
                Your data is stored within the European Union. Our primary database is hosted on
                Supabase in the eu-central-1 region (AWS Frankfurt, Germany).
              </p>
              <p>
                Stripe processes payment data within the EU under its own GDPR compliance
                framework and acts as an independent data controller for payment card data.
              </p>
              <p>
                Vercel serves our website and API via its global edge network. While HTTP
                requests may be routed through non-EU edge nodes for performance, no personal
                data is persistently stored outside the EU. All database operations and
                authentication are processed within the EU region.
              </p>
              <p>
                We do not transfer personal data to countries outside the EU/EEA without
                appropriate safeguards (Standard Contractual Clauses or adequacy decisions)
                as required by GDPR Chapter V.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">6. Data Retention</h2>
              <p>We retain personal data only as long as necessary for its purpose:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-foreground">Account data:</strong> Retained for the
                  duration of your account. Deleted within 30 days of account deletion request.
                </li>
                <li>
                  <strong className="text-foreground">Usage logs:</strong> Retained for 90 days
                  for operational purposes, then automatically purged.
                </li>
                <li>
                  <strong className="text-foreground">Billing records:</strong> Retained for 10
                  years as required by Czech accounting law (Act No. 563/1991 Coll., on
                  Accounting).
                </li>
                <li>
                  <strong className="text-foreground">Agent data:</strong> Retained until the
                  agent is deactivated or the associated account is deleted. Agent usage logs
                  follow the same 90-day retention as human usage logs.
                </li>
                <li>
                  <strong className="text-foreground">Technical logs:</strong> IP addresses and
                  request metadata retained for 30 days for security purposes.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">7. Your Rights</h2>
              <p>
                Under the GDPR, you have the following rights regarding your personal data.
                To exercise any of these rights, contact us at{" "}
                <a href="mailto:privacy@agentforge.community" className="text-primary hover:underline">
                  privacy@agentforge.community
                </a>
                . We will respond within 30 days.
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-foreground">Right of access (Art. 15):</strong> Request
                  a copy of the personal data we hold about you.
                </li>
                <li>
                  <strong className="text-foreground">Right to rectification (Art. 16):</strong>{" "}
                  Request correction of inaccurate or incomplete data.
                </li>
                <li>
                  <strong className="text-foreground">Right to erasure (Art. 17):</strong> Request
                  deletion of your personal data (&quot;right to be forgotten&quot;), subject to legal
                  retention obligations.
                </li>
                <li>
                  <strong className="text-foreground">Right to restriction (Art. 18):</strong>{" "}
                  Request that we limit processing of your data in certain circumstances.
                </li>
                <li>
                  <strong className="text-foreground">Right to data portability (Art. 20):</strong>{" "}
                  Receive your data in a structured, commonly used, machine-readable format (JSON).
                </li>
                <li>
                  <strong className="text-foreground">Right to object (Art. 21):</strong> Object
                  to processing based on legitimate interest, including any profiling.
                </li>
                <li>
                  <strong className="text-foreground">Right to withdraw consent (Art. 7(3)):</strong>{" "}
                  Withdraw consent for any consent-based processing at any time.
                </li>
                <li>
                  <strong className="text-foreground">Right to lodge a complaint:</strong> You have
                  the right to file a complaint with the Czech Data Protection Authority
                  (UOOU - Urad pro ochranu osobnich udaju), Pplk. Sochora 27, 170 00 Prague 7,
                  Czech Republic,{" "}
                  <a href="https://www.uoou.cz" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                    www.uoou.cz
                  </a>
                  .
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">8. Cookies</h2>
              <p>
                AgentForge uses only essential session cookies required for authentication
                (Supabase Auth session tokens). These cookies are strictly necessary for the
                service to function and do not require consent under the ePrivacy Directive.
              </p>
              <p>
                We do not use tracking cookies, advertising cookies, or third-party analytics
                services. We do not use Google Analytics or similar tracking tools.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">9. AI Agent Data</h2>
              <p>
                AgentForge allows AI agents to self-register via our API and obtain agent
                identity keys (af_agent_ prefix). For registered agents, we collect and store:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Agent name and declared capabilities</li>
                <li>Agent API key and authentication metadata</li>
                <li>API usage logs (endpoints, timestamps, response codes)</li>
              </ul>
              <p>
                Agent operators (the humans or organizations deploying AI agents) are the data
                controllers for any personal data their agents submit to MCP servers through
                our platform. AgentForge acts as a data processor for such pass-through data
                and does not inspect or store API call payloads beyond the request lifecycle.
              </p>
              <p>
                If you are an agent operator, you are responsible for ensuring that your
                agent&apos;s use of AgentForge complies with GDPR and other applicable data
                protection regulations, including providing appropriate notices to any data
                subjects whose data your agent processes.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">10. Third-Party Data Processors</h2>
              <p>
                We use the following third-party processors who may process personal data on
                our behalf:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-foreground">Supabase Inc.</strong> — Database hosting,
                  authentication, and data storage (EU region, Frankfurt). Acts as a data
                  processor under a Data Processing Agreement.
                </li>
                <li>
                  <strong className="text-foreground">Stripe Inc.</strong> — Payment processing
                  and subscription management. Acts as an independent data controller for
                  payment card data. Certified under EU-U.S. Data Privacy Framework.
                </li>
                <li>
                  <strong className="text-foreground">Vercel Inc.</strong> — Website and API
                  hosting, edge delivery. Does not persistently store personal data. Operates
                  under Standard Contractual Clauses for any EU data processing.
                </li>
              </ul>
              <p>
                All processors are contractually bound to process data only on our instructions
                and to maintain appropriate security measures in accordance with GDPR Article 28.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">11. Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your
                personal data, including encryption in transit (TLS 1.2+), encryption at rest
                for database storage, API key hashing, access controls, and regular security
                reviews. Despite these measures, no system is completely secure, and we cannot
                guarantee absolute security.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">12. Changes to This Policy</h2>
              <p>
                We may update this privacy policy from time to time. For material changes that
                affect how we process your personal data, we will notify you by email at least
                30 days before the changes take effect. Non-material changes (such as
                clarifications or formatting) may be made without notice. The &quot;Effective
                date&quot; at the top of this page indicates when the policy was last updated.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">13. Contact</h2>
              <p>
                For any questions, concerns, or requests regarding this privacy policy or your
                personal data, contact us at:
              </p>
              <div className="glass-card rounded-xl p-6">
                <p>
                  <strong className="text-foreground">KOWEX Co. Holding</strong>
                </p>
                <p>
                  Email:{" "}
                  <a href="mailto:privacy@agentforge.community" className="text-primary hover:underline">
                    privacy@agentforge.community
                  </a>
                </p>
                <p>
                  Czech Data Protection Authority (UOOU):{" "}
                  <a href="https://www.uoou.cz" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                    www.uoou.cz
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
