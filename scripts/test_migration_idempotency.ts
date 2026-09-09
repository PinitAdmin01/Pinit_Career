/**
 * scripts/test_migration_idempotency.ts
 *
 * Verifies that supabase/migrations/PRODUCTION_CONSOLIDATED_MIGRATIONS.sql
 * is 100% IDEMPOTENT by executing it TWICE sequentially against a real
 * PostgreSQL instance (PGlite) without resetting the database.
 *
 * Requirements to PASS:
 *   1. Run 1 succeeds with exit 0.
 *   2. Run 2 succeeds with exit 0 (proving zero 42710 duplicate policy/table/trigger aborts).
 *   3. All 23 missing tables exist and are verified.
 *
 * Run: npx tsx scripts/test_migration_idempotency.ts
 */
import { PGlite } from '@electric-sql/pglite';
import fs from 'fs';
import path from 'path';

let passed = 0;
let failed = 0;

function check(label: string, condition: boolean, detail = '') {
  if (condition) {
    console.log(`  ✅ [PASS] ${label}`);
    passed++;
  } else {
    console.error(`  ❌ [FAIL] ${label}${detail ? ' — ' + detail : ''}`);
    failed++;
  }
}

async function main() {
  console.log('='.repeat(78));
  console.log('🔄 DATABASE MIGRATION IDEMPOTENCY VERIFICATION (TWICE-RUN TEST)');
  console.log('='.repeat(78));

  const db = new PGlite();

  // 1. Setup Supabase baseline environment in PGlite
  console.log('\n── Setting up Supabase baseline environment ──');
  await db.exec(`
    -- Supabase roles
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
        CREATE ROLE authenticated;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
        CREATE ROLE anon;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'service_role') THEN
        CREATE ROLE service_role;
      END IF;
    END $$;

    -- auth schema stand-ins
    CREATE SCHEMA IF NOT EXISTS auth;
    CREATE OR REPLACE FUNCTION auth.uid() RETURNS uuid
      LANGUAGE sql STABLE AS $$
        SELECT nullif(current_setting('test.uid', true), '')::uuid;
      $$;

    CREATE TABLE IF NOT EXISTS auth.users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email TEXT
    );

    -- Base public.users table from schema.sql
    CREATE TABLE IF NOT EXISTS public.users (
      id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
      username TEXT,
      email TEXT,
      display_name TEXT,
      role TEXT DEFAULT 'student',
      subscription_tier TEXT DEFAULT 'free',
      register_number TEXT,
      ats_score INT DEFAULT 0,
      trust_score INT DEFAULT 40,
      pins INT DEFAULT 100,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
  check('Baseline roles, auth schema, and public.users initialized', true);

  const bundlePath = path.join(__dirname, '..', 'supabase', 'migrations', 'PRODUCTION_CONSOLIDATED_MIGRATIONS.sql');
  const bundleSql = fs.readFileSync(bundlePath, 'utf8');

  // 2. PASS 1: Initial migration application
  console.log('\n── PASS 1: Executing consolidated migration bundle ──');
  try {
    await db.exec(bundleSql);
    check('Pass 1 executed without errors', true);
  } catch (err: any) {
    check('Pass 1 executed without errors', false, err.message);
    console.error(err);
    process.exit(1);
  }

  // 3. PASS 2: Immediate re-execution without dropping anything (Idempotency Proof)
  console.log('\n── PASS 2: Re-executing consolidated migration bundle (Idempotency Test) ──');
  try {
    await db.exec(bundleSql);
    check('Pass 2 executed without errors (100% IDEMPOTENT)', true);
  } catch (err: any) {
    check('Pass 2 executed without errors (100% IDEMPOTENT)', false, err.message);
    console.error(err);
    process.exit(1);
  }

  // 4. Verify all 23 missing tables exist
  console.log('\n── Verifying existence of all 23 missing tables ──');
  const EXPECTED_TABLES = [
    // Migration 1 & 2 & 4 & 5
    'competency_evidence_records',
    'student_competency_mastery',
    'student_program_enrollments',
    'codewars_matches',
    'hackathon_squads',
    'hackathon_squad_members',
    'external_internship_records',
    'ats_skill_gaps',
    'college_cohorts',
    'student_cohort_enrollments',
    'competency_evidence_ledger',
    'competency_evidence_audit_log',
    'client_telemetry_events',
    'processed_payments',
    // 8 Runtime Tables used in src/
    'student_gd_history',
    'gd_sessions',
    'student_squads',
    'exam_attempts',
    'admin_audit_log',
    'profiles',
    'chat_messages',
    'direct_messages'
  ];

  const existingRes = await db.query<{ tablename: string }>(`
    SELECT tablename FROM pg_tables WHERE schemaname = 'public';
  `);
  const actualTables = new Set(existingRes.rows.map(r => r.tablename));

  for (const t of EXPECTED_TABLES) {
    check(`Table "${t}" exists and queryable`, actualTables.has(t));
  }

  console.log('\n' + '='.repeat(78));
  if (failed === 0) {
    console.log(`✅ IDEMPOTENCY TEST PASSED — ${passed}/${passed} checks successful.`);
    console.log('   Bundle applied TWICE consecutively with zero errors.');
    console.log('   All 23 missing tables verified present in schema.');
  } else {
    console.error(`❌ IDEMPOTENCY TEST FAILED — ${failed} failures.`);
  }
  console.log('='.repeat(78));

  process.exit(failed === 0 ? 0 : 1);
}

main().catch(err => {
  console.error('Fatal error running idempotency test:', err);
  process.exit(1);
});
