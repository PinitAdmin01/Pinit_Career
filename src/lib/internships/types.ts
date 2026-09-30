/**
 * TypeScript row types for the internship program tables (C10).
 *
 * - Snake_case interfaces match the database columns exactly.
 * - CamelCase "Client" interfaces are the shapes sent to the browser.
 * - The client-safe task type MUST NOT have `hiddenTests` or `referenceSolution`.
 */

// ---------------------------------------------------------------------------
// Database row types (snake_case, as stored)
// ---------------------------------------------------------------------------

export interface InternshipEnrollmentRow {
  id: string;
  student_id: string;
  crash_enrollment_id: string;
  tier: string;
  track: string;
  status: 'generating' | 'active' | 'completed' | 'expired' | 'withdrawn' | 'generation_failed';
  started_at: string | null;
  due_at: string | null;
  extended: boolean;
  restarts: number;
  completed_at: string | null;
  certificate_id: string | null;
  company_profile: Record<string, unknown> | null;
  final_report: string | null;
  final_report_check: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface InternshipTaskRow {
  id: string;
  internship_enrollment_id: string;
  seq: number;
  week: number | null;
  kind: string;
  language: 'python' | 'sql';
  title: string;
  brief: string;
  starter_code: string;
  visible_tests: string;
  hidden_tests: string;
  reference_solution: string;
  sql_setup: string | null;
  skills: string[];
  status: 'locked' | 'open' | 'passed';
  attempts: number;
  passed_at: string | null;
  model: string | null;
  generation_meta: Record<string, unknown> | null;
  created_at: string;
}

export interface InternshipSubmissionRow {
  id: string;
  task_id: string;
  student_id: string;
  code: string;
  passed: boolean;
  output: string | null;
  ai_review: Record<string, unknown> | null;
  created_at: string;
}

export interface InternshipTeamRow {
  id: string;
  tier: string;
  status: 'forming' | 'active' | 'completed';
  project_brief: Record<string, unknown> | null;
  repo_url: string | null;
  window_start: string | null;
  created_at: string;
}

export interface InternshipTeamMemberRow {
  team_id: string;
  student_id: string;
  internship_enrollment_id: string;
  stories: Record<string, unknown> | null;
}

export interface InternshipSprintRow {
  id: string;
  team_id: string | null;
  internship_enrollment_id: string | null;
  number: number;
  goal: string;
  due_at: string | null;
  status: 'open' | 'submitted' | 'approved' | 'changes_requested';
  review: Record<string, unknown> | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
}

export interface InternshipPrLinkRow {
  id: string;
  sprint_id: string;
  student_id: string;
  url: string;
  checked_at: string | null;
  created_at: string;
}

export interface InternshipStandupRow {
  id: string;
  internship_enrollment_id: string;
  week: number;
  done: string;
  next: string;
  blockers: string;
  created_at: string;
}

export interface InternshipOpportunityRow {
  id: string;
  org_name: string;
  org_website: string | null;
  kind: 'client_project' | 'open_source' | 'industry' | 'fellowship';
  title: string;
  description: string;
  min_tier: string;
  seats: number;
  paid: boolean;
  stipend: number | null;
  authenticity_tier: string | null;
  status: 'draft' | 'open' | 'closed';
  created_by: string;
  created_at: string;
}

export interface InternshipApplicationRow {
  id: string;
  opportunity_id: string;
  student_id: string;
  internship_enrollment_id: string;
  status: 'applied' | 'shortlisted' | 'accepted' | 'rejected' | 'withdrawn';
  created_at: string;
}

export interface InternshipWeeklyLogRow {
  id: string;
  internship_enrollment_id: string;
  week: number;
  hours: number;
  summary: string;
  links: string[];
  created_at: string;
}

export interface InternshipSupervisorEvaluationRow {
  id: string;
  internship_enrollment_id: string;
  supervisor_name: string;
  supervisor_email: string;
  token_hash: string;
  token_expires_at: string;
  ratings: Record<string, unknown> | null;
  comments: string | null;
  submitted_at: string | null;
  created_at: string;
}

// ---------------------------------------------------------------------------
// Client-safe types (camelCase, sent to the browser)
// ---------------------------------------------------------------------------

export interface ClientInternshipEnrollment {
  id: string;
  studentId: string;
  crashEnrollmentId: string;
  tier: string;
  track: string;
  status: InternshipEnrollmentRow['status'];
  startedAt: string | null;
  dueAt: string | null;
  extended: boolean;
  restarts: number;
  completedAt: string | null;
  certificateId: string | null;
  companyProfile: Record<string, unknown> | null;
  finalReport: string | null;
  finalReportCheck: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Client-safe task: NO `hiddenTests` and NO `referenceSolution`.
 * These fields must never leave the server.
 */
export interface ClientInternshipTask {
  id: string;
  internshipEnrollmentId: string;
  seq: number;
  week: number | null;
  kind: string;
  language: 'python' | 'sql';
  title: string;
  brief: string;
  starterCode: string;
  visibleTests: string;
  // hiddenTests — NEVER sent to the browser
  // referenceSolution — NEVER sent to the browser
  sqlSetup: string | null;
  skills: string[];
  status: InternshipTaskRow['status'];
  attempts: number;
  passedAt: string | null;
  createdAt: string;
}

export interface ClientInternshipSubmission {
  id: string;
  taskId: string;
  studentId: string;
  code: string;
  passed: boolean;
  output: string | null;
  aiReview: Record<string, unknown> | null;
  createdAt: string;
}

export interface ClientInternshipTeam {
  id: string;
  tier: string;
  status: InternshipTeamRow['status'];
  projectBrief: Record<string, unknown> | null;
  repoUrl: string | null;
  windowStart: string | null;
  createdAt: string;
}

export interface ClientInternshipTeamMember {
  teamId: string;
  studentId: string;
  internshipEnrollmentId: string;
  stories: Record<string, unknown> | null;
}

export interface ClientInternshipSprint {
  id: string;
  teamId: string | null;
  internshipEnrollmentId: string | null;
  number: number;
  goal: string;
  dueAt: string | null;
  status: InternshipSprintRow['status'];
  review: Record<string, unknown> | null;
  reviewedBy: string | null;
  reviewedAt: string | null;
  createdAt: string;
}

export interface ClientInternshipPrLink {
  id: string;
  sprintId: string;
  studentId: string;
  url: string;
  checkedAt: string | null;
  createdAt: string;
}

export interface ClientInternshipStandup {
  id: string;
  internshipEnrollmentId: string;
  week: number;
  done: string;
  next: string;
  blockers: string;
  createdAt: string;
}

export interface ClientInternshipOpportunity {
  id: string;
  orgName: string;
  orgWebsite: string | null;
  kind: InternshipOpportunityRow['kind'];
  title: string;
  description: string;
  minTier: string;
  seats: number;
  paid: boolean;
  stipend: number | null;
  authenticityTier: string | null;
  status: InternshipOpportunityRow['status'];
  createdAt: string;
}

export interface ClientInternshipApplication {
  id: string;
  opportunityId: string;
  studentId: string;
  internshipEnrollmentId: string;
  status: InternshipApplicationRow['status'];
  createdAt: string;
}

export interface ClientInternshipWeeklyLog {
  id: string;
  internshipEnrollmentId: string;
  week: number;
  hours: number;
  summary: string;
  links: string[];
  createdAt: string;
}

export interface ClientInternshipSupervisorEvaluation {
  id: string;
  internshipEnrollmentId: string;
  supervisorName: string;
  supervisorEmail: string;
  // tokenHash — NEVER sent to the browser
  tokenExpiresAt: string;
  ratings: Record<string, unknown> | null;
  comments: string | null;
  submittedAt: string | null;
  createdAt: string;
}
