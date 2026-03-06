import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'How to Chase Unpaid Invoices Without Ruining Client Relationships (2026)',
  description:
    'A step-by-step system for chasing unpaid invoices professionally — without the awkwardness or the anxiety. Includes email timing, psychology tips, and when to escalate.',
  keywords: [
    'how to chase unpaid invoice',
    'chasing unpaid invoices',
    'invoice follow up freelancer',
    'overdue invoice follow up',
    'how to collect overdue invoice',
    'client not paying invoice',
    'invoice chasing tips',
    'unpaid invoice freelancer',
  ],
  openGraph: {
    title: 'How to Chase Unpaid Invoices Without Ruining Client Relationships',
    description:
      'A step-by-step system for chasing unpaid invoices professionally — without the awkwardness or the anxiety.',
    url: 'https://chase.allonys.com/blog/how-to-chase-unpaid-invoice',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How to Chase Unpaid Invoices Without Ruining Client Relationships',
    description: 'A professional, step-by-step system for chasing unpaid invoices.',
  },
  alternates: {
    canonical: 'https://chase.allonys.com/blog/how-to-chase-unpaid-invoice',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'How to Chase Unpaid Invoices Without Ruining Client Relationships',
  description:
    'A step-by-step system for chasing unpaid invoices professionally — including email timing, psychology, and when to escalate.',
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

interface StepProps {
  step: number
  title: string
  timing: string
  children: React.ReactNode
}

function Step({ step, title, timing, children }: StepProps) {
  return (
    <div className="flex gap-5 mb-10">
      <div className="shrink-0">
        <div className="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center">
          <span className="text-indigo-700 font-bold text-sm">{step}</span>
        </div>
        {step < 5 && <div className="w-px h-full bg-indigo-100 mx-auto mt-2" />}
      </div>
      <div className="pb-10">
        <div className="flex flex-wrap items-baseline gap-3 mb-3">
          <h3 className="text-xl font-bold text-slate-900">{title}</h3>
          <span className="text-indigo-600 text-sm font-semibold bg-indigo-50 px-2.5 py-0.5 rounded-full">
            {timing}
          </span>
        </div>
        <div className="text-slate-600 leading-relaxed space-y-3">{children}</div>
      </div>
    </div>
  )
}

export default function HowToChaseUnpaidInvoicePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
              Getting Paid
            </span>
            <span className="text-slate-400 text-sm">March 2026 · 9 min read</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight leading-tight mb-5">
            How to Chase Unpaid Invoices Without Ruining Client Relationships
          </h1>
          <p className="text-xl text-slate-500 leading-relaxed">
            The hardest part of chasing an unpaid invoice is not the admin — it is the
            awkwardness. Nobody wants to feel like a debt collector with a client they
            genuinely like. Here is a professional, psychology-backed system that gets you
            paid without the relationship damage.
          </p>
        </div>

        {/* Inline CTA */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-6 py-5 mb-10 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
          <div>
            <p className="font-semibold text-indigo-900 text-sm">Skip the awkward emails entirely</p>
            <p className="text-indigo-700 text-sm mt-0.5">
              Chase sends the follow-ups automatically — professional tone, perfect timing, every time.
            </p>
          </div>
          <Link
            href="/signup"
            className="shrink-0 bg-indigo-600 text-white font-semibold px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition-colors whitespace-nowrap"
          >
            Try Chase free →
          </Link>
        </div>

        {/* The awkwardness section */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Why chasing invoices feels so uncomfortable
          </h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            For most freelancers, chasing unpaid invoices produces a specific kind of dread.
            You spent weeks delivering great work. Now you have to ask — again — for something
            you are already owed. It feels like begging. And you worry: will this damage the
            relationship? Will they think I am desperate? What if they leave a bad review?
          </p>
          <p className="text-slate-600 leading-relaxed mb-4">
            Here is the reframe that changes everything:{' '}
            <strong>
              chasing an invoice is not you being difficult — it is you enforcing a contract
              you both agreed to.
            </strong>{' '}
            When a client is late, they are the one in breach. Your follow-up is a professional,
            normal business act.
          </p>
          <p className="text-slate-600 leading-relaxed">
            In fact, studies consistently show that <strong>most clients pay late not because
            they cannot, but because your invoice is not their priority</strong>. Your reminder
            email simply makes it one. Most clients are not offended by follow-ups — they expect
            them.
          </p>
        </div>

        {/* Psychology section */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-10">
          <h3 className="font-bold text-amber-900 mb-3">The psychology of follow-up</h3>
          <div className="space-y-3 text-sm text-amber-800">
            <p>
              <strong>Assume good intent until proven otherwise.</strong> Emails get buried.
              Finance teams have queues. Your "how could they forget?!" invoice is just one of
              50 in their inbox. Irritation in your tone will always backfire.
            </p>
            <p>
              <strong>Give them an easy action.</strong> Every email should have exactly one
              clear thing to do: click the payment link. Ambiguity causes delay.
            </p>
            <p>
              <strong>Escalate tone gradually, not suddenly.</strong> A jump from friendly to
              threatening damages trust irreparably. Clients who feel attacked become adversaries.
              Warm, then firm, then formal.
            </p>
            <p>
              <strong>Deadlines create action.</strong> Vague requests get vague responses. A
              specific "please pay by Friday 7 March" is far more effective than "at your
              earliest convenience."
            </p>
          </div>
        </div>

        {/* Step-by-step system */}
        <h2 className="text-2xl font-bold text-slate-900 mb-8">
          The 5-step system for chasing unpaid invoices
        </h2>

        <Step step={1} title="Send before the due date" timing="3 days before due">
          <p>
            Do not wait for the invoice to go overdue. Send a short, friendly payment reminder
            three days before the due date. Include the invoice number, amount, due date, and
            a direct payment link.
          </p>
          <p>
            This single step dramatically reduces late payments. Clients who have forgotten will
            pay immediately. Those who have a cash flow issue will flag it now — giving you time
            to arrange a payment plan before it becomes a dispute.
          </p>
        </Step>

        <Step step={2} title="The same-day nudge" timing="Due date + 1 day">
          <p>
            If payment has not arrived by the day after the due date, send a brief, warm email.
            Mention the invoice is now past due, include the payment link, and keep it to two
            sentences. No lecture needed.
          </p>
          <p>
            At this stage, assume it is an oversight. Your tone should read as a helpful prompt,
            not a complaint. Something like: &ldquo;Just flagging that Invoice #123 was due
            yesterday — here&rsquo;s the link if you need it.&rdquo;
          </p>
        </Step>

        <Step step={3} title="The week-one follow-up" timing="Day 7 overdue">
          <p>
            By day seven, it is time to be a little more direct. Acknowledge that this is your
            second follow-up, include a new payment deadline (give them five business days), and
            ask whether there is anything preventing payment.
          </p>
          <p>
            That last question — &ldquo;is there anything on your side I should know?&rdquo; — is
            powerful. It gives clients a face-saving exit if they are embarrassed about cash
            flow, and it surfaces problems early so you can address them.
          </p>
        </Step>

        <Step step={4} title="The firm escalation" timing="Day 14–21 overdue">
          <p>
            If you reach two weeks with no payment and no communication, it is time to shift
            tone. Your email should be formal, brief, and clear about consequences. Name a final
            payment date. Mention that if it is not met, you will take further action.
          </p>
          <p>
            &ldquo;Further action&rdquo; deliberately avoids being specific. It could mean a
            collections agency, small claims court, or simply pausing future work. The ambiguity
            is intentional — it prompts the client to get in touch, which is the goal.
          </p>
        </Step>

        <Step step={5} title="Formal notice and escalation" timing="Day 30+ overdue">
          <p>
            After 30 days with no response, you have two credible paths: small claims court
            (quick and cheap for invoices under £10k in the UK) or a debt collection agency
            (no upfront cost, but they take 15–30%).
          </p>
          <p>
            Send one final written notice — by email and post if possible — stating the amount
            owed, the original due date, and your intent to take legal action within 14 days.
            In practice, many clients pay at this point to avoid the hassle of a formal dispute.
          </p>
        </Step>

        {/* Prevention section */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            How to prevent late payments in the first place
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                title: 'Shorten your payment terms',
                body: 'Net-30 invites late payment. Try Net-14 or even Net-7 for smaller invoices. Clients generally pay within whatever window you give them.',
              },
              {
                title: 'Require a deposit',
                body: '30–50% upfront ensures you are never chasing 100% of an invoice. It also pre-qualifies clients — those who resist paying a deposit often resist paying the final too.',
              },
              {
                title: 'Make payment trivially easy',
                body: 'Stripe payment links, bank transfer details in the email body, and a one-click pay button. Remove every possible obstacle.',
              },
              {
                title: 'Include interest on late payment',
                body: 'In the UK, the Late Payment Act entitles you to 8% + Bank of England base rate on overdue B2B invoices. Mentioning this in your terms of service prompts faster payment.',
              },
            ].map((item) => (
              <div key={item.title} className="border border-slate-200 rounded-xl p-5">
                <h4 className="font-semibold text-slate-900 mb-2">{item.title}</h4>
                <p className="text-sm text-slate-600">{item.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Automation section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            The case for automating your invoice follow-ups
          </h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            The five-step system above works. The problem is executing it consistently across
            every invoice you send. When you are busy with client work, follow-up emails are the
            first thing to slip. You forget, the invoice goes 30 days overdue, and now you are
            in the uncomfortable territory of formal notices rather than a simple day-3 nudge.
          </p>
          <p className="text-slate-600 leading-relaxed mb-4">
            Automated follow-up removes the cognitive load entirely. You send the invoice. The
            system watches the due date. The right email goes out at the right time, with your
            invoice details pre-filled and a payment link attached. When the client pays, the
            sequence stops. You get notified. Done.
          </p>
          <p className="text-slate-600 leading-relaxed">
            This is exactly what Chase does. It is not a complex CRM or a full invoicing
            platform — it is a focused tool that does one thing: makes sure you get paid on time,
            automatically, without you having to think about it.
          </p>
        </div>

        {/* Bottom CTA */}
        <div className="bg-slate-900 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">
            Stop chasing. Let Chase do it.
          </h2>
          <p className="text-slate-400 mb-6 max-w-md mx-auto">
            Set up Chase in 5 minutes. Send your first invoice. Chase monitors it and
            sends the entire follow-up sequence automatically — stopping the moment your
            client pays.
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
