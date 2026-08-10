import { NextResponse } from 'next/server';
import { appendFileSync } from 'fs';
import { join } from 'path';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const line = JSON.stringify({
      ...body,
      sessionId: body.sessionId || 'ea5c88',
      timestamp: body.timestamp || Date.now(),
    });
    appendFileSync(join(process.cwd(), 'debug-ea5c88.log'), line + '\n');
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'write failed' }, { status: 500 });
  }
}
