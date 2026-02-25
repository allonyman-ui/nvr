/**
 * POST /api/intel-update  — called by the browser hook every 5 minutes
 * GET  /api/intel-update  — called by Vercel cron every hour
 *
 * The core intelligence engine. Accepts current camera frames (from the
 * browser hook) or fetches them itself (when called as a cron job), then:
 *
 *  1. Fetches the last 30 min of activity_events from Supabase
 *  2. Fetches the last 10 ai_intel_log entries for context / memory
 *  3. Sends everything to Claude with a continuity-aware prompt
 *  4. Stores the resulting IntelEntry in ai_intel_log (never deleted)
 *  5. Optionally sends an anomaly alert to Telegram
 *
 * Auth: NVR session cookie (browser) OR Authorization: Bearer <CRON_SECRET>
 */
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import Anthropic from '@anthropic-ai/sdk';
import { createServerClient } from '@/lib/supabase';
import { isValidNvrSession } from '@/lib/nvr-auth';
import { getCamerasFromEnv } from '@/lib/nvr-config';
import type { IntelEntry } from '@/lib/supabase';

export const dynamic    = 'force-dynamic';
export const maxDuration = 60;

// GET — Vercel cron entry point (no request body, no frames)
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET ?? ''}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // Delegate to the shared logic with an empty body
  return runIntelUpdate({ frames: [], trigger: 'cron' }, req);
}

const MODEL = 'claude-haiku-4-5-20251001';

interface IncomingFrame {
  cameraName:  string;
  base64:      string;
  changeScore: number;
}

export async function POST(req: NextRequest) {
  // ── Auth ──────────────────────────────────────────────────────────────
  const authHeader  = req.headers.get('authorization');
  const cookieStore = await cookies();
  const session     = cookieStore.get('nvr_session')?.value ?? '';
  const isCron      = authHeader === `Bearer ${process.env.CRON_SECRET ?? ''}`;
  const isBrowser   = isValidNvrSession(session);

  if (!isCron && !isBrowser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json().catch(() => ({})) as {
    frames?:  IncomingFrame[];
    trigger?: string;
  };
  return runIntelUpdate(
    { frames: body.frames ?? [], trigger: body.trigger ?? 'scheduled' },
    req,
  );
}

// ── Shared logic ─────────────────────────────────────────────────────────

async function runIntelUpdate(
  input: { frames: IncomingFrame[]; trigger: string },
  _req: NextRequest,
): Promise<NextResponse> {
  const { trigger } = input;
  let frames: IncomingFrame[] = input.frames;

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 500 });
  }

  // When called as a cron job (or browser sent no frames), fetch them from go2rtc
  if (frames.length === 0) {
    const go2rtcBaseUrl = process.env.GO2RTC_BASE_URL;
    if (go2rtcBaseUrl) {
      const cameras = getCamerasFromEnv();
      const results = await Promise.allSettled(
        cameras.map(async (cam) => {
          const res = await fetch(
            `${go2rtcBaseUrl}/api/frame.jpeg?src=${cam.streamName}`,
            { signal: AbortSignal.timeout(10_000) },
          );
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const buf = await res.arrayBuffer();
          return {
            cameraName:  cam.name,
            base64:      Buffer.from(buf).toString('base64'),
            changeScore: 0,
          } satisfies IncomingFrame;
        }),
      );
      frames = results
        .filter((r): r is PromiseFulfilledResult<IncomingFrame> => r.status === 'fulfilled')
        .map((r) => r.value);
    }
  }

  // ── 1. Recent activity events (last 30 min) ───────────────────────────
  const supabase = createServerClient();
  const since30m = new Date(Date.now() - 30 * 60_000).toISOString();

  const { data: recentEvents } = await supabase
    .from('activity_events')
    .select('camera_name, timestamp, description, has_faces, face_count')
    .gte('timestamp', since30m)
    .order('timestamp', { ascending: true })
    .limit(200);

  const events = recentEvents ?? [];

  // ── 2. Last 10 intel entries (memory / context) ───────────────────────
  const { data: historyRows } = await supabase
    .from('ai_intel_log')
    .select('timestamp, period_label, summary, activity_lines, change_from_previous, patterns, anomalies, camera_states')
    .order('timestamp', { ascending: false })
    .limit(10);

  const history = (historyRows ?? []).reverse(); // oldest-first for the prompt

  // ── 3. Build Claude prompt ────────────────────────────────────────────
  const now      = new Date();
  const nowLabel = now.toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  const prevEntry = history[history.length - 1];
  const sinceLabel = prevEntry
    ? new Date(prevEntry.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    : '(first entry)';

  // Image blocks
  const imageBlocks: Anthropic.MessageParam['content'] = frames.flatMap(({ cameraName, base64 }) => [
    {
      type:   'image' as const,
      source: { type: 'base64' as const, media_type: 'image/jpeg' as const, data: base64 },
    },
    { type: 'text' as const, text: `[Camera: ${cameraName}]` },
  ]);

  // Recent events block
  const eventsText =
    events.length === 0
      ? 'No motion events in the last 30 minutes.'
      : events
          .map((e) => {
            const t     = new Date(e.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
            const faces = e.has_faces ? ` [${e.face_count} person${e.face_count !== 1 ? 's' : ''}]` : '';
            return `  ${t}  [${e.camera_name}]  ${e.description}${faces}`;
          })
          .join('\n');

  // History block
  const historyText =
    history.length === 0
      ? '(No previous intel entries — this is the first report.)'
      : history
          .map((h) => {
            const t        = new Date(h.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
            const patterns = (h.patterns as string[]).length > 0
              ? `\n    Patterns: ${(h.patterns as string[]).join(' | ')}`
              : '';
            const anomalies = (h.anomalies as string[]).length > 0
              ? `\n    ⚠ Anomalies: ${(h.anomalies as string[]).join(' | ')}`
              : '';
            const change = h.change_from_previous
              ? `\n    Changed: ${h.change_from_previous}`
              : '';
            return `[${t}] ${h.period_label}: ${h.summary}${change}${patterns}${anomalies}`;
          })
          .join('\n\n');

  const promptText =
    `You are a continuous home-security intelligence analyst. Your job is to maintain ` +
    `an ongoing, never-deleting surveillance log — like a human security guard writing shift notes.\n\n` +

    `=== CURRENT CAMERA SNAPSHOTS (${nowLabel}) ===\n` +
    `${frames.length === 0 ? '(No snapshots available)' : `${frames.length} camera(s) shown above — analyse each one.`}\n\n` +

    `=== MOTION EVENTS SINCE ${sinceLabel} ===\n` +
    `${eventsText}\n\n` +

    `=== PREVIOUS INTELLIGENCE HISTORY (oldest → newest, last 10 entries) ===\n` +
    `${historyText}\n\n` +

    `=== YOUR TASK ===\n` +
    `1. Describe what you see in each camera right now (people, vehicles, animals, lighting, activity).\n` +
    `2. Log what happened since the last report — include specific times and camera names.\n` +
    `3. Write "changeFromPrevious": one sentence describing what is different from the previous entry.\n` +
    `4. Based on ALL history entries, identify recurring patterns (e.g. "car leaves at 8am daily",` +
    ` "delivery on Tuesdays"). Update or confirm patterns you've already noted.\n` +
    `5. Flag anomalies — anything unusual for this time/day based on the established baseline.\n` +
    `6. Keep continuity — reference and build upon previous observations.\n\n` +

    `Return ONLY valid JSON — no markdown, no extra text:\n` +
    `{\n` +
    `  "periodLabel": "${nowLabel}",\n` +
    `  "summary": "2-3 sentence narrative of what happened since last report",\n` +
    `  "activityLines": [\n` +
    `    "HH:MM — description of event [Camera Name]",\n` +
    `    "...up to 10 lines"\n` +
    `  ],\n` +
    `  "changeFromPrevious": "one sentence — what is different from the previous intel entry",\n` +
    `  "patterns": [\n` +
    `    "pattern 1 — recurring observation with time/frequency detail",\n` +
    `    "...up to 8 patterns total across all history"\n` +
    `  ],\n` +
    `  "anomalies": [\n` +
    `    "anomaly description with time — why it is unusual",\n` +
    `    "...only real anomalies, empty array if everything is normal"\n` +
    `  ],\n` +
    `  "cameraStates": {\n` +
    `    "Camera Name": "one sentence describing exactly what you see right now",\n` +
    `    "...one entry per camera"\n` +
    `  }\n` +
    `}`;

  const client = new Anthropic({ apiKey });

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 1800,
    messages: [
      {
        role: 'user',
        content: frames.length > 0
          ? [...imageBlocks, { type: 'text' as const, text: promptText }]
          : [{ type: 'text' as const, text: promptText }],
      },
    ],
  });

  // ── 4. Parse response ─────────────────────────────────────────────────
  const raw       = response.content[0]?.type === 'text' ? response.content[0].text.trim() : '';
  const jsonMatch = raw.match(/\{[\s\S]*\}/);

  const totalFaces = events.reduce((s, e) => s + (e.face_count ?? 0), 0);

  let parsed = {
    periodLabel:         nowLabel,
    summary:             raw || 'Scene monitored — no notable activity.',
    activityLines:       [] as string[],
    changeFromPrevious:  null as string | null,
    patterns:            [] as string[],
    anomalies:           [] as string[],
    cameraStates:        {} as Record<string, string>,
  };

  if (jsonMatch) {
    try {
      const p = JSON.parse(jsonMatch[0]) as typeof parsed;
      parsed = {
        periodLabel:        p.periodLabel        ?? parsed.periodLabel,
        summary:            p.summary            ?? parsed.summary,
        activityLines:      Array.isArray(p.activityLines)      ? p.activityLines      : [],
        changeFromPrevious: p.changeFromPrevious ?? null,
        patterns:           Array.isArray(p.patterns)           ? p.patterns           : [],
        anomalies:          Array.isArray(p.anomalies)          ? p.anomalies          : [],
        cameraStates:       p.cameraStates && typeof p.cameraStates === 'object'
                              ? p.cameraStates : {},
      };
    } catch { /* use defaults */ }
  }

  // ── 5. Store in ai_intel_log ─────────────────────────────────────────
  const { data: inserted, error: insertError } = await supabase
    .from('ai_intel_log')
    .insert({
      period_label:         parsed.periodLabel,
      trigger,
      summary:              parsed.summary,
      activity_lines:       parsed.activityLines,
      change_from_previous: parsed.changeFromPrevious,
      patterns:             parsed.patterns,
      anomalies:            parsed.anomalies,
      camera_states:        parsed.cameraStates,
      total_events:         events.length,
      face_count:           totalFaces,
    })
    .select()
    .single();

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  const entry = inserted as IntelEntry;

  // ── 6. Telegram anomaly alert ─────────────────────────────────────────
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId   = process.env.TELEGRAM_CHAT_ID;
  let telegramSent = false;

  if (botToken && chatId && parsed.anomalies.length > 0) {
    const lines = [
      `⚠️ <b>Security Alert — ${parsed.periodLabel}</b>`,
      '',
      ...parsed.anomalies.map((a) => `• ${a}`),
      '',
      `<i>${parsed.summary}</i>`,
    ];
    try {
      const r = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: lines.join('\n'), parse_mode: 'HTML' }),
      });
      telegramSent = r.ok;
    } catch { /* ignore */ }
  }

  return NextResponse.json({ ok: true, entry, telegramSent });
}
