import { NextResponse } from 'next/server';
import { assetsService } from '@/lib/services/assetsService';

export async function POST(req: Request) {
  try {
    const { mntId } = await req.json();
    const result = await assetsService.completeMnt(mntId);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
