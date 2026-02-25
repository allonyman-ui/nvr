'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { IntelEntry } from '@/lib/supabase';

type Tab = 'now' | 'patterns' | 'history';

// ── Helpers ──────────────────────────────────────────────────────────────────

function fmtAgo(iso: string) {
  const diff = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (diff < 1)  return 'just now';
  if (diff < 60) return `${diff}m ago`;
  const h = Math.round(diff / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function fmtDate(iso: string) {
  const d = new Date(iso);
  const today = new Date();
  if (d.toDateString() === today.toDateString()) return `Today ${fmtTime(iso)}`;
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return `Yesterday ${fmtTime(iso)}`;
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' ' + fmtTime(iso);
}

function patternPrefix(p: string): 'confirmed' | 'new' | 'insight' | 'prediction' | 'other' {
  const up = p.toUpperCase();
  if (up.startsWith('CONFIRMED:') || up.startsWith('CONFIRMED ')) return 'confirmed';
  if (up.startsWith('NEW:') || up.startsWith('NEW '))             return 'new';
  if (up.startsWith('INSIGHT:') || up.startsWith('INSIGHT '))     return 'insight';
  if (up.startsWith('PREDICTION:') || up.startsWith('PREDICTION ')) return 'prediction';
  return 'other';
}

function stripPrefix(p: string) {
  return p.replace(/^(CONFIRMED|NEW|INSIGHT|PREDICTION)[:\s]+/i, '').trim();
}

const PREFIX_STYLES = {
  confirmed:  { label: 'Confirmed',  chip: 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400', dot: 'bg-emerald-500' },
  new:        { label: 'New',        chip: 'bg-blue-500/10 border-blue-500/25 text-blue-400',          dot: 'bg-blue-500'    },
  insight:    { label: 'Insight',    chip: 'bg-violet-500/10 border-violet-500/25 text-violet-400',    dot: 'bg-violet-500'  },
  prediction: { label: 'Prediction', chip: 'bg-amber-500/10 border-amber-500/25 text-amber-400',       dot: 'bg-amber-500'   },
  other:      { label: '',           chip: 'bg-white/[0.04] border-white/[0.08] text-white/40',        dot: 'bg-white/30'    },
} as const;

// ── Icons ─────────────────────────────────────────────────────────────────────

function IconClose() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
function IconBrain() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2A2.5 2.5 0 0112 4.5v15a2.5 2.5 0 01-4.96-.46 2.5 2.5 0 01-1.07-4.8A3 3 0 015 11V9a3 3 0 013-3 2.5 2.5 0 011.5-4z" />
      <path d="M14.5 2A2.5 2.5 0 0112 4.5v15a2.5 2.5 0 004.96-.46 2.5 2.5 0 001.07-4.8A3 3 0 0019 11V9a3 3 0 00-3-3 2.5 2.5 0 00-1.5-4z" />
    </svg>
  );
}
function IconRefresh({ spin }: { spin?: boolean }) {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      style={spin ? { animation: 'spin 1s linear infinite' } : undefined}>
      <polyline points="23 4 23 10 17 10" />
      <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
    </svg>
  );
}
function IconSend() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}
function IconWarning() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}
function IconChevron({ dir }: { dir: 'down' | 'right' }) {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      style={{ transform: dir === 'right' ? 'rotate(-90deg)' : undefined }}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
function IconActivity() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}
function IconCamera() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14" />
      <rect x="2" y="7" width="13" height="10" rx="2" />
    </svg>
  );
}
function IconSparkle() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.4 2.4-7.4L2 9.4h7.6z" />
    </svg>
  );
}

// ── History entry row ─────────────────────────────────────────────────────────

function HistoryEntry({ entry }: { entry: IntelEntry }) {
  const [expanded, setExpanded] = useState(false);
  const isSynthesis = entry.trigger === 'daily-synthesis';

  return (
    <div className="border border-white/[0.06] rounded-xl overflow-hidden
                    bg-white/[0.02] hover:bg-white/[0.035] transition-colors">
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full text-left flex items-start gap-3 px-3 py-2.5"
      >
        {/* Timeline dot */}
        <div className="flex-none flex flex-col items-center pt-1">
          <span className={`w-2 h-2 rounded-full flex-none ${
            isSynthesis ? 'bg-violet-400' : 'bg-white/20'
          }`} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
            <span className="text-[10px] text-white/35 tabular-nums font-mono">{fmtDate(entry.timestamp)}</span>
            {isSynthesis && (
              <span className="text-[8px] font-semibold tracking-wider uppercase
                               bg-violet-500/15 border border-violet-500/25 text-violet-400
                               rounded-full px-1.5 py-0.5">
                Daily
              </span>
            )}
            {entry.trigger === 'manual' && (
              <span className="text-[8px] font-semibold tracking-wider uppercase
                               bg-white/[0.06] border border-white/[0.1] text-white/30
                               rounded-full px-1.5 py-0.5">
                Manual
              </span>
            )}
            {entry.anomalies.length > 0 && (
              <span className="flex items-center gap-1 text-[9px] text-amber-400/80
                               bg-amber-500/10 border border-amber-500/20 rounded-full px-1.5 py-0.5">
                <IconWarning />
                {entry.anomalies.length} anomal{entry.anomalies.length === 1 ? 'y' : 'ies'}
              </span>
            )}
          </div>
          <p className={`text-[11px] text-white/50 leading-relaxed ${expanded ? '' : 'line-clamp-2'}`}>
            {entry.summary}
          </p>
        </div>

        {/* Stats + chevron */}
        <div className="flex-none flex flex-col items-end gap-1 pt-0.5">
          <span className="text-[9px] text-white/20 font-mono tabular-nums">
            {entry.total_events}ev · {entry.face_count}p
          </span>
          <span className="text-white/20"><IconChevron dir={expanded ? 'down' : 'right'} /></span>
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-3 border-t border-white/[0.05] space-y-2 pt-2">
          {entry.activity_lines.length > 0 && (
            <ul className="space-y-1">
              {entry.activity_lines.map((line, i) => (
                <li key={i} className="text-[10px] text-white/40 flex gap-1.5 items-start">
                  <span className="text-violet-500/50 flex-none mt-0.5">›</span>
                  {line}
                </li>
              ))}
            </ul>
          )}
          {entry.patterns.length > 0 && (
            <ul className="space-y-1">
              {entry.patterns.slice(0, 4).map((p, i) => {
                const type  = patternPrefix(p);
                const style = PREFIX_STYLES[type];
                return (
                  <li key={i} className="flex gap-1.5 items-start">
                    <span className={`w-1.5 h-1.5 rounded-full flex-none mt-1.5 ${style.dot}`} />
                    <span className="text-[10px] text-white/35 leading-snug">{stripPrefix(p)}</span>
                  </li>
                );
              })}
            </ul>
          )}
          {entry.anomalies.length > 0 && (
            <div className="rounded-lg bg-amber-500/[0.07] border border-amber-500/15 px-2.5 py-2 space-y-1">
              {entry.anomalies.map((a, i) => (
                <p key={i} className="text-[10px] text-amber-300/70 flex gap-1.5 items-start">
                  <span className="flex-none">⚠</span>{a}
                </p>
              ))}
            </div>
          )}
          {entry.change_from_previous && (
            <p className="text-[10px] text-white/25 italic border-l-2 border-white/10 pl-2">
              {entry.change_from_previous}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

interface Props {
  open: boolean;
  onClose: () => void;
  intelUpdating: boolean;
  lastIntelAt: Date | null;
  entries: IntelEntry[];
  loading: boolean;
  refreshError?: string | null;
  onRefresh: () => Promise<void>;
}

export default function IntelPanel({
  open, onClose, intelUpdating, lastIntelAt, entries, loading, refreshError, onRefresh,
}: Props) {
  const [tab,             setTab]             = useState<Tab>('now');
  const [telegramSending, setTelegramSending] = useState(false);
  const [telegramStatus,  setTelegramStatus]  = useState<'idle' | 'sent' | 'error'>('idle');
  const [telegramError,   setTelegramError]   = useState('');
  const [isBuilding,      setIsBuilding]      = useState(false);
  const [buildStep,       setBuildStep]       = useState(0);
  const buildSteps = 5;

  const prevIntelAt = useRef<Date | null>(null);
  const nowRef      = useRef<HTMLDivElement>(null);

  // Auto-trigger a first refresh when panel opens with no data
  useEffect(() => {
    if (!open || entries.length > 0 || loading || isBuilding) return;
    const t = setTimeout(() => void onRefresh(), 800);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Scroll to top on new intel update
  useEffect(() => {
    if (lastIntelAt && lastIntelAt !== prevIntelAt.current) {
      prevIntelAt.current = lastIntelAt;
      if (tab === 'now') nowRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [lastIntelAt, tab]);

  // Build history — fire N sequential intel updates to populate the log quickly
  const buildHistory = useCallback(async () => {
    if (isBuilding) return;
    setIsBuilding(true);
    setBuildStep(0);
    try {
      for (let i = 0; i < buildSteps; i++) {
        await onRefresh();
        setBuildStep(i + 1);
      }
    } finally {
      setIsBuilding(false);
      setBuildStep(0);
    }
  }, [isBuilding, onRefresh]);

  const latest = entries[0] ?? null;

  // Send to Telegram
  const sendToTelegram = useCallback(async () => {
    if (!latest || telegramSending) return;
    setTelegramSending(true);
    setTelegramStatus('idle');
    setTelegramError('');
    try {
      const lines: string[] = [
        `🏠 <b>Security Intel — ${latest.period_label}</b>`,
        `${latest.total_events} events · ${latest.face_count} people detected`,
        '',
        latest.summary,
      ];
      if (latest.activity_lines.length > 0) {
        lines.push('', '<b>Activity:</b>');
        latest.activity_lines.slice(0, 6).forEach((l) => lines.push(`• ${l}`));
      }
      if (latest.anomalies.length > 0) {
        lines.push('', '<b>⚠ Anomalies:</b>');
        latest.anomalies.forEach((a) => lines.push(`• ${a}`));
      }
      if (latest.patterns.length > 0) {
        lines.push('', '<b>Patterns:</b>');
        latest.patterns.slice(0, 3).forEach((p) => lines.push(`• ${p}`));
      }
      const res = await fetch('/api/telegram-notify', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ text: lines.join('\n') }),
      });
      if (res.ok) {
        setTelegramStatus('sent');
      } else {
        const body = await res.json().catch(() => ({})) as { error?: string };
        setTelegramError(body.error ?? `HTTP ${res.status}`);
        setTelegramStatus('error');
      }
    } catch (e) {
      setTelegramError(e instanceof Error ? e.message : 'Network error');
      setTelegramStatus('error');
    } finally {
      setTelegramSending(false);
      setTimeout(() => { setTelegramStatus('idle'); setTelegramError(''); }, 6000);
    }
  }, [latest, telegramSending]);

  // Deduplicated patterns grouped by type
  const allPatterns = Array.from(new Set(entries.flatMap((e) => e.patterns ?? []))).filter(Boolean);
  const patternGroups = (['confirmed', 'new', 'insight', 'prediction', 'other'] as const).map((type) => ({
    type,
    items: allPatterns.filter((p) => patternPrefix(p) === type),
  })).filter((g) => g.items.length > 0);

  const cameraStateEntries = latest ? Object.entries(latest.camera_states as Record<string, string>) : [];

  const totalEvents  = latest?.total_events ?? 0;
  const totalFaces   = latest?.face_count   ?? 0;
  const totalEntries = entries.length;

  const isBusy = loading || intelUpdating || isBuilding;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex justify-end pointer-events-none">
      {/* Backdrop */}
      <div className="absolute inset-0 pointer-events-auto" onClick={onClose} aria-hidden />

      {/* Panel */}
      <div
        className="relative w-[420px] h-full bg-[#090f18] border-l border-white/[0.07]
                   flex flex-col shadow-2xl shadow-black/60 pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >

        {/* ── Header ── */}
        <div className="flex-none px-4 pt-4 pb-3 border-b border-white/[0.06]
                        bg-gradient-to-b from-violet-950/20 to-transparent">

          {/* Title row */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-violet-600/15 border border-violet-500/25
                              flex items-center justify-center text-violet-400">
                <IconBrain />
              </div>
              <div>
                <h2 className="text-[13px] font-semibold text-white/90 tracking-tight leading-none">
                  Intelligence Log
                </h2>
                <p className="text-[10px] text-white/30 mt-0.5">
                  {isBuilding
                    ? `Building history… ${buildStep}/${buildSteps}`
                    : intelUpdating
                      ? 'Analysing…'
                      : loading
                        ? 'Generating…'
                        : latest
                          ? `Updated ${fmtAgo(latest.timestamp)}`
                          : 'No entries yet'}
                </p>
              </div>
              {isBusy && (
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
              )}
            </div>
            <button onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-lg
                         text-white/30 hover:text-white/70 hover:bg-white/[0.06] transition-colors">
              <IconClose />
            </button>
          </div>

          {/* Error banner */}
          {refreshError && (
            <div className="mb-3 flex items-start gap-2 bg-red-500/[0.08] border border-red-500/25
                            rounded-xl px-3 py-2.5">
              <span className="text-red-400 flex-none mt-0.5"><IconWarning /></span>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-semibold text-red-400 mb-0.5">Intel generation failed</p>
                <p className="text-[10px] text-red-300/70 break-words leading-snug">{refreshError}</p>
              </div>
            </div>
          )}

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            {[
              { label: 'Events',  value: totalEvents,  color: 'text-blue-400'   },
              { label: 'People',  value: totalFaces,   color: 'text-amber-400'  },
              { label: 'Entries', value: totalEntries, color: 'text-violet-400' },
            ].map(({ label, value, color }) => (
              <div key={label}
                className="bg-white/[0.03] border border-white/[0.06] rounded-xl px-3 py-2 text-center">
                <div className={`text-[18px] font-bold tabular-nums leading-none ${color}`}>{value}</div>
                <div className="text-[9px] text-white/25 font-medium uppercase tracking-wider mt-0.5">{label}</div>
              </div>
            ))}
          </div>

          {/* Anomaly banner */}
          {latest?.anomalies?.length > 0 && (
            <div className="flex items-center gap-2 bg-amber-500/[0.08] border border-amber-500/20
                            rounded-xl px-3 py-2 mb-3">
              <span className="text-amber-400 flex-none"><IconWarning /></span>
              <p className="text-[10px] text-amber-300/80 leading-snug flex-1">
                {latest.anomalies[0]}
                {latest.anomalies.length > 1 && (
                  <span className="text-amber-400/60"> +{latest.anomalies.length - 1} more</span>
                )}
              </p>
            </div>
          )}

          {/* Build history prompt — shown when we have few entries */}
          {entries.length > 0 && entries.length < 4 && !isBusy && (
            <div className="flex items-center gap-2 bg-violet-500/[0.07] border border-violet-500/20
                            rounded-xl px-3 py-2 mb-3">
              <span className="text-violet-400 flex-none"><IconSparkle /></span>
              <p className="text-[10px] text-violet-300/70 flex-1 leading-snug">
                Build up history for richer patterns & insights.
              </p>
              <button
                onClick={() => void buildHistory()}
                className="flex-none text-[10px] font-semibold text-violet-400
                           bg-violet-600/15 border border-violet-500/30 rounded-lg
                           px-2.5 py-1 hover:bg-violet-600/25 transition-colors whitespace-nowrap">
                Build ({buildSteps})
              </button>
            </div>
          )}

          {/* Tab bar */}
          <div className="flex gap-0.5 bg-white/[0.04] border border-white/[0.06] rounded-xl p-0.5">
            {(['now', 'patterns', 'history'] as Tab[]).map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`flex-1 py-1.5 rounded-lg text-[10px] font-semibold transition-all ${
                  tab === t
                    ? 'bg-violet-600/70 text-white shadow-sm'
                    : 'text-white/30 hover:text-white/60'
                }`}>
                {t === 'now' ? 'Now' : t === 'patterns' ? 'Patterns' : `History${entries.length > 0 ? ` (${entries.length})` : ''}`}
              </button>
            ))}
          </div>
        </div>

        {/* ── Body ── */}
        <div ref={nowRef} className="flex-1 overflow-y-auto scrollbar-none">

          {/* ── Tab: Now ── */}
          {tab === 'now' && (
            <div className="px-4 py-4 space-y-4">
              {entries.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <div className={`w-14 h-14 rounded-2xl bg-violet-600/10 border border-violet-500/20
                                  flex items-center justify-center text-violet-400/50
                                  ${isBusy ? 'animate-pulse' : ''}`}>
                    <IconBrain />
                  </div>
                  <div className="text-center space-y-1">
                    {isBusy ? (
                      <>
                        <p className="text-[12px] text-white/50 font-medium">Generating intelligence…</p>
                        <p className="text-[10px] text-white/20">Analysing camera feeds with Claude AI</p>
                      </>
                    ) : (
                      <>
                        <p className="text-[12px] text-white/30 font-medium">No intelligence yet</p>
                        <p className="text-[10px] text-white/15">
                          {refreshError
                            ? 'Fix the error above, then click Refresh.'
                            : 'Generating first entry automatically…'}
                        </p>
                      </>
                    )}
                  </div>
                  {!isBusy && !refreshError && (
                    <button
                      onClick={() => void onRefresh()}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-medium
                                 bg-violet-600/20 border border-violet-500/35 text-violet-400
                                 hover:bg-violet-600/30 transition-all">
                      <IconRefresh />
                      Generate Now
                    </button>
                  )}
                  {!isBusy && refreshError && (
                    <button
                      onClick={() => void onRefresh()}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-medium
                                 bg-white/[0.05] border border-white/[0.1] text-white/40
                                 hover:bg-white/[0.08] transition-all">
                      <IconRefresh />
                      Retry
                    </button>
                  )}
                </div>
              ) : (
                <>
                  {/* Summary card */}
                  <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl px-4 py-3">
                    <div className="flex items-center gap-1.5 mb-2 text-white/25">
                      <IconActivity />
                      <span className="text-[9px] font-semibold uppercase tracking-wider">Summary</span>
                      <span className="text-[9px] font-mono ml-auto">{latest?.period_label}</span>
                    </div>
                    <p className="text-[12px] text-white/70 leading-relaxed">{latest?.summary}</p>
                    {latest?.change_from_previous && (
                      <p className="text-[10px] text-white/25 italic border-l-2 border-white/10 pl-2 mt-2">
                        {latest.change_from_previous}
                      </p>
                    )}
                  </div>

                  {/* Activity bullets */}
                  {latest && latest.activity_lines.length > 0 && (
                    <div>
                      <div className="flex items-center gap-1.5 mb-2 text-white/20">
                        <IconActivity />
                        <span className="text-[9px] font-semibold uppercase tracking-wider">Recent Activity</span>
                      </div>
                      <ul className="space-y-1.5">
                        {latest.activity_lines.map((line, i) => (
                          <li key={i}
                            className="flex gap-2.5 items-start bg-white/[0.02] border border-white/[0.05]
                                       rounded-lg px-3 py-2">
                            <span className="text-violet-500/60 flex-none mt-0.5">›</span>
                            <span className="text-[11px] text-white/55 leading-snug">{line}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Camera states */}
                  {cameraStateEntries.length > 0 && (
                    <div>
                      <div className="flex items-center gap-1.5 mb-2 text-white/20">
                        <IconCamera />
                        <span className="text-[9px] font-semibold uppercase tracking-wider">Camera States</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {cameraStateEntries.map(([cam, state]) => (
                          <div key={cam}
                            className="flex items-center gap-1.5 bg-white/[0.03] border border-white/[0.06]
                                       rounded-lg px-2.5 py-1.5">
                            <span className="text-blue-400/60 flex-none"><IconCamera /></span>
                            <span className="text-[10px] font-medium text-white/50">{cam}</span>
                            <span className="text-[9px] text-white/25">{state}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* All anomalies */}
                  {latest && latest.anomalies.length > 0 && (
                    <div className="bg-amber-500/[0.06] border border-amber-500/20 rounded-xl px-4 py-3">
                      <div className="flex items-center gap-1.5 mb-2 text-amber-400/70">
                        <IconWarning />
                        <span className="text-[9px] font-semibold uppercase tracking-wider">Anomalies Detected</span>
                      </div>
                      <ul className="space-y-1.5">
                        {latest.anomalies.map((a, i) => (
                          <li key={i} className="flex gap-2 items-start">
                            <span className="text-amber-400/60 flex-none mt-0.5">⚠</span>
                            <span className="text-[11px] text-amber-200/60 leading-snug">{a}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* ── Tab: Patterns ── */}
          {tab === 'patterns' && (
            <div className="px-4 py-4 space-y-4">
              {patternGroups.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <p className="text-[12px] text-white/25 font-medium text-center">No patterns yet</p>
                  <p className="text-[10px] text-white/15 text-center max-w-[260px]">
                    Patterns emerge after several intel cycles. Use &ldquo;Build History&rdquo; to accelerate this.
                  </p>
                  {!isBusy && entries.length > 0 && (
                    <button
                      onClick={() => void buildHistory()}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-medium
                                 bg-violet-600/15 border border-violet-500/30 text-violet-400
                                 hover:bg-violet-600/25 transition-all">
                      <IconSparkle />
                      Build History ({buildSteps} entries)
                    </button>
                  )}
                </div>
              ) : patternGroups.map(({ type, items }) => {
                const style = PREFIX_STYLES[type];
                return (
                  <div key={type}>
                    {style.label && (
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`inline-flex items-center gap-1 text-[9px] font-semibold uppercase
                                         tracking-wider rounded-full px-2 py-0.5 border ${style.chip}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                          {style.label}
                        </span>
                        <div className="h-px flex-1 bg-white/[0.05]" />
                      </div>
                    )}
                    <ul className="space-y-1.5">
                      {items.map((p, i) => (
                        <li key={i}
                          className="flex gap-2.5 items-start bg-white/[0.02] border border-white/[0.05]
                                     rounded-lg px-3 py-2">
                          <span className={`w-1.5 h-1.5 rounded-full flex-none mt-1.5 ${style.dot}`} />
                          <span className="text-[11px] text-white/55 leading-snug">{stripPrefix(p)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── Tab: History ── */}
          {tab === 'history' && (
            <div className="px-4 py-4 space-y-2">
              {entries.length === 0 ? (
                <p className="text-[12px] text-white/25 text-center py-16">No history yet.</p>
              ) : (
                <>
                  {/* Build history CTA when we have just a few entries */}
                  {entries.length < 4 && !isBusy && (
                    <button
                      onClick={() => void buildHistory()}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 mb-2
                                 rounded-xl text-[11px] font-medium bg-violet-600/10 border border-violet-500/25
                                 text-violet-400 hover:bg-violet-600/20 transition-all">
                      <IconSparkle />
                      Build {buildSteps} more entries to see patterns
                    </button>
                  )}
                  {isBusy && isBuilding && (
                    <div className="w-full flex items-center justify-center gap-2 px-4 py-3 mb-2
                                    rounded-xl bg-violet-600/[0.08] border border-violet-500/20">
                      <span className="text-violet-400 animate-pulse"><IconBrain /></span>
                      <span className="text-[11px] text-violet-400/70">
                        Building entry {buildStep + 1} of {buildSteps}…
                      </span>
                    </div>
                  )}
                  {entries.map((entry) => (
                    <HistoryEntry key={entry.id} entry={entry} />
                  ))}
                </>
              )}
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="flex-none px-4 py-3 border-t border-white/[0.06] space-y-2">
          {/* Telegram error */}
          {telegramStatus === 'error' && telegramError && (
            <p className="text-[10px] text-red-400/80 bg-red-500/[0.08] border border-red-500/20
                          rounded-lg px-3 py-2 leading-snug">
              {telegramError}
            </p>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={() => void onRefresh()}
              disabled={isBusy}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-medium
                         bg-white/[0.04] border border-white/[0.07] text-white/40
                         hover:bg-white/[0.07] hover:text-white/70 transition-all
                         disabled:opacity-40 flex-1 justify-center"
            >
              <IconRefresh spin={isBusy && !isBuilding} />
              {loading || (intelUpdating && !isBuilding) ? 'Analysing…' : 'Refresh'}
            </button>

            {entries.length > 0 && (
              <button
                onClick={() => void buildHistory()}
                disabled={isBusy}
                title={`Generate ${buildSteps} intel entries in sequence to populate history`}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-medium
                            border transition-all disabled:opacity-40 flex-1 justify-center ${
                  isBuilding
                    ? 'bg-violet-600/20 border-violet-500/40 text-violet-400'
                    : 'bg-white/[0.04] border-white/[0.07] text-white/40 hover:bg-white/[0.07] hover:text-white/70'
                }`}
              >
                <IconSparkle />
                {isBuilding ? `${buildStep}/${buildSteps}…` : `Build ×${buildSteps}`}
              </button>
            )}

            <button
              onClick={() => void sendToTelegram()}
              disabled={telegramSending || !latest}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-medium
                          border transition-all disabled:opacity-40 flex-1 justify-center ${
                telegramStatus === 'sent'
                  ? 'bg-emerald-600/20 border-emerald-500/40 text-emerald-400'
                  : telegramStatus === 'error'
                    ? 'bg-red-600/10 border-red-500/25 text-red-400'
                    : 'bg-blue-600/10 border-blue-500/25 text-blue-400 hover:bg-blue-600/20 hover:border-blue-500/40'
              }`}
            >
              <IconSend />
              {telegramSending ? '…' : telegramStatus === 'sent' ? 'Sent!' : telegramStatus === 'error' ? 'Failed' : 'Telegram'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
