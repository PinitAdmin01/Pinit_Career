import fs from 'fs';
import path from 'path';
import { supabase } from '@/lib/supabaseClient';

const DB_PATH = path.join(process.cwd(), 'src/lib/data/exams_db.json');

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
function readLocalDb(): any {
  try {
    if (!fs.existsSync(DB_PATH)) {
      return { schedule: [], sheet: {} };
    }
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading local exams database file:', err);
    return { schedule: [], sheet: {} };
  }
}

// Write local JSON database
function writeLocalDb(data: any): void {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing local exams database file:', err);
  }
}

// Check if Supabase tables exist
async function checkSupabaseAvailable(tableName: string): Promise<boolean> {
  try {
    const { error } = await supabase.from(tableName).select('count', { count: 'exact', head: true });
    return !error;
  } catch {
    return false;
  }
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
    const db = readLocalDb();
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
    const db = readLocalDb();
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
          await supabase.from('exam_results').update({
            results: updatedResults,
            gpa: newGpa
          }).eq('student_id', studentId);

          return { ok: true, gpa: newGpa };
        }
      } catch (err) {
        console.warn('Supabase write failed, falling back to local database:', err);
      }
    }

    // Local Database Fallback
    const db = readLocalDb();
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
    writeLocalDb(db);
    return { ok: true, gpa: db.sheet.gpa };
  },

  async publishResults(studentId: string, isPublished: boolean) {
    const isSupabaseAvailable = await checkSupabaseAvailable('exam_results');

    if (isSupabaseAvailable) {
      try {
        await supabase.from('exam_results').update({
          is_published: isPublished
        }).eq('student_id', studentId);
        return { ok: true, isPublished };
      } catch (err) {
        console.warn('Supabase write failed, falling back to local database:', err);
      }
    }

    // Local Database Fallback
    const db = readLocalDb();
    db.sheet.isPublished = isPublished;
    writeLocalDb(db);
    return { ok: true, isPublished };
  }
};
