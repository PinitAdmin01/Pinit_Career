'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { AnimState } from '@/components/avatar/VRoidAvatarEngine';
import { api } from '@/lib/api/client';
import { unlockSpeechSynthesis } from '@/lib/interview/voiceActivity';
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
import { InterviewSessionHeader } from './InterviewSessionHeader';
import { InterviewVoiceHud } from './InterviewVoiceHud';
import { Round1Behavioral } from './Round1Behavioral';
import { useInterviewVoice } from '../hooks/useInterviewVoice';
import { useInterviewGaze } from '../hooks/useInterviewGaze';
import type { AvatarTeacher, Message } from '../interviewTypes';

interface VaultDefenseRoomProps {
  user: any;
  cOS: any;
  docId: string | null;
  initialChallenge: VaultDefenseChallenge | null;
}

function buildVaultPromptContext(challenge: VaultDefenseChallenge): string {
  const lines: string[] = [
    `Document Title: ${challenge.title}`,
    `Document Category: ${challenge.itemType}`,
  ];
  if (challenge.organizationName && challenge.organizationName !== 'Academic Institution') {
    lines.push(`Organization / Issuer: ${challenge.organizationName}`);
  }
  if (challenge.claimedSkills.length > 0) {
    lines.push(`Real Extracted Skills & Tools: ${challenge.claimedSkills.join(', ')}`);
  }
  if (challenge.projects && challenge.projects.length > 0) {
    lines.push(
      `Real Extracted Projects & Experience:\n${challenge.projects
        .map((p) => `- ${p.name}${p.techStack.length ? ` [${p.techStack.join(', ')}]` : ''}: ${p.claim}`)
        .join('\n')}`
    );
  }
  if (challenge.certifications && challenge.certifications.length > 0) {
    lines.push(`Certifications Listed: ${challenge.certifications.join(', ')}`);
  }
  if (challenge.summary) {
    lines.push(`Document Summary: ${challenge.summary}`);
  }
  if (challenge.rawTextExcerpt && challenge.rawTextExcerpt.trim().length > 30) {
    lines.push(`ACTUAL DOCUMENT TEXT EXCERPT:\n${challenge.rawTextExcerpt.trim().slice(0, 2600)}`);
  }
  return lines.join('\n\n');
}

const TOTAL_DEFENSE_TURNS = 3;

export const VaultDefenseRoom: React.FC<VaultDefenseRoomProps> = ({
  user,
  cOS,
  docId,
  initialChallenge,
}) => {
  const router = useRouter();
  const [challenge, setChallenge] = useState<VaultDefenseChallenge | null>(() => initialChallenge);
  const [started, setStarted] = useState(false);
  const [isPreparing, setIsPreparing] = useState(false);
  const [unreadableReason, setUnreadableReason] = useState<string>('');
  const [showTextPreview, setShowTextPreview] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [manualTextInput, setManualTextInput] = useState('');
  const [animState, setAnimState] = useState<AnimState>('idle');
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [result, setResult] = useState<VaultDefenseResult | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [tabWarnings, setTabWarnings] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<Message[]>([]);
  messagesRef.current = messages;
  const userAnswersRef = useRef<string[]>([]);
  userAnswersRef.current = userAnswers;
  const sessionIdRef = useRef<string>(`vault_defense_${docId || 'doc'}_${Date.now()}`);
  const preparedDocIdRef = useRef<string | null>(null);
  const sendingLockRef = useRef<boolean>(false);

  // Reconstruct challenge on reload directly from ?mode=vault_verify&docId=...
  useEffect(() => {
    if (challenge) return;
    const vaultItem = docId ? (cOS?.vaultItems || []).find((i: any) => i.id === docId) : null;
    const activeMentorId = getActiveUserMentorId(user);
    const auditor = resolveVaultAuditorMentor(activeMentorId);
    if (vaultItem) {
      let cachedAi: any = null;
      if (typeof window !== 'undefined') {
        try {
          const raw = localStorage.getItem(`pinit_vault_ai_analysis_${vaultItem.id}`);
          if (raw) cachedAi = JSON.parse(raw);
        } catch {}
      }
      const skills = Array.from(
        new Set(
          [
            ...(Array.isArray(cachedAi?.skills) ? cachedAi.skills : []),
            ...(Array.isArray(vaultItem.skill_tags) ? vaultItem.skill_tags : []),
          ]
            .map((s: any) => String(s || '').trim())
            .filter(Boolean)
        )
      );
      setChallenge({
        docId: vaultItem.id,
        userId: user?.id,
        title: vaultItem.title || 'Uploaded Credential',
        itemType: vaultItem.item_type || 'resume',
        organizationName: vaultItem.organization_name,
        claimedSkills:
          skills.length > 0
            ? skills
            : extractSkillsFast(`${vaultItem.title} ${vaultItem.description || ''}`, vaultItem.skill_tags),
        projects: cachedAi?.projects,
        certifications: cachedAi?.certifications,
        summary: cachedAi?.summary,
        rawTextExcerpt: cachedAi?.rawTextExcerpt,
        defenseQuestions: cachedAi?.defenseQuestions,
        analysisSource: cachedAi?.source,
        auditor,
        createdAt: new Date().toISOString(),
      });
    }
  }, [challenge, docId, cOS?.vaultItems, user]);

  // Step 1: Deep PDF.js + Groq Document Read (reads actual uploaded file from Supabase Storage)
  useEffect(() => {
    if (!challenge || started) return;
    if (preparedDocIdRef.current === challenge.docId) return;

    const onlyGenericSkills =
      challenge.claimedSkills.length === 0 ||
      challenge.claimedSkills.every((s) => ['system design', 'problem solving'].includes(s.toLowerCase()));
    const hasRealContent = Boolean(
      challenge.rawTextExcerpt &&
        challenge.rawTextExcerpt.trim().length > 40 &&
        challenge.title !== 'Supporting Document' &&
        !onlyGenericSkills
    );

    if (hasRealContent) {
      preparedDocIdRef.current = challenge.docId;
      return;
    }

    let cancelled = false;
    let completed = false;
    const activeDocId = challenge.docId;
    preparedDocIdRef.current = activeDocId;
    setIsPreparing(true);
    setUnreadableReason('');
    setAnimState('thinking');

    api
      .post<{
        ok: boolean;
        readable?: boolean;
        unreadableReason?: string;
        analysisSource?: string;
        documentTitle?: string;
        documentType?: string;
        claimedSkills?: string[];
        projects?: Array<{ name: string; techStack: string[]; claim: string }>;
        certifications?: string[];
        summary?: string;
        rawTextExcerpt?: string;
        defenseQuestions?: string[];
        institution?: string;
      }>('/api/vault/defense-session', {
        action: 'prepare',
        docId: activeDocId,
        title: challenge.title,
        itemType: challenge.itemType,
        auditorName: challenge.auditor.name,
        existingSkills: challenge.claimedSkills,
      })
      .then((res) => {
        if (cancelled || !res?.ok) return;
        completed = true;
        if (res.readable === false) {
          setUnreadableReason(
            res.unreadableReason ||
              'Could not extract readable text from this file. Please re-upload a standard PDF, DOCX, or clear PNG/JPG image of your resume.'
          );
          return;
        }
        const nextSkills =
          Array.isArray(res.claimedSkills) && res.claimedSkills.length > 0
            ? res.claimedSkills
            : challenge.claimedSkills;
        const nextQuestions =
          Array.isArray(res.defenseQuestions) && res.defenseQuestions.length > 0
            ? res.defenseQuestions
            : challenge.defenseQuestions;
        const nextTitle = res.documentTitle || challenge.title;
        const nextType = res.documentType || challenge.itemType;

        setChallenge((prev) =>
          prev
            ? {
                ...prev,
                title: nextTitle,
                itemType: nextType,
                organizationName: res.institution || prev.organizationName,
                claimedSkills: nextSkills,
                projects: Array.isArray(res.projects) && res.projects.length > 0 ? res.projects : prev.projects,
                certifications:
                  Array.isArray(res.certifications) && res.certifications.length > 0
                    ? res.certifications
                    : prev.certifications,
                summary: res.summary || prev.summary,
                rawTextExcerpt: res.rawTextExcerpt || prev.rawTextExcerpt,
                defenseQuestions: nextQuestions,
                analysisSource: res.analysisSource || prev.analysisSource,
              }
            : prev
        );

        cOS?.updateVaultItem?.(
          activeDocId,
          {
            title: nextTitle,
            item_type: nextType,
            skill_tags: nextSkills,
            ...(res.institution ? { organization_name: res.institution } : {}),
          },
          { skipTrustMutation: true }
        );
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(
              `pinit_vault_ai_analysis_${activeDocId}`,
              JSON.stringify({
                source: res.analysisSource,
                documentTitle: nextTitle,
                documentType: nextType,
                skills: nextSkills,
                projects: res.projects || [],
                certifications: res.certifications || [],
                summary: res.summary || '',
                rawTextExcerpt: res.rawTextExcerpt || '',
                defenseQuestions: nextQuestions || [],
              })
            );
          } catch {}
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) {
          completed = true;
          setIsPreparing(false);
          setAnimState('idle');
        }
      });

    return () => {
      cancelled = true;
      if (!completed && preparedDocIdRef.current === activeDocId) {
        preparedDocIdRef.current = null;
        setIsPreparing(false);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [challenge?.docId, started]);

  // Session elapsed timer (reused in InterviewSessionHeader)
  useEffect(() => {
    if (!started || result) return;
    const t = setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [started, result]);

  const formatElapsed = useCallback((sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }, []);

  // Anti-Cheating Proctoring: Deduct -2 once per session if user switches tabs during defense
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

  // Auto-scroll live chat transcript
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSendingReply]);

  const activeTeacher: AvatarTeacher = useMemo(
    () => ({
      id: challenge?.auditor.id || 'akash',
      name: challenge?.auditor.name || 'Mr. Akash',
      title: challenge?.auditor.title || 'Lead Credential Auditor',
      emoji: challenge?.auditor.emoji || '🕵️‍♂️',
    }),
    [challenge]
  );

  // Reuse Existing AI Interview Camera & Gaze Hook
  const { showCameraPreview, eyeContactScore, videoPreviewRef, toggleCameraPreview, stopCamera } =
    useInterviewGaze(started && !result, 'round1_behavioral');

  // Forward ref so useInterviewVoice can dispatch voice transcripts directly into the live chat handler
  const handleSendRef = useRef<(text: string) => void>(() => {});

  // Reuse Existing AI Interview Voice-First Hook (auto-listening mic, live transcript, barge-in, TTS sync)
  const {
    isVoiceListening,
    isAvatarSpeaking,
    liveSpeechTranscript,
    wpmScore,
    fillerWordCount,
    micAudioLevel,
    bargeInEnabled,
    setBargeInEnabled,
    avatarVolume,
    handleVolumeChange,
    startVoiceListening,
    stopVoiceListening,
    speakWithAvatar,
    interruptSpeech,
    isSpeechSupported,
    flushAndSubmitTranscript,
    isTabInactive,
    pauseVoiceListening,
  } = useInterviewVoice({
    isInterviewActive: started && !result,
    activeStage: 'round1_behavioral',
    activeTopicName: challenge?.title || 'Credential Defense',
    activeTeacherId: activeTeacher.id,
    difficulty: 'hard',
    onFinalTranscript: (text) => handleSendRef.current(text),
    onSilenceNudge: (nudgeText) => {
      if (!challenge || result) return;
      speakWithAvatar(
        nudgeText,
        challenge.auditor.id,
        () => setAnimState('talking'),
        () => setAnimState('idle')
      );
    },
    isSendingInterviewerReply: isSendingReply,
  });

  // Clean up camera/mic on unmount
  useEffect(() => {
    return () => {
      stopCamera();
      stopVoiceListening();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Live conversational call to the EXISTING /api/interview/chat backend (stage: 'vault_defense')
  const requestConversationalTurn = useCallback(
    async (
      activeChallenge: VaultDefenseChallenge,
      historyForApi: Message[],
      latestUserText: string
    ): Promise<string> => {
      const vaultContext = buildVaultPromptContext(activeChallenge);
      try {
        const res = await api.post<{ reply?: string }>('/api/interview/chat', {
          message: latestUserText,
          interviewerId: activeChallenge.auditor.id,
          stage: 'vault_defense',
          difficulty: 'hard',
          customTopic: `${activeChallenge.title} (${activeChallenge.claimedSkills.slice(0, 6).join(', ')})`,
          domainStream: 'tech',
          vaultContext,
          history: historyForApi,
          telemetry: {
            wpm: wpmScore,
            fillerWords: fillerWordCount,
          },
        });
        if (res?.reply && res.reply.trim().length > 10) {
          return res.reply.trim();
        }
      } catch (err) {
        console.warn('[VaultDefenseRoom] /api/interview/chat fallback:', err);
      }

      // Clean fallback if chat endpoint is unreachable
      const turnIdx = historyForApi.filter((m) => m.role === 'assistant').length;
      return generateBrutalDefensePrompt(activeChallenge, turnIdx);
    },
    [wpmScore, fillerWordCount]
  );

  const finalizeDefense = useCallback(
    async (activeChallenge: VaultDefenseChallenge, allAnswers: string[], fullMessages: Message[]) => {
      stopVoiceListening();
      setIsSendingReply(true);
      setAnimState('thinking');

      const askedQuestions = fullMessages
        .filter((m) => m.role === 'assistant')
        .map((m) => m.content);

      let evalRes: VaultDefenseResult = evaluateVaultDefenseResponses(
        activeChallenge.claimedSkills,
        allAnswers
      );

      try {
        const groqEval = await api
          .post<{ ok: boolean; result?: VaultDefenseResult }>('/api/vault/defense-session', {
            action: 'evaluate',
            docId: activeChallenge.docId,
            title: activeChallenge.title,
            auditorName: activeChallenge.auditor.name,
            claimedSkills: activeChallenge.claimedSkills,
            projects: activeChallenge.projects || [],
            summary: activeChallenge.summary || '',
            rawTextExcerpt: activeChallenge.rawTextExcerpt || '',
            questions: askedQuestions,
            answers: allAnswers,
          })
          .catch(() => null);
        if (groqEval?.ok && groqEval.result && typeof groqEval.result.score === 'number') {
          evalRes = groqEval.result;
        }
      } catch {}

      const rawProvenSkills: string[] = Array.isArray(evalRes.provenSkills)
        ? evalRes.provenSkills
        : Array.isArray(evalRes.verifiedSkillsAdded)
        ? evalRes.verifiedSkillsAdded
        : [];
      const skillsToSync = evalRes.passed
        ? Array.from(new Set([...activeChallenge.claimedSkills, ...rawProvenSkills].map((s) => String(s || '').trim()).filter(Boolean)))
        : Array.from(new Set(rawProvenSkills.map((s) => String(s || '').trim()).filter(Boolean)));

      let finalSyncedSkills = skillsToSync;

      try {
        const verifyRes = await api
          .post<{
            ok?: boolean;
            skillTags?: string[];
            provenSkillsSynced?: string[];
            updatedPitch?: string;
          }>('/api/vault/verify-defense', {
            docId: activeChallenge.docId,
            passed: evalRes.passed,
            score: evalRes.score,
            auditorName: activeChallenge.auditor.name,
            claimedSkills: activeChallenge.claimedSkills,
            provenSkills: skillsToSync,
          })
          .catch(() => null);

        if (Array.isArray(verifyRes?.provenSkillsSynced) && verifyRes.provenSkillsSynced.length > 0) {
          finalSyncedSkills = verifyRes.provenSkillsSynced;
        }

        if (evalRes.passed) {
          cOS?.updateVaultItem?.(
            activeChallenge.docId,
            {
              verified: true,
              ai_confidence_score: evalRes.score,
              used_in_portfolio: true,
            },
            { skipTrustMutation: true }
          );
          if (typeof window !== 'undefined') {
            try {
              localStorage.setItem(
                `pinit_vault_audit_status_${activeChallenge.docId}`,
                JSON.stringify({
                  status: 'verified',
                  score: evalRes.score,
                  auditor: activeChallenge.auditor.name,
                  provenSkills: finalSyncedSkills,
                })
              );
            } catch {}
          }
          await applyTrustReward(
            user?.id,
            'vault_verified',
            undefined,
            `Verified Vault Defense (${activeChallenge.title}) by ${activeChallenge.auditor.name}`
          );
          recordMetricLedgerEntry(user?.id, {
            metric: 'mentality',
            feature: 'vault',
            action: `Survived Live Defense · Stabilizer & Pattern Hunter`,
            delta: 6,
            previousValue: 0,
            valueAfter: 6,
            mentalityTag: 'Stabilizer',
          });
        } else {
          cOS?.updateVaultItem?.(
            activeChallenge.docId,
            {
              verified: false,
              ai_confidence_score: evalRes.score,
            },
            { skipTrustMutation: true }
          );
          if (typeof window !== 'undefined') {
            try {
              localStorage.setItem(
                `pinit_vault_audit_status_${activeChallenge.docId}`,
                JSON.stringify({
                  status: 'rejected',
                  score: evalRes.score,
                  auditor: activeChallenge.auditor.name,
                  provenSkills: finalSyncedSkills,
                })
              );
            } catch {}
          }
          await applyVaultRejectionPenalty(
            user?.id,
            undefined,
            `Failed Skill Defense: Fake/Unsubstantiated "${activeChallenge.title}"`
          );
        }

        // Sync any proven skills to Portfolio, Resume, Skills Passport & Shareable Profile (both full pass & partial proof!)
        if (finalSyncedSkills.length > 0 && typeof cOS?.addVerifiedSkills === 'function') {
          cOS.addVerifiedSkills(finalSyncedSkills, activeChallenge.title);
        }
        if (typeof window !== 'undefined' && (finalSyncedSkills.length > 0 || verifyRes?.updatedPitch)) {
          try {
            window.dispatchEvent(
              new CustomEvent('pinit-portfolio-updated', {
                detail: {
                  userId: user?.id,
                  skills: finalSyncedSkills,
                  pitch: verifyRes?.updatedPitch,
                },
              })
            );
          } catch {}
        }

        clearPendingVaultDefense(activeChallenge.docId);
      } finally {
        const finalizedResult: VaultDefenseResult = {
          ...evalRes,
          provenSkills: finalSyncedSkills,
          verifiedSkillsAdded: finalSyncedSkills,
        };
        setResult(finalizedResult);
        setIsSendingReply(false);
        stopCamera();
        const closingSpeech = finalizedResult.passed
          ? `Well done — you backed up your claims on "${activeChallenge.title}" with real depth. I've verified your document, added +5 Trust Score, and synced ${finalSyncedSkills.length} verified skills to your Portfolio, Resume, and Shareable Profile.`
          : finalSyncedSkills.length > 0
          ? `I can't verify the full "${activeChallenge.title}" document based on this defense — ${finalizedResult.critique} That's a -5 Trust Score deduction for the unverified claims. However, you accurately proved ${finalSyncedSkills.join(', ')}, so I've synced ${finalSyncedSkills.length === 1 ? 'that verified skill' : 'those verified skills'} directly to your Portfolio, Resume, and Shareable Profile.`
          : `I can't verify "${activeChallenge.title}" based on this defense — ${finalizedResult.critique} That's a -5 Trust Score deduction; review the skills on your document and come back when you can walk through them clearly.`;
        setMessages((prev) => [...prev, { role: 'assistant', content: closingSpeech }]);
        speakWithAvatar(
          closingSpeech,
          activeChallenge.auditor.id,
          () => setAnimState('talking'),
          () => setAnimState('idle')
        );
      }
    },
    [cOS, user?.id, stopVoiceListening, stopCamera, speakWithAvatar]
  );

  const handleSendMessage = useCallback(
    async (rawText: string) => {
      const trimmed = String(rawText || '').trim();
      if (!trimmed || !challenge || sendingLockRef.current || result) return;

      sendingLockRef.current = true;
      interruptSpeech();
      setIsSendingReply(true);
      setAnimState('thinking');

      const nextMessages: Message[] = [...messagesRef.current, { role: 'user', content: trimmed }];
      const nextAnswers = [...userAnswersRef.current, trimmed];
      setMessages(nextMessages);
      setUserAnswers(nextAnswers);

      try {
        if (nextAnswers.length >= TOTAL_DEFENSE_TURNS) {
          await finalizeDefense(challenge, nextAnswers, nextMessages);
          return;
        }

        // Real reactive follow-up via existing /api/interview/chat engine
        const reply = await requestConversationalTurn(challenge, nextMessages, trimmed);
        setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
        setIsSendingReply(false);
        speakWithAvatar(
          reply,
          challenge.auditor.id,
          () => setAnimState('talking'),
          () => setAnimState('idle')
        );
      } finally {
        sendingLockRef.current = false;
        setIsSendingReply(false);
      }
    },
    [challenge, result, interruptSpeech, finalizeDefense, requestConversationalTurn, speakWithAvatar]
  );

  handleSendRef.current = handleSendMessage;

  const startDefense = async () => {
    if (!challenge || isPreparing || unreadableReason) return;
    unlockSpeechSynthesis();
    setStarted(true);
    setElapsedSeconds(0);
    setUserAnswers([]);
    setMessages([]);
    setIsSendingReply(true);
    setAnimState('thinking');

    // Call the EXISTING /api/interview/chat engine (dedicated vault_defense prompt) for a sharp, resume-grounded opening
    const startSignal =
      'Audit my uploaded document now and ask your first specific verification question directly referencing a real project, internship, certification, or skill written in it.';
    const openingPrompt = await requestConversationalTurn(
      challenge,
      [{ role: 'user', content: startSignal }],
      startSignal
    );

    setMessages([{ role: 'assistant', content: openingPrompt }]);
    setIsSendingReply(false);
    speakWithAvatar(
      openingPrompt,
      challenge.auditor.id,
      () => setAnimState('talking'),
      () => setAnimState('idle')
    );
  };

  const exitDefense = () => {
    interruptSpeech();
    stopVoiceListening();
    stopCamera();
    router.push('/vault');
  };

  if (!challenge) {
    return (
      <div
        style={{
          maxWidth: 640,
          margin: '60px auto',
          padding: 28,
          borderRadius: 20,
          background: 'var(--card)',
          border: '1px solid var(--border)',
          textAlign: 'center',
        }}
      >
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, marginBottom: 8 }}>
          Vault Defense Document Not Found
        </h2>
        <p style={{ color: 'var(--t2)', fontSize: 14, marginBottom: 20 }}>
          Upload your Resume or Certificate in the Proof Vault first, then launch verification from the document card.
        </p>
        <Link href="/vault" className="btn-primary" style={{ textDecoration: 'none' }}>
          Go to Proof Vault
        </Link>
      </div>
    );
  }

  // Pre-launch Briefing Card (shows Groq-extracted skills & projects, unlocks live voice + 3D studio on click)
  if (!started) {
    return (
      <div style={{ maxWidth: 820, margin: '24px auto', padding: '0 16px 48px' }} className="animate-fade-in">
        <div
          style={{
            borderRadius: 18,
            padding: '22px 24px',
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderTop: '3px solid #ef4444',
            boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, padding: '3px 9px', borderRadius: 99, background: 'rgba(239,68,68,0.14)', color: '#dc2626', border: '1px solid rgba(239,68,68,0.35)', fontFamily: 'var(--font-mono)' }}>
                🔥 LIVE AI CREDENTIAL DEFENSE
              </span>
              {challenge.analysisSource && challenge.analysisSource !== 'fallback' && (
                <span style={{ fontSize: 10.5, padding: '2px 8px', borderRadius: 99, background: 'rgba(16,185,129,0.12)', color: 'var(--green)', border: '1px solid rgba(16,185,129,0.3)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                  ✓ Groq AI Read Resume
                </span>
              )}
            </div>
            <button type="button" onClick={() => router.push('/vault')} className="btn-ghost btn-sm">
              ← Back to Vault
            </button>
          </div>

          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, margin: '0 0 6px', color: 'var(--t1)' }}>
            Verifying: {challenge.title}
          </h1>
          <p style={{ color: 'var(--t2)', fontSize: 13.5, lineHeight: 1.55, margin: '0 0 16px' }}>
            {isPreparing
              ? `${challenge.auditor.name} is reading your uploaded file with Groq AI to extract your real skills and projects...`
              : `You will enter the live 3D AI Interview Studio with ${challenge.auditor.name} (${challenge.auditor.gender === 'male' ? 'Opposite Male Auditor' : 'Opposite Female Auditor'}) for a 3-turn voice & text conversation directly about the skills and projects on your document.`}
          </p>

          {/* Unreadable File Honest Guard (never launch an interview on an unreadable file) */}
          {!isPreparing && unreadableReason && (
            <div style={{ marginBottom: 16, padding: '12px 14px', borderRadius: 12, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.35)', fontSize: 12.5, color: 'var(--t1)' }}>
              <div style={{ fontWeight: 800, color: '#dc2626', marginBottom: 4 }}>
                ⚠️ Could Not Read Uploaded File
              </div>
              <div style={{ color: 'var(--t2)', lineHeight: 1.5, marginBottom: 10 }}>{unreadableReason}</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => {
                    preparedDocIdRef.current = null;
                    setUnreadableReason('');
                    setChallenge((prev) => (prev ? { ...prev } : prev));
                  }}
                  className="btn-ghost btn-sm"
                >
                  🔄 Retry AI Scan
                </button>
                <button type="button" onClick={() => router.push('/vault')} className="btn-primary btn-sm">
                  📤 Re-upload Readable PDF / PNG
                </button>
              </div>
            </div>
          )}

          {/* Extracted Skills */}
          {!unreadableReason && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.7, color: 'var(--t3)', fontFamily: 'var(--font-mono)', marginBottom: 6 }}>
                Skills Read From Your Document ({challenge.claimedSkills.length})
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {isPreparing ? (
                  <span style={{ fontSize: 12, padding: '4px 10px', borderRadius: 6, background: 'rgba(99,102,241,0.12)', color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                    🔍 Reading PDF &amp; analyzing claims with Groq AI...
                  </span>
                ) : challenge.claimedSkills.length > 0 ? (
                  challenge.claimedSkills.map((sk) => (
                    <span
                      key={sk}
                      style={{
                        fontSize: 11.5,
                        padding: '3px 9px',
                        borderRadius: 6,
                        background: 'rgba(99,102,241,0.12)',
                        color: 'var(--accent)',
                        border: '1px solid rgba(99,102,241,0.3)',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 600,
                      }}
                    >
                      {sk}
                    </span>
                  ))
                ) : (
                  <span style={{ fontSize: 12, color: 'var(--t3)' }}>
                    No skill tags extracted yet — AI will question directly from the document text below.
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Extracted Projects */}
          {!isPreparing && !unreadableReason && challenge.projects && challenge.projects.length > 0 && (
            <div style={{ marginBottom: 14, padding: '10px 14px', borderRadius: 12, background: 'var(--bg2)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.7, color: 'var(--t3)', fontFamily: 'var(--font-mono)', marginBottom: 6 }}>
                Projects &amp; Experience Read ({challenge.projects.length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {challenge.projects.slice(0, 5).map((proj, idx) => (
                  <div key={idx} style={{ fontSize: 12.5, color: 'var(--t1)' }}>
                    <strong>• {proj.name}</strong>
                    {proj.techStack?.length > 0 && (
                      <span style={{ color: 'var(--t3)', fontSize: 11.5 }}> ({proj.techStack.slice(0, 5).join(', ')})</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Transparent Extracted Text Preview Toggle */}
          {!isPreparing && !unreadableReason && challenge.rawTextExcerpt && (
            <div style={{ marginBottom: 16 }}>
              <button
                type="button"
                onClick={() => setShowTextPreview((v) => !v)}
                className="btn-ghost btn-sm"
                style={{ fontSize: 11.5, padding: '4px 10px' }}
              >
                {showTextPreview ? '▲ Hide Extracted Resume Text' : '📄 Verify What AI Read From Your Resume'}
              </button>
              {showTextPreview && (
                <pre
                  style={{
                    marginTop: 8,
                    padding: 10,
                    borderRadius: 10,
                    background: 'var(--bg2)',
                    border: '1px solid var(--border)',
                    fontSize: 11,
                    lineHeight: 1.5,
                    color: 'var(--t2)',
                    maxHeight: 180,
                    overflowY: 'auto',
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {challenge.rawTextExcerpt.slice(0, 2200)}
                </pre>
              )}
            </div>
          )}

          {/* Stakes + Launch */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
            <div style={{ fontSize: 12, color: 'var(--t2)' }}>
              <div>• Pass (&ge;65%): <strong style={{ color: 'var(--green)' }}>+5 Trust Score</strong> + All skills synced to Portfolio</div>
              <div>• Fail / Bluff: <strong style={{ color: 'var(--coral)' }}>-5 Trust Score</strong> + Document marked Rejected</div>
            </div>
            <button
              type="button"
              data-testid="start-vault-defense-btn"
              onClick={startDefense}
              disabled={isPreparing || Boolean(unreadableReason)}
              className="btn-primary"
              style={{ padding: '11px 22px', fontSize: 14, fontWeight: 800, opacity: isPreparing || unreadableReason ? 0.55 : 1 }}
            >
              {isPreparing ? '⏳ Reading Resume with Groq AI...' : `🎙️ Start Live Verification with ${challenge.auditor.name}`}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // LIVE AI INTERVIEW STUDIO — Reusing InterviewSessionHeader + InterviewVoiceHud + Round1Behavioral!
  const lastInterviewerSpeech =
    [...messages].reverse().find((m) => m.role === 'assistant')?.content ||
    (isSendingReply ? `${challenge.auditor.name} is reviewing your resume...` : '');

  const provenSyncedList = result
    ? Array.from(
        new Set([
          ...(Array.isArray(result.provenSkills) ? result.provenSkills : []),
          ...(Array.isArray(result.verifiedSkillsAdded) ? result.verifiedSkillsAdded : []),
        ])
      )
    : [];

  const resultFooter = result ? (
    <div
      data-testid="vault-defense-result"
      style={{
        padding: 12,
        borderRadius: 12,
        background: result.passed ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
        border: `1px solid ${result.passed ? 'rgba(34,197,94,0.38)' : 'rgba(239,68,68,0.38)'}`,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
        <strong style={{ fontSize: 13.5, color: result.passed ? 'var(--green)' : '#dc2626' }}>
          {result.passed ? '✓ CREDENTIAL VERIFIED' : '✕ DEFENSE FAILED'}
        </strong>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 800, color: result.passed ? 'var(--green)' : '#dc2626' }}>
          {result.score}/100 ({result.trustDelta > 0 ? `+${result.trustDelta}` : result.trustDelta} Trust)
        </span>
      </div>
      <p style={{ fontSize: 12, color: 'var(--t2)', margin: '0 0 8px', lineHeight: 1.45 }}>{result.critique}</p>
      {provenSyncedList.length > 0 && (
        <div
          data-testid="vault-defense-proven-skills"
          style={{
            marginBottom: 10,
            padding: '8px 10px',
            borderRadius: 9,
            background: 'rgba(16,185,129,0.12)',
            border: '1px solid rgba(16,185,129,0.32)',
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--green)', marginBottom: 5 }}>
            ✓ {result.passed ? 'Verified Skills Synced' : 'Individually Proven & Synced'} to Portfolio, Resume &amp; Shareable Profile:
          </div>
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            {provenSyncedList.map((sk) => (
              <span
                key={sk}
                style={{
                  fontSize: 11,
                  padding: '2px 8px',
                  borderRadius: 6,
                  background: 'rgba(16,185,129,0.18)',
                  color: 'var(--green)',
                  border: '1px solid rgba(16,185,129,0.4)',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                }}
              >
                ✓ {sk}
              </span>
            ))}
          </div>
        </div>
      )}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Link href="/vault" className="btn-primary btn-sm" style={{ textDecoration: 'none' }}>
          ← Return to Proof Vault
        </Link>
        <Link href="/profile?tab=portfolio" className="btn-ghost btn-sm" style={{ textDecoration: 'none' }}>
          👤 View Portfolio Skills
        </Link>
      </div>
    </div>
  ) : undefined;

  return (
    <div
      className="iv-session-shell"
      style={{
        padding: '8px 14px 10px',
        maxWidth: '100vw',
        margin: 0,
        height: '100dvh',
        maxHeight: '100dvh',
        overflow: 'hidden',
        color: 'var(--t1)',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, height: '100%', flex: '1 1 0%', minHeight: 0, overflow: 'hidden' }}>
        {/* Reused Existing AI Interview Top Header */}
        <InterviewSessionHeader
          activeTeacher={activeTeacher}
          activeTopicName={`Proof Verification: ${challenge.title}`}
          activeStage="vault_defense"
          domainStream="tech"
          isVoiceListening={isVoiceListening}
          elapsedSeconds={elapsedSeconds}
          formatElapsed={formatElapsed}
          isScoredStage={true}
          isAssistModeActive={false}
          setIsAssistModeActive={() => {}}
          messages={messages}
          fetchAssistScript={() => {}}
          avatarVolume={avatarVolume}
          handleVolumeChange={handleVolumeChange}
          showCameraPreview={showCameraPreview}
          toggleCameraPreview={toggleCameraPreview}
          isAvatarSpeaking={isAvatarSpeaking}
          interruptSpeech={interruptSpeech}
          exitInterview={exitDefense}
          isTabInactive={isTabInactive}
          bargeInEnabled={bargeInEnabled}
          setBargeInEnabled={setBargeInEnabled}
        />

        {/* Reused Existing Hands-Free Voice HUD Banner */}
        {!result && (
          <InterviewVoiceHud
            isVoiceListening={isVoiceListening}
            isAvatarSpeaking={isAvatarSpeaking}
            isSendingInterviewerReply={isSendingReply}
            activeTeacher={activeTeacher}
            liveSpeechTranscript={liveSpeechTranscript}
            stopVoiceListening={pauseVoiceListening}
            startVoiceListening={startVoiceListening}
            isSpeechSupported={isSpeechSupported}
            onDoneSpeaking={flushAndSubmitTranscript}
            isTabInactive={isTabInactive}
            micAudioLevel={micAudioLevel}
          />
        )}

        {/* Reused Existing 60/40 Live 3D Avatar + Camera PiP + Transcript Studio Stage */}
        <Round1Behavioral
          domainStream="tech"
          activeTeacher={activeTeacher}
          animState={animState}
          showCameraPreview={showCameraPreview}
          videoPreviewRef={videoPreviewRef}
          eyeContactScore={eyeContactScore}
          wpmScore={wpmScore}
          isAvatarSpeaking={isAvatarSpeaking}
          isVoiceListening={isVoiceListening}
          lastInterviewerSpeech={lastInterviewerSpeech}
          onProceed={() => {}}
          canProceed={Boolean(result?.passed)}
          isSendingInterviewMessage={isSendingReply}
          fillerWordCount={fillerWordCount}
          messages={messages}
          messagesEndRef={messagesEndRef}
          manualTextInput={manualTextInput}
          setManualTextInput={setManualTextInput}
          onSendMessage={handleSendMessage}
          liveSpeechTranscript={liveSpeechTranscript}
          activeTopicName={challenge.title}
          difficulty="hard"
          customStageBadge={`CREDENTIAL DEFENSE · ${challenge.auditor.name.toUpperCase()}`}
          customStageTitle={challenge.title}
          customProgressText={
            result
              ? result.passed
                ? `✅ Verified (${result.score}/100) · +5 Trust Score & ${provenSyncedList.length} skills synced`
                : provenSyncedList.length > 0
                ? `❌ Full Doc Failed (${result.score}/100) · -5 Trust · ✓ ${provenSyncedList.join(', ')} synced to Portfolio`
                : `❌ Defense Failed (${result.score}/100) · -5 Trust Score`
              : `🔥 Live Audit: ${Math.min(TOTAL_DEFENSE_TURNS, userAnswers.length)}/${TOTAL_DEFENSE_TURNS} exchanges · Skills: ${challenge.claimedSkills.slice(0, 5).join(', ')}${tabWarnings > 0 ? ` · ⚠️ ${tabWarnings} tab switch` : ''}`
          }
          hideRoundControls={true}
          footerResultNode={resultFooter}
        />
      </div>
    </div>
  );
};
