'use client';

import React from 'react';
import { RoleGate } from '@/components/auth/RoleGate';
import { useParentDashboard } from './hooks/useParentDashboard';
import StudentOverviewPanel from './components/StudentOverviewPanel';
import GradesView from './components/GradesView';
import AttendanceView from './components/AttendanceView';
import ParentAdvisorChat from './components/ParentAdvisorChat';
import FeePaymentPanel from './components/FeePaymentPanel';

function ParentPageInner() {
  const {
    registerNumber,
    setRegisterNumber,
    selectedStudent,
    setSelectedStudent,
    activeTab,
    setActiveTab,
    advisorInput,
    setAdvisorInput,
    advisorMessages,
    setAdvisorMessages,
    chatInput,
    setChatInput,
    chatMessages,
    setChatMessages,
    acknowledgedAlerts,
    handleAcknowledgeAlert,
    students,
    isLoading,
    overview,
    linkMutation,
    handleLinkSubmit,
    tabs,
  } = useParentDashboard();

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px 40px 20px' }}>
      <div className="page-hero" style={{ marginBottom: 20 }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 className="page-hero-title">👨‍👩‍👧 Parent Portal</h1>
          <p className="page-hero-sub">
            Monitor your child's career development, academic progress, and skill milestones in real-time
          </p>
        </div>
      </div>

      {/* Link Student Section */}
      <div
        style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: 14,
          padding: 20,
          marginBottom: 24,
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: 'var(--t1)' }}>Link a Student</div>
        <form onSubmit={handleLinkSubmit} style={{ display: 'flex', gap: 8 }}>
          <input
            value={registerNumber}
            onChange={e => setRegisterNumber(e.target.value)}
            placeholder="Enter student register number (e.g. REG-001)..."
            style={{
              flex: 1,
              padding: '10px 14px',
              borderRadius: 8,
              border: '1px solid var(--border)',
              background: 'var(--bg3)',
              color: 'var(--t1)',
              fontSize: 13,
            }}
          />
          <button
            type="submit"
            disabled={!registerNumber || linkMutation.isPending}
            style={{
              padding: '10px 20px',
              borderRadius: 8,
              background: 'var(--accent)',
              color: 'var(--text)',
              border: 'none',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            {linkMutation.isPending ? 'Sending...' : 'Send Request'}
          </button>
        </form>
        <p style={{ fontSize: 11, color: 'var(--t3)', marginTop: 8 }}>
          The student must approve your request before you can view their progress.
        </p>
      </div>

      {/* Main Grid */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: 40, color: 'var(--t3)' }}>Loading linked students...</div>
      ) : !students?.length ? (
        <div
          style={{
            textAlign: 'center',
            padding: 40,
            color: 'var(--t3)',
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 14,
          }}
        >
          No linked students yet. Enter a register number above to get started.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 24, alignItems: 'start' }}>
          {/* Sidebar - Linked Students List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 800,
                color: 'var(--t3)',
                textTransform: 'uppercase',
                letterSpacing: '0.8px',
                paddingLeft: 4,
              }}
            >
              Linked Children
            </div>
            {students.map(s => (
              <div
                key={s.id}
                onClick={() => setSelectedStudent(s.id)}
                style={{
                  padding: '16px',
                  borderRadius: 12,
                  cursor: 'pointer',
                  background: selectedStudent === s.id ? 'rgba(var(--success-rgb), 0.08)' : 'var(--card)',
                  border: `1.5px solid ${selectedStudent === s.id ? 'var(--success)' : 'var(--border)'}`,
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--t1)' }}>
                  {s.display_name || (s as any).name || 'Student'}
                </div>
                <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 2 }}>{s.register_number || s.id}</div>
                <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
                  <span style={{ fontSize: 11, color: 'var(--teal)', fontWeight: 700 }}>ATS: {s.ats_score || 0}</span>
                  <span style={{ fontSize: 11, color: 'var(--amber)', fontWeight: 700 }}>
                    🔥 {s.mission_streak || 0}d streak
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Child Workspace Panels */}
          <div>
            {!selectedStudent ? (
              <div
                style={{
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: 14,
                  padding: 60,
                  textAlign: 'center',
                  color: 'var(--t3)',
                }}
              >
                Select a student from the left panel to open the Child Career workspace
              </div>
            ) : !overview ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: 40,
                  color: 'var(--t3)',
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: 14,
                }}
              >
                Loading overview analytics...
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* Horizontal Workspace Navigation Tabs */}
                <div
                  style={{
                    display: 'flex',
                    gap: 6,
                    overflowX: 'auto',
                    paddingBottom: 6,
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  {tabs.map(t => {
                    const isActive = activeTab === t.id;
                    return (
                      <button
                        key={t.id}
                        onClick={() => setActiveTab(t.id)}
                        style={{
                          padding: '8px 16px',
                          borderRadius: 8,
                          fontSize: 12.5,
                          fontWeight: isActive ? 800 : 600,
                          background: isActive ? 'rgba(var(--success-rgb), 0.08)' : 'transparent',
                          color: isActive ? 'var(--success)' : 'var(--t2)',
                          border: 'none',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {t.label}
                      </button>
                    );
                  })}
                </div>

                {/* Tab Views */}
                <div
                  style={{
                    background: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: 14,
                    padding: 24,
                    minHeight: 450,
                  }}
                >
                  {(activeTab === 'dashboard' || activeTab === 'profile' || activeTab === 'monthly_report') && (
                    <StudentOverviewPanel
                      activeTab={activeTab}
                      overview={overview}
                      acknowledgedAlerts={acknowledgedAlerts}
                      students={students}
                      selectedStudent={selectedStudent}
                    />
                  )}

                  {(activeTab === 'academic' || activeTab === 'career') && (
                    <GradesView activeTab={activeTab} overview={overview} />
                  )}

                  {(activeTab === 'attendance' || activeTab === 'notifications') && (
                    <AttendanceView
                      activeTab={activeTab}
                      overview={overview}
                      acknowledgedAlerts={acknowledgedAlerts}
                      handleAcknowledgeAlert={handleAcknowledgeAlert}
                    />
                  )}

                  {(activeTab === 'advisor' || activeTab === 'communication') && (
                    <ParentAdvisorChat
                      activeTab={activeTab}
                      overview={overview}
                      advisorMessages={advisorMessages}
                      setAdvisorMessages={setAdvisorMessages}
                      advisorInput={advisorInput}
                      setAdvisorInput={setAdvisorInput}
                      chatMessages={chatMessages}
                      setChatMessages={setChatMessages}
                      chatInput={chatInput}
                      setChatInput={setChatInput}
                    />
                  )}

                  {(activeTab === 'documents' || activeTab === 'finance') && (
                    <FeePaymentPanel activeTab={activeTab} />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ParentPage() {
  return (
    <RoleGate allow={['parent', 'admin', 'superadmin']} label="Parent access required">
      <ParentPageInner />
    </RoleGate>
  );
}
