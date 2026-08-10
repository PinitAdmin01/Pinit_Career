import { NextResponse } from 'next/server';
import { procurementService } from '@/lib/services/procurementService';
import { requireAdminFromRequest } from '@/lib/server/requireAdmin';

export async function POST(req: Request) {
  try {
    const denied = await requireAdminFromRequest(req);
    if (denied) return denied;

    const { requestId, vendorName } = await req.json();
    const result = await procurementService.issuePo(requestId, vendorName);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
