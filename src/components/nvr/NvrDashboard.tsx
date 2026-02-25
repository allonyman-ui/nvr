'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import CameraPlayer from './CameraPlayer';
import CameraWatchLog from './CameraWatchLog';
import ActivityFeed from './ActivityFeed';
import KnownPeoplePanel from './KnownPeoplePanel';
import IntelPanel from './IntelPanel';
import { useSceneMonitor } from '@/hooks/useSceneMonitor';
import type { IntelEntry } from '@/lib/supabase';

interface Camera {
  id: string;
  name: string;
  streamName: string;
}

interface NvrDashboardProps {
  go2rtcBaseUrl: string;
  cameras: Camera[];
  lastLogin: string | null;
}

type Layout = 'auto' | '1x1' | '2x2' | '3x2';
type Panel  = 'none' | 'ailog' | 'activity' | 'people' | 'intel';

function resolveLayout(layout: Layout, count: number): [number, number] {
  if (layout === '1x1') return [1, 1];
  if (layout === '2x2') return [2, 4];
  if (layout === '3x2') return [3, 6];
  if (count <= 1) return [1, 1];
  if (count <= 2) return [2, 2];
  if (count <= 4) return [2, 4];
  return [3, count];
}

function useClock() {
  const [time, setTime] = useState('');
  useEffect(() => {
    const fmt = () =>
      new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setTime(fmt());
    const id = setInterval(() => setTime(fmt()), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

function fmtLastLogin(iso: string) {
  const d     = new Date(iso);
  const today = new Date();
  if (d.toDateString() === today.toDateString()) {
    return `Today ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }
  return (
    d.toLocaleDateString([], { month: 'short', day: 'numeric' }) +
    ' ' +
    d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  );
}

function fmtAgo(iso: string) {
  const diff = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (diff < 1)  return 'just now';
  if (diff < 60) return `${diff}m ago`;
  return `${Math.round(diff / 60)}h ago`;
}

// ── Icons ──────────────────────────────────────────────────────────────────

function CameraIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14" />
      <rect x="2" y="7" width="13" height="10" rx="2" />
    </svg>
  );
}
function Grid1Icon() {
  return <svg width="13" height="13" viewBox="0 0 12 12" fill="currentColor"><rect x="1" y="1" width="10" height="10" rx="1.5" /></svg>;
}
function Grid2Icon() {
  return (
    <svg width="13" height="13" viewBox="0 0 12 12" fill="currentColor">
      <rect x="1" y="1" width="4.5" height="4.5" rx="1" /><rect x="6.5" y="1" width="4.5" height="4.5" rx="1" />
      <rect x="1" y="6.5" width="4.5" height="4.5" rx="1" /><rect x="6.5" y="6.5" width="4.5" height="4.5" rx="1" />
    </svg>
  );
}
function Grid3Icon() {
  return (
    <svg width="13" height="13" viewBox="0 0 12 12" fill="currentColor">
      <rect x="1" y="1" width="2.67" height="4.5" rx="0.75" /><rect x="4.67" y="1" width="2.67" height="4.5" rx="0.75" /><rect x="8.33" y="1" width="2.67" height="4.5" rx="0.75" />
      <rect x="1" y="6.5" width="2.67" height="4.5" rx="0.75" /><rect x="4.67" y="6.5" width="2.67" height="4.5" rx="0.75" /><rect x="8.33" y="6.5" width="2.67" height="4.5" rx="0.75" />
    </svg>
  );
}
function IconActivity() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}
function IconPeople() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  );
}
function IconLock() {
  return (
    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  );
}
function IconBrain() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2A2.5 2.5 0 0112 4.5v15a2.5 2.5 0 01-4.96-.46 2.5 2.5 0 01-1.07-4.8A3 3 0 015 11V9a3 3 0 013-3 2.5 2.5 0 011.5-4z" />
      <path d="M14.5 2A2.5 2.5 0 0112 4.5v15a2.5 2.5 0 004.96-.46 2.5 2.5 0 001.07-4.8A3 3 0 0019 11V9a3 3 0 00-3-3 2.5 2.5 0 00-1.5-4z" />
    </svg>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────

export default function NvrDashboard({ go2rtcBaseUrl, cameras, lastLogin }: NvrDashboardProps) {
  const router = useRouter();
  const time   = useClock();

  const allIds = cameras.map((c) => c.id);
  const [visible,        setVisible]        = useState<Set<string>>(new Set(allIds));
  const [layout,         setLayout]         = useState<Layout>('auto');
  const [focused,        setFocused]        = useState<Camera | null>(null);
  const [panel,          setPanel]          = useState<Panel>('none');
  const [captureEnabled, setCaptureEnabled] = useState(true);

  const visibleCameras    = cameras.filter((c) => visible.has(c.id));
  const [cols, maxCams]   = resolveLayout(layout, visibleCameras.length);
  const displayedCameras  = visibleCameras.slice(0, maxCams);
  const rows              = Math.max(1, Math.ceil(displayedCameras.length / cols));

  // ── Scene monitor: 5s motion capture + 5-min intel updates ────────────
  const capture = useSceneMonitor(cameras, go2rtcBaseUrl, captureEnabled);

  // ── Intel panel state ─────────────────────────────────────────────────
  const [entries,      setEntries]      = useState<IntelEntry[]>([]);
  const [intelLoading, setIntelLoading] = useState(false);
  const intelPollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fetch latest intel entries
  const fetchIntel = useCallback(async () => {
    try {
      const res  = await fetch('/api/intel-log?limit=20');
      const data = (await res.json()) as { entries?: IntelEntry[] };
      if (data.entries) setEntries(data.entries);
    } catch { /* ignore */ }
  }, []);

  // Trigger a manual intel update (fires the full analysis)
  const triggerManualIntel = useCallback(async () => {
    if (intelLoading) return;
    setIntelLoading(true);
    try {
      await fetch('/api/intel-update', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ frames: [], trigger: 'manual' }),
      });
      await fetchIntel();
    } catch { /* ignore */ } finally {
      setIntelLoading(false);
    }
  }, [intelLoading, fetchIntel]);

  // On mount: load intel + poll every 30 s
  useEffect(() => {
    void fetchIntel();
    intelPollRef.current = setInterval(() => void fetchIntel(), 30_000);
    return () => { if (intelPollRef.current) clearInterval(intelPollRef.current); };
  }, [fetchIntel]);

  // Re-fetch when hook fires a new intel update
  useEffect(() => {
    if (capture.lastIntelAt) void fetchIntel();
  }, [capture.lastIntelAt, fetchIntel]);

  function togglePanel(p: Panel) {
    setPanel((cur) => (cur === p ? 'none' : p));
  }

  function toggleCamera(id: string) {
    setVisible((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { if (next.size > 1) next.delete(id); }
      else { next.add(id); }
      return next;
    });
  }

  async function handleLogout() {
    await fetch('/api/nvr-auth', { method: 'DELETE' });
    router.push('/login');
    router.refresh();
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setFocused(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const streamUrl   = useCallback((s: string) => `${go2rtcBaseUrl}/api/stream.m3u8?src=${s}`, [go2rtcBaseUrl]);
  const snapshotUrl = useCallback((s: string) => `${go2rtcBaseUrl}/api/frame.jpeg?src=${s}`,  [go2rtcBaseUrl]);

  const LAYOUTS: { key: Layout; icon: React.ReactNode; label: string }[] = [
    { key: 'auto', icon: null,           label: 'Auto' },
    { key: '1x1',  icon: <Grid1Icon />,  label: '1×1'  },
    { key: '2x2',  icon: <Grid2Icon />,  label: '2×2'  },
    { key: '3x2',  icon: <Grid3Icon />,  label: '3×2'  },
  ];

  return (
    <div className="h-screen bg-[#070b11] text-white flex flex-col overflow-hidden select-none">

      {/* ── Header ── */}
      <header className="flex-none flex items-center gap-3 px-4 py-2.5
                         border-b border-white/[0.06]
                         bg-[#0b1320]/90 backdrop-blur-xl shadow-lg shadow-black/30">

        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="w-7 h-7 rounded-lg bg-blue-600/20 border border-blue-500/30
                          flex items-center justify-center text-blue-400 flex-none">
            <CameraIcon />
          </div>
          <span className="font-semibold text-[13px] text-white/85 hidden sm:block tracking-tight">
            Security Cameras
          </span>
          <div className="flex items-center gap-1.5 bg-red-500/10 border border-red-500/20
                          rounded-full px-2 py-0.5 ml-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse flex-none" />
            <span className="text-[10px] font-semibold text-red-400 tracking-widest uppercase">Live</span>
          </div>
          <span className="text-[11px] text-white/20 bg-white/[0.05] border border-white/[0.08]
                           px-2 py-0.5 rounded-full font-medium tabular-nums">
            {displayedCameras.length}/{cameras.length}
          </span>
          <button
            onClick={() => setCaptureEnabled((e) => !e)}
            title={captureEnabled ? 'AI capture active — click to pause' : 'AI capture paused — click to resume'}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px]
                        font-medium border transition-all ${captureEnabled
              ? 'bg-green-500/10 border-green-500/25 text-green-400'
              : 'bg-white/[0.04] border-white/[0.08] text-white/25'}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full flex-none ${captureEnabled ? 'bg-green-500 animate-pulse' : 'bg-white/20'}`} />
            {captureEnabled ? 'AI On' : 'AI Off'}
          </button>
          {/* Intel updating indicator */}
          {capture.intelUpdating && (
            <span className="hidden sm:flex items-center gap-1 text-[10px] text-violet-400/70 animate-pulse">
              <IconBrain />analysing…
            </span>
          )}
        </div>

        {/* Layout picker */}
        <div className="flex items-center gap-0.5 bg-white/[0.05] border border-white/[0.07] rounded-xl p-0.5 flex-none">
          {LAYOUTS.map(({ key, icon, label }) => (
            <button key={key} onClick={() => setLayout(key)} title={label}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all flex items-center gap-1.5 ${
                layout === key
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-700/50'
                  : 'text-white/35 hover:text-white/70 hover:bg-white/5'
              }`}>
              {icon ?? label}
            </button>
          ))}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-1.5 flex-none">
          <button onClick={() => togglePanel('activity')} title="Activity Feed"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px]
                        font-medium transition-all border relative ${
              panel === 'activity'
                ? 'bg-green-600/20 text-green-400 border-green-500/40'
                : 'text-white/30 hover:text-white/65 border-transparent hover:bg-white/[0.06] hover:border-white/[0.08]'
            }`}>
            <IconActivity />
            <span className="hidden md:inline">Activity</span>
            {capture.eventCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full
                               text-[8px] font-bold text-white flex items-center justify-center">
                {capture.eventCount > 9 ? '9+' : capture.eventCount}
              </span>
            )}
          </button>

          <button onClick={() => togglePanel('people')} title="Known People"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px]
                        font-medium transition-all border ${
              panel === 'people'
                ? 'bg-purple-600/20 text-purple-400 border-purple-500/40'
                : 'text-white/30 hover:text-white/65 border-transparent hover:bg-white/[0.06] hover:border-white/[0.08]'
            }`}>
            <IconPeople />
            <span className="hidden md:inline">People</span>
          </button>

          <button onClick={() => togglePanel('intel')} title="Intelligence Log"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px]
                        font-medium transition-all border relative ${
              panel === 'intel'
                ? 'bg-violet-600/20 text-violet-400 border-violet-500/40'
                : 'text-white/30 hover:text-white/65 border-transparent hover:bg-white/[0.06] hover:border-white/[0.08]'
            }`}>
            <IconBrain />
            <span className="hidden md:inline">Intel</span>
            {entries[0]?.anomalies?.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full
                               text-[8px] font-bold text-white flex items-center justify-center">
                !
              </span>
            )}
          </button>

          <div className="w-px h-4 bg-white/[0.08] mx-1" />

          {lastLogin && (
            <div className="hidden lg:flex items-center gap-1 text-white/20 text-[10px]"
              title={`Session: ${new Date(lastLogin).toLocaleString()}`}>
              <IconLock />
              <span>{fmtLastLogin(lastLogin)}</span>
            </div>
          )}

          <span className="text-[11px] text-white/25 font-mono tabular-nums hidden md:block">{time}</span>

          <button onClick={handleLogout}
            className="text-[11px] text-white/25 hover:text-white/65 transition-colors
                       px-2.5 py-1 rounded-lg hover:bg-white/[0.06] border border-transparent
                       hover:border-white/[0.08]">
            Sign out
          </button>
        </div>
      </header>

      {/* ── Camera filter pills ── */}
      <div className="flex-none flex items-center gap-1.5 px-4 py-2
                      border-b border-white/[0.04] overflow-x-auto scrollbar-none bg-[#080d14]/50">
        <button onClick={() => setVisible(new Set(allIds))}
          className={`flex-none px-3 py-1 rounded-full text-[11px] font-medium transition-all ${
            visible.size === cameras.length
              ? 'bg-white/10 text-white border border-white/20'
              : 'text-white/25 hover:text-white/55 hover:bg-white/[0.04] border border-transparent'
          }`}>All</button>
        {cameras.map((cam) => (
          <button key={cam.id} onClick={() => toggleCamera(cam.id)}
            className={`flex-none px-3 py-1 rounded-full text-[11px] font-medium transition-all ${
              visible.has(cam.id)
                ? 'bg-blue-600/80 text-white border border-blue-500/50 shadow-sm shadow-blue-900/40'
                : 'text-white/25 hover:text-white/55 hover:bg-white/[0.04] border border-transparent'
            }`}>
            {cam.name}
          </button>
        ))}
      </div>

      {/* ── Camera grid ── */}
      <main className="flex-1 overflow-hidden p-2 bg-[#060a10]" style={{ minHeight: 0 }}>
        {displayedCameras.length === 0 ? (
          <div className="h-full flex items-center justify-center text-white/15 text-sm">
            No cameras selected
          </div>
        ) : (
          <div className="h-full grid gap-2"
            style={{
              gridTemplateColumns: `repeat(${cols}, 1fr)`,
              gridTemplateRows:    `repeat(${rows}, 1fr)`,
            }}>
            {displayedCameras.map((cam) => (
              <CameraPlayer key={cam.id} label={cam.name}
                streamUrl={streamUrl(cam.streamName)}
                snapshotUrl={snapshotUrl(cam.streamName)}
                onExpand={() => setFocused(cam)} />
            ))}
          </div>
        )}
      </main>

      {/* ── Side panels ── */}
      <ActivityFeed
        open={panel === 'activity'}
        onClose={() => setPanel('none')}
        captureActive={capture.isCapturing}
        captureEventCount={capture.eventCount}
        lastCapture={capture.lastCapture}
      />
      <KnownPeoplePanel open={panel === 'people'} onClose={() => setPanel('none')} />
      <CameraWatchLog   open={panel === 'ailog'}  onClose={() => setPanel('none')} />
      <IntelPanel
        open={panel === 'intel'}
        onClose={() => setPanel('none')}
        intelUpdating={capture.intelUpdating}
        lastIntelAt={capture.lastIntelAt}
        entries={entries}
        loading={intelLoading}
        onRefresh={() => void triggerManualIntel()}
      />

      {/* ── Fullscreen overlay ── */}
      {focused && (
        <div className="fixed inset-0 bg-black/95 z-50 flex flex-col" onClick={() => setFocused(null)}>
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/10"
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-1.5">
              {cameras.filter((c) => visible.has(c.id)).map((cam) => (
                <button key={cam.id} onClick={() => setFocused(cam)}
                  className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all ${
                    focused.id === cam.id
                      ? 'bg-white/15 text-white border border-white/25'
                      : 'text-white/35 hover:text-white/70 border border-transparent'
                  }`}>
                  {cam.name}
                </button>
              ))}
            </div>
            <button onClick={() => setFocused(null)}
              className="w-8 h-8 flex items-center justify-center text-white/40
                         hover:text-white hover:bg-white/10 rounded-full transition-colors text-lg"
              title="Close (Esc)">✕</button>
          </div>
          <div className="flex-1 flex items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
            <div className="w-full h-full max-w-6xl max-h-full">
              <CameraPlayer key={`focused-${focused.id}`} label={focused.name}
                streamUrl={streamUrl(focused.streamName)}
                snapshotUrl={snapshotUrl(focused.streamName)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
