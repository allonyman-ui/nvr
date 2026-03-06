import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Late Payment Email: 8 Templates That Actually Work (Copy & Paste)',
  description: '8 late payment email templates for every stage — from friendly nudge to final warning. Copy-paste ready, calibrated for tone and timing. Plus how Chase automates the whole sequence.',
  keywords: [
    'late payment email',
    'late payment email template',
    'overdue payment email',
    'late invoice email template',
    'chasing payment email',
    'unpaid invoice email template',
    'payment overdue email',
  ],
  openGraph: {
    title: 'Late Payment Email: 8 Templates That Actually Work (Copy & Paste)',
    description: '8 escalating late payment email templates from friendly nudge to final warning — plus the timing and tone tips that make them work.',
    url: 'https://chase.allonys.com/blog/late-payment-email',
    type: 'article',
  },
  alternates: {
    canonical: 'https://chase.allonys.com/blog/late-payment-email',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Late Payment Email: 8 Templates That Actually Work (Copy & Paste)',
  description: '8 escalating late payment email templates from friendly nudge to final warning, with timing and tone guidance.',
  datePublished: '2026-03-06',
  dateModified: '2026-03-06',
  author: {
    '@type': 'Organization',
    name: 'Chase',
    url: 'https://chase.allonys.com',
  },
}

interface EmailTemplateProps {
  number: string
  label: string
  timing: string
  subject: string
  body: string
  note: string
}

function EmailTemplate({ number, label, timing, subject, body, note }: EmailTemplateProps) {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-4">
        <span className="bg-indigo-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">Template {number}</span>
        <div>
          <h3 className="text-xl font-bold text-slate-900">{label}</h3>
          <p className="text-sm text-slate-500 mt-0.5">{timing}</p>
        </div>
      </div>
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Email template — copy and paste</p>
        <p className="text-sm text-slate-700 mb-1"><strong>Subject:</strong> {subject}</p>
        <div className="mt-3 text-sm text-slate-700 leading-relaxed whitespace-pre-line font-mono border-t border-slate-200 pt-4">
          {body}
        </div>
      </div>
      <p className="text-sm text-slate-500 mt-3 italic">{note}</p>
    </div>
  )
}

export default function LatePaymentEmailPage() {
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
            { '@type': 'ListItem', position: 3, name: 'Late Payment Email: 8 Templates That Actually Work', item: 'https://chase.allonys.com/blog/late-payment-email' },
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

      <article className="max-w-3xl mx-auto px-6 py-14">

        {/* Header */}
        <div className="mb-10">
          <Link href="/blog" className="text-indigo-600 text-sm font-medium hover:underline inline-flex items-center gap-1 mb-6">
            ← Blog
          </Link>
          <div className="flex items-center gap-3 mb-5">
            <span className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-2.5 py-1 rounded-full">Email Templates</span>
            <span className="text-slate-400 text-sm">March 2026 · 9 min read</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight leading-tight mb-5">
            Late Payment Email: 8 Templates That Actually Work (Copy &amp; Paste)
          </h1>
          <p className="text-xl text-slate-500 leading-relaxed">
            Eight escalating late payment email templates — from a warm first nudge to a firm final notice — with the timing and tone guidance that makes the difference between being ignored and getting paid.
          </p>
        </div>

        {/* Inline CTA */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-6 py-5 mb-10 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
          <div>
            <p className="font-semibold text-indigo-900 text-sm">Rather not write these yourself?</p>
            <p className="text-indigo-700 text-sm mt-0.5">Chase sends all follow-ups automatically — and stops the moment your client pays.</p>
          </div>
          <Link href="https://chase.allonys.com/signup" className="shrink-0 bg-indigo-600 text-white font-semibold px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition-colors whitespace-nowrap">
            Start free trial →
          </Link>
        </div>

        {/* Intro */}
        <div className="text-slate-600 leading-relaxed space-y-4 mb-10">
          <p>
            A late payment email does two things: it reminds the client that an invoice is overdue, and it signals how serious the situation is. Both functions depend on getting the tone exactly right for the moment. Too soft and the client feels no urgency. Too aggressive and you damage the relationship — or worse, make the client defensive and less likely to pay.
          </p>
          <p>
            The eight templates below are calibrated for specific points in the late payment timeline. Each one is copy-paste ready — replace the fields in brackets with your actual details. Notes after each template explain what makes it work and when to use it.
          </p>
          <p>
            A full late payment sequence typically covers the period from the day the invoice is due through to the point where escalation becomes necessary. We cover all of that below.
          </p>
        </div>

        {/* Timing guidance */}
        <div className="mb-10 border-t border-slate-100 pt-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-5">The Timing of an Effective Late Payment Sequence</h2>
          <p className="text-slate-600 leading-relaxed mb-5">
            The sequence matters as much as the individual emails. Too frequent and you seem aggressive. Too spaced out and the client deprioritizes the invoice. This is the cadence that produces the highest payment rates:
          </p>

          <div className="space-y-3 mb-6">
            {[
              { stage: 'Day 0', text: 'Invoice due date passes — do not send anything immediately' },
              { stage: 'Day 1–3', text: 'First gentle reminder — assume it was an oversight' },
              { stage: 'Day 7', text: 'Firmer follow-up — acknowledge it is now a week overdue' },
              { stage: 'Day 14', text: 'Formal notice — direct and professional, implies escalation' },
              { stage: 'Day 21', text: 'Escalation warning — last chance to resolve before formal action' },
              { stage: 'Day 30+', text: 'Final demand / escalation — collections, legal, or public review' },
            ].map(item => (
              <div key={item.stage} className="flex gap-3 items-start">
                <span className="bg-indigo-600 text-white text-xs font-bold px-2 py-0.5 rounded whitespace-nowrap mt-0.5 min-w-[60px] text-center">{item.stage}</span>
                <p className="text-sm text-slate-600">{item.text}</p>
              </div>
            ))}
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
            <p className="font-semibold text-amber-900 mb-1 text-sm">One rule that overrides everything</p>
            <p className="text-amber-800 text-sm leading-relaxed">
              Stop all follow-ups the moment the client pays. Sending a "final warning" to a client who paid yesterday is a relationship-ending mistake. If you are automating your follow-ups, make absolutely certain the system checks for payment before sending each email.
            </p>
          </div>
        </div>

        {/* Templates */}
        <div className="border-t border-slate-100 pt-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">8 Late Payment Email Templates</h2>

          <EmailTemplate
            number="1"
            label="The Friendly Nudge"
            timing="Day 1–3 after due date"
            subject="Quick follow-up: Invoice #[number]"
            body={`Hi [Client name],

Just a quick note to follow up on Invoice #[number] for [amount], which was due on [date].

I'm sure it's just slipped through the inbox — these things happen! Here's the payment link for easy access: [payment link]

Let me know if you have any questions.

Thanks,
[Your name]`}
            note="Keep this one conversational and brief. The goal is to make the client feel like you are doing them a favor by reminding them, not accusing them of anything. This template alone resolves approximately 40–50% of late invoices."
          />

          <EmailTemplate
            number="2"
            label="The Slightly More Direct Nudge"
            timing="Day 3–5 after due date (if no response to Template 1)"
            subject="Invoice #[number] — following up again"
            body={`Hi [Client name],

I'm following up on my previous email regarding Invoice #[number] for [amount], now [X] days past the due date of [date].

I want to make sure this reaches the right person — sometimes these get lost between project contacts and accounts payable.

Payment can be made here: [payment link]

Please let me know once it's been processed, or if there's anything you need from my end.

Best,
[Your name]`}
            note="The mention of 'the right person' subtly invites the client to forward the invoice if they are not the one responsible for payment — useful when dealing with larger organizations where your contact is not in AP."
          />

          <EmailTemplate
            number="3"
            label="The Acknowledgment of Lateness"
            timing="Day 7 after due date"
            subject="Invoice #[number] — now 7 days overdue"
            body={`Hi [Client name],

I'm reaching out regarding Invoice #[number] for [amount], which is now 7 days past its due date of [date].

I've sent two previous follow-up emails and have not yet received a response. Could you let me know:

a) If the payment is being processed, and when I can expect it
b) If there's an issue with the invoice that needs resolving

I'm happy to help with whatever is needed. Otherwise, I'd appreciate payment by [specific date, e.g., this Friday].

Payment link: [link]

Thank you,
[Your name]`}
            note="Explicitly acknowledging that you have sent previous emails signals that you are tracking this invoice. The 'a or b' structure gives the client two easy responses and makes it harder to just not reply at all."
          />

          <EmailTemplate
            number="4"
            label="The Business-Tone Escalation"
            timing="Day 10 after due date (if still no response)"
            subject="Payment required: Invoice #[number] — [amount] overdue"
            body={`Hi [Client name],

This is a follow-up regarding Invoice #[number] for [amount], now 10 days past the due date of [date], with no payment or response received.

I'd like to resolve this quickly. Please arrange payment by [specific date] or reply to this email to discuss.

Payment link: [link]

If this has already been paid, please send me the payment reference so I can update my records.

[Your name]`}
            note="The tone shifts here: shorter, less warm, more direct. This is intentional. The escalation of formality signals to the client that this is becoming a more serious situation. Do not add pleasantries at this stage."
          />

          <EmailTemplate
            number="5"
            label="The Formal Notice"
            timing="Day 14 after due date"
            subject="Final notice: Invoice #[number] — [amount] outstanding"
            body={`Hi [Client name],

This is a formal notice regarding Invoice #[number] for [amount], which is now 14 days overdue.

I have sent four previous emails regarding this invoice and have not received a response or payment. I am requesting immediate payment by [specific date].

Please arrange payment here: [link]

Failure to pay by [date] will require me to consider further options to recover the outstanding amount.

[Your name]`}
            note='This email uses formal language throughout. "Formal notice" and "failure to pay... further options" are legal-adjacent phrases that signal seriousness. Do not soften this email — its directness is what makes it effective.'
          />

          <EmailTemplate
            number="6"
            label="The Specific Escalation Warning"
            timing="Day 21 after due date"
            subject="Outstanding invoice #[number] — response required by [date]"
            body={`Hi [Client name],

Invoice #[number] for [amount] (due [original due date]) remains unpaid after five follow-up communications.

I am writing to inform you that if payment is not received by [specific date], I will be pursuing the matter through [collections / small claims court / a formal demand letter] to recover the amount owed.

If you are experiencing a genuine difficulty, please contact me directly and I will consider a payment arrangement.

Otherwise, I expect payment of [amount] in full by [date].

[Your name]`}
            note="This template names a specific escalation path. Only use this if you are actually prepared to follow through. Make 'payment arrangement' sound like a concession — it makes clients who are genuinely struggling reach out rather than go silent."
          />

          <EmailTemplate
            number="7"
            label="For Partially Responsive Clients"
            timing="Use when client has replied but keeps delaying"
            subject="Re: Invoice #[number] — payment arrangement"
            body={`Hi [Client name],

Thank you for getting back to me regarding Invoice #[number]. I understand payments can sometimes be delayed.

Based on our conversation, I can accept payment in [two instalments / by a new date of [date]], provided that we confirm this arrangement in writing now.

Please reply to confirm:
• First payment: [amount] by [date]
• Second payment: [amount] by [date]

Once confirmed, I will update the invoice accordingly.

[Your name]`}
            note="For clients who are communicating but stalling, offering a structured payment arrangement often gets the situation resolved. Get the arrangement confirmed in writing — email is sufficient — before agreeing to it."
          />

          <EmailTemplate
            number="8"
            label="The Final Demand"
            timing="Day 30+ after due date (last contact before formal action)"
            subject="Final demand: Invoice #[number] — [amount] — [date]"
            body={`[Client name] / [Company name]
[Client address if known]

FINAL DEMAND FOR PAYMENT

Invoice number: #[number]
Invoice date: [date]
Amount outstanding: [amount]
Original due date: [date]
Days overdue: [X]

Despite multiple written communications, the above invoice remains unpaid. This is a final demand for payment of [amount] in full.

If payment is not received by [date], I will proceed with formal debt recovery action without further notice. This may include reporting to a credit agency, referral to a collections agency, or legal proceedings.

Payment can be made here: [payment link]

[Your name]
[Your contact details]`}
            note="This template is structured as a formal demand letter. Use it only after all other attempts have failed. The formal structure — address block, capitalized header — serves a legal purpose if the matter ever goes to small claims court. Keep a copy of every email you have sent before this one."
          />
        </div>

        {/* Subject line tips */}
        <div className="mb-10 border-t border-slate-100 pt-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-5">Subject Line Tips That Get Late Payment Emails Opened</h2>

          <div className="text-slate-600 leading-relaxed mb-5">
            <p>
              The best email in the world does nothing if it is never opened. Subject lines for late payment emails need to be clear, direct, and specific. Avoid vague subject lines — clients should know immediately what the email is about.
            </p>
          </div>

          <div className="space-y-3">
            {[
              { type: 'Works well', example: '"Invoice #042 — payment overdue"', why: 'Specific, factual, immediately clear' },
              { type: 'Works well', example: '"Quick follow-up: Invoice #042"', why: 'Low-pressure opener for early reminders' },
              { type: 'Works well', example: '"Final notice: Invoice #042 — $2,400 outstanding"', why: 'Amount and urgency signal seriousness' },
              { type: 'Avoid', example: '"Just checking in..."', why: 'Too vague, sounds like a project update' },
              { type: 'Avoid', example: '"Hi"', why: 'Zero context, likely to be deprioritized' },
              { type: 'Avoid', example: '"URGENT — YOU OWE MONEY"', why: 'Aggressive tone puts clients on the defensive' },
            ].map(item => (
              <div key={item.example} className="flex items-start gap-3">
                <span className={`shrink-0 mt-0.5 text-xs font-bold px-2 py-0.5 rounded ${item.type === 'Works well' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
                  {item.type}
                </span>
                <div>
                  <p className="font-mono text-sm text-slate-800">{item.example}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{item.why}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Automation section */}
        <div className="mb-10 border-t border-slate-100 pt-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-5">How Chase Automates Your Entire Late Payment Sequence</h2>

          <div className="text-slate-600 leading-relaxed space-y-4 mb-6">
            <p>
              Writing these eight templates into a document is a useful exercise. Actually executing the sequence — for every invoice, at exactly the right time, switching off when payment arrives — is where it breaks down for most freelancers.
            </p>
            <p>
              Manual follow-up requires you to remember which invoices are overdue, which emails have been sent to each client, and when to send the next one. It takes time, creates anxiety, and still gets missed when you are busy with actual client work.
            </p>
            <p>
              <Link href="https://chase.allonys.com" className="text-indigo-600 hover:underline">Chase</Link> handles the entire sequence automatically. Create the invoice, set the due date, and Chase takes over: monitoring for payment, sending follow-ups at day 3, 7, and 14 after the due date, and stopping immediately when payment is received via Stripe.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            {[
              { title: 'No manual tracking', body: 'Chase monitors every invoice due date automatically — you never need to check a spreadsheet.' },
              { title: 'Perfect timing', body: 'Follow-ups go out at day 3, 7, and 14 after the due date — not late, not early, every time.' },
              { title: 'Automatic stop', body: 'When your client pays via Stripe, Chase detects it and cancels all pending follow-ups immediately.' },
              { title: 'Payment links included', body: 'Every follow-up email includes a direct Stripe payment link — the single biggest driver of faster payment.' },
            ].map(item => (
              <div key={item.title} className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                <h3 className="font-semibold text-slate-900 mb-2 text-sm">{item.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="border-t border-slate-100 pt-10 mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Automate your late payment emails with Chase</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            You just did the work. You earned the payment. Stop spending mental energy on follow-up emails and let Chase handle it automatically. Free for your first 3 invoices — setup takes three minutes.
          </p>
          <Link href="https://chase.allonys.com/signup" className="inline-flex items-center gap-2 bg-indigo-600 text-white font-semibold px-5 py-3 rounded-xl hover:bg-indigo-700 transition-colors">
            Start free trial →
          </Link>
        </div>

        {/* Bottom dark CTA */}
        <div className="mt-10 bg-slate-900 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Stop chasing late payments manually.</h2>
          <p className="text-slate-400 mb-6 max-w-md mx-auto text-sm leading-relaxed">
            Chase sends day-3, day-7, and day-14 follow-ups automatically. Stops the moment your client pays. Free for your first 3 invoices.
          </p>
          <Link
            href="https://chase.allonys.com/signup"
            className="inline-flex items-center gap-2 bg-white text-slate-900 font-semibold px-6 py-3 rounded-xl hover:bg-slate-100 transition-colors"
          >
            Start free trial →
          </Link>
          <p className="text-slate-500 text-xs mt-3">Setup takes 3 minutes. No card required.</p>
        </div>

        {/* Related */}
        <div className="mt-10 pt-8 border-t border-slate-100">
          <p className="text-sm font-semibold text-slate-400 mb-4">More guides</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <Link href="/blog/how-to-ask-for-payment-professionally" className="group block border border-slate-200 rounded-xl p-5 hover:border-indigo-200 transition-colors">
              <span className="text-xs text-indigo-600 font-semibold">Getting Paid</span>
              <h3 className="font-semibold text-slate-900 mt-1 group-hover:text-indigo-700 transition-colors">How to Ask for Payment Professionally: Scripts + Email Templates</h3>
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
