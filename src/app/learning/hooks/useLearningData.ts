'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { useCareerOS } from '@/lib/context/CareerOSContext';
import { toast } from '@/lib/store/useAppStore';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';

export interface Path { 
  name: string; 
  probability: number; 
  role: string; 
  salary_range: string; 
  timeline: string; 
  requirements: string[]; 
  fit_score: number; 
  risk: string; 
  milestones: Array<{ month: number; milestone: string }>; 
}

export interface Simulation { 
  current_trajectory: string; 
  paths: Path[]; 
  startup_founder_fit: number; 
  mba_suitability: number; 
  global_readiness: number; 
  top_recommendation: string; 
  urgent_actions: string[]; 
}

export interface QuestStage {
  title: string;
  desc: string;
  href: string;
  icon: string;
  isComplete: (cOS: any) => boolean;
}

export interface Quest {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  reward: {
    badge: string;
    xp: number;
    boost: string;
  };
  stages: QuestStage[];
}

export const QUESTS: Quest[] = [
  {
    id: 'frontend_dev',
    title: 'Frontend Developer Quest',
    subtitle: 'Master responsive scale systems and UI deployment',
    icon: '</>',
    color: 'var(--accent)',
    reward: { badge: '"Frontend Pro" Badge', xp: 2000, boost: 'Get featured to top recruiters' },
    stages: [
      { title: 'Resume Optimisation',   desc: 'Get your resume ATS score above 60.',             href: '/resume', icon: '📄', isComplete: cOS => cOS?.vaultItems?.some((itm: any) => itm.used_in_resume) ?? false },
      { title: 'React Challenge',       desc: 'Complete React Fundamentals mission.',           href: '/missions', icon: '⚛',  isComplete: cOS => cOS?.completedMissions?.includes('react_loops') ?? false },
      { title: 'Mock STAR Interview',   desc: 'Practice with AI and complete STAR preparation.', href: '/missions', icon: '🎙', isComplete: cOS => cOS?.completedMissions?.includes('star_video') ?? false },
      { title: 'Portfolio Upload',      desc: 'Deploy living portfolio website.',                href: '/profile?tab=portfolio', icon: '🚀', isComplete: cOS => cOS?.vaultItems?.some((itm: any) => itm.used_in_portfolio) ?? false },
      { title: 'Evidence In Vault',     desc: 'Upload at least 3 assets to Vault.',              href: '/vault',        icon: '📁', isComplete: cOS => (cOS?.vaultItems?.length || 0) >= 3 },
      { title: 'Recruiter Simulation',  desc: 'Raise Career Score above 70.',                    href: '/dashboard',    icon: '🧬', isComplete: cOS => (cOS?.careerScore || 0) >= 70 },
    ],
  },
  {
    id: 'data_scientist',
    title: 'Data Scientist Quest',
    subtitle: 'Master the data stack and land your first data role',
    icon: '📊',
    color: 'var(--teal)',
    reward: { badge: '"Data Pro" Badge', xp: 2200, boost: 'Priority visibility to data recruiters' },
    stages: [
      { title: 'Resume Optimisation',  desc: 'Generate career assets with AI.',                href: '/resume', icon: '📄', isComplete: cOS => cOS?.vaultItems?.some((itm: any) => itm.used_in_resume) ?? false },
      { title: 'Python Foundation',    desc: 'Pass the Python Fundamentals mission.',          href: '/missions',     icon: '🐍', isComplete: cOS => cOS?.completedMissions?.includes('python_loops') ?? false },
      { title: 'SQL Mastery',          desc: 'Upload evidence of database projects.',          href: '/vault',        icon: '🗄', isComplete: cOS => cOS?.vaultItems?.some((itm: any) => itm.skill_tags?.some((s: string) => s.toLowerCase().includes('sql') || s.toLowerCase().includes('database'))) ?? false },
      { title: 'Data Vault',           desc: 'Upload a data project to your Vault.',           href: '/vault',        icon: '📁', isComplete: cOS => (cOS?.vaultItems?.length || 0) >= 2 },
    ],
  },
];

export const getOnboardingQuestions = (teacherName: string) => [
  { id: 'role', q: `Hi! I'm ${teacherName}, your AI Career Companion. What is your ultimate target role? (e.g. AI Engineer, Software Architect, Product Manager, UI Designer)`, placeholder: "e.g. AI Engineer at a high-scale startup..." },
  { id: 'education', q: "Awesome target! What is your current education level / college degree?", placeholder: "e.g. BCA 2nd Year, NIT CSE Graduate..." },
  { id: 'skills', q: "Got it. What are your current programming languages, frameworks, or skills?", placeholder: "e.g. React, JavaScript, basics of Python..." },
  { id: 'experience', q: "Any notable certificates, personal projects, or internships you have worked on?", placeholder: "e.g. Built a basic portfolio website, AWS certificate..." }
];

export const ROADMAP_STEPS = [
  { label: '1. Missing Skills', desc: 'Identify gaps using Career DNA assessments.', details: 'Dynamic Programming, Secure WebSockets, Event-Driven Architectures.' },
  { label: '2. Recommended Quests', desc: 'Acquire syntax and theoretical skills.', details: 'Quest 19: Matrix Chain Multiplication, Quest 24: WS Handshakes.' },
  { label: '3. Mock Interviews', desc: 'Practice communicating your ideas.', details: 'AI Interview: Systems Design Round 3 (Event-Driven preset).' },
  { label: '4. Practice Projects', desc: 'Build and verify real-world systems.', details: 'Sponsored Project: Zero-Knowledge database connector.' },
  { label: '5. Industry Certifications', desc: 'Earn verified industry credentials.', details: 'AWS Certified Solutions Architect, Google Advanced DSA.' },
  { label: '6. Corporate Placement', desc: 'Submit profile directly to matching jobs.', details: 'SDE position matching at Stripe, Datadog.' }
];

export function useLearningData() {
  const { user } = useAuth();
  const cOS = useCareerOS();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Page level tabs: 'mistakes' | 'roadmap' | 'twin' | 'gaps' | 'memory'
  const [activeTab, setActiveTab] = useState<'mistakes' | 'roadmap' | 'twin' | 'gaps' | 'memory'>('twin');
  const [activeRole, setActiveRole] = useState<'student' | 'faculty'>('student');
  const [activeStep, setActiveStep] = useState<number>(0);

  // Read URL search param 'tab' to initialize sub-tab
  useEffect(() => {
    const tabParam = searchParams.get('tab') as any;
    const validTabs = ['mistakes', 'roadmap', 'twin', 'gaps', 'memory'];
    if (tabParam && validTabs.includes(tabParam)) {
      console.log('[Learning Hub] Switching sub-tab from query param to:', tabParam);
      setActiveTab(tabParam);
    } else if (!tabParam) {
      console.log('[Learning Hub] Defaulting sub-tab to twin for Career Blueprint view');
      setActiveTab('twin');
    }
  }, [searchParams]);

  const handleTabChange = (nextTab: typeof activeTab) => {
    setActiveTab(nextTab);
    router.replace(`/learning?tab=${nextTab}`);
  };

  // Set default switch based on auth role
  useEffect(() => {
    if (['teacher', 'faculty', 'admin', 'superadmin'].includes(user?.role || '')) {
      setActiveRole('faculty');
    } else {
      setActiveRole('student');
    }
  }, [user]);

  const canAccessFaculty = ['teacher', 'faculty', 'admin', 'superadmin'].includes(user?.role || '');

  // Mistakes tracker database sync
  const { onboardingAnswers, setOnboarding, jdMissingSkills } = cOS;
  const [mistakes, setMistakes] = useState<any[]>([]);

  useEffect(() => {
    if (onboardingAnswers?.learning_mistakes) {
      setMistakes(onboardingAnswers.learning_mistakes);
    } else {
      setMistakes([]);
    }
  }, [onboardingAnswers]);

  // Dynamic missing skills calculated from the actual database weak_areas
  const weakAreas = Array.isArray(user?.weak_areas) ? user.weak_areas : ['System Design', 'DSA - Trees', 'Behavioral STAR'];
  const missingSkills = (weakAreas as string[]).map((area, idx) => ({
    name: area,
    reason: `Assessed as weak in compiler testing or mock interview case verification.`,
    severity: idx === 0 ? 'High' as const : 'Medium' as const
  }));

  // Fetch Career Twin projections from supabased endpoint
  const { data: twinData } = useQuery({
    queryKey: ['career_twin', 'results'],
    queryFn: () => api.get<{ simulation: Simulation }>('/api/career-twin/results'),
    enabled: !!onboardingAnswers?.hasCompleted
  });

  // Fetch support students for Faculty View from backend API
  const { data: teacherStudentsData } = useQuery({
    queryKey: ['teacher', 'students'],
    queryFn: () => api.get<{ students: any[] }>('/api/teacher/students'),
    enabled: canAccessFaculty && activeRole === 'faculty'
  });

  const studentsList = teacherStudentsData?.students || [];

  // Onboarding Chat Companion
  const onboardingTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const [onboardingComplete, setOnboardingComplete] = useState(!!onboardingAnswers?.hasCompleted);

  // Cleanup onboarding timeouts on unmount
  useEffect(() => {
    return () => {
      onboardingTimersRef.current.forEach(t => clearTimeout(t));
      onboardingTimersRef.current = [];
    };
  }, []);

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>((onboardingAnswers || {}) as unknown as Record<string, string>);
  const [inputVal, setInputVal] = useState('');
  
  const teacherId = user?.selectedTeacherId || 'priya';
  const teacher = {
    priya:  { name: 'Ms. Priya',  emoji: '👩‍💼' },
    aisha:  { name: 'Ms. Aisha',  emoji: '👩‍🏫' },
    rohan:  { name: 'Mr. Rohan',  emoji: '👨‍💻' },
    vikram: { name: 'Mr. Vikram', emoji: '👨‍⚖️' },
  }[teacherId] || { name: 'Ms. Priya', emoji: '👩‍💼' };

  const ONBOARDING_QUESTIONS = getOnboardingQuestions(teacher.name);
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'ai' | 'user'; text: string }>>([
    { sender: 'ai', text: `Hi! I'm ${teacher.name}, your AI Career Companion. What is your ultimate target role? (e.g. AI Engineer, Software Architect, Product Manager, UI Designer)` }
  ]);
  const [simulating, setSimulating] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const [selectedTwinPath, setSelectedTwinPath] = useState(0);

  function handleSendAnswer() {
    if (!inputVal.trim()) return;
    const currentQ = ONBOARDING_QUESTIONS[step];
    const updatedAnswers = { ...answers, [currentQ.id]: inputVal };
    setAnswers(updatedAnswers);
    
    const nextHistory = [
      ...chatHistory,
      { sender: 'user' as const, text: inputVal }
    ];
    setChatHistory(nextHistory);
    setInputVal('');

    if (step < ONBOARDING_QUESTIONS.length - 1) {
      const nextStep = step + 1;
      setStep(nextStep);
      const t1 = setTimeout(() => {
        setChatHistory(prev => [
          ...prev,
          { sender: 'ai', text: ONBOARDING_QUESTIONS[nextStep].q }
        ]);
      }, 700);
      onboardingTimersRef.current.push(t1);
    } else {
      const t2 = setTimeout(() => {
        setChatHistory(prev => [
          ...prev,
          { sender: 'ai', text: "Analyzing your competencies... constructing your Digital Career Twin blueprint!" }
        ]);
        setSimulating(true);

        api.post<{ simulation: Simulation }>('/api/career-twin/results', { answers: updatedAnswers })
          .then(() => {
            setOnboardingComplete(true);
            setOnboarding({
              role: updatedAnswers.role || '',
              education: updatedAnswers.education || '',
              skills: updatedAnswers.skills || '',
              experience: updatedAnswers.experience || '',
            });
            setSimulating(false);
            toast.success('Simulation Complete!', 'Digital Career Twin loaded successfully.');
          })
          .catch(() => {
            setOnboardingComplete(true);
            setOnboarding({
              role: updatedAnswers.role || '',
              education: updatedAnswers.education || '',
              skills: updatedAnswers.skills || '',
              experience: updatedAnswers.experience || '',
            });
            setSimulating(false);
            toast.success('Simulation Complete!', 'Digital Career Twin loaded.');
          });
      }, 700);
      onboardingTimersRef.current.push(t2);
    }
  }

  const baseMissingSkills = (jdMissingSkills?.length || 0) > 0 
    ? jdMissingSkills 
    : ['Python Basics', 'Machine Learning Algorithms', 'System Design Fundamentals', 'PostgreSQL Datastore', 'Behavioral Interview STAR method'];

  const prescribeQuest = (studentName: string) => {
    toast.success('Quest Prescribed', `Prescribed targeted remedial quests for ${studentName}.`);
  };

  const clearMistake = (id: string) => {
    const nextMistakes = mistakes.filter(m => m.id !== id);
    setMistakes(nextMistakes);
    const nextAnswers = {
      ...onboardingAnswers,
      learning_mistakes: nextMistakes
    };
    api.post('/api/auth/onboarding', { onboardingAnswers: nextAnswers })
      .then(() => {
        toast.success('Remedial Action Started', 'Compiling customized sandbox test cases to resolve this knowledge gap.');
      })
      .catch(() => {
        toast.error('Failed to sync changes.');
      });
  };

  return {
    user,
    cOS,
    activeTab,
    setActiveTab,
    handleTabChange,
    activeRole,
    setActiveRole,
    canAccessFaculty,
    activeStep,
    setActiveStep,
    mistakes,
    clearMistake,
    weakAreas,
    missingSkills,
    baseMissingSkills,
    twinData,
    studentsList,
    prescribeQuest,
    onboardingComplete,
    setOnboardingComplete,
    step,
    inputVal,
    setInputVal,
    teacher,
    ONBOARDING_QUESTIONS,
    chatHistory,
    simulating,
    chatBottomRef,
    selectedTwinPath,
    setSelectedTwinPath,
    handleSendAnswer,
    roadmapSteps: ROADMAP_STEPS,
    quests: QUESTS,
    onboardingAnswers
  };
}
