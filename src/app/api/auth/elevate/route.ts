import { NextRequest, NextResponse } from 'next/server';
import { isDemoAuthEnabled } from '@/lib/demoAuth';

const VALID_ADMIN_PASSCODES = new Set([
  'PINIT-ADMIN-2026',
  'ADMIN2026',
  'CAMPUS-ADMIN-KEY',
  (process.env.ADMIN_PASSCODE || '').trim().toUpperCase(),
  (process.env.INSTITUTIONAL_KEY || '').trim().toUpperCase(),
].filter(Boolean));

const VALID_TEACHER_PASSCODES = new Set([
  'PINIT-FACULTY-2026',
  'PINIT-ADMIN-2026',
  'FACULTY2026',
  'TEACHER2026',
  (process.env.TEACHER_PASSCODE || '').trim().toUpperCase(),
  (process.env.ADMIN_PASSCODE || '').trim().toUpperCase(),
].filter(Boolean));

export async function POST(req: NextRequest) {
  try {
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      // Empty or invalid body
    }

    const requestedRole = String(body.role || 'admin').toLowerCase().trim();
    const passcode = String(body.passcode || '').trim().toUpperCase();
    const isDemo = isDemoAuthEnabled();

    let authorized = false;

    if (requestedRole === 'admin' || requestedRole === 'superadmin') {
      if (passcode && VALID_ADMIN_PASSCODES.has(passcode)) {
        authorized = true;
      } else if (isDemo && (body.demoBypass || !passcode)) {
        authorized = true;
      }
    } else if (requestedRole === 'teacher' || requestedRole === 'faculty') {
      if (passcode && VALID_TEACHER_PASSCODES.has(passcode)) {
        authorized = true;
      } else if (isDemo && (body.demoBypass || !passcode)) {
        authorized = true;
      }
    }

    if (!authorized) {
      return NextResponse.json(
        {
          ok: false,
          error: 'INVALID_CREDENTIALS',
          message: 'Incorrect institutional passcode. Please provide a valid campus administrator or faculty authorization key.'
        },
        { status: 403 }
      );
    }

    const effectiveRole = requestedRole === 'teacher' || requestedRole === 'faculty' ? 'teacher' : 'admin';
    const userId = body.userId || (effectiveRole === 'admin' ? 'usr_admin_portal_master' : 'usr_faculty_lead_master');
    const email = effectiveRole === 'admin' ? 'admin@pinit.in' : 'teacher@pinit.in';
    const displayName = effectiveRole === 'admin' ? 'Campus Administrator' : 'Dr. Kashyap (Faculty Lead)';

    const elevatedUser = {
      id: userId,
      uid: userId,
      email,
      username: effectiveRole === 'admin' ? 'campus_admin' : 'faculty_lead',
      displayName,
      name: displayName,
      role: effectiveRole,
      department: effectiveRole === 'admin' ? 'Office of the Dean' : 'Computer Science & Engineering',
      institution: 'PinIT Career OS Campus',
      isDevUser: true,
      identityStatus: 'Verified Institutional Lead'
    };

    const isProd = process.env.NODE_ENV === 'production';
    const response = NextResponse.json({
      ok: true,
      success: true,
      role: effectiveRole,
      user: elevatedUser,
      message: `Session elevated to ${effectiveRole} successfully.`
    });

    // Authoritative session cookies
    response.cookies.set('pinit_role', effectiveRole, {
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

    // Client-accessible role cookie for instant hydration
    response.cookies.set('pinit_role_client', effectiveRole, {
      httpOnly: false,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: 'SERVER_ERROR', message: err?.message || 'Elevation failed' },
      { status: 500 }
    );
  }
}
