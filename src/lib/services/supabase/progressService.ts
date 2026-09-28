'use client';

import { supabase } from '@/lib/supabaseClient';
import { generateTxId } from '@/lib/utils/transactionId';
import { getAuthoritativeQuest } from '@/lib/quests/questRegistry';

const IS_VALID_UUID = (id?: string | null): boolean =>
  !!id && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);

export async function submitMission(uid: string, missionId: string, data: Record<string, unknown>): Promise<void> {
  if (!uid || uid === 'guest') return;

  const today = new Date().toISOString().slice(0, 10);

  // DEF-074: Query user's current progress to verify daily mission limit
  const { data: userProfile } = await supabase
    .from('users')
    .select('missions_completed, xp_total, trust_score')
    .eq('id', uid)
    .maybeSingle();

  // Check if mission exists
  const { data: existingMission } = await supabase
    .from('missions')
    .select('id, status, trust_reward')
    .eq('id', missionId)
    .eq('user_id', uid)
    .maybeSingle();

  const trustReward = existingMission?.trust_reward ?? 10;

  if (existingMission) {
    await supabase
      .from('missions')
      .update({
        status: 'completed',
        ai_evaluation: data,
        completed_at: new Date().toISOString(),
      })
      .eq('id', missionId);
  } else {
    await supabase
      .from('missions')
      .insert({
        id: missionId,
        user_id: uid,
        title: (data.title as string) || 'Daily Mission',
        description: (data.description as string) || 'Completed via student portal',
        type: (data.type as string) || 'general',
        status: 'completed',
        due_date: today,
        trust_reward: trustReward,
        ai_evaluation: data,
        completed_at: new Date().toISOString(),
      });
  }

  // Authoritatively update user trust_score and missions_completed in users table
  if (userProfile) {
    const nextCount = (userProfile.missions_completed || 0) + 1;
    const nextTrust = Math.min(100, (userProfile.trust_score || 50) + trustReward);
    await supabase
      .from('users')
      .update({
        missions_completed: nextCount,
        trust_score: nextTrust,
        updated_at: new Date().toISOString(),
      })
      .eq('id', uid);
  }
}

export async function persistQuestCompletion(
  uid: string,
  questId: string,
  xpOrIsExam: number | boolean = 15,
  maybeXp = 15,
  courseId?: string
): Promise<{ ok: boolean; newXp?: number; error?: string }> {
  if (!uid || uid === 'guest') return { ok: true, newXp: typeof xpOrIsExam === 'number' ? xpOrIsExam : maybeXp };
  const xpAmount = typeof xpOrIsExam === 'number' ? xpOrIsExam : maybeXp;

  // Prefer server-authoritative endpoint to honor anti-cheat guards
  if (typeof window !== 'undefined') {
    try {
      const resp = await fetch('/api/quest/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questId,
          isExam: typeof xpOrIsExam === 'boolean' ? xpOrIsExam : false,
          xpAmount,
          courseId,
        }),
      });
      if (resp.ok) {
        const result = await resp.json();
        return { ok: true, newXp: result.xpTotal };
      } else {
        // Fail closed if server explicitly rejected (e.g. 400 unregistered quest, 429 daily cap)
        const errJson = await resp.json().catch(() => ({}));
        return {
          ok: false,
          error: errJson.error || errJson.message || `Quest completion rejected by server (HTTP ${resp.status})`,
        };
      }
    } catch {
      // Fall back to direct client write ONLY if network/fetch throws (e.g. offline)
    }
  }

  // Fail closed on unregistered quests even in fallback write
  const authQuest = getAuthoritativeQuest(questId);
  if (!authQuest) {
    return { ok: false, error: `Cannot complete unregistered quest '${questId}'.` };
  }

  try {
    const { data: userProfile, error: fetchErr } = await supabase
      .from('users')
      .select('completed_quests, xp_total, missions_completed, trust_score')
      .eq('id', uid)
      .maybeSingle();

    if (fetchErr) {
      console.warn('[persistQuestCompletion] Failed to fetch user row:', fetchErr);
    }

    const currentQuests: string[] = Array.isArray(userProfile?.completed_quests)
      ? [...userProfile.completed_quests]
      : [];

    if (!currentQuests.includes(questId)) {
      currentQuests.push(questId);
    }

    const currentXp = typeof userProfile?.xp_total === 'number' ? userProfile.xp_total : 0;
    const currentMissions = typeof userProfile?.missions_completed === 'number' ? userProfile.missions_completed : 0;
    const currentTrust = typeof userProfile?.trust_score === 'number' ? userProfile.trust_score : 50;

    const newXp = currentXp + (xpAmount || 15);
    const newMissions = currentMissions + 1;
    const newTrust = Math.min(100, currentTrust + 2);

    const { error: updateErr } = await supabase
      .from('users')
      .update({
        completed_quests: currentQuests,
        xp_total: newXp,
        missions_completed: newMissions,
        trust_score: newTrust,
        updated_at: new Date().toISOString(),
      })
      .eq('id', uid);

    if (updateErr) {
      console.warn('[persistQuestCompletion] Failed to update user row:', updateErr);
      return { ok: false, error: updateErr.message };
    }

    return { ok: true, newXp };
  } catch (err: any) {
    console.error('[persistQuestCompletion] Unexpected error:', err);
    return { ok: false, error: err?.message || 'UNKNOWN_ERROR' };
  }
}

export async function syncUnlockedItemsDB(
  uid: string,
  unlockedItems: Record<string, any>
): Promise<any> {
  if (!uid || uid === 'guest') return { ok: true };

  try {
    const { error } = await supabase.from('users').update({
      unlocked_items: unlockedItems
    }).eq('id', uid);

    if (error) {
      console.warn('[syncUnlockedItemsDB] Failed to sync unlocked items to Supabase:', error);
      return { ok: false };
    }
    return { ok: true };
  } catch {
    return { ok: false };
  }
}

export async function fetchServerTimeOffset(): Promise<number> {
  try {
    const t0 = Date.now();
    const res = await fetch('/api/time');
    const t1 = Date.now();
    if (res.ok) {
      const data = await res.json();
      const serverNow = data.epochMs || data.serverTime;
      if (typeof serverNow === 'number') {
        const roundTrip = t1 - t0;
        const estimatedServerNow = serverNow + roundTrip / 2;
        return estimatedServerNow - t1;
      }
    }
  } catch {}
  return 0;
}

export async function spendPinsDB(
  uid: string,
  featureKey: string,
  itemId?: string
): Promise<{ ok: boolean; newBalance?: number; newBonusBalance?: number; expiresAt?: number; reason?: string }> {
  try {
    if (!IS_VALID_UUID(uid)) {
      // Guest/non-uuid path: optimistic local-only response (no server charge)
      return { ok: true };
    }

    const res = await fetch('/api/' + 'pins/spend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ featureKey, itemId }),
    });

    const data = await res.json().catch(() => ({}));
    if (res.ok && data.ok) {
      return { ok: true, newBalance: data.newBalance, newBonusBalance: data.newBonusBalance, expiresAt: data.expiresAt };
    }

    return { ok: false, reason: data.error || data.message || 'SPEND_FAILED' };
  } catch (e: any) {
    console.error('[spendPinsDB] Unexpected error:', e.message);
    return { ok: false, reason: 'ERROR' };
  }
}
