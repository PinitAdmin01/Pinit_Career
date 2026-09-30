'use client';

import React from 'react';

interface TicketEditorTabsProps {
  code: string;
  setCode: (code: string) => void;
  starterCode: string;
  visibleTests: string;
}

export const TicketEditorTabs: React.FC<TicketEditorTabsProps> = ({
  code,
  setCode,
  starterCode,
  visibleTests,
}) => {
  const [activeTab, setActiveTab] = React.useState<'code' | 'tests'>('code');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* Tab Selector & Reset */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            type="button"
            onClick={() => setActiveTab('code')}
            style={{
              padding: '6px 14px',
              borderRadius: 8,
              border: 'none',
              background: activeTab === 'code' ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
              color: activeTab === 'code' ? '#818cf8' : 'var(--t3)',
              fontWeight: 800,
              fontSize: 12.5,
              cursor: 'pointer',
            }}
          >
            📄 main.py (Solution)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('tests')}
            style={{
              padding: '6px 14px',
              borderRadius: 8,
              border: 'none',
              background: activeTab === 'tests' ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
              color: activeTab === 'tests' ? '#818cf8' : 'var(--t3)',
              fontWeight: 800,
              fontSize: 12.5,
              cursor: 'pointer',
            }}
          >
            🧪 test_visible.py (Tests)
          </button>
        </div>
        {activeTab === 'code' && (
          <button
            type="button"
            onClick={() => setCode(starterCode)}
            style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 6, padding: '4px 10px', fontSize: 11.5, color: 'var(--t3)', cursor: 'pointer' }}
          >
            ↺ Reset Starter Code
          </button>
        )}
      </div>

      {/* Code / Test Area */}
      {activeTab === 'code' ? (
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
          rows={12}
          style={{
            width: '100%',
            boxSizing: 'border-box',
            resize: 'vertical',
            background: '#0e1420',
            padding: '14px 18px',
            borderRadius: 12,
            fontSize: 13,
            lineHeight: 1.55,
            fontFamily: 'var(--font-mono)',
            color: '#e2e8f0',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            outline: 'none',
            whiteSpace: 'pre',
            boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.3)',
          }}
        />
      ) : (
        <div
          style={{
            background: '#0e1420',
            padding: '14px 18px',
            borderRadius: 12,
            fontSize: 12.5,
            lineHeight: 1.55,
            fontFamily: 'var(--font-mono)',
            color: '#94a3b8',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            whiteSpace: 'pre',
            maxHeight: 260,
            overflowY: 'auto',
          }}
        >
          {visibleTests}
        </div>
      )}
    </div>
  );
};
