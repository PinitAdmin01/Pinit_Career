import { PGlite } from '@electric-sql/pglite';
import fs from 'fs';
import path from 'path';

async function testPgliteSecurity() {
  console.log('Testing anon and authenticated permissions in PGlite...');
  const db = new PGlite();

  // Setup roles
  await db.exec(`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
        CREATE ROLE anon NOLOGIN;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
        CREATE ROLE authenticated NOLOGIN;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'service_role') THEN
        CREATE ROLE service_role NOLOGIN;
      END IF;
    END $$;

    CREATE SCHEMA IF NOT EXISTS auth;
    CREATE OR REPLACE FUNCTION auth.uid() RETURNS uuid AS $$
      SELECT NULLIF(current_setting('request.jwt.claim.sub', true), '')::uuid;
    $$ LANGUAGE sql STABLE;

    CREATE TABLE IF NOT EXISTS auth.users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email TEXT
    );

    CREATE TABLE IF NOT EXISTS public.users (
      id UUID PRIMARY KEY,
      email TEXT,
      display_name TEXT,
      role TEXT DEFAULT 'student',
      subscription_tier TEXT DEFAULT 'free',
      ats_score INTEGER DEFAULT 0,
      trust_score INTEGER DEFAULT 40,
      pins INTEGER DEFAULT 100,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    GRANT SELECT ON public.users TO authenticated;
  `);

  // Run the consolidated migration
  const migrationPath = path.join(process.cwd(), 'supabase', 'migrations', 'PRODUCTION_CONSOLIDATED_MIGRATIONS.sql');
  const sql = fs.readFileSync(migrationPath, 'utf-8');
  await db.exec(sql);

  // Insert test user
  const testUserId = '11111111-1111-1111-1111-111111111111';
  await db.query(`
    INSERT INTO auth.users (id, email)
    VALUES ($1, 'student@test.com');
  `, [testUserId]);
  await db.query(`
    INSERT INTO public.users (id, email, display_name, role, ats_score, trust_score, pins)
    VALUES ($1, 'student@test.com', 'Test Student', 'student', 85, 90, 500);
  `, [testUserId]);

  console.log('Baseline data inserted.');

  // Test 1: ANON select on profiles
  try {
    await db.exec(`SET ROLE anon;`);
    const res = await db.query(`SELECT * FROM public.profiles;`);
    if (res.rows.length > 0) {
      console.error('❌ LEAK: anon was able to select from profiles!', res.rows);
      process.exit(1);
    }
  } catch (err: any) {
    console.log('✅ anon SELECT on profiles rejected:', err.message);
  }

  // Test 2: ANON select on chat_messages
  try {
    await db.exec(`SET ROLE anon;`);
    const res = await db.query(`SELECT * FROM public.chat_messages;`);
    if (res.rows.length > 0) {
      console.error('❌ LEAK: anon was able to select from chat_messages!', res.rows);
      process.exit(1);
    }
  } catch (err: any) {
    console.log('✅ anon SELECT on chat_messages rejected:', err.message);
  }

  // Test 3: AUTHENTICATED selecting sensitive columns (role, pins) on profiles
  try {
    await db.exec(`
      RESET ROLE;
      SET ROLE authenticated;
    `);
    const res = await db.query(`SELECT role, pins FROM public.profiles;`);
    console.error('❌ LEAK: authenticated was able to select role/pins from profiles!', res.rows);
    process.exit(1);
  } catch (err: any) {
    console.log('✅ authenticated SELECT of (role, pins) rejected:', err.message);
  }

  // Test 4: AUTHENTICATED selecting leaderboard columns on profiles
  try {
    await db.exec(`
      RESET ROLE;
      SET ROLE authenticated;
    `);
    const res = await db.query(`SELECT id, display_name, attention_accuracy, games_played FROM public.profiles;`);
    console.log(`✅ authenticated SELECT of allowed leaderboard columns succeeded (${res.rows.length} rows)`);
  } catch (err: any) {
    console.error('❌ ERROR: authenticated failed to select allowed columns:', err.message);
    process.exit(1);
  }

  // Test 5: AUTHENTICATED selecting from leaderboard_profiles VIEW
  try {
    await db.exec(`
      RESET ROLE;
      SET ROLE authenticated;
    `);
    const res = await db.query(`SELECT * FROM public.leaderboard_profiles;`);
    console.log(`✅ authenticated SELECT from leaderboard_profiles view succeeded (${res.rows.length} rows)`);
  } catch (err: any) {
    console.error('❌ ERROR: authenticated failed to query leaderboard_profiles view:', err.message);
    process.exit(1);
  }

  // Test 6: ANON selecting from leaderboard_profiles VIEW
  try {
    await db.exec(`
      RESET ROLE;
      SET ROLE anon;
    `);
    const res = await db.query(`SELECT * FROM public.leaderboard_profiles;`);
    console.error('❌ LEAK: anon was able to select from leaderboard_profiles view!', res.rows);
    process.exit(1);
  } catch (err: any) {
    console.log('✅ anon SELECT on leaderboard_profiles view rejected:', err.message);
  }

  // Test 7: CHAT_MESSAGES cross-user scoping test
  // Insert a message from user2
  const user2Id = '22222222-2222-2222-2222-222222222222';
  await db.exec(`
    RESET ROLE;
    INSERT INTO auth.users (id, email) VALUES ('${user2Id}', 'student2@test.com') ON CONFLICT DO NOTHING;
    INSERT INTO public.users (id, email, display_name, role) VALUES ('${user2Id}', 'student2@test.com', 'Student 2', 'student') ON CONFLICT DO NOTHING;
    INSERT INTO public.chat_messages (id, room_id, user_id, sender_name, sender_role, content, timestamp)
    VALUES ('msg_test_2', 'general', '${user2Id}', 'Student 2', 'student', 'Private session text', 1700000000);
  `);

  // Student 1 queries chat_messages
  try {
    await db.exec(`
      SET ROLE authenticated;
      SELECT set_config('request.jwt.claim.sub', '${testUserId}', false);
    `);
    const res = await db.query(`SELECT * FROM public.chat_messages;`);
    if (res.rows.length === 0) {
      console.log('✅ chat_messages cross-user isolation verified: Student 1 cannot read Student 2 messages (0 rows)');
    } else {
      console.error('❌ LEAK: Student 1 was able to read Student 2 chat messages!', res.rows);
      process.exit(1);
    }
  } catch (err: any) {
    console.log('✅ chat_messages RLS protected:', err.message);
  }

  // Student 2 queries chat_messages
  try {
    await db.exec(`
      SET ROLE authenticated;
      SELECT set_config('request.jwt.claim.sub', '${user2Id}', false);
    `);
    const res = await db.query(`SELECT * FROM public.chat_messages;`);
    if (res.rows.length === 1 && res.rows[0].id === 'msg_test_2') {
      console.log('✅ chat_messages own-row read verified: Student 2 can read their own message (1 row)');
    } else {
      console.error('❌ ERROR: Student 2 failed to read their own message!', res.rows);
      process.exit(1);
    }
  } catch (err: any) {
    console.error('❌ ERROR querying own chat messages:', err.message);
    process.exit(1);
  }

  await db.close();
  console.log('====================================================');
  console.log('✅ ALL 8 SECURITY CHECKS PASSED: 0 LEAKS DETECTED');
  console.log('====================================================');
}

testPgliteSecurity().catch(err => {
  console.error('Fatal test failure:', err);
  process.exit(1);
});
