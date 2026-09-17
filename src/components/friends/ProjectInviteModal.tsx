'use client';

import React, { useState } from 'react';
import { StudentProfile } from './StudentCard';

interface ProjectInviteModalProps {
  student: StudentProfile | null;
  onClose: () => void;
  onSendInvite: (data: { studentId: string; projectName: string; role: string; message: string }) => void;
}

export const ProjectInviteModal: React.FC<ProjectInviteModalProps> = ({
  student,
  onClose,
  onSendInvite,
}) => {
  const [projectName, setProjectName] = useState('AI Resume Analyzer Squad');
  const [role, setRole] = useState('Frontend Architecture');
  const [message, setMessage] = useState("We'd love to have your skills in our production squad!");

  if (!student) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSendInvite({
      studentId: student.id,
      projectName,
      role,
      message,
    });
    onClose();
  };

  return (
    <div className="friends-modal-overlay" onClick={onClose}>
      <div className="friends-modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>📁 Invite {student.name.split(' ')[0]} to Squad Project</h3>
          <button className="drawer-close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: 12 }}>
              <img src={student.avatar} alt={student.name} style={{ width: 42, height: 42, borderRadius: '50%' }} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#ffffff' }}>{student.name}</div>
                <div style={{ fontSize: 11, color: '#34d399' }}>Skills: {student.skills.slice(0, 3).join(', ')}</div>
              </div>
            </div>

            <div className="modal-form-group">
              <label className="modal-form-label">Select Active Squad Project</label>
              <select className="modal-select-input" value={projectName} onChange={(e) => setProjectName(e.target.value)}>
                <option value="AI Resume Analyzer Squad">AI Resume Analyzer (Recruiter Tool)</option>
                <option value="Campus Transit Telemetry Desk">Campus Transit Telemetry Hub</option>
                <option value="Distributed Interview Evaluator">Distributed Interview Evaluator Engine</option>
              </select>
            </div>

            <div className="modal-form-group">
              <label className="modal-form-label">Role in Project</label>
              <select className="modal-select-input" value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="Frontend Architecture">Frontend Architecture (React/Next.js)</option>
                <option value="Backend & APIs">Backend & API Lead (Node/Python)</option>
                <option value="UI/UX Technologist">UI/UX & Design Technologist</option>
                <option value="ML Pipeline Specialist">ML Pipeline & Prompt Engineer</option>
              </select>
            </div>

            <div className="modal-form-group">
              <label className="modal-form-label">Invitation Note</label>
              <input
                type="text"
                className="modal-text-input"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="friends-btn friends-btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="friends-btn friends-btn-primary">
              🚀 Send Project Invitation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
