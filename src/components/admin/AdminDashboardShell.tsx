'use client';

import React, { useState } from 'react';
import AdminOverview from './AdminOverview';
import UserManagement from './UserManagement';
import AuditLogView from './AuditLogView';
import FraudInspector from './FraudInspector';

export default function AdminDashboardShell() {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'fraud' | 'audit' | 'settings'>('overview');

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      color: 'var(--t1)',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header Bar */}
      <header style={{
        background: 'var(--card)',
        borderBottom: '1px solid var(--border)',
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 24 }}>🏛️</span>
          <div>
            <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Campus Admin & Management Portal</h1>
            <span style={{ fontSize: 12, color: 'var(--t3, #64748b)' }}>Control Center • Security & Institutional Oversight</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => {
              const csvContent = "data:text/csv;charset=utf-8," 
                + "Report_ID,Category,Generated_Date,Status\n"
                + "REP-2026-001,Student_Admissions,2026-08-17,Verified\n"
                + "REP-2026-002,Finance_Dues_Summary,2026-08-17,Cleared\n"
                + "REP-2026-003,Attendance_Audit_Log,2026-08-17,Active\n";
              const encodedUri = encodeURI(csvContent);
              const link = document.createElement("a");
              link.setAttribute("href", encodedUri);
              link.setAttribute("download", `Campus_Admin_Report_${new Date().toISOString().split('T')[0]}.csv`);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            style={{
              padding: '6px 14px',
              fontSize: 13,
              borderRadius: 6,
              border: 'none',
              background: 'var(--accent)',
              color: '#fff',
              cursor: 'pointer',
              fontWeight: 700
            }}
          >
            📊 Export Institutional CSV Report
          </button>

          <button
            onClick={() => window.location.href = '/admin/teacher'}
            style={{
              padding: '6px 14px',
              fontSize: 13,
              borderRadius: 6,
              border: '1px solid var(--border, #cbd5e1)',
              background: 'var(--border)',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            👩‍🏫 Switch to Teacher View
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div style={{ display: 'flex', minHeight: 'calc(100vh - 65px)' }}>
        {/* Navigation Sidebar */}
        <aside style={{
          width: 240,
          background: 'var(--bg1, #ffffff)',
          borderRight: '1px solid var(--border, var(--border))',
          padding: '20px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: 6
        }}>
          {[
            { id: 'overview', icon: '📊', label: 'Dashboard Overview' },
            { id: 'users', icon: '👥', label: 'User & Role Control' },
            { id: 'fraud', icon: '🛡️', label: 'Exam Integrity & Fraud' },
            { id: 'audit', icon: '📜', label: 'Security & Audit Logs' },
            { id: 'settings', icon: '⚙️', label: 'System Settings' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 14px',
                borderRadius: 8,
                border: 'none',
                background: activeTab === item.id ? '#eff6ff' : 'transparent',
                color: activeTab === item.id ? '#2563eb' : 'var(--t2, #475569)',
                fontWeight: activeTab === item.id ? 700 : 500,
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%'
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </aside>

        {/* Dynamic Tab Body */}
        <main style={{ flex: 1, padding: 32, maxWidth: 1200 }}>
          {activeTab === 'overview' && <AdminOverview />}
          {activeTab === 'users' && <UserManagement />}
          {activeTab === 'fraud' && <FraudInspector />}
          {activeTab === 'audit' && <AuditLogView />}
          {activeTab === 'settings' && (
            <div style={{ background: 'var(--bg1, #fff)', border: '1px solid var(--border, var(--border))', borderRadius: 12, padding: 24 }}>
              <h2 style={{ margin: '0 0 8px' }}>⚙️ System Settings & Policy Controls</h2>
              <p style={{ color: 'var(--t3, #64748b)' }}>Configure global pass-mark thresholds, security fraud alert sensitivity, and institutional integrations.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
