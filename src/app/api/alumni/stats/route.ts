import { NextResponse } from 'next/server';
import { alumniService } from '@/lib/services/alumniService';

export async function GET(req: Request) {
  try {
    const data = await alumniService.getStats();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
