'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { useCareerOS } from '@/lib/context/CareerOSContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import '@/styles/group-discussion.css';

import { AVATARS, SUGGESTED_TOPICS } from './constants';
import {
  GD_COMMON_RULES,
  isAvatarEligibleAsGdHost,
  resolveFloatingMentorId,
  resolveGdHostId,
} from '@/lib/group-discussion/gdTurnEngine';
import { useGdOrchestrator, type GdStep } from './hooks/useGdOrchestrator';
import GdMeetGrid from './components/GdMeetGrid';
import GdTranscriptDrawer from './components/GdTranscriptDrawer';
import GdReport from '@/components/group-discussion/GdReport';
import PinsGate from '@/components/pins/PinsGate';
import GdHistoryModal, { type GdHistoryRecord } from './components/GdHistoryModal';
import { toast } from '@/lib/store/useAppStore';

const DOMAIN_OPTIONS: Array<{
  id: 'technical' | 'business' | 'commerce' | 'sales';
  label: string;
  icon: string;
}> = [
  { id: 'technical', label: 'Tech & AI', icon: '💻' },
  { id: 'business', label: 'Business', icon: '📊' },
  { id: 'commerce', label: 'B.Com / Finance', icon: '🧾' },
  { id: 'sales', label: 'Sales & Growth', icon: '📣' },
];

export default function GroupDiscussionPage({
  embedded = false,
  autoStartGd = false,
}: {
  embedded?: boolean;
  autoStartGd?: boolean;
}) {
  const { user } = useAuth();
  const cOS = useCareerOS();
  const router = useRouter();

  // Core setup state
  const [step, setStep] = useState<GdStep>('setup');
  const [roomName, setRoomName] = useState(SUGGESTED_TOPICS[0].title);
  const [objective, setObjective] = useState(SUGGESTED_TOPICS[0].objective);
  const [domain, setDomain] = useState<'technical' | 'sales' | 'business' | 'commerce'>(
    SUGGESTED_TOPICS[0].domain
  );
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [sessionDurationMinutes, setSessionDurationMinutes] = useState<number>(10);

  // User's selected AI Mentor (default: 'priya') — strictly excluded from being GD Host
  const floatingMentorId = resolveFloatingMentorId(user?.guidanceMentorId || user?.selectedTeacherId);
  const defaultHost = resolveGdHostId(floatingMentorId, 'akash');

  const [hostId, setHostId] = useState<string>(defaultHost);
  const [invitedAvatars, setInvitedAvatars] = useState<string[]>([
    defaultHost,
    'kashyap',
    'divya',
  ]);

  // Settings adapted from AI Interview Studio
  const [showCoachChips, setShowCoachChips] = useState<boolean>(true);
  const [audioVolume, setAudioVolume] = useState<number>(100);
  const [historyModalOpen, setHistoryModalOpen] = useState<boolean>(false);
  const [historySearch, setHistorySearch] = useState<string>('');
  const [historyDomainFilter, setHistoryDomainFilter] = useState<'all' | 'technical' | 'sales' | 'business' | 'commerce'>('all');

  // Sync hostId if user profile loads and their AI mentor conflicts with hostId
  useEffect(() => {
    if (!isAvatarEligibleAsGdHost(hostId, floatingMentorId)) {
      const safeHost = resolveGdHostId(floatingMentorId, 'akash');
      setHostId(safeHost);
      setInvitedAvatars(prev => {
        const cleaned = prev.filter(id => id !== hostId);
        return cleaned.includes(safeHost) ? cleaned : [safeHost, ...cleaned];
      });
    }
  }, [floatingMentorId, hostId]);

  // Support autoStartGd deep-link from /interview?tab=gd&autostart=true
  useEffect(() => {
    if (autoStartGd && step === 'setup') {
      setStep('select_avatars');
    }
  }, [autoStartGd, step]);

  // Clean up stale ?call=true URL parameter if not actively in a call
  useEffect(() => {
    if (step !== 'call_grid' && typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (url.searchParams.has('call')) {
        url.searchParams.delete('call');
        window.history.replaceState({}, '', url.toString());
      }
    }
  }, [step]);

  const orch = useGdOrchestrator({
    user,
    spendPins: (_amount, reason) => cOS.spendPins('gd', `gd:${roomName || 'default-room'}`, reason),
    embedded,
    roomName,
    objective,
    domain,
    difficulty,
    sessionDurationMinutes,
    invitedAvatars,
    hostId,
    setHostId,
    setInvitedAvatars,
    setRoomName,
    setObjective,
    setDomain,
    setStep,
    step,
    audioVolume,
  });

  // Active topic starter prompts for live room idea chips
  const activeStarterPrompts = useMemo(() => {
    const exact = SUGGESTED_TOPICS.find(
      t => t.title.toLowerCase() === roomName.trim().toLowerCase()
    );
    if (exact) return exact.starterPrompts;
    const byDomain = SUGGESTED_TOPICS.find(t => t.domain === domain);
    return byDomain?.starterPrompts || SUGGESTED_TOPICS[0].starterPrompts;
  }, [roomName, domain]);

  const filteredTopics = useMemo(
    () => SUGGESTED_TOPICS.filter(t => t.domain === domain),
    [domain]
  );

  const handleDomainSwitch = (nextDomain: 'technical' | 'sales' | 'business' | 'commerce') => {
    setDomain(nextDomain);
    const firstForDomain = SUGGESTED_TOPICS.find(t => t.domain === nextDomain);
    if (firstForDomain) {
      setRoomName(firstForDomain.title);
      setObjective(firstForDomain.objective);
    }
  };

  const handleSelectHost = (candidateId: string) => {
    if (!isAvatarEligibleAsGdHost(candidateId, floatingMentorId)) {
      const mentorObj = AVATARS.find(a => a.id === floatingMentorId);
      toast.warning(
        `${mentorObj?.name || 'Your AI Mentor'} cannot be GD Host`,
        'Because you selected them as your AI Mentor, choose another panelist as your GD Host.'
      );
      return;
    }

    setHostId(candidateId);
    setInvitedAvatars(prev => {
      const withoutNew = prev.filter(id => id !== candidateId);
      return [candidateId, ...withoutNew].slice(0, Math.max(3, prev.length));
    });
  };

  const togglePanelist = (id: string) => {
    if (id === hostId) return; // Host stays seated in the room
    setInvitedAvatars(prev => {
      const exists = prev.includes(id);
      const currentPanelists = prev.filter(x => x !== hostId);
      if (exists) {
        if (currentPanelists.length <= 2) {
          toast.info(
            'Keep at least 2 panelists',
            'You need Avatar 1 (Challenger) and Avatar 2 (Diplomat) for the live GD loop.'
          );
          return prev;
        }
        return prev.filter(x => x !== id);
      }
      if (prev.length >= 6) {
        toast.info(
          'Boardroom full',
          'Up to 6 AI members (Host + 5 panelists) keep the conversation sharp and focused.'
        );
        return prev;
      }
      return [...prev, id];
    });
  };

  const mentorProfile = AVATARS.find(a => a.id === floatingMentorId);
  const currentHostProfile = AVATARS.find(a => a.id === orch.effectiveHostId);
  const currentPanelists = invitedAvatars.filter(id => id !== orch.effectiveHostId);

  return (
    <div
      className="gd-boardroom-container animate-fade-in"
      style={embedded ? { padding: '6px 0 0', minHeight: 'auto' } : undefined}
    >
      {/* Top Banner (Hidden during active live call for clean focus) */}
      {step !== 'call_grid' && (
        <div className="gd-header-banner">
          <div>
            <h1 className="gd-header-title">
              <span>🏛️</span>
              <span>Live Group Discussion Boardroom</span>
            </h1>
            <p className="gd-header-subtitle">
              Host Intro &amp; Rules → You Speak → Avatar 1 Challenges → Avatar 2 Bridges Both → Repeat.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            {step === 'select_avatars' && (
              <button
                type="button"
                onClick={() => setStep('setup')}
                className="btn-ghost"
                style={{ padding: '7px 13px', fontSize: 12.5, fontWeight: 800, borderRadius: 10 }}
              >
                ← Back to Topic
              </button>
            )}
            {!embedded && (
              <Link
                href="/interview"
                className="btn-ghost"
                style={{ padding: '7px 13px', fontSize: 12.5, fontWeight: 800, borderRadius: 10, textDecoration: 'none' }}
              >
                🎙️ 1-on-1 Interview
              </Link>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          STEP 1: TOPIC SETUP + COMMON GD ROOM RULES + HISTORY
         ══════════════════════════════════════════════════════════════════════ */}
      {step === 'setup' && (
        <div className="gd-setup-column-grid animate-fade-in">
          {/* Left Column: Topic & Session Configuration */}
          <div className="gd-setup-card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Domain Selector */}
            <div>
              <label className="gd-form-label">1. Choose Discussion Domain</label>
              <div className="gd-domain-grid gd-domain-grid-4">
                {DOMAIN_OPTIONS.map(d => {
                  const active = domain === d.id;
                  return (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => handleDomainSwitch(d.id)}
                      className="gd-select-btn"
                      style={{
                        background: active ? 'rgba(20,184,166,0.16)' : 'var(--bg3)',
                        border: `1.5px solid ${active ? 'var(--teal)' : 'var(--border)'}`,
                        color: active ? '#5eead4' : 'var(--t2)',
                      }}
                    >
                      <span>{d.icon}</span>
                      <span>{d.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Creative Suggested Topics */}
            <div>
              <label className="gd-form-label">2. Pick a High-Energy Topic (Or Write Your Own)</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 8, marginBottom: 10 }}>
                {filteredTopics.map(t => {
                  const selected = roomName === t.title;
                  return (
                    <button
                      key={t.title}
                      type="button"
                      onClick={() => {
                        setRoomName(t.title);
                        setObjective(t.objective);
                      }}
                      style={{
                        textAlign: 'left',
                        padding: '10px 13px',
                        borderRadius: 12,
                        border: `1.5px solid ${selected ? 'var(--teal)' : 'var(--border)'}`,
                        background: selected ? 'rgba(20,184,166,0.1)' : 'var(--bg3)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 13.5, fontWeight: 900, color: selected ? '#5eead4' : 'var(--t1)' }}>
                          {t.title}
                        </span>
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 800,
                            padding: '2px 7px',
                            borderRadius: 6,
                            background: 'rgba(255,255,255,0.06)',
                            color: 'var(--t2)',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {t.badge}
                        </span>
                      </div>
                      <div style={{ fontSize: 11.5, color: 'var(--t3)', marginTop: 4 }}>{t.objective}</div>
                    </button>
                  );
                })}
              </div>

              <input
                type="text"
                value={roomName}
                onChange={e => setRoomName(e.target.value)}
                placeholder="Or type any custom GD topic you want to debate..."
                className="gd-form-input"
                maxLength={180}
              />
              <input
                type="text"
                value={objective}
                onChange={e => setObjective(e.target.value)}
                placeholder="Optional goal (e.g., Reach a practical 3-step recommendation)"
                className="gd-form-input"
                style={{ marginTop: 8, fontSize: 13 }}
                maxLength={220}
              />
            </div>

            {/* Difficulty & Session Duration */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label className="gd-form-label">3. Challenger Intensity</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
                  {(['easy', 'medium', 'hard'] as const).map(lvl => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setDifficulty(lvl)}
                      style={{
                        padding: '8px 6px',
                        borderRadius: 10,
                        border: `1.5px solid ${difficulty === lvl ? 'var(--teal)' : 'var(--border)'}`,
                        background: difficulty === lvl ? 'rgba(20,184,166,0.14)' : 'var(--bg3)',
                        color: difficulty === lvl ? '#5eead4' : 'var(--t2)',
                        fontSize: 12,
                        fontWeight: 800,
                        textTransform: 'capitalize',
                        cursor: 'pointer',
                      }}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="gd-form-label">4. Duration (5m &amp; 1m Host Alerts)</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
                  {[5, 8, 10, 15].map(mins => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setSessionDurationMinutes(mins)}
                      style={{
                        padding: '8px 4px',
                        borderRadius: 10,
                        border: `1.5px solid ${sessionDurationMinutes === mins ? '#818cf8' : 'var(--border)'}`,
                        background: sessionDurationMinutes === mins ? 'rgba(99,102,241,0.18)' : 'var(--bg3)',
                        color: sessionDurationMinutes === mins ? '#c7d2fe' : 'var(--t2)',
                        fontSize: 12,
                        fontWeight: 800,
                        cursor: 'pointer',
                      }}
                    >
                      {mins}m
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setStep('select_avatars')}
              className="btn-primary"
              style={{
                width: '100%',
                padding: '13px 16px',
                borderRadius: 12,
                border: 'none',
                fontWeight: 900,
                fontSize: 14.5,
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              Next: Choose GD Host &amp; Panelists →
            </button>
          </div>

          {/* Right Column: Common GD Room Rules + Recent History */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Common GD Room Rules Card */}
            <div className="gd-setup-card" style={{ borderColor: 'rgba(20,184,166,0.35)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <h2 style={{ fontSize: 15, fontWeight: 900, color: 'var(--t1)', margin: 0 }}>
                  📜 Common GD Room Rules
                </h2>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 800,
                    padding: '3px 8px',
                    borderRadius: 999,
                    background: 'rgba(20,184,166,0.14)',
                    color: 'var(--teal)',
                  }}
                >
                  Host Explains Live
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {GD_COMMON_RULES.map(rule => (
                  <div
                    key={rule.id}
                    style={{
                      background: 'var(--bg3)',
                      border: '1px solid var(--border)',
                      borderRadius: 10,
                      padding: '8px 11px',
                    }}
                  >
                    <div style={{ fontSize: 12.5, fontWeight: 900, color: 'var(--t1)' }}>
                      {rule.icon} {rule.title}
                    </div>
                    <div style={{ fontSize: 11.5, color: 'var(--t3)', marginTop: 2, lineHeight: 1.4 }}>
                      {rule.detail}
                    </div>
                  </div>
                ))}
              </div>

              {/* Mentor Exclusion & Flow Note */}
              <div
                style={{
                  marginTop: 12,
                  padding: '9px 11px',
                  borderRadius: 10,
                  background: 'rgba(99,102,241,0.1)',
                  border: '1px solid rgba(129,140,248,0.35)',
                  fontSize: 11.5,
                  color: '#c7d2fe',
                  lineHeight: 1.45,
                }}
              >
                <strong>👑 Host Policy:</strong> Because <strong>{mentorProfile?.name || 'Ms. Priya'}</strong> is your
                selected AI Mentor, they cannot serve as GD Host. Your default Host is{' '}
                <strong>{currentHostProfile?.name || 'Mr. Akash'}</strong> (changeable in Step 2).
              </div>
            </div>

            {/* Past GD Sessions */}
            <div className="gd-setup-card" style={{ maxHeight: 280, overflowY: 'auto' }}>
              <h2 style={{ fontSize: 14.5, fontWeight: 900, color: 'var(--t1)', margin: '0 0 10px' }}>
                🗂️ Recent GD Sessions ({orch.historyList.length})
              </h2>
              {orch.historyList.length === 0 ? (
                <p style={{ margin: 0, fontSize: 12.5, color: 'var(--t3)', lineHeight: 1.5 }}>
                  No GD sessions completed yet. Finish a boardroom session to unlock your scored verdict and downloadable
                  transcript!
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {orch.historyList.slice(0, 6).map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        orch.setSelectedHistorySession(item);
                        setHistoryModalOpen(true);
                      }}
                      className="gd-history-card"
                      style={{ textAlign: 'left', width: '100%' }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                        <strong style={{ fontSize: 12.5, color: 'var(--t1)' }}>{item.topic}</strong>
                        <span
                          style={{
                            fontSize: 11.5,
                            fontWeight: 900,
                            color: item.score >= 70 ? '#4ade80' : item.score >= 45 ? '#fcd34d' : '#fca5a5',
                          }}
                        >
                          {item.score}%
                        </span>
                      </div>
                      <span style={{ fontSize: 11, color: 'var(--t3)' }}>
                        {item.domain.toUpperCase()} • {new Date(item.date).toLocaleDateString()}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          STEP 2: SELECT GD HOST (MENTOR STRICTLY EXCLUDED) + PANELISTS
         ══════════════════════════════════════════════════════════════════════ */}
      {step === 'select_avatars' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }} className="animate-fade-in">
          {/* Section A: GD Host Selection (AI Mentor Locked Out!) */}
          <div className="gd-setup-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 900, color: 'var(--t1)', margin: 0 }}>
                  👑 Step 1: Select Your GD Host
                </h2>
                <p style={{ fontSize: 12, color: 'var(--t3)', margin: '3px 0 0' }}>
                  Your Host opens the room, explains rules, and steps in at 5 min &amp; 1 min left.{' '}
                  <strong style={{ color: '#fcd34d' }}>
                    {mentorProfile?.name || 'Ms. Priya'} is your AI Mentor and cannot be selected as Host.
                  </strong>
                </p>
              </div>
              <span
                style={{
                  fontSize: 11.5,
                  fontWeight: 800,
                  padding: '4px 10px',
                  borderRadius: 8,
                  background: 'rgba(99,102,241,0.16)',
                  border: '1px solid #818cf8',
                  color: '#c7d2fe',
                }}
              >
                Active Host: {currentHostProfile?.name}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(195px, 1fr))', gap: 10 }}>
              {AVATARS.map(avatar => {
                const isMentorBlocked = !isAvatarEligibleAsGdHost(avatar.id, floatingMentorId);
                const isSelectedHost = orch.effectiveHostId === avatar.id;

                return (
                  <button
                    key={avatar.id}
                    type="button"
                    disabled={isMentorBlocked}
                    onClick={() => handleSelectHost(avatar.id)}
                    style={{
                      textAlign: 'left',
                      padding: '10px 12px',
                      borderRadius: 12,
                      border: `1.5px solid ${
                        isMentorBlocked
                          ? 'rgba(245,158,11,0.4)'
                          : isSelectedHost
                            ? '#818cf8'
                            : 'var(--border)'
                      }`,
                      background: isMentorBlocked
                        ? 'rgba(245,158,11,0.06)'
                        : isSelectedHost
                          ? 'rgba(99,102,241,0.18)'
                          : 'var(--bg3)',
                      opacity: isMentorBlocked ? 0.65 : 1,
                      cursor: isMentorBlocked ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 4,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 13.5, fontWeight: 900, color: 'var(--t1)' }}>
                        {avatar.emoji} {avatar.name}
                      </span>
                      {isMentorBlocked ? (
                        <span style={{ fontSize: 9.5, fontWeight: 900, color: '#fcd34d' }}>🔒 AI MENTOR</span>
                      ) : isSelectedHost ? (
                        <span style={{ fontSize: 9.5, fontWeight: 900, color: '#c7d2fe' }}>👑 HOST</span>
                      ) : null}
                    </div>
                    <span style={{ fontSize: 11, color: 'var(--t3)' }}>{avatar.role}</span>
                    <span style={{ fontSize: 10, fontWeight: 800, color: isMentorBlocked ? '#fcd34d' : 'var(--teal)' }}>
                      {isMentorBlocked ? 'Unavailable as GD Host' : avatar.styleTag}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section B: Select Panelists (Avatar 1 Challenger & Avatar 2 Diplomat) */}
          <div className="gd-setup-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 900, color: 'var(--t1)', margin: 0 }}>
                  🎭 Step 2: Pick Your Debate Panelists (Unique Personalities)
                </h2>
                <p style={{ fontSize: 12, color: 'var(--t3)', margin: '3px 0 0' }}>
                  Avatar 1 argues/challenges (Groq Key 1) • Avatar 2 diplomatically bridges both views (Groq Key 2, zero delay).
                </p>
              </div>
              <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--teal)' }}>
                {currentPanelists.length} Panelists Seated
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10 }}>
              {AVATARS.filter(a => a.id !== orch.effectiveHostId).map(avatar => {
                const seated = invitedAvatars.includes(avatar.id);
                const panelIndex = currentPanelists.indexOf(avatar.id);
                const roleTag =
                  panelIndex === 0
                    ? '🔥 Avatar 1 • Challenger (Key 1)'
                    : panelIndex === 1
                      ? '🤝 Avatar 2 • Diplomat (Key 2)'
                      : seated
                        ? '🎙️ Rotating Panelist'
                        : '';

                return (
                  <button
                    key={avatar.id}
                    type="button"
                    onClick={() => togglePanelist(avatar.id)}
                    style={{
                      textAlign: 'left',
                      padding: '12px 13px',
                      borderRadius: 12,
                      border: `1.5px solid ${
                        panelIndex === 0
                          ? '#f97316'
                          : panelIndex === 1
                            ? '#a855f7'
                            : seated
                              ? 'var(--teal)'
                              : 'var(--border)'
                      }`,
                      background: seated ? 'rgba(20,184,166,0.08)' : 'var(--bg3)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 4,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 13.5, fontWeight: 900, color: 'var(--t1)' }}>
                        {avatar.emoji} {avatar.name}
                      </span>
                      <span
                        style={{
                          fontSize: 9.5,
                          fontWeight: 800,
                          padding: '2px 6px',
                          borderRadius: 6,
                          background: 'rgba(255,255,255,0.06)',
                          color: 'var(--teal)',
                        }}
                      >
                        {avatar.styleTag}
                      </span>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--t2)' }}>{avatar.role}</span>
                    <span style={{ fontSize: 11, color: 'var(--t3)', lineHeight: 1.35 }}>{avatar.description}</span>
                    {roleTag && (
                      <span
                        style={{
                          marginTop: 4,
                          fontSize: 10,
                          fontWeight: 900,
                          color: panelIndex === 0 ? '#fdba74' : panelIndex === 1 ? '#e9d5ff' : 'var(--teal)',
                        }}
                      >
                        {roleTag}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div style={{ marginTop: 16, display: 'flex', gap: 12, justifyContent: 'flex-end', flexWrap: 'wrap', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => setStep('setup')}
                className="btn-ghost"
                style={{ padding: '11px 18px', borderRadius: 12, fontWeight: 800, fontSize: 13.5 }}
              >
                ← Back
              </button>
              <PinsGate itemKey={`gd:${roomName || 'default-room'}`} category="gd" onUnlocked={() => orch.handleStartCall(true)}>
                <button
                  type="button"
                  className="btn-primary"
                  style={{
                    padding: '12px 24px',
                    borderRadius: 12,
                    border: 'none',
                    fontWeight: 900,
                    fontSize: 14.5,
                    cursor: 'pointer',
                  }}
                >
                  🚀 Launch Live GD Room ({sessionDurationMinutes} min)
                </button>
              </PinsGate>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          STEP 3: LIVE GD BOARDROOM (70% VIDEO PANEL / 30% TRANSCRIPT & CONTROLS)
         ══════════════════════════════════════════════════════════════════════ */}
      {step === 'call_grid' && (
        <div className="gd-call-layout animate-fade-in">
          <GdMeetGrid
            invitedAvatars={invitedAvatars}
            activeSpeakingAvatar={orch.activeSpeakingAvatar}
            currentAvatarARoleId={orch.currentAvatarARoleId}
            currentAvatarBRoleId={orch.currentAvatarBRoleId}
            isUserTurn={orch.isUserTurn}
            turnPhase={orch.turnPhase}
            activeTimeAlert={orch.activeTimeAlert}
            turnCount={orch.turnCount}
            hostId={orch.effectiveHostId}
            handRaised={orch.handRaised}
            micActive={orch.micActive}
            activeStream={orch.activeStream}
            callDurationSeconds={orch.callDuration}
            sessionDurationMinutes={sessionDurationMinutes}
            showCoachChips={showCoachChips}
            onToggleCoachChips={() => setShowCoachChips(v => !v)}
            audioVolume={audioVolume}
            onAudioVolumeChange={setAudioVolume}
            onUserFinishSpeaking={orch.handleUserFinishSpeaking}
            onToggleRaiseHand={() => orch.setHandRaised(v => !v)}
            onInterjectImmediately={orch.handleInterjectImmediately}
            onEndCall={orch.handleEndCall}
            onForceExit={orch.handleForceExit}
          />

          <GdTranscriptDrawer
            selectedConcept={roomName}
            callDuration={orch.callDuration}
            candidateTurnTimer={orch.candidateTurnTimer}
            isUserTurn={orch.isUserTurn}
            turnPhase={orch.turnPhase}
            inputText={orch.inputText}
            liveTranscript={orch.liveTranscript}
            messages={orch.messages}
            loading={orch.loading}
            suggestedHelperText={orch.suggestedHelperText}
            starterPrompts={activeStarterPrompts}
            showCoachChips={showCoachChips}
            micActive={orch.micActive}
            onClearHelperText={() => orch.setSuggestedHelperText('')}
            onInputTextChange={orch.setInputText}
            onToggleMic={orch.toggleMic}
            onSendMessage={orch.handleSendMessage}
            onQuickSendChip={chip => orch.setInputText(chip)}
            onSuggestArgument={orch.handleSuggestArgument}
            onExportTranscript={orch.handleExportTranscript}
            bottomRef={orch.bottomRef}
          />
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          STEP 4: HONEST GD PERFORMANCE REPORT
         ══════════════════════════════════════════════════════════════════════ */}
      {step === 'report' && orch.report && (
        <GdReport
          report={orch.report}
          transcript={orch.messages}
          onRestart={() => {
            setStep('setup');
            if (embedded) {
              router.replace('/interview?tab=gd');
            } else {
              router.replace('/group-discussion');
            }
          }}
        />
      )}

      {/* History Session Inspection Modal */}
      <GdHistoryModal
        isOpen={historyModalOpen}
        historyList={orch.historyList as GdHistoryRecord[]}
        selectedItem={orch.selectedHistorySession as GdHistoryRecord | null}
        searchQuery={historySearch}
        domainFilter={historyDomainFilter}
        onClose={() => {
          setHistoryModalOpen(false);
          orch.setSelectedHistorySession(null);
        }}
        onSelectItem={item => orch.setSelectedHistorySession(item as any)}
        onSearchChange={setHistorySearch}
        onDomainFilterChange={setHistoryDomainFilter}
        onExportJSON={item => {
          const blob = new Blob([JSON.stringify(item, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `gd_${item.id}.json`;
          a.click();
          URL.revokeObjectURL(url);
        }}
        onDeleteItem={orch.deleteHistorySession}
      />
    </div>
  );
}
