import { sendEmail } from '@/lib/email'
import { NextRequest } from 'next/server'

// POST /api/admin/notify-signup
// Called after every new user signup — sends alert email to the admin
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const email: string = body.email ?? 'unknown'
    const source: string = body.source ?? 'direct'
    const now = new Date()

    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 500px; margin: 0 auto; padding: 0;">
        <!-- Header bar -->
        <div style="background: #4f46e5; border-radius: 12px 12px 0 0; padding: 20px 24px;">
          <h1 style="color: #fff; margin: 0; font-size: 18px; font-weight: 700;">🎉 New Chase signup</h1>
        </div>

        <!-- Body -->
        <div style="background: #fff; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px; padding: 24px;">
          <p style="color: #64748b; margin: 0 0 20px; font-size: 14px;">
            Someone just created an account on <strong style="color: #1e293b;">chase.allonys.com</strong>
          </p>

          <!-- Details -->
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 14px; background: #f8fafc; border-radius: 8px 8px 0 0; border-bottom: 1px solid #e2e8f0;">
                <p style="margin: 0; color: #94a3b8; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">Email</p>
                <p style="margin: 4px 0 0; color: #0f172a; font-size: 15px; font-weight: 600;">${email}</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 14px; background: #f8fafc; border-radius: 0 0 8px 8px;">
                <p style="margin: 0; color: #94a3b8; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">Source</p>
                <p style="margin: 4px 0 0; color: #0f172a; font-size: 15px; font-weight: 600;">${source}</p>
              </td>
            </tr>
          </table>

          <!-- Time -->
          <p style="color: #94a3b8; font-size: 12px; margin: 20px 0 0;">
            ${now.toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short', timeZone: 'America/New_York' })} ET
          </p>

          <!-- Admin link -->
          <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid #f1f5f9;">
            <a
              href="https://chase.allonys.com/admin"
              style="display: inline-block; background: #4f46e5; color: #fff; text-decoration: none; font-size: 13px; font-weight: 600; padding: 8px 18px; border-radius: 8px;"
            >
              View admin dashboard →
            </a>
          </div>
        </div>
      </div>
    `

    await sendEmail({
      to: 'allonyman@gmail.com',
      subject: `🎉 New signup: ${email}`,
      html,
    })

    return Response.json({ ok: true })
  } catch (err) {
    console.error('[notify-signup] failed:', err)
    // Don't throw — this is a non-critical notification
    return Response.json({ ok: false }, { status: 500 })
  }
}
