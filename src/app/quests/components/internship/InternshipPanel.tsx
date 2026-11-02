'use client';

import React from 'react';
import type { CrashCourseEnrollment } from '@/lib/services/crashCourseEnrollmentService';
import { isCapstoneComplete, resolvePlanInternshipTier } from '@/lib/courses/crashCourseProgress';
import type { ClientInternshipTask } from '@/lib/internships/types';
import { Tier1Desk } from './Tier1Desk';
import { Tier2Desk } from './Tier2Desk';
import { TicketWorkspace } from './TicketWorkspace';
import { FinalReportModal } from './FinalReportModal';
import { InternshipCertificateCard } from './InternshipCertificateCard';
import {
  InternshipStatusBanner,
  type InternshipPanelState,
} from './InternshipStatusBanner';
import { getTierConfig, type InternshipTrack } from '@/lib/internships/tiers';
import type { InternshipTier } from '@/lib/data/crashPlansData';
import { useInternshipData, resolveInternshipState } from './useInternshipData';

export interface InternshipPanelProps {
  crashEnrollment: CrashCourseEnrollment | null;
  planTitle?: string;
  studentName?: string;
  onClose: () => void;
  onSelectTicket?: (task: ClientInternshipTask) => void;
  onOpenReport?: () => void;
  onOpenCertificate?: (certificateId: string) => void;
  initialData?: Partial<ReturnType<typeof useInternshipData>>;
}

export const InternshipPanel: React.FC<InternshipPanelProps> = ({
  crashEnrollment,
  planTitle = 'Python Job Simulation',
  studentName = 'Student',
  onClose,
  onSelectTicket,
  onOpenReport,
  onOpenCertificate,
  initialData,
}) => {
  const hookData = useInternshipData(crashEnrollment);
  const data = { ...hookData, ...initialData };
  const {
    loading,
    panelError,
    enrollment,
    tasks,
    team,
    members,
    sprints,
    isSolo,
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
    updateRepo,
    submitPrLink,
    submitSprint,
    submitStandup,
    submitDemoUrl,
  } = data;

  const [activeWorkspaceTicket, setActiveWorkspaceTicket] = React.useState<ClientInternshipTask | null>(null);
  const [showReportModal, setShowReportModal] = React.useState(false);
  const [viewingCertificateId, setViewingCertificateId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (activeWorkspaceTicket || showReportModal || viewingCertificateId || typeof window === 'undefined') return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeWorkspaceTicket, showReportModal, viewingCertificateId, onClose]);

  const track: InternshipTrack = crashEnrollment?.track === 'web_fullstack' ? 'web_fullstack' : 'python_ai';
  const isWeb = track === 'web_fullstack';
  const tier: InternshipTier = (enrollment?.tier as InternshipTier) || resolvePlanInternshipTier(null, crashEnrollment) || 't1_job_sim';
  const tierConfig = getTierConfig(tier, track);
  const defaultTitle = tierConfig?.name || (isWeb ? 'Web Developer Job Simulation' : 'Python Job Simulation');
  const displayTitle = planTitle && planTitle !== 'Python Job Simulation' ? planTitle : defaultTitle;
  const tierLabel = tierConfig
    ? `Tier ${tier === 't2_virtual_team' ? '2' : '1'} (${tierConfig.name})`
    : (isWeb ? 'Tier 1 (Web Developer Job Simulation)' : 'Tier 1 (Simulated Python Experience)');

  const { state, reason: notEligibleReason } = resolveInternshipState(loading, enrollment, crashEnrollment);

  const allTicketsPassed = tasks.length === 5 && tasks.every((t) => t.status === 'passed');
  const needsFinalReport = allTicketsPassed && !enrollment?.finalReport;

  return (
    <div
      data-testid="internship-panel-modal"
      role="dialog"
      aria-modal="true"
      aria-label={`${displayTitle} · Virtual Simulation Desk`}
      onClick={(e) => {
        if (!activeWorkspaceTicket && !showReportModal && !viewingCertificateId && e.target === e.currentTarget) {
          onClose();
        }
      }}
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
              
              <h2 data-testid="internship-panel-title" style={{ margin: 0, fontSize: 20, fontWeight: 900, color: 'var(--text)' }}>
                {displayTitle} · Virtual Simulation Desk
              </h2>
            </div>
            <p data-testid="internship-engineer-info" style={{ margin: '4px 0 0 0', fontSize: 13, color: 'var(--t3)' }}>
              Assigned Engineer: <strong style={{ color: 'var(--text)' }}>{studentName}</strong> ·{' '}
              {tierLabel}
            </p>
          </div>
          <button
            type="button"
            data-testid="btn-close-internship-panel"
            aria-label="Close internship panel"
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
          <div data-testid="internship-panel-error" style={{ padding: '12px 16px', borderRadius: 10, background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', fontSize: 13 }}>
            {panelError}
          </div>
        )}

        {/* State Banner */}
        <InternshipStatusBanner
          state={state}
          notEligibleReason={notEligibleReason}
          track={track}
          tierName={tierConfig?.name}
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
          enrollment.tier === 't2_virtual_team' ? (
            <Tier2Desk
              enrollment={enrollment}
              tasks={tasks}
              team={team}
              members={members}
              sprints={sprints}
              isSolo={isSolo}
              onUpdateRepo={updateRepo}
              onSubmitPrLink={submitPrLink}
              onSubmitSprint={submitSprint}
              onSubmitStandup={submitStandup}
              onSubmitDemoUrl={submitDemoUrl}
              onSelectTicket={(task) => {
                if (onSelectTicket) onSelectTicket(task);
                else setActiveWorkspaceTicket(task);
              }}
            />
          ) : (
            <Tier1Desk
              enrollment={enrollment}
              tasks={tasks}
              needsFinalReport={needsFinalReport}
              onExtendDeadline={extendDeadline}
              isExtending={isExtending}
              onOpenReport={onOpenReport || (() => setShowReportModal(true))}
              onSelectTicket={(task) => {
                if (onSelectTicket) onSelectTicket(task);
                else setActiveWorkspaceTicket(task);
              }}
            />
          )
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
            planTitle={displayTitle}
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
