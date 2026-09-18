'use client';

import React, { useState, useEffect } from 'react';
import { toast } from '@/lib/store/useAppStore';
import { StudentProfile } from './StudentCard';

interface PendingChallenge {
  id: string;
  title: string;
  sender: {
    id: string;
    name: string;
    avatar: string;
  };
  details: string;
  message?: string;
  status: string;
  battleUrl?: string;
}

interface LeaderboardEntry {
  rank: number;
  id: string;
  name: string;
  college: string;
  arenaWins: number;
  xp: number;
  avatar: string;
}

interface HeadToHead {
  id: string;
  name: string;
  youWins: number;
  theyWins: number;
  lastTopic: string;
}

interface ArenaChallengesViewProps {
  onOpenChallengeModal: (student?: StudentProfile) => void;
}

export const ArenaChallengesView: React.FC<ArenaChallengesViewProps> = ({
  onOpenChallengeModal
}) => {
  const [loading, setLoading] = useState(true);
  const [pendingChallenges, setPendingChallenges] = useState<PendingChallenge[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [headToHead, setHeadToHead] = useState<HeadToHead[]>([]);
  const [respondingId, setRespondingId] = useState<string | null>(null);

  const fetchChallenges = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/friends/challenges');
      const data = await res.json();
      if (data.ok) {
        setPendingChallenges(data.pendingChallenges || []);
        setLeaderboard(data.leaderboard || []);
        setHeadToHead(data.headToHead || []);
      }
    } catch (err) {
      console.error('Failed to load arena challenges:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  const handleRespond = async (challengeId: string, action: 'accept' | 'decline') => {
    try {
      setRespondingId(challengeId);
      const res = await fetch('/api/friends/challenges', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ challengeId, action })
      });
      const data = await res.json();
      if (data.ok) {
        if (action === 'accept') {
          toast.success('Duel Accepted!', 'Launching 1v1 live battle in Challenging Arena...');
          setTimeout(() => {
            window.location.href = data.battleUrl || '/arena';
          }, 1200);
        } else {
          toast.info('Duel Declined', 'Challenge dismissed.');
          fetchChallenges();
        }
      }
    } catch (err) {
      toast.error('Network Error', 'Failed to respond to challenge');
    } finally {
      setRespondingId(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      
      {/* ── Top Hero Banner ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 24px',
        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(15, 23, 42, 0.8) 100%)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        borderRadius: 16
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 24 }}>⚔️</span>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#ffffff', margin: 0 }}>
              1v1 Friend Duels & Arena Battleground
            </h2>
          </div>
          <p style={{ fontSize: 13, color: '#94a3b8', margin: '6px 0 0' }}>
            Challenge campus friends to real-time coding duels, wager XP, and climb the verified peer leaderboard.
          </p>
        </div>

        <button
          className="friends-btn friends-btn-primary"
          style={{
            background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
            border: '1px solid rgba(248, 113, 113, 0.4)',
            padding: '10px 18px',
            fontSize: 13,
            fontWeight: 700
          }}
          onClick={() => onOpenChallengeModal()}
        >
          ⚔️ Challenge a Friend
        </button>
      </div>

      {/* ── Pending Duels Section ── */}
      {pendingChallenges.length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <span style={{ fontSize: 16 }}>⚡</span>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#ffffff', margin: 0 }}>
              Pending Duel Invitations ({pendingChallenges.length})
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 14 }}>
            {pendingChallenges.map((duel) => (
              <div
                key={duel.id}
                style={{
                  padding: 18,
                  background: 'rgba(15, 23, 42, 0.85)',
                  border: '1px solid rgba(239, 68, 68, 0.35)',
                  borderRadius: 14,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{
                    fontSize: 10.5,
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    padding: '3px 8px',
                    borderRadius: 6,
                    background: 'rgba(239, 68, 68, 0.2)',
                    color: '#f87171',
                    border: '1px solid rgba(239, 68, 68, 0.4)'
                  }}>
                    1v1 Challenge
                  </span>
                  <span style={{ fontSize: 11, color: '#fbbf24', fontWeight: 700 }}>+150 XP Wager</span>
                </div>

                <div style={{ fontSize: 15, fontWeight: 700, color: '#ffffff' }}>{duel.title}</div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <img
                    src={duel.sender.avatar}
                    alt={duel.sender.name}
                    style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9' }}>Challenged by {duel.sender.name}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8' }}>{duel.details}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                  <button
                    className="friends-btn friends-btn-primary"
                    style={{
                      flex: 1,
                      background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
                      fontSize: 12,
                      padding: '8px 12px'
                    }}
                    disabled={respondingId === duel.id}
                    onClick={() => handleRespond(duel.id, 'accept')}
                  >
                    ⚔️ Accept & Battle Now
                  </button>
                  <button
                    className="friends-btn friends-btn-secondary"
                    style={{ flex: 1, fontSize: 12, padding: '8px 12px' }}
                    disabled={respondingId === duel.id}
                    onClick={() => handleRespond(duel.id, 'decline')}
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Two Columns: Head-to-Head & Leaderboard ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 20 }}>
        
        {/* Left: Head-to-Head Records */}
        <div style={{
          padding: 20,
          background: 'rgba(15, 23, 42, 0.75)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 14
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 18 }}>🏆</span>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#ffffff', margin: 0 }}>
              Head-to-Head Duel Records
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {headToHead.map((item) => {
              const isWinning = item.youWins >= item.theyWins;
              return (
                <div
                  key={item.id}
                  style={{
                    padding: '12px 14px',
                    background: 'rgba(30, 41, 59, 0.45)',
                    borderRadius: 12,
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#ffffff' }}>You vs {item.name}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8' }}>Last: {item.lastTopic}</div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{
                      fontSize: 14,
                      fontWeight: 800,
                      color: isWinning ? '#34d399' : '#f87171'
                    }}>
                      {item.youWins}W - {item.theyWins}L
                    </div>
                    <div style={{ fontSize: 10.5, color: '#64748b' }}>
                      {isWinning ? 'Positive Winrate' : 'Rematch Needed'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Friends Arena Leaderboard */}
        <div style={{
          padding: 20,
          background: 'rgba(15, 23, 42, 0.75)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 14
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 18 }}>👑</span>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#ffffff', margin: 0 }}>
                Friends Arena Leaderboard
              </h3>
            </div>
            <a href="/arena" style={{ fontSize: 11.5, color: '#a78bfa', textDecoration: 'none' }}>
              Full Arena →
            </a>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {leaderboard.map((user) => {
              const isMe = user.id === 'current_user';
              return (
                <div
                  key={user.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: 10,
                    background: isMe ? 'rgba(99, 102, 241, 0.2)' : 'rgba(30, 41, 59, 0.35)',
                    border: isMe ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid rgba(255, 255, 255, 0.04)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{
                      fontSize: 12,
                      fontWeight: 800,
                      color: user.rank === 1 ? '#fbbf24' : user.rank === 2 ? '#cbd5e1' : user.rank === 3 ? '#b45309' : '#64748b',
                      width: 20
                    }}>
                      #{user.rank}
                    </span>
                    <img src={user.avatar} alt={user.name} style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }} />
                    <div>
                      <div style={{ fontSize: 12.5, fontWeight: isMe ? 800 : 600, color: isMe ? '#c084fc' : '#ffffff' }}>
                        {user.name}
                      </div>
                      <div style={{ fontSize: 10, color: '#94a3b8' }}>{user.college}</div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: '#38bdf8' }}>{user.arenaWins} Wins</div>
                    <div style={{ fontSize: 10, color: '#64748b' }}>{user.xp} XP</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};