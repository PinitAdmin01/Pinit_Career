'use client';

import React, { useState, useEffect } from 'react';
import { portalService, FraudAlertRecord } from '@/lib/services/portalService';

export default function FraudInspector() {
  const [alerts, setAlerts] = useState<FraudAlertRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAlerts() {
      setLoading(true);
      const data = await portalService.getFraudAlerts();
      setAlerts(data);
      setLoading(false);
    }
    loadAlerts();
  }, []);

  function resolveAlert(id: string) {
    setAlerts(alerts.filter(a => a.id !== id));
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: 'var(--t1, #0f172a)' }}>🛡️ Live Exam Integrity & Fraud Inspector</h2>
        <p style={{ margin: '4px 0 0', fontSize: 14, color: 'var(--t3, #64748b)' }}>Real-time monitoring of student tab switches, copy-paste events, and IP anomalies dispatches during active tests.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>Listening for active proctored exam alerts...</div>
        ) : alerts.map(item => (
          <div key={item.id} style={{
            padding: 20,
            borderRadius: 12,
            border: item.severity === 'high' ? '2px solid #ef4444' : '1px solid #e2e8f0',
            background: item.severity === 'high' ? '#fef2f2' : 'var(--bg1, #fff)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 16
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <span style={{
                  fontSize: 12,
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: 4,
                  background: item.severity === 'high' ? '#dc2626' : '#d97706',
                  color: '#fff'
                }}>
                  {item.severity.toUpperCase()} SEVERITY
                </span>
                <span style={{ fontSize: 15, fontWeight: 700 }}>{item.studentName}</span>
                <span style={{ fontSize: 13, color: '#64748b' }}>({item.examTitle})</span>
              </div>
              <p style={{ margin: 0, fontSize: 13, color: '#475569' }}>
                Detected <strong>{item.tabSwitches} tab switches</strong> during active exam window. IP: {item.ipAddress} • Trust Impact: <strong style={{ color: '#dc2626' }}>{item.trustScoreImpact} pts</strong>
              </p>
              <span style={{ fontSize: 11, color: '#94a3b8', marginTop: 4, display: 'block' }}>Log Time: {item.timestamp}</span>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => resolveAlert(item.id)}
                style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer', fontSize: 13 }}
              >
                Dismiss Flag
              </button>
              <button
                onClick={() => window.alert(`Invalidated exam submission for ${item.studentName}`)}
                style={{ padding: '8px 14px', borderRadius: 8, border: 'none', background: '#dc2626', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}
              >
                Invalidate Exam
              </button>
            </div>
          </div>
        ))}

        {!loading && alerts.length === 0 && (
          <div style={{ padding: 40, textAlign: 'center', background: 'var(--bg1, #fff)', borderRadius: 12, border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: 32 }}>✅</span>
            <h3 style={{ margin: '8px 0 0' }}>No Active Fraud Alerts</h3>
            <p style={{ color: '#64748b', fontSize: 14 }}>All current proctored exam sessions are operating within normal integrity parameters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
