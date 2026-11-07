import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('Task 1: Friends Hub Zero Dummy Data & Role Isolation Audit', async (t) => {
  const suggestionsRoute = fs.readFileSync(path.join(__dirname, '../src/app/api/friends/suggestions/route.ts'), 'utf8');
  const searchRoute = fs.readFileSync(path.join(__dirname, '../src/app/api/friends/search/route.ts'), 'utf8');
  const idRoute = fs.readFileSync(path.join(__dirname, '../src/app/api/friends/[id]/route.ts'), 'utf8');
  const dbJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/lib/data/friends_db.json'), 'utf8'));

  await t.test('1. friends_db.json has zero mock students', () => {
    assert.deepStrictEqual(dbJson.mockStudents, [], 'mockStudents in friends_db.json must be empty');
  });

  await t.test('2. /api/friends/suggestions excludes non-student roles and test recruiter personas while including all authentic database students', () => {
    assert.ok(suggestionsRoute.includes('nonStudentRoles'), 'Must define non-student roles to exclude');
    assert.ok(suggestionsRoute.includes('testNonStudentRegex'), 'Must filter test persona keywords');
    assert.strictEqual(suggestionsRoute.includes('candidates = (db.mockStudents as MatchStudentProfile[])'), false, 'Must not fallback to mockStudents');
    assert.strictEqual(suggestionsRoute.includes('ob.skills'), false, 'Must not fallback to ob.skills boilerplate');
  });

  await t.test('3. /api/friends/search excludes non-student roles and test recruiter personas while including all authentic database students', () => {
    assert.ok(searchRoute.includes('nonStudentRoles'), 'Must define non-student roles to exclude in search');
    assert.ok(searchRoute.includes('testNonStudentRegex'), 'Must filter test persona keywords in search');
    assert.strictEqual(searchRoute.includes('students = (localData.mockStudents || [])'), false, 'Must not fallback to mockStudents in search');
    assert.strictEqual(searchRoute.includes('ob.skills'), false, 'Must not fallback to ob.skills boilerplate in search');
  });

  await t.test('4. /api/friends/[id] returns 404 for non-students and does not fallback to mock data', () => {
    assert.strictEqual(idRoute.includes('mockStudent = (db.mockStudents || [])'), false, 'Must not fallback to mockStudents on [id]');
    assert.ok(idRoute.includes("error: 'NOT_FOUND'"), 'Must return 404 when student not found');
  });

  await t.test('5. Task 2: Suggestions, Search, and [id] routes have zero fallback dummy skills', () => {
    assert.strictEqual(suggestionsRoute.includes("['Problem Solving', 'Engineering']"), false, 'Must not fallback to Problem Solving in suggestions');
    assert.strictEqual(suggestionsRoute.includes("['React', 'TypeScript', 'Node.js']"), false, 'Must not fallback to React/TypeScript in suggestions');
    assert.strictEqual(searchRoute.includes("['React', 'TypeScript', 'Node.js']"), false, 'Must not fallback to React/TypeScript in search');
    assert.strictEqual(idRoute.includes("['React', 'TypeScript', 'Node.js', 'System Design']"), false, 'Must not fallback to mock skills in [id]');
  });

  await t.test('6. Task 2: Purged "Nearby Campus" from matching engine and suggested peer cards', () => {
    const matchingLib = fs.readFileSync(path.join(__dirname, '../src/lib/friends/matching.ts'), 'utf8');
    const friendsPage = fs.readFileSync(path.join(__dirname, '../src/app/friends/page.tsx'), 'utf8');

    assert.strictEqual(matchingLib.includes('📍 Nearby Campus:'), false, 'matching.ts must not output Nearby Campus');
    assert.strictEqual(friendsPage.includes('className="suggested-match-reason"'), false, 'Suggested peer card must not render match reason line');
  });

  await t.test('7. Task 3: Zero dummy squad projects in API and clean empty state in SquadProjectsView', () => {
    const projectsRoute = fs.readFileSync(path.join(__dirname, '../src/app/api/friends/projects/route.ts'), 'utf8');
    const squadView = fs.readFileSync(path.join(__dirname, '../src/components/friends/SquadProjectsView.tsx'), 'utf8');
    const inviteModal = fs.readFileSync(path.join(__dirname, '../src/components/friends/ProjectInviteModal.tsx'), 'utf8');

    // Zero hardcoded demo squads in API
    assert.strictEqual(projectsRoute.includes('AI Resume Analyzer & ATS Benchmarker'), false, 'API must not hardcode AI Resume Analyzer');
    assert.strictEqual(projectsRoute.includes('Campus Transit Realtime IoT Desk'), false, 'API must not hardcode Campus Transit Realtime IoT Desk');

    // Zero hardcoded options in ProjectInviteModal
    assert.strictEqual(inviteModal.includes('AI Resume Analyzer & ATS Benchmarker'), false, 'Modal must not hardcode AI Resume Analyzer option');

    // SquadProjectsView renders empty state when zero squads exist
    assert.ok(squadView.includes('squad-projects-empty-state'), 'SquadProjectsView must handle empty state when 0 squads exist');
    assert.ok(squadView.includes('No Active Collaborative Squads'), 'Must display authentic empty title');
  });
});
