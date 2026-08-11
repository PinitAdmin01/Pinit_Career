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
    <div className="att-diff">
      {(['easy', 'normal', 'hard'] as Difficulty[]).map(d => {
        const unlocked = gameId ? isDifficultyUnlocked(gameId, d, completedDifficulties) : true;
        const isDone = gameId ? (completedDifficulties[gameId] || []).includes(d) : false;
        const label = d === 'easy' ? 'Easy · 1×' : d === 'normal' ? 'Normal · 1.5×' : 'Hard · 2.5×';

        return (
          <button
            key={d}
            type="button"
            disabled={!unlocked}
            className={`${d === 'easy' ? 'is-easy' : d === 'hard' ? 'is-hard' : ''}${difficulty === d ? ' is-on' : ''}`}
            onClick={() => { if (unlocked) onChange(d); }}
            title={!unlocked ? `Finish the previous mode to unlock ${d}` : isDone ? `${d} complete` : undefined}
          >
            {isDone ? 'Done · ' : ''}
            {label}
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
      <div className="att-banner">
        <strong>Easy complete</strong>
        <p>Normal is open. Accuracy now counts at 1.5×.</p>
        <button type="button" className="att-btn att-btn-primary" onClick={() => onNextChallenge('normal')}>
          Start normal
        </button>
      </div>
    );
  }

  if (difficulty === 'normal') {
    return (
      <div className="att-banner">
        <strong>Normal complete</strong>
        <p>Hard is open. Accuracy now counts at 2.5×.</p>
        <button type="button" className="att-btn att-btn-primary" onClick={() => onNextChallenge('hard')}>
          Start hard
        </button>
      </div>
    );
  }

  return (
    <div className="att-banner">
      <strong>All three modes done</strong>
      <p>Replay any tier. The ladder stays unlocked.</p>
    </div>
  );
}
