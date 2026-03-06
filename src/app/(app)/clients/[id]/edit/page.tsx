'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

export default function EditClientPage() {
  const router = useRouter()
  const params = useParams()
  const clientId = params.id as string

  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    default_rate: '',
  })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      setLoading(true)
      const res = await fetch(`/api/clients/${clientId}`)
      if (res.ok) {
        const { client } = await res.json()
        setForm({
          name: client.name,
          email: client.email,
          company: client.company ?? '',
          default_rate: client.default_rate ? String(client.default_rate) : '',
        })
      }
      setLoading(false)
    }
    load()
  }, [clientId])

  function update(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSaving(true)

    const res = await fetch(`/api/clients/${clientId}`, {
      method: 'PATCH',
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
      setError(data.error || 'Failed to update client.')
      setSaving(false)
      return
    }

    router.push('/clients')
    router.refresh()
  }

  async function handleDelete() {
    if (!confirm('Delete this client? Their invoices will not be deleted.')) return
    const res = await fetch(`/api/clients/${clientId}`, { method: 'DELETE' })
    if (res.ok) {
      router.push('/clients')
      router.refresh()
    }
  }

  if (loading) {
    return <div className="text-slate-500 text-sm">Loading…</div>
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
        <h1 className="text-2xl font-bold text-slate-900">Edit client</h1>
      </div>

      <div className="max-w-lg">
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label" htmlFor="name">Full name <span className="text-red-500">*</span></label>
              <input id="name" type="text" className="input" value={form.name} onChange={e => update('name', e.target.value)} required />
            </div>
            <div>
              <label className="label" htmlFor="email">Email <span className="text-red-500">*</span></label>
              <input id="email" type="email" className="input" value={form.email} onChange={e => update('email', e.target.value)} required />
            </div>
            <div>
              <label className="label" htmlFor="company">Company</label>
              <input id="company" type="text" className="input" value={form.company} onChange={e => update('company', e.target.value)} />
            </div>
            <div>
              <label className="label" htmlFor="rate">Default hourly rate ($)</label>
              <input id="rate" type="number" step="0.01" min="0" className="input" value={form.default_rate} onChange={e => update('default_rate', e.target.value)} />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
            )}

            <div className="flex gap-3">
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? 'Saving…' : 'Save changes'}
              </button>
              <Link href="/clients" className="btn-secondary">Cancel</Link>
            </div>
          </form>
        </div>

        <div className="mt-4">
          <button onClick={handleDelete} className="btn-danger text-sm">
            Delete client
          </button>
        </div>
      </div>
    </div>
  )
}
