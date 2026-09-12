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

function getLocalSheet(db: any): ExamResultsSheet {
  if (db.sheet && Array.isArray(db.sheet.results) && db.sheet.results.length > 0) {
    return {
      isPublished: Boolean(db.sheet.isPublished),
      gpa: Number(db.sheet.gpa || 0),
      results: db.sheet.results
    };
  }
  if (Array.isArray(db.results) && db.results.length > 0) {
    return {
      isPublished: Boolean(db.isPublished),
      gpa: Number(db.gpa || 0),
      results: db.results
    };
  }
  return {
    isPublished: Boolean(db.isPublished ?? db.sheet?.isPublished),
    gpa: Number(db.gpa ?? db.sheet?.gpa ?? 0),
    results: [
      { course: 'Distributed Systems', code: 'CS601', internals: 28, semester: 0, grade: 'Pending' },
      { course: 'Compiler Design', code: 'CS602', internals: 27, semester: 0, grade: 'Pending' },
      { course: 'Computer Networks', code: 'CS603', internals: 26, semester: 0, grade: 'Pending' },
      { course: 'Machine Learning', code: 'CS604', internals: 29, semester: 0, grade: 'Pending' }
    ]
  };
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
    return getLocalSheet(db);
  },

  async getMarksSheet(studentId: string) {
    return this.getStudentResults(studentId);
  },

  async submitMarks(studentId: string, marks: Record<string, number>) {
    const isSupabaseAvailable = await checkSupabaseAvailable('exam_results');

    if (isSupabaseAvailable) {
      try {
        const { data: record } = await supabase.from('exam_results').select('*').eq('student_id', studentId).maybeSingle();
        if (record) {
          let totalGPs = 0;
          const updatedResults = (record.results || []).map((r: any) => {
            const isAbsent = marks[r.code] === undefined || marks[r.code] === null;
            const semMarkRaw = isAbsent ? 0 : Number(marks[r.code]) || 0;
            const semMark = Math.min(70, Math.max(0, semMarkRaw));
            const total = r.internals + semMark;
            let grade = 'F';
            let gp = 0;
            if (!isAbsent) {
              if (total >= 90) { grade = 'O'; gp = 10; }
              else if (total >= 80) { grade = 'A+'; gp = 9; }
              else if (total >= 70) { grade = 'A'; gp = 8; }
              else if (total >= 60) { grade = 'B+'; gp = 7; }
              else if (total >= 50) { grade = 'B'; gp = 6; }
              else if (total >= 40) { grade = 'C'; gp = 5; }
              else { grade = 'F'; gp = 0; }
            } else {
              grade = 'Absent';
              gp = 0;
            }

            totalGPs += gp;
            return {
              ...r,
              semester: semMark,
              grade,
              isAbsent
            };
          });

          const newGpa = updatedResults.length > 0 ? Number((totalGPs / updatedResults.length).toFixed(2)) : 0;
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
    const sheet = getLocalSheet(db);
    let totalGPs = 0;
    sheet.results = sheet.results.map((r: any) => {
      const isAbsent = marks[r.code] === undefined || marks[r.code] === null;
      const semMarkRaw = isAbsent ? 0 : Number(marks[r.code]) || 0;
      const semMark = Math.min(70, Math.max(0, semMarkRaw));
      const total = r.internals + semMark;
      let grade = 'F';
      let gp = 0;
      if (!isAbsent) {
        if (total >= 90) { grade = 'O'; gp = 10; }
        else if (total >= 80) { grade = 'A+'; gp = 9; }
        else if (total >= 70) { grade = 'A'; gp = 8; }
        else if (total >= 60) { grade = 'B+'; gp = 7; }
        else if (total >= 50) { grade = 'B'; gp = 6; }
        else if (total >= 40) { grade = 'C'; gp = 5; }
        else { grade = 'F'; gp = 0; }
      } else {
        grade = 'Absent';
        gp = 0;
      }

      totalGPs += gp;
      return {
        ...r,
        semester: semMark,
        grade,
        isAbsent
      };
    });

    sheet.gpa = sheet.results.length > 0 ? Number((totalGPs / sheet.results.length).toFixed(2)) : 0;
    db.sheet = sheet;
    db.results = sheet.results;
    db.gpa = sheet.gpa;
    await writeLocalDb(db);
    return { ok: true, gpa: sheet.gpa };
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

  async getExamCooldown(studentId: string, registerNumber: string | undefined, examScheduleId: string): Promise<{
    inCooldown: boolean;
    remainingHours: number;
    lastAttemptTime?: number;
    score?: number;
    passed?: boolean;
  }> {
    const COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 hours
    const isSupabaseAvailable = await checkSupabaseAvailable('exam_attempts');
    if (isSupabaseAvailable) {
      try {
        let query = supabase.from('exam_attempts').select('id, score, passed, created_at');
        if (registerNumber) {
          query = query.or(`student_id.eq.${studentId},register_number.eq.${registerNumber}`);
        } else {
          query = query.eq('student_id', studentId);
        }
        const { data } = await query.eq('exam_schedule_id', examScheduleId).order('created_at', { ascending: false }).limit(1).maybeSingle();
        if (data && data.created_at) {
          const attemptTime = new Date(data.created_at).getTime();
          const elapsed = Date.now() - attemptTime;
          if (elapsed < COOLDOWN_MS) {
            const remainingHours = Math.max(0.1, Number(((COOLDOWN_MS - elapsed) / (1000 * 60 * 60)).toFixed(1)));
            return { inCooldown: true, remainingHours, lastAttemptTime: attemptTime, score: data.score, passed: data.passed };
          }
          return { inCooldown: false, remainingHours: 0, lastAttemptTime: attemptTime, score: data.score, passed: data.passed };
        }
      } catch (err) {
        console.warn('Supabase getExamCooldown failed, checking local DB fallback:', err);
      }
    }

    // Local DB Fallback
    try {
      const db = await readLocalDb();
      const attempts = (db.attempts || []).filter((a: any) =>
        (a.studentId === studentId || (registerNumber && a.registerNumber === registerNumber)) &&
        a.examScheduleId === examScheduleId
      );
      if (attempts.length > 0) {
        const last = attempts[attempts.length - 1];
        const attemptTime = last.timestamp || (last.created_at ? new Date(last.created_at).getTime() : Date.now());
        const elapsed = Date.now() - attemptTime;
        if (elapsed < COOLDOWN_MS) {
          const remainingHours = Math.max(0.1, Number(((COOLDOWN_MS - elapsed) / (1000 * 60 * 60)).toFixed(1)));
          return { inCooldown: true, remainingHours, lastAttemptTime: attemptTime, score: last.score, passed: last.passed };
        }
        return { inCooldown: false, remainingHours: 0, lastAttemptTime: attemptTime, score: last.score, passed: last.passed };
      }
    } catch {}

    return { inCooldown: false, remainingHours: 0 };
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
