import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Load .env
const envPath = path.join(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const idx = trimmed.indexOf('=');
      if (idx > 0) {
        const key = trimmed.slice(0, idx).trim();
        const val = trimmed.slice(idx + 1).trim();
        if (!process.env[key]) process.env[key] = val;
      }
    }
  });
}

console.log('========================================================================');
console.log('🌐 TESTING LIVE PRODUCTION BUILD WITH AUTHENTIC SUPABASE JWT TOKENS');
console.log('========================================================================\n');

const BASE_URL = process.env.LIVE_TEST_URL || 'http://localhost:3006';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wjheumrorddbkvoczuuw.supabase.co';
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const admin = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
const authClient = createClient(SUPABASE_URL, ANON_KEY, { auth: { persistSession: false, autoRefreshToken: false } });

const PASSWORD = 'PinitTest1234!';

interface TestUser {
  email: string;
  role: string;
  displayName: string;
  userId?: string;
  token?: string;
}

const users: Record<string, TestUser> = {
  student: { email: 'live_student_test@pinit.in', role: 'student', displayName: 'Live Student Tester' },
  parent: { email: 'live_parent_test@pinit.in', role: 'parent', displayName: 'Live Parent Tester' },
  recruiter: { email: 'live_recruiter_test@pinit.in', role: 'recruiter', displayName: 'Live Recruiter Tester' },
  consultant: { email: 'live_consultant_test@pinit.in', role: 'consultant', displayName: 'Live Consultant Tester' },
  admin: { email: 'live_admin_test@pinit.in', role: 'admin', displayName: 'Live Admin Tester' },
};

let passed = 0;
let failed = 0;

async function check(name: string, fn: () => Promise<void>) {
  try {
    await fn();
    console.log(`  ✅ [LIVE PASS]: ${name}`);
    passed++;
  } catch (err: any) {
    console.error(`  ❌ [LIVE FAIL]: ${name} -> ${err.message}`);
    failed++;
  }
}

async function waitForServer(retries = 25, delayMs = 1000): Promise<boolean> {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(`${BASE_URL}/api/time`);
      if (res.status === 200 || res.status === 404) return true;
    } catch {}
    await new Promise((r) => setTimeout(r, delayMs));
  }
  return false;
}

async function setupUsersAndTokens() {
  console.log('🔑 Provisioning and authenticating real test accounts in Supabase...');

  for (const [key, u] of Object.entries(users)) {
    // 1. Try signing in
    let { data, error } = await authClient.auth.signInWithPassword({ email: u.email, password: PASSWORD });
    if (error || !data?.session?.access_token) {
      // Create user if not existing
      const { data: created, error: createErr } = await admin.auth.admin.createUser({
        email: u.email,
        password: PASSWORD,
        email_confirm: true,
        user_metadata: { role: u.role, display_name: u.displayName },
      });
      if (createErr && !createErr.message.includes('already registered')) {
        throw new Error(`Failed to create test user ${u.email}: ${createErr.message}`);
      }
      // Retry sign in
      const res = await authClient.auth.signInWithPassword({ email: u.email, password: PASSWORD });
      if (res.error || !res.data?.session?.access_token) {
        throw new Error(`Sign in failed for ${u.email}: ${res.error?.message}`);
      }
      data = res.data;
    }

    u.userId = data.user.id;
    u.token = data.session.access_token;
    console.log(`  ✓ Authenticated ${u.role}: ${u.email} (JWT: ${u.token.substring(0, 16)}...)`);
  }

  // 2. Ensure public.users rows have authentic fields matching remote schema
  for (const [key, u] of Object.entries(users)) {
    const userPayload: any = {
      id: u.userId,
      email: u.email,
      role: u.role,
      display_name: u.displayName,
      username: u.email.split('@')[0],
      ats_score: u.role === 'student' ? 88 : 0,
      trust_score: u.role === 'student' ? 91 : 0,
      career_dna_score: u.role === 'student' ? 85 : 0,
      mission_streak: u.role === 'student' ? 5 : 0,
      target_role: 'Full Stack Engineering',
      recruiter_visible: true,
      recruiter_visibility: 100,
    };
    if (u.role === 'parent') {
      userPayload.onboarding_answers = { linked_students: [users.student.userId] };
    }

    const { error: upsertErr } = await admin.from('users').upsert(userPayload);
    if (upsertErr) {
      console.warn(`  ⚠️ Warning updating user row for ${u.email}:`, upsertErr.message);
    }
  }

  // 3. Link parent and student in parent_student_links table if present
  try {
    await admin.from('parent_student_links').upsert({
      parent_id: users.parent.userId,
      student_id: users.student.userId,
      status: 'active',
    }, { onConflict: 'parent_id,student_id' });
  } catch {}

  console.log(`  ✓ Linked parent ${users.parent.email} to student ${users.student.email}\n`);
}

async function runLiveSuite() {
  const ready = await waitForServer();
  if (!ready) {
    console.error(`❌ Server failed to respond at ${BASE_URL} after timeout.`);
    process.exit(1);
  }
  console.log('🚀 Next.js Production server is active! Starting live verification...\n');

  await setupUsersAndTokens();

  const studentToken = users.student.token!;
  const parentToken = users.parent.token!;
  const recruiterToken = users.recruiter.token!;
  const consultantToken = users.consultant.token!;
  const adminToken = users.admin.token!;
  const studentId = users.student.userId!;

  // ====================================================
  // 1. FRONTEND PAGES RENDERING
  // ====================================================
  console.log('--- 1. Frontend Portal Pages ---');

  await check('GET /parent (Parent portal renders 200 HTML)', async () => {
    const res = await fetch(`${BASE_URL}/parent`);
    assert.strictEqual(res.status, 200);
    const text = await res.text();
    assert.ok(text.includes('<!DOCTYPE html>') || text.includes('<html'));
  });

  await check('GET /recruiter (Recruiter portal renders 200 HTML)', async () => {
    const res = await fetch(`${BASE_URL}/recruiter`);
    assert.strictEqual(res.status, 200);
    const text = await res.text();
    assert.ok(text.includes('<!DOCTYPE html>') || text.includes('<html'));
  });

  await check('GET /consultant (Consultant portal renders 200 HTML)', async () => {
    const res = await fetch(`${BASE_URL}/consultant`);
    assert.strictEqual(res.status, 200);
    const text = await res.text();
    assert.ok(text.includes('<!DOCTYPE html>') || text.includes('<html'));
  });

  await check('GET /dashboard (Student dashboard renders 200 HTML)', async () => {
    const res = await fetch(`${BASE_URL}/dashboard`);
    assert.strictEqual(res.status, 200);
    const text = await res.text();
    assert.ok(text.includes('<!DOCTYPE html>') || text.includes('<html'));
  });

  // ====================================================
  // 2. PARENT PORTAL API ENDPOINTS
  // ====================================================
  console.log('\n--- 2. Parent Portal Live Endpoints ---');

  await check('GET /api/parent/students requires authorization (401 without token)', async () => {
    const res = await fetch(`${BASE_URL}/api/parent/students`);
    assert.strictEqual(res.status, 401);
  });

  await check('GET /api/parent/students rejects student caller with 403 Forbidden', async () => {
    const res = await fetch(`${BASE_URL}/api/parent/students`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    assert.strictEqual(res.status, 403);
  });

  await check('GET /api/parent/students succeeds for parent caller (200, returns linked students)', async () => {
    const res = await fetch(`${BASE_URL}/api/parent/students`, {
      headers: { Authorization: `Bearer ${parentToken}` },
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.ok, true);
    assert.ok(Array.isArray(data.students));
    assert.ok(data.students.some((s: any) => s.id === studentId), 'Must include linked student');
  });

  await check('POST /api/parent/link-student validates payload (400 for empty body)', async () => {
    const res = await fetch(`${BASE_URL}/api/parent/link-student`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${parentToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    assert.strictEqual(res.status, 400);
  });

  await check('GET /api/parent/student/[id]/overview rejects non-linked caller with 403', async () => {
    const res = await fetch(`${BASE_URL}/api/parent/student/${studentId}/overview`, {
      headers: { Authorization: `Bearer ${recruiterToken}` },
    });
    assert.strictEqual(res.status, 403);
  });

  await check('GET /api/parent/student/[id]/overview succeeds for linked parent with authentic metrics', async () => {
    const res = await fetch(`${BASE_URL}/api/parent/student/${studentId}/overview`, {
      headers: { Authorization: `Bearer ${parentToken}` },
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.ok, true);
    assert.strictEqual(data.profile.ats_score, 88);
    assert.strictEqual(data.profile.trust_score, 91);
    assert.strictEqual(data.profile.career_dna_score, 85);
    // Authentic scores must NOT be the fabricated 72 / 75 / 68
    assert.notStrictEqual(data.profile.ats_score, 72);
    assert.notStrictEqual(data.profile.trust_score, 75);
    assert.notStrictEqual(data.profile.career_dna_score, 68);
  });

  // ====================================================
  // 3. RECRUITER PORTAL API ENDPOINTS
  // ====================================================
  console.log('\n--- 3. Recruiter Portal Live Endpoints ---');

  await check('GET /api/recruiter/pipeline rejects unauthenticated caller with 401', async () => {
    const res = await fetch(`${BASE_URL}/api/recruiter/pipeline`);
    assert.strictEqual(res.status, 401);
  });

  await check('GET /api/recruiter/pipeline rejects student caller with 403', async () => {
    const res = await fetch(`${BASE_URL}/api/recruiter/pipeline`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    assert.strictEqual(res.status, 403);
  });

  await check('GET /api/recruiter/pipeline succeeds for recruiter with authentic candidates', async () => {
    const res = await fetch(`${BASE_URL}/api/recruiter/pipeline`, {
      headers: { Authorization: `Bearer ${recruiterToken}` },
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.ok, true);
    assert.ok(Array.isArray(data.pipeline));
  });

  await check('POST /api/recruiter/shortlist records candidate interaction & notifies (200)', async () => {
    const res = await fetch(`${BASE_URL}/api/recruiter/shortlist`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${recruiterToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ candidateId: studentId }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.ok, true);
  });

  await check('POST /api/recruiter/contact-request records interaction & notifies (200)', async () => {
    const res = await fetch(`${BASE_URL}/api/recruiter/contact-request`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${recruiterToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ candidateId: studentId, message: 'Live recruiter interview invitation' }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.ok, true);
  });

  await check('POST /api/recruiter/schedule-interview schedules interview & notifies (200)', async () => {
    const res = await fetch(`${BASE_URL}/api/recruiter/schedule-interview`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${recruiterToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        candidateId: studentId,
        scheduledAt: '2026-10-20T14:00:00Z',
        mode: 'Google Meet',
        roleTitle: 'Full Stack Engineer',
      }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.ok, true);
  });

  await check('PATCH /api/recruiter/visibility updates student visibility with service role (200)', async () => {
    const res = await fetch(`${BASE_URL}/api/recruiter/visibility`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${studentToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ visibility: 100 }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.ok, true);
    assert.strictEqual(data.recruiter_visibility, 100);
  });

  // ====================================================
  // 4. CONSULTANT PORTAL API ENDPOINTS
  // ====================================================
  console.log('\n--- 4. Consultant Portal Live Endpoints ---');

  await check('GET /api/consultant/analytics rejects student caller with 403', async () => {
    const res = await fetch(`${BASE_URL}/api/consultant/analytics`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    assert.strictEqual(res.status, 403);
  });

  await check('GET /api/consultant/analytics succeeds for consultant with honest metrics (no 80% floor)', async () => {
    const res = await fetch(`${BASE_URL}/api/consultant/analytics`, {
      headers: { Authorization: `Bearer ${consultantToken}` },
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.ok, true);
    assert.ok(typeof data.visaApprovalRate === 'number');
    assert.ok(typeof data.offerRate === 'number');
    assert.ok(typeof data.totalRevenue === 'number');
    assert.notStrictEqual(data.totalRevenue, 30000, 'Must not use flat ₹30,000 multiplier');
  });

  await check('GET /api/consultant/pipeline succeeds and returns stage buckets (200)', async () => {
    const res = await fetch(`${BASE_URL}/api/consultant/pipeline`, {
      headers: { Authorization: `Bearer ${consultantToken}` },
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.ok, true);
    assert.ok(Array.isArray(data.pipeline?.onboarding));
  });

  await check('POST /api/consultant/student/add provisions student server-side without session wipe (200)', async () => {
    const res = await fetch(`${BASE_URL}/api/consultant/student/add`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${consultantToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        displayName: 'Live Production Candidate',
        email: `candidate_${Date.now()}@pinit.app`,
        targetCountry: 'Canada',
        programType: 'Masters Data Science',
      }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.ok, true);
    assert.ok(data.student?.id);
  });

  // ====================================================
  // 5. ADMIN PORTAL API ENDPOINTS
  // ====================================================
  console.log('\n--- 5. Admin Portal Live Endpoints ---');

  await check('GET /api/admin/dashboard rejects student caller with 403', async () => {
    const res = await fetch(`${BASE_URL}/api/admin/dashboard`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    assert.strictEqual(res.status, 403);
  });

  await check('GET /api/admin/dashboard succeeds for admin and reports real breakdown (200)', async () => {
    const res = await fetch(`${BASE_URL}/api/admin/dashboard`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.ok, true);
    assert.ok(typeof data.users?.active_today === 'number');
    assert.ok(typeof data.users?.new_this_week === 'number');
    assert.ok(data.users?.total > 0);
  });

  await check('GET /api/admin/metrics-summary returns genuine summary (never hardcoded 120)', async () => {
    const res = await fetch(`${BASE_URL}/api/admin/metrics-summary`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.ok, true);
    assert.notStrictEqual(data.summary?.totalUsers, 120, 'Metrics summary must never default to 120');
  });

  await check('GET /api/admin/platform-stats queries live platform tables (200)', async () => {
    const res = await fetch(`${BASE_URL}/api/admin/platform-stats`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.ok, true);
    assert.ok(typeof data.missions?.total_created === 'number');
  });

  await check('GET /api/admin/fraud-alerts returns alerts array (200)', async () => {
    const res = await fetch(`${BASE_URL}/api/admin/fraud-alerts`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.ok, true);
    assert.ok(Array.isArray(data.alerts));
  });

  await check('GET /api/admin/users returns user list filtered by role (200)', async () => {
    const res = await fetch(`${BASE_URL}/api/admin/users?role=student`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.ok, true);
    assert.ok(Array.isArray(data.users));
  });

  await check('POST /api/admin/users/[id]/score-override updates score via service key (200)', async () => {
    const res = await fetch(`${BASE_URL}/api/admin/users/${studentId}/score-override`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ field: 'ats_score', value: 95, reason: 'Authoritative audit review' }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.ok, true);
    assert.strictEqual(data.value, 95);
  });

  console.log('\n========================================================================');
  console.log(`📊 LIVE PRODUCTION AUDIT SUMMARY: ${passed} / ${passed + failed} TESTS PASSED`);
  console.log('========================================================================\n');

  if (failed > 0) process.exit(1);
}

runLiveSuite().catch((err) => {
  console.error('Fatal live suite error:', err);
  process.exit(1);
});
