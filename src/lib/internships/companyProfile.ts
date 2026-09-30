import { z } from 'zod';
import { askForJson } from '@/lib/server/llmJson';

export const FICTIONAL_COMPANY_PREFIX =
  'This is a fictional company created for your internship simulation.';

export const CompanyProfileSchema = z.object({
  name: z.string().min(2).max(100),
  industry: z.string().min(2).max(100),
  readme: z.string().min(50).max(3000),
});

export type CompanyProfile = z.infer<typeof CompanyProfileSchema>;

export interface GenerateCompanyProfileOptions {
  tier: string;
  seed: string;
  model?: string;
  maxAttempts?: number;
}

export type GenerateCompanyProfileResult =
  | {
      ok: true;
      profile: CompanyProfile;
      model: string;
      attempts: number;
    }
  | {
      ok: false;
      reasons: string[];
    };

/**
 * Generates a fictional company profile for a student internship (FR-T1-2).
 * Strictly enforces that the README begins with the fictional company disclosure.
 */
export async function generateCompanyProfile(
  opts: GenerateCompanyProfileOptions
): Promise<GenerateCompanyProfileResult> {
  const maxAttempts = opts.maxAttempts || 3;
  const reasons: string[] = [];

  const system = `You are an AI generating a realistic but entirely fictional company profile for a software engineering internship simulation.

CRITICAL RULES:
1. OUTPUT FORMAT: Respond ONLY with a valid JSON object matching these exact keys:
   - "name": A realistic, professional fictional company name (e.g. "Apex Dispatch", "Lumina Health", "Vanguard Fleet").
   - "industry": The business domain (e.g. "Cold-chain Logistics", "Preventative Telehealth", "Clean Energy Grid Analytics").
   - "readme": A markdown introduction (100-300 words) describing the company's mission, engineering stack, and intern onboarding guide.
2. MANDATORY DISCLOSURE:
   The "readme" field MUST start with the exact sentence:
   "${FICTIONAL_COMPANY_PREFIX}"
   Any profile lacking this exact opening sentence is invalid and will be rejected.
3. NEVER use real company names, registered trademarks, or genuine customer testimonials.`;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const seed = `${opts.seed}-company-attempt-${attempt}`;
    const user = `Generate a fictional company profile for internship tier "${opts.tier}". Variation seed: ${seed}.`;

    const askRes = await askForJson({
      system,
      user,
      schema: CompanyProfileSchema,
      maxTokens: 1200,
      model: opts.model,
    });

    if (!askRes.ok) {
      reasons.push(`Attempt ${attempt} generation failed: ${askRes.reason}`);
      continue;
    }

    const trimmedReadme = askRes.data.readme.trim();
    if (!trimmedReadme.startsWith(FICTIONAL_COMPANY_PREFIX)) {
      reasons.push(
        `Attempt ${attempt} rejected: README did not start with the mandatory fictional disclosure prefix.`
      );
      continue;
    }

    return {
      ok: true,
      profile: {
        ...askRes.data,
        readme: trimmedReadme,
      },
      model: askRes.model,
      attempts: attempt,
    };
  }

  return {
    ok: false,
    reasons,
  };
}
