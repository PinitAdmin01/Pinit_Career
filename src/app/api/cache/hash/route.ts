import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const key = url.searchParams.get('key') || '';

  return NextResponse.json({
    cached: false,
    key,
    exists: false,
    checkedAt: new Date().toISOString(),
  });
}
