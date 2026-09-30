import crypto from 'crypto';

/**
 * Signed proof that the server itself graded a quest as passed (for example a course test marked
 * by /api/quests/grade-test). /api/quest/complete only records quests that need proof when the
 * request carries a receipt for that student and that quest, so a pass cannot be claimed by
 * calling the completion endpoint directly.
 *
 * Receipt format: `${issuedAtMs}.${hmacHex}` over `${userId}|${questId}|${issuedAtMs}`.
 */

/** How long a receipt can be used after it was issued (it is sent straight after grading). */
export const RECEIPT_TTL_MS = 24 * 60 * 60 * 1000;

function receiptSecret(): string {
  const secret = process.env.NEXTAUTH_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (secret && secret.trim()) return secret;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('NEXTAUTH_SECRET or SUPABASE_SERVICE_ROLE_KEY must be set to sign pass receipts.');
  }
  return 'dev-only-pass-receipt-secret';
}

const sign = (userId: string, questId: string, issuedAt: number, secret: string) =>
  crypto.createHmac('sha256', secret).update(`pass-receipt|${userId}|${questId}|${issuedAt}`).digest('hex');

export function signPassReceipt(userId: string, questId: string, now = Date.now(), secret = receiptSecret()): string {
  return `${now}.${sign(userId, questId, now, secret)}`;
}

export function verifyPassReceipt(
  receipt: unknown,
  userId: string,
  questId: string,
  now = Date.now(),
  secret = receiptSecret()
): boolean {
  if (typeof receipt !== 'string') return false;
  const match = receipt.match(/^(\d{13})\.([0-9a-f]{64})$/);
  if (!match) return false;
  const issuedAt = Number(match[1]);
  if (!(issuedAt <= now + 60_000 && now - issuedAt <= RECEIPT_TTL_MS)) return false;
  const expected = sign(userId, questId, issuedAt, secret);
  return crypto.timingSafeEqual(Buffer.from(match[2], 'hex'), Buffer.from(expected, 'hex'));
}
