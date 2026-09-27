import { NextRequest, NextResponse } from 'next/server';
import { ArenaPvPStore, ArenaRoom, viewRoomFor } from '@/lib/services/arenaPvPStore';
import { requireUserFromRequest } from '@/lib/server/requireAuth';

const DIFFICULTIES = new Set(['basic', 'intermediate', 'advanced', 'production']);

export async function POST(req: NextRequest) {
  try {
    const auth = await requireUserFromRequest(req);
    if (auth.error) return auth.error;

    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    const problemId = typeof body.problemId === 'string' ? body.problemId.trim() : '';
    if (!problemId) {
      return NextResponse.json({ error: 'Missing required fields (problemId)' }, { status: 400 });
    }

    const hostName = (typeof body.hostName === 'string' && body.hostName.trim()) || auth.user.displayName || 'Combatant';
    const limit = typeof body.timeLimitSeconds === 'number' ? Math.round(body.timeLimitSeconds) : 600;

    // The host is the logged-in user; a hostId in the body is ignored.
    const room = await ArenaPvPStore.createRoom({
      hostId: auth.user.id,
      hostName: hostName.slice(0, 60),
      hostAvatar: typeof body.hostAvatar === 'string' ? body.hostAvatar.slice(0, 500) : undefined,
      problemId,
      difficulty: DIFFICULTIES.has(String(body.difficulty)) ? (body.difficulty as ArenaRoom['difficulty']) : undefined,
      timeLimitSeconds: Math.min(3600, Math.max(60, limit)),
    });

    return NextResponse.json({ success: true, room: viewRoomFor(room, auth.user.id) });
  } catch (err: unknown) {
    console.error('[CreateRoom API] Error:', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed to create room' }, { status: 500 });
  }
}
