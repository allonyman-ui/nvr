import { NextRequest, NextResponse } from 'next/server';

/**
 * OAuth2 Token endpoint.
 * Google calls this to exchange an auth code for an access token.
 *
 * POST /api/oauth/token
 *   Body: grant_type=authorization_code&code=...&client_id=...&client_secret=...&redirect_uri=...
 *
 * Returns:
 *   { access_token, token_type, expires_in }
 */
export async function POST(req: NextRequest) {
  const contentType = req.headers.get('content-type') ?? '';
  let params: URLSearchParams;

  if (contentType.includes('application/x-www-form-urlencoded')) {
    const text = await req.text();
    params = new URLSearchParams(text);
  } else {
    const body = (await req.json()) as Record<string, string>;
    params = new URLSearchParams(body);
  }

  const grantType = params.get('grant_type');
  const clientId = params.get('client_id');
  const clientSecret = params.get('client_secret');
  const code = params.get('code');

  // Validate client credentials
  if (
    clientId !== process.env.OAUTH_CLIENT_ID ||
    clientSecret !== process.env.OAUTH_CLIENT_SECRET
  ) {
    return NextResponse.json({ error: 'invalid_client' }, { status: 401 });
  }

  if (grantType === 'authorization_code') {
    // Verify the code matches what the authorize endpoint set in the cookie.
    // Google sends the code it received; we compare it to the stored cookie.
    const cookieCode = req.cookies.get('nvr_auth_code')?.value;

    if (!code || !cookieCode || code !== cookieCode) {
      return NextResponse.json({ error: 'invalid_grant' }, { status: 400 });
    }

    // Return the static access token stored in env
    return NextResponse.json({
      access_token: process.env.OAUTH_ACCESS_TOKEN,
      token_type: 'Bearer',
      expires_in: 315360000, // 10 years — effectively never expires for personal use
    });
  }

  if (grantType === 'refresh_token') {
    // We issued a single long-lived token; just re-validate and return it
    const refreshToken = params.get('refresh_token');
    if (refreshToken !== process.env.OAUTH_ACCESS_TOKEN) {
      return NextResponse.json({ error: 'invalid_grant' }, { status: 400 });
    }
    return NextResponse.json({
      access_token: process.env.OAUTH_ACCESS_TOKEN,
      token_type: 'Bearer',
      expires_in: 315360000,
    });
  }

  return NextResponse.json({ error: 'unsupported_grant_type' }, { status: 400 });
}
