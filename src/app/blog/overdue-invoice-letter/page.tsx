import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Overdue Invoice Letter: 5 Templates That Get You Paid | Chase',
  description: 'Copy-paste overdue invoice letter templates for freelancers. From polite reminders to final demands — with subject lines that get opened.',
  keywords: [
    'overdue invoice letter',
    'overdue invoice email template',
    'overdue payment letter to client',
    'late invoice letter freelancer',
    'overdue invoice notice',
    'past due invoice letter',
    'invoice overdue reminder template',
  ],
  openGraph: {
    title: 'Overdue Invoice Letter: 5 Templates That Get You Paid',
    description: 'Copy-paste overdue invoice letter templates for freelancers. From polite reminders to final demands — with subject lines that get opened.',
    url: 'https://chase.allonys.com/blog/overdue-invoice-letter',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Overdue Invoice Letter: 5 Templates That Get You Paid',
    description: 'Copy-paste overdue invoice letter templates for every stage — friendly reminder through final demand.',
  },
  alternates: {
    canonical: 'https://chase.allonys.com/blog/overdue-invoice-letter',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Overdue Invoice Letter: 5 Templates That Get You Paid',
  description:
    'Copy-paste overdue invoice letter templates for freelancers — from friendly reminder to final demand, with subject lines and sending timeline.',
  datePublished: '2026-03-05',
  dateModified: '2026-03-05',
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
  number: string
  label: string
  timing: string
  subject: string
  body: string
  note: string
}

function TemplateBlock({ number, label, timing, subject, body, note }: TemplateBlockProps) {
  return (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-4">
        <span
          className="text-white text-xs font-bold px-2.5 py-1 rounded-full"
          style={{ backgroundColor: '#4f46e5' }}
        >
          {timing}
        </span>
        <h3 className="text-xl font-bold text-slate-900">
          Template {number}: {label}
        </h3>
      </div>
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
          Overdue invoice letter — copy and paste
        </p>
        <p className="text-sm text-slate-700 mb-1">
          <strong>Subject:</strong> {subject}
        </p>
        <div className="mt-3 border-t border-slate-200 pt-4">
          <pre className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap font-mono">{body}</pre>
        </div>
      </div>
      <p className="text-sm text-slate-500 mt-3 italic">{note}</p>
    </div>
  )
}

export default function OverdueInvoiceLetterPage() {
  return (
    <div className="bg-white min-h-screen">
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
            { '@type': 'ListItem', position: 3, name: 'Overdue Invoice Letter: 5 Templates That Get You Paid', item: 'https://chase.allonys.com/blog/overdue-invoice-letter' },
          ],
        }) }}
      />

      {/* Nav */}
      <nav className="border-b border-slate-200 bg-white sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: '#4f46e5' }}
            >
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="font-semibold text-slate-900 text-base">Chase</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/blog" className="text-sm text-slate-500 hover:text-slate-900">
              Blog
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center gap-1.5 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#4f46e5' }}
            >
              Start free →
            </Link>
          </div>
        </div>
      </nav>

      <article className="max-w-3xl mx-auto px-6 py-14">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-400 mb-8">
          <Link href="/" className="hover:text-slate-600 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-slate-600 transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-slate-600">Overdue Invoice Letter</span>
        </nav>

        {/* Hero */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-5">
            <span
              className="text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{ backgroundColor: '#eef2ff', color: '#4338ca' }}
            >
              Getting Paid
            </span>
            <span className="text-slate-400 text-sm">March 5, 2026 · 8 min read</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight leading-tight mb-5">
            Overdue Invoice Letter: 5 Copy-Paste Templates That Get You Paid
          </h1>
          <p className="text-xl text-slate-500 leading-relaxed">
            Writing an overdue invoice letter is awkward. You do not want to damage the relationship, but you also need to get paid for the work you already delivered. These five word-for-word templates — from a friendly three-day nudge to a firm 30-day final demand — take the guesswork out of what to say and when to say it.
          </p>
        </div>

        {/* Inline CTA */}
        <div
          className="border rounded-xl px-6 py-5 mb-10 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between"
          style={{ backgroundColor: '#eef2ff', borderColor: '#e0e7ff' }}
        >
          <div>
            <p className="font-semibold text-sm" style={{ color: '#312e81' }}>
              Would rather not write any of these?
            </p>
            <p className="text-sm mt-0.5" style={{ color: '#4338ca' }}>
              Chase sends every overdue letter automatically — and stops the moment your client pays.
            </p>
          </div>
          <Link
            href="/signup"
            className="shrink-0 text-white font-semibold px-4 py-2 rounded-lg text-sm hover:opacity-90 transition-opacity whitespace-nowrap"
            style={{ backgroundColor: '#4f46e5' }}
          >
            Automate it free →
          </Link>
        </div>

        {/* Intro */}
        <div className="text-slate-600 leading-relaxed space-y-4 mb-10">
          <p>
            85% of freelancers report getting paid late. The average invoice sits outstanding for 39 days before the money arrives — if it arrives at all. The number-one cause is not client dishonesty. It is a combination of busy inboxes, forgotten invoices, and the freelancer&apos;s own reluctance to follow up more than once because it feels rude.
          </p>
          <p>
            It is not rude. You completed the work. You held up your end of the contract. Sending an overdue invoice letter — or three — is a normal, professional part of running a freelance business.
          </p>
          <p>
            Below you will find five complete overdue invoice letter templates covering every stage from the first gentle reminder through formal escalation. Each template includes a subject line tested for open rates, the full body text ready to personalise, and a note on what makes that particular letter effective at that stage.
          </p>
        </div>

        {/* When to send */}
        <div className="mb-12 border-t border-slate-100 pt-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">When to send an overdue invoice letter</h2>
          <p className="text-slate-600 leading-relaxed mb-6">
            Timing is everything. Send too early and you look anxious; send too late and you have lost leverage. This is the proven timeline used by professional invoicing systems — including the one Chase runs automatically for every invoice you create.
          </p>

          <div className="space-y-4">
            {[
              {
                day: 'Day 1 (invoice sent)',
                desc: 'Send the invoice with a clear due date, the total amount, and a direct payment link. No chasing needed yet — just a clean, professional invoice.',
                color: '#6366f1',
              },
              {
                day: 'Day 3 past due',
                desc: 'Send Template 1: a warm, casual reminder. Assume it was an oversight. This email alone recovers 40–50% of late invoices.',
                color: '#6366f1',
              },
              {
                day: 'Day 7 past due',
                desc: 'Send Template 2: a firmer second notice. Set a specific new deadline. Mention the invoice number and amount clearly.',
                color: '#4f46e5',
              },
              {
                day: 'Day 14 past due',
                desc: 'Send Template 3: a firm overdue notice. Reference previous unanswered follow-ups. Introduce the possibility of a late fee.',
                color: '#4338ca',
              },
              {
                day: 'Day 21 past due',
                desc: 'Send Template 4: a formal final demand. State explicitly that you require payment by a specific date or will escalate.',
                color: '#3730a3',
              },
              {
                day: 'Day 30+ past due',
                desc: 'Send Template 5: an escalation notice. Consider involving a collections agency, a solicitor, or a small claims filing. The letter signals this clearly.',
                color: '#312e81',
              },
            ].map(({ day, desc, color }) => (
              <div key={day} className="flex gap-4 items-start">
                <div
                  className="shrink-0 w-2 h-2 rounded-full mt-2"
                  style={{ backgroundColor: color }}
                />
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{day}</p>
                  <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Templates */}
        <div className="border-t border-slate-100 pt-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            5 overdue invoice letter templates (copy-paste ready)
          </h2>
          <p className="text-slate-600 leading-relaxed mb-10">
            Replace every field in brackets with your actual invoice details. The rest can be sent as-is. Do not over-personalise the later templates — a formal tone signals seriousness more effectively than a chatty one.
          </p>

          <TemplateBlock
            number="1"
            label="Friendly Reminder"
            timing="3 days past due"
            subject="Quick follow-up on Invoice #[number]"
            body={`Hi [Client name],

Hope things are going well on your end! I wanted to send a quick note to follow up on Invoice #[number] for [project description], which was due on [original due date]. The total outstanding is [amount].

I know inboxes get busy — it may have slipped through. You can view and pay the invoice here:

[Payment link]

If you have any questions about the invoice or the work, just reply here and I will be happy to help.

Thanks so much,
[Your name]`}
            note="Tone: warm and conversational. Never use the word 'overdue' in this first letter — assume it was an innocent oversight. The phrase 'I know inboxes get busy' gives the client a graceful way to pay without acknowledging they forgot."
          />

          <TemplateBlock
            number="2"
            label="Second Notice"
            timing="7 days past due"
            subject="Invoice #[number] — now 7 days overdue ([amount])"
            body={`Hi [Client name],

I'm following up again on Invoice #[number] for [amount], which is now 7 days past the due date of [original due date].

If there's an issue with the invoice — an error, a query, or a payment difficulty — please let me know and we can sort it out quickly. Otherwise, I'd appreciate payment by [new specific date, e.g., this Friday].

Payment link: [link]

If you've already sent payment, please ignore this email and thank you!

Best,
[Your name]`}
            note="Tone: professional with a slight escalation. The 'if there's an issue' line is deliberate — it gives the client a face-saving reason to respond, which is often more effective than demanding payment outright. Setting a new specific deadline ('this Friday') increases payment rates meaningfully."
          />

          <TemplateBlock
            number="3"
            label="Firm Notice"
            timing="14 days past due"
            subject="Overdue invoice notice: #[number] — [amount] outstanding"
            body={`Hi [Client name],

I'm contacting you regarding Invoice #[number] for [amount], which is now 14 days overdue. I sent follow-up emails on [date of first follow-up] and [date of second follow-up] and have not yet received a response or payment.

I'd like to resolve this directly and promptly. Please arrange payment by [date — 3–5 days from now] using the link below.

Payment link: [link]

Please note that a late payment fee of [1.5% per month / $25 flat fee — choose one] may be applied to invoices outstanding beyond [number] days, as outlined in our original agreement.

If you have already sent payment, please let me know the transfer reference and I will confirm receipt.

[Your name]`}
            note="Tone: firm, factual, and professional. This is the first template where you introduce the late fee — framing it as a reminder of your original terms, not a new punishment. Reference your previous unanswered emails explicitly; this creates a paper trail and signals that you are keeping records."
          />

          <TemplateBlock
            number="4"
            label="Final Demand Letter"
            timing="21 days past due"
            subject="Final demand: Invoice #[number] — payment required by [date]"
            body={`Dear [Client name],

This is a formal final demand for payment of Invoice #[number] in the amount of [amount], originally due on [original due date].

I have sent three previous communications regarding this outstanding balance on [date 1], [date 2], and [date 3]. I have not received payment or a response explaining the delay.

I require payment in full by [date — 5 days from now]. If payment is not received by this date, I will be left with no choice but to escalate this matter through the appropriate channels.

To make payment, please use the following link: [payment link]

If there is a genuine dispute regarding this invoice, please contact me by [same date] in writing to discuss the matter.

[Your full name]
[Your business name]
[Your contact details]`}
            note="Tone: formal and unambiguous. Switch to 'Dear' instead of 'Hi' — the formality signals a shift in the relationship. Use your full name and business name in the sign-off. The phrase 'appropriate channels' deliberately leaves escalation undefined; it could mean collections, a solicitor, or a small claims court, which gives it maximum psychological weight."
          />

          <TemplateBlock
            number="5"
            label="Escalation Notice"
            timing="30+ days past due"
            subject="Outstanding invoice #[number] — escalation notice"
            body={`Dear [Client name],

I am writing regarding Invoice #[number] for [amount], which has been outstanding since [original due date] — now [X] days overdue.

Despite repeated communications on [list dates], I have received neither payment nor a substantive response. I have allowed [X] additional days beyond my final demand of [date] and the balance remains unpaid.

I am now taking the following steps:

1. Applying a late payment fee of [amount or percentage], bringing the total outstanding to [new total].
2. Referring this matter to [a debt collection agency / a solicitor / small claims court] if payment is not received within 7 days.

To avoid further action, please make payment in full by [date] using this link: [payment link]

If you wish to discuss a formal payment arrangement, you must contact me in writing before the above deadline.

[Your full name]
[Your business name]
[Your contact details]`}
            note="Tone: formal and legally aware. Numbered steps signal that you have a structured plan — not an empty threat. Only send this template if you are genuinely prepared to follow through on the escalation steps you name. Empty threats destroy credibility and give clients permission to ignore future letters."
          />
        </div>

        {/* What to include */}
        <div className="border-t border-slate-100 pt-10 mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            What to include in every overdue invoice letter
          </h2>
          <p className="text-slate-600 leading-relaxed mb-6">
            Regardless of which template you are sending, every overdue payment letter to a client should include the same core information. Missing any of these gives the client a reason to stall — &quot;I&apos;ll need to look up the invoice number&quot; is a classic delaying tactic.
          </p>

          <div className="space-y-4">
            {[
              {
                title: 'Invoice number',
                body: 'Always reference the exact invoice number. It removes ambiguity and makes it easy for the client to locate the original invoice or forward your email to their accounts team.',
              },
              {
                title: 'Amount outstanding',
                body: "State the exact amount — including any currency — in the email body itself, not just in an attachment. Clients should be able to see the number without opening anything.",
              },
              {
                title: 'Original due date',
                body: 'Referencing the original due date establishes that the invoice is genuinely late, not just slightly delayed. It also anchors any late fee calculation.',
              },
              {
                title: 'A direct payment link',
                body: 'Every overdue invoice letter should make it frictionless to pay. A direct payment link — not just an attachment or an instruction to "pay by bank transfer" — reduces the steps between reading your email and paying you.',
              },
              {
                title: 'Late fee terms (from Day 14 onward)',
                body: 'If your contract includes late fees, reference them from your third letter onward. Do not introduce a fee that was not in your original agreement — it will be disputed and damage the relationship.',
              },
              {
                title: 'Your contact details',
                body: 'In later, more formal letters, include your full name, business name, and a way to reach you. This signals professionalism and creates a complete paper trail should you need to escalate.',
              },
            ].map(({ title, body }, i) => (
              <div key={title} className="flex gap-4">
                <div
                  className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold text-white"
                  style={{ backgroundColor: '#4f46e5' }}
                >
                  {i + 1}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">{title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Late fees */}
        <div className="border-t border-slate-100 pt-10 mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Late fees: should you charge them?
          </h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            Short answer: yes — but only if you mentioned them upfront. A late fee clause in your contract or your invoice payment terms is one of the most effective tools you have for preventing overdue invoices in the first place. Clients who know a fee kicks in at Day 30 tend to pay before Day 30.
          </p>
          <p className="text-slate-600 leading-relaxed mb-4">
            The two most common approaches are:
          </p>
          <ul className="space-y-3 mb-6">
            <li className="flex gap-3">
              <span
                className="shrink-0 w-2 h-2 rounded-full mt-2"
                style={{ backgroundColor: '#4f46e5' }}
              />
              <p className="text-slate-600 text-sm leading-relaxed">
                <strong className="text-slate-900">Percentage-based:</strong> 1.5% per month (18% per year) is the most commonly cited rate for freelance invoices. It is enough to be meaningful, but not so aggressive that it triggers a dispute.
              </p>
            </li>
            <li className="flex gap-3">
              <span
                className="shrink-0 w-2 h-2 rounded-full mt-2"
                style={{ backgroundColor: '#4f46e5' }}
              />
              <p className="text-slate-600 text-sm leading-relaxed">
                <strong className="text-slate-900">Flat fee:</strong> A flat $25 or $50 late fee is simpler to calculate and easier to explain. It works better for smaller invoices where a percentage would be trivially small.
              </p>
            </li>
          </ul>
          <div
            className="border rounded-xl p-5"
            style={{ backgroundColor: '#fafafa', borderColor: '#e2e8f0' }}
          >
            <p className="text-sm text-slate-700 leading-relaxed">
              <strong>Important:</strong> Do not introduce a late fee in an overdue invoice letter if it was not part of your original agreement. Springing a new charge on a client who is already slow to pay is likely to cause a dispute that delays payment further. If you want to use late fees, add them to your contract template and your invoice footer — then reference them in your Day 14 overdue letter as a reminder, not a surprise.
            </p>
          </div>
        </div>

        {/* Automate CTA section */}
        <div className="border-t border-slate-100 pt-10 mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            How to automate overdue invoice letters
          </h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            These templates work — but only if you actually send them, on the right day, for every overdue invoice. That sounds simple until you are managing four active clients, each with invoices at different stages. The follow-up slips, the client does not hear from you, and the invoice ages uncollected.
          </p>
          <p className="text-slate-600 leading-relaxed mb-4">
            This is exactly the problem <Link href="/" className="hover:underline" style={{ color: '#4f46e5' }}>Chase</Link> solves. When you create an invoice in Chase, it automatically schedules the full overdue letter sequence — Day 3, Day 7, Day 14, and beyond — and sends each one at the right time without any manual effort from you. The moment your client pays, Chase cancels all remaining letters automatically. You never have to worry about chasing someone who already paid.
          </p>
          <p className="text-slate-600 leading-relaxed mb-6">
            You can also customise the templates inside Chase to match your voice and your specific late fee terms. Set it up once per invoice, then forget about it until the money arrives.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 text-white font-semibold px-5 py-3 rounded-xl hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#4f46e5' }}
          >
            Automate your overdue invoice letters — free →
          </Link>
          <p className="text-slate-400 text-xs mt-3">Free for your first 3 invoices. No credit card required. Setup takes under 5 minutes.</p>
        </div>

        {/* FAQ */}
        <div className="border-t border-slate-100 pt-10 mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Frequently asked questions</h2>
          <div className="space-y-8">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">
                How long should I wait before sending an overdue invoice letter?
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Send your first overdue invoice letter 3 days after the payment due date. Do not wait longer — most successful invoice recoveries happen within the first week of a missed payment. The longer you wait, the lower the probability of payment.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">
                Is it unprofessional to send multiple overdue payment letters to a client?
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                No. Following up on an unpaid invoice is standard business practice, not rudeness. What matters is the tone — keep early letters warm and assumption-of-innocence, and escalate the formality gradually only if the client does not respond. Sending a single follow-up and then going silent is what actually looks unprofessional, because it signals you do not take your own invoicing seriously.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">
                Can I use these overdue invoice letter templates as formal legal documents?
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Templates 4 and 5 (the final demand and escalation notice) are designed to be professional and legally aware, but they are not formal legal letters. If you are preparing to file in small claims court or engage a solicitor, your legal representative will need to produce a formal letter of claim. These templates are for freelancers handling their own collections — not for litigation purposes.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">
                What if the client disputes the invoice instead of paying it?
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                A dispute is actually progress — it means you have a response. Reply promptly, ask for the specific issue in writing, and provide any supporting documents (scope of work, change orders, delivery confirmations) that support the invoice. Disputed invoices that are handled quickly and in writing are far more likely to be resolved than ones where both parties go silent. Do not threaten escalation during an active dispute unless negotiations have broken down.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div
          className="rounded-2xl p-8 text-center mb-10"
          style={{ backgroundColor: '#4f46e5' }}
        >
          <h2 className="text-2xl font-bold text-white mb-3">
            Never write an overdue invoice letter again.
          </h2>
          <p className="mb-6 max-w-md mx-auto text-sm leading-relaxed" style={{ color: '#c7d2fe' }}>
            Chase sends the full overdue letter sequence automatically — Day 3, 7, 14, and final demand — and stops the moment your client pays. Free for your first 3 invoices.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-white font-semibold px-6 py-3 rounded-xl hover:bg-slate-100 transition-colors"
            style={{ color: '#1e1b4b' }}
          >
            Start free — no credit card required →
          </Link>
          <p className="text-xs mt-3" style={{ color: '#a5b4fc' }}>
            Setup takes 3 minutes. Cancel any time.
          </p>
        </div>

        {/* Related posts */}
        <div className="pt-8 border-t border-slate-100">
          <p className="text-sm font-semibold text-slate-400 mb-4">Related guides</p>
          <div className="space-y-3">
            <Link
              href="/blog/invoice-follow-up-email-templates"
              className="group block border border-slate-200 rounded-xl p-5 hover:border-indigo-200 transition-colors"
            >
              <span className="text-xs font-semibold" style={{ color: '#4f46e5' }}>Email Templates</span>
              <h3 className="font-semibold text-slate-900 mt-1 group-hover:text-indigo-700 transition-colors">
                Invoice Follow-Up Email Templates: Day 3, 7, 14 &amp; Final Notice (Copy-Paste)
              </h3>
            </Link>
            <Link
              href="/blog/how-to-collect-overdue-invoices"
              className="group block border border-slate-200 rounded-xl p-5 hover:border-indigo-200 transition-colors"
            >
              <span className="text-xs font-semibold" style={{ color: '#4f46e5' }}>Getting Paid</span>
              <h3 className="font-semibold text-slate-900 mt-1 group-hover:text-indigo-700 transition-colors">
                How to Collect Overdue Invoices Without Losing the Client (2026 Guide)
              </h3>
            </Link>
            <Link
              href="/blog/how-to-follow-up-on-unpaid-invoice-freelancer"
              className="group block border border-slate-200 rounded-xl p-5 hover:border-indigo-200 transition-colors"
            >
              <span className="text-xs font-semibold" style={{ color: '#4f46e5' }}>Getting Paid</span>
              <h3 className="font-semibold text-slate-900 mt-1 group-hover:text-indigo-700 transition-colors">
                {"How to Follow Up on an Unpaid Invoice: The Complete Freelancer's Guide"}
              </h3>
            </Link>
          </div>
        </div>

      </article>
    </div>
  )
}
