'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { useCareerOS } from '@/lib/context/CareerOSContext';
import { toast } from '@/lib/store/useAppStore';
import MeetCallGrid from '@/components/group-discussion/MeetCallGrid';
import GdReport from '@/components/group-discussion/GdReport';
import { speakWithAvatar, stopSpeaking } from '@/lib/tts';
import PinsGate from '@/components/pins/PinsGate';
import '@/styles/group-discussion.css';

interface Avatar {
  id: string;
  name: string;
  emoji: string;
  role: string;
  color: string;
  trait: 'proactive' | 'reactive' | 'silent' | 'aggressive';
  description: string;
  voiceName: string;
}

const AVATARS: Avatar[] = [
  { id: 'priya', name: 'Ms. Priya', emoji: '👩‍💼', role: 'Friendly & encouraging Mentor', color: '#7c3aed', trait: 'reactive', description: 'Warm, encouraging mentor guiding general career pathways.', voiceName: 'af_heart' },
  { id: 'anish', name: 'Mr. Anish', emoji: '👨‍💼', role: 'Casual, friendly Mentor', color: '#0891b2', trait: 'proactive', description: 'Approachable, friendly mentor guiding team workflows.', voiceName: 'am_liam' },
  { id: 'aisha', name: 'Ms. Aisha', emoji: '👩‍💼', role: 'Structured & methodical Teacher', color: '#6366f1', trait: 'reactive', description: 'Structured, logical teacher focusing on systematic SDE steps.', voiceName: 'af_sky' },
  { id: 'rohan', name: 'Mr. Rohan', emoji: '👨‍💻', role: 'Energetic & tech-focused Teacher', color: '#ef4444', trait: 'aggressive', description: 'Energetic, code-focused teacher drilling compiler concepts.', voiceName: 'am_fenrir' },
  { id: 'kashyap', name: 'Mr. Kashyap', emoji: '👨‍🔧', role: 'Systems Architect Teacher', color: '#d97706', trait: 'aggressive', description: 'Demands deep technical details and low-level JVM models.', voiceName: 'am_fenrir' },
  { id: 'karthic', name: 'Mr. Karthic', emoji: '👨‍💻', role: 'Algorithmic Lead Teacher', color: '#3b82f6', trait: 'proactive', description: 'Focuses on database design, SOLID code, and algorithms.', voiceName: 'am_liam' },
  { id: 'maya', name: 'Ms. Maya', emoji: '👩‍⚕️', role: 'Security Auditor Teacher', color: '#2563eb', trait: 'silent', description: 'Quiet, warning about cloud budgets and networking security.', voiceName: 'bf_emma' },
  { id: 'divya', name: 'Ms. Divya', emoji: '👩‍🏫', role: 'UX Expert Teacher', color: '#059669', trait: 'proactive', description: 'Active, pushes accessible frontend components and user experiences.', voiceName: 'af_nicole' },
  { id: 'vikram', name: 'Mr. Vikram', emoji: '👨‍💼', role: 'Serious, strict UK Interviewer', color: '#dc2626', trait: 'aggressive', description: 'Authoritative, challenges timing delays and technical debt.', voiceName: 'bm_lewis' },
  { id: 'shalini', name: 'Ms. Shalini', emoji: '👩‍💼', role: 'Silent UK observer Interviewer', color: '#ec4899', trait: 'reactive', description: 'Silent observer focusing on soft skills and team behavior.', voiceName: 'bf_isabella' },
  { id: 'aditya', name: 'Mr. Aditya', emoji: '👨‍🎨', role: 'Wise System Design Purist', color: '#f59e0b', trait: 'proactive', description: 'Drives high-level scaling, sharding, and consensus rules.', voiceName: 'am_adam' },
  { id: 'neha', name: 'Ms. Neha', emoji: '👩‍💻', role: 'High-Stress Driller Interviewer', color: '#10b981', trait: 'aggressive', description: 'Grills validation edges, load testing, and compiler check rules.', voiceName: 'af_bella' },
  { id: 'rajesh', name: 'Mr. Rajesh', emoji: '👨‍💼', role: 'Friendly Legacy Defender', color: '#6366f1', trait: 'reactive', description: 'Focuses on legacy code wraps and clean codebase dependencies.', voiceName: 'am_liam' },
  { id: 'sneha', name: 'Ms. Sneha', emoji: '👩‍💼', role: 'Empathy-First Socratic Interviewer', color: '#db2777', trait: 'proactive', description: 'Focuses on clean hooks, empathetic cooperation, and socratic tips.', voiceName: 'af_sarah' },
  { id: 'abhijit', name: 'Mr. Abhijit', emoji: '👨‍💼', role: 'Bored Executive Interviewer', color: '#64748b', trait: 'silent', description: 'Silent executive caring about commercial impact and metrics.', voiceName: 'bm_george' }
];


export default function GroupDiscussionPage() {
  const router = useRouter();
  const { user } = useAuth();
  const cOS = useCareerOS();
  const currentMentorId = user?.selectedTeacherId || 'priya';

  // Exclude user's currently active mentor to prevent overlap
  const filteredAvatars = AVATARS.filter(a => a.id !== currentMentorId);

  // Navigation steps: 'create_room' | 'invite_concept' | 'call_grid'
  const [step, setStep] = useState<'create_room' | 'invite_concept' | 'call_grid'>('create_room');

  // Difficulty & Custom Avatar Guide & History Modal States
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [avatarGuideOpen, setAvatarGuideOpen] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<any | null>(null);
  const [historySearchQuery, setHistorySearchQuery] = useState('');
  const [historyDomainFilter, setHistoryDomainFilter] = useState<'all' | 'technical' | 'sales' | 'business'>('all');
  const [historyListState, setHistoryListState] = useState<any[]>([]);

  // Room details
  const [roomName, setRoomName] = useState('');
  const [roomDesc, setRoomDesc] = useState('');
  const [selectedConcept, setSelectedConcept] = useState('Microservices Orchestration');

  const refreshHistoryList = () => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(`pinit_gd_history_${user?.id || 'anon'}`);
        setHistoryListState(stored ? JSON.parse(stored) : []);
      } catch (e) {
        console.warn('Failed to load GD history:', e);
      }
    }
  };

  useEffect(() => {
    refreshHistoryList();
  }, [user]);

  const handleDeleteHistoryItem = (id: string) => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(`pinit_gd_history_${user?.id || 'anon'}`);
      const list = stored ? JSON.parse(stored) : [];
      const updated = list.filter((item: any) => item.id !== id);
      localStorage.setItem(`pinit_gd_history_${user?.id || 'anon'}`, JSON.stringify(updated));
      setHistoryListState(updated);
      if (selectedHistoryItem?.id === id) {
        setSelectedHistoryItem(null);
      }
      toast.success('Record Deleted', 'Past boardroom history item removed.');
    } catch (e) {
      console.warn('Failed to delete history item:', e);
    }
  };

  const handleExportHistoryJSON = (record: any) => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(record, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `gd_session_${(record.topic || 'session').replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      toast.success('JSON Exported', 'Session recap file downloaded.');
    } catch (e) {
      toast.error('Export Failed', 'Unable to download JSON file.');
    }
  };
  
  // Invites & Speaking state
  const [invitedAvatars, setInvitedAvatars] = useState<string[]>([]);
  const [activeSpeakingAvatar, setActiveSpeakingAvatar] = useState<string | null>(null);

  // Call states
  const [callActive, setCallActive] = useState(false);
  const [messages, setMessages] = useState<{ sender: string; role: string; content: string; emoji: string }[]>([]);
  const [turnCount, setTurnCount] = useState(0);
  const [consecutiveAvatarTurns, setConsecutiveAvatarTurns] = useState(0);
  const [handRaised, setHandRaised] = useState(false);
  const [suggestedHelperText, setSuggestedHelperText] = useState('');
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [gdReport, setGdReport] = useState<{ score: number; verdict: string; gapsIdentified: string[]; keyMoments: string[] } | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const callTimerRef = useRef<any>(null);
  const [domain, setDomain] = useState<'technical' | 'sales' | 'business'>('technical');
  const reportRef = useRef<HTMLDivElement>(null);

  // Speech Recognition & Hands-free Turn-taking state
  const [micActive, setMicActive] = useState(false);
  const [candidateTurnTimer, setCandidateTurnTimer] = useState<number | null>(null);
  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<any>(null);
  const speechTranscriptAccumulatorRef = useRef('');
  const turnTimeoutRef = useRef<any>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const turnSequenceRef = useRef<'user' | 'avatar_first' | 'avatar_second'>('user');
  const nextScheduledSpeakerRef = useRef<string | null>(null);
  const isCallActiveRef = useRef(false);
  const handRaisedRef = useRef(false);
  const preloadedAvatarBDataRef = useRef<{ avatarB_Id: string; cleanReply: string; nextMessages: any[] } | null>(null);
  const avatarBPromiseRef = useRef<Promise<any> | null>(null);
  const consecutiveSilenceCountRef = useRef<number>(0);
  const speechPauseDebounceRef = useRef<any>(null);

  // Pre-warm browser speech synthesis voices immediately on load (pls preload communication)
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

  // Master Unmount Cleanup Effect: Stop all background timers, mic, and TTS on component unmount
  useEffect(() => {
    return () => {
      if (callTimerRef.current) clearInterval(callTimerRef.current);
      if (turnTimeoutRef.current) clearInterval(turnTimeoutRef.current);
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      if (speechPauseDebounceRef.current) clearTimeout(speechPauseDebounceRef.current);
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }
      stopSpeaking();
    };
  }, []);

  useEffect(() => {
    isCallActiveRef.current = callActive;
  }, [callActive]);

  useEffect(() => {
    handRaisedRef.current = handRaised;
  }, [handRaised]);

  // Scroll messages
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

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
      if (turnTimeoutRef.current) clearInterval(turnTimeoutRef.current);
      if (callTimerRef.current) clearInterval(callTimerRef.current);
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }
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
            // Reset the silence timer!
            if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
            setCandidateTurnTimer(prev => prev !== null ? Math.max(prev, 5) : null);
            silenceTimerRef.current = setTimeout(() => {
              const finalTranscript = currentTranscript.trim();
              if (finalTranscript) {
                try { rec.stop(); } catch {}
                handleSendVoiceMessage(finalTranscript);
              }
            }, 2500); // 2.5 seconds of silence before auto-submitting!
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
  }, []);

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomName.trim()) {
      toast.error('Room Name Required', 'Please enter a name for your group discussion room.');
      return;
    }
    setStep('invite_concept');
  };

  // Active Avatar A / B role tracking
  const [currentAvatarARoleId, setCurrentAvatarARoleId] = useState<string | null>(null);
  const [currentAvatarBRoleId, setCurrentAvatarBRoleId] = useState<string | null>(null);
  const [isUserTurn, setIsUserTurn] = useState(false);
  const avatarQueueIndexRef = useRef(0);

  const handleStartCall = () => {
    if (!cOS.isItemUnlocked(`gd:${roomName}`)) {
      const ok = cOS.unlockItem(`gd:${roomName}`, 'gd', `Group Discussion: ${roomName}`);
      if (!ok) return;
    }

    // Ensure total 7 invited avatars + 1 host + 1 candidate = 9 total members
    let activePanel = [...invitedAvatars];
    if (activePanel.length < 7) {
      const remainingPool = filteredAvatars.map(a => a.id).filter(id => !activePanel.includes(id));
      const needed = 7 - activePanel.length;
      activePanel = [...activePanel, ...remainingPool.slice(0, needed)];
      setInvitedAvatars(activePanel);
    }

    setGdReport(null);
    setHandRaised(false);
    setStep('call_grid');
    setCallActive(true);
    setCallDuration(0);
    setIsUserTurn(false);

    if (callTimerRef.current) clearInterval(callTimerRef.current);
    callTimerRef.current = setInterval(() => {
      setCallDuration(prev => {
        const nextSec = prev + 1;
        // Exact time-based Host interventions for 10-min GD:
        if (nextSec === 300) {
          triggerHostMidSummary();
        } else if (nextSec === 540) {
          triggerHostTimeWarning();
        } else if (nextSec === 600) {
          triggerHostEndSummary();
        }
        return nextSec;
      });
    }, 1000);

    setMessages([
      {
        sender: 'System Facilitator',
        role: 'Facilitator',
        content: `Welcome to the 9-member boardroom: "${roomName}". Total GD Time: 10:00 Minutes | Difficulty: ${difficulty.toUpperCase()}.`,
        emoji: '🏛️'
      }
    ]);

    if (typeof window !== 'undefined') {
      try {
        router.push('/group-discussion?call=true');
      } catch {}
    }

    const hostId = activePanel[0] || 'anish';
    const hostAvatar = AVATARS.find(a => a.id === hostId) || AVATARS[0];
    const hostName = hostAvatar.name;
    const introText = `Hello everyone, I am ${hostName}, hosting our 9-member SDE boardroom today. Our topic is "${roomName}" with objective "${roomDesc || 'architectural trade-offs'}". You have 10 minutes total for this discussion. Candidate, please start us off by pitching your initial solution.`;

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
        18000 // Host intro max duration: 18.0 seconds (35 words)
      );
    }, 1000);
  };

  const triggerPreloadedAvatarBReply = (
    avatarId: string,
    cleanReply: string,
    historyMessages: { sender: string; role: string; content: string; emoji: string }[]
  ) => {
    if (!isCallActiveRef.current) return;
    const nextSpeaker = AVATARS.find(a => a.id === avatarId);
    if (!nextSpeaker) return;

    const newMsg = {
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

        // Interruption Handler: If Candidate raised hand during avatar speech, pass floor immediately to Candidate!
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

        // Avatar B finished -> Hand over to Candidate (User)
        avatarQueueIndexRef.current = (avatarQueueIndexRef.current + 2) % (invitedAvatars.length || 7);
        setCurrentAvatarARoleId(null);
        setCurrentAvatarBRoleId(null);
        turnSequenceRef.current = 'user';
        startCandidateTurnPrompt();
      },
      false,
      false
    );
  };

  const triggerAvatarReply = async (
    avatarId: string,
    roleType: 'avatar_a' | 'avatar_b',
    targetSpeakerName: string,
    updatedMessages?: { sender: string; role: string; content: string; emoji: string }[]
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
          activeMentors: [avatarId],
          domain,
          roleType,
          nextSpeakerName: targetSpeakerName,
          history: messageHistory.slice(-8).map(m => ({ role: m.role === 'SDE Candidate' ? 'user' : 'assistant', content: m.content }))
        })
      });

      if (response.ok && isCallActiveRef.current) {
        const data = await response.json();
        if (data.reply) {
          const cleanReply = data.reply.replace(/\[.*?\]:\s?/, '');

          const newMsg = {
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

              // Preload Communication: Store an awaitable Promise ref for Avatar B reply!
              if (roleType === 'avatar_a') {
                const activePanel = invitedAvatars.length >= 7 ? invitedAvatars : AVATARS.slice(0, 7).map(a => a.id);
                const nextBIndex = (avatarQueueIndexRef.current + 1) % activePanel.length;
                const avatarB_Id = activePanel[nextBIndex] || activePanel[0];

                avatarBPromiseRef.current = fetch('/api/group-discussion/bot-reply', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    roomId: roomName,
                    activeMentors: [avatarB_Id],
                    domain,
                    roleType: 'avatar_b',
                    nextSpeakerName: user?.displayName || 'Candidate',
                    history: nextMessages.slice(-8).map(m => ({ role: m.role === 'SDE Candidate' ? 'user' : 'assistant', content: m.content }))
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

              // Interruption Handler: If Candidate raised hand during avatar speech, pass floor immediately to Candidate!
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
                // Avatar A finished -> Await in-flight Avatar B promise to guarantee 0ms latency!
                const activePanel = invitedAvatars.length >= 7 ? invitedAvatars : AVATARS.slice(0, 7).map(a => a.id);
                const nextBIndex = (avatarQueueIndexRef.current + 1) % activePanel.length;
                const avatarB_Id = activePanel[nextBIndex] || activePanel[0];
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
                // Avatar B finished -> Hand over to Candidate (User)
                avatarQueueIndexRef.current = (avatarQueueIndexRef.current + 2) % (invitedAvatars.length || 7);
                setCurrentAvatarARoleId(null);
                setCurrentAvatarBRoleId(null);
                turnSequenceRef.current = 'user';
                startCandidateTurnPrompt();
              }
            },
            false,
            false
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
    const activePanel = invitedAvatars.length >= 7 ? invitedAvatars : AVATARS.slice(0, 7).map(a => a.id);

    // If candidate has been silent 2 times in a row, auto-advance floor to Avatar B so debate doesn't get stuck!
    if (consecutiveSilenceCountRef.current >= 2) {
      consecutiveSilenceCountRef.current = 0;
      toast.info("Candidate Silent", "Advancing debate to Avatar B...");

      const indexB = (avatarQueueIndexRef.current + 1) % activePanel.length;
      const avatarB_Id = activePanel[indexB] || activePanel[0];
      setCurrentAvatarBRoleId(avatarB_Id);
      turnSequenceRef.current = 'avatar_second';

      triggerAvatarReply(avatarB_Id, 'avatar_b', user?.displayName || 'Candidate', messages);
      return;
    }

    // 1st silence: Pick Host or current Avatar A to call out Candidate directly
    const indexA = avatarQueueIndexRef.current % activePanel.length;
    const avatarA_Id = activePanel[indexA] || 'anish';
    const avatarA_Obj = AVATARS.find(a => a.id === avatarA_Id) || AVATARS[0];

    const calloutText = `Candidate, we haven't heard your pitch on ${roomName || 'this topic'} yet. Please share your perspective with the boardroom!`;

    setMessages(prev => [...prev, {
      sender: avatarA_Obj.name,
      role: `${avatarA_Obj.role} (Call Out)`,
      content: calloutText,
      emoji: avatarA_Obj.emoji
    }]);

    toast.warning("Candidate Prompted", "The panel is waiting for your input!");

    speakWithAvatar(calloutText, avatarA_Id,
      () => {
        setMicActive(false);
        setActiveSpeakingAvatar(avatarA_Obj.name);
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

    // If Candidate did not speak or type anything, call out candidate without dummy text!
    if (!spokenContent) {
      handleCandidateSilenceTimeout();
      return;
    }

    const updated = [...messages, {
      sender: user?.displayName || 'Candidate',
      role: 'SDE Candidate',
      content: spokenContent,
      emoji: '🎓'
    }];
    setMessages(updated);

    // Pick Avatar A and Avatar B from the 7 panel members
    const activePanel = invitedAvatars.length >= 7 ? invitedAvatars : AVATARS.slice(0, 7).map(a => a.id);
    const indexA = avatarQueueIndexRef.current % activePanel.length;
    const indexB = (avatarQueueIndexRef.current + 1) % activePanel.length;
    
    const avatarA_Id = activePanel[indexA];
    const avatarB_Id = activePanel[indexB];
    const avatarB_Obj = AVATARS.find(a => a.id === avatarB_Id) || AVATARS[0];

    setCurrentAvatarARoleId(avatarA_Id);
    setCurrentAvatarBRoleId(avatarB_Id);
    turnSequenceRef.current = 'avatar_first';

    toast.success("Turn Passed", "Avatar A is analyzing your perspective...");

    setTimeout(() => {
      triggerAvatarReply(avatarA_Id, 'avatar_a', avatarB_Obj.name, updated);
    }, 800);
  };

  const triggerHostMidSummary = async () => {
    if (!isCallActiveRef.current) return;
    const hostId = invitedAvatars[0] || 'anish';
    const hostAvatar = AVATARS.find(a => a.id === hostId) || AVATARS[0];
    const hostName = hostAvatar.name;
    setLoading(true);

    try {
      const midText = `5-Minute Mark Pause: We have reached the halfway point of our 10-minute session. We have debated primary trade-offs for "${roomName}". Let me redirect our focus now to Security & Deployment Risks. Candidate, how do you respond to security isolate rules?`;
      
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
            role: 'Host / Facilitator (5-Min Security Focus)',
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
    const hostId = invitedAvatars[0] || 'anish';
    const hostAvatar = AVATARS.find(a => a.id === hostId) || AVATARS[0];
    const hostName = hostAvatar.name;
    setLoading(true);

    try {
      const warningText = `1-Minute Warning: We have 60 seconds remaining in our 10-minute boardroom session. Let's wrap up final resolutions for "${roomName}". Candidate, what is your closing conclusion?`;
      
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
            role: 'Host / Facilitator (1-Min Warning)',
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
    const hostId = invitedAvatars[0] || 'anish';
    const hostAvatar = AVATARS.find(a => a.id === hostId) || AVATARS[0];
    const hostName = hostAvatar.name;
    setLoading(true);

    try {
      const endText = `10-Minute Time Limit Reached: Thank you everyone. Our 10-minute boardroom discussion for "${roomName}" has concluded. I am now generating your performance evaluation report.`;
      
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

  const startCandidateTurnPrompt = () => {
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
          
          if (recognitionRef.current) {
            try { recognitionRef.current.stop(); } catch {}
          }
          setMicActive(false);

          handleUserFinishSpeaking();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const triggerNextAvatarSilenceReact = () => {
    handleUserFinishSpeaking();
  };

  const handleSendVoiceMessage = (text: string) => {
    handleUserFinishSpeaking(text);
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

  const handleEndCall = () => {
    if (callActive) {
      triggerHostEndSummary();
    } else {
      executeReportGeneration();
    }
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

    // Clear ?call=true in URL to exit full screen mode
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', `/group-discussion/`);
      window.dispatchEvent(new Event('popstate'));
    }

    setLoading(true);
    toast.success('Analyzing Debate...', 'Generating detailed candidate performance report...');

    let finalReport = {
      score: 75,
      verdict: 'Standard architectural layout approved.',
      gapsIdentified: ['Distributed transaction synchronization constraints', 'Lock contention patterns under high load factors'],
      keyMoments: ['Candidate pitched basic architecture layout solutions.', 'Boardroom debated database schemas and latency details.']
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
        if (reportData.score !== undefined) {
          finalReport = reportData;
        }
      }
    } catch (err) {
      console.warn("Failed to generate AI evaluation report:", err);
    } finally {
      setLoading(false);
    }

    setGdReport(finalReport);
    cOS.rewardActivity('gd', roomName || 'Group Discussion');

    // Save SDE Boardroom record to localStorage database cache
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(`pinit_gd_history_${user?.id || 'anon'}`);
        let historyList: any[] = [];
        try { historyList = stored ? JSON.parse(stored) : []; } catch { historyList = []; }
        const newRecord = {
          id: `gd_${Date.now()}`,
          topic: roomName,
          objective: roomDesc || 'General architectural debate',
          date: new Date().toLocaleDateString(),
          difficulty,
          domain,
          report: finalReport,
          transcript: messages
        };
        historyList.unshift(newRecord);
        localStorage.setItem(`pinit_gd_history_${user?.id || 'anon'}`, JSON.stringify(historyList));
      } catch (e) {
        console.warn('Failed to store boardroom conclusion in database:', e);
      }
    }

    // Notify GlobalAvatar mentor with GD completion event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('pinit:activity_complete', {
        detail: {
          type: 'gd',
          title: 'Group Discussion Boardroom',
          score: Math.min(100, finalReport.score || 75),
          passed: (finalReport.score || 75) >= 70,
          strengths: finalReport.keyMoments || [],
          improvements: finalReport.gapsIdentified || [],
        }
      }));
    }
  };


  // Demo audio play for Avatar Guide
  const handlePlayDemo = (avatarId: string, name: string) => {
    stopSpeaking();
    const demoText = `Hello! I am ${name}. My voice profile is calibrated and preselected. I will be debating you in the corporate boardroom!`;
    speakWithAvatar(demoText, avatarId, () => {}, () => {}, false, true);
    toast.success(`Playing Demo`, `Speaking in ${name}'s voice profile.`);
  };

  return (
    <div className="gd-boardroom-container animate-fade-in">
      <style>{`
        .gd-boardroom-container {
          width: 100%;
          max-width: 100%;
          margin: 0;
          padding: 10px 16px;
          box-sizing: border-box;
          min-height: 100vh;
        }
        .gd-header-banner {
          background: var(--bg2);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 12px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        .gd-setup-column-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 24px;
        }
        .gd-setup-card {
          background: var(--bg2);
          border: 1px solid var(--border);
          border-radius: 24px;
          padding: 24px;
          box-shadow: var(--shadow-md);
        }
        .gd-form-label {
          font-size: 11px;
          font-weight: 700;
          color: var(--t3);
          display: block;
          margin-bottom: 6px;
          text-transform: uppercase;
        }
        .gd-form-input {
          width: 100%;
          padding: 10px 14px;
          background: var(--bg3);
          border: 1.5px solid var(--border);
          border-radius: 10px;
          color: var(--t1);
          font-size: 13px;
          outline: none;
          transition: border-color 0.2s;
        }
        .gd-form-input:focus {
          border-color: var(--teal);
        }
        .gd-domain-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 10px;
        }
        .gd-select-btn {
          padding: 10px;
          border-radius: 10px;
          font-weight: 800;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .gd-chat-panel {
          background: var(--bg2);
          border: 1px solid var(--border);
          border-radius: 24px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          height: calc(100vh - 180px);
          min-height: 560px;
        }
        .gd-suggest-box {
          background: rgba(20, 184, 166, 0.05);
          border: 1.5px dashed var(--teal);
          border-radius: 12px;
          padding: 10px 14px;
          margin-bottom: 8px;
          position: relative;
        }
        .gd-avatar-card {
          border-radius: 12px;
          padding: 12px 14px;
          cursor: pointer;
          transition: all 0.15s ease;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .gd-avatar-demo-btn {
          background: none;
          border: 1px solid var(--teal);
          border-radius: 6px;
          padding: 2px 6px;
          color: var(--teal);
          font-size: 9px;
          font-weight: 800;
          cursor: pointer;
        }
        .gd-call-layout {
          display: grid;
          grid-template-columns: 7fr 3fr;
          gap: 16px;
          width: 100%;
          min-height: calc(100vh - 160px);
        }
        .gd-chat-window-header {
          padding: 10px 14px;
          border-bottom: 1px solid var(--border);
          background: var(--bg3);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .gd-timer-badge-active {
          background: rgba(20, 184, 166, 0.08);
          border: 1px solid var(--teal);
          border-radius: 6px;
          padding: 1px 6px;
          font-size: 9px;
          font-weight: 800;
          color: var(--teal);
          font-family: var(--font-mono);
          white-space: nowrap;
          display: flex;
          align-items: center;
          gap: 3px;
        }
        .gd-user-turn-badge {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid var(--coral);
          border-radius: 8px;
          padding: 2px 8px;
          font-size: 10px;
          font-weight: 800;
          color: var(--coral);
          animation: pulse 1.5s infinite;
        }
        .gd-bubble-container {
          display: flex;
          flex-direction: column;
        }
        .gd-bubble-meta {
          display: flex;
          gap: 4px;
          font-size: 8.5px;
          color: var(--t3);
          margin-bottom: 2px;
        }
        .gd-chat-bubble {
          padding: 8px 12px;
          border-radius: 10px;
          font-size: 11.5px;
          max-width: 85%;
          word-break: break-word;
        }
        .gd-history-panel {
          background: var(--bg2);
          border: 1px solid var(--border);
          border-radius: 24px;
          padding: 24px;
          box-shadow: var(--shadow-md);
          display: flex;
          flex-direction: column;
          max-height: 520px;
        }
        .gd-history-card {
          background: var(--bg3);
          border: 1.5px solid var(--border);
          border-radius: 12px;
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .gd-review-btn {
          background: none;
          border: 1px solid var(--teal);
          border-radius: 6px;
          padding: 2px 8px;
          color: var(--teal);
          font-size: 9px;
          font-weight: 800;
          cursor: pointer;
        }
        .gd-invite-panel {
          max-width: 760px;
          margin: 20px auto;
          background: var(--bg2);
          border: 1px solid var(--border);
          border-radius: 24px;
          padding: 24px;
          box-shadow: var(--shadow-md);
        }
      `}</style>
      
      {/* Header banner */}
      <div className="gd-header-banner">
        <div>
          <h1 style={{ fontSize: 16, fontWeight: 900, color: 'var(--t1)', display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
            🗣️ Collaborative SDE Group Boardroom
          </h1>
          <p style={{ fontSize: 11, color: 'var(--t3)', margin: '2px 0 0' }}>Simulate realistic group presentations and design debates with multi-agent avatars.</p>
        </div>
        {step !== 'call_grid' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* History Modal Toggle Button */}
            <button
              onClick={() => {
                refreshHistoryList();
                setHistoryModalOpen(true);
              }}
              className="btn-primary"
              style={{
                padding: '6px 12px',
                fontSize: 11,
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: 'var(--bg3)',
                color: 'var(--teal)',
                border: '1.5px solid var(--teal)',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              📜 Past History ({historyListState.length})
            </button>

            {/* Avatar Guide Toggle Button */}
            <button
              onClick={() => setAvatarGuideOpen(true)}
              className="btn-primary"
              style={{
                padding: '6px 12px',
                fontSize: 11,
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: 'linear-gradient(135deg, var(--teal) 0%, var(--accent) 100%)',
                color: 'white',
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer'
              }}
            >
              📖 Open Avatar Guide
            </button>
            
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  const doc = document.documentElement;
                  const isDark = doc.getAttribute('data-theme') === 'dark';
                  doc.setAttribute('data-theme', isDark ? 'light' : 'dark');
                  window.dispatchEvent(new Event('theme-change'));
                }
              }}
              className="btn-ghost"
              style={{
                padding: '5px 10px',
                fontSize: 11,
                borderRadius: 8,
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                cursor: 'pointer',
                fontWeight: 600,
                color: 'var(--t1)'
              }}
            >
              🌗 Theme
            </button>
            <Link href="/dashboard" className="btn-ghost" style={{ fontSize: 11, textDecoration: 'none' }}>
              ➔ Return to Command
            </Link>
          </div>
        )}
      </div>

      {step === 'create_room' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 1000, margin: '20px auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 24 }}>
            
            {/* Left Column: Boardroom Setup Form */}
            <div style={{
              background: 'var(--bg2)',
              border: '1px solid var(--border)',
              borderRadius: 24,
              padding: 24,
              boxShadow: 'var(--shadow-md)'
            }} className="animate-fade-in">
              <h2 style={{ fontSize: 15, fontWeight: 900, color: 'var(--t1)', textAlign: 'center', marginBottom: 20 }}>
                Step 1: Setup Boardroom Metadata
              </h2>
              <form onSubmit={handleCreateRoom} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Dynamic SDE Topic Suggestion Button */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 4 }}>
                  <button
                    type="button"
                    onClick={() => {
                      const topics = [
                        {
                          name: 'Black Friday Production Database CPU Spike Outage',
                          desc: 'Triage a sudden database thread lock congestion during peak shopping minutes while avoiding data inconsistencies.'
                        },
                        {
                          name: 'Payment Gateway Double-Charging API Race Condition',
                          desc: 'Debug and resolve a distributed database double-charging bug under heavy connection drop rates and customer complaints.'
                        },
                        {
                          name: 'Distributed Cache Eviction Stampede Emergency',
                          desc: 'Mitigate massive database queue overloads after a primary cache node failure triggers thousands of concurrent write-backs.'
                        },
                        {
                          name: 'OAuth2 Token Hijack Security Compromise',
                          desc: 'Draft a hotfix to safely invalidate leaked JWT signing keys on active apps without triggering widespread forced user logouts.'
                        },
                        {
                          name: 'WebSocket Connection Leak Memory Depletion Outage',
                          desc: 'Resolve heap memory leaks in the real-time chat gateway after reaching 100K active concurrent connections.'
                        },
                        {
                          name: 'IoT Device Remote Firmware Bricking Crisis',
                          desc: 'Mitigate a broken OTA firmware update that is currently causing 5% of active field devices to enter bootloops.'
                        }
                      ];
                      const randomTopic = topics[Math.floor(Math.random() * topics.length)];
                      setRoomName(randomTopic.name);
                      setRoomDesc(randomTopic.desc);
                      toast.success('Random Topic Loaded', `Configured debate around "${randomTopic.name}".`);
                    }}
                    style={{
                      background: 'rgba(20, 184, 166, 0.1)',
                      border: '1.5px solid var(--teal)',
                      borderRadius: 10,
                      padding: '6px 12px',
                      color: 'var(--teal)',
                      fontSize: 11,
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6
                    }}
                  >
                    🎲 Suggest Professional SDE Topic
                  </button>
                </div>

                <div>
                  <label className="gd-form-label">BOARDROOM NAME</label>
                  <input
                    type="text"
                    placeholder="e.g. AWS Multi-Region Hydration Sync"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    className="gd-form-input"
                  />
                </div>
                <div>
                  <label className="gd-form-label">ROOM OBJECTIVE (OPTIONAL)</label>
                  <input
                    type="text"
                    placeholder="e.g. Present caching architecture proposal to managers."
                    value={roomDesc}
                    onChange={(e) => setRoomDesc(e.target.value)}
                    className="gd-form-input"
                  />
                </div>

                {/* Boardroom Domain Selector */}
                <div>
                  <label className="gd-form-label" style={{ marginBottom: 8 }}>BOARDROOM DOMAIN</label>
                  <div className="gd-domain-grid">
                    {(['technical', 'sales', 'business'] as const).map(dom => {
                      const isActive = domain === dom;
                      const labelMap = {
                        technical: '💻 Technical',
                        sales: '📈 Sales',
                        business: '💼 Business'
                      };
                      return (
                        <button
                          key={dom}
                          type="button"
                          onClick={() => setDomain(dom)}
                          className="gd-select-btn"
                          style={{
                            background: isActive ? 'var(--accent)' : 'var(--bg3)',
                            border: `1.5px solid ${isActive ? 'var(--accent)' : 'var(--border)'}`,
                            color: isActive ? 'white' : 'var(--t1)'
                          }}
                        >
                          {labelMap[dom]}
                        </button>
                      );
                    })}
                  </div>
                  <p style={{ fontSize: 9.5, color: 'var(--t4)', marginTop: 6, margin: 0, textAlign: 'center' }}>
                    {domain === 'technical' && '💻 Focus on technology, code integrations, and hardware.'}
                    {domain === 'sales' && '📈 Focus on marketing budget, campaigns, and conversions.'}
                    {domain === 'business' && '💼 Focus on unit economics, operational costs, and structures.'}
                  </p>
                </div>

                {/* 1st Button Target: Difficulty Selector in Setup Panel */}
                <div>
                  <label className="gd-form-label" style={{ marginBottom: 8 }}>BOARDROOM DEBATE DIFFICULTY</label>
                  <div className="gd-domain-grid">
                    {(['easy', 'medium', 'hard'] as const).map(level => {
                      const isActive = difficulty === level;
                      return (
                        <button
                          key={level}
                          type="button"
                          onClick={() => setDifficulty(level)}
                          className="gd-select-btn"
                          style={{
                            background: isActive ? 'var(--accent)' : 'var(--bg3)',
                            border: `1.5px solid ${isActive ? 'var(--accent)' : 'var(--border)'}`,
                            color: isActive ? 'white' : 'var(--t1)',
                            textTransform: 'capitalize'
                          }}
                        >
                          {level}
                        </button>
                      );
                    })}
                  </div>
                  <p style={{ fontSize: 9.5, color: 'var(--t4)', marginTop: 6, margin: 0, textAlign: 'center' }}>
                    {difficulty === 'easy' && '🟢 Easy Mode: Avatars speak gently. Response timer is 16 seconds.'}
                    {difficulty === 'medium' && '🟡 Medium Mode: Standard boardroom debate. Response timer is 12 seconds.'}
                    {difficulty === 'hard' && '🔴 Hard Mode: Aggressive critiques, fast pace. Response timer is 8 seconds.'}
                  </p>
                </div>

                <button type="submit" className="btn-primary" style={{ justifyContent: 'center', padding: '12px', marginTop: 8 }}>
                  ➔ Configure Discussion Room
                </button>
              </form>
            </div>

            {/* Right Column: Previous Boardroom Sessions History Log */}
            <div className="gd-history-panel animate-fade-in">
              <h2 style={{ fontSize: 15, fontWeight: 900, color: 'var(--t1)', textAlign: 'center', marginBottom: 16 }}>
                📜 Previous Boardrooms
              </h2>
              {(() => {
                if (typeof window === 'undefined') return null;
                const stored = localStorage.getItem(`pinit_gd_history_${user?.id || 'anon'}`);
                let historyList: any[] = [];
                try { historyList = stored ? JSON.parse(stored) : []; } catch { historyList = []; }
                if (historyList.length === 0) {
                  return (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--t4)', gap: 8 }}>
                      <span style={{ fontSize: 32 }}>📜</span>
                      <span style={{ fontSize: 11, fontWeight: 700 }}>No previous boardroom sessions found.</span>
                    </div>
                  );
                }
                return (
                  <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10, paddingRight: 4 }}>
                    {historyList.map((past: any) => (
                      <div key={past.id} className="gd-history-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: 10, color: 'var(--t3)', fontWeight: 700 }}>{past.date}</span>
                          <span style={{ fontSize: 10, color: 'var(--teal)', fontWeight: 800 }}>Score: {past.report.score}%</span>
                        </div>
                        <h4 style={{ fontSize: 12, fontWeight: 900, color: 'var(--t1)', margin: 0 }}>{past.topic}</h4>
                        <p style={{ fontSize: 9.5, color: 'var(--t3)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{past.objective}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <span style={{ fontSize: 8.5, background: 'var(--bg2)', padding: '2px 6px', borderRadius: 4, color: 'var(--t4)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
                              {past.difficulty}
                            </span>
                            {past.domain && (
                              <span style={{ fontSize: 8.5, background: 'var(--bg2)', padding: '2px 6px', borderRadius: 4, color: 'var(--teal)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
                                {past.domain}
                              </span>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setRoomName(past.topic);
                              setRoomDesc(past.objective);
                              setMessages(past.transcript);
                              setGdReport(past.report);
                            }}
                            className="gd-review-btn"
                          >
                            🔍 Review Recap
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>

          </div>
        </div>
      )}

      {step === 'invite_concept' && (
        <div className="gd-invite-panel animate-fade-in">
          <h2 style={{ fontSize: 15, fontWeight: 900, color: 'var(--t1)', textAlign: 'center', marginBottom: 4 }}>
            Step 2: Invite Avatars & Define Focus Concept
          </h2>
          <p style={{ fontSize: 11, color: 'var(--t3)', textAlign: 'center', marginBottom: 18 }}>
            Excludes your currently selected mentor ({AVATARS.find(a => a.id === currentMentorId)?.name || 'Priya'}).
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--t3)', display: 'block', marginBottom: 6 }}>TARGET DISCUSSION TOPIC (FROM STEP 1)</label>
              <input
                type="text"
                disabled
                value={`${roomName}${roomDesc ? ' — ' + roomDesc : ''}`}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  background: 'var(--bg2)',
                  border: '1.5px solid var(--border)',
                  borderRadius: 10,
                  color: 'var(--t3)',
                  fontSize: 13,
                  outline: 'none',
                  cursor: 'not-allowed'
                }}
              />
            </div>


            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--t3)', display: 'block', marginBottom: 8 }}>SELECT INVITE PARTICIPANTS</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 12, maxHeight: 320, overflowY: 'auto', paddingRight: 6 }}>
                {filteredAvatars.map(a => {
                  const isInvited = invitedAvatars.includes(a.id);
                  return (
                    <div
                      key={a.id}
                      onClick={() => {
                        setInvitedAvatars(prev => isInvited ? prev.filter(x => x !== a.id) : [...prev, a.id]);
                      }}
                      className="gd-avatar-card"
                      style={{
                        background: isInvited ? 'rgba(20,184,166,0.06)' : 'var(--bg3)',
                        border: `1.5px solid ${isInvited ? 'var(--teal)' : 'var(--border)'}`
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 20 }}>{a.emoji}</span>
                        <span style={{ fontSize: 9, color: isInvited ? 'var(--teal)' : 'var(--t3)', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
                          {isInvited ? '🟢 INVITED' : '⚪ OFF'}
                        </span>
                      </div>
                      <div>
                        <h4 style={{ fontSize: 12, fontWeight: 900, color: 'var(--t1)', margin: 0 }}>{a.name}</h4>
                        <p style={{ fontSize: 9.5, color: 'var(--t3)', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.role}</p>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                        <span style={{ fontSize: 8, background: 'var(--bg2)', padding: '2px 6px', borderRadius: 4, color: 'var(--t4)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
                          {a.trait}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePlayDemo(a.id, a.name);
                          }}
                          className="gd-avatar-demo-btn"
                        >
                          🎙️ Voice Demo
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
              <button onClick={() => setStep('create_room')} className="btn-ghost" style={{ flex: 1, padding: 12 }}>
                ⇠ Back to Step 1
              </button>
              <PinsGate itemKey={`gd:${roomName || 'default-room'}`} category="gd" onUnlocked={handleStartCall}>
                <button className="btn-primary" style={{ width: '100%', padding: 12, justifyContent: 'center' }}>
                  ➔ Open Group Call Workspace
                </button>
              </PinsGate>
            </div>
          </div>
        </div>
      )}

      {step === 'call_grid' && (
        <div className="gd-call-layout">
          
          {/* Active Video Call Emulation Grid Component */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <MeetCallGrid
              invitedAvatars={invitedAvatars}
              avatarsList={AVATARS}
              activeSpeakingAvatar={activeSpeakingAvatar}
              currentAvatarARoleId={currentAvatarARoleId}
              currentAvatarBRoleId={currentAvatarBRoleId}
              isUserTurn={isUserTurn}
              onUserFinishSpeaking={() => handleUserFinishSpeaking()}
              onToggleRaiseHand={() => {
                const nextState = !handRaised;
                setHandRaised(nextState);
                handRaisedRef.current = nextState;
                if (nextState) {
                  toast.success("Hand Raised", "You will get the floor immediately after the current avatar finishes!");
                } else {
                  toast.info("Hand Lowered", "Interruption cancelled.");
                }
              }}
              onEndCall={handleEndCall}
              onForceExit={handleForceExitCall}
              hostId={invitedAvatars[0] || 'anish'}
              handRaised={handRaised}
              micActive={micActive}
              callDurationSeconds={callDuration}
            />
          </div>

          {/* Right Panel: Socratic board presentation chat log */}
          <div className="gd-chat-panel">
            <div className="gd-chat-window-header">
              <div>
                <span style={{ fontSize: 9, fontFamily: 'var(--font-mono)', color: 'var(--t3)' }}>BOARD OBJECTIVE</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ fontSize: 11.5, fontWeight: 900, color: 'var(--t1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 140 }}>{selectedConcept}</div>
                  <div className="gd-timer-badge-active">
                    <span>⏱️</span>
                    <span>{Math.floor(callDuration / 60).toString().padStart(2, '0')}:{(callDuration % 60).toString().padStart(2, '0')}</span>
                  </div>
                </div>
              </div>
              {candidateTurnTimer !== null && (
                <div className="gd-user-turn-badge">
                  🎙️ USER TURN: {candidateTurnTimer}s
                </div>
              )}
            </div>

            {/* Message window */}
            <div style={{ flex: 1, overflowY: 'auto', padding: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {messages.map((m, idx) => (
                <div key={idx} className="gd-bubble-container" style={{ alignItems: m.role === 'SDE Candidate' ? 'flex-end' : 'flex-start' }}>
                  <div className="gd-bubble-meta">
                    <span>{m.emoji}</span>
                    <strong>{m.sender}</strong>
                    <span>({m.role})</span>
                  </div>
                  <div 
                    className="gd-chat-bubble"
                    style={{
                      background: m.role === 'SDE Candidate' ? 'var(--accent)' : 'var(--bg3)',
                      color: m.role === 'SDE Candidate' ? 'white' : 'var(--t1)'
                    }}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div style={{ display: 'flex', gap: 4, alignItems: 'center', padding: 4 }}>
                  <span style={{ fontSize: 10, color: 'var(--t3)' }}>⚡ Avatars thinking...</span>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input & Microphone bar (Strict Voice-to-Voice) */}
            <div style={{ borderTop: '1px solid var(--border)', background: 'var(--bg3)', padding: 10 }}>
              
              {/* Reading script prompt card */}
              {suggestedHelperText && (
                <div style={{
                  background: 'rgba(20, 184, 166, 0.05)',
                  border: '1.5px dashed var(--teal)',
                  borderRadius: 12,
                  padding: '10px 14px',
                  marginBottom: 8,
                  position: 'relative'
                }} className="animate-fade-in">
                  <div style={{ fontSize: 9, fontWeight: 900, color: 'var(--teal)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span>📖 SUGGESTED ARGUMENT (READ THIS ALOUD)</span>
                    <button
                      onClick={() => setSuggestedHelperText('')}
                      style={{ background: 'none', border: 'none', color: 'var(--t4)', cursor: 'pointer', fontSize: 11, fontWeight: 900 }}
                    >
                      ✕
                    </button>
                  </div>
                  <p style={{ margin: 0, fontSize: 11, color: 'var(--t1)', lineHeight: 1.4 }}>
                    "{suggestedHelperText}"
                  </p>
                </div>
              )}

              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={toggleMic}
                  style={{
                    background: micActive ? 'rgba(239, 68, 68, 0.2)' : 'rgba(20, 184, 166, 0.1)',
                    border: `1.5px solid ${micActive ? 'var(--coral)' : 'var(--teal)'}`,
                    borderRadius: '50%',
                    width: 34,
                    height: 34,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: 14,
                    transition: 'all 0.2s',
                    outline: 'none'
                  }}
                  title={micActive ? 'Mute Microphone' : 'Unmute Microphone (Speak to Boardroom)'}
                >
                  {micActive ? '🎙️' : '🔇'}
                </button>
                
                <div style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: 16,
                  border: '1px solid var(--border)',
                  background: 'var(--bg2)',
                  color: micActive ? 'var(--teal)' : 'var(--t3)',
                  fontSize: 10.5,
                  fontWeight: 800,
                  fontFamily: 'var(--font-mono)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}>
                  <span style={{ animation: micActive ? 'pulse 1.5s infinite' : 'none' }}>
                    {micActive ? '🟢' : '🔴'}
                  </span>
                  {micActive ? "LIVE CAPTURE: Speak into your microphone..." : "VOICE TRANSMISSION MUTED"}
                </div>

                <button
                  type="button"
                  onClick={handleSuggestArgument}
                  style={{
                    background: 'rgba(20, 184, 166, 0.1)',
                    border: '1.5px solid var(--teal)',
                    borderRadius: 12,
                    padding: '8px 12px',
                    color: 'var(--teal)',
                    fontSize: 10,
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    whiteSpace: 'nowrap'
                  }}
                  title="Generate a technical talking point helper"
                >
                  🎲 Suggest Point
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const updated = !handRaised;
                    setHandRaised(updated);
                    toast.success(
                      updated ? 'Hand Raised' : 'Hand Lowered',
                      updated ? 'You will be called to speak next!' : 'Hand speaking request cancelled.'
                    );
                  }}
                  style={{
                    background: handRaised ? 'rgba(249, 115, 22, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                    border: `1.5px solid ${handRaised ? 'var(--orange)' : 'var(--border)'}`,
                    borderRadius: 12,
                    padding: '8px 12px',
                    color: handRaised ? 'var(--orange)' : 'var(--t2)',
                    fontSize: 10,
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    whiteSpace: 'nowrap'
                  }}
                  title="Raise hand to request speaking in the next turn chance"
                >
                  {handRaised ? '🙋 Hand Raised' : '🙋 Raise Hand'}
                </button>
              </div>
              {micActive && (
                <div style={{ fontSize: 8.5, color: 'var(--coral)', textAlign: 'center', marginTop: 4, fontFamily: 'var(--font-mono)' }}>
                  🔴 MICROPHONE IS RECORDING IN REAL-TIME
                </div>
              )}
            </div>
          </div>

        </div>
      )}

      {/* Avatar Voice & Cast Guide Modal (2nd Button Target) */}
      {avatarGuideOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(4px)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20
        }}>
          <div style={{
            background: 'var(--bg2)',
            border: '1.5px solid var(--border)',
            borderRadius: 24,
            width: '100%',
            maxWidth: 960,
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 12px 36px rgba(0,0,0,0.4)',
            animation: 'fade-in 0.2s'
          }}>
            <div style={{
              padding: '16px 24px',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'var(--bg3)'
            }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: 'var(--t1)' }}>🤖 Multi-Agent Avatar & Voice Cast Guide</h3>
                <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--t3)' }}>Preview visual profiles, behavioral traits, and listen to neural Kokoro/Kitten voice samples.</p>
              </div>
              <button
                onClick={() => { stopSpeaking(); setAvatarGuideOpen(false); }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--t2)',
                  fontSize: 20,
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
              {AVATARS.map(avatar => {
                const isUserActiveMentor = avatar.id === currentMentorId;
                return (
                  <div
                    key={avatar.id}
                    style={{
                      background: 'var(--bg3)',
                      border: '1px solid var(--border)',
                      borderRadius: 16,
                      padding: 16,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8,
                      opacity: isUserActiveMentor ? 0.6 : 1,
                      position: 'relative'
                    }}
                  >
                    {isUserActiveMentor && (
                      <span style={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        background: 'var(--accent)',
                        color: 'white',
                        fontSize: 8.5,
                        fontWeight: 900,
                        padding: '2px 6px',
                        borderRadius: 6,
                        fontFamily: 'var(--font-mono)'
                      }}>
                        ACTIVE MENTOR
                      </span>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 26 }}>{avatar.emoji}</span>
                      <div>
                        <h4 style={{ margin: 0, fontSize: 13, fontWeight: 900, color: 'var(--t1)' }}>{avatar.name}</h4>
                        <span style={{ fontSize: 9.5, color: 'var(--t3)', fontFamily: 'var(--font-mono)' }}>{avatar.role}</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      <span style={{
                        fontSize: 8.5,
                        background: 'rgba(20,184,166,0.1)',
                        border: '1px solid var(--teal)',
                        color: 'var(--teal)',
                        padding: '2px 6px',
                        borderRadius: 6,
                        fontWeight: 800,
                        textTransform: 'uppercase'
                      }}>
                        Trait: {avatar.trait}
                      </span>
                      <span style={{
                        fontSize: 8.5,
                        background: 'rgba(79,70,229,0.1)',
                        border: '1px solid #4f46e5',
                        color: '#818cf8',
                        padding: '2px 6px',
                        borderRadius: 6,
                        fontWeight: 800,
                        fontFamily: 'var(--font-mono)'
                      }}>
                        Voice: {avatar.voiceName}
                      </span>
                    </div>

                    <p style={{ margin: 0, fontSize: 11, color: 'var(--t2)', flex: 1 }}>{avatar.description}</p>

                    <button
                      onClick={() => handlePlayDemo(avatar.id, avatar.name)}
                      className="btn-ghost"
                      style={{
                        width: '100%',
                        padding: '6px',
                        fontSize: 10.5,
                        borderRadius: 8,
                        background: 'var(--bg2)',
                        border: '1.5px solid var(--border)',
                        color: 'var(--teal)',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6
                      }}
                    >
                      🎙️ Play Neural Voice Sample
                    </button>
                  </div>
                );
              })}
            </div>

            <div style={{ padding: '12px 24px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', background: 'var(--bg3)' }}>
              <button
                onClick={() => { stopSpeaking(); setAvatarGuideOpen(false); }}
                className="btn-primary"
                style={{ padding: '8px 16px', fontSize: 12, cursor: 'pointer' }}
              >
                Close Cast Guide
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 📜 Boardroom History & Analytics Modal */}
      {historyModalOpen && (
        <div className="gd-modal-backdrop animate-fade-in" onClick={(e) => { if (e.target === e.currentTarget) setHistoryModalOpen(false); }}>
          <div className="gd-modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: 16 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: 'var(--t1)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  📜 Boardroom Discussion History & Analytics
                </h3>
                <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--t3)' }}>
                  Review past debate transcripts, performance scores, and identified architectural gaps.
                </p>
              </div>
              <button
                onClick={() => { setHistoryModalOpen(false); setSelectedHistoryItem(null); }}
                className="btn-ghost"
                style={{ padding: '6px 12px', fontSize: 13, border: '1px solid var(--border)', borderRadius: 8, cursor: 'pointer' }}
              >
                ✕ Close
              </button>
            </div>

            {/* Aggregate Stats Bar */}
            {historyListState.length > 0 && (
              <div style={{ display: 'flex', gap: 12 }}>
                <div className="gd-stat-card">
                  <span className="gd-stat-value">{historyListState.length}</span>
                  <span className="gd-stat-label">Total Boardrooms</span>
                </div>
                <div className="gd-stat-card">
                  <span className="gd-stat-value" style={{ color: 'var(--teal)' }}>
                    {Math.round(historyListState.reduce((acc, curr) => acc + (curr.report?.score || 75), 0) / historyListState.length)}%
                  </span>
                  <span className="gd-stat-label">Avg Performance Score</span>
                </div>
                <div className="gd-stat-card">
                  <span className="gd-stat-value" style={{ color: 'var(--accent)', fontSize: 15, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {historyListState[0]?.report?.gapsIdentified?.[0] || 'Lock Contention'}
                  </span>
                  <span className="gd-stat-label">Primary Focus Area</span>
                </div>
              </div>
            )}

            {/* Search & Domain Filter Bar */}
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <input
                type="text"
                placeholder="🔍 Search past topics..."
                value={historySearchQuery}
                onChange={(e) => setHistorySearchQuery(e.target.value)}
                className="gd-form-input"
                style={{ flex: 2 }}
              />
              <select
                value={historyDomainFilter}
                onChange={(e) => setHistoryDomainFilter(e.target.value as any)}
                className="gd-form-input"
                style={{ flex: 1, padding: '10px 14px' }}
              >
                <option value="all">🌐 All Domains</option>
                <option value="technical">💻 Technical</option>
                <option value="sales">📈 Sales</option>
                <option value="business">💼 Business</option>
              </select>
            </div>

            {/* History List or Selected Detail View */}
            {selectedHistoryItem ? (
              /* Selected Session Detail View */
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, background: 'var(--bg3)', border: '1.5px solid var(--border)', borderRadius: 16, padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <button
                      onClick={() => setSelectedHistoryItem(null)}
                      className="btn-ghost"
                      style={{ padding: '4px 10px', fontSize: 11, border: '1px solid var(--border)', borderRadius: 6, cursor: 'pointer', marginBottom: 8, fontWeight: 700 }}
                    >
                      ← Back to History List
                    </button>
                    <h4 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: 'var(--t1)' }}>
                      {selectedHistoryItem.topic}
                    </h4>
                    <p style={{ margin: '4px 0 0', fontSize: 11.5, color: 'var(--t3)' }}>
                      {selectedHistoryItem.objective} | Date: {selectedHistoryItem.date}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <div style={{
                      background: 'rgba(20,184,166,0.15)',
                      border: '1.5px solid var(--teal)',
                      borderRadius: 12,
                      padding: '8px 16px',
                      color: 'var(--teal)',
                      fontSize: 16,
                      fontWeight: 900
                    }}>
                      Score: {selectedHistoryItem.report?.score || 75}%
                    </div>
                    <button
                      onClick={() => handleExportHistoryJSON(selectedHistoryItem)}
                      className="btn-ghost"
                      style={{ padding: '8px 12px', fontSize: 11, border: '1px solid var(--teal)', color: 'var(--teal)', borderRadius: 8, cursor: 'pointer', fontWeight: 800 }}
                    >
                      📥 Export JSON
                    </button>
                    <button
                      onClick={() => handleDeleteHistoryItem(selectedHistoryItem.id)}
                      className="btn-ghost"
                      style={{ padding: '8px 12px', fontSize: 11, border: '1px solid var(--red)', color: 'var(--red)', borderRadius: 8, cursor: 'pointer', fontWeight: 800 }}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>

                {/* Verdict & Highlights */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 4 }}>
                  <div style={{ background: 'var(--bg2)', padding: 14, borderRadius: 12, border: '1px solid var(--border)' }}>
                    <h5 style={{ margin: '0 0 6px', fontSize: 12, fontWeight: 800, color: 'var(--t1)' }}>Evaluation Verdict</h5>
                    <p style={{ margin: 0, fontSize: 11.5, color: 'var(--t2)', lineHeight: 1.5 }}>
                      {selectedHistoryItem.report?.verdict}
                    </p>
                  </div>
                  <div style={{ background: 'var(--bg2)', padding: 14, borderRadius: 12, border: '1px solid var(--border)' }}>
                    <h5 style={{ margin: '0 0 6px', fontSize: 12, fontWeight: 800, color: 'var(--t1)' }}>Identified Gaps</h5>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {(selectedHistoryItem.report?.gapsIdentified || []).map((gap: string, idx: number) => (
                        <span key={idx} style={{ fontSize: 11, color: 'var(--coral)', fontWeight: 700 }}>
                          🚨 {gap}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Searchable Transcript Log */}
                <div>
                  <h5 style={{ margin: '8px 0 8px', fontSize: 12, fontWeight: 800, color: 'var(--t1)' }}>📜 Session Transcript</h5>
                  <div style={{
                    maxHeight: 260,
                    overflowY: 'auto',
                    background: '#090d16',
                    border: '1px solid var(--border)',
                    borderRadius: 12,
                    padding: 14,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10
                  }}>
                    {(selectedHistoryItem.transcript || []).map((msg: any, idx: number) => (
                      <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'SDE Candidate' ? 'flex-end' : 'flex-start' }}>
                        <div style={{ display: 'flex', gap: 4, fontSize: 8.5, color: 'var(--t3)', marginBottom: 2 }}>
                          <span>{msg.emoji || '💬'}</span>
                          <strong>{msg.sender}</strong>
                          <span>({msg.role})</span>
                        </div>
                        <div style={{
                          padding: '8px 12px',
                          borderRadius: 10,
                          fontSize: 11.5,
                          background: msg.role === 'SDE Candidate' ? 'var(--accent)' : 'var(--bg2)',
                          color: msg.role === 'SDE Candidate' ? 'white' : 'var(--t1)',
                          maxWidth: '85%',
                          wordBreak: 'break-word'
                        }}>
                          {msg.content}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* History Records List */
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 380, overflowY: 'auto' }}>
                {(() => {
                  const filtered = historyListState.filter(item => {
                    const matchesSearch = !historySearchQuery.trim() || item.topic.toLowerCase().includes(historySearchQuery.toLowerCase()) || (item.objective || '').toLowerCase().includes(historySearchQuery.toLowerCase());
                    const matchesDomain = historyDomainFilter === 'all' || item.domain === historyDomainFilter;
                    return matchesSearch && matchesDomain;
                  });

                  if (filtered.length === 0) {
                    return (
                      <div style={{ padding: 30, textAlign: 'center', color: 'var(--t3)', fontSize: 12 }}>
                        No boardroom history records found matching your filters.
                      </div>
                    );
                  }

                  return filtered.map((record) => (
                    <div
                      key={record.id}
                      onClick={() => setSelectedHistoryItem(record)}
                      className="gd-history-card"
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 13, fontWeight: 900, color: 'var(--t1)' }}>
                            {record.topic}
                          </span>
                          {record.domain && (
                            <span style={{ fontSize: 8.5, background: 'rgba(20,184,166,0.1)', border: '1px solid var(--teal)', padding: '2px 6px', borderRadius: 4, color: 'var(--teal)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', fontWeight: 800 }}>
                              {record.domain}
                            </span>
                          )}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{ fontSize: 12, fontWeight: 900, color: (record.report?.score || 75) >= 80 ? 'var(--green)' : 'var(--orange)' }}>
                            {record.report?.score || 75}%
                          </span>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setSelectedHistoryItem(record); }}
                            className="gd-review-btn"
                          >
                            🔍 View Recap
                          </button>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); handleDeleteHistoryItem(record.id); }}
                            style={{ background: 'none', border: 'none', color: 'var(--red)', fontSize: 12, cursor: 'pointer', opacity: 0.7 }}
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                      <p style={{ margin: 0, fontSize: 11, color: 'var(--t3)' }}>
                        {record.objective || 'General architectural debate'} | Date: {record.date}
                      </p>
                    </div>
                  ));
                })()}
              </div>
            )}
          </div>
        </div>
      )}

      {gdReport && (
        <div ref={reportRef}>
          <GdReport
            report={gdReport}
            transcript={messages}
            onRestart={() => {
              setStep('create_room');
              setGdReport(null);
              setInvitedAvatars([]);
              setMessages([]);
              setDomain('technical');
            }}
          />
        </div>
      )}

    </div>
  );
}
