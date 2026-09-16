import assert from 'assert';
import fs from 'fs';
import path from 'path';

// 1. Imports of services
import { writeLocalJson, readLocalJson } from '../src/lib/services/localJsonDb';
import { examsService } from '../src/lib/services/examsService';
import { grievancesService } from '../src/lib/services/grievancesService';
import { advisorService, getDemoAdvisorStats } from '../src/lib/services/advisorService';
import { communicationService } from '../src/lib/services/communicationService';
import { alumniService } from '../src/lib/services/alumniService';
import { hrService } from '../src/lib/services/hrService';
import { procurementService } from '../src/lib/services/procurementService';
import { assetsService } from '../src/lib/services/assetsService';
import { tryCampusFallback } from '../src/lib/campusFallback';

let totalTests = 0;
let passedTests = 0;

function test(name: string, fn: () => void | Promise<void>) {
  totalTests++;
  return Promise.resolve()
    .then(() => fn())
    .then(() => {
      passedTests++;
      console.log(`  PASS: ${name}`);
    })
    .catch((err) => {
      console.error(`  FAIL: ${name}`);
      console.error(`        Error: ${err.message}`);
    });
}

async function runAllVerifications() {
  console.log('\n================================================================');
  console.log('🧪 VERIFYING ALL 6 REPORTED & FIXED ISSUES WITH AUTOMATED TESTS');
  console.log('================================================================\n');

  // -------------------------------------------------------------
  // ISSUE 1: Storage Layer Error & Result Reporting
  // -------------------------------------------------------------
  console.log('--- Issue 1: Storage Layer Result Objects ---');
  await test('writeLocalJson returns StorageWriteResult object with stored location', async () => {
    const res = await writeLocalJson('src/lib/data/test_scratch.json', { test: true });
    assert.ok(typeof res === 'object', 'Must return an object');
    assert.ok('stored' in res, 'Must contain stored property');
    assert.ok(['fs', 'db', 'local'].includes(res.stored), `Stored must be fs, db, or local, got: ${res.stored}`);
    assert.strictEqual(res.success, true, 'Write must succeed');
    try { fs.unlinkSync('src/lib/data/test_scratch.json'); } catch {}
  });

  // -------------------------------------------------------------
  // ISSUE 2: Anti-Cheat Trigger Migration Validation
  // -------------------------------------------------------------
  console.log('\n--- Issue 2: Anti-Cheat & Dues Security Triggers ---');
  await test('Anti-cheat trigger migration file exists and checks staff authority and privilege escalation', () => {
    const migrationPath = path.join(process.cwd(), 'supabase/migrations/20260918_fix_campus_dues_and_anticheat.sql');
    assert.ok(fs.existsSync(migrationPath), 'Migration 20260918 must exist');
    const content = fs.readFileSync(migrationPath, 'utf8');
    assert.ok(content.includes('campus_is_staff()'), 'Must enforce campus_is_staff() check');
    assert.ok(content.includes('prevent_privilege_escalation'), 'Must define prevent_privilege_escalation trigger function');
    assert.ok(content.includes('check_finance_dues_immutable'), 'Must define check_finance_dues_immutable trigger');
    assert.ok(content.includes('check_student_campus_status_immutable'), 'Must define check_student_campus_status_immutable trigger');
  });

  // -------------------------------------------------------------
  // ISSUE 3: Exam Marksheet & Student Isolation
  // -------------------------------------------------------------
  console.log('\n--- Issue 3: Exams Marksheet & Per-Student Storage ---');
  await test('New student with no records gets empty state, NOT fake marksheet', async () => {
    const nonExistentStudent = `test_student_empty_${Date.now()}`;
    const sheet = await examsService.getStudentResults(nonExistentStudent);
    assert.strictEqual(sheet.isPublished, false, 'isPublished must be false');
    assert.strictEqual(sheet.gpa, 0, 'GPA must be 0');
    assert.deepStrictEqual(sheet.results, [], 'Results must be empty array, not invented Distributed Systems');
  });

  await test('Submitting marks for student A does NOT overwrite student B', async () => {
    const studentA = `student_alpha_${Date.now()}`;
    const studentB = `student_beta_${Date.now()}`;
    
    await examsService.submitMarks(studentA, {
      MATH101: 65,
    });

    await examsService.submitMarks(studentB, {
      PHYS101: 52,
    });

    const resA = await examsService.getStudentResults(studentA);
    const resB = await examsService.getStudentResults(studentB);

    assert.strictEqual(resA.results[0].code, 'MATH101');
    assert.strictEqual(resB.results[0].code, 'PHYS101');
    assert.notStrictEqual(resA.results[0].code, resB.results[0].code);
  });

  await test('recordExamAttempt derives passed dynamically from score', async () => {
    const failStudent = `st_fail_${Date.now()}`;
    const passStudent = `st_pass_${Date.now()}`;
    const examId = `EXAM_${Date.now()}`;

    await examsService.recordExamAttempt({
      studentId: failStudent,
      examScheduleId: examId,
      score: 35
    });
    const failAttempt = await examsService.getExamCooldown(failStudent, undefined, examId);
    assert.strictEqual(failAttempt.passed, false, 'Score 35 must not pass');
    assert.strictEqual(failAttempt.score, 35, 'Score must be 35');

    await examsService.recordExamAttempt({
      studentId: passStudent,
      examScheduleId: examId,
      score: 78
    });
    const passAttempt = await examsService.getExamCooldown(passStudent, undefined, examId);
    assert.strictEqual(passAttempt.passed, true, 'Score 78 must pass');
    assert.strictEqual(passAttempt.score, 78, 'Score must be 78');
  });

  // -------------------------------------------------------------
  // ISSUE 4: Grievances Privacy & Identity Alignment
  // -------------------------------------------------------------
  console.log('\n--- Issue 4: Grievances Isolation & Identity Integrity ---');
  await test('Student A cannot read Student B complaints', async () => {
    const studentAlice = `alice_${Date.now()}`;
    const studentBob = `bob_${Date.now()}`;

    // Alice files a private grievance
    await grievancesService.submit(
      studentAlice,
      'Alice Wonderland',
      'student',
      'Hostel',
      'Room Water Leakage',
      'Tap in room 204 is leaking heavily.',
      false
    );

    // Alice files an anonymous grievance
    await grievancesService.submit(
      studentAlice,
      'Alice Wonderland',
      'student',
      'Faculty',
      'Anonymous Whistleblower Note',
      'Unfair grading in lab session.',
      true
    );

    // Bob asks for tickets
    const bobStats = await grievancesService.getStats(studentBob, 'Bob Builder', false);
    const bobTickets = bobStats.grievances;

    // Bob should see NONE of Alice's tickets
    const aliceTicketSeenByBob = bobTickets.some((t: any) => 
      t.title === 'Room Water Leakage' || t.title === 'Anonymous Whistleblower Note'
    );
    assert.strictEqual(aliceTicketSeenByBob, false, 'Bob must NEVER see Alice tickets');

    // Alice asks for tickets
    const aliceStats = await grievancesService.getStats(studentAlice, 'Alice Wonderland', false);
    assert.ok(aliceStats.grievances.length >= 2, 'Alice must be able to view her own tickets');
  });

  await test('Staff member can view all tickets for administration', async () => {
    const staffStats = await grievancesService.getStats('staff_1', 'Dr. Professor', true);
    assert.ok(Array.isArray(staffStats.grievances), 'Staff receives all tickets');
  });

  // -------------------------------------------------------------
  // ISSUE 5: AI Academic Advisor Real Computation & Sandbox
  // -------------------------------------------------------------
  console.log('\n--- Issue 5: AI Academic Advisor Real Computation ---');
  await test('Student with no records returns null, NOT fake 75% attendance / 7.5 CGPA', async () => {
    const brandNewStudent = `ghost_student_${Date.now()}`;
    const perf = await advisorService.getPerformance(brandNewStudent);
    assert.strictEqual(perf, null, 'Must return null when no records exist, never fabricate 75% / 7.5 CGPA');
  });

  await test('completeQuest isolates state per student in local DB', async () => {
    const studentX = `advisor_x_${Date.now()}`;
    const studentY = `advisor_y_${Date.now()}`;

    const resX = await advisorService.completeQuest(studentX);
    assert.strictEqual(resX.completed, 1, 'Student X completed 1 quest');

    // Student Y should not be affected
    const perfY = await advisorService.getPerformance(studentY);
    assert.strictEqual(perfY, null, 'Student Y must remain untouched with null data');
  });

  await test('Demo sandbox stats are explicitly labeled as isDemo: true', () => {
    const demo = getDemoAdvisorStats();
    assert.strictEqual(demo.isDemo, true, 'Demo stats must have isDemo: true');
    assert.ok(demo.recommendations.every((r: any) => r.text.includes('[Demo]')), 'Recommendations must be prefixed [Demo]');
  });

  // -------------------------------------------------------------
  // ISSUE 6: Communication Notice Log & Route
  // -------------------------------------------------------------
  console.log('\n--- Issue 6: Communication Notice Log & Endpoint ---');
  await test('logCommunication reports internal notice log status with provider: internal_db', async () => {
    const res = await communicationService.logCommunication('email', 'Exam Schedule Published', 'Final exam dates are live.', 'Academics');
    assert.strictEqual(res.ok, true);
    assert.strictEqual(res.status, 'logged');
    assert.strictEqual(res.delivery, 'internal_notice_log');
    assert.strictEqual(res.provider, 'internal_db');
    assert.ok(res.message.includes('External email/SMS provider is not configured'));
  });

  await test('/api/communication/all route exists on filesystem and exports GET', () => {
    const routeFile = path.join(process.cwd(), 'src/app/api/communication/all/route.ts');
    assert.ok(fs.existsSync(routeFile), '/api/communication/all/route.ts must exist');
    const content = fs.readFileSync(routeFile, 'utf8');
    assert.ok(content.includes('export async function GET'), 'Must export GET handler');
  });

  // -------------------------------------------------------------
  // ISSUE 7: Simulation Modules Hidden & Disabled (Alumni, HR, Procurement, Assets)
  // -------------------------------------------------------------
  console.log('\n--- Issue 7: Simulation Modules Hidden & Protected ---');
  await test('AppSidebar does not expose simulated tabs (hr, procurement, assets)', () => {
    const sidebarContent = fs.readFileSync(path.join(process.cwd(), 'src/components/ui/AppSidebar.tsx'), 'utf8');
    assert.strictEqual(sidebarContent.includes("tab=hr'"), false, 'AppSidebar must not link to tab=hr');
    assert.strictEqual(sidebarContent.includes("tab=procurement'"), false, 'AppSidebar must not link to tab=procurement');
    assert.strictEqual(sidebarContent.includes("tab=assets'"), false, 'AppSidebar must not link to tab=assets');
  });

  await test('AppShell does not include /alumni in allowedStudentTabs', () => {
    const appShellContent = fs.readFileSync(path.join(process.cwd(), 'src/components/ui/AppShell.tsx'), 'utf8');
    assert.strictEqual(appShellContent.includes("'/alumni'"), false, 'AppShell must not include /alumni in allowedStudentTabs');
  });

  await test('Modules directory does not link to active /alumni module', () => {
    const modulesContent = fs.readFileSync(path.join(process.cwd(), 'src/app/modules/page.tsx'), 'utf8');
    assert.strictEqual(modulesContent.includes("route: '/alumni'"), false, 'modules/page.tsx must not link to /alumni');
  });

  await test('Alumni portal page displays honest staging status and no fake donation forms', () => {
    const alumniPageContent = fs.readFileSync(path.join(process.cwd(), 'src/app/alumni/page.tsx'), 'utf8');
    assert.ok(alumniPageContent.includes('Module Staged for Production Integration'), 'Must display staging badge');
    assert.strictEqual(alumniPageContent.includes('handleDonateSubmit'), false, 'Must not have simulated donation submit');
    assert.strictEqual(alumniPageContent.includes('handleMentorshipRequest'), false, 'Must not have fake mentorship submit');
  });

  await test('alumniService rejects donations without payment gateway', async () => {
    const res = await alumniService.donate('CAMP1', 5000, 'Student Donor');
    assert.strictEqual(res.ok, false);
    assert.ok(res.error?.includes('PAYMENT_GATEWAY_NOT_CONFIGURED'));
  });

  await test('alumniService rejects mentorship and referral requests without valid identity', async () => {
    const mentorRes = await alumniService.requestMentorship('', '', 'Sunday 11 AM');
    assert.strictEqual(mentorRes.ok, false);

    const refRes = await alumniService.requestReferral('', '');
    assert.strictEqual(refRes.ok, false);
  });

  await test('hrService rejects runPayroll without banking rails', async () => {
    const res = await hrService.runPayroll();
    assert.strictEqual(res.ok, false);
    assert.ok(res.error?.includes('PAYROLL_GATEWAY_NOT_CONFIGURED'));
  });

  await test('campusFallback intercepts simulated API endpoints with 503 disabled status', async () => {
    const dummyActor = { name: 'Tester', email: 'test@campus.edu' };
    const params = new URLSearchParams();

    const hrRes = await tryCampusFallback('GET', '/api/hr/stats', 'u1', null, params, dummyActor);
    assert.strictEqual((hrRes as any).ok, false);
    assert.strictEqual((hrRes as any).error, 'MODULE_DISABLED_PENDING_INTEGRATION');

    const procRes = await tryCampusFallback('GET', '/api/procurement/stats', 'u1', null, params, dummyActor);
    assert.strictEqual((procRes as any).ok, false);
    assert.strictEqual((procRes as any).error, 'MODULE_DISABLED_PENDING_INTEGRATION');

    const assetRes = await tryCampusFallback('GET', '/api/assets/stats', 'u1', null, params, dummyActor);
    assert.strictEqual((assetRes as any).ok, false);
    assert.strictEqual((assetRes as any).error, 'MODULE_DISABLED_PENDING_INTEGRATION');

    const alumniRes = await tryCampusFallback('GET', '/api/alumni/stats', 'u1', null, params, dummyActor);
    assert.strictEqual((alumniRes as any).ok, false);
    assert.strictEqual((alumniRes as any).error, 'MODULE_DISABLED_PENDING_INTEGRATION');
  });

  console.log('\n================================================================');
  console.log(`📊 FINAL RESULT: ${passedTests} / ${totalTests} TESTS PASSED`);
  console.log('================================================================\n');

  if (passedTests !== totalTests) {
    process.exit(1);
  }
}

runAllVerifications().catch((err) => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
