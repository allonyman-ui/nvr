import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import Anthropic from '@anthropic-ai/sdk';
import { isValidNvrSession } from '@/lib/nvr-auth';
import { getCamerasFromEnv } from '@/lib/nvr-config';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

interface EventData {
  camera_name: string;
  timestamp: string;
  description: string;
  motion_score: number;
  has_faces: boolean;
  face_count: number;
}

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const session = cookieStore.get('nvr_session')?.value ?? '';
  if (!isValidNvrSession(session)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 500 });
  }

  const go2rtcBaseUrl = process.env.GO2RTC_BASE_URL;

  const body = (await req.json().catch(() => ({}))) as { events?: EventData[]; hours?: number };
  const events: EventData[] = body.events ?? [];
  const hours = body.hours ?? 12;

  // ── 1. Fetch live snapshots from every camera ──────────────────────────
  const cameras = getCamerasFromEnv();
  const frameResults = go2rtcBaseUrl
    ? await Promise.allSettled(
        cameras.map(async (cam) => {
          const url = `${go2rtcBaseUrl}/api/frame.jpeg?src=${cam.streamName}`;
          const res = await fetch(url, { signal: AbortSignal.timeout(10_000) });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const buf = await res.arrayBuffer();
          return { cam, base64: Buffer.from(buf).toString('base64') };
        }),
      )
    : [];

  const frames = (frameResults as PromiseSettledResult<{ cam: (typeof cameras)[0]; base64: string }>[])
    .filter((r): r is PromiseFulfilledResult<{ cam: (typeof cameras)[0]; base64: string }> => r.status === 'fulfilled')
    .map((r) => r.value);

  // ── 2. Build Claude message content ───────────────────────────────────
  const faceEvents = events.filter((e) => e.has_faces);
  const totalPeople = events.reduce((sum, e) => sum + (e.face_count ?? 0), 0);
  const camNames = Array.from(new Set(events.map((e) => e.camera_name)));

  // Image blocks for each live frame
  const imageBlocks: Anthropic.MessageParam['content'] = frames.flatMap(({ cam, base64 }) => [
    {
      type: 'image' as const,
      source: { type: 'base64' as const, media_type: 'image/jpeg' as const, data: base64 },
    },
    { type: 'text' as const, text: `[Current snapshot — Camera: ${cam.name}]` },
  ]);

  // Event log text block
  const eventLogText =
    events.length === 0
      ? 'No motion events were recorded during this period.'
      : events
          .map((e) => {
            const time = new Date(e.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const faces = e.has_faces ? ` [${e.face_count} person${e.face_count !== 1 ? 's' : ''} visible]` : '';
            return `[${e.camera_name}] ${time}: ${e.description}${faces}`;
          })
          .join('\n');

  const statsText =
    events.length === 0
      ? 'No events recorded.'
      : `${events.length} total events, ${totalPeople} people spotted in ${faceEvents.length} events across cameras: ${camNames.join(', ')}.`;

  const hasImages = frames.length > 0;

  const promptText =
    `You are a home security analyst. ` +
    (hasImages
      ? `You can see ${frames.length} live camera snapshot${frames.length !== 1 ? 's' : ''} above. `
      : '') +
    `Here is the motion event log for the last ${hours} hour${hours !== 1 ? 's' : ''}:\n\n` +
    eventLogText +
    `\n\nStats: ${statsText}\n\n` +
    `Return ONLY valid JSON in this exact shape (no markdown, no extra text):\n` +
    `{\n` +
    `  "cameraStatus": [\n` +
    `    {"camera": "<name>", "status": "one sentence — what you see right now in the snapshot, or N/A if no snapshot"}\n` +
    `  ],\n` +
    `  "overview": "2–3 natural sentences summarising activity over the period",\n` +
    `  "highlights": ["key event 1", "key event 2", "...up to 5"],\n` +
    `  "timeline": [\n` +
    `    {"period": "Morning / Afternoon / Evening / Night or e.g. '9–10 AM'", "summary": "what happened"}\n` +
    `  ],\n` +
    `  "assessment": "One sentence overall security assessment"\n` +
    `}\n\n` +
    `Rules:\n` +
    `- cameraStatus MUST have one entry per camera snapshot shown above; if no snapshots, return an empty array\n` +
    `- Describe what you actually see in the snapshot (people, animals, vehicles, lighting conditions, empty room, etc.)\n` +
    `- For overview/highlights/timeline use natural language — no technical jargon, no "motion_score"\n` +
    `- Be specific about times; skip duplicate/trivial blips\n` +
    `- If no events happened, overview should still reflect what the cameras show right now\n` +
    `- timeline entries only for periods where something actually happened; empty array if nothing notable`;

  const client = new Anthropic({ apiKey });

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1400,
    messages: [
      {
        role: 'user',
        content: hasImages
          ? [...imageBlocks, { type: 'text' as const, text: promptText }]
          : [{ type: 'text' as const, text: promptText }],
      },
    ],
  });

  const raw = response.content[0]?.type === 'text' ? response.content[0].text.trim() : '';
  const jsonMatch = raw.match(/\{[\s\S]*\}/);

  const fallback = {
    cameraStatus: frames.map(({ cam }) => ({ camera: cam.name, status: 'Snapshot fetched — analysis unavailable.' })),
    overview: events.length === 0 ? 'No motion events detected during this period.' : raw,
    highlights: [] as string[],
    timeline: [] as Array<{ period: string; summary: string }>,
    assessment: '',
    period: `Last ${hours} hour${hours !== 1 ? 's' : ''}`,
    capturedAt: new Date().toISOString(),
    stats: { totalEvents: events.length, faceEvents: faceEvents.length, totalPeople, cameras: camNames.length },
  };

  if (!jsonMatch) return NextResponse.json(fallback);

  try {
    const parsed = JSON.parse(jsonMatch[0]) as {
      cameraStatus?: Array<{ camera: string; status: string }>;
      overview?: string;
      highlights?: string[];
      timeline?: Array<{ period: string; summary: string }>;
      assessment?: string;
    };
    return NextResponse.json({
      cameraStatus: parsed.cameraStatus ?? fallback.cameraStatus,
      overview: parsed.overview ?? '',
      highlights: parsed.highlights ?? [],
      timeline: parsed.timeline ?? [],
      assessment: parsed.assessment ?? '',
      period: `Last ${hours} hour${hours !== 1 ? 's' : ''}`,
      capturedAt: new Date().toISOString(),
      stats: { totalEvents: events.length, faceEvents: faceEvents.length, totalPeople, cameras: camNames.length },
    });
  } catch {
    return NextResponse.json(fallback);
  }
}
