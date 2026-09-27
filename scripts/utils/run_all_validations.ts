/**
 * Master Validation Runner for PinIT Career OS
 * Executes all 13 forensic test suites and prints a consolidated scorecard.
 */

import { execSync } from 'child_process';
import path from 'path';

const testSuites = [
  { name: 'Student Pre-Flight Live Deployment Smoke', file: 'test_student_preflight_live_deployment.ts' },
  { name: 'Master 360° Brutal Multi-Persona Audit', file: 'test_brutal_360_forensic_suite.ts' },
  { name: 'Production Extensions & Offline Sync', file: 'test_production_extensions.ts' },
  { name: 'Phase 3 Enterprise & Verifiable Credentials', file: 'test_phase3_enterprise_ecosystem.ts' },
  { name: 'Phase 2 Compete & Collaborative Build', file: 'test_phase2_compete_ecosystem.ts' },
  { name: 'Fresh-Student Golden Lifecycle Journey', file: 'test_golden_student_journey.ts' },
  { name: 'Phase 1A Core Contracts & Bands', file: 'test_phase1a_contracts.ts' },
  { name: 'Master 360° Regression Sweep', file: 'test_master_regression_sweep.ts' },
  { name: 'Master All-Phases Forensic Matrix', file: 'test_master_all_phases.ts' },
  { name: '9-Month Accelerated Track Vertical Slice', file: 'test_phase1_9m_vertical_slice.ts' },
  { name: 'Adversarial Chaos & Stress Matrix', file: 'test_adversarial_stress_matrix.ts' },
  { name: 'UI Components & Radar Visualizers', file: 'test_ui_components.ts' },
  { name: 'Program Matrix & Roadmap Fuser', file: 'test_program_matrix_fuser.ts' },
  { name: 'Evidence & Mastery Evaluation Engine', file: 'test_evidence_mastery.ts' },
  { name: 'Pathway DAG Taxonomy Validator', file: 'test_pathway_validation.ts' },
  { name: 'Persistence & Universal API Bridge', file: 'test_persistence_api.ts' },
  { name: 'LLM Output Sanitizer & Streaming Security', file: 'test_sanitizer.ts' },
];

console.log('================================================================');
console.log('     PINIT CAREER OS — MASTER ALL-SUITES SYSTEM VALIDATION      ');
console.log('================================================================\n');

let totalPassedSuites = 0;
let totalFailedSuites = 0;
const results: Array<{ name: string; file: string; passed: boolean; durationMs: number }> = [];

const scriptsDir = __dirname;

for (const suite of testSuites) {
  const filePath = path.join(scriptsDir, suite.file);
  const start = Date.now();
  try {
    process.stdout.write(`⏳ Running [${suite.name}] ... `);
    execSync(`npx tsx "${filePath}"`, { stdio: 'pipe' });
    const durationMs = Date.now() - start;
    console.log(`✅ PASS (${durationMs}ms)`);
    totalPassedSuites++;
    results.push({ ...suite, passed: true, durationMs });
  } catch (err: any) {
    const durationMs = Date.now() - start;
    console.log(`❌ FAIL (${durationMs}ms)`);
    console.error(err.stdout ? err.stdout.toString() : err.message);
    totalFailedSuites++;
    results.push({ ...suite, passed: false, durationMs });
  }
}

console.log('\n================================================================');
console.log('                 CONSOLIDATED AUDIT SCORECARD                   ');
console.log('================================================================');
results.forEach((r, idx) => {
  const status = r.passed ? '✅ PASS' : '❌ FAIL';
  console.log(`  ${(idx + 1).toString().padStart(2, ' ')}. [${status}] ${r.name.padEnd(46, ' ')} (${r.durationMs}ms)`);
});
console.log('────────────────────────────────────────────────────────────────');
console.log(`  TOTAL SUITES TESTED : ${testSuites.length}`);
console.log(`  SUITES PASSED        : ${totalPassedSuites} / ${testSuites.length}`);
console.log(`  SUITES FAILED        : ${totalFailedSuites}`);
console.log('================================================================\n');

if (totalFailedSuites > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL SYSTEM CONTRACTS, ENGINES & SUITES 100% VALIDATED WITH ZERO ERRORS!\n');
}
