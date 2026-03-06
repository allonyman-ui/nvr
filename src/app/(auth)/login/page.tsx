'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

// Inner form — uses useSearchParams so must be inside <Suspense>
function LoginForm() {

  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    // Redirect back to where they were trying to go, or dashboard
    const returnTo = searchParams.get('returnTo')
    const dest = (returnTo && returnTo.startsWith('/') && !returnTo.startsWith('//'))
      ? returnTo
      : '/dashboard'
    router.push(dest)
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
            &ldquo;Chase paid for itself with the first invoice it recovered. I haven&rsquo;t written a follow-up email in months.&rdquo;
          </blockquote>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-indigo-600/40 border border-indigo-500/30 flex items-center justify-center text-indigo-300 text-sm font-semibold">
              A
            </div>
            <div>
              <div className="text-white/80 text-sm font-medium">Alex M.</div>
              <div className="text-white/40 text-xs">Freelance Designer, 4 years</div>
            </div>
          </div>
        </div>

        {/* Feature bullets */}
        <div className="space-y-3">
          <div className="border-t border-white/10 pt-6 mb-2">
            <p className="text-white/40 text-xs uppercase tracking-widest font-medium">What you get</p>
          </div>
          {[
            'Sends follow-up emails automatically',
            'Stripe payment link on every invoice',
            'Stops chasing the moment you\'re paid',
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <svg className="text-indigo-400 mt-0.5 shrink-0" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span className="text-white/60 text-sm">{item}</span>
            </div>
          ))}
          <div className="pt-4 text-white/30 text-xs">
            $19/month after 14-day free trial
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
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome back</h1>
            <p className="text-slate-500 text-sm mt-1.5">Sign in to your account</p>
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
              <div className="flex items-center justify-between mb-[0.375rem]">
                <label className="label mb-0" htmlFor="password">Password</label>
                <Link href="/forgot-password" className="text-xs text-indigo-600 hover:underline font-medium">
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                className="input"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button type="submit" className="btn-primary w-full justify-center py-2.5 text-base" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-7">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-indigo-600 font-medium hover:underline">
              Start free →
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
