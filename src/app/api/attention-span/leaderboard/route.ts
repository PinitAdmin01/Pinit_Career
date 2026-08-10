import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { requireUserFromRequest } from '@/lib/server/requireAuth';

export interface LeaderboardEntry {
  userId: string;
  displayName: string;
  totalAccuracy: number;
  gamesPlayed: number;
  lastActive: string;
  rank?: number;
}

// In-memory store — start empty (no seeded fake competitors)
let globalLeaderboard: Record<string, LeaderboardEntry> = {};

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
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || gated.user!.id;

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
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;

    const userId = gated.user!.id;
    const body = await req.json();
    const { accuracyEarned } = body;

    // Cap per-submission to stop arbitrary score inflation from the client.
    const earned = Math.min(100, Math.max(0, Math.round(Number(accuracyEarned) || 0)));
    const name = gated.user!.email || 'You';

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
