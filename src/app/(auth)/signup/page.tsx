'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

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
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/api/auth/callback` },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/onboarding')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex">

      {/* ── LEFT PANEL (desktop only) ── */}
      <div className="auth-split-left hidden lg:flex lg:flex-col lg:w-[480px] shrink-0 p-12 justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">C</span>
          </div>
          <span className="text-white font-semibold text-base tracking-tight">Chase</span>
        </Link>

        {/* Testimonial */}
        <div>
          <blockquote className="text-white text-2xl font-semibold leading-snug mb-6">
            &ldquo;I sent one invoice, went to sleep, and woke up to payment. That&rsquo;s the Chase experience.&rdquo;
          </blockquote>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-indigo-600/40 border border-indigo-500/30 flex items-center justify-center text-indigo-300 text-sm font-semibold">
              J
            </div>
            <div>
              <div className="text-white/80 text-sm font-medium">Jamie T.</div>
              <div className="text-white/40 text-xs">Product Consultant, 6 years</div>
            </div>
          </div>
        </div>

        {/* Plan bullets */}
        <div className="space-y-3">
          <div className="border-t border-white/10 pt-6 mb-2">
            <p className="text-white/40 text-xs uppercase tracking-widest font-medium">What&rsquo;s included</p>
          </div>
          {[
            'Free: up to 3 active invoices',
            'Pro: unlimited — $19/month',
            '14-day trial, no card required',
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <svg className="text-indigo-400 mt-0.5 shrink-0" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span className="text-white/60 text-sm">{item}</span>
            </div>
          ))}
          <div className="pt-4 text-white/30 text-xs">
            No credit card required to start
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL (form) ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 bg-white">
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <div className="lg:hidden mb-10 flex justify-center">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-base">C</span>
              </div>
              <span className="font-semibold text-slate-900 text-base">Chase</span>
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Start for free</h1>
            <p className="text-slate-500 text-sm mt-1.5">Create your account — no card required</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                className="input"
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
                placeholder="At least 8 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button type="submit" className="btn-primary w-full justify-center py-2.5 text-base" disabled={loading}>
              {loading ? 'Creating account…' : 'Create free account'}
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-4">
            Free plan: 3 active invoices. Upgrade anytime for unlimited.
          </p>

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
