'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { toast } from '@/lib/store/useAppStore';
import { StudentCard, StudentProfile } from '@/components/friends/StudentCard';
import { FriendProfileDrawer } from '@/components/friends/FriendProfileDrawer';
import { ArenaChallengeModal } from '@/components/friends/ArenaChallengeModal';
import { ProjectInviteModal } from '@/components/friends/ProjectInviteModal';

export default function FriendsPage() {
  const { user } = useAuth();

  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<'discover' | 'network' | 'requests' | 'messages' | 'invitations'>('discover');

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'college' | 'skills'>('all');

  // Network Data State
  const [loading, setLoading] = useState(true);
  const [discoverStudents, setDiscoverStudents] = useState<StudentProfile[]>([]);
  const [friendsList, setFriendsList] = useState<any[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<any[]>([]);
  const [sentRequests, setSentRequests] = useState<any[]>([]);
  const [invitations, setInvitations] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);

  // Modals & Drawer State
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null);
  const [challengeStudent, setChallengeStudent] = useState<StudentProfile | null>(null);
  const [projectStudent, setProjectStudent] = useState<StudentProfile | null>(null);

  // V2 Messaging State
  const [activeConvoStudent, setActiveConvoStudent] = useState<StudentProfile | null>(null);
  const [chatMessages, setChatMessages] = useState<Array<{ id: string; senderId: string; text: string; time: string }>>([
    { id: '1', senderId: 'student_arjun_02', text: 'Hey! Are we going to team up for the Squad Project this weekend?', time: '2:15 PM' },
    { id: '2', senderId: 'current_user', text: "Yes absolutely! Let's do the AI Resume Analyzer frontend.", time: '2:18 PM' }
  ]);
  const [chatInput, setChatInput] = useState('');

  // ── Fetch network data ───────────────────────────────────────────────────
  const fetchNetworkData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/friends');
      const data = await res.json();
      if (data.ok) {
        setFriendsList(data.friends || []);
        setIncomingRequests(data.incomingRequests || []);
        setSentRequests(data.sentRequests || []);
        setInvitations(data.invitations || []);
      }
    } catch (err) {
      console.error('Failed to load friends network:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Fetch search & suggestions ───────────────────────────────────────────
  const fetchSearchStudents = useCallback(async (q = '', filter = 'all') => {
    try {
      const res = await fetch(`/api/friends/search?q=${encodeURIComponent(q)}&filter=${filter}`);
      const data = await res.json();
      if (data.ok) {
        setDiscoverStudents(data.results || []);
      }
    } catch (err) {
      console.error('Failed to search students:', err);
    }
  }, []);

  const fetchSuggestions = useCallback(async () => {
    try {
      const res = await fetch('/api/friends/suggestions');
      const data = await res.json();
      if (data.ok) {
        setSuggestions(data.suggestions || []);
      }
    } catch (err) {
      console.error('Failed to fetch suggestions:', err);
    }
  }, []);

  useEffect(() => {
    fetchNetworkData();
    fetchSearchStudents('', 'all');
    fetchSuggestions();
  }, [fetchNetworkData, fetchSearchStudents, fetchSuggestions]);

  // ── Debounced Search ─────────────────────────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSearchStudents(searchQuery, activeFilter);
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery, activeFilter, fetchSearchStudents]);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleSendRequest = async (targetStudentId: string) => {
    try {
      const res = await fetch('/api/friends', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetStudentId }),
      });
      const data = await res.json();
      if (data.ok) {
        toast.success('Friend Request Sent', 'Student will receive your invitation in their network feed.');
        fetchNetworkData();
        fetchSearchStudents(searchQuery, activeFilter);
      } else {
        toast.error('Could not send request', data.error);
      }
    } catch {
      toast.error('Network error', 'Failed to reach server');
    }
  };

  const handleRespondRequest = async (requestId: string, action: 'accept' | 'decline') => {
    try {
      const res = await fetch('/api/friends/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, action }),
      });
      const data = await res.json();
      if (data.ok) {
        if (action === 'accept') {
          toast.success('Friend Request Accepted', 'You are now connected! You can message, battle, or invite to projects.');
        } else {
          toast.info('Request Declined', 'Invitation has been dismissed.');
        }
        fetchNetworkData();
        fetchSearchStudents(searchQuery, activeFilter);
      }
    } catch {
      toast.error('Network error', 'Failed to update request');
    }
  };

  const handleRemoveFriend = async (studentId: string) => {
    if (!confirm('Are you sure you want to remove this connection?')) return;
    try {
      const res = await fetch(`/api/friends?studentId=${studentId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.ok) {
        toast.info('Friend Removed', 'Connection removed from your network.');
        setSelectedStudent(null);
        fetchNetworkData();
        fetchSearchStudents(searchQuery, activeFilter);
      }
    } catch {
      toast.error('Error', 'Failed to remove connection');
    }
  };

  const handleSendChallenge = (payload: { studentId: string; topic: string; difficulty: string; message: string }) => {
    toast.success('Challenging Arena Invite Dispatched!', `1v1 Duel invitation sent for ${payload.topic} (${payload.difficulty}).`);
    // Optimistically add to invitations
    setInvitations(prev => [
      {
        id: 'inv-' + Date.now(),
        type: 'arena',
        title: `Challenging Arena Duel: ${payload.topic}`,
        sender: { id: 'current_user', name: user?.displayName || 'You', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=You' },
        details: `${payload.difficulty} • "${payload.message}"`,
        timeAgo: 'Just now',
        status: 'pending'
      },
      ...prev
    ]);
  };

  const handleSendProjectInvite = (payload: { studentId: string; projectName: string; role: string; message: string }) => {
    toast.success('Squad Project Invitation Sent!', `Invited to ${payload.projectName} as ${payload.role}.`);
    setInvitations(prev => [
      {
        id: 'inv-' + Date.now(),
        type: 'project',
        title: payload.projectName,
        sender: { id: 'current_user', name: user?.displayName || 'You', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=You' },
        details: `Role: ${payload.role} • "${payload.message}"`,
        timeAgo: 'Just now',
        status: 'pending'
      },
      ...prev
    ]);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const newMsg = {
      id: String(Date.now()),
      senderId: 'current_user',
      text: chatInput.trim(),
      time: 'Just now'
    };
    setChatMessages(prev => [...prev, newMsg]);
    setChatInput('');
  };

  return (
    <div className="friends-container">
      {/* ── Hero Banner ── */}
      <div className="friends-hero">
        <div className="friends-hero-content">
          <div className="friends-hero-badge">
            <span>👥</span> Student Network & Collaboration Hub
          </div>
          <h1 className="friends-hero-title">
            Connect. Compete. Build Together.
          </h1>
          <p className="friends-hero-subtitle">
            Discover peer engineers, form squad project teams, challenge classmates to 1v1 Arena coding duels, and share verified portfolio proof-of-work.
          </p>

          <div className="friends-stats-bar">
            <div className="friends-stat-card">
              <div className="friends-stat-icon">👥</div>
              <div>
                <div className="friends-stat-value">{friendsList.length}</div>
                <div className="friends-stat-label">My Friends</div>
              </div>
            </div>

            <div className="friends-stat-card">
              <div className="friends-stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', borderColor: 'rgba(245, 158, 11, 0.3)' }}>
                ⏳
              </div>
              <div>
                <div className="friends-stat-value">{incomingRequests.length}</div>
                <div className="friends-stat-label">Pending Requests</div>
              </div>
            </div>

            <div className="friends-stat-card">
              <div className="friends-stat-icon" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
                ⚔️
              </div>
              <div>
                <div className="friends-stat-value">{invitations.length}</div>
                <div className="friends-stat-label">Active Invites</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Navigation Tabs ── */}
      <div className="friends-nav-tabs">
        <button
          className={`friends-tab-btn ${activeTab === 'discover' ? 'active' : ''}`}
          onClick={() => setActiveTab('discover')}
        >
          🔍 Discover Students
        </button>
        <button
          className={`friends-tab-btn ${activeTab === 'network' ? 'active' : ''}`}
          onClick={() => setActiveTab('network')}
        >
          👥 My Friends
          {friendsList.length > 0 && <span className="friends-tab-badge">{friendsList.length}</span>}
        </button>
        <button
          className={`friends-tab-btn ${activeTab === 'requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('requests')}
        >
          📬 Friend Requests
          {incomingRequests.length > 0 && (
            <span className="friends-tab-badge highlight">{incomingRequests.length}</span>
          )}
        </button>
        <button
          className={`friends-tab-btn ${activeTab === 'messages' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('messages');
            if (friendsList.length > 0 && !activeConvoStudent) {
              setActiveConvoStudent(friendsList[0].student);
            }
          }}
        >
          💬 Direct Messages (V2)
        </button>
        <button
          className={`friends-tab-btn ${activeTab === 'invitations' ? 'active' : ''}`}
          onClick={() => setActiveTab('invitations')}
        >
          ⚔️ Arena & Project Invites
          {invitations.length > 0 && <span className="friends-tab-badge">{invitations.length}</span>}
        </button>
      </div>

      {/* ── TAB 1: DISCOVER ── */}
      {activeTab === 'discover' && (
        <>
          {/* Search & Filter Bar */}
          <div className="friends-search-wrapper">
            <div className="friends-search-input-box">
              <span className="friends-search-icon">🔍</span>
              <input
                type="text"
                className="friends-search-input"
                placeholder="Search students by name, skill (e.g. React, Python), college, course, or career goal..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className="friends-search-clear-btn" onClick={() => setSearchQuery('')}>✕</button>
              )}
            </div>

            <div className="friends-filter-chips-row">
              <span style={{ fontSize: 12, fontWeight: 700, color: '#64748b', marginRight: 4 }}>Filter:</span>
              <button
                className={`friends-filter-chip ${activeFilter === 'all' ? 'active' : ''}`}
                onClick={() => setActiveFilter('all')}
              >
                All Students
              </button>
              <button
                className={`friends-filter-chip ${activeFilter === 'college' ? 'active' : ''}`}
                onClick={() => setActiveFilter('college')}
              >
                🏫 Same College (BGSIT)
              </button>
              <button
                className={`friends-filter-chip ${activeFilter === 'skills' ? 'active' : ''}`}
                onClick={() => setActiveFilter('skills')}
              >
                ⚡ Full Stack & TypeScript
              </button>
            </div>
          </div>

          {/* Smart Suggestions Banner (V5) */}
          {!searchQuery && suggestions.length > 0 && (
            <div className="friends-suggestions-section">
              <div className="friends-section-title-row">
                <div className="friends-section-title">
                  <span>⚡</span> Recommended Peers for You
                </div>
                <span style={{ fontSize: 12, color: '#64748b' }}>Based on your skills & learning track</span>
              </div>

              <div className="suggestions-scroll-track">
                {suggestions.map((s) => (
                  <div key={s.id} className="suggestion-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <img src={s.avatar} alt={s.name} style={{ width: 44, height: 44, borderRadius: '50%' }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {s.name}
                        </div>
                        <div style={{ fontSize: 11.5, color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {s.headline}
                        </div>
                      </div>
                    </div>

                    <div className="match-reason-badge">
                      <span>✦</span> {s.matchReason}
                    </div>

                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {s.skills.map((sk: string, i: number) => (
                        <span key={i} className="friends-skill-pill">{sk}</span>
                      ))}
                    </div>

                    <button
                      className="friends-btn friends-btn-primary"
                      onClick={() => handleSendRequest(s.id)}
                      style={{ width: '100%', marginTop: 4 }}
                    >
                      + Connect
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Students Grid */}
          <div className="friends-section-title-row">
            <div className="friends-section-title">
              <span>🌐</span> Student Directory ({discoverStudents.length})
            </div>
          </div>

          {discoverStudents.length === 0 ? (
            <div className="friends-empty-box">
              <div className="friends-empty-icon">🔍</div>
              <div className="friends-empty-title">No Students Found</div>
              <div className="friends-empty-desc">
                We couldn&apos;t find any students matching &quot;{searchQuery}&quot;. Try searching for skills like &quot;React&quot;, &quot;Python&quot;, or college names.
              </div>
              <button className="friends-btn friends-btn-secondary" onClick={() => { setSearchQuery(''); setActiveFilter('all'); }}>
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="friends-grid">
              {discoverStudents.map((student) => (
                <StudentCard
                  key={student.id}
                  student={student}
                  onViewProfile={(s) => setSelectedStudent(s)}
                  onSendRequest={handleSendRequest}
                  onOpenMessage={(s) => {
                    setActiveConvoStudent(s);
                    setActiveTab('messages');
                  }}
                  onOpenChallenge={(s) => setChallengeStudent(s)}
                  onOpenProjectInvite={(s) => setProjectStudent(s)}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* ── TAB 2: MY FRIENDS ── */}
      {activeTab === 'network' && (
        <>
          <div className="friends-section-title-row">
            <div className="friends-section-title">
              <span>👥</span> Connected Friends ({friendsList.length})
            </div>
          </div>

          {friendsList.length === 0 ? (
            <div className="friends-empty-box">
              <div className="friends-empty-icon">👥</div>
              <div className="friends-empty-title">Your Network is Empty</div>
              <div className="friends-empty-desc">
                You haven&apos;t connected with any students yet. Head to Discover Students to search by skills, college, and start building your network.
              </div>
              <button className="friends-btn friends-btn-primary" onClick={() => setActiveTab('discover')}>
                🔍 Discover Students
              </button>
            </div>
          ) : (
            <div className="friends-grid">
              {friendsList.map(({ friendshipId, student }) => (
                <StudentCard
                  key={student.id}
                  student={{ ...student, relationship: 'friends', friendshipId }}
                  onViewProfile={(s) => setSelectedStudent(s)}
                  onRemoveFriend={handleRemoveFriend}
                  onOpenMessage={(s) => {
                    setActiveConvoStudent(s);
                    setActiveTab('messages');
                  }}
                  onOpenChallenge={(s) => setChallengeStudent(s)}
                  onOpenProjectInvite={(s) => setProjectStudent(s)}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* ── TAB 3: REQUESTS ── */}
      {activeTab === 'requests' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          <div>
            <div className="friends-section-title-row">
              <div className="friends-section-title">
                <span>📥</span> Received Requests ({incomingRequests.length})
              </div>
            </div>

            {incomingRequests.length === 0 ? (
              <div className="friends-empty-box" style={{ padding: '36px 20px' }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>📬</div>
                <div className="friends-empty-title">No Pending Received Requests</div>
                <div className="friends-empty-desc">When classmates or peers want to connect with you, their requests will appear here.</div>
              </div>
            ) : (
              <div className="friends-grid">
                {incomingRequests.map(({ requestId, sender }) => (
                  <StudentCard
                    key={requestId}
                    student={{ ...sender, relationship: 'received', skills: sender.skills || ['React', 'Full Stack'] }}
                    requestId={requestId}
                    onViewProfile={(s) => setSelectedStudent(s)}
                    onAcceptRequest={(rid) => handleRespondRequest(rid, 'accept')}
                    onDeclineRequest={(rid) => handleRespondRequest(rid, 'decline')}
                  />
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="friends-section-title-row">
              <div className="friends-section-title">
                <span>📤</span> Sent Requests ({sentRequests.length})
              </div>
            </div>

            {sentRequests.length === 0 ? (
              <div className="friends-empty-box" style={{ padding: '36px 20px' }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>🚀</div>
                <div className="friends-empty-title">No Active Sent Requests</div>
                <div className="friends-empty-desc">Friend requests you send to other students will be listed here until they respond.</div>
              </div>
            ) : (
              <div className="friends-grid">
                {sentRequests.map(({ requestId, recipient }) => (
                  <StudentCard
                    key={requestId}
                    student={{ ...recipient, relationship: 'sent', skills: recipient.skills || ['Python', 'DSA'] }}
                    onViewProfile={(s) => setSelectedStudent(s)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 4: DIRECT MESSAGES (V2 REALTIME) ── */}
      {activeTab === 'messages' && (
        <div className="friends-chat-container">
          <div className="friends-chat-sidebar">
            <div className="chat-sidebar-header">
              💬 Direct Chats ({friendsList.length})
            </div>
            <div className="chat-convos-list">
              {friendsList.length === 0 ? (
                <div style={{ padding: 20, textAlign: 'center', color: '#64748b', fontSize: 12 }}>
                  Add friends to start chatting!
                </div>
              ) : (
                friendsList.map(({ student }) => (
                  <div
                    key={student.id}
                    className={`chat-convo-item ${activeConvoStudent?.id === student.id ? 'active' : ''}`}
                    onClick={() => setActiveConvoStudent(student)}
                  >
                    <img src={student.avatar} alt={student.name} style={{ width: 36, height: 36, borderRadius: '50%' }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {student.name}
                      </div>
                      <div style={{ fontSize: 11, color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {student.headline}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="friends-chat-main">
            {activeConvoStudent ? (
              <>
                <div className="chat-main-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <img src={activeConvoStudent.avatar} alt={activeConvoStudent.name} style={{ width: 40, height: 40, borderRadius: '50%' }} />
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: '#ffffff' }}>{activeConvoStudent.name}</div>
                      <div style={{ fontSize: 11.5, color: '#34d399' }}>● Active Student Peer</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="friends-btn friends-btn-secondary" onClick={() => setChallengeStudent(activeConvoStudent)}>
                      ⚔️ Arena Battle
                    </button>
                    <button className="friends-btn friends-btn-secondary" onClick={() => setProjectStudent(activeConvoStudent)}>
                      📁 Squad Invite
                    </button>
                  </div>
                </div>

                <div className="chat-messages-area">
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`chat-bubble ${msg.senderId === 'current_user' ? 'chat-bubble-out' : 'chat-bubble-in'}`}
                    >
                      <div>{msg.text}</div>
                      <span className="chat-bubble-time">{msg.time}</span>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendMessage} className="chat-input-bar">
                  <input
                    type="text"
                    className="chat-input-field"
                    placeholder={`Type a message to ${activeConvoStudent.name}... (Press Enter)`}
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                  />
                  <button type="submit" className="friends-btn friends-btn-primary">
                    Send
                  </button>
                </form>
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#64748b' }}>
                Select a friend from the sidebar to open direct chat.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 5: INVITATIONS (V3/V4) ── */}
      {activeTab === 'invitations' && (
        <div>
          <div className="friends-section-title-row">
            <div className="friends-section-title">
              <span>📬</span> Arena & Project Invitations ({invitations.length})
            </div>
          </div>

          {invitations.length === 0 ? (
            <div className="friends-empty-box">
              <div className="friends-empty-icon">⚔️</div>
              <div className="friends-empty-title">No Pending Invitations</div>
              <div className="friends-empty-desc">
                When a friend challenges you to a 1v1 Arena duel or invites you to join an industry squad project, it will appear here.
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {invitations.map((inv) => (
                <div key={inv.id} className="invitation-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <img src={inv.sender.avatar} alt={inv.sender.name} style={{ width: 48, height: 48, borderRadius: '50%' }} />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span className={`invitation-badge ${inv.type === 'arena' ? 'arena' : 'project'}`}>
                          {inv.type === 'arena' ? '⚔️ Arena 1v1 Duel' : '📁 Squad Project'}
                        </span>
                        <span style={{ fontSize: 15, fontWeight: 700, color: '#ffffff' }}>{inv.title}</span>
                      </div>
                      <div style={{ fontSize: 13, color: '#a5b4fc' }}>
                        From <strong>{inv.sender.name}</strong> • {inv.details}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      className="friends-btn friends-btn-success"
                      onClick={() => {
                        toast.success('Invitation Accepted!', `Proceeding to ${inv.title}.`);
                        setInvitations(prev => prev.filter(i => i.id !== inv.id));
                      }}
                    >
                      Accept
                    </button>
                    <button
                      className="friends-btn friends-btn-secondary"
                      onClick={() => {
                        toast.info('Invitation Dismissed');
                        setInvitations(prev => prev.filter(i => i.id !== inv.id));
                      }}
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Slide-over Profile Drawer ── */}
      <FriendProfileDrawer
        student={selectedStudent}
        onClose={() => setSelectedStudent(null)}
        onSendRequest={handleSendRequest}
        onRemoveFriend={handleRemoveFriend}
        onOpenMessage={(s) => {
          setSelectedStudent(null);
          setActiveConvoStudent(s);
          setActiveTab('messages');
        }}
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
