import { NextRequest, NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { checkRateLimit, getClientIp } from '@/lib/server/rateLimit';

/**
 * POST /api/code/run-cpp
 * Fail-closed C++ judge proxy. Forwards to isolated CPP_JUDGE_URL when configured;
 * never falls back to regex/AST fake passes when no C++ compiler service exists.
 */
export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rl = checkRateLimit(`cpprun_${ip}`, { limit: 15, windowMs: 60_000 });
    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'RATE_LIMIT', message: 'Too many execution requests. Wait a moment.' },
        { status: 429, headers: { 'Retry-After': String(rl.resetSec) } }
      );
    }

    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;

    const judgeUrl = process.env.CPP_JUDGE_URL;
    if (!judgeUrl) {
      return NextResponse.json(
        {
          allPassed: false,
          error: 'CPP_JUDGE_UNAVAILABLE',
          message: 'C++ compiler judge is not configured in this environment. Cannot execute native C++ assertions.',
        },
        { status: 503 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const upstream = await fetch(judgeUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!upstream.ok) {
      return NextResponse.json(
        { allPassed: false, error: 'CPP_JUDGE_ERROR', message: `Upstream C++ judge returned HTTP ${upstream.status}.` },
        { status: 502 }
      );
    }

    const data = await upstream.json();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(
      { allPassed: false, error: err?.message || 'C++ judge failure' },
      { status: 500 }
    );
  }
}
