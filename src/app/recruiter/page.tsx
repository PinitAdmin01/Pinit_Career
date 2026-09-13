'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { useRouter } from 'next/navigation';
import { RoleGate } from '@/components/auth/RoleGate';
import { useRecruiterData, emptyJob } from './hooks/useRecruiterData';
import CandidateSearchPanel from './components/CandidateSearchPanel';
import ShortlistPanel from './components/ShortlistPanel';
import HiringPipelineView from './components/HiringPipelineView';
import ActiveJobsPanel from './components/ActiveJobsPanel';
import ApplicationsPanel from './components/ApplicationsPanel';
import CompanyProfilePanel from './components/CompanyProfilePanel';
import RecruiterAnalyticsPanel from './components/RecruiterAnalyticsPanel';
import RecruiterActivityLog from './components/RecruiterActivityLog';
import ResumeViewerModal from './components/ResumeViewerModal';
import JobModal from './components/JobModal';

export default function RecruiterPage() {
  return (
    <RoleGate allow={['recruiter', 'admin', 'superadmin']} label="Recruiter access required">
      <RecruiterPageInner />
    </RoleGate>
  );
}

function RecruiterPageInner() {
  const { user } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<
    'candidates' | 'shortlist' | 'pipeline' | 'jobs' | 'applications' | 'company' | 'reports'
  >('candidates');

  React.useEffect(() => {
    if (user && !['recruiter', 'admin', 'superadmin'].includes(user.role)) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const recruiter = useRecruiterData(user);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', paddingBottom: 60 }}>
      {/* Toast Notification */}
      {recruiter.toast && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 9999,
            background:
              recruiter.toast.type === 'success'
                ? 'var(--green)'
                : recruiter.toast.type === 'error'
                ? 'var(--coral)'
                : 'var(--blue)',
            color: 'var(--text)',
            padding: '11px 20px',
            borderRadius: 10,
            fontSize: 13,
            fontWeight: 600,
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          {recruiter.toast.msg}
        </div>
      )}

      {/* Hero Header */}
      <div className="page-hero" style={{ marginBottom: 20 }}>
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 16,
            flexWrap: 'wrap',
          }}
        >
          <div>
            <h1 className="page-hero-title">👥 Recruiter Dashboard</h1>
            <p className="page-hero-sub">
              AI-ranked candidates, job postings manager, and verified credentials checker
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
            <span className="badge badge-green">Live Data</span>
            <span className="badge badge-purple">ATS Ranker</span>
          </div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid var(--border)',
          marginBottom: 20,
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: 4,
            background: 'var(--bg3)',
            padding: 4,
            borderRadius: 'var(--radius)',
            border: '1px solid var(--border)',
            marginBottom: -1,
            flexWrap: 'wrap',
          }}
        >
          {(
            [
              ['candidates', '🔍 Candidates'],
              ['shortlist', '★ Shortlist'],
              ['pipeline', '📊 Pipeline'],
              ['jobs', '💼 Active Jobs'],
              ['applications', '📨 Applications'],
              ['company', '🏢 Company'],
              ['reports', '📈 Reports'],
            ] as const
          ).map(([tabKey, tabLabel]) => (
            <button
              key={tabKey}
              onClick={() => setActiveTab(tabKey)}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius)',
                border: 'none',
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: 600,
                fontFamily: 'var(--font-display)',
                background: activeTab === tabKey ? 'var(--bg2)' : 'transparent',
                color: activeTab === tabKey ? 'var(--t1)' : 'var(--t3)',
                boxShadow: activeTab === tabKey ? 'var(--shadow-sm)' : 'none',
                transition: 'all 0.15s',
              }}
            >
              {tabLabel}
            </button>
          ))}
        </div>

        {activeTab === 'jobs' && (
          <button
            onClick={() => {
              recruiter.setEditingJob(null);
              recruiter.setJobForm(emptyJob);
              recruiter.setShowJobModal(true);
            }}
            className="btn-primary"
            style={{ padding: '8px 16px', fontSize: 12 }}
          >
            + Post New Job
          </button>
        )}
      </div>

      {/* ── TAB: CANDIDATES ── */}
      {activeTab === 'candidates' && (
        <CandidateSearchPanel
          analytics={recruiter.analytics}
          filters={recruiter.filters}
          setFilters={recruiter.setFilters}
          fetchCandidates={recruiter.fetchCandidates}
          loading={recruiter.loading}
          candidates={recruiter.candidates}
          selectedCandidate={recruiter.selectedCandidate}
          setSelectedCandidate={recruiter.setSelectedCandidate}
          viewCandidate={recruiter.viewCandidate}
          setViewResumeData={recruiter.setViewResumeData}
          getCandidateStage={recruiter.getCandidateStage}
          handleUpdateStage={recruiter.handleUpdateStage}
          candidateNotesMap={recruiter.candidateNotesMap}
          newNoteText={recruiter.newNoteText}
          setNewNoteText={recruiter.setNewNoteText}
          handleAddRecruiterNote={recruiter.handleAddRecruiterNote}
          logActivity={recruiter.logActivity}
          triggerToast={recruiter.triggerToast}
          shortlist={recruiter.shortlist}
          sendContactRequest={recruiter.sendContactRequest}
          scheduleInterview={recruiter.scheduleInterview}
        />
      )}

      {/* ── TAB: SHORTLIST ── */}
      {activeTab === 'shortlist' && (
        <ShortlistPanel
          candidates={recruiter.candidates}
          getCandidateStage={recruiter.getCandidateStage}
          handleUpdateStage={recruiter.handleUpdateStage}
          viewCandidate={recruiter.viewCandidate}
          setViewResumeData={recruiter.setViewResumeData}
          scheduleInterview={recruiter.scheduleInterview}
          sendContactRequest={recruiter.sendContactRequest}
        />
      )}

      {/* ── TAB: PIPELINE ── */}
      {activeTab === 'pipeline' && (
        <HiringPipelineView
          candidates={recruiter.candidates}
          getCandidateStage={recruiter.getCandidateStage}
          handleUpdateStage={recruiter.handleUpdateStage}
          viewCandidate={recruiter.viewCandidate}
        />
      )}

      {/* ── TAB: ACTIVE JOBS ── */}
      {activeTab === 'jobs' && (
        <ActiveJobsPanel
          jobs={recruiter.jobs}
          setEditingJob={recruiter.setEditingJob}
          setJobForm={recruiter.setJobForm}
          setShowJobModal={recruiter.setShowJobModal}
          handleDeleteJob={recruiter.handleDeleteJob}
          triggerToast={recruiter.triggerToast}
        />
      )}

      {/* ── TAB: APPLICATIONS ── */}
      {activeTab === 'applications' && (
        <ApplicationsPanel
          applications={recruiter.applications}
          appReviewing={recruiter.appReviewing}
          setAppReviewing={recruiter.setAppReviewing}
          updatingAppStatus={recruiter.updatingAppStatus}
          handleUpdateAppStatus={recruiter.handleUpdateAppStatus}
          setViewResumeData={recruiter.setViewResumeData}
        />
      )}

      {/* ── TAB: COMPANY PROFILE ── */}
      {activeTab === 'company' && (
        <CompanyProfilePanel
          companyProfile={recruiter.companyProfile}
          setCompanyProfile={recruiter.setCompanyProfile}
          companyLoading={recruiter.companyLoading}
          companySaving={recruiter.companySaving}
          companyEditing={recruiter.companyEditing}
          setCompanyEditing={recruiter.setCompanyEditing}
          saveCompany={recruiter.saveCompany}
        />
      )}

      {/* ── TAB: REPORTS & AUDIT LOG ── */}
      {activeTab === 'reports' && (
        <div>
          <RecruiterAnalyticsPanel
            logs={recruiter.logs}
            chartDays={recruiter.chartDays}
            setChartDays={recruiter.setChartDays}
            chartData={recruiter.chartData}
            maxChartCount={recruiter.maxChartCount}
          />
          <RecruiterActivityLog
            filteredLogs={recruiter.filteredLogs}
            logFilterAction={recruiter.logFilterAction}
            setLogFilterAction={recruiter.setLogFilterAction}
            exportActivityToCSV={recruiter.exportActivityToCSV}
          />
        </div>
      )}

      {/* Resume Modal */}
      <ResumeViewerModal
        viewResumeData={recruiter.viewResumeData}
        onClose={() => recruiter.setViewResumeData(null)}
      />

      {/* Job Form Modal */}
      <JobModal
        showJobModal={recruiter.showJobModal}
        setShowJobModal={recruiter.setShowJobModal}
        editingJob={recruiter.editingJob}
        jobForm={recruiter.jobForm}
        setJobForm={recruiter.setJobForm}
        jobSaving={recruiter.jobSaving}
        jobSuggestions={recruiter.jobSuggestions}
        postJob={recruiter.postJob}
      />
    </div>
  );
}
