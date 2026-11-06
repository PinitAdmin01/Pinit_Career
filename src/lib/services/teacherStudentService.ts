import { supabase } from '@/lib/supabaseClient';
import { tableExists } from '@/lib/services/supabaseTable';
import { portalService } from '@/lib/services/portalService';

export interface StudentInstitutionalProfile {
  studentId: string;
  studentName: string;
  email: string;
  collegeName: string;
  university: string;
  rollNumber: string;
  department: string;
  batch: string;
  semester: number;
  gpa: number;
  phone: string;
  guardianPhone: string;
  verificationStatus: 'verified' | 'pending' | 'flagged';
  verifiedBy: string;
  notes: string;
  updatedAt: string;
}

const STORAGE_KEY = 'pinit_teacher_students_profiles';

const DEFAULT_PROFILES: StudentInstitutionalProfile[] = [
  {
    studentId: 'usr_demo_student_01',
    studentName: 'Alex Chen',
    email: 'alex.chen@student.pinit.edu',
    collegeName: 'National Institute of Technology',
    university: 'State Technical University',
    rollNumber: '21CS042',
    department: 'Computer Science & Engineering',
    batch: '2022-2026',
    semester: 6,
    gpa: 8.85,
    phone: '+91 98765 43210',
    guardianPhone: '+91 98765 43211',
    verificationStatus: 'verified',
    verifiedBy: 'Dr. Kashyap',
    notes: 'Top student in distributed systems lab. Ready for Tier-1 placements.',
    updatedAt: new Date().toISOString()
  },
  {
    studentId: 'usr_demo_student_02',
    studentName: 'Rohan Sharma',
    email: 'rohan.sharma@campus.pinit.edu',
    collegeName: 'College of Engineering & Technology',
    university: 'Apex Central University',
    rollNumber: '22EC018',
    department: 'Electronics & Communication',
    batch: '2022-2026',
    semester: 6,
    gpa: 8.20,
    phone: '+91 98765 43220',
    guardianPhone: '+91 98765 43221',
    verificationStatus: 'verified',
    verifiedBy: 'Dr. Priya',
    notes: 'Excellent peer mentor. Working on embedded IoT telemetry capstone.',
    updatedAt: new Date().toISOString()
  },
  {
    studentId: 'usr_demo_student_03',
    studentName: 'Aanya Verma',
    email: 'aanya.verma@tech.pinit.edu',
    collegeName: 'Institute of Information Technology',
    university: 'Autonomous Tech Consortium',
    rollNumber: '21AI009',
    department: 'Artificial Intelligence & Data',
    batch: '2022-2026',
    semester: 6,
    gpa: 9.15,
    phone: '+91 98765 43230',
    guardianPhone: '+91 98765 43231',
    verificationStatus: 'verified',
    verifiedBy: 'Dr. Kashyap',
    notes: 'Published NLP benchmark paper in IEEE student conference.',
    updatedAt: new Date().toISOString()
  }
];

let memoryProfiles: StudentInstitutionalProfile[] | null = null;

function getStoredProfiles(): StudentInstitutionalProfile[] {
  if (typeof window === 'undefined') return memoryProfiles || DEFAULT_PROFILES;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : (memoryProfiles || DEFAULT_PROFILES);
  } catch {
    return memoryProfiles || DEFAULT_PROFILES;
  }
}

function setStoredProfiles(profiles: StudentInstitutionalProfile[]): void {
  memoryProfiles = profiles;
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
  } catch {}
}

export const teacherStudentService = {
  async getStudents(): Promise<StudentInstitutionalProfile[]> {
    try {
      const hasTable = await tableExists('student_institutional_profiles');
      if (hasTable) {
        const { data, error } = await supabase.from('student_institutional_profiles').select('*').order('student_name');
        if (!error && Array.isArray(data) && data.length > 0) {
          return data.map((d: any) => ({
            studentId: d.student_id,
            studentName: d.student_name,
            email: d.email,
            collegeName: d.college_name,
            university: d.university,
            rollNumber: d.roll_number,
            department: d.department,
            batch: d.batch,
            semester: Number(d.semester) || 1,
            gpa: Number(d.gpa) || 8.0,
            phone: d.phone || '',
            guardianPhone: d.guardian_phone || '',
            verificationStatus: d.verification_status || 'verified',
            verifiedBy: d.verified_by || '',
            notes: d.notes || '',
            updatedAt: d.updated_at || new Date().toISOString()
          }));
        }
      }
    } catch {}

    const stored = getStoredProfiles();

    // Enrich with enrolled students if any new students registered
    try {
      const enrolled = await portalService.getEnrolledStudents().catch(() => []);
      if (enrolled.length > 0) {
        const existingIds = new Set(stored.map(s => s.studentId));
        let added = false;
        enrolled.forEach(e => {
          if (!existingIds.has(e.id)) {
            stored.push({
              studentId: e.id,
              studentName: e.name,
              email: e.email,
              collegeName: 'National Institute of Technology',
              university: 'State Technical University',
              rollNumber: e.rollNo || e.id.slice(-6).toUpperCase(),
              department: e.department || 'Engineering',
              batch: e.batch || '2022-2026',
              semester: 6,
              gpa: 8.5,
              phone: '',
              guardianPhone: '',
              verificationStatus: 'verified',
              verifiedBy: 'Faculty Review',
              notes: 'Enrolled in ' + (e.courseTrack || 'Engineering Core'),
              updatedAt: new Date().toISOString()
            });
            added = true;
          }
        });
        if (added) {
          setStoredProfiles(stored);
        }
      }
    } catch {}

    return stored;
  },

  async getStudentById(id: string): Promise<StudentInstitutionalProfile | null> {
    const list = await this.getStudents();
    return list.find(s => s.studentId === id) || null;
  },

  async saveStudentDetails(profile: StudentInstitutionalProfile): Promise<StudentInstitutionalProfile> {
    const list = await this.getStudents();
    const updatedRecord: StudentInstitutionalProfile = {
      ...profile,
      updatedAt: new Date().toISOString()
    };

    const idx = list.findIndex(s => s.studentId === profile.studentId);
    const nextList = idx >= 0 ? list.map(s => (s.studentId === profile.studentId ? updatedRecord : s)) : [updatedRecord, ...list];
    setStoredProfiles(nextList);

    try {
      const hasTable = await tableExists('student_institutional_profiles');
      if (hasTable) {
        const { error: upsertErr } = await supabase.from('student_institutional_profiles').upsert({
          student_id: updatedRecord.studentId,
          student_name: updatedRecord.studentName,
          email: updatedRecord.email,
          college_name: updatedRecord.collegeName,
          university: updatedRecord.university,
          roll_number: updatedRecord.rollNumber,
          department: updatedRecord.department,
          batch: updatedRecord.batch,
          semester: updatedRecord.semester,
          gpa: updatedRecord.gpa,
          phone: updatedRecord.phone,
          guardian_phone: updatedRecord.guardianPhone,
          verification_status: updatedRecord.verificationStatus,
          verified_by: updatedRecord.verifiedBy,
          notes: updatedRecord.notes,
          updated_at: updatedRecord.updatedAt
        });
      }
    } catch {}

    return updatedRecord;
  },

  async searchStudents(query: string): Promise<StudentInstitutionalProfile[]> {
    const list = await this.getStudents();
    const q = (query || '').toLowerCase().trim();
    if (!q) return list;
    return list.filter(s =>
      s.studentName.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.rollNumber.toLowerCase().includes(q) ||
      s.collegeName.toLowerCase().includes(q) ||
      s.department.toLowerCase().includes(q)
    );
  }
};
