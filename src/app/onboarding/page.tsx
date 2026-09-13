'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useCareerOS } from '@/lib/context/CareerOSContext';
import { useAuth } from '@/lib/context/AuthContext';
import { api } from '@/lib/api/client';
import { useQueryClient } from '@tanstack/react-query';
import { KEYS } from '@/lib/api/hooks';
import Image from 'next/image';
import {
  Message,
  ScreenType,
  parseExperience,
  IDENTITY_QS,
  getIdentityQuestions,
  WORKPLACE_SCENARIOS,
  WORKPLACE_SCENARIOS_BUSINESS,
  calculateQT2MindsetBreakdown
} from './types';
import OnboardingIntro from './components/OnboardingIntro';
import CognitiveSliders from './components/CognitiveSliders';
import VoiceDiagnostic from './components/VoiceDiagnostic';
import DocumentUploader from './components/DocumentUploader';
import RoadmapPreview from './components/RoadmapPreview';
import dynamic from 'next/dynamic';
import {
  speakWithAvatar,
  stopSpeaking,
  preloadTTS,
  preloadNextSpeech,
  preloadMultipleSpeeches,
  getAvatarVoiceVolume,
  setAvatarVoiceVolume
} from '@/lib/tts';
import { pingRenderServer } from '@/lib/smartVoiceRouter';
import { toast } from '@/lib/store/useAppStore';
import { markOnboardingStoryPending } from '@/lib/storyTour';

import { preloadAvatarGLB } from '@/components/avatar/VRoidInterviewAvatar';
import GearAudioHub from '@/components/nav/GearAudioHub';
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

// Dynamic import for WebGL/ThreeJS avatar to avoid SSR issues
const VRoidInterviewAvatar = dynamic(
  () => import('@/components/avatar/VRoidInterviewAvatar'),
  { ssr: false }
);

export default function OnboardingPage() {
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

  // Screen/Route States: 'CHOOSE_GUIDE' | 'INTENT_SELECTION' | 'SLIDER' | 'EXPRESS_FORM' | 'DEEP_CHAT' | 'IDENTITY_QUESTIONS' | 'WORKPLACE_SIMULATION' | 'SPEECH_ASSESSMENT' | 'BLUEPRINT_REVEAL'
  const [activeScreen, setActiveScreen] = useState<'CHOOSE_GUIDE' | 'INTENT_SELECTION' | 'SLIDER' | 'EXPRESS_FORM' | 'DEEP_CHAT' | 'IDENTITY_QUESTIONS' | 'WORKPLACE_SIMULATION' | 'SPEECH_ASSESSMENT' | 'BLUEPRINT_REVEAL'>('CHOOSE_GUIDE');
  
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
    } else {
      toast.success(
        `✨ Auto-Sorted ${files.length} Document${files.length > 1 ? 's' : ''}!`,
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

  const handleContinueOnboarding = () => {
    setShowVaultModal(false);
    if (vaultSlots.length > 0) {
      toast.success(
        'Documents Synced',
        `${vaultSlots.length} document(s) active in your career profile.`
      );
    }
    if (activeScreen === 'CHOOSE_GUIDE') {
      startDeepDiagnostics();
    }
  };
  
  const activeScreenRef = useRef(activeScreen);
  const isSpeakingRef = useRef(false);
  const isListeningRef = useRef(false);
  const [isAvatarSpeaking, setIsAvatarSpeaking] = useState(false);

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

  // Preload 3D Avatar GLBs and Neural Voice TTS Cache on Mount
  const [isPreloaded, setIsPreloaded] = useState(false);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      pingRenderServer();
      preloadAvatarGLB(['priya', 'anish']);
      
      const allIdentityQs = [
        ...IDENTITY_QS.map(q => `${q.category}. ${q.text}`),
        ...getIdentityQuestions('Commerce').map(q => `${q.category}. ${q.text}`),
        ...getIdentityQuestions('Management').map(q => `${q.category}. ${q.text}`)
      ];

      const allWorkplaceScenarios = [
        ...WORKPLACE_SCENARIOS.map(s => `${s.title}. ${s.text}`),
        ...WORKPLACE_SCENARIOS_BUSINESS.map(s => `${s.title}. ${s.text}`)
      ];

      const allPrompts = [
        "Please introduce yourself and explain your target software career goals.",
        "Please introduce yourself and explain your target financial & business analysis goals.",
        "Please introduce yourself and explain your target product management & business growth goals."
      ];

      const initialDialogues = [
        "Welcome to your personal diagnostic assessment! First, are you a college student, a fresh graduate, or a working professional?",
        "Got it! Next, what is your dream job? Do you want to build websites, work with clouds, or build software?",
        "Nice choice. Why did you join today? Are you looking for a job, wanting to learn new skills, or preparing for an interview?"
      ];

      // Pre-warm Render server silently (no audio pre-fetches for zero-cache onboarding)
      void pingRenderServer(false);
    }
  }, []);
  
  // Common States
  const [animState, setAnimState] = useState<'idle' | 'talking' | 'listening' | 'thinking' | 'wave' | 'nod' | 'shrug'>('wave');
  const [zoom, setZoom] = useState(1.617);
  const [isMuted, setIsMuted] = useState(false);
  const [isBgmMuted, setIsBgmMuted] = useState(false);
  const bgMusicRef = useRef<HTMLAudioElement | null>(null);
  const [useNeural, setUseNeural] = useState(true);
  const [recognizing, setRecognizing] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Stop and pause ambient audio drone so it does not conflict with onboarding soundtrack
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

      // Listen to universal volume events from Gear Hub
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
  const [voiceConfidence, setVoiceConfidence] = useState<number | null>(null);
  const [voiceArticulation, setVoiceArticulation] = useState<number | null>(null);

  // Screen 02: Potential Slider States
  const [currentAbility, setCurrentAbility] = useState(30);
  const [targetAmbition, setTargetAmbition] = useState(85);

  // Screen 03: Express Form States
  const [college, setCollege] = useState('');
  const [degree, setDegree] = useState('');
  const [gradYear, setGradYear] = useState('2026');
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
  const [userInput, setUserInput] = useState('');
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
  const [speechState, setSpeechState] = useState<'ready' | 'calibrating' | 'calibrated' | 'recording' | 'recorded'>('ready');
  const [calibrationProgress, setCalibrationProgress] = useState(0);
  const [speechTranscript, setSpeechTranscript] = useState('');
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [manualInputMode, setManualInputMode] = useState<boolean>(false);
  const [computedArchetype, setComputedArchetype] = useState('Pattern Hunter');
  const [selectedMentor, setSelectedMentor] = useState<'priya' | 'anish'>('priya');

  // Syncing & Parsing States
  const [syncing, setSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [syncStatus, setSyncStatus] = useState('');
  const [parserLogs, setParserLogs] = useState<string[]>([]);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<any>(null);
  const transcriberRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  // Cleanup speech synthesis on unmount
  useEffect(() => {
    return () => {
      clearSpeechTimers();
      stopAvatarSpeaking();
    };
  }, []);

  // Voice greeting triggers on transition to INTENT_SELECTION
  useEffect(() => {
    if (activeScreen === 'INTENT_SELECTION') {
      const timer = scheduleSpeech(() => {
        speakReply(intentGreeting);
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
          speakReply(speechText);
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
          speakReply(speechText);
        }, 250);
        return () => clearTimeout(timer);
      }
    }
  }, [activeScreen, currentScenario, studentType, selectedMentor]);

  // Auto-Read Vocal Prompt on Speech Assessment
  useEffect(() => {
    if (activeScreen === 'SPEECH_ASSESSMENT' && speechState === 'calibrated') {
      const isCommerce = studentType.includes('Commerce') || studentType.includes('B.Com');
      const isManagement = studentType.includes('Management') || studentType.includes('BBA');
      const spokenPromptText = isCommerce
        ? "Please introduce yourself and explain your target financial & business analysis goals."
        : isManagement
        ? "Please introduce yourself and explain your target product management & business growth goals."
        : "Please introduce yourself and explain your target software career goals.";

      const timer = scheduleSpeech(() => {
        speakReply(spokenPromptText);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [activeScreen, speechState, studentType, selectedMentor]);

  // Native Speech TTS
  const speakReply = (text: string) => {
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
  };

  // Helper to convert recorded audio blob to Float32 PCM at 16kHz mono (required by Whisper)
  const getAudioRawData = async (blob: Blob): Promise<Float32Array> => {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    const arrayBuf = await blob.arrayBuffer();
    const decoded = await audioCtx.decodeAudioData(arrayBuf);
    const channelData = decoded.getChannelData(0);
    await audioCtx.close();
    return channelData;
  };

  // Lazy-load in-browser Whisper transcriber pipeline from CDN with 4s timeout fail-safe
  const loadInBrowserTranscriber = async () => {
    if (transcriberRef.current) return transcriberRef.current;
    // In production or HTTPS environments, external CDN script injection is prohibited by strict CSP. Fail fast to native WebSpeech / presets.
    if (typeof window !== 'undefined' && (window.location.protocol === 'https:' || process.env.NODE_ENV === 'production')) {
      return null;
    }
    try {
      const timeoutPromise = new Promise<null>((_, reject) =>
        setTimeout(() => reject(new Error('In-browser model load timeout (4s exceeded)')), 4000)
      );
      const loaderPromise = (async () => {
        const dynamicImport = new Function('url', 'return import(url)');
        const { pipeline, env } = await dynamicImport('https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2');
        env.allowLocalModels = false;
        const pipelineInstance = await pipeline('automatic-speech-recognition', 'Xenova/whisper-tiny.en');
        transcriberRef.current = pipelineInstance;
        return pipelineInstance;
      })();
      return await Promise.race([loaderPromise, timeoutPromise]);
    } catch (err) {
      console.warn("[In-Browser STT] Model load bypassed or timed out:", err);
      return null;
    }
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
        
        // 1. Try server-side STT via /api/stt (Groq Whisper runs server-side where env vars work)
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
            console.log('[Online STT] Transcribed via /api/stt:', transcript);
          } else {
            throw new Error(`STT route returned ${res.status}`);
          }
        } catch (err) {
          console.warn('[Online STT] /api/stt failed, falling back to In-Browser Offline Whisper:', err);
        }

        // 2. Fallback to In-Browser Offline Whisper STT
        if (!transcript) {
          try {
            const audioRaw = await getAudioRawData(audioBlob);
            const transcriber = await loadInBrowserTranscriber();
            if (transcriber) {
              const output = await transcriber(audioRaw, {
                chunk_length_s: 30,
                stride_length_s: 5,
                language: 'english',
                task: 'transcribe',
              });
              transcript = (output.text || '').trim();
              console.log("[In-Browser Offline STT] Transcribed:", transcript);
            }
          } catch (offlineErr) {
            console.error("[Offline STT] In-browser transcription failed:", offlineErr);
          }
        }
          
          if (transcript) {
            if (activeScreenRef.current === 'INTENT_SELECTION' && speechStartTime) {
              const duration = (Date.now() - speechStartTime) / 1000;
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

        // Auto-stop recording if it exceeds 7 seconds (fail-safe timeout)
        if (recordingDuration > 7000) {
          stopVoiceListening();
          return;
        }

        // Calibrate noise floor for the first 350ms
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
      setSpeechStartTime(Date.now());

      requestAnimationFrame(checkSilence);

    } catch (err) {
      console.error("Microphone setup failed:", err);
      toast.error("Microphone Blocked", "Please enable microphone permissions in your browser settings to continue.");
    }
  };

  const stopVoiceListening = () => {
    isListeningRef.current = false;
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
    // Queue payload locally so CareerOSContext reconciles it upon next mount / reload
    if (typeof window !== 'undefined' && payload) {
      try {
        localStorage.setItem('pinit_pending_onboarding_sync', JSON.stringify(payload));
        console.log('[Onboarding] 📦 Queued unsynced onboarding payload locally for background reconciliation.');
      } catch {}
    }
    return false;
  };

  // ⚡ 1-Click Fast Complete (< 30s) — Administrator / QA Testing Only
  const handleFastComplete = async () => {
    if (user?.role !== 'admin') {
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
          qt1_score: liveQTMetrics.qt1Score || 80,
          qt2_score: liveQTMetrics.qt2Score || 85,
          mindset_archetype: "Pattern Hunter"
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

      setSyncProgress(100);
      toast.success('Fast Onboarding Complete! ⚡', 'Software Engineering Blueprint is active.');
      markOnboardingStoryPending(user?.id);
      router.push('/dashboard');
    } catch (err) {
      console.error("Fast onboarding error", err);
      markOnboardingStoryPending(user?.id);
      router.push('/dashboard');
    }
  };

  // Transition to Deep Route Chatflow
  function startDeepDiagnostics() {
    clearSpeechTimers();
    setActiveScreen('DEEP_CHAT');
    setAnimState('nod');
    const nameGreeting = primaryCandidateName && primaryCandidateName !== 'Candidate'
      ? `Thanks ${primaryCandidateName}! `
      : "";
    const vaultPrefix = vaultSlots.length > 0
      ? `${nameGreeting}I've verified your ${vaultSlots.length} credentials and calibrated your career baseline. `
      : "Welcome to your personal diagnostic assessment! ";
    const introText = `${vaultPrefix}To calibrate your career track, what is your primary academic domain or focus?`;
    setMessages([
      {
        id: 'welcome_deep',
        sender: 'ai',
        text: introText,
        timestamp: Date.now()
      }
    ]);
    scheduleSpeech(() => {
      speakReply(introText);
    }, 100);
  }

  // Handle chatbot answers (Deep Path)
  const handleUserAnswer = (text: string) => {
    if (!text.trim()) return;
    stopAvatarSpeaking();

    if (activeScreen === 'INTENT_SELECTION') {
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
      // Default fallback: receive whatever input the user speaks and route directly to Deep Diagnostics
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
    setUserInput('');
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

  // Complete Onboarding: Sync to database & generate dynamic quest roadmap
  const handleOnboardingComplete = async (profileType: string, goalRole: string, reason: string, finalArch?: string) => {
    setSyncing(true);
    setSyncProgress(10);
    setSyncStatus('Registering student trajectory...');

    const userId = user?.id || 'guest';
    const modulesKey = `pinit_${userId}_roadmap_modules`;

    const goalLower = (goalRole || '').toLowerCase();
    const profileLower = (profileType || '').toLowerCase();

    let selectedPath: 'java_sde' | 'react_frontend' | 'devops_cloud' | 'financial_analyst' | 'business_analyst' = 'java_sde';
    let targetRoleLabel = 'Software Engineer';
    let skillsList = 'Java Standard Library, OOP Principles, Spring Boot REST, SQL Databases, System Design';
    let weakAreas: string[] = ['Docker', 'System Design', 'Microservices'];

    const isCommerce = goalLower.includes('finance') || goalLower.includes('financial') || goalLower.includes('fintech') ||
                       goalLower.includes('accounting') || goalLower.includes('risk') ||
                       profileLower.includes('commerce') || profileLower.includes('b.com');

    const isManagement = goalLower.includes('product') || goalLower.includes('business') || goalLower.includes('consult') ||
                         goalLower.includes('operations') || goalLower.includes('growth') ||
                         profileLower.includes('management') || profileLower.includes('bba') || profileLower.includes('mba');

    if (isCommerce) {
      selectedPath = 'financial_analyst';
      targetRoleLabel = 'Financial & FinTech Analyst';
      skillsList = 'Financial Modeling, Corporate Valuation, Excel Analysis, SQL, Tally Prime, Financial Accounting, Auditing, Tax Compliance';
      weakAreas = ['Derivatives Trading', 'Regulatory Tech', 'Corporate Restructuring'];
    } else if (isManagement) {
      selectedPath = 'business_analyst';
      targetRoleLabel = 'Product & Operations Manager';
      skillsList = 'Product Strategy, Market Research, Agile Scrum, Growth Funnels, Data Analytics, Strategic Management, Negotiation';
      weakAreas = ['Product Analytics', 'A/B Testing Experiments', 'Stakeholder Alignment'];
    } else if (goalLower.includes('design') || goalLower.includes('ux') || goalLower.includes('ui') || goalLower.includes('front') || goalLower.includes('react')) {
      selectedPath = 'react_frontend';
      targetRoleLabel = 'UI/UX Designer';
      skillsList = 'React Hooks, NextJS SSR, Vanilla CSS, Zustand State, TypeScript Types';
      weakAreas = ['Webpack', 'React Performance', 'Testing Library'];
    } else if (goalLower.includes('devops') || goalLower.includes('cloud') || goalLower.includes('aws') || goalLower.includes('pipeline') || goalLower.includes('docker')) {
      selectedPath = 'devops_cloud';
      targetRoleLabel = 'DevOps Engineer';
      skillsList = 'Docker Containers, CI/CD Pipelines, AWS Cloud Services, Prometheus & Grafana, Kubernetes Orchestration';
      weakAreas = ['Kubernetes Security', 'Terraform IaC', 'Linux Scripting'];
    }

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
        // Calculate initial unverified QT1 and QT2 baseline scores (capped to entry level prior to live practical quests)
        const isAdvanced = codingExperience === 'Advanced Coder' || codingExperience === 'Advanced Specialist';
        const isIntermediate = codingExperience === 'Intermediate Coder' || codingExperience === 'Intermediate Analyst';
        const baseCodingScore = isAdvanced ? 42 : isIntermediate ? 36 : 28;
        const csBonus = profileType.includes('Computer Science') ? 6 : 2;
        const hoursBonus = weeklyHours.includes('15+') ? 2 : 1;
        const computedQT1 = Math.max(liveQTMetrics.qt1Score, Math.min(50, baseCodingScore + csBonus + hoursBonus));
        
        const styleScore = learningStyle.includes('hands-on') ? 45 : learningStyle.includes('articles') ? 40 : 35;
        const computedQT2 = Math.min(60, Math.round((styleScore + (isAdvanced ? 8 : 4)) * (identityAuditReport.trustScore / 100)));

        const finalUserGoal = (speechTranscript && speechTranscript.trim().length > 5 ? speechTranscript.trim() : targetGoal) || targetRoleLabel;

        const payload = {
          guidanceMentorId: selectedMentor,
          onboardingStep: 3, // Set to STATE_3 (Blueprint Generated)
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
            codingExperience,
            learningStyle,
            weeklyHours,
            accessReason: reason,
            qt1_score: computedQT1,
            qt2_score: computedQT2,
            mindset_archetype: finalArch || 'Pattern Hunter',
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

        // Vault stays as-is — empty vault shows empty, no fabricated credentials
        
        // Sync context state locally — always launch even if live users INSERT is blocked by RLS
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
          voice_transcript: speechTranscript || '',
          voice_confidence: voiceConfidence ?? 0,
          voice_articulation: voiceArticulation ?? 0,
          voice_status: voiceConfidence !== null ? 'calibrated' : 'uncalibrated',
          voice_archetype: voiceArchetype || finalArch || 'Pattern Hunter'
        }, true);
        cOS.setOnboardingStep(3); // Update master state to 3
        cOS.setResumeGenerated(false); // Deep route doesn't generate resume automatically
        
        try {
          const skillsArray = skillsList.split(',').map(s => s.trim());
          await cOS.generateFusedRoadmap(skillsArray, weakAreas);
          await qc.invalidateQueries({ queryKey: KEYS.me });
        } catch (err) {
          console.warn('Roadmap seed failed after onboarding', err);
        }

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
    setParserLogs(['[1/5] Establising secure tunnel to parser gateway...', '[1/5] Ready for stream...']);

    // Simulate PDF parsing logs over time
    const logTimeline = [
      { progress: 20, status: 'Uploading PDF to Sentinel sandbox...', log: '[2/5] Transmitting payload bytes: ' + (uploadedFile.size / 1024).toFixed(1) + ' KB' },
      { progress: 45, status: 'Parsing PDF text layers & structural layout...', log: '[3/5] Extracting OCR layers. Detected font maps, structural columns, and header fields.' },
      { progress: 70, status: 'Analyzing skills and cross-checking gaps...', log: '[4/5] Extracting skill nodes. Matched: Git, SQL, Java, React. Detected gaps: Docker, CI/CD, Kubernetes.' },
      { progress: 90, status: 'Initializing Human Graph blueprint...', log: '[5/5] Mapping credentials OCR to Sentinel registry. Security signatures generated.' },
      { progress: 100, status: 'Finalizing setup...', log: '[5/5] Success: Profile generated with 0% Initial Trust Score.' }
    ];

    logTimeline.forEach((t, i) => {
      setTimeout(() => {
        setSyncProgress(t.progress);
        setSyncStatus(t.status);
        setParserLogs(prev => [...prev, t.log]);
      }, (i + 1) * 50);
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

        // Pack and transmit real PDF resume file payload
        const formData = new FormData();
        formData.append('file', uploadedFile);
        formData.append('resume', uploadedFile);
        formData.append('userId', userId);
        formData.append('trajectory', trajectory);
        await api.post('/api/resume/upload', formData);

        // Initial baseline QT1/QT2 evaluation (unverified entry level capped at 45/50 prior to live practical quests)
        const computedQT1 = (degree.includes('CS') || degree.includes('Computer')) ? 45 : 38;
        const computedQT2 = 50;

        const expressGoal = `Become a successful ${trajectoryLabel} in the industry.`;
        const payload = {
          onboardingStep: 3, // Set to STATE_3 (Blueprint Generated)
          target_role: trajectoryLabel,
          career_goal: expressGoal,
          onboardingAnswers: {
            role: trajectoryLabel,
            career_goal: expressGoal,
            education: `${degree} at ${college}`,
            skills: skillsList,
            experience: 'fresher',
            hasCompleted: true,
            qt1_score: computedQT1,
            qt2_score: computedQT2,
            mindset_archetype: 'Pattern Hunter' // Default for express path
          },
          roadmapGenerated: true
        };

        try {
          await postOnboardingWithRetry(payload);
          await refresh().catch(() => {});
        } catch (err) {
          console.error('Express onboarding failure', err);
        }

        // Vault stays as-is — if user uploaded a file the real pipeline handles it, no fabricated credentials

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
          const skillsArray = skillsList.split(',').map(s => s.trim());
          await cOS.generateFusedRoadmap(skillsArray, weakAreas);
          await qc.invalidateQueries({ queryKey: KEYS.me });
        } catch (err) {
          console.warn('Express roadmap seed failed', err);
        }

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
    CHOOSE_GUIDE: 'STAGE 03: CHOOSE GUIDE',
    DEEP_CHAT: 'STAGE 04: DEEP DIAGNOSTICS',
    IDENTITY_QUESTIONS: 'STAGE 05: IDENTITY MAP',
    WORKPLACE_SIMULATION: 'STAGE 06: SIMULATION',
    SPEECH_ASSESSMENT: 'STAGE 07: SPEECH LAB',
    BLUEPRINT_REVEAL: 'STAGE 08: BLUEPRINT',
  };

  return (
    <div
      className="onboarding-shell"
      data-theme="dark"
      style={{
        position: 'fixed',
        inset: 0,
        background: '#030508',
        color: '#f8fafc',
        fontFamily: 'var(--font-sans)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        userSelect: 'none',
        // Force readable light text even if the site theme is light.
        ['--t1' as any]: 'var(--text)',
        ['--t2' as any]: '#e2e8f0',
        ['--t3' as any]: 'var(--text-muted)',
        ['--t4' as any]: 'var(--text-dim)',
        ['--card' as any]: 'var(--text)',
        ['--bg3' as any]: '#f1f5f9',
        ['--border2' as any]: '#cbd5e1',
      }}
    >
      {/* Mentor Selection Screen */}
      {activeScreen === 'CHOOSE_GUIDE' && (
        <OnboardingIntro
          mode="CHOOSE_GUIDE"
          selectedMentor={selectedMentor}
          setSelectedMentor={(m) => setSelectedMentor(m as 'priya' | 'anish')}
          onStartDeepDiagnostics={startDeepDiagnostics}
          onOpenVault={() => setShowVaultModal(true)}
          onOpenExpress={() => setActiveScreen('EXPRESS_FORM')}
          onFastComplete={handleFastComplete}
          isAdmin={user?.role === 'admin' || user?.role === 'superadmin'}
          syncing={syncing}
        />
      )}

      {/* Candidate Secure Vault 2.0 Modal Overlay */}
      <DocumentUploader
        isOpen={showVaultModal}
        onClose={() => setShowVaultModal(false)}
        vaultSlots={vaultSlots}
        vaultUploading={vaultUploading}
        activeVaultTab={activeVaultTab}
        setActiveVaultTab={setActiveVaultTab}
        isDraggingOverDropzone={isDraggingOverDropzone}
        setIsDraggingOverDropzone={setIsDraggingOverDropzone}
        isDraggingOverResume={isDraggingOverResume}
        setIsDraggingOverResume={setIsDraggingOverResume}
        isVerifyingAll={isVerifyingAll}
        customAnchorName={customAnchorName}
        setCustomAnchorName={setCustomAnchorName}
        primaryCandidateName={primaryCandidateName}
        identityAuditReport={identityAuditReport}
        liveQTMetrics={liveQTMetrics}
        handleUploadToSlot={handleUploadToSlot}
        handleBatchAutoSortUpload={handleBatchAutoSortUpload}
        handleVerifySingleDocument={handleVerifySingleDocument}
        handleVerifyAllDocuments={handleVerifyAllDocuments}
        handleDeleteSlot={handleDeleteSlot}
        formatVaultDate={formatVaultDate}
      />

      {/* Dynamic Background Mesh Orbits */}
      <div style={{ position: 'absolute', top: '-15%', left: '-15%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(var(--brand-rgb),0.12) 0%, transparent 70%)', filter: 'blur(70px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-15%', right: '-15%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(var(--accent-cyan-rgb),0.08) 0%, transparent 70%)', filter: 'blur(70px)', pointerEvents: 'none' }} />

      {/* Top Header */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 32px', borderBottom: '1px solid rgba(255,255,255,0.04)', background: 'rgba(10,15,26,0.3)', backdropFilter: 'blur(10px)', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="lp-brand-lockup" style={{ height: 40, padding: '2px 6px' }}>
            <Image
              src="/brand/pinit-career-logo.png"
              alt="PINIT CAREER"
              width={148}
              height={34}
              className="lp-brand-logo"
              style={{ height: 34, maxWidth: 148, width: 'auto', objectFit: 'contain' }}
              priority
            />
          </span>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {user?.role === 'admin' && (
            <button
              type="button"
              onClick={handleFastComplete}
              disabled={syncing}
              style={{
                background: 'linear-gradient(135deg, var(--green) 0%, var(--green) 100%)',
                border: 'none',
                borderRadius: 100,
                color: 'var(--card)',
                fontSize: 11,
                fontWeight: 800,
                padding: '6px 14px',
                cursor: syncing ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                boxShadow: '0 4px 14px rgba(var(--success-rgb), 0.35)',
                transition: 'all 0.2s ease'
              }}
            >
              ⚡ Fast Finish (Admin Dev)
            </button>
          )}
          {(user?.roadmapGenerated || (user as any)?.onboardingCompleted || (cOS as any)?.onboardingAnswers?.hasCompleted) && (
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 100,
                color: 'var(--foreground)',
                fontSize: 11,
                fontWeight: 700,
                padding: '6px 14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                transition: 'all 0.2s ease'
              }}
            >
              ← Return to Dashboard
            </button>
          )}
          <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 100, padding: '4px 12px' }}>
            {stageLabel[activeScreen] || 'ONBOARDING'}
          </div>
          <GearAudioHub theme={cOS.theme} size="sm" />
        </div>
      </header>

      {/* Main Container */}
      <main style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '43fr 57fr', maxWidth: '98%', width: '98%', margin: '0 auto', padding: '12px 24px 24px 24px', gap: 24, zIndex: 5, overflow: 'hidden' }}>
        
        {/* Left Column: VRoid Mentor Viewport */}
        <section style={{ 
          backgroundImage: "linear-gradient(to bottom, rgba(10, 15, 26, 0.15), rgba(10, 15, 26, 0.65)), url('/brand/avatar-room-bg.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backdropFilter: 'blur(20px)', 
          border: '1px solid rgba(255,255,255,0.1)', 
          borderRadius: 24, 
          display: 'flex', 
          flexDirection: 'column', 
          overflow: 'hidden', 
          position: 'relative', 
          minHeight: 0 
        }}>
          <div style={{ flex: 1, position: 'relative' }}>
            {selectedMentor === 'anish' ? (
              <VRoidInterviewAvatar teacherId="anish" animState={animState} zoom={zoom} />
            ) : (
              <VRoidInterviewAvatar teacherId="priya" animState={animState} zoom={zoom} />
            )}
            
            {/* Audio Wave Listening Overlay */}
            {animState === 'listening' && (
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(var(--brand-rgb),0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(2px)' }}>
                <div style={{ display: 'flex', gap: 4, alignItems: 'center', marginBottom: 12 }}>
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="mic-wave-bar" style={{ width: 4, height: 20, background: 'var(--accent)', borderRadius: 2, animation: `pulse-height 1s ease-in-out infinite alternate ${i * 0.15}s` }} />
                  ))}
                </div>
                <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--brand-bright)', textTransform: 'uppercase', letterSpacing: '1px' }}>Listening... Speak now</div>
              </div>
            )}
          </div>

          {/* Floating Controls Overlay */}
          <div style={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8, background: 'rgba(10,15,26,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '6px 12px', backdropFilter: 'blur(10px)', zIndex: 12 }}>
            <button onClick={() => setZoom(z => Math.min(2.2, z + 0.1))} style={{ background: 'none', border: 'none', color: 'var(--t3)', fontSize: 14, cursor: 'pointer', padding: '4px 8px' }} title="Zoom In">🔍+</button>
            <button onClick={() => setZoom(z => Math.max(1.1, z - 0.1))} style={{ background: 'none', border: 'none', color: 'var(--t3)', fontSize: 14, cursor: 'pointer', padding: '4px 8px' }} title="Zoom Out">🔍-</button>
            <button
              onClick={() => {
                const next = !isMuted;
                setIsMuted(next);
                setAvatarVoiceVolume(next ? 0 : 0.85);
              }}
              style={{ background: 'none', border: 'none', color: isMuted ? 'var(--danger-bright)' : 'var(--t3)', fontSize: 14, cursor: 'pointer', padding: '4px 8px' }}
              title={isMuted ? "Unmute Mentor Voice" : "Mute Mentor Voice"}
            >
              {isMuted ? '🔇' : '🔊'}
            </button>
            <button
              onClick={() => {
                const next = !isBgmMuted;
                setIsBgmMuted(next);
                ambientAudio.setMuted(next);
              }}
              style={{ background: 'none', border: 'none', color: isBgmMuted ? 'var(--danger-bright)' : 'var(--accent)', fontSize: 12, fontWeight: 800, cursor: 'pointer', padding: '4px 8px', display: 'flex', alignItems: 'center', gap: 3 }}
              title={isBgmMuted ? "Unmute Background Music" : "Mute Background Music"}
            >
              {isBgmMuted ? '🔇' : '🎵'} <span>BGM</span>
            </button>
            <button 
              onClick={() => {
                if (!useNeural && !window.confirm("High-definition neural mentor audio requires an active internet connection. Enable neural voice?")) {
                  return;
                }
                setUseNeural(!useNeural);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: useNeural ? 'var(--green)' : 'var(--t3)',
                fontSize: 12,
                fontWeight: 900,
                cursor: 'pointer',
                padding: '4px 8px',
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}
              title={useNeural ? "Mute Neural Voice" : "Enable Neural Voice"}
            >
              {useNeural ? '🎙️ Neural' : '🔇 Silent'}
            </button>
          </div>
        </section>

        {/* Right Column: Screen panels */}
        <section style={{ display: 'flex', flexDirection: 'column', background: 'rgba(10, 15, 26, 0.4)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 24, overflow: 'hidden', minHeight: 0 }}>
          
          {/* Active Screen Rendering */}

          {/* SCREEN 01: INTENT SELECTION */}
          {activeScreen === 'INTENT_SELECTION' && (
            <OnboardingIntro
              mode="INTENT_SELECTION"
              selectedMentor={selectedMentor}
              setSelectedMentor={(m) => setSelectedMentor(m as 'priya' | 'anish')}
              onStartDeepDiagnostics={startDeepDiagnostics}
              onOpenVault={() => setShowVaultModal(true)}
              onOpenExpress={() => setActiveScreen('EXPRESS_FORM')}
              voiceConfidence={voiceConfidence}
              voiceArticulation={voiceArticulation}
              voiceArchetype={voiceArchetype}
              onChangeGuide={() => {
                stopAvatarSpeaking();
                setActiveScreen('CHOOSE_GUIDE');
              }}
              onRepeatVoice={() => speakReply(intentGreeting)}
              onSkipOnboarding={() => handleOnboardingComplete(studentType || 'Computer Science', targetGoal || 'Software Engineer', accessReason || 'To close skill gaps & earn XP')}
            />
          )}

          {/* SCREEN 02: EVOLUTION GAP SLIDER */}
          {activeScreen === 'SLIDER' && (
            <CognitiveSliders
              mode="SLIDER"
              studentType={studentType}
              onGoBack={() => setActiveScreen('INTENT_SELECTION')}
              currentAbility={currentAbility}
              setCurrentAbility={setCurrentAbility}
              targetAmbition={targetAmbition}
              setTargetAmbition={setTargetAmbition}
              sliderDialogue={getSliderDialogue()}
              onProceedFromSlider={() => {
                clearSpeechTimers();
                setActiveScreen('DEEP_CHAT');
                setAnimState('nod');
                const introText = "Welcome to your personal diagnostic assessment! To calibrate your career track, what is your primary academic domain or focus?";
                setMessages([
                  {
                    id: 'welcome_deep',
                    sender: 'ai',
                    text: introText,
                    timestamp: Date.now()
                  }
                ]);
                scheduleSpeech(() => {
                  speakReply(introText);
                }, 100);
              }}
            />
          )}

          {/* SCREEN 03: EXPRESS ROUTE RESUME & DEMOGRAPHICS FORM */}
          {activeScreen === 'EXPRESS_FORM' && (
            <DocumentUploader
              isOpen={true}
              isExpress={true}
              onClose={() => setActiveScreen('INTENT_SELECTION')}
              onGoBackFromExpress={() => setActiveScreen('INTENT_SELECTION')}
              vaultSlots={vaultSlots}
              vaultUploading={vaultUploading}
              activeVaultTab={activeVaultTab}
              setActiveVaultTab={setActiveVaultTab}
              isDraggingOverDropzone={isDraggingOverDropzone}
              setIsDraggingOverDropzone={setIsDraggingOverDropzone}
              isDraggingOverResume={isDraggingOverResume}
              setIsDraggingOverResume={setIsDraggingOverResume}
              isVerifyingAll={isVerifyingAll}
              customAnchorName={customAnchorName}
              setCustomAnchorName={setCustomAnchorName}
              primaryCandidateName={primaryCandidateName}
              identityAuditReport={identityAuditReport}
              liveQTMetrics={liveQTMetrics}
              handleUploadToSlot={handleUploadToSlot}
              handleBatchAutoSortUpload={handleBatchAutoSortUpload}
              handleVerifySingleDocument={handleVerifySingleDocument}
              handleVerifyAllDocuments={handleVerifyAllDocuments}
              handleDeleteSlot={handleDeleteSlot}
              formatVaultDate={formatVaultDate}
              trajectory={trajectory}
              setTrajectory={setTrajectory}
              college={college}
              setCollege={setCollege}
              degree={degree}
              setDegree={setDegree}
              uploadedFile={uploadedFile}
              dragOver={dragOver}
              handleDragOver={handleDragOver}
              handleDragLeave={handleDragLeave}
              handleDrop={handleDrop}
              handleFileSelect={handleFileSelect}
              handleExpressSubmit={handleExpressSubmit}
            />
          )}

          {/* SCREEN 04: SOCRATIC CHAT CONVERSATION */}
          {activeScreen === 'DEEP_CHAT' && (
            <>
              {/* Chat Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)', background: 'rgba(255,255,255,0.01)' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: animState === 'talking' ? 'var(--green)' : 'var(--brand)', animation: animState === 'talking' ? 'ping 1.5s infinite' : 'none' }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{selectedMentor === 'priya' ? 'Ms. Priya' : 'Mr. Anish'}</div>
                  <div style={{ fontSize: 10, color: 'var(--t2)' }}>{animState === 'talking' ? 'Speaking...' : animState === 'listening' ? 'Listening...' : animState === 'thinking' ? 'Analyzing...' : 'Online'}</div>
                </div>
              </div>

              {/* Chat Timeline */}
              <div style={{ flex: 1, padding: 20, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
                {messages.map((m) => {
                  const isAi = m.sender === 'ai';
                  return (
                    <div key={m.id} style={{ display: 'flex', justifyContent: isAi ? 'flex-start' : 'flex-end', animation: 'fadeInUp 0.3s ease forwards' }}>
                      <div style={{
                        maxWidth: '85%',
                        padding: '12px 16px',
                        borderRadius: isAi ? '16px 16px 16px 4px' : '16px 16px 4px 16px',
                        background: isAi ? '#1e293b' : 'linear-gradient(135deg, var(--brand) 0%, var(--reward) 100%)',
                        border: isAi ? '1px solid rgba(148,163,184,0.35)' : 'none',
                        color: 'var(--text)',
                        fontSize: 13.5,
                        fontWeight: 500,
                        lineHeight: 1.6,
                        whiteSpace: 'pre-wrap',
                        boxShadow: isAi ? 'none' : '0 4px 12px rgba(var(--brand-rgb), 0.25)'
                      }}>
                        {m.text}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Console (Voice-to-Option Selections) */}
              <div style={{ padding: 20, borderTop: '1px solid rgba(255,255,255,0.04)', background: 'rgba(255,255,255,0.01)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
                    {getOptionsForStep().map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        disabled={syncing || isSubmittingStep}
                        onClick={() => handleUserAnswer(opt)}
                        style={{
                          padding: '10px 18px',
                          borderRadius: 100,
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          color: 'var(--t1)',
                          fontSize: 12.5,
                          fontWeight: 600,
                          cursor: (syncing || isSubmittingStep) ? 'not-allowed' : 'pointer',
                          transition: 'all 0.15s ease',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6
                        }}
                        onMouseEnter={(e) => {
                          if (!syncing && !isSubmittingStep) {
                            e.currentTarget.style.background = 'linear-gradient(135deg, var(--brand) 0%, var(--accent) 100%)';
                            e.currentTarget.style.borderColor = 'transparent';
                            e.currentTarget.style.color = 'var(--card)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!syncing && !isSubmittingStep) {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                            e.currentTarget.style.color = 'var(--t1)';
                          }
                        }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                    <button
                      type="button"
                      onClick={recognizing ? stopVoiceListening : startVoiceListening}
                      style={{
                        padding: '6px 14px',
                        borderRadius: 100,
                        background: recognizing ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                        border: `1px solid ${recognizing ? '#ef4444' : 'rgba(255, 255, 255, 0.08)'}`,
                        color: recognizing ? '#fca5a5' : 'var(--t3)',
                        fontSize: 11,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4
                      }}
                    >
                      {recognizing ? '🔴 Stop Voice Input' : '🎙️ Speak Answer'}
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* SCREEN 05: IDENTITY QUESTIONS */}
          {activeScreen === 'IDENTITY_QUESTIONS' && (
            <CognitiveSliders
              mode="IDENTITY_QUESTIONS"
              studentType={studentType}
              currentIdentityQ={currentIdentityQ}
              setCurrentIdentityQ={setCurrentIdentityQ}
              identityScores={identityScores}
              setIdentityScores={setIdentityScores}
              onCompleteIdentity={() => setActiveScreen('WORKPLACE_SIMULATION')}
            />
          )}

          {/* SCREEN 06: WORKPLACE SIMULATION */}
          {activeScreen === 'WORKPLACE_SIMULATION' && (
            <CognitiveSliders
              mode="WORKPLACE_SIMULATION"
              studentType={studentType}
              currentScenario={currentScenario}
              setCurrentScenario={setCurrentScenario}
              setSimulationScores={setSimulationScores}
              onCompleteSimulation={() => setActiveScreen('SPEECH_ASSESSMENT')}
            />
          )}

          {/* SCREEN 07: SPEECH & COMMUNICATION LAB */}
          {activeScreen === 'SPEECH_ASSESSMENT' && (
            <VoiceDiagnostic
              studentType={studentType}
              setAnimState={setAnimState}
              onCompleteAndGrade={(transcript) => {
                setSpeechTranscript(transcript);
                const breakdown = calculateQT2MindsetBreakdown(identityScores, simulationScores, voiceArchetype);
                const selectedArch = breakdown.dominantTraits?.[0] || 'Pattern Hunter';
                setComputedArchetype(selectedArch);
                setActiveScreen('BLUEPRINT_REVEAL');
                setAnimState('nod');
                speakReply("Congratulations! I have mapped your traits. Let's reveal your potential mapping and diagnostic blueprint.");
              }}
            />
          )}

          {/* SCREEN 08: 30-DAY RADAR & QUEST BLUEPRINT REVEAL */}
          {activeScreen === 'BLUEPRINT_REVEAL' && (() => {
            const qt2Breakdown = calculateQT2MindsetBreakdown(identityScores, simulationScores, voiceArchetype);
            return (
              <RoadmapPreview
                studentType={studentType}
                targetGoal={targetGoal}
                accessReason={accessReason}
                qt2Breakdown={qt2Breakdown}
                selectedMentor={selectedMentor}
                setSelectedMentor={(m) => setSelectedMentor(m as 'priya' | 'anish')}
                onActivateCommandCenter={(st, tg, ar, bt) => handleOnboardingComplete(st, tg, ar, bt)}
                syncing={syncing}
                syncProgress={syncProgress}
                syncStatus={syncStatus}
                parserLogs={parserLogs}
                isUploadedFile={!!uploadedFile}
              />
            );
          })()}

        </section>
      </main>

      {/* Syncing / Parsing Terminal Progress Overlay */}
      {syncing && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(3,5,8,0.95)',
          backdropFilter: 'blur(16px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          {/* Glowing Spinner Ring */}
          <div style={{ position: 'relative', width: 100, height: 100, marginBottom: 24 }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '4px solid rgba(var(--brand-rgb),0.1)' }} />
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '4px solid transparent', borderTopColor: 'var(--accent)', animation: 'spin 1.2s linear infinite' }} />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 800, color: 'var(--accent)' }}>
              {syncProgress}%
            </div>
          </div>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 900, color: 'var(--t1)', marginBottom: 4, letterSpacing: '-0.5px' }}>
            {uploadedFile ? 'Analyzing Resume & Credentials' : 'Orchestrating Trajectory OS'}
          </h2>
          <p style={{ fontSize: 13, color: 'var(--t3)', fontFamily: 'var(--font-mono)', textAlign: 'center', marginBottom: 24 }}>
            {syncStatus}
          </p>

          {/* Terminal Console Logs */}
          {parserLogs.length > 0 && (
            <div style={{
              width: '100%',
              maxWidth: 500,
              background: '#070913',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 12,
              padding: 16,
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              color: 'var(--success-bright)',
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
              marginBottom: 24,
              minHeight: 120,
              justifyContent: 'flex-start'
            }}>
              <div style={{ color: 'var(--t2)', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 6, marginBottom: 6, display: 'flex', justifyContent: 'space-between' }}>
                <span>PARSER PROCESS TERMINAL</span>
                <span>ONLINE</span>
              </div>
              {parserLogs.map((log, index) => (
                <div key={index} style={{ lineBreak: 'anywhere' }}>
                  {log}
                </div>
              ))}
            </div>
          )}

          {/* Main Progress Bar */}
          <div style={{ width: 300, height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ width: `${syncProgress}%`, height: '100%', background: 'linear-gradient(90deg, var(--accent), var(--teal))', borderRadius: 2, transition: 'width 0.2s ease' }} />
          </div>
        </div>
      )}

      {/* Embedded Animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-height {
          from { height: 6px; }
          to { height: 28px; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .mic-wave-bar { transition: height 0.1s ease; }
      `}} />
    </div>
  );

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
}
