import { NextResponse } from 'next/server';
import { hrService } from '@/lib/services/hrService';

export async function POST(req: Request) {
  try {
    const result = await hrService.runPayroll();
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
