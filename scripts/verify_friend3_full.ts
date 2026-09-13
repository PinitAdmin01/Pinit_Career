/**
 * Master Verification Suite for FRIEND 3: Storage Authority & Data Architecture
 * Issues 055 – 081 (All 6 Sub-Batches)
 */

import { execSync } from 'child_process';
import * as path from 'path';

const suites = [
  { id: '3.1', name: 'Table Alignment (profiles vs users) (Issues 055 - 059)', script: 'scripts/verify_subbatch_3_1.ts' },
  { id: '3.2', name: 'LocalStorage Decoupling & Server-First State (Issues 060 - 064)', script: 'scripts/verify_subbatch_3_2.ts' },
  { id: '3.3', name: 'Competency Evidence & Cryptographic Ledger (Issues 065 - 069)', script: 'scripts/verify_subbatch_3_3.ts' },
  { id: '3.4', name: 'Multi-Tab Race & Cross-User Pollution (Issues 070 - 074)', script: 'scripts/verify_subbatch_3_4.ts' },
  { id: '3.5', name: 'Database Query Scale (N+1 & OOM Elimination) (Issues 075 - 079)', script: 'scripts/verify_subbatch_3_5.ts' },
  { id: '3.6', name: 'Campus KV Isolation & Exam Cooldown (Issues 080 - 081)', script: 'scripts/verify_subbatch_3_6.ts' },
];

console.log('========================================================================');
console.log('🗄️  MASTER VERIFICATION: FRIEND 3 (ISSUES 055 – 081)');
console.log('========================================================================\n');

let totalPassedSuites = 0;
let totalFailedSuites = 0;

for (const suite of suites) {
  console.log(`\n▶️  RUNNING SUB-BATCH ${suite.id}: ${suite.name}`);
  const scriptPath = path.join(process.cwd(), suite.script);
  try {
    const output = execSync(`npx tsx "${scriptPath}"`, {
      cwd: process.cwd(),
      encoding: 'utf-8',
      stdio: 'pipe',
      timeout: 120000,
    });
    console.log(output.trim());
    console.log(`\n✨ SUB-BATCH ${suite.id} PASSED CLEANLY!`);
    totalPassedSuites++;
  } catch (err: any) {
    console.error(`\n❌ SUB-BATCH ${suite.id} FAILED: ${err.message}`);
    if (err.stdout) console.log(err.stdout.toString());
    if (err.stderr) console.error(err.stderr.toString());
    totalFailedSuites++;
  }
}

console.log('\n========================================================================');
console.log(`🏁 FRIEND 3 MASTER VERIFICATION RESULTS: ${totalPassedSuites}/${suites.length} SUITES PASSED`);
console.log('========================================================================');

if (totalFailedSuites > 0) {
  process.exit(1);
} else {
  console.log('\n🎉 ALL 27 DEFECTS (055 – 081) ARE FULLY REMEDIATED & VERIFIED GREEN!\n');
}
