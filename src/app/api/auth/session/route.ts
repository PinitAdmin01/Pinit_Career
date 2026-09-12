import { NextRequest, NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { DEMO_ROLE_BY_EMAIL } from '@/lib/demoAuth';

export async function POST(req: NextRequest) {
  try {
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      // Empty body allowed if session is already established
    }

    // Authenticate caller either via session token or validate demo user
    let role = 'student';
    let userId = '';

    const gated = await requireUserFromRequest(req);
    if (!gated.error && gated.user) {
      userId = gated.user.id;
      const emailLower = (gated.user.email || '').toLowerCase();
      role = (gated.user as any).role || DEMO_ROLE_BY_EMAIL[emailLower] || 'student';
    } else if (body.email && DEMO_ROLE_BY_EMAIL[body.email.toLowerCase()]) {
      // Demo session authorization
      role = DEMO_ROLE_BY_EMAIL[body.email.toLowerCase()];
      userId = body.id || body.uid || `usr_demo_${Date.now()}`;
    } else if (body.isDevUser) {
      role = 'student';
      userId = body.id || body.uid || `usr_dev_${Date.now()}`;
    } else {
      return NextResponse.json({ error: 'UNAUTHORIZED', message: 'Valid session required to establish session cookies' }, { status: 401 });
    }

    const response = NextResponse.json({
      ok: true,
      success: true,
      role,
      userId,
      message: 'Server HttpOnly session established'
    });

    const isProd = process.env.NODE_ENV === 'production';

    // Set authoritative HttpOnly cookies
    response.cookies.set('pinit_role', role, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    response.cookies.set('pinit_session', 'active', {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    });

    response.cookies.set('pinit_uid', userId, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: 'INTERNAL_ERROR', message: err.message || 'Session creation failed' }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({
    ok: true,
    success: true,
    message: 'Server session cookies cleared'
  });

  const isProd = process.env.NODE_ENV === 'production';

  response.cookies.set('pinit_role', '', {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
    expires: new Date(0)
  });

  response.cookies.set('pinit_session', '', {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
    expires: new Date(0)
  });

  response.cookies.set('pinit_uid', '', {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
    expires: new Date(0)
  });

  return response;
}

export async function GET(req: NextRequest) {
  const roleCookie = req.cookies.get('pinit_role')?.value;
  const sessionCookie = req.cookies.get('pinit_session')?.value;
  const uidCookie = req.cookies.get('pinit_uid')?.value;

  if (!sessionCookie || sessionCookie !== 'active') {
    return NextResponse.json({ active: false, role: null, userId: null });
  }

  return NextResponse.json({
    active: true,
    role: roleCookie || 'student',
    userId: uidCookie || null
  });
}
