// scripts/run_friend2_all.js
// Master test runner for Friend 2: Economy, Financial Ledger, Pins & Concurrency (Issues 028 to 054)

const { spawnSync } = require('child_process');
const path = require('path');

const suites = [
  { name: 'Sub-Batch 2.1 (Issues 028-032: Atomic Pins & Locks)', file: 'scripts/test_subbatch_2_1.ts' },
  { name: 'Sub-Batch 2.2 (Issues 033-037: Time Integrity & Scholarships)', file: 'scripts/test_subbatch_2_2.ts' },
  { name: 'Sub-Batch 2.3 (Issues 038-042: Payment Gateways & Webhooks)', file: 'scripts/test_subbatch_2_3.ts' },
  { name: 'Sub-Batch 2.4 (Issues 043-047: Feature Unlocks & Grace)', file: 'scripts/test_subbatch_2_4.ts' },
  { name: 'Sub-Batch 2.5 (Issues 048-052: XP Progression & Scoring)', file: 'scripts/test_subbatch_2_5.ts' },
  { name: 'Sub-Batch 2.6 (Issues 053-054: Store Sync & Realtime)', file: 'scripts/test_subbatch_2_6.ts' },
  { name: 'Dual-Router Parity (Task 2.1: LIVE_API_PREFIXES Parity Linter)', file: 'scripts/verify_api_parity.ts' },
  { name: 'Blueprint 10/10 (Tasks 2.1-2.3: Cryptographic Receipts, 45s Fail-Closed Locks, Daily XP Cap)', file: 'scripts/test_friend2_blueprint.ts' },
];

console.log('========================================================================');
console.log('🚀 RUNNING ALL FRIEND 2 VERIFICATION TEST SUITES (ISSUES 028 - 054)');
console.log('========================================================================\n');

let allPassed = true;
const results = [];

for (const suite of suites) {
  console.log(`\n▶ Starting ${suite.name}...`);
  const result = spawnSync('npx.cmd', ['tsx', suite.file], {
    stdio: 'inherit',
    cwd: process.cwd(),
    shell: true,
    env: { ...process.env, ALLOW_DEV_AUTH_BYPASS: 'true' },
  });

  if (result.status === 0) {
    results.push({ name: suite.name, status: 'PASSED' });
  } else {
    results.push({ name: suite.name, status: 'FAILED' });
    allPassed = false;
  }
}

console.log('\n========================================================================');
console.log('📊 FRIEND 2 MASTER TEST SCORECARD');
console.log('========================================================================');
for (const r of results) {
  const icon = r.status === 'PASSED' ? '✅' : '❌';
  console.log(`  ${icon} ${r.status.padEnd(8)}: ${r.name}`);
}
console.log('========================================================================');

if (!allPassed) {
  console.error('\n❌ One or more Friend 2 test suites failed.');
  process.exit(1);
} else {
  console.log('\n🎉 ALL FRIEND 2 TEST SUITES PASSED (100% GREEN)!');
  process.exit(0);
}
