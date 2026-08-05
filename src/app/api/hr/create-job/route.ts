import { NextResponse } from 'next/server';
import { hrService } from '@/lib/services/hrService';

export async function POST(req: Request) {
  try {
    const { title, dept } = await req.json();
    const result = await hrService.createJob(title, dept);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
