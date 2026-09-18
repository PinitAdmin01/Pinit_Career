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

function getLocalSheet(db: any, studentId?: string): ExamResultsSheet {
  if (studentId && db?.sheets && db.sheets[studentId]) {
    const s = db.sheets[studentId];
    return {
      isPublished: Boolean(s.isPublished),
      gpa: Number(s.gpa || 0),
      results: Array.isArray(s.results) ? s.results : []
    };
  }
  // Return empty state when no marks have been recorded for the student
  return {
    isPublished: false,
    gpa: 0,
    results: []
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
    if (!studentId || typeof studentId !== 'string') {
      return { isPublished: false, gpa: 0, results: [] };
    }

    const isSupabaseAvailable = await checkSupabaseAvailable('exam_results');

    if (isSupabaseAvailable) {
      try {
        const { data: record } = await supabase.from('exam_results').select('*').eq('student_id', studentId).maybeSingle();
        if (record) {
          return {
            isPublished: Boolean(record.is_published),
            gpa: Number(record.gpa || 0),
            results: record.results || []
          };
        }
        // If Supabase is active and student has no record, return empty state
        return {
          isPublished: false,
          gpa: 0,
          results: []
        };
      } catch (err) {
        console.warn('Supabase read failed, falling back to local database:', err);
      }
    }

    // Local Database Fallback (per-student keyed)
    const db = await readLocalDb();
    return getLocalSheet(db, studentId);
  },

  async getMarksSheet(studentId: string) {
    return this.getStudentResults(studentId);
  },

  async submitMarks(studentId: string, marks: Record<string, number>) {
    if (!studentId || typeof studentId !== 'string') {
      throw new Error('Valid studentId is required');
    }

    const isSupabaseAvailable = await checkSupabaseAvailable('exam_results');

    if (isSupabaseAvailable) {
      try {
        const { data: record } = await supabase.from('exam_results').select('*').eq('student_id', studentId).maybeSingle();
        const baseResults = record?.results && Array.isArray(record.results) && record.results.length > 0
          ? record.results
          : Object.keys(marks || {}).map(code => ({
              code,
              course: code,
              internals: 0,
              semester: 0,
              grade: 'Pending',
              isAbsent: false,
            }));

        let totalGPs = 0;
        const updatedResults = baseResults.map((r: any) => {
          const isAbsent = marks[r.code] === undefined || marks[r.code] === null;
          const semMarkRaw = isAbsent ? 0 : Number(marks[r.code]) || 0;
          const semMark = Math.min(70, Math.max(0, semMarkRaw));
          const internals = Number(r.internals) || 0;
          const total = internals + semMark;
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
            internals,
            semester: semMark,
            grade,
            isAbsent
          };
        });

        const newGpa = updatedResults.length > 0 ? Number((totalGPs / updatedResults.length).toFixed(2)) : 0;

        if (record) {
          const res = await supabase.from('exam_results').update({
            results: updatedResults,
            gpa: newGpa
          }).eq('student_id', studentId);
          if (res.error) throw new Error(res.error.message);
        } else {
          const res = await supabase.from('exam_results').insert({
            student_id: studentId,
            results: updatedResults,
            gpa: newGpa,
            is_published: false
          });
          if (res.error) throw new Error(res.error.message);
        }

        return { ok: true, gpa: newGpa };
      } catch (err) {
        console.warn('Supabase write failed, falling back to local database:', err);
      }
    }

    // Local Database Fallback (keyed per student)
    const db = await readLocalDb();
    if (!db.sheets || typeof db.sheets !== 'object') {
      db.sheets = {};
    }
    const currentSheet = getLocalSheet(db, studentId);
    const baseResults = currentSheet.results.length > 0
      ? currentSheet.results
      : Object.keys(marks || {}).map(code => ({
          code,
          course: code,
          internals: 0,
          semester: 0,
          grade: 'Pending',
          isAbsent: false,
        }));

    let totalGPs = 0;
    const updatedResults = baseResults.map((r: any) => {
      const isAbsent = marks[r.code] === undefined || marks[r.code] === null;
      const semMarkRaw = isAbsent ? 0 : Number(marks[r.code]) || 0;
      const semMark = Math.min(70, Math.max(0, semMarkRaw));
      const internals = Number(r.internals) || 0;
      const total = internals + semMark;
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
        internals,
        semester: semMark,
        grade,
        isAbsent
      };
    });

    const newGpa = updatedResults.length > 0 ? Number((totalGPs / updatedResults.length).toFixed(2)) : 0;
    db.sheets[studentId] = {
      isPublished: currentSheet.isPublished,
      gpa: newGpa,
      results: updatedResults
    };
    await writeLocalDb(db);
    return { ok: true, gpa: newGpa };
  },

  async publishResults(studentId: string, isPublished: boolean) {
    if (!studentId || typeof studentId !== 'string') {
      throw new Error('Valid studentId is required');
    }

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

    // Local Database Fallback (keyed per student)
    const db = await readLocalDb();
    if (!db.sheets || typeof db.sheets !== 'object') {
      db.sheets = {};
    }
    const currentSheet = getLocalSheet(db, studentId);
    db.sheets[studentId] = {
      ...currentSheet,
      isPublished
    };
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
    const rawScore = Number(params.score);
    const score = Number.isFinite(rawScore) ? Math.min(100, Math.max(0, Math.floor(rawScore))) : 0;
    const passed = typeof params.passed === 'boolean' ? params.passed : score >= 40;

    const isSupabaseAvailable = await checkSupabaseAvailable('exam_attempts');
    if (isSupabaseAvailable) {
      try {
        const res = await supabase.from('exam_attempts').insert({
          student_id: params.studentId,
          register_number: params.registerNumber || params.studentId,
          exam_schedule_id: params.examScheduleId,
          score,
          passed,
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
        score,
        passed,
        timestamp: Date.now()
      });
      await writeLocalDb(db);
    } catch (e) {
      console.warn('Local DB write failed:', e);
    }
  }
};
