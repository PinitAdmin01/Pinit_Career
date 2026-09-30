import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getDeterministicTier2Tasks,
  TIER2_PYTHON_SKILLS,
  TIER2_SQL_SKILLS,
} from '../src/lib/internships/tier2Tasks';
import type { UserStory } from '../src/lib/internships/productBrief';

const mockStories: UserStory[] = [
  { id: 'US-01', title: 'Register patient', acceptance: ['Email validation'] },
  { id: 'US-02', title: 'Query doctors', acceptance: ['Filter active'] },
  { id: 'US-03', title: 'Slot manager', acceptance: ['No collision'] },
  { id: 'US-04', title: 'Join counts', acceptance: ['Count appointments'] },
];

test('T-26: exactly 8 tasks generated (2 per week across 4 weeks)', () => {
  const tasks = getDeterministicTier2Tasks(mockStories);
  assert.equal(tasks.length, 8, 'Must have exactly 8 tasks');

  // Verify weeks 1 through 4
  const weeks = tasks.map((t) => t.week);
  assert.deepEqual(weeks, [1, 1, 2, 2, 3, 3, 4, 4]);

  // Verify sequences 1 through 8
  const seqs = tasks.map((t) => t.seq);
  assert.deepEqual(seqs, [1, 2, 3, 4, 5, 6, 7, 8]);
});

test('T-26: language strictly alternates between Python and SQL every week', () => {
  const tasks = getDeterministicTier2Tasks(mockStories);
  const languages = tasks.map((t) => t.language);
  assert.deepEqual(languages, [
    'python',
    'sql',
    'python',
    'sql',
    'python',
    'sql',
    'python',
    'sql',
  ]);
});

test('T-26: SQL tasks have sql_setup DDL/DML, Python tasks do not', () => {
  const tasks = getDeterministicTier2Tasks(mockStories);

  for (const t of tasks) {
    if (t.language === 'sql') {
      assert.equal(typeof t.task.sql_setup, 'string');
      assert.equal((t.task.sql_setup || '').includes('CREATE TABLE'), true);
    } else {
      assert.equal(t.task.sql_setup, null);
    }
  }
});

test('T-26: skills conform strictly to Months 1-3 fundamentals', () => {
  const tasks = getDeterministicTier2Tasks(mockStories);
  const allowedPython = new Set<string>(TIER2_PYTHON_SKILLS);
  const allowedSql = new Set<string>(TIER2_SQL_SKILLS);

  for (const t of tasks) {
    assert.equal(t.task.skills.length >= 1, true);
    if (t.language === 'python') {
      for (const skill of t.task.skills) {
        assert.equal(allowedPython.has(skill), true, `Unexpected python skill: ${skill}`);
      }
    } else {
      for (const skill of t.task.skills) {
        assert.equal(allowedSql.has(skill), true, `Unexpected sql skill: ${skill}`);
      }
    }
  }
});

test('T-26: each task has non-empty visible and hidden tests', () => {
  const tasks = getDeterministicTier2Tasks(mockStories);
  for (const t of tasks) {
    assert.equal(t.task.visible_tests.length > 10, true);
    assert.equal(t.task.hidden_tests.length > 10, true);
    assert.equal(t.task.reference_solution.length > 10, true);
    assert.equal(t.task.brief.length > 20, true);
    assert.equal(typeof t.storyId, 'string');
  }
});
