import { NextResponse } from 'next/server';
import { documentsService } from '@/lib/services/documentsService';
import { requireUserFromRequest } from '@/lib/server/requireAuth';

export async function GET(req: Request) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;
    const data = await documentsService.getStudentDocuments(gated.user.id);
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
