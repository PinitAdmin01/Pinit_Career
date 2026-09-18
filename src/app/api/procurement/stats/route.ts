import { NextResponse } from 'next/server';
import { procurementService } from '@/lib/services/procurementService';
import { requireAdminFromRequest } from '@/lib/server/requireAdmin';

export async function GET(req: Request) {
  try {
    const denied = await requireAdminFromRequest(req);
    if (denied) return denied;

    return NextResponse.json(
      { error: 'MODULE_DISABLED_PENDING_INTEGRATION', message: 'Procurement module is disabled pending production inventory schema and vendor dispatch contracts.' },
      { status: 503 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
