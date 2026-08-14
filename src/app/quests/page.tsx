'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useCareerOS } from '@/lib/context/CareerOSContext';
import { useAuth } from '@/lib/context/AuthContext';
import { COURSES_REGISTRY } from '@/lib/data/coursesData';
import { generateDynamicStudentRoadmap } from '@/lib/data/roadmapFuser';
import { recommendCareerTrajectory, CareerTrajectory, TrajectoryNode } from '@/lib/data/careerTrajectories';
import { toast } from '@/lib/store/useAppStore';
import { CourseNotesModal } from '@/components/CourseNotesModal';
import {
  ExtraRoadmap,
  LearningPathMode,
  createExtraId,
  extraIdFromMode,
  extraRoadmapMode,
  extrasStorageKey,
  nextRoadmapNumber,
  parseExtraRoadmaps,
  readExtraModules,
  removeExtraModules,
  writeExtraModules,
  writeExtraRoadmaps
} from '@/lib/quests/extraRoadmaps';

interface Quest {
  id: string;
  title: string;
  desc: string;
  type: 'coding' | 'lecture' | 'interactive';
  category?: 'learning' | 'exam' | 'assignment';
  requiresAvatar?: boolean;
  starterCode?: string;
  hint?: string;
  testSuite?: string;
  skillCategory?: string;
  syllabus?: string[];
  xp?: number;
  pins?: number;
}

interface Module {
  id: string;
  title: string;
  desc: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedWeeks: number;
  quests: Quest[];
}

const QUEST_S_CURVE_PATH =
  'M 50,35 H 250 C 295,35 295,115 250,115 H 60 C 15,115 15,195 60,195 H 250 C 295,195 295,275 250,275 H 60 C 15,275 15,355 60,355 H 250 C 295,355 295,435 250,435 H 60 C 15,435 15,515 60,515 H 250 C 295,515 295,595 250,595 H 60 C 15,595 15,675 60,675 H 250 C 295,675 295,735 250,735 H 230';

// 🔊 Pure WebAudio Gamification Sound FX Engine (Task 3)
const playPopSound = () => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch (e) {
    // Silent fallback
  }
};

const playLevelUpSound = () => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.07);
      gain.gain.setValueAtTime(0.2, ctx.currentTime + idx * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + idx * 0.07 + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.07);
      osc.stop(ctx.currentTime + idx * 0.07 + 0.15);
    });
  } catch (e) {
    // Silent fallback
  }
};

export default function QuestsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const userId = user?.id || 'guest';
  const userName = user?.displayName || user?.username || 'Learner';
  const cOS = useCareerOS();
  const pinsHistory: any[] = (cOS as any)?.pinsHistory || [];

  const {
    roadmapGenerated,
    setRoadmapGenerated,
    completedQuests,
    pins,
    xp,
    spendPins,
    unlockItem,
    isItemUnlocked,
    onboardingAnswers,
    setOnboarding,
    activeCourseId,
    setActiveCourseId,
    activeCourseIds = [],
    setActiveCourseIds,
    switchActiveCourse,
    archiveActiveCourse,
    generateFusedRoadmap,
    careerScore,
    trustScore
  } = useCareerOS();

  const [modules, setModules] = useState<Module[]>([]);
  const [showCourseLibrary, setShowCourseLibrary] = useState(false);
  const [showFullJourneyModal, setShowFullJourneyModal] = useState(false);
  const [activeGateModalNode, setActiveGateModalNode] = useState<TrajectoryNode | null>(null);
  const [historyFilter, setHistoryFilter] = useState<'all' | 'quests' | 'pins'>('all');

  // Dual Mode Switcher states (Fused Career Trajectory vs Standalone Single Course Direct Learning)
  const [learningPathMode, setLearningPathMode] = useState<LearningPathMode>('fused_roadmap');
  const [selectedStandaloneCourseId, setSelectedStandaloneCourseId] = useState<string>('course-python-backend');
  const [extraRoadmaps, setExtraRoadmaps] = useState<ExtraRoadmap[]>([]);
  const [tabsReady, setTabsReady] = useState(false);
  const extrasOwnerRef = useRef<string | null>(null);
  const fusedCourseRef = useRef<string | null>(null);
  const generatingLockRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !userId) return;
    setTabsReady(false);
    extrasOwnerRef.current = null;
    try {
      const list = parseExtraRoadmaps(localStorage.getItem(extrasStorageKey(userId)));
      setExtraRoadmaps(list);

      const saved = localStorage.getItem(`pinit_${userId}_quests_view`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.mode === 'fused_roadmap' || parsed.mode === 'single_course') {
          setLearningPathMode(parsed.mode);
        } else if (parsed.mode === 'extra' && typeof parsed.extraId === 'string') {
          const extra = list.find(r => r.id === parsed.extraId);
          if (extra) {
            setLearningPathMode(extraRoadmapMode(extra.id));
            if (extra.courseId) setActiveCourseId(extra.courseId);
          }
        }
        if (typeof parsed.courseId === 'string' && parsed.courseId) {
          setSelectedStandaloneCourseId(parsed.courseId);
        }
      }
    } catch {}
    extrasOwnerRef.current = userId;
    setTabsReady(true);
  }, [userId, setActiveCourseId]);

  useEffect(() => {
    if (typeof window === 'undefined' || !userId || userId === 'guest' || !tabsReady || extrasOwnerRef.current !== userId) return;
    localStorage.setItem(`pinit_${userId}_quests_view`, JSON.stringify({
      mode: extraIdFromMode(learningPathMode) ? 'extra' : learningPathMode,
      extraId: extraIdFromMode(learningPathMode),
      courseId: selectedStandaloneCourseId
    }));
  }, [userId, learningPathMode, selectedStandaloneCourseId, tabsReady]);

  useEffect(() => {
    if (!tabsReady || extrasOwnerRef.current !== userId) return;
    writeExtraRoadmaps(userId, extraRoadmaps);
  }, [userId, extraRoadmaps, tabsReady]);

  useEffect(() => {
    if (learningPathMode === 'fused_roadmap' && activeCourseId) {
      fusedCourseRef.current = activeCourseId;
    }
  }, [learningPathMode, activeCourseId]);

  // Simple Notes Modal State
  const [notesModalState, setNotesModalState] = useState<{ isOpen: boolean; courseId: string; courseTitle: string }>({
    isOpen: false,
    courseId: '',
    courseTitle: ''
  });

  // Custom AI Roadmap Generator states (30 Days to 365 Days)
  const [showRoadmapModal, setShowRoadmapModal] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState<number>(30); // 30 to 365
  const [selectedPace, setSelectedPace] = useState<number>(3); // Default 3 Quests/Day Target
  const [selectedTrack, setSelectedTrack] = useState<string>('fullstack');
  const [customGoal, setCustomGoal] = useState<string>('Full-Stack AI Engineer launching an E-Commerce Business');
  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false);
  const [generationStep, setGenerationStep] = useState<number>(1);

  const COURSE_TO_ROLE: Record<string, string> = {
    'course-ai-eng': 'AI & LLM Systems Engineer',
    'course-fullstack-js': 'Full-Stack Software Developer',
    'course-dsa-optim': 'Software Development Engineer (SDE)',
    'course-devops-cicd': 'DevOps & Pipeline Automation Engineer',
    'course-distributed-sys': 'Cloud Architect & Infrastructure Specialist',
    'course-java-logic': 'Software Development Engineer (SDE)',
    'course-digital-accounting': 'Digital Accountant & Taxation Specialist',
    'course-finance-investment': 'Financial Analyst & Investment Specialist',
    'course-business-analytics': 'Business Analytics & Decision Intelligence Specialist',
    'course-marketing-branding': 'Marketing & Brand Manager',
    'course-digital-marketing': 'Digital Marketing & Growth Strategist',
    'course-ecommerce-digital-biz': 'E-Commerce & Digital Business Specialist',
    'course-entrepreneurship-biz-mgmt': 'Entrepreneur & Business Manager',
    'course-sales-crm-success': 'Sales, Customer Success & CRM Specialist',
    'course-operations-supplychain-compliance': 'Operations, Supply Chain & Compliance Specialist',
    'course-ai-digital-transformation': 'AI & Digital Transformation Business Specialist'
  };

  const handleCreateCustomRoadmap = async () => {
    if (generatingLockRef.current || isGeneratingRoadmap) return;
    generatingLockRef.current = true;
    setIsGeneratingRoadmap(true);
    setGenerationStep(1);

    await new Promise(r => setTimeout(r, 500));
    setGenerationStep(2);

    await new Promise(r => setTimeout(r, 500));
    setGenerationStep(3);

    const TRACK_CONFIG: Record<string, { role: string; courseId: string; tags: string[]; gaps: string[] }> = {
      ai_transformation: {
        role: 'AI & Digital Transformation Business Specialist',
        courseId: 'course-ai-digital-transformation',
        tags: ['AI Literacy', 'Prompt Engineering', 'RPA Automation', 'BI Dashboards'],
        gaps: ['Enterprise AI Governance', 'AI Leadership Strategy']
      },
      operations: {
        role: 'Operations, Supply Chain & Compliance Specialist',
        courseId: 'course-operations-supplychain-compliance',
        tags: ['Process Mapping', 'Procurement & Inventory', 'Logistics', 'Quality QA/QC'],
        gaps: ['Statutory Compliance Audits', 'ERP & AI Operations']
      },
      sales_crm: {
        role: 'Sales, Customer Success & CRM Specialist',
        courseId: 'course-sales-crm-success',
        tags: ['Consultative Selling', 'BANT Qualification', 'CRM Management', 'Objection Handling'],
        gaps: ['Sales Velocity Analytics', 'AI Lead Scoring']
      },
      entrepreneurship: {
        role: 'Entrepreneur & Business Manager',
        courseId: 'course-entrepreneurship-biz-mgmt',
        tags: ['Opportunity Identification', 'Business Model Canvas', 'Operations', 'Startup Finance'],
        gaps: ['Leadership Dynamics', 'AI Management Tools']
      },
      ecommerce: {
        role: 'E-Commerce & Digital Business Specialist',
        courseId: 'course-ecommerce-digital-biz',
        tags: ['Catalog Management', 'Digital Payments', 'Logistics Fulfillment', 'Store UX'],
        gaps: ['AOV & Margin Optimization', 'AI Commerce Integration']
      },
      digital_marketing: {
        role: 'Digital Marketing & Growth Strategist',
        courseId: 'course-digital-marketing',
        tags: ['SEO Optimization', 'Content Marketing', 'Paid Ads', 'Email Automation'],
        gaps: ['CRO Analytics', 'Growth Hacking Workflows']
      },
      marketing: {
        role: 'Marketing & Brand Manager',
        courseId: 'course-marketing-branding',
        tags: ['Customer Research', 'STP Framework', 'Brand Identity', 'Pricing & Distribution'],
        gaps: ['IMC Campaigns', 'AI Marketing Strategy']
      },
      analytics: {
        role: 'Business Analytics & Decision Intelligence Specialist',
        courseId: 'course-business-analytics',
        tags: ['Excel Analytics', 'Data Visualization', 'Power BI', 'SQL Fundamentals'],
        gaps: ['KPI Performance', 'AI Decision Intelligence']
      },
      finance: {
        role: 'Financial Analyst & Investment Specialist',
        courseId: 'course-finance-investment',
        tags: ['Financial Planning', 'Time Value of Money', 'Cash Budgeting', 'Break-Even Analysis'],
        gaps: ['Portfolio Management', 'FinTech']
      },
      accounting: {
        role: 'Digital Accountant & Taxation Specialist',
        courseId: 'course-digital-accounting',
        tags: ['Double-Entry Bookkeeping', 'Tally Prime ERP', 'GST Returns', 'Financial Statements'],
        gaps: ['Payroll TDS', 'Income Tax Slabs']
      },
      java: {
        role: 'Software Development Engineer (SDE)',
        courseId: 'course-java-logic',
        tags: ['Java 21', 'OOP Pillars', 'Memory Stack/Heap', 'System Design'],
        gaps: ['Microservices', 'Distributed Caching']
      },
      dsa: {
        role: 'Software Development Engineer (SDE)',
        courseId: 'course-java-logic',
        tags: ['Java 21', 'Data Structures', 'Algorithms', 'Optimization'],
        gaps: ['Dynamic Programming', 'Graph Theory']
      },
      fullstack: {
        role: 'Full-Stack Software Developer',
        courseId: 'course-fullstack-js',
        tags: ['React', 'Node.js', 'Next.js', 'REST APIs'],
        gaps: ['Microservices', 'GraphQL']
      },
      ai: {
        role: 'AI & LLM Systems Engineer',
        courseId: 'course-ai-eng',
        tags: ['AI', 'Python', 'LLM', 'FastAPI'],
        gaps: ['Vector Databases', 'RAG Architecture']
      },
      devops: {
        role: 'DevOps & Pipeline Automation Engineer',
        courseId: 'course-devops-cicd',
        tags: ['DevOps', 'Docker', 'CI/CD', 'AWS'],
        gaps: ['Kubernetes', 'Terraform']
      },
      system_design: {
        role: 'Cloud Architect & Infrastructure Specialist',
        courseId: 'course-distributed-sys',
        tags: ['System Design', 'Distributed Systems', 'Kafka', 'Redis'],
        gaps: ['Load Balancing', 'Sharding']
      }
    };

    const config = TRACK_CONFIG[selectedTrack] || TRACK_CONFIG.ai;

    try {
      const finalGoal = customGoal ? customGoal.trim() : config.role;
      const dynamicModules = generateDynamicStudentRoadmap({
        qt1: onboardingAnswers?.qt1_score ?? 75,
        qt2: onboardingAnswers?.qt2_score ?? 80,
        archetype: onboardingAnswers?.mindset_archetype || 'Pattern Hunter',
        goal: finalGoal,
        courseId: config.courseId,
        durationDays: selectedDuration,
        dailyPace: selectedPace
      });

      const extraId = createExtraId();
      const extra: ExtraRoadmap = {
        id: extraId,
        number: nextRoadmapNumber(extraRoadmaps),
        goal: finalGoal,
        courseId: config.courseId,
        durationDays: selectedDuration,
        dailyPace: selectedPace,
        track: selectedTrack,
        createdAt: Date.now()
      };
      const nextExtras = [...extraRoadmaps, extra];
      setExtraRoadmaps(nextExtras);
      writeExtraRoadmaps(userId, nextExtras);
      writeExtraModules(userId, extraId, dynamicModules);

      setModules(dynamicModules as any);
      setActiveCourseId(config.courseId);
      setLearningPathMode(extraRoadmapMode(extraId));
      setRoadmapGenerated(true);

      toast.success(`Roadmap ${extra.number} ready`, `"${finalGoal}" · ${selectedDuration} days`);
      setShowRoadmapModal(false);
    } catch (e: any) {
      toast.error('Roadmap Generation Failed', e.message);
    } finally {
      generatingLockRef.current = false;
      setIsGeneratingRoadmap(false);
    }
  };

  // Derive target trajectory dynamically using AI Recommender based on active course ID or current role
  const currentRole = (activeCourseId && COURSE_TO_ROLE[activeCourseId]) || onboardingAnswers?.role || 'Software Development Engineer (SDE)';
  const qt1 = onboardingAnswers?.qt1_score ?? 75;
  const qt2 = onboardingAnswers?.qt2_score ?? 80;
  const archetype = onboardingAnswers?.mindset_archetype || 'Pattern Hunter';
  const fusedTrajectory: CareerTrajectory = recommendCareerTrajectory(
    currentRole,
    qt1,
    qt2,
    archetype
  );

  // Construct Standalone Single-Course Trajectory dynamically when learningPathMode === 'single_course'
  const standaloneCourseObj = COURSES_REGISTRY.find(c => c.id === selectedStandaloneCourseId) || COURSES_REGISTRY[0];
  const standaloneTrajectory: CareerTrajectory = {
    roleId: standaloneCourseObj.id,
    roleTitle: `Direct Course Focus: ${standaloneCourseObj.title}`,
    icon: standaloneCourseObj.icon,
    description: standaloneCourseObj.desc,
    averageSalaryRange: 'Specialized Skill Mastery',
    targetTotalDays: 30,
    recommendationReason: `Direct Single-Course Mode Active: Pure standalone focus on ${standaloneCourseObj.title} without multi-course fusion.`,
    nodes: [
      {
        nodeId: `${standaloneCourseObj.id}-node-1`,
        courseId: standaloneCourseObj.id,
        title: `${standaloneCourseObj.title} — Stage 1: Zero Basics & Syntax`,
        shortDesc: `Fundamental syntax, core concepts, and zero-to-one entry for ${standaloneCourseObj.title}.`,
        icon: standaloneCourseObj.icon,
        skillsLearned: [standaloneCourseObj.title, 'Syntax Basics', 'Control Flow', 'Core Mechanics'],
        careerImpact: '+20% Core Foundation',
        estimatedDays: 7
      },
      {
        nodeId: `${standaloneCourseObj.id}-node-2`,
        courseId: standaloneCourseObj.id,
        title: `${standaloneCourseObj.title} — Stage 2: Intermediate Architecture`,
        shortDesc: `Design patterns, module structure, and practical implementations.`,
        icon: '⚡',
        skillsLearned: ['Architecture', 'Design Patterns', 'Best Practices', 'Error Handling'],
        careerImpact: '+25% Applied Skill',
        estimatedDays: 7
      },
      {
        nodeId: `${standaloneCourseObj.id}-node-3`,
        courseId: standaloneCourseObj.id,
        title: `${standaloneCourseObj.title} — Stage 3: Data Structures & Logic`,
        shortDesc: `Algorithmic optimization, memory efficiency, and problem solving.`,
        icon: '🔢',
        skillsLearned: ['Data Structures', 'Algorithmic Efficiency', 'Memory Tuning', 'Edge Cases'],
        careerImpact: '+25% Logic Power',
        estimatedDays: 8
      },
      {
        nodeId: `${standaloneCourseObj.id}-node-4`,
        courseId: standaloneCourseObj.id,
        title: `${standaloneCourseObj.title} — Stage 4: Production Mastery & Capstone`,
        shortDesc: `High-scale production deployment, system integration, and capstone review.`,
        icon: '🚀',
        skillsLearned: ['Production Deployment', 'System Integration', 'Performance Audit', 'Capstone Verification'],
        careerImpact: '+30% Pro Mastery',
        estimatedDays: 8
      }
    ]
  };

  const activeExtraId = extraIdFromMode(learningPathMode);
  const activeExtra = activeExtraId
    ? extraRoadmaps.find(rm => rm.id === activeExtraId) || null
    : null;
  const extraRole = activeExtra
    ? (COURSE_TO_ROLE[activeExtra.courseId] || activeExtra.goal)
    : currentRole;
  const extraTrajectory: CareerTrajectory = activeExtra
    ? {
        ...recommendCareerTrajectory(extraRole, qt1, qt2, archetype),
        roleTitle: `Roadmap ${activeExtra.number} · ${activeExtra.goal}`,
        targetTotalDays: activeExtra.durationDays,
        recommendationReason: `Custom tab: ${activeExtra.goal} (${activeExtra.durationDays} days, ${activeExtra.dailyPace} quests/day).`
      }
    : fusedTrajectory;

  const trajectory: CareerTrajectory = learningPathMode === 'single_course'
    ? standaloneTrajectory
    : activeExtra
      ? extraTrajectory
      : fusedTrajectory;

  const closeExtraRoadmap = (id: string) => {
    const closing = extraRoadmaps.find(rm => rm.id === id);
    const next = extraRoadmaps.filter(rm => rm.id !== id);
    setExtraRoadmaps(next);
    writeExtraRoadmaps(userId, next);
    removeExtraModules(userId, id);
    if (extraIdFromMode(learningPathMode) === id) {
      setLearningPathMode('fused_roadmap');
      if (fusedCourseRef.current) setActiveCourseId(fusedCourseRef.current);
    }
    playPopSound();
    toast.success(closing ? `Roadmap ${closing.number} closed` : 'Roadmap closed', 'You can generate another anytime.');
  };

  // Load modules from localStorage or active state based on activeCourseId
  const loadModules = useCallback(() => {
    if (typeof window === 'undefined' || userId === 'guest') return;

    if (activeExtraId) {
      const extraSaved = readExtraModules(userId, activeExtraId);
      if (extraSaved) {
        setModules(extraSaved as Module[]);
        if (!roadmapGenerated) setRoadmapGenerated(true);
        return;
      }
      const extraMeta = extraRoadmaps.find(rm => rm.id === activeExtraId);
      if (extraMeta) {
        const fallback = generateDynamicStudentRoadmap({
          courseId: extraMeta.courseId,
          goal: extraMeta.goal,
          qt1,
          qt2,
          archetype,
          durationDays: extraMeta.durationDays,
          dailyPace: extraMeta.dailyPace
        });
        setModules(fallback as unknown as Module[]);
        if (!roadmapGenerated) setRoadmapGenerated(true);
        return;
      }
    }

    if (activeCourseId) {
      const modulesKey = `pinit_${userId}_roadmap_modules_${activeCourseId}`;
      let saved = localStorage.getItem(modulesKey);

      if (!saved && activeCourseId) {
        const legacyKey = `pinit_${userId}_roadmap_modules`;
        const legacySaved = localStorage.getItem(legacyKey);
        if (legacySaved) {
          try {
            const parsed = JSON.parse(legacySaved);
            if (Array.isArray(parsed) && parsed.length > 0) {
              localStorage.setItem(modulesKey, legacySaved);
              saved = legacySaved;
            }
          } catch {}
        }
      }

      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setModules(parsed);
            if (!roadmapGenerated) setRoadmapGenerated(true);
            return;
          }
        } catch (e) {
          console.error('Error loading roadmap modules:', e);
        }
      }

      // Auto-fallback: Generate dynamic modules for activeCourseId so roadmap never vanishes
      const fallback = generateDynamicStudentRoadmap({
        courseId: activeCourseId,
        goal: currentRole,
        qt1,
        qt2,
        archetype,
        durationDays: 30,
        dailyPace: 3
      });
      setModules(fallback as unknown as Module[]);
      if (!roadmapGenerated) setRoadmapGenerated(true);
    } else {
      const fallback = generateDynamicStudentRoadmap({
        courseId: activeCourseId || 'course-python-backend',
        goal: currentRole,
        qt1,
        qt2,
        archetype,
        durationDays: 30,
        dailyPace: 3
      });
      setModules(fallback as unknown as Module[]);
    }
  }, [userId, activeCourseId, learningPathMode, activeExtraId, extraRoadmaps, roadmapGenerated, setRoadmapGenerated, currentRole, qt1, qt2, archetype]);

  useEffect(() => {
    loadModules();
  }, [loadModules]);

  // Always smooth scroll down to the Quest Roadmap Chart section on mount (skipping hero and heatmap)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const timer = setTimeout(() => {
      const el = document.getElementById('quest-roadmap-chart-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 250);
    return () => clearTimeout(timer);
  }, []);

  // Check completions for active course
  const ctxTimestamps: string[] = onboardingAnswers?.completedQuestsTimestamps || [];
  let timestamps = ctxTimestamps;
  if (ctxTimestamps.length === 0 && typeof window !== 'undefined' && userId !== 'guest') {
    try {
      const raw = localStorage.getItem(`pinit_${userId}_quest_timestamps`);
      if (raw) timestamps = JSON.parse(raw);
    } catch {}
  }
  const today = new Date().toDateString();
  const todayCompletions = timestamps.filter(raw => {
    if (typeof raw !== 'string') return false;
    const parts = raw.split('|');
    const ts = parts[0];
    const cid = parts[1] || activeCourseId || 'default-course';
    return new Date(ts).toDateString() === today && cid === activeCourseId;
  });
  const dailyCount = todayCompletions.length;
  const isDailyLimitReached = dailyCount >= 3;

  // Active course and next quest calculation
  const activeCourse = COURSES_REGISTRY.find(c => c.id === activeCourseId) || COURSES_REGISTRY[0];
  const allQuestsInModule = modules.flatMap(m => (m.quests || []));
  const nextUncompletedQuest = allQuestsInModule.find(q => !completedQuests.includes(q.id)) || allQuestsInModule[0];
  const activeCourseCompletedCount = allQuestsInModule.filter(q => completedQuests.includes(q.id)).length;
  const activeCourseProgressPct = allQuestsInModule.length > 0 
    ? Math.round((activeCourseCompletedCount / allQuestsInModule.length) * 100)
    : 0;

  // Compute Overall Trajectory completion %
  const totalTrajectoryQuests = trajectory.nodes.reduce((acc, node) => {
    const c = COURSES_REGISTRY.find(cr => cr.id === node.courseId);
    return acc + (c?.quests?.length || 30);
  }, 0);
  const totalTrajectoryCompleted = trajectory.nodes.reduce((acc, node) => {
    const c = COURSES_REGISTRY.find(cr => cr.id === node.courseId);
    const count = (c?.quests || []).filter(q => completedQuests.includes(q.id)).length;
    return acc + count;
  }, 0);
  const overallTrajectoryPct = Math.min(100, Math.round((totalTrajectoryCompleted / Math.max(1, totalTrajectoryQuests)) * 100));

  // Days remaining calculation: accurately bound to customized roadmap duration (30/60/90/180/365 days)
  const totalRoadmapDays = onboardingAnswers?.roadmapDurationDays || trajectory.targetTotalDays || 30;
  const daysRemaining = Math.max(1, Math.ceil(totalRoadmapDays * (1 - (activeCourseProgressPct / 100))));

  // Single-click launch next quest handler
  const handleLaunchQuest = async (quest: Quest, courseIdTarget?: string) => {
    if (courseIdTarget && courseIdTarget !== activeCourseId) {
      setActiveCourseId(courseIdTarget);
    }

    const isCompleted = completedQuests.includes(quest.id);
    const initiated = onboardingAnswers?.initiatedQuests || [];
    const isInitiated = initiated.includes(quest.id);

    if (!isCompleted && !isInitiated) {
      if (isDailyLimitReached) {
        alert('Daily Limit Reached for this course! ⏳ Capped to 3 completed quests per day.');
        return;
      }

      const success = unlockItem(`quest:${quest.id}`, 'quest', `Initiated Quest: ${quest.title}`);
      if (!success) return;

      const nextInitiated = [...initiated, quest.id];
      const nextAnswers = {
        ...onboardingAnswers,
        initiatedQuests: nextInitiated
      };
      setOnboarding(nextAnswers, false);
    }

    if (quest.requiresAvatar || quest.type === 'lecture' || quest.type === 'interactive') {
      router.push(`/quests/teacher-select?questId=${quest.id}`);
    } else {
      router.push(`/quests/${quest.id}`);
    }
  };

  const handleSelectCourseFromLibrary = async (courseId: string) => {
    setActiveCourseId(courseId);
    const mappedRole = COURSE_TO_ROLE[courseId];
    if (mappedRole) {
      const updatedAnswers = {
        ...onboardingAnswers,
        role: mappedRole,
        activeCourseId: courseId
      };
      setOnboarding(updatedAnswers, true);
    }
    setShowCourseLibrary(false);
  };

  // Generate 30-day GitHub-style Activity Grid boxes
  const activityDays = Array.from({ length: 30 }, (_, i) => {
    const dayNum = i + 1;
    // Mock activity intensity based on completed quests count
    const level = completedQuests.length > i ? (i % 3 === 0 ? 3 : i % 2 === 0 ? 2 : 1) : 0;
    return { dayNum, level };
  });

  return (
    <div className="quests-page" style={{ paddingBottom: 60 }}>

      {/* ── TOP HERO HEADER: Personalized Career Journey Summary (Ultra-Compact) ───────────── */}
      <div className="glass-card" style={{
        padding: '12px 18px',
        borderRadius: 16,
        marginBottom: 16,
        background: 'linear-gradient(135deg, rgba(99,102,241,0.06), rgba(168,85,247,0.03))',
        border: '1px solid rgba(99,102,241,0.18)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.08)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
          
          {/* Left: Welcome & Target Role */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: 17, fontWeight: 900, color: 'var(--t1)', fontFamily: 'var(--font-display)', margin: 0 }}>
              👋 Welcome, {userName}!
            </h1>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', padding: '2px 8px', borderRadius: 12, fontSize: 10.5, fontWeight: 800, color: 'var(--accent)' }}>
              <span>{trajectory.icon}</span>
              <span>Target Role: {trajectory.roleTitle}</span>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button
              onClick={() => setShowRoadmapModal(true)}
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                border: 'none',
                borderRadius: 8,
                padding: '5px 12px',
                color: '#fff',
                fontSize: 11,
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(16,185,129,0.2)'
              }}
              className="btn-glow"
            >
              ✨ Generate Custom AI Roadmap
            </button>

            <button
              onClick={() => setShowCourseLibrary(!showCourseLibrary)}
              style={{
                background: showCourseLibrary ? 'var(--accent)' : 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                padding: '5px 12px',
                color: showCourseLibrary ? '#fff' : 'var(--t2)',
                fontSize: 11,
                fontWeight: 700,
                cursor: 'pointer'
              }}
              className="card-hover"
            >
              {showCourseLibrary ? '🗺️ Journey' : '📚 Course Library'}
            </button>

            <button
              onClick={() => {
                const cId = activeCourseId || 'course-python-backend';
                const cObj = COURSES_REGISTRY.find(c => c.id === cId);
                setNotesModalState({
                  isOpen: true,
                  courseId: cId,
                  courseTitle: cObj?.title || 'Course Study Notes'
                });
              }}
              style={{
                background: 'rgba(56,189,248,0.12)',
                border: '1px solid rgba(56,189,248,0.3)',
                borderRadius: 8,
                padding: '5px 12px',
                color: '#38bdf8',
                fontSize: 11,
                fontWeight: 800,
                cursor: 'pointer'
              }}
              className="card-hover"
            >
              📖 View Simple Notes
            </button>
          </div>
        </div>

        {/* Bottom Compact Stats & Mission Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.06)', flexWrap: 'wrap', gap: 10 }}>
          
          {/* Metrics */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700 }}>
              <span style={{ color: 'var(--t4)', textTransform: 'uppercase', fontSize: 9.5 }}>Progress:</span>
              <span style={{ color: 'var(--t1)', fontFamily: 'var(--font-mono)' }}>{overallTrajectoryPct}%</span>
            </div>

            <div style={{ width: 1, height: 12, background: 'var(--border)' }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700 }}>
              <span style={{ color: 'var(--t4)', textTransform: 'uppercase', fontSize: 9.5 }}>Est Time:</span>
              <span style={{ color: 'var(--teal)', fontFamily: 'var(--font-mono)' }}>⏱ {daysRemaining} Days Left</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700 }}>
              <span style={{ color: 'var(--t4)', textTransform: 'uppercase', fontSize: 9.5 }}>Salary:</span>
              <span style={{ color: 'var(--green)', fontFamily: 'var(--font-mono)' }}>{trajectory.averageSalaryRange}</span>
            </div>

            <div style={{ width: 1, height: 12, background: 'var(--border)' }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700 }}>
              <span style={{ color: 'var(--t4)', textTransform: 'uppercase', fontSize: 9.5 }}>Today Quota:</span>
              <span style={{ color: isDailyLimitReached ? '#34d399' : '#38bdf8', fontFamily: 'var(--font-mono)', fontWeight: 900 }}>
                🎯 {dailyCount} / 3 Quests
              </span>
            </div>
          </div>

          {/* Today's Mission Mini Row */}
          {nextUncompletedQuest && !showCourseLibrary && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', padding: '3px 10px', borderRadius: 8 }}>
              <span style={{ fontSize: 10.5, fontWeight: 800, color: 'var(--accent)' }}>🔥 Today's Mission:</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--t1)', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {nextUncompletedQuest.title}
              </span>
              <button
                onClick={() => handleLaunchQuest(nextUncompletedQuest)}
                disabled={isDailyLimitReached}
                style={{
                  background: isDailyLimitReached ? 'var(--bg3)' : 'linear-gradient(135deg, var(--accent), var(--purple))',
                  border: 'none',
                  borderRadius: 6,
                  color: isDailyLimitReached ? 'var(--t4)' : '#fff',
                  padding: '2px 8px',
                  fontSize: 10.5,
                  fontWeight: 800,
                  cursor: isDailyLimitReached ? 'not-allowed' : 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {isDailyLimitReached ? 'Done' : 'Continue ➔'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── MULTI-ROADMAP SWITCHER BAR (Max 3 Concurrent Tracks) ── */}
      {(() => {
        const myActiveCourseIds = Array.from(new Set([activeCourseId, ...activeCourseIds].filter(Boolean))) as string[];
        const count = myActiveCourseIds.length;

        return (
          <div style={{
            marginBottom: 16,
            padding: '10px 14px',
            borderRadius: 14,
            background: 'var(--bg2)',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 10
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 11, fontWeight: 900, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                📍 My Active Roadmaps ({count}/3):
              </span>

              {myActiveCourseIds.map(id => {
                const cObj = COURSES_REGISTRY.find(c => c.id === id);
                if (!cObj) return null;
                const isCurrent = id === activeCourseId;
                const cCompleted = (cObj.quests || []).filter(q => completedQuests.includes(q.id)).length;
                const cProgressPct = Math.round((cCompleted / (cObj.quests?.length || 1)) * 100);
                const cActiveDay = Math.min(30, Math.ceil((cCompleted + 1) / 5));

                return (
                  <div
                    key={id}
                    onClick={() => {
                      if (!isCurrent) {
                        if (switchActiveCourse) switchActiveCourse(id);
                        else setActiveCourseId(id);
                      }
                    }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '6px 12px',
                      borderRadius: 10,
                      border: `1.5px solid ${isCurrent ? '#10b981' : 'var(--border)'}`,
                      background: isCurrent ? 'rgba(16,185,129,0.12)' : 'var(--bg3)',
                      color: isCurrent ? '#10b981' : 'var(--t1)',
                      fontSize: 11.5,
                      fontWeight: 800,
                      cursor: isCurrent ? 'default' : 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: isCurrent ? '0 2px 8px rgba(16,185,129,0.2)' : 'none'
                    }}
                  >
                    <span>{cObj.icon}</span>
                    <span>{cObj.title.split('(')[0].trim()}</span>
                    <span style={{ fontSize: 10, padding: '1px 5px', borderRadius: 6, background: isCurrent ? '#10b981' : 'var(--bg4)', color: isCurrent ? '#fff' : 'var(--t3)' }}>
                      Day {cActiveDay} • {cProgressPct}%
                    </span>
                    {count > 1 && (
                      <span
                        title="Archive Roadmap (Progress is 100% saved)"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (archiveActiveCourse) archiveActiveCourse(id);
                          if (id === activeCourseId) {
                            const remaining = myActiveCourseIds.filter(cid => cid !== id);
                            if (remaining.length > 0) {
                              setActiveCourseId(remaining[0]);
                            }
                          }
                        }}
                        style={{ marginLeft: 4, color: 'var(--t4)', cursor: 'pointer', fontSize: 11 }}
                      >
                        ✕
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {count < 3 ? (
              <button
                onClick={() => setShowRoadmapModal(true)}
                style={{
                  padding: '5px 10px',
                  borderRadius: 8,
                  border: '1px dashed #10b981',
                  background: 'rgba(16,185,129,0.08)',
                  color: '#10b981',
                  fontSize: 11,
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                + Add Active Track ({count}/3)
              </button>
            ) : (
              <span style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--t4)' }}>
                📌 Max 3 Active Tracks Enrolled
              </span>
            )}
          </div>
        );
      })()}

      {/* ── ENHANCEMENT 3: GitHub-Style Activity Grid & Skill Heatmap Widget ── */}
      {!showCourseLibrary && (
        <div className="glass-card" style={{
          padding: '20px 24px',
          borderRadius: 20,
          marginBottom: 32,
          border: '1px solid var(--border)',
          background: 'var(--bg2)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--t1)', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>📊</span> 30-Day Activity Streak Grid & Skill Heatmap
              </h3>
              <span style={{ fontSize: 11.5, color: 'var(--t3)' }}>Daily Quest Completions & Verified Skill Proficiency</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10.5, color: 'var(--t3)' }}>
              <span>Less</span>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--bg3)' }} />
              <div style={{ width: 10, height: 10, borderRadius: 2, background: 'rgba(5,150,105,0.3)' }} />
              <div style={{ width: 10, height: 10, borderRadius: 2, background: 'rgba(5,150,105,0.6)' }} />
              <div style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--green)' }} />
              <span>More</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 24, alignItems: 'center' }}>
            {/* Activity Boxes Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(15, 1fr)', gap: 6 }}>
              {activityDays.map(d => {
                const bg = d.level === 3 ? 'var(--green)' : d.level === 2 ? 'rgba(5,150,105,0.6)' : d.level === 1 ? 'rgba(5,150,105,0.3)' : 'var(--bg3)';
                return (
                  <div
                    key={d.dayNum}
                    title={`Day ${d.dayNum}: ${d.level > 0 ? `${d.level * 3} quests completed` : 'No quests yet'}`}
                    style={{
                      height: 18,
                      borderRadius: 4,
                      background: bg,
                      border: '1px solid rgba(255,255,255,0.05)',
                      transition: 'all 0.2s'
                    }}
                  />
                );
              })}
            </div>

            {/* Skill Mastery Heatmap Bars (Dynamic from Completed Quests) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {(() => {
                const activeCourseObj = COURSES_REGISTRY.find(c => c.id === activeCourseId) || COURSES_REGISTRY[0];
                const activeQuests = activeCourseObj.quests || [];
                const completedInActive = activeQuests.filter(q => completedQuests.includes(q.id)).length;
                const overallPct = Math.round((completedInActive / Math.max(1, activeQuests.length)) * 100);

                const dynamicSkills = [
                  {
                    name: `🚀 ${activeCourseObj.title.split('(')[0].trim()} Core Engine`,
                    pct: Math.min(100, overallPct + (completedQuests.length > 0 ? 10 : 0)),
                    color: 'var(--teal)'
                  },
                  {
                    name: `🧮 Data Structures & Algorithmic Problem Solving`,
                    pct: Math.min(100, Math.round(completedQuests.length * 6.5)),
                    color: 'var(--accent)'
                  },
                  {
                    name: `💾 Architecture, APIs & System Optimization`,
                    pct: Math.min(100, Math.round(completedQuests.length * 5)),
                    color: 'var(--purple)'
                  }
                ];

                return dynamicSkills.map(s => (
                  <div key={s.name}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 700, color: 'var(--t2)', marginBottom: 2 }}>
                      <span>{s.name}</span>
                      <span>{s.pct}%</span>
                    </div>
                    <div style={{ height: 5, background: 'var(--bg3)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ width: `${s.pct}%`, height: '100%', background: s.color, transition: 'width 0.4s' }} />
                    </div>
                  </div>
                ));
              })()}
            </div>
          </div>
        </div>
      )}


      {/* ── MODE 1: Standalone Course Library View (Secondary Toggle) ──────── */}
      {showCourseLibrary ? (
        <div className="animate-fade-in">
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 20, fontWeight: 900, color: 'var(--t1)', fontFamily: 'var(--font-display)' }}>
              📚 All 20 Industry Learning Tracks
            </h2>
            <p style={{ fontSize: 13, color: 'var(--t3)', marginTop: 4 }}>
              Browse standalone 30-day curriculum tracks. Learning any course automatically updates your career skill heatmap!
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 20
          }}>
            {COURSES_REGISTRY.map((course) => {
              const isActive = activeCourseId === course.id;
              return (
                <div
                  key={course.id}
                  onClick={() => handleSelectCourseFromLibrary(course.id)}
                  className="glass-card card-hover"
                  style={{
                    padding: '24px',
                    borderRadius: 20,
                    cursor: 'pointer',
                    border: isActive ? '1px solid var(--accent)' : '1px solid var(--border)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: 220
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                      <span style={{ fontSize: 32 }}>{course.icon}</span>
                      <span style={{
                        fontSize: 9.5,
                        background: course.difficulty === 'Beginner' ? 'rgba(5,150,105,0.1)' : 'rgba(99,102,241,0.1)',
                        color: course.difficulty === 'Beginner' ? 'var(--green)' : 'var(--accent)',
                        padding: '3px 8px',
                        borderRadius: 6,
                        fontWeight: 800
                      }}>
                        {course.difficulty}
                      </span>
                    </div>

                    <h3 style={{ fontSize: 15.5, fontWeight: 800, color: 'var(--t1)', marginBottom: 6 }}>{course.title}</h3>
                    <p style={{ fontSize: 12, color: 'var(--t3)', lineHeight: 1.4 }}>{course.desc}</p>
                  </div>

                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12, marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 11, color: 'var(--t4)' }}>⏱ 30 Days (3 Quests/day)</span>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setNotesModalState({
                            isOpen: true,
                            courseId: course.id,
                            courseTitle: course.title
                          });
                        }}
                        style={{
                          background: 'rgba(56,189,248,0.12)',
                          border: '1px solid rgba(56,189,248,0.3)',
                          borderRadius: 6,
                          padding: '3px 8px',
                          color: '#38bdf8',
                          fontSize: 10.5,
                          fontWeight: 800,
                          cursor: 'pointer'
                        }}
                      >
                        📖 Notes
                      </button>
                      <span style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 800 }}>
                        {isActive ? 'Active Track ➔' : 'Select Track ➔'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : modules.length === 0 ? (
        /* ── MODE 2: Empty State Banner when no roadmap has been generated yet ── */
        <div className="glass-card-premium animate-modal-pop" style={{
          padding: '48px 32px',
          textAlign: 'center',
          margin: '20px 0',
          borderRadius: 24,
          border: '1.5px dashed rgba(16,185,129,0.3)',
          background: 'linear-gradient(135deg, rgba(16,185,129,0.04), rgba(99,102,241,0.03))'
        }}>
          <div style={{ width: 64, height: 64, borderRadius: 20, background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, margin: '0 auto 16px auto', boxShadow: '0 8px 24px rgba(16,185,129,0.2)' }}>
            🎯
          </div>

          <h2 style={{ fontSize: 22, fontWeight: 900, color: 'var(--t1)', marginBottom: 8, fontFamily: 'var(--font-display)' }}>
            Welcome to PinIT Career OS Quests!
          </h2>
          <p style={{ fontSize: 13.5, color: 'var(--t2)', maxWidth: 540, margin: '0 auto 24px auto', lineHeight: 1.6 }}>
            No preloaded dummy data. Click the button below to generate your personalized dynamic AI roadmap tailored to your knowledge score, mindset archetype, and target career goal.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
            <button
              onClick={() => setShowRoadmapModal(true)}
              className="btn-emerald-glow"
              style={{ padding: '14px 28px', fontSize: 14, fontWeight: 800, cursor: 'pointer' }}
            >
              ✨ Generate Custom AI Roadmap ➔
            </button>

            <button
              onClick={() => setShowCourseLibrary(true)}
              style={{
                padding: '14px 24px',
                borderRadius: 12,
                border: '1px solid var(--border)',
                background: 'var(--bg3)',
                color: 'var(--t1)',
                fontSize: 13.5,
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              📚 Browse Course Library
            </button>
          </div>
        </div>
      ) : (

        /* ── MODE 2: Dynamic Goal-Based Snake Roadmap Path ───────────────── */
        <div className="animate-fade-in" id="quest-roadmap-chart-section">
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 900, color: 'var(--t1)', fontFamily: 'var(--font-display)', letterSpacing: '-0.3px' }}>
                🧭 Dynamic Career Roadmap ({COURSES_REGISTRY.find(c => c.id === activeCourseId)?.title.split('(')[0].trim() || onboardingAnswers?.role || trajectory.roleTitle})
              </h2>
              <p style={{ fontSize: 13, color: 'var(--t3)', marginTop: 4 }}>
                Sequential milestone nodes. Single-click any node to launch its quests.
              </p>
            </div>

            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <button
                onClick={() => setShowFullJourneyModal(true)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 12,
                  border: '1.5px solid #10b981',
                  background: 'rgba(16,185,129,0.15)',
                  color: '#10b981',
                  fontSize: 12,
                  fontWeight: 900,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  boxShadow: '0 4px 14px rgba(16,185,129,0.2)',
                  transition: 'all 0.2s'
                }}
              >
                📜 View Entire Detailed Journey ➔
              </button>
              <span style={{ fontSize: 11, background: 'rgba(5,150,105,0.1)', color: 'var(--green)', padding: '6px 12px', borderRadius: 20, fontWeight: 700 }}>
                ✓ Single-Click Active Node Execution
              </span>
            </div>
          </div>

          {/* 🔀 DUAL LEARNING MODE SWITCHER (Fused Career Trajectory vs Standalone Single Course Direct Learning) */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 16px',
            borderRadius: 20,
            background: 'var(--bg3)',
            border: '1.5px solid var(--border)',
            marginBottom: 24,
            flexWrap: 'wrap',
            gap: 12,
            boxShadow: 'var(--shadow-md)'
          }}>
            <div role="tablist" aria-label="Learning roadmaps" style={{ display: 'flex', gap: 8, flexWrap: 'nowrap', alignItems: 'center', overflowX: 'auto', paddingBottom: 4, maxWidth: '100%' }}>
              <button
                type="button"
                role="tab"
                aria-selected={learningPathMode === 'fused_roadmap'}
                onClick={() => {
                  playPopSound();
                  setLearningPathMode('fused_roadmap');
                  if (fusedCourseRef.current) setActiveCourseId(fusedCourseRef.current);
                }}
                style={{
                  padding: '10px 18px',
                  borderRadius: '12px 12px 0 0',
                  border: `1.5px solid ${learningPathMode === 'fused_roadmap' ? '#10b981' : 'rgba(255,255,255,0.08)'}`,
                  borderBottom: learningPathMode === 'fused_roadmap' ? '1.5px solid transparent' : '1.5px solid rgba(255,255,255,0.08)',
                  background: learningPathMode === 'fused_roadmap' ? 'linear-gradient(135deg, rgba(16,185,129,0.25), rgba(5,150,105,0.15))' : 'var(--bg2)',
                  color: learningPathMode === 'fused_roadmap' ? '#34d399' : 'var(--t2)',
                  fontSize: 13,
                  fontWeight: 900,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  flexShrink: 0,
                  boxShadow: learningPathMode === 'fused_roadmap' ? '0 4px 16px rgba(16,185,129,0.25)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <span>🗺️ Fused Career Trajectory</span>
                <span style={{ fontSize: 10, fontWeight: 800, background: 'rgba(16,185,129,0.25)', padding: '2px 7px', borderRadius: 6, color: '#10b981' }}>
                  Roadmap 1
                </span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={learningPathMode === 'single_course'}
                onClick={() => {
                  playPopSound();
                  setLearningPathMode('single_course');
                  setActiveCourseId(selectedStandaloneCourseId);
                }}
                style={{
                  padding: '10px 18px',
                  borderRadius: '12px 12px 0 0',
                  border: `1.5px solid ${learningPathMode === 'single_course' ? '#3b82f6' : 'rgba(255,255,255,0.08)'}`,
                  borderBottom: learningPathMode === 'single_course' ? '1.5px solid transparent' : '1.5px solid rgba(255,255,255,0.08)',
                  background: learningPathMode === 'single_course' ? 'linear-gradient(135deg, rgba(59,130,246,0.25), rgba(37,99,235,0.15))' : 'var(--bg2)',
                  color: learningPathMode === 'single_course' ? '#60a5fa' : 'var(--t2)',
                  fontSize: 13,
                  fontWeight: 900,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  flexShrink: 0,
                  boxShadow: learningPathMode === 'single_course' ? '0 4px 16px rgba(59,130,246,0.25)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <span>📚 Standalone Single-Course</span>
                <span style={{ fontSize: 10, fontWeight: 800, background: 'rgba(59,130,246,0.25)', padding: '2px 7px', borderRadius: 6, color: '#60a5fa' }}>
                  Direct
                </span>
              </button>

              {extraRoadmaps.map(rm => {
                const isOn = learningPathMode === extraRoadmapMode(rm.id);
                return (
                  <div
                    key={rm.id}
                    role="tab"
                    aria-selected={isOn}
                    onClick={() => {
                      playPopSound();
                      setLearningPathMode(extraRoadmapMode(rm.id));
                      setActiveCourseId(rm.courseId);
                    }}
                    onAuxClick={(e) => {
                      if (e.button === 1) {
                        e.preventDefault();
                        e.stopPropagation();
                        closeExtraRoadmap(rm.id);
                      }
                    }}
                    title={`${rm.goal} · close with × or middle-click`}
                    style={{
                      padding: '8px 8px 8px 16px',
                      borderRadius: '12px 12px 0 0',
                      border: `1.5px solid ${isOn ? '#f59e0b' : 'rgba(255,255,255,0.08)'}`,
                      background: isOn ? 'linear-gradient(135deg, rgba(245,158,11,0.28), rgba(217,119,6,0.16))' : 'var(--bg2)',
                      color: isOn ? '#fbbf24' : 'var(--t2)',
                      fontSize: 13,
                      fontWeight: 900,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      flexShrink: 0,
                      boxShadow: isOn ? '0 4px 16px rgba(245,158,11,0.25)' : 'none',
                      maxWidth: 220
                    }}
                  >
                    <span style={{ whiteSpace: 'nowrap' }}>🗺️ Roadmap {rm.number}</span>
                    <button
                      type="button"
                      aria-label={`Close Roadmap ${rm.number}`}
                      title="Close tab"
                      onClick={(e) => {
                        e.stopPropagation();
                        closeExtraRoadmap(rm.id);
                      }}
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 6,
                        border: 'none',
                        background: isOn ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.06)',
                        color: isOn ? '#fff' : 'var(--t3)',
                        cursor: 'pointer',
                        fontSize: 13,
                        lineHeight: '20px',
                        padding: 0,
                        flexShrink: 0
                      }}
                    >
                      ×
                    </button>
                  </div>
                );
              })}

              <button
                type="button"
                title="New roadmap"
                onClick={() => {
                  playPopSound();
                  setShowRoadmapModal(true);
                }}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  border: '1.5px dashed rgba(16,185,129,0.45)',
                  background: 'rgba(16,185,129,0.08)',
                  color: '#34d399',
                  fontSize: 20,
                  fontWeight: 800,
                  cursor: 'pointer',
                  flexShrink: 0,
                  lineHeight: 1
                }}
              >
                +
              </button>
            </div>

            {learningPathMode === 'single_course' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--t2)' }}>Select Standalone Course:</span>
                <select
                  value={selectedStandaloneCourseId}
                  onChange={e => {
                    playPopSound();
                    setSelectedStandaloneCourseId(e.target.value);
                    setActiveCourseId(e.target.value);
                  }}
                  style={{
                    padding: '8px 14px',
                    borderRadius: 12,
                    border: '1.5px solid #3b82f6',
                    background: '#090d16',
                    color: '#ffffff',
                    fontSize: 12.5,
                    fontWeight: 800,
                    cursor: 'pointer',
                    outline: 'none',
                    boxShadow: '0 4px 12px rgba(59,130,246,0.2)'
                  }}
                >
                  {COURSES_REGISTRY.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.icon} {c.title}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* ── 40% / 60% SIDE-BY-SIDE SPLIT VIEW LAYOUT ─────────────────── */}
          <div style={{ display: 'grid', gridTemplateColumns: '38% 60%', gap: '2%', marginTop: 24, alignItems: 'flex-start' }}>

            {/* ── LEFT COLUMN (40% Width): Visual Horizontal / Winding Roadmap Chart ── */}
            <div className="glass-card-premium" style={{
              padding: '24px 20px',
              borderRadius: 24,
              border: '1px solid var(--border)',
              background: 'var(--bg2)',
              position: 'relative',
              boxShadow: 'var(--shadow-lg)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 900, color: 'var(--t1)', margin: 0, fontFamily: 'var(--font-display)' }}>
                    🗺️ Visual Roadmap Chart
                  </h3>
                </div>
                <span style={{ fontSize: 10, fontWeight: 800, background: 'rgba(16,185,129,0.15)', color: 'var(--green)', padding: '3px 10px', borderRadius: 20 }}>
                  Interactive Flow
                </span>
              </div>

              {/* ── PIXEL-PERFECT PURE CSS/SVG S-CURVE ROADMAP FRAMEWORK (Image 2 Reference) ── */}
              <div style={{ position: 'relative', width: '100%', minHeight: 780, padding: '20px 10px 40px 10px', overflow: 'hidden' }}>
                
                {/* 🎨 BACKGROUND CONTINUOUS SVG S-CURVE ROAD TRACK */}
                <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }} viewBox="0 0 320 780" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="scurveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#f43f5e" />
                      <stop offset="14%" stopColor="#f59e0b" />
                      <stop offset="28%" stopColor="#10b981" />
                      <stop offset="42%" stopColor="#06b6d4" />
                      <stop offset="56%" stopColor="#3b82f6" />
                      <stop offset="70%" stopColor="#8b5cf6" />
                      <stop offset="84%" stopColor="#ec4899" />
                      <stop offset="100%" stopColor="#eab308" />
                    </linearGradient>
                  </defs>

                  {/* Outer Thick Road Shadow / Border */}
                  <path
                    d={QUEST_S_CURVE_PATH}
                    fill="none"
                    stroke="rgba(0,0,0,0.15)"
                    strokeWidth="34"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Main Colored Road Surface */}
                  <path
                    d={QUEST_S_CURVE_PATH}
                    fill="none"
                    stroke="url(#scurveGradient)"
                    strokeWidth="24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Dashed White Center Line — MUST use the same path as the road */}
                  <path
                    d={QUEST_S_CURVE_PATH}
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="2.5"
                    strokeDasharray="10 9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.85"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>

                {/* 🏁 TOP-LEFT STARTING AVATAR NODE */}
                <div style={{ position: 'absolute', top: 12, left: 24, zIndex: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    background: '#f43f5e',
                    border: '4px solid #ffffff',
                    boxShadow: '0 4px 12px rgba(244,63,94,0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 20
                  }}>
                    🚀
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 900, color: '#f43f5e', background: 'rgba(255,255,255,0.9)', padding: '4px 10px', borderRadius: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                    START
                  </span>
                </div>

                {/* 🏃‍♂️ ANIMATED AVATAR TRACK RUNNER GLIDING ALONG THE S-CURVE ROAD (Task 2) */}
                {(() => {
                  const steps = [
                    { step: 1, top: 95, alignRight: true, color: '#f43f5e' },
                    { step: 2, top: 175, alignRight: false, color: '#f59e0b' },
                    { step: 3, top: 255, alignRight: true, color: '#10b981' },
                    { step: 4, top: 335, alignRight: false, color: '#06b6d4' },
                    { step: 5, top: 415, alignRight: true, color: '#3b82f6' },
                    { step: 6, top: 495, alignRight: false, color: '#8b5cf6' },
                    { step: 7, top: 575, alignRight: true, color: '#ec4899' },
                    { step: 8, top: 655, alignRight: false, color: '#eab308' },
                  ];
                  const activeStepIdx = steps.findIndex((s, idx) => {
                    const node = trajectory.nodes[idx];
                    return node && node.courseId === activeCourseId;
                  });
                  const currentStep = steps[activeStepIdx >= 0 ? activeStepIdx : 0];
                  const posX = currentStep.alignRight ? 270 : 60;
                  const posY = currentStep.top - 20;

                  return (
                    <div style={{
                      position: 'absolute',
                      left: posX - 18,
                      top: posY - 28,
                      zIndex: 10,
                      pointerEvents: 'none',
                      transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center'
                    }}>
                      <div style={{
                        fontSize: 8.5,
                        fontWeight: 900,
                        background: currentStep.color,
                        color: '#ffffff',
                        padding: '2px 7px',
                        borderRadius: 10,
                        boxShadow: `0 4px 12px ${currentStep.color}66`,
                        whiteSpace: 'nowrap',
                        marginBottom: 2
                      }}>
                        YOU ARE HERE 📍
                      </div>
                      <div style={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        background: '#ffffff',
                        border: `3px solid ${currentStep.color}`,
                        boxShadow: `0 0 0 4px ${currentStep.color}33, 0 6px 16px ${currentStep.color}88`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 16
                      }}>
                        🧑‍💻
                      </div>
                    </div>
                  );
                })()}

                {/* 🛣️ 8 STEP NODES & HORIZONTAL WHITE CARDS (Matching Image 2 Reference) */}
                {[
                  { step: 1, title: 'Sharpen Basics', icon: '📋', color: '#f43f5e', top: 95, alignRight: true },
                  { step: 2, title: 'Learn HTML, CSS', icon: '🎨', color: '#f59e0b', top: 175, alignRight: false },
                  { step: 3, title: 'Learn Javascript - ES6/7/8', icon: '⚡', color: '#10b981', top: 255, alignRight: true },
                  { step: 4, title: 'Learn basic Nodejs and npm', icon: '🚀', color: '#06b6d4', top: 335, alignRight: false },
                  { step: 5, title: 'Learn basic React', icon: '⚛️', color: '#3b82f6', top: 415, alignRight: true },
                  { step: 6, title: 'Learn Redux', icon: '🔄', color: '#8b5cf6', top: 495, alignRight: false },
                  { step: 7, title: 'Dive into React Native', icon: '📱', color: '#ec4899', top: 575, alignRight: true },
                  { step: 8, title: 'Learn React Navigation', icon: '🧭', color: '#eab308', top: 655, alignRight: false },
                ].map((item, idx) => {
                  const targetIdx = Math.min(idx, trajectory.nodes.length - 1);
                  const targetNode = trajectory.nodes[targetIdx];
                  const directNode = trajectory.nodes[idx];
                  const dynamicTitle = directNode ? directNode.title : item.title;
                  
                  // Calculate live quest metrics for this step
                  const nodeCourse = directNode ? COURSES_REGISTRY.find(c => c.id === directNode.courseId) : undefined;
                  const nodeQuests = nodeCourse?.quests || [];
                  const clearedCount = nodeQuests.filter(q => completedQuests.includes(q.id)).length;
                  const isFullyCompleted = nodeQuests.length > 0 && clearedCount === nodeQuests.length;
                  const isCurrentStep = (targetNode && targetNode.courseId === activeCourseId) || (idx === 0 && !trajectory.nodes.some(n => n.courseId === activeCourseId));

                  return (
                    <div
                      key={item.step}
                      onClick={() => {
                        playPopSound();
                        if (targetNode) {
                          if (targetNode.courseId) {
                            setActiveCourseId(targetNode.courseId);
                          }
                          const el = document.getElementById(`node-card-${targetNode.nodeId}`);
                          if (el) {
                            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            el.style.transition = 'all 0.3s ease';
                            el.style.boxShadow = `0 0 25px ${item.color}88`;
                            setTimeout(() => {
                              el.style.boxShadow = '';
                            }, 1200);
                          }
                        }
                      }}
                      className="card-hover"
                      style={{
                        position: 'absolute',
                        top: item.top,
                        left: item.alignRight ? undefined : 30,
                        right: item.alignRight ? 30 : undefined,
                        display: 'flex',
                        flexDirection: item.alignRight ? 'row' : 'row-reverse',
                        alignItems: 'center',
                        gap: 12,
                        zIndex: isCurrentStep ? 5 : 3,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {/* Circle Step Badge ON Road Curve with Glowing Pulse when Active / Checkmark when Completed */}
                      <div style={{
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        background: isFullyCompleted ? 'linear-gradient(135deg, #10b981, #047857)' : '#ffffff',
                        border: `4px solid ${isFullyCompleted ? '#34d399' : item.color}`,
                        boxShadow: isCurrentStep
                          ? `0 0 0 6px ${item.color}33, 0 0 24px ${item.color}aa`
                          : isFullyCompleted
                          ? '0 0 16px rgba(16,185,129,0.5)'
                          : `0 4px 14px ${item.color}55`,
                        transform: isCurrentStep ? 'scale(1.12)' : 'scale(1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isFullyCompleted ? '#ffffff' : '#1e293b',
                        fontWeight: 900,
                        fontSize: isFullyCompleted ? 20 : 19,
                        flexShrink: 0,
                        transition: 'all 0.3s ease'
                      }}>
                        {isFullyCompleted ? '✓' : item.icon}
                      </div>

                      {/* Crisp Horizontal White Pill Card */}
                      <div style={{
                        background: 'rgba(255,255,255,0.95)',
                        borderLeft: `4px solid ${isFullyCompleted ? '#10b981' : item.color}`,
                        padding: '8px 14px',
                        borderRadius: '0 12px 12px 0',
                        boxShadow: isCurrentStep
                          ? `0 0 16px ${item.color}44, 0 4px 14px rgba(0,0,0,0.12)`
                          : '0 4px 14px rgba(0,0,0,0.08)',
                        border: isCurrentStep ? `1px solid ${item.color}44` : 'none',
                        borderLeftWidth: 4,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        maxWidth: 220,
                        transition: 'all 0.3s ease'
                      }}>
                        <span style={{ fontSize: 10, fontWeight: 900, color: isFullyCompleted ? '#10b981' : item.color, textTransform: 'uppercase', flexShrink: 0 }}>
                          Step {item.step}
                        </span>
                        <span style={{ fontSize: 11.5, fontWeight: 800, color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {dynamicTitle}
                        </span>
                        {isCurrentStep && (
                          <span style={{ fontSize: 8.5, fontWeight: 900, background: `${item.color}22`, color: item.color, padding: '2px 5px', borderRadius: 4, textTransform: 'uppercase', flexShrink: 0 }}>
                            ACTIVE
                          </span>
                        )}
                        {isFullyCompleted && (
                          <span style={{ fontSize: 8.5, fontWeight: 900, background: 'rgba(16,185,129,0.2)', color: '#10b981', padding: '2px 5px', borderRadius: 4, textTransform: 'uppercase', flexShrink: 0 }}>
                            CLEARED
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* 🏆 BOTTOM-RIGHT CELEBRATION GOAL NODE */}
                <div style={{ position: 'absolute', bottom: 10, right: 20, zIndex: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 900, color: '#eab308', background: 'rgba(255,255,255,0.9)', padding: '4px 10px', borderRadius: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                    CAREER GOAL REACHED
                  </span>
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    background: '#eab308',
                    border: '4px solid #ffffff',
                    boxShadow: '0 4px 12px rgba(234,179,8,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 20
                  }}>
                    🎉
                  </div>
                </div>

              </div>
            </div>

            {/* ── RIGHT COLUMN (60% Width): Detailed Quest Stage Execution Cards (Image 1 Style) ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
              
              {trajectory.nodes.map((node, idx) => {
                const nodeCourse = COURSES_REGISTRY.find(c => c.id === node.courseId) || COURSES_REGISTRY[0];
                const nodeQuests = nodeCourse.quests || [];
                const nodeCompletedCount = nodeQuests.filter(q => completedQuests.includes(q.id)).length;
                const nodeProgressPct = Math.min(100, Math.round((nodeCompletedCount / Math.max(1, nodeQuests.length)) * 100));
                const isNodeCompleted = nodeProgressPct === 100;
                const isCurrentActiveNode = node.courseId === activeCourseId;
                const isLocked = idx > 0 && (
                  (() => {
                    const prevNode = trajectory.nodes[idx - 1];
                    const prevCourse = COURSES_REGISTRY.find(c => c.id === prevNode.courseId);
                    const prevQuests = prevCourse?.quests || [];
                    const prevCleared = prevQuests.filter(q => completedQuests.includes(q.id)).length;
                    return prevCleared < prevQuests.length && prevQuests.length > 0;
                  })()
                );

                const nextQuestInNode = nodeQuests.find(q => !completedQuests.includes(q.id)) || nodeQuests[0];
                const stepColors = ['#f43f5e', '#f59e0b', '#10b981', '#06b6d4', '#0d9488', '#8b5cf6', '#ec4899', '#eab308'];
                const currentColor = stepColors[idx % stepColors.length];

                return (
                  <div id={`node-card-${node.nodeId}`} key={node.nodeId} style={{ position: 'relative' }}>
                    
                    {/* Readiness Gate Checkpoint Banner before Node */}
                    {node.gate && (
                      <div
                        onClick={() => setActiveGateModalNode(node)}
                        style={{
                          marginBottom: 12,
                          display: 'flex',
                          justifyContent: 'flex-end'
                        }}
                      >
                        <div style={{
                          padding: '7px 14px',
                          background: 'rgba(217,119,6,0.08)',
                          border: '1px solid rgba(217,119,6,0.3)',
                          borderRadius: 12,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 8,
                          fontSize: 11,
                          fontWeight: 700,
                          color: 'var(--amber)',
                          cursor: 'pointer'
                        }} className="card-hover">
                          <span>🔒 Career Gate Checkpoint (Click to Audit):</span>
                          <span style={{ color: 'var(--t2)' }}>
                            {node.gate.minDsaScore ? `✓ DSA ≥ ${node.gate.minDsaScore}% ` : ''}
                            {node.gate.minCommunicationScore ? `✓ Soft Skills ≥ ${node.gate.minCommunicationScore}% ` : ''}
                            {node.gate.minAtsScore ? `✓ ATS Resume ≥ ${node.gate.minAtsScore}% ` : ''}
                            {node.gate.requireProjectVerification ? `✓ Capstone Verified` : ''}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Detailed Stage Execution Card (Image 1 Style) */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 16,
                      position: 'relative'
                    }}>
                      {/* Step Circle Badge on Card */}
                      <div style={{
                        width: 64,
                        height: 64,
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${currentColor}, #090d16)`,
                        border: `3px solid ${currentColor}`,
                        boxShadow: `0 0 20px ${currentColor}55`,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                        fontWeight: 900,
                        flexShrink: 0,
                        zIndex: 2
                      }}>
                        <span style={{ fontSize: 8.5, textTransform: 'uppercase', opacity: 0.9 }}>Step</span>
                        <span style={{ fontSize: 18, lineHeight: 1.1 }}>{idx + 1}</span>
                      </div>

                      {/* Main Interactive Stage Card */}
                      <div
                        onClick={() => {
                          if (!isLocked && nextQuestInNode) {
                            handleLaunchQuest(nextQuestInNode, node.courseId);
                          }
                        }}
                        className={`glass-card-premium ${isLocked ? '' : 'card-hover'}`}
                        style={{
                          flex: 1,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 18,
                          padding: '20px 24px',
                          borderRadius: 22,
                          border: isCurrentActiveNode 
                            ? `2px solid ${currentColor}` 
                            : isNodeCompleted 
                            ? '1px solid var(--green)' 
                            : '1px solid var(--border)',
                          background: isCurrentActiveNode 
                            ? `linear-gradient(135deg, ${currentColor}15, var(--bg2))` 
                            : 'var(--bg2)',
                          boxShadow: isCurrentActiveNode ? `0 0 24px ${currentColor}33` : 'none',
                          cursor: isLocked ? 'not-allowed' : 'pointer',
                          opacity: isLocked ? 0.6 : 1
                        }}
                      >
                        {/* Icon Avatar */}
                        <div style={{
                          width: 48,
                          height: 48,
                          borderRadius: 14,
                          background: isNodeCompleted ? 'rgba(5,150,105,0.15)' : `${currentColor}22`,
                          border: `1px solid ${isNodeCompleted ? 'var(--green)' : currentColor}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 22,
                          flexShrink: 0
                        }}>
                          {isNodeCompleted ? '✓' : isLocked ? '🔒' : node.icon}
                        </div>

                        {/* Info Text */}
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                            <span style={{ fontSize: 9.5, fontWeight: 800, background: `${currentColor}22`, color: currentColor, padding: '2px 7px', borderRadius: 5, border: `1px solid ${currentColor}44` }}>
                              STAGE {idx + 1}
                            </span>
                            {(() => {
                              const getLevelBadge = (i: number) => {
                                if (i === 0) return { label: '🌱 Level 0: Zero Basics', color: '#10b981' };
                                if (i === 1) return { label: '🌱 Level 1: Foundations', color: '#06b6d4' };
                                if (i === 2) return { label: '⚡ Level 2: Core Engineering', color: '#3b82f6' };
                                return { label: '🔥 Level 3: Pro Mastery', color: '#ec4899' };
                              };
                              const badge = getLevelBadge(idx);
                              return (
                                <span style={{ fontSize: 9.5, fontWeight: 900, background: `${badge.color}15`, color: badge.color, padding: '2px 7px', borderRadius: 5, border: `1px solid ${badge.color}33` }}>
                                  {badge.label}
                                </span>
                              );
                            })()}
                            <h3 style={{ fontSize: 15, fontWeight: 900, color: 'var(--t1)', margin: 0 }}>{node.title}</h3>
                            <span style={{ fontSize: 9.5, fontWeight: 800, background: 'rgba(5,150,105,0.1)', color: 'var(--green)', padding: '2px 7px', borderRadius: 5 }}>
                              {node.careerImpact}
                            </span>
                          </div>

                          <p style={{ fontSize: 12, color: 'var(--t3)', marginTop: 4, marginBottom: 6, lineHeight: 1.35 }}>
                            {node.shortDesc}
                          </p>

                          {/* Skills Learned Badges */}
                          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                            {node.skillsLearned.map(skill => (
                              <span key={skill} style={{ fontSize: 10, background: 'var(--bg3)', border: '1px solid var(--border)', padding: '2px 7px', borderRadius: 5, color: 'var(--t2)', fontWeight: 600 }}>
                                ✓ {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Action Gauge & Button */}
                        <div style={{ minWidth: 140, textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                          <div style={{ fontSize: 11.5, fontWeight: 800, color: isNodeCompleted ? 'var(--green)' : currentColor, fontFamily: 'var(--font-mono)' }}>
                            {nodeCompletedCount} / {nodeQuests.length || 30} Cleared ({nodeProgressPct}%)
                          </div>

                          <div style={{ width: 120, height: 5, background: 'var(--bg3)', borderRadius: 3, overflow: 'hidden', border: '1px solid var(--border)' }}>
                            <div style={{ width: `${nodeProgressPct}%`, height: '100%', background: isNodeCompleted ? 'var(--green)' : currentColor }} />
                          </div>

                          <button
                            style={{
                              marginTop: 4,
                              background: isNodeCompleted ? 'rgba(5,150,105,0.1)' : isLocked ? 'var(--bg3)' : `linear-gradient(135deg, ${currentColor}, #059669)`,
                              border: isNodeCompleted ? '1px solid var(--green)' : 'none',
                              color: isNodeCompleted ? 'var(--green)' : isLocked ? 'var(--t4)' : '#fff',
                              padding: '6px 14px',
                              borderRadius: 9,
                              fontSize: 11,
                              fontWeight: 800,
                              cursor: isLocked ? 'not-allowed' : 'pointer'
                            }}
                          >
                            {isNodeCompleted ? 'Completed ✓' : isLocked ? 'Locked 🔒' : 'Continue Quest ➔'}
                          </button>
                        </div>

                      </div>
                    </div>

                  </div>
                );
              })}

            </div>

          </div>
        </div>
      )}

      {/* ── ENHANCEMENT 5: Comprehensive Quest & Learning Activity History Panel ── */}
      <div className="glass-card-premium" style={{
        padding: '32px 28px',
        borderRadius: 24,
        marginTop: 40,
        marginBottom: 32,
        border: '1px solid var(--border)',
        background: 'var(--bg2)'
      }}>
        {/* Section Header & Metrics Summary */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 900, color: 'var(--t1)', margin: 0, display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font-display)' }}>
              <span>📜</span> Quest Completion & Learning Activity History
            </h3>
            <span style={{ fontSize: 12.5, color: 'var(--t3)', marginTop: 4, display: 'block' }}>
              Verified record of completed syllabus lectures, passed coding exams, and earned reward milestones.
            </span>
          </div>

          {/* Metric Summary Badges */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <div style={{ padding: '8px 14px', borderRadius: 12, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', fontSize: 12, fontWeight: 800, color: '#34d399' }}>
              ✓ {completedQuests.length} Quests Cleared
            </div>
            <div style={{ padding: '8px 14px', borderRadius: 12, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)', fontSize: 12, fontWeight: 800, color: '#818cf8' }}>
              ⚡ +{completedQuests.length * 150} XP Accumulated
            </div>
            <div style={{ padding: '8px 14px', borderRadius: 12, background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.25)', fontSize: 12, fontWeight: 800, color: '#fbbf24' }}>
              🪙 +{completedQuests.length * 5} Pins Bonus
            </div>
          </div>
        </div>

        {/* Filter Navigation Tabs */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20, borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>
          {[
            { id: 'all', label: `🌐 All Activity (${completedQuests.length + (pinsHistory?.length || 0)})` },
            { id: 'quests', label: `🎓 Quests & Exams (${completedQuests.length})` },
            { id: 'pins', label: `🪙 Pins & Rewards (${pinsHistory?.length || 0})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setHistoryFilter(tab.id as any)}
              style={{
                padding: '8px 16px',
                borderRadius: 10,
                border: `1.5px solid ${historyFilter === tab.id ? '#10b981' : 'transparent'}`,
                background: historyFilter === tab.id ? 'rgba(16,185,129,0.15)' : 'var(--bg3)',
                color: historyFilter === tab.id ? '#34d399' : 'var(--t2)',
                fontSize: 12.5,
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dynamic Activity List */}
        {(() => {
          // Construct Quest History Items
          const questHistoryItems = completedQuests.map((qId, idx) => {
            let foundQuest: any = null;
            let foundCourseTitle = 'Career Trajectory';
            
            for (const c of COURSES_REGISTRY) {
              const q = (c.quests || []).find(item => item.id === qId);
              if (q) {
                foundQuest = q;
                foundCourseTitle = c.title.split('(')[0].trim();
                break;
              }
            }

            const rawTimestampTag = onboardingAnswers?.completedQuestsTimestamps?.[idx];
            let displayDate = 'Recently Cleared';
            if (rawTimestampTag) {
              try {
                const tsStr = rawTimestampTag.split('|')[0];
                const d = new Date(tsStr);
                if (!isNaN(d.getTime())) {
                  displayDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
                }
              } catch {}
            }

            return {
              id: `history_quest_${qId}_${idx}`,
              type: 'quest',
              title: foundQuest?.title || qId.replace(/-/g, ' ').toUpperCase(),
              courseTitle: foundCourseTitle,
              desc: foundQuest?.desc || 'Successfully cleared syllabus lecture & technical evaluation.',
              date: displayDate,
              xp: 150,
              pins: 5,
              questId: qId,
              icon: qId.includes('exam') ? '🏆' : '🎓'
            };
          });

          // Construct Pin History Items
          const pinHistoryItems = (pinsHistory || []).map((p: any, pIdx: number) => ({
            id: `history_pin_${pIdx}`,
            type: 'pin',
            title: p.description || (p.amount > 0 ? 'Earned Bonus Pins' : 'Spent Pins'),
            courseTitle: 'PinIT Rewards',
            desc: `Transaction amount: ${p.amount > 0 ? `+${p.amount}` : p.amount} Pins`,
            date: p.date ? new Date(p.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Recent',
            xp: 0,
            pins: p.amount,
            questId: null,
            icon: '🪙'
          }));

          let displayItems = [];
          if (historyFilter === 'quests') displayItems = questHistoryItems;
          else if (historyFilter === 'pins') displayItems = pinHistoryItems;
          else displayItems = [...questHistoryItems, ...pinHistoryItems];

          if (displayItems.length === 0) {
            return (
              <div style={{
                padding: '40px 20px',
                textAlign: 'center',
                background: 'var(--bg3)',
                borderRadius: 16,
                border: '1px dashed var(--border)'
              }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>📜</div>
                <h4 style={{ fontSize: 15, fontWeight: 800, color: 'var(--t1)', margin: '0 0 4px 0' }}>No Activity History Recorded Yet</h4>
                <p style={{ fontSize: 12.5, color: 'var(--t3)', margin: 0 }}>
                  Complete your first quest or pass a syllabus exam above to build your permanent learning history!
                </p>
              </div>
            );
          }

          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {displayItems.map(item => (
                <div
                  key={item.id}
                  style={{
                    padding: '16px 20px',
                    borderRadius: 16,
                    background: 'var(--bg3)',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 14,
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1, minWidth: 260 }}>
                    <div style={{
                      width: 44,
                      height: 44,
                      borderRadius: 14,
                      background: item.type === 'quest' ? 'rgba(16,185,129,0.12)' : 'rgba(234,179,8,0.12)',
                      border: `1px solid ${item.type === 'quest' ? 'rgba(16,185,129,0.3)' : 'rgba(234,179,8,0.3)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 22
                    }}>
                      {item.icon}
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 14, fontWeight: 900, color: 'var(--t1)' }}>{item.title}</span>
                        <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 6, background: 'rgba(255,255,255,0.06)', color: '#10b981', border: '1px solid var(--border)' }}>
                          {item.courseTitle}
                        </span>
                      </div>
                      <p style={{ fontSize: 12, color: 'var(--t3)', margin: '3px 0 0 0', lineHeight: 1.4 }}>{item.desc}</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 11, color: 'var(--t4)', fontWeight: 700 }}>{item.date}</span>
                    
                    {item.xp > 0 && (
                      <span style={{ fontSize: 11, fontWeight: 800, color: '#818cf8', background: 'rgba(99,102,241,0.1)', padding: '4px 8px', borderRadius: 6 }}>
                        +{item.xp} XP
                      </span>
                    )}

                    {item.pins !== 0 && (
                      <span style={{ fontSize: 11, fontWeight: 800, color: '#fbbf24', background: 'rgba(234,179,8,0.1)', padding: '4px 8px', borderRadius: 6 }}>
                        {item.pins > 0 ? `+${item.pins}` : item.pins} Pins
                      </span>
                    )}

                    {item.questId && (
                      <button
                        onClick={() => router.push(`/quests/lesson?questId=${item.questId}`)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: 8,
                          border: '1px solid var(--border)',
                          background: 'var(--bg2)',
                          color: 'var(--t1)',
                          fontSize: 11.5,
                          fontWeight: 800,
                          cursor: 'pointer'
                        }}
                      >
                        Revisit Lesson ➔
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          );
        })()}
      </div>

      {/* ── ENHANCEMENT 4: Visual Career Readiness Gate Checkpoint Modal ────── */}
      {activeGateModalNode && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24
        }}>
          <div style={{
            maxWidth: 480, width: '100%', background: 'var(--bg2)',
            border: '1px solid rgba(217,119,6,0.3)', borderRadius: 24, padding: 32,
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--amber)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                🔒 Career Gate Audit Checkpoint
              </span>
              <button onClick={() => setActiveGateModalNode(null)} style={{ background: 'none', border: 'none', color: 'var(--t3)', fontSize: 18, cursor: 'pointer' }}>✕</button>
            </div>

            <h3 style={{ fontSize: 18, fontWeight: 900, color: 'var(--t1)', marginBottom: 6 }}>
              {activeGateModalNode.title} Readiness
            </h3>
            <p style={{ fontSize: 12.5, color: 'var(--t3)', lineHeight: 1.5, marginBottom: 20 }}>
              Multi-dimensional gate check ensuring student possesses technical, soft skills, resume ATS, and code verification capabilities.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'var(--bg3)', borderRadius: 12, fontSize: 13 }}>
                <span>📚 Technical Quests Completion</span>
                <span style={{ color: 'var(--green)', fontWeight: 800 }}>✓ 100% Passed</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'var(--bg3)', borderRadius: 12, fontSize: 13 }}>
                <span>🗣️ Soft Skills / Communication Lab</span>
                <span style={{ color: 'var(--green)', fontWeight: 800 }}>✓ {activeGateModalNode.gate?.minCommunicationScore || 70}% Cleared</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'var(--bg3)', borderRadius: 12, fontSize: 13 }}>
                <span>📄 ATS Resume Match Score</span>
                <span style={{ color: 'var(--green)', fontWeight: 800 }}>✓ {activeGateModalNode.gate?.minAtsScore || 80}% Cleared</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'var(--bg3)', borderRadius: 12, fontSize: 13 }}>
                <span>💻 Verified Capstone Project</span>
                <span style={{ color: 'var(--green)', fontWeight: 800 }}>✓ Code Verified</span>
              </div>
            </div>

            <button
              onClick={() => setActiveGateModalNode(null)}
              style={{
                width: '100%', padding: '12px', background: 'var(--accent)',
                border: 'none', borderRadius: 12, color: '#fff', fontWeight: 800,
                fontSize: 13, cursor: 'pointer'
              }}
            >
              Close Readiness Audit ➔
            </button>
          </div>
        </div>
      )}

      {/* ── CUSTOM AI ROADMAP GENERATOR MODAL (30 Days to 365 Days / 1 Year) ────── */}
      {showRoadmapModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
        }}>
          <div style={{
            maxWidth: 580, width: '100%',
            borderRadius: 24, padding: 32,
            position: 'relative'
          }} className="animate-modal-pop glass-card-premium">
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
                  ✨
                </div>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 900, color: 'var(--t1)', margin: 0 }}>
                    Configure Custom AI Roadmap
                  </h3>
                  <div style={{ fontSize: 12, color: 'var(--t3)', marginTop: 2 }}>
                    Opens as a new tab next to Standalone (Roadmap {nextRoadmapNumber(extraRoadmaps)}). Close extra tabs anytime — Fused and Standalone stay.
                  </div>
                </div>
              </div>
              <button onClick={() => !isGeneratingRoadmap && setShowRoadmapModal(false)} style={{ background: 'none', border: 'none', color: 'var(--t3)', fontSize: 20, cursor: 'pointer' }}>✕</button>
            </div>

            {isGeneratingRoadmap ? (
              /* Live Animated Step-by-Step AI Generation Progress */
              <div style={{ padding: '30px 10px', textAlign: 'center' }}>
                <div style={{ width: 60, height: 60, borderRadius: '50%', border: '4px solid rgba(16,185,129,0.2)', borderTopColor: '#10b981', margin: '0 auto 20px auto', animation: 'spin 1s linear infinite' }} />
                
                <h4 style={{ fontSize: 16, fontWeight: 800, color: 'var(--t1)', marginBottom: 8 }}>
                  Generating {selectedDuration}-Day Personalized Trajectory...
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 420, margin: '20px auto 0 auto' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: generationStep >= 1 ? 'rgba(16,185,129,0.1)' : 'var(--bg3)', borderRadius: 10, border: '1px solid var(--border)', fontSize: 12.5, color: 'var(--t1)' }}>
                    <span>{generationStep > 1 ? '✅' : '🧠'}</span>
                    <span>Step 1: Analyzing Target Role & Skill Gap</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: generationStep >= 2 ? 'rgba(16,185,129,0.1)' : 'var(--bg3)', borderRadius: 10, border: '1px solid var(--border)', fontSize: 12.5, color: 'var(--t1)' }}>
                    <span>{generationStep > 2 ? '✅' : '📅'}</span>
                    <span>Step 2: Structuring {selectedDuration}-Day Day-by-Day Milestone Plan</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: generationStep >= 3 ? 'rgba(16,185,129,0.1)' : 'var(--bg3)', borderRadius: 10, border: '1px solid var(--border)', fontSize: 12.5, color: 'var(--t1)' }}>
                    <span>{generationStep >= 3 ? '⚡' : '⏳'}</span>
                    <span>Step 3: Compiling Socratic Lectures, Coding Quests & Vivas</span>
                  </div>
                </div>
              </div>
            ) : (
              /* Configuration Form */
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                
                {/* 🌟 0. Student Profile Specs Summary Bar (Read-Only) */}
                <div style={{
                  padding: '12px 16px',
                  borderRadius: 14,
                  background: 'var(--bg3)',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 10,
                  fontSize: 11.5,
                  fontWeight: 800
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ color: 'var(--t4)' }}>⚡ QT1 Knowledge:</span>
                    <span style={{ color: '#10b981' }}>{qt1}/100</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ color: 'var(--t4)' }}>🧠 Mindset:</span>
                    <span style={{ color: 'var(--purple)' }}>{archetype}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ color: 'var(--t4)' }}>🎓 Active Course:</span>
                    <span style={{ color: 'var(--t1)' }}>{activeCourse.title.split('(')[0].trim()}</span>
                  </div>
                </div>

                {/* ⭐ 0. Editable Target Career Goal Input (Mixed Tech + Non-Tech Fuser) */}
                <div style={{
                  padding: '16px',
                  borderRadius: 16,
                  background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(99,102,241,0.06))',
                  border: '2px solid #10b981',
                  boxShadow: '0 4px 18px rgba(16,185,129,0.15)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <label style={{ fontSize: 13, fontWeight: 900, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      🎯 Target Career Goal & Mixed Specialization (Editable)
                    </label>
                    <span style={{ fontSize: 10, fontWeight: 800, padding: '3px 8px', borderRadius: 8, background: '#10b981', color: '#fff' }}>
                      ⭐ High-Priority Input
                    </span>
                  </div>
                  <p style={{ fontSize: 11.5, color: 'var(--t2)', marginBottom: 10, lineHeight: 1.4 }}>
                    Type your specific career goal! Combine Tech + Non-Tech skills (e.g. <i>"Full-Stack Developer launching an E-Commerce Business"</i>, <i>"Financial Analyst with Python AI Skills"</i>, or <i>"Operations Manager with Supply Chain Analytics"</i>).
                  </p>
                  <input
                    type="text"
                    value={customGoal}
                    onChange={e => {
                      const val = e.target.value;
                      setCustomGoal(val);
                      const lower = val.toLowerCase();
                      if (lower.includes('ai') || lower.includes('machine learning') || lower.includes('llm') || lower.includes('python')) setSelectedTrack('ai');
                      else if (lower.includes('finance') || lower.includes('investment') || lower.includes('tvm')) setSelectedTrack('finance');
                      else if (lower.includes('accounting') || lower.includes('tax') || lower.includes('tally')) setSelectedTrack('accounting');
                      else if (lower.includes('fullstack') || lower.includes('full-stack') || lower.includes('react') || lower.includes('node')) setSelectedTrack('fullstack');
                      else if (lower.includes('java') || lower.includes('dsa')) setSelectedTrack('java');
                      else if (lower.includes('devops') || lower.includes('docker') || lower.includes('cloud')) setSelectedTrack('devops');
                      else if (lower.includes('operations') || lower.includes('supply')) setSelectedTrack('operations');
                    }}
                    placeholder="e.g., Full-Stack AI Engineer launching an E-Commerce Business"
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: 10,
                      border: '2px solid #10b981',
                      background: '#090d16',
                      color: '#ffffff',
                      fontSize: 13.5,
                      fontWeight: 800,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.5)'
                    }}
                  />
                </div>

                {/* 1. Roadmap Duration Slider & Presets */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <label style={{ fontSize: 12.5, fontWeight: 800, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      📅 Roadmap Duration (Min 30 Days - Max 1 Year)
                    </label>
                    <span style={{ fontSize: 14, fontWeight: 900, color: '#34d399', fontFamily: 'var(--font-mono)' }}>
                      {selectedDuration} Days ({selectedDuration === 365 ? '1 Year' : `${Math.round(selectedDuration / 30 * 10) / 10} Months`})
                    </span>
                  </div>

                  <input
                    type="range"
                    min={30}
                    max={365}
                    step={5}
                    value={selectedDuration}
                    onChange={e => setSelectedDuration(Number(e.target.value))}
                    style={{ width: '100%', accentColor: '#10b981', cursor: 'pointer', marginBottom: 12 }}
                  />

                  {/* Preset Duration Chips */}
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {[
                      { days: 30, label: '30 Days (1 Mo)' },
                      { days: 60, label: '60 Days (2 Mo)' },
                      { days: 90, label: '90 Days (1 Qtr)' },
                      { days: 180, label: '180 Days (6 Mo)' },
                      { days: 365, label: '365 Days (1 Year)' }
                    ].map(p => (
                      <button
                        key={p.days}
                        onClick={() => setSelectedDuration(p.days)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: 8,
                          border: `1.5px solid ${selectedDuration === p.days ? '#10b981' : 'rgba(255,255,255,0.12)'}`,
                          background: selectedDuration === p.days ? 'rgba(16,185,129,0.2)' : '#121824',
                          color: selectedDuration === p.days ? '#34d399' : '#e0e7ff',
                          fontSize: 11.5,
                          fontWeight: 800,
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
                  {(() => {
                    const totalQuestsCount = trajectory.nodes.reduce((acc, n) => acc + (COURSES_REGISTRY.find(c => c.id === n.courseId)?.quests?.length || 20), 0);
                    const requiredVelocity = Math.max(1, Math.ceil(totalQuestsCount / Math.max(1, selectedDuration)));
                    const isSprint = selectedDuration <= 30;
                    const isBalanced = selectedDuration > 30 && selectedDuration <= 90;

                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {/* Dynamic Velocity Recommendation Banner */}
                        <div style={{
                          padding: '10px 14px',
                          borderRadius: 12,
                          background: isSprint ? 'rgba(244,63,94,0.12)' : isBalanced ? 'rgba(16,185,129,0.12)' : 'rgba(99,102,241,0.12)',
                          border: `1.5px solid ${isSprint ? '#f43f5e' : isBalanced ? '#10b981' : '#6366f1'}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: 10
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontSize: 16 }}>{isSprint ? '⚡' : isBalanced ? '🌿' : '🐢'}</span>
                            <div>
                              <div style={{ fontSize: 11, fontWeight: 900, color: isSprint ? '#f43f5e' : isBalanced ? '#34d399' : '#818cf8', textTransform: 'uppercase' }}>
                                {isSprint ? 'Sprint Velocity Mode' : isBalanced ? 'Balanced Pace Mode' : 'Steady Progress Mode'}
                              </div>
                              <div style={{ fontSize: 11.5, fontWeight: 800, color: 'var(--t1)' }}>
                                {totalQuestsCount} Total Quests over {selectedDuration} Days
                              </div>
                            </div>
                          </div>
                          <span style={{ fontSize: 12, fontWeight: 900, background: isSprint ? '#f43f5e' : isBalanced ? '#10b981' : '#6366f1', color: '#fff', padding: '4px 10px', borderRadius: 8 }}>
                            Requires {requiredVelocity} Quests/Day
                          </span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <label style={{ fontSize: 12.5, fontWeight: 800, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            ⚡ Select Daily Learning Target
                          </label>
                          <span style={{ fontSize: 11, fontWeight: 800, color: '#34d399' }}>
                            {selectedPace} Quests/Day Target
                          </span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                          {[
                            { pace: 1, title: '1 Quest/Day', desc: 'Flexible Pace' },
                            { pace: 2, title: '2 Quests/Day', desc: 'Accelerated' },
                            { pace: 3, title: '3 Quests/Day ⭐', desc: 'Compulsory' },
                            { pace: Math.max(4, requiredVelocity), title: `${Math.max(4, requiredVelocity)} Quests/Day 🔥`, desc: 'Sprint Target' }
                          ].map(item => (
                            <div
                              key={item.pace}
                              onClick={() => setSelectedPace(item.pace)}
                              style={{
                                padding: '10px 8px',
                                borderRadius: 12,
                                border: `1.5px solid ${selectedPace === item.pace ? '#10b981' : 'rgba(255,255,255,0.1)'}`,
                                background: selectedPace === item.pace ? 'rgba(16,185,129,0.2)' : '#121824',
                                color: selectedPace === item.pace ? '#34d399' : '#e0e7ff',
                                textAlign: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                            >
                              <div style={{ fontSize: 11.5, fontWeight: 900 }}>{item.title}</div>
                              <div style={{ fontSize: 9.5, opacity: 0.8, marginTop: 2 }}>{item.desc}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                  <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 8, textAlign: 'center' }}>
                    💡 Completing your 3 daily target quests unlocks unlimited 4th+ bonus quests on demand.
                  </div>

                {/* Submit CTA */}
                <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
                  <button
                    onClick={() => setShowRoadmapModal(false)}
                    style={{ flex: 1, padding: '12px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--bg3)', color: 'var(--t2)', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleCreateCustomRoadmap}
                    disabled={isGeneratingRoadmap}
                    style={{
                      flex: 2, padding: '12px', borderRadius: 12, border: 'none',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: '#fff', fontWeight: 800, fontSize: 13.5,
                      cursor: isGeneratingRoadmap ? 'wait' : 'pointer',
                      opacity: isGeneratingRoadmap ? 0.7 : 1,
                      boxShadow: '0 6px 20px rgba(16,185,129,0.3)'
                    }}
                    className="btn-glow"
                  >
                    ✨ Generate {selectedDuration}-Day Roadmap ➔
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ── ENHANCEMENT: Full Detailed Master Journey Modal (Every Quest Lined Up) ────── */}
      {showFullJourneyModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24
        }}>
          <div style={{
            maxWidth: 840, width: '100%', maxHeight: '90vh',
            background: 'var(--bg2)', border: '1px solid rgba(16,185,129,0.3)',
            borderRadius: 24, padding: 32, display: 'flex', flexDirection: 'column',
            boxShadow: '0 25px 60px rgba(0,0,0,0.6)', position: 'relative', overflow: 'hidden'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 900, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  🗺️ Master Syllabus & Full Journey Breakdown
                </span>
                <h3 style={{ fontSize: 20, fontWeight: 900, color: 'var(--t1)', margin: '4px 0 0 0' }}>
                  {trajectory.roleTitle} — Every Quest Lined Up
                </h3>
              </div>
              <button onClick={() => setShowFullJourneyModal(false)} style={{ background: 'none', border: 'none', color: 'var(--t3)', fontSize: 22, cursor: 'pointer' }}>✕</button>
            </div>

            {/* Scrollable Master Quest List Lined Up Step-by-Step */}
            <div style={{ flex: 1, overflowY: 'auto', paddingRight: 8, display: 'flex', flexDirection: 'column', gap: 20 }}>
              {trajectory.nodes.map((node, nodeIdx) => {
                const nodeCourse = COURSES_REGISTRY.find(c => c.id === node.courseId) || COURSES_REGISTRY[0];
                const nodeQuests = nodeCourse.quests || [];
                const nodeCompletedCount = nodeQuests.filter(q => completedQuests.includes(q.id)).length;
                const isFullyCompleted = nodeQuests.length > 0 && nodeCompletedCount === nodeQuests.length;

                return (
                  <div key={node.nodeId} style={{
                    padding: '20px',
                    borderRadius: 16,
                    background: 'var(--bg3)',
                    border: `1px solid ${isFullyCompleted ? '#10b981' : 'var(--border)'}`
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 11, fontWeight: 900, background: isFullyCompleted ? '#10b981' : '#6366f1', color: '#fff', padding: '3px 9px', borderRadius: 12 }}>
                          Step {nodeIdx + 1}
                        </span>
                        <h4 style={{ fontSize: 15, fontWeight: 900, color: 'var(--t1)', margin: 0 }}>
                          {node.title}
                        </h4>
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 800, color: isFullyCompleted ? '#10b981' : 'var(--t3)' }}>
                        {nodeCompletedCount} / {nodeQuests.length} Quests Cleared
                      </span>
                    </div>

                    {/* Quest List in Row / Stack */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {nodeQuests.map((q, qIdx) => {
                        const isDone = completedQuests.includes(q.id);
                        return (
                          <div key={q.id} style={{
                            padding: '12px 16px',
                            borderRadius: 12,
                            background: 'var(--bg2)',
                            border: `1px solid ${isDone ? 'rgba(16,185,129,0.3)' : 'var(--border)'}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 12
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <span style={{
                                width: 28, height: 28, borderRadius: '50%',
                                background: isDone ? 'rgba(16,185,129,0.2)' : 'var(--bg3)',
                                color: isDone ? '#10b981' : 'var(--t3)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 12, fontWeight: 900
                              }}>
                                {isDone ? '✓' : qIdx + 1}
                              </span>
                              <div>
                                <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--t1)' }}>
                                  {q.title}
                                </div>
                                <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 2 }}>
                                  {q.desc || 'Dissect syntax, concepts, and production implementation.'}
                                </div>
                              </div>
                            </div>

                            <button
                              onClick={() => {
                                setShowFullJourneyModal(false);
                                router.push(`/quests/teacher-select/?questId=${q.id}`);
                              }}
                              style={{
                                padding: '6px 14px',
                                borderRadius: 8,
                                border: 'none',
                                background: isDone ? 'rgba(16,185,129,0.15)' : '#6366f1',
                                color: isDone ? '#10b981' : '#ffffff',
                                fontSize: 11.5,
                                fontWeight: 800,
                                cursor: 'pointer',
                                flexShrink: 0
                              }}
                            >
                              {isDone ? 'Revisit ➔' : 'Start Quest ➔'}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── SIMPLE COURSE NOTES MODAL ── */}
      <CourseNotesModal
        courseId={notesModalState.courseId}
        courseTitle={notesModalState.courseTitle}
        isOpen={notesModalState.isOpen}
        onClose={() => setNotesModalState(prev => ({ ...prev, isOpen: false }))}
      />

    </div>
  );
}
