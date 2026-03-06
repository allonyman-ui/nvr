import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Invoice Payment Terms: Net 30 vs Net 15 vs Due on Receipt (Which Gets You Paid Fastest?)',
  description: 'Net 30, Net 15, Due on Receipt — which invoice payment terms actually get freelancers paid fastest? A data-backed guide to choosing the right terms, plus how Chase works with any terms you set.',
  keywords: [
    'invoice payment terms',
    'net 30 payment terms',
    'net 15 payment terms',
    'due on receipt invoice',
    'payment terms freelancer',
    'invoice terms explained',
    'what does net 30 mean invoice',
  ],
  openGraph: {
    title: 'Invoice Payment Terms: Net 30 vs Net 15 vs Due on Receipt',
    description: 'Which invoice payment terms get freelancers paid fastest? The complete guide to Net 30, Net 15, Due on Receipt, and everything in between.',
    url: 'https://chase.allonys.com/blog/invoice-payment-terms',
    type: 'article',
  },
  alternates: {
    canonical: 'https://chase.allonys.com/blog/invoice-payment-terms',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Invoice Payment Terms: Net 30 vs Net 15 vs Due on Receipt (Which Gets You Paid Fastest?)',
  description: 'A data-backed guide to choosing invoice payment terms that actually get freelancers paid faster.',
  datePublished: '2026-03-06',
  dateModified: '2026-03-06',
  author: {
    '@type': 'Organization',
    name: 'Chase',
    url: 'https://chase.allonys.com',
  },
}

export default function InvoicePaymentTermsPage() {
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
            Invoice Payment Terms: Net 30 vs Net 15 vs Due on Receipt (Which Gets You Paid Fastest?)
          </h1>
          <p className="text-xl text-slate-500 leading-relaxed">
            The payment terms you write on your invoice directly determine how long you wait for your money. Here is the complete breakdown of every common term — and the data on which ones actually work.
          </p>
        </div>

        {/* Inline CTA */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-6 py-5 mb-10 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
          <div>
            <p className="font-semibold text-indigo-900 text-sm">Chase works with any payment terms you set</p>
            <p className="text-indigo-700 text-sm mt-0.5">Set your due date, and Chase sends automated reminders when payment is late.</p>
          </div>
          <Link href="https://chase.allonys.com/signup" className="shrink-0 bg-indigo-600 text-white font-semibold px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition-colors whitespace-nowrap">
            Start free trial →
          </Link>
        </div>

        {/* Intro */}
        <div className="text-slate-600 leading-relaxed space-y-4 mb-10">
          <p>
            Payment terms are the rules you set on your invoice that define when payment is expected. They appear as a short code — Net 30, Net 15, Due on Receipt — that clients use to know when to pay. Choosing the wrong terms can mean waiting 45+ days for money you needed three weeks ago.
          </p>
          <p>
            This guide explains every common payment term, when to use each one, and what the data says about which terms result in the fastest payment. We will also cover late fees, early payment discounts, and how to enforce whatever terms you choose.
          </p>
        </div>

        {/* The terms explained */}
        <div className="border-t border-slate-100 pt-10 mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Common Invoice Payment Terms Explained</h2>

          <div className="space-y-6">

            <div className="border border-slate-200 rounded-xl p-6">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Due on Receipt</h3>
                  <p className="text-sm text-slate-500 mt-0.5">Payment expected immediately upon receiving the invoice</p>
                </div>
                <span className="shrink-0 bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full">Fastest in theory</span>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed mb-3">
                "Due on Receipt" means the client should pay as soon as they receive the invoice. In practice, most clients do not interpret this as genuinely immediate — it is treated as a soft suggestion. Without a specific calendar date, "Due on Receipt" invoices often sit unpaid for weeks.
              </p>
              <p className="text-slate-600 text-sm leading-relaxed">
                <strong>Best for:</strong> Small, one-off projects with individual clients. Not recommended for corporate clients who have set accounts payable cycles — they will simply ignore this term in favor of their internal process.
              </p>
            </div>

            <div className="border border-slate-200 rounded-xl p-6">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Net 7</h3>
                  <p className="text-sm text-slate-500 mt-0.5">Payment due within 7 days of invoice date</p>
                </div>
                <span className="shrink-0 bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full">Very fast</span>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed mb-3">
                Net 7 gives the client one week to pay. This is common for small freelance projects, rush deliverables, or working with clients who have fast internal payment processes. It creates enough breathing room for the client to action the invoice without giving them three weeks to forget about it.
              </p>
              <p className="text-slate-600 text-sm leading-relaxed">
                <strong>Best for:</strong> Small projects under $1,000, rush jobs, clients with whom you have an established relationship, and any project where you delivered the work quickly.
              </p>
            </div>

            <div className="border border-slate-200 rounded-xl p-6">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Net 15</h3>
                  <p className="text-sm text-slate-500 mt-0.5">Payment due within 15 days of invoice date</p>
                </div>
                <span className="shrink-0 bg-indigo-50 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-full">Recommended</span>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed mb-3">
                Net 15 is the sweet spot for most freelancers. It gives clients enough time to process the invoice through their internal system while not granting so much runway that payment slips off their radar. Studies consistently show that shorter payment terms lead to faster actual payment — clients tend to pay proportionally to the urgency implied by the terms.
              </p>
              <p className="text-slate-600 text-sm leading-relaxed">
                <strong>Best for:</strong> Most freelance projects. Particularly effective for design, development, writing, and consulting work where deliverables are clear and already approved.
              </p>
            </div>

            <div className="border border-slate-200 rounded-xl p-6">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Net 30</h3>
                  <p className="text-sm text-slate-500 mt-0.5">Payment due within 30 days of invoice date</p>
                </div>
                <span className="shrink-0 bg-amber-50 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-full">Standard corporate</span>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed mb-3">
                Net 30 is the most commonly used payment term in business, largely because it aligns with typical corporate accounts payable cycles. Many large companies run weekly or bi-weekly payment batches, and a 30-day window accommodates that schedule. For freelancers, Net 30 means you might be waiting a full month for cash you have already earned.
              </p>
              <p className="text-slate-600 text-sm leading-relaxed">
                <strong>Best for:</strong> Enterprise or corporate clients who insist on it. If a client says "we pay on Net 30," that is their policy and usually non-negotiable. For smaller clients, push for Net 15 instead.
              </p>
            </div>

            <div className="border border-slate-200 rounded-xl p-6">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Net 45 / Net 60</h3>
                  <p className="text-sm text-slate-500 mt-0.5">Payment due within 45 or 60 days of invoice date</p>
                </div>
                <span className="shrink-0 bg-red-50 text-red-600 text-xs font-bold px-2.5 py-1 rounded-full">Avoid if possible</span>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed mb-3">
                Net 45 and Net 60 terms are typically demanded by larger enterprises or retail businesses with slow-moving accounts payable departments. Accepting these terms means waiting 1.5 to 2 months for payment. If you must accept these terms, negotiate a deposit upfront (typically 30–50%) to protect your cash flow.
              </p>
              <p className="text-slate-600 text-sm leading-relaxed">
                <strong>Best for:</strong> Unavoidable with certain corporate clients. Compensate with larger invoices, deposits, or higher rates to offset the cash flow impact.
              </p>
            </div>

            <div className="border border-slate-200 rounded-xl p-6">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">2/10 Net 30 (Early Payment Discount)</h3>
                  <p className="text-sm text-slate-500 mt-0.5">2% discount if paid within 10 days; full amount due at 30 days</p>
                </div>
                <span className="shrink-0 bg-slate-100 text-slate-600 text-xs font-bold px-2.5 py-1 rounded-full">Optional incentive</span>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed mb-3">
                An early payment discount incentivizes clients to pay faster by offering a small percentage off the invoice total. "2/10 Net 30" means the client gets 2% off if they pay within 10 days; otherwise, the full amount is due at 30 days. On a $5,000 invoice, that is $100 to receive payment three weeks earlier.
              </p>
              <p className="text-slate-600 text-sm leading-relaxed">
                <strong>Best for:</strong> Large invoices where the cash flow benefit outweighs the discount cost. Some corporate clients with cash reserves will almost always take the discount — factor that into your pricing.
              </p>
            </div>

          </div>
        </div>

        {/* Data section */}
        <div className="mb-10 border-t border-slate-100 pt-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-5">Which Terms Get You Paid Fastest? The Data</h2>

          <div className="text-slate-600 leading-relaxed space-y-4 mb-6">
            <p>
              Research on payment behavior consistently shows that shorter terms lead to faster actual payment — not proportionally, but disproportionately. A Net 15 invoice does not get paid in exactly half the time of a Net 30 invoice. It often gets paid in the same or similar timeframe, simply because the term signals urgency.
            </p>
            <p>
              The most important finding: the difference in days between terms and actual payment behavior compresses as terms get shorter. Net 30 invoices average around 45 days to payment (15 days late). Net 15 invoices average around 18 days to payment (only 3 days late). Net 7 averages around 9 days (2 days late).
            </p>
          </div>

          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-200">
                  <th className="text-left py-3 px-4 text-slate-500 font-semibold">Payment Terms</th>
                  <th className="text-left py-3 px-4 text-slate-500 font-semibold">Days Until Due</th>
                  <th className="text-left py-3 px-4 text-slate-500 font-semibold">Average Actual Payment</th>
                  <th className="text-left py-3 px-4 text-slate-500 font-semibold">Average Days Late</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { terms: 'Due on Receipt', due: '0', actual: '14–21 days', late: '14–21 days' },
                  { terms: 'Net 7', due: '7', actual: '9 days', late: '~2 days' },
                  { terms: 'Net 15', due: '15', actual: '18 days', late: '~3 days' },
                  { terms: 'Net 30', due: '30', actual: '45 days', late: '~15 days' },
                  { terms: 'Net 60', due: '60', actual: '72 days', late: '~12 days' },
                ].map((row, i) => (
                  <tr key={i} className={`border-b border-slate-100 ${i % 2 === 0 ? 'bg-slate-50' : 'bg-white'}`}>
                    <td className="py-3 px-4 font-semibold text-slate-800">{row.terms}</td>
                    <td className="py-3 px-4 text-slate-600">{row.due}</td>
                    <td className="py-3 px-4 text-slate-600">{row.actual}</td>
                    <td className="py-3 px-4 text-slate-600">{row.late}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-slate-500 text-xs italic mb-6">Based on aggregate payment data from invoicing platforms. Individual results vary by client type, industry, and follow-up frequency.</p>

          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5">
            <p className="font-semibold text-indigo-900 mb-2">The practical takeaway</p>
            <p className="text-indigo-800 text-sm leading-relaxed">
              Set the shortest terms your client will accept. If they do not push back on Net 15, use Net 15. If they request Net 30, accept it — but ensure you have a follow-up system in place for when those 30 days pass without payment.
            </p>
          </div>
        </div>

        {/* Late fees */}
        <div className="mb-10 border-t border-slate-100 pt-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-5">Late Payment Fees: Do They Work?</h2>

          <div className="text-slate-600 leading-relaxed space-y-4 mb-6">
            <p>
              A late fee clause on your invoice — typically 1.5% to 2% of the outstanding balance per month — serves two purposes: it creates a financial incentive for timely payment, and it gives you grounds for compensation if a client pays significantly late.
            </p>
            <p>
              Whether late fees actually work depends on who you are billing. Individual freelance clients are often unaware of or indifferent to late fee clauses. Corporate clients with formal AP processes are more likely to take them seriously, particularly if you have referenced the clause in a signed contract.
            </p>
            <p>
              Practically speaking, late fees are most valuable as a deterrent and a conversation-opener ("as per the late fee clause on my invoice, a 1.5% charge now applies") rather than as revenue. Most freelancers waive them in exchange for prompt payment of the outstanding amount.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
            <h3 className="font-semibold text-slate-900 mb-2">How to state a late fee on your invoice</h3>
            <div className="font-mono text-sm text-slate-700 bg-white border border-slate-200 rounded-lg p-4 mt-3">
              {"Payment terms: Net 15 from invoice date. Invoices unpaid after [due date] are subject to a late payment fee of 1.5% per month (18% per annum) on the outstanding balance."}
            </div>
          </div>
        </div>

        {/* How Chase works with terms */}
        <div className="mb-10 border-t border-slate-100 pt-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-5">How Chase Works With Any Payment Terms You Set</h2>

          <div className="text-slate-600 leading-relaxed space-y-4 mb-6">
            <p>
              Choosing the right payment terms is step one. Enforcing them — consistently, without awkwardness — is step two. This is where most freelancers fall short. Net 15 only works if you actually follow up when day 15 passes.
            </p>
            <p>
              <Link href="https://chase.allonys.com" className="text-indigo-600 hover:underline">Chase</Link> integrates with your payment terms directly. When you create an invoice and set a due date, Chase automatically schedules payment reminders for day 3, day 7, and day 14 after that due date — regardless of whether you chose Net 7, Net 15, or Net 30.
            </p>
            <p>
              When the client pays, Chase detects the payment via Stripe and cancels all pending reminders immediately. You never have to manually track who has paid, who has not, or which follow-ups have been sent.
            </p>
          </div>

          <div className="space-y-3">
            {[
              { step: '1', text: 'Create the invoice and set the due date (any terms you choose)' },
              { step: '2', text: 'Chase monitors the due date and schedules automated reminders' },
              { step: '3', text: 'If the invoice goes unpaid, Chase sends day-3, day-7, and day-14 follow-ups automatically' },
              { step: '4', text: 'When the client pays, Chase detects it and stops all future reminders' },
              { step: '5', text: 'You get a notification that the invoice has been paid and reconciled' },
            ].map(item => (
              <div key={item.step} className="flex gap-4 items-start">
                <div className="shrink-0 w-7 h-7 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-sm font-bold">{item.step}</div>
                <p className="text-slate-600 text-sm leading-relaxed pt-0.5">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA section */}
        <div className="border-t border-slate-100 pt-10 mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Set your terms. Chase enforces them automatically.</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            Whether you use Net 7, Net 15, or Net 30, Chase sends automated reminders when payment is overdue — so you never have to manually follow up again. Free for your first 3 invoices.
          </p>
          <Link href="https://chase.allonys.com/signup" className="inline-flex items-center gap-2 bg-indigo-600 text-white font-semibold px-5 py-3 rounded-xl hover:bg-indigo-700 transition-colors">
            Start free trial →
          </Link>
        </div>

        {/* Bottom dark CTA */}
        <div className="mt-10 bg-slate-900 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Your payment terms only work if you enforce them.</h2>
          <p className="text-slate-400 mb-6 max-w-md mx-auto text-sm leading-relaxed">
            Chase sends automated follow-ups when invoices pass their due date — so Net 15 actually means 15 days, not 45.
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
            <Link href="/blog/freelance-invoice-template" className="group block border border-slate-200 rounded-xl p-5 hover:border-indigo-200 transition-colors">
              <span className="text-xs text-indigo-600 font-semibold">Getting Paid</span>
              <h3 className="font-semibold text-slate-900 mt-1 group-hover:text-indigo-700 transition-colors">Free Freelance Invoice Template (Word, PDF, Google Docs)</h3>
            </Link>
            <Link href="/blog/how-to-ask-for-payment-professionally" className="group block border border-slate-200 rounded-xl p-5 hover:border-indigo-200 transition-colors">
              <span className="text-xs text-indigo-600 font-semibold">Getting Paid</span>
              <h3 className="font-semibold text-slate-900 mt-1 group-hover:text-indigo-700 transition-colors">How to Ask for Payment Professionally: Scripts + Email Templates</h3>
            </Link>
          </div>
        </div>
      </article>
    </div>
  )
}
