import { NextResponse } from 'next/server';
import { documentsService } from '@/lib/services/documentsService';
import { requireUserFromRequest } from '@/lib/server/requireAuth';

export async function POST(req: Request) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;

    const { type, purpose, major, year } = await req.json();
    if (!purpose || typeof purpose !== 'string' || !purpose.trim()) {
      return NextResponse.json({ ok: false, error: 'Purpose is required' }, { status: 400 });
    }

    const result = await documentsService.requestDoc(gated.user.id, type, purpose.trim(), major, year);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
