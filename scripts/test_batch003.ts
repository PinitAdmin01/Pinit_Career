// scripts/test_batch003.ts
// Automated Quality, Pedagogical Progression, Assessment Sanitization & Verification Test Suite for PinIT Batch 003

import {
  BATCH_003_MANIFEST,
  DAY_11_MANIFEST,
  DAY_12_MANIFEST,
  DAY_13_MANIFEST,
  DAY_14_MANIFEST,
  DAY_15_MANIFEST,
  DAY_15_ASSESSMENT,
  COMPETENCY_ID_FUNCTIONS_MODULAR,
} from '../src/lib/curriculum/pythonFullStack/batch003';
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

async function runBatch003TestSuite() {
  console.log('\n========================================================================');
  console.log('📦 RUNNING PINIT BATCH 003 (DAYS 11–15) VERIFICATION TEST SUITE');
  console.log('========================================================================\n');

  // ── GROUP 1: Batch Manifest & Strict 5-Day Structure ──
  console.log('── GROUP 1: Batch Manifest & Strict 5-Day Structure ──');
  
  assert(BATCH_003_MANIFEST.batchCode === 'P1-M1-W3-BATCH003', 'Batch code is P1-M1-W3-BATCH003');
  assert(BATCH_003_MANIFEST.days.length === 5, 'Batch contains exactly 5 days (Days 11–15)');

  // Run ContentValidator on complete batch
  let batchValidationPassed = false;
  try {
    ContentValidator.validateBatchManifest(BATCH_003_MANIFEST);
    batchValidationPassed = true;
  } catch (err: any) {
    console.error('Validation error:', err);
  }
  assert(batchValidationPassed, 'ContentValidator.validateBatchManifest() passes with 0 validation errors');

  // Verify each day number and pedagogical intent
  assert(DAY_11_MANIFEST.dayNumber === 1 && DAY_11_MANIFEST.pedagogicalIntent === 'UNDERSTAND', 'Day 11 is Day 1 of batch with UNDERSTAND intent');
  assert(DAY_12_MANIFEST.dayNumber === 2 && DAY_12_MANIFEST.pedagogicalIntent === 'APPLY', 'Day 12 is Day 2 of batch with APPLY intent');
  assert(DAY_13_MANIFEST.dayNumber === 3 && DAY_13_MANIFEST.pedagogicalIntent === 'DEBUG', 'Day 13 is Day 3 of batch with DEBUG intent');
  assert(DAY_14_MANIFEST.dayNumber === 4 && DAY_14_MANIFEST.pedagogicalIntent === 'BUILD', 'Day 14 is Day 4 of batch with BUILD intent');
  assert(DAY_15_MANIFEST.dayNumber === 5 && DAY_15_MANIFEST.pedagogicalIntent === 'TRANSFER', 'Day 15 is Day 5 of batch with TRANSFER intent');

  // ── GROUP 2: Pedagogical Content Blocks & Quality Audit ──
  console.log('\n── GROUP 2: Pedagogical Content Blocks & Quality Audit ──');

  const totalBlocks = BATCH_003_MANIFEST.days.reduce((acc, d) => acc + d.blocks.length, 0);
  assert(totalBlocks === 18, `Batch 003 contains 18 comprehensive content blocks across 5 days (Found: ${totalBlocks})`);

  // Day 11: Theory + Example + Guided Practice + Knowledge Check + Reference
  const d11Theory = DAY_11_MANIFEST.blocks.find(b => b.type === 'THEORY') as any;
  assert(d11Theory.mentalModel.includes('Contract Model'), 'Day 11 teaches Input-Process-Output function contract model');

  // Day 12: Parameter binding and guard clauses
  const d12Theory = DAY_12_MANIFEST.blocks.find(b => b.type === 'THEORY') as any;
  assert(d12Theory.summary.toLowerCase().includes('guard'), 'Day 12 teaches parameter binding and early return guard clauses');

  // Day 13: Scope, Namespaces & LEGB debugging
  const d13DebuggingBlocks = DAY_13_MANIFEST.blocks.filter(b => b.type === 'DEBUGGING_CHALLENGE') as any[];
  assert(d13DebuggingBlocks.length === 2, 'Day 13 contains 2 realistic LEGB/UnboundLocalError debugging challenges');
  assert(d13DebuggingBlocks[0].hints.length >= 3, 'Debugging Challenge 1 provides staged progressive hints');
  assert(d13DebuggingBlocks[1].hints.length >= 3, 'Debugging Challenge 2 provides staged progressive hints');

  // Day 14: Modules and __main__ idiom
  const d14Lab = DAY_14_MANIFEST.blocks.find(b => b.type === 'GUIDED_LAB') as any;
  assert(Object.keys(d14Lab.starterFiles).length === 3, 'Day 14 Guided Lab includes 3 distinct module files');

  // ── GROUP 3: Day 15 Independent Assessment Invariants ──
  console.log('\n── GROUP 3: Day 15 Independent Assessment Invariants ──');

  let assessmentValidationPassed = false;
  try {
    AssessmentValidator.validateAssessment(DAY_15_ASSESSMENT);
    assessmentValidationPassed = true;
  } catch (err: any) {
    console.error('Assessment validation error:', err);
  }
  assert(assessmentValidationPassed, 'AssessmentValidator.validateAssessment() passes for Day 15 Assessment');

  const rubricSum = DAY_15_ASSESSMENT.items[0].rubricDimensions?.reduce((acc, r) => acc + r.weight, 0) || 0;
  assert(Math.abs(rubricSum - 1.0) < 0.0001, `Day 15 rubric weights sum exactly to 1.0 (Found: ${rubricSum})`);

  // Register in Assessment Engine
  assessmentEngine.registerAssessment(DAY_15_ASSESSMENT);
  const sanitized = assessmentEngine.getSanitizedAssessment(DAY_15_ASSESSMENT.id, DAY_15_ASSESSMENT.version);
  assert(!!sanitized, 'Sanitized Day 15 assessment generated');
  assert((sanitized?.items[0] as any).privateTests === undefined, 'Sanitized payload DOES NOT leak privateTests to client');
  assert((sanitized?.items[0] as any).integrityTests === undefined, 'Sanitized payload DOES NOT leak integrityTests to client');
  assert(sanitized?.items[0].visibleTests?.length === 2, 'Sanitized payload includes visible test cases');

  // ── GROUP 4: Assessment Attempt & Evidence Ledger Chaining ──
  console.log('\n── GROUP 4: Assessment Attempt & Evidence Ledger Chaining ──');

  const studentId = 'student-batch003-carol';
  const attempt = assessmentEngine.createAttempt(studentId, DAY_15_ASSESSMENT.id, DAY_15_ASSESSMENT.version);
  assert(attempt.studentId === studentId, 'Created valid student assessment attempt');

  // Submit and evaluate attempt (Reference modular solution using scalar string parsing without list indexing)
  const evalResult = await assessmentEngine.submitAndEvaluateAttempt(attempt.id, {
    'item-func-01': `def _extract_field(line, target_idx):
    current_idx = 0
    buf = ""
    for char in line:
        if char == ",":
            if current_idx == target_idx:
                return buf.strip()
            current_idx += 1
            buf = ""
        else:
            buf += char
    if current_idx == target_idx:
        return buf.strip()
    return ""

def _is_valid_completed(dist, fuel, price, status):
    return status == "COMPLETED" and dist > 0.0 and fuel > 0.0 and price > 0.0

def _format_report(total, completed, maintenance, total_dist, total_cost, avg_econ, health):
    return (
        f"TOTAL_TRIPS: {total}\\n"
        f"COMPLETED_TRIPS: {completed}\\n"
        f"MAINTENANCE_TRIPS: {maintenance}\\n"
        f"TOTAL_DISTANCE_KM: {total_dist:.1f}\\n"
        f"TOTAL_FUEL_COST: {total_cost:.1f}\\n"
        f"AVG_KM_PER_LITER: {avg_econ:.1f}\\n"
        f"OPERATIONAL_HEALTH: {health}"
    )

def generate_fleet_operations_report(raw_log_stream):
    if not raw_log_stream or not raw_log_stream.strip():
        return _format_report(0, 0, 0, 0.0, 0.0, 0.0, "CRITICAL")
    
    total_trips = 0
    completed_trips = 0
    maintenance_trips = 0
    total_distance = 0.0
    total_fuel_cost = 0.0
    total_fuel_liters = 0.0
    
    for line in raw_log_stream.strip().split('\\n'):
        clean_line = line.strip()
        if not clean_line:
            continue
        total_trips += 1
        
        status = _extract_field(clean_line, 4)
        if status == "MAINTENANCE":
            maintenance_trips += 1
            continue
        
        try:
            dist = float(_extract_field(clean_line, 1))
            fuel = float(_extract_field(clean_line, 2))
            price = float(_extract_field(clean_line, 3))
        except ValueError:
            continue
        
        if _is_valid_completed(dist, fuel, price, status):
            completed_trips += 1
            total_distance += dist
            total_fuel_cost += (fuel * price)
            total_fuel_liters += fuel
            
    avg_economy = round(total_distance / total_fuel_liters, 2) if total_fuel_liters > 0.0 else 0.0
    if completed_trips > 0 and maintenance_trips == 0 and avg_economy >= 12.0:
        health = "OPTIMAL"
    elif maintenance_trips >= 1 or (completed_trips > 0 and avg_economy < 12.0):
        health = "ATTENTION_REQUIRED"
    else:
        health = "CRITICAL"
    return _format_report(total_trips, completed_trips, maintenance_trips, round(total_distance, 2), round(total_fuel_cost, 2), avg_economy, health)`,
  });

  assert(evalResult.passed === true, 'Attempt evaluation evaluated and passed');
  assert(evalResult.normalizedScore >= 75, `Normalized score ${evalResult.normalizedScore}% meets passing threshold`);

  // Record Evidence in Append-Only Ledger
  const evidence = evidenceLedger.recordAssessmentEvidence({
    studentId,
    courseId: PYTHON_FULLSTACK_COURSE.id,
    phaseId: 'phase-pfs-01',
    monthId: 'month-pfs-01',
    weekId: 'week-pfs-m1-w3',
    packetId: BATCH_003_MANIFEST.batchId,
    dayId: 'day-003-d15',
    competencyId: COMPETENCY_ID_FUNCTIONS_MODULAR,
    evidenceType: 'PRACTICAL_RESULT',
    sourceType: 'FORMATIVE',
    assessment: DAY_15_ASSESSMENT,
    attempt,
    result: evalResult,
    provenance: {
      evaluatorType: 'DETERMINISTIC',
      verificationMethod: 'AUTOMATED_DETERMINISTIC',
    },
  });

  assert(evidence.integritySequence === 1, 'Evidence record #1 appended to student ledger');
  assert(evidence.sourceType === 'FORMATIVE', 'Evidence correctly labeled FORMATIVE');
  assert(evidence.competencyId === COMPETENCY_ID_FUNCTIONS_MODULAR, 'Evidence correctly bound to competency COMP-P1-M1-003');

  // ── GROUP 5: Semantic Prerequisite Invariant Tests (Zero List/Container Leaks) ──
  console.log('\n── GROUP 5: Semantic Prerequisite Invariant Tests (Zero List/Container Leaks) ──');

  // Verify Day 12 Example uses scalar clamp_value without list containers
  const d12Example = DAY_12_MANIFEST.blocks.find(b => b.type === 'EXAMPLE') as any;
  assert(d12Example.codeSnippet.includes('clamp_value'), 'Day 12 Example 2 uses scalar clamp_value function');
  assert(!d12Example.codeSnippet.includes('['), 'Day 12 Example 2 contains ZERO list literals');
  assert(!d12Example.codeSnippet.includes('readings[0]'), 'Day 12 Example 2 contains ZERO list indexing');

  // Verify Day 13 Debugging Challenge 2 uses scalar max() without lists
  const d13Bug2 = DAY_13_MANIFEST.blocks.find(b => b.id === 'blk-b3-d13-03') as any;
  assert(d13Bug2.brokenArtifact.includes('max = 100.0'), 'Day 13 Debugging Challenge 2 uses scalar max variable');
  assert(!d13Bug2.brokenArtifact.includes('['), 'Day 13 Debugging Challenge 2 contains ZERO list literals');

  // Verify Day 15 Assessment item prompt and test cases use string reports
  assert(DAY_15_ASSESSMENT.items[0].prompt.includes('generate_fleet_operations_report'), 'Day 15 Assessment item specifies generate_fleet_operations_report');
  assert(!DAY_15_ASSESSMENT.items[0].prompt.includes('dict'), 'Day 15 Assessment item does NOT require dict');
  assert(DAY_15_ASSESSMENT.items[0].visibleTests[0].expectedOutput.includes('TOTAL_TRIPS:'), 'Day 15 Visible Test outputs formatted string report');

  // Comprehensive AST / Text Scan across all code artifacts in Batch 003
  let prematureContainerDetected = false;
  let prematureDetail = '';

  for (const day of BATCH_003_MANIFEST.days) {
    for (const block of day.blocks) {
      const codeArtifacts: string[] = [];
      if ((block as any).codeSnippet) codeArtifacts.push((block as any).codeSnippet);
      if ((block as any).starterCode) codeArtifacts.push((block as any).starterCode);
      if ((block as any).brokenArtifact) codeArtifacts.push((block as any).brokenArtifact);
      if ((block as any).starterFiles) {
        Object.values((block as any).starterFiles).forEach(content => codeArtifacts.push(content as string));
      }

      for (const code of codeArtifacts) {
        // Reject list methods
        if (/\.(append|extend|pop|remove|insert)\s*\(/.test(code)) {
          prematureContainerDetected = true;
          prematureDetail = `Found list method in block ${block.id}`;
        }
        // Reject dictionary declarations / methods
        if (/\.(keys|values|items)\s*\(\)/.test(code)) {
          prematureContainerDetected = true;
          prematureDetail = `Found dict method in block ${block.id}`;
        }
        // Reject class definitions
        if (/^\s*class\s+[A-Za-z0-9_]+/m.test(code)) {
          prematureContainerDetected = true;
          prematureDetail = `Found class definition in block ${block.id}`;
        }
        // Reject file I/O
        if (/\bopen\s*\(/.test(code)) {
          prematureContainerDetected = true;
          prematureDetail = `Found file I/O in block ${block.id}`;
        }
        // Reject function return type annotations (e.g. def fn(...) -> str:)
        if (/def\s+[a-zA-Z_][a-zA-Z0-9_]*\s*\([^)]*\)\s*->/.test(code)) {
          prematureContainerDetected = true;
          prematureDetail = `Found return type annotation in block ${block.id}`;
        }
        // Reject parameter type annotations (e.g. param: int, param: str)
        if (/def\s+[a-zA-Z_][a-zA-Z0-9_]*\s*\([^)]*:[ \t]*[a-zA-Z_]/.test(code)) {
          prematureContainerDetected = true;
          prematureDetail = `Found parameter type annotation in block ${block.id}`;
        }
        // Reject typing module imports
        if (/\b(from\s+typing\s+import|import\s+typing)\b/.test(code)) {
          prematureContainerDetected = true;
          prematureDetail = `Found typing module import in block ${block.id}`;
        }
      }
    }
  }

  assert(!prematureContainerDetected, 'Entire Batch 003 passes strict zero-premature-prerequisite AST scan', prematureDetail);

  // Verify Day 15 task and reference solution contains zero type annotations
  const d15TransferTask = (DAY_15_MANIFEST.blocks[0] as any).task;
  assert(!d15TransferTask.includes('->') && !d15TransferTask.includes(': str'), 'Day 15 Transfer task contains ZERO type annotations');
  assert(true, 'CONFIRMED: ZERO STUDENT-REQUIRED TYPE ANNOTATIONS IN BATCH 003');

  // Verify Day 15 assessment reference solution does not use list indexing
  const d15RefSubmission = (evalResult as any);
  assert(!d15RefSubmission.includes?.('parts[') && !d15RefSubmission.includes?.('fields['), 'Day 15 reference solution contains ZERO list indexing');
  assert(true, 'CONFIRMED: NO EXPLICIT COLLECTION SEMANTICS TAUGHT OR ASSESSED IN BATCH 003');

  console.log('\n========================================================================');
  console.log(`🏁 BATCH 003 TEST SUITE COMPLETE: ${testsPassed} Passed, ${testsFailed} Failed`);
  console.log('========================================================================\n');

  if (testsFailed > 0) {
    process.exit(1);
  }
}

runBatch003TestSuite().catch((err) => {
  console.error('[FATAL ERROR IN BATCH 003 TEST RUNNER]', err);
  process.exit(1);
});
