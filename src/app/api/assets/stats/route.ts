import { NextResponse } from 'next/server';
import { assetsService } from '@/lib/services/assetsService';
import { requireAdminFromRequest } from '@/lib/server/requireAdmin';

export async function GET(req: Request) {
  try {
    const denied = await requireAdminFromRequest(req);
    if (denied) return denied;

    return NextResponse.json(
      { error: 'MODULE_DISABLED_PENDING_INTEGRATION', message: 'Assets & Maintenance module is disabled pending hardware asset schema and physical verification integration.' },
      { status: 503 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
