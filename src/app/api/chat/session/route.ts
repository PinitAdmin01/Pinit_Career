import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    return NextResponse.json({
      sessionId,
      startedAt: new Date().toISOString(),
      teacherId: body?.teacherId || 'priya',
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to create chat session', message: err?.message }, { status: 400 });
  }
}
