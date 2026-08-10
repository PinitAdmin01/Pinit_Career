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
    const { descriptor, username = 'student@pinit.in', livenessVerified = false } = body;

    if (!descriptor || !Array.isArray(descriptor)) {
      return NextResponse.json(
        { ok: false, success: false, error: 'Live face descriptor vector missing.' },
        { status: 400 }
      );
    }

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

    // Never infer privileged roles from username substrings — face verify only confirms identity.
    // Caller must merge with the real account role from the auth profile / vault session.
    const userObj = {
      id: `usr_${targetUser.replace(/[^a-z0-9]/g, '_')}`,
      username: targetUser,
      email: targetUser.includes('@') ? targetUser : `${targetUser}@pinit.in`,
      displayName: targetUser.split('@')[0].toUpperCase(),
      role: 'student' as const,
      atsScore: 78,
      trustScore: 88,
    };

    return NextResponse.json({
      ok: true,
      success: true,
      match: true,
      distance: Number(distance.toFixed(4)),
      confidence: matchConfidence,
      livenessVerified,
      message: `Biometric Face Verification Successful (${matchConfidence}% Accuracy Match)`,
      user: userObj,
    });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, success: false, error: error.message || 'Face verification service error.' },
      { status: 500 }
    );
  }
}
