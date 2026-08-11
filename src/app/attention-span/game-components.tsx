'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { GameId, Difficulty, playSound } from '@/components/attention-span/types';
import { DifficultyPicker, CompletionBanner } from '@/components/attention-span/DifficultyPicker';
import { CountdownOverlay } from '@/components/attention-span/CountdownOverlay';
import { OnScreenNumpad } from '@/components/attention-span/OnScreenNumpad';
import { GameShell } from '@/components/attention-span/GameShell';

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
    <GameShell
      accent="violet"
      mark="memory"
      title="Memory Matrix"
      description="Hold the lit tiles, then tap them back from memory."
      phase={phase === 'memorizing' || phase === 'input' ? 'playing' : phase}
      onExit={onExit}
      countdown={phase === 'countdown' ? <CountdownOverlay soundMuted={soundMuted} onComplete={() => startLevel(1)} /> : null}
      readyExtra={<DifficultyPicker gameId={gameId} difficulty={difficulty} onChange={onDifficultyChange} completedDifficulties={completedDifficulties} />}
      onStart={() => setPhase('countdown')}
      doneTitle="Pattern broken"
      doneScore={`Level ${finalLevel}`}
      doneHint="Highest complete matrix"
      doneExtra={<CompletionBanner difficulty={difficulty} onNextChallenge={(nextD) => { onComplete(finalLevel + 1, accuracyEarned); onDifficultyChange(nextD); setPhase('ready'); }} />}
      onClaim={() => { onComplete(finalLevel + 1, accuracyEarned); onExit(); }}
      onReplay={() => setPhase('ready')}
    >
      {(phase === 'memorizing' || phase === 'input') && (
        <>
          <div className="att-hud">
            <div className="att-hud-key"><span>Level</span><b>{level}</b></div>
            <div className="att-phase">{phase === 'memorizing' ? 'Watch' : 'Recall'}</div>
          </div>
          <div className="att-arena">
            <div className="att-board" style={{ gridTemplateColumns: `repeat(${gridSize}, 64px)` }}>
              {Array.from({ length: gridSize * gridSize }).map((_, i) => {
                const isPattern = activePattern.includes(i);
                const isSelected = userSelected.includes(i);
                const isWrong = wrongSelections.includes(i);
                const cls = [
                  'att-tile',
                  phase === 'memorizing' && isPattern ? 'is-target' : '',
                  isSelected ? 'is-good' : '',
                  isWrong ? 'is-bad' : '',
                ].filter(Boolean).join(' ');
                return (
                  <button key={i} type="button" className={cls} onClick={() => handleTileClick(i)} style={{ width: 64, height: 64, cursor: phase === 'input' ? 'pointer' : 'default' }} />
                );
              })}
            </div>
          </div>
        </>
      )}
    </GameShell>
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
    <GameShell
      accent="blue"
      mark="sequence"
      title="Sequence Snap"
      description="Watch the digits, then enter them in order on the pad."
      phase={phase === 'showing' || phase === 'input' ? 'playing' : phase}
      onExit={onExit}
      countdown={phase === 'countdown' ? <CountdownOverlay soundMuted={soundMuted} onComplete={() => { setMaxReached(0); startLevel(3); }} /> : null}
      readyExtra={<DifficultyPicker gameId={gameId} difficulty={difficulty} onChange={onDifficultyChange} completedDifficulties={completedDifficulties} />}
      onStart={() => setPhase('countdown')}
      doneTitle="Sequence ended"
      doneScore={`${maxReached} digits`}
      doneHint="Longest run recalled in order"
      doneExtra={<CompletionBanner difficulty={difficulty} onNextChallenge={(nextD) => { onComplete(maxReached, accuracyEarned); onDifficultyChange(nextD); setPhase('ready'); }} />}
      onClaim={() => { onComplete(maxReached, accuracyEarned); onExit(); }}
      onReplay={() => setPhase('ready')}
    >
      {phase === 'showing' && (
        <>
          <div className="att-hud">
            <div className="att-hud-key"><span>Length</span><b>{sequence.length}</b></div>
            <div className="att-phase">Watch</div>
          </div>
          <div className="att-seq">
            {sequence.map((n, i) => (
              <div key={i} className="att-chip is-ask">{n}</div>
            ))}
          </div>
        </>
      )}
      {phase === 'input' && (
        <>
          <p className="att-sub">Enter the sequence</p>
          <div className="att-chip" style={{ margin: '0 auto 16px', minWidth: 180, letterSpacing: 6 }}>
            {inputVal || '—'}
          </div>
          <OnScreenNumpad
            soundMuted={soundMuted}
            onPress={(digit) => setInputVal(prev => (prev.length < sequence.length ? prev + digit : prev))}
            onBackspace={() => setInputVal(prev => prev.slice(0, -1))}
            onSubmit={handleSubmit}
          />
        </>
      )}
    </GameShell>
  );
}

/* 🌀 GAME 5: VORTEX VISION */
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
    <GameShell
      accent="pink"
      mark="vortex"
      title="Vortex Vision"
      description="Track the gold mark in a slow orbit. Ignore the rest."
      phase={phase}
      onExit={onExit}
      countdown={phase === 'countdown' ? <CountdownOverlay soundMuted={soundMuted} onComplete={() => { setScore(0); spawnTarget(); setPhase('playing'); setTimeout(() => setPhase('done'), 20000); }} /> : null}
      readyExtra={<DifficultyPicker gameId={gameId} difficulty={difficulty} onChange={onDifficultyChange} completedDifficulties={completedDifficulties} />}
      onStart={() => setPhase('countdown')}
      doneTitle="Orbit closed"
      doneScore={`${score} hits`}
      doneExtra={<CompletionBanner difficulty={difficulty} onNextChallenge={(nextD) => { onComplete(score, accuracyEarned); onDifficultyChange(nextD); setPhase('ready'); }} />}
      onClaim={() => { onComplete(score, accuracyEarned); onExit(); }}
      onReplay={() => setPhase('ready')}
    >
      {phase === 'playing' && (
        <>
          <div className="att-hud">
            <div className="att-hud-key"><span>Hits</span><b>{score}</b></div>
          </div>
          <div className="att-well">
            <div className="att-orbit" style={{ position: 'absolute', inset: 0, transform: `rotate(${debrisAngle}deg)`, pointerEvents: 'none' }}>
              <span style={{ top: 40, left: 146 }} />
              <span style={{ top: 220, left: 80 }} />
              <span style={{ top: 176, left: 230 }} />
            </div>
            <button
              type="button"
              className="att-star"
              onClick={handleTargetClick}
              style={{
                left: 150 + targetPos.r * Math.cos((targetPos.a * Math.PI) / 180) - 14,
                top: 150 + targetPos.r * Math.sin((targetPos.a * Math.PI) / 180) - 14,
              }}
              aria-label="Target"
            />
          </div>
        </>
      )}
    </GameShell>
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
    <GameShell
      accent="indigo"
      mark="flash"
      title="Flash Fusion"
      description="Tap only when the current symbol matches the last one."
      phase={phase}
      onExit={onExit}
      countdown={phase === 'countdown' ? <CountdownOverlay soundMuted={soundMuted} onComplete={() => { setScore(0); setPhase('playing'); setTimeout(() => setPhase('done'), 20000); }} /> : null}
      readyExtra={<DifficultyPicker gameId={gameId} difficulty={difficulty} onChange={onDifficultyChange} completedDifficulties={completedDifficulties} />}
      onStart={() => setPhase('countdown')}
      doneTitle="Stream closed"
      doneScore={`${score} matches`}
      doneExtra={<CompletionBanner difficulty={difficulty} onNextChallenge={(nextD) => { onComplete(score, accuracyEarned); onDifficultyChange(nextD); setPhase('ready'); }} />}
      onClaim={() => { onComplete(score, accuracyEarned); onExit(); }}
      onReplay={() => setPhase('ready')}
    >
      {phase === 'playing' && (
        <>
          <div className="att-hud">
            <div className="att-hud-key"><span>Matches</span><b>{score}</b></div>
            <div className="att-phase">Space</div>
          </div>
          <button type="button" className="att-flash" onClick={handleTap}>{currentSymbol}</button>
          <p className="att-sub" style={{ marginTop: 14 }}>Tap on a repeat</p>
        </>
      )}
    </GameShell>
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
    <GameShell
      accent="amber"
      mark="shape"
      title="Shape Shifter"
      description="The rule flips between color and shape. Switch with it."
      phase={phase}
      onExit={onExit}
      countdown={phase === 'countdown' ? <CountdownOverlay soundMuted={soundMuted} onComplete={() => { setScore(0); setPhase('playing'); setTimeout(() => setPhase('done'), 20000); }} /> : null}
      readyExtra={<DifficultyPicker gameId={gameId} difficulty={difficulty} onChange={onDifficultyChange} completedDifficulties={completedDifficulties} />}
      onStart={() => setPhase('countdown')}
      doneTitle="Switching closed"
      doneScore={`${score} flips`}
      doneExtra={<CompletionBanner difficulty={difficulty} onNextChallenge={(nextD) => { onComplete(score, accuracyEarned); onDifficultyChange(nextD); setPhase('ready'); }} />}
      onClaim={() => { onComplete(score, accuracyEarned); onExit(); }}
      onReplay={() => setPhase('ready')}
    >
      {phase === 'playing' && (
        <>
          <div className="att-phase" style={{ marginBottom: 16 }}>Match {rule.toLowerCase()}</div>
          <div className="att-pair">
            {[cardA, cardB].map((card, i) => {
              const form =
                card.shape === '🔵' ? { borderRadius: 4 } :
                card.shape === '🟢' ? { clipPath: 'polygon(50% 0, 100% 100%, 0 100%)', borderRadius: 0 } :
                card.shape === '🟡' ? { clipPath: 'polygon(50% 0, 100% 50%, 50% 100%, 0 50%)', borderRadius: 0 } :
                { borderRadius: '50%' };
              return (
                <div key={i} className="att-face-card" style={{ borderColor: card.color, color: card.color }}>
                  <i style={form} />
                </div>
              );
            })}
          </div>
          <div className="att-actions">
            <button type="button" className="att-btn att-btn-primary" onClick={() => handleChoice('MATCH')}>Same</button>
            <button type="button" className="att-btn att-btn-ghost" onClick={() => handleChoice('DIFFER')}>Different</button>
          </div>
        </>
      )}
    </GameShell>
  );
}
