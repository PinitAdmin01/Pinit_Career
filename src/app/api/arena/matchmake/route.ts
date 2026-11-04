import { NextRequest, NextResponse } from 'next/server';
import { ArenaPvPStore, viewRoomFor } from '@/lib/services/arenaPvPStore';
import { requireCombatantFromRequest } from '@/lib/server/requireAuth';

export async function POST(req: NextRequest) {
  try {
    const auth = await requireCombatantFromRequest(req);
    if (auth.error) return auth.error;

    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    const { action, studentAvatar, difficulty, eloRating, defaultProblemId, knowledgeScore, preferredLanguage } = body;
    const deviceId = (typeof body.deviceId === 'string' && body.deviceId.trim()) || req.headers.get('x-combatant-device-id') || undefined;
    const queueStudentId = deviceId ? `${auth.user.id}_${deviceId.slice(0, 8)}` : auth.user.id;

    if (action === 'cancel') {
      await ArenaPvPStore.cancelQueue(queueStudentId);
      return NextResponse.json({ success: true, cancelled: true });
    }

    const studentName = (typeof body.studentName === 'string' && body.studentName.trim()) || auth.user.displayName || 'Combatant';
    const result = await ArenaPvPStore.matchmake({
      studentId: queueStudentId,
      studentName: studentName.slice(0, 60),
      studentAvatar: typeof studentAvatar === 'string' ? studentAvatar.slice(0, 500) : undefined,
      difficulty: typeof difficulty === 'string' && difficulty ? difficulty : 'any',
      eloRating: typeof eloRating === 'number' ? eloRating : 1200,
      enqueuedAt: Date.now(),
      deviceId,
      preferredLanguage: typeof preferredLanguage === 'string' ? preferredLanguage : 'typescript',
      knowledgeScore: typeof knowledgeScore === 'number' ? knowledgeScore : 50,
    }, typeof defaultProblemId === 'string' && defaultProblemId ? defaultProblemId : 'war_two_sum_01');

    return NextResponse.json({
      success: true,
      matched: result.matched,
      ...(result.room ? { room: viewRoomFor(result.room, auth.user.id) } : {}),
    });
  } catch (err: unknown) {
    console.error('[Matchmake API] Error:', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Matchmaking error' }, { status: 500 });
  }
}
