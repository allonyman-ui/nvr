import { MetadataRoute } from 'next'

const BASE = 'https://chase.allonys.com'
const LAUNCH_DATE = new Date('2026-03-04')
const UPDATED_DATE = new Date('2026-03-06')

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE,
      lastModified: UPDATED_DATE,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE}/signup`,
      lastModified: LAUNCH_DATE,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    // Blog index
    {
      url: `${BASE}/blog`,
      lastModified: UPDATED_DATE,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    // Blog posts — batch 1
    {
      url: `${BASE}/blog/best-invoicing-app-freelancers`,
      lastModified: LAUNCH_DATE,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE}/blog/how-to-collect-overdue-invoices`,
      lastModified: LAUNCH_DATE,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE}/blog/invoice-reminder-software-freelancers`,
      lastModified: LAUNCH_DATE,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE}/blog/how-to-write-invoice-payment-reminder-email`,
      lastModified: LAUNCH_DATE,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE}/blog/how-to-follow-up-on-unpaid-invoice-freelancer`,
      lastModified: LAUNCH_DATE,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE}/blog/invoice-follow-up-email-templates`,
      lastModified: LAUNCH_DATE,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    // Blog posts — batch 2
    {
      url: `${BASE}/blog/freelance-invoice-template`,
      lastModified: LAUNCH_DATE,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE}/blog/how-to-ask-for-payment-professionally`,
      lastModified: LAUNCH_DATE,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE}/blog/invoice-payment-terms`,
      lastModified: LAUNCH_DATE,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE}/blog/late-payment-email`,
      lastModified: LAUNCH_DATE,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    // Blog posts — batch 3
    {
      url: `${BASE}/blog/invoice-reminder-email-templates`,
      lastModified: LAUNCH_DATE,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE}/blog/how-to-chase-unpaid-invoice`,
      lastModified: LAUNCH_DATE,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE}/blog/late-payment-recovery-sequence`,
      lastModified: LAUNCH_DATE,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE}/blog/overdue-invoice-letter`,
      lastModified: LAUNCH_DATE,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    // Alternatives pages
    {
      url: `${BASE}/alternatives/honeybook`,
      lastModified: LAUNCH_DATE,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE}/alternatives/bonsai`,
      lastModified: LAUNCH_DATE,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE}/alternatives/dubsado`,
      lastModified: UPDATED_DATE,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE}/alternatives/quickbooks`,
      lastModified: UPDATED_DATE,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    // VS pages
    {
      url: `${BASE}/vs/freshbooks`,
      lastModified: LAUNCH_DATE,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE}/vs/wave`,
      lastModified: UPDATED_DATE,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE}/vs/invoiceninja`,
      lastModified: UPDATED_DATE,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE}/vs/quickbooks`,
      lastModified: UPDATED_DATE,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    // Auth pages
    {
      url: `${BASE}/login`,
      lastModified: LAUNCH_DATE,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    // Legal
    {
      url: `${BASE}/privacy`,
      lastModified: LAUNCH_DATE,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE}/terms`,
      lastModified: LAUNCH_DATE,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]
}
