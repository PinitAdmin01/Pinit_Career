import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { buildFreshDatabase, createUser } from './helpers/db';

type JsonRecord = Record<string, any>;

function resultObject(value: unknown): JsonRecord {
  return typeof value === 'string' ? JSON.parse(value) as JsonRecord : value as JsonRecord;
}

test('Arena rewards, league entry, and weekly movement run against PostgreSQL behavior', async () => {
  const { db, failures } = await buildFreshDatabase();
  try {
    assert.deepEqual(failures, [], `Fresh schema migrations must apply: ${JSON.stringify(failures)}`);

    // Applying the new migration a second time must remain safe for a deploy retry.
    const migration = fs.readFileSync(
      path.join(process.cwd(), 'supabase/migrations/20261116010000_league_points_and_join_state.sql'),
      'utf8',
    );
    await db.exec(migration);

    const { rows: permissions } = await db.query<{
      anon_can_reset: boolean;
      authenticated_can_reset: boolean;
      service_role_can_reset: boolean;
    }>(`select
      has_function_privilege('anon', 'public.evaluate_weekly_leagues()', 'EXECUTE') as anon_can_reset,
      has_function_privilege('authenticated', 'public.evaluate_weekly_leagues()', 'EXECUTE') as authenticated_can_reset,
      has_function_privilege('service_role', 'public.evaluate_weekly_leagues()', 'EXECUTE') as service_role_can_reset`);
    assert.deepEqual(permissions[0], {
      anon_can_reset: false,
      authenticated_can_reset: false,
      service_role_can_reset: true,
    }, 'Only the cron service role may run the league reset RPC');

    const makeStudent = async (email: string) => createUser(db, { email, role: 'student', pins: 100 });

    const xpUser = await makeStudent('league-xp-test@pinit.test');
    const firstXp = await db.query<{ result: unknown }>(
      'select public.increment_xp($1::uuid, $2::integer, $3::text) as result',
      [xpUser, 50, 'quest:integration-test'],
    );
    const repeatedXp = await db.query<{ result: unknown }>(
      'select public.increment_xp($1::uuid, $2::integer, $3::text) as result',
      [xpUser, 50, 'quest:integration-test'],
    );
    assert.equal(resultObject(firstXp.rows[0].result).new_xp, 50);
    assert.equal(resultObject(repeatedXp.rows[0].result).already_granted, true);
    const { rows: xpTotals } = await db.query<{ xp_total: number; weekly_xp: number; ledger_rows: number }>(
      `select u.xp_total, u.weekly_xp,
        (select count(*)::integer from public.xp_ledger l where l.user_id = u.id) as ledger_rows
       from public.users u where u.id = $1::uuid`,
      [xpUser],
    );
    assert.deepEqual(xpTotals[0], { xp_total: 50, weekly_xp: 50, ledger_rows: 1 }, 'Quest XP retry must not double-award lifetime or sprint XP');

    const soloUser = await makeStudent('solo-arena-test@pinit.test');
    const soloMatchId = 'solo-integration-match';
    await db.query('insert into public.arena_solo_matches (match_id, user_id, problem_id, deadline_at) values ($1, $2::uuid, $3, now() + interval \'5 minutes\')', [soloMatchId, soloUser, 'two-sum']);
    const { rows: soloResult } = await db.query<{ result: unknown }>(
      'select public.settle_solo_arena_match($1::uuid, $2::text, true) as result',
      [soloUser, soloMatchId],
    );
    const solo = resultObject(soloResult[0].result);
    assert.equal(solo.newElo, 120);
    assert.equal(solo.eloDelta, 20);
    assert.equal(solo.arenaPointsAwarded, 50);
    assert.equal(solo.pinsAwarded, 0);
    const { rows: repeatedSoloResult } = await db.query<{ result: unknown }>(
      'select public.settle_solo_arena_match($1::uuid, $2::text, false) as result',
      [soloUser, soloMatchId],
    );
    assert.equal(resultObject(repeatedSoloResult[0].result).newElo, 120, 'A repeated settlement must return the original result');
    const { rows: soloProfile } = await db.query<{ arena_elo: number; weekly_arena_points: number; pins: number }>(
      'select arena_elo, weekly_arena_points, pins from public.users where id = $1::uuid', [soloUser],
    );
    assert.deepEqual(soloProfile[0], { arena_elo: 120, weekly_arena_points: 50, pins: 100 }, 'Solo replay must not duplicate Arena points or change Pins');

    const highEloWinner = await makeStudent('high-elo-winner@pinit.test');
    const highEloOpponent = await makeStudent('high-elo-opponent@pinit.test');
    const lowEloWinner = await makeStudent('low-elo-winner@pinit.test');
    const lowEloOpponent = await makeStudent('low-elo-opponent@pinit.test');
    await db.query('update public.users set arena_elo = 500, arena_wins = 1 where id = $1::uuid', [highEloWinner]);
    await db.query('update public.users set arena_elo = 400, arena_wins = 1 where id = $1::uuid', [highEloOpponent]);
    await db.query('update public.users set arena_elo = 200, arena_wins = 1 where id = $1::uuid', [lowEloWinner]);
    await db.query('update public.users set arena_elo = 180, arena_wins = 1 where id = $1::uuid', [lowEloOpponent]);

    const makeCompletedRoom = async (roomCode: string, hostId: string, guestId: string, winnerId: string) => {
      await db.query(
        `insert into public.arena_rooms (room_code, problem_id, difficulty, status, host_id, host_name, guest_id, guest_name, winner_id)
         values ($1, 'integration-problem', 'intermediate', 'completed', $2, 'Host', $3, 'Guest', $4)`,
        [roomCode, hostId, guestId, winnerId],
      );
    };
    await makeCompletedRoom('HIGH-ELO', highEloWinner, highEloOpponent, highEloWinner);
    await makeCompletedRoom('LOW-ELO', lowEloWinner, lowEloOpponent, lowEloWinner);
    const { rows: highEloSettlement } = await db.query<{ result: unknown }>(
      'select public.settle_arena_match_rewards($1::text) as result', ['HIGH-ELO'],
    );
    const { rows: lowEloSettlement } = await db.query<{ result: unknown }>(
      'select public.settle_arena_match_rewards($1::text) as result', ['LOW-ELO'],
    );
    assert.equal(resultObject(highEloSettlement[0].result).host_elo_delta, 20);
    assert.equal(resultObject(highEloSettlement[0].result).host_arena_points_award, 250);
    assert.equal(resultObject(lowEloSettlement[0].result).host_elo_delta, 20);
    assert.equal(resultObject(lowEloSettlement[0].result).host_arena_points_award, 100);
    await db.query('select public.settle_arena_match_rewards($1::text)', ['HIGH-ELO']);
    const { rows: replayedPvp } = await db.query<{ arena_elo: number; weekly_arena_points: number }>(
      'select arena_elo, weekly_arena_points from public.users where id = $1::uuid', [highEloWinner],
    );
    assert.deepEqual(replayedPvp[0], { arena_elo: 520, weekly_arena_points: 250 }, 'PvP replay must not apply the Elo or Arena points twice');

    const browns: Array<{ id: string; score: number; elo: number }> = [];
    const silver: Array<{ id: string; score: number; elo: number }> = [];
    for (let rank = 1; rank <= 20; rank++) {
      browns.push({
        id: await makeStudent(`browns-${rank}@pinit.test`),
        score: rank === 1 ? 1000 : rank === 2 ? 500 : rank === 20 ? 0 : 300 - rank * 10,
        elo: rank === 20 ? 5000 : 100,
      });
      silver.push({
        id: await makeStudent(`silver-${rank}@pinit.test`),
        score: rank === 1 ? 500 : rank === 2 ? 400 : rank === 19 ? 5 : rank === 20 ? 0 : 300 - rank * 10,
        elo: rank === 20 ? 2000 : rank === 1 ? 100 : 200,
      });
    }

    for (const [tier, players] of [['browns', browns], ['silver', silver]] as const) {
      for (const [index, player] of players.entries()) {
        const weeklyXp = tier === 'browns'
          ? (index === 0 ? player.score : 0)
          : (index === 1 ? 300 : 0);
        const arenaPoints = player.score - weeklyXp;
        await db.query(
          `update public.users set xp_total = 100, weekly_xp = $2, weekly_arena_points = $3,
            league_tier = $4, league_joined_at = now() - interval '1 day', arena_elo = $5,
            last_league_eval = null where id = $1::uuid`,
          [player.id, weeklyXp, arenaPoints, tier, player.elo],
        );
      }
    }

    const lockedUser = await makeStudent('not-yet-qualified@pinit.test');
    await db.query('update public.users set xp_total = 99, league_tier = \'browns\', league_joined_at = null where id = $1::uuid', [lockedUser]);
    const { rows: joinEligibility } = await db.query<{ xp_total: number; league_joined_at: string | null }>(
      'select xp_total, league_joined_at from public.users where id = $1::uuid', [lockedUser],
    );
    assert.equal(joinEligibility[0].xp_total >= 100, false);
    assert.equal(joinEligibility[0].league_joined_at, null, 'An unqualified profile is not an enrolled league member');

    const { rows: cycleResult } = await db.query<{ result: unknown }>('select public.evaluate_weekly_leagues() as result');
    const cycle = resultObject(cycleResult[0].result);
    assert.equal(cycle.ok, true);

    const { rows: movedRows } = await db.query<{ id: string; league_tier: string; weekly_xp: number; weekly_arena_points: number }>(
      `select id::text, league_tier, weekly_xp, weekly_arena_points
       from public.users where id = any($1::uuid[])`,
      [[browns[0].id, browns[19].id, silver[0].id, silver[19].id]],
    );
    const movedById = new Map(movedRows.map((row) => [row.id, row]));
    assert.equal(movedById.get(browns[0].id)?.league_tier, 'silver', 'Browns promotion follows weekly League Points rank');
    assert.equal(movedById.get(browns[19].id)?.league_tier, 'browns', 'High ELO alone does not move a low-ranked Browns member');
    assert.equal(movedById.get(silver[0].id)?.league_tier, 'gold', 'Arena Points can carry a low-ELO learner into promotion');
    assert.equal(movedById.get(silver[19].id)?.league_tier, 'browns', 'A high-ELO player at the bottom is demoted by League Points rank');
    assert.ok(movedRows.every((row) => row.weekly_xp === 0 && row.weekly_arena_points === 0), 'Both sprint score inputs reset after moves');

    const { rows: historyRows } = await db.query<{ league_history: JsonRecord[] }>(
      'select league_history from public.users where id = $1::uuid', [silver[0].id],
    );
    assert.equal(historyRows[0].league_history[0].league_points, 500, 'Movement history records the combined score used to rank');
    const { rows: repeatCycle } = await db.query<{ result: unknown }>('select public.evaluate_weekly_leagues() as result');
    assert.equal(resultObject(repeatCycle[0].result).alreadyEvaluated, true, 'A second reset in the same weekly cycle is a no-op');
  } finally {
    await db.close();
  }
});
