import { NextRequest, NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';

export async function GET(req: NextRequest) {
  const gated = await requireUserFromRequest(req);
  const cookieUid = req.cookies?.get?.('pinit_uid')?.value;
  const userId = (!gated.error && gated.user?.id) ? gated.user.id : cookieUid;

  if (!userId) {
    return NextResponse.json({ ok: true, enrolled: false });
  }

  const admin = getSupabaseAdmin();
  if (admin) {
    try {
      const { data } = await admin
        .from('face_templates')
        .select('user_id')
        .eq('user_id', userId)
        .maybeSingle();
      if (data?.user_id) {
        return NextResponse.json({ ok: true, enrolled: true });
      }
    } catch {}
  }

  return NextResponse.json({ ok: true, enrolled: false });
}
