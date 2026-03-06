'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

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

    const { error } = await supabase
      .from('profiles')
      .update({
        name,
        business_name: businessName,
        reply_to_email: replyToEmail || user.email,
        onboarding_completed: true,
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
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-600 rounded-xl mb-4">
            <span className="text-white font-bold text-xl">C</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Set up your account</h1>
          <p className="text-slate-500 text-sm mt-1">This takes 30 seconds, then you&apos;re ready to send invoices.</p>
        </div>

        <div className="card">
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
              <p className="text-xs text-slate-400 mt-1">This appears on your invoices and follow-up emails.</p>
            </div>

            <div>
              <label className="label" htmlFor="replyTo">Reply-to email</label>
              <input
                id="replyTo"
                type="email"
                className="input"
                placeholder="jane@smithdesign.com"
                value={replyToEmail}
                onChange={e => setReplyToEmail(e.target.value)}
              />
              <p className="text-xs text-slate-400 mt-1">
                Clients who reply to your invoices will reach this address. Leave blank to use your login email.
              </p>
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button type="submit" className="btn-primary w-full justify-center" disabled={loading}>
              {loading ? 'Saving…' : 'Continue to free trial →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
