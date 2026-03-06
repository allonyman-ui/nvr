import { Resend } from 'resend'

// Lazy initialization to avoid build-time errors when env vars aren't set
let _resend: Resend | null = null
function getResend(): Resend {
  if (!_resend) {
    const key = process.env.RESEND_API_KEY || 'placeholder'
    _resend = new Resend(key)
  }
  return _resend
}

const FROM = () => process.env.RESEND_FROM_EMAIL || 'Chase <noreply@resend.dev>'

export interface SendEmailOptions {
  to: string
  subject: string
  html: string
  replyTo?: string
}

export async function sendEmail({ to, subject, html, replyTo }: SendEmailOptions) {
  const resend = getResend()
  const result = await resend.emails.send({
    from: FROM(),
    to,
    subject,
    html,
    replyTo: replyTo || undefined,
  })
  return result
}
