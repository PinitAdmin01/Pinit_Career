// src/lib/avatar/recommendations.ts
/**
 * Suggestion chips for the avatar mentor widget, derived from the student's
 * own profile.
 *
 * Replaces a hardcoded pair — "Improve DSA fit" and "Scan your Resume" — that
 * every student saw on every visit regardless of what they had actually done.
 * A recommendation that ignores the profile is worse than none: it teaches the
 * student the assistant is not looking at their work.
 *
 * Every rule below fires on a real field. When nothing fires, the result is an
 * empty list and the widget shows no chips, which is the honest outcome for a
 * profile with no signals in it.
 */

export interface AvatarRecommendation {
  content_type: 'tip';
  type: string;
  label: string;
  icon: string;
  /** 0..1, higher is more urgent. Derived from how far below target the signal is. */
  relevance: number;
  /** The profile field this came from, so the suggestion can be explained. */
  basis: string;
}

const num = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? v : 0);

/** How far below target a score sits, as 0..1. */
const shortfall = (score: number, target: number) =>
  Math.max(0, Math.min(1, (target - score) / target));

export function buildAvatarRecommendations(profile: unknown): AvatarRecommendation[] {
  const p = (profile || {}) as Record<string, any>;
  const recs: AvatarRecommendation[] = [];

  const ats = num(p.ats_score);
  const trust = num(p.trust_score);
  const dna = num(p.career_dna_score);

  if (ats < 70) {
    recs.push({
      content_type: 'tip', type: 'resume', icon: '📄',
      label: p.resumeGenerated ? 'Improve your resume score' : 'Build your resume',
      relevance: 0.5 + 0.5 * shortfall(ats, 70),
      basis: `ats_score ${ats}`,
    });
  }
  if (trust < 70) {
    recs.push({
      content_type: 'tip', type: 'trust', icon: '🛡️',
      label: 'Verify a credential to raise Trust',
      relevance: 0.45 + 0.5 * shortfall(trust, 70),
      basis: `trust_score ${trust}`,
    });
  }
  if (dna < 70) {
    recs.push({
      content_type: 'tip', type: 'career-dna', icon: '🧬',
      label: 'Strengthen your Career DNA',
      relevance: 0.4 + 0.4 * shortfall(dna, 70),
      basis: `career_dna_score ${dna}`,
    });
  }
  if (num(p.vault_count) === 0) {
    recs.push({
      content_type: 'tip', type: 'vault', icon: '🗄️',
      label: 'Add your first credential to the Vault',
      relevance: 0.8, basis: 'vault_count 0',
    });
  }
  if (num(p.interviews_done) === 0) {
    recs.push({
      content_type: 'tip', type: 'interview', icon: '🎤',
      label: 'Try your first mock interview',
      relevance: 0.75, basis: 'interviews_done 0',
    });
  }
  if (num(p.mission_streak) === 0 && num(p.missions_completed) === 0) {
    recs.push({
      content_type: 'tip', type: 'missions', icon: '🎯',
      label: "Start today's mission",
      relevance: 0.7, basis: 'no missions completed',
    });
  }

  // Named gaps beat generic advice, so they rank above the score-based rules.
  const named: string[] = [
    ...(Array.isArray(p.weak_areas) ? p.weak_areas : []),
    ...(Array.isArray(p.jdMissingSkills) ? p.jdMissingSkills : []),
  ].filter((s) => typeof s === 'string' && s.trim());

  for (const skill of [...new Set(named)].slice(0, 4)) {
    recs.push({
      content_type: 'tip', type: 'skill', icon: '📊',
      label: `Close your gap in ${skill}`,
      relevance: 0.85,
      basis: 'weak_areas / jdMissingSkills',
    });
  }

  return recs
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, 6)
    .map((r) => ({ ...r, relevance: Math.round(r.relevance * 100) / 100 }));
}
