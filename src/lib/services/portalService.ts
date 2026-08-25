'use client';

import { supabase } from '@/lib/supabaseClient';

export interface CourseMaterialRecord {
  id: string;
  title: string;
  subject: string;
  semester: string;
  type: 'pdf' | 'pptx' | 'docx' | 'link';
  fileUrl: string;
  uploadedAt: string;
  size: string;
  downloadsCount: number;
  tags: string[];
}

export interface AttendanceRecord {
  id: string;
  date: string;
  batch: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  status: 'present' | 'absent' | 'late';
}

export interface FraudAlertRecord {
  id: string;
  studentName: string;
  examTitle: string;
  tabSwitches: number;
  ipAddress: string;
  trustScoreImpact: number;
  severity: 'high' | 'medium' | 'low';
  timestamp: string;
}

export interface StudentExamResultRecord {
  examId: string;
  studentId: string;
  score: number;
  totalMarks: number;
  gradedAt: string;
}

const STORAGE_KEYS = {
  MATERIALS: 'campus_portal_materials',
  ATTENDANCE: 'campus_portal_attendance',
  FRAUD_ALERTS: 'campus_portal_fraud_alerts',
  EXAM_RESULTS: 'campus_portal_exam_results'
};

export const portalService = {
  // ── Materials ──
  async getMaterials(): Promise<CourseMaterialRecord[]> {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(STORAGE_KEYS.MATERIALS);
        if (stored) return JSON.parse(stored);
      }
    } catch {}
    return [];
  },

  async saveMaterial(mat: CourseMaterialRecord): Promise<void> {
    try {
      const existing = await this.getMaterials();
      const updated = [mat, ...existing];
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.MATERIALS, JSON.stringify(updated));
      }
    } catch (e) {
      console.error('Failed to save material', e);
    }
  },

  async deleteMaterial(id: string): Promise<void> {
    try {
      if (typeof window !== 'undefined') {
        const existing = await this.getMaterials();
        const updated = existing.filter(m => m.id !== id);
        localStorage.setItem(STORAGE_KEYS.MATERIALS, JSON.stringify(updated));
      }
    } catch (e) {
      console.error('Failed to delete material', e);
    }
  },

  // ── Attendance ──
  async getAttendanceByDateAndBatch(date: string, batch: string): Promise<AttendanceRecord[]> {
    try {
      const { data, error } = await supabase.from('campus_attendance').select('*').eq('date', date).eq('batch', batch);
      if (!error && data) {
        return data.map((r: any) => ({
          id: r.id,
          date: r.date,
          batch: r.batch,
          studentId: r.student_id,
          studentName: r.student_name,
          rollNo: r.roll_no,
          status: r.status,
        }));
      }
    } catch {}
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
        if (stored) {
          const all: AttendanceRecord[] = JSON.parse(stored);
          return all.filter(r => r.date === date && r.batch === batch);
        }
      }
    } catch {}
    return [];
  },

  async saveAttendance(records: AttendanceRecord[]): Promise<void> {
    try {
      if (records.length) {
        await supabase.from('campus_attendance').upsert(records.map(r => ({
          id: r.id,
          date: r.date,
          batch: r.batch,
          student_id: r.studentId,
          student_name: r.studentName,
          roll_no: r.rollNo,
          status: r.status,
        })));
      }
    } catch {}
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
        let all: AttendanceRecord[] = stored ? JSON.parse(stored) : [];
        const date = records[0]?.date;
        const batch = records[0]?.batch;
        if (date && batch) {
          all = all.filter(r => !(r.date === date && r.batch === batch));
        }
        localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify([...records, ...all]));
      }
    } catch (e) {
      console.error('Failed to save attendance', e);
    }
  },

  // ── Fraud Event Bridge ──
  async getFraudAlerts(): Promise<FraudAlertRecord[]> {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(STORAGE_KEYS.FRAUD_ALERTS);
        if (stored) return JSON.parse(stored);
      }
    } catch {}
    return [];
  },

  async dispatchFraudAlert(alertData: Omit<FraudAlertRecord, 'id' | 'timestamp'>): Promise<void> {
    try {
      const existing = await this.getFraudAlerts();
      const newAlert: FraudAlertRecord = {
        ...alertData,
        id: `fraud_${Date.now()}`,
        timestamp: new Date().toLocaleString()
      };
      const updated = [newAlert, ...existing];
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.FRAUD_ALERTS, JSON.stringify(updated));
      }
    } catch (e) {
      console.error('Failed to dispatch fraud alert', e);
    }
  },

  // ── Student-Teacher Grade Sync ──
  async updateExamScore(result: StudentExamResultRecord): Promise<void> {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(STORAGE_KEYS.EXAM_RESULTS);
        let all: StudentExamResultRecord[] = stored ? JSON.parse(stored) : [];
        all = all.filter(r => !(r.examId === result.examId && r.studentId === result.studentId));
        all.unshift(result);
        localStorage.setItem(STORAGE_KEYS.EXAM_RESULTS, JSON.stringify(all));
      }
    } catch (e) {
      console.error('Failed to save exam score', e);
    }
  },

  async getStudentExamResults(studentId: string): Promise<StudentExamResultRecord[]> {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(STORAGE_KEYS.EXAM_RESULTS);
        if (stored) {
          const all: StudentExamResultRecord[] = JSON.parse(stored);
          return all.filter(r => r.studentId === studentId);
        }
      }
    } catch {}
    return [];
  },

  // ── Dynamic Student Roster & Faculty Analytics Engine ──
  async getEnrolledStudents(): Promise<Array<{
    id: string;
    name: string;
    email: string;
    rollNo: string;
    batch: string;
    department: string;
    courseTrack: string;
    completedQuestsCount: number;
    xp: number;
    pins: number;
    atsScore: number;
    attendancePct: number;
    status: 'active' | 'probation' | 'placed';
  }>> {
    const defaultStudents = [
      { id: 'std_vinay', name: 'Vinay Kumar', email: 'vinayrocker2002@gmail.com', rollNo: 'CS-2024-001', batch: 'Batch 2024-A', department: 'Computer Science', courseTrack: 'Full Stack Python & AI', completedQuestsCount: 8, xp: 1450, pins: 60, atsScore: 88, attendancePct: 94, status: 'active' as const },
      { id: 'std_ashwanth', name: 'Ashwanth Kumar', email: 'student@pinit.in', rollNo: 'CS-2024-002', batch: 'Batch 2024-A', department: 'Computer Science', courseTrack: 'Full Stack Engineering', completedQuestsCount: 12, xp: 2100, pins: 95, atsScore: 92, attendancePct: 96, status: 'active' as const },
      { id: 'std_priya_s', name: 'Priya Sharma', email: 'priya.s@campus.edu', rollNo: 'CS-2024-003', batch: 'Batch 2024-A', department: 'Information Tech', courseTrack: 'AI & Data Engineering', completedQuestsCount: 6, xp: 980, pins: 40, atsScore: 84, attendancePct: 89, status: 'active' as const },
      { id: 'std_rohan_v', name: 'Rohan Verma', email: 'rohan.v@campus.edu', rollNo: 'CS-2024-014', batch: 'Batch 2024-A', department: 'Computer Science', courseTrack: 'Cloud & DevOps Systems', completedQuestsCount: 4, xp: 620, pins: 25, atsScore: 78, attendancePct: 82, status: 'active' as const },
      { id: 'std_ananya_m', name: 'Ananya Mishra', email: 'ananya.m@campus.edu', rollNo: 'CS-2024-019', batch: 'Batch 2024-B', department: 'Computer Science', courseTrack: 'Frontend Engineering & UI/UX', completedQuestsCount: 14, xp: 2450, pins: 110, atsScore: 95, attendancePct: 98, status: 'placed' as const }
    ];

    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('campus_enrolled_students');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
        localStorage.setItem('campus_enrolled_students', JSON.stringify(defaultStudents));
      }
    } catch {}
    return defaultStudents;
  },

  // ── Dynamic Recruiter Talent Pipeline ──
  async getRecruiterCandidates(): Promise<Array<{
    id: string;
    name: string;
    email: string;
    roleTarget: string;
    atsScore: number;
    codeWarsElo: number;
    verifiedSkills: string[];
    stage: 'discovered' | 'shortlisted' | 'interview_scheduled' | 'offered';
    appliedDate: string;
    avatarUrl?: string;
  }>> {
    const defaultCandidates = [
      { id: 'cand_1', name: 'Vinay Kumar', email: 'vinayrocker2002@gmail.com', roleTarget: 'Frontend Engineer', atsScore: 92, codeWarsElo: 1420, verifiedSkills: ['React 18', 'TypeScript', 'Next.js', 'Tailwind', 'WebSockets'], stage: 'shortlisted' as const, appliedDate: '2026-08-20' },
      { id: 'cand_2', name: 'Ashwanth Kumar', email: 'student@pinit.in', roleTarget: 'Full Stack Engineer', atsScore: 94, codeWarsElo: 1580, verifiedSkills: ['Python FastAPI', 'PostgreSQL', 'Docker', 'React', 'Redis'], stage: 'interview_scheduled' as const, appliedDate: '2026-08-18' },
      { id: 'cand_3', name: 'Ananya Mishra', email: 'ananya.m@campus.edu', roleTarget: 'UI/UX & Frontend Lead', atsScore: 96, codeWarsElo: 1640, verifiedSkills: ['Next.js 14', 'Figma Tokens', 'State Machines', 'CSS Architecture'], stage: 'offered' as const, appliedDate: '2026-08-15' },
      { id: 'cand_4', name: 'Priya Sharma', email: 'priya.s@campus.edu', roleTarget: 'AI & Data Engineer', atsScore: 88, codeWarsElo: 1390, verifiedSkills: ['PyTorch', 'LangChain', 'Vector DBs', 'Python'], stage: 'discovered' as const, appliedDate: '2026-08-22' }
    ];

    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('campus_recruiter_candidates');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
        localStorage.setItem('campus_recruiter_candidates', JSON.stringify(defaultCandidates));
      }
    } catch {}
    return defaultCandidates;
  },

  async updateCandidateStage(candidateId: string, newStage: 'discovered' | 'shortlisted' | 'interview_scheduled' | 'offered'): Promise<void> {
    try {
      const candidates = await this.getRecruiterCandidates();
      const updated = candidates.map(c => c.id === candidateId ? { ...c, stage: newStage } : c);
      if (typeof window !== 'undefined') {
        localStorage.setItem('campus_recruiter_candidates', JSON.stringify(updated));
      }
    } catch (e) {
      console.error('Failed to update candidate stage', e);
    }
  },

  // ── Dynamic Student Services & Helpdesk Tickets ──
  async getServiceTickets(): Promise<Array<{
    id: string;
    studentName: string;
    rollNo: string;
    category: string;
    subject: string;
    details: string;
    submittedAt: string;
    status: 'pending' | 'in_review' | 'resolved';
  }>> {
    const defaultTickets = [
      { id: 'TKT-1042', studentName: 'Vinay Kumar', rollNo: 'CS-2024-001', category: 'Leave Approval', subject: 'Medical leave certificate submission', details: 'Hospital prescription attached for 3 days absence due to flu', submittedAt: '2026-08-22', status: 'pending' as const },
      { id: 'TKT-1039', studentName: 'Ashwanth Kumar', rollNo: 'CS-2024-002', category: 'Bonafide Certificate', subject: 'Passport and internship verification bonafide', details: 'Required for corporate off-campus internship onboarding', submittedAt: '2026-08-21', status: 'resolved' as const },
      { id: 'TKT-1035', studentName: 'Rohan Verma', rollNo: 'CS-2024-014', category: 'Hostel Re-allocation', subject: 'Room change request to North Wing', details: 'Closer proximity to computer vision laboratory', submittedAt: '2026-08-19', status: 'in_review' as const }
    ];

    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('campus_service_tickets');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
        localStorage.setItem('campus_service_tickets', JSON.stringify(defaultTickets));
      }
    } catch {}
    return defaultTickets;
  },

  async updateTicketStatus(ticketId: string, status: 'pending' | 'in_review' | 'resolved'): Promise<void> {
    try {
      const tickets = await this.getServiceTickets();
      const updated = tickets.map(t => t.id === ticketId ? { ...t, status } : t);
      if (typeof window !== 'undefined') {
        localStorage.setItem('campus_service_tickets', JSON.stringify(updated));
      }
    } catch (e) {
      console.error('Failed to update ticket status', e);
    }
  }
};
