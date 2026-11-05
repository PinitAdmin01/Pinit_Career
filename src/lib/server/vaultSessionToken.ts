import crypto from 'crypto';

const GLOBAL_KEY = '__pinitVaultEphemeralSecret';

export function getVaultSecret(): string {
  const secret =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.EXAM_SECRET ||
    process.env.NEXTAUTH_SECRET;
  if (!secret && process.env.NODE_ENV === 'production') {
    throw new Error('[FATAL] Vault signing secret must be configured in production.');
  }
  if (secret) return secret;
  const g = globalThis as Record<string, unknown>;
  if (typeof g[GLOBAL_KEY] !== 'string' || !g[GLOBAL_KEY]) {
    g[GLOBAL_KEY] = crypto.randomBytes(32).toString('hex');
  }
  return g[GLOBAL_KEY] as string;
}

export interface VaultTokenPayload {
  uid: string;
  email?: string;
  displayName?: string;
  role: string;
  exp: number;
}

export function signVaultSessionToken(payload: VaultTokenPayload): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT', iss: 'pinit-vault' })).toString('base64url');
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', getVaultSecret())
    .update(`${header}.${body}`)
    .digest('base64url');
  return `${header}.${body}.${signature}`;
}

export function verifyVaultSessionToken(token: string): VaultTokenPayload | null {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [headerB64, bodyB64, sigB64] = parts;
  if (!headerB64 || !bodyB64 || !sigB64) return null;

  try {
    const headerJson = JSON.parse(Buffer.from(headerB64, 'base64url').toString('utf8'));
    if (headerJson?.alg !== 'HS256') return null;

    const expectedSig = crypto
      .createHmac('sha256', getVaultSecret())
      .update(`${headerB64}.${bodyB64}`)
      .digest('base64url');

    const a = Buffer.from(sigB64);
    const b = Buffer.from(expectedSig);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
      return null;
    }

    const payload = JSON.parse(Buffer.from(bodyB64, 'base64url').toString('utf8')) as VaultTokenPayload;
    if (!payload || typeof payload.uid !== 'string' || !payload.uid) return null;
    if (typeof payload.exp !== 'number' || payload.exp <= Date.now()) return null;

    return payload;
  } catch {
    return null;
  }
}
