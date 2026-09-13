'use client';

import React from 'react';
import { ActivityLog, getActionInfo, ACTION_LABELS } from '../hooks/useRecruiterData';

interface RecruiterActivityLogProps {
  filteredLogs: ActivityLog[];
  logFilterAction: string;
  setLogFilterAction: (action: string) => void;
  exportActivityToCSV: () => void;
}

export default function RecruiterActivityLog({
  filteredLogs,
  logFilterAction,
  setLogFilterAction,
  exportActivityToCSV,
}: RecruiterActivityLogProps) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem' }}>
      {/* Timeline */}
      <div
        style={{
          background: 'var(--bg2)',
          border: '1px solid var(--border)',
          borderRadius: 14,
          padding: '1.5rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <div>
            <h3 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--t1)', margin: 0 }}>
              📋 Activity Timeline
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--t3)', margin: 0, marginTop: '0.2rem' }}>
              Most recent actions first (Enterprise Supabase Audit Log)
            </p>
          </div>
          <button
            onClick={exportActivityToCSV}
            disabled={filteredLogs.length === 0}
            className="btn-primary"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '6px 12px',
              borderRadius: 8,
              fontSize: '0.82rem',
              boxShadow: 'none',
              background: 'var(--green)',
            }}
          >
            📥 Export CSV
          </button>
        </div>

        {filteredLogs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--t3)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>📭</div>
            <p style={{ fontWeight: 600, color: 'var(--t2)' }}>No activity recorded yet</p>
            <p style={{ fontSize: '0.85rem', marginTop: '0.3rem' }}>
              Actions you take will appear here automatically
            </p>
          </div>
        ) : (
          <div
            style={{
              maxHeight: 400,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            {filteredLogs.slice(0, 100).map((log, i) => {
              const info = getActionInfo(log.action);
              const meta = (() => {
                try {
                  return JSON.parse(log.meta || '{}');
                } catch {
                  return {};
                }
              })();
              return (
                <div
                  key={log.id || i}
                  style={{
                    display: 'flex',
                    gap: '0.875rem',
                    alignItems: 'flex-start',
                    padding: '0.75rem 0',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background: `${info.color}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      fontSize: '1rem',
                      color: info.color,
                    }}
                  >
                    {info.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <span style={{ color: 'var(--t1)', fontSize: '0.875rem', fontWeight: 600 }}>
                        {info.label}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--t3)' }}>
                        {new Date(log.created_at).toLocaleTimeString()}
                      </span>
                    </div>
                    {(meta.title || meta.name || meta.status || meta.mode || meta.stage || meta.candidateName) && (
                      <p style={{ fontSize: '0.8rem', color: 'var(--t2)', marginTop: '0.2rem' }}>
                        {meta.title && `Job: "${meta.title}"`}
                        {(meta.name || meta.candidateName) && `Candidate: "${meta.name || meta.candidateName}"`}
                        {meta.status && ` · Status: ${meta.status}`}
                        {meta.stage && ` · Stage: ${meta.stage}`}
                        {meta.mode && ` · Mode: ${meta.mode}`}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Filter controls */}
      <div
        style={{
          background: 'var(--bg2)',
          border: '1px solid var(--border)',
          borderRadius: 14,
          padding: '1.5rem',
          height: 'fit-content',
        }}
      >
        <h3 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--t1)', marginBottom: '1rem' }}>
          🔍 Filter Activity
        </h3>
        <div style={{ marginBottom: '1rem' }}>
          <label
            style={{
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--t2)',
              display: 'block',
              marginBottom: '0.4rem',
            }}
          >
            By Action Type
          </label>
          <select
            value={logFilterAction}
            onChange={(e) => setLogFilterAction(e.target.value)}
            className="form-input"
            style={{ width: '100%', fontSize: '0.875rem' }}
          >
            <option value="all">All Actions</option>
            {Object.entries(ACTION_LABELS).map(([action, info]) => (
              <option key={action} value={action}>
                {info.icon} {info.label}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={() => setLogFilterAction('all')}
          className="btn-ghost btn-sm"
          style={{ width: '100%', justifyContent: 'center' }}
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
}
