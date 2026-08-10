import { NextResponse } from 'next/server';
import { eventsService } from '@/lib/services/eventsService';
import { requireAdminFromRequest } from '@/lib/server/requireAdmin';

export async function POST(req: Request) {
  try {
    const denied = await requireAdminFromRequest(req);
    if (denied) return denied;

    const { category, title, description, date, time, venue, capacity, host } = await req.json();
    const result = await eventsService.publish(category, title, description, date, time, venue, Number(capacity), host);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
