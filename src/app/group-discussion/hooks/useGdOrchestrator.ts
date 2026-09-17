'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from '@/lib/store/useAppStore';
import { speakWithAvatar, stopSpeaking } from '@/lib/tts';
import {
  GD_MAX_SPEAK_MS,
  GD_SPEAK_MS,
  gdDisplayName,
  hostEndScript,
  hostFiveMinuteScript,
  hostIntroScript,
  hostThirtySecondScript,
  pickRandomSpeakerPair,
} from '@/lib/group-discussion/gdTurnEngine';
import { AVATARS, GdAvatar, getAuthHeaders } from '../constants';
import { GdChatMessage } from '../components/GdTranscriptDrawer';
import { GdHistoryRecord } from '../components/GdHistoryModal';

interface UseGdOrchestratorProps {
  user: any;
  cOS: any;
  roomName: string;
  roomDesc: string;
  selectedConcept: string;
  domain: 'technical' | 'sales' | 'business';
  difficulty: 'easy' | 'medium' | 'hard';
  sessionDurationMinutes: number;
  invitedAvatars: string[];
  setInvitedAvatars: React.Dispatch<React.SetStateAction<string[]>>;
  currentMentorId: string;
  gdHostId: string;
  filteredAvatars: GdAvatar[];
  setStep: (step: 'create_room' | 'invite_concept' | 'call_grid') => void;
  onRecordSaved?: (record: GdHistoryRecord) => void;
}

export function useGdOrchestrator({
  user,
  cOS,
  roomName,
  roomDesc,
  selectedConcept,
  domain,
  difficulty,
  sessionDurationMinutes,
  invitedAvatars,
  setInvitedAvatars,
  currentMentorId,
  gdHostId,
  filteredAvatars,
  setStep,
  onRecordSaved
}: UseGdOrchestratorProps) {
  const router = useRouter();

  // Active Avatar & Roles
  const [activeSpeakingAvatar, setActiveSpeakingAvatar] = useState<string | null>(null);
  const [currentAvatarARoleId, setCurrentAvatarARoleId] = useState<string | null>(null);
  const [currentAvatarBRoleId, setCurrentAvatarBRoleId] = useState<string | null>(null);
  const [isUserTurn, setIsUserTurn] = useState(false);
  const [activeHostId, setActiveHostId] = useState(gdHostId);

  // Call States
  const [callActive, setCallActive] = useState(false);
  const [messages, setMessages] = useState<GdChatMessage[]>([]);
  const [turnCount, setTurnCount] = useState(0);
  const [handRaised, setHandRaised] = useState(false);
  const [suggestedHelperText, setSuggestedHelperText] = useState('');
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [gdReport, setGdReport] = useState<any | null>(null);
  const [callDuration, setCallDuration] = useState(0);

  // Speech Recognition & Hands-free Turn-taking state
  const [micActive, setMicActive] = useState(false);
  const [candidateTurnTimer, setCandidateTurnTimer] = useState<number | null>(null);

  // Refs
  const callTimerRef = useRef<any>(null);
  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<any>(null);
  const turnTimeoutRef = useRef<any>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const reportRef = useRef<HTMLDivElement>(null);
  const turnSequenceRef = useRef<'user' | 'avatar_first' | 'avatar_second'>('user');
  const isCallActiveRef = useRef(false);
  const handRaisedRef = useRef(false);
  const preloadedAvatarBDataRef = useRef<{ avatarB_Id: string; cleanReply: string; nextMessages: GdChatMessage[] } | null>(null);
  const avatarBPromiseRef = useRef<Promise<any> | null>(null);
  const consecutiveSilenceCountRef = useRef<number>(0);
  const handleUserFinishSpeakingRef = useRef<(userText?: string) => void>(() => {});
  const handleSendVoiceMessageRef = useRef<(text: string) => void>(() => {});
  const hostIdRef = useRef<string>(gdHostId);
  const speakerPairRef = useRef<{ a: string; b: string } | null>(null);
  const lastPairRef = useRef<{ a?: string; b?: string } | null>(null);
  const consecutiveAvatarTurnsRef = useRef(0);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  // Pre-warm browser speech synthesis voices
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.getVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => {
          window.speechSynthesis.getVoices();
        };
      }
    }
  }, []);

  // Sync refs
  useEffect(() => {
    isCallActiveRef.current = callActive;
  }, [callActive]);

  useEffect(() => {
    handRaisedRef.current = handRaised;
  }, [handRaised]);

  // Scroll messages to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Smooth scroll to report on completion
  useEffect(() => {
    if (gdReport) {
      setTimeout(() => {
        reportRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);
    }
  }, [gdReport]);

  // Master Unmount Cleanup Effect: Stop all background timers, mic, media streams, WebGL, and TTS
  useEffect(() => {
    return () => {
      if (callTimerRef.current) clearInterval(callTimerRef.current);
      if (turnTimeoutRef.current) clearInterval(turnTimeoutRef.current);
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);

      if (recognitionRef.current) {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        try { recognitionRef.current.stop(); } catch {}
        recognitionRef.current = null;
      }

      // Stop mic tracks
      if (mediaStreamRef.current) {
        try {
          mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        } catch {}
        mediaStreamRef.current = null;
      }

      // Close AudioContext — CRITICAL: browsers limit to 6 per page
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        try {
          audioContextRef.current.close().catch(() => {});
        } catch {}
        audioContextRef.current = null;
      }

      // Disconnect analyser
      if (analyserRef.current) {
        try {
          analyserRef.current.disconnect();
        } catch {}
        analyserRef.current = null;
      }

      // WebGL context cleanup
      if (typeof document !== 'undefined') {
        const canvases = document.querySelectorAll('canvas');
        canvases.forEach(canvas => {
          try {
            const gl = canvas.getContext('webgl') || canvas.getContext('webgl2');
            if (gl) {
              const ext = gl.getExtension('WEBGL_lose_context');
              if (ext) ext.loseContext();
            }
          } catch {}
        });
      }

      stopSpeaking();
    };
  }, []);

  // Initialize Speech Recognition API
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = true;
        rec.interimResults = true;
        rec.lang = 'en-US';

        rec.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }

          if (currentTranscript.trim() && isCallActiveRef.current) {
            if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
            silenceTimerRef.current = setTimeout(() => {
              const finalTranscript = currentTranscript.trim();
              if (finalTranscript) {
                try { rec.stop(); } catch {}
                handleSendVoiceMessageRef.current(finalTranscript);
              }
            }, 2500);
          }
        };

        rec.onerror = (e: any) => {
          console.warn('[SpeechRec] error:', e.error);
          if (e.error === 'no-speech') return;
          setMicActive(false);
        };

        rec.onend = () => {
          if (isCallActiveRef.current && turnSequenceRef.current === 'user') {
            try { rec.start(); } catch {}
          } else {
            setMicActive(false);
          }
        };

        recognitionRef.current = rec;
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        try { recognitionRef.current.stop(); } catch {}
        recognitionRef.current = null;
      }
      // Stop mic tracks
      if (mediaStreamRef.current) {
        try {
          mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        } catch {}
        mediaStreamRef.current = null;
      }
      // Close AudioContext — CRITICAL: browsers limit to 6 per page
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        try {
          audioContextRef.current.close().catch(() => {});
        } catch {}
        audioContextRef.current = null;
      }
      // Disconnect analyser
      if (analyserRef.current) {
        try {
          analyserRef.current.disconnect();
        } catch {}
        analyserRef.current = null;
      }
    };
  }, []);

  const startCandidateTurnPrompt = useCallback(() => {
    if (!isCallActiveRef.current) return;
    if (turnTimeoutRef.current) clearInterval(turnTimeoutRef.current);
    setSuggestedHelperText('');
    setIsUserTurn(true);

    if (handRaisedRef.current) {
      handRaisedRef.current = false;
      setHandRaised(false);
    }

    // Set 25s turn duration for candidate
    setCandidateTurnTimer(25);

    // Auto start microphone capture for candidate turn
    if (recognitionRef.current && !micActive) {
      try {
        recognitionRef.current.start();
        setMicActive(true);
      } catch (err) {
        console.warn('Auto Speech recognition start error:', err);
      }
    }

    turnTimeoutRef.current = setInterval(() => {
      setCandidateTurnTimer(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(turnTimeoutRef.current);
          setCandidateTurnTimer(null);

          if (silenceTimerRef.current) {
            setCandidateTurnTimer(3);
            turnTimeoutRef.current = setTimeout(() => {
              if (recognitionRef.current) {
                try { recognitionRef.current.stop(); } catch {}
              }
              setMicActive(false);
              setCandidateTurnTimer(null);
              handleUserFinishSpeakingRef.current();
            }, 3000);
            return null;
          }

          if (recognitionRef.current) {
            try { recognitionRef.current.stop(); } catch {}
          }
          setMicActive(false);

          handleUserFinishSpeakingRef.current();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  }, [micActive]);

  const handleCandidateSilenceTimeout = () => {
    if (!isCallActiveRef.current) return;
    if (turnTimeoutRef.current) clearInterval(turnTimeoutRef.current);
    setCandidateTurnTimer(null);
    setIsUserTurn(false);

    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
    }
    setMicActive(false);

    consecutiveSilenceCountRef.current += 1;
    const hostId = hostIdRef.current;
    const hostAvatar = AVATARS.find(a => a.id === hostId) || AVATARS[0];
    const calloutText = `Candidate, we haven't heard your pitch on ${roomName || 'this topic'} yet. Please share your view in simple words.`;

    setMessages(prev => [...prev, {
      sender: gdDisplayName(hostId),
      role: `${hostAvatar.role} (Call Out)`,
      content: calloutText,
      emoji: hostAvatar.emoji
    }]);

    toast.warning("Candidate Prompted", "The host is waiting for your input!");

    speakWithAvatar(calloutText, hostId,
      () => {
        setMicActive(false);
        setActiveSpeakingAvatar(gdDisplayName(hostId));
      },
      () => {
        setActiveSpeakingAvatar(null);
        turnSequenceRef.current = 'user';
        startCandidateTurnPrompt();
      },
      false,
      false
    );
  };

  const passFloorToCandidateAfterAvatarB = () => {
    lastPairRef.current = speakerPairRef.current;
    setCurrentAvatarARoleId(null);
    setCurrentAvatarBRoleId(null);
    turnSequenceRef.current = 'user';

    consecutiveAvatarTurnsRef.current += 1;
    if (consecutiveAvatarTurnsRef.current >= 3) {
      consecutiveAvatarTurnsRef.current = 0;
      const hostId = hostIdRef.current;
      const hostAvatar = AVATARS.find(a => a.id === hostId) || AVATARS[0];
      const forceText = `${user?.displayName || 'Candidate'}, we need to hear your perspective on ${roomName}. You have 40 seconds — please share your view now.`;
      setMessages(prev => [...prev, {
        sender: gdDisplayName(hostId),
        role: `${hostAvatar.role} (Mandatory Turn)`,
        content: forceText,
        emoji: hostAvatar.emoji
      }]);
      speakWithAvatar(forceText, hostId,
        () => setActiveSpeakingAvatar(gdDisplayName(hostId)),
        () => {
          setActiveSpeakingAvatar(null);
          setCandidateTurnTimer(40);
          startCandidateTurnPrompt();
        },
        false, false
      );
    } else {
      startCandidateTurnPrompt();
    }
  };

  const triggerPreloadedAvatarBReply = (
    avatarId: string,
    cleanReply: string,
    historyMessages: GdChatMessage[]
  ) => {
    if (!isCallActiveRef.current) return;
    const nextSpeaker = AVATARS.find(a => a.id === avatarId);
    if (!nextSpeaker) return;

    const newMsg: GdChatMessage = {
      sender: nextSpeaker.name,
      role: `${nextSpeaker.role} (Avatar B)`,
      content: cleanReply,
      emoji: nextSpeaker.emoji
    };
    const nextMessages = [...historyMessages, newMsg];
    setMessages(nextMessages);

    speakWithAvatar(cleanReply, avatarId,
      () => {
        if (recognitionRef.current) {
          try { recognitionRef.current.stop(); } catch {}
        }
        setMicActive(false);
        setActiveSpeakingAvatar(nextSpeaker.name);
      },
      () => {
        setActiveSpeakingAvatar(null);

        if (handRaisedRef.current) {
          handRaisedRef.current = false;
          setHandRaised(false);
          avatarBPromiseRef.current = null;
          preloadedAvatarBDataRef.current = null;
          setCurrentAvatarARoleId(null);
          setCurrentAvatarBRoleId(null);
          turnSequenceRef.current = 'user';
          toast.success("Hand Interruption", "Floor passed immediately to Candidate!");
          startCandidateTurnPrompt();
          return;
        }

        passFloorToCandidateAfterAvatarB();
      },
      false,
      false,
      undefined,
      1.0,
      GD_MAX_SPEAK_MS,
      { minDurationMs: GD_SPEAK_MS }
    );
  };

  const triggerAvatarReply = async (
    avatarId: string,
    roleType: 'avatar_a' | 'avatar_b',
    targetSpeakerName: string,
    updatedMessages?: GdChatMessage[]
  ) => {
    if (!isCallActiveRef.current) return;
    const nextSpeaker = AVATARS.find(a => a.id === avatarId);
    if (!nextSpeaker) return;

    setLoading(true);

    try {
      const messageHistory = updatedMessages || messages;
      const response = await fetch('/api/group-discussion/bot-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId: roomName,
          roomDesc,
          objective: roomDesc || selectedConcept,
          activeMentors: [avatarId],
          domain,
          roleType,
          nextSpeakerName: targetSpeakerName,
          candidateName: user?.displayName || 'Candidate',
          history: messageHistory.slice(-8).map(m => ({
            role: m.role === 'SDE Candidate' ? 'user' : 'assistant',
            content: m.content,
            sender: m.sender
          }))
        })
      });

      if (response.ok && isCallActiveRef.current) {
        const data = await response.json();
        if (data.reply) {
          const cleanReply = data.reply.replace(/\[.*?\]:\s?/, '');

          const newMsg: GdChatMessage = {
            sender: nextSpeaker.name,
            role: roleType === 'avatar_a' ? `${nextSpeaker.role} (Avatar A)` : `${nextSpeaker.role} (Avatar B)`,
            content: cleanReply,
            emoji: nextSpeaker.emoji
          };
          const nextMessages = [...messageHistory, newMsg];
          setMessages(nextMessages);

          speakWithAvatar(cleanReply, avatarId,
            () => {
              if (recognitionRef.current) {
                try { recognitionRef.current.stop(); } catch {}
              }
              setMicActive(false);
              setActiveSpeakingAvatar(nextSpeaker.name);

              if (roleType === 'avatar_a') {
                const avatarB_Id = speakerPairRef.current?.b || invitedAvatars.find(id => id !== avatarId && id !== hostIdRef.current) || 'kashyap';

                avatarBPromiseRef.current = fetch('/api/group-discussion/bot-reply', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    roomId: roomName,
                    roomDesc,
                    objective: roomDesc || selectedConcept,
                    activeMentors: [avatarB_Id],
                    domain,
                    roleType: 'avatar_b',
                    nextSpeakerName: user?.displayName || 'Candidate',
                    candidateName: user?.displayName || 'Candidate',
                    history: nextMessages.slice(-8).map(m => ({
                      role: m.role === 'SDE Candidate' ? 'user' : 'assistant',
                      content: m.content,
                      sender: m.sender
                    }))
                  })
                }).then(async (res) => {
                  if (res.ok) {
                    const bData = await res.json();
                    if (bData.reply) {
                      return {
                        avatarB_Id,
                        cleanReply: bData.reply.replace(/\[.*?\]:\s?/, ''),
                        nextMessages
                      };
                    }
                  }
                  return null;
                }).catch(() => null);
              }
            },
            async () => {
              setActiveSpeakingAvatar(null);

              if (handRaisedRef.current) {
                handRaisedRef.current = false;
                setHandRaised(false);
                avatarBPromiseRef.current = null;
                preloadedAvatarBDataRef.current = null;
                setCurrentAvatarARoleId(null);
                setCurrentAvatarBRoleId(null);
                turnSequenceRef.current = 'user';
                toast.success("Hand Interruption", "Floor passed immediately to Candidate!");
                startCandidateTurnPrompt();
                return;
              }

              if (roleType === 'avatar_a') {
                const avatarB_Id = speakerPairRef.current?.b || invitedAvatars.find(id => id !== avatarId && id !== hostIdRef.current) || 'kashyap';
                setCurrentAvatarBRoleId(avatarB_Id);
                turnSequenceRef.current = 'avatar_second';

                let preloaded = null;
                if (avatarBPromiseRef.current) {
                  const p = avatarBPromiseRef.current;
                  avatarBPromiseRef.current = null;
                  preloaded = await p;
                } else if (preloadedAvatarBDataRef.current) {
                  preloaded = preloadedAvatarBDataRef.current;
                  preloadedAvatarBDataRef.current = null;
                }

                if (preloaded && preloaded.avatarB_Id === avatarB_Id) {
                  triggerPreloadedAvatarBReply(preloaded.avatarB_Id, preloaded.cleanReply, preloaded.nextMessages);
                } else {
                  triggerAvatarReply(avatarB_Id, 'avatar_b', user?.displayName || 'Candidate', nextMessages);
                }
              } else {
                passFloorToCandidateAfterAvatarB();
              }
            },
            false,
            false,
            undefined,
            1.0,
            GD_MAX_SPEAK_MS,
            { minDurationMs: GD_SPEAK_MS }
          );
        } else {
          setActiveSpeakingAvatar(null);
          startCandidateTurnPrompt();
        }
      } else {
        setActiveSpeakingAvatar(null);
        startCandidateTurnPrompt();
      }
    } catch (err) {
      console.warn('Bot speaker reply failure:', err);
      setActiveSpeakingAvatar(null);
      startCandidateTurnPrompt();
    } finally {
      setLoading(false);
    }
  };

  const handleUserFinishSpeaking = (userText?: string) => {
    if (!isCallActiveRef.current) return;
    if (turnTimeoutRef.current) clearInterval(turnTimeoutRef.current);
    setCandidateTurnTimer(null);
    setIsUserTurn(false);

    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
    }
    setMicActive(false);

    avatarBPromiseRef.current = null;
    preloadedAvatarBDataRef.current = null;

    const spokenContent = userText || inputText.trim();
    setInputText('');

    if (!spokenContent) {
      handleCandidateSilenceTimeout();
      return;
    }

    const updated: GdChatMessage[] = [...messages, {
      sender: user?.displayName || 'Candidate',
      role: 'SDE Candidate',
      content: spokenContent,
      emoji: '🎓'
    }];
    setMessages(updated);

    consecutiveSilenceCountRef.current = 0;
    consecutiveAvatarTurnsRef.current = 0;

    const speakerPool = invitedAvatars.filter(id => id !== hostIdRef.current && id !== currentMentorId);
    const pair = pickRandomSpeakerPair(speakerPool, [hostIdRef.current, currentMentorId], lastPairRef.current);
    speakerPairRef.current = pair;
    const avatarA_Id = pair.a;
    const avatarB_Id = pair.b;
    const avatarB_Obj = AVATARS.find(a => a.id === avatarB_Id) || AVATARS[0];

    setCurrentAvatarARoleId(avatarA_Id);
    setCurrentAvatarBRoleId(avatarB_Id);
    turnSequenceRef.current = 'avatar_first';

    toast.success("Turn Passed", `${gdDisplayName(avatarA_Id)} will respond, then ${gdDisplayName(avatarB_Id)}.`);

    setTimeout(() => {
      triggerAvatarReply(avatarA_Id, 'avatar_a', avatarB_Obj.name, updated);
    }, 400);
  };

  const triggerHostMidSummary = async () => {
    if (!isCallActiveRef.current) return;
    const hostId = hostIdRef.current;
    const hostAvatar = AVATARS.find(a => a.id === hostId) || AVATARS[0];
    const hostName = gdDisplayName(hostId);
    setLoading(true);

    try {
      stopSpeaking();
      const midText = hostFiveMinuteScript(hostName, roomName);

      speakWithAvatar(midText, hostId,
        () => {
          if (recognitionRef.current) {
            try { recognitionRef.current.stop(); } catch {}
          }
          setMicActive(false);
          setActiveSpeakingAvatar(hostName);
        },
        () => {
          setActiveSpeakingAvatar(null);
          setMessages(prev => [...prev, {
            sender: hostName,
            role: 'Host (5 minutes over)',
            content: midText,
            emoji: hostAvatar.emoji
          }]);
          startCandidateTurnPrompt();
        },
        false,
        false,
        undefined,
        1.0,
        18000
      );
    } catch (err) {
      startCandidateTurnPrompt();
    } finally {
      setLoading(false);
    }
  };

  const triggerHostTimeWarning = async () => {
    if (!isCallActiveRef.current) return;
    const hostId = hostIdRef.current;
    const hostAvatar = AVATARS.find(a => a.id === hostId) || AVATARS[0];
    const hostName = gdDisplayName(hostId);
    setLoading(true);

    try {
      stopSpeaking();
      const warningText = hostThirtySecondScript(hostName, roomName);

      speakWithAvatar(warningText, hostId,
        () => {
          if (recognitionRef.current) {
            try { recognitionRef.current.stop(); } catch {}
          }
          setMicActive(false);
          setActiveSpeakingAvatar(hostName);
        },
        () => {
          setActiveSpeakingAvatar(null);
          setMessages(prev => [...prev, {
            sender: hostName,
            role: 'Host (30 seconds left)',
            content: warningText,
            emoji: hostAvatar.emoji
          }]);
          startCandidateTurnPrompt();
        },
        false,
        false,
        undefined,
        1.0,
        15000
      );
    } catch (err) {
      startCandidateTurnPrompt();
    } finally {
      setLoading(false);
    }
  };

  const triggerHostEndSummary = async () => {
    if (!isCallActiveRef.current) return;
    const hostId = hostIdRef.current;
    const hostAvatar = AVATARS.find(a => a.id === hostId) || AVATARS[0];
    const hostName = gdDisplayName(hostId);
    setLoading(true);

    try {
      stopSpeaking();
      const endText = hostEndScript(hostName, roomName);

      speakWithAvatar(endText, hostId,
        () => {
          if (recognitionRef.current) {
            try { recognitionRef.current.stop(); } catch {}
          }
          setMicActive(false);
          setActiveSpeakingAvatar(hostName);
        },
        () => {
          setActiveSpeakingAvatar(null);
          executeReportGeneration();
        },
        false,
        false,
        undefined,
        1.0,
        18000
      );
    } catch (err) {
      executeReportGeneration();
    } finally {
      setLoading(false);
    }
  };

  const handleStartCall = () => {
    if (!cOS.isItemUnlocked(`gd:${roomName}`)) {
      const ok = cOS.unlockItem(`gd:${roomName}`, 'gd', `Group Discussion: ${roomName}`);
      if (!ok) return;
    }

    const hostId = gdHostId;
    hostIdRef.current = hostId;
    setActiveHostId(hostId);
    let activePanel = [...invitedAvatars].filter(id => id !== currentMentorId);
    if (!activePanel.includes(hostId)) {
      activePanel = [hostId, ...activePanel];
    }
    if (activePanel.filter(id => id !== hostId).length < 2) {
      const remainingPool = filteredAvatars.map(a => a.id).filter(id => !activePanel.includes(id) && id !== currentMentorId);
      activePanel = [...activePanel, ...remainingPool.slice(0, 2)];
    }
    setInvitedAvatars(activePanel);

    setGdReport(null);
    setHandRaised(false);
    setStep('call_grid');
    setCallActive(true);
    setCallDuration(0);
    setIsUserTurn(false);

    if (callTimerRef.current) clearInterval(callTimerRef.current);
    const totalTargetSeconds = sessionDurationMinutes * 60;
    const midSummarySec = Math.round(totalTargetSeconds * 0.5);
    const warningSec = Math.max(totalTargetSeconds - 30, midSummarySec + 30);

    callTimerRef.current = setInterval(() => {
      setCallDuration(prev => {
        const nextSec = prev + 1;
        if (nextSec === midSummarySec) {
          triggerHostMidSummary();
        } else if (nextSec === warningSec) {
          triggerHostTimeWarning();
        } else if (nextSec >= totalTargetSeconds) {
          triggerHostEndSummary();
        }
        return nextSec;
      });
    }, 1000);

    setMessages([
      {
        sender: 'System Facilitator',
        role: 'Facilitator',
        content: `Welcome to the boardroom: "${roomName}". Host: ${gdDisplayName(hostId)}. Total GD Time: ${sessionDurationMinutes}:00 Minutes.`,
        emoji: '🏛️'
      }
    ]);

    if (typeof window !== 'undefined') {
      try {
        router.push('/group-discussion?call=true');
      } catch {}
    }

    const hostAvatar = AVATARS.find(a => a.id === hostId) || AVATARS[0];
    const hostName = gdDisplayName(hostId);
    const introText = hostIntroScript(hostName, roomName, roomDesc || selectedConcept);

    setTimeout(() => {
      speakWithAvatar(introText, hostId,
        () => {
          if (recognitionRef.current) {
            try { recognitionRef.current.stop(); } catch {}
          }
          setMicActive(false);
          setActiveSpeakingAvatar(hostName);
        },
        () => {
          setActiveSpeakingAvatar(null);
          setMessages(prev => {
            if (prev.some(m => m.content === introText)) return prev;
            return [...prev, {
              sender: hostName,
              role: 'Host / Facilitator',
              content: introText,
              emoji: hostAvatar.emoji
            }];
          });
          turnSequenceRef.current = 'user';
          startCandidateTurnPrompt();
        },
        false,
        false,
        undefined,
        1.0,
        18000
      );
    }, 1000);
  };

  const handleInterjectImmediately = () => {
    if (!isCallActiveRef.current) return;
    console.log('[GD Engine] ⚡ Immediate Candidate Interjection triggered!');

    stopSpeaking();
    setActiveSpeakingAvatar(null);
    setCurrentAvatarARoleId(null);
    setCurrentAvatarBRoleId(null);
    turnSequenceRef.current = 'user';
    consecutiveAvatarTurnsRef.current = 0;

    setTurnCount(prev => prev + 1);
    toast.success("Floor Seized ⚡", "You cut in! Microphone is active — state your argument.");
    startCandidateTurnPrompt();
  };

  const handleSuggestArgument = () => {
    const lowerTopic = roomName.toLowerCase();
    let suggestions = [
      "We need to evaluate the thread-safety locks and JVM memory boundaries before scaling this layout.",
      "Our AWS Cloud Budget is going to spike. Let's keep our networking traffic strictly isolated.",
      "Let's check the CAP theorem trade-offs here. We might need a Paxos consensus engine to prevent transactional drift.",
      "What is our chaos engineering recovery plan if the primary node goes offline under stress?"
    ];

    if (lowerTopic.includes('database') || lowerTopic.includes('black friday') || lowerTopic.includes('spike')) {
      suggestions = [
        "We should implement a Redis write-behind cache buffer to absorb the transactional write spike and prevent database lock contention.",
        "Let's enforce database connection pooling limits and spin up read-replicas dynamically during peak traffic.",
        "I suggest query rate-limiting at the gateway level. If CPU hits 90%, we should gracefully degrade non-critical services.",
        "We need to audit our indexes and rewrite the heavy aggregate queries to use a pre-calculated cache ledger."
      ];
    } else if (lowerTopic.includes('payment') || lowerTopic.includes('charging') || lowerTopic.includes('race')) {
      suggestions = [
        "We must use distributed locks (Redlock via Redis) mapped to the customer session ID to guarantee transaction idempotency.",
        "Let's introduce a double-entry ledger database pattern with unique transaction hashes to block duplicate requests.",
        "We should queue all payment transactions in RabbitMQ and process them sequentially to eliminate race conditions.",
        "Let's implement a transactional outbox pattern to decouple payment gateway webhooks from the main database writes."
      ];
    } else if (lowerTopic.includes('cache') || lowerTopic.includes('stampede')) {
      suggestions = [
        "We should use mutual exclusion locks (single-flight pattern) so only one thread fetches from the database.",
        "Let's add random jitter/entropy to our cache TTLs to ensure keys do not expire simultaneously.",
        "I suggest pre-heating the cache in a background cron job before the keys hit their expiration threshold.",
        "We need a circuit breaker that returns cached stale data if the primary database queries begin queueing."
      ];
    } else if (lowerTopic.includes('websocket') || lowerTopic.includes('leak') || lowerTopic.includes('connections')) {
      suggestions = [
        "We should configure a WebSocket connection timeout heartbeat and aggressively prune inactive sockets.",
        "Let's delegate the connection state to an external broker (Redis Pub/Sub) and scale horizontally.",
        "We must run heap snapshots and profile the GC behavior to identify where reference leaks occur.",
        "I recommend implementing backpressure controls at the server level to reject messages when event loop lag exceeds 100ms."
      ];
    } else if (lowerTopic.includes('firmware') || lowerTopic.includes('bricking') || lowerTopic.includes('iot')) {
      suggestions = [
        "We must establish an A/B partition bootloader system so the device rolls back to the previous stable build on failure.",
        "Let's halt all active OTA deployments immediately and run hardware-in-the-loop diagnostic tests.",
        "We should decouple the network stack from the application partition so we don't lose remote access to bricked devices.",
        "I suggest rolling out a canary deployment restricted to 0.1% of active devices with strict telemetry metrics first."
      ];
    }

    const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
    setSuggestedHelperText(randomSuggestion);
    toast.success('SDE Suggestion Generated', 'Read this point aloud into your microphone!');
  };

  const handleSendVoiceMessage = (text: string) => {
    handleUserFinishSpeaking(text);
  };
  handleUserFinishSpeakingRef.current = handleUserFinishSpeaking;
  handleSendVoiceMessageRef.current = handleSendVoiceMessage;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || loading) return;
    const userText = inputText.trim();
    handleUserFinishSpeaking(userText);
  };

  const toggleMic = () => {
    if (!recognitionRef.current) {
      toast.error("Speech Recognition Unsupported", "This browser does not support the webkitSpeechRecognition API.");
      return;
    }
    if (micActive) {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      recognitionRef.current.stop();
      setMicActive(false);
    } else {
      stopSpeaking();
      if (turnTimeoutRef.current) clearInterval(turnTimeoutRef.current);
      setCandidateTurnTimer(null);

      try {
        recognitionRef.current.start();
        setMicActive(true);
        toast.success("Microphone Active", "Start speaking to debate...");
      } catch (err) {
        console.warn("Manual microphone start failure:", err);
      }
    }
  };

  const toggleRaiseHand = () => {
    const nextState = !handRaised;
    setHandRaised(nextState);
    handRaisedRef.current = nextState;
    if (nextState) {
      toast.success("Hand Raised", "You will get the floor immediately after the current avatar finishes!");
    } else {
      toast.info("Hand Lowered", "Interruption cancelled.");
    }
  };

  const handleForceExitCall = () => {
    stopSpeaking();
    if (turnTimeoutRef.current) clearInterval(turnTimeoutRef.current);
    if (callTimerRef.current) clearInterval(callTimerRef.current);
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    setCandidateTurnTimer(null);
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
    }
    setMicActive(false);
    setCallActive(false);

    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', `/group-discussion/`);
      window.dispatchEvent(new Event('popstate'));
    }

    setStep('create_room');
    toast.success('Meeting Left', 'Boardroom call was forcibly ended and reset.');
  };

  const executeReportGeneration = async () => {
    stopSpeaking();
    if (turnTimeoutRef.current) clearInterval(turnTimeoutRef.current);
    if (callTimerRef.current) clearInterval(callTimerRef.current);
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    setCandidateTurnTimer(null);
    setHandRaised(false);
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
    }
    setMicActive(false);
    setCallActive(false);

    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', `/group-discussion/`);
      window.dispatchEvent(new Event('popstate'));
    }

    setLoading(true);
    toast.success('Analyzing Debate...', 'Generating detailed candidate performance report...');

    let finalReport = {
      score: 0,
      verdict: 'Evaluation unavailable — could not score this boardroom session.',
      gapsIdentified: ['Complete a fuller discussion so an AI evaluation can be generated.'],
      keyMoments: [],
      evaluated: false,
    };

    try {
      const res = await fetch('/api/group-discussion/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId: roomName,
          roomDesc: roomDesc || 'General debate',
          domain,
          history: messages
        })
      });
      if (res.ok) {
        const reportData = await res.json();
        if (typeof reportData.score === 'number') {
          finalReport = { ...reportData, evaluated: reportData.evaluated !== undefined ? Boolean(reportData.evaluated) : true };
        }
      }
    } catch (err) {
      console.warn("Failed to generate AI evaluation report:", err);
    } finally {
      setLoading(false);
    }

    setGdReport(finalReport);
    if (finalReport.evaluated && finalReport.score >= 70) {
      cOS.rewardActivity('gd', roomName || 'Group Discussion');
    }

    if (typeof window !== 'undefined') {
      try {
        const historyKey = `pinit_gd_history_${user?.id || 'anon'}`;
        const stored = localStorage.getItem(historyKey);
        let historyList: any[] = [];
        try { historyList = stored ? JSON.parse(stored) : []; } catch { historyList = []; }
        const newRecord: GdHistoryRecord = {
          id: `gd_${Date.now()}`,
          topic: roomName,
          objective: roomDesc || 'General architectural debate',
          date: new Date().toLocaleDateString(),
          domain,
          report: finalReport,
          transcript: messages
        };
        historyList.unshift(newRecord);
        const trimmed = historyList.slice(0, 25);
        localStorage.setItem(historyKey, JSON.stringify(trimmed));

        if (onRecordSaved) onRecordSaved(newRecord);

        if (user?.id) {
          getAuthHeaders().then(async headers => {
            try {
              await fetch('/api/gd/history', {
                method: 'POST',
                headers,
                body: JSON.stringify(newRecord)
              });
            } catch (err) {
              console.warn('[GD History] Remote sync POST failed:', err);
            }
          }).catch(() => {});
        }
      } catch (e) {
        console.warn('Failed to store boardroom conclusion in database:', e);
      }
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('pinit:activity_complete', {
        detail: {
          type: 'gd',
          title: 'Group Discussion Boardroom',
          score: Math.min(100, finalReport.score || 0),
          passed: !!(finalReport.evaluated && (finalReport.score || 0) >= 70),
          strengths: finalReport.keyMoments || [],
          improvements: finalReport.gapsIdentified || [],
        }
      }));
    }
  };

  const handleEndCall = () => {
    if (callActive) {
      triggerHostEndSummary();
    } else {
      executeReportGeneration();
    }
  };

  const exportGdTranscript = (format: 'markdown' | 'json' = 'markdown') => {
    if (format === 'json') {
      const data = {
        roomTopic: selectedConcept,
        domain,
        sessionDurationMinutes,
        date: new Date().toISOString(),
        hostId: activeHostId,
        participants: invitedAvatars.map(id => {
          const a = AVATARS.find(av => av.id === id);
          return { id, name: a?.name, role: a?.role, trait: a?.trait };
        }),
        messages
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `GD_${selectedConcept.replace(/[^a-zA-Z0-9]/g, '_')}_Transcript.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Transcript Exported', 'Saved complete GD debate as JSON.');
    } else {
      const lines = [
        `# Boardroom Group Discussion Minutes`,
        `**Objective / Topic:** ${selectedConcept}  `,
        `**Domain:** ${domain.toUpperCase()}  `,
        `**Scheduled Duration:** ${sessionDurationMinutes} Minutes  `,
        `**Session Time Elapsed:** ${Math.floor(callDuration / 60)}m ${callDuration % 60}s  `,
        `**Date:** ${new Date().toLocaleDateString('en-US', { dateStyle: 'full' })}  `,
        `\n---\n`,
        `## Participants`,
        `- **Candidate (You)** — SDE Candidate`,
        ...invitedAvatars.map(id => {
          const a = AVATARS.find(av => av.id === id);
          return `- **${a?.name || id}** (${a?.role || 'Panelist'}) — *${a?.trait || 'Participant'} mode*`;
        }),
        `\n## Discussion Transcript\n`
      ];

      messages.forEach(m => {
        lines.push(`**${m.emoji} ${m.sender} (${m.role}):**\n${m.content}\n`);
      });

      const blob = new Blob([lines.join('\n')], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `GD_${selectedConcept.replace(/[^a-zA-Z0-9]/g, '_')}_Transcript.md`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Minutes Exported', 'Saved complete GD discussion transcript as Markdown.');
    }
  };

  return {
    // States
    activeSpeakingAvatar,
    currentAvatarARoleId,
    currentAvatarBRoleId,
    isUserTurn,
    activeHostId,
    callActive,
    messages,
    turnCount,
    handRaised,
    suggestedHelperText,
    inputText,
    loading,
    gdReport,
    callDuration,
    micActive,
    candidateTurnTimer,
    bottomRef,
    reportRef,

    // Setters
    setInputText,
    setSuggestedHelperText,
    setMessages,
    setGdReport,
    setHandRaised,

    // Actions
    handleStartCall,
    handleEndCall,
    handleForceExitCall,
    handleUserFinishSpeaking,
    handleSendVoiceMessage,
    handleSendMessage,
    handleSuggestArgument,
    handleInterjectImmediately,
    toggleMic,
    toggleRaiseHand,
    exportGdTranscript
  };
}
