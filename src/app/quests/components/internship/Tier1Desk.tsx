'use client';

import React from 'react';
import type { ClientInternshipEnrollment, ClientInternshipTask } from '@/lib/internships/types';
import { InternshipDeadlineBanner } from './InternshipDeadlineBanner';
import { CompanyProfileCard } from './CompanyProfileCard';
import { TicketListCard } from './TicketListCard';

export interface Tier1DeskProps {
  enrollment: ClientInternshipEnrollment;
  tasks: ClientInternshipTask[];
  needsFinalReport: boolean;
  onExtendDeadline: () => void | Promise<void>;
  isExtending: boolean;
  onOpenReport: () => void;
  onSelectTicket: (task: ClientInternshipTask) => void;
}

export const Tier1Desk: React.FC<Tier1DeskProps> = ({
  enrollment,
  tasks,
  needsFinalReport,
  onExtendDeadline,
  isExtending,
  onOpenReport,
  onSelectTicket,
}) => {
  return (
    <>
      <InternshipDeadlineBanner
        dueAt={enrollment.dueAt}
        extended={enrollment.extended}
        status={enrollment.status}
        onRequestExtension={async () => {
          await onExtendDeadline();
        }}
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
            onClick={onOpenReport}
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
        onSelectTicket={onSelectTicket}
      />
    </>
  );
};
