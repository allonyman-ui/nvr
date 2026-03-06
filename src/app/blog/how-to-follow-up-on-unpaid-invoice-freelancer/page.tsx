import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: "How to Follow Up on an Unpaid Invoice: The Complete Freelancer's Guide",
  description: "85% of freelancers get paid late. Here's the exact email sequence — day 3, 7, and 14 — that gets invoices paid without burning the client relationship.",
  keywords: [
    'how to follow up on unpaid invoice',
    'invoice follow up email freelancer',
    'overdue invoice follow up',
    'freelancer not getting paid',
    'invoice reminder email',
    'how to chase unpaid invoice',
    'automated invoice follow up',
  ],
  openGraph: {
    title: "How to Follow Up on an Unpaid Invoice: The Complete Freelancer's Guide",
    description: "85% of freelancers get paid late. Here's the exact sequence that gets invoices paid without burning the relationship.",
    url: 'https://chase.allonys.com/blog/how-to-follow-up-on-unpaid-invoice-freelancer',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: "How to Follow Up on an Unpaid Invoice: The Complete Freelancer's Guide",
    description: "85% of freelancers get paid late. Here's the exact sequence that gets invoices paid.",
  },
  alternates: {
    canonical: 'https://chase.allonys.com/blog/how-to-follow-up-on-unpaid-invoice-freelancer',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: "How to Follow Up on an Unpaid Invoice: The Complete Freelancer's Guide",
  description: "85% of freelancers get paid late. Here's the exact email sequence that gets invoices paid without burning the client relationship.",
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

export default function Article1() {
  return (
    <div className="min-h-screen bg-white">
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
            { '@type': 'ListItem', position: 3, name: "How to Follow Up on an Unpaid Invoice: The Complete Freelancer's Guide", item: 'https://chase.allonys.com/blog/how-to-follow-up-on-unpaid-invoice-freelancer' },
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
            <Link href="/signup" className="inline-flex items-center gap-1.5 bg-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
              Start free →
            </Link>
          </div>
        </div>
      </nav>

      {/* Article */}
      <article className="max-w-3xl mx-auto px-6 py-14">

        {/* Header */}
        <div className="mb-10">
          <Link href="/blog" className="text-indigo-600 text-sm font-medium hover:underline inline-flex items-center gap-1 mb-6">
            ← Blog
          </Link>
          <div className="flex items-center gap-3 mb-5">
            <span className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-2.5 py-1 rounded-full">Getting Paid</span>
            <span className="text-slate-400 text-sm">March 2026 · 8 min read</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight leading-tight mb-5">
            {"How to Follow Up on an Unpaid Invoice: The Complete Freelancer's Guide"}
          </h1>
          <p className="text-xl text-slate-500 leading-relaxed">
            85% of freelancers get paid late. The average wait is 39 days from invoice submission. Here is the exact follow-up system — with word-for-word email scripts — that gets invoices paid without feeling awkward or damaging the client relationship.
          </p>
        </div>

        {/* Inline CTA */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-6 py-5 mb-10 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
          <div>
            <p className="font-semibold text-indigo-900 text-sm">Tired of writing these emails manually?</p>
            <p className="text-indigo-700 text-sm mt-0.5">Chase sends them automatically on day 3, 7, and 14 — and stops when the client pays.</p>
          </div>
          <Link href="/signup" className="shrink-0 bg-indigo-600 text-white font-semibold px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition-colors whitespace-nowrap">
            Try it free →
          </Link>
        </div>

        {/* Body */}
        <div className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-h2:text-2xl prose-h3:text-xl prose-p:text-slate-600 prose-p:leading-relaxed prose-li:text-slate-600">

          <h2>Why invoices go unpaid (it is rarely personal)</h2>
          <p>
            Before getting into the how, it helps to understand the why. Most late payments are not a sign that your client is a bad person or that they plan to stiff you. Research consistently shows the most common reasons invoices go unpaid are:
          </p>
          <ul>
            <li><strong>The invoice got lost in email.</strong> Clients receive hundreds of emails a week. Your PDF attachment can genuinely get buried.</li>
            <li><strong>Their accounts payable process has a lag.</strong> Larger clients often have payment cycles (net-30, net-60) baked into their contracts and accounting systems.</li>
            <li><strong>They forgot.</strong> Not malicious — just busy.</li>
            <li><strong>Cash flow issues on their end.</strong> Especially with smaller clients or startups.</li>
            <li><strong>They are waiting on your invoice to prompt them.</strong> Sounds counterintuitive, but some clients genuinely expect a follow-up before they process payment.</li>
          </ul>
          <p>
            Understanding this reframes your follow-up mindset. You are not nagging. You are doing your client a favor by reminding them of an obligation they want to meet.
          </p>

          <h2>The problem with manual follow-up</h2>
          <p>
            The average freelancer spends over 1.5 hours per week on payment follow-up. At a $75/hour rate, that is $5,850 per year spent writing polite variations of the same email. The emotional cost is even higher — the anxiety of not knowing if you will get paid, the reluctance to send the third follow-up, the relationship tension that builds when money is awkward.
          </p>
          <p>
            The solution is a systematic, time-based follow-up sequence. You send the right email at the right time, every time, without having to think about it. Here is exactly what that looks like.
          </p>

          <h2>The proven 3-email follow-up sequence</h2>
          <p>
            This is the sequence used by professional accounts receivable teams at companies of all sizes. It is firm but relationship-preserving, and it accounts for the most common reasons invoices go unpaid.
          </p>

          <h3>Email 1 — Day 3 after due date: The friendly reminder</h3>
          <p>
            Three days after the due date, send a short, warm email that assumes good faith. Do not be passive-aggressive. Do not add a late fee threat. Just remind them cleanly.
          </p>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 my-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Day 3 Email Template</p>
            <p className="text-slate-700 text-sm leading-relaxed"><strong>Subject:</strong> Invoice #1042 — just a quick follow-up</p>
            <p className="text-slate-700 text-sm leading-relaxed mt-3">
              Hi [Client name],<br /><br />
              Hope all is well! I just wanted to follow up on Invoice #1042 for [project name], which was due on [date]. Total is [amount].<br /><br />
              Happy to resend the invoice or answer any questions. Payment link is here: [link]<br /><br />
              Thanks so much,<br />
              [Your name]
            </p>
          </div>
          <p>
            <strong>Why this works:</strong> Short, no pressure, assumes it is an oversight. Clients who genuinely forgot will pay immediately. This email alone recovers around 40–50% of late invoices.
          </p>

          <h3>Email 2 — Day 7 after due date: The firmer nudge</h3>
          <p>
            If the invoice is still unpaid at day 7, it is time to be a little firmer. Still professional, but with a clear call to action and a specific payment deadline.
          </p>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 my-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Day 7 Email Template</p>
            <p className="text-slate-700 text-sm leading-relaxed"><strong>Subject:</strong> Following up: Invoice #1042 is now 7 days overdue</p>
            <p className="text-slate-700 text-sm leading-relaxed mt-3">
              Hi [Client name],<br /><br />
              I wanted to follow up again on Invoice #1042 for [amount], which is now 7 days past the due date of [date].<br /><br />
              If there is an issue with the invoice or the payment method, I am happy to sort it out — just let me know. Otherwise, I would appreciate payment by [specific date, e.g., Friday].<br /><br />
              Payment link: [link]<br /><br />
              Thank you,<br />
              [Your name]
            </p>
          </div>
          <p>
            <strong>Why this works:</strong> It acknowledges the possibility of a problem on their end (giving them a face-saving out), while also setting a new, specific deadline. The combination of empathy and firmness is highly effective.
          </p>

          <h3>Email 3 — Day 14 after due date: The final notice</h3>
          <p>
            At two weeks past due, the invoice has had ample time to be processed. This email should be brief, professional, and make clear that you are serious about resolution.
          </p>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 my-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Day 14 Email Template</p>
            <p className="text-slate-700 text-sm leading-relaxed"><strong>Subject:</strong> Final notice: Invoice #1042 — [amount] overdue</p>
            <p className="text-slate-700 text-sm leading-relaxed mt-3">
              Hi [Client name],<br /><br />
              This is a final notice regarding Invoice #1042 for [amount], now 14 days past due.<br /><br />
              I have not heard back from previous follow-ups, so I want to make sure this is on your radar. Please arrange payment by [date] to avoid any further action.<br /><br />
              Payment link: [link]<br /><br />
              If you have already sent payment or are experiencing an issue, please reply to this email and I will follow up directly.<br /><br />
              [Your name]
            </p>
          </div>
          <p>
            <strong>Why this works:</strong> The phrase "avoid any further action" signals seriousness without making an empty threat. The final date creates urgency. This email recovers the majority of the remaining unpaid invoices.
          </p>

          <h2>What to do if all three emails are ignored</h2>
          <p>
            If you have sent all three emails and still received no payment or response, you are dealing with a genuine non-payer. At this point, your options include:
          </p>
          <ul>
            <li><strong>A personal phone call.</strong> Sometimes picking up the phone breaks the email avoidance cycle.</li>
            <li><strong>A formal demand letter.</strong> A letter that references your contract and quotes applicable payment terms adds legal weight.</li>
            <li><strong>Collections agency.</strong> For invoices over $1,000, a collections agency is often cost-effective. They typically take 25–30% of what they collect.</li>
            <li><strong>Small claims court.</strong> For invoices under your state's small claims limit (usually $5,000–$10,000), this is a practical and often successful option. The filing fee is typically $30–$75.</li>
          </ul>

          <h2>How to prevent late payments in the first place</h2>
          <p>
            The best follow-up is the one you never have to send. Here are four practices that significantly reduce late payment rates:
          </p>
          <ul>
            <li><strong>Include a payment link in every invoice.</strong> Clients who can pay by card in one click pay 3x faster than those who have to do a bank transfer. Stripe Payment Links make this trivial to add.</li>
            <li><strong>Require a deposit upfront.</strong> A 25–50% deposit for new clients creates financial commitment before work begins.</li>
            <li><strong>Net-7 or net-14 terms, not net-30.</strong> The longer the payment window, the longer people wait. Shorten your default terms.</li>
            <li><strong>Automate your follow-up sequence.</strong> Manual follow-up introduces delays and gaps. An automated system like <Link href="/" className="text-indigo-600 hover:underline">Chase</Link> ensures the day-3, day-7, and day-14 emails go out without you having to remember or draft them.</li>
          </ul>

          <h2>The time calculation every freelancer should do</h2>
          <p>
            Add up the hours you spend on invoice follow-up in a typical month. Most freelancers who do this exercise are surprised: it is usually 4–6 hours minimum, sometimes more. Multiply that by your hourly rate. That is the true cost of manual invoice chasing — not just in time, but in attention and emotional bandwidth that could be spent on billable work or growth.
          </p>
          <p>
            At $100/hour, 5 hours of monthly follow-up is $6,000 per year in lost opportunity. For context, automating the entire process with a tool like Chase costs $19/month — $228 per year.
          </p>

          <h2>The bottom line</h2>
          <p>
            Following up on unpaid invoices is not optional — it is part of running a freelance business. The key is doing it systematically, professionally, and consistently. The three-email sequence above (day 3, 7, 14) is proven, relationship-preserving, and effective. If you automate it, you never have to think about it again.
          </p>
          <p>
            For the word-for-word email templates in copy-paste format, see our <Link href="/blog/invoice-follow-up-email-templates" className="text-indigo-600 hover:underline">Invoice Follow-Up Email Templates</Link> guide.
          </p>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 bg-slate-900 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Automate your invoice follow-up</h2>
          <p className="text-slate-400 mb-6 max-w-md mx-auto text-sm leading-relaxed">
            Chase sends the day-3, day-7, and day-14 emails automatically — and stops the moment your client pays. Free for your first 3 invoices.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-white text-slate-900 font-semibold px-6 py-3 rounded-xl hover:bg-slate-100 transition-colors"
          >
            Start free — no card required →
          </Link>
          <p className="text-slate-500 text-xs mt-3">Setup takes 3 minutes. Cancel anytime.</p>
        </div>

        {/* Related articles */}
        <div className="mt-10 pt-8 border-t border-slate-100">
          <p className="text-sm font-semibold text-slate-400 mb-4">More guides</p>
          <Link href="/blog/invoice-follow-up-email-templates" className="group block border border-slate-200 rounded-xl p-5 hover:border-indigo-200 transition-colors">
            <span className="text-xs text-indigo-600 font-semibold">Email Templates</span>
            <h3 className="font-semibold text-slate-900 mt-1 group-hover:text-indigo-700 transition-colors">Invoice Follow-Up Email Templates: Day 3, 7, 14, and Final Notice</h3>
          </Link>
        </div>
      </article>
    </div>
  )
}
