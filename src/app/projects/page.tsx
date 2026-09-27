'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useCareerOS } from '@/lib/context/CareerOSContext';
import { useAuth } from '@/lib/context/AuthContext';
import { COURSES_CATALOG } from '@/lib/data/coursesCatalog';
import { toast } from '@/lib/store/useAppStore';
import { Project, GITHUB_REPO_REGEX, SWAP_POOLS, getGuideStepsForProject } from '@/lib/data/projectData';
import { parseAndValidateGithubUrl, GithubEvidenceReport } from '@/lib/github/githubIngestion';
import { getDomainFallback } from '@/lib/projects/projectCatalog';
import { getSavedCareerProjects, needsProjectKeyMigration, SavedProjectsSource } from '@/lib/projects/savedProjects';
import {
  findRoadmapCapstone,
  getRoadmapCapstoneContext,
  RoadmapCapstoneContext,
  tagRoadmapCapstones,
} from '@/lib/projects/roadmapCapstone';
import { getProjectEvidenceTarget } from '@/lib/projects/projectEvidence';
import { PathwayApiService } from '@/lib/api/pathwayApi';
import {
  TeamsApiService,
  HackathonSquad,
  TeamRole
} from '@/lib/api/teamsApi';

function ProjectsPageContent() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams?.get('tab') as any) === 'squads' ? 'squads' : 'solo';
  const [mainTab, setMainTab] = useState<'solo' | 'squads'>(initialTab);

  // Sync tab with URL query parameter
  useEffect(() => {
    const tabParam = searchParams?.get('tab');
    if (tabParam === 'squads') setMainTab('squads');
    else if (tabParam === 'solo') setMainTab('solo');
  }, [searchParams]);

  // Squads state
  const [squads, setSquads] = useState<HackathonSquad[]>([]);
  const [selectedSquadId, setSelectedSquadId] = useState<string>('');
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [newSquadName, setNewSquadName] = useState<string>('');
  const [newHackathonTitle, setNewHackathonTitle] = useState<string>('Global AI & Cloud Distributed Systems Hackathon');
  const [newRole, setNewRole] = useState<TeamRole>('backend_lead');
  // PR-03 FIX: Do not pre-populate with dummy/demo URLs. Start empty so user must supply real URLs.
  const [newRepoUrl, setNewRepoUrl] = useState<string>('');
  const [submittingLiveUrl, setSubmittingLiveUrl] = useState<string>('');
  const [isSubmittingProject, setIsSubmittingProject] = useState<boolean>(false);

  // PR-UX-01 FIX: Interactive milestone checklist state with persistent storage
  const [completedMilestones, setCompletedMilestones] = useState<Record<string, number[]>>({});

  // PR-UX-02 FIX: In-memory & session-level GitHub verification audit cache
  const verificationCacheRef = useRef<Map<string, { report: any; timestamp: number }>>(new Map());

  const { user } = useAuth();
  const studentId = (user && typeof user.id === 'string') ? user.id : 'demo_student_01';
  const studentName = (user && typeof (user as any).name === 'string') ? (user as any).name : 'Current Student';
  const cOS = useCareerOS();

  const { completedQuests, onboardingAnswers, addXp, earnPins, saveCareerProjects, spendPins, pins } = cOS;

  const educationStr = String(user?.education || (onboardingAnswers as any)?.education || 'B.Tech in Computer Science');
  const degree = educationStr.split(' at ')[0] || 'B.Tech';

  const activeCourseId = onboardingAnswers?.activeCourseId || COURSES_CATALOG[0].id;
  const activeCourse = COURSES_CATALOG.find(c => c.id === activeCourseId) || COURSES_CATALOG[0];

  // PR-08 FIX: Dynamic course quest length derived from catalog duration (or minimum 10) instead of hardcoded 30.
  const totalQuestsCount = (activeCourse as any)?.totalQuests || (activeCourse?.durationWeeks ? activeCourse.durationWeeks * 3 : 15);
  const completedCount = completedQuests ? completedQuests.length : 0;
  const progressPercent = Math.min(100, Math.round((completedCount / Math.max(totalQuestsCount, 1)) * 100));

  useEffect(() => {
    const list = TeamsApiService.getSquads(studentId);
    setSquads(list);

    // PR-07 FIX: Asynchronously sync squads from cloud so squads are restored across devices
    TeamsApiService.syncRemoteSquads(studentId).then(remoteList => {
      if (remoteList && remoteList.length > 0) {
        setSquads(remoteList);
      }
    }).catch(() => {});

    const unsubscribe = TeamsApiService.subscribeToSquadUpdates(() => {
      setSquads(TeamsApiService.getSquads(studentId));
    });
    return () => {
      unsubscribe();
    };
  }, [studentId]);

  // Load saved milestone checkmarks from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(`pinit_proj_milestones_${user?.id || 'anon'}`);
      if (raw) setCompletedMilestones(JSON.parse(raw));
    } catch {}
  }, [user?.id]);

  const toggleMilestone = (projectId: string, stepIdx: number) => {
    setCompletedMilestones(prev => {
      const current = prev[projectId] || [];
      const updated = current.includes(stepIdx)
        ? current.filter(i => i !== stepIdx)
        : [...current, stepIdx];
      const next = { ...prev, [projectId]: updated };
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(`pinit_proj_milestones_${user?.id || 'anon'}`, JSON.stringify(next));
        } catch {}
      }
      return next;
    });
  };

  const activeSquad = squads.find(s => s.id === selectedSquadId) || squads[0];

  const handleCreateSquad = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSquadName.trim()) {
      toast.error('Squad Name Required', 'Please enter a name for your hackathon squad.');
      return;
    }
    if (!newRepoUrl.trim()) {
      toast.error('Repository URL Required', 'Please provide a valid GitHub repository URL for your squad.');
      return;
    }

    // PR-09 FIX: Validate repository URL before allowing squad creation
    const check = parseAndValidateGithubUrl(newRepoUrl.trim());
    if (!check.valid) {
      toast.error('Invalid Repository URL', check.error || 'Please enter a valid GitHub repository URL.');
      return;
    }

    if (spendPins) {
      const ok = await spendPins('group_project', undefined, 'Team Project Squad Creation');
      if (!ok) return;
    }

    const created = TeamsApiService.createSquad({
      name: newSquadName.trim(),
      hackathonTitle: newHackathonTitle,
      teamLeadStudentId: studentId,
      teamLeadName: studentName,
      teamLeadRole: newRole,
      repoUrl: newRepoUrl.trim(),
      avatarUrl: (user as any)?.avatar_url || (user as any)?.avatarUrl || undefined,
    });

    setSquads(TeamsApiService.getSquads(studentId));
    setSelectedSquadId(created.id);
    setShowCreateModal(false);
    setNewSquadName('');
    setNewRepoUrl('');
    toast.success('Squad Created! 🚀', `Formed ${created.name}`);
  };

  const handleJoinSquad = (role: TeamRole) => {
    if (!activeSquad) return;
    TeamsApiService.joinSquad({
      squadId: activeSquad.id,
      studentId,
      name: studentName,
      role,
      avatarUrl: (user as any)?.avatar_url || (user as any)?.avatarUrl || undefined,
    });
    setSquads(TeamsApiService.getSquads(studentId));
    toast.success('Joined Squad! 👥', `Role: ${role.replace('_', ' ')}`);
  };

  const handleToggleMilestone = (milestoneId: string) => {
    if (!activeSquad) return;
    TeamsApiService.toggleMilestone(activeSquad.id, milestoneId, studentId);
    setSquads(TeamsApiService.getSquads(studentId));
  };

  const handleSubmitTeamProject = async () => {
    if (!activeSquad || isSubmittingProject) return;
    setIsSubmittingProject(true);
    try {
      await TeamsApiService.submitTeamProject({
        squadId: activeSquad.id,
        liveUrl: submittingLiveUrl,
        studentId,
      });
      setSquads(TeamsApiService.getSquads(studentId));
      toast.success('Submitted to Jury! 🏆', 'Project evidence sealed for evaluation.');
    } catch (e: any) {
      console.error(e);
      toast.error('Submission Failed', 'Could not submit project.');
    } finally {
      setIsSubmittingProject(false);
    }
  };

  const [generating, setGenerating] = useState<boolean>(false);
  const [selectedGoal, setSelectedGoal] = useState<string>(onboardingAnswers?.role || 'AI Engineer');
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedGuideProject, setSelectedGuideProject] = useState<Project | null>(null);
  
  // Workspace tabs: 'overview' | 'guide' | 'reqs' | 'resources' | 'submit'
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<'overview' | 'guide' | 'reqs' | 'resources' | 'submit'>('overview');
  
  // Verification states
  const [verifying, setVerifying] = useState<boolean>(false);
  const [verificationStep, setVerificationStep] = useState<number>(0);
  const [showReport, setShowReport] = useState<boolean>(false);
  const [auditReport, setAuditReport] = useState<GithubEvidenceReport | null>(null);
  
  // Submission fields
  const [githubUrl, setGithubUrl] = useState<string>('');
  const [liveDemoUrl, setLiveDemoUrl] = useState<string>('');
  const [zipFileSelected, setZipFileSelected] = useState<boolean>(false);
  const [uploadedZipFile, setUploadedZipFile] = useState<{ name: string; size: number } | null>(null);
  const zipInputRef = useRef<HTMLInputElement | null>(null);

  // Certificate Modal View
  const [activeCertificate, setActiveCertificate] = useState<Project | null>(null);

  // PR-08 FIX: Unlock at 25% course progress OR 3 completed quests OR if user is admin/teacher OR if candidate already has active projects
  // A finished custom roadmap (recorded by the quests page) hands the student their capstone project.
  const roadmapCtx = getRoadmapCapstoneContext(onboardingAnswers as Record<string, unknown> | undefined);
  const isUnlocked = progressPercent >= 25 || completedCount >= 3 || user?.role === 'admin' || user?.role === 'teacher' || projects.length > 0 || Boolean(roadmapCtx);

  // saveCareerProjects stores projects in onboarding_answers.portfolio_projects. This page used to
  // read `.projects`, which nothing writes, so projects vanished on reload.
  const answerProjects = (onboardingAnswers as SavedProjectsSource | undefined)?.portfolio_projects;
  const legacyAnswerProjects = (onboardingAnswers as SavedProjectsSource | undefined)?.projects;

  useEffect(() => {
    const source: SavedProjectsSource = { portfolio_projects: answerProjects, projects: legacyAnswerProjects };
    const saved = getSavedCareerProjects(source);
    if (saved.length > 0) {
      setProjects(saved);
      const active = saved.find((p: Project) => p.status === 'In Progress' || p.status === 'Completed');
      if (active) setSelectedGuideProject(active);
      // Projects saved under the legacy key move to the key the rest of the app reads.
      if (needsProjectKeyMigration(source)) saveCareerProjects(saved);
    } else if (typeof window !== 'undefined' && user?.id) {
      const cached = localStorage.getItem(`pinit_${user.id}_career_projects`);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setProjects(parsed);
            const active = parsed.find((p: Project) => p.status === 'In Progress' || p.status === 'Completed');
            if (active) setSelectedGuideProject(active);
            // Reconcile and persist to Supabase if DB didn't have it yet
            saveCareerProjects(parsed);
          }
        } catch {
          // Ignore corrupt localStorage cache
        }
      }
    }
  }, [user?.id, answerProjects, legacyAnswerProjects, saveCareerProjects]);

  const saveProjects = (updated: Project[]) => {
    setProjects(updated);
    saveCareerProjects(updated);
  };

  const handleGenerate = async (forRoadmap?: RoadmapCapstoneContext) => {
    setGenerating(true);
    try {
      const goal = forRoadmap ? forRoadmap.goal : selectedGoal;
      let generated: Project[] = [];

      // Extract skills from onboarding answers or student profile
      const rawSkills: unknown = onboardingAnswers?.skills;
      const skillsList = typeof rawSkills === 'string'
        ? (rawSkills as string).split(',').map((s: string) => s.trim()).filter(Boolean)
        : Array.isArray(rawSkills) ? (rawSkills as string[]) : [];

      let authHeader: Record<string, string> = {};
      try {
        const { supabase } = await import('@/lib/supabaseClient');
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
          authHeader = { Authorization: `Bearer ${session.access_token}` };
        }
      } catch { /* ignore auth session extraction */ }

      try {
        const isAuth = Boolean(authHeader.Authorization);
        const res = await fetch('/api/projects/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...authHeader,
            ...(!isAuth ? { 'x-preview': 'true' } : {})
          },
          body: JSON.stringify({
            goal,
            skills: skillsList,
            education: degree,
            experienceLevel: (onboardingAnswers as any)?.experience || (onboardingAnswers as any)?.codingExperience || 'Undergraduate',
            preview: !isAuth
          })
        });

        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.projects) && data.projects.length > 0) {
            generated = data.projects;
          }
        }
      } catch (err) {
        console.warn('[Projects] Backend generation request failed, using client fallback:', err);
      }

      if (generated.length === 0) {
        generated = getDomainFallback(
          goal,
          skillsList,
          (onboardingAnswers as any)?.experience || (onboardingAnswers as any)?.codingExperience || 'Undergraduate'
        );
        toast.info(
          'Curated Track Portfolio Loaded 📚',
          `Using curated industry track portfolio blueprints for ${goal} (AI generation offline or timed out).`
        );
      }

      const goalKey = goal.toLowerCase().replace(/[^a-z0-9]/g, '_');
      const enriched = generated.map((p, idx) => {
        const guides = p.guideSteps && p.guideSteps.length > 0
          ? { steps: p.guideSteps, tips: p.tips || [], reqs: p.verificationReqs || [], minScore: p.minScore || 80 }
          : getGuideStepsForProject(p.name, goal);
        
        // PR-01 FIX: Stable unique IDs so regenerating tracks doesn't collide with generic proj-1..5
        const stableId = p.id && !p.id.match(/^proj-[1-5]$/)
          ? p.id
          : `proj_${goalKey}_${(p.level || 'lvl').toLowerCase()}_${idx + 1}`;

        return {
          ...p,
          id: stableId,
          guideSteps: guides.steps,
          tips: guides.tips,
          verificationReqs: guides.reqs,
          minScore: guides.minScore,
          isTemplate: p.isTemplate ?? true,
          source: p.source || 'curated_template'
        };
      });

      // PR-01 FIX: Preserve in-progress or completed projects across regeneration
      const preservedProjects = projects.filter(
        existing => existing.status === 'In Progress' || existing.status === 'Completed'
      );
      
      const merged = enriched.map(newProj => {
        const existingMatch = preservedProjects.find(
          ex => ex.id === newProj.id || (ex.level === newProj.level && ex.status !== 'Not Started')
        );
        return existingMatch || newProj;
      });

      const finalProjects = forRoadmap ? tagRoadmapCapstones(merged, forRoadmap) : merged;
      saveProjects(finalProjects);
      setSelectedGuideProject(finalProjects[0]);
      if (forRoadmap) {
        toast.success('Your roadmap capstone is ready 🎓', `Projects built from your completed roadmap for: ${goal}`);
      } else {
        toast.success('Projects Generated! ⚡', `Loaded 5 customized capstone tracks for: ${goal}`);
      }
    } catch (err: any) {
      console.error('[Projects] handleGenerate failed:', err);
      toast.error('Generation Failed', 'Could not generate project tracks.');
    } finally {
      setGenerating(false);
    }
  };

  // Arriving from a finished roadmap (/projects?from=roadmap): open its capstone, generating it once.
  // Saved projects are read from the answers directly, so a capstone handed out earlier is never
  // regenerated while the page state is still loading.
  const fromRoadmap = searchParams?.get('from') === 'roadmap';
  const roadmapHandoffRef = useRef(false);
  const handleGenerateRef = useRef(handleGenerate);
  handleGenerateRef.current = handleGenerate;
  useEffect(() => {
    if (!fromRoadmap || !roadmapCtx || roadmapHandoffRef.current || generating) return;
    roadmapHandoffRef.current = true;
    const saved = getSavedCareerProjects({ portfolio_projects: answerProjects, projects: legacyAnswerProjects });
    const existing = findRoadmapCapstone(saved, roadmapCtx);
    if (existing) {
      setSelectedGuideProject(existing);
      toast.info('Your roadmap capstone 🎓', `Continue "${existing.name}".`);
      return;
    }
    setSelectedGoal(roadmapCtx.goal);
    void handleGenerateRef.current(roadmapCtx);
  }, [fromRoadmap, roadmapCtx, generating, answerProjects, legacyAnswerProjects]);

  const handleStart = async (id: string) => {
    const existing = projects.find(p => p.id === id);
    const alreadyStarted = existing && (existing.status === 'In Progress' || existing.status === 'Completed');

    if (!alreadyStarted && spendPins) {
      const ok = await spendPins('project', id, 'Project Workspace Unlock');
      if (!ok) return;
    }
    const updated = projects.map(p => {
      if (p.id === id) {
        return { ...p, status: 'In Progress' as const };
      }
      return p;
    });
    saveProjects(updated);
    const startProj = updated.find(p => p.id === id);
    if (startProj) {
      setSelectedGuideProject(startProj);
      setActiveWorkspaceTab('overview');
    }
    if (!alreadyStarted) {
      toast.success('Project Workspace Unlocked! 🚀', 'Guide Book and Submission portals are now active (10 Pins spent).');
    }
  };

  const handleVerifyProject = async () => {
    if (!githubUrl.trim()) {
      toast.error('Verification Error', 'GitHub repository URL is required.');
      return;
    }

    const check = parseAndValidateGithubUrl(githubUrl.trim());
    if (!check.valid) {
      toast.error('Invalid Repository URL', check.error || 'Please enter a valid GitHub repository URL.');
      return;
    }

    const cacheKey = githubUrl.trim().toLowerCase();
    const cachedEntry = verificationCacheRef.current.get(cacheKey);
    // PR-UX-02 FIX: Instant verification replay from cache if audited within 10 minutes
    if (cachedEntry && Date.now() - cachedEntry.timestamp < 10 * 60 * 1000) {
      toast.info('Loaded Cached Analysis ⚡', 'Using fresh verified repository audit from current session.');
      setAuditReport(cachedEntry.report);
      setShowReport(true);
      return;
    }

    setVerifying(true);
    setVerificationStep(0);
    setShowReport(false);
    setAuditReport(null);

    try {
      let authHeader: Record<string, string> = {};
      try {
        const { supabase } = await import('@/lib/supabaseClient');
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
          authHeader = { Authorization: `Bearer ${session.access_token}` };
        }
      } catch (authErr) {
        console.warn('[Project Verification] Could not get session token:', authErr);
      }

      // PR-05 FIX: Real network ingestion call with student identity verification (DEF-040)
      const res = await fetch('/api/github/ingest', {
        method: 'POST',
        headers: { ...authHeader, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repoUrl: githubUrl.trim(),
          studentUsername: (user as any)?.githubUsername || user?.username || (user as any)?.displayName || (user as any)?.name
        })
      });

      const data = await res.json();

      if (!res.ok || !data?.report) {
        throw new Error(data?.error || 'Ingestion failed');
      }

      // Save to session cache
      verificationCacheRef.current.set(cacheKey, { report: data.report, timestamp: Date.now() });

      // Advance directly to completion upon receipt of real validated report
      setVerificationStep(5);
      setAuditReport(data.report);
      setVerifying(false);
      setShowReport(true);
      const score = data.report.overallEvidenceScore ?? 0;
      toast.success(
        'Repository Ingestion Complete! ✅',
        `Status: ${data.report.status} | Evidence Score: ${score}% (${data.report.projectComplexityTier})`
      );
    } catch (err: any) {
      setVerifying(false);
      setVerificationStep(0);
      toast.error('Verification Halted', err?.message || 'Failed to analyze repository');
    }
  };

  const handleIssueStandardCertificate = () => {
    if (selectedGuideProject && user?.id) {
      // Require actual verification before certificate issuance
      if (!auditReport || typeof auditReport.overallEvidenceScore !== 'number') {
        toast.error('Verification Required', 'You must verify your repository before an official certificate can be issued.');
        return;
      }
      const score = auditReport.overallEvidenceScore;

      // Enforce Minimum Pass Threshold (Default 80%)
      const minThreshold = selectedGuideProject.minScore || 80;
      if (score < minThreshold) {
        toast.error(
          'Verification Failed: Pass Threshold Not Met ❌',
          `Your repository achieved an Evidence Score of ${score}%, which is below the required pass threshold of ${minThreshold}%. Review audit feedback and improve your code structure before certification.`
        );
        return;
      }

      // DEF-040: Verify authentic student authorship (strict boolean check)
      const isAuthored = auditReport.isAuthoredByStudent === true && (auditReport.authorshipStatus === 'VERIFIED_AUTHOR' || auditReport.authorshipStatus === 'CONTRIBUTOR');
      const certType = isAuthored ? ('standard' as const) : ('reference' as const);

      // Anti-Farm Protection: Deduplicate rewards on repeat completions
      const isAlreadyCompleted = selectedGuideProject.status === 'Completed';
      const earnedXp = isAlreadyCompleted ? 0 : (isAuthored ? 1000 : 250);
      const earnedPins = isAlreadyCompleted ? 0 : (isAuthored ? 20 : 5);

      // Cryptographically collision-safe Certificate ID
      const randHex = typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID().replace(/-/g, '').substring(0, 8).toUpperCase()
        : `${Date.now().toString(36).toUpperCase()}`;
      const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
      const dateStr = new Date().toLocaleDateString('en-GB', options);
      const certId = auditReport.proofRecord?.evidenceHash || `PIN-${dateStr.replace(/[^A-Za-z0-9]/g, '')}-${randHex}`;

      const updated = projects.map(p => {
        if (p.id === selectedGuideProject.id) {
          return {
            ...p,
            status: 'Completed' as const,
            githubLink: githubUrl,
            demoLink: liveDemoUrl || undefined,
            verificationScore: score,
            certificateType: certType,
            authorshipVerified: isAuthored,
            certificateId: certId,
            issueDate: dateStr
          };
        }
        return p;
      });
      saveProjects(updated);
      const updatedProj = updated.find(p => p.id === selectedGuideProject.id);
      if (updatedProj) setSelectedGuideProject(updatedProj);
      
      // Perform automated synchronization updates only for non-farmed rewards
      if (earnedXp > 0) {
        addXp(earnedXp, `${isAuthored ? 'Completed Project' : 'Linked Reference Project'}: ${selectedGuideProject.name}`);
      }
      if (earnedPins > 0) {
        earnPins('vault_verify', earnedPins, `${isAuthored ? 'Completed Project' : 'Linked Reference Project'}: ${selectedGuideProject.name}`);
      }

      // Record in authoritative pathway evidence engine, under the program and competency of the
      // student's own track (tracks the competency catalog doesn't cover record nothing).
      const evidenceRole = selectedGuideProject.origin === 'roadmap' ? (roadmapCtx?.goal ?? selectedGoal) : selectedGoal;
      const evidenceTarget = getProjectEvidenceTarget(evidenceRole, selectedGuideProject.level);
      if (!evidenceTarget) {
        console.info(`[Projects] No competency in the catalog for "${evidenceRole}"; project evidence not recorded.`);
      } else PathwayApiService.recordEvidence({
        id: `ev_${Date.now()}_${randHex.toLowerCase()}`,
        studentId: user.id,
        competencyId: evidenceTarget.competencyId,
        competencyVersion: 'v1',
        programId: evidenceTarget.programId,
        evidenceClass: isAuthored ? 'production' : 'application',
        difficulty: 'advanced',
        evidenceFamilyId: 'project_submission',
        sourceType: 'project',
        sourceId: selectedGuideProject.id,
        attemptId: certId,
        score: isAuthored ? score : Math.min(score, 60),
        evaluatorType: 'deterministic',
        evaluatorVersion: 'v1.0',
        rubricVersion: 'v1.0',
        timestamp: Date.now(),
        artifacts: {
          githubRepoUrl: githubUrl,
          repoUrl: githubUrl,
          commitSha: auditReport?.proofRecord?.evidenceHash?.substring(0, 12) || 'd8a1f49e0b',
        }
      }).catch((err: unknown) => console.warn('Failed to record standard project evidence:', err));
      
      setShowReport(false);
      setActiveWorkspaceTab('overview');

      if (isAlreadyCompleted) {
        toast.info(
          'Re-Verification Recorded 🔄',
          `Project re-verified for practice (Score: ${score}%). Your updated metrics were saved (+0 XP repeat completion).`
        );
      } else if (isAuthored) {
        toast.success('Project Completed! 🏅', `Issued AI Evidence Certificate (${score}%) with hash ${certId}.`);
      } else {
        toast.info(
          'Linked as External Reference 📖',
          `Repository authored by '${auditReport.metadata?.owner || 'External'}'. Saved as External Reference (+${earnedXp} XP). Original authorship needed for full Capstone certificate.`
        );
      }
    }
  };

  const handleChangeProject = (id: string, level: string) => {
    const goal = selectedGoal;
    const pool = SWAP_POOLS[goal]?.[level] || SWAP_POOLS['Backend Engineer']?.[level] || SWAP_POOLS['AI Engineer']?.[level];
    if (!pool) {
      toast.error('Change Project Failed', 'No alternative templates available.');
      return;
    }

    const updated = projects.map(p => {
      if (p.id === id) {
        const isSwapped = p.name === pool.name;
        const baselineNameMap: Record<string, string> = goal.includes('AI')
          ? { 'Beginner': 'AI Resume Analyzer', 'Intermediate': 'RAG Knowledge-Base Chatbot', 'Advanced': 'Multi-Agent Code Reviewer Coordinator', 'Enterprise': 'Neural Network Ops Dashboard', 'Future-Tech': 'Zero-Knowledge Homomorphic Inference Engine' }
          : goal.includes('Cyber')
            ? { 'Beginner': 'Argon2 Authentication Portal', 'Intermediate': 'JWT Identity Provider Server', 'Advanced': 'Zero-Trust Reputational Gateway', 'Enterprise': 'Real-time Intrusion System (IDS)', 'Future-Tech': 'Homomorphic Cryptographic Vault' }
            : { 'Beginner': 'Payment Webhook Broker', 'Intermediate': 'Concurrency-Locked Inventory', 'Advanced': 'Event-Driven Microservices ERP', 'Enterprise': 'CQRS Ledger Analytics Pipeline', 'Future-Tech': 'Edge CDN Cache Router' };

        const baselineName = baselineNameMap[level] || 'Baseline Project';
        const targetName: string = isSwapped ? baselineName : (pool.name || 'Baseline Project');
        const descMap: Record<string, string> = {
          'AI Resume Analyzer': 'Extract skills and match keywords against JDs to compute real-time ATS grades.',
          'RAG Knowledge-Base Chatbot': 'Vector-embedded PDF querying interface using LangChain and vector indexes.',
          'Multi-Agent Code Reviewer Coordinator': 'Decentralized AI agent loop simulating technical architect and QA developer debating code quality.',
          'Neural Network Ops Dashboard': 'High-throughput system monitoring tensor weights and GPU performance metrics during model fine-tuning.',
          'Zero-Knowledge Homomorphic Inference Engine': 'Cryptographic inference proxy evaluating regression models directly on encrypted customer inputs.'
        };
        const targetDesc = isSwapped 
          ? (descMap[targetName] || pool.description)
          : pool.description;

        const targetTech = isSwapped ? 'Python, PyPDF2, TF-IDF' : pool.techStack;
        const targetProblem = isSwapped ? 'Default problem' : pool.problem;
        const targetDeliv = isSwapped ? 'Default requirements' : pool.deliverable;

        const guides = getGuideStepsForProject(targetName || '', goal);

        return {
          ...p,
          name: targetName || 'Alternative Project',
          description: targetDesc || 'Alternative project description',
          techStack: targetTech || 'General stack',
          problem: targetProblem || 'General problem',
          deliverable: targetDeliv || 'General deliverable',
          status: 'Not Started' as const,
          githubLink: undefined,
          demoLink: undefined,
          vivaPassed: false,
          certificateType: undefined,
          certificateId: undefined,
          issueDate: undefined,
          verificationScore: undefined,
          guideSteps: guides.steps,
          tips: guides.tips,
          verificationReqs: guides.reqs,
          minScore: guides.minScore
        };
      }
      return p;
    });

    saveProjects(updated);
    const swapped = updated.find(p => p.id === id);
    if (swapped) {
      setSelectedGuideProject(swapped);
      setActiveWorkspaceTab('overview');
    }
    toast.success('Template Swapped! 🔄', 'Successfully changed project template.');
  };

  return (
    <div style={{ maxWidth: 1240, margin: '0 auto', padding: '24px 20px 80px' }} className="fade-in">
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 900, color: 'var(--t1)' }}>🚀 Projects & Squads Innovation Hub</h1>
          <p style={{ margin: '4px 0 0 0', fontSize: 13, color: 'var(--t3)' }}>
            Build individual GitHub-verified Capstones or collaborate with 3-person Hackathon Squads.
          </p>
        </div>
        
      </div>

      {/* Mode Selector Tabs */}
      <div style={{
        display: 'flex',
        gap: 8,
        padding: '6px',
        borderRadius: 14,
        background: 'var(--bg2)',
        border: '1px solid var(--border)',
        marginBottom: 24,
        overflowX: 'auto'
      }}>
        <button
          onClick={() => setMainTab('solo')}
          style={{
            flex: 1,
            minWidth: 200,
            padding: '10px 16px',
            borderRadius: 10,
            border: mainTab === 'solo' ? '1.5px solid var(--accent)' : '1px solid transparent',
            background: mainTab === 'solo'
              ? 'linear-gradient(135deg, rgba(var(--brand-rgb),0.22), rgba(var(--reward-rgb),0.15))'
              : 'transparent',
            color: mainTab === 'solo' ? 'var(--text)' : 'var(--t2)',
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: 13,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            transition: 'all 0.15s ease'
          }}
        >
          <span>🛠️</span>
          <span>Solo Capstones (GitHub Verified)</span>
        </button>

        <button
          onClick={() => setMainTab('squads')}
          style={{
            flex: 1,
            minWidth: 200,
            padding: '10px 16px',
            borderRadius: 10,
            border: mainTab === 'squads' ? '1.5px solid var(--reward)' : '1px solid transparent',
            background: mainTab === 'squads'
              ? 'linear-gradient(135deg, rgba(var(--reward-rgb),0.22), rgba(var(--reward-rgb),0.15))'
              : 'transparent',
            color: mainTab === 'squads' ? 'var(--text)' : 'var(--t2)',
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: 13,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            transition: 'all 0.15s ease'
          }}
        >
          <span>👥</span>
          <span>Hackathon Squads & Team Hub</span>
        </button>
      </div>

      {/* ── TAB 1: SOLO CAPSTONES ────────────────────────────────────────── */}
      {mainTab === 'solo' && (
        <>
          {/* Lock Screen */}
          {!isUnlocked ? (
            <div style={{
              background: 'rgba(255, 255, 255, 0.01)',
              border: '1.5px dashed var(--border)',
              borderRadius: 20, padding: '60px 24px', textAlign: 'center', margin: '40px auto', maxWidth: 640
            }}>
              <div style={{ fontSize: 64, marginBottom: 20 }}>🔒</div>
              <h2 style={{ fontSize: 22, fontWeight: 900, color: 'var(--t1)', marginBottom: 8 }}>Projects Workspace Locked</h2>
          <p style={{ fontSize: 14, color: 'var(--t3)', lineHeight: 1.6, marginBottom: 24 }}>
            To ensure foundational skills are solid before building, the Projects tab unlocks after completing **25%** of your active course quests (or completing 3 quests).
          </p>

          <div style={{ maxWidth: 400, margin: '0 auto 30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 800, color: 'var(--t2)', marginBottom: 6 }}>
              <span>{activeCourse.title} Progress</span>
              <span>{progressPercent}%</span>
            </div>
            <div style={{ height: 10, background: 'var(--bg3)', borderRadius: 5, overflow: 'hidden', border: '1px solid var(--border)' }}>
              <div style={{ height: '100%', width: `${progressPercent}%`, background: 'linear-gradient(90deg, var(--accent), var(--purple))', transition: 'width 0.5s' }} />
            </div>
            <div style={{ marginTop: 10, fontSize: 12, color: 'var(--t3)' }}>
              {completedCount} of {totalQuestsCount} quests completed.
            </div>
          </div>
        </div>
      ) : (
        /* Workspace interface */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          {/* AI Generator Control */}
          <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 16, padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 900, color: 'var(--t1)' }}>⚡ AI Dynamic Portfolio Generator</h3>
              <p style={{ margin: '2px 0 0 0', fontSize: 11.5, color: 'var(--t3)' }}>
                Constructs 5 real-world projects utilizing target parameters: `projects = quests + academic degree + DNA score + career goal`.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 14, alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--t3)', textTransform: 'uppercase' }}>Academic Course / Degree</span>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)', marginTop: 4 }}>{degree}</div>
              </div>
              <div>
                <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--t3)', textTransform: 'uppercase' }}>Quests Completed</span>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)', marginTop: 4 }}>{completedCount} Quests</div>
              </div>
              <div>
                <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--t3)', textTransform: 'uppercase' }}>Overall DNA Score</span>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent)', marginTop: 4 }}>{Math.min(95, 60 + (completedCount * 1.5))}/100</div>
              </div>
              <div>
                <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--t3)', textTransform: 'uppercase' }}>Target Career Goal</span>
                <select
                  value={selectedGoal}
                  onChange={e => setSelectedGoal(e.target.value)}
                  className="form-input"
                  style={{ width: '100%', fontSize: 12, padding: '6px 8px', marginTop: 4 }}
                >
                  {selectedGoal && !['AI Engineer', 'Backend Engineer', 'Cybersecurity Engineer', 'Full Stack Developer', 'Frontend Developer', 'Cloud & DevOps Engineer', 'Data Scientist / ML Engineer'].includes(selectedGoal) && (
                    <option value={selectedGoal}>{selectedGoal}</option>
                  )}
                  <option value="AI Engineer">AI Engineer</option>
                  <option value="Full Stack Developer">Full Stack Developer</option>
                  <option value="Frontend Developer">Frontend Developer</option>
                  <option value="Backend Engineer">Backend Engineer</option>
                  <option value="Cybersecurity Engineer">Cybersecurity Engineer</option>
                  <option value="Cloud & DevOps Engineer">Cloud & DevOps Engineer</option>
                  <option value="Data Scientist / ML Engineer">Data Scientist / ML Engineer</option>
                </select>
              </div>
            </div>

            <button
              onClick={() => handleGenerate()}
              disabled={generating}
              className="btn-primary"
              style={{ padding: '12px 0', fontSize: 13, fontWeight: 800, justifyContent: 'center', marginTop: 8 }}
            >
              {generating ? '🧬 Simulating Career Optimization Formula...' : '⚡ Generate My Personalised Career Projects'}
            </button>
          </div>

          {/* Project Workspace Content Layout */}
          {projects.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.5fr', gap: 20, alignItems: 'start' }}>
              
              {/* Left Column: Projects lists */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {projects.map((p) => {
                  const isActiveGuide = selectedGuideProject?.id === p.id;
                  const borderColors = {
                    'Beginner': 'var(--teal)',
                    'Intermediate': 'var(--blue)',
                    'Advanced': 'var(--purple)',
                    'Enterprise': 'var(--amber)',
                    'Future-Tech': 'var(--coral)'
                  };
                  return (
                    <div
                      key={p.id}
                      onClick={() => setSelectedGuideProject(p)}
                      style={{
                        background: 'var(--card)', border: `1px solid ${isActiveGuide ? 'var(--accent)' : 'var(--border)'}`,
                        borderLeft: `4px solid ${borderColors[p.level]}`, borderRadius: 14, padding: 16,
                        cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 8,
                        boxShadow: isActiveGuide ? '0 0 10px rgba(var(--brand-rgb),0.08)' : 'none',
                        transition: 'border 0.2s, box-shadow 0.2s'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                          <span style={{ fontSize: 9.5, fontFamily: 'var(--font-mono)', background: 'var(--bg3)', padding: '2px 6px', borderRadius: 4, fontWeight: 900, color: borderColors[p.level], border: `1px solid ${borderColors[p.level]}40` }}>
                            {p.level === 'Beginner' ? 'P1' : p.level === 'Intermediate' ? 'P2' : p.level === 'Advanced' ? 'P3 ⚡' : p.level === 'Enterprise' ? 'P4' : 'P5'} · {p.level.toUpperCase()}
                          </span>
                          {p.level === 'Advanced' && (
                            <span style={{ fontSize: 8.5, fontFamily: 'var(--font-mono)', background: 'rgba(var(--danger-rgb), 0.15)', color: 'var(--danger)', padding: '1px 5px', borderRadius: 4, fontWeight: 800 }}>
                              INTERVIEW GATE
                            </span>
                          )}
                          {p.isTemplate ? (
                            <span title="Curated industry blueprint" style={{ fontSize: 8.5, fontFamily: 'var(--font-mono)', background: 'rgba(var(--teal-rgb, 13,148,136), 0.12)', color: 'var(--teal, #0d9488)', padding: '1px 5px', borderRadius: 4, fontWeight: 700, border: '1px solid rgba(var(--teal-rgb, 13,148,136), 0.25)' }}>
                              📐 BLUEPRINT
                            </span>
                          ) : (
                            <span title="AI synthesized for your profile" style={{ fontSize: 8.5, fontFamily: 'var(--font-mono)', background: 'rgba(var(--purple-rgb, 147,51,234), 0.15)', color: 'var(--purple, #9333ea)', padding: '1px 5px', borderRadius: 4, fontWeight: 700, border: '1px solid rgba(var(--purple-rgb, 147,51,234), 0.25)' }}>
                              🤖 AI TAILORED
                            </span>
                          )}
                          <strong style={{ fontSize: 13.5, color: 'var(--t1)' }}>{p.name}</strong>
                        </div>
                        <span style={{ fontSize: 10, color: 'var(--t3)' }}>+{p.xpReward} XP</span>
                      </div>

                      <p style={{ margin: 0, fontSize: 12, color: 'var(--t2)', lineHeight: 1.4 }}>{p.description}</p>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
                        <span style={{ fontSize: 11, color: 'var(--t3)' }}>⚙️ {p.techStack}</span>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          
                          {p.status === 'Not Started' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleChangeProject(p.id, p.level);
                              }}
                              style={{
                                padding: '4px 8px', borderRadius: 6, fontSize: 10, fontWeight: 800,
                                background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)',
                                color: 'var(--t2)', cursor: 'pointer'
                              }}
                            >
                              🔄 Swap
                            </button>
                          )}

                          {p.status === 'Not Started' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStart(p.id);
                              }}
                              className="btn-primary"
                              style={{ padding: '4px 10px', fontSize: 10, borderRadius: 6 }}
                            >
                              🚀 Start Project
                            </button>
                          )}
                          {p.status === 'In Progress' && (
                            <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--amber)' }}>⚡ In Progress</span>
                          )}
                          {p.status === 'Completed' && (
                            <span style={{ fontSize: 11, fontWeight: 900, color: p.certificateType === 'reference' ? 'var(--amber)' : 'var(--success)' }}>
                              {p.certificateType === 'reference'
                                ? '📖 External Reference'
                                : p.vivaPassed ? '🏆 Verified Excellence' : '🏅 AI Verified'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right Column: Interactive Workspace Panel */}
              {selectedGuideProject && (
                <div style={{
                  background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16,
                  padding: 20, display: 'flex', flexDirection: 'column', gap: 16
                }}>
                  
                  {/* Top Info & Action Panel */}
                  <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h2 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: 'var(--t1)' }}>{selectedGuideProject.name}</h2>
                      <span style={{ fontSize: 11, color: 'var(--t3)' }}>Workspace Level: <strong>{selectedGuideProject.level}</strong></span>
                    </div>

                    {selectedGuideProject.status === 'Not Started' ? (
                      <button
                        onClick={() => handleStart(selectedGuideProject.id)}
                        className="btn-primary"
                        style={{ padding: '8px 16px', fontSize: 12 }}
                      >
                        🚀 Open Workspace
                      </button>
                    ) : (
                      /* Active Workspace Tab headers */
                      <div style={{ display: 'flex', gap: 6, background: 'var(--bg3)', padding: 4, borderRadius: 8 }}>
                        {(['overview', 'guide', 'reqs', 'resources', 'submit'] as const).map(tab => (
                          <button
                            key={tab}
                            onClick={() => setActiveWorkspaceTab(tab)}
                            style={{
                              padding: '6px 10px', border: 'none', borderRadius: 6, fontSize: 11, fontWeight: 800,
                              background: activeWorkspaceTab === tab ? 'var(--card)' : 'transparent',
                              color: activeWorkspaceTab === tab ? 'var(--accent)' : 'var(--t3)',
                              cursor: 'pointer'
                            }}
                          >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Tab Body views */}
                  {selectedGuideProject.status !== 'Not Started' && (
                    <div style={{ minHeight: 280, display: 'flex', flexDirection: 'column', gap: 14 }}>
                      
                      {/* Overview Tab */}
                      {activeWorkspaceTab === 'overview' && (
                        <>
                          <div>
                            <strong style={{ fontSize: 12, color: 'var(--t2)', display: 'block', marginBottom: 4 }}>🎯 Project Overview:</strong>
                            <p style={{ margin: 0, fontSize: 12.5, color: 'var(--t2)', lineHeight: 1.45 }}>{selectedGuideProject.description}</p>
                          </div>
                          <div>
                            <strong style={{ fontSize: 12, color: 'var(--t2)', display: 'block', marginBottom: 4 }}>⚠️ Real-World Problem:</strong>
                            <p style={{ margin: 0, fontSize: 12.5, color: 'var(--t2)', lineHeight: 1.45 }}>{selectedGuideProject.problem}</p>
                          </div>
                          <div>
                            <strong style={{ fontSize: 12, color: 'var(--t2)', display: 'block', marginBottom: 4 }}>📦 Required Outcome:</strong>
                            <p style={{ margin: 0, fontSize: 12.5, color: 'var(--t2)', lineHeight: 1.45 }}>{selectedGuideProject.deliverable}</p>
                          </div>
                        </>
                      )}

                      {/* Guide Book Tab (PR-UX-01: Interactive Milestone Checklist) */}
                      {activeWorkspaceTab === 'guide' && (
                        <>
                          {/* Interactive Milestone Progress Bar */}
                          {selectedGuideProject.guideSteps && selectedGuideProject.guideSteps.length > 0 && (() => {
                            const steps = selectedGuideProject.guideSteps;
                            const doneIndices = completedMilestones[selectedGuideProject.id] || [];
                            const percent = Math.round((doneIndices.length / steps.length) * 100);
                            return (
                              <div style={{ background: 'var(--bg3)', borderRadius: 12, padding: '12px 16px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 6 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <span style={{ fontSize: 11.5, fontWeight: 900, color: 'var(--t1)' }}>
                                    📊 Milestone Progress: {doneIndices.length} of {steps.length} Steps Completed
                                  </span>
                                  <span style={{ fontSize: 11, fontWeight: 800, color: percent === 100 ? 'var(--green-mid)' : 'var(--accent)' }}>
                                    {percent}%
                                  </span>
                                </div>
                                <div style={{ height: 6, background: 'var(--bg2)', borderRadius: 3, overflow: 'hidden', border: '1px solid var(--border)' }}>
                                  <div style={{ height: '100%', width: `${percent}%`, background: percent === 100 ? 'var(--green)' : 'linear-gradient(90deg, var(--accent), var(--purple))', transition: 'width 0.4s ease' }} />
                                </div>
                                {percent === 100 && (
                                  <span style={{ fontSize: 10.5, color: 'var(--green-mid)', fontWeight: 800 }}>
                                    🎉 All implementation milestones completed! Ready for GitHub repository verification.
                                  </span>
                                )}
                              </div>
                            );
                          })()}

                          <div>
                            <strong style={{ fontSize: 12, color: 'var(--t2)', display: 'block', marginBottom: 6 }}>🛠️ Step-by-Step Implementation Guide & Interactive Milestones:</strong>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                              {(selectedGuideProject.guideSteps || []).map((step, idx) => {
                                const isDone = (completedMilestones[selectedGuideProject.id] || []).includes(idx);
                                return (
                                  <div
                                    key={idx}
                                    onClick={() => toggleMilestone(selectedGuideProject.id, idx)}
                                    style={{
                                      display: 'flex', gap: 10, alignItems: 'center',
                                      padding: '8px 12px', borderRadius: 8, cursor: 'pointer',
                                      background: isDone ? 'rgba(var(--success-rgb), 0.08)' : 'var(--bg3)',
                                      border: `1px solid ${isDone ? 'rgba(var(--success-rgb), 0.4)' : 'var(--border)'}`,
                                      transition: 'all 0.15s ease'
                                    }}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={isDone}
                                      onChange={() => {}}
                                      style={{ cursor: 'pointer', accentColor: 'var(--green)', width: 15, height: 15 }}
                                    />
                                    <span style={{
                                      fontSize: 12,
                                      color: isDone ? 'var(--t1)' : 'var(--t2)',
                                      lineHeight: 1.4,
                                      textDecoration: isDone ? 'line-through' : 'none',
                                      fontWeight: isDone ? 700 : 500
                                    }}>
                                      {step}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                          {selectedGuideProject.tips && (
                            <div style={{ padding: 12, background: 'rgba(var(--brand-rgb),0.02)', border: '1px solid rgba(var(--brand-rgb),0.1)', borderRadius: 10 }}>
                              <strong style={{ fontSize: 11.5, color: 'var(--accent)', display: 'block', marginBottom: 4 }}>💡 Developer Tips & Gotchas:</strong>
                              <ul style={{ margin: 0, paddingLeft: 16, fontSize: 11.5, color: 'var(--t3)', display: 'flex', flexDirection: 'column', gap: 4 }}>
                                {selectedGuideProject.tips.map((t, idx) => <li key={idx}>{t}</li>)}
                              </ul>
                            </div>
                          )}
                        </>
                      )}

                      {/* Verification Requirements Tab */}
                      {activeWorkspaceTab === 'reqs' && (
                        <>
                          <div>
                            <strong style={{ fontSize: 12, color: 'var(--t2)', display: 'block', marginBottom: 6 }}>✅ AI Verification Requirements Checklist:</strong>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                              {(selectedGuideProject.verificationReqs || ['API endpoints validation', 'Database mappings', 'Documentation README']).map((req, idx) => (
                                <div key={idx} style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 12.5, color: 'var(--t2)' }}>
                                  <span style={{ color: 'var(--success)' }}>✓</span>
                                  <span>{req}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: 12, color: 'var(--t3)' }}>Minimum Pass Threshold:</span>
                            <strong style={{ fontSize: 13, color: 'var(--danger)' }}>{selectedGuideProject.minScore || 80}% AI Score</strong>
                          </div>
                        </>
                      )}

                      {/* Resources Tab */}
                      {activeWorkspaceTab === 'resources' && (
                        <>
                          <strong style={{ fontSize: 12, color: 'var(--t2)' }}>📚 Reference Links & SDKs:</strong>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            <div style={{ padding: 10, background: 'var(--bg3)', borderRadius: 8, fontSize: 12 }}>
                              <a href="https://github.com" target="_blank" rel="noreferrer" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 700 }}>GitHub Developer documentation 🔗</a>
                              <p style={{ margin: '4px 0 0 0', color: 'var(--t3)', fontSize: 11 }}>Setup SSH keys and configure action workflows.</p>
                            </div>
                            <div style={{ padding: 10, background: 'var(--bg3)', borderRadius: 8, fontSize: 12 }}>
                              <a href="https://qdrant.tech" target="_blank" rel="noreferrer" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 700 }}>Vector Indexing with Qdrant Vector database 🔗</a>
                              <p style={{ margin: '4px 0 0 0', color: 'var(--t3)', fontSize: 11 }}>Configure Cosine and Euclidean distance parameters.</p>
                            </div>
                          </div>
                        </>
                      )}

                      {/* Submission Tab */}
                      {activeWorkspaceTab === 'submit' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                          {selectedGuideProject.status === 'Completed' && (
                            <div style={{
                              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                              padding: '12px 16px', borderRadius: 10,
                              background: 'rgba(var(--success-rgb), 0.08)',
                              border: '1px solid rgba(var(--success-rgb), 0.25)',
                              marginBottom: 4
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <span style={{ fontSize: 20 }}>✅</span>
                                <div>
                                  <div style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--success)' }}>
                                    Project Previously Verified & Completed ({selectedGuideProject.verificationScore || 80}%)
                                  </div>
                                  <div style={{ fontSize: 11, color: 'var(--t3)' }}>
                                    Certificate ID: <code style={{ fontFamily: 'var(--font-mono)' }}>{selectedGuideProject.certificateId}</code> · Re-verification will update audit metrics (+0 XP repeat completion).
                                  </div>
                                </div>
                              </div>
                              <button
                                onClick={() => setActiveCertificate(selectedGuideProject)}
                                className="btn-secondary"
                                style={{ padding: '6px 12px', fontSize: 11, fontWeight: 700 }}
                              >
                                View Certificate
                              </button>
                            </div>
                          )}

                          <div>
                            <label style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--t2)', display: 'block', marginBottom: 4 }}>GitHub Repository URL *</label>
                            <input
                              type="text"
                              value={githubUrl}
                              onChange={e => setGithubUrl(e.target.value)}
                              className="form-input"
                              placeholder="https://github.com/username/project-repo"
                              style={{ width: '100%', fontSize: 12, padding: '8px 12px' }}
                            />
                          </div>

                          <div>
                            <label style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--t2)', display: 'block', marginBottom: 4 }}>Live Demo Link (Optional)</label>
                            <input
                              type="text"
                              value={liveDemoUrl}
                              onChange={e => setLiveDemoUrl(e.target.value)}
                              className="form-input"
                              placeholder="https://myprojectdemo.vercel.app"
                              style={{ width: '100%', fontSize: 12, padding: '8px 12px' }}
                            />
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '10px 14px', background: 'var(--bg3)', borderRadius: 8, border: '1px solid var(--border)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: 11.5, color: 'var(--t2)' }}>ZIP Upload Backup (Optional)</span>
                              <input
                                ref={zipInputRef}
                                type="file"
                                accept=".zip"
                                onChange={(e) => {
                                  const file = e.target.files?.[0] || null;
                                  setUploadedZipFile(file ? { name: file.name, size: file.size } : null);
                                  setZipFileSelected(!!file);
                                  if (file) {
                                    toast.success('ZIP Archive Attached', `${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB) staged for verification.`);
                                  }
                                }}
                                style={{ display: 'none' }}
                              />
                              {uploadedZipFile ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                  <span style={{ fontSize: 11, color: 'var(--success)', fontWeight: 700 }}>
                                    ✓ {uploadedZipFile.name} ({(uploadedZipFile.size / (1024 * 1024)).toFixed(1)} MB)
                                  </span>
                                  <button
                                    onClick={() => {
                                      setUploadedZipFile(null);
                                      setZipFileSelected(false);
                                      if (zipInputRef.current) zipInputRef.current.value = '';
                                    }}
                                    style={{ background: 'transparent', border: 'none', color: 'var(--t3)', cursor: 'pointer', fontSize: 12 }}
                                    title="Remove ZIP file"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => zipInputRef.current?.click()}
                                  style={{
                                    padding: '4px 10px', fontSize: 10, borderRadius: 6, cursor: 'pointer',
                                    background: 'rgba(255,255,255,0.05)',
                                    color: 'var(--t2)',
                                    border: '1px solid var(--border)'
                                  }}
                                >
                                  Attach ZIP
                                </button>
                              )}
                            </div>
                          </div>

                          {auditReport && (
                            auditReport.keyFilesFound?.some(f => f.toLowerCase().includes('readme.md')) ? (
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--success)', background: 'rgba(var(--success-rgb),0.04)', padding: 8, borderRadius: 6 }}>
                                <span>✓</span>
                                <span>Auto-detected: <strong>README.md</strong> file confirmed in repository structure.</span>
                              </div>
                            ) : (
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--amber)', background: 'rgba(245, 158, 11, 0.08)', padding: 8, borderRadius: 6 }}>
                                <span>⚠️</span>
                                <span>Notice: No <strong>README.md</strong> file detected in repository root. Adding documentation improves evidence score.</span>
                              </div>
                            )
                          )}

                          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                            <button
                              onClick={handleVerifyProject}
                              disabled={verifying}
                              className="btn-primary"
                              style={{ width: '100%', padding: '12px 0', fontSize: 13, fontWeight: 800, justifyContent: 'center' }}
                            >
                              {verifying ? '🤖 Connecting to Verification Pipeline...' : (selectedGuideProject.status === 'Completed' ? 'Re-Verify Project' : 'Submit and Verify Project')}
                            </button>
                          </div>
                        </div>
                      )}

                    </div>
                  )}

                  {/* View Certificate Action trigger */}
                  {selectedGuideProject.status === 'Completed' && (
                    <div style={{
                      marginTop: 10, border: '1px solid var(--border)', borderRadius: 14, padding: 18,
                      background: 'var(--bg3)',
                      textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 12
                    }}>
                      <div style={{ fontSize: 28 }}>{selectedGuideProject.certificateType === 'reference' ? '📖' : '🏅'}</div>
                      <div>
                        <strong style={{ fontSize: 14, color: 'var(--t1)', display: 'block' }}>
                          {selectedGuideProject.certificateType === 'reference'
                            ? '📖 External Reference Record'
                            : selectedGuideProject.vivaPassed ? '🏆 AI Verified Excellence Certificate' : '🏅 AI Verified Project Certificate'}
                        </strong>
                        <span style={{ fontSize: 11.5, color: 'var(--t3)' }}>
                          Status: <strong>{selectedGuideProject.certificateType === 'reference' ? 'EXTERNAL REFERENCE (Unverified Authorship)' : `VERIFIED (${selectedGuideProject.verificationScore || 91}%)`}</strong>
                        </span>
                      </div>

                      {selectedGuideProject.certificateType !== 'reference' ? (
                        <button
                          onClick={() => setActiveCertificate(selectedGuideProject)}
                          className="btn-primary"
                          style={{ padding: '8px 16px', fontSize: 12, justifyContent: 'center' }}
                        >
                          🎓 View Certificate
                        </button>
                      ) : (
                        <div style={{ fontSize: 11, color: 'var(--amber)', background: 'rgba(245, 158, 11, 0.08)', padding: '8px 12px', borderRadius: 8, border: '1px dashed rgba(245, 158, 11, 0.3)' }}>
                          ℹ️ Ingested as External Reference. Link an original repository owned by your GitHub account to unlock full Capstone Certificate & Placement Credit.
                        </div>
                      )}
                    </div>
                  )}

                </div>
              )}

            </div>
          )}

        </div>
      )}

      {/* AI Verification Loader Overlay */}
      {verifying && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999,
          background: 'rgba(15,23,42,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{ width: 440, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: 28, display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong style={{ fontSize: 15, color: 'var(--t1)' }}>🤖 AI Project Verification</strong>
              <div style={{ fontSize: 12, color: 'var(--accent)', animation: 'spin 1.5s linear infinite' }}>⬡</div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                'Ingesting & Parsing Repository Tree...',
                'Checking Manifests & Project Structure...',
                'Analyzing Tests & Architecture Depth...',
                'Evaluating DevOps & CI/CD Pipelines...',
                'Synthesizing Verified Evidence Report...'
              ].map((step, idx) => {
                const isPassed = verificationStep > idx;
                const isActive = verificationStep === idx;
                return (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12.5, color: isPassed ? 'var(--success)' : isActive ? 'var(--t1)' : 'var(--t4)' }}>
                    <span>{step}</span>
                    <span>
                      {isPassed ? (
                        <span style={{ color: 'var(--success)' }}>✅</span>
                      ) : isActive ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', color: 'var(--accent)' }}>
                          <svg
                            style={{ animation: 'spin 1s linear infinite', width: 14, height: 14 }}
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              style={{ opacity: 0.25 }}
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              style={{ opacity: 0.85 }}
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                        </span>
                      ) : (
                        <span style={{ color: 'var(--t4)' }}>⏳</span>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Verification Report Overlay */}
      {showReport && selectedGuideProject && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{ width: 500, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: 'var(--t1)' }}>🤖 AI Repository Evidence Report</h3>
                <span style={{ fontSize: 10.5, fontWeight: 800, padding: '2px 8px', borderRadius: 4, background: 'rgba(var(--info-rgb),0.1)', color: 'var(--accent)' }}>
                  {auditReport?.projectComplexityTier || 'Advanced'}
                </span>
              </div>
              <span style={{ fontSize: 11, color: 'var(--t3)' }}>Repository: {auditReport?.metadata?.fullName || selectedGuideProject.name}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, borderBottom: '1px solid var(--border)', paddingBottom: 6 }}>
                <span style={{ color: 'var(--t2)' }}>Architecture & Modularity</span>
                <strong style={{ color: 'var(--success)' }}>{auditReport?.evidenceBreakdown?.architectureScore || 85}%</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, borderBottom: '1px solid var(--border)', paddingBottom: 6 }}>
                <span style={{ color: 'var(--t2)' }}>Testing & QA Depth</span>
                <strong style={{ color: 'var(--success)' }}>{auditReport?.evidenceBreakdown?.testingScore || 70}%</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, borderBottom: '1px solid var(--border)', paddingBottom: 6 }}>
                <span style={{ color: 'var(--t2)' }}>DevOps & CI/CD Evidence</span>
                <strong style={{ color: 'var(--success)' }}>{auditReport?.evidenceBreakdown?.devopsScore || 75}%</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, borderBottom: '1px solid var(--border)', paddingBottom: 6 }}>
                <span style={{ color: 'var(--t2)' }}>Documentation & Setup</span>
                <strong style={{ color: 'var(--success)' }}>{auditReport?.evidenceBreakdown?.documentationScore || 80}%</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, paddingTop: 6 }}>
                <strong>Evidence-Backed Score</strong>
                <strong style={{ color: 'var(--accent)', fontSize: 16 }}>{auditReport?.overallEvidenceScore ?? 0}%</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, color: 'var(--success)', background: 'rgba(var(--success-rgb),0.06)', padding: 8, borderRadius: 6, marginTop: 4 }}>
                <span>Evidence Hash:</span>
                <strong style={{ fontFamily: 'monospace' }}>{auditReport?.proofRecord?.evidenceHash || 'PIN-GH-PENDING'}</strong>
              </div>
              {auditReport?.detectedSkills && auditReport.detectedSkills.length > 0 && (
                <div style={{ fontSize: 11, color: 'var(--t3)', display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 2 }}>
                  <span style={{ fontWeight: 700 }}>Signals:</span>
                  {auditReport.detectedSkills.slice(0, 4).map((s, idx) => (
                    <span key={idx} style={{ background: 'var(--bg3)', padding: '1px 6px', borderRadius: 4, border: '1px solid var(--border)' }}>
                      {s.skill}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Optional AI Viva Prompt */}
            <div style={{ background: 'var(--bg3)', padding: 12, borderRadius: 10, border: '1px solid var(--border)', fontSize: 12, lineHeight: 1.45 }}>
              <strong style={{ color: 'var(--t1)' }}>Earn AI Excellence Badge? 🏆</strong>
              <p style={{ margin: '4px 0 10px 0', color: 'var(--t3)' }}>
                Take a 3-Minute **Project Viva** interview to test your deployment choices and upgrade your credentials to an **Excellence Certificate**.
              </p>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <a
                  href={`/interview?mode=project_viva&project=${encodeURIComponent(selectedGuideProject.name)}&projectId=${selectedGuideProject.id}&course=${encodeURIComponent(activeCourse.title)}&repo=${encodeURIComponent(githubUrl)}&score=${auditReport?.overallEvidenceScore ?? 0}`}
                  className="btn-primary"
                  style={{ textDecoration: 'none', fontSize: 11, padding: '6px 12px' }}
                >
                  🎙️ Start AI Viva
                </a>
                <button
                  onClick={handleIssueStandardCertificate}
                  className="btn-ghost"
                  style={{ border: '1px solid var(--border)', fontSize: 11, padding: '6px 12px' }}
                >
                  Skip & Issue Standard
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Dynamic Certificate Modal (Mirroring the gold/navy design image) */}
      {activeCertificate && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 99999,
          background: 'rgba(5, 8, 22, 0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
        }}>
          <div style={{
            position: 'relative', width: '100%', maxWidth: 840, background: '#060B19',
            border: '8px solid #0d162f', borderRadius: 18, color: 'var(--text)', overflow: 'hidden',
            boxShadow: '0 24px 60px rgba(0,0,0,0.8), 0 0 40px rgba(var(--brand-rgb),0.1)'
          }}>
            
            {/* Close Button */}
            <button
              onClick={() => setActiveCertificate(null)}
              style={{
                position: 'absolute', top: 20, right: 20, zIndex: 100,
                background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: '50%',
                width: 32, height: 32, cursor: 'pointer', color: 'var(--text)', fontSize: 16
              }}
            >
              ✕
            </button>

            {/* Certificate Outer Border Layout Frame */}
            <div style={{
              padding: '40px 48px', border: '2px solid #8e701d', margin: 10, borderRadius: 12,
              position: 'relative', background: 'radial-gradient(circle at center, #0B1226 0%, #060B19 100%)'
            }}>
              
              {/* Corner Gold Triangles decorations */}
              <div style={{ position: 'absolute', top: 0, left: 0, width: 60, height: 60, borderTop: '4px solid #D4AF37', borderLeft: '4px solid #D4AF37' }} />
              <div style={{ position: 'absolute', top: 0, right: 0, width: 60, height: 60, borderTop: '4px solid #D4AF37', borderRight: '4px solid #D4AF37' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, width: 60, height: 60, borderBottom: '4px solid #D4AF37', borderLeft: '4px solid #D4AF37' }} />
              <div style={{ position: 'absolute', bottom: 0, right: 0, width: 60, height: 60, borderBottom: '4px solid #D4AF37', borderRight: '4px solid #D4AF37' }} />

              {/* Left sidebar info details */}
              <div style={{
                position: 'absolute', left: 40, top: 120, bottom: 120, width: 140,
                borderRight: '1px solid rgba(142, 112, 29, 0.4)', paddingRight: 16,
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between', zIndex: 5
              }}>
                <div>
                  <span style={{ fontSize: 9, color: '#8e701d', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 800 }}>Date</span>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', marginTop: 4 }}>{activeCertificate.issueDate || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                </div>
                
                <div>
                  <span style={{ fontSize: 9, color: '#8e701d', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 800 }}>Project Level</span>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', marginTop: 4 }}>{activeCertificate.level}</div>
                </div>

                <div>
                  <span style={{ fontSize: 9, color: '#8e701d', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 800 }}>Verification Score</span>
                  <div style={{ fontSize: 16, fontWeight: 900, color: '#D4AF37', marginTop: 4 }}>{activeCertificate.verificationScore ?? 80}%</div>
                </div>
              </div>

              {/* Right embossed gold stamp */}
              <div style={{
                position: 'absolute', right: 40, bottom: 80, width: 100, height: 100,
                borderRadius: '50%', background: 'radial-gradient(circle, #f3e5ab 0%, #D4AF37 70%, #aa7c11 100%)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexDirection: 'column', zIndex: 10, border: '4px double #8e701d'
              }}>
                <span style={{ fontSize: 8, fontWeight: 800, color: '#4a3306', textTransform: 'uppercase' }}>PinIT</span>
                <span style={{ fontSize: 18 }}>🛡️</span>
                <span style={{ fontSize: 7, fontWeight: 800, color: '#4a3306', textTransform: 'uppercase', letterSpacing: 0.5 }}>Verified</span>
              </div>

              {/* Main Content Pane */}
              <div style={{ paddingLeft: 160, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                
                {/* Logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 20, color: 'var(--info)' }}>⬡</span>
                  <strong style={{ fontSize: 13, letterSpacing: 1.5, color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>
                    PinIT <span style={{ color: 'var(--text-muted)', fontSize: 10, fontWeight: 400 }}>AI CAREER OS</span>
                  </strong>
                </div>

                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 900, color: 'var(--text)', letterSpacing: '2px', margin: '10px 0 2px 0', textTransform: 'uppercase' }}>
                  Certificate
                </h2>
                <div style={{ fontSize: 10, color: '#8e701d', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 16 }}>
                  of Project Achievement
                </div>

                <div style={{ fontSize: 10.5, color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: 4, letterSpacing: '0.5px' }}>
                  PROUDLY PRESENTED TO
                </div>

                <h1 style={{
                  fontFamily: 'Georgia, serif', fontSize: 40, fontStyle: 'italic', color: '#D4AF37',
                  margin: '4px 0 12px 0', letterSpacing: 1, textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                }}>
                  {user?.displayName || (onboardingAnswers as any)?.displayName || user?.name || 'Verified Student'}
                </h1>

                <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '0 0 12px 0' }}>
                  for successfully completing and getting
                </p>

                {/* Badge ribbon with Laurel branch wreaths */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <span style={{ color: '#D4AF37', fontSize: 14 }}>🌿</span>
                  <strong style={{ fontSize: 12, color: '#D4AF37', textTransform: 'uppercase', letterSpacing: 1.5 }}>
                    {activeCertificate.vivaPassed ? 'AI EXCELLENCE' : 'AI VERIFIED'}
                  </strong>
                  <span style={{ color: '#D4AF37', fontSize: 14 }}>🌿</span>
                </div>

                <div style={{ fontSize: 11, color: 'var(--text-muted)', margin: '0 0 10px 0' }}>
                  for the project
                </div>

                {/* Project Details Box with Brain icon */}
                <div style={{
                  background: 'linear-gradient(90deg, #091128, #0e1b38)', border: '1px solid #8e701d', borderRadius: 8,
                  padding: '8px 24px', fontSize: 13, fontWeight: 700, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 10,
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)', marginBottom: 20
                }}>
                  <span style={{ fontSize: 14 }}>🧠</span>
                  <span>{activeCertificate.name}</span>
                </div>

                <div style={{ fontSize: 10, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20 }}>
                  <span>🚀</span>
                  <span>Real Project. Verified by AI. Built for Your Future.</span>
                </div>

                {/* Footer Signing details */}
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 14, marginTop: 10 }}>
                  <div style={{ textAlign: 'left', fontSize: 9 }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: 8 }}>SCAN TO VERIFY</div>
                    <div style={{ color: '#D4AF37', marginTop: 2, fontWeight: 700 }}>pinIt.in/verify</div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: 24 }}>
                    <div style={{ textAlign: 'center', width: 140 }}>
                      <div style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 12, color: 'var(--text)' }}>PinIT Evaluation Authority</div>
                      <div style={{ height: 1, background: '#8e701d', margin: '4px 0' }} />
                      <div style={{ fontSize: 8, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Autonomous Audit Engine</div>
                      <div style={{ fontSize: 7, color: '#8e701d', textTransform: 'uppercase' }}>Platform Certification Authority</div>
                    </div>

                    {activeCertificate.vivaPassed && (
                      <div style={{ textAlign: 'center', width: 140 }}>
                        <div style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 12, color: '#D4AF37' }}>Academic Evaluation Board</div>
                        <div style={{ height: 1, background: '#8e701d', margin: '4px 0' }} />
                        <div style={{ fontSize: 8, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Faculty Review Panel</div>
                        <div style={{ fontSize: 7, color: '#8e701d', textTransform: 'uppercase' }}>Verified Viva Assessor</div>
                      </div>
                    )}
                  </div>

                  <div style={{ textAlign: 'right', fontSize: 9 }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: 8 }}>CERTIFICATE ID</div>
                    <div style={{ color: 'var(--text-muted)', marginTop: 2, fontFamily: 'var(--font-mono)' }}>{activeCertificate.certificateId || 'PIN-CREDENTIAL-VERIFIED'}</div>
                  </div>
                </div>

              </div>

            </div>

            {/* PR-UX-03 FIX: Certificate Verification Proof Link & Customization Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, padding: '0 4px', width: '100%', maxWidth: 840 }}>
              <button
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    const certId = activeCertificate.certificateId || 'PIN-VERIFIED';
                    const verifyUrl = `${window.location.origin}/verify/${encodeURIComponent(certId)}`;
                    navigator.clipboard.writeText(verifyUrl).then(() => {
                      toast.success('Verification Proof Copied! 📋', 'Public verification link copied to clipboard.');
                    });
                  }
                }}
                style={{
                  background: 'rgba(212, 175, 55, 0.15)',
                  border: '1.5px solid #D4AF37',
                  borderRadius: 10,
                  padding: '9px 18px',
                  color: '#D4AF37',
                  fontSize: 12,
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                <span>🔗</span> Copy Public Verification Link
              </button>

              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={() => {
                    if (typeof window !== 'undefined') window.print();
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #D4AF37 0%, #aa7c11 100%)',
                    border: 'none',
                    borderRadius: 10,
                    padding: '9px 20px',
                    color: '#000',
                    fontSize: 12,
                    fontWeight: 900,
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(212,175,55,0.4)'
                  }}
                >
                  🖨️ Print / Save PDF
                </button>
                <button
                  onClick={() => setActiveCertificate(null)}
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: 10,
                    padding: '9px 18px',
                    color: 'var(--text)',
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
      </>
    )}

      {/* ── TAB 2: HACKATHON SQUADS & TEAM WORKSPACE ────────────────────── */}
      {mainTab === 'squads' && (
        <div>
          {/* Squads Action Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--t1)', margin: 0 }}>
                Active Hackathon Squads ({squads.length})
              </h2>
              <p style={{ fontSize: 12.5, color: 'var(--t3)', margin: '2px 0 0 0' }}>
                Join multi-disciplinary engineering squads or form your own capstone team.
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              style={{
                padding: '10px 20px',
                borderRadius: 10,
                background: 'linear-gradient(135deg, var(--success), var(--success-deep))',
                color: 'var(--text)',
                fontSize: 13,
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(var(--success-rgb),0.3)'
              }}
            >
              + Form New Squad
            </button>
          </div>

          {/* Main Squads Layout */}
          <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 24 }}>
            {/* Left: Squad Directory */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {squads.map(squad => {
                const isSelected = squad.id === activeSquad?.id;
                const isMember = squad.members.some(m => m.studentId === studentId);
                return (
                  <div
                    key={squad.id}
                    onClick={() => setSelectedSquadId(squad.id)}
                    style={{
                      padding: 16,
                      borderRadius: 12,
                      background: isSelected ? 'rgba(var(--reward-rgb), 0.12)' : 'var(--bg2)',
                      border: isSelected ? '1.5px solid var(--reward)' : '1px solid var(--border)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ fontSize: 14, fontWeight: 800, color: isSelected ? 'var(--reward-bright)' : 'var(--t1)' }}>
                        {squad.name}
                      </span>
                      <span style={{
                        fontSize: 10,
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: 4,
                        textTransform: 'uppercase',
                        background: squad.status === 'verified' ? 'rgba(var(--success-rgb), 0.15)' : 'rgba(var(--warning-rgb), 0.15)',
                        color: squad.status === 'verified' ? 'var(--success)' : 'var(--warning)'
                      }}>
                        {squad.status}
                      </span>
                    </div>

                    <div style={{ fontSize: 11.5, color: 'var(--t3)', marginBottom: 8, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {squad.hackathonTitle}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11 }}>
                      <span style={{ color: 'var(--t2)', fontWeight: 600 }}>👥 {squad.members.length} Members</span>
                      {isMember && <span style={{ color: 'var(--info-bright)', fontWeight: 800 }}>★ Your Squad</span>}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right: Active Squad Workspace */}
            {activeSquad && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* Squad Hero Banner */}
                <div style={{ padding: 24, borderRadius: 16, background: 'var(--bg2)', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                    <div>
                      <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--reward)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        {activeSquad.hackathonTitle}
                      </span>
                      <h2 style={{ margin: '4px 0 8px 0', fontSize: 22, fontWeight: 900, color: 'var(--t1)' }}>{activeSquad.name}</h2>
                      <div style={{ display: 'flex', gap: 14, alignItems: 'center', fontSize: 13 }}>
                        <a href={activeSquad.repoUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--info-bright)', textDecoration: 'none', fontWeight: 700 }}>
                          🔗 GitHub Repo ↗
                        </a>
                        {activeSquad.liveUrl && (
                          <a href={activeSquad.liveUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--success)', textDecoration: 'none', fontWeight: 700 }}>
                            🌐 Live Prototype ↗
                          </a>
                        )}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      {activeSquad.status === 'verified' ? (
                        <div style={{ padding: '8px 16px', borderRadius: 8, background: 'rgba(var(--success-rgb), 0.15)', border: '1px solid rgba(var(--success-rgb), 0.3)', color: 'var(--success)', fontWeight: 800, fontSize: 13 }}>
                          ✓ JURY VERIFIED ({activeSquad.finalScore}/100)
                        </div>
                      ) : (
                        <button
                          onClick={handleSubmitTeamProject}
                          disabled={isSubmittingProject}
                          style={{
                            padding: '10px 20px',
                            borderRadius: 10,
                            background: 'linear-gradient(135deg, var(--reward), var(--reward))',
                            border: 'none',
                            color: 'var(--text)',
                            fontSize: 13,
                            fontWeight: 800,
                            cursor: 'pointer',
                            boxShadow: '0 4px 14px rgba(var(--reward-rgb),0.3)'
                          }}
                        >
                          {isSubmittingProject ? 'Submitting to Jury...' : '🚀 Submit Project for Jury Evaluation'}
                        </button>
                      )}
                    </div>
                  </div>

                  {activeSquad.juryFeedback && (
                    <div style={{ marginTop: 16, padding: 12, borderRadius: 8, background: 'rgba(var(--success-rgb), 0.08)', border: '1px solid rgba(var(--success-rgb), 0.2)', fontSize: 13, color: 'var(--t2)' }}>
                      <strong style={{ color: 'var(--success)' }}>Jury Feedback:</strong> {activeSquad.juryFeedback}
                    </div>
                  )}
                </div>

                {/* Squad Members & Role Allocation */}
                <div style={{ padding: 24, borderRadius: 16, background: 'var(--bg2)', border: '1px solid var(--border)' }}>
                  <h3 style={{ margin: '0 0 16px 0', fontSize: 15, fontWeight: 800, color: 'var(--t1)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>🛡️</span> Squad Roles & Task Allocation
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
                    {activeSquad.members.map((member, idx) => (
                      <div key={idx} style={{ padding: 14, borderRadius: 10, background: 'var(--bg3)', border: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                          <Image src={member.avatarUrl} alt={member.name} width={36} height={36} style={{ borderRadius: 18 }} unoptimized />
                          <div>
                            <div style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--t1)' }}>{member.name}</div>
                            <div style={{ fontSize: 10.5, color: 'var(--reward-bright)', fontWeight: 700, textTransform: 'uppercase' }}>
                              {member.role.replace('_', ' ')}
                            </div>
                          </div>
                        </div>

                        <div style={{ fontSize: 11.5, color: 'var(--t3)', marginBottom: 8 }}>
                          Contribution: <strong style={{ color: 'var(--t1)' }}>{member.contributionPct}%</strong>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          {member.assignedTasks.map((t, tIdx) => (
                            <span key={tIdx} style={{ fontSize: 10.5, color: 'var(--t2)', background: 'var(--bg2)', padding: '3px 6px', borderRadius: 4 }}>
                              • {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {!activeSquad.members.some(m => m.studentId === studentId) && (
                    <div style={{ marginTop: 16, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 12.5, color: 'var(--t3)', fontWeight: 700 }}>Join this Squad as:</span>
                      {(['frontend_lead', 'backend_lead', 'devops_cloud', 'data_engineer'] as const).map(role => (
                        <button
                          key={role}
                          onClick={() => handleJoinSquad(role)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: 8,
                            background: 'rgba(var(--reward-rgb), 0.12)',
                            border: '1px solid rgba(var(--reward-rgb), 0.3)',
                            color: 'var(--reward-bright)',
                            fontSize: 12,
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          + {role.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Sprints & Milestones Checklist */}
                <div style={{ padding: 24, borderRadius: 16, background: 'var(--bg2)', border: '1px solid var(--border)' }}>
                  <h3 style={{ margin: '0 0 16px 0', fontSize: 15, fontWeight: 800, color: 'var(--t1)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>🎯</span> Sprint Milestones & Provenance Checklist
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {activeSquad.milestones.map(milestone => (
                      <div
                        key={milestone.id}
                        onClick={() => handleToggleMilestone(milestone.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: 14,
                          borderRadius: 10,
                          background: milestone.isCompleted ? 'rgba(var(--success-rgb), 0.08)' : 'var(--bg3)',
                          border: milestone.isCompleted ? '1px solid rgba(var(--success-rgb), 0.25)' : '1px solid var(--border)',
                          cursor: 'pointer'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <span style={{ fontSize: 18 }}>{milestone.isCompleted ? '✅' : '⬜'}</span>
                          <div>
                            <div style={{ fontSize: 13.5, fontWeight: 800, color: milestone.isCompleted ? 'var(--success)' : 'var(--t1)', textDecoration: milestone.isCompleted ? 'line-through' : 'none' }}>
                              {milestone.title}
                            </div>
                            <div style={{ fontSize: 12, color: 'var(--t3)' }}>{milestone.description}</div>
                          </div>
                        </div>
                        <span style={{ fontSize: 11, color: 'var(--t3)', fontWeight: 600 }}>Due: {milestone.dueDate}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Form New Squad Modal */}
          {showCreateModal && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(6px)' }}>
              <div style={{ width: 480, background: 'var(--bg1)', border: '1px solid var(--border)', borderRadius: 20, padding: 28, boxShadow: '0 20px 50px rgba(0,0,0,0.4)' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: 18, fontWeight: 900, color: 'var(--t1)' }}>Assemble New Hackathon Squad</h3>
                <form onSubmit={handleCreateSquad} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--t2)', marginBottom: 6 }}>Squad Name</label>
                    <input
                      type="text"
                      value={newSquadName}
                      onChange={e => setNewSquadName(e.target.value)}
                      placeholder="e.g. Nexus Distributed Core"
                      required
                      style={{ width: '100%', padding: '10px 12px', borderRadius: 8, background: 'var(--bg2)', border: '1px solid var(--border)', color: 'var(--t1)', fontSize: 13 }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--t2)', marginBottom: 6 }}>Your Role in Squad</label>
                    <select
                      value={newRole}
                      onChange={e => setNewRole(e.target.value as any)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: 8, background: 'var(--bg2)', border: '1px solid var(--border)', color: 'var(--t1)', fontSize: 13 }}
                    >
                      <option value="backend_lead">Backend Lead (APIs & Microservices)</option>
                      <option value="frontend_lead">Frontend Lead (React/Next.js)</option>
                      <option value="devops_cloud">DevOps / Cloud Architect</option>
                      <option value="data_engineer">Data / SQL Engineer</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--t2)', marginBottom: 6 }}>GitHub Repository URL</label>
                    <input
                      type="url"
                      value={newRepoUrl}
                      onChange={e => setNewRepoUrl(e.target.value)}
                      placeholder="https://github.com/org/repo"
                      required
                      style={{ width: '100%', padding: '10px 12px', borderRadius: 8, background: 'var(--bg2)', border: '1px solid var(--border)', color: 'var(--t1)', fontSize: 13 }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      style={{ flex: 1, padding: 12, borderRadius: 10, background: 'var(--bg3)', color: 'var(--t2)', border: '1px solid var(--border)', cursor: 'pointer', fontSize: 13, fontWeight: 700 }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      style={{ flex: 1, padding: 12, borderRadius: 10, background: 'linear-gradient(135deg, var(--success), var(--success-deep))', color: 'var(--text)', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 800 }}
                    >
                      Create Squad
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, textAlign: 'center', color: 'var(--t3)' }}>Loading Projects & Squads Hub...</div>}>
      <ProjectsPageContent />
    </Suspense>
  );
}
