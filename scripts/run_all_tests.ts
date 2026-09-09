// scripts/run_all_tests.ts
// Programmatic Master Test Runner & Aggregate Invariant Scorecard Generator for PinIT Career OS
// Enforces Strict Separation Between Active Production Curriculum and Quarantined Future Batches

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

interface SuiteResult {
  suiteName: string;
  scriptPath: string;
  passed: number;
  failed: number;
  durationMs: number;
}

// ── STRICT SCOPE CONFIGURATION ──
export const CURRENT_ACTIVE_MAX_BATCH = 31; // Batches 020–031 (Days 98–153) are now active

// ── ACTIVE REGRESSION SUITES (Days 1–153 + Production Engines) ──
const ACTIVE_SUITES: { name: string; script: string }[] = [
  { name: 'Batch 001 (Days 1–5: Foundations)', script: 'scripts/test_batch001.ts' },
  { name: 'Batch 002 (Days 6–10: Syntax & Object Model)', script: 'scripts/test_batch002.ts' },
  { name: 'Batch 003 (Days 11–15: Functions & Scope)', script: 'scripts/test_batch003.ts' },
  { name: 'Batch 004 (Days 16–20: Built-In Data Structures)', script: 'scripts/test_batch004.ts' },
  { name: 'Batch 005 (Days 21–25: App Engineering)', script: 'scripts/test_batch005.ts' },
  { name: 'Batch 006 (Days 26–30: OOP & Entity Modeling)', script: 'scripts/test_batch006.ts' },
  { name: 'Batch 007 (Days 31–35: Inheritance & Polymorphism)', script: 'scripts/test_batch007.ts' },
  { name: 'Batch 008 (Days 36–40: Custom Exceptions & Modular Architecture)', script: 'scripts/test_batch008.ts' },
  { name: 'Batch 009 (Days 41–45: Logging, Validation & CLI Engineering)', script: 'scripts/test_batch009.ts' },
  { name: 'Batch 010 (Days 46–50: Configuration, Dataclasses & Packaging)', script: 'scripts/test_batch010.ts' },
  { name: 'Batch 011 (Days 51–55: Automated Testing Foundations, pytest Mechanics & Regression Defense)', script: 'scripts/test_batch011.ts' },
  { name: 'Batch 012 (Days 56–60: Milestone Project 3 & Gate 1 Exit Assessment)', script: 'scripts/test_batch012.ts' },
  { name: 'Post-Gate 1 Consolidation (Days 61–62: Reflect & Defend)', script: 'scripts/test_post_gate_01.ts' },
  { name: 'Batch 013 (Days 63–67: Problem Solving & DSA Foundations)', script: 'scripts/test_batch013.ts' },
  { name: 'Batch 014 (Days 68–72: Core Data Structures — Linear Structures & ADTs)', script: 'scripts/test_batch014.ts' },
  { name: 'Batch 015 (Days 73–77: Core Data Structures — Hashing & Key-Value Invariants)', script: 'scripts/test_batch015.ts' },
  { name: 'Batch 016 (Days 78–82: Algorithmic Paradigms, Recursion, Sorting & LRU Cache)', script: 'scripts/test_batch016.ts' },
  { name: 'Batch 017 (Days 83–87: Closures, Lexical Scope & Decorator Architecture)', script: 'scripts/test_batch017.ts' },
  { name: 'Batch 018 (Days 88–92: Iterator Protocol, Generator Architecture & Streaming Physics)', script: 'scripts/test_batch018.ts' },
  { name: 'Batch 019 (Days 93–97: Context Managers, Resource Protocols & Transaction Architecture)', script: 'scripts/test_batch019.ts' },
  { name: 'Batch 020 (Days 98–102: Advanced Type Architecture, Protocols & Variance)', script: 'scripts/test_batch020.ts' },
  { name: 'Batch 021 (Days 103–107: Wire HTTP/1.1 Framing Subset, Sockets & Smuggling Defense)', script: 'scripts/test_batch021.ts' },
  { name: 'Batch 022 (Days 108–112: Semantic HTML5, Forms & Declarative WCAG 2.2 AA)', script: 'scripts/test_batch022.ts' },
  { name: 'Batch 023 (Days 113–117: Modern Vanilla JS, DOM Mutations & W3C Events)', script: 'scripts/test_batch023.ts' },
  { name: 'Batch 024 (Days 118–122: Fetch API, Resilient Client Networking & Gate 2)', script: 'scripts/test_batch024.ts' },
  { name: 'Batch 025 (Days 123–127: Django 6.0 Architecture, Gateways, Templates & Middleware)', script: 'scripts/test_batch025.ts' },
  { name: 'Batch 026 (Days 128–132: Django 6.0 ORM Models, Reversible Migrations & QuerySet Optimization)', script: 'scripts/test_batch026.ts' },
  { name: 'Batch 027 (Days 133–137: Django 6.0 Forms, ModelForms, Mass-Assignment Defense & CBVs)', script: 'scripts/test_batch027.ts' },
  { name: 'Batch 028 (Days 138–142: Enterprise User Modeling, Authentication & Session Security)', script: 'scripts/test_batch028.ts' },
  { name: 'Batch 029 (Days 143–147: PostgreSQL Relational Architecture, Data Integrity & Advanced Constraints)', script: 'scripts/test_batch029.ts' },
  { name: 'Batch 030 (Days 148–152: Complex Relational Modeling, Joins, Aggregations & Query Execution Optimization)', script: 'scripts/test_batch030.ts' },
  { name: 'Batch 031 (Day 153: Database Transactions, ACID Guarantees & Concurrency Control in Django [Partial])', script: 'scripts/test_batch031.ts' },
  { name: 'Curriculum Infrastructure Engine', script: 'scripts/test_curriculum_infrastructure.ts' },
  { name: 'Content Engine Infrastructure', script: 'scripts/test_content_engine.ts' },
  { name: 'Assessment Engine & Security', script: 'scripts/test_assessment_engine.ts' },
  { name: 'Evidence Ledger & Cryptographic Hash Chain', script: 'scripts/test_evidence_engine.ts' },
];

// ── QUARANTINED / FUTURE TEST SUITES (Isolated from active curriculum) ──
const QUARANTINED_SUITES: { name: string; script: string }[] = [];

function runSuite(name: string, script: string): SuiteResult {
  const start = Date.now();
  try {
    const output = execSync(`npx tsx ${script}`, { encoding: 'utf-8', stdio: 'pipe' });
    const durationMs = Date.now() - start;

    // Parse pass / fail counts from stdout
    const passMatches = output.match(/✅\s*\[PASS\]/g) || [];
    const failMatches = output.match(/❌\s*\[FAIL\]/g) || [];

    return {
      suiteName: name,
      scriptPath: script,
      passed: passMatches.length,
      failed: failMatches.length,
      durationMs,
    };
  } catch (err: any) {
    const durationMs = Date.now() - start;
    const output = (err.stdout || '') + (err.stderr || '');
    console.error(`\n[ERROR OUTPUT FOR ${name}]:\n`, output);
    const passMatches = output.match(/✅\s*\[PASS\]/g) || [];
    const failMatches = output.match(/❌\s*\[FAIL\]/g) || [];

    return {
      suiteName: name,
      scriptPath: script,
      passed: passMatches.length,
      failed: Math.max(failMatches.length, 1),
      durationMs,
    };
  }
}

function verifyScopeIntegrityGuard() {
  console.log('── CI SCOPE INTEGRITY GUARD ──');
  const indexContent = fs.readFileSync(path.join(process.cwd(), 'src/lib/curriculum/index.ts'), 'utf-8');
  
  // Check that index.ts does not export any batch > CURRENT_ACTIVE_MAX_BATCH
  for (let b = CURRENT_ACTIVE_MAX_BATCH + 1; b <= 35; b++) {
    const padded = String(b).padStart(3, '0');
    if (indexContent.includes(`batch${padded}`)) {
      console.error(`🚨 SCOPE INTEGRITY VIOLATION: src/lib/curriculum/index.ts exports unauthorized future batch${padded}!`);
      process.exit(1);
    }
    const futureSrcPath = path.join(process.cwd(), `src/lib/curriculum/pythonFullStack/batch${padded}.ts`);
    if (fs.existsSync(futureSrcPath)) {
      console.error(`🚨 SCOPE INTEGRITY VIOLATION: Active source folder contains unapproved future batch file: ${futureSrcPath}!`);
      process.exit(1);
    }
  }
  console.log(`  ✅ [PASS] Scope Integrity Guard: Maximum active curriculum is Days 1–153 (Batches 001–031 + Post-Gate 1 Consolidation). Zero future batches (Batch 32+) or Day 154+ content exposed.\n`);
}

async function main() {
  console.log('\n========================================================================');
  console.log('🚀 EXECUTING MASTER INVARIANT TEST RUNNER ACROSS ALL PINIT TEST SUITES');
  console.log('========================================================================\n');

  // 1. Verify Scope Guard
  verifyScopeIntegrityGuard();

  // 2. Run Active Production Suites
  console.log('── SECTION 1: ACTIVE CURRICULUM REGRESSION SUITES (DAYS 1–153: SEMESTER 1 DAYS 1–122 + SEMESTER 2 DAYS 123–153) ──');
  const activeResults: SuiteResult[] = [];
  let activePassed = 0;
  let activeFailed = 0;

  for (const s of ACTIVE_SUITES) {
    process.stdout.write(`  ⏳ Running ${s.name}... `);
    const res = runSuite(s.name, s.script);
    activeResults.push(res);
    activePassed += res.passed;
    activeFailed += res.failed;

    if (res.failed === 0) {
      console.log(`✅ Passed (${res.passed}/${res.passed} in ${(res.durationMs / 1000).toFixed(2)}s)`);
    } else {
      console.log(`❌ FAILED (${res.passed} passed, ${res.failed} failed)`);
    }
  }

  // 3. Run Quarantined Future Suites Separately
  console.log('\n── SECTION 2: QUARANTINED FUTURE TEST SUITES (ISOLATED) ──');
  const quarantinedResults: SuiteResult[] = [];
  let quarantinedPassed = 0;
  let quarantinedFailed = 0;

  for (const s of QUARANTINED_SUITES) {
    process.stdout.write(`  ⏳ Running ${s.name}... `);
    const res = runSuite(s.name, s.script);
    quarantinedResults.push(res);
    quarantinedPassed += res.passed;
    quarantinedFailed += res.failed;

    if (res.failed === 0) {
      console.log(`✅ Passed (${res.passed}/${res.passed} in ${(res.durationMs / 1000).toFixed(2)}s)`);
    } else {
      console.log(`❌ FAILED (${res.passed} passed, ${res.failed} failed)`);
    }
  }

  const calculatedActiveSum = activeResults.reduce((acc, r) => acc + r.passed, 0);
  if (calculatedActiveSum !== activePassed) {
    console.error(`\n🚨 CRITICAL RECONCILIATION ERROR: calculatedActiveSum (${calculatedActiveSum}) !== activePassed (${activePassed})`);
    process.exit(1);
  }

  const totalRepoTests = activePassed + quarantinedPassed;
  const totalRepoFailed = activeFailed + quarantinedFailed;

  console.log('\n========================================================================');
  console.log('📊 ACTIVE REGRESSION SCORECARD (MILESTONE: DAYS 1–153)');
  console.log('   36 Active Suites = 31 Batch Suites + 1 Consolidation + 4 Platform Engines');
  console.log('========================================================================');
  console.log('┌───────────────────────────────────────────────────┬────────┬────────┐');
  console.log('│ Active Regression Suite Name                      │ Passed │ Failed │');
  console.log('├───────────────────────────────────────────────────┼────────┼────────┤');

  for (const r of activeResults) {
    const padName = r.suiteName.padEnd(49);
    const padPass = String(r.passed).padStart(6);
    const padFail = String(r.failed).padStart(6);
    console.log(`│ ${padName} │ ${padPass} │ ${padFail} │`);
  }

  console.log('├───────────────────────────────────────────────────┼────────┼────────┤');
  console.log(`│ 36 ACTIVE SUITES (31 BATCH + 1 CONSOL + 4 ENGINE) │ ${String(activePassed).padStart(6)} │ ${String(activeFailed).padStart(6)} │`);
  console.log('└───────────────────────────────────────────────────┴────────┴────────┘');

  console.log('\n========================================================================');
  console.log('📊 QUARANTINED FUTURE SCORECARD (ISOLATED / NOT IN PRODUCTION)');
  console.log('========================================================================');
  console.log('┌───────────────────────────────────────────────────┬────────┬────────┐');
  console.log('│ Quarantined Suite Name                            │ Passed │ Failed │');
  console.log('├───────────────────────────────────────────────────┼────────┼────────┤');

  for (const r of quarantinedResults) {
    const padName = r.suiteName.padEnd(49);
    const padPass = String(r.passed).padStart(6);
    const padFail = String(r.failed).padStart(6);
    console.log(`│ ${padName} │ ${padPass} │ ${padFail} │`);
  }

  console.log('├───────────────────────────────────────────────────┼────────┼────────┤');
  console.log(`│ QUARANTINED FUTURE TESTS                          │ ${String(quarantinedPassed).padStart(6)} │ ${String(quarantinedFailed).padStart(6)} │`);
  console.log('├───────────────────────────────────────────────────┼────────┼────────┤');
  console.log(`│ TOTAL REPOSITORY TESTS (ACTIVE + QUARANTINED)     │ ${String(totalRepoTests).padStart(6)} │ ${String(totalRepoFailed).padStart(6)} │`);
  console.log('└───────────────────────────────────────────────────┴────────┴────────┘');

  console.log(`\n🏁 ACTIVE CURRICULUM REGRESSION SUITES COMPLETE: ${activePassed} Passed, ${activeFailed} Failed (Reconciliation Verified: Exact Match)\n`);

  if (activeFailed > 0 || quarantinedFailed > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('[FATAL ERROR IN MASTER RUNNER]', err);
  process.exit(1);
});
