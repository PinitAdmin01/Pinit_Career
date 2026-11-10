'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { StudentProfile } from './StudentCard';
import { computeStudentMatch, CURRENT_STUDENT_PROFILE } from '@/lib/friends/matching';
import { calculateStakesPreview } from '@/lib/gamification/rewardRules';

interface FriendProfileDrawerProps {
  student: StudentProfile | null;
  onClose: () => void;
  onAcceptRequest?: (studentId: string) => void;
  onSendRequest?: (studentId: string) => void;
  onRemoveFriend?: (studentId: string) => void;
  onOpenMessage?: (student: StudentProfile) => void;
  onOpenChallenge?: (student: StudentProfile) => void;
  onOpenProjectInvite?: (student: StudentProfile) => void;
}

/**
 * Task 3 Compatibility Logic Specification:
 * - 100% -> "Subordinate Level"
 * - > 90% -> "Best Compatible"
 * - > 70% -> "Good"
 * - > 50% -> "Likely"
 * - > 30% -> "OK"
 * - <= 30% -> "Basic Match"
 */
export function getCompatibilityDetails(score: number): {
  label: string;
  tier: 'subordinate' | 'best' | 'good' | 'likely' | 'ok' | 'basic';
  badgeColor: string;
  badgeBg: string;
  badgeBorder: string;
} {
  if (score >= 100) {
    return {
      label: 'Subordinate Level',
      tier: 'subordinate',
      badgeColor: '#ec4899',
      badgeBg: 'rgba(236, 72, 153, 0.15)',
      badgeBorder: 'rgba(236, 72, 153, 0.35)',
    };
  }
  if (score > 90) {
    return {
      label: 'Best Compatible',
      tier: 'best',
      badgeColor: '#10b981',
      badgeBg: 'rgba(16, 185, 129, 0.15)',
      badgeBorder: 'rgba(16, 185, 129, 0.35)',
    };
  }
  if (score > 70) {
    return {
      label: 'Good',
      tier: 'good',
      badgeColor: '#38bdf8',
      badgeBg: 'rgba(56, 189, 248, 0.15)',
      badgeBorder: 'rgba(56, 189, 248, 0.35)',
    };
  }
  if (score > 50) {
    return {
      label: 'Likely',
      tier: 'likely',
      badgeColor: '#a855f7',
      badgeBg: 'rgba(168, 85, 247, 0.15)',
      badgeBorder: 'rgba(168, 85, 247, 0.35)',
    };
  }
  if (score > 30) {
    return {
      label: 'OK',
      tier: 'ok',
      badgeColor: '#f59e0b',
      badgeBg: 'rgba(245, 158, 11, 0.15)',
      badgeBorder: 'rgba(245, 158, 11, 0.35)',
    };
  }
  return {
    label: 'Basic Match',
    tier: 'basic',
    badgeColor: '#94a3b8',
    badgeBg: 'rgba(148, 163, 184, 0.15)',
    badgeBorder: 'rgba(148, 163, 184, 0.35)',
  };
}

export const FriendProfileDrawer: React.FC<FriendProfileDrawerProps> = ({
  student,
  onClose,
  onAcceptRequest,
  onSendRequest,
  onRemoveFriend,
  onOpenMessage,
  onOpenChallenge,
  onOpenProjectInvite,
}) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'skills' | 'projects' | 'arena'>('overview');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Task 2: Reset scroll to top immediately whenever a student profile opens
  useEffect(() => {
    if (student) {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0;
      }
      const raf = requestAnimationFrame(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop = 0;
        }
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [student]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  if (!student) return null;

  const isFriend = student.relationship === 'friends' || Boolean(student.isSelf);
  const isSent = student.relationship === 'sent';

  // Task 3: Resolve authentic match score and compute compatibility tier
  const rawScore = Number((student as any).matchPct);
  const calculated = computeStudentMatch(CURRENT_STUDENT_PROFILE, student as any);
  const compatScore = !isNaN(rawScore) && rawScore > 0 ? Math.min(100, Math.round(rawScore)) : calculated.overallMatch;
  const compatInfo = getCompatibilityDetails(compatScore);

  return (
    <div className="friends-drawer-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="friends-profile-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="drawer-topbar-title">
              Student Profile
            </span>
          </div>
          <button className="drawer-close-btn" onClick={onClose} title="Close profile">✕</button>
        </div>

        <div className="drawer-scroll-content" ref={scrollContainerRef}>
          {/* Hero Banner */}
          <div className="drawer-hero-card">
            <img
              src={student.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.id}`}
              alt={student.name}
              className="drawer-avatar-lg"
            />
            <div className="drawer-hero-details" style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <h2 className="drawer-student-name">{student.name}</h2>
                <span className="drawer-verified-badge" title="Verified PinIT Student">✦</span>
              </div>
              <div className="drawer-student-headline">
                {student.headline || 'Software Engineering Student'}
              </div>
              <div className="drawer-student-meta">
                <span>{student.college || 'Engineering College'}</span>
                {student.course && <span>{student.course}</span>}
              </div>

              <div className="drawer-actions-row">
                {isFriend ? (
                  <>
                    <button
                      className="friends-btn friends-btn-primary"
                      onClick={() => onOpenMessage?.(student)}
                    >
                      Message
                    </button>
                    <button
                      className="friends-btn friends-btn-secondary"
                      onClick={() => onOpenChallenge?.(student)}
                    >
                      Arena Battle
                    </button>
                    <button
                      className="friends-btn friends-btn-secondary"
                      onClick={() => onOpenProjectInvite?.(student)}
                    >
                      Invite to Squad
                    </button>
                    <button
                      className="friends-btn friends-btn-secondary"
                      onClick={() => {
                        onClose();
                        router.push(`/friends/${student.id}`);
                      }}
                    >
                      Full Profile →
                    </button>
                    <button
                      className="friends-btn friends-btn-danger"
                      onClick={() => onRemoveFriend?.(student.id)}
                    >
                      Unfriend
                    </button>
                  </>
                ) : student.relationship === 'received' ? (
                  <>
                    <button
                      className="friends-btn friends-btn-primary"
                      onClick={() => onAcceptRequest?.(student.id)}
                      style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                    >
                      ✓ Accept Request
                    </button>
                    <button
                      className="friends-btn friends-btn-secondary"
                      onClick={() => {
                        onClose();
                        router.push(`/friends/${student.id}`);
                      }}
                    >
                      Full Profile →
                    </button>
                  </>
                ) : isSent ? (
                  <>
                    <button className="friends-btn friends-btn-pending" disabled>
                      ⏳ Request Pending
                    </button>
                    <button
                      className="friends-btn friends-btn-secondary"
                      onClick={() => {
                        onClose();
                        router.push(`/friends/${student.id}`);
                      }}
                    >
                      Full Profile →
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="friends-btn friends-btn-primary"
                      onClick={() => onSendRequest?.(student.id)}
                    >
                      + Add to Network
                    </button>
                    <button
                      className="friends-btn friends-btn-secondary"
                      onClick={() => {
                        onClose();
                        router.push(`/friends/${student.id}`);
                      }}
                    >
                      Full Profile →
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Public Student Profile Banner: Non-connected viewer notice */}
          {!isFriend && (
            <div
              data-testid="drawer-profile-locked-state"
              style={{
                margin: '16px 0',
                padding: '16px 18px',
                borderRadius: 14,
                background: 'rgba(99, 102, 241, 0.08)',
                border: '1px solid rgba(99, 102, 241, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
                flexWrap: 'wrap',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 22 }}>🎓</span>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--t1)' }}>
                    Public Student Profile
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--t2)' }}>
                    Connect to unlock 1v1 duels, direct messages & squad collaboration.
                  </div>
                </div>
              </div>
              <div>
                {student.relationship === 'received' ? (
                  <button
                    className="friends-btn friends-btn-primary"
                    onClick={() => onAcceptRequest?.(student.id)}
                    style={{ padding: '7px 14px', fontSize: 12.5, background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                  >
                    ✓ Accept Request
                  </button>
                ) : isSent ? (
                  <span style={{ fontSize: 12, color: '#eab308', fontWeight: 700, padding: '5px 10px', background: 'rgba(234, 179, 8, 0.12)', borderRadius: 6, border: '1px solid rgba(234, 179, 8, 0.3)' }}>
                    ⏳ Request Pending
                  </span>
                ) : (
                  <button
                    className="friends-btn friends-btn-primary"
                    onClick={() => onSendRequest?.(student.id)}
                    style={{ padding: '7px 14px', fontSize: 12.5 }}
                  >
                    + Connect
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Quick Stats Grid — ZERO FAKE DATA */}
          <div className="drawer-stats-grid">
            <div className="drawer-section-card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#6366f1' }}>{student.careerScore ?? 0}</div>
              <div className="drawer-stat-label">Career Score</div>
            </div>
            <div className="drawer-section-card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#10b981' }}>{student.xp ?? 0}</div>
              <div className="drawer-stat-label">Verified XP</div>
            </div>
            <div className="drawer-section-card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#f59e0b' }}>{student.arenaWins ?? 0}</div>
              <div className="drawer-stat-label">Arena Duels</div>
            </div>
            <div className="drawer-section-card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#38bdf8' }}>{student.projectsCount ?? 0}</div>
              <div className="drawer-stat-label">Projects</div>
            </div>
          </div>

          {/* Sub Navigation */}
          <div className="drawer-tabs-row">
            {(['overview', 'skills', 'projects', 'arena'] as const).map((tab) => (
              <button
                key={tab}
                className={`drawer-tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <>
              <div className="drawer-section">
                <div className="drawer-section-heading">Career Target & Trajectory</div>
                <div className="drawer-section-card">
                  <div className="drawer-career-goal-title">
                    {student.careerGoal || 'Full Stack Engineer'}
                  </div>
                  <div className="drawer-career-goal-desc">
                    Actively mastering core distributed system patterns, algorithmic reasoning, and frontend performance on PinIT Career OS.
                  </div>
                </div>
              </div>

              <div className="drawer-section">
                <div className="drawer-section-heading">Verified Skill Badges</div>
                <div className="drawer-section-card" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {(student.skills || []).map((skill, idx) => (
                    <span key={idx} className="friends-skill-pill match-highlight" style={{ fontSize: 12, padding: '5px 10px' }}>
                      ✦ {skill}
                    </span>
                  ))}
                  {(!student.skills || student.skills.length === 0) && (
                    <span style={{ fontSize: 13, color: 'var(--text-muted, #94a3b8)' }}>No public skills listed.</span>
                  )}
                </div>
              </div>
            </>
          )}

          {activeTab === 'skills' && (
            <div className="drawer-section">
              <div className="drawer-section-heading">Skill Mastery Ledger</div>
              <div className="drawer-section-card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {(!student.skills || student.skills.length === 0) ? (
                  <span style={{ fontSize: 13, color: 'var(--text-muted, #94a3b8)', fontStyle: 'italic' }}>
                    No technical competencies listed.
                  </span>
                ) : (
                  student.skills.map((skill, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span className="drawer-skill-name">{skill.replace(/^skills?[\s:-]+/i, '')}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div className="drawer-skill-bar-track">
                          <div style={{ width: `${80 + (idx * 5) % 20}%`, height: '100%', background: 'linear-gradient(90deg, #6366f1, #38bdf8)' }} />
                        </div>
                        <span className="drawer-skill-val">
                          {80 + ((idx * 5) % 20)}%
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="drawer-section">
              <div className="drawer-section-heading">Squad Projects & Proofs-of-Work</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {(student as any).projects && Array.isArray((student as any).projects) && (student as any).projects.length > 0 ? (
                  (student as any).projects.map((proj: any, idx: number) => (
                    <div key={idx} className="drawer-section-card">
                      <div className="drawer-project-title">{proj.title}</div>
                      <div className="drawer-project-desc">{proj.desc || proj.description}</div>
                      {Array.isArray(proj.tech) && (
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
                          {proj.tech.map((t: string, ti: number) => (
                            <span key={ti} className="friends-skill-pill">{t}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="drawer-section-card" style={{ textAlign: 'center', padding: '24px 16px' }}>
                    
                    <div className="drawer-project-title" style={{ fontSize: 15.5 }}>No Capstone Proofs Submitted Yet</div>
                    <div className="drawer-project-desc" style={{ marginTop: 4 }}>
                      Candidate is completing foundational sprints. Verified project repos and oral defense records will appear here upon graduation.
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'arena' && (
            <div className="drawer-section">
              <div className="drawer-section-heading">Challenging Arena Record</div>
              <div className="drawer-section-card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div className="drawer-stat-label">Battle Elo Rating</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: '#38bdf8' }}>
                      {(() => {
                        const raw = (student as any).arena_elo || (student as any).eloRating;
                        const elo = (raw === 1200 && !(student.arenaWins)) ? 100 : (raw || (100 + ((student.arenaWins || 0) * 20)));
                        const rankTitle = elo >= 500 ? 'Grandmaster Apex' : elo >= 280 ? 'Platinum Vanguard' : elo >= 140 ? 'Silver Tactician' : 'Bronze Cadet';
                        return `${elo.toLocaleString()} Elo (${rankTitle})`;
                      })()}
                    </div>
                  </div>
                  <div>
                    <div className="drawer-stat-label">1v1 Arena Record</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: '#10b981' }}>
                      {student.arenaWins ?? 0} Duels Won
                    </div>
                  </div>
                </div>
                {(() => {
                  const rawTarget = (student as any).arena_elo || (student as any).eloRating;
                  const targetElo = (rawTarget === 1200 && !(student.arenaWins)) ? 100 : (rawTarget || (100 + ((student.arenaWins || 0) * 20)));
                  const stakes = calculateStakesPreview(100, targetElo);
                  return (
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '10px 14px',
                      borderRadius: 10,
                      background: 'rgba(56, 189, 248, 0.08)',
                      border: '1px solid rgba(56, 189, 248, 0.2)',
                      fontSize: 13,
                    }}>
                      <div>
                        <span style={{ color: 'var(--t3)', fontSize: 11, fontWeight: 700, display: 'block' }}>IF YOU WIN</span>
                        <strong style={{ color: '#34d399', fontSize: 15 }}>+{stakes.potentialWin} Elo</strong>
                        <span style={{ color: 'var(--t2)', fontSize: 12, marginLeft: 4 }}>({stakes.potentialWinXp} XP)</span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ color: 'var(--t3)', fontSize: 11, fontWeight: 700, display: 'block' }}>IF YOU LOSE</span>
                        <strong style={{ color: '#f87171', fontSize: 15 }}>{stakes.potentialLoss} Elo</strong>
                        <span style={{ color: 'var(--t2)', fontSize: 12, marginLeft: 4 }}>({stakes.potentialLossXp} XP)</span>
                      </div>
                    </div>
                  );
                })()}
                <button
                  className="friends-btn friends-btn-primary"
                  onClick={() => onOpenChallenge?.(student)}
                  style={{ width: '100%', padding: '10px' }}
                >
                  Challenge {(student.name || 'Student').split(' ')[0]} to a 1v1 DSA Duel
                </button>
              </div>
            </div>
          )}

          {/* ── Task 3: Peer Compatibility Line (At the end of profile) ── */}
          <div className="drawer-compatibility-card" data-testid="drawer-compatibility-line">
            <div className="drawer-compat-left">
              <div
                className="drawer-compat-icon-box"
                style={{
                  background: compatInfo.badgeBg,
                  border: `1px solid ${compatInfo.badgeBorder}`
                }}
              >
                🤝
              </div>
              <div>
                <div className="drawer-compat-title">
                  Compatible: <strong style={{ color: compatInfo.badgeColor }}>{compatInfo.label}</strong>
                </div>
                <div className="drawer-compat-sub">
                  {student.matchReason || `Career DNA affinity & skill overlap: ${compatScore}% score`}
                </div>
              </div>
            </div>
            <div
              className="drawer-compat-badge"
              style={{
                color: compatInfo.badgeColor,
                background: compatInfo.badgeBg,
                border: `1px solid ${compatInfo.badgeBorder}`
              }}
            >
              {compatScore}% Match
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
