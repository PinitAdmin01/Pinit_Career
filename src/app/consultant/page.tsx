'use client';

import React from 'react';
import { RoleGate } from '@/components/auth/RoleGate';
import { useConsultantData } from './hooks/useConsultantData';
import ConsultantDashboardOverview from './components/ConsultantDashboardOverview';
import StudentPipelineView from './components/StudentPipelineView';
import ConsultantStudentIntelligenceView from './components/ConsultantStudentIntelligenceView';
import VisaTrackerView from './components/VisaTrackerView';
import ConsultantUnivScholarshipView from './components/ConsultantUnivScholarshipView';
import ConsultantDocumentHub from './components/ConsultantDocumentHub';
import SessionSchedulerPanel from './components/SessionSchedulerPanel';
import { ConsultantCopilotTab, ConsultantCopilotSidebar } from './components/ConsultantCopilotChat';
import AlumniMentorshipView from './components/AlumniMentorshipView';

function ConsultantPageInner() {
  const {
    activeTab,
    setActiveTab,
    copilotInput,
    setCopilotInput,
    copilotMessages,
    setCopilotMessages,
    pipeline,
    analytics,
    selectedStudent,
    setSelectedStudent,
    loading,
    selectedIntelStudent,
    setSelectedIntelStudent,
    selectedGoal,
    setSelectedGoal,
    matchingStudent,
    setMatchingStudent,
    scholarshipSubTab,
    setScholarshipSubTab,
    selectedDocStudent,
    setSelectedDocStudent,
    selectedVisaStudent,
    setSelectedVisaStudent,
    studyAbroadSubTab,
    setStudyAbroadSubTab,
    countryCompA,
    setCountryCompA,
    countryCompB,
    setCountryCompB,
    showCopilotSidebar,
    setShowCopilotSidebar,
    sidebarMessages,
    setSidebarMessages,
    showSopAudit,
    setShowSopAudit,
    showResumeAudit,
    setShowResumeAudit,
    showLorAudit,
    setShowLorAudit,
    documentsSubMode,
    setDocumentsSubMode,
    sopProjects,
    setSopProjects,
    sopResearch,
    setSopResearch,
    sopGoal,
    setSopGoal,
    sopAchievements,
    setSopAchievements,
    generatedSop,
    setGeneratedSop,
    generatingSop,
    setGeneratingSop,
    newTask,
    setNewTask,
    newTaskPriority,
    setNewTaskPriority,
    newTaskDueDate,
    setNewTaskDueDate,
    studentForm,
    setStudentForm,
    sessions,
    sessionForm,
    setSessionForm,
    scheduling,
    toast,
    careTeamReviews,
    triggerToast,
    toastObj,
    handleInitiateCareTeamReview,
    addStudent,
    updateStatus,
    handleVerifyDocument,
    addTask,
    scheduleSessions,
    allStudents,
  } = useConsultantData();

  const a = analytics;

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', paddingBottom: 60 }}>
      {/* Toast alert */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 9999,
            background: toast.type === 'success' ? 'var(--green)' : 'var(--coral)',
            color: 'var(--text)',
            padding: '11px 20px',
            borderRadius: 10,
            fontSize: 13,
            fontWeight: 600,
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          {toast.msg}
        </div>
      )}

      {/* Hero */}
      <div
        className="page-hero"
        style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 className="page-hero-title">🎓 Consultant Dashboard</h1>
          <p className="page-hero-sub">
            Track cohort progress, verify upload credentials, and coordinate consultation sessions
          </p>
        </div>
        <button
          onClick={() => setShowCopilotSidebar(prev => !prev)}
          className="btn-primary"
          style={{ position: 'relative', zIndex: 1, padding: '8px 16px', borderRadius: 8, fontSize: 12.5 }}
        >
          🤖 {showCopilotSidebar ? 'Hide Copilot Sidebar' : 'Show Copilot Sidebar'}
        </button>
      </div>

      {/* Navigation Tabs */}
      <div
        style={{
          display: 'flex',
          overflowX: 'auto',
          gap: 6,
          paddingBottom: 10,
          marginBottom: 20,
          borderBottom: '1px solid var(--border)',
        }}
      >
        {[
          { id: 'dashboard', label: '📊 Dashboard' },
          { id: 'pipeline', label: '📋 Student Pipeline' },
          { id: 'intelligence', label: '🔍 Student Intelligence' },
          { id: 'career_planning', label: '💼 Career Planning' },
          { id: 'study_abroad', label: '✈️ Study Abroad' },
          { id: 'mentorship', label: '🤝 Mentorship' },
          { id: 'univ_matching', label: '🏫 University Matching' },
          { id: 'scholarship', label: '🏆 Scholarship Center' },
          { id: 'documents', label: '📄 Documents' },
          { id: 'placement_timeline', label: '🚀 Placement Timeline' },
          { id: 'opportunity_radar', label: '📡 Opportunity Radar' },
          { id: 'meetings', label: '📅 Meetings' },
          { id: 'analytics', label: '📊 Analytics' },
          { id: 'copilot', label: '🤖 AI Consultant Copilot' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              border: 'none',
              cursor: 'pointer',
              fontSize: 12.5,
              fontWeight: activeTab === tab.id ? 800 : 600,
              background: activeTab === tab.id ? 'rgba(var(--brand-rgb), 0.08)' : 'transparent',
              color: activeTab === tab.id ? 'var(--accent)' : 'var(--t2)',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: showCopilotSidebar ? '1fr 340px' : '1fr', gap: 20 }}>
        <div style={{ minWidth: 0 }}>
          {activeTab === 'dashboard' && (
            <ConsultantDashboardOverview
              allStudents={allStudents}
              analytics={analytics}
              sessions={sessions}
              handleInitiateCareTeamReview={handleInitiateCareTeamReview}
            />
          )}

          {activeTab === 'pipeline' && (
            <StudentPipelineView
              loading={loading}
              allStudents={allStudents}
              pipeline={pipeline}
              selectedStudent={selectedStudent}
              setSelectedStudent={setSelectedStudent}
              setSessionForm={setSessionForm}
              setActiveTab={setActiveTab}
              updateStatus={updateStatus}
              handleVerifyDocument={handleVerifyDocument}
              newTask={newTask}
              setNewTask={setNewTask}
              newTaskPriority={newTaskPriority}
              setNewTaskPriority={setNewTaskPriority}
              newTaskDueDate={newTaskDueDate}
              setNewTaskDueDate={setNewTaskDueDate}
              addTask={addTask}
              handleInitiateCareTeamReview={handleInitiateCareTeamReview}
              careTeamReviews={careTeamReviews}
            />
          )}

          {(activeTab === 'intelligence' || activeTab === 'career_planning') && (
            <ConsultantStudentIntelligenceView
              allStudents={allStudents}
              selectedIntelStudent={selectedIntelStudent}
              setSelectedIntelStudent={setSelectedIntelStudent}
              activeTab={activeTab}
              selectedGoal={selectedGoal}
              setSelectedGoal={setSelectedGoal}
            />
          )}

          {activeTab === 'study_abroad' && (
            <VisaTrackerView
              allStudents={allStudents}
              selectedVisaStudent={selectedVisaStudent}
              setSelectedVisaStudent={setSelectedVisaStudent}
              studentForm={studentForm}
              setStudentForm={setStudentForm}
              addStudent={addStudent}
              studyAbroadSubTab={studyAbroadSubTab}
              setStudyAbroadSubTab={setStudyAbroadSubTab}
              countryCompA={countryCompA}
              setCountryCompA={setCountryCompA}
              countryCompB={countryCompB}
              setCountryCompB={setCountryCompB}
            />
          )}

          {activeTab === 'mentorship' && (
            <AlumniMentorshipView pipeline={pipeline} triggerToast={triggerToast} />
          )}

          {(activeTab === 'univ_matching' ||
            activeTab === 'scholarship' ||
            activeTab === 'placement_timeline' ||
            activeTab === 'opportunity_radar') && (
            <ConsultantUnivScholarshipView
              activeTab={activeTab}
              allStudents={allStudents}
              matchingStudent={matchingStudent}
              setMatchingStudent={setMatchingStudent}
              scholarshipSubTab={scholarshipSubTab}
              setScholarshipSubTab={setScholarshipSubTab}
              toastObj={toastObj}
            />
          )}

          {activeTab === 'documents' && (
            <ConsultantDocumentHub
              documentsSubMode={documentsSubMode}
              setDocumentsSubMode={setDocumentsSubMode}
              selectedDocStudent={selectedDocStudent}
              setSelectedDocStudent={setSelectedDocStudent}
              showSopAudit={showSopAudit}
              setShowSopAudit={setShowSopAudit}
              showResumeAudit={showResumeAudit}
              setShowResumeAudit={setShowResumeAudit}
              showLorAudit={showLorAudit}
              setShowLorAudit={setShowLorAudit}
              generatedSop={generatedSop}
              setGeneratedSop={setGeneratedSop}
              allStudents={allStudents}
              sopProjects={sopProjects}
              setSopProjects={setSopProjects}
              sopResearch={sopResearch}
              setSopResearch={setSopResearch}
              sopGoal={sopGoal}
              setSopGoal={setSopGoal}
              sopAchievements={sopAchievements}
              setSopAchievements={setSopAchievements}
              generatingSop={generatingSop}
              setGeneratingSop={setGeneratingSop}
              toastObj={toastObj}
            />
          )}

          {activeTab === 'meetings' && (
            <SessionSchedulerPanel
              sessions={sessions}
              sessionForm={sessionForm}
              setSessionForm={setSessionForm}
              allStudents={allStudents}
              scheduling={scheduling}
              scheduleSessions={scheduleSessions}
            />
          )}

          {activeTab === 'analytics' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }} className="fade-in">
              {[
                { label: 'Active Roster Students', value: a.totalStudents || 0, color: 'var(--accent)' },
                {
                  label: 'Annual Pipeline Revenue',
                  value: `₹${((a.totalRevenue || 0) / 1000).toFixed(0)}K`,
                  color: 'var(--green)',
                },
                { label: 'Visa Approval Success Rate', value: `${a.visaApprovalRate || 0}%`, color: 'var(--teal)' },
                { label: 'Admissions Offer Success Rate', value: `${a.offerRate || 0}%`, color: 'var(--amber)' },
              ].map(s => (
                <div
                  key={s.label}
                  style={{
                    background: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: 12,
                    padding: 20,
                    borderTop: `3px solid ${s.color}`,
                  }}
                >
                  <div
                    style={{
                      fontSize: 10,
                      letterSpacing: 0.5,
                      textTransform: 'uppercase',
                      color: 'var(--t3)',
                      marginBottom: 8,
                    }}
                  >
                    {s.label}
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800, color: s.color }}>
                    {s.value}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'copilot' && (
            <ConsultantCopilotTab
              copilotMessages={copilotMessages}
              setCopilotMessages={setCopilotMessages}
              copilotInput={copilotInput}
              setCopilotInput={setCopilotInput}
            />
          )}
        </div>

        {/* Right Column: AI Consultant Copilot Sidebar */}
        <ConsultantCopilotSidebar
          showCopilotSidebar={showCopilotSidebar}
          setShowCopilotSidebar={setShowCopilotSidebar}
          sidebarMessages={sidebarMessages}
          setSidebarMessages={setSidebarMessages}
        />
      </div>
    </div>
  );
}

export default function ConsultantPage() {
  return (
    <RoleGate allow={['consultant', 'admin', 'superadmin']} label="Consultant access required">
      <ConsultantPageInner />
    </RoleGate>
  );
}
