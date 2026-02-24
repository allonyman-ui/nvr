'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface Camera {
  id: string;
  name: string;
  streamName: string;
}

interface FrameCaptureState {
  isCapturing: boolean;
  lastCapture: { camera: string; time: Date } | null;
  eventCount: number;
}

const CAPTURE_INTERVAL_MS = 5000;
const MOTION_THRESHOLD = 8; // mean absolute pixel diff out of 255
const THUMB_SIZE = 32;

// Returns mean absolute pixel difference between two Uint8ClampedArrays (RGBA)
function computeMotionScore(a: Uint8ClampedArray, b: Uint8ClampedArray): number {
  let sum = 0;
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i += 4) {
    sum += Math.abs(a[i] - b[i]);       // R
    sum += Math.abs(a[i + 1] - b[i + 1]); // G
    sum += Math.abs(a[i + 2] - b[i + 2]); // B
  }
  return sum / ((len / 4) * 3);
}

async function fetchFramePixels(
  url: string,
): Promise<{ pixels: Uint8ClampedArray; base64: string } | null> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return null;
    const blob = await res.blob();

    // Get base64 of the full image
    const buf = await blob.arrayBuffer();
    const base64 = Buffer.from(buf).toString('base64');

    // Draw to small canvas for pixel comparison
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

export function useFrameCapture(
  cameras: Camera[],
  go2rtcBaseUrl: string,
  enabled: boolean,
): FrameCaptureState {
  const [state, setState] = useState<FrameCaptureState>({
    isCapturing: false,
    lastCapture: null,
    eventCount: 0,
  });

  // previousPixels keyed by camera id
  const previousPixels = useRef<Map<string, Uint8ClampedArray>>(new Map());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const camerasRef = useRef(cameras);
  camerasRef.current = cameras;

  const captureAll = useCallback(async () => {
    if (!go2rtcBaseUrl) return;
    const cams = camerasRef.current;

    await Promise.allSettled(
      cams.map(async (cam) => {
        const snapshotUrl = `${go2rtcBaseUrl}/api/frame.jpeg?src=${cam.streamName}`;
        const frame = await fetchFramePixels(snapshotUrl);
        if (!frame) return;

        const prev = previousPixels.current.get(cam.id);
        const motionScore = prev ? computeMotionScore(frame.pixels, prev) : 0;
        previousPixels.current.set(cam.id, frame.pixels);

        if (prev && motionScore > MOTION_THRESHOLD) {
          // Motion detected — send to server for AI analysis
          try {
            await fetch('/api/analyze-frame', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                cameraName: cam.name,
                imageBase64: frame.base64,
                motionScore: Math.round(motionScore * 10) / 10,
              }),
            });
            setState((s) => ({
              ...s,
              lastCapture: { camera: cam.name, time: new Date() },
              eventCount: s.eventCount + 1,
            }));
          } catch {
            // Network error — ignore
          }
        }
      }),
    );
  }, [go2rtcBaseUrl]);

  useEffect(() => {
    if (!enabled) {
      setState((s) => ({ ...s, isCapturing: false }));
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    setState((s) => ({ ...s, isCapturing: true }));
    void captureAll(); // immediate first capture
    intervalRef.current = setInterval(() => void captureAll(), CAPTURE_INTERVAL_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [enabled, captureAll]);

  return state;
}
