'use client';

import React, { useState } from 'react';
import { countStandupWords } from '@/lib/internships/sprints';

export interface StandupModalProps {
  week: number;
  isOpen: boolean;
  onClose: () => void;
  onSubmitStandup: (data: { week: number; done: string; next: string; blockers: string }) => Promise<boolean>;
}

export const StandupModal: React.FC<StandupModalProps> = ({
  week,
  isOpen,
  onClose,
  onSubmitStandup,
}) => {
  const [done, setDone] = useState('');
  const [next, setNext] = useState('');
  const [blockers, setBlockers] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const totalWords = countStandupWords(done, next, blockers);
  const isValidLength = totalWords >= 30 && totalWords <= 250;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidLength) return;
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const ok = await onSubmitStandup({ week, done, next, blockers });
      if (ok) {
        onClose();
      } else {
        setErrorMsg('Failed to record stand-up. Please try again.');
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Error submitting stand-up');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(5, 7, 15, 0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
    >
      <div
        style={{
          background: '#0f172a',
          border: '1.5px solid rgba(99, 102, 241, 0.4)',
          borderRadius: 20,
          width: '100%',
          maxWidth: 580,
          padding: 26,
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7)',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: '#ffffff' }}>
              📝 Week {week} Asynchronous Stand-Up
            </h3>
            <span style={{ fontSize: 12.5, color: '#94a3b8' }}>
              Keep your squad in sync (done, next, blockers · 30–200 words)
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: 22,
              color: '#94a3b8',
              cursor: 'pointer',
            }}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#c7d2fe', marginBottom: 4 }}>
              What did you complete this week? (Done)
            </label>
            <textarea
              rows={3}
              value={done}
              onChange={(e) => setDone(e.target.value)}
              placeholder="Completed patient intake validation function and wrote PostgreSQL table migration..."
              style={{
                width: '100%',
                background: '#1e293b',
                border: '1px solid #475569',
                borderRadius: 8,
                padding: '8px 10px',
                fontSize: 13,
                color: '#fff',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#c7d2fe', marginBottom: 4 }}>
              What are you building next? (Next)
            </label>
            <textarea
              rows={3}
              value={next}
              onChange={(e) => setNext(e.target.value)}
              placeholder="Will work on appointment booking conflicts check and submit PR to squad repository..."
              style={{
                width: '100%',
                background: '#1e293b',
                border: '1px solid #475569',
                borderRadius: 8,
                padding: '8px 10px',
                fontSize: 13,
                color: '#fff',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#c7d2fe', marginBottom: 4 }}>
              Any blockers or technical hurdles? (Blockers)
            </label>
            <input
              type="text"
              value={blockers}
              onChange={(e) => setBlockers(e.target.value)}
              placeholder="None, tests passing smoothly."
              style={{
                width: '100%',
                background: '#1e293b',
                border: '1px solid #475569',
                borderRadius: 8,
                padding: '8px 10px',
                fontSize: 13,
                color: '#fff',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Word Count Indicator */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: totalWords < 30 ? '#f87171' : totalWords > 250 ? '#f59e0b' : '#34d399',
              }}
            >
              Word count: {totalWords} words {totalWords < 30 ? `(need at least 30)` : `(valid)`}
            </span>

            {errorMsg && <span style={{ fontSize: 12, color: '#f87171' }}>{errorMsg}</span>}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 6 }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '8px 16px',
                borderRadius: 8,
                background: 'transparent',
                border: '1px solid #475569',
                color: '#94a3b8',
                fontSize: 13,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !isValidLength}
              style={{
                padding: '8px 20px',
                borderRadius: 8,
                background: isValidLength ? '#4f46e5' : '#334155',
                color: '#ffffff',
                border: 'none',
                fontSize: 13,
                fontWeight: 800,
                cursor: isValidLength ? 'pointer' : 'not-allowed',
              }}
            >
              {isSubmitting ? 'Submitting...' : 'Save Stand-Up'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
