import { NextResponse } from 'next/server';
import { communicationService } from '@/lib/services/communicationService';
import { requireAdminFromRequest } from '@/lib/server/requireAdmin';

export async function POST(req: Request) {
  try {
    const denied = await requireAdminFromRequest(req);
    if (denied) return denied;

    const { title, message, category } = await req.json();
    const result = await communicationService.logCommunication('announcement', title, message, category);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
