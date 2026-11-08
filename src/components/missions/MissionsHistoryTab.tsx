'use client';

import React, { useState } from 'react';

interface MissionsHistoryTabProps {
  theme: {
    bgCard: string;
    bgInside: string;
    border: string;
    tPrimary: string;
    tSecondary: string;
    tTertiary: string;
  };
  socraticHistory: any[];
  historySearchQuery: string;
  setHistorySearchQuery: (query: string) => void;
  historyCategoryFilter: 'all' | 'mindset' | 'corporate_comm' | 'missions';
  setHistoryCategoryFilter: (cat: 'all' | 'mindset' | 'corporate_comm' | 'missions') => void;
  selectedHistoryRecord: any | null;
  setSelectedHistoryRecord: (record: any | null) => void;
}

export const MissionsHistoryTab: React.FC<MissionsHistoryTabProps> = ({
  theme,
  socraticHistory,
  historySearchQuery,
  setHistorySearchQuery,
  historyCategoryFilter,
  setHistoryCategoryFilter,
  selectedHistoryRecord,
  setSelectedHistoryRecord,
}) => {
  const [searchFocused, setSearchFocused] = useState(false);

  // Export Evaluation Audit History to CSV
  const handleExportCSV = () => {
    if (!socraticHistory || socraticHistory.length === 0) {
      alert('No history records available to export.');
      return;
    }

    const headers = ['ID', 'Category', 'Title', 'Timestamp', 'Score Metric', 'Evaluation Summary'];
    const rows = socraticHistory.map((item, idx) => {
      const category = item.type || (item.scenarioTitle ? 'Socratic Crisis' : 'Workplace Comm');
      const title = (item.scenarioTitle || item.title || `Evaluation #${idx + 1}`).replace(/"/g, '""');
      const timestamp = new Date(item.timestamp || Date.now()).toLocaleString().replace(/"/g, '""');
      const metric = (
        item.metrics
          ? `Comm:${item.metrics.comm}% Exec:${item.metrics.exec}% Lead:${item.metrics.lead}%`
          : `Score:${item.score || 85}`
      ).replace(/"/g, '""');
      const summary = (item.summary || item.report || 'Evaluation completed successfully.').replace(/"/g, '""');
      return `"${item.id || idx + 1}","${category}","${title}","${timestamp}","${metric}","${summary}"`;
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Pinit_Missions_Evaluation_Audit_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredHistory = socraticHistory.filter((item) => {
    const matchesSearch =
      !historySearchQuery ||
      (item.scenarioTitle || item.title || '').toLowerCase().includes(historySearchQuery.toLowerCase()) ||
      (item.summary || item.report || '').toLowerCase().includes(historySearchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (historyCategoryFilter === 'all') return true;
    if (historyCategoryFilter === 'mindset') return item.type === 'mindset' || item.scenarioTitle;
    if (historyCategoryFilter === 'corporate_comm') return item.type === 'corporate_comm' || item.metrics;
    if (historyCategoryFilter === 'missions') return item.type === 'missions';
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, animation: 'fade-in 0.3s ease' }}>
      {/* Top Banner with CSV Export */}
      <div
        style={{
          background: theme.bgCard,
          border: `1.5px solid ${theme.border}`,
          borderRadius: 20,
          padding: '24px 28px',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 26 }}>📋</span>
            <h2
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: theme.tPrimary,
                margin: 0,
                fontFamily: 'var(--font-display)',
                letterSpacing: '-0.3px',
              }}
            >
              Universal History Command Center
            </h2>
          </div>
          <p style={{ fontSize: 14, color: theme.tSecondary, margin: '6px 0 0', lineHeight: 1.5 }}>
            Audit and review past Socratic Crisis evaluations, Workplace Comm rewrites, and Daily Mission proofs.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          style={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: '#ffffff',
            border: 'none',
            borderRadius: 12,
            padding: '11px 20px',
            fontSize: 14,
            fontWeight: 800,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: '0 4px 14px rgba(16,185,129,0.3)',
            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 18px rgba(16,185,129,0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.boxShadow = '0 4px 14px rgba(16,185,129,0.3)';
          }}
        >
          <span>📥 Export Audit CSV</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: 260, position: 'relative' }}>
          <input
            type="text"
            placeholder="🔍 Search history evaluations by title or keyword..."
            value={historySearchQuery}
            onChange={(e) => setHistorySearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            style={{
              width: '100%',
              background: theme.bgCard,
              border: `1.5px solid ${searchFocused ? 'var(--teal)' : theme.border}`,
              borderRadius: 12,
              padding: '10px 16px',
              fontSize: 14,
              color: theme.tPrimary,
              outline: 'none',
              boxShadow: searchFocused ? '0 0 0 3px rgba(20, 184, 166, 0.18)' : 'var(--shadow-sm)',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />
        </div>

        <div
          style={{
            display: 'flex',
            gap: 6,
            background: theme.bgCard,
            border: `1.5px solid ${theme.border}`,
            borderRadius: 12,
            padding: 4,
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          {(['all', 'mindset', 'corporate_comm', 'missions'] as const).map((cat) => {
            const isActive = historyCategoryFilter === cat;
            return (
              <button
                key={cat}
                onClick={() => setHistoryCategoryFilter(cat)}
                style={{
                  background: isActive ? 'var(--accent)' : 'transparent',
                  color: isActive ? '#ffffff' : theme.tSecondary,
                  border: 'none',
                  borderRadius: 8,
                  padding: '7px 14px',
                  fontSize: 12.5,
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: isActive ? '0 2px 8px rgba(99, 102, 241, 0.3)' : 'none',
                }}
              >
                {cat === 'all' && '🌐 All Records'}
                {cat === 'mindset' && '🧩 Socratic Crisis'}
                {cat === 'corporate_comm' && '🗣️ Workplace Comm'}
                {cat === 'missions' && '🎯 Missions'}
              </button>
            );
          })}
        </div>
      </div>

      {/* Records List / Empty State */}
      {filteredHistory.length === 0 ? (
        <div
          style={{
            background: theme.bgCard,
            border: `1.5px dashed ${theme.border}`,
            borderRadius: 20,
            padding: '48px 24px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <span style={{ fontSize: 40 }}>📋</span>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: theme.tPrimary, margin: 0 }}>
            No History Records Found
          </h3>
          <p style={{ fontSize: 14, color: theme.tSecondary, maxWidth: 440, margin: 0, lineHeight: 1.55 }}>
            Complete Socratic Crisis roleplays in Evolve Yourself or Workplace Comm exercises in Career Communication Lab to generate evaluation records.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {filteredHistory.map((item, idx) => {
            // Strip raw markdown symbols for clean card preview
            const cleanSnippet = (item.summary || item.report || '')
              .replace(/#+\s*/g, '')
              .replace(/\*\*/g, '')
              .replace(/^[•\s*-]+\s*/gm, '')
              .replace(/\n+/g, ' ')
              .trim() || 'Detailed evaluation report generated.';

            return (
              <div
                key={item.id || idx}
                onClick={() => setSelectedHistoryRecord(item)}
                style={{
                  background: theme.bgCard,
                  border: `1.5px solid ${theme.border}`,
                  borderRadius: 16,
                  padding: '18px 20px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: 'var(--shadow-sm)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.borderColor = 'rgba(20, 184, 166, 0.35)';
                  e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0,0,0,0.35), 0 0 1px 1px rgba(20,184,166,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.borderColor = theme.border;
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      padding: '3px 9px',
                      borderRadius: 6,
                      background: item.scenarioTitle ? 'rgba(139,92,246,0.12)' : 'rgba(20,184,166,0.12)',
                      color: item.scenarioTitle ? 'var(--purple)' : 'var(--teal)',
                      border: `1px solid ${item.scenarioTitle ? 'rgba(139,92,246,0.25)' : 'rgba(20,184,166,0.25)'}`,
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    {item.scenarioTitle ? '🧩 Socratic Crisis' : '🗣️ Workplace Comm'}
                  </span>
                  <span style={{ fontSize: 11.5, color: theme.tTertiary, fontFamily: 'var(--font-mono)' }}>
                    {new Date(item.timestamp || Date.now()).toLocaleDateString()}
                  </span>
                </div>

                <h4 style={{ fontSize: 16, fontWeight: 800, color: theme.tPrimary, margin: 0, lineHeight: 1.35 }}>
                  {item.scenarioTitle || item.title || `Evaluation Record #${idx + 1}`}
                </h4>

                <p
                  style={{
                    fontSize: 13,
                    color: theme.tSecondary,
                    margin: 0,
                    lineHeight: 1.5,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical' as any,
                    overflow: 'hidden',
                  }}
                >
                  {cleanSnippet}
                </p>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: 4,
                    paddingTop: 10,
                    borderTop: `1px solid ${theme.border}`,
                  }}
                >
                  <span style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--teal)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <span>Inspect Report</span>
                    <span>➔</span>
                  </span>
                  {item.metrics ? (
                    <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: theme.tTertiary }}>
                      Comm: {item.metrics.comm}% • Exec: {item.metrics.exec}%
                    </span>
                  ) : item.qt2Delta !== undefined ? (
                    <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: item.qt2Delta >= 0 ? 'var(--teal)' : 'var(--red)', fontWeight: 700 }}>
                      QT2: {item.qt2Delta >= 0 ? `+${item.qt2Delta}` : item.qt2Delta} pts
                    </span>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MissionsHistoryTab;
