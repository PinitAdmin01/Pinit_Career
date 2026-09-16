import { supabase } from '@/lib/supabaseClient';
import { tableExists as checkSupabaseAvailable, getCampusSupabaseClient } from '@/lib/services/supabaseTable';
import { readLocalJson, writeLocalJson, StorageWriteResult } from '@/lib/services/localJsonDb';
import crypto from 'crypto';

const DB_FILE = 'src/lib/data/notes_db.json';

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
async function readLocalDb(): Promise<any> {
  return await readLocalJson(DB_FILE, { notes: [] });
}

// Write local JSON database
async function writeLocalDb(data: any): Promise<StorageWriteResult> {
  return await writeLocalJson(DB_FILE, data);
}

export const notesService = {
  async getNotes(batch?: string) {
    const isSupabaseAvailable = await checkSupabaseAvailable('study_notes');

    if (isSupabaseAvailable) {
      try {
        let query = supabase.from('study_notes').select('*');
        if (batch && batch.trim()) {
          query = query.eq('batch', batch.trim());
        }
        const { data: notes } = await query;
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
    const db = await readLocalDb();
    const allNotes = db.notes || [];
    const filtered = (batch && batch.trim())
      ? allNotes.filter((n: any) => n.batch === batch.trim())
      : allNotes;

    return {
      notes: filtered
    };
  },

  async uploadNote(title: string, subject: string, batch: string, author?: string, fileUrl?: string, semester: string = '1') {
    const isSupabaseAvailable = await checkSupabaseAvailable('study_notes');
    const noteId = `NOTE-${Date.now()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
    const newNote = {
      id: noteId,
      title,
      subject,
      semester,
      batch,
      description: author ? `Author: ${author}` : '',
      fileName: `${title.replace(/\s+/g, '_')}.pdf`,
      fileSize: 1024 * 1024,
      fileUrl: fileUrl || 'https://example.com/note.pdf'
    };

    if (isSupabaseAvailable) {
      try {
        const client = await getCampusSupabaseClient();
        const res = await client.from('study_notes').insert({
          id: noteId,
          title,
          subject,
          semester,
          batch,
          description: newNote.description,
          file_name: newNote.fileName,
          file_size: newNote.fileSize,
          file_url: newNote.fileUrl
        });
        if (res.error) throw new Error(res.error.message);
        return { ok: true, note: newNote, stored: 'db' };
      } catch (err) {
        console.warn('Supabase write failed, falling back to local database:', err);
      }
    }

    const db = await readLocalDb();
    db.notes = db.notes || [];
    db.notes.unshift(newNote);
    const writeRes = await writeLocalDb(db);
    return { ok: true, note: newNote, stored: writeRes.stored };
  }
};
