'use client';

import React from 'react';
import type { ClientInternshipTask } from '@/lib/internships/types';

interface TicketListCardProps {
  tasks: ClientInternshipTask[];
  onSelectTicket?: (task: ClientInternshipTask) => void;
  selectedTaskId?: string | null;
}

const KIND_LABEL: Record<string, { label: string; icon: string; color: string }> = {
  bug_fix: { label: 'Bug Fix', icon: '🐛', color: '#f87171' },
  new_function: { label: 'New Function', icon: '✨', color: '#60a5fa' },
  data_cleaning: { label: 'Data Cleaning', icon: '🧹', color: '#34d399' },
  refactor: { label: 'Refactoring', icon: '🔄', color: '#fbbf24' },
  feature: { label: 'Feature', icon: '🚀', color: '#a78bfa' },
  component: { label: 'React Component', icon: '⚛️', color: '#60a5fa' },
  component_bug_fix: { label: 'Component Bug Fix', icon: '🐛', color: '#f87171' },
  form_validation: { label: 'Form Validation', icon: '📋', color: '#34d399' },
  small_feature: { label: 'Feature Ticket', icon: '🚀', color: '#a78bfa' },
};

const STATUS_BADGE = {
  passed: { bg: 'rgba(16, 185, 129, 0.12)', border: 'rgba(16, 185, 129, 0.3)', color: '#10b981', label: '✓ Passed' },
  open: { bg: 'rgba(99, 102, 241, 0.15)', border: 'rgba(99, 102, 241, 0.4)', color: '#818cf8', label: '● Ready to Solve' },
  locked: { bg: 'rgba(100, 116, 139, 0.1)', border: 'rgba(100, 116, 139, 0.25)', color: '#64748b', label: '🔒 Locked' },
};

export const TicketListCard: React.FC<TicketListCardProps> = ({
  tasks,
  onSelectTicket,
  selectedTaskId,
}) => {
  const sortedTasks = [...tasks].sort((a, b) => a.seq - b.seq);
  const passedCount = sortedTasks.filter((t) => t.status === 'passed').length;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
        <div>
          <h4 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: 'var(--text)' }}>
            Engineering Sprint Backlog
          </h4>
          <span style={{ fontSize: 12, color: 'var(--t3)' }}>
            Sequential tickets. Pass automated unit & hidden verification tests to advance.
          </span>
        </div>
        <div
          style={{
            fontSize: 12,
            fontWeight: 800,
            padding: '4px 10px',
            borderRadius: 8,
            background: passedCount === 5 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(99, 102, 241, 0.12)',
            color: passedCount === 5 ? '#10b981' : '#818cf8',
            border: `1px solid ${passedCount === 5 ? 'rgba(16, 185, 129, 0.3)' : 'rgba(99, 102, 241, 0.3)'}`,
          }}
        >
          {passedCount} of {sortedTasks.length || 5} Tickets Passed
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {sortedTasks.map((task) => {
          const kindInfo = KIND_LABEL[task.kind] || { label: task.kind, icon: '📋', color: '#94a3b8' };
          const badge = STATUS_BADGE[task.status] || STATUS_BADGE.locked;
          const isSelected = selectedTaskId === task.id;
          const isClickable = (task.status === 'open' || task.status === 'passed') && !!onSelectTicket;

          return (
            <div
              key={task.id}
              onClick={() => isClickable && onSelectTicket(task)}
              style={{
                borderRadius: 12,
                background: isSelected
                  ? 'rgba(99, 102, 241, 0.1)'
                  : task.status === 'locked'
                  ? 'rgba(15, 23, 42, 0.3)'
                  : 'var(--bg2)',
                border: `1.5px solid ${
                  isSelected
                    ? '#6366f1'
                    : task.status === 'open'
                    ? 'rgba(99, 102, 241, 0.4)'
                    : task.status === 'passed'
                    ? 'rgba(16, 185, 129, 0.25)'
                    : 'var(--border)'
                }`,
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 12,
                cursor: isClickable ? 'pointer' : 'default',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, flex: 1, minWidth: 260 }}>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 900,
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: task.status === 'passed' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(99, 102, 241, 0.15)',
                    color: task.status === 'passed' ? '#10b981' : '#818cf8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  #{task.seq}
                </span>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 14.5, fontWeight: 800, color: 'var(--text)' }}>
                      {task.title}
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        padding: '2px 7px',
                        borderRadius: 6,
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid var(--border)',
                        color: kindInfo.color,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <span>{kindInfo.icon}</span>
                      <span>{kindInfo.label}</span>
                    </span>
                  </div>

                  <p
                    style={{
                      margin: 0,
                      fontSize: 12.5,
                      color: 'var(--t3)',
                      lineHeight: 1.4,
                      maxWidth: 540,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {task.brief}
                  </p>

                  {task.skills && task.skills.length > 0 && (
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 2 }}>
                      {task.skills.map((skill) => (
                        <span
                          key={skill}
                          style={{
                            fontSize: 10.5,
                            padding: '1px 6px',
                            borderRadius: 4,
                            background: 'rgba(99, 102, 241, 0.08)',
                            color: '#a5b4fc',
                            border: '1px solid rgba(99, 102, 241, 0.2)',
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {task.attempts > 0 && (
                  <span style={{ fontSize: 11.5, color: 'var(--t4)' }}>
                    {task.attempts} {task.attempts === 1 ? 'attempt' : 'attempts'}
                  </span>
                )}

                <span
                  style={{
                    fontSize: 11.5,
                    fontWeight: 800,
                    padding: '4px 10px',
                    borderRadius: 8,
                    background: badge.bg,
                    border: `1px solid ${badge.border}`,
                    color: badge.color,
                    letterSpacing: '0.02em',
                  }}
                >
                  {badge.label}
                </span>

                {isClickable && (
                  <button
                    type="button"
                    style={{
                      padding: '6px 14px',
                      borderRadius: 8,
                      border: 'none',
                      background: task.status === 'open' ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'var(--bg)',
                      color: task.status === 'open' ? '#fff' : 'var(--text)',
                      borderWidth: task.status === 'open' ? 0 : 1,
                      borderStyle: 'solid',
                      borderColor: 'var(--border)',
                      fontSize: 12,
                      fontWeight: 800,
                      cursor: 'pointer',
                    }}
                  >
                    {task.status === 'open' ? 'Work on Ticket →' : 'Review Solution'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
