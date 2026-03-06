import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '5 Best QuickBooks Alternatives for Freelancers (2026) — Cheaper & Simpler',
  description:
    "QuickBooks is built for accountants, not freelancers. If you just need to send invoices and get paid automatically, here are 5 QuickBooks alternatives that won't overwhelm you.",
  keywords: [
    'QuickBooks alternatives for freelancers',
    'QuickBooks alternative freelancer',
    'cheaper than QuickBooks',
    'QuickBooks alternative invoice',
    'QuickBooks too expensive freelancer',
    'alternatives to QuickBooks Online',
    'QuickBooks competitor',
    'freelance invoicing instead of QuickBooks',
    'QuickBooks alternative 2026',
    'simple QuickBooks alternative',
  ],
  openGraph: {
    title: '5 Best QuickBooks Alternatives for Freelancers (2026)',
    description:
      "QuickBooks is overkill for most freelancers. Here are 5 simpler, cheaper alternatives that focus on what matters: getting invoices paid.",
    url: 'https://chase.allonys.com/alternatives/quickbooks',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '5 Best QuickBooks Alternatives for Freelancers (2026)',
    description: 'QuickBooks is expensive and complex for freelancers. These alternatives get the job done for less.',
  },
  alternates: {
    canonical: 'https://chase.allonys.com/alternatives/quickbooks',
  },
}

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: '5 Best QuickBooks Alternatives for Freelancers (2026) — Cheaper & Simpler',
    description:
      'Comparing the best QuickBooks alternatives for freelancers who want to send invoices and get paid without full accounting software.',
    datePublished: '2026-03-06',
    dateModified: '2026-03-06',
    author: { '@type': 'Organization', name: 'Chase', url: 'https://chase.allonys.com' },
    publisher: { '@type': 'Organization', name: 'Chase', url: 'https://chase.allonys.com' },
    url: 'https://chase.allonys.com/alternatives/quickbooks',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Chase', item: 'https://chase.allonys.com' },
      { '@type': 'ListItem', position: 2, name: 'Alternatives', item: 'https://chase.allonys.com/alternatives/quickbooks' },
      { '@type': 'ListItem', position: 3, name: 'QuickBooks Alternatives' },
    ],
  },
]

const comparisonRows = [
  { feature: 'Automated invoice follow-up sequence', chase: true, quickbooks: false },
  { feature: 'Stripe payment links on invoices', chase: true, quickbooks: false },
  { feature: 'Automatic payment detection + stop', chase: true, quickbooks: false },
  { feature: 'Manual invoice reminders', chase: false, quickbooks: true },
  { feature: 'Full double-entry accounting', chase: false, quickbooks: true },
  { feature: 'Expense tracking', chase: false, quickbooks: true },
  { feature: 'Payroll processing', chase: false, quickbooks: true },
  { feature: 'Bank reconciliation', chase: false, quickbooks: true },
  { feature: 'Tax preparation tools', chase: false, quickbooks: true },
  { feature: 'Starting price (per month)', chase: 'Free', quickbooks: '$30' },
  { feature: 'Full-featured freelance plan', chase: '$19/mo', quickbooks: '$60+/mo' },
  { feature: 'Setup time', chase: '5 minutes', quickbooks: 'Hours to days' },
  { feature: 'Free plan available', chase: 'Yes', quickbooks: 'Trial only' },
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

const alternatives = [
  {
    rank: 1,
    name: 'Chase',
    tagline: 'Automated invoice follow-up for freelancers',
    price: 'Free / $19/mo',
    bestFor: 'Freelancers who want invoices paid automatically without accounting software',
    pros: ['Automatic follow-up sequences (day 3, 7, 14)', 'Stripe payment links on every invoice', 'Zero setup friction — live in 5 minutes', 'Free plan available'],
    cons: ['No accounting or bookkeeping', 'No expense tracking', 'Invoice-focused only'],
    cta: true,
  },
  {
    rank: 2,
    name: 'Wave',
    tagline: 'Free accounting and invoicing',
    price: 'Free (payment fees apply)',
    bestFor: 'Freelancers who need basic invoicing + bookkeeping at no cost',
    pros: ['Completely free for invoicing + bookkeeping', 'Bank connections and reconciliation', 'Decent financial reports'],
    cons: ['Manual invoice reminders only', 'No automated follow-up', 'Support requires paid plan'],
    cta: false,
  },
  {
    rank: 3,
    name: 'FreshBooks',
    tagline: 'Accounting built for freelancers and service businesses',
    price: '$19–$55/mo',
    bestFor: 'Freelancers who need invoicing + expense tracking + time tracking',
    pros: ['Built for service businesses', 'Time tracking included', 'Expense management', 'Client portal'],
    cons: ['No automated follow-up sequences', 'More expensive than Chase for invoice-only use', 'Client limits on lower plans'],
    cta: false,
  },
  {
    rank: 4,
    name: 'Bonsai',
    tagline: 'Invoicing + contracts + tax for freelancers',
    price: '$21–$79/mo',
    bestFor: 'Freelancers who want contracts, invoicing, and basic tax tools in one place',
    pros: ['Contract templates', 'Tax estimates', 'Expense tracking', 'Time tracking'],
    cons: ['No automated invoice follow-up', 'More expensive than alternatives', 'Overkill if you only need invoicing'],
    cta: false,
  },
  {
    rank: 5,
    name: 'Xero',
    tagline: 'Full-featured cloud accounting',
    price: '$15–$78/mo',
    bestFor: 'Growing freelancers or small businesses who need proper accounting without QuickBooks complexity',
    pros: ['Excellent bank reconciliation', 'Strong reporting', 'Large app ecosystem', 'Better UX than QuickBooks'],
    cons: ['No automated follow-up', 'Still accounting software — more than most freelancers need', 'Learning curve'],
    cta: false,
  },
]

export default function QuickBooksAlternativesPage() {
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
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
          <Link href="/" className="hover:text-slate-900">Chase</Link>
          <span>/</span>
          <span className="text-slate-900">QuickBooks Alternatives</span>
        </nav>

        {/* Header */}
        <header className="mb-12">
          <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
            Updated March 2026
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight mb-4">
            5 Best QuickBooks Alternatives for Freelancers (2026)
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            QuickBooks is accounting software built for businesses with accountants. Most freelancers sign up, get overwhelmed by the chart of accounts, journal entries, and bank reconciliation screens — and give up before sending a single invoice. If you just need to <strong>send invoices and get paid without chasing clients</strong>, there are better options.
          </p>
        </header>

        {/* TL;DR */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6 mb-12">
          <p className="text-sm font-semibold text-indigo-700 uppercase tracking-wide mb-3">TL;DR — Best QuickBooks Alternatives for Freelancers</p>
          <ul className="space-y-2">
            {alternatives.map((alt) => (
              <li key={alt.name} className="flex items-start gap-2 text-sm text-slate-700">
                <span className="font-bold text-indigo-600 shrink-0">{alt.rank}.</span>
                <span>
                  <strong>{alt.name}</strong> — {alt.tagline}.
                  {alt.cta && <> <Link href="/signup" className="text-indigo-600 hover:underline">Start free →</Link></>}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Why leave QuickBooks */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Why freelancers look for QuickBooks alternatives</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            QuickBooks Online starts at $30/month and is designed for businesses that need proper double-entry accounting — not for a freelance designer or consultant who sends 5 invoices a month. The most common reasons freelancers leave:
          </p>
          <ul className="space-y-3 mb-4">
            {[
              { title: 'Price.', body: 'QuickBooks Online starts at $30/month just for the basics. The plan most freelancers actually need (with time tracking and more clients) is $60–$85/month.' },
              { title: 'Complexity.', body: 'QuickBooks is designed for accountants. Chart of accounts, journal entries, and reconciliation screens are overwhelming if you just need to invoice clients.' },
              { title: 'No automated follow-up.', body: 'QuickBooks can send payment reminders, but you have to set them up manually and they\'re not truly automated. You still have to check on overdue invoices yourself.' },
              { title: 'You\'re paying for features you don\'t use.', body: 'Payroll, inventory, class tracking, sales tax management — most freelancers use 10% of what QuickBooks offers.' },
            ].map(({ title, body }) => (
              <li key={title} className="flex items-start gap-3">
                <span className="text-slate-400 mt-1 shrink-0">→</span>
                <span className="text-slate-600"><strong>{title}</strong> {body}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Comparison table */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Chase vs QuickBooks: Feature comparison</h2>
          <p className="text-slate-500 text-sm mb-6">How Chase and QuickBooks compare on features that matter most for freelance invoice collection.</p>
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
                    <td className="px-4 py-3"><CellValue value={row.quickbooks} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-400 mt-2">Pricing as of March 2026.</p>
        </section>

        {/* The alternatives */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">The 5 best QuickBooks alternatives for freelancers</h2>
          <div className="space-y-8">
            {alternatives.map((alt) => (
              <div key={alt.name} className="border border-slate-200 rounded-xl p-6">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">#{alt.rank}</span>
                      <h3 className="text-xl font-bold text-slate-900">{alt.name}</h3>
                      {alt.cta && (
                        <span className="inline-flex items-center bg-indigo-100 text-indigo-700 text-xs font-semibold px-2 py-0.5 rounded-full">Our pick</span>
                      )}
                    </div>
                    <p className="text-slate-500 text-sm">{alt.tagline}</p>
                  </div>
                  <span className="text-sm font-semibold text-slate-700 shrink-0">{alt.price}</span>
                </div>
                <p className="text-sm text-slate-600 mb-4"><strong>Best for:</strong> {alt.bestFor}</p>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-2">Pros</p>
                    <ul className="space-y-1">
                      {alt.pros.map((p) => (
                        <li key={p} className="flex items-start gap-1.5 text-sm text-slate-600">
                          <span className="text-emerald-500 mt-0.5 shrink-0">✓</span>{p}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Cons</p>
                    <ul className="space-y-1">
                      {alt.cons.map((c) => (
                        <li key={c} className="flex items-start gap-1.5 text-sm text-slate-600">
                          <span className="text-slate-300 mt-0.5 shrink-0">✗</span>{c}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                {alt.cta && (
                  <Link href="/signup" className="inline-flex items-center gap-1.5 bg-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                    Try Chase free — no credit card →
                  </Link>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="bg-indigo-600 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Invoice follow-up on autopilot.</h2>
          <p className="text-indigo-200 mb-6 max-w-sm mx-auto">
            Chase sends invoices, follows up automatically at day 3, 7, and 14, and stops the moment your client pays. No accounting degree required.
          </p>
          <Link href="/signup" className="inline-flex items-center gap-2 bg-white text-indigo-700 font-semibold px-6 py-3 rounded-xl hover:bg-indigo-50 transition-colors">
            Start free — no credit card →
          </Link>
          <p className="text-indigo-300 text-xs mt-3">Free plan available. Pro at $19/mo.</p>
        </div>

        {/* Related */}
        <div className="mt-12 pt-8 border-t border-slate-200">
          <p className="text-sm font-semibold text-slate-700 mb-4">More comparisons</p>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/vs/quickbooks" className="text-sm text-indigo-600 hover:underline">Chase vs QuickBooks →</Link>
            <Link href="/vs/freshbooks" className="text-sm text-indigo-600 hover:underline">Chase vs FreshBooks →</Link>
            <Link href="/alternatives/dubsado" className="text-sm text-indigo-600 hover:underline">Dubsado alternatives →</Link>
            <Link href="/alternatives/honeybook" className="text-sm text-indigo-600 hover:underline">HoneyBook alternatives →</Link>
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
