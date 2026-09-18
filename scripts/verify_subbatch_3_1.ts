import * as fs from 'fs';
import * as path from 'path';
import { mapRowToProfile } from '../src/lib/supabaseService';

async function runSubBatch31Verification() {
  console.log('========================================================================');
  console.log('🧪 VERIFICATION SUITE: SUB-BATCH 3.1 (DEF-055 to DEF-059)');
  console.log('========================================================================\n');

  let passed = 0;
  let total = 5;

  const projectRoot = 'c:/Users/vinay/Desktop/project working/Present-Career-os';

  // ─── Test 1: DEF-055 (Leaderboard Route canonical users table query) ────────
  try {
    const filePath = path.join(projectRoot, 'src/app/api/leaderboard/route.ts');
    const content = fs.readFileSync(filePath, 'utf-8');
    
    const queriesUsers = content.includes(".from('users')");
    const queriesProfiles = content.includes(".from('profiles')");
    const selectsKeyColumns = content.includes('ats_score') && content.includes('trust_score') && content.includes('xp_total');

    if (queriesUsers && !queriesProfiles && selectsKeyColumns) {
      console.log('✅ DEF-055 PASS: Leaderboard queries canonical `users` table instead of `profiles`.');
      passed++;
    } else {
      console.error('❌ DEF-055 FAIL: Leaderboard table alignment incomplete.', { queriesUsers, queriesProfiles, selectsKeyColumns });
    }
  } catch (err: any) {
    console.error('❌ DEF-055 ERROR:', err.message);
  }

  // ─── Test 2: DEF-056 (Career Twin Results canonical users table query) ──────
  try {
    const filePath = path.join(projectRoot, 'src/app/api/career-twin/results/route.ts');
    const content = fs.readFileSync(filePath, 'utf-8');

    const queriesUsers = content.includes(".from('users')");
    const queriesProfiles = content.includes(".from('profiles')");
    const matches = content.match(/\.from\('users'\)/g);

    if (queriesUsers && !queriesProfiles && matches && matches.length >= 2) {
      console.log('✅ DEF-056 PASS: Career Twin results route queries canonical `users` table in GET and POST.');
      passed++;
    } else {
      console.error('❌ DEF-056 FAIL: Career Twin table alignment incomplete.', { queriesUsers, queriesProfiles, matchCount: matches?.length });
    }
  } catch (err: any) {
    console.error('❌ DEF-056 ERROR:', err.message);
  }

  // ─── Test 3: DEF-057 (Admin Service Database Alignment) ───────────────────
  try {
    const filePath = path.join(projectRoot, 'src/lib/services/adminService.ts');
    const content = fs.readFileSync(filePath, 'utf-8');

    const queriesProfiles = content.includes("'profiles'");
    const queriesUsers = content.includes("'users'");
    const checksDashboard = content.includes("checkSupabaseAvailable('users')");
    const checksUsersTable = content.includes("supabase.from('users')");

    if (!queriesProfiles && queriesUsers && checksDashboard && checksUsersTable) {
      console.log('✅ DEF-057 PASS: adminService methods query canonical `users` table across all endpoints.');
      passed++;
    } else {
      console.error('❌ DEF-057 FAIL: adminService contains lingering `profiles` references.', { queriesProfiles, queriesUsers });
    }
  } catch (err: any) {
    console.error('❌ DEF-057 ERROR:', err.message);
  }

  // ─── Test 4: DEF-058 (Portfolio Endorsement Persistence) ───────────────────
  try {
    const filePath = path.join(projectRoot, 'src/app/api/portfolio/verify-endorsement/route.ts');
    const content = fs.readFileSync(filePath, 'utf-8');

    const persistsVault = content.includes(".from('vault_items')") && content.includes(".update({") && content.includes("verified: isVerified");
    const persistsUserAnswers = content.includes(".from('users')") && content.includes("portfolio_projects") && content.includes("onboarding_answers: ob");
    const checksAdminAuth = content.includes("requireFacultyOrAdminUserFromRequest");

    if (persistsVault && persistsUserAnswers && checksAdminAuth) {
      console.log('✅ DEF-058 PASS: Portfolio endorsement persists to `vault_items` and `users.onboarding_answers` with role checks.');
      passed++;
    } else {
      console.error('❌ DEF-058 FAIL: Portfolio endorsement persistence incomplete.', { persistsVault, persistsUserAnswers, checksAdminAuth });
    }
  } catch (err: any) {
    console.error('❌ DEF-058 ERROR:', err.message);
  }

  // ─── Test 5: DEF-059 (Soft-Skill Baseline Calibration) ─────────────────────
  try {
    // 1. Fresh row with unassessed soft skills -> must return null
    const unassessedRow = {
      id: 'student_123',
      display_name: 'Test Student',
      role: 'student'
    };
    const profile1 = mapRowToProfile(unassessedRow);

    const isNullWhenUnset =
      profile1.communication_score === null &&
      profile1.execution_score === null &&
      profile1.leadership_score === null &&
      profile1.consistency_score === null &&
      profile1.adaptability_score === null &&
      profile1.confidence_score === null &&
      profile1.innovation_score === null;

    // 2. Evaluated row with actual scores -> must preserve real values
    const evaluatedRow = {
      id: 'student_456',
      display_name: 'Evaluated Student',
      role: 'student',
      communication_score: 82,
      execution_score: 77,
      leadership_score: 65,
      consistency_score: 90,
      adaptability_score: 80,
      confidence_score: 85,
      innovation_score: 72
    };
    const profile2 = mapRowToProfile(evaluatedRow);

    const preservesEvaluated =
      profile2.communication_score === 82 &&
      profile2.execution_score === 77 &&
      profile2.leadership_score === 65 &&
      profile2.consistency_score === 90 &&
      profile2.adaptability_score === 80 &&
      profile2.confidence_score === 85 &&
      profile2.innovation_score === 72;

    if (isNullWhenUnset && preservesEvaluated) {
      console.log('✅ DEF-059 PASS: Soft-skill calibration returns null for unassessed metrics and preserves evaluated scores.');
      passed++;
    } else {
      console.error('❌ DEF-059 FAIL: Soft-skill calibration incorrect.', { isNullWhenUnset, preservesEvaluated, profile1Scores: { comm: profile1.communication_score, exec: profile1.execution_score } });
    }
  } catch (err: any) {
    console.error('❌ DEF-059 ERROR:', err.message);
  }

  console.log('\n========================================================================');
  console.log(`SUB-BATCH 3.1 RESULT: ${passed}/${total} TESTS PASSED (${Math.round((passed / total) * 100)}%)`);
  console.log('========================================================================');

  if (passed !== total) {
    process.exit(1);
  }
}

runSubBatch31Verification().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
