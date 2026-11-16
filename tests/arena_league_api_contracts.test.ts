import test from 'node:test';
import assert from 'node:assert/strict';
import { POST as startSolo } from '../src/app/api/arena/solo/start/route';
import { POST as settleSolo } from '../src/app/api/arena/settle-solo/route';
import { POST as joinLeague } from '../src/app/api/leaderboard/join/route';
import { setSupabaseAdminForTests } from '../src/lib/server/supabaseAdmin';
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

    let profileXp = 99;
    let profileElo = 1200;
    let profileWins = 0;
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
                      league_joined_at: null,
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
              eq: async () => {
                savedMembership = payload;
                return { error: null };
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
