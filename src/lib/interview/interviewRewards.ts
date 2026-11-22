/**
 * Authoritative Interview Rewards & Career Sync Engine
 *
 * 1. Exact Score-Tiered Weekly XP Schedule:
 *    - 100% exact accuracy  -> 1000 Weekly XP
 *    - 90% to 99%           ->  500 Weekly XP
 *    - 75% to 89%           ->  350 Weekly XP
 *    - 60% to 74%           ->  250 Weekly XP
 *    - 50% to 59%           ->  220 Weekly XP
 *    - 35% to 49%           ->  120 Weekly XP
 *    - Below 35% or eliminated -> 0 Weekly XP
 *
 * 2. Portfolio & Resume Career Sync (on successful non-eliminated interview, score >= 50%):
 *    - Syncs verified achievement, assessment credential, and milestone into `public.portfolio_items`.
 *    - Syncs verified interview credential + defended skills into `public.resumes`.
 */

import type { SupabaseClient } from '@supabase/supabase-js';

export const INTERVIEW_SUCCESS_MIN_SCORE = 50;

export interface WeeklyXpTierResult {
  xp: number;
  tierLabel: string;
}

/**
 * Pure, deterministic Weekly XP calculator matching the exact requested score bands.
 * Eliminated sessions (failed Round 2/3 defense gate) always receive 0 XP.
 */
export function calculateInterviewWeeklyXp(
  rawScore: number,
  options?: { eliminated?: boolean }
): WeeklyXpTierResult {
  if (options?.eliminated) {
    return { xp: 0, tierLabel: 'Eliminated (0 XP)' };
  }
  const score = Number.isFinite(Number(rawScore)) ? Math.round(Number(rawScore)) : 0;

  if (score >= 100) return { xp: 1000, tierLabel: 'Perfect 100% Accuracy' };
  if (score >= 90) return { xp: 500, tierLabel: '90%+ Distinction' };
  if (score >= 75) return { xp: 350, tierLabel: '75%+ Strong Performance' };
  if (score >= 60) return { xp: 250, tierLabel: '60%+ Solid Pass' };
  if (score >= 50) return { xp: 220, tierLabel: '50%+ Qualified Pass' };
  if (score >= 35) return { xp: 120, tierLabel: '35%+ Practice Effort' };
  return { xp: 0, tierLabel: 'Below 35% (0 XP)' };
}

export function isSuccessfulInterviewForCareerSync(
  rawScore: number,
  options?: { eliminated?: boolean }
): boolean {
  if (options?.eliminated) return false;
  const score = Number.isFinite(Number(rawScore)) ? Math.round(Number(rawScore)) : 0;
  return score >= INTERVIEW_SUCCESS_MIN_SCORE;
}

export interface InterviewCareerSyncInput {
  userId: string;
  sessionId: string;
  topic: string;
  roleName: string;
  domainStream: 'tech' | 'non_tech';
  score: number;
  verdict: string;
  defendedSkills: string[];
  summary?: string;
  completedAtIso?: string;
}

export interface InterviewCareerSyncResult {
  portfolioSynced: boolean;
  resumeSynced: boolean;
  achievementTitle?: string;
  certificateTitle?: string;
}

export function buildInterviewPortfolioEntries(input: InterviewCareerSyncInput) {
  const iso = input.completedAtIso || new Date().toISOString();
  const shortDate = iso.slice(0, 10);
  const year = iso.slice(0, 4);
  const safeScore = Math.max(0, Math.min(100, Math.round(input.score)));
  const cleanTopic = (input.roleName || input.topic || 'AI Corporate Interview').trim();
  const streamLabel = input.domainStream === 'non_tech' ? 'Commerce & Finance' : 'Engineering & Tech';
  const skillsSnippet = input.defendedSkills.length > 0
    ? ` Verified skills: ${input.defendedSkills.slice(0, 6).join(', ')}.`
    : '';
  const entryId = `iv_${input.sessionId.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 32) || Date.now()}`;

  return {
    entryId,
    achievement: {
      id: `${entryId}_ach`,
      title: `Verified AI Interview: ${cleanTopic} (${safeScore}%)`,
      detail: `${input.verdict} (${safeScore}%) across ${streamLabel} 4-round panel.${skillsSnippet}`,
      date: shortDate,
      verified: true,
    },
    certificate: {
      id: `${entryId}_cert`,
      title: `AI Interview Assessment — ${cleanTopic}`,
      issuer: 'PinIT Career OS Interview Panel',
      verified: true,
      score: safeScore,
      assessmentPassed: true,
      assessmentScore: safeScore,
      verificationStatus: 'verified',
      verifiedAt: iso,
      assessedAt: iso,
    },
    timeline: {
      id: `${entryId}_tl`,
      year,
      category: 'milestone',
      title: `Cleared ${cleanTopic} AI Interview (${safeScore}%)`,
      detail: `${input.verdict} · ${streamLabel}${skillsSnippet}`,
      verified: true,
    },
    resumeCertificate: {
      id: `${entryId}_res_cert`,
      name: `Verified AI Corporate Interview — ${cleanTopic} (${safeScore}%, ${input.verdict})`,
      issuer: 'PinIT Career OS Hiring Panel',
      date: shortDate,
      credentialId: entryId,
    },
  };
}

/**
 * Pure helper to merge a verified interview credential + defended skills into a ResumeFormData-compatible JSON blob.
 */
export function mergeInterviewIntoResumeContent(
  existingContent: Record<string, any> | null | undefined,
  input: InterviewCareerSyncInput
): Record<string, any> {
  const base = existingContent && typeof existingContent === 'object' ? { ...existingContent } : {};
  const entries = buildInterviewPortfolioEntries(input);

  const existingCerts = Array.isArray(base.certificates) ? base.certificates : [];
  const filteredCerts = existingCerts.filter((c: any) => c?.id !== entries.resumeCertificate.id && c?.credentialId !== entries.entryId);
  const nextCerts = [entries.resumeCertificate, ...filteredCerts].slice(0, 20);

  const existingSkills = base.skills && typeof base.skills === 'object' ? { ...base.skills } : {};
  const skillBucket = input.domainStream === 'non_tech' ? 'professional' : 'technical';
  const currentTokens = String(existingSkills[skillBucket] || '')
    .split(/[,|]+/)
    .map(s => s.trim())
    .filter(Boolean);
  const seenLower = new Set(currentTokens.map(s => s.toLowerCase()));
  for (const sk of input.defendedSkills) {
    const clean = String(sk || '').trim();
    if (clean && !seenLower.has(clean.toLowerCase())) {
      seenLower.add(clean.toLowerCase());
      currentTokens.push(clean);
    }
  }
  existingSkills[skillBucket] = currentTokens.join(', ');

  const existingVerifiedInterviews = Array.isArray(base.verifiedInterviews) ? base.verifiedInterviews : [];
  const nextVerifiedInterviews = [
    {
      id: entries.entryId,
      topic: input.roleName || input.topic,
      domainStream: input.domainStream,
      score: Math.round(input.score),
      verdict: input.verdict,
      skills: input.defendedSkills.slice(0, 8),
      date: entries.achievement.date,
    },
    ...existingVerifiedInterviews.filter((v: any) => v?.id !== entries.entryId),
  ].slice(0, 15);

  return {
    ...base,
    certificates: nextCerts,
    skills: existingSkills,
    verifiedInterviews: nextVerifiedInterviews,
  };
}

/**
 * Server-side authoritative sync: appends a passed interview to BOTH `public.portfolio_items`
 * (achievements, certificates, timeline) AND `public.resumes` (certificates, skills, verifiedInterviews).
 * Never throws so interview evaluation responses stay resilient even if one table is unavailable.
 */
export async function syncSuccessfulInterviewToPortfolioAndResume(
  admin: SupabaseClient,
  input: InterviewCareerSyncInput
): Promise<InterviewCareerSyncResult> {
  const entries = buildInterviewPortfolioEntries(input);
  let portfolioSynced = false;
  let resumeSynced = false;
  const nowIso = input.completedAtIso || new Date().toISOString();

  // 1. Sync to Portfolio (`public.portfolio_items`: achievements, certificates, timeline)
  try {
    const { data: rows } = await admin
      .from('portfolio_items')
      .select('item_type, item_data')
      .eq('user_id', input.userId)
      .in('item_type', ['achievements', 'certificates', 'timeline']);

    const byType = new Map<string, any>();
    if (Array.isArray(rows)) {
      for (const r of rows) {
        byType.set(r.item_type, r.item_data);
      }
    }

    const extractItems = (raw: any): any[] => {
      if (Array.isArray(raw)) return raw;
      if (raw && Array.isArray(raw.items)) return raw.items;
      return [];
    };

    const nextAchievements = [
      entries.achievement,
      ...extractItems(byType.get('achievements')).filter((x: any) => x?.id !== entries.achievement.id),
    ].slice(0, 30);

    const nextCertificates = [
      entries.certificate,
      ...extractItems(byType.get('certificates')).filter((x: any) => x?.id !== entries.certificate.id),
    ].slice(0, 30);

    const nextTimeline = [
      entries.timeline,
      ...extractItems(byType.get('timeline')).filter((x: any) => x?.id !== entries.timeline.id),
    ].slice(0, 40);

    const upserts = [
      { user_id: input.userId, item_type: 'achievements', item_data: { items: nextAchievements }, updated_at: nowIso },
      { user_id: input.userId, item_type: 'certificates', item_data: { items: nextCertificates }, updated_at: nowIso },
      { user_id: input.userId, item_type: 'timeline', item_data: { items: nextTimeline }, updated_at: nowIso },
    ];

    const { error: portErr } = await admin
      .from('portfolio_items')
      .upsert(upserts, { onConflict: 'user_id,item_type' });

    if (!portErr) {
      portfolioSynced = true;
    } else {
      console.warn('[InterviewRewards] Portfolio upsert warning:', portErr.message);
    }
  } catch (err) {
    console.warn('[InterviewRewards] Portfolio sync exception:', err);
  }

  // 2. Sync to Resume (`public.resumes`: update latest resume or create primary resume with verified credential)
  try {
    const { data: latestResumes } = await admin
      .from('resumes')
      .select('id, title, target_role, content, ats_score')
      .eq('user_id', input.userId)
      .order('updated_at', { ascending: false })
      .limit(1);

    const latest = Array.isArray(latestResumes) && latestResumes.length > 0 ? latestResumes[0] : null;
    const mergedContent = mergeInterviewIntoResumeContent(latest?.content, input);

    if (latest?.id) {
      const { error: updErr } = await admin
        .from('resumes')
        .update({
          content: mergedContent,
          updated_at: nowIso,
        })
        .eq('id', latest.id);
      if (!updErr) {
        resumeSynced = true;
      } else {
        console.warn('[InterviewRewards] Resume update warning:', updErr.message);
      }
    } else {
      const { error: insErr } = await admin
        .from('resumes')
        .insert({
          user_id: input.userId,
          title: 'Primary ATS Resume',
          target_role: input.roleName || input.topic || 'Full Stack Engineer',
          template: 'modern_ats',
          content: mergedContent,
          ats_score: Math.max(70, Math.min(98, Math.round(input.score))),
          updated_at: nowIso,
        });
      if (!insErr) {
        resumeSynced = true;
      } else {
        console.warn('[InterviewRewards] Resume insert warning:', insErr.message);
      }
    }
  } catch (err) {
    console.warn('[InterviewRewards] Resume sync exception:', err);
  }

  return {
    portfolioSynced,
    resumeSynced,
    achievementTitle: entries.achievement.title,
    certificateTitle: entries.certificate.title,
  };
}
