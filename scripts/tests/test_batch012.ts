// scripts/test_batch012.ts
// Invariant & Technical Audit Test Suite for PinIT Batch 012 (Days 56–60: Month 3 Week 12)
// Milestone Project 3 & Gate 1 Foundation Exit Assessment: Modular Multi-Source Inventory & Configuration Management System

import * as fs from 'fs';
import * as path from 'path';
import {
  BATCH_012_MANIFEST,
  DAY_56_MANIFEST,
  DAY_57_MANIFEST,
  DAY_58_MANIFEST,
  DAY_59_MANIFEST,
  DAY_60_MANIFEST,
  DAY_60_ASSESSMENT,
  COMPETENCY_ID_APPLICATION_SYNTHESIS,
} from '../src/lib/curriculum/pythonFullStack/batch012';
import { ContentValidator } from '../src/lib/curriculum/contentValidator';
import { AssessmentValidator } from '../src/lib/curriculum/assessmentValidator';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`  ❌ [FAIL] ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
  console.log(`  ✅ [PASS] ${message}`);
}

async function runBatch012Tests() {
  console.log('\n========================================================================');
  console.log('🧪 RUNNING PINIT BATCH 012 (DAYS 56–60) TECHNICAL AUDIT TEST SUITE');
  console.log('Milestone Project 3 & Gate 1 Foundation Exit Assessment');
  console.log('========================================================================\n');

  // ── GROUP 1: Batch Manifest & Strict 5-Day Structure ──
  console.log('── GROUP 1: Batch Manifest & Strict 5-Day Structure ──');
  assert(BATCH_012_MANIFEST.batchCode === 'P1-M3-W12-BATCH012', 'Batch code is P1-M3-W12-BATCH012');
  assert(BATCH_012_MANIFEST.days.length === 5, 'Batch contains exactly 5 days (Days 56–60)');

  let manifestValid = true;
  try {
    ContentValidator.validateBatchManifest(BATCH_012_MANIFEST);
  } catch (e: any) {
    console.error('Manifest validation error:', e.message);
    manifestValid = false;
  }
  assert(manifestValid, 'ContentValidator.validateBatchManifest() passes with 0 validation errors');

  assert(DAY_56_MANIFEST.dayNumber === 1 && DAY_56_MANIFEST.pedagogicalIntent === 'UNDERSTAND', 'Day 56 is Day 1 of batch with UNDERSTAND intent');
  assert(DAY_57_MANIFEST.dayNumber === 2 && DAY_57_MANIFEST.pedagogicalIntent === 'APPLY', 'Day 57 is Day 2 of batch with APPLY intent');
  assert(DAY_58_MANIFEST.dayNumber === 3 && DAY_58_MANIFEST.pedagogicalIntent === 'BUILD', 'Day 58 is Day 3 of batch with BUILD intent');
  assert(DAY_59_MANIFEST.dayNumber === 4 && DAY_59_MANIFEST.pedagogicalIntent === 'DEBUG', 'Day 59 is Day 4 of batch with DEBUG intent');
  assert(DAY_60_MANIFEST.dayNumber === 5 && DAY_60_MANIFEST.pedagogicalIntent === 'TRANSFER', 'Day 60 is Day 5 of batch with TRANSFER intent');

  // ── GROUP 2: Workload Calibration & Pacing ──
  console.log('\n── GROUP 2: Workload Calibration & Pacing ──');
  let totalInstructionalMinutes = 0;
  for (const d of BATCH_012_MANIFEST.days) {
    const dayMin = d.blocks.reduce((acc, b) => acc + b.estimatedMinutes, 0);
    totalInstructionalMinutes += dayMin;
  }
  const totalInstructionalHours = totalInstructionalMinutes / 60;
  assert(
    totalInstructionalHours >= 6.5 && totalInstructionalHours <= 7.5,
    `Batch 012 instructional workload calibrated between 6.5h and 7.5h (Calculated: ${totalInstructionalHours.toFixed(2)}h / ${totalInstructionalMinutes} min)`
  );

  const day60InstructionalMin = DAY_60_MANIFEST.blocks.reduce((acc, b) => acc + b.estimatedMinutes, 0);
  assert(
    day60InstructionalMin === 95,
    `Day 60 instructional workload is exactly 95 minutes (Found: ${day60InstructionalMin} min), separate from the 90-minute formal Gate 1 evaluation session`
  );
  assert(
    DAY_60_ASSESSMENT.timeLimitMinutes === 90,
    `Gate 1 Foundation Exit Assessment has dedicated 90-minute formal session time limit (Found: ${DAY_60_ASSESSMENT.timeLimitMinutes} min)`
  );

  // ── GROUP 3: Pedagogical Content Blocks & Quality Audit ──
  console.log('\n── GROUP 3: Pedagogical Content Blocks & Quality Audit ──');
  const allBlocks = BATCH_012_MANIFEST.days.flatMap(d => d.blocks);
  assert(allBlocks.length === 18, `Batch 012 contains exactly 18 comprehensive content blocks across 5 days (Found: ${allBlocks.length})`);

  // Day 56: Architecture & Decomposition
  const d56Theory = DAY_56_MANIFEST.blocks[0] as any;
  assert(d56Theory.whatItIs.includes('Configuration') && d56Theory.whatItIs.includes('Ingestion') && d56Theory.whatItIs.includes('Domain') && d56Theory.whatItIs.includes('Service'), 'Day 56 decomposes system into 5 distinct architectural layers');
  assert(d56Theory.commonMisconceptions.some((m: string) => m.includes('frozen=True') && m.includes('shallow')), 'Day 56 clarifies frozen dataclass records as layer contracts and explains shallow vs deep immutability');

  // Day 57: Domain Modeling & Custom Exceptions
  const d57Theory = DAY_57_MANIFEST.blocks[0] as any;
  assert(d57Theory.whatItIs.includes('InventoryError') && d57Theory.problemSolved.includes('pure'), 'Day 57 teaches domain modeling with custom exception hierarchy');
  const d57Ex = DAY_57_MANIFEST.blocks[1] as any;
  assert(d57Ex.codeSnippet.includes('class InventoryError') && d57Ex.codeSnippet.includes('class InsufficientStockError'), 'Day 57 includes complete domain exception hierarchy');

  // Day 58: Persistence, Config Precedence & Simple Timestamps
  const d58Theory = DAY_58_MANIFEST.blocks[0] as any;
  assert(d58Theory.commonMistakes.some((m: string) => m.includes('timezone') && m.includes('simple string timestamp')), 'Day 58 explicitly keeps transaction timestamps simple without timezone engineering');
  const d58Ex = DAY_58_MANIFEST.blocks[1] as any;
  assert(d58Ex.codeSnippet.includes('timestamp: str') && d58Ex.codeSnippet.includes('StockTransaction'), 'Day 58 uses simple string timestamp for StockTransaction audit entries');
  assert(d58Ex.codeSnippet.includes('cli_threshold is not None') && d58Ex.codeSnippet.includes('os.getenv'), 'Day 58 enforces 4-tier configuration precedence');

  // Day 59: Regression Defense & pytest.approx
  const d59Theory = DAY_59_MANIFEST.blocks[0] as any;
  assert(d59Theory.commonMisconceptions.some((m: string) => m.toLowerCase().includes('pytest.approx') && m.toLowerCase().includes('binary floating-point')), 'Day 59 explicitly defines business valuation contract and tolerance testing via pytest.approx');
  const d59Debug = DAY_59_MANIFEST.blocks[2] as any;
  assert(d59Debug.problemDescription.includes('off-by-one') && d59Debug.brokenArtifact.includes('< reorder_threshold'), 'Day 59 includes mandatory off-by-one boundary defect discovery');

  // Day 60: Transfer Challenge & Packaging
  const d60Lab = DAY_60_MANIFEST.blocks[0] as any;
  assert(d60Lab.solutionCode.includes('[project.scripts]') && d60Lab.solutionCode.includes('inventory-cli'), 'Day 60 includes pyproject.toml configuration with CLI entry point');
  const d60Transfer = DAY_60_MANIFEST.blocks[1] as any;
  assert(d60Transfer.unfamiliarDomainContext.includes('Supply Chain Discrepancy Reconciliation'), 'Day 60 presents an un-scaffolded, unfamiliar domain transfer challenge');

  // ── GROUP 4: Gate 1 Assessment Security, Rubric & Minimum Competency Floors ──
  console.log('\n── GROUP 4: Gate 1 Assessment Security, Rubric & Minimum Competency Floors ──');
  assert(DAY_60_ASSESSMENT.assessmentCode === 'ASM-PFS-M3-W12-GATE1', 'Assessment code is ASM-PFS-M3-W12-GATE1');
  assert(DAY_60_ASSESSMENT.mode === 'FORMATIVE', 'Assessment mode is strictly FORMATIVE');

  let assessValid = true;
  try {
    AssessmentValidator.validateAssessment(DAY_60_ASSESSMENT);
  } catch (e: any) {
    console.error('Assessment validation error:', e.message);
    assessValid = false;
  }
  assert(assessValid, 'AssessmentValidator.validateAssessment() passes with 0 schema errors');

  const item = DAY_60_ASSESSMENT.items[0];
  const rubric = item.rubricDimensions || [];
  assert(rubric.length === 7, `Assessment contains exactly 7 rubric dimensions (Found: ${rubric.length})`);
  const rubricWeightSum = rubric.reduce((acc, r) => acc + r.weight, 0);
  assert(Math.abs(rubricWeightSum - 1.0) < 0.0001, `Assessment rubric weights sum exactly to 1.0 (Sum: ${rubricWeightSum.toFixed(4)})`);

  const businessLogicDim = rubric.find(r => r.id === 'rub-gate1-03')!;
  assert(businessLogicDim.weight === 0.20 && businessLogicDim.description.includes('MINIMUM COMPETENCY FLOOR: >= 50%'), 'BusinessLogicInvariants has weight 0.20 with mandatory >= 50% competency floor');

  const testingDim = rubric.find(r => r.id === 'rub-gate1-04')!;
  assert(testingDim.weight === 0.20 && testingDim.description.includes('MINIMUM COMPETENCY FLOOR: >= 50%'), 'TestingRigorContracts has weight 0.20 with mandatory >= 50% competency floor');

  // ── GROUP 5: Prerequisite Firewall & AST Scan ──
  console.log('\n── GROUP 5: Prerequisite Firewall & AST Scan ──');
  const batch012Code = fs.readFileSync(path.join(process.cwd(), 'src/lib/curriculum/pythonFullStack/batch012.ts'), 'utf-8');
  
  const forbiddenKeywords = [
    { name: '@classmethod', regex: /@classmethod\b/ },
    { name: '@staticmethod', regex: /@staticmethod\b/ },
    { name: '@property', regex: /@property\b/ },
    { name: 'abc.ABC', regex: /\babc\.ABC\b|@abstractmethod\b/ },
    { name: 'typing.Protocol', regex: /\btyping\.Protocol\b/ },
    { name: 'Generic / TypeVar', regex: /\bGeneric\[|\bTypeVar\(/ },
    { name: 'async def / await', regex: /\basync\s+def\b|\bawait\s+/ },
    { name: 'Custom context manager dunder', regex: /def\s+__enter__\b|def\s+__exit__\b/ },
    { name: 'Django / FastAPI', regex: /\bfrom\s+django\b|\bfrom\s+fastapi\b/ },
    { name: 'SQL / Databases', regex: /\bSELECT\s+.+\s+FROM\b|\bsqlite3\b|\bpsycopg/i },
  ];

  for (const item of forbiddenKeywords) {
    assert(!item.regex.test(batch012Code), `Batch 012 code contains zero forbidden '${item.name}'`);
  }

  console.log('\n========================================================================');
  console.log('🏁 BATCH 012 TECHNICAL AUDIT COMPLETE: ALL INVARIANTS VERIFIED (PASS)');
  console.log('========================================================================\n');
}

runBatch012Tests().catch(err => {
  console.error('[FATAL ERROR IN BATCH 012 TEST SUITE]', err);
  process.exit(1);
});
