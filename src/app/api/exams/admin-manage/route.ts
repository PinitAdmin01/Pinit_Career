import { NextResponse } from 'next/server';
import { examsService } from '@/lib/services/examsService';
import { requireAdminFromRequest } from '@/lib/server/requireAdmin';

export async function GET(req: Request) {
  try {
    const denied = await requireAdminFromRequest(req);
    if (denied) return denied;

    const [schedules, submissions] = await Promise.all([
      examsService.getAllSchedules(),
      examsService.getExamSubmissions()
    ]);

    return NextResponse.json({ schedules, submissions });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const denied = await requireAdminFromRequest(req);
    if (denied) return denied;

    const body = await req.json().catch(() => ({}));
    if (!body?.title) {
      return NextResponse.json({ error: 'Exam title is required' }, { status: 400 });
    }

    const created = await examsService.createExamSchedule(body);
    return NextResponse.json({ ok: true, schedule: created });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const denied = await requireAdminFromRequest(req);
    if (denied) return denied;

    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Exam ID is required' }, { status: 400 });
    }

    const result = await examsService.deleteExamSchedule(id);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
