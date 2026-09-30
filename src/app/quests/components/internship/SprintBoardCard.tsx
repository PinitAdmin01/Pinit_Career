'use client';

import React, { useState } from 'react';
import type { ClientInternshipSprint } from '@/lib/internships/types';

export interface SprintBoardCardProps {
  sprints: ClientInternshipSprint[];
  activeWeek?: number;
  onSubmitPrLink: (sprintId: string, prUrl: string) => Promise<boolean>;
  onSubmitSprint: (sprintId: string) => Promise<boolean>;
  onOpenStandup: (week: number) => void;
}

export const SprintBoardCard: React.FC<SprintBoardCardProps> = ({
  sprints,
  activeWeek = 1,
  onSubmitPrLink,
  onSubmitSprint,
  onOpenStandup,
}) => {
  const [selectedSprintId, setSelectedSprintId] = useState<string>(
    sprints.find((s) => s.number === activeWeek)?.id || sprints[0]?.id || ''
  );
  const [prInput, setPrInput] = useState('');
  const [isSubmittingPr, setIsSubmittingPr] = useState(false);
  const [isSubmittingSprint, setIsSubmittingSprint] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; error: boolean } | null>(null);

  const activeSprint = sprints.find((s) => s.id === selectedSprintId) || sprints[0];

  const handlePrSubmit = async () => {
    if (!activeSprint || !prInput.trim()) return;
    setIsSubmittingPr(true);
    setStatusMsg(null);
    try {
      const ok = await onSubmitPrLink(activeSprint.id, prInput.trim());
      if (ok) {
        setPrInput('');
        setStatusMsg({ text: 'Pull request link verified and recorded!', error: false });
      } else {
        setStatusMsg({ text: 'PR link could not be verified. Ensure repository is public.', error: true });
      }
    } catch (err) {
      setStatusMsg({ text: err instanceof Error ? err.message : 'Error submitting PR', error: true });
    } finally {
      setIsSubmittingPr(false);
    }
  };

  const handleSprintSubmit = async () => {
    if (!activeSprint) return;
    setIsSubmittingSprint(true);
    setStatusMsg(null);
    try {
      const ok = await onSubmitSprint(activeSprint.id);
      if (ok) {
        setStatusMsg({ text: 'Sprint submitted for review!', error: false });
      } else {
        setStatusMsg({ text: 'Failed to submit sprint. Verify PR link and tasks.', error: true });
      }
    } catch (err) {
      setStatusMsg({ text: err instanceof Error ? err.message : 'Error submitting sprint', error: true });
    } finally {
      setIsSubmittingSprint(false);
    }
  };

  const getStatusBadge = (status: ClientInternshipSprint['status']) => {
    switch (status) {
      case 'approved':
        return { text: '✓ Approved', bg: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: 'rgba(16, 185, 129, 0.3)' };
      case 'submitted':
        return { text: '● Under Review', bg: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', border: 'rgba(59, 130, 246, 0.3)' };
      case 'changes_requested':
        return { text: '⚠️ Changes Needed', bg: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: 'rgba(239, 68, 68, 0.3)' };
      default:
        return { text: '● Active Sprint', bg: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', border: 'rgba(99, 102, 241, 0.3)' };
    }
  };

  return (
    <div
      style={{
        borderRadius: 16,
        padding: 22,
        background: 'rgba(15, 23, 42, 0.65)',
        border: '1.5px solid rgba(99, 102, 241, 0.25)',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.35)',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 17, fontWeight: 900, color: '#ffffff' }}>
            📅 4-Week Sprint Schedule
          </h3>
          <span style={{ fontSize: 12, color: '#94a3b8' }}>
            Complete weekly tasks, submit PR links, and provide async stand-ups
          </span>
        </div>

        {activeSprint && (
          <button
            type="button"
            onClick={() => onOpenStandup(activeSprint.number)}
            style={{
              padding: '6px 14px',
              borderRadius: 8,
              background: 'rgba(16, 185, 129, 0.2)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              color: '#34d399',
              fontSize: 12.5,
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            📝 Write Week {activeSprint.number} Stand-Up
          </button>
        )}
      </div>

      {/* Sprint Selector Tabs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
        {sprints.map((sprint) => {
          const isSelected = sprint.id === activeSprint?.id;
          const badge = getStatusBadge(sprint.status);
          return (
            <button
              key={sprint.id}
              type="button"
              onClick={() => setSelectedSprintId(sprint.id)}
              style={{
                borderRadius: 10,
                padding: '10px 8px',
                border: isSelected ? '1.5px solid #6366f1' : '1px solid rgba(148, 163, 184, 0.15)',
                background: isSelected ? 'rgba(99, 102, 241, 0.2)' : 'rgba(30, 41, 59, 0.4)',
                cursor: 'pointer',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 900, color: isSelected ? '#ffffff' : '#cbd5e1' }}>
                Sprint {sprint.number}
              </span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  padding: '2px 4px',
                  borderRadius: 4,
                  background: badge.bg,
                  color: badge.color,
                }}
              >
                {badge.text}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Sprint Detail Card */}
      {activeSprint && (
        <div
          style={{
            borderRadius: 12,
            padding: 18,
            background: 'rgba(30, 41, 59, 0.5)',
            border: '1px solid rgba(148, 163, 184, 0.15)',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          <div>
            <span style={{ fontSize: 11, fontWeight: 800, color: '#818cf8', textTransform: 'uppercase' }}>
              Sprint {activeSprint.number} Goal
            </span>
            <h4 style={{ margin: '2px 0 0 0', fontSize: 14.5, fontWeight: 800, color: '#ffffff' }}>
              {activeSprint.goal}
            </h4>
          </div>

          {/* PR Submission Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8' }}>
              GitHub Pull Request Link:
            </span>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <input
                type="url"
                placeholder="https://github.com/org/repo/pull/1"
                value={prInput}
                onChange={(e) => setPrInput(e.target.value)}
                style={{
                  flex: 1,
                  minWidth: 240,
                  background: '#0f172a',
                  border: '1px solid #475569',
                  borderRadius: 8,
                  padding: '8px 12px',
                  fontSize: 12.5,
                  color: '#fff',
                }}
              />
              <button
                type="button"
                onClick={handlePrSubmit}
                disabled={isSubmittingPr || !prInput.trim()}
                style={{
                  padding: '8px 16px',
                  borderRadius: 8,
                  background: '#4f46e5',
                  color: '#fff',
                  border: 'none',
                  fontSize: 12.5,
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                {isSubmittingPr ? 'Verifying...' : 'Record PR'}
              </button>
            </div>
          </div>

          {statusMsg && (
            <span style={{ fontSize: 12, fontWeight: 600, color: statusMsg.error ? '#f87171' : '#34d399' }}>
              {statusMsg.text}
            </span>
          )}

          {/* Sprint Submit Button */}
          {activeSprint.status !== 'approved' && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
              <button
                type="button"
                onClick={handleSprintSubmit}
                disabled={isSubmittingSprint}
                style={{
                  padding: '8px 20px',
                  borderRadius: 8,
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: 13,
                  fontWeight: 900,
                  cursor: 'pointer',
                }}
              >
                {isSubmittingSprint ? 'Submitting...' : '🚀 Submit Sprint for Review'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
