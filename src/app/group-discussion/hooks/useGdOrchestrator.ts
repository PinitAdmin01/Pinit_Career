import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from '@/lib/store/useAppStore';
import {
  speakWithAvatar as engineSpeakWithAvatar,
  stopSpeaking as engineStopSpeaking,
  setAvatarVoiceVolume,
} from '@/lib/tts';
import { AVATARS, SUGGESTED_TOPICS, getAuthHeaders } from '../constants';
import {
  hostIntroScript,
  hostFiveMinuteWarningScript,
  hostOneMinuteWarningScript,
  hostGentleNudgeScript,
  resolveFloatingMentorId,
  resolveGdHostId,
  getEligibleGdHosts,
} from '@/lib/group-discussion/gdTurnEngine';

export type GdStep = 'setup' | 'select_avatars' | 'call_grid' | 'report';
export type GdTurnPhase = 'host_intro' | 'user' | 'avatar_a' | 'avatar_b' | 'host_time_check' | 'ending';

export interface GdMessage {
  sender: string;
  role: string;
  content: string;
  emoji: string;
  tag?: 'host' | 'user' | 'challenger' | 'diplomat' | 'time_check';
  keySlot?: 'key_1' | 'key_2';
}

export interface GdReportData {
  score: number;
  verdict: string;
  gapsIdentified: string[];
  keyMoments: string[];
  evaluated?: boolean;
}

export interface GdHistoryItem {
  id: string;
  topic: string;
  objective?: string;
  domain: string;
  score: number;
  verdict: string;
  gaps: string[];
  moments: string[];
  report?: GdReportData;
  transcript: GdMessage[];
  date: string;
  durationSeconds?: number;
}

interface UseGdOrchestratorProps {
  user: any;
  spendPins?: (amount: number, reason: string) => Promise<boolean> | boolean;
  embedded?: boolean;
  roomName: string;
  objective: string;
  domain: 'technical' | 'sales' | 'business' | 'commerce';
  difficulty: 'easy' | 'medium' | 'hard';
  sessionDurationMinutes: number;
  invitedAvatars: string[];
  hostId: string;
  setHostId: (id: string) => void;
  setInvitedAvatars: React.Dispatch<React.SetStateAction<string[]>>;
  setRoomName: (val: string) => void;
  setObjective: (val: string) => void;
  setDomain: (val: 'technical' | 'sales' | 'business' | 'commerce') => void;
  setStep: (step: GdStep) => void;
  step: GdStep;
  audioVolume?: number;
  onSessionComplete?: () => void;
}

export function useGdOrchestrator({
  user,
  spendPins,
  embedded = false,
  roomName,
  objective,
  domain,
  difficulty,
  sessionDurationMinutes,
  invitedAvatars,
  hostId,
  setHostId,
  setInvitedAvatars,
  setRoomName,
  setObjective,
  setDomain,
  setStep,
  step,
  audioVolume = 100,
  onSessionComplete,
}: UseGdOrchestratorProps) {
  const router = useRouter();

  const [messages, setMessages] = useState<GdMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [liveTranscript, setLiveTranscript] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeSpeakingAvatar, setActiveSpeakingAvatar] = useState<string | null>(null);
  const [report, setReport] = useState<GdReportData | null>(null);
  const [turnPhase, setTurnPhase] = useState<GdTurnPhase>('host_intro');
  const [activeTimeAlert, setActiveTimeAlert] = useState<'5min' | '1min' | null>(null);
  const [turnCount, setTurnCount] = useState(0);

  // Pin Gate
  const [showPinsGate, setShowPinsGate] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  // Live Call States
  const [handRaised, setHandRaised] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isUserTurn, setIsUserTurn] = useState(false);
  const [candidateTurnTimer, setCandidateTurnTimer] = useState<number | null>(null);
  const [currentAvatarARoleId, setCurrentAvatarARoleId] = useState<string | null>(null);
  const [currentAvatarBRoleId, setCurrentAvatarBRoleId] = useState<string | null>(null);
  const [micActive, setMicActive] = useState(false);
  const [micPausedByUser, setMicPausedByUser] = useState(false);
  const [activeStream, setActiveStream] = useState<MediaStream | null>(null);
  const [suggestedHelperText, setSuggestedHelperText] = useState<string>('');
  const [historyList, setHistoryList] = useState<GdHistoryItem[]>([]);
  const [selectedHistorySession, setSelectedHistorySession] = useState<GdHistoryItem | null>(null);
  const [lastKeySlotsUsed, setLastKeySlotsUsed] = useState<{ avatarA?: 'key_1' | 'key_2'; avatarB?: 'key_1' | 'key_2' }>({});

  // Refs (avoiding stale closures across timers & async callbacks)
  const messagesRef = useRef<GdMessage[]>([]);
  const inputTextRef = useRef<string>('');
  const liveTranscriptRef = useRef<string>('');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const speechSessionRef = useRef<number>(0);
  const volumeRef = useRef<number>(audioVolume);
  const recognitionRef = useRef<any>(null);
  const micActiveRef = useRef<boolean>(false);
  const micPausedByUserRef = useRef<boolean>(false);
  const isUserTurnRef = useRef<boolean>(false);
  const isSpeechOutputActiveRef = useRef<boolean>(false);
  const turnPhaseRef = useRef<GdTurnPhase>('host_intro');
  const loadingRef = useRef<boolean>(false);
  const handRaisedRef = useRef<boolean>(false);
  const sessionEndedRef = useRef<boolean>(false);
  const fiveMinAnnouncedRef = useRef<boolean>(false);
  const oneMinAnnouncedRef = useRef<boolean>(false);
  const pendingHostWarningRef = useRef<'5min' | '1min' | null>(null);
  const gentleNudgeSentRef = useRef<boolean>(false);
  const turnIndexRef = useRef<number>(0);
  const avatarBPromiseRef = useRef<Promise<{ reply: string; keySlot?: 'key_1' | 'key_2' }> | null>(null);
  const pendingTranscriptRef = useRef<string>('');
  const userSilenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    inputTextRef.current = inputText;
  }, [inputText]);

  useEffect(() => {
    liveTranscriptRef.current = liveTranscript;
  }, [liveTranscript]);

  useEffect(() => {
    volumeRef.current = Math.max(0, Math.min(100, audioVolume));
    try {
      setAvatarVoiceVolume(volumeRef.current / 100);
    } catch {}
    if (audioRef.current) {
      audioRef.current.volume = volumeRef.current / 100;
    }
  }, [audioVolume]);

  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  useEffect(() => {
    turnPhaseRef.current = turnPhase;
  }, [turnPhase]);

  useEffect(() => {
    handRaisedRef.current = handRaised;
  }, [handRaised]);

  // Strict AI Mentor exclusion: if user picked Priya (or any mentor) as their AI Mentor, they CANNOT be GD Host
  const floatingMentorId = resolveFloatingMentorId(user?.guidanceMentorId || user?.selectedTeacherId);
  const eligibleHostIds = getEligibleGdHosts(floatingMentorId);
  const effectiveHostId = resolveGdHostId(floatingMentorId, hostId);

  // Keep external hostId synced if user's AI Mentor collides with current hostId
  useEffect(() => {
    if (hostId !== effectiveHostId) {
      setHostId(effectiveHostId);
    }
  }, [hostId, effectiveHostId, setHostId]);

  const appendMessage = useCallback((msg: GdMessage) => {
    const next = [...messagesRef.current, msg];
    messagesRef.current = next;
    setMessages(next);
    return next;
  }, []);

  const stopSpeaking = useCallback(() => {
    speechSessionRef.current += 1;
    isSpeechOutputActiveRef.current = false;
    try {
      engineStopSpeaking();
    } catch {}
    if (audioRef.current) {
      try {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current.onended = null;
        audioRef.current.onerror = null;
        audioRef.current.src = '';
      } catch {}
      audioRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
    setActiveSpeakingAvatar(null);
  }, []);

  const stopMicHardware = useCallback(() => {
    micActiveRef.current = false;
    setMicActive(false);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.onend = null;
        recognitionRef.current.abort?.();
        recognitionRef.current.stop?.();
      } catch {}
      recognitionRef.current = null;
    }
    setActiveStream(prev => {
      if (prev) {
        try {
          prev.getTracks().forEach(t => t.stop());
        } catch {}
      }
      return null;
    });
  }, []);

  const clearSilenceTimer = useCallback(() => {
    if (userSilenceTimerRef.current) {
      clearTimeout(userSilenceTimerRef.current);
      userSilenceTimerRef.current = null;
    }
  }, []);

  // Load saved GD history (normalizing both flat and nested report records)
  useEffect(() => {
    try {
      const saved = localStorage.getItem('gd_boardroom_history');
      if (saved) {
        const raw = JSON.parse(saved);
        if (Array.isArray(raw)) {
          const normalized: GdHistoryItem[] = raw.map((item: any) => {
            const score = Number.isFinite(Number(item?.report?.score ?? item?.score))
              ? Number(item?.report?.score ?? item?.score)
              : 0;
            const verdict = item?.report?.verdict || item?.verdict || '';
            const gaps = item?.report?.gapsIdentified || item?.gaps || [];
            const moments = item?.report?.keyMoments || item?.moments || [];
            return {
              id: String(item?.id || `gd_${Date.now()}`),
              topic: String(item?.topic || 'Group Discussion'),
              objective: item?.objective || '',
              domain: String(item?.domain || 'technical'),
              score,
              verdict,
              gaps,
              moments,
              report: {
                score,
                verdict,
                gapsIdentified: gaps,
                keyMoments: moments,
                evaluated: item?.report?.evaluated !== false,
              },
              transcript: Array.isArray(item?.transcript) ? item.transcript : [],
              date: String(item?.date || new Date().toISOString()),
              durationSeconds: item?.durationSeconds,
            };
          });
          setHistoryList(normalized);
        }
      }
    } catch {}
  }, []);

  const saveHistorySession = useCallback(
    (newReport: GdReportData, transcript: GdMessage[]) => {
      const item: GdHistoryItem = {
        id: `gd_${Date.now()}`,
        topic: roomName || 'Group Discussion',
        objective,
        domain,
        score: newReport.score,
        verdict: newReport.verdict,
        gaps: newReport.gapsIdentified || [],
        moments: newReport.keyMoments || [],
        report: newReport,
        transcript,
        date: new Date().toISOString(),
        durationSeconds: callDuration,
      };

      setHistoryList(prev => {
        const updated = [item, ...prev].slice(0, 20);
        try {
          localStorage.setItem('gd_boardroom_history', JSON.stringify(updated));
        } catch {}
        return updated;
      });
    },
    [roomName, objective, domain, callDuration]
  );

  const deleteHistorySession = useCallback((id: string) => {
    setHistoryList(prev => {
      const updated = prev.filter(item => item.id !== id);
      try {
        localStorage.setItem('gd_boardroom_history', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    setSelectedHistorySession(prev => (prev?.id === id ? null : prev));
  }, []);

  // Auto-scroll transcript
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, liveTranscript]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      sessionEndedRef.current = true;
      clearSilenceTimer();
      stopSpeaking();
      stopMicHardware();
    };
  }, [clearSilenceTimer, stopSpeaking, stopMicHardware]);

  // Helper: Resolve Avatar 1 (Challenger) & Avatar 2 (Diplomat) from invited panelists (never the Host!)
  const resolveActivePair = useCallback(
    (roundIndex: number) => {
      const panelists = invitedAvatars.filter(id => id !== effectiveHostId);
      const fallbackPool = AVATARS.map(a => a.id).filter(id => id !== effectiveHostId && id !== floatingMentorId);
      const pool = panelists.length >= 2 ? panelists : [...panelists, ...fallbackPool.filter(id => !panelists.includes(id))];

      const idA = pool[(roundIndex * 2) % pool.length] || 'kashyap';
      const idB = pool[(roundIndex * 2 + 1) % pool.length] || (idA === 'divya' ? 'sneha' : 'divya');
      const avatarA = AVATARS.find(a => a.id === idA) || AVATARS[0];
      const avatarB = AVATARS.find(a => a.id === idB) || AVATARS[1];
      return { avatarA, avatarB };
    },
    [invitedAvatars, effectiveHostId, floatingMentorId]
  );

  // Speak with neural TTS engine (shared with AI Interview Studio) + strict anti-echo mic lock
  const speakWithAvatar = useCallback(
    async (text: string, avatarId: string, onEnd?: () => void) => {
      if (sessionEndedRef.current) return;
      stopSpeaking();
      stopMicHardware(); // Strict anti-echo: never listen while an avatar or host is speaking

      const mySession = speechSessionRef.current;
      const avatar = AVATARS.find(a => a.id === avatarId) || AVATARS[0];
      const cleanText = text.replace(/[*#_`~]/g, '').trim();

      isSpeechOutputActiveRef.current = true;
      setActiveSpeakingAvatar(avatar.name);

      let finished = false;
      const finish = () => {
        if (finished || mySession !== speechSessionRef.current) return;
        finished = true;
        isSpeechOutputActiveRef.current = false;
        setActiveSpeakingAvatar(null);
        if (onEnd && !sessionEndedRef.current) onEnd();
      };

      try {
        setAvatarVoiceVolume(volumeRef.current / 100);
        await engineSpeakWithAvatar(
          cleanText,
          avatar.id,
          () => {
            if (mySession === speechSessionRef.current) {
              setActiveSpeakingAvatar(avatar.name);
            }
          },
          finish,
          volumeRef.current <= 0,
          true,
          difficulty === 'medium' ? 'normal' : difficulty,
          1.03,
          16000
        );
      } catch {
        const approxMs = Math.max(1800, Math.min(5500, cleanText.split(/\s+/).length * 150));
        setTimeout(finish, approxMs);
      }
    },
    [stopSpeaking, stopMicHardware, difficulty]
  );

  // Start anti-echo SpeechRecognition ONLY during user turn (and only when not paused by user)
  const startUserMic = useCallback(async () => {
    if (sessionEndedRef.current || !isUserTurnRef.current || isSpeechOutputActiveRef.current || micPausedByUserRef.current) {
      return;
    }
    if (typeof window === 'undefined') return;

    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) return;

    // Stop any previous instance cleanly
    if (recognitionRef.current) {
      try {
        recognitionRef.current.onend = null;
        recognitionRef.current.abort?.();
      } catch {}
      recognitionRef.current = null;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (!isUserTurnRef.current || isSpeechOutputActiveRef.current || sessionEndedRef.current) {
        stream.getTracks().forEach(t => t.stop());
        return;
      }
      setActiveStream(stream);
    } catch {
      // Mic permission denied -> user can still type seamlessly
      micActiveRef.current = false;
      setMicActive(false);
      return;
    }

    try {
      const rec = new SpeechRec();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-IN';

      rec.onresult = (event: any) => {
        if (!isUserTurnRef.current || isSpeechOutputActiveRef.current) return;
        let finalChunk = '';
        let interimChunk = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const piece = event.results[i][0]?.transcript || '';
          if (event.results[i].isFinal) {
            finalChunk += `${piece} `;
          } else {
            interimChunk += piece;
          }
        }
        if (finalChunk.trim()) {
          pendingTranscriptRef.current = `${pendingTranscriptRef.current} ${finalChunk}`.replace(/\s+/g, ' ').trim();
          setInputText(pendingTranscriptRef.current);
        }
        const combinedPreview = `${pendingTranscriptRef.current} ${interimChunk}`.replace(/\s+/g, ' ').trim();
        setLiveTranscript(combinedPreview);
      };

      rec.onerror = (event: any) => {
        if (event?.error === 'not-allowed' || event?.error === 'service-not-allowed') {
          micActiveRef.current = false;
          setMicActive(false);
        }
      };

      rec.onend = () => {
        if (
          micActiveRef.current &&
          isUserTurnRef.current &&
          !isSpeechOutputActiveRef.current &&
          !micPausedByUserRef.current &&
          !sessionEndedRef.current
        ) {
          try {
            rec.start();
          } catch {}
        }
      };

      recognitionRef.current = rec;
      micActiveRef.current = true;
      setMicActive(true);
      rec.start();
    } catch {
      micActiveRef.current = false;
      setMicActive(false);
    }
  }, []);

  const toggleMic = useCallback(() => {
    if (!isUserTurnRef.current) return;
    if (micActiveRef.current) {
      micPausedByUserRef.current = true;
      setMicPausedByUser(true);
      stopMicHardware();
    } else {
      micPausedByUserRef.current = false;
      setMicPausedByUser(false);
      void startUserMic();
    }
  }, [stopMicHardware, startUserMic]);

  // Open floor cleanly for the User (NO fake speech fabrication on silence!)
  const openUserFloor = useCallback(() => {
    if (sessionEndedRef.current) return;
    clearSilenceTimer();
    pendingTranscriptRef.current = '';
    setLiveTranscript('');
    isUserTurnRef.current = true;
    setIsUserTurn(true);
    setTurnPhase('user');
    setHandRaised(false);
    setCandidateTurnTimer(45);
    gentleNudgeSentRef.current = false;

    const { avatarA, avatarB } = resolveActivePair(turnIndexRef.current);
    setCurrentAvatarARoleId(avatarA.id);
    setCurrentAvatarBRoleId(avatarB.id);

    if (!micPausedByUserRef.current) {
      void startUserMic();
    }
  }, [clearSilenceTimer, resolveActivePair, startUserMic]);

  // Host between-talk time-check interruption (5 minutes left & 1 minute left)
  const deliverHostTimeWarning = useCallback(
    (kind: '5min' | '1min', onAfter: () => void) => {
      if (sessionEndedRef.current) return;
      const host = AVATARS.find(a => a.id === effectiveHostId) || AVATARS[0];
      const text =
        kind === '5min'
          ? hostFiveMinuteWarningScript(host.name, roomName || 'this topic')
          : hostOneMinuteWarningScript(host.name, roomName || 'this topic');

      setActiveTimeAlert(kind);
      setTurnPhase('host_time_check');
      isUserTurnRef.current = false;
      setIsUserTurn(false);
      setCandidateTurnTimer(null);
      stopMicHardware();

      if (kind === '5min') {
        toast.warning('🔔 5 Minutes Remaining', `${host.name} stepped in with a time check.`);
      } else {
        toast.error('🚨 Final 1 Minute Remaining', `${host.name} stepped in with a closing time check.`);
      }

      appendMessage({
        sender: host.name,
        role: kind === '5min' ? 'Host • 5-Min Check' : 'Host • 1-Min Warning',
        content: text,
        emoji: '🔔',
        tag: 'time_check',
      });

      void speakWithAvatar(text, host.id, () => {
        if (!sessionEndedRef.current) {
          onAfter();
        }
      });
    },
    [effectiveHostId, roomName, stopMicHardware, appendMessage, speakWithAvatar]
  );

  // Helper: Drain any queued 5-min or 1-min host warning strictly BETWEEN turns
  const runWithBetweenTalkWarning = useCallback(
    (nextAction: () => void) => {
      const pending = pendingHostWarningRef.current;
      if (pending && !sessionEndedRef.current) {
        pendingHostWarningRef.current = null;
        deliverHostTimeWarning(pending, nextAction);
        return;
      }
      nextAction();
    },
    [deliverHostTimeWarning]
  );

  // Call /api/group-discussion/bot-reply using dedicated Groq API Key slot ('a' = Key 1, 'b' = Key 2)
  const fetchBotTurn = useCallback(
    async (params: {
      roleType: 'avatar_a' | 'avatar_b';
      slot: 'a' | 'b';
      mentorId: string;
      history: GdMessage[];
      lastChallengerName?: string;
      lastChallengerText?: string;
    }): Promise<{ reply: string; keySlot: 'key_1' | 'key_2' }> => {
      const res = await fetch('/api/group-discussion/bot-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(await getAuthHeaders()) },
        body: JSON.stringify({
          roleType: params.roleType,
          slot: params.slot,
          mentorId: params.mentorId,
          topic: roomName,
          objective,
          domain,
          difficulty,
          candidateName: user?.name || 'Candidate',
          lastChallengerName: params.lastChallengerName,
          lastChallengerText: params.lastChallengerText,
          history: params.history.slice(-10).map(m => ({
            role: m.tag === 'user' || m.sender === 'You' ? 'user' : 'assistant',
            sender: m.sender,
            content: m.content,
          })),
        }),
      });

      if (!res.ok) {
        throw new Error(`BOT_REPLY_HTTP_${res.status}`);
      }
      const data = await res.json();
      return {
        reply: typeof data.reply === 'string' && data.reply.trim()
          ? data.reply.trim()
          : 'That is a fair point, though we should test the hidden trade-offs before committing. What metric would convince you first?',
        keySlot: data.keySlot === 'key_2' ? 'key_2' : 'key_1',
      };
    },
    [roomName, objective, domain, difficulty, user]
  );

  // Execute strict loop after User speaks:
  // User -> Avatar 1 (Key 1, Argues/Challenges) -> [Between-talk warning if queued] -> Avatar 2 (Key 2, Prefetched in parallel!, Diplomat for BOTH) -> [Between-talk warning if queued] -> User
  const triggerPanelExchange = useCallback(
    async (updatedTranscript: GdMessage[]) => {
      if (sessionEndedRef.current) return;

      const { avatarA, avatarB } = resolveActivePair(turnIndexRef.current);
      setCurrentAvatarARoleId(avatarA.id);
      setCurrentAvatarBRoleId(avatarB.id);
      setLoading(true);
      setTurnPhase('avatar_a');
      avatarBPromiseRef.current = null;

      try {
        // 1. AVATAR 1 (CHALLENGER) -> Dedicated Groq API Key 1 (`slot: 'a'`)
        const resultA = await fetchBotTurn({
          roleType: 'avatar_a',
          slot: 'a',
          mentorId: avatarA.id,
          history: updatedTranscript,
        });

        if (sessionEndedRef.current) return;
        setLastKeySlotsUsed(prev => ({ ...prev, avatarA: resultA.keySlot }));

        const msgA: GdMessage = {
          sender: avatarA.name,
          role: 'Challenger • Avatar 1',
          content: resultA.reply,
          emoji: avatarA.emoji,
          tag: 'challenger',
          keySlot: resultA.keySlot,
        };
        const transcriptWithA = appendMessage(msgA);
        setLoading(false);

        // 2. IMMEDIATELY prefetch AVATAR 2 (DIPLOMAT) on Dedicated Groq API Key 2 (`slot: 'b'`)
        //    in parallel while Avatar 1 is speaking -> ZERO perceived delay between Avatar 1 and Avatar 2!
        avatarBPromiseRef.current = fetchBotTurn({
          roleType: 'avatar_b',
          slot: 'b',
          mentorId: avatarB.id,
          history: transcriptWithA,
          lastChallengerName: avatarA.name,
          lastChallengerText: resultA.reply,
        }).catch(() => ({
          reply: `Both views add value here: your focus sets clear intent while ${avatarA.name}'s challenge guards against blind spots. Combining a small pilot with clear guardrails bridges both—Candidate, you have the floor.`,
          keySlot: 'key_2' as const,
        }));

        const proceedToAvatarB = async () => {
          if (sessionEndedRef.current) return;
          setTurnPhase('avatar_b');

          let resultB: { reply: string; keySlot?: 'key_1' | 'key_2' };
          try {
            if (!avatarBPromiseRef.current) {
              setLoading(true);
              resultB = await fetchBotTurn({
                roleType: 'avatar_b',
                slot: 'b',
                mentorId: avatarB.id,
                history: messagesRef.current,
                lastChallengerName: avatarA.name,
                lastChallengerText: resultA.reply,
              });
            } else {
              resultB = await avatarBPromiseRef.current;
            }
          } finally {
            setLoading(false);
            avatarBPromiseRef.current = null;
          }

          if (sessionEndedRef.current) return;
          setLastKeySlotsUsed(prev => ({ ...prev, avatarB: resultB.keySlot || 'key_2' }));

          const msgB: GdMessage = {
            sender: avatarB.name,
            role: 'Diplomat • Avatar 2',
            content: resultB.reply,
            emoji: avatarB.emoji,
            tag: 'diplomat',
            keySlot: resultB.keySlot || 'key_2',
          };
          appendMessage(msgB);

          // Speak Avatar 2, then check for between-talk host warning, then return floor to User
          void speakWithAvatar(resultB.reply, avatarB.id, () => {
            if (sessionEndedRef.current) return;
            turnIndexRef.current += 1;
            setTurnCount(turnIndexRef.current);
            runWithBetweenTalkWarning(() => {
              openUserFloor();
            });
          });
        };

        // Speak Avatar 1, then check for between-talk host warning, then immediately play Avatar 2
        void speakWithAvatar(resultA.reply, avatarA.id, () => {
          if (sessionEndedRef.current) return;
          runWithBetweenTalkWarning(() => {
            void proceedToAvatarB();
          });
        });
      } catch (err) {
        console.error('[GD Orchestrator] Exchange error:', err);
        setLoading(false);
        openUserFloor();
      }
    },
    [resolveActivePair, fetchBotTurn, appendMessage, speakWithAvatar, runWithBetweenTalkWarning, openUserFloor]
  );

  // Submit User's actual spoken or typed contribution (NEVER fabricates fake text!)
  const submitUserContribution = useCallback(
    (rawContent: string) => {
      const content = rawContent.trim();
      if (!content || sessionEndedRef.current || loadingRef.current) return;

      clearSilenceTimer();
      stopMicHardware();
      isUserTurnRef.current = false;
      setIsUserTurn(false);
      setCandidateTurnTimer(null);
      setInputText('');
      setLiveTranscript('');
      pendingTranscriptRef.current = '';
      setSuggestedHelperText('');

      const userMsg: GdMessage = {
        sender: 'You',
        role: 'Participant',
        content,
        emoji: '🎓',
        tag: 'user',
      };
      const nextMessages = appendMessage(userMsg);

      // If a Host 5-min or 1-min warning arrived while user was speaking, deliver it cleanly right after user finishes!
      runWithBetweenTalkWarning(() => {
        void triggerPanelExchange(nextMessages);
      });
    },
    [clearSilenceTimer, stopMicHardware, appendMessage, runWithBetweenTalkWarning, triggerPanelExchange]
  );

  // User clicks "Done Speaking" or submits voice/text draft (preserves trailing interim spoken words!)
  const handleUserFinishSpeaking = useCallback(() => {
    const typed = inputTextRef.current.trim();
    const spoken = liveTranscriptRef.current.trim();
    const draft =
      spoken && (!typed || (spoken.length > typed.length && spoken.toLowerCase().startsWith(typed.toLowerCase())))
        ? spoken
        : (typed || spoken || pendingTranscriptRef.current).trim();
    if (!draft) {
      toast.info('Share a quick point first', 'Speak into your mic, type a short reply, or click any quick starter chip below.');
      return;
    }
    submitUserContribution(draft);
  }, [submitUserContribution]);

  // Form submit handler
  const handleSendMessage = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const draft = (inputTextRef.current || liveTranscriptRef.current).trim();
      if (!draft) return;
      submitUserContribution(draft);
    },
    [submitUserContribution]
  );

  // User cuts in politely during avatar speech
  const handleInterjectImmediately = useCallback(() => {
    if (sessionEndedRef.current) return;
    stopSpeaking();
    avatarBPromiseRef.current = null;
    setLoading(false);
    toast.info('Floor claimed', 'You have the floor — share your counterpoint or question.');
    openUserFloor();
  }, [stopSpeaking, openUserFloor]);

  // Helper: pick an engaging starter prompt for the current topic
  const handleSuggestArgument = useCallback(() => {
    const matched = SUGGESTED_TOPICS.find(
      t => t.title.toLowerCase() === roomName.trim().toLowerCase() || t.domain === domain
    );
    const pool = matched?.starterPrompts || [
      `On "${roomName}", the smartest move is starting with a measurable pilot before scaling blindly.`,
      `What is the biggest real-world risk in "${roomName}" that people usually overlook?`,
      `I see both sides of "${roomName}", so how do we balance short-term cost with long-term value?`,
    ];
    const picked = pool[Math.floor(Math.random() * pool.length)];
    setSuggestedHelperText(picked);
  }, [roomName, domain]);

  // Generate honest, authenticated GD Performance Report (with getAuthHeaders()!)
  const executeReportGeneration = useCallback(async () => {
    sessionEndedRef.current = true;
    setTurnPhase('ending');
    clearSilenceTimer();
    stopSpeaking();
    stopMicHardware();
    isUserTurnRef.current = false;
    setIsUserTurn(false);
    setCandidateTurnTimer(null);
    setLoading(true);

    const finalTranscript = messagesRef.current;

    try {
      const res = await fetch('/api/group-discussion/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(await getAuthHeaders()),
        },
        body: JSON.stringify({
          concept: roomName,
          domain,
          transcript: finalTranscript,
        }),
      });
      const data = await res.json();
      const parsedReport: GdReportData = {
        score: Number.isFinite(Number(data?.score)) ? Number(data.score) : 0,
        verdict: typeof data?.verdict === 'string' && data.verdict.trim()
          ? data.verdict
          : 'Evaluation completed based on recorded discussion turns.',
        gapsIdentified: Array.isArray(data?.gapsIdentified) ? data.gapsIdentified : [],
        keyMoments: Array.isArray(data?.keyMoments) ? data.keyMoments : [],
        evaluated: data?.evaluated !== false,
      };
      setReport(parsedReport);
      saveHistorySession(parsedReport, finalTranscript);
    } catch {
      const fallbackReport: GdReportData = {
        score: 0,
        evaluated: false,
        verdict: 'Could not reach the evaluator right now. Your full transcript is preserved below.',
        gapsIdentified: ['Check your connection and retry generating the report.'],
        keyMoments: [],
      };
      setReport(fallbackReport);
      saveHistorySession(fallbackReport, finalTranscript);
    } finally {
      setLoading(false);
      setStep('report');
      onSessionComplete?.();
    }
  }, [roomName, domain, clearSilenceTimer, stopSpeaking, stopMicHardware, saveHistorySession, setStep, onSessionComplete]);

  const handleEndCall = useCallback(() => {
    void executeReportGeneration();
  }, [executeReportGeneration]);

  const handleForceExit = useCallback(() => {
    sessionEndedRef.current = true;
    clearSilenceTimer();
    stopSpeaking();
    stopMicHardware();
    isUserTurnRef.current = false;
    setIsUserTurn(false);
    setCandidateTurnTimer(null);
    setStep('setup');
    if (embedded) {
      router.replace('/interview?tab=gd');
    } else {
      router.replace('/group-discussion');
    }
  }, [clearSilenceTimer, stopSpeaking, stopMicHardware, setStep, embedded, router]);

  // Master GD Countdown Timer + 5-Minute & 1-Minute Host Interruptions
  useEffect(() => {
    if (step !== 'call_grid') return;

    const totalSeconds = Math.max(60, sessionDurationMinutes * 60);
    const interval = setInterval(() => {
      if (sessionEndedRef.current) return;

      setCallDuration(prev => {
        const next = prev + 1;
        const remaining = Math.max(0, totalSeconds - next);

        // 1. Host 5-minute remaining interruption (only when session > 5 minutes)
        if (totalSeconds > 300 && remaining <= 300 && remaining > 60 && !fiveMinAnnouncedRef.current) {
          fiveMinAnnouncedRef.current = true;
          const userIdle =
            turnPhaseRef.current === 'user' &&
            !inputTextRef.current.trim() &&
            !liveTranscriptRef.current.trim();
          if (userIdle) {
            deliverHostTimeWarning('5min', () => openUserFloor());
          } else {
            pendingHostWarningRef.current = '5min';
          }
        }

        // 2. Host 1-minute remaining interruption
        if (remaining <= 60 && remaining > 0 && !oneMinAnnouncedRef.current) {
          oneMinAnnouncedRef.current = true;
          const userIdle =
            turnPhaseRef.current === 'user' &&
            !inputTextRef.current.trim() &&
            !liveTranscriptRef.current.trim();
          if (userIdle) {
            deliverHostTimeWarning('1min', () => openUserFloor());
          } else {
            pendingHostWarningRef.current = '1min';
          }
        }

        // 3. Session duration complete -> gracefully conclude
        if (remaining === 0 && !sessionEndedRef.current) {
          sessionEndedRef.current = true;
          setTimeout(() => {
            void executeReportGeneration();
          }, 500);
        }

        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [step, sessionDurationMinutes, deliverHostTimeWarning, openUserFloor, executeReportGeneration]);

  // Gentle Turn Pacing Timer during User's turn (NEVER fabricates fake user speech!)
  useEffect(() => {
    if (step !== 'call_grid' || !isUserTurn || candidateTurnTimer === null) return;
    if (candidateTurnTimer <= 0) {
      if (!gentleNudgeSentRef.current && !inputTextRef.current.trim() && !liveTranscriptRef.current.trim()) {
        gentleNudgeSentRef.current = true;
        const host = AVATARS.find(a => a.id === effectiveHostId) || AVATARS[0];
        const nudge = hostGentleNudgeScript(host.name, user?.name || 'Candidate', roomName || 'this topic');
        appendMessage({
          sender: host.name,
          role: 'Host • Floor Check',
          content: nudge,
          emoji: host.emoji,
          tag: 'host',
        });
        void speakWithAvatar(nudge, host.id, () => {
          if (!sessionEndedRef.current) {
            isUserTurnRef.current = true;
            setIsUserTurn(true);
            setTurnPhase('user');
            setCandidateTurnTimer(null); // Stay unhurried after one gentle reminder
            if (!micPausedByUserRef.current) {
              void startUserMic();
            }
          }
        });
      }
      return;
    }

    const t = setTimeout(() => {
      // Pause countdown while user is actively speaking or typing
      if (inputTextRef.current.trim() || liveTranscriptRef.current.trim()) return;
      setCandidateTurnTimer(prev => (prev !== null && prev > 0 ? prev - 1 : prev));
    }, 1000);

    return () => clearTimeout(t);
  }, [step, isUserTurn, candidateTurnTimer, effectiveHostId, user, roomName, appendMessage, speakWithAvatar, startUserMic]);

  // Export transcript as Markdown or JSON
  const handleExportTranscript = useCallback(
    (format: 'markdown' | 'json') => {
      const data = messagesRef.current;
      const safeName = (roomName || 'group-discussion').replace(/[^a-z0-9-_]+/gi, '_').toLowerCase();
      let blob: Blob;
      let ext: string;

      if (format === 'json') {
        blob = new Blob([JSON.stringify({ topic: roomName, domain, durationSeconds: callDuration, transcript: data }, null, 2)], {
          type: 'application/json',
        });
        ext = 'json';
      } else {
        const md = [
          `# Group Discussion Minutes: ${roomName}`,
          `- **Domain**: ${domain}`,
          `- **Duration**: ${Math.floor(callDuration / 60)}m ${callDuration % 60}s`,
          '',
          ...data.map(m => `**${m.sender}** (${m.role}): ${m.content}`),
        ].join('\n\n');
        blob = new Blob([md], { type: 'text/markdown' });
        ext = 'md';
      }

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${safeName}_gd.${ext}`;
      a.click();
      URL.revokeObjectURL(url);
    },
    [roomName, domain, callDuration]
  );

  // Start GD Room: Pin check -> Host Intro & Rules -> User Floor
  const handleStartCall = async (bypassPinGate = false) => {
    if (!roomName.trim()) {
      toast.warning('Choose a GD Topic', 'Pick a topic or enter your own before launching.');
      return;
    }

    if (!isUnlocked && !bypassPinGate && spendPins) {
      const ok = await spendPins(25, `Group Discussion: ${roomName}`);
      if (!ok) {
        setShowPinsGate(true);
        return;
      }
      setIsUnlocked(true);
    } else if (bypassPinGate) {
      setIsUnlocked(true);
    }

    // Ensure at least 2 panelists + host exist, and Host is NEVER the user's AI Mentor
    const hostToUse = resolveGdHostId(floatingMentorId, hostId);
    if (hostToUse !== hostId) setHostId(hostToUse);

    const currentPanelists = invitedAvatars.filter(id => id !== hostToUse);
    if (currentPanelists.length < 2) {
      const extras = AVATARS.map(a => a.id).filter(id => id !== hostToUse && id !== floatingMentorId && !currentPanelists.includes(id));
      const finalInvited = [hostToUse, ...currentPanelists, ...extras].slice(0, 3);
      setInvitedAvatars(finalInvited);
    } else if (!invitedAvatars.includes(hostToUse)) {
      setInvitedAvatars(prev => [hostToUse, ...prev]);
    }

    // Reset all state cleanly for the new session
    sessionEndedRef.current = false;
    fiveMinAnnouncedRef.current = false;
    oneMinAnnouncedRef.current = false;
    pendingHostWarningRef.current = null;
    gentleNudgeSentRef.current = false;
    turnIndexRef.current = 0;
    avatarBPromiseRef.current = null;
    pendingTranscriptRef.current = '';
    messagesRef.current = [];
    micPausedByUserRef.current = false;

    setMessages([]);
    setReport(null);
    setInputText('');
    setLiveTranscript('');
    setSuggestedHelperText('');
    setCallDuration(0);
    setTurnCount(0);
    setActiveTimeAlert(null);
    setMicPausedByUser(false);
    setTurnPhase('host_intro');
    isUserTurnRef.current = false;
    setIsUserTurn(false);
    setCandidateTurnTimer(null);
    setStep('call_grid');

    if (embedded) {
      router.push('/interview?tab=gd&call=true');
    } else {
      router.push('/group-discussion?call=true');
    }

    // Brief sync pause, then Host delivers intro + common GD room rules -> hands floor to User
    const host = AVATARS.find(a => a.id === hostToUse) || AVATARS[0];
    const { avatarA, avatarB } = resolveActivePair(0);
    setCurrentAvatarARoleId(avatarA.id);
    setCurrentAvatarBRoleId(avatarB.id);

    const introText = hostIntroScript(host.name, roomName, objective, sessionDurationMinutes);

    setTimeout(() => {
      if (sessionEndedRef.current) return;
      appendMessage({
        sender: host.name,
        role: 'GD Host • Intro & Rules',
        content: introText,
        emoji: host.emoji,
        tag: 'host',
      });

      void speakWithAvatar(introText, host.id, () => {
        if (!sessionEndedRef.current) {
          openUserFloor();
        }
      });
    }, 900);
  };

  return {
    messages,
    inputText,
    setInputText,
    liveTranscript,
    loading,
    activeSpeakingAvatar,
    report,
    turnPhase,
    activeTimeAlert,
    turnCount,
    showPinsGate,
    setShowPinsGate,
    isUnlocked,
    setIsUnlocked,
    handRaised,
    setHandRaised,
    callDuration,
    isUserTurn,
    candidateTurnTimer,
    currentAvatarARoleId,
    currentAvatarBRoleId,
    micActive,
    micPausedByUser,
    activeStream,
    suggestedHelperText,
    setSuggestedHelperText,
    historyList,
    selectedHistorySession,
    setSelectedHistorySession,
    deleteHistorySession,
    floatingMentorId,
    eligibleHostIds,
    effectiveHostId,
    lastKeySlotsUsed,
    bottomRef,
    handleStartCall,
    handleSendMessage,
    submitUserContribution,
    handleUserFinishSpeaking,
    handleInterjectImmediately,
    handleSuggestArgument,
    handleEndCall,
    handleForceExit,
    handleExportTranscript,
    toggleMic,
    setRoomName,
    setObjective,
    setDomain,
  };
}
