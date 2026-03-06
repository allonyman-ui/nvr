import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'How to Collect Overdue Invoices Without Losing the Client (2026 Guide)',
  description: 'Practical steps to collect overdue invoices as a freelancer — from the first polite nudge to the final escalation. Includes scripts, timelines, and tools.',
  keywords: [
    'how to collect overdue invoices',
    'overdue invoice collection freelancer',
    'collecting unpaid invoices',
    'overdue invoice follow up',
    'freelancer unpaid invoice',
    'client not paying invoice',
    'overdue invoice email',
    'how to get paid overdue invoice',
  ],
  openGraph: {
    title: 'How to Collect Overdue Invoices Without Losing the Client (2026 Guide)',
    description: 'Practical scripts and a proven timeline for collecting overdue invoices as a freelancer — without destroying client relationships.',
    url: 'https://chase.allonys.com/blog/how-to-collect-overdue-invoices',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How to Collect Overdue Invoices as a Freelancer',
    description: 'Scripts, timelines, and tools for getting paid on overdue invoices without the awkwardness.',
  },
  alternates: {
    canonical: 'https://chase.allonys.com/blog/how-to-collect-overdue-invoices',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'How to Collect Overdue Invoices Without Losing the Client (2026 Guide)',
  description: 'Practical steps to collect overdue invoices as a freelancer — scripts, timelines, and automated tools.',
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

export default function HowToCollectOverdueInvoicesPage() {
  return (
    <div className="min-h-screen bg-white">
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
            <Link href="/signup" className="inline-flex items-center gap-1.5 bg-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
              Start free →
            </Link>
          </div>
        </div>
      </nav>

      {/* Article */}
      <article className="max-w-3xl mx-auto px-6 py-14">

        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-red-600 bg-red-50 px-2.5 py-1 rounded-full">Getting Paid</span>
            <span className="text-slate-400 text-sm">·</span>
            <time className="text-sm text-slate-500" dateTime="2026-03-04">March 4, 2026</time>
            <span className="text-slate-400 text-sm">·</span>
            <span className="text-sm text-slate-500">10 min read</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 leading-[1.15] tracking-tight mb-4">
            How to Collect Overdue Invoices Without Losing the Client
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            An overdue invoice puts you in an uncomfortable spot: you need the money, but you don&apos;t want to damage a relationship. Here&apos;s how to handle it professionally — and get paid.
          </p>
        </header>

        {/* Reality check box */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-10">
          <p className="text-amber-900 font-semibold mb-2">The uncomfortable truth about overdue invoices</p>
          <p className="text-amber-800 text-sm leading-relaxed">
            Studies show that invoices more than 90 days past due are recovered at a rate of less than 18%. The single most effective thing you can do is follow up <em>early and often</em> — ideally within 3 days of the due date. Every week of silence cuts your recovery odds significantly.
          </p>
        </div>

        {/* Body */}
        <div className="prose prose-slate prose-lg max-w-none">

          <h2>Why invoices go unpaid (it&apos;s usually not malicious)</h2>
          <p>
            Before we get into scripts, it&apos;s worth understanding why most invoices go unpaid. In most cases, it&apos;s one of these:
          </p>
          <ul>
            <li><strong>The invoice got buried in their inbox</strong> — especially for busy clients with high email volume</li>
            <li><strong>It&apos;s stuck in an approval process</strong> — corporate clients often route invoices through accounting before paying</li>
            <li><strong>They&apos;re having cash flow issues</strong> — common with small business clients, often temporary</li>
            <li><strong>They forgot</strong> — honestly, this is the most common reason, especially with recurring vendors</li>
            <li><strong>There&apos;s a dispute or question</strong> — they&apos;re confused about something on the invoice and didn&apos;t ask</li>
          </ul>
          <p>
            Understanding the likely reason helps you choose the right tone. A corporate client in an approval queue needs different language than a small business client facing cash flow stress.
          </p>

          <h2>The 5-stage overdue invoice collection timeline</h2>
          <p>
            Here&apos;s the sequence that balances firmness with relationship preservation:
          </p>

          <h3>Stage 1: Day 1–3 past due — The friendly check-in</h3>
          <p>
            Don&apos;t wait a week to reach out. Send a light, non-accusatory message within 1-3 days of the due date. The goal is to assume positive intent and make it easy for them to pay.
          </p>

          <div className="bg-slate-50 border-l-4 border-indigo-400 rounded-r-xl p-5 not-prose my-6">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Email template — Day 1-3</p>
            <p className="text-slate-800 text-sm leading-relaxed mb-2"><strong>Subject:</strong> Invoice #[XXX] — just checking in</p>
            <p className="text-slate-700 text-sm leading-relaxed">
              Hi [Name],<br /><br />
              Wanted to check in on Invoice #[XXX] for $[amount], which was due on [date]. Let me know if you have any questions or need me to resend it in a different format.<br /><br />
              You can pay directly via this link: [payment link]<br /><br />
              Thanks!<br />
              [Your name]
            </p>
          </div>

          <p>
            Key elements of this email: no accusatory language, an easy payment path, an out (maybe they need a different format), and brevity.
          </p>

          <h3>Stage 2: Day 7–10 past due — The clear reminder</h3>
          <p>
            If there&apos;s been no response or payment, send a firmer but still professional follow-up. This one is less &quot;checking in&quot; and more &quot;I need a response.&quot;
          </p>

          <div className="bg-slate-50 border-l-4 border-indigo-400 rounded-r-xl p-5 not-prose my-6">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Email template — Day 7-10</p>
            <p className="text-slate-800 text-sm leading-relaxed mb-2"><strong>Subject:</strong> Invoice #[XXX] — now [X] days overdue</p>
            <p className="text-slate-700 text-sm leading-relaxed">
              Hi [Name],<br /><br />
              Following up on Invoice #[XXX] for $[amount], which was due on [date] and is now [X] days past due.<br /><br />
              Could you let me know when I can expect payment, or if there&apos;s an issue I can help resolve?<br /><br />
              Payment link: [link]<br /><br />
              Thanks,<br />
              [Your name]
            </p>
          </div>

          <p>
            This email does two things: states the facts clearly (amount, due date, days overdue) and invites them to flag any issues. This often surfaces hidden disputes before they become bigger problems.
          </p>

          <h3>Stage 3: Day 14–21 past due — The firm demand</h3>
          <p>
            By this point, the polite phase is over. If you&apos;ve sent two emails with no response or payment, it&apos;s appropriate to be more direct. This email should feel consequential — a clear statement that continued non-response has consequences.
          </p>

          <div className="bg-slate-50 border-l-4 border-red-400 rounded-r-xl p-5 not-prose my-6">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Email template — Day 14-21</p>
            <p className="text-slate-800 text-sm leading-relaxed mb-2"><strong>Subject:</strong> Urgent: Invoice #[XXX] requires immediate payment</p>
            <p className="text-slate-700 text-sm leading-relaxed">
              Hi [Name],<br /><br />
              This is my third message regarding Invoice #[XXX] for $[amount], now [X] days past due. I haven&apos;t received payment or a response to my previous follow-ups.<br /><br />
              Please pay via the link below by [date 7 days from now]. If I don&apos;t receive payment by that date, I&apos;ll need to pause work on any active projects and explore further options.<br /><br />
              Payment link: [link]<br /><br />
              If there&apos;s a dispute or issue with this invoice, please reply to this email immediately so we can resolve it.<br /><br />
              [Your name]
            </p>
          </div>

          <h3>Stage 4: Day 30+ past due — Escalation options</h3>
          <p>
            If you&apos;ve reached day 30 without payment or meaningful communication, you have several escalation options:
          </p>
          <ul>
            <li><strong>Phone call or video call request</strong> — sometimes a direct conversation breaks the logjam when emails don&apos;t</li>
            <li><strong>Involve a lawyer</strong> — a letter from a lawyer is often enough to get payment moving; many attorneys offer demand letters for $100-200</li>
            <li><strong>Small claims court</strong> — for invoices under $10,000 (limit varies by state), small claims is an option; no lawyer required</li>
            <li><strong>Collections agency</strong> — agencies typically take 25-50% of what they recover, but it&apos;s better than zero</li>
            <li><strong>Report to credit bureaus</strong> — for business clients, late payment can be reported and affects their credit</li>
          </ul>

          <h3>Stage 5: Day 60+ — Accept the loss or pursue legally</h3>
          <p>
            At 60+ days, your realistic options narrow significantly. Many freelancers choose to write off the debt and move on, especially for smaller amounts where legal pursuit would cost more than you&apos;d recover. The silver lining: that loss may be tax-deductible as a bad debt expense (consult a tax professional).
          </p>
          <p>
            The lesson at this stage is mostly prevention: require deposits, use contracts with late payment clauses, and follow up earlier next time.
          </p>

          <h2>How to prevent overdue invoices in the first place</h2>
          <p>
            The best time to address late payments is before they happen. These practices significantly reduce your overdue invoice rate:
          </p>

          <h3>1. Require a deposit upfront</h3>
          <p>
            A 25-50% deposit before work begins does two things: it filters out clients who aren&apos;t serious, and it establishes a payment relationship. Clients who&apos;ve already paid a deposit are much more likely to pay the final invoice.
          </p>

          <h3>2. Include a payment link in every invoice</h3>
          <p>
            The single biggest reason invoices go unpaid is friction. If paying requires a client to log into a portal, find their card, enter details, and submit — they&apos;ll procrastinate. A Stripe payment link lets clients pay by card directly from their email in under 60 seconds.
          </p>

          <h3>3. Automate your follow-ups</h3>
          <p>
            The reason most freelancers don&apos;t follow up early is that it feels awkward and time-consuming. Automated follow-up tools remove the awkwardness entirely — the system sends the reminder, not &quot;you.&quot; Tools like Chase send timed, professional follow-up emails automatically and stop the moment the invoice is paid.
          </p>

          <h3>4. Set clear payment terms in writing</h3>
          <p>
            &quot;Net 30&quot; is standard but creates a 30-day waiting period. Consider &quot;Net 14&quot; or &quot;Net 7&quot; for smaller invoices. Whatever terms you use, state them clearly on the invoice and in your contract — &quot;Payment due within 14 days of invoice date.&quot;
          </p>

          <h3>5. Add a late fee clause</h3>
          <p>
            A late fee of 1.5-2% per month (or a flat fee for smaller invoices) creates financial incentive to pay on time. Many freelancers never enforce the fee — but having it stated often motivates timely payment.
          </p>

          <h2>What about the client relationship?</h2>
          <p>
            The worry that following up damages client relationships is mostly unfounded — as long as you do it professionally. Most clients who respect your work also respect that you need to be paid for it. A professional, timely follow-up rarely costs you a relationship.
          </p>
          <p>
            What <em>does</em> damage relationships is passive aggression, public callouts, or threats disproportionate to the amount owed. Stick to the scripts above, stay factual and professional, and you preserve the relationship whether or not you end up getting paid.
          </p>
          <p>
            The relationship that&apos;s worth examining is the one with a client who consistently pays late, ignores your follow-ups, or requires significant chasing every invoice cycle. That client is costing you time and stress that could go toward better clients. At some point, the professional move is to raise your rates for them, require larger deposits, or discontinue the relationship.
          </p>

          <h2>Automate your follow-ups so you never have to do this manually</h2>
          <p>
            The single most effective change most freelancers can make is automating invoice follow-ups. Every day you wait to follow up is a day the invoice slips further down your client&apos;s priority list.
          </p>
          <p>
            Chase was built specifically to solve this problem. You send an invoice with a Stripe payment link, and Chase automatically sends follow-up emails at the right intervals — stopping the moment your client pays. You never have to remember to follow up, and you never have to write another &quot;just checking in&quot; email.
          </p>
        </div>

        {/* CTA */}
        <div className="mt-14 bg-slate-900 rounded-2xl p-8 text-center">
          <p className="text-white/60 text-sm font-medium uppercase tracking-wider mb-3">Stop chasing manually</p>
          <h2 className="text-2xl font-bold text-white mb-3">
            Let Chase follow up for you — automatically
          </h2>
          <p className="text-white/70 text-base mb-6 max-w-lg mx-auto">
            Connect Stripe, send your invoice, and Chase handles every follow-up. Professional, timed, and stops the moment you get paid.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-white text-slate-900 font-semibold px-6 py-3 rounded-xl hover:bg-slate-100 transition-colors text-base"
          >
            Start free — no card required →
          </Link>
          <p className="text-white/40 text-xs mt-4">Free for up to 3 invoices · Setup in 5 minutes</p>
        </div>

        {/* Related posts */}
        <div className="mt-14 pt-10 border-t border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Related reading</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Link href="/blog/how-to-write-invoice-payment-reminder-email" className="group block p-5 border border-slate-200 rounded-xl hover:border-indigo-200 hover:shadow-sm transition-all">
              <p className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">How to Write an Invoice Payment Reminder Email</p>
              <p className="text-xs text-slate-500 mt-1.5">Templates for every stage</p>
            </Link>
            <Link href="/blog/invoice-follow-up-email-templates" className="group block p-5 border border-slate-200 rounded-xl hover:border-indigo-200 hover:shadow-sm transition-all">
              <p className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">5 Invoice Follow-Up Email Templates That Get Responses</p>
              <p className="text-xs text-slate-500 mt-1.5">Copy-paste templates</p>
            </Link>
          </div>
        </div>

      </article>
    </div>
  )
}
