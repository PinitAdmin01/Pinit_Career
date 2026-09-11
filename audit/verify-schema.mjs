#!/usr/bin/env node
/**
 * audit/verify-schema.mjs
 *
 * Read-only schema verification tool & regression guard for live Supabase database.
 * Strictly SELECT only. No mutations, inserts, updates, or DDL commands.
 *
 * Key behaviors:
 * 1. Reads Supabase credentials from local .env (never logged, printed, or exported).
 * 2. Probes 9 critical tables for expected columns via `select(column).limit(0)`.
 * 3. Handles PostgREST error codes accurately:
 *    - 42703: Column does not exist.
 *    - PGRST205: Relation / table does not exist.
 *    - 42501: Permission denied (Table EXISTS under RLS, column syntax validated).
 *    - null: Column EXISTS and is readable.
 * 4. Maintains an explicit, documented baseline of known historical discrepancies
 *    (e.g., opportunities.skills vs required_skills) so the guard passes on known state
 *    and fails (exit 1) ONLY when unexpected schema drift or table loss occurs.
 * 5. Checks distinct values of `users.role` if service role key is available,
 *    or explicitly reports BLOCKED if only anon key is present.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function loadEnv() {
  const envPath = path.join(ROOT, '.env');
  const env = {};
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      let val = trimmed.slice(eqIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      env[key] = val;
    }
  }
  return env;
}

const env = loadEnv();
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_ROLE_KEY || '').trim();

if (!supabaseUrl || !anonKey) {
  console.error('ERROR: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY missing.');
  process.exit(1);
}

const hasServiceRole = serviceKey.length > 0;
const activeKey = hasServiceRole ? serviceKey : anonKey;
const keyType = hasServiceRole ? 'service_role (RLS bypass enabled)' : 'anon (RLS active)';

console.log('================================================================');
console.log(' LIVE SUPABASE SCHEMA VERIFICATION & REGRESSION GUARD');
console.log(' Mode: READ-ONLY (SELECT only, zero writes, zero DDL)');
console.log(` Key Type: ${keyType}`);
console.log('================================================================\n');

const supabase = createClient(supabaseUrl, activeKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const TABLES = [
  {
    name: 'users',
    expectedColumns: [
      'id', 'role', 'display_name', 'register_number',
      'ats_score', 'trust_score', 'career_dna_score', 'recruiter_visibility',
      'missions_completed', 'xp_total', 'career_readiness', 'certifications',
      'vault_count', 'weak_areas',
    ],
    acceptedMissing: [],
    notes: '',
  },
  {
    name: 'college_cohorts',
    expectedColumns: ['id', 'college_name', 'department', 'batch_year'],
    acceptedMissing: [],
    notes: '',
  },
  {
    name: 'student_cohort_enrollments',
    expectedColumns: ['cohort_id', 'student_id'],
    acceptedMissing: [],
    notes: '',
  },
  {
    name: 'ats_skill_gaps',
    expectedColumns: ['student_id', 'competency_id'],
    acceptedMissing: [],
    notes: '',
  },
  {
    name: 'notifications',
    expectedColumns: ['id', 'user_id', 'is_read', 'created_at'],
    acceptedMissing: [],
    notes: 'is_read verified present in live database',
  },
  {
    name: 'applications',
    expectedColumns: ['id', 'user_id', 'opportunity_id', 'status', 'applied_at', 'updated_at', 'cover_letter'],
    acceptedMissing: ['cover_letter'],
    notes: 'cover_letter absent in live DB (code safely defaults to null)',
  },
  {
    name: 'opportunities',
    expectedColumns: [
      'id', 'title', 'description', 'required_skills',
      'stipend_min', 'stipend_max', 'duration_weeks', 'location_type',
      'deadline', 'status', 'org_name',
    ],
    acceptedMissing: [
      'required_skills', 'stipend_min', 'stipend_max', 'duration_weeks',
      'location_type', 'deadline', 'status', 'org_name',
    ],
    notes: 'DB has company, location, skills, salary, posted_at. Code maps skills & location.',
  },
  {
    name: 'attention_span_progress',
    expectedColumns: ['user_id', 'display_name', 'total_accuracy', 'daily_logs', 'monthly_summaries', 'updated_at'],
    acceptedMissing: [],
    notes: '',
  },
  {
    name: 'avatar_memory',
    expectedColumns: ['user_id', 'persona', 'memories', 'relationship_state', 'updated_at'],
    acceptedMissing: [],
    notes: '',
  },
];

async function probeTable(tableConfig) {
  const { name: table, expectedColumns, acceptedMissing, notes } = tableConfig;
  const result = {
    table,
    exists: false,
    rlsRestricted: false,
    rowCount: null,
    columnsFound: [],
    missingColumns: [],
    acceptedGaps: [],
    unexpectedMissing: [],
    extraColumns: [],
    details: notes || '',
  };

  // 1. Probe whole-table existence and sample 1 row
  const { data: sampleRows, error: sampleErr, count } = await supabase
    .from(table)
    .select('*', { count: 'exact', head: false })
    .limit(1);

  if (sampleErr) {
    if (sampleErr.code === 'PGRST205') {
      result.exists = false;
      result.details = 'Table does not exist (PGRST205)';
      result.missingColumns = [...expectedColumns];
      result.unexpectedMissing = [...expectedColumns];
      return result;
    }
    if (sampleErr.code === '42501') {
      result.exists = true;
      result.rlsRestricted = true;
      result.details = result.details ? `${result.details} (RLS 42501 active)` : 'Table exists (42501 permission denied under RLS)';
    } else {
      result.details = `Unexpected table error: [${sampleErr.code}] ${sampleErr.message}`;
    }
  } else {
    result.exists = true;
    result.rowCount = count != null ? count : (sampleRows ? sampleRows.length : 0);
  }

  // 2. If rows are readable and populated, get full live column set from Object.keys
  if (sampleRows && sampleRows.length > 0) {
    const liveCols = new Set(Object.keys(sampleRows[0]));
    result.columnsFound = [...liveCols];
    const missing = expectedColumns.filter((c) => !liveCols.has(c));
    result.missingColumns = missing;
    result.acceptedGaps = missing.filter((c) => acceptedMissing.includes(c));
    result.unexpectedMissing = missing.filter((c) => !acceptedMissing.includes(c));
    result.extraColumns = [...liveCols].filter((c) => !expectedColumns.includes(c));
    return result;
  }

  // 3. If table is empty or RLS-restricted (42501), probe each expected column individually
  const found = [];
  const missing = [];
  const acceptedGaps = [];
  const unexpectedMissing = [];

  for (const col of expectedColumns) {
    const { error: colErr } = await supabase.from(table).select(col).limit(0);

    if (!colErr) {
      found.push(col);
    } else if (colErr.code === '42703') {
      missing.push(col);
      if (acceptedMissing.includes(col)) {
        acceptedGaps.push(col);
      } else {
        unexpectedMissing.push(col);
      }
    } else if (colErr.code === '42501') {
      // 42501: Row read denied, but column exists and was parsed cleanly by Postgres
      found.push(col);
    } else {
      missing.push(`${col} (err: ${colErr.code})`);
      unexpectedMissing.push(col);
    }
  }

  result.columnsFound = found;
  result.missingColumns = missing;
  result.acceptedGaps = acceptedGaps;
  result.unexpectedMissing = unexpectedMissing;
  return result;
}

async function checkUserRoles() {
  if (!hasServiceRole) {
    return {
      status: 'BLOCKED',
      reason: 'SUPABASE_SERVICE_ROLE_KEY is blank in .env. RLS returns 0 rows to anon key.',
      distinctRoles: {},
      studentCount: null,
    };
  }

  const { data, error } = await supabase.from('users').select('role');
  if (error) {
    return {
      status: 'ERROR',
      reason: `[${error.code}] ${error.message}`,
      distinctRoles: {},
      studentCount: null,
    };
  }

  const roleCounts = {};
  let studentCount = 0;
  for (const row of data || []) {
    const r = row.role ?? 'NULL';
    roleCounts[r] = (roleCounts[r] || 0) + 1;
    if (row.role === 'student') studentCount++;
  }

  return {
    status: 'VERIFIED',
    distinctRoles: roleCounts,
    studentCount,
  };
}

async function run() {
  const tableResults = [];
  let totalUnexpectedMissing = 0;
  let totalAcceptedGaps = 0;
  let totalMissingTables = 0;

  for (const t of TABLES) {
    process.stdout.write(`Probing ${t.name.padEnd(28)} ... `);
    const res = await probeTable(t);
    tableResults.push(res);
    totalAcceptedGaps += res.acceptedGaps.length;

    if (!res.exists) {
      totalMissingTables++;
      console.log('MISSING ❌');
    } else if (res.unexpectedMissing.length > 0) {
      totalUnexpectedMissing += res.unexpectedMissing.length;
      console.log(`DRIFT DETECTED ❌ (${res.unexpectedMissing.length} unexpected missing cols)`);
    } else if (res.acceptedGaps.length > 0) {
      console.log(`EXISTS ✅ (${res.acceptedGaps.length} documented baseline gaps)`);
    } else {
      console.log('EXISTS ✅ (all columns present)');
    }
  }

  console.log('\n================================================================');
  console.log(' SUMMARY REPORT TABLE');
  console.log('================================================================');
  console.log('| Table                        | Exists | Rows       | Missing Columns                    | Baseline Guard | Notes');
  console.log('|------------------------------|:------:|:----------:|------------------------------------|:--------------:|-----------------------------');

  for (const r of tableResults) {
    const existsStr = r.exists ? '✅' : '❌';
    const rowsStr = r.rowCount != null ? String(r.rowCount) : (r.rlsRestricted ? 'RLS (anon)' : '0');
    
    let missingStr = 'none';
    let guardStr = 'BASELINE OK ✅';
    if (!r.exists) {
      missingStr = 'TABLE MISSING';
      guardStr = 'FAILED ❌';
    } else if (r.unexpectedMissing.length > 0) {
      missingStr = `❌ ${r.unexpectedMissing.join(', ')}`;
      guardStr = 'DRIFT ❌';
    } else if (r.acceptedGaps.length > 0) {
      missingStr = r.acceptedGaps.join(', ');
      guardStr = 'BASELINE OK ✅';
    }

    const noteStr = r.details || (r.extraColumns.length > 0 ? `+${r.extraColumns.length} extra cols` : '');
    console.log(`| ${r.table.padEnd(28)} | ${existsStr.padEnd(6)} | ${rowsStr.padEnd(10)} | ${missingStr.padEnd(34)} | ${guardStr.padEnd(14)} | ${noteStr}`);
  }

  console.log('\n================================================================');
  console.log(' USER ROLES CHECK (`users.role`)');
  console.log('================================================================');
  const roleCheck = await checkUserRoles();
  if (roleCheck.status === 'BLOCKED') {
    console.log('Status: BLOCKED ⚠️');
    console.log(`Reason: ${roleCheck.reason}`);
    console.log('Action: Paste SUPABASE_SERVICE_ROLE_KEY into .env to unblock.');
  } else if (roleCheck.status === 'ERROR') {
    console.log('Status: ERROR ❌');
    console.log(`Reason: ${roleCheck.reason}`);
  } else {
    console.log('Status: VERIFIED ✅');
    console.log('Distinct roles and row counts:');
    console.table(roleCheck.distinctRoles);
    console.log(`Rows with literal .eq('role', 'student'): ${roleCheck.studentCount}`);
    if (roleCheck.studentCount === 0) {
      console.warn('⚠️ WARNING: 0 users have role == \'student\'. University analytics will display zero counts.');
    }
  }

  console.log('\n================================================================');
  console.log(' VERIFICATION RESULT');
  console.log('================================================================');
  if (totalMissingTables > 0 || totalUnexpectedMissing > 0) {
    console.log(`FAILED ❌: ${totalMissingTables} table(s) missing, ${totalUnexpectedMissing} unexpected column(s) missing.`);
    process.exit(1);
  } else {
    console.log(`PASSED ✅: All 9 tables exist and match documented baseline (${totalAcceptedGaps} known legacy gaps accounted for, 0 unexpected drifts).`);
    process.exit(0);
  }
}

run().catch((err) => {
  console.error('Fatal probe execution error:', err);
  process.exit(1);
});
