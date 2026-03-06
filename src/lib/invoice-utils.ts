export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatDateShort(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

export function toDateString(date: Date): string {
  return date.toISOString().split('T')[0]
}

export function isOverdue(invoice: { due_date: string | null; status: string }): boolean {
  if (invoice.status === 'paid' || invoice.status === 'cancelled' || invoice.status === 'draft') return false
  if (!invoice.due_date) return false
  return new Date(invoice.due_date) < new Date()
}

// Default chase email templates
export const DEFAULT_CHASE_STEPS = [
  {
    step_number: 1,
    days_after_sent: 3,
    label: 'Friendly Reminder',
    email_subject: 'Friendly reminder: Invoice {{invoice_number}} due {{due_date}}',
    email_body: `Hi {{client_name}},

Just a friendly reminder that invoice {{invoice_number}} for {{invoice_amount}} is due on {{due_date}}.

If you've already sent payment, please disregard this message.

Thank you!`,
  },
  {
    step_number: 2,
    days_after_sent: 7,
    label: 'Check-in',
    email_subject: 'Following up: Invoice {{invoice_number}}',
    email_body: `Hi {{client_name}},

I wanted to follow up on invoice {{invoice_number}} for {{invoice_amount}}, which was due on {{due_date}}.

Is everything okay on your end? Please let me know if you have any questions or if there's anything I can help with.`,
  },
  {
    step_number: 3,
    days_after_sent: 14,
    label: 'Gentle Escalation',
    email_subject: 'Invoice {{invoice_number}} is now overdue',
    email_body: `Hi {{client_name}},

I'm reaching out about invoice {{invoice_number}} for {{invoice_amount}}, which was due on {{due_date}} and is now 14 days overdue.

I'd appreciate it if you could arrange payment at your earliest convenience. If there's an issue, please reply and let me know.`,
  },
  {
    step_number: 4,
    days_after_sent: 21,
    label: 'Final Notice',
    email_subject: 'Final notice: Invoice {{invoice_number}} — action required',
    email_body: `Hi {{client_name}},

This is a final notice regarding invoice {{invoice_number}} for {{invoice_amount}}, which is now 21 days overdue.

Please arrange payment immediately. If payment is not received, I may need to pursue further action.

If you're experiencing difficulty, please reach out so we can discuss a solution.`,
  },
]
