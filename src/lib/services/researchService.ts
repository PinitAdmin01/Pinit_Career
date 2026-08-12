import { supabase } from '@/lib/supabaseClient';
import { readLocalJson, writeLocalJson } from '@/lib/services/localJsonDb';

const DB_FILE = 'src/lib/data/research_db.json';

// Interface types
export interface ResearchPaper {
  id: string;
  title: string;
  authors: string;
  journal: string;
  status: string;
}

export interface ResearchProject {
  id: string;
  title: string;
  pi: string;
  coPi: string;
  fundingAgency: string;
  duration: string;
  grantAmount: number;
  progress: number;
}

export interface ResearchPatent {
  id: string;
  title: string;
  inventors: string;
  fileNo: string;
  status: string;
  filedOn: string;
}

export interface ResearchFunding {
  id: string;
  title: string;
  pi: string;
  agency: string;
  amount: number;
  status: string;
}

// Read local JSON database
async function readLocalDb(): Promise<any> {
  return await readLocalJson(DB_FILE, { papers: [], projects: [], patents: [], funding: [] });
}

// Write local JSON database
async function writeLocalDb(data: any): Promise<void> {
  await writeLocalJson(DB_FILE, data);
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

export const researchService = {
  async getStats(studentId: string, studentName: string) {
    const isSupabaseAvailable = await checkSupabaseAvailable('research_papers');

    if (isSupabaseAvailable) {
      try {
        const { data: papers } = await supabase.from('research_papers').select('*');
        const { data: projects } = await supabase.from('research_projects').select('*');
        const { data: patents } = await supabase.from('research_patents').select('*');
        const { data: funding } = await supabase.from('research_funding').select('*');

        return {
          papers: (papers || []).map(p => ({ id: p.id, title: p.title, authors: p.authors, journal: p.journal, status: p.status })),
          projects: (projects || []).map(pr => ({ id: pr.id, title: pr.title, pi: pr.pi, coPi: pr.co_pi, fundingAgency: pr.funding_agency, duration: pr.duration, grantAmount: pr.grant_amount, progress: pr.progress })),
          patents: (patents || []).map(pat => ({ id: pat.id, title: pat.title, inventors: pat.inventors, fileNo: pat.file_no, status: pat.status, filedOn: pat.filed_on })),
          funding: (funding || []).map(f => ({ id: f.id, title: f.title, pi: f.pi, agency: f.agency, amount: f.amount, status: f.status }))
        };
      } catch (err) {
        console.warn('Supabase read failed, falling back to local database:', err);
      }
    }

    // Local Database Fallback
    const db = await readLocalDb();
    return {
      papers: db.papers || [],
      projects: db.projects || [],
      patents: db.patents || [],
      funding: db.funding || []
    };
  },

  async publishPaper(studentId: string, studentName: string, title: string, authors: string, journal: string, status: string) {
    if (!title?.trim() || !authors?.trim() || !journal?.trim()) {
      return { ok: false, error: 'All fields must be filled and cannot be empty.' };
    }

    const isSupabaseAvailable = await checkSupabaseAvailable('research_papers');

    if (isSupabaseAvailable) {
      try {
        await supabase.from('research_papers').insert({
          title,
          authors,
          journal,
          status
        });
        return { ok: true };
      } catch (err) {
        console.warn('Supabase write failed, falling back to local database:', err);
      }
    }

    // Local Database Fallback
    const db = await readLocalDb();
    db.papers.push({
      id: `PUB-${Math.floor(100 + Math.random() * 900)}`,
      title,
      authors,
      journal,
      status
    });
    await writeLocalDb(db);
    return { ok: true };
  },

  async updatePaperStatus(paperId: string, status: string) {
    const isSupabaseAvailable = await checkSupabaseAvailable('research_papers');

    if (isSupabaseAvailable) {
      try {
        await supabase.from('research_papers').update({ status }).eq('id', paperId);
        return { ok: true };
      } catch (err) {
        console.warn('Supabase write failed, falling back to local database:', err);
      }
    }

    // Local Fallback
    const db = await readLocalDb();
    const idx = db.papers.findIndex((p: any) => p.id === paperId);
    if (idx !== -1) {
      db.papers[idx].status = status;
      await writeLocalDb(db);
      return { ok: true };
    }
    return { ok: false };
  },

  async approveFunding(fundingId: string) {
    const isSupabaseAvailable = await checkSupabaseAvailable('research_funding');

    if (isSupabaseAvailable) {
      try {
        await supabase.from('research_funding').update({ status: 'Approved' }).eq('id', fundingId);
        return { ok: true };
      } catch (err) {
        console.warn('Supabase write failed, falling back to local database:', err);
      }
    }

    // Local Fallback
    const db = await readLocalDb();
    const idx = db.funding.findIndex((f: any) => f.id === fundingId);
    if (idx !== -1) {
      db.funding[idx].status = 'Approved';
      await writeLocalDb(db);
      return { ok: true };
    }
    return { ok: false };
  }
};
