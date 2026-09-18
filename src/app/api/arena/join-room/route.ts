import { NextRequest, NextResponse } from 'next/server';
import { ArenaPvPStore } from '@/lib/services/arenaPvPStore';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { roomCode, guestId, guestName, guestAvatar } = body;

    if (!roomCode || !guestId || !guestName) {
      return NextResponse.json({ error: 'Missing required fields (roomCode, guestId, guestName)' }, { status: 400 });
    }

    const result = await ArenaPvPStore.joinRoom({
      roomCode,
      guestId,
      guestName,
      guestAvatar,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, room: result.room });
  } catch (err: any) {
    console.error('[JoinRoom API] Error:', err);
    return NextResponse.json({ error: err.message || 'Failed to join room' }, { status: 500 });
  }
}
