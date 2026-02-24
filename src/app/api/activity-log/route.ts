import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { isValidNvrSession } from '@/lib/nvr-auth';
import { createServerClient, type ActivityEvent } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

const SIGN_EXPIRY_SECONDS = 3600;

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  if (!isValidNvrSession(cookieStore.get('nvr_session')?.value ?? '')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const hours = Math.min(24, Math.max(1, Number(searchParams.get('hours') ?? '12')));
  const hasFacesOnly = searchParams.get('faces') === '1';
  const limit = Math.min(200, Math.max(10, Number(searchParams.get('limit') ?? '100')));

  const supabase = createServerClient();
  const since = new Date(Date.now() - hours * 3600 * 1000).toISOString();

  let q = supabase
    .from('activity_events')
    .select('*')
    .gte('timestamp', since)
    .order('timestamp', { ascending: false })
    .limit(limit);

  if (hasFacesOnly) q = q.eq('has_faces', true);

  const { data, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Generate signed URLs for images
  const events: ActivityEvent[] = await Promise.all(
    (data ?? []).map(async (row) => {
      let image_url: string | null = null;
      if (row.image_path) {
        const { data: signed } = await supabase.storage
          .from('camera-captures')
          .createSignedUrl(row.image_path, SIGN_EXPIRY_SECONDS);
        image_url = signed?.signedUrl ?? null;
      }
      return {
        id: row.id,
        camera_name: row.camera_name,
        timestamp: row.timestamp,
        description: row.description,
        motion_score: row.motion_score ?? 0,
        has_faces: row.has_faces ?? false,
        image_url,
        face_crops: row.face_crops ?? [],
      };
    }),
  );

  return NextResponse.json({ events });
}

export async function DELETE(req: NextRequest) {
  const cookieStore = await cookies();
  if (!isValidNvrSession(cookieStore.get('nvr_session')?.value ?? '')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const supabase = createServerClient();
  const { error } = await supabase.from('activity_events').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
