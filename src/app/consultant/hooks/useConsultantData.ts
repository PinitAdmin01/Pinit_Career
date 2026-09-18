'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { api } from '@/lib/api/client';

export const STAGES = ['onboarding', 'document_collection', 'application', 'visa', 'pre_departure', 'completed'];

export const STAGE_LABELS: Record<string, string> = {
  onboarding: 'Onboarding',
  document_collection: 'Documents',
  application: 'Application',
  visa: 'Visa',
  pre_departure: 'Pre-Departure',
  completed: 'Completed',
};

export const VISA_STATUS_COLOR: Record<string, string> = {
  not_started: 'var(--t3)',
  pending: 'var(--amber)',
  approved: 'var(--green)',
  rejected: 'var(--coral)',
  submitted: 'var(--blue)',
};

export interface Session {
  id?: string;
  title: string;
  studentId: string;
  studentName: string;
  date: string;
  time: string;
  link?: string;
  notes?: string;
}

export function useConsultantData() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [copilotInput, setCopilotInput] = useState('');
  const [copilotMessages, setCopilotMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    {
      role: 'assistant',
      text: 'Hello! I am your AI Consultant Copilot. Ask me anything about student applications, scholarship matches, or placement readiness.',
    },
  ]);
  const [pipeline, setPipeline] = useState<Record<string, any[]>>({});
  const [analytics, setAnalytics] = useState<Record<string, any>>({});
  const [selectedStudent, setSelectedStudent] = useState<Record<string, any> | null>(null);
  const [mentorVerifiedMap, setMentorVerifiedMap] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [selectedIntelStudent, setSelectedIntelStudent] = useState<any>(null);
  const [selectedGoal, setSelectedGoal] = useState<string>('AI Engineer');
  const [matchingStudent, setMatchingStudent] = useState<string>('');
  const [scholarshipSubTab, setScholarshipSubTab] = useState<string>('government');
  const [selectedDocStudent, setSelectedDocStudent] = useState<string>('');
  const [selectedVisaStudent, setSelectedVisaStudent] = useState<string>('');
  const [studyAbroadSubTab, setStudyAbroadSubTab] = useState<string>('visa');
  const [countryCompA, setCountryCompA] = useState<string>('Germany');
  const [countryCompB, setCountryCompB] = useState<string>('Canada');
  const [showCopilotSidebar, setShowCopilotSidebar] = useState<boolean>(true);
  const [sidebarMessages, setSidebarMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    {
      role: 'assistant',
      text: 'Hello! I am your AI Consultant Copilot. Ask me anything about candidate analytics, university matching, or documents.',
    },
  ]);
  const [showSopAudit, setShowSopAudit] = useState<boolean>(false);
  const [showResumeAudit, setShowResumeAudit] = useState<boolean>(false);
  const [showLorAudit, setShowLorAudit] = useState<boolean>(false);
  const [documentsSubMode, setDocumentsSubMode] = useState<string>('auditor');
  const [sopProjects, setSopProjects] = useState<string>('');
  const [sopResearch, setSopResearch] = useState<string>('');
  const [sopGoal, setSopGoal] = useState<string>('');
  const [sopAchievements, setSopAchievements] = useState<string>('');
  const [generatedSop, setGeneratedSop] = useState<string>('');
  const [generatingSop, setGeneratingSop] = useState<boolean>(false);

  // Checklist Task form
  const [newTask, setNewTask] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');

  // Add student form
  const [studentForm, setStudentForm] = useState({
    displayName: '',
    email: '',
    phone: '',
    targetCountry: '',
    targetUniversities: '',
    programType: '',
    budget: '',
    intakeYear: '',
    notes: '',
  });

  // Sessions state
  const [sessions, setSessions] = useState<Session[]>([]);
  const [sessionForm, setSessionForm] = useState<Session>({
    title: '',
    studentId: '',
    studentName: '',
    date: '',
    time: '',
    link: '',
    notes: '',
  });
  const [scheduling, setScheduling] = useState(false);

  // Toast state
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  // At-Risk Advisory Trigger state
  const [careTeamReviews, setCareTeamReviews] = useState<Record<string, { initiatedAt: string; status: string }>>({});

  const triggerToast = useCallback((msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const toastObj = useMemo(() => ({
    success: (title: string, desc?: string) => triggerToast(`${title}${desc ? `: ${desc}` : ''}`, 'success'),
    error: (title: string, desc?: string) => triggerToast(`${title}${desc ? `: ${desc}` : ''}`, 'error'),
  }), [triggerToast]);

  const handleInitiateCareTeamReview = useCallback((studentId: string, studentName: string) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setCareTeamReviews((prev) => ({
      ...prev,
      [studentId]: { initiatedAt: timestamp, status: 'Active Care Team Assigned' },
    }));
    toastObj.success(
      'Care Team Assigned',
      `Multi-disciplinary advisory team activated for ${studentName} at ${timestamp}.`
    );
  }, [toastObj]);

  const fetchPipeline = useCallback(async () => {
    setLoading(true);
    try {
      const d = await api.get<{ pipeline: Record<string, any[]> }>('/api/consultant/pipeline');
      setPipeline(d.pipeline || {});
      const allStuds = Object.values(d.pipeline || {}).flat();
      if (allStuds.length > 0) {
        const first = allStuds[0];
        const firstName = first.displayName || first.name || 'Candidate';
        setMatchingStudent(firstName);
        setSelectedDocStudent(firstName);
        setSelectedVisaStudent(firstName);
        setSelectedIntelStudent({
          name: firstName,
          ats: first.ats_score ?? null,
          coding: first.trust_score ?? null,
          comm: first.email ? 'Contact on file' : 'No contact',
          placement: first.ats_score != null ? `${first.ats_score}%` : '—',
          dna: first.career_track ? `🤖 ${first.career_track}` : '—',
          research: '—',
          projects: `${(first.vaultItems || []).length} vault items`,
          ielts: '—',
          gre: '—',
          cgpa: '—',
          scholarship: '—',
          probability: '—',
        });
      } else {
        setMatchingStudent('');
        setSelectedDocStudent('');
        setSelectedVisaStudent('');
        setSelectedIntelStudent(null);
      }
      if (selectedStudent) {
        const updated = allStuds.find((s) => s.id === selectedStudent.id);
        if (updated) setSelectedStudent(updated);
      }
    } catch {
      triggerToast('Failed to load student pipeline', 'error');
    } finally {
      setLoading(false);
    }
  }, [selectedStudent, triggerToast]);

  const fetchAnalytics = useCallback(async () => {
    try {
      const ca = await api.get<Record<string, any>>('/api/consultant/analytics');
      setAnalytics(ca || {});
    } catch {}
  }, []);

  const fetchSessions = useCallback(async () => {
    try {
      const d = await api.get<{ sessions: Session[] }>('/api/consultant/sessions');
      setSessions(d.sessions || []);
    } catch {}
  }, []);

  useEffect(() => {
    fetchPipeline();
    fetchAnalytics();
    fetchSessions();
  }, [fetchPipeline, fetchAnalytics, fetchSessions]);

  async function addStudent(e: React.FormEvent) {
    e.preventDefault();
    if (!studentForm.displayName) return;
    try {
      const body = {
        ...studentForm,
        targetUniversities: studentForm.targetUniversities.split(',').map((s) => s.trim()).filter(Boolean),
      };
      await api.post('/api/consultant/student/add', body);
      triggerToast('Student added successfully!');
      setStudentForm({
        displayName: '',
        email: '',
        phone: '',
        targetCountry: '',
        targetUniversities: '',
        programType: '',
        budget: '',
        intakeYear: '',
        notes: '',
      });
      setActiveTab('pipeline');
      fetchPipeline();
    } catch {
      triggerToast('Failed to add student', 'error');
    }
  }

  async function updateStatus(id: string, status: string) {
    try {
      await api.patch(`/api/consultant/student/${id}`, { status });
      triggerToast(`Stage updated to ${STAGE_LABELS[status]}`);
      fetchPipeline();
    } catch {
      triggerToast('Failed to update stage status', 'error');
    }
  }

  async function handleVerifyDocument(itemId: string, status: 'verified' | 'rejected') {
    if (!selectedStudent) return;
    try {
      await api.post(`/api/consultant/student/${selectedStudent.id}/verify-document`, { itemId, status });
      triggerToast(`Document ${status === 'verified' ? 'verified' : 'rejected'}`);
      fetchPipeline();
    } catch {
      triggerToast('Failed to update document status', 'error');
    }
  }

  async function addTask() {
    if (!newTask.trim() || !selectedStudent) return;
    try {
      await api.post(`/api/consultant/student/${selectedStudent.id}/task`, {
        title: newTask,
        priority: newTaskPriority,
        dueDate: newTaskDueDate || null,
      });
      triggerToast('Task checklist item added');
      setNewTask('');
      setNewTaskDueDate('');
      fetchPipeline();
    } catch {
      triggerToast('Failed to add task', 'error');
    }
  }

  async function scheduleSessions(e: React.FormEvent) {
    e.preventDefault();
    if (!sessionForm.title || !sessionForm.studentId || !sessionForm.date) {
      triggerToast('Please fill out required fields', 'error');
      return;
    }
    setScheduling(true);
    try {
      const allStuds = Object.values(pipeline).flat();
      const s = allStuds.find((st) => st.id === sessionForm.studentId);
      const studentName = s ? s.displayName : 'Student';

      await api.post('/api/consultant/sessions', {
        ...sessionForm,
        studentName,
      });
      triggerToast('1:1 Consultation scheduled!');
      setSessionForm({ title: '', studentId: '', studentName: '', date: '', time: '', link: '', notes: '' });
      fetchSessions();
    } catch {
      triggerToast('Failed to schedule session', 'error');
    } finally {
      setScheduling(false);
    }
  }

  const allStudents = Object.values(pipeline).flat();

  return {
    activeTab,
    setActiveTab,
    copilotInput,
    setCopilotInput,
    copilotMessages,
    setCopilotMessages,
    pipeline,
    analytics,
    selectedStudent,
    setSelectedStudent,
    mentorVerifiedMap,
    setMentorVerifiedMap,
    loading,
    selectedIntelStudent,
    setSelectedIntelStudent,
    selectedGoal,
    setSelectedGoal,
    matchingStudent,
    setMatchingStudent,
    scholarshipSubTab,
    setScholarshipSubTab,
    selectedDocStudent,
    setSelectedDocStudent,
    selectedVisaStudent,
    setSelectedVisaStudent,
    studyAbroadSubTab,
    setStudyAbroadSubTab,
    countryCompA,
    setCountryCompA,
    countryCompB,
    setCountryCompB,
    showCopilotSidebar,
    setShowCopilotSidebar,
    sidebarMessages,
    setSidebarMessages,
    showSopAudit,
    setShowSopAudit,
    showResumeAudit,
    setShowResumeAudit,
    showLorAudit,
    setShowLorAudit,
    documentsSubMode,
    setDocumentsSubMode,
    sopProjects,
    setSopProjects,
    sopResearch,
    setSopResearch,
    sopGoal,
    setSopGoal,
    sopAchievements,
    setSopAchievements,
    generatedSop,
    setGeneratedSop,
    generatingSop,
    setGeneratingSop,
    newTask,
    setNewTask,
    newTaskPriority,
    setNewTaskPriority,
    newTaskDueDate,
    setNewTaskDueDate,
    studentForm,
    setStudentForm,
    sessions,
    sessionForm,
    setSessionForm,
    scheduling,
    toast,
    careTeamReviews,
    triggerToast,
    toastObj,
    handleInitiateCareTeamReview,
    fetchPipeline,
    fetchAnalytics,
    fetchSessions,
    addStudent,
    updateStatus,
    handleVerifyDocument,
    addTask,
    scheduleSessions,
    allStudents,
  };
}
