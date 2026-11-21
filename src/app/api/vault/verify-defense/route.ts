import { NextResponse } from 'next/server';
import { requireUserFromRequest, getBearerToken, getAuthoritativeSupabaseClient } from '@/lib/server/requireAuth';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';

/**
 * POST /api/vault/verify-defense
 * Authoritatively settles a Brutal Vault Credential Defense interview:
 * - Passed -> sets vault_items.verified = true, +5 Trust Score, adds claimed skills to users.skill_tags
 * - Failed -> sets vault_items.verified = false, -5 Trust Score (fake/unsubstantiated credential claim)
 */
export async function POST(req: Request) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;

    const userId = gated.user!.id;
    const token = getBearerToken(req);
    const admin = getSupabaseAdmin();
    const db = admin || getAuthoritativeSupabaseClient(token);

    const body = await req.json().catch(() => ({}));
    const docId = typeof body?.docId === 'string' ? body.docId.trim() : '';
    const passed = Boolean(body?.passed);
    const score = Math.max(0, Math.min(100, Math.round(Number(body?.score) || (passed ? 75 : 25))));
    const auditorName = typeof body?.auditorName === 'string' ? body.auditorName.trim() : 'Credential Auditor';
    const claimedSkills: string[] = Array.isArray(body?.claimedSkills)
      ? body.claimedSkills.map((s: any) => String(s || '').trim()).filter(Boolean)
      : [];

    if (docId) {
      try {
        await db
          .from('vault_items')
          .update({
            verified: passed,
            ai_confidence_score: score,
            used_in_portfolio: passed,
            endorsement_note: passed
              ? `Verified via Brutal Defense Interview with ${auditorName} (${score}/100)`
              : `Rejected in Skill Defense Interview with ${auditorName} (${score}/100) — Claims Unsubstantiated`,
            verified_at: passed ? new Date().toISOString() : null,
          })
          .eq('id', docId)
          .eq('user_id', userId);
      } catch (vErr) {
        console.warn('[vault/verify-defense] vault_items update warning:', vErr);
      }
    }

    let nextTrust = 50;
    let nextSkillTags: string[] = [];

    try {
      const { data: userRow } = await db
        .from('users')
        .select('trust_score, skill_tags')
        .eq('id', userId)
        .maybeSingle();

      const rawTrust = userRow?.trust_score;
      const baseTrust = typeof rawTrust === 'number' && Number.isFinite(rawTrust)
        ? (rawTrust === 40 || rawTrust === 0 ? 50 : rawTrust)
        : 50;

      nextTrust = passed
        ? Math.min(100, baseTrust + 5)
        : Math.max(0, baseTrust - 5);

      const existingSkills: string[] = Array.isArray(userRow?.skill_tags) ? userRow.skill_tags : [];
      if (passed && claimedSkills.length > 0) {
        const mergedMap = new Map<string, string>();
        for (const s of [...existingSkills, ...claimedSkills]) {
          const clean = String(s || '').trim();
          if (clean) mergedMap.set(clean.toLowerCase(), clean);
        }
        nextSkillTags = Array.from(mergedMap.values());
      } else {
        nextSkillTags = existingSkills;
      }

      await db
        .from('users')
        .update({
          trust_score: nextTrust,
          ...(passed ? { skill_tags: nextSkillTags } : {}),
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);
    } catch (uErr) {
      console.warn('[vault/verify-defense] users update warning:', uErr);
    }

    try {
      await db.from('audit_logs').insert({
        actor_id: userId,
        target_id: docId || userId,
        action: passed ? 'VAULT_DEFENSE_PASSED' : 'VAULT_DEFENSE_FAILED',
        meta: { docId, passed, score, auditorName, claimedSkills, newTrust: nextTrust },
        created_at: new Date().toISOString(),
      });
    } catch {}

    return NextResponse.json({
      ok: true,
      passed,
      score,
      trustDelta: passed ? 5 : -5,
      trustScore: nextTrust,
      skillTags: nextSkillTags,
    });
  } catch (err: any) {
    console.error('[vault/verify-defense] Fatal error:', err);
    return NextResponse.json({ error: err?.message || 'Verification settlement failed' }, { status: 500 });
  }
}
