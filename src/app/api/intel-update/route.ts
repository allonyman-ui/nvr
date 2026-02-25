/**
 * POST /api/intel-update  — browser hook (every 5 min with current frames)
 * GET  /api/intel-update  — Vercel cron (every hour, fetches own snapshots)
 *
 * Delegates to lib/intel-engine which handles smart event windowing,
 * deep-learning prompt, pattern accumulation, and Telegram alerts.
 *
 * Auth: NVR session cookie OR Authorization: Bearer <CRON_SECRET>
 */
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { isValidNvrSession } from '@/lib/nvr-auth';
import { createServerClient } from '@/lib/supabase';
import { getCamerasFromEnv } from '@/lib/nvr-config';
import { runIntelEngine, type EngineFrame } from '@/lib/intel-engine';

export const dynamic     = 'force-dynamic';
export const maxDuration = 60;

// GET — hourly Vercel cron
export async function GET(req: NextRequest) {
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET ?? ''}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return execute({ frames: [], trigger: 'cron', mode: 'regular' });
}

// POST — browser hook
export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const session     = cookieStore.get('nvr_session')?.value ?? '';
  const isCron      = req.headers.get('authorization') === `Bearer ${process.env.CRON_SECRET ?? ''}`;
  if (!isCron && !isValidNvrSession(session)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json().catch(() => ({})) as {
    frames?:  EngineFrame[];
    trigger?: string;
  };
  return execute({ frames: body.frames ?? [], trigger: body.trigger ?? 'scheduled', mode: 'regular' });
}

async function execute(input: { frames: EngineFrame[]; trigger: string; mode: 'regular' | 'synthesis' }) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return NextResponse.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 500 });

  try {
    const entry = await runIntelEngine({
      frames:         input.frames,
      trigger:        input.trigger,
      mode:           input.mode,
      apiKey,
      supabase:       createServerClient(),
      go2rtcBaseUrl:  process.env.GO2RTC_BASE_URL,
      cameras:        getCamerasFromEnv(),
    });
    return NextResponse.json({ ok: true, entry });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
