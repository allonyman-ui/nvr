import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Chase Privacy Policy — how we collect, use, and protect your data.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* ── NAVBAR ── */}
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">C</span>
            </div>
            <span className="text-slate-900 font-semibold text-sm tracking-tight">Chase</span>
          </Link>
          <Link href="/" className="text-slate-500 hover:text-slate-900 text-sm transition-colors">
            ← Back to home
          </Link>
        </div>
      </nav>

      {/* ── HEADER ── */}
      <div className="bg-slate-50 border-b border-slate-200 py-12 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-indigo-600 text-sm font-semibold uppercase tracking-widest mb-3">Legal</p>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-3">Privacy Policy</h1>
          <p className="text-slate-500">Last updated: March 2026</p>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="prose prose-slate max-w-none">

          <div className="bg-indigo-50 border border-indigo-200 rounded-xl px-6 py-4 mb-10">
            <p className="text-indigo-800 text-sm leading-relaxed">
              <strong>Plain-English summary:</strong> We collect the minimum data needed to run Chase — your account info, invoice data, and usage analytics. We use Stripe for payments, Supabase to store your data, and Resend to send emails. We never sell your data. You can delete your account and all data at any time.
            </p>
          </div>

          <Section title="1. Who We Are">
            <p>
              Chase (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is an invoice management and automated follow-up service for freelancers. This Privacy Policy explains how we collect, use, and protect information about you when you use our platform at <a href="https://hardcore-benz.vercel.app" className="text-indigo-600 hover:underline">hardcore-benz.vercel.app</a>.
            </p>
            <p>
              Questions about this policy? Email us at <a href="mailto:hello@getchase.io" className="text-indigo-600 hover:underline">hello@getchase.io</a>.
            </p>
          </Section>

          <Section title="2. Information We Collect">
            <p>We collect the following categories of information:</p>

            <h3 className="font-semibold text-slate-800 mt-4 mb-2">Account information</h3>
            <ul>
              <li>Email address (required to create an account)</li>
              <li>Password (stored as a secure hash — we never see your plaintext password)</li>
              <li>Name (optional, used in invoice sender details)</li>
            </ul>

            <h3 className="font-semibold text-slate-800 mt-4 mb-2">Business data you provide</h3>
            <ul>
              <li>Client names, email addresses, and company information</li>
              <li>Invoice details: line items, amounts, due dates, and notes</li>
              <li>Email templates you customise for follow-up messages</li>
              <li>Your Stripe account connection (we store your Stripe account ID, not payment card details)</li>
            </ul>

            <h3 className="font-semibold text-slate-800 mt-4 mb-2">Usage data</h3>
            <ul>
              <li>Log data: pages visited, actions taken, timestamps</li>
              <li>Device information: browser type, operating system</li>
              <li>IP address</li>
            </ul>

            <h3 className="font-semibold text-slate-800 mt-4 mb-2">Payment information</h3>
            <p>
              Chase does not store your credit card details. Payment for Chase subscriptions is handled entirely by Stripe. We receive only a Stripe customer ID and subscription status.
            </p>
          </Section>

          <Section title="3. How We Use Your Information">
            <p>We use your information to:</p>
            <ul>
              <li><strong>Provide the Service</strong> — create accounts, store invoices and clients, send follow-up emails on your behalf</li>
              <li><strong>Process payments</strong> — manage your Chase subscription via Stripe</li>
              <li><strong>Send transactional emails</strong> — account confirmations, invoice copies, payment notifications, and follow-up sequences</li>
              <li><strong>Improve the Service</strong> — analyse usage patterns to fix bugs and build new features</li>
              <li><strong>Communicate with you</strong> — respond to support requests and send important account updates</li>
              <li><strong>Comply with legal obligations</strong> — retain records as required by applicable law</li>
            </ul>
            <p>We do not use your data for advertising and we do not sell your data to any third party.</p>
          </Section>

          <Section title="4. Third-Party Services">
            <p>Chase uses the following trusted third-party services to operate:</p>

            <div className="space-y-4 mt-2">
              {[
                {
                  name: 'Supabase',
                  role: 'Database and authentication',
                  desc: 'Stores your account, client, and invoice data. Data is encrypted at rest and in transit. Supabase uses row-level security so your data is only accessible to you.',
                  link: 'https://supabase.com/privacy',
                },
                {
                  name: 'Stripe',
                  role: 'Payments',
                  desc: 'Processes Chase subscription payments and generates invoice payment links for your clients. Stripe is PCI-DSS compliant. Chase does not store card details — all payment data lives with Stripe.',
                  link: 'https://stripe.com/privacy',
                },
                {
                  name: 'Resend',
                  role: 'Transactional email',
                  desc: 'Sends invoice emails and follow-up sequences to your clients on your behalf. Email content is generated by Chase and transmitted to Resend for delivery.',
                  link: 'https://resend.com/privacy',
                },
                {
                  name: 'Vercel',
                  role: 'Hosting and infrastructure',
                  desc: 'Hosts the Chase application. Vercel processes server requests and may log IP addresses and request metadata for security and performance purposes.',
                  link: 'https://vercel.com/legal/privacy-policy',
                },
              ].map((p) => (
                <div key={p.name} className="border border-slate-200 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-slate-900">{p.name}</p>
                    <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{p.role}</span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed mb-2">{p.desc}</p>
                  <a href={p.link} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline text-xs">
                    {p.name} Privacy Policy →
                  </a>
                </div>
              ))}
            </div>
          </Section>

          <Section title="5. Your Client's Data">
            <p>
              When you use Chase to invoice clients, you provide us with your clients&rsquo; email addresses and business details. You are the data controller for your clients&rsquo; information, and Chase processes it as a data processor on your behalf.
            </p>
            <p>
              You are responsible for ensuring you have the right to share your clients&rsquo; contact information with Chase and that doing so complies with applicable privacy laws.
            </p>
            <p>
              Chase uses client email addresses solely to send invoices and follow-up emails that you initiate. We do not market to your clients or contact them for any purpose other than sending emails you create.
            </p>
          </Section>

          <Section title="6. Data Retention">
            <p>
              We retain your data for as long as your account is active. Specifically:
            </p>
            <ul>
              <li><strong>Account data</strong>: Retained until you delete your account</li>
              <li><strong>Invoice and client data</strong>: Retained until you delete the records or close your account</li>
              <li><strong>Usage logs</strong>: Retained for up to 90 days for security and debugging</li>
              <li><strong>Billing records</strong>: Retained for 7 years as required by financial regulations</li>
            </ul>
            <p>
              When you delete your account, we permanently delete all your personal data within 30 days, except where retention is required by law.
            </p>
          </Section>

          <Section title="7. Your Rights">
            <p>Depending on your location, you may have the following rights regarding your personal data:</p>
            <ul>
              <li><strong>Access</strong>: Request a copy of the data we hold about you</li>
              <li><strong>Correction</strong>: Request that we correct inaccurate data</li>
              <li><strong>Deletion</strong>: Request that we delete your data (the &ldquo;right to be forgotten&rdquo;)</li>
              <li><strong>Portability</strong>: Request your data in a machine-readable format</li>
              <li><strong>Objection</strong>: Object to certain processing of your data</li>
              <li><strong>Restriction</strong>: Request we restrict processing in certain circumstances</li>
            </ul>
            <p>
              To exercise any of these rights, email us at <a href="mailto:hello@getchase.io" className="text-indigo-600 hover:underline">hello@getchase.io</a>. We will respond within 30 days.
            </p>
            <p>
              You can delete your Chase account at any time from your account settings. This will initiate deletion of all associated personal data.
            </p>
          </Section>

          <Section title="8. Security">
            <p>
              We take the security of your data seriously. Chase implements the following measures:
            </p>
            <ul>
              <li>All data is encrypted in transit using TLS 1.2+</li>
              <li>All data is encrypted at rest in Supabase&rsquo;s infrastructure</li>
              <li>Row-level security on all database tables ensures your data is only accessible to your account</li>
              <li>Passwords are hashed using bcrypt and never stored in plaintext</li>
              <li>Authentication tokens are short-lived and rotated regularly</li>
            </ul>
            <p>
              While we take reasonable steps to protect your data, no internet service is 100% secure. If you believe your account has been compromised, please contact us immediately.
            </p>
          </Section>

          <Section title="9. Cookies">
            <p>
              Chase uses cookies and similar technologies to maintain your session and authentication state. Specifically:
            </p>
            <ul>
              <li><strong>Session cookies</strong>: Required for you to stay logged in while using Chase. These are deleted when you close your browser.</li>
              <li><strong>Authentication cookies</strong>: Set by Supabase to maintain your login session securely.</li>
            </ul>
            <p>
              Chase does not use advertising cookies, tracking pixels, or third-party analytics cookies. We do not use Google Analytics or similar tools that track you across websites.
            </p>
          </Section>

          <Section title="10. Children's Privacy">
            <p>
              Chase is not intended for use by anyone under the age of 18. We do not knowingly collect personal information from minors. If we become aware that we have collected data from someone under 18, we will delete it promptly.
            </p>
          </Section>

          <Section title="11. International Transfers">
            <p>
              Chase and its third-party providers operate globally. Your data may be stored and processed in the United States or other countries. By using Chase, you consent to this transfer. We ensure appropriate safeguards are in place when transferring data internationally, in accordance with applicable privacy law.
            </p>
          </Section>

          <Section title="12. Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time. When we do, we will notify you by email and update the &ldquo;Last updated&rdquo; date at the top of this page. We encourage you to review this policy periodically.
            </p>
            <p>
              Continued use of Chase after changes take effect constitutes your acceptance of the updated policy.
            </p>
          </Section>

          <Section title="13. Contact">
            <p>
              If you have any questions, concerns, or requests regarding this Privacy Policy or your personal data, please contact us:
            </p>
            <ul>
              <li>Email: <a href="mailto:hello@getchase.io" className="text-indigo-600 hover:underline">hello@getchase.io</a></li>
            </ul>
            <p>We aim to respond to all privacy-related inquiries within 5 business days.</p>
          </Section>

        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer className="border-t border-slate-200 py-8 px-6">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-400 text-sm">© 2026 Chase. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="text-slate-500 font-medium text-sm">Privacy Policy</Link>
            <Link href="/terms" className="text-slate-400 hover:text-slate-600 text-sm transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold text-slate-900 mb-4 mt-10 pb-3 border-b border-slate-200">{title}</h2>
      <div className="space-y-4 text-slate-600 leading-relaxed text-[0.9375rem]">
        {children}
      </div>
    </section>
  )
}
