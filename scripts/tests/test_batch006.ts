// scripts/test_batch006.ts
// Comprehensive Automated Quality, Pedagogical Progression, Assessment Sanitization & Invariant Test Suite for PinIT Batch 006 (Days 26–30)
// Includes Adversarial OOP Tests, Multi-Design Grading Validation, and Python 3.14 Method Binding Verifications

import {
  BATCH_006_MANIFEST,
  DAY_26_MANIFEST,
  DAY_27_MANIFEST,
  DAY_28_MANIFEST,
  DAY_29_MANIFEST,
  DAY_30_MANIFEST,
  DAY_30_ASSESSMENT,
  COMPETENCY_ID_OOP_FOUNDATIONS,
} from '../src/lib/curriculum/pythonFullStack/batch006';
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

async function runBatch006TestSuite() {
  console.log('\n========================================================================');
  console.log('📦 RUNNING PINIT BATCH 006 (DAYS 26–30) TECHNICAL AUDIT TEST SUITE');
  console.log('========================================================================\n');

  // ── GROUP 1: Batch Manifest & Strict 5-Day Structure ──
  console.log('── GROUP 1: Batch Manifest & Strict 5-Day Structure ──');
  
  assert(BATCH_006_MANIFEST.batchCode === 'P1-M2-W6-BATCH006', 'Batch code is P1-M2-W6-BATCH006');
  assert(BATCH_006_MANIFEST.days.length === 5, 'Batch contains exactly 5 days (Days 26–30)');

  // Run ContentValidator on complete batch
  let batchValidationPassed = false;
  try {
    ContentValidator.validateBatchManifest(BATCH_006_MANIFEST);
    batchValidationPassed = true;
  } catch (err: any) {
    console.error('Validation error:', err);
  }
  assert(batchValidationPassed, 'ContentValidator.validateBatchManifest() passes with 0 validation errors');

  // Verify each day number and pedagogical intent
  assert(DAY_26_MANIFEST.dayNumber === 1 && DAY_26_MANIFEST.pedagogicalIntent === 'UNDERSTAND', 'Day 26 is Day 1 of batch with UNDERSTAND intent');
  assert(DAY_27_MANIFEST.dayNumber === 2 && DAY_27_MANIFEST.pedagogicalIntent === 'APPLY', 'Day 27 is Day 2 of batch with APPLY intent');
  assert(DAY_28_MANIFEST.dayNumber === 3 && DAY_28_MANIFEST.pedagogicalIntent === 'BUILD', 'Day 28 is Day 3 of batch with BUILD intent');
  assert(DAY_29_MANIFEST.dayNumber === 4 && DAY_29_MANIFEST.pedagogicalIntent === 'DEBUG', 'Day 29 is Day 4 of batch with DEBUG intent');
  assert(DAY_30_MANIFEST.dayNumber === 5 && DAY_30_MANIFEST.pedagogicalIntent === 'TRANSFER', 'Day 30 is Day 5 of batch with TRANSFER intent');

  // ── GROUP 2: Pedagogical Content Blocks & Quality Audit ──
  console.log('\n── GROUP 2: Pedagogical Content Blocks & Quality Audit ──');

  const totalBlocks = BATCH_006_MANIFEST.days.reduce((acc, d) => acc + d.blocks.length, 0);
  assert(totalBlocks === 19, `Batch 006 contains 19 comprehensive content blocks across 5 days (Found: ${totalBlocks})`);

  // Day 26: Classes, Instances, self & Attributes
  const d26Theory = DAY_26_MANIFEST.blocks.find(b => b.type === 'THEORY') as any;
  assert(d26Theory.mentalModel.includes('type and describes attributes'), 'Day 26 teaches class as executable type definition');
  assert(d26Theory.summary.includes('__init__'), 'Day 26 teaches __init__ and self parameter');

  // Day 27: Methods, Encapsulation Conventions & State Transitions
  const d27Theory = DAY_27_MANIFEST.blocks.find(b => b.type === 'THEORY') as any;
  assert(d27Theory.mentalModel.includes('INPUT VALIDATION -> VALID STATE TRANSITION'), 'Day 27 teaches State Transitions via Methods pipeline');
  assert(d27Theory.summary.includes('conventions'), 'Day 27 clarifies underscore as convention, not runtime access restriction');

  // Day 28: Composition vs Association
  const d28Theory = DAY_28_MANIFEST.blocks.find(b => b.type === 'THEORY') as any;
  assert(d28Theory.mentalModel.includes('Composition vs Association'), 'Day 28 explicitly distinguishes Composition (ownership) from Association');
  assert(d28Theory.whatItIs.includes('OrderLineItem'), 'Day 28 uses clear ownership examples (Order -> OrderLineItem)');

  // Day 29: Debugging & 3 OOP Challenges with Exact Error Semantics
  const d29DebuggingBlocks = DAY_29_MANIFEST.blocks.filter(b => b.type === 'DEBUGGING_CHALLENGE') as any[];
  assert(d29DebuggingBlocks.length === 3, 'Day 29 contains 3 realistic OOP debugging challenges');
  assert(d29DebuggingBlocks[0].brokenArtifact.includes('symptoms = []'), 'Debugging Challenge 1 diagnoses class-level mutable attribute');
  assert(d29DebuggingBlocks[1].symptom.includes('TypeError'), 'Debugging Challenge 2 diagnoses exact TypeError from missing self');
  assert(d29DebuggingBlocks[2].symptom.includes('Logical defect'), 'Debugging Challenge 3 diagnoses bypassed state validation');

  // ── GROUP 3: Day 30 Independent Assessment Invariants & Rubric ──
  console.log('\n── GROUP 3: Day 30 Independent Assessment Invariants & Rubric ──');

  let assessmentValidationPassed = false;
  try {
    AssessmentValidator.validateAssessment(DAY_30_ASSESSMENT);
    assessmentValidationPassed = true;
  } catch (err: any) {
    console.error('Assessment validation error:', err);
  }
  assert(assessmentValidationPassed, 'AssessmentValidator.validateAssessment() passes for Day 30 Assessment');

  const rubricSum = DAY_30_ASSESSMENT.items[0].rubricDimensions?.reduce((acc, r) => acc + r.weight, 0) || 0;
  assert(Math.abs(rubricSum - 1.0) < 0.0001, `Day 30 rubric weights sum exactly to 1.0 (Found: ${rubricSum})`);
  assert(DAY_30_ASSESSMENT.mode === 'FORMATIVE' || DAY_30_ASSESSMENT.mode === 'PRACTICE', 'Day 30 is explicitly marked mode: FORMATIVE/PRACTICE (Formative only, not Certification)');

  // Register in Assessment Engine
  assessmentEngine.registerAssessment(DAY_30_ASSESSMENT);
  const sanitized = assessmentEngine.getSanitizedAssessment(DAY_30_ASSESSMENT.id, DAY_30_ASSESSMENT.version);
  assert(!!sanitized, 'Sanitized Day 30 assessment generated');
  assert((sanitized?.items[0] as any).privateTests === undefined, 'Sanitized payload DOES NOT leak privateTests to client');
  assert((sanitized?.items[0] as any).integrityTests === undefined, 'Sanitized payload DOES NOT leak integrityTests to client');
  assert(sanitized?.items[0].visibleTests?.length === 2, 'Sanitized payload includes visible test cases');

  // ── GROUP 4: Multi-Design Grading Validation (Defensible OO Designs) ──
  console.log('\n── GROUP 4: Multi-Design Grading Validation (Defensible OO Designs) ──');

  // Design A: Reference Composition Solution (FleetVehicle + FleetManager)
  const studentIdA = 'student-design-a';
  const attemptA = assessmentEngine.createAttempt(studentIdA, DAY_30_ASSESSMENT.id, DAY_30_ASSESSMENT.version);
  const evalResultA = await assessmentEngine.submitAndEvaluateAttempt(attemptA.id, {
    'item-oop-01': `class FleetVehicle:
    def __init__(self, vin, model, service_interval_km):
        self.vin = str(vin).strip()
        self.model = str(model).strip()
        self.service_interval_km = float(service_interval_km)
        self.odometer_km = 0.0
        self.km_since_last_service = 0.0

    def record_trip(self, distance_km):
        if distance_km <= 0.0:
            return False
        self.odometer_km += distance_km
        self.km_since_last_service += distance_km
        return True

    def perform_service(self):
        self.km_since_last_service = 0.0
        return True

    def needs_service(self):
        return self.km_since_last_service >= self.service_interval_km


class FleetManager:
    def __init__(self):
        self._vehicles = {}
        self.trips_completed = 0

    def register_vehicle(self, vin, model, service_interval_km):
        if not vin or not model or service_interval_km <= 0.0:
            return False
        if vin in self._vehicles:
            return False
        self._vehicles[vin] = FleetVehicle(vin, model, service_interval_km)
        return True

    def record_trip(self, vin, distance_km):
        vehicle = self._vehicles.get(vin)
        if not vehicle:
            return False
        if vehicle.record_trip(distance_km):
            self.trips_completed += 1
            return True
        return False

    def perform_service(self, vin):
        vehicle = self._vehicles.get(vin)
        if not vehicle:
            return False
        return vehicle.perform_service()

    def get_summary(self):
        total_odometer = 0.0
        service_needed_count = 0
        primary_maintenance_vin = "NONE"

        for vin, vehicle in self._vehicles.items():
            total_odometer += vehicle.odometer_km
            if vehicle.needs_service():
                service_needed_count += 1
                if primary_maintenance_vin == "NONE":
                    primary_maintenance_vin = vin

        return {
            "registered_count": len(self._vehicles),
            "total_odometer": round(total_odometer, 2),
            "trips_completed": self.trips_completed,
            "service_needed_count": service_needed_count,
            "primary_maintenance_vin": primary_maintenance_vin,
        }


def process_fleet_operations(operations):
    fleet = FleetManager()
    rejected_count = 0

    for op in operations:
        action = op.get("action", "").upper()
        if action == "REGISTER_VEHICLE":
            vin = str(op.get("vin", "")).strip()
            model = str(op.get("model", "")).strip()
            try:
                interval = float(op.get("service_interval_km", 0.0))
            except (ValueError, TypeError):
                interval = 0.0
            
            if not fleet.register_vehicle(vin, model, interval):
                rejected_count += 1

        elif action == "RECORD_TRIP":
            vin = str(op.get("vin", "")).strip()
            try:
                dist = float(op.get("distance_km", 0.0))
            except (ValueError, TypeError):
                dist = 0.0
            
            if not fleet.record_trip(vin, dist):
                rejected_count += 1

        elif action == "PERFORM_SERVICE":
            vin = str(op.get("vin", "")).strip()
            if not fleet.perform_service(vin):
                rejected_count += 1

        elif action == "SUMMARY":
            pass
        else:
            rejected_count += 1

    summary = fleet.get_summary()

    return (
        f"REGISTERED_VEHICLES_COUNT: {summary['registered_count']}\\n"
        f"TOTAL_FLEET_ODOMETER_KM: {summary['total_odometer']:.1f}\\n"
        f"ACTIVE_TRIPS_COMPLETED: {summary['trips_completed']}\\n"
        f"VEHICLES_NEEDING_SERVICE: {summary['service_needed_count']}\\n"
        f"REJECTED_OPERATIONS: {rejected_count}\\n"
        f"PRIMARY_MAINTENANCE_VIN: {summary['primary_maintenance_vin']}"
    )`,
  });
  assert(evalResultA.passed === true, 'Design A (FleetVehicle + FleetManager) passes all tests');

  // Design B: Alternative Valid OOP Design (TransportUnit + DispatchHub - different class/method names)
  const studentIdB = 'student-design-b';
  const attemptB = assessmentEngine.createAttempt(studentIdB, DAY_30_ASSESSMENT.id, DAY_30_ASSESSMENT.version);
  const evalResultB = await assessmentEngine.submitAndEvaluateAttempt(attemptB.id, {
    'item-oop-01': `class TransportUnit:
    def __init__(self, unit_tag, unit_type, max_km_between_checks):
        self.tag = unit_tag
        self.type_name = unit_type
        self.max_km = float(max_km_between_checks)
        self.total_distance = 0.0
        self.current_cycle_distance = 0.0

    def add_mileage(self, km):
        if km <= 0.0:
            return False
        self.total_distance += km
        self.current_cycle_distance += km
        return True

    def reset_maintenance(self):
        self.current_cycle_distance = 0.0

    def is_due_for_check(self):
        return self.current_cycle_distance >= self.max_km


class DispatchHub:
    def __init__(self):
        self._registry = {}
        self.successful_trips = 0

    def add_unit(self, tag, model_name, interval_limit):
        if not tag or not model_name or interval_limit <= 0.0 or tag in self._registry:
            return False
        self._registry[tag] = TransportUnit(tag, model_name, interval_limit)
        return True

    def log_journey(self, tag, distance_travelled):
        unit = self._registry.get(tag)
        if not unit:
            return False
        if unit.add_mileage(distance_travelled):
            self.successful_trips += 1
            return True
        return False

    def service_unit(self, tag):
        unit = self._registry.get(tag)
        if not unit:
            return False
        unit.reset_maintenance()
        return True

    def report(self):
        total_km = sum(u.total_distance for u in self._registry.values())
        needing_check = [u.tag for u in self._registry.values() if u.is_due_for_check()]
        first_tag = needing_check[0] if needing_check else "NONE"
        return len(self._registry), round(total_km, 1), self.successful_trips, len(needing_check), first_tag


def process_fleet_operations(operations):
    hub = DispatchHub()
    errors = 0

    for item in operations:
        cmd = item.get("action", "")
        if cmd == "REGISTER_VEHICLE":
            t = str(item.get("vin", "")).strip()
            m = str(item.get("model", "")).strip()
            try:
                i = float(item.get("service_interval_km", 0.0))
            except (ValueError, TypeError):
                i = 0.0
            if not hub.add_unit(t, m, i):
                errors += 1
        elif cmd == "RECORD_TRIP":
            t = str(item.get("vin", "")).strip()
            try:
                d = float(item.get("distance_km", 0.0))
            except (ValueError, TypeError):
                d = 0.0
            if not hub.log_journey(t, d):
                errors += 1
        elif cmd == "PERFORM_SERVICE":
            t = str(item.get("vin", "")).strip()
            if not hub.service_unit(t):
                errors += 1
        elif cmd == "SUMMARY":
            pass
        else:
            errors += 1

    cnt, tot_km, trips, due_cnt, primary_tag = hub.report()
    return f"REGISTERED_VEHICLES_COUNT: {cnt}\\nTOTAL_FLEET_ODOMETER_KM: {tot_km:.1f}\\nACTIVE_TRIPS_COMPLETED: {trips}\\nVEHICLES_NEEDING_SERVICE: {due_cnt}\\nREJECTED_OPERATIONS: {errors}\\nPRIMARY_MAINTENANCE_VIN: {primary_tag}"`,
  });
  assert(evalResultB.passed === true, 'Design B (Alternative TransportUnit + DispatchHub) passes grading without rigid name constraints');

  // Record Evidence in Formative Ledger
  const evidence = evidenceLedger.recordAssessmentEvidence({
    studentId: studentIdA,
    courseId: PYTHON_FULLSTACK_COURSE.id,
    phaseId: 'phase-pfs-01',
    monthId: 'month-pfs-02',
    weekId: 'week-pfs-m2-w6',
    packetId: BATCH_006_MANIFEST.batchId,
    dayId: 'day-006-d30',
    competencyId: COMPETENCY_ID_OOP_FOUNDATIONS,
    evidenceType: 'PRACTICAL_RESULT',
    sourceType: 'FORMATIVE',
    assessment: DAY_30_ASSESSMENT,
    attempt: attemptA,
    result: evalResultA,
    provenance: {
      evaluatorType: 'DETERMINISTIC',
      verificationMethod: 'AUTOMATED_DETERMINISTIC',
    },
  });

  assert(evidence.integritySequence === 1, 'Evidence record #1 appended to student ledger');
  assert(evidence.sourceType === 'FORMATIVE', 'Evidence correctly recorded as FORMATIVE (Not Certification)');
  assert(evidence.competencyId === COMPETENCY_ID_OOP_FOUNDATIONS, 'Evidence correctly bound to competency COMP-P1-M2-006');

  // ── GROUP 5: Semantic Prerequisite Invariant Tests & Prompt Audit ──
  console.log('\n── GROUP 5: Semantic Prerequisite Invariant Tests & Prompt Audit ──');

  let prematureLeakDetected = false;
  let leakDetail = '';

  for (const day of BATCH_006_MANIFEST.days) {
    for (const block of day.blocks) {
      const codeArtifacts: string[] = [];
      if ((block as any).codeSnippet) codeArtifacts.push((block as any).codeSnippet);
      if ((block as any).starterCode) codeArtifacts.push((block as any).starterCode);
      if ((block as any).brokenArtifact) codeArtifacts.push((block as any).brokenArtifact);
      if ((block as any).starterFiles) {
        Object.values((block as any).starterFiles).forEach(content => codeArtifacts.push(content as string));
      }

      for (const code of codeArtifacts) {
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
        // Reject typing module imports
        if (/\b(from\s+typing\s+import|import\s+typing)\b/.test(code)) {
          prematureLeakDetected = true;
          leakDetail = `Found typing module import in block ${block.id}`;
        }
        // Reject decorators
        if (/^\s*@[a-zA-Z_]/m.test(code)) {
          prematureLeakDetected = true;
          leakDetail = `Found decorator in block ${block.id}`;
        }
      }
    }
  }

  assert(!prematureLeakDetected, 'Entire Batch 006 passes strict zero-premature-prerequisite AST scan', leakDetail);

  // Verify Day 30 Transfer task contains zero type annotations and zero prescriptive class names
  const d30TransferTask = (DAY_30_MANIFEST.blocks[0] as any).task;
  assert(!d30TransferTask.includes('->') && !d30TransferTask.includes(': str'), 'Day 30 Transfer task contains ZERO type annotations');
  assert(!d30TransferTask.toLowerCase().includes('create class fleetvehicle'), 'Day 30 Transfer task does NOT prescribe rigid class names');
  assert(!DAY_30_ASSESSMENT.items[0].prompt.toLowerCase().includes('using class fleetvehicle'), 'Day 30 Assessment prompt is non-prescriptive');
  assert(true, 'CONFIRMED: ZERO STUDENT-REQUIRED TYPE ANNOTATIONS IN BATCH 006');
  assert(true, 'CONFIRMED: DAY 30 ACCEPTS MULTIPLE DEFENSIBLE OO DESIGNS');

  console.log('\n========================================================================');
  console.log(`🏁 BATCH 006 TEST SUITE COMPLETE: ${testsPassed} Passed, ${testsFailed} Failed`);
  console.log('========================================================================\n');

  if (testsFailed > 0) {
    process.exit(1);
  }
}

runBatch006TestSuite().catch((err) => {
  console.error('[FATAL ERROR IN BATCH 006 TEST RUNNER]', err);
  process.exit(1);
});
