/**
 * Apply campus_tables.sql and report env readiness. Never prints secret values.
 */
const fs = require('fs');
const path = require('path');

function loadEnvFile(filePath, into) {
  if (!fs.existsSync(filePath)) return;
  const text = fs.readFileSync(filePath, 'utf8');
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq < 1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (into[key] === undefined) into[key] = val;
  }
}

const root = path.join(__dirname, '..');
const env = {};
loadEnvFile(path.join(root, '.env.local'), env);
loadEnvFile(path.join(root, '.env'), env);

const keys = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'DATABASE_URL',
  'SUPABASE_DB_URL',
  'SUPABASE_DB_PASSWORD',
  'POSTGRES_PASSWORD',
  'SUPABASE_ACCESS_TOKEN',
  'NEXT_PUBLIC_BACKEND_URL',
  'OPENROUTER_API_KEY',
  'GROQ_API_KEY',
  'RAZORPAY_KEY_ID',
  'RAZORPAY_KEY_SECRET',
];

function status(val) {
  if (val === undefined) return 'MISSING';
  const v = String(val).trim();
  if (!v) return 'EMPTY';
  if (/^your_|xxx|placeholder|change.?me/i.test(v)) return 'PLACEHOLDER';
  return 'SET len=' + v.length;
}

console.log('--- env presence ---');
for (const k of keys) console.log(k + ': ' + status(env[k]));

const url = (env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/$/, '');
const service = env.SUPABASE_SERVICE_ROLE_KEY || '';
const dbUrl = env.DATABASE_URL || env.SUPABASE_DB_URL || '';

async function applyViaPostgres(connectionString) {
  const { Client } = require('pg');
  const sql = fs.readFileSync(path.join(root, 'supabase', 'campus_tables.sql'), 'utf8');
  const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });
  await client.connect();
  await client.query(sql);
  await client.end();
  console.log('SQL_APPLY: ok via postgres');
}

async function applyViaManagementApi() {
  const token = env.SUPABASE_ACCESS_TOKEN;
  if (!token || !url) return false;
  const ref = url.match(/https:\/\/([a-z0-9]+)\.supabase\.co/i);
  if (!ref) return false;
  const sql = fs.readFileSync(path.join(root, 'supabase', 'campus_tables.sql'), 'utf8');
  const res = await fetch(`https://api.supabase.com/v1/projects/${ref[1]}/database/query`, {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: sql }),
  });
  const text = await res.text();
  if (!res.ok) {
    console.log('SQL_APPLY: management api failed status=' + res.status + ' body=' + text.slice(0, 200));
    return false;
  }
  console.log('SQL_APPLY: ok via management api');
  return true;
}

(async () => {
  try {
    if (dbUrl) {
      try {
        require.resolve('pg');
      } catch {
        console.log('Installing pg...');
        require('child_process').execSync('npm install pg --no-save', { cwd: root, stdio: 'inherit' });
      }
      await applyViaPostgres(dbUrl);
      return;
    }
    const ok = await applyViaManagementApi();
    if (ok) return;
    console.log('SQL_APPLY: no DATABASE_URL / SUPABASE_ACCESS_TOKEN. Will try service-role table probes next.');
  } catch (err) {
    console.log('SQL_APPLY: error ' + (err && err.message ? err.message : err));
    process.exitCode = 1;
  }
})();
