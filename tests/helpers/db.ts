/**
 * Builds a throwaway Postgres (PGlite, in memory) from this repo's SQL files so tests can
 * check what the database actually does, instead of searching SQL text.
 *
 * Nothing here talks to Supabase or production.
 */
import fs from 'node:fs';
import path from 'node:path';
import { PGlite } from '@electric-sql/pglite';
import { uuid_ossp } from '@electric-sql/pglite/contrib/uuid_ossp';
import { pgcrypto } from '@electric-sql/pglite/contrib/pgcrypto';

export const ROOT = path.resolve(__dirname, '..', '..');

/**
 * Stand-ins for what every Supabase project already has before our SQL runs:
 * the anon/authenticated/service_role roles, auth.uid()/auth.jwt(), auth.users,
 * storage.buckets, the realtime publication, and Supabase's default grants on public.
 */
const SUPABASE_PLATFORM_SQL = `
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN CREATE ROLE anon NOLOGIN; END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN CREATE ROLE authenticated NOLOGIN; END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'service_role') THEN CREATE ROLE service_role NOLOGIN BYPASSRLS; END IF;
END $$;

CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS storage;

CREATE TABLE IF NOT EXISTS auth.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text,
  raw_user_meta_data jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE OR REPLACE FUNCTION auth.jwt() RETURNS jsonb LANGUAGE sql STABLE AS $f$
  SELECT coalesce(nullif(current_setting('request.jwt.claims', true), ''), '{}')::jsonb
$f$;
CREATE OR REPLACE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $f$
  SELECT nullif(auth.jwt() ->> 'sub', '')::uuid
$f$;
CREATE OR REPLACE FUNCTION auth.role() RETURNS text LANGUAGE sql STABLE AS $f$
  SELECT coalesce(auth.jwt() ->> 'role', 'anon')
$f$;

CREATE TABLE IF NOT EXISTS storage.buckets (
  id text PRIMARY KEY,
  name text,
  public boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);
CREATE TABLE IF NOT EXISTS storage.objects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bucket_id text REFERENCES storage.buckets (id),
  name text,
  owner uuid,
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

GRANT USAGE ON SCHEMA public, auth, storage TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION auth.uid(), auth.jwt(), auth.role() TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon, authenticated, service_role;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    CREATE PUBLICATION supabase_realtime;
  END IF;
END $$;
`;

/** Every forward migration in supabase/migrations, in the order Supabase applies them (by file name). */
export function migrationFiles(): string[] {
  return fs
    .readdirSync(path.join(ROOT, 'supabase', 'migrations'))
    .filter(
      (f) =>
        f.endsWith('.sql') &&
        !f.endsWith('.down.sql') &&
        f !== 'down.sql' &&
        f !== 'PRODUCTION_CONSOLIDATED_MIGRATIONS.sql'
    )
    .sort()
    .map((f) => `supabase/migrations/${f}`);
}

/**
 * The files a brand-new database is built from today: the base schema files, then every migration.
 * schema.sql starts by dropping tables. That is harmless on an empty test database; never run it on production.
 */
export function freshBuildFiles(): string[] {
  return [
    'supabase/schema.sql',
    'supabase/users_onboarding_fix.sql',
    'supabase/additional_tables.sql',
    'supabase/campus_tables.sql',
    ...migrationFiles(),
  ];
}

export interface FileFailure {
  file: string;
  error: string;
}

export async function createPlatformDb(): Promise<PGlite> {
  const db = await PGlite.create({ extensions: { uuid_ossp, pgcrypto } });
  await db.exec(SUPABASE_PLATFORM_SQL);
  return db;
}

/** Applies each file exactly as written (no BOM stripping or other clean-up) and records every failure. */
export async function applyFiles(db: PGlite, files: string[]): Promise<FileFailure[]> {
  const failures: FileFailure[] = [];
  for (const file of files) {
    const sql = fs.readFileSync(path.join(ROOT, file), 'utf8');
    try {
      await db.exec(sql);
    } catch (err) {
      failures.push({ file, error: String((err as Error).message).split('\n')[0] });
      // A file with its own BEGIN leaves the session inside an aborted transaction.
      await db.exec('ROLLBACK').catch(() => undefined);
    }
  }
  return failures;
}

export async function buildFreshDatabase(): Promise<{ db: PGlite; failures: FileFailure[] }> {
  const db = await createPlatformDb();
  const failures = await applyFiles(db, freshBuildFiles());
  return { db, failures };
}

type Role = 'authenticated' | 'anon';

async function asRole<T>(db: PGlite, role: Role, claims: Record<string, unknown>, sql: string, params: unknown[]) {
  return db.transaction(async (tx) => {
    await tx.query(`select set_config('request.jwt.claims', $1, true)`, [JSON.stringify(claims)]);
    await tx.exec(`set local role ${role}`);
    return tx.query<T>(sql, params);
  });
}

/** Runs one statement exactly as a logged-in user's browser would through Supabase (RLS and grants apply). */
export function asUser<T = Record<string, unknown>>(db: PGlite, userId: string, sql: string, params: unknown[] = []) {
  return asRole<T>(db, 'authenticated', { sub: userId, role: 'authenticated' }, sql, params);
}

/** Runs one statement as a visitor who is not logged in. */
export function asAnon<T = Record<string, unknown>>(db: PGlite, sql: string, params: unknown[] = []) {
  return asRole<T>(db, 'anon', { role: 'anon' }, sql, params);
}

/** Runs an action that is expected to be refused; returns the error instead of throwing. */
export async function attempt(action: () => Promise<unknown>): Promise<Error | null> {
  try {
    await action();
    return null;
  } catch (err) {
    return err as Error;
  }
}

/** Creates a login plus its public.users profile, as the database owner (bypasses RLS). */
export async function createUser(
  db: PGlite,
  opts: { email: string; role?: string; pins?: number }
): Promise<string> {
  const { rows } = await db.query<{ id: string }>(
    `insert into auth.users (email) values ($1) returning id`,
    [opts.email]
  );
  const id = rows[0].id;
  await db.query(
    `insert into public.users (id, email, role, pins) values ($1, $2, $3, $4)
     on conflict (id) do update set role = excluded.role, pins = excluded.pins`,
    [id, opts.email, opts.role ?? 'student', opts.pins ?? 100]
  );
  return id;
}
