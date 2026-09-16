import { NextRequest, NextResponse } from 'next/server';
import { ArenaPvPStore } from '@/lib/services/arenaPvPStore';

export async function GET(req: NextRequest, { params }: { params: Promise<{ roomCode: string }> }) {
  try {
    const { roomCode } = await params;
    const room = await ArenaPvPStore.getRoom(roomCode);

    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, room });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ roomCode: string }> }) {
  try {
    const { roomCode } = await params;
    const body = await req.json();
    const { action, playerId, testsPassed, totalTests, score, code, logs, passed } = body;

    const updated = await ArenaPvPStore.updateRoom(roomCode, (room) => {
      const isHost = room.hostId === playerId;
      const isGuest = room.guestId === playerId;

      if (!isHost && !isGuest) return room;

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
        const progress = isHost ? room.hostProgress : room.guestProgress;
        if (typeof testsPassed === 'number') progress.testsPassed = testsPassed;
        if (typeof totalTests === 'number') progress.totalTests = totalTests;
        if (typeof score === 'number') progress.score = score;
        if (typeof code === 'string') progress.code = code;
        if (typeof logs === 'string') progress.logs = logs;
        progress.lastActiveAt = Date.now();
      } else if (action === 'submit_solution') {
        const progress = isHost ? room.hostProgress : room.guestProgress;
        progress.submitted = true;
        progress.testsPassed = testsPassed || progress.testsPassed;
        progress.totalTests = totalTests || progress.totalTests;
        progress.score = score || progress.score;
        progress.code = code || progress.code;
        progress.lastActiveAt = Date.now();

        // If passed all tests, they win!
        if (passed) {
          room.status = 'completed';
          room.winnerId = playerId;
          room.endedAt = Date.now();
        } else {
          // If both submitted, determine winner by score
          if (room.hostProgress.submitted && room.guestProgress.submitted) {
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
        }
      } else if (action === 'forfeit') {
        room.status = 'completed';
        room.winnerId = isHost ? room.guestId : room.hostId;
        room.endedAt = Date.now();
      }

      return room;
    });

    if (!updated) {
      return NextResponse.json({ error: 'Room not found or update failed' }, { status: 404 });
    }

    return NextResponse.json({ success: true, room: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}
