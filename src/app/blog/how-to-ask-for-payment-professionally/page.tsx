import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'How to Ask for Payment Professionally: Scripts + Email Templates',
  description: 'Struggling to ask clients for money? 6 copy-paste scripts for every situation — first invoice send, polite reminder, firm follow-up, and final notice. The psychology of getting paid on time.',
  keywords: [
    'how to ask for payment professionally',
    'how to ask client for payment',
    'asking for payment email',
    'professional payment request email',
    'how to request payment politely',
    'invoice payment request email',
    'follow up payment email template',
  ],
  openGraph: {
    title: 'How to Ask for Payment Professionally: Scripts + Email Templates',
    description: '6 copy-paste scripts for asking clients for payment — from first invoice to final notice. The psychology of getting paid on time without damaging client relationships.',
    url: 'https://chase.allonys.com/blog/how-to-ask-for-payment-professionally',
    type: 'article',
  },
  alternates: {
    canonical: 'https://chase.allonys.com/blog/how-to-ask-for-payment-professionally',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'How to Ask for Payment Professionally: Scripts + Email Templates',
  description: '6 copy-paste scripts for asking clients for payment — from first invoice to final notice.',
  datePublished: '2026-03-06',
  dateModified: '2026-03-06',
  author: {
    '@type': 'Organization',
    name: 'Chase',
    url: 'https://chase.allonys.com',
  },
}

interface ScriptProps {
  label: string
  timing: string
  subject: string
  body: string
  note: string
}

function Script({ label, timing, subject, body, note }: ScriptProps) {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-4">
        <span className="bg-indigo-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">{timing}</span>
        <h3 className="text-xl font-bold text-slate-900">{label}</h3>
      </div>
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Email script — copy and paste</p>
        <p className="text-sm text-slate-700 mb-1"><strong>Subject:</strong> {subject}</p>
        <div className="mt-3 text-sm text-slate-700 leading-relaxed whitespace-pre-line font-mono border-t border-slate-200 pt-4">
          {body}
        </div>
      </div>
      <p className="text-sm text-slate-500 mt-3 italic">{note}</p>
    </div>
  )
}

export default function HowToAskForPaymentPage() {
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
            How to Ask for Payment Professionally: Scripts + Email Templates
          </h1>
          <p className="text-xl text-slate-500 leading-relaxed">
            Asking for money feels uncomfortable. It should not — you did the work, you earned the payment. Here is the psychology behind professional payment requests, plus six word-for-word scripts for every stage.
          </p>
        </div>

        {/* Inline CTA */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-6 py-5 mb-10 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
          <div>
            <p className="font-semibold text-indigo-900 text-sm">Rather not write any of these yourself?</p>
            <p className="text-indigo-700 text-sm mt-0.5">Chase sends every payment request automatically — and stops the moment your client pays.</p>
          </div>
          <Link href="https://chase.allonys.com/signup" className="shrink-0 bg-indigo-600 text-white font-semibold px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition-colors whitespace-nowrap">
            Start free trial →
          </Link>
        </div>

        {/* Psychology section */}
        <div className="text-slate-600 leading-relaxed space-y-4 mb-10">
          <p>
            Most freelancers feel a knot in their stomach when a payment is overdue. They draft and re-draft the email, trying to find language that is firm enough to prompt action but gentle enough not to damage the relationship. They add apologies. They soften. They delay sending. And then the payment gets later.
          </p>
          <p>
            The discomfort comes from a false framing: that asking for money you are owed is somehow rude. It is not. You completed the agreed work. The client agreed to pay on a specific date. A payment request is not aggression — it is a professional business communication.
          </p>
          <p>
            The scripts below are calibrated to be firm without being aggressive, professional without being cold. Each one matches the stage of the payment process it is designed for.
          </p>
        </div>

        {/* Psychology principles */}
        <div className="mb-10 border-t border-slate-100 pt-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-5">The Psychology of Asking for Payment</h2>
          <p className="text-slate-600 leading-relaxed mb-6">
            Before we get to the scripts, it helps to understand why certain approaches work and others do not. Three psychological principles drive payment behavior.
          </p>

          <div className="space-y-6">
            <div className="bg-slate-50 rounded-xl p-5">
              <h3 className="font-semibold text-slate-900 mb-2">1. Specificity drives action</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Vague deadlines produce vague responses. "Please pay when you can" gives the client permission to deprioritize your invoice indefinitely. "Please arrange payment by Thursday, March 13" creates a concrete anchor. Clients who are given a specific date are significantly more likely to pay on or near that date.
              </p>
            </div>
            <div className="bg-slate-50 rounded-xl p-5">
              <h3 className="font-semibold text-slate-900 mb-2">2. Friction removal accelerates payment</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Every step between "I want to pay this" and "payment sent" is a potential drop-off point. Clients who have to look up bank details, log into a portal, or find the original invoice take longer to pay — or put it off entirely. Including a direct payment link in every email is the single highest-leverage action you can take.
              </p>
            </div>
            <div className="bg-slate-50 rounded-xl p-5">
              <h3 className="font-semibold text-slate-900 mb-2">3. Escalating tone signals seriousness</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                A warm, friendly first reminder is appropriate — it assumes good faith and allows the client a graceful exit ("I missed it, sorry, paying now"). But a fifth friendly reminder teaches clients that your invoices have no real consequences. Each email should be incrementally firmer. The escalation of tone is itself the signal.
              </p>
            </div>
          </div>
        </div>

        {/* Scripts section */}
        <div className="border-t border-slate-100 pt-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">6 Word-for-Word Payment Request Scripts</h2>
          <p className="text-slate-600 leading-relaxed mb-8">
            Replace all fields in brackets with your actual details. The rest can be sent as-is.
          </p>

          <Script
            timing="Before due date"
            label="Script 1: Sending the Invoice"
            subject="Invoice #[number] for [project name] — due [date]"
            body={`Hi [Client name],

Please find attached Invoice #[number] for [project name], totalling [amount].

Payment is due on [due date]. You can pay directly here: [payment link]

The invoice covers:
• [Brief description of deliverable 1]
• [Brief description of deliverable 2]

Please let me know if you have any questions. Looking forward to hearing from you.

Best,
[Your name]`}
            note="Send this email the same day or day after project completion. Attaching the invoice and including a payment link in the very first send sets a professional tone and reduces time-to-payment significantly."
          />

          <Script
            timing="Day 1–2 after due date"
            label="Script 2: The Gentle Nudge"
            subject="Quick follow-up: Invoice #[number]"
            body={`Hi [Client name],

I'm following up on Invoice #[number] for [amount], which was due on [date]. I wanted to check in case it slipped through the inbox.

Payment link: [link]

Happy to help with anything if there are questions about the invoice.

Thanks,
[Your name]`}
            note="Keep this one short and assume positive intent. The payment link should always be prominent. This email alone resolves the majority of late invoices — most are genuinely oversights."
          />

          <Script
            timing="Day 7 after due date"
            label="Script 3: The Firm Follow-Up"
            subject="Invoice #[number] — now 7 days overdue"
            body={`Hi [Client name],

I wanted to follow up again on Invoice #[number] for [amount], which is now 7 days past the due date of [date].

Could you let me know when I can expect payment? If there's anything preventing you from processing it — a question about the invoice, a different payment method needed — I'm happy to help sort it out.

Otherwise, I'd appreciate payment by [specific date].

Payment link: [link]

Thank you,
[Your name]`}
            note="Reference the number of days overdue. It makes the timeline concrete and signals that you are tracking it. Offering an 'escape hatch' (is there a problem?) helps clients who are embarrassed or facing internal AP delays to respond rather than go silent."
          />

          <Script
            timing="Day 14 after due date"
            label="Script 4: The Formal Notice"
            subject="Final notice: Invoice #[number] — [amount] outstanding"
            body={`Hi [Client name],

This is a formal follow-up regarding Invoice #[number] for [amount], which is now 14 days overdue.

I've sent two previous follow-up emails and have not received a response or payment. Please arrange payment by [specific date] to avoid any further action.

Payment link: [link]

If you have already sent payment, please disregard this message and send me the payment reference so I can update my records.

[Your name]`}
            note="The phrase 'avoid any further action' implies escalation without being a specific threat you may not be prepared to follow through on. At this stage, remove the warm pleasantries. Brevity and formality signal that this is serious."
          />

          <Script
            timing="Day 21+ (no response)"
            label="Script 5: The Escalation Warning"
            subject="Outstanding invoice #[number] — response required by [date]"
            body={`Hi [Client name],

Despite three previous emails, Invoice #[number] for [amount] (due [original due date]) remains unpaid.

I would like to resolve this directly before pursuing other options. Please respond to this email or arrange payment by [date].

If I do not hear from you by [date], I will need to explore formal debt recovery options.

[Your name]`}
            note="Only send this if all previous emails have been genuinely ignored — no replies, no partial payments, nothing. Mentioning 'formal debt recovery' is accurate (collections, small claims court, or a lawyer's letter are all legitimate options at this stage) and typically produces a response."
          />

          <Script
            timing="Any stage — phone call follow-up"
            label="Script 6: The Phone Follow-Up"
            subject="Following up on our call — Invoice #[number]"
            body={`Hi [Client name],

Thanks for taking my call earlier today. As discussed, I'm following up on Invoice #[number] for [amount], which has been outstanding since [date].

As agreed on the call, I'll expect payment by [date].

Payment link for your convenience: [link]

Please let me know once the payment has been processed.

Thank you,
[Your name]`}
            note="After a phone call, always follow up by email to create a written record. Reference what was agreed on the call so both parties have a clear paper trail. This matters if the situation ever escalates."
          />
        </div>

        {/* What NOT to do */}
        <div className="mb-10 border-t border-slate-100 pt-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-5">What Not to Say When Asking for Payment</h2>

          <div className="space-y-4">
            {[
              {
                avoid: '"I\'m so sorry to bother you with this..."',
                why: 'Apologizing for invoicing puts you in a subservient position from the first word. You are not bothering anyone — you are requesting payment for completed work.',
              },
              {
                avoid: '"Whenever you get a chance..."',
                why: 'This is permission to pay never. Use specific dates. "Please arrange payment by Friday" is a request. "Whenever you get a chance" is a suggestion.',
              },
              {
                avoid: '"I know you\'re probably really busy..."',
                why: 'This is you pre-emptively excusing the client\'s non-payment. It signals that you don\'t expect to be taken seriously.',
              },
              {
                avoid: '"I hate to keep bothering you but..."',
                why: 'Following up on a legitimate debt is not "bothering" anyone. Remove this framing entirely.',
              },
              {
                avoid: '"Just checking in..." (on the 4th email)',
                why: 'At day 14 and beyond, "just checking in" is wildly out of proportion to the situation. Match the tone to the stage.',
              },
            ].map(item => (
              <div key={item.avoid} className="border border-slate-200 rounded-xl p-5">
                <p className="font-mono text-sm text-red-600 mb-2 font-semibold">{item.avoid}</p>
                <p className="text-slate-600 text-sm leading-relaxed">{item.why}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Automate section */}
        <div className="mb-10 border-t border-slate-100 pt-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-5">How Chase Automates All of This</h2>

          <div className="text-slate-600 leading-relaxed space-y-4 mb-6">
            <p>
              The six scripts above work. The problem is execution — remembering to send them, at the right interval, for every invoice, while running a full client workload. Most freelancers either skip the follow-ups entirely or send them inconsistently.
            </p>
            <p>
              <Link href="https://chase.allonys.com" className="text-indigo-600 hover:underline">Chase</Link> handles the entire sequence automatically. When an invoice is created, Chase schedules payment reminders for day 3, day 7, and day 14 after the due date. When your client pays, Chase detects the payment and cancels all future reminders immediately.
            </p>
            <p>
              You never have to draft a follow-up email again. You never have to track which clients have paid and which have not. And you never have to feel that knot in your stomach about sending the third email to a client who is already 14 days late.
            </p>
          </div>

          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6">
            <h3 className="font-semibold text-indigo-900 mb-3">What Chase does automatically</h3>
            <ul className="space-y-2">
              {[
                'Sends invoice via email with a Stripe payment link',
                'Schedules follow-up reminders at day 3, 7, and 14',
                'Monitors for payment and stops all follow-ups the moment it clears',
                'Marks invoices as paid, overdue, or cancelled in your dashboard',
                'Tracks which clients pay on time and which consistently pay late',
              ].map(item => (
                <li key={item} className="flex gap-2 items-start text-sm text-indigo-800">
                  <span className="mt-1 shrink-0 w-4 h-4 bg-indigo-200 rounded-full flex items-center justify-center text-xs font-bold text-indigo-700">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="border-t border-slate-100 pt-10 mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Stop writing follow-up emails. Automate them.</h2>
          <p className="text-slate-600 leading-relaxed mb-6">
            Chase handles every payment request automatically — from the initial invoice send to the final notice. Free for your first 3 invoices. No credit card required.
          </p>
          <Link href="https://chase.allonys.com/signup" className="inline-flex items-center gap-2 bg-indigo-600 text-white font-semibold px-5 py-3 rounded-xl hover:bg-indigo-700 transition-colors">
            Start free trial →
          </Link>
        </div>

        {/* Bottom dark CTA */}
        <div className="mt-10 bg-slate-900 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Never feel awkward about chasing payments again.</h2>
          <p className="text-slate-400 mb-6 max-w-md mx-auto text-sm leading-relaxed">
            Chase sends every follow-up automatically — professional, timely, and perfectly calibrated. You just do the work.
          </p>
          <Link
            href="https://chase.allonys.com/signup"
            className="inline-flex items-center gap-2 bg-white text-slate-900 font-semibold px-6 py-3 rounded-xl hover:bg-slate-100 transition-colors"
          >
            Start free trial →
          </Link>
          <p className="text-slate-500 text-xs mt-3">Setup takes 3 minutes. Free for first 3 invoices.</p>
        </div>

        {/* Related */}
        <div className="mt-10 pt-8 border-t border-slate-100">
          <p className="text-sm font-semibold text-slate-400 mb-4">More guides</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <Link href="/blog/late-payment-email" className="group block border border-slate-200 rounded-xl p-5 hover:border-indigo-200 transition-colors">
              <span className="text-xs text-indigo-600 font-semibold">Email Templates</span>
              <h3 className="font-semibold text-slate-900 mt-1 group-hover:text-indigo-700 transition-colors">Late Payment Email: 8 Templates That Actually Work</h3>
            </Link>
            <Link href="/blog/invoice-follow-up-email-templates" className="group block border border-slate-200 rounded-xl p-5 hover:border-indigo-200 transition-colors">
              <span className="text-xs text-indigo-600 font-semibold">Email Templates</span>
              <h3 className="font-semibold text-slate-900 mt-1 group-hover:text-indigo-700 transition-colors">Invoice Follow-Up Email Templates: Day 3, 7, 14 & Final Notice</h3>
            </Link>
          </div>
        </div>
      </article>
    </div>
  )
}
