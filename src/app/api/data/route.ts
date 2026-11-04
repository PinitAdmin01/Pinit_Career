import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  return NextResponse.json({ status: 'ok', data: [1, 2, 3, 4, 5], timestamp: Date.now() });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  return NextResponse.json({ success: true, received: body });
}
