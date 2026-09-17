'use client';

import React, { useState } from 'react';
import { toast } from '@/lib/store/useAppStore';
import { CertificateItem, TimelineItem } from './usePortfolioData';
import { TimelineCategory, SocraticExamData, modalOverlayStyle, modalContentStyle } from '../types';

interface CertificatesSectionProps {
  certificates: CertificateItem[];
  saveCertificates: (next: CertificateItem[]) => void;
  timeline: TimelineItem[];
  saveTimeline: (next: TimelineItem[]) => void;
  cOS: any;
  user: any;
}

export function CertificatesSection({
  certificates,
  saveCertificates,
  timeline,
  saveTimeline,
  cOS,
  user
}: CertificatesSectionProps) {
  const [docTitle, setDocTitle] = useState('');
  const [docIssuer, setDocIssuer] = useState('');
  const [docCategory, setDocCategory] = useState('Course Certificate');
  const [uploading, setUploading] = useState(false);
  const [showExamModal, setShowExamModal] = useState(false);
  const [examData, setExamData] = useState<SocraticExamData | null>(null);
  const [attempts, setAttempts] = useState(3);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [examFeedback, setExamFeedback] = useState('');
  const [examDone, setExamDone] = useState(false);

  const totalActivity = (cOS?.completedMissions?.length || 0) + (cOS?.completedQuests?.length || 0);
  const hasTag = totalActivity >= 1;

  const handleUploadDocument = async () => {
    if (!docTitle.trim() || !docIssuer.trim()) {
      toast.error('Missing Details', 'Please fill in the document title and issuer.');
      return;
    }

    if (!hasTag) {
      toast.error('Student Tag Locked', 'You must complete at least 1 Coding Mission or Quest to earn the Student Tag before uploading.');
      return;
    }

    if (docCategory !== 'Course Certificate') {
      const newCert: CertificateItem = { id: `c_${Date.now()}`, title: docTitle, issuer: docIssuer, verified: false };
      const nextCerts = [...certificates, newCert];
      saveCertificates(nextCerts);

      const newEvt: TimelineItem = {
        id: `t_evt_${Date.now()}`,
        year: '2026',
        category: docCategory as TimelineCategory,
        title: docTitle,
        detail: `Uploaded portfolio credential issued by ${docIssuer}.`,
        verified: false
      };
      const nextTimeline = [newEvt, ...timeline];
      saveTimeline(nextTimeline);

      toast.success('Document Uploaded', 'Document added to your portfolio. Pending faculty verification.');
      setDocTitle('');
      setDocIssuer('');
      return;
    }

    // Category is Course Certificate: trigger Socratic Exam flow
    setUploading(true);
    try {
      const res = await fetch('/api/portfolio/analyze-certificate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: docTitle, issuer: docIssuer })
      });
      if (!res.ok) throw new Error('Failed to analyze certificate.');
      const data = await res.json();
      setExamData(data);
      setAttempts(3);
      setSelectedAnswers({});
      setExamFeedback('');
      setExamDone(false);
      setShowExamModal(true);
    } catch (err: any) {
      toast.error('Verification Error', err.message || 'Could not launch Socratic Exam.');
    } finally {
      setUploading(false);
    }
  };

  const handleSelectAnswer = (qId: string, optIdx: number) => {
    if (examDone) return;
    setSelectedAnswers(prev => ({ ...prev, [qId]: optIdx }));
  };

  const handleSubmitExam = async () => {
    if (!examData) return;
    const questions = examData.questions || [];
    const answeredCount = Object.keys(selectedAnswers).length;
    if (answeredCount < questions.length) {
      toast.error('Incomplete Exam', 'Please answer all questions before submitting.');
      return;
    }

    setUploading(true);
    try {
      const res = await fetch('/api/portfolio/verify-exam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          examSessionToken: examData.examSessionToken,
          subject: examData.subject,
          answers: selectedAnswers,
          certificateTitle: docTitle,
          issuer: docIssuer
        })
      });
      const result = await res.json();

      if (result.passed) {
        setExamFeedback(`🎉 Assessment Passed! Score: ${result.score}%. Credential recorded as Knowledge Assessed (pending faculty or issuer review).`);
        setExamDone(true);
        const isVerified = Boolean(result.verified);
        const newCert: CertificateItem = result.certificate || {
          id: `c_${Date.now()}`,
          title: docTitle,
          issuer: docIssuer,
          verified: isVerified,
          assessmentPassed: true,
          assessmentScore: result.score,
          verificationStatus: isVerified ? 'VERIFIED' : 'KNOWLEDGE_ASSESSED',
        };
        saveCertificates([...certificates, newCert]);

        const newEvt: TimelineItem = {
          id: `t_evt_${Date.now()}`,
          year: '2026',
          category: 'Certification',
          title: docTitle,
          detail: `Credential subject knowledge assessed via Socratic Exam (${result.score}%). Issued by ${docIssuer}. Status: Pending faculty audit.`,
          verified: isVerified
        };
        saveTimeline([newEvt, ...timeline]);

        toast.success('Assessment Passed', `Great work! Subject knowledge for "${docTitle}" has been assessed.`);
      } else {
        setExamFeedback(`❌ Assessment not passed. Passing threshold (60%) was not met. This single-use session token has been consumed.`);
        setExamDone(true);
        toast.error('Assessment Incomplete', 'Passing threshold was not met. Please review the material and launch a new assessment when ready.');
      }
    } catch {
      toast.error('Submission Error', 'Failed to submit exam. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h3 style={{ margin: '0 0 12px 0', fontSize: 15, fontWeight: 800 }}>Verified Credentials</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {certificates.length === 0 ? (
            <p style={{ fontSize: 13, color: 'var(--t3)', margin: '8px 0' }}>No credentials added yet.</p>
          ) : (
            certificates.map(c => (
              <div key={c.id} style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg3)', padding: 12, borderRadius: 10, border: '1px solid var(--border)' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: 13, fontWeight: 800 }}>{c.title}</h4>
                  <span style={{ fontSize: 11.5, color: 'var(--t3)' }}>Issuer: {c.issuer}</span>
                </div>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: c.verified
                      ? 'var(--green)'
                      : c.assessmentPassed || c.verificationStatus === 'KNOWLEDGE_ASSESSED'
                      ? 'var(--blue, #3b82f6)'
                      : 'var(--amber)'
                  }}
                >
                  {c.verified
                    ? '✓ Verified'
                    : c.assessmentPassed || c.verificationStatus === 'KNOWLEDGE_ASSESSED'
                    ? '⚡ Knowledge Assessed (Pending Audit)'
                    : 'Awaiting Audit'}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Document Upload Center */}
      <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border)', borderRadius: 14, padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: 'var(--t1)' }}>📄 Document Upload Center</h3>
            <p style={{ margin: '2px 0 0 0', fontSize: 12, color: 'var(--t3)' }}>Upload course certificates, internship offer letters, or project files.</p>
          </div>
          <span style={{
            fontSize: 10.5,
            fontWeight: 800,
            padding: '4px 10px',
            borderRadius: 20,
            background: hasTag ? 'rgba(var(--success-deep-rgb), 0.1)' : 'rgba(var(--danger-rgb), 0.1)',
            color: hasTag ? 'var(--green)' : 'var(--coral)',
            border: `1px solid ${hasTag ? 'rgba(var(--success-deep-rgb), 0.2)' : 'rgba(var(--danger-rgb), 0.2)'}`,
            display: 'flex',
            alignItems: 'center',
            gap: 5
          }}>
            {hasTag ? '🎓 STUDENT TAG: ACTIVE' : '🔒 NO STUDENT TAG'}
          </span>
        </div>

        {!hasTag && (
          <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(var(--danger-rgb), 0.04)', border: '1px solid rgba(var(--danger-rgb), 0.15)', fontSize: 12, color: 'var(--t2)', lineHeight: 1.5 }}>
            ⚠️ <strong>Upload Restriction</strong>: Portfolio uploads require a **Student Tag**. Complete at least **1 Daily Mission or Quest** to activate your student tag.
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase' }}>Document Category</label>
            <select
              value={docCategory}
              onChange={e => setDocCategory(e.target.value)}
              disabled={!hasTag}
              style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 8, padding: 8, color: 'var(--t1)', fontSize: 12.5, outline: 'none' }}
            >
              <option value="Course Certificate">🎓 Course Certificate (Requires Socratic Exam)</option>
              <option value="Project Document">📂 Project Technical Document</option>
              <option value="Internship Offer / Letter">🏢 Internship PPO / Offer Letter</option>
              <option value="Other Academic Cert">📜 Other Academic Certificate</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase' }}>Document Title</label>
            <input
              type="text"
              placeholder="e.g. Advanced React & Redux Specialization"
              value={docTitle}
              onChange={e => setDocTitle(e.target.value)}
              disabled={!hasTag}
              style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 8, padding: 8, color: 'var(--t1)', fontSize: 12.5, outline: 'none' }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase' }}>Issuing Authority</label>
            <input
              type="text"
              placeholder="e.g. Coursera / Google"
              value={docIssuer}
              onChange={e => setDocIssuer(e.target.value)}
              disabled={!hasTag}
              style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 8, padding: 8, color: 'var(--t1)', fontSize: 12.5, outline: 'none' }}
            />
          </div>
        </div>

        <button
          onClick={handleUploadDocument}
          disabled={!hasTag || uploading}
          style={{ alignSelf: 'flex-start', padding: '8px 20px', fontSize: 12, fontWeight: 800, background: 'var(--accent)', color: 'var(--text)', border: 'none', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
        >
          {uploading ? '⏳ Analyzing Credentials...' : 'Upload & Verify Credentials ✓'}
        </button>
      </div>

      {/* Socratic Exam Modal */}
      {showExamModal && examData && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle} className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: 'var(--t1)', fontFamily: 'var(--font-display)' }}>
                  🧠 Socratic Verification Exam
                </h3>
                <span style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 700 }}>
                  Subject: {examData.subject}
                </span>
              </div>
              <span style={{
                fontSize: 11,
                fontWeight: 800,
                padding: '4px 10px',
                borderRadius: 12,
                background: attempts > 1 ? 'rgba(255,255,255,0.03)' : 'rgba(var(--danger-rgb), 0.1)',
                color: attempts > 1 ? 'var(--t2)' : 'var(--coral)',
                border: '1px solid var(--border)'
              }}>
                Attempts Left: {attempts}/3
              </span>
            </div>

            <div style={{ fontSize: 12.5, color: 'var(--t2)', lineHeight: 1.5, background: 'rgba(255,255,255,0.02)', padding: 12, borderRadius: 10, border: '1px solid var(--border)' }}>
              📄 <strong>Credential:</strong> "{docTitle}" by {docIssuer}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxHeight: '320px', overflowY: 'auto', paddingRight: 4 }}>
              {(examData.questions || []).map((q, qIdx) => (
                <div key={q.id} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)' }}>
                    {qIdx + 1}. {q.question}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {(q.options || []).map((opt, oIdx) => (
                      <label
                        key={oIdx}
                        onClick={() => handleSelectAnswer(q.id, oIdx)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          padding: '8px 12px',
                          borderRadius: 8,
                          background: selectedAnswers[q.id] === oIdx ? 'var(--accent-light)' : 'var(--bg3)',
                          border: `1px solid ${selectedAnswers[q.id] === oIdx ? 'var(--accent)' : 'var(--border)'}`,
                          cursor: examDone ? 'default' : 'pointer',
                          fontSize: 12.5,
                          color: selectedAnswers[q.id] === oIdx ? 'var(--t1)' : 'var(--t2)'
                        }}
                      >
                        <input
                          type="radio"
                          name={`q_${q.id}`}
                          checked={selectedAnswers[q.id] === oIdx}
                          onChange={() => {}}
                          disabled={examDone}
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {examFeedback && (
              <div style={{
                padding: '10px 14px',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 600,
                background: examDone && attempts > 0 ? 'var(--green-light)' : 'rgba(var(--danger-rgb), 0.1)',
                color: examDone && attempts > 0 ? 'var(--green)' : 'var(--coral)',
                border: '1px solid var(--border)'
              }}>
                {examFeedback}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, borderTop: '1px solid var(--border)', paddingTop: 14 }}>
              <button
                onClick={() => setShowExamModal(false)}
                style={{ padding: '8px 16px', borderRadius: 8, background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--t2)', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
              >
                {examDone ? 'Close' : 'Cancel'}
              </button>
              {!examDone && (
                <button
                  onClick={handleSubmitExam}
                  disabled={uploading}
                  style={{ padding: '8px 20px', borderRadius: 8, background: 'var(--accent)', color: 'var(--text)', border: 'none', fontSize: 12, fontWeight: 800, cursor: 'pointer' }}
                >
                  {uploading ? 'Grading...' : 'Submit Answers ✓'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
