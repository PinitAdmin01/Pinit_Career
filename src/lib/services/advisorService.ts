import { supabase } from '@/lib/supabaseClient';
import { tableExists as checkSupabaseAvailable } from '@/lib/services/supabaseTable';
import { readLocalJson, writeLocalJson } from '@/lib/services/localJsonDb';

const DB_FILE = 'src/lib/data/advisor_db.json';

export interface AdvisorPerformance {
  attendance: number;
  cgpa: number;
  assignmentsCompleted: number;
  assignmentsPending: number;
  warningLevel: string;
}

export interface SubjectItem {
  name: string;
  attendance: number;
  internals: number;
  minInternals: number;
  risk: string;
}

export interface RecommendationItem {
  id: string;
  text: string;
  completed: boolean;
  impact: number;
}

export interface AdvisorStatsPayload {
  isDemo?: boolean;
  currentCgpa: number;
  predictedCgpa: number;
  backlogRisk: number;
  attendanceRisk: string;
  weakestSubject: string;
  learningSpeed: string;
  placementReadiness: string;
  burnoutRisk: string;
  recommendedStudyHours: number;
  inputs: {
    attendance: number;
    internalMarks: number;
    previousSemesterCgpa: number;
    codingQuestsCompleted: number;
    aiInterviewScore: number;
    lmsProgress: number;
    studyTime: number;
  };
  subjects: SubjectItem[];
  recommendations: RecommendationItem[];
}

export function getDemoAdvisorStats(): AdvisorStatsPayload {
  return {
    isDemo: true,
    currentCgpa: 7.5,
    predictedCgpa: 7.7,
    backlogRisk: 25,
    attendanceRisk: 'Medium',
    weakestSubject: 'Operating Systems',
    learningSpeed: 'Normal',
    placementReadiness: 'Medium',
    burnoutRisk: 'Low',
    recommendedStudyHours: 2.5,
    inputs: {
      attendance: 75,
      internalMarks: 20,
      previousSemesterCgpa: 7.2,
      codingQuestsCompleted: 4,
      aiInterviewScore: 66,
      lmsProgress: 85,
      studyTime: 2.5,
    },
    subjects: [
      { name: 'Data Structures & Algorithms', attendance: 82, internals: 24, minInternals: 18, risk: 'Low' },
      { name: 'Operating Systems', attendance: 71, internals: 19, minInternals: 18, risk: 'High' },
      { name: 'Database Management Systems', attendance: 78, internals: 22, minInternals: 18, risk: 'Medium' },
    ],
    recommendations: [
      { id: 'REC-DEMO-1', text: '[Demo] Attend next 3 lectures in Operating Systems to reach 75%', completed: false, impact: 25 },
      { id: 'REC-DEMO-2', text: '[Demo] Complete Trees & Graphs coding quest', completed: false, impact: 15 },
      { id: 'REC-DEMO-3', text: '[Demo] Revise SQL normalization before midterms', completed: false, impact: 10 },
    ],
  };
}

function buildAdvisorStats(perf: AdvisorPerformance, realSubjects: SubjectItem[] = []): AdvisorStatsPayload {
  const attendance = Number(perf.attendance ?? 0);
  const cgpa = Number(perf.cgpa ?? 0);
  const questsCompleted = Math.max(0, perf.assignmentsCompleted ?? 0);
  const studyTime = attendance < 75 ? 3.5 : 2.5;
  const backlogRisk = Math.max(
    5,
    Math.min(95, Math.round((attendance < 75 ? 80 : 20) - questsCompleted * 5 - studyTime * 5 + (cgpa < 6.0 && cgpa > 0 ? 30 : 0)))
  );

  // Compute weakest subject dynamically from real subjects (if present)
  let weakestSubject = 'General Academics';
  if (realSubjects.length > 0) {
    const sorted = [...realSubjects].sort((a, b) => {
      const riskWeight = (r: string) => (r === 'High' ? 3 : r === 'Medium' ? 2 : 1);
      if (riskWeight(b.risk) !== riskWeight(a.risk)) return riskWeight(b.risk) - riskWeight(a.risk);
      return a.attendance - b.attendance;
    });
    weakestSubject = sorted[0].name;
  }

  // Generate relevant recommendations dynamically based on actual performance gaps
  const recommendations: RecommendationItem[] = [];
  let recIdx = 1;

  if (attendance < 75 && attendance > 0) {
    recommendations.push({
      id: `REC-0${recIdx++}`,
      text: `Attend all scheduled lectures in ${weakestSubject} to clear the mandatory 75% threshold`,
      completed: false,
      impact: 25,
    });
  }

  const weakInternals = realSubjects.find(s => s.internals > 0 && s.internals < 18);
  if (weakInternals) {
    recommendations.push({
      id: `REC-0${recIdx++}`,
      text: `Schedule faculty consultation and remedial revision for ${weakInternals.name} internals (${weakInternals.internals}/30)`,
      completed: false,
      impact: 20,
    });
  }

  if (questsCompleted < 3) {
    recommendations.push({
      id: `REC-0${recIdx++}`,
      text: 'Complete your pending coding quest modules to improve practical problem-solving speed',
      completed: false,
      impact: 15,
    });
  }

  if (cgpa < 7.0 && cgpa > 0) {
    recommendations.push({
      id: `REC-0${recIdx++}`,
      text: 'Target chapter-wise review notes on core syllabus topics to boost GPA above 7.0',
      completed: false,
      impact: 15,
    });
  }

  if (recommendations.length < 3) {
    recommendations.push({
      id: `REC-0${recIdx++}`,
      text: 'Complete mock technical assessments on the AI Interview sandbox',
      completed: false,
      impact: 10,
    });
  }

  return {
    isDemo: false,
    currentCgpa: cgpa,
    predictedCgpa: Math.min(10, parseFloat((cgpa + questsCompleted * 0.05).toFixed(2))),
    backlogRisk,
    attendanceRisk: attendance >= 80 ? 'Low' : attendance >= 75 ? 'Medium' : 'High',
    weakestSubject,
    learningSpeed: questsCompleted >= 6 ? 'Fast' : 'Normal',
    placementReadiness: cgpa >= 8 ? 'High' : cgpa >= 7 ? 'Medium' : 'Low',
    burnoutRisk: studyTime > 4 ? 'Medium' : 'Low',
    recommendedStudyHours: studyTime,
    inputs: {
      attendance,
      internalMarks: realSubjects.length > 0
        ? Math.round(realSubjects.reduce((acc, s) => acc + s.internals, 0) / realSubjects.length)
        : Math.round(cgpa * 2.5),
      previousSemesterCgpa: Math.max(0, parseFloat((cgpa - 0.2).toFixed(2))),
      codingQuestsCompleted: questsCompleted,
      aiInterviewScore: Math.min(95, 50 + questsCompleted * 4),
      lmsProgress: Math.min(100, Math.round(attendance * 0.9 + 10)),
      studyTime,
    },
    subjects: realSubjects,
    recommendations,
  };
}

interface LocalAdvisorDb {
  students?: Record<string, AdvisorPerformance>;
  atRiskStudents?: any[];
}

async function readLocalDb(): Promise<LocalAdvisorDb> {
  return await readLocalJson(DB_FILE, { students: {} });
}

async function writeLocalDb(data: any): Promise<void> {
  await writeLocalJson(DB_FILE, data);
}

export const advisorService = {
  async getPerformance(studentId: string): Promise<AdvisorStatsPayload | null> {
    if (!studentId) return null;

    let perfRecord: AdvisorPerformance | null = null;
    const realSubjects: SubjectItem[] = [];
    let realAttendance: number | null = null;
    let realCgpa: number | null = null;

    const isAdvisorAvail = await checkSupabaseAvailable('advisor_performance');
    const isAttendanceAvail = await checkSupabaseAvailable('student_attendance');
    const isExamsAvail = await checkSupabaseAvailable('exam_results');

    // 1. Check official advisor_performance table
    if (isAdvisorAvail) {
      try {
        const { data: record } = await supabase
          .from('advisor_performance')
          .select('*')
          .eq('student_id', studentId)
          .maybeSingle();

        if (record) {
          perfRecord = {
            attendance: Number(record.attendance),
            cgpa: Number(record.cgpa),
            assignmentsCompleted: Number(record.assignments_completed || 0),
            assignmentsPending: Number(record.assignments_pending || 0),
            warningLevel: record.warning_level || 'Low',
          };
          realAttendance = perfRecord.attendance;
          realCgpa = perfRecord.cgpa;
        }
      } catch (err) {
        console.warn('[advisorService] Error reading advisor_performance:', err);
      }
    }

    // 2. Fetch real subjects and attendance percentage from student_attendance
    if (isAttendanceAvail) {
      try {
        const { data: attRecord } = await supabase
          .from('student_attendance')
          .select('*')
          .eq('student_id', studentId)
          .maybeSingle();

        if (attRecord && Array.isArray(attRecord.subjects) && attRecord.subjects.length > 0) {
          let totalPct = 0;
          attRecord.subjects.forEach((s: any) => {
            const pct = Number(s.percentage ?? (s.totalClasses > 0 ? Math.round((s.attended / s.totalClasses) * 100) : 0));
            totalPct += pct;
            realSubjects.push({
              name: s.subject || s.code || 'Course',
              attendance: pct,
              internals: 0,
              minInternals: 18,
              risk: pct < 75 ? 'High' : pct < 85 ? 'Medium' : 'Low',
            });
          });
          if (realAttendance === null && realSubjects.length > 0) {
            realAttendance = Math.round(totalPct / realSubjects.length);
          }
        }
      } catch (err) {
        console.warn('[advisorService] Error reading student_attendance:', err);
      }
    }

    // 3. Fetch real exam results & GPA from exam_results
    if (isExamsAvail) {
      try {
        const { data: examRecord } = await supabase
          .from('exam_results')
          .select('*')
          .eq('student_id', studentId)
          .maybeSingle();

        if (examRecord) {
          if (realCgpa === null && typeof examRecord.gpa === 'number') {
            realCgpa = Number(examRecord.gpa);
          }
          if (Array.isArray(examRecord.results) && examRecord.results.length > 0) {
            examRecord.results.forEach((r: any) => {
              const matched = realSubjects.find(s =>
                s.name.toLowerCase() === (r.course || '').toLowerCase() ||
                (r.code && s.name.toLowerCase().includes(r.code.toLowerCase()))
              );
              if (matched) {
                matched.internals = Number(r.internals || 0);
                if (matched.internals < 18 || matched.attendance < 75) {
                  matched.risk = 'High';
                }
              } else if (realSubjects.length === 0) {
                const internals = Number(r.internals || 0);
                realSubjects.push({
                  name: r.course || r.code || 'Course',
                  attendance: realAttendance ?? 80,
                  internals,
                  minInternals: 18,
                  risk: internals < 18 ? 'High' : internals < 22 ? 'Medium' : 'Low',
                });
              }
            });
          }
        }
      } catch (err) {
        console.warn('[advisorService] Error reading exam_results:', err);
      }
    }

    // 4. Local DB Fallback (keyed per student)
    if (!perfRecord && realAttendance === null && realCgpa === null) {
      const db = await readLocalDb();
      const studentLocal = db?.students?.[studentId];
      if (studentLocal) {
        perfRecord = studentLocal;
        realAttendance = studentLocal.attendance;
        realCgpa = studentLocal.cgpa;
      }
    }

    // 5. If NO records exist anywhere for this student, NEVER invent fake numbers. Return null so the UI can show empty state or explicit demo.
    if (!perfRecord && realAttendance === null && realCgpa === null) {
      return null;
    }

    const attendance = realAttendance ?? (perfRecord?.attendance ?? 0);
    const cgpa = realCgpa ?? (perfRecord?.cgpa ?? 0);
    const completed = perfRecord?.assignmentsCompleted ?? 0;
    const pending = perfRecord?.assignmentsPending ?? 0;
    const warningLevel = perfRecord?.warningLevel ?? (attendance < 75 ? 'High' : 'Low');

    return buildAdvisorStats(
      {
        attendance,
        cgpa,
        assignmentsCompleted: completed,
        assignmentsPending: pending,
        warningLevel,
      },
      realSubjects
    );
  },

  async completeQuest(studentId: string) {
    if (!studentId) return { ok: false, error: 'Student ID required' };

    const isSupabaseAvailable = await checkSupabaseAvailable('advisor_performance');

    if (isSupabaseAvailable) {
      try {
        const { data: record } = await supabase
          .from('advisor_performance')
          .select('*')
          .eq('student_id', studentId)
          .maybeSingle();

        if (record) {
          const completed = (record.assignments_completed || 0) + 1;
          const pending = Math.max(0, (record.assignments_pending || 0) - 1);
          const res = await supabase.from('advisor_performance').update({
            assignments_completed: completed,
            assignments_pending: pending,
          }).eq('student_id', studentId);
          if (res.error) throw new Error(res.error.message);

          const stats = await this.getPerformance(studentId);
          return { ok: true, completed, pending, stats };
        } else {
          // Initialize record for student upon quest completion
          const res = await supabase.from('advisor_performance').insert({
            student_id: studentId,
            attendance: 80,
            cgpa: 7.0,
            assignments_completed: 1,
            assignments_pending: 0,
            warning_level: 'Low',
          });
          if (res.error) throw new Error(res.error.message);
          const stats = await this.getPerformance(studentId);
          return { ok: true, completed: 1, pending: 0, stats };
        }
      } catch (err) {
        console.warn('Supabase write failed, falling back to local database:', err);
      }
    }

    const db = await readLocalDb();
    db.students = db.students || {};
    const current = db.students[studentId] || {
      attendance: 80,
      cgpa: 7.0,
      assignmentsCompleted: 0,
      assignmentsPending: 1,
      warningLevel: 'Low',
    };
    current.assignmentsCompleted += 1;
    current.assignmentsPending = Math.max(0, current.assignmentsPending - 1);
    db.students[studentId] = current;
    await writeLocalDb(db);

    const stats = buildAdvisorStats(current);
    return {
      ok: true,
      completed: current.assignmentsCompleted,
      pending: current.assignmentsPending,
      stats,
    };
  },

  async getAtRiskStudents() {
    const isSupabaseAvailable = await checkSupabaseAvailable('advisor_performance');

    if (isSupabaseAvailable) {
      try {
        const { data: records } = await supabase
          .from('advisor_performance')
          .select('*')
          .lt('attendance', 75);

        const atRisk = records || [];
        const studentIds = atRisk.map(r => r.student_id).filter(Boolean);
        const nameMap: Record<string, string> = {};

        if (studentIds.length > 0) {
          try {
            const { data: profiles } = await supabase
              .from('profiles')
              .select('id, display_name')
              .in('id', studentIds);
            if (profiles) {
              profiles.forEach((p: any) => {
                if (p.display_name) nameMap[p.id] = p.display_name;
              });
            }
          } catch {}

          try {
            const { data: campusAtt } = await supabase
              .from('campus_attendance')
              .select('student_id, student_name')
              .in('student_id', studentIds);
            if (campusAtt) {
              campusAtt.forEach((c: any) => {
                if (c.student_name && !nameMap[c.student_id]) {
                  nameMap[c.student_id] = c.student_name;
                }
              });
            }
          } catch {}
        }

        return {
          students: atRisk.map(r => ({
            id: r.student_id,
            name: nameMap[r.student_id] || (r.student_name || `Student ${r.student_id.slice(0, 8)}`),
            attendance: Number(r.attendance),
            cgpa: Number(r.cgpa),
            pendingAssignments: r.assignments_pending,
            riskLevel: Number(r.attendance) < 50 ? 'High' : 'Medium',
          })),
        };
      } catch (err) {
        console.warn('Supabase read failed, falling back to local database:', err);
      }
    }

    const db = await readLocalDb();
    const students: any[] = [];
    if (db.students) {
      for (const [id, perf] of Object.entries(db.students as Record<string, AdvisorPerformance>)) {
        if (typeof perf.attendance === 'number' && perf.attendance < 75) {
          students.push({
            id,
            name: `Student ${id.slice(0, 8)}`,
            attendance: perf.attendance,
            cgpa: perf.cgpa,
            pendingAssignments: perf.assignmentsPending,
            riskLevel: perf.attendance < 50 ? 'High' : 'Medium',
          });
        }
      }
    }
    return { students };
  },

  async sendAlert(studentId: string, message?: string) {
    if (!studentId) return { ok: false, error: 'Student ID required' };
    const isSupabaseAvailable = await checkSupabaseAvailable('advisor_performance');

    if (isSupabaseAvailable) {
      try {
        const res = await supabase
          .from('advisor_performance')
          .update({ warning_level: 'High' })
          .eq('student_id', studentId);
        if (res.error) throw new Error(res.error.message);
        return { ok: true };
      } catch (err) {
        console.warn('Supabase write failed, falling back to local database:', err);
      }
    }

    const db = await readLocalDb();
    db.students = db.students || {};
    if (db.students[studentId]) {
      db.students[studentId].warningLevel = 'High';
      await writeLocalDb(db);
    }
    return { ok: true };
  },
};
