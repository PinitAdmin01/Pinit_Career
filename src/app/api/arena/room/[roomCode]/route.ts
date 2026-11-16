import { NextRequest, NextResponse } from 'next/server';
import { ArenaPvPStore, viewRoomFor } from '@/lib/services/arenaPvPStore';
import type { ArenaRoom } from '@/lib/services/arenaPvPStore';
import { requireCombatantFromRequest } from '@/lib/server/requireAuth';
import { codeWarsScore, judgeCodeWarsSubmission } from '@/lib/server/codeWarsJudge';
import { createCombatEvent, resolveMatchWinner } from '@/lib/arena/codeWarRules';

function getRoomDeadline(room: ArenaRoom): number | null {
  if (room.status !== 'in_progress' || !Number.isFinite(room.startedAt) || !room.startedAt) return null;
  const timeLimitSeconds = Number(room.timeLimitSeconds);
  const durationMs = (Number.isFinite(timeLimitSeconds) && timeLimitSeconds > 0 ? timeLimitSeconds : 600) * 1000;
  return room.startedAt + durationMs;
}

function hasRoomExpired(room: ArenaRoom, at: number): boolean {
  const deadline = getRoomDeadline(room);
  return deadline !== null && at >= deadline;
}

function combatantSide(room: ArenaRoom, playerId: string, deviceId: string): { isHost: boolean; isGuest: boolean } {
  const accountIsHost = room.hostId === playerId;
  const accountIsGuest = room.guestId === playerId;
  const matchesHostDevice = accountIsHost && Boolean(deviceId && room.hostDeviceId === deviceId);
  const matchesGuestDevice = accountIsGuest && Boolean(deviceId && room.guestDeviceId === deviceId);
  if (matchesHostDevice) return { isHost: true, isGuest: false };
  if (matchesGuestDevice) return { isHost: false, isGuest: true };

  const isHost = accountIsHost;
  const isGuest = accountIsGuest;
  if (isHost && isGuest) return { isHost: true, isGuest: false };
  return { isHost, isGuest };
}

/** Finish an expired match using only final submissions judged by the server. */
async function finishExpiredRoom(roomCode: string, at: number): Promise<ArenaRoom | null> {
  return ArenaPvPStore.updateRoom(roomCode, (room) => {
    const deadline = getRoomDeadline(room);
    if (deadline === null || at < deadline) return null;

    room.endedAt = deadline;
    if (!room.guestId) {
      room.status = 'cancelled';
      room.winnerId = undefined;
      room.tieBreakerReason = 'The battle was cancelled because no opponent joined.';
      return room;
    }

    room.status = 'completed';
    const hostSubmitted = room.hostProgress.submitted;
    const guestSubmitted = room.guestProgress.submitted;

    if (hostSubmitted !== guestSubmitted) {
      const submittedProgress = hostSubmitted ? room.hostProgress : room.guestProgress;
      if (submittedProgress.testsPassed > 0) {
        room.winnerId = hostSubmitted ? room.hostId : room.guestId;
        room.tieBreakerReason = `Time expired. ${hostSubmitted ? room.hostName : (room.guestName || 'Challenger')} passed ${submittedProgress.testsPassed} tests; the opponent did not submit a final solution.`;
      } else {
        room.winnerId = 'draw';
        room.tieBreakerReason = 'Time expired. No final submission passed a test, so the match is a draw.';
      }
      return room;
    }

    if (!hostSubmitted && !guestSubmitted) {
      room.winnerId = 'draw';
      room.tieBreakerReason = 'Time expired with no final submissions. The match is a draw.';
      return room;
    }

    const elapsedSeconds = (progress: ArenaRoom['hostProgress']) =>
      progress.lastActiveAt && room.startedAt
        ? Math.max(0, Math.round((progress.lastActiveAt - room.startedAt) / 1000))
        : room.timeLimitSeconds;
    const resolution = resolveMatchWinner({
      hostId: room.hostId,
      guestId: room.guestId,
      hostStats: {
        testsPassed: room.hostProgress.testsPassed,
        totalTests: room.hostProgress.totalTests,
        score: room.hostProgress.score,
        submitted: room.hostProgress.submitted,
        submissionAttempts: room.hostProgress.submissionAttempts || 0,
        failedAttempts: room.hostProgress.failedAttempts || 0,
        timeSpentSeconds: elapsedSeconds(room.hostProgress),
        timeRemainingSeconds: 0,
      },
      guestStats: {
        testsPassed: room.guestProgress.testsPassed,
        totalTests: room.guestProgress.totalTests,
        score: room.guestProgress.score,
        submitted: room.guestProgress.submitted,
        submissionAttempts: room.guestProgress.submissionAttempts || 0,
        failedAttempts: room.guestProgress.failedAttempts || 0,
        timeSpentSeconds: elapsedSeconds(room.guestProgress),
        timeRemainingSeconds: 0,
      },
      firstBloodClaimedBy: room.firstBloodClaimedBy,
    });
    room.winnerId = resolution.winnerId;
    room.tieBreakerReason = `Time expired. ${resolution.winReason}`;
    return room;
  });
}

async function settleCompletedRoom(room: ArenaRoom): Promise<ArenaRoom> {
  if (room.status !== 'completed' || !room.winnerId || room.eloApplied) return room;
  const settled = await ArenaPvPStore.settleMatch(room);
  if (!settled.eloApplied && process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('ARENA_SETTLEMENT_PENDING');
  }
  return settled;
}

/**
 * Arena battle room. The player is always the logged-in user (the request body's playerId is
 * ignored), and a player never receives the opponent's code before the match is over.
 * Code typed during the match is kept server-side (arena_room_submissions), not in the room row
 * that both players receive through live updates.
 * A submission is judged here, on the server: the pass, score and winner come from running the
 * submitted code, never from what the browser reports.
 */

export async function GET(req: NextRequest, { params }: { params: Promise<{ roomCode: string }> }) {
  try {
    const auth = await requireCombatantFromRequest(req);
    if (auth.error) {
      console.warn('[ArenaRoom GET] Combatant auth failed');
      return auth.error;
    }
    const { roomCode } = await params;
    console.log(`[ArenaRoom GET] Room lookup: ${roomCode} from viewer: ${auth.user.id}`);
    let room = await ArenaPvPStore.getRoom(roomCode);

    if (!room) {
      console.warn(`[ArenaRoom GET] Room not found: ${roomCode}`);
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    const now = Date.now();
    if (hasRoomExpired(room, now)) {
      room = await finishExpiredRoom(roomCode, now) || await ArenaPvPStore.getRoom(roomCode) || room;
    }

    try {
      room = await settleCompletedRoom(room);
    } catch (err) {
      if (err instanceof Error && err.message === 'ARENA_SETTLEMENT_PENDING') {
        return NextResponse.json({ error: 'ARENA_SETTLEMENT_PENDING' }, { status: 503 });
      }
      throw err;
    }

    return NextResponse.json({ success: true, room: viewRoomFor(room, auth.user.id) });
  } catch (err: unknown) {
    console.error('[ArenaRoom GET] Error:', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Internal error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ roomCode: string }> }) {
  const requestReceivedAt = Date.now();
  try {
    const auth = await requireCombatantFromRequest(req);
    if (auth.error) {
      console.warn('[ArenaRoom POST] Combatant auth failed');
      return auth.error;
    }
    const playerId = auth.user.id;
    const { roomCode } = await params;
    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    const { action, testsPassed, totalTests, score, code, logs, language } = body;

    console.log(`[ArenaRoom POST] Action: ${action} on room: ${roomCode} by player: ${playerId}`);

    const current = await ArenaPvPStore.getRoom(roomCode);
    if (!current) {
      console.warn(`[ArenaRoom POST] Room ${roomCode} not found`);
      return NextResponse.json({ error: 'Room not found or update failed' }, { status: 404 });
    }
    const deviceId = req.headers.get('x-combatant-device-id') || '';
    const { isHost, isGuest } = combatantSide(current, playerId, deviceId);
    if (!isHost && !isGuest) {
      console.warn(`[ArenaRoom POST] Player ${playerId} is neither host nor guest in ${roomCode}`);
      return NextResponse.json({ error: 'You are not a player in this room' }, { status: 403 });
    }

    if (action === 'toggle_ready' && (current.status !== 'waiting' || !current.guestId)) {
      return NextResponse.json({ error: 'ROOM_NOT_WAITING_FOR_READY' }, { status: 409 });
    }
    if (action === 'start_game' && (
      current.status !== 'waiting' || !current.guestId || !current.hostReady || !current.guestReady
    )) {
      return NextResponse.json({ error: 'BOTH_PLAYERS_NOT_READY' }, { status: 409 });
    }

    // The server clock decides the deadline. A late submit, timeout callback, or progress update
    // first closes the room and then returns its authoritative final state.
    if (hasRoomExpired(current, requestReceivedAt)) {
      let expired = await finishExpiredRoom(roomCode, requestReceivedAt);
      expired = expired || await ArenaPvPStore.getRoom(roomCode);
      if (!expired) return NextResponse.json({ error: 'Room not found or update failed' }, { status: 404 });
      try {
        expired = await settleCompletedRoom(expired);
      } catch (err) {
        if (err instanceof Error && err.message === 'ARENA_SETTLEMENT_PENDING') {
          return NextResponse.json({ error: 'ARENA_SETTLEMENT_PENDING' }, { status: 503 });
        }
        throw err;
      }
      const latestExpired = await ArenaPvPStore.publishCodesIfCompleted(expired);
      return NextResponse.json({ success: true, expired: true, room: viewRoomFor(latestExpired, playerId) });
    }

    // Judge a submission before touching the room (only while the match is running).
    let judged: { passed: boolean; testsPassed: number; totalTests: number; score: number } | null = null;
    if (action === 'submit_solution') {
      if (current.status !== 'in_progress') {
        console.warn(`[ArenaRoom POST] Cannot submit: match in status '${current.status}' is not in_progress`);
        return NextResponse.json({ error: 'The match is not running' }, { status: 409 });
      }
      const evalLanguage = (typeof language === 'string' && language.trim())
        ? language.trim()
        : (isHost ? (current.hostLanguage || 'typescript') : (current.guestLanguage || 'typescript'));
      console.log(`[ArenaRoom POST] Judging solution for room: ${roomCode} | player: ${playerId} | problem: ${current.problemId} | lang: ${evalLanguage}`);
      const result = await judgeCodeWarsSubmission(current.problemId, code, evalLanguage);
      if (!result.ok) {
        console.warn(`[ArenaRoom POST] Judge evaluation failed: ${result.error} - ${result.message}`);
        return NextResponse.json({ error: result.message, code: result.error }, { status: 400 });
      }
      const secondsSpent = current.startedAt ? (Date.now() - current.startedAt) / 1000 : current.timeLimitSeconds;
      judged = { ...result, score: codeWarsScore(result, secondsSpent, current.timeLimitSeconds) };
      console.log(`[ArenaRoom POST] Judge evaluated -> passed: ${judged.passed} | testsPassed: ${judged.testsPassed}/${judged.totalTests} | score: ${judged.score}`);
    }

    // Code stays private until the match ends.
    if ((action === 'update_progress' || action === 'submit_solution') && typeof code === 'string') {
      await ArenaPvPStore.saveCode(roomCode, playerId, code, typeof logs === 'string' ? logs : undefined, action === 'submit_solution');
    }

    const updated = await ArenaPvPStore.updateRoom(roomCode, (room) => {
      const { isHost, isGuest } = combatantSide(room, playerId, deviceId);

      if (!isHost && !isGuest) return null;
      if (requestReceivedAt >= (getRoomDeadline(room) ?? Number.POSITIVE_INFINITY)) return null;

      if (action === 'toggle_ready') {
        if (room.status !== 'waiting' || !room.guestId) return null;
        if (isHost) room.hostReady = !room.hostReady;
        if (isGuest) room.guestReady = !room.guestReady;

        // Start battle if both are ready
        if (room.hostReady && room.guestReady && room.guestId) {
          room.status = 'in_progress';
          room.startedAt = Date.now();
        }
      } else if (action === 'cancel_room') {
        if (!isHost || room.status !== 'waiting' || room.guestId) return null;
        room.status = 'cancelled';
        room.endedAt = Date.now();
        room.tieBreakerReason = 'The room creator cancelled before an opponent joined.';
      } else if (action === 'start_game') {
        if (room.status !== 'waiting' || !room.guestId || !room.hostReady || !room.guestReady) return null;
        room.status = 'in_progress';
        room.startedAt = Date.now();
      } else if (action === 'update_progress') {
        // Live progress bar and combat ticker telemetry
        const progress = isHost ? room.hostProgress : room.guestProgress;
        const actorName = isHost ? room.hostName : (room.guestName || 'Challenger');
        if (!progress.submitted) {
          if (typeof testsPassed === 'number') {
            const previousPassed = progress.testsPassed || 0;
            progress.testsPassed = testsPassed;
            if (testsPassed > previousPassed) {
              const evt = createCombatEvent('test_passed', {
                actorName,
                actorId: playerId,
                testIndex: testsPassed,
                testTotal: typeof totalTests === 'number' ? totalTests : progress.totalTests,
              });
              room.events = [evt, ...(room.events || [])].slice(0, 10);
            }
          }
          if (typeof totalTests === 'number') progress.totalTests = totalTests;
          if (typeof score === 'number') progress.score = score;
        }
        progress.lastRunTimestamp = Date.now();
        progress.lastActiveAt = Date.now();
      } else if (action === 'submit_solution' && judged) {
        if (room.status !== 'in_progress') return null;
        const progress = isHost ? room.hostProgress : room.guestProgress;
        const actorName = isHost ? room.hostName : (room.guestName || 'Challenger');
        progress.submissionAttempts = (progress.submissionAttempts || 0) + 1;
        progress.submitted = true;
        progress.testsPassed = judged.testsPassed;
        progress.totalTests = judged.totalTests;
        progress.score = judged.score;
        progress.lastActiveAt = Date.now();

        if (!judged.passed) {
          progress.failedAttempts = (progress.failedAttempts || 0) + 1;
          const failEvt = createCombatEvent('test_failed', {
            actorName,
            actorId: playerId,
            extra: `${judged.testsPassed}/${judged.totalTests} tests passed`,
          });
          room.events = [failEvt, ...(room.events || [])].slice(0, 10);
        }

        // First to pass every test (as judged by the server) wins with First Blood!
        if (judged.passed) {
          console.log(`[ArenaRoom POST] VICTORY in ${roomCode}! Winner: ${playerId} (${actorName}) claimed First Blood`);
          room.status = 'completed';
          room.winnerId = playerId;
          room.endedAt = Date.now();
          if (!room.firstBloodClaimedBy) {
            room.firstBloodClaimedBy = playerId;
            room.firstBloodClaimedAt = Date.now();
          }
          if (progress.submissionAttempts === 1 && (progress.failedAttempts || 0) === 0) {
            room.cleanBonusAwardedTo = playerId;
          }
          room.tieBreakerReason = 'First Blood! Conquered all test cases before opponent.';
          const fbEvt = createCombatEvent('first_blood', {
            actorName,
            actorId: playerId,
            testTotal: judged.totalTests,
          });
          room.events = [fbEvt, ...(room.events || [])].slice(0, 10);
        } else if (room.hostProgress.submitted && room.guestProgress.submitted) {
          // If both submitted, resolve winner using official Tie-Breaker Protocol
          room.status = 'completed';
          room.endedAt = Date.now();
          const resolution = resolveMatchWinner({
            hostId: room.hostId,
            guestId: room.guestId || 'guest',
            hostStats: {
              testsPassed: room.hostProgress.testsPassed,
              totalTests: room.hostProgress.totalTests,
              score: room.hostProgress.score,
              submitted: room.hostProgress.submitted,
              submissionAttempts: room.hostProgress.submissionAttempts || 1,
              failedAttempts: room.hostProgress.failedAttempts || 0,
              timeSpentSeconds: Math.max(0, Math.round(((room.endedAt || Date.now()) - (room.startedAt || Date.now())) / 1000)),
              timeRemainingSeconds: 0,
            },
            guestStats: {
              testsPassed: room.guestProgress.testsPassed,
              totalTests: room.guestProgress.totalTests,
              score: room.guestProgress.score,
              submitted: room.guestProgress.submitted,
              submissionAttempts: room.guestProgress.submissionAttempts || 1,
              failedAttempts: room.guestProgress.failedAttempts || 0,
              timeSpentSeconds: Math.max(0, Math.round(((room.endedAt || Date.now()) - (room.startedAt || Date.now())) / 1000)),
              timeRemainingSeconds: 0,
            },
            firstBloodClaimedBy: room.firstBloodClaimedBy,
          });

          console.log(`[ArenaRoom POST] Both players submitted in ${roomCode}. Tie-breaker winner: ${resolution.winnerId} (${resolution.winReason})`);
          room.winnerId = resolution.winnerId;
          room.tieBreakerReason = resolution.winReason;
        }
      } else if (action === 'forfeit') {
        console.log(`[ArenaRoom POST] Forfeit in ${roomCode} by ${playerId}`);
        room.status = 'completed';
        room.winnerId = isHost ? room.guestId : room.hostId;
        room.endedAt = Date.now();
      } else {
        return null;
      }

      return room;
    });

    let settled = updated;
    if (settled) {
      try {
        settled = await settleCompletedRoom(settled);
      } catch (err) {
        if (err instanceof Error && err.message === 'ARENA_SETTLEMENT_PENDING') {
          return NextResponse.json({ error: 'ARENA_SETTLEMENT_PENDING' }, { status: 503 });
        }
        throw err;
      }
    }
    const latest = settled ? await ArenaPvPStore.publishCodesIfCompleted(settled) : await ArenaPvPStore.getRoom(roomCode);
    if (!latest) {
      return NextResponse.json({ error: 'Room not found or update failed' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      room: viewRoomFor(latest, playerId),
      ...(judged ? { result: { passed: judged.passed, testsPassed: judged.testsPassed, totalTests: judged.totalTests, score: judged.score } } : {}),
    });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Internal error' }, { status: 500 });
  }
}
