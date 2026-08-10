import { NextRequest, NextResponse } from 'next/server';
import faceTemplateStore from '@/lib/faceStore';
import { requireUserFromRequest } from '@/lib/server/requireAuth';

export async function POST(req: NextRequest) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;

    const body = await req.json();
    const { descriptors, nonce } = body;
    // Bind enrollment to authenticated account — never accept arbitrary username overwrite.
    const targetUser = (gated.user!.email || gated.user!.id).toLowerCase();

    if (!descriptors || !Array.isArray(descriptors) || descriptors.length === 0) {
      return NextResponse.json(
        { ok: false, error: 'No face descriptor vectors provided.' },
        { status: 400 }
      );
    }

    const cookieNonce = req.cookies.get('pinit_face_nonce')?.value;
    if (!cookieNonce || !nonce || cookieNonce !== nonce) {
      return NextResponse.json(
        { ok: false, error: 'Valid face challenge nonce required for enrollment.' },
        { status: 403 }
      );
    }

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

    let norm = 0;
    for (let i = 0; i < dim; i++) {
      norm += fusedVector[i] * fusedVector[i];
    }
    norm = Math.sqrt(norm);
    const normalizedVector = norm > 0 ? fusedVector.map(v => v / norm) : fusedVector;

    faceTemplateStore.set(targetUser, normalizedVector);

    const res = NextResponse.json({
      ok: true,
      success: true,
      message: 'Face biometric profile enrolled successfully.',
      vectorDimensions: dim,
      user: targetUser,
    });

    res.cookies.set(`pinit_face_vec_${targetUser.replace(/[^a-z0-9]/g, '')}`, JSON.stringify(normalizedVector), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 3600,
      path: '/',
    });
    // Consume nonce after successful enroll
    res.cookies.set('pinit_face_nonce', '', { path: '/', maxAge: 0 });

    return res;
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error.message || 'Face enrollment failed.' },
      { status: 500 }
    );
  }
}
