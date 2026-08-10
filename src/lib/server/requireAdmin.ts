import { NextResponse } from 'next/server';

const ADMIN_ROLES = new Set(['admin', 'superadmin']);

/**
 * Minimal gate for admin App Router handlers.
 * Rejects requests that lack an admin/superadmin role cookie.
 * (Cookie alone is not full auth — client router also enforces profile.role.)
 */
export function requireAdminFromRequest(req: Request): NextResponse | null {
  const cookie = req.headers.get('cookie') || '';
  const match = cookie.match(/(?:^|;\s*)pinit_role=([^;]+)/);
  const role = match ? decodeURIComponent(match[1].trim()) : '';
  const sessionActive = /(?:^|;\s*)pinit_session=active(?:;|$)/.test(cookie);

  if (!sessionActive || !ADMIN_ROLES.has(role)) {
    return NextResponse.json(
      { error: 'FORBIDDEN', message: 'Administrator access required.' },
      { status: 403 }
    );
  }
  return null;
}
