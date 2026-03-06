import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getStripe, STRIPE_PRO_PRICE_ID, STRIPE_5PCT_PRICE_ID, STRIPE_PRO_YEARLY_PRICE_ID, APP_URL } from '@/lib/stripe'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Parse plan type from body ('pro' | 'pro_yearly' | 'percent'), default to 'pro'
  let plan: 'pro' | 'pro_yearly' | 'percent' = 'pro'
  try {
    const body = await request.json()
    if (body.plan === 'percent') plan = 'percent'
    else if (body.plan === 'pro_yearly') plan = 'pro_yearly'
  } catch {
    // no body / bad JSON — use default
  }

  // Resolve the Stripe price ID for the chosen plan
  let priceId: string
  if (plan === 'percent') priceId = STRIPE_5PCT_PRICE_ID()
  else if (plan === 'pro_yearly') priceId = STRIPE_PRO_YEARLY_PRICE_ID()
  else priceId = STRIPE_PRO_PRICE_ID()

  if (!priceId) {
    return NextResponse.json(
      { error: `Stripe price ID not configured for the ${plan} plan. Contact support.` },
      { status: 500 }
    )
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id, email, name')
    .eq('id', user.id)
    .single()

  console.log('[stripe/checkout] plan:', plan, 'priceId:', priceId.slice(0, 12) + '...', 'userId:', user.id)

  try {
    const stripe = getStripe()

    // Get or create Stripe customer
    let customerId = profile?.stripe_customer_id

    if (!customerId) {
      const email = profile?.email || user.email
      if (!email) {
        return NextResponse.json({ error: 'No email address found for account. Please update your profile.' }, { status: 400 })
      }
      const customer = await stripe.customers.create({
        email,
        name: profile?.name || undefined,
        metadata: { supabase_user_id: user.id },
      })
      customerId = customer.id
      console.log('[stripe/checkout] created new customer:', customerId)

      await supabase
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id)
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      allow_promotion_codes: true,          // ← beta users can enter BETA##CHASE codes
      success_url: `${APP_URL()}/billing?session_id={CHECKOUT_SESSION_ID}&success=1`,
      cancel_url: `${APP_URL()}/billing`,
      subscription_data: {
        trial_period_days: 14,
        metadata: { supabase_user_id: user.id, plan },
      },
      metadata: { supabase_user_id: user.id, plan },
    })

    console.log('[stripe/checkout] session created:', session.id)

    if (!session.url) {
      return NextResponse.json({ error: 'Stripe did not return a checkout URL. Please try again.' }, { status: 500 })
    }

    return NextResponse.json({ url: session.url })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Stripe error'
    console.error('[stripe/checkout] error:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
