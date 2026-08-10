import { NextResponse } from 'next/server';
import { libraryService } from '@/lib/services/libraryService';
import { requireUserFromRequest } from '@/lib/server/requireAuth';

export async function POST(req: Request) {
  try {
    const { isbn } = await req.json();
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;

    const studentId = gated.user!.id;
    const studentName = gated.user!.email || 'Student';

    const result = await libraryService.reserve(studentId, studentName, isbn);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
