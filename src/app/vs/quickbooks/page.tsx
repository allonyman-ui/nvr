import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Chase vs QuickBooks (2026): Invoice Follow-Up vs Full Accounting',
  description:
    "QuickBooks is full accounting software. Chase is automated invoice follow-up. If you're a freelancer who needs to get invoices paid without learning accounting, here's the comparison.",
  keywords: [
    'Chase vs QuickBooks',
    'QuickBooks vs Chase',
    'QuickBooks alternative freelancer',
    'QuickBooks for freelancers 2026',
    'QuickBooks too expensive',
    'QuickBooks vs invoice automation',
    'QuickBooks Online alternative',
    'freelancer invoice tool vs QuickBooks',
    'automated invoice follow-up vs QuickBooks',
    'QuickBooks competitor freelancer',
  ],
  openGraph: {
    title: 'Chase vs QuickBooks (2026): Which Is Better for Freelancers?',
    description:
      "QuickBooks is overkill for invoice follow-up. Chase is laser-focused on getting freelancers paid automatically.",
    url: 'https://chase.allonys.com/vs/quickbooks',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chase vs QuickBooks (2026)',
    description: 'QuickBooks is accounting. Chase is automated payment collection. Which do freelancers actually need?',
  },
  alternates: {
    canonical: 'https://chase.allonys.com/vs/quickbooks',
  },
}

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Chase',
    applicationCategory: 'BusinessApplication',
    url: 'https://chase.allonys.com',
    description: 'Chase is an automated invoice follow-up tool for freelancers — a simpler, cheaper alternative to QuickBooks for those who mainly need to collect payments.',
    offers: [
      { '@type': 'Offer', name: 'Free', price: '0', priceCurrency: 'USD' },
      { '@type': 'Offer', name: 'Pro', price: '19', priceCurrency: 'USD' },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Chase', item: 'https://chase.allonys.com' },
      { '@type': 'ListItem', position: 2, name: 'Comparisons', item: 'https://chase.allonys.com/vs/quickbooks' },
      { '@type': 'ListItem', position: 3, name: 'Chase vs QuickBooks' },
    ],
  },
]

const comparisonRows = [
  { feature: 'Automated invoice follow-up (day 3, 7, 14)', chase: true, qb: false },
  { feature: 'Stripe payment links on every invoice', chase: true, qb: false },
  { feature: 'Automatic payment detection + stop', chase: true, qb: false },
  { feature: 'Manual reminders', chase: false, qb: true },
  { feature: 'Double-entry accounting', chase: false, qb: true },
  { feature: 'Tax preparation and filing', chase: false, qb: true },
  { feature: 'Payroll processing', chase: false, qb: true },
  { feature: 'Bank reconciliation', chase: false, qb: true },
  { feature: 'P&L and balance sheet reports', chase: false, qb: true },
  { feature: 'Inventory management', chase: false, qb: true },
  { feature: 'Starting price (per month)', chase: 'Free', qb: '$30' },
  { feature: 'Freelancer-useful plan', chase: '$19/mo', qb: '$60+/mo' },
  { feature: 'Learning curve', chase: 'Minutes', qb: 'Weeks' },
  { feature: 'Free plan', chase: 'Yes', qb: 'Trial only' },
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
  if (typeof value === 'boolean') return value ? <CheckIcon /> : <XIcon />
  return <span className="text-sm text-slate-700 text-center block">{value}</span>
}

export default function ChaseVsQuickBooksPage() {
  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

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
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
          <Link href="/" className="hover:text-slate-900">Chase</Link>
          <span>/</span>
          <span className="text-slate-900">Chase vs QuickBooks</span>
        </nav>

        <header className="mb-12">
          <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
            Updated March 2026
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight mb-4">
            Chase vs QuickBooks (2026): Invoice Follow-Up vs Full Accounting
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            QuickBooks is the gold standard for small business accounting. It can do payroll, inventory, tax filing, bank reconciliation, financial reporting — all the things an accountant needs. The problem is that most freelancers don&apos;t need an accountant&apos;s toolset. They need to <strong>send invoices and get paid without manually following up</strong>. That&apos;s what Chase is built for.
          </p>
        </header>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">What freelancers actually need vs what QuickBooks gives them</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm mb-4">
              <thead>
                <tr>
                  <th className="text-left py-2 text-slate-500 font-semibold">What freelancers need</th>
                  <th className="text-left py-2 text-slate-500 font-semibold">What QuickBooks is built for</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  ['Send invoice and get paid', 'Double-entry bookkeeping'],
                  ['Automatic follow-up on overdue invoices', 'Chart of accounts management'],
                  ['Know who owes them money', 'Payroll processing'],
                  ['Accept credit card payments easily', 'Inventory and COGS tracking'],
                  ['Spend less time on admin', 'P&L statements and balance sheets'],
                ].map(([need, qb]) => (
                  <tr key={need}>
                    <td className="py-3 text-slate-700 flex items-center gap-2"><span className="text-indigo-500">✓</span> {need}</td>
                    <td className="py-3 text-slate-500">{qb}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-slate-600 leading-relaxed">
            QuickBooks Online starts at $30/month for a plan that&apos;s still limited — the plan most freelancers actually need (Simple Start with more users and reporting) is $60+/month. You&apos;re paying for accounting infrastructure you don&apos;t use.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Full feature comparison</h2>
          <p className="text-slate-500 text-sm mb-6">Chase vs QuickBooks across every relevant dimension for freelancers.</p>
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left px-4 py-3 text-slate-600 font-semibold w-1/2">Feature</th>
                  <th className="text-center px-4 py-3 text-indigo-700 font-semibold w-1/4">Chase</th>
                  <th className="text-center px-4 py-3 text-slate-600 font-semibold w-1/4">QuickBooks</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr key={row.feature} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                    <td className="px-4 py-3 text-slate-700">{row.feature}</td>
                    <td className="px-4 py-3"><CellValue value={row.chase} /></td>
                    <td className="px-4 py-3"><CellValue value={row.qb} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-400 mt-2">Pricing as of March 2026. QuickBooks pricing subject to change.</p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">When QuickBooks makes sense for freelancers</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            To be fair to QuickBooks — there are situations where it&apos;s the right choice, even for freelancers:
          </p>
          <ul className="space-y-3">
            {[
              'You have a bookkeeper or accountant who manages your books',
              'You\'re incorporated and need proper GAAP-compliant financial statements',
              'You have multiple employees or contractors you need to pay',
              'You resell products and need inventory tracking',
              'Your CPA specifically requires QuickBooks files',
            ].map((p) => (
              <li key={p} className="flex items-start gap-3 text-slate-600">
                <span className="text-slate-400 mt-1 shrink-0">→</span>
                <span className="text-sm">{p}</span>
              </li>
            ))}
          </ul>
          <p className="text-slate-600 mt-4 leading-relaxed text-sm">
            If none of those apply to you — if you&apos;re a solo freelancer who sends project invoices, uses a personal accountant at tax time, and just wants to get paid — Chase is almost certainly a better fit.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">The bottom line</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            Chase and QuickBooks aren&apos;t really competitors. QuickBooks is accounting software; Chase is invoice follow-up automation. The question is: what problem are you trying to solve?
          </p>
          <div className="space-y-4">
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5">
              <p className="font-semibold text-slate-900 mb-1.5">&quot;I need invoices paid without me having to chase clients&quot;</p>
              <p className="text-sm text-slate-600">→ <Link href="/signup" className="text-indigo-600 hover:underline">Chase</Link>. Start in 5 minutes, free plan available.</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
              <p className="font-semibold text-slate-900 mb-1.5">&quot;I need full accounting, payroll, and tax prep for my business&quot;</p>
              <p className="text-sm text-slate-600">→ QuickBooks, Xero, or FreshBooks depending on your needs.</p>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
              <p className="font-semibold text-slate-900 mb-1.5">&quot;I need both&quot;</p>
              <p className="text-sm text-slate-600">→ Use Wave (free) or FreshBooks for accounting, and Chase for automated invoice follow-up. They work independently.</p>
            </div>
          </div>
        </section>

        <div className="bg-indigo-600 rounded-2xl p-8 text-center mb-10">
          <h2 className="text-2xl font-bold text-white mb-3">Get paid without the accounting overhead.</h2>
          <p className="text-indigo-200 mb-6 max-w-sm mx-auto">
            Chase sends invoices with Stripe payment links and follows up automatically. No chart of accounts. No journal entries. Just payment.
          </p>
          <Link href="/signup" className="inline-flex items-center gap-2 bg-white text-indigo-700 font-semibold px-6 py-3 rounded-xl hover:bg-indigo-50 transition-colors">
            Start free — no credit card →
          </Link>
          <p className="text-indigo-300 text-xs mt-3">Free plan available. Pro at $19/mo.</p>
        </div>

        <div className="pt-8 border-t border-slate-200">
          <p className="text-sm font-semibold text-slate-700 mb-4">More comparisons</p>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/alternatives/quickbooks" className="text-sm text-indigo-600 hover:underline">QuickBooks alternatives →</Link>
            <Link href="/vs/freshbooks" className="text-sm text-indigo-600 hover:underline">Chase vs FreshBooks →</Link>
            <Link href="/vs/wave" className="text-sm text-indigo-600 hover:underline">Chase vs Wave →</Link>
            <Link href="/alternatives/dubsado" className="text-sm text-indigo-600 hover:underline">Dubsado alternatives →</Link>
          </div>
        </div>
      </article>

      <footer className="border-t border-slate-200 bg-slate-50 py-8">
        <div className="max-w-3xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 bg-indigo-600 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-xs">C</span>
            </div>
            <span className="font-semibold text-slate-700 text-sm">Chase</span>
          </Link>
          <div className="flex items-center gap-5 text-sm text-slate-500">
            <Link href="/blog" className="hover:text-slate-900">Blog</Link>
            <Link href="/privacy" className="hover:text-slate-900">Privacy</Link>
            <Link href="/terms" className="hover:text-slate-900">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
