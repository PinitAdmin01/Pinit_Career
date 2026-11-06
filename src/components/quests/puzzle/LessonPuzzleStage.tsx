'use client';

import React, { useState, useEffect, useMemo } from 'react';
import type { LessonPuzzleSpec, PuzzleBlock } from '@/lib/puzzles/lessonPuzzleEngine';

interface LessonPuzzleStageProps {
  puzzle: LessonPuzzleSpec;
  teacherAccent?: string;
  onPuzzleSolved: () => void;
  playChime: () => void;
  launchConfetti: () => void;
}

type ReaderMode = 'guided' | 'fast';
type CameraPreset = 'isometric' | 'top' | 'front';

export function LessonPuzzleStage({
  puzzle,
  teacherAccent = 'var(--accent)',
  onPuzzleSolved,
  playChime,
  launchConfetti,
}: LessonPuzzleStageProps) {
  const [placedOrder, setPlacedOrder] = useState<string[]>([]);
  const [availableBlocks, setAvailableBlocks] = useState<PuzzleBlock[]>([]);
  const [isEvaluated, setIsEvaluated] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [readerMode, setReaderMode] = useState<ReaderMode>('guided');
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('isometric');
  const [rotX, setRotX] = useState<number>(28);
  const [rotZ, setRotZ] = useState<number>(-14);
  const [inspectedBlockId, setInspectedBlockId] = useState<string | null>(null);

  useEffect(() => {
    const scrambled = [...puzzle.blocks].sort((a, b) => {
      const hashA = a.id.split('').reduce((acc, c, idx) => acc + c.charCodeAt(0) * (idx + 1), 0);
      const hashB = b.id.split('').reduce((acc, c, idx) => acc + c.charCodeAt(0) * (idx + 1), 0);
      return hashB - hashA;
    });
    setAvailableBlocks(scrambled);
    setPlacedOrder([]);
    setIsEvaluated(false);
    setIsSuccess(false);
    setErrorMessage(null);
    setInspectedBlockId(scrambled[0]?.id || null);
  }, [puzzle]);

  const applyCameraPreset = (preset: CameraPreset) => {
    setCameraPreset(preset);
    if (preset === 'isometric') {
      setRotX(28);
      setRotZ(-14);
    } else if (preset === 'top') {
      setRotX(52);
      setRotZ(0);
    } else {
      setRotX(8);
      setRotZ(0);
    }
  };

  const handleSelectAvailable = (blockId: string) => {
    if (isSuccess) return;
    setAvailableBlocks((prev) => prev.filter((b) => b.id !== blockId));
    setPlacedOrder((prev) => [...prev, blockId]);
    setInspectedBlockId(blockId);
    setIsEvaluated(false);
    setErrorMessage(null);
  };

  const handleRemovePlaced = (blockId: string) => {
    if (isSuccess) return;
    const block = puzzle.blocks.find((b) => b.id === blockId);
    if (!block) return;
    setPlacedOrder((prev) => prev.filter((id) => id !== blockId));
    setAvailableBlocks((prev) => [...prev, block]);
    setInspectedBlockId(blockId);
    setIsEvaluated(false);
    setErrorMessage(null);
  };

  const handleMoveUp = (index: number) => {
    if (isSuccess || index === 0) return;
    setPlacedOrder((prev) => {
      const copy = [...prev];
      const temp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
    setIsEvaluated(false);
    setErrorMessage(null);
  };

  const handleMoveDown = (index: number) => {
    if (isSuccess || index === placedOrder.length - 1) return;
    setPlacedOrder((prev) => {
      const copy = [...prev];
      const temp = copy[index + 1];
      copy[index + 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
    setIsEvaluated(false);
    setErrorMessage(null);
  };

  const handleSnapNextGuidedStep = () => {
    if (isSuccess) return;
    // Find the first slot in puzzle.correctOrder that isn't correctly placed yet
    for (let i = 0; i < puzzle.correctOrder.length; i++) {
      const targetId = puzzle.correctOrder[i];
      if (placedOrder[i] !== targetId) {
        const prefixOrder = puzzle.correctOrder.slice(0, i + 1);
        const remaining = puzzle.blocks.filter((b) => !prefixOrder.includes(b.id));
        setPlacedOrder(prefixOrder);
        setAvailableBlocks(remaining);
        setInspectedBlockId(targetId);
        setIsEvaluated(false);
        setErrorMessage(null);
        return;
      }
    }
  };

  const handleTestSolution = () => {
    setIsEvaluated(true);

    if (puzzle.decoyBlockIds && puzzle.decoyBlockIds.length > 0) {
      const placedDecoyId = placedOrder.find((id) => puzzle.decoyBlockIds?.includes(id));
      if (placedDecoyId) {
        const decoyBlock = puzzle.blocks.find((b) => b.id === placedDecoyId);
        setErrorMessage(
          `Decoy Trap Triggered: "${decoyBlock?.label || 'This block'}" is an anti-pattern! Click it to remove it from the 3D pipeline.`
        );
        setIsSuccess(false);
        setInspectedBlockId(placedDecoyId);
        return;
      }
    }

    if (placedOrder.length !== puzzle.correctOrder.length) {
      setErrorMessage(
        `Incomplete 3D Pipeline: You snapped ${placedOrder.length} cubes, but this architecture requires all ${puzzle.correctOrder.length} valid stages.`
      );
      setIsSuccess(false);
      return;
    }

    const isMatch = placedOrder.every((id, idx) => id === puzzle.correctOrder[idx]);

    if (isMatch) {
      setIsSuccess(true);
      setErrorMessage(null);
      playChime();
      launchConfetti();
    } else {
      setIsSuccess(false);
      const mismatchIdx = placedOrder.findIndex((id, idx) => id !== puzzle.correctOrder[idx]);
      const wrongId = placedOrder[mismatchIdx];
      if (wrongId) setInspectedBlockId(wrongId);
      setErrorMessage(
        `3D Conduit Misalignment at Node ${mismatchIdx + 1}: The cube in Slot ${mismatchIdx + 1} is out of chronological order. Use ↑/↓ or "Snap Next Guided Cube" to align.`
      );
    }
  };

  const getColorStyle = (color: PuzzleBlock['color']) => {
    switch (color) {
      case 'emerald':
        return { border: '#10b981', bg: 'rgba(16, 185, 129, 0.16)', side: 'rgba(5, 150, 105, 0.45)', text: '#34d399', glow: 'rgba(16, 185, 129, 0.35)' };
      case 'cyan':
        return { border: '#06b6d4', bg: 'rgba(6, 182, 212, 0.16)', side: 'rgba(8, 145, 178, 0.45)', text: '#22d3ee', glow: 'rgba(6, 182, 212, 0.35)' };
      case 'amber':
        return { border: '#f59e0b', bg: 'rgba(245, 158, 11, 0.16)', side: 'rgba(217, 119, 6, 0.45)', text: '#fbbf24', glow: 'rgba(245, 158, 11, 0.35)' };
      case 'purple':
        return { border: '#a855f7', bg: 'rgba(168, 85, 247, 0.16)', side: 'rgba(126, 34, 206, 0.45)', text: '#c084fc', glow: 'rgba(168, 85, 247, 0.35)' };
      case 'rose':
        return { border: '#f43f5e', bg: 'rgba(244, 63, 94, 0.16)', side: 'rgba(190, 18, 60, 0.45)', text: '#fb7185', glow: 'rgba(244, 63, 94, 0.35)' };
      case 'indigo':
        return { border: '#6366f1', bg: 'rgba(99, 102, 241, 0.16)', side: 'rgba(67, 56, 202, 0.45)', text: '#818cf8', glow: 'rgba(99, 102, 241, 0.35)' };
      default:
        return { border: '#3b82f6', bg: 'rgba(59, 130, 246, 0.16)', side: 'rgba(29, 78, 216, 0.45)', text: '#60a5fa', glow: 'rgba(59, 130, 246, 0.35)' };
    }
  };

  const inspectedBlock = useMemo(
    () => puzzle.blocks.find((b) => b.id === inspectedBlockId) || puzzle.blocks[0] || null,
    [puzzle.blocks, inspectedBlockId]
  );

  return (
    <div
      data-testid="lesson-puzzle-stage"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        padding: '18px 20px',
        background: 'linear-gradient(145deg, rgba(9, 14, 28, 0.98), rgba(15, 23, 42, 0.96))',
        borderRadius: 18,
        border: '1.5px solid rgba(56, 189, 248, 0.32)',
        boxShadow: '0 14px 40px rgba(0,0,0,0.5)',
        color: '#f8fafc',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient 3D Grid Backdrop */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(56, 189, 248, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(56, 189, 248, 0.05) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          pointerEvents: 'none',
        }}
      />

      {/* Top Header & Slow/Fast Reader Mode Switcher */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: 12,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div style={{ flex: 1, minWidth: 260 }}>
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 18 }}>🧊</span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.9px',
                color: '#38bdf8',
                background: 'rgba(56, 189, 248, 0.12)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                padding: '2px 8px',
                borderRadius: 6,
              }}
            >
              Interactive 3D Lesson Architecture Puzzle
            </span>
            <span
              style={{
                fontSize: 10.5,
                fontWeight: 800,
                textTransform: 'uppercase',
                color: '#cbd5e1',
                background: 'rgba(255,255,255,0.06)',
                padding: '2px 8px',
                borderRadius: 6,
              }}
            >
              Domain: {puzzle.domain}
            </span>
            {puzzle.projectConnection && (
              <span
                style={{
                  fontSize: 10.5,
                  fontWeight: 800,
                  color: '#34d399',
                  background: 'rgba(16, 185, 129, 0.12)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  padding: '2px 8px',
                  borderRadius: 6,
                }}
              >
                🚀 {puzzle.projectConnection}
              </span>
            )}
          </div>

          <h3 style={{ fontSize: 17.5, fontWeight: 900, margin: 0, color: '#ffffff' }}>{puzzle.title}</h3>
          <p style={{ fontSize: 13, color: '#94a3b8', margin: '4px 0 0 0', lineHeight: 1.5 }}>{puzzle.missionPrompt}</p>
        </div>

        {/* Reader Speed Mode Toggle + Hint */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <div
            role="group"
            aria-label="Reader Pacing Mode"
            style={{
              display: 'inline-flex',
              background: 'rgba(15, 23, 42, 0.9)',
              border: '1px solid rgba(255,255,255,0.14)',
              borderRadius: 10,
              padding: 3,
              gap: 4,
            }}
          >
            <button
              type="button"
              data-testid="puzzle-mode-guided"
              onClick={() => setReaderMode('guided')}
              style={{
                background: readerMode === 'guided' ? 'rgba(16, 185, 129, 0.22)' : 'transparent',
                border: readerMode === 'guided' ? '1px solid #10b981' : '1px solid transparent',
                color: readerMode === 'guided' ? '#34d399' : '#94a3b8',
                borderRadius: 7,
                padding: '5px 10px',
                fontSize: 11.5,
                fontWeight: 800,
                cursor: 'pointer',
              }}
              title="Best for methodical & slow readers: shows real-world analogies, plain-language explanations, and step-by-step guidance"
            >
              🐢 Guided Mode (Slow Readers)
            </button>
            <button
              type="button"
              data-testid="puzzle-mode-fast"
              onClick={() => setReaderMode('fast')}
              style={{
                background: readerMode === 'fast' ? 'rgba(56, 189, 248, 0.22)' : 'transparent',
                border: readerMode === 'fast' ? '1px solid #38bdf8' : '1px solid transparent',
                color: readerMode === 'fast' ? '#38bdf8' : '#94a3b8',
                borderRadius: 7,
                padding: '5px 10px',
                fontSize: 11.5,
                fontWeight: 800,
                cursor: 'pointer',
              }}
              title="Best for fast readers: shows compact code signatures and rapid pipeline assembly"
            >
              ⚡ Fast-Track (Fast Readers)
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowHint((prev) => !prev)}
            style={{
              background: showHint ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.06)',
              border: `1px solid ${showHint ? '#f59e0b' : 'rgba(255,255,255,0.15)'}`,
              color: showHint ? '#fbbf24' : '#cbd5e1',
              borderRadius: 8,
              padding: '6px 12px',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            💡 {showHint ? 'Hide Hint' : 'Hint'}
          </button>
        </div>
      </div>

      {showHint && (
        <div
          style={{
            padding: '10px 14px',
            borderRadius: 10,
            background: 'rgba(245, 158, 11, 0.12)',
            border: '1px solid rgba(245, 158, 11, 0.35)',
            color: '#fbbf24',
            fontSize: 12.5,
            lineHeight: 1.5,
            position: 'relative',
            zIndex: 1,
          }}
        >
          <strong>🧭 Architectural Hint:</strong> {puzzle.hint}
        </div>
      )}

      {/* ===================================================================== */}
      {/* 🧊 INTERACTIVE 3D SPATIAL PIPELINE VIEWPORT                           */}
      {/* ===================================================================== */}
      <div
        data-testid="puzzle-3d-viewport"
        style={{
          position: 'relative',
          zIndex: 1,
          borderRadius: 14,
          background: 'radial-gradient(circle at 50% 35%, rgba(30, 58, 138, 0.32), rgba(2, 6, 23, 0.92))',
          border: isSuccess
            ? '1.5px solid #10b981'
            : isEvaluated && errorMessage
            ? '1.5px solid #ef4444'
            : '1px solid rgba(56, 189, 248, 0.28)',
          padding: '12px 16px 18px 16px',
          boxShadow: isSuccess
            ? 'inset 0 0 32px rgba(16, 185, 129, 0.2)'
            : 'inset 0 0 28px rgba(15, 23, 42, 0.85)',
        }}
      >
        {/* 3D Camera Controls Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 8,
            marginBottom: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#38bdf8' }}>
              🎥 3D Spatial Stage ({placedOrder.length}/{puzzle.correctOrder.length} Nodes Active)
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            {(['isometric', 'top', 'front'] as CameraPreset[]).map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => applyCameraPreset(preset)}
                style={{
                  background: cameraPreset === preset ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${cameraPreset === preset ? '#38bdf8' : 'rgba(255,255,255,0.12)'}`,
                  color: cameraPreset === preset ? '#38bdf8' : '#94a3b8',
                  borderRadius: 6,
                  padding: '3px 8px',
                  fontSize: 10.5,
                  fontWeight: 800,
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                }}
              >
                {preset === 'isometric' ? '📐 3D Isometric' : preset === 'top' ? '🗺️ Top Blueprint' : '🏛️ Front View'}
              </button>
            ))}

            <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10.5, color: '#94a3b8' }}>
              Tilt
              <input
                type="range"
                min={0}
                max={55}
                value={rotX}
                onChange={(e) => setRotX(Number(e.target.value))}
                style={{ width: 58, accentColor: '#38bdf8', cursor: 'pointer' }}
              />
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10.5, color: '#94a3b8' }}>
              Orbit
              <input
                type="range"
                min={-30}
                max={30}
                value={rotZ}
                onChange={(e) => setRotZ(Number(e.target.value))}
                style={{ width: 58, accentColor: '#38bdf8', cursor: 'pointer' }}
              />
            </label>
          </div>
        </div>

        {/* 3D Perspective Stage */}
        <div
          style={{
            perspective: '1100px',
            padding: '18px 8px 14px 8px',
            overflowX: 'auto',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 10,
              minWidth: 620,
              transform: `rotateX(${rotX}deg) rotateZ(${rotZ * 0.35}deg)`,
              transformStyle: 'preserve-3d',
              transition: 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
              padding: '14px 16px',
              borderRadius: 14,
              background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.85), rgba(2, 6, 23, 0.95))',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              boxShadow: '0 22px 34px rgba(0, 0, 0, 0.65), 0 6px 0 rgba(30, 41, 59, 0.95)',
            }}
          >
            {puzzle.correctOrder.map((_, slotIdx) => {
              const placedId = placedOrder[slotIdx];
              const block = placedId ? puzzle.blocks.find((b) => b.id === placedId) : null;
              const isDecoy = block && puzzle.decoyBlockIds?.includes(block.id);
              const cStyle = block ? getColorStyle(block.color) : null;
              const isInspected = block && block.id === inspectedBlock?.id;

              return (
                <React.Fragment key={slotIdx}>
                  {/* 3D Volumetric Cube / Slot Pedestal */}
                  <div
                    onClick={() => {
                      if (block) setInspectedBlockId(block.id);
                    }}
                    onDoubleClick={() => {
                      if (block) handleRemovePlaced(block.id);
                    }}
                    title={
                      block
                        ? `${block.label} — Click to inspect in 3D drawer, double-click to remove`
                        : `Empty 3D Slot ${slotIdx + 1} — Click a cube below to snap here`
                    }
                    style={{
                      flex: 1,
                      minWidth: 105,
                      minHeight: 92,
                      padding: '10px 10px',
                      borderRadius: 12,
                      cursor: block ? 'pointer' : 'default',
                      position: 'relative',
                      transform: block ? 'translateY(-8px) translateZ(18px)' : 'translateZ(0px)',
                      transition: 'all 0.28s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      background: block
                        ? `linear-gradient(145deg, ${cStyle!.bg}, rgba(15, 23, 42, 0.92))`
                        : 'rgba(15, 23, 42, 0.5)',
                      border: block
                        ? `2px solid ${isInspected ? '#ffffff' : cStyle!.border}`
                        : '1.5px dashed rgba(148, 163, 184, 0.35)',
                      boxShadow: block
                        ? `0 10px 0 ${cStyle!.side}, 0 16px 24px ${cStyle!.glow}`
                        : 'inset 0 2px 10px rgba(0,0,0,0.5)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: 6,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 4 }}>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 900,
                          padding: '2px 6px',
                          borderRadius: 5,
                          background: block ? cStyle!.border : 'rgba(148, 163, 184, 0.18)',
                          color: block ? '#020617' : '#94a3b8',
                        }}
                      >
                        NODE {slotIdx + 1}
                      </span>
                      {block?.badge && (
                        <span
                          style={{
                            fontSize: 9,
                            fontWeight: 900,
                            padding: '1px 5px',
                            borderRadius: 4,
                            background: 'rgba(255,255,255,0.08)',
                            color: cStyle!.text,
                            border: `1px solid ${cStyle!.border}`,
                          }}
                        >
                          {block.badge}
                        </span>
                      )}
                    </div>

                    {block ? (
                      <div>
                        <div
                          style={{
                            fontSize: 11.5,
                            fontWeight: 800,
                            color: '#ffffff',
                            lineHeight: 1.3,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {block.label.replace(/^\d+\.\s*/, '')}
                        </div>
                        <div
                          style={{
                            fontSize: 10,
                            color: isDecoy ? '#fda4af' : '#94a3b8',
                            marginTop: 3,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            fontFamily: 'var(--font-mono)',
                          }}
                        >
                          {block.subtext}
                        </div>
                      </div>
                    ) : (
                      <div style={{ textAlign: 'center', padding: '12px 0', color: '#64748b', fontSize: 11, fontWeight: 700 }}>
                        ⬡ Awaiting Cube
                      </div>
                    )}
                  </div>

                  {/* 3D Conduit Energy Connector */}
                  {slotIdx < puzzle.correctOrder.length - 1 && (
                    <div
                      style={{
                        width: 24,
                        height: 6,
                        borderRadius: 999,
                        background:
                          isSuccess
                            ? 'linear-gradient(90deg, #10b981, #34d399)'
                            : placedOrder[slotIdx] && placedOrder[slotIdx + 1]
                            ? 'linear-gradient(90deg, #38bdf8, #818cf8)'
                            : 'rgba(148, 163, 184, 0.2)',
                        boxShadow:
                          isSuccess
                            ? '0 0 12px #10b981'
                            : placedOrder[slotIdx] && placedOrder[slotIdx + 1]
                            ? '0 0 10px rgba(56, 189, 248, 0.5)'
                            : 'none',
                        flexShrink: 0,
                      }}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Selected 3D Cube Inspector (Tailored to Slow Reader vs Fast Reader Mode) */}
        {inspectedBlock && (
          <div
            data-testid="puzzle-3d-inspector"
            style={{
              marginTop: 10,
              padding: '10px 14px',
              borderRadius: 10,
              background: 'rgba(15, 23, 42, 0.85)',
              border: '1px solid rgba(255,255,255,0.12)',
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 900, color: '#38bdf8' }}>
                  🔍 3D Cube Inspector: {inspectedBlock.label}
                </span>
                {inspectedBlock.badge && (
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      padding: '1px 6px',
                      borderRadius: 4,
                      background: 'rgba(56, 189, 248, 0.14)',
                      color: '#38bdf8',
                    }}
                  >
                    {inspectedBlock.badge}
                  </span>
                )}
              </div>

              {!isSuccess && (
                <button
                  type="button"
                  data-testid="btn-snap-guided-cube"
                  onClick={handleSnapNextGuidedStep}
                  style={{
                    background: 'rgba(16, 185, 129, 0.16)',
                    border: '1px solid rgba(16, 185, 129, 0.4)',
                    color: '#34d399',
                    borderRadius: 6,
                    padding: '3px 10px',
                    fontSize: 11,
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                  title="Snap the next chronological cube into the 3D pipeline"
                >
                  ✨ Snap Next Guided Cube
                </button>
              )}
            </div>

            {readerMode === 'guided' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12.5, lineHeight: 1.5, color: '#e2e8f0' }}>
                {inspectedBlock.analogy && (
                  <div>
                    <strong style={{ color: '#38bdf8' }}>🌍 Everyday Analogy:</strong> {inspectedBlock.analogy}
                  </div>
                )}
                {inspectedBlock.explanation && (
                  <div>
                    <strong style={{ color: '#34d399' }}>📖 Why This Matters:</strong> {inspectedBlock.explanation}
                  </div>
                )}
                {!inspectedBlock.analogy && !inspectedBlock.explanation && (
                  <div>
                    <strong style={{ color: '#34d399' }}>📖 Stage Summary:</strong> {inspectedBlock.subtext}
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ fontSize: 12, color: '#cbd5e1', fontFamily: 'var(--font-mono)' }}>
                  <strong style={{ color: '#38bdf8' }}>⚡ Signature:</strong> {inspectedBlock.subtext}
                </div>
                {inspectedBlock.codeSnippet && (
                  <pre
                    style={{
                      margin: 0,
                      padding: '8px 10px',
                      borderRadius: 8,
                      background: 'rgba(2, 6, 23, 0.9)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: '#38bdf8',
                      fontSize: 11.5,
                      fontFamily: 'var(--font-mono)',
                      overflowX: 'auto',
                    }}
                  >
                    <code>{inspectedBlock.codeSnippet}</code>
                  </pre>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ===================================================================== */}
      {/* 2-COLUMN TACTILE ASSEMBLY WORKBENCH                                   */}
      {/* ===================================================================== */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, position: 'relative', zIndex: 1 }}>
        {/* Left Column: Solution Pipeline Slot Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#38bdf8' }}>
              🎯 Target Assembly ({placedOrder.length} / {puzzle.correctOrder.length} Placed)
            </span>
            {placedOrder.length > 0 && !isSuccess && (
              <button
                type="button"
                onClick={() => {
                  setAvailableBlocks(puzzle.blocks);
                  setPlacedOrder([]);
                  setIsEvaluated(false);
                  setErrorMessage(null);
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  fontSize: 11,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                Reset Pipeline
              </button>
            )}
          </div>

          <div
            style={{
              minHeight: 220,
              padding: 10,
              background: 'rgba(15, 23, 42, 0.6)',
              borderRadius: 12,
              border: isSuccess
                ? '2px solid #10b981'
                : isEvaluated && errorMessage
                ? '2px solid #ef4444'
                : '1.5px dashed rgba(255,255,255,0.2)',
              boxShadow: isSuccess ? '0 0 20px rgba(16, 185, 129, 0.3)' : undefined,
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              transition: 'all 0.3s ease',
            }}
          >
            {placedOrder.length === 0 ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 200,
                  color: '#64748b',
                  textAlign: 'center',
                  gap: 6,
                }}
              >
                <span style={{ fontSize: 24, opacity: 0.6 }}>🧊</span>
                <span style={{ fontSize: 12.5, fontWeight: 600 }}>
                  Click cubes on the right to snap them into the 3D architecture pipeline
                </span>
              </div>
            ) : (
              placedOrder.map((blockId, idx) => {
                const block = puzzle.blocks.find((b) => b.id === blockId);
                if (!block) return null;
                const cStyle = getColorStyle(block.color);
                return (
                  <div
                    key={block.id}
                    onMouseEnter={() => setInspectedBlockId(block.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      borderRadius: 10,
                      background: cStyle.bg,
                      border: `1.5px solid ${cStyle.border}`,
                      boxShadow: `0 4px 12px ${cStyle.glow}`,
                      transform: 'translateY(-1px)',
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, flex: 1 }}>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 900,
                          background: cStyle.border,
                          color: '#0f172a',
                          width: 22,
                          height: 22,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {idx + 1}
                      </span>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span
                            style={{
                              fontSize: 12.5,
                              fontWeight: 800,
                              color: '#ffffff',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {block.label}
                          </span>
                          {block.badge && (
                            <span
                              style={{
                                fontSize: 9.5,
                                fontWeight: 900,
                                padding: '1px 6px',
                                borderRadius: 4,
                                background: 'rgba(0,0,0,0.35)',
                                color: cStyle.text,
                                border: `1px solid ${cStyle.border}`,
                                flexShrink: 0,
                              }}
                            >
                              {block.badge}
                            </span>
                          )}
                        </div>
                        {block.subtext && (
                          <div
                            style={{
                              fontSize: 11.5,
                              color: '#cbd5e1',
                              fontFamily: 'var(--font-mono)',
                              marginTop: 2,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {block.subtext}
                          </div>
                        )}
                      </div>
                    </div>

                    {!isSuccess && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 8 }}>
                        <button
                          type="button"
                          onClick={() => handleMoveUp(idx)}
                          disabled={idx === 0}
                          title="Move Up"
                          style={{
                            background: 'rgba(255,255,255,0.08)',
                            border: 'none',
                            color: idx === 0 ? '#475569' : '#f8fafc',
                            borderRadius: 6,
                            width: 24,
                            height: 24,
                            cursor: idx === 0 ? 'not-allowed' : 'pointer',
                            fontSize: 11,
                          }}
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveDown(idx)}
                          disabled={idx === placedOrder.length - 1}
                          title="Move Down"
                          style={{
                            background: 'rgba(255,255,255,0.08)',
                            border: 'none',
                            color: idx === placedOrder.length - 1 ? '#475569' : '#f8fafc',
                            borderRadius: 6,
                            width: 24,
                            height: 24,
                            cursor: idx === placedOrder.length - 1 ? 'not-allowed' : 'pointer',
                            fontSize: 11,
                          }}
                        >
                          ↓
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemovePlaced(block.id)}
                          title="Remove Block"
                          style={{
                            background: 'rgba(239, 68, 68, 0.2)',
                            border: '1px solid rgba(239, 68, 68, 0.4)',
                            color: '#fca5a5',
                            borderRadius: 6,
                            width: 24,
                            height: 24,
                            cursor: 'pointer',
                            fontSize: 11,
                            fontWeight: 800,
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Available Unplaced Blocks Inventory */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#94a3b8' }}>
            📦 Available 3D Cubes ({availableBlocks.length} Remaining)
          </span>

          <div
            style={{
              minHeight: 220,
              padding: 10,
              background: 'rgba(15, 23, 42, 0.4)',
              borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            {availableBlocks.length === 0 ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 200,
                  color: '#64748b',
                  textAlign: 'center',
                }}
              >
                <span style={{ fontSize: 12.5 }}>All cubes placed! Click &ldquo;Verify &amp; Execute 3D Pipeline&rdquo; below.</span>
              </div>
            ) : (
              availableBlocks.map((block) => {
                const cStyle = getColorStyle(block.color);
                return (
                  <button
                    key={block.id}
                    type="button"
                    onMouseEnter={() => setInspectedBlockId(block.id)}
                    onClick={() => handleSelectAvailable(block.id)}
                    disabled={isSuccess}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      borderRadius: 10,
                      background: 'rgba(30, 41, 59, 0.8)',
                      border: `1.5px solid ${cStyle.border}`,
                      color: '#f8fafc',
                      cursor: isSuccess ? 'default' : 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 12.5, fontWeight: 800, color: cStyle.text }}>{block.label}</span>
                        {block.badge && (
                          <span
                            style={{
                              fontSize: 9.5,
                              fontWeight: 900,
                              padding: '1px 6px',
                              borderRadius: 4,
                              background: 'rgba(255,255,255,0.06)',
                              color: cStyle.text,
                              border: `1px solid ${cStyle.border}`,
                            }}
                          >
                            {block.badge}
                          </span>
                        )}
                      </div>
                      {block.subtext && (
                        <div
                          style={{
                            fontSize: 11.5,
                            color: '#94a3b8',
                            fontFamily: 'var(--font-mono)',
                            marginTop: 2,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {block.subtext}
                        </div>
                      )}
                      {readerMode === 'guided' && block.analogy && (
                        <div
                          style={{
                            fontSize: 11,
                            color: '#38bdf8',
                            marginTop: 3,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          🌍 {block.analogy}
                        </div>
                      )}
                    </div>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 800,
                        color: cStyle.text,
                        marginLeft: 8,
                        background: 'rgba(255,255,255,0.05)',
                        padding: '4px 8px',
                        borderRadius: 6,
                      }}
                    >
                      + Snap 3D
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Evaluation Feedback & Action Bar */}
      {isEvaluated && errorMessage && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: 10,
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid #ef4444',
            color: '#fca5a5',
            fontSize: 13,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            position: 'relative',
            zIndex: 1,
          }}
        >
          <span>⚠️</span>
          <span>{errorMessage}</span>
        </div>
      )}

      {isSuccess && (
        <div
          style={{
            padding: '14px 16px',
            borderRadius: 12,
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1.5px solid #10b981',
            color: '#6ee7b7',
            fontSize: 13.5,
            fontWeight: 700,
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            position: 'relative',
            zIndex: 1,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#34d399', fontSize: 14, fontWeight: 900 }}>
            🎉 3D Architecture Verified!
          </div>
          <div style={{ color: '#d1fae5', fontWeight: 500, fontSize: 12.5 }}>{puzzle.successExplanation}</div>
        </div>
      )}

      {/* Footer CTA */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 12, position: 'relative', zIndex: 1 }}>
        {!isSuccess ? (
          <button
            type="button"
            data-testid="btn-verify-puzzle"
            onClick={handleTestSolution}
            style={{
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              border: 'none',
              color: '#ffffff',
              padding: '10px 20px',
              borderRadius: 10,
              fontSize: 13.5,
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            ⚡ Verify &amp; Execute 3D Pipeline
          </button>
        ) : (
          <button
            type="button"
            data-testid="btn-complete-puzzle"
            onClick={onPuzzleSolved}
            style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              border: 'none',
              color: '#ffffff',
              padding: '10px 24px',
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 900,
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            Proceed to 60s Rapid-Fire Battle ➔
          </button>
        )}
      </div>
    </div>
  );
}
