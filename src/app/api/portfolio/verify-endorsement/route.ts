import { NextResponse } from 'next/server';
import { requireFacultyOrAdminUserFromRequest, requireUserFromRequest } from '@/lib/server/requireAuth';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { action, type, id, studentId, verified, author, role, text } = body;

    // 1. Action: Check if current session user has verified server-side faculty/admin role
    if (action === 'check_privilege') {
      const auth = await requireFacultyOrAdminUserFromRequest(req);
      if (auth.error) {
        return NextResponse.json({ isPrivileged: false, role: 'student' }, { status: 200 });
      }
      return NextResponse.json({ isPrivileged: true, role: auth.user.role }, { status: 200 });
    }

    // 2. Action: Toggle verification of a portfolio item (projects, timeline, certificates, research)
    // Strictly requires verified faculty/admin role on the server.
    if (action === 'verify_item') {
      const auth = await requireFacultyOrAdminUserFromRequest(req);
      if (auth.error) {
        return auth.error; // 403 Forbidden or 401 Unauthorized
      }

      return NextResponse.json({
        success: true,
        type,
        id,
        verified: verified !== undefined ? Boolean(verified) : true,
        verifiedBy: auth.user.id,
        verifierRole: auth.user.role,
        verifiedAt: new Date().toISOString(),
      });
    }

    // 3. Action: Add recommendation / mentor endorsement
    if (action === 'add_recommendation') {
      const userAuth = await requireUserFromRequest(req);
      if (userAuth.error) return userAuth.error;

      // Check if creator is faculty or admin
      const facultyAuth = await requireFacultyOrAdminUserFromRequest(req);
      const isFaculty = !facultyAuth.error;

      const recommendation = {
        id: id || `rec_${Date.now()}`,
        author: String(author || '').trim(),
        role: String(role || '').trim() || 'Academic / Industry Mentor',
        text: String(text || '').trim(),
        date: new Date().toLocaleDateString(),
        // Server-enforced: only genuine faculty/admins can generate pre-verified endorsements
        verified: isFaculty,
        pendingReview: !isFaculty,
        createdBy: userAuth.user.id,
      };

      return NextResponse.json({
        success: true,
        recommendation,
        isVerified: isFaculty,
        message: isFaculty
          ? 'Faculty endorsement recorded and verified.'
          : 'Recommendation submitted. Pending official faculty verification.'
      });
    }

    return NextResponse.json({ error: 'INVALID_ACTION', message: 'Unknown action specified.' }, { status: 400 });
  } catch (err: any) {
    console.error('[Portfolio Verify API Error]:', err);
    return NextResponse.json({ error: 'INTERNAL_ERROR', message: err?.message || 'Server error' }, { status: 500 });
  }
}
