import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';

/**
 * OAuth2 Authorization endpoint.
 * Google redirects the user here when they tap "Link account" in Google Home.
 *
 * Flow:
 *   Google → GET /api/oauth/authorize?client_id=...&redirect_uri=...&state=...
 *     → Show login page (or auto-approve for personal use)
 *     → Redirect to redirect_uri?code=ONE_TIME_CODE&state=STATE
 */
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const clientId = searchParams.get('client_id');
  const redirectUri = searchParams.get('redirect_uri');
  const state = searchParams.get('state');

  if (clientId !== process.env.OAUTH_CLIENT_ID) {
    return NextResponse.json({ error: 'invalid_client' }, { status: 401 });
  }

  if (!redirectUri || !state) {
    return NextResponse.json({ error: 'invalid_request' }, { status: 400 });
  }

  // For a personal/family deployment we skip an interactive login page and
  // issue a one-time auth code immediately.  The code is stored in the
  // OAUTH_AUTH_CODE env var and can be exchanged exactly once.
  const authCode = randomBytes(16).toString('hex');

  // Store the code in a short-lived cookie so /api/oauth/token can verify it.
  const url = new URL(redirectUri);
  url.searchParams.set('code', authCode);
  url.searchParams.set('state', state);

  const res = NextResponse.redirect(url.toString());
  // Pass code to token endpoint via a secure, short-lived cookie
  res.cookies.set('nvr_auth_code', authCode, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 120, // 2 minutes — long enough for Google to exchange it
    path: '/api/oauth/token',
  });

  return res;
}
