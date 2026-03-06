'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const TESTIMONIALS = [
  {
    quote: 'Chase recovered $4,200 for me in the first week. I was skeptical but it just works.',
    name: 'Marcus R.',
    role: 'UX Designer',
  },
  {
    quote: "I haven't written a follow-up email in 3 months. Chase handles all of it.",
    name: 'Priya S.',
    role: 'Brand Consultant',
  },
]

function getPasswordStrength(pw: string): { label: string; color: string; width: string } {
  if (pw.length === 0) return { label: '', color: '#e2e8f0', width: '0%' }
  if (pw.length < 8) return { label: 'Weak', color: '#ef4444', width: '33%' }
  if (pw.length < 12) return { label: 'Medium', color: '#f59e0b', width: '66%' }
  return { label: 'Strong', color: '#10b981', width: '100%' }
}

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [testimonialIndex, setTestimonialIndex] = useState(0)
  const [testimonialVisible, setTestimonialVisible] = useState(true)

  // Auto-rotate testimonials every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTestimonialVisible(false)
      setTimeout(() => {
        setTestimonialIndex(prev => (prev + 1) % TESTIMONIALS.length)
        setTestimonialVisible(true)
      }, 300)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      setLoading(false)
      return
    }

    const supabase = createClient()
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/api/auth/callback` },
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    // Ensure session exists (in case email confirmation is enabled)
    if (!data.session) {
      await supabase.auth.signInWithPassword({ email, password })
    }

    // Read source from localStorage
    let signupSource = 'direct'
    try {
      const stored = localStorage.getItem('chase_source')
      if (stored) {
        const parsed = JSON.parse(stored)
        signupSource = parsed.source || 'direct'
      } else if (document.referrer) {
        signupSource = new URL(document.referrer).hostname
      }
    } catch {}

    // Call signup notification (fire and forget)
    fetch('/api/admin/notify-signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, source: signupSource }),
    }).catch(() => {})

    router.push('/onboarding')
    router.refresh()
  }

  const strength = getPasswordStrength(password)
  const currentTestimonial = TESTIMONIALS[testimonialIndex]

  return (
    <div className="min-h-screen flex">

      {/* ── LEFT PANEL (desktop only) ── */}
      <div className="auth-split-left hidden lg:flex lg:flex-col lg:w-[520px] shrink-0 p-12 justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">C</span>
          </div>
          <span className="text-white font-semibold text-base tracking-tight">Chase</span>
        </Link>

        {/* Feature list */}
        <div>
          <p className="text-white/40 text-xs uppercase tracking-widest font-medium mb-4">What you get with Chase</p>
          <div className="space-y-3">
            {[
              'Automated follow-ups on Day 3, 7, 14',
              'Stripe payment link on every invoice',
              'Stops automatically when client pays',
              'Customize every email template',
              'Works while you sleep — daily automation',
              'Free plan: 3 invoices, upgrade anytime',
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <svg className="shrink-0 mt-0.5" width="15" height="15" fill="none" stroke="#818cf8" strokeWidth="2.5" viewBox="0 0 24 24">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span className="text-white/70 text-sm leading-snug">{item}</span>
              </div>
            ))}
          </div>

          {/* Recovery stats visual */}
          <div className="mt-10">
            <p className="text-white/40 text-xs uppercase tracking-widest font-medium mb-4">Average invoice recovery</p>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-white/50 text-xs">Without Chase</span>
                  <span className="text-white/50 text-xs font-medium">39 days</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <div className="h-full rounded-full" style={{ width: '100%', background: 'rgba(239,68,68,0.5)' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-white/80 text-xs font-medium">With Chase</span>
                  <span className="text-indigo-400 text-xs font-bold">11 days</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <div className="h-full rounded-full" style={{ width: '28%', background: 'linear-gradient(90deg, #6366f1, #10b981)' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom testimonial */}
        <div>
          <div className="border-t border-white/10 pt-6">
            <blockquote className="text-white/80 text-base font-medium leading-relaxed mb-4">
              &ldquo;I sent one invoice, went to sleep, and woke up to payment. That&rsquo;s Chase.&rdquo;
            </blockquote>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold" style={{ background: 'rgba(99,102,241,0.3)', border: '1px solid rgba(99,102,241,0.3)', color: '#a5b4fc' }}>
                J
              </div>
              <div>
                <div className="text-white/80 text-sm font-medium">Jamie T.</div>
                <div className="text-white/40 text-xs">Product Consultant</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL (form) ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden mb-8 flex justify-center">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-base">C</span>
              </div>
              <span className="font-semibold text-slate-900 text-base">Chase</span>
            </Link>
          </div>

          {/* Top strip: mini stat chips */}
          <div className="flex flex-wrap gap-2 mb-6">
            {['Free 14-day trial', 'No credit card', 'Setup in 5 min'].map((chip) => (
              <span
                key={chip}
                className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full"
                style={{ background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0' }}
              >
                <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {chip}
              </span>
            ))}
          </div>

          {/* Headline */}
          <div className="mb-5">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight leading-tight">Start for free</h1>
            <p className="text-slate-500 text-sm mt-2 leading-relaxed">
              Join 500+ freelancers who&rsquo;ve automated their invoice follow-ups
            </p>
          </div>

          {/* Social proof mini-strip */}
          <div className="flex items-center gap-3 mb-6 pb-6" style={{ borderBottom: '1px solid #f1f5f9' }}>
            <div className="flex -space-x-2">
              {[
                { initials: 'JS', bg: '#4f46e5' },
                { initials: 'SM', bg: '#7c3aed' },
                { initials: 'AT', bg: '#0891b2' },
              ].map(({ initials, bg }) => (
                <div
                  key={initials}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ background: bg, border: '2px solid white' }}
                >
                  {initials}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1.5">
              <div className="flex">
                {[1, 2, 3, 4, 5].map(s => (
                  <svg key={s} width="13" height="13" fill="#f59e0b" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-slate-500 text-xs">4.9 from 200+ reviews</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label" htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                className="input"
                style={{ padding: '0.75rem 0.875rem' }}
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="label" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                className="input"
                style={{ padding: '0.75rem 0.875rem' }}
                placeholder="At least 8 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
              {/* Password strength indicator */}
              {password.length > 0 && (
                <div className="mt-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-slate-400">Password strength</span>
                    <span className="text-xs font-medium" style={{ color: strength.color }}>{strength.label}</span>
                  </div>
                  <div className="h-1 rounded-full overflow-hidden" style={{ background: '#f1f5f9' }}>
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{ width: strength.width, background: strength.color }}
                    />
                  </div>
                </div>
              )}
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="btn-primary w-full justify-center text-base"
              style={{ padding: '0.8125rem 1rem', marginTop: '0.5rem' }}
              disabled={loading}
            >
              {loading ? 'Creating account…' : 'Create free account →'}
            </button>
          </form>

          {/* Trust strip */}
          <div className="mt-4 flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 text-slate-400">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span className="text-xs">Secured by Stripe · PCI DSS compliant</span>
            </div>
            <div className="flex items-center gap-2">
              {['Visa', 'Mastercard', 'Amex'].map(card => (
                <span
                  key={card}
                  className="text-xs font-medium px-2 py-0.5 rounded"
                  style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#94a3b8' }}
                >
                  {card}
                </span>
              ))}
            </div>
          </div>

          {/* Testimonial carousel */}
          <div
            className="mt-5 rounded-xl p-4"
            style={{ background: '#f8fafc', border: '1px solid #f1f5f9', minHeight: '88px' }}
          >
            <div
              style={{
                opacity: testimonialVisible ? 1 : 0,
                transition: 'opacity 0.3s ease',
              }}
            >
              <p className="text-slate-600 text-sm leading-relaxed mb-2.5">
                &ldquo;{currentTestimonial.quote}&rdquo;
              </p>
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ background: '#4f46e5' }}
                >
                  {currentTestimonial.name[0]}
                </div>
                <span className="text-slate-500 text-xs">
                  <span className="font-medium text-slate-700">{currentTestimonial.name}</span>
                  {', '}
                  {currentTestimonial.role}
                </span>
              </div>
            </div>
            {/* Dot indicators */}
            <div className="flex justify-center gap-1.5 mt-3">
              {TESTIMONIALS.map((_, i) => (
                <div
                  key={i}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === testimonialIndex ? '16px' : '6px',
                    height: '6px',
                    background: i === testimonialIndex ? '#4f46e5' : '#e2e8f0',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Sign in link */}
          <p className="text-center text-sm text-slate-500 mt-5">
            Already have an account?{' '}
            <Link href="/login" className="text-indigo-600 font-medium hover:underline">
              Sign in →
            </Link>
          </p>

        </div>
      </div>
    </div>
  )
}
