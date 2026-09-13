'use client';

import { supabase } from '@/lib/supabaseClient';
import { generateTxId } from '@/lib/utils/transactionId';

export async function getVaultItems(uid: string): Promise<Record<string, unknown>[]> {
  if (!uid || uid === 'guest') return [];
  const { data, error } = await supabase
    .from('vault_items')
    .select('*')
    .eq('user_id', uid)
    .order('created_at', { ascending: false });

  if (error) return [];
  return data || [];
}

export async function addVaultItem(uid: string, item: Record<string, any>): Promise<any> {
  const defaultId = generateTxId('vault');
  if (!uid || uid === 'guest') return defaultId;

  try {
    const { data, error } = await supabase
      .from('vault_items')
      .insert({
        user_id: uid,
        title: item.title,
        item_type: item.item_type || 'resume',
        organization_name: item.organization_name || '',
        description: item.description || '',
        verified: !!item.verified,
        ai_confidence_score: item.ai_confidence_score || 0,
        skill_tags: item.skill_tags || [],
        is_public: !!item.is_public,
        used_in_resume: !!item.used_in_resume,
        used_in_portfolio: !!item.used_in_portfolio,
        created_at: new Date().toISOString(),
      })
      .select('id')
      .single();

    if (error) {
      console.warn('[addVaultItem] DB insert failed:', error.message);
      return defaultId;
    }
    return data?.id || defaultId;
  } catch (err: any) {
    console.warn('[addVaultItem] Error:', err?.message);
    return defaultId;
  }
}

export async function deleteVaultItem(uid: string, itemId: string): Promise<{ ok: boolean; error?: string }> {
  if (!uid || uid === 'guest') return { ok: true };

  const { error } = await supabase
    .from('vault_items')
    .delete()
    .eq('id', itemId)
    .eq('user_id', uid);

  return { ok: !error, error: error?.message };
}

export async function verifyVaultItem(
  adminId: string,
  itemId: string,
  endorsementNote?: string
): Promise<{ ok: boolean; error?: string }> {
  try {
    const { data: item, error: fetchErr } = await supabase
      .from('vault_items')
      .select('user_id, item_type, title')
      .eq('id', itemId)
      .maybeSingle();

    if (fetchErr || !item) {
      return { ok: false, error: fetchErr?.message || 'Vault item not found' };
    }

    const { error: updateErr } = await supabase
      .from('vault_items')
      .update({
        verified: true,
        endorsement_note: endorsementNote || 'Verified by institution admin',
        verified_by: adminId,
        verified_at: new Date().toISOString(),
      })
      .eq('id', itemId);

    if (updateErr) return { ok: false, error: updateErr.message };

    // Record in audit log
    await supabase.from('audit_logs').insert({
      admin_id: adminId,
      action: 'VAULT_ITEM_VERIFIED',
      target_id: itemId,
      meta: { student_id: item.user_id, item_type: item.item_type, title: item.title },
      created_at: new Date().toISOString(),
    });

    return { ok: true };
  } catch (err: any) {
    return { ok: false, error: err.message };
  }
}

export async function generateResumeFromVault(
  uid: string,
  parsedResume: Record<string, unknown>,
  targetRole?: string
): Promise<Record<string, unknown>> {
  const vault = await getVaultItems(uid);
  const projects = vault.filter(v => v.item_type === 'project');
  const certs = vault.filter(v => v.item_type === 'certification');

  return {
    ...parsedResume,
    targetRole: targetRole || parsedResume.targetRole || 'Full Stack Engineer',
    vaultProjects: projects,
    vaultCertifications: certs,
    generatedAt: new Date().toISOString(),
  };
}

export async function recalculateCareerDna(uid: string): Promise<Record<string, unknown> | null> {
  if (!uid || uid === 'guest') return null;

  try {
    const { data: user } = await supabase
      .from('users')
      .select('ats_score, xp_total, missions_completed, completed_quests, trust_score')
      .eq('id', uid)
      .maybeSingle();

    if (!user) return null;

    const questCount = Array.isArray(user.completed_quests) ? user.completed_quests.length : 0;
    const missionCount = Number(user.missions_completed) || 0;
    const atsScore = Number(user.ats_score) || 60;
    const trustScore = Number(user.trust_score) || 50;

    const dnaScore = Math.min(100, Math.round((atsScore * 0.4) + (trustScore * 0.3) + (Math.min(questCount, 20) * 1.5)));

    const archetype = dnaScore > 80 ? 'Architect' : dnaScore > 65 ? 'Builder' : 'Explorer';

    await supabase.from('users').update({
      career_dna_score: dnaScore,
      career_dna_archetype: archetype,
      updated_at: new Date().toISOString(),
    }).eq('id', uid);

    return { dnaScore, archetype };
  } catch (err) {
    console.warn('[recalculateCareerDna] Error:', err);
    return null;
  }
}

export async function getDashboardAnalytics(uid: string): Promise<Record<string, unknown>> {
  if (!uid || uid === 'guest') {
    return { activeStudentsCount: 0, verifiedVaultCount: 0, pendingAlertsCount: 0 };
  }

  try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { count: activeCount } = await supabase
      .from('users')
      .select('id', { count: 'exact', head: true })
      .gte('updated_at', twentyFourHoursAgo);

    const { count: vaultCount } = await supabase
      .from('vault_items')
      .select('id', { count: 'exact', head: true })
      .eq('verified', true);

    const { count: pendingGrievances } = await supabase
      .from('grievances')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'pending');

    return {
      activeStudentsCount: activeCount || 0,
      verifiedVaultCount: vaultCount || 0,
      pendingAlertsCount: pendingGrievances || 0,
    };
  } catch {
    return { activeStudentsCount: 0, verifiedVaultCount: 0, pendingAlertsCount: 0 };
  }
}

export async function createInterviewSession(uid: string, data: Record<string, unknown>): Promise<string> {
  const sessionId = generateTxId('sess');
  try {
    await supabase.from('interview_sessions').insert({
      id: sessionId,
      user_id: uid,
      mode: (data.mode as string) || (data.type as string) || 'technical',
      domain: (data.domain as string) || 'general',
      pressure_mode: (data.pressure_mode as string) || (data.difficulty as string) || 'normal',
      status: 'in_progress',
      overall_score: 0,
      session_data: data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  } catch (err) {
    console.warn('[createInterviewSession] Supabase insert error:', err);
  }
  return sessionId;
}

export async function getInterviewSession(uid: string, sessionId: string): Promise<Record<string, unknown> | null> {
  try {
    const { data, error } = await supabase
      .from('interview_sessions')
      .select('*')
      .eq('id', sessionId)
      .eq('user_id', uid)
      .maybeSingle();

    if (!error && data) return data;
  } catch {}
  return null;
}

export async function appendInterviewTranscript(
  uid: string,
  sessionId: string,
  entries: { role: string; content: string; ts: number }[]
): Promise<void> {
  try {
    const session = await getInterviewSession(uid, sessionId);
    const existingTranscript = Array.isArray(session?.transcript) ? session.transcript : [];
    const updated = [...existingTranscript, ...entries];

    await supabase
      .from('interview_sessions')
      .update({
        transcript: updated,
        updated_at: new Date().toISOString(),
      })
      .eq('id', sessionId)
      .eq('user_id', uid);
  } catch (err) {
    console.warn('[appendInterviewTranscript] Update failed:', err);
  }
}

export async function completeInterviewSession(
  uid: string,
  sessionId: string,
  evaluation: Record<string, unknown>
): Promise<void> {
  try {
    const score = Math.round(Number(evaluation.score || evaluation.overall_score || 0));
    await supabase
      .from('interview_sessions')
      .update({
        status: 'completed',
        overall_score: score,
        evaluation,
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', sessionId)
      .eq('user_id', uid);
  } catch (err) {
    console.warn('[completeInterviewSession] Update failed:', err);
  }
}

export async function getInterviewHistory(uid: string): Promise<Record<string, unknown>[]> {
  try {
    const { data, error } = await supabase
      .from('interview_sessions')
      .select('*')
      .eq('user_id', uid)
      .order('created_at', { ascending: false })
      .limit(20);

    if (!error && Array.isArray(data)) return data;
  } catch {}
  return [];
}
