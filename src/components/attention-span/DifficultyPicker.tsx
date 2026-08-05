'use client';

import { GameId, Difficulty, isDifficultyUnlocked } from './types';

export function DifficultyPicker({
  gameId,
  difficulty,
  onChange,
  completedDifficulties = {},
}: {
  gameId?: GameId;
  difficulty: Difficulty;
  onChange: (d: Difficulty) => void;
  completedDifficulties?: Record<string, Difficulty[]>;
}) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 6, margin: '14px 0 24px' }}>
      {(['easy', 'normal', 'hard'] as Difficulty[]).map(d => {
        const unlocked = gameId ? isDifficultyUnlocked(gameId, d, completedDifficulties) : true;
        const isDone = gameId ? (completedDifficulties[gameId] || []).includes(d) : false;

        return (
          <button
            key={d}
            disabled={!unlocked}
            onClick={() => { if (unlocked) onChange(d); }}
            style={{
              background: difficulty === d ? (d === 'hard' ? '#ef4444' : d === 'easy' ? '#10b981' : '#d4a843') : 'rgba(255,255,255,0.06)',
              color: !unlocked ? '#666' : difficulty === d ? '#fff' : '#aaa',
              border: `1px solid ${difficulty === d ? 'transparent' : 'rgba(255,255,255,0.12)'}`,
              borderRadius: 10,
              padding: '8px 16px',
              fontSize: 12,
              fontWeight: 800,
              cursor: unlocked ? 'pointer' : 'not-allowed',
              opacity: unlocked ? 1 : 0.4,
              transition: 'all 0.2s ease',
            }}
            title={!unlocked ? `Complete previous mode first to unlock ${d.toUpperCase()} mode!` : ''}
          >
            {!unlocked ? '🔒 ' : isDone ? '✓ ' : ''}
            {d === 'easy' ? '🟢 EASY (1.0x)' : d === 'normal' ? '⚡ NORMAL (1.5x)' : '🔥 HARD (2.5x)'}
          </button>
        );
      })}
    </div>
  );
}

export function CompletionBanner({
  difficulty,
  onNextChallenge,
}: {
  difficulty: Difficulty;
  onNextChallenge: (nextDiff: Difficulty) => void;
}) {
  if (difficulty === 'easy') {
    return (
      <div style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid #10b981', borderRadius: 14, padding: '16px 20px', margin: '18px 0', textAlign: 'center' }}>
        <div style={{ fontSize: 16, fontWeight: 900, color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          🎉 EASY MODE COMPLETED!
        </div>
        <div style={{ fontSize: 13, color: '#aaa', margin: '6px 0 12px' }}>
          Great job! You've completed Easy mode and <strong>unlocked Normal Mode (1.5x Multiplier)</strong>! Can you complete Normal Mode now?
        </div>
        <button
          onClick={() => onNextChallenge('normal')}
          style={{ background: 'linear-gradient(135deg, #d4a843, #f5d78e)', color: '#0a0a0f', border: 'none', padding: '10px 24px', borderRadius: 10, fontSize: 13, fontWeight: 800, cursor: 'pointer' }}
        >
          ⚡ START NORMAL MODE (1.5x)
        </button>
      </div>
    );
  }

  if (difficulty === 'normal') {
    return (
      <div style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid #f59e0b', borderRadius: 14, padding: '16px 20px', margin: '18px 0', textAlign: 'center' }}>
        <div style={{ fontSize: 16, fontWeight: 900, color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          ⚡ NORMAL MODE COMPLETED!
        </div>
        <div style={{ fontSize: 13, color: '#aaa', margin: '6px 0 12px' }}>
          Awesome! You've completed Normal mode and <strong>unlocked Hard Mode (2.5x Multiplier)</strong>! Ultimate Challenge: Can you master Hard Mode?
        </div>
        <button
          onClick={() => onNextChallenge('hard')}
          style={{ background: 'linear-gradient(135deg, #ef4444, #f87171)', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 10, fontSize: 13, fontWeight: 800, cursor: 'pointer' }}
        >
          🔥 START HARD MODE (2.5x)
        </button>
      </div>
    );
  }

  return (
    <div style={{ background: 'rgba(212,168,67,0.18)', border: '1px solid #d4a843', borderRadius: 14, padding: '16px 20px', margin: '18px 0', textAlign: 'center' }}>
      <div style={{ fontSize: 16, fontWeight: 900, color: '#d4a843', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        👑 HARD MODE MASTERED!
      </div>
      <div style={{ fontSize: 13, color: '#aaa', margin: '4px 0 0' }}>
        Zenith Focus Achieved! You have completed all 3 difficulty tiers of this game. You can now freely choose and replay Easy, Normal, or Hard mode anytime!
      </div>
    </div>
  );
}
