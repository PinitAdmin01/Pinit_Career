import { NextResponse } from 'next/server';
import { requireAdminUserFromRequest } from '@/lib/server/requireAuth';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';

export async function GET(req: Request) {
  try {
    const gated = await requireAdminUserFromRequest(req);
    if (gated.error) return gated.error;

    const admin = getSupabaseAdmin();

    const { data: alerts, error } = await admin
      .from('campus_fraud_alerts')
      .select('*')
      .order('timestamp', { ascending: false });

    if (error) {
      console.warn('[Admin Fraud Alerts] DB notice:', error.message);
      return NextResponse.json({
        ok: true,
        alerts: [],
        highTabSwitches: [],
        suspiciousScores: [],
      });
    }

    const allAlerts = alerts || [];
    const highTabSwitches = allAlerts.filter((a: any) => (a.tab_switches || 0) > 3);
    const suspiciousScores = allAlerts.filter((a: any) => a.severity === 'high');

    return NextResponse.json({
      ok: true,
      alerts: allAlerts,
      highTabSwitches,
      suspiciousScores,
    });
  } catch (err: any) {
    console.error('[Admin Fraud Alerts Exception]:', err?.message);
    return NextResponse.json({ ok: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}
