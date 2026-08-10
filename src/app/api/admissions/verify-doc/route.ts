import { NextResponse } from 'next/server';
import { admissionsService } from '@/lib/services/admissionsService';
import { requireAdminFromRequest } from '@/lib/server/requireAdmin';

export async function POST(req: Request) {
  try {
    const denied = await requireAdminFromRequest(req);
    if (denied) return denied;

    const { id, action } = await req.json();
    const result = await admissionsService.verifyDoc(id, action);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
