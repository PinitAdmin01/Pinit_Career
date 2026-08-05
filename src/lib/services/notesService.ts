import fs from 'fs';
import path from 'path';
import { supabase } from '@/lib/supabaseClient';

const DB_PATH = path.join(process.cwd(), 'src/lib/data/notes_db.json');

// Interface types
export interface StudyNote {
  id: string;
  title: string;
  subject: string;
  semester: string;
  batch: string;
  description?: string;
  fileName: string;
  fileSize: number;
  fileUrl?: string;
}

// Read local JSON database
function readLocalDb(): any {
  try {
    if (!fs.existsSync(DB_PATH)) {
      return { notes: [] };
    }
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading local study notes database file:', err);
    return { notes: [] };
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

export const notesService = {
  async getNotes(batch: string) {
    const isSupabaseAvailable = await checkSupabaseAvailable('study_notes');

    if (isSupabaseAvailable) {
      try {
        const { data: notes } = await supabase.from('study_notes').select('*');
        return {
          notes: (notes || []).map(n => ({
            id: n.id,
            title: n.title,
            subject: n.subject,
            semester: n.semester,
            batch: n.batch,
            description: n.description,
            fileName: n.file_name,
            fileSize: n.file_size,
            fileUrl: n.file_url
          }))
        };
      } catch (err) {
        console.warn('Supabase read failed, falling back to local database:', err);
      }
    }

    // Local Database Fallback
    const db = readLocalDb();
    return {
      notes: db.notes || []
    };
  }
};
