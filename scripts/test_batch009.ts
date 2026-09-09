// scripts/test_batch009.ts
// Invariant & Technical Audit Test Suite for PinIT Batch 009 (Days 41–45: Month 3 Week 9)
// Logging, Defensive Validation & Professional CLI Engineering

import {
  BATCH_009_MANIFEST,
  DAY_41_MANIFEST,
  DAY_42_MANIFEST,
  DAY_43_MANIFEST,
  DAY_44_MANIFEST,
  DAY_45_MANIFEST,
  DAY_45_ASSESSMENT,
  COMPETENCY_ID_LOGGING_CLI_ENGINEERING,
} from '../src/lib/curriculum/pythonFullStack/batch009';
import {
  BATCH_001_MANIFEST,
  BATCH_002_MANIFEST,
  BATCH_003_MANIFEST,
  BATCH_004_MANIFEST,
  BATCH_005_MANIFEST,
  BATCH_006_MANIFEST,
  BATCH_007_MANIFEST,
  BATCH_008_MANIFEST,
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

async function runBatch009Tests() {
  console.log('\n========================================================================');
  console.log('📦 RUNNING PINIT BATCH 009 (DAYS 41–45) TECHNICAL AUDIT TEST SUITE');
  console.log('========================================================================\n');

  // ── GROUP 1: Batch Manifest & Strict 5-Day Structure ──
  console.log('── GROUP 1: Batch Manifest & Strict 5-Day Structure ──');
  assert(BATCH_009_MANIFEST.batchCode === 'P1-M3-W9-BATCH009', 'Batch code is P1-M3-W9-BATCH009');
  assert(BATCH_009_MANIFEST.days.length === 5, 'Batch contains exactly 5 days (Days 41–45)');

  let manifestValid = true;
  try {
    ContentValidator.validateBatchManifest(BATCH_009_MANIFEST);
  } catch (e: any) {
    console.error('Manifest validation error:', e.message);
    manifestValid = false;
  }
  assert(manifestValid, 'ContentValidator.validateBatchManifest() passes with 0 validation errors');

  assert(DAY_41_MANIFEST.dayNumber === 1 && DAY_41_MANIFEST.pedagogicalIntent === 'UNDERSTAND', 'Day 41 is Day 1 of batch with UNDERSTAND intent');
  assert(DAY_42_MANIFEST.dayNumber === 2 && DAY_42_MANIFEST.pedagogicalIntent === 'APPLY', 'Day 42 is Day 2 of batch with APPLY intent');
  assert(DAY_43_MANIFEST.dayNumber === 3 && DAY_43_MANIFEST.pedagogicalIntent === 'BUILD', 'Day 43 is Day 3 of batch with BUILD intent');
  assert(DAY_44_MANIFEST.dayNumber === 4 && DAY_44_MANIFEST.pedagogicalIntent === 'DEBUG', 'Day 44 is Day 4 of batch with DEBUG intent');
  assert(DAY_45_MANIFEST.dayNumber === 5 && DAY_45_MANIFEST.pedagogicalIntent === 'TRANSFER', 'Day 45 is Day 5 of batch with TRANSFER intent');

  // ── GROUP 2: Pedagogical Content Blocks & Quality Audit ──
  console.log('\n── GROUP 2: Pedagogical Content Blocks & Quality Audit ──');
  const allBlocks = BATCH_009_MANIFEST.days.flatMap(d => d.blocks);
  assert(allBlocks.length >= 18, `Batch 009 contains ${allBlocks.length} comprehensive content blocks across 5 days (Found: ${allBlocks.length})`);

  // Day 41: Logging & Observability
  const d41Theory = DAY_41_MANIFEST.blocks.find(b => b.type === 'THEORY') as any;
  assert(d41Theory.mentalModel.includes('Flight Telemetry'), 'Day 41 teaches logging as application operational telemetry');
  assert(d41Theory.commonMisconceptions.some((m: string) => m.toLowerCase().includes('json structured logs')), 'Day 41 clarifies that standard logging requires formatting for structured log output');
  assert(d41Theory.commonMisconceptions.some((m: string) => m.includes('if not logger.handlers')), 'Day 41 clarifies that if not logger.handlers does not guard against hierarchical propagation duplicates');
  assert(d41Theory.commonMistakes.some((m: string) => m.includes('logger.exception')), 'Day 41 warns against losing tracebacks with string formatting instead of logger.exception');

  // Day 42: Defensive Validation
  const d42Theory = DAY_42_MANIFEST.blocks.find(b => b.type === 'THEORY') as any;
  assert(d42Theory.mentalModel.includes('VALIDATION') && d42Theory.mentalModel.includes('NORMALIZATION') && d42Theory.mentalModel.includes('SANITIZATION'), 'Day 42 explicitly distinguishes validation, normalization, and sanitization');
  assert(d42Theory.mentalModel.includes('REJECT invalid data'), 'Day 42 emphasizes rejecting non-compliant data at the boundary');

  // Day 43: CLI Design & argparse
  assert(DAY_43_MANIFEST.title === 'CLI Design with argparse', 'Day 43 title is strictly "CLI Design with argparse" (No premature entry point packaging claims)');
  const d43Theory = DAY_43_MANIFEST.blocks.find(b => b.type === 'THEORY') as any;
  assert(d43Theory.whatItIs.includes('is the list of command-line argument strings supplied to the Python process'), 'Day 43 accurately defines sys.argv as list of command-line argument strings');
  assert(d43Theory.mentalModel.includes('argparse'), 'Day 43 compares sys.argv vs argparse cleanly');
  assert(d43Theory.commonMisconceptions.some((m: string) => m.includes('Batch 010')), 'Day 43 explicitly notes installed entry points belong to packaging metadata in Batch 010');

  // Day 44: Production Diagnostics
  const d44DebuggingBlocks = DAY_44_MANIFEST.blocks.filter(b => b.type === 'DEBUGGING_CHALLENGE') as any[];
  assert(d44DebuggingBlocks.length === 3, 'Day 44 contains 3 realistic operational debugging challenges');
  assert(d44DebuggingBlocks[0].problemDescription.toLowerCase().includes('propagation'), 'Debugging Challenge 1 diagnoses duplicate logging due to handler propagation');
  assert(d44DebuggingBlocks[0].brokenArtifact.includes('parent_logger') && d44DebuggingBlocks[0].brokenArtifact.includes('child_logger'), 'Debugging Challenge 1 tests parent/child logger hierarchy');
  assert(d44DebuggingBlocks[1].problemDescription.toLowerCase().includes('exit code'), 'Debugging Challenge 2 diagnoses masked exit codes');
  assert(d44DebuggingBlocks[2].problemDescription.toLowerCase().includes('late validation'), 'Debugging Challenge 3 diagnoses late validation & partial state corruption');

  // Day 45: Operational Tool
  assert(DAY_45_MANIFEST.title === 'Operational CLI Audit & Telemetry Tool', 'Day 45 title is strictly "Operational CLI Audit & Telemetry Tool"');
  assert(DAY_45_ASSESSMENT.title === 'Operational CLI Audit & Telemetry Tool Formative Assessment', 'Day 45 assessment title is Operational CLI Audit & Telemetry Tool Formative Assessment');
  assert(DAY_45_ASSESSMENT.description.includes('Client-accessible formative test fixtures'), 'Day 45 assessment description accurately states client-accessible formative test fixtures');

  // ── GROUP 3: Day 45 Independent Assessment Invariants & Rubric ──
  console.log('\n── GROUP 3: Day 45 Independent Assessment Invariants & Rubric ──');
  let asmValid = true;
  try {
    AssessmentValidator.validateAssessment(DAY_45_ASSESSMENT);
  } catch (e: any) {
    console.error('Assessment validation error:', e.message);
    asmValid = false;
  }
  assert(asmValid, 'AssessmentValidator.validateAssessment() passes for Day 45 Assessment');

  const rubricSum = DAY_45_ASSESSMENT.items[0].rubricDimensions?.reduce((acc, r) => acc + r.weight, 0) || 0;
  assert(Math.abs(rubricSum - 1.0) < 0.0001, `Day 45 rubric weights sum exactly to 1.0 (Found: ${rubricSum})`);
  assert(DAY_45_ASSESSMENT.mode === 'FORMATIVE' || DAY_45_ASSESSMENT.mode === 'PRACTICE', 'Day 45 is explicitly marked mode: FORMATIVE (Formative practice only, not Certification)');

  // Register in Assessment Engine
  const assessmentEngine = new AssessmentEngine();
  assessmentEngine.registerAssessment(DAY_45_ASSESSMENT);
  const sanitized = assessmentEngine.getSanitizedAssessment(DAY_45_ASSESSMENT.id);
  assert(sanitized !== undefined, 'Sanitized Day 45 assessment generated');
  assert((sanitized?.items[0] as any).privateTests === undefined, 'Sanitized payload DOES NOT leak privateTests to client');
  assert((sanitized?.items[0] as any).integrityTests === undefined, 'Sanitized payload DOES NOT leak integrityTests to client');
  assert(sanitized?.items[0].visibleTests?.length === 2, 'Sanitized payload includes visible test cases');

  // ── GROUP 4: Multi-Design Grading Validation ──
  console.log('\n── GROUP 4: Multi-Design Grading Validation ──');

  // Design A: Object-Oriented Telemetry Processor with argparse
  const studentSolutionDesignA = `
import argparse

SEVERITY_ORDER = {"DEBUG": 10, "INFO": 20, "WARNING": 30, "ERROR": 40, "CRITICAL": 50}

class TelemetryRecord:
    def __init__(self, event_id, service, severity, message, duration_ms=0.0):
        self.event_id = str(event_id).strip()
        self.service = str(service).strip().lower()
        self.severity = str(severity).strip().upper()
        self.message = str(message)
        self.duration_ms = float(duration_ms)

    @classmethod
    def validate_and_create(cls, raw_dict):
        if not isinstance(raw_dict, dict):
            return None
        for req in ("event_id", "service", "severity", "message"):
            if req not in raw_dict or not str(raw_dict[req]).strip():
                return None
        sev = str(raw_dict["severity"]).strip().upper()
        if sev not in SEVERITY_ORDER:
            return None
        dur = raw_dict.get("duration_ms", 0.0)
        try:
            dur_float = float(dur)
            if dur_float < 0.0:
                return None
        except (ValueError, TypeError):
            return None

        # Redact sensitive tokens
        msg = str(raw_dict["message"])
        for token in ("password=", "secret=", "token="):
            if token in msg.lower():
                parts = msg.split()
                redacted_parts = []
                for p in parts:
                    if any(p.lower().startswith(t) for t in ("password=", "secret=", "token=")):
                        key = p.split("=")[0]
                        redacted_parts.append(f"{key}=[REDACTED]")
                    else:
                        redacted_parts.append(p)
                msg = " ".join(redacted_parts)

        return cls(raw_dict["event_id"], raw_dict["service"], sev, msg, dur_float)


class AuditProcessor:
    def __init__(self, min_severity="INFO", service_filter=None, max_records=1000):
        self.min_severity = min_severity.upper()
        self.service_filter = service_filter.lower() if service_filter else None
        self.max_records = max_records
        self.processed = 0
        self.matched = 0
        self.rejected = 0
        self.critical_errors = 0
        self.service_counts = {}

    def ingest(self, raw_record):
        if self.processed >= self.max_records:
            return
        self.processed += 1
        record = TelemetryRecord.validate_and_create(raw_record)
        if not record:
            self.rejected += 1
            return

        if record.severity == "CRITICAL":
            self.critical_errors += 1

        min_level = SEVERITY_ORDER.get(self.min_severity, 20)
        rec_level = SEVERITY_ORDER.get(record.severity, 0)
        if rec_level < min_level:
            return

        if self.service_filter and record.service != self.service_filter:
            return

        self.matched += 1
        self.service_counts[record.service] = self.service_counts.get(record.service, 0) + 1

    def generate_report(self):
        if self.processed == 0 and self.rejected == 0:
            return (
                "PROCESSED_RECORDS_COUNT: 0\\n"
                "MATCHED_RECORDS_COUNT: 0\\n"
                "REJECTED_RECORDS_COUNT: 0\\n"
                "CRITICAL_ERROR_COUNT: 0\\n"
                "PRIMARY_SERVICE: NONE\\n"
                "AUDIT_STATUS: EMPTY"
            )

        top_service = "NONE"
        if self.service_counts:
            # Find service with most matched records
            top_service = max(self.service_counts.items(), key=lambda x: x[1])[0]

        status = "ALERT" if self.critical_errors > 0 else "PASS"
        return (
            f"PROCESSED_RECORDS_COUNT: {self.processed}\\n"
            f"MATCHED_RECORDS_COUNT: {self.matched}\\n"
            f"REJECTED_RECORDS_COUNT: {self.rejected}\\n"
            f"CRITICAL_ERROR_COUNT: {self.critical_errors}\\n"
            f"PRIMARY_SERVICE: {top_service}\\n"
            f"AUDIT_STATUS: {status}"
        )


def run_audit_tool(cli_args, telemetry_records):
    # Parse CLI flags
    parser = argparse.ArgumentParser(prog="audit_tool")
    parser.add_argument("--min-severity", choices=["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"], default="INFO")
    parser.add_argument("--service", default=None)
    parser.add_argument("--format", choices=["summary", "detailed"], default="summary")
    parser.add_argument("--max-records", type=int, default=1000)

    try:
        args = parser.parse_args(cli_args)
    except SystemExit:
        return "CLI_ERROR: Invalid arguments provided"

    if args.max_records <= 0:
        return "CLI_ERROR: Invalid arguments provided"

    processor = AuditProcessor(
        min_severity=args.min_severity,
        service_filter=args.service,
        max_records=args.max_records
    )

    for rec in telemetry_records:
        processor.ingest(rec)

    return processor.generate_report()
`;

  const attemptA = assessmentEngine.createAttempt('student-001', DAY_45_ASSESSMENT.id, DAY_45_ASSESSMENT.version);
  const evalResultA = await assessmentEngine.submitAndEvaluateAttempt(attemptA.id, {
    'item-cli-01': studentSolutionDesignA,
  });

  assert(evalResultA.passed === true, 'Design A (Object-Oriented AuditProcessor) passes all tests');

  // Design B: Functional decomposition & alternative structure
  const studentSolutionDesignB = `
SEVERITY_MAP = {"DEBUG": 1, "INFO": 2, "WARNING": 3, "ERROR": 4, "CRITICAL": 5}

def parse_cli_flags(args_list):
    params = {"min_severity": "INFO", "service": None, "format": "summary", "max_records": 1000}
    i = 0
    while i < len(args_list):
        flag = args_list[i]
        if flag == "--min-severity":
            if i + 1 >= len(args_list) or args_list[i+1] not in SEVERITY_MAP:
                return None
            params["min_severity"] = args_list[i+1]
            i += 2
        elif flag == "--service":
            if i + 1 >= len(args_list):
                return None
            params["service"] = args_list[i+1].lower()
            i += 2
        elif flag == "--format":
            if i + 1 >= len(args_list) or args_list[i+1] not in ("summary", "detailed"):
                return None
            params["format"] = args_list[i+1]
            i += 2
        elif flag == "--max-records":
            if i + 1 >= len(args_list):
                return None
            try:
                val = int(args_list[i+1])
                if val <= 0:
                    return None
                params["max_records"] = val
            except ValueError:
                return None
            i += 2
        else:
            return None
    return params

def run_audit_tool(cli_args, telemetry_records):
    config = parse_cli_flags(cli_args)
    if config is None:
        return "CLI_ERROR: Invalid arguments provided"

    if not telemetry_records:
        return (
            "PROCESSED_RECORDS_COUNT: 0\\n"
            "MATCHED_RECORDS_COUNT: 0\\n"
            "REJECTED_RECORDS_COUNT: 0\\n"
            "CRITICAL_ERROR_COUNT: 0\\n"
            "PRIMARY_SERVICE: NONE\\n"
            "AUDIT_STATUS: EMPTY"
        )

    processed = 0
    matched = 0
    rejected = 0
    critical_errors = 0
    service_freq = {}

    min_weight = SEVERITY_MAP[config["min_severity"]]

    for raw in telemetry_records:
        if processed >= config["max_records"]:
            break
        processed += 1

        if not isinstance(raw, dict):
            rejected += 1
            continue

        evt_id = raw.get("event_id")
        svc = raw.get("service")
        sev = raw.get("severity")
        msg = raw.get("message")
        if not evt_id or not svc or not sev or msg is None:
            rejected += 1
            continue

        sev_upper = str(sev).upper()
        if sev_upper not in SEVERITY_MAP:
            rejected += 1
            continue

        if "duration_ms" in raw:
            try:
                dur = float(raw["duration_ms"])
                if dur < 0.0:
                    rejected += 1
                    continue
            except (ValueError, TypeError):
                rejected += 1
                continue

        if sev_upper == "CRITICAL":
            critical_errors += 1

        if SEVERITY_MAP[sev_upper] < min_weight:
            continue

        svc_clean = str(svc).strip().lower()
        if config["service"] and svc_clean != config["service"]:
            continue

        matched += 1
        service_freq[svc_clean] = service_freq.get(svc_clean, 0) + 1

    top_svc = "NONE"
    if service_freq:
        top_svc = max(service_freq.items(), key=lambda x: x[1])[0]

    status = "ALERT" if critical_errors > 0 else "PASS"
    return (
        f"PROCESSED_RECORDS_COUNT: {processed}\\n"
        f"MATCHED_RECORDS_COUNT: {matched}\\n"
        f"REJECTED_RECORDS_COUNT: {rejected}\\n"
        f"CRITICAL_ERROR_COUNT: {critical_errors}\\n"
        f"PRIMARY_SERVICE: {top_svc}\\n"
        f"AUDIT_STATUS: {status}"
    )
`;

  const attemptB = assessmentEngine.createAttempt('student-002', DAY_45_ASSESSMENT.id, DAY_45_ASSESSMENT.version);
  const evalResultB = await assessmentEngine.submitAndEvaluateAttempt(attemptB.id, {
    'item-cli-01': studentSolutionDesignB,
  });

  assert(evalResultB.passed === true, 'Design B (Functional CLI & Custom Parser) passes grading without rigid teacher class names');

  // Record Formative Evidence Ledger
  const ledger = new EvidenceLedger();
  const evidenceRecord = ledger.recordAssessmentEvidence({
    studentId: 'student-001',
    courseId: 'course-python-fullstack',
    phaseId: 'phase-pfs-01',
    monthId: 'month-pfs-03',
    weekId: 'week-pfs-m3-w9',
    packetId: BATCH_009_MANIFEST.batchId,
    dayId: 'day-009-d45',
    competencyId: COMPETENCY_ID_LOGGING_CLI_ENGINEERING,
    evidenceType: 'PRACTICAL_RESULT',
    sourceType: 'FORMATIVE',
    assessment: DAY_45_ASSESSMENT,
    attempt: attemptA,
    result: evalResultA,
    provenance: {
      evaluatorType: 'DETERMINISTIC',
      verificationMethod: 'AUTOMATED_DETERMINISTIC',
    },
  });

  assert(evidenceRecord.sourceType === 'FORMATIVE', 'Evidence correctly labeled FORMATIVE (Not Certification)');
  assert(evidenceRecord.competencyId === COMPETENCY_ID_LOGGING_CLI_ENGINEERING, 'Evidence bound to competency COMP-PFS-M3-009');

  // ── GROUP 5: Semantic Prerequisite Invariant Tests & Boundary Audit ──
  console.log('\n── GROUP 5: Semantic Prerequisite Invariant Tests & Boundary Audit ──');
  const batch009Src = fs.readFileSync(path.join(process.cwd(), 'src/lib/curriculum/pythonFullStack/batch009.ts'), 'utf-8');

  // Forbidden concepts deferred to future batches
  assert(!batch009Src.includes('@property'), 'AST Scan: Zero @property decorators in Batch 009');
  assert(!batch009Src.includes('@dataclass'), 'AST Scan: Zero @dataclass decorators in Batch 009 (Deferred to Batch 010)');
  assert(!batch009Src.includes('abc.ABC'), 'AST Scan: Zero ABCs in Batch 009');
  assert(!batch009Src.includes('typing.Protocol'), 'AST Scan: Zero Protocols in Batch 009');
  assert(!batch009Src.includes('pyproject.toml') && !batch009Src.includes('[project.scripts]'), 'AST Scan: Zero pyproject.toml / [project.scripts] packaging requirements in Batch 009 (Deferred to Batch 010)');
  assert(!batch009Src.includes('async def') && !batch009Src.includes('await '), 'AST Scan: Zero async/await keywords in Batch 009');

  const d45Transfer = DAY_45_MANIFEST.blocks[0] as any;
  assert(!d45Transfer.task.includes('->') && !d45Transfer.task.includes(': str') && !d45Transfer.task.includes(': int'), 'Day 45 Transfer task contains ZERO type annotations');
  assert(!d45Transfer.task.includes('must name your class TelemetryRecord'), 'Day 45 Transfer task does NOT prescribe rigid class names');

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
  ];

  const progressReport = ProgressEngine.computeProgress(publishedBatches);
  assert(progressReport.publishedBatchesCount === 9, 'Progress Engine reports exactly 9 published batches');
  assert(progressReport.publishedLearningDaysCount === 45, 'Progress Engine computes exactly 45 published learning days');
  assert(progressReport.semester1PlannedDays === 120, 'Semester 1 planned days dynamically computed as 120 (6 months * 20 days)');
  assert(progressReport.year1PlannedDays === 240, 'Year 1 planned days dynamically computed as 240 (12 months * 20 days)');
  assert(progressReport.totalPlannedDays === 480, 'Total 24-month program planned days dynamically computed as 480 (24 months * 20 days)');
  assert(progressReport.semester1ProgressPercent === 37.5, `Semester 1 progress calculated as 45 / 120 = 37.50% (Found: ${progressReport.semester1ProgressPercent}%)`);
  assert(progressReport.year1ProgressPercent === 18.75, `Year 1 progress calculated as 45 / 240 = 18.75% (Found: ${progressReport.year1ProgressPercent}%)`);
  assert(progressReport.totalProgramProgressPercent === 9.38, `Total program progress calculated as 45 / 480 = 9.38% (Found: ${progressReport.totalProgramProgressPercent}%)`);

  console.log('\n========================================================================');
  console.log('🏁 BATCH 009 TEST SUITE COMPLETE: All Invariants Verified Cleanly');
  console.log('========================================================================\n');
}

runBatch009Tests().catch((err) => {
  console.error('[FATAL ERROR IN BATCH 009 TEST SUITE]', err);
  process.exit(1);
});
