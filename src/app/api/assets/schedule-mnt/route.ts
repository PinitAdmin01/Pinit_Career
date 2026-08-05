import { NextResponse } from 'next/server';
import { assetsService } from '@/lib/services/assetsService';

export async function POST(req: Request) {
  try {
    const { assetCode, issue, staff, scheduledDate } = await req.json();
    const result = await assetsService.scheduleMnt(assetCode, issue, staff, scheduledDate);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
