// src/lib/interview/evaluationSignature.ts
// Server-Authoritative Cryptographic Evaluation Signature & Verification
// Prevents clients from injecting arbitrary scores or verdicts into session history.

import crypto from 'crypto';
import { ROLE_RUBRIC_VERSION } from './scoringMatrix';

function getInterviewSigningSecret(): string {
  const secret = process.env.NEXTAUTH_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (secret && secret.trim().length > 0) return secret;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('[FATAL] NEXTAUTH_SECRET or SUPABASE_SERVICE_ROLE_KEY must be configured in production for interview signing.');
  }
  const g = globalThis as { __pinit_ephemeral_interview_secret?: string };
  if (!g.__pinit_ephemeral_interview_secret) {
    g.__pinit_ephemeral_interview_secret = crypto.randomBytes(32).toString('hex');
  }
  return g.__pinit_ephemeral_interview_secret;
}

const sign = (payload: string) => crypto.createHmac('sha256', getInterviewSigningSecret()).update(payload).digest('hex');

function safeEqualHex(token: string, expected: string): boolean {
  try {
    const a = Buffer.from(token, 'hex');
    const b = Buffer.from(expected, 'hex');
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function createEvaluationSignature(userId: string, score: number, verdict: string): string {
  if (!userId) return '';
  return sign(`${userId}:${Math.round(score)}:${verdict}:${ROLE_RUBRIC_VERSION}`);
}

export function verifyEvaluationSignature(
  userId: string,
  score: number,
  verdict: string,
  token?: string
): boolean {
  if (!userId || !token || typeof token !== 'string') return false;
  return safeEqualHex(token, createEvaluationSignature(userId, score, verdict));
}

/**
 * Same result, also bound to the interview topic: a pass in one interview cannot be presented
 * as a pass in another (e.g. a course's capstone defense).
 */
export function createTopicEvaluationSignature(userId: string, score: number, verdict: string, topic: string): string {
  if (!userId || !topic) return '';
  return sign(`${userId}:${Math.round(score)}:${verdict}:${ROLE_RUBRIC_VERSION}:topic:${topic}`);
}

export function verifyTopicEvaluationSignature(
  userId: string,
  score: number,
  verdict: string,
  topic: string,
  token?: string
): boolean {
  if (!userId || !topic || !token || typeof token !== 'string') return false;
  return safeEqualHex(token, createTopicEvaluationSignature(userId, score, verdict, topic));
}
