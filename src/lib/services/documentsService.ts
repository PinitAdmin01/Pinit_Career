import { supabase } from '@/lib/supabaseClient';
import { readLocalJson, writeLocalJson } from '@/lib/services/localJsonDb';

const DB_FILE = 'src/lib/data/documents_db.json';

// Interface types
export interface DocumentRequest {
  id: string;
  studentId: string;
  category: string;
  description: string;
  status: string;
  date: string;
}

// Read local JSON database
async function readLocalDb(): Promise<any> {
  return await readLocalJson(DB_FILE, { requests: [] });
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

    // Local Database Fallback
    return await readLocalDb();
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

    // Local Database Fallback
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
        return { ok: true, request: row, document: row };
      } catch (err) {
        console.warn('Supabase write failed, falling back to local database:', err);
      }
    }
    const db = await readLocalDb();
    db.requests = db.requests || [];
    db.requests.unshift(row);
    await writeLocalDb(db);
    return { ok: true, request: row, document: row };
  },
};
