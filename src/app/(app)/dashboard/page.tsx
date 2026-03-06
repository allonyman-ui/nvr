import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { formatCurrency, formatDate, isOverdue } from '@/lib/invoice-utils'
import StatusBadge from '@/components/StatusBadge'
import type { Invoice, InvoiceStatus } from '@/types'

export const metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Redirect to onboarding if not completed
  const { data: profile } = await supabase
    .from('profiles')
    .select('name, business_name, onboarding_completed, subscription_status')
    .eq('id', user.id)
    .single()

  if (!profile?.onboarding_completed) redirect('/onboarding')

  // Fetch invoices with client
  const { data: rawInvoices } = await supabase
    .from('invoices')
    .select('*, client:clients(name, email, company)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  // Fetch upcoming chase sequences (next 7 days)
  const today = new Date().toISOString().split('T')[0]
  const in7Days = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
  const { data: upcomingChases } = await supabase
    .from('chase_sequences')
    .select('*, invoice:invoices(invoice_number, total_amount, client:clients(name))')
    .eq('status', 'pending')
    .gte('scheduled_date', today)
    .lte('scheduled_date', in7Days)
    .order('scheduled_date', { ascending: true })
    .limit(10)

  const invoices = (rawInvoices ?? []) as (Invoice & { client?: { name: string; email: string; company: string | null } })[]

  // Auto-mark overdue
  const enriched = invoices.map(inv => ({
    ...inv,
    status: (isOverdue(inv) && inv.status === 'sent' ? 'overdue' : inv.status) as InvoiceStatus,
  }))

  // Stats
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const totalOutstanding = enriched
    .filter(i => i.status === 'sent' || i.status === 'overdue')
    .reduce((sum, i) => sum + Number(i.total_amount), 0)
  const totalPaidThisMonth = enriched
    .filter(i => i.status === 'paid' && i.paid_at && new Date(i.paid_at) >= startOfMonth)
    .reduce((sum, i) => sum + Number(i.total_amount), 0)
  const overdueCount = enriched.filter(i => i.status === 'overdue').length

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Good {getTimeOfDay()}, {profile?.name?.split(' ')[0] ?? 'there'} 👋
          </h1>
          <p className="text-slate-500 text-sm mt-1">{profile?.business_name}</p>
        </div>
        <Link href="/invoices/new" className="btn-primary">
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 5v14M5 12h14" />
          </svg>
          New Invoice
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="card">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Outstanding</p>
          <p className="text-2xl font-bold text-slate-900">{formatCurrency(totalOutstanding)}</p>
          {overdueCount > 0 && (
            <p className="text-xs text-red-600 mt-1">{overdueCount} overdue</p>
          )}
        </div>
        <div className="card">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Paid this month</p>
          <p className="text-2xl font-bold text-emerald-600">{formatCurrency(totalPaidThisMonth)}</p>
        </div>
        <div className="card">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Active invoices</p>
          <p className="text-2xl font-bold text-slate-900">
            {enriched.filter(i => i.status === 'sent' || i.status === 'overdue').length}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Invoice List */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-slate-900">Invoices</h2>
          </div>

          {enriched.length === 0 ? (
            <div className="card text-center py-16">
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg width="22" height="22" fill="none" stroke="#94a3b8" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="12" y1="12" x2="12" y2="18" />
                  <line x1="9" y1="15" x2="15" y2="15" />
                </svg>
              </div>
              <p className="text-slate-600 font-medium mb-1">No invoices yet</p>
              <p className="text-slate-400 text-sm mb-4">Create your first invoice and Chase will handle the follow-ups.</p>
              <Link href="/invoices/new" className="btn-primary">
                Create first invoice
              </Link>
            </div>
          ) : (
            <div className="card p-0 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Invoice</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Client</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Amount</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Due</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {enriched.slice(0, 10).map(inv => (
                    <tr key={inv.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <Link href={`/invoices/${inv.id}`} className="font-medium text-indigo-600 hover:underline">
                          {inv.invoice_number}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {inv.client?.name ?? <span className="text-slate-400 italic">No client</span>}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {formatCurrency(Number(inv.total_amount))}
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {formatDate(inv.due_date)}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={inv.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Upcoming chases */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-slate-900">Upcoming follow-ups</h2>
          </div>

          {!upcomingChases || upcomingChases.length === 0 ? (
            <div className="card text-center py-10">
              <p className="text-slate-400 text-sm">No follow-ups in the next 7 days.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {upcomingChases.map((chase: Record<string, unknown>) => {
                const invoice = chase.invoice as { invoice_number: string; total_amount: number; client: { name: string } | null } | null
                return (
                  <div key={chase.id as string} className="card py-3 px-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          {invoice?.invoice_number}
                          {invoice?.client?.name && (
                            <span className="text-slate-500 font-normal"> · {invoice.client.name}</span>
                          )}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Step {chase.step_number as number} · {formatDate(chase.scheduled_date as string)}
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-slate-700">
                        {formatCurrency(Number(invoice?.total_amount ?? 0))}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function getTimeOfDay(): string {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}
