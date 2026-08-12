'use client';

import React, { useState } from 'react';

export default function AdminOverview() {
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [activeNotice, setActiveNotice] = useState<string | null>(null);

  function handleBroadcast() {
    if (!broadcastMessage.trim()) return;
    setActiveNotice(broadcastMessage.trim());
    setBroadcastMessage('');
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: 'var(--t1, #0f172a)' }}>🏛️ Campus System Overview</h2>
          <p style={{ margin: '4px 0 0', color: 'var(--t3, #64748b)', fontSize: 14 }}>Real-time institutional metrics, active sessions, and system-wide broadcast management.</p>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => alert('Triggering instant database backup...')} style={{ padding: '8px 14px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
            💾 Backup DB Now
          </button>
          <button onClick={() => alert('Cleared server cache!')} style={{ padding: '8px 14px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
            ⚡ Clear Server Cache
          </button>
        </div>
      </div>

      {/* Broadcast Notice Banner */}
      {activeNotice && (
        <div style={{ background: '#fef3c7', border: '1px solid #f59e0b', padding: 16, borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontWeight: 800, color: '#92400e', marginRight: 8 }}>📢 Live Campus Broadcast:</span>
            <span style={{ color: '#78350f', fontSize: 14 }}>{activeNotice}</span>
          </div>
          <button onClick={() => setActiveNotice(null)} style={{ background: 'none', border: 'none', color: '#92400e', cursor: 'pointer', fontWeight: 700 }}>✕ Dismiss</button>
        </div>
      )}

      {/* Summary Stat Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        <div style={{ padding: 20, borderRadius: 12, border: '1px solid var(--border, var(--border))', background: 'var(--bg1, #fff)' }}>
          <div style={{ fontSize: 13, color: 'var(--t3, #64748b)' }}>Total Registered Users</div>
          <div style={{ fontSize: 32, fontWeight: 800, margin: '6px 0 0', color: '#2563eb' }}>1,248</div>
          <div style={{ fontSize: 12, color: '#16a34a', marginTop: 4 }}>↑ 12% this month</div>
        </div>

        <div style={{ padding: 20, borderRadius: 12, border: '1px solid var(--border, var(--border))', background: 'var(--bg1, #fff)' }}>
          <div style={{ fontSize: 13, color: 'var(--t3, #64748b)' }}>Active Faculty & Teachers</div>
          <div style={{ fontSize: 32, fontWeight: 800, margin: '6px 0 0', color: '#7c3aed' }}>48</div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>12 Departments</div>
        </div>

        <div style={{ padding: 20, borderRadius: 12, border: '1px solid var(--border, var(--border))', background: 'var(--bg1, #fff)' }}>
          <div style={{ fontSize: 13, color: 'var(--t3, #64748b)' }}>Flagged Fraud Alerts</div>
          <div style={{ fontSize: 32, fontWeight: 800, margin: '6px 0 0', color: '#dc2626' }}>2</div>
          <div style={{ fontSize: 12, color: '#dc2626', marginTop: 4 }}>Requires review</div>
        </div>

        <div style={{ padding: 20, borderRadius: 12, border: '1px solid var(--border, var(--border))', background: 'var(--bg1, #fff)' }}>
          <div style={{ fontSize: 13, color: 'var(--t3, #64748b)' }}>System Uptime</div>
          <div style={{ fontSize: 32, fontWeight: 800, margin: '6px 0 0', color: '#16a34a' }}>99.98%</div>
          <div style={{ fontSize: 12, color: '#16a34a', marginTop: 4 }}>All API routes operational</div>
        </div>
      </div>

      {/* Broadcast Form */}
      <div style={{ background: 'var(--bg1, #fff)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
        <h3 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 700 }}>📢 Send System-Wide Broadcast Notice</h3>
        <p style={{ color: '#64748b', fontSize: 13, margin: '0 0 12px' }}>Publish announcements to all student and faculty dashboards instantly.</p>
        
        <div style={{ display: 'flex', gap: 12 }}>
          <input
            type="text"
            placeholder="e.g. End Semester Exams schedule has been updated. Check exams portal."
            value={broadcastMessage}
            onChange={e => setBroadcastMessage(e.target.value)}
            style={{ flex: 1, padding: '10px 14px', borderRadius: 8, border: '1px solid #cbd5e1' }}
          />
          <button
            onClick={handleBroadcast}
            style={{ padding: '10px 20px', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}
          >
            Publish Notice
          </button>
        </div>
      </div>
    </div>
  );
}
