import crypto from 'crypto';

const EXAM_SIGNING_SECRET =
  process.env.EXAM_SECRET ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXTAUTH_SECRET ||
  'pinit_socratic_exam_auth_key_sec_2026';

export interface ExamSessionPayload {
  answers: Record<string, number>;
  expiresAt: number;
  nonce: string;
}

/**
 * Signs an exam answer map into a tamper-evident session token.
 * Contains no plaintext question indices readable by clients without verification.
 */
export function signExamSessionToken(answersMap: Record<string, number>, durationMinutes = 30): string {
  const payload: ExamSessionPayload = {
    answers: answersMap,
    expiresAt: Date.now() + durationMinutes * 60 * 1000,
    nonce: crypto.randomBytes(8).toString('hex'),
  };
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', EXAM_SIGNING_SECRET).update(data).digest('base64url');
  return `${data}.${sig}`;
}

/**
 * Validates cryptographic signature and expiration of an exam session token.
 */
export function verifyExamSessionToken(
  token: string
): { valid: true; answers: Record<string, number> } | { valid: false; error: string } {
  if (!token || typeof token !== 'string' || !token.includes('.')) {
    return { valid: false, error: 'Invalid exam token structure.' };
  }

  const parts = token.split('.');
  if (parts.length !== 2) {
    return { valid: false, error: 'Malformed exam token payload.' };
  }

  const [data, sig] = parts;
  const expectedSig = crypto.createHmac('sha256', EXAM_SIGNING_SECRET).update(data).digest('base64url');

  if (sig !== expectedSig) {
    return { valid: false, error: 'Cryptographic signature mismatch. Possible tampering detected.' };
  }

  try {
    const payload: ExamSessionPayload = JSON.parse(Buffer.from(data, 'base64url').toString('utf-8'));
    if (Date.now() > payload.expiresAt) {
      return { valid: false, error: 'Exam session expired. Please regenerate questions.' };
    }
    if (!payload.answers || typeof payload.answers !== 'object') {
      return { valid: false, error: 'Invalid answers envelope.' };
    }
    return { valid: true, answers: payload.answers };
  } catch {
    return { valid: false, error: 'Failed to decode exam token data.' };
  }
}
