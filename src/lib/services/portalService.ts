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
  }
};
