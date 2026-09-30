import { z } from 'zod';
import { askForJson } from '@/lib/server/llmJson';

export const CodeReviewScoresSchema = z.object({
  correctness: z.number().int().min(1).max(5),
  readability: z.number().int().min(1).max(5),
  edgeCases: z.number().int().min(1).max(5),
  naming: z.number().int().min(1).max(5),
});

export const CodeReviewSchema = z.object({
  scores: CodeReviewScoresSchema,
  strengths: z.array(z.string().min(3)).min(2).max(4),
  improvements: z.array(z.string().min(3)).min(2).max(4),
});

export type CodeReview = z.infer<typeof CodeReviewSchema>;

export interface BuildReviewPromptOptions {
  title: string;
  brief: string;
  starterCode?: string;
  code: string;
  language?: string;
}

/**
 * Builds system and user prompts for reviewing a passed ticket solution.
 *
 * CRITICAL SECURITY INVARIANT (T-17 / NFR-SEC-1):
 * - hidden_tests MUST NEVER be included in the prompt.
 * - reference_solution MUST NEVER be included in the prompt.
 */
export function buildCodeReviewPrompt(opts: BuildReviewPromptOptions): {
  system: string;
  user: string;
} {
  const language = opts.language || 'python';
  const system = `You are a Senior Staff Software Engineer and Tech Lead conducting a constructive, encouraging code review for an intern whose solution just passed all automated checks.

CRITICAL INSTRUCTIONS:
1. Provide a constructive evaluation focusing on code quality, clean architecture, readability, naming conventions, and idiomatic practices.
2. The review is advice only; the code already passed all functional tests.
3. Respond ONLY with a valid JSON object matching this schema:
   {
     "scores": {
       "correctness": <integer 1-5>,
       "readability": <integer 1-5>,
       "edgeCases": <integer 1-5>,
       "naming": <integer 1-5>
     },
     "strengths": [
       "<specific strength 1>",
       "<specific strength 2>"
     ],
     "improvements": [
       "<actionable suggestion 1>",
       "<actionable suggestion 2>"
     ]
   }
4. DO NOT include markdown formatting or backticks around the JSON.`;

  const user = `Ticket Title: ${opts.title}
Ticket Brief:
${opts.brief}

${opts.starterCode ? `Initial Starter Code:\n\`\`\`${language}\n${opts.starterCode}\n\`\`\`\n` : ''}
Student's Passing Solution:
\`\`\`${language}
${opts.code}
\`\`\`

Please review this solution now and return the JSON evaluation.`;

  return { system, user };
}

export interface GenerateCodeReviewOptions extends BuildReviewPromptOptions {
  timeoutMs?: number;
  model?: string;
}

/**
 * Generates an AI code review for a passed internship ticket (FR-T1-6 / T-17).
 * Does not block for more than 20 seconds.
 * Returns null if review generation fails or times out.
 */
export async function generateCodeReview(
  opts: GenerateCodeReviewOptions
): Promise<CodeReview | null> {
  const timeoutMs = Math.min(Math.max(opts.timeoutMs ?? 18000, 1000), 20000);
  const { system, user } = buildCodeReviewPrompt(opts);

  let timer: NodeJS.Timeout | null = null;
  const timeoutPromise = new Promise<null>((resolve) => {
    timer = setTimeout(() => resolve(null), timeoutMs);
  });

  const reviewPromise = (async (): Promise<CodeReview | null> => {
    try {
      const res = await askForJson({
        schema: CodeReviewSchema,
        system,
        user,
        maxTokens: 1000,
        model: opts.model,
      });
      if (res.ok) {
        return res.data;
      }
      return null;
    } catch {
      return null;
    } finally {
      if (timer) clearTimeout(timer);
    }
  })();

  return Promise.race([reviewPromise, timeoutPromise]);
}
