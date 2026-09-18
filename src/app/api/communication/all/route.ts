import { NextResponse } from 'next/server';
import { communicationService } from '@/lib/services/communicationService';

export async function GET() {
  try {
    const data = await communicationService.getAll();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
