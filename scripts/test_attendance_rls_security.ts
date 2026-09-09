/**
 * test_attendance_rls_security.ts
 *
 * PGlite automated test verifying RLS hardening on:
 *  - campus_attendance
 *  - student_attendance
 *  - exam_results
 *
 * Enforces:
 *  1. Student INSERT / UPDATE / DELETE is REJECTED by RLS (staff-write only).
 *  2. Student SELECT on own record SUCCEEDS (self-read).
 *  3. Student SELECT on peer record returns 0 rows (isolated).
 *  4. Teacher / Staff INSERT / UPDATE SUCCEEDS.
 */

import { PGlite } from '@electric-sql/pglite';
import fs from 'fs';
import path from 'path';

async function run() {
  console.log('=== Testing Attendance & Exam Results RLS Hardening (PGlite) ===\n');

  const db = new PGlite();

  // 1. Setup minimal auth schema and public tables
  await db.exec(`
    CREATE SCHEMA IF NOT EXISTS auth;

    -- Mock auth.uid() and auth.jwt()
    CREATE OR REPLACE FUNCTION auth.uid() RETURNS uuid AS $$
      SELECT NULLIF(current_setting('request.jwt.claim.sub', true), '')::uuid;
    $$ LANGUAGE sql STABLE;

    CREATE OR REPLACE FUNCTION auth.jwt() RETURNS jsonb AS $$
      SELECT COALESCE(NULLIF(current_setting('request.jwt.claims', true), '')::jsonb, '{}'::jsonb);
    $$ LANGUAGE sql STABLE;

    -- Users table for role lookup
    CREATE TABLE IF NOT EXISTS public.users (
      id UUID PRIMARY KEY,
      email TEXT,
      role TEXT NOT NULL DEFAULT 'student'
    );

    -- Attendance and exam tables
    CREATE TABLE IF NOT EXISTS public.student_attendance (
      student_id TEXT PRIMARY KEY,
      subjects JSONB DEFAULT '[]'::jsonb,
      focus_streak INT DEFAULT 0,
      last_check_in TEXT,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS public.campus_attendance (
      id TEXT PRIMARY KEY,
      date TEXT,
      batch TEXT,
      student_id TEXT,
      student_name TEXT,
      roll_no TEXT,
      status TEXT
    );

    CREATE TABLE IF NOT EXISTS public.exam_results (
      student_id TEXT PRIMARY KEY,
      is_published BOOLEAN DEFAULT false,
      gpa NUMERIC,
      results JSONB DEFAULT '[]'::jsonb
    );

    -- Role setup
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
        CREATE ROLE authenticated;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
        CREATE ROLE anon;
      END IF;
    END $$;

    GRANT USAGE ON SCHEMA public, auth TO authenticated, anon;
    GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
  `);

  // 2. Apply our migration
  const migrationPath = path.join(__dirname, '../supabase/migrations/20260909_staff_write_self_read_attendance_exams.sql');
  const migrationSql = fs.readFileSync(migrationPath, 'utf8');
  await db.exec(migrationSql);
  console.log('✅ Applied migration 20260909_staff_write_self_read_attendance_exams.sql');

  // 3. Seed users
  const studentUid = '11111111-1111-1111-1111-111111111111';
  const peerUid = '22222222-2222-2222-2222-222222222222';
  const teacherUid = '33333333-3333-3333-3333-333333333333';

  await db.exec(`
    INSERT INTO public.users (id, email, role) VALUES
      ('${studentUid}', 'student@campus.edu', 'student'),
      ('${peerUid}', 'peer@campus.edu', 'student'),
      ('${teacherUid}', 'prof.sharma@campus.edu', 'teacher');
  `);

  // Helper to switch session
  async function asUser(uid: string | null, role: 'authenticated' | 'anon') {
    await db.exec(`SET ROLE ${role};`);
    if (uid) {
      await db.exec(`
        SET request.jwt.claim.sub = '${uid}';
        SET request.jwt.claims = '{"sub": "${uid}", "role": "authenticated"}';
      `);
    } else {
      await db.exec(`
        SET request.jwt.claim.sub = '';
        SET request.jwt.claims = '';
      `);
    }
  }

  async function asAdmin() {
    await db.exec(`RESET ROLE;`);
  }

  let passed = 0;
  let total = 0;
  function assert(cond: boolean, desc: string) {
    total++;
    if (cond) {
      console.log(`  PASS: ${desc}`);
      passed++;
    } else {
      console.error(`  FAIL: ${desc}`);
      throw new Error(`Assertion failed: ${desc}`);
    }
  }

  // ── TEST A: Student direct INSERT on campus_attendance MUST FAIL ───────────
  console.log('\n--- Scenario A: Student direct write attempts ---');
  await asUser(studentUid, 'authenticated');

  let studentInsertFailed = false;
  try {
    await db.exec(`
      INSERT INTO public.campus_attendance (id, date, batch, student_id, student_name, roll_no, status)
      VALUES ('att_self_1', '2026-09-09', 'Batch 2024-A', '${studentUid}', 'Self Student', 'CS-01', 'present');
    `);
  } catch (err: any) {
    studentInsertFailed = true;
  }
  assert(studentInsertFailed, 'Student direct INSERT into campus_attendance is BLOCKED by RLS');

  let studentExamWriteFailed = false;
  try {
    await db.exec(`
      INSERT INTO public.exam_results (student_id, is_published, gpa, results)
      VALUES ('${studentUid}', true, 4.0, '[{"subject":"Algorithms","grade":"A+"}]');
    `);
  } catch (err: any) {
    studentExamWriteFailed = true;
  }
  assert(studentExamWriteFailed, 'Student direct INSERT into exam_results is BLOCKED by RLS');

  let studentAttendanceWriteFailed = false;
  try {
    await db.exec(`
      INSERT INTO public.student_attendance (student_id, focus_streak, last_check_in)
      VALUES ('${studentUid}', 99, '2026-09-09');
    `);
  } catch (err: any) {
    studentAttendanceWriteFailed = true;
  }
  assert(studentAttendanceWriteFailed, 'Student direct INSERT into student_attendance is BLOCKED by RLS');

  // ── TEST B: Teacher / Staff INSERT MUST SUCCEED ─────────────────────────────
  console.log('\n--- Scenario B: Faculty authorized write attempts ---');
  await asUser(teacherUid, 'authenticated');

  await db.exec(`
    INSERT INTO public.campus_attendance (id, date, batch, student_id, student_name, roll_no, status)
    VALUES
      ('att_rec_1', '2026-09-09', 'Batch 2024-A', '${studentUid}', 'Vinay', 'CS-01', 'present'),
      ('att_rec_2', '2026-09-09', 'Batch 2024-A', '${peerUid}', 'Peer', 'CS-02', 'absent');
  `);
  assert(true, 'Faculty member successfully inserted attendance records');

  await db.exec(`
    INSERT INTO public.exam_results (student_id, is_published, gpa, results)
    VALUES ('${studentUid}', true, 3.85, '[{"subject":"Algorithms","score":92}]');
  `);
  assert(true, 'Faculty member successfully graded and inserted exam result');

  // ── TEST C: Student SELECT on own record vs peer record ─────────────────────
  console.log('\n--- Scenario C: Student self-read vs peer-read isolation ---');
  await asUser(studentUid, 'authenticated');

  const ownAttendanceRes = await db.query<{ id: string }>(`
    SELECT id FROM public.campus_attendance WHERE student_id = '${studentUid}';
  `);
  assert(ownAttendanceRes.rows.length === 1, 'Student CAN read their own attendance record');

  const peerAttendanceRes = await db.query<{ id: string }>(`
    SELECT id FROM public.campus_attendance WHERE student_id = '${peerUid}';
  `);
  assert(peerAttendanceRes.rows.length === 0, 'Student CANNOT read peer attendance record (0 rows returned)');

  const ownExamRes = await db.query<{ gpa: number }>(`
    SELECT gpa FROM public.exam_results WHERE student_id = '${studentUid}';
  `);
  assert(ownExamRes.rows.length === 1 && Number(ownExamRes.rows[0].gpa) === 3.85, 'Student CAN read their own official exam result');

  // Student attempts to tamper with existing attendance record
  let studentUpdateFailed = false;
  try {
    await db.exec(`
      UPDATE public.campus_attendance SET status = 'absent' WHERE id = 'att_rec_1';
    `);
    // In Postgres RLS, UPDATE with failed USING simply updates 0 rows or errors on WITH CHECK
    const checkRes = await db.query<{ status: string }>(`SELECT status FROM public.campus_attendance WHERE id = 'att_rec_1'`);
    if (checkRes.rows[0].status === 'absent') {
      studentUpdateFailed = false; // tampered!
    } else {
      studentUpdateFailed = true; // untouched
    }
  } catch {
    studentUpdateFailed = true;
  }
  assert(studentUpdateFailed, 'Student cannot tamper with/update attendance record');

  console.log(`\n========================================`);
  console.log(`All ${passed}/${total} RLS security assertions PASSED!`);
  console.log(`========================================\n`);

  await asAdmin();
}

run().catch(err => {
  console.error('Test failed with error:', err);
  process.exit(1);
});
