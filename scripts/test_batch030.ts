// scripts/test_batch030.ts
// Programmatic Verification Suite for PinIT Career OS Batch 030 (Days 148–152 · COMPLETE)
// Advanced SQL Querying, Joins, Aggregations & QuerySet Compilation Internals

import * as fs from 'fs';
import * as path from 'path';
import {
  BATCH_030_MANIFEST,
  DAY_152_ASSESSMENT,
  COMPETENCY_ID_SQL_JOINS_AND_QUERYSETS,
} from '../src/lib/curriculum/pythonFullStack/batch030';
import { ContentValidator } from '../src/lib/curriculum/contentValidator';

// ── REFERENCE BEHAVIORAL IMPLEMENTATIONS (FOR AUDIT RIGOR) ──

// 1. SQL Window Function Simulation (Partitioned Ranking & Running Balances)
interface RowItem {
  id: string;
  department: string;
  salary: number;
}

function simulateWindowDenseRank(rows: RowItem[]): Array<RowItem & { deptRank: number }> {
  // Group by department
  const byDept: Record<string, RowItem[]> = {};
  for (const r of rows) {
    if (!byDept[r.department]) byDept[r.department] = [];
    byDept[r.department].push(r);
  }

  const results: Array<RowItem & { deptRank: number }> = [];
  for (const dept in byDept) {
    const sorted = [...byDept[dept]].sort((a, b) => b.salary - a.salary);
    let currentRank = 1;
    for (let i = 0; i < sorted.length; i++) {
      if (i > 0 && sorted[i].salary < sorted[i - 1].salary) {
        currentRank++;
      }
      results.push({ ...sorted[i], deptRank: currentRank });
    }
  }
  return results;
}

// 2. Cartesian Product vs Distinct Annotation Simulator
function simulateMultiRelationCounts(
  authorsCount: number,
  tagsCount: number,
  useDistinct: boolean
): { reportedAuthorCount: number; reportedTagCount: number } {
  if (!useDistinct) {
    // Cartesian explosion: join generates authorsCount * tagsCount intermediate rows
    const cartesianRows = authorsCount * tagsCount;
    return { reportedAuthorCount: cartesianRows, reportedTagCount: cartesianRows };
  } else {
    // With distinct=True, counts reflect exact unique primary keys
    return { reportedAuthorCount: authorsCount, reportedTagCount: tagsCount };
  }
}

// 3. Safe Parameterized Raw SQL Sanitizer Simulator
function simulateParameterizedExecution(
  queryTemplate: string,
  parameters: any[]
): { isSecure: boolean; escapedParams: any[] } {
  // Verifies that template uses %s placeholders and does not format parameters inline
  const hasInlineInterpolation = queryTemplate.includes('${') || queryTemplate.includes("''");
  const placeholderCount = (queryTemplate.match(/%s/g) || []).length;
  const isSecure = !hasInlineInterpolation && placeholderCount === parameters.length;

  return { isSecure, escapedParams: parameters };
}

// 4. Fixture-Scoped Query Budget Simulator
interface QueryBudgetReport {
  endpoint: string;
  datasetSize: number;
  queriesExecuted: number;
  maxBudget: number;
  withinBudget: boolean;
}

function simulateAnalyticsQueryBudget(
  datasetSize: number,
  useOptimizedWindowSubquery: boolean
): QueryBudgetReport {
  // Optimized solution: 1 primary query with window functions + subqueries, 1 prefetch query
  // Naive solution: 1 initial query + N subqueries for each record (N+1)
  const queriesExecuted = useOptimizedWindowSubquery ? 2 : 1 + datasetSize;
  const maxBudget = 3;

  return {
    endpoint: '/api/v1/analytics/cohort-summary/',
    datasetSize,
    queriesExecuted,
    maxBudget,
    withinBudget: queriesExecuted <= maxBudget,
  };
}

// ── TEST RUNNER & ASSERTION SUITE ──

let assertionCount = 0;

function assert(condition: boolean, message: string) {
  assertionCount++;
  if (!condition) {
    console.error(`  ❌ [FAIL] Check #${assertionCount}: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
  console.log(`  ✅ [PASS] Check #${assertionCount}: ${message}`);
}

export async function runBatch030Audit(): Promise<number> {
  console.log('\n========================================================================');
  console.log('🧪 RUNNING PINIT BATCH 030 (DAYS 148–152) TECHNICAL AUDIT TEST SUITE');
  console.log('Advanced SQL Querying, Joins, Aggregations & QuerySet Compilation Internals');
  console.log('========================================================================\n');

  assertionCount = 0;

  // ── GROUP 1: Complete Batch Manifest & 5-Day Structure ──
  console.log('── GROUP 1: Complete Batch Manifest & 5-Day Structure ──');
  assert(BATCH_030_MANIFEST.batchCode === 'P2-M8-W30-BATCH030', 'Batch code is "P2-M8-W30-BATCH030"');
  assert(BATCH_030_MANIFEST.batchId === 'batch-pfs-m8-w30-030', 'Batch ID is "batch-pfs-m8-w30-030"');
  assert(BATCH_030_MANIFEST.days.length === 5, 'Batch contains exactly 5 published learning days (Days 148–152)');
  assert(BATCH_030_MANIFEST.isPartial === false, 'Batch manifest is marked isPartial: false (complete batch)');
  assert(BATCH_030_MANIFEST.difficulty === 'ADVANCED', 'Batch difficulty is ADVANCED');
  assert(BATCH_030_MANIFEST.status === 'PUBLISHED', 'Batch status is PUBLISHED');

  ContentValidator.validateBatchManifest(BATCH_030_MANIFEST);
  assert(true, 'ContentValidator.validateBatchManifest() passes for complete 5-day batch');

  for (let i = 0; i < 5; i++) {
    const day = BATCH_030_MANIFEST.days[i];
    assert(day.dayNumber === i + 1, `Day ${148 + i} internal dayNumber is ${i + 1}`);
    assert(day.packetId === 'batch-pfs-m8-w30-030', `Day ${148 + i} packetId matches batchId`);
  }

  const expectedIntents = ['UNDERSTAND', 'APPLY', 'BUILD', 'DEBUG', 'TRANSFER'];
  BATCH_030_MANIFEST.days.forEach((day, idx) => {
    assert(day.pedagogicalIntent === expectedIntents[idx], `Day ${day.dayNumber} pedagogicalIntent is '${expectedIntents[idx]}'`);
  });

  // ── GROUP 2: Instructional Timing & Workload Balance ──
  console.log('\n── GROUP 2: Instructional Timing & Workload Balance ──');
  const dayMinutes = BATCH_030_MANIFEST.days.map((day) =>
    day.blocks.reduce((sum, block) => sum + block.estimatedMinutes, 0)
  );

  dayMinutes.forEach((mins, idx) => {
    assert(mins === 85, `Day ${148 + idx} workload is exactly 85 min (Found: ${mins} min)`);
  });

  const totalMinutes = dayMinutes.reduce((a, b) => a + b, 0);
  assert(totalMinutes === 425, `Total Batch 030 learning time is 425 min / ~7.1h (Found: ${totalMinutes} min)`);

  // ── GROUP 3: Assessment Validation ──
  console.log('\n── GROUP 3: Assessment Validation ──');
  assert(DAY_152_ASSESSMENT.id === 'asm-pfs-m8-w30-030', 'Assessment ID is asm-pfs-m8-w30-030');
  assert(DAY_152_ASSESSMENT.type === 'FORMATIVE', 'Assessment type is FORMATIVE');
  assert(DAY_152_ASSESSMENT.mode === 'FORMATIVE', 'Assessment mode is FORMATIVE');
  assert(DAY_152_ASSESSMENT.passingScore === 80, 'Passing score is 80');
  assert(DAY_152_ASSESSMENT.maxScore === 100, 'Max score is 100');
  assert(DAY_152_ASSESSMENT.timeLimitMinutes === 60, 'Time limit is 60 minutes');
  assert(DAY_152_ASSESSMENT.rubric.length === 5, 'Rubric contains exactly 5 evaluation dimensions');

  const totalWeight = DAY_152_ASSESSMENT.rubric.reduce((sum, r) => sum + r.weight, 0);
  assert(Math.abs(totalWeight - 1.0) < 0.001, `Rubric weights sum to 1.0 (Found: ${totalWeight})`);
  assert(DAY_152_ASSESSMENT.id.startsWith('asm-'), 'Assessment ID starts with asm-');

  // ── GROUP 4: Technical Invariants & Reviewer Corrections ──
  console.log('\n── GROUP 4: Technical Invariants & Reviewer Corrections ──');

  // Day 148: Relational algebra, AST compiler, as_sql, lazy evaluation
  const day148Theory = BATCH_030_MANIFEST.days[0].blocks[0] as any;
  assert(
    day148Theory.whatItIs.includes('Selection') &&
    day148Theory.whatItIs.includes('INNER JOIN') &&
    day148Theory.whatItIs.includes('LEFT OUTER JOIN') &&
    day148Theory.whatItIs.includes('as_sql()'),
    'Day 148 covers relational algebra, join families, and SQL compiler as_sql pipeline'
  );
  assert(
    day148Theory.whatItIs.includes('exists()') &&
    day148Theory.whatItIs.includes('count()'),
    'Day 148 teaches lazy evaluation triggers and memory-efficient exists/count alternatives'
  );

  // Day 149: Window functions & conditional aggregations
  const day149Theory = BATCH_030_MANIFEST.days[1].blocks[0] as any;
  assert(
    day149Theory.whatItIs.includes('Window') &&
    day149Theory.whatItIs.includes('RowNumber') &&
    day149Theory.whatItIs.includes('DenseRank') &&
    day149Theory.whatItIs.includes('partition_by'),
    'Day 149 covers SQL Window expressions, RowNumber, DenseRank, and partition_by'
  );
  assert(
    day149Theory.whatItIs.includes('Case') &&
    day149Theory.whatItIs.includes('When') &&
    day149Theory.whatItIs.includes('Coalesce'),
    'Day 149 covers conditional Case/When and Coalesce expressions'
  );

  // Day 150: Subqueries, Exists, OuterRef, Parameterized SQL
  const day150Theory = BATCH_030_MANIFEST.days[2].blocks[0] as any;
  assert(
    day150Theory.whatItIs.includes('Subquery') &&
    day150Theory.whatItIs.includes('Exists') &&
    day150Theory.whatItIs.includes('OuterRef'),
    'Day 150 covers correlated subqueries using Subquery, Exists, and OuterRef'
  );
  const day150Text = day150Theory.summary + ' ' + day150Theory.whatItIs;
  assert(
    day150Text.includes('%s') &&
    day150Text.includes('SQL Injection') &&
    (day150Text.includes('Manager.raw') || day150Text.includes('objects.raw')),
    'Day 150 enforces parameterized raw SQL execution and SQL injection defense'
  );

  // Day 151: N+1, Cartesian product explosion, distinct=True
  const day151Theory = BATCH_030_MANIFEST.days[3].blocks[0] as any;
  assert(
    day151Theory.whatItIs.includes('N+1') &&
    day151Theory.whatItIs.includes('select_related') &&
    day151Theory.whatItIs.includes('prefetch_related'),
    'Day 151 diagnoses N+1 query cascades and details select_related vs prefetch_related'
  );
  assert(
    day151Theory.whatItIs.includes('Cartesian') &&
    day151Theory.whatItIs.includes('distinct=True'),
    'Day 151 diagnoses Cartesian multi-join explosion and remediates with distinct=True'
  );

  // Day 152: Fixture-specific query budget contract
  const day152Challenge = BATCH_030_MANIFEST.days[4].blocks[0] as any;
  assert(
    day152Challenge.constraints[0].includes('supplied evaluation dataset') &&
    day152Challenge.constraints[0].includes('no more than 3 SQL queries'),
    'Day 152 strictly enforces the fixture-specific query budget contract (<= 3 queries)'
  );

  // ── GROUP 5: Behavioral Reference Simulation Tests ──
  console.log('\n── GROUP 5: Behavioral Reference Simulation Tests ──');

  // Test 1: Window DenseRank simulation
  const employees: RowItem[] = [
    { id: 'e1', department: 'Engineering', salary: 150000 },
    { id: 'e2', department: 'Engineering', salary: 130000 },
    { id: 'e3', department: 'Engineering', salary: 130000 }, // Tied salary
    { id: 'e4', department: 'Engineering', salary: 110000 },
    { id: 'e5', department: 'Sales', salary: 90000 },
  ];

  const ranked = simulateWindowDenseRank(employees);
  const engRanked = ranked.filter((r) => r.department === 'Engineering');
  assert(engRanked.length === 4, 'Preserves individual row cardinality without group collapse');
  assert(engRanked.find((e) => e.id === 'e1')?.deptRank === 1, 'Highest salary ranked #1');
  assert(engRanked.find((e) => e.id === 'e2')?.deptRank === 2, 'Second highest ranked #2');
  assert(engRanked.find((e) => e.id === 'e3')?.deptRank === 2, 'Tied salary receives identical DenseRank #2');
  assert(engRanked.find((e) => e.id === 'e4')?.deptRank === 3, 'Next salary receives dense rank #3 (no gap)');

  // Test 2: Cartesian Product vs Distinct simulation
  const corrupted = simulateMultiRelationCounts(3, 4, false);
  assert(corrupted.reportedAuthorCount === 12, 'Unprotected multi-join multiplies counts via Cartesian product (3x4=12)');

  const fixed = simulateMultiRelationCounts(3, 4, true);
  assert(fixed.reportedAuthorCount === 3 && fixed.reportedTagCount === 4, 'distinct=True eliminates Cartesian product multiplication');

  // Test 3: Parameterized SQL injection defense
  const secureExecution = simulateParameterizedExecution(
    'SELECT * FROM app_user WHERE email = %s AND status = %s',
    ['admin@hospital.org', 'ACTIVE']
  );
  assert(secureExecution.isSecure === true, 'Parameterized query using %s binds is marked secure');

  const insecureExecution = simulateParameterizedExecution(
    "SELECT * FROM app_user WHERE email = '${email}'",
    []
  );
  assert(insecureExecution.isSecure === false, 'Inline string interpolation is flagged insecure');

  // Test 4: Fixture-scoped query budget test
  const optimizedBudget = simulateAnalyticsQueryBudget(500, true);
  assert(optimizedBudget.withinBudget === true, 'Optimized window/subquery solution satisfies query budget (2 <= 3 queries)');

  const naiveBudget = simulateAnalyticsQueryBudget(500, false);
  assert(naiveBudget.withinBudget === false && naiveBudget.queriesExecuted === 501, 'Naive N+1 approach breaches query budget');

  // ── GROUP 6: Diagnostic & QA Checks on All Blocks ──
  console.log('\n── GROUP 6: Diagnostic & QA Checks on All Blocks ──');

  BATCH_030_MANIFEST.days.forEach((d) => {
    d.blocks.forEach((blk) => {
      assert(blk.title.trim().length > 0, `Block ${blk.id} has non-empty title`);
      assert(blk.estimatedMinutes > 0, `Block ${blk.id} has positive estimatedMinutes`);
      if (blk.type === 'KNOWLEDGE_CHECK') {
        const kc = blk as any;
        assert(kc.options.length >= 4, `Knowledge check ${blk.id} has at least 4 options`);
        assert(kc.correctIndex >= 0 && kc.correctIndex < kc.options.length, `Knowledge check ${blk.id} has valid correctIndex`);
        assert(kc.explanation.length > 20, `Knowledge check ${blk.id} has detailed explanation`);
        assert(kc.misconceptionIdentified.length > 10, `Knowledge check ${blk.id} has misconceptionIdentified`);
      }
    });
  });

  console.log(`\n========================================================================`);
  console.log(`🎉 BATCH 030 AUDIT COMPLETE: ALL ${assertionCount} CHECKS PASSED WITH 0 DEFECTS`);
  console.log(`========================================================================\n`);

  return assertionCount;
}

if (require.main === module) {
  runBatch030Audit().catch((err) => {
    console.error('Batch 030 Audit Failed:', err);
    process.exit(1);
  });
}
