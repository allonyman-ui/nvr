import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { isValidNvrSession } from '@/lib/nvr-auth';
import { createServerClient, type KnownPerson } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

async function auth() {
  const cookieStore = await cookies();
  return isValidNvrSession(cookieStore.get('nvr_session')?.value ?? '');
}

const SIGN_EXPIRY = 3600;

async function withSignedPhoto(
  supabase: ReturnType<typeof createServerClient>,
  person: Record<string, unknown>,
): Promise<KnownPerson> {
  let photo_url: string | null = null;
  if (person.photo_path) {
    const { data } = await supabase.storage
      .from('face-crops')
      .createSignedUrl(person.photo_path as string, SIGN_EXPIRY);
    photo_url = data?.signedUrl ?? null;
  }
  return {
    id: person.id as string,
    name: person.name as string,
    photo_url,
    added_at: person.added_at as string,
    last_seen_at: person.last_seen_at as string | null,
    seen_count: (person.seen_count as number) ?? 0,
  };
}

export async function GET() {
  if (!(await auth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('known_people')
    .select('*')
    .order('name');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const people = await Promise.all((data ?? []).map((p) => withSignedPhoto(supabase, p)));
  return NextResponse.json({ people });
}

export async function POST(req: NextRequest) {
  if (!(await auth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const supabase = createServerClient();

  const body = (await req.json()) as { name: string; photoBase64?: string };
  const { name, photoBase64 } = body;
  if (!name?.trim()) return NextResponse.json({ error: 'Name required' }, { status: 400 });

  let photo_path: string | null = null;
  if (photoBase64) {
    const buf = Buffer.from(photoBase64, 'base64');
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;
    const { data, error } = await supabase.storage
      .from('face-crops')
      .upload(path, buf, { contentType: 'image/jpeg' });
    if (!error) photo_path = data?.path ?? null;
  }

  const { data, error } = await supabase
    .from('known_people')
    .insert({ name: name.trim(), photo_path })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const person = await withSignedPhoto(supabase, data as Record<string, unknown>);
  return NextResponse.json({ person });
}

export async function PATCH(req: NextRequest) {
  if (!(await auth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const supabase = createServerClient();

  const body = (await req.json()) as { id: string; name?: string; photoBase64?: string };
  const { id, name, photoBase64 } = body;
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

  const updates: Record<string, unknown> = {};
  if (name) updates.name = name.trim();
  if (photoBase64) {
    const buf = Buffer.from(photoBase64, 'base64');
    const path = `${id}-${Date.now()}.jpg`;
    const { data } = await supabase.storage
      .from('face-crops')
      .upload(path, buf, { contentType: 'image/jpeg', upsert: true });
    if (data) updates.photo_path = data.path;
  }

  const { data, error } = await supabase
    .from('known_people')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const person = await withSignedPhoto(supabase, data as Record<string, unknown>);
  return NextResponse.json({ person });
}

export async function DELETE(req: NextRequest) {
  if (!(await auth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

  const supabase = createServerClient();
  const { error } = await supabase.from('known_people').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
