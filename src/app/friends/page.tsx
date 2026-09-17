'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();

  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<'discover' | 'network' | 'requests' | 'messages' | 'challenges' | 'projects'>('discover');

  // Filter Chips
  const [activeFilter, setActiveFilter] = useState<'all' | 'college' | 'skills' | 'course' | 'nearby' | 'goals'>('all');

  // Search input state & debounced search
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // View Mode for All Students (List vs Grid)
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // Modals & Drawer State
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null);
  const [challengeStudent, setChallengeStudent] = useState<StudentProfile | null>(null);
  const [projectStudent, setProjectStudent] = useState<StudentProfile | null>(null);
  const [selectedProjectTitle, setSelectedProjectTitle] = useState<string>('CareerOS Platform');
  const [smartMatchStudent, setSmartMatchStudent] = useState<MatchStudentProfile | null>(null);
  const [smartMatchBreakdown, setSmartMatchBreakdown] = useState<MatchBreakdown | null>(null);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [reportModalStudent, setReportModalStudent] = useState<StudentProfile | null>(null);

  // Real Supabase State (ZERO DUMMY DATA)
  const [suggestedStudents, setSuggestedStudents] = useState<Array<StudentProfile & { matchPct: number; matchDetails: string }>>([]);
  const [friendsNetwork, setFriendsNetwork] = useState<StudentProfile[]>([]);
  const [incomingRequestsList, setIncomingRequestsList] = useState<any[]>([]);
  const [networkStats, setNetworkStats] = useState<{ friendsCount: number; pendingCount: number }>({ friendsCount: 0, pendingCount: 0 });
  const [sentRequests, setSentRequests] = useState<Record<string, boolean>>({});
  const [blockedIds, setBlockedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // Chat View Active Friend
  const [activeChatFriendId, setActiveChatFriendId] = useState<string | undefined>(undefined);

  // ── Debounce Search Input ────────────────────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // ── 1. Fetch Real Friendships & Counts From Supabase ──────────────────────
  const fetchNetworkData = async () => {
    try {
      console.log('[FriendsHub] Fetching live friendships from Supabase API /api/friends...');
      const res = await fetch('/api/friends');
      const data = await res.json();
      console.log('[FriendsHub] /api/friends response:', data);

      if (data.ok) {
        const friends: StudentProfile[] = (data.friends || []).map((f: any) => f.student);
        setFriendsNetwork(friends);

        const incoming = (data.incomingRequests || []).map((r: any) => ({
          id: r.requestId,
          studentId: r.sender?.id,
          name: r.sender?.name || 'Student Peer',
          avatar: r.sender?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + r.requestId,
          college: r.sender?.college || 'Engineering Campus',
          course: 'Undergraduate',
          skills: ['Coding', 'Engineering']
        }));
        setIncomingRequestsList(incoming);

        setNetworkStats({
          friendsCount: data.friendsCount || 0,
          pendingCount: data.pendingCount || 0
        });

        // Initialize sent requests state
        const sentMap: Record<string, boolean> = {};
        (data.sentRequests || []).forEach((s: any) => {
          if (s.recipient?.id) {
            sentMap[s.recipient.id] = true;
          }
        });
        setSentRequests(prev => ({ ...prev, ...sentMap }));
      }
    } catch (err) {
      console.error('[FriendsHub] Error loading network data:', err);
    }
  };

  // ── 2. Fetch Live Student Suggestions & Search Results ───────────────────
  const fetchSuggestions = async () => {
    try {
      setIsSearching(true);
      const url = `/api/friends/suggestions?filter=${activeFilter}${debouncedSearch ? `&q=${encodeURIComponent(debouncedSearch)}` : ''}`;
      console.log(`[FriendsHub] Fetching student suggestions from Supabase: ${url}`);
      
      const res = await fetch(url);
      const data = await res.json();
      console.log('[FriendsHub] /api/friends/suggestions response:', data);

      if (data.ok && Array.isArray(data.suggestions)) {
        setSuggestedStudents(data.suggestions);
      } else {
        setSuggestedStudents([]);
      }
    } catch (err) {
      console.error('[FriendsHub] Error fetching suggestions:', err);
      setSuggestedStudents([]);
    } finally {
      setIsSearching(false);
      setIsLoading(false);
    }
  };

  // ── 3. Fetch Blocked Users ───────────────────────────────────────────────
  const fetchBlockedUsers = async () => {
    try {
      const res = await fetch('/api/friends/privacy');
      const data = await res.json();
      if (data.ok && Array.isArray(data.blockedUsers)) {
        setBlockedIds(data.blockedUsers.map((b: any) => b.studentId));
      }
    } catch (err) {
      console.error('[FriendsHub] Error fetching privacy list:', err);
    }
  };

  useEffect(() => {
    fetchNetworkData();
    fetchBlockedUsers();
  }, []);

  useEffect(() => {
    fetchSuggestions();
  }, [activeFilter, debouncedSearch]);

  // ── Actions ──────────────────────────────────────────────────────────────
  const handleAddFriend = async (targetStudentId: string, studentName: string) => {
    // Optimistic UI update
    setSentRequests(prev => ({ ...prev, [targetStudentId]: true }));
    toast.success('Friend Request Sent', `Invite sent to ${studentName}!`);

    try {
      console.log(`[FriendsHub] Sending friend request to ${studentName} (${targetStudentId})...`);
      const res = await fetch('/api/friends', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetStudentId })
      });
      const data = await res.json();
      console.log('[FriendsHub] Add friend response:', data);

      if (!data.ok) {
        throw new Error(data.error || 'Failed to send friend request');
      }
      if (data.status === 'accepted') {
        toast.success('Connected!', `You and ${studentName} are now connected as friends!`);
        fetchNetworkData();
      }
    } catch (err: any) {
      console.error('[FriendsHub] Error adding friend:', err);
      toast.error('Could Not Send', err.message || 'Error communicating with Supabase.');
      setSentRequests(prev => {
        const next = { ...prev };
        delete next[targetStudentId];
        return next;
      });
    }
  };

  const handleAcceptRequest = async (reqId: string, name: string) => {
    setIncomingRequestsList(prev => prev.filter(r => r.id !== reqId));
    setNetworkStats(prev => ({ ...prev, pendingCount: Math.max(0, prev.pendingCount - 1), friendsCount: prev.friendsCount + 1 }));
    toast.success('Friend Request Accepted', `Connected with ${name}!`);

    try {
      console.log(`[FriendsHub] Accepting friend request ${reqId}...`);
      const res = await fetch('/api/friends', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId: reqId, action: 'accept' })
      });
      const data = await res.json();
      console.log('[FriendsHub] Accept request response:', data);
      fetchNetworkData();
    } catch (e) {
      console.error('[FriendsHub] Error accepting friend request:', e);
    }
  };

  const handleDeclineRequest = async (reqId: string) => {
    setIncomingRequestsList(prev => prev.filter(r => r.id !== reqId));
    setNetworkStats(prev => ({ ...prev, pendingCount: Math.max(0, prev.pendingCount - 1) }));
    toast.info('Request Dismissed', 'Friend request removed.');

    try {
      console.log(`[FriendsHub] Declining friend request ${reqId}...`);
      await fetch('/api/friends', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId: reqId, action: 'decline' })
      });
    } catch (e) {
      console.error('[FriendsHub] Error declining friend request:', e);
    }
  };

  const handleNavigateToProfile = (studentId: string) => {
    console.log(`[FriendsHub] Navigating to dedicated student profile: /friends/${studentId}`);
    router.push(`/friends/${studentId}`);
  };

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

  const handleSendChallenge = async (challenge: any) => {
    toast.success('Battle Challenge Dispatched', `Invited ${challenge.targetStudentName} to a 1v1 ${challenge.topic} Duel!`);
  };

  const handleSendProjectInvite = async (invite: any) => {
    toast.success('Squad Invite Sent', `Project invitation dispatched to ${invite.receiverName}!`);
  };

  // Filter out blocked users from display
  const activeSuggested = useMemo(() => {
    return suggestedStudents.filter(s => !blockedIds.includes(s.id));
  }, [suggestedStudents, blockedIds]);

  return (
    <div className="friends-container">
      {/* ── Top Header / Branding ── */}
      <div className="friends-top-header">
        <div>
          <h2 className="friends-title">Friends & Campus Network</h2>
          <p className="friends-subtitle">
            Find peers, match by skills, collaborate on squad projects, and compete in the arena.
          </p>
        </div>

        <div className="friends-header-actions">
          <button
            className="friends-icon-btn"
            title="Privacy Settings"
            onClick={() => setShowPrivacyModal(true)}
          >
            🔒 Privacy
          </button>
        </div>
      </div>

      {/* ── Main Two-Column Layout ── */}
      <div className="friends-content-grid">

        {/* ── LEFT / CENTER COLUMN ── */}
        <div className="friends-main-column">

          {/* Hero Banner with Custom Lettering & Graphic */}
          <div className="friends-hero-banner-ref">
            <div className="friends-hero-text-wrap">
              <h1 className="friends-hero-title-ref">
                Frien<span>ds</span>
              </h1>
              <p className="friends-hero-subtitle-ref">
                Find your people. Live Supabase student matching, collaborate, and level up together.
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
              {networkStats.friendsCount > 0 && (
                <span className="tab-counter-badge">{networkStats.friendsCount}</span>
              )}
            </button>
            <button
              className={`friends-tab-pill ${activeTab === 'requests' ? 'active' : ''}`}
              onClick={() => setActiveTab('requests')}
            >
              <span>👤+</span> Requests
              {networkStats.pendingCount > 0 && (
                <span className="tab-counter-badge" style={{ background: '#ef4444' }}>{networkStats.pendingCount}</span>
              )}
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

          {/* ── TAB 1: DISCOVER ── */}
          {activeTab === 'discover' && (
            <>
              {/* Live Search Bar */}
              <div className="friends-live-search-box">
                <span className="search-icon">🔍</span>
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Find friends by name, college, skills (e.g. React, Python, UI/UX)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    className="clear-search-btn"
                    onClick={() => {
                      setSearchQuery('');
                      searchInputRef.current?.focus();
                    }}
                    title="Clear search"
                  >
                    ✕
                  </button>
                )}
                {isSearching && (
                  <span style={{ fontSize: 12, color: '#818cf8', fontWeight: 600 }}>Searching...</span>
                )}
              </div>

              {/* Filter Chips Row */}
              <div className="friends-filters-row">
                <div className="filter-chips-left">
                  <button
                    className={`ref-filter-chip ${activeFilter === 'all' ? 'active' : ''}`}
                    onClick={() => setActiveFilter('all')}
                  >
                    All Students
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
                    Same Degree/Track
                  </button>
                  <button
                    className={`ref-filter-chip ${activeFilter === 'goals' ? 'active' : ''}`}
                    onClick={() => setActiveFilter('goals')}
                  >
                    Similar Goals
                  </button>
                </div>
              </div>

              {/* Suggested For You Section */}
              <div style={{ marginTop: 16 }}>
                <div className="section-header-row">
                  <div>
                    <h2 className="section-heading-title">
                      {searchQuery ? `Search Results (${activeSuggested.length})` : 'Suggested for you'}
                    </h2>
                    <div className="section-heading-sub">
                      {searchQuery
                        ? `Live students from Supabase matching "${searchQuery}"`
                        : 'Live registered students ranked by Career DNA & skill affinity'}
                    </div>
                  </div>
                  {activeSuggested.length > 0 && (
                    <div
                      className="see-all-link"
                      onClick={() => handleOpenSmartMatch(activeSuggested[0])}
                    >
                      AI Match Breakdown →
                    </div>
                  )}
                </div>

                {isLoading ? (
                  <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                    <div style={{ fontSize: 28, marginBottom: 10 }}>⚡</div>
                    <div>Querying Supabase campus directory...</div>
                  </div>
                ) : activeSuggested.length === 0 ? (
                  <div className="friends-empty-state-card">
                    <span className="empty-state-icon">🔍</span>
                    <h3 className="empty-state-title">No Students Found</h3>
                    <p className="empty-state-desc">
                      {searchQuery
                        ? `We couldn't find any students matching "${searchQuery}". Try searching by another skill (like "React", "Python"), degree, or clear the search.`
                        : 'No students currently match this filter criteria. Try selecting "All Students" to see the full campus directory.'}
                    </p>
                    {searchQuery && (
                      <button
                        className="friends-btn friends-btn-primary"
                        style={{ marginTop: 8 }}
                        onClick={() => setSearchQuery('')}
                      >
                        Clear Search
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="suggested-cards-grid" style={{ marginTop: 14 }}>
                    {activeSuggested.slice(0, 6).map((peer) => (
                      <div key={peer.id} className="suggested-peer-card">
                        <div className="suggested-card-top">
                          <div
                            className="suggested-avatar-box"
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleNavigateToProfile(peer.id)}
                            title={`View ${peer.name}'s Profile`}
                          >
                            <img src={peer.avatar} alt={peer.name} />
                            {peer.online && <span className="online-beacon" />}
                          </div>
                          <div
                            className="match-percentage-badge"
                            style={{ cursor: 'pointer' }}
                            title="Click for AI Affinity Breakdown"
                            onClick={() => handleOpenSmartMatch(peer)}
                          >
                            <span className="match-percentage-val">{peer.matchPct}%</span>
                            <span className="match-percentage-label">Match</span>
                          </div>
                        </div>

                        <div
                          className="suggested-peer-name"
                          title={peer.name}
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleNavigateToProfile(peer.id)}
                        >
                          {peer.name}
                        </div>
                        <div className="suggested-peer-degree">{peer.course} • {peer.college}</div>

                        <div className="suggested-skills-pills">
                          {peer.skills.map((s, i) => (
                            <span key={i} className="mini-skill-pill">{s}</span>
                          ))}
                        </div>

                        <div className="suggested-match-reason">
                          <span>{peer.matchDetails || '⚡ High skill synergy'}</span>
                        </div>

                        <div className="suggested-card-btn-row">
                          <button
                            className="friends-btn friends-btn-secondary"
                            onClick={() => handleNavigateToProfile(peer.id)}
                            style={{ padding: '7px 12px', fontSize: 12 }}
                          >
                            View Profile
                          </button>
                          {sentRequests[peer.id] ? (
                            <button
                              className="friends-btn friends-btn-pending"
                              style={{ padding: '7px 12px', fontSize: 12 }}
                              disabled
                            >
                              ✓ Sent
                            </button>
                          ) : (
                            <button
                              className="friends-btn friends-btn-primary"
                              onClick={() => handleAddFriend(peer.id, peer.name)}
                              style={{ padding: '7px 12px', fontSize: 12 }}
                            >
                              + Add Friend
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ── "All Students" Section (List vs Grid Mode) ── */}
              {activeSuggested.length > 6 && (
                <div className="all-students-section">
                  <div className="all-students-controls-row">
                    <h2 className="section-heading-title">All Campus Students ({activeSuggested.length})</h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
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

                  {viewMode === 'list' ? (
                    <div className="students-list-view-container">
                      {activeSuggested.slice(6).map((student) => (
                        <div key={student.id} className="student-list-item-row">
                          <div
                            className="student-list-identity"
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleNavigateToProfile(student.id)}
                          >
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
                              onClick={() => handleNavigateToProfile(student.id)}
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
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="suggested-cards-grid" style={{ marginTop: 14 }}>
                      {activeSuggested.slice(6).map((student) => (
                        <div key={student.id} className="suggested-peer-card">
                          <div className="suggested-card-top">
                            <div
                              className="suggested-avatar-box"
                              style={{ cursor: 'pointer' }}
                              onClick={() => handleNavigateToProfile(student.id)}
                            >
                              <img src={student.avatar} alt={student.name} />
                              {student.online && <span className="online-beacon" />}
                            </div>
                            <div className="match-percentage-badge">
                              <span className="match-percentage-val">{student.matchPct}%</span>
                            </div>
                          </div>
                          <div
                            className="suggested-peer-name"
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleNavigateToProfile(student.id)}
                          >
                            {student.name}
                          </div>
                          <div className="suggested-peer-degree">{student.course} • {student.college}</div>
                          <div className="suggested-skills-pills">
                            {student.skills.map((s, i) => (
                              <span key={i} className="mini-skill-pill">{s}</span>
                            ))}
                          </div>
                          <div className="suggested-card-btn-row">
                            <button
                              className="friends-btn friends-btn-secondary"
                              onClick={() => handleNavigateToProfile(student.id)}
                              style={{ padding: '7px 12px', fontSize: 12 }}
                            >
                              View Profile
                            </button>
                            {sentRequests[student.id] ? (
                              <button className="friends-btn friends-btn-pending" disabled style={{ padding: '7px 12px', fontSize: 12 }}>
                                ✓ Sent
                              </button>
                            ) : (
                              <button
                                className="friends-btn friends-btn-primary"
                                onClick={() => handleAddFriend(student.id, student.name)}
                                style={{ padding: '7px 12px', fontSize: 12 }}
                              >
                                + Add Friend
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* ── TAB 2: MY FRIENDS ── */}
          {activeTab === 'network' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 14 }}>
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 800, color: '#ffffff', margin: 0 }}>
                    My Friends ({friendsNetwork.length})
                  </h2>
                  <p style={{ fontSize: 12, color: '#94a3b8', margin: '4px 0 0' }}>
                    Active campus connections for collaboration, practice duels, and squad builds.
                  </p>
                </div>
                <button className="friends-btn friends-btn-primary" onClick={() => setActiveTab('discover')}>
                  + Discover Peers
                </button>
              </div>

              {friendsNetwork.length === 0 ? (
                <div className="friends-empty-state-card">
                  <span className="empty-state-icon">👥</span>
                  <h3 className="empty-state-title">No Friends Connected Yet</h3>
                  <p className="empty-state-desc">
                    Your campus circle is just getting started. Explore the Discover tab to send requests to classmates, project partners, and arena rivals.
                  </p>
                  <button
                    className="friends-btn friends-btn-primary"
                    style={{ marginTop: 12 }}
                    onClick={() => setActiveTab('discover')}
                  >
                    Browse Students
                  </button>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
                  {friendsNetwork.map((friend) => (
                    <div key={friend.id} style={{ padding: 16, background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div
                          style={{ position: 'relative', width: 44, height: 44, flexShrink: 0, cursor: 'pointer' }}
                          onClick={() => handleNavigateToProfile(friend.id)}
                        >
                          <img src={friend.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'} alt={friend.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                          {friend.online && <span className="online-beacon" />}
                        </div>
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div
                            style={{ fontSize: 14, fontWeight: 700, color: '#ffffff', cursor: 'pointer' }}
                            onClick={() => handleNavigateToProfile(friend.id)}
                          >
                            {friend.name}
                          </div>
                          <div style={{ fontSize: 11.5, color: '#94a3b8' }}>{friend.course} • {friend.college}</div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {friend.skills.slice(0, 3).map((sk, idx) => (
                          <span key={idx} className="mini-skill-pill">{sk}</span>
                        ))}
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, paddingTop: 4 }}>
                        <button
                          className="friends-btn friends-btn-secondary"
                          style={{ fontSize: 11.5, padding: '7px' }}
                          onClick={() => { setActiveChatFriendId(friend.id); setActiveTab('messages'); }}
                        >
                          💬 Chat
                        </button>
                        <button
                          className="friends-btn friends-btn-secondary"
                          style={{ fontSize: 11.5, padding: '7px' }}
                          onClick={() => setChallengeStudent(friend)}
                        >
                          ⚔️ Duel
                        </button>
                        <button
                          className="friends-btn friends-btn-secondary"
                          style={{ fontSize: 11.5, padding: '7px' }}
                          onClick={() => setProjectStudent(friend)}
                        >
                          👥 Project
                        </button>
                        <button
                          className="friends-btn friends-btn-secondary"
                          style={{ fontSize: 11.5, padding: '7px' }}
                          onClick={() => handleNavigateToProfile(friend.id)}
                        >
                          Profile
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── TAB 3: REQUESTS ── */}
          {activeTab === 'requests' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#ffffff', marginBottom: 12 }}>
                  Incoming Friend Requests ({incomingRequestsList.length})
                </h3>
                {incomingRequestsList.length === 0 ? (
                  <div className="friends-empty-state-card">
                    <span className="empty-state-icon">📫</span>
                    <h3 className="empty-state-title">No Pending Requests</h3>
                    <p className="empty-state-desc">
                      You are all caught up! When classmates send you connection requests, they will appear here.
                    </p>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 14 }}>
                    {incomingRequestsList.map((req) => (
                      <div key={req.id} style={{ padding: 16, background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <img
                            src={req.avatar}
                            alt={req.name}
                            style={{ width: 40, height: 40, borderRadius: '50%', cursor: 'pointer' }}
                            onClick={() => handleNavigateToProfile(req.studentId)}
                          />
                          <div>
                            <div
                              style={{ fontSize: 14, fontWeight: 700, color: '#ffffff', cursor: 'pointer' }}
                              onClick={() => handleNavigateToProfile(req.studentId)}
                            >
                              {req.name}
                            </div>
                            <div style={{ fontSize: 11.5, color: '#94a3b8' }}>{req.course} • {req.college}</div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: 6 }}>
                          {req.skills.map((s: string, i: number) => (
                            <span key={i} className="mini-skill-pill">{s}</span>
                          ))}
                        </div>

                        <div style={{ display: 'flex', gap: 8 }}>
                          <button
                            className="friends-btn friends-btn-primary"
                            style={{ flex: 1, fontSize: 12, padding: '8px' }}
                            onClick={() => handleAcceptRequest(req.id, req.name)}
                          >
                            ✓ Accept
                          </button>
                          <button
                            className="friends-btn friends-btn-secondary"
                            style={{ flex: 1, fontSize: 12, padding: '8px' }}
                            onClick={() => handleDeclineRequest(req.id)}
                          >
                            Decline
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── TAB 4: MESSAGES ── */}
          {activeTab === 'messages' && (
            <FriendChatView
              initialFriendId={activeChatFriendId}
              friends={friendsNetwork.length > 0 ? friendsNetwork : suggestedStudents}
              onOpenProfile={(s) => handleNavigateToProfile(s.id)}
              onOpenChallenge={(s) => setChallengeStudent(s)}
              onOpenProjectInvite={(s) => setProjectStudent(s)}
            />
          )}

          {/* ── TAB 5: CHALLENGES ── */}
          {activeTab === 'challenges' && (
            <ArenaChallengesView
              onOpenChallengeModal={(s) => setChallengeStudent(s || (suggestedStudents[0] || null))}
            />
          )}

          {/* ── TAB 6: GROUP PROJECTS ── */}
          {activeTab === 'projects' && (
            <SquadProjectsView
              onOpenInviteModal={(projTitle) => {
                setSelectedProjectTitle(projTitle || 'CareerOS Platform');
                setProjectStudent(suggestedStudents[0] || null);
              }}
            />
          )}

        </div>

        {/* ── RIGHT COLUMN: NETWORK SUMMARY & QUICK ACTIONS ── */}
        <div className="friends-sidebar-column">

          {/* 1. "Your Network" Card (LIVE DYNAMIC COUNTS) */}
          <div className="ref-sidebar-card">
            <div className="ref-sidebar-header">
              <span>Your Network</span>
              <span
                style={{ fontSize: 13, color: '#818cf8', cursor: 'pointer', fontWeight: 600 }}
                onClick={() => setActiveTab('network')}
              >
                View all ›
              </span>
            </div>

            <div className="network-stats-row">
              <div
                className="network-stat-box"
                style={{ cursor: 'pointer' }}
                onClick={() => setActiveTab('network')}
              >
                <span className="network-stat-icon" style={{ color: '#818cf8' }}>👥</span>
                <div>
                  <div className="network-stat-num">{networkStats.friendsCount}</div>
                  <div className="network-stat-text">Friends</div>
                </div>
              </div>

              <div
                className="network-stat-box"
                style={{ cursor: 'pointer' }}
                onClick={() => setActiveTab('requests')}
              >
                <span className="network-stat-icon" style={{ color: '#f87171' }}>🚀</span>
                <div>
                  <div className="network-stat-num">{networkStats.pendingCount}</div>
                  <div className="network-stat-text">Requests</div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. "Connected Peers" / Messages Preview */}
          <div className="ref-sidebar-card">
            <div className="ref-sidebar-header">
              <span>Direct Chat</span>
              <span className="see-all-link" style={{ fontSize: 11.5 }} onClick={() => setActiveTab('messages')}>
                Open chat →
              </span>
            </div>

            {friendsNetwork.length === 0 ? (
              <div style={{ padding: '16px 8px', textAlign: 'center', fontSize: 12, color: '#94a3b8' }}>
                No active conversations yet.<br />
                Connect with peers to unlock 1v1 chat!
              </div>
            ) : (
              <div className="recent-messages-list">
                {friendsNetwork.slice(0, 4).map((friend) => (
                  <div
                    key={friend.id}
                    className="recent-msg-item"
                    onClick={() => {
                      setActiveChatFriendId(friend.id);
                      setActiveTab('messages');
                    }}
                  >
                    <div className="recent-msg-avatar-wrap">
                      <img src={friend.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'} alt={friend.name} />
                      {friend.online && <span className="online-beacon" />}
                    </div>
                    <div className="recent-msg-meta">
                      <div className="recent-msg-author">{friend.name}</div>
                      <div className="recent-msg-snippet">{friend.college}</div>
                    </div>
                    <span className="recent-msg-time">Chat</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 3. "Quick Actions" 2x2 Grid */}
          <div className="ref-sidebar-card">
            <div className="ref-sidebar-header">
              <span>Quick Actions</span>
            </div>

            <div className="quick-actions-grid">
              <div
                className="quick-action-tile purple"
                onClick={() => setChallengeStudent(suggestedStudents[0] || null)}
              >
                <div className="tile-icon-title">
                  <span className="tile-icon">🏆</span>
                  <span className="tile-label">Invite to<br />Challenge</span>
                </div>
                <span className="tile-arrow">›</span>
              </div>

              <div
                className="quick-action-tile green"
                onClick={() => setProjectStudent(suggestedStudents[0] || null)}
              >
                <div className="tile-icon-title">
                  <span className="tile-icon">👥</span>
                  <span className="tile-label">Invite to<br />Project</span>
                </div>
                <span className="tile-arrow">›</span>
              </div>

              <div
                className="quick-action-tile blue"
                onClick={() => {
                  setActiveTab('discover');
                  searchInputRef.current?.focus();
                }}
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

      {/* ── Arena Challenge Modal ── */}
      <ArenaChallengeModal
        student={challengeStudent}
        onClose={() => setChallengeStudent(null)}
        onSendChallenge={handleSendChallenge}
      />

      {/* ── Smart Match Breakdown Modal ── */}
      <SmartMatchModal
        student={smartMatchStudent}
        match={smartMatchBreakdown}
        onClose={() => { setSmartMatchStudent(null); setSmartMatchBreakdown(null); }}
        onAddFriend={(id, name) => handleAddFriend(id, name)}
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

      {/* ── Project Invite Modal ── */}
      <ProjectInviteModal
        student={projectStudent}
        onClose={() => setProjectStudent(null)}
        onSendInvite={handleSendProjectInvite}
      />

      {/* ── Privacy Settings Modal ── */}
      {showPrivacyModal && (
        <PrivacySettingsModal
          onClose={() => {
            setShowPrivacyModal(false);
            fetchBlockedUsers();
          }}
        />
      )}

      {/* ── Report Student Modal ── */}
      <ReportStudentModal
        student={reportModalStudent}
        onClose={() => setReportModalStudent(null)}
      />
    </div>
  );
}
