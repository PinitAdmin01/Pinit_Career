import { NextResponse } from 'next/server';
import { documentsService } from '@/lib/services/documentsService';
import { requireAdminFromRequest } from '@/lib/server/requireAdmin';

export async function POST(req: Request) {
  try {
    const denied = await requireAdminFromRequest(req);
    if (denied) return denied;

    const { requestId } = await req.json();
    const result = await documentsService.approveDoc(requestId);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
