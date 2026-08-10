'use client';

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
    return [
      {
        id: '1',
        title: 'Data Structures & Algorithms - Module 1 Notes',
        subject: 'Data Structures',
        semester: 'Sem 3',
        type: 'pdf',
        fileUrl: 'data:application/pdf;base64,JVBERi0xLjQKJ...',
        uploadedAt: '2026-08-01',
        size: '2.4 MB',
        downloadsCount: 142,
        tags: ['Trees', 'Graphs', 'Core']
      },
      {
        id: '2',
        title: 'Neural Networks & Deep Learning Slides',
        subject: 'Artificial Intelligence',
        semester: 'Sem 5',
        type: 'pptx',
        fileUrl: 'data:application/vnd.ms-powerpoint;base64,JVBERi0xLjQKJ...',
        uploadedAt: '2026-07-28',
        size: '5.1 MB',
        downloadsCount: 98,
        tags: ['Deep Learning', 'PyTorch']
      }
    ];
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
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
        if (stored) {
          const all: AttendanceRecord[] = JSON.parse(stored);
          const filtered = all.filter(r => r.date === date && r.batch === batch);
          if (filtered.length > 0) return filtered;
        }
      }
    } catch {}

    // Default roster template for requested batch
    return [
      { id: `att_s1_${date}`, date, batch, studentId: 's1', rollNo: 'CS2024-001', studentName: 'Aarav Sharma', status: 'present' },
      { id: `att_s2_${date}`, date, batch, studentId: 's2', rollNo: 'CS2024-002', studentName: 'Ananya Gupta', status: 'present' },
      { id: `att_s3_${date}`, date, batch, studentId: 's3', rollNo: 'CS2024-003', studentName: 'Kabir Verma', status: 'absent' },
      { id: `att_s4_${date}`, date, batch, studentId: 's4', rollNo: 'CS2024-004', studentName: 'Riya Patel', status: 'late' },
      { id: `att_s5_${date}`, date, batch, studentId: 's5', rollNo: 'CS2024-005', studentName: 'Siddharth Rao', status: 'present' }
    ];
  },

  async saveAttendance(records: AttendanceRecord[]): Promise<void> {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
        let all: AttendanceRecord[] = stored ? JSON.parse(stored) : [];
        
        // Remove old entries matching same date & batch
        const date = records[0]?.date;
        const batch = records[0]?.batch;
        if (date && batch) {
          all = all.filter(r => !(r.date === date && r.batch === batch));
        }

        const updated = [...records, ...all];
        localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(updated));
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
    return [
      {
        id: 'f1',
        studentName: 'Vikram Patel',
        examTitle: 'Mid-Term Algorithms',
        tabSwitches: 14,
        ipAddress: '192.168.1.42',
        trustScoreImpact: -25,
        severity: 'high',
        timestamp: '2026-08-02 21:45:10'
      }
    ];
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
