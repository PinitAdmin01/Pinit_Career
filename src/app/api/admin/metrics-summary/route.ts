import { NextResponse } from 'next/server';
import { requireAdminUserFromRequest } from '@/lib/server/requireAuth';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';

export async function GET(req: Request) {
  try {
    const gated = await requireAdminUserFromRequest(req);
    if (gated.error) return gated.error;

    const admin = getSupabaseAdmin();

    const { data: users, error } = await admin
      .from('users')
      .select('ats_score, trust_score, career_dna_score, mission_streak');

    if (error || !users || users.length === 0) {
      // Honest baseline when no users or database empty - ZERO invented 120 / 74 / 82 / 71 / 15 fallbacks
      return NextResponse.json({
        ok: true,
        summary: {
          totalUsers: 0,
          avgAts: 0,
          avgTrust: 0,
          avgDna: 0,
          activeStreaks: 0,
        },
      });
    }

    const count = users.length;
    let totalAts = 0;
    let totalTrust = 0;
    let totalDna = 0;
    let totalStreaks = 0;

    users.forEach((u: any) => {
      totalAts += Number(u.ats_score) || 0;
      totalTrust += Number(u.trust_score) || 0;
      totalDna += Number(u.career_dna_score) || 0;
      totalStreaks += Number(u.mission_streak) || 0;
    });

    return NextResponse.json({
      ok: true,
      summary: {
        totalUsers: count,
        avgAts: Math.round(totalAts / count),
        avgTrust: Math.round(totalTrust / count),
        avgDna: Math.round(totalDna / count),
        activeStreaks: Math.round(totalStreaks / count),
      },
    });
  } catch (err: any) {
    console.error('[Admin Metrics Summary Exception]:', err?.message);
    return NextResponse.json({
      ok: true,
      summary: { totalUsers: 0, avgAts: 0, avgTrust: 0, avgDna: 0, activeStreaks: 0 },
    });
  }
}
