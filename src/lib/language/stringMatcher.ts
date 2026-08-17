/**
 * PinIT Diacritic-Aware Fuzzy String Matcher with Linguistic Policy Guardrails
 * 
 * Clean-Room TypeScript String Normalization & Levenshtein Distance Evaluation
 * Supports 5 Independent Languages (English, French, Spanish, German, Japanese)
 */

export type ExerciseMatchPolicyCategory = 'vocabulary' | 'grammar' | 'japanese_script' | 'sentence_construction' | 'default';

export interface StringMatchOptions {
  alternativeAnswers?: string[];
  maxDistance?: number;
  exerciseCategory?: ExerciseMatchPolicyCategory;
  languageCode?: 'en' | 'fr' | 'es' | 'de' | 'ja';
}

export interface StringMatchResult {
  isMatch: boolean;
  distance: number;
  matchedAnswer: string;
  normalizedUser: string;
  normalizedTarget: string;
  similarityPct: number;
  policyApplied: ExerciseMatchPolicyCategory;
  effectiveMaxDistance: number;
}

/**
 * Normalizes string by stripping diacritics, curly quotes, punctuation, and extra whitespace.
 * Special character handling:
 * - German `ß` -> `ss`, `ä` -> `a`, `ö` -> `o`, `ü` -> `u`
 * - French `é/è/ê/ë` -> `e`, `à/â` -> `a`, `ç` -> `c`
 * - Spanish `ñ` -> `n`, `á/é/í/ó/ú` -> `a/e/i/o/u`, `¿/¡` -> stripped
 */
export function normalizeTextForMatching(text: string): string {
  if (!text) return '';

  return text
    .toLowerCase()
    .replace(/[\u2018\u2019\u2032']/g, "'")
    .replace(/[\u201C\u201D\u2033"]/g, '"')
    .replace(/ß/g, 'ss')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip accent diacritics
    .replace(/[.,;:!?¿¡\-_\(\)]/g, ' ') // strip punctuation
    .replace(/\s+/g, ' ') // collapse multi-spaces
    .trim();
}

/**
 * Computes Levenshtein edit distance between two normalized strings.
 */
export function computeLevenshteinDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Evaluates whether userInput matches targetAnswer with linguistic guardrails:
 * - Vocabulary: Tolerant (Levenshtein <= 1 allowed)
 * - Accent / Diacritic typos: Tolerant (normalized out)
 * - Grammar answers: Exact required (maxDistance = 0)
 * - Japanese script: Language-specific exact required (maxDistance = 0)
 * - Sentence construction: Configurable (tolerant for long sentences > 15 chars)
 */
export function evaluateTextMatch(
  userInput: string,
  targetAnswer: string,
  options: StringMatchOptions | string[] = {},
  deprecatedMaxDistance?: number
): StringMatchResult {
  let alternativeAnswers: string[] = [];
  let maxDistance = 1;
  let category: ExerciseMatchPolicyCategory = 'default';
  let langCode: string = 'en';

  if (Array.isArray(options)) {
    alternativeAnswers = options;
    maxDistance = deprecatedMaxDistance ?? 1;
  } else {
    alternativeAnswers = options.alternativeAnswers || [];
    maxDistance = options.maxDistance ?? 1;
    category = options.exerciseCategory || 'default';
    langCode = options.languageCode || 'en';
  }

  const normUser = normalizeTextForMatching(userInput);
  const candidates = [targetAnswer, ...alternativeAnswers];

  let bestMatch = targetAnswer;
  let minDistance = Infinity;

  for (const candidate of candidates) {
    const normCand = normalizeTextForMatching(candidate);
    const dist = computeLevenshteinDistance(normUser, normCand);
    if (dist < minDistance) {
      minDistance = dist;
      bestMatch = candidate;
    }
  }

  const normBest = normalizeTextForMatching(bestMatch);

  // Linguistic Guardrail Policy Determination
  let effectiveMaxDistance = maxDistance;

  if (category === 'grammar' || category === 'japanese_script' || langCode === 'ja') {
    // Grammar rules & Japanese Kana/Kanji script require strict exact match
    effectiveMaxDistance = 0;
  } else if (category === 'vocabulary') {
    // Vocabulary typing allows 1 typo for words >= 4 chars
    effectiveMaxDistance = normBest.length <= 3 ? 0 : 1;
  } else if (category === 'sentence_construction') {
    // Sentence construction allows 1-2 typos for long sentences (> 15 chars)
    effectiveMaxDistance = normBest.length > 15 ? 2 : (normBest.length > 6 ? 1 : 0);
  } else {
    // Default fallback: short words <= 3 chars require exact match
    effectiveMaxDistance = normBest.length <= 3 ? 0 : maxDistance;
  }

  const maxLength = Math.max(normUser.length, normBest.length, 1);
  const similarityPct = Math.max(0, Math.round(((maxLength - minDistance) / maxLength) * 100));
  const isMatch = minDistance <= effectiveMaxDistance;

  return {
    isMatch,
    distance: minDistance,
    matchedAnswer: bestMatch,
    normalizedUser: normUser,
    normalizedTarget: normBest,
    similarityPct,
    policyApplied: category,
    effectiveMaxDistance
  };
}
