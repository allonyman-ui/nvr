'use client';

/**
 * useSceneMonitor — replaces useFrameCapture.
 *
 * Two loops run in parallel:
 *  1. Every 5 s  — fetch all camera frames, compute pixel-diff motion score.
 *                  If motion exceeds threshold → POST to /api/analyze-frame.
 *                  Always store the latest full-res frame per camera in memory.
 *
 *  2. Every 5 min — POST all cached latest frames to /api/intel-update, which
 *                   generates a context-aware intelligence entry stored in
 *                   ai_intel_log (never deleted). Returns a new IntelEntry so
 *                   the dashboard can display it without an extra fetch.
 */

import { useCallback, useEffect, useRef, useState } from 'react';

interface Camera {
  id: string;
  name: string;
  streamName: string;
}

export interface SceneMonitorState {
  isCapturing: boolean;
  lastCapture: { camera: string; time: Date } | null;
  eventCount: number;
  intelUpdating: boolean;
  lastIntelAt: Date | null;
}

interface LatestFrame {
  base64: string;
  changeScore: number;
  timestamp: string;
}

const MOTION_INTERVAL_MS = 5_000;        // 5 s
const INTEL_INTERVAL_MS  = 5 * 60_000;  // 5 min
const MOTION_THRESHOLD   = 8;           // mean abs pixel diff / 255
const THUMB_SIZE         = 32;

// ── pixel helpers ─────────────────────────────────────────────────────────

function computeMotionScore(a: Uint8ClampedArray, b: Uint8ClampedArray): number {
  let sum = 0;
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i += 4) {
    sum += Math.abs(a[i]     - b[i]);
    sum += Math.abs(a[i + 1] - b[i + 1]);
    sum += Math.abs(a[i + 2] - b[i + 2]);
  }
  return sum / ((len / 4) * 3);
}

async function fetchFrame(
  url: string,
): Promise<{ pixels: Uint8ClampedArray; base64: string } | null> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8_000) });
    if (!res.ok) return null;
    const blob = await res.blob();

    const buf = await blob.arrayBuffer();
    const base64 = Buffer.from(buf).toString('base64');

    const bitmap = await createImageBitmap(blob, {
      resizeWidth: THUMB_SIZE,
      resizeHeight: THUMB_SIZE,
      resizeQuality: 'pixelated',
    });
    const canvas = new OffscreenCanvas(THUMB_SIZE, THUMB_SIZE);
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(bitmap, 0, 0);
    bitmap.close();
    const { data } = ctx.getImageData(0, 0, THUMB_SIZE, THUMB_SIZE);
    return { pixels: data, base64 };
  } catch {
    return null;
  }
}

// ── hook ──────────────────────────────────────────────────────────────────

export function useSceneMonitor(
  cameras: Camera[],
  go2rtcBaseUrl: string,
  enabled: boolean,
): SceneMonitorState {
  const [state, setState] = useState<SceneMonitorState>({
    isCapturing:   false,
    lastCapture:   null,
    eventCount:    0,
    intelUpdating: false,
    lastIntelAt:   null,
  });

  // Stable refs — no re-renders on change
  const prevPixels    = useRef<Map<string, Uint8ClampedArray>>(new Map());
  const latestFrames  = useRef<Map<string, LatestFrame>>(new Map());
  const motionInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const intelTimer     = useRef<ReturnType<typeof setTimeout>  | null>(null);
  const camerasRef     = useRef(cameras);
  camerasRef.current   = cameras;

  // ── intel update (every 5 min) ──────────────────────────────────────

  const triggerIntelUpdate = useCallback(async () => {
    const frames: Array<{ cameraName: string; base64: string; changeScore: number }> = [];
    latestFrames.current.forEach((f, camId) => {
      const cam = camerasRef.current.find((c) => c.id === camId);
      if (cam) frames.push({ cameraName: cam.name, base64: f.base64, changeScore: f.changeScore });
    });

    if (frames.length === 0) {
      // No frames yet — reschedule and bail
      intelTimer.current = setTimeout(() => void triggerIntelUpdate(), INTEL_INTERVAL_MS);
      return;
    }

    setState((s) => ({ ...s, intelUpdating: true }));
    try {
      await fetch('/api/intel-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ frames, trigger: 'scheduled' }),
      });
      setState((s) => ({ ...s, intelUpdating: false, lastIntelAt: new Date() }));
    } catch {
      setState((s) => ({ ...s, intelUpdating: false }));
    }

    intelTimer.current = setTimeout(() => void triggerIntelUpdate(), INTEL_INTERVAL_MS);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── motion capture (every 5 s) ───────────────────────────────────────

  const captureAll = useCallback(async () => {
    if (!go2rtcBaseUrl) return;
    const cams = camerasRef.current;

    await Promise.allSettled(
      cams.map(async (cam) => {
        const url = `${go2rtcBaseUrl}/api/frame.jpeg?src=${cam.streamName}`;
        const frame = await fetchFrame(url);
        if (!frame) return;

        const prev        = prevPixels.current.get(cam.id);
        const motionScore = prev ? computeMotionScore(frame.pixels, prev) : 0;
        prevPixels.current.set(cam.id, frame.pixels);

        // Always refresh latest frame (used by intel update)
        latestFrames.current.set(cam.id, {
          base64:      frame.base64,
          changeScore: motionScore,
          timestamp:   new Date().toISOString(),
        });

        if (prev && motionScore > MOTION_THRESHOLD) {
          try {
            await fetch('/api/analyze-frame', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                cameraName:  cam.name,
                imageBase64: frame.base64,
                motionScore: Math.round(motionScore * 10) / 10,
              }),
            });
            setState((s) => ({
              ...s,
              lastCapture: { camera: cam.name, time: new Date() },
              eventCount:  s.eventCount + 1,
            }));
          } catch { /* network error — ignore */ }
        }
      }),
    );
  }, [go2rtcBaseUrl]);

  // ── lifecycle ─────────────────────────────────────────────────────────

  useEffect(() => {
    if (!enabled) {
      setState((s) => ({ ...s, isCapturing: false }));
      if (motionInterval.current) clearInterval(motionInterval.current);
      if (intelTimer.current)    clearTimeout(intelTimer.current);
      return;
    }

    setState((s) => ({ ...s, isCapturing: true }));

    void captureAll(); // immediate first capture
    motionInterval.current = setInterval(() => void captureAll(), MOTION_INTERVAL_MS);

    // First intel update after 60 s — let frames + events accumulate first
    intelTimer.current = setTimeout(() => void triggerIntelUpdate(), 60_000);

    return () => {
      if (motionInterval.current) clearInterval(motionInterval.current);
      if (intelTimer.current)    clearTimeout(intelTimer.current);
    };
  }, [enabled, captureAll, triggerIntelUpdate]);

  return state;
}
