export type SubscriptionStatus = 'free' | 'trialing' | 'active' | 'past_due' | 'canceled'
export type InvoiceStatus = 'draft' | 'sent' | 'overdue' | 'paid' | 'cancelled'
export type ChaseStepStatus = 'pending' | 'sent' | 'cancelled' | 'skipped'

export interface Profile {
  id: string
  email: string
  name: string | null
  business_name: string | null
  logo_url: string | null
  email_signature: string | null
  reply_to_email: string | null
  stripe_customer_id: string | null
  subscription_status: SubscriptionStatus
  subscription_id: string | null
  trial_ends_at: string | null
  onboarding_completed: boolean
  created_at: string
}

export interface Client {
  id: string
  user_id: string
  name: string
  email: string
  company: string | null
  default_rate: number | null
  created_at: string
}

export interface Invoice {
  id: string
  user_id: string
  client_id: string | null
  invoice_number: string
  status: InvoiceStatus
  total_amount: number
  due_date: string | null
  notes: string | null
  stripe_payment_link: string | null
  stripe_payment_link_id: string | null
  stripe_payment_intent_id: string | null
  sent_at: string | null
  paid_at: string | null
  created_at: string
  // Joined
  client?: Client
  items?: InvoiceItem[]
  chase_sequences?: ChaseSequence[]
}

export interface InvoiceItem {
  id: string
  invoice_id: string
  description: string
  quantity: number
  rate: number
  amount: number
  sort_order: number
}

export interface ChaseSequence {
  id: string
  invoice_id: string
  step_number: number
  scheduled_date: string
  sent_at: string | null
  status: ChaseStepStatus
  email_subject: string
  email_body: string
  created_at: string
}

export interface DashboardStats {
  totalOutstanding: number
  totalPaidThisMonth: number
  activeInvoices: number
  overdueInvoices: number
}
