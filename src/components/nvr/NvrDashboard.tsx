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

// Returns [cols, maxCameras]
function resolveLayout(layout: Layout, count: number): [number, number] {
  if (layout === '1x1') return [1, 1];
  if (layout === '2x2') return [2, 4];
  if (layout === '3x2') return [3, 6];
  // auto
  if (count <= 1) return [1, 1];
  if (count <= 2) return [2, 2];
  if (count <= 4) return [2, 4];
  return [3, count];
}

function useClock() {
  const [time, setTime] = useState('');
  useEffect(() => {
    const fmt = () =>
      new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    setTime(fmt());
    const id = setInterval(() => setTime(fmt()), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
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
        if (next.size > 1) next.delete(id); // always keep at least one
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function showAll() {
    setVisible(new Set(allIds));
  }

  async function handleLogout() {
    await fetch('/api/nvr-auth', { method: 'DELETE' });
    router.push('/login');
    router.refresh();
  }

  // Close fullscreen on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setFocused(null);
    };
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

  const LAYOUTS: { key: Layout; label: string }[] = [
    { key: 'auto', label: 'Auto' },
    { key: '1x1', label: '1×1' },
    { key: '2x2', label: '2×2' },
    { key: '3x2', label: '3×2' },
  ];

  return (
    <div className="h-screen bg-gray-950 text-white flex flex-col overflow-hidden select-none">
      {/* ── Header ── */}
      <header className="flex-none flex items-center gap-3 px-4 py-2.5 border-b border-gray-800/80">
        {/* Left: icon + title + count */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-400 flex-none"
          >
            <path d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14" />
            <rect x="2" y="7" width="13" height="10" rx="2" />
          </svg>
          <span className="font-semibold text-sm text-white hidden sm:block tracking-tight">
            Security Cameras
          </span>
          <span className="text-xs text-gray-500 bg-gray-900 border border-gray-800 px-2 py-0.5 rounded-full">
            {displayedCameras.length}/{cameras.length}
          </span>
        </div>

        {/* Center: layout picker */}
        <div className="flex items-center gap-1 flex-none">
          {LAYOUTS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setLayout(key)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                layout === key
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-500 hover:text-white hover:bg-gray-800'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Right: clock + logout */}
        <div className="flex items-center gap-3 flex-none">
          <span className="text-xs text-gray-600 font-mono tabular-nums hidden md:block">
            {time}
          </span>
          <button
            onClick={handleLogout}
            className="text-xs text-gray-500 hover:text-white transition-colors px-2 py-1 rounded-md hover:bg-gray-800"
          >
            Logout
          </button>
        </div>
      </header>

      {/* ── Camera filter pills ── */}
      <div className="flex-none flex items-center gap-2 px-4 py-2 border-b border-gray-800/50 overflow-x-auto">
        <button
          onClick={showAll}
          className={`flex-none px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            visible.size === cameras.length
              ? 'bg-gray-700 text-white'
              : 'text-gray-600 hover:text-gray-300 hover:bg-gray-800'
          }`}
        >
          All
        </button>
        {cameras.map((cam) => (
          <button
            key={cam.id}
            onClick={() => toggleCamera(cam.id)}
            className={`flex-none px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              visible.has(cam.id)
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-400 hover:bg-gray-800'
            }`}
          >
            {cam.name}
          </button>
        ))}
      </div>

      {/* ── Camera grid ── */}
      <main className="flex-1 overflow-hidden p-2">
        {displayedCameras.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-600 text-sm">
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

      {/* ── Fullscreen / focused camera overlay ── */}
      {focused && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex flex-col"
          onClick={() => setFocused(null)}
        >
          {/* Overlay header */}
          <div
            className="flex items-center justify-between px-5 py-3 border-b border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              {/* Camera switcher arrows in focused mode */}
              {cameras.length > 1 &&
                cameras
                  .filter((c) => visible.has(c.id))
                  .map((cam) => (
                    <button
                      key={cam.id}
                      onClick={() => setFocused(cam)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        focused.id === cam.id
                          ? 'bg-white/20 text-white'
                          : 'text-white/40 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {cam.name}
                    </button>
                  ))}
            </div>
            <button
              onClick={() => setFocused(null)}
              className="w-8 h-8 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-colors text-lg leading-none"
              title="Close (Esc)"
            >
              ✕
            </button>
          </div>

          {/* Full-size player */}
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
