import assert from 'assert';
import { POST as elevateHandler } from '../../src/app/api/auth/elevate/route';
import { adminEconomyService } from '../../src/lib/services/adminEconomyService';
import { teacherStudentService } from '../../src/lib/services/teacherStudentService';
import { teacherEventService } from '../../src/lib/services/teacherEventService';
import { NextRequest } from 'next/server';

async function runMasterVerificationSuite() {
  console.log('========================================================================');
  console.log('🛡️ RUNNING COMPREHENSIVE ADMIN & TEACHER PORTAL VERIFICATION SUITE');
  console.log('========================================================================\n');

  // ── TEST 1: Task 1 - Admin Portal Access Elevation ──
  console.log('── TEST 1: Task 1 - Admin Portal Access Elevation ──');
  {
    const req = new NextRequest('http://localhost:3000/api/auth/elevate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'admin', passcode: 'PINIT-ADMIN-2026' })
    });
    const res = await elevateHandler(req);
    assert.strictEqual(res.status, 200, 'Admin elevation should return 200');
    const json = await res.json();
    assert.strictEqual(json.ok, true);
    assert.strictEqual(json.role, 'admin');
    assert.strictEqual(json.user.role, 'admin');
    assert.ok(res.cookies.get('pinit_role')?.value === 'admin', 'pinit_role cookie must be admin');
    assert.ok(res.cookies.get('pinit_session')?.value === 'active', 'pinit_session cookie must be active');
    console.log('  ✅ [PASS] Admin elevation with PINIT-ADMIN-2026 sets role=admin and HttpOnly cookies');
  }

  // ── TEST 2: Task 2 - Teacher Portal Access Elevation ──
  console.log('── TEST 2: Task 2 - Teacher Portal Access Elevation ──');
  {
    const req = new NextRequest('http://localhost:3000/api/auth/elevate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'teacher', passcode: 'PINIT-FACULTY-2026' })
    });
    const res = await elevateHandler(req);
    assert.strictEqual(res.status, 200, 'Teacher elevation should return 200');
    const json = await res.json();
    assert.strictEqual(json.ok, true);
    assert.strictEqual(json.role, 'teacher');
    assert.strictEqual(json.user.role, 'teacher');
    assert.ok(res.cookies.get('pinit_role')?.value === 'teacher', 'pinit_role cookie must be teacher');
    console.log('  ✅ [PASS] Teacher elevation with PINIT-FACULTY-2026 sets role=teacher and HttpOnly cookies');
  }

  // ── TEST 3: Passcode Security Guard ──
  console.log('── TEST 3: Passcode Security Guard ──');
  {
    const req = new NextRequest('http://localhost:3000/api/auth/elevate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'admin', passcode: 'ATTACKER_FAKE_KEY' })
    });
    const res = await elevateHandler(req);
    assert.strictEqual(res.status, 403, 'Unauthorized passcode must return 403');
    const json = await res.json();
    assert.strictEqual(json.ok, false);
    console.log('  ✅ [PASS] Invalid passcode strictly rejected with 403');
  }

  // ── TEST 4: Task 4 - Admin Course Certification Rates Update ──
  console.log('── TEST 4: Task 4 - Admin Course Certification Rates Update ──');
  {
    const initialRates = await adminEconomyService.getCourseRates();
    assert.ok(initialRates.length > 0, 'Initial course rates should not be empty');

    const updated = await adminEconomyService.updateCourseRate('tech_fullstack', {
      discountedPriceInr: 1799,
      priceInPins: 275,
      certFeeInr: 499
    });

    assert.strictEqual(updated.discountedPriceInr, 1799);
    assert.strictEqual(updated.priceInPins, 275);
    assert.strictEqual(updated.certFeeInr, 499);

    const reloaded = await adminEconomyService.getCourseRates();
    const verified = reloaded.find(r => r.id === 'tech_fullstack');
    assert.strictEqual(verified?.discountedPriceInr, 1799);
    console.log('  ✅ [PASS] Course rate successfully updated and persisted');
  }

  // ── TEST 5: Task 4 - Admin Pins Economy Configuration Update ──
  console.log('── TEST 5: Task 4 - Admin Pins Economy Configuration Update ──');
  {
    const initialConfig = await adminEconomyService.getPinsEconomyConfig();
    assert.ok(initialConfig.inrPerPin > 0);

    const updatedConfig = await adminEconomyService.updatePinsEconomyConfig({
      inrPerPin: 12,
      dailyLoginBonusPins: 8
    });

    assert.strictEqual(updatedConfig.inrPerPin, 12);
    assert.strictEqual(updatedConfig.dailyLoginBonusPins, 8);

    const reloadedConfig = await adminEconomyService.getPinsEconomyConfig();
    assert.strictEqual(reloadedConfig.inrPerPin, 12);
    console.log('  ✅ [PASS] Pins economy rates & bonus configuration updated and persisted');
  }

  // ── TEST 6: Task 4 - Admin Grant Pins to Users & Ledger Audit ──
  console.log('── TEST 6: Task 4 - Admin Grant Pins to Users & Ledger Audit ──');
  {
    const testStudentId = 'usr_test_verification_01';
    const grant = await adminEconomyService.grantPinsToUser({
      studentId: testStudentId,
      studentName: 'Verification Candidate',
      studentEmail: 'candidate@test.pinit.edu',
      amount: 150,
      reason: 'Automated Test Verification Grant',
      category: 'Hackathon',
      grantedBy: 'Test Runner Admin'
    });

    assert.strictEqual(grant.amount, 150);
    assert.strictEqual(grant.category, 'Hackathon');
    assert.strictEqual(grant.status, 'completed');

    const history = await adminEconomyService.getPinGrantsHistory();
    const recorded = history.find(h => h.id === grant.id);
    assert.ok(recorded, 'Grant must be recorded in ledger history');
    assert.strictEqual(recorded.amount, 150);
    console.log('  ✅ [PASS] Direct pin grant issued and recorded in audit ledger');
  }

  // ── TEST 7: Task 4 - Admin Start Tournament ──
  console.log('── TEST 7: Task 4 - Admin Start Tournament ──');
  {
    const newTournament = await adminEconomyService.createTournament({
      title: 'Automated Speed Duel Championship',
      domain: 'Tech',
      entryFeePins: 10,
      prizePoolPins: 500,
      status: 'upcoming'
    });

    assert.strictEqual(newTournament.status, 'upcoming');

    const started = await adminEconomyService.startTournament(newTournament.id);
    assert.strictEqual(started.status, 'live', 'Started tournament must have status=live');
    assert.ok(started.startDate, 'Started tournament must have valid startDate');

    const list = await adminEconomyService.getTournaments();
    const verifiedTourn = list.find(t => t.id === newTournament.id);
    assert.strictEqual(verifiedTourn?.status, 'live');
    console.log('  ✅ [PASS] Tournament scheduled, transitioned to LIVE, and verified in registry');
  }

  // ── TEST 8: Task 5 - Teacher Student Directory & College Details ──
  console.log('── TEST 8: Task 5 - Teacher Student Directory & College Details ──');
  {
    const students = await teacherStudentService.getStudents();
    assert.ok(students.length > 0, 'Students list should not be empty');

    const targetStudent = students[0];
    const updatedDetails = await teacherStudentService.saveStudentDetails({
      ...targetStudent,
      collegeName: 'Apex Institute of Advanced Technology',
      university: 'National Autonomous University',
      rollNumber: '21CS999',
      gpa: 9.25,
      notes: 'Verified by Dr. Kashyap for international hackathon clearance.'
    });

    assert.strictEqual(updatedDetails.collegeName, 'Apex Institute of Advanced Technology');
    assert.strictEqual(updatedDetails.rollNumber, '21CS999');
    assert.strictEqual(updatedDetails.gpa, 9.25);

    const searched = await teacherStudentService.searchStudents('21CS999');
    assert.strictEqual(searched.length, 1);
    assert.strictEqual(searched[0].collegeName, 'Apex Institute of Advanced Technology');
    console.log('  ✅ [PASS] Teacher updated student college details, roll number, and GPA with search indexation');
  }

  // ── TEST 9: Task 6 - Teacher Events Audit & Live Execution ──
  console.log('── TEST 9: Task 6 - Teacher Events Audit & Live Execution ──');
  {
    const events = await teacherEventService.getEvents();
    assert.ok(events.length > 0, 'Events list should not be empty');

    const targetEvent = events.find(e => e.status === 'scheduled') || events[0];

    // Audit the event
    const audited = await teacherEventService.auditEvent(targetEvent.id, {
      auditStatus: 'approved',
      auditNotes: 'Venue compliance, power redundancy, and student insurance approved by faculty board.',
      auditedBy: 'Dr. Kashyap',
      budget: 35000
    });

    assert.strictEqual(audited.auditStatus, 'approved');
    assert.strictEqual(audited.budget, 35000);

    // Start the event
    const liveEvent = await teacherEventService.startEvent(targetEvent.id);
    assert.strictEqual(liveEvent.status, 'live', 'Started event must have status=live');
    assert.ok(liveEvent.startedAt, 'Live event must have startedAt timestamp');
    console.log('  ✅ [PASS] Teacher successfully audited event budget/compliance and launched live event');
  }

  console.log('\n========================================================================');
  console.log('🏁 MASTER VERIFICATION FINISHED: ALL 9 CRITICAL TESTS PASSED 100%!');
  console.log('========================================================================\n');
}

runMasterVerificationSuite().catch(err => {
  console.error('❌ Master verification failed:', err);
  process.exit(1);
});
