export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { checkRateLimit, getClientIp } from '@/lib/server/rateLimit';

export async function GET(req: Request) {
  try {
    const clientIp = getClientIp(req);
    const rateCheck = checkRateLimit(`face_chal_${clientIp}`, { limit: 30, windowMs: 60_000 });
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'TOO_MANY_REQUESTS', message: 'Too many face challenge requests. Please wait a moment.' },
        { status: 429, headers: { 'Retry-After': String(rateCheck.resetSec) } }
      );
    }
    const nonce = crypto.randomBytes(16).toString('hex');
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes validity

    const response = NextResponse.json({
      success: true,
      nonce,
      expiresAt,
    });

    // Set challenge cookie
    response.cookies.set('pinit_face_nonce', nonce, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 300, // 5 mins
      path: '/',
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to generate challenge' },
      { status: 500 }
    );
  }
}
