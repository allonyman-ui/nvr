import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { getStripe } from '@/lib/stripe'
import { createServiceClient } from '@/lib/supabase/service'
import Stripe from 'stripe'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const body = await request.text()
  const headersList = await headers()
  const sig = headersList.get('stripe-signature')!
  const stripe = getStripe()

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = createServiceClient()

  switch (event.type) {
    // ── Invoice Payment (via Payment Link) ──────────────────────────────
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const invoiceId = session.metadata?.invoice_id
      const type = session.metadata?.type

      if (type === 'invoice_payment' && invoiceId) {
        // Mark invoice as paid
        await supabase
          .from('invoices')
          .update({
            status: 'paid',
            paid_at: new Date().toISOString(),
            stripe_payment_intent_id: session.payment_intent as string,
          })
          .eq('id', invoiceId)

        // Cancel all pending chase sequences
        await supabase
          .from('chase_sequences')
          .update({ status: 'cancelled' })
          .eq('invoice_id', invoiceId)
          .eq('status', 'pending')
      }
      break
    }

    // ── Subscription Events ──────────────────────────────────────────────
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription
      const userId = sub.metadata?.supabase_user_id

      if (userId) {
        await supabase
          .from('profiles')
          .update({
            subscription_status: sub.status === 'trialing' ? 'trialing' : sub.status === 'active' ? 'active' : sub.status,
            subscription_id: sub.id,
            trial_ends_at: sub.trial_end ? new Date(sub.trial_end * 1000).toISOString() : null,
          })
          .eq('id', userId)
      } else {
        // Look up by customer ID
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', sub.customer as string)
          .single()

        if (profile) {
          await supabase
            .from('profiles')
            .update({
              subscription_status: sub.status === 'trialing' ? 'trialing' : sub.status === 'active' ? 'active' : sub.status,
              subscription_id: sub.id,
              trial_ends_at: sub.trial_end ? new Date(sub.trial_end * 1000).toISOString() : null,
            })
            .eq('id', profile.id)
        }
      }
      break
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('stripe_customer_id', sub.customer as string)
        .single()

      if (profile) {
        await supabase
          .from('profiles')
          .update({ subscription_status: 'canceled', subscription_id: null })
          .eq('id', profile.id)
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}
