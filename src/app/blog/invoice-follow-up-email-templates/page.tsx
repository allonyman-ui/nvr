import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Invoice Follow-Up Email Templates: Day 3, 7, 14 & Final Notice (Copy-Paste)',
  description: 'Free invoice follow-up email templates for freelancers. Professional, copy-paste email scripts for every stage — polite reminder through final notice. No cringe, no aggression.',
  keywords: [
    'invoice follow up email template',
    'overdue invoice email template',
    'invoice reminder email freelancer',
    'follow up invoice email professional',
    'late invoice email template',
    'invoice payment reminder template',
    'freelancer invoice email',
  ],
  openGraph: {
    title: 'Invoice Follow-Up Email Templates: Day 3, 7, 14 & Final Notice',
    description: 'Free copy-paste invoice follow-up email templates for every stage — polite reminder through final notice.',
    url: 'https://chase.allonys.com/blog/invoice-follow-up-email-templates',
    type: 'article',
  },
  alternates: {
    canonical: 'https://chase.allonys.com/blog/invoice-follow-up-email-templates',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Invoice Follow-Up Email Templates: Day 3, 7, 14 & Final Notice',
  description: 'Free copy-paste invoice follow-up email templates for every stage of invoice chasing.',
  datePublished: '2026-03-04',
  dateModified: '2026-03-04',
  author: {
    '@type': 'Organization',
    name: 'Chase',
    url: 'https://chase.allonys.com',
  },
}

interface TemplateProps {
  label: string
  day: string
  subject: string
  body: string
  note: string
}

function Template({ label, day, subject, body, note }: TemplateProps) {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-4">
        <span className="bg-indigo-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">{day}</span>
        <h3 className="text-xl font-bold text-slate-900">{label}</h3>
      </div>
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Email template — copy and paste</p>
        <p className="text-sm text-slate-700 mb-1"><strong>Subject:</strong> {subject}</p>
        <div className="mt-3 text-sm text-slate-700 leading-relaxed whitespace-pre-line font-mono border-t border-slate-200 pt-4">
          {body}
        </div>
      </div>
      <p className="text-sm text-slate-500 mt-3 italic">{note}</p>
    </div>
  )
}

export default function TemplatePage() {
  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Nav */}
      <nav className="border-b border-slate-200 bg-white sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="font-semibold text-slate-900 text-base">Chase</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/blog" className="text-sm text-slate-500 hover:text-slate-900">Blog</Link>
            <Link href="/signup" className="inline-flex items-center gap-1.5 bg-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
              Start free →
            </Link>
          </div>
        </div>
      </nav>

      <article className="max-w-3xl mx-auto px-6 py-14">

        {/* Header */}
        <div className="mb-10">
          <Link href="/blog" className="text-indigo-600 text-sm font-medium hover:underline inline-flex items-center gap-1 mb-6">
            ← Blog
          </Link>
          <div className="flex items-center gap-3 mb-5">
            <span className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-2.5 py-1 rounded-full">Email Templates</span>
            <span className="text-slate-400 text-sm">March 2026 · 6 min read</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight leading-tight mb-5">
            Invoice Follow-Up Email Templates: Word-for-Word Scripts for Day 3, 7, 14, and Final Notice
          </h1>
          <p className="text-xl text-slate-500 leading-relaxed">
            Stop staring at a blank email wondering how to word your third follow-up without sounding desperate or aggressive. These are the exact templates — copy and paste ready — for every stage of the invoice follow-up process.
          </p>
        </div>

        {/* Inline CTA */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-6 py-5 mb-10 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
          <div>
            <p className="font-semibold text-indigo-900 text-sm">Rather not write any of these?</p>
            <p className="text-indigo-700 text-sm mt-0.5">Chase sends all four automatically — and stops the moment your client pays.</p>
          </div>
          <Link href="/signup" className="shrink-0 bg-indigo-600 text-white font-semibold px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition-colors whitespace-nowrap">
            Automate it free →
          </Link>
        </div>

        {/* Intro */}
        <div className="text-slate-600 leading-relaxed space-y-4 mb-10">
          <p>
            85% of freelancers get paid late. The average wait is 39 days. The most common reason? The invoice got buried, the client got busy, and nobody followed up consistently.
          </p>
          <p>
            A systematic follow-up sequence — with the right tone at the right time — recovers the vast majority of late invoices. Below are four templates you can use today. Each one is calibrated for its moment: warm early, firmer as time passes, never aggressive.
          </p>
          <p>
            Replace the fields in brackets with your actual invoice details. Everything else can be sent as-is.
          </p>
        </div>

        <div className="border-t border-slate-100 pt-10">

          <Template
            day="Day 3"
            label="The Friendly Reminder"
            subject="Invoice #[number] — just a quick follow-up"
            body={`Hi [Client name],

Hope you're doing well! I'm following up on Invoice #[number] for [project name], which was due on [due date]. The total is [amount].

I wanted to make sure it didn't get lost in the inbox. You can pay directly here: [payment link]

Let me know if you have any questions or need me to resend anything.

Thanks so much,
[Your name]`}
            note="Tone: warm and casual. Assume it's an oversight. This email alone recovers 40–50% of late invoices within 24 hours."
          />

          <Template
            day="Day 7"
            label="The Firmer Nudge"
            subject="Following up: Invoice #[number] is now 7 days overdue"
            body={`Hi [Client name],

I wanted to check in again on Invoice #[number] for [amount], which is now 7 days past the due date of [date].

If there's an issue with the invoice, payment method, or anything else, I'm happy to sort it out — just let me know. Otherwise, could you arrange payment by [specific date, e.g., this Friday]?

Payment link: [link]

Thank you,
[Your name]`}
            note="Tone: professional, slightly firmer. Setting a new specific deadline increases payment probability significantly. The 'if there's an issue' line gives the client a face-saving out, which speeds up response."
          />

          <Template
            day="Day 14"
            label="The Final Notice"
            subject="Final notice: Invoice #[number] — [amount] overdue"
            body={`Hi [Client name],

This is a final notice regarding Invoice #[number] for [amount], which is now 14 days past its due date.

I have not received a response to my previous two follow-ups, so I want to make sure this is on your radar. Please arrange payment by [date] to avoid any further action.

Payment link: [link]

If you have already sent payment, or if you are experiencing a difficulty, please reply to this email and I will follow up directly.

[Your name]`}
            note='Tone: firm and professional. "Avoid any further action" implies escalation without making an empty threat. This email should not be softened further — its brevity and directness is what makes it effective.'
          />

          <Template
            day="Day 21+"
            label="The Escalation (If All Else Fails)"
            subject="Outstanding invoice #[number] — payment required"
            body={`Hi [Client name],

I have now sent three follow-up emails regarding Invoice #[number] for [amount], due on [date], with no response or payment received.

I would like to resolve this directly before exploring other options. Please respond to this email by [date] with either a payment confirmation or a proposed payment arrangement.

If I do not hear from you by [date], I will need to consider escalating this matter.

[Your name]`}
            note='Tone: formal. This email signals that the relationship is at risk. Only send this if you have genuinely received no response. The phrase "exploring other options" is intentionally vague — it could mean collections, a lawyer, or public review.'
          />

        </div>

        {/* Tips */}
        <div className="mt-4 mb-10 border-t border-slate-100 pt-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-5">Tips for using these templates effectively</h2>

          <div className="space-y-5">
            <div className="flex gap-4">
              <div className="shrink-0 w-7 h-7 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-sm font-bold">1</div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Always include the payment link</h3>
                <p className="text-slate-600 text-sm leading-relaxed">Every follow-up email should include the payment link. Clients who can pay in one click pay 3x faster. Do not make them dig through their email for the original invoice.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="shrink-0 w-7 h-7 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-sm font-bold">2</div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Set specific dates, not vague timeframes</h3>
                <p className="text-slate-600 text-sm leading-relaxed">"Please pay by Friday" is more effective than "please pay soon." Specific deadlines create action; vague ones get deferred.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="shrink-0 w-7 h-7 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-sm font-bold">3</div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Do not apologize for following up</h3>
                <p className="text-slate-600 text-sm leading-relaxed">Remove phrases like "I'm so sorry to bother you" or "I know you're busy." You completed the work. You are owed the money. Following up is professional, not rude.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="shrink-0 w-7 h-7 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-sm font-bold">4</div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Send at consistent intervals</h3>
                <p className="text-slate-600 text-sm leading-relaxed">Day 3, 7, 14 is the proven cadence. Long enough to not be aggressive, short enough to keep the invoice top of mind. Do not wait 30 days between emails.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="shrink-0 w-7 h-7 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-sm font-bold">5</div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Stop as soon as the invoice is paid</h3>
                <p className="text-slate-600 text-sm leading-relaxed">If you are automating follow-ups, make absolutely certain the system stops sending when payment is received. Sending a "final notice" to a client who paid is a relationship-ending mistake.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Automate CTA */}
        <div className="border-t border-slate-100 pt-10 mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Rather not manage this yourself?</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            These templates work — but they only work if you send them, at the right time, for every invoice. When you are juggling five clients and a full project load, the follow-ups get delayed or skipped entirely.
          </p>
          <p className="text-slate-600 leading-relaxed mb-6">
            <Link href="/" className="text-indigo-600 hover:underline">Chase</Link> sends all four emails automatically on the right days — and stops the moment your client pays. Free for your first 3 invoices, no card required.
          </p>
          <Link href="/signup" className="inline-flex items-center gap-2 bg-indigo-600 text-white font-semibold px-5 py-3 rounded-xl hover:bg-indigo-700 transition-colors">
            Automate your invoice follow-up — free →
          </Link>
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 bg-slate-900 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Never write a follow-up email again.</h2>
          <p className="text-slate-400 mb-6 max-w-md mx-auto text-sm leading-relaxed">
            Chase handles the day-3, day-7, and day-14 follow-ups automatically. You just send the invoice and get paid.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-white text-slate-900 font-semibold px-6 py-3 rounded-xl hover:bg-slate-100 transition-colors"
          >
            Start free — no card required →
          </Link>
          <p className="text-slate-500 text-xs mt-3">Setup takes 3 minutes. Free for first 3 invoices.</p>
        </div>

        {/* Related */}
        <div className="mt-10 pt-8 border-t border-slate-100">
          <p className="text-sm font-semibold text-slate-400 mb-4">More guides</p>
          <Link href="/blog/how-to-follow-up-on-unpaid-invoice-freelancer" className="group block border border-slate-200 rounded-xl p-5 hover:border-indigo-200 transition-colors">
            <span className="text-xs text-indigo-600 font-semibold">Getting Paid</span>
            <h3 className="font-semibold text-slate-900 mt-1 group-hover:text-indigo-700 transition-colors">{"How to Follow Up on an Unpaid Invoice: The Complete Freelancer's Guide"}</h3>
          </Link>
        </div>
      </article>
    </div>
  )
}
