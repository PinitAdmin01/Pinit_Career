'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
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
import { capstoneInterviewPath } from '@/lib/interview/capstoneInterview';
import { api, ApiError } from '@/lib/api/client';
import { CapstoneNextStep } from './CapstoneNextStep';
import { CourseProjectProgressBar } from '@/components/projects/CourseProjectProgressBar';
import { InnovationHub } from '@/components/projects/InnovationHub';
import { PathwayApiService } from '@/lib/api/pathwayApi';
import {
  TeamsApiService,
  HackathonSquad,
  TeamRole
} from '@/lib/api/teamsApi';

export type ProjectPathway = 'certification' | 'roadmap' | 'standalone' | 'independent';

function ProjectsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = (searchParams?.get('tab') === 'squads' || searchParams?.get('tab') === 'innovation' || Boolean(searchParams?.get('join'))) ? 'innovation' : 'projects';
  const [mainTab, setMainTab] = useState<'projects' | 'innovation'>(initialTab);

  // If user navigates with innovation / squad params, redirect to dedicated /innovation-hub route
  useEffect(() => {
    const tabParam = searchParams?.get('tab');
    const joinParam = searchParams?.get('join');
    if (tabParam === 'squads' || tabParam === 'innovation' || Boolean(joinParam)) {
      router.replace('/innovation-hub' + (joinParam ? `?join=${encodeURIComponent(joinParam)}` : ''));
    }
  }, [searchParams, router]);

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

  // ── TASK 2 & 3: PATHWAY SELECTION & OWN PROJECT STATE ────────────────────────
  const [selectedPathway, setSelectedPathway] = useState<ProjectPathway>('certification');

  // Load saved pathway choice
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const saved = localStorage.getItem('pinit_selected_project_pathway') as ProjectPathway | null;
      if (saved && ['certification', 'roadmap', 'standalone', 'independent'].includes(saved)) {
        setSelectedPathway(saved);
      }
    } catch {}
  }, []);

  const handleSelectPathway = (p: ProjectPathway) => {
    setSelectedPathway(p);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('pinit_selected_project_pathway', p);
      } catch {}
    }
  };

  // Own Project Modal State
  const [showOwnProjectModal, setShowOwnProjectModal] = useState<boolean>(false);
  const [ownProjectStep, setOwnProjectStep] = useState<'confirm' | 'form'>('confirm');
  const [ownProjectName, setOwnProjectName] = useState<string>('');
  const [ownProjectRepoUrl, setOwnProjectRepoUrl] = useState<string>('');
  const [ownProjectTechStack, setOwnProjectTechStack] = useState<string>('Python, FastAPI, Docker, Pytest');
  const [ownProjectDesc, setOwnProjectDesc] = useState<string>('');

  const handleCreateOwnProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownProjectName.trim()) {
      toast.error('Project Name Required', 'Please enter a name for your independent project.');
      return;
    }
    if (!ownProjectRepoUrl.trim()) {
      toast.error('Repository URL Required', 'Please enter your GitHub repository URL.');
      return;
    }

    const check = parseAndValidateGithubUrl(ownProjectRepoUrl.trim());
    if (!check.valid) {
      toast.error('Invalid GitHub Repository', check.error || 'Please enter a valid GitHub repository URL.');
      return;
    }

    const newCustomProject: Project = {
      id: `custom_proj_${Date.now()}`,
      name: ownProjectName.trim(),
      level: 'Beginner',
      description: ownProjectDesc.trim() || 'Custom independent project authored outside standard curriculum milestones.',
      techStack: ownProjectTechStack.trim() || 'Custom Stack',
      problem: 'Independent software design challenge implemented directly by student.',
      deliverable: 'Production GitHub repository with automated tests and CI deployment.',
      xpReward: 350,
      status: 'In Progress',
      githubLink: ownProjectRepoUrl.trim(),
      guideSteps: [
        'Initialize local git repository and connect remote GitHub origin.',
        'Implement architecture baseline and verify local test suite.',
        'Push commits to GitHub and verify evidence report.'
      ],
      tips: ['Maintain clear commit messages and tag stable releases with semantic versioning.'],
      verificationReqs: [
        'Must contain valid GitHub repository URL.',
        'Must contain non-empty commits and readable README.md.'
      ],
      minScore: 80,
      isTemplate: false,
    };

    const updated = [newCustomProject, ...projects];
    saveProjects(updated);
    setSelectedGuideProject(newCustomProject);
    setSelectedPathway('independent');
    setShowOwnProjectModal(false);
    setOwnProjectStep('confirm');
    setOwnProjectName('');
    setOwnProjectRepoUrl('');
    setOwnProjectDesc('');
    toast.success('Custom Project Linked! 🚀', `Linked ${newCustomProject.name} to GitHub.`);
  };

  // PR-UX-01 FIX: Interactive milestone checklist state with persistent storage
  const [completedMilestones, setCompletedMilestones] = useState<Record<string, number[]>>({});

  // PR-UX-02 FIX: In-memory & session-level GitHub verification audit cache
  const verificationCacheRef = useRef<Map<string, { report: any; timestamp: number }>>(new Map());

  const { user } = useAuth();
  const studentId = (user && typeof user.id === 'string') ? user.id : 'demo_student_01';
  const studentName = (user && typeof (user as any).name === 'string') ? (user as any).name : 'Current Student';
  const cOS = useCareerOS();

  const {
    completedQuests,
    onboardingAnswers,
    applyServerXp,
    earnPins,
    saveCareerProjects,
    spendPins,
    pins,
    activeCourseId: cOsCourseId,
    setActiveCourseId: cOsSetActiveCourseId
  } = cOS;

  const educationStr = String(user?.education || (onboardingAnswers as any)?.education || 'B.Tech in Computer Science');
  const degree = educationStr.split(' at ')[0] || 'B.Tech';

  // Dynamic Course Resolution: Honors standalone courses (e.g. Python 30-Day), custom roadmaps & certifications
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');

  const activeCourse = React.useMemo(() => {
    // 1. Explicit user selection in this view
    if (selectedCourseId) {
      const found = COURSES_CATALOG.find(c => c.id === selectedCourseId);
      if (found) return found;
    }

    // 2. Query param: /projects?courseId=...
    const qCourse = searchParams?.get('courseId');
    if (qCourse) {
      const found = COURSES_CATALOG.find(c => c.id === qCourse || c.id.toLowerCase() === qCourse.toLowerCase());
      if (found) return found;
    }

    // 3. CareerOS context active course
    if (cOsCourseId) {
      const found = COURSES_CATALOG.find(c => c.id === cOsCourseId);
      if (found) return found;
    }

    // 4. Onboarding answers activeCourseId or enrolled course
    const obCourse = onboardingAnswers?.activeCourseId || (onboardingAnswers as any)?.selected_course || (onboardingAnswers as any)?.enrolled_course;
    if (obCourse) {
      const found = COURSES_CATALOG.find(c => c.id === obCourse);
      if (found) return found;
    }

    // 5. Client localStorage (Quests view storage & active course)
    if (typeof window !== 'undefined') {
      try {
        const viewRaw = localStorage.getItem(`pinit_${studentId}_quests_view`) || localStorage.getItem('pinit_quests_view');
        if (viewRaw) {
          const parsed = JSON.parse(viewRaw);
          const targetId = parsed?.activeCourseId || parsed?.selectedStandaloneCourseId || parsed?.selectedCertTrackId || parsed?.courseId || parsed?.extraId;
          if (targetId) {
            const found = COURSES_CATALOG.find(c => c.id === targetId || c.id.toLowerCase() === String(targetId).toLowerCase());
            if (found) return found;
          }
        }

        const crashRaw = localStorage.getItem('pinit_active_crash_enrollment');
        if (crashRaw) {
          const parsed = JSON.parse(crashRaw);
          const trackCourseMap: Record<string, string> = {
            python: 'course-python-backend',
            web_fullstack: 'course-react-web',
            cloud: 'course-cloud-native',
            data: 'course-database-eng',
            ai: 'course-ai-eng',
          };
          const resolved = trackCourseMap[parsed?.track] || parsed?.courseId;
          if (resolved) {
            const found = COURSES_CATALOG.find(c => c.id === resolved);
            if (found) return found;
          }
        }

        const directActive = localStorage.getItem(`pinit_${studentId}_active_course_id`) ||
                             localStorage.getItem('pinit_active_course') ||
                             localStorage.getItem(`pinit_${studentId}_selected_course`) ||
                             localStorage.getItem('pinit_last_selected_course');
        if (directActive) {
          const found = COURSES_CATALOG.find(c => c.id === directActive || c.id.toLowerCase() === String(directActive).toLowerCase());
          if (found) return found;
        }
      } catch {}
    }

    // 6. Detect from completed or attempted quests
    if (completedQuests && completedQuests.length > 0) {
      const questBlob = completedQuests.join(' ').toLowerCase();
      if (questBlob.includes('python') || questBlob.includes('py-')) {
        const py = COURSES_CATALOG.find(c => c.id === 'course-python-backend');
        if (py) return py;
      }
      if (questBlob.includes('react') || questBlob.includes('jsx')) {
        const react = COURSES_CATALOG.find(c => c.id === 'course-react-web');
        if (react) return react;
      }
      if (questBlob.includes('node') || questBlob.includes('express')) {
        const node = COURSES_CATALOG.find(c => c.id === 'course-node-web');
        if (node) return node;
      }
    }

    // 7. Detect from career goal / onboarding role
    const goalStr = String(onboardingAnswers?.role || '').toLowerCase();
    if (goalStr.includes('python') || goalStr.includes('fastapi') || goalStr.includes('django')) {
      const py = COURSES_CATALOG.find(c => c.id === 'course-python-backend');
      if (py) return py;
    }
    if (goalStr.includes('react') || goalStr.includes('frontend')) {
      const react = COURSES_CATALOG.find(c => c.id === 'course-react-web');
      if (react) return react;
    }
    if (goalStr.includes('ai') || goalStr.includes('machine learning') || goalStr.includes('data')) {
      const ai = COURSES_CATALOG.find(c => c.id === 'course-ai-eng');
      if (ai) return ai;
    }

    // 8. Default to Python Programming & Backend Systems (foundational curriculum)
    const pyDefault = COURSES_CATALOG.find(c => c.id === 'course-python-backend');
    return pyDefault || COURSES_CATALOG[0];
  }, [selectedCourseId, searchParams, cOsCourseId, onboardingAnswers, studentId, completedQuests]);

  const activeCourseId = activeCourse.id;

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
  // ── TASK 2 & 3: PATHWAY METRICS & GATING INVARIANTS ──────────────────────────
  // Active definition: user completed at least 1 day of work
  // Milestone definition: user completed at least 3 quests or 25% progress or admin/teacher
  
  // 1. Certification Track Metrics
  const certCompletedDays = completedCount;
  const certActive = certCompletedDays >= 1;
  const certMilestoneReached = certCompletedDays >= 3 || progressPercent >= 25 || user?.role === 'admin' || user?.role === 'teacher';

  // 2. Custom Roadmap Track Metrics
  const roadmapCustomDays = completedQuests ? completedQuests.filter(q => q.startsWith('rm-') || q.startsWith('custom-') || q.startsWith('roadmap-')).length : 0;
  const roadmapCompletedDays = roadmapCustomDays > 0 ? roadmapCustomDays : (Boolean(roadmapCtx) ? 1 : 0);
  const roadmapActive = roadmapCompletedDays >= 1;
  const roadmapMilestoneReached = roadmapCompletedDays >= 3 || user?.role === 'admin' || user?.role === 'teacher';

  // 3. Standalone Course Track Metrics
  const standaloneCustomDays = completedQuests ? completedQuests.filter(q => q.includes('standalone') || q.includes('crash') || q.includes('python-d') || q.includes('fast-')).length : 0;
  const standaloneCompletedDays = standaloneCustomDays > 0 ? standaloneCustomDays : (completedCount > 0 && (selectedCourseId.includes('standalone') || selectedCourseId.includes('crash')) ? completedCount : 0);
  const standaloneActive = standaloneCompletedDays >= 1;
  const standaloneMilestoneReached = standaloneCompletedDays >= 3 || user?.role === 'admin' || user?.role === 'teacher';

  // 4. Independent Track Metrics
  const independentProjects = projects.filter(p => !p.isTemplate || Boolean(p.githubLink) || p.id.startsWith('custom_proj_'));
  const independentActive = independentProjects.length > 0;
  const independentMilestoneReached = true;

  // Active Pathway Status Resolution
  const isPathwayActive =
    selectedPathway === 'certification' ? certActive :
    selectedPathway === 'roadmap' ? roadmapActive :
    selectedPathway === 'standalone' ? standaloneActive :
    independentActive;

  const isPathwayMilestoneReached =
    selectedPathway === 'certification' ? certMilestoneReached :
    selectedPathway === 'roadmap' ? roadmapMilestoneReached :
    selectedPathway === 'standalone' ? standaloneMilestoneReached :
    independentMilestoneReached;

  const isUnlocked = isPathwayMilestoneReached;

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

    // Auto-seed projects for active course if still empty
    if (saved.length === 0) {
      const initialProjects = getDomainFallback(
        selectedGoal,
        [],
        'Undergraduate',
        activeCourse.id
      );
      if (initialProjects && initialProjects.length > 0) {
        setProjects(initialProjects as Project[]);
        setSelectedGuideProject(initialProjects[0] as Project);
        saveCareerProjects(initialProjects);
      }
    }
  }, [user?.id, answerProjects, legacyAnswerProjects, saveCareerProjects, activeCourse.id, selectedGoal]);

  // Roadmap journey certificate: the server re-verifies roadmap, capstone and interview, then issues it.
  const [issuingCertificate, setIssuingCertificate] = useState(false);
  const handleGetRoadmapCertificate = async (project: Project) => {
    setIssuingCertificate(true);
    try {
      const res = await api.post<{ ok: boolean; certificate?: { id: string; verifyPath: string; issuedAt: string } }>(
        '/api/certificates/roadmap',
        { projectId: project.id }
      );
      if (!res?.certificate) throw new Error('No certificate returned');
      const cert = res.certificate;
      saveProjects(projects.map((p) => (p.id === project.id ? { ...p, certificateId: cert.id, issueDate: cert.issuedAt } : p)));
      toast.success('Certificate issued 🏅', `Verifiable at /verify/${cert.id}`);
      router.push(cert.verifyPath);
    } catch (err: unknown) {
      toast.error('Certificate not issued', err instanceof ApiError ? err.message : 'Please try again.');
    } finally {
      setIssuingCertificate(false);
    }
  };

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
          (onboardingAnswers as any)?.experience || (onboardingAnswers as any)?.codingExperience || 'Undergraduate',
          activeCourse.id
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
      // The server grants the project XP for its own signed audit result, once per repository.
      if (earnedXp > 0) {
        const xpLabel = `${isAuthored ? 'Completed Project' : 'Linked Reference Project'}: ${selectedGuideProject.name}`;
        api.post<{ ok: boolean; xpAwarded?: number; newXp?: number }>('/api/projects/xp', {
          repoUrl: githubUrl.trim(),
          score,
          authored: isAuthored,
          rewardToken: auditReport.rewardToken,
        })
          .then((res) => applyServerXp(res?.newXp, res?.xpAwarded ?? 0, xpLabel))
          .catch((err: unknown) => toast.info('Project XP not added', err instanceof Error && err.message ? err.message : 'Verify the repository again and retry.'));
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
    <div style={{ maxWidth: 1340, margin: '0 auto', padding: '0 0 40px' }} className="fade-in">
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 26.5, fontWeight: 900, color: 'var(--t1)', letterSpacing: '-0.3px' }}>Projects & Course Capstones</h1>
          <p style={{ margin: '4px 0 0 0', fontSize: 14.5, color: 'var(--t3)' }}>
            Select your learning pathway, reach course milestones, or connect your own GitHub repository for automated evidence verification.
          </p>
        </div>
        <button
          onClick={() => {
            setOwnProjectStep('confirm');
            setShowOwnProjectModal(true);
          }}
          data-testid="start-own-project-btn"
          style={{
            padding: '10px 20px',
            borderRadius: 12,
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            color: '#fff',
            fontSize: 14,
            fontWeight: 800,
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            transition: 'all 0.15s ease'
          }}
        >
          <span>🛠️</span>
          <span>+ Start Your Own Project</span>
        </button>
      </div>

      {/* ── PATHWAY SELECTOR: 4 PATHWAYS ── */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 10 }}>
          Choose Your Project Pathway
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
          {/* Card 1: Certification Course */}
          <div
            onClick={() => handleSelectPathway('certification')}
            data-testid="pathway-card-certification"
            style={{
              padding: 16,
              borderRadius: 16,
              cursor: 'pointer',
              background: selectedPathway === 'certification' ? 'var(--card)' : 'var(--bg2)',
              border: selectedPathway === 'certification' ? '2px solid var(--accent)' : '1px solid var(--border)',
              boxShadow: selectedPathway === 'certification' ? '0 0 0 3px rgba(99, 102, 241, 0.15)' : 'none',
              transition: 'all 0.2s ease',
              position: 'relative'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 24 }}>🎓</span>
              <span style={{
                fontSize: 11,
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: 20,
                background: certActive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(148, 163, 184, 0.15)',
                color: certActive ? '#10b981' : 'var(--t3)'
              }}>
                {certActive ? '● Active' : '○ Inactive'}
              </span>
            </div>
            <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--t1)', marginBottom: 4 }}>Certification Course</div>
            <div style={{ fontSize: 12.5, color: 'var(--t3)', marginBottom: 10, lineHeight: 1.4 }}>
              Accredited degree curriculum ({activeCourse.title})
            </div>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: certMilestoneReached ? '#10b981' : 'var(--t2)' }}>
              {certMilestoneReached ? '✓ Milestone 1 Met' : `${certCompletedDays}/3 Quests to Milestone 1`}
            </div>
          </div>

          {/* Card 2: Custom Roadmap */}
          <div
            onClick={() => handleSelectPathway('roadmap')}
            data-testid="pathway-card-roadmap"
            style={{
              padding: 16,
              borderRadius: 16,
              cursor: 'pointer',
              background: selectedPathway === 'roadmap' ? 'var(--card)' : 'var(--bg2)',
              border: selectedPathway === 'roadmap' ? '2px solid var(--accent)' : '1px solid var(--border)',
              boxShadow: selectedPathway === 'roadmap' ? '0 0 0 3px rgba(99, 102, 241, 0.15)' : 'none',
              transition: 'all 0.2s ease',
              position: 'relative'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 24 }}>🗺️</span>
              <span style={{
                fontSize: 11,
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: 20,
                background: roadmapActive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(148, 163, 184, 0.15)',
                color: roadmapActive ? '#10b981' : 'var(--t3)'
              }}>
                {roadmapActive ? '● Active' : '○ Inactive'}
              </span>
            </div>
            <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--t1)', marginBottom: 4 }}>Custom Roadmap</div>
            <div style={{ fontSize: 12.5, color: 'var(--t3)', marginBottom: 10, lineHeight: 1.4 }}>
              Personalized AI skill progression track
            </div>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: roadmapMilestoneReached ? '#10b981' : 'var(--t2)' }}>
              {roadmapMilestoneReached ? '✓ Milestone 1 Met' : `${roadmapCompletedDays}/3 Quests to Milestone 1`}
            </div>
          </div>

          {/* Card 3: Standalone Course */}
          <div
            onClick={() => handleSelectPathway('standalone')}
            data-testid="pathway-card-standalone"
            style={{
              padding: 16,
              borderRadius: 16,
              cursor: 'pointer',
              background: selectedPathway === 'standalone' ? 'var(--card)' : 'var(--bg2)',
              border: selectedPathway === 'standalone' ? '2px solid var(--accent)' : '1px solid var(--border)',
              boxShadow: selectedPathway === 'standalone' ? '0 0 0 3px rgba(99, 102, 241, 0.15)' : 'none',
              transition: 'all 0.2s ease',
              position: 'relative'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 24 }}>⚡</span>
              <span style={{
                fontSize: 11,
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: 20,
                background: standaloneActive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(148, 163, 184, 0.15)',
                color: standaloneActive ? '#10b981' : 'var(--t3)'
              }}>
                {standaloneActive ? '● Active' : '○ Inactive'}
              </span>
            </div>
            <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--t1)', marginBottom: 4 }}>Standalone Course</div>
            <div style={{ fontSize: 12.5, color: 'var(--t3)', marginBottom: 10, lineHeight: 1.4 }}>
              Focused skill sprint (Python, Docker, Web)
            </div>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: standaloneMilestoneReached ? '#10b981' : 'var(--t2)' }}>
              {standaloneMilestoneReached ? '✓ Milestone 1 Met' : `${standaloneCompletedDays}/3 Quests to Milestone 1`}
            </div>
          </div>

          {/* Card 4: Independent Project */}
          <div
            onClick={() => handleSelectPathway('independent')}
            data-testid="pathway-card-independent"
            style={{
              padding: 16,
              borderRadius: 16,
              cursor: 'pointer',
              background: selectedPathway === 'independent' ? 'var(--card)' : 'var(--bg2)',
              border: selectedPathway === 'independent' ? '2px solid var(--accent)' : '1px solid var(--border)',
              boxShadow: selectedPathway === 'independent' ? '0 0 0 3px rgba(99, 102, 241, 0.15)' : 'none',
              transition: 'all 0.2s ease',
              position: 'relative'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 24 }}>🛠️</span>
              <span style={{
                fontSize: 11,
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: 20,
                background: independentActive ? 'rgba(99, 102, 241, 0.15)' : 'rgba(148, 163, 184, 0.15)',
                color: independentActive ? 'var(--accent)' : 'var(--t3)'
              }}>
                {independentActive ? `${independentProjects.length} Custom` : 'Custom'}
              </span>
            </div>
            <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--t1)', marginBottom: 4 }}>Independent Project</div>
            <div style={{ fontSize: 12.5, color: 'var(--t3)', marginBottom: 10, lineHeight: 1.4 }}>
              Custom software with direct GitHub link
            </div>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--accent)' }}>
              Bypass Course Milestones
            </div>
          </div>
        </div>
      </div>

      {/* ── ACTIVE TRACK SELECTOR (FOR CERTIFICATION PATHWAY) ── */}
      {selectedPathway === 'certification' && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
            marginBottom: 16,
            padding: '12px 18px',
            borderRadius: 14,
            background: 'var(--card)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-sm, 0 1px 3px rgba(0,0,0,0.06))'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 800,
                color: 'var(--accent)',
                background: 'var(--accent-light, rgba(99, 102, 241, 0.12))',
                border: '1px solid var(--border2)',
                padding: '3px 8px',
                borderRadius: 6,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                fontFamily: 'var(--font-mono, monospace)'
              }}
            >
              Active Learning Track
            </span>
            <span style={{ fontSize: 18 }}>{activeCourse.icon}</span>
            <strong style={{ fontSize: 15, color: 'var(--t1)' }}>{activeCourse.title}</strong>
            <span style={{ fontSize: 12, color: 'var(--t3)' }}>({activeCourse.difficulty} • {activeCourse.durationWeeks} Weeks)</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <label htmlFor="course-track-selector" style={{ fontSize: 12.5, color: 'var(--t2)', fontWeight: 700 }}>
              Switch Track / Course:
            </label>
            <select
              id="course-track-selector"
              value={activeCourse.id}
              onChange={(e) => {
                const newId = e.target.value;
                setSelectedCourseId(newId);
                cOsSetActiveCourseId?.(newId);
                if (typeof window !== 'undefined') {
                  try {
                    localStorage.setItem(`pinit_${studentId}_active_course_id`, newId);
                  } catch {}
                }
                const courseObj = COURSES_CATALOG.find(c => c.id === newId);
                const newProjs = getDomainFallback(selectedGoal, [], degree, newId);
                if (newProjs && newProjs.length > 0) {
                  setProjects(newProjs as Project[]);
                  setSelectedGuideProject(newProjs[0] as Project);
                  saveCareerProjects(newProjs);
                  toast.success('Track Switched 🎯', `Now viewing capstones for ${courseObj?.title || newId}`);
                }
              }}
              style={{
                padding: '6px 12px',
                borderRadius: 8,
                background: 'var(--bg3)',
                border: '1px solid var(--border2)',
                color: 'var(--t1)',
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
                outline: 'none',
                fontFamily: 'inherit'
              }}
            >
              {COURSES_CATALOG.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.icon} {c.title} ({c.difficulty})
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* ── PATHWAY STATUS & GATING ── */}
      {!isPathwayActive ? (
        /* INACTIVE PATHWAY VIEW */
        <div
          data-testid="inactive-pathway-card"
          style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 20,
            padding: '48px 24px',
            textAlign: 'center',
            margin: '20px 0',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ fontSize: 52, marginBottom: 16 }}>⏳</div>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: 'var(--t1)', marginBottom: 8 }}>
            {selectedPathway === 'certification' ? 'Certification Course Pathway Inactive' :
             selectedPathway === 'roadmap' ? 'Custom Roadmap Inactive' :
             selectedPathway === 'standalone' ? 'Standalone Course Inactive' : 'No Independent Project Configured'}
          </h2>
          <p style={{ fontSize: 15, color: 'var(--t2)', maxWidth: 540, margin: '0 auto 24px', lineHeight: 1.6 }}>
            {selectedPathway === 'certification' ? `You have not completed any coursework for ${activeCourse.title} yet. To activate this pathway and unlock capstones, you must complete at least Day 1 of coursework in Quests.` :
             selectedPathway === 'roadmap' ? 'You have not started or completed any quests on your personalized AI roadmap. Complete at least Day 1 in Quests to activate this track.' :
             selectedPathway === 'standalone' ? 'No active standalone course progress detected. Complete at least Day 1 of a standalone track to activate.' :
             'You have not initialized an independent project yet. Click "+ Start Your Own Project" to link your GitHub repository.'}
          </p>
          <button
            onClick={() => {
              if (selectedPathway === 'independent') {
                setOwnProjectStep('confirm');
                setShowOwnProjectModal(true);
              } else {
                router.push('/quests');
              }
            }}
            data-testid="start-day-1-btn"
            style={{
              padding: '12px 28px',
              borderRadius: 12,
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#fff',
              fontSize: 15,
              fontWeight: 800,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)'
            }}
          >
            {selectedPathway === 'independent' ? '🛠️ Link GitHub Repository' : '🚀 Start Day 1 in Quests'}
          </button>
        </div>
      ) : !isPathwayMilestoneReached ? (
        /* ACTIVE BUT BELOW MILESTONE VIEW */
        <div
          data-testid="milestone-locked-card"
          style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 20,
            padding: '36px 28px',
            margin: '20px 0',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
            <span style={{
              fontSize: 12,
              fontWeight: 800,
              padding: '4px 10px',
              borderRadius: 8,
              background: 'rgba(245, 158, 11, 0.15)',
              color: '#f59e0b',
              border: '1px solid rgba(245, 158, 11, 0.3)'
            }}>
              ● Pathway Active • Milestone 1 In Progress
            </span>
            <span style={{ fontSize: 13, color: 'var(--t3)', fontWeight: 600 }}>
              {selectedPathway === 'certification' ? `${certCompletedDays} of 3 Quests Completed` :
               selectedPathway === 'roadmap' ? `${roadmapCompletedDays} of 3 Quests Completed` :
               `${standaloneCompletedDays} of 3 Quests Completed`}
            </span>
          </div>

          <h2 style={{ fontSize: 22, fontWeight: 900, color: 'var(--t1)', marginBottom: 8 }}>
            Milestone 1 Required to Unlock Project Workspace
          </h2>
          <p style={{ fontSize: 14.5, color: 'var(--t2)', maxWidth: 650, margin: '0 0 24px', lineHeight: 1.6 }}>
            You have successfully activated this learning pathway! However, to ensure you have the architectural foundation required to build, the hands-on project workspace unlocks at <strong>Milestone 1 (3 Quests Completed)</strong>.
          </p>

          {/* Milestone Stepper */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 28 }}>
            <div style={{ padding: 14, borderRadius: 12, background: 'var(--bg2)', border: '1px solid #10b981' }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#10b981', marginBottom: 4 }}>✓ DAY 1 • COMPLETED</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--t1)' }}>Pathway Activated</div>
              <div style={{ fontSize: 12, color: 'var(--t3)', marginTop: 2 }}>Core syntax & baseline environment setup</div>
            </div>
            <div style={{
              padding: 14,
              borderRadius: 12,
              background: 'var(--bg2)',
              border: (selectedPathway === 'certification' ? certCompletedDays : selectedPathway === 'roadmap' ? roadmapCompletedDays : standaloneCompletedDays) >= 2 ? '1px solid #10b981' : '1px solid var(--border)'
            }}>
              <div style={{
                fontSize: 12,
                fontWeight: 800,
                color: (selectedPathway === 'certification' ? certCompletedDays : selectedPathway === 'roadmap' ? roadmapCompletedDays : standaloneCompletedDays) >= 2 ? '#10b981' : 'var(--accent)',
                marginBottom: 4
              }}>
                {(selectedPathway === 'certification' ? certCompletedDays : selectedPathway === 'roadmap' ? roadmapCompletedDays : standaloneCompletedDays) >= 2 ? '✓ DAY 2 • COMPLETED' : '⏳ DAY 2 • IN PROGRESS'}
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--t1)' }}>System Architecture</div>
              <div style={{ fontSize: 12, color: 'var(--t3)', marginTop: 2 }}>Data flow, abstractions & API structures</div>
            </div>
            <div style={{ padding: 14, borderRadius: 12, background: 'var(--bg2)', border: '1.5px dashed var(--border)' }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--t3)', marginBottom: 4 }}>🔒 DAY 3 • MILESTONE 1</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--t1)' }}>Capstone Workspace Unlock</div>
              <div style={{ fontSize: 12, color: 'var(--t3)', marginTop: 2 }}>Unlocks full repository testing & submission</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              onClick={() => router.push('/quests')}
              data-testid="continue-quests-btn"
              style={{
                padding: '12px 24px',
                borderRadius: 12,
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                color: '#fff',
                fontSize: 14.5,
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)'
              }}
            >
              ⚡ Continue Quests to Reach Milestone 1
            </button>
            <button
              onClick={() => {
                setOwnProjectStep('confirm');
                setShowOwnProjectModal(true);
              }}
              style={{
                padding: '12px 20px',
                borderRadius: 12,
                background: 'transparent',
                color: 'var(--t2)',
                fontSize: 14,
                fontWeight: 700,
                border: '1px solid var(--border)',
                cursor: 'pointer'
              }}
            >
              Or Start Your Own Independent Project →
            </button>
          </div>

          {/* Locked Capstone Previews */}
          <div style={{ marginTop: 32, borderTop: '1px solid var(--border)', paddingTop: 24 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 12 }}>
              Upcoming Capstone Projects You Will Unlock
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
              {projects.slice(0, 3).map((p, idx) => (
                <div key={p.id || idx} style={{ padding: 16, borderRadius: 14, background: 'var(--bg2)', border: '1px solid var(--border)', opacity: 0.85 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase' }}>{p.level}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--t3)' }}>🔒 Milestone 1</span>
                  </div>
                  <div style={{ fontSize: 14.5, fontWeight: 800, color: 'var(--t1)', marginBottom: 4 }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--t3)', lineHeight: 1.4, marginBottom: 8 }}>{p.problem || p.description}</div>
                  <div style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--t2)' }}>{p.techStack}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* UNLOCKED FULL PROJECT WORKSPACE */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Course Project Progress Bar */}
          <CourseProjectProgressBar
            courseName={activeCourse?.title || 'Cloud & Distributed Systems Engineering'}
            careerGoal={selectedGoal}
            projects={projects}
            courseProgressPercent={progressPercent}
            onStartCustomProject={() => {
              setOwnProjectStep('confirm');
              setShowOwnProjectModal(true);
            }}
            onSelectProject={(proj) => {
              setSelectedGuideProject(proj);
              setActiveWorkspaceTab('overview');
            }}
          />
          {/* Roadmap journey: verified capstone → capstone interview → certificate */}
          <CapstoneNextStep
            projects={projects}
            onStartInterview={(p) => router.push(capstoneInterviewPath(p.id))}
            onGetCertificate={handleGetRoadmapCertificate}
            onViewCertificate={(id) => router.push(`/verify/${encodeURIComponent(id)}`)}
            issuing={issuingCertificate}
          />
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
                          <span style={{ fontSize: 10.5, fontFamily: 'var(--font-mono)', background: 'var(--bg3)', padding: '2px 6px', borderRadius: 4, fontWeight: 900, color: borderColors[p.level], border: `1px solid ${borderColors[p.level]}40` }}>
                            {p.level === 'Beginner' ? 'P1' : p.level === 'Intermediate' ? 'P2' : p.level === 'Advanced' ? 'P3 ⚡' : p.level === 'Enterprise' ? 'P4' : 'P5'} · {p.level.toUpperCase()}
                          </span>
                          {p.level === 'Advanced' && (
                            <span style={{ fontSize: 9.5, fontFamily: 'var(--font-mono)', background: 'rgba(var(--danger-rgb), 0.15)', color: 'var(--danger)', padding: '1px 5px', borderRadius: 4, fontWeight: 800 }}>
                              INTERVIEW GATE
                            </span>
                          )}
                          {p.isTemplate ? (
                            <span title="Curated industry blueprint" style={{ fontSize: 9.5, fontFamily: 'var(--font-mono)', background: 'rgba(var(--teal-rgb, 13,148,136), 0.12)', color: 'var(--teal, #0d9488)', padding: '1px 5px', borderRadius: 4, fontWeight: 700, border: '1px solid rgba(var(--teal-rgb, 13,148,136), 0.25)' }}>
                              📐 BLUEPRINT
                            </span>
                          ) : (
                            <span title="AI synthesized for your profile" style={{ fontSize: 9.5, fontFamily: 'var(--font-mono)', background: 'rgba(var(--purple-rgb, 147,51,234), 0.15)', color: 'var(--purple, #9333ea)', padding: '1px 5px', borderRadius: 4, fontWeight: 700, border: '1px solid rgba(var(--purple-rgb, 147,51,234), 0.25)' }}>
                              🤖 AI TAILORED
                            </span>
                          )}
                          <strong style={{ fontSize: 15, color: 'var(--t1)' }}>{p.name}</strong>
                        </div>
                        <span style={{ fontSize: 11, color: 'var(--t3)' }}>+{p.xpReward} XP</span>
                      </div>

                      <p style={{ margin: 0, fontSize: 13, color: 'var(--t2)', lineHeight: 1.4 }}>{p.description}</p>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
                        <span style={{ fontSize: 12, color: 'var(--t3)' }}>⚙️ {p.techStack}</span>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          
                          {p.status === 'Not Started' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleChangeProject(p.id, p.level);
                              }}
                              style={{
                                padding: '4px 8px', borderRadius: 6, fontSize: 11, fontWeight: 800,
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
                              style={{ padding: '4px 10px', fontSize: 11, borderRadius: 6 }}
                            >
                              🚀 Start Project
                            </button>
                          )}
                          {p.status === 'In Progress' && (
                            <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--amber)' }}>⚡ In Progress</span>
                          )}
                          {p.status === 'Completed' && (
                            <span style={{ fontSize: 12, fontWeight: 900, color: p.certificateType === 'reference' ? 'var(--amber)' : 'var(--success)' }}>
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
                      <h2 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: 'var(--t1)' }}>{selectedGuideProject.name}</h2>
                      <span style={{ fontSize: 12, color: 'var(--t3)' }}>Workspace Level: <strong>{selectedGuideProject.level}</strong></span>
                    </div>

                    {selectedGuideProject.status === 'Not Started' ? (
                      <button
                        onClick={() => handleStart(selectedGuideProject.id)}
                        className="btn-primary"
                        style={{ padding: '8px 16px', fontSize: 13 }}
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
                              padding: '6px 10px', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 800,
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
                            <strong style={{ fontSize: 13, color: 'var(--t2)', display: 'block', marginBottom: 4 }}>🎯 Project Overview:</strong>
                            <p style={{ margin: 0, fontSize: 14, color: 'var(--t2)', lineHeight: 1.45 }}>{selectedGuideProject.description}</p>
                          </div>
                          <div>
                            <strong style={{ fontSize: 13, color: 'var(--t2)', display: 'block', marginBottom: 4 }}>⚠️ Real-World Problem:</strong>
                            <p style={{ margin: 0, fontSize: 14, color: 'var(--t2)', lineHeight: 1.45 }}>{selectedGuideProject.problem}</p>
                          </div>
                          <div>
                            <strong style={{ fontSize: 13, color: 'var(--t2)', display: 'block', marginBottom: 4 }}>📦 Required Outcome:</strong>
                            <p style={{ margin: 0, fontSize: 14, color: 'var(--t2)', lineHeight: 1.45 }}>{selectedGuideProject.deliverable}</p>
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
                                  <span style={{ fontSize: 12.5, fontWeight: 900, color: 'var(--t1)' }}>
                                    📊 Milestone Progress: {doneIndices.length} of {steps.length} Steps Completed
                                  </span>
                                  <span style={{ fontSize: 12, fontWeight: 800, color: percent === 100 ? 'var(--green-mid)' : 'var(--accent)' }}>
                                    {percent}%
                                  </span>
                                </div>
                                <div style={{ height: 6, background: 'var(--bg2)', borderRadius: 3, overflow: 'hidden', border: '1px solid var(--border)' }}>
                                  <div style={{ height: '100%', width: `${percent}%`, background: percent === 100 ? 'var(--green)' : 'linear-gradient(90deg, var(--accent), var(--purple))', transition: 'width 0.4s ease' }} />
                                </div>
                                {percent === 100 && (
                                  <span style={{ fontSize: 11.5, color: 'var(--green-mid)', fontWeight: 800 }}>
                                    🎉 All implementation milestones completed! Ready for GitHub repository verification.
                                  </span>
                                )}
                              </div>
                            );
                          })()}

                          <div>
                            <strong style={{ fontSize: 13, color: 'var(--t2)', display: 'block', marginBottom: 6 }}>🛠️ Step-by-Step Implementation Guide & Interactive Milestones:</strong>
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
                                      fontSize: 13,
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
                              <strong style={{ fontSize: 12.5, color: 'var(--accent)', display: 'block', marginBottom: 4 }}>💡 Developer Tips & Gotchas:</strong>
                              <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12.5, color: 'var(--t3)', display: 'flex', flexDirection: 'column', gap: 4 }}>
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
                            <strong style={{ fontSize: 13, color: 'var(--t2)', display: 'block', marginBottom: 6 }}>✅ AI Verification Requirements Checklist:</strong>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                              {(selectedGuideProject.verificationReqs || ['API endpoints validation', 'Database mappings', 'Documentation README']).map((req, idx) => (
                                <div key={idx} style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 14, color: 'var(--t2)' }}>
                                  <span style={{ color: 'var(--success)' }}>✓</span>
                                  <span>{req}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: 13, color: 'var(--t3)' }}>Minimum Pass Threshold:</span>
                            <strong style={{ fontSize: 14.5, color: 'var(--danger)' }}>{selectedGuideProject.minScore || 80}% AI Score</strong>
                          </div>
                        </>
                      )}

                      {/* Resources Tab */}
                      {activeWorkspaceTab === 'resources' && (
                        <>
                          <strong style={{ fontSize: 13, color: 'var(--t2)' }}>📚 Reference Links & SDKs:</strong>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            <div style={{ padding: 10, background: 'var(--bg3)', borderRadius: 8, fontSize: 13 }}>
                              <a href="https://github.com" target="_blank" rel="noreferrer" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 700 }}>GitHub Developer documentation 🔗</a>
                              <p style={{ margin: '4px 0 0 0', color: 'var(--t3)', fontSize: 12 }}>Setup SSH keys and configure action workflows.</p>
                            </div>
                            <div style={{ padding: 10, background: 'var(--bg3)', borderRadius: 8, fontSize: 13 }}>
                              <a href="https://qdrant.tech" target="_blank" rel="noreferrer" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 700 }}>Vector Indexing with Qdrant Vector database 🔗</a>
                              <p style={{ margin: '4px 0 0 0', color: 'var(--t3)', fontSize: 12 }}>Configure Cosine and Euclidean distance parameters.</p>
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
                                <span style={{ fontSize: 22 }}>✅</span>
                                <div>
                                  <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--success)' }}>
                                    Project Previously Verified & Completed ({selectedGuideProject.verificationScore || 80}%)
                                  </div>
                                  <div style={{ fontSize: 12, color: 'var(--t3)' }}>
                                    Certificate ID: <code style={{ fontFamily: 'var(--font-mono)' }}>{selectedGuideProject.certificateId}</code> · Re-verification will update audit metrics (+0 XP repeat completion).
                                  </div>
                                </div>
                              </div>
                              <button
                                onClick={() => setActiveCertificate(selectedGuideProject)}
                                className="btn-secondary"
                                style={{ padding: '6px 12px', fontSize: 12, fontWeight: 700 }}
                              >
                                View Certificate
                              </button>
                            </div>
                          )}

                          <div>
                            <label style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--t2)', display: 'block', marginBottom: 4 }}>GitHub Repository URL *</label>
                            <input
                              type="text"
                              value={githubUrl}
                              onChange={e => setGithubUrl(e.target.value)}
                              className="form-input"
                              placeholder="https://github.com/username/project-repo"
                              style={{ width: '100%', fontSize: 13, padding: '8px 12px' }}
                            />
                          </div>

                          <div>
                            <label style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--t2)', display: 'block', marginBottom: 4 }}>Live Demo Link (Optional)</label>
                            <input
                              type="text"
                              value={liveDemoUrl}
                              onChange={e => setLiveDemoUrl(e.target.value)}
                              className="form-input"
                              placeholder="https://myprojectdemo.vercel.app"
                              style={{ width: '100%', fontSize: 13, padding: '8px 12px' }}
                            />
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '10px 14px', background: 'var(--bg3)', borderRadius: 8, border: '1px solid var(--border)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: 12.5, color: 'var(--t2)' }}>ZIP Upload Backup (Optional)</span>
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
                                  <span style={{ fontSize: 12, color: 'var(--success)', fontWeight: 700 }}>
                                    ✓ {uploadedZipFile.name} ({(uploadedZipFile.size / (1024 * 1024)).toFixed(1)} MB)
                                  </span>
                                  <button
                                    onClick={() => {
                                      setUploadedZipFile(null);
                                      setZipFileSelected(false);
                                      if (zipInputRef.current) zipInputRef.current.value = '';
                                    }}
                                    style={{ background: 'transparent', border: 'none', color: 'var(--t3)', cursor: 'pointer', fontSize: 13 }}
                                    title="Remove ZIP file"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => zipInputRef.current?.click()}
                                  style={{
                                    padding: '4px 10px', fontSize: 11, borderRadius: 6, cursor: 'pointer',
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
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--success)', background: 'rgba(var(--success-rgb),0.04)', padding: 8, borderRadius: 6 }}>
                                <span>✓</span>
                                <span>Auto-detected: <strong>README.md</strong> file confirmed in repository structure.</span>
                              </div>
                            ) : (
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--amber)', background: 'rgba(245, 158, 11, 0.08)', padding: 8, borderRadius: 6 }}>
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
                              style={{ width: '100%', padding: '12px 0', fontSize: 14.5, fontWeight: 800, justifyContent: 'center' }}
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
                      <div style={{ fontSize: 31 }}>{selectedGuideProject.certificateType === 'reference' ? '📖' : '🏅'}</div>
                      <div>
                        <strong style={{ fontSize: 15.5, color: 'var(--t1)', display: 'block' }}>
                          {selectedGuideProject.certificateType === 'reference'
                            ? '📖 External Reference Record'
                            : selectedGuideProject.vivaPassed ? '🏆 AI Verified Excellence Certificate' : '🏅 AI Verified Project Certificate'}
                        </strong>
                        <span style={{ fontSize: 12.5, color: 'var(--t3)' }}>
                          Status: <strong>{selectedGuideProject.certificateType === 'reference' ? 'EXTERNAL REFERENCE (Unverified Authorship)' : `VERIFIED (${selectedGuideProject.verificationScore || 91}%)`}</strong>
                        </span>
                      </div>

                      {selectedGuideProject.certificateType !== 'reference' ? (
                        <button
                          onClick={() => setActiveCertificate(selectedGuideProject)}
                          className="btn-primary"
                          style={{ padding: '8px 16px', fontSize: 13, justifyContent: 'center' }}
                        >
                          🎓 View Certificate
                        </button>
                      ) : (
                        <div style={{ fontSize: 12, color: 'var(--amber)', background: 'rgba(245, 158, 11, 0.08)', padding: '8px 12px', borderRadius: 8, border: '1px dashed rgba(245, 158, 11, 0.3)' }}>
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
              <strong style={{ fontSize: 16.5, color: 'var(--t1)' }}>🤖 AI Project Verification</strong>
              <div style={{ fontSize: 13, color: 'var(--accent)', animation: 'spin 1.5s linear infinite' }}>⬡</div>
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
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 14, color: isPassed ? 'var(--success)' : isActive ? 'var(--t1)' : 'var(--t4)' }}>
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
                <h3 style={{ margin: 0, fontSize: 17.5, fontWeight: 900, color: 'var(--t1)' }}>AI Repository Evidence Report</h3>
                <span style={{ fontSize: 11.5, fontWeight: 800, padding: '2px 8px', borderRadius: 4, background: 'rgba(var(--info-rgb),0.1)', color: 'var(--accent)' }}>
                  {auditReport?.projectComplexityTier || 'Advanced'}
                </span>
              </div>
              <span style={{ fontSize: 12, color: 'var(--t3)' }}>Repository: {auditReport?.metadata?.fullName || selectedGuideProject.name}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14.5, borderBottom: '1px solid var(--border)', paddingBottom: 6 }}>
                <span style={{ color: 'var(--t2)' }}>Architecture & Modularity</span>
                <strong style={{ color: 'var(--success)' }}>{auditReport?.evidenceBreakdown?.architectureScore || 85}%</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14.5, borderBottom: '1px solid var(--border)', paddingBottom: 6 }}>
                <span style={{ color: 'var(--t2)' }}>Testing & QA Depth</span>
                <strong style={{ color: 'var(--success)' }}>{auditReport?.evidenceBreakdown?.testingScore || 70}%</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14.5, borderBottom: '1px solid var(--border)', paddingBottom: 6 }}>
                <span style={{ color: 'var(--t2)' }}>DevOps & CI/CD Evidence</span>
                <strong style={{ color: 'var(--success)' }}>{auditReport?.evidenceBreakdown?.devopsScore || 75}%</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14.5, borderBottom: '1px solid var(--border)', paddingBottom: 6 }}>
                <span style={{ color: 'var(--t2)' }}>Documentation & Setup</span>
                <strong style={{ color: 'var(--success)' }}>{auditReport?.evidenceBreakdown?.documentationScore || 80}%</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15.5, paddingTop: 6 }}>
                <strong>Evidence-Backed Score</strong>
                <strong style={{ color: 'var(--accent)', fontSize: 17.5 }}>{auditReport?.overallEvidenceScore ?? 0}%</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: 'var(--success)', background: 'rgba(var(--success-rgb),0.06)', padding: 8, borderRadius: 6, marginTop: 4 }}>
                <span>Evidence Hash:</span>
                <strong style={{ fontFamily: 'monospace' }}>{auditReport?.proofRecord?.evidenceHash || 'PIN-GH-PENDING'}</strong>
              </div>
              {auditReport?.detectedSkills && auditReport.detectedSkills.length > 0 && (
                <div style={{ fontSize: 12, color: 'var(--t3)', display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 2 }}>
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
            <div style={{ background: 'var(--bg3)', padding: 12, borderRadius: 10, border: '1px solid var(--border)', fontSize: 13, lineHeight: 1.45 }}>
              <strong style={{ color: 'var(--t1)' }}>Earn AI Excellence Badge? 🏆</strong>
              <p style={{ margin: '4px 0 10px 0', color: 'var(--t3)' }}>
                Take a 3-Minute **Project Viva** interview to test your deployment choices and upgrade your credentials to an **Excellence Certificate**.
              </p>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => router.push(`/interview?mode=project_viva&project=${encodeURIComponent(selectedGuideProject.name)}&projectId=${selectedGuideProject.id}&course=${encodeURIComponent(activeCourse.title)}`)}
                  className="btn-primary"
                  style={{ fontSize: 12, padding: '6px 12px' }}
                >
                  🎙️ Start AI Viva
                </button>
                <button
                  onClick={handleIssueStandardCertificate}
                  className="btn-ghost"
                  style={{ border: '1px solid var(--border)', fontSize: 12, padding: '6px 12px' }}
                >
                  Skip & Issue Standard
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ── MODAL: START YOUR OWN PROJECT (CONFIRMATION & GITHUB LINK) ── */}
      {showOwnProjectModal && (
        <div
          data-testid="own-project-modal"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: 20
          }}
        >
          <div
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 20,
              maxWidth: 580,
              width: '100%',
              padding: 28,
              boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
              position: 'relative'
            }}
          >
            {ownProjectStep === 'confirm' ? (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <span style={{ fontSize: 28 }}>⚠️</span>
                  <h3 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: 'var(--t1)' }}>
                    Start Independent Custom Project?
                  </h3>
                </div>

                <div
                  style={{
                    background: 'rgba(245, 158, 11, 0.1)',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    borderRadius: 12,
                    padding: '14px 16px',
                    marginBottom: 20,
                    fontSize: 14,
                    color: 'var(--t1)',
                    lineHeight: 1.5
                  }}
                >
                  <strong style={{ color: '#f59e0b', display: 'block', marginBottom: 4 }}>
                    Academic Milestone Notice
                  </strong>
                  Are you sure you want to start an independent project leaving all standard course and certificate milestones?
                  Independent projects provide complete creative freedom and live GitHub evidence tracking, but they do <strong>not automatically grant accredited university degree credits</strong> or official course certificates until defended before faculty.
                </div>

                <p style={{ fontSize: 14, color: 'var(--t2)', marginBottom: 24, lineHeight: 1.5 }}>
                  If you proceed, you will link your public GitHub repository to PinIT. Our automated CI ingestion engine will inspect your commit signatures, code architecture, and automated tests.
                </p>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                  <button
                    type="button"
                    onClick={() => setShowOwnProjectModal(false)}
                    style={{
                      padding: '10px 18px',
                      borderRadius: 10,
                      background: 'transparent',
                      border: '1px solid var(--border)',
                      color: 'var(--t2)',
                      fontSize: 14,
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Cancel / Stay on Course
                  </button>
                  <button
                    type="button"
                    data-testid="confirm-own-project-btn"
                    onClick={() => setOwnProjectStep('form')}
                    style={{
                      padding: '10px 20px',
                      borderRadius: 10,
                      background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                      border: 'none',
                      color: '#fff',
                      fontSize: 14,
                      fontWeight: 800,
                      cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)'
                    }}
                  >
                    Yes, I Understand → Link GitHub
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCreateOwnProject}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 24 }}>🔗</span>
                    <h3 style={{ margin: 0, fontSize: 19, fontWeight: 900, color: 'var(--t1)' }}>
                      Link GitHub Repository & Configure Project
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowOwnProjectModal(false)}
                    style={{ background: 'none', border: 'none', color: 'var(--t3)', fontSize: 18, cursor: 'pointer' }}
                  >
                    ✕
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12.5, fontWeight: 800, color: 'var(--t2)', marginBottom: 6 }}>
                      Project Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Autonomous Financial Risk Engine"
                      value={ownProjectName}
                      onChange={(e) => setOwnProjectName(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: 10,
                        background: 'var(--bg3)',
                        border: '1px solid var(--border)',
                        color: 'var(--t1)',
                        fontSize: 14,
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12.5, fontWeight: 800, color: 'var(--t2)', marginBottom: 6 }}>
                      GitHub Repository URL *
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="https://github.com/username/repository"
                      value={ownProjectRepoUrl}
                      onChange={(e) => setOwnProjectRepoUrl(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: 10,
                        background: 'var(--bg3)',
                        border: '1px solid var(--border)',
                        color: 'var(--t1)',
                        fontSize: 14,
                        boxSizing: 'border-box'
                      }}
                    />
                    <div style={{ fontSize: 11.5, color: 'var(--t3)', marginTop: 4 }}>
                      Must be a valid, public GitHub repository (e.g. https://github.com/owner/repo)
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12.5, fontWeight: 800, color: 'var(--t2)', marginBottom: 6 }}>
                      Primary Tech Stack
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Python, FastAPI, Docker, PostgreSQL"
                      value={ownProjectTechStack}
                      onChange={(e) => setOwnProjectTechStack(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: 10,
                        background: 'var(--bg3)',
                        border: '1px solid var(--border)',
                        color: 'var(--t1)',
                        fontSize: 14,
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12.5, fontWeight: 800, color: 'var(--t2)', marginBottom: 6 }}>
                      Project Problem & Deliverables
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Describe what problem this project solves and the expected deliverable..."
                      value={ownProjectDesc}
                      onChange={(e) => setOwnProjectDesc(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: 10,
                        background: 'var(--bg3)',
                        border: '1px solid var(--border)',
                        color: 'var(--t1)',
                        fontSize: 13.5,
                        boxSizing: 'border-box',
                        resize: 'vertical'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                  <button
                    type="button"
                    onClick={() => setOwnProjectStep('confirm')}
                    style={{
                      padding: '10px 18px',
                      borderRadius: 10,
                      background: 'transparent',
                      border: '1px solid var(--border)',
                      color: 'var(--t2)',
                      fontSize: 14,
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    data-testid="submit-own-project-btn"
                    style={{
                      padding: '10px 22px',
                      borderRadius: 10,
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      border: 'none',
                      color: '#fff',
                      fontSize: 14,
                      fontWeight: 800,
                      cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)'
                    }}
                  >
                    🚀 Link GitHub & Start Project
                  </button>
                </div>
              </form>
            )}
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
                width: 32, height: 32, cursor: 'pointer', color: 'var(--text)', fontSize: 17.5
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
                  <span style={{ fontSize: 10, color: '#8e701d', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 800 }}>Date</span>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginTop: 4 }}>{activeCertificate.issueDate || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                </div>
                
                <div>
                  <span style={{ fontSize: 10, color: '#8e701d', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 800 }}>Project Level</span>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginTop: 4 }}>{activeCertificate.level}</div>
                </div>

                <div>
                  <span style={{ fontSize: 10, color: '#8e701d', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 800 }}>Verification Score</span>
                  <div style={{ fontSize: 17.5, fontWeight: 900, color: '#D4AF37', marginTop: 4 }}>{activeCertificate.verificationScore ?? 80}%</div>
                </div>
              </div>

              {/* Right embossed gold stamp */}
              <div style={{
                position: 'absolute', right: 40, bottom: 80, width: 100, height: 100,
                borderRadius: '50%', background: 'radial-gradient(circle, #f3e5ab 0%, #D4AF37 70%, #aa7c11 100%)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexDirection: 'column', zIndex: 10, border: '4px double #8e701d'
              }}>
                <span style={{ fontSize: 9, fontWeight: 800, color: '#4a3306', textTransform: 'uppercase' }}>PinIT</span>
                <span style={{ fontSize: 20 }}>🛡️</span>
                <span style={{ fontSize: 7.5, fontWeight: 800, color: '#4a3306', textTransform: 'uppercase', letterSpacing: 0.5 }}>Verified</span>
              </div>

              {/* Main Content Pane */}
              <div style={{ paddingLeft: 160, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                
                {/* Logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 22, color: 'var(--info)' }}>⬡</span>
                  <strong style={{ fontSize: 14.5, letterSpacing: 1.5, color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>
                    PinIT <span style={{ color: 'var(--text-muted)', fontSize: 11, fontWeight: 400 }}>AI CAREER OS</span>
                  </strong>
                </div>

                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 33, fontWeight: 900, color: 'var(--text)', letterSpacing: '2px', margin: '10px 0 2px 0', textTransform: 'uppercase' }}>
                  Certificate
                </h2>
                <div style={{ fontSize: 11, color: '#8e701d', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 16 }}>
                  of Project Achievement
                </div>

                <div style={{ fontSize: 11.5, color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: 4, letterSpacing: '0.5px' }}>
                  PROUDLY PRESENTED TO
                </div>

                <h1 style={{
                  fontFamily: 'Georgia, serif', fontSize: 44, fontStyle: 'italic', color: '#D4AF37',
                  margin: '4px 0 12px 0', letterSpacing: 1, textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                }}>
                  {user?.displayName || (onboardingAnswers as any)?.displayName || user?.name || 'Verified Student'}
                </h1>

                <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '0 0 12px 0' }}>
                  for successfully completing and getting
                </p>

                {/* Badge ribbon with Laurel branch wreaths */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <span style={{ color: '#D4AF37', fontSize: 15.5 }}>🌿</span>
                  <strong style={{ fontSize: 13, color: '#D4AF37', textTransform: 'uppercase', letterSpacing: 1.5 }}>
                    {activeCertificate.vivaPassed ? 'AI EXCELLENCE' : 'AI VERIFIED'}
                  </strong>
                  <span style={{ color: '#D4AF37', fontSize: 15.5 }}>🌿</span>
                </div>

                <div style={{ fontSize: 12, color: 'var(--text-muted)', margin: '0 0 10px 0' }}>
                  for the project
                </div>

                {/* Project Details Box with Brain icon */}
                <div style={{
                  background: 'linear-gradient(90deg, #091128, #0e1b38)', border: '1px solid #8e701d', borderRadius: 8,
                  padding: '8px 24px', fontSize: 14.5, fontWeight: 700, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 10,
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)', marginBottom: 20
                }}>
                  <span style={{ fontSize: 15.5 }}>🧠</span>
                  <span>{activeCertificate.name}</span>
                </div>

                <div style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20 }}>
                  <span>🚀</span>
                  <span>Real Project. Verified by AI. Built for Your Future.</span>
                </div>

                {/* Footer Signing details */}
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 14, marginTop: 10 }}>
                  <div style={{ textAlign: 'left', fontSize: 10 }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: 9 }}>SCAN TO VERIFY</div>
                    <div style={{ color: '#D4AF37', marginTop: 2, fontWeight: 700 }}>pinIt.in/verify</div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: 24 }}>
                    <div style={{ textAlign: 'center', width: 140 }}>
                      <div style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 13, color: 'var(--text)' }}>PinIT Evaluation Authority</div>
                      <div style={{ height: 1, background: '#8e701d', margin: '4px 0' }} />
                      <div style={{ fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Autonomous Audit Engine</div>
                      <div style={{ fontSize: 7.5, color: '#8e701d', textTransform: 'uppercase' }}>Platform Certification Authority</div>
                    </div>

                    {activeCertificate.vivaPassed && (
                      <div style={{ textAlign: 'center', width: 140 }}>
                        <div style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 13, color: '#D4AF37' }}>Academic Evaluation Board</div>
                        <div style={{ height: 1, background: '#8e701d', margin: '4px 0' }} />
                        <div style={{ fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Faculty Review Panel</div>
                        <div style={{ fontSize: 7.5, color: '#8e701d', textTransform: 'uppercase' }}>Verified Viva Assessor</div>
                      </div>
                    )}
                  </div>

                  <div style={{ textAlign: 'right', fontSize: 10 }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: 9 }}>CERTIFICATE ID</div>
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
                  fontSize: 13,
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
                    fontSize: 13,
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
                    fontSize: 13,
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
