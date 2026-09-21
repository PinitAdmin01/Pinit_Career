// src/lib/interview/evaluationSignature.ts
// Server-Authoritative Cryptographic Evaluation Signature & Verification
// Prevents clients from injecting arbitrary scores or verdicts into session history.

import crypto from 'crypto';
import { ROLE_RUBRIC_VERSION } from './scoringMatrix';

export function createEvaluationSignature(userId: string, score: number, verdict: string): string {
  if (!userId) return '';
  function getInterviewSigningSecret(): string {
  const secret = process.env.NEXTAUTH_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (secret && secret.trim().length > 0) return secret;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('[FATAL] NEXTAUTH_SECRET or SUPABASE_SERVICE_ROLE_KEY must be configured in production for interview signing.');
  }
  if (!(globalThis as any).__pinit_ephemeral_interview_secret) {
    (globalThis as any).__pinit_ephemeral_interview_secret = require('crypto').randomBytes(32).toString('hex');
  }
  return (globalThis as any).__pinit_ephemeral_interview_secret;
}
const secret = getInterviewSigningSecret();
  const payload = `${userId}:${Math.round(score)}:${verdict}:${ROLE_RUBRIC_VERSION}`;
  return crypto.createHmac('sha256', secret).update(payload).digest('hex');
}

export function verifyEvaluationSignature(
  userId: string,
  score: number,
  verdict: string,
  token?: string
): boolean {
  if (!userId || !token || typeof token !== 'string') return false;
  const expected = createEvaluationSignature(userId, score, verdict);
  try {
    return crypto.timingSafeEqual(Buffer.from(token, 'hex'), Buffer.from(expected, 'hex'));
  } catch {
    return false;
  }
}
