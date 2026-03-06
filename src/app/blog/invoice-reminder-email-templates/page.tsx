import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '7 Invoice Reminder Email Templates That Actually Get You Paid (2026)',
  description:
    'Copy-paste invoice reminder email templates for every stage — polite day-3 nudge, firm day-7 follow-up, urgent day-14 notice, and final demand. Written for freelancers.',
  keywords: [
    'invoice reminder email template',
    'invoice reminder email',
    'payment reminder email template',
    'overdue invoice email template',
    'invoice follow up email',
    'late payment reminder email',
    'freelancer invoice reminder',
    'invoice email templates',
  ],
  openGraph: {
    title: '7 Invoice Reminder Email Templates That Actually Get You Paid',
    description:
      'Copy-paste invoice reminder email templates for every stage — from polite nudge to firm final notice.',
    url: 'https://chase.allonys.com/blog/invoice-reminder-email-templates',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: '7 Invoice Reminder Email Templates That Actually Get You Paid',
    description: 'Copy-paste invoice reminder emails for every stage of the follow-up process.',
  },
  alternates: {
    canonical: 'https://chase.allonys.com/blog/invoice-reminder-email-templates',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: '7 Invoice Reminder Email Templates That Actually Get You Paid',
  description:
    'Copy-paste invoice reminder email templates for every stage — polite day-3 nudge through firm final notice.',
  datePublished: '2026-03-04',
  dateModified: '2026-03-04',
  author: {
    '@type': 'Organization',
    name: 'Chase',
    url: 'https://chase.allonys.com',
  },
  publisher: {
    '@type': 'Organization',
    name: 'Chase',
    url: 'https://chase.allonys.com',
  },
}

interface TemplateBlockProps {
  number: number
  label: string
  timing: string
  subject: string
  body: string
  tip: string
}

function TemplateBlock({ number, label, timing, subject, body, tip }: TemplateBlockProps) {
  return (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-4">
        <span className="bg-indigo-600 text-white text-xs font-bold w-7 h-7 rounded-full flex items-center justify-center shrink-0">
          {number}
        </span>
        <div>
          <h3 className="text-xl font-bold text-slate-900">{label}</h3>
          <span className="text-sm text-indigo-600 font-medium">{timing}</span>
        </div>
      </div>
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
          Copy-paste template
        </p>
        <p className="text-sm text-slate-700 mb-1">
          <strong>Subject:</strong> {subject}
        </p>
        <div className="mt-4 text-sm text-slate-700 leading-relaxed whitespace-pre-line font-mono border-t border-slate-200 pt-4">
          {body}
        </div>
      </div>
      <p className="text-sm text-slate-500 mt-3 italic border-l-2 border-indigo-200 pl-3">{tip}</p>
    </div>
  )
}

export default function InvoiceReminderEmailTemplatesPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Chase', item: 'https://chase.allonys.com' },
            { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://chase.allonys.com/blog' },
            { '@type': 'ListItem', position: 3, name: '7 Invoice Reminder Email Templates That Actually Get You Paid', item: 'https://chase.allonys.com/blog/invoice-reminder-email-templates' },
          ],
        }) }}
      />

      {/* Nav */}
      <nav className="border-b border-slate-200 bg-white sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="font-semibold text-slate-900 text-base">Chase</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/blog" className="text-sm text-slate-500 hover:text-slate-900">Blog</Link>
            <Link
              href="/signup"
              className="inline-flex items-center gap-1.5 bg-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Start free →
            </Link>
          </div>
        </div>
      </nav>

      <article className="max-w-3xl mx-auto px-6 py-14 flex-1">
        {/* Breadcrumb */}
        <Link
          href="/blog"
          className="text-indigo-600 text-sm font-medium hover:underline inline-flex items-center gap-1 mb-6"
        >
          ← Blog
        </Link>

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-5">
            <span className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-2.5 py-1 rounded-full">
              Email Templates
            </span>
            <span className="text-slate-400 text-sm">March 2026 · 8 min read</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight leading-tight mb-5">
            7 Invoice Reminder Email Templates That Actually Get You Paid
          </h1>
          <p className="text-xl text-slate-500 leading-relaxed">
            You sent the invoice. Days go by. Nothing. Now you have to write that awkward
            follow-up email without sounding pushy, desperate, or passive-aggressive. Here are
            seven templates — one for every stage — so you never have to stare at a blank
            screen again.
          </p>
        </div>

        {/* Inline CTA */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-6 py-5 mb-10 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
          <div>
            <p className="font-semibold text-indigo-900 text-sm">Would rather not write these at all?</p>
            <p className="text-indigo-700 text-sm mt-0.5">
              Chase sends all seven automatically — and stops the moment your client pays.
            </p>
          </div>
          <Link
            href="/signup"
            className="shrink-0 bg-indigo-600 text-white font-semibold px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition-colors whitespace-nowrap"
          >
            Automate it free →
          </Link>
        </div>

        {/* Intro */}
        <div className="prose prose-slate max-w-none mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mt-0">Why chasing invoices is so painful</h2>
          <p className="text-slate-600 leading-relaxed">
            A 2025 survey by Xero found that 48% of freelancer invoices are paid late. That is
            not because clients are malicious — most of the time they simply forget, get
            distracted, or deprioritise what is not urgent to them. Your invoice sits in a
            busy inbox and never gets actioned.
          </p>
          <p className="text-slate-600 leading-relaxed">
            The fix is a consistent, polite follow-up sequence. Research shows that{' '}
            <strong>a second contact attempt doubles your response rate</strong>. By the third
            contact, you have recovered the vast majority of invoices that will ever be paid.
            The problem is that writing those emails from scratch each time is exhausting and
            time-consuming. That is what these templates solve.
          </p>
          <h2 className="text-2xl font-bold text-slate-900">
            The golden rules before you hit send
          </h2>
          <ul className="text-slate-600 space-y-2">
            <li>
              <strong>Always include the invoice number, amount, and due date</strong> in every
              email. Do not make your client dig for details.
            </li>
            <li>
              <strong>Include a direct payment link.</strong> Every extra click costs you money.
            </li>
            <li>
              <strong>Keep it short.</strong> Two to four sentences is enough for a reminder. Long
              emails signal you are nervous.
            </li>
            <li>
              <strong>Send from a consistent address.</strong> Clients recognise your name and are
              less likely to treat it as spam.
            </li>
            <li>
              <strong>Escalate the tone gradually</strong> — friendly first, firm later.
            </li>
          </ul>
        </div>

        {/* Templates */}
        <h2 className="text-2xl font-bold text-slate-900 mb-8">The 7 templates</h2>

        <TemplateBlock
          number={1}
          label="The Pre-Due Nudge"
          timing="3 days before due date"
          subject="Invoice #[NUMBER] due [DATE] — payment details inside"
          body={`Hi [Client name],

Just a quick heads-up that Invoice #[NUMBER] for [PROJECT] (£[AMOUNT]) is due on [DATE].

You can pay here: [PAYMENT LINK]

Let me know if you have any questions or need anything from my side.

[Your name]`}
          tip="Sending a reminder before the due date is the single highest-leverage thing you can do. Most late payments happen because the client simply forgot."
        />

        <TemplateBlock
          number={2}
          label="The Friendly Reminder"
          timing="Day 1 after due date"
          subject="Invoice #[NUMBER] — payment due yesterday"
          body={`Hi [Client name],

Just circling back on Invoice #[NUMBER] for £[AMOUNT], which was due on [DATE]. I imagine it may have slipped through the cracks — no worries at all.

Pay here: [PAYMENT LINK]

Do let me know if you have any questions.

Thanks,
[Your name]`}
          tip="Keep the tone warm and assume good intent. Most overdue invoices at this stage are genuine oversights, not cash flow problems."
        />

        <TemplateBlock
          number={3}
          label="The Week-7 Follow-Up"
          timing="Day 7 past due"
          subject="Re: Invoice #[NUMBER] — still awaiting payment"
          body={`Hi [Client name],

I'm following up again on Invoice #[NUMBER] for £[AMOUNT], now seven days past its due date of [DATE].

Could you let me know when you expect to process payment? If there is an issue with the invoice or the project, I am happy to discuss.

Pay here: [PAYMENT LINK]

[Your name]`}
          tip="The 'is there an issue?' line is important. It gives cash-strapped clients a face-saving way to open a conversation rather than staying silent."
        />

        <TemplateBlock
          number={4}
          label="The Day-14 Escalation"
          timing="Day 14 past due"
          subject="Invoice #[NUMBER] — 14 days overdue, action needed"
          body={`Hi [Client name],

Invoice #[NUMBER] for £[AMOUNT] is now 14 days overdue. This is my third attempt to reach you about this payment.

Please arrange payment by [NEW DATE — 5 days from now] using the link below, or reply to let me know when I can expect it.

Pay here: [PAYMENT LINK]

If I don't hear back within five business days, I will need to consider escalating this matter.

[Your name]`}
          tip="Naming a new deadline and hinting at escalation creates urgency without being aggressive. Many freelancers recover payment at exactly this point."
        />

        <TemplateBlock
          number={5}
          label="The Firm Final Notice"
          timing="Day 21 past due"
          subject="Final notice: Invoice #[NUMBER] — £[AMOUNT] overdue"
          body={`Hi [Client name],

This is a formal final notice for Invoice #[NUMBER] — £[AMOUNT] — issued on [ORIGINAL DATE] and now 21 days overdue.

I need payment by [DATE — 5 business days from now]. After this date, I will have no choice but to pursue this through a collections process or small claims court.

Pay here: [PAYMENT LINK]

If you are experiencing financial difficulty, please contact me immediately so we can agree on a payment plan.

[Your name]`}
          tip="Mention collections and small claims matter-of-factly, not as a threat. You are simply describing what happens next, which is more effective than emotional language."
        />

        <TemplateBlock
          number={6}
          label="The Payment Plan Offer"
          timing="Use any time after Day 7 if client flags cash flow issues"
          subject="Re: Invoice #[NUMBER] — payment plan option"
          body={`Hi [Client name],

I understand things can get tight. I want to make this work for both of us.

Here is what I can offer: split Invoice #[NUMBER] (£[AMOUNT]) into two equal payments — £[HALF] today and £[HALF] on [DATE — 30 days from now].

Just reply to confirm you're happy with this and I'll update the invoice.

[Your name]`}
          tip="Offering a payment plan recovers more cash than escalating immediately. A client who pays in two instalments is far better than one who never pays at all."
        />

        <TemplateBlock
          number={7}
          label="The Re-engagement After Silence"
          timing="Use if a client goes completely silent for 3+ weeks"
          subject="Still here when you're ready — Invoice #[NUMBER]"
          body={`Hi [Client name],

I haven't heard back from you for a few weeks regarding Invoice #[NUMBER] (£[AMOUNT]).

I'd like to resolve this without going through a formal process. If you have concerns about the work, please raise them — I'm happy to talk it through.

If everything was satisfactory, could you confirm a payment date?

Pay here: [PAYMENT LINK]

[Your name]`}
          tip="Sometimes clients go silent out of embarrassment or stress. This template re-opens the door without backing them into a corner — which often breaks the silence."
        />

        {/* Closing content */}
        <div className="prose prose-slate max-w-none mt-4">
          <h2 className="text-2xl font-bold text-slate-900">When to stop and escalate</h2>
          <p className="text-slate-600 leading-relaxed">
            If you have sent all seven templates over 30+ days and received no payment or
            communication, it is time to escalate. Your options, roughly in order of effort:
          </p>
          <ol className="text-slate-600 space-y-2">
            <li>
              <strong>Small claims court</strong> — in the UK, claims up to £10,000 cost
              between £35–£455 and can be filed online at gov.uk. Success rates are high when
              you have documented evidence of the work and invoice.
            </li>
            <li>
              <strong>Debt collection agency</strong> — they work on a percentage (typically
              15–30%) but require no upfront effort from you. Only worth it for larger invoices.
            </li>
            <li>
              <strong>Public naming</strong> — posting factually on social media about a
              non-paying client is legal in most jurisdictions if accurate. Use as a last resort.
            </li>
          </ol>

          <h2 className="text-2xl font-bold text-slate-900">Stop writing these emails manually</h2>
          <p className="text-slate-600 leading-relaxed">
            Writing follow-up emails individually for every unpaid invoice is one of the most
            demoralising parts of freelancing. You did the work. You should not have to spend
            another hour crafting perfectly worded emails on top of that.
          </p>
          <p className="text-slate-600 leading-relaxed">
            Chase automates the entire sequence. You send an invoice, Chase monitors it, and
            sends the right email at the right time — stopping automatically the moment your
            client pays. You never have to think about it.
          </p>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 bg-slate-900 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">
            Let Chase send these emails for you
          </h2>
          <p className="text-slate-400 mb-6 max-w-md mx-auto">
            Connect Stripe, create an invoice, and Chase handles the entire follow-up sequence
            automatically. Free for your first 3 invoices.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-indigo-500 transition-colors"
          >
            Start free — no card required →
          </Link>
        </div>
      </article>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-white/5 mt-16">
        <div className="max-w-3xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 bg-indigo-600 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-xs">C</span>
            </div>
            <span className="text-white/40 text-sm">Chase</span>
          </Link>
          <div className="flex gap-6">
            <Link href="/blog" className="text-white/40 text-sm hover:text-white/70">Blog</Link>
            <Link href="/privacy" className="text-white/40 text-sm hover:text-white/70">Privacy</Link>
            <Link href="/terms" className="text-white/40 text-sm hover:text-white/70">Terms</Link>
          </div>
          <p className="text-white/40 text-sm">© 2026 Chase</p>
        </div>
      </footer>
    </div>
  )
}
