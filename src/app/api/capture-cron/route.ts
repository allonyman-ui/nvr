/**
 * Vercel Cron Job — daily at midnight.
 * vercel.json schedule: "0 0 * * *"
 *
 * Two phases:
 *  1. Per-camera capture — fetches a snapshot from each camera, runs a
 *     quick Claude description, stores the result in activity_events.
 *     This populates the event log even when no browser tab is open.
 *
 *  2. Daily synthesis   — passes all captured frames to intel-engine in
 *     'synthesis' mode, which produces a deep 24-hour intelligence review
 *     (patterns, insights, predictions) stored in ai_intel_log and sent
 *     to Telegram. This ensures the log keeps building and learning even
 *     when the app is completely unattended.
 */
import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createServerClient } from '@/lib/supabase';
import { getCamerasFromEnv } from '@/lib/nvr-config';
import { runIntelEngine, type EngineFrame } from '@/lib/intel-engine';

export const dynamic     = 'force-dynamic';
export const maxDuration = 60;

const ANTHROPIC_MODEL = 'claude-haiku-4-5-20251001';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET ?? ''}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const go2rtcBaseUrl = process.env.GO2RTC_BASE_URL;
  const apiKey        = process.env.ANTHROPIC_API_KEY;
  if (!go2rtcBaseUrl || !apiKey) {
    return NextResponse.json({ error: 'Missing env vars' }, { status: 500 });
  }

  const cameras  = getCamerasFromEnv();
  const supabase = createServerClient();
  const client   = new Anthropic({ apiKey });

  // ── Phase 1: per-camera capture → activity_events ─────────────────────
  const capturedFrames: EngineFrame[] = [];

  const captureResults = await Promise.allSettled(
    cameras.map(async (cam) => {
      const snapshotUrl = `${go2rtcBaseUrl}/api/frame.jpeg?src=${cam.streamName}`;
      const res = await fetch(snapshotUrl, { signal: AbortSignal.timeout(10_000) });
      if (!res.ok) return null;

      const buf    = await res.arrayBuffer();
      const base64 = Buffer.from(buf).toString('base64');

      // Quick single-camera description
      const resp = await client.messages.create({
        model:      ANTHROPIC_MODEL,
        max_tokens: 200,
        messages: [{
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: base64 } },
            { type: 'text',  text: `Security camera "${cam.name}". Describe what you see in 1 sentence. Are there any human faces? Reply as JSON: {"description":"...","hasFaces":bool,"faceCount":0}` },
          ],
        }],
      });

      const text  = resp.content[0]?.type === 'text' ? resp.content[0].text : '';
      const match = text.match(/\{[\s\S]*\}/);
      let description = 'Scheduled check — scene observed.';
      let hasFaces    = false;
      let faceCount   = 0;
      if (match) {
        try {
          const p = JSON.parse(match[0]) as { description?: string; hasFaces?: boolean; faceCount?: number };
          description = p.description ?? description;
          hasFaces    = p.hasFaces    ?? false;
          faceCount   = p.faceCount   ?? 0;
        } catch { /* ignore */ }
      }

      // Upload image
      const fileName = `${cam.streamName}/${Date.now()}-cron.jpg`;
      const { data: uploadData } = await supabase.storage
        .from('camera-captures')
        .upload(fileName, Buffer.from(buf), { contentType: 'image/jpeg' });

      await supabase.from('activity_events').insert({
        camera_name:  cam.name,
        description,
        motion_score: 0,
        has_faces:    hasFaces,
        face_count:   faceCount,
        image_path:   uploadData?.path ?? null,
      });

      // Collect frame for synthesis (reuse — no second go2rtc fetch)
      capturedFrames.push({ cameraName: cam.name, base64, changeScore: 0 });
      return cam.name;
    }),
  );

  const capturedCount = captureResults.filter((r) => r.status === 'fulfilled' && r.value != null).length;

  // ── Phase 2: daily synthesis → ai_intel_log ───────────────────────────
  // Uses 24h of events + last 50 intel entries + the frames just captured.
  // The engine writes the entry to ai_intel_log and sends a Telegram daily report.
  let synthEntry = null;
  let synthError: string | null = null;
  try {
    synthEntry = await runIntelEngine({
      frames:        capturedFrames,
      trigger:       'daily-synthesis',
      mode:          'synthesis',
      apiKey,
      supabase,
    });
  } catch (err) {
    synthError = String(err);
  }

  return NextResponse.json({
    ok:        true,
    cameras:   capturedCount,
    synthesis: synthEntry ? { id: synthEntry.id, patterns: synthEntry.patterns.length } : null,
    synthError,
  });
}
