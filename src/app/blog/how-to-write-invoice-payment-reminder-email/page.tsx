import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'How to Write an Invoice Payment Reminder Email (With 5 Templates)',
  description: 'Learn how to write an invoice payment reminder email that gets results. Covers tone, timing, subject lines, and 5 copy-paste templates for every stage — polite through final notice.',
  keywords: [
    'invoice payment reminder email',
    'payment reminder email',
    'how to write payment reminder email',
    'invoice payment reminder template',
    'overdue payment reminder email',
    'professional invoice reminder email',
    'payment reminder email freelancer',
    'polite payment reminder email',
  ],
  openGraph: {
    title: 'How to Write an Invoice Payment Reminder Email (With 5 Templates)',
    description: 'Tone, timing, subject lines, and 5 copy-paste templates for every stage of invoice follow-up — polite reminder through final notice.',
    url: 'https://chase.allonys.com/blog/how-to-write-invoice-payment-reminder-email',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How to Write an Invoice Payment Reminder Email (With 5 Templates)',
    description: '5 ready-to-use payment reminder email templates — polite, firm, urgent, final notice, and past-due escalation.',
  },
  alternates: {
    canonical: 'https://chase.allonys.com/blog/how-to-write-invoice-payment-reminder-email',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'How to Write an Invoice Payment Reminder Email (With 5 Templates)',
  description: 'Learn how to write an invoice payment reminder email that gets results. Covers tone, timing, subject lines, and 5 copy-paste templates.',
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
}

function TemplateBlock({ number, label, timing, subject, body }: TemplateBlockProps) {
  return (
    <div className="mb-10">
      <div className="flex items-start gap-3 mb-4">
        <div className="shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
          {number}
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900">{label}</h3>
          <p className="text-sm text-slate-400 mt-0.5">{timing}</p>
        </div>
      </div>
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Copy-paste template</p>
        <div className="mb-3">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Subject line</span>
          <p className="text-sm text-slate-800 font-mono mt-1 bg-white border border-slate-200 rounded px-3 py-2">{subject}</p>
        </div>
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email body</span>
          <pre className="text-sm text-slate-700 font-mono mt-1 bg-white border border-slate-200 rounded px-4 py-4 whitespace-pre-wrap leading-relaxed overflow-x-auto">{body}</pre>
        </div>
      </div>
    </div>
  )
}

export default function InvoicePaymentReminderEmailPage() {
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
        <div className="mb-10">
          <Link href="/blog" className="text-indigo-600 text-sm font-medium hover:underline inline-flex items-center gap-1 mb-6">
            ← Blog
          </Link>
          <div className="flex items-center gap-3 mb-5">
            <span className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-2.5 py-1 rounded-full">Email Templates</span>
            <span className="text-slate-400 text-sm">March 2026 · 7 min read</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight leading-tight mb-5">
            How to Write an Invoice Payment Reminder Email (With 5 Templates)
          </h1>
          <p className="text-xl text-slate-500 leading-relaxed">
            A well-written payment reminder email gets invoices paid without damaging the client relationship. Here is everything you need to know about tone, timing, and subject lines — plus 5 copy-paste templates ready to send today.
          </p>
        </div>

        {/* Inline CTA */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-6 py-5 mb-10 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
          <div>
            <p className="font-semibold text-indigo-900 text-sm">Rather not write these yourself?</p>
            <p className="text-indigo-700 text-sm mt-0.5">Chase sends all 5 reminder emails automatically — and stops the moment your client pays. Free for 3 invoices.</p>
          </div>
          <Link href="/signup" className="shrink-0 bg-indigo-600 text-white font-semibold px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition-colors whitespace-nowrap">
            Automate it free →
          </Link>
        </div>

        {/* Body — Part 1: The Guide */}
        <div className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-h2:text-2xl prose-h3:text-xl prose-p:text-slate-600 prose-p:leading-relaxed prose-li:text-slate-600">

          <h2>Why most payment reminder emails do not work</h2>
          <p>
            Freelancers who struggle with late payments usually make one of two mistakes. They either wait too long to send the first reminder — letting the invoice fade from the client's awareness — or they write reminders that are either too apologetic to create urgency or too aggressive to preserve the relationship.
          </p>
          <p>
            The good news: writing effective payment reminder emails is not complicated. It is a matter of tone, timing, and structure. Get those three right and you will collect the majority of late invoices without a single awkward conversation.
          </p>

          <h2>The 3 rules of effective payment reminder emails</h2>

          <h3>Rule 1: Calibrate your tone to the stage</h3>
          <p>
            Tone should escalate proportionally with how overdue the invoice is. Day 3 past due: warm, assume it is an oversight, low-pressure. Day 7: professional, slightly firmer, include a specific deadline. Day 14+: brief, direct, signal seriousness without empty threats. The mistake most freelancers make is being too apologetic in email 2 and 3 — this removes the urgency that drives payment.
          </p>

          <h3>Rule 2: Nail the subject line</h3>
          <p>
            The subject line determines whether your email gets opened. For payment reminders, clarity beats creativity every time. Include the invoice number, the amount, and enough context to be instantly recognizable. Avoid vague subjects like "Following up" — these look like spam and get buried. The templates below show you exactly what works at each stage.
          </p>

          <h3>Rule 3: Include a payment link every single time</h3>
          <p>
            Every payment reminder email should include a direct payment link — ideally a Stripe Payment Link, PayPal invoice link, or equivalent one-click payment URL. Clients who can pay in one click pay 3x faster than those who have to find the original invoice, locate their bank details, and do a transfer. Do not make payment an effort. Remove every step between your reminder and the client's "pay" button.
          </p>

          <h2>When to send each reminder</h2>
          <p>
            The optimal cadence — used by professional accounts receivable teams — is:
          </p>
          <ul>
            <li><strong>Day 0:</strong> Invoice sent (before due date, if you can — send the invoice as soon as work is completed, not on the due date)</li>
            <li><strong>1–2 days before due date:</strong> Optional soft reminder ("Just a heads-up, Invoice #1042 is due on Friday")</li>
            <li><strong>Day 3 past due:</strong> First follow-up — friendly, assume oversight</li>
            <li><strong>Day 7 past due:</strong> Second follow-up — firmer, set a specific new deadline</li>
            <li><strong>Day 14 past due:</strong> Third follow-up — final notice, signal escalation</li>
            <li><strong>Day 21+ past due:</strong> Escalation email — formal, mention next steps</li>
          </ul>
          <p>
            Do not wait longer than this between emails. The first 3 weeks are the window in which you can recover an invoice without significant friction. After 30 days, collection rates drop substantially.
          </p>

        </div>

        {/* Templates section */}
        <div className="mt-12 mb-2">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">The 5 templates</h2>
          <p className="text-slate-500 text-sm mb-8">Replace text in [brackets] with your actual details. Everything else can be sent as-is.</p>

          <TemplateBlock
            number={1}
            label="The Polite Pre-Due Reminder"
            timing="1–2 days before the due date (optional but effective)"
            subject="Invoice #[number] due [date] — just a quick heads-up"
            body={`Hi [Client name],

Just a quick note to let you know that Invoice #[number] for [project name] is due on [date].

Total: [amount]
Payment link: [link]

No action needed if you have already scheduled payment — just wanted to make sure it was on your radar.

Thanks,
[Your name]`}
          />

          <TemplateBlock
            number={2}
            label="The Friendly Reminder"
            timing="Day 3 past the due date"
            subject="Invoice #[number] — quick follow-up"
            body={`Hi [Client name],

Hope you're doing well! I'm following up on Invoice #[number] for [project name], which was due on [due date]. The total is [amount].

I wanted to make sure it didn't get lost in the inbox. You can pay directly here: [payment link]

Let me know if you have any questions or need me to resend the invoice.

Thanks so much,
[Your name]`}
          />

          <TemplateBlock
            number={3}
            label="The Firm Nudge"
            timing="Day 7 past the due date"
            subject="Following up: Invoice #[number] is now 7 days overdue"
            body={`Hi [Client name],

I wanted to follow up again on Invoice #[number] for [amount], which is now 7 days past the due date of [date].

If there's an issue with the invoice or the payment method, I'm happy to sort it out — just reply to this email. Otherwise, could you arrange payment by [specific date, e.g. this Friday]?

Payment link: [link]

Thank you,
[Your name]`}
          />

          <TemplateBlock
            number={4}
            label="The Urgent Final Notice"
            timing="Day 14 past the due date"
            subject="Final notice: Invoice #[number] — [amount] overdue"
            body={`Hi [Client name],

This is a final notice regarding Invoice #[number] for [amount], which is now 14 days past its due date of [date].

I haven't received a response to my previous follow-ups, so I want to make sure this is on your radar. Please arrange payment by [date] to avoid any further action.

Payment link: [link]

If you have already sent payment, or if you are experiencing a difficulty, please reply to this email and I'll follow up directly.

[Your name]`}
          />

          <TemplateBlock
            number={5}
            label="The Past-Due Escalation"
            timing="Day 21+ — if all previous emails have been ignored"
            subject="Outstanding invoice #[number] — payment required"
            body={`Hi [Client name],

I have now sent three follow-up emails regarding Invoice #[number] for [amount], due on [date], with no response or payment received.

I would like to resolve this directly before exploring other options. Please respond by [date] with either a payment confirmation or a proposed payment arrangement.

If I do not hear from you by [date], I will need to consider escalating this matter.

[Your name]`}
          />
        </div>

        {/* Tips section */}
        <div className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-h2:text-2xl prose-h3:text-xl prose-p:text-slate-600 prose-p:leading-relaxed prose-li:text-slate-600 mt-4">

          <h2>Tips for higher response rates</h2>

          <h3>Do not apologize for following up</h3>
          <p>
            Remove phrases like "I'm so sorry to bother you" or "I know you're busy, but..." You completed the work. You are owed payment under an agreed contract. Following up professionally is not rude — it is how business works. Apologetic language signals weakness and actually slows payment.
          </p>

          <h3>Use the client's name in the opener</h3>
          <p>
            "Hi Sarah" outperforms "Hi there" or no greeting at every stage. Personalization is not just a nicety — it signals that this is a direct message from a person, not a bulk email system. Clients are more likely to act on emails that feel personal.
          </p>

          <h3>Set specific deadlines, not vague timeframes</h3>
          <p>
            "Please pay by Friday, March 8th" is significantly more effective than "please arrange payment at your earliest convenience." Specific dates create cognitive commitment. Vague timeframes get indefinitely deferred. In email 2 and beyond, always name a specific date.
          </p>

          <h3>Keep later emails shorter, not longer</h3>
          <p>
            Counter-intuitively, your firmest emails should be your shortest. Email 1 can be conversational. Email 4 should be three sentences. Brevity signals seriousness — a long apology in a final notice undermines the message. Let the content carry the weight, not the word count.
          </p>

          <h3>Send at the right time of day</h3>
          <p>
            Send payment reminders between 8am–10am on Tuesday, Wednesday, or Thursday in the client's time zone. Avoid Monday mornings (inbox chaos) and Friday afternoons (checked out). Emails sent mid-morning on weekdays have measurably higher open and response rates.
          </p>

          <h3>Stop the sequence the moment they pay</h3>
          <p>
            If you are sending follow-ups manually, check payment status before each email. If you are using an automated tool, verify that it stops the sequence on payment detection. Sending a "final notice" or an escalation email to a client who already paid is one of the fastest ways to destroy a business relationship — and it happens more often than you would think.
          </p>

          <h2>When writing reminder emails is not the problem — consistency is</h2>
          <p>
            The templates above work. But they only work if you send them, at the right time, for every invoice. In practice, freelancers miss follow-ups because they are busy with client work, forget which invoices are overdue, or delay because the emotional friction of writing the email is high.
          </p>
          <p>
            This is the argument for automation. <Link href="/" className="text-indigo-600 hover:underline">Chase</Link> sends the full 5-step sequence automatically — the right email goes out at the right time, every time, with your Stripe payment link embedded. The moment the client pays, the sequence stops. You just send the invoice and get paid.
          </p>
          <p>
            Free for your first 3 invoices. If you are a freelancer with more than 3 active invoices per month, the Pro plan is $19/month.
          </p>
        </div>

        {/* Mid-article CTA */}
        <div className="my-10 bg-indigo-50 border border-indigo-100 rounded-xl px-6 py-6">
          <h3 className="font-bold text-indigo-900 mb-2">Automate all 5 of these emails</h3>
          <p className="text-indigo-700 text-sm leading-relaxed mb-4">
            Chase sends the full reminder sequence automatically for every invoice — and cancels the moment your client pays. No more copy-pasting, no more missed follow-ups.
          </p>
          <Link href="/signup" className="inline-flex items-center gap-2 bg-indigo-600 text-white font-semibold px-5 py-2.5 rounded-lg text-sm hover:bg-indigo-700 transition-colors">
            Start free — no card required →
          </Link>
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 bg-slate-900 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Never write a payment reminder email again.</h2>
          <p className="text-slate-400 mb-6 max-w-md mx-auto text-sm leading-relaxed">
            Chase automates your entire invoice follow-up sequence — polite reminder through final notice — and stops the moment your client pays. Free for your first 3 invoices.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-white text-slate-900 font-semibold px-6 py-3 rounded-xl hover:bg-slate-100 transition-colors"
          >
            Start free — no card required →
          </Link>
          <p className="text-slate-500 text-xs mt-3">Setup takes 3 minutes. Free for first 3 invoices.</p>
        </div>

        {/* Related articles */}
        <div className="mt-10 pt-8 border-t border-slate-100">
          <p className="text-sm font-semibold text-slate-400 mb-4">More guides</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <Link href="/blog/invoice-reminder-software-freelancers" className="group block border border-slate-200 rounded-xl p-5 hover:border-indigo-200 transition-colors">
              <span className="text-xs text-indigo-600 font-semibold">Tools & Software</span>
              <h3 className="font-semibold text-slate-900 mt-1 group-hover:text-indigo-700 transition-colors">Best Invoice Reminder Software for Freelancers in 2026 (Compared)</h3>
            </Link>
            <Link href="/blog/how-to-follow-up-on-unpaid-invoice-freelancer" className="group block border border-slate-200 rounded-xl p-5 hover:border-indigo-200 transition-colors">
              <span className="text-xs text-indigo-600 font-semibold">Getting Paid</span>
              <h3 className="font-semibold text-slate-900 mt-1 group-hover:text-indigo-700 transition-colors">{"How to Follow Up on an Unpaid Invoice: The Complete Freelancer's Guide"}</h3>
            </Link>
          </div>
        </div>
      </article>
    </div>
  )
}
