'use client';

import React, { useState, useEffect } from 'react';
import { toast } from '@/lib/store/useAppStore';
import { StudentProfile } from '@/components/friends/StudentCard';
import { FriendProfileDrawer } from '@/components/friends/FriendProfileDrawer';
import { ArenaChallengeModal } from '@/components/friends/ArenaChallengeModal';
import { ProjectInviteModal } from '@/components/friends/ProjectInviteModal';
import { SquadProjectsView } from '@/components/friends/SquadProjectsView';
import { FriendChatView } from '@/components/friends/FriendChatView';
import { ArenaChallengesView } from '@/components/friends/ArenaChallengesView';
import { SmartMatchModal } from '@/components/friends/SmartMatchModal';
import { PrivacySettingsModal } from '@/components/friends/PrivacySettingsModal';
import { ReportStudentModal } from '@/components/friends/ReportStudentModal';
import { computeStudentMatch, CURRENT_STUDENT_PROFILE, MatchStudentProfile, MatchBreakdown } from '@/lib/friends/matching';

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
  const [smartMatchStudent, setSmartMatchStudent] = useState<MatchStudentProfile | null>(null);
  const [smartMatchBreakdown, setSmartMatchBreakdown] = useState<MatchBreakdown | null>(null);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [reportTargetStudent, setReportTargetStudent] = useState<StudentProfile | null>(null);
  const [blockedIds, setBlockedIds] = useState<string[]>([]);
  const [activeChatFriendId, setActiveChatFriendId] = useState<string | undefined>(undefined);

  // Friend Request States
  const [sentRequests, setSentRequests] = useState<Record<string, boolean>>({});
  const [friendsNetwork, setFriendsNetwork] = useState<StudentProfile[]>([]);
  const [incomingRequestsList, setIncomingRequestsList] = useState<any[]>([
    { id: 'req-01', studentId: 'priya_sharma', name: 'Priya Sharma', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya', college: 'BGS Institute of Technology', course: 'B.Tech CS', skills: ['React', 'TypeScript', 'Node.js'] },
    { id: 'req-02', studentId: 'rohan_verma', name: 'Rohan Verma', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan', college: 'BMS College of Engineering', course: 'B.E. ISE', skills: ['Python', 'Docker', 'FastAPI'] }
  ]);

  const handleAcceptRequest = (reqId: string, name: string) => {
    setIncomingRequestsList(prev => prev.filter(r => r.id !== reqId));
    toast.success('Friend Request Accepted', 'Connected with ' + name + '!');
  };

  const handleDeclineRequest = (reqId: string) => {
    setIncomingRequestsList(prev => prev.filter(r => r.id !== reqId));
    toast.info('Request Dismissed', 'Friend request removed.');
  };

  // ── Reference Data Matching Screenshot ──────────────────────────────────
  const baseSuggestedStudents: Array<StudentProfile & { matchPct: number; matchDetails: string }> = [
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

  const suggestedStudents = React.useMemo(() => {
    return baseSuggestedStudents.filter(s => {
      if (blockedIds.includes(s.id)) return false;
      if (activeFilter === 'college') return Boolean(s.college && (s.college.includes('Bangalore') || s.college.includes('RVCE')));
      if (activeFilter === 'skills') return s.skills.some(sk => ['React', 'TypeScript', 'Node.js', 'UI/UX'].includes(sk));
      if (activeFilter === 'course') return s.course === 'BCA';
      if (activeFilter === 'nearby') return Boolean(s.college && (s.college.includes('Bangalore') || s.college.includes('Christ')));
      if (activeFilter === 'goals') return s.careerGoal?.toLowerCase().includes('architect') || s.careerGoal?.toLowerCase().includes('lead') || s.careerGoal?.toLowerCase().includes('developer');
      return true;
    });
  }, [activeFilter, baseSuggestedStudents]);

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
  const handleOpenSmartMatch = (student: StudentProfile) => {
    const candidate: MatchStudentProfile = {
      id: student.id,
      name: student.name,
      headline: student.headline,
      avatar: student.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      college: student.college || 'Campus',
      course: student.course || 'Undergraduate',
      skills: student.skills || [],
      careerGoal: student.careerGoal || 'Software Engineer',
      online: student.online,
      careerScore: student.careerScore,
      xp: student.xp,
      arenaWins: student.arenaWins,
      projectsCount: student.projectsCount
    };
    const breakdown = computeStudentMatch(CURRENT_STUDENT_PROFILE, candidate);
    setSmartMatchStudent(candidate);
    setSmartMatchBreakdown(breakdown);
  };

  const fetchBlockedUsers = async () => {
    try {
      const res = await fetch('/api/friends/privacy');
      const data = await res.json();
      if (data.ok && Array.isArray(data.blockedUsers)) {
        setBlockedIds(data.blockedUsers.map((b: any) => b.studentId));
      }
    } catch (err) {
      console.error('Error fetching blocked users:', err);
    }
  };

  useEffect(() => {
    fetchBlockedUsers();
    setFriendsNetwork(baseSuggestedStudents);
  }, []);

  const handleBlockStudent = async (studentId: string, studentName: string, studentAvatar?: string) => {
    try {
      const res = await fetch('/api/friends/privacy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'block', studentId, studentName, studentAvatar })
      });
      const data = await res.json();
      if (data.ok) {
        toast.info('Student Blocked', `${studentName} has been blocked and removed from your network.`);
        setBlockedIds(prev => [...prev, studentId]);
      }
    } catch (e) {
      toast.error('Error', 'Failed to block student');
    }
  };

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

          {activeTab === 'discover' && (
            <>
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
              <div className="see-all-link" onClick={() => { if (suggestedStudents[0]) handleOpenSmartMatch(suggestedStudents[0]); }}>
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
                    <div className="match-percentage-badge" style={{ cursor: "pointer" }} title="Click for AI Affinity Breakdown" onClick={() => handleOpenSmartMatch(peer)}>
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
            </>
          )}

          {/* ── TAB 2: MY FRIENDS (V1) ── */}
          {activeTab === 'network' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 14 }}>
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 800, color: '#ffffff', margin: 0 }}>My Friends ({friendsNetwork.length})</h2>
                  <p style={{ fontSize: 12, color: '#94a3b8', margin: '4px 0 0' }}>Active campus connections for collaboration, practice duels, and squad builds.</p>
                </div>
                <button className="friends-btn friends-btn-primary" onClick={() => setActiveTab('discover')}>+ Find More Friends</button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
                {friendsNetwork.map((friend) => (
                  <div key={friend.id} style={{ padding: 16, background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ position: 'relative', width: 44, height: 44, flexShrink: 0 }}>
                        <img src={friend.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'} alt={friend.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                        {friend.online && <span className="online-beacon" />}
                      </div>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#ffffff' }}>{friend.name}</div>
                        <div style={{ fontSize: 11.5, color: '#94a3b8' }}>{friend.course} • {friend.college}</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {friend.skills.slice(0, 3).map((sk, idx) => (
                        <span key={idx} className="mini-skill-pill">{sk}</span>
                      ))}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, paddingTop: 4 }}>
                      <button className="friends-btn friends-btn-secondary" style={{ fontSize: 11.5, padding: '6px' }} onClick={() => { setActiveChatFriendId(friend.id); setActiveTab('messages'); }}>💬 Chat</button>
                      <button className="friends-btn friends-btn-secondary" style={{ fontSize: 11.5, padding: '6px' }} onClick={() => setChallengeStudent(friend)}>⚔️ Duel</button>
                      <button className="friends-btn friends-btn-secondary" style={{ fontSize: 11.5, padding: '6px' }} onClick={() => setProjectStudent(friend)}>👥 Project</button>
                      <button className="friends-btn friends-btn-secondary" style={{ fontSize: 11.5, padding: '6px' }} onClick={() => setSelectedStudent(friend)}>Profile</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── TAB 3: REQUESTS (V1) ── */}
          {activeTab === 'requests' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#ffffff', marginBottom: 12 }}>Incoming Friend Requests ({incomingRequestsList.length})</h3>
                {incomingRequestsList.length === 0 ? (
                  <div style={{ padding: '30px', textAlign: 'center', background: 'rgba(15, 23, 42, 0.4)', borderRadius: 12 }}>
                    <span style={{ fontSize: 24 }}>📫</span>
                    <div style={{ fontSize: 14, color: '#94a3b8', marginTop: 8 }}>No pending requests right now</div>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 14 }}>
                    {incomingRequestsList.map((req) => (
                      <div key={req.id} style={{ padding: 16, background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <img src={req.avatar} alt={req.name} style={{ width: 40, height: 40, borderRadius: '50%' }} />
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 700, color: '#ffffff' }}>{req.name}</div>
                            <div style={{ fontSize: 11.5, color: '#94a3b8' }}>{req.course} • {req.college}</div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: 6 }}>
                          {req.skills.map((s: string, i: number) => (
                            <span key={i} className="mini-skill-pill">{s}</span>
                          ))}
                        </div>

                        <div style={{ display: 'flex', gap: 8 }}>
                          <button className="friends-btn friends-btn-primary" style={{ flex: 1, fontSize: 12, padding: '7px' }} onClick={() => handleAcceptRequest(req.id, req.name)}>✓ Accept</button>
                          <button className="friends-btn friends-btn-secondary" style={{ flex: 1, fontSize: 12, padding: '7px' }} onClick={() => handleDeclineRequest(req.id)}>Decline</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── TAB 4: MESSAGES (V2) ── */}
          {activeTab === 'messages' && (
            <FriendChatView
              initialFriendId={activeChatFriendId}
              friends={baseSuggestedStudents}
              onOpenProfile={(s) => setSelectedStudent(s)}
              onOpenChallenge={(s) => setChallengeStudent(s)}
              onOpenProjectInvite={(s) => setProjectStudent(s)}
            />
          )}

          {/* ── TAB 5: CHALLENGES (V3) ── */}
          {activeTab === 'challenges' && (
            <ArenaChallengesView
              onOpenChallengeModal={(s) => setChallengeStudent(s || suggestedStudents[0])}
            />
          )}

          {/* ── TAB 6: GROUP PROJECTS (V4) ── */}
          {activeTab === 'projects' && (
            <SquadProjectsView
              onOpenInviteModal={(projTitle) => {
                setSelectedProjectTitle(projTitle);
                setProjectStudent(suggestedStudents[0]);
              }}
            />
          )}
          
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
              <span className="see-all-link" style={{ fontSize: 11.5 }} onClick={() => setActiveTab('messages')}>
                View all →
              </span>
            </div>

            <div className="recent-messages-list">
              {recentMessages.map((msg, idx) => (
                <div key={idx} className="recent-msg-item" onClick={() => {
                  const target = baseSuggestedStudents.find(s => s.name.toLowerCase().includes(msg.name.toLowerCase().split(' ')[0]));
                  if (target) setActiveChatFriendId(target.id);
                  setActiveTab('messages');
                }}>
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
        onOpenMessage={(s) => {
          setSelectedStudent(null);
          setActiveChatFriendId(s.id);
          setActiveTab('messages');
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

      {/* ── Smart Match Breakdown Modal (V5) ── */}
      <SmartMatchModal
        student={smartMatchStudent}
        match={smartMatchBreakdown}
        onClose={() => { setSmartMatchStudent(null); setSmartMatchBreakdown(null); }}
        onAddFriend={handleAddFriend}
        onOpenChallenge={(s) => {
          setSmartMatchStudent(null);
          setSmartMatchBreakdown(null);
          setChallengeStudent(suggestedStudents.find(p => p.id === s.id) || null);
        }}
        onOpenProjectInvite={(s) => {
          setSmartMatchStudent(null);
          setSmartMatchBreakdown(null);
          setProjectStudent(suggestedStudents.find(p => p.id === s.id) || null);
        }}
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
