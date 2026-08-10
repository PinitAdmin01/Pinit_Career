import { NextResponse } from 'next/server';
import { servicesService } from '@/lib/services/servicesService';
import { requireUserFromRequest } from '@/lib/server/requireAuth';

export async function POST(req: Request) {
  try {
    const { startDate, endDate, reason, type } = await req.json();
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;

    const studentId = gated.user!.id;

    const result = await servicesService.applyLeave(studentId, startDate, endDate, reason, type);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
