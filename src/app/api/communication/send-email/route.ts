import { NextResponse } from 'next/server';
import { communicationService } from '@/lib/services/communicationService';
import { requireAdminFromRequest } from '@/lib/server/requireAdmin';

export async function POST(req: Request) {
  try {
    const denied = await requireAdminFromRequest(req);
    if (denied) return denied;

    const { subject, body } = await req.json();
    const result = await communicationService.logCommunication('email', subject, body, 'General');
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
