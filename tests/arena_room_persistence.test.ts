import test from 'node:test';
import assert from 'node:assert/strict';
import { ArenaPvPStore } from '../src/lib/services/arenaPvPStore';
import { setSupabaseAdminForTests } from '../src/lib/server/supabaseAdmin';
import { CODE_WARS_PROBLEMS_CATALOG } from '../src/lib/api/codeWarsApi';

test('Configured Arena storage failures do not report an in-memory room as created', async () => {
  const previous = {
    nodeEnv: process.env.NODE_ENV,
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  };
  process.env.NODE_ENV = 'production';
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://arena-storage-test.invalid';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key';

  const storageError = { message: 'storage unavailable' };
  setSupabaseAdminForTests({
    from() {
      return {
        insert: async () => ({ error: storageError }),
        select() {
          return {
            eq() {
              return { maybeSingle: async () => ({ data: null, error: storageError }) };
            },
          };
        },
      };
    },
  });

  const roomCode = `ARENA-F${Date.now().toString(36).slice(-6).toUpperCase()}`;
  try {
    await assert.rejects(
      ArenaPvPStore.createRoom({
        roomCode,
        hostId: 'persistent-host',
        hostName: 'Host',
        problemId: CODE_WARS_PROBLEMS_CATALOG[0].id,
      }),
      { message: 'ARENA_ROOM_PERSISTENCE_FAILED' },
    );
    assert.equal(await ArenaPvPStore.getRoom(roomCode), null, 'A failed database insert leaves no local room that could be mistaken for success');
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
