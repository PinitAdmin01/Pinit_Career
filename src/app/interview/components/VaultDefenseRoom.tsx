'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { AnimState } from '@/components/avatar/VRoidAvatarEngine';
import { speakWithAvatar, stopSpeaking } from '@/lib/tts';
import { api } from '@/lib/api/client';
import { toast } from '@/lib/store/useAppStore';
import {
  type VaultDefenseChallenge,
  type VaultDefenseResult,
  resolveVaultAuditorMentor,
  getActiveUserMentorId,
  generateBrutalDefensePrompt,
  evaluateVaultDefenseResponses,
  clearPendingVaultDefense,
  extractSkillsFast,
} from '@/lib/vault/vaultDefenseEngine';
import {
  applyTrustReward,
  applyVaultRejectionPenalty,
  recordCheatingIncident,
} from '@/lib/trust/trustEngine';
import { recordMetricLedgerEntry } from '@/lib/telemetry/metricsLedger';

const VRoidInterviewAvatar = dynamic(
  () => import('@/components/avatar/VRoidInterviewAvatar'),
  { ssr: false }
);

interface VaultDefenseRoomProps {
  user: any;
  cOS: any;
  docId: string | null;
  initialChallenge: VaultDefenseChallenge | null;
}

export const VaultDefenseRoom: React.FC<VaultDefenseRoomProps> = ({
  user,
  cOS,
  docId,
  initialChallenge,
}) => {
  const router = useRouter();
  const [challenge, setChallenge] = useState<VaultDefenseChallenge | null>(() => initialChallenge);
  const [started, setStarted] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [messages, setMessages] = useState<Array<{ role: 'assistant' | 'user'; content: string }>>([]);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [answerInput, setAnswerInput] = useState('');
  const [animState, setAnimState] = useState<AnimState>('idle');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<VaultDefenseResult | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [tabWarnings, setTabWarnings] = useState(0);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const sessionIdRef = useRef<string>(`vault_defense_${docId || 'doc'}_${Date.now()}`);

  // Fallback reconstruction if page reloaded directly with ?mode=vault_verify&docId=...
  useEffect(() => {
    if (challenge) return;
    const vaultItem = docId ? (cOS?.vaultItems || []).find((i: any) => i.id === docId) : null;
    const activeMentorId = getActiveUserMentorId(user);
    const auditor = resolveVaultAuditorMentor(activeMentorId);
    if (vaultItem) {
      const skills = extractSkillsFast(
        `${vaultItem.title} ${vaultItem.description || ''}`,
        vaultItem.skill_tags
      );
      setChallenge({
        docId: vaultItem.id,
        userId: user?.id,
        title: vaultItem.title || 'Uploaded Credential',
        itemType: vaultItem.item_type || 'resume',
        organizationName: vaultItem.organization_name,
        claimedSkills: skills.length > 0 ? skills : ['System Design', 'Problem Solving'],
        auditor,
        createdAt: new Date().toISOString(),
      });
    }
  }, [challenge, docId, cOS?.vaultItems, user]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Anti-Cheating Proctoring: Deduct -2 once per session if user switches tabs during brutal defense
  useEffect(() => {
    if (!started || result) return;
    const onVisibility = () => {
      if (typeof document !== 'undefined' && document.visibilityState === 'hidden') {
        setTabWarnings((c) => c + 1);
        recordCheatingIncident(
          user?.id,
          sessionIdRef.current,
          'interview',
          'vault_defense_tab_switch'
        ).catch(() => {});
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [started, result, user?.id]);

  useEffect(() => {
    return () => {
      stopSpeaking();
      try {
        recognitionRef.current?.stop();
      } catch {}
    };
  }, []);

  const startDefense = () => {
    if (!challenge) return;
    setStarted(true);
    setQuestionIndex(0);
    setUserAnswers([]);
    const q1 = generateBrutalDefensePrompt(challenge, 0);
    setMessages([{ role: 'assistant', content: q1 }]);
    speakWithAvatar(
      q1,
      challenge.auditor.id,
      () => setAnimState('talking'),
      () => setAnimState('idle')
    );
  };

  const toggleVoiceMic = () => {
    if (typeof window === 'undefined') return;
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      toast.error('Voice Input Unavailable', 'Please type your defense response in the box below.');
      return;
    }
    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      setIsListening(false);
      return;
    }
    try {
      const rec = new SpeechRec();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';
      rec.onstart = () => setIsListening(true);
      rec.onresult = (ev: any) => {
        const transcript = ev.results?.[0]?.[0]?.transcript || '';
        if (transcript) {
          setAnswerInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
      };
      rec.onerror = () => setIsListening(false);
      rec.onend = () => setIsListening(false);
      recognitionRef.current = rec;
      rec.start();
    } catch {
      setIsListening(false);
    }
  };

  const finalizeDefense = async (allAnswers: string[]) => {
    if (!challenge) return;
    setIsSubmitting(true);
    setAnimState('thinking');

    const evalRes = evaluateVaultDefenseResponses(challenge.claimedSkills, allAnswers);

    try {
      await api
        .post('/api/vault/verify-defense', {
          docId: challenge.docId,
          passed: evalRes.passed,
          score: evalRes.score,
          auditorName: challenge.auditor.name,
          claimedSkills: challenge.claimedSkills,
        })
        .catch(() => null);

      if (evalRes.passed) {
        cOS?.updateVaultItem?.(challenge.docId, {
          verified: true,
          ai_confidence_score: evalRes.score,
          used_in_portfolio: true,
        });
        await applyTrustReward(
          user?.id,
          'vault_verified',
          undefined,
          `Verified Vault Defense (${challenge.title}) by ${challenge.auditor.name}`
        );
        if (typeof cOS?.addVerifiedSkills === 'function') {
          cOS.addVerifiedSkills(challenge.claimedSkills, challenge.title);
        }
        recordMetricLedgerEntry(user?.id, {
          metric: 'mentality',
          feature: 'vault',
          action: `Survived Brutal Defense · Stabilizer & Pattern Hunter`,
          delta: 6,
          previousValue: 0,
          valueAfter: 6,
          mentalityTag: 'Stabilizer',
        });
      } else {
        cOS?.updateVaultItem?.(challenge.docId, {
          verified: false,
          ai_confidence_score: evalRes.score,
        });
        // Track local rejection marker so UI shows Rejected badge clearly
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(
              `pinit_vault_audit_status_${challenge.docId}`,
              JSON.stringify({ status: 'rejected', score: evalRes.score, auditor: challenge.auditor.name })
            );
          } catch {}
        }
        await applyVaultRejectionPenalty(
          user?.id,
          undefined,
          `Failed Skill Defense: Fake/Unsubstantiated "${challenge.title}"`
        );
      }
      clearPendingVaultDefense(challenge.docId);
    } finally {
      setResult(evalRes);
      setIsSubmitting(false);
      const closingSpeech = evalRes.passed
        ? `Respect. You backed up every claim on "${challenge.title}" with real engineering depth. I have marked your credential Verified, awarded +5 Trust Score, and pushed ${evalRes.verifiedSkillsAdded.length} verified skills to your Student Portfolio.`
        : `Rejected. Your answers did not prove genuine mastery of "${challenge.title}". Fake or unverified resume claims cost -5 Trust Score. Come back only when you actually understand these skills.`;
      setMessages((prev) => [...prev, { role: 'assistant', content: closingSpeech }]);
      speakWithAvatar(
        closingSpeech,
        challenge.auditor.id,
        () => setAnimState('talking'),
        () => setAnimState('idle')
      );
    }
  };

  const handleSubmitAnswer = async () => {
    const trimmed = answerInput.trim();
    if (!trimmed || !challenge || isSubmitting || result) return;

    stopSpeaking();
    setAnswerInput('');
    const nextAnswers = [...userAnswers, trimmed];
    setUserAnswers(nextAnswers);
    setMessages((prev) => [...prev, { role: 'user', content: trimmed }]);

    if (nextAnswers.length >= 3) {
      await finalizeDefense(nextAnswers);
      return;
    }

    const nextIdx = questionIndex + 1;
    setQuestionIndex(nextIdx);
    const nextQuestion = generateBrutalDefensePrompt(challenge, nextIdx);

    setMessages((prev) => [...prev, { role: 'assistant', content: nextQuestion }]);
    speakWithAvatar(
      nextQuestion,
      challenge.auditor.id,
      () => setAnimState('talking'),
      () => setAnimState('idle')
    );
  };

  if (!challenge) {
    return (
      <div style={{ maxWidth: 680, margin: '60px auto', padding: 28, borderRadius: 20, background: 'var(--card)', border: '1px solid var(--border)', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, marginBottom: 8 }}>
          Vault Defense Document Not Found
        </h2>
        <p style={{ color: 'var(--t2)', fontSize: 14, marginBottom: 20 }}>
          Upload your Resume or Certificate in the Proof Vault first, then launch a Brutal Defense Room from the asset card.
        </p>
        <Link href="/vault" className="btn-primary" style={{ textDecoration: 'none' }}>
          Go to Proof Vault
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1120, margin: '0 auto', padding: '16px 12px 48px' }} className="animate-fade-in">
      {/* Top Brutal Defense Room Banner */}
      <div
        style={{
          borderRadius: 18,
          padding: '16px 22px',
          marginBottom: 20,
          background: 'linear-gradient(135deg, rgba(239,68,68,0.12), rgba(15,23,42,0.85))',
          border: '1px solid rgba(239,68,68,0.35)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 14,
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, padding: '3px 9px', borderRadius: 99, background: 'rgba(239,68,68,0.2)', color: '#f87171', border: '1px solid rgba(239,68,68,0.4)', fontFamily: 'var(--font-mono)' }}>
              🔥 ADVERSARIAL CREDENTIAL DEFENSE ROOM
            </span>
            <span style={{ fontSize: 11.5, color: 'var(--t3)', fontFamily: 'var(--font-mono)' }}>
              Auditor: <strong style={{ color: 'var(--t1)' }}>{challenge.auditor.name}</strong>
            </span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 21, fontWeight: 800, margin: 0, color: 'var(--t1)' }}>
            Verifying: {challenge.title}
          </h1>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
            {challenge.claimedSkills.map((sk) => (
              <span key={sk} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 6, background: 'rgba(99,102,241,0.14)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.3)', fontFamily: 'var(--font-mono)' }}>
                {sk}
              </span>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {tabWarnings > 0 && (
            <span style={{ fontSize: 11.5, padding: '4px 10px', borderRadius: 8, background: 'rgba(245,158,11,0.15)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.3)', fontWeight: 700 }}>
              ⚠️ {tabWarnings} Tab Switch Flagged
            </span>
          )}
          <button
            type="button"
            onClick={() => router.push('/vault')}
            className="btn-ghost btn-sm"
          >
            ← Back to Vault
          </button>
        </div>
      </div>

      {/* Main Split Grid: 3D Auditor Avatar + Interrogation Feed */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 340px) 1fr', gap: 20, alignItems: 'stretch' }}>
        {/* Left: Live 3D Auditor Card */}
        <div
          style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 18,
            padding: 18,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 8px 24px rgba(0,0,0,0.28)',
          }}
        >
          <div style={{ width: '100%', textAlign: 'center' }}>
            <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.2, color: '#f87171', fontFamily: 'var(--font-mono)', fontWeight: 700, marginBottom: 6 }}>
              Cross-Mentor Auditor ({challenge.auditor.gender === 'male' ? 'Opposite Male Auditor' : 'Opposite Female Auditor'})
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800, color: 'var(--t1)' }}>
              {challenge.auditor.name}
            </div>
            <div style={{ fontSize: 12, color: 'var(--t3)', marginBottom: 12 }}>
              {challenge.auditor.title}
            </div>
          </div>

          <div style={{ width: 260, height: 280, borderRadius: 16, overflow: 'hidden', background: 'radial-gradient(circle at center, rgba(99,102,241,0.14), rgba(10,15,30,0.85))', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <VRoidInterviewAvatar
              teacherId={challenge.auditor.id}
              animState={animState}
              zoom={1.5}
            />
          </div>

          <div style={{ width: '100%', marginTop: 14, padding: 12, borderRadius: 12, background: 'var(--bg2)', border: '1px solid var(--border)', fontSize: 12, color: 'var(--t2)' }}>
            <div style={{ fontWeight: 700, color: 'var(--t1)', marginBottom: 4 }}>Stakes for This Room:</div>
            <div>• Pass Defense (&ge;65%): <strong style={{ color: 'var(--green)' }}>+5 Trust Score</strong> + All skills pushed to Portfolio</div>
            <div>• Fail / Fake Claims: <strong style={{ color: 'var(--coral)' }}>-5 Trust Score</strong> + Document flagged Rejected</div>
          </div>
        </div>

        {/* Right: Interrogation Feed or Launch/Result View */}
        <div
          style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 18,
            padding: 20,
            display: 'flex',
            flexDirection: 'column',
            minHeight: 480,
            boxShadow: '0 8px 24px rgba(0,0,0,0.28)',
          }}
        >
          {!started ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 24 }}>
              <div style={{ fontSize: 44, marginBottom: 12 }}>{challenge.auditor.emoji}</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, color: 'var(--t1)', marginBottom: 8 }}>
                Ready to Defend &ldquo;{challenge.title}&rdquo;?
              </h2>
              <p style={{ color: 'var(--t2)', fontSize: 14, maxWidth: 520, lineHeight: 1.6, marginBottom: 20 }}>
                Because your primary AI Mentor cannot vouch for your own uploaded claims, <strong>{challenge.auditor.name}</strong> has entered the room to grill you ruthlessly across 3 technical & practical questions on your claimed skills.
              </p>
              <button
                type="button"
                data-testid="start-vault-defense-btn"
                onClick={startDefense}
                className="btn-primary"
                style={{ padding: '12px 26px', fontSize: 15, fontWeight: 800 }}
              >
                ⚔️ Enter Brutal Interrogation (Question 1 of 3)
              </button>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, borderBottom: '1px solid var(--border)', marginBottom: 14 }}>
                <div style={{ fontSize: 12.5, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--t2)' }}>
                  LIVE INTERROGATION · QUESTION {Math.min(3, userAnswers.length + 1)} OF 3
                </div>
                <div style={{ fontSize: 11.5, color: 'var(--t3)' }}>
                  {result ? 'Audit Complete' : 'Proctored Session · No Tab Switching'}
                </div>
              </div>

              {/* Conversation history */}
              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12, paddingRight: 4, maxHeight: 340 }}>
                {messages.map((m, idx) => (
                  <div
                    key={idx}
                    style={{
                      alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                      maxWidth: '88%',
                      padding: '12px 15px',
                      borderRadius: 14,
                      background: m.role === 'user' ? 'rgba(99,102,241,0.18)' : 'var(--bg2)',
                      border: `1px solid ${m.role === 'user' ? 'rgba(99,102,241,0.4)' : 'var(--border)'}`,
                      color: 'var(--t1)',
                      fontSize: 13.5,
                      lineHeight: 1.55,
                    }}
                  >
                    <div style={{ fontSize: 10.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 4, color: m.role === 'user' ? '#a5b4fc' : '#f87171', fontFamily: 'var(--font-mono)' }}>
                      {m.role === 'user' ? 'You (Candidate)' : challenge.auditor.name}
                    </div>
                    {m.content}
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Result Scorecard OR Input Controls */}
              {result ? (
                <div
                  data-testid="vault-defense-result"
                  style={{
                    marginTop: 16,
                    padding: 18,
                    borderRadius: 14,
                    background: result.passed ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                    border: `1px solid ${result.passed ? 'rgba(34,197,94,0.35)' : 'rgba(239,68,68,0.35)'}`,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, flexWrap: 'wrap', gap: 8 }}>
                    <div style={{ fontSize: 17, fontWeight: 800, color: result.passed ? 'var(--green)' : '#f87171' }}>
                      {result.passed ? '✓ DEFENSE PASSED — CREDENTIAL VERIFIED' : '✕ DEFENSE FAILED — CLAIMS UNSUBSTANTIATED'}
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 800, color: result.passed ? 'var(--green)' : '#f87171' }}>
                      Score: {result.score}/100 ({result.trustDelta > 0 ? `+${result.trustDelta}` : result.trustDelta} Trust Score)
                    </div>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--t2)', margin: '0 0 12px' }}>{result.critique}</p>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <Link href="/vault" className="btn-primary btn-sm" style={{ textDecoration: 'none' }}>
                      ← Return to Proof Vault & Ledger
                    </Link>
                    <Link href="/profile?tab=portfolio" className="btn-ghost btn-sm" style={{ textDecoration: 'none' }}>
                      👤 View Synced Portfolio Skills
                    </Link>
                  </div>
                </div>
              ) : (
                <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <textarea
                    data-testid="vault-defense-answer-input"
                    value={answerInput}
                    onChange={(e) => setAnswerInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmitAnswer();
                      }
                    }}
                    placeholder="Defend your skill with concrete mechanisms, edge cases, complexity, or real implementation details..."
                    rows={3}
                    className="form-input"
                    style={{ width: '100%', resize: 'vertical', fontSize: 13.5 }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                    <button
                      type="button"
                      onClick={toggleVoiceMic}
                      className="btn-ghost btn-sm"
                    >
                      {isListening ? '⏹️ Stop Mic' : '🎤 Answer by Voice'}
                    </button>
                    <button
                      type="button"
                      data-testid="vault-defense-submit-btn"
                      onClick={handleSubmitAnswer}
                      disabled={!answerInput.trim() || isSubmitting}
                      className="btn-primary btn-sm"
                    >
                      {isSubmitting ? 'Auditing...' : userAnswers.length >= 2 ? 'Submit Final Defense Answer' : 'Submit Answer →'}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
