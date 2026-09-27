import crypto from 'crypto';

/**
 * Certificate-course capstone certificate: issued by /api/certificates/course once the server has
 * the course's lessons done and all four capstone sprints approved, verified by /api/verify/PIN-CP-….
 * Stored in issued_certificates and signed like the roadmap certificate (roadmapCertificate.ts):
 * the signed fields include the id, whose prefix names the kind, so one kind cannot pass as the other.
 * The signed fields are: courseId = the plan id, projectId = the enrollment id, interviewScore = the
 * defense score.
 */
export const COURSE_CERTIFICATE_PREFIX = 'PIN-CP-';
export const COURSE_CERTIFICATE_KIND = 'course_project';

export function newCourseCertificateId(): string {
  return `${COURSE_CERTIFICATE_PREFIX}${crypto.randomBytes(6).toString('hex').toUpperCase()}`;
}
