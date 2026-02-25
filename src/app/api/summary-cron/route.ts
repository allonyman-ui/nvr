/**
 * Hourly cron — generates a 24-hour AI summary and optionally posts it to Telegram.
 * vercel.json schedule: "0 * * * *"
 */
import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createServerClient } from '@/lib/supabase';
import { getCamerasFromEnv } from '@/lib/nvr-config';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET ?? ''}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 500 });
  }

  // ── 1. Fetch last 24h events from Supabase ──────────────────────────────
  const supabase = createServerClient();
  const since = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
  const { data, error } = await supabase
    .from('activity_events')
    .select('camera_name, timestamp, description, motion_score, has_faces, face_count')
    .gte('timestamp', since)
    .order('timestamp', { ascending: false })
    .limit(500);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const events = data ?? [];

  // ── 2. Fetch live camera snapshots (if GO2RTC_BASE_URL is set) ──────────
  const go2rtcBaseUrl = process.env.GO2RTC_BASE_URL;
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

  const frames = (
    frameResults as PromiseSettledResult<{ cam: (typeof cameras)[0]; base64: string }>[]
  )
    .filter(
      (r): r is PromiseFulfilledResult<{ cam: (typeof cameras)[0]; base64: string }> =>
        r.status === 'fulfilled',
    )
    .map((r) => r.value);

  // ── 3. Build Claude prompt ────────────────────────────────────────────
  const faceEvents = events.filter((e) => e.has_faces);
  const totalPeople = events.reduce((sum, e) => sum + (e.face_count ?? 0), 0);
  const camNames = Array.from(new Set(events.map((e) => e.camera_name)));

  const imageBlocks: Anthropic.MessageParam['content'] = frames.flatMap(({ cam, base64 }) => [
    { type: 'image' as const, source: { type: 'base64' as const, media_type: 'image/jpeg' as const, data: base64 } },
    { type: 'text' as const, text: `[Current snapshot — Camera: ${cam.name}]` },
  ]);

  const eventLogText =
    events.length === 0
      ? 'No motion events were recorded during this period.'
      : events
          .slice(0, 300)
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
    (hasImages ? `You can see ${frames.length} live camera snapshot${frames.length !== 1 ? 's' : ''} above. ` : '') +
    `Here is the motion event log for the last 24 hours:\n\n` +
    eventLogText +
    `\n\nStats: ${statsText}\n\n` +
    `Return ONLY valid JSON:\n` +
    `{"overview":"2-3 sentence summary","highlights":["up to 5 key events"],"assessment":"one sentence security assessment"}`;

  const client = new Anthropic({ apiKey });
  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 800,
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

  let overview = events.length === 0 ? 'No activity detected in the last 24 hours.' : raw;
  let highlights: string[] = [];
  let assessment = '';

  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[0]) as {
        overview?: string;
        highlights?: string[];
        assessment?: string;
      };
      overview = parsed.overview ?? overview;
      highlights = parsed.highlights ?? [];
      assessment = parsed.assessment ?? '';
    } catch { /* use defaults */ }
  }

  // ── 4. Send to Telegram if configured ────────────────────────────────
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  let telegramSent = false;

  if (botToken && chatId) {
    const now = new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    const lines: string[] = [
      `<b>🏠 Security Summary — ${now}</b>`,
      `<b>Last 24 hours</b> · ${events.length} events · ${totalPeople} people`,
      '',
      overview,
    ];
    if (highlights.length > 0) {
      lines.push('', '<b>Highlights:</b>');
      highlights.forEach((h) => lines.push(`• ${h}`));
    }
    if (assessment) {
      lines.push('', `<i>${assessment}</i>`);
    }

    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    try {
      const tgRes = await fetch(telegramUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: lines.join('\n'), parse_mode: 'HTML' }),
      });
      telegramSent = tgRes.ok;
    } catch { /* ignore */ }
  }

  return NextResponse.json({
    ok: true,
    overview,
    highlights,
    assessment,
    stats: { totalEvents: events.length, faceEvents: faceEvents.length, totalPeople, cameras: camNames.length },
    telegramSent,
  });
}
