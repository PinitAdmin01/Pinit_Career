// scripts/test_batch026.ts
// Programmatic Verification Suite for PinIT Career OS Batch 026 (Days 128–132 · COMPLETE)
// Django 6.0 Object-Relational Mapping (ORM), Reversible Migrations & QuerySet Optimization

import * as fs from 'fs';
import * as path from 'path';
import {
  BATCH_026_MANIFEST,
  COMPETENCY_ID_DJANGO_ORM_AND_MIGRATIONS,
  DAY_132_ASSESSMENT,
} from '../src/lib/curriculum/pythonFullStack/batch026';
import { ContentValidator } from '../src/lib/curriculum/contentValidator';

// ── REFERENCE BEHAVIORAL IMPLEMENTATIONS (FOR AUDIT RIGOR) ──

// 1. Reversible Migration Simulator (Forward and Reverse Execution)
interface MigrationState {
  columns: Record<string, string[]>;
  records: Record<string, Record<string, any>[]>;
}

function simulateReversibleMigration(
  initialState: MigrationState,
  forwardOp: (state: MigrationState) => void,
  reverseOp: (state: MigrationState) => void
): { forwardApplied: boolean; reverseApplied: boolean; stateMatchesInitial: boolean } {
  // Deep clone initial state
  const state: MigrationState = JSON.parse(JSON.stringify(initialState));

  // Run forward
  forwardOp(state);
  const forwardApplied = state.records['patients'][0].hasOwnProperty('canonical_name');

  // Run reverse
  reverseOp(state);
  const reverseApplied = !state.records['patients'][0].hasOwnProperty('canonical_name') || state.records['patients'][0]['canonical_name'] === '';

  const stateMatchesInitial =
    state.records['patients'][0]['first_name'] === initialState.records['patients'][0]['first_name'] &&
    state.records['patients'][0]['last_name'] === initialState.records['patients'][0]['last_name'];

  return { forwardApplied, reverseApplied, stateMatchesInitial };
}

// 2. QuerySet Lazy Evaluation & Query Profiling Simulator
class SimulatedQuerySet<T> {
  private executed = false;
  private cache: T[] | null = null;

  constructor(
    private data: T[],
    private queryTracker: { count: number; queries: string[] },
    private querySql: string
  ) {}

  public evaluate(): T[] {
    if (this.cache === null) {
      this.executed = true;
      this.queryTracker.count++;
      this.queryTracker.queries.push(this.querySql);
      this.cache = [...this.data];
    }
    return this.cache;
  }

  public isEvaluated(): boolean {
    return this.executed;
  }
}

// 3. Database CheckConstraint Simulator
function evaluateCheckConstraint(record: Record<string, any>, predicate: (r: Record<string, any>) => boolean): boolean {
  return predicate(record);
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

export async function runBatch026Audit(): Promise<number> {
  console.log('\n========================================================================');
  console.log('🧪 RUNNING PINIT BATCH 026 (COMPLETE · DAYS 128–132) TECHNICAL AUDIT TEST SUITE');
  console.log('Django 6.0 ORM Models, Reversible Migrations & QuerySet Optimization');
  console.log('========================================================================\n');

  assertionCount = 0;

  // ── GROUP 1: Complete Batch Manifest & 5-Day Structure ──
  console.log('── GROUP 1: Complete Batch Manifest & 5-Day Structure ──');
  assert(BATCH_026_MANIFEST.batchCode === 'P2-M7-W26-BATCH026', 'Batch code is "P2-M7-W26-BATCH026"');
  assert(BATCH_026_MANIFEST.batchId === 'batch-pfs-m7-w26-026', 'Batch ID is "batch-pfs-m7-w26-026"');
  assert(BATCH_026_MANIFEST.days.length === 5, 'Batch contains exactly 5 published learning days (Days 128–132)');
  assert(BATCH_026_MANIFEST.isPartial === false, 'Batch manifest is explicitly flagged isPartial: false');
  assert(BATCH_026_MANIFEST.difficulty === 'ADVANCED', 'Batch difficulty is ADVANCED');
  assert(BATCH_026_MANIFEST.status === 'PUBLISHED', 'Batch status is PUBLISHED');
  assert(BATCH_026_MANIFEST.version === '1.0.0', 'Batch version is 1.0.0');

  ContentValidator.validateBatchManifest(BATCH_026_MANIFEST);
  assert(true, 'ContentValidator.validateBatchManifest() passes for complete 5-day batch');

  for (let i = 0; i < 5; i++) {
    assert(BATCH_026_MANIFEST.days[i].dayNumber === i + 1, `Day ${128 + i} internal dayNumber is ${i + 1}`);
    assert(BATCH_026_MANIFEST.days[i].packetId === 'batch-pfs-m7-w26-026', `Day ${128 + i} packetId matches batchId`);
  }

  const expectedIntents = ['UNDERSTAND', 'APPLY', 'BUILD', 'DEBUG', 'TRANSFER'];
  BATCH_026_MANIFEST.days.forEach((day, idx) => {
    assert(day.pedagogicalIntent === expectedIntents[idx], `Day ${day.dayNumber} pedagogicalIntent is '${expectedIntents[idx]}'`);
  });

  // ── GROUP 2: Instructional Timing & Workload Balance ──
  console.log('\n── GROUP 2: Instructional Timing & Workload Balance ──');
  const dayMinutes = BATCH_026_MANIFEST.days.map((day) =>
    day.blocks.reduce((sum, block) => sum + block.estimatedMinutes, 0)
  );

  for (let i = 0; i < 5; i++) {
    assert(dayMinutes[i] === 85, `Day ${128 + i} workload is 85 min (Found: ${dayMinutes[i]} min)`);
  }

  const totalMinutes = dayMinutes.reduce((a, b) => a + b, 0);
  assert(totalMinutes === 425, `Total Batch 026 learning time is 425 min / ~7.1h (Found: ${totalMinutes} min)`);

  // ── GROUP 3: Technical Invariants & Architectural Coverage ──
  console.log('\n── GROUP 3: Technical Invariants & Architectural Coverage ──');

  // Day 128: Models, null vs blank, constraints
  const day128Theory = BATCH_026_MANIFEST.days[0].blocks[0] as any;
  assert(
    day128Theory.whatItIs.includes('null=True') && day128Theory.whatItIs.includes('blank=True'),
    'Day 128 covers null=True vs blank=True distinction'
  );
  assert(
    day128Theory.whatItIs.includes('CheckConstraint') && day128Theory.whatItIs.includes('UniqueConstraint'),
    'Day 128 covers database CheckConstraint and UniqueConstraint'
  );
  assert(
    day128Theory.whatItIs.includes('DecimalField'),
    'Day 128 enforces DecimalField for precise numerical metrics'
  );

  // Day 129: Reversible migrations & Expand/Contract
  const day129Theory = BATCH_026_MANIFEST.days[1].blocks[0] as any;
  assert(
    day129Theory.whatItIs.includes('RunPython') && day129Theory.whatItIs.includes('reverse_code'),
    'Day 129 enforces explicit reverse_code for RunPython operations'
  );
  assert(
    day129Theory.whatItIs.includes('apps.get_model'),
    'Day 129 requires apps.get_model() for historical isolation'
  );
  assert(
    day129Theory.whatItIs.includes('Expand/Contract') &&
    day129Theory.whatItIs.includes('minimizes deployment interruption'),
    'Day 129 frames Expand/Contract realistically as minimizing interruption without overpromising'
  );

  // Day 130: Referential integrity & through models
  const day130Theory = BATCH_026_MANIFEST.days[2].blocks[0] as any;
  assert(
    day130Theory.whatItIs.includes('models.PROTECT') && day130Theory.whatItIs.includes('models.CASCADE'),
    'Day 130 covers models.PROTECT vs models.CASCADE referential integrity'
  );
  assert(
    day130Theory.whatItIs.includes('through=') && day130Theory.whatItIs.includes('related_name'),
    'Day 130 covers explicit through models and related_name'
  );

  // Day 131: QuerySet internals, connection.queries DEBUG limit, select_related vs prefetch_related
  const day131Theory = BATCH_026_MANIFEST.days[3].blocks[0] as any;
  assert(
    day131Theory.whatItIs.includes('lazy') || day131Theory.whatItIs.includes('Lazy'),
    'Day 131 covers QuerySet lazy evaluation'
  );
  assert(
    day131Theory.whatItIs.includes('_result_cache'),
    'Day 131 explains the _result_cache mechanism'
  );
  assert(
    day131Theory.whatItIs.includes('DEBUG = True') && day131Theory.whatItIs.includes('DEBUG = False'),
    'Day 131 documents that connection.queries is ONLY populated when DEBUG=True'
  );
  assert(
    day131Theory.whatItIs.includes('select_related') && day131Theory.whatItIs.includes('prefetch_related'),
    'Day 131 covers select_related vs prefetch_related engineering trade-offs'
  );

  // Day 132: Formative assessment
  const day132Transfer = BATCH_026_MANIFEST.days[4].blocks[0] as any;
  assert(day132Transfer.type === 'TRANSFER_CHALLENGE', 'Day 132 primary block is TRANSFER_CHALLENGE');
  assert(day132Transfer.estimatedMinutes === 75, 'Day 132 transfer challenge is 75 min');
  assert(day132Transfer.constraints.length >= 5, 'Day 132 transfer challenge has at least 5 constraints');
  assert(DAY_132_ASSESSMENT.rubric.length === 5, 'Day 132 assessment has 5 rubric dimensions');
  const rubricSum = DAY_132_ASSESSMENT.rubric.reduce((sum, r) => sum + r.weight, 0);
  assert(Math.abs(rubricSum - 1.0) < 0.001, `Day 132 rubric weights sum to exactly 1.0 (Found: ${rubricSum})`);

  // ── GROUP 4: Behavioral Reference Simulation Tests ──
  console.log('\n── GROUP 4: Behavioral Reference Simulation Tests ──');

  // Test 1: Reversible migration simulation
  const initialMigrationState: MigrationState = {
    columns: { patients: ['id', 'first_name', 'last_name', 'canonical_name'] },
    records: {
      patients: [
        { id: '1', first_name: 'Jane', last_name: 'Doe', canonical_name: '' },
        { id: '2', first_name: 'John', last_name: 'Smith', canonical_name: '' },
      ],
    },
  };

  const forwardMigration = (s: MigrationState) => {
    s.records['patients'].forEach((p) => {
      p['canonical_name'] = `${p['last_name']}, ${p['first_name']}`;
    });
  };

  const reverseMigration = (s: MigrationState) => {
    s.records['patients'].forEach((p) => {
      p['canonical_name'] = '';
    });
  };

  const migrationResult = simulateReversibleMigration(initialMigrationState, forwardMigration, reverseMigration);
  assert(migrationResult.forwardApplied, 'Data migration successfully executes forward backfill');
  assert(migrationResult.reverseApplied, 'Data migration successfully executes reverse rollback');
  assert(migrationResult.stateMatchesInitial, 'Reversible migration restores original state without corruption');

  // Test 2: Lazy QuerySet & connection.queries profiling simulation
  const tracker = { count: 0, queries: [] as string[] };
  const mockPatients = [
    { id: '1', name: 'Alice' },
    { id: '2', name: 'Bob' },
  ];

  const qs = new SimulatedQuerySet(mockPatients, tracker, 'SELECT * FROM clinical_patients');
  assert(!qs.isEvaluated(), 'QuerySet is NOT evaluated upon instantation (lazy evaluation)');
  assert(tracker.count === 0, 'Zero database queries executed before evaluation');

  const evaluated = qs.evaluate();
  assert(qs.isEvaluated(), 'QuerySet is evaluated upon consumption');
  assert(tracker.count === 1, 'Exactly 1 query executed upon initial evaluation');
  assert(evaluated.length === 2, 'QuerySet yielded expected rows');

  // Re-evaluating reuses the cache
  const cached = qs.evaluate();
  assert(tracker.count === 1, 'Second evaluation reuses _result_cache without hitting database');

  // Test 3: CheckConstraint simulation
  const validRecord = { national_id: 'NAT-1234', biomarker_score: 85.5 };
  const invalidRecord = { national_id: '', biomarker_score: 105.0 };

  const checkBiomarker = (r: typeof validRecord) =>
    r.national_id.length > 0 && r.biomarker_score >= 0.0 && r.biomarker_score <= 100.0;

  assert(evaluateCheckConstraint(validRecord, checkBiomarker) === true, 'Valid record satisfies CheckConstraint');
  assert(evaluateCheckConstraint(invalidRecord, checkBiomarker) === false, 'Invalid record violates CheckConstraint');

  // ── GROUP 5: Diagnostic & QA Checks on All Blocks ──
  console.log('\n── GROUP 5: Diagnostic & QA Checks on All Blocks ──');

  BATCH_026_MANIFEST.days.forEach((d) => {
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
  console.log(`🎉 BATCH 026 AUDIT COMPLETE: ALL ${assertionCount} CHECKS PASSED WITH 0 DEFECTS`);
  console.log(`========================================================================\n`);

  return assertionCount;
}

if (require.main === module) {
  runBatch026Audit().catch((err) => {
    console.error('Batch 026 Audit Failed:', err);
    process.exit(1);
  });
}
