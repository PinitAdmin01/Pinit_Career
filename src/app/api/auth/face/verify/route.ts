import { NextRequest, NextResponse } from 'next/server';
import faceTemplateStore from '@/lib/faceStore';

// Euclidean distance between two vectors
function euclideanDistance(v1: number[], v2: number[]): number {
  if (v1.length !== v2.length) return Infinity;
  let sum = 0;
  for (let i = 0; i < v1.length; i++) {
    const diff = v1[i] - v2[i];
    sum += diff * diff;
  }
  return Math.sqrt(sum);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { descriptor, username, nonce } = body;

    if (!username || typeof username !== 'string' || !username.trim()) {
      return NextResponse.json(
        { ok: false, success: false, error: 'Username required for face verify.' },
        { status: 400 }
      );
    }

    if (!descriptor || !Array.isArray(descriptor)) {
      return NextResponse.json(
        { ok: false, success: false, error: 'Live face descriptor vector missing.' },
        { status: 400 }
      );
    }

    const cookieNonce = req.cookies.get('pinit_face_nonce')?.value;
    if (!cookieNonce || !nonce || cookieNonce !== nonce) {
      return NextResponse.json(
        { ok: false, success: false, error: 'Valid face challenge nonce required.' },
        { status: 403 }
      );
    }

    // Do not trust client-supplied livenessVerified — it is forgeable.
    // Real liveness requires server-side video analysis; gate here is nonce + template match.

    const targetUser = String(username).toLowerCase();

    // Only match against the requested user's enrolled template — no silent demo fallback.
    let storedVector = faceTemplateStore.get(targetUser);

    if (!storedVector) {
      const cookieKey = `pinit_face_vec_${targetUser.replace(/[^a-z0-9]/g, '')}`;
      const cookieVal = req.cookies.get(cookieKey)?.value;
      if (cookieVal) {
        try {
          storedVector = JSON.parse(cookieVal);
        } catch {
          // ignore
        }
      }
    }

    if (!storedVector || !Array.isArray(storedVector) || storedVector.length !== descriptor.length) {
      return NextResponse.json({
        ok: false,
        success: false,
        match: false,
        error: 'No enrolled face template for this account. Complete face enrollment first.',
      }, { status: 401 });
    }

    const distance = euclideanDistance(descriptor, storedVector);

    // Strict accuracy thresholding
    const STRICT_THRESHOLD = 0.48;
    const match = distance <= STRICT_THRESHOLD;
    const matchConfidence = Math.max(0, Math.min(100, Math.round((1 - (distance / 0.60)) * 100)));

    if (!match) {
      return NextResponse.json({
        ok: false,
        success: false,
        match: false,
        distance,
        confidence: matchConfidence,
        error: `Face match failed (Distance: ${distance.toFixed(3)}, Confidence: ${matchConfidence}%). Please align face clearly.`,
      }, { status: 401 });
    }

    // Never invent privileged roles or fabricated scores from face match alone.
    const userObj = {
      id: `usr_${targetUser.replace(/[^a-z0-9]/g, '_')}`,
      username: targetUser,
      email: targetUser.includes('@') ? targetUser : `${targetUser}@pinit.in`,
      displayName: targetUser.split('@')[0].toUpperCase(),
      role: 'student' as const,
    };

    const res = NextResponse.json({
      ok: true,
      success: true,
      match: true,
      distance: Number(distance.toFixed(4)),
      confidence: matchConfidence,
      livenessVerified: false,
      message: `Biometric Face Verification Successful (${matchConfidence}% Accuracy Match)`,
      user: userObj,
    });
    // Consume one-time challenge nonce
    res.cookies.set('pinit_face_nonce', '', { path: '/', maxAge: 0 });
    return res;
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, success: false, error: error.message || 'Face verification service error.' },
      { status: 500 }
    );
  }
}
