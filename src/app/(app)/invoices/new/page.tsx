'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { Client } from '@/types'
import { DEFAULT_CHASE_STEPS } from '@/lib/invoice-utils'

interface LineItem {
  id: string
  description: string
  quantity: string
  rate: string
}

interface ChaseStep {
  id: string
  step_number: number
  days_after_sent: number
  label: string
  email_subject: string
  email_body: string
}

export default function NewInvoicePage() {
  const router = useRouter()
  const [clients, setClients] = useState<Client[]>([])
  const [clientId, setClientId] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [notes, setNotes] = useState('')
  const [items, setItems] = useState<LineItem[]>([
    { id: crypto.randomUUID(), description: '', quantity: '1', rate: '' },
  ])
  const [chaseSteps, setChaseSteps] = useState<ChaseStep[]>(
    DEFAULT_CHASE_STEPS.map(s => ({ ...s, id: crypto.randomUUID() }))
  )
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingClients, setLoadingClients] = useState(true)

  useEffect(() => {
    async function loadClients() {
      const res = await fetch('/api/clients')
      if (res.ok) {
        const { clients } = await res.json()
        setClients(clients)
        if (clients.length === 1) setClientId(clients[0].id)
      }
      setLoadingClients(false)
    }
    loadClients()

    // Default due date to 30 days from now
    const d = new Date()
    d.setDate(d.getDate() + 30)
    setDueDate(d.toISOString().split('T')[0])
  }, [])

  // When client changes, pre-fill rate
  useEffect(() => {
    const client = clients.find(c => c.id === clientId)
    if (client?.default_rate) {
      setItems(prev => prev.map((item, idx) =>
        idx === 0 && !item.rate ? { ...item, rate: String(client.default_rate) } : item
      ))
    }
  }, [clientId, clients])

  function addItem() {
    setItems(prev => [...prev, { id: crypto.randomUUID(), description: '', quantity: '1', rate: '' }])
  }

  function removeItem(id: string) {
    setItems(prev => prev.filter(i => i.id !== id))
  }

  function updateItem(id: string, field: keyof LineItem, value: string) {
    setItems(prev => prev.map(i => i.id === id ? { ...i, [field]: value } : i))
  }

  function updateChaseStep(id: string, field: keyof ChaseStep, value: string | number) {
    setChaseSteps(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s))
  }

  function removeChaseStep(id: string) {
    setChaseSteps(prev =>
      prev
        .filter(s => s.id !== id)
        .map((s, idx) => ({ ...s, step_number: idx + 1 }))
    )
  }

  function addChaseStep() {
    const lastDay = chaseSteps.length > 0
      ? chaseSteps[chaseSteps.length - 1].days_after_sent
      : 0
    const nextDay = lastDay + 7
    const newStep: ChaseStep = {
      id: crypto.randomUUID(),
      step_number: chaseSteps.length + 1,
      days_after_sent: nextDay,
      label: 'Custom Follow-up',
      email_subject: 'Following up: Invoice {{invoice_number}}',
      email_body: `Hi {{client_name}},\n\nJust following up on invoice {{invoice_number}} for {{invoice_amount}}.\n\nPlease let me know if you have any questions.`,
    }
    setChaseSteps(prev => [...prev, newStep])
  }

  const subtotal = items.reduce((sum, item) => {
    const qty = parseFloat(item.quantity) || 0
    const rate = parseFloat(item.rate) || 0
    return sum + qty * rate
  }, 0)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const validItems = items.filter(i => i.description.trim())
    if (validItems.length === 0) {
      setError('Add at least one line item with a description.')
      setLoading(false)
      return
    }

    const res = await fetch('/api/invoices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: clientId || null,
        due_date: dueDate || null,
        notes: notes || null,
        items: validItems.map((item, idx) => ({
          description: item.description,
          quantity: parseFloat(item.quantity) || 1,
          rate: parseFloat(item.rate) || 0,
          amount: (parseFloat(item.quantity) || 1) * (parseFloat(item.rate) || 0),
          sort_order: idx,
        })),
        // Chase sequence is always created — no toggle
        chase_steps: chaseSteps.map((s, idx) => ({
          step_number: idx + 1,
          days_after_sent: s.days_after_sent,
          email_subject: s.email_subject,
          email_body: s.email_body,
        })),
      }),
    })

    const data = await res.json()
    if (!res.ok) {
      setError(data.error || 'Failed to create invoice.')
      setLoading(false)
      return
    }

    router.push(`/invoices/${data.invoice.id}`)
    router.refresh()
  }

  const selectedClient = clients.find(c => c.id === clientId)

  return (
    <div>
      <div className="mb-8">
        <Link href="/dashboard" className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1 mb-4">
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to dashboard
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">New invoice</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Client & Date */}
            <div className="card space-y-5">
              <h2 className="font-semibold text-slate-900">Invoice details</h2>

              <div>
                <label className="label" htmlFor="client">Client</label>
                {loadingClients ? (
                  <div className="input text-slate-400">Loading clients…</div>
                ) : clients.length === 0 ? (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-sm text-amber-700">
                    No clients yet.{' '}
                    <Link href="/clients/new" className="font-medium underline">Add a client first</Link>.
                  </div>
                ) : (
                  <select
                    id="client"
                    className="input"
                    value={clientId}
                    onChange={e => setClientId(e.target.value)}
                  >
                    <option value="">— No client —</option>
                    {clients.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name}{c.company ? ` (${c.company})` : ''}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {selectedClient && (
                <div className="bg-indigo-50 border border-indigo-100 rounded-lg px-3 py-2 text-sm text-indigo-700">
                  Invoice will be sent to <strong>{selectedClient.email}</strong>
                </div>
              )}

              <div>
                <label className="label" htmlFor="dueDate">Due date</label>
                <input
                  id="dueDate"
                  type="date"
                  className="input"
                  value={dueDate}
                  onChange={e => setDueDate(e.target.value)}
                />
              </div>

              <div>
                <label className="label" htmlFor="notes">Notes (optional)</label>
                <textarea
                  id="notes"
                  className="input resize-none"
                  rows={2}
                  placeholder="Payment terms, project notes…"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                />
              </div>
            </div>

            {/* Line Items */}
            <div className="card">
              <h2 className="font-semibold text-slate-900 mb-4">Line items</h2>

              <div className="space-y-3">
                {/* Header */}
                <div className="grid grid-cols-12 gap-2 text-xs font-medium text-slate-500 uppercase tracking-wide px-1">
                  <div className="col-span-6">Description</div>
                  <div className="col-span-2 text-right">Qty</div>
                  <div className="col-span-2 text-right">Rate</div>
                  <div className="col-span-2 text-right">Amount</div>
                </div>

                {items.map(item => {
                  const amount = (parseFloat(item.quantity) || 0) * (parseFloat(item.rate) || 0)
                  return (
                    <div key={item.id} className="grid grid-cols-12 gap-2 items-center group">
                      <div className="col-span-6">
                        <input
                          type="text"
                          className="input text-sm"
                          placeholder="Design work…"
                          value={item.description}
                          onChange={e => updateItem(item.id, 'description', e.target.value)}
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          className="input text-sm text-right"
                          placeholder="1"
                          value={item.quantity}
                          onChange={e => updateItem(item.id, 'quantity', e.target.value)}
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          className="input text-sm text-right"
                          placeholder="0.00"
                          value={item.rate}
                          onChange={e => updateItem(item.id, 'rate', e.target.value)}
                        />
                      </div>
                      <div className="col-span-1 text-right text-sm font-medium text-slate-700">
                        ${amount.toFixed(2)}
                      </div>
                      <div className="col-span-1 text-right">
                        {items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="text-slate-300 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              <button
                type="button"
                onClick={addItem}
                className="mt-3 text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
              >
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                Add line item
              </button>
            </div>

            {/* Chase Sequence — always on, fully customizable */}
            <div className="card">
              <div className="flex items-center justify-between mb-1">
                <div>
                  <h2 className="font-semibold text-slate-900">Chase sequence</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Automated follow-up emails sent after the invoice is dispatched</p>
                </div>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  Always on
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {chaseSteps.map((step) => (
                  <div key={step.id} className="rounded-xl border border-slate-200 bg-white p-4">
                    {/* Step header */}
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-white bg-indigo-600 rounded-full w-5 h-5 flex items-center justify-center shrink-0">
                          {step.step_number}
                        </span>
                        <span className="text-xs text-slate-500">Send on day</span>
                        <input
                          type="number"
                          min="1"
                          max="365"
                          className="w-14 text-xs border border-slate-300 rounded px-1.5 py-1 text-center font-semibold text-indigo-700"
                          value={step.days_after_sent}
                          onChange={e => updateChaseStep(step.id, 'days_after_sent', parseInt(e.target.value) || 1)}
                        />
                        <span className="text-xs text-slate-500">after sending</span>
                      </div>
                      {chaseSteps.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeChaseStep(step.id)}
                          className="text-slate-300 hover:text-red-400 transition-colors shrink-0"
                          title="Remove step"
                        >
                          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M18 6L6 18M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>

                    {/* Subject */}
                    <div className="mb-2">
                      <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1 block">Subject</label>
                      <input
                        type="text"
                        className="input text-xs"
                        value={step.email_subject}
                        onChange={e => updateChaseStep(step.id, 'email_subject', e.target.value)}
                      />
                    </div>

                    {/* Body */}
                    <div>
                      <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1 block">Body</label>
                      <textarea
                        className="input text-xs resize-none"
                        rows={4}
                        value={step.email_body}
                        onChange={e => updateChaseStep(step.id, 'email_body', e.target.value)}
                      />
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addChaseStep}
                  className="w-full py-2.5 border border-dashed border-slate-300 rounded-xl text-sm text-slate-500 hover:border-indigo-400 hover:text-indigo-600 transition-colors flex items-center justify-center gap-1.5"
                >
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  Add follow-up step
                </button>

                <p className="text-xs text-slate-400">
                  Variables: {'{{client_name}}'}, {'{{invoice_amount}}'}, {'{{due_date}}'}, {'{{invoice_number}}'}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar summary */}
          <div>
            <div className="card sticky top-8">
              <h2 className="font-semibold text-slate-900 mb-4">Summary</h2>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Subtotal</span>
                  <span className="font-medium text-slate-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-semibold border-t border-slate-100 pt-2">
                  <span className="text-slate-900">Total</span>
                  <span className="text-slate-900">${subtotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="mb-4 bg-slate-50 rounded-lg px-3 py-2.5">
                <p className="text-xs text-slate-500 font-medium mb-1">Chase sequence</p>
                <p className="text-xs text-slate-600">{chaseSteps.length} follow-up{chaseSteps.length !== 1 ? 's' : ''} scheduled</p>
                {chaseSteps.length > 0 && (
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Day {chaseSteps.map(s => s.days_after_sent).join(', ')}
                  </p>
                )}
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">
                  {error}
                </p>
              )}

              <button type="submit" className="btn-primary w-full justify-center" disabled={loading}>
                {loading ? 'Creating…' : 'Create invoice'}
              </button>
              <p className="text-xs text-slate-400 text-center mt-2">
                You&apos;ll send it from the invoice page
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
