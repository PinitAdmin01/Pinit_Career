import { z } from 'zod';
import type { ClientInternshipOpportunity } from './types';

export const OpportunityKindSchema = z.enum([
  'client_project',
  'open_source',
  'industry',
  'fellowship',
]);

export const OpportunityTierSchema = z.enum([
  't1_job_sim',
  't2_virtual_team',
  't3_project',
  't4_industry',
  't5_fellowship',
]);

export const AuthenticityTierSchema = z.enum(['tier_1', 'tier_2', 'tier_3']);

export const OpportunityStatusSchema = z.enum(['draft', 'open', 'closed']);

export const CreateOpportunitySchema = z.object({
  orgName: z.string().min(2, 'Organisation name must be at least 2 characters'),
  orgWebsite: z.string().url('Must be a valid URL (e.g. https://company.com)').nullable().optional(),
  kind: OpportunityKindSchema,
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().default(''),
  minTier: OpportunityTierSchema.default('t3_project'),
  seats: z.number().int().min(1, 'Seats must be at least 1').default(1),
  paid: z.boolean().default(false),
  stipend: z.number().nonnegative('Stipend cannot be negative').nullable().optional(),
  authenticityTier: AuthenticityTierSchema.nullable().optional(),
  status: OpportunityStatusSchema.default('draft'),
});

export const UpdateOpportunitySchema = CreateOpportunitySchema.partial();

export type CreateOpportunityInput = z.infer<typeof CreateOpportunitySchema>;
export type UpdateOpportunityInput = z.infer<typeof UpdateOpportunitySchema>;

/**
 * Validates organisation authenticity against Verification Standard §6:
 * - Freemail domains (@gmail.com, @yahoo.com, etc.) cannot qualify for Tier 1 strong evidence.
 */
export function checkOrgAuthenticity(orgName: string, orgWebsite?: string | null): {
  valid: boolean;
  recommendedTier: 'tier_1' | 'tier_2' | 'tier_3';
  reasons: string[];
} {
  const reasons: string[] = [];
  if (!orgWebsite || !orgWebsite.trim()) {
    reasons.push('Missing organisation website/domain footprint.');
    return { valid: false, recommendedTier: 'tier_3', reasons };
  }

  const website = orgWebsite.toLowerCase();
  const freemails = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'];
  const hasFreemail = freemails.some((f) => website.includes(f));

  if (hasFreemail) {
    reasons.push('Organisation domain cannot be a public freemail host.');
    return { valid: false, recommendedTier: 'tier_3', reasons };
  }

  try {
    const url = new URL(orgWebsite.startsWith('http') ? orgWebsite : `https://${orgWebsite}`);
    if (!url.hostname || !url.hostname.includes('.')) {
      reasons.push('Invalid domain format.');
      return { valid: false, recommendedTier: 'tier_3', reasons };
    }
  } catch {
    reasons.push('Malformed organisation URL.');
    return { valid: false, recommendedTier: 'tier_3', reasons };
  }

  // Tier 1 strong evidence vs Tier 2 moderate evidence
  if (website.startsWith('https://') && orgName.length >= 3) {
    return {
      valid: true,
      recommendedTier: 'tier_1',
      reasons: ['Authenticated HTTPS web presence detected.'],
    };
  }

  return {
    valid: true,
    recommendedTier: 'tier_2',
    reasons: ['Registered business presence; requires triangulation and supervisor verification.'],
  };
}
