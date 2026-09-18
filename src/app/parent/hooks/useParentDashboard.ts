'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { toast } from '@/lib/store/useAppStore';

export interface Student {
  id: string;
  display_name: string;
  register_number: string;
  ats_score: number;
  trust_score: number;
  mission_streak: number;
  career_readiness: number;
}

export interface StudentOverview {
  profile: Record<string, any>;
  recentExams: Array<{ exam_name: string; pct: string }>;
  missionSummary: any[];
}

export const PARENT_TABS = [
  { id: 'dashboard', label: '📊 Dashboard' },
  { id: 'academic', label: '📈 Academic Progress' },
  { id: 'career', label: '💼 Career Progress' },
  { id: 'attendance', label: '📸 Attendance' },
  { id: 'advisor', label: '🤖 AI Parent Copilot' },
  { id: 'communication', label: '💬 Communication' },
  { id: 'documents', label: '📄 Documents' },
  { id: 'finance', label: '💰 Fee & Finance' },
  { id: 'notifications', label: '🔔 Notifications' },
  { id: 'profile', label: '👤 Child Profile' },
  { id: 'monthly_report', label: '📅 Monthly AI Report' },
];

export function useParentDashboard() {
  const qc = useQueryClient();
  const [registerNumber, setRegisterNumber] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [advisorInput, setAdvisorInput] = useState('');
  const [advisorMessages, setAdvisorMessages] = useState<Array<{ role: 'assistant' | 'user'; text: string }>>([
    {
      role: 'assistant',
      text: "Hello! I am your AI Parent Advisor. Ask about metrics that appear in your child's live overview — I will not invent attendance or grades.",
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'teacher' | 'parent'; text: string }>>([]);
  const [acknowledgedAlerts, setAcknowledgedAlerts] = useState<Record<string, string>>({});

  const { data: students, isLoading } = useQuery({
    queryKey: ['parent', 'students'],
    queryFn: () => api.get<{ students: Student[] }>('/api/parent/students').then(r => r.students),
  });

  const { data: overview } = useQuery({
    queryKey: ['parent', 'overview', selectedStudent],
    queryFn: () => api.get<StudentOverview>(`/api/parent/student/${selectedStudent}/overview`),
    enabled: !!selectedStudent,
  });

  // Auto-select first student if none selected
  useEffect(() => {
    if (students && students.length > 0 && !selectedStudent) {
      setSelectedStudent(students[0].id);
    }
  }, [students, selectedStudent]);

  const handleAcknowledgeAlert = (alertTitle: string) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setAcknowledgedAlerts(prev => ({ ...prev, [alertTitle]: timestamp }));
    toast.success('Alert Acknowledged', `You have formally acknowledged "${alertTitle}" at ${timestamp}.`);
  };

  const linkMutation = useMutation({
    mutationFn: (rn: string) => api.post('/api/parent/link-student', { registerNumber: rn }),
    onSuccess: () => {
      toast.success('Request Sent', 'Student will be notified to approve your request');
      setRegisterNumber('');
      qc.invalidateQueries({ queryKey: ['parent'] });
    },
    onError: (e: any) => toast.error('Failed', e.message),
  });

  const handleLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (registerNumber) linkMutation.mutate(registerNumber);
  };

  return {
    registerNumber,
    setRegisterNumber,
    selectedStudent,
    setSelectedStudent,
    activeTab,
    setActiveTab,
    advisorInput,
    setAdvisorInput,
    advisorMessages,
    setAdvisorMessages,
    chatInput,
    setChatInput,
    chatMessages,
    setChatMessages,
    acknowledgedAlerts,
    handleAcknowledgeAlert,
    students,
    isLoading,
    overview,
    linkMutation,
    handleLinkSubmit,
    tabs: PARENT_TABS,
  };
}
