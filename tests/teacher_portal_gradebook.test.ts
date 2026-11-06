import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateRubric,
  evaluateSubmission,
  batchGradeCohort,
  AssignmentRubric,
  StudentSubmission,
} from '../src/lib/teacher/rubrics';
import { ExamProctoringEngine } from '../src/lib/teacher/exams';

test('Teacher Studio Block 78 - Gradebook, Rubrics & Exam Engine', async (t) => {
  await t.test('schedules an exam with proctoring config and validates time/duration constraints', () => {
    const engine = new ExamProctoringEngine();
    const exam = engine.scheduleExam({
      id: 'EXAM-CS402-2026',
      institutionId: 'inst-apex-001',
      courseCode: 'CS402',
      title: 'Advanced Distributed Systems & Consensus',
      department: 'CSE',
      semester: 7,
      startTime: '2026-12-01T09:00:00Z',
      durationMinutes: 180,
      totalMarks: 100,
      proctoringConfig: {
        maxTabSwitches: 3,
        autoDisqualifyOnLimit: true,
      },
    });

    assert.equal(exam.id, 'EXAM-CS402-2026');
    assert.equal(exam.totalMarks, 100);
    assert.equal(exam.proctoringConfig.maxTabSwitches, 3);
    assert.equal(exam.proctoringConfig.autoDisqualifyOnLimit, true);
  });

  await t.test('validates multi-criteria assignment rubric summing strictly to 100%', () => {
    const rubric: AssignmentRubric = {
      id: 'rubric-sys-101',
      assignmentId: 'assign-raft-consensus',
      institutionId: 'inst-apex-001',
      title: 'Raft Distributed Consensus Algorithm',
      passThreshold: 60,
      createdAt: new Date().toISOString(),
      criteria: [
        {
          id: 'crit-leader-election',
          name: 'Leader Election Safety',
          description: 'Term management and randomized heartbeats.',
          weight: 35,
          maxScore: 100,
          levels: [
            { minScore: 80, maxScore: 100, label: 'Exemplary', feedback: 'Perfect split-vote resolution.' },
            { minScore: 50, maxScore: 79, label: 'Proficient', feedback: 'Election succeeds with occasional edge cases.' },
            { minScore: 0, maxScore: 49, label: 'Needs Improvement', feedback: 'Split-vote deadlock occurs.' },
          ],
        },
        {
          id: 'crit-log-replication',
          name: 'Log Replication & Commitment',
          description: 'AppendEntries RPC handling and log compaction.',
          weight: 45,
          maxScore: 100,
          levels: [
            { minScore: 80, maxScore: 100, label: 'Exemplary', feedback: 'Strict log matching property preserved.' },
            { minScore: 50, maxScore: 79, label: 'Proficient', feedback: 'Log entries replicated with minor lag.' },
            { minScore: 0, maxScore: 49, label: 'Needs Improvement', feedback: 'Uncommitted entries overwritten prematurely.' },
          ],
        },
        {
          id: 'crit-code-modularity',
          name: 'Code Modularity & Test Coverage',
          description: 'Determinism and network partition simulations.',
          weight: 20,
          maxScore: 100,
          levels: [
            { minScore: 80, maxScore: 100, label: 'Exemplary', feedback: '95%+ branch test coverage with unit tests.' },
            { minScore: 0, maxScore: 79, label: 'Acceptable', feedback: 'Standard unit tests provided.' },
          ],
        },
      ],
    };

    const validation = validateRubric(rubric);
    assert.equal(validation.valid, true, 'Rubric must be valid when weights sum to 100');
  });

  await t.test('evaluates individual student submission and assigns weighted grade', () => {
    const rubric: AssignmentRubric = {
      id: 'rubric-sys-101',
      assignmentId: 'assign-raft-consensus',
      institutionId: 'inst-apex-001',
      title: 'Raft Distributed Consensus Algorithm',
      passThreshold: 60,
      createdAt: new Date().toISOString(),
      criteria: [
        {
          id: 'crit-leader-election',
          name: 'Leader Election',
          description: '',
          weight: 50,
          maxScore: 100,
          levels: [
            { minScore: 80, maxScore: 100, label: 'Exemplary', feedback: 'Flawless election.' },
            { minScore: 0, maxScore: 79, label: 'Needs Improvement', feedback: 'Issues in election.' },
          ],
        },
        {
          id: 'crit-log-replication',
          name: 'Log Replication',
          description: '',
          weight: 50,
          maxScore: 100,
          levels: [
            { minScore: 80, maxScore: 100, label: 'Exemplary', feedback: 'Flawless replication.' },
            { minScore: 0, maxScore: 79, label: 'Needs Improvement', feedback: 'Issues in replication.' },
          ],
        },
      ],
    };

    const submission: StudentSubmission = {
      submissionId: 'sub-001',
      studentRoll: 'APEX-CS-01',
      institutionId: 'inst-apex-001',
      rawCriterionScores: {
        'crit-leader-election': 90,
        'crit-log-replication': 85,
      },
    };

    const evalResult = evaluateSubmission(rubric, submission);
    assert.equal(evalResult.passed, true);
    assert.equal(evalResult.overallScore, 87.5);
    assert.ok(evalResult.criterionFeedback.some((f) => f.levelLabel === 'Exemplary'));
  });

  await t.test('batch grades cohort submissions and computes aggregate statistics', () => {
    const rubric: AssignmentRubric = {
      id: 'rubric-sys-101',
      assignmentId: 'assign-raft-consensus',
      institutionId: 'inst-apex-001',
      title: 'Raft Distributed Consensus Algorithm',
      passThreshold: 60,
      createdAt: new Date().toISOString(),
      criteria: [
        {
          id: 'crit-1',
          name: 'Core Logic',
          description: '',
          weight: 100,
          maxScore: 100,
          levels: [
            { minScore: 60, maxScore: 100, label: 'Pass', feedback: 'Passed.' },
            { minScore: 0, maxScore: 59, label: 'Fail', feedback: 'Failed.' },
          ],
        },
      ],
    };

    const cohort: StudentSubmission[] = [
      {
        submissionId: 'sub-1',
        studentRoll: 'ROLL-1',
        institutionId: 'inst-apex-001',
        rawCriterionScores: { 'crit-1': 90 },
      },
      {
        submissionId: 'sub-2',
        studentRoll: 'ROLL-2',
        institutionId: 'inst-apex-001',
        rawCriterionScores: { 'crit-1': 80 },
      },
      {
        submissionId: 'sub-3',
        studentRoll: 'ROLL-3',
        institutionId: 'inst-apex-001',
        rawCriterionScores: { 'crit-1': 40 },
      },
    ];

    const result = batchGradeCohort(rubric, cohort);
    assert.equal(result.summary.totalSubmissions, 3);
    assert.equal(result.summary.passCount, 2);
    assert.equal(result.summary.failCount, 1);
    assert.equal(result.summary.averageScore, 70);
  });
});
