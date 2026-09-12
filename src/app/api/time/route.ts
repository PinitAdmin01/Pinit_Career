import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const now = Date.now();
  return NextResponse.json(
    {
      epochMs: now,
      iso: new Date(now).toISOString(),
    },
    {
      status: 200,
      headers: {
        'x-server-time': now.toString(),
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    }
  );
}

export async function OPTIONS() {
  const now = Date.now();
  return new NextResponse(null, {
    status: 204,
    headers: {
      'x-server-time': now.toString(),
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  });
}
