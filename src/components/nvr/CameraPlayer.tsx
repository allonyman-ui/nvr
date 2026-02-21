'use client';

import { useEffect, useRef, useState } from 'react';

interface CameraPlayerProps {
  streamUrl: string;
  snapshotUrl: string;
  label: string;
  onExpand?: () => void;
}

type Status = 'connecting' | 'live' | 'error' | 'failed';

const MAX_RETRIES = 4;
const RETRY_DELAY_MS = 5_000;

// ── Inline SVG icons ──────────────────────────────────────────────────────────

function IconVolume() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 010 7.07" />
      <path d="M19.07 4.93a10 10 0 010 14.14" />
    </svg>
  );
}

function IconMute() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  );
}

function IconSnapshot() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

function IconExpand() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 3 21 3 21 9" />
      <polyline points="9 21 3 21 3 15" />
      <line x1="21" y1="3" x2="14" y2="10" />
      <line x1="3" y1="21" x2="10" y2="14" />
    </svg>
  );
}

function IconRefresh() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10" />
      <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

export default function CameraPlayer({ streamUrl, snapshotUrl, label, onExpand }: CameraPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState<Status>('connecting');
  const [muted, setMuted] = useState(true);
  const [restartKey, setRestartKey] = useState(0);
  const [hovered, setHovered] = useState(false);

  // Main HLS setup — re-runs on streamUrl change or manual reconnect
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let destroyed = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let hls: any = null;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;
    let retryCount = 0;

    setStatus('connecting');

    async function start() {
      if (destroyed || !videoRef.current) return;
      const vid = videoRef.current;

      // Only mark 'live' when video frames are actually rendering, not just
      // when the manifest is parsed — this prevents the black-screen "live" state.
      function onPlaying() {
        if (!destroyed) setStatus('live');
      }
      vid.addEventListener('playing', onPlaying, { once: true });

      const Hls = (await import('hls.js')).default;
      if (destroyed) {
        vid.removeEventListener('playing', onPlaying);
        return;
      }

      if (Hls.isSupported()) {
        hls = new Hls({
          // go2rtc does not support LL-HLS — disable low-latency mode
          lowLatencyMode: false,
          liveSyncDurationCount: 3,
          liveMaxLatencyDurationCount: 10,
          maxBufferLength: 30,
          // Give ffmpeg time to produce the first segment
          manifestLoadingTimeOut: 20000,
          manifestLoadingMaxRetry: 4,
          levelLoadingTimeOut: 20000,
          levelLoadingMaxRetry: 6,
          fragLoadingTimeOut: 20000,
          fragLoadingMaxRetry: 6,
          fragLoadingRetryDelay: 1000,
          // Ensure CORS requests don't send credentials so they work with origin: "*"
          xhrSetup: (xhr: XMLHttpRequest) => {
            xhr.withCredentials = false;
          },
        });
        hls.loadSource(streamUrl);
        hls.attachMedia(vid);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          if (destroyed) return;
          vid.play().catch(() => {});
        });

        hls.on(Hls.Events.ERROR, (_: unknown, data: { fatal: boolean }) => {
          if (!data.fatal || destroyed) return;
          vid.removeEventListener('playing', onPlaying);
          hls?.destroy();
          hls = null;
          if (retryCount < MAX_RETRIES) {
            retryCount += 1;
            setStatus('error');
            retryTimer = setTimeout(start, RETRY_DELAY_MS);
          } else {
            setStatus('failed');
          }
        });
      } else if (vid.canPlayType('application/vnd.apple.mpegurl')) {
        // Safari native HLS
        vid.src = streamUrl;
        vid.onerror = () => {
          if (destroyed) return;
          vid.removeEventListener('playing', onPlaying);
          if (retryCount < MAX_RETRIES) {
            retryCount += 1;
            setStatus('error');
            retryTimer = setTimeout(start, RETRY_DELAY_MS);
          } else {
            setStatus('failed');
          }
        };
        vid.play().catch(() => {});
      }
    }

    start();

    return () => {
      destroyed = true;
      if (retryTimer) clearTimeout(retryTimer);
      hls?.destroy();
    };
  }, [streamUrl, restartKey]);

  // Sync mute state to the video element
  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = muted;
  }, [muted]);

  const statusDot =
    status === 'live'
      ? 'bg-green-500'
      : status === 'connecting' || status === 'error'
        ? 'bg-yellow-400 animate-pulse'
        : 'bg-red-500';

  const statusText =
    status === 'live'
      ? 'Live'
      : status === 'connecting'
        ? 'Connecting…'
        : status === 'error'
          ? 'Reconnecting…'
          : 'Offline';

  return (
    <div
      className="relative bg-gray-900 rounded-lg overflow-hidden w-full h-full"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Video */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        crossOrigin="anonymous"
        muted
        playsInline
        autoPlay
      />

      {/* Connecting spinner */}
      {status === 'connecting' && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/60">
          <div className="w-7 h-7 border-2 border-gray-700 border-t-blue-500 rounded-full animate-spin" />
        </div>
      )}

      {/* Error / failed overlay */}
      {(status === 'error' || status === 'failed') && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gray-900/75">
          <span className="text-gray-400 text-xs">
            {status === 'error'
              ? `Reconnecting in ${RETRY_DELAY_MS / 1000}s…`
              : 'Stream unavailable'}
          </span>
          {status === 'failed' && (
            <button
              onClick={() => setRestartKey((k) => k + 1)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded-lg transition-colors"
            >
              <IconRefresh />
              Reconnect
            </button>
          )}
        </div>
      )}

      {/* Status dot (top-left) */}
      <div className="absolute top-2 left-2 flex items-center gap-1.5 pointer-events-none">
        <span className={`w-1.5 h-1.5 rounded-full block flex-none ${statusDot}`} />
        {hovered && (
          <span className="text-white/50 text-[10px] font-medium">{statusText}</span>
        )}
      </div>

      {/* Bottom gradient bar: label + controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent px-2.5 pt-6 pb-2 flex items-end justify-between">
        <span className="text-white text-xs font-medium drop-shadow-sm">{label}</span>

        {/* Controls — fade in on hover */}
        <div
          className={`flex items-center gap-2 transition-opacity duration-150 ${
            hovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Snapshot */}
          <button
            onClick={() => window.open(snapshotUrl, '_blank', 'noopener,noreferrer')}
            title="Open live snapshot"
            className="text-white/70 hover:text-white transition-colors"
          >
            <IconSnapshot />
          </button>

          {/* Mute toggle */}
          <button
            onClick={() => setMuted((m) => !m)}
            title={muted ? 'Unmute' : 'Mute'}
            className="text-white/70 hover:text-white transition-colors"
          >
            {muted ? <IconMute /> : <IconVolume />}
          </button>

          {/* Expand */}
          {onExpand && (
            <button
              onClick={onExpand}
              title="Expand"
              className="text-white/70 hover:text-white transition-colors"
            >
              <IconExpand />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
