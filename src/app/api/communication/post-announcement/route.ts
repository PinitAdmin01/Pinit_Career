import { NextResponse } from 'next/server';
import { communicationService } from '@/lib/services/communicationService';

export async function POST(req: Request) {
  try {
    const { title, message, category } = await req.json();
    const result = await communicationService.logCommunication('announcement', title, message, category);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
