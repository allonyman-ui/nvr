'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function ExitIntentPopup() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Only show once per session and never to users who've already seen it 3 times
    const key = 'chase_exit_shown'
    const count = parseInt(sessionStorage.getItem(key) ?? '0', 10)
    if (count >= 1) return // show once per session max

    let triggered = false

    function handleMouseLeave(e: MouseEvent) {
      // Fire when cursor exits through the TOP of the viewport
      if (e.clientY > 20 || triggered) return
      triggered = true
      sessionStorage.setItem(key, String(count + 1))
      // Small delay so it doesn't feel jarring
      setTimeout(() => setVisible(true), 200)
    }

    // Only attach after 8s on page — visitors who bounce immediately don't count
    const timer = setTimeout(() => {
      document.addEventListener('mouseleave', handleMouseLeave)
    }, 8000)

    return () => {
      clearTimeout(timer)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  if (!visible) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(4px)' }}
      onClick={() => setVisible(false)}
    >
      <div
        className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
        style={{ animation: 'chase-pop 0.25s cubic-bezier(0.34,1.56,0.64,1)' }}
      >
        {/* Top accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-600" />

        {/* Close */}
        <button
          onClick={() => setVisible(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
          aria-label="Close"
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="p-8">
          {/* Icon */}
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-5">
            <svg width="26" height="26" fill="none" stroke="#4f46e5" strokeWidth="1.75" viewBox="0 0 24 24">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>

          <h2 className="text-xl font-bold text-slate-900 leading-snug mb-2">
            Still chasing invoices manually?
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed mb-6">
            Chase sends every follow-up automatically — so you can focus on the work, not the awkward "just checking in" emails. Free for 14 days, no card needed.
          </p>

          {/* Proof */}
          <div className="flex items-center gap-3 mb-6 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex -space-x-2">
              {['#6366f1','#8b5cf6','#06b6d4'].map((c, i) => (
                <div key={i} className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: c }}>
                  {['J','S','M'][i]}
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-600">
              <span className="font-semibold text-slate-800">Freelancers</span> saved an average of <span className="font-semibold text-indigo-600">4.2 hours/month</span> on follow-ups
            </p>
          </div>

          <Link
            href="/signup"
            onClick={() => setVisible(false)}
            className="btn-primary w-full justify-center py-3 text-base"
          >
            Start free 14-day trial →
          </Link>
          <p className="text-xs text-slate-400 text-center mt-3">
            No credit card required • Cancel any time
          </p>
        </div>
      </div>

      <style>{`
        @keyframes chase-pop {
          from { opacity: 0; transform: scale(0.9) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  )
}
