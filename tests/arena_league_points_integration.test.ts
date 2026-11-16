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
    const roomFeeMigration = fs.readFileSync(
      path.join(process.cwd(), 'supabase/migrations/20261117010000_atomic_arena_room_creation_and_fee.sql'),
      'utf8',
    );
    const legacySelfMatchHost = '8e2b5e4d-6b82-465f-b37a-72d5f922f389';
    await db.query(
      `insert into public.arena_rooms (room_code, problem_id, host_id, host_name, guest_id, status, winner_id)
       values ('LEGACYSELF1', 'war_two_sum_01', $1, 'Host', $2, 'completed', $1)`,
      [legacySelfMatchHost, `${legacySelfMatchHost}_challenger`],
    );
    await db.exec(roomFeeMigration);
    const { rows: cleanedSelfMatches } = await db.query<{
      status: string;
      winner_id: string | null;
      elo_applied: boolean;
      host_arena_points_award: number;
      guest_arena_points_award: number;
    }>(`select status, winner_id, elo_applied, host_arena_points_award, guest_arena_points_award
       from public.arena_rooms where room_code = 'LEGACYSELF1'`);
    assert.deepEqual(cleanedSelfMatches[0], {
      status: 'cancelled',
      winner_id: null,
      elo_applied: true,
      host_arena_points_award: 0,
      guest_arena_points_award: 0,
    }, 'Legacy rooms where one account filled both slots are cancelled without ratings or points');

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

    const { rows: roomFeePermissions } = await db.query<{
      anon_can_create: boolean;
      authenticated_can_create: boolean;
      service_role_can_create: boolean;
    }>(`select
      has_function_privilege('anon', 'public.create_arena_room_with_pin_fee(uuid,uuid,character varying,text,text,text,text,text,text,integer,jsonb,jsonb)', 'EXECUTE') as anon_can_create,
      has_function_privilege('authenticated', 'public.create_arena_room_with_pin_fee(uuid,uuid,character varying,text,text,text,text,text,text,integer,jsonb,jsonb)', 'EXECUTE') as authenticated_can_create,
      has_function_privilege('service_role', 'public.create_arena_room_with_pin_fee(uuid,uuid,character varying,text,text,text,text,text,text,integer,jsonb,jsonb)', 'EXECUTE') as service_role_can_create`);
    assert.deepEqual(roomFeePermissions[0], {
      anon_can_create: false,
      authenticated_can_create: false,
      service_role_can_create: true,
    }, 'Only the server service role may atomically create and charge for an Arena room');

    const { rows: soloFeePermissions } = await db.query<{
      anon_can_start: boolean;
      authenticated_can_start: boolean;
      service_role_can_start: boolean;
    }>(`select
      has_function_privilege('anon', 'public.start_solo_arena_match_with_pin_fee(uuid,uuid,text,text,timestamp with time zone,timestamp with time zone)', 'EXECUTE') as anon_can_start,
      has_function_privilege('authenticated', 'public.start_solo_arena_match_with_pin_fee(uuid,uuid,text,text,timestamp with time zone,timestamp with time zone)', 'EXECUTE') as authenticated_can_start,
      has_function_privilege('service_role', 'public.start_solo_arena_match_with_pin_fee(uuid,uuid,text,text,timestamp with time zone,timestamp with time zone)', 'EXECUTE') as service_role_can_start`);
    assert.deepEqual(soloFeePermissions[0], {
      anon_can_start: false,
      authenticated_can_start: false,
      service_role_can_start: true,
    }, 'Only the server service role may start and charge for a rated solo Arena match');

    const feeUser = await createUser(db, { email: 'arena-room-fee@pinit.test', role: 'student', pins: 100 });
    const feeRequestId = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
    const hostProgress = JSON.stringify({ testsPassed: 0, totalTests: 5, score: 0, submitted: false, code: '', language: 'typescript' });
    const guestProgress = JSON.stringify({ testsPassed: 0, totalTests: 5, score: 0, submitted: false, code: '', language: 'typescript' });
    const createPaidRoom = (requestId: string, userId: string, roomCode: string) => db.query<{ result: unknown }>(
      `select public.create_arena_room_with_pin_fee(
        $1::uuid, $2::uuid, $3::varchar, $4::text, $5::text, $6::text,
        $7::text, $8::text, $9::text, $10::integer, $11::jsonb, $12::jsonb
      ) as result`,
      [requestId, userId, roomCode, 'Host', '', 'device', 'typescript', 'integration-problem', 'intermediate', 600, hostProgress, guestProgress],
    );
    const firstPaidRoom = resultObject((await createPaidRoom(feeRequestId, feeUser, 'ARENA-FEE-ONCE')).rows[0].result);
    assert.equal(firstPaidRoom.ok, true);
    assert.equal(firstPaidRoom.newBalance, 90);
    assert.equal(firstPaidRoom.room.room_code, 'ARENA-FEE-ONCE');
    const replayedPaidRoom = resultObject((await createPaidRoom(feeRequestId, feeUser, 'ARENA-FEE-REPLAY')).rows[0].result);
    assert.equal(replayedPaidRoom.ok, true);
    assert.equal(replayedPaidRoom.replayed, true);
    assert.equal(replayedPaidRoom.newBalance, 90);
    assert.equal(replayedPaidRoom.room.room_code, 'ARENA-FEE-ONCE', 'A retry returns the same room without another charge');
    const { rows: paidProfile } = await db.query<{ pins: number; room_count: number }>(
      `select u.pins, (select count(*)::integer from public.arena_rooms where host_id = u.id::text) as room_count
       from public.users u where u.id = $1::uuid`, [feeUser],
    );
    assert.deepEqual(paidProfile[0], { pins: 90, room_count: 1 });

    const otherFeeUser = await createUser(db, { email: 'arena-room-other-account@pinit.test', role: 'student', pins: 100 });
    const stolenRequest = resultObject((await createPaidRoom(feeRequestId, otherFeeUser, 'ARENA-OTHER1')).rows[0].result);
    assert.equal(stolenRequest.ok, false);
    assert.equal(stolenRequest.error, 'IDEMPOTENCY_KEY_CONFLICT');
    const { rows: otherBalance } = await db.query<{ pins: number }>(
      'select pins from public.users where id = $1::uuid', [otherFeeUser],
    );
    assert.equal(otherBalance[0].pins, 100, 'Another account cannot reuse a request key or be charged for its room');

    const bonusFeeUser = await createUser(db, { email: 'arena-room-bonus-fee@pinit.test', role: 'student', pins: 5 });
    await db.query('update public.users set bonus_pins = 10 where id = $1::uuid', [bonusFeeUser]);
    const bonusPaidRoom = resultObject((await createPaidRoom('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', bonusFeeUser, 'ARENA-FEE-BONUS')).rows[0].result);
    assert.equal(bonusPaidRoom.ok, true);
    assert.equal(bonusPaidRoom.newBalance, 0);
    assert.equal(bonusPaidRoom.newBonusBalance, 5, 'The 10 Pin fee uses daily Pins first and then the vault balance');

    const poorFeeUser = await createUser(db, { email: 'arena-room-poor-fee@pinit.test', role: 'student', pins: 9 });
    const rejectedRoom = resultObject((await createPaidRoom('cccccccc-cccc-4ccc-8ccc-cccccccccccc', poorFeeUser, 'ARENA-FEE-REJECT')).rows[0].result);
    assert.equal(rejectedRoom.ok, false);
    assert.equal(rejectedRoom.error, 'INSUFFICIENT_PINS');
    const { rows: rejectedProfile } = await db.query<{ pins: number; room_count: number }>(
      `select u.pins, (select count(*)::integer from public.arena_rooms where room_code = 'ARENA-FEE-REJECT') as room_count
       from public.users u where u.id = $1::uuid`, [poorFeeUser],
    );
    assert.deepEqual(rejectedProfile[0], { pins: 9, room_count: 0 }, 'A rejected room costs no Pins and leaves no orphan room');

    const failedInsertUser = await createUser(db, { email: 'arena-room-insert-failure@pinit.test', role: 'student', pins: 100 });
    await assert.rejects(createPaidRoom('dddddddd-dddd-4ddd-8ddd-dddddddddddd', failedInsertUser, 'ARENA-FEE-ONCE'));
    const { rows: failedInsertProfile } = await db.query<{ pins: number; request_count: number }>(
      `select u.pins, (select count(*)::integer from public.arena_room_create_requests where user_id = u.id) as request_count
       from public.users u where u.id = $1::uuid`, [failedInsertUser],
    );
    assert.deepEqual(failedInsertProfile[0], { pins: 100, request_count: 0 }, 'A room insert failure rolls back both the Pin fee and its request key');

    const soloFeeUser = await createUser(db, { email: 'arena-solo-fee@pinit.test', role: 'student', pins: 100 });
    const soloFeeRequestId = 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee';
    const startPaidSoloMatch = (requestId: string, userId: string, matchId: string) => db.query<{ result: unknown }>(
      `select public.start_solo_arena_match_with_pin_fee(
        $1::uuid, $2::uuid, $3::text, $4::text, now(), now() + interval '5 minutes'
      ) as result`,
      [requestId, userId, matchId, 'integration-problem'],
    );
    const firstPaidSolo = resultObject((await startPaidSoloMatch(soloFeeRequestId, soloFeeUser, 'solo-pin-match')).rows[0].result);
    assert.equal(firstPaidSolo.ok, true);
    assert.equal(firstPaidSolo.newBalance, 90);
    const replayedPaidSolo = resultObject((await startPaidSoloMatch(soloFeeRequestId, soloFeeUser, 'solo-pin-match-retry')).rows[0].result);
    assert.equal(replayedPaidSolo.ok, true);
    assert.equal(replayedPaidSolo.replayed, true);
    assert.equal(replayedPaidSolo.matchId, 'solo-pin-match');
    assert.equal(replayedPaidSolo.newBalance, 90, 'A retried solo start returns the existing match without charging twice');

    const soloBonusUser = await createUser(db, { email: 'arena-solo-bonus-fee@pinit.test', role: 'student', pins: 5 });
    await db.query('update public.users set bonus_pins = 10 where id = $1::uuid', [soloBonusUser]);
    const bonusSolo = resultObject((await startPaidSoloMatch('ffffffff-ffff-4fff-8fff-ffffffffffff', soloBonusUser, 'solo-pin-bonus')).rows[0].result);
    assert.equal(bonusSolo.ok, true);
    assert.equal(bonusSolo.newBalance, 0);
    assert.equal(bonusSolo.newBonusBalance, 5);

    const poorSoloUser = await createUser(db, { email: 'arena-solo-poor-fee@pinit.test', role: 'student', pins: 9 });
    const rejectedSolo = resultObject((await startPaidSoloMatch('99999999-9999-4999-8999-999999999999', poorSoloUser, 'solo-pin-reject')).rows[0].result);
    assert.equal(rejectedSolo.ok, false);
    assert.equal(rejectedSolo.error, 'INSUFFICIENT_PINS');
    const { rows: rejectedSoloProfile } = await db.query<{ pins: number; match_count: number }>(
      `select u.pins, (select count(*)::integer from public.arena_solo_matches where match_id = 'solo-pin-reject') as match_count
       from public.users u where u.id = $1::uuid`, [poorSoloUser],
    );
    assert.deepEqual(rejectedSoloProfile[0], { pins: 9, match_count: 0 });

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
