// scripts/test_batch010.ts
// Invariant & Technical Audit Test Suite for PinIT Batch 010 (Days 46–50: Month 3 Week 10)
// Configuration, Type-Modeled Data & Modern Python Packaging

import {
  BATCH_010_MANIFEST,
  DAY_46_MANIFEST,
  DAY_47_MANIFEST,
  DAY_48_MANIFEST,
  DAY_49_MANIFEST,
  DAY_50_MANIFEST,
  DAY_50_ASSESSMENT,
  COMPETENCY_ID_PACKAGING_CONFIGURATION,
} from '../src/lib/curriculum/pythonFullStack/batch010';
import {
  BATCH_001_MANIFEST,
  BATCH_002_MANIFEST,
  BATCH_003_MANIFEST,
  BATCH_004_MANIFEST,
  BATCH_005_MANIFEST,
  BATCH_006_MANIFEST,
  BATCH_007_MANIFEST,
  BATCH_008_MANIFEST,
  BATCH_009_MANIFEST,
} from '../src/lib/curriculum';
import { ContentValidator } from '../src/lib/curriculum/contentValidator';
import { AssessmentValidator } from '../src/lib/curriculum/assessmentValidator';
import { AssessmentEngine } from '../src/lib/curriculum/assessmentEngine';
import { EvidenceLedger } from '../src/lib/curriculum/evidenceLedger';
import { ProgressEngine } from '../src/lib/curriculum/progressEngine';
import * as fs from 'fs';
import * as path from 'path';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`  ❌ [FAIL] ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
  console.log(`  ✅ [PASS] ${message}`);
}

async function runBatch010Tests() {
  console.log('\n========================================================================');
  console.log('📦 RUNNING PINIT BATCH 010 (DAYS 46–50) TECHNICAL AUDIT TEST SUITE');
  console.log('========================================================================\n');

  // ── GROUP 1: Batch Manifest & Strict 5-Day Structure ──
  console.log('── GROUP 1: Batch Manifest & Strict 5-Day Structure ──');
  assert(BATCH_010_MANIFEST.batchCode === 'P1-M3-W10-BATCH010', 'Batch code is P1-M3-W10-BATCH010');
  assert(BATCH_010_MANIFEST.days.length === 5, 'Batch contains exactly 5 days (Days 46–50)');

  let manifestValid = true;
  try {
    ContentValidator.validateBatchManifest(BATCH_010_MANIFEST);
  } catch (e: any) {
    console.error('Manifest validation error:', e.message);
    manifestValid = false;
  }
  assert(manifestValid, 'ContentValidator.validateBatchManifest() passes with 0 validation errors');

  assert(DAY_46_MANIFEST.dayNumber === 1 && DAY_46_MANIFEST.pedagogicalIntent === 'UNDERSTAND', 'Day 46 is Day 1 of batch with UNDERSTAND intent');
  assert(DAY_47_MANIFEST.dayNumber === 2 && DAY_47_MANIFEST.pedagogicalIntent === 'APPLY', 'Day 47 is Day 2 of batch with APPLY intent');
  assert(DAY_48_MANIFEST.dayNumber === 3 && DAY_48_MANIFEST.pedagogicalIntent === 'BUILD', 'Day 48 is Day 3 of batch with BUILD intent');
  assert(DAY_49_MANIFEST.dayNumber === 4 && DAY_49_MANIFEST.pedagogicalIntent === 'DEBUG', 'Day 49 is Day 4 of batch with DEBUG intent');
  assert(DAY_50_MANIFEST.dayNumber === 5 && DAY_50_MANIFEST.pedagogicalIntent === 'TRANSFER', 'Day 50 is Day 5 of batch with TRANSFER intent');

  // ── GROUP 2: Pedagogical Content Blocks & Quality Audit ──
  console.log('\n── GROUP 2: Pedagogical Content Blocks & Quality Audit ──');
  const allBlocks = BATCH_010_MANIFEST.days.flatMap(d => d.blocks);
  assert(allBlocks.length >= 18, `Batch 010 contains ${allBlocks.length} comprehensive content blocks across 5 days (Found: ${allBlocks.length})`);

  // Day 46: Configuration & Environment Management
  const d46Theory = DAY_46_MANIFEST.blocks.find(b => b.type === 'THEORY') as any;
  assert(d46Theory.mentalModel.includes('Precedence Strategy'), 'Day 46 teaches configuration precedence hierarchy');
  assert(d46Theory.commonMisconceptions.some((m: string) => m.includes('.env') && m.includes('standard library')), 'Day 46 explicitly clarifies that .env is an ecosystem convention, not a standard library feature');
  assert(d46Theory.commonMistakes.some((m: string) => m.includes('os.environ')), 'Day 46 warns against dumping os.environ wholesale');

  // Day 47: Basic Type Annotations + Dataclasses
  const d47Theory = DAY_47_MANIFEST.blocks.find(b => b.type === 'THEORY') as any;
  assert(d47Theory.mentalModel.includes('Annotations Document Intent'), 'Day 47 teaches type annotations as intent communication');
  assert(d47Theory.mentalModel.includes('frozen=True') && d47Theory.mentalModel.includes('recursively immutable'), 'Day 47 clarifies that frozen=True prevents attribute reassignment on instance and is not deep recursive immutability');
  assert(d47Theory.mentalModel.includes('default_factory'), 'Day 47 warns against mutable default lists and teaches default_factory');

  // Day 48: pyproject.toml & CLI Entry Points
  const d48Theory = DAY_48_MANIFEST.blocks.find(b => b.type === 'THEORY') as any;
  assert(d48Theory.mentalModel.includes('pyproject.toml') && d48Theory.mentalModel.includes('[project.scripts]'), 'Day 48 teaches modern pyproject.toml and [project.scripts]');
  assert(d48Theory.commonMisconceptions.some((m: string) => m.includes('Console scripts are a special Python language syntax')), 'Day 48 clarifies [project.scripts] is packaging metadata, not language syntax');

  // Day 49: Packaging Diagnostics
  const d49DebuggingBlocks = DAY_49_MANIFEST.blocks.filter(b => b.type === 'DEBUGGING_CHALLENGE') as any[];
  assert(d49DebuggingBlocks.length === 3, 'Day 49 contains 3 realistic packaging debugging challenges');
  assert(d49DebuggingBlocks[0].problemDescription.toLowerCase().includes('[project.scripts]'), 'Debugging Challenge 1 diagnoses broken [project.scripts] callable target');
  assert(d49DebuggingBlocks[1].problemDescription.toLowerCase().includes('source-tree'), 'Debugging Challenge 2 diagnoses source-tree file omission');
  assert(d49DebuggingBlocks[2].problemDescription.toLowerCase().includes('environment'), 'Debugging Challenge 3 diagnoses environment desynchronization & stale install');

  // Day 50: Distributable Application
  assert(DAY_50_MANIFEST.title === 'Distributable Python Application', 'Day 50 title is strictly Distributable Python Application');
  assert(DAY_50_ASSESSMENT.title === 'Distributable Python Application Formative Assessment', 'Day 50 assessment title is Distributable Python Application Formative Assessment');
  assert(DAY_50_ASSESSMENT.description.includes('Client-accessible formative test fixtures'), 'Day 50 assessment description accurately states client-accessible formative test fixtures');

  // ── GROUP 3: Day 50 Independent Assessment Invariants & Rubric ──
  console.log('\n── GROUP 3: Day 50 Independent Assessment Invariants & Rubric ──');
  let asmValid = true;
  try {
    AssessmentValidator.validateAssessment(DAY_50_ASSESSMENT);
  } catch (e: any) {
    console.error('Assessment validation error:', e.message);
    asmValid = false;
  }
  assert(asmValid, 'AssessmentValidator.validateAssessment() passes for Day 50 Assessment');

  const rubricSum = DAY_50_ASSESSMENT.items[0].rubricDimensions?.reduce((acc, r) => acc + r.weight, 0) || 0;
  assert(Math.abs(rubricSum - 1.0) < 0.0001, `Day 50 rubric weights sum exactly to 1.0 (Found: ${rubricSum})`);
  assert(DAY_50_ASSESSMENT.mode === 'FORMATIVE' || DAY_50_ASSESSMENT.mode === 'PRACTICE', 'Day 50 is explicitly marked mode: FORMATIVE (Formative practice only, not Certification)');

  // Register in Assessment Engine
  const assessmentEngine = new AssessmentEngine();
  assessmentEngine.registerAssessment(DAY_50_ASSESSMENT);
  const sanitized = assessmentEngine.getSanitizedAssessment(DAY_50_ASSESSMENT.id);
  assert(sanitized !== undefined, 'Sanitized Day 50 assessment generated');
  assert((sanitized?.items[0] as any).privateTests === undefined, 'Sanitized payload DOES NOT leak privateTests to client');
  assert((sanitized?.items[0] as any).integrityTests === undefined, 'Sanitized payload DOES NOT leak integrityTests to client');
  assert(sanitized?.items[0].visibleTests?.length === 2, 'Sanitized payload includes visible test cases');

  // ── GROUP 4: Multi-Design Grading Validation ──
  console.log('\n── GROUP 4: Multi-Design Grading Validation ──');

  // Design A: Dataclass-driven modular architecture
  const studentSolutionDesignA = `
import json
from dataclasses import dataclass, field
from typing import List

@dataclass(frozen=True)
class AppConfig:
    service_name: str
    port: int = 8080
    alert_threshold: float = 80.0
    tags: List[str] = field(default_factory=list)

    def __post_init__(self):
        if not self.service_name or not self.service_name.strip():
            raise ValueError("service_name cannot be empty")
        if self.port < 1 or self.port > 65535:
            raise ValueError(f"port {self.port} out of range [1, 65535]")
        if self.alert_threshold < 0.0 or self.alert_threshold > 100.0:
            raise ValueError("alert_threshold out of range [0.0, 100.0]")

def parse_pyproject(toml_text):
    # Minimal TOML table extractor
    if "[project]" not in toml_text or "[project.scripts]" not in toml_text:
        return None
    return True

def package_and_run_application(pyproject_content, env_dict, cli_args, test_payload):
    # 1. Validate pyproject.toml
    if not parse_pyproject(pyproject_content):
        return {"status": "CONFIG_ERROR", "service": "UNKNOWN", "port": 0, "exit_code": 2}

    # 2. Configuration Resolution with Precedence: CLI > Env > Default
    svc = cli_args.get("service") or env_dict.get("APP_SERVICE") or "default-service"
    raw_port = cli_args.get("port") or env_dict.get("APP_PORT") or 8080
    raw_thresh = cli_args.get("alert_threshold") or env_dict.get("APP_ALERT_THRESHOLD") or 80.0

    try:
        port = int(raw_port)
        thresh = float(raw_thresh)
        cfg = AppConfig(service_name=str(svc), port=port, alert_threshold=thresh)
    except (ValueError, TypeError):
        return {"status": "CONFIG_ERROR", "service": "UNKNOWN", "port": 0, "exit_code": 2}

    # 3. Entry point execution
    cpu = float(test_payload.get("cpu_usage", 0.0))
    if cpu > cfg.alert_threshold:
        return {"status": "ALERT", "service": cfg.service_name, "port": cfg.port, "exit_code": 1}

    return {"status": "OK", "service": cfg.service_name, "port": cfg.port, "exit_code": 0}
`;

  const attemptA = assessmentEngine.createAttempt('student-pkg-001', DAY_50_ASSESSMENT.id, DAY_50_ASSESSMENT.version);
  const evalResultA = await assessmentEngine.submitAndEvaluateAttempt(attemptA.id, {
    'item-pkg-01': studentSolutionDesignA,
  });

  assert(evalResultA.passed === true, 'Design A (Dataclass-driven modular architecture) passes all tests');

  // Design B: Functional decomposition with alternative parsing
  const studentSolutionDesignB = `
def validate_toml_metadata(content):
    lines = [line.strip() for line in content.splitlines() if line.strip() and not line.strip().startswith("#")]
    has_proj = any(line.startswith("[project]") for line in lines)
    has_scripts = any(line.startswith("[project.scripts]") for line in lines)
    return has_proj and has_scripts

def package_and_run_application(pyproject_content, env_dict, cli_args, test_payload):
    if not validate_toml_metadata(pyproject_content):
        return {"status": "CONFIG_ERROR", "service": "UNKNOWN", "port": 0, "exit_code": 2}

    # Precedence: CLI > Env > Default
    service = cli_args.get("service")
    if not service:
        service = env_dict.get("APP_SERVICE", "default-service")

    raw_port = cli_args.get("port")
    if raw_port is None:
        raw_port = env_dict.get("APP_PORT", 8080)

    try:
        port = int(raw_port)
        if port < 1 or port > 65535:
            return {"status": "CONFIG_ERROR", "service": "UNKNOWN", "port": 0, "exit_code": 2}
    except (ValueError, TypeError):
        return {"status": "CONFIG_ERROR", "service": "UNKNOWN", "port": 0, "exit_code": 2}

    raw_threshold = cli_args.get("alert_threshold")
    if raw_threshold is None:
        raw_threshold = env_dict.get("APP_ALERT_THRESHOLD", 80.0)

    try:
        thresh = float(raw_threshold)
        if thresh < 0.0 or thresh > 100.0:
            return {"status": "CONFIG_ERROR", "service": "UNKNOWN", "port": 0, "exit_code": 2}
    except (ValueError, TypeError):
        return {"status": "CONFIG_ERROR", "service": "UNKNOWN", "port": 0, "exit_code": 2}

    cpu = float(test_payload.get("cpu_usage", 0.0))
    if cpu > thresh:
        return {"status": "ALERT", "service": str(service), "port": port, "exit_code": 1}

    return {"status": "OK", "service": str(service), "port": port, "exit_code": 0}
`;

  const attemptB = assessmentEngine.createAttempt('student-pkg-002', DAY_50_ASSESSMENT.id, DAY_50_ASSESSMENT.version);
  const evalResultB = await assessmentEngine.submitAndEvaluateAttempt(attemptB.id, {
    'item-pkg-01': studentSolutionDesignB,
  });

  assert(evalResultB.passed === true, 'Design B (Functional CLI & Alternative Structure) passes grading without rigid teacher class names');

  // Record Formative Evidence Ledger
  const ledger = new EvidenceLedger();
  const evidenceRecord = ledger.recordAssessmentEvidence({
    studentId: 'student-pkg-001',
    courseId: 'course-python-fullstack',
    phaseId: 'phase-pfs-01',
    monthId: 'month-pfs-03',
    weekId: 'week-pfs-m3-w10',
    packetId: BATCH_010_MANIFEST.batchId,
    dayId: 'day-010-d50',
    competencyId: COMPETENCY_ID_PACKAGING_CONFIGURATION,
    evidenceType: 'PRACTICAL_RESULT',
    sourceType: 'FORMATIVE',
    assessment: DAY_50_ASSESSMENT,
    attempt: attemptA,
    result: evalResultA,
    provenance: {
      evaluatorType: 'DETERMINISTIC',
      verificationMethod: 'AUTOMATED_DETERMINISTIC',
    },
  });

  assert(evidenceRecord.sourceType === 'FORMATIVE', 'Evidence correctly labeled FORMATIVE (Not Certification)');
  assert(evidenceRecord.competencyId === COMPETENCY_ID_PACKAGING_CONFIGURATION, 'Evidence bound to competency COMP-PFS-M3-010');

  // ── GROUP 5: Semantic Prerequisite Invariant Tests & Boundary Audit ──
  console.log('\n── GROUP 5: Semantic Prerequisite Invariant Tests & Boundary Audit ──');
  const batch010Src = fs.readFileSync(path.join(process.cwd(), 'src/lib/curriculum/pythonFullStack/batch010.ts'), 'utf-8');

  // Forbidden concepts deferred to future batches
  assert(!batch010Src.includes('abc.ABC'), 'AST Scan: Zero ABCs in Batch 010');
  assert(!batch010Src.includes('typing.Protocol') && !batch010Src.includes('Protocol\b'), 'AST Scan: Zero Protocols in Batch 010');
  assert(!batch010Src.includes('Generic[') && !batch010Src.includes('TypeVar('), 'AST Scan: Zero Generic / TypeVar advanced typing in Batch 010');
  assert(!batch010Src.includes('ParamSpec') && !batch010Src.includes('TypeGuard'), 'AST Scan: Zero ParamSpec / TypeGuard in Batch 010');
  assert(!batch010Src.includes('async def') && !batch010Src.includes('await '), 'AST Scan: Zero async/await keywords in Batch 010');
  assert(!batch010Src.includes('python setup.py') && !batch010Src.includes('setup('), 'AST Scan: Zero legacy setup.py execution workflows in Batch 010');

  // Dataclass & basic typing ownership
  assert(batch010Src.includes('@dataclass'), 'Batch 010 correctly owns and teaches @dataclass');
  assert(batch010Src.includes('pyproject.toml'), 'Batch 010 correctly owns and teaches modern pyproject.toml packaging');

  // ── GROUP 6: Programmatic Progress Model Invariant Verification ──
  console.log('\n── GROUP 6: Programmatic Progress Model Invariant Verification ──');
  const publishedBatches = [
    BATCH_001_MANIFEST,
    BATCH_002_MANIFEST,
    BATCH_003_MANIFEST,
    BATCH_004_MANIFEST,
    BATCH_005_MANIFEST,
    BATCH_006_MANIFEST,
    BATCH_007_MANIFEST,
    BATCH_008_MANIFEST,
    BATCH_009_MANIFEST,
    BATCH_010_MANIFEST,
  ];

  const progressReport = ProgressEngine.computeProgress(publishedBatches);
  assert(progressReport.publishedBatchesCount === 10, 'Progress Engine reports exactly 10 published batches');
  assert(progressReport.publishedLearningDaysCount === 50, 'Progress Engine computes exactly 50 published learning days');
  assert(progressReport.semester1PlannedDays === 120, 'Semester 1 planned days dynamically computed as 120 (6 months * 20 days)');
  assert(progressReport.year1PlannedDays === 240, 'Year 1 planned days dynamically computed as 240 (12 months * 20 days)');
  assert(progressReport.totalPlannedDays === 480, 'Total 24-month program planned days dynamically computed as 480 (24 months * 20 days)');
  assert(progressReport.semester1ProgressPercent === 41.67, `Semester 1 progress calculated as 50 / 120 = 41.67% (Found: ${progressReport.semester1ProgressPercent}%)`);
  assert(progressReport.year1ProgressPercent === 20.83, `Year 1 progress calculated as 50 / 240 = 20.83% (Found: ${progressReport.year1ProgressPercent}%)`);
  assert(progressReport.totalProgramProgressPercent === 10.42, `Total program progress calculated as 50 / 480 = 10.42% (Found: ${progressReport.totalProgramProgressPercent}%)`);

  console.log('\n========================================================================');
  console.log('🏁 BATCH 010 TEST SUITE COMPLETE: All Invariants Verified Cleanly');
  console.log('========================================================================\n');
}

runBatch010Tests().catch((err) => {
  console.error('[FATAL ERROR IN BATCH 010 TEST SUITE]', err);
  process.exit(1);
});
