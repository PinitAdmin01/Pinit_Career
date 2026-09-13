'use client';

import React, { useState } from 'react';
import { RecommendationItem } from './usePortfolioData';

interface RecommendationsSectionProps {
  recommendations: RecommendationItem[];
  addRecommendation: (author: string, role: string, text: string) => void;
}

export function RecommendationsSection({ recommendations, addRecommendation }: RecommendationsSectionProps) {
  const [showAddRec, setShowAddRec] = useState(false);
  const [newRecAuthor, setNewRecAuthor] = useState('');
  const [newRecRole, setNewRecRole] = useState('');
  const [newRecText, setNewRecText] = useState('');

  const handleSave = () => {
    if (!newRecAuthor.trim() || !newRecText.trim()) return;
    addRecommendation(newRecAuthor.trim(), newRecRole.trim(), newRecText.trim());
    setNewRecAuthor('');
    setNewRecRole('');
    setNewRecText('');
    setShowAddRec(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800 }}>Mentor & Faculty Endorsements</h3>
        <button
          onClick={() => setShowAddRec(!showAddRec)}
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
          {showAddRec ? 'Cancel' : '+ Add Endorsement'}
        </button>
      </div>

      {showAddRec && (
        <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: 14, marginBottom: 14 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <input
                type="text"
                placeholder="Mentor / Faculty Name (e.g. Dr. Rajesh Sharma)"
                value={newRecAuthor}
                onChange={e => setNewRecAuthor(e.target.value)}
                style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 6, padding: '8px 10px', color: 'var(--t1)', fontSize: 12.5 }}
              />
              <input
                type="text"
                placeholder="Designation / Role (e.g. Professor & Head of CS)"
                value={newRecRole}
                onChange={e => setNewRecRole(e.target.value)}
                style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 6, padding: '8px 10px', color: 'var(--t1)', fontSize: 12.5 }}
              />
            </div>
            <textarea
              rows={3}
              placeholder="Recommendation or letter of endorsement quote..."
              value={newRecText}
              onChange={e => setNewRecText(e.target.value)}
              style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 6, padding: '8px 10px', color: 'var(--t1)', fontSize: 12.5, resize: 'vertical' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button
                onClick={() => setShowAddRec(false)}
                style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: 6, padding: '6px 12px', fontSize: 12, color: 'var(--t2)', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                style={{ background: 'var(--accent)', border: 'none', borderRadius: 6, padding: '6px 14px', fontSize: 12, fontWeight: 700, color: 'var(--text)', cursor: 'pointer' }}
              >
                Save Endorsement
              </button>
            </div>
          </div>
        </div>
      )}

      {recommendations.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {recommendations.map(r => (
            <div key={r.id} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 12, padding: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div>
                  <span style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--t1)' }}>{r.author}</span>
                  {r.role && <span style={{ fontSize: 11.5, color: 'var(--t3)', marginLeft: 8 }}>&middot; {r.role}</span>}
                </div>
                <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 4, background: 'rgba(34,197,94,0.1)', color: 'var(--green)', fontWeight: 700 }}>
                  {r.verified ? '✓ Faculty Endorsed' : 'Pending Audit'}
                </span>
              </div>
              <p style={{ fontSize: 12.5, color: 'var(--t2)', margin: 0, fontStyle: 'italic', lineHeight: 1.5 }}>
                &ldquo;{r.text}&rdquo;
              </p>
              {r.date && (
                <div style={{ fontSize: 10.5, color: 'var(--t3)', marginTop: 8 }}>Endorsed on {r.date}</div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '36px 16px', background: 'var(--bg3)', borderRadius: 12, border: '1px solid var(--border)' }}>
          <span style={{ fontSize: 36, display: 'block', marginBottom: 10 }}>✍️</span>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--t1)', marginBottom: 4 }}>No Endorsements Recorded Yet</div>
          <p style={{ fontSize: 12, color: 'var(--t3)', maxWidth: 460, margin: '0 auto 16px', lineHeight: 1.5 }}>
            Add cryptographically signed letters of recommendation and mentor endorsements above to showcase academic and industry credibility.
          </p>
        </div>
      )}
    </div>
  );
}
