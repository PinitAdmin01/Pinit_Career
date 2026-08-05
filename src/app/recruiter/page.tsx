'use client';
export const dynamic = 'force-dynamic';
import { api } from '@/lib/api/client';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { useRouter } from 'next/navigation';
import { ResumeFormData } from '@/components/career/ResumeForm.types';

interface Candidate {
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

interface Job {
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
  
  // Extended fields
  benefits?: string;
  requirements?: string;
  education_required?: string;
  application_process?: string;
  interview_rounds?: string;
  bond_period?: string;
  notice_period?: string;
  language_required?: string;
}

interface JobApplication {
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

interface CompanyProfile {
  company_name: string;
  tagline: string;
  logo_url: string;
  industry: string;
  company_size: string;
  founded_year: string;
  website: string;
  headquarters: string;
  about: string;
  
  // Extended fields
  city?: string;
  state?: string;
  country?: string;
  contact_email?: string;
  contact_phone?: string;
  benefits?: string;
}

interface ActivityLog {
  id: string;
  user_id: string;
  role: string;
  action: string;
  meta: string;
  created_at: string;
}

const ACTION_LABELS: Record<string, { label: string; icon: string; color: string }> = {
  posted_job:           { label: 'Posted a job',          icon: '💼', color: '#10b981' },
  updated_job:          { label: 'Updated a job',          icon: '✏️',  color: '#3b82f6' },
  deleted_job:          { label: 'Deleted a job',          icon: '🗑️',  color: '#ef4444' },
  updated_app_status:   { label: 'Updated application',    icon: '🔄', color: '#f59e0b' },
  setup_company:        { label: 'Set up company profile', icon: '🏢', color: '#10b981' },
  shortlist_candidate:  { label: 'Shortlisted student',    icon: '★',  color: '#8b5cf6' },
  contact_request:      { label: 'Sent contact request',   icon: '✉',  color: '#0ea5e9' },
  schedule_interview:   { label: 'Scheduled interview',    icon: '📅', color: '#14b8a6' },
  viewed_candidate:     { label: 'Viewed profile',         icon: '👁', color: '#6366f1' },
};

function getActionInfo(action: string) {
  return ACTION_LABELS[action] || { label: action, icon: '📋', color: '#6b7280' };
}

function logRecruiterActivity(userId: string, action: string, meta: any = {}) {
  try {
    const raw = localStorage.getItem('recruiter_activity_logs') || '[]';
    const logs = JSON.parse(raw);
    const newLog: ActivityLog = {
      id: crypto.randomUUID(),
      user_id: userId,
      role: 'recruiter',
      action,
      meta: JSON.stringify(meta),
      created_at: new Date().toISOString()
    };
    logs.push(newLog);
    localStorage.setItem('recruiter_activity_logs', JSON.stringify(logs));

    // Send activity log to API endpoint for enterprise compliance
    api.post('/api/recruiter/activity-log', newLog).catch(() => {
      // Background endpoint post fail silently swallowed, local cache preserved
    });
  } catch (e) {
    console.warn('logActivity failed:', e);
  }
}

function getRecruiterLogs(userId: string): ActivityLog[] {
  try {
    const raw = localStorage.getItem('recruiter_activity_logs') || '[]';
    const logs = JSON.parse(raw) as ActivityLog[];
    return logs.filter(l => l.user_id === userId).reverse();
  } catch {
    return [];
  }
}

const emptyJob: Job = {
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

const emptyCompany: CompanyProfile = {
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
  benefits: ''
};

export default function RecruiterPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'candidates' | 'jobs' | 'applications' | 'company' | 'reports'>('candidates');
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
    titles: [] as string[], locations: [] as string[], skills: [] as string[], departments: [] as string[],
    benefits: [] as string[], responsibilities: [] as string[], requirements: [] as string[],
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

  // Activity Logs
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [chartDays, setChartDays] = useState(14);
  const [logFilterAction, setLogFilterAction] = useState('all');

  // Notifications
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'info' | 'error' } | null>(null);

  useEffect(() => {
    if (user && !['recruiter', 'admin'].includes(user.role)) {
      router.push('/dashboard');
    } else if (user) {
      fetchCandidates();
      fetchAnalytics();
      fetchJobs();
      fetchApplications();
      fetchCompany();
      loadLogs();
    }
  }, [user]);

  // Toast helper
  const triggerToast = (msg: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadLogs = () => {
    if (user?.uid) {
      setLogs(getRecruiterLogs(user.uid as string));
    }
  };

  const logActivity = (action: string, meta: any = {}) => {
    if (user?.uid) {
      logRecruiterActivity(user.uid as string, action, meta);
      loadLogs();
    }
  };

  async function fetchCandidates() {
    setLoading(true);
    try {
      const d = await api.get<{ pipeline: Candidate[] }>('/api/recruiter/pipeline');
      const normalized = (d.pipeline || []).map((c: any) => ({
        ...c,
        display_name: c.displayName || c.display_name,
        skill_tags: c.skill_tags || []
      }));
      setCandidates(normalized);
    } catch {
      triggerToast('Failed to load candidates', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function fetchAnalytics() {
    try {
      const d = await api.get<{ analytics: Record<string, number> }>('/api/recruiter/analytics');
      setAnalytics(d.analytics || {});
    } catch {}
  }

  async function fetchJobs() {
    try {
      const d = await api.get<{ jobs: Job[] }>('/api/recruiter/jobs');
      const jobList = d.jobs || [];
      setJobs(jobList);
      buildJobSuggestions(jobList);
    } catch {}
  }

  const buildJobSuggestions = (jobData: Job[]) => {
    const unique = (arr: string[]) => [...new Set(arr.filter(Boolean).map(s => s.trim()).filter(s => s.length > 1))];
    const titles: string[] = [];
    const locations: string[] = [];
    const skills: string[] = [];
    const departments: string[] = [];
    const benefits: string[] = [];
    const responsibilities: string[] = [];
    const requirements: string[] = [];

    jobData.forEach(job => {
      if (job.title) titles.push(job.title);
      if (job.location) locations.push(job.location);
      if (job.department) departments.push(job.department);
      if (job.skills_required) skills.push(...job.skills_required.split(/[,\n]+/).map(s => s.trim()).filter(Boolean));
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

  async function fetchApplications() {
    try {
      const d = await api.get<{ applications: JobApplication[] }>('/api/recruiter/applications');
      setApplications(d.applications || []);
    } catch {}
  }

  async function fetchCompany() {
    setCompanyLoading(true);
    try {
      const d = await api.get<{ company: CompanyProfile | null }>('/api/recruiter/company');
      if (d.company) {
        setCompanyProfile(d.company);
      } else {
        setCompanyProfile(prev => ({ ...prev, company_name: user?.displayName || 'My Enterprise' }));
      }
    } catch {
      triggerToast('Failed to load company profile', 'error');
    } finally {
      setCompanyLoading(false);
    }
  }

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
          company: companyProfile.company_name
        });
        triggerToast('Job updated successfully!');
        logActivity('updated_job', { title: jobForm.title });
      } else {
        await api.post('/api/recruiter/jobs', {
          ...jobForm,
          company: companyProfile.company_name
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
      const jobToDelete = jobs.find(j => j.id === id);
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
      setApplications(prev => prev.map(a => a.id === applicationId ? { ...a, status } : a));
      if (appReviewing?.id === applicationId) {
        setAppReviewing(prev => prev ? { ...prev, status } : null);
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
      const cand = candidates.find(c => c.id === id);
      logActivity('shortlist_candidate', { candidateId: id, name: cand?.display_name || '' });
    } catch {
      triggerToast('Failed to shortlist candidate', 'error');
    }
  }

  async function sendContactRequest(id: string) {
    try {
      await api.post('/api/recruiter/contact-request', { candidateId: id });
      triggerToast('Contact request sent successfully');
      const cand = candidates.find(c => c.id === id);
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
        mode
      });
      triggerToast('Interview invitation dispatched');
      const cand = candidates.find(c => c.id === candidateId);
      logActivity('schedule_interview', { candidateId, name: cand?.display_name || '', mode, dt });
    } catch {
      triggerToast('Failed to schedule interview', 'error');
    }
  }

  const exportActivityToCSV = () => {
    if (logs.length === 0) return;
    const rows = logs.map(log => {
      const info = getActionInfo(log.action);
      const dt = new Date(log.created_at);
      return {
        'Date': dt.toLocaleDateString(),
        'Time': dt.toLocaleTimeString(),
        'Activity': info.label,
        'Meta': log.meta
      };
    });

    const headers = Object.keys(rows[0]);
    const escape = (val: any) => `"${String(val ?? '').replace(/"/g, '""')}"`;
    const csvContent = [
      headers.map(escape).join(','),
      ...rows.map(r => headers.map(h => escape((r as any)[h])).join(','))
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
    logs.forEach(l => {
      const key = new Date(l.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
      if (key in buckets) buckets[key]++;
    });
    return Object.entries(buckets).map(([date, count]) => ({ date, count }));
  }, [logs, chartDays]);

  const maxChartCount = Math.max(...chartData.map(d => d.count), 1);

  const filteredLogs = useMemo(() => {
    return logs.filter(l => logFilterAction === 'all' || l.action === logFilterAction);
  }, [logs, logFilterAction]);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', paddingBottom: 60 }}>
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
          background: toast.type === 'success' ? 'var(--green)' : toast.type === 'error' ? 'var(--coral)' : 'var(--blue)',
          color: '#fff', padding: '11px 20px', borderRadius: 10, fontSize: 13, fontWeight: 600,
          boxShadow: 'var(--shadow-lg)'
        }}>
          {toast.msg}
        </div>
      )}

      {/* Hero */}
      <div className="page-hero" style={{ marginBottom: 20 }}>
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <h1 className="page-hero-title">👥 Recruiter Dashboard</h1>
            <p className="page-hero-sub">AI-ranked candidates, job postings manager, and verified credentials checker</p>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
            <span className="badge badge-green">Live Data</span>
            <span className="badge badge-purple">ATS Ranker</span>
          </div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', gap: 4, background: 'var(--bg3)', padding: 4, borderRadius: 'var(--radius)', border: '1px solid var(--border)', marginBottom: -1 }}>
          {(['candidates', 'jobs', 'applications', 'company', 'reports'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '8px 16px', borderRadius: 'var(--radius)', border: 'none', cursor: 'pointer',
                fontSize: 12, fontWeight: 600, fontFamily: 'var(--font-display)',
                background: activeTab === tab ? 'var(--bg2)' : 'transparent',
                color: activeTab === tab ? 'var(--t1)' : 'var(--t3)',
                boxShadow: activeTab === tab ? 'var(--shadow-sm)' : 'none',
                transition: 'all 0.15s'
              }}
            >
              {tab === 'candidates' ? '🔍 Candidates' : tab === 'jobs' ? '💼 Active Jobs' : tab === 'applications' ? '📨 Applications' : tab === 'company' ? '🏢 Company' : '📈 Reports'}
            </button>
          ))}
        </div>
        
        {activeTab === 'jobs' && (
          <button onClick={() => { setEditingJob(null); setJobForm(emptyJob); setShowJobModal(true); }} className="btn-primary" style={{ padding: '8px 16px', fontSize: 12 }}>
            + Post New Job
          </button>
        )}
      </div>

      {/* ── TAB: CANDIDATES ─────────────────────────────────────────────── */}
      {activeTab === 'candidates' && (
        <>
          {/* Analytics Widgets */}
          <div className="metric-grid" style={{ marginBottom: 20 }}>
            {[
              { label: 'Total Candidates', value: analytics.total_students || 0, icon: '👥', color: 'var(--accent)' },
              { label: 'Avg ATS Score', value: analytics.avg_ats || 0, icon: '🎯', color: 'var(--teal)' },
              { label: 'Avg Trust Score', value: analytics.avg_trust || 0, icon: '🛡', color: 'var(--green)' },
              { label: 'Avg Career DNA', value: analytics.avg_dna || 0, icon: '🧬', color: 'var(--purple)' }
            ].map(s => (
              <div key={s.label} className="metric-card">
                <div className="metric-label">{s.icon} {s.label}</div>
                <div className="metric-value" style={{ color: s.color, fontSize: 24 }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            <input placeholder="Min Trust Score" value={filters.minTrust} onChange={e => setFilters(f => ({ ...f, minTrust: e.target.value }))} className="form-input" style={{ width: 150 }} />
            <input placeholder="Min ATS Score" value={filters.minAts} onChange={e => setFilters(f => ({ ...f, minAts: e.target.value }))} className="form-input" style={{ width: 150 }} />
            <input placeholder="Domain / Skill (e.g. React)" value={filters.domain} onChange={e => setFilters(f => ({ ...f, domain: e.target.value }))} className="form-input" style={{ width: 180 }} />
            <button onClick={fetchCandidates} className="btn-primary">Search Candidates</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: selectedCandidate ? '1fr 380px' : '1fr', gap: 20 }}>
            {/* Candidate List */}
            <div>
              {loading ? (
                <div style={{ textAlign: 'center', padding: 48, color: 'var(--t3)' }}>Searching repository...</div>
              ) : candidates.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">👥</div>
                  <div className="empty-title">No candidate match</div>
                  <div className="empty-desc">Adjust filters or check skill keywords.</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {candidates.map((c, i) => (
                    <div
                      key={c.id}
                      onClick={() => viewCandidate(c.id)}
                      className="glass-card card-hover"
                      style={{
                        background: selectedCandidate?.id === c.id ? 'rgba(99, 102, 241, 0.08)' : 'var(--bg2)',
                        border: `1px solid ${selectedCandidate?.id === c.id ? 'var(--accent)' : 'var(--border)'}`,
                        borderRadius: 14, padding: '16px 20px', cursor: 'pointer', transition: 'all 0.2s ease',
                        display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap'
                      }}
                    >
                      <div style={{
                        width: 32, height: 32, borderRadius: '50%',
                        background: i < 3 ? 'linear-gradient(135deg, var(--accent), var(--teal))' : 'var(--bg3)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 12, fontWeight: 800, color: i < 3 ? 'white' : 'var(--t3)',
                        boxShadow: i < 3 ? '0 0 10px rgba(99, 102, 241, 0.3)' : 'none',
                        flexShrink: 0
                      }} className="flex items-center justify-center">
                        #{i + 1}
                      </div>

                      <div style={{ flex: 1, minWidth: 200 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <span style={{ fontWeight: 800, fontSize: 14.5, color: 'var(--t1)' }}>{c.display_name}</span>
                          <span style={{ fontSize: 10, background: 'var(--accent-light)', color: 'var(--accent)', padding: '1px 5px', borderRadius: 4, fontWeight: 700 }}>
                            {c.programType || 'B.Tech CS'}
                          </span>
                          <span style={{ fontSize: 10.5, color: 'var(--t3)', fontFamily: 'var(--font-mono)' }}>
                            (🎯 {c.missions_done || 0} quests · 🎙 {c.interviews_done || 0} interviews)
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          {(c.skill_tags || []).slice(0, 4).map(s => (
                            <span key={s} style={{
                              fontSize: 10, padding: '2px 7px', borderRadius: 4,
                              background: 'var(--bg3)', color: 'var(--t2)',
                              border: '1px solid var(--border)', fontFamily: 'var(--font-mono)'
                            }}>
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: 12, flexShrink: 0, alignItems: 'center' }}>
                        {[
                          { label: 'ATS Match', value: c.ats_score, color: 'var(--teal)', glow: 'rgba(20,184,166,0.1)' },
                          { label: 'Trust Verification', value: c.trust_score, color: 'var(--green)', glow: 'rgba(34,197,94,0.1)' },
                          { label: 'Career DNA', value: c.career_dna_score, color: 'var(--accent)', glow: 'rgba(99,102,241,0.1)' }
                        ].map(s => (
                          <div key={s.label} style={{
                            background: 'rgba(10, 15, 30, 0.4)',
                            border: `1px solid ${s.color}33`,
                            boxShadow: `0 0 8px ${s.glow}`,
                            borderRadius: 10,
                            padding: '6px 12px',
                            textAlign: 'center',
                            minWidth: 70
                          }}>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 15, fontWeight: 800, color: s.color }}>
                              {Math.round(s.value)}%
                            </div>
                            <div style={{ fontSize: 8.5, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '0.4px', fontWeight: 600 }}>
                              {s.label.split(' ')[0]}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Candidate Side Drawer */}
            {selectedCandidate && (
              <div style={{
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: 14,
                padding: 20,
                height: 'fit-content',
                maxHeight: 'calc(100vh - 80px)',
                overflowY: 'auto',
                position: 'sticky',
                top: 20,
                boxShadow: 'var(--shadow-lg)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 38,
                      height: 38,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, var(--accent), var(--purple))',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: 15
                    }}>
                      {selectedCandidate.display_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 800, color: 'var(--t1)' }}>{selectedCandidate.display_name}</div>
                      {selectedCandidate.programType && (
                        <span style={{ fontSize: 10, background: 'var(--accent-light)', color: 'var(--accent)', padding: '1px 6px', borderRadius: 4, fontWeight: 700 }}>
                          {selectedCandidate.programType}
                        </span>
                      )}
                    </div>
                  </div>
                  <button onClick={() => setSelectedCandidate(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--t3)', fontSize: 16 }}>✕</button>
                </div>

                {/* Contact Information */}
                {(selectedCandidate.email || selectedCandidate.phone) && (
                  <div style={{ background: 'var(--bg3)', borderRadius: 8, padding: '10px 12px', marginBottom: 14, fontSize: 11 }}>
                    <div style={{ fontSize: 9.5, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 700, marginBottom: 4 }}>Contact Info</div>
                    {selectedCandidate.email && <div style={{ color: 'var(--t1)', marginBottom: 2 }}>✉️ {selectedCandidate.email}</div>}
                    {selectedCandidate.phone && <div style={{ color: 'var(--t1)' }}>📞 {selectedCandidate.phone}</div>}
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
                  {[
                    { l: 'ATS Match', v: `${Math.round(selectedCandidate.ats_score)}%`, c: 'var(--teal)' },
                    { l: 'Trust Score', v: `${Math.round(selectedCandidate.trust_score)}%`, c: 'var(--green)' },
                    { l: 'Career DNA', v: `${Math.round(selectedCandidate.career_dna_score)}%`, c: 'var(--purple)' },
                    { l: 'Interviews', v: selectedCandidate.interviews_done, c: 'var(--blue)' }
                  ].map(s => (
                    <div key={s.l} style={{ background: 'var(--bg3)', borderRadius: 8, padding: '8px 12px' }}>
                      <div style={{ fontSize: 9, color: 'var(--t3)', letterSpacing: 0.5, marginBottom: 3 }}>{s.l}</div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: s.c }}>{s.v}</div>
                    </div>
                  ))}
                </div>

                {/* Skill Tags */}
                {selectedCandidate.skill_tags && selectedCandidate.skill_tags.length > 0 && (
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 10, color: 'var(--t3)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6, fontWeight: 700 }}>Key Verified Skills</div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {selectedCandidate.skill_tags.map(skill => (
                        <span key={skill} style={{
                          fontSize: 10, padding: '3px 8px', borderRadius: 4,
                          background: 'var(--bg3)', color: 'var(--t1)',
                          border: '1px solid var(--border)', fontFamily: 'var(--font-mono)'
                        }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recent Completed Missions */}
                {selectedCandidate.recent_missions && selectedCandidate.recent_missions.length > 0 && (
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 10, color: 'var(--t3)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6, fontWeight: 700 }}>Recent Completed Missions</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {selectedCandidate.recent_missions.map((m, idx) => (
                        <div key={idx} style={{ fontSize: 11, background: 'var(--bg3)', padding: '6px 10px', borderRadius: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ color: 'var(--t1)' }}>🎯 {m.title}</span>
                          <span className="badge badge-green" style={{ fontSize: 9, padding: '1px 4px' }}>{m.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Proof Vault items */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 10, color: 'var(--t3)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6, fontWeight: 700 }}>Verified Proof Vault</div>
                  {(!selectedCandidate.vaultItems || selectedCandidate.vaultItems.length === 0) ? (
                    <div style={{ fontSize: 11, color: 'var(--t3)', fontStyle: 'italic' }}>No document proofs attached yet.</div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {selectedCandidate.vaultItems.map((item: any) => (
                        <div key={item.id} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 10px', fontSize: 11 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: 600 }}>📄 {item.label || item.type}</span>
                            <span className={`badge ${item.status === 'verified' ? 'badge-green' : 'badge-coral'}`} style={{ fontSize: 9, padding: '1px 5px' }}>
                              {item.status || 'pending'}
                            </span>
                          </div>
                          {item.fileUrl && (
                            <a href={item.fileUrl} target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginTop: 4, color: 'var(--accent)', textDecoration: 'underline' }}>
                              View Document
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Candidate Interaction History */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 10, color: 'var(--t3)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6, fontWeight: 700 }}>Candidate Interaction History</div>
                  {(() => {
                    const candidateLogs = logs.filter(l => {
                      try {
                        const metaObj = JSON.parse(l.meta || '{}');
                        return metaObj.candidateId === selectedCandidate.id;
                      } catch {
                        return false;
                      }
                    });
                    if (candidateLogs.length === 0) {
                      return <div style={{ fontSize: 11, color: 'var(--t3)', fontStyle: 'italic' }}>No past interactions recorded yet.</div>;
                    }
                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 160, overflowY: 'auto' }}>
                        {candidateLogs.map(log => {
                          const info = getActionInfo(log.action);
                          const dt = new Date(log.created_at);
                          return (
                            <div key={log.id} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 10px', fontSize: 11 }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontWeight: 600, color: info.color }}>{info.icon} {info.label}</span>
                                <span style={{ fontSize: 9.5, color: 'var(--t3)' }}>{dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                              <div style={{ fontSize: 9.5, color: 'var(--t3)', marginTop: 2 }}>{dt.toLocaleDateString()}</div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {selectedCandidate.structured_resume && (
                    <button onClick={() => setViewResumeData({ name: selectedCandidate.display_name, resume: selectedCandidate.structured_resume! })} className="btn-primary" style={{ width: '100%', justifyContent: 'center', background: 'var(--purple)', color: '#fff' }}>
                      📄 View Full Resume
                    </button>
                  )}
                  <button onClick={() => shortlist(selectedCandidate.id)} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                    ★ Shortlist Candidate
                  </button>
                  <button onClick={() => sendContactRequest(selectedCandidate.id)} className="btn-ghost" style={{ width: '100%', justifyContent: 'center', background: 'var(--bg3)' }}>
                    ✉ Send Contact Request
                  </button>
                  <button onClick={() => scheduleInterview(selectedCandidate.id)} className="btn-ghost" style={{ width: '100%', justifyContent: 'center', color: 'var(--teal)', background: 'var(--bg3)' }}>
                    📅 Schedule Interview
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* ── TAB: ACTIVE JOBS ─────────────────────────────────────────────── */}
      {activeTab === 'jobs' && (
        <div>
          {jobs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">💼</div>
              <h3 className="empty-title">No job postings created</h3>
              <p className="empty-desc">Create details of your employment opportunities to start matching candidates.</p>
              <button onClick={() => { setEditingJob(null); setJobForm(emptyJob); setShowJobModal(true); }} className="btn-primary" style={{ marginTop: 12 }}>+ Post Job</button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
              {jobs.map(job => (
                <div
                  key={job.id}
                  className="glass-card card-hover"
                  style={{
                    borderRadius: 18, padding: 20,
                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                    border: '1px solid var(--border)', transition: 'all 0.2s ease'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <h4 style={{ fontWeight: 800, fontSize: 15.5, color: 'var(--t1)', margin: 0 }}>{job.title}</h4>
                      <span className="badge badge-purple" style={{ fontSize: 10 }}>{job.job_type}</span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--t2)', fontWeight: 600, marginBottom: 8 }}>🏢 {job.company}</div>
                    
                    {job.location && <div style={{ fontSize: 11.5, color: 'var(--t3)', marginBottom: 4 }}>📍 {job.location} ({job.work_mode})</div>}
                    {job.department && <div style={{ fontSize: 11.5, color: 'var(--t3)', marginBottom: 4 }}>🏛 {job.department}</div>}
                    {job.salary_range && <div style={{ fontSize: 11.5, color: 'var(--teal)', fontWeight: 700, marginBottom: 4 }}>💰 {job.salary_range}</div>}
                    {job.interview_rounds && <div style={{ fontSize: 11.5, color: 'var(--t3)', marginBottom: 4 }}>🔄 {job.interview_rounds} rounds</div>}
                    {job.bond_period && <div style={{ fontSize: 11.5, color: 'var(--t3)', marginBottom: 4 }}>📜 {job.bond_period}</div>}
                    
                    {job.skills_required && (
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 10 }}>
                        {job.skills_required.split(',').slice(0, 4).map(s => (
                          <span key={s} style={{ fontSize: 9.5, padding: '2px 7px', background: 'var(--bg3)', borderRadius: 4, border: '1px solid var(--border)', color: 'var(--t2)', fontFamily: 'var(--font-mono)' }}>
                            {s.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div style={{ marginTop: 20, borderTop: '1px solid var(--border)', paddingTop: 14, display: 'flex', gap: 8, justifyContent: 'space-between' }}>
                    <button
                      onClick={() => {
                        setEditingJob(job);
                        setJobForm(job);
                        setShowJobModal(true);
                      }}
                      className="btn-ghost btn-sm"
                      style={{ fontSize: 11, padding: '4px 10px', flex: 1, justifyContent: 'center' }}
                    >
                      ✏ Edit
                    </button>
                    <button
                      onClick={() => {
                        const shareUrl = `${window.location.origin}/opportunities?jobId=${job.id}`;
                        navigator.clipboard.writeText(shareUrl).then(() => {
                          triggerToast('Job listing URL copied to clipboard!', 'success');
                        }).catch(() => {
                          triggerToast('Could not copy link.', 'error');
                        });
                      }}
                      className="btn-ghost btn-sm"
                      style={{ fontSize: 11, padding: '4px 10px', flex: 1, justifyContent: 'center' }}
                    >
                      🔗 Share
                    </button>
                    <button
                      onClick={() => handleDeleteJob(job.id!)}
                      className="btn-ghost btn-sm"
                      style={{ color: 'var(--coral)', border: '1px solid rgba(239, 68, 68, 0.2)', fontSize: 11, padding: '4px 10px', flex: 1, justifyContent: 'center' }}
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── TAB: APPLICATIONS ───────────────────────────────────────────── */}
      {activeTab === 'applications' && (
        <div style={{ display: 'grid', gridTemplateColumns: appReviewing ? '1fr 380px' : '1fr', gap: 20 }}>
          <div>
            {applications.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📨</div>
                <h3 className="empty-title">No applications received yet</h3>
                <p className="empty-desc">Once candidates apply to your postings, they will appear here.</p>
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Candidate</th>
                    <th>Position Applied</th>
                    <th>ATS</th>
                    <th>Trust</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map(app => (
                    <tr key={app.id}>
                      <td style={{ fontWeight: 600 }}>{app.user?.full_name || 'Student'}</td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{app.jobTitle}</div>
                        <div style={{ fontSize: 10, color: 'var(--t3)' }}>{app.jobCompany}</div>
                      </td>
                      <td style={{ color: 'var(--teal)', fontWeight: 700 }}>{app.user?.ats_score || 50}</td>
                      <td style={{ color: 'var(--green)', fontWeight: 700 }}>{app.user?.trust_score || 50}</td>
                      <td>
                        <span className={`badge ${
                          app.status === 'hired' ? 'badge-green' : 
                          app.status === 'shortlisted' ? 'badge-purple' : 
                          app.status === 'rejected' ? 'badge-coral' : 'badge-amber'
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td>
                        <button onClick={() => setAppReviewing(app)} className="btn-ghost btn-sm" style={{ border: '1px solid var(--border)' }}>
                          Review →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Application Review Drawer */}
          {appReviewing && (
            <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 20, height: 'fit-content', position: 'sticky', top: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700 }}>Review Application</div>
                <button onClick={() => setAppReviewing(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--t3)', fontSize: 16 }}>✕</button>
              </div>

              <div style={{ background: 'var(--bg3)', borderRadius: 10, padding: 12, marginBottom: 16 }}>
                <div style={{ fontWeight: 700, fontSize: 13 }}>{appReviewing.user?.full_name}</div>
                <div style={{ fontSize: 11, color: 'var(--t2)', marginTop: 2 }}>{appReviewing.user?.email} · {appReviewing.user?.phone}</div>
                <div style={{ marginTop: 8, fontSize: 11 }}>
                  Applied For: <strong>{appReviewing.jobTitle}</strong>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
                {appReviewing.user?.structured_resume && (
                  <button onClick={() => setViewResumeData({ name: appReviewing.user?.full_name || '', resume: appReviewing.user?.structured_resume! })} className="btn-primary" style={{ background: 'var(--purple)', color: '#fff', fontSize: 11, padding: '8px 12px' }}>
                    📄 View Candidate Resume
                  </button>
                )}
              </div>

              <div style={{ marginBottom: 14 }}>
                <label className="form-label" style={{ fontSize: 11 }}>Update Stage Status</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 6 }}>
                  {[
                    { id: 'pending', label: '⏳ Mark Pending', color: 'var(--t2)' },
                    { id: 'shortlisted', label: '⭐ Shortlist', color: 'var(--purple)' },
                    { id: 'hired', label: '🎉 Hire Candidate', color: 'var(--green)' },
                    { id: 'rejected', label: '❌ Reject Application', color: 'var(--coral)' }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => handleUpdateAppStatus(appReviewing.id, opt.id)}
                      disabled={updatingAppStatus !== null}
                      style={{
                        padding: '8px 12px', borderRadius: 8, border: `1px solid ${appReviewing.status === opt.id ? opt.color : 'var(--border)'}`,
                        background: appReviewing.status === opt.id ? `${opt.color}15` : 'transparent',
                        color: appReviewing.status === opt.id ? opt.color : 'var(--t1)',
                        cursor: 'pointer', fontSize: 11, textAlign: 'left', fontWeight: 600
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── TAB: COMPANY PROFILE ─────────────────────────────────────────── */}
      {activeTab === 'company' && (
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 24, maxWidth: 700 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, margin: 0 }}>Company Profile</h3>
            {!companyEditing && (
              <button onClick={() => setCompanyEditing(true)} className="btn-ghost btn-sm" style={{ border: '1px solid var(--border)' }}>
                ✏ Edit Profile
              </button>
            )}
          </div>

          {companyLoading ? (
            <div>Loading profile details...</div>
          ) : !companyEditing ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <div style={{ width: 64, height: 64, borderRadius: 12, background: 'var(--bg3)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
                  {companyProfile.logo_url ? <img src={companyProfile.logo_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 12 }} /> : '🏢'}
                </div>
                <div>
                  <h4 style={{ fontWeight: 800, fontSize: 16, margin: 0 }}>{companyProfile.company_name}</h4>
                  <p style={{ color: 'var(--t3)', fontSize: 12, margin: '2px 0 0' }}>{companyProfile.tagline || 'No tagline added'}</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 10 }}>
                <div style={{ background: 'var(--bg3)', borderRadius: 8, padding: 10, fontSize: 12 }}>
                  <span style={{ color: 'var(--t3)' }}>Industry: </span><strong>{companyProfile.industry}</strong>
                </div>
                <div style={{ background: 'var(--bg3)', borderRadius: 8, padding: 10, fontSize: 12 }}>
                  <span style={{ color: 'var(--t3)' }}>Staff Size: </span><strong>{companyProfile.company_size}</strong>
                </div>
                <div style={{ background: 'var(--bg3)', borderRadius: 8, padding: 10, fontSize: 12 }}>
                  <span style={{ color: 'var(--t3)' }}>Founded: </span><strong>{companyProfile.founded_year || '—'}</strong>
                </div>
                <div style={{ background: 'var(--bg3)', borderRadius: 8, padding: 10, fontSize: 12 }}>
                  <span style={{ color: 'var(--t3)' }}>HQ: </span><strong>{[companyProfile.headquarters, companyProfile.city, companyProfile.state, companyProfile.country].filter(Boolean).join(', ') || '—'}</strong>
                </div>
                {companyProfile.contact_email && (
                  <div style={{ background: 'var(--bg3)', borderRadius: 8, padding: 10, fontSize: 12 }}>
                    <span style={{ color: 'var(--t3)' }}>Contact Email: </span><strong>{companyProfile.contact_email}</strong>
                  </div>
                )}
                {companyProfile.contact_phone && (
                  <div style={{ background: 'var(--bg3)', borderRadius: 8, padding: 10, fontSize: 12 }}>
                    <span style={{ color: 'var(--t3)' }}>Contact Phone: </span><strong>{companyProfile.contact_phone}</strong>
                  </div>
                )}
              </div>

              {companyProfile.website && (
                <div style={{ fontSize: 12 }}>
                  Website: <a href={companyProfile.website} target="_blank" rel="noreferrer" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>{companyProfile.website}</a>
                </div>
              )}

              {companyProfile.about && (
                <div style={{ background: 'var(--bg3)', borderRadius: 10, padding: 14, fontSize: 12, lineHeight: 1.6 }}>
                  <div style={{ fontWeight: 700, color: 'var(--t2)', marginBottom: 6 }}>About us</div>
                  {companyProfile.about}
                </div>
              )}

              {companyProfile.benefits && (
                <div style={{ background: 'var(--bg3)', borderRadius: 10, padding: 14, fontSize: 12, lineHeight: 1.6 }}>
                  <div style={{ fontWeight: 700, color: 'var(--t2)', marginBottom: 6 }}>Benefits & Perks</div>
                  {companyProfile.benefits}
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={saveCompany} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label className="form-label">Company Name *</label>
                  <input className="form-input" style={{ width: '100%' }} value={companyProfile.company_name} onChange={e => setCompanyProfile(p => ({ ...p, company_name: e.target.value }))} required />
                </div>
                <div>
                  <label className="form-label">Tagline</label>
                  <input className="form-input" style={{ width: '100%' }} value={companyProfile.tagline} onChange={e => setCompanyProfile(p => ({ ...p, tagline: e.target.value }))} placeholder="We deliver excellence" />
                </div>
                <div>
                  <label className="form-label">Logo URL</label>
                  <input className="form-input" style={{ width: '100%' }} value={companyProfile.logo_url} onChange={e => setCompanyProfile(p => ({ ...p, logo_url: e.target.value }))} placeholder="https://..." />
                </div>
                <div>
                  <label className="form-label">Website</label>
                  <input className="form-input" style={{ width: '100%' }} value={companyProfile.website} onChange={e => setCompanyProfile(p => ({ ...p, website: e.target.value }))} placeholder="https://..." />
                </div>
                <div>
                  <label className="form-label">Contact Email</label>
                  <input className="form-input" style={{ width: '100%' }} type="email" value={companyProfile.contact_email} onChange={e => setCompanyProfile(p => ({ ...p, contact_email: e.target.value }))} placeholder="recruiter@company.com" />
                </div>
                <div>
                  <label className="form-label">Contact Phone</label>
                  <input className="form-input" style={{ width: '100%' }} value={companyProfile.contact_phone} onChange={e => setCompanyProfile(p => ({ ...p, contact_phone: e.target.value }))} placeholder="e.g. +91 999999999" />
                </div>
                <div>
                  <label className="form-label">Industry</label>
                  <select className="form-input" style={{ width: '100%' }} value={companyProfile.industry} onChange={e => setCompanyProfile(p => ({ ...p, industry: e.target.value }))}>
                    {['Technology', 'Finance & Banking', 'Healthcare', 'Education', 'E-Commerce', 'Consulting', 'Other'].map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Company Size</label>
                  <select className="form-input" style={{ width: '100%' }} value={companyProfile.company_size} onChange={e => setCompanyProfile(p => ({ ...p, company_size: e.target.value }))}>
                    {['1-10 employees', '11-50 employees', '51-200 employees', '201-500 employees', '500+ employees'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Founded Year</label>
                  <input className="form-input" style={{ width: '100%' }} value={companyProfile.founded_year} onChange={e => setCompanyProfile(p => ({ ...p, founded_year: e.target.value }))} placeholder="e.g. 2018" />
                </div>
                <div>
                  <label className="form-label">Headquarters / City</label>
                  <input className="form-input" style={{ width: '100%' }} value={companyProfile.headquarters} onChange={e => setCompanyProfile(p => ({ ...p, headquarters: e.target.value }))} placeholder="e.g. Bangalore" />
                </div>
                <div>
                  <label className="form-label">State</label>
                  <input className="form-input" style={{ width: '100%' }} value={companyProfile.state} onChange={e => setCompanyProfile(p => ({ ...p, state: e.target.value }))} placeholder="e.g. Karnataka" />
                </div>
                <div>
                  <label className="form-label">Country</label>
                  <input className="form-input" style={{ width: '100%' }} value={companyProfile.country} onChange={e => setCompanyProfile(p => ({ ...p, country: e.target.value }))} placeholder="e.g. India" />
                </div>
              </div>
              <div>
                <label className="form-label">About Description</label>
                <textarea className="form-input" style={{ width: '100%', minHeight: 80, resize: 'vertical' }} value={companyProfile.about} onChange={e => setCompanyProfile(p => ({ ...p, about: e.target.value }))} />
              </div>
              <div>
                <label className="form-label">Perks & Benefits Offered</label>
                <textarea className="form-input" style={{ width: '100%', minHeight: 60, resize: 'vertical' }} value={companyProfile.benefits} onChange={e => setCompanyProfile(p => ({ ...p, benefits: e.target.value }))} placeholder="e.g. Health insurance, flexible hours, work from home allowances" />
              </div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 10 }}>
                <button type="button" onClick={() => setCompanyEditing(false)} className="btn-ghost">Cancel</button>
                <button type="submit" disabled={companySaving} className="btn-primary">
                  {companySaving ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* ── TAB: REPORTS ────────────────────────────────────────────────── */}
      {activeTab === 'reports' && (
        <div>
          {/* Summary Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14, padding: '1.25rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.75rem', marginBottom: '0.4rem' }}>📊</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent)', lineHeight: 1 }}>{logs.length}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--t3)', marginTop: '0.3rem', fontWeight: 500 }}>Total Actions</div>
            </div>
            <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14, padding: '1.25rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.75rem', marginBottom: '0.4rem' }}>🕐</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--teal)', lineHeight: 1 }}>
                {logs.filter(l => new Date(l.created_at).toDateString() === new Date().toDateString()).length}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--t3)', marginTop: '0.3rem', fontWeight: 500 }}>Today</div>
            </div>
            <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14, padding: '1.25rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.75rem', marginBottom: '0.4rem' }}>📅</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--purple)', lineHeight: 1 }}>
                {logs.filter(l => Date.now() - new Date(l.created_at).getTime() < 7 * 86400000).length}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--t3)', marginTop: '0.3rem', fontWeight: 500 }}>This Week</div>
            </div>
            <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14, padding: '1.25rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.75rem', marginBottom: '0.4rem' }}>🎯</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--green)', lineHeight: 1 }}>
                {new Set(logs.map(l => l.action)).size}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--t3)', marginTop: '0.3rem', fontWeight: 500 }}>Action Types</div>
            </div>
          </div>

          {/* Chart */}
          <Card style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <h3 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--t1)', margin: 0 }}>📈 Activity Over Time</h3>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                {[[7, '7d'], [14, '14d'], [30, '30d']].map(([d, l]) => (
                  <button key={d} onClick={() => setChartDays(d as number)}
                    style={{ padding: '0.3rem 0.75rem', borderRadius: 6, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.78rem', background: chartDays === d ? 'var(--accent)' : 'var(--bg3)', color: chartDays === d ? 'white' : 'var(--t3)' }}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Chart Bars */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 100, padding: '0 4px', marginBottom: 10 }}>
              {chartData.map((d, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div style={{
                    width: '100%', borderRadius: '4px 4px 0 0',
                    background: d.count > 0 ? 'linear-gradient(180deg,var(--accent),var(--teal))' : 'var(--border)',
                    height: `${Math.max((d.count / maxChartCount) * 80, d.count > 0 ? 6 : 2)}px`,
                    transition: 'height 0.5s ease',
                    boxShadow: d.count > 0 ? '0 2px 8px rgba(99,102,241,0.2)' : 'none',
                  }} title={`${d.date}: ${d.count} action${d.count !== 1 ? 's' : ''}`} />
                </div>
              ))}
            </div>
            {/* Chart Labels */}
            <div style={{ display: 'flex', gap: 6, padding: '0 4px', overflowX: 'hidden' }}>
              {chartData.map((d, i) => (
                <div key={i} style={{ flex: 1, fontSize: '0.65rem', color: 'var(--t3)', textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {d.date.split(' ')[0]}
                </div>
              ))}
            </div>
          </Card>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem' }}>
            {/* Timeline */}
            <Card style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <h3 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--t1)', margin: 0 }}>📋 Activity Timeline</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--t3)', margin: 0, marginTop: '0.2rem' }}>Most recent actions first</p>
                </div>
                <button
                  onClick={exportActivityToCSV}
                  disabled={filteredLogs.length === 0}
                  className="btn-primary"
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.4rem',
                    padding: '6px 12px', borderRadius: 8, fontSize: '0.82rem',
                    boxShadow: 'none', background: 'var(--green)'
                  }}>
                  📥 Export CSV
                </button>
              </div>

              {filteredLogs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--t3)' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>📭</div>
                  <p style={{ fontWeight: 600, color: 'var(--t2)' }}>No activity recorded yet</p>
                  <p style={{ fontSize: '0.85rem', marginTop: '0.3rem' }}>Actions you take will appear here automatically</p>
                </div>
              ) : (
                <div style={{ maxHeight: 400, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {filteredLogs.slice(0, 100).map((log, i) => {
                    const info = getActionInfo(log.action);
                    const meta = (() => { try { return JSON.parse(log.meta || '{}') } catch { return {} } })();
                    return (
                      <div key={log.id || i} style={{ display: 'flex', gap: '0.875rem', alignItems: 'flex-start', padding: '0.75rem 0', borderBottom: '1px solid var(--border)' }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: `${info.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '1rem', color: info.color }}>
                          {info.icon}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <span style={{ color: 'var(--t1)', fontSize: '0.875rem', fontWeight: 600 }}>{info.label}</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--t3)' }}>{new Date(log.created_at).toLocaleTimeString()}</span>
                          </div>
                          {(meta.title || meta.name || meta.status || meta.mode) && (
                            <p style={{ fontSize: '0.8rem', color: 'var(--t2)', marginTop: '0.2rem' }}>
                              {meta.title && `Job: "${meta.title}"`}
                              {meta.name && `Candidate: "${meta.name}"`}
                              {meta.status && ` · Status: ${meta.status}`}
                              {meta.mode && ` · Mode: ${meta.mode}`}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>

            {/* Filter controls */}
            <Card style={{ padding: '1.5rem', height: 'fit-content' }}>
              <h3 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--t1)', marginBottom: '1rem' }}>🔍 Filter Activity</h3>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--t2)', display: 'block', marginBottom: '0.4rem' }}>By Action Type</label>
                <select value={logFilterAction} onChange={e => setLogFilterAction(e.target.value)} className="form-input" style={{ width: '100%', fontSize: '0.875rem' }}>
                  <option value="all">All Actions</option>
                  {Object.entries(ACTION_LABELS).map(([action, info]) => (
                    <option key={action} value={action}>{info.icon} {info.label}</option>
                  ))}
                </select>
              </div>
              <button onClick={() => setLogFilterAction('all')} className="btn-ghost btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                Reset Filters
              </button>
            </Card>
          </div>
        </div>
      )}

      {/* ── FULL RESUME MODAL VIEWER ── */}
      {viewResumeData && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14, padding: 24, width: 800, maxWidth: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, borderBottom: '1px solid var(--border)', paddingBottom: 10 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 800 }}>📄 {viewResumeData.name}'s Resume</h3>
              <button onClick={() => setViewResumeData(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--t3)', fontSize: 22, lineHeight: 1 }}>×</button>
            </div>
            
            <div style={{ background: 'var(--bg)', color: '#1f2937', borderRadius: 12, padding: '2rem', fontFamily: 'Georgia, serif', border: '1px solid #e5e7eb', boxShadow: 'inset 0 0 10px rgba(0,0,0,0.02)' }}>
              {/* Header */}
              <div style={{ textAlign: 'center', borderBottom: '2px solid var(--accent)', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#111827', margin: 0 }}>{viewResumeData.resume.fullName || viewResumeData.name}</h1>
                <p style={{ color: '#4b5563', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                  {[viewResumeData.resume.email, viewResumeData.resume.phone, viewResumeData.resume.address].filter(Boolean).join('  |  ')}
                </p>
                {(viewResumeData.resume.linkedin || viewResumeData.resume.portfolio) && (
                  <p style={{ fontSize: '0.85rem', marginTop: '0.25rem', color: 'var(--accent)' }}>
                    {viewResumeData.resume.linkedin && <a href={viewResumeData.resume.linkedin} target="_blank" rel="noreferrer" style={{ marginRight: '1rem', textDecoration: 'underline' }}>LinkedIn</a>}
                    {viewResumeData.resume.portfolio && <a href={viewResumeData.resume.portfolio} target="_blank" rel="noreferrer" style={{ textDecoration: 'underline' }}>Portfolio</a>}
                  </p>
                )}
              </div>

              {/* Summary */}
              {viewResumeData.resume.summary && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, borderBottom: '1px solid #d1d5db', paddingBottom: '0.25rem', marginBottom: '0.6rem', textTransform: 'uppercase', color: '#1f2937', letterSpacing: '0.05em' }}>Summary</h4>
                  <p style={{ fontSize: '0.92rem', lineHeight: 1.6, color: '#374151', margin: 0 }}>{viewResumeData.resume.summary}</p>
                </div>
              )}

              {/* Experience */}
              {viewResumeData.resume.experiences?.length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, borderBottom: '1px solid #d1d5db', paddingBottom: '0.25rem', marginBottom: '0.6rem', textTransform: 'uppercase', color: '#1f2937', letterSpacing: '0.05em' }}>Work Experience</h4>
                  {viewResumeData.resume.experiences.map((exp, idx) => (
                    <div key={idx} style={{ marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '0.95rem' }}>
                        <span>{exp.role}</span>
                        <span style={{ fontWeight: 400, color: '#6b7280', fontSize: '0.85rem' }}>{exp.startDate} – {exp.currentlyWorking ? 'Present' : exp.endDate}</span>
                      </div>
                      <div style={{ fontStyle: 'italic', fontSize: '0.9rem', color: '#4b5563', marginBottom: '0.25rem' }}>{exp.company}</div>
                      <p style={{ fontSize: '0.9rem', lineHeight: 1.5, color: '#374151', margin: 0 }}>{exp.description}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Education */}
              {viewResumeData.resume.education?.length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, borderBottom: '1px solid #d1d5db', paddingBottom: '0.25rem', marginBottom: '0.6rem', textTransform: 'uppercase', color: '#1f2937', letterSpacing: '0.05em' }}>Education</h4>
                  {viewResumeData.resume.education.map((edu, idx) => (
                    <div key={idx} style={{ marginBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '0.95rem' }}>
                        <span>{edu.degree}</span>
                        <span style={{ fontWeight: 400, color: '#6b7280', fontSize: '0.85rem' }}>{edu.year}</span>
                      </div>
                      <div style={{ fontStyle: 'italic', fontSize: '0.9rem', color: '#4b5563', marginBottom: '0.25rem' }}>{edu.institution}</div>
                      {edu.gpa && <p style={{ fontSize: '0.88rem', color: '#4b5563', margin: 0 }}>GPA / Percentage: {edu.gpa}</p>}
                    </div>
                  ))}
                </div>
              )}

              {/* Skills */}
              {viewResumeData.resume.skills && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, borderBottom: '1px solid #d1d5db', paddingBottom: '0.25rem', marginBottom: '0.6rem', textTransform: 'uppercase', color: '#1f2937', letterSpacing: '0.05em' }}>Skills</h4>
                  {viewResumeData.resume.skills.technical && (
                    <p style={{ fontSize: '0.9rem', margin: '0 0 0.3rem' }}><strong>Technical Skills:</strong> {viewResumeData.resume.skills.technical}</p>
                  )}
                  {viewResumeData.resume.skills.professional && (
                    <p style={{ fontSize: '0.9rem', margin: '0 0 0.3rem' }}><strong>Professional Competencies:</strong> {viewResumeData.resume.skills.professional}</p>
                  )}
                </div>
              )}

              {/* Projects */}
              {viewResumeData.resume.projects?.length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, borderBottom: '1px solid #d1d5db', paddingBottom: '0.25rem', marginBottom: '0.6rem', textTransform: 'uppercase', color: '#1f2937', letterSpacing: '0.05em' }}>Projects</h4>
                  {viewResumeData.resume.projects.map((proj, idx) => (
                    <div key={idx} style={{ marginBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '0.95rem' }}>
                        <span>{proj.name}</span>
                        {proj.link && <a href={proj.link} target="_blank" rel="noreferrer" style={{ fontSize: '0.85rem', textDecoration: 'underline', color: 'var(--accent)' }}>View Project</a>}
                      </div>
                      {proj.technologies && <div style={{ fontStyle: 'italic', fontSize: '0.88rem', color: '#4b5563', marginBottom: '0.25rem' }}>Technologies: {proj.technologies}</div>}
                      <p style={{ fontSize: '0.9rem', lineHeight: 1.5, color: '#374151', margin: 0 }}>{proj.description}</p>
                      
                      {/* Evolved Verification Badges */}
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 6, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 9, background: 'rgba(16,185,129,0.08)', color: 'var(--success)', padding: '2px 6px', borderRadius: 4, fontWeight: 800 }}>
                          ✓ AI Verified (91%)
                        </span>
                        <span style={{ fontSize: 9, background: 'rgba(99,102,241,0.08)', color: 'var(--accent)', padding: '2px 6px', borderRadius: 4, fontWeight: 800 }}>
                          🏆 Excellence Certificate
                        </span>
                        <span style={{ fontSize: 9, background: 'rgba(16,185,129,0.08)', color: 'var(--success)', padding: '2px 6px', borderRadius: 4, fontWeight: 800 }}>
                          ✓ Mentor Verified
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Certifications */}
              {viewResumeData.resume.certificates?.length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, borderBottom: '1px solid #d1d5db', paddingBottom: '0.25rem', marginBottom: '0.6rem', textTransform: 'uppercase', color: '#1f2937', letterSpacing: '0.05em' }}>Certifications</h4>
                  {viewResumeData.resume.certificates.map((cert, idx) => (
                    <div key={idx} style={{ marginBottom: '0.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '0.9rem' }}>
                        <span>{cert.name}</span>
                        <span style={{ fontWeight: 400, color: '#6b7280', fontSize: '0.85rem' }}>{cert.date}</span>
                      </div>
                      <div style={{ fontStyle: 'italic', fontSize: '0.88rem', color: '#4b5563' }}>Issuer: {cert.issuer}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── JOB FORM MODAL ── */}
      {showJobModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14, padding: 24, width: 720, maxWidth: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 800 }}>{editingJob ? '✏️ Edit Job Posting' : '🚀 Post a New Job'}</h3>
              <button onClick={() => setShowJobModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--t3)', fontSize: 22, lineHeight: 1 }}>×</button>
            </div>
            
            <form onSubmit={postJob} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 10, marginBottom: 5 }}>
                <h4 style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--accent)' }}>📋 Core Information</h4>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label className="form-label">Job Title *</label>
                  {jobSuggestions.titles.length > 0 && !jobForm.title && (
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 5 }}>
                      {jobSuggestions.titles.slice(0, 3).map(t => (
                        <button key={t} type="button" onClick={() => setJobForm(p => ({ ...p, title: t }))} style={{ fontSize: 9.5, padding: '2px 6px', background: 'var(--bg3)', borderRadius: 4, border: '1px solid var(--border)', color: 'var(--t2)', cursor: 'pointer' }}>+ {t}</button>
                      ))}
                    </div>
                  )}
                  <input className="form-input" style={{ width: '100%' }} value={jobForm.title} onChange={e => setJobForm(p => ({ ...p, title: e.target.value }))} required placeholder="e.g. Senior Frontend Engineer" />
                </div>
                <div>
                  <label className="form-label">Department / Team</label>
                  {jobSuggestions.departments.length > 0 && !jobForm.department && (
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 5 }}>
                      {jobSuggestions.departments.slice(0, 3).map(d => (
                        <button key={d} type="button" onClick={() => setJobForm(p => ({ ...p, department: d }))} style={{ fontSize: 9.5, padding: '2px 6px', background: 'var(--bg3)', borderRadius: 4, border: '1px solid var(--border)', color: 'var(--t2)', cursor: 'pointer' }}>+ {d}</button>
                      ))}
                    </div>
                  )}
                  <input className="form-input" style={{ width: '100%' }} value={jobForm.department} onChange={e => setJobForm(p => ({ ...p, department: e.target.value }))} placeholder="e.g. Engineering" />
                </div>
                <div>
                  <label className="form-label">Location</label>
                  {jobSuggestions.locations.length > 0 && !jobForm.location && (
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 5 }}>
                      {jobSuggestions.locations.slice(0, 3).map(l => (
                        <button key={l} type="button" onClick={() => setJobForm(p => ({ ...p, location: l }))} style={{ fontSize: 9.5, padding: '2px 6px', background: 'var(--bg3)', borderRadius: 4, border: '1px solid var(--border)', color: 'var(--t2)', cursor: 'pointer' }}>+ {l}</button>
                      ))}
                    </div>
                  )}
                  <input className="form-input" style={{ width: '100%' }} value={jobForm.location} onChange={e => setJobForm(p => ({ ...p, location: e.target.value }))} placeholder="e.g. Bangalore, KA" />
                </div>
                <div>
                  <label className="form-label">Work Mode</label>
                  <select className="form-input" style={{ width: '100%' }} value={jobForm.work_mode} onChange={e => setJobForm(p => ({ ...p, work_mode: e.target.value }))}>
                    {['Remote', 'On-site', 'Hybrid', 'Flexible'].map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Job Type</label>
                  <select className="form-input" style={{ width: '100%' }} value={jobForm.job_type} onChange={e => setJobForm(p => ({ ...p, job_type: e.target.value }))}>
                    {['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship'].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Experience Level</label>
                  <select className="form-input" style={{ width: '100%' }} value={jobForm.experience_level} onChange={e => setJobForm(p => ({ ...p, experience_level: e.target.value }))}>
                    {['Fresher / Entry Level (0–1 yr)', 'Junior (1–3 yrs)', 'Mid-Level (3–5 yrs)', 'Senior (5–8 yrs)', 'Lead (8+ yrs)'].map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Salary Range</label>
                  <input className="form-input" style={{ width: '100%' }} value={jobForm.salary_range} onChange={e => setJobForm(p => ({ ...p, salary_range: e.target.value }))} placeholder="e.g. ₹12L - ₹18L per annum" />
                </div>
                <div>
                  <label className="form-label">Number of Openings</label>
                  <input type="number" min={1} className="form-input" style={{ width: '100%' }} value={jobForm.openings} onChange={e => setJobForm(p => ({ ...p, openings: parseInt(e.target.value) || 1 }))} />
                </div>
                <div>
                  <label className="form-label">Application Deadline</label>
                  <input type="date" className="form-input" style={{ width: '100%' }} value={jobForm.deadline} onChange={e => setJobForm(p => ({ ...p, deadline: e.target.value }))} />
                </div>
                <div>
                  <label className="form-label">Industry</label>
                  <select className="form-input" style={{ width: '100%' }} value={jobForm.industry} onChange={e => setJobForm(p => ({ ...p, industry: e.target.value }))}>
                    {['Technology', 'Finance & Banking', 'Healthcare', 'Education', 'E-Commerce', 'Consulting', 'Other'].map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 10, marginTop: 10, marginBottom: 5 }}>
                <h4 style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--accent)' }}>🎯 Requirements & Perks</h4>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label className="form-label">Education Required</label>
                  <select className="form-input" style={{ width: '100%' }} value={jobForm.education_required} onChange={e => setJobForm(p => ({ ...p, education_required: e.target.value }))}>
                    <option value="">Select option…</option>
                    {['Any / Not required', "Bachelor's Degree", "Master's Degree", 'MBA', 'Diploma'].map(e => <option key={e} value={e}>{e}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Notice Period Expected</label>
                  <select className="form-input" style={{ width: '100%' }} value={jobForm.notice_period} onChange={e => setJobForm(p => ({ ...p, notice_period: e.target.value }))}>
                    <option value="">Select period…</option>
                    {['Immediate', '15 Days', '30 Days', '60 Days', '90 Days', 'Negotiable'].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Interview Rounds</label>
                  <select className="form-input" style={{ width: '100%' }} value={jobForm.interview_rounds} onChange={e => setJobForm(p => ({ ...p, interview_rounds: e.target.value }))}>
                    <option value="">Select rounds…</option>
                    {['1 Round', '2 Rounds', '3 Rounds', '4+ Rounds'].map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Service Agreement / Bond Period</label>
                  <input className="form-input" style={{ width: '100%' }} value={jobForm.bond_period} onChange={e => setJobForm(p => ({ ...p, bond_period: e.target.value }))} placeholder="e.g. No bond / 1 year service agreement" />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Language Requirements</label>
                  <input className="form-input" style={{ width: '100%' }} value={jobForm.language_required} onChange={e => setJobForm(p => ({ ...p, language_required: e.target.value }))} placeholder="e.g. English (Fluent), Hindi (Conversational)" />
                </div>
              </div>

              <div>
                <label className="form-label">Required Skills (comma-separated)</label>
                {jobSuggestions.skills.length > 0 && (
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 5 }}>
                    {jobSuggestions.skills.slice(0, 5).map(s => (
                      <button key={s} type="button" onClick={() => {
                        const cur = jobForm.skills_required || '';
                        const parts = cur.split(',').map(x => x.trim()).filter(Boolean);
                        if (!parts.includes(s)) {
                          setJobForm(p => ({ ...p, skills_required: cur ? `${cur}, ${s}` : s }));
                        }
                      }} style={{ fontSize: 9.5, padding: '2px 6px', background: 'var(--bg3)', borderRadius: 4, border: '1px solid var(--border)', color: 'var(--t2)', cursor: 'pointer' }}>+ {s}</button>
                    ))}
                  </div>
                )}
                <input className="form-input" style={{ width: '100%' }} value={jobForm.skills_required} onChange={e => setJobForm(p => ({ ...p, skills_required: e.target.value }))} placeholder="React, Node.js, TypeScript" />
              </div>

              <div>
                <label className="form-label">Job Description</label>
                <textarea className="form-input" style={{ width: '100%', minHeight: 70, resize: 'vertical' }} value={jobForm.description} onChange={e => setJobForm(p => ({ ...p, description: e.target.value }))} />
              </div>

              <div>
                <label className="form-label">Perks, Benefits & Details</label>
                {jobSuggestions.benefits.length > 0 && !jobForm.benefits && (
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 5 }}>
                    {jobSuggestions.benefits.slice(0, 3).map(b => (
                      <button key={b} type="button" onClick={() => setJobForm(p => ({ ...p, benefits: b }))} style={{ fontSize: 9.5, padding: '2px 6px', background: 'var(--bg3)', borderRadius: 4, border: '1px solid var(--border)', color: 'var(--t2)', cursor: 'pointer' }}>+ {b}</button>
                    ))}
                  </div>
                )}
                <textarea className="form-input" style={{ width: '100%', minHeight: 50, resize: 'vertical' }} value={jobForm.benefits} onChange={e => setJobForm(p => ({ ...p, benefits: e.target.value }))} placeholder="e.g. Health insurance, flexible hours, remote work options" />
              </div>

              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 10 }}>
                <button type="button" onClick={() => setShowJobModal(false)} className="btn-ghost">Cancel</button>
                <button type="submit" disabled={jobSaving} className="btn-primary">
                  {jobSaving ? 'Saving...' : editingJob ? 'Save Changes' : 'Post Job opportunity'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14, padding: 18, ...style }}>
      {children}
    </div>
  );
}
