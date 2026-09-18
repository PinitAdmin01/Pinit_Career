import { NextRequest, NextResponse } from 'next/server';
import { ArenaPvPStore } from '@/lib/services/arenaPvPStore';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, studentId, studentName, studentAvatar, difficulty, eloRating, defaultProblemId } = body;

    if (!studentId) {
      return NextResponse.json({ error: 'Missing studentId' }, { status: 400 });
    }

    if (action === 'cancel') {
      ArenaPvPStore.cancelQueue(studentId);
      return NextResponse.json({ success: true, cancelled: true });
    }

    const result = await ArenaPvPStore.matchmake({
      studentId,
      studentName: studentName || 'Combatant',
      studentAvatar,
      difficulty: difficulty || 'any',
      eloRating: eloRating || 1200,
      enqueuedAt: Date.now(),
    }, defaultProblemId || 'war_tree_lca_01');

    return NextResponse.json({ success: true, ...result });
  } catch (err: any) {
    console.error('[Matchmake API] Error:', err);
    return NextResponse.json({ error: err.message || 'Matchmaking error' }, { status: 500 });
  }
}
