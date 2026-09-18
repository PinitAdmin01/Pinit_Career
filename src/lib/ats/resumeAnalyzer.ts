// src/lib/ats/resumeAnalyzer.ts
/**
 * Rigorous ATS Resume Scoring & Keyword Context Verification Engine
 * 
 * Invariants:
 * 1. Keywords alone NEVER guarantee a passing ATS score (prevents white-text keyword stuffing).
 * 2. Full credit for skills requires them to appear within impact bullet points
 *    containing past-tense action verbs and quantified numerical impact metrics.
 * 3. Repeated keywords are discounted (zero multi-count inflation).
 * 4. 4-factor scoring: Action Verbs (25%), Quantified Metrics (25%), Contextual Keywords (30%), Format (20%).
 */

export const ACTION_VERBS = new Set([
  'architected', 'engineered', 'developed', 'implemented', 'designed', 'optimized',
  'reduced', 'increased', 'accelerated', 'deployed', 'built', 'refactored',
  'migrated', 'spearheaded', 'automated', 'resolved', 'configured', 'orchestrated',
  'streamlined', 'scaled', 'benchmarked', 'profiled', 'secured', 'maintained',
  'debugged', 'eliminated', 'standardized', 'formulated', 'led', 'delivered',
  'created', 'executed', 'overhauled', 'boosted', 'generated', 'integrated'
]);

export const METRIC_REGEX = /(?:\b\d+(?:\.\d+)?%|(?:\$|₹|€|£)\s*\d+(?:\.\d+)?(?:[kmb])?\b|\b\d+\s*(?:ms|s|sec|min|hours?|days?|x|users|req\/s|rps|tps|mb|gb|tb|lpa|lakhs?|cr|crores?)\b|\b\d+\+)/i;

export interface BulletAnalysis {
  text: string;
  hasActionVerb: boolean;
  actionVerbsFound: string[];
  hasMetric: boolean;
  metricsFound: string[];
  matchedKeywords: string[];
  isHighQuality: boolean; // Has BOTH action verb and quantified metric
}

export interface AtsDetailedAnalysis {
  compositeScore: number; // 0 - 100
  factors: {
    actionVerbScore: number;    // max 25
    quantifiedMetricScore: number; // max 25
    contextualKeywordScore: number; // max 30
    formatScore: number;        // max 20
  };
  metrics: {
    totalBullets: number;
    actionVerbBullets: number;
    quantifiedBullets: number;
    highQualityBullets: number;
    stuffedKeywordsCount: number;
    keywordStuffingDetected: boolean;
  };
  matchedSkills: string[];
  missingSkills: string[];
  bulletAnalyses: BulletAnalysis[];
  recommendations: string[];
}

const COMMON_STOP_WORDS = new Set([
  'the', 'and', 'for', 'with', 'that', 'this', 'from', 'have', 'are', 'was',
  'were', 'will', 'been', 'about', 'into', 'over', 'after', 'experience',
  'responsible', 'duties', 'work', 'working', 'knowledge', 'understanding',
  'proficient', 'strong', 'good', 'skills', 'ability', 'preferred', 'required'
]);

/**
 * Extracts candidate bullet points from plain text.
 */
export function extractBulletPoints(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => {
      if (line.length < 15) return false;
      return /^([-*•–—>]|\d+\.)\s+/.test(line) || /^[A-Z][a-z]+ed\b/.test(line);
    })
    .map(line => line.replace(/^([-*•–—>]|\d+\.)\s+/, '').trim());
}

/**
 * Extracts substantive technical keywords from job description.
 */
export function extractJdKeywords(jobDescription: string): string[] {
  if (!jobDescription) return [];
  const words = jobDescription
    .toLowerCase()
    .replace(/[^\w\s\.\-#+]/g, ' ')
    .split(/\s+/)
    .map(w => w.trim())
    .filter(w => w.length >= 3 && !COMMON_STOP_WORDS.has(w) && !/^\d+$/.test(w));

  return Array.from(new Set(words));
}

/**
 * Evaluates ATS compatibility with strict context-aware keyword analysis.
 */
export function analyzeResumeATS(
  resumeText: string,
  options?: {
    jobDescription?: string;
    targetRole?: string;
  }
): AtsDetailedAnalysis {
  const text = resumeText || '';
  const jd = options?.jobDescription || '';
  const bullets = extractBulletPoints(text);
  const jdKeywords = extractJdKeywords(jd);

  let actionVerbBulletsCount = 0;
  let quantifiedBulletsCount = 0;
  let highQualityBulletsCount = 0;
  const bulletAnalyses: BulletAnalysis[] = [];

  const contextuallyMatchedKeywords = new Set<string>();
  const rawMatchedKeywords = new Set<string>();

  // Check which JD keywords appear anywhere in the text
  jdKeywords.forEach(kw => {
    const regex = new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (regex.test(text)) {
      rawMatchedKeywords.add(kw);
    }
  });

  // Evaluate each bullet point individually
  bullets.forEach(bullet => {
    const lowerBullet = bullet.toLowerCase();
    const words = lowerBullet.replace(/[^\w\s]/g, ' ').split(/\s+/);
    const foundVerbs = words.filter(w => ACTION_VERBS.has(w));
    const hasActionVerb = foundVerbs.length > 0;

    const metricMatch = bullet.match(METRIC_REGEX);
    const hasMetric = Boolean(metricMatch);
    const metricsFound = metricMatch ? [metricMatch[0]] : [];

    // Check which JD keywords are contained INSIDE this high-structure bullet
    const matchedInBullet = jdKeywords.filter(kw => {
      const regex = new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      return regex.test(lowerBullet);
    });

    if (hasActionVerb && hasMetric) {
      matchedInBullet.forEach(kw => contextuallyMatchedKeywords.add(kw));
    }

    if (hasActionVerb) actionVerbBulletsCount++;
    if (hasMetric) quantifiedBulletsCount++;
    if (hasActionVerb && hasMetric) highQualityBulletsCount++;

    bulletAnalyses.push({
      text: bullet,
      hasActionVerb,
      actionVerbsFound: foundVerbs,
      hasMetric,
      metricsFound,
      matchedKeywords: matchedInBullet,
      isHighQuality: hasActionVerb && hasMetric,
    });
  });

  const totalBullets = Math.max(1, bullets.length);

  // 1. Action Verb Factor (max 25)
  const verbRatio = Math.min(1.0, actionVerbBulletsCount / totalBullets);
  const actionVerbScore = Math.round(verbRatio * 25);

  // 2. Quantified Metric Factor (max 25)
  const metricRatio = Math.min(1.0, quantifiedBulletsCount / totalBullets);
  const quantifiedMetricScore = Math.round(metricRatio * 25);

  // 3. Contextual Keyword Factor (max 30)
  // Keywords in structured bullets earn 100% weight; raw keywords outside earn 20% max
  const targetCount = Math.max(5, Math.min(25, jdKeywords.length || 10));
  const structuredRatio = Math.min(1.0, contextuallyMatchedKeywords.size / targetCount);
  const rawUnstructuredCount = Math.max(0, rawMatchedKeywords.size - contextuallyMatchedKeywords.size);
  const unstructuredPenaltyBonus = Math.min(0.2, (rawUnstructuredCount * 0.02));

  // Anti-Cheat: Detect keyword stuffing (e.g. 50+ raw matched keywords but 0 metrics / 0 verbs)
  const isKeywordStuffing = rawMatchedKeywords.size >= 10 && (verbRatio < 0.1 || metricRatio < 0.1);
  let contextualKeywordScore = isKeywordStuffing
    ? Math.round(structuredRatio * 15) // Halve keyword credit on stuffing
    : Math.round(Math.min(1.0, structuredRatio + unstructuredPenaltyBonus) * 30);

  // 4. Format & Sections Factor (max 20)
  let formatScore = 10;
  if (/education|academic/i.test(text)) formatScore += 3;
  if (/experience|employment|work\s+history/i.test(text)) formatScore += 4;
  if (/projects?|technical\s+portfolio/i.test(text)) formatScore += 3;

  const compositeScore = Math.min(100, Math.max(0,
    actionVerbScore + quantifiedMetricScore + contextualKeywordScore + formatScore
  ));

  const recommendations: string[] = [];
  if (verbRatio < 0.6) {
    recommendations.push('Begin more bullet points with past-tense power verbs (e.g., "Engineered", "Optimized", "Architected").');
  }
  if (metricRatio < 0.4) {
    recommendations.push('Add quantified metrics (percentages, latency ms, scale counts) to at least 50% of your experience bullets.');
  }
  if (isKeywordStuffing) {
    recommendations.push('Warning: Keyword stuffing detected without demonstrable impact context. Weave required skills into action-oriented project bullets.');
  }
  if (bullets.length < 4) {
    recommendations.push('Expand your experience and project sections with structured, bulleted impact statements.');
  }

  return {
    compositeScore,
    factors: {
      actionVerbScore,
      quantifiedMetricScore,
      contextualKeywordScore,
      formatScore,
    },
    metrics: {
      totalBullets: bullets.length,
      actionVerbBullets: actionVerbBulletsCount,
      quantifiedBullets: quantifiedBulletsCount,
      highQualityBullets: highQualityBulletsCount,
      stuffedKeywordsCount: rawUnstructuredCount,
      keywordStuffingDetected: isKeywordStuffing,
    },
    matchedSkills: Array.from(contextuallyMatchedKeywords),
    missingSkills: jdKeywords.filter(kw => !contextuallyMatchedKeywords.has(kw)).slice(0, 10),
    bulletAnalyses,
    recommendations,
  };
}

/**
 * Calculates keyword repetition density to catch blatant stuffing hacks.
 */
export function calculateKeywordDensity(text: string, keywords: string[]): Record<string, number> {
  const lower = (text || '').toLowerCase();
  const words = lower.split(/\s+/).filter(Boolean);
  const total = Math.max(1, words.length);
  const density: Record<string, number> = {};
  for (const kw of keywords) {
    const kwLower = kw.toLowerCase();
    const regex = new RegExp(`\\b${kwLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    const matches = lower.match(regex);
    density[kw] = matches ? matches.length / total : 0;
  }
  return density;
}

/**
 * Convenience wrapper returning structured scores, breakdowns, and stuffing penalties.
 */
export function analyzeResumeContent(
  resumeText: string,
  targetSkills: string[] = []
) {
  const analysis = analyzeResumeATS(resumeText, {
    jobDescription: targetSkills.join(' '),
  });

  const densities = calculateKeywordDensity(resumeText, targetSkills);
  let highestDensity = 0;
  for (const d of Object.values(densities)) {
    if (d > highestDensity) highestDensity = d;
  }

  // Keyword stuffing penalty if density exceeds 7% or raw keywords dumped without action verbs
  const stuffingPenalty = analysis.metrics.keywordStuffingDetected || highestDensity > 0.07
    ? Math.max(20, Math.round(highestDensity * 120))
    : 0;

  const totalScore = Math.max(0, Math.min(100, analysis.compositeScore - stuffingPenalty));

  return {
    totalScore,
    compositeScore: analysis.compositeScore,
    breakdown: {
      actionVerbsScore: Math.round((analysis.factors.actionVerbScore / 25) * 100),
      quantifiedMetricsScore: Math.round((analysis.factors.quantifiedMetricScore / 25) * 100),
      contextualKeywordsScore: Math.round((analysis.factors.contextualKeywordScore / 30) * 100),
      formatScore: Math.round((analysis.factors.formatScore / 20) * 100),
    },
    factors: analysis.factors,
    metrics: analysis.metrics,
    penalties: {
      keywordStuffingPenalty: stuffingPenalty,
    },
    matchedSkills: analysis.matchedSkills,
    missingSkills: analysis.missingSkills,
    bulletAnalyses: analysis.bulletAnalyses,
    recommendations: analysis.recommendations,
  };
}

