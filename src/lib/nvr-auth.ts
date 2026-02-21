import { createHash } from 'crypto';

/**
 * Derives a stateless session token from the dashboard password.
 * Stored in an httpOnly cookie — if the password changes, all sessions invalidate.
 */
export function getNvrSessionToken(): string {
  const pw = process.env.NVR_DASHBOARD_PASSWORD;
  if (!pw) return '';
  return createHash('sha256').update(`nvr-session:${pw}`).digest('hex');
}

export function isValidNvrSession(token: string): boolean {
  const expected = getNvrSessionToken();
  return Boolean(expected) && Boolean(token) && token === expected;
}
