// src/lib/university/analytics.ts
/**
 * Institutional analytics for the university dashboard, computed from the
 * database.
 *
 * This replaces handlers that returned invented figures — 480 students scaled
 * by a hardcoded `multiplier` per department, three fictional top students with
 * fabricated register numbers ("Ananya Rao", "1RV22CS045"), and a fixed skill
 * gap list. A placement officer reading that screen would have been making
 * decisions on numbers nobody measured.
 *
 * Where the data model genuinely cannot answer a question, these functions
 * return an empty result and say so via `dataAvailable`, rather than filling
 * the gap with something plausible.
 *
 * Department and college grouping comes from college_cohorts joined through
 * student_cohort_enrollments; the users table itself has no department column.
 */
import { supabase } from '@/lib/supabaseClient';
import { tableExists } from '@/lib/services/supabaseTable';

export interface UniversityFilters {
  college?: string;
  department?: string;
  batchYear?: number;
}

export interface PlacementStats {
  total_students: number;
  placement_ready: number;
  ats_qualified: number;
  avg_ats: number;
  avg_trust: number;
  avg_dna: number;
  engaged_students: number;
}

export interface TopStudent {
  id: string;
  display_name: string;
  register_number?: string;
  ats_score: number;
  trust_score: number;
  career_dna_score: number;
  recruiter_visibility: number;
}

export interface DeptStat {
  dept_code: string;
  student_count: number;
  avg_ats: number;
  avg_trust: number;
}

/**
 * Score bands. These are policy choices, not measurements — they are defined
 * here, in one place, so the dashboard's meaning is auditable and a placement
 * officer can be told exactly what "placement ready" counts as.
 */
export const THRESHOLDS = {
  atsQualified: 70,
  placementReadyAts: 70,
  placementReadyTrust: 70,
  highlyEmployable: 75,
  employable: 50,
  highTrust: 75,
  engagedMissions: 5,
} as const;

type Row = Record<string, any>;

const num = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? v : 0);
const avg = (rows: Row[], key: string) =>
  rows.length === 0 ? 0 : Math.round(rows.reduce((a, r) => a + num(r[key]), 0) / rows.length);

/** studentId -> cohort metadata, empty when the cohort tables are absent or unused. */
async function cohortIndex(): Promise<Map<string, { department: string; college: string; batchYear: number }>> {
  const index = new Map<string, { department: string; college: string; batchYear: number }>();
  if (!(await tableExists('student_cohort_enrollments')) || !(await tableExists('college_cohorts'))) return index;

  const [{ data: enrollments }, { data: cohorts }] = await Promise.all([
    supabase.from('student_cohort_enrollments').select('cohort_id, student_id'),
    supabase.from('college_cohorts').select('id, college_name, department, batch_year'),
  ]);
  const byId = new Map((cohorts || []).map((c: Row) => [c.id, c]));
  for (const e of enrollments || []) {
    const c = byId.get(e.cohort_id);
    if (!c) continue;
    index.set(e.student_id, {
      department: c.department || 'Unspecified',
      college: c.college_name || 'Unspecified',
      batchYear: c.batch_year,
    });
  }
  return index;
}

async function scopedStudents(filters: UniversityFilters) {
  const { data, error } = await supabase.from('users').select('*').eq('role', 'student');
  if (error) throw error;
  const students = data || [];
  const cohorts = await cohortIndex();

  const wantsGrouping = !!(filters.college || filters.department || filters.batchYear);
  const filtered = !wantsGrouping ? students : students.filter((s: Row) => {
    const c = cohorts.get(s.id);
    if (!c) return false;
    if (filters.college && c.college !== filters.college) return false;
    if (filters.department && c.department !== filters.department) return false;
    if (filters.batchYear && c.batchYear !== filters.batchYear) return false;
    return true;
  });

  return { students: filtered, cohorts, cohortDataAvailable: cohorts.size > 0 };
}

export async function getUniversityDashboard(filters: UniversityFilters = {}) {
  const { students, cohorts, cohortDataAvailable } = await scopedStudents(filters);

  const placementStats: PlacementStats = {
    total_students: students.length,
    placement_ready: students.filter((s: Row) =>
      num(s.ats_score) >= THRESHOLDS.placementReadyAts && num(s.trust_score) >= THRESHOLDS.placementReadyTrust).length,
    ats_qualified: students.filter((s: Row) => num(s.ats_score) >= THRESHOLDS.atsQualified).length,
    avg_ats: avg(students, 'ats_score'),
    avg_trust: avg(students, 'trust_score'),
    avg_dna: avg(students, 'career_dna_score'),
    engaged_students: students.filter((s: Row) => num(s.missions_completed) > 0 || num(s.xp_total) > 0).length,
  };

  const topStudents: TopStudent[] = [...students]
    .sort((a: Row, b: Row) =>
      (num(b.ats_score) + num(b.trust_score) + num(b.career_dna_score)) -
      (num(a.ats_score) + num(a.trust_score) + num(a.career_dna_score)))
    .slice(0, 10)
    .map((s: Row) => ({
      id: s.id,
      display_name: s.display_name || 'Student',
      register_number: s.register_number || undefined,
      ats_score: num(s.ats_score),
      trust_score: num(s.trust_score),
      career_dna_score: num(s.career_dna_score),
      recruiter_visibility: num(s.recruiter_visibility),
    }));

  // Grouped only when cohort enrolment actually exists. No enrolment data means
  // no departments — not invented ones.
  const groups = new Map<string, Row[]>();
  for (const s of students) {
    const dept = cohorts.get(s.id)?.department;
    if (!dept) continue;
    if (!groups.has(dept)) groups.set(dept, []);
    groups.get(dept)!.push(s);
  }
  const deptStats: DeptStat[] = [...groups.entries()]
    .map(([dept_code, rows]) => ({
      dept_code,
      student_count: rows.length,
      avg_ats: avg(rows, 'ats_score'),
      avg_trust: avg(rows, 'trust_score'),
    }))
    .sort((a, b) => b.student_count - a.student_count);

  return {
    placementStats,
    topStudents,
    deptStats,
    dataAvailable: {
      students: students.length > 0,
      departments: cohortDataAvailable,
      // Told plainly so the UI can explain an empty chart instead of looking broken.
      departmentsNote: cohortDataAvailable
        ? undefined
        : 'No student cohort enrolments exist, so students cannot be grouped by department.',
    },
  };
}

export async function getEmployabilityReport(filters: UniversityFilters = {}) {
  const { students } = await scopedStudents(filters);
  const readiness = (s: Row) => num(s.career_readiness) || Math.round(
    (num(s.ats_score) + num(s.trust_score) + num(s.career_dna_score)) / 3);

  return {
    report: {
      highly_employable: students.filter((s: Row) => readiness(s) >= THRESHOLDS.highlyEmployable).length,
      employable: students.filter((s: Row) => {
        const r = readiness(s);
        return r >= THRESHOLDS.employable && r < THRESHOLDS.highlyEmployable;
      }).length,
      needs_development: students.filter((s: Row) => readiness(s) < THRESHOLDS.employable).length,
      high_trust: students.filter((s: Row) => num(s.trust_score) >= THRESHOLDS.highTrust).length,
      highly_engaged: students.filter((s: Row) => num(s.missions_completed) >= THRESHOLDS.engagedMissions).length,
      certified: students.filter((s: Row) => (s.certifications || []).length > 0 || num(s.vault_count) > 0).length,
    },
    thresholds: THRESHOLDS,
    dataAvailable: { students: students.length > 0 },
  };
}

export async function getSkillGaps(filters: UniversityFilters = {}) {
  const { students } = await scopedStudents(filters);
  const inScope = new Set(students.map((s: Row) => s.id));
  const counts = new Map<string, number>();

  // Preferred source: gaps the ATS engine actually detected per student.
  if (await tableExists('ats_skill_gaps')) {
    const { data } = await supabase.from('ats_skill_gaps').select('student_id, competency_id');
    for (const row of data || []) {
      if (!inScope.has(row.student_id) || !row.competency_id) continue;
      counts.set(row.competency_id, (counts.get(row.competency_id) || 0) + 1);
    }
  }

  // Fallback: weak areas recorded on the profile itself.
  let source: 'ats_skill_gaps' | 'profile_weak_areas' | 'none' = counts.size > 0 ? 'ats_skill_gaps' : 'none';
  if (counts.size === 0) {
    for (const s of students) {
      for (const w of s.weak_areas || []) {
        if (!w) continue;
        counts.set(w, (counts.get(w) || 0) + 1);
        source = 'profile_weak_areas';
      }
    }
  }

  return {
    gaps: [...counts.entries()]
      .map(([skill_gap, frequency]) => ({ skill_gap, frequency }))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 20),
    source,
    dataAvailable: { gaps: counts.size > 0 },
  };
}
