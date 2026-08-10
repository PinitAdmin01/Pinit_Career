import { NextResponse } from 'next/server';
import { assetsService } from '@/lib/services/assetsService';
import { requireAdminFromRequest } from '@/lib/server/requireAdmin';

export async function POST(req: Request) {
  try {
    const denied = await requireAdminFromRequest(req);
    if (denied) return denied;

    const { assetCode, issue, staff, scheduledDate } = await req.json();
    const result = await assetsService.scheduleMnt(assetCode, issue, staff, scheduledDate);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
