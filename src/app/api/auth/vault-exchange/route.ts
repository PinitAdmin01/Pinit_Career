import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getUserProfile } from '@/lib/supabaseService';

const devEphemeralKey = crypto.randomBytes(32).toString('hex');

export function getVaultSecret(): string {
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.EXAM_SECRET || process.env.NEXTAUTH_SECRET;
  if (!secret && process.env.NODE_ENV === 'production') {
    throw new Error('[FATAL] Vault signing secret must be configured in production.');
  }
  return secret || devEphemeralKey;
}

function signSessionToken(payload: { uid: string; email?: string; role: string; exp: number }): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', getVaultSecret())
    .update(`${header}.${body}`)
    .digest('base64url');
  return `${header}.${body}.${signature}`;
}

export async function POST(req: NextRequest) {
  try {
    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'INVALID_JSON', message: 'Malformed JSON payload' }, { status: 400 });
    }

    const { userPayload, ticket } = body || {};
    const rawUser = userPayload || body.user;

    if (!rawUser || !rawUser.id) {
      return NextResponse.json(
        { error: 'INVALID_PAYLOAD', message: 'Valid user identifier required for vault exchange' },
        { status: 400 }
      );
    }

    const emailLower = String(rawUser.email || rawUser.username || '').toLowerCase();
    let role = 'student';

    // Authoritative role resolution on server: fetch role from Supabase
    try {
      const dbProfile = await getUserProfile(rawUser.id);
      if (dbProfile?.role) {
        role = dbProfile.role as string;
      }
    } catch {
      role = 'student';
    }

    const sanitizedUser = {
      id: rawUser.id,
      email: rawUser.email || (rawUser.username ? `${rawUser.username}@pinit.app` : 'user@pinit.app'),
      username: rawUser.username || rawUser.name || emailLower.split('@')[0] || 'user',
      displayName: rawUser.displayName || rawUser.name || 'Student',
      role,
      isDevUser: Boolean(rawUser.isDevUser),
      identityStatus: rawUser.identityStatus || 'Active'
    };

    const exp = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
    const signedToken = signSessionToken({
      uid: sanitizedUser.id,
      email: sanitizedUser.email,
      role: sanitizedUser.role,
      exp
    });

    const isProd = process.env.NODE_ENV === 'production';
    const response = NextResponse.json({
      ok: true,
      success: true,
      user: sanitizedUser,
      token: signedToken,
      expiresAt: exp
    });

    // Authoritative server-side HttpOnly session cookies
    response.cookies.set('pinit_role', role, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    });

    response.cookies.set('pinit_session', 'active', {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    });

    response.cookies.set('pinit_uid', sanitizedUser.id, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { error: 'VAULT_EXCHANGE_FAILED', message: err.message || 'Failed to exchange vault session' },
      { status: 500 }
    );
  }
}
