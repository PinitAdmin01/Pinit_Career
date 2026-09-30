import { NextRequest, NextResponse } from 'next/server';
import { matchPendingTeams } from '@/lib/internships/teams';

export async function GET(req: NextRequest) {
  return handleMatching(req);
}

export async function POST(req: NextRequest) {
  return handleMatching(req);
}

async function handleMatching(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    // Fail-closed authorization: strictly require valid CRON_SECRET
    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { ok: false, error: 'UNAUTHORIZED', message: 'Cron secret required' },
        { status: 401 }
      );
    }

    const summary = await matchPendingTeams();

    return NextResponse.json({
      ok: true,
      timestamp: new Date().toISOString(),
      ...summary,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: 'CRON_FAILED', message }, { status: 500 });
  }
}
