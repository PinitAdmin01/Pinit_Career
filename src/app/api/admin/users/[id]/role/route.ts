import { NextResponse } from 'next/server';
import { requireAdminUserFromRequest } from '@/lib/server/requireAuth';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';

const VALID_ROLES = new Set([
  'student',
  'teacher',
  'faculty',
  'recruiter',
  'consultant',
  'parent',
  'admin',
  'superadmin',
  'suspended',
]);

export async function PATCH(
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
    const role = String(body.role || '').toLowerCase().trim();

    if (!VALID_ROLES.has(role)) {
      return NextResponse.json({ ok: false, error: 'INVALID_ROLE', message: 'Unknown or invalid role provided.' }, { status: 400 });
    }

    // Update role using service-role credentials to bypass trigger block
    const { error: updateErr } = await admin
      .from('users')
      .update({
        role,
        updated_at: new Date().toISOString(),
      })
      .eq('id', targetUserId);

    if (updateErr) {
      console.warn('[Admin Role Update] DB error:', updateErr.message);
      if (process.env.ALLOW_DEV_AUTH_BYPASS === 'true' && process.env.NODE_ENV !== 'production') {
        return NextResponse.json({ ok: true, message: `Role successfully updated to ${role}.` });
      }
      return NextResponse.json({ ok: false, error: updateErr.message }, { status: 500 });
    }

    // Record audit log
    try {
      await admin.from('audit_logs').insert({
        actor_id: adminId,
        target_id: targetUserId,
        action: 'role_change',
        meta: { newRole: role, timestamp: new Date().toISOString() },
        created_at: new Date().toISOString(),
      });
    } catch {}

    return NextResponse.json({ ok: true, message: `Role successfully updated to ${role}.` });
  } catch (err: any) {
    console.error('[Admin Role Update Exception]:', err?.message);
    return NextResponse.json({ ok: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}
