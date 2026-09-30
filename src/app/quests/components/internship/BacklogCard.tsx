'use client';

import React, { useState } from 'react';
import type { ProductBrief, UserStory } from '@/lib/internships/productBrief';

export interface BacklogCardProps {
  brief: ProductBrief | null;
  stories?: UserStory[];
}

export const BacklogCard: React.FC<BacklogCardProps> = ({ brief, stories }) => {
  const [activeTab, setActiveTab] = useState<'stories' | 'schema'>('stories');
  const userStories = stories || brief?.stories || [];

  if (!brief) {
    return null;
  }

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
      {/* Product Title & Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 22 }}>📋</span>
            <h3 style={{ margin: 0, fontSize: 17, fontWeight: 900, color: '#ffffff' }}>
              {brief.productName}
            </h3>
          </div>
          <p style={{ margin: '4px 0 0 0', fontSize: 12.5, color: '#94a3b8', maxWidth: 650, lineHeight: 1.4 }}>
            {brief.summary}
          </p>
        </div>

        <div style={{ display: 'flex', background: 'rgba(30, 41, 59, 0.6)', padding: 4, borderRadius: 10, border: '1px solid rgba(148, 163, 184, 0.2)' }}>
          <button
            type="button"
            onClick={() => setActiveTab('stories')}
            style={{
              padding: '6px 14px',
              borderRadius: 8,
              border: 'none',
              fontSize: 12,
              fontWeight: 800,
              cursor: 'pointer',
              background: activeTab === 'stories' ? '#4f46e5' : 'transparent',
              color: activeTab === 'stories' ? '#ffffff' : '#94a3b8',
            }}
          >
            Stories ({userStories.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('schema')}
            style={{
              padding: '6px 14px',
              borderRadius: 8,
              border: 'none',
              fontSize: 12,
              fontWeight: 800,
              cursor: 'pointer',
              background: activeTab === 'schema' ? '#4f46e5' : 'transparent',
              color: activeTab === 'schema' ? '#ffffff' : '#94a3b8',
            }}
          >
            Data Schema ({brief.dataModel?.length || 0})
          </button>
        </div>
      </div>

      {/* Tab 1: Stories View */}
      {activeTab === 'stories' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 320, overflowY: 'auto' }}>
          {userStories.map((story) => (
            <div
              key={story.id}
              style={{
                borderRadius: 10,
                padding: '12px 16px',
                background: 'rgba(30, 41, 59, 0.45)',
                border: '1px solid rgba(148, 163, 184, 0.12)',
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 900,
                    padding: '2px 8px',
                    borderRadius: 6,
                    background: 'rgba(99, 102, 241, 0.2)',
                    color: '#818cf8',
                  }}
                >
                  {story.id}
                </span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9' }}>
                  {story.title}
                </span>
              </div>
              <ul style={{ margin: 0, paddingLeft: 18, fontSize: 11.5, color: '#94a3b8' }}>
                {story.acceptance.map((acc, aIdx) => (
                  <li key={aIdx}>{acc}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        /* Tab 2: PostgreSQL Schema View */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, maxHeight: 320, overflowY: 'auto' }}>
          {brief.dataModel?.map((table) => (
            <div
              key={table.table}
              style={{
                borderRadius: 10,
                padding: '12px 14px',
                background: 'rgba(30, 41, 59, 0.45)',
                border: '1px solid rgba(148, 163, 184, 0.12)',
              }}
            >
              <span style={{ display: 'block', fontSize: 13, fontWeight: 800, color: '#38bdf8', marginBottom: 6 }}>
                🗄️ {table.table}
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {table.columns.map((col, cIdx) => (
                  <span
                    key={cIdx}
                    style={{
                      fontFamily: 'monospace',
                      fontSize: 11,
                      color: '#cbd5e1',
                      background: 'rgba(15, 23, 42, 0.5)',
                      padding: '2px 6px',
                      borderRadius: 4,
                    }}
                  >
                    {col}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
