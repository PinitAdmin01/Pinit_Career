import { NextResponse } from 'next/server';

interface UserAnalyticsRecord {
  userId: string;
  dailyLogs: Record<string, any>;
  monthlySummaries: Record<string, any>;
  lastUpdated: string;
}

// In-memory store fallback for long-term analytics logs across sessions
let globalAnalyticsStore: Record<string, UserAnalyticsRecord> = {};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ ok: false, error: 'Missing userId' }, { status: 400 });
    }

    const record = globalAnalyticsStore[userId] || {
      userId,
      dailyLogs: {},
      monthlySummaries: {},
      lastUpdated: new Date().toISOString(),
    };

    return NextResponse.json({ ok: true, analytics: record });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, dailyLog, monthlySummary } = body;

    if (!userId) {
      return NextResponse.json({ ok: false, error: 'Missing userId' }, { status: 400 });
    }

    const existing = globalAnalyticsStore[userId] || {
      userId,
      dailyLogs: {},
      monthlySummaries: {},
      lastUpdated: new Date().toISOString(),
    };

    if (dailyLog && dailyLog.date) {
      existing.dailyLogs[dailyLog.date] = {
        ...existing.dailyLogs[dailyLog.date],
        ...dailyLog,
      };
    }

    if (monthlySummary && monthlySummary.month) {
      existing.monthlySummaries[monthlySummary.month] = {
        ...existing.monthlySummaries[monthlySummary.month],
        ...monthlySummary,
      };
    }

    existing.lastUpdated = new Date().toISOString();
    globalAnalyticsStore[userId] = existing;

    return NextResponse.json({ ok: true, analytics: existing });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
