import { NextResponse } from 'next/server';
import { servicesService } from '@/lib/services/servicesService';
import { requireAdminFromRequest } from '@/lib/server/requireAdmin';

export async function POST(req: Request) {
  try {
    const denied = await requireAdminFromRequest(req);
    if (denied) return denied;

    const { leaveId } = await req.json();
    const result = await servicesService.approveLeave(leaveId);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
