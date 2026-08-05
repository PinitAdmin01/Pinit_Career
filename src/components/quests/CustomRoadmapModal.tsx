'use client';

import React, { useState } from 'react';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';

interface CustomRoadmapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerateRoadmap: (goalInput: string, durationDays: number, dailyTarget: number) => void;
}

export function CustomRoadmapModal({
  isOpen,
  onClose,
  onGenerateRoadmap
}: CustomRoadmapModalProps) {
  const [goalInput, setGoalInput] = useState('');
  const [durationDays, setDurationDays] = useState(30);
  const [dailyTarget, setDailyTarget] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);

  // Lock body scroll when modal is active
  useLockBodyScroll(isOpen);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalInput.trim()) return;

    setIsGenerating(true);
    setTimeout(() => {
      onGenerateRoadmap(goalInput.trim(), durationDays, dailyTarget);
      setIsGenerating(false);
      onClose();
    }, 600);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      background: 'rgba(0,0,0,0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20
    }}>
      <div className="glass-card-premium" style={{
        maxWidth: 520,
        width: '100%',
        padding: 32,
        borderRadius: 24,
        position: 'relative'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            background: 'none',
            border: 'none',
            color: 'var(--t3)',
            fontSize: 18,
            cursor: 'pointer'
          }}
        >
          ✕
        </button>

        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <span style={{ fontSize: 36 }}>✨</span>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: 'var(--t1)', marginTop: 8, fontFamily: 'var(--font-display)' }}>
            Custom AI Roadmap Engine
          </h2>
          <p style={{ fontSize: 12.5, color: 'var(--t3)', marginTop: 4 }}>
            Specify your exact target career goal and customize your daily learning pace.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Goal Input */}
          <div>
            <label style={{ fontSize: 11.5, fontWeight: 800, color: 'var(--t2)', display: 'block', marginBottom: 6 }}>
              TARGET CAREER / SKILL GOAL
            </label>
            <input
              type="text"
              placeholder="e.g. Basic python to advance, React Developer, B.Com Finance..."
              value={goalInput}
              onChange={e => setGoalInput(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 12,
                background: 'var(--bg3)',
                border: '1.5px solid var(--border)',
                color: 'var(--t1)',
                fontSize: 13,
                outline: 'none'
              }}
            />
          </div>

          {/* Duration Slider (30 to 365 days) */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, fontWeight: 800, color: 'var(--t2)', marginBottom: 6 }}>
              <span>ROADMAP DURATION</span>
              <span style={{ color: 'var(--accent)' }}>{durationDays} Days</span>
            </div>
            <input
              type="range"
              min={15}
              max={365}
              step={15}
              value={durationDays}
              onChange={e => setDurationDays(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent)' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--t4)', marginTop: 4 }}>
              <span>15 Days</span>
              <span>90 Days</span>
              <span>180 Days</span>
              <span>365 Days (1 Year)</span>
            </div>
          </div>

          {/* Daily Quest Target */}
          <div>
            <label style={{ fontSize: 11.5, fontWeight: 800, color: 'var(--t2)', display: 'block', marginBottom: 6 }}>
              DAILY TARGET PACE
            </label>
            <select
              value={dailyTarget}
              onChange={e => setDailyTarget(Number(e.target.value))}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 12,
                background: 'var(--bg3)',
                border: '1.5px solid var(--border)',
                color: 'var(--t1)',
                fontSize: 13,
                outline: 'none'
              }}
            >
              <option value={1}>1 Quest / Day (Relaxed Pace)</option>
              <option value={2}>2 Quests / Day (Standard Pace)</option>
              <option value={3}>3 Quests / Day (Intensive Pace)</option>
            </select>
          </div>

          {/* Generate Button */}
          <button
            type="submit"
            disabled={isGenerating || !goalInput.trim()}
            style={{
              marginTop: 10,
              padding: '14px 20px',
              borderRadius: 14,
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: '#fff',
              border: 'none',
              fontSize: 13.5,
              fontWeight: 900,
              cursor: isGenerating ? 'wait' : 'pointer',
              boxShadow: '0 4px 14px rgba(16,185,129,0.35)',
              transition: 'all 0.2s'
            }}
          >
            {isGenerating ? '⚡ Compiling 4-Stage Zero-to-Pro Trajectory...' : '🚀 Generate Customized AI Roadmap'}
          </button>
        </form>
      </div>
    </div>
  );
}
