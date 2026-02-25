/**
 * Intel Engine — shared intelligence analysis logic.
 *
 * Used by:
 *  - /api/intel-update  (browser hook every 5 min + hourly cron)
 *  - /api/capture-cron  (daily synthesis after frame capture)
 *
 * Two analysis modes:
 *  - 'regular'   — incremental update, covers events since the last entry
 *  - 'synthesis' — deep daily review, covers full 24h, heavier prompt
 *
 * Key improvements over the original inline approach:
 *  1. Smart event window  — always covers the gap since the last intel entry
 *     (not a fixed 30-min window that misses events when cron is delayed)
 *  2. Deeper history      — 25 entries for regular, 50 for synthesis
 *  3. Learning-focused    — prompt explicitly asks for CONFIRMED / NEW /
 *     INSIGHT / PREDICTION labels so patterns accumulate meaningfully
 *  4. Synthesis Telegram  — daily synthesis always posts to Telegram,
 *     not just on anomalies
 */
import Anthropic from '@anthropic-ai/sdk';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { IntelEntry } from './supabase';

const MODEL = 'claude-haiku-4-5-20251001';

export interface EngineFrame {
  cameraName:  string;
  base64:      string;
  changeScore: number;
}

export interface IntelEngineOptions {
  frames:          EngineFrame[];
  trigger:         string;   // 'scheduled' | 'cron' | 'daily-synthesis' | 'manual'
  mode:            'regular' | 'synthesis';
  apiKey:          string;
  supabase:        SupabaseClient;
  /** If provided and frames is empty, snapshots are fetched from here */
  go2rtcBaseUrl?:  string;
  cameras?:        Array<{ name: string; streamName: string }>;
}

// ── fetch snapshots server-side if needed ─────────────────────────────────

async function fetchSnapshots(
  go2rtcBaseUrl: string,
  cameras: Array<{ name: string; streamName: string }>,
): Promise<EngineFrame[]> {
  const results = await Promise.allSettled(
    cameras.map(async (cam) => {
      const res = await fetch(
        `${go2rtcBaseUrl}/api/frame.jpeg?src=${cam.streamName}`,
        { signal: AbortSignal.timeout(10_000) },
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = await res.arrayBuffer();
      return { cameraName: cam.name, base64: Buffer.from(buf).toString('base64'), changeScore: 0 };
    }),
  );
  return results
    .filter((r): r is PromiseFulfilledResult<EngineFrame> => r.status === 'fulfilled')
    .map((r) => r.value);
}

// ── main entry point ──────────────────────────────────────────────────────

export async function runIntelEngine(opts: IntelEngineOptions): Promise<IntelEntry> {
  const { trigger, mode, apiKey, supabase } = opts;
  const isSynthesis = mode === 'synthesis';

  let frames = opts.frames;

  // Fetch snapshots if not provided
  if (frames.length === 0 && opts.go2rtcBaseUrl && opts.cameras?.length) {
    frames = await fetchSnapshots(opts.go2rtcBaseUrl, opts.cameras);
  }

  // ── 1. Pull history (provides memory + smart event window) ────────────
  const historyLimit = isSynthesis ? 50 : 25;
  const { data: historyRows } = await supabase
    .from('ai_intel_log')
    .select('timestamp, period_label, trigger, summary, activity_lines, change_from_previous, patterns, anomalies, camera_states')
    .order('timestamp', { ascending: false })
    .limit(historyLimit);

  const history = ((historyRows ?? []) as Array<{
    timestamp: string; period_label: string; trigger: string;
    summary: string; activity_lines: string[]; change_from_previous: string | null;
    patterns: string[]; anomalies: string[]; camera_states: Record<string, string>;
  }>).reverse(); // oldest-first for the prompt

  // ── 2. Smart event window ─────────────────────────────────────────────
  // For regular: cover from the last entry timestamp (so no gaps), cap at 2h.
  // For synthesis: always cover the full 24 hours.
  const lastEntry    = history[history.length - 1];
  const maxLookbackMs = isSynthesis ? 24 * 60 * 60_000 : 2 * 60 * 60_000;

  const windowStart = isSynthesis
    ? new Date(Date.now() - 24 * 60 * 60_000).toISOString()
    : lastEntry
      ? new Date(
          Math.max(new Date(lastEntry.timestamp).getTime(), Date.now() - maxLookbackMs),
        ).toISOString()
      : new Date(Date.now() - 30 * 60_000).toISOString();

  const { data: eventRows } = await supabase
    .from('activity_events')
    .select('camera_name, timestamp, description, has_faces, face_count')
    .gte('timestamp', windowStart)
    .order('timestamp', { ascending: true })
    .limit(isSynthesis ? 500 : 200);

  const events = (eventRows ?? []) as Array<{
    camera_name: string; timestamp: string; description: string;
    has_faces: boolean; face_count: number;
  }>;

  // ── 3. Build prompt ───────────────────────────────────────────────────
  const now      = new Date();
  const nowLabel = now.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  const sinceLabel = lastEntry
    ? new Date(lastEntry.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    : 'start of logging';

  const eventsText =
    events.length === 0
      ? 'No motion events recorded in this window.'
      : events.map((e) => {
          const t     = new Date(e.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
          const faces = e.has_faces ? ` [${e.face_count} person${e.face_count !== 1 ? 's' : ''}]` : '';
          return `  ${t}  [${e.camera_name}]  ${e.description}${faces}`;
        }).join('\n');

  const historyText =
    history.length === 0
      ? '(No previous entries — this is the first intel entry.)'
      : history.map((h) => {
          const t          = new Date(h.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
          const isSynth    = h.trigger === 'daily-synthesis';
          const label      = isSynth ? `[SYNTHESIS — ${h.period_label}]` : `[${t}]`;
          const patternsStr = h.patterns.length > 0 ? `\n    Patterns: ${h.patterns.slice(0, 6).join(' | ')}` : '';
          const anomaliesStr = h.anomalies.length > 0 ? `\n    ⚠ ${h.anomalies.join(' | ')}` : '';
          const changeStr  = h.change_from_previous ? `\n    Δ ${h.change_from_previous}` : '';
          return `${label} ${h.summary}${changeStr}${patternsStr}${anomaliesStr}`;
        }).join('\n\n');

  // Image blocks
  const imageBlocks: Anthropic.MessageParam['content'] = frames.flatMap(({ cameraName, base64 }) => [
    { type: 'image' as const, source: { type: 'base64' as const, media_type: 'image/jpeg' as const, data: base64 } },
    { type: 'text' as const, text: `[Camera: ${cameraName}]` },
  ]);

  const jsonShape =
    `{\n` +
    `  "periodLabel": "${isSynthesis ? `Daily Synthesis — ${nowLabel}` : nowLabel}",\n` +
    `  "summary": "${isSynthesis ? '3-5 sentence daily narrative' : '2-3 sentence incremental narrative'}",\n` +
    `  "activityLines": ["HH:MM — description [Camera Name]", "...up to ${isSynthesis ? 20 : 12} lines"],\n` +
    `  "changeFromPrevious": "one sentence",\n` +
    `  "patterns": [\n` +
    `    "CONFIRMED: pattern — with frequency/time detail",\n` +
    `    "NEW: newly observed pattern",\n` +
    `    "INSIGHT: notable connection or observation",\n` +
    `    "PREDICTION: what to expect based on patterns"\n` +
    `  ],\n` +
    `  "anomalies": ["HH:MM — event — why it is unusual given the baseline"],\n` +
    `  "cameraStates": {"Camera Name": "what you see right now"}\n` +
    `}`;

  const taskInstructions = isSynthesis
    ? `=== DAILY SYNTHESIS TASK ===
This is a DEEP END-OF-DAY ANALYSIS, not a routine update. Cover the full 24-hour period.

1. DAILY SUMMARY: Narrate what happened today. Include hour-by-hour breakdown if significant activity occurred.
2. BEHAVIORAL PATTERNS: Identify with specific times and frequencies:
   - Who/what appears regularly and when (people, vehicles, animals)
   - Daily rhythms: arrivals, departures, deliveries
   - Changes or exceptions from prior patterns noted in history
   Label each: "CONFIRMED:", "NEW:", "INSIGHT:", or "PREDICTION:"
3. TOP INSIGHTS: 3 things learned TODAY that weren't previously known. Prefix: "INSIGHT:"
4. PREDICTIONS: What to expect in the next 24-48 hours. Prefix: "PREDICTION:"
5. ANOMALIES: What was genuinely unexpected today?

Return ONLY valid JSON:\n${jsonShape}`

    : `=== ANALYSIS TASK ===
Each entry must ADD new value — don't repeat what's known, BUILD on it.

1. CAMERA STATES: what is visible RIGHT NOW in each camera?
2. ACTIVITY LOG: specific events since ${sinceLabel} with exact times and camera names.
   Use times from the motion event log above — don't invent times.
3. CHANGE FROM PREVIOUS: one clear sentence — what meaningfully changed?
4. PATTERNS (most important): examine ALL history and identify:
   "CONFIRMED: X" — pattern seen again (add count/frequency)
   "NEW: X"        — pattern not previously noted
   "INSIGHT: X"    — notable connection across cameras or times
   "PREDICTION: X" — what is likely to happen next?
   Carry forward all patterns from previous entries. Don't drop them.
5. ANOMALIES: ONLY flag if genuinely unexpected vs. established baseline.
   Explain why it's unusual.

Return ONLY valid JSON:\n${jsonShape}`;

  const preText =
    `You are a home security intelligence system writing a PERMANENT surveillance log.\n` +
    `Entries are never deleted — you are building institutional memory over time.\n\n` +
    (isSynthesis
      ? `=== ALL MOTION EVENTS — PAST 24 HOURS ===\n${eventsText}\n\n`
      : `=== MOTION EVENTS SINCE ${sinceLabel.toUpperCase()} ===\n${eventsText}\n\n`) +
    `=== INTELLIGENCE HISTORY (${history.length} entries, oldest → newest) ===\n` +
    `[SYNTHESIS entries are deep daily reviews — give them extra weight]\n` +
    `${historyText}\n\n`;

  const snapshotIntro = frames.length > 0
    ? `=== CURRENT CAMERA SNAPSHOTS (${nowLabel}) ===\n` +
      `(These show the current moment only — use the event log for the historical analysis)\n`
    : '';

  const messageContent: Anthropic.MessageParam['content'] = frames.length > 0
    ? [
        { type: 'text' as const, text: preText + snapshotIntro },
        ...imageBlocks,
        { type: 'text' as const, text: taskInstructions },
      ]
    : [{ type: 'text' as const, text: preText + taskInstructions }];

  // ── 4. Call Claude ────────────────────────────────────────────────────
  const client = new Anthropic({ apiKey });
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: isSynthesis ? 2400 : 1800,
    messages: [{ role: 'user', content: messageContent }],
  });

  // ── 5. Parse response ─────────────────────────────────────────────────
  const raw       = response.content[0]?.type === 'text' ? response.content[0].text.trim() : '';
  const jsonMatch = raw.match(/\{[\s\S]*\}/);

  const totalFaces = events.reduce((s, e) => s + (e.face_count ?? 0), 0);

  let parsed = {
    periodLabel:        isSynthesis ? `Daily Synthesis — ${nowLabel}` : nowLabel,
    summary:            raw || 'Scene monitored.',
    activityLines:      [] as string[],
    changeFromPrevious: null as string | null,
    patterns:           [] as string[],
    anomalies:          [] as string[],
    cameraStates:       {} as Record<string, string>,
  };

  if (jsonMatch) {
    try {
      const p = JSON.parse(jsonMatch[0]) as typeof parsed;
      parsed = {
        periodLabel:        p.periodLabel        ?? parsed.periodLabel,
        summary:            p.summary            ?? parsed.summary,
        activityLines:      Array.isArray(p.activityLines)  ? p.activityLines  : [],
        changeFromPrevious: p.changeFromPrevious ?? null,
        patterns:           Array.isArray(p.patterns)       ? p.patterns       : [],
        anomalies:          Array.isArray(p.anomalies)      ? p.anomalies      : [],
        cameraStates:       p.cameraStates && typeof p.cameraStates === 'object' ? p.cameraStates : {},
      };
    } catch { /* use defaults */ }
  }

  // ── 6. Persist to ai_intel_log ────────────────────────────────────────
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

  if (insertError) throw new Error(insertError.message);

  const entry = inserted as IntelEntry;

  // ── 7. Telegram ───────────────────────────────────────────────────────
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId   = process.env.TELEGRAM_CHAT_ID;

  // Send on: anomaly detected (always) or daily synthesis (always)
  const shouldTelegram = botToken && chatId && (parsed.anomalies.length > 0 || isSynthesis);

  if (shouldTelegram) {
    const insights  = parsed.patterns.filter((p) => p.startsWith('INSIGHT:'));
    const predicted = parsed.patterns.filter((p) => p.startsWith('PREDICTION:'));
    const confirmed = parsed.patterns.filter((p) => p.startsWith('CONFIRMED:') || p.startsWith('NEW:'));

    const lines: string[] = isSynthesis
      ? [
          `🏠 <b>Daily Synthesis — ${now.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</b>`,
          `${events.length} events · ${totalFaces} people detected`,
          '',
          parsed.summary,
          ...(confirmed.length > 0     ? ['', '<b>Patterns:</b>',   ...confirmed.slice(0, 4).map((p) => `• ${p}`)]  : []),
          ...(insights.length > 0      ? ['', '<b>Insights:</b>',   ...insights.map((p) => `• ${p}`)]               : []),
          ...(predicted.length > 0     ? ['', '<b>Predictions:</b>', ...predicted.map((p) => `• ${p}`)]             : []),
          ...(parsed.anomalies.length > 0 ? ['', '<b>⚠ Anomalies:</b>', ...parsed.anomalies.map((a) => `• ${a}`)]   : []),
        ]
      : [
          `⚠️ <b>Security Alert — ${parsed.periodLabel}</b>`,
          '',
          ...parsed.anomalies.map((a) => `• ${a}`),
          '',
          `<i>${parsed.summary}</i>`,
        ];

    try {
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: lines.join('\n'), parse_mode: 'HTML' }),
      });
    } catch { /* ignore */ }
  }

  return entry;
}
