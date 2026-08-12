import { supabase } from '@/lib/supabaseClient';
import { tableExists as checkSupabaseAvailable } from '@/lib/services/supabaseTable';
import { readLocalJson, writeLocalJson } from '@/lib/services/localJsonDb';

const DB_FILE = 'src/lib/data/documents_db.json';

export interface DocumentRequest {
  id: string;
  studentId: string;
  category: string;
  description: string;
  status: string;
  date: string;
}

function mapRequestToDocument(r: DocumentRequest) {
  const issued = r.status === 'Approved' || r.status === 'issued' || r.status === 'Issued';
  return {
    id: r.id,
    type: r.category,
    purpose: r.description,
    status: issued ? 'Issued' as const : 'Pending Approval' as const,
    dateRequested: r.date,
    dateIssued: issued ? r.date : '',
    verificationCode: issued ? `V-${r.id.slice(-4)}` : '',
    major: '—',
    year: '—',
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

    if (isSupabaseAvailable) {
      try {
        const { data } = await supabase.from('document_requests').select('*').eq('student_id', studentId);
        requests = (data || []).map(r => ({
          id: r.id,
          studentId: r.student_id,
          category: r.category,
          description: r.description,
          status: r.status,
          date: r.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
        }));
      } catch (err) {
        console.warn('Supabase read failed, falling back to local database:', err);
      }
    }

    if (!requests.length) {
      const db = await readLocalDb();
      requests = (db.requests || []).filter((r: DocumentRequest) => r.studentId === studentId);
    }

    const documents = requests.map(mapRequestToDocument);
    return { documents, stats: summarizeDocuments(documents) };
  },

  async approveDoc(requestId: string) {
    const isSupabaseAvailable = await checkSupabaseAvailable('document_requests');

    if (isSupabaseAvailable) {
      try {
        await supabase.from('document_requests').update({ status: 'Approved' }).eq('id', requestId);
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

  async requestDoc(studentId: string, type: string, purpose: string) {
    const isSupabaseAvailable = await checkSupabaseAvailable('document_requests');
    const id = `DOC-${Date.now()}`;
    const row = {
      id,
      studentId,
      category: type || 'Bonafide',
      description: purpose || 'Verification',
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
    };
    if (isSupabaseAvailable) {
      try {
        await supabase.from('document_requests').insert({
          id,
          student_id: studentId,
          category: row.category,
          description: row.description,
          status: 'pending',
        });
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
    return { ok: true, request: row, document };
  },
};
