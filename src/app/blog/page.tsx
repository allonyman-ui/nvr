import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Chase Blog — Invoice Tips & Freelancer Finance Guides',
  description: 'Practical guides on invoice follow-up, getting paid faster, and running a profitable freelance business. Written by and for freelancers.',
  openGraph: {
    title: 'Chase Blog — Invoice Tips & Freelancer Finance Guides',
    description: 'Practical guides on invoice follow-up, getting paid faster, and running a profitable freelance business.',
    url: 'https://chase.allonys.com/blog',
  },
}

const posts = [
  {
    slug: 'best-invoicing-app-freelancers',
    title: 'Best Invoicing App for Freelancers in 2026 (Honest Comparison)',
    description: 'FreshBooks vs Wave vs Invoice Ninja vs HoneyBook vs Chase. The honest breakdown of which invoicing app actually gets freelancers paid faster.',
    date: 'March 2026',
    readTime: '9 min read',
    category: 'Tools & Software',
  },
  {
    slug: 'how-to-collect-overdue-invoices',
    title: 'How to Collect Overdue Invoices Without Losing the Client (2026 Guide)',
    description: 'A 5-stage timeline for collecting overdue invoices professionally — from the first polite nudge to final escalation. Includes copy-paste email scripts.',
    date: 'March 2026',
    readTime: '10 min read',
    category: 'Getting Paid',
  },
  {
    slug: 'invoice-reminder-software-freelancers',
    title: 'Best Invoice Reminder Software for Freelancers in 2026 (Compared)',
    description: 'Manual email vs FreshBooks vs Wave vs Chase. We compare every major approach to automated invoice reminders so you can stop chasing payments yourself.',
    date: 'March 2026',
    readTime: '9 min read',
    category: 'Tools & Software',
  },
  {
    slug: 'how-to-write-invoice-payment-reminder-email',
    title: 'How to Write an Invoice Payment Reminder Email (With 5 Templates)',
    description: 'Tone, timing, subject lines, and 5 copy-paste templates for every stage — polite reminder, firm nudge, urgent final notice, and past-due escalation.',
    date: 'March 2026',
    readTime: '7 min read',
    category: 'Email Templates',
  },
  {
    slug: 'how-to-follow-up-on-unpaid-invoice-freelancer',
    title: "How to Follow Up on an Unpaid Invoice: The Complete Freelancer's Guide",
    description: "85% of freelancers get paid late. Here's the exact email sequence — day 3, 7, and 14 — that gets invoices paid without burning the client relationship.",
    date: 'March 2026',
    readTime: '8 min read',
    category: 'Getting Paid',
  },
  {
    slug: 'invoice-follow-up-email-templates',
    title: 'Invoice Follow-Up Email Templates: Word-for-Word Scripts for Day 3, 7, 14, and Final Notice',
    description: "Copy-paste professional invoice follow-up emails that are firm without being aggressive. Includes a polite reminder, a firmer nudge, and a final notice template.",
    date: 'March 2026',
    readTime: '6 min read',
    category: 'Email Templates',
  },
  {
    slug: 'invoice-reminder-email-templates',
    title: '7 Invoice Reminder Email Templates That Actually Get You Paid',
    description: 'Seven copy-paste invoice reminder email templates for every stage — pre-due nudge, friendly reminder, firm escalation, and final notice. Written for freelancers.',
    date: 'March 2026',
    readTime: '8 min read',
    category: 'Email Templates',
  },
  {
    slug: 'how-to-chase-unpaid-invoice',
    title: 'How to Chase Unpaid Invoices Without Ruining Client Relationships',
    description: 'A professional, psychology-backed system for chasing unpaid invoices — step-by-step email timeline, what tone to use at each stage, and when to escalate.',
    date: 'March 2026',
    readTime: '9 min read',
    category: 'Getting Paid',
  },
  {
    slug: 'late-payment-recovery-sequence',
    title: 'The 5-Step Late Payment Recovery Sequence Every Freelancer Needs',
    description: 'The exact late payment email sequence for freelancers — what to send, when to send it, and what to say. Includes a visual timeline and send-ready templates.',
    date: 'March 2026',
    readTime: '9 min read',
    category: 'Getting Paid',
  },
  {
    slug: 'overdue-invoice-letter',
    title: 'Overdue Invoice Letter: 5 Copy-Paste Templates (Friendly to Firm)',
    description: 'Five ready-to-send overdue invoice letter and email templates — from a polite first reminder to a final escalation notice. Includes timing guide and late fee advice.',
    date: 'March 2026',
    readTime: '8 min read',
    category: 'Email Templates',
  },
]

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-slate-200 bg-white sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="font-semibold text-slate-900 text-base">Chase</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-slate-600 hover:text-slate-900 font-medium">Log in</Link>
            <Link href="/signup" className="inline-flex items-center gap-1.5 bg-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
              Start free →
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="max-w-2xl">
          <p className="text-indigo-600 text-sm font-semibold tracking-wide uppercase mb-3">Blog</p>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-4">
            Guides for freelancers who want to get paid — on time, every time.
          </h1>
          <p className="text-lg text-slate-500">
            Practical advice on invoice follow-up, client communication, and running a freelance business that actually pays.
          </p>
        </div>
      </div>

      {/* Posts */}
      <div className="max-w-5xl mx-auto px-6 pb-24">
        <div className="grid gap-6 md:grid-cols-2">
          {posts.map(post => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group border border-slate-200 rounded-2xl p-7 hover:border-indigo-200 hover:shadow-sm transition-all"
            >
              <span className="inline-block bg-indigo-50 text-indigo-700 text-xs font-semibold px-2.5 py-1 rounded-full mb-4">
                {post.category}
              </span>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-3 group-hover:text-indigo-700 transition-colors">
                {post.title}
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">
                {post.description}
              </p>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span>{post.date}</span>
                <span>·</span>
                <span>{post.readTime}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-slate-900 py-16">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Stop writing follow-up emails manually.</h2>
          <p className="text-slate-400 mb-7 max-w-md mx-auto">Chase sends them automatically on day 3, 7, and 14 — and stops the moment your client pays.</p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-white text-slate-900 font-semibold px-6 py-3 rounded-xl hover:bg-slate-100 transition-colors"
          >
            Start free — no card required →
          </Link>
        </div>
      </div>
    </div>
  )
}
