import { NextResponse } from 'next/server';
import { eventsService } from '@/lib/services/eventsService';

export async function POST(req: Request) {
  try {
    const { category, title, description, date, time, venue, capacity, host } = await req.json();
    const result = await eventsService.publish(category, title, description, date, time, venue, Number(capacity), host);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
