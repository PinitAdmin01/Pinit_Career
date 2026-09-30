import crypto from 'crypto';

export const INTERNSHIP_CERTIFICATE_PREFIX = 'PIN-IN-';
export const INTERNSHIP_CERTIFICATE_KIND = 'internship';

export function newInternshipCertificateId(): string {
  return `${INTERNSHIP_CERTIFICATE_PREFIX}${crypto.randomBytes(6).toString('hex').toUpperCase()}`;
}

export interface InternshipHonestyMetadata {
  tierName: string;
  title: string;
  role: string;
  isSimulated: boolean;
  verificationMethod: string;
  purposeWording: string;
}

/**
 * Returns honest labelling and metadata per internship tier (FR-CERT-2 / FR-CERT-3).
 * Tiers 1-2 are always labelled as simulated.
 */
export function getInternshipHonestyLabel(
  tier: string,
  companyName = 'Fictional Tech Company'
): InternshipHonestyMetadata {
  switch (tier) {
    case 't1_job_sim':
      return {
        tierName: 'Tier 1: Python Job Simulation (1 Month)',
        title: 'PinIT Internship Certificate: Python Job Simulation',
        role: 'Software Engineering Intern (Simulated)',
        isSimulated: true,
        verificationMethod: 'Automated Test Suite (Visible & Hidden Tests) + AI Code Review',
        purposeWording: `Completed 5 engineering tickets at simulated company "${companyName}" with visible and hidden test verification, AI code reviews, and accepted final stand-up report.`,
      };
    case 't2_virtual_team':
      return {
        tierName: 'Tier 2: Virtual Team Internship (3 Months)',
        title: 'PinIT Internship Certificate: Virtual Team Simulation',
        role: 'Backend Engineering Intern (Simulated)',
        isSimulated: true,
        verificationMethod: 'Automated Test Suite + GitHub PRs + Sprint Reviews',
        purposeWording: `Completed 4-week team sprint backlog on "${companyName}", merged pull requests in public repository, and passed sprint reviews.`,
      };
    case 't3_project':
      return {
        tierName: 'Tier 3: Client Project (6 Months)',
        title: 'PinIT Internship Certificate: Client Project (Simulated Client)',
        role: 'Full-Stack Developer (Simulated Client)',
        isSimulated: true,
        verificationMethod: 'Client Specification Deliverable & Weekly Logs',
        purposeWording: `Delivered engineering milestones for "${companyName}" according to client project specifications and weekly verified progress logs.`,
      };
    case 't4_industry':
      return {
        tierName: 'Tier 4: Verified Industry Internship (9 Months)',
        title: 'PinIT Internship Certificate: Verified Industry Internship',
        role: 'Industry Engineering Intern',
        isSimulated: false,
        verificationMethod: 'Company Supervisor Evaluation & Timesheet Records',
        purposeWording: `Completed verified industry internship at "${companyName}" confirmed by direct supervisor evaluation.`,
      };
    case 't5_fellowship':
      return {
        tierName: 'Tier 5: Verified Engineering Fellowship (12 Months)',
        title: 'PinIT Internship Certificate: Verified Engineering Fellowship',
        role: 'Engineering & Research Fellow',
        isSimulated: false,
        verificationMethod: 'Fellowship Mentor Evaluation & Published Artifact',
        purposeWording: `Completed 12-month engineering fellowship at "${companyName}" with verified milestone deliverable and mentor endorsement.`,
      };
    default:
      return {
        tierName: 'Python Job Simulation',
        title: 'PinIT Internship Certificate: Job Simulation',
        role: 'Engineering Intern (Simulated)',
        isSimulated: true,
        verificationMethod: 'Automated Test Suite + Code Review',
        purposeWording: `Completed 5 engineering simulation tickets at "${companyName}".`,
      };
  }
}

export interface InternshipCompletionCheckOptions {
  enrollment: {
    tier?: string | null;
    status?: string | null;
    final_report?: string | null;
    final_report_check?: {
      matches?: boolean;
      defenseResult?: { passed?: boolean; score?: number; verdict?: string };
    } | null;
  } | null | undefined;
  tasks: Array<{ status?: string | null }> | null | undefined;
  sprints?: Array<{ status?: string | null }> | null | undefined;
  defensePassed?: boolean;
}

/**
 * Validates whether an internship meets all requirements for certificate issuance (C7 / T-19 / T-29).
 * - Tier 1: all 5 tickets passed + final report present and accepted by AI.
 * - Tier 2: all 8 tickets passed + all 4 sprints approved + oral defense passed (FR-T2-9).
 */
export function isInternshipComplete(opts: InternshipCompletionCheckOptions): boolean {
  if (!opts.enrollment || !opts.tasks) return false;
  const tier = opts.enrollment.tier;

  // Tier 2: Virtual Internship – Backend (FR-T2-9)
  if (tier === 't2_virtual_team') {
    if (opts.tasks.length < 8) return false;
    const allTasksPassed = opts.tasks.every((t) => t.status === 'passed');
    if (!allTasksPassed) return false;

    // Must have all 4 sprints approved
    if (!opts.sprints || opts.sprints.length < 4) return false;
    const allSprintsApproved = opts.sprints.every((s) => s.status === 'approved');
    if (!allSprintsApproved) return false;

    // Defense must be passed
    const defensePassed =
      opts.defensePassed ??
      Boolean(opts.enrollment.final_report_check?.defenseResult?.passed);
    return defensePassed;
  }

  // Tier 1: Python Job Simulation (FR-T1-6 / C7)
  if (opts.tasks.length < 5) return false;
  const allPassed = opts.tasks.every((t) => t.status === 'passed');
  if (!allPassed) return false;

  // Final report must be submitted
  const report = typeof opts.enrollment.final_report === 'string' ? opts.enrollment.final_report.trim() : '';
  if (!report) return false;

  // Final report check must be accepted
  const check = opts.enrollment.final_report_check;
  return Boolean(check && check.matches === true);
}

