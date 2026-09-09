// src/lib/portfolio/endorsements.ts
/**
 * Portfolio endorsement and verification decisions, ported from the (never
 * executing) route at src/app/api/portfolio/verify-endorsement/route.ts.
 *
 * SECURITY BOUNDARY — read before changing anything here.
 *
 * On the server this gate was authoritative: requireFacultyOrAdminUserFromRequest
 * read the role from the users table with a service-role key the browser can
 * never hold. In the browser it cannot be authoritative. A determined student
 * can edit their own client state and call whatever they like.
 *
 * So this module decides only what the UI should show and send. The real gate
 * has to be a Supabase row-level-security policy on the write itself — a
 * student must not be able to set `verified` on their own portfolio rows. Until
 * that policy exists, treat a verified badge as unproven.
 *
 * That is why verifyItemDecision refuses rather than approving when the role is
 * not privileged: the previous behaviour (a 404 the page turned into "Permission
 * Denied") was safe, and this keeps it safe.
 */

/** Mirrors PRIVILEGED_FACULTY_ROLES in src/lib/server/requireAuth.ts. */
export const PRIVILEGED_FACULTY_ROLES = new Set(['admin', 'superadmin', 'teacher', 'faculty']);

export const isPrivilegedRole = (role: unknown): boolean =>
  typeof role === 'string' && PRIVILEGED_FACULTY_ROLES.has(role);

export interface Recommendation {
  id: string;
  author: string;
  role: string;
  text: string;
  date: string;
  verified: boolean;
  pendingReview: boolean;
  createdBy: string;
}

export function buildRecommendation(
  input: { id?: string; author?: string; role?: string; text?: string },
  actor: { id: string; role?: string },
): { recommendation: Recommendation; isVerified: boolean; message: string } {
  const isFaculty = isPrivilegedRole(actor.role);
  return {
    recommendation: {
      id: input.id || `rec_${Date.now()}`,
      author: String(input.author || '').trim(),
      role: String(input.role || '').trim() || 'Academic / Industry Mentor',
      text: String(input.text || '').trim(),
      date: new Date().toLocaleDateString(),
      // Only genuine faculty produce a pre-verified endorsement. Everyone
      // else's goes in pending, exactly as the server route did.
      verified: isFaculty,
      pendingReview: !isFaculty,
      createdBy: actor.id,
    },
    isVerified: isFaculty,
    message: isFaculty
      ? 'Faculty endorsement recorded and verified.'
      : 'Recommendation submitted. Pending official faculty verification.',
  };
}

export function verifyItemDecision(
  input: { type?: string; id?: string; verified?: boolean },
  actor: { id: string; role?: string },
) {
  if (!isPrivilegedRole(actor.role)) {
    return {
      allowed: false as const,
      status: 403,
      error: 'FORBIDDEN',
      message: 'Only authenticated faculty mentors and institutional administrators can verify portfolio evidence.',
    };
  }
  return {
    allowed: true as const,
    success: true,
    type: input.type,
    id: input.id,
    verified: input.verified !== undefined ? Boolean(input.verified) : true,
    verifiedBy: actor.id,
    verifierRole: actor.role,
    verifiedAt: new Date().toISOString(),
  };
}
