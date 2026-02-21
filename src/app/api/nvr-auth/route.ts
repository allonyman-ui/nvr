import { NextRequest, NextResponse } from 'next/server';
import { getNvrSessionToken } from '@/lib/nvr-auth';

const COOKIE = 'nvr_session';
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export async function POST(req: NextRequest) {
  let body: { password?: string } = {};
  try {
    body = (await req.json()) as { password?: string };
  } catch {
    /* ignore parse errors */
  }

  const envPassword = process.env.NVR_DASHBOARD_PASSWORD;
  if (!envPassword || body.password !== envPassword) {
    return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, getNvrSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: MAX_AGE,
    path: '/',
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, '', { maxAge: 0, path: '/' });
  return res;
}
