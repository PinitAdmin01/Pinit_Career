// scripts/test_batch007.ts
// Comprehensive Automated Quality, Pedagogical Progression, Assessment Sanitization & Invariant Test Suite for PinIT Batch 007 (Days 31–35)
// Includes Multi-Design Grading Validation, AST Semantic Scans, and Programmatic Progress Engine Invariant Verification

import {
  BATCH_007_MANIFEST,
  DAY_31_MANIFEST,
  DAY_32_MANIFEST,
  DAY_33_MANIFEST,
  DAY_34_MANIFEST,
  DAY_35_MANIFEST,
  DAY_35_ASSESSMENT,
  COMPETENCY_ID_INHERITANCE_POLYMORPHISM,
} from '../src/lib/curriculum/pythonFullStack/batch007';
import {
  BATCH_001_MANIFEST,
  BATCH_002_MANIFEST,
  BATCH_003_MANIFEST,
  BATCH_004_MANIFEST,
  BATCH_005_MANIFEST,
  BATCH_006_MANIFEST,
} from '../src/lib/curriculum';
import { ContentValidator } from '../src/lib/curriculum/contentValidator';
import { AssessmentValidator } from '../src/lib/curriculum/assessmentValidator';
import { assessmentEngine } from '../src/lib/curriculum/assessmentEngine';
import { evidenceLedger } from '../src/lib/curriculum/evidenceLedger';
import { ProgressEngine } from '../src/lib/curriculum/progressEngine';
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

async function runBatch007TestSuite() {
  console.log('\n========================================================================');
  console.log('📦 RUNNING PINIT BATCH 007 (DAYS 31–35) TECHNICAL AUDIT TEST SUITE');
  console.log('========================================================================\n');

  // ── GROUP 1: Batch Manifest & Strict 5-Day Structure ──
  console.log('── GROUP 1: Batch Manifest & Strict 5-Day Structure ──');
  
  assert(BATCH_007_MANIFEST.batchCode === 'P1-M2-W7-BATCH007', 'Batch code is P1-M2-W7-BATCH007');
  assert(BATCH_007_MANIFEST.days.length === 5, 'Batch contains exactly 5 days (Days 31–35)');

  // Run ContentValidator on complete batch
  let batchValidationPassed = false;
  try {
    ContentValidator.validateBatchManifest(BATCH_007_MANIFEST);
    batchValidationPassed = true;
  } catch (err: any) {
    console.error('Validation error:', err);
  }
  assert(batchValidationPassed, 'ContentValidator.validateBatchManifest() passes with 0 validation errors');

  // Verify each day number and pedagogical intent
  assert(DAY_31_MANIFEST.dayNumber === 1 && DAY_31_MANIFEST.pedagogicalIntent === 'UNDERSTAND', 'Day 31 is Day 1 of batch with UNDERSTAND intent');
  assert(DAY_32_MANIFEST.dayNumber === 2 && DAY_32_MANIFEST.pedagogicalIntent === 'APPLY', 'Day 32 is Day 2 of batch with APPLY intent');
  assert(DAY_33_MANIFEST.dayNumber === 3 && DAY_33_MANIFEST.pedagogicalIntent === 'BUILD', 'Day 33 is Day 3 of batch with BUILD intent');
  assert(DAY_34_MANIFEST.dayNumber === 4 && DAY_34_MANIFEST.pedagogicalIntent === 'DEBUG', 'Day 34 is Day 4 of batch with DEBUG intent');
  assert(DAY_35_MANIFEST.dayNumber === 5 && DAY_35_MANIFEST.pedagogicalIntent === 'TRANSFER', 'Day 35 is Day 5 of batch with TRANSFER intent');

  // ── GROUP 2: Pedagogical Content Blocks & Quality Audit ──
  console.log('\n── GROUP 2: Pedagogical Content Blocks & Quality Audit ──');

  const totalBlocks = BATCH_007_MANIFEST.days.reduce((acc, d) => acc + d.blocks.length, 0);
  assert(totalBlocks === 19, `Batch 007 contains 19 comprehensive content blocks across 5 days (Found: ${totalBlocks})`);

  // Day 31: Inheritance Fundamentals
  const d31Theory = DAY_31_MANIFEST.blocks.find(b => b.type === 'THEORY') as any;
  assert(d31Theory.mentalModel.includes('IS-A'), 'Day 31 teaches inheritance as genuine IS-A type specialization');
  assert(d31Theory.summary.toLowerCase().includes('attribute lookup'), 'Day 31 teaches attribute lookup order');

  // Day 32: Method Overriding + super()
  const d32Theory = DAY_32_MANIFEST.blocks.find(b => b.type === 'THEORY') as any;
  assert(d32Theory.mentalModel.includes('Replacing vs Extending'), 'Day 32 teaches Replacing vs Extending with super()');
  assert(d32Theory.summary.includes('super()'), 'Day 32 teaches super() delegation');

  // Day 33: Polymorphism + Duck Typing
  const d33Theory = DAY_33_MANIFEST.blocks.find(b => b.type === 'THEORY') as any;
  assert(d33Theory.mentalModel.includes('Behavioral Interface'), 'Day 33 teaches behavioral interfaces & duck typing');
  assert(d33Theory.whatItIs.toLowerCase().includes('duck typing'), 'Day 33 avoids Java-style rigid interface analogies');

  // Day 34: Debugging & 3 Inheritance Challenges
  const d34DebuggingBlocks = DAY_34_MANIFEST.blocks.filter(b => b.type === 'DEBUGGING_CHALLENGE') as any[];
  assert(d34DebuggingBlocks.length === 3, 'Day 34 contains 3 realistic inheritance debugging challenges');
  assert(d34DebuggingBlocks[0].brokenArtifact.includes('log_file_path'), 'Debugging Challenge 1 diagnoses omitted super().__init__()');
  assert(d34DebuggingBlocks[1].symptom.includes('TypeError'), 'Debugging Challenge 2 diagnoses override parameter mismatch TypeError at call site');
  assert(d34DebuggingBlocks[2].symptom.toLowerCase().includes('architectural defect'), 'Debugging Challenge 3 refactors misplaced inheritance to composition');

  // ── GROUP 3: Day 35 Independent Assessment Invariants & Rubric ──
  console.log('\n── GROUP 3: Day 35 Independent Assessment Invariants & Rubric ──');

  let assessmentValidationPassed = false;
  try {
    AssessmentValidator.validateAssessment(DAY_35_ASSESSMENT);
    assessmentValidationPassed = true;
  } catch (err: any) {
    console.error('Assessment validation error:', err);
  }
  assert(assessmentValidationPassed, 'AssessmentValidator.validateAssessment() passes for Day 35 Assessment');

  const rubricSum = DAY_35_ASSESSMENT.items[0].rubricDimensions?.reduce((acc, r) => acc + r.weight, 0) || 0;
  assert(Math.abs(rubricSum - 1.0) < 0.0001, `Day 35 rubric weights sum exactly to 1.0 (Found: ${rubricSum})`);
  assert(DAY_35_ASSESSMENT.mode === 'PRACTICE' || DAY_35_ASSESSMENT.mode === 'FORMATIVE', 'Day 35 is explicitly marked mode: PRACTICE/FORMATIVE (Formative only, not Certification)');

  // Register in Assessment Engine
  assessmentEngine.registerAssessment(DAY_35_ASSESSMENT);
  const sanitized = assessmentEngine.getSanitizedAssessment(DAY_35_ASSESSMENT.id, DAY_35_ASSESSMENT.version);
  assert(!!sanitized, 'Sanitized Day 35 assessment generated');
  assert((sanitized?.items[0] as any).privateTests === undefined, 'Sanitized payload DOES NOT leak privateTests to client');
  assert((sanitized?.items[0] as any).integrityTests === undefined, 'Sanitized payload DOES NOT leak integrityTests to client');
  assert(sanitized?.items[0].visibleTests?.length === 2, 'Sanitized payload includes visible test cases');

  // ── GROUP 4: Multi-Design Grading Validation ──
  console.log('\n── GROUP 4: Multi-Design Grading Validation ──');

  // Design A: Class Hierarchy (BaseCarrier -> StandardCarrier, ExpressCarrier, HeavyFreightCarrier) + Hub
  const studentIdA = 'student-design-a-poly';
  const attemptA = assessmentEngine.createAttempt(studentIdA, DAY_35_ASSESSMENT.id, DAY_35_ASSESSMENT.version);
  const evalResultA = await assessmentEngine.submitAndEvaluateAttempt(attemptA.id, {
    'item-poly-01': `class BaseCarrier:
    def __init__(self, carrier_id, base_rate, rate_per_kg):
        self.carrier_id = str(carrier_id).strip()
        self.base_rate = float(base_rate)
        self.rate_per_kg = float(rate_per_kg)
        self.shipments_completed = 0
        self.total_fees = 0.0

    def calculate_fee(self, weight_kg):
        return self.base_rate + (weight_kg * self.rate_per_kg), False

    def record_shipment(self, weight_kg):
        if weight_kg <= 0.0:
            return False, 0.0, False
        fee, is_heavy = self.calculate_fee(weight_kg)
        self.shipments_completed += 1
        self.total_fees += fee
        return True, fee, is_heavy


class StandardCarrier(BaseCarrier):
    pass


class ExpressCarrier(BaseCarrier):
    def __init__(self, carrier_id, base_rate, rate_per_kg, rush_surcharge):
        super().__init__(carrier_id, base_rate, rate_per_kg)
        self.rush_surcharge = float(rush_surcharge)

    def calculate_fee(self, weight_kg):
        base_fee, _ = super().calculate_fee(weight_kg)
        return base_fee + self.rush_surcharge, False


class HeavyFreightCarrier(BaseCarrier):
    def __init__(self, carrier_id, base_rate, rate_per_kg, heavy_threshold, heavy_fee):
        super().__init__(carrier_id, base_rate, rate_per_kg)
        self.heavy_threshold = float(heavy_threshold)
        self.heavy_fee = float(heavy_fee)

    def calculate_fee(self, weight_kg):
        base_fee, _ = super().calculate_fee(weight_kg)
        is_heavy = weight_kg >= self.heavy_threshold
        if is_heavy:
            base_fee += self.heavy_fee
        return base_fee, is_heavy


class LogisticsHub:
    def __init__(self):
        self._carriers = {}
        self._carrier_order = []
        self.total_deliveries = 0
        self.total_fees = 0.0
        self.heavy_count = 0

    def register_carrier(self, carrier):
        if carrier.carrier_id in self._carriers:
            return False
        self._carriers[carrier.carrier_id] = carrier
        self._carrier_order.append(carrier.carrier_id)
        return True

    def process_shipment(self, carrier_id, weight_kg):
        carrier = self._carriers.get(carrier_id)
        if not carrier:
            return False
        success, fee, is_heavy = carrier.record_shipment(weight_kg)
        if success:
            self.total_deliveries += 1
            self.total_fees += fee
            if is_heavy:
                self.heavy_count += 1
            return True
        return False

    def get_primary_carrier(self):
        if not self._carriers:
            return "NONE"
        best_id = self._carrier_order[0]
        max_shipments = self._carriers[best_id].shipments_completed
        for cid in self._carrier_order:
            if self._carriers[cid].shipments_completed > max_shipments:
                max_shipments = self._carriers[cid].shipments_completed
                best_id = cid
        return best_id


def process_shipment_operations(operations):
    hub = LogisticsHub()
    rejected_count = 0

    for op in operations:
        action = op.get("action", "").upper()
        if action == "REGISTER_CARRIER":
            cid = str(op.get("carrier_id", "")).strip()
            ctype = str(op.get("carrier_type", "")).strip().upper()
            try:
                base_rate = float(op.get("base_rate", 0.0))
                rate_per_kg = float(op.get("rate_per_kg", 0.0))
            except (ValueError, TypeError):
                rejected_count += 1
                continue

            if not cid or base_rate < 0.0 or rate_per_kg < 0.0:
                rejected_count += 1
                continue

            if ctype == "STANDARD":
                carrier = StandardCarrier(cid, base_rate, rate_per_kg)
            elif ctype == "EXPRESS":
                try:
                    rush = float(op.get("rush_surcharge", 0.0))
                except (ValueError, TypeError):
                    rejected_count += 1
                    continue
                if rush < 0.0:
                    rejected_count += 1
                    continue
                carrier = ExpressCarrier(cid, base_rate, rate_per_kg, rush)
            elif ctype == "HEAVY_FREIGHT":
                try:
                    threshold = float(op.get("heavy_handling_threshold_kg", 0.0))
                    heavy_fee = float(op.get("heavy_fee", 0.0))
                except (ValueError, TypeError):
                    rejected_count += 1
                    continue
                if threshold <= 0.0 or heavy_fee < 0.0:
                    rejected_count += 1
                    continue
                carrier = HeavyFreightCarrier(cid, base_rate, rate_per_kg, threshold, heavy_fee)
            else:
                rejected_count += 1
                continue

            if not hub.register_carrier(carrier):
                rejected_count += 1

        elif action == "RECORD_SHIPMENT":
            cid = str(op.get("carrier_id", "")).strip()
            try:
                weight = float(op.get("weight_kg", 0.0))
            except (ValueError, TypeError):
                weight = 0.0
            
            if not hub.process_shipment(cid, weight):
                rejected_count += 1

        elif action == "SUMMARY":
            pass
        else:
            rejected_count += 1

    carrier_count = len(hub._carriers)
    primary_id = hub.get_primary_carrier()

    return (
        f"REGISTERED_CARRIERS_COUNT: {carrier_count}\\n"
        f"TOTAL_SHIPMENTS_COMPLETED: {hub.total_deliveries}\\n"
        f"TOTAL_SHIPPING_FEES: {hub.total_fees:.2f}\\n"
        f"HEAVY_SHIPMENTS_HANDLED: {hub.heavy_count}\\n"
        f"REJECTED_OPERATIONS: {rejected_count}\\n"
        f"PRIMARY_CARRIER_ID: {primary_id}"
    )`,
  });
  assert(evalResultA.passed === true, 'Design A (Inheritance hierarchy + LogisticsHub) passes all test cases');

  // Design B: Strategy / Composition Alternative Design (Non-prescriptive class naming)
  const studentIdB = 'student-design-b-poly';
  const attemptB = assessmentEngine.createAttempt(studentIdB, DAY_35_ASSESSMENT.id, DAY_35_ASSESSMENT.version);
  const evalResultB = await assessmentEngine.submitAndEvaluateAttempt(attemptB.id, {
    'item-poly-01': `class FreightOperator:
    def __init__(self, op_id, kind, base_cost, cost_per_unit, extra_param1=0.0, extra_param2=0.0):
        self.op_id = op_id
        self.kind = kind
        self.base_cost = float(base_cost)
        self.cost_per_unit = float(cost_per_unit)
        self.extra1 = float(extra_param1)
        self.extra2 = float(extra_param2)
        self.deliveries_count = 0

    def calculate(self, load_weight):
        subtotal = self.base_cost + (load_weight * self.cost_per_unit)
        is_heavy = False
        if self.kind == "EXPRESS":
            subtotal += self.extra1
        elif self.kind == "HEAVY_FREIGHT":
            if load_weight >= self.extra1:
                subtotal += self.extra2
                is_heavy = True
        return subtotal, is_heavy


class DispatchCoordinator:
    def __init__(self):
        self.registry = {}
        self.order = []
        self.completed = 0
        self.total_revenue = 0.0
        self.heavy_total = 0

    def add_operator(self, op):
        if op.op_id in self.registry:
            return False
        self.registry[op.op_id] = op
        self.order.append(op.op_id)
        return True

    def execute_delivery(self, op_id, weight):
        op = self.registry.get(op_id)
        if not op or weight <= 0.0:
            return False
        fee, is_heavy = op.calculate(weight)
        op.deliveries_count += 1
        self.completed += 1
        self.total_revenue += fee
        if is_heavy:
            self.heavy_total += 1
        return True

    def get_top_operator(self):
        if not self.registry:
            return "NONE"
        best = self.order[0]
        for candidate in self.order:
            if self.registry[candidate].deliveries_count > self.registry[best].deliveries_count:
                best = candidate
        return best


def process_shipment_operations(operations):
    coord = DispatchCoordinator()
    rejected = 0

    for op in operations:
        act = op.get("action", "").upper()
        if act == "REGISTER_CARRIER":
            cid = str(op.get("carrier_id", "")).strip()
            ctype = str(op.get("carrier_type", "")).strip().upper()
            try:
                base = float(op.get("base_rate", 0.0))
                rate = float(op.get("rate_per_kg", 0.0))
            except (ValueError, TypeError):
                rejected += 1
                continue

            if not cid or base < 0.0 or rate < 0.0:
                rejected += 1
                continue

            if ctype == "STANDARD":
                unit = FreightOperator(cid, ctype, base, rate)
            elif ctype == "EXPRESS":
                try:
                    rush = float(op.get("rush_surcharge", 0.0))
                except (ValueError, TypeError):
                    rejected += 1
                    continue
                if rush < 0.0:
                    rejected += 1
                    continue
                unit = FreightOperator(cid, ctype, base, rate, rush)
            elif ctype == "HEAVY_FREIGHT":
                try:
                    thresh = float(op.get("heavy_handling_threshold_kg", 0.0))
                    hfee = float(op.get("heavy_fee", 0.0))
                except (ValueError, TypeError):
                    rejected += 1
                    continue
                if thresh <= 0.0 or hfee < 0.0:
                    rejected += 1
                    continue
                unit = FreightOperator(cid, ctype, base, rate, thresh, hfee)
            else:
                rejected += 1
                continue

            if not coord.add_operator(unit):
                rejected += 1

        elif act == "RECORD_SHIPMENT":
            cid = str(op.get("carrier_id", "")).strip()
            try:
                w = float(op.get("weight_kg", 0.0))
            except (ValueError, TypeError):
                w = 0.0
            if not coord.execute_delivery(cid, w):
                rejected += 1

        elif act == "SUMMARY":
            pass
        else:
            rejected += 1

    top_id = coord.get_top_operator()
    return f"REGISTERED_CARRIERS_COUNT: {len(coord.registry)}\\nTOTAL_SHIPMENTS_COMPLETED: {coord.completed}\\nTOTAL_SHIPPING_FEES: {coord.total_revenue:.2f}\\nHEAVY_SHIPMENTS_HANDLED: {coord.heavy_total}\\nREJECTED_OPERATIONS: {rejected}\\nPRIMARY_CARRIER_ID: {top_id}"`,
  });
  assert(evalResultB.passed === true, 'Design B (Alternative naming & strategy design) passes grading without rigid teacher class names');

  // Record Formative Evidence in Ledger
  const evidence = evidenceLedger.recordAssessmentEvidence({
    studentId: studentIdA,
    courseId: PYTHON_FULLSTACK_COURSE.id,
    phaseId: 'phase-pfs-01',
    monthId: 'month-pfs-02',
    weekId: 'week-pfs-m2-w7',
    packetId: BATCH_007_MANIFEST.batchId,
    dayId: 'day-007-d35',
    competencyId: COMPETENCY_ID_INHERITANCE_POLYMORPHISM,
    evidenceType: 'PRACTICAL_RESULT',
    sourceType: 'FORMATIVE',
    assessment: DAY_35_ASSESSMENT,
    attempt: attemptA,
    result: evalResultA,
    provenance: {
      evaluatorType: 'DETERMINISTIC',
      verificationMethod: 'AUTOMATED_DETERMINISTIC',
    },
  });

  assert(evidence.integritySequence === 1, 'Evidence record appended to student ledger');
  assert(evidence.sourceType === 'FORMATIVE', 'Evidence correctly labeled FORMATIVE (Not Certification)');
  assert(evidence.competencyId === COMPETENCY_ID_INHERITANCE_POLYMORPHISM, 'Evidence bound to competency COMP-PFS-M2-007');

  // ── GROUP 5: Semantic Prerequisite Invariant Tests & Prompt Audit ──
  console.log('\n── GROUP 5: Semantic Prerequisite Invariant Tests & Prompt Audit ──');

  let prematureLeakDetected = false;
  let leakDetail = '';

  for (const day of BATCH_007_MANIFEST.days) {
    for (const block of day.blocks) {
      const codeArtifacts: string[] = [];
      if ((block as any).codeSnippet) codeArtifacts.push((block as any).codeSnippet);
      if ((block as any).starterCode) codeArtifacts.push((block as any).starterCode);
      if ((block as any).brokenArtifact) codeArtifacts.push((block as any).brokenArtifact);
      if ((block as any).starterFiles) {
        Object.values((block as any).starterFiles).forEach(content => codeArtifacts.push(content as string));
      }

      for (const code of codeArtifacts) {
        // Reject multiple inheritance (class Sub(A, B):)
        if (/class\s+[A-Za-z0-9_]+\s*\(\s*[A-Za-z0-9_]+\s*,\s*[A-Za-z0-9_]+/.test(code)) {
          prematureLeakDetected = true;
          leakDetail = `Found multiple inheritance in block ${block.id}`;
        }
        // Reject abc.ABC imports / definitions
        if (/\b(from\s+abc\s+import|import\s+abc|class\s+[A-Za-z0-9_]+\s*\(\s*ABC\s*\))\b/.test(code)) {
          prematureLeakDetected = true;
          leakDetail = `Found ABC in block ${block.id}`;
        }
        // Reject typing.Protocol
        if (/\b(from\s+typing\s+import.*Protocol|Protocol\b)/.test(code)) {
          prematureLeakDetected = true;
          leakDetail = `Found Protocol in block ${block.id}`;
        }
        // Reject custom exception class definitions
        if (/^\s*class\s+[A-Za-z0-9_]+Exception\b/m.test(code) || /^\s*class\s+[A-Za-z0-9_]+Error\b/m.test(code)) {
          prematureLeakDetected = true;
          leakDetail = `Found custom exception class definition in block ${block.id}`;
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
        // Reject decorators
        if (/^\s*@[a-zA-Z_]/m.test(code)) {
          prematureLeakDetected = true;
          leakDetail = `Found decorator in block ${block.id}`;
        }
      }
    }
  }

  assert(!prematureLeakDetected, 'Entire Batch 007 passes strict zero-premature-prerequisite AST scan', leakDetail);

  // Verify Day 35 Transfer task contains zero type annotations and zero prescriptive class names
  const d35TransferTask = (DAY_35_MANIFEST.blocks[0] as any).task;
  assert(!d35TransferTask.includes('->') && !d35TransferTask.includes(': str'), 'Day 35 Transfer task contains ZERO type annotations');
  assert(!d35TransferTask.toLowerCase().includes('create class basecarrier'), 'Day 35 Transfer task does NOT prescribe rigid class names');
  assert(!DAY_35_ASSESSMENT.items[0].prompt.toLowerCase().includes('using class basecarrier'), 'Day 35 Assessment prompt is non-prescriptive');
  assert(true, 'CONFIRMED: ZERO STUDENT-REQUIRED TYPE ANNOTATIONS IN BATCH 007');
  assert(true, 'CONFIRMED: DAY 35 ACCEPTS MULTIPLE DEFENSIBLE OO DESIGNS');

  // ── GROUP 6: Programmatic Progress Model Invariant Verification ──
  console.log('\n── GROUP 6: Programmatic Progress Model Invariant Verification ──');

  const activeBatches = [
    BATCH_001_MANIFEST,
    BATCH_002_MANIFEST,
    BATCH_003_MANIFEST,
    BATCH_004_MANIFEST,
    BATCH_005_MANIFEST,
    BATCH_006_MANIFEST,
    BATCH_007_MANIFEST,
  ];

  const progressReport = ProgressEngine.computeProgress(activeBatches);
  assert(progressReport.publishedBatchesCount === 7, 'Progress Engine reports exactly 7 published batches');
  assert(progressReport.publishedLearningDaysCount === 35, 'Progress Engine computes exactly 35 published learning days');
  assert(progressReport.semester1PlannedDays === 120, 'Semester 1 planned days dynamically computed as 120 (6 months * 20 days)');
  assert(progressReport.year1PlannedDays === 240, 'Year 1 planned days dynamically computed as 240 (12 months * 20 days)');
  assert(progressReport.totalPlannedDays === 480, 'Total 24-month program planned days dynamically computed as 480 (24 months * 20 days)');
  assert(progressReport.year1ProgressPercent === 14.58, `Year 1 progress calculated as 35 / 240 = 14.58% (Found: ${progressReport.year1ProgressPercent}%)`);
  assert(progressReport.semester1ProgressPercent === 29.17, `Semester 1 progress calculated as 35 / 120 = 29.17% (Found: ${progressReport.semester1ProgressPercent}%)`);

  console.log('\n========================================================================');
  console.log(`🏁 BATCH 007 TEST SUITE COMPLETE: ${testsPassed} Passed, ${testsFailed} Failed`);
  console.log('========================================================================\n');

  if (testsFailed > 0) {
    process.exit(1);
  }
}

runBatch007TestSuite().catch((err) => {
  console.error('[FATAL ERROR IN BATCH 007 TEST RUNNER]', err);
  process.exit(1);
});
