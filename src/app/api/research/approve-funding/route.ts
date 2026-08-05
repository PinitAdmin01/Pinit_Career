import { NextResponse } from 'next/server';
import { researchService } from '@/lib/services/researchService';

export async function POST(req: Request) {
  try {
    const { fundingId } = await req.json();
    const result = await researchService.approveFunding(fundingId);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
