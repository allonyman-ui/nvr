import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { sendEmail } from '@/lib/email'
import { chaseEmailHtml, chaseOwnerNotificationHtml, interpolateSubject } from '@/lib/email-templates'
import { formatCurrency, formatDate } from '@/lib/invoice-utils'

// This route is called daily by Vercel Cron
export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServiceClient()
  const today = new Date().toISOString().split('T')[0]

  // Find all pending chase sequences scheduled for today or earlier
  const { data: sequences, error } = await supabase
    .from('chase_sequences')
    .select(`
      *,
      invoice:invoices(
        id, invoice_number, total_amount, due_date, status, stripe_payment_link,
        client:clients(name, email),
        user:profiles(business_name, name, email_signature, reply_to_email, email)
      )
    `)
    .eq('status', 'pending')
    .lte('scheduled_date', today)

  if (error) {
    console.error('Chase cron error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  console.log(`Chase cron: found ${sequences?.length ?? 0} sequences to process`)

  let sent = 0
  let skipped = 0

  for (const seq of sequences ?? []) {
    const invoice = seq.invoice
    if (!invoice) { skipped++; continue }

    // Skip if invoice is already paid or cancelled
    if (invoice.status === 'paid' || invoice.status === 'cancelled') {
      await supabase
        .from('chase_sequences')
        .update({ status: 'cancelled' })
        .eq('id', seq.id)
      skipped++
      continue
    }

    const client = invoice.client
    const user = invoice.user

    if (!client || !client.email) { skipped++; continue }

    const businessName = user?.business_name || user?.name || 'Your Freelancer'
    const paymentLink = invoice.stripe_payment_link || `${process.env.NEXT_PUBLIC_APP_URL}/invoices/${invoice.id}`
    const amount = formatCurrency(Number(invoice.total_amount))
    const dueDate = formatDate(invoice.due_date)

    const templateVars = {
      client_name: client.name,
      invoice_amount: amount,
      due_date: dueDate,
      invoice_number: invoice.invoice_number,
      business_name: businessName,
      invoice_link: paymentLink,
    }

    const subject = interpolateSubject(seq.email_subject, templateVars)
    const html = chaseEmailHtml({
      clientName: client.name,
      businessName,
      invoiceNumber: invoice.invoice_number,
      invoiceAmount: amount,
      dueDate,
      paymentLink,
      signature: user?.email_signature || '',
      emailBody: seq.email_body,
    })

    try {
      await sendEmail({
        to: client.email,
        subject,
        html,
        replyTo: user?.reply_to_email || user?.email || undefined,
      })

      await supabase
        .from('chase_sequences')
        .update({ status: 'sent', sent_at: new Date().toISOString() })
        .eq('id', seq.id)

      // Notify the invoice owner that a chase email was sent
      if (user?.email) {
        try {
          const ownerHtml = chaseOwnerNotificationHtml({
            ownerName: user.name || user.business_name || 'there',
            clientName: client.name,
            invoiceNumber: invoice.invoice_number,
            invoiceAmount: amount,
            stepNumber: seq.step_number,
            stepDay: seq.days_after_sent ?? (seq.step_number * 7),
            invoiceUrl: `${process.env.NEXT_PUBLIC_APP_URL}/invoices/${invoice.id}`,
          })
          await sendEmail({
            to: user.email,
            subject: `Chase sent follow-up #${seq.step_number} to ${client.name} — ${invoice.invoice_number}`,
            html: ownerHtml,
          })
        } catch (notifyErr) {
          console.error(`Owner notification failed for sequence ${seq.id}:`, notifyErr)
          // Non-fatal — client chase already sent
        }
      }

      sent++
    } catch (err) {
      console.error(`Failed to send chase for sequence ${seq.id}:`, err)
    }
  }

  return NextResponse.json({ processed: sequences?.length ?? 0, sent, skipped })
}
