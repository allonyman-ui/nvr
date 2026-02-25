'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { IntelEntry } from '@/lib/supabase';

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

// ─────────────────────────────────────────────────────────────
// Icons
// ─────────────────────────────────────────────────────────────

const Icon = {
  ArrowLeft: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  ),
  Brain: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2A2.5 2.5 0 0112 4.5v15a2.5 2.5 0 01-4.96-.46 2.5 2.5 0 01-1.07-4.8A3 3 0 015 11V9a3 3 0 013-3 2.5 2.5 0 011.5-4z" />
      <path d="M14.5 2A2.5 2.5 0 0112 4.5v15a2.5 2.5 0 004.96-.46 2.5 2.5 0 001.07-4.8A3 3 0 0119 11V9a3 3 0 00-3-3 2.5 2.5 0 00-1.5-4z" />
    </svg>
  ),
  Check: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Warning: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  Camera: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14" /><rect x="2" y="7" width="13" height="10" rx="2" />
    </svg>
  ),
  Timeline: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="2" x2="12" y2="6" /><line x1="12" y1="18" x2="12" y2="22" />
      <circle cx="12" cy="12" r="4" />
      <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" /><line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
    </svg>
  ),
};

// ─────────────────────────────────────────────────────────────
// Diagnostics panel
// ─────────────────────────────────────────────────────────────

interface DiagCheck { ok: boolean; detail: string }
interface DiagResults { ok: boolean; checks: Record<string, DiagCheck>; timestamp: string }

function DiagPanel({ diag }: { diag: DiagResults }) {
  const LABELS: Record<string, string> = {
    ANTHROPIC_API_KEY:    'Anthropic API Key',
    SUPABASE_URL:         'Supabase URL',
    SUPABASE_ANON_KEY:    'Supabase Anon Key',
    SUPABASE_SERVICE_KEY: 'Supabase Service Key',
    GO2RTC_BASE_URL:      'go2rtc URL',
    cameras:              'Cameras',
    activity_events_table:'activity_events table',
    ai_intel_log_table:   'ai_intel_log table',
    ai_intel_log_insert:  'Insert permission',
  };
  return (
    <div className="rounded-xl bg-white/[0.025] border border-white/[0.08] overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.05] bg-white/[0.02]">
        <span className={`w-2 h-2 rounded-full flex-none ${diag.ok ? 'bg-green-500' : 'bg-red-500'}`} />
        <p className="text-[11px] font-semibold text-white/60 uppercase tracking-wider">
          Setup Diagnostics
        </p>
        <span className="ml-auto text-[9px] text-white/20 font-mono">
          {new Date(diag.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </span>
      </div>
      <div className="divide-y divide-white/[0.04]">
        {Object.entries(diag.checks).map(([key, check]) => (
          <div key={key} className="flex items-start gap-3 px-4 py-2.5">
            <span className={`flex-none mt-0.5 font-bold text-[11px] ${check.ok ? 'text-green-500' : 'text-red-400'}`}>
              {check.ok ? '✓' : '✗'}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-medium text-white/55">{LABELS[key] ?? key}</p>
              <p className={`text-[10px] mt-0.5 break-all leading-relaxed ${check.ok ? 'text-white/25' : 'text-red-400/70'}`}>
                {check.detail}
              </p>
            </div>
          </div>
        ))}
      </div>
      {!diag.ok && (
        <div className="px-4 py-3 border-t border-white/[0.05] bg-amber-500/[0.04]">
          <p className="text-[10px] text-amber-400/70 leading-relaxed">
            <strong className="text-amber-400">Fix:</strong> Add missing env vars to Vercel → Project Settings → Environment Variables.
            For missing Supabase tables: open the Supabase SQL Editor and run <code className="bg-white/10 px-1 rounded">supabase/schema.sql</code> from your repo.
          </p>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Intel page client
// ─────────────────────────────────────────────────────────────

export default function IntelClient() {
  const router = useRouter();

  const [entries, setEntries] = useState<IntelEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildStep, setBuildStep] = useState(0);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [diag, setDiag] = useState<DiagResults | null>(null);
  const [diagLoading, setDiagLoading] = useState(false);

  async function doFetch(): Promise<IntelEntry[]> {
    const res = await fetch('/api/intel-log?limit=50');
    if (!res.ok) {
      const body = await res.json().catch(() => ({})) as { error?: string };
      const msg = body.error ?? `HTTP ${res.status}`;
      console.error('[Intel] fetch failed:', msg);
      throw new Error(msg);
    }
    const data = (await res.json()) as { entries?: IntelEntry[] };
    const fetched = data.entries ?? [];
    console.log('[Intel] fetched', fetched.length, 'entries');
    setEntries(fetched);
    return fetched;
  }

  async function doGenerate() {
    const res = await fetch('/api/intel-update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ frames: [], trigger: 'manual' }),
    });
    const body = await res.json().catch(() => ({})) as { error?: string; entry?: { id: string } };
    if (!res.ok) {
      const msg = body.error ?? `Server error ${res.status}`;
      console.error('[Intel] generate failed:', msg);
      throw new Error(msg);
    }
    if (body.entry?.id) {
      console.log('[Intel] generated entry id:', body.entry.id);
    }
  }

  async function runDiagnostics() {
    setDiagLoading(true);
    try {
      const res = await fetch('/api/intel-debug');
      const data = (await res.json()) as DiagResults;
      console.log('[Intel] diagnostics:', data.ok ? 'all ok' : 'issues found', data.checks);
      setDiag(data);
    } catch (e) {
      console.error('[Intel] diagnostics network error:', e);
    } finally {
      setDiagLoading(false);
    }
  }

  // On mount: load entries + auto-run diagnostics in parallel, poll every 60s
  useEffect(() => {
    let cancelled = false;
    void runDiagnostics();
    (async () => {
      setLoading(true);
      let fetchOk = false;
      let fetched: IntelEntry[] = [];
      try {
        fetched = await doFetch();
        fetchOk = true;
      } catch (e) {
        if (!cancelled) setGenError(e instanceof Error ? e.message : 'Failed to load entries');
      } finally {
        if (!cancelled) setLoading(false);
      }
      if (!cancelled && fetchOk && fetched.length === 0) {
        if (!cancelled) setGenerating(true);
        try {
          await doGenerate();
          if (!cancelled) { try { await doFetch(); } catch (e) { console.error('[Intel] post-generate fetch error:', e); } }
        } catch (e) {
          if (!cancelled) setGenError(e instanceof Error ? e.message : 'Failed to generate report');
        } finally {
          if (!cancelled) setGenerating(false);
        }
      }
    })();
    const pollId = setInterval(() => { void doFetch().catch((e) => console.error('[Intel] poll error:', e)); }, 60_000);
    return () => { cancelled = true; clearInterval(pollId); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleGenerate() {
    if (generating || isBuilding) return;
    setGenerating(true);
    setGenError(null);
    try {
      await doGenerate();
      await doFetch();
    } catch (e) {
      setGenError(e instanceof Error ? e.message : 'Network error');
    } finally {
      setGenerating(false);
    }
  }

  async function handleBuildHistory() {
    if (generating || isBuilding) return;
    setIsBuilding(true);
    setGenError(null);
    for (let i = 0; i < 5; i++) {
      setBuildStep(i + 1);
      try {
        await doGenerate();
        await doFetch();
      } catch (e) {
        setGenError(e instanceof Error ? e.message : 'Build error');
        break;
      }
    }
    setIsBuilding(false);
    setBuildStep(0);
  }

  const latest = entries[0] ?? null;
  const older = entries.slice(1);
  const totalAnomalies = entries.slice(0, 3).reduce((s, e) => s + e.anomalies.length, 0);

  const recentPatterns = entries.slice(0, 5).flatMap((e) => e.patterns);
  const grouped = {
    confirmed:  recentPatterns.filter((p) => p.startsWith('CONFIRMED:')).map((p) => p.replace(/^CONFIRMED:\s*/, '')),
    new:        recentPatterns.filter((p) => p.startsWith('NEW:')).map((p) => p.replace(/^NEW:\s*/, '')),
    insight:    recentPatterns.filter((p) => p.startsWith('INSIGHT:')).map((p) => p.replace(/^INSIGHT:\s*/, '')),
    prediction: recentPatterns.filter((p) => p.startsWith('PREDICTION:')).map((p) => p.replace(/^PREDICTION:\s*/, '')),
  };
  const hasPatterns = Object.values(grouped).some((g) => g.length > 0);

  return (
    <div className="min-h-screen bg-[#080c12] text-white">

      {/* ── Header ── */}
      <header className="sticky top-0 z-30 bg-[#080c12]/95 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">

          {/* Back */}
          <button onClick={() => router.push('/')}
            className="flex items-center gap-1.5 text-white/35 hover:text-white/75
                       transition-colors text-[12px] font-medium group flex-none">
            <span className="group-hover:-translate-x-0.5 transition-transform"><Icon.ArrowLeft /></span>
            Home
          </button>

          <div className="w-px h-4 bg-white/[0.08]" />

          {/* Title */}
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-violet-600/15 border border-violet-500/25
                            flex items-center justify-center text-violet-400 flex-none">
              <Icon.Brain />
            </div>
            <div>
              <h1 className="text-[13px] font-semibold text-white/90 leading-none">Intelligence Log</h1>
              <p className="text-[9px] text-white/20 mt-0.5">AI-powered scene analysis</p>
            </div>
          </div>

          {/* Live badge */}
          <span className="px-2 py-1 rounded-full bg-violet-500/15 border border-violet-500/25
                           text-violet-400 text-[9px] font-semibold uppercase tracking-wider flex-none">
            LIVE
          </span>
        </div>
      </header>

      {/* ── Body ── */}
      <main className="max-w-7xl mx-auto px-4 py-6">

        {/* ── Loading ── */}
        {loading && entries.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 gap-5">
            <div className="w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-violet-400/40 border-t-violet-400 rounded-full" style={{ animation: 'spin 0.8s linear infinite' }} />
            </div>
            <p className="text-white/40 text-[14px]">Loading intelligence log…</p>
          </div>
        )}

        {/* ── Auto-generating first report ── */}
        {!loading && entries.length === 0 && generating && (
          <div className="flex flex-col items-center justify-center py-32 gap-5">
            <div className="w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400/60">
              <div style={{ animation: 'spin 2s linear infinite' }}><Icon.Brain /></div>
            </div>
            <div className="text-center">
              <p className="text-white/60 text-[14px] font-medium">Generating first intelligence report…</p>
              <p className="text-white/25 text-[12px] mt-1">Analysing camera feeds and recent activity</p>
            </div>
          </div>
        )}

        {/* ── Empty state ── */}
        {!loading && entries.length === 0 && !generating && (
          <div className="max-w-lg mx-auto pt-16 pb-10 flex flex-col gap-4">
            <div className="flex flex-col items-center gap-4 text-center mb-2">
              <div className="w-20 h-20 rounded-full bg-violet-500/[0.07] border border-violet-500/15 flex items-center justify-center text-violet-400/30">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9.5 2A2.5 2.5 0 0112 4.5v15a2.5 2.5 0 01-4.96-.46 2.5 2.5 0 01-1.07-4.8A3 3 0 015 11V9a3 3 0 013-3 2.5 2.5 0 011.5-4z" />
                  <path d="M14.5 2A2.5 2.5 0 0112 4.5v15a2.5 2.5 0 004.96-.46 2.5 2.5 0 001.07-4.8A3 3 0 0119 11V9a3 3 0 00-3-3 2.5 2.5 0 00-1.5-4z" />
                </svg>
              </div>
              <div>
                <p className="text-white/40 text-[15px] font-medium mb-1">No intelligence reports yet</p>
                <p className="text-white/20 text-[12px] leading-relaxed">
                  Reports auto-generate when the dashboard is open, or click below to generate one now.
                </p>
              </div>
            </div>

            {genError && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3">
                <p className="text-[12px] font-medium text-red-400 mb-1">Generation failed</p>
                <p className="text-[11px] text-red-400/70 font-mono break-all">{genError}</p>
              </div>
            )}

            <div className="flex gap-2">
              <button onClick={() => void handleGenerate()} disabled={generating}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl
                           bg-violet-600/20 border border-violet-500/30 text-violet-400 text-[12px]
                           font-medium hover:bg-violet-600/30 transition-all disabled:opacity-50">
                {generating
                  ? <><div className="w-3.5 h-3.5 border border-violet-400/40 border-t-violet-400 rounded-full" style={{ animation: 'spin 0.8s linear infinite' }} /> Generating…</>
                  : <><Icon.Brain /> Generate Report</>
                }
              </button>
              <button onClick={() => void runDiagnostics()} disabled={diagLoading}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-[11px] font-medium
                           bg-white/[0.04] border border-white/[0.08] text-white/35
                           hover:bg-white/[0.07] hover:text-white/55 transition-all disabled:opacity-50">
                {diagLoading
                  ? <div className="w-3 h-3 border border-white/20 border-t-white/50 rounded-full" style={{ animation: 'spin 0.8s linear infinite' }} />
                  : <Icon.Check />
                }
                {diagLoading ? 'Checking…' : 'Diagnose'}
              </button>
            </div>

            {diagLoading && !diag && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.07]">
                <div className="w-3 h-3 border border-white/20 border-t-white/50 rounded-full" style={{ animation: 'spin 0.8s linear infinite' }} />
                <p className="text-[11px] text-white/30">Running diagnostics…</p>
              </div>
            )}
            {diag && <DiagPanel diag={diag} />}
          </div>
        )}

        {/* ── Main content (when entries exist) ── */}
        {entries.length > 0 && (
          <div className="space-y-5 max-w-4xl">

            {/* ── Action bar ── */}
            <div className="flex items-center gap-2 flex-wrap">
              <button onClick={() => void handleGenerate()} disabled={generating || isBuilding}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[11px] font-medium
                           bg-violet-600/15 border border-violet-500/25 text-violet-400
                           hover:bg-violet-600/25 transition-all disabled:opacity-50">
                {generating
                  ? <><div className="w-3 h-3 border border-violet-400/40 border-t-violet-400 rounded-full" style={{ animation: 'spin 0.8s linear infinite' }} /> Generating…</>
                  : <><Icon.Brain /> Generate Report</>
                }
              </button>
              <button onClick={() => void handleBuildHistory()} disabled={generating || isBuilding}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[11px] font-medium
                           bg-white/[0.04] border border-white/[0.07] text-white/40
                           hover:bg-white/[0.07] hover:text-white/60 transition-all disabled:opacity-50">
                {isBuilding ? `Building… ${buildStep}/5` : 'Build History ×5'}
              </button>
              {latest && (
                <span className="text-[10px] text-white/20 ml-auto tabular-nums">
                  Last report: {timeAgo(latest.timestamp)}
                </span>
              )}
            </div>

            {/* ── Error banner ── */}
            {genError && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3">
                <div className="flex items-start gap-2.5">
                  <span className="font-bold text-red-400 mt-px flex-none text-[13px]">!</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-medium text-red-400">Generation failed</p>
                    <p className="text-[11px] mt-0.5 text-red-400/70 font-mono break-all">{genError}</p>
                  </div>
                  <button onClick={() => void runDiagnostics()} disabled={diagLoading}
                    className="flex-none flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-medium
                               bg-white/[0.06] border border-white/[0.10] text-white/40
                               hover:text-white/60 hover:bg-white/10 transition-all disabled:opacity-50">
                    {diagLoading
                      ? <div className="w-3 h-3 border border-white/20 border-t-white/50 rounded-full" style={{ animation: 'spin 0.8s linear infinite' }} />
                      : <Icon.Check />
                    }
                    Diagnose
                  </button>
                </div>
                {diag && <div className="mt-3"><DiagPanel diag={diag} /></div>}
              </div>
            )}

            {/* ── Stats ── */}
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'Reports', value: entries.length, sub: 'stored', color: 'violet' as const },
                { label: 'Events', value: entries.slice(0, 5).reduce((s, e) => s + e.total_events, 0), sub: 'last 5 reports', color: 'blue' as const },
                { label: 'Anomalies', value: totalAnomalies, sub: 'last 3 reports', color: 'amber' as const },
                { label: 'Faces', value: entries.slice(0, 5).reduce((s, e) => s + e.face_count, 0), sub: 'last 5 reports', color: 'purple' as const },
              ].map(({ label, value, sub, color }) => (
                <div key={label}
                  className={`relative overflow-hidden bg-white/[0.025] border rounded-2xl px-4 py-3.5 ${
                    color === 'violet' ? 'border-violet-500/[0.12]' :
                    color === 'blue'   ? 'border-blue-500/[0.12]' :
                    color === 'amber'  ? 'border-amber-500/[0.12]' : 'border-purple-500/[0.12]'
                  }`}>
                  <p className={`text-2xl font-bold tabular-nums ${
                    color === 'violet' ? 'text-violet-400' :
                    color === 'blue'   ? 'text-blue-400' :
                    color === 'amber'  ? 'text-amber-400' : 'text-purple-400'
                  }`}>{value}</p>
                  <p className="text-[10px] font-semibold text-white/40 mt-0.5">{label}</p>
                  <p className="text-[9px] text-white/15 mt-0.5">{sub}</p>
                </div>
              ))}
            </div>

            {/* ── Latest report ── */}
            {latest && (
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-500/8 to-blue-500/4 border border-violet-500/[0.18] p-6">
                <div className="absolute top-0 right-0 w-40 h-40 bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />

                <div className="flex items-start gap-3 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center text-violet-400 flex-none">
                    <Icon.Brain />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <p className="text-[13px] font-semibold text-white/85">{latest.period_label}</p>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wider border ${
                        latest.trigger === 'motion'    ? 'bg-amber-500/15 border-amber-500/25 text-amber-400' :
                        latest.trigger === 'manual'    ? 'bg-blue-500/15 border-blue-500/25 text-blue-400' :
                        latest.trigger === 'scheduled' ? 'bg-green-500/15 border-green-500/25 text-green-400' :
                        'bg-white/5 border-white/10 text-white/30'
                      }`}>{latest.trigger}</span>
                    </div>
                    <p className="text-[10px] text-white/25">
                      {timeAgo(latest.timestamp)} · {latest.total_events} events · {latest.face_count} faces
                    </p>
                  </div>
                </div>

                <p className="text-[14px] text-white/80 leading-relaxed mb-4">{latest.summary}</p>

                {latest.change_from_previous && (
                  <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] mb-4">
                    <span className="text-[9px] font-bold text-white/25 uppercase tracking-widest mt-0.5 flex-none">Δ</span>
                    <p className="text-[12px] text-white/50 leading-relaxed italic">{latest.change_from_previous}</p>
                  </div>
                )}

                {Object.keys(latest.camera_states).length > 0 && (
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(latest.camera_states).map(([cam, desc]) => (
                      <div key={cam} className="flex items-start gap-2.5 px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                        <div className="flex-none w-5 h-5 rounded-md bg-blue-500/10 border border-blue-500/15 flex items-center justify-center text-blue-400/70 mt-0.5">
                          <Icon.Camera />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[9px] font-semibold text-blue-400/60 uppercase tracking-wider mb-0.5 truncate">{cam}</p>
                          <p className="text-[11px] text-white/55 leading-snug line-clamp-2">{desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── Anomalies ── */}
            {latest && latest.anomalies.length > 0 && (
              <div className="rounded-2xl bg-amber-500/[0.06] border border-amber-500/20 p-5">
                <div className="flex items-center gap-2 mb-3.5">
                  <div className="w-6 h-6 rounded-lg bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-amber-400">
                    <Icon.Warning />
                  </div>
                  <p className="text-[12px] font-semibold text-amber-400/80 uppercase tracking-wider">Anomalies Detected</p>
                </div>
                <ul className="space-y-2">
                  {latest.anomalies.map((a, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="flex-none w-1.5 h-1.5 rounded-full bg-amber-500/60 mt-[7px]" />
                      <span className="text-[13px] text-amber-400/80 leading-relaxed">{a}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* ── Activity log ── */}
            {latest && latest.activity_lines.length > 0 && (
              <div className="rounded-2xl bg-white/[0.025] border border-white/[0.07] p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded-lg bg-green-500/15 border border-green-500/25 flex items-center justify-center text-green-400">
                    <Icon.Timeline />
                  </div>
                  <p className="text-[12px] font-semibold text-white/50 uppercase tracking-wider">Activity Log</p>
                  <span className="ml-auto text-[9px] text-white/20 bg-white/[0.04] border border-white/[0.06] rounded-full px-2 py-0.5">
                    {latest.activity_lines.length} events
                  </span>
                </div>
                <div className="space-y-1.5 max-h-56 overflow-y-auto scrollbar-none pr-1">
                  {latest.activity_lines.map((line, i) => (
                    <div key={i} className="flex items-start gap-2.5 py-1">
                      <span className="flex-none w-1 h-1 rounded-full bg-white/15 mt-[7px]" />
                      <span className="text-[11px] text-white/45 leading-relaxed font-mono">{line}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Patterns ── */}
            {hasPatterns && (
              <div className="rounded-2xl bg-white/[0.025] border border-white/[0.07] p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded-lg bg-blue-500/15 border border-blue-500/25 flex items-center justify-center text-blue-400">
                    <Icon.Check />
                  </div>
                  <p className="text-[12px] font-semibold text-white/50 uppercase tracking-wider">Patterns</p>
                  <span className="text-[9px] text-white/15 ml-2">from last {Math.min(entries.length, 5)} reports</span>
                </div>
                <div className="space-y-4">
                  {([
                    { key: 'confirmed',  label: 'Confirmed',  items: grouped.confirmed,  textCls: 'text-emerald-400', borderCls: 'bg-emerald-500/[0.06] border-emerald-500/15 text-emerald-400/80' },
                    { key: 'new',        label: 'New',        items: grouped.new,        textCls: 'text-blue-400',    borderCls: 'bg-blue-500/[0.06] border-blue-500/15 text-blue-400/80'       },
                    { key: 'insight',    label: 'Insight',    items: grouped.insight,    textCls: 'text-violet-400',  borderCls: 'bg-violet-500/[0.06] border-violet-500/15 text-violet-400/80'  },
                    { key: 'prediction', label: 'Prediction', items: grouped.prediction, textCls: 'text-amber-400',   borderCls: 'bg-amber-500/[0.06] border-amber-500/15 text-amber-400/80'    },
                  ] as const).filter(({ items }) => items.length > 0).map(({ key, label, items, textCls, borderCls }) => (
                    <div key={key}>
                      <p className={`text-[9px] font-bold uppercase tracking-widest mb-2 ${textCls}`}>{label}</p>
                      <div className="space-y-1.5">
                        {items.map((item, i) => (
                          <div key={i} className={`flex items-start gap-2 px-3 py-2 rounded-xl border ${borderCls}`}>
                            <span className="flex-none w-1 h-1 rounded-full bg-current opacity-50 mt-[7px]" />
                            <span className="text-[12px] leading-relaxed">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── History ── */}
            {older.length > 0 && (
              <div className="rounded-2xl bg-white/[0.025] border border-white/[0.07] overflow-hidden">
                <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/[0.05]">
                  <div className="w-6 h-6 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-white/35">
                    <Icon.Timeline />
                  </div>
                  <p className="text-[12px] font-semibold text-white/50 uppercase tracking-wider">History</p>
                  <span className="ml-auto text-[9px] text-white/20 bg-white/[0.04] border border-white/[0.06] rounded-full px-2 py-0.5">
                    {older.length} earlier reports
                  </span>
                </div>
                <div className="divide-y divide-white/[0.04]">
                  {older.map((entry) => (
                    <div key={entry.id}>
                      <button
                        onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
                        className="w-full flex items-start gap-4 px-5 py-3.5 text-left hover:bg-white/[0.02] transition-colors">
                        <div className="flex-none pt-1.5">
                          <div className="w-2 h-2 rounded-full bg-violet-500/25 border border-violet-500/40" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="text-[12px] font-medium text-white/55">{entry.period_label}</span>
                            <span className={`text-[9px] font-semibold uppercase ${
                              entry.trigger === 'motion' ? 'text-amber-400/50' :
                              entry.trigger === 'manual' ? 'text-blue-400/50' : 'text-white/20'
                            }`}>{entry.trigger}</span>
                            {entry.anomalies.length > 0 && (
                              <span className="px-1.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/20 text-amber-400 text-[8px] font-bold">
                                {entry.anomalies.length} anomaly
                              </span>
                            )}
                            <span className="ml-auto text-[9px] text-white/15 tabular-nums flex-none">{timeAgo(entry.timestamp)}</span>
                          </div>
                          <p className="text-[12px] text-white/30 leading-relaxed line-clamp-2">{entry.summary}</p>
                        </div>
                        <span className="text-white/15 text-[9px] flex-none pt-1.5">
                          {expandedId === entry.id ? '▲' : '▼'}
                        </span>
                      </button>
                      {expandedId === entry.id && (
                        <div className="px-5 pb-4 ml-10 space-y-3">
                          {entry.change_from_previous && (
                            <p className="text-[11px] text-white/35 italic border-l-2 border-white/[0.08] pl-3 leading-relaxed">
                              {entry.change_from_previous}
                            </p>
                          )}
                          {Object.keys(entry.camera_states).length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              {Object.entries(entry.camera_states).map(([cam, desc]) => (
                                <div key={cam} className="flex items-start gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.05] text-[10px]">
                                  <span className="text-blue-400/40 flex-none mt-px"><Icon.Camera /></span>
                                  <span>
                                    <span className="font-medium text-white/40">{cam}: </span>
                                    <span className="text-white/30">{desc}</span>
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                          {entry.anomalies.length > 0 && (
                            <div className="space-y-1">
                              {entry.anomalies.map((a, i) => (
                                <div key={i} className="flex items-center gap-1.5 text-[11px] text-amber-400/60">
                                  <Icon.Warning /> <span>{a}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { scrollbar-width: none; }
      `}</style>
    </div>
  );
}
