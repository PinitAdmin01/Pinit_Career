import { NextRequest, NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';

/**
 * GET /api/auth/face/nonce
 *
 * Issues a one-time cryptographic challenge nonce for face verification.
 * - Requires an authenticated session (cannot be called by unauthenticated visitors).
 * - Sets `pinit_face_nonce` as an HttpOnly, SameSite=Strict cookie with a 60-second TTL.
 * - Returns the same nonce in the response body so the client can include it in the verify request.
 *
 * The verify route checks that the cookie nonce matches the body nonce, providing
 * CSRF protection and ensuring the same session initiated both calls.
 */
export async function GET(req: NextRequest) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;

    // Cryptographically secure nonce — 32 random bytes as hex (256 bits)
    const nonceBytes = new Uint8Array(32);
    crypto.getRandomValues(nonceBytes);
    const nonce = Array.from(nonceBytes)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    const res = NextResponse.json({ ok: true, nonce });

    // HttpOnly prevents JS from reading the cookie — it is sent automatically on the next POST
    res.cookies.set('pinit_face_nonce', nonce, {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60, // 60-second TTL — sufficient for a single verification attempt
    });

    return res;
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error.message || 'Failed to issue face challenge nonce.' },
      { status: 500 }
    );
  }
}
