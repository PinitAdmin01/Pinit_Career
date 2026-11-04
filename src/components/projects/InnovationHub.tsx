'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from '@/lib/store/useAppStore';
import {
  TeamsApiService,
  HackathonSquad,
  TeamRole,
} from '@/lib/api/teamsApi';

export interface InnovationChatMessage {
  id: string;
  squadId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  senderRole?: string;
  text: string;
  timestamp: number;
}

export interface JoinRequest {
  id: string;
  squadId: string;
  studentId: string;
  studentName: string;
  studentAvatar?: string;
  role: TeamRole;
  pitch: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: number;
}

interface InnovationHubProps {
  studentId: string;
  studentName: string;
  studentAvatar?: string;
  initialJoinSquadId?: string;
}

export const InnovationHub: React.FC<InnovationHubProps> = ({
  studentId,
  studentName,
  studentAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
  initialJoinSquadId,
}) => {
  const [squads, setSquads] = useState<HackathonSquad[]>([]);
  const [selectedSquadId, setSelectedSquadId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showInviteModal, setShowInviteModal] = useState<boolean>(false);
  const [showJoinRequestModal, setShowJoinRequestModal] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'workspace' | 'discussion' | 'requests'>('workspace');

  // Form states for Start Project
  const [newSquadName, setNewSquadName] = useState<string>('');
  const [newHackathonTitle, setNewHackathonTitle] = useState<string>('Distributed AI & Autonomous Cloud Agents');
  const [newProblemStatement, setNewProblemStatement] = useState<string>('');
  const [newMyRole, setNewMyRole] = useState<TeamRole>('backend_lead');
  const [newRepoUrl, setNewRepoUrl] = useState<string>('');
  const [newIsPublic, setNewIsPublic] = useState<boolean>(true);

  // Form state for Join Request
  const [joinRole, setJoinRole] = useState<TeamRole>('frontend_lead');
  const [joinPitch, setJoinPitch] = useState<string>('');

  // Discussion Chat State
  const [chatMessages, setChatMessages] = useState<InnovationChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  // Join Requests State
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);

  // Load squads on mount
  useEffect(() => {
    const list = TeamsApiService.getSquads(studentId);
    setSquads(list);

    if (list.length > 0) {
      if (initialJoinSquadId && list.some((s) => s.id === initialJoinSquadId)) {
        setSelectedSquadId(initialJoinSquadId);
      } else if (!selectedSquadId) {
        setSelectedSquadId(list[0].id);
      }
    }

    const unsub = TeamsApiService.subscribeToSquadUpdates(() => {
      const updated = TeamsApiService.getSquads(studentId);
      setSquads(updated);
    });
    return () => unsub();
  }, [studentId, initialJoinSquadId]);

  const activeSquad = squads.find((s) => s.id === selectedSquadId) || squads[0];

  // Load chat messages when activeSquad changes
  useEffect(() => {
    if (!activeSquad) return;
    const storageKey = `pinit_innovation_chat_${activeSquad.id}`;
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      try {
        setChatMessages(JSON.parse(raw));
      } catch {
        setChatMessages([]);
      }
    } else {
      // Default initial welcome discussion messages
      const initialMsgs: InnovationChatMessage[] = [
        {
          id: `msg_init_1_${activeSquad.id}`,
          squadId: activeSquad.id,
          senderId: activeSquad.teamLeadStudentId,
          senderName: activeSquad.members[0]?.name || 'Team Lead',
          senderRole: 'Team Lead',
          senderAvatar: activeSquad.members[0]?.avatarUrl,
          text: `Welcome to the ${activeSquad.name} innovation workspace! Let's discuss our architecture contracts, task distributions, and MVP deliverables here.`,
          timestamp: activeSquad.createdAt || Date.now() - 3600000,
        },
      ];
      setChatMessages(initialMsgs);
      localStorage.setItem(storageKey, JSON.stringify(initialMsgs));
    }
  }, [activeSquad?.id]);

  // Load join requests
  useEffect(() => {
    if (!activeSquad) return;
    const key = `pinit_join_requests_${activeSquad.id}`;
    const raw = localStorage.getItem(key);
    if (raw) {
      try {
        setJoinRequests(JSON.parse(raw));
      } catch {
        setJoinRequests([]);
      }
    } else {
      setJoinRequests([]);
    }
  }, [activeSquad?.id]);

  // Scroll chat to bottom
  useEffect(() => {
    if (activeTab === 'discussion') {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, activeTab]);

  // Handle Send Chat Message
  const handleSendMessage = () => {
    if (!inputMessage.trim() || !activeSquad) return;
    const myMember = activeSquad.members.find((m) => m.studentId === studentId);
    const newMsg: InnovationChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      squadId: activeSquad.id,
      senderId: studentId,
      senderName: studentName,
      senderAvatar: studentAvatar,
      senderRole: myMember?.role ? myMember.role.replace('_', ' ') : 'Contributor',
      text: inputMessage.trim(),
      timestamp: Date.now(),
    };

    const updated = [...chatMessages, newMsg];
    setChatMessages(updated);
    setInputMessage('');
    localStorage.setItem(`pinit_innovation_chat_${activeSquad.id}`, JSON.stringify(updated));
  };

  // Handle Create New Squad
  const handleCreateSquad = () => {
    if (!newSquadName.trim()) {
      toast.error('Project Name Required', 'Please enter a name for your innovation project.');
      return;
    }

    const created = TeamsApiService.createSquad({
      name: newSquadName.trim(),
      hackathonTitle: newHackathonTitle.trim() || 'Collaborative Open Innovation Capstone',
      teamLeadStudentId: studentId,
      teamLeadName: studentName,
      avatarUrl: studentAvatar,
      teamLeadRole: newMyRole,
      repoUrl: newRepoUrl.trim() || `https://github.com/pinit-community/${newSquadName.toLowerCase().replace(/\s+/g, '-')}`,
    });

    toast.success('Innovation Project Launched! 🚀', `Squad "${created.name}" created. Invite peers via link or QR!`);
    setShowCreateModal(false);
    setSelectedSquadId(created.id);
    setActiveTab('discussion');

    // Reset fields
    setNewSquadName('');
    setNewProblemStatement('');
    setNewRepoUrl('');
  };

  // Handle Submit Join Request
  const handleSubmitJoinRequest = () => {
    if (!activeSquad) return;
    const newReq: JoinRequest = {
      id: `req_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      squadId: activeSquad.id,
      studentId,
      studentName,
      studentAvatar,
      role: joinRole,
      pitch: joinPitch.trim() || 'Excited to contribute to this innovation build!',
      status: 'pending',
      createdAt: Date.now(),
    };

    const key = `pinit_join_requests_${activeSquad.id}`;
    const existing = [...joinRequests, newReq];
    setJoinRequests(existing);
    localStorage.setItem(key, JSON.stringify(existing));

    toast.success('Join Request Dispatched! 📨', `Team Lead has been notified of your request to join as ${joinRole.replace('_', ' ')}.`);
    setShowJoinRequestModal(false);
    setJoinPitch('');
  };

  // Handle Accept Join Request (for team lead)
  const handleAcceptRequest = (req: JoinRequest) => {
    if (!activeSquad) return;
    // Add member to squad
    TeamsApiService.joinSquad({
      squadId: activeSquad.id,
      studentId: req.studentId,
      name: req.studentName,
      role: req.role,
      avatarUrl: req.studentAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
    });

    // Update request status
    const key = `pinit_join_requests_${activeSquad.id}`;
    const updatedReqs = joinRequests.map((r) => (r.id === req.id ? { ...r, status: 'accepted' as const } : r));
    setJoinRequests(updatedReqs);
    localStorage.setItem(key, JSON.stringify(updatedReqs));

    toast.success('Peer Added to Squad! 🎉', `${req.studentName} is now active in your innovation project.`);
  };

  // Build Invite Link URL
  const inviteUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/projects?tab=innovation&join=${activeSquad?.id || ''}`
    : `https://pinit.app/projects?tab=innovation&join=${activeSquad?.id || ''}`;

  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `Join our collaborative engineering project "${activeSquad?.name || 'PinIT Squad'}" on PinIT Career OS! 🚀\n\nInvite Link: ${inviteUrl}`
  )}`;

  const isUserMember = activeSquad?.members?.some((m) => m.studentId === studentId);
  const isUserLead = activeSquad?.teamLeadStudentId === studentId;
  const userPendingReq = joinRequests.find((r) => r.studentId === studentId && r.status === 'pending');

  // Filter squads based on search and role
  const filteredSquads = squads.filter((s) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.hackathonTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.members.some((m) => m.role.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRole =
      selectedRoleFilter === 'all' ||
      s.members.some((m) => m.role.includes(selectedRoleFilter));

    return matchesSearch && matchesRole;
  });

  return (
    <div data-testid="innovation-hub-container">
      {/* Top Action Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
          marginBottom: 20,
        }}
      >
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: 'var(--t1)', margin: 0, letterSpacing: '-0.3px' }}>
            Collaborative Innovation Projects & Squads
          </h2>
          <p style={{ fontSize: 14, color: 'var(--t3)', margin: '4px 0 0' }}>
            Form multi-contributor engineering projects, invite peers via link or QR code, and coordinate build sprints.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          data-testid="start-innovation-project-btn"
          style={{
            padding: '11px 22px',
            borderRadius: 12,
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: '#fff',
            fontSize: 14.5,
            fontWeight: 800,
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(16, 185, 129, 0.35)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span>🚀</span>
          <span>Start Innovation Project</span>
        </button>
      </div>

      {/* Public Project Search & Filter Row */}
      <div
        style={{
          display: 'flex',
          gap: 12,
          flexWrap: 'wrap',
          marginBottom: 24,
          alignItems: 'center',
        }}
      >
        <div style={{ flex: 1, minWidth: 260, position: 'relative' }}>
          <input
            type="text"
            data-testid="public-project-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search public innovation projects by title, stack, or role..."
            style={{
              width: '100%',
              padding: '12px 18px 12px 42px',
              borderRadius: 12,
              background: 'var(--bg2)',
              border: '1px solid var(--border)',
              color: 'var(--t1)',
              fontSize: 14,
              outline: 'none',
            }}
          />
          <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', opacity: 0.6 }}>
            🔍
          </span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: 14,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                color: 'var(--t3)',
                cursor: 'pointer',
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Role Filter Chips */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'All Projects' },
            { id: 'frontend', label: 'Frontend' },
            { id: 'backend', label: 'Backend' },
            { id: 'ai', label: 'AI & ML' },
            { id: 'devops', label: 'DevOps & Cloud' },
          ].map((chip) => (
            <button
              key={chip.id}
              onClick={() => setSelectedRoleFilter(chip.id)}
              style={{
                padding: '8px 14px',
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 700,
                border: selectedRoleFilter === chip.id ? '1px solid #38bdf8' : '1px solid var(--border)',
                background: selectedRoleFilter === chip.id ? 'rgba(56, 189, 248, 0.15)' : 'var(--bg2)',
                color: selectedRoleFilter === chip.id ? '#38bdf8' : 'var(--t2)',
                cursor: 'pointer',
              }}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Dual Grid: Left Squad Directory | Right Project Workspace */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 340px) 1fr', gap: 24 }}>
        
        {/* Left: Project Directory */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 800, textTransform: 'uppercase', color: 'var(--t3)', letterSpacing: '0.5px' }}>
            Available Projects ({filteredSquads.length})
          </div>

          {filteredSquads.length === 0 ? (
            <div style={{ padding: '24px 16px', textAlign: 'center', background: 'var(--bg2)', borderRadius: 14, border: '1px dashed var(--border)', color: 'var(--t3)', fontSize: 13.5 }}>
              No projects found matching that filter. Launch your own project to lead an innovation squad!
            </div>
          ) : filteredSquads.map((squad) => {
            const isSelected = squad.id === activeSquad?.id;
            const isMember = squad.members.some((m) => m.studentId === studentId);

            return (
              <div
                key={squad.id}
                data-testid={`squad-card-${squad.id}`}
                onClick={() => setSelectedSquadId(squad.id)}
                style={{
                  padding: 16,
                  borderRadius: 14,
                  background: isSelected ? 'rgba(56, 189, 248, 0.1)' : 'var(--bg2)',
                  border: isSelected ? '1.5px solid #38bdf8' : '1px solid var(--border)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: isSelected ? '0 4px 20px rgba(56, 189, 248, 0.15)' : 'none',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontSize: 15.5, fontWeight: 800, color: isSelected ? '#38bdf8' : 'var(--t1)' }}>
                    {squad.name}
                  </span>
                  <span
                    style={{
                      fontSize: 10.5,
                      fontWeight: 800,
                      padding: '2px 6px',
                      borderRadius: 4,
                      textTransform: 'uppercase',
                      background: squad.status === 'verified' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(234, 179, 8, 0.15)',
                      color: squad.status === 'verified' ? '#22c55e' : '#eab308',
                    }}
                  >
                    {squad.status}
                  </span>
                </div>

                <div style={{ fontSize: 12.5, color: 'var(--t3)', marginBottom: 10, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {squad.hackathonTitle}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ display: 'flex', marginLeft: 6 }}>
                      {squad.members.slice(0, 3).map((m, i) => (
                        <img
                          key={i}
                          src={m.avatarUrl}
                          alt={m.name}
                          style={{
                            width: 22,
                            height: 22,
                            borderRadius: '50%',
                            marginLeft: -6,
                            border: '1.5px solid var(--bg2)',
                          }}
                        />
                      ))}
                    </div>
                    <span style={{ color: 'var(--t2)', fontWeight: 600 }}>{squad.members.length} Members</span>
                  </div>

                  {isMember ? (
                    <span style={{ color: '#22c55e', fontWeight: 800, fontSize: 11.5 }}>✓ Enrolled</span>
                  ) : (
                    <span style={{ color: '#38bdf8', fontWeight: 700, fontSize: 11.5 }}>Public Project</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Active Project Workspace & Tabs */}
        {!activeSquad ? (
          <div style={{ padding: '48px 32px', textAlign: 'center', background: 'var(--bg2)', borderRadius: 18, border: '1px dashed var(--border)', color: 'var(--t2)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🚀</div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--t1)', margin: '0 0 8px' }}>No Innovation Projects Yet</h3>
            <p style={{ fontSize: 14, color: 'var(--t3)', maxWidth: 440, margin: '0 0 20px', lineHeight: 1.5 }}>
              Launch your first collaborative project, invite your peers via WhatsApp or QR code, and build together!
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              style={{
                padding: '10px 22px',
                borderRadius: 10,
                background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                color: '#fff',
                fontSize: 14,
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              + Launch Innovation Project
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Squad Hero Banner */}
            <div
              style={{
                padding: '24px 28px',
                borderRadius: 18,
                background: 'var(--bg2)',
                border: '1px solid var(--border)',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 14 }}>
                <div>
                  <span style={{ fontSize: 11.5, fontWeight: 900, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {activeSquad.hackathonTitle}
                  </span>
                  <h2 style={{ margin: '4px 0 8px', fontSize: 24, fontWeight: 900, color: 'var(--t1)' }}>
                    {activeSquad.name}
                  </h2>
                  <div style={{ display: 'flex', gap: 14, alignItems: 'center', fontSize: 14 }}>
                    <a
                      href={activeSquad.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: '#818cf8', textDecoration: 'none', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}
                    >
                      <span>🐙</span> GitHub Repository ↗
                    </a>
                    {activeSquad.liveUrl && (
                      <a
                        href={activeSquad.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: '#22c55e', textDecoration: 'none', fontWeight: 700 }}
                      >
                        🌐 Live Prototype ↗
                      </a>
                    )}
                  </div>
                </div>

                {/* Invite & Join Request Actions */}
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => setShowInviteModal(true)}
                    data-testid="invite-friends-btn"
                    style={{
                      padding: '9px 18px',
                      borderRadius: 10,
                      background: 'rgba(56, 189, 248, 0.12)',
                      border: '1px solid rgba(56, 189, 248, 0.3)',
                      color: '#38bdf8',
                      fontSize: 13.5,
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <span>📱</span>
                    <span>Invite Friends (Link & QR)</span>
                  </button>

                  {!isUserMember && (
                    <>
                      {userPendingReq ? (
                        <button
                          disabled
                          style={{
                            padding: '9px 18px',
                            borderRadius: 10,
                            background: 'rgba(234, 179, 8, 0.15)',
                            border: '1px solid rgba(234, 179, 8, 0.3)',
                            color: '#eab308',
                            fontSize: 13.5,
                            fontWeight: 800,
                            cursor: 'not-allowed',
                          }}
                        >
                          ⏳ Join Request Pending
                        </button>
                      ) : (
                        <button
                          onClick={() => setShowJoinRequestModal(true)}
                          data-testid="request-to-join-btn"
                          style={{
                            padding: '9px 18px',
                            borderRadius: 10,
                            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                            border: 'none',
                            color: '#fff',
                            fontSize: 13.5,
                            fontWeight: 800,
                            cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                          }}
                        >
                          + Request to Join Squad
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Sub-tab Navigation */}
            <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>
              {[
                { id: 'workspace', label: '🛡️ Team Workspace & Roles' },
                { id: 'discussion', label: `💬 Discussion & Chat (${chatMessages.length})` },
                { id: 'requests', label: `📬 Join Requests (${joinRequests.filter((r) => r.status === 'pending').length})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  data-testid={`subtab-${tab.id}`}
                  style={{
                    padding: '8px 18px',
                    borderRadius: 10,
                    border: 'none',
                    background: activeTab === tab.id ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                    color: activeTab === tab.id ? '#38bdf8' : 'var(--t2)',
                    fontSize: 14,
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* TAB: TEAM WORKSPACE */}
            {activeTab === 'workspace' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                {/* Roles Allocation */}
                <div style={{ padding: 22, borderRadius: 16, background: 'var(--bg2)', border: '1px solid var(--border)' }}>
                  <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 800, color: 'var(--t1)' }}>
                    Squad Roles & Assigned Tasks
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
                    {activeSquad.members.map((member, idx) => (
                      <div key={idx} style={{ padding: 14, borderRadius: 12, background: 'var(--bg3)', border: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                          <img
                            src={member.avatarUrl}
                            alt={member.name}
                            style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover' }}
                          />
                          <div>
                            <div style={{ fontSize: 14.5, fontWeight: 800, color: 'var(--t1)' }}>{member.name}</div>
                            <div style={{ fontSize: 11, color: '#38bdf8', fontWeight: 800, textTransform: 'uppercase' }}>
                              {member.role.replace('_', ' ')}
                            </div>
                          </div>
                        </div>

                        <div style={{ fontSize: 12, color: 'var(--t3)', marginBottom: 8 }}>
                          Sprint Contribution: <strong style={{ color: 'var(--t1)' }}>{member.contributionPct}%</strong>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          {member.assignedTasks.map((t, tIdx) => (
                            <span key={tIdx} style={{ fontSize: 11.5, color: 'var(--t2)', background: 'var(--bg2)', padding: '3px 6px', borderRadius: 4 }}>
                              • {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sprints Milestones */}
                <div style={{ padding: 22, borderRadius: 16, background: 'var(--bg2)', border: '1px solid var(--border)' }}>
                  <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 800, color: 'var(--t1)' }}>
                    Sprint Milestones & Build Pipeline
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {activeSquad.milestones.map((m) => (
                      <div
                        key={m.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '12px 16px',
                          borderRadius: 10,
                          background: m.isCompleted ? 'rgba(34, 197, 94, 0.08)' : 'var(--bg3)',
                          border: m.isCompleted ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid var(--border)',
                        }}
                      >
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--t1)' }}>{m.title}</div>
                          <div style={{ fontSize: 12, color: 'var(--t3)' }}>{m.description}</div>
                        </div>

                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 800,
                            padding: '3px 8px',
                            borderRadius: 6,
                            background: m.isCompleted ? 'rgba(34, 197, 94, 0.15)' : 'rgba(255, 255, 255, 0.08)',
                            color: m.isCompleted ? '#22c55e' : 'var(--t3)',
                          }}
                        >
                          {m.isCompleted ? '✓ Shipped' : `Due ${m.dueDate}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: DISCUSSION & CHAT */}
            {activeTab === 'discussion' && (
              <div
                data-testid="innovation-team-chat-container"
                style={{
                  borderRadius: 16,
                  background: 'var(--bg2)',
                  border: '1px solid var(--border)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  height: 520,
                }}
              >
                {/* Chat Header */}
                <div
                  style={{
                    padding: '14px 20px',
                    borderBottom: '1px solid var(--border)',
                    background: 'var(--bg3)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontSize: 14.5, fontWeight: 800, color: 'var(--t1)' }}>
                      Team Ideation & Build Discussion
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--t3)' }}>
                      Brainstorm features, coordinate GitHub commits, and discuss architecture decisions.
                    </div>
                  </div>
                  <span style={{ fontSize: 12, color: '#22c55e', fontWeight: 700 }}>● Live Channel</span>
                </div>

                {/* Messages List */}
                <div
                  style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '16px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 14,
                  }}
                >
                  {chatMessages.map((msg) => {
                    const isMe = msg.senderId === studentId;
                    return (
                      <div
                        key={msg.id}
                        style={{
                          display: 'flex',
                          gap: 12,
                          alignItems: 'flex-start',
                          alignSelf: isMe ? 'flex-end' : 'flex-start',
                          maxWidth: '80%',
                          flexDirection: isMe ? 'row-reverse' : 'row',
                        }}
                      >
                        <img
                          src={msg.senderAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                          alt={msg.senderName}
                          style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                        />
                        <div>
                          <div
                            style={{
                              display: 'flex',
                              gap: 8,
                              alignItems: 'center',
                              marginBottom: 3,
                              justifyContent: isMe ? 'flex-end' : 'flex-start',
                            }}
                          >
                            <span style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--t1)' }}>{msg.senderName}</span>
                            {msg.senderRole && (
                              <span style={{ fontSize: 10, color: '#38bdf8', fontWeight: 800, textTransform: 'uppercase' }}>
                                [{msg.senderRole}]
                              </span>
                            )}
                            <span style={{ fontSize: 11, color: 'var(--t3)' }}>
                              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>

                          <div
                            style={{
                              padding: '10px 16px',
                              borderRadius: isMe ? '14px 4px 14px 14px' : '4px 14px 14px 14px',
                              background: isMe ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' : 'var(--bg3)',
                              color: isMe ? '#fff' : 'var(--t1)',
                              fontSize: 14,
                              lineHeight: 1.5,
                              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                            }}
                          >
                            {msg.text}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={chatBottomRef} />
                </div>

                {/* Chat Input */}
                <div
                  style={{
                    padding: '12px 18px',
                    borderTop: '1px solid var(--border)',
                    background: 'var(--bg3)',
                    display: 'flex',
                    gap: 10,
                  }}
                >
                  <input
                    type="text"
                    data-testid="innovation-chat-input"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Discuss what to build, share GitHub PRs, or propose architecture..."
                    style={{
                      flex: 1,
                      padding: '10px 16px',
                      borderRadius: 10,
                      background: 'var(--bg2)',
                      border: '1px solid var(--border)',
                      color: 'var(--t1)',
                      fontSize: 14,
                      outline: 'none',
                    }}
                  />
                  <button
                    onClick={handleSendMessage}
                    data-testid="innovation-chat-send-btn"
                    style={{
                      padding: '10px 20px',
                      borderRadius: 10,
                      background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
                      color: '#fff',
                      fontSize: 14,
                      fontWeight: 800,
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Send
                  </button>
                </div>
              </div>
            )}

            {/* TAB: JOIN REQUESTS */}
            {activeTab === 'requests' && (
              <div style={{ padding: 22, borderRadius: 16, background: 'var(--bg2)', border: '1px solid var(--border)' }}>
                <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 800, color: 'var(--t1)' }}>
                  Prospective Contributor Requests ({joinRequests.length})
                </h3>

                {joinRequests.length === 0 ? (
                  <div style={{ padding: '36px 20px', textAlign: 'center', color: 'var(--t3)' }}>
                    No join requests at the moment. Share your invite link or QR code to recruit teammates!
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {joinRequests.map((req) => (
                      <div
                        key={req.id}
                        style={{
                          padding: 16,
                          borderRadius: 12,
                          background: 'var(--bg3)',
                          border: '1px solid var(--border)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: 12,
                        }}
                      >
                        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                          <img
                            src={req.studentAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                            alt={req.studentName}
                            style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }}
                          />
                          <div>
                            <div style={{ fontSize: 14.5, fontWeight: 800, color: 'var(--t1)' }}>
                              {req.studentName}
                            </div>
                            <div style={{ fontSize: 12, color: '#38bdf8', fontWeight: 700, textTransform: 'uppercase' }}>
                              Role: {req.role.replace('_', ' ')}
                            </div>
                            <div style={{ fontSize: 12.5, color: 'var(--t2)', marginTop: 2 }}>
                              "{req.pitch}"
                            </div>
                          </div>
                        </div>

                        <div>
                          {req.status === 'accepted' ? (
                            <span style={{ fontSize: 12, fontWeight: 800, color: '#22c55e', background: 'rgba(34, 197, 94, 0.15)', padding: '4px 10px', borderRadius: 6 }}>
                              ✓ Member Accepted
                            </span>
                          ) : isUserLead ? (
                            <div style={{ display: 'flex', gap: 8 }}>
                              <button
                                onClick={() => handleAcceptRequest(req)}
                                style={{
                                  padding: '8px 16px',
                                  borderRadius: 8,
                                  background: '#10b981',
                                  color: '#fff',
                                  fontSize: 13,
                                  fontWeight: 800,
                                  border: 'none',
                                  cursor: 'pointer',
                                }}
                              >
                                ✓ Accept
                              </button>
                            </div>
                          ) : (
                            <span style={{ fontSize: 12, color: 'var(--t3)', fontWeight: 600 }}>
                              Pending Lead Decision
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── MODAL 1: START INNOVATION PROJECT ────────────────────────── */}
      {showCreateModal && (
        <div
          data-testid="start-project-modal"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 20,
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 540,
              background: 'var(--bg2)',
              border: '1px solid var(--border)',
              borderRadius: 20,
              padding: '28px 32px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: 'var(--t1)' }}>
                Start Innovation Project
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--t3)', fontSize: 20, cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--t2)', marginBottom: 6 }}>
                  Project Name
                </label>
                <input
                  type="text"
                  data-testid="new-project-name-input"
                  value={newSquadName}
                  onChange={(e) => setNewSquadName(e.target.value)}
                  placeholder="e.g. Distributed WebSocket Trade Engine"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 10,
                    background: 'var(--bg3)',
                    border: '1px solid var(--border)',
                    color: 'var(--t1)',
                    fontSize: 14,
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--t2)', marginBottom: 6 }}>
                  Innovation Category / Hackathon Theme
                </label>
                <input
                  type="text"
                  value={newHackathonTitle}
                  onChange={(e) => setNewHackathonTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 10,
                    background: 'var(--bg3)',
                    border: '1px solid var(--border)',
                    color: 'var(--t1)',
                    fontSize: 14,
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--t2)', marginBottom: 6 }}>
                  Your Role in Squad
                </label>
                <select
                  value={newMyRole}
                  onChange={(e) => setNewMyRole(e.target.value as TeamRole)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 10,
                    background: 'var(--bg3)',
                    border: '1px solid var(--border)',
                    color: 'var(--t1)',
                    fontSize: 14,
                    outline: 'none',
                  }}
                >
                  <option value="backend_lead">Backend Lead (APIs & Database)</option>
                  <option value="frontend_lead">Frontend Lead (UI & Next.js)</option>
                  <option value="devops_cloud">DevOps & Cloud (Docker / CI/CD)</option>
                  <option value="ai_architect">AI Architect (LLMs & Inference)</option>
                  <option value="data_engineer">Data Engineer (Pipelines & Streaming)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--t2)', marginBottom: 6 }}>
                  GitHub Repository URL (Optional)
                </label>
                <input
                  type="text"
                  value={newRepoUrl}
                  onChange={(e) => setNewRepoUrl(e.target.value)}
                  placeholder="https://github.com/username/project-repo"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 10,
                    background: 'var(--bg3)',
                    border: '1px solid var(--border)',
                    color: 'var(--t1)',
                    fontSize: 14,
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
                <input
                  type="checkbox"
                  id="publicProjectToggle"
                  checked={newIsPublic}
                  onChange={(e) => setNewIsPublic(e.target.checked)}
                />
                <label htmlFor="publicProjectToggle" style={{ fontSize: 13.5, color: 'var(--t1)', fontWeight: 600, cursor: 'pointer' }}>
                  Make this project Public (allow collegiate peers to discover & request to join)
                </label>
              </div>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 12 }}>
                <button
                  onClick={() => setShowCreateModal(false)}
                  style={{
                    padding: '10px 20px',
                    borderRadius: 10,
                    background: 'transparent',
                    border: '1px solid var(--border)',
                    color: 'var(--t2)',
                    fontSize: 14,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateSquad}
                  data-testid="create-project-submit-btn"
                  style={{
                    padding: '10px 24px',
                    borderRadius: 10,
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: '#fff',
                    fontSize: 14,
                    fontWeight: 800,
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Launch Squad
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 2: INVITE FRIENDS VIA LINK & QR ─────────────────────── */}
      {showInviteModal && activeSquad && (
        <div
          data-testid="invite-friends-modal"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 20,
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 480,
              background: 'var(--bg2)',
              border: '1px solid var(--border)',
              borderRadius: 20,
              padding: '28px 32px',
              textAlign: 'center',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ textAlign: 'left' }}>
                <h3 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: 'var(--t1)' }}>
                  Invite Teammates to Project
                </h3>
                <p style={{ margin: '2px 0 0', fontSize: 13, color: 'var(--t3)' }}>
                  {activeSquad.name}
                </p>
              </div>
              <button
                onClick={() => setShowInviteModal(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--t3)', fontSize: 20, cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            {/* QR Code Presentation */}
            <div
              style={{
                background: '#ffffff',
                padding: 16,
                borderRadius: 16,
                display: 'inline-block',
                margin: '12px auto 16px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
              }}
            >
              <QRCodeSVG
                value={inviteUrl}
                size={180}
                bgColor="#ffffff"
                fgColor="#0f172a"
                level="Q"
                includeMargin={false}
              />
            </div>

            <div style={{ fontSize: 13, color: 'var(--t2)', marginBottom: 20 }}>
              Scan this QR code with mobile camera or WhatsApp to join this engineering squad instantly.
            </div>

            {/* Copyable Link */}
            <div
              style={{
                display: 'flex',
                gap: 8,
                background: 'var(--bg3)',
                padding: '6px 8px 6px 14px',
                borderRadius: 10,
                border: '1px solid var(--border)',
                alignItems: 'center',
                marginBottom: 16,
              }}
            >
              <input
                type="text"
                readOnly
                value={inviteUrl}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--t2)',
                  fontSize: 12.5,
                  outline: 'none',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(inviteUrl);
                  toast.success('Invite Link Copied! 📋', 'Share with classmates on WhatsApp or Discord.');
                }}
                data-testid="copy-invite-link-btn"
                style={{
                  padding: '8px 14px',
                  borderRadius: 8,
                  background: '#38bdf8',
                  color: '#000',
                  fontSize: 12.5,
                  fontWeight: 800,
                  border: 'none',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                Copy Link
              </button>
            </div>

            {/* WhatsApp Direct Share Button */}
            <a
              href={whatsappShareUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '11px',
                borderRadius: 10,
                background: '#25D366',
                color: '#fff',
                fontSize: 14,
                fontWeight: 800,
                textDecoration: 'none',
                boxShadow: '0 4px 14px rgba(37, 211, 102, 0.3)',
              }}
            >
              <span>💬</span>
              <span>Share Directly to WhatsApp Group</span>
            </a>
          </div>
        </div>
      )}

      {/* ── MODAL 3: REQUEST TO JOIN SQUAD ───────────────────────────── */}
      {showJoinRequestModal && activeSquad && (
        <div
          data-testid="join-request-modal"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 20,
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 480,
              background: 'var(--bg2)',
              border: '1px solid var(--border)',
              borderRadius: 20,
              padding: '28px 32px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: 'var(--t1)' }}>
                  Request to Join Project
                </h3>
                <p style={{ margin: '2px 0 0', fontSize: 13, color: 'var(--t3)' }}>
                  {activeSquad.name}
                </p>
              </div>
              <button
                onClick={() => setShowJoinRequestModal(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--t3)', fontSize: 20, cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--t2)', marginBottom: 6 }}>
                  Select Desired Role
                </label>
                <select
                  value={joinRole}
                  onChange={(e) => setJoinRole(e.target.value as TeamRole)}
                  data-testid="join-role-select"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 10,
                    background: 'var(--bg3)',
                    border: '1px solid var(--border)',
                    color: 'var(--t1)',
                    fontSize: 14,
                    outline: 'none',
                  }}
                >
                  <option value="frontend_lead">Frontend Lead (React / Tailwind)</option>
                  <option value="backend_lead">Backend Lead (Node.js / PostgreSQL / Redis)</option>
                  <option value="devops_cloud">DevOps & Cloud Engineer (Docker / Kubernetes)</option>
                  <option value="ai_architect">AI & ML Engineer (Python / LangChain)</option>
                  <option value="data_engineer">Data Engineer (ETL / Streaming)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--t2)', marginBottom: 6 }}>
                  Why do you want to join? (Pitch to Team Lead)
                </label>
                <textarea
                  rows={3}
                  value={joinPitch}
                  onChange={(e) => setJoinPitch(e.target.value)}
                  placeholder="Tell the team lead about your skills, availability, and what you're excited to build..."
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 10,
                    background: 'var(--bg3)',
                    border: '1px solid var(--border)',
                    color: 'var(--t1)',
                    fontSize: 14,
                    outline: 'none',
                    resize: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 10 }}>
                <button
                  onClick={() => setShowJoinRequestModal(false)}
                  style={{
                    padding: '10px 18px',
                    borderRadius: 10,
                    background: 'transparent',
                    border: '1px solid var(--border)',
                    color: 'var(--t2)',
                    fontSize: 14,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitJoinRequest}
                  data-testid="submit-join-request-btn"
                  style={{
                    padding: '10px 24px',
                    borderRadius: 10,
                    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                    color: '#fff',
                    fontSize: 14,
                    fontWeight: 800,
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Submit Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
