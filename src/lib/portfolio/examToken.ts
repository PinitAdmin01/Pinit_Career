import crypto from 'crypto';

function getExamSigningSecret(): string {
  const secret =
    process.env.EXAM_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXTAUTH_SECRET;

  if (secret && secret.trim().length > 0) {
    return secret;
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error('[FATAL] EXAM_SECRET must be configured in production environment.');
  }

  // Non-production runtime: derive a secure in-process dynamic key (never hardcoded static string in repo)
  if (!(globalThis as any).__pinit_ephemeral_exam_secret) {
    (globalThis as any).__pinit_ephemeral_exam_secret = crypto.randomBytes(32).toString('hex');
    console.warn('[SECURITY NOTICE] EXAM_SECRET not found; generated ephemeral runtime signing key for dev/test.');
  }
  return (globalThis as any).__pinit_ephemeral_exam_secret;
}

function deriveAesKey(secret: string): Buffer {
  return crypto.createHash('sha256').update(secret).digest();
}

function encryptAnswers(answers: Record<string, number>, secret: string): string {
  const key = deriveAesKey(secret);
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const jsonStr = JSON.stringify(answers);
  const encrypted = Buffer.concat([cipher.update(jsonStr, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString('base64url')}:${tag.toString('base64url')}:${encrypted.toString('base64url')}`;
}

function decryptAnswers(encryptedStr: string, secret: string): Record<string, number> | null {
  try {
    const [ivStr, tagStr, encStr] = encryptedStr.split(':');
    if (!ivStr || !tagStr || !encStr) return null;
    const key = deriveAesKey(secret);
    const iv = Buffer.from(ivStr, 'base64url');
    const tag = Buffer.from(tagStr, 'base64url');
    const enc = Buffer.from(encStr, 'base64url');
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(tag);
    const decrypted = Buffer.concat([decipher.update(enc), decipher.final()]);
    return JSON.parse(decrypted.toString('utf8'));
  } catch {
    return null;
  }
}

export interface ExamSessionPayload {
  encryptedAnswers: string;
  answerHashes?: Record<string, string>;
  expiresAt: number;
  nonce: string;
  studentId?: string;
  certificateTitle?: string;
}

/**
 * Signs an exam answer map into an encrypted, tamper-evident session token.
 * Contains NO plaintext answers or question indices readable by clients.
 */
export function signExamSessionToken(
  answersMap: Record<string, number>,
  durationMinutes = 30,
  studentId?: string,
  certificateTitle?: string
): string {
  const secret = getExamSigningSecret();
  const encryptedAnswers = encryptAnswers(answersMap, secret);

  // Also compute HMAC hashes per question for tamper-evident verification
  const answerHashes: Record<string, string> = {};
  for (const [qId, optIdx] of Object.entries(answersMap)) {
    answerHashes[qId] = crypto.createHmac('sha256', secret).update(`${qId}:${optIdx}`).digest('hex');
  }

  const payload: ExamSessionPayload = {
    encryptedAnswers,
    answerHashes,
    expiresAt: Date.now() + durationMinutes * 60 * 1000,
    nonce: crypto.randomBytes(8).toString('hex'),
    ...(studentId ? { studentId } : {}),
    ...(certificateTitle ? { certificateTitle } : {}),
  };

  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', secret).update(data).digest('base64url');
  return `${data}.${sig}`;
}

// Global runtime consumed nonces store with automatic TTL expiration
const CONSUMED_NONCES_TTL_MS = 35 * 60 * 1000; // 35 minutes (tokens expire in 30 min)
const consumedNoncesMap: Map<string, number> = ((globalThis as any).__pinit_consumed_exam_nonces ??= new Map<string, number>());

function purgeExpiredNonces(): void {
  const cutoff = Date.now() - CONSUMED_NONCES_TTL_MS;
  for (const [nonce, timestamp] of consumedNoncesMap.entries()) {
    if (timestamp < cutoff) {
      consumedNoncesMap.delete(nonce);
    }
  }
}

export function isNonceConsumed(nonce: string): boolean {
  purgeExpiredNonces();
  return consumedNoncesMap.has(nonce);
}

export function markNonceConsumed(nonce: string): void {
  purgeExpiredNonces();
  consumedNoncesMap.set(nonce, Date.now());
}

/**
 * Validates cryptographic HMAC signature, expiration, and decrypts answers with AES-256-GCM.
 */
export function verifyExamSessionToken(
  token: string
): { valid: true; answers: Record<string, number>; studentId?: string; certificateTitle?: string; nonce?: string } | { valid: false; error: string; code?: string } {
  if (!token || typeof token !== 'string' || !token.includes('.')) {
    return { valid: false, error: 'Invalid exam token structure.' };
  }

  const parts = token.split('.');
  if (parts.length !== 2) {
    return { valid: false, error: 'Malformed exam token payload.' };
  }

  const [data, sig] = parts;
  const secret = getExamSigningSecret();
  const expectedSig = crypto.createHmac('sha256', secret).update(data).digest('base64url');

  const sigBuf = Buffer.from(sig);
  const expectedBuf = Buffer.from(expectedSig);
  if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
    return { valid: false, error: 'Cryptographic signature mismatch. Possible tampering detected.' };
  }

  try {
    const payload: ExamSessionPayload = JSON.parse(Buffer.from(data, 'base64url').toString('utf-8'));
    if (Date.now() > payload.expiresAt) {
      return { valid: false, error: 'Exam session expired. Please regenerate questions.' };
    }

    let answers: Record<string, number> | null = null;
    if (payload.encryptedAnswers) {
      answers = decryptAnswers(payload.encryptedAnswers, secret);
    } else if ((payload as any).answers) {
      // Backward compatibility fallback for legacy in-flight tokens
      answers = (payload as any).answers;
    }

    if (!answers || typeof answers !== 'object') {
      return { valid: false, error: 'Failed to decrypt or decode answers from token.' };
    }

    return { valid: true, answers, studentId: payload.studentId, certificateTitle: payload.certificateTitle, nonce: payload.nonce };
  } catch {
    return { valid: false, error: 'Failed to decode exam token data.' };
  }
}

/**
 * Verifies token cryptographically AND atomically consumes the single-use nonce.
 * Defends against replay and oracle attacks: a token can only be submitted once.
 */
export function verifyAndConsumeExamSessionToken(
  token: string
): { valid: true; answers: Record<string, number>; studentId?: string; certificateTitle?: string; nonce: string } | { valid: false; error: string; code?: string } {
  const result = verifyExamSessionToken(token);
  if (!result.valid) {
    return result;
  }

  const nonce = result.nonce;
  if (!nonce) {
    return { valid: false, error: 'Session token lacks security nonce.', code: 'MISSING_NONCE' };
  }

  if (isNonceConsumed(nonce)) {
    return {
      valid: false,
      error: 'NONCE_REPLAY_DETECTED: This exam session token has already been evaluated and cannot be reused.',
      code: 'NONCE_REPLAY'
    };
  }

  // Atomically mark nonce as consumed
  markNonceConsumed(nonce);

  return {
    valid: true,
    answers: result.answers,
    studentId: result.studentId,
    certificateTitle: result.certificateTitle,
    nonce
  };
}
