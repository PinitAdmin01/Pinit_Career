import { NextResponse } from 'next/server';
import { adminService } from '@/lib/services/adminService';
import { requireAdminFromRequest } from '@/lib/server/requireAdmin';

export async function GET(req: Request) {
  try {
    const denied = requireAdminFromRequest(req);
    if (denied) return denied;
    const data = await adminService.getDashboard();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
