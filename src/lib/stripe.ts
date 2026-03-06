import Stripe from 'stripe'

// Instantiated lazily at runtime, not at module load
let _stripe: Stripe | null = null

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY?.trim()
    if (!key) throw new Error('STRIPE_SECRET_KEY is not set')
    _stripe = new Stripe(key, { apiVersion: '2025-02-24.acacia' })
  }
  return _stripe
}

export const APP_URL = () => (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').trim()
export const STRIPE_PRO_PRICE_ID = () => (process.env.STRIPE_PRO_PRICE_ID ?? '').trim()
export const STRIPE_5PCT_PRICE_ID = () => (process.env.STRIPE_5PCT_PRICE_ID ?? '').trim()
export const STRIPE_PRO_YEARLY_PRICE_ID = () => (process.env.STRIPE_PRO_YEARLY_PRICE_ID ?? '').trim()
