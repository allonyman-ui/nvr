import type { InvoiceStatus } from '@/types'

const configs: Record<InvoiceStatus, { label: string; className: string }> = {
  draft: {
    label: 'Draft',
    className: 'bg-slate-100 text-slate-600',
  },
  sent: {
    label: 'Sent',
    className: 'bg-blue-50 text-blue-700',
  },
  overdue: {
    label: 'Overdue',
    className: 'bg-red-50 text-red-700',
  },
  paid: {
    label: 'Paid',
    className: 'bg-emerald-50 text-emerald-700',
  },
  cancelled: {
    label: 'Cancelled',
    className: 'bg-slate-100 text-slate-500',
  },
}

export default function StatusBadge({ status }: { status: InvoiceStatus }) {
  const { label, className } = configs[status] ?? configs.draft
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${className}`}>
      {label}
    </span>
  )
}
