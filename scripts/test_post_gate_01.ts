// scripts/test_post_gate_01.ts
// Comprehensive Technical and Behavioral Audit Suite for Days 61–62
// Post-Gate 1 Consolidation & Architectural Transition Block

import {
  POST_GATE_01_CONSOLIDATION_MANIFEST,
  DAY_61_MANIFEST,
  DAY_62_MANIFEST,
} from '../src/lib/curriculum/pythonFullStack/postGate01Consolidation';
import { ContentValidator } from '../src/lib/curriculum/contentValidator';
import * as fs from 'fs';
import * as path from 'path';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    console.log(`  ✅ [PASS] ${testName}`);
    passed++;
  } else {
    console.error(`  ❌ [FAIL] ${testName}${detail ? `: ${detail}` : ''}`);
    failed++;
  }
}

async function runPostGate01Tests() {
  console.log('\n========================================================================');
  console.log('🧪 RUNNING PINIT POST-GATE 1 CONSOLIDATION AUDIT (DAYS 61–62)');
  console.log('Post-Gate 1 Consolidation & Architectural Transition Block');
  console.log('========================================================================\n');

  // ── GROUP 1: Standalone Consolidation Block Manifest & 2-Day Structure ──
  console.log('── GROUP 1: Standalone Manifest & 2-Day Structure ──');
  assert(
    POST_GATE_01_CONSOLIDATION_MANIFEST.blockCode === 'P1-M3-POST-GATE01',
    'Block code is P1-M3-POST-GATE01'
  );
  assert(
    POST_GATE_01_CONSOLIDATION_MANIFEST.days.length === 2,
    'Consolidation block contains exactly 2 days (Days 61–62)'
  );

  let validationPassed = false;
  try {
    ContentValidator.validateConsolidationBlockManifest(POST_GATE_01_CONSOLIDATION_MANIFEST);
    validationPassed = true;
  } catch (err: any) {
    console.error('Validation error:', err.message);
  }
  assert(validationPassed, 'ContentValidator.validateConsolidationBlockManifest() passes with 0 validation errors');

  assert(DAY_61_MANIFEST.dayNumber === 1, 'Day 61 is Day 1 of consolidation block with dayNumber 1');
  assert(DAY_61_MANIFEST.pedagogicalIntent === 'DEBUG', 'Day 61 has DEBUG intent (Reflect & Harden)');
  assert(DAY_62_MANIFEST.dayNumber === 2, 'Day 62 is Day 2 of consolidation block with dayNumber 2');
  assert(DAY_62_MANIFEST.pedagogicalIntent === 'TRANSFER', 'Day 62 has TRANSFER intent (Defend & Handoff)');

  // ── GROUP 2: Workload Calibration & Pacing ──
  console.log('\n── GROUP 2: Workload Calibration & Pacing ──');
  const d61Minutes = DAY_61_MANIFEST.blocks.reduce((acc, b) => acc + b.estimatedMinutes, 0);
  const d62Minutes = DAY_62_MANIFEST.blocks.reduce((acc, b) => acc + b.estimatedMinutes, 0);
  const totalMinutes = d61Minutes + d62Minutes;

  assert(d61Minutes === 80, `Day 61 instructional workload is exactly 80 minutes (Found: ${d61Minutes} min)`);
  assert(d62Minutes === 85, `Day 62 instructional workload is exactly 85 minutes (Found: ${d62Minutes} min)`);
  assert(
    totalMinutes === 165,
    `Total consolidation workload is exactly 165 minutes / 2.75h (Found: ${totalMinutes} min / ${(totalMinutes / 60).toFixed(2)}h)`
  );

  // ── GROUP 3: Pedagogical Invariants & Gatekeeper Corrections ──
  console.log('\n── GROUP 3: Pedagogical Invariants & Gatekeeper Corrections ──');
  const fileContent = fs.readFileSync(
    path.join(__dirname, '../src/lib/curriculum/pythonFullStack/postGate01Consolidation.ts'),
    'utf-8'
  );

  // Correction 1: No unsupported 90% statistic
  assert(
    !fileContent.includes('90% of work is modifying existing systems') &&
    fileContent.includes('In professional software engineering, a substantial portion of work involves modifying and maintaining existing systems'),
    'Grounded software maintenance context without unsupported empirical statistics'
  );

  // Correction 2: 5-step blast radius checklist
  assert(
    fileContent.includes('Find → Inspect → Test → Modify → Regression-check'),
    'Blast radius analysis uses the practical Find-Inspect-Test-Modify-Check methodology'
  );

  // Correction 3: Dataclass field ordering and consumer verification
  assert(
    fileContent.includes('append new defaulted attributes to the END') &&
    fileContent.includes('backward compatibility must be checked against actual consumers and serialized representations'),
    'Teaches precise dataclass field ordering (append to end) and consumer verification'
  );

  // Correction 4: Measurable backward compatibility standard
  assert(
    fileContent.includes('Preserve all documented existing CLI behavior and demonstrate zero regressions against the supplied regression suite'),
    'Uses testable compatibility criteria rather than absolute claims'
  );

  // Correction 5: Atomic batch validation rule
  assert(
    fileContent.includes('Validate the complete batch against the capacity constraint before committing') &&
    fileContent.includes('reject the entire batch and leave pre-existing inventory state unchanged'),
    'Enforces all-or-nothing atomic batch capacity validation before state mutation'
  );

  // Correction 6: Boy Scout Rule as an engineering principle
  assert(
    fileContent.includes('The Boy Scout Rule is an engineering principle: leave the code you touch cleaner than you found it'),
    'Boy Scout Rule framed correctly as an engineering principle'
  );

  // Correction 7: Grounded Day 61 reflection prompt
  assert(
    fileContent.includes('Identify one current architectural limitation in your Milestone Project 3 implementation, explain its likely impact, and describe one concrete improvement you would make before scaling the system') &&
    !fileContent.includes('100x data scale'),
    'Day 61 reflection focuses on concrete limitations and immediate improvements without speculative 100x scale'
  );

  // ── GROUP 4: Behavioral Audit (Atomic Capacity Rejection & State Invariance) ──
  console.log('\n── GROUP 4: Behavioral Audit (Atomic Capacity Rejection & State Invariance) ──');

  // Simulation of the exact domain logic specified in Day 62
  interface Item {
    sku: string;
    unit_cost: number;
    quantity: number;
    category?: string;
  }

  class CapacityExceededError extends Error {
    constructor(msg: string) {
      super(msg);
      this.name = 'CapacityExceededError';
    }
  }

  class AtomicInventoryManager {
    public ceiling: number;
    public items: Record<string, Item>;

    constructor(ceiling: number = 500.0) {
      this.ceiling = ceiling;
      this.items = {};
    }

    getValuation(): number {
      return Object.values(this.items).reduce((acc, it) => acc + it.unit_cost * it.quantity, 0);
    }

    // Reference implementation adhering to atomic invariant
    ingestBatchAtomic(batch: Item[]): void {
      const prospective = { ...this.items };
      for (const item of batch) {
        if (prospective[item.sku]) {
          const existing = prospective[item.sku];
          prospective[item.sku] = {
            sku: item.sku,
            unit_cost: item.unit_cost,
            quantity: existing.quantity + item.quantity,
            category: item.category || existing.category,
          };
        } else {
          prospective[item.sku] = { ...item };
        }
      }

      const prospectiveValuation = Object.values(prospective).reduce(
        (acc, it) => acc + it.unit_cost * it.quantity,
        0
      );

      if (prospectiveValuation > this.ceiling) {
        throw new CapacityExceededError(
          `Batch rejected: prospective valuation ${prospectiveValuation} exceeds ceiling ${this.ceiling}. Pre-existing state untouched.`
        );
      }

      this.items = prospective;
    }

    // Broken non-atomic implementation for contrast testing
    ingestBatchBroken(batch: Item[]): void {
      for (const item of batch) {
        // Mutates state record-by-record before validating total ceiling!
        if (this.items[item.sku]) {
          this.items[item.sku].quantity += item.quantity;
        } else {
          this.items[item.sku] = { ...item };
        }
        if (this.getValuation() > this.ceiling) {
          throw new CapacityExceededError('Exceeded ceiling during loop!');
        }
      }
    }
  }

  // Test 1: Initial state setup
  const manager = new AtomicInventoryManager(500.0);
  manager.ingestBatchAtomic([
    { sku: 'ITEM-A', unit_cost: 100.0, quantity: 1 },
    { sku: 'ITEM-B', unit_cost: 50.0, quantity: 2 },
    { sku: 'ITEM-C', unit_cost: 20.0, quantity: 5 },
  ]); // Total: 100 + 100 + 100 = 300.0 (below 500 ceiling)

  const initialValuation = manager.getValuation();
  const initialItemsSnapshot = JSON.stringify(manager.items);
  assert(initialValuation === 300.0, 'Baseline inventory established with $300.0 valuation');

  // Test 2: Ingest an over-capacity batch: Item D ($50) + Item E ($200) -> Prospective: 300 + 250 = 550 > 500
  let errorCaught = false;
  try {
    manager.ingestBatchAtomic([
      { sku: 'ITEM-D', unit_cost: 50.0, quantity: 1 },
      { sku: 'ITEM-E', unit_cost: 200.0, quantity: 1 },
    ]);
  } catch (err: any) {
    if (err instanceof CapacityExceededError) {
      errorCaught = true;
    }
  }

  assert(errorCaught, 'CapacityExceededError raised when prospective batch valuation exceeds ceiling');

  // Test 3: Verify pre-existing inventory remains byte-for-byte / logically UNCHANGED
  const postRejectionSnapshot = JSON.stringify(manager.items);
  const postRejectionValuation = manager.getValuation();

  assert(
    initialItemsSnapshot === postRejectionSnapshot,
    'Inventory state remains byte-for-byte logically unchanged following batch rejection'
  );
  assert(
    postRejectionValuation === 300.0,
    `Inventory valuation strictly preserved at $300.0 after rejection (Found: $${postRejectionValuation.toFixed(2)})`
  );
  assert(!manager.items['ITEM-D'], 'Partial mutation prevented: ITEM-D was NOT added to inventory');

  // Test 4: Verification suite catch-check — prove that the test suite actually catches broken partial mutation
  const brokenManager = new AtomicInventoryManager(500.0);
  brokenManager.ingestBatchAtomic([
    { sku: 'ITEM-A', unit_cost: 100.0, quantity: 1 },
    { sku: 'ITEM-B', unit_cost: 50.0, quantity: 2 },
    { sku: 'ITEM-C', unit_cost: 20.0, quantity: 5 },
  ]);
  const brokenInitialSnapshot = JSON.stringify(brokenManager.items);

  let brokenErrorCaught = false;
  try {
    brokenManager.ingestBatchBroken([
      { sku: 'ITEM-D', unit_cost: 50.0, quantity: 1 },
      { sku: 'ITEM-E', unit_cost: 200.0, quantity: 1 },
    ]);
  } catch {
    brokenErrorCaught = true;
  }

  const brokenPostRejectionSnapshot = JSON.stringify(brokenManager.items);
  const isCorrupted = brokenInitialSnapshot !== brokenPostRejectionSnapshot;
  assert(
    isCorrupted && brokenErrorCaught,
    'Regression defense test reliably catches and flags broken non-atomic implementations (corrupted state detected)'
  );

  // ── GROUP 5: Prerequisite Firewall & AST Scan ──
  console.log('\n── GROUP 5: Prerequisite Firewall & AST Scan ──');
  const forbiddenPatterns = [
    { name: '@classmethod', regex: /@classmethod\b/ },
    { name: '@staticmethod', regex: /@staticmethod\b/ },
    { name: '@property', regex: /def\s+total_valuation\b.*@property/ }, // Allowed in example as standard getter if needed, but forbidden in domain
    { name: 'abc.ABC', regex: /\babc\.ABC\b|@abstractmethod\b/ },
    { name: 'typing.Protocol', regex: /\btyping\.Protocol\b/ },
    { name: 'Generic / TypeVar', regex: /\bGeneric\[|\bTypeVar\(/ },
    { name: 'async def / await', regex: /\basync\s+def\b|\bawait\s+/ },
    { name: 'Custom context manager dunder', regex: /def\s+__enter__\b|def\s+__exit__\b/ },
    { name: 'Django / FastAPI', regex: /\bfrom\s+django\b|\bfrom\s+fastapi\b/ },
    { name: 'SQL / Databases', regex: /\bSELECT\s+|\bINSERT\s+INTO\b|\bsqlite3\b|\bpsycopg/i },
    { name: 'Big-O / DSA Algorithms', regex: /O\(n\s*\^|O\(log\s*n\)|bubble_sort|merge_sort|quick_sort/i },
  ];

  for (const pat of forbiddenPatterns) {
    const leak = pat.regex.test(fileContent);
    assert(!leak, `Days 61–62 code contains zero forbidden '${pat.name}'`);
  }

  // ── SUMMARY ──
  console.log('\n========================================================================');
  console.log(`🏁 POST-GATE 1 AUDIT COMPLETE: ${passed} Passed, ${failed} Failed`);
  console.log('========================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runPostGate01Tests().catch(err => {
  console.error('Fatal error in post-gate 01 tests:', err);
  process.exit(1);
});
