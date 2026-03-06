import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '5 Best Bonsai Alternatives for Freelancers (2026) — Chase vs Bonsai',
  description:
    "Bonsai bundles contracts, time tracking, and invoicing — but if you mainly need automated invoice follow-up, it's expensive overkill. Here are 5 focused Bonsai alternatives.",
  keywords: [
    'Bonsai alternatives',
    'Bonsai alternative freelancer',
    'alternatives to Bonsai',
    'Bonsai vs Chase',
    'cheaper Bonsai alternative',
    'freelancer invoicing software',
    'Bonsai competitor',
    'Bonsai app alternative',
  ],
  openGraph: {
    title: '5 Best Bonsai Alternatives for Freelancers (2026)',
    description:
      'Bonsai is expensive overkill if you mainly need invoice follow-up. Here are 5 better-targeted alternatives.',
    url: 'https://chase.allonys.com/alternatives/bonsai',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '5 Best Bonsai Alternatives for Freelancers (2026)',
    description: 'Better Bonsai alternatives for freelancers who mainly need to get paid on time.',
  },
  alternates: {
    canonical: 'https://chase.allonys.com/alternatives/bonsai',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Chase',
  applicationCategory: 'BusinessApplication',
  url: 'https://chase.allonys.com',
  description:
    'Chase is a focused invoice follow-up tool for freelancers — a leaner, more affordable Bonsai alternative.',
  offers: [
    { '@type': 'Offer', name: 'Free', price: '0', priceCurrency: 'USD' },
    { '@type': 'Offer', name: 'Pro', price: '19', priceCurrency: 'USD' },
  ],
}

const comparisonRows = [
  { feature: 'Invoice follow-up automation', chase: true, bonsai: 'Basic' },
  { feature: 'Stripe payment links on invoices', chase: true, bonsai: false },
  { feature: 'Automatic payment detection', chase: true, bonsai: false },
  { feature: 'Contract management', chase: false, bonsai: true },
  { feature: 'Proposal creation', chase: false, bonsai: true },
  { feature: 'Time tracking', chase: false, bonsai: true },
  { feature: 'Client portal', chase: false, bonsai: true },
  { feature: 'Expense tracking', chase: false, bonsai: true },
  { feature: 'Starting price (per month)', chase: 'Free', bonsai: '$21' },
  { feature: 'Full-featured plan', chase: '$19/mo', bonsai: '$66/mo' },
  { feature: 'Setup time', chase: '5 minutes', bonsai: '2–3 hours' },
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

const alternatives = [
  {
    rank: 1,
    name: 'Chase',
    tagline: 'Best for: automated invoice follow-up',
    price: 'Free → $19/mo',
    summary:
      'Chase is purpose-built for invoice follow-up. Connect Stripe, send an invoice, and Chase runs a five-step automated email sequence — stopping the moment your client pays. Zero admin. No contracts, no proposals, no pipeline — just invoices that get paid.',
    pros: [
      'Fully automated follow-up sequences',
      'Stripe payment links on every invoice',
      'Automatic payment detection',
      'Free tier (up to 3 invoices)',
      'Operational in under 5 minutes',
    ],
    cons: [
      'No contract or proposal management',
      'No time tracking',
      'Not an all-in-one platform',
    ],
    cta: true,
  },
  {
    rank: 2,
    name: 'HoneyBook',
    tagline: 'Best for: studios and agencies',
    price: '$16–$66/mo',
    summary:
      'HoneyBook is a close competitor to Bonsai, offering contracts, invoicing, booking, and CRM in one. It is well-designed and popular with photographers and creative studios. Invoice reminders require manual setup and lack the automation depth of a dedicated tool.',
    pros: ['Polished all-in-one experience', 'Strong template library', 'Good mobile app'],
    cons: [
      'No automated follow-up sequences',
      '$36–66/mo for most useful plans',
      'Overkill for solo freelancers',
    ],
    cta: false,
  },
  {
    rank: 3,
    name: 'FreshBooks',
    tagline: 'Best for: accounting + invoicing',
    price: '$19–$55/mo',
    summary:
      'FreshBooks is stronger than Bonsai on the accounting side — it has proper double-entry bookkeeping, expense tracking, and financial reporting. But it lacks automated follow-up sequences. Invoice reminders must be sent manually.',
    pros: ['Full accounting features', 'Good expense tracking', 'Solid reporting'],
    cons: [
      'Manual invoice reminders only',
      'More expensive as client count grows',
      'Heavier than most freelancers need',
    ],
    cta: false,
  },
  {
    rank: 4,
    name: 'Wave',
    tagline: 'Best for: free basic invoicing',
    price: 'Free',
    summary:
      'Wave is free invoicing and accounting software. It is significantly cheaper than Bonsai and handles the basics well. Invoice reminders are manual and basic. The free pricing is hard to argue with for freelancers just starting out.',
    pros: ['Completely free invoicing', 'Accounting included', 'Simple to use'],
    cons: [
      'No automated follow-up',
      'Payment processing fees',
      'Limited customer support',
    ],
    cta: false,
  },
  {
    rank: 5,
    name: 'Dubsado',
    tagline: 'Best for: workflow automation for agencies',
    price: '$20–$40/mo',
    summary:
      'Dubsado is another Bonsai competitor with a strong automation engine. You can build complex workflows that trigger emails, contracts, and invoices based on client actions. More powerful than Bonsai for automation — but also more complex to set up, with a steep learning curve.',
    pros: ['Powerful workflow automation', 'Canned emails and templates', 'Good for agencies'],
    cons: [
      'Steep learning curve (weeks to configure)',
      'Not focused on invoice follow-up specifically',
      'Overkill for solo freelancers',
    ],
    cta: false,
  },
]

export default function BonsaiAlternativesPage() {
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
              Bonsai Alternatives
            </p>
            <h1 className="text-4xl font-bold text-slate-900 tracking-tight leading-tight mb-5">
              5 Best Bonsai Alternatives for Freelancers Who Just Need Invoice Follow-Up
            </h1>
            <p className="text-xl text-slate-500 leading-relaxed">
              Bonsai is a capable platform — if you need contracts, proposals, time tracking, and
              a full client portal. But if your primary goal is getting invoices paid on time,
              you are paying for a lot of features you will never open. Here are five better-fit
              alternatives.
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 py-14">

          {/* Why people leave Bonsai */}
          <div className="max-w-3xl mb-14">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Why freelancers look for Bonsai alternatives
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Bonsai markets itself as an all-in-one freelancer OS. The pitch is compelling:
              one subscription covers contracts, proposals, invoices, time tracking, and client
              management. For the right freelancer — someone who was previously juggling five
              separate tools — it is genuinely useful.
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              The problem comes when you sign up for &ldquo;everything&rdquo; and realise you
              actually only use two features: creating invoices and sending them to clients.
              The rest of the platform sits unused, and you are paying $21–66/month for it.
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              More specifically: <strong>Bonsai&rsquo;s invoice follow-up is basic</strong>. You
              can set a payment reminder, but it is a single email — not a proper escalating
              sequence that stops when the client pays. For freelancers who want automated
              payment recovery, Bonsai is not built for it.
            </p>
            <div className="grid sm:grid-cols-3 gap-4 mt-6">
              {[
                { label: 'Bonsai Starter', price: '$21/mo', note: 'Limited clients' },
                { label: 'Bonsai Professional', price: '$32/mo', note: 'Most popular' },
                { label: 'Bonsai Business', price: '$66/mo', note: 'Full features' },
              ].map((item) => (
                <div key={item.label} className="border border-slate-200 rounded-xl p-4 text-center">
                  <p className="text-sm font-semibold text-slate-700 mb-1">{item.label}</p>
                  <p className="text-2xl font-bold text-slate-900">{item.price}</p>
                  <p className="text-xs text-slate-400 mt-1">{item.note}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Comparison table */}
          <div className="mb-14">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Chase vs Bonsai — feature comparison</h2>
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-indigo-600 text-white">
                    <th className="text-left px-6 py-4 font-semibold w-1/2">Feature</th>
                    <th className="text-center px-4 py-4 font-semibold">Chase</th>
                    <th className="text-center px-4 py-4 font-semibold">Bonsai</th>
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
                        <CellValue value={row.bonsai} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Alternatives list */}
          <h2 className="text-2xl font-bold text-slate-900 mb-8">The 5 best Bonsai alternatives</h2>
          <div className="space-y-8 mb-14">
            {alternatives.map((alt) => (
              <div
                key={alt.name}
                className={`border rounded-2xl p-7 ${alt.cta ? 'border-indigo-200 bg-indigo-50/30' : 'border-slate-200'}`}
              >
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="bg-indigo-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                        {alt.rank}
                      </span>
                      <h3 className="text-xl font-bold text-slate-900">{alt.name}</h3>
                      {alt.cta && (
                        <span className="bg-indigo-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                          Best pick
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-indigo-600 font-medium">{alt.tagline}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400 uppercase tracking-wide font-semibold mb-0.5">Pricing</p>
                    <p className="font-bold text-slate-900">{alt.price}</p>
                  </div>
                </div>

                <p className="text-slate-600 leading-relaxed mb-5">{alt.summary}</p>

                <div className="grid sm:grid-cols-2 gap-4 mb-5">
                  <div>
                    <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-2">Pros</p>
                    <ul className="space-y-1.5">
                      {alt.pros.map((pro) => (
                        <li key={pro} className="flex items-start gap-2 text-sm text-slate-700">
                          <span className="text-emerald-500 mt-0.5 shrink-0">✓</span>
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-red-500 uppercase tracking-wide mb-2">Cons</p>
                    <ul className="space-y-1.5">
                      {alt.cons.map((con) => (
                        <li key={con} className="flex items-start gap-2 text-sm text-slate-700">
                          <span className="text-red-400 mt-0.5 shrink-0">✕</span>
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {alt.cta && (
                  <Link
                    href="/signup"
                    className="inline-flex items-center gap-2 bg-indigo-600 text-white font-semibold px-5 py-2.5 rounded-lg text-sm hover:bg-indigo-700 transition-colors"
                  >
                    Try Chase free — no card required →
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Best for section */}
          <div className="border border-indigo-200 bg-indigo-50 rounded-2xl p-8 mb-14">
            <h2 className="text-2xl font-bold text-indigo-900 mb-5">
              Chase is the best Bonsai alternative if...
            </h2>
            <ul className="space-y-3">
              {[
                "You mainly use Bonsai for invoicing — not contracts or proposals",
                'You are tired of manually chasing clients for payment',
                'You want invoice follow-up to run automatically without any admin',
                'You use or want to use Stripe for payments',
                'You want to pay $0–19/month instead of $21–66/month',
                "You do not need time tracking or a full client portal",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-indigo-800">
                  <span className="text-indigo-500 font-bold mt-0.5 shrink-0">→</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Bottom CTA */}
          <div className="bg-slate-900 rounded-2xl p-10 text-center">
            <h2 className="text-3xl font-bold text-white mb-3">
              Stop paying for features you never use
            </h2>
            <p className="text-slate-400 mb-7 max-w-md mx-auto">
              Chase costs $0–19/month and does one thing exceptionally well: makes sure your
              invoices get paid on time, automatically. Try it free.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-indigo-600 text-white font-semibold px-7 py-3.5 rounded-xl hover:bg-indigo-500 transition-colors text-base"
            >
              Start free — no card required →
            </Link>
            <p className="text-slate-500 text-sm mt-4">Takes 5 minutes to set up. Free for 3 invoices.</p>
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
