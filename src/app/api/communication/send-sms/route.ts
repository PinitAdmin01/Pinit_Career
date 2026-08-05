import { NextResponse } from 'next/server';
import { communicationService } from '@/lib/services/communicationService';

export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    const result = await communicationService.logCommunication('sms', undefined, text, 'General');
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
