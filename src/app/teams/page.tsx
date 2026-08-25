'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/context/AuthContext';
import {
  TeamsApiService,
  HackathonSquad,
  TeamRole
} from '@/lib/api/teamsApi';

export default function TeamsHackathonPage() {
  const { user } = useAuth();
  const studentId = (user && typeof user.id === 'string') ? user.id : 'demo_student_01';
  const studentName = (user && typeof (user as any).name === 'string') ? (user as any).name : 'Alex Mercer';

  const [squads, setSquads] = useState<HackathonSquad[]>([]);
  const [selectedSquadId, setSelectedSquadId] = useState<string>('');
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  // Form states
  const [newSquadName, setNewSquadName] = useState<string>('');
  const [newHackathonTitle, setNewHackathonTitle] = useState<string>('Global AI & Cloud Distributed Systems Hackathon');
  const [newRole, setNewRole] = useState<TeamRole>('backend_lead');
  const [newRepoUrl, setNewRepoUrl] = useState<string>('https://github.com/my-org/cloud-hackathon');

  // Submit project modal state
  const [submittingLiveUrl, setSubmittingLiveUrl] = useState<string>('https://my-demo.pinit.app');
  const [isSubmittingProject, setIsSubmittingProject] = useState<boolean>(false);

  useEffect(() => {
    const list = TeamsApiService.getSquads();
    setSquads(list);
    if (list.length > 0 && !selectedSquadId) {
      setSelectedSquadId(list[0].id);
    }
  }, [selectedSquadId]);

  const activeSquad = squads.find(s => s.id === selectedSquadId) || squads[0];

  const handleCreateSquad = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSquadName.trim() || !newRepoUrl.trim()) return;

    const created = TeamsApiService.createSquad({
      name: newSquadName,
      hackathonTitle: newHackathonTitle,
      teamLeadStudentId: studentId,
      teamLeadName: studentName,
      teamLeadRole: newRole,
      repoUrl: newRepoUrl,
    });

    setSquads(TeamsApiService.getSquads());
    setSelectedSquadId(created.id);
    setShowCreateModal(false);
    setNewSquadName('');
  };

  const handleJoinSquad = (role: TeamRole) => {
    if (!activeSquad) return;
    const updated = TeamsApiService.joinSquad({
      squadId: activeSquad.id,
      studentId,
      name: studentName,
      role,
    });
    setSquads(TeamsApiService.getSquads());
  };

  const handleToggleMilestone = (milestoneId: string) => {
    if (!activeSquad) return;
    TeamsApiService.toggleMilestone(activeSquad.id, milestoneId);
    setSquads(TeamsApiService.getSquads());
  };

  const handleSubmitTeamProject = async () => {
    if (!activeSquad || isSubmittingProject) return;
    setIsSubmittingProject(true);
    try {
      await TeamsApiService.submitTeamProject({
        squadId: activeSquad.id,
        liveUrl: submittingLiveUrl,
      });
      setSquads(TeamsApiService.getSquads());
    } catch (e: any) {
      console.error(e);
    } finally {
      setIsSubmittingProject(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary, #090d16)', color: '#f1f5f9', padding: '24px 32px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 28 }}>👥</span>
            <div>
              <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, letterSpacing: '-0.5px' }}>
                Team Projects & Hackathon Workspace
              </h1>
              <p style={{ margin: 0, fontSize: 13, color: '#94a3b8' }}>
                Squad Formations · Multi-Role Milestone Tracking · Multi-Contributor Evidence Ledger
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button
            onClick={() => setShowCreateModal(true)}
            style={{ padding: '8px 16px', borderRadius: 8, background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer' }}
          >
            + Form New Squad
          </button>
          <Link
            href="/dashboard"
            style={{ padding: '8px 16px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', color: '#cbd5e1', fontSize: 13, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            ← Career OS Dashboard
          </Link>
        </div>
      </div>

      {/* Main Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 24 }}>
        {/* Left: Squad Directory */}
        <div>
          <h2 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 12px 0', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Active Hackathon Squads ({squads.length})
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {squads.map(squad => {
              const isSelected = squad.id === activeSquad?.id;
              const isMember = squad.members.some(m => m.studentId === studentId);
              return (
                <div
                  key={squad.id}
                  onClick={() => setSelectedSquadId(squad.id)}
                  style={{
                    padding: 14,
                    borderRadius: 10,
                    background: isSelected ? 'rgba(79, 70, 229, 0.15)' : 'rgba(255,255,255,0.02)',
                    border: isSelected ? '1px solid #6366f1' : '1px solid rgba(255,255,255,0.06)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: isSelected ? '#a5b4fc' : '#f8fafc' }}>
                      {squad.name}
                    </span>
                    <span style={{
                      fontSize: 10,
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: 4,
                      textTransform: 'uppercase',
                      background: squad.status === 'verified' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(234, 179, 8, 0.15)',
                      color: squad.status === 'verified' ? '#34d399' : '#facc15'
                    }}>
                      {squad.status}
                    </span>
                  </div>

                  <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 8, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {squad.hackathonTitle}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11 }}>
                    <span style={{ color: '#cbd5e1' }}>👥 {squad.members.length} Members</span>
                    {isMember && <span style={{ color: '#38bdf8', fontWeight: 700 }}>★ Your Team</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Active Squad Workspace */}
        {activeSquad && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Squad Hero Banner */}
            <div style={{ padding: 24, borderRadius: 16, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {activeSquad.hackathonTitle}
                  </span>
                  <h2 style={{ margin: '4px 0 8px 0', fontSize: 22, fontWeight: 800 }}>{activeSquad.name}</h2>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center', fontSize: 13, color: '#94a3b8' }}>
                    <a href={activeSquad.repoUrl} target="_blank" rel="noreferrer" style={{ color: '#38bdf8', textDecoration: 'none' }}>
                      🔗 GitHub Repo
                    </a>
                    {activeSquad.liveUrl && (
                      <a href={activeSquad.liveUrl} target="_blank" rel="noreferrer" style={{ color: '#34d399', textDecoration: 'none' }}>
                        🌐 Live Prototype
                      </a>
                    )}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  {activeSquad.status === 'verified' ? (
                    <div style={{ padding: '8px 16px', borderRadius: 8, background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#34d399', fontWeight: 700, fontSize: 13 }}>
                      ✓ JURY VERIFIED ({activeSquad.finalScore}/100)
                    </div>
                  ) : (
                    <button
                      onClick={handleSubmitTeamProject}
                      disabled={isSubmittingProject}
                      style={{
                        padding: '10px 20px',
                        borderRadius: 8,
                        background: 'linear-gradient(135deg, #6366f1, #9333ea)',
                        border: 'none',
                        color: '#fff',
                        fontSize: 13,
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      {isSubmittingProject ? 'Submitting to Jury...' : '🚀 Submit Project for Jury Evaluation'}
                    </button>
                  )}
                </div>
              </div>

              {activeSquad.juryFeedback && (
                <div style={{ marginTop: 16, padding: 12, borderRadius: 8, background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)', fontSize: 13, color: '#e2e8f0' }}>
                  <strong style={{ color: '#34d399' }}>Jury Feedback:</strong> {activeSquad.juryFeedback}
                </div>
              )}
            </div>

            {/* Squad Members & Role Allocation */}
            <div style={{ padding: 24, borderRadius: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>🛡️</span> Squad Roles & Task Allocation
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
                {activeSquad.members.map((member, idx) => (
                  <div key={idx} style={{ padding: 14, borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <img src={member.avatarUrl} alt={member.name} style={{ width: 36, height: 36, borderRadius: 18 }} />
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#f8fafc' }}>{member.name}</div>
                        <div style={{ fontSize: 11, color: '#a5b4fc', fontWeight: 600, textTransform: 'uppercase' }}>
                          {member.role.replace('_', ' ')}
                        </div>
                      </div>
                    </div>

                    <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 8 }}>
                      Contribution: <strong style={{ color: '#f8fafc' }}>{member.contributionPct}%</strong>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {member.assignedTasks.map((t, tIdx) => (
                        <span key={tIdx} style={{ fontSize: 11, color: '#cbd5e1', background: 'rgba(255,255,255,0.04)', padding: '3px 6px', borderRadius: 4 }}>
                          • {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {!activeSquad.members.some(m => m.studentId === studentId) && (
                <div style={{ marginTop: 16, display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ fontSize: 13, color: '#94a3b8' }}>Join this Squad as:</span>
                  {(['frontend_lead', 'backend_lead', 'devops_cloud', 'data_engineer'] as const).map(role => (
                    <button
                      key={role}
                      onClick={() => handleJoinSquad(role)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 6,
                        background: 'rgba(79, 70, 229, 0.15)',
                        border: '1px solid #6366f1',
                        color: '#a5b4fc',
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      + {role.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sprints & Milestones Checklist */}
            <div style={{ padding: 24, borderRadius: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>🎯</span> Sprint Milestones & Provenance Checklist
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {activeSquad.milestones.map(milestone => (
                  <div
                    key={milestone.id}
                    onClick={() => handleToggleMilestone(milestone.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: 14,
                      borderRadius: 8,
                      background: milestone.isCompleted ? 'rgba(16, 185, 129, 0.06)' : 'rgba(255,255,255,0.02)',
                      border: milestone.isCompleted ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(255,255,255,0.05)',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: 18 }}>{milestone.isCompleted ? '✅' : '⬜'}</span>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: milestone.isCompleted ? '#34d399' : '#f8fafc', textDecoration: milestone.isCompleted ? 'line-through' : 'none' }}>
                          {milestone.title}
                        </div>
                        <div style={{ fontSize: 12, color: '#94a3b8' }}>{milestone.description}</div>
                      </div>
                    </div>
                    <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>Due: {milestone.dueDate}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Form New Squad Modal */}
      {showCreateModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ width: 480, background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: 24 }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: 18, fontWeight: 800 }}>Assemble New Hackathon Squad</h3>
            <form onSubmit={handleCreateSquad} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>Squad Name</label>
                <input
                  type="text"
                  value={newSquadName}
                  onChange={e => setNewSquadName(e.target.value)}
                  placeholder="e.g. Nexus Distributed Core"
                  required
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 13 }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>Your Role in Squad</label>
                <select
                  value={newRole}
                  onChange={e => setNewRole(e.target.value as any)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 13 }}
                >
                  <option value="backend_lead">Backend Lead (APIs & Microservices)</option>
                  <option value="frontend_lead">Frontend Lead (React/Next.js)</option>
                  <option value="devops_cloud">DevOps / Cloud Architect</option>
                  <option value="data_engineer">Data / SQL Engineer</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>GitHub Repository URL</label>
                <input
                  type="url"
                  value={newRepoUrl}
                  onChange={e => setNewRepoUrl(e.target.value)}
                  placeholder="https://github.com/org/repo"
                  required
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 13 }}
                />
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  style={{ flex: 1, padding: 12, borderRadius: 8, background: 'rgba(255,255,255,0.05)', color: '#cbd5e1', border: 'none', cursor: 'pointer', fontSize: 13 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ flex: 1, padding: 12, borderRadius: 8, background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700 }}
                >
                  Create Squad
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
