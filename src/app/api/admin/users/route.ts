import { NextResponse } from 'next/server';
import { adminService } from '@/lib/services/adminService';
import { requireAdminFromRequest } from '@/lib/server/requireAdmin';
import { appendFileSync } from 'fs';
import { join } from 'path';

export async function GET(req: Request) {
  try {
    const denied = requireAdminFromRequest(req);
    // #region agent log
    try {
      appendFileSync(
        join(process.cwd(), 'debug-ea5c88.log'),
        JSON.stringify({
          sessionId: 'ea5c88',
          runId: 'post-fix',
          hypothesisId: 'D',
          location: 'api/admin/users/route.ts:GET',
          message: denied ? 'admin users rejected' : 'admin users allowed',
          data: {
            denied: !!denied,
            authBypass: false,
          },
          timestamp: Date.now(),
        }) + '\n'
      );
    } catch {}
    // #endregion
    if (denied) return denied;

    const data = await adminService.getUsers();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
