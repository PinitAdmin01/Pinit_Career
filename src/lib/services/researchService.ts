import { supabase } from '@/lib/supabaseClient';
import { tableExists as checkSupabaseAvailable } from '@/lib/services/supabaseTable';
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

export const researchService = {
  async getStats(studentId: string, studentName: string) {
    const isSupabaseAvailable = await checkSupabaseAvailable('research_papers');

    if (isSupabaseAvailable) {
      try {
        const { data: papers } = await supabase.from('research_papers').select('*');
        const { data: projects } = await supabase.from('research_projects').select('*');
        const { data: patents } = await supabase.from('research_patents').select('*');
        const { data: funding } = await supabase.from('research_funding').select('*');

        // Visible papers: All verified 'Published' papers PLUS student's own submissions
        const visiblePapers = (papers || []).filter(p =>
          p.status === 'Published' || (studentId && p.student_id === studentId)
        );

        return {
          papers: visiblePapers.map(p => ({
            id: p.id,
            title: p.title,
            authors: p.authors,
            journal: p.journal,
            status: p.status,
            studentId: p.student_id
          })),
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
    const visiblePapers = (db.papers || []).filter((p: any) =>
      p.status === 'Published' || (studentId && (p.studentId === studentId || p.student_id === studentId))
    );

    return {
      papers: visiblePapers,
      projects: db.projects || [],
      patents: db.patents || [],
      funding: db.funding || []
    };
  },

  async publishPaper(studentId: string, studentName: string, title: string, authors: string, journal: string, _status?: string) {
    if (!title?.trim() || !authors?.trim() || !journal?.trim()) {
      return { ok: false, error: 'All fields must be filled and cannot be empty.' };
    }

    // Default status for newly submitted student papers is 'Under Review' - never allow student to self-assign 'Published'
    const status = 'Under Review';
    const isSupabaseAvailable = await checkSupabaseAvailable('research_papers');
    const id = `PUB-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;

    if (isSupabaseAvailable) {
      try {
        const payload: Record<string, any> = {
          id,
          title: title.trim(),
          authors: authors.trim(),
          journal: journal.trim(),
          status,
          student_id: studentId,
          submitted_by: studentName
        };
        const res = await supabase.from('research_papers').insert(payload);
        if (res.error) {
          // Schema tolerance: if column student_id does not exist, retry without student_id
          const retryRes = await supabase.from('research_papers').insert({
            title: title.trim(),
            authors: authors.trim(),
            journal: journal.trim(),
            status
          });
          if (retryRes.error) throw new Error(retryRes.error.message);
        }
        const paperObj = { id, studentId, studentName, title: title.trim(), authors: authors.trim(), journal: journal.trim(), status };
        return { ok: true, id, status, paper: paperObj };
      } catch (err) {
        console.warn('Supabase write failed, falling back to local database:', err);
      }
    }

    // Local Database Fallback
    const db = await readLocalDb();
    const paperObj = {
      id,
      studentId,
      student_id: studentId,
      submittedBy: studentName,
      title: title.trim(),
      authors: authors.trim(),
      journal: journal.trim(),
      status
    };
    db.papers.push(paperObj);
    await writeLocalDb(db);
    return { ok: true, id, status, paper: paperObj };
  },

  async updatePaperStatus(paperId: string, status: string) {
    const isSupabaseAvailable = await checkSupabaseAvailable('research_papers');

    if (isSupabaseAvailable) {
      try {
        const res = await supabase.from('research_papers').update({ status }).eq('id', paperId);
        if (res.error) throw new Error(res.error.message);
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
        const res = await supabase.from('research_funding').update({ status: 'Approved' }).eq('id', fundingId);
        if (res.error) throw new Error(res.error.message);
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
