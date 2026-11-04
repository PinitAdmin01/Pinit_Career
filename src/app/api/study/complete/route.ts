import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    return NextResponse.json({
      success: true,
      completedAt: new Date().toISOString(),
      lessonId: body?.lessonId || 'unknown',
      xpAwarded: 20,
      pinsAwarded: 5,
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to record study completion', message: err?.message }, { status: 400 });
  }
}
