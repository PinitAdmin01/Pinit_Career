// scripts/test_batch031.ts
// Programmatic Verification Suite for PinIT Career OS Batch 031 (Days 153–157 · COMPLETE)
// Database Transactions, Row-Level Locking, Deadlock Resolution & Concurrency Control

import * as fs from 'fs';
import * as path from 'path';
import {
  BATCH_031_MANIFEST,
  DAY_153_MANIFEST,
  DAY_154_MANIFEST,
  DAY_155_MANIFEST,
  DAY_156_MANIFEST,
  DAY_157_MANIFEST,
  DAY_157_ASSESSMENT,
  COMPETENCY_ID_DATABASE_TRANSACTIONS,
} from '../src/lib/curriculum/pythonFullStack/batch031';
import { ContentValidator } from '../src/lib/curriculum/contentValidator';

// ── REFERENCE BEHAVIORAL IMPLEMENTATIONS (FOR AUDIT RIGOR) ──

type IsolationLevel = 'READ_COMMITTED' | 'REPEATABLE_READ' | 'SERIALIZABLE';

interface AnomalyCapabilities {
  allowsDirtyRead: boolean;
  allowsNonRepeatableRead: boolean;
  allowsPhantomRead: boolean;
  allowsSerializationAnomaly: boolean;
}

function evaluateIsolationLevel(level: IsolationLevel): AnomalyCapabilities {
  switch (level) {
    case 'READ_COMMITTED':
      return {
        allowsDirtyRead: false,
        allowsNonRepeatableRead: true,
        allowsPhantomRead: true,
        allowsSerializationAnomaly: true,
      };
    case 'REPEATABLE_READ':
      return {
        allowsDirtyRead: false,
        allowsNonRepeatableRead: false,
        allowsPhantomRead: false,
        allowsSerializationAnomaly: true,
      };
    case 'SERIALIZABLE':
      return {
        allowsDirtyRead: false,
        allowsNonRepeatableRead: false,
        allowsPhantomRead: false,
        allowsSerializationAnomaly: false,
      };
  }
}

interface MockDbState {
  accounts: Record<string, number>;
  savepoints: Array<Record<string, number>>;
}

class TransactionEngine {
  private state: MockDbState = { accounts: { 'acc-1': 1000, 'acc-2': 500 }, savepoints: [] };

  atomic<T>(operation: (engine: TransactionEngine) => T): T {
    const snapshot = JSON.parse(JSON.stringify(this.state.accounts));
    this.state.savepoints.push(snapshot);
    try {
      const result = operation(this);
      this.state.savepoints.pop();
      return result;
    } catch (err) {
      const restored = this.state.savepoints.pop();
      if (restored) {
        this.state.accounts = restored;
      }
      throw err;
    }
  }

  setBalance(id: string, amount: number) {
    this.state.accounts[id] = amount;
  }

  getBalance(id: string): number {
    return this.state.accounts[id];
  }
}

class OnCommitManager {
  private depth = 0;
  private queue: Array<() => void> = [];

  enterAtomic() {
    this.depth++;
  }

  exitAtomic(success: boolean) {
    this.depth--;
    if (this.depth === 0) {
      if (success) {
        while (this.queue.length > 0) {
          const cb = this.queue.shift();
          if (cb) cb();
        }
      } else {
        this.queue = [];
      }
    }
  }

  onCommit(callback: () => void) {
    this.queue.push(callback);
  }
}

function orderResourcesForLocking(ids: number[]): number[] {
  return [...ids].sort((a, b) => a - b);
}

interface ProductRow {
  id: number;
  stock: number;
  version: number;
}

function simulateOccUpdate(
  product: ProductRow,
  expectedVersion: number,
  quantity: number
): { success: boolean; newStock: number; newVersion: number } {
  if (product.version !== expectedVersion) {
    return { success: false, newStock: product.stock, newVersion: product.version };
  }
  if (product.stock < quantity) {
    return { success: false, newStock: product.stock, newVersion: product.version };
  }
  return {
    success: true,
    newStock: product.stock - quantity,
    newVersion: product.version + 1,
  };
}

interface SeatRow {
  id: number;
  status: 'AVAILABLE' | 'RESERVED';
  reservedBy: string | null;
}

function simulateSeatReservation(
  seats: Map<number, SeatRow>,
  userId: string,
  requestedSeatIds: number[]
): { success: boolean; reservedCount: number; error?: string } {
  const sortedIds = orderResourcesForLocking(requestedSeatIds);
  for (const id of sortedIds) {
    const seat = seats.get(id);
    if (!seat || seat.status !== 'AVAILABLE') {
      return { success: false, reservedCount: 0, error: `Seat ${id} unavailable` };
    }
  }
  for (const id of sortedIds) {
    const seat = seats.get(id)!;
    seat.status = 'RESERVED';
    seat.reservedBy = userId;
  }
  return { success: true, reservedCount: sortedIds.length };
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

export async function runBatch031Audit(): Promise<number> {
  console.log('\n========================================================================');
  console.log('🧪 RUNNING PINIT BATCH 031 (DAYS 153–157 · COMPLETE) TECHNICAL AUDIT TEST SUITE');
  console.log('   Database Transactions, Row-Level Locking, Deadlocks & Concurrency Control');
  console.log('========================================================================\n');

  assertionCount = 0;

  // ── GROUP 1: Complete Batch Manifest & 5-Day Structure ──
  console.log('── GROUP 1: Complete Batch Manifest & 5-Day Structure ──');
  assert(BATCH_031_MANIFEST.batchId === 'batch-pfs-m8-w31-031', 'Batch ID matches batch-pfs-m8-w31-031');
  assert(BATCH_031_MANIFEST.batchCode === 'P2-M8-W31-BATCH031', 'Batch Code matches P2-M8-W31-BATCH031');
  assert(BATCH_031_MANIFEST.days.length === 5, 'Batch 031 contains exactly 5 instructional days (Days 153–157)');
  assert(BATCH_031_MANIFEST.isPartial === false, 'Batch 031 is marked isPartial: false (Complete batch)');
  assert(BATCH_031_MANIFEST.difficulty === 'ADVANCED', 'Difficulty level is ADVANCED');
  assert(BATCH_031_MANIFEST.status === 'PUBLISHED', 'Batch status is PUBLISHED');
  assert(BATCH_031_MANIFEST.version === '1.0.0', 'Batch version is 1.0.0');

  // ── GROUP 2: Content Validator Schema & Sequencing ──
  console.log('\n── GROUP 2: Content Validator Schema & Sequencing ──');
  let validatorPassed = true;
  try {
    ContentValidator.validateBatchManifest(BATCH_031_MANIFEST);
  } catch (err: any) {
    validatorPassed = false;
    console.error('ContentValidator error:', err.message);
  }
  assert(validatorPassed, 'ContentValidator validates BATCH_031_MANIFEST successfully');
  assert(DAY_153_MANIFEST.pedagogicalIntent === 'UNDERSTAND', 'Day 153 intent is UNDERSTAND');
  assert(DAY_154_MANIFEST.pedagogicalIntent === 'APPLY', 'Day 154 intent is APPLY');
  assert(DAY_155_MANIFEST.pedagogicalIntent === 'BUILD', 'Day 155 intent is BUILD');
  assert(DAY_156_MANIFEST.pedagogicalIntent === 'DEBUG', 'Day 156 intent is DEBUG');
  assert(DAY_157_MANIFEST.pedagogicalIntent === 'TRANSFER', 'Day 157 intent is TRANSFER');

  let totalBatchMinutes = 0;
  let allDays85Min = true;
  BATCH_031_MANIFEST.days.forEach((d) => {
    const mins = d.blocks.reduce((acc, b) => acc + b.estimatedMinutes, 0);
    totalBatchMinutes += mins;
    if (mins !== 85) allDays85Min = false;
  });
  assert(allDays85Min && totalBatchMinutes === 425, 'Batch 031 total calibrated time is exactly 425 minutes (85 min/day across all 5 days)');

  // ── GROUP 3: Formative Assessment DAY_157_ASSESSMENT ──
  console.log('\n── GROUP 3: Formative Assessment DAY_157_ASSESSMENT ──');
  assert(DAY_157_ASSESSMENT.id === 'asm-pfs-m8-w31-031', 'Assessment ID is asm-pfs-m8-w31-031');
  assert(DAY_157_ASSESSMENT.type === 'FORMATIVE', 'Assessment type is FORMATIVE');
  assert(DAY_157_ASSESSMENT.mode === 'FORMATIVE', 'Assessment mode is FORMATIVE');
  assert(DAY_157_ASSESSMENT.passingScore === 80, 'Passing score is 80');
  assert(DAY_157_ASSESSMENT.maxScore === 100, 'Max score is 100');
  assert(DAY_157_ASSESSMENT.timeLimitMinutes === 60, 'Time limit is 60 minutes');
  assert(DAY_157_ASSESSMENT.rubric.length === 5, 'Assessment rubric contains exactly 5 dimensions');

  const rubricSum = DAY_157_ASSESSMENT.rubric.reduce((acc, r) => acc + r.weight, 0);
  assert(Math.abs(rubricSum - 1.0) < 0.0001, 'Assessment rubric weights sum exactly to 1.0 (0.20 each)');
  const rubricCriteriaMet =
    DAY_157_ASSESSMENT.rubric[0].criteria.includes('Concurrency Safety') &&
    DAY_157_ASSESSMENT.rubric[1].criteria.includes('Deadlock Cycle Prevention') &&
    DAY_157_ASSESSMENT.rubric[2].criteria.includes('on_commit()') &&
    DAY_157_ASSESSMENT.rubric[3].criteria.includes('Idempotent Reservation Execution') &&
    DAY_157_ASSESSMENT.rubric[4].criteria.includes('Complete-Tx Replay');
  assert(rubricCriteriaMet, 'Rubric covers row locking, deadlock prevention, on_commit, CAS, and complete-tx replay');
  assert(DAY_157_ASSESSMENT.questions.length >= 1, 'Assessment has questions configured');

  const d157Challenge = DAY_157_MANIFEST.blocks.find((b) => b.type === 'TRANSFER_CHALLENGE') as any;
  assert(
    d157Challenge &&
      d157Challenge.constraints.some((c: string) =>
        c.includes('Zero overselling under the defined reservation transaction protocol and adversarial concurrency test fixture')
      ),
    'Day 157 capstone challenge enforces zero overselling under adversarial concurrency'
  );

  // ── GROUP 4: Technical Invariants & Reviewer Corrections ──
  console.log('\n── GROUP 4: Technical Invariants & Reviewer Corrections ──');
  const d153Theory = DAY_153_MANIFEST.blocks.find((b) => b.type === 'THEORY') as any;
  assert(
    d153Theory && d153Theory.whatItIs.includes('Atomicity') && d153Theory.whatItIs.includes('Isolation'),
    'Day 153 covers ACID guarantees and isolation level trade-offs'
  );
  assert(
    d153Theory && d153Theory.whatItIs.includes('savepoint'),
    'Day 153 teaches transaction.atomic() with savepoint nesting'
  );

  const d154Theory = DAY_154_MANIFEST.blocks.find((b) => b.type === 'THEORY') as any;
  assert(
    d154Theory &&
      d154Theory.whatItIs.includes(
        'PostgreSQL records row-lock information using tuple-level mechanisms (xmax/infomasks) while also acquiring the required table-level lock associated with the locking clause; this is not automatic lock escalation'
      ),
    'Day 154 theory includes approved exact tuple-level and table-level locking formulation'
  );
  assert(
    d154Theory && d154Theory.whatItIs.includes('FOR UPDATE') && d154Theory.whatItIs.includes('FOR NO KEY UPDATE'),
    'Day 154 theory covers FOR UPDATE and FOR NO KEY UPDATE modes'
  );
  assert(
    d154Theory && d154Theory.whatItIs.includes('FOR SHARE') && d154Theory.whatItIs.includes('FOR KEY SHARE'),
    'Day 154 theory covers FOR SHARE and FOR KEY SHARE modes'
  );
  assert(
    d154Theory && d154Theory.whatItIs.includes('nowait=True'),
    'Day 154 theory covers nowait=True immediate error semantics'
  );
  assert(
    d154Theory && d154Theory.whatItIs.includes('skip_locked=True'),
    'Day 154 theory covers skip_locked=True semantics'
  );
  assert(
    d154Theory &&
      d154Theory.whatItIs.includes(
        'produces an intentionally inconsistent/partial view of the table, specifically suited for multi-worker FIFO task consumption, not general-purpose reads'
      ),
    'Day 154 includes approved SKIP LOCKED partial/inconsistent view qualification'
  );

  const d155Theory = DAY_155_MANIFEST.blocks.find((b) => b.type === 'THEORY') as any;
  assert(
    d155Theory && d155Theory.whatItIs.includes('wait-for graph') && d155Theory.whatItIs.includes('deadlock_timeout'),
    'Day 155 theory covers relational wait-for graphs and deadlock_timeout'
  );
  assert(
    d155Theory && d155Theory.whatItIs.includes('40P01') && d155Theory.whatItIs.includes('40001'),
    'Day 155 theory covers SQLSTATE 40P01 (deadlock_detected) and 40001 (serialization_failure)'
  );
  assert(
    d155Theory && d155Theory.whatItIs.includes('explicit ROLLBACK'),
    'Day 155 theory covers explicit ROLLBACK requirement'
  );
  assert(
    d155Theory &&
      d155Theory.whatItIs.includes('Complete-Transaction Retry') &&
      d155Theory.whatItIs.includes('exponential backoff'),
    'Day 155 theory teaches complete transaction replay with exponential backoff & full jitter'
  );
  assert(
    d155Theory && d155Theory.whatItIs.includes('side effects'),
    'Day 155 includes middleware side-effect retry warning'
  );

  const d156Theory = DAY_156_MANIFEST.blocks.find((b) => b.type === 'THEORY') as any;
  assert(
    d156Theory && d156Theory.whatItIs.includes('Lost Update') && d156Theory.whatItIs.includes('version'),
    'Day 156 theory covers Lost Update anomaly and OCC integer version field'
  );
  assert(
    d156Theory &&
      d156Theory.whatItIs.includes("stock=F('stock') - quantity") &&
      d156Theory.whatItIs.includes("version=F('version') + 1"),
    'Day 156 theory demonstrates atomic F() decrement and version increment'
  );
  assert(
    d156Theory && d156Theory.whatItIs.includes('updated_rows == 0'),
    'Day 156 theory demonstrates checking zero rows affected for CAS failure'
  );

  // ── GROUP 5: Behavioral Reference Simulation Tests ──
  console.log('\n── GROUP 5: Behavioral Reference Simulation Tests ──');
  const rc = evaluateIsolationLevel('READ_COMMITTED');
  assert(rc.allowsDirtyRead === false, 'Read Committed prevents dirty reads');
  assert(rc.allowsNonRepeatableRead === true, 'Read Committed allows non-repeatable reads');
  assert(rc.allowsPhantomRead === true, 'Read Committed allows phantom reads');

  const rr = evaluateIsolationLevel('REPEATABLE_READ');
  assert(rr.allowsDirtyRead === false && rr.allowsNonRepeatableRead === false, 'Repeatable Read prevents dirty reads and non-repeatable reads');
  assert(rr.allowsPhantomRead === false, 'Repeatable Read in PostgreSQL prevents phantom reads');
  assert(rr.allowsSerializationAnomaly === true, 'Repeatable Read allows serialization anomalies');

  const sz = evaluateIsolationLevel('SERIALIZABLE');
  assert(sz.allowsSerializationAnomaly === false, 'Serializable prevents serialization anomalies');

  const engine = new TransactionEngine();
  try {
    engine.atomic((tx1) => {
      tx1.setBalance('acc-1', 900);
      try {
        tx1.atomic((tx2) => {
          tx2.setBalance('acc-1', 800);
          throw new Error('Rollback inner savepoint');
        });
      } catch (inner) {}
    });
  } catch (outer) {}
  assert(engine.getBalance('acc-1') === 900, 'Outer atomic balance modification preserved');
  assert(engine.getBalance('acc-1') !== 800, 'Inner savepoint modification rolled back cleanly');

  const commitMgr = new OnCommitManager();
  let commitFired = false;
  commitMgr.enterAtomic();
  commitMgr.onCommit(() => {
    commitFired = true;
  });
  commitMgr.exitAtomic(true);
  assert(commitFired === true, 'on_commit callback fired on successful outer commit');

  let rollbackFired = false;
  commitMgr.enterAtomic();
  commitMgr.onCommit(() => {
    rollbackFired = true;
  });
  commitMgr.exitAtomic(false);
  assert(rollbackFired === false, 'on_commit callback discarded on outer transaction rollback');

  const unsortedKeys = [42, 7, 19, 3];
  const sortedKeys = orderResourcesForLocking(unsortedKeys);
  assert(
    JSON.stringify(sortedKeys) === JSON.stringify([3, 7, 19, 42]),
    'Resource keys sorted in strictly ascending numerical order'
  );

  const initialProduct: ProductRow = { id: 101, stock: 50, version: 1 };
  const occ1 = simulateOccUpdate(initialProduct, 1, 5);
  assert(
    occ1.success === true && occ1.newStock === 45 && occ1.newVersion === 2,
    'OCC update succeeds on matching version and increments atomically'
  );

  const staleProduct: ProductRow = { id: 101, stock: 45, version: 2 };
  const occStale = simulateOccUpdate(staleProduct, 1, 5);
  assert(occStale.success === false, 'OCC update fails when expected version is stale');

  const seatMap = new Map<number, SeatRow>([
    [1, { id: 1, status: 'AVAILABLE', reservedBy: null }],
    [2, { id: 2, status: 'AVAILABLE', reservedBy: null }],
    [3, { id: 3, status: 'AVAILABLE', reservedBy: null }],
  ]);
  const buyer1 = simulateSeatReservation(seatMap, 'user-1', [1, 2]);
  assert(buyer1.success === true && buyer1.reservedCount === 2, 'Buyer 1 successfully reserves Seats 1 and 2');
  const buyer2 = simulateSeatReservation(seatMap, 'user-2', [2, 3]);
  assert(
    buyer2.success === false && seatMap.get(2)!.reservedBy === 'user-1',
    'Buyer 2 fails to reserve due to contended Seat 2 (Zero overselling)'
  );

  // ── GROUP 6: Diagnostic & QA Checks on All Blocks ──
  console.log('\n── GROUP 6: Diagnostic & QA Checks on All Blocks ──');
  BATCH_031_MANIFEST.days.forEach((d) => {
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

  console.log('\n========================================================================');
  console.log(`🎉 BATCH 031 AUDIT COMPLETE: ALL ${assertionCount} CHECKS PASSED WITH 0 DEFECTS`);
  console.log('========================================================================\n');

  return assertionCount;
}

if (require.main === module) {
  runBatch031Audit().catch((err) => {
    console.error('Batch 031 Audit Failed:', err);
    process.exit(1);
  });
}
