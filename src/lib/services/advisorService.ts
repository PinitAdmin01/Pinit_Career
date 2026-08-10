import fs from 'fs';
import path from 'path';
import { supabase } from '@/lib/supabaseClient';

const DB_PATH = path.join(process.cwd(), 'src/lib/data/advisor_db.json');

// Interface types
export interface AdvisorPerformance {
  attendance: number;
  cgpa: number;
  assignmentsCompleted: number;
  assignmentsPending: number;
  warningLevel: string;
}

// Read local JSON database
function readLocalDb(): any {
  try {
    if (!fs.existsSync(DB_PATH)) {
      return { performance: {} };
    }
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading local advisor database file:', err);
    return { performance: {} };
  }
}

// Write local JSON database
function writeLocalDb(data: any): void {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing local advisor database file:', err);
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

export const advisorService = {
  async getPerformance(studentId: string) {
    const isSupabaseAvailable = await checkSupabaseAvailable('advisor_performance');

    if (isSupabaseAvailable) {
      try {
        const { data: record } = await supabase.from('advisor_performance').select('*').eq('student_id', studentId).maybeSingle();
        if (record) {
          return {
            attendance: record.attendance,
            cgpa: Number(record.cgpa),
            assignmentsCompleted: record.assignments_completed,
            assignmentsPending: record.assignments_pending,
            warningLevel: record.warning_level
          };
        }
      } catch (err) {
        console.warn('Supabase read failed, falling back to local database:', err);
      }
    }

    // Local Database Fallback
    const db = readLocalDb();
    return db.performance;
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
            assignments_pending: pending
          }).eq('student_id', studentId);
          return { ok: true, completed, pending };
        }
      } catch (err) {
        console.warn('Supabase write failed, falling back to local database:', err);
      }
    }

    // Local Database Fallback
    const db = readLocalDb();
    db.performance.assignmentsCompleted += 1;
    db.performance.assignmentsPending = Math.max(0, db.performance.assignmentsPending - 1);
    writeLocalDb(db);
    return { ok: true, completed: db.performance.assignmentsCompleted, pending: db.performance.assignmentsPending };
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
            riskLevel: r.attendance < 50 ? 'High' : 'Medium'
          }))
        };
      } catch (err) {
        console.warn('Supabase read failed, falling back to local database:', err);
      }
    }

    // Local Fallback — no hard-coded student identities
    const db = readLocalDb();
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
        riskLevel: attendance < 75 ? 'High' : 'Medium'
      }]
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

    // Local Fallback
    const db = readLocalDb();
    db.performance.warningLevel = 'High';
    writeLocalDb(db);
    return { ok: true };
  }
};
