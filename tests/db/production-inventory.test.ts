/**
 * The production inventory query is what the owner runs against the live database, so it must
 * report correctly: everything applied on a full build, nothing applied on an empty database,
 * and it must be regenerated whenever the SQL files change.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { buildFreshDatabase, createPlatformDb } from '../helpers/db';
import { collectExpectedObjects, INVENTORY_PATH, renderInventorySql } from '../../scripts/generate_db_inventory';

const inventorySql = () => fs.readFileSync(INVENTORY_PATH, 'utf8');

test('the committed inventory query matches the current SQL files (regenerate it if this fails)', async () => {
  const { expected, filesWithoutNewObjects } = await collectExpectedObjects();
  assert.equal(inventorySql(), renderInventorySql(expected, filesWithoutNewObjects));
});

test('on a fully built database every file is reported as applied', async () => {
  const { db } = await buildFreshDatabase();
  try {
    const { rows } = await db.query<{ file: string; status: string }>(inventorySql());
    assert.ok(rows.length > 0);
    assert.deepEqual(
      rows.filter((r) => r.status !== 'applied'),
      []
    );
  } finally {
    await db.close();
  }
});

test('on an empty Supabase database no file is reported as applied', async () => {
  const db = await createPlatformDb();
  try {
    const { rows } = await db.query<{ file: string; status: string }>(inventorySql());
    assert.deepEqual(
      rows.filter((r) => r.status !== 'NOT APPLIED'),
      []
    );
  } finally {
    await db.close();
  }
});
