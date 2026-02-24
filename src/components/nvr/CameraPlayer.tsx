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

function IconVolume() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 010 7.07" />
      <path d="M19.07 4.93a10 10 0 010 14.14" />
    </svg>
  );
}

function IconMute() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  );
}

function IconSnapshot() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

function IconExpand() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 3 21 3 21 9" />
      <polyline points="9 21 3 21 3 15" />
      <line x1="21" y1="3" x2="14" y2="10" />
      <line x1="3" y1="21" x2="10" y2="14" />
    </svg>
  );
}

function IconRefresh() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10" />
      <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
    </svg>
  );
}

function IconOffline() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/20">
      <path d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14" />
      <rect x="2" y="7" width="13" height="10" rx="2" />
      <line x1="2" y1="2" x2="22" y2="22" strokeWidth="1.75" />
    </svg>
  );
}

export default function CameraPlayer({ streamUrl, snapshotUrl, label, onExpand }: CameraPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState<Status>('connecting');
  const [muted, setMuted] = useState(true);
  const [restartKey, setRestartKey] = useState(0);
  const [hovered, setHovered] = useState(false);

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

      function onPlaying() {
        if (!destroyed) setStatus('live');
      }
      vid.addEventListener('playing', onPlaying, { once: true });

      const Hls = (await import('hls.js')).default;
      if (destroyed) { vid.removeEventListener('playing', onPlaying); return; }

      if (Hls.isSupported()) {
        hls = new Hls({
          lowLatencyMode: false,
          liveSyncDurationCount: 3,
          liveMaxLatencyDurationCount: 10,
          maxBufferLength: 30,
          manifestLoadingTimeOut: 20000,
          manifestLoadingMaxRetry: 4,
          levelLoadingTimeOut: 20000,
          levelLoadingMaxRetry: 6,
          fragLoadingTimeOut: 20000,
          fragLoadingMaxRetry: 6,
          fragLoadingRetryDelay: 1000,
          xhrSetup: (xhr: XMLHttpRequest) => { xhr.withCredentials = false; },
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
          hls?.destroy(); hls = null;
          if (retryCount < MAX_RETRIES) {
            retryCount += 1;
            setStatus('error');
            retryTimer = setTimeout(start, RETRY_DELAY_MS);
          } else {
            setStatus('failed');
          }
        });
      } else if (vid.canPlayType('application/vnd.apple.mpegurl')) {
        vid.src = streamUrl;
        vid.onerror = () => {
          if (destroyed) return;
          vid.removeEventListener('playing', onPlaying);
          if (retryCount < MAX_RETRIES) {
            retryCount += 1; setStatus('error');
            retryTimer = setTimeout(start, RETRY_DELAY_MS);
          } else { setStatus('failed'); }
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

  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = muted;
  }, [muted]);

  const isLive = status === 'live';
  const isConnecting = status === 'connecting' || status === 'error';
  const isFailed = status === 'failed';

  return (
    <div
      className="relative bg-[#0a0f18] rounded-xl overflow-hidden w-full h-full
                 ring-1 ring-white/[0.06] group"
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

      {/* Connecting overlay */}
      {isConnecting && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#0a0f18]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-6 h-6 border-2 border-white/10 border-t-blue-500
                            rounded-full animate-spin" />
            <span className="text-white/20 text-[10px] font-medium tracking-wider uppercase">
              {status === 'error' ? 'Reconnecting…' : 'Connecting'}
            </span>
          </div>
        </div>
      )}

      {/* Failed overlay */}
      {isFailed && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#0a0f18]">
          <IconOffline />
          <span className="text-white/25 text-[11px]">Stream unavailable</span>
          <button
            onClick={() => { setStatus('connecting'); setRestartKey((k) => k + 1); }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.06]
                       hover:bg-white/10 text-white/50 hover:text-white
                       text-[11px] rounded-lg transition-colors border border-white/10"
          >
            <IconRefresh />
            Reconnect
          </button>
        </div>
      )}

      {/* Status dot — visible on hover or when not live */}
      <div className={`absolute top-2.5 left-2.5 flex items-center gap-1.5 pointer-events-none
                       transition-opacity duration-200 ${hovered || !isLive ? 'opacity-100' : 'opacity-0'}`}>
        <span className={`w-1.5 h-1.5 rounded-full block flex-none ${
          isLive        ? 'bg-emerald-400' :
          isConnecting  ? 'bg-amber-400 animate-pulse' :
                          'bg-red-500'
        }`} />
        {hovered && (
          <span className="text-white/40 text-[10px] font-medium">
            {isLive       ? 'Live' :
             status === 'error' ? 'Reconnecting…' :
             isFailed     ? 'Offline' : 'Connecting…'}
          </span>
        )}
      </div>

      {/* Bottom gradient bar — label + controls, fade in on hover */}
      <div className={`absolute bottom-0 left-0 right-0 transition-opacity duration-200
                       bg-gradient-to-t from-black/80 via-black/20 to-transparent
                       px-2.5 pt-8 pb-2.5 flex items-end justify-between
                       ${hovered ? 'opacity-100' : 'opacity-0'}`}>
        <span className="text-white/80 text-[11px] font-medium tracking-wide drop-shadow">
          {label}
        </span>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => window.open(snapshotUrl, '_blank', 'noopener,noreferrer')}
            title="Open snapshot"
            className="text-white/45 hover:text-white transition-colors"
          >
            <IconSnapshot />
          </button>
          <button
            onClick={() => setMuted((m) => !m)}
            title={muted ? 'Unmute' : 'Mute'}
            className={`transition-colors ${
              muted ? 'text-white/35 hover:text-white/70' : 'text-blue-400 hover:text-blue-300'
            }`}
          >
            {muted ? <IconMute /> : <IconVolume />}
          </button>
          {onExpand && (
            <button onClick={onExpand} title="Expand"
              className="text-white/45 hover:text-white transition-colors">
              <IconExpand />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
