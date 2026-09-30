import type {
  InternshipTaskRow,
  ClientInternshipTask,
  InternshipEnrollmentRow,
  ClientInternshipEnrollment,
} from './types';

/**
 * Converts an internship task database row to a client-safe object.
 *
 * CRITICAL SECURITY INVARIANT (NFR-SEC-1):
 * - hidden_tests / hiddenTests MUST NEVER be included in the return value.
 * - reference_solution / referenceSolution MUST NEVER be included in the return value.
 * - model and generation_meta MUST NOT be included.
 */
export function taskToClient(
  row:
    | InternshipTaskRow
    | (Partial<InternshipTaskRow> & { [key: string]: unknown })
    | Record<string, unknown>
): ClientInternshipTask {
  const r = row as unknown as Record<string, unknown>;
  return {
    id: String(r.id || ''),
    internshipEnrollmentId: String(
      r.internship_enrollment_id || r.internshipEnrollmentId || ''
    ),
    seq: Number(r.seq ?? 0),
    week: r.week !== undefined && r.week !== null ? Number(r.week) : null,
    kind: String(r.kind || ''),
    language: r.language === 'sql' ? 'sql' : 'python',
    title: String(r.title || ''),
    brief: String(r.brief || ''),
    starterCode: String(r.starter_code ?? r.starterCode ?? ''),
    visibleTests: String(r.visible_tests ?? r.visibleTests ?? ''),
    sqlSetup:
      r.sql_setup !== undefined
        ? r.sql_setup ? String(r.sql_setup) : null
        : r.sqlSetup ? String(r.sqlSetup) : null,
    skills: Array.isArray(r.skills) ? r.skills.map(String) : [],
    status: (r.status || 'locked') as ClientInternshipTask['status'],
    attempts: Number(r.attempts ?? 0),
    passedAt: r.passed_at ? String(r.passed_at) : (r.passedAt ? String(r.passedAt) : null),
    createdAt: String(r.created_at || r.createdAt || ''),
  };
}

/**
 * Converts an internship enrollment database row to a client-safe object.
 */
export function enrollmentToClient(
  row:
    | InternshipEnrollmentRow
    | (Partial<InternshipEnrollmentRow> & { [key: string]: unknown })
    | Record<string, unknown>
): ClientInternshipEnrollment {
  const r = row as unknown as Record<string, unknown>;
  return {
    id: String(r.id || ''),
    studentId: String(r.student_id || r.studentId || ''),
    crashEnrollmentId: String(
      r.crash_enrollment_id || r.crashEnrollmentId || ''
    ),
    tier: String(r.tier || ''),
    track: String(r.track || 'python_ai'),
    status: (r.status || 'generating') as ClientInternshipEnrollment['status'],
    startedAt: r.started_at ? String(r.started_at) : (r.startedAt ? String(r.startedAt) : null),
    dueAt: r.due_at ? String(r.due_at) : (r.dueAt ? String(r.dueAt) : null),
    extended: Boolean(r.extended),
    restarts: Number(r.restarts ?? 0),
    completedAt: r.completed_at ? String(r.completed_at) : (r.completedAt ? String(r.completedAt) : null),
    certificateId: r.certificate_id ? String(r.certificate_id) : (r.certificateId ? String(r.certificateId) : null),
    companyProfile:
      r.company_profile && typeof r.company_profile === 'object'
        ? (r.company_profile as Record<string, unknown>)
        : null,
    finalReport: r.final_report ? String(r.final_report) : null,
    finalReportCheck:
      r.final_report_check && typeof r.final_report_check === 'object'
        ? (r.final_report_check as Record<string, unknown>)
        : null,
    createdAt: String(r.created_at || r.createdAt || ''),
    updatedAt: String(r.updated_at || r.updatedAt || ''),
  };
}
