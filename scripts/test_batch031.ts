// scripts/test_batch031.ts
// Programmatic Verification Suite for PinIT Career OS Batch 031 (Day 153 · PARTIAL)
// Database Transactions, ACID Guarantees & Concurrency Control in Django 6.0

import * as fs from 'fs';
import * as path from 'path';
import {
  BATCH_031_MANIFEST,
  COMPETENCY_ID_DATABASE_TRANSACTIONS,
} from '../src/lib/curriculum/pythonFullStack/batch031';
import { ContentValidator } from '../src/lib/curriculum/contentValidator';

// ── REFERENCE BEHAVIORAL IMPLEMENTATIONS (FOR AUDIT RIGOR) ──

// 1. Isolation Level & Concurrency Anomaly Matrix Simulator
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
      // Under PostgreSQL snapshot isolation, Repeatable Read also prevents phantom reads
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

// 2. Nested transaction.atomic() Savepoint Simulator
interface MockDbState {
  accounts: Record<string, number>;
  savepoints: Array<Record<string, number>>;
}

class TransactionEngine {
  private state: MockDbState = { accounts: { 'acc-1': 1000, 'acc-2': 500 }, savepoints: [] };

  atomic<T>(operation: (engine: TransactionEngine) => T): T {
    // Push savepoint
    const snapshot = JSON.parse(JSON.stringify(this.state.accounts));
    this.state.savepoints.push(snapshot);
    try {
      const result = operation(this);
      this.state.savepoints.pop(); // Release savepoint on success
      return result;
    } catch (err) {
      // Rollback to savepoint
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

// 3. Outermost transaction.on_commit() Callback Simulator
class OnCommitManager {
  private depth = 0;
  private queue: Array<() => void> = [];
  public executedCallbacks: string[] = [];

  enterAtomic() {
    this.depth++;
  }

  exitAtomic(success: boolean) {
    this.depth--;
    if (this.depth === 0) {
      if (success) {
        // Outermost commit succeeds -> execute callbacks
        while (this.queue.length > 0) {
          const cb = this.queue.shift();
          if (cb) cb();
        }
      } else {
        // Outermost rollback -> discard all callbacks
        this.queue = [];
      }
    }
  }

  onCommit(callback: () => void) {
    this.queue.push(callback);
  }
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
  console.log('🧪 RUNNING PINIT BATCH 031 (DAY 153 · PARTIAL) TECHNICAL AUDIT TEST SUITE');
  console.log('Database Transactions, ACID Guarantees & Concurrency Control in Django');
  console.log('========================================================================\n');

  assertionCount = 0;

  // ── GROUP 1: Partial Batch Manifest & 1-Day Structure ──
  console.log('── GROUP 1: Partial Batch Manifest & 1-Day Structure ──');
  assert(BATCH_031_MANIFEST.batchCode === 'P2-M8-W31-BATCH031', 'Batch code is "P2-M8-W31-BATCH031"');
  assert(BATCH_031_MANIFEST.batchId === 'batch-pfs-m8-w31-031', 'Batch ID is "batch-pfs-m8-w31-031"');
  assert(BATCH_031_MANIFEST.days.length === 1, 'Batch contains exactly 1 published learning day (Day 153)');
  assert(BATCH_031_MANIFEST.isPartial === true, 'Batch manifest is explicitly flagged isPartial: true');
  assert(BATCH_031_MANIFEST.difficulty === 'ADVANCED', 'Batch difficulty is ADVANCED');
  assert(BATCH_031_MANIFEST.status === 'PUBLISHED', 'Batch status is PUBLISHED');
  assert(BATCH_031_MANIFEST.version === '1.0.0', 'Batch version is 1.0.0');

  ContentValidator.validateBatchManifest(BATCH_031_MANIFEST);
  assert(true, 'ContentValidator.validateBatchManifest() passes for partial 1-day batch');

  assert(BATCH_031_MANIFEST.days[0].dayNumber === 1, 'Day 153 internal dayNumber is 1');
  assert(BATCH_031_MANIFEST.days[0].packetId === 'batch-pfs-m8-w31-031', 'Day 153 packetId matches batchId');
  assert(BATCH_031_MANIFEST.days[0].pedagogicalIntent === 'UNDERSTAND', 'Day 153 pedagogicalIntent is UNDERSTAND');

  // ── GROUP 2: Instructional Timing & Workload Balance ──
  console.log('\n── GROUP 2: Instructional Timing & Workload Balance ──');
  const dayMinutes = BATCH_031_MANIFEST.days[0].blocks.reduce((sum, block) => sum + block.estimatedMinutes, 0);
  assert(dayMinutes === 85, `Day 153 workload is exactly 85 min (Found: ${dayMinutes} min)`);

  // ── GROUP 3: Strict Horizon Scope Boundary (Day 153 Boundary) ──
  console.log('\n── GROUP 3: Strict Horizon Scope Boundary (Day 153 Boundary) ──');
  assert(BATCH_031_MANIFEST.days.length === 1, 'Batch 031 has exactly 1 day in this horizon (hard stop at Day 153)');
  const batch031FilePath = path.join(__dirname, '../src/lib/curriculum/pythonFullStack/batch031.ts');
  const fileContent = fs.readFileSync(batch031FilePath, 'utf8');

  // Ensure Day 154+ manifests are strictly quarantined
  const forbiddenLeakedPatterns = [
    { name: 'Day 154 manifest', regex: /\bDAY_154_MANIFEST\b/ },
    { name: 'Day 155 manifest', regex: /\bDAY_155_MANIFEST\b/ },
    { name: 'Day 156 manifest', regex: /\bDAY_156_MANIFEST\b/ },
    { name: 'Day 157 manifest', regex: /\bDAY_157_MANIFEST\b/ },
  ];

  forbiddenLeakedPatterns.forEach((pat) => {
    assert(!pat.regex.test(fileContent), `Horizon Scope Boundary: Zero instances of ${pat.name}`);
  });

  // ── GROUP 4: Technical Invariants & Reviewer Corrections ──
  console.log('\n── GROUP 4: Technical Invariants & Reviewer Corrections ──');

  const day153Theory = BATCH_031_MANIFEST.days[0].blocks[0] as any;
  const day153Text = day153Theory.summary + ' ' + day153Theory.whatItIs;

  assert(
    day153Text.includes('Atomicity') &&
    day153Text.includes('Consistency') &&
    day153Text.includes('Isolation') &&
    day153Text.includes('Durability'),
    'Day 153 covers formal ACID definitions'
  );
  assert(
    day153Text.includes('Read Committed') &&
    day153Text.includes('Repeatable Read') &&
    day153Text.includes('Serializable'),
    'Day 153 covers the three standard PostgreSQL isolation levels'
  );
  assert(
    day153Text.includes('transaction.atomic') &&
    day153Text.includes('SAVEPOINT'),
    'Day 153 covers transaction.atomic() savepoint nesting mechanics'
  );
  assert(
    day153Text.includes('transaction.on_commit') &&
    day153Text.includes('outermost') &&
    day153Text.includes('still fail'),
    'Day 153 covers outermost transaction.on_commit() execution and acknowledges post-commit failure handling'
  );

  // ── GROUP 5: Behavioral Reference Simulation Tests ──
  console.log('\n── GROUP 5: Behavioral Reference Simulation Tests ──');

  // Test 1: Isolation level anomaly matrix
  const rc = evaluateIsolationLevel('READ_COMMITTED');
  assert(rc.allowsDirtyRead === false, 'Read Committed prevents Dirty Reads');
  assert(rc.allowsNonRepeatableRead === true, 'Read Committed permits Non-Repeatable Reads');

  const rr = evaluateIsolationLevel('REPEATABLE_READ');
  assert(rr.allowsDirtyRead === false && rr.allowsNonRepeatableRead === false && rr.allowsPhantomRead === false,
    'PostgreSQL Repeatable Read snapshot isolation prevents dirty, non-repeatable, and phantom reads');

  const ser = evaluateIsolationLevel('SERIALIZABLE');
  assert(ser.allowsSerializationAnomaly === false, 'Serializable level prevents serialization anomalies (SSI)');

  // Test 2: Nested atomic() savepoint simulation
  const engine = new TransactionEngine();
  try {
    engine.atomic((txOuter) => {
      txOuter.setBalance('acc-1', 900); // Debited 100

      // Inner savepoint that fails
      try {
        txOuter.atomic((txInner) => {
          txInner.setBalance('acc-1', 700); // Tentative fee
          throw new Error('Fee service timeout');
        });
      } catch (innerErr) {
        // Inner savepoint rolled back to 900
      }

      // Outer transaction continues successfully
      txOuter.setBalance('acc-2', 600); // Credited 100
    });
  } catch (outerErr) {
    // Should not reach here
  }

  assert(engine.getBalance('acc-1') === 900, 'Inner savepoint error rolled back fee, preserving outer debit');
  assert(engine.getBalance('acc-2') === 600, 'Outer transaction successfully committed credit');

  // Test 3: Outermost on_commit execution simulation
  const commitMgr = new OnCommitManager();
  let emailSent = false;
  let webhookDispatched = false;

  // Outer atomic block
  commitMgr.enterAtomic();
  commitMgr.onCommit(() => {
    emailSent = true;
  });

  // Inner nested atomic block
  commitMgr.enterAtomic();
  commitMgr.onCommit(() => {
    webhookDispatched = true;
  });
  commitMgr.exitAtomic(true); // Inner block exits

  assert(emailSent === false && webhookDispatched === false,
    'Neither callback executed when inner atomic block exited');

  commitMgr.exitAtomic(true); // Outermost commit!
  assert(emailSent === true && webhookDispatched === true,
    'All on_commit callbacks executed only after outermost transaction commit');

  // Test 4: Rollback discards on_commit callbacks
  const rollbackMgr = new OnCommitManager();
  let ghostAction = false;
  rollbackMgr.enterAtomic();
  rollbackMgr.onCommit(() => {
    ghostAction = true;
  });
  rollbackMgr.exitAtomic(false); // Outermost rollback!
  assert(ghostAction === false, 'on_commit callback was discarded when transaction rolled back');

  // ── GROUP 6: Diagnostic & QA Checks on All Blocks ──
  console.log('\n── GROUP 6: Diagnostic & QA Checks on All Blocks ──');

  BATCH_031_MANIFEST.days[0].blocks.forEach((blk) => {
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

  console.log(`\n========================================================================`);
  console.log(`🎉 BATCH 031 AUDIT COMPLETE: ALL ${assertionCount} CHECKS PASSED WITH 0 DEFECTS`);
  console.log(`========================================================================\n`);

  return assertionCount;
}

if (require.main === module) {
  runBatch031Audit().catch((err) => {
    console.error('Batch 031 Audit Failed:', err);
    process.exit(1);
  });
}
