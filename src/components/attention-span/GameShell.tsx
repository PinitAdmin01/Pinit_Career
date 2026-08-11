'use client';

import { ReactNode } from 'react';
import '@/styles/attention-games.css';

export type GameAccent = 'amber' | 'violet' | 'green' | 'blue' | 'pink' | 'indigo' | 'teal';
export type GameMarkKind = 'focus' | 'memory' | 'reflex' | 'sequence' | 'vortex' | 'flash' | 'shape' | 'pattern' | 'logic' | 'store';

export function GameMark({ kind }: { kind: GameMarkKind }) {
  return (
    <div className="att-mark" data-kind={kind} aria-hidden>
      <i />
    </div>
  );
}

export function GameShell({
  accent = 'amber',
  mark,
  title,
  description,
  phase,
  onExit,
  countdown,
  readyExtra,
  onStart,
  startLabel = 'Start',
  children,
  doneTitle,
  doneScore,
  doneHint,
  doneExtra,
  onClaim,
  onReplay,
  wide,
}: {
  accent?: GameAccent;
  mark: GameMarkKind;
  title: string;
  description: string;
  phase: string;
  onExit: () => void;
  countdown?: ReactNode;
  readyExtra?: ReactNode;
  onStart?: () => void;
  startLabel?: string;
  children?: ReactNode;
  doneTitle?: string;
  doneScore?: string;
  doneHint?: ReactNode;
  doneExtra?: ReactNode;
  onClaim?: () => void;
  onReplay?: () => void;
  wide?: boolean;
}) {
  const showReady = phase === 'ready';
  const showDone = phase === 'done';
  const showPlay = !showReady && !showDone;

  return (
    <div className={`att-stage att-accent-${accent}${wide ? ' att-stage-wide' : ''}`}>
      {countdown}
      <button type="button" className="att-exit" onClick={onExit}>Exit</button>

      {showReady && (
        <div className="att-ready">
          <GameMark kind={mark} />
          <h2 className="att-title">{title}</h2>
          <p className="att-sub">{description}</p>
          {readyExtra}
          {onStart && (
            <button type="button" className="att-btn att-btn-primary" onClick={onStart}>
              {startLabel}
            </button>
          )}
        </div>
      )}

      {showPlay && <div className="att-play">{children}</div>}

      {showDone && (
        <div className="att-done">
          <GameMark kind={mark} />
          <h2 className="att-title">{doneTitle || title}</h2>
          {doneScore && <div className="att-score">{doneScore}</div>}
          {doneHint && <div className="att-sub">{doneHint}</div>}
          {doneExtra}
          <div className="att-actions">
            {onClaim && (
              <button type="button" className="att-btn att-btn-primary" onClick={onClaim}>
                Save & exit
              </button>
            )}
            {onReplay && (
              <button type="button" className="att-btn att-btn-ghost" onClick={onReplay}>
                Replay
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
