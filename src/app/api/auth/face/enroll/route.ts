import { NextRequest, NextResponse } from 'next/server';
import faceTemplateStore from '@/lib/faceStore';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { descriptors, username = 'student@pinit.in', nonce } = body;

    if (!descriptors || !Array.isArray(descriptors) || descriptors.length === 0) {
      return NextResponse.json(
        { ok: false, error: 'No face descriptor vectors provided.' },
        { status: 400 }
      );
    }

    // Validate anti-replay nonce if cookie is present
    const cookieNonce = req.cookies.get('pinit_face_nonce')?.value;
    if (cookieNonce && nonce && cookieNonce !== nonce) {
      return NextResponse.json(
        { ok: false, error: 'Invalid or expired security challenge nonce.' },
        { status: 403 }
      );
    }

    // Compute element-wise mean vector across frames (Vector Fusion)
    const dim = descriptors[0].length;
    const fusedVector: number[] = new Array(dim).fill(0);

    for (const frame of descriptors) {
      if (frame.length !== dim) continue;
      for (let i = 0; i < dim; i++) {
        fusedVector[i] += frame[i];
      }
    }

    for (let i = 0; i < dim; i++) {
      fusedVector[i] /= descriptors.length;
    }

    // Normalize fused vector
    let norm = 0;
    for (let i = 0; i < dim; i++) {
      norm += fusedVector[i] * fusedVector[i];
    }
    norm = Math.sqrt(norm);

    const normalizedVector = norm > 0 ? fusedVector.map(v => v / norm) : fusedVector;

    // Save vector for key user accounts
    const targetUser = username.toLowerCase();
    faceTemplateStore.set(targetUser, normalizedVector);
    // Also save for general demo user
    faceTemplateStore.set('student@pinit.in', normalizedVector);
    faceTemplateStore.set('demo', normalizedVector);

    const res = NextResponse.json({
      ok: true,
      success: true,
      message: 'Face biometric profile enrolled successfully.',
      vectorDimensions: dim,
      user: targetUser,
    });

    // Save vector cookie for persistent cross-session verification
    res.cookies.set(`pinit_face_vec_${targetUser.replace(/[^a-z0-9]/g, '')}`, JSON.stringify(normalizedVector), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 3600, // 30 days
      path: '/',
    });

    return res;
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error.message || 'Face enrollment failed.' },
      { status: 500 }
    );
  }
}
