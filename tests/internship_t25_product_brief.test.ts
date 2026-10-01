import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ProductBriefSchema,
  assignStoriesToMembers,
  generateProductBrief,
  type UserStory,
} from '../src/lib/internships/productBrief';
import { getDeterministicProductBrief } from './fixtures/deterministicInternshipData';
import { setLlmJsonTransportForTests } from '../src/lib/server/llmJson';

test('ProductBriefSchema validates compliant product brief structure', () => {
  const valid = {
    productName: 'LibreDesk Engine',
    summary: 'A complete university library catalogue and loan reservation backend system in Python and PostgreSQL.',
    dataModel: [
      { table: 'books', columns: ['id UUID PRIMARY KEY', 'isbn TEXT UNIQUE', 'title TEXT NOT NULL'] },
      { table: 'loans', columns: ['id UUID PRIMARY KEY', 'book_id UUID', 'user_id UUID', 'due_date DATE'] },
    ],
    stories: [
      { id: 'US-01', title: 'Register new catalogue book', acceptance: ['Check ISBN format', 'Save to DB'] },
      { id: 'US-02', title: 'Borrow book with quota limit', acceptance: ['Check borrower status', 'Create loan'] },
      { id: 'US-03', title: 'Return book and compute fines', acceptance: ['Calculate late days', 'Apply tariff'] },
      { id: 'US-04', title: 'Search books by genre and author', acceptance: ['Case-insensitive query', 'Paginate results'] },
      { id: 'US-05', title: 'Renew loan period', acceptance: ['Ensure no pending reservations', 'Extend 14 days'] },
      { id: 'US-06', title: 'Generate monthly loan audit', acceptance: ['Aggregate by department', 'Format report'] },
    ],
  };

  const parsed = ProductBriefSchema.safeParse(valid);
  assert.equal(parsed.success, true);
});

test('ProductBriefSchema rejects invalid structures (too few tables or stories)', () => {
  const invalid = {
    productName: 'Tiny',
    summary: 'Too short',
    dataModel: [{ table: 'books', columns: ['id'] }], // only 1 column, min 2
    stories: [{ id: '1', title: 'A', acceptance: [] }], // only 1 story, min 6
  };
  const parsed = ProductBriefSchema.safeParse(invalid);
  assert.equal(parsed.success, false);
});

test('assignStoriesToMembers distributes stories evenly in round-robin fashion', () => {
  const stories: UserStory[] = Array.from({ length: 14 }, (_, i) => ({
    id: `US-${i + 1}`,
    title: `Story ${i + 1}`,
    acceptance: ['Criteria A', 'Criteria B'],
  }));

  // Case A: 3 team members
  const memberIds3 = ['alice', 'bob', 'charlie'];
  const res3 = assignStoriesToMembers(stories, memberIds3);
  assert.equal(Object.keys(res3).length, 3);
  // 14 / 3 = 4 with remainder 2 -> [5, 5, 4]
  assert.equal(res3.alice.length, 5);
  assert.equal(res3.bob.length, 5);
  assert.equal(res3.charlie.length, 4);

  // Case B: 4 team members
  const memberIds4 = ['m1', 'm2', 'm3', 'm4'];
  const res4 = assignStoriesToMembers(stories, memberIds4);
  assert.equal(Object.keys(res4).length, 4);
  // 14 / 4 = 3 with remainder 2 -> [4, 4, 3, 3]
  assert.equal(res4.m1.length, 4);
  assert.equal(res4.m2.length, 4);
  assert.equal(res4.m3.length, 3);
  assert.equal(res4.m4.length, 3);

  // Case C: Solo student
  const resSolo = assignStoriesToMembers(stories, ['solo-dev']);
  assert.equal(resSolo['solo-dev'].length, 14);
});

test('getDeterministicProductBrief scales stories according to team vs solo mode', () => {
  const teamBrief = getDeterministicProductBrief('seed-team-1', false);
  assert.equal(teamBrief.stories.length >= 12 && teamBrief.stories.length <= 16, true, 'Team has 12-16 stories');
  assert.equal(teamBrief.dataModel.length >= 2, true);

  const soloBrief = getDeterministicProductBrief('seed-solo-1', true);
  assert.equal(soloBrief.stories.length >= 6 && soloBrief.stories.length <= 8, true, 'Solo has 6-8 stories');
  assert.equal(soloBrief.dataModel.length >= 2, true);
});

test('generateProductBrief produces valid brief with member story assignments', async () => {
  setLlmJsonTransportForTests(async () =>
    JSON.stringify(getDeterministicProductBrief('test-seed-100', false))
  );
  try {
    const res = await generateProductBrief({
      seed: 'test-seed-100',
      isSolo: false,
      memberIds: ['user-1', 'user-2', 'user-3'],
    });

    assert.equal(res.ok, true);
    if (!res.ok) return;

    assert.equal(typeof res.brief.productName, 'string');
    assert.equal(res.brief.stories.length >= 12, true);
    assert.equal(Object.keys(res.assignments).length, 3);
    assert.equal(res.assignments['user-1'].length > 0, true);
  } finally {
    setLlmJsonTransportForTests(null);
  }
});
