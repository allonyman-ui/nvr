import { Suspense } from 'react'
import BillingClient from './billing-client'

export const metadata = { title: 'Billing' }

export default function BillingPage() {
  // Pass plan availability from server env vars to the client component.
  // This prevents showing a plan card whose Stripe price ID isn't configured yet.
  const hasPercentPlan = !!process.env.STRIPE_5PCT_PRICE_ID?.trim()

  return (
    <Suspense fallback={<div className="text-slate-500 text-sm">Loading…</div>}>
      <BillingClient hasPercentPlan={hasPercentPlan} />
    </Suspense>
  )
}
