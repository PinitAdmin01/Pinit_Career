import { NextRequest, NextResponse } from 'next/server';
import { ArenaPvPStore, viewRoomFor } from '@/lib/services/arenaPvPStore';
import { requireUserFromRequest } from '@/lib/server/requireAuth';

export async function POST(req: NextRequest) {
  try {
    const auth = await requireUserFromRequest(req);
    if (auth.error) return auth.error;
    const studentId = auth.user.id; // a studentId in the body is ignored

    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    const { action, studentAvatar, difficulty, eloRating, defaultProblemId } = body;

    if (action === 'cancel') {
      await ArenaPvPStore.cancelQueue(studentId);
      return NextResponse.json({ success: true, cancelled: true });
    }

    const studentName = (typeof body.studentName === 'string' && body.studentName.trim()) || auth.user.displayName || 'Combatant';
    const result = await ArenaPvPStore.matchmake({
      studentId,
      studentName: studentName.slice(0, 60),
      studentAvatar: typeof studentAvatar === 'string' ? studentAvatar.slice(0, 500) : undefined,
      difficulty: typeof difficulty === 'string' && difficulty ? difficulty : 'any',
      eloRating: typeof eloRating === 'number' ? eloRating : 1200,
      enqueuedAt: Date.now(),
    }, typeof defaultProblemId === 'string' && defaultProblemId ? defaultProblemId : 'war_tree_lca_01');

    return NextResponse.json({
      success: true,
      matched: result.matched,
      ...(result.room ? { room: viewRoomFor(result.room, studentId) } : {}),
    });
  } catch (err: unknown) {
    console.error('[Matchmake API] Error:', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Matchmaking error' }, { status: 500 });
  }
}
