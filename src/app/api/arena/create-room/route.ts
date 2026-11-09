import { NextRequest, NextResponse } from 'next/server';
import { ArenaPvPStore, ArenaRoom, viewRoomFor, selectPerfectQuestion } from '@/lib/services/arenaPvPStore';
import { requireCombatantFromRequest } from '@/lib/server/requireAuth';

const DIFFICULTIES = new Set(['basic', 'intermediate', 'advanced', 'production']);

export async function POST(req: NextRequest) {
  try {
    const auth = await requireCombatantFromRequest(req);
    if (auth.error) {
      console.warn('[CreateRoom API] Combatant auth failed');
      return auth.error;
    }

    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    const requestedProblemId = typeof body.problemId === 'string' ? body.problemId.trim() : '';

    const hostName = (typeof body.hostName === 'string' && body.hostName.trim()) || auth.user.displayName || 'Combatant';
    const limit = typeof body.timeLimitSeconds === 'number' ? Math.round(body.timeLimitSeconds) : 600;
    const deviceId = (typeof body.deviceId === 'string' && body.deviceId.trim()) || req.headers.get('x-combatant-device-id') || undefined;
    const language = typeof body.language === 'string' ? body.language : 'typescript';

    console.log(`[CreateRoom API] Request from host: ${auth.user.id} (${hostName}) | problemId: ${requestedProblemId || 'auto'} | lang: ${language}`);

    let chosenProblemId = requestedProblemId;
    let chosenDifficulty = DIFFICULTIES.has(String(body.difficulty)) ? (body.difficulty as ArenaRoom['difficulty']) : undefined;
    let chosenTimeLimit = Math.min(3600, Math.max(60, limit));

    // Dynamic question calibration if 'auto' or unspecified
    if (!chosenProblemId || chosenProblemId === 'auto') {
      const userQuests = (auth.user as Record<string, unknown>).completed_quests;
      const studentCompletedQuests = Array.isArray(body.completedQuests)
        ? (body.completedQuests as string[])
        : (Array.isArray(userQuests) ? (userQuests as string[]) : []);

      const studentRecent = Array.isArray(body.recentProblemIds)
        ? (body.recentProblemIds as string[])
        : [];

      const perfect = selectPerfectQuestion(
        {
          studentId: auth.user.id,
          difficulty: typeof body.difficulty === 'string' ? body.difficulty : undefined,
          preferredLanguage: language,
          completedQuests: studentCompletedQuests,
          recentProblemIds: studentRecent,
        },
        {
          studentId: auth.user.id,
          difficulty: typeof body.difficulty === 'string' ? body.difficulty : undefined,
          preferredLanguage: language,
          completedQuests: studentCompletedQuests,
          recentProblemIds: studentRecent,
        }
      );
      chosenProblemId = perfect.id;
      chosenDifficulty = perfect.difficulty;
      chosenTimeLimit = perfect.timeLimitSeconds || 600;
      console.log(`[CreateRoom API] Auto-calibrated question: ${chosenProblemId} (Tier: ${chosenDifficulty}) for host: ${auth.user.id}`);
    }

    const room = await ArenaPvPStore.createRoom({
      hostId: auth.user.id,
      hostName: hostName.slice(0, 60),
      hostAvatar: typeof body.hostAvatar === 'string' ? body.hostAvatar.slice(0, 500) : undefined,
      hostDeviceId: deviceId,
      hostLanguage: language,
      problemId: chosenProblemId,
      difficulty: chosenDifficulty,
      timeLimitSeconds: chosenTimeLimit,
    });

    console.log(`[CreateRoom API] Room successfully created: ${room.roomCode} | problemId: ${room.problemId} | host: ${room.hostId}`);

    return NextResponse.json({ success: true, room: viewRoomFor(room, auth.user.id) });
  } catch (err: unknown) {
    console.error('[CreateRoom API] Error:', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed to create room' }, { status: 500 });
  }
}
