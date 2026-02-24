'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export interface WatchEntry {
  camera: string;
  description: string;
  timestamp: string;
}

const POLL_INTERVAL_MS = 60_000;
const STORAGE_KEY = 'nvr_watch_log';
const MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

function fmt(iso: string) {
  return new Date(iso).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function loadFromStorage(): WatchEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as WatchEntry[];
    const cutoff = Date.now() - MAX_AGE_MS;
    return parsed.filter((e) => new Date(e.timestamp).getTime() > cutoff);
  } catch {
    return [];
  }
}

function saveToStorage(entries: WatchEntry[]) {
  if (typeof window === 'undefined') return;
  const cutoff = Date.now() - MAX_AGE_MS;
  const pruned = entries
    .filter((e) => new Date(e.timestamp).getTime() > cutoff)
    .slice(0, 500);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pruned));
}

function IconEye({ active }: { active: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" fill={active ? 'currentColor' : 'none'} />
    </svg>
  );
}

function IconClose() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function IconRefresh() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10" />
      <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
    </svg>
  );
}

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CameraWatchLog({ open, onClose }: Props) {
  const [entries, setEntries] = useState<WatchEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Load persisted entries on mount
  useEffect(() => {
    setEntries(loadFromStorage());
  }, []);

  const runAnalysis = useCallback(async () => {
    setLoading(true);
    setError(null);
    setCountdown(POLL_INTERVAL_MS / 1000);
    try {
      const res = await fetch('/api/camera-watch', { method: 'POST' });
      if (!res.ok) {
        const j = (await res.json()) as { error?: string };
        throw new Error(j.error ?? `HTTP ${res.status}`);
      }
      const { entries: newEntries } = (await res.json()) as { entries: WatchEntry[] };
      setEntries((prev) => {
        const merged = [...newEntries, ...prev].slice(0, 500);
        saveToStorage(merged);
        return merged;
      });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!open) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
      intervalRef.current = null;
      countdownRef.current = null;
      return;
    }
    void runAnalysis();
    intervalRef.current = setInterval(() => void runAnalysis(), POLL_INTERVAL_MS);
    countdownRef.current = setInterval(() => setCountdown((c) => Math.max(0, c - 1)), 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [open, runAnalysis]);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = 0;
  }, [entries.length]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex justify-end pointer-events-none">
      <div className="absolute inset-0 pointer-events-auto" onClick={onClose} aria-hidden />
      <div
        className="relative w-80 h-full bg-[#0d1520] border-l border-white/[0.07]
                   flex flex-col shadow-2xl pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex-none flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <span className="text-blue-400"><IconEye active /></span>
            <span className="text-[12px] font-semibold text-white/80 tracking-wide">AI Activity Log</span>
            {loading && <span className="w-3.5 h-3.5 border border-white/10 border-t-blue-500 rounded-full animate-spin" />}
          </div>
          <div className="flex items-center gap-2">
            {!loading && (
              <button onClick={() => void runAnalysis()} title="Refresh now"
                className="text-white/30 hover:text-white/70 transition-colors">
                <IconRefresh />
              </button>
            )}
            <button onClick={onClose} title="Close"
              className="text-white/30 hover:text-white/70 transition-colors">
              <IconClose />
            </button>
          </div>
        </div>

        {/* Sub-header */}
        <div className="flex-none flex items-center justify-between px-4 py-1.5
                        bg-white/[0.02] border-b border-white/[0.04]">
          <span className="text-[10px] text-white/25">
            {loading ? 'Analyzing camera feeds…' : `Next scan in ${countdown}s`}
          </span>
          <span className="text-[10px] text-white/20">{entries.length} entries</span>
        </div>

        {/* Entry list */}
        <div ref={listRef} className="flex-1 overflow-y-auto px-3 py-2 space-y-2 scrollbar-none">
          {error && (
            <div className="text-[11px] text-red-400/80 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </div>
          )}
          {entries.length === 0 && !loading && !error && (
            <div className="flex items-center justify-center h-32">
              <span className="text-white/15 text-[11px]">Waiting for first scan…</span>
            </div>
          )}
          {entries.map((entry, i) => (
            <div key={`${entry.timestamp}-${entry.camera}-${i}`}
              className="rounded-lg bg-white/[0.03] border border-white/[0.05] px-3 py-2.5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-semibold text-blue-400/80 truncate max-w-[60%]">
                  {entry.camera}
                </span>
                <span className="text-[10px] text-white/25 font-mono tabular-nums flex-none">
                  {fmt(entry.timestamp)}
                </span>
              </div>
              <p className="text-[11px] text-white/55 leading-relaxed">{entry.description}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex-none px-4 py-2 border-t border-white/[0.05]">
          <p className="text-[9px] text-white/15 text-center leading-relaxed">
            Entries saved for 24 h · View full report on the Summary page.
          </p>
        </div>
      </div>
    </div>
  );
}
