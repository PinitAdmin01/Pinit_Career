/**
 * /api/notifications: real inbox only (no demo notifications), students can only notify themselves,
 * staff may notify others, the sender is always the caller.
 *
 *   node scripts/tests/test_notifications_api.cjs
 *   (from the sandbox: node dark-gracity/claude_sandbox/test_notifications_api.cjs)
 *   NOTIFICATIONS_SRC=src … runs the same checks against the current src/ route.
 */
const fs = require('fs');
const path = require('path');

function findRoot(dir) {
  while (!(fs.existsSync(path.join(dir, 'package.json')) && fs.existsSync(path.join(dir, 'src')))) {
    const up = path.dirname(dir);
    if (up === dir) throw new Error('Project root (package.json + src/) not found');
    dir = up;
  }
  return dir;
}

const ROOT = findRoot(__dirname);
const ts = require(require.resolve('typescript', { paths: [ROOT] }));
const USE_SRC = process.env.NOTIFICATIONS_SRC === 'src' || !fs.existsSync(path.join(__dirname, 'notifications-route.ts'));
const ROUTE = USE_SRC ? path.join(ROOT, 'src/app/api/notifications/route.ts') : path.join(__dirname, 'notifications-route.ts');

const STUDENT = 'aaaaaaaa-0000-4000-8000-000000000001';
const OTHER = 'bbbbbbbb-0000-4000-8000-000000000002';
const TEACHER = 'cccccccc-0000-4000-8000-000000000003';

function createDb({ readError = null } = {}) {
  const tables = {
    users: [{ id: STUDENT, role: 'student' }, { id: OTHER, role: 'student' }, { id: TEACHER, role: 'teacher' }],
    notifications: [],
  };
  let seq = 0;
  const from = (table) => {
    const q = { op: 'select', filters: [], payload: null };
    const matches = (r) => q.filters.every(([c, v]) => r[c] === v);
    const exec = (mode) => {
      if (table === 'notifications' && q.op === 'select' && readError) return { data: null, error: readError };
      const rows = tables[table];
      if (q.op === 'insert') {
        if (!tables.users.some((u) => u.id === q.payload.user_id)) return { data: null, error: { code: '23503', message: 'fk violation' } };
        const row = { id: `n_${++seq}`, created_at: new Date(Date.now() + seq).toISOString(), ...q.payload };
        rows.push(row);
        return { data: row, error: null };
      }
      const found = rows.filter(matches).sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)));
      return mode === 'many' ? { data: found, error: null } : { data: found[0] || null, error: null };
    };
    const chain = {
      select() { return chain; },
      eq(c, v) { q.filters.push([c, v]); return chain; },
      order() { return chain; },
      limit() { return chain; },
      insert(p) { q.op = 'insert'; q.payload = p; return chain; },
      maybeSingle() { return Promise.resolve(exec('one')); },
      single() { return Promise.resolve(exec('one')); },
      then(res, rej) { return Promise.resolve(exec('many')).then(res, rej); },
    };
    return chain;
  };
  return { client: { from }, tables };
}

// socialService as it behaves on the server: the browser client has no session, so reads come back
// empty (→ demo notifications) and inserts are refused by RLS (→ an in-memory object is returned).
const DEMO = [{ id: 'demo_notif_0', title: 'Mission Completed!', message: 'You completed "LinkedIn Post" and earned +8 trust points.' }];
const socialServiceMock = {
  normalizeNotification: (row) => ({ ...row, is_read: Boolean(row.is_read || row.read), read: Boolean(row.is_read || row.read) }),
  getNotifications: async () => DEMO,
  createNotification: async (p) => ({ ok: true, notification: { id: 'notif_mem', user_id: p.userId, sender_id: p.senderId, title: p.title } }),
};

function loadRoute(db) {
  const src = fs.readFileSync(ROUTE, 'utf8');
  const out = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true } }).outputText;
  const json = (body, init = {}) => ({ status: init.status || 200, body });
  const mocks = {
    'next/server': { NextResponse: { json } },
    '@/lib/server/requireAuth': {
      requireUserFromRequest: async (req) =>
        req.userId ? { user: { id: req.userId }, error: null } : { user: null, error: json({ error: 'UNAUTHORIZED' }, { status: 401 }) },
    },
    '@/lib/server/supabaseAdmin': { getSupabaseAdmin: () => db.client },
    '@/lib/services/supabase/socialService': socialServiceMock,
  };
  const mod = { exports: {} };
  new Function('require', 'module', 'exports', out)((n) => {
    if (n in mocks) return mocks[n];
    throw new Error(`Unexpected import in route: ${n}`);
  }, mod, mod.exports);
  return mod.exports;
}
const request = (userId, body) => ({ userId, json: async () => body });

let pass = 0, fail = 0;
async function test(name, fn) {
  try {
    const why = await fn();
    if (why === true) { pass++; console.log(`  ✓ ${name}`); }
    else { fail++; console.log(`  ✗ ${name}${why ? ` — ${why}` : ''}`); }
  } catch (e) { fail++; console.log(`  ✗ ${name} — threw: ${e.message}`); }
}

(async () => {
  console.log(`Notifications API (route: ${path.relative(ROOT, ROUTE)})\n`);

  await test('empty inbox stays empty (no fake demo notifications)', async () => {
    const res = await loadRoute(createDb()).GET(request(STUDENT));
    const list = res.body.notifications || [];
    return list.length === 0 ? true : `got ${list.length}: "${list[0].title}"`;
  });

  await test('inbox shows only the caller\'s own notifications, newest first', async () => {
    const db = createDb();
    db.tables.notifications.push(
      { id: 'n1', user_id: STUDENT, title: 'Old', message: 'x', is_read: true, created_at: '2026-09-01T00:00:00Z' },
      { id: 'n2', user_id: STUDENT, title: 'New', message: 'y', is_read: false, created_at: '2026-09-02T00:00:00Z' },
      { id: 'n3', user_id: OTHER, title: 'Theirs', message: 'z', created_at: '2026-09-03T00:00:00Z' },
    );
    const list = (await loadRoute(db).GET(request(STUDENT))).body.notifications || [];
    return list.map((n) => n.id).join(',') === 'n2,n1' ? true : list.map((n) => n.id).join(',');
  });

  await test('database error is reported, not replaced by demo data', async () => {
    const res = await loadRoute(createDb({ readError: { message: 'timeout' } })).GET(request(STUDENT));
    const list = res.body.notifications || [];
    return res.status >= 500 && list.length === 0 ? true : `status ${res.status}, ${list.length} notifications`;
  });

  await test('student can create a notification for themself (really saved)', async () => {
    const db = createDb();
    const res = await loadRoute(db).POST(request(STUDENT, { title: 'Reminder', message: 'Submit sprint 2' }));
    const row = db.tables.notifications[0];
    if (res.status !== 200 || !res.body.ok) return `status ${res.status}`;
    return row && row.user_id === STUDENT && row.sender_id === STUDENT ? true : 'nothing saved to the database';
  });

  await test('student cannot notify another user (403, nothing saved)', async () => {
    const db = createDb();
    const res = await loadRoute(db).POST(request(STUDENT, { userId: OTHER, title: 'Security alert', message: 'Log in at evil.example' }));
    if (res.status !== 403) return `status ${res.status}`;
    return db.tables.notifications.length === 0 ? true : 'saved anyway';
  });

  await test('teacher can notify a student; sender is the teacher', async () => {
    const db = createDb();
    const res = await loadRoute(db).POST(request(TEACHER, { userId: STUDENT, title: 'Class moved', message: 'Room 4', senderId: OTHER }));
    const row = db.tables.notifications[0];
    if (res.status !== 200) return `status ${res.status}`;
    return row && row.user_id === STUDENT && row.sender_id === TEACHER ? true : JSON.stringify(row);
  });

  await test('missing title or message → 400', async () => {
    const res = await loadRoute(createDb()).POST(request(STUDENT, { title: '  ', message: 'x' }));
    return res.status === 400 ? true : `status ${res.status}`;
  });

  await test('unknown target user → 404', async () => {
    const res = await loadRoute(createDb()).POST(request(TEACHER, { userId: 'dddddddd-0000-4000-8000-000000000009', title: 'x', message: 'y' }));
    return res.status === 404 ? true : `status ${res.status}`;
  });

  await test('not logged in → 401 (POST) and empty list (GET)', async () => {
    const route = loadRoute(createDb());
    const p = await route.POST(request(null, { title: 'x', message: 'y' }));
    const g = await route.GET(request(null));
    return p.status === 401 && (g.body.notifications || []).length === 0 ? true : `${p.status}`;
  });

  console.log(`\n${pass}/${pass + fail} passed`);
  process.exit(fail ? 1 : 0);
})();
