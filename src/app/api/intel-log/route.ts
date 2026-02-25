import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { isValidNvrSession } from '@/lib/nvr-auth';
import { createServerClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  if (!isValidNvrSession(cookieStore.get('nvr_session')?.value ?? '')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const limit  = Math.min(50, Math.max(1, Number(searchParams.get('limit')  ?? '20')));
  const offset = Math.max(0, Number(searchParams.get('offset') ?? '0'));

  const supabase = createServerClient();
  const { data, error, count } = await supabase
    .from('ai_intel_log')
    .select('*', { count: 'exact' })
    .order('timestamp', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ entries: data ?? [], total: count ?? 0 });
}
