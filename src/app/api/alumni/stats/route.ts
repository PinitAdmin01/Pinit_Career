import { NextResponse } from 'next/server';
import { alumniService } from '@/lib/services/alumniService';
import { requireAdminFromRequest } from '@/lib/server/requireAdmin';

export async function GET(req: Request) {
  try {
    const denied = await requireAdminFromRequest(req);
    if (denied) return denied;

    return NextResponse.json(
      { error: 'MODULE_DISABLED_PENDING_INTEGRATION', message: 'Alumni module is disabled pending payment gateway and live notification integration.' },
      { status: 503 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
