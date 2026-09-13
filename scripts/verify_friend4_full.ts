/**
 * Master Verification Suite for FRIEND 4: AI Engines, Evaluation Rubrics & Platform UI
 * Issues 082 – 107 (All 6 Sub-Batches)
 */

import { execSync } from 'child_process';
import * as path from 'path';

const suites = [
  { id: '4.1', name: 'Speech-to-Text & Audio Fallback (Issues 082 - 086)', script: 'scripts/verify_subbatch_4_1.ts' },
  { id: '4.2', name: 'Interview Evaluation & Socratic Grading (Issues 087 - 091)', script: 'scripts/verify_subbatch_4_2.ts' },
  { id: '4.3', name: 'Practical Verification & Anti-Cheat Logic (Issues 092 - 096)', script: 'scripts/verify_subbatch_4_3.ts' },
  { id: '4.4', name: 'Career Twin & Real Data Simulation (Issues 097 - 101)', script: 'scripts/verify_subbatch_4_4.ts' },
  { id: '4.5', name: 'Leaderboard Legitimacy & Cohort Data (Issues 102 - 106)', script: 'scripts/verify_subbatch_4_5.ts' },
  { id: '4.6', name: 'Global Context Decomposition (Issue 107)', script: 'scripts/verify_subbatch_4_6.ts' },
];

console.log('========================================================================');
console.log('🤖 MASTER VERIFICATION: FRIEND 4 (ISSUES 082 – 107)');
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
      env: {
        ...process.env,
        ALLOW_DEV_AUTH_BYPASS: 'true',
        NODE_ENV: 'test',
      },
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
console.log(`🏁 FRIEND 4 MASTER VERIFICATION RESULTS: ${totalPassedSuites}/${suites.length} SUITES PASSED`);
console.log('========================================================================');

if (totalFailedSuites > 0) {
  process.exit(1);
} else {
  console.log('\n🎉 ALL 26 DEFECTS (082 – 107) ARE FULLY REMEDIATED & VERIFIED GREEN!\n');
}
