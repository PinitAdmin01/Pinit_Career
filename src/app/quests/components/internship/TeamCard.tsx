'use client';

import React, { useState } from 'react';
import type { ClientInternshipTeam, ClientInternshipTeamMember } from '@/lib/internships/types';

export interface TeamCardProps {
  team: ClientInternshipTeam | null;
  members: ClientInternshipTeamMember[];
  isSolo: boolean;
  currentUserId?: string;
  onUpdateRepo?: (repoUrl: string) => Promise<boolean>;
}

export const TeamCard: React.FC<TeamCardProps> = ({
  team,
  members,
  isSolo,
  onUpdateRepo,
}) => {
  const [repoInput, setRepoInput] = useState('');
  const [isEditingRepo, setIsEditingRepo] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSaveRepo = async () => {
    if (!onUpdateRepo || !repoInput.trim()) return;
    setIsSaving(true);
    setErrorMsg(null);
    try {
      const ok = await onUpdateRepo(repoInput.trim());
      if (ok) {
        setIsEditingRepo(false);
        setRepoInput('');
      } else {
        setErrorMsg('Failed to verify GitHub repository. Ensure it is public.');
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Error setting repository');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      style={{
        borderRadius: 16,
        padding: 22,
        background: 'rgba(15, 23, 42, 0.65)',
        border: '1.5px solid rgba(99, 102, 241, 0.25)',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.35)',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      {/* Top Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 24 }}>{isSolo ? '👤' : '👥'}</span>
          <div>
            <h3 style={{ margin: 0, fontSize: 17, fontWeight: 900, color: '#ffffff' }}>
              {isSolo ? 'Solo Engineering Sprint Mode' : 'Virtual Engineering Squad'}
            </h3>
            <span style={{ fontSize: 12, color: '#94a3b8' }}>
              {isSolo
                ? 'Backlog scaled to 1 engineer with simulated team peer reviews'
                : `${members.length} Assigned Engineers · 4-Week Sprint Schedule`}
            </span>
          </div>
        </div>

        <span
          style={{
            fontSize: 11,
            fontWeight: 800,
            padding: '4px 10px',
            borderRadius: 8,
            background: isSolo ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)',
            border: `1px solid ${isSolo ? 'rgba(245, 158, 11, 0.35)' : 'rgba(16, 185, 129, 0.35)'}`,
            color: isSolo ? '#fbbf24' : '#34d399',
            textTransform: 'uppercase',
          }}
        >
          {isSolo ? '● Solo Mode' : '● Team Active'}
        </span>
      </div>

      {/* GitHub Repository Row */}
      <div
        style={{
          borderRadius: 10,
          padding: '12px 16px',
          background: 'rgba(30, 41, 59, 0.5)',
          border: '1px solid rgba(148, 163, 184, 0.15)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 16 }}>🐙</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#cbd5e1' }}>Team Repository:</span>
          {team?.repoUrl ? (
            <a
              href={team.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: 13,
                color: '#818cf8',
                textDecoration: 'underline',
                fontWeight: 700,
                wordBreak: 'break-all',
              }}
            >
              {team.repoUrl.replace('https://github.com/', '')} ↗
            </a>
          ) : (
            <span style={{ fontSize: 12.5, color: '#f59e0b', fontWeight: 600 }}>
              ⚠️ No GitHub repo registered yet
            </span>
          )}
        </div>

        {!isEditingRepo ? (
          onUpdateRepo && (
            <button
              type="button"
              onClick={() => setIsEditingRepo(true)}
              style={{
                background: 'rgba(99, 102, 241, 0.2)',
                border: '1px solid rgba(99, 102, 241, 0.4)',
                borderRadius: 8,
                padding: '4px 12px',
                fontSize: 12,
                fontWeight: 700,
                color: '#c7d2fe',
                cursor: 'pointer',
              }}
            >
              {team?.repoUrl ? 'Change Repo' : 'Set Repo'}
            </button>
          )
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <input
              type="url"
              placeholder="https://github.com/org/repo"
              value={repoInput}
              onChange={(e) => setRepoInput(e.target.value)}
              style={{
                background: '#0f172a',
                border: '1px solid #475569',
                borderRadius: 6,
                padding: '4px 8px',
                fontSize: 12,
                color: '#fff',
                width: 220,
              }}
            />
            <button
              type="button"
              onClick={handleSaveRepo}
              disabled={isSaving || !repoInput.trim()}
              style={{
                background: '#4f46e5',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                padding: '4px 10px',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {isSaving ? 'Verifying...' : 'Save'}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEditingRepo(false);
                setErrorMsg(null);
              }}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                fontSize: 12,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {errorMsg && (
        <span style={{ fontSize: 12, color: '#f87171', fontWeight: 600 }}>{errorMsg}</span>
      )}

      {/* Team Members List */}
      <div>
        <h4 style={{ margin: '0 0 10px 0', fontSize: 13, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>
          Roster & Task Assignment
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
          {members.map((member, idx) => (
            <div
              key={member.studentId || idx}
              style={{
                borderRadius: 10,
                padding: '10px 14px',
                background: 'rgba(30, 41, 59, 0.4)',
                border: '1px solid rgba(148, 163, 184, 0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366f1, #3b82f6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 14,
                  fontWeight: 900,
                  color: '#fff',
                }}
              >
                {idx + 1}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <span style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#ffffff', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                  Engineer #{idx + 1}
                </span>
                <span style={{ fontSize: 11, color: '#64748b' }}>
                  {idx === 0 ? 'Lead Dev (You)' : 'Sprint Peer'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
