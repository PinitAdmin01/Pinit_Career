'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api/client';
import { CS, AuditLogItem } from './types';

interface ActivityTabProps {
  user: any;
}

export default function ActivityTab({ user }: ActivityTabProps) {
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [isActivityLoading, setIsActivityLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    let isMounted = true;
    (async () => {
      try {
        const res = await api.get<{ log?: AuditLogItem[]; activity?: AuditLogItem[] }>('/api/student/activity');
        if (isMounted) {
          const userLogs = res.log || res.activity || [];
          setAuditLogs(userLogs);
        }
      } catch (err) {
        console.warn('Failed to fetch user activity logs', err);
      } finally {
        if (isMounted) {
          setIsActivityLoading(false);
        }
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }} className="animate-fade-in">
      <div style={CS.card}>
        <div style={CS.cardTitle}>📜 Activity History</div>
        <p style={{ fontSize: 12, color: 'var(--t3)', marginBottom: 16 }}>
          Your history of actions, quest completions, and session metrics recorded on PinIT Career OS.
        </p>

        {isActivityLoading ? (
          <div style={{ padding: 20, textAlign: 'center', color: 'var(--t3)', fontSize: 13 }}>Loading activity logs...</div>
        ) : auditLogs.length === 0 ? (
          <div style={{ padding: 30, textAlign: 'center', color: 'var(--t3)', border: '1px dashed var(--border)', borderRadius: 12, fontSize: 13 }}>
            No recent activity records found.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {auditLogs.map((log) => (
              <div key={log.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'var(--bg3)',
                padding: '12px 16px',
                borderRadius: 12,
                border: '1px solid var(--border)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 18 }}>⚡</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)', textTransform: 'capitalize' }}>
                      {log.action.replace(/_/g, ' ')}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 2 }}>
                      {log.meta?.questTitle || log.meta?.title || log.meta?.roomTitle || (log.action === 'login' ? 'Logged in securely' : log.action === 'logout' ? 'Logged out securely' : 'System update')}
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 11, color: 'var(--t3)', fontFamily: 'var(--font-mono)' }}>
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div style={{ fontSize: 9.5, color: 'var(--t4)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>
                    {new Date(log.timestamp).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
