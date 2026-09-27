import { NextRequest, NextResponse } from 'next/server';
import { ArenaPvPStore, viewRoomFor } from '@/lib/services/arenaPvPStore';
import { requireUserFromRequest } from '@/lib/server/requireAuth';

export async function POST(req: NextRequest) {
  try {
    const auth = await requireUserFromRequest(req);
    if (auth.error) return auth.error;

    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    const roomCode = typeof body.roomCode === 'string' ? body.roomCode.trim() : '';
    if (!roomCode) {
      return NextResponse.json({ error: 'Missing required fields (roomCode)' }, { status: 400 });
    }

    const guestName = (typeof body.guestName === 'string' && body.guestName.trim()) || auth.user.displayName || 'Combatant';

    // The guest is the logged-in user; a guestId in the body is ignored.
    const result = await ArenaPvPStore.joinRoom({
      roomCode,
      guestId: auth.user.id,
      guestName: guestName.slice(0, 60),
      guestAvatar: typeof body.guestAvatar === 'string' ? body.guestAvatar.slice(0, 500) : undefined,
    });

    if (!result.success || !result.room) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, room: viewRoomFor(result.room, auth.user.id) });
  } catch (err: unknown) {
    console.error('[JoinRoom API] Error:', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed to join room' }, { status: 500 });
  }
}
