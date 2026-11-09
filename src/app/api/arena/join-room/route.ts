import { NextRequest, NextResponse } from 'next/server';
import { ArenaPvPStore, viewRoomFor } from '@/lib/services/arenaPvPStore';
import { requireCombatantFromRequest } from '@/lib/server/requireAuth';

export async function POST(req: NextRequest) {
  try {
    const auth = await requireCombatantFromRequest(req);
    if (auth.error) {
      console.warn('[JoinRoom API] Combatant auth failed');
      return auth.error;
    }

    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    const roomCode = typeof body.roomCode === 'string' ? body.roomCode.trim() : '';
    if (!roomCode) {
      console.warn('[JoinRoom API] Missing roomCode');
      return NextResponse.json({ error: 'Missing required fields (roomCode)' }, { status: 400 });
    }

    const guestName = (typeof body.guestName === 'string' && body.guestName.trim()) || auth.user.displayName || 'Combatant';
    const deviceId = (typeof body.deviceId === 'string' && body.deviceId.trim()) || req.headers.get('x-combatant-device-id') || undefined;
    const language = typeof body.language === 'string' ? body.language : 'typescript';

    console.log(`[JoinRoom API] Incoming join request: ${roomCode} from guest: ${auth.user.id} (${guestName}) | lang: ${language} | device: ${deviceId || 'none'}`);

    // The guest is the combatant user, with device isolation for 2-device pairing
    const result = await ArenaPvPStore.joinRoom({
      roomCode,
      guestId: auth.user.id,
      guestName: guestName.slice(0, 60),
      guestAvatar: typeof body.guestAvatar === 'string' ? body.guestAvatar.slice(0, 500) : undefined,
      guestDeviceId: deviceId,
      guestLanguage: language,
    });

    if (!result.success || !result.room) {
      console.warn(`[JoinRoom API] Failed to join room ${roomCode}: ${result.error}`);
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    console.log(`[JoinRoom API] Successfully joined room: ${result.room.roomCode} | status: ${result.room.status} | host: ${result.room.hostId} | guest: ${result.room.guestId}`);

    return NextResponse.json({ success: true, room: viewRoomFor(result.room, auth.user.id) });
  } catch (err: unknown) {
    console.error('[JoinRoom API] Error:', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed to join room' }, { status: 500 });
  }
}
