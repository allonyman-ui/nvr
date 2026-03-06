import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'The 5-Step Late Payment Recovery Sequence Every Freelancer Needs (2026)',
  description:
    'The exact late payment email sequence for freelancers — what to send, when to send it, and what to say at each stage. Includes copy-paste templates and a timeline.',
  keywords: [
    'late payment email freelancer',
    'late payment recovery',
    'overdue invoice email sequence',
    'freelancer late payment',
    'invoice overdue email',
    'how to recover late payment',
    'payment recovery sequence',
    'freelancer invoice collection',
  ],
  openGraph: {
    title: 'The 5-Step Late Payment Recovery Sequence Every Freelancer Needs',
    description:
      'The exact late payment email sequence for freelancers — what to send, when to send it, and what to say.',
    url: 'https://chase.allonys.com/blog/late-payment-recovery-sequence',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The 5-Step Late Payment Recovery Sequence Every Freelancer Needs',
    description: 'What to send, when to send it, and what to say to recover late payments as a freelancer.',
  },
  alternates: {
    canonical: 'https://chase.allonys.com/blog/late-payment-recovery-sequence',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'The 5-Step Late Payment Recovery Sequence Every Freelancer Needs',
  description:
    'The exact late payment email sequence for freelancers — what to send, when to send it, and what to say at each stage.',
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

const sequence = [
  {
    step: 1,
    day: 'Day −3',
    label: 'Pre-due reminder',
    tone: 'Friendly',
    subject: 'Invoice #[NUMBER] due [DATE]',
    preview:
      'Just a quick heads-up that payment of £[AMOUNT] is due on [DATE]. Here is the payment link for your convenience.',
    goal: 'Catch forgetful clients before they go overdue. This alone reduces late payments by 30–40%.',
    toneColor: 'bg-emerald-100 text-emerald-700',
  },
  {
    step: 2,
    day: 'Day +1',
    label: 'Day-after nudge',
    tone: 'Warm',
    subject: 'Invoice #[NUMBER] — due yesterday',
    preview:
      'Just a quick note that Invoice #[NUMBER] was due yesterday. I imagine it slipped through — here is the payment link.',
    goal: 'Assume good intent. Most day-1 overdue invoices are genuine oversights. Keep this email to two sentences.',
    toneColor: 'bg-blue-100 text-blue-700',
  },
  {
    step: 3,
    day: 'Day +7',
    label: 'Week-one follow-up',
    tone: 'Direct',
    subject: 'Re: Invoice #[NUMBER] — one week overdue',
    preview:
      'This is my second follow-up on Invoice #[NUMBER]. Could you let me know when you expect to pay, or flag any issues?',
    goal: 'Name a new deadline. Ask if anything is blocking payment. Many invoices are recovered at this stage.',
    toneColor: 'bg-amber-100 text-amber-700',
  },
  {
    step: 4,
    day: 'Day +14',
    label: 'Firm notice',
    tone: 'Firm',
    subject: 'Invoice #[NUMBER] — 14 days overdue, response required',
    preview:
      'Invoice #[NUMBER] is now 14 days overdue. Please pay by [DATE + 5 days] or contact me. Further action will follow.',
    goal: 'Introduce consequences without being aggressive. Vague threats ("I will take action") are often more effective than specific ones.',
    toneColor: 'bg-orange-100 text-orange-700',
  },
  {
    step: 5,
    day: 'Day +30',
    label: 'Final notice',
    tone: 'Formal',
    subject: 'Final notice — Invoice #[NUMBER] (£[AMOUNT] overdue)',
    preview:
      'This is a formal final notice. Payment of £[AMOUNT] is required within 14 days before I initiate a formal collections process.',
    goal: 'Your last email before escalation. Short, factual, no emotional language. State the consequence clearly and set a hard deadline.',
    toneColor: 'bg-red-100 text-red-700',
  },
]

export default function LatePaymentRecoverySequencePage() {
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
            The 5-Step Late Payment Recovery Sequence Every Freelancer Needs
          </h1>
          <p className="text-xl text-slate-500 leading-relaxed">
            Over 60% of freelancers are owed money right now. Most of it would be recovered
            with a simple, consistent follow-up sequence. Here is the exact system — five
            emails, five specific timings — that turns overdue invoices into paid ones.
          </p>
        </div>

        {/* CTA */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-6 py-5 mb-10 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
          <div>
            <p className="font-semibold text-indigo-900 text-sm">This sequence, sent automatically</p>
            <p className="text-indigo-700 text-sm mt-0.5">
              Chase runs this exact sequence for every invoice — stopping when your client pays.
            </p>
          </div>
          <Link
            href="/signup"
            className="shrink-0 bg-indigo-600 text-white font-semibold px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition-colors whitespace-nowrap"
          >
            Try Chase free →
          </Link>
        </div>

        {/* Why section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Why most freelancers never recover their overdue invoices
          </h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            It is rarely because the client refuses to pay. It is because the freelancer gives
            up too early. Research consistently shows that{' '}
            <strong>it takes an average of 3–4 contact attempts to recover a late payment</strong>,
            but most freelancers send one or two emails and then stop — either because they feel
            awkward, or because they simply forget to follow up while they are busy with other
            work.
          </p>
          <p className="text-slate-600 leading-relaxed mb-4">
            The solution is a sequence: a pre-planned set of emails that escalate in firmness
            over time, with specific timings and specific goals at each stage. Once you have
            this system, you stop improvising and start recovering.
          </p>
          <p className="text-slate-600 leading-relaxed">
            Here is everything you need.
          </p>
        </div>

        {/* Stats callout */}
        <div className="grid sm:grid-cols-3 gap-4 mb-12">
          {[
            { stat: '48%', label: 'of freelancer invoices are paid late (Xero, 2025)' },
            { stat: '3–4×', label: 'contact attempts needed to recover a late payment' },
            { stat: '82%', label: 'of late invoices are recovered within 30 days with consistent follow-up' },
          ].map((item) => (
            <div key={item.stat} className="border border-slate-200 rounded-xl p-5 text-center">
              <p className="text-3xl font-bold text-indigo-600 mb-1">{item.stat}</p>
              <p className="text-sm text-slate-500">{item.label}</p>
            </div>
          ))}
        </div>

        {/* The sequence */}
        <h2 className="text-2xl font-bold text-slate-900 mb-2">The 5-step sequence</h2>
        <p className="text-slate-500 mb-8">
          Each step below includes the send timing, the email tone, a subject line, a preview
          of what to say, and the goal of that step.
        </p>

        <div className="space-y-6 mb-12">
          {sequence.map((item) => (
            <div
              key={item.step}
              className="border border-slate-200 rounded-2xl overflow-hidden"
            >
              {/* Step header */}
              <div className="flex items-center gap-4 px-6 py-4 bg-slate-50 border-b border-slate-200">
                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-white font-bold text-sm">{item.step}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-slate-900">{item.label}</span>
                    <span className="text-slate-400 text-sm font-medium">{item.day}</span>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${item.toneColor}`}
                    >
                      {item.tone}
                    </span>
                  </div>
                </div>
              </div>

              {/* Step body */}
              <div className="px-6 py-5">
                <div className="mb-4">
                  <p className="text-xs text-slate-400 uppercase tracking-wide font-semibold mb-1">Subject line</p>
                  <p className="text-sm font-mono text-slate-700 bg-slate-50 rounded-lg px-3 py-2 border border-slate-200">
                    {item.subject}
                  </p>
                </div>
                <div className="mb-4">
                  <p className="text-xs text-slate-400 uppercase tracking-wide font-semibold mb-1">Email preview</p>
                  <p className="text-sm text-slate-600 italic">&ldquo;{item.preview}&rdquo;</p>
                </div>
                <div className="bg-indigo-50 rounded-lg px-4 py-3">
                  <p className="text-xs text-indigo-700 font-semibold uppercase tracking-wide mb-1">Goal of this step</p>
                  <p className="text-sm text-indigo-800">{item.goal}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Timing tips */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Timing matters as much as tone</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            The days listed above (−3, +1, +7, +14, +30) are not arbitrary. They map to
            natural decision points in a client&rsquo;s payment cycle:
          </p>
          <ul className="space-y-3 text-slate-600">
            <li className="flex gap-3">
              <span className="font-bold text-indigo-600 shrink-0">Day −3:</span>
              <span>Clients settle invoices at the end of a payment run. Reminding them before the due date means your invoice is top of mind when that run happens.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-indigo-600 shrink-0">Day +1:</span>
              <span>The client has just missed their deadline. They are most likely to feel a small obligation to respond right now — not in a week when they have rationalised the delay.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-indigo-600 shrink-0">Day +7:</span>
              <span>A full week of silence means this is no longer an oversight. Something is blocking payment — and this step is about finding out what that is.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-indigo-600 shrink-0">Day +14:</span>
              <span>Two weeks overdue. The soft approach is done. You are now establishing that there are consequences, and that they increase with time.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-indigo-600 shrink-0">Day +30:</span>
              <span>One month overdue. This is your final written record before escalation. The email tone is now formal — it may be read by a third party (solicitor, court).</span>
            </li>
          </ul>
        </div>

        {/* What to do after */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            After step 5: what happens if they still do not pay?
          </h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            If you have completed all five steps and received no payment or meaningful
            communication, you have two main options:
          </p>
          <div className="space-y-4">
            <div className="border-l-4 border-indigo-400 pl-5">
              <h4 className="font-bold text-slate-900 mb-1">Small claims court</h4>
              <p className="text-slate-600 text-sm">
                In the UK, you can claim up to £10,000 through the Money Claim Online service
                at gov.uk. Court fees range from £35 to £455 depending on the claim amount.
                If you win, you can also claim the court fee back. Success rates are high when
                you have a paper trail of emails and a signed contract or agreed scope.
              </p>
            </div>
            <div className="border-l-4 border-indigo-400 pl-5">
              <h4 className="font-bold text-slate-900 mb-1">Debt collection agency</h4>
              <p className="text-slate-600 text-sm">
                Agencies handle the process for you on a no-win, no-fee basis, taking 15–30%
                of whatever they recover. Not worth it for small invoices (under £500), but a
                useful option for larger amounts where you do not want the administrative burden
                of a legal claim.
              </p>
            </div>
          </div>
        </div>

        {/* The case for automation */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            The honest reason most freelancers skip this sequence
          </h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            It is not that they do not know what to do. It is that when you are heads-down in
            client work, the invoice admin is the first thing to slip. You forget to send the
            day-3 nudge. You mean to follow up on day 7 but do not get around to it until day
            14. By then the client has fully rationalised not paying.
          </p>
          <p className="text-slate-600 leading-relaxed mb-4">
            The only reliable way to execute this sequence consistently — across every invoice,
            for every client — is to automate it. That is the whole reason Chase exists.
          </p>
          <p className="text-slate-600 leading-relaxed">
            You create an invoice in Chase, connect your Stripe account, and the system runs
            this entire five-step sequence automatically. When your client pays, Chase detects
            it and stops the emails immediately. You never send a chasing email to someone who
            has already paid.
          </p>
        </div>

        {/* Bottom CTA */}
        <div className="bg-slate-900 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">
            Run this sequence automatically on every invoice
          </h2>
          <p className="text-slate-400 mb-6 max-w-md mx-auto">
            Chase monitors your invoices and sends the right email at exactly the right time.
            You focus on client work. Chase handles getting paid.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-indigo-500 transition-colors"
          >
            Start free — no card required →
          </Link>
          <p className="text-slate-500 text-sm mt-4">Free for your first 3 active invoices. No credit card needed.</p>
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
