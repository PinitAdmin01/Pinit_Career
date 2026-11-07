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

  await t.test('2. /api/friends/suggestions excludes non-student roles and test recruiter personas', () => {
    assert.ok(suggestionsRoute.includes('nonStudentRoles'), 'Must define non-student roles to exclude');
    assert.ok(suggestionsRoute.includes("r !== 'student'"), 'Must enforce strict student role filter');
    assert.ok(suggestionsRoute.includes('testNonStudentRegex'), 'Must filter test persona keywords');
    assert.strictEqual(suggestionsRoute.includes('candidates = (db.mockStudents as MatchStudentProfile[])'), false, 'Must not fallback to mockStudents');
  });

  await t.test('3. /api/friends/search excludes non-student roles and test recruiter personas', () => {
    assert.ok(searchRoute.includes('nonStudentRoles'), 'Must define non-student roles to exclude in search');
    assert.ok(searchRoute.includes("r !== 'student'"), 'Must enforce student role in search');
    assert.strictEqual(searchRoute.includes('students = (localData.mockStudents || [])'), false, 'Must not fallback to mockStudents in search');
  });

  await t.test('4. /api/friends/[id] returns 404 for non-students and does not fallback to mock data', () => {
    assert.strictEqual(idRoute.includes('mockStudent = (db.mockStudents || [])'), false, 'Must not fallback to mockStudents on [id]');
    assert.ok(idRoute.includes("error: 'NOT_FOUND'"), 'Must return 404 when student not found');
  });
});
