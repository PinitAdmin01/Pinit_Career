/**
 * PinIT Institutional Cohort & College Analytics API Service
 * Manages multi-tenant college cohort telemetry, readiness distribution,
 * and departmental placement metrics.
 */

import { RoleReadinessStage } from '../pathway/competencySchema';

export interface StudentCohortRecord {
  studentId: string;
  name: string;
  department: string;
  batchYear: number;
  programId: string;
  verifiedCount: number;
  readinessStatus: RoleReadinessStage;
  defenseScore: number;
  lastActiveDaysAgo: number;
  remediationFlag?: boolean;
}

export interface DepartmentCohortStats {
  department: string;
  totalStudents: number;
  interviewReadyCount: number;
  internshipReadyCount: number;
  inProgressCount: number;
  remediationCount: number;
  avgDefenseScore: number;
  placementReadyPct: number;
}

export interface CollegeOverviewStats {
  collegeName: string;
  totalStudents: number;
  overallPlacementReadyPct: number;
  totalVerifiedCredentials: number;
  avgOralDefenseScore: number;
  departments: DepartmentCohortStats[];
  students: StudentCohortRecord[];
}

export const INITIAL_COHORT_STUDENTS: StudentCohortRecord[] = [
  {
    studentId: 'stud_cs_01',
    name: 'Aarav Patel',
    department: 'Computer Science & Engineering',
    batchYear: 2026,
    programId: 'prog_swe_accelerated_9m',
    verifiedCount: 8,
    readinessStatus: 'ready_for_interview',
    defenseScore: 92,
    lastActiveDaysAgo: 0,
  },
  {
    studentId: 'stud_cs_02',
    name: 'Devin Vance',
    department: 'Computer Science & Engineering',
    batchYear: 2026,
    programId: 'prog_swe_accelerated_9m',
    verifiedCount: 8,
    readinessStatus: 'ready_for_interview',
    defenseScore: 90,
    lastActiveDaysAgo: 1,
  },
  {
    studentId: 'stud_ds_01',
    name: 'Priya Sharma',
    department: 'Data Science & AI',
    batchYear: 2026,
    programId: 'prog_data_analytics',
    verifiedCount: 7,
    readinessStatus: 'ready_for_internship',
    defenseScore: 88,
    lastActiveDaysAgo: 0,
  },
  {
    studentId: 'stud_it_01',
    name: 'Marcus Brody',
    department: 'Information Technology',
    batchYear: 2026,
    programId: 'prog_swe_standard_12m',
    verifiedCount: 6,
    readinessStatus: 'ready_for_internship',
    defenseScore: 82,
    lastActiveDaysAgo: 2,
  },
  {
    studentId: 'stud_it_02',
    name: 'Maya Lin',
    department: 'Information Technology',
    batchYear: 2027,
    programId: 'prog_software_engineering',
    verifiedCount: 3,
    readinessStatus: 'developing',
    defenseScore: 0,
    lastActiveDaysAgo: 4,
    remediationFlag: true,
  },
];

export class CohortsApiService {
  private static localKey = 'pinit_cohort_analytics_store';
  private static inMemoryStudents: StudentCohortRecord[] = [...INITIAL_COHORT_STUDENTS];

  static getStudents(): StudentCohortRecord[] {
    if (typeof window === 'undefined') return this.inMemoryStudents;
    try {
      const raw = localStorage.getItem(this.localKey);
      return raw ? JSON.parse(raw) : this.inMemoryStudents;
    } catch {
      return this.inMemoryStudents;
    }
  }

  static getCollegeOverview(collegeName = 'MIT / PinIT Academy'): CollegeOverviewStats {
    const students = this.getStudents();
    const deptMap = new Map<string, StudentCohortRecord[]>();

    students.forEach(s => {
      const list = deptMap.get(s.department) || [];
      list.push(s);
      deptMap.set(s.department, list);
    });

    const departments: DepartmentCohortStats[] = [];

    deptMap.forEach((deptStudents, deptName) => {
      const total = deptStudents.length;
      const interviewReady = deptStudents.filter(s => s.readinessStatus === 'ready_for_interview' || s.readinessStatus === 'placement_ready').length;
      const internshipReady = deptStudents.filter(s => s.readinessStatus === 'ready_for_internship').length;
      const inProgress = deptStudents.filter(s => s.readinessStatus === 'developing' || s.readinessStatus === 'exploring').length;
      const remediation = deptStudents.filter(s => !!s.remediationFlag).length;

      const scored = deptStudents.filter(s => s.defenseScore > 0);
      const avgScore = scored.length > 0
        ? Math.round(scored.reduce((acc, s) => acc + s.defenseScore, 0) / scored.length)
        : 0;

      const placementReadyPct = total > 0 ? Math.round((interviewReady / total) * 100) : 0;

      departments.push({
        department: deptName,
        totalStudents: total,
        interviewReadyCount: interviewReady,
        internshipReadyCount: internshipReady,
        inProgressCount: inProgress,
        remediationCount: remediation,
        avgDefenseScore: avgScore,
        placementReadyPct,
      });
    });

    const totalStudents = students.length;
    const totalReady = students.filter(s => s.readinessStatus === 'ready_for_interview' || s.readinessStatus === 'placement_ready').length;
    const overallPlacementReadyPct = totalStudents > 0 ? Math.round((totalReady / totalStudents) * 100) : 0;
    const totalVerified = students.reduce((acc, s) => acc + s.verifiedCount, 0);

    const scoredAll = students.filter(s => s.defenseScore > 0);
    const avgOral = scoredAll.length > 0
      ? Math.round(scoredAll.reduce((acc, s) => acc + s.defenseScore, 0) / scoredAll.length)
      : 0;

    return {
      collegeName,
      totalStudents,
      overallPlacementReadyPct,
      totalVerifiedCredentials: totalVerified,
      avgOralDefenseScore: avgOral,
      departments,
      students,
    };
  }
}
