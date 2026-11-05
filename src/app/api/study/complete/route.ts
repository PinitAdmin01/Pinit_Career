import { NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';
import { grantXp } from '@/lib/server/xpGrant';

export async function POST(req: Request) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error || !gated.user?.id) {
      return gated.error || NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const lessonId = String(body?.lessonId || 'study_session').trim();
    const admin = getSupabaseAdmin();
    const xpResult = await grantXp(admin, gated.user.id, 15, `[study] ${lessonId}`);

    return NextResponse.json({
      success: true,
      completedAt: new Date().toISOString(),
      lessonId,
      xpAwarded: xpResult.ok ? 15 : 0,
      newXp: xpResult.ok ? xpResult.newXp : undefined,
      pinsAwarded: 5,
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to record study completion', message: err?.message }, { status: 400 });
  }
}
