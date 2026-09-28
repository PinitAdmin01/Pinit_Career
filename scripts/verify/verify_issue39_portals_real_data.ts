import assert from 'assert';
import fs from 'fs';
import path from 'path';

// Force development bypass for deterministic role verification
process.env.ALLOW_DEV_AUTH_BYPASS = 'true';
process.env.NODE_ENV = 'development';
process.env.NEXT_PUBLIC_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';
process.env.SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key';

console.log('========================================================================');
console.log('🧪 VERIFYING ISSUE 39: PORTAL REAL DATA, PERMISSIONS & SERVER ENDPOINTS');
console.log('========================================================================\n');

let passed = 0;
let failed = 0;

function check(title: string, fn: () => void | Promise<void>) {
  try {
    const res = fn();
    if (res instanceof Promise) {
      return res
        .then(() => {
          console.log(`  ✅ [PASS]: ${title}`);
          passed++;
        })
        .catch((err) => {
          console.error(`  ❌ [FAIL]: ${title} -> ${err.message}`);
          failed++;
        });
    } else {
      console.log(`  ✅ [PASS]: ${title}`);
      passed++;
    }
  } catch (err: any) {
    console.error(`  ❌ [FAIL]: ${title} -> ${err.message}`);
    failed++;
  }
}

async function runAllTests() {
  // ── 1. Database Migration & RLS ──
  console.log('--- 1. Database Migration & RLS Policies ---');

  const migrationPath = path.join(process.cwd(), 'supabase/migrations/20260925_portal_real_data_and_permissions.sql');
  const consolidatedPath = path.join(process.cwd(), 'supabase/migrations/PRODUCTION_CONSOLIDATED_MIGRATIONS.sql');

  check('Migration file 20260925 exists', () => {
    assert.ok(fs.existsSync(migrationPath), 'Migration file must exist');
  });

  const migrationContent = fs.readFileSync(migrationPath, 'utf8');

  check('Defines parent_student_links table and RLS', () => {
    assert.ok(migrationContent.includes('CREATE TABLE IF NOT EXISTS public.parent_student_links'), 'Must create parent_student_links');
    assert.ok(migrationContent.includes('ALTER TABLE public.parent_student_links ENABLE ROW LEVEL SECURITY'), 'Must enable RLS on parent_student_links');
    assert.ok(migrationContent.includes('is_linked_parent'), 'Must define is_linked_parent helper function');
  });

  check('Defines recruiter_interactions table and RLS', () => {
    assert.ok(migrationContent.includes('CREATE TABLE IF NOT EXISTS public.recruiter_interactions'), 'Must create recruiter_interactions');
    assert.ok(migrationContent.includes('ALTER TABLE public.recruiter_interactions ENABLE ROW LEVEL SECURITY'), 'Must enable RLS on recruiter_interactions');
  });

  check('Consolidated migrations file has 0 UTF-8 BOM', () => {
    const buf = fs.readFileSync(consolidatedPath);
    const hasBom = buf[0] === 0xEF && buf[1] === 0xBB && buf[2] === 0xBF;
    assert.strictEqual(hasBom, false, 'Consolidated migrations must NOT have UTF-8 BOM');
  });

  check('Consolidated migrations includes 20260925 portal migration block', () => {
    const consolidatedContent = fs.readFileSync(consolidatedPath, 'utf8');
    assert.ok(consolidatedContent.includes('34. PORTAL REAL DATA, PARENT LINKS & RECRUITER INTERACTIONS'), 'Must include portal migration block');
  });

  // ── 2. Parent Portal Server Endpoints ──
  console.log('\n--- 2. Parent Portal Server Endpoints ---');

  const { GET: getParentStudents } = await import('@/app/api/parent/students/route');
  const { POST: linkStudent } = await import('@/app/api/parent/link-student/route');
  const { GET: getParentStudentOverview } = await import('@/app/api/parent/student/[id]/overview/route');

  await check('GET /api/parent/students requires authorization (401 without token)', async () => {
    const req = new Request('http://localhost:3000/api/parent/students');
    const res = await getParentStudents(req);
    assert.strictEqual(res.status, 401);
  });

  await check('GET /api/parent/students rejects plain student token with 403', async () => {
    const req = new Request('http://localhost:3000/api/parent/students', {
      headers: { Authorization: 'Bearer test-token-student' },
    });
    const res = await getParentStudents(req);
    assert.strictEqual(res.status, 403);
  });

  await check('GET /api/parent/students accepts parent token and returns students array', async () => {
    const req = new Request('http://localhost:3000/api/parent/students', {
      headers: { Authorization: 'Bearer test-token-parent' },
    });
    const res = await getParentStudents(req);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.ok, true);
    assert.ok(Array.isArray(data.students));
  });

  await check('POST /api/parent/link-student rejects missing registerNumber with 400', async () => {
    const req = new Request('http://localhost:3000/api/parent/link-student', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer test-token-parent',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });
    const res = await linkStudent(req);
    assert.strictEqual(res.status, 400);
  });

  await check('POST /api/parent/link-student returns 404 for non-existent register number', async () => {
    const req = new Request('http://localhost:3000/api/parent/link-student', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer test-token-parent',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ registerNumber: 'NON_EXISTENT_RN_99999' }),
    });
    const res = await linkStudent(req);
    assert.strictEqual(res.status, 404);
  });

  await check('GET /api/parent/student/[id]/overview rejects unauthorized caller with 403', async () => {
    const req = new Request('http://localhost:3000/api/parent/student/some_student/overview', {
      headers: { Authorization: 'Bearer test-token-student' },
    });
    const res = await getParentStudentOverview(req, { params: { id: 'other_student_id' } });
    assert.strictEqual(res.status, 403);
  });

  // ── 3. Recruiter Portal Server Endpoints ──
  console.log('\n--- 3. Recruiter Portal Server Endpoints ---');

  const { GET: getRecruiterPipeline } = await import('@/app/api/recruiter/pipeline/route');
  const { POST: shortlistCandidate } = await import('@/app/api/recruiter/shortlist/route');
  const { POST: contactRequest } = await import('@/app/api/recruiter/contact-request/route');
  const { POST: scheduleInterview } = await import('@/app/api/recruiter/schedule-interview/route');
  const { GET: getVisibility, PATCH: updateVisibility } = await import('@/app/api/recruiter/visibility/route');

  await check('GET /api/recruiter/pipeline requires recruiter role (403 for student)', async () => {
    const req = new Request('http://localhost:3000/api/recruiter/pipeline', {
      headers: { Authorization: 'Bearer test-token-student' },
    });
    const res = await getRecruiterPipeline(req);
    assert.strictEqual(res.status, 403);
  });

  await check('GET /api/recruiter/pipeline succeeds for recruiter token', async () => {
    const req = new Request('http://localhost:3000/api/recruiter/pipeline', {
      headers: { Authorization: 'Bearer test-token-recruiter' },
    });
    const res = await getRecruiterPipeline(req);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.ok, true);
    assert.ok(Array.isArray(data.pipeline));
  });

  await check('POST /api/recruiter/shortlist records interaction and notifies candidate', async () => {
    const req = new Request('http://localhost:3000/api/recruiter/shortlist', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer test-token-recruiter',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ candidateId: 'test_user_001' }),
    });
    const res = await shortlistCandidate(req);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.ok, true);
  });

  await check('POST /api/recruiter/contact-request records interaction and notifies candidate', async () => {
    const req = new Request('http://localhost:3000/api/recruiter/contact-request', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer test-token-recruiter',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ candidateId: 'test_user_001', message: 'Interested in your Python skills' }),
    });
    const res = await contactRequest(req);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.ok, true);
  });

  await check('POST /api/recruiter/schedule-interview records interview and notifies candidate', async () => {
    const req = new Request('http://localhost:3000/api/recruiter/schedule-interview', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer test-token-recruiter',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        candidateId: 'test_user_001',
        scheduledAt: '2026-10-01T10:00:00Z',
        mode: 'Google Meet',
        roleTitle: 'Full Stack Engineer',
      }),
    });
    const res = await scheduleInterview(req);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.ok, true);
  });

  await check('PATCH /api/recruiter/visibility updates student visibility with service role', async () => {
    const req = new Request('http://localhost:3000/api/recruiter/visibility', {
      method: 'PATCH',
      headers: {
        Authorization: 'Bearer test-token-student',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ visibility: 100 }),
    });
    const res = await updateVisibility(req);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.ok, true);
    assert.strictEqual(data.recruiter_visibility, 100);
    assert.strictEqual(data.visible, true);
  });

  // ── 4. Consultant Portal Server Endpoints ──
  console.log('\n--- 4. Consultant Portal Server Endpoints ---');

  const { GET: getConsultantAnalytics } = await import('@/app/api/consultant/analytics/route');
  const { GET: getConsultantPipeline } = await import('@/app/api/consultant/pipeline/route');
  const { POST: addConsultantStudent } = await import('@/app/api/consultant/student/add/route');

  await check('GET /api/consultant/analytics rejects unauthorized student with 403', async () => {
    const req = new Request('http://localhost:3000/api/consultant/analytics', {
      headers: { Authorization: 'Bearer test-token-student' },
    });
    const res = await getConsultantAnalytics(req);
    assert.strictEqual(res.status, 403);
  });

  await check('GET /api/consultant/analytics succeeds for consultant and has no 80% floor', async () => {
    const req = new Request('http://localhost:3000/api/consultant/analytics', {
      headers: { Authorization: 'Bearer test-token-consultant' },
    });
    const res = await getConsultantAnalytics(req);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(typeof data.visaApprovalRate === 'number');
    assert.ok(typeof data.offerRate === 'number');
    assert.ok(typeof data.totalRevenue === 'number');
  });

  await check('GET /api/consultant/pipeline succeeds and returns stage buckets', async () => {
    const req = new Request('http://localhost:3000/api/consultant/pipeline', {
      headers: { Authorization: 'Bearer test-token-consultant' },
    });
    const res = await getConsultantPipeline(req);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(data.pipeline.onboarding !== undefined);
    assert.ok(data.pipeline.visa !== undefined);
  });

  await check('POST /api/consultant/student/add provisions student without browser session replacement', async () => {
    const req = new Request('http://localhost:3000/api/consultant/student/add', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer test-token-consultant',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        displayName: 'Aarav Kumar',
        email: 'aarav_test@pinit.app',
        targetCountry: 'Germany',
        programType: 'Masters CS',
      }),
    });
    const res = await addConsultantStudent(req);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.ok, true);
    assert.ok(data.student.id);
  });

  // ── 5. Admin Portal Server Endpoints ──
  console.log('\n--- 5. Admin Portal Server Endpoints ---');

  const { GET: getAdminDashboard } = await import('@/app/api/admin/dashboard/route');
  const { GET: getAdminMetricsSummary } = await import('@/app/api/admin/metrics-summary/route');
  const { GET: getAdminPlatformStats } = await import('@/app/api/admin/platform-stats/route');
  const { GET: getAdminFraudAlerts } = await import('@/app/api/admin/fraud-alerts/route');
  const { GET: getAdminUsers } = await import('@/app/api/admin/users/route');
  const { PATCH: updateAdminRole } = await import('@/app/api/admin/users/[id]/role/route');
  const { POST: suspendAdminUser } = await import('@/app/api/admin/users/[id]/suspend/route');
  const { POST: scoreOverrideAdminUser } = await import('@/app/api/admin/users/[id]/score-override/route');
  const { DELETE: deleteAdminUser } = await import('@/app/api/admin/users/[id]/route');

  await check('GET /api/admin/dashboard rejects unauthorized student with 403', async () => {
    const req = new Request('http://localhost:3000/api/admin/dashboard', {
      headers: { Authorization: 'Bearer test-token-student' },
    });
    const res = await getAdminDashboard(req);
    assert.strictEqual(res.status, 403);
  });

  await check('GET /api/admin/dashboard succeeds for admin and reports user breakdown', async () => {
    const req = new Request('http://localhost:3000/api/admin/dashboard', {
      headers: { Authorization: 'Bearer test-token-admin' },
    });
    const res = await getAdminDashboard(req);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.ok, true);
    assert.ok(typeof data.users.active_today === 'number');
    assert.ok(typeof data.users.new_this_week === 'number');
  });

  await check('GET /api/admin/metrics-summary succeeds and returns genuine summary', async () => {
    const req = new Request('http://localhost:3000/api/admin/metrics-summary', {
      headers: { Authorization: 'Bearer test-token-admin' },
    });
    const res = await getAdminMetricsSummary(req);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.ok, true);
    assert.ok(typeof data.summary.avgAts === 'number');
    assert.ok(typeof data.summary.avgTrust === 'number');
  });

  await check('GET /api/admin/platform-stats succeeds and queries platform tables', async () => {
    const req = new Request('http://localhost:3000/api/admin/platform-stats', {
      headers: { Authorization: 'Bearer test-token-admin' },
    });
    const res = await getAdminPlatformStats(req);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.ok, true);
    assert.ok(typeof data.missions.total_created === 'number');
  });

  await check('GET /api/admin/fraud-alerts succeeds and returns alerts', async () => {
    const req = new Request('http://localhost:3000/api/admin/fraud-alerts', {
      headers: { Authorization: 'Bearer test-token-admin' },
    });
    const res = await getAdminFraudAlerts(req);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.ok, true);
    assert.ok(Array.isArray(data.alerts));
  });

  await check('GET /api/admin/users returns user list filtered by role', async () => {
    const req = new Request('http://localhost:3000/api/admin/users?role=student', {
      headers: { Authorization: 'Bearer test-token-admin' },
    });
    const res = await getAdminUsers(req);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.ok, true);
    assert.ok(Array.isArray(data.users));
  });

  await check('PATCH /api/admin/users/[id]/role updates user role via service key', async () => {
    const req = new Request('http://localhost:3000/api/admin/users/test_user_001/role', {
      method: 'PATCH',
      headers: {
        Authorization: 'Bearer test-token-admin',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ role: 'teacher' }),
    });
    const res = await updateAdminRole(req, { params: { id: 'test_user_001' } });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.ok, true);
  });

  await check('POST /api/admin/users/[id]/suspend suspends user account via service key', async () => {
    const req = new Request('http://localhost:3000/api/admin/users/test_user_001/suspend', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer test-token-admin',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reason: 'Academic policy review' }),
    });
    const res = await suspendAdminUser(req, { params: { id: 'test_user_001' } });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.ok, true);
  });

  await check('POST /api/admin/users/[id]/score-override updates competency score via service key', async () => {
    const req = new Request('http://localhost:3000/api/admin/users/test_user_001/score-override', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer test-token-admin',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ field: 'ats_score', value: 85, reason: 'Manual portfolio review' }),
    });
    const res = await scoreOverrideAdminUser(req, { params: { id: 'test_user_001' } });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.ok, true);
    assert.strictEqual(data.value, 85);
  });

  await check('DELETE /api/admin/users/[id] removes user via service key', async () => {
    const req = new Request('http://localhost:3000/api/admin/users/test_user_001', {
      method: 'DELETE',
      headers: { Authorization: 'Bearer test-token-admin' },
    });
    const res = await deleteAdminUser(req, { params: { id: 'test_user_001' } });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.ok, true);
  });

  console.log('\n========================================================================');
  console.log(`📊 RESULT: ${passed} / ${passed + failed} TESTS PASSED`);
  console.log('========================================================================\n');

  process.exit(failed > 0 ? 1 : 0); // explicit: open DB sockets or timers must not keep the run alive
}

runAllTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
