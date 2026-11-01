'use client';

import React, { useState } from 'react';
import AdminOverview from './AdminOverview';
import UserManagement from './UserManagement';
import AuditLogView from './AuditLogView';
import FraudInspector from './FraudInspector';
import AdminCourseRatesTab from './tabs/AdminCourseRatesTab';
import AdminPinsEconomyTab from './tabs/AdminPinsEconomyTab';
import AdminPinGrantTab from './tabs/AdminPinGrantTab';
import AdminTournamentsTab from './tabs/AdminTournamentsTab';
import {
  AdmissionsTab,
  FinanceTab,
  LibraryTab,
  HostelTab,
  TransportTab,
  DocumentsTab,
  ServicesTab,
} from './tabs/OperationsTabs';
import {
  GrievancesTab,
  EventsTab,
  ResearchTab,
  BroadcastTab,
  MaintenanceTab,
  AdvisorTab,
} from './tabs/ManagementTabs';
import { portalService, EnrolledStudent } from '@/lib/services/portalService';

export interface AdminDashboardShellProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

interface NavGroup {
  label: string;
  items: { id: string; icon: string; label: string; badge?: string }[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Core Governance',
    items: [
      { id: 'overview', icon: '📊', label: 'Dashboard Overview' },
      { id: 'users', icon: '👥', label: 'User & Role Control' },
      { id: 'fraud', icon: '🛡️', label: 'Exam Integrity & Fraud' },
      { id: 'audit', icon: '📜', label: 'Security & Audit Logs' },
    ]
  },
  {
    label: 'Economy & Pins Controls',
    items: [
      { id: 'rates', icon: '🏷️', label: 'Course Purchase Rates', badge: 'Active' },
      { id: 'pins', icon: '🪙', label: 'Pins Rate & Economy' },
      { id: 'grants', icon: '🎁', label: 'Grant Pins to Users' },
      { id: 'tournaments', icon: '⚔️', label: 'Tournaments & Duels', badge: 'Live' },
    ]
  },
  {
    label: 'Campus Operations',
    items: [
      { id: 'admissions', icon: '🏛️', label: 'Admissions' },
      { id: 'finance', icon: '💰', label: 'Finance Console' },
      { id: 'library', icon: '📚', label: 'Library' },
      { id: 'hostel', icon: '🏢', label: 'Hostel Desk' },
      { id: 'transport', icon: '🚌', label: 'Transport' },
      { id: 'documents', icon: '📑', label: 'Document Vault' },
      { id: 'services', icon: '🤝', label: 'Student Services' },
    ]
  },
  {
    label: 'Institutional Management',
    items: [
      { id: 'events', icon: '🎪', label: 'Events Registry' },
      { id: 'research', icon: '🔬', label: 'Research Desk' },
      { id: 'broadcast', icon: '📢', label: 'Broadcast Admin' },
      { id: 'grievances', icon: '⚖️', label: 'Grievance Review' },
      { id: 'maintenance', icon: '🛠️', label: 'Infrastructure' },
      { id: 'advisor', icon: '🤖', label: 'AI Advisor Logs' },
      { id: 'settings', icon: '⚙️', label: 'System Settings' },
    ]
  }
];

export default function AdminDashboardShell({ activeTab: controlledTab, onTabChange }: AdminDashboardShellProps = {}) {
  const [internalTab, setInternalTab] = useState<string>('overview');
  const [searchFilter, setSearchFilter] = useState('');

  const activeTab = controlledTab === 'dashboard' ? 'overview' : (controlledTab || internalTab);
  const setActiveTab = (next: string) => {
    setInternalTab(next);
    if (onTabChange) onTabChange(next);
  };

  const allItems = NAV_GROUPS.flatMap(g => g.items);
  const currentItem = allItems.find(i => i.id === activeTab) || allItems[0];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg, #f8fafc)',
      color: 'var(--t1, #0f172a)',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header Bar */}
      <header style={{
        background: 'var(--card, #ffffff)',
        borderBottom: '1px solid var(--border, #e2e8f0)',
        padding: '14px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 12,
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 26 }}>🏛️</span>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--t1)' }}>
                Campus Admin & Management Portal
              </h1>
              <span style={{
                fontSize: 11,
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: 4,
                background: '#dbeafe',
                color: '#1e40af'
              }}>
                Institutional Active
              </span>
            </div>
            <span style={{ fontSize: 12.5, color: 'var(--t3, #64748b)' }}>
              {currentItem.icon} {currentItem.label} • Control Center
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button
            onClick={async () => {
              try {
                const students = await portalService.getEnrolledStudents().catch(() => []);
                const dateStr = new Date().toISOString().split('T')[0];
                let csvRows = ['Student_ID,Display_Name,Email,Department,Batch,Course_Track,ATS_Score,Attendance_Pct,Status,Export_Date'];

                if (students.length > 0) {
                  students.forEach((s: EnrolledStudent) => {
                    csvRows.push(
                      `"${s.id}","${s.name.replace(/"/g, '""')}","${s.email}","${s.department}","${s.batch}","${s.courseTrack}",${s.atsScore},${s.attendancePct}%,"${s.status}","${dateStr}"`
                    );
                  });
                } else {
                  csvRows.push(`"INST-REPORT-001","Campus Registry","admin@pinit.app","Computer Science","2026 Cohort","Engineering",0,100%,"Active","${dateStr}"`);
                }

                const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvRows.join('\n'));
                const link = document.createElement('a');
                link.setAttribute('href', csvContent);
                link.setAttribute('download', `Campus_Institutional_Report_${dateStr}.csv`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              } catch (e) {
                console.error('CSV export failed', e);
              }
            }}
            style={{
              padding: '7px 14px',
              fontSize: 13,
              borderRadius: 8,
              border: 'none',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: '#fff',
              cursor: 'pointer',
              fontWeight: 700,
              boxShadow: '0 2px 8px rgba(16,185,129,0.3)'
            }}
          >
            📊 Export CSV Report
          </button>

          <button
            onClick={() => window.location.href = '/teacher'}
            style={{
              padding: '7px 14px',
              fontSize: 13,
              borderRadius: 8,
              border: '1px solid var(--border, #cbd5e1)',
              background: 'var(--card, #fff)',
              color: 'var(--t1)',
              cursor: 'pointer',
              fontWeight: 650,
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <span>👨‍🏫</span> Switch to Teacher Studio
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div style={{ display: 'flex', minHeight: 'calc(100vh - 65px)' }}>
        {/* Navigation Sidebar */}
        <aside style={{
          width: 260,
          background: 'var(--card, #ffffff)',
          borderRight: '1px solid var(--border, #e2e8f0)',
          padding: '16px 10px',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          flexShrink: 0
        }}>
          {/* Quick Tab Search */}
          <div>
            <input
              type="text"
              placeholder="Search admin consoles..."
              value={searchFilter}
              onChange={e => setSearchFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '6px 10px',
                borderRadius: 6,
                border: '1px solid var(--border)',
                background: 'var(--bg3)',
                color: 'var(--t1)',
                fontSize: 12,
                outline: 'none'
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, overflowY: 'auto', maxHeight: 'calc(100vh - 140px)' }}>
            {NAV_GROUPS.map(group => {
              const visibleItems = group.items.filter(item =>
                item.label.toLowerCase().includes(searchFilter.toLowerCase())
              );
              if (visibleItems.length === 0) return null;

              return (
                <div key={group.label}>
                  <div style={{
                    fontSize: 10.5,
                    fontWeight: 750,
                    textTransform: 'uppercase',
                    color: 'var(--t3, #64748b)',
                    padding: '0 8px 6px',
                    letterSpacing: '0.04em'
                  }}>
                    {group.label}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {visibleItems.map(item => {
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => setActiveTab(item.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '8px 10px',
                            borderRadius: 6,
                            border: 'none',
                            background: isActive ? 'rgba(37, 99, 235, 0.12)' : 'transparent',
                            color: isActive ? '#3b82f6' : 'var(--t2, #475569)',
                            fontWeight: isActive ? 700 : 500,
                            cursor: 'pointer',
                            textAlign: 'left',
                            width: '100%',
                            fontSize: 13,
                            transition: 'all 0.15s'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontSize: 15 }}>{item.icon}</span>
                            <span>{item.label}</span>
                          </div>

                          {item.badge && (
                            <span style={{
                              fontSize: 9.5,
                              fontWeight: 750,
                              padding: '1px 5px',
                              borderRadius: 4,
                              background: item.badge === 'Live' ? '#fee2e2' : '#dcfce7',
                              color: item.badge === 'Live' ? '#dc2626' : '#15803d'
                            }}>
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        {/* Dynamic Tab Body */}
        <main style={{ flex: 1, padding: '24px 32px', maxWidth: 1280, width: '100%' }}>
          {/* 1. Core Governance */}
          {(activeTab === 'overview' || activeTab === 'dashboard') && <AdminOverview />}
          {activeTab === 'users' && <UserManagement />}
          {activeTab === 'fraud' && <FraudInspector />}
          {activeTab === 'audit' && <AuditLogView />}

          {/* 2. Economy & Pins Controls (Task 4) */}
          {activeTab === 'rates' && <AdminCourseRatesTab />}
          {activeTab === 'pins' && <AdminPinsEconomyTab />}
          {activeTab === 'grants' && <AdminPinGrantTab />}
          {activeTab === 'tournaments' && <AdminTournamentsTab />}

          {/* 3. Campus Operations */}
          {activeTab === 'admissions' && <AdmissionsTab />}
          {activeTab === 'finance' && <FinanceTab />}
          {activeTab === 'library' && <LibraryTab />}
          {activeTab === 'hostel' && <HostelTab />}
          {activeTab === 'transport' && <TransportTab />}
          {activeTab === 'documents' && <DocumentsTab />}
          {activeTab === 'services' && <ServicesTab />}

          {/* 4. Institutional Management */}
          {activeTab === 'grievances' && <GrievancesTab />}
          {activeTab === 'events' && <EventsTab />}
          {activeTab === 'research' && <ResearchTab />}
          {activeTab === 'broadcast' && <BroadcastTab />}
          {activeTab === 'maintenance' && <MaintenanceTab />}
          {activeTab === 'advisor' && <AdvisorTab />}
          {activeTab === 'settings' && (
            <div style={{ background: 'var(--card, #fff)', border: '1px solid var(--border)', borderRadius: 12, padding: 24 }}>
              <h2 style={{ margin: '0 0 8px', fontSize: 20 }}>⚙️ System Settings & Policy Controls</h2>
              <p style={{ color: 'var(--t3, #64748b)', fontSize: 14 }}>
                Configure global pass-mark thresholds, security fraud alert sensitivity, and institutional integrations.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
