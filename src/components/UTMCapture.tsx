'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export default function UTMCapture() {
  const searchParams = useSearchParams()

  useEffect(() => {
    if (typeof window === 'undefined') return
    // Don't overwrite an already-captured source
    if (localStorage.getItem('chase_source')) return

    const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'ref']
    const captured: Record<string, string> = {}
    utmKeys.forEach(k => { const v = searchParams.get(k); if (v) captured[k] = v })

    // Determine the human-readable source name
    let source = 'direct'
    if (captured.utm_source) source = captured.utm_source
    else if (captured.ref)    source = `ref:${captured.ref}`
    else if (document.referrer) {
      try {
        const h = new URL(document.referrer).hostname.replace('www.', '')
        if (h && h !== window.location.hostname) source = h
      } catch { /* ignore */ }
    }

    const payload = {
      source,
      medium:   captured.utm_medium   ?? null,
      campaign: captured.utm_campaign ?? null,
      referrer: document.referrer || null,
      captured_at: new Date().toISOString(),
    }

    try {
      localStorage.setItem('chase_source', JSON.stringify(payload))
      sessionStorage.setItem('utm_params', JSON.stringify(captured))
    } catch { /* storage unavailable */ }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}
