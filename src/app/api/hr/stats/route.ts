import { NextResponse } from 'next/server';
import { hrService } from '@/lib/services/hrService';
import { requireAdminFromRequest } from '@/lib/server/requireAdmin';

export async function GET(req: Request) {
  try {
    const denied = await requireAdminFromRequest(req);
    if (denied) return denied;

    return NextResponse.json(
      { error: 'MODULE_DISABLED_PENDING_INTEGRATION', message: 'HR & Payroll module is disabled pending institutional HRMS and banking rails integration.' },
      { status: 503 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
