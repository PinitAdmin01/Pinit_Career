import test from 'node:test';
import assert from 'node:assert/strict';
import {
  INTERNSHIP_CERTIFICATE_PREFIX,
  INTERNSHIP_CERTIFICATE_KIND,
  newInternshipCertificateId,
  isInternshipComplete,
  getInternshipHonestyLabel,
} from '../src/lib/certificates/internshipCertificate';
import {
  signRoadmapCertificate,
  verifyRoadmapCertificate,
} from '../src/lib/certificates/roadmapCertificate';

test('newInternshipCertificateId: starts with PIN-IN- and has valid hex format (FR-CERT-1 / T-19)', () => {
  const id1 = newInternshipCertificateId();
  const id2 = newInternshipCertificateId();

  assert.ok(id1.startsWith(INTERNSHIP_CERTIFICATE_PREFIX), 'starts with PIN-IN-');
  assert.ok(id2.startsWith(INTERNSHIP_CERTIFICATE_PREFIX), 'starts with PIN-IN-');
  assert.notEqual(id1, id2, 'distinct IDs generated');
  assert.match(id1, /^PIN-IN-[0-9A-F]{12}$/, 'matches PIN-IN-[0-9A-F]{12}');
});

test('isInternshipComplete: enforces 5 passed tickets + accepted final report (T-19)', () => {
  const validTasks = [
    { status: 'passed' },
    { status: 'passed' },
    { status: 'passed' },
    { status: 'passed' },
    { status: 'passed' },
  ];

  const validEnrollment = {
    status: 'active',
    final_report: 'I built five tickets across Month 1 skills. One challenge was handling parsing exceptions...',
    final_report_check: { matches: true },
  };

  // 1. All conditions met -> true
  assert.equal(isInternshipComplete({ enrollment: validEnrollment, tasks: validTasks }), true);

  // 2. Missing or empty enrollment -> false
  assert.equal(isInternshipComplete({ enrollment: null, tasks: validTasks }), false);

  // 3. Fewer than 5 tasks -> false
  assert.equal(isInternshipComplete({ enrollment: validEnrollment, tasks: validTasks.slice(0, 4) }), false);

  // 4. Any ticket not passed -> false
  const unpassedTasks = [
    { status: 'passed' },
    { status: 'passed' },
    { status: 'passed' },
    { status: 'open' },
    { status: 'locked' },
  ];
  assert.equal(isInternshipComplete({ enrollment: validEnrollment, tasks: unpassedTasks }), false);

  // 5. Final report missing -> false
  const noReport = { ...validEnrollment, final_report: '' };
  assert.equal(isInternshipComplete({ enrollment: noReport, tasks: validTasks }), false);

  // 6. Final report check rejected (matches: false) -> false
  const rejectedReport = { ...validEnrollment, final_report_check: { matches: false } };
  assert.equal(isInternshipComplete({ enrollment: rejectedReport, tasks: validTasks }), false);

  // 7. Final report check null -> false
  const uncheckedReport = { ...validEnrollment, final_report_check: null };
  assert.equal(isInternshipComplete({ enrollment: uncheckedReport, tasks: validTasks }), false);
});

test('getInternshipHonestyLabel: enforces honest simulation labelling per tier (FR-CERT-3)', () => {
  const t1 = getInternshipHonestyLabel('t1_job_sim', 'Zenith AI Corp');
  assert.equal(t1.isSimulated, true);
  assert.ok(t1.role.includes('Simulated'));
  assert.ok(t1.purposeWording.includes('Zenith AI Corp'));
  assert.ok(t1.purposeWording.includes('simulated company'));

  const t2 = getInternshipHonestyLabel('t2_virtual_team', 'Apex Systems');
  assert.equal(t2.isSimulated, true);

  const t3 = getInternshipHonestyLabel('t3_project', 'Client Project');
  assert.equal(t3.isSimulated, true);
  assert.ok(t3.title.includes('Simulated Client'));

  const t4 = getInternshipHonestyLabel('t4_industry', 'Industry Corp');
  assert.equal(t4.isSimulated, false);
  assert.ok(t4.title.includes('Verified Industry Internship'));

  const t5 = getInternshipHonestyLabel('t5_fellowship', 'Research Lab');
  assert.equal(t5.isSimulated, false);
  assert.ok(t5.title.includes('Verified Engineering Fellowship'));
});

test('Internship certificate signing and HMAC verification', () => {
  const id = newInternshipCertificateId();
  const fields = {
    id,
    studentId: 'user-uuid-1234',
    courseId: 't1_job_sim',
    projectId: 'enrollment-uuid-5678',
    interviewScore: 100,
    issuedAt: '2026-10-15T12:00:00.000Z',
  };

  const signature = signRoadmapCertificate(fields, 'test-secret-key-123');
  assert.match(signature, /^[0-9a-f]{64}$/);

  // Valid verification
  const isValid = verifyRoadmapCertificate(fields, signature, 'test-secret-key-123');
  assert.equal(isValid, true);

  // Wrong secret
  assert.equal(verifyRoadmapCertificate(fields, signature, 'wrong-secret'), false);

  // Tampered studentId
  assert.equal(
    verifyRoadmapCertificate({ ...fields, studentId: 'attacker-uuid' }, signature, 'test-secret-key-123'),
    false
  );

  // Tampered ID prefix
  const fakeId = id.replace('PIN-IN-', 'PIN-CP-');
  assert.equal(
    verifyRoadmapCertificate({ ...fields, id: fakeId }, signature, 'test-secret-key-123'),
    false
  );
});
