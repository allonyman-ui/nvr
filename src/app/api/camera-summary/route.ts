import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import Anthropic from '@anthropic-ai/sdk';
import { isValidNvrSession } from '@/lib/nvr-auth';
import { getCamerasFromEnv } from '@/lib/nvr-config';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

interface HistoryEntry {
  camera: string;
  description: string;
  timestamp: string;
}

export async function POST(req: NextRequest) {
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

  const body = (await req.json().catch(() => ({}))) as { historyEntries?: HistoryEntry[] };
  const historyEntries: HistoryEntry[] = body.historyEntries ?? [];

  const cameras = getCamerasFromEnv();

  // Fetch snapshots in parallel
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

  // Build history text
  let historySection = '';
  if (historyEntries.length > 0) {
    const grouped: Record<string, string[]> = {};
    for (const e of historyEntries) {
      const time = new Date(e.timestamp).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
      grouped[e.camera] = grouped[e.camera] ?? [];
      grouped[e.camera].push(`${time}: ${e.description}`);
    }
    historySection =
      '\n\nActivity log from the past 24 hours:\n' +
      Object.entries(grouped)
        .map(([cam, logs]) => `[${cam}]\n${logs.join('\n')}`)
        .join('\n\n');
  }

  // Build Claude message
  const imageBlocks: Anthropic.MessageParam['content'] = frames.flatMap(({ cam, base64 }) => [
    {
      type: 'image' as const,
      source: { type: 'base64' as const, media_type: 'image/jpeg' as const, data: base64 },
    },
    { type: 'text' as const, text: `Camera: ${cam.name}` },
  ]);

  const prompt =
    `You are a professional security analyst reviewing a private residential security system with ${frames.length} cameras.` +
    (historySection || '') +
    `\n\nBased on the current camera snapshots shown above and the activity log above (if provided), write a concise security summary report for the past 24 hours. ` +
    `Structure your response in plain text with these sections:\n` +
    `CURRENT STATUS\nBrief status of each camera right now.\n\n` +
    `24-HOUR SUMMARY\nOverall narrative of what happened across all cameras during the past 24 hours. If no history is available, note that monitoring just started.\n\n` +
    `NOTABLE EVENTS\nAny significant activity, unusual patterns, or things to be aware of. If nothing notable, say "All clear — no unusual activity detected."\n\n` +
    `Keep the tone professional but concise. No markdown formatting, just plain text with the section headings in ALL CAPS.`;

  const client = new Anthropic({ apiKey });

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 800,
    messages: [{ role: 'user', content: [...imageBlocks, { type: 'text', text: prompt }] }],
  });

  const summary =
    response.content[0]?.type === 'text' ? response.content[0].text.trim() : 'Unable to generate summary.';

  return NextResponse.json({ summary });
}
