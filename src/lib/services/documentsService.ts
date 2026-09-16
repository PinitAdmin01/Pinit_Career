import { supabase } from '@/lib/supabaseClient';
import { tableExists as checkSupabaseAvailable } from '@/lib/services/supabaseTable';
import { readLocalJson, writeLocalJson } from '@/lib/services/localJsonDb';

import crypto from 'crypto';

const DB_FILE = 'src/lib/data/documents_db.json';

export interface DocumentRequest {
  id: string;
  studentId: string;
  category: string;
  description: string;
  status: string;
  date: string;
  major?: string;
  year?: string;
  verificationCode?: string;
}

function generateVerificationCode(id: string, studentId: string): string {
  const hash = crypto.createHash('sha256').update(`${id}:${studentId}`).digest('hex').slice(0, 10).toUpperCase();
  return `DOC-VER-${hash}`;
}

function mapRequestToDocument(r: DocumentRequest, studentInfo?: { major?: string; year?: string }) {
  const issued = r.status === 'Approved' || r.status === 'issued' || r.status === 'Issued';
  const major = r.major || studentInfo?.major || 'Computer Science & Engineering';
  const year = r.year || studentInfo?.year || 'Class of 2026';
  return {
    id: r.id,
    type: r.category,
    purpose: r.description,
    status: issued ? 'Issued' as const : 'Pending Approval' as const,
    dateRequested: r.date,
    dateIssued: issued ? r.date : '',
    verificationCode: r.verificationCode || generateVerificationCode(r.id, r.studentId),
    major,
    year,
  };
}

function summarizeDocuments(documents: ReturnType<typeof mapRequestToDocument>[]) {
  return {
    totalIssued: documents.filter((d) => d.status === 'Issued').length,
    pendingApprovals: documents.filter((d) => d.status === 'Pending Approval').length,
    totalRequests: documents.length,
  };
}

async function readLocalDb(): Promise<any> {
  return await readLocalJson(DB_FILE, { requests: [] });
}

async function writeLocalDb(data: any): Promise<void> {
  await writeLocalJson(DB_FILE, data);
}

export const documentsService = {
  async getStats() {
    const isSupabaseAvailable = await checkSupabaseAvailable('document_requests');

    if (isSupabaseAvailable) {
      try {
        const { data: requests } = await supabase.from('document_requests').select('*');
        return {
          requests: (requests || []).map(r => ({
            id: r.id,
            studentId: r.student_id,
            category: r.category,
            description: r.description,
            status: r.status,
            date: r.created_at?.split('T')[0]
          }))
        };
      } catch (err) {
        console.warn('Supabase read failed, falling back to local database:', err);
      }
    }

    return await readLocalDb();
  },

  async getStudentDocuments(studentId: string) {
    const isSupabaseAvailable = await checkSupabaseAvailable('document_requests');
    let requests: DocumentRequest[] = [];
    let studentInfo = { major: 'Computer Science & Engineering', year: 'Class of 2026' };

    if (isSupabaseAvailable) {
      try {
        const { data: user } = await supabase.from('users').select('department, branch, batch_year, semester').eq('id', studentId).maybeSingle();
        if (user) {
          studentInfo = {
            major: user.department || user.branch || 'Computer Science & Engineering',
            year: user.batch_year ? `Batch of ${user.batch_year}` : (user.semester ? `Semester ${user.semester}` : 'Class of 2026')
          };
        }
      } catch {}

      try {
        const { data } = await supabase.from('document_requests').select('*').eq('student_id', studentId);
        requests = (data || []).map(r => ({
          id: r.id,
          studentId: r.student_id,
          category: r.category,
          description: r.description,
          status: r.status,
          date: r.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
          major: r.major,
          year: r.year,
          verificationCode: r.verification_code
        }));
      } catch (err) {
        console.warn('Supabase read failed, falling back to local database:', err);
      }
    }

    if (!requests.length) {
      const db = await readLocalDb();
      requests = (db.requests || []).filter((r: DocumentRequest) => r.studentId === studentId);
    }

    const documents = requests.map(r => mapRequestToDocument(r, studentInfo));
    return { documents, stats: summarizeDocuments(documents) };
  },

  async approveDoc(requestId: string) {
    const isSupabaseAvailable = await checkSupabaseAvailable('document_requests');

    if (isSupabaseAvailable) {
      try {
        const res = await supabase.from('document_requests').update({ status: 'Approved' }).eq('id', requestId);
        if (res.error) throw new Error(res.error.message);
        return { ok: true };
      } catch (err) {
        console.warn('Supabase write failed, falling back to local database:', err);
      }
    }

    const db = await readLocalDb();
    const idx = db.requests.findIndex((r: any) => r.id === requestId);
    if (idx !== -1) {
      db.requests[idx].status = 'Approved';
      await writeLocalDb(db);
      return { ok: true };
    }
    return { ok: false };
  },

  async requestDoc(studentId: string, type: string, purpose: string, major?: string, year?: string) {
    const isSupabaseAvailable = await checkSupabaseAvailable('document_requests');
    const id = `DOC-${Date.now()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
    const studentMajor = major || 'Computer Science & Engineering';
    const studentYear = year || 'Class of 2026';
    const row: DocumentRequest = {
      id,
      studentId,
      category: type || 'Bonafide Certificate',
      description: purpose || 'Verification',
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
      major: studentMajor,
      year: studentYear
    };
    if (isSupabaseAvailable) {
      try {
        const res = await supabase.from('document_requests').insert({
          id,
          student_id: studentId,
          category: row.category,
          description: row.description,
          status: 'pending',
        });
        if (res.error) throw new Error(res.error.message);
        const document = mapRequestToDocument(row);
        return { ok: true, request: row, document };
      } catch (err) {
        console.warn('Supabase write failed, falling back to local database:', err);
      }
    }
    const db = await readLocalDb();
    db.requests = db.requests || [];
    db.requests.unshift(row);
    await writeLocalDb(db);
    const document = mapRequestToDocument(row);
    return { ok: true, request: row, document, doc: document };
  },

  async requestDocument(studentId: string, type: string, purpose: string, major?: string, year?: string) {
    return this.requestDoc(studentId, type, purpose, major, year);
  },
};
