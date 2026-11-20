import test from 'node:test';
import assert from 'node:assert/strict';
import { POST as startSolo } from '../src/app/api/arena/solo/start/route';
import { POST as createRoom } from '../src/app/api/arena/create-room/route';
import { POST as settleSolo } from '../src/app/api/arena/settle-solo/route';
import { POST as joinLeague } from '../src/app/api/leaderboard/join/route';
import { setSupabaseAdminForTests } from '../src/lib/server/supabaseAdmin';
import { signVaultSessionToken } from '../src/lib/server/vaultSessionToken';
import { CODE_WARS_PROBLEMS_CATALOG } from '../src/lib/api/codeWarsApi';

const jsonBody = (body: unknown) => ({
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify(body),
});

test('Arena and league API handlers enforce the public contracts without external services', async () => {
  const originalBypass = process.env.ALLOW_DEV_AUTH_BYPASS;
  const originalNodeEnv = process.env.NODE_ENV;
  process.env.ALLOW_DEV_AUTH_BYPASS = 'true';
  process.env.NODE_ENV = 'test';

  try {
    const problem = CODE_WARS_PROBLEMS_CATALOG[0];
    const guestHeaders = {
      'content-type': 'application/json',
      authorization: 'Bearer guest-token-contract-test',
    };

    const unpaidGuestRoom = await createRoom(new Request('http://localhost/api/arena/create-room', {
      ...jsonBody({ hostName: 'Guest', problemId: problem.id }),
      headers: guestHeaders,
    }));
    assert.equal(unpaidGuestRoom.status, 401, 'Guest/local wallets cannot authorize paid room creation on the server');
    assert.equal((await unpaidGuestRoom.json()).error, 'AUTH_REQUIRED_FOR_PAID_ARENA_ROOM');

    const unpaidDemoRoom = await createRoom(new Request('http://localhost/api/arena/create-room', {
      ...jsonBody({ hostName: 'Demo', problemId: problem.id }),
      headers: { 'content-type': 'application/json', authorization: 'Bearer demo-token-bypass' },
    }));
    assert.equal(unpaidDemoRoom.status, 401, 'Non-persistent development identities cannot skip the server-side fee');

    const roomAccountId = 'bf1f1bc4-3852-4fa3-a928-0f65d7cd3344';
    const roomUserToken = signVaultSessionToken({
      uid: roomAccountId,
      role: 'student',
      exp: Date.now() + 60_000,
    });
    let roomFeeRpcCalls = 0;
    setSupabaseAdminForTests({
      rpc: async (name: string, args: Record<string, unknown>) => {
        assert.equal(name, 'create_arena_room_with_pin_fee');
        assert.equal(args.p_user_id, roomAccountId, 'The server charges the verified account, not a client-supplied player ID');
        roomFeeRpcCalls += 1;
        return { data: { ok: false, error: 'INSUFFICIENT_PINS' }, error: null };
      },
    });
    const insufficientRoom = await createRoom(new Request('http://localhost/api/arena/create-room', {
      ...jsonBody({ hostName: 'Student', problemId: problem.id, requestId: '15e9cc67-df1e-47fc-9da8-bfbaf002a9e9' }),
      headers: { 'content-type': 'application/json', authorization: `Bearer ${roomUserToken}` },
    }));
    assert.equal(insufficientRoom.status, 402);
    assert.equal((await insufficientRoom.json()).error, 'INSUFFICIENT_PINS');
    assert.equal(roomFeeRpcCalls, 1, 'Every persistent room creation attempt must reach the atomic server-side fee check');

    const unauthorized = await startSolo(new Request('http://localhost/api/arena/solo/start', jsonBody({ problemId: problem.id })));
    assert.equal(unauthorized.status, 401, 'Unauthenticated callers cannot open an Arena match');

    const invalidProblem = await startSolo(new Request('http://localhost/api/arena/solo/start', {
      ...jsonBody({ problemId: '__not_a_real_problem__' }),
      headers: guestHeaders,
    }));
    assert.equal(invalidProblem.status, 400, 'Arena rejects problems outside its authoritative catalog');
    assert.equal((await invalidProblem.json()).error, 'UNSUPPORTED_PROBLEM');

    const guestMatchResponse = await startSolo(new Request('http://localhost/api/arena/solo/start', {
      ...jsonBody({ problemId: problem.id }),
      headers: guestHeaders,
    }));
    assert.equal(guestMatchResponse.status, 200);
    const guestMatch = await guestMatchResponse.json();
    assert.equal(guestMatch.ok, true);
    assert.equal(guestMatch.persisted, false, 'Guest duels do not create or award persistent student matches');
    assert.ok(typeof guestMatch.matchId === 'string' && guestMatch.matchId.length > 0);

    const guestSettlement = await settleSolo(new Request('http://localhost/api/arena/settle-solo', {
      ...jsonBody({ matchId: guestMatch.matchId, code: 'anything' }),
      headers: guestHeaders,
    }));
    assert.equal(guestSettlement.status, 200);
    assert.deepEqual(
      (({ rewardUnavailable, eloDelta, arenaPointsAwarded, pinsAwarded }) => ({ rewardUnavailable, eloDelta, arenaPointsAwarded, pinsAwarded }))(await guestSettlement.json()),
      { rewardUnavailable: true, eloDelta: 0, arenaPointsAwarded: 0, pinsAwarded: 0 },
      'Guest results never mint persistent competitive points or Pins',
    );

    const paidMatchRequestId = 'f1ed2362-09c8-4c88-9bd5-31a7b41f21d9';
    let paidMatchRpcArgs: Record<string, unknown> | null = null;
    let paidMatchRpcReply: { data: Record<string, unknown> | null; error: { message: string } | null } = {
      data: {
        ok: true,
        replayed: false,
        matchId: 'server-paid-match-id',
        startedAt: '2026-11-17T12:00:00.000Z',
        deadlineAt: '2026-11-17T12:10:00.000Z',
        newBalance: 40,
        newBonusBalance: 10,
      },
      error: null,
    };
    setSupabaseAdminForTests({
      rpc: async (name: string, args: Record<string, unknown>) => {
        assert.equal(name, 'start_solo_arena_match_with_pin_fee');
        paidMatchRpcArgs = args;
        return paidMatchRpcReply;
      },
    });

    const paidMatchResponse = await startSolo(new Request('http://localhost/api/arena/solo/start', {
      ...jsonBody({ problemId: problem.id, requestId: paidMatchRequestId }),
      headers: { authorization: 'Bearer demo-token-bypass' },
    }));
    assert.equal(paidMatchResponse.status, 200);
    const paidMatch = await paidMatchResponse.json();
    assert.equal(paidMatch.persisted, true);
    assert.equal(paidMatch.matchId, 'server-paid-match-id');
    assert.equal(paidMatch.newBalance, 40);
    assert.equal(paidMatchRpcArgs?.p_request_id, paidMatchRequestId);
    assert.equal(paidMatchRpcArgs?.p_user_id, 'test_user_001', 'The server derives the charged user from verified auth');
    assert.equal(paidMatchRpcArgs?.p_problem_id, problem.id);

    paidMatchRpcReply = { data: { ok: false, error: 'INSUFFICIENT_PINS' }, error: null };
    const rejectedPaidMatchResponse = await startSolo(new Request('http://localhost/api/arena/solo/start', {
      ...jsonBody({ problemId: problem.id, requestId: '44f85957-9cbd-430a-879a-690de73a8fc1' }),
      headers: { authorization: 'Bearer demo-token-bypass' },
    }));
    assert.equal(rejectedPaidMatchResponse.status, 402);
    assert.equal((await rejectedPaidMatchResponse.json()).error, 'INSUFFICIENT_PINS');

    let profileXp = 99;
    let profileElo = 1200;
    let profileWins = 0;
    let profileJoinedAt: string | null = null;
    let savedMembership: Record<string, unknown> | null = null;
    const admin = {
      from(table: string) {
        assert.equal(table, 'users');
        return {
          select() {
            return {
              eq(_column: string, _value: string) {
                return {
                  maybeSingle: async () => ({
                    data: {
                      id: 'api-student',
                      role: 'student',
                      xp_total: profileXp,
                      league_tier: 'browns',
                      league_joined_at: profileJoinedAt,
                      arena_elo: profileElo,
                      arena_wins: profileWins,
                    },
                    error: null,
                  }),
                };
              },
            };
          },
          update(payload: Record<string, unknown>) {
            return {
              eq() {
                return {
                  is() {
                    return {
                      select() {
                        return {
                          maybeSingle: async () => {
                            savedMembership = payload;
                            profileJoinedAt = String(payload.league_joined_at);
                            return {
                              data: {
                                league_tier: payload.league_tier,
                                league_joined_at: profileJoinedAt,
                                arena_elo: payload.arena_elo,
                                arena_wins: profileWins,
                              },
                              error: null,
                            };
                          },
                        };
                      },
                    };
                  },
                };
              },
            };
          },
        };
      },
    };
    setSupabaseAdminForTests(admin);

    const lockedJoin = await joinLeague(new Request('http://localhost/api/leaderboard/join', {
      ...jsonBody({}),
      headers: { authorization: 'Bearer test-token-api-student' },
    }));
    assert.equal(lockedJoin.status, 403, '99 lifetime XP is below the Browns entry requirement');
    assert.equal((await lockedJoin.json()).error, 'LEAGUE_ENTRY_LOCKED');
    assert.equal(savedMembership, null, 'An under-qualified profile is not enrolled');

    profileXp = 100;
    const qualifiedJoin = await joinLeague(new Request('http://localhost/api/leaderboard/join', {
      ...jsonBody({}),
      headers: { authorization: 'Bearer test-token-api-student' },
    }));
    assert.equal(qualifiedJoin.status, 200);
    const joined = await qualifiedJoin.json();
    assert.deepEqual(
      { ok: joined.ok, leagueTier: joined.leagueTier, arenaElo: joined.arenaElo, careerXp: joined.careerXp },
      { ok: true, leagueTier: 'browns', arenaElo: 100, careerXp: 100 },
    );
    assert.equal(savedMembership?.league_tier, 'browns');
    assert.ok(typeof savedMembership?.league_joined_at === 'string');
    assert.equal(savedMembership?.arena_elo, 100, 'A legacy zero-win 1200 rating is repaired to the agreed 100 baseline');
    assert.equal(joined.currentUserHasJoined, true, 'The API returns an explicit persisted membership confirmation');
    assert.equal(joined.joinedAt, profileJoinedAt);

    // Ensure the mocked values are all used so accidental test fixture drift is visible.
    assert.equal(profileElo, 1200);
    assert.equal(profileWins, 0);
  } finally {
    setSupabaseAdminForTests(null);
    if (originalBypass === undefined) delete process.env.ALLOW_DEV_AUTH_BYPASS;
    else process.env.ALLOW_DEV_AUTH_BYPASS = originalBypass;
    if (originalNodeEnv === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = originalNodeEnv;
  }
});
