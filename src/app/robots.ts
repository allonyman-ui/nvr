import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard',
          '/invoices',
          '/clients',
          '/settings',
          '/billing',
          '/onboarding',
          '/admin',
          '/api/',
        ],
      },
    ],
    sitemap: 'https://chase.allonys.com/sitemap.xml',
    host: 'https://chase.allonys.com',
  }
}
