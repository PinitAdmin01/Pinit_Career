'use client';

import React, { useState } from 'react';
import { StudentProfile } from './StudentCard';
import { toast } from '@/lib/store/useAppStore';

interface ArenaChallengeModalProps {
  student: StudentProfile | null;
  onClose: () => void;
  onSendChallenge?: (data: { studentId: string; topic: string; difficulty: string; message: string }) => void;
}

export const ArenaChallengeModal: React.FC<ArenaChallengeModalProps> = ({
  student,
  onClose,
  onSendChallenge,
}) => {
  const [topic, setTopic] = useState('Algorithms: Arrays & Two Pointers');
  const [difficulty, setDifficulty] = useState('Medium');
  const [timeLimit, setTimeLimit] = useState(25);
  const [wagerXP, setWagerXP] = useState(150);
  const [message, setMessage] = useState("Let's test our algorithms in the Challenging Arena!");
  const [submitting, setSubmitting] = useState(false);

  if (!student) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/friends/challenges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: student.id,
          studentName: student.name,
          studentAvatar: student.avatar,
          topic,
          difficulty,
          timeLimit,
          wagerXP,
          message
        })
      });
      const data = await res.json();
      if (data.ok) {
        toast.success('Challenging Arena Invite Sent!', `1v1 Duel invite dispatched to ${student.name} for ${topic}.`);
        onSendChallenge?.({
          studentId: student.id,
          topic,
          difficulty,
          message
        });
        onClose();
      } else {
        toast.error('Challenge Failed', data.error || 'Could not send challenge');
      }
    } catch (err) {
      toast.error('Network Error', 'Failed to dispatch arena challenge');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="friends-modal-overlay" onClick={onClose}>
      <div className="friends-modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 500 }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 20 }}>⚔️</span>
            <div>
              <h3 style={{ margin: 0, fontSize: 17, color: '#ffffff' }}>1v1 Arena Duel Challenge</h3>
              <span style={{ fontSize: 11, color: '#f87171' }}>Challenging Arena Live Match</span>
            </div>
          </div>
          <button className="drawer-close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            
            {/* Student Preview Card */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 14px',
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.12) 0%, rgba(15, 23, 42, 0.7) 100%)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              borderRadius: 12
            }}>
              {student.avatar && (
                <img src={student.avatar} alt={student.name} style={{ width: 42, height: 42, borderRadius: '50%', objectFit: 'cover' }} />
              )}
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#ffffff' }}>{student.name}</div>
                <div style={{ fontSize: 11.5, color: '#94a3b8' }}>{student.college} • {student.arenaWins || 12} Arena Wins</div>
              </div>
            </div>

            {/* Duel Topic */}
            <div className="modal-form-group">
              <label className="modal-form-label">Battle Topic</label>
              <select className="modal-select-input" value={topic} onChange={(e) => setTopic(e.target.value)}>
                <option value="Algorithms: Arrays & Two Pointers">Algorithms: Arrays & Two Pointers</option>
                <option value="Algorithms: Dynamic Programming">Algorithms: Dynamic Programming</option>
                <option value="Frontend: React Virtual DOM & Hooks">Frontend: React Virtual DOM & Hooks</option>
                <option value="Backend: Distributed Systems & APIs">Backend: Distributed Systems & APIs</option>
                <option value="Database: SQL Query Optimization">Database: SQL Query Optimization</option>
              </select>
            </div>

            {/* Difficulty & Time Limit */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="modal-form-group">
                <label className="modal-form-label">Difficulty</label>
                <select className="modal-select-input" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                  <option value="Easy">Easy (Beginner)</option>
                  <option value="Medium">Medium (Intermediate)</option>
                  <option value="Hard">Hard (Expert)</option>
                </select>
              </div>

              <div className="modal-form-group">
                <label className="modal-form-label">Time Limit</label>
                <select className="modal-select-input" value={timeLimit} onChange={(e) => setTimeLimit(parseInt(e.target.value, 10))}>
                  <option value={15}>15 Minutes</option>
                  <option value={25}>25 Minutes</option>
                  <option value={45}>45 Minutes</option>
                </select>
              </div>
            </div>

            {/* XP Wager */}
            <div className="modal-form-group">
              <label className="modal-form-label">XP Stake Wager: +{wagerXP} XP</label>
              <input
                type="range"
                min="50"
                max="500"
                step="50"
                value={wagerXP}
                onChange={(e) => setWagerXP(parseInt(e.target.value, 10))}
                style={{ width: '100%', accentColor: '#ef4444' }}
              />
            </div>

            {/* Custom Message */}
            <div className="modal-form-group">
              <label className="modal-form-label">Challenge Message</label>
              <input
                type="text"
                className="modal-text-input"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ready to duel?"
              />
            </div>

          </div>

          <div className="modal-footer">
            <button type="button" className="friends-btn friends-btn-secondary" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button
              type="submit"
              className="friends-btn friends-btn-primary"
              disabled={submitting}
              style={{
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                border: '1px solid rgba(248, 113, 113, 0.4)'
              }}
            >
              {submitting ? 'Dispatching...' : '⚔️ Dispatch 1v1 Challenge'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};