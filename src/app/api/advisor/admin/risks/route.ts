import { NextResponse } from 'next/server';
import { advisorService } from '@/lib/services/advisorService';

export async function GET(req: Request) {
  try {
    const data = await advisorService.getAtRiskStudents();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
