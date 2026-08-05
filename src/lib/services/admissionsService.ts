import fs from 'fs';
import path from 'path';
import { supabase } from '@/lib/supabaseClient';

const DB_PATH = path.join(process.cwd(), 'src/lib/data/admissions_db.json');

// Interface types
export interface AdmissionsApplication {
  id: string;
  studentId: string;
  studentName: string;
  course: string;
  rank: number;
  status: string;
  docVerified: boolean;
}

export interface SeatMatrixItem {
  course: string;
  allocated: number;
  capacity: number;
}

// Read local JSON database
function readLocalDb(): any {
  try {
    if (!fs.existsSync(DB_PATH)) {
      return { applications: [], matrix: [] };
    }
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading local admissions database file:', err);
    return { applications: [], matrix: [] };
  }
}

// Write local JSON database
function writeLocalDb(data: any): void {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing local admissions database file:', err);
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

export const admissionsService = {
  async getApplications() {
    const isSupabaseAvailable = await checkSupabaseAvailable('admissions_applications');

    if (isSupabaseAvailable) {
      try {
        const { data: apps } = await supabase.from('admissions_applications').select('*');
        return {
          applications: (apps || []).map(a => ({
            id: a.id,
            studentId: a.student_id,
            studentName: a.student_name,
            course: a.course,
            rank: a.rank,
            status: a.status,
            docVerified: a.doc_verified
          }))
        };
      } catch (err) {
        console.warn('Supabase read failed, falling back to local database:', err);
      }
    }

    // Local Database Fallback
    const db = readLocalDb();
    return {
      applications: db.applications || []
    };
  },

  async getSeatMatrix() {
    const isSupabaseAvailable = await checkSupabaseAvailable('admissions_seat_matrix');

    if (isSupabaseAvailable) {
      try {
        const { data: matrix } = await supabase.from('admissions_seat_matrix').select('*');
        return {
          matrix: (matrix || []).map(m => ({
            course: m.course,
            allocated: m.allocated,
            capacity: m.capacity
          }))
        };
      } catch (err) {
        console.warn('Supabase read failed, falling back to local database:', err);
      }
    }

    // Local Database Fallback
    const db = readLocalDb();
    return {
      matrix: db.matrix || []
    };
  },

  async verifyDoc(appId: string, action: 'approve' | 'reject') {
    const isSupabaseAvailable = await checkSupabaseAvailable('admissions_applications');

    if (isSupabaseAvailable) {
      try {
        await supabase.from('admissions_applications').update({
          doc_verified: action === 'approve',
          status: action === 'approve' ? 'Documents Verified' : 'Rejected'
        }).eq('id', appId);
        return { ok: true };
      } catch (err) {
        console.warn('Supabase write failed, falling back to local database:', err);
      }
    }

    // Local Database Fallback
    const db = readLocalDb();
    const idx = db.applications.findIndex((a: any) => a.id === appId);
    if (idx !== -1) {
      db.applications[idx].docVerified = action === 'approve';
      db.applications[idx].status = action === 'approve' ? 'Documents Verified' : 'Rejected';
      writeLocalDb(db);
      return { ok: true };
    }
    return { ok: false };
  },

  async allocateSeats() {
    const isSupabaseAvailable = await checkSupabaseAvailable('admissions_applications');

    if (isSupabaseAvailable) {
      try {
        // Merit-based allocation from rank (lower rank number = better merit)
        const { data: apps } = await supabase.from('admissions_applications').select('*').eq('doc_verified', true).order('rank', { ascending: true });
        const { data: matrix } = await supabase.from('admissions_seat_matrix').select('*');

        const courseLimits: Record<string, { allocated: number; capacity: number }> = {};
        (matrix || []).forEach(m => {
          courseLimits[m.course] = { allocated: 0, capacity: m.capacity };
        });

        for (const app of (apps || [])) {
          const limit = courseLimits[app.course];
          if (limit && limit.allocated < limit.capacity) {
            limit.allocated++;
            await supabase.from('admissions_applications').update({ status: 'Seat Allocated' }).eq('id', app.id);
          } else {
            await supabase.from('admissions_applications').update({ status: 'Waiting List' }).eq('id', app.id);
          }
        }

        // Update seat matrix
        for (const course of Object.keys(courseLimits)) {
          await supabase.from('admissions_seat_matrix').update({ allocated: courseLimits[course].allocated }).eq('course', course);
        }

        return { ok: true };
      } catch (err) {
        console.warn('Supabase seat allocation failed, falling back to local database:', err);
      }
    }

    // Local Database Fallback
    const db = readLocalDb();
    const courseLimits: Record<string, { allocated: number; capacity: number }> = {};
    db.matrix.forEach((m: any) => {
      courseLimits[m.course] = { allocated: 0, capacity: m.capacity };
    });

    // Sort by rank ascending
    const verifiedApps = db.applications.filter((a: any) => a.docVerified).sort((a: any, b: any) => a.rank - b.rank);
    verifiedApps.forEach((app: any) => {
      const limit = courseLimits[app.course];
      if (limit && limit.allocated < limit.capacity) {
        limit.allocated++;
        app.status = 'Seat Allocated';
      } else {
        app.status = 'Waiting List';
      }
    });

    db.matrix.forEach((m: any) => {
      m.allocated = courseLimits[m.course].allocated;
    });

    writeLocalDb(db);
    return { ok: true };
  }
};
