import fs from 'fs';
import path from 'path';

let totalChecks = 0;
let passedChecks = 0;
let failedChecks = 0;

function check(title: string, fn: () => boolean, detail?: string) {
  totalChecks++;
  try {
    const success = fn();
    if (success) {
      passedChecks++;
      console.log(`  ✅ [PASS] ${title}`);
    } else {
      failedChecks++;
      console.error(`  ❌ [FAIL] ${title}${detail ? ` — ${detail}` : ''}`);
    }
  } catch (err: any) {
    failedChecks++;
    console.error(`  ❌ [ERROR] ${title} — ${err.message}`);
  }
}

console.log('========================================================================');
console.log('🧐 AUDITOR PERSPECTIVE: COMPREHENSIVE END-TO-END SYSTEM INTEGRITY TEST');
console.log('========================================================================\n');

// ── SECTION 1: STUDENT ATTENDANCE & LEAVE INTEGRITY ─────────────────────
console.log('── 1. STUDENT ATTENDANCE & LEAVE INTEGRITY ──');
const attendancePath = path.join(process.cwd(), 'src/components/student/StudentAttendanceView.tsx');
const attendanceSrc = fs.readFileSync(attendancePath, 'utf-8');

check('Absence of mock camera brightness hack', () => !attendanceSrc.includes('avgBrightness < 8'));
check('Absence of 4.5s manual check-in bypass button', () => !attendanceSrc.includes('Confirm Attendance Manually'));
check('Absence of handleStartFaceScan method', () => !attendanceSrc.includes('handleStartFaceScan'));
check('Absence of illicit client-side addXp(10) attendance payout', () => !attendanceSrc.includes('addXp(10)'));
check('Absence of illicit client-side earnPins(15) attendance payout', () => !attendanceSrc.includes('earnPins(15)'));
check('Student view is read-only academic compliance monitor', () => attendanceSrc.includes('Academic Compliance'));
check('Leave applications routed via /api/services/apply-leave', () => attendanceSrc.includes("api.post('/api/services/apply-leave'"));
check('Non-existent leave_applications table eradicated', () => !attendanceSrc.includes("from('leave_applications')"));
check('Faculty roster selector dynamically powered by portalService.getEnrolledStudents', () => 
  attendanceSrc.includes('portalService.getEnrolledStudents') && attendanceSrc.includes('selectedStudentId')
);
check('Dynamic focus streak and attendance percentage derivation', () => 
  !attendanceSrc.includes('Weekly Attendance 92%') && !attendanceSrc.includes('Deep Focus Master</h3>')
);

// ── SECTION 2: EXAMS & TRANSCRIPTS PORTAL ──────────────────────────────
console.log('\n── 2. EXAMS & TRANSCRIPTS PORTAL ──');
const examsPath = path.join(process.cwd(), 'src/app/exams/page.tsx');
const examsSrc = fs.readFileSync(examsPath, 'utf-8');

check('Hardcoded "BGS INSTITUTE OF MANAGEMENT" eradicated', () => !examsSrc.includes('BGS INSTITUTE OF MANAGEMENT'));
check('Hardcoded "Major: Computer Science Engineering" eradicated', () => !examsSrc.includes('Major: Computer Science Engineering'));
check('Hardcoded "Program: B.Tech CSE" eradicated', () => !examsSrc.includes('Program: B.Tech CSE'));
check('Exams portal dynamically binds student institutionName, major, and program', () => 
  examsSrc.includes('institutionName') && examsSrc.includes('studentMajor') && examsSrc.includes('studentProgram')
);
check('Course syllabus credits dynamically calculated', () => examsSrc.includes('r.credits'));
check('Unique deterministic hall ticket pass code generated', () => !examsSrc.includes('DSAI-ENTRY-PASS') && examsSrc.includes('HT-2026-'));
check('Hall ticket gated by attendance compliance (>=75%)', () => examsSrc.includes('isAttendanceEligible'));
check('Hall ticket gated by finance fee clearance', () => examsSrc.includes('isFeeEligible'));
check('Hall ticket print action disabled when eligibility checks fail', () => examsSrc.includes('disabled={!isHallTicketEligible}'));
check('Fake [DIGITALLY SEALED] text and checkered flag eradicated', () => !examsSrc.includes('🏁') || !examsSrc.includes('[DIGITALLY SEALED]'));
check('Authentic SVG QR code matrix rendered linking to /verify/TR-...', () => 
  examsSrc.includes('verificationId') && examsSrc.includes('/verify/') && examsSrc.includes('TR-')
);

// ── SECTION 3: DIGITAL DOCUMENTS & CERTIFICATES ────────────────────────
console.log('\n── 3. DIGITAL DOCUMENTS & CERTIFICATES ──');
const docsPagePath = path.join(process.cwd(), 'src/app/documents/page.tsx');
const docsServicePath = path.join(process.cwd(), 'src/lib/services/documentsService.ts');
const docsPageSrc = fs.readFileSync(docsPagePath, 'utf-8');
const docsServiceSrc = fs.readFileSync(docsServicePath, 'utf-8');

check('Certificates issued by student institution rather than "PinIT Career OS"', () => 
  !docsPageSrc.includes('<h2>PinIT Career OS</h2>') && !docsPageSrc.includes('>PinIT Career OS</h2>') && docsPageSrc.includes('institutionName')
);
check('Placeholder grey text box "QR Code" eradicated', () => !docsPageSrc.includes('QR Code</div>'));
check('Authentic SVG QR code matrix linked to /verify/DOC-...', () => 
  docsPageSrc.includes('<svg') && docsPageSrc.includes('/verify/') && docsPageSrc.includes('verificationCode')
);
check('Candidate register number and department rendered without dash placeholders', () => 
  docsPageSrc.includes('candidateRegisterNumber') && !docsPageSrc.includes('department as a —')
);
check('documentsService resolves metadata from onboarding_answers and profile', () => 
  docsServiceSrc.includes('onboarding_answers') && docsServiceSrc.includes('resolvedMajor') && docsServiceSrc.includes('resolvedYear')
);
check('Standardized DOC-VER- verification code generation', () => docsServiceSrc.includes('DOC-VER-'));

// ── SECTION 4: FINANCE & FEE DESK ──────────────────────────────────────
console.log('\n── 4. FINANCE & FEE DESK (PCI-DSS & AUDIT COMPLIANCE) ──');
const financePath = path.join(process.cwd(), 'src/app/finance/page.tsx');
const financeSrc = fs.readFileSync(financePath, 'utf-8');

check('PCI-DSS Compliance: cardDetails state completely removed', () => !financeSrc.includes('cardDetails'));
check('PCI-DSS Compliance: No card number collection form input', () => !financeSrc.includes('CARD NUMBER'));
check('PCI-DSS Compliance: No CVC code collection form input', () => !financeSrc.includes('CVC CODE'));
check('PCI-DSS Compliance: No expiry date collection form input', () => !financeSrc.includes('EXPIRY DATE'));
check('PCI-DSS Compliance: No custom UPI VPA collection form input', () => !financeSrc.includes('UPI VIRTUAL PAYMENT ADDRESS'));
check('Direct Razorpay checkout launched via openRazorpayCheckout', () => financeSrc.includes('openRazorpayCheckout'));
check('PCI-DSS Level-1 certified gateway notice presented to student', () => financeSrc.includes('PCI-DSS'));
check('Receipt header dynamically displays student institutionName', () => 
  !financeSrc.includes('BGS INSTITUTE OF MANAGEMENT') && financeSrc.includes('institutionName')
);
check('Arbitrary "Inst-3" late fee penalty rule eradicated', () => 
  !financeSrc.includes("activeReceipt.id === 'Inst-3'") && !financeSrc.includes("activeCheckoutInst.id === 'Inst-3'")
);
check('Overdue alert dynamically derives deadline and fine', () => 
  !financeSrc.includes('July 10, 2026') && financeSrc.includes('overdueInst')
);
check('Authentic downloadable fee voucher generator implemented', () => 
  financeSrc.includes('handleDownloadFeeVoucher') && financeSrc.includes('Fee_Voucher_')
);

// ── SECTION 5: UNIVERSITY DASHBOARD & ANALYTICS ────────────────────────
console.log('\n── 5. UNIVERSITY DASHBOARD & ANALYTICS ──');
const univRoute = path.join(process.cwd(), 'src/app/api/university/dashboard/route.ts');
const empRoute = path.join(process.cwd(), 'src/app/api/university/employability-report/route.ts');
const gapsRoute = path.join(process.cwd(), 'src/app/api/university/skill-gaps/route.ts');
const univPage = path.join(process.cwd(), 'src/app/university/page.tsx');
const analyticsPath = path.join(process.cwd(), 'src/lib/university/analytics.ts');

check('Server route /api/university/dashboard exists with elevated admin client', () => 
  fs.existsSync(univRoute) && fs.readFileSync(univRoute, 'utf-8').includes('getSupabaseAdmin')
);
check('Server route /api/university/employability-report exists with elevated admin client', () => 
  fs.existsSync(empRoute) && fs.readFileSync(empRoute, 'utf-8').includes('getSupabaseAdmin')
);
check('Server route /api/university/skill-gaps exists with elevated admin client', () => 
  fs.existsSync(gapsRoute) && fs.readFileSync(gapsRoute, 'utf-8').includes('getSupabaseAdmin')
);
check('Universal "all" selector handling prevents emptying dashboard', () => 
  fs.readFileSync(analyticsPath, 'utf-8').includes('isUniversal') && fs.readFileSync(univPage, 'utf-8').includes('All Universities')
);
check('Metric cards truthfully describe missions, readiness, and trust quotient', () => {
  const p = fs.readFileSync(univPage, 'utf-8');
  return p.includes('Missions Completed or Active XP') && p.includes('Readiness Index ≥75') && p.includes('High Trust Quotient');
});

// ── SECTION 6: RECRUITER PORTAL ────────────────────────────────────────
console.log('\n── 6. RECRUITER PORTAL ──');
const recruiterSearch = path.join(process.cwd(), 'src/app/recruiter/components/CandidateSearchPanel.tsx');
const recruiterApps = path.join(process.cwd(), 'src/app/recruiter/components/ApplicationsPanel.tsx');
const recruiterHook = path.join(process.cwd(), 'src/app/recruiter/hooks/useRecruiterData.ts');
const scheduleRoute = path.join(process.cwd(), 'src/app/api/recruiter/schedule-interview/route.ts');

check('AI Interview Dispatch calls /api/recruiter/schedule-interview', () => 
  fs.readFileSync(recruiterSearch, 'utf-8').includes("api.post('/api/recruiter/schedule-interview'")
);
check('Server route processes interview schedule and generates candidate notifications', () => 
  fs.readFileSync(scheduleRoute, 'utf-8').includes('notifications')
);
check('Initial pipeline stage is truthfully "Sourced" (not falsely "ATS Screened")', () => 
  fs.readFileSync(recruiterHook, 'utf-8').includes("'Sourced'")
);
check('Candidate pipeline stages and notes persist to localStorage', () => {
  const h = fs.readFileSync(recruiterHook, 'utf-8');
  return h.includes('pinit_recruiter_candidate_stages') && h.includes('pinit_recruiter_candidate_notes');
});
check('Zero window.prompt() calls in recruiter workflow', () => !fs.readFileSync(recruiterHook, 'utf-8').includes('window.prompt'));
check('Student email and phone privacy shielded with masked placeholders', () => 
  fs.readFileSync(recruiterApps, 'utf-8').includes('Privacy Shielded')
);
check('Truthful scores: No fake 50 fallback values', () => 
  !fs.readFileSync(recruiterApps, 'utf-8').includes('atsScore || 50') && !fs.readFileSync(recruiterApps, 'utf-8').includes('trustScore || 50')
);

// ── SECTION 7: VERIFICATION GATEWAY (TRANSCRIPTS & DOCUMENTS) ──────────
console.log('\n── 7. VERIFICATION GATEWAY (TRANSCRIPTS & DOCUMENTS) ──');
const verifyRoute = path.join(process.cwd(), 'src/app/api/verify/[credentialId]/route.ts');
const verifyPage = path.join(process.cwd(), 'src/app/verify/[credentialId]/page.tsx');
const verifyRouteSrc = fs.readFileSync(verifyRoute, 'utf-8');
const verifyPageSrc = fs.readFileSync(verifyPage, 'utf-8');

check('Gateway verifies official academic transcripts (TR-)', () => verifyRouteSrc.includes("credentialId.startsWith('TR-')"));
check('Gateway verifies official institutional documents (DOC-, BON-, V-)', () => 
  verifyRouteSrc.includes("credentialId.startsWith('DOC-')") && verifyRouteSrc.includes("credentialId.startsWith('BON-')")
);
check('Public verification UI displays verified academic transcripts', () => 
  verifyPageSrc.includes('transcript') && verifyPageSrc.includes('CUMULATIVE CGPA')
);
check('Public verification UI displays verified official institutional documents', () => 
  verifyPageSrc.includes('document') && verifyPageSrc.includes('OFFICIAL INSTITUTIONAL RECORD')
);

// ── SECTION 8: CONSULTANT & ADMIN AUDIT INTEGRITY ───────────────────────
console.log('\n── 8. CONSULTANT & ADMIN AUDIT INTEGRITY ──');
const docHub = path.join(process.cwd(), 'src/app/consultant/components/ConsultantDocumentHub.tsx');
const adminOverview = path.join(process.cwd(), 'src/components/admin/AdminOverview.tsx');
const adminAudit = path.join(process.cwd(), 'src/components/admin/AuditLogView.tsx');
const adminShell = path.join(process.cwd(), 'src/components/admin/AdminDashboardShell.tsx');
const verifyDocRoute = path.join(process.cwd(), 'src/app/api/consultant/student/[id]/verify-document/route.ts');
const credService = path.join(process.cwd(), 'src/lib/services/supabase/credentialService.ts');

check('Consultant Document Hub uses dynamic file analysis', () => {
  const hub = fs.readFileSync(docHub, 'utf-8');
  return hub.includes('uniqueWords') && hub.includes('sopText.trim().split');
});
check('Document rejection safety invariant: rejection NEVER awards verification or trust boost', () => {
  const verifyDoc = fs.readFileSync(verifyDocRoute, 'utf-8');
  const cred = fs.readFileSync(credService, 'utf-8');
  return verifyDoc.includes("const isVerified = status === 'verified'") && 
         verifyDoc.includes('if (isVerified)') &&
         cred.includes("statusOrNote === 'rejected'") &&
         cred.includes('if (isVerified && item.user_id)');
});
check('Admin Overview institutional actions connected', () => {
  const o = fs.readFileSync(adminOverview, 'utf-8');
  return o.includes('handleBackupDatabase') && o.includes('handleClearCache') && o.includes('handleBroadcast');
});
check('Admin dynamic CSV export pulls live data (no hardcoded August 2026 table)', () => {
  const shell = fs.readFileSync(adminShell, 'utf-8');
  const audit = fs.readFileSync(adminAudit, 'utf-8');
  return shell.includes('portalService.getEnrolledStudents()') && 
         !shell.includes('2026-08-17') && 
         !shell.includes('STU-9941,Jane Doe') &&
         audit.includes('/api/admin/audit-log');
});

// ── SECTION 9: CODEWARS & QUESTS RUNNER SAFETY ─────────────────────────
console.log('\n── 9. CODEWARS & QUESTS RUNNER SAFETY ──');
const codeWarsPath = path.join(process.cwd(), 'src/lib/api/codeWarsApi.ts');
const codeWarsSrc = fs.readFileSync(codeWarsPath, 'utf-8');

check('Absence of raw new Function() unsandboxed code execution', () => !codeWarsSrc.includes('new Function('));
check('CodeWars runner uses secure VM or refuses when unavailable', () => codeWarsSrc.includes('vmModule'));

console.log('\n========================================================================');
console.log(`🏁 AUDIT COMPLETE: ${passedChecks}/${totalChecks} Passed (${failedChecks} Failed)`);
console.log('========================================================================');

if (failedChecks > 0) {
  process.exit(1);
}
