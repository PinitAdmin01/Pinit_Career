'use client';

import React, { useState } from 'react';
import { AchievementItem } from './usePortfolioData';

interface AchievementsSectionProps {
  achievements: AchievementItem[];
  addAchievement: (title: string, detail: string) => void;
  cOS?: any;
}

export function AchievementsSection({ achievements, addAchievement, cOS = {} }: AchievementsSectionProps) {
  const [showAddAch, setShowAddAch] = useState(false);
  const [newAchTitle, setNewAchTitle] = useState('');
  const [newAchDetail, setNewAchDetail] = useState('');

  const handleSave = () => {
    if (!newAchTitle.trim()) return;
    addAchievement(newAchTitle.trim(), newAchDetail.trim());
    setNewAchTitle('');
    setNewAchDetail('');
    setShowAddAch(false);
  };

  const vaultHonors = (cOS?.vaultItems || [])
    .filter((v: any) => v.item_type === 'activity' || v.item_type === 'certification')
    .map((v: any) => ({
      id: v.id,
      title: v.title,
      detail: v.organization_name || v.description || 'Verified Vault Credential',
      verified: v.verified
    }));
  const allHonors = [...achievements, ...vaultHonors];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800 }}>Verified Honors & Awards</h3>
        <button
          onClick={() => setShowAddAch(!showAddAch)}
          style={{
            background: 'var(--accent)',
            color: 'var(--text)',
            border: 'none',
            padding: '6px 12px',
            borderRadius: 8,
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          {showAddAch ? 'Cancel' : '+ Log Honor / Award'}
        </button>
      </div>

      {showAddAch && (
        <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: 14, marginBottom: 14 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <input
              type="text"
              placeholder="Award or Honor Title (e.g. 1st Place Smart India Hackathon)"
              value={newAchTitle}
              onChange={e => setNewAchTitle(e.target.value)}
              style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 6, padding: '8px 10px', color: 'var(--t1)', fontSize: 12.5 }}
            />
            <input
              type="text"
              placeholder="Issuing Organization or Details (e.g. Ministry of Education / IEEE)"
              value={newAchDetail}
              onChange={e => setNewAchDetail(e.target.value)}
              style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 6, padding: '8px 10px', color: 'var(--t1)', fontSize: 12.5 }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button
                onClick={() => setShowAddAch(false)}
                style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: 6, padding: '6px 12px', fontSize: 12, color: 'var(--t2)', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                style={{ background: 'var(--accent)', border: 'none', borderRadius: 6, padding: '6px 14px', fontSize: 12, fontWeight: 700, color: 'var(--text)', cursor: 'pointer' }}
              >
                Save Award
              </button>
            </div>
          </div>
        </div>
      )}

      {allHonors.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '32px 16px', background: 'var(--bg3)', borderRadius: 12, border: '1px solid var(--border)' }}>
          <span style={{ fontSize: 36, display: 'block', marginBottom: 10 }}>🏆</span>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--t1)', marginBottom: 4 }}>No Honors or Awards Logged Yet</div>
          <p style={{ fontSize: 12, color: 'var(--t3)', maxWidth: 440, margin: '0 auto' }}>
            Log hackathon awards, competition honors, or verified certifications above to showcase verified achievements on your public profile.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {allHonors.map(a => (
            <div key={a.id} style={{ display: 'flex', gap: 12, alignItems: 'center', background: 'var(--bg3)', padding: 12, borderRadius: 10, border: '1px solid var(--border)' }}>
              <span style={{ fontSize: 20 }}>🏆</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ margin: 0, fontSize: 13, fontWeight: 800 }}>{a.title}</h4>
                  <span style={{ fontSize: 9.5, padding: '2px 6px', borderRadius: 4, background: a.verified ? 'rgba(34,197,94,0.1)' : 'rgba(var(--warning-rgb), 0.1)', color: a.verified ? 'var(--green)' : 'var(--amber)', fontFamily: 'var(--font-mono)' }}>
                    {a.verified ? '✓ Verified' : 'Pending Audit'}
                  </span>
                </div>
                <span style={{ fontSize: 11.5, color: 'var(--t3)' }}>{a.detail}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
