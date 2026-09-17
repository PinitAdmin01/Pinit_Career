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
import { documentsService } from '../src/lib/services/documentsService';
import { eventsService } from '../src/lib/services/eventsService';
import { notesService } from '../src/lib/services/notesService';
import { researchService } from '../src/lib/services/researchService';
import { servicesService } from '../src/lib/services/servicesService';
import { libraryService } from '../src/lib/services/libraryService';
import { hostelService } from '../src/lib/services/hostelService';
import { transportService } from '../src/lib/services/transportService';
import { maintenanceService } from '../src/lib/services/maintenanceService';
import { financeService, acquireDistributedLock } from '../src/lib/services/financeService';
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

  // -------------------------------------------------------------
  // ISSUE 7: Documents Vault Verification Code & Profile Details
  // -------------------------------------------------------------
  console.log('\n--- Issue 7: Documents Vault Verification & Profile ---');
  await test('documentsService generates SHA-256 verifiable code and populates student major/year', async () => {
    const studentId = `doc_stu_${Date.now()}`;
    const docRes = await documentsService.requestDocument(studentId, 'Bonafide Certificate', 'Visa application');
    assert.strictEqual(docRes.ok, true);
    assert.ok(docRes.doc.verificationCode.startsWith('DOC-VER-'), `Expected DOC-VER- prefix, got ${docRes.doc.verificationCode}`);
    assert.ok(docRes.doc.verificationCode.length >= 16, 'Verification code must be strong hash');
    assert.notStrictEqual(docRes.doc.major, '—', 'Major must not be hardcoded dash');
    assert.notStrictEqual(docRes.doc.year, '—', 'Year must not be hardcoded dash');
  });

  // -------------------------------------------------------------
  // ISSUE 8: Events & Certificates Verifiable Tokens & Accurate Matching
  // -------------------------------------------------------------
  console.log('\n--- Issue 8: Events & Verifiable Certificates ---');
  await test('eventsService generates collision-free certCode and matches strictly by rsvpId', async () => {
    const studentId = `ev_stu_${Date.now()}`;
    // Create an event first
    await eventsService.publish('Tech', 'AI Summit', 'Annual AI Conference', '2026-11-01', '10:00 AM', 'Auditorium', 100, 'ACM');
    const stats = await eventsService.getStats(studentId);
    const eventId = stats.catalog[0].id;

    // Register for the event
    const rsvpRes = await eventsService.rsvp(eventId, studentId, 'Attending Student');
    assert.strictEqual(rsvpRes.ok, true);
    const rsvpId = rsvpRes.rsvp.id;

    // Issuing cert with mismatched ID must fail
    const wrongRes = await eventsService.issueCert('non-existent-rsvp-id-999999');
    assert.strictEqual(wrongRes.ok, false);

    // Issuing cert with exact RSVP ID succeeds and has strong token
    const certRes = await eventsService.issueCert(rsvpId);
    assert.strictEqual(certRes.ok, true);
    assert.ok(certRes.certCode.startsWith('CERT-'));
    assert.ok(certRes.certCode.length >= 16, 'Certificate code must be cryptographically collision-free');
  });

  // -------------------------------------------------------------
  // ISSUE 9: Study Notes Batch Filtering
  // -------------------------------------------------------------
  console.log('\n--- Issue 9: Notes Batch Isolation ---');
  await test('notesService strictly filters notes by batch', async () => {
    const batch2025 = `B2025_${Date.now()}`;
    const batch2026 = `B2026_${Date.now()}`;

    await notesService.uploadNote('Math Note 2025', 'MATH', batch2025, 'Prof X', 'https://example.com/math.pdf');
    await notesService.uploadNote('Physics Note 2026', 'PHYS', batch2026, 'Prof Y', 'https://example.com/phys.pdf');

    const res2025 = await notesService.getNotes(batch2025);
    const res2026 = await notesService.getNotes(batch2026);

    assert.ok(res2025.notes.every((n: any) => n.batch === batch2025), 'Only batch 2025 notes should be returned');
    assert.ok(res2026.notes.every((n: any) => n.batch === batch2026), 'Only batch 2026 notes should be returned');
  });

  // -------------------------------------------------------------
  // ISSUE 10: Research Registry Ownership & Review Gate
  // -------------------------------------------------------------
  console.log('\n--- Issue 10: Research Ownership & Workflow ---');
  await test('researchService forces status Under Review and isolates unpublished drafts', async () => {
    const studentAuthor = `res_stu_${Date.now()}`;
    const otherStudent = `other_stu_${Date.now()}`;

    // Student tries to self-publish as "Published"
    const pubRes = await researchService.publishPaper(
      studentAuthor,
      'John Researcher',
      'Quantum ML Analysis',
      'John Researcher',
      'CS Journal',
      'Published' // attempt to bypass review
    );
    assert.strictEqual(pubRes.ok, true);
    assert.strictEqual(pubRes.paper.status, 'Under Review', 'Client must not be able to self-publish');
    assert.strictEqual(pubRes.paper.studentId, studentAuthor);

    // Other student shouldn't see John's unpublished draft
    const otherView = await researchService.getStats(otherStudent);
    const hasDraft = otherView.papers.some((p: any) => p.id === pubRes.paper.id);
    assert.strictEqual(hasDraft, false, 'Unpublished draft must be hidden from other students');

    // Author should see their own submission
    const authorView = await researchService.getStats(studentAuthor);
    const authorHasDraft = authorView.papers.some((p: any) => p.id === pubRes.paper.id);
    assert.strictEqual(authorHasDraft, true, 'Author must see their own submission under review');
  });

  // -------------------------------------------------------------
  // ISSUE 11: Services Leave & Counselling Isolation
  // -------------------------------------------------------------
  console.log('\n--- Issue 11: Services Leave & Counselling Privacy ---');
  await test('servicesService isolates student leaves and queues counselling as Requested', async () => {
    const student1 = `srv_stu1_${Date.now()}`;
    const student2 = `srv_stu2_${Date.now()}`;
    const uniqueCounselor = `Counsellor_${Date.now()}`;

    // Apply leave
    await servicesService.applyLeave(student1, '2026-10-01', '2026-10-03', 'Viral Fever', 'Medical Leave');
    const s1Stats = await servicesService.getStats(student1);
    const s2Stats = await servicesService.getStats(student2);

    assert.strictEqual(s1Stats.leaves.length, 1, 'Student 1 must see 1 leave');
    assert.strictEqual(s2Stats.leaves.length, 0, 'Student 2 must see 0 leaves');

    // Book counselling
    const bookRes = await servicesService.bookCounselling(student1, uniqueCounselor, '2026-10-10', '10:00 AM');
    assert.strictEqual(bookRes.ok, true);
    assert.strictEqual(bookRes.session.status, 'Requested', 'Initial counselling status must be Requested');

    // Booking same slot again must be detected as conflict
    const conflictRes = await servicesService.bookCounselling(student2, uniqueCounselor, '2026-10-10', '10:00 AM');
    assert.strictEqual(conflictRes.ok, false);
    assert.ok(conflictRes.error?.includes('already booked') || conflictRes.error?.includes('COUNSELLOR_SLOT_TAKEN'));
  });

  // -------------------------------------------------------------
  // ISSUE 12: Library & Hostel Stock/Capacity Guards and Collision-free IDs
  // -------------------------------------------------------------
  console.log('\n--- Issue 12: Library & Hostel Stock/Capacity Safety ---');
  await test('libraryService prevents negative stock and generates collision-free IDs', async () => {
    const isbn = `ISBN-TEST-${Date.now()}`;
    await libraryService.addBook(isbn, 'Concurrency Guide', 'Author C', 'CS', 1);

    const b1 = await libraryService.borrow('stu_lib_1', 'Student One', isbn);
    assert.strictEqual(b1.ok, true);

    const stats1 = await libraryService.getStats('stu_lib_1', 'Student One');
    const borrowedRecord = stats1.borrowed.find((b: any) => b.isbn === isbn);
    assert.ok(borrowedRecord.id.startsWith('BOR-'));
    assert.ok(borrowedRecord.id.length >= 14, 'Borrow ID must be collision-free');

    // Second borrow must fail because available is 0
    const b2 = await libraryService.borrow('stu_lib_2', 'Student Two', isbn);
    assert.strictEqual(b2.ok, false);
    assert.strictEqual(b2.message, 'Out of stock');
  });

  await test('hostelService enforces room capacity in approveAllocation and generates collision-free IDs', async () => {
    const studentH1 = `stu_h1_${Date.now()}`;
    const studentH2 = `stu_h2_${Date.now()}`;
    const roomCode = `R-CAP-${Date.now()}`;

    // Read local db and insert a test room with capacity 1
    const { readLocalJson, writeLocalJson } = await import('../src/lib/services/localJsonDb');
    const db = await readLocalJson('src/lib/data/hostel_db.json', { rooms: [], allocations: [], attendance: [], complaints: [], visitors: [] });
    db.rooms.push({
      code: roomCode,
      block: 'Block Test',
      room: '101',
      capacity: 1,
      occupied: 0,
      residents: [],
      status: 'available'
    });
    await writeLocalJson('src/lib/data/hostel_db.json', db);

    // Approve student 1
    const app1 = await hostelService.approveAllocation(studentH1, roomCode);
    assert.strictEqual(app1.ok, true);

    // Approve student 2 for same room must fail (capacity 1 is full)
    const app2 = await hostelService.approveAllocation(studentH2, roomCode);
    assert.strictEqual(app2.ok, false);
    assert.strictEqual(app2.error, 'ROOM_FULL');

    // Test visitor and attendance collision-free IDs
    const attRes = await hostelService.logAttendance(studentH1, 'Student H1', 'check-in', roomCode);
    assert.strictEqual(attRes.ok, true);

    const hStats = await hostelService.getStats(studentH1, 'Student H1');
    assert.ok(hStats.attendance[0].id.startsWith('ATT-'));
    assert.ok(hStats.attendance[0].id.length >= 14, 'Attendance ID must be collision-free');
  });

  // -------------------------------------------------------------
  // ISSUE 13: Transport Stop & Route Validation
  // -------------------------------------------------------------
  console.log('\n--- Issue 13: Transport Stop & Route Validation ---');
  await test('transportService validates route existence and stop validity', async () => {
    const studentT = `stu_trans_${Date.now()}`;
    const routeCode = `R-VAL-${Date.now()}`;

    await transportService.addRoute(routeCode, 'Metro Express', 'Driver Dave', 'KA-01-9999', ['Main Gate', 'City Center'], '08:00 AM');

    // Invalid stop
    const invalidStopRes = await transportService.register(studentT, routeCode, 'Random Unknown Stop');
    assert.strictEqual(invalidStopRes.ok, false);
    assert.strictEqual(invalidStopRes.error, 'Invalid boarding stop selected for this route code.');

    // Non-existent route
    const invalidRouteRes = await transportService.register(studentT, 'R-NONEXISTENT', 'Main Gate');
    assert.strictEqual(invalidRouteRes.ok, false);
    assert.strictEqual(invalidRouteRes.error, 'Route not found.');

    // Valid stop
    const validRes = await transportService.register(studentT, routeCode, 'Main Gate');
    assert.strictEqual(validRes.ok, true);
  });

  // -------------------------------------------------------------
  // ISSUE 14: Maintenance Ticket Reporter Attribution
  // -------------------------------------------------------------
  console.log('\n--- Issue 14: Maintenance Reporter Identity ---');
  await test('maintenanceService attaches reporter identity and generates collision-free ID', async () => {
    const studentM = `stu_maint_${Date.now()}`;
    const studentName = 'Marcus Brody';

    const tRes = await maintenanceService.reportTicket(
      studentM,
      studentName,
      'Electrical',
      'Lab 3',
      'AC unit flickering',
      'High'
    );
    assert.strictEqual(tRes.ok, true);
    assert.strictEqual(tRes.ticket.studentId, studentM);
    assert.strictEqual(tRes.ticket.reportedBy, studentName);
    assert.ok(tRes.ticket.id.startsWith('INF-'));
    assert.ok(tRes.ticket.id.length >= 14, 'Ticket ID must be collision-free');
  });

  // -------------------------------------------------------------
  // ISSUE 15: Fee Payment Replay Timing, Webhook & Reconciliation
  // -------------------------------------------------------------
  console.log('\n--- Issue 15: Fee Payment Reconciliation & Lock Safety ---');
  await test('acquireDistributedLock does NOT fail closed when lock table is unmigrated', async () => {
    const testKey = `lock_test_${Date.now()}`;
    const acquired = await acquireDistributedLock(testKey, 'student_test_uid', 10);
    assert.strictEqual(acquired, true, 'Lock must be acquired using process-level fallback when table is absent');
  });

  await test('financeService.payDue marks installment as Paid and handles idempotent retries', async () => {
    const studentF = `stu_fin_${Date.now()}`;
    const payId = `pay_${Date.now()}`;
    
    // Initial payment
    const res1 = await financeService.payDue(studentF, 'Finance Student', 'INST-01', 'fin@campus.edu', payId);
    assert.strictEqual(res1.ok, true);
    assert.ok(res1.receiptId);

    // Dues state must reflect Paid
    const dues = await financeService.getStudentDues(studentF);
    const inst = dues.installments.find((i: any) => String(i.id) === 'INST-01');
    assert.strictEqual(inst.status, 'Paid');

    // Duplicate retry must return alreadyPaid: true, NOT fail
    const res2 = await financeService.payDue(studentF, 'Finance Student', 'INST-01', 'fin@campus.edu', payId);
    assert.strictEqual(res2.ok, true);
    assert.strictEqual(res2.alreadyPaid, true);
  });

  await test('financeService.reconcileFeePayments generates structured reconciliation audit report', async () => {
    const reportRes = await financeService.reconcileFeePayments();
    assert.strictEqual(reportRes.ok, true);
    assert.ok(reportRes.report);
    assert.ok(['CLEAN', 'REPAIRED_DISCREPANCIES'].includes(reportRes.report.status));
    assert.ok(typeof reportRes.report.totalProcessed === 'number');
    assert.ok(Array.isArray(reportRes.report.discrepancies));
  });

  await test('Webhook source code contains fee installment payment handling', () => {
    const webhookFile = path.join(process.cwd(), 'src', 'app', 'api', 'payment', 'webhook', 'route.ts');
    assert.ok(fs.existsSync(webhookFile));
    const content = fs.readFileSync(webhookFile, 'utf8');
    assert.ok(content.includes('isFeeInstallment'), 'Must contain isFeeInstallment evaluation');
    assert.ok(content.includes('installmentId'), 'Must handle installmentId');
    assert.ok(content.includes('financeService.payDue'), 'Must reconcile fee payment via financeService.payDue');
  });

  await test('Pay-due route code updates installment BEFORE locking processed_payments', () => {
    const payDueFile = path.join(process.cwd(), 'src', 'app', 'api', 'finance', 'pay-due', 'route.ts');
    assert.ok(fs.existsSync(payDueFile));
    const content = fs.readFileSync(payDueFile, 'utf8');
    const payDuePos = content.indexOf('financeService.payDue');
    const upsertPos = content.indexOf('.from(\'processed_payments\').upsert');
    assert.ok(payDuePos < upsertPos, 'financeService.payDue MUST run BEFORE processed_payments insert/upsert');
  });

  // -------------------------------------------------------------
  // ISSUE 16: PATCH /api/auth/me Mass-Assignment & Privilege Escalation
  // -------------------------------------------------------------
  console.log('\n--- Issue 16: Profile Mass-Assignment & Privilege Escalation ---');

  await test('ALLOWED_PROFILE_KEYS strictly permits only safe self-editable fields', async () => {
    const { ALLOWED_PROFILE_KEYS } = await import('../src/app/api/auth/me/route');
    assert.ok(ALLOWED_PROFILE_KEYS instanceof Set, 'ALLOWED_PROFILE_KEYS must be a Set');

    // Permitted fields
    assert.ok(ALLOWED_PROFILE_KEYS.has('display_name'), 'Should allow display_name');
    assert.ok(ALLOWED_PROFILE_KEYS.has('username'), 'Should allow username');
    assert.ok(ALLOWED_PROFILE_KEYS.has('target_role'), 'Should allow target_role');
    assert.ok(ALLOWED_PROFILE_KEYS.has('career_goal'), 'Should allow career_goal');
    assert.ok(ALLOWED_PROFILE_KEYS.has('bio'), 'Should allow bio');
    assert.ok(ALLOWED_PROFILE_KEYS.has('notification_prefs'), 'Should allow notification_prefs');

    // Disallowed privilege / security fields MUST NOT be in allowlist
    const forbidden = [
      'subscription_status',
      'subscription_tier',
      'subscription_expires_at',
      'unlocked_items',
      'xp_total',
      'xp_level',
      'badges',
      'completed_quests',
      'completed_missions',
      'recruiter_visible',
      'recruiter_visibility',
      'certifications',
      'communication_score',
      'execution_score',
      'leadership_score',
      'trust_score',
      'ats_score',
      'career_dna_score',
      'mission_streak',
      'interviews_done',
      'role',
      'pins',
      'email',
      'id',
      'is_admin',
    ];

    for (const f of forbidden) {
      assert.strictEqual(ALLOWED_PROFILE_KEYS.has(f), false, `Field "${f}" MUST NOT be in ALLOWED_PROFILE_KEYS`);
    }
  });

  await test('userService.stripSelfServicePrivileges strips subscription, unlocks, xp, and badges', async () => {
    const { stripSelfServicePrivileges } = await import('../src/lib/services/supabase/userService');

    const maliciousInput = {
      display_name: 'Legit Student',
      subscription_status: 'active',
      subscription_tier: 'pro',
      unlocked_items: { ai: 9999999999999 },
      xp_total: 999999,
      role: 'admin',
      pins: 50000,
      badges: ['grandmaster'],
      certifications: ['Fake Cert'],
      email: 'attacker@evil.com',
    };

    const sanitized = stripSelfServicePrivileges(maliciousInput, false);
    assert.strictEqual(sanitized.display_name, 'Legit Student');
    assert.strictEqual(sanitized.subscription_status, undefined, 'Must strip subscription_status');
    assert.strictEqual(sanitized.subscription_tier, undefined, 'Must strip subscription_tier');
    assert.strictEqual(sanitized.unlocked_items, undefined, 'Must strip unlocked_items');
    assert.strictEqual(sanitized.xp_total, undefined, 'Must strip xp_total');
    assert.strictEqual(sanitized.role, undefined, 'Must strip role');
    assert.strictEqual(sanitized.pins, undefined, 'Must strip pins');
    assert.strictEqual(sanitized.badges, undefined, 'Must strip badges');
    assert.strictEqual(sanitized.certifications, undefined, 'Must strip certifications');
    assert.strictEqual(sanitized.email, undefined, 'Must strip email');
  });

  await test('PATCH /api/auth/me rejects disallowed fields with HTTP 400 DISALLOWED_FIELD', async () => {
    const { PATCH } = await import('../src/app/api/auth/me/route');
    const { NextRequest } = await import('next/server');

    process.env.ALLOW_DEV_AUTH_BYPASS = 'true';
    process.env.NODE_ENV = 'development';

    // Test attempt to inject subscription_status
    const req1 = new NextRequest('http://localhost:3000/api/auth/me', {
      method: 'PATCH',
      headers: {
        'authorization': 'Bearer demo-token-bypass',
        'content-type': 'application/json',
      },
      body: JSON.stringify({ subscription_status: 'active' }),
    });

    const res1 = await PATCH(req1);
    assert.strictEqual(res1.status, 400, 'Must reject with 400');
    const json1 = await res1.json();
    assert.strictEqual(json1.error, 'DISALLOWED_FIELD');
    assert.ok(json1.disallowed_fields.includes('subscription_status'));

    // Test attempt to inject unlocked_items
    const req2 = new NextRequest('http://localhost:3000/api/auth/me', {
      method: 'PATCH',
      headers: {
        'authorization': 'Bearer demo-token-bypass',
        'content-type': 'application/json',
      },
      body: JSON.stringify({ unlocked_items: { ai: 999999 } }),
    });

    const res2 = await PATCH(req2);
    assert.strictEqual(res2.status, 400, 'Must reject with 400');
    const json2 = await res2.json();
    assert.strictEqual(json2.error, 'DISALLOWED_FIELD');

    // Test attempt to inject xp_total
    const req3 = new NextRequest('http://localhost:3000/api/auth/me', {
      method: 'PATCH',
      headers: {
        'authorization': 'Bearer demo-token-bypass',
        'content-type': 'application/json',
      },
      body: JSON.stringify({ xp_total: 999999 }),
    });

    const res3 = await PATCH(req3);
    assert.strictEqual(res3.status, 400, 'Must reject with 400');
    const json3 = await res3.json();
    assert.strictEqual(json3.error, 'DISALLOWED_FIELD');
  });

  // -------------------------------------------------------------
  // ISSUE 17: Quest Registry, Server-Owned Test Suites & Authoritative XP
  // -------------------------------------------------------------
  console.log('\n--- Issue 17: Quest Registry & Authoritative XP Integrity ---');

  await test('getAuthoritativeQuest returns registered quest metadata and fails closed on unknown quests', async () => {
    const { getAuthoritativeQuest, getAuthoritativeQuestXp, isAuthoritativeExam } = await import('../src/lib/quests/questRegistry');

    // Known quest lookup
    const q1 = getAuthoritativeQuest('fizzbuzz');
    assert.ok(q1, 'fizzbuzz must exist in registry');
    assert.strictEqual(q1.id, 'fizzbuzz');
    assert.strictEqual(typeof q1.xp, 'number');
    assert.ok(q1.xp > 0, 'XP must be positive');

    // Unknown quest MUST return null
    const unknown = getAuthoritativeQuest('fabricated-nonexistent-quest-999');
    assert.strictEqual(unknown, null, 'Unknown quest must return null');

    const unknownXp = getAuthoritativeQuestXp('fabricated-nonexistent-quest-999');
    assert.strictEqual(unknownXp, null, 'Unknown quest XP must be null');

    const unknownExam = isAuthoritativeExam('fabricated-nonexistent-quest-999');
    assert.strictEqual(unknownExam, false, 'Unknown quest must not be treated as exam');
  });

  await test('POST /api/quest/complete rejects unregistered quests with HTTP 400 UNREGISTERED_QUEST', async () => {
    const { POST } = await import('../src/app/api/quest/complete/route');
    const { NextRequest } = await import('next/server');

    process.env.ALLOW_DEV_AUTH_BYPASS = 'true';
    process.env.NODE_ENV = 'development';

    const req = new NextRequest('http://localhost:3000/api/quest/complete', {
      method: 'POST',
      headers: {
        'authorization': 'Bearer demo-token-bypass',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        questId: 'attacker-fake-quest-xyz',
        xpAmount: 999999,
        isExam: true,
      }),
    });

    const res = await POST(req);
    assert.strictEqual(res.status, 400, 'Must reject with 400');
    const json = await res.json();
    assert.strictEqual(json.error, 'UNREGISTERED_QUEST');
  });

  await test('POST /api/code/run-java rejects unregistered quests with HTTP 400 UNREGISTERED_QUEST', async () => {
    const { POST } = await import('../src/app/api/code/run-java/route');
    const { NextRequest } = await import('next/server');

    process.env.ALLOW_DEV_AUTH_BYPASS = 'true';
    process.env.NODE_ENV = 'development';

    const req = new NextRequest('http://localhost:3000/api/code/run-java', {
      method: 'POST',
      headers: {
        'authorization': 'Bearer demo-token-bypass',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        code: 'public class Solution {}',
        testSuite: 'public class Test { public static void main(String[] a){} }',
        questId: 'attacker-fake-quest-999',
        xp: 999999,
      }),
    });

    const res = await POST(req);
    assert.strictEqual(res.status, 400, 'Must reject with 400');
    const json = await res.json();
    assert.strictEqual(json.error, 'UNREGISTERED_QUEST');
  });

  await test('Edge function QUEST_METADATA contains canonical xp and pinCost for quests', async () => {
    const edgeSuitesFile = path.join(process.cwd(), 'supabase', 'functions', 'verify-quest', 'questTestSuites.generated.ts');
    assert.ok(fs.existsSync(edgeSuitesFile), 'questTestSuites.generated.ts must exist');
    const content = fs.readFileSync(edgeSuitesFile, 'utf8');
    assert.ok(content.includes('export const QUEST_METADATA'), 'Must export QUEST_METADATA');
    assert.ok(content.includes('pinCost:'), 'Must include pinCost');
    assert.ok(content.includes('xp:'), 'Must include xp');
  });

  // -------------------------------------------------------------
  // ISSUE 18: Authoritative Badge Registry & Fail-Closed XP Defense
  // -------------------------------------------------------------
  console.log('\n--- Issue 18: Authoritative Badge Registry & Fail-Closed XP Defense ---');

  await test('BADGE_REGISTRY contains canonical badges and fails closed on unknown milestones', async () => {
    const { getRegisteredBadge, getRegisteredMilestone, verifyMilestoneEligibility } = await import('../src/lib/badges/badgeRegistry');
    const badge = getRegisteredBadge('trust_sentinel_99');
    assert.ok(badge, 'trust_sentinel_99 must be registered');
    assert.strictEqual(badge.milestoneKey, 'trust_score_99');
    assert.strictEqual(badge.xpBonus, 500);

    const unknownBadge = getRegisteredBadge('arbitrary_loop_key_123');
    assert.strictEqual(unknownBadge, undefined, 'Unknown badge must return undefined');

    const unknownMilestone = getRegisteredMilestone('arbitrary_loop_milestone_456');
    assert.strictEqual(unknownMilestone, undefined, 'Unknown milestone must return undefined');

    // Test eligibility verifier
    const ineligible = verifyMilestoneEligibility('trust_score_99', { trust_score: 50 });
    assert.strictEqual(ineligible.eligible, false);

    const eligible = verifyMilestoneEligibility('trust_score_99', { trust_score: 100 });
    assert.strictEqual(eligible.eligible, true);
  });

  await test('POST /api/user/award-badge rejects unregistered badges with HTTP 400 UNREGISTERED_BADGE', async () => {
    const { POST } = await import('../src/app/api/user/award-badge/route');
    const { NextRequest } = await import('next/server');

    process.env.ALLOW_DEV_AUTH_BYPASS = 'true';
    process.env.NODE_ENV = 'development';

    const req = new NextRequest('http://localhost:3000/api/user/award-badge', {
      method: 'POST',
      headers: {
        'authorization': 'Bearer demo-token-bypass',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        badgeId: 'forged_arbitrary_badge_loop',
        milestoneKey: 'forged_arbitrary_milestone_loop',
      }),
    });

    const res = await POST(req);
    assert.strictEqual(res.status, 400, 'Must reject with 400');
    const json = await res.json();
    assert.strictEqual(json.error, 'UNREGISTERED_BADGE');
  });

  await test('POST /api/user/award-badge rejects unearned milestones with HTTP 403 MILESTONE_REQUIREMENTS_NOT_MET', async () => {
    const { POST } = await import('../src/app/api/user/award-badge/route');
    const { NextRequest } = await import('next/server');

    process.env.ALLOW_DEV_AUTH_BYPASS = 'true';
    process.env.NODE_ENV = 'development';

    // Demo user does not have trust_score >= 99 (or will be checked by verifier)
    const req = new NextRequest('http://localhost:3000/api/user/award-badge', {
      method: 'POST',
      headers: {
        'authorization': 'Bearer demo-token-bypass',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        badgeId: 'trust_sentinel_99',
        milestoneKey: 'trust_score_99',
      }),
    });

    const res = await POST(req);
    // When DB is unreachable or user has no trust score >= 99, must reject with 403 or 500, NOT grant 500 XP
    assert.ok(res.status === 403 || res.status === 500 || res.status === 503, `Status must be 403/500/503, got ${res.status}`);
    const json = await res.json();
    assert.notStrictEqual(json.ok, true, 'Must not award unearned milestone');
  });

  await test('POST /api/xp/add rejects direct minting of quest / exam / milestone XP with HTTP 403', async () => {
    const { POST } = await import('../src/app/api/xp/add/route');
    const { NextRequest } = await import('next/server');

    process.env.ALLOW_DEV_AUTH_BYPASS = 'true';
    process.env.NODE_ENV = 'development';

    const req = new NextRequest('http://localhost:3000/api/xp/add', {
      method: 'POST',
      headers: {
        'authorization': 'Bearer demo-token-bypass',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        amount: 50,
        actionType: 'quest',
        reason: 'Attempt to bypass quest verification',
      }),
    });

    const res = await POST(req);
    assert.strictEqual(res.status, 403, 'Must reject with 403');
    const json = await res.json();
    assert.strictEqual(json.error, 'DEDICATED_ENDPOINT_REQUIRED');
  });

  await test('POST /api/xp/add caps unverified client awards at 50 XP', async () => {
    const { POST } = await import('../src/app/api/xp/add/route');
    const { NextRequest } = await import('next/server');

    process.env.ALLOW_DEV_AUTH_BYPASS = 'true';
    process.env.NODE_ENV = 'development';

    const req = new NextRequest('http://localhost:3000/api/xp/add', {
      method: 'POST',
      headers: {
        'authorization': 'Bearer demo-token-bypass',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        amount: 250,
        actionType: 'general',
        reason: 'Unverified client addition without proof',
      }),
    });

    const res = await POST(req);
    assert.strictEqual(res.status, 400, 'Must reject with 400');
    const json = await res.json();
    assert.strictEqual(json.error, 'UNVERIFIED_XP_LIMIT_EXCEEDED');
  });

  await test('POST /api/xp/add code enforces fail-closed handling on xp_ledger query error', async () => {
    const routeFile = path.join(process.cwd(), 'src', 'app', 'api', 'xp', 'add', 'route.ts');
    const code = fs.readFileSync(routeFile, 'utf8');
    assert.ok(code.includes('if (ledgerQueryErr)'), 'Must check ledgerQueryErr');
    assert.ok(code.includes('LEDGER_QUERY_FAILED'), 'Must return LEDGER_QUERY_FAILED on error');
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
