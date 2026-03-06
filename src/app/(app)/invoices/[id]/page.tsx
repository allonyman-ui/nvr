'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import StatusBadge from '@/components/StatusBadge'
import { formatCurrency, formatDate, formatDateShort } from '@/lib/invoice-utils'
import type { Invoice, ChaseSequence, InvoiceStatus } from '@/types'

type ChaseStepStatus = 'pending' | 'sent' | 'cancelled' | 'skipped'

const chaseStatusConfig: Record<ChaseStepStatus, { label: string; className: string }> = {
  pending: { label: 'Scheduled', className: 'text-blue-600 bg-blue-50' },
  sent: { label: 'Sent', className: 'text-emerald-600 bg-emerald-50' },
  cancelled: { label: 'Cancelled', className: 'text-slate-500 bg-slate-100' },
  skipped: { label: 'Skipped', className: 'text-slate-500 bg-slate-100' },
}

export default function InvoicePage() {
  const params = useParams()
  const router = useRouter()
  const invoiceId = params.id as string

  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const [error, setError] = useState('')
  const [sendSuccess, setSendSuccess] = useState(false)

  const loadInvoice = useCallback(async () => {
    const res = await fetch(`/api/invoices/${invoiceId}`)
    if (res.ok) {
      const data = await res.json()
      setInvoice(data.invoice)
    }
    setLoading(false)
  }, [invoiceId])

  useEffect(() => {
    loadInvoice()
  }, [loadInvoice])

  async function handleSend() {
    if (!invoice) return
    setError('')
    setSending(true)

    const res = await fetch(`/api/invoices/${invoiceId}/send`, {
      method: 'POST',
    })
    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Failed to send invoice.')
      setSending(false)
      return
    }

    setSendSuccess(true)
    setSending(false)
    await loadInvoice()
  }

  async function handleCancelChase() {
    setCancelling(true)
    await fetch(`/api/invoices/${invoiceId}/cancel-chase`, { method: 'POST' })
    setCancelling(false)
    await loadInvoice()
  }

  async function handleMarkPaid() {
    if (!confirm('Mark this invoice as paid?')) return
    await fetch(`/api/invoices/${invoiceId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'paid', paid_at: new Date().toISOString() }),
    })
    await loadInvoice()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!invoice) {
    return (
      <div className="text-center py-24">
        <p className="text-slate-500">Invoice not found.</p>
        <Link href="/dashboard" className="text-indigo-600 text-sm mt-2 block">← Back to dashboard</Link>
      </div>
    )
  }

  const isPaid = invoice.status === 'paid'
  const isCancelled = invoice.status === 'cancelled'
  const isDraft = invoice.status === 'draft'
  const activeSequence = (invoice.chase_sequences ?? []).some(s => s.status === 'pending')

  return (
    <div>
      {/* Back + Header */}
      <div className="mb-8">
        <Link href="/dashboard" className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1 mb-4">
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to dashboard
        </Link>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900">{invoice.invoice_number}</h1>
              <StatusBadge status={invoice.status as InvoiceStatus} />
            </div>
            {invoice.client && (
              <p className="text-slate-500 text-sm mt-1">
                {invoice.client.name}
                {invoice.client.company && ` · ${invoice.client.company}`}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {isDraft && (
              <button
                onClick={handleSend}
                disabled={sending}
                className="btn-primary"
              >
                {sending ? 'Sending…' : (
                  <>
                    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                    Send invoice
                  </>
                )}
              </button>
            )}
            {(invoice.status === 'sent' || invoice.status === 'overdue') && !isPaid && (
              <button onClick={handleMarkPaid} className="btn-secondary text-emerald-700 border-emerald-200 hover:bg-emerald-50">
                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Mark paid
              </button>
            )}
            {activeSequence && !isPaid && (
              <button
                onClick={handleCancelChase}
                disabled={cancelling}
                className="btn-secondary"
              >
                {cancelling ? 'Stopping…' : 'Stop chase'}
              </button>
            )}
          </div>
        </div>
      </div>

      {sendSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3 mb-6 text-sm text-emerald-700 flex items-center gap-2">
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Invoice sent successfully! Chase sequence is now active.
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-6 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Invoice details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Summary card */}
          <div className="card">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">Amount</p>
                <p className="text-2xl font-bold text-slate-900">{formatCurrency(Number(invoice.total_amount))}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">Due</p>
                <p className="text-base font-semibold text-slate-900">{formatDate(invoice.due_date)}</p>
              </div>
              {invoice.sent_at && (
                <div>
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">Sent</p>
                  <p className="text-base font-semibold text-slate-900">{formatDate(invoice.sent_at)}</p>
                </div>
              )}
              {invoice.paid_at && (
                <div>
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">Paid</p>
                  <p className="text-base font-semibold text-emerald-600">{formatDate(invoice.paid_at)}</p>
                </div>
              )}
            </div>

            {/* Line items */}
            <div className="border-t border-slate-100 pt-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    <th className="text-left pb-2">Description</th>
                    <th className="text-right pb-2">Qty</th>
                    <th className="text-right pb-2">Rate</th>
                    <th className="text-right pb-2">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {(invoice.items ?? []).map(item => (
                    <tr key={item.id} className="border-t border-slate-50">
                      <td className="py-2 text-slate-700">{item.description}</td>
                      <td className="py-2 text-right text-slate-600">{item.quantity}</td>
                      <td className="py-2 text-right text-slate-600">{formatCurrency(item.rate)}</td>
                      <td className="py-2 text-right font-medium text-slate-900">{formatCurrency(item.amount)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-slate-200">
                    <td colSpan={3} className="pt-3 text-right font-semibold text-slate-700">Total</td>
                    <td className="pt-3 text-right font-bold text-slate-900 text-base">
                      {formatCurrency(Number(invoice.total_amount))}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {invoice.notes && (
              <div className="border-t border-slate-100 pt-4 mt-4">
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">Notes</p>
                <p className="text-sm text-slate-600">{invoice.notes}</p>
              </div>
            )}

            {invoice.stripe_payment_link && (
              <div className="border-t border-slate-100 pt-4 mt-4">
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-2">Payment link</p>
                <a
                  href={invoice.stripe_payment_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-indigo-600 hover:underline flex items-center gap-1 break-all"
                >
                  {invoice.stripe_payment_link}
                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Chase Sequence */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-slate-900">Chase sequence</h2>
          </div>

          {!invoice.chase_sequences || invoice.chase_sequences.length === 0 ? (
            <div className="card text-center py-8">
              <p className="text-sm text-slate-500">
                {isDraft ? 'Send the invoice to activate chase.' : 'No chase sequence.'}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {invoice.chase_sequences
                .sort((a: ChaseSequence, b: ChaseSequence) => a.step_number - b.step_number)
                .map((step: ChaseSequence) => {
                  const conf = chaseStatusConfig[step.status as ChaseStepStatus] ?? chaseStatusConfig.pending
                  return (
                    <div key={step.id} className={`card py-3 px-4 ${step.status === 'cancelled' ? 'opacity-50' : ''}`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-slate-700">Step {step.step_number}</span>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded ${conf.className}`}>
                          {conf.label}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 font-medium truncate">{step.email_subject}</p>
                      <p className="text-xs text-slate-400 mt-1">
                        {step.status === 'sent' && step.sent_at
                          ? `Sent ${formatDateShort(step.sent_at)}`
                          : formatDateShort(step.scheduled_date)}
                      </p>
                    </div>
                  )
                })}
            </div>
          )}

          {isPaid && (
            <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3 text-sm text-emerald-700 text-center">
              Invoice paid — chase complete! 🎉
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
