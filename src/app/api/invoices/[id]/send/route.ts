import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getStripe } from '@/lib/stripe'
import { sendEmail } from '@/lib/email'
import { invoiceEmailHtml } from '@/lib/email-templates'
import { formatCurrency, formatDate, addDays, toDateString } from '@/lib/invoice-utils'

export const dynamic = 'force-dynamic'

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Fetch invoice with client and items
  const { data: invoice, error: invErr } = await supabase
    .from('invoices')
    .select('*, client:clients(*), items:invoice_items(*), chase_sequences(*)')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (invErr || !invoice) return NextResponse.json({ error: 'Invoice not found.' }, { status: 404 })

  if (invoice.status !== 'draft') {
    return NextResponse.json({ error: 'Invoice has already been sent.' }, { status: 400 })
  }

  if (!invoice.client) {
    return NextResponse.json({ error: 'Please assign a client before sending.' }, { status: 400 })
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('name, business_name, email_signature, reply_to_email, email')
    .eq('id', user.id)
    .single()

  const businessName = profile?.business_name || profile?.name || 'Your Freelancer'

  // Create Stripe Payment Link
  let paymentLink = invoice.stripe_payment_link
  let paymentLinkId = invoice.stripe_payment_link_id

  if (!paymentLink) {
    try {
      const stripe = getStripe()
      const amountCents = Math.round(Number(invoice.total_amount) * 100)
      if (amountCents > 0) {
        // Create a product for this invoice
        const product = await stripe.products.create({
          name: `${businessName} — Invoice ${invoice.invoice_number}`,
          metadata: { invoice_id: id },
        })

        // Create a price
        const price = await stripe.prices.create({
          product: product.id,
          unit_amount: amountCents,
          currency: 'usd',
        })

        // Create a Payment Link
        const link = await stripe.paymentLinks.create({
          line_items: [{ price: price.id, quantity: 1 }],
          metadata: { invoice_id: id, type: 'invoice_payment' },
          payment_intent_data: {
            metadata: { invoice_id: id, type: 'invoice_payment' },
          },
          after_completion: {
            type: 'hosted_confirmation',
            hosted_confirmation: {
              custom_message: `Thank you for your payment! Invoice ${invoice.invoice_number} is now settled.`,
            },
          },
        })

        paymentLink = link.url
        paymentLinkId = link.id
      }
    } catch (stripeErr) {
      console.error('Stripe error:', stripeErr)
      // Continue without payment link if Stripe isn't configured
      paymentLink = `${process.env.NEXT_PUBLIC_APP_URL}/invoices/${id}`
    }
  }

  // Update scheduled dates for chase sequences (relative to today = sent date)
  const sentAt = new Date()
  const sequences = invoice.chase_sequences ?? []

  // Default day offsets by step number (fallback when days_after_sent not stored)
  const defaultDayOffsets: Record<number, number> = { 1: 3, 2: 7, 3: 14, 4: 21 }

  for (const seq of sequences) {
    if (seq.status === 'pending') {
      // Prefer stored days_after_sent (custom steps), fall back to defaults
      const daysOffset = seq.days_after_sent ?? defaultDayOffsets[seq.step_number] ?? seq.step_number * 7
      const scheduledDate = toDateString(addDays(sentAt, daysOffset))
      await supabase
        .from('chase_sequences')
        .update({ scheduled_date: scheduledDate })
        .eq('id', seq.id)
    }
  }

  // Update invoice
  await supabase
    .from('invoices')
    .update({
      status: 'sent',
      sent_at: sentAt.toISOString(),
      stripe_payment_link: paymentLink,
      stripe_payment_link_id: paymentLinkId,
    })
    .eq('id', id)

  // Send email
  const dueDate = formatDate(invoice.due_date)
  const amount = formatCurrency(Number(invoice.total_amount))

  const html = invoiceEmailHtml({
    clientName: invoice.client.name,
    businessName,
    invoiceNumber: invoice.invoice_number,
    invoiceAmount: amount,
    dueDate,
    paymentLink: paymentLink || '#',
    signature: profile?.email_signature || '',
    notes: invoice.notes || undefined,
  })

  try {
    await sendEmail({
      to: invoice.client.email,
      subject: `Invoice ${invoice.invoice_number} from ${businessName}`,
      html,
      replyTo: profile?.reply_to_email || profile?.email || undefined,
    })
  } catch (emailErr) {
    console.error('Email error:', emailErr)
    // Don't fail — invoice is already marked sent
  }

  return NextResponse.json({ success: true, paymentLink })
}
