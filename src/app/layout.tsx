import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://chase.allonys.com'),
  title: {
    default: 'Chase — Invoice Follow-up for Freelancers',
    template: '%s | Chase',
  },
  description: 'Chase automatically follows up on unpaid invoices so freelancers never have to write another "just checking in" email. Connect Stripe, send invoices, Chase handles the rest.',
  keywords: [
    'invoice follow-up',
    'freelancer invoice tool',
    'automated invoice reminders',
    'get paid faster freelancer',
    'invoice management software',
    'Stripe invoice tool',
    'freelancer payment automation',
    'overdue invoice follow-up',
  ],
  authors: [{ name: 'Chase', url: 'https://chase.allonys.com' }],
  creator: 'Chase',
  publisher: 'Chase',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://chase.allonys.com',
    siteName: 'Chase',
    title: 'Chase — Stop chasing. Start getting paid.',
    description: 'Automated invoice follow-ups for freelancers. Connect Stripe, send invoices, Chase handles the rest.',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Chase — Stop chasing. Start getting paid.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chase — Stop chasing. Start getting paid.',
    description: 'Automated invoice follow-ups for freelancers. Connect Stripe, send invoices, Chase handles the rest.',
    images: ['/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-WEZV56WMW3"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-WEZV56WMW3');
          `}
        </Script>
      </body>
    </html>
  )
}
