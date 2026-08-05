import fs from 'fs';
import path from 'path';
import { supabase } from '@/lib/supabaseClient';

const DB_PATH = path.join(process.cwd(), 'src/lib/data/hr_db.json');

// Interface types
export interface HrFaculty {
  id: string;
  name: string;
  dept: string;
  designation: string;
  salary: number;
  doj: string;
}

export interface HrLeave {
  id: string;
  facultyName: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: string;
}

export interface HrRecruitment {
  id: string;
  title: string;
  dept: string;
  status: string;
}

export interface HrAttendance {
  id: string;
  facultyName: string;
  status: string;
  date: string;
}

// Read local JSON database
function readLocalDb(): any {
  try {
    if (!fs.existsSync(DB_PATH)) {
      return { faculty: [], leaves: [], recruitment: [], attendance: [], payroll: {} };
    }
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading local hr database file:', err);
    return { faculty: [], leaves: [], recruitment: [], attendance: [], payroll: {} };
  }
}

// Write local JSON database
function writeLocalDb(data: any): void {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing local hr database file:', err);
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

export const hrService = {
  async getStats() {
    const isSupabaseAvailable = await checkSupabaseAvailable('hr_faculty');

    if (isSupabaseAvailable) {
      try {
        const { data: faculty } = await supabase.from('hr_faculty').select('*');
        const { data: leaves } = await supabase.from('hr_leaves').select('*');
        const { data: recruitment } = await supabase.from('hr_recruitment').select('*');
        const { data: attendance } = await supabase.from('hr_attendance').select('*');

        return {
          faculty: (faculty || []).map(f => ({ id: f.id, name: f.name, dept: f.dept, designation: f.designation, salary: f.salary, doj: f.doj })),
          leaves: (leaves || []).map(l => ({ id: l.id, facultyName: l.faculty_name, startDate: l.startDate, endDate: l.endDate, reason: l.reason, status: l.status })),
          recruitment: (recruitment || []).map(r => ({ id: r.id, title: r.title, dept: r.dept, status: r.status })),
          attendance: (attendance || []).map(a => ({ id: a.id, facultyName: a.faculty_name, status: a.status, date: a.date })),
          payroll: { status: 'Processing', runDate: null }
        };
      } catch (err) {
        console.warn('Supabase read failed, falling back to local database:', err);
      }
    }

    // Local Database Fallback
    return readLocalDb();
  },

  async approveLeave(leaveId: string) {
    const isSupabaseAvailable = await checkSupabaseAvailable('hr_leaves');

    if (isSupabaseAvailable) {
      try {
        await supabase.from('hr_leaves').update({ status: 'Approved' }).eq('id', leaveId);
        return { ok: true };
      } catch (err) {
        console.warn('Supabase write failed, falling back to local database:', err);
      }
    }

    // Local Database Fallback
    const db = readLocalDb();
    const idx = db.leaves.findIndex((l: any) => l.id === leaveId);
    if (idx !== -1) {
      db.leaves[idx].status = 'Approved';
      writeLocalDb(db);
      return { ok: true };
    }
    return { ok: false };
  },

  async createJob(title: string, dept: string) {
    const isSupabaseAvailable = await checkSupabaseAvailable('hr_recruitment');
    const id = `JOB-${Math.floor(100 + Math.random() * 900)}`;

    if (isSupabaseAvailable) {
      try {
        await supabase.from('hr_recruitment').insert({
          id,
          title,
          dept,
          status: 'Open'
        });
        return { ok: true };
      } catch (err) {
        console.warn('Supabase write failed, falling back to local database:', err);
      }
    }

    // Local Database Fallback
    const db = readLocalDb();
    db.recruitment.unshift({
      id,
      title,
      dept,
      status: 'Open'
    });
    writeLocalDb(db);
    return { ok: true };
  },

  async runPayroll() {
    const db = readLocalDb();
    db.payroll = {
      status: 'Paid',
      runDate: new Date().toISOString().split('T')[0]
    };
    writeLocalDb(db);
    return { ok: true };
  }
};
