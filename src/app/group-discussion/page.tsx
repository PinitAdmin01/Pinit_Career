'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/context/AuthContext';
import { useCareerOS } from '@/lib/context/CareerOSContext';
import { toast } from '@/lib/store/useAppStore';
import GdReport from '@/components/group-discussion/GdReport';
import { speakWithAvatar, stopSpeaking } from '@/lib/tts';
import PinsGate from '@/components/pins/PinsGate';
import { resolveFloatingMentorId, resolveGdHostId } from '@/lib/group-discussion/gdTurnEngine';
import '@/styles/group-discussion.css';

import { AVATARS, SUGGESTED_TOPICS, getAuthHeaders } from './constants';
import { useGdOrchestrator } from './hooks/useGdOrchestrator';
import GdMeetGrid from './components/GdMeetGrid';
import GdTranscriptDrawer from './components/GdTranscriptDrawer';
import GdAvatarGuideModal from './components/GdAvatarGuideModal';
import GdHistoryModal, { GdHistoryRecord } from './components/GdHistoryModal';

export default function GroupDiscussionPage() {
  const { user } = useAuth();
  const cOS = useCareerOS();
  const currentMentorId = resolveFloatingMentorId({
    guidanceMentorId: user?.guidanceMentorId,
    selectedTeacherId: user?.selectedTeacherId,
  });
  const gdHostId = resolveGdHostId(currentMentorId);

  // Exclude user's currently active mentor to prevent overlap
  const filteredAvatars = AVATARS.filter(a => a.id !== currentMentorId);

  // Navigation steps: 'create_room' | 'invite_concept' | 'call_grid'
  const [step, setStep] = useState<'create_room' | 'invite_concept' | 'call_grid'>('create_room');

  // Difficulty & Custom Avatar Guide & History Modal States
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [domain, setDomain] = useState<'technical' | 'sales' | 'business'>('technical');
  const [sessionDurationMinutes, setSessionDurationMinutes] = useState<number>(10);
  const [avatarGuideOpen, setAvatarGuideOpen] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<GdHistoryRecord | null>(null);
  const [historySearchQuery, setHistorySearchQuery] = useState('');
  const [historyDomainFilter, setHistoryDomainFilter] = useState<'all' | 'technical' | 'sales' | 'business'>('all');
  const [historyListState, setHistoryListState] = useState<GdHistoryRecord[]>([]);

  // Room details
  const [roomName, setRoomName] = useState('');
  const [roomDesc, setRoomDesc] = useState('');
  const [selectedConcept, setSelectedConcept] = useState('Microservices Orchestration');
  const [invitedAvatars, setInvitedAvatars] = useState<string[]>([]);

  const refreshHistoryList = useCallback(async () => {
    if (typeof window === 'undefined') return;
    const historyKey = `pinit_gd_history_${user?.id || 'anon'}`;
    let localList: GdHistoryRecord[] = [];
    try {
      const stored = localStorage.getItem(historyKey);
      localList = stored ? JSON.parse(stored) : [];
      setHistoryListState(localList);
    } catch (e) {
      console.warn('Failed to load local GD history:', e);
    }

    if (user?.id) {
      try {
        const headers = await getAuthHeaders();
        const res = await fetch('/api/gd/history', { headers });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.sessions) && data.sessions.length > 0) {
            const map = new Map<string, GdHistoryRecord>();
            localList.forEach(item => map.set(item.id, item));
            data.sessions.forEach((item: any) => map.set(item.id, item));
            const merged = Array.from(map.values()).slice(0, 25);
            setHistoryListState(merged);
            localStorage.setItem(historyKey, JSON.stringify(merged));
          }
        }
      } catch (err) {
        console.warn('[GD History] Remote cloud fetch error:', err);
      }
    }
  }, [user?.id]);

  useEffect(() => {
    refreshHistoryList();
  }, [refreshHistoryList]);

  const handleDeleteHistoryItem = (id: string) => {
    if (typeof window === 'undefined') return;
    try {
      const historyKey = `pinit_gd_history_${user?.id || 'anon'}`;
      const stored = localStorage.getItem(historyKey);
      const list = stored ? JSON.parse(stored) : [];
      const updated = list.filter((item: any) => item.id !== id);
      localStorage.setItem(historyKey, JSON.stringify(updated));
      setHistoryListState(updated);
      if (selectedHistoryItem?.id === id) {
        setSelectedHistoryItem(null);
      }
      toast.success('Record Deleted', 'Past boardroom history item removed.');

      if (user?.id) {
        getAuthHeaders().then(async headers => {
          try {
            await fetch(`/api/gd/history?id=${encodeURIComponent(id)}`, {
              method: 'DELETE',
              headers
            });
          } catch (err) {
            console.warn('[GD History] Remote delete failed:', err);
          }
        }).catch(() => {});
      }
    } catch (e) {
      console.warn('Failed to delete history item:', e);
    }
  };

  const handleExportHistoryJSON = (record: GdHistoryRecord) => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(record, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `gd_session_${(record.topic || 'session').replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      toast.success('JSON Exported', 'Session recap file downloaded.');
    } catch (e) {
      toast.error('Export Failed', 'Unable to download JSON file.');
    }
  };

  // Wire Orchestrator Hook
  const orch = useGdOrchestrator({
    user,
    cOS,
    roomName,
    roomDesc,
    selectedConcept,
    domain,
    difficulty,
    sessionDurationMinutes,
    invitedAvatars,
    setInvitedAvatars,
    currentMentorId,
    gdHostId,
    filteredAvatars,
    setStep,
    onRecordSaved: (record) => {
      setHistoryListState(prev => [record, ...prev.filter(r => r.id !== record.id)].slice(0, 25));
    }
  });

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomName.trim()) {
      toast.error('Room Name Required', 'Please enter a name for your group discussion room.');
      return;
    }
    setStep('invite_concept');
  };

  // Demo audio play for Avatar Guide
  const handlePlayDemo = (avatarId: string, name: string) => {
    stopSpeaking();
    const demoText = `Hello! I am ${name}. My voice profile is calibrated and preselected. I will be debating you in the corporate boardroom!`;
    speakWithAvatar(demoText, avatarId, () => {}, () => {}, false, true);
    toast.success(`Playing Demo`, `Speaking in ${name}'s voice profile.`);
  };

  return (
    <div className="gd-boardroom-container animate-fade-in">
      {/* Header banner */}
      <div className="gd-header-banner">
        <div>
          <h1 style={{ fontSize: 16, fontWeight: 900, color: 'var(--t1)', display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
            🗣️ Collaborative SDE Group Boardroom
          </h1>
          <p style={{ fontSize: 11, color: 'var(--t3)', margin: '2px 0 0' }}>Simulate realistic group presentations and design debates with multi-agent avatars.</p>
        </div>
        {step !== 'call_grid' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              onClick={() => {
                refreshHistoryList();
                setHistoryModalOpen(true);
              }}
              className="btn-primary"
              style={{
                padding: '6px 12px',
                fontSize: 11,
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: 'var(--bg3)',
                color: 'var(--teal)',
                border: '1.5px solid var(--teal)',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              📜 Past History ({historyListState.length})
            </button>

            <button
              onClick={() => setAvatarGuideOpen(true)}
              className="btn-primary"
              style={{
                padding: '6px 12px',
                fontSize: 11,
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: 'linear-gradient(135deg, var(--teal) 0%, var(--accent) 100%)',
                color: 'white',
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer'
              }}
            >
              📖 Open Avatar Guide
            </button>

            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  const doc = document.documentElement;
                  const isDark = doc.getAttribute('data-theme') === 'dark';
                  doc.setAttribute('data-theme', isDark ? 'light' : 'dark');
                  window.dispatchEvent(new Event('theme-change'));
                }
              }}
              className="btn-ghost"
              style={{
                padding: '5px 10px',
                fontSize: 11,
                borderRadius: 8,
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                cursor: 'pointer',
                fontWeight: 600,
                color: 'var(--t1)'
              }}
            >
              🌗 Theme
            </button>
            <Link href="/dashboard" className="btn-ghost" style={{ fontSize: 11, textDecoration: 'none' }}>
              ➔ Return to Command
            </Link>
          </div>
        )}
      </div>

      {step === 'create_room' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 1000, margin: '20px auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 24 }}>
            {/* Left Column: Boardroom Setup Form */}
            <div className="gd-setup-card animate-fade-in">
              <h2 style={{ fontSize: 15, fontWeight: 900, color: 'var(--t1)', textAlign: 'center', marginBottom: 20 }}>
                Step 1: Setup Boardroom Metadata
              </h2>
              <form onSubmit={handleCreateRoom} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 4 }}>
                  <button
                    type="button"
                    onClick={() => {
                      const randomTopic = SUGGESTED_TOPICS[Math.floor(Math.random() * SUGGESTED_TOPICS.length)];
                      setRoomName(randomTopic.name);
                      setRoomDesc(randomTopic.desc);
                      setSelectedConcept(randomTopic.name);
                      toast.success('Random Topic Loaded', `Configured debate around "${randomTopic.name}".`);
                    }}
                    style={{
                      background: 'rgba(var(--accent-teal-rgb),  0.1)',
                      border: '1.5px solid var(--teal)',
                      borderRadius: 10,
                      padding: '6px 12px',
                      color: 'var(--teal)',
                      fontSize: 11,
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6
                    }}
                  >
                    🎲 Suggest Professional SDE Topic
                  </button>
                </div>

                <div>
                  <label className="gd-form-label">BOARDROOM NAME</label>
                  <input
                    type="text"
                    placeholder="e.g. AWS Multi-Region Hydration Sync"
                    value={roomName}
                    onChange={(e) => {
                      setRoomName(e.target.value);
                      setSelectedConcept(e.target.value);
                    }}
                    className="gd-form-input"
                  />
                </div>
                <div>
                  <label className="gd-form-label">ROOM OBJECTIVE (OPTIONAL)</label>
                  <input
                    type="text"
                    placeholder="e.g. Present caching architecture proposal to managers."
                    value={roomDesc}
                    onChange={(e) => setRoomDesc(e.target.value)}
                    className="gd-form-input"
                  />
                </div>

                {/* Boardroom Domain Selector */}
                <div>
                  <label className="gd-form-label" style={{ marginBottom: 8 }}>BOARDROOM DOMAIN</label>
                  <div className="gd-domain-grid">
                    {(['technical', 'sales', 'business'] as const).map(dom => {
                      const isActive = domain === dom;
                      const labelMap = {
                        technical: '💻 Technical',
                        sales: '📈 Sales',
                        business: '💼 Business'
                      };
                      return (
                        <button
                          key={dom}
                          type="button"
                          onClick={() => setDomain(dom)}
                          className="gd-select-btn"
                          style={{
                            background: isActive ? 'var(--accent)' : 'var(--bg3)',
                            border: `1.5px solid ${isActive ? 'var(--accent)' : 'var(--border)'}`,
                            color: isActive ? 'white' : 'var(--t1)'
                          }}
                        >
                          {labelMap[dom]}
                        </button>
                      );
                    })}
                  </div>
                  <p style={{ fontSize: 9.5, color: 'var(--t4)', marginTop: 6, margin: 0, textAlign: 'center' }}>
                    {domain === 'technical' && '💻 Focus on technology, code integrations, and hardware.'}
                    {domain === 'sales' && '📈 Focus on marketing budget, campaigns, and conversions.'}
                    {domain === 'business' && '💼 Focus on unit economics, operational costs, and structures.'}
                  </p>
                </div>

                {/* Difficulty Selector */}
                <div>
                  <label className="gd-form-label" style={{ marginBottom: 8 }}>BOARDROOM DEBATE DIFFICULTY</label>
                  <div className="gd-domain-grid">
                    {(['easy', 'medium', 'hard'] as const).map(level => {
                      const isActive = difficulty === level;
                      return (
                        <button
                          key={level}
                          type="button"
                          onClick={() => setDifficulty(level)}
                          className="gd-select-btn"
                          style={{
                            background: isActive ? 'var(--accent)' : 'var(--bg3)',
                            border: `1.5px solid ${isActive ? 'var(--accent)' : 'var(--border)'}`,
                            color: isActive ? 'white' : 'var(--t1)',
                            textTransform: 'capitalize'
                          }}
                        >
                          {level}
                        </button>
                      );
                    })}
                  </div>
                  <p style={{ fontSize: 9.5, color: 'var(--t4)', marginTop: 6, margin: 0, textAlign: 'center' }}>
                    {difficulty === 'easy' && '🟢 Easy Mode: Avatars speak gently. Response timer is 16 seconds.'}
                    {difficulty === 'medium' && '🟡 Medium Mode: Standard boardroom debate. Response timer is 12 seconds.'}
                    {difficulty === 'hard' && '🔴 Hard Mode: Aggressive critiques, fast pace. Response timer is 8 seconds.'}
                  </p>
                </div>

                {/* Session Duration Selector */}
                <div>
                  <label className="gd-form-label" style={{ marginBottom: 8 }}>SESSION LENGTH</label>
                  <div className="gd-domain-grid">
                    {([5, 10, 15] as const).map(mins => {
                      const isActive = sessionDurationMinutes === mins;
                      return (
                        <button
                          key={mins}
                          type="button"
                          onClick={() => setSessionDurationMinutes(mins)}
                          className="gd-select-btn"
                          style={{
                            background: isActive ? 'var(--teal)' : 'var(--bg3)',
                            border: `1.5px solid ${isActive ? 'var(--teal)' : 'var(--border)'}`,
                            color: isActive ? 'white' : 'var(--t1)'
                          }}
                        >
                          ⏱️ {mins} Mins {mins === 5 ? '(Express)' : mins === 10 ? '(Standard)' : '(Deep Dive)'}
                        </button>
                      );
                    })}
                  </div>
                  <p style={{ fontSize: 9.5, color: 'var(--t4)', marginTop: 6, margin: 0, textAlign: 'center' }}>
                    {sessionDurationMinutes === 5 && '⚡ Express session with fast-paced interventions and 5-min recap.'}
                    {sessionDurationMinutes === 10 && '⚖️ Standard 10-min corporate debate with mid-session summary.'}
                    {sessionDurationMinutes === 15 && '🏛️ Deep dive architectural boardroom with comprehensive closing synthesis.'}
                  </p>
                </div>

                <button type="submit" className="btn-primary" style={{ justifyContent: 'center', padding: '12px', marginTop: 8 }}>
                  ➔ Configure Discussion Room
                </button>
              </form>
            </div>

            {/* Right Column: Previous Boardroom Sessions */}
            <div className="gd-history-panel animate-fade-in">
              <h2 style={{ fontSize: 15, fontWeight: 900, color: 'var(--t1)', textAlign: 'center', marginBottom: 16 }}>
                📜 Previous Boardrooms
              </h2>
              {historyListState.length === 0 ? (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--t4)', gap: 8 }}>
                  <span style={{ fontSize: 32 }}>📜</span>
                  <span style={{ fontSize: 11, fontWeight: 700 }}>No previous boardroom sessions found.</span>
                </div>
              ) : (
                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10, paddingRight: 4 }}>
                  {historyListState.map((past: GdHistoryRecord) => (
                    <div key={past.id} className="gd-history-card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 10, color: 'var(--t3)', fontWeight: 700 }}>{past.date}</span>
                        <span style={{ fontSize: 10, color: 'var(--teal)', fontWeight: 800 }}>Score: {past.report?.score || 75}%</span>
                      </div>
                      <h4 style={{ fontSize: 12, fontWeight: 900, color: 'var(--t1)', margin: 0 }}>{past.topic}</h4>
                      <p style={{ fontSize: 9.5, color: 'var(--t3)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{past.objective}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          {past.domain && (
                            <span style={{ fontSize: 8.5, background: 'var(--bg2)', padding: '2px 6px', borderRadius: 4, color: 'var(--teal)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
                              {past.domain}
                            </span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setRoomName(past.topic);
                            setRoomDesc(past.objective || '');
                            setSelectedConcept(past.topic);
                            orch.setMessages((past.transcript as any) || []);
                            orch.setGdReport(past.report || null);
                          }}
                          className="gd-review-btn"
                        >
                          🔍 Review Recap
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {step === 'invite_concept' && (
        <div className="gd-invite-panel animate-fade-in">
          <h2 style={{ fontSize: 15, fontWeight: 900, color: 'var(--t1)', textAlign: 'center', marginBottom: 4 }}>
            Step 2: Invite Avatars & Define Focus Concept
          </h2>
          <p style={{ fontSize: 11, color: 'var(--t3)', textAlign: 'center', marginBottom: 18 }}>
            Excludes your currently selected mentor ({AVATARS.find(a => a.id === currentMentorId)?.name || 'Priya'}).
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--t3)', display: 'block', marginBottom: 6 }}>TARGET DISCUSSION TOPIC (FROM STEP 1)</label>
              <input
                type="text"
                disabled
                value={`${roomName}${roomDesc ? ' — ' + roomDesc : ''}`}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  background: 'var(--bg2)',
                  border: '1.5px solid var(--border)',
                  borderRadius: 10,
                  color: 'var(--t3)',
                  fontSize: 13,
                  outline: 'none',
                  cursor: 'not-allowed'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--t3)', display: 'block', marginBottom: 8 }}>SELECT INVITE PARTICIPANTS</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 12, maxHeight: 320, overflowY: 'auto', paddingRight: 6 }}>
                {filteredAvatars.map(a => {
                  const isInvited = invitedAvatars.includes(a.id);
                  return (
                    <div
                      key={a.id}
                      onClick={() => {
                        setInvitedAvatars(prev => isInvited ? prev.filter(x => x !== a.id) : [...prev, a.id]);
                      }}
                      className="gd-avatar-card"
                      style={{
                        background: isInvited ? 'rgba(var(--accent-teal-rgb), 0.06)' : 'var(--bg3)',
                        border: `1.5px solid ${isInvited ? 'var(--teal)' : 'var(--border)'}`
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 20 }}>{a.emoji}</span>
                        <span style={{ fontSize: 9, color: isInvited ? 'var(--teal)' : 'var(--t3)', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
                          {isInvited ? '🟢 INVITED' : '⚪ OFF'}
                        </span>
                      </div>
                      <div>
                        <h4 style={{ fontSize: 12, fontWeight: 900, color: 'var(--t1)', margin: 0 }}>{a.name}</h4>
                        <p style={{ fontSize: 9.5, color: 'var(--t3)', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.role}</p>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                        <span style={{ fontSize: 8, background: 'var(--bg2)', padding: '2px 6px', borderRadius: 4, color: 'var(--t4)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
                          {a.trait}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePlayDemo(a.id, a.name);
                          }}
                          className="gd-avatar-demo-btn"
                        >
                          🎙️ Voice Demo
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
              <button onClick={() => setStep('create_room')} className="btn-ghost" style={{ flex: 1, padding: 12 }}>
                ⇠ Back to Step 1
              </button>
              <PinsGate itemKey={`gd:${roomName || 'default-room'}`} category="gd" onUnlocked={orch.handleStartCall}>
                <button className="btn-primary" style={{ width: '100%', padding: 12, justifyContent: 'center' }}>
                  ➔ Open Group Call Workspace
                </button>
              </PinsGate>
            </div>
          </div>
        </div>
      )}

      {step === 'call_grid' && (
        <div className="gd-call-layout">
          {/* Active Video Call Emulation Grid */}
          <GdMeetGrid
            invitedAvatars={invitedAvatars}
            avatarsList={AVATARS}
            activeSpeakingAvatar={orch.activeSpeakingAvatar}
            currentAvatarARoleId={orch.currentAvatarARoleId}
            currentAvatarBRoleId={orch.currentAvatarBRoleId}
            isUserTurn={orch.isUserTurn}
            onUserFinishSpeaking={() => orch.handleUserFinishSpeaking()}
            onToggleRaiseHand={orch.toggleRaiseHand}
            onInterjectImmediately={orch.handleInterjectImmediately}
            onEndCall={orch.handleEndCall}
            onForceExit={orch.handleForceExitCall}
            hostId={orch.activeHostId}
            handRaised={orch.handRaised}
            micActive={orch.micActive}
            callDurationSeconds={orch.callDuration}
          />

          {/* Socratic Board Presentation Chat Log & Controls */}
          <GdTranscriptDrawer
            selectedConcept={selectedConcept}
            callDuration={orch.callDuration}
            candidateTurnTimer={orch.candidateTurnTimer}
            messages={orch.messages}
            loading={orch.loading}
            suggestedHelperText={orch.suggestedHelperText}
            micActive={orch.micActive}
            handRaised={orch.handRaised}
            onClearHelperText={() => orch.setSuggestedHelperText('')}
            onToggleMic={orch.toggleMic}
            onSuggestArgument={orch.handleSuggestArgument}
            onToggleRaiseHand={orch.toggleRaiseHand}
            onExportTranscript={orch.exportGdTranscript}
            bottomRef={orch.bottomRef}
          />
        </div>
      )}

      {/* Avatar Voice & Cast Guide Modal */}
      <GdAvatarGuideModal
        isOpen={avatarGuideOpen}
        avatars={AVATARS}
        currentMentorId={currentMentorId}
        onClose={() => { stopSpeaking(); setAvatarGuideOpen(false); }}
        onPlayDemo={handlePlayDemo}
      />

      {/* Boardroom History & Analytics Modal */}
      <GdHistoryModal
        isOpen={historyModalOpen}
        historyList={historyListState}
        selectedItem={selectedHistoryItem}
        searchQuery={historySearchQuery}
        domainFilter={historyDomainFilter}
        onClose={() => { setHistoryModalOpen(false); setSelectedHistoryItem(null); }}
        onSelectItem={(item) => setSelectedHistoryItem(item)}
        onSearchChange={(q) => setHistorySearchQuery(q)}
        onDomainFilterChange={(d) => setHistoryDomainFilter(d)}
        onExportJSON={handleExportHistoryJSON}
        onDeleteItem={handleDeleteHistoryItem}
      />

      {/* Report Generation View */}
      {orch.gdReport && (
        <div ref={orch.reportRef}>
          <GdReport
            report={orch.gdReport}
            transcript={orch.messages}
            onRestart={() => {
              setStep('create_room');
              orch.setGdReport(null);
              setInvitedAvatars([]);
              orch.setMessages([]);
              setDomain('technical');
            }}
          />
        </div>
      )}
    </div>
  );
}
