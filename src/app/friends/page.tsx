'use client';

import React, { useState, useEffect } from 'react';
import { toast } from '@/lib/store/useAppStore';
import { StudentProfile } from '@/components/friends/StudentCard';
import { FriendProfileDrawer } from '@/components/friends/FriendProfileDrawer';
import { ArenaChallengeModal } from '@/components/friends/ArenaChallengeModal';
import { ProjectInviteModal } from '@/components/friends/ProjectInviteModal';
import { SquadProjectsView } from '@/components/friends/SquadProjectsView';

export default function FriendsPage() {
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<'discover' | 'network' | 'requests' | 'messages' | 'challenges' | 'projects'>('discover');

  // Filter Chips
  const [activeFilter, setActiveFilter] = useState<'all' | 'college' | 'skills' | 'course' | 'nearby' | 'goals'>('all');

  // View Mode for All Students (List vs Grid)
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // Drawer and Modal States
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null);
  const [challengeStudent, setChallengeStudent] = useState<StudentProfile | null>(null);
  const [projectStudent, setProjectStudent] = useState<StudentProfile | null>(null);
  const [selectedProjectTitle, setSelectedProjectTitle] = useState<string | undefined>(undefined);

  // Friend Request States
  const [sentRequests, setSentRequests] = useState<Record<string, boolean>>({});

  // ── Reference Data Matching Screenshot ──────────────────────────────────
  const suggestedStudents: Array<StudentProfile & { matchPct: number; matchDetails: string }> = [
    {
      id: 'aishwarya_rao',
      name: 'Aishwarya Rao',
      headline: 'UI/UX & Frontend Technologist',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      college: 'Bangalore University',
      course: 'BCA',
      careerGoal: 'Product & Design Systems Architect',
      skills: ['UI/UX', 'React', 'Design'],
      matchPct: 92,
      matchDetails: '🏫 Same Course • 3 common skills',
      online: true,
      careerScore: 92,
      xp: 3100,
      arenaWins: 18,
      projectsCount: 4
    },
    {
      id: 'rahul_shetty',
      name: 'Rahul Shetty',
      headline: 'Applied ML & Distributed Systems Specialist',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      college: 'RVCE',
      course: 'B.Tech',
      careerGoal: 'AI Infrastructure Lead',
      skills: ['Python', 'AI/ML', 'Data Science'],
      matchPct: 88,
      matchDetails: '⚡ Same Interests • 2 common projects',
      online: true,
      careerScore: 88,
      xp: 2950,
      arenaWins: 24,
      projectsCount: 3
    },
    {
      id: 'sneha_iyer',
      name: 'Sneha Iyer',
      headline: 'Frontend Engineer & Web Perf Advocate',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      college: 'Christ University',
      course: 'BCA',
      careerGoal: 'Frontend Developer',
      skills: ['Javascript', 'Web Dev', 'Product'],
      matchPct: 85,
      matchDetails: '🎯 Same Career Goal: Frontend Developer',
      online: true,
      careerScore: 86,
      xp: 2600,
      arenaWins: 14,
      projectsCount: 5
    },
    {
      id: 'arjun_nair',
      name: 'Arjun Nair',
      headline: 'Cloud Security & Infrastructure Engineer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      college: 'NIT Calicut',
      course: 'B.Tech',
      careerGoal: 'Cloud Security Architect',
      skills: ['Cybersecurity', 'Linux', 'Cloud'],
      matchPct: 78,
      matchDetails: '🛡️ Same Domain: Security Enthusiast',
      online: true,
      careerScore: 84,
      xp: 2300,
      arenaWins: 19,
      projectsCount: 3
    }
  ];

  const allStudentsList: StudentProfile[] = [
    {
      id: 'karan_singh',
      name: 'Karan Singh',
      headline: 'Full Stack Node & MongoDB Developer',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      college: 'JAIN University',
      course: 'BCA',
      skills: ['React', 'Node.js', 'MongoDB'],
      online: true,
      careerScore: 82,
      xp: 2100,
      arenaWins: 11
    },
    {
      id: 'meera_krishnan',
      name: 'Meera Krishnan',
      headline: 'Product Designer & Design Systems Lead',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      college: 'Stella Maris',
      course: 'B.Com',
      skills: ['UI/UX', 'Figma', 'Product Design'],
      online: true,
      careerScore: 87,
      xp: 2750,
      arenaWins: 8
    },
    {
      id: 'aditya_verma',
      name: 'Aditya Verma',
      headline: 'Computer Vision & Deep Learning Student',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
      college: 'VIT Vellore',
      course: 'B.Tech',
      skills: ['Machine Learning', 'Python', 'OpenCV'],
      online: false,
      careerScore: 91,
      xp: 3200,
      arenaWins: 17
    },
    {
      id: 'pooja_kulkarni',
      name: 'Pooja Kulkarni',
      headline: 'Algorithms & Competitive DSA Duelist',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      college: 'Mumbai University',
      course: 'BCA',
      skills: ['Java', 'DSA', 'Problem Solving'],
      online: true,
      careerScore: 89,
      xp: 2900,
      arenaWins: 31
    }
  ];

  const recentMessages = [
    { name: 'Rahul Shetty', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80', text: 'Hey! Are you up for the challenge?', time: '2m' },
    { name: 'Sneha Iyer', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80', text: "Let's work on the group project", time: '12m' },
    { name: 'Arjun Nair', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', text: 'Shared a project link', time: '1h' },
    { name: 'Meera Krishnan', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', text: 'Thanks for the notes!', time: '3h' },
    { name: 'Karan Singh', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', text: 'Are you joining the arena?', time: '5h' }
  ];

  // ── Actions ──────────────────────────────────────────────────────────────
  const handleAddFriend = (id: string, name: string) => {
    setSentRequests(prev => ({ ...prev, [id]: true }));
    toast.success('Friend Request Sent', `Connection request dispatched to ${name}.`);
  };

  const handleSendChallenge = (payload: { studentId: string; topic: string; difficulty: string; message: string }) => {
    toast.success('Challenging Arena Invite Sent!', `1v1 Duel invite dispatched for ${payload.topic} (${payload.difficulty}).`);
  };

  const handleSendProjectInvite = (payload: { studentId: string; projectName: string; role: string; message: string }) => {
    toast.success('Squad Project Invite Sent!', `Invited to ${payload.projectName} as ${payload.role}.`);
  };

  return (
    <div className="friends-container">
      {/* ── Two-Column Master Layout ── */}
      <div className="friends-main-layout">
        
        {/* ── LEFT / MAIN CONTENT STREAM ── */}
        <div className="friends-content-column">
          
          {/* Hero Banner with Skyline Silhouette */}
          <div className="friends-hero-ref">
            <div className="friends-hero-text-wrap">
              <h1 className="friends-hero-title-ref">
                Frien<span>ds</span>
              </h1>
              <p className="friends-hero-subtitle-ref">
                Find your people. Collaborate, compete and grow together.
              </p>
            </div>

            <div className="friends-hero-graphic-wrap">
              <div className="hero-cursive-quote">Good Friends Better Future</div>
              <div className="hero-tagline-caps">
                SAME LEARNING<br />
                DIFFERENT PATHS<br />
                GREATER TOGETHER
              </div>
            </div>
          </div>

          {/* Navigation Tabs Bar */}
          <div className="friends-tabs-bar-ref">
            <button
              className={`friends-tab-pill ${activeTab === 'discover' ? 'active' : ''}`}
              onClick={() => setActiveTab('discover')}
            >
              <span>🔍</span> Discover
            </button>
            <button
              className={`friends-tab-pill ${activeTab === 'network' ? 'active' : ''}`}
              onClick={() => setActiveTab('network')}
            >
              <span>👥</span> My Friends
            </button>
            <button
              className={`friends-tab-pill ${activeTab === 'requests' ? 'active' : ''}`}
              onClick={() => setActiveTab('requests')}
            >
              <span>👤+</span> Requests
              <span className="tab-counter-badge">5</span>
            </button>
            <button
              className={`friends-tab-pill ${activeTab === 'messages' ? 'active' : ''}`}
              onClick={() => setActiveTab('messages')}
            >
              <span>💬</span> Messages
            </button>
            <button
              className={`friends-tab-pill ${activeTab === 'challenges' ? 'active' : ''}`}
              onClick={() => setActiveTab('challenges')}
            >
              <span>🏆</span> Challenges
            </button>
            <button
              className={`friends-tab-pill ${activeTab === 'projects' ? 'active' : ''}`}
              onClick={() => setActiveTab('projects')}
            >
              <span>👥</span> Group Projects
            </button>
          </div>

          {/* Filter Chips Row */}
          <div className="friends-filters-row">
            <div className="filter-chips-left">
              <button
                className={`ref-filter-chip ${activeFilter === 'all' ? 'active' : ''}`}
                onClick={() => setActiveFilter('all')}
              >
                All
              </button>
              <button
                className={`ref-filter-chip ${activeFilter === 'college' ? 'active' : ''}`}
                onClick={() => setActiveFilter('college')}
              >
                Same College
              </button>
              <button
                className={`ref-filter-chip ${activeFilter === 'skills' ? 'active' : ''}`}
                onClick={() => setActiveFilter('skills')}
              >
                Same Skills
              </button>
              <button
                className={`ref-filter-chip ${activeFilter === 'course' ? 'active' : ''}`}
                onClick={() => setActiveFilter('course')}
              >
                Same Course
              </button>
              <button
                className={`ref-filter-chip ${activeFilter === 'nearby' ? 'active' : ''}`}
                onClick={() => setActiveFilter('nearby')}
              >
                Nearby
              </button>
              <button
                className={`ref-filter-chip ${activeFilter === 'goals' ? 'active' : ''}`}
                onClick={() => setActiveFilter('goals')}
              >
                Similar Goals
              </button>
            </div>

            <button className="filter-dropdown-btn" onClick={() => toast.info('Filters', 'Additional filter presets available.')}>
              <span>⚙️</span> Filters ▾
            </button>
          </div>

          {/* ── "Suggested for you" Section ── */}
          <div>
            <div className="section-header-row">
              <div>
                <h2 className="section-heading-title">Suggested for you</h2>
                <div className="section-heading-sub">Students you may want to connect with</div>
              </div>
              <div className="see-all-link" onClick={() => toast.info('Suggestions', 'Viewing top AI-ranked student matches.')}>
                See all →
              </div>
            </div>

            <div className="suggested-cards-grid" style={{ marginTop: 14 }}>
              {suggestedStudents.map((peer) => (
                <div key={peer.id} className="suggested-peer-card">
                  <div className="suggested-card-top">
                    <div className="suggested-avatar-box">
                      <img src={peer.avatar} alt={peer.name} />
                      <span className="online-beacon" />
                    </div>
                    <div className="match-percentage-badge">
                      <span className="match-percentage-val">{peer.matchPct}%</span>
                      <span className="match-percentage-label">Match</span>
                    </div>
                  </div>

                  <div className="suggested-peer-name" title={peer.name}>{peer.name}</div>
                  <div className="suggested-peer-degree">{peer.course} • {peer.college}</div>

                  <div className="suggested-skills-pills">
                    {peer.skills.map((s, i) => (
                      <span key={i} className="mini-skill-pill">{s}</span>
                    ))}
                  </div>

                  <div className="suggested-match-reason">
                    <span>{peer.matchDetails}</span>
                  </div>

                  <div className="suggested-card-btn-row">
                    <button
                      className="friends-btn friends-btn-secondary"
                      onClick={() => setSelectedStudent(peer)}
                      style={{ padding: '6px 10px', fontSize: 11.5 }}
                    >
                      View Profile
                    </button>
                    {sentRequests[peer.id] ? (
                      <button className="friends-btn friends-btn-pending" style={{ padding: '6px 10px', fontSize: 11.5 }} disabled>
                        ✓ Sent
                      </button>
                    ) : (
                      <button
                        className="friends-btn friends-btn-primary"
                        onClick={() => handleAddFriend(peer.id, peer.name)}
                        style={{ padding: '6px 10px', fontSize: 11.5 }}
                      >
                        + Add Friend
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── "All Students" Section (List View) ── */}
          <div className="all-students-section">
            <div className="all-students-controls-row">
              <h2 className="section-heading-title">All Students</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 12, color: '#94a3b8', cursor: 'pointer' }}>Sort by: Relevance ▾</span>
                <div className="view-mode-toggle-group">
                  <button
                    className={`view-mode-btn ${viewMode === 'grid' ? 'active' : ''}`}
                    onClick={() => setViewMode('grid')}
                    title="Grid View"
                  >
                    ⊞
                  </button>
                  <button
                    className={`view-mode-btn ${viewMode === 'list' ? 'active' : ''}`}
                    onClick={() => setViewMode('list')}
                    title="List View"
                  >
                    ☰
                  </button>
                </div>
              </div>
            </div>

            <div className="students-list-view-container">
              {allStudentsList.map((student) => (
                <div key={student.id} className="student-list-item-row">
                  <div className="student-list-identity">
                    <div className="student-list-avatar">
                      <img src={student.avatar} alt={student.name} />
                      {student.online && <span className="online-beacon" />}
                    </div>
                    <div>
                      <div className="student-list-name">{student.name}</div>
                      <div className="student-list-college">{student.course} • {student.college}</div>
                    </div>
                  </div>

                  <div className="student-list-skills">
                    {student.skills.map((sk, idx) => (
                      <span key={idx} className="mini-skill-pill">{sk}</span>
                    ))}
                  </div>

                  <div className="student-list-actions">
                    <button
                      className="friends-btn friends-btn-secondary"
                      onClick={() => setSelectedStudent(student)}
                    >
                      View Profile
                    </button>
                    {sentRequests[student.id] ? (
                      <button className="friends-btn friends-btn-pending" disabled>
                        ✓ Sent
                      </button>
                    ) : (
                      <button
                        className="friends-btn friends-btn-primary"
                        onClick={() => handleAddFriend(student.id, student.name)}
                      >
                        + Add Friend
                      </button>
                    )}
                    <button
                      className="icon-more-btn"
                      onClick={() => setSelectedStudent(student)}
                      title="More options"
                    >
                      ⋮
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ── RIGHT COLUMN: NETWORK SUMMARY & WIDGETS ── */}
        <div className="friends-sidebar-column">
          
          {/* 1. "Your Network" Card */}
          <div className="ref-sidebar-card">
            <div className="ref-sidebar-header">
              <span>Your Network</span>
              <span style={{ fontSize: 13, color: '#94a3b8', cursor: 'pointer' }}>›</span>
            </div>

            <div className="network-stats-row">
              <div className="network-stat-box">
                <span className="network-stat-icon" style={{ color: '#818cf8' }}>👥</span>
                <div>
                  <div className="network-stat-num">128</div>
                  <div className="network-stat-text">Friends</div>
                </div>
              </div>

              <div className="network-stat-box">
                <span className="network-stat-icon" style={{ color: '#f87171' }}>🚀</span>
                <div>
                  <div className="network-stat-num">24</div>
                  <div className="network-stat-text">Requests</div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. "Recent Messages" Card */}
          <div className="ref-sidebar-card">
            <div className="ref-sidebar-header">
              <span>Recent Messages</span>
              <span className="see-all-link" style={{ fontSize: 11.5 }} onClick={() => toast.info('Messages', 'Opening realtime chat thread.')}>
                View all →
              </span>
            </div>

            <div className="recent-messages-list">
              {recentMessages.map((msg, idx) => (
                <div key={idx} className="recent-msg-item" onClick={() => toast.info(`Chat with ${msg.name}`, msg.text)}>
                  <div className="recent-msg-avatar-wrap">
                    <img src={msg.avatar} alt={msg.name} />
                    <span className="online-beacon" />
                  </div>
                  <div className="recent-msg-meta">
                    <div className="recent-msg-author">{msg.name}</div>
                    <div className="recent-msg-snippet">{msg.text}</div>
                  </div>
                  <span className="recent-msg-time">{msg.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 3. "Quick Actions" 2x2 Grid */}
          <div className="ref-sidebar-card">
            <div className="ref-sidebar-header">
              <span>Quick Actions</span>
            </div>

            <div className="quick-actions-grid">
              <div
                className="quick-action-tile purple"
                onClick={() => setChallengeStudent(suggestedStudents[1])}
              >
                <div className="tile-icon-title">
                  <span className="tile-icon">🏆</span>
                  <span className="tile-label">Invite to<br />Challenge</span>
                </div>
                <span className="tile-arrow">›</span>
              </div>

              <div
                className="quick-action-tile green"
                onClick={() => setProjectStudent(suggestedStudents[0])}
              >
                <div className="tile-icon-title">
                  <span className="tile-icon">👥</span>
                  <span className="tile-label">Invite to<br />Project</span>
                </div>
                <span className="tile-arrow">›</span>
              </div>

              <div
                className="quick-action-tile blue"
                onClick={() => toast.info('Find Friends', 'Use the filter chips and search bar to discover campus peers.')}
              >
                <div className="tile-icon-title">
                  <span className="tile-icon">👤+</span>
                  <span className="tile-label">Find<br />Friends</span>
                </div>
                <span className="tile-arrow">›</span>
              </div>

              <div
                className="quick-action-tile amber"
                onClick={() => setActiveTab('network')}
              >
                <div className="tile-icon-title">
                  <span className="tile-icon">👥</span>
                  <span className="tile-label">View<br />My Friends</span>
                </div>
                <span className="tile-arrow">›</span>
              </div>
            </div>
          </div>

          {/* 4. Inspiration Ribbon Card */}
          <div className="inspiration-ribbon-card">
            <h4>Great ideas start with great people.</h4>
            <div className="inspiration-tagline">
              CONNECT • COLLABORATE • CREATE • GROW
            </div>
          </div>

        </div>

      </div>

      {/* ── Slide-over Profile Drawer ── */}
      <FriendProfileDrawer
        student={selectedStudent}
        onClose={() => setSelectedStudent(null)}
        onSendRequest={(id) => handleAddFriend(id, selectedStudent?.name || 'Student')}
        onOpenChallenge={(s) => {
          setSelectedStudent(null);
          setChallengeStudent(s);
        }}
        onOpenProjectInvite={(s) => {
          setSelectedStudent(null);
          setProjectStudent(s);
        }}
      />

      {/* ── Arena Challenge Modal (V3) ── */}
      <ArenaChallengeModal
        student={challengeStudent}
        onClose={() => setChallengeStudent(null)}
        onSendChallenge={handleSendChallenge}
      />

      {/* ── Project Invite Modal (V4) ── */}
      <ProjectInviteModal
        student={projectStudent}
        onClose={() => setProjectStudent(null)}
        onSendInvite={handleSendProjectInvite}
      />
    </div>
  );
}
