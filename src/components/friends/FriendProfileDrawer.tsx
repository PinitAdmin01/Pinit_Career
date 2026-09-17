'use client';

import React, { useState } from 'react';
import { StudentProfile } from './StudentCard';

interface FriendProfileDrawerProps {
  student: StudentProfile | null;
  onClose: () => void;
  onSendRequest?: (studentId: string) => void;
  onRemoveFriend?: (studentId: string) => void;
  onOpenMessage?: (student: StudentProfile) => void;
  onOpenChallenge?: (student: StudentProfile) => void;
  onOpenProjectInvite?: (student: StudentProfile) => void;
}

export const FriendProfileDrawer: React.FC<FriendProfileDrawerProps> = ({
  student,
  onClose,
  onSendRequest,
  onRemoveFriend,
  onOpenMessage,
  onOpenChallenge,
  onOpenProjectInvite,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'skills' | 'portfolio' | 'arena'>('overview');

  if (!student) return null;

  const isFriend = student.relationship === 'friends';
  const isSent = student.relationship === 'sent';

  return (
    <div className="friends-drawer-backdrop" onClick={onClose}>
      <div className="friends-profile-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#a5b4fc' }}>
              Student Profile & Portfolio
            </span>
          </div>
          <button className="drawer-close-btn" onClick={onClose} title="Close drawer">✕</button>
        </div>

        <div className="drawer-scroll-content">
          {/* Hero Banner */}
          <div className="drawer-hero-card">
            <img
              src={student.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.id}`}
              alt={student.name}
              className="drawer-avatar-lg"
            />
            <div className="drawer-hero-details" style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h2>{student.name}</h2>
                <span style={{ color: '#38bdf8', fontSize: 18 }}>✦</span>
              </div>
              <div style={{ fontSize: 13.5, color: '#a5b4fc', fontWeight: 600, marginBottom: 6 }}>
                {student.headline || 'Software Engineering Student'}
              </div>
              <div style={{ fontSize: 12, color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span>🏫 {student.college || 'Engineering College'}</span>
                {student.course && <span>📚 {student.course}</span>}
              </div>

              <div className="drawer-actions-row">
                {isFriend ? (
                  <>
                    <button
                      className="friends-btn friends-btn-primary"
                      onClick={() => onOpenMessage?.(student)}
                    >
                      💬 Message
                    </button>
                    <button
                      className="friends-btn friends-btn-secondary"
                      onClick={() => onOpenChallenge?.(student)}
                    >
                      ⚔️ Arena Battle
                    </button>
                    <button
                      className="friends-btn friends-btn-secondary"
                      onClick={() => onOpenProjectInvite?.(student)}
                    >
                      📁 Invite to Squad
                    </button>
                    <button
                      className="friends-btn friends-btn-danger"
                      onClick={() => onRemoveFriend?.(student.id)}
                    >
                      Unfriend
                    </button>
                  </>
                ) : isSent ? (
                  <button className="friends-btn friends-btn-pending" disabled>
                    ⏳ Request Pending
                  </button>
                ) : (
                  <button
                    className="friends-btn friends-btn-primary"
                    onClick={() => onSendRequest?.(student.id)}
                  >
                    + Add to Network
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
            <div className="drawer-section-card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#6366f1' }}>{student.careerScore || 85}</div>
              <div style={{ fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', marginTop: 2 }}>Career Score</div>
            </div>
            <div className="drawer-section-card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#10b981' }}>{student.xp || 2400}</div>
              <div style={{ fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', marginTop: 2 }}>Verified XP</div>
            </div>
            <div className="drawer-section-card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#f59e0b' }}>{student.arenaWins || 12}</div>
              <div style={{ fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', marginTop: 2 }}>Arena Duels</div>
            </div>
            <div className="drawer-section-card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#38bdf8' }}>{student.projectsCount || 3}</div>
              <div style={{ fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', marginTop: 2 }}>Projects</div>
            </div>
          </div>

          {/* Sub Navigation */}
          <div style={{ display: 'flex', gap: 6, borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 8 }}>
            {(['overview', 'skills', 'portfolio', 'arena'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 8,
                  fontSize: 12.5,
                  fontWeight: 600,
                  textTransform: 'capitalize',
                  background: activeTab === tab ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                  color: activeTab === tab ? '#ffffff' : '#94a3b8',
                  border: activeTab === tab ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid transparent',
                  cursor: 'pointer'
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <>
              <div className="drawer-section">
                <div className="drawer-section-heading">🎯 Career Target & Trajectory</div>
                <div className="drawer-section-card">
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#f8fafc', marginBottom: 4 }}>
                    {student.careerGoal || 'Full Stack Engineer'}
                  </div>
                  <div style={{ fontSize: 12.5, color: '#94a3b8', lineHeight: 1.5 }}>
                    Actively mastering core distributed system patterns, algorithmic reasoning, and frontend performance on PinIT Career OS.
                  </div>
                </div>
              </div>

              <div className="drawer-section">
                <div className="drawer-section-heading">⚡ Verified Skill Badges</div>
                <div className="drawer-section-card" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {student.skills.map((skill, idx) => (
                    <span key={idx} className="friends-skill-pill match-highlight" style={{ fontSize: 11, padding: '5px 10px' }}>
                      ✦ {skill}
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === 'skills' && (
            <div className="drawer-section">
              <div className="drawer-section-heading">📊 Skill Mastery Ledger</div>
              <div className="drawer-section-card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {student.skills.map((skill, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#ffffff' }}>{skill}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 140, height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ width: `${80 + (idx * 5) % 20}%`, height: '100%', background: 'linear-gradient(90deg, #6366f1, #38bdf8)' }} />
                      </div>
                      <span style={{ fontSize: 11, fontFamily: 'monospace', color: '#94a3b8' }}>
                        {80 + ((idx * 5) % 20)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'portfolio' && (
            <div className="drawer-section">
              <div className="drawer-section-heading">📁 Squad Projects & Proofs-of-Work</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div className="drawer-section-card">
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#ffffff', marginBottom: 2 }}>
                    Distributed AI Evaluation System
                  </div>
                  <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 8 }}>
                    Full-stack evaluation engine with latency metrics, telemetry verification, and WebSockets.
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <span className="friends-skill-pill">Next.js</span>
                    <span className="friends-skill-pill">TypeScript</span>
                    <span className="friends-skill-pill">PostgreSQL</span>
                  </div>
                </div>
                <div className="drawer-section-card">
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#ffffff', marginBottom: 2 }}>
                    Cloud Transit Automation Desk
                  </div>
                  <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 8 }}>
                    Campus bus telemetry tracker with route allocation algorithms and stop verification.
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <span className="friends-skill-pill">React</span>
                    <span className="friends-skill-pill">Tailwind</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'arena' && (
            <div className="drawer-section">
              <div className="drawer-section-heading">⚔️ Challenging Arena Record</div>
              <div className="drawer-section-card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 12, color: '#94a3b8' }}>Battle Elo Rating</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: '#38bdf8' }}>1,640 Elo</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: '#94a3b8' }}>1v1 Win Rate</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: '#10b981' }}>74.2%</div>
                  </div>
                </div>
                <button
                  className="friends-btn friends-btn-primary"
                  onClick={() => onOpenChallenge?.(student)}
                  style={{ width: '100%', padding: '10px' }}
                >
                  ⚔️ Challenge {student.name.split(' ')[0]} to a 1v1 DSA Duel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
