'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ActivityEvent } from '@/lib/supabase';

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
function fmtTimeFull(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}
function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
}
function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}
function hourLabel(iso: string) {
  const d = new Date(iso);
  const h = d.getHours();
  const ampm = h < 12 ? 'AM' : 'PM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:00 ${ampm}`;
}

interface Group { label: string; date: string; events: ActivityEvent[] }

function groupByHour(events: ActivityEvent[]): Group[] {
  const groups = new Map<string, Group>();
  for (const e of events) {
    const d = new Date(e.timestamp);
    const key = `${d.toDateString()}-${d.getHours()}`;
    if (!groups.has(key)) {
      groups.set(key, { label: hourLabel(e.timestamp), date: fmtDate(e.timestamp), events: [] });
    }
    groups.get(key)!.events.push(e);
  }
  return Array.from(groups.values());
}

// ─────────────────────────────────────────────────────────────
// Icons
// ─────────────────────────────────────────────────────────────

const Icon = {
  Camera: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14" /><rect x="2" y="7" width="13" height="10" rx="2" />
    </svg>
  ),
  User: ({ size = 12 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  ),
  Motion: () => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  Clock: () => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  Refresh: ({ spin }: { spin?: boolean }) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      style={spin ? { animation: 'spin 0.8s linear infinite' } : undefined}>
      <polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
    </svg>
  ),
  ArrowLeft: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  ),
  Close: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Filter: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  ),
  ZoomIn: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" />
    </svg>
  ),
  Activity: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  Sparkle: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l1.88 5.47a1 1 0 00.65.65L21 11l-5.47 1.88a1 1 0 00-.65.65L13 19l-1.88-5.47a1 1 0 00-.65-.65L5 11l5.47-1.88a1 1 0 00.65-.65L12 3z" />
    </svg>
  ),
  Check: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Timeline: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="2" x2="12" y2="6" /><line x1="12" y1="18" x2="12" y2="22" />
      <circle cx="12" cy="12" r="4" />
      <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" /><line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
    </svg>
  ),
  Shield: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  Grid: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
    </svg>
  ),
};

// ─────────────────────────────────────────────────────────────
// Lightbox
// ─────────────────────────────────────────────────────────────

function Lightbox({ event, onClose }: { event: ActivityEvent; onClose: () => void }) {
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
      onClick={onClose}>
      <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
        {event.image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={event.image_url} alt={event.camera_name}
            className="w-full rounded-2xl shadow-2xl shadow-black/80 border border-white/10" />
        )}
        <div className="mt-4 bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5 backdrop-blur-md">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="flex items-center gap-1.5 bg-blue-500/15 border border-blue-500/25 text-blue-400 rounded-full px-2.5 py-1 text-[11px] font-medium">
                <Icon.Camera /> {event.camera_name}
              </span>
              {event.has_faces && (
                <span className="flex items-center gap-1 bg-amber-500/15 border border-amber-500/25 text-amber-400 rounded-full px-2.5 py-1 text-[11px] font-medium">
                  <Icon.User /> {event.face_count} face{event.face_count !== 1 ? 's' : ''}
                </span>
              )}
              {event.motion_score > 0 && (
                <span className="flex items-center gap-1 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400/80 rounded-full px-2 py-1 text-[10px]">
                  <Icon.Motion /> {event.motion_score.toFixed(1)}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-white/30 text-[11px]">
              <Icon.Clock /> {fmtTimeFull(event.timestamp)}
            </div>
          </div>
          <p className="text-white/75 text-[13px] leading-relaxed">{event.description}</p>
        </div>
        <button onClick={onClose}
          className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center
                     bg-black/70 hover:bg-black/90 text-white/60 hover:text-white
                     rounded-full border border-white/10 transition-all backdrop-blur-sm">
          <Icon.Close />
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Event card
// ─────────────────────────────────────────────────────────────

function EventCard({ event, onZoom }: { event: ActivityEvent; onZoom: (e: ActivityEvent) => void }) {
  const [imgErr, setImgErr] = useState(false);
  const hasImg = !!event.image_url && !imgErr;

  return (
    <div className="group bg-white/[0.025] border border-white/[0.07] hover:border-white/[0.15]
                    hover:bg-white/[0.045] rounded-2xl overflow-hidden transition-all duration-200
                    shadow-lg shadow-black/30 hover:shadow-black/50 hover:-translate-y-px">
      <div className="relative w-full aspect-video bg-[#0d1520] overflow-hidden">
        {hasImg ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={event.image_url!} alt={event.camera_name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              onError={() => setImgErr(true)} />
            <button onClick={() => onZoom(event)}
              className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center
                         bg-black/60 hover:bg-black/80 text-white/60 hover:text-white
                         rounded-lg border border-white/10 opacity-0 group-hover:opacity-100
                         transition-all backdrop-blur-sm">
              <Icon.ZoomIn />
            </button>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/[0.08]">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14" /><rect x="2" y="7" width="13" height="10" rx="2" />
            </svg>
          </div>
        )}
        {hasImg && (
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/70 to-transparent" />
        )}
        <div className="absolute bottom-2 left-2 flex items-center gap-1
                        bg-black/60 backdrop-blur-sm rounded-md px-1.5 py-0.5 text-[10px] text-white/50 font-mono">
          <Icon.Clock /> {fmtTime(event.timestamp)}
        </div>
        {event.motion_score > 0 && (
          <div className="absolute bottom-2 right-2 flex items-center gap-1
                          bg-yellow-500/20 border border-yellow-500/25 backdrop-blur-sm
                          rounded-md px-1.5 py-0.5 text-[9px] text-yellow-400 font-mono">
            <Icon.Motion /> {event.motion_score.toFixed(0)}
          </div>
        )}
      </div>

      <div className="px-3.5 py-3">
        <div className="flex items-center gap-1.5 mb-2 flex-wrap">
          <span className="flex items-center gap-1 bg-blue-500/10 border border-blue-500/20
                           text-blue-400/80 rounded-full px-2 py-0.5 text-[9px] font-medium">
            <Icon.Camera /> {event.camera_name}
          </span>
          {event.has_faces && (
            <span className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20
                             text-amber-400 rounded-full px-2 py-0.5 text-[9px] font-medium">
              <Icon.User size={9} />
              {event.face_count === 1 ? '1 face' : `${event.face_count} faces`}
            </span>
          )}
          <span className="text-[9px] text-white/20 ml-auto tabular-nums">{timeAgo(event.timestamp)}</span>
        </div>
        <p className="text-[12px] text-white/55 leading-relaxed line-clamp-3">
          {event.description}
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Stats bar
// ─────────────────────────────────────────────────────────────

function StatsBar({ events, hours }: { events: ActivityEvent[]; hours: number }) {
  const faceEvents = events.filter((e) => e.has_faces).length;
  const cameras = new Set(events.map((e) => e.camera_name)).size;
  const totalFaces = events.reduce((sum, e) => sum + (e.face_count ?? 0), 0);

  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      {[
        { label: 'Events', value: events.length, sub: `last ${hours}h`, color: 'blue' as const },
        { label: 'Cameras', value: cameras, sub: 'active', color: 'purple' as const },
        { label: 'People', value: totalFaces, sub: `${faceEvents} events`, color: 'amber' as const },
      ].map(({ label, value, sub, color }) => (
        <div key={label}
          className={`relative overflow-hidden bg-white/[0.025] border rounded-2xl px-5 py-4 transition-all hover:bg-white/[0.04] ${
            color === 'blue' ? 'border-blue-500/[0.12] hover:border-blue-500/25' :
            color === 'purple' ? 'border-purple-500/[0.12] hover:border-purple-500/25' :
            'border-amber-500/[0.12] hover:border-amber-500/25'
          }`}>
          <div className={`absolute inset-0 opacity-[0.04] ${
            color === 'blue' ? 'bg-blue-500' :
            color === 'purple' ? 'bg-purple-500' : 'bg-amber-500'
          }`} />
          <p className={`text-2xl font-bold tabular-nums ${
            color === 'blue' ? 'text-blue-400' :
            color === 'purple' ? 'text-purple-400' : 'text-amber-400'
          }`}>
            {value}
          </p>
          <p className="text-[11px] font-semibold text-white/50 mt-0.5">{label}</p>
          <p className="text-[10px] text-white/20 mt-0.5">{sub}</p>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// AI Summary
// ─────────────────────────────────────────────────────────────

interface AISummaryData {
  cameraStatus: Array<{ camera: string; status: string }>;
  overview: string;
  highlights: string[];
  timeline: Array<{ period: string; summary: string }>;
  assessment: string;
  period: string;
  capturedAt: string;
  stats: { totalEvents: number; faceEvents: number; totalPeople: number; cameras: number };
}

function fmtCapturedAt(iso: string) {
  try {
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  } catch {
    return '';
  }
}

function AISummaryView({ events, hours }: { events: ActivityEvent[]; hours: number }) {
  const [data, setData] = useState<AISummaryData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generated, setGenerated] = useState(false);

  async function generate() {
    setLoading(true);
    setError(null);
    try {
      const payload = events.map((e) => ({
        camera_name: e.camera_name,
        timestamp: e.timestamp,
        description: e.description,
        motion_score: e.motion_score,
        has_faces: e.has_faces,
        face_count: e.face_count,
      }));
      const res = await fetch('/api/ai-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events: payload, hours }),
      });
      if (!res.ok) throw new Error('Failed to generate summary');
      const result = (await res.json()) as AISummaryData;
      setData(result);
      setGenerated(true);
    } catch {
      setError('Could not generate summary. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  // Auto-generate when tab first opens
  useEffect(() => {
    if (!generated) void generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-5">
        <div className="w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-violet-400/40 border-t-violet-400 rounded-full" style={{ animation: 'spin 0.8s linear infinite' }} />
        </div>
        <div className="text-center">
          <p className="text-white/60 text-[14px] font-medium">Checking cameras &amp; analysing activity…</p>
          <p className="text-white/25 text-[12px] mt-1">Fetching live snapshots + {events.length} recorded events</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400/60 text-xl font-bold">!</div>
        <div className="text-center">
          <p className="text-white/40 text-[14px]">{error}</p>
          <button onClick={() => void generate()}
            className="mt-4 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-white/80 hover:bg-white/8 text-[12px] transition-all">
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-5 max-w-3xl">

      {/* ── Right Now: live camera status ── */}
      {data.cameraStatus.length > 0 && (
        <div className="rounded-2xl bg-white/[0.025] border border-white/[0.08] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06] bg-white/[0.02]">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[11px] font-semibold text-white/70 uppercase tracking-wider">Right Now</span>
              </div>
              <span className="text-[10px] text-white/20 bg-white/[0.05] border border-white/[0.07] rounded-full px-2 py-0.5">
                {data.cameraStatus.length} camera{data.cameraStatus.length !== 1 ? 's' : ''}
              </span>
            </div>
            {data.capturedAt && (
              <span className="text-[9px] text-white/20 font-mono">
                Snapshot at {fmtCapturedAt(data.capturedAt)}
              </span>
            )}
          </div>
          <div className="divide-y divide-white/[0.04]">
            {data.cameraStatus.map((cs) => (
              <div key={cs.camera} className="flex items-start gap-3.5 px-5 py-3.5 hover:bg-white/[0.02] transition-colors">
                <div className="flex-none w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mt-0.5">
                  <Icon.Camera />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-semibold text-blue-400/70 uppercase tracking-wider mb-0.5">{cs.camera}</p>
                  <p className="text-[13px] text-white/70 leading-snug">{cs.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Overview ── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-500/10 to-blue-500/5 border border-violet-500/20 p-6">
        <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/5 rounded-full blur-2xl -translate-y-8 translate-x-8" />
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
            <Icon.Sparkle />
          </div>
          <div>
            <p className="text-[12px] font-semibold text-violet-400/80 uppercase tracking-wider">AI Overview</p>
            <p className="text-[10px] text-white/25">{data.period}</p>
          </div>
          <button onClick={() => void generate()}
            className="ml-auto flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-medium
                       text-white/30 hover:text-white/60 bg-white/5 border border-white/[0.06] hover:bg-white/8 transition-all">
            <Icon.Refresh /> Refresh
          </button>
        </div>
        <p className="text-white/80 text-[14px] leading-relaxed">{data.overview}</p>
      </div>

      {/* ── Key Events ── */}
      {data.highlights.length > 0 && (
        <div className="rounded-2xl bg-white/[0.025] border border-white/[0.07] p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-lg bg-green-500/15 border border-green-500/25 flex items-center justify-center text-green-400">
              <Icon.Check />
            </div>
            <p className="text-[12px] font-semibold text-white/60 uppercase tracking-wider">Key Events</p>
          </div>
          <ul className="space-y-2.5">
            {data.highlights.map((h, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="flex-none w-5 h-5 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400/70 text-[9px] font-bold mt-0.5">
                  {i + 1}
                </span>
                <span className="text-[13px] text-white/70 leading-relaxed">{h}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── Timeline ── */}
      {data.timeline.length > 0 && (
        <div className="rounded-2xl bg-white/[0.025] border border-white/[0.07] p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-lg bg-blue-500/15 border border-blue-500/25 flex items-center justify-center text-blue-400">
              <Icon.Timeline />
            </div>
            <p className="text-[12px] font-semibold text-white/60 uppercase tracking-wider">Timeline</p>
          </div>
          <div>
            {data.timeline.map((t, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center flex-none">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500/40 border border-blue-500/60 flex-none mt-0.5" />
                  {i < data.timeline.length - 1 && (
                    <div className="w-px flex-1 bg-white/[0.06] my-1" />
                  )}
                </div>
                <div className="pb-4">
                  <p className="text-[10px] font-semibold text-blue-400/70 uppercase tracking-wider mb-1">{t.period}</p>
                  <p className="text-[13px] text-white/65 leading-relaxed">{t.summary}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Assessment ── */}
      {data.assessment && (
        <div className="flex items-start gap-3 rounded-2xl bg-white/[0.02] border border-white/[0.06] px-5 py-4">
          <div className="w-6 h-6 rounded-lg bg-teal-500/15 border border-teal-500/25 flex items-center justify-center text-teal-400 flex-none mt-0.5">
            <Icon.Shield />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-teal-400/70 uppercase tracking-wider mb-1">Security Assessment</p>
            <p className="text-[13px] text-white/65 leading-relaxed">{data.assessment}</p>
          </div>
        </div>
      )}

      {/* ── Mini stats ── */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: 'Events analysed', value: data.stats.totalEvents, color: 'text-white/50' },
          { label: 'With people', value: data.stats.faceEvents, color: 'text-amber-400/70' },
          { label: 'People seen', value: data.stats.totalPeople, color: 'text-amber-400/70' },
          { label: 'Cameras seen', value: data.cameraStatus.length || data.stats.cameras, color: 'text-blue-400/70' },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-xl bg-white/[0.02] border border-white/[0.06] px-3 py-3 text-center">
            <p className={`text-lg font-bold tabular-nums ${color}`}>{value}</p>
            <p className="text-[9px] text-white/25 mt-0.5 leading-tight">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────────────────────

type TimeRange = 1 | 6 | 12;
type Tab = 'events' | 'summary';

export default function ActivitySummaryClient() {
  const router = useRouter();
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [hours, setHours] = useState<TimeRange>(12);
  const [facesOnly, setFacesOnly] = useState(false);
  const [cameraFilter, setCameraFilter] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<ActivityEvent | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [tab, setTab] = useState<Tab>('events');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [summaryKey, setSummaryKey] = useState(0); // force re-mount summary on data change

  const load = useCallback(async (h: TimeRange, faces: boolean) => {
    setLoading(true);
    try {
      const p = new URLSearchParams({ hours: String(h), limit: '300' });
      if (faces) p.set('faces', '1');
      const res = await fetch(`/api/activity-log?${p.toString()}`);
      if (res.status === 401) { router.push('/login'); return; }
      const { events: data } = (await res.json()) as { events: ActivityEvent[] };
      setEvents(data ?? []);
      setLastRefresh(new Date());
      setSummaryKey((k) => k + 1); // re-generate summary when data refreshes
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void load(hours, facesOnly);
    intervalRef.current = setInterval(() => void load(hours, facesOnly), 60_000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [hours, facesOnly, load]);

  const allCameras = Array.from(new Set(events.map((e) => e.camera_name))).sort();
  const filtered = cameraFilter ? events.filter((e) => e.camera_name === cameraFilter) : events;
  const groups = groupByHour(filtered);

  const TIME_RANGES: TimeRange[] = [1, 6, 12];

  return (
    <div className="min-h-screen bg-[#080c12] text-white">

      {/* ── Sticky header ── */}
      <header className="sticky top-0 z-30 bg-[#080c12]/95 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3 flex-wrap">

          {/* Back */}
          <button onClick={() => router.push('/')}
            className="flex items-center gap-1.5 text-white/35 hover:text-white/75
                       transition-colors text-[12px] font-medium group flex-none">
            <span className="group-hover:-translate-x-0.5 transition-transform"><Icon.ArrowLeft /></span>
            Live view
          </button>

          <div className="w-px h-4 bg-white/[0.08]" />

          {/* Title */}
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-green-600/15 border border-green-500/25
                            flex items-center justify-center text-green-400 flex-none">
              <Icon.Activity />
            </div>
            <div>
              <h1 className="text-[13px] font-semibold text-white/90 leading-none">Activity Log</h1>
              {lastRefresh && (
                <p className="text-[9px] text-white/20 mt-0.5">
                  Updated {fmtTimeFull(lastRefresh.toISOString())}
                </p>
              )}
            </div>
          </div>

          {/* Time range */}
          <div className="flex items-center gap-0.5 bg-white/[0.05] rounded-xl p-0.5 flex-none">
            {TIME_RANGES.map((h) => (
              <button key={h} onClick={() => setHours(h)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                  hours === h ? 'bg-white/10 text-white shadow-sm' : 'text-white/35 hover:text-white/65'
                }`}>
                {h}h
              </button>
            ))}
          </div>

          {/* Faces toggle */}
          <button onClick={() => setFacesOnly((f) => !f)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-medium
                        border transition-all flex-none ${
              facesOnly
                ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                : 'bg-white/[0.04] border-white/[0.07] text-white/35 hover:text-white/65'
            }`}>
            <Icon.User /> Faces
          </button>

          {/* Refresh */}
          <button onClick={() => void load(hours, facesOnly)} disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-medium
                       bg-white/[0.04] border border-white/[0.07] text-white/40 hover:text-white/70
                       disabled:opacity-40 transition-all flex-none">
            <Icon.Refresh spin={loading} />
            {loading ? 'Loading…' : 'Refresh'}
          </button>
        </div>

        {/* ── Tab bar ── */}
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-1 border-t border-white/[0.04] pt-0">
          {([
            { key: 'events' as Tab, label: 'Events', icon: <Icon.Grid /> },
            { key: 'summary' as Tab, label: 'AI Summary', icon: <Icon.Sparkle /> },
          ] as const).map(({ key, label, icon }) => (
            <button key={key} onClick={() => setTab(key)}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 text-[12px] font-medium transition-all
                          border-b-2 -mb-px ${
                tab === key
                  ? key === 'summary'
                    ? 'text-violet-400 border-violet-500/70'
                    : 'text-white/90 border-white/30'
                  : 'text-white/30 border-transparent hover:text-white/60 hover:border-white/10'
              }`}>
              {icon} {label}
              {key === 'summary' && (
                <span className="ml-0.5 px-1.5 py-0.5 rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-400 text-[8px] font-semibold uppercase tracking-wider">
                  AI
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Camera filter pills — events tab only */}
        {tab === 'events' && allCameras.length > 1 && (
          <div className="max-w-7xl mx-auto px-4 pb-2.5 pt-1 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            <span className="flex-none text-[9px] text-white/20 uppercase tracking-wider mr-1 flex items-center gap-1">
              <Icon.Filter /> Cam
            </span>
            <button onClick={() => setCameraFilter(null)}
              className={`flex-none px-2.5 py-1 rounded-full text-[10px] font-medium transition-all ${
                cameraFilter === null
                  ? 'bg-white/10 text-white border border-white/20'
                  : 'text-white/30 hover:text-white/60 border border-white/[0.06] hover:border-white/15'
              }`}>
              All
            </button>
            {allCameras.map((cam) => (
              <button key={cam} onClick={() => setCameraFilter(cam === cameraFilter ? null : cam)}
                className={`flex-none px-2.5 py-1 rounded-full text-[10px] font-medium transition-all ${
                  cameraFilter === cam
                    ? 'bg-blue-600/80 text-white border border-blue-500/50'
                    : 'text-white/30 hover:text-white/60 border border-white/[0.06] hover:border-white/15'
                }`}>
                {cam}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* ── Body ── */}
      <main className="max-w-7xl mx-auto px-4 py-6">

        {/* Stats */}
        <StatsBar events={filtered} hours={hours} />

        {/* ── Events Tab ── */}
        {tab === 'events' && (
          <>
            {!loading && filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-32 gap-4">
                <div className="w-20 h-20 rounded-full bg-white/[0.025] border border-white/[0.07]
                                flex items-center justify-center text-white/10">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-white/30 text-[14px] font-medium">No activity detected</p>
                  <p className="text-white/15 text-[12px] mt-1">
                    Motion events will appear here when cameras detect activity
                  </p>
                </div>
              </div>
            )}

            {groups.map((group) => (
              <section key={group.label} className="mb-10">
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-px flex-1 bg-white/[0.05]" />
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-white/20 font-medium">{group.date}</span>
                    <span className="w-1 h-1 rounded-full bg-white/15" />
                    <span className="text-[11px] font-semibold text-white/40">{group.label}</span>
                    <span className="bg-white/[0.05] border border-white/[0.07] text-white/25
                                     rounded-full px-2 py-0.5 text-[9px] font-medium">
                      {group.events.length}
                    </span>
                  </div>
                  <div className="h-px flex-1 bg-white/[0.05]" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {group.events.map((event) => (
                    <EventCard key={event.id} event={event} onZoom={setLightbox} />
                  ))}
                </div>
              </section>
            ))}
          </>
        )}

        {/* ── AI Summary Tab ── */}
        {tab === 'summary' && (
          <AISummaryView key={summaryKey} events={filtered} hours={hours} />
        )}
      </main>

      {lightbox && <Lightbox event={lightbox} onClose={() => setLightbox(null)} />}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { scrollbar-width: none; }
      `}</style>
    </div>
  );
}
