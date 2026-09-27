import { NextRequest, NextResponse } from 'next/server';
import { ArenaPvPStore, viewRoomFor } from '@/lib/services/arenaPvPStore';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { codeWarsScore, judgeCodeWarsSubmission } from '@/lib/server/codeWarsJudge';

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
    const auth = await requireUserFromRequest(req);
    if (auth.error) return auth.error;
    const { roomCode } = await params;
    const room = await ArenaPvPStore.getRoom(roomCode);

    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, room: viewRoomFor(room, auth.user.id) });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Internal error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ roomCode: string }> }) {
  try {
    const auth = await requireUserFromRequest(req);
    if (auth.error) return auth.error;
    const playerId = auth.user.id;
    const { roomCode } = await params;
    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    const { action, testsPassed, totalTests, code, logs, language } = body;

    const current = await ArenaPvPStore.getRoom(roomCode);
    if (!current) {
      return NextResponse.json({ error: 'Room not found or update failed' }, { status: 404 });
    }
    if (current.hostId !== playerId && current.guestId !== playerId) {
      return NextResponse.json({ error: 'You are not a player in this room' }, { status: 403 });
    }

    // Judge a submission before touching the room (only while the match is running).
    let judged: { passed: boolean; testsPassed: number; totalTests: number; score: number } | null = null;
    if (action === 'submit_solution') {
      if (current.status !== 'in_progress') {
        return NextResponse.json({ error: 'The match is not running' }, { status: 409 });
      }
      const result = await judgeCodeWarsSubmission(current.problemId, code, language);
      if (!result.ok) return NextResponse.json({ error: result.message, code: result.error }, { status: 400 });
      const secondsSpent = current.startedAt ? (Date.now() - current.startedAt) / 1000 : current.timeLimitSeconds;
      judged = { ...result, score: codeWarsScore(result, secondsSpent, current.timeLimitSeconds) };
    }

    // Code stays private until the match ends.
    if ((action === 'update_progress' || action === 'submit_solution') && typeof code === 'string') {
      await ArenaPvPStore.saveCode(roomCode, playerId, code, typeof logs === 'string' ? logs : undefined, action === 'submit_solution');
    }

    const updated = await ArenaPvPStore.updateRoom(roomCode, (room) => {
      const isHost = room.hostId === playerId;
      const isGuest = room.guestId === playerId;

      if (!isHost && !isGuest) return null;

      if (action === 'toggle_ready') {
        if (isHost) room.hostReady = !room.hostReady;
        if (isGuest) room.guestReady = !room.guestReady;

        // Start battle if both are ready
        if (room.hostReady && room.guestReady && room.guestId) {
          room.status = 'in_progress';
          room.startedAt = Date.now();
        }
      } else if (action === 'start_game') {
        room.status = 'in_progress';
        room.startedAt = Date.now();
      } else if (action === 'update_progress') {
        // Live progress bar only (the score and the result come from the judged submission).
        const progress = isHost ? room.hostProgress : room.guestProgress;
        if (!progress.submitted) {
          if (typeof testsPassed === 'number') progress.testsPassed = testsPassed;
          if (typeof totalTests === 'number') progress.totalTests = totalTests;
        }
        progress.lastActiveAt = Date.now();
      } else if (action === 'submit_solution' && judged) {
        if (room.status !== 'in_progress') return null;
        const progress = isHost ? room.hostProgress : room.guestProgress;
        progress.submitted = true;
        progress.testsPassed = judged.testsPassed;
        progress.totalTests = judged.totalTests;
        progress.score = judged.score;
        progress.lastActiveAt = Date.now();

        // First to pass every test (as judged by the server) wins.
        if (judged.passed) {
          room.status = 'completed';
          room.winnerId = playerId;
          room.endedAt = Date.now();
        } else if (room.hostProgress.submitted && room.guestProgress.submitted) {
          // If both submitted, determine winner by score
          room.status = 'completed';
          room.endedAt = Date.now();
          if (room.hostProgress.score > room.guestProgress.score) {
            room.winnerId = room.hostId;
          } else if (room.guestProgress.score > room.hostProgress.score) {
            room.winnerId = room.guestId;
          } else {
            room.winnerId = 'draw';
          }
        }
      } else if (action === 'forfeit') {
        room.status = 'completed';
        room.winnerId = isHost ? room.guestId : room.hostId;
        room.endedAt = Date.now();
      } else {
        return null;
      }

      return room;
    });

    const latest = updated ? await ArenaPvPStore.publishCodesIfCompleted(updated) : await ArenaPvPStore.getRoom(roomCode);
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
