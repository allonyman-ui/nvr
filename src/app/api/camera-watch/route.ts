import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import Anthropic from '@anthropic-ai/sdk';
import { isValidNvrSession } from '@/lib/nvr-auth';
import { getCamerasFromEnv } from '@/lib/nvr-config';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export interface WatchEntry {
  camera: string;
  description: string;
  timestamp: string;
}

export async function POST(_req: NextRequest) {
  const cookieStore = await cookies();
  const session = cookieStore.get('nvr_session')?.value ?? '';
  if (!isValidNvrSession(session)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const go2rtcBaseUrl = process.env.GO2RTC_BASE_URL;
  if (!go2rtcBaseUrl) {
    return NextResponse.json({ error: 'GO2RTC_BASE_URL not configured' }, { status: 500 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 500 });
  }

  const cameras = getCamerasFromEnv();
  if (cameras.length === 0) {
    return NextResponse.json({ entries: [] });
  }

  // Fetch a JPEG snapshot from each camera in parallel
  const frameResults = await Promise.allSettled(
    cameras.map(async (cam) => {
      const url = `${go2rtcBaseUrl}/api/frame.jpeg?src=${cam.streamName}`;
      const res = await fetch(url, { signal: AbortSignal.timeout(10_000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = await res.arrayBuffer();
      return { cam, base64: Buffer.from(buf).toString('base64') };
    }),
  );

  const frames = frameResults
    .filter(
      (r): r is PromiseFulfilledResult<{ cam: (typeof cameras)[0]; base64: string }> =>
        r.status === 'fulfilled',
    )
    .map((r) => r.value);

  const timestamp = new Date().toISOString();

  if (frames.length === 0) {
    return NextResponse.json({
      entries: [
        { camera: 'System', description: 'Could not fetch any camera frames.', timestamp },
      ] as WatchEntry[],
    });
  }

  // Build a multi-image message: image + label for each camera, then the instruction
  const imageBlocks: Anthropic.MessageParam['content'] = frames.flatMap(({ cam, base64 }) => [
    {
      type: 'image' as const,
      source: { type: 'base64' as const, media_type: 'image/jpeg' as const, data: base64 },
    },
    { type: 'text' as const, text: `Camera: ${cam.name}` },
  ]);

  const instructionBlock: Anthropic.TextBlockParam = {
    type: 'text',
    text:
      `You are watching ${frames.length} security camera(s). ` +
      `For each camera shown above (in order), write one concise sentence describing what you observe. ` +
      `Focus on: people, animals, vehicles, movement, or unusual activity. ` +
      `Say "No activity detected" if the scene is empty. ` +
      `Reply ONLY with valid JSON in this exact shape, no markdown fences:\n` +
      `{"observations":[{"camera":"<exact camera name>","description":"<one sentence>"}]}`,
  };

  const client = new Anthropic({ apiKey });

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 512,
    messages: [{ role: 'user', content: [...imageBlocks, instructionBlock] }],
  });

  const rawText =
    response.content[0]?.type === 'text' ? response.content[0].text.trim() : '';

  let entries: WatchEntry[] = [];
  try {
    const jsonStr = rawText.replace(/^```[a-z]*\n?/i, '').replace(/\n?```$/i, '');
    const parsed = JSON.parse(jsonStr) as {
      observations: Array<{ camera: string; description: string }>;
    };
    entries = parsed.observations.map((obs) => ({ ...obs, timestamp }));
  } catch {
    entries = [{ camera: 'All Cameras', description: rawText, timestamp }];
  }

  return NextResponse.json({ entries });
}
