// scripts/test_adversarial_whole_app_rls.ts
// Comprehensive Multi-Table Adversarial RLS & Authorization Audit across PostgreSQL

import { PGlite } from '@electric-sql/pglite';
import fs from 'fs';
import path from 'path';

async function runWholeAppRlsAudit() {
  console.log('========================================================================');
  console.log('??? EXECUTING COMPREHENSIVE MULTI-TABLE ADVERSARIAL RLS AUDIT');
  console.log('========================================================================\n');

  const db = new PGlite();

  // 1. Setup mock auth schema & auth.uid() function with nullif handling for anonymous sessions
  await db.exec(`
    CREATE SCHEMA IF NOT EXISTS auth;
    CREATE TABLE IF NOT EXISTS auth.users (
        id UUID PRIMARY KEY,
        email TEXT
    );
    
    CREATE OR REPLACE FUNCTION auth.uid() RETURNS UUID AS $$
    BEGIN
        RETURN nullif(current_setting('request.jwt.claim.sub', true), '')::UUID;
    END;
    $$ LANGUAGE plpgsql;

    CREATE OR REPLACE FUNCTION auth.jwt() RETURNS JSONB AS $$
    BEGIN
        RETURN jsonb_build_object('sub', current_setting('request.jwt.claim.sub', true));
    END;
    $$ LANGUAGE plpgsql;

    DO $$ BEGIN
      CREATE ROLE authenticated NOLOGIN;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
    DO $$ BEGIN
      CREATE ROLE anon NOLOGIN;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `);

  // 2. Load schema.sql (removing uuid-ossp extension call not bundled in PGlite WASM)
  const schemaPath = path.join(process.cwd(), 'supabase', 'schema.sql');
  let schemaSql = fs.readFileSync(schemaPath, 'utf-8');
  schemaSql = schemaSql.replace(/create extension if not exists "uuid-ossp";/gi, '-- uuid-ossp built-in');
  schemaSql = schemaSql.replace(/alter publication supabase_realtime add table public.qr_login_sessions;/gi, '-- realtime publication');
  await db.exec(schemaSql);

  const ledgerPath = path.join(process.cwd(), 'supabase', 'migrations', '20260902_create_evidence_ledger.sql');
  const ledgerSql = fs.readFileSync(ledgerPath, 'utf-8');
  await db.exec(ledgerSql);

  // Force RLS across all sensitive tables
  await db.exec(`
    ALTER TABLE public.users FORCE ROW LEVEL SECURITY;
    ALTER TABLE public.vault_items FORCE ROW LEVEL SECURITY;
    ALTER TABLE public.missions FORCE ROW LEVEL SECURITY;
    ALTER TABLE public.applications FORCE ROW LEVEL SECURITY;
    ALTER TABLE public.interview_sessions FORCE ROW LEVEL SECURITY;
    ALTER TABLE public.notifications FORCE ROW LEVEL SECURITY;
    ALTER TABLE public.competency_evidence_ledger FORCE ROW LEVEL SECURITY;
  `);
  console.log('  ? [PASS] Loaded schema.sql & evidence ledger migrations with FORCE ROW LEVEL SECURITY.\n');

  // 3. Setup test users
  const userA = '11111111-1111-1111-1111-111111111111';
  const userB = '22222222-2222-2222-2222-222222222222';

  await db.exec(`
    GRANT USAGE ON SCHEMA public TO authenticated, anon;
    GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
    GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;

    INSERT INTO auth.users (id, email) VALUES
      ('${userA}', 'usera@example.com'),
      ('${userB}', 'userb@example.com');
  `);

  // 4. Seed records as service role
  await db.exec(`
    INSERT INTO public.users (id, email, display_name, role, pins, ats_score) VALUES
      ('${userA}', 'usera@example.com', 'User A Student', 'student', 100, 50),
      ('${userB}', 'userb@example.com', 'User B Student', 'student', 100, 75);

    INSERT INTO public.vault_items (id, user_id, title, item_type) VALUES
      ('aaaaaaaa-0000-0000-0000-000000000001', '${userA}', 'User A Secret Resume', 'resume'),
      ('bbbbbbbb-0000-0000-0000-000000000002', '${userB}', 'User B Proprietary Code', 'project');

    INSERT INTO public.missions (id, user_id, title) VALUES
      ('aaaaaaaa-0000-0000-0000-000000000003', '${userA}', 'User A Private Mission'),
      ('bbbbbbbb-0000-0000-0000-000000000004', '${userB}', 'User B Private Mission');

    INSERT INTO public.opportunities (id, title, company) VALUES
      ('cccccccc-0000-0000-0000-000000000005', 'Staff Engineer', 'Top Tier Tech');

    INSERT INTO public.applications (id, user_id, opportunity_id) VALUES
      ('app_user_a', '${userA}', 'cccccccc-0000-0000-0000-000000000005'),
      ('app_user_b', '${userB}', 'cccccccc-0000-0000-0000-000000000005');

    INSERT INTO public.interview_sessions (id, user_id, transcript, overall_score) VALUES
      ('aaaaaaaa-0000-0000-0000-000000000008', '${userA}', '[{"q":"A"}]'::jsonb, 85),
      ('bbbbbbbb-0000-0000-0000-000000000009', '${userB}', '[{"q":"B"}]'::jsonb, 95);

    INSERT INTO public.competency_evidence_ledger (
      evidence_code, student_id, course_id, phase_id, month_id, week_id,
      packet_id, day_id, competency_id, evidence_type, source_type, status,
      provenance, assessment_snapshot, integrity_sequence, previous_evidence_hash, evidence_hash
    ) VALUES (
      'EVD-A-001', '${userA}', 'pfs', 'p1', 'm1', 'w1',
      'batch-1', 'd1', 'COMP-001', 'CODE_ARTIFACT', 'FORMATIVE', 'VERIFIED',
      '{"evaluator": "auto"}', '{"score": 100}', 1, 'GENESIS', 'HASH_AAA_111'
    ), (
      'EVD-B-001', '${userB}', 'pfs', 'p1', 'm1', 'w1',
      'batch-1', 'd1', 'COMP-001', 'CODE_ARTIFACT', 'FORMATIVE', 'VERIFIED',
      '{"evaluator": "auto"}', '{"score": 90}', 1, 'GENESIS', 'HASH_BBB_111'
    );
  `);
  console.log('  ? [PASS] Seed data created across 6 user-specific tables.\n');

  // -- AUDIT 1: Anonymous Access Denial --
  await db.exec(`
    SET ROLE anon;
    SELECT set_config('request.jwt.claim.sub', '', false);
  `);
  const anonUsers = await db.query(`SELECT * FROM public.users;`);
  const anonVault = await db.query(`SELECT * FROM public.vault_items;`);
  const anonMissions = await db.query(`SELECT * FROM public.missions;`);
  const anonApps = await db.query(`SELECT * FROM public.applications;`);
  const anonInterviews = await db.query(`SELECT * FROM public.interview_sessions;`);
  const anonEvidence = await db.query(`SELECT * FROM public.competency_evidence_ledger;`);

  if (
    anonUsers.rows.length === 0 &&
    anonVault.rows.length === 0 &&
    anonMissions.rows.length === 0 &&
    anonApps.rows.length === 0 &&
    anonInterviews.rows.length === 0 &&
    anonEvidence.rows.length === 0
  ) {
    console.log('  ? [PASS] Test 1: Anonymous Access Strictly Blocked: 0 private records exposed across all 6 tables.');
  } else {
    console.error('  ? [FAIL] Anonymous access leaked records!');
    process.exit(1);
  }

  // -- AUDIT 2: Cross-Tenant Isolation (User A cannot see User B) --
  await db.exec(`
    SET ROLE authenticated;
    SELECT set_config('request.jwt.claim.sub', '${userA}', false);
  `);

  const uUsers = (await db.query(`SELECT id FROM public.users;`)).rows as any[];
  const uVault = (await db.query(`SELECT user_id FROM public.vault_items;`)).rows as any[];
  const uMissions = (await db.query(`SELECT user_id FROM public.missions;`)).rows as any[];
  const uApps = (await db.query(`SELECT user_id FROM public.applications;`)).rows as any[];
  const uInterviews = (await db.query(`SELECT user_id FROM public.interview_sessions;`)).rows as any[];
  const uEvidence = (await db.query(`SELECT student_id FROM public.competency_evidence_ledger;`)).rows as any[];

  const leaked = [
    ...uUsers.filter(r => r.id !== userA),
    ...uVault.filter(r => r.user_id !== userA),
    ...uMissions.filter(r => r.user_id !== userA),
    ...uApps.filter(r => r.user_id !== userA),
    ...uInterviews.filter(r => r.user_id !== userA),
    ...uEvidence.filter(r => r.student_id !== userA),
  ];

  if (leaked.length === 0 && uUsers.length === 1 && uVault.length === 1) {
    console.log('  ? [PASS] Test 2: Cross-Tenant Isolation: User A cannot read any User B data across all tables.');
  } else {
    console.error('  ? [FAIL] Cross-tenant data leak detected!', leaked);
    process.exit(1);
  }

  // -- AUDIT 3: Cross-Tenant Mutation Denial (User A cannot modify User B) --
  await db.query(`UPDATE public.vault_items SET title = 'Hacked by User A' WHERE user_id = '${userB}';`);
  await db.query(`DELETE FROM public.missions WHERE user_id = '${userB}';`);
  await db.query(`UPDATE public.interview_sessions SET overall_score = 0 WHERE user_id = '${userB}';`);

  // Verify User B records untouched
  await db.exec('RESET ROLE;');
  const bVault = await db.query(`SELECT title FROM public.vault_items WHERE user_id = '${userB}';`);
  const bMissions = await db.query(`SELECT id FROM public.missions WHERE user_id = '${userB}';`);
  const bInterviews = await db.query(`SELECT overall_score FROM public.interview_sessions WHERE user_id = '${userB}';`);

  if (
    (bVault.rows[0] as any).title === 'User B Proprietary Code' &&
    bMissions.rows.length === 1 &&
    (bInterviews.rows[0] as any).overall_score === 95
  ) {
    console.log('  ? [PASS] Test 3: Cross-Tenant Mutation Rejection: User A cannot UPDATE or DELETE User B records.');
  } else {
    console.error('  ? [FAIL] User A succeeded in modifying User B records!');
    process.exit(1);
  }

  // -- AUDIT 4: Self-Privilege Escalation Attack Neutralization --
  await db.exec(`
    SET ROLE authenticated;
    SELECT set_config('request.jwt.claim.sub', '${userA}', false);
  `);
  // Malicious attempt: student changes their own role to admin and awards self 1,000,000 pins
  await db.query(`UPDATE public.users SET role = 'admin', pins = 1000000, ats_score = 100 WHERE id = '${userA}';`);

  await db.exec('RESET ROLE;');
  const aUserAfter = (await db.query(`SELECT role, pins, ats_score FROM public.users WHERE id = '${userA}';`)).rows[0] as any;
  if (aUserAfter.role === 'student' && aUserAfter.pins === 100 && aUserAfter.ats_score === 50) {
    console.log('  ? [PASS] Test 4: Privilege Escalation Neutralized: Self-promotion to admin & pin forgery blocked by trigger.');
  } else {
    console.error('  ? [FAIL] Privilege escalation succeeded!', aUserAfter);
    process.exit(1);
  }

  // -- AUDIT 5: Evidence Ledger Strict Immutability --
  let immutabilityPassed = false;
  try {
    await db.query(`UPDATE public.competency_evidence_ledger SET status = 'REVOKED' WHERE student_id = '${userA}';`);
  } catch (err: any) {
    if (err.message.includes('immutable') || err.message.includes('PERMISSION_DENIED')) {
      immutabilityPassed = true;
    }
  }

  if (immutabilityPassed) {
    console.log('  ? [PASS] Test 5: Competency Evidence Ledger: Append-only immutability enforced against superuser.');
  } else {
    console.error('  ? [FAIL] Evidence ledger record was mutated!');
    process.exit(1);
  }

  console.log('\n========================================================================');
  console.log('?? WHOLE-APP RLS & ADVERSARIAL AUTHORIZATION AUDIT: 100% PASSED');
  console.log('========================================================================');
}

runWholeAppRlsAudit().catch(err => {
  console.error('Fatal whole-app RLS test error:', err);
  process.exit(1);
});
