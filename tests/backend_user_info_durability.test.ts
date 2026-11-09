import test from 'node:test';
import assert from 'node:assert/strict';
import { mapProfileToRow, mapRowToProfile, stripSelfServicePrivileges } from '../src/lib/services/supabase/userService';
import { ALLOWED_PROFILE_KEYS } from '../src/app/api/auth/me/route';
import { NextRequest } from 'next/server';

test('BACKEND USER INFO DURABILITY & INTEGRITY VERIFICATION SUITE', async (t) => {

  await t.test('1. userService: mapProfileToRow populates direct columns and onboarding_answers JSONB', () => {
    const mockProfile = {
      studentName: 'Vinay N',
      displayName: 'Vinay N',
      collegeName: 'BGS Institute of Management',
      department: 'BCA • Computer Applications',
      branch: 'BCA • Computer Applications',
      university: 'Bangalore University',
      rollNumber: 'PIN-BGS-BCA-726',
      pinitId: 'PIN-BGS-BCA-726',
      collegeInfo: {
        collegeCode: 'BGS',
        departmentCode: 'BCA',
        rollNumber: '726',
      },
      role: 'student',
      email: 'vinay@campus.edu',
    };

    const row = mapProfileToRow(mockProfile);

    // Direct column verifications
    assert.strictEqual(row.display_name, 'Vinay N');
    assert.strictEqual(row.college_name, 'BGS Institute of Management');
    assert.strictEqual(row.department, 'BCA • Computer Applications');
    assert.strictEqual(row.roll_number, 'PIN-BGS-BCA-726');
    assert.strictEqual(row.pinit_id, 'PIN-BGS-BCA-726');
    assert.strictEqual(row.role, 'student');
    assert.strictEqual(row.email, 'vinay@campus.edu');

    // Resilient JSONB backup verification inside onboarding_answers
    const ob = row.onboarding_answers as Record<string, any>;
    assert.ok(ob, 'onboarding_answers must exist on row');
    assert.strictEqual(ob.studentName, 'Vinay N');
    assert.strictEqual(ob.collegeName, 'BGS Institute of Management');
    assert.strictEqual(ob.college, 'BGS Institute of Management');
    assert.strictEqual(ob.department, 'BCA • Computer Applications');
    assert.strictEqual(ob.branch, 'BCA • Computer Applications');
    assert.strictEqual(ob.rollNumber, 'PIN-BGS-BCA-726');
    assert.strictEqual(ob.pinitId, 'PIN-BGS-BCA-726');
    assert.deepStrictEqual(ob.collegeInfo, mockProfile.collegeInfo);
  });

  await t.test('2. userService: mapRowToProfile extracts data even if columns are missing from Postgres table', () => {
    // Simulate a database row where individual columns were not yet migrated,
    // but data was saved safely in onboarding_answers JSONB
    const unmigratedRow = {
      id: 'usr_mock_123',
      onboarding_answers: {
        studentName: 'Vinay N',
        displayName: 'Vinay N',
        collegeName: 'BGS Institute of Management',
        department: 'BCA • Computer Applications',
        branch: 'BCA • Computer Applications',
        university: 'Bangalore University',
        rollNumber: 'PIN-BGS-BCA-726',
        pinitId: 'PIN-BGS-BCA-726',
        collegeInfo: { collegeName: 'BGS Institute of Management' },
      },
    };

    const profile = mapRowToProfile(unmigratedRow);
    assert.ok(profile, 'Profile must be mapped');
    assert.strictEqual(profile.studentName, 'Vinay N');
    assert.strictEqual(profile.displayName, 'Vinay N');
    assert.strictEqual(profile.collegeName, 'BGS Institute of Management');
    assert.strictEqual(profile.department, 'BCA • Computer Applications');
    assert.strictEqual(profile.branch, 'BCA • Computer Applications');
    assert.strictEqual(profile.university, 'Bangalore University');
    assert.strictEqual(profile.rollNumber, 'PIN-BGS-BCA-726');
    assert.strictEqual(profile.pinitId, 'PIN-BGS-BCA-726');
    assert.ok(profile.collegeInfo, 'collegeInfo must be present');
  });

  await t.test('3. userService: mapRowToProfile extracts data from direct database columns', () => {
    const migratedRow = {
      id: 'usr_mock_456',
      display_name: 'Vinay N',
      full_name: 'Vinay N',
      college_name: 'BGS Institute of Management',
      department: 'BCA • Computer Applications',
      roll_number: 'PIN-BGS-BCA-726',
      pinit_id: 'PIN-BGS-BCA-726',
      onboarding_answers: {},
    };

    const profile = mapRowToProfile(migratedRow);
    assert.ok(profile, 'Profile must be mapped');
    assert.strictEqual(profile.studentName, 'Vinay N');
    assert.strictEqual(profile.displayName, 'Vinay N');
    assert.strictEqual(profile.collegeName, 'BGS Institute of Management');
    assert.strictEqual(profile.department, 'BCA • Computer Applications');
    assert.strictEqual(profile.branch, 'BCA • Computer Applications');
    assert.strictEqual(profile.rollNumber, 'PIN-BGS-BCA-726');
    assert.strictEqual(profile.pinitId, 'PIN-BGS-BCA-726');
  });

  await t.test('4. userService: stripSelfServicePrivileges preserves critical fields appropriately', () => {
    const rawRow = {
      id: 'usr_test',
      email: 'vinay@campus.edu',
      role: 'student',
      college_name: 'BGS Institute of Management',
      pinit_id: 'PIN-BGS-BCA-726',
      onboarding_answers: { test: true },
    };

    // When allowPrivileged is true (user creation / signup), nothing is stripped
    const privilegedRow = stripSelfServicePrivileges({ ...rawRow }, true);
    assert.strictEqual(privilegedRow.email, 'vinay@campus.edu');
    assert.strictEqual(privilegedRow.role, 'student');
    assert.strictEqual(privilegedRow.college_name, 'BGS Institute of Management');
    assert.strictEqual(privilegedRow.pinit_id, 'PIN-BGS-BCA-726');

    // When allowPrivileged is false (self-service profile edits), institutional data is not stripped
    const unprivilegedRow = stripSelfServicePrivileges({ ...rawRow }, false);
    assert.strictEqual(unprivilegedRow.college_name, 'BGS Institute of Management');
    assert.strictEqual(unprivilegedRow.pinit_id, 'PIN-BGS-BCA-726');
    assert.ok(unprivilegedRow.onboarding_answers);
  });

  await t.test('5. /api/auth/me: ALLOWED_PROFILE_KEYS whitelists all institutional and student fields', () => {
    const requiredKeys = [
      'student_name', 'studentName',
      'college_name', 'collegeName', 'college',
      'department', 'branch', 'university',
      'roll_number', 'rollNumber', 'register_number', 'registerNumber',
      'pinit_id', 'pinitId',
      'college_info', 'collegeInfo',
      'semester', 'batch', 'batch_year', 'batchYear',
    ];

    for (const key of requiredKeys) {
      assert.ok(ALLOWED_PROFILE_KEYS.has(key), `Key '${key}' MUST be whitelisted in ALLOWED_PROFILE_KEYS to prevent 400 rejection`);
    }
  });

  await t.test('6. POST /api/student/connect-college: accepts full payload and returns success', async () => {
    const { POST } = await import('../src/app/api/student/connect-college/route');

    const req = new NextRequest('http://localhost:3000/api/student/connect-college', {
      method: 'POST',
      body: JSON.stringify({
        studentName: 'Vinay N',
        collegeName: 'BGS Institute of Management',
        department: 'BCA • Computer Applications',
        rollNumber: 'PIN-BGS-BCA-726',
        pinitId: 'PIN-BGS-BCA-726',
        userId: 'usr_durability_test_1',
      }),
    });

    const res = await POST(req);
    const json = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(json.ok, true);
    assert.strictEqual(json.institutionName, 'BGS Institute of Management');
    assert.strictEqual(json.department, 'BCA • Computer Applications');
    assert.strictEqual(json.rollNumber, 'PIN-BGS-BCA-726');
  });

  await t.test('7. /api/auth/scan-id-card: returns extracted fields at both root and in metadata', async () => {
    // Verify file source guarantees root level propagation
    const fs = await import('fs');
    const path = await import('path');
    const scanRouteSrc = fs.readFileSync(path.join(__dirname, '../src/app/api/auth/scan-id-card/route.ts'), 'utf8');

    assert.ok(scanRouteSrc.includes('studentName: extractedMeta.studentName'), 'Must return studentName at root of response');
    assert.ok(scanRouteSrc.includes('collegeName: extractedMeta.collegeName'), 'Must return collegeName at root of response');
    assert.ok(scanRouteSrc.includes('department: extractedMeta.department'), 'Must return department at root of response');
    assert.ok(scanRouteSrc.includes('rollNumber: extractedMeta.rollNumber'), 'Must return rollNumber at root of response');
    assert.ok(scanRouteSrc.includes('metadata: extractedMeta'), 'Must return metadata object');
  });

  await t.test('8. /signup: form and submit handlers bind all metadata to student profile', async () => {
    const fs = await import('fs');
    const path = await import('path');
    const signupSrc = fs.readFileSync(path.join(__dirname, '../src/app/signup/page.tsx'), 'utf8');

    // 1. Scanned badge parsing reads meta and fallback correctly
    assert.ok(signupSrc.includes('meta.studentName || data.studentName'), 'Must extract studentName from scanner response');
    assert.ok(signupSrc.includes('meta.collegeName || data.collegeName'), 'Must extract collegeName from scanner response');
    assert.ok(signupSrc.includes('meta.department || data.department'), 'Must extract department from scanner response');
    assert.ok(signupSrc.includes('meta.rollNumber || data.rollNumber'), 'Must extract rollNumber from scanner response');

    // 2. Form submission payload includes all student fields
    assert.ok(signupSrc.includes('studentName: finalName'), 'Must send studentName');
    assert.ok(signupSrc.includes('collegeName: finalCollege'), 'Must send collegeName');
    assert.ok(signupSrc.includes('department: finalBranch'), 'Must send department');
    assert.ok(signupSrc.includes('branch: finalBranch'), 'Must send branch');
    assert.ok(signupSrc.includes('rollNumber: userLogin'), 'Must send rollNumber');
    assert.ok(signupSrc.includes('pinitId'), 'Must send pinitId');
    assert.ok(signupSrc.includes('pinit_connected_college'), 'Must set connected college in localStorage');
  });
});
