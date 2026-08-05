import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function GET() {
  try {
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
