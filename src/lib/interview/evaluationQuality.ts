import { sanitizeLLMOutput } from '@/lib/sanitizeLLM';

export const ANSWER_QUALITY_DIMENSIONS = [
  'questionRelevance',
  'answerAccuracy',
  'reasoningDepth',
  'conclusionQuality',
] as const;

export type AnswerQualityDimension = (typeof ANSWER_QUALITY_DIMENSIONS)[number];

export interface AnswerQualityEvidence {
  dimension: AnswerQualityDimension;
  quote: string;
  assessment: string;
}

export interface AnswerQuality {
  questionRelevance: number | null;
  answerAccuracy: number | null;
  reasoningDepth: number | null;
  conclusionQuality: number | null;
  evidence: AnswerQualityEvidence[];
}

const clampScore = (value: unknown): number | null => {
  if (typeof value !== 'number' || !Number.isFinite(value)) return null;
  return Math.max(0, Math.min(100, Math.round(value)));
};

/**
 * Keeps answer-quality scores bounded and only exposes evidence quotes that
 * literally occur in a candidate response from the transcript.
 */
export function normalizeAnswerQuality(
  value: unknown,
  candidateAnswers: string[]
): AnswerQuality | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const raw = value as Record<string, unknown>;
  const scores = {
    questionRelevance: clampScore(raw.question_relevance),
    answerAccuracy: clampScore(raw.answer_accuracy),
    reasoningDepth: clampScore(raw.reasoning_depth),
    conclusionQuality: clampScore(raw.conclusion_quality),
  };

  if (Object.values(scores).every((score) => score === null)) return null;

  const allowedDimensions = new Set<string>(ANSWER_QUALITY_DIMENSIONS);
  const evidence = (Array.isArray(raw.evidence) ? raw.evidence : [])
    .slice(0, 6)
    .flatMap((item): AnswerQualityEvidence[] => {
      if (!item || typeof item !== 'object' || Array.isArray(item)) return [];
      const row = item as Record<string, unknown>;
      const dimension = String(row.dimension || '');
      const quote = typeof row.quote === 'string' ? row.quote.trim() : '';
      const assessment = typeof row.assessment === 'string' ? row.assessment.trim() : '';
      if (!allowedDimensions.has(dimension) || quote.length < 8 || !assessment) return [];
      if (!candidateAnswers.some((answer) => answer.includes(quote))) return [];

      return [{
        dimension: dimension as AnswerQualityDimension,
        quote: sanitizeLLMOutput(quote).slice(0, 240),
        assessment: sanitizeLLMOutput(assessment).slice(0, 320),
      }];
    });

  return { ...scores, evidence };
}
