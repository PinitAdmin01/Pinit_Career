'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCareerOS } from '@/lib/context/CareerOSContext';

export function QuestsHistoryLog() {
  const router = Router();
  const { completedQuests, pins, xp } = useCareerOS();
  const [filterTab, setFilterTab] = useState<'all' | 'quests' | 'rewards'>('all');

  // Format completed quests as history items
  const historyItems = completedQuests.map((qId, idx) => {
    return {
      id: `history-${qId}-${idx}`,
      questId: qId,
      title: qId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      type: 'quest',
      timestamp: new Date().toLocaleDateString(),
      xpEarned: 150,
      pinsEarned: 50
    };
  });

  const filtered = historyItems.filter(item => {
    if (filterTab === 'quests') return item.type === 'quest';
    if (filterTab === 'rewards') return item.pinsEarned > 0;
    return true;
  });

  return (
    <div className="glass-card-premium" style={{ padding: 24, borderRadius: 20, marginTop: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 900, color: 'var(--t1)', margin: 0 }}>
            📜 Activity & Completion Log
          </h3>
          <p style={{ fontSize: 11.5, color: 'var(--t3)', marginTop: 2 }}>
            Your full trajectory milestone history, XP gains, and Pin rewards
          </p>
        </div>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: 6, background: 'var(--bg3)', padding: 3, borderRadius: 10 }}>
          {(['all', 'quests', 'rewards'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilterTab(tab)}
              style={{
                padding: '4px 10px',
                borderRadius: 8,
                border: 'none',
                background: filterTab === tab ? 'var(--bg2)' : 'transparent',
                color: filterTab === tab ? 'var(--t1)' : 'var(--t3)',
                fontSize: 11,
                fontWeight: 800,
                cursor: 'pointer',
                textTransform: 'capitalize'
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '30px 20px', color: 'var(--t3)', fontSize: 12 }}>
          No logged activity yet. Complete your first quest above to populate your log!
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.slice(0, 10).map((item) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: 12,
                background: 'var(--bg3)',
                border: '1px solid var(--border)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 16 }}>✅</span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--t1)' }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--t3)' }}>
                    Completed • {item.timestamp}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 11, fontWeight: 900, color: 'var(--accent)' }}>
                  +{item.xpEarned} XP
                </span>
                <span style={{ fontSize: 11, fontWeight: 900, color: '#eab308' }}>
                  +{item.pinsEarned} Pins
                </span>
                <button
                  onClick={() => router.push(`/quests/lesson?questId=${item.questId}`)}
                  style={{
                    padding: '4px 8px',
                    borderRadius: 6,
                    background: 'rgba(99,102,241,0.12)',
                    color: 'var(--accent)',
                    border: 'none',
                    fontSize: 10.5,
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  Revisit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Router() {
  return useRouter();
}
