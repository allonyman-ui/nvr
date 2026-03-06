import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '5 Best HoneyBook Alternatives for Freelancers (2026) — Chase vs HoneyBook',
  description:
    "HoneyBook is great for studios and agencies — but if you're a solo freelancer who mainly needs invoice follow-up, it's expensive overkill. Here are 5 focused alternatives.",
  keywords: [
    'HoneyBook alternatives',
    'HoneyBook alternative for freelancers',
    'alternatives to HoneyBook',
    'HoneyBook vs Chase',
    'cheaper HoneyBook alternative',
    'freelancer invoicing software',
    'HoneyBook competitor',
  ],
  openGraph: {
    title: '5 Best HoneyBook Alternatives for Freelancers (2026)',
    description:
      "HoneyBook is expensive overkill for solo freelancers. Here are 5 focused alternatives that actually get you paid.",
    url: 'https://chase.allonys.com/alternatives/honeybook',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '5 Best HoneyBook Alternatives for Freelancers (2026)',
    description: 'Better HoneyBook alternatives for freelancers who just need invoice follow-up.',
  },
  alternates: {
    canonical: 'https://chase.allonys.com/alternatives/honeybook',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Chase',
  applicationCategory: 'BusinessApplication',
  url: 'https://chase.allonys.com',
  description:
    'Chase is a focused invoice follow-up tool for freelancers — a leaner, more affordable HoneyBook alternative.',
  offers: [
    { '@type': 'Offer', name: 'Free', price: '0', priceCurrency: 'USD' },
    { '@type': 'Offer', name: 'Pro', price: '19', priceCurrency: 'USD' },
  ],
}

const comparisonRows = [
  { feature: 'Invoice follow-up automation', chase: true, honeybook: true },
  { feature: 'Stripe payment links on invoices', chase: true, honeybook: false },
  { feature: 'Automatic payment detection', chase: true, honeybook: false },
  { feature: 'Client CRM', chase: 'Basic', honeybook: true },
  { feature: 'Contract management', chase: false, honeybook: true },
  { feature: 'Scheduling / booking', chase: false, honeybook: true },
  { feature: 'Project pipeline view', chase: false, honeybook: true },
  { feature: 'Questionnaire / lead forms', chase: false, honeybook: true },
  { feature: 'Starting price (per month)', chase: 'Free', honeybook: '$16' },
  { feature: 'Full-featured plan', chase: '$19/mo', honeybook: '$66/mo' },
  { feature: 'Setup time', chase: '5 minutes', honeybook: '2–4 hours' },
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
      'Chase does one thing exceptionally well: it automatically follows up on unpaid invoices. Connect Stripe, send an invoice, and Chase monitors it — sending the right email at day 3, 7, and 14, then stopping when your client pays. Zero manual effort.',
    pros: [
      'Automated follow-up that actually works',
      'Stripe payment links on every invoice',
      'Detects payments automatically',
      'Free tier for up to 3 invoices',
      'Set up in under 5 minutes',
    ],
    cons: [
      'No contract management',
      'No scheduling/booking features',
      'Simpler client CRM than HoneyBook',
    ],
    cta: true,
  },
  {
    rank: 2,
    name: 'FreshBooks',
    tagline: 'Best for: full-featured accounting',
    price: '$19–$55/mo',
    summary:
      'FreshBooks is a mature accounting platform with invoicing, expenses, time tracking, and reports. More powerful than HoneyBook for financial management, but heavier and more expensive. Invoice reminders are manual — there is no automated sequence.',
    pros: ['Strong accounting features', 'Time tracking built in', 'Solid mobile app'],
    cons: [
      'No automated follow-up sequences',
      'Starts at $19/mo (limited clients)',
      'More complex than most freelancers need',
    ],
    cta: false,
  },
  {
    rank: 3,
    name: 'Wave',
    tagline: 'Best for: free basic invoicing',
    price: 'Free (payments add-on extra)',
    summary:
      'Wave offers free invoicing and accounting, which makes it popular with new freelancers. Invoice reminders exist but are manual, and the follow-up experience is basic. Payments via Wave carry a transaction fee.',
    pros: ['Free invoicing and accounting', 'Good for simple bookkeeping', 'No subscription fee'],
    cons: [
      'No automated follow-up sequences',
      'Payment processing fees (2.9% + $0.60)',
      'Limited automation across the board',
    ],
    cta: false,
  },
  {
    rank: 4,
    name: 'Bonsai',
    tagline: 'Best for: contracts + invoicing bundle',
    price: '$21–$66/mo',
    summary:
      'Bonsai is very similar to HoneyBook — it bundles contracts, proposals, invoicing, and client management into one platform. A solid all-in-one option, but at a similar price point and with similarly basic invoice reminders.',
    pros: ['Good contract + invoice bundle', 'Clean UI', 'Time tracking included'],
    cons: [
      'Similar price to HoneyBook ($21+)',
      'No automated follow-up sequences',
      'Overkill if you mainly need payment collection',
    ],
    cta: false,
  },
  {
    rank: 5,
    name: 'Invoice Ninja',
    tagline: 'Best for: open-source / self-hosted',
    price: 'Free (self-hosted) / $10/mo hosted',
    summary:
      'Invoice Ninja is a powerful open-source invoicing platform. The free tier is generous, and it can be self-hosted for full control. Invoice reminders are supported but require manual configuration. Best for technical freelancers who want customisation.',
    pros: ['Free open-source version', 'Highly customisable', 'Self-hosted option'],
    cons: [
      'Setup is complex',
      'Reminders require manual configuration',
      'UI is dated compared to modern tools',
    ],
    cta: false,
  },
]

export default function HoneybookAlternativesPage() {
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
              HoneyBook Alternatives
            </p>
            <h1 className="text-4xl font-bold text-slate-900 tracking-tight leading-tight mb-5">
              5 Best HoneyBook Alternatives for Freelancers Who Just Need Invoice Follow-Up
            </h1>
            <p className="text-xl text-slate-500 leading-relaxed">
              HoneyBook is a great platform — if you need contracts, questionnaires, a booking
              calendar, and a full CRM. But if you are a solo freelancer whose main problem is{' '}
              <em>getting paid on time</em>, you are paying $66/month for features you will
              never use. Here are five better-targeted alternatives.
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 py-14">

          {/* Why leave HoneyBook */}
          <div className="max-w-3xl mb-14">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Why freelancers look for HoneyBook alternatives
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              HoneyBook is a polished, well-designed platform. Its target customer is a
              boutique agency, wedding photographer, or event planner who needs to manage leads,
              send proposals, collect signatures, and schedule sessions — all in one place.
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              For that use case, it is excellent. But for the average independent freelancer —
              a developer, writer, designer, or consultant — the feature set is vastly more
              than what is needed. You end up paying $36–66/month for a sophisticated CRM when
              all you really needed was for the invoice you sent two weeks ago to get paid.
            </p>
            <div className="grid sm:grid-cols-3 gap-4 mt-6">
              {[
                { label: 'HoneyBook Starter', price: '$16/mo', note: 'Very limited features' },
                { label: 'HoneyBook Essentials', price: '$36/mo', note: 'Most common plan' },
                { label: 'HoneyBook Premium', price: '$66/mo', note: 'Full feature set' },
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
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Chase vs HoneyBook — feature comparison</h2>
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-indigo-600 text-white">
                    <th className="text-left px-6 py-4 font-semibold w-1/2">Feature</th>
                    <th className="text-center px-4 py-4 font-semibold">Chase</th>
                    <th className="text-center px-4 py-4 font-semibold">HoneyBook</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row, i) => (
                    <tr
                      key={row.feature}
                      className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}
                    >
                      <td className="px-6 py-3.5 text-slate-700 font-medium">{row.feature}</td>
                      <td className="px-4 py-3.5 text-center">
                        <CellValue value={row.chase} />
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <CellValue value={row.honeybook} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* The alternatives */}
          <h2 className="text-2xl font-bold text-slate-900 mb-8">The 5 best HoneyBook alternatives</h2>
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
                    <p className="text-sm text-slate-400 uppercase tracking-wide text-xs font-semibold mb-0.5">Pricing</p>
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
              Chase is the best HoneyBook alternative if...
            </h2>
            <ul className="space-y-3">
              {[
                'You are a solo freelancer, not a studio or agency',
                "Your main problem is getting paid on time — not managing a full CRM",
                'You want invoice follow-up to happen automatically without manual effort',
                'You use Stripe (or want to) and want payment links on every invoice',
                'You want to pay $0–19/month instead of $36–66/month',
                "You do not need contract management, lead pipelines, or booking calendars",
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
              Get paid faster, for $19/month less
            </h2>
            <p className="text-slate-400 mb-7 max-w-md mx-auto">
              Chase automates your invoice follow-up sequence. You send the invoice — Chase
              handles the rest. Free for your first 3 invoices.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-indigo-600 text-white font-semibold px-7 py-3.5 rounded-xl hover:bg-indigo-500 transition-colors text-base"
            >
              Start free — no card required →
            </Link>
            <p className="text-slate-500 text-sm mt-4">Takes 5 minutes to set up.</p>
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
