import { NextRequest, NextResponse } from 'next/server';
import { getUserProfile } from '@/lib/supabaseService';
import { DEMO_ROLE_BY_EMAIL } from '@/lib/demoAuth';
import { getVaultSecret, signVaultSessionToken } from '@/lib/server/vaultSessionToken';

export { getVaultSecret };

export async function POST(req: NextRequest) {
  try {
    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'INVALID_JSON', message: 'Malformed JSON payload' }, { status: 400 });
    }

    const { userPayload } = body || {};
    const rawUser = userPayload || body.user;

    if (!rawUser || !rawUser.id) {
      return NextResponse.json(
        { error: 'INVALID_PAYLOAD', message: 'Valid user identifier required for vault exchange' },
        { status: 400 }
      );
    }

    const emailLower = String(rawUser.email || rawUser.username || '').toLowerCase();
    const rawRole = typeof rawUser.role === 'string' ? rawUser.role.trim().toLowerCase() : '';
    let role = rawRole || DEMO_ROLE_BY_EMAIL[emailLower] || 'student';

    // Authoritative role resolution on server: fetch role from Supabase if stored
    try {
      const dbProfile = await getUserProfile(rawUser.id);
      if (dbProfile?.role) {
        role = dbProfile.role as string;
      }
    } catch {
      // Keep verified requested role or demo role
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
    const signedToken = signVaultSessionToken({
      uid: sanitizedUser.id,
      email: sanitizedUser.email,
      displayName: sanitizedUser.displayName,
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
