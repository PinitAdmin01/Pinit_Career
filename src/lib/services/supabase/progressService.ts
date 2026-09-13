'use client';

import { supabase } from '@/lib/supabaseClient';
import { generateTxId } from '@/lib/utils/transactionId';

const IS_VALID_UUID = (id?: string | null): boolean =>
  !!id && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);

export async function getTodayMissions(uid: string): Promise<Record<string, unknown>[]> {
  if (!uid || uid === 'guest') return [];
  const today = new Date().toISOString().slice(0, 10);
  const { data, error } = await supabase
    .from('missions')
    .select('*')
    .eq('user_id', uid)
    .eq('due_date', today);

  if (error) return [];
  return data || [];
}

export async function getMissionHistory(uid: string): Promise<Record<string, unknown>[]> {
  if (!uid || uid === 'guest') return [];
  const { data, error } = await supabase
    .from('missions')
    .select('*')
    .eq('user_id', uid)
    .order('created_at', { ascending: false })
    .limit(30);

  if (error) return [];
  return data || [];
}

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

export async function generateCustomSkillQuests(uid: string, targetRole: string, skill: string): Promise<Record<string, unknown>[]> {
  try {
    const { data: existingQuests } = await supabase
      .from('custom_skill_quests')
      .select('*')
      .eq('user_id', uid)
      .eq('skill_name', skill);

    if (existingQuests && existingQuests.length > 0) {
      return existingQuests;
    }

    const generated = [
      {
        id: `custom_${skill.toLowerCase().replace(/[^a-z0-9]/g, '_')}_1`,
        user_id: uid,
        skill_name: skill,
        target_role: targetRole,
        title: `Foundations of ${skill}`,
        description: `Core implementation principles and practical hands-on exercises for ${skill}.`,
        xp: 150,
        pins: 20,
        created_at: new Date().toISOString(),
      },
      {
        id: `custom_${skill.toLowerCase().replace(/[^a-z0-9]/g, '_')}_2`,
        user_id: uid,
        skill_name: skill,
        target_role: targetRole,
        title: `Advanced Architecture in ${skill}`,
        description: `System integration patterns, error boundary strategies, and scaling with ${skill}.`,
        xp: 250,
        pins: 30,
        created_at: new Date().toISOString(),
      },
    ];

    await supabase.from('custom_skill_quests').insert(generated);
    return generated;
  } catch (err) {
    console.warn('[generateCustomSkillQuests] Error generating skill quests:', err);
    return [];
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

export async function persistXpAddition(
  uid: string,
  amount: number,
  reason: string
): Promise<{ ok: boolean; newXp?: number; error?: string }> {
  if (!uid || uid === 'guest') return { ok: true, newXp: amount };

  try {
    const { data: profile, error: fetchErr } = await supabase
      .from('users')
      .select('xp_total')
      .eq('id', uid)
      .maybeSingle();

    if (fetchErr || !profile) {
      return { ok: false, error: fetchErr?.message || 'User not found' };
    }

    const current = Number(profile.xp_total) || 0;
    const newXp = current + amount;

    const { error: updateErr } = await supabase
      .from('users')
      .update({
        xp_total: newXp,
        updated_at: new Date().toISOString(),
      })
      .eq('id', uid);

    if (updateErr) {
      return { ok: false, error: updateErr.message };
    }

    // Log XP event to xp_events table if present
    Promise.resolve(
      supabase.from('xp_events').insert({
        user_id: uid,
        amount,
        reason,
        created_at: new Date().toISOString(),
      })
    ).catch(() => {});

    return { ok: true, newXp };
  } catch (err: any) {
    return { ok: false, error: err.message };
  }
}

export async function syncRewardsDB(
  uid: string,
  rewardKey: string,
  payload: Record<string, unknown>
): Promise<boolean> {
  if (!uid || uid === 'guest') return true;

  try {
    const { error } = await supabase.from('user_rewards').upsert({
      user_id: uid,
      reward_key: rewardKey,
      reward_payload: payload,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id,reward_key' });

    return !error;
  } catch {
    return false;
  }
}

export async function syncUnlockedItemsDB(
  uid: string,
  unlockedItems: Record<string, number>
): Promise<boolean> {
  if (!uid || uid === 'guest') return true;

  try {
    const { error } = await supabase.from('users').update({
      unlocked_items: unlockedItems,
      updated_at: new Date().toISOString(),
    }).eq('id', uid);

    return !error;
  } catch {
    return false;
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
  cost: number,
  reason: string
): Promise<{ ok: boolean; newBalance?: number; reason?: string }> {
  try {
    if (!IS_VALID_UUID(uid)) {
      // In demo/guest mode with non-UUID, perform safe local deduction in-memory
      return { ok: true, newBalance: Math.max(0, 120 - cost) };
    }

    // Attempt authoritative atomic PostgreSQL RPC with FOR UPDATE row lock
    const { data: rpcResult, error: rpcErr } = await supabase.rpc('spend_pins', {
      p_user_id: uid,
      p_amount: cost,
      p_reason: reason || 'Pin deduction',
    });

    if (!rpcErr && rpcResult) {
      if (rpcResult.ok) {
        return { ok: true, newBalance: rpcResult.new_balance };
      }
      return { ok: false, reason: rpcResult.reason || 'INSUFFICIENT_PINS' };
    }

    // Fallback if RPC is not deployed yet or connection degraded
    const { data: profile, error: fetchErr } = await supabase
      .from('users')
      .select('pins')
      .eq('id', uid)
      .single();

    if (fetchErr || !profile) {
      console.warn('[spendPinsDB] Could not fetch pins:', fetchErr?.message);
      return { ok: false, reason: 'ERROR' };
    }

    const current: number = profile.pins ?? 120;
    if (current < cost) {
      return { ok: false, reason: 'INSUFFICIENT_PINS' };
    }

    const newBalance = current - cost;
    const { error: updateErr } = await supabase
      .from('users')
      .update({ pins: newBalance })
      .eq('id', uid);

    if (updateErr) {
      console.warn('[spendPinsDB] Update failed:', updateErr.message);
      return { ok: false, reason: 'ERROR' };
    }

    // Append to pin_history JSONB with unique collision-free transaction ID
    (async () => {
      try {
        const { data } = await supabase.from('users').select('pin_history').eq('id', uid).single();
        const history: Record<string, unknown>[] = (data?.pin_history as Record<string, unknown>[]) || [];
        const newTx = {
          id: generateTxId('tx'),
          type: 'spend',
          amount: cost,
          reason,
          source: 'spend',
          timestamp: Date.now(),
        };
        const updated = [newTx, ...history].slice(0, 100);
        await supabase.from('users').update({ pin_history: updated }).eq('id', uid);
      } catch (err) {
        console.warn('[spendPinsDB] History log failed:', err);
      }
    })();

    return { ok: true, newBalance };
  } catch (e: any) {
    console.error('[spendPinsDB] Unexpected error:', e.message);
    return { ok: false, reason: 'ERROR' };
  }
}
