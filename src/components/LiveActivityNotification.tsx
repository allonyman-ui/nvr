'use client'

import { useEffect, useState } from 'react'

const ACTIVITIES = [
  { text: 'A freelance designer just started their free trial', ago: '2m ago' },
  { text: 'A web developer recovered a 45-day overdue invoice', ago: '5m ago' },
  { text: 'A copywriter saved 3 hours on follow-ups this week', ago: '9m ago' },
  { text: 'A UX consultant just sent their first automated chase', ago: '12m ago' },
  { text: 'A freelance dev just started their free trial', ago: '4m ago' },
  { text: 'A brand strategist got paid on an 60-day overdue invoice', ago: '7m ago' },
  { text: 'A motion designer just signed up — setup took 4 min', ago: '11m ago' },
  { text: 'A content writer recovered $1,200 in overdue invoices', ago: '3m ago' },
]

export default function LiveActivityNotification() {
  const [visible, setVisible] = useState(false)
  const [current, setCurrent] = useState(0)
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    // Wait 12s before showing first notification
    const initial = setTimeout(() => {
      setVisible(true)
      setAnimating(true)
    }, 12000)

    return () => clearTimeout(initial)
  }, [])

  useEffect(() => {
    if (!visible) return

    // Auto-hide after 5s, then show next one after 18s
    const hideTimer = setTimeout(() => {
      setAnimating(false)
      setTimeout(() => {
        setVisible(false)
        // Queue next notification
        setTimeout(() => {
          setCurrent(c => (c + 1) % ACTIVITIES.length)
          setVisible(true)
          setAnimating(true)
        }, 18000)
      }, 400)
    }, 5500)

    return () => clearTimeout(hideTimer)
  }, [visible, current])

  if (!visible) return null

  const activity = ACTIVITIES[current]

  return (
    <div
      className="fixed bottom-6 left-6 z-40 max-w-xs"
      style={{
        animation: animating
          ? 'chase-slide-in 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards'
          : 'chase-slide-out 0.35s ease-in forwards',
      }}
    >
      <div className="bg-white border border-slate-200 rounded-xl shadow-lg px-4 py-3 flex items-start gap-3">
        {/* Pulse dot */}
        <div className="relative mt-1 shrink-0">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-60" />
        </div>
        <div className="min-w-0">
          <p className="text-xs text-slate-700 leading-snug">{activity.text}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">{activity.ago}</p>
        </div>
        <button
          onClick={() => { setAnimating(false); setTimeout(() => setVisible(false), 400) }}
          className="shrink-0 text-slate-300 hover:text-slate-500 transition-colors mt-0.5"
          aria-label="Dismiss"
        >
          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <style>{`
        @keyframes chase-slide-in {
          from { opacity: 0; transform: translateX(-20px) scale(0.95); }
          to   { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes chase-slide-out {
          from { opacity: 1; transform: translateX(0) scale(1); }
          to   { opacity: 0; transform: translateX(-20px) scale(0.95); }
        }
      `}</style>
    </div>
  )
}
