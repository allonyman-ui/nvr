'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import CameraPlayer from './CameraPlayer';

interface Camera {
  id: string;
  name: string;
  streamName: string;
}

interface NvrDashboardProps {
  go2rtcBaseUrl: string;
  cameras: Camera[];
}

type Layout = 'auto' | '1x1' | '2x2' | '3x2';

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
  return (
    <svg width="13" height="13" viewBox="0 0 12 12" fill="currentColor">
      <rect x="1" y="1" width="10" height="10" rx="1.5"/>
    </svg>
  );
}

function Grid2Icon() {
  return (
    <svg width="13" height="13" viewBox="0 0 12 12" fill="currentColor">
      <rect x="1" y="1" width="4.5" height="4.5" rx="1"/>
      <rect x="6.5" y="1" width="4.5" height="4.5" rx="1"/>
      <rect x="1" y="6.5" width="4.5" height="4.5" rx="1"/>
      <rect x="6.5" y="6.5" width="4.5" height="4.5" rx="1"/>
    </svg>
  );
}

function Grid3Icon() {
  return (
    <svg width="13" height="13" viewBox="0 0 12 12" fill="currentColor">
      <rect x="1" y="1" width="2.67" height="4.5" rx="0.75"/>
      <rect x="4.67" y="1" width="2.67" height="4.5" rx="0.75"/>
      <rect x="8.33" y="1" width="2.67" height="4.5" rx="0.75"/>
      <rect x="1" y="6.5" width="2.67" height="4.5" rx="0.75"/>
      <rect x="4.67" y="6.5" width="2.67" height="4.5" rx="0.75"/>
      <rect x="8.33" y="6.5" width="2.67" height="4.5" rx="0.75"/>
    </svg>
  );
}

export default function NvrDashboard({ go2rtcBaseUrl, cameras }: NvrDashboardProps) {
  const router = useRouter();
  const time = useClock();

  const allIds = cameras.map((c) => c.id);
  const [visible, setVisible] = useState<Set<string>>(new Set(allIds));
  const [layout, setLayout] = useState<Layout>('auto');
  const [focused, setFocused] = useState<Camera | null>(null);

  const visibleCameras = cameras.filter((c) => visible.has(c.id));
  const [cols, maxCams] = resolveLayout(layout, visibleCameras.length);
  const displayedCameras = visibleCameras.slice(0, maxCams);
  const rows = Math.max(1, Math.ceil(displayedCameras.length / cols));

  function toggleCamera(id: string) {
    setVisible((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        if (next.size > 1) next.delete(id);
      } else {
        next.add(id);
      }
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

  const streamUrl = useCallback(
    (streamName: string) => `${go2rtcBaseUrl}/api/stream.m3u8?src=${streamName}`,
    [go2rtcBaseUrl],
  );
  const snapshotUrl = useCallback(
    (streamName: string) => `${go2rtcBaseUrl}/api/frame.jpeg?src=${streamName}`,
    [go2rtcBaseUrl],
  );

  const LAYOUTS: { key: Layout; icon: React.ReactNode; label: string }[] = [
    { key: 'auto', icon: null, label: 'Auto' },
    { key: '1x1',  icon: <Grid1Icon />, label: '1×1' },
    { key: '2x2',  icon: <Grid2Icon />, label: '2×2' },
    { key: '3x2',  icon: <Grid3Icon />, label: '3×2' },
  ];

  return (
    <div className="h-screen bg-[#080c12] text-white flex flex-col overflow-hidden select-none">

      {/* ── Header ── */}
      <header className="flex-none flex items-center gap-3 px-4 py-2.5
                         border-b border-white/[0.06]
                         bg-gradient-to-b from-[#0d1520]/80 to-transparent backdrop-blur-sm">

        {/* Left: branding */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="w-7 h-7 rounded-lg bg-blue-600/20 border border-blue-500/30
                          flex items-center justify-center text-blue-400 flex-none">
            <CameraIcon />
          </div>
          <span className="font-semibold text-[13px] text-white/90 hidden sm:block tracking-tight">
            Security Cameras
          </span>
          {/* Live recording indicator */}
          <div className="flex items-center gap-1.5 bg-red-500/10 border border-red-500/20
                          rounded-full px-2 py-0.5 ml-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse flex-none" />
            <span className="text-[10px] font-semibold text-red-400 tracking-widest uppercase">Live</span>
          </div>
          <span className="text-[11px] text-white/25 bg-white/5 border border-white/10
                           px-2 py-0.5 rounded-full font-medium tabular-nums">
            {displayedCameras.length}/{cameras.length}
          </span>
        </div>

        {/* Center: layout picker */}
        <div className="flex items-center gap-0.5 bg-white/5 rounded-lg p-0.5 flex-none">
          {LAYOUTS.map(({ key, icon, label }) => (
            <button
              key={key}
              onClick={() => setLayout(key)}
              title={label}
              className={`px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-all flex items-center gap-1.5 ${
                layout === key
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-white/40 hover:text-white/70'
              }`}
            >
              {icon ?? label}
            </button>
          ))}
        </div>

        {/* Right: clock + logout */}
        <div className="flex items-center gap-3 flex-none">
          <span className="text-[11px] text-white/30 font-mono tabular-nums hidden md:block">
            {time}
          </span>
          <button
            onClick={handleLogout}
            className="text-[11px] text-white/30 hover:text-white/70 transition-colors
                       px-2.5 py-1 rounded-lg hover:bg-white/8 border border-transparent
                       hover:border-white/10"
          >
            Sign out
          </button>
        </div>
      </header>

      {/* ── Camera filter pills ── */}
      <div className="flex-none flex items-center gap-1.5 px-4 py-2
                      border-b border-white/[0.04] overflow-x-auto scrollbar-none">
        <button
          onClick={() => setVisible(new Set(allIds))}
          className={`flex-none px-3 py-1 rounded-full text-[11px] font-medium transition-all ${
            visible.size === cameras.length
              ? 'bg-white/10 text-white border border-white/20'
              : 'text-white/30 hover:text-white/60 hover:bg-white/5 border border-transparent'
          }`}
        >
          All
        </button>
        {cameras.map((cam) => (
          <button
            key={cam.id}
            onClick={() => toggleCamera(cam.id)}
            className={`flex-none px-3 py-1 rounded-full text-[11px] font-medium transition-all ${
              visible.has(cam.id)
                ? 'bg-blue-600/80 text-white border border-blue-500/50 shadow-sm shadow-blue-500/20'
                : 'text-white/30 hover:text-white/60 hover:bg-white/5 border border-transparent'
            }`}
          >
            {cam.name}
          </button>
        ))}
      </div>

      {/* ── Camera grid ── */}
      <main className="flex-1 overflow-hidden p-2">
        {displayedCameras.length === 0 ? (
          <div className="h-full flex items-center justify-center text-white/20 text-sm">
            No cameras selected
          </div>
        ) : (
          <div
            className="h-full grid gap-2"
            style={{
              gridTemplateColumns: `repeat(${cols}, 1fr)`,
              gridTemplateRows: `repeat(${rows}, 1fr)`,
            }}
          >
            {displayedCameras.map((cam) => (
              <CameraPlayer
                key={cam.id}
                label={cam.name}
                streamUrl={streamUrl(cam.streamName)}
                snapshotUrl={snapshotUrl(cam.streamName)}
                onExpand={() => setFocused(cam)}
              />
            ))}
          </div>
        )}
      </main>

      {/* ── Fullscreen overlay ── */}
      {focused && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex flex-col"
          onClick={() => setFocused(null)}
        >
          <div
            className="flex items-center justify-between px-5 py-3 border-b border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-1.5">
              {cameras.filter((c) => visible.has(c.id)).map((cam) => (
                <button
                  key={cam.id}
                  onClick={() => setFocused(cam)}
                  className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all ${
                    focused.id === cam.id
                      ? 'bg-white/15 text-white border border-white/25'
                      : 'text-white/35 hover:text-white/70 hover:bg-white/8 border border-transparent'
                  }`}
                >
                  {cam.name}
                </button>
              ))}
            </div>
            <button
              onClick={() => setFocused(null)}
              className="w-8 h-8 flex items-center justify-center text-white/40
                         hover:text-white hover:bg-white/10 rounded-full transition-colors text-lg"
              title="Close (Esc)"
            >
              ✕
            </button>
          </div>
          <div
            className="flex-1 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full h-full max-w-6xl max-h-full">
              <CameraPlayer
                key={`focused-${focused.id}`}
                label={focused.name}
                streamUrl={streamUrl(focused.streamName)}
                snapshotUrl={snapshotUrl(focused.streamName)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
