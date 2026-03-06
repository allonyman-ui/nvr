'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NewClientPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    default_rate: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function update(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await fetch('/api/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        company: form.company || null,
        default_rate: form.default_rate ? parseFloat(form.default_rate) : null,
      }),
    })

    const data = await res.json()
    if (!res.ok) {
      setError(data.error || 'Failed to create client.')
      setLoading(false)
      return
    }

    router.push('/clients')
    router.refresh()
  }

  return (
    <div>
      <div className="mb-8">
        <Link href="/clients" className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1 mb-4">
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to clients
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Add client</h1>
      </div>

      <div className="max-w-lg">
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label" htmlFor="name">Full name <span className="text-red-500">*</span></label>
              <input
                id="name"
                type="text"
                className="input"
                placeholder="Alex Johnson"
                value={form.name}
                onChange={e => update('name', e.target.value)}
                required
              />
            </div>
            <div>
              <label className="label" htmlFor="email">Email <span className="text-red-500">*</span></label>
              <input
                id="email"
                type="email"
                className="input"
                placeholder="alex@company.com"
                value={form.email}
                onChange={e => update('email', e.target.value)}
                required
              />
            </div>
            <div>
              <label className="label" htmlFor="company">Company</label>
              <input
                id="company"
                type="text"
                className="input"
                placeholder="Acme Corp"
                value={form.company}
                onChange={e => update('company', e.target.value)}
              />
            </div>
            <div>
              <label className="label" htmlFor="rate">Default hourly rate ($)</label>
              <input
                id="rate"
                type="number"
                step="0.01"
                min="0"
                className="input"
                placeholder="150.00"
                value={form.default_rate}
                onChange={e => update('default_rate', e.target.value)}
              />
              <p className="text-xs text-slate-400 mt-1">Pre-fills the rate when creating invoices for this client.</p>
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <div className="flex gap-3">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Saving…' : 'Add client'}
              </button>
              <Link href="/clients" className="btn-secondary">Cancel</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
