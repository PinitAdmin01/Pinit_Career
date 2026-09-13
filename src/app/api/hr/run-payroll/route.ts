import { NextResponse } from 'next/server';
import { hrService } from '@/lib/services/hrService';
import { requireAdminFromRequest } from '@/lib/server/requireAdmin';
import { checkRateLimit, getClientIp } from '@/lib/server/rateLimit';

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const rl = checkRateLimit(`payroll_${ip}`, { limit: 3, windowMs: 3_600_000 });
    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'RATE_LIMIT', message: 'Too many payroll requests. Max 3 per hour.' },
        { status: 429, headers: { 'Retry-After': String(rl.resetSec) } }
      );
    }

    const denied = await requireAdminFromRequest(req);
    if (denied) return denied;

    // Idempotency: only one payroll run per calendar month
    const now = new Date();
    const periodKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    // Check if payroll already run this month (using Supabase if configured)
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const { createClient } = await import('@supabase/supabase-js');
      const supa = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      );
      const { data: existing } = await supa
        .from('payroll_runs')
        .select('id')
        .eq('period_key', periodKey)
        .maybeSingle();

      if (existing) {
        return NextResponse.json(
          { error: 'ALREADY_RUN', message: `Payroll already processed for ${periodKey}. Contact finance to override.` },
          { status: 409 }
        );
      }

      const result = await hrService.runPayroll();

      // Log the run
      await supa.from('payroll_runs').insert({ period_key: periodKey, run_at: now.toISOString() });
      return NextResponse.json(result);
    }

    const result = await hrService.runPayroll();
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
