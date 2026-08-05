import { NextResponse } from 'next/server';
import { hrService } from '@/lib/services/hrService';

export async function GET(req: Request) {
  try {
    const data = await hrService.getStats();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
