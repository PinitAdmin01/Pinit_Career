import { NextResponse } from 'next/server';
import { adminService } from '@/lib/services/adminService';
import { requireAdminUserFromRequest } from '@/lib/server/requireAuth';

export async function POST(req: Request) {
  try {
    const gated = await requireAdminUserFromRequest(req);
    if (gated.error || !gated.user) return gated.error;

    const { title, message, type, targetRole } = await req.json();
    const result = await adminService.broadcast(gated.user.id, title, message, type, targetRole);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
