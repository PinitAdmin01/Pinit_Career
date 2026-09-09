import { supabase } from '@/lib/supabaseClient';
import { tableExists as checkSupabaseAvailable } from '@/lib/services/supabaseTable';
import { readLocalJson, writeLocalJson } from '@/lib/services/localJsonDb';

const DB_FILE = 'src/lib/data/exams_db.json';

// Interface types
export interface ExamScheduleItem {
  id: string;
  course: string;
  code: string;
  date: string;
  time: string;
  slot: string;
  room: string;
}

export interface ExamResultItem {
  course: string;
  code: string;
  internals: number;
  semester: number;
  grade: string;
}

export interface ExamResultsSheet {
  isPublished: boolean;
  gpa: number;
  results: ExamResultItem[];
}

// Read local JSON database
async function readLocalDb(): Promise<any> {
  return await readLocalJson(DB_FILE, { schedule: [], sheet: {} });
}

// Write local JSON database
async function writeLocalDb(data: any): Promise<void> {
  await writeLocalJson(DB_FILE, data);
}

export const examsService = {
  async getStudentSchedule() {
    const isSupabaseAvailable = await checkSupabaseAvailable('exam_schedule');

    if (isSupabaseAvailable) {
      try {
        const { data: schedule } = await supabase.from('exam_schedule').select('*');
        if (schedule && schedule.length > 0) {
          return {
            schedule: schedule.map(s => ({
              id: s.id,
              course: s.course,
              code: s.code,
              date: s.date,
              time: s.time,
              slot: s.slot,
              room: s.room
            }))
          };
        }
      } catch (err) {
        console.warn('Supabase read failed, falling back to local database:', err);
      }
    }

    // Local Database Fallback
    const db = await readLocalDb();
    return {
      schedule: db.schedule || []
    };
  },

  async getStudentResults(studentId: string) {
    const isSupabaseAvailable = await checkSupabaseAvailable('exam_results');

    if (isSupabaseAvailable) {
      try {
        const { data: record } = await supabase.from('exam_results').select('*').eq('student_id', studentId).maybeSingle();
        if (record) {
          return {
            isPublished: record.is_published,
            gpa: Number(record.gpa),
            results: record.results || []
          };
        }
      } catch (err) {
        console.warn('Supabase read failed, falling back to local database:', err);
      }
    }

    // Local Database Fallback
    const db = await readLocalDb();
    return db.sheet;
  },

  async submitMarks(studentId: string, marks: Record<string, number>) {
    const isSupabaseAvailable = await checkSupabaseAvailable('exam_results');

    if (isSupabaseAvailable) {
      try {
        const { data: record } = await supabase.from('exam_results').select('*').eq('student_id', studentId).maybeSingle();
        if (record) {
          let totalGPs = 0;
          const updatedResults = (record.results || []).map((r: any) => {
            const semMarkRaw = Number(marks[r.code]) || 0;
            const semMark = Math.min(70, Math.max(0, semMarkRaw));
            const total = r.internals + semMark;
            let grade = 'F';
            let gp = 0;
            if (total >= 90) { grade = 'O'; gp = 10; }
            else if (total >= 80) { grade = 'A+'; gp = 9; }
            else if (total >= 70) { grade = 'A'; gp = 8; }
            else if (total >= 60) { grade = 'B+'; gp = 7; }
            else if (total >= 50) { grade = 'B'; gp = 6; }
            else if (total >= 40) { grade = 'C'; gp = 5; }

            totalGPs += gp;
            return {
              ...r,
              semester: semMark,
              grade: semMark > 0 ? grade : 'Incomplete'
            };
          });

          const newGpa = Number((totalGPs / updatedResults.length).toFixed(2));
          const res = await supabase.from('exam_results').update({
            results: updatedResults,
            gpa: newGpa
          }).eq('student_id', studentId);
          if (res.error) throw new Error(res.error.message);

          return { ok: true, gpa: newGpa };
        }
      } catch (err) {
        console.warn('Supabase write failed, falling back to local database:', err);
      }
    }

    // Local Database Fallback
    const db = await readLocalDb();
    let totalGPs = 0;
    db.sheet.results = db.sheet.results.map((r: any) => {
      const semMarkRaw = Number(marks[r.code]) || 0;
      const semMark = Math.min(70, Math.max(0, semMarkRaw));
      const total = r.internals + semMark;
      let grade = 'F';
      let gp = 0;
      if (total >= 90) { grade = 'O'; gp = 10; }
      else if (total >= 80) { grade = 'A+'; gp = 9; }
      else if (total >= 70) { grade = 'A'; gp = 8; }
      else if (total >= 60) { grade = 'B+'; gp = 7; }
      else if (total >= 50) { grade = 'B'; gp = 6; }
      else if (total >= 40) { grade = 'C'; gp = 5; }

      totalGPs += gp;
      return {
        ...r,
        semester: semMark,
        grade: semMark > 0 ? grade : 'Incomplete'
      };
    });

    db.sheet.gpa = Number((totalGPs / db.sheet.results.length).toFixed(2));
    await writeLocalDb(db);
    return { ok: true, gpa: db.sheet.gpa };
  },

  async publishResults(studentId: string, isPublished: boolean) {
    const isSupabaseAvailable = await checkSupabaseAvailable('exam_results');

    if (isSupabaseAvailable) {
      try {
        const res = await supabase.from('exam_results').update({
          is_published: isPublished
        }).eq('student_id', studentId);
        if (res.error) throw new Error(res.error.message);
        return { ok: true, isPublished };
      } catch (err) {
        console.warn('Supabase write failed, falling back to local database:', err);
      }
    }

    // Local Database Fallback
    const db = await readLocalDb();
    db.sheet.isPublished = isPublished;
    await writeLocalDb(db);
    return { ok: true, isPublished };
  },

  async checkExamAttempt(studentId: string, registerNumber: string | undefined, examScheduleId: string): Promise<boolean> {
    const isSupabaseAvailable = await checkSupabaseAvailable('exam_attempts');
    if (isSupabaseAvailable) {
      try {
        let query = supabase.from('exam_attempts').select('id');
        if (registerNumber) {
          query = query.or(`student_id.eq.${studentId},register_number.eq.${registerNumber}`);
        } else {
          query = query.eq('student_id', studentId);
        }
        const { data } = await query.eq('exam_schedule_id', examScheduleId).maybeSingle();
        if (data) return true;
      } catch (err) {
        console.warn('Supabase checkExamAttempt failed, checking fallback:', err);
      }
    }

    // Local Database Fallback
    try {
      const db = await readLocalDb();
      const attempts = db.attempts || [];
      return attempts.some((a: any) =>
        (a.studentId === studentId || (registerNumber && a.registerNumber === registerNumber)) &&
        a.examScheduleId === examScheduleId
      );
    } catch {
      return false;
    }
  },

  async recordExamAttempt(params: {
    studentId: string;
    registerNumber?: string;
    examScheduleId: string;
    score?: number;
    passed?: boolean;
  }): Promise<void> {
    const isSupabaseAvailable = await checkSupabaseAvailable('exam_attempts');
    if (isSupabaseAvailable) {
      try {
        const res = await supabase.from('exam_attempts').insert({
          student_id: params.studentId,
          register_number: params.registerNumber || params.studentId,
          exam_schedule_id: params.examScheduleId,
          score: params.score ?? 0,
          passed: params.passed ?? true,
          created_at: new Date().toISOString()
        });
        if (res.error) throw new Error(res.error.message);
      } catch (err) {
        console.warn('Supabase recordExamAttempt failed, using local DB fallback:', err);
      }
    }

    try {
      const db = await readLocalDb();
      if (!Array.isArray(db.attempts)) db.attempts = [];
      db.attempts.push({
        ...params,
        timestamp: Date.now()
      });
      await writeLocalDb(db);
    } catch (e) {
      console.warn('Local DB write failed:', e);
    }
  }
};
