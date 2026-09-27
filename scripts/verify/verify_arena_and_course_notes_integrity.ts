import { COURSES_REGISTRY } from '../src/lib/data/coursesData';
import { COURSE_NOTES_REGISTRY, getCourseNotes } from '../src/lib/data/courseNotesRegistry';
import { CONCEPT_ANALOGIES_REGISTRY, findConceptAnalogy } from '../src/lib/data/conceptAnalogies';
import { CodeWarsApiService, CODE_WARS_PROBLEMS_CATALOG } from '../src/lib/api/codeWarsApi';
import fs from 'fs';
import path from 'path';

let passedChecks = 0;
let totalChecks = 0;

function assert(condition: boolean, message: string) {
  totalChecks++;
  if (condition) {
    passedChecks++;
    console.log(`  ✓ ${message}`);
  } else {
    console.error(`  ✗ FAILED: ${message}`);
    process.exitCode = 1;
  }
}

async function run() {
  console.log('\n======================================================');
  console.log('--- 1. VERIFYING ALL 36 COURSES HAVE AUTHENTIC NOTES ---');
  console.log('======================================================');

  assert(COURSES_REGISTRY.length === 36, `COURSES_REGISTRY has exactly 36 courses (found ${COURSES_REGISTRY.length})`);

  const registeredNoteIds = Object.keys(COURSE_NOTES_REGISTRY);
  assert(registeredNoteIds.length >= 36, `COURSE_NOTES_REGISTRY has at least 36 entries (found ${registeredNoteIds.length})`);

  let genericFillerCount = 0;
  for (const course of COURSES_REGISTRY) {
    const note = getCourseNotes(course.id, course.title);
    assert(Boolean(note), `Course note exists for ${course.id} (${course.title})`);

    // Check for old filler strings
    const isGeneric =
      note.summary.includes('University-grade structured study notes for') ||
      note.cheatsheet.some(c => c.includes('Always enforce clean modular boundaries')) ||
      note.keyConcepts.some(k => k.codeOrExample?.includes('Scalable Architecture Blueprint'));

    if (isGeneric) {
      genericFillerCount++;
      console.error(`  Found generic filler for course: ${course.id}`);
    }

    assert(!isGeneric, `Course "${course.id}" has authentic tailored notes (no filler)`);
    assert(note.keyConcepts.length >= 3, `Course "${course.id}" has >= 3 key concepts (found ${note.keyConcepts.length})`);
    assert(note.cheatsheet.length >= 3, `Course "${course.id}" has >= 3 cheatsheet entries`);
    assert(note.commonPitfalls.length >= 2, `Course "${course.id}" has >= 2 common pitfalls`);
    assert(note.interviewPrep.length >= 1, `Course "${course.id}" has interview prep Q&A`);
  }

  assert(genericFillerCount === 0, `Zero courses receive generic fallback filler (found ${genericFillerCount})`);

  console.log('\n======================================================');
  console.log('--- 2. VERIFYING CONCEPT ANALOGIES CATALOG & LOOKUP ---');
  console.log('======================================================');

  const totalAnalogies = Object.keys(CONCEPT_ANALOGIES_REGISTRY).length;
  assert(totalAnalogies >= 30, `CONCEPT_ANALOGIES_REGISTRY expanded significantly (found ${totalAnalogies} concepts)`);

  // Verify findConceptAnalogy matches appropriate domains without defaulting to python-functions
  const testTopics = [
    { topic: 'B-Tree Database Indexing', expected: 'db-indexes' },
    { topic: 'Deadlocks and Lock Ordering', expected: 'sys-deadlocks' },
    { topic: 'Double-Entry Ledger Bookkeeping', expected: 'bcom-accounting' },
    { topic: 'Economic Order Quantity Inventory', expected: 'bcom-supplychain' },
    { topic: 'Docker Container Packaging', expected: 'devops-docker' },
    { topic: 'Scaled Dot-Product Self-Attention', expected: 'ml-transformer-attention' },
    { topic: 'Limit Order Book Microstructure', expected: 'quant-order-book' },
    { topic: 'XLOOKUP Dynamic Arrays', expected: 'excel-formulas' },
    { topic: 'STAR Behavioral Interview', expected: 'soft-skills-star' },
    { topic: 'Git DAG Branch Rebase', expected: 'git-dag' },
  ];

  for (const { topic, expected } of testTopics) {
    const matched = findConceptAnalogy(topic);
    assert(matched.conceptId === expected, `findConceptAnalogy("${topic}") -> ${matched.conceptId} (expected ${expected})`);
    assert(matched.conceptId !== 'python-functions', `Did not default to python-functions for "${topic}"`);
  }

  console.log('\n======================================================');
  console.log('--- 3. VERIFYING CODE WARS DETERMINISTIC EVALUATORS ---');
  console.log('======================================================');

  // Concurrency problem tests
  const concurrencyProb = CODE_WARS_PROBLEMS_CATALOG.find(p => p.id === 'war_concurrency_deadlock_02')!;
  assert(Boolean(concurrencyProb), 'Concurrency deadlock problem exists in catalog');

  // A. Valid solution should pass all tests
  const validConcurrencyCode = `
    function acquireResourcesDeterministically(requests) {
      const set = new Set();
      for (const req of requests) {
        for (const r of (req.resourceIds || [])) {
          set.add(r);
        }
      }
      return Array.from(set).sort();
    }
  `;
  const match1 = CodeWarsApiService.startMatch('stud_1', 'war_concurrency_deadlock_02');
  const resValidConcurrency = await CodeWarsApiService.submitSolution({
    matchId: match1.id,
    studentId: 'stud_1',
    code: validConcurrencyCode,
    language: 'typescript',
    timeSpentSeconds: 45
  });
  assert(resValidConcurrency.passed === true, 'Valid concurrency solution passes all test cases');
  assert(resValidConcurrency.testsPassed === 2, 'Passed exactly 2 concurrency test cases');

  // B. Fake solution that only contains keyword "sort" without valid execution must FAIL
  const fakeConcurrencyCode = `
    // This comment has sort in it but returns nothing
    function acquireResourcesDeterministically(requests) {
      return [];
    }
  `;
  const match2 = CodeWarsApiService.startMatch('stud_1', 'war_concurrency_deadlock_02');
  const resFakeConcurrency = await CodeWarsApiService.submitSolution({
    matchId: match2.id,
    studentId: 'stud_1',
    code: fakeConcurrencyCode,
    language: 'typescript',
    timeSpentSeconds: 45
  });
  assert(resFakeConcurrency.passed === false, 'Fake concurrency solution with keyword "sort" is REJECTED by real evaluator');
  assert(resFakeConcurrency.testsPassed === 0, 'Zero tests passed for non-sorting return');

  // SQL B-Tree problem tests
  const sqlProb = CODE_WARS_PROBLEMS_CATALOG.find(p => p.id === 'war_sql_btree_query_03')!;
  assert(Boolean(sqlProb), 'SQL B-Tree problem exists in catalog');

  // A. Valid SQL solution
  const validSqlCode = `
    function generateOptimalCompositeIndex(table, eq, range) {
      const allCols = [...eq, range];
      const name = \`idx_\${table}_\${allCols.join('_')}\`;
      return \`CREATE INDEX \${name} ON \${table} (\${allCols.join(', ')});\`;
    }
  `;
  const match3 = CodeWarsApiService.startMatch('stud_1', 'war_sql_btree_query_03');
  const resValidSql = await CodeWarsApiService.submitSolution({
    matchId: match3.id,
    studentId: 'stud_1',
    code: validSqlCode,
    language: 'typescript',
    timeSpentSeconds: 30
  });
  assert(resValidSql.passed === true, 'Valid SQL index generator solution passes all test cases');
  assert(resValidSql.testsPassed === 2, 'Passed exactly 2 SQL test cases');

  // B. Fake SQL solution with keyword "idx_" but incorrect output must FAIL
  const fakeSqlCode = `
    // Has idx_ and create index in comment
    function generateOptimalCompositeIndex(table, eq, range) {
      return "CREATE INDEX invalid;";
    }
  `;
  const match4 = CodeWarsApiService.startMatch('stud_1', 'war_sql_btree_query_03');
  const resFakeSql = await CodeWarsApiService.submitSolution({
    matchId: match4.id,
    studentId: 'stud_1',
    code: fakeSqlCode,
    language: 'typescript',
    timeSpentSeconds: 30
  });
  assert(resFakeSql.passed === false, 'Fake SQL solution is REJECTED by evaluator');
  assert(resFakeSql.testsPassed === 0, 'Zero tests passed for invalid index DDL');

  // Fail-closed test on unknown problem
  const fakeProb = {
    id: 'war_unknown_fake_99',
    title: 'Fake Problem',
    difficulty: 'basic',
    competencyId: 'fake',
    description: 'Fake',
    starterCode: { typescript: '' },
    testCases: [{ input: '1', expectedOutput: '1' }],
    timeLimitSeconds: 60,
    memoryLimitMb: 64,
    xpReward: 50,
    tags: []
  } as any;

  const resUnknown = (CodeWarsApiService as any).evaluatePolyglotSolution('const x = 123456789012345678901234567890;', 'typescript', fakeProb);
  assert(resUnknown.testsPassed === 0, 'Unknown problem fails closed with 0 tests passed');
  assert(resUnknown.evalErrorLog.includes('Unknown or unregistered arena problem ID'), 'Clear fail-closed error log emitted for unknown problem');

  assert(!resValidConcurrency.logs.includes('Beats 91% of submissions'), 'Fabricated metric "Beats 91%" completely removed');
  assert(!resValidConcurrency.logs.includes('38.4 MB'), 'Fabricated metric "38.4 MB" completely removed');
  assert(resValidConcurrency.logs.includes('Deterministic Execution Verified'), 'Honest deterministic verification logged');

  console.log('\n======================================================');
  console.log('--- 4. VERIFYING ARENA UI, MONACO & XP INTEGRITY ---');
  console.log('======================================================');

  const arenaPagePath = path.join(__dirname, '../src/app/arena/page.tsx');
  const arenaContent = fs.readFileSync(arenaPagePath, 'utf-8');

  assert(arenaContent.includes('<MonacoEditor'), 'Arena page renders MonacoEditor component');
  assert(!arenaContent.includes('<textarea\n                      value={code}'), 'Raw textarea has been removed from Code Wars editor');
  assert(arenaContent.includes('solvedProblemIds'), 'Arena tracks solvedProblemIds for XP deduplication');
  assert(arenaContent.includes('First Clear'), 'Arena distinguishes first clear from repeat runs');
  assert(arenaContent.includes('Turing Benchmark AI opponent pacing simulation'), 'Authentic Turing AI pacing simulation loop implemented');

  console.log('\n======================================================');
  console.log(`TEST RESULTS: ${passedChecks} / ${totalChecks} ASSERTIONS PASSED!`);
  console.log('======================================================\n');
}

run().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});
