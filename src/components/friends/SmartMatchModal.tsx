'use client';

import React from 'react';
import { MatchStudentProfile, MatchBreakdown } from '@/lib/friends/matching';
import { toast } from '@/lib/store/useAppStore';

interface SmartMatchModalProps {
  student: MatchStudentProfile | null;
  match: MatchBreakdown | null;
  onClose: () => void;
  onAddFriend: (id: string, name: string) => void;
  onOpenChallenge: (student: MatchStudentProfile) => void;
  onOpenProjectInvite: (student: MatchStudentProfile) => void;
}

export const SmartMatchModal: React.FC<SmartMatchModalProps> = ({
  student,
  match,
  onClose,
  onAddFriend,
  onOpenChallenge,
  onOpenProjectInvite
}) => {
  if (!student || !match) return null;

  return (
    <div className="friends-modal-overlay" onClick={onClose}>
      <div className="friends-modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 540 }}>
        
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 20 }}>🤖</span>
            <div>
              <h3 style={{ margin: 0, fontSize: 17, color: '#ffffff' }}>AI Peer Match Breakdown</h3>
              <span style={{ fontSize: 11, color: '#94a3b8' }}>PinIT Smart Affinity Engine</span>
            </div>
          </div>
          <button className="drawer-close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body" style={{ gap: 20 }}>
          
          {/* Peer Hero Card */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(15, 23, 42, 0.8) 100%)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: 14
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <img
                src={student.avatar}
                alt={student.name}
                style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }}
              />
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#ffffff' }}>{student.name}</div>
                <div style={{ fontSize: 12, color: '#94a3b8' }}>{student.course} • {student.college}</div>
                <div style={{ fontSize: 11, color: '#a78bfa', marginTop: 2 }}>{match.reasonTag}</div>
              </div>
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '6px 14px',
              borderRadius: 12,
              background: 'rgba(99, 102, 241, 0.25)',
              border: '1px solid rgba(168, 85, 247, 0.5)'
            }}>
              <span style={{ fontSize: 22, fontWeight: 800, color: '#c084fc' }}>{match.overallMatch}%</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#e2e8f0', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Affinity Match
              </span>
            </div>
          </div>

          {/* 4 Multi-Factor Score Bars */}
          <div style={{
            padding: '16px',
            background: 'rgba(30, 41, 59, 0.45)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: 12,
            display: 'flex',
            flexDirection: 'column',
            gap: 12
          }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Multi-Factor Match Vectors
            </div>

            {/* Factor 1: Skills */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                <span style={{ color: '#94a3b8' }}>Skill Synergy & Overlap</span>
                <span style={{ color: '#38bdf8', fontWeight: 700 }}>{match.skillScore}%</span>
              </div>
              <div style={{ width: '100%', height: 5, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ width: `${match.skillScore}%`, height: '100%', background: 'linear-gradient(90deg, #38bdf8, #818cf8)' }} />
              </div>
            </div>

            {/* Factor 2: Campus Proximity */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                <span style={{ color: '#94a3b8' }}>Campus & College Proximity</span>
                <span style={{ color: '#34d399', fontWeight: 700 }}>{match.collegeScore}%</span>
              </div>
              <div style={{ width: '100%', height: 5, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ width: `${match.collegeScore}%`, height: '100%', background: 'linear-gradient(90deg, #10b981, #34d399)' }} />
              </div>
            </div>

            {/* Factor 3: Course Alignment */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                <span style={{ color: '#94a3b8' }}>Degree & Curriculum Alignment</span>
                <span style={{ color: '#fbbf24', fontWeight: 700 }}>{match.courseScore}%</span>
              </div>
              <div style={{ width: '100%', height: 5, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ width: `${match.courseScore}%`, height: '100%', background: 'linear-gradient(90deg, #f59e0b, #fbbf24)' }} />
              </div>
            </div>

            {/* Factor 4: Career Goals */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                <span style={{ color: '#94a3b8' }}>Career Ambition & Trajectory</span>
                <span style={{ color: '#ec4899', fontWeight: 700 }}>{match.goalScore}%</span>
              </div>
              <div style={{ width: '100%', height: 5, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ width: `${match.goalScore}%`, height: '100%', background: 'linear-gradient(90deg, #d946ef, #ec4899)' }} />
              </div>
            </div>
          </div>

          {/* Shared & Complementary Skills */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {match.commonSkills.length > 0 && (
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Shared Technical Strengths
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
                  {match.commonSkills.map((s, idx) => (
                    <span key={idx} className="mini-skill-pill" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#7dd3fc', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                      ✓ {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {match.complementarySkills.length > 0 && (
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Complementary Engineering Skills
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
                  {match.complementarySkills.map((s, idx) => (
                    <span key={idx} className="mini-skill-pill" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#6ee7b7', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                      ⚡ {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Icebreaker Suggestions */}
          <div>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Suggested Icebreakers
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 6 }}>
              {match.icebreakers.map((starter, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 8,
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    fontSize: 12,
                    color: '#e2e8f0',
                    cursor: 'pointer',
                    transition: 'background 0.15s ease'
                  }}
                  onClick={() => {
                    navigator.clipboard?.writeText(starter);
                    toast.success('Icebreaker Copied!', 'Ready to paste in chat.');
                  }}
                >
                  💬 "{starter}"
                </div>
              ))}
            </div>
          </div>

        </div>

        <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className="friends-btn friends-btn-secondary"
              onClick={() => {
                onClose();
                onOpenChallenge(student);
              }}
            >
              🏆 Duel
            </button>
            <button
              className="friends-btn friends-btn-secondary"
              onClick={() => {
                onClose();
                onOpenProjectInvite(student);
              }}
            >
              👥 Project
            </button>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button className="friends-btn friends-btn-secondary" onClick={onClose}>
              Close
            </button>
            <button
              className="friends-btn friends-btn-primary"
              onClick={() => {
                onAddFriend(student.id, student.name);
                onClose();
              }}
            >
              + Add Friend
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};