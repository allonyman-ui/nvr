interface InvoiceEmailData {
  clientName: string
  businessName: string
  invoiceNumber: string
  invoiceAmount: string
  dueDate: string
  paymentLink: string
  signature: string
  notes?: string
}

export function invoiceEmailHtml(data: InvoiceEmailData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice ${data.invoiceNumber}</title>
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;">
    <div style="background:#4f46e5;padding:32px;text-align:center;">
      <p style="margin:0;color:#c7d2fe;font-size:13px;text-transform:uppercase;letter-spacing:1px;">Invoice</p>
      <p style="margin:8px 0 0;color:#fff;font-size:28px;font-weight:700;">${data.invoiceNumber}</p>
    </div>
    <div style="padding:32px;">
      <p style="margin:0 0 24px;color:#1e293b;font-size:16px;">Hi ${data.clientName},</p>
      <p style="margin:0 0 24px;color:#475569;font-size:15px;line-height:1.6;">
        Please find your invoice from <strong>${data.businessName}</strong> below.
      </p>
      <div style="background:#f8fafc;border-radius:8px;padding:24px;margin:0 0 24px;">
        <div style="display:flex;justify-content:space-between;margin-bottom:12px;">
          <span style="color:#64748b;font-size:14px;">Amount Due</span>
          <span style="color:#1e293b;font-size:20px;font-weight:700;">${data.invoiceAmount}</span>
        </div>
        <div style="display:flex;justify-content:space-between;">
          <span style="color:#64748b;font-size:14px;">Due Date</span>
          <span style="color:#1e293b;font-size:14px;font-weight:600;">${data.dueDate}</span>
        </div>
      </div>
      ${data.notes ? `<p style="margin:0 0 24px;color:#475569;font-size:14px;line-height:1.6;background:#fffbeb;padding:16px;border-radius:8px;border-left:3px solid #f59e0b;">${data.notes}</p>` : ''}
      <div style="text-align:center;margin:32px 0;">
        <a href="${data.paymentLink}" style="display:inline-block;background:#4f46e5;color:#fff;font-size:16px;font-weight:600;padding:14px 40px;border-radius:8px;text-decoration:none;">
          Pay Now →
        </a>
      </div>
      <p style="margin:24px 0 0;color:#94a3b8;font-size:13px;line-height:1.6;">
        If you have any questions about this invoice, please reply to this email.
      </p>
    </div>
    ${data.signature ? `
    <div style="border-top:1px solid #e2e8f0;padding:24px 32px;">
      <p style="margin:0;color:#64748b;font-size:13px;white-space:pre-line;">${data.signature}</p>
    </div>` : ''}
    <div style="background:#f8fafc;padding:16px 32px;border-top:1px solid #e2e8f0;">
      <p style="margin:0;color:#94a3b8;font-size:12px;text-align:center;">
        Powered by <strong>Chase</strong> — Automated invoice follow-up
      </p>
    </div>
  </div>
</body>
</html>`
}

interface ChaseEmailData {
  clientName: string
  businessName: string
  invoiceNumber: string
  invoiceAmount: string
  dueDate: string
  paymentLink: string
  signature: string
  emailBody: string
}

export function chaseEmailHtml(data: ChaseEmailData): string {
  // Replace template variables in body
  const body = data.emailBody
    .replace(/\{\{client_name\}\}/g, data.clientName)
    .replace(/\{\{invoice_amount\}\}/g, data.invoiceAmount)
    .replace(/\{\{due_date\}\}/g, data.dueDate)
    .replace(/\{\{invoice_number\}\}/g, data.invoiceNumber)
    .replace(/\{\{business_name\}\}/g, data.businessName)

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;">
    <div style="padding:32px;">
      <p style="margin:0 0 4px;color:#94a3b8;font-size:12px;text-transform:uppercase;letter-spacing:1px;">${data.businessName}</p>
      <p style="margin:0 0 24px;color:#64748b;font-size:13px;">Re: Invoice ${data.invoiceNumber}</p>
      <div style="color:#1e293b;font-size:15px;line-height:1.7;white-space:pre-line;">${body}</div>
      <div style="text-align:center;margin:32px 0;">
        <a href="${data.paymentLink}" style="display:inline-block;background:#4f46e5;color:#fff;font-size:16px;font-weight:600;padding:14px 40px;border-radius:8px;text-decoration:none;">
          Pay Now — ${data.invoiceAmount}
        </a>
      </div>
    </div>
    ${data.signature ? `
    <div style="border-top:1px solid #e2e8f0;padding:24px 32px;">
      <p style="margin:0;color:#64748b;font-size:13px;white-space:pre-line;">${data.signature}</p>
    </div>` : ''}
    <div style="background:#f8fafc;padding:16px 32px;border-top:1px solid #e2e8f0;">
      <p style="margin:0;color:#94a3b8;font-size:12px;text-align:center;">
        Powered by <strong>Chase</strong> — Automated invoice follow-up
      </p>
    </div>
  </div>
</body>
</html>`
}

interface ChaseOwnerNotificationData {
  ownerName: string
  clientName: string
  invoiceNumber: string
  invoiceAmount: string
  stepNumber: number
  stepDay: number
  invoiceUrl: string
}

export function chaseOwnerNotificationHtml(data: ChaseOwnerNotificationData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:560px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;">
    <div style="background:#4f46e5;padding:20px 32px;display:flex;align-items:center;gap:12px;">
      <div style="width:36px;height:36px;background:rgba(255,255,255,0.15);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:16px;">📨</div>
      <div>
        <p style="margin:0;color:#c7d2fe;font-size:11px;text-transform:uppercase;letter-spacing:1px;">Chase sent a follow-up</p>
        <p style="margin:4px 0 0;color:#fff;font-size:15px;font-weight:600;">Step ${data.stepNumber} — Day ${data.stepDay}</p>
      </div>
    </div>
    <div style="padding:28px 32px;">
      <p style="margin:0 0 4px;color:#1e293b;font-size:15px;">Hi ${data.ownerName},</p>
      <p style="margin:8px 0 24px;color:#475569;font-size:14px;line-height:1.6;">
        Chase just sent follow-up <strong>#${data.stepNumber}</strong> to <strong>${data.clientName}</strong> for
        Invoice <strong>${data.invoiceNumber}</strong> (${data.invoiceAmount}).
      </p>
      <div style="background:#f8fafc;border-radius:8px;padding:16px 20px;margin:0 0 24px;border-left:3px solid #4f46e5;">
        <p style="margin:0;color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;font-weight:600;">Invoice</p>
        <p style="margin:4px 0 0;color:#1e293b;font-size:15px;font-weight:700;">${data.invoiceNumber}</p>
        <p style="margin:2px 0 0;color:#475569;font-size:13px;">${data.clientName} · ${data.invoiceAmount}</p>
      </div>
      <div style="text-align:center;">
        <a href="${data.invoiceUrl}" style="display:inline-block;background:#4f46e5;color:#fff;font-size:13px;font-weight:600;padding:10px 28px;border-radius:8px;text-decoration:none;">
          View invoice →
        </a>
      </div>
      <p style="margin:20px 0 0;color:#94a3b8;font-size:12px;line-height:1.6;text-align:center;">
        Chase will continue sending follow-ups automatically until the invoice is paid.
      </p>
    </div>
    <div style="background:#f8fafc;padding:12px 32px;border-top:1px solid #e2e8f0;">
      <p style="margin:0;color:#94a3b8;font-size:11px;text-align:center;">
        This notification was sent by <strong>Chase</strong> — your automated invoice follow-up tool.
      </p>
    </div>
  </div>
</body>
</html>`
}

export function interpolateSubject(subject: string, vars: Record<string, string>): string {
  return subject
    .replace(/\{\{client_name\}\}/g, vars.client_name || '')
    .replace(/\{\{invoice_amount\}\}/g, vars.invoice_amount || '')
    .replace(/\{\{due_date\}\}/g, vars.due_date || '')
    .replace(/\{\{invoice_number\}\}/g, vars.invoice_number || '')
    .replace(/\{\{business_name\}\}/g, vars.business_name || '')
}
