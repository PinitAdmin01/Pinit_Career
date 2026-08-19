'use client';

import { JSONResume } from './resumeSchema';

export function validateEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
}

export function validatePhone(phone: string): boolean {
  if (!phone || typeof phone !== 'string') return false;
  const cleaned = phone.replace(/[\s().+\-]/g, '');
  return cleaned.length >= 7 && cleaned.length <= 15 && /^\d+$/.test(cleaned);
}

export function validateUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  try {
    const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
    return Boolean(parsed.hostname && parsed.hostname.includes('.'));
  } catch {
    return false;
  }
}

export function validateRequired(val: unknown): boolean {
  if (val === null || val === undefined) return false;
  if (typeof val === 'string') return val.trim().length > 0;
  if (Array.isArray(val)) return val.length > 0;
  return true;
}

export interface ValidationIssue {
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

export const STRONG_ACTION_VERBS = [
  'architected', 'engineered', 'spearheaded', 'implemented', 'optimized',
  'developed', 'designed', 'orchestrated', 'streamlined', 'deployed',
  'refactored', 'automated', 'scaled', 'migrated', 'built',
  'established', 'accelerated', 'reduced', 'increased', 'generated'
];

export interface BulletImpactResult {
  score: number; // 0 to 100
  hasActionVerb: boolean;
  hasMetric: boolean;
  detectedVerb?: string;
  detectedMetrics: string[];
  feedback: string;
}

/**
 * Evaluates an individual resume bullet point against Google/Amazon XYZ formula
 * "Accomplished [X] as measured by [Y], by doing [Z]"
 */
export function evaluateBulletImpact(bullet: string): BulletImpactResult {
  if (!bullet || typeof bullet !== 'string' || bullet.trim().length < 10) {
    return {
      score: 10,
      hasActionVerb: false,
      hasMetric: false,
      detectedMetrics: [],
      feedback: 'Bullet is too short or empty. Use detailed accomplishment statements.'
    };
  }

  const text = bullet.trim();
  const lower = text.toLowerCase();

  // 1. Detect starting action verb
  const firstWord = lower.split(/\s+/)[0]?.replace(/[^a-z]/g, '') || '';
  const hasActionVerb = STRONG_ACTION_VERBS.includes(firstWord);
  const detectedVerb = hasActionVerb ? firstWord : undefined;

  // 2. Detect quantitative metrics (%, $, ms, K, M, B, multipliers, numbers)
  const metricRegex = /(?:\b\d+(?:\.\d+)?%|\$\d+(?:\.\d+)?[kKmMbB]?|\b\d+[kKmMbB]\b|\b\d+x\b|\b\d+\s*(?:ms|seconds|minutes|hours|days|users|requests|tps|qps|ops\/sec)\b)/g;
  const matches = text.match(metricRegex) || [];
  const hasMetric = matches.length > 0;

  // 3. Score calculation
  let score = 40; // baseline for reasonable length
  if (hasActionVerb) score += 30;
  if (hasMetric) score += 30;

  let feedback = 'Strong impact statement!';
  if (!hasActionVerb && !hasMetric) {
    feedback = 'Start with a strong past-tense action verb (e.g. "Architected", "Optimized") and include measurable numerical outcomes.';
  } else if (!hasActionVerb) {
    feedback = 'Start with a strong past-tense action verb instead of passive responsibility wording.';
  } else if (!hasMetric) {
    feedback = 'Quantify your achievement with metrics (e.g. "reduced latency by 45%", "supporting 50K DAU").';
  }

  return {
    score: Math.min(100, score),
    hasActionVerb,
    hasMetric,
    detectedVerb,
    detectedMetrics: matches,
    feedback
  };
}

export interface AtsScoreBreakdown {
  compositeScore: number;
  contactScore: number;
  structureScore: number;
  impactScore: number;
  skillsScore: number;
  issues: ValidationIssue[];
  bulletAnalyses: Array<{ bullet: string; result: BulletImpactResult }>;
}

/**
 * Calculates complete ATS compliance score & validation report
 */
export function calculateAtsReadiness(resume: JSONResume): AtsScoreBreakdown {
  const issues: ValidationIssue[] = [];
  let contactScore = 0;
  let structureScore = 0;
  let impactScore = 0;
  let skillsScore = 0;

  // 1. Contacts (25 max)
  if (resume?.basics?.name?.trim()) contactScore += 10;
  else issues.push({ field: 'basics.name', message: 'Full name is missing.', severity: 'error' });

  if (validateEmail(resume?.basics?.email)) contactScore += 10;
  else issues.push({ field: 'basics.email', message: 'Valid email address is missing.', severity: 'error' });

  if (resume?.basics?.phone && validatePhone(resume.basics.phone)) contactScore += 5;

  // 2. Structure & Sections (25 max)
  const hasEducation = Array.isArray(resume?.education) && resume.education.length > 0;
  const hasExperience = Array.isArray(resume?.work) && resume.work.length > 0;
  const hasProjects = Array.isArray(resume?.projects) && resume.projects.length > 0;

  if (hasEducation) structureScore += 10;
  else issues.push({ field: 'education', message: 'Education section is missing or empty.', severity: 'warning' });

  if (hasExperience || hasProjects) structureScore += 15;
  else issues.push({ field: 'experience', message: 'Add at least one work experience or technical project.', severity: 'error' });

  // 3. Skills (25 max)
  const totalKeywords = (resume?.skills || []).flatMap(s => s.keywords || []).length;
  if (totalKeywords >= 8) skillsScore = 25;
  else if (totalKeywords >= 4) skillsScore = 15;
  else if (totalKeywords > 0) skillsScore = 10;
  else issues.push({ field: 'skills', message: 'Include relevant technical skills for ATS keyword matching.', severity: 'error' });

  // 4. Impact Scoring on Experience & Project Bullets (25 max)
  const allBullets = [
    ...(resume?.work || []).flatMap(w => w.highlights || []),
    ...(resume?.projects || []).flatMap(p => p.highlights || [])
  ];

  const bulletAnalyses = allBullets.map(b => ({
    bullet: b,
    result: evaluateBulletImpact(b)
  }));

  if (bulletAnalyses.length > 0) {
    const avgBulletScore = bulletAnalyses.reduce((acc, curr) => acc + curr.result.score, 0) / bulletAnalyses.length;
    impactScore = Math.round((avgBulletScore / 100) * 25);
  } else {
    impactScore = 0;
    issues.push({ field: 'highlights', message: 'No bullet points provided in work or projects.', severity: 'warning' });
  }

  const compositeScore = contactScore + structureScore + impactScore + skillsScore;

  return {
    compositeScore,
    contactScore,
    structureScore,
    impactScore,
    skillsScore,
    issues,
    bulletAnalyses
  };
}
