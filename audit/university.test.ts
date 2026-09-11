/**
 * Regression guard for the university dashboard.
 *
 * Before: the handler returned invented figures — 480 students scaled by a
 * hardcoded multiplier per department, and three fictional top students
 * ("Ananya Rao", register number 1RV22CS045). A placement officer would have
 * been making decisions on numbers nobody measured.
 *
 * These tests cover the aggregation only. They do NOT prove the live `users`
 * table has the columns assumed here — that still needs a signed-in check
 * against real data (Gate 2 of the readiness plan).
 *
 * Run: npx tsx audit/university.test.ts
 */
import {
  applyFilters,
  computeDashboard,
  computeEmployability,
  THRESHOLDS,
  type CohortIndex,
} from '@/lib/university/analytics';

let fails = 0;
const out: string[] = [];
const eq = (name: string, got: unknown, want: unknown) => {
  const g = JSON.stringify(got);
  const w = JSON.stringify(want);
  const ok = g === w;
  if (!ok) fails++;
  out.push((ok ? 'PASS ' : 'FAIL ') + name + (ok ? '' : `\n   got  ${g}\n   want ${w}`));
};

const student = (id: string, over: Record<string, any> = {}) => ({
  id,
  display_name: 'Student ' + id,
  register_number: 'REG' + id,
  ats_score: 50, trust_score: 50, career_dna_score: 50,
  recruiter_visibility: 0, missions_completed: 0, xp_total: 0, vault_count: 0,
  certifications: [],
  ...over,
});

const noCohorts: CohortIndex = new Map();

// ── the invented-data bug must not be reproducible ──────────────────────────
{
  const empty = computeDashboard([], noCohorts, false);
  eq('no students means zero, not 480', empty.placementStats.total_students, 0);
  eq('no students means no top students', empty.topStudents, []);
  eq('no cohorts means no departments', empty.deptStats, []);
  eq('and says why the department chart is empty',
    typeof empty.dataAvailable.departmentsNote === 'string', true);
  eq('flags that there is no student data', empty.dataAvailable.students, false);
}

// ── counts and averages come from the rows ──────────────────────────────────
{
  const students = [
    student('a', { ats_score: 80, trust_score: 80, career_dna_score: 90, missions_completed: 3 }),
    student('b', { ats_score: 70, trust_score: 70, career_dna_score: 60 }),
    student('c', { ats_score: 20, trust_score: 30, career_dna_score: 30 }),
  ];
  const d = computeDashboard(students, noCohorts, false);

  eq('counts every student', d.placementStats.total_students, 3);
  // a: 80/80 ok, b: 70/70 ok (thresholds are >=), c: below
  eq('placement_ready uses both ats and trust', d.placementStats.placement_ready, 2);
  eq('ats_qualified counts ats only', d.placementStats.ats_qualified, 2);
  eq('avg_ats is the real mean', d.placementStats.avg_ats, Math.round((80 + 70 + 20) / 3));
  eq('avg_trust is the real mean', d.placementStats.avg_trust, Math.round((80 + 70 + 30) / 3));
  eq('engaged counts any activity', d.placementStats.engaged_students, 1);

  eq('top students ranked by combined score',
    d.topStudents.map((s) => s.id), ['a', 'b', 'c']);
  eq('top students carry real names, not invented ones',
    d.topStudents[0].display_name, 'Student a');
  eq('top list is capped at 10',
    computeDashboard(Array.from({ length: 25 }, (_, i) => student('s' + i)), noCohorts, false).topStudents.length, 10);
}

// ── thresholds are the documented ones, not magic numbers ───────────────────
{
  const atThreshold = [student('x', {
    ats_score: THRESHOLDS.placementReadyAts,
    trust_score: THRESHOLDS.placementReadyTrust,
  })];
  eq('threshold is inclusive', computeDashboard(atThreshold, noCohorts, false).placementStats.placement_ready, 1);

  const justBelow = [student('y', {
    ats_score: THRESHOLDS.placementReadyAts - 1,
    trust_score: THRESHOLDS.placementReadyTrust,
  })];
  eq('one point below does not qualify', computeDashboard(justBelow, noCohorts, false).placementStats.placement_ready, 0);
}

// ── departments only when cohort enrolment actually exists ──────────────────
{
  const students = [student('a', { ats_score: 80 }), student('b', { ats_score: 60 }), student('c')];
  const cohorts: CohortIndex = new Map([
    ['a', { department: 'CSE', college: 'RVCE', batchYear: 2026 }],
    ['b', { department: 'CSE', college: 'RVCE', batchYear: 2026 }],
    ['c', { department: 'ECE', college: 'RVCE', batchYear: 2025 }],
  ]);
  const d = computeDashboard(students, cohorts, true);

  eq('groups by real department', d.deptStats.map((x) => x.dept_code), ['CSE', 'ECE']);
  eq('department counts are real', d.deptStats[0].student_count, 2);
  eq('department average is real', d.deptStats[0].avg_ats, Math.round((80 + 60) / 2));
  eq('no note when departments exist', d.dataAvailable.departmentsNote, undefined);

  // A student with no enrolment must not invent a department for them.
  const partial = computeDashboard(students, new Map([['a', cohorts.get('a')!]]), true);
  eq('unenrolled students are not grouped', partial.deptStats.map((x) => x.dept_code), ['CSE']);
  eq('but they still count in the total', partial.placementStats.total_students, 3);
}

// ── filters ─────────────────────────────────────────────────────────────────
{
  const students = [student('a'), student('b'), student('c')];
  const cohorts: CohortIndex = new Map([
    ['a', { department: 'CSE', college: 'RVCE', batchYear: 2026 }],
    ['b', { department: 'ECE', college: 'RVCE', batchYear: 2026 }],
    ['c', { department: 'CSE', college: 'BMS', batchYear: 2025 }],
  ]);
  eq('no filter returns everyone', applyFilters(students, cohorts, {}).length, 3);
  eq('department filter', applyFilters(students, cohorts, { department: 'CSE' }).map((s) => s.id), ['a', 'c']);
  eq('college filter', applyFilters(students, cohorts, { college: 'RVCE' }).map((s) => s.id), ['a', 'b']);
  eq('combined filter', applyFilters(students, cohorts, { college: 'RVCE', department: 'CSE' }).map((s) => s.id), ['a']);
  eq('batch year filter', applyFilters(students, cohorts, { batchYear: 2025 }).map((s) => s.id), ['c']);
  eq('filtering with no cohort data returns nobody',
    applyFilters(students, noCohorts, { department: 'CSE' }).length, 0);
}

// ── employability bands ─────────────────────────────────────────────────────
{
  const students = [
    student('hi', { career_readiness: 90, trust_score: 80, missions_completed: 9, vault_count: 2 }),
    student('mid', { career_readiness: 60 }),
    student('low', { career_readiness: 20 }),
  ];
  const r = computeEmployability(students).report;
  eq('highly employable', r.highly_employable, 1);
  eq('employable', r.employable, 1);
  eq('needs development', r.needs_development, 1);
  eq('bands account for everyone',
    r.highly_employable + r.employable + r.needs_development, students.length);
  eq('high trust counted', r.high_trust, 1);
  eq('engaged counted', r.highly_engaged, 1);
  eq('certified counts vault items too', r.certified, 1);

  // readiness falls back to the mean of the three scores when unset
  const derived = computeEmployability([student('d', { ats_score: 90, trust_score: 90, career_dna_score: 90 })]);
  eq('derives readiness when career_readiness is absent', derived.report.highly_employable, 1);

  eq('thresholds are published with the report', computeEmployability([]).thresholds, THRESHOLDS);
  eq('empty input is all zeros', computeEmployability([]).report.highly_employable, 0);
}

console.log('\n' + out.join('\n'));
console.log(fails === 0 ? `\nALL ${out.length} PASSED` : `\n${fails} of ${out.length} FAILED`);
process.exit(fails === 0 ? 0 : 1);
