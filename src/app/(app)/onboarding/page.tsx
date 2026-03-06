'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const STEPS = [
  { label: 'Create account', short: 'Account' },
  { label: 'Set up profile', short: 'Profile' },
  { label: 'Start trial',    short: 'Trial'   },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [replyToEmail, setReplyToEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push('/login')
      return
    }

    // Read signup source from localStorage (set by UTMCapture or signup page)
    let signupSource: string | null = null
    try {
      const stored = localStorage.getItem('chase_source')
      if (stored) {
        const parsed = JSON.parse(stored)
        signupSource = parsed.source ?? null
      }
    } catch { /* ignore */ }

    const { error } = await supabase
      .from('profiles')
      .update({
        name,
        business_name: businessName,
        reply_to_email: replyToEmail || user.email,
        onboarding_completed: true,
        ...(signupSource ? { signup_source: signupSource } : {}),
      })
      .eq('id', user.id)

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/billing?welcome=1')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12" style={{ backgroundColor: '#f8fafc' }}>

      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 mb-10">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#4f46e5' }}>
          <span className="text-white font-bold text-sm">C</span>
        </div>
        <span className="font-semibold text-slate-900 text-base">Chase</span>
      </Link>

      {/* ── 3-step progress bar ── */}
      <div className="w-full max-w-md mb-8">
        <div className="flex items-start">
          {STEPS.map((step, i) => (
            <div key={i} className={`flex items-center ${i < STEPS.length - 1 ? 'flex-1' : ''}`}>
              <div className="flex flex-col items-center">
                {/* Circle */}
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    i === 0
                      ? 'text-white'       // step 1 done
                      : i === 1
                      ? 'text-white'       // step 2 current
                      : 'text-slate-400'   // step 3 upcoming
                  }`}
                  style={{
                    backgroundColor: i === 0 ? '#4f46e5' : i === 1 ? '#4f46e5' : '#e2e8f0',
                    boxShadow: i === 1 ? '0 0 0 4px rgba(79,70,229,0.15)' : undefined,
                  }}
                >
                  {i === 0 ? (
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <span>{i + 1}</span>
                  )}
                </div>
                {/* Label */}
                <span
                  className="text-xs mt-1.5 font-medium"
                  style={{ color: i === 1 ? '#4f46e5' : i === 0 ? '#64748b' : '#94a3b8' }}
                >
                  {step.short}
                </span>
              </div>
              {/* Connector */}
              {i < STEPS.length - 1 && (
                <div
                  className="flex-1 h-0.5 mb-5 mx-2 rounded-full"
                  style={{ backgroundColor: i === 0 ? '#4f46e5' : '#e2e8f0' }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Set up your profile</h1>
          <p className="text-slate-500 text-sm mt-1.5">Takes 30 seconds. Then you&apos;re ready to send your first invoice.</p>
        </div>

        {/* Form card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-4">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label" htmlFor="name">Your name</label>
              <input
                id="name"
                type="text"
                className="input"
                placeholder="Jane Smith"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="label" htmlFor="businessName">Business name</label>
              <input
                id="businessName"
                type="text"
                className="input"
                placeholder="Smith Design Studio"
                value={businessName}
                onChange={e => setBusinessName(e.target.value)}
                required
              />
              <p className="text-xs text-slate-400 mt-1">Appears on your invoices and follow-up emails.</p>
            </div>

            <div>
              <label className="label" htmlFor="replyTo">
                Reply-to email{' '}
                <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <input
                id="replyTo"
                type="email"
                className="input"
                placeholder="jane@smithdesign.com"
                value={replyToEmail}
                onChange={e => setReplyToEmail(e.target.value)}
              />
              <p className="text-xs text-slate-400 mt-1">
                Where client replies land. Defaults to your login email.
              </p>
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="btn-primary w-full justify-center py-3 text-base"
              disabled={loading}
            >
              {loading ? 'Saving…' : 'Continue to free trial →'}
            </button>
          </form>
        </div>

        {/* What happens next */}
        <div className="rounded-xl border p-4" style={{ backgroundColor: '#eef2ff', borderColor: '#c7d2fe' }}>
          <p className="text-xs font-semibold uppercase tracking-wide mb-2.5" style={{ color: '#4338ca' }}>
            What happens next
          </p>
          <div className="space-y-2">
            {[
              'Choose free plan or start your 14-day Pro trial',
              'Send your first invoice in under 5 minutes',
              'Chase automatically sends follow-ups — you relax',
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: '#c7d2fe', color: '#4338ca' }}
                >
                  {i + 1}
                </div>
                <span className="text-xs leading-relaxed" style={{ color: '#4338ca' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
