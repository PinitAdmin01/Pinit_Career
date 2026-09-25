'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useCareerOS } from '@/lib/context/CareerOSContext';
import { useAuth } from '@/lib/context/AuthContext';
import { api } from '@/lib/api/client';
import { useQueryClient } from '@tanstack/react-query';
import { KEYS } from '@/lib/api/hooks';
import {
  Message,
  parseExperience,
  IDENTITY_QS,
  getIdentityQuestions,
  WORKPLACE_SCENARIOS,
  WORKPLACE_SCENARIOS_BUSINESS,
  ScreenType,
} from '../types';
import {
  GoalDiscoveryAnswers,
  DiagnosticAnswerSession,
  CompleteDiagnosticInput,
  CompleteDiagnosticProfile,
  evaluateDiagnosticSession,
} from '@/lib/onboarding/diagnosticEngine';
import {
  speakWithAvatar,
  stopSpeaking,
  preloadTTS,
  preloadNextSpeech,
  getAvatarVoiceVolume,
  setAvatarVoiceVolume
} from '@/lib/tts';
import { pingRenderServer } from '@/lib/smartVoiceRouter';
import { toast } from '@/lib/store/useAppStore';
import { markOnboardingStoryPending } from '@/lib/storyTour';
import { preloadAvatarGLB } from '@/components/avatar/VRoidInterviewAvatar';
import { ambientAudio } from '@/lib/audio/ambientAudioEngine';
import {
  VaultCategory,
  VaultDocumentSlot,
  IdentityAuditReport,
  LiveQTCalibration,
  classifyDocumentCategory,
  auditDocumentCollection,
  calculateLiveQTMetrics,
} from '@/lib/ats/documentAuditEngine';

export function useOnboardingWizard() {
  const router = useRouter();
  const qc = useQueryClient();
  const { user, refresh } = useAuth();
  const cOS = useCareerOS();

  useEffect(() => {
    // Only redirect staff roles that do not participate in student onboarding (teachers, recruiters, parents, consultants)
    // Platform administrators and superadmins are permitted to access /onboarding for QA testing and fast-complete verification
    if (user && user.role && user.role !== 'student' && user.role !== 'admin' && user.role !== 'superadmin') {
      if (user.role === 'teacher') router.replace('/admin/teacher');
      else if (user.role === 'recruiter') router.replace('/recruiter');
      else if (user.role === 'parent') router.replace('/parent');
      else if (user.role === 'consultant') router.replace('/consultant');
      return;
    }
    // Guarantee previous public landing ambient music stops immediately
    ambientAudio.stopImmediate();
    preloadTTS();
    const introText = "Welcome to your personal diagnostic assessment! To calibrate your career track, what is your primary academic domain or focus?";
    preloadNextSpeech(introText, 'priya');
  }, [user, router]);

  // Screen/Route States typed via ScreenType
  const [activeScreen, setActiveScreen] = useState<ScreenType>('CHOOSE_GUIDE');

  // Decision Engine Diagnostic States (Parts A, B, C, D)
  const [diagnosticGoal, setDiagnosticGoal] = useState<GoalDiscoveryAnswers | null>(null);
  const [diagnosticAnswers, setDiagnosticAnswers] = useState<DiagnosticAnswerSession | null>(null);
  const [diagnosticProfile, setDiagnosticProfile] = useState<CompleteDiagnosticProfile | null>(null);
  
  // Candidate Secure Vault 2.0 State
  const [showVaultModal, setShowVaultModal] = useState(false);
  const [vaultUploading, setVaultUploading] = useState(false);
  const [activeVaultTab, setActiveVaultTab] = useState<'resume' | 'academic' | 'achievements' | 'certifications' | 'analytics'>('resume');
  const [vaultSlots, setVaultSlots] = useState<VaultDocumentSlot[]>(() => {
    const existing = (cOS as any)?.vaultItems;
    if (existing && Array.isArray(existing) && existing.length > 0) {
      return existing.map((item: any) => ({
        id: item.id,
        category: (item.item_type === 'resume' ? 'resume' : item.item_type === 'certification' ? 'certification' : 'achievement') as VaultCategory,
        title: item.title || 'Document',
        fileName: item.title || 'document.pdf',
        fileSize: 'Vault Synced',
        fileType: 'application/pdf',
        candidateName: user?.displayName || 'Candidate',
        institution: item.organization_name || 'Academic Institution',
        scoreOrGpa: item.description || 'Verified Credential',
        skills: item.skill_tags || [],
        verificationStatus: item.verified ? 'verified' : 'provisional',
        verificationLevel: item.verified ? 'STRUCTURALLY_VALIDATED' : 'SELF_SUBMITTED',
        uploadedAt: Date.now()
      }));
    }
    return [];
  });
  const [isDraggingOverDropzone, setIsDraggingOverDropzone] = useState(false);
  const [isDraggingOverResume, setIsDraggingOverResume] = useState(false);
  const [isVerifyingAll, setIsVerifyingAll] = useState(false);
  const [customAnchorName, setCustomAnchorName] = useState<string | null>(null);

  // Screen 04-07 Diagnostics & Mindset States
  const [voiceArchetype, setVoiceArchetype] = useState<string | null>(null);
  const [identityScores, setIdentityScores] = useState<Record<string, number>>({ logic: 50, pace: 50 });
  const [simulationScores, setSimulationScores] = useState<Record<string, number>>({ PatternHunter: 0, Stabilizer: 0, SocialIQ: 0, Explorer: 0 });

  // Standardized Vault date formatter
  const formatVaultDate = (timestamp?: number) => {
    if (!timestamp) return 'Verified Today';
    try {
      return new Date(timestamp).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return 'Verified';
    }
  };

  // Primary anchor name and derived live audit / QT metrics
  const resumeDoc = vaultSlots.find(s => s.category === 'resume' && s.candidateName && s.candidateName.toLowerCase() !== 'candidate');
  const anyDocWithName = vaultSlots.find(s => s.candidateName && s.candidateName.toLowerCase() !== 'candidate');
  const primaryCandidateName = customAnchorName || resumeDoc?.candidateName || (user?.displayName && user.displayName !== 'Candidate' ? user.displayName : anyDocWithName?.candidateName) || 'Candidate';
  const identityAuditReport: IdentityAuditReport = auditDocumentCollection(primaryCandidateName, vaultSlots);
  const liveQTMetrics: LiveQTCalibration = calculateLiveQTMetrics(
    vaultSlots,
    identityAuditReport,
    0,
    0,
    0,
    simulationScores,
    identityScores,
    voiceArchetype
  );

  // Upload single document to a target slot
  const handleUploadToSlot = async (file: File, targetCategory: VaultCategory) => {
    if (!file) return;
    setVaultUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', targetCategory);
      formData.append('primaryName', primaryCandidateName);

      const res = await api.post<{ ok: boolean; document: VaultDocumentSlot; storageUrl: string; message: string }>('/api/vault/upload', formData);

      if (res && res.document) {
        const newDoc = res.document;
        setVaultSlots(prev => {
          const singleSlotCategories = ['resume', '10th', '12th_puc', 'sem1', 'sem2', 'sem3', 'sem4', 'sem5', 'sem6', 'sem7', 'sem8'];
          if (singleSlotCategories.includes(targetCategory)) {
            return [...prev.filter(d => d.category !== targetCategory), newDoc];
          }
          return [...prev.filter(d => d.id !== newDoc.id), newDoc];
        });

        // Sync with CareerOS context vaultItems
        const currentVaultItems = cOS.vaultItems || [];
        const updatedVaultItem = {
          id: newDoc.id,
          title: newDoc.title,
          item_type: targetCategory === 'resume' ? 'resume' : targetCategory === 'certification' ? 'certification' : 'academic',
          organization_name: newDoc.institution || 'Verified Academic Portal',
          description: `Uploaded document: ${newDoc.fileName}. Score/GPA: ${newDoc.scoreOrGpa}. Storage: ${newDoc.storageUrl || 'Supabase'}`,
          verified: newDoc.verificationStatus === 'verified',
          ai_confidence_score: newDoc.verificationStatus === 'verified' ? 95 : 45,
          skill_tags: newDoc.skills,
          is_public: true,
          used_in_resume: true,
          used_in_portfolio: targetCategory === 'achievement' || targetCategory === 'certification'
        };
        const updatedVaultItems = [...currentVaultItems.filter(v => v.id !== newDoc.id), updatedVaultItem];
        cOS.setVaultItems(updatedVaultItems);
        cOS.setResumeGenerated(true);

        const currentSkills = new Set<string>();
        [...vaultSlots, newDoc].forEach(d => d.skills.forEach(s => currentSkills.add(s)));
        cOS.generateFusedRoadmap(Array.from(currentSkills), liveQTMetrics.weakAreas);

        if (newDoc.verificationStatus === 'mismatch_warning') {
          toast.error(
            '⚠️ Identity Discrepancy Flagged',
            newDoc.mismatchReason || `Detected name "${newDoc.candidateName}" does not match profile "${primaryCandidateName}".`
          );
        } else {
          toast.success(
            `✓ ${newDoc.title} Stored in Supabase Vault`,
            `Extracted: ${newDoc.scoreOrGpa || ''} | Institution: ${newDoc.institution || ''}`
          );
        }
      }
    } catch (err: any) {
      console.error('[Vault Slot Upload Error]:', err);
      toast.error('Upload Error', err.message || 'Failed to upload document to vault.');
    } finally {
      setVaultUploading(false);
    }
  };

  // Smart Auto-Sort Batch Upload
  const handleBatchAutoSortUpload = async (filesList: File[] | FileList) => {
    const files = Array.from(filesList);
    if (!files || files.length === 0) return;
    setVaultUploading(true);

    let successCount = 0;
    let mismatchCount = 0;
    const newUploadedDocs: VaultDocumentSlot[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const detectedCat = classifyDocumentCategory(file.name);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('category', detectedCat);
        formData.append('primaryName', primaryCandidateName);

        const res = await api.post<{ ok: boolean; document: VaultDocumentSlot; storageUrl: string }>('/api/vault/upload', formData);
        if (res && res.document) {
          const newDoc = res.document;
          newUploadedDocs.push(newDoc);
          if (newDoc.verificationStatus === 'mismatch_warning') mismatchCount++;
          else successCount++;
        }
      } catch (err) {
        console.warn('Batch item upload error', err);
      }
    }

    if (newUploadedDocs.length > 0) {
      setVaultSlots(prev => {
        let updated = [...prev];
        newUploadedDocs.forEach(newDoc => {
          const singleSlotCategories = ['resume', '10th', '12th_puc', 'sem1', 'sem2', 'sem3', 'sem4', 'sem5', 'sem6', 'sem7', 'sem8'];
          if (singleSlotCategories.includes(newDoc.category)) {
            updated = [...updated.filter(d => d.category !== newDoc.category), newDoc];
          } else {
            updated = [...updated.filter(d => d.id !== newDoc.id), newDoc];
          }
        });
        return updated;
      });

      const currentVaultItems = cOS.vaultItems || [];
      const newItemsToAdd = newUploadedDocs.map(newDoc => ({
        id: newDoc.id,
        title: newDoc.title,
        item_type: newDoc.category === 'resume' ? 'resume' : newDoc.category === 'certification' ? 'certification' : 'academic',
        organization_name: newDoc.institution || 'Verified Academic Portal',
        description: `Uploaded document: ${newDoc.fileName}. Score/GPA: ${newDoc.scoreOrGpa}. Storage: ${newDoc.storageUrl || 'Supabase'}`,
        verified: newDoc.verificationStatus === 'verified',
        ai_confidence_score: newDoc.verificationStatus === 'verified' ? 95 : 45,
        skill_tags: newDoc.skills,
        is_public: true,
        used_in_resume: true,
        used_in_portfolio: newDoc.category === 'achievement' || newDoc.category === 'certification'
      }));
      cOS.setVaultItems([...currentVaultItems.filter(v => !newUploadedDocs.some(nd => nd.id === v.id)), ...newItemsToAdd]);
      cOS.setResumeGenerated(true);

      const allUniqueSkills = new Set<string>();
      [...vaultSlots, ...newUploadedDocs].forEach(d => d.skills.forEach(s => allUniqueSkills.add(s)));
      cOS.generateFusedRoadmap(Array.from(allUniqueSkills), liveQTMetrics.weakAreas);
    }

    setVaultUploading(false);
    if (mismatchCount > 0) {
      toast.error(
        `⚠️ Batch Upload: ${mismatchCount} Identity Mismatch Found`,
        `Detected differing candidate names. Check the Integrity tab.`
      );
    } else if (newUploadedDocs.length === 0) {
      toast.error(
        'Upload Failed',
        'Could not ingest any of the uploaded files. Please ensure files contain readable text.'
      );
    } else {
      toast.success(
        `✨ Auto-Sorted ${newUploadedDocs.length} Document${newUploadedDocs.length > 1 ? 's' : ''}!`,
        `Stored in Supabase and categorized into academic, resume, and certification slots.`
      );
    }
  };

  // Delete slot document
  const handleDeleteSlot = async (slotId: string, storageUrl?: string) => {
    try {
      await api.post('/api/vault/delete', { documentId: slotId, storageUrl });
      setVaultSlots(prev => prev.filter(d => d.id !== slotId));
      const currentVaultItems = cOS.vaultItems || [];
      cOS.setVaultItems(currentVaultItems.filter(v => v.id !== slotId));
      toast.info('Document Removed', 'Vault item deleted from storage and database.');
    } catch (err) {
      console.warn('Delete error', err);
      setVaultSlots(prev => prev.filter(d => d.id !== slotId));
    }
  };

  // Real Verification Run for all documents in vault
  const handleRunAllVerifications = async () => {
    if (vaultSlots.length === 0) {
      toast.info('Vault Empty', 'Please upload at least one document (resume or credential) to run verifications.');
      return;
    }
    setIsVerifyingAll(true);
    try {
      const anchor = user?.displayName || (vaultSlots.find(s => s.candidateName && s.candidateName !== 'Candidate')?.candidateName) || 'Candidate';
      const audit = auditDocumentCollection(anchor, vaultSlots);
      const metrics = calculateLiveQTMetrics(
        vaultSlots,
        audit,
        0, 0, 0,
        simulationScores,
        identityScores,
        voiceArchetype
      );

      await new Promise(r => setTimeout(r, 600));

      setVaultSlots(prev => prev.map(slot => {
        const isMismatch = audit.conflictingDocuments.some(c => c.slotId === slot.id);
        return {
          ...slot,
          verificationStatus: isMismatch ? 'mismatch_warning' : 'verified',
          verificationLevel: isMismatch ? 'SELF_SUBMITTED' : 'CROSS_VALIDATED'
        };
      }));

      if (audit.mismatchCount > 0) {
        toast.warning(
          'Identity Warnings Flagged',
          `Calibrated QT2 Score at ${metrics.qt2Score}/100. Flagged ${audit.mismatchCount} conflicting identity record(s).`
        );
      } else {
        toast.success(
          'Sentinel Verification Complete',
          `QT2 Cognitive Mindset calibrated at ${metrics.qt2Score}/100 (${metrics.evaluatedDataPoints} validated data points). Archetype: ${metrics.qt2Evaluation?.archetypeBlendTitle || 'Calibrated'}.`
        );
      }
    } catch (err: any) {
      console.error('[Run All Verifications Error]:', err);
      toast.error('Verification Error', err?.message || 'Verification could not be completed.');
    } finally {
      setIsVerifyingAll(false);
    }
  };

  const handleVerifySingleDocument = async (_docId: string) => {
    await handleRunAllVerifications();
  };
  const handleVerifyAllDocuments = handleRunAllVerifications;

  const activeScreenRef = useRef(activeScreen);
  const isSpeakingRef = useRef(false);
  const isListeningRef = useRef(false);
  const [, setIsAvatarSpeaking] = useState(false);

  // Common States
  const [animState, setAnimState] = useState<'idle' | 'talking' | 'listening' | 'thinking' | 'wave' | 'nod' | 'shrug'>('wave');
  const [zoom, setZoom] = useState(1.617);
  const [isMuted, setIsMuted] = useState(false);
  const [isBgmMuted, setIsBgmMuted] = useState(false);
  const bgMusicRef = useRef<HTMLAudioElement | null>(null);
  const [useNeural, setUseNeural] = useState(true);
  const [recognizing, setRecognizing] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<'priya' | 'anish'>('priya');

  const stopAvatarSpeaking = () => {
    stopSpeaking();
    setIsAvatarSpeaking(false);
    isSpeakingRef.current = false;
    setAnimState('idle');
  };

  useEffect(() => {
    activeScreenRef.current = activeScreen;
  }, [activeScreen]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        stopAvatarSpeaking();
        stopVoiceListening();
      };
    }
  }, []);

  // Preload 3D Avatar GLBs on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      pingRenderServer();
      preloadAvatarGLB(['priya', 'anish']);
      void pingRenderServer(false);
    }
  }, []);

  // Background Audio Controller
  useEffect(() => {
    if (typeof window !== 'undefined') {
      ambientAudio.stopImmediate();

      const audio = new Audio('/audio/onboarding_bg.mp3');
      audio.loop = true;
      const initialMuted = ambientAudio.isMuted();
      setIsBgmMuted(initialMuted);
      setIsMuted(getAvatarVoiceVolume() === 0);

      const targetVol = initialMuted ? 0 : (ambientAudio.getVolume() || 0.3) * 0.4;
      audio.volume = targetVol;
      bgMusicRef.current = audio;

      const handleFirstInteraction = () => {
        ambientAudio.stopImmediate();
        if (audio.paused && !ambientAudio.isMuted()) {
          audio.play().catch(() => {});
        }
        window.removeEventListener('click', handleFirstInteraction);
      };
      window.addEventListener('click', handleFirstInteraction);

      const handleAmbientVolumeChange = (e: any) => {
        if (typeof e.detail?.volume === 'number' && bgMusicRef.current) {
          const scaled = e.detail.volume * 0.4;
          bgMusicRef.current.volume = Math.max(0, Math.min(1, scaled));
          if (e.detail.volume > 0 && !ambientAudio.isMuted()) {
            setIsBgmMuted(false);
            bgMusicRef.current.play().catch(() => {});
          }
        }
      };

      const handleMuteChange = (e: any) => {
        if (typeof e.detail?.muted === 'boolean') {
          setIsBgmMuted(e.detail.muted);
          if (bgMusicRef.current) {
            if (e.detail.muted) {
              bgMusicRef.current.pause();
            } else {
              bgMusicRef.current.play().catch(() => {});
            }
          }
        }
      };

      const handleAvatarVolumeChange = (e: any) => {
        if (typeof e.detail?.volume === 'number') {
          setIsMuted(e.detail.volume === 0);
        }
      };

      window.addEventListener('pc_audio_volume_changed', handleAmbientVolumeChange);
      window.addEventListener('pc_audio_mute_changed', handleMuteChange);
      window.addEventListener('pc_avatar_volume_changed', handleAvatarVolumeChange);

      return () => {
        window.removeEventListener('click', handleFirstInteraction);
        window.removeEventListener('pc_audio_volume_changed', handleAmbientVolumeChange);
        window.removeEventListener('pc_audio_mute_changed', handleMuteChange);
        window.removeEventListener('pc_avatar_volume_changed', handleAvatarVolumeChange);
        audio.pause();
        audio.src = '';
      };
    }
  }, []);

  useEffect(() => {
    if (bgMusicRef.current) {
      if (isBgmMuted) {
        bgMusicRef.current.pause();
      } else {
        bgMusicRef.current.play().catch(() => {});
      }
    }
  }, [isBgmMuted]);

  // Voice Analytics States
  const [speechStartTime, setSpeechStartTime] = useState<number | null>(null);
  const speechStartTimeRef = useRef<number | null>(null);
  const [voiceConfidence, setVoiceConfidence] = useState<number | null>(null);
  const [voiceArticulation, setVoiceArticulation] = useState<number | null>(null);

  // Screen 02: Potential Slider States
  const [currentAbility, setCurrentAbility] = useState(30);
  const [targetAmbition, setTargetAmbition] = useState(85);

  // Screen 03: Express Form States
  const [college, setCollege] = useState('');
  const [degree, setDegree] = useState('');
  const [trajectory, setTrajectory] = useState<'java_sde' | 'react_frontend' | 'devops_cloud' | 'business_analyst' | 'financial_analyst'>('react_frontend');
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Chat/Deep Diagnostics States
  const [currentStep, setCurrentStep] = useState(0);
  const currentStepRef = useRef(currentStep);
  useEffect(() => {
    currentStepRef.current = currentStep;
  }, [currentStep]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [studentType, setStudentType] = useState('');
  const [targetGoal, setTargetGoal] = useState('');
  const [accessReason, setAccessReason] = useState('');
  const [codingExperience, setCodingExperience] = useState('');
  const [learningStyle, setLearningStyle] = useState('');
  const [weeklyHours, setWeeklyHours] = useState('');
  const [isSubmittingStep, setIsSubmittingStep] = useState(false);

  // Screen 04-07 States
  const [currentIdentityQ, setCurrentIdentityQ] = useState(0);
  const [currentScenario, setCurrentScenario] = useState(0);
  const [speechTranscript, setSpeechTranscript] = useState('');
  const [, setComputedArchetype] = useState('Pattern Hunter');

  // Syncing & Parsing States
  const [syncing, setSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [syncStatus, setSyncStatus] = useState('');
  const [parserLogs, setParserLogs] = useState<string[]>([]);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const transcriberRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const speechTimersRef = useRef<any[]>([]);

  const clearSpeechTimers = () => {
    speechTimersRef.current.forEach(timer => clearTimeout(timer));
    speechTimersRef.current = [];
  };

  const scheduleSpeech = (callback: () => void, delay: number) => {
    const timer = setTimeout(() => {
      if (speechTimersRef.current) {
        speechTimersRef.current = speechTimersRef.current.filter(t => t !== timer);
      }
      callback();
    }, delay);
    speechTimersRef.current.push(timer);
    return timer;
  };

  // Auto-scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [messages]);

  // Intent Selection Voice Greeting
  const intentGreeting = "Welcome to PinIT Career OS. I am your guidance mentor. Before we begin, do you want to continue with the Express Route to upload your resume in 1 minute, or the Deep Evolution path for a 15-minute diagnostic assessment?";

  // Cleanup speech synthesis and audio tracks on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      clearSpeechTimers();
      stopAvatarSpeaking();
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      ambientAudio.stopImmediate();
    };
  }, []);

  // Native Speech TTS
  const speakReply = useCallback((text: string) => {
    clearSpeechTimers();
    stopVoiceListening();
    isSpeakingRef.current = true;
    setIsAvatarSpeaking(true);

    speakWithAvatar(
      text,
      selectedMentor,
      () => setAnimState('talking'),
      () => {
        setAnimState('idle');
        isSpeakingRef.current = false;
        setIsAvatarSpeaking(false);
      },
      isMuted,
      useNeural
    );
  }, [selectedMentor, isMuted, useNeural]);

  const speakReplyRef = useRef(speakReply);
  useEffect(() => {
    speakReplyRef.current = speakReply;
  }, [speakReply]);

  // Voice greeting triggers on transition to INTENT_SELECTION
  useEffect(() => {
    if (activeScreen === 'INTENT_SELECTION') {
      const timer = scheduleSpeech(() => {
        speakReplyRef.current(intentGreeting);
      }, 850);
      return () => clearTimeout(timer);
    }
  }, [activeScreen, selectedMentor]);

  // Auto-Read Question Out Loud on Identity Discovery Slides
  useEffect(() => {
    if (activeScreen === 'IDENTITY_QUESTIONS') {
      const identityQs = getIdentityQuestions(studentType);
      const q = identityQs[Math.min(currentIdentityQ, identityQs.length - 1)];
      if (q) {
        const speechText = `${q.category}. ${q.text}`;
        const timer = scheduleSpeech(() => {
          speakReplyRef.current(speechText);
        }, 250);
        return () => clearTimeout(timer);
      }
    }
  }, [activeScreen, currentIdentityQ, studentType, selectedMentor]);

  // Auto-Read Scenario Out Loud on Workplace Simulations
  useEffect(() => {
    if (activeScreen === 'WORKPLACE_SIMULATION') {
      const isBusinessStream = studentType.includes('Commerce') || studentType.includes('Management') || studentType.includes('BBA') || studentType.includes('B.Com');
      const activeScenarios = isBusinessStream ? WORKPLACE_SCENARIOS_BUSINESS : WORKPLACE_SCENARIOS;
      const scenario = activeScenarios[Math.min(currentScenario, activeScenarios.length - 1)];
      if (scenario) {
        const speechText = `${scenario.title}. ${scenario.text}`;
        const timer = scheduleSpeech(() => {
          speakReplyRef.current(speechText);
        }, 250);
        return () => clearTimeout(timer);
      }
    }
  }, [activeScreen, currentScenario, studentType, selectedMentor]);

  // Helper to convert recorded audio blob to Float32 PCM at 16kHz mono (required by Whisper)
  const getAudioRawData = async (blob: Blob): Promise<Float32Array> => {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    const arrayBuf = await blob.arrayBuffer();
    const decoded = await audioCtx.decodeAudioData(arrayBuf);
    const channelData = decoded.getChannelData(0);
    await audioCtx.close();
    return channelData;
  };

  // In-browser speech transcriber (dynamic new Function CDN eval removed for security)
  const loadInBrowserTranscriber = async (): Promise<any | null> => {
    return null;
  };

  // Voice Speech Recording using MediaRecorder & Groq Whisper
  const startVoiceListening = async () => {
    if (typeof window === 'undefined') return;

    if (isListeningRef.current) {
      stopVoiceListening();
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;
      const audioChunks: Blob[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunks.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach(track => track.stop());

        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        if (audioBlob.size < 1000) {
          isListeningRef.current = false;
          setRecognizing(false);
          setAnimState('idle');
          return;
        }

        setAnimState('thinking');
        let transcript = '';
        
        try {
          const formData = new FormData();
          formData.append('file', audioBlob, 'speech.webm');
          formData.append('mimeType', audioBlob.type || 'audio/webm');

          const res = await fetch('/api/stt', {
            method: 'POST',
            body: formData
          });

          if (res.ok) {
            const data = await res.json();
            transcript = (data.text || '').trim();
          } else {
            throw new Error(`STT route returned ${res.status}`);
          }
        } catch {
          // Fallback to in-browser whisper
        }

        if (!transcript) {
          try {
            const audioRaw = await getAudioRawData(audioBlob);
            const transcriber: any = await loadInBrowserTranscriber();
            if (transcriber) {
              const output = await transcriber(audioRaw, {
                chunk_length_s: 30,
                stride_length_s: 5,
                language: 'english',
                task: 'transcribe',
              });
              transcript = (output.text || '').trim();
            }
          } catch (offlineErr) {
            console.error("[Offline STT] In-browser transcription failed:", offlineErr);
          }
        }
          
        if (transcript) {
          const startTime = speechStartTimeRef.current || speechStartTime;
          if (activeScreenRef.current === 'INTENT_SELECTION' && startTime) {
            const duration = (Date.now() - startTime) / 1000;
            const words = transcript.split(/\s+/).filter(Boolean).length;
            const wpm = duration > 0 ? (words / duration) * 60 : 125;

            const fillerRegex = /\b(um|uh|like|basically|actually|so|ah)\b/gi;
            const fillerCount = (transcript.match(fillerRegex) || []).length;

            let confidence = 100 - fillerCount * 12;
            if (wpm < 80) confidence -= 15;
            if (wpm > 180) confidence -= 10;
            confidence = Math.max(40, Math.min(100, Math.round(confidence)));

            let articulation = 90 - fillerCount * 8;
            if (wpm >= 110 && wpm <= 150) articulation += 10;
            articulation = Math.max(50, Math.min(100, Math.round(articulation)));

            let archetype = 'Direct Builder';
            if (wpm > 135 && fillerCount <= 1) {
              archetype = 'Expressive Communicator';
            } else if (wpm < 95 && fillerCount <= 2) {
              archetype = 'Reflective Analyst';
            }

            setVoiceConfidence(confidence);
            setVoiceArticulation(articulation);
            setVoiceArchetype(archetype);

            if (archetype === 'Reflective Analyst') {
              setComputedArchetype('Stabilizer');
            } else if (archetype === 'Expressive Communicator') {
              setComputedArchetype('Social IQ');
            } else {
              setComputedArchetype('Pattern Hunter');
            }
          }
          handleUserAnswer(transcript);
        } else {
          triggerAutoRestart();
        }
      };

      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 512;
      source.connect(analyser);
      analyserRef.current = analyser;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      let lastSpokenTime = Date.now();
      let hasSpoken = false;
      const recordingStartTime = Date.now();
      let noiseFloorSum = 0;
      let noiseFloorSamples = 0;

      const checkSilence = () => {
        if (!mediaRecorderRef.current || mediaRecorderRef.current.state !== 'recording') return;

        analyser.getByteFrequencyData(dataArray);
        
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const average = sum / bufferLength;
        const recordingDuration = Date.now() - recordingStartTime;

        if (recordingDuration > 7000) {
          stopVoiceListening();
          return;
        }

        if (recordingDuration < 350) {
          noiseFloorSum += average;
          noiseFloorSamples++;
          requestAnimationFrame(checkSilence);
          return;
        }

        const calculatedNoiseFloor = noiseFloorSamples > 0 ? (noiseFloorSum / noiseFloorSamples) : 5;
        const dynamicThreshold = Math.max(8, calculatedNoiseFloor + 12);

        if (average > dynamicThreshold) { 
          lastSpokenTime = Date.now();
          hasSpoken = true;
        }

        const silenceDuration = Date.now() - lastSpokenTime;

        if ((hasSpoken && silenceDuration > 1800) || (!hasSpoken && silenceDuration > 5000)) {
          stopVoiceListening();
        } else {
          requestAnimationFrame(checkSilence);
        }
      };

      mediaRecorder.start();
      isListeningRef.current = true;
      setRecognizing(true);
      setAnimState('listening');
      const now = Date.now();
      speechStartTimeRef.current = now;
      setSpeechStartTime(now);

      requestAnimationFrame(checkSilence);

    } catch (err) {
      console.error("Microphone setup failed:", err);
      toast.error("Microphone Blocked", "Please enable microphone permissions in your browser settings to continue.");
    }
  };

  const stopVoiceListening = () => {
    isListeningRef.current = false;
    speechStartTimeRef.current = null;
    setSpeechStartTime(null);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      try { mediaRecorderRef.current.stop(); } catch {}
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setRecognizing(false);
    setAnimState('idle');
  };

  const triggerAutoRestart = () => {
    if (
      (activeScreenRef.current === 'INTENT_SELECTION' || activeScreenRef.current === 'DEEP_CHAT') &&
      !isSpeakingRef.current
    ) {
      setTimeout(() => {
        if (
          (activeScreenRef.current === 'INTENT_SELECTION' || activeScreenRef.current === 'DEEP_CHAT') &&
          !isSpeakingRef.current
        ) {
          startVoiceListening();
        }
      }, 500);
    }
  };

  // Resilient onboarding sync with automatic retries and offline localStorage queue
  const postOnboardingWithRetry = async (payload: any, maxRetries = 3): Promise<boolean> => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await api.post('/api/auth/onboarding', payload);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('pinit_pending_onboarding_sync');
        }
        return true;
      } catch (err) {
        console.warn(`[Onboarding] Remote sync attempt ${attempt}/${maxRetries} failed:`, err);
        if (attempt < maxRetries) {
          await new Promise(res => setTimeout(res, 600 * attempt));
        }
      }
    }
    if (typeof window !== 'undefined' && payload) {
      try {
        localStorage.setItem('pinit_pending_onboarding_sync', JSON.stringify(payload));
      } catch {}
    }
    return false;
  };

  // ⚡ 1-Click Fast Complete (< 30s) — Administrator / QA Testing Only
  const handleFastComplete = async () => {
    if (user?.role !== 'admin' && user?.role !== 'superadmin') {
      toast.error('Restricted Action', 'Fast-complete is restricted to platform administrators for testing.');
      return;
    }
    stopAvatarSpeaking();
    clearSpeechTimers();
    setSyncing(true);
    setSyncProgress(30);
    setSyncStatus('Auto-building Software Engineering Blueprint...');

    const defaultRole = "Software Engineer";
    const defaultEdu = "Computer Science / IT Student";
    const defaultSkills = "Java Standard Library, OOP Principles, Spring Boot REST, SQL Databases, System Design";

    try {
      const payload = {
        guidanceMentorId: selectedMentor || 'kashyap',
        onboardingStep: 3,
        target_role: defaultRole,
        career_goal: "Become a high-impact Software Engineer and build production applications.",
        onboardingAnswers: {
          role: defaultRole,
          career_goal: "Become a high-impact Software Engineer and build production applications.",
          education: defaultEdu,
          skills: defaultSkills,
          experience: 'fresher',
          hasCompleted: true,
          codingExperience: "Intermediate Coder",
          learningStyle: "Writing code hands-on",
          weeklyHours: "10 hours per week",
          accessReason: "To close skill gaps & earn XP",
          qt1_score: liveQTMetrics.qt1Score ?? 0,
          qt2_score: liveQTMetrics.qt2Score ?? 0,
          mindset_archetype: liveQTMetrics.qt2Evaluation?.dominantArchetype || "Pending Assessment"
        },
        roadmapGenerated: true
      };

      await postOnboardingWithRetry(payload);

      cOS.setOnboarding({
        role: defaultRole,
        career_goal: "Become a high-impact Software Engineer and build production applications.",
        education: defaultEdu,
        skills: defaultSkills,
        experience: 'fresher'
      }, true);
      cOS.setOnboardingStep(3);
      cOS.setResumeGenerated(false);

      await cOS.generateFusedRoadmap(['Java', 'OOP', 'SQL'], ['Docker', 'System Design']);
      await qc.invalidateQueries({ queryKey: KEYS.me });

      if (typeof window !== 'undefined' && user?.id) {
        try {
          localStorage.setItem(`pinit_${user.id}_ob_step`, '3');
          localStorage.setItem(`pinit_${user.id}_road_gen`, 'true');
        } catch {}
      }
      setSyncing(false);
      setSyncProgress(100);
      toast.success('Fast Onboarding Complete! ⚡', 'Software Engineering Blueprint is active.');
      markOnboardingStoryPending(user?.id);
      router.push('/dashboard');
    } catch (err) {
      console.error("Fast onboarding error", err);
      if (typeof window !== 'undefined' && user?.id) {
        try {
          localStorage.setItem(`pinit_${user.id}_ob_step`, '3');
          localStorage.setItem(`pinit_${user.id}_road_gen`, 'true');
        } catch {}
      }
      setSyncing(false);
      markOnboardingStoryPending(user?.id);
      router.push('/dashboard');
    }
  };

  // Transition to Modern Decision Engine Diagnostic Route
  function startDeepDiagnostics() {
    clearSpeechTimers();
    setActiveScreen('GOAL_DISCOVERY');
    setAnimState('nod');
    const nameGreeting = primaryCandidateName && primaryCandidateName !== 'Candidate'
      ? `Welcome ${primaryCandidateName}! `
      : "Welcome! ";
    const vaultPrefix = vaultSlots.length > 0
      ? `${nameGreeting}I've verified your ${vaultSlots.length} credentials. `
      : `${nameGreeting}`;
    const introText = `${vaultPrefix}Let's calibrate your concrete career target, timeline, and current capabilities before diagnosing your problem-solving style.`;
    speakReply(introText);
  }

  // Handle Part A: Goal Discovery Completion
  const handleGoalDiscoveryComplete = (answers: GoalDiscoveryAnswers) => {
    setDiagnosticGoal(answers);
    if (answers.role) {
      setTargetGoal(answers.role);
    }
    if (answers.degreeTrack) {
      const isComm = answers.degreeTrack.includes('bcom') || answers.degreeTrack.includes('mcom') || answers.degreeTrack.includes('commerce');
      setStudentType(isComm ? 'Commerce & Finance' : 'Computer Science / Engineering');
    } else if (answers.priorExperience) {
      setStudentType(answers.priorExperience);
    }
    setActiveScreen('BEHAVIORAL_DIAGNOSTIC');
    setAnimState('nod');
    const isComm = answers.degreeTrack?.includes('bcom') || answers.degreeTrack?.includes('mcom') || answers.degreeTrack?.includes('commerce');
    const reply = isComm
      ? "Excellent! Next, let's explore your problem-solving instincts, financial agility, and collaboration patterns with real business scenarios."
      : "Excellent! Next, let's explore your problem-solving instincts, technical agility, and collaboration patterns with real engineering scenarios.";
    speakReply(reply);
  };

  // Handle Parts B, C, D: Behavioral Diagnostic Completion
  const handleBehavioralDiagnosticComplete = (answers: {
    sjtResponses: any[];
    matrixResponses: any[];
    tradeoffResponses: any[];
  }) => {
    setDiagnosticAnswers(answers);
    const completeInput: CompleteDiagnosticInput = {
      goal: {
        outcome: diagnosticGoal?.outcome || 'internship',
        role: diagnosticGoal?.role || targetGoal || 'full_stack_developer',
        degreeTrack: diagnosticGoal?.degreeTrack || 'btech_bca_mca',
        specialization: diagnosticGoal?.specialization || '',
        secondaryRoles: diagnosticGoal?.secondaryRoles || [],
        horizonMonths: diagnosticGoal?.horizonMonths ?? 6,
        motivation: diagnosticGoal?.motivation || ['career_placement'],
      },
      experience: {
        exposureLevels: diagnosticGoal?.exposureLevels || [],
        capabilitySelfRating: diagnosticGoal?.capabilitySelfRating || 'guided_builder'
      },
      constraints: {
        dailyMinutes: diagnosticGoal?.dailyMinutes ?? 90,
        primaryConstraints: diagnosticGoal?.primaryConstraints || []
      },
      sjtResponses: answers.sjtResponses || [],
      matrixResponses: answers.matrixResponses || [],
      tradeoffResponses: answers.tradeoffResponses || [],
      selectedMentor
    };
    const profile = evaluateDiagnosticSession(completeInput);
    setDiagnosticProfile(profile);
    setActiveScreen('BLUEPRINT_REVEAL');
    setAnimState('nod');
    const reply = "Assessment complete! I've synthesized your goal, behavioral traits, and trade-off balancing strategy.";
    speakReply(reply);
  };

  // Handle chatbot answers (Deep Path)
  const handleUserAnswer = (text: string) => {
    if (!text.trim()) return;
    stopAvatarSpeaking();

    if (activeScreenRef.current === 'INTENT_SELECTION') {
      const lower = text.toLowerCase();
      if (lower.includes('express') || lower.includes('one minute') || lower.includes('resume') || lower.includes('fast')) {
        setActiveScreen('EXPRESS_FORM');
        return;
      }
      if (lower.includes('deep') || lower.includes('evolution') || lower.includes('diagnostic') || lower.includes('fifteen') || lower.includes('graph')) {
        startDeepDiagnostics();
        return;
      }
      if (lower.includes('repeat') || lower.includes('again') || lower.includes('ask again') || lower.includes('speak')) {
        speakReply(intentGreeting);
        return;
      }
      if (lower.includes('back') || lower.includes('change') || lower.includes('guide')) {
        stopAvatarSpeaking();
        setActiveScreen('CHOOSE_GUIDE');
        return;
      }
      startDeepDiagnostics();
      return;
    }

    if (isSubmittingStep) return;
    setIsSubmittingStep(true);
    const stepWatchdog = setTimeout(() => {
      setIsSubmittingStep(false);
    }, 2000);

    const userMsg: Message = {
      id: `msg_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, userMsg]);
    setAnimState('thinking');

    scheduleSpeech(() => {
      setIsSubmittingStep(false);
      clearTimeout(stepWatchdog);
      const step = currentStepRef.current;
      if (step === 0) {
        setStudentType(text);
        setCurrentStep(1);
        setAnimState('nod');
        let aiReply = "Got it! Next, what is your dream career goal?";
        if (text.includes("Commerce") || text.includes("B.Com")) {
          aiReply = "Got it! Next, what is your dream career? Do you want to analyze financial markets, build FinTech solutions, or manage corporate finance?";
        } else if (text.includes("Management") || text.includes("BBA")) {
          aiReply = "Got it! Next, what is your dream career? Do you want to become a Product Manager, scale growth operations, or lead management consulting?";
        } else {
          aiReply = "Got it! Next, what is your dream job? Do you want to build web apps, architect cloud systems, or write backend software?";
        }

        setMessages(prev => [...prev, {
          id: `msg_ai_${Date.now()}`,
          sender: 'ai',
          text: aiReply,
          timestamp: Date.now()
        }]);
        speakReply(aiReply);
      } else if (step === 1) {
        setTargetGoal(text);
        setCurrentStep(2);
        setAnimState('nod');
        const aiReply = "Nice choice. Why did you join today? Are you looking for a job, wanting to learn new skills, or preparing for an interview?";
        setMessages(prev => [...prev, {
          id: `msg_ai_${Date.now()}`,
          sender: 'ai',
          text: aiReply,
          timestamp: Date.now()
        }]);
        speakReply(aiReply);
      } else if (step === 2) {
        setAccessReason(text);
        setCurrentStep(3);
        setAnimState('nod');
        let aiReply = "Understood. Next question: How much coding experience do you have? Are you a beginner, intermediate, or advanced coder?";
        if (studentType.includes("Commerce") || studentType.includes("Management") || studentType.includes("BBA") || studentType.includes("B.Com")) {
          aiReply = "Understood. Next question: What is your current domain experience level? Are you a beginner analyst, intermediate analyst, or advanced specialist?";
        }

        setMessages(prev => [...prev, {
          id: `msg_ai_${Date.now()}`,
          sender: 'ai',
          text: aiReply,
          timestamp: Date.now()
        }]);
        speakReply(aiReply);
      } else if (step === 3) {
        setCodingExperience(text);
        setCurrentStep(4);
        setAnimState('nod');
        const aiReply = "Understood. How do you prefer to learn? Do you like reading articles, watching videos, or writing code hands-on?";
        setMessages(prev => [...prev, {
          id: `msg_ai_${Date.now()}`,
          sender: 'ai',
          text: aiReply,
          timestamp: Date.now()
        }]);
        speakReply(aiReply);
      } else if (step === 4) {
        setLearningStyle(text);
        setCurrentStep(5);
        setAnimState('nod');
        const aiReply = "Last question: How many hours per week can you dedicate to learning? Five hours, ten hours, or more?";
        setMessages(prev => [...prev, {
          id: `msg_ai_${Date.now()}`,
          sender: 'ai',
          text: aiReply,
          timestamp: Date.now()
        }]);
        speakReply(aiReply);
      } else if (step === 5) {
        setWeeklyHours(text);
        setCurrentStep(6);
        setAnimState('nod');
        const aiReply = "Fantastic! Next, let's load your Identity Discovery slides to establish your cognitive styles.";
        setMessages(prev => [...prev, {
          id: `msg_ai_${Date.now()}`,
          sender: 'ai',
          text: aiReply,
          timestamp: Date.now()
        }]);
        speakReply(aiReply);

        scheduleSpeech(() => {
          setActiveScreen('IDENTITY_QUESTIONS');
          setAnimState('idle');
        }, 1500);
      }
    }, 1000);
  };

  // Helper to resolve accurate role label, courseId, skills, and technical weak areas
  const resolveTrackFromGoal = (goalRole?: string, profileType?: string) => {
    const goal = (goalRole || '').toLowerCase();
    const profile = (profileType || '').toLowerCase();

    // 1. AI & LLM Systems Engineer
    if (goal.includes('ai') || goal.includes('ml') || goal.includes('machine learning') || goal.includes('llm') || goal.includes('deep learning')) {
      return {
        targetRoleLabel: 'AI & LLM Systems Engineer',
        courseId: 'course-ai-eng',
        skillsList: 'Python 3.12, PyTorch, LangChain, Vector Databases (pgvector/Pinecone), RAG Architecture, LLM Prompt Engineering',
        weakAreas: ['Vector Index Tuning', 'Model Evaluation & Grounding', 'Async Agent Pipelines']
      };
    }

    // 2. Data & Business Analytics
    if (goal.includes('data') || goal.includes('analytics') || goal.includes('business_analytics')) {
      return {
        targetRoleLabel: 'Data & Business Analytics Specialist',
        courseId: 'course-bcom-analytics',
        skillsList: 'SQL Analytics, Advanced Excel, Python Data Science, Pandas, PowerBI Dashboarding, Statistical Modeling',
        weakAreas: ['A/B Test Design', 'Data Pipeline ETL', 'Predictive Modeling']
      };
    }

    // 3. Cybersecurity Analyst
    if (goal.includes('cyber') || goal.includes('security') || goal.includes('infosec')) {
      return {
        targetRoleLabel: 'Cybersecurity Analyst',
        courseId: 'course-cybersecurity',
        skillsList: 'Network Defense, OWASP Top 10, Penetration Testing, SIEM Log Analysis, Cryptography, Vulnerability Assessment',
        weakAreas: ['Zero Trust Architecture', 'Cloud Security Posture', 'Incident Response Playbooks']
      };
    }

    // 4. React Frontend Engineer
    if (goal.includes('front') || goal.includes('react') || goal.includes('web dev') || goal.includes('next')) {
      return {
        targetRoleLabel: 'React Frontend Web SDE',
        courseId: 'course-react-web',
        skillsList: 'React 18, Next.js SSR, TypeScript, TailwindCSS, CSS Architecture, State Management (Zustand), Web Performance',
        weakAreas: ['Webpack / Vite Bundling', 'Core Web Vitals Optimization', 'React Testing Library']
      };
    }

    // 5. Cloud & DevOps Engineer
    if (goal.includes('devops') || goal.includes('cloud') || goal.includes('aws') || goal.includes('docker') || goal.includes('kubernetes')) {
      return {
        targetRoleLabel: 'Cloud & DevOps Engineer',
        courseId: 'course-devops-cicd',
        skillsList: 'Docker Containers, Kubernetes, CI/CD GitHub Actions, AWS Cloud Infrastructure, Terraform IaC, Prometheus Monitoring',
        weakAreas: ['Kubernetes Security Policies', 'Terraform State Management', 'Multi-Region High Availability']
      };
    }

    // 6. UI/UX Designer
    if (goal.includes('ui') || goal.includes('ux') || goal.includes('design') || goal.includes('figma')) {
      return {
        targetRoleLabel: 'UI/UX Product Designer',
        courseId: 'course-design-systems',
        skillsList: 'Figma Wireframing & Prototyping, Design Systems & Tokens, User Research, Usability Testing, Micro-interactions',
        weakAreas: ['Design System Tokens Architecture', 'Accessibility (WCAG 2.1 AA)', 'A/B Testing Experiments']
      };
    }

    // 7. Full-Stack Developer
    if (goal.includes('full') || goal.includes('stack')) {
      return {
        targetRoleLabel: 'Full-Stack Software Developer',
        courseId: 'course-fullstack-js',
        skillsList: 'JavaScript ES6+, TypeScript, Next.js, Node.js REST APIs, PostgreSQL, Prisma/Drizzle, Docker Basics',
        weakAreas: ['Database Indexing & Transactions', 'Serverless Cold Starts', 'Authentication Security']
      };
    }

    // 8. Accounting, Audit & Taxation
    if (goal.includes('tax') || goal.includes('audit') || goal.includes('compliance')) {
      return {
        targetRoleLabel: 'Audit, Taxation & Compliance Specialist',
        courseId: 'course-finance-investment',
        skillsList: 'Indian Income Tax, GST Return Filing, Statutory Audit Checklists, Internal Controls, Risk Assessment, Tax Compliance',
        weakAreas: ['Input Tax Credit (ITC) Reconciliations', 'Transfer Pricing Basics', 'Audit Sampling Procedures']
      };
    }

    // 9. Banking & Financial Services
    if (goal.includes('bank') || goal.includes('credit') || goal.includes('lending')) {
      return {
        targetRoleLabel: 'Banking & Financial Services Specialist',
        courseId: 'course-finance-investment',
        skillsList: 'Credit Appraisal, Commercial Lending, KYC/AML Compliance, Treasury Management, Retail Banking Operations, Financial Products',
        weakAreas: ['Credit Risk Scoring', 'NPA Provisioning Norms', 'Forex Hedging Operations']
      };
    }

    // 10. Investment, Equity & Financial Markets
    if (goal.includes('investment') || goal.includes('equity') || goal.includes('markets') || goal.includes('trading')) {
      return {
        targetRoleLabel: 'Investment & Equity Research Analyst',
        courseId: 'course-finance-investment',
        skillsList: 'Discounted Cash Flow (DCF), Equity Research, Company Valuation, Financial Modeling, Portfolio Theory, Technical Analysis',
        weakAreas: ['WACC Calculation Variations', 'Monte Carlo Simulation', 'M&A Accretion/Dilution Analysis']
      };
    }

    // 11. Human Resources (HR)
    if (goal.includes('human_resource') || goal.includes('talent') || goal === 'hr') {
      return {
        targetRoleLabel: 'Human Resources & Talent Lead',
        courseId: 'course-bcom-operations',
        skillsList: 'Talent Acquisition, Statutory HR Compliance, Payroll Management, Performance Appraisal Frameworks, Employee Relations',
        weakAreas: ['Labor Law Compliance', 'Attrition Predictive Modeling', 'Compensation & Benefits Benchmarking']
      };
    }

    // 12. Financial & Accounting Analyst
    if (goal.includes('finance') || goal.includes('financial') || goal.includes('fintech') || goal.includes('accounting') ||
        profile.includes('commerce') || profile.includes('b.com')) {
      return {
        targetRoleLabel: 'Financial & Accounting Analyst',
        courseId: 'course-finance-investment',
        skillsList: 'Financial Modeling, Corporate Valuation, Excel Analysis, SQL, Financial Statement Analysis, Auditing & Compliance',
        weakAreas: ['Derivatives Valuation', 'Regulatory Tech (RegTech)', 'Corporate Restructuring Modeling']
      };
    }

    // 13. Product & Operations Manager
    if (goal.includes('product') || goal.includes('business') || goal.includes('consult') || goal.includes('operations') ||
        profile.includes('management') || profile.includes('bba') || profile.includes('mba')) {
      return {
        targetRoleLabel: 'Product & Operations Manager',
        courseId: 'course-bcom-operations',
        skillsList: 'Product Strategy, PRD Writing, Agile Scrum, User Journey Mapping, Growth Funnels, Data Analytics, Stakeholder Alignment',
        weakAreas: ['Cohort Retention Analysis', 'North Star Metric Decomposition', 'Experimentation Frameworks']
      };
    }

    // 10. Digital Growth & Marketing Lead
    if (goal.includes('market') || goal.includes('growth')) {
      return {
        targetRoleLabel: 'Digital Growth & Marketing Lead',
        courseId: 'course-bcom-digital-marketing',
        skillsList: 'Growth Marketing Funnels, SEO & Search Strategy, Conversion Rate Optimization (CRO), Google Analytics 4, Content Strategy',
        weakAreas: ['Attribution Modeling', 'Paid Acquisition Unit Economics', 'Lifecycle Marketing Automation']
      };
    }

    // 11. IoT & Embedded Systems
    if (goal.includes('iot') || goal.includes('embedded')) {
      return {
        targetRoleLabel: 'IoT & Embedded Systems Engineer',
        courseId: 'course-iot-embedded',
        skillsList: 'Embedded C/C++, ESP32/Arduino, GPIO Sensor Interfacing, MQTT & Wireless Protocols, TinyML, Hardware Security',
        weakAreas: ['Low-Power Duty Cycling', 'Secure Boot & Co-Processors', 'Firmware Over-The-Air (FOTA) Updates']
      };
    }

    // 12. QA & Test Automation
    if (goal.includes('qa') || goal.includes('test')) {
      return {
        targetRoleLabel: 'QA & Test Automation Engineer',
        courseId: 'course-fullstack-js',
        skillsList: 'Jest Unit Testing, Playwright E2E, Cypress, API Integration Testing, CI/CD Test Automation, Performance Testing',
        weakAreas: ['Flaky Test Isolation', 'Contract Testing', 'Load & Stress Testing']
      };
    }

    // 13. Default: Java Backend SDE
    return {
      targetRoleLabel: 'Java Backend SDE',
      courseId: 'course-java-logic',
      skillsList: 'Java Standard Library, OOP Principles, Spring Boot REST, SQL Databases, System Design',
      weakAreas: ['Docker Containers', 'System Design', 'Microservices Architecture']
    };
  };

  // Complete Onboarding: Sync to database & generate dynamic quest roadmap
  const handleOnboardingComplete = async (profileType: string, goalRole: string, reason: string, finalArch?: string) => {
    setSyncing(true);
    setSyncProgress(10);
    setSyncStatus('Registering student trajectory...');

    const targetTrack = resolveTrackFromGoal(goalRole, profileType);
    const targetRoleLabel = targetTrack.targetRoleLabel;
    const skillsList = targetTrack.skillsList;
    const weakAreas = targetTrack.weakAreas;

    setTimeout(() => {
      setSyncProgress(40);
      setSyncStatus('Initializing Career Builder configuration...');
    }, 50);

    setTimeout(() => {
      setSyncProgress(75);
      setSyncStatus('Synchronizing credential vault with cryptographic Sentinel registry...');
    }, 100);

    setTimeout(async () => {
      setSyncProgress(100);
      setSyncStatus('Activating Command Center dashboard...');

      try {
        const isAdvanced = codingExperience === 'Advanced Coder' || codingExperience === 'Advanced Specialist';
        const isIntermediate = codingExperience === 'Intermediate Coder' || codingExperience === 'Intermediate Analyst';
        const baseCodingScore = isAdvanced ? 42 : isIntermediate ? 36 : 28;
        const csBonus = profileType.includes('Computer Science') ? 6 : 2;
        const hoursBonus = weeklyHours.includes('15+') ? 2 : 1;
        const computedQT1 = Math.max(liveQTMetrics.qt1Score, Math.min(50, baseCodingScore + csBonus + hoursBonus));
        
        const styleScore = learningStyle.includes('hands-on') ? 45 : learningStyle.includes('articles') ? 40 : 35;
        const computedQT2 = Math.min(60, Math.round((styleScore + (isAdvanced ? 8 : 4)) * (identityAuditReport.trustScore / 100)));

        const finalUserGoal = (speechTranscript && speechTranscript.trim().length > 5 ? speechTranscript.trim() : targetGoal) || targetRoleLabel;
        const tradeoffBottlenecks = (diagnosticProfile?.tradeoffs || []).map(t => t.type);
        const effectiveWeakAreas = Array.from(new Set([...weakAreas, ...tradeoffBottlenecks]));

        const payload = {
          guidanceMentorId: selectedMentor,
          onboardingStep: 3,
          target_role: targetRoleLabel,
          career_goal: finalUserGoal,
          onboardingAnswers: {
            role: targetRoleLabel,
            career_goal: finalUserGoal,
            target_goal: targetGoal,
            education: profileType,
            skills: finalArch ? `Archetype: ${finalArch}. Skills: ${skillsList}` : skillsList,
            experience: parseExperience(profileType),
            hasCompleted: true,
            diagnosticProfile: diagnosticProfile || null,
            behaviorProfile: diagnosticProfile?.behaviorProfile || null,
            tradeoffs: diagnosticProfile?.tradeoffs || [],
            roadmapStrategy: diagnosticProfile?.roadmapStrategy || null,
            systemMetadata: diagnosticProfile?.systemMetadata || null,
            weak_areas: effectiveWeakAreas,
            current_ability: currentAbility,
            target_ambition: targetAmbition,
            codingExperience,
            learningStyle,
            weeklyHours,
            accessReason: reason,
            qt1_score: computedQT1,
            qt2_score: computedQT2,
            mindset_archetype: diagnosticProfile?.behaviorProfile?.dominantArchetype || finalArch || 'Pattern Hunter',
            voice_transcript: speechTranscript || '',
            voice_confidence: voiceConfidence ?? 0,
            voice_articulation: voiceArticulation ?? 0,
            voice_status: voiceConfidence !== null ? 'calibrated' : 'uncalibrated',
            voice_archetype: voiceArchetype || finalArch || 'Pattern Hunter'
          },
          roadmapGenerated: true
        };

        try {
          await postOnboardingWithRetry(payload);
          await refresh().catch(() => {});
        } catch (err) {
          console.error("Onboarding sync failure", err);
        }

        cOS.setOnboarding({
          role: targetRoleLabel,
          career_goal: finalUserGoal,
          target_goal: targetGoal,
          education: profileType,
          skills: finalArch ? `Archetype: ${finalArch}. Skills: ${skillsList}` : skillsList,
          experience: parseExperience(profileType),
          codingExperience,
          learningStyle,
          weeklyHours,
          accessReason: reason,
          current_ability: currentAbility,
          target_ambition: targetAmbition,
          diagnosticProfile: diagnosticProfile || undefined,
          voice_transcript: speechTranscript || '',
          voice_confidence: voiceConfidence ?? 0,
          voice_articulation: voiceArticulation ?? 0,
          voice_status: voiceConfidence !== null ? 'calibrated' : 'uncalibrated',
          voice_archetype: voiceArchetype || finalArch || 'Pattern Hunter'
        }, true);
        cOS.setOnboardingStep(3);
        cOS.setResumeGenerated(false);
        
        try {
          const skillsArray = skillsList.split(',').map(s => s.trim());
          await cOS.generateFusedRoadmap(skillsArray, effectiveWeakAreas, targetTrack.courseId);
          await qc.invalidateQueries({ queryKey: KEYS.me });
        } catch (err) {
          console.warn('Roadmap seed failed after onboarding', err);
        }

        if (typeof window !== 'undefined' && user?.id) {
          try {
            localStorage.setItem(`pinit_${user.id}_ob_step`, '3');
            localStorage.setItem(`pinit_${user.id}_road_gen`, 'true');
          } catch {}
        }
        setSyncing(false);
        toast.success('Onboarding Complete! 🚀', 'Your diagnostic blueprint is active.');
        markOnboardingStoryPending(user?.id);
        router.push('/dashboard');
        if (typeof window !== 'undefined') {
          setTimeout(() => {
            if (window.location.pathname.includes('/onboarding')) {
              window.location.href = '/dashboard';
            }
          }, 1200);
        }
      } catch (err) {
        console.error("Onboarding sync failure", err);
        if (typeof window !== 'undefined' && user?.id) {
          try {
            localStorage.setItem(`pinit_${user.id}_ob_step`, '3');
            localStorage.setItem(`pinit_${user.id}_road_gen`, 'true');
          } catch {}
        }
        setSyncing(false);
        const fallbackGoal = (speechTranscript && speechTranscript.trim().length > 5 ? speechTranscript.trim() : targetGoal) || targetRoleLabel;
        cOS.setOnboarding({
          role: targetRoleLabel,
          career_goal: fallbackGoal,
          target_goal: targetGoal,
          education: profileType,
          skills: skillsList,
          experience: parseExperience(profileType),
          voice_transcript: speechTranscript || ''
        }, true);
        cOS.setOnboardingStep(3);
        markOnboardingStoryPending(user?.id);
        router.push('/dashboard');
        if (typeof window !== 'undefined') {
          setTimeout(() => {
            if (window.location.pathname.includes('/onboarding')) {
              window.location.href = '/dashboard';
            }
          }, 1200);
        }
      }
    }, 150);
  };

  // Express Path: Submit Form & Trigger Resume Parsing
  const handleExpressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!college || !degree || !uploadedFile) {
      toast.error('Details Required', 'Please fill in all academic details and upload a resume PDF.');
      return;
    }

    setSyncing(true);
    setSyncProgress(5);
    setSyncStatus('Initializing resume upload...');
    setParserLogs(['[1/5] Establishing secure tunnel to parser gateway...', '[1/5] Ready for stream...']);

    const logTimeline = [
      { progress: 25, status: 'Uploading document to candidate vault...', log: '[2/5] Transmitting payload: ' + (uploadedFile.size / 1024).toFixed(1) + ' KB' },
      { progress: 50, status: 'Parsing document structure and text layers...', log: '[3/5] Inspecting layout and text structure.' },
      { progress: 75, status: 'Ingesting document into vault and running ATS screener...', log: '[4/5] Evaluating skills and career trajectory alignment.' },
      { progress: 95, status: 'Configuring learning path...', log: '[5/5] Generating personalized growth roadmap.' },
      { progress: 100, status: 'Finalizing profile setup...', log: '[5/5] Resume parsed and vault entry created successfully.' }
    ];

    logTimeline.forEach((t, i) => {
      setTimeout(() => {
        setSyncProgress(t.progress);
        setSyncStatus(t.status);
        setParserLogs(prev => [...prev, t.log]);
      }, (i + 1) * 60);
    });

    setTimeout(async () => {
      const userId = user?.id || 'guest';
      let trajectoryLabel = 'Software Engineer';
      let skillsList = '';
      let weakAreas: string[] = [];
      try {
        if (trajectory === 'financial_analyst') {
          trajectoryLabel = 'Financial & FinTech Analyst';
          skillsList = 'Financial Modeling, Corporate Valuation, Excel Analysis, SQL, Tally Prime, Financial Accounting, Auditing, Tax Compliance';
          weakAreas = ['Derivatives Trading', 'Regulatory Tech', 'Corporate Restructuring'];
        } else if (trajectory === 'business_analyst') {
          trajectoryLabel = 'Product & Operations Manager';
          skillsList = 'Product Strategy, Market Research, Agile Scrum, Growth Funnels, Data Analytics, Strategic Management, Negotiation';
          weakAreas = ['Product Analytics', 'A/B Testing Experiments', 'Stakeholder Alignment'];
        } else if (trajectory === 'java_sde') {
          trajectoryLabel = 'Java Backend SDE';
          skillsList = 'Java Standard Library, OOP Principles, Spring Boot REST, SQL Databases, System Design';
          weakAreas = ['Docker', 'System Design', 'Microservices'];
        } else if (trajectory === 'react_frontend') {
          trajectoryLabel = 'React Frontend Web SDE';
          skillsList = 'React Hooks, NextJS SSR, Vanilla CSS, Zustand State, TypeScript Types';
          weakAreas = ['Webpack', 'React Performance', 'Testing Library'];
        } else {
          trajectoryLabel = 'DevOps Cloud Engineer';
          skillsList = 'Docker Containers, CI/CD Pipelines, AWS Cloud Services, Prometheus & Grafana, Kubernetes Orchestration';
          weakAreas = ['Kubernetes Security', 'Terraform IaC', 'Linux Scripting'];
        }

        const formData = new FormData();
        formData.append('file', uploadedFile);
        formData.append('category', 'resume');
        formData.append('primaryName', user?.displayName || user?.email?.split('@')[0] || 'Candidate');

        let extractedSkills = skillsList;
        let atsParsedScore = 0;
        try {
          const uploadRes = await api.post<{ ok: boolean; document?: any }>('/api/vault/upload', formData);
          if (uploadRes?.document?.skills?.length) {
            extractedSkills = uploadRes.document.skills.join(', ');
            setParserLogs(prev => [...prev, `[4/5] Extracted ${uploadRes.document.skills.length} skills from resume: ${uploadRes.document.skills.slice(0, 5).join(', ')}...`]);
          }
          if (uploadRes?.document?.atsScore) {
            atsParsedScore = uploadRes.document.atsScore;
          }
        } catch {
          // Fallback if vault upload fails
        }

        const isCsDegree = degree.toLowerCase().includes('cs') || degree.toLowerCase().includes('computer');
        const computedQT1 = atsParsedScore > 0 
          ? Math.min(50, Math.max(25, Math.round(atsParsedScore * 0.5))) 
          : (isCsDegree ? 42 : 35);
        const computedQT2 = atsParsedScore > 0 
          ? Math.min(60, Math.max(30, Math.round(atsParsedScore * 0.6))) 
          : (isCsDegree ? 48 : 38);

        const finalSkillsList = extractedSkills || skillsList;
        const expressArchetype = trajectory === 'java_sde' ? 'Pattern Hunter' :
          trajectory === 'business_analyst' ? 'Social IQ' :
          trajectory === 'financial_analyst' ? 'Stabilizer' :
          trajectory === 'react_frontend' ? 'Explorer' : 'Balanced Specialist';

        const expressGoal = `Become a successful ${trajectoryLabel} in the industry.`;
        const payload = {
          onboardingStep: 3,
          target_role: trajectoryLabel,
          career_goal: expressGoal,
          onboardingAnswers: {
            role: trajectoryLabel,
            career_goal: expressGoal,
            education: `${degree} at ${college}`,
            skills: finalSkillsList,
            experience: 'fresher',
            hasCompleted: true,
            qt1_score: computedQT1,
            qt2_score: computedQT2,
            current_ability: currentAbility,
            target_ambition: targetAmbition,
            mindset_archetype: expressArchetype
          },
          roadmapGenerated: true
        };

        try {
          await postOnboardingWithRetry(payload);
          await refresh().catch(() => {});
        } catch (err) {
          console.error('Express onboarding failure', err);
        }

        cOS.setOnboarding({
          role: trajectoryLabel,
          career_goal: expressGoal,
          education: `${degree} at ${college}`,
          skills: skillsList,
          experience: 'fresher'
        }, true);
        cOS.setOnboardingStep(3);
        cOS.setResumeGenerated(true);
        
        try {
          const expressTrack = resolveTrackFromGoal(trajectory, degree);
          const skillsArray = skillsList.split(',').map(s => s.trim());
          await cOS.generateFusedRoadmap(skillsArray, weakAreas, expressTrack.courseId);
          await qc.invalidateQueries({ queryKey: KEYS.me });
        } catch (err) {
          console.warn('Express roadmap seed failed', err);
        }

        if (typeof window !== 'undefined' && user?.id) {
          try {
            localStorage.setItem(`pinit_${user.id}_ob_step`, '3');
            localStorage.setItem(`pinit_${user.id}_road_gen`, 'true');
          } catch {}
        }
        setSyncing(false);
        toast.success('Express Onboarding Complete! ⚡', 'Unlock your dashboard and provisional job matches.');
        markOnboardingStoryPending(user?.id);
        router.push('/dashboard');
        if (typeof window !== 'undefined') {
          setTimeout(() => {
            if (window.location.pathname.includes('/onboarding')) {
              window.location.href = '/dashboard';
            }
          }, 1200);
        }
      } catch (err) {
        console.error('Express onboarding failure', err);
        if (typeof window !== 'undefined' && user?.id) {
          try {
            localStorage.setItem(`pinit_${user.id}_ob_step`, '3');
            localStorage.setItem(`pinit_${user.id}_road_gen`, 'true');
          } catch {}
        }
        setSyncing(false);
        cOS.setOnboarding({
          role: trajectoryLabel || 'Software Engineer',
          education: `${degree} at ${college}`,
          skills: skillsList || '',
          experience: 'fresher'
        }, true);
        cOS.setOnboardingStep(3);
        markOnboardingStoryPending(user?.id);
        router.push('/dashboard');
        if (typeof window !== 'undefined') {
          setTimeout(() => {
            if (window.location.pathname.includes('/onboarding')) {
              window.location.href = '/dashboard';
            }
          }, 1200);
        }
      }
    }, 300);
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf') {
        setUploadedFile(file);
        toast.info('Resume Selected', `${file.name} ready for analysis.`);
      } else {
        toast.error('Invalid File Type', 'Please upload a PDF document.');
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf') {
        setUploadedFile(file);
        toast.info('Resume Selected', `${file.name} ready for analysis.`);
      } else {
        toast.error('Invalid File Type', 'Please upload a PDF document.');
      }
    }
  };

  // Slider React Dialogue triggers
  const getSliderDialogue = () => {
    const gap = targetAmbition - currentAbility;
    if (gap <= 0) return "You seem extremely confident in your current capabilities! ✦ Let's put them to test inside our Monaco workspace.";
    if (gap > 60) return `A verification gap of ${gap}% requires intensive socratic quests, unit testing sandboxes, and certifications upload to achieve. Let's construct a target blueprint.`;
    return `An active gap of ${gap}% is highly manageable. Let's close it using targeted micro-missions and Daily Quests!`;
  };

  const stageLabel: Record<string, string> = {
    INTENT_SELECTION: 'STAGE 01: INTENT SELECTION',
    SLIDER: 'STAGE 01: GAP CHECK',
    EXPRESS_FORM: 'STAGE 02: EXPRESS PROFILE',
    CHOOSE_GUIDE: 'STAGE 01: CHOOSE GUIDE',
    GOAL_DISCOVERY: 'STAGE 02: GOAL DISCOVERY',
    BEHAVIORAL_DIAGNOSTIC: 'STAGE 03: BEHAVIORAL DIAGNOSTIC',
    DEEP_CHAT: 'STAGE 04: DEEP DIAGNOSTICS',
    IDENTITY_QUESTIONS: 'STAGE 05: IDENTITY MAP',
    WORKPLACE_SIMULATION: 'STAGE 06: SIMULATION',
    SPEECH_ASSESSMENT: 'STAGE 07: SPEECH LAB',
    BLUEPRINT_REVEAL: 'STAGE 04: BLUEPRINT',
  };

  function getOptionsForStep() {
    if (currentStep === 0) {
      return [
        "Commerce & Finance Student (B.Com, M.Com)",
        "Management & Business Student (BBA, MBA)",
        "Computer Science / IT Student (B.Tech, BCA, MCA)",
        "Non-CS Engineering / Science / Arts"
      ];
    }
    if (currentStep === 1) {
      if (studentType.includes("Commerce") || studentType.includes("B.Com")) {
        return [
          "Financial & FinTech Analyst",
          "Business Analyst",
          "Accounting & Risk Manager"
        ];
      }
      if (studentType.includes("Management") || studentType.includes("BBA")) {
        return [
          "Product Manager",
          "Management Consultant",
          "Operations & Growth Lead"
        ];
      }
      return [
        "Software Engineer",
        "UI/UX Designer",
        "DevOps Engineer"
      ];
    }
    if (currentStep === 2) {
      return [
        "To close skill gaps & earn XP",
        "To build portfolio & find internships",
        "To practice AI mock interviews",
        "To verify credentials in the vault"
      ];
    }
    if (currentStep === 3) {
      if (studentType.includes("Commerce") || studentType.includes("Management") || studentType.includes("BBA") || studentType.includes("B.Com")) {
        return [
          "Beginner Analyst",
          "Intermediate Analyst",
          "Advanced Specialist"
        ];
      }
      return [
        "Beginner Coder",
        "Intermediate Coder",
        "Advanced Coder"
      ];
    }
    if (currentStep === 4) {
      return [
        "Reading articles & docs",
        "Watching tutorial videos",
        "Writing code & hands-on case studies"
      ];
    }
    if (currentStep === 5) {
      return [
        "5 hours per week",
        "10 hours per week",
        "15+ hours per week"
      ];
    }
    return [];
  }

  return {
    user,
    router,
    cOS,
    activeScreen,
    setActiveScreen,
    stageLabel,
    selectedMentor,
    setSelectedMentor,
    animState,
    setAnimState,
    zoom,
    setZoom,
    isMuted,
    setIsMuted,
    isBgmMuted,
    setIsBgmMuted,
    useNeural,
    setUseNeural,
    speakReply,
    stopAvatarSpeaking,
    intentGreeting,
    showVaultModal,
    setShowVaultModal,
    vaultUploading,
    activeVaultTab,
    setActiveVaultTab,
    vaultSlots,
    isDraggingOverDropzone,
    setIsDraggingOverDropzone,
    isDraggingOverResume,
    setIsDraggingOverResume,
    isVerifyingAll,
    customAnchorName,
    setCustomAnchorName,
    primaryCandidateName,
    identityAuditReport,
    liveQTMetrics,
    formatVaultDate,
    handleUploadToSlot,
    handleBatchAutoSortUpload,
    handleDeleteSlot,
    handleVerifySingleDocument,
    handleVerifyAllDocuments,
    currentAbility,
    setCurrentAbility,
    targetAmbition,
    setTargetAmbition,
    getSliderDialogue,
    clearSpeechTimers,
    scheduleSpeech,
    currentIdentityQ,
    setCurrentIdentityQ,
    identityScores,
    setIdentityScores,
    currentScenario,
    setCurrentScenario,
    simulationScores,
    setSimulationScores,
    voiceConfidence,
    voiceArticulation,
    voiceArchetype,
    setSpeechTranscript,
    setComputedArchetype,
    college,
    setCollege,
    degree,
    setDegree,
    trajectory,
    setTrajectory,
    uploadedFile,
    dragOver,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileSelect,
    handleExpressSubmit,
    messages,
    setMessages,
    messagesEndRef,
    currentStep,
    studentType,
    targetGoal,
    accessReason,
    getOptionsForStep,
    handleUserAnswer,
    recognizing,
    startVoiceListening,
    stopVoiceListening,
    isSubmittingStep,
    startDeepDiagnostics,
    syncing,
    syncProgress,
    syncStatus,
    parserLogs,
    handleFastComplete,
    handleOnboardingComplete,
    diagnosticGoal,
    setDiagnosticGoal,
    diagnosticAnswers,
    setDiagnosticAnswers,
    diagnosticProfile,
    setDiagnosticProfile,
    handleGoalDiscoveryComplete,
    handleBehavioralDiagnosticComplete,
  };
}
