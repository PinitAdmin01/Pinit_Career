'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import { api } from '@/lib/api/client';
import type { CrashCourseEnrollment } from '@/lib/services/crashCourseEnrollmentService';
import {
  CAPSTONE_SPRINTS,
  type CapstoneSprintInfo,
  COURSE_DEFENSE_PATH,
  isSprintApproved,
  nextCapstoneSprint,
  type CapstoneMilestones,
  type CapstoneSprint,
} from '@/lib/courses/capstoneSprints';

/**
 * Capstone desk of a certificate course. Everything shown here comes from the student's
 * enrollment as the server recorded it: a sprint is approved only after POST /api/quests/capstone
 * checked it, and the certificate is the one /api/certificates/course issued (verifiable at /verify).
 */
interface CapstoneInternshipPortalProps {
  enrollment: CrashCourseEnrollment;
  planTitle: string;
  studentName: string;
  /** Lessons of the course still to do; the capstone opens when this is 0. */
  lessonsLeft: number;
  onEnrollmentUpdated: (enrollment: CrashCourseEnrollment) => void;
  onClose: () => void;
  /** The plan's wording of the four sprints; defaults to the generic wording. */
  sprints?: ReadonlyArray<CapstoneSprintInfo>;
}

interface SubmitResponse { ok: boolean; approved: boolean; message: string; enrollment: CrashCourseEnrollment }
interface CertificateResponse { ok: boolean; certificate: { id: string; verifyPath: string }; enrollment: CrashCourseEnrollment }

type SprintState = 'approved' | 'open' | 'locked';

const STATE_STYLE: Record<SprintState, { border: string; color: string; bg: string; label: string }> = {
  approved: { bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.3)', color: '#10b981', label: '✓ Approved' },
  open: { bg: 'rgba(99,102,241,0.12)', border: 'rgba(99,102,241,0.35)', color: '#818cf8', label: '● Open' },
  locked: { bg: 'rgba(100,116,139,0.12)', border: 'rgba(100,116,139,0.3)', color: '#64748b', label: '🔒 Locked' },
};

const inputStyle: React.CSSProperties = {
  padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)',
  background: 'var(--bg2)', color: 'var(--text)', fontSize: 14,
  fontWeight: 600, outline: 'none', width: '100%', boxSizing: 'border-box',
};

const primaryButton = (disabled: boolean): React.CSSProperties => ({
  padding: '10px 20px', borderRadius: 10, border: 'none',
  background: disabled ? 'var(--bg2)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
  color: disabled ? 'var(--t4)' : '#fff', fontSize: 14, fontWeight: 800,
  cursor: disabled ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-display)',
  opacity: disabled ? 0.6 : 1, alignSelf: 'flex-start',
});

const errorMessage = (err: unknown) => (err instanceof Error && err.message ? err.message : 'Something went wrong. Please try again.');

export default function CapstoneInternshipPortal({
  enrollment,
  planTitle,
  studentName,
  lessonsLeft,
  onEnrollmentUpdated,
  onClose,
  sprints = CAPSTONE_SPRINTS,
}: CapstoneInternshipPortalProps) {
  const milestones = (enrollment.milestoneProgress || {}) as CapstoneMilestones;
  const trainingDone = lessonsLeft === 0;
  const current = trainingDone ? nextCapstoneSprint(milestones) : null;
  const approvedCount = sprints.filter((s) => isSprintApproved(milestones, s.sprint)).length;
  const certificateId = enrollment.certificatesIssued?.projectCertHash;

  const [fields, setFields] = useState({ repoUrl: '', designUrl: '', apiUrl: '', liveUrl: '' });
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);

  const setField = (key: keyof typeof fields) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setFields((prev) => ({ ...prev, [key]: e.target.value }));

  const submitSprint = async (sprint: CapstoneSprint) => {
    const payload = sprint === 1 ? { repoUrl: fields.repoUrl, designUrl: fields.designUrl }
      : sprint === 2 ? { apiUrl: fields.apiUrl }
      : { liveUrl: fields.liveUrl };
    setBusy(true);
    setFeedback(null);
    try {
      const res = await api.post<SubmitResponse>('/api/quests/capstone', { enrollmentId: enrollment.enrollmentId, sprint, ...payload });
      onEnrollmentUpdated(res.enrollment);
      setFeedback({ kind: res.approved ? 'ok' : 'error', text: res.message });
    } catch (err) {
      setFeedback({ kind: 'error', text: errorMessage(err) });
    } finally {
      setBusy(false);
    }
  };

  const getCertificate = async () => {
    setBusy(true);
    setFeedback(null);
    try {
      const res = await api.post<CertificateResponse>('/api/certificates/course', { enrollmentId: enrollment.enrollmentId });
      onEnrollmentUpdated(res.enrollment);
      setFeedback({ kind: 'ok', text: `Certificate ${res.certificate.id} issued.` });
    } catch (err) {
      setFeedback({ kind: 'error', text: errorMessage(err) });
    } finally {
      setBusy(false);
    }
  };

  const verifyPath = certificateId ? `/verify/${encodeURIComponent(certificateId)}` : '';
  const verifyUrl = certificateId && typeof window !== 'undefined' ? `${window.location.origin}${verifyPath}` : verifyPath;

  const fieldOf = (sprint: CapstoneSprint) => sprints.find((s) => s.sprint === sprint)?.field;

  const submitted = (sprint: CapstoneSprint): Array<[string, string]> => {
    if (sprint === 1) return [['Repository', milestones.sprint1RepoUrl || ''], [fieldOf(1)?.label || 'Design', milestones.sprint1DesignUrl || '']];
    if (sprint === 2) return [[fieldOf(2)?.label || 'API code', milestones.sprint2ApiUrl || '']];
    if (sprint === 3) return [['Live URL', milestones.sprint3LiveUrl || '']];
    return [['Defense', `${milestones.sprint4DefenseScore ?? 0}% · ${milestones.sprint4Verdict || 'Passed'}`]];
  };

  const renderForm = (sprint: CapstoneSprint) => {
    if (sprint === 4) {
      const last = milestones.sprint4LastAttempt;
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {last && (
            <div style={{ fontSize: 13, color: 'var(--t3)' }}>
              Last attempt: {last.score}% · {last.verdict} (not passed yet)
            </div>
          )}
          <Link href={COURSE_DEFENSE_PATH} style={{ ...primaryButton(false), textDecoration: 'none', display: 'inline-block' }}>
            🎙️ {last ? 'Retake' : 'Start'} capstone defense →
          </Link>
        </div>
      );
    }
    const ready = sprint === 1 ? fields.repoUrl.trim() && fields.designUrl.trim()
      : sprint === 2 ? fields.apiUrl.trim()
      : fields.liveUrl.trim();
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {sprint === 1 && (
          <>
            <input type="url" placeholder="https://github.com/you/your-project" value={fields.repoUrl}
              onChange={setField('repoUrl')} style={inputStyle} aria-label="GitHub repository URL" />
            <input type="url" placeholder={fieldOf(1)?.placeholder || 'https://github.com/you/your-project/blob/main/docs/architecture.md'} value={fields.designUrl}
              onChange={setField('designUrl')} style={inputStyle} aria-label={`${fieldOf(1)?.label || 'Design'} file or folder URL`} />
          </>
        )}
        {sprint === 2 && (
          <input type="url" placeholder={fieldOf(2)?.placeholder || `${milestones.sprint1RepoUrl || 'https://github.com/you/your-project'}/tree/main/src/api`}
            value={fields.apiUrl} onChange={setField('apiUrl')} style={inputStyle} aria-label={`${fieldOf(2)?.label || 'API code'} file or folder URL`} />
        )}
        {sprint === 3 && (
          <input type="url" placeholder="https://your-project.vercel.app" value={fields.liveUrl}
            onChange={setField('liveUrl')} style={inputStyle} aria-label="Live URL" />
        )}
        <button onClick={() => submitSprint(sprint)} disabled={!ready || busy} style={primaryButton(!ready || busy)}>
          {busy ? 'Checking…' : `✓ Check & submit Sprint ${sprint}`}
        </button>
      </div>
    );
  };

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: 24,
    }} aria-modal="true" role="dialog" aria-label={`${planTitle} Capstone`}>
      <div style={{
        maxWidth: 800, width: '100%',
        background: 'var(--bg2)', border: '1px solid var(--border)',
        borderRadius: 20, overflow: 'hidden', display: 'flex', flexDirection: 'column',
        maxHeight: '90vh',
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px', borderBottom: '1px solid var(--border)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: 'linear-gradient(135deg, rgba(var(--brand-rgb),0.12), rgba(var(--success-rgb),0.08))',
          flexShrink: 0,
        }}>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: 'var(--t1)', margin: 0, fontFamily: 'var(--font-display)' }}>
              🏆 {planTitle} Capstone
            </h2>
            <span style={{ fontSize: 13, color: 'var(--t3)' }}>Student: {studentName}</span>
          </div>
          <button onClick={onClose} style={{
            padding: '6px 12px', borderRadius: 8, background: 'var(--bg3)',
            border: '1px solid var(--border)', color: 'var(--t2)', fontSize: 13, fontWeight: 600, cursor: 'pointer',
          }} aria-label="Close capstone">✕ Close</button>
        </div>

        {/* Progress */}
        <div style={{
          padding: '14px 24px', borderBottom: '1px solid var(--border)',
          display: 'flex', gap: 16, alignItems: 'center', flexShrink: 0, flexWrap: 'wrap',
        }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase' }}>Sprints approved:</span>
          <div style={{ flex: 1, minWidth: 120, height: 8, borderRadius: 4, background: 'var(--bg3)', overflow: 'hidden' }}>
            <div style={{
              width: `${(approvedCount / sprints.length) * 100}%`, height: '100%',
              borderRadius: 4, background: 'linear-gradient(90deg, #6366f1, #10b981)', transition: 'width 0.5s ease',
            }} />
          </div>
          <span style={{ fontSize: 14.5, fontWeight: 800, color: 'var(--accent)' }}>{approvedCount}/{sprints.length}</span>
        </div>

        <div style={{ flex: 1, overflow: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {!trainingDone && (
            <div style={{
              padding: 14, borderRadius: 12, background: 'rgba(245,158,11,0.1)',
              border: '1px solid rgba(245,158,11,0.3)', color: '#f59e0b', fontSize: 14, fontWeight: 700,
            }}>
              🔒 The capstone opens after the last lesson of your course ({lessonsLeft} {lessonsLeft === 1 ? 'lesson' : 'lessons'} left).
            </div>
          )}

          {feedback && (
            <div role="status" style={{
              padding: '10px 14px', borderRadius: 10, fontSize: 14, fontWeight: 700,
              background: feedback.kind === 'ok' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.12)',
              border: `1px solid ${feedback.kind === 'ok' ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
              color: feedback.kind === 'ok' ? '#10b981' : '#f87171',
            }}>
              {feedback.kind === 'ok' ? '✓ ' : '⚠️ '}{feedback.text}
            </div>
          )}

          {sprints.map((s) => {
            const state: SprintState = isSprintApproved(milestones, s.sprint) ? 'approved' : current === s.sprint ? 'open' : 'locked';
            const style = STATE_STYLE[state];
            return (
              <div key={s.sprint} style={{
                padding: 18, borderRadius: 14, background: 'var(--bg3)',
                border: `1px solid ${style.border}`, opacity: state === 'locked' ? 0.6 : 1,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 15.5, fontWeight: 900, color: 'var(--t1)' }}>{s.title}</span>
                  <span style={{
                    fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 6,
                    background: style.bg, border: `1px solid ${style.border}`, color: style.color,
                  }}>{style.label}</span>
                </div>
                <p style={{ fontSize: 13, color: 'var(--t3)', margin: '0 0 4px' }}>{s.description}</p>
                <p style={{ fontSize: 12, color: 'var(--t4)', margin: '0 0 10px' }}>How we check: {s.check}</p>

                {state === 'approved' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {submitted(s.sprint).map(([label, value]) => (
                      <div key={label} style={{ fontSize: 13, color: 'var(--t2)', wordBreak: 'break-all' }}>
                        <strong>{label}:</strong>{' '}
                        {value.startsWith('https://')
                          ? <a href={value} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>{value}</a>
                          : value}
                      </div>
                    ))}
                  </div>
                )}
                {state === 'open' && renderForm(s.sprint)}
              </div>
            );
          })}

          {/* Certificate */}
          <div style={{ padding: 18, borderRadius: 14, background: 'var(--bg3)', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: 15.5, fontWeight: 800, color: 'var(--t1)', margin: '0 0 12px', fontFamily: 'var(--font-display)' }}>
              📜 Capstone Project Certificate
            </h3>
            {certificateId ? (
              <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ padding: 8, borderRadius: 8, background: '#fff' }}>
                  <QRCodeSVG value={verifyUrl} size={112} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
                  <div style={{ fontSize: 13, color: 'var(--t3)' }}>Certificate ID</div>
                  <div style={{ fontSize: 16.5, fontWeight: 900, color: 'var(--t1)', fontFamily: 'monospace' }}>{certificateId}</div>
                  <a href={verifyPath} target="_blank" rel="noopener noreferrer" style={{ fontSize: 14, fontWeight: 800, color: 'var(--accent)' }}>
                    Open the public verification page →
                  </a>
                  <div style={{ fontSize: 12, color: 'var(--t4)' }}>Anyone can scan the code or open the link to check it was issued by PinIT.</div>
                </div>
              </div>
            ) : current === null && trainingDone ? (
              <button onClick={getCertificate} disabled={busy} style={primaryButton(busy)}>
                {busy ? 'Issuing…' : '🎓 Get my certificate'}
              </button>
            ) : (
              <p style={{ fontSize: 13, color: 'var(--t3)', margin: 0 }}>
                Your certificate is issued when all four sprints are approved. It gets a unique ID and a public verification page.
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 24px', borderTop: '1px solid var(--border)',
          display: 'flex', justifyContent: 'flex-end', background: 'var(--bg3)', flexShrink: 0,
        }}>
          <button onClick={onClose} style={{
            padding: '10px 24px', borderRadius: 10,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            border: 'none', color: '#fff', fontSize: 14.5, fontWeight: 800, cursor: 'pointer',
            fontFamily: 'var(--font-display)', boxShadow: '0 4px 14px rgba(99,102,241,0.3)',
          }}>
            Close →
          </button>
        </div>
      </div>
    </div>
  );
}
