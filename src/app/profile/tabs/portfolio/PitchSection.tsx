'use client';

import React from 'react';

interface PitchSectionProps {
  pitch: string;
  tempPitch: string;
  setTempPitch: (val: string) => void;
  editingPitch: boolean;
  setEditingPitch: (val: boolean) => void;
  savePitch: () => void;
}

export function PitchSection({
  pitch,
  tempPitch,
  setTempPitch,
  editingPitch,
  setEditingPitch,
  savePitch
}: PitchSectionProps) {
  return (
    <div>
      <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase' }}>Core Professional Pitch</span>
        <button
          onClick={() => setEditingPitch(!editingPitch)}
          style={{ padding: '4px 10px', fontSize: 11, fontWeight: 700, background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--accent)', cursor: 'pointer' }}
        >
          {editingPitch ? 'Cancel' : 'Edit Pitch'}
        </button>
      </div>
      {editingPitch ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <textarea
            value={tempPitch}
            onChange={e => setTempPitch(e.target.value)}
            rows={3}
            style={{ width: '100%', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: 10, color: 'var(--t1)', fontSize: 13, resize: 'vertical' }}
          />
          <button
            onClick={savePitch}
            style={{ alignSelf: 'flex-start', padding: '6px 16px', fontSize: 12, fontWeight: 800, background: 'var(--accent)', color: 'var(--text)', border: 'none', borderRadius: 8, cursor: 'pointer' }}
          >
            Save Pitch
          </button>
        </div>
      ) : (
        <p style={{ fontSize: 14, color: 'var(--t2)', lineHeight: 1.6, margin: 0 }}>"{pitch}"</p>
      )}
    </div>
  );
}
