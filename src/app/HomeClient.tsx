'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import type { ActivityEvent, IntelEntry } from '@/lib/supabase';

// ── Helpers ───────────────────────────────────────────────────────────────────

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

function fmtDate(iso: string) {
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return d.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });
}

function isToday(iso: string) {
  return new Date(iso).toDateString() === new Date().toDateString();
}

function groupEventsByDay(events: ActivityEvent[]): { day: string; label: string; events: ActivityEvent[] }[] {
  const groups = new Map<string, ActivityEvent[]>();
  for (const e of events) {
    const day = new Date(e.timestamp).toDateString();
    if (!groups.has(day)) groups.set(day, []);
    groups.get(day)!.push(e);
  }
  return Array.from(groups.entries()).map(([day, evs]) => ({
    day,
    label: fmtDate(evs[0].timestamp),
    events: evs,
  }));
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function IconBrain({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2A2.5 2.5 0 0112 4.5v15a2.5 2.5 0 01-4.96-.46 2.5 2.5 0 01-1.07-4.8A3 3 0 015 11V9a3 3 0 013-3 2.5 2.5 0 011.5-4z" />
      <path d="M14.5 2A2.5 2.5 0 0112 4.5v15a2.5 2.5 0 004.96-.46 2.5 2.5 0 001.07-4.8A3 3 0 0119 11V9a3 3 0 00-3-3 2.5 2.5 0 00-1.5-4z" />
    </svg>
  );
}
function IconCamera({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14" />
      <rect x="2" y="7" width="13" height="10" rx="2" />
    </svg>
  );
}
function IconActivity({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}
function IconPerson({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
function IconWarning({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}
function IconRefresh({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10" />
      <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
    </svg>
  );
}
function IconChart({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}
function IconLock({ size = 9 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  );
}

// ── Event Row ─────────────────────────────────────────────────────────────────

function EventRow({ event }: { event: ActivityEvent }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <button
      onClick={() => setExpanded((e) => !e)}
      className="w-full text-left flex items-start gap-3 px-3.5 py-2.5 rounded-xl hover:bg-white/[0.03] transition-colors group">
      <div className="flex-none pt-[7px]">
        <div className={`w-1.5 h-1.5 rounded-full ${event.has_faces ? 'bg-purple-500/70' : 'bg-white/15'}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
          <span className="text-[10px] font-mono text-white/30 tabular-nums">{fmtTime(event.timestamp)}</span>
          <span className="text-[9px] font-medium text-blue-400/50 bg-blue-500/[0.08] border border-blue-500/10 px-1.5 py-0.5 rounded-full">
            {event.camera_name}
          </span>
          {event.has_faces && (
            <span className="text-[9px] font-medium text-purple-400/60 bg-purple-500/[0.08] border border-purple-500/10 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
              <IconPerson size={9} />
              {event.face_count}
            </span>
          )}
        </div>
        <p className="text-[12px] text-white/50 leading-snug">{event.description}</p>
        {expanded && event.image_url && (
          <div className="mt-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={event.image_url}
              alt={event.description}
              className="rounded-lg max-w-xs w-full border border-white/[0.08]"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </div>
        )}
      </div>
      {event.image_url && (
        <span className="text-white/10 group-hover:text-white/25 transition-colors text-[10px] flex-none pt-[7px]">
          {expanded ? '▲' : '▼'}
        </span>
      )}
    </button>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function HomeClient({ lastLogin }: { lastLogin: string | null }) {
  const router = useRouter();

  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [intel, setIntel] = useState<IntelEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [cameraFilter, setCameraFilter] = useState<string>('all');
  const [hoursFilter, setHoursFilter] = useState<24 | 48 | 72>(24);

  const fetchData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const [evRes, intRes] = await Promise.all([
        fetch(`/api/activity-log?hours=${hoursFilter}&limit=200`),
        fetch('/api/intel-log?limit=25'),
      ]);
      if (evRes.ok) {
        const d = (await evRes.json()) as { events?: ActivityEvent[] };
        setEvents(d.events ?? []);
      }
      if (intRes.ok) {
        const d = (await intRes.json()) as { entries?: IntelEntry[] };
        setIntel(d.entries ?? []);
      }
    } finally {
      setLoading(false);
      if (isRefresh) setRefreshing(false);
    }
  }, [hoursFilter]);

  useEffect(() => {
    void fetchData();
    const id = setInterval(() => void fetchData(), 60_000);
    return () => clearInterval(id);
  }, [fetchData]);

  // ── Derived data ─────────────────────────────────────────────────────────

  const latest = intel[0] ?? null;

  const todayEvents = useMemo(() => events.filter((e) => isToday(e.timestamp)), [events]);
  const todayFaces  = useMemo(() => todayEvents.reduce((s, e) => s + e.face_count, 0), [todayEvents]);

  const newSinceLastLogin = useMemo(() => {
    if (!lastLogin) return null;
    const cutoff = new Date(lastLogin).getTime();
    const n = events.filter((e) => new Date(e.timestamp).getTime() > cutoff).length;
    return n > 0 ? n : null;
  }, [events, lastLogin]);

  const busiestCamera = useMemo(() => {
    const counts = new Map<string, number>();
    for (const e of todayEvents) counts.set(e.camera_name, (counts.get(e.camera_name) ?? 0) + 1);
    let max = 0, best = '';
    for (const [name, count] of counts) { if (count > max) { max = count; best = name; } }
    return best || null;
  }, [todayEvents]);

  const cameraNames = useMemo(() => {
    const names = new Set(events.map((e) => e.camera_name));
    return Array.from(names).sort();
  }, [events]);

  const filteredEvents = useMemo(() => {
    if (cameraFilter === 'people') return events.filter((e) => e.has_faces);
    if (cameraFilter !== 'all') return events.filter((e) => e.camera_name === cameraFilter);
    return events;
  }, [events, cameraFilter]);

  const groupedEvents = useMemo(() => groupEventsByDay(filteredEvents), [filteredEvents]);

  // Hourly activity chart (last 24h)
  const hourlyData = useMemo(() => {
    const hours = Array.from({ length: 24 }, (_, h) => ({ hour: h, count: 0 }));
    const cutoff = Date.now() - 24 * 3600 * 1000;
    for (const e of events) {
      if (new Date(e.timestamp).getTime() >= cutoff) {
        hours[new Date(e.timestamp).getHours()].count++;
      }
    }
    return hours;
  }, [events]);
  const maxHourly = useMemo(() => Math.max(1, ...hourlyData.map((h) => h.count)), [hourlyData]);

  // Deduplicated recent patterns
  const recentPatterns = useMemo(() => {
    const all = intel.slice(0, 10).flatMap((e) => e.patterns);
    const seen = new Set<string>();
    return all.filter((p) => {
      const key = p.replace(/^(CONFIRMED|NEW|INSIGHT|PREDICTION):\s*/i, '').toLowerCase().slice(0, 50);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).slice(0, 10);
  }, [intel]);

  const recentAnomalies = useMemo(
    () => intel.slice(0, 5).flatMap((e) => e.anomalies.map((a) => ({ a, ts: e.timestamp }))).slice(0, 5),
    [intel],
  );

  const currentHour = new Date().getHours();

  async function handleLogout() {
    await fetch('/api/nvr-auth', { method: 'DELETE' });
    router.push('/login');
    router.refresh();
  }

  // ── Loading ───────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070b11] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
          <p className="text-white/30 text-sm">Loading intelligence hub…</p>
        </div>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#070b11] text-white">

      {/* ── Header ── */}
      <header className="sticky top-0 z-30 bg-[#070b11]/95 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">

          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400 flex-none">
              <IconBrain size={14} />
            </div>
            <span className="font-semibold text-[14px] text-white/90 hidden sm:block tracking-tight">Home Intelligence</span>
            <div className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 rounded-full px-2 py-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse flex-none" />
              <span className="text-[9px] font-semibold text-green-400 tracking-widest uppercase">Live</span>
            </div>
            {newSinceLastLogin !== null && (
              <span className="hidden sm:inline text-[10px] text-amber-400/60 bg-amber-500/[0.07] border border-amber-500/15 px-2 py-0.5 rounded-full">
                {newSinceLastLogin} new since last visit
              </span>
            )}
          </div>

          <nav className="flex items-center gap-1 flex-none">
            <button
              onClick={() => router.push('/cameras')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium text-white/35 hover:text-white/75 hover:bg-white/[0.06] transition-all border border-transparent hover:border-white/[0.08]">
              <IconCamera size={12} />
              <span className="hidden sm:inline">Cameras</span>
            </button>
            <button
              onClick={() => router.push('/intel')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium text-white/35 hover:text-white/75 hover:bg-white/[0.06] transition-all border border-transparent hover:border-white/[0.08]">
              <IconBrain size={12} />
              <span className="hidden sm:inline">Intel Log</span>
            </button>
            <div className="w-px h-4 bg-white/[0.08] mx-0.5" />
            <button
              onClick={() => void fetchData(true)}
              disabled={refreshing}
              title="Refresh"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium text-white/30 hover:text-white/60 hover:bg-white/[0.05] transition-all disabled:opacity-40">
              <span className={refreshing ? 'animate-spin' : ''}><IconRefresh size={12} /></span>
            </button>
            {lastLogin && (
              <div className="hidden lg:flex items-center gap-1 text-white/20 text-[10px] px-1.5">
                <IconLock size={9} />
                <span>{new Date(lastLogin).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            )}
            <button
              onClick={() => void handleLogout()}
              className="text-[11px] text-white/25 hover:text-white/65 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-white/[0.06] border border-transparent hover:border-white/[0.08]">
              Sign out
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">

        {/* ── Right Now strip ── */}
        {latest && Object.keys(latest.camera_states).length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <p className="text-[10px] font-bold text-white/25 uppercase tracking-widest">Right Now</p>
              <span className="text-[9px] text-white/15 ml-auto">{timeAgo(latest.timestamp)}</span>
            </div>
            <div
              className="grid gap-2"
              style={{ gridTemplateColumns: `repeat(${Math.min(Object.keys(latest.camera_states).length, 4)}, 1fr)` }}>
              {Object.entries(latest.camera_states).map(([cam, desc]) => (
                <button
                  key={cam}
                  onClick={() => router.push('/cameras')}
                  className="text-left px-3.5 py-3 rounded-xl bg-white/[0.03] border border-white/[0.07] hover:bg-white/[0.05] hover:border-white/[0.12] transition-all group">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="text-blue-400/40 group-hover:text-blue-400/70 transition-colors"><IconCamera size={11} /></span>
                    <p className="text-[9px] font-bold text-blue-400/50 uppercase tracking-wider truncate">{cam}</p>
                  </div>
                  <p className="text-[12px] text-white/60 leading-snug line-clamp-2">{desc}</p>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* ── Stats bar ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {([
            { label: 'Events Today', value: todayEvents.length, icon: <IconActivity size={13} />, color: 'green' },
            { label: 'People Seen',  value: todayFaces,          icon: <IconPerson  size={13} />, color: 'purple' },
            { label: 'Busiest Camera', value: busiestCamera ?? '—', icon: <IconCamera size={13} />, color: 'blue' },
            { label: 'Last AI Update',  value: latest ? timeAgo(latest.timestamp) : '—', icon: <IconBrain size={13} />, color: 'violet' },
          ] as const).map(({ label, value, icon, color }) => (
            <div
              key={label}
              className={`px-4 py-3.5 rounded-xl bg-white/[0.025] border ${
                color === 'green'  ? 'border-green-500/[0.12]'  :
                color === 'purple' ? 'border-purple-500/[0.12]' :
                color === 'blue'   ? 'border-blue-500/[0.12]'   : 'border-violet-500/[0.12]'
              }`}>
              <div className={`flex items-center gap-1.5 mb-1.5 ${
                color === 'green'  ? 'text-green-400'  :
                color === 'purple' ? 'text-purple-400' :
                color === 'blue'   ? 'text-blue-400'   : 'text-violet-400'
              }`}>{icon}</div>
              <p className={`text-xl font-bold tabular-nums truncate ${
                color === 'green'  ? 'text-green-400'  :
                color === 'purple' ? 'text-purple-400' :
                color === 'blue'   ? 'text-blue-400'   : 'text-violet-400'
              }`}>{value}</p>
              <p className="text-[9px] font-medium text-white/25 mt-0.5 uppercase tracking-wider">{label}</p>
            </div>
          ))}
        </div>

        {/* ── Anomaly alerts ── */}
        {recentAnomalies.length > 0 && (
          <div className="rounded-xl bg-amber-500/[0.06] border border-amber-500/20 px-4 py-3.5">
            <div className="flex items-center gap-2 mb-2.5">
              <div className="w-5 h-5 rounded-md bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-amber-400">
                <IconWarning size={11} />
              </div>
              <p className="text-[11px] font-semibold text-amber-400/80 uppercase tracking-wider">
                {recentAnomalies.length} Anomal{recentAnomalies.length === 1 ? 'y' : 'ies'} Detected
              </p>
            </div>
            <ul className="space-y-1.5">
              {recentAnomalies.map(({ a, ts }, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="flex-none w-1.5 h-1.5 rounded-full bg-amber-500/60 mt-[7px]" />
                  <span className="flex-1 text-[12px] text-amber-400/75 leading-relaxed">{a}</span>
                  <span className="flex-none text-[9px] text-amber-400/30 tabular-nums mt-0.5">{timeAgo(ts)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ── Main layout: timeline + sidebar ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">

          {/* ── Activity Timeline ── */}
          <div className="space-y-4">
            {/* Filter + time range bar */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-0.5 bg-white/[0.04] border border-white/[0.07] rounded-xl p-1">
                <button
                  onClick={() => setCameraFilter('all')}
                  className={`px-3 py-1 rounded-lg text-[11px] font-medium transition-all ${cameraFilter === 'all' ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white/60'}`}>
                  All
                </button>
                <button
                  onClick={() => setCameraFilter('people')}
                  className={`flex items-center gap-1 px-3 py-1 rounded-lg text-[11px] font-medium transition-all ${cameraFilter === 'people' ? 'bg-purple-600/60 text-white' : 'text-white/30 hover:text-white/60'}`}>
                  <IconPerson size={10} /> People
                </button>
                {cameraNames.map((name) => (
                  <button
                    key={name}
                    onClick={() => setCameraFilter(name)}
                    className={`px-3 py-1 rounded-lg text-[11px] font-medium transition-all ${cameraFilter === name ? 'bg-blue-600/80 text-white' : 'text-white/30 hover:text-white/60'}`}>
                    {name}
                  </button>
                ))}
              </div>
              <div className="ml-auto flex items-center gap-0.5 bg-white/[0.04] border border-white/[0.07] rounded-xl p-1">
                {([24, 48, 72] as const).map((h) => (
                  <button
                    key={h}
                    onClick={() => setHoursFilter(h)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${hoursFilter === h ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white/60'}`}>
                    {h}h
                  </button>
                ))}
              </div>
            </div>

            {/* Event groups */}
            {groupedEvents.length === 0 ? (
              <div className="flex flex-col items-center py-20 gap-3 text-white/20">
                <IconActivity size={32} />
                <p className="text-[13px]">No events in this time range</p>
              </div>
            ) : (
              <div className="space-y-6">
                {groupedEvents.map(({ day, label, events: dayEvs }) => (
                  <div key={day}>
                    <div className="flex items-center gap-3 mb-3">
                      <p className="text-[10px] font-bold text-white/25 uppercase tracking-widest">{label}</p>
                      <div className="flex-1 h-px bg-white/[0.05]" />
                      <p className="text-[9px] text-white/15">{dayEvs.length} event{dayEvs.length !== 1 ? 's' : ''}</p>
                    </div>
                    <div className="space-y-0.5">
                      {dayEvs.map((ev) => (
                        <EventRow key={ev.id} event={ev} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Intelligence Sidebar ── */}
          <div className="space-y-4">

            {/* Latest AI Summary */}
            {latest && (
              <div className="rounded-2xl bg-gradient-to-br from-violet-500/8 to-blue-500/4 border border-violet-500/[0.18] p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-lg bg-violet-500/15 border border-violet-500/25 flex items-center justify-center text-violet-400 flex-none">
                    <IconBrain size={12} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-violet-400/70 uppercase tracking-wider">AI Summary</p>
                    <p className="text-[9px] text-white/20 mt-0.5">{timeAgo(latest.timestamp)}</p>
                  </div>
                  <button
                    onClick={() => router.push('/intel')}
                    className="text-[10px] text-violet-400/50 hover:text-violet-400/90 transition-colors font-medium flex-none">
                    Full log →
                  </button>
                </div>
                <p className="text-[13px] text-white/70 leading-relaxed">{latest.summary}</p>
                {latest.change_from_previous && (
                  <p className="text-[11px] text-white/35 mt-2.5 italic border-l-2 border-white/[0.08] pl-3 leading-relaxed">
                    {latest.change_from_previous}
                  </p>
                )}
              </div>
            )}

            {/* Patterns & Predictions */}
            {recentPatterns.length > 0 && (
              <div className="rounded-2xl bg-white/[0.025] border border-white/[0.07] p-5">
                <div className="flex items-center gap-2 mb-3.5">
                  <div className="w-6 h-6 rounded-lg bg-blue-500/15 border border-blue-500/25 flex items-center justify-center text-blue-400 flex-none">
                    <IconChart size={12} />
                  </div>
                  <p className="text-[10px] font-bold text-white/35 uppercase tracking-wider">Patterns & Predictions</p>
                </div>
                <div className="space-y-1.5">
                  {recentPatterns.map((p, i) => {
                    const isConfirmed  = /^CONFIRMED:/i.test(p);
                    const isNew        = /^NEW:/i.test(p);
                    const isInsight    = /^INSIGHT:/i.test(p);
                    const isPrediction = /^PREDICTION:/i.test(p);
                    const text = p.replace(/^(CONFIRMED|NEW|INSIGHT|PREDICTION):\s*/i, '');
                    const cfg = isConfirmed  ? { cls: 'bg-emerald-500/[0.06] border-emerald-500/15 text-emerald-400/80',  tag: 'CONFIRMED'  }
                              : isNew        ? { cls: 'bg-blue-500/[0.06] border-blue-500/15 text-blue-400/80',           tag: 'NEW'        }
                              : isInsight    ? { cls: 'bg-violet-500/[0.06] border-violet-500/15 text-violet-400/80',     tag: 'INSIGHT'    }
                              : isPrediction ? { cls: 'bg-amber-500/[0.06] border-amber-500/15 text-amber-400/80',        tag: 'PREDICT'    }
                              :                { cls: 'bg-white/[0.03] border-white/[0.06] text-white/40',                tag: ''           };
                    return (
                      <div key={i} className={`px-3 py-2 rounded-xl border ${cfg.cls}`}>
                        {cfg.tag && <span className="text-[8px] font-bold opacity-60 mr-1.5 uppercase">{cfg.tag}</span>}
                        <span className="text-[11px] leading-relaxed">{text}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Hourly Activity Chart */}
            <div className="rounded-2xl bg-white/[0.025] border border-white/[0.07] p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-lg bg-green-500/15 border border-green-500/25 flex items-center justify-center text-green-400 flex-none">
                  <IconActivity size={12} />
                </div>
                <p className="text-[10px] font-bold text-white/35 uppercase tracking-wider">Activity by Hour (24h)</p>
              </div>
              <div className="flex items-end gap-px h-14">
                {hourlyData.map(({ hour, count }) => (
                  <div
                    key={hour}
                    title={`${String(hour).padStart(2, '0')}:00 — ${count} event${count !== 1 ? 's' : ''}`}
                    className={`flex-1 rounded-sm transition-colors ${
                      hour === currentHour ? 'bg-violet-500/80' :
                      count > 0            ? 'bg-blue-500/40'   : 'bg-white/[0.04]'
                    }`}
                    style={{ height: `${Math.max(3, Math.round((count / maxHourly) * 100))}%` }}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-1.5">
                {['12am', '6am', '12pm', '6pm', '11pm'].map((l) => (
                  <span key={l} className="text-[8px] text-white/15">{l}</span>
                ))}
              </div>
            </div>

            {/* Open cameras CTA */}
            <button
              onClick={() => router.push('/cameras')}
              className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl bg-blue-600/10 border border-blue-500/20 hover:bg-blue-600/15 hover:border-blue-500/30 transition-all text-blue-400 group">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-500/25 flex items-center justify-center flex-none">
                  <IconCamera size={15} />
                </div>
                <div className="text-left">
                  <p className="text-[12px] font-medium">Live Camera Feeds</p>
                  <p className="text-[9px] text-blue-400/40 mt-0.5">Watch all cameras live</p>
                </div>
              </div>
              <span className="text-[13px] opacity-40 group-hover:opacity-70 group-hover:translate-x-0.5 transition-all">→</span>
            </button>

          </div>
        </div>
      </main>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 0.9s linear infinite; }
      `}</style>
    </div>
  );
}
