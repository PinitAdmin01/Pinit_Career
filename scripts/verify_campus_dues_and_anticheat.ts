/**
 * scripts/verify_campus_dues_and_anticheat.ts
 * Friend 3 Verification: Database Architect, Campus ERP & Anti-Cheat (P3)
 *
 * Verifies:
 * Task 3.1: Fix Campus Status Trigger & Isolate Finance Dues (Fix N1 & C3)
 * Task 3.2: Restore Complete Anti-Cheat Protection (Fix N4 & N5)
 */

import { PGlite } from '@electric-sql/pglite';
import assert from 'assert';
import fs from 'fs';
import path from 'path';

let passed = 0;

function report(name: string) {
  console.log(`  ✅ [PASS] ${name}`);
  passed++;
}

async function run() {
  console.log('========================================================================');
  console.log('🛡️ RUNNING FRIEND 3: CAMPUS DUES & ANTI-CHEAT VERIFICATION');
  console.log('========================================================================\n');

  // ── 1. FILE EXISTENCE & SYNTAX AUDIT ──
  console.log('── SECTION 1: Migration & Schema Consistency Audit ──');
  const migPath = path.resolve('supabase/migrations/20260918_fix_campus_dues_and_anticheat.sql');
  assert.ok(fs.existsSync(migPath), 'Migration 20260918_fix_campus_dues_and_anticheat.sql must exist');
  const migSql = fs.readFileSync(migPath, 'utf8');

  // Assertions on migration file
  assert.ok(migSql.includes('CREATE OR REPLACE FUNCTION public.campus_is_staff()'), 'Must define campus_is_staff');
  assert.ok(migSql.includes("current_user = 'service_role'"), 'campus_is_staff must recognize service_role');
  assert.ok(migSql.includes("NEW.status := 'pending';"), 'check_student_campus_status_immutable must force pending on insert');
  assert.ok(migSql.includes('DROP TRIGGER IF EXISTS trg_guard_status_finance_dues ON public.finance_dues;'), 'Must drop status trigger from finance_dues');
  assert.ok(migSql.includes('CREATE OR REPLACE FUNCTION public.check_finance_dues_immutable()'), 'Must define check_finance_dues_immutable');
  assert.ok(migSql.includes('CREATE POLICY "campus_dues_select_own" ON public.finance_dues'), 'Must define campus_dues_select_own');
  assert.ok(migSql.includes('CREATE OR REPLACE FUNCTION public.prevent_privilege_escalation()'), 'Must define prevent_privilege_escalation');
  assert.ok(migSql.includes('new.xp_total := old.xp_total;'), 'Must restore xp_total protection');
  assert.ok(migSql.includes('new.completed_quests := old.completed_quests;'), 'Must restore completed_quests protection');
  assert.ok(migSql.includes('new.career_readiness := old.career_readiness;'), 'Must restore career_readiness protection');
  assert.ok(migSql.includes('new.recruiter_visibility := old.recruiter_visibility;'), 'Must restore recruiter_visibility protection');
  assert.ok(migSql.includes('admin_id IS NULL'), 'audit_logs insert policy must enforce admin_id IS NULL');
  report('Migration 20260918_fix_campus_dues_and_anticheat.sql contains all authoritative definitions');

  // Assertions on campus_tables.sql
  const campusPath = path.resolve('supabase/campus_tables.sql');
  const campusSql = fs.readFileSync(campusPath, 'utf8');
  assert.ok(campusSql.includes("current_user = 'service_role'"), 'campus_tables.sql campus_is_staff must recognize service_role');
  assert.ok(!campusSql.includes("'finance_dues',"), 'campus_tables.sql personal array must not contain finance_dues');
  assert.ok(campusSql.includes('campus_dues_select_own'), 'campus_tables.sql must define campus_dues_select_own');
  assert.ok(campusSql.includes('check_finance_dues_immutable'), 'campus_tables.sql must define check_finance_dues_immutable');
  report('supabase/campus_tables.sql accurately reflects finance_dues isolation and trigger decoupling');

  // Assertions on schema.sql
  const schemaPath = path.resolve('supabase/schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');
  assert.ok(schemaSql.includes('new.xp_total := old.xp_total;'), 'schema.sql must restore anti-cheat guards');
  assert.ok(schemaSql.includes('admin_id is null'), 'schema.sql must lock down audit_logs insert policy');
  report('supabase/schema.sql accurately maintains restored anti-cheat triggers and audit_logs RLS');

  // Assertions on PRODUCTION_CONSOLIDATED_MIGRATIONS.sql
  const consolPath = path.resolve('supabase/migrations/PRODUCTION_CONSOLIDATED_MIGRATIONS.sql');
  const consolSql = fs.readFileSync(consolPath, 'utf8');
  assert.ok(consolSql.includes('-- ── 15. Fix Campus Status Trigger, Isolate Finance Dues & Restore Anti-Cheat ─'), 'Consolidated bundle must have Section 15');
  assert.ok(consolSql.indexOf('-- ── 15. Fix Campus Status Trigger, Isolate Finance Dues & Restore Anti-Cheat ─') < consolSql.indexOf('COMMIT;'), 'Section 15 must precede COMMIT;');
  report('supabase/migrations/PRODUCTION_CONSOLIDATED_MIGRATIONS.sql includes Section 15 before COMMIT;');

  // ── 2. PGLITE IN-MEMORY FUNCTIONAL SIMULATION ──
  console.log('\n── SECTION 2: PGlite Functional In-Memory Execution ──');
  const db = new PGlite();

  // Setup Auth, Roles, and public.users schema
  await db.exec(`
    CREATE SCHEMA IF NOT EXISTS auth;
    CREATE TABLE IF NOT EXISTS auth.users (
      id UUID PRIMARY KEY,
      email TEXT
    );

    CREATE OR REPLACE FUNCTION auth.uid() RETURNS UUID AS $$
    BEGIN
      RETURN NULLIF(current_setting('request.jwt.claim.sub', true), '')::UUID;
    END;
    $$ LANGUAGE plpgsql;

    CREATE OR REPLACE FUNCTION auth.jwt() RETURNS JSONB AS $$
    BEGIN
      RETURN jsonb_build_object(
        'sub', current_setting('request.jwt.claim.sub', true),
        'email', current_setting('request.jwt.claim.email', true),
        'role', current_setting('request.jwt.claim.role', true)
      );
    END;
    $$ LANGUAGE plpgsql;

    CREATE TABLE IF NOT EXISTS public.users (
      id UUID PRIMARY KEY REFERENCES auth.users(id),
      email TEXT,
      role TEXT DEFAULT 'student',
      pins INT DEFAULT 0,
      subscription_tier TEXT DEFAULT 'free',
      ats_score INT DEFAULT 0,
      trust_score INT DEFAULT 0,
      subscription_started_at TIMESTAMPTZ,
      subscription_expires_at TIMESTAMPTZ,
      subscription_status TEXT DEFAULT 'none',
      xp_total INT DEFAULT 0,
      xp_level INT DEFAULT 1,
      completed_quests INT DEFAULT 0,
      java_test_passed BOOLEAN DEFAULT FALSE,
      career_dna_score NUMERIC DEFAULT 0,
      career_readiness NUMERIC DEFAULT 0,
      certifications JSONB DEFAULT '[]'::jsonb,
      recruiter_visibility BOOLEAN DEFAULT TRUE,
      intelligence_score NUMERIC DEFAULT 0,
      communication_score NUMERIC DEFAULT 0,
      execution_score NUMERIC DEFAULT 0,
      leadership_score NUMERIC DEFAULT 0,
      consistency_score NUMERIC DEFAULT 0,
      adaptability_score NUMERIC DEFAULT 0,
      confidence_score NUMERIC DEFAULT 0,
      innovation_score NUMERIC DEFAULT 0,
      mission_streak INT DEFAULT 0,
      missions_completed INT DEFAULT 0,
      vault_count INT DEFAULT 0,
      interviews_done INT DEFAULT 0,
      bio TEXT
    );

    CREATE TABLE IF NOT EXISTS public.services_leaves (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      student_id TEXT NOT NULL,
      reason TEXT,
      status TEXT DEFAULT 'pending'
    );

    CREATE TABLE IF NOT EXISTS public.finance_dues (
      student_id TEXT PRIMARY KEY,
      total_term_fees NUMERIC DEFAULT 0,
      scholarship_waiver NUMERIC DEFAULT 0,
      fine_levied NUMERIC DEFAULT 0,
      installments JSONB DEFAULT '[]'::jsonb
    );

    CREATE TABLE IF NOT EXISTS public.audit_logs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      actor_id UUID REFERENCES public.users(id),
      target_id TEXT,
      admin_id UUID REFERENCES public.users(id),
      action TEXT NOT NULL,
      details JSONB DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
        CREATE ROLE authenticated NOLOGIN;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'service_role') THEN
        CREATE ROLE service_role NOLOGIN;
      END IF;
    END;
    $$;
  `);

  // Run the Migration SQL directly inside PGlite
  await db.exec(migSql);

  // Bind prevent_privilege_escalation trigger to users table
  await db.exec(`
    DROP TRIGGER IF EXISTS trg_prevent_privilege_escalation ON public.users;
    CREATE TRIGGER trg_prevent_privilege_escalation
      BEFORE UPDATE ON public.users
      FOR EACH ROW EXECUTE FUNCTION public.prevent_privilege_escalation();
  `);

  // Grant schema access to authenticated
  await db.exec(`
    GRANT USAGE ON SCHEMA public TO authenticated;
    GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
  `);

  const studentId = '11111111-1111-1111-1111-111111111111';
  const otherStudentId = '22222222-2222-2222-2222-222222222222';
  const teacherId = '33333333-3333-3333-3333-333333333333';

  await db.exec(`
    INSERT INTO auth.users (id, email) VALUES
      ('${studentId}', 'student@college.edu'),
      ('${otherStudentId}', 'other@college.edu'),
      ('${teacherId}', 'teacher@college.edu');

    INSERT INTO public.users (id, email, role, xp_total, completed_quests, pins) VALUES
      ('${studentId}', 'student@college.edu', 'student', 100, 2, 50),
      ('${otherStudentId}', 'other@college.edu', 'student', 200, 5, 80),
      ('${teacherId}', 'teacher@college.edu', 'teacher', 0, 0, 0);

    INSERT INTO public.finance_dues (student_id, total_term_fees, scholarship_waiver, fine_levied, installments)
    VALUES
      ('${studentId}', 65000, 5000, 0, '[{"id":"inst-1","amount":30000,"status":"Pending"}]'::jsonb),
      ('${otherStudentId}', 65000, 0, 100, '[]'::jsonb);
  `);

  // Enable FORCE RLS
  await db.exec(`
    ALTER TABLE public.finance_dues FORCE ROW LEVEL SECURITY;
    ALTER TABLE public.audit_logs FORCE ROW LEVEL SECURITY;
    ALTER TABLE public.services_leaves FORCE ROW LEVEL SECURITY;
  `);

  // ── AUDIT 2.1: campus_is_staff() Tests ──
  // Test A: service_role claim
  await db.exec(`
    SET request.jwt.claim.sub = '';
    SET request.jwt.claim.role = 'service_role';
  `);
  const sRoleRes = await db.query<any>('SELECT public.campus_is_staff() as is_staff');
  assert.strictEqual(sRoleRes.rows[0].is_staff, true, 'campus_is_staff() must return true for service_role claim');
  report('campus_is_staff() authoritatively recognizes service_role backend calls');

  // Test B: teacher user
  await db.exec(`
    SET request.jwt.claim.sub = '${teacherId}';
    SET request.jwt.claim.role = 'authenticated';
  `);
  const teacherRes = await db.query<any>('SELECT public.campus_is_staff() as is_staff');
  assert.strictEqual(teacherRes.rows[0].is_staff, true, 'campus_is_staff() must return true for teacher role');
  report('campus_is_staff() authoritatively recognizes teacher/faculty administrative role');

  // Test C: student user
  await db.exec(`
    SET request.jwt.claim.sub = '${studentId}';
    SET request.jwt.claim.role = 'authenticated';
  `);
  const studentRes = await db.query<any>('SELECT public.campus_is_staff() as is_staff');
  assert.strictEqual(studentRes.rows[0].is_staff, false, 'campus_is_staff() must return false for student role');
  report('campus_is_staff() correctly denies plain student role');

  // ── AUDIT 2.2: check_student_campus_status_immutable() on services_leaves ──
  // Student INSERT with pre-approved status must be clamped to pending
  await db.exec(`
    SET ROLE authenticated;
    SET request.jwt.claim.sub = '${studentId}';
    SET request.jwt.claim.role = 'authenticated';
    INSERT INTO public.services_leaves (id, student_id, reason, status)
    VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '${studentId}', 'Medical leave', 'approved');
  `);
  await db.exec('RESET ROLE;');
  const leaveCheck = await db.query<any>(`SELECT status FROM public.services_leaves WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'`);
  assert.strictEqual(leaveCheck.rows[0].status, 'pending', 'Student insert of pre-approved leave must be coerced to pending');
  report('check_student_campus_status_immutable() clamps student INSERT status to pending');

  // Student UPDATE altering status must throw exception
  await db.exec(`
    SET ROLE authenticated;
    SET request.jwt.claim.sub = '${studentId}';
    SET request.jwt.claim.role = 'authenticated';
  `);
  let statusTamperBlocked = false;
  try {
    await db.exec(`UPDATE public.services_leaves SET status = 'approved' WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'`);
  } catch (err: any) {
    statusTamperBlocked = true;
    assert.ok(err.message.includes('Students cannot alter status on campus records'), 'Must raise exact exception');
  }
  await db.exec('RESET ROLE;');
  assert.strictEqual(statusTamperBlocked, true, 'Student cannot tamper with status on existing leave record');
  report('check_student_campus_status_immutable() blocks student self-approval UPDATE with strict exception');

  // Staff UPDATE altering status succeeds
  await db.exec(`
    SET ROLE authenticated;
    SET request.jwt.claim.sub = '${teacherId}';
    SET request.jwt.claim.role = 'authenticated';
    UPDATE public.services_leaves SET status = 'approved' WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
  `);
  await db.exec('RESET ROLE;');
  const staffLeaveCheck = await db.query<any>(`SELECT status FROM public.services_leaves WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'`);
  assert.strictEqual(staffLeaveCheck.rows[0].status, 'approved', 'Staff must be permitted to approve leaves');
  report('Staff successfully updates record status to approved');

  // ── AUDIT 2.3: finance_dues Isolation & Immunity from Missing Column Error ──
  // 1. Updating finance_dues has NO status column and MUST NOT throw runtime error
  await db.exec(`
    SET ROLE authenticated;
    SET request.jwt.claim.sub = '${teacherId}';
    SET request.jwt.claim.role = 'authenticated';
    UPDATE public.finance_dues SET fine_levied = 50 WHERE student_id = '${studentId}';
  `);
  await db.exec('RESET ROLE;');
  const duesUpdateCheck = await db.query<any>(`SELECT fine_levied FROM public.finance_dues WHERE student_id = '${studentId}'`);
  assert.strictEqual(Number(duesUpdateCheck.rows[0].fine_levied), 50, 'Finance dues update must succeed without status column error');
  report('finance_dues UPDATE executes flawlessly without runtime errors (no invalid status check)');

  // 2. Student DELETE on finance_dues is blocked by RLS & row is preserved
  await db.exec(`
    SET ROLE authenticated;
    SET request.jwt.claim.sub = '${studentId}';
    SET request.jwt.claim.role = 'authenticated';
  `);
  await db.exec(`DELETE FROM public.finance_dues WHERE student_id = '${studentId}'`);
  await db.exec('RESET ROLE;');
  const checkPreserved = await db.query<any>(`SELECT * FROM public.finance_dues WHERE student_id = '${studentId}'`);
  assert.strictEqual(checkPreserved.rows.length, 1, 'Student DELETE on finance_dues was blocked by RLS (row preserved)');
  report('finance_dues RLS prevents student from deleting their finance dues row');

  // 3. Student direct UPDATE on finance_dues is blocked by RLS
  await db.exec(`
    SET ROLE authenticated;
    SET request.jwt.claim.sub = '${studentId}';
    SET request.jwt.claim.role = 'authenticated';
  `);
  await db.exec(`UPDATE public.finance_dues SET total_term_fees = 0 WHERE student_id = '${studentId}'`);
  await db.exec('RESET ROLE;');
  const feePreserved = await db.query<any>(`SELECT total_term_fees FROM public.finance_dues WHERE student_id = '${studentId}'`);
  assert.strictEqual(Number(feePreserved.rows[0].total_term_fees), 65000, 'Student UPDATE was blocked by RLS (fees intact)');
  report('finance_dues RLS prevents student from altering fee balances');

  // 4. Dedicated Trigger check_finance_dues_immutable() Defense-in-Depth verification:
  // If a non-staff user attempts an UPDATE or DELETE that reaches the trigger, exception is raised
  await db.exec('ALTER TABLE public.finance_dues NO FORCE ROW LEVEL SECURITY;');
  await db.exec('ALTER TABLE public.finance_dues DISABLE ROW LEVEL SECURITY;');
  let triggerDeleteBlocked = false;
  try {
    await db.exec(`
      SET ROLE authenticated;
      SET request.jwt.claim.sub = '${studentId}';
      SET request.jwt.claim.role = 'authenticated';
      DELETE FROM public.finance_dues WHERE student_id = '${studentId}';
    `);
  } catch (err: any) {
    triggerDeleteBlocked = true;
    assert.ok(err.message.includes('Students cannot modify or delete finance dues records'), 'Must raise exact exception');
  }
  await db.exec('RESET ROLE;');
  assert.strictEqual(triggerDeleteBlocked, true, 'check_finance_dues_immutable() trigger blocks DELETE if reached');
  report('check_finance_dues_immutable() trigger raises exception on non-staff DELETE');

  let triggerUpdateBlocked = false;
  try {
    await db.exec(`
      SET ROLE authenticated;
      SET request.jwt.claim.sub = '${studentId}';
      SET request.jwt.claim.role = 'authenticated';
      UPDATE public.finance_dues SET total_term_fees = 0 WHERE student_id = '${studentId}';
    `);
  } catch (err: any) {
    triggerUpdateBlocked = true;
    assert.ok(err.message.includes('Students cannot modify or delete finance dues records'), 'Must raise exact exception');
  }
  await db.exec('RESET ROLE;');
  assert.strictEqual(triggerUpdateBlocked, true, 'check_finance_dues_immutable() trigger blocks UPDATE if reached');
  report('check_finance_dues_immutable() trigger raises exception on non-staff UPDATE');

  // Re-enable RLS
  await db.exec('ALTER TABLE public.finance_dues ENABLE ROW LEVEL SECURITY;');
  await db.exec('ALTER TABLE public.finance_dues FORCE ROW LEVEL SECURITY;');

  // 4. Student SELECT on finance_dues only sees own row
  await db.exec(`
    SET ROLE authenticated;
    SET request.jwt.claim.sub = '${studentId}';
    SET request.jwt.claim.role = 'authenticated';
  `);
  const studentDuesRead = await db.query<any>('SELECT * FROM public.finance_dues');
  await db.exec('RESET ROLE;');
  assert.strictEqual(studentDuesRead.rows.length, 1, 'Student should only see their own finance dues row');
  assert.strictEqual(studentDuesRead.rows[0].student_id, studentId, 'Row must match studentId');
  report('finance_dues RLS (campus_dues_select_own) isolates student records from peers');

  // ── AUDIT 2.4: Anti-Cheat prevent_privilege_escalation() ──
  await db.exec(`
    SET ROLE authenticated;
    SET request.jwt.claim.sub = '${studentId}';
    SET request.jwt.claim.role = 'authenticated';
    -- Student attempts massive cheat payload: bump XP, pass Java test, grant pins, elevate to admin
    UPDATE public.users SET
      role = 'superadmin',
      pins = 999999,
      xp_total = 50000,
      xp_level = 99,
      completed_quests = 500,
      java_test_passed = TRUE,
      career_readiness = 100,
      recruiter_visibility = FALSE,
      bio = 'Legitimate student profile update'
    WHERE id = '${studentId}';
  `);
  await db.exec('RESET ROLE;');
  const cheatedUser = await db.query<any>(`SELECT role, pins, xp_total, xp_level, completed_quests, java_test_passed, career_readiness, bio FROM public.users WHERE id = '${studentId}'`);
  const user = cheatedUser.rows[0];
  assert.strictEqual(user.role, 'student', 'Role must remain student');
  assert.strictEqual(user.pins, 50, 'Pins must remain 50');
  assert.strictEqual(user.xp_total, 100, 'XP total must remain 100');
  assert.strictEqual(user.completed_quests, 2, 'Completed quests must remain 2');
  assert.strictEqual(user.java_test_passed, false, 'Java test passed must remain false');
  assert.strictEqual(Number(user.career_readiness), 0, 'Career readiness must remain 0');
  assert.strictEqual(user.bio, 'Legitimate student profile update', 'Permitted profile edits (bio) must succeed');
  report('prevent_privilege_escalation() completely reverts all forged anti-cheat columns while allowing bio update');

  // ── AUDIT 2.5: Audit Logs Insert Policy Lockdown ──
  // A: Legitimate self log insertion succeeds
  await db.exec(`
    SET ROLE authenticated;
    SET request.jwt.claim.sub = '${studentId}';
    SET request.jwt.claim.role = 'authenticated';
    INSERT INTO public.audit_logs (actor_id, target_id, admin_id, action)
    VALUES ('${studentId}', '${studentId}', NULL, 'student_login');
  `);
  await db.exec('RESET ROLE;');
  const logCheck = await db.query<any>(`SELECT * FROM public.audit_logs WHERE actor_id = '${studentId}'`);
  assert.strictEqual(logCheck.rows.length, 1, 'Self-audit log must be inserted');
  report('audit_logs permits authenticated student to record legitimate personal activity');

  // B: Forged target_id (injecting into peer feed) fails
  await db.exec(`
    SET ROLE authenticated;
    SET request.jwt.claim.sub = '${studentId}';
    SET request.jwt.claim.role = 'authenticated';
  `);
  let peerInjectionBlocked = false;
  try {
    await db.exec(`
      INSERT INTO public.audit_logs (actor_id, target_id, admin_id, action)
      VALUES ('${studentId}', '${otherStudentId}', NULL, 'fake_peer_strike');
    `);
  } catch (err: any) {
    peerInjectionBlocked = true;
  }
  await db.exec('RESET ROLE;');
  assert.strictEqual(peerInjectionBlocked, true, 'Student cannot inject logs into peer target_id');
  report('audit_logs RLS rejects injection into another student target feed');

  // C: Forged admin_id (spoofing admin action) fails
  await db.exec(`
    SET ROLE authenticated;
    SET request.jwt.claim.sub = '${studentId}';
    SET request.jwt.claim.role = 'authenticated';
  `);
  let adminSpoofBlocked = false;
  try {
    await db.exec(`
      INSERT INTO public.audit_logs (actor_id, target_id, admin_id, action)
      VALUES ('${studentId}', '${studentId}', '${teacherId}', 'fake_admin_approval');
    `);
  } catch (err: any) {
    adminSpoofBlocked = true;
  }
  await db.exec('RESET ROLE;');
  assert.strictEqual(adminSpoofBlocked, true, 'Student cannot inject logs with admin_id');
  report('audit_logs RLS rejects student logs specifying admin_id (blocks admin impersonation)');

  console.log('\n========================================================================');
  console.log(`🏁 FRIEND 3 VERIFICATION COMPLETE: ALL ${passed} CHECKS PASSED`);
  console.log('========================================================================\n');
}

run().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
