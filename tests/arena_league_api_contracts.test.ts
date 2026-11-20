import test from 'node:test';
import assert from 'node:assert/strict';
import { POST as startSolo } from '../src/app/api/arena/solo/start/route';
import { POST as evaluateCode } from '../src/app/api/code/evaluate/route';
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

    const missingSoloIdempotencyKey = await startSolo(new Request('http://localhost/api/arena/solo/start', {
      ...jsonBody({ problemId: problem.id }),
      headers: { authorization: 'Bearer demo-token-bypass' },
    }));
    assert.equal(missingSoloIdempotencyKey.status, 400, 'Persistent wallet charges require a replay-safe start key');
    assert.equal((await missingSoloIdempotencyKey.json()).error, 'IDEMPOTENCY_KEY_REQUIRED');

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
        problemId: 'canonical-server-problem',
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
    assert.equal(paidMatch.problemId, 'canonical-server-problem', 'A replay uses the challenge already stored with the charged match');
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

    const malformedEvaluation = await evaluateCode(new Request('http://localhost/api/code/evaluate', {
      ...jsonBody(null),
      headers: { authorization: 'Bearer demo-token-bypass', 'content-type': 'application/json' },
    }) as any);
    assert.equal(malformedEvaluation.status, 400, 'Malformed evaluation bodies return a client error instead of crashing into a 500');
    assert.equal((await malformedEvaluation.json()).error, 'INVALID_REQUEST_BODY');

    const inheritedProblem = await evaluateCode(new Request('http://localhost/api/code/evaluate', {
      ...jsonBody({ problemId: 'toString', code: 'function toString() { return 1; }', language: 'javascript' }),
      headers: { authorization: 'Bearer demo-token-bypass', 'content-type': 'application/json' },
    }) as any);
    assert.equal(inheritedProblem.status, 400, 'Inherited object property names cannot be treated as supported problem IDs');
    assert.equal((await inheritedProblem.json()).error, 'UNSUPPORTED_PROBLEM');

    let unexpectedXpRpcCalls = 0;
    setSupabaseAdminForTests({
      from(table: string) {
        assert.equal(table, 'arena_solo_matches');
        const query = {
          select() { return query; },
          eq() { return query; },
          maybeSingle: async () => ({ data: null, error: { message: 'temporary lookup failure' } }),
        };
        return query;
      },
      rpc: async () => {
        unexpectedXpRpcCalls += 1;
        return { data: { ok: true }, error: null };
      },
    });
    const evaluationDuringMatchLookupFailure = await evaluateCode(new Request('http://localhost/api/code/evaluate', {
      ...jsonBody({
        problemId: 'war_two_sum_01',
        matchId: 'solo-practice-match',
        rewardEligible: true,
        language: 'javascript',
        code: 'function twoSum(nums, target) { const seen = new Map(); for (let i = 0; i < nums.length; i++) { const need = target - nums[i]; if (seen.has(need)) return [seen.get(need), i]; seen.set(nums[i], i); } return []; }',
      }),
      headers: { authorization: 'Bearer demo-token-bypass', 'content-type': 'application/json' },
    }) as any);
    assert.equal(evaluationDuringMatchLookupFailure.status, 200);
    const evaluationResult = await evaluationDuringMatchLookupFailure.json();
    assert.equal(evaluationResult.passed, true, 'The solution is still evaluated even if its match reward check is unavailable');
    assert.equal(evaluationResult.rewardEligible, false, 'The server fails closed on reward eligibility lookup errors');
    assert.equal(evaluationResult.xpAwarded, 0);
    assert.equal(unexpectedXpRpcCalls, 0, 'The reward grant must not run after an uncertain practice-match check');

    let verifiedSoloMatch: { match_id: string; problem_id: string } | null = null;
    let soloMatchLookupError: { message: string } | null = { message: 'temporary lookup failure' };
    setSupabaseAdminForTests({
      from(table: string) {
        assert.equal(table, 'arena_solo_matches');
        const query = {
          select() { return query; },
          eq() { return query; },
          maybeSingle: async () => ({ data: verifiedSoloMatch, error: soloMatchLookupError }),
        };
        return query;
      },
      rpc: async () => {
        unexpectedXpRpcCalls += 1;
        return { data: { ok: true }, error: null };
      },
    });
    soloMatchLookupError = null;
    verifiedSoloMatch = { match_id: 'solo-practice-match', problem_id: 'war_two_sum_01' };
    const evaluationOfVerifiedPractice = await evaluateCode(new Request('http://localhost/api/code/evaluate', {
      ...jsonBody({
        problemId: 'war_two_sum_01',
        matchId: 'solo-practice-match',
        rewardEligible: true,
        language: 'javascript',
        code: 'function twoSum(nums, target) { const seen = new Map(); for (let i = 0; i < nums.length; i++) { const need = target - nums[i]; if (seen.has(need)) return [seen.get(need), i]; seen.set(nums[i], i); } return []; }',
      }),
      headers: { authorization: 'Bearer demo-token-bypass', 'content-type': 'application/json' },
    }) as any);
    assert.equal(evaluationOfVerifiedPractice.status, 200);
    const verifiedPracticeResult = await evaluationOfVerifiedPractice.json();
    assert.equal(verifiedPracticeResult.passed, true);
    assert.equal(verifiedPracticeResult.rewardEligible, false, 'The server ignores a client request to reward a persisted bot-practice match');
    assert.equal(verifiedPracticeResult.xpAwarded, 0);
    assert.equal(unexpectedXpRpcCalls, 0, 'Verified bot practice must not invoke first-clear XP settlement');

    const mismatchedPracticeProblem = await evaluateCode(new Request('http://localhost/api/code/evaluate', {
      ...jsonBody({
        problemId: 'war_reverse_string_03',
        matchId: 'solo-practice-match',
        language: 'javascript',
        code: 'function reverseString(s) { return s.split("").reverse().join(""); }',
      }),
      headers: { authorization: 'Bearer demo-token-bypass', 'content-type': 'application/json' },
    }) as any);
    assert.equal(mismatchedPracticeProblem.status, 400, 'A submission cannot swap the problem for an already charged practice match');
    assert.equal((await mismatchedPracticeProblem.json()).error, 'MATCH_PROBLEM_MISMATCH');

    let profileXp: unknown = 99;
    let profileElo: number | null = 1200;
    let profileWins = 0;
    let profileRole: string | null = 'student';
    let profileExists = true;
    let profileJoinedAt: string | null = null;
    let profileTier = 'browns';
    let savedMembership: Record<string, unknown> | null = null;
    let returnPersistedMembership = true;
    let simulateConcurrentJoin = false;
    const admin = {
      from(table: string) {
        assert.equal(table, 'users');
        return {
          select() {
            return {
              eq(_column: string, _value: string) {
                return {
                  maybeSingle: async () => ({
                    data: profileExists ? {
                      id: 'api-student',
                      role: profileRole,
                      xp_total: profileXp,
                      league_tier: profileTier,
                      league_joined_at: profileJoinedAt,
                      arena_elo: profileElo,
                      arena_wins: profileWins,
                    } : null,
                    error: null,
                  }),
                };
              },
            };
          },
          update(payload: Record<string, unknown>) {
            return {
              eq() {
                savedMembership = payload;
                return {
                  is() {
                    return {
                      select() {
                        return {
                          maybeSingle: async () => {
                            if (!returnPersistedMembership) {
                              if (simulateConcurrentJoin) {
                                profileJoinedAt = new Date().toISOString();
                                profileTier = 'browns';
                                profileElo = Number(payload.arena_elo);
                              }
                              return { data: null, error: null };
                            }
                            profileJoinedAt = String(payload.league_joined_at);
                            profileTier = String(payload.league_tier);
                            profileElo = Number(payload.arena_elo);
                            return {
                              data: { league_tier: profileTier, league_joined_at: profileJoinedAt, arena_elo: profileElo },
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

    const unauthorizedJoin = await joinLeague(new Request('http://localhost/api/leaderboard/join', jsonBody({})));
    assert.equal(unauthorizedJoin.status, 401, 'An unverified user cannot enroll through the API');

    const lockedJoin = await joinLeague(new Request('http://localhost/api/leaderboard/join', {
      ...jsonBody({}),
      headers: { authorization: 'Bearer test-token-api-student' },
    }));
    assert.equal(lockedJoin.status, 403, '99 lifetime XP is below the Browns entry requirement');
    assert.equal((await lockedJoin.json()).error, 'LEAGUE_ENTRY_LOCKED');
    assert.equal(savedMembership, null, 'An under-qualified profile is not enrolled');

    profileXp = 'Infinity';
    const invalidXpJoin = await joinLeague(new Request('http://localhost/api/leaderboard/join', {
      ...jsonBody({}),
      headers: { authorization: 'Bearer test-token-api-student' },
    }));
    assert.equal(invalidXpJoin.status, 403, 'Non-finite XP cannot satisfy the entry requirement');

    profileXp = 100;
    profileRole = 'teacher';
    const staffJoin = await joinLeague(new Request('http://localhost/api/leaderboard/join', {
      ...jsonBody({}),
      headers: { authorization: 'Bearer test-token-api-student' },
    }));
    assert.equal(staffJoin.status, 403);
    assert.equal((await staffJoin.json()).error, 'STUDENTS_ONLY');

    profileRole = '';
    const emptyRoleJoin = await joinLeague(new Request('http://localhost/api/leaderboard/join', {
      ...jsonBody({}),
      headers: { authorization: 'Bearer test-token-api-student' },
    }));
    assert.equal(emptyRoleJoin.status, 403, 'A malformed non-null role cannot enroll as a student');

    profileRole = 'student';
    profileExists = false;
    const missingProfileJoin = await joinLeague(new Request('http://localhost/api/leaderboard/join', {
      ...jsonBody({}),
      headers: { authorization: 'Bearer test-token-api-student' },
    }));
    assert.equal(missingProfileJoin.status, 404);
    assert.equal((await missingProfileJoin.json()).error, 'USER_PROFILE_NOT_FOUND');
    profileExists = true;

    profileXp = 100;
    profileElo = 1200;
    profileWins = 0;
    const qualifiedJoin = await joinLeague(new Request('http://localhost/api/leaderboard/join', {
      ...jsonBody({}),
      headers: { authorization: 'Bearer test-token-api-student' },
    }));
    assert.equal(qualifiedJoin.status, 200);
    const joined = await qualifiedJoin.json();
    assert.deepEqual(
      { ok: joined.ok, leagueTier: joined.leagueTier, arenaElo: joined.arenaElo, careerXp: joined.careerXp, currentUserHasJoined: joined.currentUserHasJoined },
      { ok: true, leagueTier: 'browns', arenaElo: 100, careerXp: 100, currentUserHasJoined: true },
    );
    assert.ok(typeof joined.joinedAt === 'string');
    assert.equal(savedMembership?.league_tier, 'browns');
    assert.ok(typeof savedMembership?.league_joined_at === 'string');
    assert.equal(savedMembership?.arena_elo, 100, 'A legacy zero-win 1200 rating is repaired to the agreed 100 baseline');

    // Ensure the mocked values are all used so accidental test fixture drift is visible.
    assert.equal(profileElo, 100);
    assert.equal(profileWins, 0);

    // A retry is idempotent and a previous member stays enrolled if XP later
    // falls below the entry threshold; the existing row must not be rewritten.
    profileXp = 0;
    profileTier = 'silver';
    savedMembership = null;
    const repeatedJoin = await joinLeague(new Request('http://localhost/api/leaderboard/join', {
      ...jsonBody({}),
      headers: { authorization: 'Bearer test-token-api-student' },
    }));
    assert.equal(repeatedJoin.status, 200);
    const repeatedJoinBody = await repeatedJoin.json();
    assert.equal(repeatedJoinBody.alreadyJoined, true);
    assert.equal(repeatedJoinBody.leagueTier, 'silver', 'Idempotent calls preserve the member\'s promoted division');
    assert.equal(savedMembership, null, 'An idempotent retry does not rewrite the membership row');

    // Missing Elo uses the agreed default rather than Number(null) becoming 0.
    profileXp = 100;
    profileJoinedAt = null;
    profileElo = null;
    const nullEloJoin = await joinLeague(new Request('http://localhost/api/leaderboard/join', {
      ...jsonBody({}),
      headers: { authorization: 'Bearer test-token-api-student' },
    }));
    assert.equal(nullEloJoin.status, 200);
    assert.equal((await nullEloJoin.json()).arenaElo, 100);

    profileJoinedAt = null;
    profileElo = -25;
    const negativeEloJoin = await joinLeague(new Request('http://localhost/api/leaderboard/join', {
      ...jsonBody({}),
      headers: { authorization: 'Bearer test-token-api-student' },
    }));
    assert.equal(negativeEloJoin.status, 200);
    assert.equal((await negativeEloJoin.json()).arenaElo, 100, 'A corrupt negative rating is repaired to the baseline');

    // Simulate a concurrent request winning between our read and conditional
    // update: the losing request must re-read and report the persisted join.
    profileJoinedAt = null;
    profileElo = 100;
    profileTier = 'browns';
    returnPersistedMembership = false;
    simulateConcurrentJoin = true;
    const concurrentMembershipJoin = await joinLeague(new Request('http://localhost/api/leaderboard/join', {
      ...jsonBody({}),
      headers: { authorization: 'Bearer test-token-api-student' },
    }));
    assert.equal(concurrentMembershipJoin.status, 200, 'A concurrent successful join is returned as success after readback');
    assert.equal((await concurrentMembershipJoin.json()).alreadyJoined, true);

    profileJoinedAt = null;
    simulateConcurrentJoin = false;
    returnPersistedMembership = false;
    const rejectedUnpersistedJoin = await joinLeague(new Request('http://localhost/api/leaderboard/join', {
      ...jsonBody({}),
      headers: { authorization: 'Bearer test-token-api-student' },
    }));
    assert.equal(rejectedUnpersistedJoin.status, 503, 'The join API must not report success when the membership write returns no row');
    assert.equal((await rejectedUnpersistedJoin.json()).error, 'LEAGUE_JOIN_NOT_PERSISTED');
  } finally {
    setSupabaseAdminForTests(null);
    if (originalBypass === undefined) delete process.env.ALLOW_DEV_AUTH_BYPASS;
    else process.env.ALLOW_DEV_AUTH_BYPASS = originalBypass;
    if (originalNodeEnv === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = originalNodeEnv;
  }
});
