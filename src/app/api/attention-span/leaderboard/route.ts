import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export interface LeaderboardEntry {
  userId: string;
  displayName: string;
  totalAccuracy: number;
  gamesPlayed: number;
  lastActive: string;
  rank?: number;
}

// In-memory store fallback for instant end-to-end sync across sessions
let globalLeaderboard: Record<string, LeaderboardEntry> = {
  'demo-1': { userId: 'demo-1', displayName: 'Aarav Sharma', totalAccuracy: 420, gamesPlayed: 8, lastActive: 'Just now' },
  'demo-2': { userId: 'demo-2', displayName: 'Priya Patel', totalAccuracy: 350, gamesPlayed: 6, lastActive: '10m ago' },
  'demo-3': { userId: 'demo-3', displayName: 'Rohan Verma', totalAccuracy: 280, gamesPlayed: 5, lastActive: '1h ago' },
  'demo-4': { userId: 'demo-4', displayName: 'Ananya Gupta', totalAccuracy: 210, gamesPlayed: 4, lastActive: '2h ago' },
  'demo-5': { userId: 'demo-5', displayName: 'Kavya Nair', totalAccuracy: 150, gamesPlayed: 3, lastActive: '5h ago' },
};

function getSortedLeaderboard(currentUserId?: string) {
  const list = Object.values(globalLeaderboard).sort((a, b) => b.totalAccuracy - a.totalAccuracy);
  const ranked = list.map((item, idx) => ({
    ...item,
    rank: idx + 1,
  }));

  const userRank = currentUserId ? ranked.findIndex(r => r.userId === currentUserId) + 1 : 0;
  return { leaders: ranked, userRank: userRank || ranked.length + 1 };
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || undefined;

    // Try fetching live users from Supabase if connected
    try {
      const { data } = await supabase
        .from('profiles')
        .select('id, display_name, attention_accuracy, games_played')
        .order('attention_accuracy', { ascending: false })
        .limit(20);

      if (data && data.length > 0) {
        data.forEach(p => {
          if (p.id && (p.attention_accuracy > 0 || p.id === userId)) {
            globalLeaderboard[p.id] = {
              userId: p.id,
              displayName: p.display_name || 'Student',
              totalAccuracy: p.attention_accuracy || globalLeaderboard[p.id]?.totalAccuracy || 0,
              gamesPlayed: p.games_played || globalLeaderboard[p.id]?.gamesPlayed || 0,
              lastActive: 'Just now',
            };
          }
        });
      }
    } catch {}

    const result = getSortedLeaderboard(userId);
    return NextResponse.json({ ok: true, ...result });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, displayName, accuracyEarned } = body;

    if (!userId) {
      return NextResponse.json({ ok: false, error: 'Missing userId' }, { status: 400 });
    }

    const earned = Math.max(0, Math.round(Number(accuracyEarned) || 0));
    const name = displayName || 'You';

    const existing = globalLeaderboard[userId] || {
      userId,
      displayName: name,
      totalAccuracy: 0,
      gamesPlayed: 0,
      lastActive: 'Just now',
    };

    const updatedTotal = existing.totalAccuracy + earned;
    const updatedGames = existing.gamesPlayed + 1;

    globalLeaderboard[userId] = {
      userId,
      displayName: name,
      totalAccuracy: updatedTotal,
      gamesPlayed: updatedGames,
      lastActive: 'Just now',
    };

    // Try persisting to Supabase if profile table supports it
    try {
      await supabase
        .from('profiles')
        .update({
          attention_accuracy: updatedTotal,
          games_played: updatedGames,
        })
        .eq('id', userId);
    } catch {}

    const result = getSortedLeaderboard(userId);

    return NextResponse.json({
      ok: true,
      addedAccuracy: earned,
      newTotalAccuracy: updatedTotal,
      userRank: result.userRank,
      leaders: result.leaders,
    });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
