import fs from 'fs';
import path from 'path';
import { supabase } from '@/lib/supabaseClient';

const DB_PATH = path.join(process.cwd(), 'src/lib/data/alumni_db.json');

// Interface types
export interface AlumniProfile {
  id: string;
  name: string;
  batch: string;
  company: string;
  designation: string;
  email: string;
}

export interface AlumniJob {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  postedBy: string;
  date: string;
}

// Read local JSON database
function readLocalDb(): any {
  try {
    if (!fs.existsSync(DB_PATH)) {
      return { alumni: [], jobs: [], donations: [], events: [], connects: [], referrals: [] };
    }
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading local alumni database file:', err);
    return { alumni: [], jobs: [], donations: [], events: [], connects: [], referrals: [] };
  }
}

// Write local JSON database
function writeLocalDb(data: any): void {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing local alumni database file:', err);
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

export const alumniService = {
  async getStats() {
    const isSupabaseAvailable = await checkSupabaseAvailable('alumni_registry');

    if (isSupabaseAvailable) {
      try {
        const { data: alumni } = await supabase.from('alumni_registry').select('*');
        const { data: jobs } = await supabase.from('alumni_jobs').select('*');

        const db = readLocalDb(); // Fetch local donations and events metrics

        return {
          alumni: (alumni || []).map(a => ({ id: a.id, name: a.name, batch: a.batch, company: a.company, designation: a.designation, email: a.email })),
          jobs: (jobs || []).map(j => ({ id: j.id, title: j.title, company: j.company, location: j.location, salary: j.salary, postedBy: j.posted_by, date: j.created_at?.split('T')[0] })),
          donations: db.donations || [],
          events: db.events || [],
          connects: db.connects || [],
          referrals: db.referrals || []
        };
      } catch (err) {
        console.warn('Supabase read failed, falling back to local database:', err);
      }
    }

    // Local Database Fallback
    return readLocalDb();
  },

  async addJob(title: string, company: string, location: string, salary: string, postedBy: string) {
    const isSupabaseAvailable = await checkSupabaseAvailable('alumni_jobs');
    const id = `JOB-${Math.floor(100 + Math.random() * 900)}`;

    if (isSupabaseAvailable) {
      try {
        await supabase.from('alumni_jobs').insert({ id, title, company, location, salary, posted_by: postedBy });
        return { ok: true };
      } catch (err) {
        console.warn('Supabase write failed, falling back to local database:', err);
      }
    }

    // Local Database Fallback
    const db = readLocalDb();
    db.jobs.unshift({
      id,
      title,
      company,
      location,
      salary,
      postedBy,
      date: new Date().toISOString().split('T')[0]
    });
    writeLocalDb(db);
    return { ok: true };
  }
};
