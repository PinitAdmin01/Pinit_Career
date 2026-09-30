import crypto from 'crypto';
import { z } from 'zod';

/**
 * NFR-SEC-4: Supervisor evaluation tokens.
 * Token is generated once, stored as SHA-256 hash, and expires.
 */

export const SUPERVISOR_TOKEN_EXPIRY_HOURS = 72;

export const SupervisorLinkSchema = z.object({
  supervisorName: z.string().min(2, 'Supervisor name must be at least 2 characters'),
  supervisorEmail: z.string().email('Must be a valid email'),
});

export const SupervisorEvaluationSchema = z.object({
  ratings: z.object({
    technicalSkills: z.number().min(1).max(5),
    communication: z.number().min(1).max(5),
    initiative: z.number().min(1).max(5),
    professionalism: z.number().min(1).max(5),
  }),
  comments: z.string().max(2000).optional(),
});

export type SupervisorLinkInput = z.infer<typeof SupervisorLinkSchema>;
export type SupervisorEvaluationInput = z.infer<typeof SupervisorEvaluationSchema>;

/**
 * Generates a cryptographically secure token and its SHA-256 hash.
 * Only the hash is stored in the database.
 */
export function generateSupervisorToken(): { token: string; hash: string } {
  const token = crypto.randomBytes(32).toString('hex');
  const hash = crypto.createHash('sha256').update(token).digest('hex');
  return { token, hash };
}

/**
 * Hashes a token for lookup.
 */
export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

/**
 * Checks if a token has expired.
 */
export function isTokenExpired(expiresAt: string): boolean {
  return new Date(expiresAt).getTime() < Date.now();
}
