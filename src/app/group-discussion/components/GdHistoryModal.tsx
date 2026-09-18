'use client';

import React from 'react';

export interface GdHistoryRecord {
  id: string;
  topic: string;
  objective?: string;
  date: string;
  domain?: string;
  report?: {
    score?: number;
    verdict?: string;
    gapsIdentified?: string[];
    keyMoments?: string[];
  };
  transcript?: Array<{
    sender: string;
    role: string;
    content: string;
    emoji?: string;
  }>;
}

interface GdHistoryModalProps {
  isOpen: boolean;
  historyList: GdHistoryRecord[];
  selectedItem: GdHistoryRecord | null;
  searchQuery: string;
  domainFilter: 'all' | 'technical' | 'sales' | 'business';
  onClose: () => void;
  onSelectItem: (item: GdHistoryRecord | null) => void;
  onSearchChange: (q: string) => void;
  onDomainFilterChange: (domain: 'all' | 'technical' | 'sales' | 'business') => void;
  onExportJSON: (item: GdHistoryRecord) => void;
  onDeleteItem: (id: string) => void;
}

export default function GdHistoryModal({
  isOpen,
  historyList,
  selectedItem,
  searchQuery,
  domainFilter,
  onClose,
  onSelectItem,
  onSearchChange,
  onDomainFilterChange,
  onExportJSON,
  onDeleteItem
}: GdHistoryModalProps) {
  if (!isOpen) return null;

  return (
    <div className="gd-modal-backdrop animate-fade-in" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="gd-modal-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: 16 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: 'var(--t1)', display: 'flex', alignItems: 'center', gap: 8 }}>
              📜 Boardroom Discussion History & Analytics
            </h3>
            <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--t3)' }}>
              Review past debate transcripts, performance scores, and identified architectural gaps.
            </p>
          </div>
          <button
            onClick={onClose}
            className="btn-ghost"
            style={{ padding: '6px 12px', fontSize: 13, border: '1px solid var(--border)', borderRadius: 8, cursor: 'pointer' }}
          >
            ✕ Close
          </button>
        </div>

        {/* Aggregate Stats Bar */}
        {historyList.length > 0 && (
          <div style={{ display: 'flex', gap: 12 }}>
            <div className="gd-stat-card">
              <span className="gd-stat-value">{historyList.length}</span>
              <span className="gd-stat-label">Total Boardrooms</span>
            </div>
            <div className="gd-stat-card">
              <span className="gd-stat-value" style={{ color: 'var(--teal)' }}>
                {historyList.length > 0
                  ? `${Math.round(historyList.reduce((acc, curr) => acc + (curr.report?.score || 75), 0) / historyList.length)}%`
                  : '—'}
              </span>
              <span className="gd-stat-label">Avg Performance Score</span>
            </div>
            <div className="gd-stat-card">
              <span className="gd-stat-value" style={{ color: 'var(--accent)', fontSize: 15, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {historyList[0]?.report?.gapsIdentified?.[0] || 'Lock Contention'}
              </span>
              <span className="gd-stat-label">Primary Focus Area</span>
            </div>
          </div>
        )}

        {/* Search & Domain Filter Bar */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <input
            type="text"
            placeholder="🔍 Search past topics..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="gd-form-input"
            style={{ flex: 2 }}
          />
          <select
            value={domainFilter}
            onChange={(e) => onDomainFilterChange(e.target.value as any)}
            className="gd-form-input"
            style={{ flex: 1, padding: '10px 14px' }}
          >
            <option value="all">🌐 All Domains</option>
            <option value="technical">💻 Technical</option>
            <option value="sales">📈 Sales</option>
            <option value="business">💼 Business</option>
          </select>
        </div>

        {/* History List or Selected Detail View */}
        {selectedItem ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, background: 'var(--bg3)', border: '1.5px solid var(--border)', borderRadius: 16, padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <button
                  onClick={() => onSelectItem(null)}
                  className="btn-ghost"
                  style={{ padding: '4px 10px', fontSize: 11, border: '1px solid var(--border)', borderRadius: 6, cursor: 'pointer', marginBottom: 8, fontWeight: 700 }}
                >
                  ← Back to History List
                </button>
                <h4 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: 'var(--t1)' }}>
                  {selectedItem.topic}
                </h4>
                <p style={{ margin: '4px 0 0', fontSize: 11.5, color: 'var(--t3)' }}>
                  {selectedItem.objective} | Date: {selectedItem.date}
                </p>
              </div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <div style={{
                  background: 'rgba(var(--accent-teal-rgb), 0.15)',
                  border: '1.5px solid var(--teal)',
                  borderRadius: 12,
                  padding: '8px 16px',
                  color: 'var(--teal)',
                  fontSize: 16,
                  fontWeight: 900
                }}>
                  Score: {selectedItem.report?.score || 75}%
                </div>
                <button
                  onClick={() => onExportJSON(selectedItem)}
                  className="btn-ghost"
                  style={{ padding: '8px 12px', fontSize: 11, border: '1px solid var(--teal)', color: 'var(--teal)', borderRadius: 8, cursor: 'pointer', fontWeight: 800 }}
                >
                  📥 Export JSON
                </button>
                <button
                  onClick={() => onDeleteItem(selectedItem.id)}
                  className="btn-ghost"
                  style={{ padding: '8px 12px', fontSize: 11, border: '1px solid var(--red)', color: 'var(--red)', borderRadius: 8, cursor: 'pointer', fontWeight: 800 }}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>

            {/* Verdict & Highlights */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 4 }}>
              <div style={{ background: 'var(--bg2)', padding: 14, borderRadius: 12, border: '1px solid var(--border)' }}>
                <h5 style={{ margin: '0 0 6px', fontSize: 12, fontWeight: 800, color: 'var(--t1)' }}>Evaluation Verdict</h5>
                <p style={{ margin: 0, fontSize: 11.5, color: 'var(--t2)', lineHeight: 1.5 }}>
                  {selectedItem.report?.verdict}
                </p>
              </div>
              <div style={{ background: 'var(--bg2)', padding: 14, borderRadius: 12, border: '1px solid var(--border)' }}>
                <h5 style={{ margin: '0 0 6px', fontSize: 12, fontWeight: 800, color: 'var(--t1)' }}>Identified Gaps</h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {(selectedItem.report?.gapsIdentified || []).map((gap: string, idx: number) => (
                    <span key={idx} style={{ fontSize: 11, color: 'var(--coral)', fontWeight: 700 }}>
                      🚨 {gap}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Searchable Transcript Log */}
            <div>
              <h5 style={{ margin: '8px 0 8px', fontSize: 12, fontWeight: 800, color: 'var(--t1)' }}>📜 Session Transcript</h5>
              <div style={{
                maxHeight: 260,
                overflowY: 'auto',
                background: '#090d16',
                border: '1px solid var(--border)',
                borderRadius: 12,
                padding: 14,
                display: 'flex',
                flexDirection: 'column',
                gap: 10
              }}>
                {(selectedItem.transcript || []).map((msg: any, idx: number) => (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'SDE Candidate' ? 'flex-end' : 'flex-start' }}>
                    <div style={{ display: 'flex', gap: 4, fontSize: 8.5, color: 'var(--t3)', marginBottom: 2 }}>
                      <span>{msg.emoji || '💬'}</span>
                      <strong>{msg.sender}</strong>
                      <span>({msg.role})</span>
                    </div>
                    <div style={{
                      padding: '8px 12px',
                      borderRadius: 10,
                      fontSize: 11.5,
                      background: msg.role === 'SDE Candidate' ? 'var(--accent)' : 'var(--bg2)',
                      color: msg.role === 'SDE Candidate' ? 'white' : 'var(--t1)',
                      maxWidth: '85%',
                      wordBreak: 'break-word'
                    }}>
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 380, overflowY: 'auto' }}>
            {(() => {
              const filtered = historyList.filter(item => {
                const matchesSearch = !searchQuery.trim() || item.topic.toLowerCase().includes(searchQuery.toLowerCase()) || (item.objective || '').toLowerCase().includes(searchQuery.toLowerCase());
                const matchesDomain = domainFilter === 'all' || item.domain === domainFilter;
                return matchesSearch && matchesDomain;
              });

              if (filtered.length === 0) {
                return (
                  <div style={{ padding: 30, textAlign: 'center', color: 'var(--t3)', fontSize: 12 }}>
                    No boardroom history records found matching your filters.
                  </div>
                );
              }

              return filtered.map((record) => (
                <div
                  key={record.id}
                  onClick={() => onSelectItem(record)}
                  className="gd-history-card"
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 13, fontWeight: 900, color: 'var(--t1)' }}>
                        {record.topic}
                      </span>
                      {record.domain && (
                        <span style={{
                          fontSize: 8.5,
                          background: 'rgba(var(--accent-teal-rgb), 0.1)',
                          border: '1px solid var(--teal)',
                          padding: '2px 6px',
                          borderRadius: 4,
                          color: 'var(--teal)',
                          fontFamily: 'var(--font-mono)',
                          textTransform: 'uppercase',
                          fontWeight: 800
                        }}>
                          {record.domain}
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 12, fontWeight: 900, color: (record.report?.score || 75) >= 80 ? 'var(--green)' : 'var(--orange)' }}>
                        {record.report?.score || 75}%
                      </span>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onSelectItem(record); }}
                        className="gd-review-btn"
                      >
                        🔍 View Recap
                      </button>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onDeleteItem(record.id); }}
                        style={{ background: 'none', border: 'none', color: 'var(--red)', fontSize: 12, cursor: 'pointer', opacity: 0.7 }}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  <p style={{ margin: 0, fontSize: 11, color: 'var(--t3)' }}>
                    {record.objective || 'General architectural debate'} | Date: {record.date}
                  </p>
                </div>
              ));
            })()}
          </div>
        )}
      </div>
    </div>
  );
}
