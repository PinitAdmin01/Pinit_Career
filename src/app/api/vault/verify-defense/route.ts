import { NextResponse } from 'next/server';
import { requireUserFromRequest, getBearerToken, getAuthoritativeSupabaseClient } from '@/lib/server/requireAuth';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';

const DEFAULT_PITCH_PLACEHOLDER = 'add a short professional pitch about your skills and goals.';

function buildAutoVerifiedPitch(skillTags: string[], targetRole?: string): string {
  const topSkills = skillTags.slice(0, 8);
  const roleLabel = targetRole && targetRole.trim() ? targetRole.trim() : 'Software & Technology Candidate';
  if (topSkills.length === 0) return '';
  return `${roleLabel} with live-verified hands-on proficiency in ${topSkills.join(', ')}, validated through PinIT oral technical defense and proof-of-work assessments.`;
}

/**
 * POST /api/vault/verify-defense
 * Authoritatively settles a Brutal Vault Credential Defense interview:
 * - Passed -> sets vault_items.verified = true, +5 Trust Score, syncs all claimed + proven skills to users.skill_tags
 * - Failed -> sets vault_items.verified = false, -5 Trust Score, AND still syncs any individually provenSkills (e.g. React) to users.skill_tags
 * - Also enriches default/empty portfolio_items pitch when verified skills are added (never overwrites custom user pitch).
 */
export async function POST(req: Request) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;

    const userId = gated.user!.id;
    const token = getBearerToken(req);
    const admin = getSupabaseAdmin();
    const userClient = getAuthoritativeSupabaseClient(token);
    const db = admin || userClient;

    const body = await req.json().catch(() => ({}));
    const docId = typeof body?.docId === 'string' ? body.docId.trim() : '';
    const passed = Boolean(body?.passed);
    const score = Math.max(0, Math.min(100, Math.round(Number(body?.score) || (passed ? 75 : 25))));
    const auditorName = typeof body?.auditorName === 'string' ? body.auditorName.trim() : 'Credential Auditor';
    const claimedSkills: string[] = Array.isArray(body?.claimedSkills)
      ? body.claimedSkills.map((s: any) => String(s || '').trim()).filter(Boolean)
      : [];
    const provenSkills: string[] = Array.isArray(body?.provenSkills)
      ? body.provenSkills.map((s: any) => String(s || '').trim()).filter(Boolean)
      : [];

    // Update ONLY guaranteed schema columns on vault_items so updates never fail on missing optional columns
    if (docId) {
      try {
        const vaultUpdatePayload = {
          verified: passed,
          ai_confidence_score: score,
          used_in_portfolio: passed,
        };
        let { error: vUpdateErr } = await db
          .from('vault_items')
          .update(vaultUpdatePayload)
          .eq('id', docId)
          .eq('user_id', userId);
        if (vUpdateErr && admin && token) {
          const retry = await userClient
            .from('vault_items')
            .update(vaultUpdatePayload)
            .eq('id', docId)
            .eq('user_id', userId);
          vUpdateErr = retry.error;
        }
        if (vUpdateErr) {
          console.warn('[vault/verify-defense] vault_items update warning:', vUpdateErr.message);
        }
      } catch (vErr) {
        console.warn('[vault/verify-defense] vault_items update exception:', vErr);
      }
    }

    let nextTrust = 50;
    let nextSkillTags: string[] = [];
    let updatedPitch: string | undefined = undefined;

    const skillsToSync = passed
      ? Array.from(new Set([...claimedSkills, ...provenSkills]))
      : provenSkills;

    try {
      let { data: userRow, error: userFetchErr } = await db
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      if ((userFetchErr || !userRow) && admin && token) {
        const retry = await userClient
          .from('users')
          .select('*')
          .eq('id', userId)
          .maybeSingle();
        if (!retry.error && retry.data) userRow = retry.data;
      }

      const rawTrust = userRow?.trust_score;
      const baseTrust =
        typeof rawTrust === 'number' && Number.isFinite(rawTrust)
          ? rawTrust === 40 || rawTrust === 0
            ? 50
            : rawTrust
          : 50;

      nextTrust = passed ? Math.min(100, baseTrust + 5) : Math.max(0, baseTrust - 5);

      const existingSkills: string[] = Array.isArray(userRow?.skill_tags) ? userRow.skill_tags : [];
      if (skillsToSync.length > 0) {
        const mergedMap = new Map<string, string>();
        for (const s of [...existingSkills, ...skillsToSync]) {
          const clean = String(s || '').trim();
          if (clean) mergedMap.set(clean.toLowerCase(), clean);
        }
        nextSkillTags = Array.from(mergedMap.values());
      } else {
        nextSkillTags = existingSkills;
      }

      const userUpdatePayload: Record<string, any> = {
        trust_score: nextTrust,
        ...(skillsToSync.length > 0 ? { skill_tags: nextSkillTags } : {}),
      };
      let { error: uUpdateErr } = await db
        .from('users')
        .update(userUpdatePayload)
        .eq('id', userId);
      if (uUpdateErr && admin && token) {
        await userClient
          .from('users')
          .update(userUpdatePayload)
          .eq('id', userId);
      }

      // Enrich Core Professional Pitch in portfolio_items if still empty or default placeholder
      if (skillsToSync.length > 0 && nextSkillTags.length > 0) {
        try {
          let { data: pitchRow, error: pitchFetchErr } = await db
            .from('portfolio_items')
            .select('item_data')
            .eq('user_id', userId)
            .eq('item_type', 'pitch')
            .maybeSingle();
          if (pitchFetchErr && admin && token) {
            const retry = await userClient
              .from('portfolio_items')
              .select('item_data')
              .eq('user_id', userId)
              .eq('item_type', 'pitch')
              .maybeSingle();
            if (!retry.error) pitchRow = retry.data;
          }

          const currentPitchRaw =
            typeof pitchRow?.item_data === 'string'
              ? pitchRow.item_data
              : typeof pitchRow?.item_data?.text === 'string'
              ? pitchRow.item_data.text
              : '';
          const normalizedCurrent = currentPitchRaw.trim().toLowerCase();
          const isAutoOrDefault =
            !normalizedCurrent ||
            normalizedCurrent === DEFAULT_PITCH_PLACEHOLDER ||
            normalizedCurrent.includes('validated through pinit oral technical defense');

          if (isAutoOrDefault) {
            updatedPitch = buildAutoVerifiedPitch(nextSkillTags, userRow?.target_role);
            const pitchRowPayload = {
              user_id: userId,
              item_type: 'pitch',
              item_data: { text: updatedPitch },
              updated_at: new Date().toISOString(),
            };
            const { error: upsertErr } = await db
              .from('portfolio_items')
              .upsert(pitchRowPayload, { onConflict: 'user_id,item_type' });
            if (upsertErr && admin && token) {
              await userClient
                .from('portfolio_items')
                .upsert(pitchRowPayload, { onConflict: 'user_id,item_type' });
            }
          }
        } catch (pitchErr) {
          console.warn('[vault/verify-defense] portfolio pitch sync notice:', pitchErr);
        }
      }
    } catch (uErr) {
      console.warn('[vault/verify-defense] users update warning:', uErr);
    }

    try {
      await db.from('audit_logs').insert({
        actor_id: userId,
        target_id: docId || userId,
        action: passed ? 'VAULT_DEFENSE_PASSED' : 'VAULT_DEFENSE_FAILED',
        meta: {
          docId,
          passed,
          score,
          auditorName,
          claimedSkills,
          provenSkills: skillsToSync,
          newTrust: nextTrust,
        },
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
      provenSkillsSynced: skillsToSync,
      updatedPitch,
    });
  } catch (err: any) {
    console.error('[vault/verify-defense] Fatal error:', err);
    return NextResponse.json({ error: err?.message || 'Verification settlement failed' }, { status: 500 });
  }
}
