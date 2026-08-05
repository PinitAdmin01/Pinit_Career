import { NextResponse } from 'next/server';
import { assetsService } from '@/lib/services/assetsService';

export async function GET(req: Request) {
  try {
    const data = await assetsService.getStats();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
