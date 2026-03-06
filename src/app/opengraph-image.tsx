import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Chase — Stop chasing. Start getting paid.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#09090b',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
          position: 'relative',
        }}
      >
        {/* Subtle glow */}
        <div
          style={{
            position: 'absolute',
            top: -100,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 800,
            height: 400,
            background:
              'radial-gradient(ellipse, rgba(99,102,241,0.25) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
        />

        {/* Logo mark + wordmark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 48 }}>
          <div
            style={{
              width: 72,
              height: 72,
              background: '#4f46e5',
              borderRadius: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ color: 'white', fontSize: 46, fontWeight: 900, lineHeight: 1 }}>
              C
            </span>
          </div>
          <span
            style={{
              color: 'white',
              fontSize: 48,
              fontWeight: 700,
              letterSpacing: -1.5,
            }}
          >
            Chase
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            color: 'white',
            fontSize: 72,
            fontWeight: 800,
            textAlign: 'center',
            letterSpacing: -3,
            lineHeight: 1.05,
            margin: '0 80px',
          }}
        >
          Stop chasing.{'\n'}Start getting paid.
        </div>

        {/* Sub */}
        <div
          style={{
            color: 'rgba(255,255,255,0.45)',
            fontSize: 28,
            textAlign: 'center',
            marginTop: 28,
            lineHeight: 1.4,
          }}
        >
          Automated invoice follow-ups for freelancers
        </div>

        {/* Bottom pill badges */}
        <div style={{ display: 'flex', gap: 16, marginTop: 48 }}>
          {['Free to start', 'Stripe payment links', '$19/mo Pro'].map((label) => (
            <div
              key={label}
              style={{
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 100,
                padding: '8px 20px',
                color: 'rgba(255,255,255,0.55)',
                fontSize: 18,
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  )
}
