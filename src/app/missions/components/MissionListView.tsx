'use client';

import React from 'react';
import Link from 'next/link';
import MissionCard from '@/components/ui/MissionCard';
import { Mission } from '../hooks/useMissionsState';

export const TYPE_META: Record<string, { icon: string; color: string; light: string }> = {
  communication: { icon: '🎙️', color: 'var(--blue)', light: 'rgba(var(--info-rgb), 0.1)' },
  skill: { icon: '⚡', color: 'var(--teal)', light: 'rgba(var(--accent-teal-rgb), 0.1)' },
  personality: { icon: '🧠', color: 'var(--purple)', light: 'rgba(168,85,247,0.1)' },
};

interface MissionListViewProps {
  theme: {
    bg: string;
    bgCard: string;
    bgInside: string;
    border: string;
    tPrimary: string;
    tSecondary: string;
    tTertiary: string;
    accentLight: string;
  };
  tab: 'today' | 'history';
  setTab: (tab: 'today' | 'history') => void;
  generating: boolean;
  handleTriggerRegenerate: () => void;
  pending: Mission[];
  completedMissions: string[];
  allTodayMissions: Mission[];
  pastCompleted: any[];
  completeMission: (id: string) => void;
  customSkill?: string;
  setCustomSkill?: (val: string) => void;
  handleGenerateCustomQuests?: () => void;
  generatingSkill?: boolean;
}

export default function MissionListView({
  theme,
  tab,
  setTab,
  generating,
  handleTriggerRegenerate,
  pending,
  completedMissions,
  allTodayMissions,
  pastCompleted,
  completeMission,
  customSkill,
  setCustomSkill,
  handleGenerateCustomQuests,
  generatingSkill,
}: MissionListViewProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }} className="animate-fade-in">
      {/* Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
        <div
          style={{
            display: 'flex',
            gap: 6,
            background: theme.bgInside,
            padding: 4,
            borderRadius: 12,
            border: `1px solid ${theme.border}`,
            width: 'fit-content',
          }}
        >
          <button
            onClick={() => setTab('today')}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              border: 'none',
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: 600,
              background: tab === 'today' ? theme.bgCard : 'transparent',
              color: tab === 'today' ? theme.tPrimary : theme.tTertiary,
              boxShadow: tab === 'today' ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.12s',
            }}
          >
            📅 Today's Gaps
          </button>
          <button
            onClick={() => setTab('history')}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              border: 'none',
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: 600,
              background: tab === 'history' ? theme.bgCard : 'transparent',
              color: tab === 'history' ? theme.tPrimary : theme.tTertiary,
              boxShadow: tab === 'history' ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.12s',
            }}
          >
            📋 History
          </button>
        </div>
        {tab === 'today' && (
          <button
            onClick={handleTriggerRegenerate}
            className="btn-ghost btn-sm"
            disabled={generating}
            style={{ fontSize: 11, color: theme.tSecondary }}
          >
            {generating ? '⟳ Re-generating...' : '⟳ Regenerate'}
          </button>
        )}
      </div>

      {/* Custom Skill Quick Injector (if provided) */}
      {setCustomSkill && handleGenerateCustomQuests && (
        <div
          style={{
            background: theme.bgCard,
            border: `1px solid ${theme.border}`,
            borderRadius: 14,
            padding: '12px 16px',
            display: 'flex',
            gap: 10,
            alignItems: 'center',
          }}
        >
          <input
            type="text"
            value={customSkill || ''}
            onChange={(e) => setCustomSkill(e.target.value)}
            placeholder="Target new skill gap (e.g. System Design, Next.js 15, Redis)..."
            style={{
              flex: 1,
              background: theme.bgInside,
              border: `1px solid ${theme.border}`,
              borderRadius: 8,
              padding: '8px 12px',
              color: theme.tPrimary,
              fontSize: 12,
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleGenerateCustomQuests();
            }}
          />
          <button
            onClick={handleGenerateCustomQuests}
            disabled={generatingSkill}
            className="btn-primary btn-sm"
            style={{ fontSize: 11, whiteSpace: 'nowrap' }}
          >
            {generatingSkill ? '⚡ Generating...' : '⚡ Add Quest'}
          </button>
        </div>
      )}

      {/* Today Tab */}
      {tab === 'today' &&
        (pending.length === 0 ? (
          <div
            style={{
              background: theme.bgCard,
              border: `1px solid ${theme.border}`,
              borderRadius: 16,
              padding: 32,
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div className="empty-state" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>🎉</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: theme.tPrimary, marginBottom: 4 }}>
                All Gaps Successfully Addressed!
              </div>
              <div style={{ fontSize: 12.5, color: theme.tTertiary, marginBottom: 16 }}>
                Your daily roadmap is fully clear. Great work! Come back tomorrow or match new benchmarks.
              </div>
              <Link href="/dashboard" className="btn-primary btn-sm">
                Command Center →
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
              {Object.entries(TYPE_META).map(([type, cfg]) => {
                const count = pending.filter((m) => m.type === type).length;
                return count > 0 ? (
                  <span
                    key={type}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 5,
                      fontSize: 11,
                      fontWeight: 600,
                      padding: '4px 10px',
                      borderRadius: 8,
                      background: cfg.light,
                      color: cfg.color,
                    }}
                  >
                    {cfg.icon} {count} {type.charAt(0).toUpperCase() + type.slice(1)} pending
                  </span>
                ) : null;
              })}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {pending.map((m) => (
                <div key={m.id} style={{ position: 'relative' }}>
                  <MissionCard mission={m} onComplete={() => completeMission(m.id)} />
                  {m.target_gap && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 12,
                        right: 140,
                        fontSize: 10,
                        fontFamily: 'var(--font-mono)',
                        background: theme.bgInside,
                        border: `1px solid ${theme.border}`,
                        padding: '2px 8px',
                        borderRadius: 6,
                        color: theme.tSecondary,
                      }}
                    >
                      ⚡ Closes:{' '}
                      <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{m.target_gap}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

      {/* History Tab */}
      {tab === 'history' &&
        (completedMissions.length === 0 ? (
          <div
            className="empty-state"
            style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 16 }}
          >
            <div className="empty-icon">📋</div>
            <div className="empty-title">No completed history yet</div>
            <div className="empty-desc">
              Completed missions appear here. Complete a mission today to build history!
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div
              style={{
                fontSize: 11.5,
                fontWeight: 700,
                color: theme.tTertiary,
                fontFamily: 'var(--font-mono)',
                marginBottom: 4,
              }}
            >
              ✓ SECURE PROTOCOL VERIFIED COMPLETIONS
            </div>
            {allTodayMissions
              .filter((m) => completedMissions.includes(m.id))
              .map((m) => (
                <div key={m.id}>
                  <MissionCard mission={{ ...m, status: 'completed' }} onComplete={() => {}} />
                </div>
              ))}
            {pastCompleted.slice(0, 5).map((m: any) => (
              <div key={m.id}>
                <MissionCard mission={{ ...m, status: 'completed' }} onComplete={() => {}} />
              </div>
            ))}
          </div>
        ))}
    </div>
  );
}
