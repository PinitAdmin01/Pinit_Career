import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { NextRequest } from 'next/server';

test('Task 4: Campus Academic & Right Sidebar Connection Flow Verification', async (t) => {
  const shellSource = fs.readFileSync(path.join(__dirname, '../src/components/ui/AppShell.tsx'), 'utf8');
  const routeSource = fs.readFileSync(path.join(__dirname, '../src/app/api/student/connect-college/route.ts'), 'utf8');

  await t.test('1. AppShell gates right sidebar strictly behind isCollegeConnected', () => {
    assert.ok(
      shellSource.includes("isStudent && !effectiveFocusMode && !cleanPath.startsWith('/quests') && isCollegeConnected"),
      'Right sidebar must only be displayed when isCollegeConnected is true'
    );
  });

  await t.test('2. AppShell renders Campus Academic circle trigger when not connected', () => {
    assert.ok(
      shellSource.includes('campus-academic-circle-btn'),
      'Must render circular button when !isCollegeConnected'
    );
    assert.ok(
      shellSource.includes('Campus Academic — Connect to College'),
      'Trigger button must have informative title and aria-label'
    );
  });

  await t.test('3. AppShell includes Connect to College Modal with Enter key form submission', () => {
    assert.ok(shellSource.includes('showConnectCollegeModal'), 'Must track modal open/close state');
    assert.ok(shellSource.includes('handleConnectCollegeSubmit'), 'Must define form submit handler');
    assert.ok(shellSource.includes('<form onSubmit={handleConnectCollegeSubmit}'), 'Must use HTML form for native Enter key submission');
    assert.ok(shellSource.includes('College / University Name'), 'Must prompt for college name');
    assert.ok(shellSource.includes('pinit_connected_college'), 'Must persist connected college in localStorage');
  });

  await t.test('4. POST /api/student/connect-college endpoint validates input and saves affiliation', async () => {
    const { POST } = await import('../src/app/api/student/connect-college/route');

    // Test A: Empty body / short college name -> 400
    const reqEmpty = new NextRequest('http://localhost:3000/api/student/connect-college', {
      method: 'POST',
      body: JSON.stringify({ collegeName: '' }),
    });
    const resEmpty = await POST(reqEmpty);
    const jsonEmpty = await resEmpty.json();
    assert.strictEqual(resEmpty.status, 400);
    assert.strictEqual(jsonEmpty.ok, false);
    assert.strictEqual(jsonEmpty.error, 'BAD_REQUEST');

    // Test B: Valid college name -> 200 with initials calculation
    const reqValid = new NextRequest('http://localhost:3000/api/student/connect-college', {
      method: 'POST',
      body: JSON.stringify({
        collegeName: 'Christ University',
        degree: 'B.Com Accounting & Finance',
        department: 'Commerce',
        rollNumber: 'CU-2024-8891',
        userId: 'test_student_user_1',
      }),
    });
    const resValid = await POST(reqValid);
    const jsonValid = await resValid.json();
    assert.strictEqual(resValid.status, 200);
    assert.strictEqual(jsonValid.ok, true);
    assert.strictEqual(jsonValid.institutionName, 'Christ University');
    assert.strictEqual(jsonValid.institutionInitials, 'CU');
  });
});
