import test from 'node:test';
import assert from 'node:assert/strict';
import type { NextRequest } from 'next/server';
import { POST as updateRoom } from '../src/app/api/arena/room/[roomCode]/route';
import { ArenaPvPStore } from '../src/lib/services/arenaPvPStore';
import { setSupabaseAdminForTests } from '../src/lib/server/supabaseAdmin';
import { CODE_WARS_PROBLEMS_CATALOG } from '../src/lib/api/codeWarsApi';

const dbError = { message: 'In-memory readiness test' };
const makeAdminStub = () => {
  const response = { data: null, error: dbError };
  const chain: any = new Proxy({}, {
    get(_target, key) {
      if (key === 'then') return (resolve: (value: unknown) => unknown) => Promise.resolve(response).then(resolve);
      if (key === 'maybeSingle') return async () => response;
      if (key === 'insert' || key === 'upsert') return async () => ({ error: dbError });
      if (key === 'select' || key === 'eq' || key === 'update' || key === 'delete') return () => chain;
      return undefined;
    },
  });
  return { from: () => chain, rpc: async () => ({ data: null, error: dbError }) };
};

function request(roomCode: string, token: string, action: string): NextRequest {
  return new Request(`http://localhost/api/arena/room/${roomCode}`, {
    method: 'POST',
    headers: { authorization: `Bearer guest-token-${token}`, 'content-type': 'application/json' },
    body: JSON.stringify({ action }),
  }) as unknown as NextRequest;
}

let index = 0;
async function createRoomWithGuest(): Promise<string> {
  index += 1;
  const code = `ARENA-READY${index}`;
  await ArenaPvPStore.createRoom({
    roomCode: code,
    hostId: 'combatant_host',
    hostName: 'Host',
    problemId: CODE_WARS_PROBLEMS_CATALOG[0].id,
  });
  const joined = await ArenaPvPStore.joinRoom({ roomCode: code, guestId: 'combatant_guest', guestName: 'Guest' });
  assert.equal(joined.success, true);
  return code;
}

test('PvP starts only after both players are present and ready, and ready actions cannot reset a live clock', async () => {
  const previous = {
    nodeEnv: process.env.NODE_ENV,
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  };
  process.env.NODE_ENV = 'test';
  process.env.NEXT_PUBLIC_SUPABASE_URL = '';
  process.env.SUPABASE_SERVICE_ROLE_KEY = '';
  setSupabaseAdminForTests(makeAdminStub());

  try {
    const roomCode = await createRoomWithGuest();
    const prematureStart = await updateRoom(request(roomCode, 'host', 'start_game'), { params: Promise.resolve({ roomCode }) });
    assert.equal(prematureStart.status, 409);
    assert.equal((await ArenaPvPStore.getRoom(roomCode))?.status, 'waiting');

    const readyHost = await updateRoom(request(roomCode, 'host', 'toggle_ready'), { params: Promise.resolve({ roomCode }) });
    assert.equal(readyHost.status, 200);
    assert.equal((await ArenaPvPStore.getRoom(roomCode))?.hostReady, true);

    const stillPremature = await updateRoom(request(roomCode, 'host', 'start_game'), { params: Promise.resolve({ roomCode }) });
    assert.equal(stillPremature.status, 409);
    assert.equal((await ArenaPvPStore.getRoom(roomCode))?.status, 'waiting');

    const readyGuest = await updateRoom(request(roomCode, 'guest', 'toggle_ready'), { params: Promise.resolve({ roomCode }) });
    assert.equal(readyGuest.status, 200);
    const started = await ArenaPvPStore.getRoom(roomCode);
    assert.equal(started?.status, 'in_progress');
    assert.equal(started?.hostReady, true);
    assert.equal(started?.guestReady, true);
    const startedAt = started?.startedAt;

    const lateReadyToggle = await updateRoom(request(roomCode, 'host', 'toggle_ready'), { params: Promise.resolve({ roomCode }) });
    assert.equal(lateReadyToggle.status, 409);
    const liveRoom = await ArenaPvPStore.getRoom(roomCode);
    assert.equal(liveRoom?.status, 'in_progress');
    assert.equal(liveRoom?.startedAt, startedAt, 'A ready request cannot extend or restart a live battle');

    const repeatedStart = await updateRoom(request(roomCode, 'host', 'start_game'), { params: Promise.resolve({ roomCode }) });
    assert.equal(repeatedStart.status, 409);
    assert.equal((await ArenaPvPStore.getRoom(roomCode))?.startedAt, startedAt);
  } finally {
    setSupabaseAdminForTests(null);
    if (previous.nodeEnv === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = previous.nodeEnv;
    if (previous.url === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    else process.env.NEXT_PUBLIC_SUPABASE_URL = previous.url;
    if (previous.serviceKey === undefined) delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    else process.env.SUPABASE_SERVICE_ROLE_KEY = previous.serviceKey;
  }
});
