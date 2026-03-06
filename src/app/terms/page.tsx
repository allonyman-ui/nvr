import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Chase Terms of Service — the rules and conditions for using Chase.',
}

export default function TermsPage() {
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
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-3">Terms of Service</h1>
          <p className="text-slate-500">Last updated: March 2026</p>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="prose prose-slate max-w-none">

          <div className="bg-indigo-50 border border-indigo-200 rounded-xl px-6 py-4 mb-10">
            <p className="text-indigo-800 text-sm leading-relaxed">
              <strong>Plain-English summary:</strong> Chase is a tool for freelancers to send invoices and automate payment follow-ups via Stripe. Use it legally and honestly. Pay for what you use. We can terminate accounts that abuse the service. We&rsquo;re not liable for late payments or client disputes.
            </p>
          </div>

          <Section title="1. Acceptance of Terms">
            <p>
              By creating an account and using Chase (&ldquo;the Service&rdquo;), you agree to be bound by these Terms of Service (&ldquo;Terms&rdquo;). If you do not agree, do not use the Service. These Terms apply to all users, including visitors, free-plan users, and paying subscribers.
            </p>
            <p>
              We may update these Terms from time to time. If we make material changes, we will notify you by email or by displaying a notice in the app. Continued use of the Service after changes constitutes acceptance of the new Terms.
            </p>
          </Section>

          <Section title="2. Description of Service">
            <p>
              Chase is a software-as-a-service platform that allows freelancers and independent contractors to:
            </p>
            <ul>
              <li>Create and send professional invoices to clients</li>
              <li>Generate Stripe payment links embedded in invoice emails</li>
              <li>Automate follow-up email sequences for unpaid invoices</li>
              <li>Track invoice status (sent, chasing, overdue, paid)</li>
            </ul>
            <p>
              Chase is a communication and workflow tool. We do not guarantee that your clients will pay, and we are not a collections agency or legal service.
            </p>
          </Section>

          <Section title="3. Account Registration">
            <p>
              To use Chase, you must create an account with a valid email address. You are responsible for:
            </p>
            <ul>
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activity that occurs under your account</li>
              <li>Notifying us immediately of any unauthorised use</li>
            </ul>
            <p>
              You must be at least 18 years old and legally authorised to enter into contracts in your jurisdiction to use Chase. By registering, you represent that this is the case.
            </p>
          </Section>

          <Section title="4. Payments and Subscription Plans">
            <p>Chase offers the following plans:</p>
            <ul>
              <li><strong>Free Plan:</strong> Up to 3 active invoices at no cost.</li>
              <li>
                <strong>Pro Plan ($19/month):</strong> Unlimited invoices, custom templates, and priority support. Billed monthly. Includes a 14-day free trial. Your card is charged at the end of the trial unless you cancel beforehand.
              </li>
              <li>
                <strong>Success Fee Plan (5%):</strong> No monthly fee. Chase charges 5% of the total amount of each invoice that is recovered through Chase&rsquo;s follow-up sequence. &ldquo;Recovered&rdquo; means the client paid after Chase sent at least one follow-up email.
              </li>
            </ul>
            <p>
              All payments to Chase are processed via Stripe. By subscribing to a paid plan, you authorise Chase to charge your payment method on a recurring basis (for Pro) or per recovered invoice (for Success Fee).
            </p>
            <p>
              Separately, all invoice payments from your clients are processed through your own connected Stripe account. Stripe&rsquo;s standard transaction fees (currently 2.9% + 30¢) apply to all client payments. Chase is not responsible for Stripe&rsquo;s fees or policies.
            </p>
          </Section>

          <Section title="5. Free Trial">
            <p>
              Pro plan subscriptions include a 14-day free trial. No credit card is required to start the trial. At the end of the trial period, you will be asked to provide payment details to continue with Pro. If you do not upgrade, your account reverts to the Free plan (limited to 3 active invoices).
            </p>
          </Section>

          <Section title="6. Cancellation and Refunds">
            <p>
              You may cancel your subscription at any time from your billing settings. Upon cancellation:
            </p>
            <ul>
              <li>You retain access to Pro features until the end of your current billing period.</li>
              <li>Your account reverts to the Free plan after that period ends.</li>
              <li>We do not offer prorated refunds for partial months.</li>
            </ul>
            <p>
              If you believe you were charged in error, contact us at <a href="mailto:hello@getchase.io" className="text-indigo-600 hover:underline">hello@getchase.io</a> within 30 days and we will review your case.
            </p>
          </Section>

          <Section title="7. Stripe Integration">
            <p>
              Chase uses Stripe to generate payment links and process invoice payments. To send invoices with payment links, you must connect a Stripe account. By connecting your Stripe account, you agree to <a href="https://stripe.com/legal" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">Stripe&rsquo;s Terms of Service</a>.
            </p>
            <p>
              Chase is not responsible for funds held, delayed, or withheld by Stripe. Disputes between you and your clients regarding payment are your responsibility to resolve.
            </p>
          </Section>

          <Section title="8. Acceptable Use">
            <p>You agree not to use Chase to:</p>
            <ul>
              <li>Send fraudulent, deceptive, or misleading invoices</li>
              <li>Invoice clients for services not rendered</li>
              <li>Send harassing, abusive, or threatening communications</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Attempt to reverse-engineer, scrape, or copy the Service</li>
              <li>Use the Service in a way that damages, disables, or impairs it</li>
              <li>Create accounts for purposes other than legitimate business invoicing</li>
            </ul>
            <p>
              Violation of these rules may result in immediate suspension or termination of your account without refund.
            </p>
          </Section>

          <Section title="9. Email Communications">
            <p>
              Chase sends emails on your behalf to your clients. By using the Service, you represent that:
            </p>
            <ul>
              <li>You have a legitimate business relationship with each client you invoice</li>
              <li>You have the right to contact those clients for payment purposes</li>
              <li>The invoices you create reflect real work performed or services provided</li>
            </ul>
            <p>
              Chase complies with applicable anti-spam laws. Misuse of the email functionality to send unsolicited commercial email (&ldquo;spam&rdquo;) is strictly prohibited.
            </p>
          </Section>

          <Section title="10. Intellectual Property">
            <p>
              The Chase platform, including its design, code, and content, is owned by Chase and protected by intellectual property law. You are granted a limited, non-exclusive licence to use the Service for your own business purposes.
            </p>
            <p>
              Your invoice content, client data, and business information remain your property. By using Chase, you grant us a limited licence to process and store your data solely to provide the Service.
            </p>
          </Section>

          <Section title="11. Disclaimers">
            <p>
              The Service is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without warranties of any kind, express or implied. We do not warrant that:
            </p>
            <ul>
              <li>The Service will be uninterrupted, error-free, or secure at all times</li>
              <li>Follow-up emails will result in payment from your clients</li>
              <li>Stripe payment links will always be accepted by your clients</li>
            </ul>
            <p>
              Chase is a tool to assist you — ultimate responsibility for collecting payment from clients remains with you.
            </p>
          </Section>

          <Section title="12. Limitation of Liability">
            <p>
              To the maximum extent permitted by law, Chase and its founders, employees, and affiliates shall not be liable for:
            </p>
            <ul>
              <li>Lost revenue, profits, or business opportunities</li>
              <li>Client non-payment or disputes</li>
              <li>Indirect, incidental, or consequential damages arising from use of the Service</li>
            </ul>
            <p>
              Our total liability to you for any claim arising from your use of the Service shall not exceed the total amount you paid to Chase in the 3 months preceding the claim.
            </p>
          </Section>

          <Section title="13. Termination">
            <p>
              Either party may terminate the relationship at any time. You may close your account from your settings. We may suspend or terminate your account if you violate these Terms, with or without notice.
            </p>
            <p>
              Upon termination, your right to use the Service ends immediately. We may retain certain data as required by law or for legitimate business purposes, subject to our Privacy Policy.
            </p>
          </Section>

          <Section title="14. Governing Law">
            <p>
              These Terms are governed by the laws of the jurisdiction in which Chase is registered. Any disputes arising from these Terms shall be resolved by binding arbitration or in the courts of that jurisdiction, as applicable.
            </p>
          </Section>

          <Section title="15. Contact">
            <p>
              Questions about these Terms? Contact us:
            </p>
            <ul>
              <li>Email: <a href="mailto:hello@getchase.io" className="text-indigo-600 hover:underline">hello@getchase.io</a></li>
            </ul>
          </Section>

        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer className="border-t border-slate-200 py-8 px-6">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-400 text-sm">© 2026 Chase. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="text-slate-400 hover:text-slate-600 text-sm transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-slate-500 font-medium text-sm">Terms of Service</Link>
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
