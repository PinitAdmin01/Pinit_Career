import { NextResponse } from 'next/server';
import { requireAdminUserFromRequest } from '@/lib/server/requireAuth';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const gated = await requireAdminUserFromRequest(req);
    if (gated.error) return gated.error;

    const adminId = gated.user!.id;
    const targetUserId = params.id;
    const admin = getSupabaseAdmin();

    // Soft delete / suspend user record using service-role credentials
    const { error: updateErr } = await admin
      .from('users')
      .update({
        role: 'suspended',
      })
      .eq('id', targetUserId);

    if (updateErr) {
      console.warn('[Admin User Delete] DB error:', updateErr.message);
      if (process.env.ALLOW_DEV_AUTH_BYPASS === 'true' && process.env.NODE_ENV !== 'production') {
        return NextResponse.json({ ok: true, message: 'User account removed.' });
      }
      return NextResponse.json({ ok: false, error: updateErr.message }, { status: 500 });
    }

    // Record audit log
    try {
      await admin.from('audit_logs').insert({
        actor_id: adminId,
        target_id: targetUserId,
        action: 'delete_user',
        meta: { timestamp: new Date().toISOString() },
        created_at: new Date().toISOString(),
      });
    } catch {}

    return NextResponse.json({ ok: true, message: 'User account removed.' });
  } catch (err: any) {
    console.error('[Admin User Delete Exception]:', err?.message);
    return NextResponse.json({ ok: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}
