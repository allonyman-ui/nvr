'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function StickyCTA() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    function onScroll() {
      // Show after scrolling 600px (past the hero)
      setVisible(window.scrollY > 600)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 transition-transform duration-300"
      style={{ transform: visible ? 'translateY(0)' : 'translateY(100%)' }}
    >
      {/* Stripe bar */}
      <div className="bg-[#635bff] py-1.5 px-4 flex items-center justify-center gap-2">
        <svg width="12" height="12" viewBox="0 0 32 32" fill="white">
          <path d="M16 2C8.3 2 2 8.3 2 16s6.3 14 14 14 14-6.3 14-14S23.7 2 16 2zm0 4c2.4 0 3.8 1.1 3.8 2.9 0 1.5-1.1 2.5-2.7 3 1.8.5 2.9 1.6 2.9 3.3 0 2.1-1.7 3.4-4.4 3.4-1.3 0-2.6-.4-3.6-1.2l.9-1.4c.8.6 1.6 1 2.7 1 1.4 0 2.1-.7 2.1-1.7s-.9-1.5-2.3-1.5h-.9v-1.7h.9c1.3 0 2-.6 2-1.6s-.7-1.6-2-1.6c-.9 0-1.8.4-2.5 1l-.9-1.4c.9-1 2.2-1.5 4-1.5z"/>
        </svg>
        <span className="text-white text-[11px] font-semibold">Payments secured by Stripe · PCI DSS compliant · Bank-level encryption</span>
      </div>
      {/* Main CTA */}
      <div className="bg-white border-t border-slate-200 shadow-[0_-4px_24px_rgba(0,0,0,0.12)] px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="hidden sm:block">
            <p className="text-slate-900 font-bold text-sm">Stop chasing invoices. Start getting paid.</p>
            <p className="text-slate-400 text-xs">Free for 14 days · No credit card · Setup in 5 min</p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link
              href="/signup"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm whitespace-nowrap"
            >
              Start free 14-day trial →
            </Link>
            <button
              onClick={() => setVisible(false)}
              className="shrink-0 text-slate-300 hover:text-slate-500 transition-colors p-1"
              aria-label="Dismiss"
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
