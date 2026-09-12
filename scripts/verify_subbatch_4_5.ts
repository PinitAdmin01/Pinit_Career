/**
 * Verification Suite for Sub-Batch 4.5: Leaderboard Legitimacy & Cohort Data (Issues 102 – 106)
 *
 * Checks:
 * 1. Defect 102: Purge BASELINE_COHORT and hardcoded fake cohort students
 * 2. Defect 103: Dynamic individual Dicebear initials avatar (no identical Unsplash URL)
 * 3. Defect 104: Verified skills count backed by verified mastery ledger, not raw skill_tags
 * 4. Defect 105: Defense score floor of 65 completely removed
 * 5. Defect 106: Pagination parameters (page, limit, range) and complete metadata payload
 */

import { GET as leaderboardGet } from '../src/app/api/leaderboard/route';
import * as fs from 'fs';
import * as path from 'path';

let passed = 0;
let failed = 0;

function assert(condition: boolean, msg: string) {
  if (condition) {
    console.log(`  ✅ PASS: ${msg}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${msg}`);
    failed++;
  }
}

async function runTests() {
  console.log('\n--- VERIFYING SUB-BATCH 4.5: Leaderboard Legitimacy & Cohort Data ---');

  const leaderboardSource = fs.readFileSync(
    path.join(process.cwd(), 'src/app/api/leaderboard/route.ts'),
    'utf-8'
  );

  // Test 1: Defect 102 - Purge BASELINE_COHORT
  console.log('\n[Test 1] Defect 102: Purge BASELINE_COHORT');
  assert(
    !leaderboardSource.includes('BASELINE_COHORT') &&
    !leaderboardSource.includes('student_dev_001') &&
    !leaderboardSource.includes('Sarah Chen (Cohort)'),
    'BASELINE_COHORT array and fake student records completely purged from route'
  );
  assert(
    !leaderboardSource.includes('supplementalCohort'),
    'No supplemental fake cohort merged into leaderboard results'
  );

  // Test 2: Defect 103 - Dynamic unique avatars
  console.log('\n[Test 2] Defect 103: Individual avatars via Dicebear initials');
  assert(
    !leaderboardSource.includes('images.unsplash.com/photo-1535713875002-d1d0cf377fde'),
    'Identical hardcoded Unsplash image completely purged from leaderboard mapping'
  );
  assert(
    leaderboardSource.includes('api.dicebear.com/7.x/initials/svg?seed='),
    'Leaderboard maps avatarUrl to dynamic Dicebear initials SVG seeded by display name'
  );

  // Test 3: Defect 104 - Verified skills from mastery ledger
  console.log('\n[Test 3] Defect 104: Verified skills from competency mastery ledger');
  assert(
    !leaderboardSource.includes('verifiedSkills = Array.isArray(p.skill_tags) ? p.skill_tags.length'),
    'Verified skills are no longer derived from unverified onboarding skill_tags array length'
  );
  assert(
    leaderboardSource.includes('competency_mastery') &&
    leaderboardSource.includes('VERIFIED_COMPETENCY'),
    'Leaderboard queries competency_mastery for VERIFIED_COMPETENCY status'
  );

  // Test 4: Defect 105 - Defense score floor of 65 purged
  console.log('\n[Test 4] Defect 105: Defense score floor of 65 eliminated');
  assert(
    !leaderboardSource.includes('Math.max(65,') && !leaderboardSource.includes('Math.max(65 ,'),
    'No artificial score floor of 65 applied to defense score'
  );
  assert(
    leaderboardSource.includes('Math.min(100, Math.max(0, Number(p.ats_score) || 0))') ||
    leaderboardSource.includes('Math.max(0, Number(p.ats_score) || 0)'),
    'Defense score honest 0-100 mapping preserved'
  );

  // Test 5: Defect 106 - Pagination and range query
  console.log('\n[Test 5] Defect 106: Pagination parameters & metadata');
  assert(
    leaderboardSource.includes("url.searchParams.get('page')") &&
    leaderboardSource.includes("url.searchParams.get('limit')"),
    'Leaderboard route reads page and limit query parameters'
  );
  assert(
    leaderboardSource.includes('.range(offset, offset + limit - 1)'),
    'Leaderboard applies Supabase .range() query for database-level pagination'
  );
  assert(
    leaderboardSource.includes('totalPages') && leaderboardSource.includes('totalCount'),
    'Leaderboard returns pagination metadata (totalPages, totalCount)'
  );

  // Test 6: Route invocation with pagination query
  console.log('\n[Test 6] Live Route Execution');
  const req = new Request('http://localhost:3000/api/leaderboard?page=1&limit=10', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer demo-token-bypass'
    }
  });
  const res = await leaderboardGet(req);
  const data = await res.json();

  assert(
    res.status === 200 && data.ok === true,
    'Leaderboard GET endpoint returns HTTP 200 with ok: true'
  );
  assert(
    typeof data.page === 'number' && data.page === 1,
    'Response includes page number matching query (1)'
  );
  assert(
    typeof data.limit === 'number' && data.limit === 10,
    'Response includes limit matching query (10)'
  );
  assert(
    typeof data.totalPages === 'number' && typeof data.totalCount === 'number',
    'Response contains totalPages and totalCount pagination metadata'
  );
  assert(
    Array.isArray(data.leaderboard),
    'Leaderboard data is an array'
  );
  // Verify no fake baseline cohort in results
  const hasFakeCohort = data.leaderboard.some((e: any) =>
    e.name?.includes('Cohort') || e.studentId?.startsWith('student_dev_')
  );
  assert(
    !hasFakeCohort,
    'Live leaderboard response contains 0 fake cohort students'
  );

  console.log(`\nSUB-BATCH 4.5 SUMMARY: ${passed} passed, ${failed} failed.`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Unhandled error in Sub-Batch 4.5 verification:', err);
  process.exit(1);
});
