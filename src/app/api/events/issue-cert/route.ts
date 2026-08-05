import { NextResponse } from 'next/server';
import { eventsService } from '@/lib/services/eventsService';

export async function POST(req: Request) {
  try {
    const { rsvpId } = await req.json();
    const result = await eventsService.issueCert(rsvpId);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
