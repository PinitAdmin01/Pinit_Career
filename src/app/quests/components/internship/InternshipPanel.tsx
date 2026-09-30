'use client';

import React from 'react';
import type { CrashCourseEnrollment } from '@/lib/services/crashCourseEnrollmentService';
import { isCapstoneComplete } from '@/lib/courses/crashCourseProgress';
import type { ClientInternshipTask } from '@/lib/internships/types';
import { CompanyProfileCard } from './CompanyProfileCard';
import { InternshipDeadlineBanner } from './InternshipDeadlineBanner';
import { TicketListCard } from './TicketListCard';
import { TicketWorkspace } from './TicketWorkspace';
import { FinalReportModal } from './FinalReportModal';
import { InternshipCertificateCard } from './InternshipCertificateCard';
import {
  InternshipStatusBanner,
  type InternshipPanelState,
} from './InternshipStatusBanner';
import { useInternshipData } from './useInternshipData';

export interface InternshipPanelProps {
  crashEnrollment: CrashCourseEnrollment | null;
  planTitle?: string;
  studentName?: string;
  onClose: () => void;
  onSelectTicket?: (task: ClientInternshipTask) => void;
  onOpenReport?: () => void;
  onOpenCertificate?: (certificateId: string) => void;
}

export const InternshipPanel: React.FC<InternshipPanelProps> = ({
  crashEnrollment,
  planTitle = 'Python Job Simulation',
  studentName = 'Student',
  onClose,
  onSelectTicket,
  onOpenReport,
  onOpenCertificate,
}) => {
  const {
    loading,
    panelError,
    enrollment,
    tasks,
    isStarting,
    startError,
    isExtending,
    isRestarting,
    isClaimingCert,
    fetchInternship,
    startSimulation,
    extendDeadline,
    restartSimulation,
    claimCertificate,
  } = useInternshipData(crashEnrollment);

  const [activeWorkspaceTicket, setActiveWorkspaceTicket] = React.useState<ClientInternshipTask | null>(null);
  const [showReportModal, setShowReportModal] = React.useState(false);
  const [viewingCertificateId, setViewingCertificateId] = React.useState<string | null>(null);

  let state: InternshipPanelState = 'loading';
  let notEligibleReason = '';

  if (loading) {
    state = 'loading';
  } else if (!enrollment) {
    const capstoneDone = isCapstoneComplete(crashEnrollment);
    const isPythonTrack = crashEnrollment?.track === 'python_ai';

    if (!isPythonTrack) {
      state = 'not_eligible';
      notEligibleReason = 'The internship simulation is currently exclusive to the Python & AI Engineering track.';
    } else if (!capstoneDone) {
      state = 'not_eligible';
      notEligibleReason = 'Your Capstone Project Desk must be completed and approved before starting the internship simulation.';
    } else {
      state = 'ready_to_start';
    }
  } else {
    state = enrollment.status as InternshipPanelState;
  }

  const allTicketsPassed = tasks.length === 5 && tasks.every((t) => t.status === 'passed');
  const needsFinalReport = allTicketsPassed && !enrollment?.finalReport;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgba(5, 7, 15, 0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
    >
      <div
        style={{
          background: 'var(--bg)',
          border: '1.5px solid rgba(99, 102, 241, 0.3)',
          borderRadius: 20,
          width: '100%',
          maxWidth: 900,
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: 28,
          position: 'relative',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6)',
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border)', paddingBottom: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 24 }}>🏢</span>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: 'var(--text)' }}>
                {planTitle} · Virtual Simulation Desk
              </h2>
            </div>
            <p style={{ margin: '4px 0 0 0', fontSize: 13, color: 'var(--t3)' }}>
              Assigned Engineer: <strong style={{ color: 'var(--text)' }}>{studentName}</strong> · Tier 1 (Simulated Python Experience)
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: 22,
              color: 'var(--t3)',
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: 6,
            }}
          >
            ✕
          </button>
        </div>

        {panelError && (
          <div style={{ padding: '12px 16px', borderRadius: 10, background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', fontSize: 13 }}>
            {panelError}
          </div>
        )}

        {/* State Banner */}
        <InternshipStatusBanner
          state={state}
          notEligibleReason={notEligibleReason}
          onStart={startSimulation}
          isStarting={isStarting}
          startError={startError}
          onRetryGeneration={startSimulation}
          restarts={enrollment?.restarts || 0}
          onRestart={restartSimulation}
          isRestarting={isRestarting}
          certificateId={enrollment?.certificateId}
          hasFinalReport={!!enrollment?.finalReport}
          onOpenReport={onOpenReport || (() => setShowReportModal(true))}
          onViewCertificate={(certId) => {
            if (onOpenCertificate) onOpenCertificate(certId);
            else setViewingCertificateId(certId);
          }}
          onRequestCertificate={() =>
            claimCertificate((certId) => {
              if (onOpenCertificate) onOpenCertificate(certId);
              else setViewingCertificateId(certId);
            })
          }
          isRequestingCertificate={isClaimingCert}
        />

        {/* Active & Backlog Content Area */}
        {(state === 'active' || state === 'completed' || state === 'expired') && enrollment && (
          <>
            <InternshipDeadlineBanner
              dueAt={enrollment.dueAt}
              extended={enrollment.extended}
              status={enrollment.status}
              onRequestExtension={extendDeadline}
              isRequestingExtension={isExtending}
            />

            <CompanyProfileCard profile={enrollment.companyProfile} />

            {needsFinalReport && (
              <div
                style={{
                  borderRadius: 12,
                  padding: '16px 20px',
                  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(16, 185, 129, 0.15))',
                  border: '1.5px solid rgba(16, 185, 129, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 12,
                }}
              >
                <div>
                  <h4 style={{ margin: 0, fontSize: 15, fontWeight: 900, color: 'var(--text)' }}>
                    🎉 Backlog Complete! Ready for Final Stand-Up Report
                  </h4>
                  <span style={{ fontSize: 12.5, color: 'var(--t2)' }}>
                    Summarize what you built (100–300 words) to verify your cohort and unlock your credential.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onOpenReport || (() => setShowReportModal(true))}
                  style={{
                    padding: '8px 18px',
                    borderRadius: 8,
                    background: '#10b981',
                    color: '#fff',
                    border: 'none',
                    fontSize: 13,
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  📝 Submit Stand-Up Report →
                </button>
              </div>
            )}

            <TicketListCard
              tasks={tasks}
              onSelectTicket={(task) => {
                if (onSelectTicket) {
                  onSelectTicket(task);
                } else {
                  setActiveWorkspaceTicket(task);
                }
              }}
            />
          </>
        )}

        {/* Ticket Workspace Modal */}
        {activeWorkspaceTicket && (
          <TicketWorkspace
            task={activeWorkspaceTicket}
            onBack={() => {
              setActiveWorkspaceTicket(null);
              fetchInternship();
            }}
            onTaskPassed={async () => {
              await fetchInternship();
            }}
          />
        )}

        {/* Stand-Up Report Modal */}
        {showReportModal && enrollment && (
          <FinalReportModal
            enrollmentId={enrollment.id}
            existingReport={enrollment.finalReport}
            onClose={() => setShowReportModal(false)}
            onReportAccepted={async () => {
              await fetchInternship();
            }}
          />
        )}

        {/* Verifiable Certificate Modal */}
        {viewingCertificateId && (
          <InternshipCertificateCard
            certificateId={viewingCertificateId}
            studentName={studentName}
            planTitle={planTitle}
            companyName={String(enrollment?.companyProfile?.name || 'Simulated Host Organization')}
            completedAt={enrollment?.completedAt}
            onClose={() => setViewingCertificateId(null)}
          />
        )}
      </div>
    </div>
  );
};

export default InternshipPanel;
