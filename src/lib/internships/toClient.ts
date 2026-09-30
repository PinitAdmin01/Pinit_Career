import type {
  InternshipTaskRow,
  ClientInternshipTask,
  InternshipEnrollmentRow,
  ClientInternshipEnrollment,
  InternshipTeamRow,
  ClientInternshipTeam,
  InternshipTeamMemberRow,
  ClientInternshipTeamMember,
  InternshipSprintRow,
  ClientInternshipSprint,
  InternshipOpportunityRow,
  ClientInternshipOpportunity,
  InternshipApplicationRow,
  ClientInternshipApplication,
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

/**
 * Converts an internship team database row to a client-safe object.
 */
export function teamToClient(
  row:
    | InternshipTeamRow
    | (Partial<InternshipTeamRow> & { [key: string]: unknown })
    | Record<string, unknown>
): ClientInternshipTeam {
  const r = row as unknown as Record<string, unknown>;
  return {
    id: String(r.id || ''),
    tier: String(r.tier || ''),
    status: (r.status || 'forming') as ClientInternshipTeam['status'],
    projectBrief:
      r.project_brief && typeof r.project_brief === 'object'
        ? (r.project_brief as Record<string, unknown>)
        : (r.projectBrief as Record<string, unknown> | null) || null,
    repoUrl: r.repo_url ? String(r.repo_url) : (r.repoUrl ? String(r.repoUrl) : null),
    windowStart: r.window_start ? String(r.window_start) : (r.windowStart ? String(r.windowStart) : null),
    createdAt: String(r.created_at || r.createdAt || ''),
  };
}

/**
 * Converts an internship team member database row to a client-safe object.
 */
export function teamMemberToClient(
  row:
    | InternshipTeamMemberRow
    | (Partial<InternshipTeamMemberRow> & { [key: string]: unknown })
    | Record<string, unknown>
): ClientInternshipTeamMember {
  const r = row as unknown as Record<string, unknown>;
  return {
    teamId: String(r.team_id || r.teamId || ''),
    studentId: String(r.student_id || r.studentId || ''),
    internshipEnrollmentId: String(
      r.internship_enrollment_id || r.internshipEnrollmentId || ''
    ),
    stories:
      r.stories && typeof r.stories === 'object'
        ? (r.stories as Record<string, unknown>)
        : null,
  };
}

/**
 * Converts an internship sprint database row to a client-safe object.
 */
export function sprintToClient(
  row:
    | InternshipSprintRow
    | (Partial<InternshipSprintRow> & { [key: string]: unknown })
    | Record<string, unknown>
): ClientInternshipSprint {
  const r = row as unknown as Record<string, unknown>;
  return {
    id: String(r.id || ''),
    teamId: r.team_id ? String(r.team_id) : (r.teamId ? String(r.teamId) : null),
    internshipEnrollmentId: r.internship_enrollment_id
      ? String(r.internship_enrollment_id)
      : (r.internshipEnrollmentId ? String(r.internshipEnrollmentId) : null),
    number: Number(r.number ?? 0),
    goal: String(r.goal || ''),
    dueAt: r.due_at ? String(r.due_at) : (r.dueAt ? String(r.dueAt) : null),
    status: (r.status || 'open') as ClientInternshipSprint['status'],
    review:
      r.review && typeof r.review === 'object'
        ? (r.review as Record<string, unknown>)
        : null,
    reviewedBy: r.reviewed_by ? String(r.reviewed_by) : (r.reviewedBy ? String(r.reviewedBy) : null),
    reviewedAt: r.reviewed_at ? String(r.reviewed_at) : (r.reviewedAt ? String(r.reviewedAt) : null),
    createdAt: String(r.created_at || r.createdAt || ''),
  };
}

/**
 * Converts an internship opportunity database row to a client-safe object.
 */
export function opportunityToClient(
  row:
    | InternshipOpportunityRow
    | (Partial<InternshipOpportunityRow> & { [key: string]: unknown })
    | Record<string, unknown>
): ClientInternshipOpportunity {
  const r = row as unknown as Record<string, unknown>;
  return {
    id: String(r.id || ''),
    orgName: String(r.org_name || r.orgName || ''),
    orgWebsite: r.org_website ? String(r.org_website) : (r.orgWebsite ? String(r.orgWebsite) : null),
    kind: (r.kind || 'client_project') as ClientInternshipOpportunity['kind'],
    title: String(r.title || ''),
    description: String(r.description || ''),
    minTier: String(r.min_tier || r.minTier || 't3_project'),
    seats: Number(r.seats ?? 1),
    paid: Boolean(r.paid),
    stipend: r.stipend !== null && r.stipend !== undefined ? Number(r.stipend) : null,
    authenticityTier: r.authenticity_tier ? String(r.authenticity_tier) : (r.authenticityTier ? String(r.authenticityTier) : null),
    status: (r.status || 'draft') as ClientInternshipOpportunity['status'],
    createdAt: String(r.created_at || r.createdAt || ''),
  };
}

/**
 * Converts an internship application database row to a client-safe object.
 */
export function applicationToClient(
  row:
    | InternshipApplicationRow
    | (Partial<InternshipApplicationRow> & { [key: string]: unknown })
    | Record<string, unknown>
): ClientInternshipApplication {
  const r = row as unknown as Record<string, unknown>;
  return {
    id: String(r.id || ''),
    opportunityId: String(r.opportunity_id || r.opportunityId || ''),
    studentId: String(r.student_id || r.studentId || ''),
    internshipEnrollmentId: String(r.internship_enrollment_id || r.internshipEnrollmentId || ''),
    status: (r.status || 'applied') as ClientInternshipApplication['status'],
    createdAt: String(r.created_at || r.createdAt || ''),
  };
}

