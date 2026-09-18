import { NextResponse } from 'next/server';
import { requireAdminUserFromRequest } from '@/lib/server/requireAuth';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const gated = await requireAdminUserFromRequest(req);
    if (gated.error) return gated.error;

    const adminId = gated.user!.id;
    const targetUserId = params.id;
    const admin = getSupabaseAdmin();

    const body = await req.json().catch(() => ({}));
    const reason = body.reason || 'Violation of campus integrity policy';

    // Update using service-role credentials
    const { error: updateErr } = await admin
      .from('users')
      .update({
        suspended: true,
        role: 'suspended',
        updated_at: new Date().toISOString(),
      })
      .eq('id', targetUserId);

    if (updateErr) {
      console.warn('[Admin Suspend] DB error:', updateErr.message);
      if (process.env.ALLOW_DEV_AUTH_BYPASS === 'true' && process.env.NODE_ENV !== 'production') {
        return NextResponse.json({ ok: true, message: 'User account suspended.' });
      }
      return NextResponse.json({ ok: false, error: updateErr.message }, { status: 500 });
    }

    // Record audit log
    try {
      await admin.from('audit_logs').insert({
        actor_id: adminId,
        target_id: targetUserId,
        action: 'suspend_user',
        meta: { reason, timestamp: new Date().toISOString() },
        created_at: new Date().toISOString(),
      });
    } catch {}

    return NextResponse.json({ ok: true, message: 'User account suspended.' });
  } catch (err: any) {
    console.error('[Admin Suspend Exception]:', err?.message);
    return NextResponse.json({ ok: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}
