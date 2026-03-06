import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Free Freelance Invoice Template (Word, PDF, Google Docs) + How to Get Paid Faster',
  description: 'Download a free freelance invoice template for Word, PDF, or Google Docs. Learn every field you need, common mistakes to avoid, and how automated follow-up gets you paid 3x faster.',
  keywords: [
    'freelance invoice template',
    'invoice template freelancer',
    'free invoice template word',
    'free invoice template pdf',
    'freelance invoice google docs',
    'invoice template download',
    'simple invoice template freelancer',
  ],
  openGraph: {
    title: 'Free Freelance Invoice Template (Word, PDF, Google Docs) + How to Get Paid Faster',
    description: 'A complete freelance invoice template with every field explained — plus why static invoices get paid slowly and what to do instead.',
    url: 'https://chase.allonys.com/blog/freelance-invoice-template',
    type: 'article',
  },
  alternates: {
    canonical: 'https://chase.allonys.com/blog/freelance-invoice-template',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Free Freelance Invoice Template (Word, PDF, Google Docs) + How to Get Paid Faster',
  description: 'A complete freelance invoice template with every field explained and a guide to getting paid faster through automated follow-up.',
  datePublished: '2026-03-06',
  dateModified: '2026-03-06',
  author: {
    '@type': 'Organization',
    name: 'Chase',
    url: 'https://chase.allonys.com',
  },
}

export default function FreelanceInvoiceTemplatePage() {
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
            { '@type': 'ListItem', position: 3, name: 'Free Freelance Invoice Template', item: 'https://chase.allonys.com/blog/freelance-invoice-template' },
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
            <span className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-2.5 py-1 rounded-full">Getting Paid</span>
            <span className="text-slate-400 text-sm">March 2026 · 9 min read</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight leading-tight mb-5">
            Free Freelance Invoice Template (Word, PDF, Google Docs) + How to Get Paid Faster
          </h1>
          <p className="text-xl text-slate-500 leading-relaxed">
            A complete, professional invoice template with every field explained — and the one thing most freelancers skip that causes invoices to go unpaid for weeks.
          </p>
        </div>

        {/* Inline CTA */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-6 py-5 mb-10 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
          <div>
            <p className="font-semibold text-indigo-900 text-sm">Want invoices that follow up themselves?</p>
            <p className="text-indigo-700 text-sm mt-0.5">Chase sends payment reminders automatically — and stops the moment your client pays.</p>
          </div>
          <Link href="https://chase.allonys.com/signup" className="shrink-0 bg-indigo-600 text-white font-semibold px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition-colors whitespace-nowrap">
            Start free trial →
          </Link>
        </div>

        {/* Intro */}
        <div className="text-slate-600 leading-relaxed space-y-4 mb-10">
          <p>
            Getting paid as a freelancer starts with sending a clear, professional invoice. But a well-formatted invoice is only half the equation. The other half — the part most freelancers skip — is what happens after you send it.
          </p>
          <p>
            Below you will find a complete freelance invoice template you can copy into Word, Google Docs, or any invoicing tool. Every field is explained so you know exactly what to include and why. Then we will cover the payment follow-up system that gets freelancers paid 3x faster than sending invoices and hoping for the best.
          </p>
        </div>

        {/* Template Section */}
        <div className="border-t border-slate-100 pt-10 mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-5">The Freelance Invoice Template</h2>
          <p className="text-slate-600 leading-relaxed mb-6">
            Copy the template below into any word processor or document tool. Replace every field in brackets with your actual information. The structure is intentionally simple — clients pay faster when invoices are easy to read.
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-8">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Invoice Template — copy and paste</p>
            <div className="text-sm text-slate-700 leading-relaxed font-mono whitespace-pre-line">
{`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INVOICE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

From:
[Your Full Name / Business Name]
[Your Address (optional)]
[Your Email]
[Your Phone (optional)]

To:
[Client Name / Company Name]
[Client Email]
[Client Address (if required)]

Invoice #: [001]
Invoice Date: [DD/MM/YYYY]
Due Date: [DD/MM/YYYY]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SERVICES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Description                    Qty    Rate     Amount
──────────────────────────────────────────────────────
[Service / deliverable name]   [1]    [$XXX]   [$XXX]
[Service / deliverable name]   [2]    [$XXX]   [$XXX]
[Expenses / reimbursables]     [1]    [$XXX]   [$XXX]

──────────────────────────────────────────────────────
                              Subtotal:        [$XXX]
                              Tax (if any):    [$XXX]
                              TOTAL DUE:       [$XXX]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAYMENT DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Payment due by: [Due Date]
Payment methods accepted: [Bank transfer / PayPal / Stripe / etc.]
[Bank account details or payment link]

Payment terms: Net [15/30] from invoice date
Late fee: [1.5% per month after due date — optional]

Notes:
[Any project-specific notes, PO numbers, or reference info]

Thank you for your business.`}
            </div>
          </div>
        </div>

        {/* Field explanations */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-5">Every Invoice Field Explained</h2>
          <p className="text-slate-600 leading-relaxed mb-6">
            Here is what each field does and why it matters. Skip any of these and you risk payment delays, disputes, or having your invoice bounced back by a client's accounts payable department.
          </p>

          <div className="space-y-6">
            <div className="border-l-4 border-indigo-200 pl-5">
              <h3 className="font-semibold text-slate-900 mb-1">Invoice Number</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Every invoice needs a unique number. Use a simple sequential format: 001, 002, 003, or prefix with the year: 2026-001. Invoice numbers help both you and your client track payments, and many companies require them to process payment. Never send two invoices with the same number.
              </p>
            </div>

            <div className="border-l-4 border-indigo-200 pl-5">
              <h3 className="font-semibold text-slate-900 mb-1">Invoice Date and Due Date</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                The invoice date is when you issue the invoice. The due date is when payment is expected. Always set an explicit due date — do not write "payable upon receipt" as this is vague and clients treat it as optional. If you use Net 30 terms, the due date is 30 days after the invoice date. We will cover payment terms in detail later.
              </p>
            </div>

            <div className="border-l-4 border-indigo-200 pl-5">
              <h3 className="font-semibold text-slate-900 mb-1">Your Details (From)</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Include your full legal name or business name, email address, and any other contact details the client may need. If you are VAT registered or have a business registration number, include that here. Some enterprise clients cannot process an invoice without a registered business address.
              </p>
            </div>

            <div className="border-l-4 border-indigo-200 pl-5">
              <h3 className="font-semibold text-slate-900 mb-1">Client Details (To)</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Address the invoice to the correct person and business entity. If your day-to-day contact is a project manager but the company's accounts payable team processes payments, address the invoice to the legal company name and include the AP email. An invoice sent to the wrong person can sit in someone's inbox for weeks before being forwarded.
              </p>
            </div>

            <div className="border-l-4 border-indigo-200 pl-5">
              <h3 className="font-semibold text-slate-900 mb-1">Service Line Items</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Be specific. "Consulting" is not a description — "Brand strategy consultation, March 3–7 2026, 12 hours at $150/hr" is. Clear descriptions reduce client questions, reduce disputes, and make it easier for accounts payable to match the invoice to a purchase order. Include quantity, rate, and amount for each line.
              </p>
            </div>

            <div className="border-l-4 border-indigo-200 pl-5">
              <h3 className="font-semibold text-slate-900 mb-1">Total Due</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Make the total impossible to miss. Bold it, capitalize it, or use a larger font size. Clients who have to hunt for the total amount get confused and payment gets delayed. If you are charging tax (VAT, GST, sales tax), show it as a separate line so the client can see the breakdown.
              </p>
            </div>

            <div className="border-l-4 border-indigo-200 pl-5">
              <h3 className="font-semibold text-slate-900 mb-1">Payment Details</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Include every detail the client needs to send money without asking you a question. Bank account number and sort code (or routing number), PayPal email, Stripe payment link — whatever method you accept. The easier you make it to pay, the faster it happens. If you use a payment link, this is the single most important field on your invoice.
              </p>
            </div>

            <div className="border-l-4 border-indigo-200 pl-5">
              <h3 className="font-semibold text-slate-900 mb-1">Late Fee Clause (Optional but Recommended)</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                A late fee clause — typically 1.5% to 2% per month on overdue balances — does two things: it motivates timely payment, and it gives you grounds for compensation if a client pays 90 days late. Even if you never enforce it, including the clause changes client behavior. Make sure you state it on the invoice, not just in your contract.
              </p>
            </div>
          </div>
        </div>

        {/* Common mistakes */}
        <div className="mb-10 border-t border-slate-100 pt-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-5">5 Invoice Mistakes That Slow Down Payment</h2>

          <div className="space-y-5">
            {[
              {
                num: '1',
                title: 'No explicit due date',
                body: '"Payment upon receipt" is not a due date. Set a specific calendar date. Invoices with specific due dates get paid an average of 8 days faster than those without.',
              },
              {
                num: '2',
                title: 'Sending to the wrong email address',
                body: 'Your main contact may not be the person who processes payments. Always confirm before you send which email address invoices should go to. Many large companies have a dedicated AP inbox.',
              },
              {
                num: '3',
                title: 'Vague service descriptions',
                body: 'If your client cannot match your invoice line item to what they commissioned, they will ask questions — and every round of back-and-forth delays payment by days or weeks.',
              },
              {
                num: '4',
                title: 'No payment link',
                body: 'Freelancers who include a Stripe or PayPal link in their invoice get paid significantly faster than those who list bank details only. One-click payment removes all friction.',
              },
              {
                num: '5',
                title: 'No follow-up system',
                body: 'Sending the invoice and waiting is the biggest mistake of all. 85% of freelancers get paid late. The ones who get paid on time send consistent follow-up reminders at day 3, 7, and 14 after the due date.',
              },
            ].map(item => (
              <div key={item.num} className="flex gap-4">
                <div className="shrink-0 w-7 h-7 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-bold">{item.num}</div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">{item.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Why automation */}
        <div className="mb-10 border-t border-slate-100 pt-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-5">Why Automation Gets You Paid 3x Faster Than Static Invoices</h2>

          <div className="text-slate-600 leading-relaxed space-y-4 mb-6">
            <p>
              A static invoice — whether it is a Word doc, a PDF, or a Google Doc — is a passive document. You send it, and then you wait. The burden is entirely on the client to remember, find the invoice, locate your payment details, and take action before the due date.
            </p>
            <p>
              Most clients are busy. Not malicious — just busy. Your invoice gets buried under 200 other emails. The due date passes. You feel awkward about chasing. The payment slips to week three, week four. You lose cash flow. You stress.
            </p>
            <p>
              The freelancers who get paid reliably and on time have one thing in common: they send consistent follow-up reminders. Research consistently shows that invoices with automated reminders are paid in an average of 10–14 days, compared to 28–45 days for invoices sent without follow-up.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-6">
            <h3 className="font-semibold text-slate-900 mb-4">The follow-up sequence that works</h3>
            <div className="space-y-3">
              {[
                { day: 'Day 3 after due date', action: 'Friendly reminder — assume it was an oversight, include payment link' },
                { day: 'Day 7 after due date', action: 'Firmer nudge — reference the overdue amount, set a new specific deadline' },
                { day: 'Day 14 after due date', action: 'Final notice — professional and firm, mention potential escalation' },
                { day: 'Day 21+', action: 'Escalation — last chance to resolve before involving collections or legal' },
              ].map(item => (
                <div key={item.day} className="flex gap-3 items-start">
                  <span className="bg-indigo-600 text-white text-xs font-bold px-2 py-0.5 rounded whitespace-nowrap mt-0.5">{item.day}</span>
                  <p className="text-sm text-slate-600">{item.action}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-slate-600 leading-relaxed mb-4">
            The problem is doing this manually for every invoice, for every client, at the right time, while running your actual business. Most freelancers either forget, delay the follow-ups by a week, or skip them entirely to avoid the awkwardness.
          </p>
          <p className="text-slate-600 leading-relaxed">
            <Link href="https://chase.allonys.com" className="text-indigo-600 hover:underline">Chase</Link> automates the entire sequence. You send the invoice once. Chase sends the day-3, day-7, and day-14 follow-ups automatically — and stops the moment your client pays. No awkwardness, no manual tracking, no forgotten invoices.
          </p>
        </div>

        {/* Formats section */}
        <div className="mb-10 border-t border-slate-100 pt-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-5">Which Format Should You Use? Word, PDF, or Google Docs?</h2>

          <div className="space-y-5">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Word / Google Docs</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Good for getting started. Easy to edit, easy to save as PDF before sending. The downside is manual tracking — you have to chase payments yourself, keep your own spreadsheet, and remember who owes what. Fine for one or two clients; painful at scale.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">PDF</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                The professional standard for sending invoices. Clients cannot accidentally edit the document. Easy to print for clients who need physical records. Convert your Word or Google Doc to PDF before sending. Same limitation: zero automation.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Dedicated invoicing software</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                This is where the real gains come from. Tools like <Link href="https://chase.allonys.com" className="text-indigo-600 hover:underline">Chase</Link> handle the invoice creation, payment links, and — most critically — the follow-up sequence. You stop manually tracking who owes what and focus on the work instead.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA section */}
        <div className="border-t border-slate-100 pt-10 mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Ready to stop chasing payments manually?</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            The template above will help you send professional invoices. But the real time-saver is automating what happens after you send them. Chase handles the day-3, day-7, and day-14 follow-ups automatically so you can focus on client work instead of chasing down payments.
          </p>
          <p className="text-slate-600 leading-relaxed mb-6">
            Free for your first 3 invoices. No credit card required. Setup takes three minutes.
          </p>
          <Link href="https://chase.allonys.com/signup" className="inline-flex items-center gap-2 bg-indigo-600 text-white font-semibold px-5 py-3 rounded-xl hover:bg-indigo-700 transition-colors">
            Start free trial — no card required →
          </Link>
        </div>

        {/* Bottom dark CTA */}
        <div className="mt-10 bg-slate-900 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Send the invoice. Chase handles the rest.</h2>
          <p className="text-slate-400 mb-6 max-w-md mx-auto text-sm leading-relaxed">
            Automated payment reminders on day 3, 7, and 14. Stops automatically when your client pays. Free for your first 3 invoices.
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
            <Link href="/blog/invoice-payment-terms" className="group block border border-slate-200 rounded-xl p-5 hover:border-indigo-200 transition-colors">
              <span className="text-xs text-indigo-600 font-semibold">Getting Paid</span>
              <h3 className="font-semibold text-slate-900 mt-1 group-hover:text-indigo-700 transition-colors">Invoice Payment Terms: Net 30 vs Net 15 vs Due on Receipt</h3>
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
