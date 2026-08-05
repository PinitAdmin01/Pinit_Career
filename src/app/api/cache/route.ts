import { NextRequest, NextResponse } from 'next/server';

/**
 * PinIT Cache API — Next.js proxy to FastAPI cache endpoints.
 *
 * GET /api/cache?action=hash&key={sha256}  → Cache key lookup
 * GET /api/cache?action=stats              → Cache statistics
 * POST /api/cache?action=gc               → Run garbage collector
 */

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action') ?? 'stats';
  const key    = searchParams.get('key') ?? '';

  try {
    let backendPath = '/api/cache/stats';
    if (action === 'hash' && key) {
      backendPath = `/api/cache/hash?key=${encodeURIComponent(key)}`;
    }

    const res = await fetch(`${BACKEND_URL}${backendPath}`, {
      signal: AbortSignal.timeout(5000),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Cache lookup failed' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action') ?? 'gc';

  if (action === 'gc') {
    try {
      const res = await fetch(`${BACKEND_URL}/api/cache/gc`, {
        method: 'POST',
        signal: AbortSignal.timeout(30000), // GC can take a moment
      });
      const data = await res.json();
      return NextResponse.json(data, { status: res.status });
    } catch (err: any) {
      return NextResponse.json({ error: err.message || 'GC failed' }, { status: 500 });
    }
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
}
