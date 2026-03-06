import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '5 Best Dubsado Alternatives for Freelancers (2026) — Cheaper & Simpler',
  description:
    "Dubsado bundles CRM, contracts, scheduling, and invoicing — but if you mainly need to get invoices paid automatically, it's expensive overkill. Here are 5 focused Dubsado alternatives.",
  keywords: [
    'Dubsado alternatives',
    'Dubsado alternative for freelancers',
    'alternatives to Dubsado',
    'Dubsado vs Chase',
    'cheaper Dubsado alternative',
    'Dubsado competitor',
    'Dubsado app alternative 2026',
    'freelancer invoicing software alternative to Dubsado',
    'Dubsado too expensive',
    'simple Dubsado alternative',
  ],
  openGraph: {
    title: '5 Best Dubsado Alternatives for Freelancers (2026)',
    description:
      "Dubsado is expensive and complex if you mainly need automated invoice follow-up. Here are 5 better-targeted alternatives.",
    url: 'https://chase.allonys.com/alternatives/dubsado',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '5 Best Dubsado Alternatives for Freelancers (2026)',
    description: 'Better Dubsado alternatives for freelancers who mainly need to get paid on time.',
  },
  alternates: {
    canonical: 'https://chase.allonys.com/alternatives/dubsado',
  },
}

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: '5 Best Dubsado Alternatives for Freelancers (2026) — Cheaper & Simpler',
    description:
      'Comparing the best Dubsado alternatives for freelancers who need focused invoice follow-up without CRM complexity.',
    datePublished: '2026-03-06',
    dateModified: '2026-03-06',
    author: { '@type': 'Organization', name: 'Chase', url: 'https://chase.allonys.com' },
    publisher: { '@type': 'Organization', name: 'Chase', url: 'https://chase.allonys.com' },
    url: 'https://chase.allonys.com/alternatives/dubsado',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Chase', item: 'https://chase.allonys.com' },
      { '@type': 'ListItem', position: 2, name: 'Alternatives', item: 'https://chase.allonys.com/alternatives/dubsado' },
      { '@type': 'ListItem', position: 3, name: 'Dubsado Alternatives' },
    ],
  },
]

const alternatives = [
  {
    rank: 1,
    name: 'Chase',
    tagline: 'Automated invoice follow-up for freelancers',
    price: 'Free / $19/mo',
    bestFor: 'Freelancers who need automated invoice follow-up without CRM overhead',
    pros: ['Automatic follow-up sequences (day 3, 7, 14)', 'Stripe payment links on every invoice', 'Zero setup friction — live in 5 minutes', 'Free plan available'],
    cons: ['No contracts or scheduling', 'No CRM features', 'Invoice-focused only'],
    url: 'https://chase.allonys.com',
    cta: true,
  },
  {
    rank: 2,
    name: 'HoneyBook',
    tagline: 'CRM + contracts + invoicing for creatives',
    price: '$16–$66/mo',
    bestFor: 'Creative freelancers who need CRM + contracts + invoicing in one tool',
    pros: ['Client portals and contracts', 'Project pipeline management', 'Automated workflows', 'Mobile app'],
    cons: ['No automatic invoice follow-up sequences', 'More complex than needed for invoice-only use', 'No free plan'],
    url: 'https://honeybook.com',
    cta: false,
  },
  {
    rank: 3,
    name: 'Bonsai',
    tagline: 'Contracts, invoicing, and tax for freelancers',
    price: '$21–$79/mo',
    bestFor: 'Freelancers who need contracts + invoicing + basic accounting',
    pros: ['Contract templates', 'Time tracking', 'Expense tracking', 'Tax estimates'],
    cons: ['Manual invoice reminders only', 'No automated follow-up sequences', 'More expensive than Chase'],
    url: 'https://hellobonsai.com',
    cta: false,
  },
  {
    rank: 4,
    name: 'Wave',
    tagline: 'Free accounting and invoicing',
    price: 'Free (payment fees apply)',
    bestFor: 'Freelancers who need basic invoicing and bookkeeping at zero cost',
    pros: ['Completely free for invoicing', 'Basic bookkeeping included', 'Bank reconciliation'],
    cons: ['Manual reminders only', 'No automated follow-up', 'Paywall for payment processing features'],
    url: 'https://waveapps.com',
    cta: false,
  },
  {
    rank: 5,
    name: 'FreshBooks',
    tagline: 'Full accounting for freelancers and small businesses',
    price: '$19–$55/mo',
    bestFor: 'Freelancers who need full accounting, expense tracking, and reporting',
    pros: ['Full accounting suite', 'Time tracking', 'Expense management', 'Financial reports'],
    cons: ['Manual invoice reminders only', 'No automated follow-up sequences', 'Expensive for invoice-only use'],
    url: 'https://freshbooks.com',
    cta: false,
  },
]

const comparisonRows = [
  { feature: 'Automated invoice follow-up sequence', chase: true, dubsado: false },
  { feature: 'Stripe payment links on invoices', chase: true, dubsado: false },
  { feature: 'Automatic payment detection + stop', chase: true, dubsado: false },
  { feature: 'Client CRM / pipeline', chase: false, dubsado: true },
  { feature: 'Contract templates', chase: false, dubsado: true },
  { feature: 'Scheduling / appointment booking', chase: false, dubsado: true },
  { feature: 'Questionnaires and lead capture', chase: false, dubsado: true },
  { feature: 'Accounting / bookkeeping', chase: false, dubsado: false },
  { feature: 'Starting price (per month)', chase: 'Free', dubsado: '$20' },
  { feature: 'Full-featured plan', chase: '$19/mo', dubsado: '$40/mo' },
  { feature: 'Setup time', chase: '5 minutes', dubsado: '2–4 hours' },
  { feature: 'Free plan available', chase: 'Yes', dubsado: 'Trial only' },
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

export default function DubsadoAlternativesPage() {
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
          <span className="text-slate-900">Dubsado Alternatives</span>
        </nav>

        {/* Header */}
        <header className="mb-12">
          <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
            Updated March 2026
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight mb-4">
            5 Best Dubsado Alternatives for Freelancers (2026)
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            Dubsado is a powerful all-in-one tool for freelancers — CRM, contracts, scheduling, invoicing, questionnaires. But at $20–$40/month, you&apos;re paying for a lot of features you might not need. If your main goal is <strong>getting invoices paid automatically without chasing clients</strong>, there are more focused (and cheaper) options.
          </p>
        </header>

        {/* TL;DR Box */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6 mb-12">
          <p className="text-sm font-semibold text-indigo-700 uppercase tracking-wide mb-3">TL;DR — Best Dubsado Alternatives</p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2 text-sm text-slate-700">
              <span className="font-bold text-indigo-600 shrink-0">1.</span>
              <span><strong>Chase</strong> — Best for automated invoice follow-up. Free plan available. <Link href="/signup" className="text-indigo-600 hover:underline">Start free →</Link></span>
            </li>
            <li className="flex items-start gap-2 text-sm text-slate-700">
              <span className="font-bold text-indigo-600 shrink-0">2.</span>
              <span><strong>HoneyBook</strong> — Best Dubsado-like experience at a lower price. Good for creatives needing CRM + invoicing.</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-slate-700">
              <span className="font-bold text-indigo-600 shrink-0">3.</span>
              <span><strong>Bonsai</strong> — Best for contract-focused freelancers who also want invoicing.</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-slate-700">
              <span className="font-bold text-indigo-600 shrink-0">4.</span>
              <span><strong>Wave</strong> — Best free option for basic invoicing + bookkeeping.</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-slate-700">
              <span className="font-bold text-indigo-600 shrink-0">5.</span>
              <span><strong>FreshBooks</strong> — Best for freelancers who need full accounting + invoicing.</span>
            </li>
          </ul>
        </div>

        {/* Why leave Dubsado */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Why freelancers look for Dubsado alternatives</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            Dubsado is genuinely impressive software — if you need all of it. The problem is that most freelancers sign up because they want to get paid faster, then spend days learning the CRM, setting up questionnaire workflows, and configuring lead capture forms before ever sending a single invoice.
          </p>
          <p className="text-slate-600 leading-relaxed mb-4">
            The most common reasons freelancers search for Dubsado alternatives:
          </p>
          <ul className="space-y-3 mb-4">
            <li className="flex items-start gap-3">
              <span className="text-slate-400 mt-1">→</span>
              <span className="text-slate-600"><strong>Too complex for invoice-only use.</strong> You wanted automated reminders, not a full CRM onboarding journey.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-slate-400 mt-1">→</span>
              <span className="text-slate-600"><strong>Dubsado doesn&apos;t auto-follow up.</strong> It can send reminders, but you have to manually trigger or schedule them — it&apos;s not hands-off.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-slate-400 mt-1">→</span>
              <span className="text-slate-600"><strong>Price jump after trial.</strong> After the free trial, Dubsado is $20/month (annual) to $40/month (monthly).</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-slate-400 mt-1">→</span>
              <span className="text-slate-600"><strong>Learning curve.</strong> It can take hours or days to configure Dubsado before you&apos;re ready to send your first invoice.</span>
            </li>
          </ul>
        </section>

        {/* Chase vs Dubsado comparison table */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Chase vs Dubsado: Feature comparison</h2>
          <p className="text-slate-500 text-sm mb-6">
            If invoice follow-up automation is your main need, here&apos;s how Chase and Dubsado compare on the features that matter most.
          </p>
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left px-4 py-3 text-slate-600 font-semibold w-1/2">Feature</th>
                  <th className="text-center px-4 py-3 text-indigo-700 font-semibold w-1/4">Chase</th>
                  <th className="text-center px-4 py-3 text-slate-600 font-semibold w-1/4">Dubsado</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr key={row.feature} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                    <td className="px-4 py-3 text-slate-700">{row.feature}</td>
                    <td className="px-4 py-3"><CellValue value={row.chase} /></td>
                    <td className="px-4 py-3"><CellValue value={row.dubsado} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-400 mt-2">Pricing as of March 2026. Chase pricing may vary.</p>
        </section>

        {/* The 5 alternatives */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">The 5 best Dubsado alternatives in 2026</h2>
          <div className="space-y-10">
            {alternatives.map((alt) => (
              <div key={alt.name} className="border border-slate-200 rounded-xl p-6">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">#{alt.rank}</span>
                      <h3 className="text-xl font-bold text-slate-900">{alt.name}</h3>
                      {alt.cta && (
                        <span className="inline-flex items-center bg-indigo-100 text-indigo-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                          Our pick
                        </span>
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
                          <span className="text-emerald-500 mt-0.5 shrink-0">✓</span>
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Cons</p>
                    <ul className="space-y-1">
                      {alt.cons.map((c) => (
                        <li key={c} className="flex items-start gap-1.5 text-sm text-slate-600">
                          <span className="text-slate-300 mt-0.5 shrink-0">✗</span>
                          {c}
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

        {/* Which to choose */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Which Dubsado alternative should you choose?</h2>
          <div className="space-y-4">
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="font-semibold text-slate-900 mb-1">If you mainly want invoices paid automatically → <Link href="/signup" className="text-indigo-600 hover:underline">Chase</Link></p>
              <p className="text-sm text-slate-600">Send an invoice, Chase follows up automatically at day 3, 7, and 14 — and stops the moment your client pays. No CRM setup, no workflows to configure. Live in 5 minutes.</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="font-semibold text-slate-900 mb-1">If you need CRM + contracts at a lower price → HoneyBook</p>
              <p className="text-sm text-slate-600">HoneyBook offers a similar all-in-one experience to Dubsado but is better designed for creative freelancers and generally more intuitive.</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="font-semibold text-slate-900 mb-1">If you need contracts + invoicing without the CRM → Bonsai</p>
              <p className="text-sm text-slate-600">Bonsai strips out the CRM and scheduling, keeping contracts, time tracking, and invoicing. Better for freelancers who don&apos;t need a full client management system.</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="font-semibold text-slate-900 mb-1">If you want free basic invoicing → Wave</p>
              <p className="text-sm text-slate-600">Wave is genuinely free for invoicing and bookkeeping. No automated follow-up, but zero cost for the basics.</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="bg-indigo-600 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Stop chasing. Start getting paid.</h2>
          <p className="text-indigo-200 mb-6 max-w-sm mx-auto">
            Chase follows up on unpaid invoices automatically — so you never have to write another &quot;just checking in&quot; email.
          </p>
          <Link href="/signup" className="inline-flex items-center gap-2 bg-white text-indigo-700 font-semibold px-6 py-3 rounded-xl hover:bg-indigo-50 transition-colors">
            Start free — no credit card →
          </Link>
          <p className="text-indigo-300 text-xs mt-3">Free plan available. Pro at $19/mo.</p>
        </div>

        {/* Related links */}
        <div className="mt-12 pt-8 border-t border-slate-200">
          <p className="text-sm font-semibold text-slate-700 mb-4">More comparisons</p>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/alternatives/honeybook" className="text-sm text-indigo-600 hover:underline">HoneyBook alternatives →</Link>
            <Link href="/alternatives/bonsai" className="text-sm text-indigo-600 hover:underline">Bonsai alternatives →</Link>
            <Link href="/vs/freshbooks" className="text-sm text-indigo-600 hover:underline">Chase vs FreshBooks →</Link>
            <Link href="/vs/wave" className="text-sm text-indigo-600 hover:underline">Chase vs Wave →</Link>
          </div>
        </div>
      </article>

      {/* Footer */}
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
