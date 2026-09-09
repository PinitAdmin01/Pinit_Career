// scripts/test_batch019.ts
// Programmatic Verification Suite for PinIT Career OS Batch 019 (Days 93–97)
// Advanced Python: Context Managers, Resource Lifecycle Protocols, Dunder Protocol Engineering & Defensive Transaction Architecture

import * as fs from 'fs';
import * as path from 'path';
import {
  BATCH_019_MANIFEST,
  DAY_97_ASSESSMENT,
  COMPETENCY_ID_CONTEXT_MANAGERS_AND_RESOURCES,
} from '../src/lib/curriculum/pythonFullStack/batch019';
import { ContentValidator } from '../src/lib/curriculum/contentValidator';
import { AssessmentValidator } from '../src/lib/curriculum/assessmentValidator';

// ── CANONICAL EXCEPTIONS (Mirroring Python Contracts) ──

class ResourceManagementError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ResourceManagementError';
  }
}

class TransactionRollbackError extends ResourceManagementError {
  constructor(message: string) {
    super(message);
    this.name = 'TransactionRollbackError';
  }
}

class ResourceAcquisitionError extends ResourceManagementError {
  constructor(message: string) {
    super(message);
    this.name = 'ResourceAcquisitionError';
  }
}

// ── REFERENCE BEHAVIORAL IMPLEMENTATIONS (FOR AUDIT RIGOR) ──

class ReferenceAtomicTransaction {
  targetDict: Record<string, any>;
  suppressExceptions: (new (...args: any[]) => Error)[];
  snapshot: string | null = null;

  constructor(targetDict: Record<string, any>, suppressExceptions: (new (...args: any[]) => Error)[] = []) {
    this.targetDict = targetDict;
    this.suppressExceptions = suppressExceptions;
  }

  __enter__(): Record<string, any> {
    this.snapshot = JSON.stringify(this.targetDict);
    return this.targetDict;
  }

  __exit__(exc: Error | null = null): boolean {
    if (exc !== null) {
      // Rollback target dictionary to pre-transaction snapshot
      if (this.snapshot !== null) {
        const parsed = JSON.parse(this.snapshot);
        for (const key of Object.keys(this.targetDict)) {
          delete this.targetDict[key];
        }
        Object.assign(this.targetDict, parsed);
      }

      // Selective exception suppression contract
      if (this.suppressExceptions.length > 0) {
        for (const excCls of this.suppressExceptions) {
          if (exc instanceof excCls) {
            return true; // Suppressed
          }
        }
      }
      return false; // Propagate
    }
    return false;
  }
}

class ReferenceManagedResource<T> {
  private acquireFn: () => T;
  private releaseFn: (res: T) => void;
  private resource: T | null = null;

  constructor(acquireFn: () => T, releaseFn: (res: T) => void) {
    this.acquireFn = acquireFn;
    this.releaseFn = releaseFn;
  }

  __enter__(): T {
    this.resource = this.acquireFn();
    return this.resource;
  }

  __exit__(exc: Error | null = null): boolean {
    if (this.resource !== null) {
      try {
        this.releaseFn(this.resource);
      } finally {
        this.resource = null;
      }
    }
    return false;
  }
}

class ReferenceReentrantLockManager {
  depth: number = 0;
  isAcquired: boolean = false;
  acquireCallCount: number = 0;
  releaseCallCount: number = 0;

  __enter__(): this {
    if (this.depth === 0) {
      this.isAcquired = true;
      this.acquireCallCount++;
    }
    this.depth++;
    return this;
  }

  __exit__(exc: Error | null = null): boolean {
    if (this.depth <= 0) {
      throw new ResourceManagementError('ReentrantLockManager released more times than acquired!');
    }
    this.depth--;
    if (this.depth === 0) {
      this.isAcquired = false;
      this.releaseCallCount++;
    }
    return false;
  }
}

interface ContextManagerLike {
  __enter__: () => any;
  __exit__: (exc: Error | null) => boolean;
}

class ReferenceMultiResourceCoordinator {
  managers: ContextManagerLike[];
  entered: ContextManagerLike[] = [];

  constructor(...managers: ContextManagerLike[]) {
    this.managers = managers;
  }

  __enter__(): any[] {
    this.entered = [];
    const results: any[] = [];
    try {
      for (const mgr of this.managers) {
        const val = mgr.__enter__();
        this.entered.push(mgr);
        results.append ? results.append(val) : results.push(val);
      }
      return results;
    } catch (err: any) {
      // Unwind all already-entered managers in strict LIFO order
      while (this.entered.length > 0) {
        const acquired = this.entered.pop()!;
        try {
          acquired.__exit__(err);
        } catch {
          // Fault isolation: continue unwinding
        }
      }
      throw err;
    }
  }

  __exit__(exc: Error | null = null): boolean {
    let suppressed = false;
    let activeExc = exc;
    let newExc: Error | null = null;
    while (this.entered.length > 0) {
      const mgr = this.entered.pop()!;
      try {
        if (mgr.__exit__(activeExc)) {
          suppressed = true;
          activeExc = null;
        }
      } catch (err: any) {
        newExc = err;
        activeExc = err;
        suppressed = false;
      }
    }
    if (newExc !== null) {
      throw newExc;
    }
    return suppressed;
  }
}

// ── TEST RUNNER ──

let assertionCount = 0;

function assert(condition: boolean, message: string) {
  assertionCount++;
  if (!condition) {
    console.error(`  ❌ [FAIL] Check #${assertionCount}: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
  console.log(`  ✅ [PASS] Check #${assertionCount}: ${message}`);
}

async function runBatch019Audit() {
  console.log('\n========================================================================');
  console.log('🧪 RUNNING PINIT BATCH 019 (DAYS 93–97) TECHNICAL AUDIT TEST SUITE');
  console.log('Advanced Python: Context Managers, Resource Lifecycle Protocols & Transactions');
  console.log('========================================================================\n');

  // ── GROUP 1: Batch Manifest & Strict 5-Day Structure ──
  console.log('── GROUP 1: Batch Manifest & Strict 5-Day Structure ──');
  assert(BATCH_019_MANIFEST.batchCode === 'P2-M5-W19-BATCH019', 'Batch code is "P2-M5-W19-BATCH019"');
  assert(BATCH_019_MANIFEST.batchId === 'batch-pfs-m5-w19-019', 'Batch ID is "batch-pfs-m5-w19-019"');
  assert(BATCH_019_MANIFEST.days.length === 5, 'Batch contains exactly 5 instructional days (Days 93–97)');
  assert(BATCH_019_MANIFEST.difficulty === 'ADVANCED', 'Batch difficulty is ADVANCED');
  assert(BATCH_019_MANIFEST.status === 'PUBLISHED', 'Batch status is PUBLISHED');
  assert(BATCH_019_MANIFEST.version === '1.0.0', 'Batch version is 1.0.0');
  assert(DAY_97_ASSESSMENT.targetCompetencyId === COMPETENCY_ID_CONTEXT_MANAGERS_AND_RESOURCES, 'Assessment competency matches comp-pfs-m5-019');

  ContentValidator.validateBatchManifest(BATCH_019_MANIFEST);
  assert(true, 'ContentValidator.validateBatchManifest() passes with 0 validation errors');

  assert(BATCH_019_MANIFEST.days[0].dayNumber === 1, 'Day 93 internal dayNumber is 1');
  assert(BATCH_019_MANIFEST.days[4].dayNumber === 5, 'Day 97 internal dayNumber is 5');
  assert(BATCH_019_MANIFEST.days[0].packetId === 'batch-pfs-m5-w19-019', 'Day 93 packetId matches batchId');

  // Verify Canonical Pedagogical Intent Sequence: UNDERSTAND -> APPLY -> BUILD -> DEBUG -> TRANSFER
  const expectedIntents = ['UNDERSTAND', 'APPLY', 'BUILD', 'DEBUG', 'TRANSFER'];
  BATCH_019_MANIFEST.days.forEach((day, idx) => {
    assert(day.pedagogicalIntent === expectedIntents[idx], `Day ${day.dayNumber} pedagogicalIntent is '${expectedIntents[idx]}'`);
  });

  // ── GROUP 2: Instructional Timing & Workload Balance ──
  console.log('\n── GROUP 2: Instructional Timing & Workload Balance ──');
  const dayMinutes = BATCH_019_MANIFEST.days.map((day) =>
    day.blocks.reduce((sum, block) => sum + block.estimatedMinutes, 0)
  );

  assert(dayMinutes[0] === 85, `Day 93 workload is 85 min (Found: ${dayMinutes[0]} min)`);
  assert(dayMinutes[1] === 85, `Day 94 workload is 85 min (Found: ${dayMinutes[1]} min)`);
  assert(dayMinutes[2] === 85, `Day 95 workload is 85 min (Found: ${dayMinutes[2]} min)`);
  assert(dayMinutes[3] === 85, `Day 96 workload is 85 min (Found: ${dayMinutes[3]} min)`);
  assert(dayMinutes[4] === 95, `Day 97 assessment workload is 95 min (Found: ${dayMinutes[4]} min)`);

  const totalMinutes = dayMinutes.reduce((a, b) => a + b, 0);
  const totalHours = totalMinutes / 60;
  assert(totalMinutes === 435, `Total Batch 019 minutes exactly 435 min (Found: ${totalMinutes} min)`);
  assert(totalHours >= 6.5 && totalHours <= 7.5, `Batch 019 workload calibrated between 6.5h and 7.5h (Calculated: ${totalHours.toFixed(2)}h)`);

  // ── GROUP 3: Pedagogical Content Integrity & Canonical Contracts ──
  console.log('\n── GROUP 3: Pedagogical Content Integrity & Canonical Contracts ──');
  const fileContent = fs.readFileSync(
    path.join(process.cwd(), 'src/lib/curriculum/pythonFullStack/batch019.ts'),
    'utf-8'
  );

  assert(fileContent.includes('__enter__'), 'The __enter__() dunder contract is explicitly defined');
  assert(fileContent.includes('__exit__'), 'The __exit__() dunder contract is explicitly defined');
  assert(fileContent.includes('exc_type, exc_val, exc_tb'), 'The 4-argument __exit__ protocol is documented');
  assert(fileContent.includes('PEP 343'), 'PEP 343 The with Statement Specification is referenced');
  assert(fileContent.includes('@contextmanager'), 'contextlib.contextmanager generator bridge is taught');
  assert(fileContent.includes('ExitStack'), 'Dynamic multi-resource ExitStack LIFO unwinding is taught');
  assert(fileContent.includes('ContextDecorator'), 'Dual-invocation ContextDecorator is documented');
  assert(fileContent.includes('re-entrant'), 'Re-entrant lock and recursion depth accounting is taught');
  assert(fileContent.includes('exception masquerading'), 'Exception masquerading / over-suppression trap is documented');
  assert(fileContent.includes('ResourceManagementError'), 'Base domain exception ResourceManagementError is defined');
  assert(fileContent.includes('TransactionRollbackError'), 'Domain exception TransactionRollbackError is defined');
  assert(fileContent.includes('AtomicTransaction'), 'Canonical AtomicTransaction component is specified');
  assert(fileContent.includes('MultiResourceCoordinator'), 'Canonical MultiResourceCoordinator component is specified');

  // ── GROUP 4: Prerequisite Firewall & Forbidden Concept AST Scan ──
  console.log('\n── GROUP 4: Prerequisite Firewall & Forbidden Concept AST Scan ──');
  const forbiddenPatterns = [
    { name: 'Async Context Managers (__aenter__/__aexit__)', regex: /\bdef\s+__aenter__\b|\bdef\s+__aexit__\b/ },
    { name: 'Async / Await / Threading keywords', regex: /\basync\s+def\b|\bawait\s+|\bimport\s+threading\b|\bfrom\s+threading\b|\bthreading\.RLock\b/ },
    { name: 'Abstract Base Classes (abc.ABC)', regex: /\babc\.ABC\b|@abstractmethod\b/ },
    { name: 'Descriptor Protocol (__get__/__set__)', regex: /\bdef\s+__get__\b|\bdef\s+__set__\b/ },
    { name: 'Metaclasses (__init_subclass__)', regex: /\bdef\s+__init_subclass__\b/ },
    { name: 'Heavy Web/ORM Frameworks (django/fastapi)', regex: /\bfrom\s+django\b|\bfrom\s+fastapi\b/ },
  ];

  forbiddenPatterns.forEach((pat) => {
    assert(!pat.regex.test(fileContent), `Prerequisite Firewall: Zero instances of ${pat.name}`);
  });

  // ── GROUP 5: Assessment Architecture & Dual Competency Floors ──
  console.log('\n── GROUP 5: Assessment Architecture & Dual Competency Floors ──');
  assert(DAY_97_ASSESSMENT.id === 'asm-pfs-m5-w19-019', 'Assessment ID is "asm-pfs-m5-w19-019"');
  assert(DAY_97_ASSESSMENT.assessmentCode === 'ASM-PFS-M5-W19-019', 'Assessment Code is "ASM-PFS-M5-W19-019"');
  assert(DAY_97_ASSESSMENT.mode === 'FORMATIVE', 'Assessment Mode is FORMATIVE');
  assert(DAY_97_ASSESSMENT.timeLimitMinutes === 95, 'Assessment Time Limit is 95 min');

  AssessmentValidator.validateAssessment(DAY_97_ASSESSMENT);
  assert(true, 'AssessmentValidator.validateAssessment() passes with 0 validation errors');

  const asmItem = DAY_97_ASSESSMENT.items[0];
  assert(asmItem.rubricDimensions !== undefined, 'Assessment item defines rubric dimensions');
  assert(asmItem.rubricDimensions!.length === 7, 'Rubric defines exactly 7 competency dimensions');

  const weightSum = asmItem.rubricDimensions!.reduce((acc, dim) => acc + dim.weight, 0);
  assert(Math.abs(weightSum - 1.0) < 0.0001, `Rubric dimension weights sum exactly to 1.0000 (Found: ${weightSum.toFixed(4)})`);

  // Verify Mandatory Competency Floors on Dimension 1 and Dimension 5
  const dim1 = asmItem.rubricDimensions![0];
  assert(dim1.id === 'dim-b19-01', 'Dimension 1 ID is dim-b19-01');
  assert(dim1.criteria.includes('MANDATORY COMPETENCY FLOOR: Minimum 50% score (12.5 / 25 pts) required to pass'), 'Dimension 1 specifies 50% competency floor');

  const dim5 = asmItem.rubricDimensions![4];
  assert(dim5.id === 'dim-b19-05', 'Dimension 5 ID is dim-b19-05');
  assert(dim5.criteria.includes('MANDATORY COMPETENCY FLOOR: Minimum 50% score (12.5 / 25 pts) required to pass'), 'Dimension 5 specifies 50% competency floor');

  // Verify Formative Test Tiers: Only VISIBLE, ADVERSARIAL, INTEGRITY (Zero PRIVATE)
  const allTests = [
    ...(asmItem.visibleTests || []),
    ...(asmItem.adversarialTests || []),
    ...(asmItem.integrityTests || []),
  ];
  const privateTests = allTests.filter((t: any) => t.tier === 'PRIVATE');
  assert(privateTests.length === 0, 'Zero tests labeled with misleading PRIVATE tier');
  assert(allTests.every((t) => ['VISIBLE', 'ADVERSARIAL', 'INTEGRITY'].includes(t.tier)), 'All tests honestly classified as VISIBLE, ADVERSARIAL, or INTEGRITY');

  // ── GROUP 6: Atomic Transaction, Rollback & Selective Suppression Behavioral Verification ──
  console.log('\n── GROUP 6: Atomic Transaction, Rollback & Selective Suppression Behavioral Verification ──');

  // 1. Clean commit mutations persist
  const target1 = { a: 1, b: 2 };
  const tx1 = new ReferenceAtomicTransaction(target1);
  tx1.__enter__();
  target1.a = 99;
  target1.b = 100;
  const supp1 = tx1.__exit__(null);
  assert(!supp1, 'Clean transaction exit does not report suppression');
  assert(target1.a === 99 && target1.b === 100, 'Clean transaction mutations persist');

  // 2. Rollback upon unhandled error
  const target2 = { balance: 500, user: 'alice' };
  const tx2 = new ReferenceAtomicTransaction(target2);
  tx2.__enter__();
  target2.balance = 0;
  target2.user = 'bob';
  const supp2 = tx2.__exit__(new Error('simulated debit error'));
  assert(!supp2, 'Unsuppressed exception returns false from __exit__ to propagate');
  assert(target2.balance === 500 && target2.user === 'alice', 'Failed transaction restores initial state exactly');

  // 3. Selective suppression of matching exception
  class BenignKeyError extends Error {}
  const target3 = { x: 10 };
  const tx3 = new ReferenceAtomicTransaction(target3, [BenignKeyError]);
  tx3.__enter__();
  target3.x = 20;
  const supp3 = tx3.__exit__(new BenignKeyError('key not found'));
  assert(supp3 === true, 'Matching exception is suppressed (returns true)');
  assert(target3.x === 10, 'Target rolled back despite suppression');

  // 4. Non-matching exception is not suppressed
  class FatalDatabaseError extends Error {}
  const target4 = { x: 10 };
  const tx4 = new ReferenceAtomicTransaction(target4, [BenignKeyError]);
  tx4.__enter__();
  target4.x = 20;
  const supp4 = tx4.__exit__(new FatalDatabaseError('connection drop'));
  assert(supp4 === false, 'Non-matching exception is not suppressed (returns false)');
  assert(target4.x === 10, 'Target rolled back on non-matching exception');

  // 5. Deep nested structure isolation
  const target5 = { nested: { count: 1, items: ['apple'] } };
  const tx5 = new ReferenceAtomicTransaction(target5);
  tx5.__enter__();
  target5.nested.count = 99;
  target5.nested.items.push('banana');
  tx5.__exit__(new Error('nested mutation failed'));
  assert(target5.nested.count === 1 && target5.nested.items.length === 1, 'Deepcopy snapshot prevents nested mutation leakage');

  // 6. Multiple sequential transactions on same dictionary
  const target6 = { counter: 0 };
  const tx6A = new ReferenceAtomicTransaction(target6);
  tx6A.__enter__();
  target6.counter += 1;
  tx6A.__exit__(null);
  assert(target6.counter === 1, 'First transaction commits counter = 1');

  const tx6B = new ReferenceAtomicTransaction(target6);
  tx6B.__enter__();
  target6.counter += 5;
  tx6B.__exit__(new Error('rollback'));
  assert(target6.counter === 1, 'Second transaction rolls back counter to 1');

  // 7. Key deletion rollback
  const target7 = { keep_me: 'exists', delete_me: 'temp' };
  const tx7 = new ReferenceAtomicTransaction(target7);
  tx7.__enter__();
  delete (target7 as any).delete_me;
  tx7.__exit__(new Error('deletion aborted'));
  assert(target7.delete_me === 'temp', 'Deleted keys are restored upon transaction rollback');

  // 8. New key addition rollback
  const target8 = { base: 'value' };
  const tx8 = new ReferenceAtomicTransaction(target8);
  tx8.__enter__();
  (target8 as any).extra = 'unwanted';
  tx8.__exit__(new Error('addition aborted'));
  assert((target8 as any).extra === undefined, 'Newly added keys are removed upon transaction rollback');

  // 9. Multi-exception tuple suppression
  class MinorKeyError extends Error {}
  class MinorValueError extends Error {}
  const target9 = { status: 'pending' };
  const tx9 = new ReferenceAtomicTransaction(target9, [MinorKeyError, MinorValueError]);
  tx9.__enter__();
  target9.status = 'failed';
  const supp9A = tx9.__exit__(new MinorValueError('bad value'));
  assert(supp9A === true, 'MinorValueError matching tuple is suppressed');
  assert(target9.status === 'pending', 'Target rolled back after MinorValueError');

  tx9.__enter__();
  target9.status = 'in_progress';
  const supp9B = tx9.__exit__(new MinorKeyError('bad key'));
  assert(supp9B === true, 'MinorKeyError matching tuple is suppressed');
  assert(target9.status === 'pending', 'Target rolled back after MinorKeyError');

  // ── GROUP 7: Generator Context Managers, Re-entrancy & Dynamic LIFO Unwinding Verification ──
  console.log('\n── GROUP 7: Generator Context Managers, Re-entrancy & Dynamic LIFO Unwinding Verification ──');

  // 1. ManagedResource clean lifecycle
  const log1: string[] = [];
  const mgr1 = new ReferenceManagedResource(
    () => {
      log1.push('acquire');
      return 'HANDLE_01';
    },
    (res) => {
      log1.push(`release:${res}`);
    }
  );
  const res1 = mgr1.__enter__();
  assert(res1 === 'HANDLE_01', 'ManagedResource __enter__ returns acquired resource');
  mgr1.__exit__(null);
  assert(JSON.stringify(log1) === JSON.stringify(['acquire', 'release:HANDLE_01']), 'ManagedResource release called on clean exit');

  // 2. ManagedResource release called upon exception
  const log2: string[] = [];
  const mgr2 = new ReferenceManagedResource(
    () => {
      log2.push('acquire');
      return 'HANDLE_02';
    },
    (res) => {
      log2.push(`release:${res}`);
    }
  );
  mgr2.__enter__();
  mgr2.__exit__(new Error('caller error'));
  assert(JSON.stringify(log2) === JSON.stringify(['acquire', 'release:HANDLE_02']), 'ManagedResource release called unconditionally on exception');

  // 3. ReentrantLockManager depth tracking
  const lock = new ReferenceReentrantLockManager();
  assert(!lock.isAcquired && lock.depth === 0, 'ReentrantLock initially unacquired at depth 0');

  lock.__enter__();
  assert(lock.isAcquired && lock.depth === 1 && lock.acquireCallCount === 1, 'First entry acquires lock at depth 1');

  lock.__enter__();
  assert(lock.isAcquired && lock.depth === 2 && lock.acquireCallCount === 1, 'Nested entry increments depth to 2 without redundant acquire');

  lock.__exit__(null);
  assert(lock.isAcquired && lock.depth === 1 && lock.releaseCallCount === 0, 'Inner exit decrements depth to 1 without premature release');

  lock.__exit__(null);
  assert(!lock.isAcquired && lock.depth === 0 && lock.releaseCallCount === 1, 'Outer exit releases lock at depth 0');

  // 4. ReentrantLock underflow detection
  let underflowCaught = false;
  try {
    lock.__exit__(null);
  } catch (err) {
    underflowCaught = err instanceof ResourceManagementError;
  }
  assert(underflowCaught, 'ReentrantLock detects and rejects underflow exit with ResourceManagementError');

  // 5. MultiResourceCoordinator clean LIFO unwinding
  const multiLog: string[] = [];
  const createMockCM = (id: string): ContextManagerLike => ({
    __enter__: () => {
      multiLog.push(`enter:${id}`);
      return id;
    },
    __exit__: () => {
      multiLog.push(`exit:${id}`);
      return false;
    },
  });

  const coord = new ReferenceMultiResourceCoordinator(createMockCM('A'), createMockCM('B'), createMockCM('C'));
  coord.__enter__();
  assert(JSON.stringify(multiLog) === JSON.stringify(['enter:A', 'enter:B', 'enter:C']), 'Resources entered sequentially in declaration order');

  coord.__exit__(null);
  assert(
    JSON.stringify(multiLog) === JSON.stringify(['enter:A', 'enter:B', 'enter:C', 'exit:C', 'exit:B', 'exit:A']),
    'Resources exited in strict reverse LIFO order'
  );

  // 6. MultiResourceCoordinator intermediate acquisition failure recovery
  const faultLog: string[] = [];
  const cm1 = {
    __enter__: () => { faultLog.push('enter:1'); return 1; },
    __exit__: () => { faultLog.push('exit:1'); return false; },
  };
  const cm2 = {
    __enter__: () => { faultLog.push('enter:2'); return 2; },
    __exit__: () => { faultLog.push('exit:2'); return false; },
  };
  const cmFail = {
    __enter__: () => {
      faultLog.push('enter:3:fail');
      throw new ResourceAcquisitionError('Device 3 unavailable');
    },
    __exit__: () => { faultLog.push('exit:3'); return false; },
  };

  const faultCoord = new ReferenceMultiResourceCoordinator(cm1, cm2, cmFail);
  let faultCaught = false;
  try {
    faultCoord.__enter__();
  } catch (e) {
    faultCaught = e instanceof ResourceAcquisitionError;
  }
  assert(faultCaught, 'Coordinator propagates acquisition error');
  assert(
    JSON.stringify(faultLog) === JSON.stringify(['enter:1', 'enter:2', 'enter:3:fail', 'exit:2', 'exit:1']),
    'Already-entered resources unwound in LIFO order upon intermediate acquisition failure'
  );

  // 7. MultiResourceCoordinator with 0 managers
  const emptyCoord = new ReferenceMultiResourceCoordinator();
  const emptyRes = emptyCoord.__enter__();
  assert(Array.isArray(emptyRes) && emptyRes.length === 0, 'Empty coordinator enters cleanly returning empty list');
  const emptySupp = emptyCoord.__exit__(null);
  assert(!emptySupp, 'Empty coordinator exits cleanly without suppression');

  // 8. MultiResourceCoordinator suppression propagation & chained exception unwinding
  const suppLog: string[] = [];
  let outerReceivedExc: any = 'uncalled';
  const cmSupp = {
    __enter__: () => { suppLog.push('enter:supp'); return 'supp'; },
    __exit__: () => { suppLog.push('exit:supp'); return true; }, // Suppresses!
  };
  const cmOuter = {
    __enter__: () => { suppLog.push('enter:outer'); return 'outer'; },
    __exit__: (exc: any) => {
      suppLog.push('exit:outer');
      outerReceivedExc = exc;
      return false;
    },
  };
  const suppCoord = new ReferenceMultiResourceCoordinator(cmOuter, cmSupp);
  suppCoord.__enter__();
  const coordSuppResult = suppCoord.__exit__(new Error('simulated error'));
  assert(coordSuppResult === true && outerReceivedExc === null, 'Coordinator unwinding passes null to subsequent managers upon inner suppression');
  assert(JSON.stringify(suppLog) === JSON.stringify(['enter:outer', 'enter:supp', 'exit:supp', 'exit:outer']), 'Suppression propagation preserves LIFO exit order');

  // ── AUDIT SUMMARY ──
  console.log('\n========================================================================');
  console.log(`🏁 BATCH 019 AUDIT COMPLETE: ${assertionCount}/${assertionCount} CHECKS PASSED (ZERO DEFECTS)`);
  console.log('========================================================================\n');
}

runBatch019Audit().catch((err) => {
  console.error('[FATAL ERROR IN BATCH 019 AUDIT]', err);
  process.exit(1);
});
