import fs from 'fs';
import path from 'path';
import { supabase } from '@/lib/supabaseClient';

const DB_PATH = path.join(process.cwd(), 'src/lib/data/documents_db.json');

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
function readLocalDb(): any {
  try {
    if (!fs.existsSync(DB_PATH)) {
      return { requests: [] };
    }
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading local documents database file:', err);
    return { requests: [] };
  }
}

// Write local JSON database
function writeLocalDb(data: any): void {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing local documents database file:', err);
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
    return readLocalDb();
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
    const db = readLocalDb();
    const idx = db.requests.findIndex((r: any) => r.id === requestId);
    if (idx !== -1) {
      db.requests[idx].status = 'Approved';
      writeLocalDb(db);
      return { ok: true };
    }
    return { ok: false };
  }
};
