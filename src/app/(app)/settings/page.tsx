'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function SettingsPage() {
  const [form, setForm] = useState({
    name: '',
    business_name: '',
    reply_to_email: '',
    email_signature: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase
        .from('profiles')
        .select('name, business_name, reply_to_email, email_signature')
        .eq('id', user.id)
        .single()

      if (profile) {
        setForm({
          name: profile.name ?? '',
          business_name: profile.business_name ?? '',
          reply_to_email: profile.reply_to_email ?? '',
          email_signature: profile.email_signature ?? '',
        })
      }
      setLoading(false)
    }
    load()
  }, [])

  function update(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
    setSuccess(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSaving(true)
    setSuccess(false)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('profiles')
      .update({
        name: form.name,
        business_name: form.business_name,
        reply_to_email: form.reply_to_email || null,
        email_signature: form.email_signature,
      })
      .eq('id', user.id)

    setSaving(false)
    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
    }
  }

  if (loading) {
    return <div className="text-slate-500 text-sm">Loading…</div>
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500 text-sm mt-1">Manage your profile and email preferences</p>
      </div>

      <div className="max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile */}
          <div className="card space-y-5">
            <h2 className="font-semibold text-slate-900">Profile</h2>

            <div>
              <label className="label" htmlFor="name">Your name</label>
              <input id="name" type="text" className="input" value={form.name} onChange={e => update('name', e.target.value)} />
            </div>
            <div>
              <label className="label" htmlFor="business_name">Business name</label>
              <input id="business_name" type="text" className="input" value={form.business_name} onChange={e => update('business_name', e.target.value)} />
              <p className="text-xs text-slate-400 mt-1">Shown on invoices and follow-up emails</p>
            </div>
            <div>
              <label className="label" htmlFor="reply_to">Reply-to email</label>
              <input
                id="reply_to"
                type="email"
                className="input"
                placeholder="your@email.com"
                value={form.reply_to_email}
                onChange={e => update('reply_to_email', e.target.value)}
              />
              <p className="text-xs text-slate-400 mt-1">Clients who reply to invoices will reach this address</p>
            </div>
          </div>

          {/* Email signature */}
          <div className="card space-y-4">
            <div>
              <h2 className="font-semibold text-slate-900">Email signature</h2>
              <p className="text-xs text-slate-500 mt-0.5">Appended to all invoice and follow-up emails</p>
            </div>
            <textarea
              id="signature"
              className="input resize-none"
              rows={4}
              placeholder={`Jane Smith\nSmith Design Studio\n+1 555 123 4567`}
              value={form.email_signature}
              onChange={e => update('email_signature', e.target.value)}
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
          )}
          {success && (
            <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 flex items-center gap-2">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Settings saved
            </p>
          )}

          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Saving…' : 'Save settings'}
          </button>
        </form>
      </div>
    </div>
  )
}
