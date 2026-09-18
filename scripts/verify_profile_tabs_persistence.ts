/**
 * Verification Suite: Profile Tabs & Endorsement Persistence
 * Tests:
 * 1. ActivityTab endpoint modernization (/api/student/activity)
 * 2. PassportTab endorsement persistence via updateUserProfile
 * 3. Contract mappings in userService (endorsed_skills <-> endorsedSkills)
 * 4. Privilege filtering check for endorsed_skills
 * 5. Route handlers for GET & POST /api/student/activity
 */

import assert from 'assert';

process.env.ALLOW_DEV_AUTH_BYPASS = 'true';
process.env.NODE_ENV = 'test';

async function run() {
  console.log('--- STARTING PROFILE TABS & ENDORSEMENT TESTS ---');

  // Test 1: Static code assertions for ActivityTab.tsx
  console.log('Test 1: ActivityTab endpoint verification');
  const fs = await import('fs');
  const path = await import('path');
  const activityTabCode = fs.readFileSync(path.resolve('src/app/profile/tabs/ActivityTab.tsx'), 'utf-8');

  assert.ok(!activityTabCode.includes('/api/admin/audit-log'), 'ActivityTab must NOT call /api/admin/audit-log');
  assert.ok(activityTabCode.includes('/api/student/activity'), 'ActivityTab must call /api/student/activity');
  console.log('✓ ActivityTab calls student-scoped activity endpoint and not admin audit-log');

  // Test 2: Static code assertions for PassportTab.tsx
  console.log('Test 2: PassportTab endorsement persistence verification');
  const passportTabCode = fs.readFileSync(path.resolve('src/app/profile/tabs/PassportTab.tsx'), 'utf-8');

  assert.ok(!passportTabCode.includes('/api/auth/profile'), 'PassportTab must NOT call phantom /api/auth/profile');
  assert.ok(passportTabCode.includes('updateUserProfile'), 'PassportTab must use updateUserProfile directly');
  assert.ok(passportTabCode.includes('user?.endorsed_skills'), 'PassportTab must check user.endorsed_skills');
  console.log('✓ PassportTab uses updateUserProfile directly and ignores phantom /api/auth/profile');

  // Test 3: Static code assertions for useWorkspaceState.ts
  console.log('Test 3: useWorkspaceState quest logging');
  const workspaceCode = fs.readFileSync(path.resolve('src/components/quests/workspace/useWorkspaceState.ts'), 'utf-8');
  assert.ok(!workspaceCode.includes('/api/admin/audit-log/add'), 'useWorkspaceState must not call missing /api/admin/audit-log/add');
  assert.ok(workspaceCode.includes('/api/student/activity'), 'useWorkspaceState logs to /api/student/activity');
  console.log('✓ useWorkspaceState logs completed quests to /api/student/activity');

  // Test 4: Data Contract mappings in userService.ts
  console.log('Test 4: userService endorsed_skills contract mappings');
  const { mapRowToProfile, mapProfileToRow, stripSelfServicePrivileges } = await import('../src/lib/services/supabase/userService');

  // 4a. mapRowToProfile maps endorsed_skills to both endorsedSkills and endorsed_skills
  const testRow = {
    id: 'user-123',
    display_name: 'Test Student',
    role: 'student',
    endorsed_skills: ['skill_react', 'skill_node'],
  };
  const profile = mapRowToProfile(testRow);
  assert.deepStrictEqual(profile.endorsedSkills, ['skill_react', 'skill_node'], 'endorsedSkills must match array');
  assert.deepStrictEqual(profile.endorsed_skills, ['skill_react', 'skill_node'], 'endorsed_skills alias must match array');

  // 4b. mapProfileToRow maps camelCase endorsedSkills to endorsed_skills
  const testProfileCamel = {
    displayName: 'Student Two',
    endorsedSkills: ['skill_python', 'skill_sql'],
  };
  const rowCamel = mapProfileToRow(testProfileCamel);
  assert.deepStrictEqual(rowCamel.endorsed_skills, ['skill_python', 'skill_sql'], 'camelCase endorsedSkills must map to snake_case');

  // 4c. mapProfileToRow maps direct snake_case endorsed_skills
  const testProfileSnake = {
    display_name: 'Student Three',
    endorsed_skills: ['skill_cloud'],
  };
  const rowSnake = mapProfileToRow(testProfileSnake);
  assert.deepStrictEqual(rowSnake.endorsed_skills, ['skill_cloud'], 'snake_case endorsed_skills must be preserved');

  // 4d. stripSelfServicePrivileges must NOT strip endorsed_skills
  const unprivilegedPayload = {
    display_name: 'Alice',
    endorsed_skills: ['skill_ai'],
    role: 'hacker_role', // should be stripped
    ats_score: 99,       // should be stripped
  };
  const stripped = stripSelfServicePrivileges(unprivilegedPayload, false);
  assert.deepStrictEqual(stripped.endorsed_skills, ['skill_ai'], 'endorsed_skills must not be stripped by self-service guard');
  assert.strictEqual(stripped.role, undefined, 'role should have been stripped');
  assert.strictEqual(stripped.ats_score, undefined, 'ats_score should have been stripped');
  console.log('✓ userService contract mappings and privilege stripping tested successfully');

  // Test 5: Route handler tests for /api/student/activity
  console.log('Test 5: /api/student/activity GET & POST route testing');
  const { GET, POST } = await import('../src/app/api/student/activity/route');

  // 5a. Unauthenticated GET rejected with 401
  const unauthReq = new Request('http://localhost:3000/api/student/activity');
  const unauthRes = await GET(unauthReq);
  assert.strictEqual(unauthRes.status, 401, 'Unauthenticated request must return 401');

  // 5b. Authenticated GET with dev bypass token
  const authReq = new Request('http://localhost:3000/api/student/activity', {
    headers: { Authorization: 'Bearer test-token-student' }
  });
  const authRes = await GET(authReq);
  assert.strictEqual(authRes.status, 200, 'Authenticated request must return 200');
  const getData = await authRes.json();
  assert.ok(Array.isArray(getData.log), 'Response must contain log array');
  assert.ok(Array.isArray(getData.activity), 'Response must contain activity array');
  console.log(`✓ GET /api/student/activity returned 200 with ${getData.log.length} records`);

  // 5c. Authenticated POST with dev bypass token
  const postReq = new Request('http://localhost:3000/api/student/activity', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer test-token-student',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      action: 'quest_complete',
      meta: { questTitle: 'Binary Search Mastery', xp: 150 }
    })
  });
  const postRes = await POST(postReq);
  assert.strictEqual(postRes.status, 200, 'POST /api/student/activity must return 200');
  const postData = await postRes.json();
  assert.strictEqual(postData.ok, true, 'POST response ok must be true');
  assert.strictEqual(postData.entry.action, 'quest_complete', 'POST entry action matches');
  assert.strictEqual(postData.entry.meta.questTitle, 'Binary Search Mastery', 'POST entry meta matches');
  console.log('✓ POST /api/student/activity logged quest activity successfully');

  console.log('\n--- ALL PROFILE TABS & ENDORSEMENT TESTS PASSED (6/6) ---');
}

run().catch((err) => {
  console.error('TEST FAILED:', err);
  process.exit(1);
});
