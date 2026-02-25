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

  const hasImages = frames.length > 0;

  // ── 2. Build Claude message content ───────────────────────────────────
  //
  // IMPORTANT prompt architecture: the event log is the primary source of
  // truth for the "overview" field. Camera snapshots show the CURRENT state
  // only — they must not override the historical event log in the analysis.
  // We frame the instructions BEFORE the images so Claude reads them first.

  const faceEvents = events.filter((e) => e.has_faces);
  const totalPeople = events.reduce((sum, e) => sum + (e.face_count ?? 0), 0);
  const camNames = Array.from(new Set(events.map((e) => e.camera_name)));

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

  // Pre-image framing: tell Claude what it's about to see and how to use it
  const preImageText =
    `You are a home security analyst producing a summary report.\n\n` +
    `=== ACTIVITY EVENT LOG — Last ${hours} hour${hours !== 1 ? 's' : ''} ===\n` +
    `(This is the authoritative record of what happened. Base your overview and timeline on this log.)\n\n` +
    `${eventLogText}\n\n` +
    `Stats: ${statsText}\n\n` +
    (hasImages
      ? `=== CURRENT CAMERA SNAPSHOTS ===\n` +
        `(These show what cameras look like RIGHT NOW — they do NOT represent the full history period.\n` +
        `Do NOT conclude "no activity" from a currently-quiet snapshot if the event log shows otherwise.)\n`
      : '');

  // Post-image analysis request
  const postImageText =
    `=== YOUR TASK ===\n` +
    `Return ONLY valid JSON in this exact shape (no markdown, no extra text):\n` +
    `{\n` +
    `  "cameraStatus": [\n` +
    `    {"camera": "<name>", "status": "what you see RIGHT NOW in the snapshot"}\n` +
    `  ],\n` +
    `  "overview": "2–3 sentences summarising what HAPPENED during the ${hours}h period (from the event log, not the snapshots)",\n` +
    `  "highlights": ["key event 1 with time", "key event 2", "...up to 5"],\n` +
    `  "timeline": [\n` +
    `    {"period": "HH:MM–HH:MM or Morning/Afternoon/Evening", "summary": "what happened"}\n` +
    `  ],\n` +
    `  "assessment": "One sentence overall security assessment based on the event log"\n` +
    `}\n\n` +
    `Rules:\n` +
    `- overview MUST reflect the activity event log above — if there were ${events.length} events, describe them\n` +
    `- cameraStatus describes the current snapshot only (what you see NOW)\n` +
    `- highlights and timeline come from the event log with specific times\n` +
    `- If events list is empty, only then say there was no activity\n` +
    `- timeline: only include periods where something happened`;

  // Image blocks for each live frame
  const imageBlocks: Anthropic.MessageParam['content'] = frames.flatMap(({ cam, base64 }) => [
    {
      type: 'image' as const,
      source: { type: 'base64' as const, media_type: 'image/jpeg' as const, data: base64 },
    },
    { type: 'text' as const, text: `[Current snapshot — Camera: ${cam.name}]` },
  ]);

  const messageContent: Anthropic.MessageParam['content'] = hasImages
    ? [
        { type: 'text' as const, text: preImageText },
        ...imageBlocks,
        { type: 'text' as const, text: postImageText },
      ]
    : [{ type: 'text' as const, text: preImageText + postImageText }];

  const client = new Anthropic({ apiKey });

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1400,
    messages: [{ role: 'user', content: messageContent }],
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
