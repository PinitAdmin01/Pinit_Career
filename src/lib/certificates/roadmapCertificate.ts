import crypto from 'crypto';

/**
 * Roadmap journey certificate (roadmap → capstone project → capstone interview).
 * Server-only: issued by /api/certificates/roadmap, verified by /api/verify/PIN-RC-….
 *
 * What the server checks (student-editable data is never trusted on its own):
 * - roadmap: every quest in the student's roadmap is a real quest of the courses a roadmap on this
 *   main course may contain (lib/roadmap/roadmapCourses), the roadmap covers at least half of the
 *   main course (minimum 5 quests), and all of them are in users.completed_quests, which only the
 *   server writes (/api/quest/complete; students cannot edit it);
 * - interview: the capstone result carries the server's HMAC (lib/interview/evaluationSignature).
 */

export const ROADMAP_CERTIFICATE_PREFIX = 'PIN-RC-';
export const ROADMAP_CERTIFICATE_KIND = 'roadmap_journey';
const MIN_ROADMAP_QUESTS = 5;

export type RoadmapCheck =
  | { ok: true; total: number }
  | { ok: false; reason: 'ROADMAP_NOT_VERIFIABLE' | 'ROADMAP_NOT_IN_COURSE' | 'ROADMAP_TOO_SHORT' | 'ROADMAP_NOT_COMPLETE'; missing?: number };

export function validateRoadmapForCertificate(input: {
  roadmapModules: unknown;
  completedQuests: unknown;
  /** Quests of the roadmap's main course. */
  courseQuestIds: ReadonlyArray<string> | null | undefined;
  /** Quests of every course the roadmap may contain (defaults to the main course only). */
  allowedQuestIds?: ReadonlyArray<string> | null;
}): RoadmapCheck {
  const course = new Set(input.courseQuestIds ?? []);
  const allowed = new Set([...course, ...(input.allowedQuestIds ?? [])]);
  if (course.size === 0) return { ok: false, reason: 'ROADMAP_NOT_VERIFIABLE' };

  const ids = new Set<string>();
  if (Array.isArray(input.roadmapModules)) {
    for (const m of input.roadmapModules) {
      const quests = m && typeof m === 'object' ? (m as { quests?: unknown }).quests : null;
      if (!Array.isArray(quests)) continue;
      for (const q of quests) {
        const id = q && typeof q === 'object' ? (q as { id?: unknown }).id : null;
        if (typeof id === 'string' && id) ids.add(id);
      }
    }
  }
  if (ids.size === 0) return { ok: false, reason: 'ROADMAP_NOT_VERIFIABLE' };
  const ghost = [...ids].filter((id) => !allowed.has(id));
  if (ghost.length > 0) return { ok: false, reason: 'ROADMAP_NOT_IN_COURSE', missing: ghost.length };
  const mainCovered = [...ids].filter((id) => course.has(id)).length;
  if (mainCovered < Math.max(MIN_ROADMAP_QUESTS, Math.ceil(course.size / 2))) return { ok: false, reason: 'ROADMAP_TOO_SHORT' };

  const done = new Set(Array.isArray(input.completedQuests) ? input.completedQuests.filter((q): q is string => typeof q === 'string') : []);
  const missing = [...ids].filter((id) => !done.has(id)).length;
  return missing === 0 ? { ok: true, total: ids.size } : { ok: false, reason: 'ROADMAP_NOT_COMPLETE', missing };
}

export function newRoadmapCertificateId(): string {
  return `${ROADMAP_CERTIFICATE_PREFIX}${crypto.randomBytes(6).toString('hex').toUpperCase()}`;
}

export interface RoadmapCertificateFields {
  id: string;
  studentId: string;
  courseId: string;
  projectId: string;
  interviewScore: number;
  issuedAt: string;
}

const payloadOf = (f: RoadmapCertificateFields) =>
  [f.id, f.studentId, f.courseId, f.projectId, Math.round(f.interviewScore), f.issuedAt].join('|');

function signingSecret(): string {
  const secret = process.env.NEXTAUTH_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (secret && secret.trim()) return secret;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('NEXTAUTH_SECRET or SUPABASE_SERVICE_ROLE_KEY must be set to sign certificates.');
  }
  return 'dev-only-certificate-secret';
}

export function signRoadmapCertificate(f: RoadmapCertificateFields, secret = signingSecret()): string {
  return crypto.createHmac('sha256', secret).update(payloadOf(f)).digest('hex');
}

export function verifyRoadmapCertificate(f: RoadmapCertificateFields, signature: unknown, secret = signingSecret()): boolean {
  if (typeof signature !== 'string' || !/^[0-9a-f]{64}$/.test(signature)) return false;
  const expected = signRoadmapCertificate(f, secret);
  return crypto.timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(expected, 'hex'));
}
