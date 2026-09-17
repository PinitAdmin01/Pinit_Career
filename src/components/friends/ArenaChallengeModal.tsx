'use client';

import React, { useState } from 'react';
import { StudentProfile } from './StudentCard';

interface ArenaChallengeModalProps {
  student: StudentProfile | null;
  onClose: () => void;
  onSendChallenge: (data: { studentId: string; topic: string; difficulty: string; message: string }) => void;
}

export const ArenaChallengeModal: React.FC<ArenaChallengeModalProps> = ({
  student,
  onClose,
  onSendChallenge,
}) => {
  const [topic, setTopic] = useState('JavaScript DSA Duel');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [message, setMessage] = useState("Let's test our algorithms in the Challenging Arena!");

  if (!student) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSendChallenge({
      studentId: student.id,
      topic,
      difficulty,
      message,
    });
    onClose();
  };

  return (
    <div className="friends-modal-overlay" onClick={onClose}>
      <div className="friends-modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>⚔️ Challenge {student.name.split(' ')[0]} to 1v1 Battle</h3>
          <button className="drawer-close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.25)', borderRadius: 12 }}>
              <img src={student.avatar} alt={student.name} style={{ width: 42, height: 42, borderRadius: '50%' }} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#ffffff' }}>{student.name}</div>
                <div style={{ fontSize: 11, color: '#a5b4fc' }}>{student.college} • {student.arenaWins || 10} Arena Wins</div>
              </div>
            </div>

            <div className="modal-form-group">
              <label className="modal-form-label">Battle Topic & Language</label>
              <select className="modal-select-input" value={topic} onChange={(e) => setTopic(e.target.value)}>
                <option value="JavaScript DSA Duel">JavaScript — Arrays & Sliding Window</option>
                <option value="Python Algorithm Battle">Python — Dynamic Programming & Graphs</option>
                <option value="React Performance Duel">React — Virtual DOM & State Optimization</option>
                <option value="SQL & Systems Query Duel">SQL & Query Optimization Showdown</option>
              </select>
            </div>

            <div className="modal-form-group">
              <label className="modal-form-label">Difficulty Tier</label>
              <select className="modal-select-input" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                <option value="Beginner">Beginner (100 XP Duel)</option>
                <option value="Intermediate">Intermediate (250 XP Duel)</option>
                <option value="Hardcore">Hardcore / Grandmaster (500 XP Duel)</option>
              </select>
            </div>

            <div className="modal-form-group">
              <label className="modal-form-label">Custom Challenge Message</label>
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
            <button type="button" className="friends-btn friends-btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="friends-btn friends-btn-primary">
              🚀 Dispatch Challenge
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
