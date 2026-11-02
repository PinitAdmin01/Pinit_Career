'use client';

import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { useCareerOS } from '@/lib/context/CareerOSContext';
import WhatToDoToday from '@/components/ui/WhatToDoToday';

// Sub-components
import DashboardHeaderHUD      from '@/components/student/dashboard/DashboardHeaderHUD';
import CareerCourseProgressBar from '@/components/student/dashboard/CareerCourseProgressBar';
import DashboardBentoGrid      from '@/components/student/dashboard/DashboardBentoGrid';
import DashboardTrajectoryMap  from '@/components/student/dashboard/DashboardTrajectoryMap';
import { DynamicRoleReadiness, StudentSkillProfile } from '@/lib/pathway/competencySchema';
import { PathwayApiService } from '@/lib/api/pathwayApi';

// ── Evolution stages ────────────────────────────────────────────────────────
const EVOLUTION_STAGES = [
  { stage: 1, minScore: 0  },
  { stage: 2, minScore: 21 },
  { stage: 3, minScore: 41 },
  { stage: 4, minScore: 61 },
  { stage: 5, minScore: 81 },
];

// ── Scoped CSS ──────────────────────────────────────────────────────────────
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
  .db-label { font-size:9.5px; font-family:var(--font-mono); font-weight:800; text-transform:uppercase; letter-spacing:1.5px; color:var(--accent); display:block; }

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
    --dash-text:    var(--t1);
    --dash-subtext: var(--t2);
    --dash-banner:  linear-gradient(135deg,rgba(255,255,255,0.95),rgba(241,243,248,0.85));
  }
`;

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const cOS = useCareerOS();

  const {
    onboardingAnswers,
    completedQuests   = [],
    roadmapGenerated  = false,
    trustScore        = 0,
    careerScore       = 0,
    dnaScore          = 0,
    generateFusedRoadmap,
    setOnboarding,
  } = cOS;

  // ── Local state ────────────────────────────────────────────────────────────
  const [activeTrack,          setActiveTrack]          = useState<'sde' | 'iot'>('sde');
  const [roadmapModules,       setRoadmapModules]       = useState<any[]>([]);
  const [mounted,              setMounted]              = useState(false);
  const [selectedTrajectory,   setSelectedTrajectory]   = useState<string | null>(null);
  const [isGeneratingRoadmap,  setIsGeneratingRoadmap]  = useState(false);
  const [skillProfile,         setSkillProfile]         = useState<StudentSkillProfile | null>(null);
  const [roleReadiness,        setRoleReadiness]        = useState<DynamicRoleReadiness | null>(null);

  // ── Mount guard ────────────────────────────────────────────────────────────
  useEffect(() => { setMounted(true); }, []);

  // ── Authentication boundary: strictly redirect unauthenticated sessions to /login ──
  useEffect(() => {
    if (!authLoading && !user && mounted) {
      router.push('/login?redirect=/dashboard');
    }
  }, [user, authLoading, mounted, router]);

  // ── Load live pathway and skill profile data for authenticated student ──────
  useEffect(() => {
    let isMounted = true;
    async function loadPathwayData() {
      if (!user?.id) return;
      try {
        const studentId = user.id;
        const [profile, readiness] = await Promise.all([
          PathwayApiService.getStudentSkillProfile(studentId),
          PathwayApiService.getRoleReadiness(studentId, 'prog_swe_accelerated_9m'),
        ]);
        if (isMounted) {
          setSkillProfile(profile);
          setRoleReadiness(readiness);
        }
      } catch (err) {
        console.warn('Dashboard pathway data fetch error:', err);
      }
    }
    loadPathwayData();
    return () => { isMounted = false; };
  }, [user?.id, completedQuests]);

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

  // ── Load roadmap modules from localStorage with remote database fallback ──
  const answersRoadmap = (onboardingAnswers as any)?.roadmap;

  useEffect(() => {
    if (typeof window !== 'undefined' && user?.id) {
      const key   = `pinit_${user.id}_roadmap_modules`;
      const saved = localStorage.getItem(key);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setRoadmapModules(parsed);
            return;
          }
        } catch { /* ignore */ }
      }
      if (answersRoadmap && Array.isArray(answersRoadmap) && answersRoadmap.length > 0) {
        setRoadmapModules(answersRoadmap);
        try {
          localStorage.setItem(key, JSON.stringify(answersRoadmap));
        } catch {}
        return;
      }
      setRoadmapModules([]);
    }
  }, [user?.id, completedQuests, roadmapGenerated, answersRoadmap]);

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
      'AI Software Engineer':                     { skills:['Python','PyTorch','LLMs'],        weak:['Pipelines','Vector DBs'],           courseId:'course-ai-eng' },
    };
    const cfg = TRACK_MAP[trackTitle] || { skills:['Node.js','Docker','React'], weak:['CI/CD','APIs'], courseId:'course-fullstack-js' };
    try {
      setOnboarding({ role: trackTitle, education: (onboardingAnswers as any)?.education || 'B.Tech CS', skills: cfg.skills.join(', '), experience: (onboardingAnswers as any)?.experience || 'None' });
      await generateFusedRoadmap(cfg.skills, cfg.weak, cfg.courseId);
    } catch (e) { console.error('Roadmap compilation error', e); }
    finally { setIsGeneratingRoadmap(false); }
  };

  // ── Computed evolution stage ───────────────────────────────────────────────
  let activeStageIndex = 0;
  for (let i = EVOLUTION_STAGES.length - 1; i >= 0; i--) {
    if (careerScore >= EVOLUTION_STAGES[i].minScore) { activeStageIndex = i; break; }
  }

  // Profile for WhatToDoToday
  function profileForActions() {
    return {
      ats_score:            cOS.careerScore ?? 0,
      trust_score:          cOS.trustScore  ?? 0,
      career_dna_score:     cOS.careerScore ?? 0,
      mission_streak:       cOS.missionStreak || 0,
      missions_completed:   (cOS.completedMissions || []).length,
      recruiter_visibility: Number(user?.recruiter_visibility ?? 65),
      vault_count:          (cOS.vaultItems || []).length,
      interviews_done:      Number(user?.interviews_done ?? 0),
      weak_areas:           (user?.weak_areas  as string[] | undefined) ?? [],
      skill_tags:           (user?.skill_tags  as string[] | undefined) ?? [],
      xp_total:             cOS.xp || 0,
      active_track:         activeTrack,
      target_role:          roleReadiness?.targetRole || (onboardingAnswers as any)?.targetRole,
    };
  }

  // ── Render guard ───────────────────────────────────────────────────────────
  if (!mounted || authLoading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14.5, color: 'var(--t2)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ display: 'inline-block', width: 14, height: 14, borderRadius: '50%', border: '2px solid var(--accent)', borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }} />
          Verifying authenticated student session...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: 32, maxWidth: 420 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8, color: 'var(--t1)' }}>Authentication Required</h2>
          <p style={{ fontSize: 14.5, color: 'var(--t2)', marginBottom: 20 }}>
            You must be logged in to access the private student workspace and competency progress.
          </p>
          <Link href="/login?redirect=/dashboard" style={{ display: 'inline-block', padding: '10px 20px', borderRadius: 8, background: 'var(--accent)', color: '#fff', fontWeight: 600, fontSize: 14.5, textDecoration: 'none' }}>
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  // ── JSX ────────────────────────────────────────────────────────────────────
  return (
    <div className="db-page animate-fade-in">
      <style>{DB_STYLES}</style>

      {/* 1. Hero HUD: Hologram + Dynamic Greeting + Top Trust Button + Track Switcher */}
      <DashboardHeaderHUD
        user={user}
        careerScore={careerScore}
        trustScore={trustScore}
        onboardingAnswers={onboardingAnswers}
        activeTrack={activeTrack}
        onTrackChange={setActiveTrack}
        skillProfile={skillProfile}
        roleReadiness={roleReadiness}
      />

      {/* 2. Creative Career Course Progress Bar (Task 4) */}
      <CareerCourseProgressBar />

      {/* 3. Bento Grid: Evolution Timeline, Automatic Attendance Marker, Competencies Radar */}
      <DashboardBentoGrid
        careerScore={careerScore}
        dnaScore={dnaScore}
        activeTrack={activeTrack}
        activeStageIndex={activeStageIndex}
        learningMistakes={cOS.onboardingAnswers?.learning_mistakes || []}
      />

      {/* 4. Priority Action Checklist: 3 concise, dynamic actions */}
      <WhatToDoToday profile={profileForActions()} />

      {/* 5. Trajectory Map (Roadmap generator) */}
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
