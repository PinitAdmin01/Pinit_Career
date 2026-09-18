'use client';

import React, { useState, useEffect } from 'react';
import { StudentProfile } from './StudentCard';
import { toast } from '@/lib/store/useAppStore';

interface ProjectInviteModalProps {
  student: StudentProfile | null;
  initialProjectName?: string;
  onClose: () => void;
  onSendInvite?: (data: { studentId: string; projectName: string; role: string; message: string; commitmentHours: number }) => void;
}

export const ProjectInviteModal: React.FC<ProjectInviteModalProps> = ({
  student,
  initialProjectName,
  onClose,
  onSendInvite,
}) => {
  const [projectName, setProjectName] = useState(initialProjectName || 'AI Resume Analyzer & ATS Benchmarker');
  const [role, setRole] = useState('Frontend Architecture & Performance');
  const [commitmentHours, setCommitmentHours] = useState(6);
  const [message, setMessage] = useState("We are scaling our core architecture and your skills would be a huge boost to the squad!");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialProjectName) {
      setProjectName(initialProjectName);
    }
  }, [initialProjectName]);

  if (!student) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/friends/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: student.id,
          studentName: student.name,
          studentAvatar: student.avatar,
          projectName,
          role,
          message,
          commitmentHours
        })
      });
      const data = await res.json();
      if (data.ok) {
        toast.success('Squad Project Invite Dispatched!', `Invited ${student.name} to ${projectName} as ${role}.`);
        onSendInvite?.({
          studentId: student.id,
          projectName,
          role,
          message,
          commitmentHours
        });
        onClose();
      } else {
        toast.error('Invite Failed', data.error || 'Could not send invitation.');
      }
    } catch (err) {
      toast.error('Network Error', 'Failed to dispatch project invitation');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="friends-modal-overlay" onClick={onClose}>
      <div className="friends-modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>👥 Invite {student.name.split(' ')[0]} to Project Squad</h3>
          <button className="drawer-close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            
            {/* Student Preview Card */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 16px',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(15, 23, 42, 0.7) 100%)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: 12
            }}>
              <img src={student.avatar} alt={student.name} style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#ffffff' }}>{student.name}</div>
                <div style={{ fontSize: 11.5, color: '#94a3b8' }}>{student.course} • {student.college}</div>
                <div style={{ fontSize: 11, color: '#34d399', marginTop: 2 }}>
                  Verified Skills: {student.skills.slice(0, 3).join(', ')}
                </div>
              </div>
            </div>

            {/* Target Squad Project */}
            <div className="modal-form-group">
              <label className="modal-form-label">Target Squad Project</label>
              <select className="modal-select-input" value={projectName} onChange={(e) => setProjectName(e.target.value)}>
                <option value="AI Resume Analyzer & ATS Benchmarker">AI Resume Analyzer & ATS Benchmarker</option>
                <option value="Campus Transit Telemetry & Shuttle Tracker">Campus Transit Telemetry & Shuttle Tracker</option>
                <option value="Distributed Interview Evaluator Engine">Distributed Interview Evaluator Engine</option>
                <option value="PinIT Career DNA Matching Service">PinIT Career DNA Matching Service</option>
              </select>
            </div>

            {/* Role in Squad */}
            <div className="modal-form-group">
              <label className="modal-form-label">Target Role in Squad</label>
              <select className="modal-select-input" value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="Frontend Architecture & Performance">Frontend Architecture & Performance (React/Next.js)</option>
                <option value="Backend APIs & Microservices">Backend APIs & Microservices (Node/FastAPI)</option>
                <option value="ML Pipeline & Prompt Engineer">ML Pipeline & Prompt Engineer (Python/PyTorch)</option>
                <option value="UI/UX & Design Systems Lead">UI/UX & Design Systems Lead (Figma/Tailwind)</option>
                <option value="DevOps & Cloud Deployment">DevOps & Cloud Deployment (Docker/Supabase)</option>
              </select>
            </div>

            {/* Commitment Hours */}
            <div className="modal-form-group">
              <label className="modal-form-label">Weekly Commitment: {commitmentHours} hrs/week</label>
              <input
                type="range"
                min="2"
                max="20"
                step="1"
                value={commitmentHours}
                onChange={(e) => setCommitmentHours(parseInt(e.target.value, 10))}
                style={{ width: '100%', accentColor: '#10b981' }}
              />
            </div>

            {/* Personalized Invitation Note */}
            <div className="modal-form-group">
              <label className="modal-form-label">Personalized Squad Pitch</label>
              <textarea
                className="modal-text-input"
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                style={{ resize: 'none' }}
              />
            </div>

          </div>

          <div className="modal-footer">
            <button type="button" className="friends-btn friends-btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button
              type="submit"
              className="friends-btn friends-btn-primary"
              disabled={isSubmitting}
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                border: '1px solid rgba(52, 211, 153, 0.4)'
              }}
            >
              {isSubmitting ? 'Dispatching...' : '🚀 Dispatch Squad Invitation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};