import { NextResponse } from 'next/server';
import { assetsService } from '@/lib/services/assetsService';

export async function POST(req: Request) {
  try {
    const { amcId, expiryDate } = await req.json();
    const result = await assetsService.renewAmc(amcId, expiryDate);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
