'use client';

import Link from 'next/link';
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { useCareerOS } from '@/lib/context/CareerOSContext';
import WhatToDoToday from '@/components/ui/WhatToDoToday';
import { QUESTS_REGISTRY } from '@/lib/data/questsData';

// Sub-components (extracted from monolith)
import DashboardHeaderHUD    from '@/components/student/dashboard/DashboardHeaderHUD';
import DashboardStatsRow     from '@/components/student/dashboard/DashboardStatsRow';
import DashboardBentoGrid    from '@/components/student/dashboard/DashboardBentoGrid';
import DashboardMissionsPanel from '@/components/student/dashboard/DashboardMissionsPanel';
import DashboardTrajectoryMap from '@/components/student/dashboard/DashboardTrajectoryMap';

// ── Tier definitions ────────────────────────────────────────────────────────
const TIERS = [
  { label: 'Explorer',        minDna: 0,  color: 'var(--accent)',  emoji: '🌱' },
  { label: 'Career Builder',  minDna: 20, color: 'var(--blue)',    emoji: '🔧' },
  { label: 'Interview Ready', minDna: 40, color: 'var(--teal)',    emoji: '🎯' },
  { label: 'Industry Ready',  minDna: 60, color: 'var(--purple)',  emoji: '⚡' },
  { label: 'Elite Candidate', minDna: 80, color: 'var(--green)',   emoji: '🏆' },
] as const;

function computeLevel(xp: number, careerScore: number) {
  let idx = 0;
  for (let i = TIERS.length - 1; i >= 0; i--) {
    if (careerScore >= TIERS[i].minDna) { idx = i; break; }
  }
  const current = TIERS[idx], next = TIERS[idx + 1] ?? null;
  const span   = next ? (next.minDna - current.minDna) : 100;
  const within = next ? Math.min(span, careerScore - current.minDna) : span;
  return {
    index: idx + 1,
    label: current.label,
    next:  next?.label ?? null,
    xp,
    xpToNext: next ? Math.max(0, (next.minDna - idx * 20) * 150) : 0,
    pct:   Math.round((within / span) * 100),
    color: current.color,
    emoji: current.emoji,
  };
}

// ── Evolution stages ────────────────────────────────────────────────────────
const EVOLUTION_STAGES = [
  { stage: 1, minScore: 0  },
  { stage: 2, minScore: 21 },
  { stage: 3, minScore: 41 },
  { stage: 4, minScore: 61 },
  { stage: 5, minScore: 81 },
];

// ── Scoped CSS (injected once, minimal) ─────────────────────────────────────
const DB_STYLES = `
  /* Page wrapper */
  .db-page { display:flex; flex-direction:column; gap:20px; max-width:1340px; margin:0 auto; padding:0 4px; }

  /* Glass card base */
  .db-glass {
    background: var(--dash-card);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid var(--dash-border);
    border-radius: 16px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.15);
    will-change: transform, border-color;
    transform: translateZ(0);
    backface-visibility: hidden;
    transition: transform 0.2s cubic-bezier(0.16,1,0.3,1), border-color 0.2s ease, box-shadow 0.2s ease;
    overflow: hidden;
    position: relative;
  }
  .db-glass:hover { border-color: var(--border2); transform: translateY(-2px) translateZ(0); box-shadow: 0 8px 30px rgba(0,0,0,0.25); }

  /* Section label */
  .db-label { font-size:8.5px; font-family:var(--font-mono); font-weight:800; text-transform:uppercase; letter-spacing:1.5px; color:var(--accent); display:block; }

  /* Animations */
  @keyframes hud-pulse { 0%,100% { opacity:0.4; } 50% { opacity:1; } }
  @keyframes hud-scan  { 0% { top:0; opacity:0; } 10% { opacity:1; } 90% { opacity:1; } 100% { top:100%; opacity:0; } }
  @keyframes spin      { to { transform:rotate(360deg); } }

  /* Theme tokens */
  :root {
    --dash-card:    rgba(10,14,23,0.45);
    --dash-border:  rgba(255,255,255,0.04);
    --dash-text:    var(--t1);
    --dash-subtext: var(--t2);
    --dash-banner:  linear-gradient(135deg,rgba(10,15,26,0.6),rgba(18,24,36,0.35));
  }
  :root.light,[data-theme='light'] {
    --dash-card:    rgba(255,255,255,0.9);
    --dash-border:  rgba(0,0,0,0.07);
    --dash-text:    #0f172a;
    --dash-subtext: #475569;
    --dash-banner:  linear-gradient(135deg,rgba(255,255,255,0.95),rgba(241,243,248,0.85));
  }

  /* Responsive: stack 3-col missions to 1-col on mobile */
  @media (max-width:768px) {
    .db-missions-grid { grid-template-columns: 1fr !important; }
  }
`;

// ── Main export ──────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { user } = useAuth();
  const router   = useRouter();
  const cOS      = useCareerOS();

  const {
    onboardingAnswers = {},
    vaultItems        = [],
    xp                = 0,
    completedQuests   = [],
    roadmapGenerated  = false,
    trustScore        = 70,
    careerScore       = 75,
    dnaScore          = 80,
    completedMissions = [],
    onboardingStep    = 1,
    jdMissingSkills   = [],
    generateFusedRoadmap,
    updateVaultItem,
    setOnboarding,
    addVaultItem,
  } = cOS;

  // ── Local state ────────────────────────────────────────────────────────────
  const [activeTrack,          setActiveTrack]          = useState<'sde' | 'iot'>('sde');
  const [roadmapModules,       setRoadmapModules]       = useState<any[]>([]);
  const [mounted,              setMounted]              = useState(false);
  const [selectedTrajectory,   setSelectedTrajectory]   = useState<string | null>(null);
  const [isGeneratingRoadmap,  setIsGeneratingRoadmap]  = useState(false);
  const [isScanning,           setIsScanning]           = useState(false);
  const [scanProgress,         setScanProgress]         = useState(0);
  const [scanLogs,             setScanLogs]             = useState<string[]>([]);
  const scanIntervalRef = useRef<NodeJS.Timeout>();
  const itemsToVerifyRef = useRef<any[]>([]);

  // ── Mount guard ────────────────────────────────────────────────────────────
  useEffect(() => { setMounted(true); }, []);

  // ── Role-based redirect ────────────────────────────────────────────────────
  useEffect(() => {
    if (user) {
      const redirectMap: Record<string, string> = {
        admin:      '/admin',
        recruiter:  '/recruiter',
        consultant: '/consultant',
        teacher:    '/admin/teacher',
        parent:     '/parent',
      };
      if (redirectMap[user.role]) router.push(redirectMap[user.role]);
    }
  }, [user, router]);

  // ── Load roadmap modules from localStorage ─────────────────────────────────
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const key    = `pinit_${user?.id || 'guest'}_roadmap_modules`;
      const saved  = localStorage.getItem(key);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) setRoadmapModules(parsed);
        } catch { /* ignore */ }
      } else {
        setRoadmapModules([]);
      }
    }
  }, [user?.id, completedQuests, roadmapGenerated]);

  // ── 84-day contribution dates (Sun-anchored, 12 weeks) ────────────────────
  const contributionDates = useMemo(() => {
    const dates: Date[] = [];
    const today     = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - (11 * 7) - today.getDay());
    startDate.setHours(0, 0, 0, 0);
    const temp = new Date(startDate);
    for (let i = 0; i < 84; i++) { dates.push(new Date(temp)); temp.setDate(temp.getDate() + 1); }
    return dates;
  }, []);

  const getContributionsForDate = useCallback((date: Date) => {
    const str = date.toDateString();
    let count = 0;
    const qTs: string[] = (onboardingAnswers as any)?.completedQuestsTimestamps   || [];
    const mTs: string[] = (onboardingAnswers as any)?.completedMissionsTimestamps  || [];
    qTs.forEach(ts => { if (new Date(ts).toDateString() === str) count++; });
    mTs.forEach(ts => { if (new Date(ts).toDateString() === str) count++; });
    return count;
  }, [onboardingAnswers]);

  // ── Trust verification scan ────────────────────────────────────────────────
  const unverifiedItems = (vaultItems || []).filter(v => !v.verified);
  const startVerificationScan = () => {
    if (unverifiedItems.length === 0) return;
    itemsToVerifyRef.current = [...unverifiedItems];
    setIsScanning(true); setScanProgress(0);
    setScanLogs(['[SYSTEM] Initializing AI Trust Verification Protocol...']);
    const logs = [
      '[SYSTEM] Connected to decentralized verification nodes.',
      '[SCANNER] Fetching metadata signature from Vault ledger...',
      '[SCANNER] Running SHA-256 cryptographic hash check...',
      '[SECURE] Document verification keys extracted.',
      '[AI] Running OCR on proof asset...',
      '[AI] Analyzing issuer credentials and accreditation...',
      '[AI] Matching skill tags with Career Twin profile...',
      '[SYSTEM] Authenticity score: 98.6% confidence.',
      '[SUCCESS] Cryptographic proof verified.',
      '[SYSTEM] Committing verification state...',
    ];
    let step = 0;
    if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
    scanIntervalRef.current = setInterval(() => {
      step++;
      setScanProgress(prev => Math.min(100, prev + 10));
      if (step <= logs.length) setScanLogs(prev => [...prev, logs[step - 1]]);
      if (step >= 10) {
        clearInterval(scanIntervalRef.current);
        itemsToVerifyRef.current.forEach(item => updateVaultItem(item.id, { verified: true }));
        setIsScanning(false); setScanProgress(100);
      }
    }, 350);
  };
  useEffect(() => () => { if (scanIntervalRef.current) clearInterval(scanIntervalRef.current); }, []);

  // ── Trajectory selection handler ───────────────────────────────────────────
  const handleChooseTrajectory = async (trackTitle: string) => {
    if (roadmapGenerated) return;
    setIsGeneratingRoadmap(true);
    const TRACK_MAP: Record<string, { skills: string[]; weak: string[]; courseId: string }> = {
      'Java Backend Architect':                   { skills:['Java','Spring Boot','SQL'],       weak:['Caching','Distributed Systems'],    courseId:'course-java-logic' },
      'Frontend React Engineer':                  { skills:['React','Next.js','CSS'],          weak:['State Sync','Performance'],         courseId:'course-react-web' },
      'UI/UX Design Systems & Visual Frontend':   { skills:['CSS Layouts','Atomic Components'], weak:['ARIA Roles','Theme Tokens'],       courseId:'course-design-systems' },
      'Data Structures & Algorithmic Optimizations':{ skills:['Big-O','Trees','Graphs'],       weak:['DP','Memoization'],                 courseId:'course-dsa-optim' },
      'Mobile Application Development':           { skills:['React Native','Device APIs'],     weak:['FlatList Perf','Offline sync'],     courseId:'course-mobile-dev' },
      'Cybersecurity Specialist & Secure Systems':{ skills:['OWASP','JWT','mTLS'],             weak:['Zero-Trust','TLS Handshakes'],      courseId:'course-cybersecurity' },
      'Database Engineering & Query Performance': { skills:['B-Tree','Locking','Replicas'],    weak:['Quorums','Sharding'],               courseId:'course-database-eng' },
      'High-Scale Distributed System Design':     { skills:['Hashing','Raft','Kafka'],         weak:['Failure Detectors','Fencing'],      courseId:'course-distributed-sys' },
      'Cloud Native AWS Architect':               { skills:['AWS VPC','IAM','EC2/S3'],         weak:['Lambda','CloudFront'],              courseId:'course-cloud-native' },
      'DevOps & CI/CD Automation Specialist':     { skills:['Docker','Kubernetes','Actions'],  weak:['Helm','Prometheus'],                courseId:'course-devops-cicd' },
      'IoT, Firmware & Embedded Systems':         { skills:['MCU','I2C/SPI','MQTT'],           weak:['RTOS','Power Mgmt'],                courseId:'course-iot-embedded' },
      'IoT Wireless Networks':                    { skills:['LoRaWAN','BLE','NB-IoT'],         weak:['Path Loss','Link Budgets'],         courseId:'course-iot-network' },
      'Edge AI & TinyML':                         { skills:['Quantization','ReLU','FFT'],      weak:['MCU Latency','Noise Filters'],      courseId:'course-iot-edge-ai' },
      'Industrial IoT Security':                  { skills:['Secure Boot','AES','X.509'],      weak:['OCSP','Firmware Rollbacks'],        courseId:'course-iot-security' },
      '3D Graphics & Avatar Animation':           { skills:['WebGL','Three.js','VRM'],         weak:['IK Solvers','Rigging'],             courseId:'course-3d-graphics' },
      'Blockchain, Web3 & Smart Contracts':       { skills:['Solidity','Contracts','Crypto'],  weak:['Gas Opt','Reentrancy'],             courseId:'course-blockchain-web3' },
      'AI Software Engineer':                     { skills:['Python','PyTorch','LLMs'],        weak:['Pipelines','Vector DBs'],           courseId:'course-ai-eng' },
    };
    const cfg = TRACK_MAP[trackTitle] || { skills:['Node.js','Docker','React'], weak:['CI/CD','APIs'], courseId:'course-fullstack-js' };
    try {
      setOnboarding({ role: trackTitle, education: (onboardingAnswers as any)?.education || 'B.Tech CS', skills: cfg.skills.join(', '), experience: (onboardingAnswers as any)?.experience || 'None' });
      await generateFusedRoadmap(cfg.skills, cfg.weak, cfg.courseId);
    } catch (e) { console.error('Roadmap compilation error', e); }
    finally { setIsGeneratingRoadmap(false); }
  };

  // ── Computed values ────────────────────────────────────────────────────────
  const level = computeLevel(xp, careerScore);

  let activeStageIndex = 0;
  for (let i = EVOLUTION_STAGES.length - 1; i >= 0; i--) {
    if (careerScore >= EVOLUTION_STAGES[i].minScore) { activeStageIndex = i; break; }
  }

  const allMissions = [
    { id:'python_loops', title:'Complete Python loops practice',      description:'Solve 3 problems on array manipulation.', type:'skill', status: completedMissions.includes('python_loops') ? 'completed' : 'pending', trust_reward:15, estimated_minutes:25, source_weakness:'Python',       target_gap:'Python Loops & Algorithms', role_requirement:'Swiggy AI Benchmark',    priority:'high' },
    { id:'react_loops',  title:'React Fundamentals Challenge',        description:'Implement complex state sync hooks.',       type:'skill', status: completedMissions.includes('react_loops')  ? 'completed' : 'pending', trust_reward:15, estimated_minutes:20, source_weakness:'React Hooks',  target_gap:'React Context & Render Loop', role_requirement:'Razorpay Frontend',      priority:'high' },
    { id:'star_video',   title:'Record a STAR story video response',  description:'Describe managing a critical frontend crash.', type:'communication', status: completedMissions.includes('star_video') ? 'completed' : 'pending', trust_reward:20, estimated_minutes:30, source_weakness:'Behavioral STAR', target_gap:'STAR Communication',   role_requirement:'Corporate Readiness',  priority:'medium' },
  ];
  const pendingMissions = allMissions.filter(m => m.status === 'pending');

  // Next step logic
  let nextStep = { title:'Setup Your Career OS Profile', desc:'Take the 2-min assessment to map your strengths.', href:'/career-twin', icon:'🧬', color:'var(--accent)' };
  if (vaultItems.length === 0)          nextStep = { title:'Upload to Evidence Vault', desc:'Certifications and project docs boost your Trust Score.', href:'/vault',        icon:'🗂️', color:'var(--purple)' };
  if (completedMissions.length === 0)   nextStep = { title:'Solve Your First Mission',  desc:'5 personalised missions generated daily to close skill gaps.',  href:'/missions',    icon:'⚡', color:'var(--amber)' };
  if (!roadmapGenerated)                nextStep = { title:'Choose Career Trajectory',   desc:'Select a target track to build your custom quest roadmap.',     href:'#trajectory-selector', icon:'🛠️', color:'var(--teal)' };
  if (roadmapGenerated && completedMissions.length > 0) nextStep = { title:'Launch Your Next Quest', desc:'Start coding in our simulated SDE workspace.', href:'/quests', icon:'🗺️', color:'var(--blue)' };

  // Profile for WhatToDoToday
  function profileForActions() {
    return {
      ats_score:            cOS.careerScore ?? 70,
      trust_score:          cOS.trustScore  ?? 70,
      career_dna_score:     cOS.careerScore ?? 70,
      mission_streak:       cOS.missionStreak || 0,
      missions_completed:   (cOS.completedMissions || []).length,
      recruiter_visibility: Number(user?.recruiter_visibility ?? 65),
      vault_count:          (cOS.vaultItems || []).length,
      interviews_done:      Number(user?.interviews_done ?? 0),
      weak_areas:           (user?.weak_areas  as string[] | undefined) ?? [],
      skill_tags:           (user?.skill_tags  as string[] | undefined) ?? [],
      xp_total:             cOS.xp || 0,
    };
  }

  // ── Render guard ───────────────────────────────────────────────────────────
  if (!mounted) return <div style={{ minHeight:'100vh', background:'var(--bg)' }} />;

  // ── JSX ────────────────────────────────────────────────────────────────────
  return (
    <div className="db-page animate-fade-in">
      <style>{DB_STYLES}</style>

      {/* 1. Hero HUD — hologram + greeting + dynamic job match + track toggle */}
      <DashboardHeaderHUD
        user={user}
        careerScore={careerScore}
        trustScore={trustScore}
        onboardingAnswers={onboardingAnswers}
        activeTrack={activeTrack}
        onTrackChange={setActiveTrack}
      />

      {/* 2. Stats Row — XP tier, Career Score ring, Trust Quotient */}
      <DashboardStatsRow
        xp={xp}
        careerScore={careerScore}
        trustScore={trustScore}
        level={level}
        isScanning={isScanning}
        scanProgress={scanProgress}
        scanLogs={scanLogs}
        unverifiedCount={unverifiedItems.length}
        onStartScan={startVerificationScan}
        vaultItemsCount={vaultItems.length}
        userRole={user?.role}
        onSeedDemo={() => addVaultItem({ title:'AWS Certified Cloud Practitioner', item_type:'certification', organization_name:'Amazon Web Services', description:'Validation of AWS Cloud platform understanding.', skill_tags:['Cloud','AWS','IAM','EC2'] })}
      />

      {/* 3. Bento Grid — Evolution timeline, Radar, Heatmap, Mistakes */}
      <DashboardBentoGrid
        careerScore={careerScore}
        dnaScore={dnaScore}
        activeTrack={activeTrack}
        contributionDates={contributionDates}
        getContributionsForDate={getContributionsForDate}
        activeStageIndex={activeStageIndex}
        learningMistakes={cOS.onboardingAnswers?.learning_mistakes || []}
      />

      {/* 4. Priority action checklist */}
      <WhatToDoToday profile={profileForActions()} />

      {/* 5. Missions Panel — Next Step + Missions + Activity Feed */}
      <DashboardMissionsPanel
        pendingMissions={pendingMissions}
        nextStep={nextStep}
        userId={user?.id}
      />

      {/* 6. Trajectory Map — collapsed by default (Bug 6 fix) */}
      <DashboardTrajectoryMap
        roadmapGenerated={roadmapGenerated}
        roadmapModules={roadmapModules}
        completedQuests={completedQuests}
        isGeneratingRoadmap={isGeneratingRoadmap}
        selectedTrajectory={selectedTrajectory}
        onSelectTrajectory={setSelectedTrajectory}
        onChooseTrajectory={handleChooseTrajectory}
      />
    </div>
  );
}
