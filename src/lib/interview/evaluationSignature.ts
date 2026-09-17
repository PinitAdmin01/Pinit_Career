// src/lib/interview/evaluationSignature.ts
// Server-Authoritative Cryptographic Evaluation Signature & Verification
// Prevents clients from injecting arbitrary scores or verdicts into session history.

import crypto from 'crypto';
import { ROLE_RUBRIC_VERSION } from './scoringMatrix';

export function createEvaluationSignature(userId: string, score: number, verdict: string): string {
  if (!userId) return '';
  const secret = process.env.NEXTAUTH_SECRET || 'pinit-interview-secret-fallback-key';
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
