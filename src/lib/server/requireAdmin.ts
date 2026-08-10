import { NextResponse } from 'next/server';
import { requireAdminUserFromRequest } from '@/lib/server/requireAuth';

/**
 * @deprecated Prefer requireAdminUserFromRequest (JWT + DB role).
 * Kept for temporary compatibility; now delegates to JWT verification
 * and no longer trusts forgeable pinit_role cookies alone.
 */
export async function requireAdminFromRequest(req: Request): Promise<NextResponse | null> {
  const result = await requireAdminUserFromRequest(req);
  return result.error;
}
