'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api/client';

interface AuditLog {
  id: string;
  adminName: string;
  action: string;
  target: string;
  timestamp: string;
  details: string;
}

export default function AuditLogView() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('all');

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get<any>('/api/admin/audit-log').catch(() => null);
      const rawLogs = res?.log || (Array.isArray(res) ? res : []);

      if (Array.isArray(rawLogs) && rawLogs.length > 0) {
        const mapped: AuditLog[] = rawLogs.map((entry: any, index: number) => {
          let detailsStr = '';
          if (typeof entry.meta === 'object' && entry.meta !== null) {
            detailsStr = Object.entries(entry.meta)
              .map(([k, v]) => `${k}: ${typeof v === 'object' ? JSON.stringify(v) : v}`)
              .join(' · ');
          } else if (entry.details) {
            detailsStr = String(entry.details);
          } else {
            detailsStr = 'Administrative operation completed successfully';
          }

          const rawTime = entry.timestamp || entry.created_at || new Date().toISOString();
          const parsedTime = !isNaN(Date.parse(rawTime)) ? new Date(rawTime).toLocaleString() : String(rawTime);

          return {
            id: entry.id || `LOG-${1000 + index}`,
            adminName: entry.adminId || entry.admin_id || entry.actor_id || 'System Admin',
            action: entry.action || 'GENERAL_OPERATION',
            target: entry.targetId || entry.target_id || entry.target || 'Campus Registry',
            timestamp: parsedTime,
            details: detailsStr,
          };
        });
        setLogs(mapped);
      } else {
        setLogs([]);
      }
    } catch {
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

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
    downloadAnchor.setAttribute('download', `campus_audit_logs_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  // Extract unique actions for the filter dropdown
  const uniqueActions = Array.from(new Set(logs.map(l => l.action))).filter(Boolean);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: 'var(--t1)' }}>📜 System Audit & Security Logs</h2>
          <p style={{ color: 'var(--t3)', margin: '4px 0 0', fontSize: 14 }}>
            Immutable record of administrative operations, score overrides, and campus security actions.
          </p>
        </div>

        <button
          onClick={exportLogsJSON}
          disabled={filtered.length === 0}
          style={{
            padding: '8px 16px',
            background: filtered.length === 0 ? 'var(--border)' : 'var(--accent, #3b82f6)',
            color: '#fff',
            borderRadius: 8,
            border: 'none',
            fontWeight: 600,
            cursor: filtered.length === 0 ? 'not-allowed' : 'pointer',
          }}
        >
          📥 Export Logs ({filtered.length})
        </button>
      </div>

      {/* Search & Action Filter Bar */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search by admin name, target, or details..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            flex: 1,
            minWidth: 260,
            padding: '8px 14px',
            borderRadius: 8,
            border: '1px solid var(--border)',
            background: 'var(--card)',
            color: 'var(--t1)',
          }}
        />

        <select
          value={actionFilter}
          onChange={e => setActionFilter(e.target.value)}
          style={{
            padding: '8px 14px',
            borderRadius: 8,
            border: '1px solid var(--border)',
            background: 'var(--card)',
            color: 'var(--t1)',
          }}
        >
          <option value="all">All Action Types</option>
          {uniqueActions.map(action => (
            <option key={action} value={action}>{action}</option>
          ))}
        </select>
      </div>

      {/* Audit Log Entries */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--t3)' }}>
            Loading audit log registry...
          </div>
        ) : filtered.length === 0 ? (
          <div
            style={{
              padding: 40,
              textAlign: 'center',
              background: 'var(--card)',
              border: '1px dashed var(--border)',
              borderRadius: 12,
              color: 'var(--t3)',
            }}
          >
            {logs.length === 0
              ? 'No administrative operations recorded yet in audit ledger. Security actions, score overrides, and campus broadcasts will appear here.'
              : 'No audit records match your search filter.'}
          </div>
        ) : (
          filtered.map(log => (
            <div
              key={log.id}
              style={{
                padding: 16,
                borderRadius: 10,
                border: '1px solid var(--border)',
                background: 'var(--card)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: 16,
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: 6,
                      background: 'rgba(var(--brand-rgb), 0.1)',
                      color: 'var(--accent)',
                    }}
                  >
                    {log.action}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)' }}>
                    Actor: {log.adminName}
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--t3)' }}>→ Target: {log.target}</span>
                </div>
                <div style={{ fontSize: 12.5, color: 'var(--t2)', lineHeight: 1.4 }}>
                  {log.details}
                </div>
              </div>
              <div style={{ fontSize: 11, color: 'var(--t3)', whiteSpace: 'nowrap' }}>
                {log.timestamp}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
