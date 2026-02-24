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
// Icons (inline SVG — no extra deps)
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
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}>
      <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
        {/* Image */}
        {event.image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={event.image_url} alt={event.camera_name}
            className="w-full rounded-2xl shadow-2xl shadow-black/60" />
        )}
        {/* Info overlay */}
        <div className="mt-4 bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
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
          <p className="text-white/70 text-[13px] leading-relaxed">{event.description}</p>
        </div>
        {/* Close */}
        <button onClick={onClose}
          className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center
                     bg-black/60 hover:bg-black/80 text-white/70 hover:text-white
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
    <div className="group bg-white/[0.03] border border-white/[0.07] hover:border-white/[0.14]
                    hover:bg-white/[0.05] rounded-2xl overflow-hidden transition-all duration-200
                    shadow-lg shadow-black/20">
      {/* Image */}
      <div className="relative w-full aspect-video bg-white/[0.03] overflow-hidden">
        {hasImg ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={event.image_url!} alt={event.camera_name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              onError={() => setImgErr(true)} />
            {/* Zoom button */}
            <button onClick={() => onZoom(event)}
              className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center
                         bg-black/50 hover:bg-black/70 text-white/60 hover:text-white
                         rounded-lg border border-white/10 opacity-0 group-hover:opacity-100
                         transition-all backdrop-blur-sm">
              <Icon.ZoomIn />
            </button>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/10">
            <Icon.Camera />
          </div>
        )}
        {/* Gradient overlay */}
        {hasImg && (
          <div className="absolute inset-x-0 bottom-0 h-12
                          bg-gradient-to-t from-[#080c12]/80 to-transparent" />
        )}
        {/* Time badge */}
        <div className="absolute bottom-2 left-2 flex items-center gap-1
                        bg-black/60 backdrop-blur-sm rounded-md px-1.5 py-0.5
                        text-[10px] text-white/50 font-mono">
          <Icon.Clock /> {fmtTime(event.timestamp)}
        </div>
        {/* Motion badge */}
        {event.motion_score > 0 && (
          <div className="absolute bottom-2 right-2 flex items-center gap-1
                          bg-yellow-500/20 border border-yellow-500/30 backdrop-blur-sm
                          rounded-md px-1.5 py-0.5 text-[9px] text-yellow-400 font-mono">
            <Icon.Motion /> {event.motion_score.toFixed(0)}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="px-3.5 py-3">
        {/* Camera + face badges */}
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
          <span className="text-[9px] text-white/20 ml-auto">{timeAgo(event.timestamp)}</span>
        </div>

        {/* Description */}
        <p className="text-[12px] text-white/60 leading-relaxed line-clamp-3">
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
        { label: 'Events', value: events.length, sub: `last ${hours}h`, color: 'blue' },
        { label: 'Cameras', value: cameras, sub: `active`, color: 'purple' },
        { label: 'Faces', value: totalFaces, sub: `${faceEvents} events`, color: 'amber' },
      ].map(({ label, value, sub, color }) => (
        <div key={label}
          className="bg-white/[0.03] border border-white/[0.07] rounded-2xl px-5 py-4">
          <p className={`text-2xl font-bold tabular-nums ${
            color === 'blue' ? 'text-blue-400' :
            color === 'purple' ? 'text-purple-400' : 'text-amber-400'
          }`}>
            {value}
          </p>
          <p className="text-[11px] font-medium text-white/50 mt-0.5">{label}</p>
          <p className="text-[10px] text-white/20 mt-0.5">{sub}</p>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────────────────────

type TimeRange = 1 | 6 | 12;

export default function SummaryPage() {
  const router = useRouter();
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [hours, setHours] = useState<TimeRange>(12);
  const [facesOnly, setFacesOnly] = useState(false);
  const [cameraFilter, setCameraFilter] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<ActivityEvent | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void load(hours, facesOnly);
    intervalRef.current = setInterval(() => void load(hours, facesOnly), 60_000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [hours, facesOnly, load]);

  // Derive cameras list for filter pills
  const allCameras = Array.from(new Set(events.map((e) => e.camera_name))).sort();

  // Apply camera filter client-side
  const filtered = cameraFilter ? events.filter((e) => e.camera_name === cameraFilter) : events;
  const groups = groupByHour(filtered);

  const TIME_RANGES: TimeRange[] = [1, 6, 12];

  return (
    <div className="min-h-screen bg-[#080c12] text-white">

      {/* ── Sticky header ── */}
      <header className="sticky top-0 z-30 bg-[#080c12]/90 backdrop-blur-md
                         border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4 flex-wrap">

          {/* Back */}
          <button onClick={() => router.push('/')}
            className="flex items-center gap-1.5 text-white/40 hover:text-white/80
                       transition-colors text-[12px] font-medium group">
            <span className="group-hover:-translate-x-0.5 transition-transform">
              <Icon.ArrowLeft />
            </span>
            Live view
          </button>

          <div className="w-px h-4 bg-white/10" />

          {/* Title */}
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-green-600/20 border border-green-500/30
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
          <div className="flex items-center gap-0.5 bg-white/[0.05] rounded-xl p-0.5">
            {TIME_RANGES.map((h) => (
              <button key={h}
                onClick={() => setHours(h)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                  hours === h
                    ? 'bg-white/10 text-white shadow-sm'
                    : 'text-white/35 hover:text-white/65'
                }`}>
                {h}h
              </button>
            ))}
          </div>

          {/* Faces toggle */}
          <button
            onClick={() => setFacesOnly((f) => !f)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-medium
                        border transition-all ${
              facesOnly
                ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                : 'bg-white/[0.04] border-white/[0.07] text-white/35 hover:text-white/65'
            }`}>
            <Icon.User /> Faces only
          </button>

          {/* Refresh */}
          <button
            onClick={() => void load(hours, facesOnly)}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-medium
                       bg-white/[0.04] border border-white/[0.07] text-white/40 hover:text-white/70
                       disabled:opacity-40 transition-all">
            <Icon.Refresh spin={loading} />
            {loading ? 'Loading…' : 'Refresh'}
          </button>
        </div>

        {/* Camera filter pills */}
        {allCameras.length > 1 && (
          <div className="max-w-7xl mx-auto px-4 pb-2.5 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            <span className="flex-none text-[9px] text-white/25 uppercase tracking-wider mr-1 flex items-center gap-1">
              <Icon.Filter /> Cam
            </span>
            <button
              onClick={() => setCameraFilter(null)}
              className={`flex-none px-2.5 py-1 rounded-full text-[10px] font-medium transition-all ${
                cameraFilter === null
                  ? 'bg-white/10 text-white border border-white/20'
                  : 'text-white/30 hover:text-white/60 border border-white/[0.06] hover:border-white/15'
              }`}>
              All
            </button>
            {allCameras.map((cam) => (
              <button key={cam}
                onClick={() => setCameraFilter(cam === cameraFilter ? null : cam)}
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

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="w-20 h-20 rounded-full bg-white/[0.03] border border-white/[0.08]
                            flex items-center justify-center text-white/15">
              <Icon.Activity />
            </div>
            <div className="text-center">
              <p className="text-white/30 text-[14px] font-medium">No activity detected</p>
              <p className="text-white/15 text-[12px] mt-1">
                Motion events will appear here when cameras detect activity
              </p>
            </div>
          </div>
        )}

        {/* Groups */}
        {groups.map((group) => (
          <section key={group.label} className="mb-10">
            {/* Hour heading */}
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px flex-1 bg-white/[0.06]" />
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-white/20 font-medium">{group.date}</span>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span className="text-[11px] font-semibold text-white/40">{group.label}</span>
                <span className="bg-white/[0.06] border border-white/[0.08] text-white/30
                                 rounded-full px-2 py-0.5 text-[9px] font-medium">
                  {group.events.length} event{group.events.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="h-px flex-1 bg-white/[0.06]" />
            </div>

            {/* Card grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {group.events.map((event) => (
                <EventCard key={event.id} event={event} onZoom={setLightbox} />
              ))}
            </div>
          </section>
        ))}
      </main>

      {/* Lightbox */}
      {lightbox && <Lightbox event={lightbox} onClose={() => setLightbox(null)} />}

      {/* Keyframe for spin animation */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
