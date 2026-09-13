'use client';

import { createPortal } from 'react-dom';
import {
  GameId,
  Difficulty,
  AttentionStats,
  GAMES,
} from '@/components/attention-span/types';

import { FocusFireGame } from '@/components/attention-span/FocusFireGame';
import { ReflexRushGame } from '@/components/attention-span/ReflexRushGame';
import { PatternForgeGame } from '@/components/attention-span/PatternForgeGame';
import { LogicCircuitGame } from '@/components/attention-span/LogicCircuitGame';
import { StoreSimGame } from '@/components/attention-span/StoreSimGame';
import {
  MemoryMatrixGame,
  SequenceSnapGame,
  VortexVisionGame,
  FlashFusionGame,
  ShapeShifterGame,
} from '../game-components';

interface AttentionGameBoardProps {
  activeGame: GameId | null;
  setActiveGame: (g: GameId | null) => void;
  difficulty: Difficulty;
  setDifficulty: (d: Difficulty) => void;
  stats: AttentionStats;
  soundMuted: boolean;
  onGameComplete: (gameId: GameId, score: number, accuracy: number) => void;
  onLaunchGame: (gameId: GameId) => void;
}

export function AttentionGameBoard({
  activeGame,
  setActiveGame,
  difficulty,
  setDifficulty,
  stats,
  soundMuted,
  onGameComplete,
  onLaunchGame,
}: AttentionGameBoardProps) {
  const bestDisplay = (gId: GameId) => {
    if (gId === 'focus-fire') return stats.focusFireBest > 0 ? `${stats.focusFireBest} pts` : '—';
    if (gId === 'memory-matrix') return stats.memoryMatrixBest > 0 ? `Level ${stats.memoryMatrixBest}` : '—';
    if (gId === 'reflex-rush') return stats.reflexRushBest > 0 ? `${stats.reflexRushBest}ms` : '—';
    if (gId === 'sequence-snap') return stats.sequenceSnapBest > 0 ? `${stats.sequenceSnapBest} digits` : '—';
    if (gId === 'vortex-vision') return stats.vortexVisionBest ? `${stats.vortexVisionBest} stars` : '—';
    if (gId === 'flash-fusion') return stats.flashFusionBest ? `${stats.flashFusionBest} matches` : '—';
    if (gId === 'shape-shifter') return stats.shapeShifterBest ? `${stats.shapeShifterBest} flips` : '—';
    if (gId === 'pattern-forge') return stats.patternForgeBest ? `${stats.patternForgeBest} pts` : '—';
    if (gId === 'logic-circuit') return stats.logicCircuitBest ? `${stats.logicCircuitBest} pts` : '—';
    if (gId === 'store-sim') return stats.storeSimBest ? `${stats.storeSimBest} close` : '—';
    return 'Play';
  };

  return (
    <>
      {activeGame && typeof document !== 'undefined' && createPortal(
        <div className="att-overlay">
          {activeGame === 'focus-fire' && (
            <FocusFireGame
              gameId="focus-fire"
              difficulty={difficulty}
              onDifficultyChange={setDifficulty}
              completedDifficulties={stats.completedDifficulties}
              soundMuted={soundMuted}
              onComplete={(s, acc) => onGameComplete('focus-fire', s, acc)}
              onExit={() => setActiveGame(null)}
            />
          )}
          {activeGame === 'memory-matrix' && (
            <MemoryMatrixGame
              gameId="memory-matrix"
              difficulty={difficulty}
              onDifficultyChange={setDifficulty}
              completedDifficulties={stats.completedDifficulties}
              soundMuted={soundMuted}
              onComplete={(s, acc) => onGameComplete('memory-matrix', s, acc)}
              onExit={() => setActiveGame(null)}
            />
          )}
          {activeGame === 'reflex-rush' && (
            <ReflexRushGame
              gameId="reflex-rush"
              difficulty={difficulty}
              onDifficultyChange={setDifficulty}
              completedDifficulties={stats.completedDifficulties}
              soundMuted={soundMuted}
              onComplete={(s, acc) => onGameComplete('reflex-rush', s, acc)}
              onExit={() => setActiveGame(null)}
            />
          )}
          {activeGame === 'sequence-snap' && (
            <SequenceSnapGame
              gameId="sequence-snap"
              difficulty={difficulty}
              onDifficultyChange={setDifficulty}
              completedDifficulties={stats.completedDifficulties}
              soundMuted={soundMuted}
              onComplete={(s, acc) => onGameComplete('sequence-snap', s, acc)}
              onExit={() => setActiveGame(null)}
            />
          )}
          {activeGame === 'vortex-vision' && (
            <VortexVisionGame
              gameId="vortex-vision"
              difficulty={difficulty}
              onDifficultyChange={setDifficulty}
              completedDifficulties={stats.completedDifficulties}
              soundMuted={soundMuted}
              onComplete={(s, acc) => onGameComplete('vortex-vision', s, acc)}
              onExit={() => setActiveGame(null)}
            />
          )}
          {activeGame === 'flash-fusion' && (
            <FlashFusionGame
              gameId="flash-fusion"
              difficulty={difficulty}
              onDifficultyChange={setDifficulty}
              completedDifficulties={stats.completedDifficulties}
              soundMuted={soundMuted}
              onComplete={(s, acc) => onGameComplete('flash-fusion', s, acc)}
              onExit={() => setActiveGame(null)}
            />
          )}
          {activeGame === 'shape-shifter' && (
            <ShapeShifterGame
              gameId="shape-shifter"
              difficulty={difficulty}
              onDifficultyChange={setDifficulty}
              completedDifficulties={stats.completedDifficulties}
              soundMuted={soundMuted}
              onComplete={(s, acc) => onGameComplete('shape-shifter', s, acc)}
              onExit={() => setActiveGame(null)}
            />
          )}
          {activeGame === 'pattern-forge' && (
            <PatternForgeGame
              gameId="pattern-forge"
              difficulty={difficulty}
              onDifficultyChange={setDifficulty}
              completedDifficulties={stats.completedDifficulties}
              soundMuted={soundMuted}
              onComplete={(s, acc) => onGameComplete('pattern-forge', s, acc)}
              onExit={() => setActiveGame(null)}
            />
          )}
          {activeGame === 'logic-circuit' && (
            <LogicCircuitGame
              gameId="logic-circuit"
              difficulty={difficulty}
              onDifficultyChange={setDifficulty}
              completedDifficulties={stats.completedDifficulties}
              soundMuted={soundMuted}
              onComplete={(s, acc) => onGameComplete('logic-circuit', s, acc)}
              onExit={() => setActiveGame(null)}
            />
          )}
          {activeGame === 'store-sim' && (
            <StoreSimGame
              gameId="store-sim"
              difficulty={difficulty}
              onDifficultyChange={setDifficulty}
              completedDifficulties={stats.completedDifficulties}
              soundMuted={soundMuted}
              onComplete={(s, acc) => onGameComplete('store-sim', s, acc)}
              onExit={() => setActiveGame(null)}
            />
          )}
        </div>,
        document.body
      )}

      <div className="att-section-h">
        <h2>Studio ({GAMES.length})</h2>
        <span>Easy → Normal → Hard</span>
      </div>

      <div className="att-grid">
        {GAMES.map((g) => {
          const compList = stats.completedDifficulties?.[g.id] || [];
          const easyDone = compList.includes('easy');
          const normalDone = compList.includes('normal');
          const hardDone = compList.includes('hard');

          return (
            <button
              key={g.id}
              type="button"
              className="att-card"
              style={{ ['--card-key' as string]: g.color }}
              onClick={() => onLaunchGame(g.id)}
            >
              <div>
                <div className="att-card-top">
                  <div className="att-card-mark" data-kind={g.id} />
                  <div className="att-card-skill">{g.skill}</div>
                </div>
                <h3>{g.name}</h3>
                <div className="att-tiers">
                  <i className={easyDone ? 'on' : undefined}>Easy</i>
                  <i className={normalDone ? 'on' : undefined}>Normal</i>
                  <i className={hardDone ? 'on' : undefined}>Hard</i>
                </div>
                <p>{g.desc}</p>
              </div>
              <div className="att-card-foot">
                <span>Best <b>{bestDisplay(g.id)}</b></span>
                <span className="att-play-chip">Play</span>
              </div>
            </button>
          );
        })}
      </div>
    </>
  );
}
