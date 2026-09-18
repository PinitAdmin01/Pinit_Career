'use client';

import React from 'react';

export interface StudentProfile {
  id: string;
  name: string;
  headline?: string;
  avatar?: string;
  college?: string;
  course?: string;
  careerGoal?: string;
  skills: string[];
  matchReason?: string;
  careerScore?: number;
  xp?: number;
  arenaWins?: number;
  projectsCount?: number;
  online?: boolean;
  relationship?: 'none' | 'friends' | 'sent' | 'received';
  friendshipId?: string;
}

interface StudentCardProps {
  student: StudentProfile;
  onViewProfile: (student: StudentProfile) => void;
  onSendRequest?: (studentId: string) => void;
  onAcceptRequest?: (requestId: string) => void;
  onDeclineRequest?: (requestId: string) => void;
  onRemoveFriend?: (studentId: string) => void;
  onOpenMessage?: (student: StudentProfile) => void;
  onOpenChallenge?: (student: StudentProfile) => void;
  onOpenProjectInvite?: (student: StudentProfile) => void;
  requestId?: string;
}

export const StudentCard: React.FC<StudentCardProps> = ({
  student,
  onViewProfile,
  onSendRequest,
  onAcceptRequest,
  onDeclineRequest,
  onRemoveFriend,
  onOpenMessage,
  onOpenChallenge,
  onOpenProjectInvite,
  requestId,
}) => {
  const isFriend = student.relationship === 'friends';
  const isSent = student.relationship === 'sent';
  const isReceived = student.relationship === 'received';

  return (
    <div className="friends-card">
      <div className="friends-card-header">
        <div className="friends-avatar-wrap" onClick={() => onViewProfile(student)} style={{ cursor: 'pointer' }}>
          {student.avatar ? (
            <img src={student.avatar} alt={student.name} className="friends-avatar-img" />
          ) : (
            <div className="friends-avatar-fallback">{student.name.charAt(0)}</div>
          )}
          {student.online && <span className="online-beacon" title="Active on platform" />}
        </div>

        <div className="friends-card-identity">
          <div className="friends-name-row">
            <span
              className="friends-student-name"
              onClick={() => onViewProfile(student)}
              style={{ cursor: 'pointer' }}
              title={student.name}
            >
              {student.name}
            </span>
            <span className="verified-star-badge" title="Verified PinIT Student">✦</span>
          </div>

          <div className="friends-student-headline" title={student.headline}>
            {student.headline || 'Student Engineer'}
          </div>

          <div className="friends-student-meta">
            <span>{student.college || 'Campus Member'}</span>
            {student.course && <span>• {student.course}</span>}
          </div>
        </div>
      </div>

      <div className="friends-card-body">
        {student.matchReason && (
          <div className="match-reason-badge" style={{ marginBottom: 10 }}>
            <span>⚡</span> {student.matchReason}
          </div>
        )}

        {student.careerGoal && (
          <div className="friends-career-goal">
            <span>🎯</span>
            <div>
              <strong>Target:</strong> {student.careerGoal}
            </div>
          </div>
        )}

        <div className="friends-skills-list">
          {student.skills.slice(0, 4).map((skill, idx) => (
            <span key={idx} className="friends-skill-pill match-highlight">
              {skill}
            </span>
          ))}
          {student.skills.length > 4 && (
            <span className="friends-skill-pill">+{student.skills.length - 4}</span>
          )}
        </div>
      </div>

      <div className="friends-card-actions">
        <button
          className="friends-btn friends-btn-secondary"
          onClick={() => onViewProfile(student)}
          title="View full student portfolio"
        >
          View Profile
        </button>

        {isFriend ? (
          <>
            <button
              className="friends-btn friends-btn-primary"
              onClick={() => onOpenMessage?.(student)}
              title="Direct message"
            >
              💬 Message
            </button>
            <button
              className="friends-btn friends-btn-secondary friends-btn-icon-only"
              onClick={() => onOpenChallenge?.(student)}
              title="Challenge in Arena"
            >
              ⚔️
            </button>
            <button
              className="friends-btn friends-btn-secondary friends-btn-icon-only"
              onClick={() => onOpenProjectInvite?.(student)}
              title="Invite to Squad Project"
            >
              📁
            </button>
          </>
        ) : isSent ? (
          <button className="friends-btn friends-btn-pending" disabled>
            ⏳ Request Sent
          </button>
        ) : isReceived ? (
          <>
            <button
              className="friends-btn friends-btn-success"
              onClick={() => requestId && onAcceptRequest?.(requestId)}
              title="Accept friend request"
            >
              Accept
            </button>
            <button
              className="friends-btn friends-btn-secondary"
              onClick={() => requestId && onDeclineRequest?.(requestId)}
              title="Decline request"
            >
              Decline
            </button>
          </>
        ) : (
          <button
            className="friends-btn friends-btn-primary"
            onClick={() => onSendRequest?.(student.id)}
            style={{ marginLeft: 'auto' }}
          >
            + Add Friend
          </button>
        )}
      </div>
    </div>
  );
};
