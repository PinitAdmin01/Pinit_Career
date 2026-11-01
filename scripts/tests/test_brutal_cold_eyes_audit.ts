import assert from 'assert';
import { POST as elevateHandler } from '../../src/app/api/auth/elevate/route';
import { adminEconomyService } from '../../src/lib/services/adminEconomyService';
import { teacherStudentService } from '../../src/lib/services/teacherStudentService';
import { teacherEventService } from '../../src/lib/services/teacherEventService';
import { NextRequest } from 'next/server';

console.log('========================================================================');
console.log('🩸 BRUTAL COLD-EYES AUDITOR SUITE: ATTACK & CRASH RESILIENCE');
console.log('========================================================================\n');

let passCount = 0;
let failCount = 0;

async function testCheck(title: string, fn: () => void | Promise<void>) {
  try {
    await fn();
    console.log(`  🔥 [BRUTAL PASS] ${title}`);
    passCount++;
  } catch (err: any) {
    console.error(`  ❌ [BRUTAL FAIL] ${title}:`, err.message);
    failCount++;
  }
}

async function runAudits() {
  console.log('── VECTOR 1: Passcode Injection, Fuzzing & Malicious Payloads ──');

  await testCheck('SQL Injection payload strictly rejected with 403', async () => {
    const req = new NextRequest('http://localhost:3000/api/auth/elevate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'admin', passcode: "' OR 1=1 --" })
    });
    const res = await elevateHandler(req);
    assert.strictEqual(res.status, 403);
    const data = await res.json();
    assert.strictEqual(data.ok, false);
    assert.strictEqual(data.error, 'INVALID_CREDENTIALS');
  });

  await testCheck('XSS script tag in passcode rejected with 403', async () => {
    const req = new NextRequest('http://localhost:3000/api/auth/elevate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'admin', passcode: '<script>alert(1)</script>' })
    });
    const res = await elevateHandler(req);
    assert.strictEqual(res.status, 403);
  });

  await testCheck('5,000-character buffer overflow passcode rejected gracefully without crash', async () => {
    const req = new NextRequest('http://localhost:3000/api/auth/elevate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'admin', passcode: 'A'.repeat(5000) })
    });
    const res = await elevateHandler(req);
    assert.strictEqual(res.status, 403);
  });

  await testCheck('Invalid role attempt (e.g. "hacker_root") does not grant elevated privileges', async () => {
    const req = new NextRequest('http://localhost:3000/api/auth/elevate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'hacker_root', passcode: 'PINIT-ADMIN-2026' })
    });
    const res = await elevateHandler(req);
    // Invalid role defaults to 403
    assert.strictEqual(res.status, 403);
  });

  console.log('\n── VECTOR 2: Admin Economy Edge Cases & Extreme Values ──');

  await testCheck('Course rate update with extreme prices persists cleanly', async () => {
    const courses = await adminEconomyService.getCourseRates();
    assert(courses.length > 0, 'Course rates seed must not be empty');
    const first = courses[0];

    const updated = await adminEconomyService.updateCourseRate(first.id, {
      discountedPriceInr: 99999,
      priceInPins: 5000,
      certFeeInr: 1299
    });

    assert.strictEqual(updated.discountedPriceInr, 99999);
    assert.strictEqual(updated.priceInPins, 5000);

    // Verify retrieval
    const reloaded = await adminEconomyService.getCourseRates();
    const target = reloaded.find(r => r.id === first.id);
    assert.strictEqual(target?.discountedPriceInr, 99999);
  });

  await testCheck('New course rate creation on-the-fly for unseen course ID', async () => {
    const newCourse = await adminEconomyService.updateCourseRate('course_quantum_computing_2026', {
      title: 'Quantum Computing & Post-RSA Cryptography',
      category: 'Advanced Tech',
      originalPriceInr: 8999,
      discountedPriceInr: 4999,
      priceInPins: 600,
      certFeeInr: 999,
      active: true
    });
    assert.strictEqual(newCourse.id, 'course_quantum_computing_2026');

    const list = await adminEconomyService.getCourseRates();
    const found = list.find(c => c.id === 'course_quantum_computing_2026');
    assert.ok(found !== undefined, 'Newly introduced course must be discoverable');
  });

  await testCheck('Pins Economy base rate update persists across reloads', async () => {
    const config = await adminEconomyService.getPinsEconomyConfig();
    assert(config.inrPerPin > 0, 'Base rate must be positive');

    const updated = await adminEconomyService.updatePinsEconomyConfig({
      inrPerPin: 15,
      dailyLoginBonusPins: 10,
      questCompleteBonusPins: 50
    });
    assert.strictEqual(updated.inrPerPin, 15);
    assert.strictEqual(updated.dailyLoginBonusPins, 10);

    const reloaded = await adminEconomyService.getPinsEconomyConfig();
    assert.strictEqual(reloaded.inrPerPin, 15);
  });

  await testCheck('Grant pins to user records audit trail with timestamps and positive values', async () => {
    const grant = await adminEconomyService.grantPinsToUser({
      studentId: 'usr_fuzz_tester_42',
      studentName: 'Chaos Agent',
      studentEmail: 'chaos@pinit.in',
      amount: 500,
      reason: 'Zero-day audit bug bounty reward',
      category: 'Hackathon',
      grantedBy: 'usr_cold_eyes_lead'
    });
    assert(grant.id.startsWith('grant_'));
    assert.strictEqual(grant.amount, 500);

    const ledger = await adminEconomyService.getPinGrantsHistory();
    const entry = ledger.find(l => l.id === grant.id);
    assert(entry !== undefined, 'Grant entry must exist in ledger');
    assert.strictEqual(entry!.studentId, 'usr_fuzz_tester_42');
    assert.strictEqual(entry!.category, 'Hackathon');
  });

  await testCheck('Negative or zero pin grant attempts are clamped to minimum 1 pin', async () => {
    const grant = await adminEconomyService.grantPinsToUser({
      studentId: 'usr_fuzz_tester_42',
      studentName: 'Chaos Agent',
      studentEmail: 'chaos@pinit.in',
      amount: -50,
      reason: 'Negative attack attempt',
      category: 'Administrative'
    });
    assert(grant.amount >= 1, `Expected amount to be >= 1, got ${grant.amount}`);
  });

  console.log('\n── VECTOR 3: Tournament State Machine & Concurrency ──');

  await testCheck('Tournament creation with validation and instant START transition', async () => {
    const t = await adminEconomyService.createTournament({
      title: 'Chaos Engineering Arena 2026',
      domain: 'Security & Cloud',
      prizePoolPins: 10000,
      entryFeePins: 50,
      startDate: new Date().toISOString(),
      durationMinutes: 90,
      maxParticipants: 100,
      rules: ['No unauthorized proxies', 'Strict AST linting'],
      createdBy: 'usr_cold_eyes_lead'
    });
    assert.strictEqual(t.status, 'upcoming');

    // Start tournament
    const live = await adminEconomyService.startTournament(t.id);
    assert.strictEqual(live.status, 'live');

    // End tournament
    const ended = await adminEconomyService.endTournament(t.id);
    assert.strictEqual(ended.status, 'completed');
  });

  console.log('\n── VECTOR 4: Teacher Student Records & Search Robustness ──');

  await testCheck('Search query handles special characters without regex crash', async () => {
    const maliciousSearches = [
      '([a-zA-Z]+)*',
      '\\\\\\',
      '[a-z',
      'SELECT * FROM users',
      '<script>'
    ];

    for (const query of maliciousSearches) {
      const results = await teacherStudentService.getStudents({ query });
      assert(Array.isArray(results), `getStudents for "${query}" must return an array`);
    }
  });

  await testCheck('Teacher update student college details, GPA and status', async () => {
    const students = await teacherStudentService.getStudents();
    assert(students.length > 0, 'Students should have seed data');
    const student = students[0];

    const updated = await teacherStudentService.saveStudentDetails({
      ...student,
      collegeName: 'Imperial College of Advanced Computing',
      university: 'National Tech University',
      rollNumber: 'NTU-2026-CS-001',
      department: 'Cybersecurity & Systems',
      semester: 6,
      gpa: 9.85,
      verificationStatus: 'verified',
      notes: 'Exceptional forensic analysis performance.'
    });

    assert.strictEqual(updated.collegeName, 'Imperial College of Advanced Computing');
    assert.strictEqual(updated.rollNumber, 'NTU-2026-CS-001');
    assert.strictEqual(updated.gpa, 9.85);

    // Re-fetch check
    const reloaded = await teacherStudentService.getStudentById(student.studentId);
    assert.strictEqual(reloaded?.collegeName, 'Imperial College of Advanced Computing');
  });

  console.log('\n── VECTOR 5: Teacher Event Compliance & Live Launch ──');

  await testCheck('Teacher audit compliance checklist calculation and live launch', async () => {
    const events = await teacherEventService.getEvents();
    assert(events.length > 0, 'Events list must have seed entries');
    const target = events[0];

    const audited = await teacherEventService.auditEvent(target.id, {
      auditStatus: 'approved',
      auditNotes: 'Passed all cold-eyes institutional guidelines.',
      auditedBy: 'Dr. Cold Eyes Auditor',
      budget: 25000
    });

    assert.strictEqual(audited.auditStatus, 'approved');
    assert.strictEqual(audited.budget, 25000);

    // Launch live
    const launched = await teacherEventService.startEvent(target.id);
    assert.strictEqual(launched.status, 'live');
    assert(typeof launched.startedAt === 'string');
  });

  console.log('\n========================================================================');
  console.log(`🏁 BRUTAL AUDIT SUMMARY: ${passCount} Passed, ${failCount} Failed`);
  console.log('========================================================================');

  if (failCount > 0) {
    process.exit(1);
  }
}

runAudits().catch((err) => {
  console.error('Audit fatal error:', err);
  process.exit(1);
});
