'use client';
import { useState, useEffect, useRef, Suspense } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { useCareerOS } from '@/lib/context/CareerOSContext';
import { toast } from '@/lib/store/useAppStore';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import PinsGate from '@/components/pins/PinsGate';
import Link from 'next/link';

interface Path { 
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

interface Simulation { 
  current_trajectory: string; 
  paths: Path[]; 
  startup_founder_fit: number; 
  mba_suitability: number; 
  global_readiness: number; 
  top_recommendation: string; 
  urgent_actions: string[]; 
}

interface QuestStage {
  title: string;
  desc: string;
  href: string;
  icon: string;
  isComplete: (cOS: any) => boolean;
}

interface Quest {
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

const QUESTS: Quest[] = [
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

const getOnboardingQuestions = (teacherName: string) => [
  { id: 'role', q: `Hi! I'm ${teacherName}, your AI Career Companion. What is your ultimate target role? (e.g. AI Engineer, Software Architect, Product Manager, UI Designer)`, placeholder: "e.g. AI Engineer at a high-scale startup..." },
  { id: 'education', q: "Awesome target! What is your current education level / college degree?", placeholder: "e.g. BCA 2nd Year, NIT CSE Graduate..." },
  { id: 'skills', q: "Got it. What are your current programming languages, frameworks, or skills?", placeholder: "e.g. React, JavaScript, basics of Python..." },
  { id: 'experience', q: "Any notable certificates, personal projects, or internships you have worked on?", placeholder: "e.g. Built a basic portfolio website, AWS certificate..." }
];

function LearningPageInner() {
  const { user } = useAuth();
  const cOS = useCareerOS();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Page level tabs: 'mistakes' | 'roadmap' | 'twin' | 'gaps'
  const [activeTab, setActiveTab] = useState<'mistakes' | 'roadmap' | 'twin' | 'gaps'>('mistakes');
  const [activeRole, setActiveRole] = useState<'student' | 'faculty'>('student');
  const [activeStep, setActiveStep] = useState<number>(0);

  // Read URL search param 'tab' to initialize sub-tab
  useEffect(() => {
    const tabParam = searchParams.get('tab') as any;
    const validTabs = ['mistakes', 'roadmap', 'twin', 'gaps'];
    if (tabParam && validTabs.includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const handleTabChange = (nextTab: typeof activeTab) => {
    setActiveTab(nextTab);
    router.replace(`/learning?tab=${nextTab}`);
  };

  // Set default switch based on auth role
  useEffect(() => {
    if (['teacher', 'faculty'].includes(user?.role || '')) {
      setActiveRole('faculty');
    }
  }, [user]);

  // Mistakes tracker database sync
  const { onboardingAnswers, setOnboarding, jdMissingSkills } = cOS;
  const [mistakes, setMistakes] = useState<any[]>([]);

  useEffect(() => {
    if (onboardingAnswers?.learning_mistakes) {
      setMistakes(onboardingAnswers.learning_mistakes);
    } else if (onboardingAnswers?.hasCompleted) {
      // Seed default database mistakes if they don't exist yet
      const seedMistakes = [
        { id: 'm1', type: 'Mission', module: 'Database Design', description: 'Incorrect fallback logic in database index schema. Rajesh pushed a direct override bypass check without unit validations.', timestamp: 'Yesterday' },
        { id: 'm2', type: 'Quest', module: 'Array Operations', description: 'ArraySum out-of-bounds compiler error on Day 3 arrays quest.', timestamp: '2 days ago' },
        { id: 'm3', type: 'AI Interview', module: 'Systems Design', description: 'Used multiple filler words ("basically", "actually") and gave a weak explanation of database sharding in Round 3.', timestamp: '3 days ago' },
        { id: 'm4', type: 'GD Practice', module: 'Architecture Debate', description: 'Weak counter-argumentation on event-driven architectures under pressure from Ms. Priya.', timestamp: 'Yesterday' }
      ];
      setMistakes(seedMistakes);
      
      const nextAnswers = {
        ...onboardingAnswers,
        learning_mistakes: seedMistakes
      };
      api.post('/api/auth/onboarding', { onboardingAnswers: nextAnswers }).catch(() => {});
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
    enabled: activeRole === 'faculty'
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
          { sender: 'ai', text: "Analyzing your data... constructing your Digital Career Twin and Roadmap blueprint!" }
        ]);
        setSimulating(true);
        const t3 = setTimeout(() => {
          setOnboardingComplete(true);
          setOnboarding({
            role: updatedAnswers.role || '',
            education: updatedAnswers.education || '',
            skills: updatedAnswers.skills || '',
            experience: updatedAnswers.experience || '',
          });
          setSimulating(false);
          toast.success('Simulation Complete!', 'Digital Career Twin loaded successfully.');
        }, 2000);
        onboardingTimersRef.current.push(t3);
      }, 700);
      onboardingTimersRef.current.push(t2);
    }
  }

  const baseMissingSkills = (jdMissingSkills?.length || 0) > 0 
    ? jdMissingSkills 
    : ['Python Basics', 'Machine Learning Algorithms', 'System Design Fundamentals', 'PostgreSQL Datastore', 'Behavioral Interview STAR method'];

  // Roadmap list
  const roadmapSteps = [
    { label: '1. Missing Skills', desc: 'Identify gaps using Career DNA assessments.', details: 'Dynamic Programming, Secure WebSockets, Event-Driven Architectures.' },
    { label: '2. Recommended Quests', desc: 'Acquire syntax and theoretical skills.', details: 'Quest 19: Matrix Chain Multiplication, Quest 24: WS Handshakes.' },
    { label: '3. Mock Interviews', desc: 'Practice communicating your ideas.', details: 'AI Interview: Systems Design Round 3 (Event-Driven preset).' },
    { label: '4. Practice Projects', desc: 'Build and verify real-world systems.', details: 'Sponsored Project: Zero-Knowledge database connector.' },
    { label: '5. Industry Certifications', desc: 'Earn verified industry credentials.', details: 'AWS Certified Solutions Architect, Google Advanced DSA.' },
    { label: '6. Corporate Placement', desc: 'Submit profile directly to matching jobs.', details: 'SDE position matching at Stripe, Datadog.' }
  ];

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

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', paddingBottom: 60 }} className="animate-fade-in">
      
      {/* Header */}
      <div className="page-header" style={{ marginBottom: 20, display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 900, letterSpacing: '-0.5px', marginBottom: 4 }}>
            📖 Learning Roadmap & Digital Career Twin
          </h1>
          <p style={{ color: 'var(--t2)', fontSize: 13.5, margin: 0 }}>
            {activeRole === 'student' && "Continuous personalized path to placement derived dynamically from your Career DNA and learning logs."}
            {activeRole === 'faculty' && "Monitor students struggling with specific curriculum modules and prescribe custom tasks."}
          </p>
        </div>

        {/* Switcher */}
        <div style={{ display: 'flex', gap: 6, background: 'var(--bg3)', padding: 4, borderRadius: 10, border: '1px solid var(--border)' }}>
          {[
            { id: 'student', label: '🧑‍🎓 Student Portal' },
            { id: 'faculty', label: '👩‍🏫 Faculty Desk' }
          ].map(role => (
            <button
              key={role.id}
              onClick={() => setActiveRole(role.id as any)}
              style={{
                padding: '6px 12px',
                borderRadius: 8,
                border: 'none',
                background: activeRole === role.id ? 'var(--accent)' : 'transparent',
                color: activeRole === role.id ? '#fff' : 'var(--t2)',
                fontSize: 11.5,
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {role.label}
            </button>
          ))}
        </div>
      </div>

      {activeRole === 'student' ? (
        <div>
          {/* Sub-tabs switch */}
          <div style={{ display: 'flex', gap: 4, background: 'var(--bg3)', padding: 4, borderRadius: 12, border: '1px solid var(--border)', width: 'fit-content', marginBottom: 24 }}>
            {[
              { id: 'mistakes', label: '⚠️ Mistakes & Remediation' },
              { id: 'roadmap', label: '📖 Growth Roadmap' },
              { id: 'twin', label: '🧬 Career Twin Simulator' },
              { id: 'gaps', label: '🎯 Curriculum Gaps' }
            ].map(t => (
              <button
                key={t.id}
                onClick={() => handleTabChange(t.id as any)}
                style={{
                  padding: '8px 18px',
                  border: 'none',
                  borderRadius: 8,
                  fontSize: 12.5,
                  fontWeight: 800,
                  cursor: 'pointer',
                  background: activeTab === t.id ? 'var(--bg2)' : 'transparent',
                  color: activeTab === t.id ? 'var(--accent)' : 'var(--t3)',
                  transition: 'all 0.15s'
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Tab 1: Mistakes & Remediation */}
          {activeTab === 'mistakes' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 20, alignItems: 'start' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={card}>
                  <div style={cardLabel}>⚠️ Fused Learning Mistakes Tracker</div>
                  <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', background: 'var(--accent-light)', border: '1px solid var(--accent)', padding: 16, borderRadius: 12, marginBottom: 16 }}>
                    <span style={{ fontSize: 24 }}>💡</span>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 13.5, color: 'var(--accent)', marginBottom: 4 }}>Why do we collect mistake data?</div>
                      <p style={{ fontSize: 12.5, color: 'var(--t2)', lineHeight: 1.5, margin: 0 }}>
                        Locating where and why you hit failure modes in Quests, Daily Missions, AI Interviews, and GD rooms helps our Socratic Engine compile targeted remedial modules. Fixing active blind spots is the fastest path to bridging your skill gaps.
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {mistakes.length === 0 ? (
                      <div style={{ padding: 24, textAlign: 'center', color: 'var(--t3)', fontSize: 13, border: '1px dashed var(--border)', borderRadius: 12 }}>
                        ✓ No active mistakes detected. Excellent work!
                      </div>
                    ) : (
                      mistakes.map(m => (
                        <div key={m.id} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 12, padding: 14 }}>
                          <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                            <div>
                              <span style={{ fontSize: 10.5, fontWeight: 800, background: 'var(--coral-light)', color: 'var(--coral)', padding: '2px 8px', borderRadius: 4, marginRight: 8 }}>{m.type}</span>
                              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--t3)', fontFamily: 'var(--font-mono)' }}>{m.module}</span>
                            </div>
                            <span style={{ fontSize: 10.5, color: 'var(--t3)' }}>{m.timestamp}</span>
                          </div>
                          <p style={{ fontSize: 12.5, color: 'var(--t2)', margin: '0 0 12px 0', lineHeight: 1.5 }}>{m.description}</p>
                          <button
                            onClick={() => clearMistake(m.id)}
                            style={{ padding: '6px 12px', fontSize: 11, fontWeight: 800, background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--accent)', cursor: 'pointer' }}
                          >
                            Resolve Gap
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={card}>
                  <div style={cardLabel}>🛡️ AI Fused Remedial Plan</div>
                  <p style={{ fontSize: 12.5, color: 'var(--t2)', lineHeight: 1.5, marginBottom: 16 }}>
                    Based on your accumulated performance errors, the AI has compiled the following custom plan to guide your revision:
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {[
                      { title: '1. Resolve Database Fallbacks', details: 'Prescribed code practice exercises for transactional exception blocks.' },
                      { title: '2. Practice Array Limits', details: 'Run compiler test sandboxes checking boundary constraints.' },
                      { title: '3. System Sharding Mock Interview', details: 'AI mock interview with Mr. Vikram covering horizontal db partitioning.' }
                    ].map((step, idx) => (
                      <div key={idx} style={{ background: 'var(--bg3)', padding: 12, borderRadius: 10, border: '1px solid var(--border)' }}>
                        <div style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--accent)', marginBottom: 4 }}>{step.title}</div>
                        <p style={{ fontSize: 11.5, color: 'var(--t3)', margin: 0 }}>{step.details}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Growth Roadmap */}
          {activeTab === 'roadmap' && (
            <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: 20, alignItems: 'start' }}>
              <div style={card}>
                <div style={cardLabel}>Recommended Growth Roadmap Pathway</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 10 }}>
                  {roadmapSteps.map((step, idx) => {
                    const isActive = activeStep === idx;
                    return (
                      <div
                        key={step.label}
                        onClick={() => setActiveStep(idx)}
                        style={{
                          display: 'flex', gap: 12, alignItems: 'flex-start',
                          background: isActive ? 'var(--accent-light)' : 'var(--bg3)',
                          border: `1.5px solid ${isActive ? 'var(--accent)' : 'var(--border)'}`,
                          borderRadius: 12, padding: 12, cursor: 'pointer', transition: 'all 0.2s'
                        }}
                      >
                        <div style={{
                          width: 22, height: 22, borderRadius: '50%',
                          background: isActive ? 'var(--accent)' : 'var(--bg2)',
                          color: isActive ? '#fff' : 'var(--t3)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 11, fontWeight: 900, border: '1px solid var(--border)', flexShrink: 0
                        }}>
                          {idx + 1}
                        </div>
                        <div style={{ flex: 1 }}>
                          <h4 style={{ margin: '0 0 2px 0', fontSize: 13, fontWeight: 800, color: isActive ? 'var(--accent)' : 'var(--t1)' }}>{step.label}</h4>
                          <div style={{ fontSize: 11.5, color: 'var(--t2)' }}>{step.desc}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={card}>
                <div style={cardLabel}>Active Step Details</div>
                <h3 style={{ margin: '0 0 8px 0', fontSize: 16, fontWeight: 950 }}>{roadmapSteps[activeStep].label}</h3>
                <p style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.5, marginBottom: 16 }}>{roadmapSteps[activeStep].desc}</p>
                <div style={{ background: 'var(--bg3)', padding: 16, borderRadius: 12, border: '1px solid var(--border)', fontSize: 13 }}>
                  🎯 <strong>Remedial Recommendation</strong>: {roadmapSteps[activeStep].details}
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Career Twin Simulator */}
          {activeTab === 'twin' && (
            <div>
              {!onboardingComplete ? (
                <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 20, display: 'flex', flexDirection: 'column', height: 440, overflow: 'hidden' }}>
                  <div style={{ padding: '12px 18px', borderBottom: '1px solid var(--border)', background: 'linear-gradient(135deg, var(--accent), var(--purple))', color: 'white', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 20 }}>{teacher.emoji}</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>{teacher.name}</div>
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)' }}>AI Career Companion</div>
                    </div>
                  </div>

                  <div style={{ flex: 1, padding: 18, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12, background: 'var(--bg)' }}>
                    {chatHistory.map((msg, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: msg.sender === 'ai' ? 'flex-start' : 'flex-end' }}>
                        <div style={{
                          maxWidth: '80%', padding: '10px 14px', borderRadius: 12, fontSize: 13, lineHeight: 1.5,
                          background: msg.sender === 'ai' ? 'var(--card)' : 'var(--accent)',
                          color: msg.sender === 'ai' ? 'var(--t1)' : 'white',
                          border: msg.sender === 'ai' ? '1px solid var(--border)' : 'none'
                        }}>
                          {msg.text}
                        </div>
                      </div>
                    ))}
                    {simulating && (
                      <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', padding: '10px 14px', borderRadius: 12, fontSize: 12.5, color: 'var(--accent)' }}>
                          ⚡ Simulating digital twin trajectory...
                        </div>
                      </div>
                    )}
                    <div ref={chatBottomRef} />
                  </div>

                  <div style={{ padding: '12px 16px', background: 'var(--bg2)', borderTop: '1px solid var(--border)', display: 'flex', gap: 10 }}>
                    <input
                      type="text"
                      value={inputVal}
                      onChange={e => setInputVal(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleSendAnswer()}
                      placeholder={ONBOARDING_QUESTIONS[step]?.placeholder || "Type your response..."}
                      style={{ flex: 1, padding: '8px 14px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--t1)', fontSize: 12.5 }}
                    />
                    <button onClick={handleSendAnswer} className="btn-primary" style={{ padding: '8px 18px', fontSize: 12 }}>Send →</button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--t3)' }}>Digital Career Twin Projections:</span>
                    <button onClick={() => setOnboardingComplete(false)} style={{ padding: '6px 12px', fontSize: 11, fontWeight: 800, background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--accent)', cursor: 'pointer' }}>Re-Simulate Twin</button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 20 }}>
                    <div style={{ background: 'linear-gradient(135deg, rgba(79,70,229,0.05), rgba(6,182,212,0.03))', border: '1px solid rgba(79,70,229,0.2)', borderRadius: 20, padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>🚀 Career OS Blueprint</div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
                        {[
                          { label: 'Target Role', value: onboardingAnswers?.role || 'SDE-1 Developer', color: 'var(--t1)' },
                          { label: 'Expected Salary', value: twinData?.simulation?.paths?.[selectedTwinPath]?.salary_range || '₹18 - 25 LPA', color: 'var(--green)' },
                          { label: 'Current Level', value: 'Explorer Level 1', color: 'var(--accent)' },
                          { label: 'Time Required', value: twinData?.simulation?.paths?.[selectedTwinPath]?.timeline || '8 - 12 Months', color: 'var(--purple)' }
                        ].map(card => (
                          <div key={card.label} style={{ background: 'var(--bg2)', padding: '12px', borderRadius: 12, border: '1px solid var(--border)' }}>
                            <div style={{ fontSize: 10, color: 'var(--t3)', marginBottom: 2 }}>{card.label}</div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: card.color }}>{card.value}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div style={card}>
                      <div style={cardLabel}>📈 Simulated Trajectory Fit</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {[
                          { label: 'Startup Founder Fit', score: twinData?.simulation?.startup_founder_fit || 82, color: 'var(--coral)' },
                          { label: 'Corporate Readiness', score: twinData?.simulation?.paths?.[selectedTwinPath]?.fit_score || 71, color: 'var(--purple)' },
                          { label: 'Global Opportunities Prep', score: twinData?.simulation?.global_readiness || 65, color: 'var(--teal)' }
                        ].map(f => (
                          <div key={f.label}>
                            <div style={{ display: 'flex', fontSize: 11.5, color: 'var(--t2)', marginBottom: 3, justifyContent: 'space-between' }}>
                              <span>{f.label}</span>
                              <span style={{ fontWeight: 700, color: f.color }}>{f.score}%</span>
                            </div>
                            <div style={{ height: 6, background: 'var(--bg3)', borderRadius: 3, overflow: 'hidden' }}>
                              <div style={{ height: '100%', width: `${f.score}%`, background: f.color }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--t3)', fontFamily: 'var(--font-mono)', marginBottom: 14, display: 'block' }}>🏆 Paths Simulation Directory</span>
                    <div style={{ display: 'flex', gap: 10, margin: '10px 0', flexWrap: 'wrap' }}>
                      {twinData?.simulation?.paths?.map((p, idx) => (
                        <button key={idx} onClick={() => setSelectedTwinPath(idx)} style={{
                          flex: 1, minWidth: 200, padding: 16, borderRadius: 16, border: `1.5px solid ${selectedTwinPath === idx ? 'var(--accent)' : 'var(--border)'}`,
                          background: selectedTwinPath === idx ? 'rgba(79,70,229,0.06)' : 'var(--bg2)',
                          cursor: 'pointer', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 4, transition: 'all 0.15s'
                        }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: selectedTwinPath === idx ? 'var(--accent)' : 'var(--t1)' }}>{p.name}</div>
                          <div style={{ fontSize: 10.5, color: 'var(--t3)', fontFamily: 'var(--font-mono)' }}>{p.probability}% Prob · {p.timeline}</div>
                          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--green)', marginTop: 2 }}>{p.salary_range}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--t3)', fontFamily: 'var(--font-mono)', marginBottom: 14, display: 'block' }}>🏆 Active Career Quests</span>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
                      {QUESTS.map(quest => {
                        const stageResults = quest.stages.map((s, i) => ({
                          ...s,
                          index: i + 1,
                          completed: s.isComplete(cOS),
                        }));
                        const completedCount = stageResults.filter(s => s.completed).length;
                        const pct = Math.round((completedCount / quest.stages.length) * 100);
                        const currentStageIdx = stageResults.findIndex(s => !s.completed);

                        return (
                          <div key={quest.id} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 20, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ background: `linear-gradient(135deg, ${quest.color}14, var(--bg3))`, borderBottom: '1px solid var(--border)', padding: '16px 18px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                                <div style={{ width: 38, height: 38, borderRadius: 10, background: `${quest.color}22`, border: `1px solid ${quest.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>{quest.icon}</div>
                                <div>
                                  <h3 style={{ fontSize: 14.5, fontWeight: 800, color: 'var(--t1)', margin: 0 }}>{quest.title}</h3>
                                  <span style={{ fontSize: 10.5, color: 'var(--t3)' }}>{quest.subtitle}</span>
                                </div>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div style={{ flex: 1, height: 5, background: 'var(--bg2)', borderRadius: 3, overflow: 'hidden' }}>
                                  <div style={{ height: '100%', width: `${pct}%`, background: quest.color }} />
                                </div>
                                <span style={{ fontSize: 10, color: quest.color, fontWeight: 700 }}>{completedCount}/{quest.stages.length} Stgs</span>
                              </div>
                            </div>

                            <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
                              {stageResults.map((s) => (
                                <div key={s.index} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', borderRadius: 6, background: s.completed ? 'var(--bg3)' : s.index === currentStageIdx + 1 ? `${quest.color}0d` : 'transparent' }}>
                                  <span style={{ fontSize: 12 }}>{s.icon}</span>
                                  <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: 11.5, fontWeight: s.index === currentStageIdx + 1 ? 700 : 500, color: s.completed ? 'var(--t3)' : 'var(--t1)' }}>Stg {s.index}: {s.title}</div>
                                  </div>
                                  {s.completed ? (
                                    <span style={{ fontSize: 9.5, color: 'var(--green)', fontWeight: 700 }}>✓ Done</span>
                                  ) : s.index === currentStageIdx + 1 ? (
                                    <Link href={s.href} style={{ fontSize: 10, color: quest.color, textDecoration: 'none', padding: '3px 8px', background: `${quest.color}18`, borderRadius: 4, fontWeight: 700 }}>Start ➔</Link>
                                  ) : (
                                    <span style={{ fontSize: 10, color: 'var(--t4)' }}>🔒 Locked</span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 4: Curriculum Gaps */}
          {activeTab === 'gaps' && (
            <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: 20, alignItems: 'start' }}>
              <div style={card}>
                <div style={cardLabel}>🧬 Career DNA Gaps Feed</div>
                <p style={{ fontSize: 11.5, color: 'var(--t3)', marginBottom: 12 }}>
                  Dynamic assessments have identified the following missing skills in your portfolio matches:
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {missingSkills.map(skill => (
                    <div key={skill.name} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: 12 }}>
                      <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                        <span style={{ fontSize: 13, fontWeight: 700 }}>{skill.name}</span>
                        <span style={{
                          fontSize: 9.5, fontWeight: 800,
                          background: skill.severity === 'High' ? 'var(--coral-light)' : 'var(--amber-light)',
                          color: skill.severity === 'High' ? 'var(--coral)' : 'var(--amber)',
                          padding: '2px 6px', borderRadius: 4
                        }}>{skill.severity} Priority</span>
                      </div>
                      <p style={{ fontSize: 11.5, color: 'var(--t3)', margin: 0 }}>{skill.reason}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div style={card}>
                <div style={cardLabel}>Real Time JD Gap Analysis</div>
                <div style={{ background: 'var(--bg3)', borderRadius: 14, padding: 16, marginBottom: 16 }}>
                  <div style={{ color: 'var(--coral)', fontWeight: 700, fontSize: 12, marginBottom: 8 }}>⚠️ Urgent Missing Skills (Close these first)</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {baseMissingSkills.map(skill => (
                      <span key={skill} style={{ fontSize: 11, padding: '4px 10px', borderRadius: 20, background: 'var(--coral-light)', color: 'var(--coral)', border: '1px solid rgba(220,38,38,0.15)', fontWeight: 600 }}>{skill}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      ) : (
        // ── FACULTY DESK ──
        <div style={card}>
          <div style={cardLabel}>Students Requiring Learning Intervention</div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
            <thead>
              <tr style={{ background: 'var(--bg3)' }}>
                {['Student Name', 'Class Section', 'Identified Gaps', 'Roadmap Step', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: 'var(--t3)', fontSize: 11, fontWeight: 700, borderBottom: '1px solid var(--border)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {studentsList.map(student => (
                <tr key={student.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '14px', fontWeight: 800 }}>{student.displayName}</td>
                  <td style={{ padding: '14px', color: 'var(--t2)' }}>CS-3A</td>
                  <td style={{ padding: '14px' }}>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {['Dynamic Programming', 'Systems Design'].map(s => (
                        <span key={s} style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: 'var(--coral-light)', color: 'var(--coral)' }}>{s}</span>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: '14px', fontWeight: 600, color: 'var(--accent)' }}>Recommended Quests</td>
                  <td style={{ padding: '14px' }}>
                    <button
                      onClick={() => prescribeQuest(student.displayName)}
                      style={{ padding: '6px 12px', fontSize: 11, fontWeight: 800, background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}
                    >
                      Prescribe Quest
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function LearningPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, color: 'var(--t2)', fontSize: 13 }}>Loading Learning Hub...</div>}>
      <LearningPageInner />
    </Suspense>
  );
}

const card: React.CSSProperties = {
  background: 'var(--bg2)', border: '1px solid var(--border)',
  borderRadius: 'var(--radius-xl)', padding: 20, boxShadow: 'var(--shadow-sm)'
};
const cardLabel: React.CSSProperties = {
  fontSize: 10.5, letterSpacing: '0.8px', textTransform: 'uppercase',
  color: 'var(--t3)', fontFamily: 'var(--font-mono)', fontWeight: 600,
  marginBottom: 14, display: 'block'
};
