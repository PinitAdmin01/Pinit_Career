'use client';

import Link from 'next/link';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { useCareerOS } from '@/lib/context/CareerOSContext';
import { supabase } from '@/lib/supabaseClient';

// Sub-components
import DashboardHeaderHUD      from '@/components/student/dashboard/DashboardHeaderHUD';
import CareerCourseProgressBar from '@/components/student/dashboard/CareerCourseProgressBar';
import DashboardBentoGrid      from '@/components/student/dashboard/DashboardBentoGrid';
import DashboardTrajectoryMap  from '@/components/student/dashboard/DashboardTrajectoryMap';
import { DynamicRoleReadiness, StudentSkillProfile } from '@/lib/pathway/competencySchema';
import { PathwayApiService } from '@/lib/api/pathwayApi';
import { fetchIndependentProjectsFromDb } from '@/lib/api/independentProjectsApi';
import { crashCourseEnrollmentService, CrashCourseEnrollment } from '@/lib/services/crashCourseEnrollmentService';
import type { Project } from '@/lib/data/projectData';

export interface LiveArenaTelemetry {
  elo: number | null;
  rank: number | null;
  league: string | null;
  weeklyXp: number | null;
  careerXp: number | null;
  matchesPlayed: number;
  sprintEndsAt: string | null;
  joined: boolean;
}

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
  /* Page wrapper with generous bottom clearance above floating AI mentor widget */
  .db-page {
    display: flex;
    flex-direction: column;
    gap: 20px;
    max-width: 1340px;
    margin: 0 auto;
    padding: 4px 4px 88px;
  }

  /* Tier-2 Primary Surface Card: grounded container, crisp top rim & depth (no full-section jump) */
  .db-glass {
    background: var(--dash-card-bg);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
    border: 1px solid var(--dash-border);
    border-radius: 16px;
    box-shadow: var(--dash-card-shadow);
    transition: border-color 0.22s ease, box-shadow 0.22s ease, background 0.25s ease;
    overflow: hidden;
    position: relative;
  }
  .db-glass:hover {
    border-color: var(--dash-border-accent);
    box-shadow: var(--dash-card-hover-shadow);
  }

  /* Tier-3 Inner Tile / Well & interactive hover lift */
  .db-well {
    background: var(--dash-subtle-bg);
    border: 1px solid var(--dash-inner-border);
    border-radius: 12px;
    box-shadow: var(--hud-card-shadow);
    transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
  }
  .db-well-interactive:hover {
    background: var(--dash-subtle-hover);
    transform: translateY(-2px);
    box-shadow: var(--hud-card-hover-shadow);
  }

  /* Tabular numerals helper */
  .db-tabular {
    font-variant-numeric: tabular-nums;
    font-family: var(--font-mono);
  }

  /* Section eyebrow label */
  .db-label {
    font-size: 10px;
    font-family: var(--font-mono);
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1.4px;
    color: var(--accent-mid, var(--accent));
    display: block;
  }

  /* Animations */
  @keyframes hud-pulse { 0%,100% { opacity:0.45; } 50% { opacity:1; } }
  @keyframes hud-scan  { 0% { top:0; opacity:0; } 10% { opacity:1; } 90% { opacity:1; } 100% { top:100%; opacity:0; } }
  @keyframes spin      { to { transform:rotate(360deg); } }
  @keyframes db-shimmer {
    0% { opacity: 0.55; }
    50% { opacity: 0.9; }
    100% { opacity: 0.55; }
  }

  /* Theme tokens: Refined Dark Mode (Obsidian -> Cool Slate -> Elevated Wells) */
  :root, :root.dark, [data-theme='dark'] {
    --dash-card:              #0f1524;
    --dash-border:            rgba(255, 255, 255, 0.08);
    --dash-border-strong:     rgba(255, 255, 255, 0.14);
    --dash-border-accent:     rgba(99, 102, 241, 0.26);
    --dash-text:              #f1f5f9;
    --dash-subtext:           #94a3b8;
    --dash-subtle-bg:         linear-gradient(145deg, rgba(24, 33, 54, 0.72) 0%, rgba(16, 23, 39, 0.88) 100%);
    --dash-subtle-hover:      linear-gradient(145deg, rgba(31, 42, 68, 0.84) 0%, rgba(20, 29, 49, 0.94) 100%);
    --dash-inner-border:      rgba(255, 255, 255, 0.09);
    --dash-card-bg:           linear-gradient(155deg, rgba(20, 28, 47, 0.92) 0%, rgba(13, 18, 30, 0.96) 58%, rgba(10, 14, 24, 0.98) 100%);
    --dash-card-shadow:       0 12px 32px -10px rgba(0, 0, 0, 0.62), 0 2px 6px -1px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.07);
    --dash-card-hover-shadow: 0 16px 38px -10px rgba(0, 0, 0, 0.72), 0 0 0 1px rgba(99, 102, 241, 0.26), inset 0 1px 0 rgba(255, 255, 255, 0.10);
    --dash-telemetry-val:     #f8fafc;
    --dash-telemetry-label:   #8b95b3;
    --hud-card-bg:            linear-gradient(145deg, rgba(24, 33, 55, 0.80) 0%, rgba(15, 21, 36, 0.92) 100%);
    --hud-card-shadow:        0 4px 14px -3px rgba(0, 0, 0, 0.48), inset 0 1px 0 rgba(255, 255, 255, 0.07);
    --hud-card-hover-shadow:  0 10px 26px -4px rgba(0, 0, 0, 0.62), inset 0 1px 0 rgba(255, 255, 255, 0.12);
    --dash-rail-bg:           rgba(255, 255, 255, 0.11);
    --dash-radar-grid:        rgba(148, 163, 184, 0.20);
    --dash-radar-label:       #94a3b8;
  }

  /* Theme tokens: Clean 3-Tier Light Mode */
  :root.light, [data-theme='light'] {
    --dash-card:              #ffffff;
    --dash-border:            #e2e8f0;
    --dash-border-strong:     #cbd5e1;
    --dash-border-accent:     rgba(99, 102, 241, 0.24);
    --dash-text:              #0f172a;
    --dash-subtext:           #475569;
    --dash-subtle-bg:         #f1f5f9;
    --dash-subtle-hover:      #e8eef7;
    --dash-inner-border:      #e2e8f0;
    --dash-card-bg:           linear-gradient(160deg, #ffffff 0%, #f9fbff 100%);
    --dash-card-shadow:       0 4px 20px -4px rgba(15, 23, 42, 0.07), 0 1px 3px rgba(15, 23, 42, 0.04), inset 0 1px 0 #ffffff;
    --dash-card-hover-shadow: 0 10px 28px -6px rgba(99, 102, 241, 0.13), 0 2px 6px rgba(15, 23, 42, 0.05), inset 0 1px 0 #ffffff;
    --dash-telemetry-val:     #0f172a;
    --dash-telemetry-label:   #64748b;
    --hud-card-bg:            linear-gradient(155deg, #f8fafc 0%, #f1f5f9 100%);
    --hud-card-shadow:        0 2px 8px -2px rgba(15, 23, 42, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.9);
    --hud-card-hover-shadow:  0 8px 20px -4px rgba(15, 23, 42, 0.11), inset 0 1px 0 #ffffff;
    --dash-rail-bg:           #e2e8f0;
    --dash-radar-grid:        rgba(15, 23, 42, 0.12);
    --dash-radar-label:       #475569;
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
  const [independentProjects,  setIndependentProjects]  = useState<Project[]>([]);
  const [activeEnrollment,     setActiveEnrollment]     = useState<CrashCourseEnrollment | null>(null);
  const [liveArena,            setLiveArena]            = useState<LiveArenaTelemetry>({
    elo: null,
    rank: null,
    league: null,
    weeklyXp: null,
    careerXp: null,
    matchesPlayed: 0,
    sprintEndsAt: null,
    joined: false,
  });

  // ── Mount guard ────────────────────────────────────────────────────────────
  useEffect(() => { setMounted(true); }, []);

  // ── Authentication boundary: strictly redirect unauthenticated sessions to /login ──
  useEffect(() => {
    if (!authLoading && !user && mounted) {
      router.push('/login?redirect=/dashboard');
    }
  }, [user, authLoading, mounted, router]);

  // ── Load live pathway, enrollment, projects, and skill profile data ───────
  const loadDashboardTelemetry = useCallback(async () => {
    if (!user?.id) return;
    const studentId = user.id;
    const activeProgId =
      (onboardingAnswers as any)?.programId ||
      'prog_swe_accelerated_9m';

    const results = await Promise.allSettled([
      PathwayApiService.getStudentSkillProfile(studentId),
      PathwayApiService.getRoleReadiness(studentId, activeProgId),
      fetchIndependentProjectsFromDb(studentId),
      crashCourseEnrollmentService.getActiveEnrollment(),
    ]);

    if (results[0].status === 'fulfilled') setSkillProfile(results[0].value);
    if (results[1].status === 'fulfilled') setRoleReadiness(results[1].value);
    if (results[2].status === 'fulfilled') setIndependentProjects(Array.isArray(results[2].value) ? results[2].value : []);
    if (results[3].status === 'fulfilled') setActiveEnrollment(results[3].value);
  }, [user?.id, onboardingAnswers]);

  useEffect(() => {
    let active = true;
    if (!user?.id) return;
    void loadDashboardTelemetry();

    const handleRefresh = () => {
      if (active) void loadDashboardTelemetry();
    };
    window.addEventListener('pinit:enrollment_updated', handleRefresh);
    window.addEventListener('focus', handleRefresh);
    return () => {
      active = false;
      window.removeEventListener('pinit:enrollment_updated', handleRefresh);
      window.removeEventListener('focus', handleRefresh);
    };
  }, [user?.id, completedQuests, roadmapGenerated, loadDashboardTelemetry]);

  // ── Load real Arena ELO & standing from /api/leaderboard + live profile events ─
  useEffect(() => {
    if (!user?.id) return;
    let cancelled = false;
    let inFlight = false;

    const loadArenaStanding = async () => {
      if (inFlight) return;
      inFlight = true;
      try {
        const params = new URLSearchParams({ mode: 'global', userId: user.id });
        const headers: Record<string, string> = { 'x-user-id': user.id };
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.access_token) headers.Authorization = `Bearer ${session.access_token}`;
        } catch {}

        const response = await fetch(`/api/leaderboard?${params.toString()}`, { headers, cache: 'no-store' });
        if (!response.ok) return;
        const data = await response.json();
        if (cancelled || !data?.ok) return;

        const rawElo = Number(data.currentUser?.eloRating);
        const arenaWins = Number((user as any)?.arena_wins ?? 0);
        const sanitizedElo = Number.isFinite(rawElo) && rawElo > 0
          ? (rawElo === 1200 && arenaWins === 0 ? 100 : Math.round(rawElo))
          : null;

        const weeklyXp = Number(data.currentUser?.weeklyXp);
        const totalXp = Number(data.currentUserTotalXp ?? data.currentUser?.totalXp);
        const joined = Boolean(data.currentUserHasJoined);
        const parsedRank = joined && Number.isFinite(Number(data.currentUser?.rank))
          ? Number(data.currentUser.rank)
          : null;

        setLiveArena({
          elo: sanitizedElo,
          rank: parsedRank,
          league: typeof data.currentUserLeague === 'string' ? data.currentUserLeague : null,
          weeklyXp: Number.isFinite(weeklyXp) ? Math.max(0, Math.round(weeklyXp)) : null,
          careerXp: Number.isFinite(totalXp) ? Math.max(0, Math.round(totalXp)) : null,
          matchesPlayed: Number((user as any)?.arena_matches ?? (joined ? arenaWins : 0)),
          sprintEndsAt: typeof data.sprintEndsAt === 'string' ? data.sprintEndsAt : null,
          joined,
        });
      } catch {
        // Keep fast local fallbacks visible when offline or unconfigured
      } finally {
        inFlight = false;
      }
    };

    const handleProfileUpdate = (event: Event) => {
      const detail = (event as CustomEvent<Record<string, unknown>>).detail || {};
      const updatedElo = typeof detail.arena_elo === 'number'
        ? detail.arena_elo
        : (typeof detail.elo === 'number' ? detail.elo : null);
      const updatedWeeklyXp = typeof detail.weekly_xp === 'number'
        ? detail.weekly_xp
        : (typeof detail.weeklyXp === 'number' ? detail.weeklyXp : null);
      const updatedCareerXp = typeof detail.xp_total === 'number'
        ? detail.xp_total
        : (typeof detail.xp === 'number' ? detail.xp : null);

      setLiveArena(prev => ({
        ...prev,
        elo: updatedElo !== null && Number.isFinite(updatedElo) ? Math.round(updatedElo) : prev.elo,
        weeklyXp: updatedWeeklyXp !== null && Number.isFinite(updatedWeeklyXp) ? Math.max(0, Math.round(updatedWeeklyXp)) : prev.weeklyXp,
        careerXp: updatedCareerXp !== null && Number.isFinite(updatedCareerXp) ? Math.max(0, Math.round(updatedCareerXp)) : prev.careerXp,
      }));
      void loadArenaStanding();
    };

    void loadArenaStanding();
    window.addEventListener('pinit:user_profile_updated', handleProfileUpdate as EventListener);
    window.addEventListener('focus', loadArenaStanding);
    return () => {
      cancelled = true;
      window.removeEventListener('pinit:user_profile_updated', handleProfileUpdate as EventListener);
      window.removeEventListener('focus', loadArenaStanding);
    };
  }, [user]);

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

  // ── Sync activeTrack with selected specialization / enrollment ─────────────
  useEffect(() => {
    const trackText = `${activeEnrollment?.track || ''} ${(onboardingAnswers as any)?.role || ''} ${(user as any)?.targetRole || ''}`.toLowerCase();
    if (trackText.includes('iot') || trackText.includes('embedded') || trackText.includes('tinyml')) {
      setActiveTrack('iot');
    } else {
      setActiveTrack('sde');
    }
  }, [activeEnrollment?.track, onboardingAnswers, user]);

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

  // ── Computed evolution stage (memoized for performance) ───────────────────
  const activeStageIndex = useMemo(() => {
    for (let i = EVOLUTION_STAGES.length - 1; i >= 0; i--) {
      if (careerScore >= EVOLUTION_STAGES[i].minScore) return i;
    }
    return 0;
  }, [careerScore]);

  const hasChosenTrack = Boolean(
    activeEnrollment ||
    roadmapGenerated ||
    (onboardingAnswers as any)?.hasCompleted ||
    (user as any)?.targetRole ||
    (user as any)?.target_role
  );

  const activeTrackTitle = useMemo(() => {
    if (!hasChosenTrack) return null;
    return (
      (user as any)?.targetRole ||
      (user as any)?.target_role ||
      (onboardingAnswers as any)?.targetRole ||
      (onboardingAnswers as any)?.role ||
      (activeEnrollment?.track === 'python_ai'
        ? 'AI & Python Systems'
        : activeEnrollment?.track === 'web_fullstack'
          ? 'Full-Stack Software Engineering'
          : null)
    );
  }, [hasChosenTrack, user, onboardingAnswers, activeEnrollment]);

  // Profile for WhatToDoToday (memoized to prevent redundant downstream re-renders)
  const memoizedProfileForActions = useMemo(() => {
    return {
      ats_score:            Number((user as any)?.atsScore ?? (user as any)?.ats_score ?? 0),
      trust_score:          cOS.trustScore > 0 ? cOS.trustScore : Number((user as any)?.trustScore ?? (user as any)?.trust_score ?? 0),
      career_dna_score:     cOS.dnaScore > 0 ? cOS.dnaScore : (cOS.careerScore ?? 0),
      mission_streak:       cOS.missionStreak || 0,
      missions_completed:   (cOS.completedMissions || []).length,
      recruiter_visibility: Number((user as any)?.recruiterVisibility ?? (user as any)?.recruiter_visibility ?? 0),
      vault_count:          (cOS.vaultItems || []).length,
      interviews_done:      Number((user as any)?.interviewsDone ?? (user as any)?.interviews_done ?? 0),
      weak_areas:           ((user as any)?.weakAreas as string[] | undefined) ?? ((user as any)?.weak_areas as string[] | undefined) ?? [],
      skill_tags:           ((user as any)?.skillTags as string[] | undefined) ?? ((user as any)?.skill_tags as string[] | undefined) ?? [],
      xp_total:             cOS.xp || liveArena.careerXp || Number((user as any)?.xpTotal ?? (user as any)?.xp ?? 0),
      active_track:         activeTrack,
      target_role:          activeTrackTitle || undefined,
    };
  }, [
    user,
    cOS.trustScore,
    cOS.dnaScore,
    cOS.careerScore,
    cOS.missionStreak,
    cOS.completedMissions,
    cOS.vaultItems,
    cOS.xp,
    liveArena.careerXp,
    activeTrack,
    activeTrackTitle,
  ]);

  // ── Render guard: Layout-matched Bento Shimmer Skeleton ────────────────────
  if (!mounted || authLoading) {
    return (
      <div className="db-page" data-testid="dashboard-skeleton">
        <style>{DB_STYLES}</style>
        <div className="db-glass" style={{ padding: '28px 32px', minHeight: 196, animation: 'db-shimmer 1.6s ease-in-out infinite' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', gap: 28, alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ width: 240, height: 28, borderRadius: 8, background: 'var(--dash-subtle-bg)' }} />
              <div style={{ width: '75%', maxWidth: 420, height: 16, borderRadius: 6, background: 'var(--dash-subtle-bg)' }} />
              <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
                <div style={{ width: 160, height: 36, borderRadius: 9, background: 'var(--dash-subtle-bg)' }} />
                <div style={{ width: 130, height: 36, borderRadius: 9, background: 'var(--dash-subtle-bg)' }} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(150px, 1fr))', gap: 12 }}>
              {[0, 1, 2, 3].map(idx => (
                <div key={idx} className="db-well" style={{ height: 68, width: 164 }} />
              ))}
            </div>
          </div>
        </div>
        <div className="db-glass" style={{ height: 140, animation: 'db-shimmer 1.6s ease-in-out infinite' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: 16 }}>
          <div className="db-glass" style={{ height: 280, animation: 'db-shimmer 1.6s ease-in-out infinite' }} />
          <div className="db-glass" style={{ height: 280, animation: 'db-shimmer 1.6s ease-in-out infinite' }} />
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

      {/* 1. Hero HUD: Hologram + Dynamic Greeting + 4 Real-Time KPIs */}
      <DashboardHeaderHUD
        user={user}
        careerScore={careerScore}
        trustScore={trustScore}
        xp={cOS.xp}
        onboardingAnswers={onboardingAnswers}
        activeTrack={activeTrack}
        onTrackChange={setActiveTrack}
        skillProfile={skillProfile}
        roleReadiness={roleReadiness}
        liveArena={liveArena}
        activeEnrollment={activeEnrollment}
        roadmapGenerated={roadmapGenerated}
      />

      {/* 2. Career Course Progress Runway */}
      <CareerCourseProgressBar />

      {/* 3. Bento Grid: Priority Actions, Socratic Radar, Growth Track, Arena, Vault, Projects, Mistakes */}
      <DashboardBentoGrid
        careerScore={careerScore}
        dnaScore={dnaScore}
        activeTrack={activeTrack}
        activeStageIndex={activeStageIndex}
        learningMistakes={cOS.onboardingAnswers?.learning_mistakes || []}
        actionProfile={memoizedProfileForActions}
        liveArena={liveArena}
        independentProjects={independentProjects}
        activeEnrollment={activeEnrollment}
        skillProfile={skillProfile}
        roleReadiness={roleReadiness}
      />

      {/* 4. Trajectory Map (Roadmap generator + Track explorer) */}
      <DashboardTrajectoryMap
        roadmapGenerated={roadmapGenerated}
        roadmapModules={roadmapModules}
        completedQuests={completedQuests}
        isGeneratingRoadmap={isGeneratingRoadmap}
        selectedTrajectory={selectedTrajectory}
        onSelectTrajectory={setSelectedTrajectory}
        onChooseTrajectory={handleChooseTrajectory}
        activeTrackTitle={activeTrackTitle}
      />
    </div>
  );
}
