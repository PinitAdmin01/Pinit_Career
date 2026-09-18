import { test } from 'node:test';
import assert from 'node:assert/strict';
import { applyFiles, createPlatformDb, freshBuildFiles, migrationFiles } from '../helpers/db';

test('a fresh database builds from every SQL file in order, with no file failing', async () => {
  const db = await createPlatformDb();
  try {
    const failures = await applyFiles(db, freshBuildFiles());
    assert.deepEqual(failures, []);
  } finally {
    await db.close();
  }
});

test('the consolidated migration applies on top of the base schema, followed by every migration', async () => {
  const db = await createPlatformDb();
  try {
    const failures = await applyFiles(db, [
      'supabase/schema.sql',
      'supabase/campus_tables.sql',
      'supabase/migrations/PRODUCTION_CONSOLIDATED_MIGRATIONS.sql',
      ...migrationFiles(),
    ]);
    assert.deepEqual(failures, []);
  } finally {
    await db.close();
  }
});
