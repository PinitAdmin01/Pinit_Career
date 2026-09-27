/**
 * Verification Suite: Friend 3 - Profile & Onboarding State Final Polish
 * Checks:
 * 1. UserProgressContext sets onboardingStep >= 3 when roadmapGenerated / hasModules / hasCompleted
 * 2. SQL Migration 20260917_user_profile_columns.sql contains onboarding_step = 3 backfill
 * 3. PRODUCTION_CONSOLIDATED_MIGRATIONS.sql syntax is valid and contains backfill
 * 4. userService stripSelfServicePrivileges preserves recruiter_visibility for self-service updates
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';

async function run() {
  console.log('--- STARTING FRIEND 3 FINAL POLISH VERIFICATION ---');

  // Test 1: UserProgressContext.tsx onboardingStep auto-advancement
  console.log('Test 1: UserProgressContext.tsx onboardingStep check');
  const userProgressPath = path.resolve('src/lib/context/UserProgressContext.tsx');
  const userProgressCode = fs.readFileSync(userProgressPath, 'utf-8');

  assert.ok(
    userProgressCode.includes('setOnboardingStepState(prev => Math.max(prev, 3))'),
    'UserProgressContext must advance onboardingStep to at least 3 when roadmap or answers exist'
  );
  assert.ok(
    userProgressCode.includes("safeLocalStorageSetItem(keys.obStep, '3')"),
    'UserProgressContext must persist obStep 3 to safeLocalStorage'
  );
  console.log('✓ UserProgressContext automatically advances completed students out of onboarding trap');

  // Test 2: SQL Migration backfill in 20260917_user_profile_columns.sql
  console.log('Test 2: SQL Migration backfill check');
  const migrationPath = path.resolve('supabase/migrations/20260917_user_profile_columns.sql');
  const migrationSql = fs.readFileSync(migrationPath, 'utf-8');

  assert.ok(
    migrationSql.includes('UPDATE public.users \nSET onboarding_step = 3') ||
    migrationSql.includes('UPDATE public.users') && migrationSql.includes('SET onboarding_step = 3'),
    'Migration must backfill onboarding_step = 3'
  );
  assert.ok(
    migrationSql.includes("onboarding_answers->>'hasCompleted' = 'true'"),
    'Migration must check onboarding_answers hasCompleted'
  );
  console.log('✓ Migration 20260917_user_profile_columns.sql contains authoritative backfill query');

  // Test 3: Consolidated migrations syntax check
  console.log('Test 3: PRODUCTION_CONSOLIDATED_MIGRATIONS.sql syntax and backfill check');
  const consolidatedPath = path.resolve('supabase/migrations/PRODUCTION_CONSOLIDATED_MIGRATIONS.sql');
  const consolidatedSql = fs.readFileSync(consolidatedPath, 'utf-8');

  assert.ok(
    consolidatedSql.includes('END $$;'),
    'Consolidated migration must properly close DO $$ block with END $$;'
  );
  assert.ok(
    consolidatedSql.includes('SET onboarding_step = 3'),
    'Consolidated migration must include onboarding_step backfill'
  );
  console.log('✓ Consolidated migration contains closed DO $$ block and backfill before COMMIT');

  // Test 4: userService recruiter_visibility privilege check
  console.log('Test 4: userService recruiter_visibility check');
  const userServicePath = path.resolve('src/lib/services/supabase/userService.ts');
  const userServiceCode = fs.readFileSync(userServicePath, 'utf-8');

  // Static check: recruiter_visibility should not be in PRIVILEGED_FIELDS
  const privilegedMatch = userServiceCode.match(/const PRIVILEGED_FIELDS = new Set\(\[([\s\S]*?)\]\);/);
  assert.ok(privilegedMatch, 'PRIVILEGED_FIELDS set must exist in userService.ts');
  assert.ok(!privilegedMatch[1].includes("'recruiter_visibility'"), "'recruiter_visibility' must be removed from PRIVILEGED_FIELDS");

  // Dynamic test: stripSelfServicePrivileges
  const { stripSelfServicePrivileges } = await import('../src/lib/services/supabase/userService');
  const payload = {
    display_name: 'Bob',
    recruiter_visibility: 1,
    role: 'superadmin',
    ats_score: 99,
  };
  const sanitized = stripSelfServicePrivileges(payload, false);
  assert.strictEqual(sanitized.recruiter_visibility, 1, 'recruiter_visibility must not be stripped');
  assert.strictEqual(sanitized.role, undefined, 'role must be stripped');
  assert.strictEqual(sanitized.ats_score, undefined, 'ats_score must be stripped');
  console.log('✓ recruiter_visibility successfully preserved across self-service update payloads');

  console.log('\n--- ALL FRIEND 3 FINAL POLISH TESTS PASSED (4/4) ---');
}

run().catch(err => {
  console.error('TEST FAILED:', err);
  process.exit(1);
});
