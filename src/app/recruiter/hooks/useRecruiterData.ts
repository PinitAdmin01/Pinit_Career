'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { api } from '@/lib/api/client';
import { supabase } from '@/lib/supabaseClient';
import { ResumeFormData } from '@/components/career/ResumeForm.types';

export interface Candidate {
  id: string;
  display_name: string;
  email?: string;
  phone?: string;
  ats_score: number;
  trust_score: number;
  career_dna_score: number;
  mission_streak: number;
  recruiter_visibility: number;
  communication_score: number;
  execution_score: number;
  skill_tags: string[];
  missions_done: number;
  interviews_done: number;
  recent_missions?: Array<{ title: string; status: string }>;
  vaultItems?: any[];
  programType?: string;
  structured_resume?: ResumeFormData | null;
}

export interface Job {
  id?: string;
  title: string;
  company: string;
  department?: string;
  industry?: string;
  location?: string;
  work_mode?: string;
  job_type?: string;
  experience_level?: string;
  salary_range?: string;
  openings?: number;
  deadline?: string;
  skills_required?: string;
  description?: string;
  responsibilities?: string;
  benefits?: string;
  requirements?: string;
  education_required?: string;
  application_process?: string;
  interview_rounds?: string;
  bond_period?: string;
  notice_period?: string;
  language_required?: string;
}

export interface JobApplication {
  id: string;
  uid: string;
  oppId: string;
  status: string;
  appliedAt: string;
  jobTitle: string;
  jobCompany: string;
  user: {
    id: string;
    full_name: string;
    email: string;
    phone: string;
    ats_score: number;
    trust_score: number;
    career_dna_score: number;
    structured_resume?: ResumeFormData | null;
  } | null;
}

export interface CompanyProfile {
  company_name: string;
  tagline: string;
  logo_url: string;
  industry: string;
  company_size: string;
  founded_year: string;
  website: string;
  headquarters: string;
  about: string;
  city?: string;
  state?: string;
  country?: string;
  contact_email?: string;
  contact_phone?: string;
  benefits?: string;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  role: string;
  action: string;
  meta: string;
  created_at: string;
}

export const ACTION_LABELS: Record<string, { label: string; icon: string; color: string }> = {
  posted_job:           { label: 'Posted a job',          icon: '💼', color: 'var(--success)' },
  updated_job:          { label: 'Updated a job',          icon: '✏️',  color: 'var(--info)' },
  deleted_job:          { label: 'Deleted a job',          icon: '🗑️',  color: 'var(--danger)' },
  updated_app_status:   { label: 'Updated application',    icon: '🔄', color: 'var(--warning)' },
  setup_company:        { label: 'Set up company profile', icon: '🏢', color: 'var(--success)' },
  shortlist_candidate:  { label: 'Shortlisted student',    icon: '★',  color: 'var(--reward)' },
  contact_request:      { label: 'Sent contact request',   icon: '✉',  color: '#0ea5e9' },
  schedule_interview:   { label: 'Scheduled interview',    icon: '📅', color: 'var(--accent-teal)' },
  viewed_candidate:     { label: 'Viewed profile',         icon: '👁', color: 'var(--brand)' },
  STAGE_CHANGE:         { label: 'Pipeline Stage Change',  icon: '📊', color: 'var(--accent)' },
  NOTE_ADDED:           { label: 'Recruiter Note Added',   icon: '📝', color: 'var(--teal)' },
  INTERVIEW_DISPATCH:   { label: 'Interview Invitation',   icon: '✉️', color: 'var(--green)' }
};

export function getActionInfo(action: string) {
  return ACTION_LABELS[action] || { label: action, icon: '📋', color: '#6b7280' };
}

export const emptyJob: Job = {
  title: '',
  company: '',
  department: '',
  industry: '',
  location: '',
  work_mode: 'Remote',
  job_type: 'Full-time',
  experience_level: 'Fresher / Entry Level (0–1 yr)',
  salary_range: '',
  openings: 1,
  deadline: '',
  skills_required: '',
  description: '',
  responsibilities: '',
  benefits: '',
  requirements: '',
  education_required: '',
  application_process: '',
  interview_rounds: '',
  bond_period: '',
  notice_period: '',
  language_required: '',
};

export const emptyCompany: CompanyProfile = {
  company_name: '',
  tagline: '',
  logo_url: '',
  industry: 'Technology',
  company_size: '1-10 employees',
  founded_year: '',
  website: '',
  headquarters: '',
  about: '',
  city: '',
  state: '',
  country: '',
  contact_email: '',
  contact_phone: '',
  benefits: '',
};

export const PIPELINE_STAGES = ['Submitted', 'ATS Screened', 'AI Interviewed', 'Shortlisted', 'Offered', 'Hired'];

export function useRecruiterData(user: any) {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [analytics, setAnalytics] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ minTrust: '', minAts: '', domain: '' });
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  // Jobs state
  const [jobs, setJobs] = useState<Job[]>([]);
  const [showJobModal, setShowJobModal] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [jobForm, setJobForm] = useState<Job>(emptyJob);
  const [jobSaving, setJobSaving] = useState(false);

  // Suggestions state from past job postings
  const [jobSuggestions, setJobSuggestions] = useState({
    titles: [] as string[],
    locations: [] as string[],
    skills: [] as string[],
    departments: [] as string[],
    benefits: [] as string[],
    responsibilities: [] as string[],
    requirements: [] as string[],
  });

  // Applications state
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [appReviewing, setAppReviewing] = useState<JobApplication | null>(null);
  const [updatingAppStatus, setUpdatingAppStatus] = useState<string | null>(null);

  // Company state
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile>(emptyCompany);
  const [companyLoading, setCompanyLoading] = useState(true);
  const [companySaving, setCompanySaving] = useState(false);
  const [companyEditing, setCompanyEditing] = useState(false);

  // Resume full-view modal state
  const [viewResumeData, setViewResumeData] = useState<{ name: string; resume: ResumeFormData } | null>(null);

  // 6-Stage Candidate Pipeline State
  const [candidateStages, setCandidateStages] = useState<Record<string, string>>({});

  // Recruiter Notes Drawer State
  const [candidateNotesMap, setCandidateNotesMap] = useState<Record<string, Array<{ text: string; date: string; author: string }>>>({});
  const [newNoteText, setNewNoteText] = useState('');

  // Activity Logs (Enterprise Supabase Storage - zero localStorage)
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [chartDays, setChartDays] = useState(14);
  const [logFilterAction, setLogFilterAction] = useState('all');

  // Notifications
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'info' | 'error' } | null>(null);

  const triggerToast = useCallback((msg: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // Supabase audit logging replacing localStorage
  const loadLogs = useCallback(async () => {
    if (!user?.id) return;
    try {
      const { data, error } = await supabase
        .from('recruiter_activity_logs')
        .select('*')
        .eq('recruiter_id', user.id)
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        setLogs(
          data.map((row: any) => ({
            id: row.id,
            user_id: row.recruiter_id,
            role: 'recruiter',
            action: row.action,
            meta: typeof row.metadata === 'string' ? row.metadata : JSON.stringify(row.metadata || {}),
            created_at: row.created_at,
          }))
        );
      } else {
        // Fallback to API endpoint
        const d = await api.get<{ logs: ActivityLog[] }>(`/api/recruiter/activity-log?userId=${user.id}`).catch(() => null);
        if (d && Array.isArray(d.logs)) {
          setLogs(d.logs);
        }
      }
    } catch {
      // Non-blocking log load
    }
  }, [user?.id]);

  const logActivity = useCallback(async (action: string, meta: any = {}) => {
    if (!user?.id) return;
    const logId = crypto.randomUUID();
    const newLogItem: ActivityLog = {
      id: logId,
      user_id: user.id,
      role: 'recruiter',
      action,
      meta: JSON.stringify(meta),
      created_at: new Date().toISOString(),
    };

    // Optimistically update local state
    setLogs((prev) => [newLogItem, ...prev]);

    try {
      // Direct Supabase insert
      await supabase.from('recruiter_activity_logs').insert({
        id: logId,
        recruiter_id: user.id,
        action,
        metadata: meta,
        created_at: newLogItem.created_at,
      });
    } catch {
      // Fallback via server API
      api.post('/api/recruiter/activity-log', newLogItem).catch(() => {});
    }
  }, [user?.id]);

  const fetchCandidates = useCallback(async () => {
    setLoading(true);
    try {
      const d = await api.get<{ pipeline: Candidate[] }>('/api/recruiter/pipeline');
      const normalized = (d.pipeline || []).map((c: any) => ({
        ...c,
        display_name: c.displayName || c.display_name,
        skill_tags: c.skill_tags || [],
      }));
      setCandidates(normalized);
    } catch {
      triggerToast('Failed to load candidates', 'error');
    } finally {
      setLoading(false);
    }
  }, [triggerToast]);

  const fetchAnalytics = useCallback(async () => {
    try {
      const d = await api.get<{ analytics: Record<string, number> }>('/api/recruiter/analytics');
      setAnalytics(d.analytics || {});
    } catch {}
  }, []);

  const buildJobSuggestions = (jobData: Job[]) => {
    const unique = (arr: string[]) => [...new Set(arr.filter(Boolean).map((s) => s.trim()).filter((s) => s.length > 1))];
    const titles: string[] = [];
    const locations: string[] = [];
    const skills: string[] = [];
    const departments: string[] = [];
    const benefits: string[] = [];
    const responsibilities: string[] = [];
    const requirements: string[] = [];

    jobData.forEach((job) => {
      if (job.title) titles.push(job.title);
      if (job.location) locations.push(job.location);
      if (job.department) departments.push(job.department);
      if (job.skills_required) skills.push(...job.skills_required.split(/[,\n]+/).map((s) => s.trim()).filter(Boolean));
      if (job.benefits) benefits.push(job.benefits);
      if (job.responsibilities) responsibilities.push(job.responsibilities);
      if (job.requirements) requirements.push(job.requirements);
    });

    setJobSuggestions({
      titles: unique(titles),
      locations: unique(locations),
      skills: unique(skills),
      departments: unique(departments),
      benefits: unique(benefits),
      responsibilities: unique(responsibilities),
      requirements: unique(requirements),
    });
  };

  const fetchJobs = useCallback(async () => {
    try {
      const d = await api.get<{ jobs: Job[] }>('/api/recruiter/jobs');
      const jobList = d.jobs || [];
      setJobs(jobList);
      buildJobSuggestions(jobList);
    } catch {}
  }, []);

  const fetchApplications = useCallback(async () => {
    try {
      const d = await api.get<{ applications: JobApplication[] }>('/api/recruiter/applications');
      setApplications(d.applications || []);
    } catch {}
  }, []);

  const fetchCompany = useCallback(async () => {
    setCompanyLoading(true);
    try {
      const d = await api.get<{ company: CompanyProfile | null }>('/api/recruiter/company');
      if (d.company) {
        setCompanyProfile(d.company);
      } else {
        setCompanyProfile((prev) => ({ ...prev, company_name: user?.displayName || 'My Enterprise' }));
      }
    } catch {
      triggerToast('Failed to load company profile', 'error');
    } finally {
      setCompanyLoading(false);
    }
  }, [user?.displayName, triggerToast]);

  const loadDataRef = useRef<() => void>(() => {});
  loadDataRef.current = () => {
    fetchCandidates();
    fetchAnalytics();
    fetchJobs();
    fetchApplications();
    fetchCompany();
    loadLogs();
  };

  useEffect(() => {
    if (user) {
      loadDataRef.current();
    }
  }, [user]);

  const getCandidateStage = (candidateId: string) => {
    return candidateStages[candidateId] || 'ATS Screened';
  };

  const handleUpdateStage = (candidateId: string, stage: string, candidateName: string) => {
    setCandidateStages((prev) => ({ ...prev, [candidateId]: stage }));
    logActivity('STAGE_CHANGE', { candidateId, stage, candidateName });
    triggerToast(`Updated ${candidateName}'s status to ${stage}`, 'success');
  };

  const handleAddRecruiterNote = (candidateId: string) => {
    if (!newNoteText.trim()) return;
    const noteObj = {
      text: newNoteText.trim(),
      date: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      }),
      author: (user?.displayName || user?.username || 'Lead Recruiter') as string,
    };
    setCandidateNotesMap((prev) => ({
      ...prev,
      [candidateId]: [noteObj, ...(prev[candidateId] || [])],
    }));
    logActivity('NOTE_ADDED', { candidateId, text: newNoteText.trim() });
    setNewNoteText('');
    triggerToast('Recruiter note recorded successfully', 'success');
  };

  async function saveCompany(e: React.FormEvent) {
    e.preventDefault();
    setCompanySaving(true);
    try {
      await api.post('/api/recruiter/company', companyProfile);
      triggerToast('Company profile saved successfully!');
      logActivity('setup_company', { name: companyProfile.company_name });
      setCompanyEditing(false);
    } catch {
      triggerToast('Failed to save company profile', 'error');
    } finally {
      setCompanySaving(false);
    }
  }

  async function postJob(e: React.FormEvent) {
    e.preventDefault();
    if (!jobForm.title) {
      triggerToast('Job title is required', 'error');
      return;
    }
    setJobSaving(true);
    try {
      if (editingJob) {
        await api.post(`/api/recruiter/jobs`, {
          ...jobForm,
          id: editingJob.id,
          company: companyProfile.company_name,
        });
        triggerToast('Job updated successfully!');
        logActivity('updated_job', { title: jobForm.title });
      } else {
        await api.post('/api/recruiter/jobs', {
          ...jobForm,
          company: companyProfile.company_name,
        });
        triggerToast('Job posted successfully!');
        logActivity('posted_job', { title: jobForm.title });
      }
      setShowJobModal(false);
      setEditingJob(null);
      setJobForm(emptyJob);
      fetchJobs();
    } catch {
      triggerToast('Failed to save job posting', 'error');
    } finally {
      setJobSaving(false);
    }
  }

  async function handleDeleteJob(id: string) {
    if (!confirm('Are you sure you want to delete this job posting?')) return;
    try {
      const jobToDelete = jobs.find((j) => j.id === id);
      await api.delete(`/api/recruiter/jobs/${id}`);
      triggerToast('Job posting deleted.');
      logActivity('deleted_job', { title: jobToDelete?.title || '' });
      fetchJobs();
    } catch {
      triggerToast('Failed to delete job', 'error');
    }
  }

  async function handleUpdateAppStatus(applicationId: string, status: string) {
    setUpdatingAppStatus(status);
    try {
      await api.post('/api/recruiter/applications', { applicationId, status });
      triggerToast(`Application status updated to ${status}`);
      logActivity('updated_app_status', { title: appReviewing?.jobTitle || '', status });
      setApplications((prev) => prev.map((a) => (a.id === applicationId ? { ...a, status } : a)));
      if (appReviewing?.id === applicationId) {
        setAppReviewing((prev) => (prev ? { ...prev, status } : null));
      }
    } catch {
      triggerToast('Failed to update status', 'error');
    } finally {
      setUpdatingAppStatus(null);
    }
  }

  async function viewCandidate(id: string) {
    try {
      const d = await api.get<{ candidate: Candidate }>(`/api/recruiter/candidate/${id}`);
      setSelectedCandidate(d.candidate || null);
      logActivity('viewed_candidate', { candidateId: id, name: d.candidate?.display_name || '' });
    } catch {
      triggerToast('Failed to fetch candidate details', 'error');
    }
  }

  async function shortlist(id: string) {
    try {
      await api.post('/api/recruiter/shortlist', { candidateId: id });
      triggerToast('Candidate shortlisted for review');
      const cand = candidates.find((c) => c.id === id);
      logActivity('shortlist_candidate', { candidateId: id, name: cand?.display_name || '' });
      setCandidateStages((prev) => ({ ...prev, [id]: 'Shortlisted' }));
    } catch {
      triggerToast('Failed to shortlist candidate', 'error');
    }
  }

  async function sendContactRequest(id: string) {
    try {
      await api.post('/api/recruiter/contact-request', { candidateId: id });
      triggerToast('Contact request sent successfully');
      const cand = candidates.find((c) => c.id === id);
      logActivity('contact_request', { candidateId: id, name: cand?.display_name || '' });
    } catch {
      triggerToast('Failed to send contact request', 'error');
    }
  }

  async function scheduleInterview(candidateId: string) {
    const dt = prompt('Schedule interview date & time (e.g. YYYY-MM-DD HH:MM):');
    if (!dt) return;

    const parsedDate = new Date(dt);
    if (isNaN(parsedDate.getTime())) {
      triggerToast('Invalid date format. Please enter a valid date/time.', 'error');
      return;
    }

    const mode = prompt('Interview mode (video / phone / in-person):') || 'video';
    try {
      await api.post('/api/recruiter/schedule-interview', {
        candidateId,
        scheduledAt: parsedDate.toISOString(),
        mode,
      });
      triggerToast('Interview invitation dispatched');
      const cand = candidates.find((c) => c.id === candidateId);
      logActivity('schedule_interview', { candidateId, name: cand?.display_name || '', mode, dt });
    } catch {
      triggerToast('Failed to schedule interview', 'error');
    }
  }

  const exportActivityToCSV = () => {
    if (logs.length === 0) return;
    const rows = logs.map((log) => {
      const info = getActionInfo(log.action);
      const dt = new Date(log.created_at);
      return {
        Date: dt.toLocaleDateString(),
        Time: dt.toLocaleTimeString(),
        Activity: info.label,
        Meta: log.meta,
      };
    });

    const headers = Object.keys(rows[0]);
    const escape = (val: any) => `"${String(val ?? '').replace(/"/g, '""')}"`;
    const csvContent = [
      headers.map(escape).join(','),
      ...rows.map((r) => headers.map((h) => escape((r as any)[h])).join(',')),
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Recruiter_Activity_Logs_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  // Timeline chart computations
  const chartData = useMemo(() => {
    const buckets: Record<string, number> = {};
    const now = new Date();
    for (let i = chartDays - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
      buckets[key] = 0;
    }
    logs.forEach((l) => {
      const key = new Date(l.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
      if (key in buckets) buckets[key]++;
    });
    return Object.entries(buckets).map(([date, count]) => ({ date, count }));
  }, [logs, chartDays]);

  const maxChartCount = Math.max(...chartData.map((d) => d.count), 1);

  const filteredLogs = useMemo(() => {
    return logs.filter((l) => logFilterAction === 'all' || l.action === logFilterAction);
  }, [logs, logFilterAction]);

  return {
    candidates,
    analytics,
    loading,
    filters,
    setFilters,
    selectedCandidate,
    setSelectedCandidate,
    fetchCandidates,
    jobs,
    setJobs,
    showJobModal,
    setShowJobModal,
    editingJob,
    setEditingJob,
    jobForm,
    setJobForm,
    jobSaving,
    jobSuggestions,
    postJob,
    handleDeleteJob,
    applications,
    appReviewing,
    setAppReviewing,
    updatingAppStatus,
    handleUpdateAppStatus,
    companyProfile,
    setCompanyProfile,
    companyLoading,
    companySaving,
    companyEditing,
    setCompanyEditing,
    saveCompany,
    viewResumeData,
    setViewResumeData,
    candidateStages,
    getCandidateStage,
    handleUpdateStage,
    candidateNotesMap,
    newNoteText,
    setNewNoteText,
    handleAddRecruiterNote,
    logs,
    chartDays,
    setChartDays,
    logFilterAction,
    setLogFilterAction,
    filteredLogs,
    chartData,
    maxChartCount,
    logActivity,
    exportActivityToCSV,
    viewCandidate,
    shortlist,
    sendContactRequest,
    scheduleInterview,
    toast,
    triggerToast,
  };
}
