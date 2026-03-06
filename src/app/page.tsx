import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import ExitIntentPopup from '@/components/ExitIntentPopup'
import LiveActivityNotification from '@/components/LiveActivityNotification'
import StickyCTA from '@/components/StickyCTA'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect('/dashboard')

  // ── JSON-LD structured data ──
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        '@id': 'https://chase.allonys.com/#app',
        name: 'Chase',
        url: 'https://chase.allonys.com',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        description:
          'Chase automatically follows up on unpaid invoices so freelancers never have to write another "just checking in" email. Connect Stripe, send invoices, Chase handles the rest.',
        offers: [
          {
            '@type': 'Offer',
            name: 'Free Plan',
            price: '0',
            priceCurrency: 'USD',
            description: 'Up to 3 active invoices with automatic follow-up sequences.',
          },
          {
            '@type': 'Offer',
            name: 'Pro Plan',
            price: '19',
            priceCurrency: 'USD',
            priceSpecification: {
              '@type': 'UnitPriceSpecification',
              price: '19',
              priceCurrency: 'USD',
              billingDuration: 'P1M',
            },
            description: 'Unlimited invoices, automatic follow-up sequences, custom email templates, and priority support.',
          },
        ],
        featureList: [
          'Automated invoice follow-up emails',
          'Stripe payment links on every invoice',
          'Customizable email templates',
          'Automatic payment detection',
          'Daily invoice monitoring',
          'Freelancer client management',
        ],
      },
      {
        '@type': 'Organization',
        '@id': 'https://chase.allonys.com/#org',
        name: 'Chase',
        url: 'https://chase.allonys.com',
        logo: 'https://chase.allonys.com/favicon.svg',
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer support',
          email: 'hello@chase.allonys.com',
        },
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://chase.allonys.com/#faq',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What exactly is Chase?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Chase is an invoice management tool for freelancers that automatically follows up on unpaid invoices via email. You create an invoice, Chase sends it to your client with a Stripe payment link, and if it goes unpaid, Chase sends professional follow-up emails at set intervals until your client pays — then stops the moment payment arrives.',
            },
          },
          {
            '@type': 'Question',
            name: 'Do my clients need to sign up or create an account?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'No. Your clients don\'t need to create any accounts or install anything. They receive a professional email with a Stripe payment link and can pay by card, Apple Pay, or Google Pay in under 60 seconds.',
            },
          },
          {
            '@type': 'Question',
            name: 'What fees does Chase charge?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'The Free plan is $0/month with up to 3 invoices. The Pro plan is $19/month with a 14-day free trial. The Success Fee plan charges 5% of each invoice Chase recovers — only when you actually get paid. Stripe\'s standard processing fee (2.9% + 30¢ per transaction) applies separately.',
            },
          },
          {
            '@type': 'Question',
            name: 'How long does setup take?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Most users send their first invoice within 5 minutes of signing up. You create your account, connect Stripe, add your first client, create an invoice, and you\'re live. Chase handles everything else automatically.',
            },
          },
          {
            '@type': 'Question',
            name: 'Can I customize the follow-up emails?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes, completely. Chase comes with professional default templates for each follow-up stage (day 3, day 7, day 14), but you can edit every single one. Adjust the tone, add specific payment instructions, or completely rewrite them.',
            },
          },
          {
            '@type': 'Question',
            name: 'Does Chase work internationally?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Chase works in any country where Stripe is supported — which covers 47+ countries including the US, UK, EU, Canada, Australia, Singapore, and more. Invoices can be denominated in any currency Stripe supports.',
            },
          },
        ],
      },
    ],
  }

  return (
    <div className="bg-[#09090b]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── NAVBAR ── */}
      <nav className="sticky top-0 z-50 bg-[#09090b]/95 backdrop-blur border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">C</span>
            </div>
            <span className="text-white font-semibold text-sm tracking-tight">Chase</span>
          </Link>
          <div className="hidden md:flex items-center gap-7">
            <a href="#how-it-works" className="text-white/50 hover:text-white/80 text-sm transition-colors">How it works</a>
            <a href="#features" className="text-white/50 hover:text-white/80 text-sm transition-colors">Features</a>
            <a href="#pricing" className="text-white/50 hover:text-white/80 text-sm transition-colors">Pricing</a>
            <a href="#faq" className="text-white/50 hover:text-white/80 text-sm transition-colors">FAQ</a>
            <Link href="/blog" className="text-white/50 hover:text-white/80 text-sm transition-colors">Blog</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-white/60 hover:text-white text-sm transition-colors">Log in</Link>
            <Link href="/signup" className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors whitespace-nowrap">
              Start free →
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="mkt-hero-bg pt-20 pb-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left: Copy */}
            <div>
              {/* Stripe partner badge — hero */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <div className="inline-flex items-center gap-2 rounded-xl px-3.5 py-2 border" style={{ background: 'rgba(99,91,255,0.08)', borderColor: 'rgba(99,91,255,0.25)' }}>
                  <svg width="52" height="22" viewBox="0 0 52 22" fill="#635bff" aria-label="Stripe">
                    <path d="M5 8.2C5 7.4 5.7 7 6.7 7C8.2 7 10 7.5 11.5 8.3V5.2C10 4.5 8.5 4.2 7 4.2C3.5 4.2 1 6.1 1 9C1 13.5 7.3 12.7 7.3 14.8C7.3 15.7 6.5 16.2 5.4 16.2C3.8 16.2 1.8 15.5 0.2 14.7V17.9C1.9 18.7 3.6 19 5.4 19C9.2 19 12 17.2 12 14.2C12 9.4 5 10.4 5 8.2Z"/>
                    <path d="M26.2 10.8C26.2 7 24.1 4 20.2 4C16.3 4 13.8 7 13.8 10.8C13.8 15.3 16.5 18.5 20.7 18.5C22.6 18.5 24.1 18 25.4 17V13.5C24.1 14.4 22.7 15 21.1 15C19.5 15 18.1 14.3 17.8 12.5H26.2C26.2 12.3 26.2 11.4 26.2 10.8ZM17.8 9.3C18.1 7.5 19.2 6.7 20.5 6.7C21.8 6.7 22.8 7.5 23 9.3H17.8Z"/>
                    <path d="M35 4C33.3 4 32.2 4.9 31.7 5.5L31.5 4.3H27.8V22L32.2 21V15.5C32.8 16 34 16.7 35.2 16.7C38.4 16.7 41.3 14.2 41.3 10.2C41.3 6.1 38.4 4 35 4ZM34 13.2C33 13.2 32.5 12.8 32.1 12.4V7.7C32.5 7.2 33.1 6.9 34 6.9C35.6 6.9 36.7 8.7 36.7 10.1C36.7 11.5 35.6 13.2 34 13.2Z"/>
                    <path d="M43 18.5H47V4.5H43V18.5Z"/>
                    <path d="M47 2.5C47 1.1 45.8 0 44.5 0C43.2 0 42 1.1 42 2.5C42 3.9 43.2 5 44.5 5C45.8 5 47 3.9 47 2.5Z"/>
                    <path d="M49 7V4.5H45.8C47 5.2 48 6.5 48.5 8H49V7Z"/>
                  </svg>
                  <span style={{ color: '#635bff' }} className="text-xs font-bold">Verified Partner</span>
                </div>
                <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs rounded-xl px-3 py-2">
                  <span>📊</span>
                  85% of freelancers get paid late
                </div>
              </div>

              <h1 className="text-5xl sm:text-[3.4rem] font-bold text-white leading-[1.06] tracking-tight mb-5">
                Stop chasing.<br />
                <span className="text-indigo-400">Start getting paid.</span>
              </h1>

              <p className="text-[1.0625rem] text-white/55 leading-relaxed mb-8 max-w-[440px]">
                Chase sends automatic, professional follow-up emails when invoices go unpaid — and stops the moment your client pays. The average freelancer saves <strong className="text-white/70">4+ hours every week</strong> on manual chasing.
              </p>

              {/* Free trial callout */}
              <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-xl px-5 py-4 mb-8 max-w-[440px]">
                <div className="flex items-start gap-3">
                  <span className="text-xl mt-0.5">🎁</span>
                  <div>
                    <p className="text-indigo-300 font-semibold text-sm mb-0.5">14-day free trial — no credit card required</p>
                    <p className="text-indigo-200/50 text-sm">Full Pro access. Cancel anytime, no questions asked.</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <Link href="/signup" className="btn-mkt-primary">
                  Start free trial →
                </Link>
                <a href="#how-it-works" className="btn-mkt-ghost">
                  See how it works
                </a>
              </div>

              {/* Hero trust micro-strip */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                {/* Powered by Stripe badge */}
                <div className="flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <rect width="14" height="14" rx="3" fill="#635bff"/>
                    <path d="M7 3.5C8.2 3.5 8.9 4.1 8.9 5C8.9 5.7 8.4 6.2 7.6 6.5C8.6 6.8 9.2 7.4 9.2 8.3C9.2 9.4 8.3 10.1 6.9 10.1C6.1 10.1 5.3 9.8 4.8 9.3L5.4 8.5C5.8 8.9 6.3 9.1 6.9 9.1C7.7 9.1 8.1 8.8 8.1 8.2C8.1 7.6 7.6 7.3 6.7 7.3H6.1V6.3H6.7C7.5 6.3 7.9 6 7.9 5.4C7.9 4.9 7.5 4.6 6.9 4.6C6.4 4.6 5.9 4.8 5.5 5.2L4.9 4.4C5.4 3.8 6.2 3.5 7 3.5Z" fill="white"/>
                  </svg>
                  <span className="text-white/40 text-xs font-medium">Powered by Stripe</span>
                </div>
                <span className="text-white/15 text-xs">·</span>
                <div className="flex items-center gap-1.5 text-white/30">
                  <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <span className="text-xs">SSL secured</span>
                </div>
                <span className="text-white/15 text-xs">·</span>
                <span className="text-white/30 text-xs">Cancel anytime</span>
              </div>
            </div>

            {/* Right: Dashboard mockup */}
            <div className="relative">
              <div className="absolute -inset-6 bg-indigo-500/8 rounded-3xl blur-2xl pointer-events-none" />
              <div className="relative bg-[#0f0f12] border border-white/[0.08] rounded-2xl shadow-[0_0_80px_rgba(0,0,0,0.6)] overflow-hidden">

                {/* Window chrome */}
                <div className="flex items-center gap-1.5 px-4 pt-3.5 pb-2.5 border-b border-white/[0.05]">
                  <div className="w-2.5 h-2.5 rounded-full bg-white/[0.12]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/[0.12]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/[0.12]" />
                  <div className="flex-1 flex justify-center">
                    <div className="bg-white/[0.05] rounded-md px-8 py-1 text-white/20 text-[10px] font-mono tracking-tight">app.getchase.io/dashboard</div>
                  </div>
                </div>

                {/* Dashboard header */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.05]">
                  <div>
                    <p className="text-white/80 text-sm font-semibold">Invoice Dashboard</p>
                    <p className="text-white/25 text-xs">3 invoices · 2 being chased</p>
                  </div>
                  <div className="bg-indigo-600 text-white text-xs font-medium px-3 py-1 rounded-md">+ New invoice</div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 divide-x divide-white/[0.04] border-b border-white/[0.04]">
                  {[
                    { label: 'Outstanding', value: '$9,550', sub: '2 invoices', color: 'text-white' },
                    { label: 'Recovered', value: '$4,500', sub: 'this month', color: 'text-emerald-400' },
                    { label: 'Hours saved', value: '6 hrs', sub: 'on follow-ups', color: 'text-indigo-400' },
                  ].map((s) => (
                    <div key={s.label} className="px-4 py-3">
                      <p className="text-white/25 text-[9px] uppercase tracking-widest mb-1">{s.label}</p>
                      <p className={`text-sm font-bold ${s.color}`}>{s.value}</p>
                      <p className="text-white/25 text-[10px]">{s.sub}</p>
                    </div>
                  ))}
                </div>

                {/* Invoice list */}
                <div className="divide-y divide-white/[0.04]">
                  {[
                    {
                      client: 'Acme Corp',
                      amount: '$3,200',
                      status: 'Chasing',
                      statusClass: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
                      note: 'Day 7 — 2nd follow-up sent',
                      icon: '📨',
                    },
                    {
                      client: 'Studio Nine',
                      amount: '$1,850',
                      status: 'Sent',
                      statusClass: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
                      note: 'Next follow-up in 3 days',
                      icon: '⏳',
                    },
                    {
                      client: 'Bright Media',
                      amount: '$4,500',
                      status: 'Paid ✓',
                      statusClass: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
                      note: 'Paid 1 day after follow-up',
                      icon: '💰',
                    },
                  ].map((inv) => (
                    <div key={inv.client} className="px-5 py-3.5 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-sm shrink-0">{inv.icon}</span>
                        <div className="min-w-0">
                          <p className="text-white/75 text-sm font-medium truncate">{inv.client}</p>
                          <p className="text-white/25 text-[10px]">{inv.note}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5 shrink-0">
                        <span className="text-white/60 text-sm font-medium">{inv.amount}</span>
                        <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full border whitespace-nowrap ${inv.statusClass}`}>
                          {inv.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chase sequence timeline */}
                <div className="px-5 py-3.5 bg-white/[0.015] border-t border-white/[0.05]">
                  <p className="text-white/25 text-[9px] uppercase tracking-widest mb-3">Acme Corp — automatic chase sequence</p>
                  <div className="flex items-center">
                    {[
                      { label: 'Sent', done: true, active: false },
                      { label: 'Day 3', done: true, active: false },
                      { label: 'Day 7', done: true, active: true },
                      { label: 'Day 14', done: false, active: false },
                      { label: '✓ Paid', done: false, active: false },
                    ].map((step, i, arr) => (
                      <div key={i} className="flex items-center">
                        <div className="flex flex-col items-center gap-1.5">
                          <div className={`w-1.5 h-1.5 rounded-full ${step.active ? 'bg-indigo-400 ring-2 ring-indigo-400/30 ring-offset-1 ring-offset-[#0f0f12]' : step.done ? 'bg-indigo-600' : 'bg-white/10'}`} />
                          <span className={`text-[8px] whitespace-nowrap ${step.active ? 'text-indigo-400' : step.done ? 'text-white/35' : 'text-white/15'}`}>{step.label}</span>
                        </div>
                        {i < arr.length - 1 && (
                          <div className={`w-8 h-px mb-5 ${step.done && !step.active ? 'bg-indigo-800' : 'bg-white/[0.07]'}`} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom bar */}
                <div className="px-5 py-2.5 border-t border-white/[0.05] flex items-center justify-between">
                  <span className="text-white/20 text-[10px]">Chase runs automatically every day at 8am</span>
                  <span className="text-emerald-400 text-[10px] font-medium flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                    Live
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF BAR ── */}
      <section className="bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            {[
              { value: '85%', label: 'of freelancers get paid late — Chase automates recovery' },
              { value: '39 days', label: 'average wait for payment. Chase cuts that dramatically' },
              { value: '4+ hrs', label: 'saved per week on manual follow-up emails' },
              { value: '$0', label: 'to start — free plan, no card required' },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">{s.value}</p>
                <p className="text-sm text-slate-500 mt-1.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST STRIP ── */}
      <section className="bg-white border-b border-slate-100 py-5 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">

            {/* Powered by Stripe — HERO badge */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-[#635bff]/8 border border-[#635bff]/20 rounded-xl px-4 py-2.5">
                {/* Stripe wordmark SVG */}
                <svg width="44" height="18" viewBox="0 0 44 18" fill="none" aria-label="Stripe">
                  <path d="M4.5 6.8C4.5 6.1 5.1 5.8 6 5.8C7.3 5.8 8.9 6.2 10.2 6.9V3.4C8.8 2.8 7.4 2.6 6 2.6C2.7 2.6 0.5 4.3 0.5 6.9C0.5 11.1 6.3 10.4 6.3 12.2C6.3 13 5.6 13.4 4.6 13.4C3.2 13.4 1.4 12.8 0 12V15.6C1.6 16.3 3.2 16.6 4.6 16.6C7.9 16.6 10.3 15 10.3 12.2C10.3 7.7 4.5 8.6 4.5 6.8Z" fill="#635bff"/>
                  <path d="M22.7 9.3C22.7 5.6 20.8 2.6 17.2 2.6C13.6 2.6 11.4 5.6 11.4 9.3C11.4 13.6 13.8 16.4 17.5 16.4C19.2 16.4 20.6 16 21.8 15.1V11.9C20.6 12.7 19.3 13.2 17.8 13.2C16.3 13.2 15 12.6 14.7 10.9H22.7C22.7 10.7 22.7 9.9 22.7 9.3ZM14.7 7.9C15 6.3 16 5.6 17.2 5.6C18.4 5.6 19.3 6.3 19.5 7.9H14.7Z" fill="#635bff"/>
                  <path d="M30.1 2.6C28.6 2.6 27.6 3.3 27.1 3.8L26.9 2.8H23.6V20.6L27.4 19.8L27.4 15.2C27.9 15.6 28.8 16.2 30.1 16.2C32.8 16.2 35.2 14 35.2 9.3C35.2 4.9 32.8 2.6 30.1 2.6ZM29.2 13.1C28.4 13.1 27.9 12.8 27.5 12.5L27.5 6.4C27.9 6 28.5 5.7 29.2 5.7C30.6 5.7 31.6 7.3 31.6 9.4C31.6 11.6 30.6 13.1 29.2 13.1Z" fill="#635bff"/>
                  <path d="M36.5 16.2H40.3V2.8H36.5V16.2Z" fill="#635bff"/>
                  <path d="M40.3 0.8C40.3 -0.3 39.4 -1 38.3 -1C37.2 -1 36.4 -0.3 36.4 0.8C36.4 1.9 37.2 2.6 38.3 2.6C39.4 2.6 40.3 1.9 40.3 0.8Z" fill="#635bff"/>
                  <path d="M42.4 5.9V2.8H39.2C40.2 3.4 41.1 4.5 41.5 5.9H42.4Z" fill="#635bff"/>
                </svg>
                <span className="text-[#635bff] text-xs font-semibold">Verified Partner</span>
              </div>
            </div>

            <div className="w-px h-8 bg-slate-100 hidden sm:block" />

            {/* PCI DSS */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0">
                <svg width="14" height="14" fill="none" stroke="#059669" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-800 leading-tight">PCI DSS Compliant</p>
                <p className="text-[10px] text-slate-400">via Stripe infrastructure</p>
              </div>
            </div>

            <div className="w-px h-8 bg-slate-100 hidden sm:block" />

            {/* SSL encryption */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center flex-shrink-0">
                <svg width="14" height="14" fill="none" stroke="#6366f1" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-800 leading-tight">256-bit SSL Encrypted</p>
                <p className="text-[10px] text-slate-400">All data encrypted in transit</p>
              </div>
            </div>

            <div className="w-px h-8 bg-slate-100 hidden sm:block" />

            {/* Zero data selling */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center flex-shrink-0">
                <svg width="14" height="14" fill="none" stroke="#64748b" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-800 leading-tight">Privacy First</p>
                <p className="text-[10px] text-slate-400">Your data is never sold</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── STRIPE PARTNERSHIP ── */}
      <section className="bg-white py-20 px-6 border-t border-slate-100">
        <div className="max-w-6xl mx-auto">

          {/* Header badge */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2.5 bg-[#635bff]/8 border border-[#635bff]/20 rounded-full px-5 py-2 mb-10">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#635bff" strokeWidth="2">
                <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
              </svg>
              <span className="text-[#635bff] text-xs font-bold uppercase tracking-widest">Official Stripe Partner</span>
            </div>

            {/* HUGE Stripe Logo */}
            <div className="flex flex-col items-center gap-8 mb-10">
              {/* Stripe S mark — large */}
              <div className="flex items-center gap-5">
                <div
                  className="w-24 h-24 rounded-3xl shadow-xl flex items-center justify-center"
                  style={{ background: '#635bff' }}
                >
                  {/* Official Stripe S */}
                  <svg width="48" height="48" viewBox="0 0 60 60" fill="white">
                    <path d="M29.5 11C35.5 11 39.5 13.8 39.5 18.5C39.5 22.5 36.8 25 32.5 26.3C37.5 27.7 41 30.7 41 35.8C41 42 36.5 46 28.8 46C24.5 46 20.2 44.5 17 42L19.8 37.5C22.3 39.5 25 40.5 28.8 40.5C32.8 40.5 34.8 38.8 34.8 35.8C34.8 32.5 32.2 30.8 27.5 30.8H25V25.5H27.5C31.8 25.5 33.8 23.8 33.8 21.2C33.8 18.8 31.8 17.2 28.5 17.2C25.8 17.2 23 18.3 21 20L18.2 15.5C20.8 12.8 24.8 11 29.5 11Z"/>
                  </svg>
                </div>
                {/* Stripe wordmark */}
                <svg width="180" height="72" viewBox="0 0 180 72" fill="#635bff" aria-label="Stripe">
                  <path d="M18 28.2C18 25.5 20.2 24.5 23.8 24.5C29.2 24.5 36 26.3 41.5 29.3V13.8C35.5 11.3 29.5 10.5 23.8 10.5C10.8 10.5 2 17.3 2 29C2 48 27 44.5 27 52.5C27 55.8 24.3 56.8 20.5 56.8C14.5 56.8 7 54.3 1 50.8V66.5C7.5 69.3 14 70.5 20.5 70.5C33.5 70.5 43 63.8 43 51.8C43 31.3 18 35.3 18 28.2Z"/>
                  <path d="M93 27.5C93 18.3 88 10.5 76 10.5C64.2 10.5 57 18.3 57 40.5C57 66 65.8 70.5 76.5 70.5C83 70.5 87.8 69 92 66V52.5C87.8 55 83.3 56.8 77.8 56.8C72.3 56.8 67.5 54.5 66.8 47.3H93C93 46.5 93 42.5 93 40.5ZM67 36.5C67 29.5 70.5 27 75.8 27C81 27 84 29.5 84.3 36.5H67Z"/>
                  <path d="M125 10.5C118.8 10.5 115 13.5 113 15.5L112.3 11.3H98V93.5L113 91V54.8C115 56.5 119 58.5 125 58.5C137.3 58.5 148.3 49.3 148.3 34.3C148.3 18 137.3 10.5 125 10.5ZM121.3 45.5C118 45.5 116 44.3 114.5 43V24.5C116 22.8 118.3 21.5 121.3 21.5C127.5 21.5 131 26.3 131 33.5C131 41 127.5 45.5 121.3 45.5Z"/>
                  <path d="M152 69.5H167V11.3H152V69.5Z"/>
                  <path d="M167 4.5C167 0.5 163.8 -2 159.5 -2C155.2 -2 152 0.5 152 4.5C152 8.5 155.2 11 159.5 11C163.8 11 167 8.5 167 4.5Z"/>
                  <path d="M178 24.5V11.3H166C169.8 13.8 172.5 18.5 173.5 24.5H178Z"/>
                </svg>
              </div>

              <div className="max-w-2xl mx-auto text-center">
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-4">
                  Powered by Stripe.<br/>
                  <span style={{ color: '#635bff' }}>The world&apos;s most trusted payment infrastructure.</span>
                </h2>
                <p className="text-slate-500 text-lg leading-relaxed">
                  Chase is <strong className="text-slate-700">officially built on Stripe</strong> — the same payment technology that powers Amazon, Shopify, Airbnb, and millions of businesses worldwide.
                  Your clients&apos; payments move through <strong className="text-slate-700">bank-grade security</strong>. We never see or store card data.
                </p>
              </div>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto mb-10">
              {[
                { icon: '🔒', title: 'PCI DSS Level 1', sub: 'Highest payment security standard' },
                { icon: '🛡️', title: '256-bit SSL', sub: 'Bank-grade encryption' },
                { icon: '✅', title: 'SOC 2 Type II', sub: 'Verified by independent auditors' },
                { icon: '🌍', title: '135+ currencies', sub: '47+ countries supported' },
              ].map((b) => (
                <div key={b.title} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center">
                  <div className="text-2xl mb-2">{b.icon}</div>
                  <p className="font-bold text-slate-900 text-sm">{b.title}</p>
                  <p className="text-slate-400 text-xs mt-1">{b.sub}</p>
                </div>
              ))}
            </div>

            {/* Stripe checkout preview */}
            <div className="max-w-sm mx-auto">
              <div className="bg-white border-2 border-[#635bff]/20 rounded-2xl overflow-hidden shadow-xl">
                {/* Header */}
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-slate-900 font-bold text-sm">Invoice #INV-042</p>
                    <p className="text-slate-400 text-xs">From Jane Smith Studio</p>
                  </div>
                  <div className="text-2xl font-bold text-slate-900">$3,200</div>
                </div>
                {/* Payment methods */}
                <div className="px-5 py-4 space-y-3">
                  <div className="flex gap-2">
                    {['💳 Card', '🍎 Apple Pay', 'G Pay'].map((m) => (
                      <div key={m} className="flex-1 text-center text-xs border border-slate-200 rounded-lg py-2 font-medium text-slate-600">{m}</div>
                    ))}
                  </div>
                  <div className="h-9 bg-slate-100 rounded-lg" />
                  <div className="grid grid-cols-2 gap-2">
                    <div className="h-9 bg-slate-100 rounded-lg" />
                    <div className="h-9 bg-slate-100 rounded-lg" />
                  </div>
                  <div className="h-10 rounded-xl flex items-center justify-center font-bold text-white text-sm" style={{ background: '#635bff' }}>
                    Pay $3,200
                  </div>
                  <div className="flex items-center justify-center gap-1.5 pt-1">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                    </svg>
                    <span className="text-slate-300 text-[10px]">Secured by</span>
                    <svg width="28" height="11" viewBox="0 0 44 18" fill="#635bff">
                      <path d="M4.5 6.8C4.5 6.1 5.1 5.8 6 5.8C7.3 5.8 8.9 6.2 10.2 6.9V3.4C8.8 2.8 7.4 2.6 6 2.6C2.7 2.6 0.5 4.3 0.5 6.9C0.5 11.1 6.3 10.4 6.3 12.2C6.3 13 5.6 13.4 4.6 13.4C3.2 13.4 1.4 12.8 0 12V15.6C1.6 16.3 3.2 16.6 4.6 16.6C7.9 16.6 10.3 15 10.3 12.2C10.3 7.7 4.5 8.6 4.5 6.8Z"/>
                      <path d="M22.7 9.3C22.7 5.6 20.8 2.6 17.2 2.6C13.6 2.6 11.4 5.6 11.4 9.3C11.4 13.6 13.8 16.4 17.5 16.4C19.2 16.4 20.6 16 21.8 15.1V11.9C20.6 12.7 19.3 13.2 17.8 13.2C16.3 13.2 15 12.6 14.7 10.9H22.7C22.7 10.7 22.7 9.9 22.7 9.3ZM14.7 7.9C15 6.3 16 5.6 17.2 5.6C18.4 5.6 19.3 6.3 19.5 7.9H14.7Z"/>
                      <path d="M30.1 2.6C28.6 2.6 27.6 3.3 27.1 3.8L26.9 2.8H23.6V16.2H27.4V6.4C27.9 6 28.5 5.7 29.2 5.7C30.6 5.7 31.6 7.3 31.6 9.4C31.6 11.6 30.6 13.1 29.2 13.1C28.4 13.1 27.9 12.8 27.5 12.5"/>
                      <path d="M36.5 16.2H40.3V2.8H36.5V16.2Z"/>
                    </svg>
                  </div>
                </div>
              </div>
              <p className="text-slate-400 text-xs text-center mt-3">
                What your clients see — no account needed, pays in 60 seconds
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROBLEM ── */}
      <section className="bg-white py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl">
            <p className="text-indigo-600 text-sm font-semibold uppercase tracking-widest mb-4">The problem</p>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight leading-[1.1] mb-8">
              You did the work.<br />You sent the invoice.<br />Now you wait.
            </h2>
            <div className="space-y-4 text-lg text-slate-600 leading-relaxed">
              <p>
                Chasing payments is uncomfortable, time-consuming, and unprofessional. Most freelancers delay follow-ups because they don&rsquo;t want to seem pushy — and that delay costs real money.
              </p>
              <p>
                The average freelancer sends 3–5 manual follow-up emails per overdue invoice. That&rsquo;s hours of awkward writing, copy-pasting, and refreshing your inbox waiting to see if the client has paid. Every single week.
              </p>
            </div>

            <div className="mt-10 grid sm:grid-cols-3 gap-5">
              {[
                { stat: '85%', desc: 'of freelancers have experienced late invoice payments (Clockify 2025)' },
                { stat: '39 days', desc: 'average wait from invoice submission to payment — globally (Jobbers.io 2026)' },
                { stat: '4+ hrs', desc: 'average spent per week writing "just checking in" follow-up emails' },
              ].map((item) => (
                <div key={item.stat} className="border border-slate-200 rounded-xl p-5">
                  <p className="text-3xl font-bold text-slate-900 mb-2">{item.stat}</p>
                  <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 border-l-4 border-indigo-500 pl-6 py-1">
              <p className="text-slate-700 text-lg italic leading-relaxed">
                &ldquo;I used to dread opening my invoices tab. Now Chase handles it and I only look when something gets paid.&rdquo;
              </p>
              <p className="text-slate-500 text-sm mt-2 font-medium">— Sarah K., Brand Designer · 7 years freelance</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="bg-slate-50 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-indigo-600 text-sm font-semibold uppercase tracking-widest mb-3">How it works</p>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight mb-4">
              Three steps. Then you&rsquo;re done.
            </h2>
            <p className="text-lg text-slate-500 max-w-xl mx-auto">
              Chase works in the background — fully automated. You create the invoice, we handle everything else.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10 mb-16">
            {[
              {
                num: '01',
                title: 'Create your invoice',
                desc: 'Add your client\'s details, line items, rate, and due date. Chase generates a Stripe payment link automatically — no manual setup needed.',
                detail: 'Takes 3 minutes. Works for fixed-price projects, hourly work, retainers, and milestone-based engagements.',
              },
              {
                num: '02',
                title: 'Send in one click',
                desc: 'Chase emails your invoice to your client. The email includes a professional Stripe payment link so they can pay by card, Apple Pay, or Google Pay instantly.',
                detail: 'No account required on their end. Clients just click and pay. Funds arrive in your bank within 2 business days.',
              },
              {
                num: '03',
                title: 'Chase handles the rest',
                desc: 'If the invoice goes unpaid, Chase automatically sends professional follow-up emails on day 3, day 7, and day 14. The moment your client pays, all emails stop.',
                detail: 'Every follow-up sounds like you wrote it. Edit any template to match your voice and your relationship with the client.',
              },
            ].map((step) => (
              <div key={step.num}>
                <p className="text-8xl font-black text-slate-100 leading-none mb-4 select-none">{step.num}</p>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                <p className="text-slate-600 mb-3 leading-relaxed">{step.desc}</p>
                <p className="text-slate-400 text-sm leading-relaxed">{step.detail}</p>
              </div>
            ))}
          </div>

          {/* Timeline visualization */}
          <div className="bg-white border border-slate-200 rounded-2xl p-8">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-8">
              Example: $3,500 invoice — what Chase does automatically
            </p>
            <div className="overflow-x-auto">
              <div className="relative min-w-[480px]">
                <div className="absolute left-[10%] right-[10%] h-px bg-slate-200" style={{ top: '10px' }} />
                <div className="grid grid-cols-5 relative">
                  {[
                    { day: 'Day 0', event: 'Invoice sent', note: 'Stripe link included', color: 'bg-indigo-600', text: 'text-indigo-700', card: 'border-indigo-200 bg-indigo-50' },
                    { day: 'Day 3', event: 'Follow-up #1', note: '"Just a reminder…"', color: 'bg-slate-400', text: 'text-slate-600', card: 'border-slate-200 bg-slate-50' },
                    { day: 'Day 7', event: 'Follow-up #2', note: '"Invoice outstanding…"', color: 'bg-amber-500', text: 'text-amber-700', card: 'border-amber-200 bg-amber-50' },
                    { day: 'Day 14', event: 'Follow-up #3', note: '"Final reminder…"', color: 'bg-red-500', text: 'text-red-700', card: 'border-red-200 bg-red-50' },
                    { day: 'Paid ✓', event: 'Chase stops', note: 'You receive $3,500 🎉', color: 'bg-emerald-500', text: 'text-emerald-700', card: 'border-emerald-200 bg-emerald-50' },
                  ].map((item) => (
                    <div key={item.day} className="flex flex-col items-center gap-3 px-2">
                      <div className={`w-3 h-3 rounded-full ${item.color} ring-4 ring-white relative z-10 shrink-0 mt-1`} />
                      <div className={`text-center border rounded-xl px-2 py-2.5 ${item.card} w-full`}>
                        <p className={`text-xs font-bold ${item.text}`}>{item.day}</p>
                        <p className="text-xs font-medium text-slate-700 mt-0.5">{item.event}</p>
                        <p className="text-[10px] text-slate-400 mt-1 leading-tight">{item.note}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── VIDEO DEMO ── */}
      <section className="bg-[#09090b] py-24 px-6 border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white/[0.06] border border-white/[0.08] text-white/50 text-xs rounded-full px-3 py-1.5 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block animate-pulse" />
              Live product demo
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
              See Chase in action
            </h2>
            <p className="text-white/45 text-lg max-w-xl mx-auto">
              Watch how a freelancer goes from unpaid invoice to recovered payment — in under 90 seconds.
            </p>
          </div>

          {/* Video player */}
          <div className="relative rounded-2xl overflow-hidden border border-white/[0.08] shadow-[0_0_80px_rgba(99,91,255,0.15)] bg-[#0f0f12]">
            {/* Browser chrome */}
            <div className="flex items-center gap-1.5 px-4 pt-3 pb-2.5 border-b border-white/[0.06] bg-white/[0.02]">
              <div className="w-2.5 h-2.5 rounded-full bg-white/[0.12]" />
              <div className="w-2.5 h-2.5 rounded-full bg-white/[0.12]" />
              <div className="w-2.5 h-2.5 rounded-full bg-white/[0.12]" />
              <div className="flex-1 flex justify-center">
                <div className="bg-white/[0.04] rounded px-10 py-1 text-white/20 text-[11px] font-mono">chase.allonys.com/dashboard</div>
              </div>
            </div>

            {/* Video embed — replace YOUR_LOOM_ID with actual Loom video ID */}
            {/* To add your video: record a Loom at loom.com, get the share ID, replace below */}
            <div className="relative" style={{ paddingBottom: '56.25%' }}>
              <iframe
                src="https://www.loom.com/embed/YOUR_LOOM_VIDEO_ID?hide_owner=true&hide_share=true&hide_title=true&hideEmbedTopBar=true"
                frameBorder="0"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
                title="Chase demo video"
                style={{ display: 'none' }} /* Remove this line after adding your Loom ID */
              />
              {/* Placeholder — remove this div after adding your Loom video ID above */}
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0f0f12]">
                {/* Dashboard preview as background */}
                <div className="absolute inset-0 opacity-30 pointer-events-none overflow-hidden">
                  <div className="px-5 py-3 border-b border-white/[0.05] flex items-center justify-between">
                    <div>
                      <div className="w-32 h-3 bg-white/10 rounded mb-1.5" />
                      <div className="w-20 h-2 bg-white/[0.06] rounded" />
                    </div>
                    <div className="w-24 h-6 bg-indigo-600/40 rounded-md" />
                  </div>
                  <div className="grid grid-cols-3 divide-x divide-white/[0.04] border-b border-white/[0.04]">
                    {[['Outstanding','$9,550','text-white'],['Recovered','$4,500','text-emerald-400'],['Hours saved','6 hrs','text-indigo-400']].map(([l,v,c]) => (
                      <div key={l} className="px-4 py-3">
                        <div className="w-16 h-2 bg-white/[0.06] rounded mb-2" />
                        <p className={`text-lg font-bold ${c}`}>{v}</p>
                      </div>
                    ))}
                  </div>
                  {[['Acme Corp','$3,200','Chasing 📨','text-amber-400 bg-amber-400/10'],['Studio Nine','$1,850','Sent ⏳','text-blue-400 bg-blue-400/10'],['Bright Media','$4,500','Paid ✓ 💰','text-emerald-400 bg-emerald-400/10']].map(([c,a,s,sc]) => (
                    <div key={c} className="px-5 py-3.5 flex items-center justify-between border-b border-white/[0.04]">
                      <div>
                        <p className="text-white/60 text-sm font-medium">{c}</p>
                        <p className="text-white/20 text-[10px]">Automatic follow-up running</p>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <span className="text-white/40 text-sm">{a}</span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${sc}`}>{s}</span>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Play button */}
                <div className="relative z-10 flex flex-col items-center gap-6">
                  <a
                    href="/signup"
                    className="group w-20 h-20 rounded-full bg-indigo-600 hover:bg-indigo-500 flex items-center justify-center shadow-[0_0_60px_rgba(99,91,255,0.6)] transition-all hover:scale-105"
                  >
                    <svg className="translate-x-0.5" width="28" height="28" viewBox="0 0 24 24" fill="white">
                      <polygon points="5 3 19 12 5 21 5 3"/>
                    </svg>
                  </a>
                  <div className="text-center">
                    <p className="text-white/70 font-semibold text-sm mb-1">Try Chase free for 14 days</p>
                    <p className="text-white/30 text-xs">No credit card required · Setup in 5 minutes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Video proof points */}
          <div className="grid sm:grid-cols-3 gap-6 mt-10">
            {[
              { icon: '⚡', title: 'Set up in 5 minutes', desc: 'Create account, connect Stripe, send your first invoice. Done.' },
              { icon: '🤖', title: 'Runs while you sleep', desc: 'Chase checks every invoice daily at 8am and sends follow-ups automatically.' },
              { icon: '💰', title: 'Stops when paid', desc: 'The moment your client pays, all follow-ups stop instantly. Zero awkwardness.' },
            ].map((p) => (
              <div key={p.title} className="text-center">
                <div className="text-3xl mb-3">{p.icon}</div>
                <p className="text-white/80 font-semibold text-sm mb-1.5">{p.title}</p>
                <p className="text-white/35 text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="bg-white py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-indigo-600 text-sm font-semibold uppercase tracking-widest mb-3">Features</p>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight mb-4">
              Everything you need.<br />Nothing you don&rsquo;t.
            </h2>
            <p className="text-lg text-slate-500 max-w-xl mx-auto">
              Built specifically for freelancers. No bloated project management, no CRM overhead — just create invoice, follow up, get paid.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: '🔁',
                title: 'Smart follow-up sequences',
                desc: 'Timed, professional emails at day 3, 7, and 14 after the due date. Chase stops automatically the moment your client pays — no accidental emails after payment.',
              },
              {
                icon: '⚡',
                title: 'Stripe payment links',
                desc: 'Every invoice includes a one-click Stripe payment link. Clients pay by Visa, Mastercard, Apple Pay, or Google Pay — no account required on their end.',
              },
              {
                icon: '✏️',
                title: 'Emails that sound like you',
                desc: 'Every follow-up template is fully editable. Keep the professional tone or make it casual — Chase sends exactly what you write.',
              },
              {
                icon: '🌙',
                title: 'Runs while you sleep',
                desc: 'Chase checks your invoices every morning at 8am and sends follow-ups without any action from you. Set it up once, forget about it.',
              },
              {
                icon: '📊',
                title: 'Clear invoice tracking',
                desc: 'See every invoice status at a glance: sent, chasing, overdue, paid. Know exactly where each invoice stands in the payment cycle.',
              },
              {
                icon: '🛡️',
                title: 'Bank-grade security',
                desc: 'Stripe-powered payments, encrypted data at rest, row-level database security. Your data is completely private and yours alone.',
              },
            ].map((f) => (
              <div key={f.title} className="border border-slate-200 rounded-2xl p-7 hover:border-indigo-200 hover:shadow-md transition-all duration-200 group">
                <span className="text-2xl mb-4 block">{f.icon}</span>
                <h3 className="font-semibold text-slate-900 mb-2 group-hover:text-indigo-700 transition-colors">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW YOU GET PAID ── */}
      <section className="bg-slate-50 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <p className="text-indigo-600 text-sm font-semibold uppercase tracking-widest mb-3">Getting paid</p>
              <h2 className="text-4xl font-bold text-slate-900 tracking-tight mb-6">
                How does the money actually get to me?
              </h2>
              <div className="space-y-4 text-slate-600 leading-relaxed">
                <p>
                  Chase uses <strong className="text-slate-900">Stripe</strong> — the same payment processor trusted by millions of businesses worldwide. When you create an invoice, Chase generates a secure Stripe payment link and embeds it directly in your invoice email.
                </p>
                <p>
                  Your client clicks the link and pays by card, Apple Pay, or Google Pay. <strong className="text-slate-900">No account required on their end</strong> — they just enter their card details and pay. The whole thing takes them under 60 seconds.
                </p>
                <p>
                  Stripe deposits the money directly into your connected bank account. Payouts typically arrive within <strong className="text-slate-900">2 business days</strong>. You keep the full amount, minus Stripe&rsquo;s standard processing fee (2.9% + 30¢ per transaction).
                </p>
                <p>
                  Chase has no hidden fees on top of Stripe — unless you&rsquo;re on the 5% success-fee plan, in which case Chase only charges when an invoice is actually recovered.
                </p>
              </div>

              <div className="mt-8 bg-indigo-600/5 border border-indigo-200 rounded-xl px-6 py-5">
                <p className="text-indigo-900 font-semibold text-sm mb-1.5">🌍 Works internationally</p>
                <p className="text-indigo-800/70 text-sm leading-relaxed">
                  Chase works in 47+ countries where Stripe is supported, including the US, UK, EU, Canada, Australia, and more. Invoices can be in any currency Stripe supports.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                {
                  step: '1',
                  title: 'Connect your Stripe account',
                  desc: 'Link your existing Stripe account or create a free one during onboarding. Takes 2 minutes. Chase uses it to generate payment links and route funds directly to your bank.',
                },
                {
                  step: '2',
                  title: 'Create and send your invoice',
                  desc: 'Enter your client\'s email, add line items, set the due date. Chase generates a secure payment link and sends the professional invoice immediately.',
                },
                {
                  step: '3',
                  title: 'Client pays from their email',
                  desc: 'Your client opens the email, clicks "Pay now", and pays by card or Apple/Google Pay. No login, no friction. The whole flow takes them under 60 seconds.',
                },
                {
                  step: '4',
                  title: 'Money lands in your account',
                  desc: 'Stripe processes the payment and transfers funds to your bank. Payouts arrive in 2 business days. Chase marks the invoice paid and stops all follow-ups automatically.',
                },
              ].map((item) => (
                <div key={item.step} className="flex gap-4 bg-white border border-slate-200 rounded-xl p-5 hover:border-indigo-200 transition-colors">
                  <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-sm font-bold shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 mb-1">{item.title}</p>
                    <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── MID-PAGE CTA ── */}
      <section className="bg-indigo-600 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-white text-xl font-bold mb-1">Ready to stop chasing invoices?</p>
            <p className="text-indigo-200 text-sm">Free for your first 3 invoices — no credit card required. Setup in 3 minutes.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link href="/signup" className="bg-white text-indigo-700 font-semibold px-6 py-2.5 rounded-xl hover:bg-indigo-50 transition-colors text-sm text-center whitespace-nowrap">
              Start free trial →
            </Link>
            <Link href="/blog/how-to-follow-up-on-unpaid-invoice-freelancer" className="border border-white/30 text-white/80 hover:text-white font-medium px-6 py-2.5 rounded-xl transition-colors text-sm text-center whitespace-nowrap">
              Read the guide
            </Link>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: 'Chase paid for itself with the first invoice it recovered. I haven\'t written a follow-up email in months.',
                name: 'Alex M.',
                role: 'Freelance Designer, 4 years',
                initial: 'A',
              },
              {
                quote: 'I sent one invoice, went to sleep, and woke up to payment. That\'s the Chase experience.',
                name: 'Jamie T.',
                role: 'Product Consultant, 6 years',
                initial: 'J',
              },
              {
                quote: 'The 5% plan was the reason I started. I recovered a $2,800 invoice I\'d basically written off. Then I upgraded to Pro immediately.',
                name: 'Priya S.',
                role: 'UX Researcher · Freelance',
                initial: 'P',
              },
            ].map((t) => (
              <div key={t.name} className="border border-slate-200 rounded-2xl p-7">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="text-amber-400" width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <blockquote className="text-slate-700 leading-relaxed mb-5 italic">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-600 text-sm font-bold">
                    {t.initial}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                    <p className="text-xs text-slate-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INTEGRATIONS ── */}
      <section id="integrations" className="bg-slate-50 py-24 px-6 border-t border-slate-100">
        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-14">
            <p className="text-indigo-600 text-sm font-semibold uppercase tracking-widest mb-3">Integrations</p>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight mb-4">
              Works with your stack
            </h2>
            <p className="text-lg text-slate-500 max-w-xl mx-auto">
              Chase plugs into the tools you already use — accounting, CRM, time tracking, and more.
              No switching, no duplicate data entry.
            </p>
          </div>

          {/* Zapier featured card */}
          <div className="relative rounded-2xl border-2 border-orange-200 bg-orange-50 p-7 mb-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#FF4A00' }}>
                <span className="text-white font-black text-2xl">Z</span>
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-slate-900">Zapier</h3>
                  <span className="text-[11px] font-semibold bg-orange-100 text-orange-700 border border-orange-200 px-2.5 py-0.5 rounded-full">Coming soon</span>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed max-w-2xl">
                  Connect Chase to <strong className="text-slate-900">6,000+ apps</strong> — no code required.
                  Auto-sync paid invoices to QuickBooks, ping Slack the moment a client pays,
                  create invoices from new CRM deals, log hours from Toggl, and more.
                </p>
              </div>
              <a
                href="mailto:hello@chase.allonys.com?subject=Notify me: Zapier integration"
                className="shrink-0 inline-flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors whitespace-nowrap"
              >
                Notify me →
              </a>
            </div>
          </div>

          {/* Integration grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            {([
              { name: 'Stripe', letters: 'S', color: '#635bff', bg: '#eef2ff', status: 'live', desc: 'Payments (built-in)' },
              { name: 'QuickBooks', letters: 'QB', color: '#2CA01C', bg: '#f0fdf4', status: 'soon', desc: 'Sync paid invoices' },
              { name: 'Xero', letters: 'Xr', color: '#1AB4D7', bg: '#ecfeff', status: 'soon', desc: 'Accounting sync' },
              { name: 'FreshBooks', letters: 'FB', color: '#0086E6', bg: '#eff6ff', status: 'soon', desc: 'Invoice import' },
              { name: 'Slack', letters: 'Sl', color: '#4A154B', bg: '#fdf4ff', status: 'soon', desc: 'Payment alerts' },
              { name: 'HubSpot', letters: 'H', color: '#FF7A59', bg: '#fff7ed', status: 'soon', desc: 'CRM sync' },
              { name: 'Wave', letters: 'Wv', color: '#009DD9', bg: '#f0f9ff', status: 'soon', desc: 'Free accounting' },
              { name: 'Toggl Track', letters: 'Tg', color: '#E01B22', bg: '#fff5f5', status: 'soon', desc: 'Time → invoices' },
              { name: 'Harvest', letters: 'Hv', color: '#FA552E', bg: '#fff7ed', status: 'soon', desc: 'Time & invoicing' },
              { name: 'Google Workspace', letters: 'G', color: '#4285F4', bg: '#eff6ff', status: 'soon', desc: 'Send from your email' },
              { name: 'Notion', letters: 'N', color: '#37352F', bg: '#f8f8f7', status: 'soon', desc: 'Client workspace' },
              { name: 'Make (Integromat)', letters: 'Mk', color: '#6F42C1', bg: '#f5f3ff', status: 'soon', desc: 'Automation flows' },
            ] as { name: string; letters: string; color: string; bg: string; status: string; desc: string }[]).map((item) => (
              <div
                key={item.name}
                className="bg-white border border-slate-200 rounded-xl p-5 hover:border-indigo-200 hover:shadow-sm transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center"
                    style={{ background: item.bg }}
                  >
                    <span className="font-bold text-xs" style={{ color: item.color }}>{item.letters}</span>
                  </div>
                  {item.status === 'live' ? (
                    <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                      Live
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold bg-slate-50 text-slate-400 border border-slate-200 px-2 py-0.5 rounded-full">
                      Soon
                    </span>
                  )}
                </div>
                <p className="font-semibold text-slate-900 text-sm mb-0.5">{item.name}</p>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center">
            <p className="text-slate-400 text-sm">
              Don&rsquo;t see your tool?{' '}
              <a
                href="mailto:hello@chase.allonys.com?subject=Integration request"
                className="text-indigo-600 hover:underline font-medium"
              >
                Request an integration →
              </a>
            </p>
          </div>

        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="bg-slate-50 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-6">
            <p className="text-indigo-600 text-sm font-semibold uppercase tracking-widest mb-3">Pricing</p>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight mb-4">
              Simple, honest pricing
            </h2>
            <p className="text-lg text-slate-500 max-w-xl mx-auto">
              Start free. Upgrade when you need to. The average Pro user recovers their subscription cost from the very first invoice Chase follows up on.
            </p>
          </div>

          <div className="flex items-center justify-center mb-12">
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium px-4 py-2 rounded-full">
              🎁 All paid plans include a 14-day free trial — no credit card required
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">

            {/* Free */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8">
              <p className="font-bold text-slate-900 text-lg mb-1">Free</p>
              <div className="flex items-end gap-1 mb-1">
                <span className="text-4xl font-bold text-slate-900">$0</span>
                <span className="text-slate-400 mb-1.5">/month</span>
              </div>
              <p className="text-slate-500 text-sm mb-8">Perfect for trying Chase and recovering your first invoices.</p>
              <ul className="space-y-3 mb-8">
                {[
                  'Up to 3 active invoices',
                  'Automatic follow-up sequences',
                  'Stripe payment links',
                  'Client management',
                  'Email templates',
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <svg className="text-emerald-500 mt-0.5 shrink-0" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="block text-center border border-slate-300 hover:border-slate-400 text-slate-700 font-medium py-2.5 rounded-xl transition-colors text-sm">
                Create free account →
              </Link>
            </div>

            {/* Success Fee */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8">
              <p className="font-bold text-slate-900 text-lg mb-1">Success Fee</p>
              <div className="flex items-end gap-1 mb-1">
                <span className="text-4xl font-bold text-slate-900">5%</span>
                <span className="text-slate-400 mb-1.5">per recovery</span>
              </div>
              <p className="text-slate-500 text-sm mb-8">Only pay when Chase actually recovers an invoice. Zero risk.</p>
              <ul className="space-y-3 mb-8">
                {[
                  'Unlimited invoices',
                  'Automatic follow-up sequences',
                  'Stripe payment links',
                  '5% only when Chase recovers',
                  'No monthly commitment',
                  'Cancel or pause anytime',
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <svg className="text-emerald-500 mt-0.5 shrink-0" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="block text-center border border-slate-300 hover:border-indigo-300 hover:text-indigo-700 text-slate-700 font-medium py-2.5 rounded-xl transition-colors text-sm">
                Start free trial →
              </Link>
              <p className="text-center text-xs text-slate-400 mt-2">14 days free · No card required</p>
            </div>

            {/* Pro */}
            <div className="bg-white border-2 border-indigo-600 rounded-2xl p-8 relative">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-semibold px-4 py-1.5 rounded-full whitespace-nowrap">
                Most popular
              </div>
              <p className="font-bold text-slate-900 text-lg mb-1">Pro</p>
              <div className="flex items-end gap-1 mb-1">
                <span className="text-4xl font-bold text-slate-900">$19</span>
                <span className="text-slate-400 mb-1.5">/month</span>
              </div>
              <p className="text-slate-500 text-sm mb-8">For freelancers serious about getting paid. Unlimited everything.</p>
              <ul className="space-y-3 mb-8">
                {[
                  'Unlimited invoices',
                  'Automatic follow-up sequences',
                  'Stripe payment links',
                  'Custom email templates',
                  'Priority email support',
                  '14-day free trial included',
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <svg className="text-indigo-500 mt-0.5 shrink-0" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="block text-center bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl transition-colors text-sm">
                Start free 14-day trial →
              </Link>
              <p className="text-center text-xs text-slate-400 mt-2">No card required · Cancel anytime</p>
              <div className="flex items-center justify-center gap-1.5 mt-3">
                <svg width="10" height="10" viewBox="0 0 32 32" fill="#635bff">
                  <path d="M16 2C8.3 2 2 8.3 2 16s6.3 14 14 14 14-6.3 14-14S23.7 2 16 2zm0 4c2.4 0 3.8 1.1 3.8 2.9 0 1.5-1.1 2.5-2.7 3 1.8.5 2.9 1.6 2.9 3.3 0 2.1-1.7 3.4-4.4 3.4-1.3 0-2.6-.4-3.6-1.2l.9-1.4c.8.6 1.6 1 2.7 1 1.4 0 2.1-.7 2.1-1.7s-.9-1.5-2.3-1.5h-.9v-1.7h.9c1.3 0 2-.6 2-1.6s-.7-1.6-2-1.6c-.9 0-1.8.4-2.5 1l-.9-1.4c.9-1 2.2-1.5 4-1.5z"/>
                </svg>
                <span className="text-[#635bff] text-[10px] font-semibold">Powered by Stripe</span>
              </div>
            </div>
          </div>

          <p className="text-center text-slate-400 text-sm mt-8 max-w-lg mx-auto">
            All plans include Stripe payment links. Stripe&rsquo;s standard processing fee (2.9% + 30¢) applies separately to all payments.
          </p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="bg-white py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-indigo-600 text-sm font-semibold uppercase tracking-widest mb-3">FAQ</p>
            <h2 className="text-4xl font-bold text-slate-900 tracking-tight mb-4">
              Everything you want to know
            </h2>
            <p className="text-slate-500">
              Still have questions? Email us at{' '}
              <a href="mailto:hello@chase.allonys.com" className="text-indigo-600 hover:underline">hello@chase.allonys.com</a>
            </p>
          </div>

          <div className="divide-y divide-slate-200 border border-slate-200 rounded-2xl overflow-hidden">
            {[
              {
                q: 'What exactly is Chase?',
                a: 'Chase is an invoice management tool for freelancers that automatically follows up on unpaid invoices via email. You create an invoice, Chase sends it to your client with a Stripe payment link, and if it goes unpaid, Chase sends professional follow-up emails at set intervals until your client pays — then stops the moment payment arrives.',
              },
              {
                q: 'Do my clients need to sign up or create an account?',
                a: 'No. Your clients don\'t need to create any accounts or install anything. They receive a professional email with a Stripe payment link and can pay by card, Apple Pay, or Google Pay in under 60 seconds. Zero friction on their end.',
              },
              {
                q: 'How does the money get to me?',
                a: 'Chase uses Stripe to process all payments. You connect your Stripe account during onboarding (or create a free one — takes 2 minutes). Stripe deposits money directly into your connected bank account. Payouts typically arrive within 2 business days of each payment. Chase has no separate payout process.',
              },
              {
                q: 'What fees does Chase charge?',
                a: 'The Free plan is $0/month with up to 3 invoices. The Pro plan is $19/month with a 14-day free trial. The Success Fee plan charges 5% of each invoice Chase recovers — only when you actually get paid. In all plans, Stripe\'s standard processing fee (2.9% + 30¢ per transaction) applies separately.',
              },
              {
                q: 'How does the 5% success fee plan work exactly?',
                a: 'With the Success Fee plan, Chase only charges you when it successfully helps recover a payment. If your client pays before Chase sends any follow-ups, you owe nothing to Chase. The 5% is calculated on the invoice total and applies to invoices where Chase\'s follow-up sequence contributed to the payment. This is ideal if you send invoices infrequently and don\'t want a monthly commitment.',
              },
              {
                q: 'Can I customize the follow-up emails?',
                a: 'Yes, completely. Chase comes with professional default templates for each follow-up stage (day 3, day 7, day 14), but you can edit every single one. Adjust the tone, add specific payment instructions, insert client-specific context, or completely rewrite them. Chase sends exactly what you write.',
              },
              {
                q: 'What if my client still doesn\'t pay after all follow-ups?',
                a: 'Chase sends up to 3 automatic follow-ups. If the invoice remains unpaid after day 14, Chase marks it as overdue and notifies you. At that point, you can manually escalate — send a final notice, involve a collections agency, or pursue other legal avenues. Chase provides a complete paper trail of all communication, which is useful if things escalate.',
              },
              {
                q: 'Is my financial and client data safe?',
                a: 'Yes. All payment processing is handled by Stripe, which is PCI-compliant and trusted by millions of businesses. Your invoice and client data is stored with row-level security — only you can access your data. We never sell or share your data with third parties.',
              },
              {
                q: 'How long does setup take?',
                a: 'Most users send their first invoice within 5 minutes of signing up. You create your account, connect Stripe (2 minutes), add your first client, create an invoice, and you\'re live. Chase handles everything else automatically from that point.',
              },
              {
                q: 'Does Chase work internationally?',
                a: 'Chase works in any country where Stripe is supported — which covers 47+ countries including the US, UK, EU, Canada, Australia, Singapore, and more. Invoices can be denominated in any currency Stripe supports. Follow-up emails are in English (additional language support is on our roadmap).',
              },
              {
                q: 'Can I switch plans or cancel anytime?',
                a: 'Yes, absolutely. You can upgrade, downgrade, or cancel from your billing settings at any time. If you cancel, you keep access to all features until the end of your current billing period. No cancellation fees, no lock-in contracts, no questions asked.',
              },
              {
                q: 'What\'s the difference between the Free and Pro plan?',
                a: 'The Free plan supports up to 3 active invoices at a time — perfect for trying Chase with real clients. Pro gives you unlimited invoices, unlimited follow-up sequences, fully customizable email templates, and priority support. If you regularly have more than 3 invoices outstanding at once, Pro pays for itself by recovering a single late payment.',
              },
            ].map((faq, i) => (
              <details key={i} className="group bg-white">
                <summary className="flex items-center justify-between gap-4 px-7 py-5 cursor-pointer list-none hover:bg-slate-50 transition-colors">
                  <span className="font-medium text-slate-900">{faq.q}</span>
                  <svg className="w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 group-open:rotate-180" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-7 pb-6 border-t border-slate-100">
                  <p className="text-slate-500 text-sm leading-relaxed pt-4">{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="mkt-hero-bg py-32 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/[0.06] border border-white/[0.08] text-white/50 text-xs rounded-full px-3 py-1.5 mb-8">
            🎁 14-day free trial — no credit card required
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight leading-[1.1] mb-5">
            Your next invoice deserves<br />to get paid.
          </h2>
          <p className="text-white/50 text-lg leading-relaxed mb-10 max-w-lg mx-auto">
            Join freelancers who&rsquo;ve stopped writing &ldquo;just checking in&rdquo; and started getting paid on time. Setup takes 5 minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/signup" className="btn-mkt-primary">
              Start free — no card required
            </Link>
            <a href="#pricing" className="btn-mkt-ghost">
              View pricing →
            </a>
          </div>
          <p className="text-white/25 text-sm mt-6">14-day trial · Setup in 5 minutes · Cancel anytime</p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#09090b] border-t border-white/[0.06] py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">C</span>
            </div>
            <span className="text-white/40 text-sm font-medium">Chase</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/blog" className="text-white/30 hover:text-white/50 text-sm transition-colors">Blog</Link>
            <Link href="/privacy" className="text-white/30 hover:text-white/50 text-sm transition-colors">Privacy</Link>
            <Link href="/terms" className="text-white/30 hover:text-white/50 text-sm transition-colors">Terms</Link>
            <a href="mailto:hello@chase.allonys.com" className="text-white/30 hover:text-white/50 text-sm transition-colors">Contact</a>
          </div>
          <p className="text-white/25 text-sm">© 2026 Chase. All rights reserved.</p>
        </div>
      </footer>

      <ExitIntentPopup />
      <LiveActivityNotification />
      <StickyCTA />
    </div>
  )
}
