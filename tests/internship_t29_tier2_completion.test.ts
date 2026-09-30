import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isInternshipComplete,
  getInternshipHonestyLabel,
  newInternshipCertificateId,
} from '../src/lib/certificates/internshipCertificate';
import {
  createTopicEvaluationSignature,
  verifyTopicEvaluationSignature,
} from '../src/lib/interview/evaluationSignature';
import { isCapstoneInterviewPassed } from '../src/lib/interview/capstoneInterview';

test('T-29: isInternshipComplete validates Tier 2 requires 8 tasks, 4 sprints, and defense', () => {
  const enrollment = {
    tier: 't2_virtual_team',
    status: 'active',
  };

  const passedTasks = Array.from({ length: 8 }, (_, i) => ({
    status: 'passed',
    seq: i + 1,
  }));

  const approvedSprints = Array.from({ length: 4 }, (_, i) => ({
    status: 'approved',
    number: i + 1,
  }));

  // 1. All passed
  const complete = isInternshipComplete({
    enrollment,
    tasks: passedTasks,
    sprints: approvedSprints,
    defensePassed: true,
  });
  assert.equal(complete, true, 'Should pass when all criteria met');

  // 2. Via final_report_check.defenseResult
  const completeViaReport = isInternshipComplete({
    enrollment: {
      ...enrollment,
      final_report_check: {
        matches: true,
        defenseResult: { passed: true, score: 85, verdict: 'Hire' },
      },
    },
    tasks: passedTasks,
    sprints: approvedSprints,
  });
  assert.equal(completeViaReport, true, 'Should pass when defenseResult passed in final_report_check');

  // 3. Incomplete tasks count (< 8)
  const missingTask = isInternshipComplete({
    enrollment,
    tasks: passedTasks.slice(0, 7),
    sprints: approvedSprints,
    defensePassed: true,
  });
  assert.equal(missingTask, false, 'Should fail when fewer than 8 tasks');

  // 4. Any task not passed
  const unpassedTask = isInternshipComplete({
    enrollment,
    tasks: [...passedTasks.slice(0, 7), { status: 'submitted', seq: 8 }],
    sprints: approvedSprints,
    defensePassed: true,
  });
  assert.equal(unpassedTask, false, 'Should fail when any task is not passed');

  // 5. Incomplete sprints count (< 4)
  const missingSprint = isInternshipComplete({
    enrollment,
    tasks: passedTasks,
    sprints: approvedSprints.slice(0, 3),
    defensePassed: true,
  });
  assert.equal(missingSprint, false, 'Should fail when fewer than 4 sprints');

  // 6. Any sprint not approved
  const unapprovedSprint = isInternshipComplete({
    enrollment,
    tasks: passedTasks,
    sprints: [...approvedSprints.slice(0, 3), { status: 'changes_requested', number: 4 }],
    defensePassed: true,
  });
  assert.equal(unapprovedSprint, false, 'Should fail when any sprint is not approved');

  // 7. Defense not passed
  const failedDefense = isInternshipComplete({
    enrollment,
    tasks: passedTasks,
    sprints: approvedSprints,
    defensePassed: false,
  });
  assert.equal(failedDefense, false, 'Should fail when oral defense not passed');
});

test('T-29: Tier 2 honesty metadata enforces simulated labelling and truthful wording', () => {
  const meta = getInternshipHonestyLabel('t2_virtual_team', 'FinTech Labs');
  assert.equal(meta.isSimulated, true);
  assert.equal(meta.role, 'Backend Engineering Intern (Simulated)');
  assert.equal(meta.tierName, 'Tier 2: Virtual Team Internship (3 Months)');
  assert.equal(meta.purposeWording.includes('FinTech Labs'), true);
  assert.equal(meta.purposeWording.includes('4-week team sprint backlog'), true);
});

test('T-29: newInternshipCertificateId creates valid PIN-IN- prefixed identifiers', () => {
  const certId = newInternshipCertificateId();
  assert.equal(certId.startsWith('PIN-IN-'), true);
  assert.equal(certId.length > 10, true);
});

test('T-29: Cryptographic topic defense binding for Virtual Internship', () => {
  const studentId = 'usr_student_789';
  const score = 80;
  const verdict = 'Hire';
  const topic = 'Virtual Internship – Microservice Mesh';

  const token = createTopicEvaluationSignature(studentId, score, verdict, topic);
  assert.equal(typeof token, 'string');
  assert.equal(token.length > 0, true);

  // 1. Exact match verification
  const valid = verifyTopicEvaluationSignature(studentId, score, verdict, topic, token);
  assert.equal(valid, true, 'Token must verify with exact topic and student');

  // 2. Tampered score fails
  const tamperedScore = verifyTopicEvaluationSignature(studentId, 95, verdict, topic, token);
  assert.equal(tamperedScore, false, 'Tampered score must fail');

  // 3. Different topic fails (cross-topic replay protection)
  const wrongTopic = verifyTopicEvaluationSignature(studentId, score, verdict, 'Capstone Defense', token);
  assert.equal(wrongTopic, false, 'Replaying standard capstone token must fail');

  // 4. Pass criteria: score >= 65 and Hire or Conditional Hire
  assert.equal(isCapstoneInterviewPassed('Hire', 75), true);
  assert.equal(isCapstoneInterviewPassed('Conditional Hire', 65), true);
  assert.equal(isCapstoneInterviewPassed('Hire', 60), false, 'Score below 65 must fail');
  assert.equal(isCapstoneInterviewPassed('No Hire', 85), false, 'No Hire verdict must fail');
});

test('T-29: Demo URL structure requirements', () => {
  const isValidHttpsDemo = (url: string): boolean => {
    try {
      const parsed = new URL(url);
      return parsed.protocol === 'https:' && parsed.hostname.includes('.');
    } catch {
      return false;
    }
  };

  assert.equal(isValidHttpsDemo('https://cloud-task-manager.onrender.com'), true);
  assert.equal(isValidHttpsDemo('https://my-app.fly.dev/api/health'), true);
  assert.equal(isValidHttpsDemo('http://insecure-site.com'), false);
  assert.equal(isValidHttpsDemo('not-a-url'), false);
  assert.equal(isValidHttpsDemo('ftp://my-server.com'), false);
});
