import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Chase vs Wave (2026): Which Is Better for Getting Invoices Paid?',
  description:
    "Wave is free invoicing and bookkeeping. Chase is automated invoice follow-up. If you're tired of chasing unpaid invoices manually, here's an honest comparison.",
  keywords: [
    'Chase vs Wave',
    'Wave invoicing alternative',
    'Wave app alternative',
    'Wave vs Chase invoicing',
    'Wave invoicing competitor',
    'Wave alternative for freelancers',
    'automated invoice reminders vs Wave',
    'Wave invoicing vs automated follow-up',
    'Wave accounting alternative',
    'better than Wave invoicing',
  ],
  openGraph: {
    title: 'Chase vs Wave (2026): Which Gets Your Invoices Paid Faster?',
    description:
      'Wave is free but relies on manual reminders. Chase automates invoice follow-up so you get paid without lifting a finger.',
    url: 'https://chase.allonys.com/vs/wave',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chase vs Wave (2026)',
    description: 'Wave is free. Chase is automated. Which one actually gets you paid faster?',
  },
  alternates: {
    canonical: 'https://chase.allonys.com/vs/wave',
  },
}

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Chase',
    applicationCategory: 'BusinessApplication',
    url: 'https://chase.allonys.com',
    description: 'Chase is an automated invoice follow-up tool for freelancers — a focused alternative to Wave for getting invoices paid without manual chasing.',
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
      { '@type': 'ListItem', position: 2, name: 'Comparisons', item: 'https://chase.allonys.com/vs/wave' },
      { '@type': 'ListItem', position: 3, name: 'Chase vs Wave' },
    ],
  },
]

const comparisonRows = [
  { feature: 'Automated invoice follow-up (day 3, 7, 14)', chase: true, wave: false },
  { feature: 'Stripe payment links on every invoice', chase: true, wave: false },
  { feature: 'Automatic payment detection + stop', chase: true, wave: false },
  { feature: 'Manual payment reminders', chase: false, wave: true },
  { feature: 'Free accounting / bookkeeping', chase: false, wave: true },
  { feature: 'Bank reconciliation', chase: false, wave: true },
  { feature: 'Income & expense reports', chase: false, wave: true },
  { feature: 'Payroll (add-on)', chase: false, wave: true },
  { feature: 'Starting price', chase: 'Free', wave: 'Free' },
  { feature: 'Pro plan', chase: '$19/mo', wave: 'Freemium (fees on payments)' },
  { feature: 'Setup time', chase: '5 minutes', wave: '30–60 minutes' },
  { feature: 'Invoice-to-payment automation', chase: 'Full', wave: 'None' },
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

export default function ChaseVsWavePage() {
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
          <span className="text-slate-900">Chase vs Wave</span>
        </nav>

        {/* Header */}
        <header className="mb-12">
          <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
            Updated March 2026
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight mb-4">
            Chase vs Wave (2026): Which Gets Your Invoices Paid Faster?
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            Wave is a genuinely excellent free tool — free invoicing, free bookkeeping, free bank reconciliation. If you need accounting software at zero cost, it&apos;s hard to beat. But if your problem is <strong>invoices that go unpaid for weeks while you avoid sending awkward follow-up emails</strong>, Wave doesn&apos;t solve that. Chase does.
          </p>
        </header>

        {/* The core difference */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Wave vs Chase: The core difference</h2>
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
              <p className="font-semibold text-slate-900 mb-2">Wave is accounting software</p>
              <p className="text-sm text-slate-600">Wave helps you track income, expenses, and reconcile your bank account. It can send invoices and manual reminders — but when an invoice goes unpaid, you still have to chase it yourself.</p>
            </div>
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5">
              <p className="font-semibold text-slate-900 mb-2">Chase is invoice follow-up automation</p>
              <p className="text-sm text-slate-600">Chase is laser-focused on one thing: making sure every invoice you send gets paid, automatically. It follows up on day 3, day 7, and day 14 — and stops the moment your client pays.</p>
            </div>
          </div>
          <p className="text-slate-600 leading-relaxed">
            They&apos;re solving different problems. Wave is for &quot;help me understand my finances.&quot; Chase is for &quot;help me stop chasing people for money.&quot; Many freelancers actually use <em>both</em> — Wave for bookkeeping, Chase for getting paid.
          </p>
        </section>

        {/* Why Wave falls short for follow-up */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Why Wave falls short for invoice follow-up</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            Wave can send payment reminders — but they&apos;re manual. You have to go into each invoice, check if it&apos;s overdue, and manually trigger a reminder. You decide the timing, you write the message, you hit send. If you forget, the invoice sits unpaid.
          </p>
          <ul className="space-y-3">
            {[
              'No automatic follow-up sequence — you have to remember to do it',
              'No Stripe payment links — clients pay through Wave\'s payment system (with processing fees) or via bank transfer',
              'Wave doesn\'t stop reminders automatically when payment arrives — you have to mark it manually',
              'Each reminder requires you to go into Wave, find the invoice, and take action',
            ].map((point) => (
              <li key={point} className="flex items-start gap-3 text-slate-600">
                <span className="text-red-400 mt-1 shrink-0">✗</span>
                <span className="text-sm">{point}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Comparison table */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Feature comparison</h2>
          <p className="text-slate-500 text-sm mb-6">Chase vs Wave across the features that matter most for freelancers.</p>
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left px-4 py-3 text-slate-600 font-semibold w-1/2">Feature</th>
                  <th className="text-center px-4 py-3 text-indigo-700 font-semibold w-1/4">Chase</th>
                  <th className="text-center px-4 py-3 text-slate-600 font-semibold w-1/4">Wave</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr key={row.feature} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                    <td className="px-4 py-3 text-slate-700">{row.feature}</td>
                    <td className="px-4 py-3"><CellValue value={row.chase} /></td>
                    <td className="px-4 py-3"><CellValue value={row.wave} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Who should choose what */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Which should you use?</h2>
          <div className="space-y-4">
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5">
              <p className="font-semibold text-slate-900 mb-2">Choose Chase if:</p>
              <ul className="space-y-1.5">
                {[
                  'You have overdue invoices sitting unpaid right now',
                  'You hate writing follow-up emails',
                  'You want the whole process to run automatically from send to paid',
                  'You use Stripe (or want to start accepting card payments)',
                ].map((p) => (
                  <li key={p} className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="text-indigo-500 shrink-0">✓</span>{p}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
              <p className="font-semibold text-slate-900 mb-2">Choose Wave if:</p>
              <ul className="space-y-1.5">
                {[
                  'You need free bookkeeping and bank reconciliation',
                  'You want to track income and expenses alongside invoicing',
                  'You\'re comfortable sending manual reminders yourself',
                  'You don\'t need payment automation',
                ].map((p) => (
                  <li key={p} className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="text-slate-400 shrink-0">✓</span>{p}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
              <p className="font-semibold text-slate-900 mb-2">Use both:</p>
              <p className="text-sm text-slate-600">Many freelancers use Wave for bookkeeping (it&apos;s free!) and Chase for invoice follow-up automation. They solve different problems and complement each other well.</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="bg-indigo-600 rounded-2xl p-8 text-center mb-10">
          <h2 className="text-2xl font-bold text-white mb-3">Stop sending &quot;just checking in&quot; emails.</h2>
          <p className="text-indigo-200 mb-6 max-w-sm mx-auto">
            Chase follows up on every unpaid invoice automatically — day 3, 7, and 14 — and stops the moment payment arrives.
          </p>
          <Link href="/signup" className="inline-flex items-center gap-2 bg-white text-indigo-700 font-semibold px-6 py-3 rounded-xl hover:bg-indigo-50 transition-colors">
            Start free — no credit card →
          </Link>
          <p className="text-indigo-300 text-xs mt-3">Free plan available. Pro at $19/mo.</p>
        </div>

        {/* Related */}
        <div className="pt-8 border-t border-slate-200">
          <p className="text-sm font-semibold text-slate-700 mb-4">More comparisons</p>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/vs/freshbooks" className="text-sm text-indigo-600 hover:underline">Chase vs FreshBooks →</Link>
            <Link href="/vs/quickbooks" className="text-sm text-indigo-600 hover:underline">Chase vs QuickBooks →</Link>
            <Link href="/alternatives/dubsado" className="text-sm text-indigo-600 hover:underline">Dubsado alternatives →</Link>
            <Link href="/alternatives/bonsai" className="text-sm text-indigo-600 hover:underline">Bonsai alternatives →</Link>
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
