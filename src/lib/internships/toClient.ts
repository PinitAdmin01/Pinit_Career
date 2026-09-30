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
  row: Partial<InternshipTaskRow> & Record<string, unknown>
): ClientInternshipTask {
  return {
    id: String(row.id || ''),
    internshipEnrollmentId: String(
      row.internship_enrollment_id || row.internshipEnrollmentId || ''
    ),
    seq: Number(row.seq ?? 0),
    week: row.week !== undefined && row.week !== null ? Number(row.week) : null,
    kind: String(row.kind || ''),
    language: row.language === 'sql' ? 'sql' : 'python',
    title: String(row.title || ''),
    brief: String(row.brief || ''),
    starterCode: String(row.starter_code ?? row.starterCode ?? ''),
    visibleTests: String(row.visible_tests ?? row.visibleTests ?? ''),
    sqlSetup:
      row.sql_setup !== undefined
        ? row.sql_setup ? String(row.sql_setup) : null
        : row.sqlSetup ? String(row.sqlSetup) : null,
    skills: Array.isArray(row.skills) ? row.skills.map(String) : [],
    status: (row.status || 'locked') as ClientInternshipTask['status'],
    attempts: Number(row.attempts ?? 0),
    passedAt: row.passed_at ? String(row.passed_at) : (row.passedAt ? String(row.passedAt) : null),
    createdAt: String(row.created_at || row.createdAt || ''),
  };
}

/**
 * Converts an internship enrollment database row to a client-safe object.
 */
export function enrollmentToClient(
  row: Partial<InternshipEnrollmentRow> & Record<string, unknown>
): ClientInternshipEnrollment {
  return {
    id: String(row.id || ''),
    studentId: String(row.student_id || row.studentId || ''),
    crashEnrollmentId: String(
      row.crash_enrollment_id || row.crashEnrollmentId || ''
    ),
    tier: String(row.tier || ''),
    track: String(row.track || 'python_ai'),
    status: (row.status || 'generating') as ClientInternshipEnrollment['status'],
    startedAt: row.started_at ? String(row.started_at) : (row.startedAt ? String(row.startedAt) : null),
    dueAt: row.due_at ? String(row.due_at) : (row.dueAt ? String(row.dueAt) : null),
    extended: Boolean(row.extended),
    restarts: Number(row.restarts ?? 0),
    completedAt: row.completed_at ? String(row.completed_at) : (row.completedAt ? String(row.completedAt) : null),
    certificateId: row.certificate_id ? String(row.certificate_id) : (row.certificateId ? String(row.certificateId) : null),
    companyProfile:
      row.company_profile && typeof row.company_profile === 'object'
        ? (row.company_profile as Record<string, unknown>)
        : null,
    finalReport: row.final_report ? String(row.final_report) : null,
    finalReportCheck:
      row.final_report_check && typeof row.final_report_check === 'object'
        ? (row.final_report_check as Record<string, unknown>)
        : null,
    createdAt: String(row.created_at || row.createdAt || ''),
    updatedAt: String(row.updated_at || row.updatedAt || ''),
  };
}
