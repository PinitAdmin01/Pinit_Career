import test from 'node:test';
import assert from 'node:assert/strict';
import {
  SprintReviewSchema,
  evaluateSprintCriteria,
} from '../src/lib/internships/sprintReview';
import { MENTOR_REVIEW_REQUIRED } from '../src/lib/internships/tiers';

test('T-28: MENTOR_REVIEW_REQUIRED config flag is false by default under D1', () => {
  assert.equal(MENTOR_REVIEW_REQUIRED, false, 'Default D1 has no human mentors');
});

test('T-28: SprintReviewSchema validates approved and changes_requested formats', () => {
  const approved = {
    decision: 'approved',
    reasons: ['Tasks passed all assertions', 'Clean modular architecture'],
    summary: 'Great job!',
  };
  assert.equal(SprintReviewSchema.safeParse(approved).success, true);

  const changes = {
    decision: 'changes_requested',
    reasons: ['Missing pull request link in team repo'],
  };
  assert.equal(SprintReviewSchema.safeParse(changes).success, true);

  const invalid = {
    decision: 'pending', // invalid
    reasons: [],
  };
  assert.equal(SprintReviewSchema.safeParse(invalid).success, false);
});

test('T-28: evaluateSprintCriteria returns eligible when all 3 requirements met', () => {
  const res = evaluateSprintCriteria({
    tasksPassed: true,
    prCount: 2,
    standupCount: 1,
    totalTasksRequired: 2,
    passedTasksCount: 2,
  });

  assert.equal(res.eligible, true);
  assert.equal(res.failureReasons.length, 0);
});

test('T-28: evaluateSprintCriteria reports failure when tasks are incomplete', () => {
  const res = evaluateSprintCriteria({
    tasksPassed: false,
    prCount: 1,
    standupCount: 1,
    totalTasksRequired: 2,
    passedTasksCount: 1,
  });

  assert.equal(res.eligible, false);
  assert.equal(res.failureReasons.some((r) => r.includes('tasks')), true);
});

test('T-28: evaluateSprintCriteria reports failure when PR link is missing', () => {
  const res = evaluateSprintCriteria({
    tasksPassed: true,
    prCount: 0,
    standupCount: 1,
  });

  assert.equal(res.eligible, false);
  assert.equal(res.failureReasons.some((r) => r.includes('pull request')), true);
});

test('T-28: evaluateSprintCriteria reports failure when standup is missing', () => {
  const res = evaluateSprintCriteria({
    tasksPassed: true,
    prCount: 1,
    standupCount: 0,
  });

  assert.equal(res.eligible, false);
  assert.equal(res.failureReasons.some((r) => r.includes('stand-up')), true);
});
