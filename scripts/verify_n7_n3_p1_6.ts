/**
 * Verification Suite: Friend 3 - Database Migrations & Profile Integrity (N7, N3, P1-6)
 *
 * Checks:
 * 1. SQL Migration for Missing Columns: supabase/migrations/20260917_user_profile_columns.sql
 * 2. userService directFields includes 'completed_missions' and updateUserProfile error logging
 * 3. student/activity route uses authoritative user client, isolates from admin_audit_log and adminDataAccess
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';

process.env.ALLOW_DEV_AUTH_BYPASS = 'true';
process.env.NODE_ENV = 'test';

async function run() {
  console.log('--- STARTING N7, N3, P1-6 VERIFICATION ---');

  // 1. SQL Migration Verification
  console.log('Test 1: SQL Migration Verification (20260917_user_profile_columns.sql)');
  const migrationPath = path.resolve('supabase/migrations/20260917_user_profile_columns.sql');
  assert.ok(fs.existsSync(migrationPath), 'Migration file must exist at supabase/migrations/20260917_user_profile_columns.sql');
  const migrationSql = fs.readFileSync(migrationPath, 'utf-8');
  assert.ok(migrationSql.includes('endorsed_skills text[]'), 'Migration must add endorsed_skills');
  assert.ok(migrationSql.includes('completed_missions text[]'), 'Migration must add completed_missions');
  assert.ok(migrationSql.includes('ALTER TABLE public.users'), 'Migration must target public.users');
  console.log('✓ Migration 20260917_user_profile_columns.sql verified');

  // 2. userService Verification
  console.log('Test 2: userService.ts directFields and error logging');
  const userServicePath = path.resolve('src/lib/services/supabase/userService.ts');
  const userServiceCode = fs.readFileSync(userServicePath, 'utf-8');

  // Static checks
  assert.ok(userServiceCode.includes("'completed_missions'"), "directFields must contain 'completed_missions'");
  assert.ok(userServiceCode.includes("'endorsed_skills'"), "directFields must contain 'endorsed_skills'");
  assert.ok(userServiceCode.includes("console.error('[updateUserProfile] Supabase update error:'"), 'updateUserProfile must log errors with console.error');

  // Dynamic mapping checks
  const { mapProfileToRow, mapRowToProfile } = await import('../src/lib/services/supabase/userService');
  const mappedRow = mapProfileToRow({
    completed_missions: ['mission_1', 'mission_2'],
    endorsed_skills: ['skill_react'],
  });
  assert.deepStrictEqual(mappedRow.completed_missions, ['mission_1', 'mission_2'], 'completed_missions must pass through directFields');
  assert.deepStrictEqual(mappedRow.endorsed_skills, ['skill_react'], 'endorsed_skills must pass through directFields');

  const camelRow = mapProfileToRow({
    completedMissions: ['mission_3'],
    endorsedSkills: ['skill_node'],
  });
  assert.deepStrictEqual(camelRow.completed_missions, ['mission_3'], 'completedMissions camelCase must map to snake_case');
  assert.deepStrictEqual(camelRow.endorsed_skills, ['skill_node'], 'endorsedSkills camelCase must map to snake_case');

  const mappedProfile = mapRowToProfile({
    id: 'user-001',
    completed_missions: ['mission_1'],
    endorsed_skills: ['skill_1'],
  });
  assert.deepStrictEqual(mappedProfile.completed_missions, ['mission_1'], 'completed_missions alias populated');
  assert.deepStrictEqual(mappedProfile.completedMissions, ['mission_1'], 'completedMissions camelCase populated');
  console.log('✓ userService directFields and error handling verified');

  // 3. student/activity route Verification
  console.log('Test 3: src/app/api/student/activity/route.ts isolation & client scoping');
  const activityRoutePath = path.resolve('src/app/api/student/activity/route.ts');
  const activityRouteCode = fs.readFileSync(activityRoutePath, 'utf-8');

  assert.ok(!activityRouteCode.includes("@/lib/supabaseClient"), 'Route must NOT use unauthenticated @/lib/supabaseClient');
  assert.ok(activityRouteCode.includes("getAuthoritativeSupabaseClient"), 'Route must use getAuthoritativeSupabaseClient');
  assert.ok(!activityRouteCode.includes("admin_audit_log"), 'Route must NOT query admin_audit_log for student activity');
  assert.ok(!activityRouteCode.includes("adminDataAccess"), 'Route must NOT write student events to adminDataAccess');

  // Route runtime invocation test
  const { GET, POST } = await import('../src/app/api/student/activity/route');
  const unauthReq = new Request('http://localhost:3000/api/student/activity');
  const unauthRes = await GET(unauthReq);
  assert.strictEqual(unauthRes.status, 401, 'Unauthenticated request returns 401');

  const authReq = new Request('http://localhost:3000/api/student/activity', {
    headers: { Authorization: 'Bearer test-token-student' }
  });
  const authRes = await GET(authReq);
  assert.strictEqual(authRes.status, 200, 'Authenticated request returns 200');
  const getData = await authRes.json();
  assert.ok(Array.isArray(getData.log), 'log array returned');
  assert.ok(Array.isArray(getData.activity), 'activity array returned');

  const postReq = new Request('http://localhost:3000/api/student/activity', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer test-token-student',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      action: 'mission_complete',
      meta: { missionId: 'mis-101' }
    })
  });
  const postRes = await POST(postReq);
  assert.strictEqual(postRes.status, 200, 'POST returns 200');
  const postData = await postRes.json();
  assert.strictEqual(postData.ok, true, 'POST ok is true');
  assert.strictEqual(postData.entry.action, 'mission_complete', 'POST entry action matches');
  console.log('✓ student activity route isolation and auth scoping verified');

  console.log('\n--- ALL N7, N3, P1-6 VERIFICATION TESTS PASSED (3/3) ---');
}

run().catch(err => {
  console.error('TEST FAILED:', err);
  process.exit(1);
});
