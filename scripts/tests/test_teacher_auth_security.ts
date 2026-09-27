// scripts/test_teacher_auth_security.ts
// Comprehensive verification suite for T5: Teacher Auth & Studio Hardening

import fs from 'fs';
import path from 'path';
import { GET as teacherAuthGet, POST as teacherAuthPost } from '../src/app/api/teacher/auth/route';

let passed = 0;
let failed = 0;

function assert(name: string, condition: boolean, details?: any) {
  if (condition) {
    console.log(`  ✅ [PASS] ${name}`);
    passed++;
  } else {
    console.error(`  ❌ [FAIL] ${name}`, details || '');
    failed++;
  }
}

async function runTeacherAuthSecuritySuite() {
  console.log('========================================================================');
  console.log('🛡️ VERIFYING T5: TEACHER AUTH & STUDIO HARDENING');
  console.log('========================================================================\n');

  // ── TEST 1: AppShell PUBLIC_PATHS Staff Portal Removal ──
  console.log('── TEST 1: AppShell PUBLIC_PATHS Staff Portal Removal ──');
  const appShellPath = path.resolve(process.cwd(), 'src/components/ui/AppShell.tsx');
  const appShellContent = fs.readFileSync(appShellPath, 'utf8');

  // Extract PUBLIC_PATHS array definition
  const publicPathsMatch = appShellContent.match(/const PUBLIC_PATHS\s*=\s*(\[[^\]]+\]);/);
  assert('PUBLIC_PATHS definition exists in AppShell.tsx', !!publicPathsMatch);

  if (publicPathsMatch) {
    const publicPathsStr = publicPathsMatch[1];
    const staffPortals = ['/teacher', '/admin', '/recruiter', '/consultant', '/parent', '/finance'];
    for (const portal of staffPortals) {
      assert(
        `Staff portal '${portal}' is NOT in PUBLIC_PATHS`,
        !publicPathsStr.includes(`'${portal}'`) && !publicPathsStr.includes(`"${portal}"`)
      );
    }
  }

  // ── TEST 2: TeacherRoleGate Deduplication & Bypass Elimination ──
  console.log('\n── TEST 2: TeacherRoleGate Deduplication & Bypass Elimination ──');
  const roleGatePath = path.resolve(process.cwd(), 'src/components/teacher/TeacherRoleGate.tsx');
  assert('TeacherRoleGate.tsx exists', fs.existsSync(roleGatePath));

  const roleGateContent = fs.readFileSync(roleGatePath, 'utf8');
  assert('TeacherRoleGate does NOT contain client-side isDemoBypass state', !roleGateContent.includes('isDemoBypass'));
  assert('TeacherRoleGate does NOT contain "Preview Studio (Read-Only Mode)" button', !roleGateContent.includes('Preview Studio (Read-Only Mode)'));
  assert('TeacherRoleGate imports isDemoAuthEnabled from @/lib/demoAuth', roleGateContent.includes('isDemoAuthEnabled'));
  assert('TeacherRoleGate checks 403 Forbidden for non-faculty roles', roleGateContent.includes('403 — Faculty Access Required') || roleGateContent.includes('403'));
  assert('TeacherRoleGate renders TeacherDashboard for authorized roles', roleGateContent.includes('<TeacherDashboard'));

  // ── TEST 3: Route Deduplication in /teacher and /admin/teacher ──
  console.log('\n── TEST 3: Route Deduplication in /teacher and /admin/teacher ──');
  const teacherPagePath = path.resolve(process.cwd(), 'src/app/teacher/page.tsx');
  const adminTeacherPagePath = path.resolve(process.cwd(), 'src/app/admin/teacher/page.tsx');

  const teacherPageContent = fs.readFileSync(teacherPagePath, 'utf8');
  const adminTeacherPageContent = fs.readFileSync(adminTeacherPagePath, 'utf8');

  assert('/teacher/page.tsx delegates to TeacherRoleGate', teacherPageContent.includes('<TeacherRoleGate'));
  assert('/admin/teacher/page.tsx delegates to TeacherRoleGate', adminTeacherPageContent.includes('<TeacherRoleGate'));
  assert('/teacher/page.tsx is concise (< 30 lines)', teacherPageContent.split('\n').length < 30);
  assert('/admin/teacher/page.tsx is concise (< 30 lines)', adminTeacherPageContent.split('\n').length < 30);
  assert('Neither page contains hardcoded "111111"', !teacherPageContent.includes('111111') && !adminTeacherPageContent.includes('111111'));
  assert('Neither page contains hardcoded "teacher@pinit.in"', !teacherPageContent.includes('teacher@pinit.in') && !adminTeacherPageContent.includes('teacher@pinit.in'));

  // ── TEST 4: Shadow Auth Route Hardening (/api/teacher/auth) ──
  console.log('\n── TEST 4: Shadow Auth Route Hardening (/api/teacher/auth) ──');
  const authRoutePath = path.resolve(process.cwd(), 'src/app/api/teacher/auth/route.ts');
  const authRouteContent = fs.readFileSync(authRoutePath, 'utf8');

  assert('Auth route does NOT use TEACHER_DEMO_PASSWORD', !authRouteContent.includes('TEACHER_DEMO_PASSWORD'));
  assert('Auth route does NOT mint unsigned t_token_* tokens', !authRouteContent.includes('t_token_'));
  assert('Auth route uses requireFacultyOrAdminUserFromRequest', authRouteContent.includes('requireFacultyOrAdminUserFromRequest'));

  // Test live API route handling unauthenticated request
  const unauthReq = new Request('http://localhost:3000/api/teacher/auth', {
    method: 'GET',
    headers: {},
  });
  const unauthRes = await teacherAuthGet(unauthReq);
  assert('GET /api/teacher/auth returns 401 when Authorization header missing', unauthRes.status === 401);

  const fakeTokenReq = new Request('http://localhost:3000/api/teacher/auth', {
    method: 'GET',
    headers: { Authorization: 'Bearer fake_unsigned_token_12345' },
  });
  const fakeTokenRes = await teacherAuthGet(fakeTokenReq);
  // Without Supabase or with invalid token, should return 401 or 503 (if env missing)
  assert('GET /api/teacher/auth rejects forged bearer token (status 401 or 503)', [401, 503].includes(fakeTokenRes.status));

  const postReq = new Request('http://localhost:3000/api/teacher/auth', {
    method: 'POST',
    headers: {},
  });
  const postRes = await teacherAuthPost(postReq);
  assert('POST /api/teacher/auth returns 401 when Authorization header missing', postRes.status === 401);

  console.log('\n========================================================================');
  console.log(`TOTAL: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log('========================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTeacherAuthSecuritySuite().catch(err => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
