'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { useCareerOS } from '@/lib/context/CareerOSContext';
import { toast } from '@/lib/store/useAppStore';
import { api } from '@/lib/api/client';
import { useSearchParams, useRouter } from 'next/navigation';

export interface Task {
  id: string;
  name: string;
  status: 'Approved' | 'Review' | 'Pending';
}

export interface Review {
  week: number;
  text: string;
  status: 'Approved' | 'Pending';
}

export interface Internship {
  id: string;
  studentName: string;
  company: string;
  role: string;
  tasks: Task[];
  reviews: Review[];
  performance: number;
  offerStatus: string;
  completed: boolean;
}

export interface CompanyProbability {
  company: string;
  pct: number;
  color: string;
  reasons: string[];
}

export interface TopCandidate {
  name: string;
  reg: string;
  cgpa: number;
  matchPct: number;
  skills: string[];
}

export interface RiskStudent {
  name: string;
  reg: string;
  cgpa: number;
  riskReasons: string[];
}

export interface Application {
  id:                  string;
  status:              'applied' | 'viewed' | 'shortlisted' | 'interview_scheduled' | 'offered' | 'rejected' | 'withdrawn';
  applied_at:          string;
  updated_at:          string | null;
  cover_letter:        string | null;
  opportunity_id:      string;
  title:               string | null;
  description:         string | null;
  required_skills:     string[] | null;
  stipend_min:         number | null;
  stipend_max:         number | null;
  duration_weeks:      number | null;
  location_type:       'remote' | 'onsite' | 'hybrid' | null;
  deadline:            string | null;
  opportunity_status:  string | null;
  org_name:            string | null;
}

export interface Project {
  id: string;
  title: string;
  company: string;
  budget: number;
  duration: string;
  tech: string[];
  status: 'pending' | 'approved' | 'completed';
  applied: boolean;
  studentName?: string;
  creditsAwarded?: number;
  grade?: string;
}

export type StatusFilter = 'all' | 'active' | Application['status'];

export function useCareerIntelligenceData() {
  const { user } = useAuth();
  const cOS = useCareerOS();
  const { onboardingAnswers, setJdMissingSkills, addXp } = cOS;
  const searchParams = useSearchParams();
  const router = useRouter();

  // Page level tabs: 'tracker' | 'opportunities' | 'applications' | 'projects'
  const [activeTab, setActiveTab] = useState<'tracker' | 'opportunities' | 'applications' | 'projects'>('tracker');
  const [activeRole, setActiveRole] = useState<'student' | 'recruiter' | 'placement' | 'faculty'>('student');

  useEffect(() => {
    const tabParam = searchParams.get('tab') as any;
    const validTabs = ['tracker', 'opportunities', 'applications', 'projects'];
    if (tabParam && validTabs.includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const handleTabChange = (nextTab: typeof activeTab) => {
    setActiveTab(nextTab);
    router.replace(`/career-intelligence?tab=${nextTab}`);
  };

  // Load default switch based on auth role if logged in
  useEffect(() => {
    if (user?.role === 'recruiter') setActiveRole('recruiter');
    else if (['teacher', 'faculty'].includes(user?.role || '')) setActiveRole('faculty');
    else if (user?.role === 'admin') setActiveRole('placement');
  }, [user]);

  // 1. Internship Tracker Dataset (Honest, authenticated records only)
  const [trackerSubTab, setTrackerSubTab] = useState<'current' | 'completed'>('current');
  const [internships, setInternships] = useState<Internship[]>([]);

  const [mentees, setMentees] = useState<Internship[]>([]);

  const approveWeekLog = (menteeId: string, weekNum: number) => {
    setMentees(mentees.map(m => {
      if (m.id === menteeId) {
        return {
          ...m,
          reviews: m.reviews.map(r => r.week === weekNum ? { ...r, status: 'Approved' } : r)
        };
      }
      return m;
    }));
    toast.success('Log Approved', 'Successfully verified student weekly log deliverables.');
  };

  const probabilities: CompanyProbability[] = [];

  const topCandidates: TopCandidate[] = [];

  const riskStudents: RiskStudent[] = [];

  // 2. Opportunities Dataset
  const [opps, setOpps] = useState<Record<string, any>[]>([]);
  const [oppsLoading, setOppsLoading] = useState(true);
  const [oppsFilter, setOppsFilter] = useState('all');
  const [jd, setJD] = useState('');
  const [matching, setMatching] = useState(false);
  const [matchResult, setMatchResult] = useState<Record<string, any> | null>(null);

  const fetchOpps = useCallback(async () => {
    setOppsLoading(true);
    try {
      const params: Record<string, string> = {};
      if (oppsFilter !== 'all') params.type = oppsFilter;
      if (onboardingAnswers.role) params.targetRole = onboardingAnswers.role;
      const qs = Object.keys(params).length ? '?' + new URLSearchParams(params).toString() : '';
      const d = await api.get<{ opportunities: Record<string, any>[] }>(`/api/opportunities${qs}`);
      setOpps(d.opportunities || []);
    } catch {
      setOpps([]);
    } finally {
      setOppsLoading(false);
    }
  }, [oppsFilter, onboardingAnswers.role]);

  useEffect(() => { 
    if (activeTab === 'opportunities') fetchOpps(); 
  }, [activeTab, fetchOpps]);

  async function matchJD() {
    if (!jd.trim()) return;
    setMatching(true);
    try {
      const d = await api.post<{
        match: { match_score: number; verdict: string; matched_skills: string[]; missing_skills: string[]; estimated_preparation_weeks?: number; salary_estimate?: string; }
      }>('/api/opportunities/match', { jd });
      const result = (d.match || {}) as any;
      setMatchResult({
        match_score: result.match_score || 0,
        verdict: result.verdict || 'possible',
        estimated_preparation_weeks: result.estimated_preparation_weeks || 4,
        salary_estimate: result.salary_estimate || '₹12 - 20 LPA',
        matching_skills: result.matched_skills || [],
        missing_skills: result.missing_skills || [],
      });
      setJdMissingSkills(result.missing_skills || []);
      addXp(20, 'JD matched & skill gaps broadcasted');
    } catch {
      setMatchResult(null);
    } finally {
      setMatching(false);
    }
  }

  // 3. Applications Dataset
  const [apps, setApps] = useState<Application[]>([]);
  const [appsLoading, setAppsLoading] = useState(true);
  const [appsFilter, setAppsFilter] = useState<StatusFilter>('active');

  useEffect(() => {
    if (activeTab === 'applications') {
      api.get<{ applications: Application[] }>('/api/opportunities/applications')
        .then(d => setApps(d.applications || []))
        .catch(() => setApps([]))
        .finally(() => setAppsLoading(false));
    }
  }, [activeTab]);

  const appsFunnel = useMemo(() => {
    const counts: Record<Application['status'], number> = {
      applied: 0, viewed: 0, shortlisted: 0, interview_scheduled: 0, offered: 0, rejected: 0, withdrawn: 0,
    };
    for (const a of apps) {
      if (a.status in counts) counts[a.status]++;
    }
    return counts;
  }, [apps]);

  const visibleApps = useMemo(() => {
    if (appsFilter === 'all')    return apps;
    if (appsFilter === 'active') return apps.filter(a => !['rejected','withdrawn'].includes(a.status));
    return apps.filter(a => a.status === appsFilter);
  }, [apps, appsFilter]);

  const activeAppsCount = apps.filter(a => !['rejected','withdrawn'].includes(a.status)).length;

  // 4. Industry Projects Dataset
  const [projectsTab, setProjectsTab] = useState<'browse' | 'track'>('browse');
  const [projects, setProjects] = useState<Project[]>([
    { id: 'proj1', title: 'Zero-Knowledge Database Adapter', company: 'Stripe Security', budget: 2500, duration: '4 Weeks', tech: ['Next.js', 'WebCrypto API', 'SQL'], status: 'approved', applied: false },
    { id: 'proj2', title: 'Distributed Log Telemetry Aggregator', company: 'Datadog Core', budget: 4000, duration: '6 Weeks', tech: ['Go Lang', 'gRPC', 'Docker'], status: 'approved', applied: false },
    { id: 'proj3', title: 'Socratic Dialogue Finetuner Module', company: 'OpenAI Labs', budget: 3500, duration: '5 Weeks', tech: ['Python', 'PyTorch', 'HuggingFace'], status: 'pending', applied: false },
    { id: 'proj4', title: 'Real-time Canvas Whiteboard Engine', company: 'Figma Dev', budget: 3000, duration: '4 Weeks', tech: ['React', 'WebSockets', 'Canvas API'], status: 'approved', applied: false }
  ]);

  const [newTitle, setNewTitle] = useState('');
  const [newTech, setNewTech] = useState('');
  const [gradingProjId, setGradingProjId] = useState<string | null>(null);
  const [selectedCredits, setSelectedCredits] = useState(4);
  const [selectedGrade, setSelectedGrade] = useState('A+');

  const applyToProject = (id: string) => {
    setProjects(projects.map(p => p.id === id ? { ...p, applied: true, studentName: user?.displayName || 'Student' } : p));
    toast.success('Application Submitted', 'The company recruiter will review your developer portfolio.');
  };

  const createProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;
    const newProj: Project = {
      id: `proj-${Date.now()}`,
      title: newTitle,
      company: user?.displayName || 'Partner Organization',
      budget: 2500,
      duration: '4 Weeks',
      tech: newTech.split(',').map(s => s.trim()).filter(Boolean),
      status: 'pending',
      applied: false
    };
    setProjects([...projects, newProj]);
    setNewTitle('');
    setNewTech('');
    toast.success('Project Created', 'Your project has been submitted for placement officer review.');
  };

  const approveProject = (id: string) => {
    setProjects(projects.map(p => p.id === id ? { ...p, status: 'approved' } : p));
    toast.success('Project Approved', 'The project is now live in the student browse marketplace.');
  };

  const submitGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingProjId) return;
    setProjects(projects.map(p => p.id === gradingProjId ? { ...p, status: 'completed', creditsAwarded: selectedCredits, grade: selectedGrade } : p));
    setGradingProjId(null);
    toast.success('Evaluation Completed', 'Student has been awarded academic credits.');
  };

  return {
    user,
    activeTab,
    activeRole,
    setActiveRole,
    handleTabChange,
    trackerSubTab,
    setTrackerSubTab,
    internships,
    mentees,
    approveWeekLog,
    probabilities,
    topCandidates,
    riskStudents,
    opps,
    oppsLoading,
    oppsFilter,
    setOppsFilter,
    jd,
    setJD,
    matching,
    matchResult,
    matchJD,
    apps,
    appsLoading,
    appsFilter,
    setAppsFilter,
    appsFunnel,
    visibleApps,
    activeAppsCount,
    projectsTab,
    setProjectsTab,
    projects,
    newTitle,
    setNewTitle,
    newTech,
    setNewTech,
    gradingProjId,
    setGradingProjId,
    selectedCredits,
    setSelectedCredits,
    selectedGrade,
    setSelectedGrade,
    applyToProject,
    createProject,
    approveProject,
    submitGrade,
  };
}
