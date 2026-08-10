import { NextResponse } from 'next/server';
import { grievancesService } from '@/lib/services/grievancesService';
import { requireAdminFromRequest } from '@/lib/server/requireAdmin';

export async function POST(req: Request) {
  try {
    const denied = await requireAdminFromRequest(req);
    if (denied) return denied;

    const { complaintId, resolution } = await req.json();
    const result = await grievancesService.resolve(complaintId, resolution);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
