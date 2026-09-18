import { NextRequest, NextResponse } from 'next/server';
import { ArenaPvPStore } from '@/lib/services/arenaPvPStore';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { hostId, hostName, hostAvatar, problemId, difficulty, timeLimitSeconds } = body;

    if (!hostId || !hostName || !problemId) {
      return NextResponse.json({ error: 'Missing required fields (hostId, hostName, problemId)' }, { status: 400 });
    }

    const room = await ArenaPvPStore.createRoom({
      hostId,
      hostName,
      hostAvatar,
      problemId,
      difficulty,
      timeLimitSeconds,
    });

    return NextResponse.json({ success: true, room });
  } catch (err: any) {
    console.error('[CreateRoom API] Error:', err);
    return NextResponse.json({ error: err.message || 'Failed to create room' }, { status: 500 });
  }
}
