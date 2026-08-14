/**
 * Probe existing Supabase tables with the anon key. Never prints secrets.
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

const url = (env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/$/, '');
const anon = env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const tables = [
  'hostel_rooms', 'hostel_allocations', 'finance_dues', 'library_books',
  'transport_routes', 'document_requests', 'face_templates', 'student_attendance',
  'users', 'profiles', 'vault_items', 'missions', 'notifications',
];

(async () => {
  if (!url || !anon) {
    console.log('NO_SUPABASE_CREDS');
    process.exit(1);
  }
  console.log('supabase_host_ok', /supabase\.co$/.test(new URL(url).host));
  for (const table of tables) {
    const res = await fetch(`${url}/rest/v1/${table}?select=*&limit=1`, {
      headers: { apikey: anon, Authorization: 'Bearer ' + anon },
    });
    const body = await res.text();
    const snippet = body.replace(/\s+/g, ' ').slice(0, 120);
    console.log(table + ': status=' + res.status + ' ' + snippet);
  }

  const backends = [
    'https://pinit-backend-v8pd.onrender.com/health',
    'https://pinit-backend-v8pd.onrender.com/api/chat',
    'http://localhost:8000/health',
  ];
  for (const u of backends) {
    try {
      const ac = new AbortController();
      const t = setTimeout(() => ac.abort(), 8000);
      const res = await fetch(u, { method: u.includes('/chat') ? 'OPTIONS' : 'GET', signal: ac.signal });
      clearTimeout(t);
      console.log('backend ' + u + ' -> ' + res.status);
    } catch (err) {
      console.log('backend ' + u + ' -> FAIL ' + (err && err.name ? err.name : 'error'));
    }
  }
})();
