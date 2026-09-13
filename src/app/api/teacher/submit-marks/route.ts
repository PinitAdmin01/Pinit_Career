import { NextResponse } from 'next/server';
import { requireFacultyOrAdminUserFromRequest } from '@/lib/server/requireAuth';

export async function POST(req: Request) {
  try {
    const auth = await requireFacultyOrAdminUserFromRequest(req);
    if (auth.error) {
      return auth.error;
    }

    const body = await req.json();
    const { studentId, marks } = body;

    if (!studentId) {
      return NextResponse.json({ error: 'studentId is required' }, { status: 400 });
    }

    return NextResponse.json({
      ok: true,
      studentId,
      marks: marks || {},
      recordedBy: auth.user.id,
      timestamp: Date.now(),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
