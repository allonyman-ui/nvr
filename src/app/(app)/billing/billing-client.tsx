'use client'

import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types'

export default function BillingClient({ hasPercentPlan }: { hasPercentPlan: boolean }) {
  const searchParams = useSearchParams()
  const isWelcome = searchParams.get('welcome') === '1'
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly')
  const [upgrading, setUpgrading] = useState<'pro' | 'pro_yearly' | 'percent' | null>(null)
  const [portalLoading, setPortalLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeError, setActiveError] = useState<'pro' | 'pro_yearly' | 'percent' | 'portal' | null>(null)
  const errorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function load() {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { setLoading(false); return }

        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        setProfile(data)
      } catch (e) {
        console.error('Failed to load billing profile:', e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [error])

  async function handleUpgrade(plan: 'pro' | 'pro_yearly' | 'percent') {
    setError('')
    setActiveError(null)
    setUpgrading(plan)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError(data.error || 'Could not start checkout. Please try again.')
        setActiveError(plan)
        setUpgrading(null)
      }
    } catch {
      setError('Network error. Please check your connection and try again.')
      setActiveError(plan)
      setUpgrading(null)
    }
  }

  async function handlePortal() {
    setError('')
    setActiveError(null)
    setPortalLoading(true)
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError(data.error || 'Could not open billing portal. Please try again.')
        setActiveError('portal')
        setPortalLoading(false)
      }
    } catch {
      setError('Network error. Please check your connection and try again.')
      setActiveError('portal')
      setPortalLoading(false)
    }
  }

  const isPro = profile?.subscription_status === 'active' || profile?.subscription_status === 'trialing'

  if (loading) {
    return <div className="text-slate-500 text-sm">Loading…</div>
  }

  const InlineError = ({ forPlan }: { forPlan: 'pro' | 'pro_yearly' | 'percent' | 'portal' }) =>
    activeError === forPlan && error ? (
      <div
        ref={errorRef}
        className="mt-3 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700"
      >
        ⚠️ {error}
      </div>
    ) : null

  const activePlan = billingInterval === 'yearly' ? 'pro_yearly' : 'pro'
  const isUpgradingActive = upgrading === activePlan

  return (
    <div>
      {/* Welcome banner — shown after onboarding */}
      {isWelcome && !isPro && (
        <div className="mb-6 rounded-2xl overflow-hidden border border-indigo-200 bg-gradient-to-br from-indigo-50 to-white">
          <div className="flex items-start gap-4 px-6 py-5">
            <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center shrink-0">
              <svg width="22" height="22" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-indigo-900 font-bold text-base mb-1">🎉 Account created! Start your 14-day free trial now.</p>
              <p className="text-indigo-700/70 text-sm leading-relaxed">
                You&apos;re on the <strong>Free plan</strong> (up to 3 invoices). Unlock unlimited invoices, chase sequences, and custom templates — <strong>no credit card required during your trial.</strong>
              </p>
            </div>
          </div>
          <div className="border-t border-indigo-100 bg-indigo-600/5 px-6 py-3 flex items-center gap-3">
            <svg width="16" height="16" fill="none" stroke="#635bff" strokeWidth="2" viewBox="0 0 24 24">
              <rect width="14" height="14" rx="3" x="5" y="5"/><path d="M16 5V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2"/>
            </svg>
            <span className="text-indigo-700 text-xs font-medium">Powered by Stripe · No card needed during trial · Cancel anytime</span>
          </div>
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Billing</h1>
        <p className="text-slate-500 text-sm mt-1">Manage your subscription</p>
      </div>

      <div className="max-w-lg space-y-4">

        {/* Current Plan */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-slate-900">
                {isPro ? 'Pro Plan' : 'Free Plan'}
              </h2>
              {profile?.subscription_status === 'trialing' && profile.trial_ends_at && (
                <p className="text-xs text-indigo-600 mt-0.5">
                  Trial ends {new Date(profile.trial_ends_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
              )}
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              isPro ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'
            }`}>
              {isPro ? 'Active' : 'Free'}
            </span>
          </div>

          <div className="space-y-2 text-sm text-slate-600">
            {[
              isPro ? 'Unlimited active invoices' : 'Up to 3 active invoices',
              isPro ? 'Unlimited chase sequences' : 'Basic chase sequences',
              isPro ? 'Custom email templates' : 'Standard templates only',
              'Stripe payment links on every invoice',
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-2">
                <svg width="14" height="14" fill="none" stroke={isPro ? '#4f46e5' : '#94a3b8'} strokeWidth="2" viewBox="0 0 24 24">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {f}
              </div>
            ))}
          </div>
        </div>

        {/* Upgrade options — shown when on free plan */}
        {!isPro && (
          <>
            {/* Monthly / Yearly toggle */}
            <div className="flex items-center justify-center pt-2">
              <div className="flex rounded-lg bg-slate-100 p-1 gap-1">
                <button
                  onClick={() => setBillingInterval('monthly')}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                    billingInterval === 'monthly'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingInterval('yearly')}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-1.5 ${
                    billingInterval === 'yearly'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Yearly
                  <span className="bg-emerald-100 text-emerald-700 text-xs font-semibold px-1.5 py-0.5 rounded-full">
                    Save 58%
                  </span>
                </button>
              </div>
            </div>

            {/* Pro plan card */}
            <div className="card border-indigo-200 bg-indigo-50 relative">
              <div className="absolute top-3 right-3">
                <span className="bg-indigo-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                  Most popular
                </span>
              </div>
              <div className="flex items-start justify-between pr-24">
                <div>
                  <h3 className="font-semibold text-indigo-900">Pro — Flat rate</h3>
                  <p className="text-sm text-indigo-700 mt-0.5">Simple, predictable pricing</p>
                </div>
                <div className="text-right">
                  {billingInterval === 'yearly' ? (
                    <>
                      <p className="text-2xl font-bold text-indigo-900">$95</p>
                      <p className="text-xs text-indigo-600">/year</p>
                      <p className="text-xs text-indigo-400 line-through mt-0.5">$228/yr</p>
                    </>
                  ) : (
                    <>
                      <p className="text-2xl font-bold text-indigo-900">$19</p>
                      <p className="text-xs text-indigo-600">/month</p>
                    </>
                  )}
                </div>
              </div>
              <ul className="mt-3 space-y-1.5 text-sm text-indigo-800">
                {['Unlimited invoices', 'Unlimited chase sequences', 'Custom email templates', 'Priority support'].map(f => (
                  <li key={f} className="flex items-center gap-2">
                    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="text-indigo-500 shrink-0">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {f}
                  </li>
                ))}
                {billingInterval === 'yearly' && (
                  <li className="flex items-center gap-2 text-emerald-700 font-medium">
                    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="shrink-0">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Save $133 vs monthly billing
                  </li>
                )}
              </ul>
              <button
                onClick={() => handleUpgrade(activePlan)}
                disabled={upgrading !== null}
                className="btn-primary w-full justify-center mt-4"
              >
                {isUpgradingActive
                  ? 'Redirecting to checkout…'
                  : billingInterval === 'yearly'
                  ? 'Start 14-day trial — then $95/yr →'
                  : 'Start 14-day free trial →'}
              </button>
              <InlineError forPlan={activePlan} />
              <p className="text-xs text-indigo-600 text-center mt-2">
                No card required during trial · Have a promo code? Enter it at checkout
              </p>
            </div>

            {/* Growth — 5% of invoices (only shown when STRIPE_5PCT_PRICE_ID is configured) */}
            {hasPercentPlan && (
              <div className="card border-slate-200">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900">Growth — Pay as you earn</h3>
                    <p className="text-sm text-slate-500 mt-0.5">Only pay when you get paid</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-slate-900">5%</p>
                    <p className="text-xs text-slate-500">of paid invoices</p>
                  </div>
                </div>
                <ul className="mt-3 space-y-1.5 text-sm text-slate-600">
                  {['Unlimited invoices', 'Unlimited chase sequences', 'Custom email templates', '$0/month if no invoices paid'].map(f => (
                    <li key={f} className="flex items-center gap-2">
                      <svg width="13" height="13" fill="none" stroke="#94a3b8" strokeWidth="2.5" viewBox="0 0 24 24" className="shrink-0">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleUpgrade('percent')}
                  disabled={upgrading !== null}
                  className="btn-secondary w-full justify-center mt-4"
                >
                  {upgrading === 'percent' ? 'Redirecting to checkout…' : 'Get started — 5% plan →'}
                </button>
                <InlineError forPlan="percent" />
                <p className="text-xs text-slate-400 text-center mt-2">Billed monthly based on collected invoices</p>
              </div>
            )}
          </>
        )}

        {/* Manage subscription — shown when on pro plan */}
        {isPro && (
          <div className="card">
            <h3 className="font-semibold text-slate-900 mb-1">Manage subscription</h3>
            <p className="text-sm text-slate-500 mb-4">
              Update payment method, cancel, or view invoices in the Stripe billing portal.
            </p>
            <button
              onClick={handlePortal}
              disabled={portalLoading}
              className="btn-secondary"
            >
              {portalLoading ? 'Opening portal…' : 'Open billing portal →'}
            </button>
            <InlineError forPlan="portal" />
          </div>
        )}

        <p className="text-xs text-slate-400 text-center">
          Payments processed securely by Stripe. Chase never stores your card details.
        </p>
      </div>
    </div>
  )
}
