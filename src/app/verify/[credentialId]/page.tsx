'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { CompetencyEvidenceRecord, StudentSkillProfile, DynamicRoleReadiness } from '@/lib/pathway/competencySchema';

export default function PublicVerifyCredentialPage() {
  const params = useParams();
  const credentialId = (params?.credentialId as string) || '';

  const [loading, setLoading] = useState<boolean>(true);
  const [isValid, setIsValid] = useState<boolean>(false);
  const [evidenceRecord, setEvidenceRecord] = useState<CompetencyEvidenceRecord | null>(null);
  const [studentProfile, setStudentProfile] = useState<StudentSkillProfile | null>(null);
  const [roleReadiness, setRoleReadiness] = useState<DynamicRoleReadiness | null>(null);
  const [transcript, setTranscript] = useState<any>(null);
  const [document, setDocument] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadAndVerify() {
      setLoading(true);
      setErrorMessage(null);
      try {
        const res = await fetch(`/api/verify/${encodeURIComponent(credentialId)}`);
        const data = await res.json();
        if (res.ok && data.valid) {
          setIsValid(true);
          setEvidenceRecord(data.evidenceRecord || null);
          setStudentProfile(data.studentProfile || null);
          setRoleReadiness(data.roleReadiness || null);
          setTranscript(data.transcript || null);
          setDocument(data.document || null);
        } else {
          setIsValid(false);
          setEvidenceRecord(null);
          setStudentProfile(null);
          setRoleReadiness(null);
          setTranscript(null);
          setDocument(null);
          setErrorMessage(data.message || data.error || 'Verification failed: Credential not recognized or signature invalid.');
        }
      } catch (err: any) {
        setIsValid(false);
        setEvidenceRecord(null);
        setStudentProfile(null);
        setRoleReadiness(null);
        setTranscript(null);
        setDocument(null);
        setErrorMessage(err?.message || 'Network error connecting to verification gateway.');
      } finally {
        setLoading(false);
      }
    }

    if (credentialId) {
      loadAndVerify();
    } else {
      setLoading(false);
      setEvidenceRecord(null);
      setStudentProfile(null);
      setRoleReadiness(null);
      setIsValid(false);
      setErrorMessage('No credential identifier specified. Please provide a valid credential ID in the URL.');
    }
  }, [credentialId]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary, #090d16)', color: 'var(--text)', padding: '40px 20px', fontFamily: 'system-ui, -apple-system, sans-serif', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 760 }}>
        {/* Verification Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 20, background: 'rgba(var(--brand-rgb),  0.1)', border: '1px solid rgba(var(--brand-rgb),  0.2)', marginBottom: 12 }}>
            <span style={{ fontSize: 16 }}>🛡️</span>
            <span style={{ fontSize: 12, fontWeight: 800, color: '#a5b4fc', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              PinIT Competency Verification Gateway
            </span>
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 900, margin: '0 0 8px 0', letterSpacing: '-0.5px' }}>
            Official Competency Transcript Verification
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>
            Server-authoritative HMAC-SHA256 signature and evidence ledger verification.
          </p>
        </div>

        {loading ? (
          <div style={{ padding: 48, textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: 24, marginBottom: 12 }}>⏳</div>
            <div style={{ fontSize: 15, fontWeight: 700 }}>Verifying Credential with Evidence Gateway...</div>
          </div>
        ) : (
          <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
            {/* Status Header Banner */}
            <div style={{
              padding: '24px 32px',
              background: isValid ? 'rgba(var(--success-rgb),  0.1)' : 'rgba(var(--danger-rgb),  0.1)',
              borderBottom: isValid ? '1px solid rgba(var(--success-rgb),  0.2)' : '1px solid rgba(var(--danger-rgb),  0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{ fontSize: 32 }}>{isValid ? '✅' : '❌'}</span>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: isValid ? 'var(--success-bright)' : 'var(--danger-bright)' }}>
                    {isValid ? 'AUTHENTIC VERIFIED CREDENTIAL' : 'VERIFICATION FAILED'}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    {isValid ? 'Server-validated HMAC-SHA256 signature matches authoritative evidence ledger.' : (errorMessage || 'Hash mismatch or record not found.')}
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>SEAL STATUS</span>
                <div style={{ fontSize: 13, fontWeight: 800, color: isValid ? 'var(--success-bright)' : 'var(--danger-bright)' }}>
                  {isValid ? 'SEALED & VALID' : 'UNVERIFIED'}
                </div>
              </div>
            </div>

            {/* Credential Details */}
            <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div style={{ padding: 14, borderRadius: 10, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>Credential ID</div>
                  <div style={{ fontSize: 13, fontWeight: 700, fontFamily: 'monospace', color: 'var(--text-muted)', wordBreak: 'break-all' }}>
                    {credentialId}
                  </div>
                </div>

                <div style={{ padding: 14, borderRadius: 10, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>Issuing Institution</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)' }}>
                    PinIT Career OS Academy
                  </div>
                </div>
              </div>

              {/* Official Academic Transcript Details */}
              {transcript && (
                <div style={{ padding: 22, borderRadius: 12, background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: 'var(--success-bright)' }}>
                        🎓 Official Academic Examination Transcript
                      </h3>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                        {transcript.institution} • {transcript.program}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>CUMULATIVE CGPA</div>
                      <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--success-bright)' }}>{transcript.cgpa} / 10</div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: 13, padding: 12, borderRadius: 8, background: 'rgba(255,255,255,0.03)', marginBottom: 14 }}>
                    <div>Candidate: <strong>{transcript.studentName}</strong></div>
                    <div>Register No: <strong>{transcript.registerNumber}</strong></div>
                  </div>

                  {Array.isArray(transcript.results) && transcript.results.length > 0 && (
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, marginBottom: 12 }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left', color: 'var(--text-muted)' }}>
                          <th style={{ padding: '6px 4px' }}>Code</th>
                          <th style={{ padding: '6px 4px' }}>Course</th>
                          <th style={{ padding: '6px 4px', textAlign: 'center' }}>Grade</th>
                          <th style={{ padding: '6px 4px', textAlign: 'right' }}>Credits</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transcript.results.map((r: any, idx: number) => (
                          <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <td style={{ padding: '8px 4px', fontFamily: 'monospace' }}>{r.code}</td>
                            <td style={{ padding: '8px 4px' }}>{r.course}</td>
                            <td style={{ padding: '8px 4px', textAlign: 'center', fontWeight: 700, color: 'var(--success-bright)' }}>{r.grade}</td>
                            <td style={{ padding: '8px 4px', textAlign: 'right', fontWeight: 700 }}>{r.credits || (r.code?.includes('LAB') ? 2.0 : 4.0)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, color: 'var(--text-muted)' }}>
                    <span>Verification ID: <code style={{ color: '#38bdf8' }}>{transcript.verificationId}</code></span>
                    <span style={{ color: 'var(--success-bright)', fontWeight: 700 }}>✓ Digitally Sealed by Exam Cell</span>
                  </div>
                </div>
              )}

              {/* Institutional Document Details (if official certificate) */}
              {document && (
                <div style={{ padding: 24, borderRadius: 16, background: 'rgba(30, 58, 138, 0.08)', border: '1px solid rgba(59, 130, 246, 0.3)', marginBottom: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 14, marginBottom: 16 }}>
                    <div>
                      <div style={{ fontSize: 11, color: '#60a5fa', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5 }}>OFFICIAL INSTITUTIONAL RECORD</div>
                      <h2 style={{ fontSize: 18, fontWeight: 900, margin: '4px 0 0', color: 'var(--text)' }}>{document.documentType}</h2>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{document.institution}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>STATUS</div>
                      <span style={{ display: 'inline-block', padding: '3px 8px', borderRadius: 4, background: 'rgba(34, 197, 94, 0.15)', color: '#4ade80', fontSize: 12, fontWeight: 800 }}>
                        ✓ {document.status}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 13, padding: 14, borderRadius: 8, background: 'rgba(255,255,255,0.03)', marginBottom: 16 }}>
                    <div>Candidate: <strong>{document.studentName}</strong></div>
                    <div>Register No: <strong>{document.registerNumber}</strong></div>
                    <div>Department: <strong>{document.department}</strong></div>
                    <div>Academic Year: <strong>{document.academicYear}</strong></div>
                  </div>

                  <div style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--text-muted)', padding: '10px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.02)', marginBottom: 16 }}>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 2 }}>Designated Purpose</div>
                    <div style={{ color: 'var(--text)' }}><em>"{document.purpose}"</em></div>
                  </div>

                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, color: 'var(--text-muted)' }}>
                    <span>Verification Ref: <code style={{ color: '#38bdf8' }}>{document.verificationId}</code></span>
                    <span style={{ color: 'var(--success-bright)', fontWeight: 700 }}>🛡️ Certified by Office of the Registrar</span>
                  </div>
                </div>
              )}

              {/* Evidence Record Details (if single evidence) */}
              {evidenceRecord && (
                <div style={{ padding: 18, borderRadius: 12, background: 'rgba(79, 70, 229, 0.05)', border: '1px solid rgba(79, 70, 229, 0.15)' }}>
                  <h3 style={{ margin: '0 0 12px 0', fontSize: 15, fontWeight: 700, color: '#a5b4fc' }}>
                    🎯 Verified Competency Milestone
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 13 }}>
                    <div><span style={{ color: 'var(--text-muted)' }}>Competency:</span> <strong>{evidenceRecord.competencyId}</strong></div>
                    <div><span style={{ color: 'var(--text-muted)' }}>Score:</span> <strong style={{ color: 'var(--success-bright)' }}>{evidenceRecord.score}/100</strong></div>
                    <div><span style={{ color: 'var(--text-muted)' }}>Evidence Class:</span> <strong style={{ textTransform: 'uppercase' }}>{evidenceRecord.evidenceClass}</strong></div>
                    <div><span style={{ color: 'var(--text-muted)' }}>Evaluator:</span> <strong>{evidenceRecord.evaluatorType} ({evidenceRecord.evaluatorVersion})</strong></div>
                  </div>

                  <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>HMAC-SHA256 SIGNATURE / INTEGRITY HASH</div>
                    <code style={{ fontSize: 11, color: '#38bdf8', wordBreak: 'break-all' }}>
                      {evidenceRecord.integrityHash}
                    </code>
                  </div>
                </div>
              )}

              {/* Student Profile Overview (if full transcript or candidate in training) */}
              {studentProfile && (
                <div>
                  {(studentProfile as any).studentName && (
                    <div style={{ marginBottom: 16, padding: '12px 16px', borderRadius: 10, background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.25)' }}>
                      <div style={{ fontSize: 11, color: '#818cf8', fontWeight: 800, textTransform: 'uppercase' }}>CANDIDATE IN TRAINING</div>
                      <div style={{ fontSize: 16, fontWeight: 900, color: '#ffffff', marginTop: 2 }}>{(studentProfile as any).studentName}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{(studentProfile as any).institution} • {(studentProfile as any).targetRole}</div>
                    </div>
                  )}
                  <h3 style={{ margin: '0 0 12px 0', fontSize: 15, fontWeight: 700 }}>
                    📜 Verified Skills Transcript ({(studentProfile.verified || []).length} Verified)
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {(studentProfile.verified || []).map((s: any) => (
                      <span key={s.id} style={{ padding: '6px 12px', borderRadius: 6, background: 'rgba(var(--success-rgb),  0.12)', border: '1px solid rgba(var(--success-rgb),  0.25)', color: 'var(--success-bright)', fontSize: 12, fontWeight: 700 }}>
                        ✓ {s.name} ({s.score} pts)
                      </span>
                    ))}
                    {(!studentProfile.verified || studentProfile.verified.length === 0) && (
                      <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                        Candidate is actively enrolled in good standing. Foundational checkpoints in progress.
                      </span>
                    )}
                  </div>

                  {roleReadiness && (
                    <div style={{ marginTop: 16, padding: 14, borderRadius: 10, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Placement Readiness Stage</div>
                        <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text)', textTransform: 'uppercase' }}>
                          {roleReadiness.status.replace(/_/g, ' ')}
                        </div>
                      </div>
                      {roleReadiness.capstoneDefenseScore && (
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Oral Defense Score</div>
                          <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--success-bright)' }}>
                            🎙️ {roleReadiness.capstoneDefenseScore}/100
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 12 }}>
                <Link
                  href="/quests?tab=passport"
                  style={{ padding: '10px 20px', borderRadius: 8, background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', color: 'var(--text)', fontSize: 13, textDecoration: 'none', fontWeight: 700 }}
                >
                  View Full Career Passport →
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
