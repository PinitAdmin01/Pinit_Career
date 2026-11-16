import test from 'node:test';
import assert from 'node:assert/strict';
import type { NextRequest } from 'next/server';
import { POST as updateRoom } from '../src/app/api/arena/room/[roomCode]/route';
import { ArenaPvPStore } from '../src/lib/services/arenaPvPStore';
import { setSupabaseAdminForTests } from '../src/lib/server/supabaseAdmin';
import { CODE_WARS_PROBLEMS_CATALOG } from '../src/lib/api/codeWarsApi';

function makePersistentArenaStub() {
  let row: Record<string, any> | null = null;
  let writeIndex = 0;
  return {
    from(table: string) {
      if (table === 'arena_room_submissions') {
        return { upsert: async () => ({ error: { message: 'Submission storage not used in this test' } }) };
      }
      if (table !== 'arena_rooms') throw new Error(`Unexpected table ${table}`);
      return {
        insert: async (payload: Record<string, unknown>) => {
          row = {
            id: 'room-device-test',
            created_at: new Date().toISOString(),
            updated_at: `version-${++writeIndex}`,
            ...payload,
          };
          return { error: null };
        },
        select() {
          return {
            eq(_column: string, value: string) {
              return {
                maybeSingle: async () => ({
                  data: row?.room_code === value ? { ...row } : null,
                  error: null,
                }),
              };
            },
          };
        },
        update(payload: Record<string, unknown>) {
          const filters: Record<string, unknown> = {};
          const builder: any = {
            eq(column: string, value: unknown) {
              filters[column] = value;
              return builder;
            },
            async select() {
              if (!row || Object.entries(filters).some(([key, value]) => row?.[key] !== value)) {
                return { data: [], error: null };
              }
              row = { ...row, ...payload, updated_at: `version-${++writeIndex}` };
              return { data: [{ room_code: row.room_code }], error: null };
            },
          };
          return builder;
        },
      };
    },
  };
}

function request(roomCode: string, deviceId: string, progress: number, token: string): NextRequest {
  return new Request(`http://localhost/api/arena/room/${roomCode}`, {
    method: 'POST',
    headers: {
      authorization: `Bearer guest-token-${token}`,
      'x-combatant-device-id': deviceId,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      action: 'update_progress',
      code: `function solution() { return ${progress}; }`,
      testsPassed: progress,
      totalTests: 5,
      score: progress * 10,
    }),
  }) as unknown as NextRequest;
}

test('A second device cannot self-join; distinct players retain their room sides after reloads', async () => {
  const previous = {
    nodeEnv: process.env.NODE_ENV,
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  };
  process.env.NODE_ENV = 'test';
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://arena-device-test.invalid';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key';
  setSupabaseAdminForTests(makePersistentArenaStub());

  const roomCode = 'ARENA-DEVICE';
  try {
    await ArenaPvPStore.createRoom({
      roomCode,
      hostId: 'combatant_same',
      hostName: 'Same Learner',
      hostDeviceId: 'device-host',
      hostLanguage: 'typescript',
      problemId: CODE_WARS_PROBLEMS_CATALOG[0].id,
    });

    const persistedHost = await ArenaPvPStore.getRoom(roomCode);
    assert.equal(persistedHost?.hostDeviceId, 'device-host');

    const selfJoin = await ArenaPvPStore.joinRoom({
      roomCode,
      guestId: 'combatant_same',
      guestName: 'Same Learner',
      guestDeviceId: 'device-guest',
      guestLanguage: 'python',
    });
    assert.equal(selfJoin.success, false);
    assert.match(selfJoin.error || '', /cannot join your own room/i);
    assert.equal((await ArenaPvPStore.getRoom(roomCode))?.guestId, undefined, 'Self-join must leave the guest slot untouched');

    const joined = await ArenaPvPStore.joinRoom({
      roomCode,
      guestId: 'combatant_guest',
      guestName: 'Guest Challenger',
      guestDeviceId: 'device-guest',
      guestLanguage: 'python',
    });
    assert.equal(joined.success, true);
    assert.equal(joined.room?.guestId, 'combatant_guest');

    const persisted = await ArenaPvPStore.getRoom(roomCode);
    assert.equal(persisted?.guestDeviceId, 'device-guest');
    assert.equal(persisted?.guestLanguage, 'python');

    const guestWrite = await updateRoom(request(roomCode, 'device-guest', 3, 'guest'), { params: Promise.resolve({ roomCode }) });
    assert.equal(guestWrite.status, 200);
    const afterGuestWrite = await ArenaPvPStore.getRoom(roomCode);
    assert.equal(afterGuestWrite?.hostProgress.testsPassed, 0);
    assert.equal(afterGuestWrite?.guestProgress.testsPassed, 3, 'The second device must update the guest-side progress');

    const hostWrite = await updateRoom(request(roomCode, 'device-host', 1, 'same'), { params: Promise.resolve({ roomCode }) });
    assert.equal(hostWrite.status, 200);
    const afterHostWrite = await ArenaPvPStore.getRoom(roomCode);
    assert.equal(afterHostWrite?.hostProgress.testsPassed, 1);
    assert.equal(afterHostWrite?.guestProgress.testsPassed, 3);
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
