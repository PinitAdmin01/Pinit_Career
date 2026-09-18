'use client';

import React, { useState } from 'react';
import { StudentProfile } from './StudentCard';
import { toast } from '@/lib/store/useAppStore';

interface ReportStudentModalProps {
  student: StudentProfile | null;
  onClose: () => void;
  onReportSuccess?: () => void;
}

export const ReportStudentModal: React.FC<ReportStudentModalProps> = ({
  student,
  onClose,
  onReportSuccess
}) => {
  const [reason, setReason] = useState('Harassment or Inappropriate Messages');
  const [details, setDetails] = useState('');
  const [alsoBlock, setAlsoBlock] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  if (!student) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // 1. Submit moderation report
      const res = await fetch('/api/friends/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportedStudentId: student.id,
          reportedStudentName: student.name,
          reason,
          details
        })
      });
      const data = await res.json();

      // 2. Also block if checked
      if (alsoBlock) {
        await fetch('/api/friends/privacy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'block',
            studentId: student.id,
            studentName: student.name,
            studentAvatar: student.avatar
          })
        });
      }

      if (data.ok) {
        toast.success('Report Submitted', 'Our Campus Safety team has logged this incident.');
        onReportSuccess?.();
        onClose();
      } else {
        toast.error('Submission Failed', data.error || 'Could not submit report.');
      }
    } catch (err) {
      toast.error('Network Error', 'Could not dispatch moderation report');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="friends-modal-overlay" onClick={onClose}>
      <div className="friends-modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 480 }}>
        
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 20 }}>⚠️</span>
            <div>
              <h3 style={{ margin: 0, fontSize: 17, color: '#f87171' }}>Report Student</h3>
              <span style={{ fontSize: 11, color: '#94a3b8' }}>PinIT Campus Trust & Safety</span>
            </div>
          </div>
          <button className="drawer-close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ gap: 16 }}>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 14px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              borderRadius: 12
            }}>
              {student.avatar && (
                <img src={student.avatar} alt={student.name} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
              )}
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#ffffff' }}>{student.name}</div>
                <div style={{ fontSize: 11.5, color: '#94a3b8' }}>{student.course} • {student.college}</div>
              </div>
            </div>

            <div className="modal-form-group">
              <label className="modal-form-label">Select Violation Reason</label>
              <select
                className="modal-select-input"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              >
                <option value="Harassment or Inappropriate Messages">Harassment or Inappropriate Messages</option>
                <option value="Spam or Unsolicited Project Invites">Spam or Unsolicited Project Invites</option>
                <option value="Fake Profile or Identity Impersonation">Fake Profile or Identity Impersonation</option>
                <option value="Cheating in Challenging Arena Duels">Cheating in Challenging Arena Duels</option>
                <option value="Other Campus Policy Violation">Other Campus Policy Violation</option>
              </select>
            </div>

            <div className="modal-form-group">
              <label className="modal-form-label">Incident Details & Context (Optional)</label>
              <textarea
                className="modal-text-input"
                rows={3}
                placeholder="Explain what occurred or paste relevant chat snippets..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                style={{ resize: 'none' }}
              />
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              background: 'rgba(30, 41, 59, 0.5)',
              borderRadius: 10,
              border: '1px solid rgba(255, 255, 255, 0.06)'
            }}>
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: '#ffffff' }}>Also block this student</div>
                <div style={{ fontSize: 10.5, color: '#94a3b8' }}>Prevent further messages, duels, and collaboration requests</div>
              </div>
              <input
                type="checkbox"
                checked={alsoBlock}
                onChange={(e) => setAlsoBlock(e.target.checked)}
                style={{ width: 18, height: 18, accentColor: '#ef4444', cursor: 'pointer' }}
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
              {submitting ? 'Submitting...' : 'Submit Incident Report'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};