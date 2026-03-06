import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { getStripe } from '@/lib/stripe'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Admin' }

const MONTHLY_PRICE = 19

function fmt$(n: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(n)
}

function fmtDate(d: string | null | undefined) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function fmtDateTime(ts: number) {
  return new Date(ts * 1000).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function SubBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    active:   'bg-emerald-50 text-emerald-700 border border-emerald-200',
    trialing: 'bg-amber-50  text-amber-700  border border-amber-200',
    past_due: 'bg-red-50    text-red-700    border border-red-200',
    canceled: 'bg-slate-100 text-slate-500',
    free:     'bg-slate-100 text-slate-500',
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${styles[status] ?? styles.free}`}>
      {status}
    </span>
  )
}

function KpiCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string
  value: string | number
  sub?: string
  accent?: string
}) {
  return (
    <div className="card">
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">{label}</p>
      <p className={`text-2xl font-bold ${accent ?? 'text-slate-900'}`}>{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
    </div>
  )
}

export default async function AdminPage() {
  // ── Auth ──
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const adminEmail = process.env.ADMIN_EMAIL?.trim()
  if (adminEmail && user.email !== adminEmail) redirect('/dashboard')

  // ── Master password gate ──
  if (process.env.ADMIN_PASSWORD) {
    const jar = await cookies()
    const unlocked = jar.get('admin_unlocked')?.value
    if (unlocked !== (adminEmail ?? 'yes')) {
      redirect('/admin/unlock')
    }
  }

  // ── Fetch all profiles (bypasses RLS) ──
  const svc = createServiceClient()

  const { data: rawProfiles } = await svc
    .from('profiles')
    .select('id, email, created_at, subscription_status, onboarding_completed, trial_ends_at, signup_source')
    .order('created_at', { ascending: false })

  const profiles = rawProfiles ?? []

  // ── Profile aggregations ──
  const totalSignups   = profiles.length
  const onboarded      = profiles.filter(p => p.onboarding_completed).length
  const paidUsers      = profiles.filter(p => p.subscription_status === 'active').length
  const trialUsers     = profiles.filter(p => p.subscription_status === 'trialing').length
  const pastDueUsers   = profiles.filter(p => p.subscription_status === 'past_due').length
  const freeUsers      = profiles.filter(p => !p.subscription_status || p.subscription_status === 'free').length
  const canceledUsers  = profiles.filter(p => p.subscription_status === 'canceled').length
  const mrr            = (paidUsers + pastDueUsers) * MONTHLY_PRICE
  const arr            = mrr * 12

  const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000)
  const signupsLast30 = profiles.filter(p => new Date(p.created_at) >= thirtyDaysAgo).length

  // ── Invoice stats ──
  const { data: rawInvoices } = await svc
    .from('invoices')
    .select('status, total_amount')

  const allInvoices   = rawInvoices ?? []
  const totalInvoices = allInvoices.length
  const paidInvoices  = allInvoices.filter(i => i.status === 'paid')
  const paidRevenue   = paidInvoices.reduce((s, i) => s + Number(i.total_amount), 0)

  // ── Chase sequence stats ──
  const { data: rawChases } = await svc.from('chase_sequences').select('status')
  const chaseEmailsSent = (rawChases ?? []).filter(c => c.status === 'sent').length

  // ── Stripe: recent charges ──
  type Charge = {
    id: string
    amount: number
    currency: string
    created: number
    status: string
    description: string | null
    receipt_email: string | null
  }
  let recentCharges: Charge[] = []
  let stripeError = false
  try {
    const stripe = getStripe()
    const list = await stripe.charges.list({ limit: 10 })
    recentCharges = list.data.map(c => ({
      id: c.id,
      amount: c.amount,
      currency: c.currency,
      created: c.created,
      status: c.status,
      description: c.description,
      receipt_email: c.receipt_email,
    }))
  } catch {
    stripeError = true
  }

  // ── Plan breakdown bars ──
  const planBreakdown = [
    { label: 'Paid (active)', count: paidUsers,     color: 'bg-emerald-500' },
    { label: 'Trialing',      count: trialUsers,    color: 'bg-amber-400'   },
    { label: 'Free',          count: freeUsers,     color: 'bg-slate-300'   },
    { label: 'Past due',      count: pastDueUsers,  color: 'bg-red-400'     },
    { label: 'Cancelled',     count: canceledUsers, color: 'bg-slate-200'   },
  ].filter(p => p.count > 0)
  const maxPlanCount = Math.max(...planBreakdown.map(p => p.count), 1)

  // ── Funnel steps ──
  const funnel = [
    { label: 'Signed up',  count: totalSignups, color: 'bg-slate-400'   },
    { label: 'Onboarded',  count: onboarded,    color: 'bg-indigo-400'  },
    { label: 'On trial',   count: trialUsers,   color: 'bg-amber-400'   },
    { label: 'Paid',       count: paidUsers,    color: 'bg-emerald-500' },
  ]

  const pct = (n: number, of: number) =>
    of > 0 ? Math.round((n / of) * 100) : 0

  return (
    <div>
      {/* ── Header ── */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Admin</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Chase Dashboard</h1>
        <p className="text-sm text-slate-400 mt-0.5">Signed in as {user.email}</p>
      </div>

      {/* ── KPI Row 1 ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
        <KpiCard
          label="Total Signups"
          value={totalSignups.toLocaleString()}
          sub={`+${signupsLast30} last 30 days`}
        />
        <KpiCard
          label="MRR"
          value={fmt$(mrr)}
          sub={`${paidUsers} paid · ${pastDueUsers} past due`}
          accent="text-emerald-600"
        />
        <KpiCard
          label="Paid Users"
          value={paidUsers}
          sub={`${pct(paidUsers, totalSignups)}% of signups`}
        />
        <KpiCard
          label="On Trial"
          value={trialUsers}
          sub={`${pct(trialUsers, totalSignups)}% of signups`}
          accent="text-amber-600"
        />
      </div>

      {/* ── KPI Row 2 ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <KpiCard
          label="Free Users"
          value={freeUsers}
          sub={`${onboarded} onboarded`}
        />
        <KpiCard
          label="Invoices Created"
          value={totalInvoices.toLocaleString()}
          sub={`${paidInvoices.length} paid`}
        />
        <KpiCard
          label="Chase Emails Sent"
          value={chaseEmailsSent.toLocaleString()}
          sub="follow-up emails"
          accent="text-indigo-600"
        />
        <KpiCard
          label="Revenue via Chase"
          value={fmt$(paidRevenue)}
          sub="total paid invoices"
          accent="text-emerald-600"
        />
      </div>

      {/* ── Three-column middle row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

        {/* Conversion funnel */}
        <div className="card">
          <h2 className="font-semibold text-slate-900 mb-5">Conversion Funnel</h2>
          <div className="space-y-4">
            {funnel.map(step => (
              <div key={step.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-slate-600">{step.label}</span>
                  <span className="text-sm font-semibold text-slate-900">{step.count.toLocaleString()}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${step.color}`}
                    style={{ width: `${pct(step.count, totalSignups)}%` }}
                  />
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{pct(step.count, totalSignups)}%</p>
              </div>
            ))}
          </div>
        </div>

        {/* Plan breakdown + ARR */}
        <div className="card">
          <h2 className="font-semibold text-slate-900 mb-5">Plan Breakdown</h2>
          {planBreakdown.length === 0 ? (
            <p className="text-sm text-slate-400">No users yet.</p>
          ) : (
            <div className="space-y-3">
              {planBreakdown.map(plan => (
                <div key={plan.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-slate-600">{plan.label}</span>
                    <span className="text-sm font-semibold text-slate-900">{plan.count}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${plan.color}`}
                      style={{ width: `${(plan.count / maxPlanCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="mt-6 pt-4 border-t border-slate-100">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">ARR</p>
            <p className="text-xl font-bold text-slate-900">{fmt$(arr)}</p>
            <p className="text-xs text-slate-400">annualised at current MRR</p>
          </div>
        </div>

        {/* Operational health */}
        <div className="card">
          <h2 className="font-semibold text-slate-900 mb-5">Operational Health</h2>
          <div className="space-y-0">
            {[
              { label: 'Onboarding rate',    value: `${pct(onboarded, totalSignups)}%`,                          highlight: false },
              { label: 'Trial → Paid rate',  value: `${pct(paidUsers, trialUsers + paidUsers)}%`,                highlight: true  },
              { label: 'Avg invoices/user',  value: totalSignups > 0 ? (totalInvoices / totalSignups).toFixed(1) : '—', highlight: false },
              { label: 'Past due accounts',  value: pastDueUsers,  highlight: pastDueUsers > 0 },
              { label: 'Cancelled',          value: canceledUsers, highlight: false },
              { label: 'Chase emails/inv',   value: totalInvoices > 0 ? (chaseEmailsSent / totalInvoices).toFixed(1) : '—', highlight: false },
            ].map((row, i, arr) => (
              <div key={row.label} className={`flex items-center justify-between py-2.5 ${i < arr.length - 1 ? 'border-b border-slate-50' : ''}`}>
                <span className="text-sm text-slate-600">{row.label}</span>
                <span className={`text-sm font-semibold ${row.highlight ? (typeof row.value === 'number' && row.value > 0 ? 'text-red-600' : 'text-emerald-600') : 'text-slate-900'}`}>
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Recent Stripe Charges ── */}
      <div className="card mb-6">
        <h2 className="font-semibold text-slate-900 mb-4">
          Recent Stripe Charges
          <span className="text-slate-400 font-normal text-sm ml-2">— last 10</span>
        </h2>
        {stripeError ? (
          <p className="text-sm text-red-500">Could not load Stripe data. Check STRIPE_SECRET_KEY.</p>
        ) : recentCharges.length === 0 ? (
          <p className="text-sm text-slate-400">No charges yet.</p>
        ) : (
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full text-sm min-w-[600px]">
              <thead>
                <tr className="border-b border-slate-100">
                  {['Date', 'Email', 'Description', 'Amount', 'Status'].map(h => (
                    <th key={h} className={`py-2 px-3 text-xs font-medium text-slate-500 uppercase tracking-wide ${h === 'Amount' ? 'text-right' : 'text-left'}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentCharges.map(charge => (
                  <tr key={charge.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-3 text-slate-500 whitespace-nowrap">
                      {fmtDateTime(charge.created)}
                    </td>
                    <td className="py-2.5 px-3 text-slate-700 max-w-[180px] truncate">
                      {charge.receipt_email ?? <span className="text-slate-400">—</span>}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500 max-w-[180px] truncate">
                      {charge.description ?? '—'}
                    </td>
                    <td className="py-2.5 px-3 text-right font-semibold text-slate-900 whitespace-nowrap">
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: charge.currency.toUpperCase(),
                      }).format(charge.amount / 100)}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        charge.status === 'succeeded'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}>
                        {charge.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Recent Signups ── */}
      <div className="card">
        <h2 className="font-semibold text-slate-900 mb-4">
          Recent Signups
          <span className="text-slate-400 font-normal text-sm ml-2">— last 15</span>
        </h2>
        {profiles.length === 0 ? (
          <p className="text-sm text-slate-400">No signups yet.</p>
        ) : (
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full text-sm min-w-[500px]">
              <thead>
                <tr className="border-b border-slate-100">
                  {['User', 'Joined', 'Plan', 'Source', 'Onboarded'].map(h => (
                    <th key={h} className="text-left py-2 px-3 text-xs font-medium text-slate-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {profiles.slice(0, 15).map(profile => (
                  <tr key={profile.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xs font-semibold flex-shrink-0">
                          {(profile.email?.[0] ?? '?').toUpperCase()}
                        </div>
                        <span className="text-slate-700 truncate max-w-[200px]">{profile.email}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-500 whitespace-nowrap">
                      {fmtDate(profile.created_at)}
                    </td>
                    <td className="py-2.5 px-3">
                      <SubBadge status={profile.subscription_status ?? 'free'} />
                    </td>
                    <td className="py-2.5 px-3">
                      {(profile as { signup_source?: string }).signup_source ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200 max-w-[120px] truncate">
                          {(profile as { signup_source?: string }).signup_source}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">—</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3">
                      {profile.onboarding_completed
                        ? <span className="text-emerald-600 text-xs font-medium">✓ Yes</span>
                        : <span className="text-slate-400 text-xs">No</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
