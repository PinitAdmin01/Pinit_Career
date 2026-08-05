'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { GameId, Difficulty, playSound } from '@/components/attention-span/types';
import { DifficultyPicker, CompletionBanner } from '@/components/attention-span/DifficultyPicker';
import { CountdownOverlay } from '@/components/attention-span/CountdownOverlay';
import { OnScreenNumpad } from '@/components/attention-span/OnScreenNumpad';

/* 🧠 GAME 2: MEMORY MATRIX */
export function MemoryMatrixGame({ gameId, difficulty, onDifficultyChange, completedDifficulties, soundMuted, onComplete, onExit }: { gameId: GameId; difficulty: Difficulty; onDifficultyChange: (d: Difficulty) => void; completedDifficulties?: Record<string, Difficulty[]>; soundMuted: boolean; onComplete: (finalLevel: number, accuracyEarned: number) => void; onExit: () => void }) {
  const [phase, setPhase] = useState<'ready' | 'countdown' | 'memorizing' | 'input' | 'done'>('ready');
  const [level, setLevel] = useState(1);
  const [activePattern, setActivePattern] = useState<number[]>([]);
  const [userSelected, setUserSelected] = useState<number[]>([]);
  const [wrongSelections, setWrongSelections] = useState<number[]>([]);

  const getGridSize = (lvl: number) => lvl <= 2 ? 3 : lvl <= 5 ? 4 : 5;
  const getTileCount = (lvl: number) => Math.min(lvl + 2, 10);
  const gridSize = getGridSize(level);

  const startLevel = useCallback((lvl: number) => {
    setLevel(lvl);
    setUserSelected([]);
    setWrongSelections([]);
    const size = getGridSize(lvl);
    const count = getTileCount(lvl);
    const totalTiles = size * size;

    const pattern: number[] = [];
    while (pattern.length < count) {
      const idx = Math.floor(Math.random() * totalTiles);
      if (!pattern.includes(idx)) pattern.push(idx);
    }

    setActivePattern(pattern);
    setPhase('memorizing');

    const displayMs = (difficulty === 'easy' ? 2200 : difficulty === 'hard' ? 1200 : 1600) + (count * 200);
    setTimeout(() => {
      setPhase('input');
    }, displayMs);
  }, [difficulty]);

  const handleTileClick = (idx: number) => {
    if (phase !== 'input' || userSelected.includes(idx) || wrongSelections.includes(idx)) return;

    if (activePattern.includes(idx)) {
      playSound('correct', soundMuted);
      const nextSel = [...userSelected, idx];
      setUserSelected(nextSel);

      if (nextSel.length === activePattern.length) {
        playSound('level', soundMuted);
        setTimeout(() => startLevel(level + 1), 600);
      }
    } else {
      playSound('wrong', soundMuted);
      setWrongSelections(prev => [...prev, idx]);
      setPhase('done');
    }
  };

  const finalLevel = Math.max(1, level - 1);
  const accuracyEarned = Math.min(100, finalLevel * 20);

  return (
    <div style={{ textAlign: 'center', animation: 'attFadeIn 0.3s ease', position: 'relative', width: '100%', maxWidth: 460 }}>
      {phase === 'countdown' && <CountdownOverlay soundMuted={soundMuted} onComplete={() => startLevel(1)} />}

      <button onClick={onExit} style={{ position: 'absolute', top: -10, right: 0, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '8px 18px', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>✕ Exit</button>

      {phase === 'ready' && (
        <div style={{ animation: 'attFadeIn 0.4s ease' }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🧠</div>
          <h2 style={{ color: '#f0f0f0', fontSize: 28, fontWeight: 800, margin: '0 0 8px' }}>Memory Matrix</h2>
          <p style={{ color: '#aaa', fontSize: 14, margin: '0 0 12px', maxWidth: 420 }}>Memorize expanding tile patterns and reproduce them from memory!</p>

          <DifficultyPicker gameId={gameId} difficulty={difficulty} onChange={onDifficultyChange} completedDifficulties={completedDifficulties} />

          <button onClick={() => setPhase('countdown')} style={{ background: 'linear-gradient(135deg, #8b5cf6, #c084fc)', color: '#fff', border: 'none', padding: '14px 40px', borderRadius: 12, fontSize: 16, fontWeight: 800, cursor: 'pointer', letterSpacing: 1 }}>START GAME</button>
        </div>
      )}

      {(phase === 'memorizing' || phase === 'input') && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 40, marginBottom: 16 }}>
            <div style={{ color: '#8b5cf6', fontSize: 18, fontWeight: 800 }}>Level {level}</div>
            <div style={{ color: phase === 'memorizing' ? '#f59e0b' : '#10b981', fontSize: 14, fontWeight: 700 }}>
              {phase === 'memorizing' ? '👁 Memorize Pattern!' : '🎯 Tap Highlighted Tiles'}
            </div>
          </div>

          <div style={{ display: 'inline-grid', gridTemplateColumns: `repeat(${gridSize}, 64px)`, gap: 8 }}>
            {Array.from({ length: gridSize * gridSize }).map((_, i) => {
              const isPattern = activePattern.includes(i);
              const isSelected = userSelected.includes(i);
              const isWrong = wrongSelections.includes(i);
              let bg = 'rgba(255,255,255,0.06)';
              let border = '1px solid rgba(255,255,255,0.12)';

              if (phase === 'memorizing' && isPattern) {
                bg = 'linear-gradient(135deg, #8b5cf6, #c084fc)';
                border = '2px solid #c084fc';
              } else if (isSelected) {
                bg = 'linear-gradient(135deg, #10b981, #34d399)';
                border = '2px solid #34d399';
              } else if (isWrong) {
                bg = 'linear-gradient(135deg, #ef4444, #f87171)';
                border = '2px solid #ef4444';
              }

              return (
                <div key={i} onClick={() => handleTileClick(i)} style={{ width: 64, height: 64, borderRadius: 12, background: bg, border, cursor: phase === 'input' ? 'pointer' : 'default', transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {isSelected && <span style={{ color: '#fff', fontSize: 20 }}>✓</span>}
                  {isWrong && <span style={{ color: '#fff', fontSize: 20 }}>✕</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {phase === 'done' && (
        <div style={{ animation: 'attFadeIn 0.4s ease' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🧠</div>
          <h2 style={{ color: '#f0f0f0', fontSize: 28, fontWeight: 800, margin: '0 0 8px' }}>Pattern Broken!</h2>
          <div style={{ fontSize: 56, fontWeight: 900, color: '#8b5cf6', margin: '16px 0 4px', animation: 'attCountUp 0.5s ease' }}>Level {finalLevel}</div>
          <p style={{ color: '#aaa', fontSize: 14, margin: '0 0 4px' }}>highest matrix level achieved</p>

          <CompletionBanner difficulty={difficulty} onNextChallenge={(nextD) => { onComplete(finalLevel + 1, accuracyEarned); onDifficultyChange(nextD); setPhase('ready'); }} />

          <div style={{ color: '#10b981', fontSize: 14, fontWeight: 700, margin: '4px 0 24px' }}>+{accuracyEarned} Accuracy added to Leaderboard & History Log!</div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button onClick={() => { onComplete(finalLevel + 1, accuracyEarned); onExit(); }} style={{ background: 'linear-gradient(135deg, #8b5cf6, #c084fc)', color: '#fff', border: 'none', padding: '12px 32px', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Collect XP & Exit</button>
            <button onClick={() => { onComplete(finalLevel + 1, accuracyEarned); setPhase('ready'); }} style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '12px 32px', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Play Again</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* 🔢 GAME 4: SEQUENCE SNAP (WITH CUSTOM ON-SCREEN NUMPAD — NO KEYBOARD POP-UP) */
export function SequenceSnapGame({ gameId, difficulty, onDifficultyChange, completedDifficulties, soundMuted, onComplete, onExit }: { gameId: GameId; difficulty: Difficulty; onDifficultyChange: (d: Difficulty) => void; completedDifficulties?: Record<string, Difficulty[]>; soundMuted: boolean; onComplete: (maxReached: number, accuracyEarned: number) => void; onExit: () => void }) {
  const [phase, setPhase] = useState<'ready' | 'countdown' | 'showing' | 'input' | 'done'>('ready');
  const [sequence, setSequence] = useState<number[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [level, setLevel] = useState(3);
  const [maxReached, setMaxReached] = useState(0);

  const startLevel = useCallback((lvl: number) => {
    setLevel(lvl);
    setInputVal('');
    const seq: number[] = [];
    for (let i = 0; i < lvl; i++) {
      seq.push(Math.floor(Math.random() * 9) + 1);
    }
    setSequence(seq);
    setPhase('showing');

    const showMs = (difficulty === 'easy' ? 1200 : difficulty === 'hard' ? 600 : 900) * lvl;
    setTimeout(() => {
      setPhase('input');
    }, showMs);
  }, [difficulty]);

  const handleSubmit = () => {
    if (phase !== 'input' || inputVal.length === 0) return;

    const userNums = inputVal.split('').map(Number);
    const isCorrect = userNums.length === sequence.length && userNums.every((n, i) => n === sequence[i]);

    if (isCorrect) {
      playSound('correct', soundMuted);
      const nextMax = Math.max(maxReached, level);
      setMaxReached(nextMax);
      setTimeout(() => startLevel(level + 1), 500);
    } else {
      playSound('wrong', soundMuted);
      setPhase('done');
    }
  };

  const accuracyEarned = Math.min(100, maxReached * 12);

  return (
    <div style={{ textAlign: 'center', animation: 'attFadeIn 0.3s ease', position: 'relative', width: '100%', maxWidth: 460 }}>
      {phase === 'countdown' && <CountdownOverlay soundMuted={soundMuted} onComplete={() => { setMaxReached(0); startLevel(3); }} />}

      <button onClick={onExit} style={{ position: 'absolute', top: -10, right: 0, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '8px 18px', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>✕ Exit</button>

      {phase === 'ready' && (
        <div style={{ animation: 'attFadeIn 0.4s ease' }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🔢</div>
          <h2 style={{ color: '#f0f0f0', fontSize: 28, fontWeight: 800, margin: '0 0 8px' }}>Sequence Snap</h2>
          <p style={{ color: '#aaa', fontSize: 14, margin: '0 0 12px', maxWidth: 420 }}>Watch number sequences flash and tap them back on the touch pad in exact order!</p>

          <DifficultyPicker gameId={gameId} difficulty={difficulty} onChange={onDifficultyChange} completedDifficulties={completedDifficulties} />

          <button onClick={() => setPhase('countdown')} style={{ background: 'linear-gradient(135deg, #3b82f6, #60a5fa)', color: '#fff', border: 'none', padding: '14px 40px', borderRadius: 12, fontSize: 16, fontWeight: 800, cursor: 'pointer', letterSpacing: 1 }}>START GAME</button>
        </div>
      )}

      {phase === 'showing' && (
        <div>
          <div style={{ color: '#3b82f6', fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Sequence ({sequence.length} Digits)</div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', margin: '24px 0' }}>
            {sequence.map((n, i) => (
              <div key={i} style={{ width: 52, height: 60, borderRadius: 12, background: 'linear-gradient(135deg, #3b82f6, #60a5fa)', color: '#fff', fontSize: 30, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(59,130,246,0.5)', animation: 'attReveal 0.2s ease' }}>
                {n}
              </div>
            ))}
          </div>
        </div>
      )}

      {phase === 'input' && (
        <div style={{ animation: 'attFadeIn 0.3s ease' }}>
          <div style={{ color: '#aaa', fontSize: 13, marginBottom: 10 }}>Tap exact recalled sequence below:</div>
          
          {/* Recalled Digits Display Box */}
          <div style={{ background: 'rgba(255,255,255,0.06)', border: '2px solid #3b82f6', color: '#fff', fontSize: 28, fontWeight: 800, textAlign: 'center', padding: '10px 20px', borderRadius: 14, minHeight: 52, minWidth: 200, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', letterSpacing: 6, marginBottom: 18 }}>
            {inputVal || <span style={{ color: '#555', fontSize: 16, letterSpacing: 0 }}>Tap Digits...</span>}
          </div>

          {/* On-Screen Touch Numpad */}
          <OnScreenNumpad
            soundMuted={soundMuted}
            onPress={(digit) => setInputVal(prev => (prev.length < sequence.length ? prev + digit : prev))}
            onBackspace={() => setInputVal(prev => prev.slice(0, -1))}
            onSubmit={handleSubmit}
          />
        </div>
      )}

      {phase === 'done' && (
        <div style={{ animation: 'attFadeIn 0.4s ease' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🔢</div>
          <h2 style={{ color: '#f0f0f0', fontSize: 28, fontWeight: 800, margin: '0 0 8px' }}>Sequence Ended!</h2>
          <div style={{ fontSize: 56, fontWeight: 900, color: '#3b82f6', margin: '16px 0 4px', animation: 'attCountUp 0.5s ease' }}>{maxReached} Digits</div>
          <p style={{ color: '#aaa', fontSize: 14, margin: '0 0 4px' }}>longest sequence correctly recalled</p>

          <CompletionBanner difficulty={difficulty} onNextChallenge={(nextD) => { onComplete(maxReached, accuracyEarned); onDifficultyChange(nextD); setPhase('ready'); }} />

          <div style={{ color: '#10b981', fontSize: 14, fontWeight: 700, margin: '4px 0 24px' }}>+{accuracyEarned} Accuracy added to Leaderboard & History Log!</div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button onClick={() => { onComplete(maxReached, accuracyEarned); onExit(); }} style={{ background: 'linear-gradient(135deg, #3b82f6, #60a5fa)', color: '#fff', border: 'none', padding: '12px 32px', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Collect XP & Exit</button>
            <button onClick={() => { onComplete(maxReached, accuracyEarned); setPhase('ready'); }} style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '12px 32px', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Play Again</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ⚔️ GAME 5: 1v1 FOCUS DUEL */
export function FocusDuelGame({ soundMuted, onComplete, onExit }: { soundMuted: boolean; onComplete: (score: number, accuracyEarned: number) => void; onExit: () => void }) {
  const [phase, setPhase] = useState<'ready' | 'countdown' | 'playing' | 'done'>('ready');
  const [myScore, setMyScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [targetIdx, setTargetIdx] = useState(-1);
  const [winner, setWinner] = useState<'me' | 'ai' | null>(null);

  const spawnTarget = useCallback(() => {
    setTargetIdx(Math.floor(Math.random() * 9));
  }, []);

  useEffect(() => {
    if (phase !== 'playing') return;
    spawnTarget();

    // Human-like AI Reaction Loop
    const runAiTurn = () => {
      const isTrailing = aiScore < myScore;
      const baseDelay = isTrailing ? 750 : 1050;
      const delay = baseDelay + Math.random() * 400;

      setTimeout(() => {
        if (phase !== 'playing') return;
        const hesitates = Math.random() < 0.15;
        if (!hesitates) {
          setAiScore(prev => {
            const next = prev + 1;
            if (next >= 10) { setWinner('ai'); setPhase('done'); }
            return next;
          });
          spawnTarget();
        }
      }, delay);
    };

    const aiInterval = setInterval(runAiTurn, 1200);
    return () => clearInterval(aiInterval);
  }, [phase, spawnTarget, myScore, aiScore]);

  const handleCellClick = (idx: number) => {
    if (phase !== 'playing' || idx !== targetIdx) return;
    playSound('correct', soundMuted);
    const next = myScore + 1;
    setMyScore(next);
    if (next >= 10) {
      setWinner('me');
      setPhase('done');
    } else {
      spawnTarget();
    }
  };

  const accuracyEarned = winner === 'me' ? 80 : 35;

  return (
    <div style={{ textAlign: 'center', animation: 'attFadeIn 0.3s ease', position: 'relative', width: '100%', maxWidth: 460 }}>
      {phase === 'countdown' && <CountdownOverlay soundMuted={soundMuted} onComplete={() => { setMyScore(0); setAiScore(0); setWinner(null); setPhase('playing'); }} />}

      <button onClick={onExit} style={{ position: 'absolute', top: -10, right: 0, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '8px 18px', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>✕ Exit</button>

      {phase === 'ready' && (
        <div style={{ animation: 'attFadeIn 0.4s ease' }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>⚔️</div>
          <h2 style={{ color: '#f0f0f0', fontSize: 28, fontWeight: 800, margin: '0 0 8px' }}>1v1 AI Focus Duel</h2>
          <p style={{ color: '#aaa', fontSize: 14, margin: '0 0 24px', maxWidth: 420 }}>Sprint head-to-head against AI rival Aarav to reach 10 targets first!</p>
          <button onClick={() => setPhase('countdown')} style={{ background: 'linear-gradient(135deg, #ef4444, #f87171)', color: '#fff', border: 'none', padding: '14px 40px', borderRadius: 12, fontSize: 16, fontWeight: 800, cursor: 'pointer', letterSpacing: 1 }}>START DUEL</button>
        </div>
      )}

      {phase === 'playing' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-around', width: 340, margin: '0 auto 20px', background: 'rgba(255,255,255,0.06)', padding: '12px 20px', borderRadius: 14, border: '1px solid rgba(255,255,255,0.12)' }}>
            <div>
              <div style={{ fontSize: 12, color: '#aaa' }}>YOU</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#10b981' }}>{myScore}</div>
            </div>
            <div style={{ fontSize: 24, alignSelf: 'center', color: '#aaa' }}>VS</div>
            <div>
              <div style={{ fontSize: 12, color: '#aaa' }}>AARAV (AI)</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#ef4444' }}>{aiScore}</div>
            </div>
          </div>

          <div style={{ display: 'inline-grid', gridTemplateColumns: 'repeat(3, 80px)', gap: 10 }}>
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} onClick={() => handleCellClick(i)} style={{ width: 80, height: 80, borderRadius: 14, background: i === targetIdx ? 'linear-gradient(135deg, #ef4444, #f87171)' : 'rgba(255,255,255,0.06)', border: `2px solid ${i === targetIdx ? '#ef4444' : 'rgba(255,255,255,0.12)'}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>
                {i === targetIdx && '⚔️'}
              </div>
            ))}
          </div>
        </div>
      )}

      {phase === 'done' && (
        <div style={{ animation: 'attFadeIn 0.4s ease' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>{winner === 'me' ? '👑' : '💔'}</div>
          <h2 style={{ color: winner === 'me' ? '#10b981' : '#ef4444', fontSize: 28, fontWeight: 800, margin: '0 0 8px' }}>
            {winner === 'me' ? 'VICTORY!' : 'DUEL LOST'}
          </h2>
          <p style={{ color: '#aaa', fontSize: 14, margin: '0 0 16px' }}>Final Score: {myScore} - {aiScore}</p>

          <div style={{ color: '#10b981', fontSize: 14, fontWeight: 700, margin: '4px 0 24px' }}>+{accuracyEarned} Accuracy added to Leaderboard & History Log!</div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button onClick={() => { onComplete(myScore, accuracyEarned); onExit(); }} style={{ background: 'linear-gradient(135deg, #ef4444, #f87171)', color: '#fff', border: 'none', padding: '12px 32px', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Collect XP & Exit</button>
            <button onClick={() => { onComplete(myScore, accuracyEarned); setPhase('ready'); }} style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '12px 32px', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Play Again</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* 🌀 GAME 6: VORTEX VISION */
export function VortexVisionGame({ gameId, difficulty, onDifficultyChange, completedDifficulties, soundMuted, onComplete, onExit }: { gameId: GameId; difficulty: Difficulty; onDifficultyChange: (d: Difficulty) => void; completedDifficulties?: Record<string, Difficulty[]>; soundMuted: boolean; onComplete: (score: number, accuracyEarned: number) => void; onExit: () => void }) {
  const [phase, setPhase] = useState<'ready' | 'countdown' | 'playing' | 'done'>('ready');
  const [score, setScore] = useState(0);
  const [targetPos, setTargetPos] = useState({ r: 100, a: 0 });
  const [debrisAngle, setDebrisAngle] = useState(0);

  useEffect(() => {
    if (phase !== 'playing') return;
    const interval = setInterval(() => {
      setDebrisAngle(prev => (prev + 5) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, [phase]);

  const spawnTarget = useCallback(() => {
    setTargetPos({
      r: 60 + Math.random() * 80,
      a: Math.random() * 360,
    });
  }, []);

  const handleTargetClick = () => {
    if (phase !== 'playing') return;
    playSound('correct', soundMuted);
    setScore(prev => prev + 1);
    spawnTarget();
  };

  const accuracyEarned = Math.min(100, score * 8);

  return (
    <div style={{ textAlign: 'center', animation: 'attFadeIn 0.3s ease', position: 'relative', width: '100%', maxWidth: 460 }}>
      {phase === 'countdown' && <CountdownOverlay soundMuted={soundMuted} onComplete={() => { setScore(0); spawnTarget(); setPhase('playing'); setTimeout(() => setPhase('done'), 20000); }} />}

      <button onClick={onExit} style={{ position: 'absolute', top: -10, right: 0, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '8px 18px', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>✕ Exit</button>

      {phase === 'ready' && (
        <div style={{ animation: 'attFadeIn 0.4s ease' }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🌀</div>
          <h2 style={{ color: '#f0f0f0', fontSize: 28, fontWeight: 800, margin: '0 0 8px' }}>Vortex Vision</h2>
          <p style={{ color: '#aaa', fontSize: 14, margin: '0 0 12px', maxWidth: 420 }}>Track gold stars flashing inside a spinning vortex while ignoring orbiting debris!</p>

          <DifficultyPicker gameId={gameId} difficulty={difficulty} onChange={onDifficultyChange} completedDifficulties={completedDifficulties} />

          <button onClick={() => setPhase('countdown')} style={{ background: 'linear-gradient(135deg, #ec4899, #f472b6)', color: '#fff', border: 'none', padding: '14px 40px', borderRadius: 12, fontSize: 16, fontWeight: 800, cursor: 'pointer', letterSpacing: 1 }}>START VORTEX</button>
        </div>
      )}

      {phase === 'playing' && (
        <div>
          <div style={{ color: '#ec4899', fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Stars: {score}</div>
          <div style={{ width: 320, height: 320, margin: '0 auto', borderRadius: '50%', background: 'radial-gradient(circle at center, #1e102a, #0a0a0f)', border: '2px solid #ec4899', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, transform: `rotate(${debrisAngle}deg)`, transition: 'transform 0.03s linear', pointerEvents: 'none' }}>
              <div style={{ position: 'absolute', top: 40, left: 160, fontSize: 16 }}>💣</div>
              <div style={{ position: 'absolute', top: 220, left: 80, fontSize: 16 }}>💣</div>
              <div style={{ position: 'absolute', top: 180, left: 240, fontSize: 16 }}>💣</div>
            </div>

            <div
              onClick={handleTargetClick}
              style={{
                position: 'absolute',
                left: 160 + targetPos.r * Math.cos((targetPos.a * Math.PI) / 180) - 20,
                top: 160 + targetPos.r * Math.sin((targetPos.a * Math.PI) / 180) - 20,
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: 'radial-gradient(circle at center, #f5d78e, #d4a843)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
                boxShadow: '0 0 20px #d4a843',
              }}
            >
              ★
            </div>
          </div>
        </div>
      )}

      {phase === 'done' && (
        <div style={{ animation: 'attFadeIn 0.4s ease' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🌀</div>
          <h2 style={{ color: '#f0f0f0', fontSize: 28, fontWeight: 800, margin: '0 0 8px' }}>Vortex Cleared!</h2>
          <div style={{ fontSize: 56, fontWeight: 900, color: '#ec4899', margin: '16px 0 4px' }}>{score} Stars</div>

          <CompletionBanner difficulty={difficulty} onNextChallenge={(nextD) => { onComplete(score, accuracyEarned); onDifficultyChange(nextD); setPhase('ready'); }} />

          <div style={{ color: '#10b981', fontSize: 14, fontWeight: 700, margin: '4px 0 24px' }}>+{accuracyEarned} Accuracy added to Leaderboard & History Log!</div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button onClick={() => { onComplete(score, accuracyEarned); onExit(); }} style={{ background: 'linear-gradient(135deg, #ec4899, #f472b6)', color: '#fff', border: 'none', padding: '12px 32px', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Collect XP & Exit</button>
            <button onClick={() => { onComplete(score, accuracyEarned); setPhase('ready'); }} style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '12px 32px', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Play Again</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ⚡ GAME 7: FLASH FUSION */
export function FlashFusionGame({ gameId, difficulty, onDifficultyChange, completedDifficulties, soundMuted, onComplete, onExit }: { gameId: GameId; difficulty: Difficulty; onDifficultyChange: (d: Difficulty) => void; completedDifficulties?: Record<string, Difficulty[]>; soundMuted: boolean; onComplete: (score: number, accuracyEarned: number) => void; onExit: () => void }) {
  const SYMBOLS = ['⚡', '🧠', '🎯', '🔥', '💎', '🌀'];
  const [phase, setPhase] = useState<'ready' | 'countdown' | 'playing' | 'done'>('ready');
  const [currentSymbol, setCurrentSymbol] = useState('⚡');
  const [prevSymbol, setPrevSymbol] = useState('');
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (phase !== 'playing') return;
    const speed = difficulty === 'hard' ? 800 : difficulty === 'normal' ? 1000 : 1300;
    const interval = setInterval(() => {
      setPrevSymbol(currentSymbol);
      const isRepeat = Math.random() < 0.35;
      const next = isRepeat ? currentSymbol : SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
      setCurrentSymbol(next);
    }, speed);
    return () => clearInterval(interval);
  }, [phase, currentSymbol, difficulty]);

  const handleTap = useCallback(() => {
    if (phase !== 'playing') return;
    if (currentSymbol === prevSymbol && prevSymbol !== '') {
      playSound('correct', soundMuted);
      setScore(s => s + 1);
    } else {
      playSound('wrong', soundMuted);
    }
  }, [phase, currentSymbol, prevSymbol, soundMuted]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        handleTap();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, currentSymbol, prevSymbol, soundMuted, handleTap]);

  const accuracyEarned = Math.min(100, score * 12);

  return (
    <div style={{ textAlign: 'center', animation: 'attFadeIn 0.3s ease', position: 'relative', width: '100%', maxWidth: 460 }}>
      {phase === 'countdown' && <CountdownOverlay soundMuted={soundMuted} onComplete={() => { setScore(0); setPhase('playing'); setTimeout(() => setPhase('done'), 20000); }} />}

      <button onClick={onExit} style={{ position: 'absolute', top: -10, right: 0, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '8px 18px', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>✕ Exit</button>

      {phase === 'ready' && (
        <div style={{ animation: 'attFadeIn 0.4s ease' }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>⚡</div>
          <h2 style={{ color: '#f0f0f0', fontSize: 28, fontWeight: 800, margin: '0 0 8px' }}>Flash Fusion</h2>
          <p style={{ color: '#aaa', fontSize: 14, margin: '0 0 12px', maxWidth: 420 }}>Tap ONLY when consecutive symbols match back-to-back!</p>

          <DifficultyPicker gameId={gameId} difficulty={difficulty} onChange={onDifficultyChange} completedDifficulties={completedDifficulties} />

          <button onClick={() => setPhase('countdown')} style={{ background: 'linear-gradient(135deg, #6366f1, #818cf8)', color: '#fff', border: 'none', padding: '14px 40px', borderRadius: 12, fontSize: 16, fontWeight: 800, cursor: 'pointer', letterSpacing: 1 }}>START STREAM</button>
        </div>
      )}

      {phase === 'playing' && (
        <div>
          <div style={{ color: '#6366f1', fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Matches: {score}</div>
          <div onClick={handleTap} style={{ width: 220, height: 220, margin: '0 auto', borderRadius: 24, background: 'rgba(255,255,255,0.06)', border: '2px solid #6366f1', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 80, animation: 'attReveal 0.2s ease', boxShadow: '0 0 30px rgba(99,102,241,0.3)' }}>
            {currentSymbol}
          </div>
          <p style={{ color: '#aaa', fontSize: 13, marginTop: 16 }}>Tap box on match!</p>
        </div>
      )}

      {phase === 'done' && (
        <div style={{ animation: 'attFadeIn 0.4s ease' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>⚡</div>
          <h2 style={{ color: '#f0f0f0', fontSize: 28, fontWeight: 800, margin: '0 0 8px' }}>Stream Complete!</h2>
          <div style={{ fontSize: 56, fontWeight: 900, color: '#6366f1', margin: '16px 0 4px' }}>{score} Matches</div>

          <CompletionBanner difficulty={difficulty} onNextChallenge={(nextD) => { onComplete(score, accuracyEarned); onDifficultyChange(nextD); setPhase('ready'); }} />

          <div style={{ color: '#10b981', fontSize: 14, fontWeight: 700, margin: '4px 0 24px' }}>+{accuracyEarned} Accuracy added to Leaderboard & History Log!</div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button onClick={() => { onComplete(score, accuracyEarned); onExit(); }} style={{ background: 'linear-gradient(135deg, #6366f1, #818cf8)', color: '#fff', border: 'none', padding: '12px 32px', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Collect XP & Exit</button>
            <button onClick={() => { onComplete(score, accuracyEarned); setPhase('ready'); }} style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '12px 32px', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Play Again</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* 🧩 GAME 8: SHAPE SHIFTER (WITH DUAL STIMULUS CARDS & STROOP CHOICE BUTTONS) */
export function ShapeShifterGame({ gameId, difficulty, onDifficultyChange, completedDifficulties, soundMuted, onComplete, onExit }: { gameId: GameId; difficulty: Difficulty; onDifficultyChange: (d: Difficulty) => void; completedDifficulties?: Record<string, Difficulty[]>; soundMuted: boolean; onComplete: (score: number, accuracyEarned: number) => void; onExit: () => void }) {
  const [phase, setPhase] = useState<'ready' | 'countdown' | 'playing' | 'done'>('ready');
  const [rule, setRule] = useState<'COLOR' | 'SHAPE'>('COLOR');
  const [cardA, setCardA] = useState({ color: '#ef4444', shape: '🔴' });
  const [cardB, setCardB] = useState({ color: '#ef4444', shape: '🔵' });
  const [score, setScore] = useState(0);

  const colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b'];
  const shapes = ['🔴', '🔵', '🟢', '🟡'];

  const spawnCards = useCallback(() => {
    const colorA = colors[Math.floor(Math.random() * colors.length)];
    const shapeA = shapes[Math.floor(Math.random() * shapes.length)];

    const isMatch = Math.random() < 0.5;
    let colorB = colorA;
    let shapeB = shapeA;

    if (!isMatch) {
      colorB = colors[Math.floor(Math.random() * colors.length)];
      shapeB = shapes[Math.floor(Math.random() * shapes.length)];
    }

    setCardA({ color: colorA, shape: shapeA });
    setCardB({ color: colorB, shape: shapeB });
  }, []);

  const flipRule = useCallback(() => {
    setRule(prev => prev === 'COLOR' ? 'SHAPE' : 'COLOR');
  }, []);

  useEffect(() => {
    if (phase !== 'playing') return;
    spawnCards();
    const interval = setInterval(flipRule, difficulty === 'hard' ? 2500 : 3500);
    return () => clearInterval(interval);
  }, [phase, flipRule, spawnCards, difficulty]);

  const handleChoice = useCallback((choice: 'MATCH' | 'DIFFER') => {
    if (phase !== 'playing') return;
    const isMatch = rule === 'COLOR' ? cardA.color === cardB.color : cardA.shape === cardB.shape;
    if ((choice === 'MATCH' && isMatch) || (choice === 'DIFFER' && !isMatch)) {
      playSound('correct', soundMuted);
      setScore(s => s + 1);
    } else {
      playSound('wrong', soundMuted);
    }
    spawnCards();
  }, [phase, rule, cardA, cardB, soundMuted, spawnCards]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (phase !== 'playing') return;
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') {
        e.preventDefault();
        handleChoice('MATCH');
      } else if (e.code === 'KeyD' || e.code === 'ArrowRight') {
        e.preventDefault();
        handleChoice('DIFFER');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, cardA, cardB, rule, soundMuted, handleChoice]);

  const accuracyEarned = Math.min(100, score * 10);

  return (
    <div style={{ textAlign: 'center', animation: 'attFadeIn 0.3s ease', position: 'relative', width: '100%', maxWidth: 460 }}>
      {phase === 'countdown' && <CountdownOverlay soundMuted={soundMuted} onComplete={() => { setScore(0); setPhase('playing'); setTimeout(() => setPhase('done'), 20000); }} />}

      <button onClick={onExit} style={{ position: 'absolute', top: -10, right: 0, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '8px 18px', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>✕ Exit</button>

      {phase === 'ready' && (
        <div style={{ animation: 'attFadeIn 0.4s ease' }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🧩</div>
          <h2 style={{ color: '#f0f0f0', fontSize: 28, fontWeight: 800, margin: '0 0 8px' }}>Shape Shifter</h2>
          <p style={{ color: '#aaa', fontSize: 14, margin: '0 0 12px', maxWidth: 420 }}>Adapt instantly as rules flip between MATCH COLOR and MATCH SHAPE!</p>

          <DifficultyPicker gameId={gameId} difficulty={difficulty} onChange={onDifficultyChange} completedDifficulties={completedDifficulties} />

          <button onClick={() => setPhase('countdown')} style={{ background: 'linear-gradient(135deg, #f59e0b, #fbbf24)', color: '#fff', border: 'none', padding: '14px 40px', borderRadius: 12, fontSize: 16, fontWeight: 800, cursor: 'pointer', letterSpacing: 1 }}>START SHIFTING</button>
        </div>
      )}

      {phase === 'playing' && (
        <div>
          <div style={{ background: rule === 'COLOR' ? 'rgba(59,130,246,0.2)' : 'rgba(245,158,11,0.2)', border: `2px solid ${rule === 'COLOR' ? '#3b82f6' : '#f59e0b'}`, color: rule === 'COLOR' ? '#60a5fa' : '#fbbf24', padding: '8px 20px', borderRadius: 20, fontSize: 16, fontWeight: 900, display: 'inline-block', marginBottom: 20 }}>
            CURRENT RULE: MATCH {rule}
          </div>

          {/* Dual Stimulus Cards */}
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginBottom: 24 }}>
            <div style={{ width: 110, height: 110, borderRadius: 16, background: 'rgba(255,255,255,0.06)', border: `3px solid ${cardA.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, boxShadow: `0 0 20px ${cardA.color}40` }}>
              {cardA.shape}
            </div>
            <div style={{ width: 110, height: 110, borderRadius: 16, background: 'rgba(255,255,255,0.06)', border: `3px solid ${cardB.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, boxShadow: `0 0 20px ${cardB.color}40` }}>
              {cardB.shape}
            </div>
          </div>

          {/* Choice Buttons */}
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center' }}>
            <button onClick={() => handleChoice('MATCH')} style={{ flex: 1, maxWidth: 160, background: 'linear-gradient(135deg, #10b981, #34d399)', color: '#fff', border: 'none', padding: '14px 20px', borderRadius: 12, fontSize: 16, fontWeight: 800, cursor: 'pointer', boxShadow: '0 0 16px rgba(16,185,129,0.3)' }}>
              MATCH ✓
            </button>
            <button onClick={() => handleChoice('DIFFER')} style={{ flex: 1, maxWidth: 160, background: 'linear-gradient(135deg, #ef4444, #f87171)', color: '#fff', border: 'none', padding: '14px 20px', borderRadius: 12, fontSize: 16, fontWeight: 800, cursor: 'pointer', boxShadow: '0 0 16px rgba(239,68,68,0.3)' }}>
              DIFFER ✕
            </button>
          </div>
        </div>
      )}

      {phase === 'done' && (
        <div style={{ animation: 'attFadeIn 0.4s ease' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🧩</div>
          <h2 style={{ color: '#f0f0f0', fontSize: 28, fontWeight: 800, margin: '0 0 8px' }}>Task Switching Complete!</h2>
          <div style={{ fontSize: 56, fontWeight: 900, color: '#f59e0b', margin: '16px 0 4px' }}>{score} Flips</div>

          <CompletionBanner difficulty={difficulty} onNextChallenge={(nextD) => { onComplete(score, accuracyEarned); onDifficultyChange(nextD); setPhase('ready'); }} />

          <div style={{ color: '#10b981', fontSize: 14, fontWeight: 700, margin: '4px 0 24px' }}>+{accuracyEarned} Accuracy added to Leaderboard & History Log!</div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button onClick={() => { onComplete(score, accuracyEarned); onExit(); }} style={{ background: 'linear-gradient(135deg, #f59e0b, #fbbf24)', color: '#fff', border: 'none', padding: '12px 32px', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Collect XP & Exit</button>
            <button onClick={() => { onComplete(score, accuracyEarned); setPhase('ready'); }} style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '12px 32px', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Play Again</button>
          </div>
        </div>
      )}
    </div>
  );
}
