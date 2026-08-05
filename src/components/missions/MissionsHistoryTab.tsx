'use client';

import React from 'react';

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

  // Export Evaluation Audit History to CSV
  const handleExportCSV = () => {
    if (!socraticHistory || socraticHistory.length === 0) {
      alert("No history records available to export.");
      return;
    }

    const headers = ["ID", "Category", "Title", "Timestamp", "Score Metric", "Evaluation Summary"];
    const rows = socraticHistory.map((item, idx) => {
      const category = item.type || (item.scenarioTitle ? "Socratic Crisis" : "Workplace Comm");
      const title = (item.scenarioTitle || item.title || `Evaluation #${idx + 1}`).replace(/"/g, '""');
      const timestamp = new Date(item.timestamp || Date.now()).toLocaleString().replace(/"/g, '""');
      const metric = (item.metrics ? `Comm:${item.metrics.comm}% Exec:${item.metrics.exec}% Lead:${item.metrics.lead}%` : `Score:${item.score || 85}`).replace(/"/g, '""');
      const summary = (item.summary || item.report || "Evaluation completed successfully.").replace(/"/g, '""');
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

  const filteredHistory = socraticHistory.filter(item => {
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
      <div style={{
        background: theme.bgCard,
        border: `1px solid ${theme.border}`,
        borderRadius: 20,
        padding: 24,
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 16
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 24 }}>📋</span>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: theme.tPrimary, margin: 0 }}>
              Universal History Command Center
            </h2>
          </div>
          <p style={{ fontSize: 13, color: theme.tSecondary, margin: '4px 0 0', lineHeight: 1.5 }}>
            Audit and review past Socratic Crisis evaluations, Workplace Comm rewrites, and Daily Mission proofs.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          style={{
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: '#ffffff',
            border: 'none',
            borderRadius: 12,
            padding: '10px 18px',
            fontSize: 12.5,
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: '0 4px 12px rgba(16,185,129,0.25)',
            transition: 'transform 0.15s ease'
          }}
        >
          <span>📥 Export Audit CSV</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="🔍 Search history evaluations by title or keyword..."
          value={historySearchQuery}
          onChange={e => setHistorySearchQuery(e.target.value)}
          style={{
            flex: 1,
            minWidth: 260,
            background: theme.bgCard,
            border: `1px solid ${theme.border}`,
            borderRadius: 12,
            padding: '10px 14px',
            fontSize: 13,
            color: theme.tPrimary,
            outline: 'none'
          }}
        />

        <div style={{ display: 'flex', gap: 6, background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 12, padding: 4 }}>
          {(['all', 'mindset', 'corporate_comm', 'missions'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setHistoryCategoryFilter(cat)}
              style={{
                background: historyCategoryFilter === cat ? 'var(--accent)' : 'transparent',
                color: historyCategoryFilter === cat ? '#ffffff' : theme.tSecondary,
                border: 'none',
                borderRadius: 8,
                padding: '6px 12px',
                fontSize: 11.5,
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {cat === 'all' && '🌐 All Records'}
              {cat === 'mindset' && '🧩 Socratic Crisis'}
              {cat === 'corporate_comm' && '🗣️ Workplace Comm'}
              {cat === 'missions' && '🎯 Missions'}
            </button>
          ))}
        </div>
      </div>

      {/* Records List / Empty State */}
      {filteredHistory.length === 0 ? (
        <div style={{
          background: theme.bgCard,
          border: `1px dashed ${theme.border}`,
          borderRadius: 20,
          padding: '48px 24px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 12
        }}>
          <span style={{ fontSize: 36 }}>📋</span>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: theme.tPrimary, margin: 0 }}>
            No History Records Found
          </h3>
          <p style={{ fontSize: 12.5, color: theme.tSecondary, maxWidth: 420, margin: 0, lineHeight: 1.5 }}>
            Complete Socratic Crisis roleplays in Sub-tab 1 or Workplace Comm exercises in Sub-tab 2 to generate evaluation records.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 14 }}>
          {filteredHistory.map((item, idx) => (
            <div
              key={item.id || idx}
              onClick={() => setSelectedHistoryRecord(item)}
              style={{
                background: theme.bgCard,
                border: `1px solid ${theme.border}`,
                borderRadius: 16,
                padding: 16,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                transition: 'all 0.2s ease',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{
                  fontSize: 10,
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  padding: '3px 8px',
                  borderRadius: 6,
                  background: item.scenarioTitle ? 'rgba(139,92,246,0.1)' : 'rgba(20,184,166,0.1)',
                  color: item.scenarioTitle ? '#8b5cf6' : '#14b8a6',
                  fontFamily: 'var(--font-mono)'
                }}>
                  {item.scenarioTitle ? '🧩 Socratic Crisis' : '🗣️ Workplace Comm'}
                </span>
                <span style={{ fontSize: 10, color: theme.tTertiary, fontFamily: 'var(--font-mono)' }}>
                  {new Date(item.timestamp || Date.now()).toLocaleDateString()}
                </span>
              </div>

              <h4 style={{ fontSize: 14, fontWeight: 800, color: theme.tPrimary, margin: 0, lineHeight: 1.35 }}>
                {item.scenarioTitle || item.title || `Evaluation Record #${idx + 1}`}
              </h4>

              <p style={{
                fontSize: 12,
                color: theme.tSecondary,
                margin: 0,
                lineHeight: 1.45,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical' as any,
                overflow: 'hidden'
              }}>
                {item.summary || item.report || 'Detailed evaluation report generated.'}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4, paddingTop: 8, borderTop: `1px solid ${theme.border}` }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)' }}>
                  Inspect Report ➔
                </span>
                {item.metrics && (
                  <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: theme.tTertiary }}>
                    Comm: {item.metrics.comm}% • Exec: {item.metrics.exec}%
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Selected Record Modal */}
      {selectedHistoryRecord && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(6px)',
          zIndex: 9999,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20
        }}>
          <div style={{
            background: theme.bgCard,
            border: `1px solid ${theme.border}`,
            borderRadius: 24,
            width: '100%',
            maxWidth: 640,
            maxHeight: '85vh',
            overflowY: 'auto',
            padding: 28,
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            flexDirection: 'column',
            gap: 16
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 20 }}>📋</span>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: theme.tPrimary, margin: 0 }}>
                  {selectedHistoryRecord.scenarioTitle || selectedHistoryRecord.title || 'Evaluation Record Details'}
                </h3>
              </div>
              <button
                onClick={() => setSelectedHistoryRecord(null)}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  color: theme.tPrimary,
                  width: 32, height: 32,
                  borderRadius: '50%',
                  fontSize: 16,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ✕
              </button>
            </div>

            <div style={{
              background: theme.bgInside,
              borderRadius: 14,
              padding: 16,
              border: `1px solid ${theme.border}`,
              fontSize: 12.5,
              color: theme.tSecondary,
              lineHeight: 1.6,
              whiteSpace: 'pre-wrap'
            }}>
              {selectedHistoryRecord.report || selectedHistoryRecord.summary || 'No detailed evaluation text logged.'}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
              <button
                onClick={() => setSelectedHistoryRecord(null)}
                style={{
                  background: 'var(--accent)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 10,
                  padding: '8px 20px',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MissionsHistoryTab;
