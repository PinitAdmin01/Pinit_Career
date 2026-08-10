import { NextResponse } from 'next/server';
import { procurementService } from '@/lib/services/procurementService';
import { requireAdminFromRequest } from '@/lib/server/requireAdmin';

export async function POST(req: Request) {
  try {
    const denied = await requireAdminFromRequest(req);
    if (denied) return denied;

    const { item, qty, dept, cost } = await req.json();
    const result = await procurementService.createRequest(item, Number(qty), dept, Number(cost));
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
