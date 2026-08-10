import { NextResponse } from 'next/server';
import { eventsService } from '@/lib/services/eventsService';
import { requireUserFromRequest } from '@/lib/server/requireAuth';

export async function POST(req: Request) {
  try {
    const { eventId } = await req.json();
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;

    const studentId = gated.user!.id;
    const studentName = gated.user!.email || 'Student';

    const result = await eventsService.rsvp(studentId, studentName, eventId);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
