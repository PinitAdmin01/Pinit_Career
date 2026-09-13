'use client';

import React from 'react';

export default function AlumniMentorshipView({
  pipeline,
}: {
  pipeline: Record<string, any[]>;
  triggerToast?: (msg: string, type?: 'success' | 'error') => void;
}) {
  const mentees = Object.values(pipeline || {}).flat();

  return (
    <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 14, padding: 18 }}>
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 900, color: 'var(--t1)' }}>🤝 Alumni Intelligence Matcher</h3>
        <p style={{ margin: '2px 0 0 0', fontSize: 11.5, color: 'var(--t3)' }}>
          Alumni mentor matches require a live alumni graph. Hard-coded demo dossiers are not shown as live pipeline data.
        </p>
      </div>
      {mentees.length === 0 ? (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--t3)', fontSize: 13, border: '1px solid var(--border)', borderRadius: 14 }}>
          No pipeline data
        </div>
      ) : (
        <div style={{ padding: 28, textAlign: 'center', color: 'var(--t3)', fontSize: 13, border: '1px solid var(--border)', borderRadius: 14 }}>
          {mentees.length} pipeline candidate{mentees.length === 1 ? '' : 's'} loaded — no alumni mentor matches on file yet.
        </div>
      )}
    </div>
  );
}
