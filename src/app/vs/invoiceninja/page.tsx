import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Chase vs Invoice Ninja (2026): Automated Follow-Up vs Open Source Invoicing',
  description:
    'Invoice Ninja is a powerful open-source invoicing platform. Chase is automated invoice follow-up for freelancers. Which is right for you? An honest comparison.',
  keywords: [
    'Chase vs Invoice Ninja',
    'Invoice Ninja alternative',
    'Invoice Ninja vs Chase',
    'Invoice Ninja competitor',
    'Invoice Ninja alternative for freelancers',
    'automated invoice reminders vs Invoice Ninja',
    'Invoice Ninja vs automated follow-up',
    'open source invoice software alternative',
    'Invoice Ninja 2026',
    'Invoice Ninja replacement',
  ],
  openGraph: {
    title: 'Chase vs Invoice Ninja (2026): Which Is Better for Freelancers?',
    description:
      'Invoice Ninja has powerful features but requires setup and manual follow-up. Chase automates the entire follow-up process so you just get paid.',
    url: 'https://chase.allonys.com/vs/invoiceninja',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chase vs Invoice Ninja (2026)',
    description: 'Invoice Ninja is powerful. Chase is automated. Which one actually gets freelancers paid faster?',
  },
  alternates: {
    canonical: 'https://chase.allonys.com/vs/invoiceninja',
  },
}

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Chase',
    applicationCategory: 'BusinessApplication',
    url: 'https://chase.allonys.com',
    description: 'Chase is an automated invoice follow-up tool for freelancers — a simpler, more automated alternative to Invoice Ninja for getting invoices paid.',
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
      { '@type': 'ListItem', position: 2, name: 'Comparisons', item: 'https://chase.allonys.com/vs/invoiceninja' },
      { '@type': 'ListItem', position: 3, name: 'Chase vs Invoice Ninja' },
    ],
  },
]

const comparisonRows = [
  { feature: 'Automated invoice follow-up sequence', chase: true, ninja: false },
  { feature: 'Stripe payment links on every invoice', chase: true, ninja: 'Partial' },
  { feature: 'Automatic payment detection + stop', chase: true, ninja: false },
  { feature: 'Manual reminders / scheduling', chase: false, ninja: true },
  { feature: 'Recurring invoices', chase: false, ninja: true },
  { feature: 'Time tracking', chase: false, ninja: true },
  { feature: 'Expense tracking', chase: false, ninja: true },
  { feature: 'Client portal', chase: false, ninja: true },
  { feature: 'Multiple payment gateways', chase: 'Stripe only', ninja: true },
  { feature: 'Self-hosted option', chase: false, ninja: true },
  { feature: 'Starting price (hosted)', chase: 'Free', ninja: 'Free (limits apply)' },
  { feature: 'Setup time', chase: '5 minutes', ninja: '30–120 minutes' },
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

export default function ChaseVsInvoiceNinjaPage() {
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
          <span className="text-slate-900">Chase vs Invoice Ninja</span>
        </nav>

        <header className="mb-12">
          <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
            Updated March 2026
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight mb-4">
            Chase vs Invoice Ninja (2026): Which Is Right for Freelancers?
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            Invoice Ninja is one of the most feature-rich invoicing platforms available — time tracking, client portals, expense management, multiple payment gateways, self-hosting. It&apos;s impressive. The gap is that when an invoice goes unpaid, <strong>you still have to chase it yourself</strong>. That&apos;s exactly what Chase handles automatically.
          </p>
        </header>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">The fundamental difference</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
              <p className="font-semibold text-slate-900 mb-2">Invoice Ninja: feature-rich invoicing</p>
              <p className="text-sm text-slate-600">Invoice Ninja gives you enormous control over your invoicing workflow — multiple clients, recurring billing, custom fields, self-hosted deployment. But follow-up reminders require manual scheduling. No hands-off automation.</p>
            </div>
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5">
              <p className="font-semibold text-slate-900 mb-2">Chase: zero-effort payment collection</p>
              <p className="text-sm text-slate-600">Chase does one thing: makes sure every invoice gets paid without you having to do anything after sending it. Follow-up emails go out automatically at day 3, 7, and 14. Payment detected? Sequence stops instantly.</p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Feature comparison</h2>
          <p className="text-slate-500 text-sm mb-6">Chase vs Invoice Ninja on the features that matter most for freelance invoice collection.</p>
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left px-4 py-3 text-slate-600 font-semibold w-1/2">Feature</th>
                  <th className="text-center px-4 py-3 text-indigo-700 font-semibold w-1/4">Chase</th>
                  <th className="text-center px-4 py-3 text-slate-600 font-semibold w-1/4">Invoice Ninja</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr key={row.feature} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                    <td className="px-4 py-3 text-slate-700">{row.feature}</td>
                    <td className="px-4 py-3"><CellValue value={row.chase} /></td>
                    <td className="px-4 py-3"><CellValue value={row.ninja} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Who Invoice Ninja is great for</h2>
          <ul className="space-y-3">
            {[
              'Developers who want to self-host their invoicing system',
              'Freelancers with complex billing needs (recurring, time-based, multi-currency)',
              'Users who need multiple payment gateways (PayPal, Stripe, Square, etc.)',
              'Agencies managing many clients with different billing structures',
              'People who want to own their own data on their own server',
            ].map((p) => (
              <li key={p} className="flex items-start gap-3 text-slate-600">
                <span className="text-slate-400 mt-1 shrink-0">→</span>
                <span className="text-sm">{p}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Who Chase is great for</h2>
          <ul className="space-y-3">
            {[
              'Freelancers who use Stripe (or want to start) and want invoices paid automatically',
              'Anyone spending more than 30 minutes/week following up on invoices',
              'Consultants who send straightforward project invoices and want payment on autopilot',
              'Freelancers who want to be live in 5 minutes without configuring complex workflows',
              'People whose problem is late payments, not invoice feature coverage',
            ].map((p) => (
              <li key={p} className="flex items-start gap-3 text-slate-600">
                <span className="text-indigo-400 mt-1 shrink-0">→</span>
                <span className="text-sm">{p}</span>
              </li>
            ))}
          </ul>
        </section>

        <div className="bg-indigo-600 rounded-2xl p-8 text-center mb-10">
          <h2 className="text-2xl font-bold text-white mb-3">Invoice follow-up on autopilot.</h2>
          <p className="text-indigo-200 mb-6 max-w-sm mx-auto">
            Send your invoice. Chase handles the rest — following up automatically and stopping the moment your client pays.
          </p>
          <Link href="/signup" className="inline-flex items-center gap-2 bg-white text-indigo-700 font-semibold px-6 py-3 rounded-xl hover:bg-indigo-50 transition-colors">
            Start free — no credit card →
          </Link>
          <p className="text-indigo-300 text-xs mt-3">Free plan available. Pro at $19/mo.</p>
        </div>

        <div className="pt-8 border-t border-slate-200">
          <p className="text-sm font-semibold text-slate-700 mb-4">More comparisons</p>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/vs/wave" className="text-sm text-indigo-600 hover:underline">Chase vs Wave →</Link>
            <Link href="/vs/freshbooks" className="text-sm text-indigo-600 hover:underline">Chase vs FreshBooks →</Link>
            <Link href="/vs/quickbooks" className="text-sm text-indigo-600 hover:underline">Chase vs QuickBooks →</Link>
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
