import { NextResponse } from 'next/server';
import { hostelService } from '@/lib/services/hostelService';
import { requireUserFromRequest } from '@/lib/server/requireAuth';

export async function POST(req: Request) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;

    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'INVALID_PAYLOAD' }, { status: 400 });
    }

    const { type, roomCode } = body || {};

    const studentId = gated.user!.id;
    const studentName = gated.user!.email || 'Student';

    const result = await hostelService.logAttendance(studentId, studentName, type, roomCode);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
