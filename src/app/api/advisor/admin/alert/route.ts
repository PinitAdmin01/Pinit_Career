import { NextResponse } from 'next/server';
import { advisorService } from '@/lib/services/advisorService';

export async function POST(req: Request) {
  try {
    const { studentId, message } = await req.json();
    const result = await advisorService.sendAlert(studentId, message);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
