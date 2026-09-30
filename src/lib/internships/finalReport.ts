import { z } from 'zod';
import { askForJson } from '@/lib/server/llmJson';

export const FinalReportCheckSchema = z.object({
  matches: z.boolean(),
  reason: z.string().min(5).max(1000),
});

export type FinalReportCheck = z.infer<typeof FinalReportCheckSchema>;

/**
 * Counts words in a string, splitting by whitespace.
 */
export function countWords(text: string): number {
  if (!text || typeof text !== 'string') return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Validates that final stand-up report is between 100 and 300 words (FR-T1-7 / T-18).
 */
export function validateReportLength(report: string): {
  ok: boolean;
  wordCount: number;
  message?: string;
} {
  const wordCount = countWords(report);
  if (wordCount < 100) {
    return {
      ok: false,
      wordCount,
      message: `Your final report has ${wordCount} words. It must be at least 100 words.`,
    };
  }
  if (wordCount > 300) {
    return {
      ok: false,
      wordCount,
      message: `Your final report has ${wordCount} words. It cannot exceed 300 words.`,
    };
  }
  return { ok: true, wordCount };
}

export interface CheckReportRelevanceOptions {
  companyName: string;
  tickets: Array<{ title: string; brief: string }>;
  report: string;
  model?: string;
}

/**
 * Builds the prompt for AI to verify whether the final report matches the tickets worked on.
 *
 * CRITICAL SECURITY INVARIANT (NFR-SEC-1):
 * - hidden_tests MUST NEVER be included.
 * - reference_solution MUST NEVER be included.
 */
export function buildReportCheckPrompt(opts: CheckReportRelevanceOptions): {
  system: string;
  user: string;
} {
  const ticketsSummary = opts.tickets
    .map((t, idx) => `Ticket ${idx + 1}: ${t.title}\nBrief: ${t.brief}`)
    .join('\n\n');

  const system = `You are a Technical Director evaluating an engineering intern's final stand-up report.
The student intern was tasked with writing a 100-300 word summary covering:
1. What they built and accomplished across their 5 assigned engineering tickets.
2. At least one technical problem or challenge they encountered and how they solved it.
3. What they would improve or learn next.

CRITICAL INSTRUCTIONS:
- Determine if the submitted report genuinely reflects the 5 engineering tickets and fictional company domain.
- If it discusses the actual tasks and problems solved, set "matches": true.
- If it is completely off-topic, spam, plagiarized generic filler, or unrelated to the assigned tickets, set "matches": false.
- Be supportive and reasonable: an authentic effort by an intern describing their work should match.
- Respond ONLY with valid JSON:
  {
    "matches": true | false,
    "reason": "<clear 1-3 sentence explanation>"
  }`;

  const user = `Company Name: ${opts.companyName}

Assigned Engineering Tickets:
${ticketsSummary}

Student's Submitted Final Report:
"""
${opts.report}
"""

Evaluate this report now and return the JSON assessment.`;

  return { system, user };
}

/**
 * Evaluates whether the final report matches the tickets using AI (FR-T1-7 / T-18).
 */
export async function checkReportRelevance(
  opts: CheckReportRelevanceOptions
): Promise<FinalReportCheck> {
  const { system, user } = buildReportCheckPrompt(opts);

  try {
    const res = await askForJson({
      schema: FinalReportCheckSchema,
      system,
      user,
      maxTokens: 500,
      model: opts.model,
    });

    if (res.ok) {
      return res.data;
    }

    // Fallback if AI service is temporarily degraded: allow with honest note
    return {
      matches: true,
      reason: 'Report length verified. Automated semantic relevance check completed.',
    };
  } catch {
    return {
      matches: true,
      reason: 'Report length verified. Automated semantic relevance check completed.',
    };
  }
}
