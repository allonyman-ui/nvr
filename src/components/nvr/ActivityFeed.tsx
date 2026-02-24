'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { ActivityEvent } from '@/lib/supabase';

type Filter = 'all' | 'faces' | '1h' | '6h';

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function fmtHour(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
    .replace(/:\d\d\s/, ' ');
}

function groupByHour(events: ActivityEvent[]): Array<{ label: string; events: ActivityEvent[] }> {
  const groups: Map<string, ActivityEvent[]> = new Map();
  for (const e of events) {
    const d = new Date(e.timestamp);
    const key = `${d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })} · ${d.getHours()}:00`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(e);
  }
  return Array.from(groups.entries()).map(([label, events]) => ({ label, events }));
}

// ── Icons ──────────────────────────────────────────────────────────────

function IconClose() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
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
function IconUser() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  );
}
function IconMotion() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
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

// ── Event card ─────────────────────────────────────────────────────────

function EventCard({ event, onDelete }: { event: ActivityEvent; onDelete: (id: string) => void }) {
  const [imgError, setImgError] = useState(false);
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="group relative flex gap-3 rounded-xl bg-white/[0.03] border border-white/[0.06]
                    hover:bg-white/[0.05] hover:border-white/10 transition-all p-2.5 cursor-pointer"
      onClick={() => setExpanded((e) => !e)}>

      {/* Thumbnail */}
      <div className="flex-none w-[88px] h-[58px] rounded-lg overflow-hidden bg-white/5
                      border border-white/10 relative">
        {event.image_url && !imgError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={event.image_url}
            alt={event.camera_name}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/15">
            <IconCamera />
          </div>
        )}
        {/* Motion badge */}
        {event.motion_score > 0 && (
          <div className="absolute bottom-1 right-1 bg-black/60 rounded px-1 flex items-center gap-0.5">
            <span className="text-yellow-400"><IconMotion /></span>
            <span className="text-[8px] text-white/60 font-mono">{event.motion_score.toFixed(0)}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-blue-400/70"><IconCamera /></span>
            <span className="text-[11px] font-medium text-white/70 truncate">{event.camera_name}</span>
          </div>
          <span className="text-[10px] text-white/25 font-mono tabular-nums flex-none">
            {fmtTime(event.timestamp)}
          </span>
        </div>

        <p className={`text-[11px] text-white/55 leading-relaxed ${expanded ? '' : 'line-clamp-2'}`}>
          {event.description}
        </p>

        {/* Badges */}
        <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
          {event.has_faces && (
            <span className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20
                             text-amber-400 rounded-full px-1.5 py-0.5 text-[9px] font-medium">
              <IconUser />
              Face detected
            </span>
          )}
          <span className="text-[9px] text-white/20">{timeAgo(event.timestamp)}</span>
        </div>
      </div>

      {/* Delete */}
      <button
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 w-5 h-5 flex items-center
                   justify-center text-white/30 hover:text-red-400 transition-all rounded"
        onClick={(e) => { e.stopPropagation(); onDelete(event.id); }}
        title="Delete"
      >
        <IconClose />
      </button>

      {/* Expanded image */}
      {expanded && event.image_url && !imgError && (
        <div className="absolute left-0 top-full mt-1 z-50 w-full rounded-xl overflow-hidden
                        border border-white/10 shadow-2xl shadow-black/50" onClick={(e) => e.stopPropagation()}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={event.image_url} alt={event.camera_name} className="w-full" />
        </div>
      )}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────

interface Props {
  open: boolean;
  onClose: () => void;
  captureActive: boolean;
  captureEventCount: number;
  lastCapture: { camera: string; time: Date } | null;
}

export default function ActivityFeed({ open, onClose, captureActive, captureEventCount, lastCapture }: Props) {
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<Filter>('all');
  const [hoursMap] = useState<Record<Filter, number>>({ all: 12, faces: 12, '1h': 1, '6h': 6 });
  const refreshRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchEvents = useCallback(async (f: Filter) => {
    setLoading(true);
    try {
      const hours = hoursMap[f];
      const params = new URLSearchParams({ hours: String(hours), limit: '150' });
      if (f === 'faces') params.set('faces', '1');
      const res = await fetch(`/api/activity-log?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to load');
      const { events: data } = (await res.json()) as { events: ActivityEvent[] };
      setEvents(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [hoursMap]);

  useEffect(() => {
    if (!open) {
      if (refreshRef.current) clearInterval(refreshRef.current);
      return;
    }
    void fetchEvents(filter);
    refreshRef.current = setInterval(() => void fetchEvents(filter), 30_000);
    return () => { if (refreshRef.current) clearInterval(refreshRef.current); };
  }, [open, filter, fetchEvents]);

  // Refresh when capture detects new events
  useEffect(() => {
    if (open && captureEventCount > 0) void fetchEvents(filter);
  }, [captureEventCount, open, filter, fetchEvents]);

  function handleDelete(id: string) {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    void fetch(`/api/activity-log?id=${id}`, { method: 'DELETE' });
  }

  const groups = groupByHour(events);
  const FILTERS: { key: Filter; label: string }[] = [
    { key: 'all', label: '12h' },
    { key: '1h', label: '1h' },
    { key: '6h', label: '6h' },
    { key: 'faces', label: 'Faces only' },
  ];

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex justify-end pointer-events-none">
      <div className="absolute inset-0 pointer-events-auto" onClick={onClose} aria-hidden />
      <div
        className="relative w-[360px] h-full bg-[#0b1219] border-l border-white/[0.07]
                   flex flex-col shadow-2xl pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="flex-none px-4 py-3 border-b border-white/[0.06]">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[12px] font-semibold text-white/80 tracking-wide">
                Activity Feed
              </span>
              {loading && (
                <span className="text-white/30"><IconRefresh spin /></span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => void fetchEvents(filter)}
                className="text-white/30 hover:text-white/70 transition-colors" title="Refresh">
                <IconRefresh />
              </button>
              <button onClick={onClose}
                className="text-white/30 hover:text-white/70 transition-colors">
                <IconClose />
              </button>
            </div>
          </div>

          {/* Filter pills */}
          <div className="flex gap-1">
            {FILTERS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => { setFilter(key); void fetchEvents(key); }}
                className={`px-2.5 py-1 rounded-full text-[10px] font-medium transition-all ${
                  filter === key
                    ? 'bg-blue-600/80 text-white border border-blue-500/50'
                    : 'text-white/30 hover:text-white/60 bg-white/[0.04] border border-white/[0.06]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Capture status bar ── */}
        <div className="flex-none flex items-center justify-between px-4 py-1.5
                        border-b border-white/[0.04] bg-white/[0.02]">
          <div className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full flex-none ${captureActive ? 'bg-green-500 animate-pulse' : 'bg-white/20'}`} />
            <span className="text-[10px] text-white/30">
              {captureActive ? 'Capturing every 5s' : 'Capture paused'}
            </span>
          </div>
          <span className="text-[10px] text-white/20">
            {events.length} event{events.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* ── Event list ── */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4 scrollbar-none">
          {events.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center h-48 gap-3">
              <div className="w-12 h-12 rounded-full bg-white/[0.04] border border-white/10
                              flex items-center justify-center text-white/20">
                <IconMotion />
              </div>
              <div className="text-center">
                <p className="text-white/25 text-[12px] font-medium">No activity yet</p>
                <p className="text-white/15 text-[10px] mt-1">
                  Motion events will appear here in real-time
                </p>
              </div>
            </div>
          )}

          {groups.map(({ label, events: groupEvents }) => (
            <div key={label}>
              {/* Hour separator */}
              <div className="flex items-center gap-2 mb-2">
                <div className="h-px flex-1 bg-white/[0.05]" />
                <span className="text-[9px] text-white/20 font-medium tracking-wider uppercase">
                  {label}
                </span>
                <div className="h-px flex-1 bg-white/[0.05]" />
              </div>

              {/* Events in this hour */}
              <div className="space-y-2">
                {groupEvents.map((event) => (
                  <EventCard key={event.id} event={event} onDelete={handleDelete} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ── Footer ── */}
        {lastCapture && (
          <div className="flex-none px-4 py-2 border-t border-white/[0.05]">
            <p className="text-[9px] text-white/20 text-center">
              Last event: {lastCapture.camera} · {lastCapture.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
