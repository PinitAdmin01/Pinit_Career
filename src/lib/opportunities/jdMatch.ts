// src/lib/opportunities/jdMatch.ts
/**
 * Matches a pasted job description against a candidate's known skills.
 *
 * This replaces a hardcoded response that returned the same three skills
 * (React, Node.js, TypeScript) and a score of 78 to every user for every job.
 *
 * Deliberately local and deterministic — no network call. The LLM backend is
 * reachable only through NEXT_PUBLIC_BACKEND_URL, which the production CSP
 * currently blocks, so an LLM-based matcher would fail silently in exactly the
 * way this function exists to stop. It reuses the canonical skill ontology in
 * src/lib/ats/skillOntology.ts, which already handles alias normalisation
 * ("js" -> JavaScript) and word-boundary matching, so "s3" cannot be read as
 * "TypeScript".
 */
import { extractCanonicalSkillsWithPolarity } from '@/lib/ats/skillOntology';

export type JdVerdict = 'strong' | 'possible' | 'stretch' | 'unknown';

export interface JdMatchResult {
  match_score: number;
  verdict: JdVerdict;
  matched_skills: string[];
  missing_skills: string[];
  required_skills: string[];
  candidate_skills: string[];
  estimated_preparation_weeks: number;
  /** false when the job description contained no recognisable skill at all */
  analyzable: boolean;
  source: 'local-ontology';
}

/** Skills a job description asks for. Aspirational/negated mentions are dropped. */
export function requiredSkillsFromJd(jd: string): string[] {
  if (!jd || !jd.trim()) return [];
  return [...new Set(
    extractCanonicalSkillsWithPolarity(jd, 'GENERAL_BODY')
      .filter((s) => s.polarity === 'CURRENT')
      .map((s) => s.canonicalName),
  )];
}

/**
 * Pulls a candidate's skills out of whatever shape the profile happens to be.
 * Profiles are not uniform here: `skills` may be an array or a comma string,
 * and onboarding answers carry a separate free-text list.
 */
export function candidateSkillsFromProfile(profile: unknown): string[] {
  const p = (profile || {}) as Record<string, any>;
  const parts: string[] = [];

  const push = (v: unknown) => {
    if (!v) return;
    if (Array.isArray(v)) parts.push(v.filter((x) => typeof x === 'string').join(', '));
    else if (typeof v === 'string') parts.push(v);
  };

  push(p.skills);
  push(p.technical_skills);
  push(p.onboarding_answers?.skills);
  push(p.onboarding_answers?.role);

  const text = parts.filter(Boolean).join('\n');
  if (!text.trim()) return [];
  return [...new Set(
    extractCanonicalSkillsWithPolarity(text, 'SKILLS')
      .filter((s) => s.polarity !== 'NEGATED')
      .map((s) => s.canonicalName),
  )];
}

function verdictFor(score: number, analyzable: boolean): JdVerdict {
  if (!analyzable) return 'unknown';
  if (score >= 75) return 'strong';
  if (score >= 45) return 'possible';
  return 'stretch';
}

export function matchJobDescription(jd: string, candidateSkills: string[]): JdMatchResult {
  const required = requiredSkillsFromJd(jd);
  const have = new Set(candidateSkills);
  const matched = required.filter((s) => have.has(s));
  const missing = required.filter((s) => !have.has(s));
  const analyzable = required.length > 0;

  // Plain coverage of what the posting asks for. No weighting by seniority or
  // category — that would be a guess dressed up as a measurement.
  const score = analyzable ? Math.round((matched.length / required.length) * 100) : 0;

  // Heuristic, and only a heuristic: roughly a fortnight per missing skill,
  // clamped so the number stays in a range a student can act on.
  const weeks = missing.length === 0 ? 0 : Math.min(26, Math.max(2, missing.length * 2));

  return {
    match_score: score,
    verdict: verdictFor(score, analyzable),
    matched_skills: matched,
    missing_skills: missing,
    required_skills: required,
    candidate_skills: candidateSkills,
    estimated_preparation_weeks: weeks,
    analyzable,
    source: 'local-ontology',
  };
}
