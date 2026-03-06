'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'

const PROMO_CODE = 'LAUNCH20'
const TIMER_SECONDS = 10 * 60 // 10 minutes

export default function ExitIntentPopup() {
  const [visible, setVisible] = useState(false)
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS)
  const [copied, setCopied] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Exit-intent trigger
  useEffect(() => {
    const key = 'chase_exit_shown'
    const count = parseInt(sessionStorage.getItem(key) ?? '0', 10)
    if (count >= 1) return // once per session

    let triggered = false

    function handleMouseLeave(e: MouseEvent) {
      if (e.clientY > 20 || triggered) return
      triggered = true
      sessionStorage.setItem(key, String(count + 1))
      setTimeout(() => setVisible(true), 200)
    }

    // Attach after 8s — don't fire for bounce visitors
    const timer = setTimeout(() => {
      document.addEventListener('mouseleave', handleMouseLeave)
    }, 8000)

    return () => {
      clearTimeout(timer)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  // Countdown starts when popup appears
  useEffect(() => {
    if (!visible) return
    intervalRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(intervalRef.current!)
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [visible])

  function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0')
    const s = (seconds % 60).toString().padStart(2, '0')
    return { m, s }
  }

  function copyCode() {
    navigator.clipboard.writeText(PROMO_CODE).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }).catch(() => {
      // Fallback: select text for manual copy
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  if (!visible) return null

  const { m, s } = formatTime(timeLeft)
  const expired = timeLeft === 0

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(15,23,42,0.75)', backdropFilter: 'blur(6px)' }}
      onClick={() => setVisible(false)}
    >
      <div
        className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
        style={{ animation: 'chase-pop 0.25s cubic-bezier(0.34,1.56,0.64,1)' }}
      >
        {/* Top gradient bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-600" />

        {/* Close button */}
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
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold px-2.5 py-1 rounded-full mb-4">
            <span>⚡</span> Limited-time launch offer
          </div>

          {/* Headline */}
          <h2 className="text-2xl font-bold text-slate-900 leading-tight mb-1">
            Wait — here&apos;s 20% off Pro.
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed mb-5">
            Use code <span className="font-bold text-slate-800">{PROMO_CODE}</span> at checkout and get Pro for just{' '}
            <span className="font-bold text-indigo-600">$15.20/mo</span>{' '}
            <span className="line-through text-slate-400">$19</span> — that&apos;s cheaper than losing one invoice to late payment.
          </p>

          {/* Countdown */}
          <div
            className="rounded-xl p-4 mb-5"
            style={{ backgroundColor: '#09090b' }}
          >
            <p className="text-xs font-semibold text-center mb-2.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
              {expired ? 'Offer may have expired — try the code anyway' : 'Offer expires in'}
            </p>
            {!expired ? (
              <div className="flex items-center justify-center gap-3">
                <div className="flex flex-col items-center min-w-[3rem]">
                  <span className="text-white text-3xl font-bold font-mono tabular-nums leading-none">{m}</span>
                  <span className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>min</span>
                </div>
                <span className="text-white text-3xl font-bold leading-none">:</span>
                <div className="flex flex-col items-center min-w-[3rem]">
                  <span className="text-white text-3xl font-bold font-mono tabular-nums leading-none">{s}</span>
                  <span className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>sec</span>
                </div>
              </div>
            ) : (
              <p className="text-center text-amber-400 text-sm font-semibold">⏰ Timer expired — code may still work!</p>
            )}
          </div>

          {/* Promo code copy box */}
          <div className="flex items-stretch gap-2 mb-5">
            <div
              className="flex-1 rounded-xl px-4 py-3 flex items-center justify-center border-2 border-dashed"
              style={{ backgroundColor: '#eef2ff', borderColor: '#a5b4fc' }}
            >
              <span className="font-bold text-lg tracking-[0.2em]" style={{ color: '#4338ca' }}>{PROMO_CODE}</span>
            </div>
            <button
              onClick={copyCode}
              className="shrink-0 text-white text-sm font-semibold px-4 rounded-xl transition-all whitespace-nowrap"
              style={{ backgroundColor: copied ? '#16a34a' : '#4f46e5' }}
            >
              {copied ? '✓ Copied!' : 'Copy code'}
            </button>
          </div>

          {/* Primary CTA */}
          <Link
            href="/signup"
            onClick={() => setVisible(false)}
            className="inline-flex items-center justify-center gap-2 w-full text-white font-semibold px-6 py-3 rounded-xl transition-colors text-base"
            style={{ backgroundColor: '#4f46e5' }}
          >
            Claim 20% off — start free trial →
          </Link>

          {/* Trust line */}
          <p className="text-xs text-slate-400 text-center mt-3">
            14-day free trial · Apply code at checkout · Cancel anytime
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
