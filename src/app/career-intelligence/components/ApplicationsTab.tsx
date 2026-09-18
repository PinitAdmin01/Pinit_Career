'use client';

import React from 'react';
import { Application } from '../hooks/useCareerIntelligenceData';
import { card, cardLabel } from './constants';

const STATUS_META: Record<Application['status'], { label: string; color: string; emoji: string; order: number; nextAction?: string }> = {
  applied:             { label: 'Applied',             color: 'var(--t2)',     emoji: '📤', order: 1, nextAction: 'Waiting for the recruiter to review.' },
  viewed:              { label: 'Viewed',              color: 'var(--accent)', emoji: '👁',  order: 2, nextAction: 'Recruiter has seen your profile.' },
  shortlisted:         { label: 'Shortlisted',         color: 'var(--teal)',   emoji: '⭐', order: 3, nextAction: 'You may be contacted soon. Check Notifications.' },
  interview_scheduled: { label: 'Interview Scheduled', color: 'var(--purple)', emoji: '🎙', order: 4, nextAction: 'Practice with Interview AI before the date.' },
  offered:             { label: 'Offered',             color: 'var(--green)',  emoji: '🎉', order: 5, nextAction: 'Respond directly to the recruiter.' },
  rejected:            { label: 'Rejected',            color: 'var(--coral)',  emoji: '✕',  order: 6, nextAction: 'Review ATS gaps on your Resume — keep going.' },
  withdrawn:           { label: 'Withdrawn',           color: 'var(--t4)',     emoji: '↩',  order: 7 },
};

interface ApplicationsTabProps {
  apps: Application[];
  appsLoading: boolean;
  visibleApps: Application[];
  activeAppsCount: number;
  appsFunnel: Record<Application['status'], number>;
}

export function ApplicationsTab({
  apps,
  appsLoading,
  visibleApps,
  activeAppsCount,
  appsFunnel
}: ApplicationsTabProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {!appsLoading && apps.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: 12, background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 16, padding: 16 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 900 }}>{apps.length}</div>
            <div style={{ fontSize: 10.5, color: 'var(--t3)' }}>Total</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--accent)' }}>{activeAppsCount}</div>
            <div style={{ fontSize: 10.5, color: 'var(--t3)' }}>Active</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--teal)' }}>{appsFunnel.shortlisted}</div>
            <div style={{ fontSize: 10.5, color: 'var(--t3)' }}>Shortlisted</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--green)' }}>{appsFunnel.offered}</div>
            <div style={{ fontSize: 10.5, color: 'var(--t3)' }}>Offers</div>
          </div>
        </div>
      )}

      <div style={card}>
        <div style={cardLabel}>📋 Live Pipeline Tracker</div>
        {appsLoading ? (
          <div style={{ padding: 24, textAlign: 'center', color: 'var(--t3)' }}>Syncing pipeline applications...</div>
        ) : apps.length === 0 ? (
          <div style={{ padding: 30, textAlign: 'center', color: 'var(--t3)', border: '1px dashed var(--border)', borderRadius: 12 }}>
            No active applications. Select &quot;Opportunity Radar&quot; to apply for matching openings.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {visibleApps.map(a => {
              const meta = STATUS_META[a.status] || { label: a.status, color: 'var(--t3)', emoji: '📥' };
              return (
                <div key={a.id} style={{ background: 'var(--bg3)', padding: 14, borderRadius: 12, border: '1px solid var(--border)', display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 13.5 }}>{a.title}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--t3)' }}>{a.org_name} · Applied: {new Date(a.applied_at).toLocaleDateString()}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: `${meta.color}14`, color: meta.color }}>
                      {meta.emoji} {meta.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
