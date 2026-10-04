'use client';

import React, { useState } from 'react';
import type {
  ClientInternshipEnrollment,
  ClientInternshipTask,
  ClientInternshipTeam,
  ClientInternshipTeamMember,
  ClientInternshipSprint,
} from '@/lib/internships/types';
import type { ProductBrief } from '@/lib/internships/productBrief';
import { TeamCard } from './TeamCard';
import { BacklogCard } from './BacklogCard';
import { SprintBoardCard } from './SprintBoardCard';
import { StandupModal } from './StandupModal';
import { TicketListCard } from './TicketListCard';

export interface Tier2DeskProps {
  enrollment: ClientInternshipEnrollment;
  tasks: ClientInternshipTask[];
  team: ClientInternshipTeam | null;
  members: ClientInternshipTeamMember[];
  sprints: ClientInternshipSprint[];
  isSolo: boolean;
  onUpdateRepo?: (repoUrl: string) => Promise<boolean>;
  onSubmitPrLink?: (sprintId: string, prUrl: string) => Promise<boolean>;
  onSubmitSprint?: (sprintId: string) => Promise<boolean>;
  onSubmitStandup?: (data: { week: number; done: string; next: string; blockers: string }) => Promise<boolean>;
  onSubmitDemoUrl?: (url: string) => Promise<boolean>;
  onStartDefense?: () => void;
  onSelectTicket?: (task: ClientInternshipTask) => void;
}

export const Tier2Desk: React.FC<Tier2DeskProps> = ({
  tasks,
  team,
  members,
  sprints,
  isSolo,
  onUpdateRepo,
  onSubmitPrLink,
  onSubmitSprint,
  onSubmitStandup,
  onSubmitDemoUrl,
  onStartDefense,
  onSelectTicket,
}) => {
  const [standupWeek, setStandupWeek] = useState<number | null>(null);
  const [demoInput, setDemoInput] = useState('');
  const [isSubmittingDemo, setIsSubmittingDemo] = useState(false);
  const [demoMsg, setDemoMsg] = useState<string | null>(null);

  const brief = (team?.projectBrief as ProductBrief | null) || null;

  const handleDemoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onSubmitDemoUrl || !demoInput.trim()) return;
    setIsSubmittingDemo(true);
    setDemoMsg(null);
    try {
      const ok = await onSubmitDemoUrl(demoInput.trim());
      if (ok) {
        setDemoMsg('✓ Live demo URL verified and recorded!');
      } else {
        setDemoMsg('Failed to verify demo URL. Ensure it starts with https:// and is reachable.');
      }
    } catch (err) {
      setDemoMsg(err instanceof Error ? err.message : 'Error submitting demo');
    } finally {
      setIsSubmittingDemo(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* 1. Squad / Team Card */}
      <TeamCard
        team={team}
        members={members}
        isSolo={isSolo}
        onUpdateRepo={onUpdateRepo}
      />

      {/* 2. Product Brief & Backlog */}
      {brief && <BacklogCard brief={brief} />}

      {/* 3. 4-Week Sprint Schedule */}
      {sprints.length > 0 && (
        <SprintBoardCard
          sprints={sprints}
          onSubmitPrLink={onSubmitPrLink || (async () => true)}
          onSubmitSprint={onSubmitSprint || (async () => true)}
          onOpenStandup={(w) => setStandupWeek(w)}
        />
      )}

      {/* 4. Assigned Sprint Tasks & Engineering Tickets */}
      {tasks && tasks.length > 0 && (
        <TicketListCard
          tasks={tasks}
          onSelectTicket={onSelectTicket}
        />
      )}

      {/* 5. Final Demo & Oral Defense Card */}
      <div
        style={{
          borderRadius: 16,
          padding: 22,
          background: 'rgba(15, 23, 42, 0.65)',
          border: '1.5px solid rgba(99, 102, 241, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 22 }}>🎓</span>
          <div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: '#ffffff' }}>
              Final Deployment Demo & AI Oral Defense
            </h3>
            <span style={{ fontSize: 12, color: '#94a3b8' }}>
              Probed live https deployment URL and capstone defense interview
            </span>
          </div>
        </div>

        {onSubmitDemoUrl && (
          <form onSubmit={handleDemoSubmit} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <input
              type="url"
              placeholder="https://your-service.onrender.com"
              value={demoInput}
              onChange={(e) => setDemoInput(e.target.value)}
              style={{
                flex: 1,
                minWidth: 240,
                background: '#0f172a',
                border: '1px solid #475569',
                borderRadius: 8,
                padding: '8px 12px',
                fontSize: 12.5,
                color: '#fff',
              }}
            />
            <button
              type="submit"
              disabled={isSubmittingDemo || !demoInput.trim()}
              style={{
                padding: '8px 16px',
                borderRadius: 8,
                background: '#4f46e5',
                color: '#fff',
                border: 'none',
                fontSize: 12.5,
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              {isSubmittingDemo ? 'Probing...' : 'Verify Demo URL'}
            </button>
          </form>
        )}

        {demoMsg && (
          <span style={{ fontSize: 12, fontWeight: 700, color: demoMsg.startsWith('✓') ? '#34d399' : '#f87171' }}>
            {demoMsg}
          </span>
        )}

        {onStartDefense && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
            <button
              type="button"
              onClick={onStartDefense}
              style={{
                padding: '8px 20px',
                borderRadius: 8,
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: '#ffffff',
                border: 'none',
                fontSize: 13,
                fontWeight: 900,
                cursor: 'pointer',
              }}
            >
              🎙️ Launch AI Oral Defense →
            </button>
          </div>
        )}
      </div>

      {/* Standup Modal */}
      {standupWeek !== null && (
        <StandupModal
          week={standupWeek}
          isOpen={true}
          onClose={() => setStandupWeek(null)}
          onSubmitStandup={onSubmitStandup || (async () => true)}
        />
      )}
    </div>
  );
};
