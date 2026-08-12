import { supabase } from '@/lib/supabaseClient';
import { tableExists as checkSupabaseAvailable } from '@/lib/services/supabaseTable';
import { readLocalJson, writeLocalJson } from '@/lib/services/localJsonDb';

const DB_FILE = 'src/lib/data/alumni_db.json';

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
async function readLocalDb(): Promise<any> {
  const db = await readLocalJson(DB_FILE, { alumni: [], jobs: [], donations: [], events: [], connects: [], referrals: [] });
  return {
    alumni: db.alumni || [],
    jobs: db.jobs || [],
    donations: db.donations || [],
    events: db.events || [],
    connects: db.connects || [],
    referrals: db.referrals || [],
  };
}

// Write local JSON database
async function writeLocalDb(data: any): Promise<void> {
  await writeLocalJson(DB_FILE, data);
}

export const alumniService = {
  async getStats() {
    const isSupabaseAvailable = await checkSupabaseAvailable('alumni_registry');

    if (isSupabaseAvailable) {
      try {
        const { data: alumni } = await supabase.from('alumni_registry').select('*');
        const { data: jobs } = await supabase.from('alumni_jobs').select('*');

        const db = await readLocalDb(); // Fetch local donations and events metrics

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
    return await readLocalDb();
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
    const db = await readLocalDb();
    db.jobs.unshift({
      id,
      title,
      company,
      location,
      salary,
      postedBy,
      date: new Date().toISOString().split('T')[0]
    });
    await writeLocalDb(db);
    return { ok: true };
  },

  async requestMentorship(mentorName: string, studentName: string, slot: string) {
    const isSupabaseAvailable = await checkSupabaseAvailable('alumni_connects');
    const id = `CON-${Date.now()}`;
    const row = { id, mentorName, studentName, slot, status: 'Requested', date: new Date().toISOString().split('T')[0] };
    if (isSupabaseAvailable) {
      try {
        await supabase.from('alumni_connects').insert({
          id, mentor_name: mentorName, student_name: studentName, slot, status: 'Requested',
        });
        return { ok: true, connect: row };
      } catch (err) {
        console.warn('Supabase write failed, falling back to local database:', err);
      }
    }
    const db = await readLocalDb();
    db.connects = db.connects || [];
    db.connects.unshift(row);
    await writeLocalDb(db);
    return { ok: true, connect: row };
  },

  async requestReferral(jobId: string, studentName: string) {
    const isSupabaseAvailable = await checkSupabaseAvailable('alumni_referrals');
    const id = `REF-${Date.now()}`;
    const row = { id, jobId, studentName, status: 'Requested', date: new Date().toISOString().split('T')[0] };
    if (isSupabaseAvailable) {
      try {
        await supabase.from('alumni_referrals').insert({
          id, job_id: jobId, student_name: studentName, status: 'Requested',
        });
        return { ok: true, referral: row };
      } catch (err) {
        console.warn('Supabase write failed, falling back to local database:', err);
      }
    }
    const db = await readLocalDb();
    db.referrals = db.referrals || [];
    db.referrals.unshift(row);
    await writeLocalDb(db);
    return { ok: true, referral: row };
  },

  async donate(campaignId: string, amount: number, contributorName: string) {
    const db = await readLocalDb();
    db.donations = db.donations || [];
    const idx = db.donations.findIndex((d: any) => d.id === campaignId);
    const gift = Number(amount) || 0;
    if (idx === -1) {
      db.donations.push({
        id: campaignId || `DON-${Date.now()}`,
        raised: gift,
        contributors: 1,
        lastContributor: contributorName,
      });
    } else {
      db.donations[idx].raised = (Number(db.donations[idx].raised) || 0) + gift;
      db.donations[idx].contributors = (Number(db.donations[idx].contributors) || 0) + 1;
      db.donations[idx].lastContributor = contributorName;
    }
    await writeLocalDb(db);
    return { ok: true };
  },
};
