'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCareerOS } from '@/lib/context/CareerOSContext';
import { useAuth } from '@/lib/context/AuthContext';
import type { Course } from '@/lib/data/coursesData';
import { COURSES_CATALOG } from '@/lib/data/coursesCatalog';
import { recommendCareerTrajectory, CareerTrajectory, TrajectoryNode } from '@/lib/data/careerTrajectories';
import { toast } from '@/lib/store/useAppStore';
import {
  CompetencyMasteryStatus,
  DynamicRoleReadiness,
} from '@/lib/pathway/competencySchema';
import { PathwayApiService } from '@/lib/api/pathwayApi';
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

export interface Quest {
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

export interface Module {
  id: string;
  title: string;
  desc: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedWeeks: number;
  quests: Quest[];
}

export const QUEST_S_CURVE_PATH =
  'M 50,35 H 250 C 295,35 295,115 250,115 H 60 C 15,115 15,195 60,195 H 250 C 295,195 295,275 250,275 H 60 C 15,275 15,355 60,355 H 250 C 295,355 295,435 250,435 H 60 C 15,435 15,515 60,515 H 250 C 295,515 295,595 250,595 H 60 C 15,595 15,675 60,675 H 250 C 295,675 295,735 250,735 H 230';

// 🔊 Pure WebAudio Gamification Sound FX Engine
export const playPopSound = () => {
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

export const playLevelUpSound = () => {
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

export const CERTIFICATION_TRACKS = [
  {
    id: 'cert-12m-sde',
    title: '12-Month SDE Industrial Specialist Certification',
    duration: '12 Months (4 Quarters)',
    icon: '🏆',
    desc: 'Comprehensive enterprise track covering Core Foundations, Intermediate Architecture, Data Structures & High-Scale Systems.',
    courseId: 'course-python-backend',
    quarters: [
      { q: 'Quarter 1', name: 'Foundations & Core Logic', quests: '90 Quests' },
      { q: 'Quarter 2', name: 'Intermediate Architecture & APIs', quests: '90 Quests' },
      { q: 'Quarter 3', name: 'Data Structures & Algorithms', quests: '90 Quests' },
      { q: 'Quarter 4', name: 'High-Scale Production & Diploma', quests: '90 Quests' }
    ]
  },
  {
    id: 'cert-9m-fullstack',
    title: '9-Month Full-Stack Engineering Certification',
    duration: '9 Months (3 Quarters)',
    icon: '🚀',
    desc: 'Modern web architecture with React, Next.js, Node.js, and Cloud Deployment.',
    courseId: 'course-fullstack-dev',
    quarters: [
      { q: 'Quarter 1', name: 'Frontend Engineering & React', quests: '90 Quests' },
      { q: 'Quarter 2', name: 'Backend Services & Databases', quests: '90 Quests' },
      { q: 'Quarter 3', name: 'Cloud Deployment & Capstone', quests: '90 Quests' }
    ]
  },
  {
    id: 'cert-24m-cloud-ai',
    title: '24-Month Cloud Architecture & AI Systems Diploma',
    duration: '24 Months (8 Quarters)',
    icon: '☁️',
    desc: 'Advanced distributed systems, Kubernetes orchestration, LLM engineering, and SRE operations.',
    courseId: 'course-cloud-devops',
    quarters: [
      { q: 'Year 1', name: 'Cloud Infrastructure & Microservices', quests: '180 Quests' },
      { q: 'Year 2', name: 'Distributed Systems & Applied AI', quests: '180 Quests' }
    ]
  },
  {
    id: 'cert-6m-data',
    title: '6-Month Data Engineering & ML Systems Certification',
    duration: '6 Months (2 Quarters)',
    icon: '📊',
    desc: 'Data pipelines, Apache Spark, SQL optimization, and feature stores.',
    courseId: 'course-data-science',
    quarters: [
      { q: 'Quarter 1', name: 'Data Pipelines & Warehousing', quests: '90 Quests' },
      { q: 'Quarter 2', name: 'Real-time Streaming & ML Ops', quests: '90 Quests' }
    ]
  }
];

export const COURSE_TO_ROLE: Record<string, string> = {
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

export const TRACK_CONFIG: Record<string, { role: string; courseId: string; tags: string[]; gaps: string[] }> = {
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

export function useQuestProgression() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlTab = searchParams?.get('tab');
  const initialSubTab: 'certification_passport' | 'custom_roadmap' | 'standalone' | 'language' =
    urlTab === 'passport' || urlTab === 'certification' ? 'certification_passport' : (urlTab as any || 'certification_passport');

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
  const [coursesRegistry, setCoursesRegistry] = useState<Course[]>([]);

  useEffect(() => {
    let isMounted = true;
    import('@/lib/data/coursesData').then((mod) => {
      if (isMounted) {
        setCoursesRegistry(mod.COURSES_REGISTRY);
      }
    });
    return () => { isMounted = false; };
  }, []);

  const COURSES_REGISTRY: Course[] = coursesRegistry.length > 0 ? coursesRegistry : (COURSES_CATALOG as unknown as Course[]);
  const [showCourseLibrary, setShowCourseLibrary] = useState(false);
  const [showFullJourneyModal, setShowFullJourneyModal] = useState(false);
  const [activeGateModalNode, setActiveGateModalNode] = useState<TrajectoryNode | null>(null);
  const [historyFilter, setHistoryFilter] = useState<'all' | 'quests' | 'pins'>('all');
  const [showEnglishDashboard, setShowEnglishDashboard] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'certification_passport' | 'custom_roadmap' | 'standalone' | 'language'>(initialSubTab);
  const [selectedCertTrackId, setSelectedCertTrackId] = useState<string>('cert-12m-sde');
  const [showPassportDetails, setShowPassportDetails] = useState<boolean>(urlTab === 'passport');

  // Passport state
  const [passportView, setPassportView] = useState<'timeline' | 'matrix'>('timeline');
  const [passportSelectedCompId, setPassportSelectedCompId] = useState<string | undefined>();
  const [passportSelectedProgramId, setPassportSelectedProgramId] = useState('prog_swe_accelerated_9m');
  const [masteryMap, setMasteryMap] = useState<Map<string, CompetencyMasteryStatus>>(new Map());
  const [roleReadiness, setRoleReadiness] = useState<DynamicRoleReadiness | null>(null);
  const [showQrModal, setShowQrModal] = useState<boolean>(false);
  const [copiedPassportLink, setCopiedPassportLink] = useState<boolean>(false);
  const [isPlacementPrepFastTrack, setIsPlacementPrepFastTrack] = useState<boolean>(false);

  useEffect(() => {
    if (urlTab === 'passport') {
      setActiveSubTab('certification_passport');
      setShowPassportDetails(true);
    } else if (urlTab === 'certification') {
      setActiveSubTab('certification_passport');
    }
  }, [urlTab]);

  useEffect(() => {
    async function loadPassportData() {
      if (!userId) return;
      try {
        const map = await PathwayApiService.getStudentMasteryMap(userId);
        const readiness = await PathwayApiService.getRoleReadiness(userId, passportSelectedProgramId);
        setMasteryMap(map);
        setRoleReadiness(readiness);
      } catch (err) {
        console.error('Error loading passport live data:', err);
      }
    }
    loadPassportData();
  }, [userId, passportSelectedProgramId]);

  const getPassportStatusBadge = (status: string) => {
    switch (status) {
      case 'certified':
        return { text: 'INDUSTRY CERTIFIED (HIRE-READY)', bg: 'rgba(var(--success-rgb), 0.15)', border: 'rgba(var(--success-rgb), 0.3)', color: 'var(--success)' };
      case 'in_residency':
        return { text: 'IN RESIDENCY (ADVANCED TRACK)', bg: 'rgba(var(--brand-rgb), 0.15)', border: 'rgba(var(--brand-rgb), 0.3)', color: 'var(--brand-bright)' };
      case 'on_track':
        return { text: 'ON TRACK (PROGRESSING)', bg: 'rgba(var(--warning-rgb), 0.15)', border: 'rgba(var(--warning-rgb), 0.3)', color: 'var(--warning)' };
      case 'action_required':
        return { text: 'ACTION REQUIRED (GATES BLOCKED)', bg: 'rgba(var(--danger-rgb), 0.15)', border: 'rgba(var(--danger-rgb), 0.3)', color: 'var(--danger)' };
      default:
        return { text: 'ENROLLED / EXPLORING', bg: 'rgba(255, 255, 255, 0.05)', border: 'var(--border)', color: 'var(--t3)' };
    }
  };

  const handleSubTabChange = (tab: 'certification_passport' | 'custom_roadmap' | 'standalone' | 'language') => {
    setActiveSubTab(tab);
    setShowCourseLibrary(false);
    if (tab === 'standalone') {
      setLearningPathMode('single_course');
      setActiveCourseId(selectedStandaloneCourseId);
    } else if (tab === 'certification_passport') {
      setLearningPathMode('fused_roadmap');
    }
    if (typeof window !== 'undefined' && userId) {
      try {
        localStorage.setItem(`pinit_${userId}_quests_subtab`, tab);
      } catch {}
    }
  };

  // Dual Mode Switcher states
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

  // Notes Modal State
  const [notesModalState, setNotesModalState] = useState<{ isOpen: boolean; courseId: string; courseTitle: string }>({
    isOpen: false,
    courseId: '',
    courseTitle: ''
  });

  // Custom AI Roadmap Generator states
  const [showRoadmapModal, setShowRoadmapModal] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState<number>(30);
  const [selectedPace, setSelectedPace] = useState<number>(3);
  const [selectedTrack, setSelectedTrack] = useState<string>('fullstack');
  const [customGoal, setCustomGoal] = useState<string>('Full-Stack AI Engineer launching an E-Commerce Business');
  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false);
  const [generationStep, setGenerationStep] = useState<number>(1);

  const handleCreateCustomRoadmap = async () => {
    if (generatingLockRef.current || isGeneratingRoadmap) return;
    generatingLockRef.current = true;
    setIsGeneratingRoadmap(true);
    setGenerationStep(1);

    await new Promise(r => setTimeout(r, 500));
    setGenerationStep(2);

    await new Promise(r => setTimeout(r, 500));
    setGenerationStep(3);

    const config = TRACK_CONFIG[selectedTrack] || TRACK_CONFIG.ai;

    try {
      const finalGoal = customGoal ? customGoal.trim() : config.role;
      const { generateDynamicStudentRoadmap } = await import('@/lib/data/roadmapFuser');
      const dynamicModules = generateDynamicStudentRoadmap({
        qt1: onboardingAnswers?.qt1_score ?? 40,
        qt2: onboardingAnswers?.qt2_score ?? 40,
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

  const currentRole = (activeCourseId && COURSE_TO_ROLE[activeCourseId]) || onboardingAnswers?.role || 'Software Development Engineer (SDE)';
  const qt1 = onboardingAnswers?.qt1_score ?? 40;
  const qt2 = onboardingAnswers?.qt2_score ?? 40;
  const archetype = onboardingAnswers?.mindset_archetype || 'Pattern Hunter';
  const fusedTrajectory: CareerTrajectory = recommendCareerTrajectory(
    currentRole,
    qt1,
    qt2,
    archetype
  );

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

  const trajectory: CareerTrajectory = (activeSubTab === 'standalone' || learningPathMode === 'single_course')
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

  const loadModules = useCallback(async () => {
    if (typeof window === 'undefined' || userId === 'guest') return;
    const { generateDynamicStudentRoadmap } = await import('@/lib/data/roadmapFuser');

    if (activeSubTab === 'standalone' || learningPathMode === 'single_course') {
      const targetCourseId = selectedStandaloneCourseId || activeCourseId || 'course-java-logic';
      const directCourse = COURSES_REGISTRY.find(c => c.id === targetCourseId) || COURSES_REGISTRY[0];
      if (directCourse && directCourse.quests && directCourse.quests.length > 0) {
        const questsPerModule = Math.ceil(directCourse.quests.length / 4);
        const directModules: Module[] = [
          {
            id: `${directCourse.id}-mod-1`,
            title: `${directCourse.title} — Stage 1: Zero Basics & Syntax`,
            desc: `Fundamental syntax, variables, terminal I/O, and control flow for ${directCourse.title}.`,
            difficulty: 'Beginner',
            estimatedWeeks: 1,
            quests: directCourse.quests.slice(0, questsPerModule) as Quest[]
          },
          {
            id: `${directCourse.id}-mod-2`,
            title: `${directCourse.title} — Stage 2: Methods & Data Structures`,
            desc: `Methods, 1D & 2D arrays, string immutability, and algorithmic search.`,
            difficulty: 'Intermediate',
            estimatedWeeks: 1,
            quests: directCourse.quests.slice(questsPerModule, questsPerModule * 2) as Quest[]
          },
          {
            id: `${directCourse.id}-mod-3`,
            title: `${directCourse.title} — Stage 3: Object-Oriented Architecture`,
            desc: `Classes, constructors, encapsulation, inheritance, polymorphism, and interfaces.`,
            difficulty: 'Intermediate',
            estimatedWeeks: 1,
            quests: directCourse.quests.slice(questsPerModule * 2, questsPerModule * 3) as Quest[]
          },
          {
            id: `${directCourse.id}-mod-4`,
            title: `${directCourse.title} — Stage 4: Enterprise Systems & Capstone`,
            desc: `Exceptions, collections framework, multi-threading, file persistence, and capstone project.`,
            difficulty: 'Advanced',
            estimatedWeeks: 1,
            quests: directCourse.quests.slice(questsPerModule * 3) as Quest[]
          }
        ];
        setModules(directModules);
        if (!roadmapGenerated) setRoadmapGenerated(true);
        return;
      }
    }

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
  }, [userId, activeCourseId, activeSubTab, selectedStandaloneCourseId, learningPathMode, activeExtraId, extraRoadmaps, roadmapGenerated, setRoadmapGenerated, currentRole, qt1, qt2, archetype, COURSES_REGISTRY]);

  useEffect(() => {
    loadModules();
  }, [loadModules]);

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

  const activeCourse = COURSES_REGISTRY.find(c => c.id === activeCourseId) || COURSES_REGISTRY[0];
  const allQuestsInModule = modules.flatMap(m => (m.quests || []));
  const nextUncompletedQuest = allQuestsInModule.find(q => !completedQuests.includes(q.id)) || allQuestsInModule[0];
  const activeCourseCompletedCount = allQuestsInModule.filter(q => completedQuests.includes(q.id)).length;
  const activeCourseProgressPct = allQuestsInModule.length > 0 
    ? Math.round((activeCourseCompletedCount / allQuestsInModule.length) * 100)
    : 0;

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

  const totalRoadmapDays = onboardingAnswers?.roadmapDurationDays || trajectory.targetTotalDays || 30;
  const daysRemaining = Math.max(1, Math.ceil(totalRoadmapDays * (1 - (activeCourseProgressPct / 100))));

  const handleLaunchQuest = async (quest: Quest, courseIdTarget?: string) => {
    if (courseIdTarget && courseIdTarget !== activeCourseId) {
      setActiveCourseId(courseIdTarget);
    }

    const isCompleted = completedQuests.includes(quest.id);
    const initiated = onboardingAnswers?.initiatedQuests || [];
    const isInitiated = initiated.includes(quest.id);

    if (!isCompleted && !isInitiated) {
      if (isDailyLimitReached) {
        toast.warning('Daily Limit Reached ⏳', 'You have completed the maximum 3 quests for this course today. Come back tomorrow or explore other skill paths!');
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

  return {
    router,
    userId,
    userName,
    cOS,
    pinsHistory,
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
    activeCourseIds,
    setActiveCourseIds,
    switchActiveCourse,
    archiveActiveCourse,
    generateFusedRoadmap,
    careerScore,
    trustScore,
    modules,
    setModules,
    coursesRegistry,
    COURSES_REGISTRY,
    showCourseLibrary,
    setShowCourseLibrary,
    showFullJourneyModal,
    setShowFullJourneyModal,
    activeGateModalNode,
    setActiveGateModalNode,
    historyFilter,
    setHistoryFilter,
    showEnglishDashboard,
    setShowEnglishDashboard,
    activeSubTab,
    setActiveSubTab,
    handleSubTabChange,
    selectedCertTrackId,
    setSelectedCertTrackId,
    showPassportDetails,
    setShowPassportDetails,
    passportView,
    setPassportView,
    passportSelectedCompId,
    setPassportSelectedCompId,
    passportSelectedProgramId,
    setPassportSelectedProgramId,
    masteryMap,
    roleReadiness,
    showQrModal,
    setShowQrModal,
    copiedPassportLink,
    setCopiedPassportLink,
    isPlacementPrepFastTrack,
    setIsPlacementPrepFastTrack,
    getPassportStatusBadge,
    learningPathMode,
    setLearningPathMode,
    selectedStandaloneCourseId,
    setSelectedStandaloneCourseId,
    extraRoadmaps,
    tabsReady,
    notesModalState,
    setNotesModalState,
    showRoadmapModal,
    setShowRoadmapModal,
    selectedDuration,
    setSelectedDuration,
    selectedPace,
    setSelectedPace,
    selectedTrack,
    setSelectedTrack,
    customGoal,
    setCustomGoal,
    isGeneratingRoadmap,
    generationStep,
    handleCreateCustomRoadmap,
    trajectory,
    closeExtraRoadmap,
    activeCourse,
    allQuestsInModule,
    nextUncompletedQuest,
    activeCourseCompletedCount,
    activeCourseProgressPct,
    overallTrajectoryPct,
    daysRemaining,
    handleLaunchQuest,
    handleSelectCourseFromLibrary,
    isDailyLimitReached,
    roadmapGenerated,
    setRoadmapGenerated,
    fusedCourseRef,
    qt1,
    qt2,
    archetype
  };
}
