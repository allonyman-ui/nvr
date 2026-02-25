/**
 * GET /api/intel-debug — diagnostic check for the intel pipeline.
 * Verifies env vars, Supabase table existence, and row counts.
 * Requires valid session cookie.
 */
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { isValidNvrSession } from '@/lib/nvr-auth';
import { createServerClient } from '@/lib/supabase';
import { getCamerasFromEnv } from '@/lib/nvr-config';

export const dynamic = 'force-dynamic';

export interface DebugResult {
  ok: boolean;
  detail: string;
}

export async function GET() {
  const cookieStore = await cookies();
  if (!isValidNvrSession(cookieStore.get('nvr_session')?.value ?? '')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const checks: Record<string, DebugResult> = {};

  // ── Env vars ──────────────────────────────────────────────
  const apiKey = process.env.ANTHROPIC_API_KEY;
  checks.ANTHROPIC_API_KEY = {
    ok: !!apiKey,
    detail: apiKey
      ? `Set (${apiKey.slice(0, 12)}...)`
      : 'NOT SET — AI analysis will fail. Add ANTHROPIC_API_KEY to your Vercel env vars.',
  };

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  checks.SUPABASE_URL = {
    ok: !!supabaseUrl,
    detail: supabaseUrl ?? 'NOT SET — Add NEXT_PUBLIC_SUPABASE_URL to Vercel env vars.',
  };

  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  checks.SUPABASE_ANON_KEY = {
    ok: !!anonKey,
    detail: anonKey ? 'Set' : 'NOT SET — Add NEXT_PUBLIC_SUPABASE_ANON_KEY to Vercel env vars.',
  };

  const serviceKey = process.env.SUPABASE_SERVICE_KEY;
  checks.SUPABASE_SERVICE_KEY = {
    ok: true, // optional; falls back to anon key
    detail: serviceKey ? 'Set (service role)' : 'Not set — using anon key as fallback (RLS must be disabled)',
  };

  const go2rtcUrl = process.env.GO2RTC_BASE_URL;
  checks.GO2RTC_BASE_URL = {
    ok: true, // optional for intel; only needed for live snapshots
    detail: go2rtcUrl ?? 'Not set — intel works without it (no live camera snapshots)',
  };

  const cams = getCamerasFromEnv();
  checks.cameras = {
    ok: cams.length > 0,
    detail: cams.length > 0
      ? `${cams.length} camera(s): ${cams.map((c) => c.name).join(', ')}`
      : 'No cameras configured (CAM_1_NAME etc not set) — intel still works without cameras',
  };

  // ── Supabase connectivity ──────────────────────────────────
  if (!supabaseUrl || !anonKey) {
    checks.supabase_connectivity = { ok: false, detail: 'Cannot test — Supabase URL or key missing' };
    checks.activity_events_table = { ok: false, detail: 'Cannot test — Supabase not configured' };
    checks.ai_intel_log_table    = { ok: false, detail: 'Cannot test — Supabase not configured' };
  } else {
    const supabase = createServerClient();

    // Test activity_events table
    const { count: evCount, error: evErr } = await supabase
      .from('activity_events')
      .select('*', { count: 'exact', head: true });
    checks.activity_events_table = {
      ok: !evErr,
      detail: evErr
        ? `Error: ${evErr.message} — run supabase/schema.sql in your Supabase SQL Editor`
        : `Table OK — ${evCount ?? 0} event rows`,
    };

    // Test ai_intel_log table (most likely to be missing)
    const { count: intelCount, error: intelErr } = await supabase
      .from('ai_intel_log')
      .select('*', { count: 'exact', head: true });
    checks.ai_intel_log_table = {
      ok: !intelErr,
      detail: intelErr
        ? `Error: ${intelErr.message} — SOLUTION: run supabase/schema.sql in Supabase SQL Editor`
        : `Table OK — ${intelCount ?? 0} intel entries`,
    };

    // Test INSERT permission (try inserting a dummy row then deleting it)
    if (!intelErr) {
      const { data: testRow, error: insertErr } = await supabase
        .from('ai_intel_log')
        .insert({
          period_label:         '_debug_test',
          trigger:              'debug',
          summary:              '_debug',
          activity_lines:       [],
          change_from_previous: null,
          patterns:             [],
          anomalies:            [],
          camera_states:        {},
          total_events:         0,
          face_count:           0,
        })
        .select('id')
        .single();

      if (insertErr) {
        checks.ai_intel_log_insert = {
          ok: false,
          detail: `Insert failed: ${insertErr.message} — check RLS is disabled and service key is set`,
        };
      } else {
        // Clean up test row
        if (testRow?.id) {
          await supabase.from('ai_intel_log').delete().eq('id', testRow.id);
        }
        checks.ai_intel_log_insert = { ok: true, detail: 'Insert + delete test passed' };
      }
    }
  }

  const critical = ['ANTHROPIC_API_KEY', 'SUPABASE_URL', 'SUPABASE_ANON_KEY', 'ai_intel_log_table', 'ai_intel_log_insert'];
  const allCriticalOk = critical.every((k) => !checks[k] || checks[k].ok);

  return NextResponse.json({
    ok: allCriticalOk,
    checks,
    timestamp: new Date().toISOString(),
  });
}
