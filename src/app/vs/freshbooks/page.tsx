import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Chase vs FreshBooks (2026): Which Is Better for Invoice Follow-Up?',
  description:
    'FreshBooks is a full accounting platform. Chase is a focused invoice follow-up tool. If your main goal is getting paid on time automatically, here is an honest comparison.',
  keywords: [
    'FreshBooks alternatives freelancer',
    'Chase vs FreshBooks',
    'FreshBooks alternative',
    'FreshBooks competitor',
    'FreshBooks vs invoice automation',
    'freelancer invoice follow-up software',
    'automated invoice reminders FreshBooks',
    'FreshBooks alternative cheaper',
  ],
  openGraph: {
    title: 'Chase vs FreshBooks (2026): Which Is Better for Invoice Follow-Up?',
    description:
      'FreshBooks is a full accounting platform. Chase is focused on one thing: getting your invoices paid automatically.',
    url: 'https://chase.allonys.com/vs/freshbooks',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chase vs FreshBooks (2026)',
    description: 'Which is better for freelancers who need automated invoice follow-up?',
  },
  alternates: {
    canonical: 'https://chase.allonys.com/vs/freshbooks',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Chase',
  applicationCategory: 'BusinessApplication',
  url: 'https://chase.allonys.com',
  description:
    'Chase is an automated invoice follow-up tool for freelancers — a leaner alternative to FreshBooks for those who primarily need payment collection.',
  offers: [
    { '@type': 'Offer', name: 'Free', price: '0', priceCurrency: 'USD' },
    { '@type': 'Offer', name: 'Pro', price: '19', priceCurrency: 'USD' },
  ],
}

const comparisonRows = [
  { feature: 'Automated invoice follow-up sequence', chase: true, freshbooks: false },
  { feature: 'Stripe payment links on invoices', chase: true, freshbooks: false },
  { feature: 'Automatic payment detection', chase: true, freshbooks: false },
  { feature: 'Manual invoice reminders', chase: false, freshbooks: true },
  { feature: 'Accounting / bookkeeping', chase: false, freshbooks: true },
  { feature: 'Expense tracking', chase: false, freshbooks: true },
  { feature: 'Time tracking', chase: false, freshbooks: true },
  { feature: 'Financial reporting (P&L, tax)', chase: false, freshbooks: true },
  { feature: 'Payroll add-on', chase: false, freshbooks: true },
  { feature: 'Starting price (per month)', chase: 'Free', freshbooks: '$19' },
  { feature: 'Full-featured plan (solo)', chase: '$19/mo', freshbooks: '$33/mo' },
  { feature: 'Client limit on entry plan', chase: 'Unlimited', freshbooks: '5 clients' },
  { feature: 'Setup time', chase: '5 minutes', freshbooks: '1–2 hours' },
]

function CheckIcon() {
  return (
    <svg className="w-5 h-5 text-emerald-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}
function XIcon() {
  return (
    <svg className="w-5 h-5 text-slate-300 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

function CellValue({ value }: { value: boolean | string }) {
  if (value === true) return <CheckIcon />
  if (value === false) return <XIcon />
  return <span className="text-sm text-slate-600">{value}</span>
}

export default function VsFreshbooksPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Nav */}
      <nav className="border-b border-slate-200 bg-white sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="font-semibold text-slate-900 text-base">Chase</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/blog" className="text-sm text-slate-500 hover:text-slate-900">Blog</Link>
            <Link href="/login" className="text-sm text-slate-500 hover:text-slate-900">Log in</Link>
            <Link
              href="/signup"
              className="inline-flex items-center gap-1.5 bg-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Start free →
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {/* Hero */}
        <div className="bg-slate-50 border-b border-slate-200 py-14 px-6">
          <div className="max-w-3xl mx-auto">
            <p className="text-indigo-600 text-sm font-semibold uppercase tracking-wide mb-3">
              Chase vs FreshBooks
            </p>
            <h1 className="text-4xl font-bold text-slate-900 tracking-tight leading-tight mb-5">
              Chase vs FreshBooks: Which Is Better for Freelancers Who Chase Invoices?
            </h1>
            <p className="text-xl text-slate-500 leading-relaxed">
              FreshBooks is one of the most popular accounting tools for freelancers — and for
              good reason. But if your core problem is getting paid on time, FreshBooks has a
              significant gap: it does not automatically follow up on overdue invoices. Chase
              was built to do exactly that.
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 py-14">

          {/* Quick verdict */}
          <div className="grid sm:grid-cols-2 gap-6 mb-14">
            <div className="border border-slate-200 rounded-2xl p-7">
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-indigo-700 font-bold text-lg">C</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-3">Chase</h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                A focused invoice follow-up tool. You create an invoice, connect Stripe, and
                Chase automatically sends the right reminder at day 3, 7, and 14 — stopping
                when your client pays.
              </p>
              <div className="space-y-2">
                <p className="text-sm font-semibold text-slate-700">Best for:</p>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>→ Freelancers who need automated payment follow-up</li>
                  <li>→ Anyone already using Stripe</li>
                  <li>→ People who hate chasing invoices manually</li>
                </ul>
              </div>
              <div className="mt-5 pt-5 border-t border-slate-100">
                <p className="text-sm text-slate-500">Starting price: <strong className="text-slate-900">Free</strong></p>
                <p className="text-sm text-slate-500">Pro plan: <strong className="text-slate-900">$19/mo</strong></p>
              </div>
            </div>

            <div className="border border-slate-200 rounded-2xl p-7">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-emerald-700 font-bold text-sm">FB</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-3">FreshBooks</h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                A full-featured cloud accounting platform. Covers invoicing, expenses, time
                tracking, payroll, and financial reporting. Strong for businesses that need
                proper bookkeeping alongside invoicing.
              </p>
              <div className="space-y-2">
                <p className="text-sm font-semibold text-slate-700">Best for:</p>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>→ Freelancers who need accounting + invoicing together</li>
                  <li>→ Teams with accountants or bookkeepers</li>
                  <li>→ People who bill by time and track expenses</li>
                </ul>
              </div>
              <div className="mt-5 pt-5 border-t border-slate-100">
                <p className="text-sm text-slate-500">Starting price: <strong className="text-slate-900">$19/mo</strong></p>
                <p className="text-sm text-slate-500">Plus plan: <strong className="text-slate-900">$33/mo</strong></p>
              </div>
            </div>
          </div>

          {/* The core difference */}
          <div className="max-w-3xl mb-14">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              The one thing FreshBooks cannot do (that freelancers need most)
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              FreshBooks has invoice reminders — but they are manual. You go into the invoice,
              click &ldquo;send reminder&rdquo;, and it goes out. There is no automated sequence
              that watches your invoices and sends the right email at the right time without you
              having to remember.
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              This is a bigger problem than it sounds. When you are busy with client work, the
              follow-up emails are the first thing to slip. You mean to send the day-7 reminder,
              but it does not happen until day 14. By then the client has fully rationalised not
              paying, and the relationship is more strained.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Chase solves this completely. Once an invoice is created and sent, Chase runs
              the entire follow-up sequence automatically — no human action required. The
              emails stop automatically when the client pays via the Stripe link.
            </p>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mt-6">
              <p className="text-amber-900 font-semibold mb-2 text-sm">The FreshBooks reminder gap</p>
              <p className="text-amber-800 text-sm">
                FreshBooks lets you send a single reminder per invoice — manually. There is no
                &ldquo;keep following up until they pay&rdquo; sequence. If you forget to follow
                up, the invoice stays overdue indefinitely.
              </p>
            </div>
          </div>

          {/* Comparison table */}
          <div className="mb-14">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Feature comparison: Chase vs FreshBooks</h2>
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-indigo-600 text-white">
                    <th className="text-left px-6 py-4 font-semibold w-1/2">Feature</th>
                    <th className="text-center px-4 py-4 font-semibold">Chase</th>
                    <th className="text-center px-4 py-4 font-semibold">FreshBooks</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row, i) => (
                    <tr key={row.feature} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                      <td className="px-6 py-3.5 text-slate-700 font-medium">{row.feature}</td>
                      <td className="px-4 py-3.5 text-center">
                        <CellValue value={row.chase} />
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <CellValue value={row.freshbooks} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pricing deep-dive */}
          <div className="max-w-3xl mb-14">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Pricing: the hidden cost of FreshBooks</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              FreshBooks&rsquo; $19/month Lite plan limits you to 5 active clients. If you have
              more than 5 clients — which most active freelancers do — you are on the Plus plan
              at $33/month. For teams or more advanced features, it jumps to $60+.
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              Chase&rsquo;s Pro plan is $19/month with unlimited clients and invoices. The free
              tier supports 3 active invoices — enough to try the full follow-up system before
              committing.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5">
                <p className="font-semibold text-indigo-900 mb-3">Chase pricing</p>
                <ul className="space-y-2 text-sm text-indigo-800">
                  <li><strong>Free:</strong> 3 active invoices, full follow-up sequence</li>
                  <li><strong>Pro ($19/mo):</strong> unlimited invoices, all features</li>
                </ul>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                <p className="font-semibold text-slate-900 mb-3">FreshBooks pricing</p>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li><strong>Lite ($19/mo):</strong> 5 clients, basic features</li>
                  <li><strong>Plus ($33/mo):</strong> 50 clients, proposals</li>
                  <li><strong>Premium ($60/mo):</strong> unlimited clients</li>
                </ul>
              </div>
            </div>
          </div>

          {/* When to use each */}
          <div className="grid sm:grid-cols-2 gap-6 mb-14">
            <div className="border border-indigo-200 bg-indigo-50/30 rounded-2xl p-7">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Choose Chase if...</h3>
              <ul className="space-y-3">
                {[
                  'Your main problem is invoices being paid late',
                  'You want follow-up to happen automatically — zero effort',
                  'You use Stripe (or want to)',
                  'You want to pay $0–19/month, not $33+',
                  'You do not need double-entry bookkeeping',
                  'You want to be set up in 5 minutes',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <span className="text-indigo-500 font-bold mt-0.5 shrink-0">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="border border-slate-200 rounded-2xl p-7">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Choose FreshBooks if...</h3>
              <ul className="space-y-3">
                {[
                  'You need full accounting alongside invoicing',
                  'You have an accountant who needs bookkeeping access',
                  'You regularly track time and bill hourly',
                  'You need expense management and P&L reports',
                  'You want everything in one platform',
                  'You already use FreshBooks and are happy with it',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <span className="text-slate-400 mt-0.5 shrink-0">→</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Can you use both? */}
          <div className="max-w-3xl mb-14">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Can you use Chase and FreshBooks together?</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Yes — and some freelancers do. They use FreshBooks for accounting, expense
              tracking, and time tracking, and Chase specifically for invoice follow-up
              automation. Since Chase is built around Stripe, you use Chase to send
              the client-facing invoice with a payment link, and record the payment in
              FreshBooks manually or via Stripe&rsquo;s integration.
            </p>
            <p className="text-slate-600 leading-relaxed">
              That said, for most freelancers the simplest path is to pick the tool that
              solves your biggest problem. If late payments are costing you money and stress,
              start with Chase. You can always add more sophisticated accounting tools later
              when your business demands it.
            </p>
          </div>

          {/* Bottom CTA */}
          <div className="bg-slate-900 rounded-2xl p-10 text-center">
            <h2 className="text-3xl font-bold text-white mb-3">
              Try the FreshBooks alternative built for getting paid
            </h2>
            <p className="text-slate-400 mb-7 max-w-md mx-auto">
              Chase automates your entire invoice follow-up sequence. Free for your first
              3 invoices — no credit card needed.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-indigo-600 text-white font-semibold px-7 py-3.5 rounded-xl hover:bg-indigo-500 transition-colors text-base"
            >
              Start free — no card required →
            </Link>
            <p className="text-slate-500 text-sm mt-4">Takes 5 minutes. Works with your existing Stripe account.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-white/5">
        <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
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
