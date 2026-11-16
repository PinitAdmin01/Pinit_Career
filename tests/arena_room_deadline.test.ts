import test from 'node:test';
import assert from 'node:assert/strict';
import type { NextRequest } from 'next/server';
import { GET as getRoom, POST as postRoom } from '../src/app/api/arena/room/[roomCode]/route';
import { ArenaPvPStore } from '../src/lib/services/arenaPvPStore';
import { setSupabaseAdminForTests } from '../src/lib/server/supabaseAdmin';
import { CODE_WARS_PROBLEMS_CATALOG } from '../src/lib/api/codeWarsApi';

const dbUnavailable = { message: 'In-memory arena test' };
const makeAdminStub = () => {
  const response = { data: null, error: dbUnavailable };
  const chain: any = new Proxy({}, {
    get(_target, key) {
      if (key === 'then') return (resolve: (value: unknown) => unknown) => Promise.resolve(response).then(resolve);
      if (key === 'maybeSingle') return async () => response;
      if (key === 'insert' || key === 'upsert') return async () => ({ error: dbUnavailable });
      if (key === 'select' || key === 'eq' || key === 'update' || key === 'delete') return () => chain;
      return undefined;
    },
  });
  return { from: () => chain, rpc: async () => ({ data: null, error: dbUnavailable }) };
};

function request(path: string, token: string, method = 'GET', body?: unknown): NextRequest {
  return new Request(`http://localhost${path}`, {
    method,
    headers: {
      authorization: `Bearer guest-token-${token}`,
      ...(body === undefined ? {} : { 'content-type': 'application/json' }),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  }) as unknown as NextRequest;
}

let roomIndex = 0;
async function createExpiredRoom(progress: { hostSubmitted?: boolean; hostTests?: number } = {}) {
  roomIndex += 1;
  const code = `ARENA-DEADLINE-${Date.now()}-${roomIndex}`;
  const problem = CODE_WARS_PROBLEMS_CATALOG[0];
  await ArenaPvPStore.createRoom({
    roomCode: code,
    hostId: 'combatant_host',
    hostName: 'Host',
    problemId: problem.id,
    timeLimitSeconds: 1,
  });
  const joined = await ArenaPvPStore.joinRoom({
    roomCode: code,
    guestId: 'combatant_guest',
    guestName: 'Guest',
  });
  assert.equal(joined.success, true);

  const startedAt = Date.now() - 5_000;
  await ArenaPvPStore.updateRoom(code, (room) => {
    room.status = 'in_progress';
    room.startedAt = startedAt;
    room.timeLimitSeconds = 1;
    if (progress.hostSubmitted) {
      room.hostProgress.submitted = true;
      room.hostProgress.testsPassed = progress.hostTests || 0;
      room.hostProgress.totalTests = 5;
      room.hostProgress.score = 100;
      room.hostProgress.lastActiveAt = startedAt + 500;
    }
    return room;
  });
  return code;
}

test('PvP server enforces the deadline, rejects late submissions, and resolves timeouts safely', async () => {
  const previous = {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  };
  process.env.NEXT_PUBLIC_SUPABASE_URL = '';
  process.env.SUPABASE_SERVICE_ROLE_KEY = '';
  setSupabaseAdminForTests(makeAdminStub());

  try {
    const scoredRoomCode = await createExpiredRoom({ hostSubmitted: true, hostTests: 2 });
    const timedOut = await getRoom(request(`/api/arena/room/${scoredRoomCode}`, 'host'), {
      params: Promise.resolve({ roomCode: scoredRoomCode }),
    });
    assert.equal(timedOut.status, 200);
    const scoredRoom = (await timedOut.json()).room;
    assert.equal(scoredRoom.status, 'completed');
    assert.equal(scoredRoom.winnerId, 'combatant_host');
    assert.equal(scoredRoom.hostEloDelta, 20);
    assert.equal(scoredRoom.guestEloDelta, -20);

    const drawRoomCode = await createExpiredRoom();
    const lateSubmit = await postRoom(request(`/api/arena/room/${drawRoomCode}`, 'guest', 'POST', {
      action: 'submit_solution',
      code: 'this must never be judged after the deadline',
    }), { params: Promise.resolve({ roomCode: drawRoomCode }) });
    assert.equal(lateSubmit.status, 200);
    const lateResult = await lateSubmit.json();
    assert.equal(lateResult.expired, true);
    assert.equal(lateResult.result, undefined, 'A late solution is not judged or counted');
    assert.equal(lateResult.room.status, 'completed');
    assert.equal(lateResult.room.winnerId, 'draw');
    assert.equal(lateResult.room.hostEloDelta, 0);
    assert.equal(lateResult.room.guestEloDelta, 0);

    const failedSubmissionRoomCode = await createExpiredRoom({ hostSubmitted: true, hostTests: 0 });
    const failedOnly = await getRoom(request(`/api/arena/room/${failedSubmissionRoomCode}`, 'host'), {
      params: Promise.resolve({ roomCode: failedSubmissionRoomCode }),
    });
    const failedOnlyRoom = (await failedOnly.json()).room;
    assert.equal(failedOnlyRoom.winnerId, 'draw', 'A zero-test submission cannot earn a timeout win');
    assert.equal(failedOnlyRoom.hostEloDelta, 0);
    assert.equal(failedOnlyRoom.guestEloDelta, 0);
  } finally {
    setSupabaseAdminForTests(null);
    if (previous.url === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    else process.env.NEXT_PUBLIC_SUPABASE_URL = previous.url;
    if (previous.serviceKey === undefined) delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    else process.env.SUPABASE_SERVICE_ROLE_KEY = previous.serviceKey;
  }
});
