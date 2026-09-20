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

export class CohortsApiService {
  private static localKey = 'pinit_cohort_analytics_store';

  static mapEnrolledToCohort(enrolled: any[]): StudentCohortRecord[] {
    return enrolled.map((s, idx) => {
      const ats = typeof s.atsScore === 'number' ? s.atsScore : (typeof s.ats_score === 'number' ? s.ats_score : 0);
      let readinessStatus: RoleReadinessStage = 'developing';
      if (ats >= 80) readinessStatus = 'placement_ready';
      else if (ats >= 65) readinessStatus = 'ready_for_interview';
      else if (ats >= 45) readinessStatus = 'ready_for_internship';
      else if (ats >= 20) readinessStatus = 'exploring';

      return {
        studentId: s.id || s.rollNo || `stud_${idx + 1}`,
        name: s.name || s.displayName || s.username || 'Student',
        department: s.department || 'Computer Science & Engineering',
        batchYear: 2026,
        programId: s.courseTrack || 'Standard Engineering',
        verifiedCount: s.completedQuestsCount || 0,
        readinessStatus,
        defenseScore: ats,
        lastActiveDaysAgo: 0,
        remediationFlag: ats > 0 && ats < 45,
      };
    });
  }

  static getStudents(rawStudents?: any[]): StudentCohortRecord[] {
    if (Array.isArray(rawStudents) && rawStudents.length > 0) {
      return this.mapEnrolledToCohort(rawStudents);
    }
    if (typeof window === 'undefined') return [];

    try {
      const customStore = localStorage.getItem(this.localKey);
      if (customStore) {
        const parsed = JSON.parse(customStore);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }

      const enrolledStore = localStorage.getItem('campus_enrolled_students');
      if (enrolledStore) {
        const parsed = JSON.parse(enrolledStore);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return this.mapEnrolledToCohort(parsed);
        }
      }
    } catch {}

    return [];
  }

  static getCollegeOverview(
    collegeName = 'PinIT Career OS / Campus Academy',
    rawStudents?: any[]
  ): CollegeOverviewStats {
    const students = this.getStudents(rawStudents);
    const deptMap = new Map<string, StudentCohortRecord[]>();

    students.forEach(s => {
      const list = deptMap.get(s.department) || [];
      list.push(s);
      deptMap.set(s.department, list);
    });

    const departments: DepartmentCohortStats[] = [];

    deptMap.forEach((deptStudents, deptName) => {
      const total = deptStudents.length;
      const interviewReady = deptStudents.filter(
        s => s.readinessStatus === 'ready_for_interview' || s.readinessStatus === 'placement_ready'
      ).length;
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
    const totalReady = students.filter(
      s => s.readinessStatus === 'ready_for_interview' || s.readinessStatus === 'placement_ready'
    ).length;
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
