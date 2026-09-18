'use client';

import React, { useState, useEffect } from 'react';
import { toast } from '@/lib/store/useAppStore';

interface SquadMember {
  id: string;
  name: string;
  avatar: string;
  role: string;
}

interface SquadProject {
  id: string;
  title: string;
  description: string;
  role: string;
  status: string;
  progress: number;
  repoUrl?: string;
  members: SquadMember[];
  techStack: string[];
  deadline: string;
}

interface ProjectInvitation {
  id: string;
  type: string;
  title: string;
  sender: {
    id: string;
    name: string;
    avatar: string;
  };
  receiverName?: string;
  role?: string;
  details: string;
  status: 'pending' | 'accepted' | 'declined';
  created_at?: string;
}

interface SquadProjectsViewProps {
  onOpenInviteModal?: (preselectedProject?: string) => void;
}

export const SquadProjectsView: React.FC<SquadProjectsViewProps> = ({ onOpenInviteModal }) => {
  const [loading, setLoading] = useState(true);
  const [squadProjects, setSquadProjects] = useState<SquadProject[]>([]);
  const [incomingInvites, setIncomingInvites] = useState<ProjectInvitation[]>([]);
  const [sentInvites, setSentInvites] = useState<ProjectInvitation[]>([]);
  const [respondingId, setRespondingId] = useState<string | null>(null);

  const fetchSquadData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/friends/projects');
      const data = await res.json();
      if (data.ok) {
        setSquadProjects(data.squadProjects || []);
        setIncomingInvites(data.incomingInvites || []);
        setSentInvites(data.sentInvites || []);
      }
    } catch (err) {
      console.error('Failed to load squad projects data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSquadData();
  }, []);

  const handleRespond = async (inviteId: string, action: 'accept' | 'decline') => {
    try {
      setRespondingId(inviteId);
      const res = await fetch('/api/friends/projects', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inviteId, action })
      });
      const data = await res.json();
      if (data.ok) {
        if (action === 'accept') {
          toast.success('Squad Joined!', 'You are now an active collaborator on this project squad.');
        } else {
          toast.info('Invitation Declined', 'Squad invite has been declined.');
        }
        fetchSquadData();
      } else {
        toast.error('Error', data.error || 'Failed to update invitation');
      }
    } catch (err) {
      toast.error('Network Error', 'Could not respond to project invite');
    } finally {
      setRespondingId(null);
    }
  };

  return (
    <div className="squad-projects-container" style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      
      {/* ── Squad Header Banner ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 24px',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(15, 23, 42, 0.7) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.25)',
        borderRadius: 16
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 24 }}>👥</span>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#ffffff', margin: 0 }}>
              Squad Collaboration & Group Projects
            </h2>
          </div>
          <p style={{ fontSize: 13, color: '#94a3b8', margin: '6px 0 0' }}>
            Build production-ready applications with your friends, divide engineering roles, and level up together.
          </p>
        </div>

        <button
          className="friends-btn friends-btn-primary"
          style={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            border: '1px solid rgba(52, 211, 153, 0.4)',
            padding: '10px 18px',
            fontSize: 13,
            fontWeight: 700
          }}
          onClick={() => onOpenInviteModal?.()}
        >
          + Invite Friend to Squad
        </button>
      </div>

      {/* ── Incoming Invitations Section ── */}
      {incomingInvites.length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <span style={{ fontSize: 16 }}>📩</span>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#ffffff', margin: 0 }}>
              Incoming Squad Invitations ({incomingInvites.length})
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 14 }}>
            {incomingInvites.map((inv) => (
              <div
                key={inv.id}
                style={{
                  padding: 18,
                  background: 'rgba(15, 23, 42, 0.85)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: 14,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    padding: '3px 8px',
                    borderRadius: 6,
                    background: 'rgba(16, 185, 129, 0.2)',
                    color: '#34d399',
                    border: '1px solid rgba(16, 185, 129, 0.4)'
                  }}>
                    Squad Invitation
                  </span>
                  <span style={{ fontSize: 11, color: '#64748b' }}>{inv.status}</span>
                </div>

                <div style={{ fontSize: 16, fontWeight: 700, color: '#ffffff' }}>{inv.title}</div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <img
                    src={inv.sender.avatar}
                    alt={inv.sender.name}
                    style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: '#e2e8f0' }}>Invited by {inv.sender.name}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8' }}>{inv.details}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                  <button
                    className="friends-btn friends-btn-primary"
                    style={{
                      flex: 1,
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      fontSize: 12,
                      padding: '8px 12px'
                    }}
                    disabled={respondingId === inv.id}
                    onClick={() => handleRespond(inv.id, 'accept')}
                  >
                    ✓ Accept & Join Squad
                  </button>
                  <button
                    className="friends-btn friends-btn-secondary"
                    style={{ flex: 1, fontSize: 12, padding: '8px 12px' }}
                    disabled={respondingId === inv.id}
                    onClick={() => handleRespond(inv.id, 'decline')}
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Active Squad Projects Section ── */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 16 }}>🚀</span>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#ffffff', margin: 0 }}>
              Active Collaborative Squads ({squadProjects.length})
            </h3>
          </div>
          <span style={{ fontSize: 12, color: '#94a3b8' }}>Synced with PinIT Projects</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 16 }}>
          {squadProjects.map((proj) => (
            <div
              key={proj.id}
              style={{
                padding: 20,
                background: 'rgba(15, 23, 42, 0.75)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 16,
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
                transition: 'all 0.2s ease'
              }}
            >
              {/* Top Row: Title & Status */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                <div>
                  <h4 style={{ fontSize: 16, fontWeight: 700, color: '#ffffff', margin: '0 0 6px' }}>{proj.title}</h4>
                  <p style={{ fontSize: 12, color: '#94a3b8', margin: 0, lineHeight: 1.4 }}>{proj.description}</p>
                </div>
                <span style={{
                  padding: '4px 10px',
                  borderRadius: 8,
                  fontSize: 11,
                  fontWeight: 700,
                  background: 'rgba(99, 102, 241, 0.15)',
                  color: '#818cf8',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  whiteSpace: 'nowrap'
                }}>
                  {proj.status}
                </span>
              </div>

              {/* Progress Bar */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, marginBottom: 6 }}>
                  <span style={{ color: '#94a3b8' }}>Milestone Progress</span>
                  <span style={{ color: '#34d399', fontWeight: 700 }}>{proj.progress}%</span>
                </div>
                <div style={{ width: '100%', height: 6, background: 'rgba(255, 255, 255, 0.06)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{
                    width: `${proj.progress}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #10b981, #06b6d4)',
                    borderRadius: 4
                  }} />
                </div>
              </div>

              {/* Tech Stack Pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {proj.techStack.map((tech, idx) => (
                  <span key={idx} className="mini-skill-pill" style={{ fontSize: 10.5 }}>{tech}</span>
                ))}
              </div>

              {/* Squad Members Roster */}
              <div style={{
                padding: '12px 14px',
                background: 'rgba(30, 41, 59, 0.4)',
                borderRadius: 12,
                border: '1px solid rgba(255, 255, 255, 0.05)'
              }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>
                  Squad Team ({proj.members.length})
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {proj.members.map((m) => (
                    <div key={m.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <img src={m.avatar} alt={m.name} style={{ width: 26, height: 26, borderRadius: '50%', objectFit: 'cover' }} />
                        <span style={{ fontSize: 12, fontWeight: 600, color: '#f1f5f9' }}>{m.name}</span>
                      </div>
                      <span style={{ fontSize: 11, color: '#38bdf8', background: 'rgba(56, 189, 248, 0.1)', padding: '2px 6px', borderRadius: 4 }}>
                        {m.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 6 }}>
                <span style={{ fontSize: 11, color: '#64748b' }}>Target: {proj.deadline}</span>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    className="friends-btn friends-btn-secondary"
                    style={{ padding: '6px 12px', fontSize: 11.5 }}
                    onClick={() => onOpenInviteModal?.(proj.title)}
                  >
                    + Add Peer
                  </button>
                  <a
                    href="/projects"
                    className="friends-btn friends-btn-primary"
                    style={{
                      padding: '6px 12px',
                      fontSize: 11.5,
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4
                    }}
                  >
                    Open Squad Workspace →
                  </a>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
};