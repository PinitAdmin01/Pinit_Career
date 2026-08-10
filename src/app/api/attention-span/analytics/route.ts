import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

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
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await req.json();
    const { dailyLog, monthlySummary } = body;

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
