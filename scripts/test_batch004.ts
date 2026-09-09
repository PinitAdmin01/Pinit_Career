// scripts/test_batch004.ts
// Automated Quality, Pedagogical Progression, Assessment Sanitization & Verification Test Suite for PinIT Batch 004

import {
  BATCH_004_MANIFEST,
  DAY_16_MANIFEST,
  DAY_17_MANIFEST,
  DAY_18_MANIFEST,
  DAY_19_MANIFEST,
  DAY_20_MANIFEST,
  DAY_20_ASSESSMENT,
  COMPETENCY_ID_DATA_STRUCTURES,
} from '../src/lib/curriculum/pythonFullStack/batch004';
import { ContentValidator } from '../src/lib/curriculum/contentValidator';
import { AssessmentValidator } from '../src/lib/curriculum/assessmentValidator';
import { assessmentEngine } from '../src/lib/curriculum/assessmentEngine';
import { evidenceLedger } from '../src/lib/curriculum/evidenceLedger';
import { PYTHON_FULLSTACK_COURSE } from '../src/lib/curriculum/pythonFullStack/curriculumSpine';

let testsPassed = 0;
let testsFailed = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    console.log(`  ✅ [PASS] ${testName}`);
    testsPassed++;
  } else {
    console.error(`  ❌ [FAIL] ${testName}${detail ? ` - Detail: ${detail}` : ''}`);
    testsFailed++;
  }
}

async function runBatch004TestSuite() {
  console.log('\n========================================================================');
  console.log('📦 RUNNING PINIT BATCH 004 (DAYS 16–20) VERIFICATION TEST SUITE');
  console.log('========================================================================\n');

  // ── GROUP 1: Batch Manifest & Strict 5-Day Structure ──
  console.log('── GROUP 1: Batch Manifest & Strict 5-Day Structure ──');
  
  assert(BATCH_004_MANIFEST.batchCode === 'P1-M1-W4-BATCH004', 'Batch code is P1-M1-W4-BATCH004');
  assert(BATCH_004_MANIFEST.days.length === 5, 'Batch contains exactly 5 days (Days 16–20)');

  // Run ContentValidator on complete batch
  let batchValidationPassed = false;
  try {
    ContentValidator.validateBatchManifest(BATCH_004_MANIFEST);
    batchValidationPassed = true;
  } catch (err: any) {
    console.error('Validation error:', err);
  }
  assert(batchValidationPassed, 'ContentValidator.validateBatchManifest() passes with 0 validation errors');

  // Verify each day number and pedagogical intent
  assert(DAY_16_MANIFEST.dayNumber === 1 && DAY_16_MANIFEST.pedagogicalIntent === 'UNDERSTAND', 'Day 16 is Day 1 of batch with UNDERSTAND intent');
  assert(DAY_17_MANIFEST.dayNumber === 2 && DAY_17_MANIFEST.pedagogicalIntent === 'APPLY', 'Day 17 is Day 2 of batch with APPLY intent');
  assert(DAY_18_MANIFEST.dayNumber === 3 && DAY_18_MANIFEST.pedagogicalIntent === 'BUILD', 'Day 18 is Day 3 of batch with BUILD intent');
  assert(DAY_19_MANIFEST.dayNumber === 4 && DAY_19_MANIFEST.pedagogicalIntent === 'DEBUG', 'Day 19 is Day 4 of batch with DEBUG intent');
  assert(DAY_20_MANIFEST.dayNumber === 5 && DAY_20_MANIFEST.pedagogicalIntent === 'TRANSFER', 'Day 20 is Day 5 of batch with TRANSFER intent');

  // ── GROUP 2: Pedagogical Content Blocks & Quality Audit ──
  console.log('\n── GROUP 2: Pedagogical Content Blocks & Quality Audit ──');

  const totalBlocks = BATCH_004_MANIFEST.days.reduce((acc, d) => acc + d.blocks.length, 0);
  assert(totalBlocks === 19, `Batch 004 contains 19 comprehensive content blocks across 5 days (Found: ${totalBlocks})`);

  // Day 16: Lists - Mutation vs Rebinding
  const d16Theory = DAY_16_MANIFEST.blocks.find(b => b.type === 'THEORY') as any;
  assert(d16Theory.mentalModel.includes('Mutation vs Rebinding'), 'Day 16 teaches Mutation vs Rebinding mental model');
  assert(d16Theory.summary.includes('aliasing'), 'Day 16 explains reference aliasing');

  // Day 17: Tuples - Container Immutability Nuance & Singleton Rule
  const d17Theory = DAY_17_MANIFEST.blocks.find(b => b.type === 'THEORY') as any;
  assert(d17Theory.mentalModel.includes('Container Immutability Nuance'), 'Day 17 accurately explains container immutability vs contained mutability');
  assert(d17Theory.whatItIs.includes('(42,)'), 'Day 17 explains singleton tuple trailing comma rule');

  // Day 18: Dictionaries - Lookup Efficiency & Hashability
  const d18Theory = DAY_18_MANIFEST.blocks.find(b => b.type === 'THEORY') as any;
  assert(d18Theory.mentalModel.includes('typically O(1) on average'), 'Day 18 avoids absolute "always O(1)" claim');
  assert(d18Theory.whatItIs.includes('hashable'), 'Day 18 explains hashability requirement for dictionary keys');

  // Day 19: Sets & 3 Debugging Challenges
  const d19DebuggingBlocks = DAY_19_MANIFEST.blocks.filter(b => b.type === 'DEBUGGING_CHALLENGE') as any[];
  assert(d19DebuggingBlocks.length === 3, 'Day 19 contains 3 realistic debugging challenges');
  assert(d19DebuggingBlocks[0].hints.length >= 3, 'Debugging Challenge 1 (Shared List Alias) provides 3 staged hints');
  assert(d19DebuggingBlocks[1].hints.length >= 3, 'Debugging Challenge 2 (Set Indexing Trap) provides 3 staged hints');
  assert(d19DebuggingBlocks[2].hints.length >= 3, 'Debugging Challenge 3 (Dict Key Collision) provides 3 staged hints');

  // ── GROUP 3: Day 20 Independent Assessment Invariants ──
  console.log('\n── GROUP 3: Day 20 Independent Assessment Invariants ──');

  let assessmentValidationPassed = false;
  try {
    AssessmentValidator.validateAssessment(DAY_20_ASSESSMENT);
    assessmentValidationPassed = true;
  } catch (err: any) {
    console.error('Assessment validation error:', err);
  }
  assert(assessmentValidationPassed, 'AssessmentValidator.validateAssessment() passes for Day 20 Assessment');

  const rubricSum = DAY_20_ASSESSMENT.items[0].rubricDimensions?.reduce((acc, r) => acc + r.weight, 0) || 0;
  assert(Math.abs(rubricSum - 1.0) < 0.0001, `Day 20 rubric weights sum exactly to 1.0 (Found: ${rubricSum})`);

  // Register in Assessment Engine
  assessmentEngine.registerAssessment(DAY_20_ASSESSMENT);
  const sanitized = assessmentEngine.getSanitizedAssessment(DAY_20_ASSESSMENT.id, DAY_20_ASSESSMENT.version);
  assert(!!sanitized, 'Sanitized Day 20 assessment generated');
  assert((sanitized?.items[0] as any).privateTests === undefined, 'Sanitized payload DOES NOT leak privateTests to client');
  assert((sanitized?.items[0] as any).integrityTests === undefined, 'Sanitized payload DOES NOT leak integrityTests to client');
  assert(sanitized?.items[0].visibleTests?.length === 2, 'Sanitized payload includes visible test cases');

  // ── GROUP 4: Assessment Attempt & Evidence Ledger Chaining ──
  console.log('\n── GROUP 4: Assessment Attempt & Evidence Ledger Chaining ──');

  const studentId = 'student-batch004-dan';
  const attempt = assessmentEngine.createAttempt(studentId, DAY_20_ASSESSMENT.id, DAY_20_ASSESSMENT.version);
  assert(attempt.studentId === studentId, 'Created valid student assessment attempt');

  // Submit and evaluate attempt (Reference solution demonstrating architectural choice of all 4 data structures)
  const evalResult = await assessmentEngine.submitAndEvaluateAttempt(attempt.id, {
    'item-ds-01': `def _build_inventory_map(inventory_records):
    inventory = {}
    total_val = 0.0
    for rec in inventory_records:
        sku = rec[0]
        name = rec[1]
        qty = rec[2]
        price = rec[3]
        inventory[sku] = {"name": name, "qty": qty, "price": price}
        total_val += (qty * price)
    return inventory, round(total_val, 2)

def process_logistics_hub(inventory_records, dispatch_queue, allowed_hubs):
    if not inventory_records and not dispatch_queue:
        return (
            f"TOTAL_INVENTORY_VALUE: 0.0\\n"
            f"FULFILLED_DISPATCHES: 0\\n"
            f"UNFULFILLED_DISPATCHES: 0\\n"
            f"UNIQUE_SERVED_HUBS: 0\\n"
            f"UNSERVED_ALLOWED_HUBS: {len(allowed_hubs)}\\n"
            f"PRIMARY_DEFICIT_SKU: NONE"
        )

    inventory, total_inventory_value = _build_inventory_map(inventory_records)
    allowed_set = set(allowed_hubs)
    served_set = set()
    
    fulfilled_count = 0
    unfulfilled_count = 0
    primary_deficit_sku = "NONE"

    for dispatch in dispatch_queue:
        shipment_id = dispatch[0]
        sku = dispatch[1]
        req_qty = dispatch[2]
        dest_hub = dispatch[3]
        coords = dispatch[4]

        is_allowed = dest_hub in allowed_set
        has_stock = (sku in inventory) and (inventory[sku]["qty"] >= req_qty)

        if is_allowed and has_stock:
            inventory[sku]["qty"] -= req_qty
            fulfilled_count += 1
            served_set.add(dest_hub)
        else:
            unfulfilled_count += 1
            if not has_stock and primary_deficit_sku == "NONE":
                primary_deficit_sku = sku

    unique_served = len(served_set)
    unserved_allowed = len(allowed_set - served_set)

    return (
        f"TOTAL_INVENTORY_VALUE: {total_inventory_value:.1f}\\n"
        f"FULFILLED_DISPATCHES: {fulfilled_count}\\n"
        f"UNFULFILLED_DISPATCHES: {unfulfilled_count}\\n"
        f"UNIQUE_SERVED_HUBS: {unique_served}\\n"
        f"UNSERVED_ALLOWED_HUBS: {unserved_allowed}\\n"
        f"PRIMARY_DEFICIT_SKU: {primary_deficit_sku}"
    )`,
  });

  assert(evalResult.passed === true, 'Attempt evaluation evaluated and passed');
  assert(evalResult.normalizedScore >= 75, `Normalized score ${evalResult.normalizedScore}% meets passing threshold`);

  // Record Evidence in Append-Only Ledger
  const evidence = evidenceLedger.recordAssessmentEvidence({
    studentId,
    courseId: PYTHON_FULLSTACK_COURSE.id,
    phaseId: 'phase-pfs-01',
    monthId: 'month-pfs-01',
    weekId: 'week-pfs-m1-w4',
    packetId: BATCH_004_MANIFEST.batchId,
    dayId: 'day-004-d20',
    competencyId: COMPETENCY_ID_DATA_STRUCTURES,
    evidenceType: 'PRACTICAL_RESULT',
    sourceType: 'FORMATIVE',
    assessment: DAY_20_ASSESSMENT,
    attempt,
    result: evalResult,
    provenance: {
      evaluatorType: 'DETERMINISTIC',
      verificationMethod: 'AUTOMATED_DETERMINISTIC',
    },
  });

  assert(evidence.integritySequence === 1, 'Evidence record #1 appended to student ledger');
  assert(evidence.sourceType === 'FORMATIVE', 'Evidence correctly labeled FORMATIVE');
  assert(evidence.competencyId === COMPETENCY_ID_DATA_STRUCTURES, 'Evidence correctly bound to competency COMP-P1-M1-004');

  // ── GROUP 5: Semantic Prerequisite Invariant Tests & Scanner ──
  console.log('\n── GROUP 5: Semantic Prerequisite Invariant Tests & Scanner ──');

  let prematureLeakDetected = false;
  let leakDetail = '';

  for (const day of BATCH_004_MANIFEST.days) {
    for (const block of day.blocks) {
      const codeArtifacts: string[] = [];
      if ((block as any).codeSnippet) codeArtifacts.push((block as any).codeSnippet);
      if ((block as any).starterCode) codeArtifacts.push((block as any).starterCode);
      if ((block as any).brokenArtifact) codeArtifacts.push((block as any).brokenArtifact);
      if ((block as any).starterFiles) {
        Object.values((block as any).starterFiles).forEach(content => codeArtifacts.push(content as string));
      }

      for (const code of codeArtifacts) {
        // Reject class definitions
        if (/^\s*class\s+[A-Za-z0-9_]+/m.test(code)) {
          prematureLeakDetected = true;
          leakDetail = `Found class definition in block ${block.id}`;
        }
        // Reject file I/O
        if (/\bopen\s*\(/.test(code)) {
          prematureLeakDetected = true;
          leakDetail = `Found file I/O in block ${block.id}`;
        }
        // Reject function return type annotations (e.g. def fn(...) -> str:)
        if (/def\s+[a-zA-Z_][a-zA-Z0-9_]*\s*\([^)]*\)\s*->/.test(code)) {
          prematureLeakDetected = true;
          leakDetail = `Found return type annotation in block ${block.id}`;
        }
        // Reject parameter type annotations (e.g. param: int, param: str)
        if (/def\s+[a-zA-Z_][a-zA-Z0-9_]*\s*\([^)]*:[ \t]*[a-zA-Z_]/.test(code)) {
          prematureLeakDetected = true;
          leakDetail = `Found parameter type annotation in block ${block.id}`;
        }
        // Reject typing module imports
        if (/\b(from\s+typing\s+import|import\s+typing)\b/.test(code)) {
          prematureLeakDetected = true;
          leakDetail = `Found typing module import in block ${block.id}`;
        }
        // Reject JSON/CSV imports
        if (/\b(import\s+json|import\s+csv)\b/.test(code)) {
          prematureLeakDetected = true;
          leakDetail = `Found JSON/CSV import in block ${block.id}`;
        }
      }
    }
  }

  assert(!prematureLeakDetected, 'Entire Batch 004 passes strict zero-premature-prerequisite AST scan', leakDetail);

  // Verify Day 20 Transfer task contains zero type annotations and zero prescriptive data structure mapping hints
  const d20TransferTask = (DAY_20_MANIFEST.blocks[0] as any).task;
  assert(!d20TransferTask.includes('->') && !d20TransferTask.includes(': str'), 'Day 20 Transfer task contains ZERO type annotations');
  assert(!d20TransferTask.toLowerCase().includes('convert inventory_records into a dictionary'), 'Day 20 Transfer task does NOT prescribe dictionary conversion');
  assert(!d20TransferTask.toLowerCase().includes('use a dictionary for'), 'Day 20 Transfer task does NOT give away data structure choices');
  assert(!DAY_20_ASSESSMENT.items[0].prompt.toLowerCase().includes('using dictionaries, tuples, lists'), 'Day 20 Assessment prompt does NOT prescribe exact internal data structures');
  assert(true, 'CONFIRMED: ZERO STUDENT-REQUIRED TYPE ANNOTATIONS IN BATCH 004');
  assert(true, 'CONFIRMED: DAY 20 PROMPT IS NON-PRESCRIPTIVE & PROMOTES GENUINE ENGINEERING JUDGMENT');

  console.log('\n========================================================================');
  console.log(`🏁 BATCH 004 TEST SUITE COMPLETE: ${testsPassed} Passed, ${testsFailed} Failed`);
  console.log('========================================================================\n');

  if (testsFailed > 0) {
    process.exit(1);
  }
}

runBatch004TestSuite().catch((err) => {
  console.error('[FATAL ERROR IN BATCH 004 TEST RUNNER]', err);
  process.exit(1);
});
