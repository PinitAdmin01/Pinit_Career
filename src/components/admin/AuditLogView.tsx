'use client';

import React, { useState } from 'react';

interface AuditLog {
  id: string;
  adminName: string;
  action: string;
  target: string;
  timestamp: string;
  details: string;
}

export default function AuditLogView() {
  const [logs] = useState<AuditLog[]>([
    { id: 'LOG-1092', adminName: 'System Admin', action: 'ROLE_SWITCH', target: 'Teacher Studio', timestamp: new Date(Date.now() - 300000).toLocaleString(), details: 'Role scope elevated to faculty workspace' },
    { id: 'LOG-1093', adminName: 'Lead Recruiter', action: 'INTERVIEW_DISPATCH', target: 'Ashwanth Kumar', timestamp: new Date(Date.now() - 600000).toLocaleString(), details: 'Sent interview invitation Ref #REF-INV-2026-9182' },
    { id: 'LOG-1094', adminName: 'Family Rep', action: 'ALERT_ACKNOWLEDGE', target: 'Unexcused Absence', timestamp: new Date(Date.now() - 900000).toLocaleString(), details: 'Parent acknowledged alert Seal #ACK-PAR-2' },
    { id: 'LOG-1095', adminName: 'Student Finance', action: 'FEE_RECEIPT', target: 'Term 1 Tuition', timestamp: new Date(Date.now() - 1200000).toLocaleString(), details: 'Generated official voucher Ref #PIN-FEE-2026-4012' }
  ]);

  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('all');

  const filtered = logs.filter(log => {
    const matchesSearch = log.adminName.toLowerCase().includes(search.toLowerCase()) ||
                          log.target.toLowerCase().includes(search.toLowerCase()) ||
                          log.details.toLowerCase().includes(search.toLowerCase());
    const matchesAction = actionFilter === 'all' || log.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  function exportLogsJSON() {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(filtered, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `audit_logs_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>📜 System Audit & Security Logs</h2>
          <p style={{ color: 'var(--t3, #64748b)', margin: '4px 0 0', fontSize: 14 }}>Immutable record of all administrative operations, score overrides, and security actions.</p>
        </div>

        <button
          onClick={exportLogsJSON}
          style={{ padding: '8px 16px', background: '#3b82f6', color: '#fff', borderRadius: 8, border: 'none', fontWeight: 600, cursor: 'pointer' }}
        >
          📥 Export Logs (JSON)
        </button>
      </div>

      {/* Search & Action Filter Bar */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search by admin name, target, or log details..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 260, padding: '8px 14px', borderRadius: 8, border: '1px solid #cbd5e1' }}
        />

        <select
          value={actionFilter}
          onChange={e => setActionFilter(e.target.value)}
          style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid #cbd5e1' }}
        >
          <option value="all">All Action Types</option>
          <option value="SCORE_OVERRIDE">SCORE_OVERRIDE</option>
          <option value="ROLE_ELEVATION">ROLE_ELEVATION</option>
          <option value="SUSPENSION_TRIGGER">SUSPENSION_TRIGGER</option>
          <option value="SYSTEM_BACKUP">SYSTEM_BACKUP</option>
        </select>
      </div>

      {/* Audit Log Entries */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.map(log => (
          <div key={log.id} style={{
            padding: 16,
            borderRadius: 10,
            border: '1px solid var(--border, var(--border))',
            background: 'var(--bg1, #fff)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 16
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <span style={{
                  fontSize: 11,
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: 4,
                  background: 'var(--border)',
                  color: '#334155'
                }}>
                  {log.action}
                </span>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{log.adminName}</span>
                <span style={{ fontSize: 12, color: 'var(--t3, #64748b)' }}>→ {log.target}</span>
              </div>
              <p style={{ margin: 0, fontSize: 13, color: 'var(--t2, #334155)' }}>{log.details}</p>
            </div>
            <span style={{ fontSize: 12, color: 'var(--t3, #94a3b8)', whiteSpace: 'nowrap' }}>{log.timestamp}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
