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
      const { data, error } = await supabase
        .from('campus_course_materials')
        .select('*')
        .order('uploaded_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return data.map((r: any) => ({
          id: r.id,
          title: r.title,
          subject: r.subject,
          semester: r.semester,
          type: r.type,
          fileUrl: r.file_url || '',
          uploadedAt: r.uploaded_at,
          size: r.size || '1.0 MB',
          downloadsCount: r.downloads_count || 0,
          tags: r.tags || []
        }));
      }
    } catch {}

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
      const { error } = await supabase.from('campus_course_materials').upsert({
        id: mat.id,
        title: mat.title,
        subject: mat.subject,
        semester: mat.semester,
        type: mat.type,
        file_url: mat.fileUrl,
        uploaded_at: mat.uploadedAt,
        size: mat.size,
        downloads_count: mat.downloadsCount,
        tags: mat.tags
      });
      if (error) console.warn('Supabase course material write error:', error.message);
    } catch (e) {
      console.error('Failed to save material to Supabase', e);
    }

    try {
      const existing = await this.getMaterials();
      const updated = [mat, ...existing.filter(m => m.id !== mat.id)];
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.MATERIALS, JSON.stringify(updated));
      }
    } catch (e) {
      console.error('Failed to save material locally', e);
    }
  },

  async deleteMaterial(id: string): Promise<void> {
    try {
      const { error } = await supabase.from('campus_course_materials').delete().eq('id', id);
      if (error) console.warn('Supabase delete material error:', error.message);
    } catch (e) {
      console.error('Failed to delete material from Supabase', e);
    }

    try {
      if (typeof window !== 'undefined') {
        const existing = await this.getMaterials();
        const updated = existing.filter(m => m.id !== id);
        localStorage.setItem(STORAGE_KEYS.MATERIALS, JSON.stringify(updated));
      }
    } catch (e) {
      console.error('Failed to delete material locally', e);
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
        const res = await supabase.from('campus_attendance').upsert(records.map(r => ({
          id: r.id,
          date: r.date,
          batch: r.batch,
          student_id: r.studentId,
          student_name: r.studentName,
          roll_no: r.rollNo,
          status: r.status,
        })));
        if (res.error) throw new Error(res.error.message);
      }
    } catch (err) {
      console.warn('Supabase attendance write failed, falling back to local storage:', err);
    }
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
      const { data, error } = await supabase.from('campus_fraud_alerts').select('*').order('timestamp', { ascending: false });
      if (!error && data && data.length > 0) {
        return data.map((r: any) => ({
          id: r.id,
          studentName: r.student_name,
          examTitle: r.exam_title,
          tabSwitches: r.tab_switches,
          ipAddress: r.ip_address,
          trustScoreImpact: r.trust_score_impact,
          severity: r.severity,
          timestamp: r.timestamp
        }));
      }
    } catch {}

    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(STORAGE_KEYS.FRAUD_ALERTS);
        if (stored) return JSON.parse(stored);
      }
    } catch {}
    return [];
  },

  async dispatchFraudAlert(alertData: Omit<FraudAlertRecord, 'id' | 'timestamp'>): Promise<void> {
    const id = `fraud_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const timestamp = new Date().toISOString();
    try {
      const { error } = await supabase.from('campus_fraud_alerts').insert({
        id,
        student_name: alertData.studentName,
        exam_title: alertData.examTitle,
        tab_switches: alertData.tabSwitches,
        ip_address: alertData.ipAddress,
        trust_score_impact: alertData.trustScoreImpact,
        severity: alertData.severity,
        timestamp
      });
      if (error) console.warn('Supabase fraud alert insert error:', error.message);
    } catch (e) {
      console.error('Failed to dispatch fraud alert to Supabase', e);
    }

    try {
      const existing = await this.getFraudAlerts();
      const newAlert: FraudAlertRecord = {
        ...alertData,
        id,
        timestamp
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
      const { error } = await supabase.from('campus_exam_results').upsert({
        exam_id: result.examId,
        student_id: result.studentId,
        score: result.score,
        total_marks: result.totalMarks,
        graded_at: result.gradedAt || new Date().toISOString()
      }, { onConflict: 'exam_id,student_id' });
      if (error) console.warn('Supabase exam score write error:', error.message);
    } catch (e) {
      console.error('Failed to save exam score to Supabase', e);
    }

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
      const { data, error } = await supabase
        .from('campus_exam_results')
        .select('*')
        .eq('student_id', studentId)
        .order('graded_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return data.map((r: any) => ({
          examId: r.exam_id,
          studentId: r.student_id,
          score: Number(r.score),
          totalMarks: Number(r.total_marks),
          gradedAt: r.graded_at
        }));
      }
    } catch {}

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
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, full_name, email, roll_no, batch, department, course_track, completed_quests_count, xp, pins, ats_score, attendance_pct, status')
        .eq('role', 'student');
      if (!error && data && data.length > 0) {
        return data.map((u: any) => ({
          id: u.id,
          name: u.full_name || 'Student',
          email: u.email || '',
          rollNo: u.roll_no || `STD-${u.id.substring(0, 6).toUpperCase()}`,
          batch: u.batch || 'Batch 2024-A',
          department: u.department || 'Computer Science',
          courseTrack: u.course_track || 'Full Stack Engineering',
          completedQuestsCount: u.completed_quests_count || 0,
          xp: u.xp || 0,
          pins: u.pins || 0,
          atsScore: u.ats_score || 0,
          attendancePct: u.attendance_pct || 100,
          status: (u.status as any) || 'active'
        }));
      }
    } catch {}

    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('campus_enrolled_students');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      }
    } catch {}
    return [];
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
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, full_name, email, role_target, ats_score, codewars_elo, skills, recruiter_stage, created_at, avatar_url')
        .gt('recruiter_visibility', 0);
      if (!error && data && data.length > 0) {
        return data.map((u: any) => ({
          id: u.id,
          name: u.full_name || 'Candidate',
          email: u.email || '',
          roleTarget: u.role_target || 'Software Engineer',
          atsScore: u.ats_score || 0,
          codeWarsElo: u.codewars_elo || 1200,
          verifiedSkills: Array.isArray(u.skills) ? u.skills : [],
          stage: (u.recruiter_stage as any) || 'discovered',
          appliedDate: u.created_at ? u.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
          avatarUrl: u.avatar_url
        }));
      }
    } catch {}

    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('campus_recruiter_candidates');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      }
    } catch {}
    return [];
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
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('campus_service_tickets');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      }
    } catch {}
    return [];
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
