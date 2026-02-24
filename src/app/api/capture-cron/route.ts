/**
 * Vercel Cron Job — runs every minute as a server-side backup capture.
 * vercel.json schedule: "* * * * *"
 *
 * This catches activity when no browser tab is open. The browser-side
 * useFrameCapture hook runs every 5 seconds when the app is open and
 * provides much finer granularity; this cron is just a safety net.
 */
import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createServerClient } from '@/lib/supabase';
import { getCamerasFromEnv } from '@/lib/nvr-config';

export const dynamic = 'force-dynamic';
export const maxDuration = 55;

const ANTHROPIC_MODEL = 'claude-haiku-4-5-20251001';

export async function GET(req: NextRequest) {
  // Vercel sends this header on cron invocations
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET ?? ''}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const go2rtcBaseUrl = process.env.GO2RTC_BASE_URL;
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!go2rtcBaseUrl || !apiKey) {
    return NextResponse.json({ error: 'Missing env vars' }, { status: 500 });
  }

  const cameras = getCamerasFromEnv();
  const supabase = createServerClient();
  const client = new Anthropic({ apiKey });

  const results = await Promise.allSettled(
    cameras.map(async (cam) => {
      const snapshotUrl = `${go2rtcBaseUrl}/api/frame.jpeg?src=${cam.streamName}`;
      const res = await fetch(snapshotUrl, { signal: AbortSignal.timeout(10_000) });
      if (!res.ok) return null;

      const buf = await res.arrayBuffer();
      const base64 = Buffer.from(buf).toString('base64');

      const prompt =
        `Security camera "${cam.name}". Describe what you see in 1 sentence. ` +
        `Are there any human faces? Reply as JSON: {"description":"...","hasFaces":bool,"faceCount":0}`;

      const resp = await client.messages.create({
        model: ANTHROPIC_MODEL,
        max_tokens: 200,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: base64 } },
              { type: 'text', text: prompt },
            ],
          },
        ],
      });

      const text = resp.content[0]?.type === 'text' ? resp.content[0].text : '';
      const match = text.match(/\{[\s\S]*\}/);
      let description = 'Scheduled check — scene observed.';
      let hasFaces = false;
      let faceCount = 0;
      if (match) {
        try {
          const p = JSON.parse(match[0]) as { description?: string; hasFaces?: boolean; faceCount?: number };
          description = p.description ?? description;
          hasFaces = p.hasFaces ?? false;
          faceCount = p.faceCount ?? 0;
        } catch { /* ignore */ }
      }

      // Upload image
      const fileName = `${cam.streamName}/${Date.now()}-cron.jpg`;
      const { data: uploadData } = await supabase.storage
        .from('camera-captures')
        .upload(fileName, Buffer.from(buf), { contentType: 'image/jpeg' });

      await supabase.from('activity_events').insert({
        camera_name: cam.name,
        description,
        motion_score: 0,   // cron has no motion score
        has_faces: hasFaces,
        face_count: faceCount,
        image_path: uploadData?.path ?? null,
      });

      return cam.name;
    }),
  );

  const succeeded = results.filter((r) => r.status === 'fulfilled').length;
  return NextResponse.json({ ok: true, cameras: succeeded });
}
