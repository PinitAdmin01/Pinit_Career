/**
 * scripts/test_subscription_expiry.ts
 *
 * Verifies migration 20260907_subscription_expiry.sql against a REAL PostgreSQL
 * engine (PGlite), not a mock. Proves four things:
 *
 *   1. The migration is valid SQL and applies cleanly.
 *   2. Legacy paid users are backfilled rather than left with a null period.
 *   3. is_subscription_active() treats a NULL or past expiry as INACTIVE —
 *      absence of a period must never mean unlimited access.
 *   4. The privilege-escalation trigger blocks a user from extending their own
 *      subscription_expires_at. Without this, adding the column would have
 *      handed every user a free subscription.
 *
 * Run: npx tsx scripts/test_subscription_expiry.ts
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
  console.log('='.repeat(72));
  console.log('🔐 SUBSCRIPTION EXPIRY MIGRATION AUDIT');
  console.log('='.repeat(72));

  const db = new PGlite();

  // ── Minimal stand-ins for the Supabase environment ────────────────────────
  // PGlite has no auth schema. auth.uid() is stubbed to read a session GUC so
  // the test can switch between "acting as this user" and "acting as service".
  await db.exec(`
    -- Supabase provides these roles; PGlite does not. The migration GRANTs
    -- EXECUTE to 'authenticated', so it must exist for the file to apply.
    do $$ begin
      if not exists (select 1 from pg_roles where rolname = 'authenticated') then
        create role authenticated;
      end if;
      if not exists (select 1 from pg_roles where rolname = 'service_role') then
        create role service_role;
      end if;
    end $$;

    create schema if not exists auth;
    create or replace function auth.uid() returns uuid
      language sql stable as $$
        select nullif(current_setting('test.uid', true), '')::uuid;
      $$;

    create table public.users (
      id uuid primary key,
      role text default 'student',
      pins int default 0,
      ats_score int default 0,
      trust_score int default 40,
      subscription_tier text default 'free'
    );
  `);

  // Pre-existing trigger, as it stood BEFORE this migration.
  await db.exec(`
    create or replace function public.prevent_privilege_escalation()
    returns trigger language plpgsql security definer set search_path = public as $$
    begin
      if new.role is distinct from old.role
         or new.pins is distinct from old.pins
         or coalesce(new.subscription_tier,'free') is distinct from coalesce(old.subscription_tier,'free')
         or new.ats_score is distinct from old.ats_score
         or new.trust_score is distinct from old.trust_score then
        if auth.uid() is not null and auth.uid() = old.id then
          new.role := old.role; new.pins := old.pins;
          new.subscription_tier := old.subscription_tier;
          new.ats_score := old.ats_score; new.trust_score := old.trust_score;
        end if;
      end if;
      return new;
    end; $$;

    drop trigger if exists trg_prevent_privilege_escalation on public.users;
    create trigger trg_prevent_privilege_escalation
      before update on public.users
      for each row execute function public.prevent_privilege_escalation();
  `);

  const LEGACY = '11111111-1111-1111-1111-111111111111';
  const FREE   = '22222222-2222-2222-2222-222222222222';

  // A legacy Pro user who paid before the migration: tier set, no dates.
  await db.exec(`
    insert into public.users (id, subscription_tier) values
      ('${LEGACY}', 'pro'),
      ('${FREE}',   'free');
  `);

  // ── 1. Apply the real migration file ──────────────────────────────────────
  console.log('\n── 1. Migration applies cleanly ──');
  const sqlPath = path.join(__dirname, '..', 'supabase', 'migrations', '20260907_subscription_expiry.sql');
  const migration = fs.readFileSync(sqlPath, 'utf8');
  try {
    await db.exec(migration);
    check('Migration executed without error', true);
  } catch (err: any) {
    check('Migration executed without error', false, err.message);
    console.error('\nMigration failed — aborting.');
    process.exit(1);
  }

  const cols = await db.query<{ column_name: string }>(`
    select column_name from information_schema.columns
     where table_name = 'users'
       and column_name like 'subscription_%'
     order by column_name;
  `);
  const names = cols.rows.map(r => r.column_name);
  check('subscription_started_at added', names.includes('subscription_started_at'));
  check('subscription_expires_at added', names.includes('subscription_expires_at'));
  check('subscription_status added', names.includes('subscription_status'));

  // ── 2. Legacy backfill ────────────────────────────────────────────────────
  console.log('\n── 2. Legacy paid users are backfilled, not stranded ──');
  const legacy = await db.query<any>(`
    select subscription_expires_at, subscription_status
      from public.users where id = '${LEGACY}';
  `);
  check('Legacy pro user received an expiry date', legacy.rows[0].subscription_expires_at !== null);
  check("Legacy pro user marked 'active'", legacy.rows[0].subscription_status === 'active');

  const free = await db.query<any>(`
    select subscription_expires_at from public.users where id = '${FREE}';
  `);
  check('Free user NOT given a period', free.rows[0].subscription_expires_at === null);

  // ── 3. is_subscription_active() semantics ─────────────────────────────────
  console.log('\n── 3. NULL / past expiry must read as INACTIVE ──');
  const activeLegacy = await db.query<any>(`select public.is_subscription_active('${LEGACY}') as v;`);
  check('Backfilled pro user is active', activeLegacy.rows[0].v === true);

  const activeFree = await db.query<any>(`select public.is_subscription_active('${FREE}') as v;`);
  check('Free user is inactive', activeFree.rows[0].v === false);

  // Paid tier but expiry in the past -> must be inactive.
  await db.exec(`
    update public.users
       set subscription_expires_at = now() - interval '1 day'
     where id = '${LEGACY}';
  `);
  const expired = await db.query<any>(`select public.is_subscription_active('${LEGACY}') as v;`);
  check('Expired pro user is inactive', expired.rows[0].v === false);

  // Paid tier with NULL expiry -> must be inactive (absence != licence).
  await db.exec(`update public.users set subscription_expires_at = null where id = '${LEGACY}';`);
  const nullExp = await db.query<any>(`select public.is_subscription_active('${LEGACY}') as v;`);
  check('Pro user with NULL expiry is inactive', nullExp.rows[0].v === false);

  // ── 4. Self-service tampering is blocked ──────────────────────────────────
  console.log('\n── 4. A user cannot extend their own subscription ──');
  await db.exec(`update public.users
                    set subscription_expires_at = now() + interval '30 days',
                        subscription_tier = 'pro'
                  where id = '${LEGACY}';`);           // service-role write, allowed
  const before = await db.query<any>(`select subscription_expires_at from public.users where id='${LEGACY}';`);

  // Now act AS that user and try to grant themselves 10 more years.
  await db.exec(`select set_config('test.uid', '${LEGACY}', false);`);
  await db.exec(`update public.users
                    set subscription_expires_at = now() + interval '10 years'
                  where id = '${LEGACY}';`);
  const after = await db.query<any>(`select subscription_expires_at from public.users where id='${LEGACY}';`);
  await db.exec(`select set_config('test.uid', '', false);`);

  const beforeMs = new Date(before.rows[0].subscription_expires_at).getTime();
  const afterMs = new Date(after.rows[0].subscription_expires_at).getTime();
  check(
    'Self-service expiry extension was reverted by the trigger',
    Math.abs(afterMs - beforeMs) < 1000,
    `before=${before.rows[0].subscription_expires_at} after=${after.rows[0].subscription_expires_at}`
  );

  // And confirm the ORIGINAL protections still hold after CREATE OR REPLACE.
  await db.exec(`select set_config('test.uid', '${LEGACY}', false);`);
  await db.exec(`update public.users set role='admin', pins=99999 where id='${LEGACY}';`);
  const esc = await db.query<any>(`select role, pins from public.users where id='${LEGACY}';`);
  await db.exec(`select set_config('test.uid', '', false);`);
  check('Original role protection still intact', esc.rows[0].role !== 'admin');
  check('Original pins protection still intact', Number(esc.rows[0].pins) === 0);

  console.log('\n' + '='.repeat(72));
  console.log(`🏁 RESULT: ${passed} passed, ${failed} failed`);
  console.log('='.repeat(72));
  process.exit(failed === 0 ? 0 : 1);
}

main().catch(err => {
  console.error('Test harness error:', err);
  process.exit(1);
});
