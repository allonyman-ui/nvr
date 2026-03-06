import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('invoices')
    .select('*, client:clients(name, email, company), items:invoice_items(*), chase_sequences(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ invoices: data })
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Check free plan limit (3 active invoices)
  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_status')
    .eq('id', user.id)
    .single()

  const isPro = profile?.subscription_status === 'active' || profile?.subscription_status === 'trialing'

  if (!isPro) {
    const { count } = await supabase
      .from('invoices')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .in('status', ['draft', 'sent', 'overdue'])

    if ((count ?? 0) >= 3) {
      return NextResponse.json(
        { error: 'Free plan is limited to 3 active invoices. Upgrade to Pro for unlimited invoices.' },
        { status: 403 }
      )
    }
  }

  const body = await request.json()
  const { client_id, due_date, notes, items, chase_steps } = body

  if (!items || items.length === 0) {
    return NextResponse.json({ error: 'At least one line item is required.' }, { status: 400 })
  }

  // Generate invoice number
  const { count: invoiceCount } = await supabase
    .from('invoices')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  const invoiceNumber = `INV-${String((invoiceCount ?? 0) + 1).padStart(3, '0')}`

  // Calculate total
  const totalAmount = items.reduce(
    (sum: number, item: { quantity: number; rate: number }) => sum + item.quantity * item.rate,
    0
  )

  // Create invoice
  const { data: invoice, error: invoiceError } = await supabase
    .from('invoices')
    .insert({
      user_id: user.id,
      client_id: client_id || null,
      invoice_number: invoiceNumber,
      status: 'draft',
      total_amount: totalAmount,
      due_date: due_date || null,
      notes: notes || null,
    })
    .select()
    .single()

  if (invoiceError) return NextResponse.json({ error: invoiceError.message }, { status: 500 })

  // Create line items
  const { error: itemsError } = await supabase.from('invoice_items').insert(
    items.map((item: { description: string; quantity: number; rate: number; amount: number; sort_order: number }) => ({
      invoice_id: invoice.id,
      description: item.description,
      quantity: item.quantity,
      rate: item.rate,
      amount: item.quantity * item.rate,
      sort_order: item.sort_order,
    }))
  )

  if (itemsError) return NextResponse.json({ error: itemsError.message }, { status: 500 })

  // Store chase steps on the invoice (will be used when sending)
  if (chase_steps && chase_steps.length > 0) {
    // We store chase steps as pending but with null sent dates — they'll get scheduled_date when invoice is sent
    // For now, just store them with a placeholder date; it will be updated on send
    const today = new Date()
    const { error: chaseError } = await supabase.from('chase_sequences').insert(
      chase_steps.map((step: { step_number: number; days_after_sent: number; email_subject: string; email_body: string }) => ({
        invoice_id: invoice.id,
        step_number: step.step_number,
        days_after_sent: step.days_after_sent,
        scheduled_date: new Date(today.getTime() + step.days_after_sent * 86400000).toISOString().split('T')[0],
        status: 'pending',
        email_subject: step.email_subject,
        email_body: step.email_body,
      }))
    )
    if (chaseError) console.error('Chase steps error:', chaseError)
  }

  return NextResponse.json({ invoice }, { status: 201 })
}
