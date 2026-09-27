/**
 * Arena 1v1 rooms: identity from the login, code private until the match ends, no lost updates,
 * no stale per-instance state.
 *
 *   node scripts/tests/test_arena_rooms.cjs
 *   (from the sandbox: node dark-gracity/claude_sandbox/test_arena_rooms.cjs)
 *   ARENA_SRC=src … runs the same checks against the current src/ store and routes.
 *
 * Real store + route code (transpiled in-memory) against an in-memory Supabase whose queries resolve
 * asynchronously, so concurrent requests interleave like they do on Vercel.
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
const USE_SRC = process.env.ARENA_SRC === 'src' || !fs.existsSync(path.join(__dirname, 'arenaPvPStore.ts'));
const pick = (sandboxName, srcRel) => (USE_SRC ? path.join(ROOT, srcRel) : path.join(__dirname, sandboxName));
const FILES = {
  store: pick('arenaPvPStore.ts', 'src/lib/services/arenaPvPStore.ts'),
  room: pick('arena-room-route.ts', 'src/app/api/arena/room/[roomCode]/route.ts'),
  create: pick('arena-create-room-route.ts', 'src/app/api/arena/create-room/route.ts'),
  join: pick('arena-join-room-route.ts', 'src/app/api/arena/join-room/route.ts'),
  matchmake: pick('arena-matchmake-route.ts', 'src/app/api/arena/matchmake/route.ts'),
};
const A = 'aaaaaaaa-0000-4000-8000-00000000000a';
const B = 'bbbbbbbb-0000-4000-8000-00000000000b';
const C = 'cccccccc-0000-4000-8000-00000000000c';

// ── In-memory Supabase (async, compare-and-swap aware) ───────────────────────
function createDb() {
  const tables = { arena_rooms: [], arena_room_submissions: [], arena_matchmaking_queue: [] };
  let clock = Date.parse('2026-09-27T10:00:00Z');
  const tick = () => new Date(++clock).toISOString();
  const later = (v) => new Promise((r) => setImmediate(() => r(v)));
  const from = (table) => {
    const q = { op: 'select', filters: [], payload: null, returning: false, order: null, limit: null };
    const matches = (r) => q.filters.every(([c, v, how]) =>
      how === 'neq' ? r[c] !== v : how === 'gte' ? String(r[c]) >= String(v) : r[c] === v);
    const exec = (mode) => {
      const rows = tables[table];
      if (table === 'arena_matchmaking_queue') {
        if (q.op === 'insert') {
          if (rows.some((r) => r.student_id === q.payload.student_id)) return { data: null, error: { code: '23505', message: 'duplicate student_id' } };
          rows.push({ matched_room_code: null, created_at: tick(), ...q.payload });
          return { data: null, error: null };
        }
        if (q.op === 'delete') { tables[table] = rows.filter((r) => !matches(r)); return { data: null, error: null }; }
      }
      if (q.op === 'insert') {
        const row = {
          id: `uuid_${rows.length + 1}`, guest_id: null, guest_name: null, guest_avatar: null, winner_id: null,
          started_at: null, ended_at: null, created_at: tick(), ...JSON.parse(JSON.stringify(q.payload)), updated_at: tick(),
        };
        rows.push(row);
        return { data: null, error: null };
      }
      if (q.op === 'upsert') {
        const key = (r) => (table === 'arena_room_submissions' ? `${r.room_code}|${r.player_id}` : r.id);
        const i = rows.findIndex((r) => key(r) === key(q.payload));
        if (i >= 0) rows[i] = { ...rows[i], ...q.payload }; else rows.push({ ...q.payload });
        return { data: null, error: null };
      }
      if (q.op === 'update') {
        const hit = rows.filter(matches);
        const stamp = table === 'arena_rooms' ? { updated_at: tick() } : {};
        hit.forEach((r) => Object.assign(r, JSON.parse(JSON.stringify(q.payload)), stamp));
        return { data: q.returning ? hit.map((r) => ({ room_code: r.room_code, student_id: r.student_id })) : null, error: null };
      }
      let found = rows.filter(matches).map((r) => JSON.parse(JSON.stringify(r)));
      if (q.order) found.sort((a, b) => (String(a[q.order.col]).localeCompare(String(b[q.order.col]))) * (q.order.asc ? 1 : -1));
      if (q.limit !== null) found = found.slice(0, q.limit);
      return mode === 'many' ? { data: found, error: null } : { data: found[0] || null, error: null };
    };
    const chain = {
      select() { if (q.op === 'update') q.returning = true; return chain; },
      eq(c, v) { q.filters.push([c, v, 'eq']); return chain; },
      neq(c, v) { q.filters.push([c, v, 'neq']); return chain; },
      gte(c, v) { q.filters.push([c, v, 'gte']); return chain; },
      order(col, opts) { q.order = { col, asc: !opts || opts.ascending !== false }; return chain; },
      limit(n) { q.limit = n; return chain; },
      delete() { q.op = 'delete'; return chain; },
      insert(p) { q.op = 'insert'; q.payload = p; return chain; },
      upsert(p) { q.op = 'upsert'; q.payload = p; return chain; },
      update(p) { q.op = 'update'; q.payload = p; return chain; },
      maybeSingle() { return later(null).then(() => exec('one')); },
      then(res, rej) { return later(null).then(() => exec('many')).then(res, rej); },
    };
    return chain;
  };
  return { client: { from }, tables };
}

// ── Module loading (one "server instance" = one fresh store + routes) ────────
const compile = (file) => ts.transpileModule(fs.readFileSync(file, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
}).outputText;

function instance(db) {
  const json = (body, init = {}) => ({ status: init.status || 200, body });
  const load = (file, mocks) => {
    const mod = { exports: {} };
    new Function('require', 'module', 'exports', compile(file))((n) => {
      if (n in mocks) return mocks[n];
      throw new Error(`Unexpected import in ${path.basename(file)}: ${n}`);
    }, mod, mod.exports);
    return mod.exports;
  };
  const store = load(FILES.store, { '@/lib/server/supabaseAdmin': { getSupabaseAdmin: () => db.client } });
  const routeMocks = {
    'next/server': { NextResponse: { json } },
    '@/lib/services/arenaPvPStore': store,
    '@/lib/server/requireAuth': {
      requireUserFromRequest: async (req) => req.userId
        ? { user: { id: req.userId, displayName: `User ${req.userId.slice(0, 1).toUpperCase()}` }, error: null }
        : { user: null, error: json({ error: 'UNAUTHORIZED' }, { status: 401 }) },
    },
    // Stand-in for the server's code judge: code containing "WIN" passes all 5 tests,
    // "T<n>" passes n of 5. (The real judge runs the code; see test_code_judge.cjs.)
    '@/lib/server/codeWarsJudge': {
      judgeCodeWarsSubmission: async (_problemId, code) => {
        const src = String(code || '');
        const n = /WIN/.test(src) ? 5 : Number((/T(\d)/.exec(src) || [])[1] || 0);
        return { ok: true, passed: n === 5, testsPassed: n, totalTests: 5 };
      },
      codeWarsScore: (j) => (j.passed ? 90 : Math.round((j.testsPassed / j.totalTests) * 50)),
    },
  };
  const room = load(FILES.room, routeMocks);
  const create = load(FILES.create, routeMocks);
  const join = load(FILES.join, routeMocks);
  const matchmake = load(FILES.matchmake, routeMocks);
  const req = (userId, body) => ({ userId, json: async () => body });
  const ctx = (code) => ({ params: Promise.resolve({ roomCode: code }) });
  return {
    create: (u, body) => create.POST(req(u, body)),
    join: (u, body) => join.POST(req(u, body)),
    get: (u, code) => room.GET(req(u), ctx(code)),
    act: (u, code, body) => room.POST(req(u, body), ctx(code)),
    matchmake: (u, body) => matchmake.POST(req(u, body)),
  };
}

async function newMatch(db, srv) {
  const created = await srv.create(A, { hostId: A, hostName: 'Asha', problemId: 'war_tree_lca_01' });
  const code = created.body.room.roomCode;
  await srv.join(B, { roomCode: code, guestId: B, guestName: 'Bala' });
  await srv.act(A, code, { action: 'toggle_ready', playerId: A });
  await srv.act(B, code, { action: 'toggle_ready', playerId: B });
  return code;
}
const dbRoom = (db, code) => db.tables.arena_rooms.find((r) => r.room_code === code);

// ── Tests ────────────────────────────────────────────────────────────────────
let pass = 0, fail = 0;
async function test(name, fn) {
  const { warn, error } = console; console.warn = () => {}; console.error = () => {};
  let why;
  try { why = await fn(); } catch (e) { why = `threw: ${e.message}`; } finally { console.warn = warn; console.error = error; }
  if (why === true) { pass++; console.log(`  ✓ ${name}`); } else { fail++; console.log(`  ✗ ${name}${why ? ` — ${why}` : ''}`); }
}

(async () => {
  console.log(`Arena rooms (store: ${path.relative(ROOT, FILES.store)})\n`);

  await test('every arena route requires login', async () => {
    const db = createDb(); const srv = instance(db);
    const code = await newMatch(db, srv);
    const codes = [
      (await srv.create(null, { hostId: A, hostName: 'x', problemId: 'p' })).status,
      (await srv.join(null, { roomCode: code, guestId: C, guestName: 'x' })).status,
      (await srv.get(null, code)).status,
      (await srv.act(null, code, { action: 'forfeit', playerId: A })).status,
      (await srv.matchmake(null, { studentId: C })).status,
    ];
    return codes.every((s) => s === 401) ? true : `statuses ${codes.join(',')}`;
  });

  await test('the host is the logged-in user, not the hostId in the body', async () => {
    const db = createDb(); const srv = instance(db);
    const res = await srv.create(A, { hostId: C, hostName: 'Asha', problemId: 'war_tree_lca_01' });
    const row = dbRoom(db, res.body.room.roomCode);
    return row && row.host_id === A ? true : `host_id ${row && row.host_id}`;
  });

  await test("a taken guest slot can't be stolen; host and guest can re-enter", async () => {
    const db = createDb(); const srv = instance(db);
    const code = (await srv.create(A, { hostName: 'Asha', problemId: 'p' })).body.room.roomCode;
    await srv.join(B, { roomCode: code, guestId: C, guestName: 'Bala' });
    const steal = await srv.join(C, { roomCode: code, guestId: C, guestName: 'Chandra' });
    const again = await srv.join(B, { roomCode: code, guestName: 'Bala' });
    const host = await srv.join(A, { roomCode: code, guestName: 'Asha' });
    const row = dbRoom(db, code);
    if (row.guest_id !== B) return `guest is ${row.guest_id}`;
    return steal.status === 400 && again.status === 200 && host.status === 200 ? true : `steal ${steal.status}, rejoin ${again.status}, host ${host.status}`;
  });

  await test('code typed during the match never reaches the shared room row', async () => {
    const db = createDb(); const srv = instance(db);
    const code = await newMatch(db, srv);
    await srv.act(A, code, { action: 'update_progress', playerId: A, testsPassed: 2, totalTests: 5, score: 40, code: 'function mySecret(){}', logs: 'trace' });
    const row = dbRoom(db, code);
    if (JSON.stringify(row).includes('mySecret')) return 'code stored in arena_rooms (sent to the opponent by live updates)';
    if (row.host_progress.score === 40) return 'a progress update set the score (only the judged submission may)';
    return row.host_progress.testsPassed === 2 ? true : 'progress counters not saved';
  });

  await test("opponent can't read your code before the match ends; both can after", async () => {
    const db = createDb(); const srv = instance(db);
    const code = await newMatch(db, srv);
    await srv.act(A, code, { action: 'submit_solution', playerId: A, passed: false, testsPassed: 3, totalTests: 5, score: 60, code: 'A_FINAL_CODE T3' });
    const midB = (await srv.get(B, code)).body.room;
    if (midB.hostProgress.code) return `during match B sees A's code: ${midB.hostProgress.code}`;
    await srv.act(B, code, { action: 'submit_solution', playerId: B, passed: false, testsPassed: 4, totalTests: 5, score: 80, code: 'B_FINAL_CODE T4' });
    const endA = (await srv.get(A, code)).body.room;
    const endB = (await srv.get(B, code)).body.room;
    if (endA.status !== 'completed' || endA.winnerId !== B) return `status ${endA.status}, winner ${endA.winnerId}`;
    return endA.guestProgress.code === 'B_FINAL_CODE T4' && endB.hostProgress.code === 'A_FINAL_CODE T3' ? true : 'codes not shown after the match';
  });

  await test('the result comes from running the code: claiming passed:true with failing code does not win', async () => {
    const db = createDb(); const srv = instance(db);
    const code = await newMatch(db, srv);
    const res = await srv.act(A, code, { action: 'submit_solution', playerId: A, passed: true, testsPassed: 5, totalTests: 5, score: 100, code: 'return null; // T1' });
    const row = dbRoom(db, code);
    if (row.status === 'completed' || row.winner_id) return `fake pass won (winner ${row.winner_id})`;
    if (row.host_progress.testsPassed !== 1 || row.host_progress.score !== 10) return `claimed numbers kept: ${JSON.stringify(row.host_progress)}`;
    if (!res.body.result || res.body.result.passed !== false) return 'judged result not returned';
    await srv.act(B, code, { action: 'submit_solution', playerId: B, passed: false, code: 'real solution WIN' });
    const end = dbRoom(db, code);
    return end.status === 'completed' && end.winner_id === B ? true : `winner ${end.winner_id}`;
  });

  await test('no submissions before the match starts or after it ends', async () => {
    const db = createDb(); const srv = instance(db);
    const code = (await srv.create(A, { hostName: 'Asha', problemId: 'war_tree_lca_01' })).body.room.roomCode;
    await srv.join(B, { roomCode: code, guestName: 'Bala' });
    const early = await srv.act(A, code, { action: 'submit_solution', code: 'WIN' });
    if (early.status !== 409 || dbRoom(db, code).winner_id) return `before start → ${early.status}`;
    await srv.act(A, code, { action: 'toggle_ready' });
    await srv.act(B, code, { action: 'toggle_ready' });
    await srv.act(A, code, { action: 'submit_solution', code: 'WIN' });
    const late = await srv.act(B, code, { action: 'submit_solution', code: 'WIN' });
    return late.status === 409 && dbRoom(db, code).winner_id === A ? true : `after end → ${late.status}, winner ${dbRoom(db, code).winner_id}`;
  });

  await test('forfeit ends the match and publishes both codes', async () => {
    const db = createDb(); const srv = instance(db);
    const code = await newMatch(db, srv);
    await srv.act(A, code, { action: 'update_progress', playerId: A, code: 'A_WIP' });
    await srv.act(B, code, { action: 'forfeit', playerId: B });
    const room = (await srv.get(A, code)).body.room;
    return room.status === 'completed' && room.winnerId === A && room.hostProgress.code === 'A_WIP' ? true : JSON.stringify({ s: room.status, w: room.winnerId, c: room.hostProgress.code });
  });

  await test("an outsider can't act on the room, even by naming a player", async () => {
    const db = createDb(); const srv = instance(db);
    const code = await newMatch(db, srv);
    const res = await srv.act(C, code, { action: 'submit_solution', playerId: A, passed: true, score: 100, code: 'x' });
    const row = dbRoom(db, code);
    if (row.status === 'completed' || row.winner_id) return `outsider changed the room (winner ${row.winner_id})`;
    return res.status === 403 ? true : `status ${res.status}`;
  });

  await test("a player can't act as the other player", async () => {
    const db = createDb(); const srv = instance(db);
    const code = await newMatch(db, srv);
    await srv.act(B, code, { action: 'forfeit', playerId: A });
    const row = dbRoom(db, code);
    return row.winner_id === A ? true : `forfeit applied as A (winner ${row.winner_id})`;
  });

  await test('an outsider sees the room without any code', async () => {
    const db = createDb(); const srv = instance(db);
    const code = await newMatch(db, srv);
    await srv.act(A, code, { action: 'submit_solution', playerId: A, passed: true, code: 'A_WIN' });
    const view = (await srv.get(C, code)).body.room;
    return view && !view.hostProgress.code && !view.guestProgress.code ? true : 'outsider sees code';
  });

  await test('both players clicking "ready" at the same moment starts the match', async () => {
    const db = createDb(); const srv = instance(db);
    const code = (await srv.create(A, { hostName: 'Asha', problemId: 'p' })).body.room.roomCode;
    await srv.join(B, { roomCode: code, guestName: 'Bala' });
    await Promise.all([
      srv.act(A, code, { action: 'toggle_ready', playerId: A }),
      srv.act(B, code, { action: 'toggle_ready', playerId: B }),
    ]);
    const row = dbRoom(db, code);
    return row.host_ready && row.guest_ready && row.status === 'in_progress' ? true : `host_ready=${row.host_ready} guest_ready=${row.guest_ready} status=${row.status}`;
  });

  await test('two server instances see the same room (no stale local copy)', async () => {
    const db = createDb(); const one = instance(db); const two = instance(db);
    const code = (await one.create(A, { hostName: 'Asha', problemId: 'p' })).body.room.roomCode;
    await two.join(B, { roomCode: code, guestName: 'Bala' });
    const seen = (await one.get(A, code)).body.room;
    return seen.guestId === B ? true : `instance one still sees guest ${seen.guestId}`;
  });

  await test('matchmaking works across server instances; the waiting player gets the room on their next poll', async () => {
    const db = createDb(); const one = instance(db); const two = instance(db);
    const first = await one.matchmake(A, { studentName: 'Asha', difficulty: 'any' });
    if (first.body.matched) return 'matched with nobody waiting';
    const second = await two.matchmake(B, { studentName: 'Bala', difficulty: 'any' });
    if (!second.body.matched) return 'second player not matched (queue not shared between instances)';
    const again = await one.matchmake(A, { studentName: 'Asha', difficulty: 'any' });
    if (!again.body.matched) return 'waiting player never told about the match';
    return again.body.room.roomCode === second.body.room.roomCode && again.body.room.hostId === A && again.body.room.guestId === B ? true : 'different rooms';
  });

  await test('two players cannot claim the same waiting opponent', async () => {
    const db = createDb(); const srv = instance(db); const other = instance(db);
    await srv.matchmake(A, { studentName: 'Asha', difficulty: 'any' });
    const [b, c] = await Promise.all([
      srv.matchmake(B, { studentName: 'Bala', difficulty: 'any' }),
      other.matchmake(C, { studentName: 'Chandra', difficulty: 'any' }),
    ]);
    const winners = [b, c].filter((r) => r.body.matched);
    const roomsWithA = db.tables.arena_rooms.filter((r) => r.host_id === A);
    return winners.length === 1 && roomsWithA.length === 1 ? true : `${winners.length} matched, ${roomsWithA.length} rooms hosted by A`;
  });

  await test('cancelling leaves the queue; stale tickets are ignored', async () => {
    const db = createDb(); const srv = instance(db);
    await srv.matchmake(A, { studentName: 'Asha', difficulty: 'any' });
    await srv.matchmake(A, { action: 'cancel' });
    const afterCancel = await srv.matchmake(B, { studentName: 'Bala', difficulty: 'any' });
    if (afterCancel.body.matched) return 'matched with a player who cancelled';
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60000).toISOString();
    db.tables.arena_matchmaking_queue.forEach((r) => { r.created_at = fiveMinutesAgo; });
    const afterStale = await srv.matchmake(C, { studentName: 'Chandra', difficulty: 'any' });
    return afterStale.body.matched ? 'matched with a stale ticket' : true;
  });

  await test('a matchmade room is saved with both players, not only in memory', async () => {
    const db = createDb(); const srv = instance(db);
    await srv.matchmake(A, { studentId: A, studentName: 'Asha', difficulty: 'any' });
    const res = await srv.matchmake(B, { studentId: B, studentName: 'Bala', difficulty: 'any' });
    if (!res.body.matched) return 'not matched';
    const row = dbRoom(db, res.body.room.roomCode);
    return row && row.guest_id === B && row.host_id === A && row.status === 'in_progress' ? true : `row ${JSON.stringify(row && { g: row.guest_id, s: row.status })}`;
  });

  console.log(`\n${pass}/${pass + fail} passed`);
  process.exit(fail ? 1 : 0);
})();
