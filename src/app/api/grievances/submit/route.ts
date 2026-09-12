import { NextResponse } from 'next/server';
import { grievancesService } from '@/lib/services/grievancesService';
import { requireUserFromRequest } from '@/lib/server/requireAuth';

export async function POST(req: Request) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;

    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }

    const { reporterType = 'Student', category, title, description, anonymous = false } = body || {};
    if (!category || !title || !description) {
      return NextResponse.json({ error: 'Missing required grievance fields (category, title, description)' }, { status: 400 });
    }

    const studentId = gated.user!.id;
    const studentName = gated.user!.email || 'Student';

    const result = await grievancesService.submit(studentId, studentName, reporterType, category, title, description, Boolean(anonymous));
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
