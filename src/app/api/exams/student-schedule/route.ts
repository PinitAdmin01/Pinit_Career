import { NextResponse } from 'next/server';
import { examsService } from '@/lib/services/examsService';

export async function GET(req: Request) {
  try {
    const schedule = await examsService.getStudentSchedule();
    return NextResponse.json(schedule);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
