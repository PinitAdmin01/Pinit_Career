/**
 * Master Verification Suite for FRIEND 4: AI Engines, Evaluation Rubrics & Platform UI
 * Issues 082 – 107 (All 6 Sub-Batches)
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
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

// ── TASK 4.3: Binary 3D Asset Size & Draco Verification Assertion ──────────
console.log('▶️  VERIFYING 3D ASSET COMPRESSION (Task 4.1 & Task 4.3)');
const avatarDir = path.join(process.cwd(), 'public/avatar');
const glbFiles = fs.readdirSync(avatarDir).filter(f => f.endsWith('.glb'));

if (glbFiles.length < 32) {
  console.error(`❌ Binary Asset Failure: Expected at least 32 .glb models in public/avatar/, found ${glbFiles.length}`);
  process.exit(1);
}

const MAX_GLB_BYTES = 2.0 * 1024 * 1024; // 2.0 MB maximum threshold
let totalDirBytes = 0;
let assetFailed = false;

for (const file of glbFiles) {
  const filePath = path.join(avatarDir, file);
  const stat = fs.statSync(filePath);
  totalDirBytes += stat.size;
  const sizeMB = stat.size / (1024 * 1024);

  // Read header to verify Draco extension
  const buf = fs.readFileSync(filePath);
  const chunk0Len = buf.readUInt32LE(12);
  const jsonStr = buf.toString('utf8', 20, 20 + chunk0Len);
  const hasDraco = jsonStr.includes('KHR_draco_mesh_compression');

  if (stat.size > MAX_GLB_BYTES) {
    console.error(`  ❌ [FAIL] ${file} exceeds 2.0 MB: ${sizeMB.toFixed(2)} MB`);
    assetFailed = true;
  } else if (!hasDraco) {
    console.error(`  ❌ [FAIL] ${file} missing KHR_draco_mesh_compression`);
    assetFailed = true;
  } else {
    console.log(`  ✅ [PASS] ${file.padEnd(20)}: ${sizeMB.toFixed(2)} MB (Draco Verified)`);
  }
}

console.log(`\n📦 Total Avatar Assets: ${glbFiles.length} models, ${(totalDirBytes / (1024 * 1024)).toFixed(2)} MB`);

if (assetFailed) {
  console.error('\n❌ 3D Asset Size Assertion Failed: One or more models exceed 2.0 MB or lack Draco compression.');
  process.exit(1);
}
console.log('✨ 3D ASSET SIZE & DRACO VERIFICATION PASSED CLEANLY!\n');

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
