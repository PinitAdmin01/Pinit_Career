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

export interface AdvisorStatsPayload {
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
  subjects: Array<{
    name: string;
    attendance: number;
    internals: number;
    minInternals: number;
    risk: string;
  }>;
  recommendations: Array<{
    id: string;
    text: string;
    completed: boolean;
    impact: number;
  }>;
}

function defaultPerformance(): AdvisorPerformance {
  return {
    attendance: 75,
    cgpa: 7.5,
    assignmentsCompleted: 6,
    assignmentsPending: 4,
    warningLevel: 'Low',
  };
}

function buildAdvisorStats(perf: AdvisorPerformance): AdvisorStatsPayload {
  const attendance = perf.attendance ?? 75;
  const cgpa = perf.cgpa ?? 7.5;
  const questsCompleted = Math.max(0, perf.assignmentsCompleted ?? 4);
  const studyTime = attendance < 75 ? 3.5 : 2.5;
  const backlogRisk = Math.max(
    10,
    Math.round((attendance < 75 ? 85 : 25) - questsCompleted * 6 - studyTime * 8 + 25)
  );

  return {
    currentCgpa: cgpa,
    predictedCgpa: Math.min(10, parseFloat((cgpa + questsCompleted * 0.05).toFixed(2))),
    backlogRisk,
    attendanceRisk: attendance >= 80 ? 'Low' : attendance >= 75 ? 'Medium' : 'High',
    weakestSubject: attendance < 75 ? 'Data Structures' : 'Operating Systems',
    learningSpeed: questsCompleted >= 6 ? 'Fast' : 'Normal',
    placementReadiness: cgpa >= 8 ? 'High' : cgpa >= 7 ? 'Medium' : 'Low',
    burnoutRisk: studyTime > 4 ? 'Medium' : 'Low',
    recommendedStudyHours: studyTime,
    inputs: {
      attendance,
      internalMarks: Math.round(cgpa * 2),
      previousSemesterCgpa: Math.max(6, cgpa - 0.3),
      codingQuestsCompleted: questsCompleted,
      aiInterviewScore: Math.min(95, 50 + questsCompleted * 4),
      lmsProgress: Math.min(100, attendance + 10),
      studyTime,
    },
    subjects: [
      {
        name: 'Data Structures',
        attendance,
        internals: Math.round(cgpa * 2),
        minInternals: 18,
        risk: attendance < 75 ? 'High' : 'Medium',
      },
      {
        name: 'Operating Systems',
        attendance: Math.min(100, attendance + 7),
        internals: Math.round(cgpa * 2.2),
        minInternals: 18,
        risk: 'Medium',
      },
      {
        name: 'Database Management',
        attendance: Math.min(100, attendance + 15),
        internals: Math.round(cgpa * 3),
        minInternals: 18,
        risk: 'Low',
      },
    ],
    recommendations: [
      { id: 'REC-01', text: 'Complete the next coding quest', completed: false, impact: 20 },
      { id: 'REC-02', text: 'Revise core syllabus topics', completed: false, impact: 15 },
      { id: 'REC-03', text: 'Maintain lecture attendance this week', completed: false, impact: 10 },
    ],
  };
}

async function readLocalDb(): Promise<any> {
  return await readLocalJson(DB_FILE, { performance: defaultPerformance() });
}

async function writeLocalDb(data: any): Promise<void> {
  await writeLocalJson(DB_FILE, data);
}

export const advisorService = {
  async getPerformance(studentId: string) {
    const isSupabaseAvailable = await checkSupabaseAvailable('advisor_performance');

    if (isSupabaseAvailable) {
      try {
        const { data: record } = await supabase.from('advisor_performance').select('*').eq('student_id', studentId).maybeSingle();
        if (record) {
          return buildAdvisorStats({
            attendance: record.attendance,
            cgpa: Number(record.cgpa),
            assignmentsCompleted: record.assignments_completed,
            assignmentsPending: record.assignments_pending,
            warningLevel: record.warning_level,
          });
        }
      } catch (err) {
        console.warn('Supabase read failed, falling back to local database:', err);
      }
    }

    const db = await readLocalDb();
    return buildAdvisorStats({ ...defaultPerformance(), ...(db.performance || {}) });
  },

  async completeQuest(studentId: string) {
    const isSupabaseAvailable = await checkSupabaseAvailable('advisor_performance');

    if (isSupabaseAvailable) {
      try {
        const { data: record } = await supabase.from('advisor_performance').select('*').eq('student_id', studentId).maybeSingle();
        if (record) {
          const completed = record.assignments_completed + 1;
          const pending = Math.max(0, record.assignments_pending - 1);
          await supabase.from('advisor_performance').update({
            assignments_completed: completed,
            assignments_pending: pending,
          }).eq('student_id', studentId);
          const stats = buildAdvisorStats({
            attendance: record.attendance,
            cgpa: Number(record.cgpa),
            assignmentsCompleted: completed,
            assignmentsPending: pending,
            warningLevel: record.warning_level,
          });
          return { ok: true, completed, pending, stats };
        }
      } catch (err) {
        console.warn('Supabase write failed, falling back to local database:', err);
      }
    }

    const db = await readLocalDb();
    db.performance = { ...defaultPerformance(), ...(db.performance || {}) };
    db.performance.assignmentsCompleted += 1;
    db.performance.assignmentsPending = Math.max(0, db.performance.assignmentsPending - 1);
    await writeLocalDb(db);
    const stats = buildAdvisorStats(db.performance);
    return {
      ok: true,
      completed: db.performance.assignmentsCompleted,
      pending: db.performance.assignmentsPending,
      stats,
    };
  },

  async getAtRiskStudents() {
    const isSupabaseAvailable = await checkSupabaseAvailable('advisor_performance');

    if (isSupabaseAvailable) {
      try {
        const { data: records } = await supabase.from('advisor_performance').select('*').lt('attendance', 75);
        return {
          students: (records || []).map(r => ({
            id: r.student_id,
            name: `Student (${r.student_id})`,
            attendance: r.attendance,
            cgpa: Number(r.cgpa),
            pendingAssignments: r.assignments_pending,
            riskLevel: r.attendance < 50 ? 'High' : 'Medium',
          })),
        };
      } catch (err) {
        console.warn('Supabase read failed, falling back to local database:', err);
      }
    }

    const db = await readLocalDb();
    const attendance = db.performance?.attendance;
    if (typeof attendance !== 'number' || attendance >= 90) {
      return { students: [] };
    }
    return {
      students: [{
        id: 'local-at-risk',
        name: 'Student',
        attendance,
        cgpa: db.performance.cgpa,
        pendingAssignments: db.performance.assignmentsPending,
        riskLevel: attendance < 75 ? 'High' : 'Medium',
      }],
    };
  },

  async sendAlert(studentId: string, message: string) {
    const isSupabaseAvailable = await checkSupabaseAvailable('advisor_performance');

    if (isSupabaseAvailable) {
      try {
        await supabase.from('advisor_performance').update({ warning_level: 'High' }).eq('student_id', studentId);
        return { ok: true };
      } catch (err) {
        console.warn('Supabase write failed, falling back to local database:', err);
      }
    }

    const db = await readLocalDb();
    db.performance = { ...defaultPerformance(), ...(db.performance || {}) };
    db.performance.warningLevel = 'High';
    await writeLocalDb(db);
    return { ok: true };
  },
};
