import { supabase } from '@/lib/supabaseClient';
import { readLocalJson, writeLocalJson } from '@/lib/services/localJsonDb';

const DB_FILE = 'src/lib/data/communication_db.json';

// Interface types
export interface CommunicationLog {
  id: string;
  type: string;
  subject?: string;
  body: string;
  category?: string;
  date: string;
}

// Read local JSON database
async function readLocalDb(): Promise<any> {
  return await readLocalJson(DB_FILE, { logs: [] });
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

export const communicationService = {
  async logCommunication(type: string, subject: string | undefined, body: string, category?: string) {
    const isSupabaseAvailable = await checkSupabaseAvailable('communications_log');
    const id = `COM-${Math.floor(100 + Math.random() * 900)}`;

    if (isSupabaseAvailable) {
      try {
        await supabase.from('communications_log').insert({
          type,
          subject,
          body,
          category: category || 'General'
        });
        return { ok: true };
      } catch (err) {
        console.warn('Supabase write failed, falling back to local database:', err);
      }
    }

    // Local Database Fallback
    const db = await readLocalDb();
    db.logs.unshift({
      id,
      type,
      subject,
      body,
      category,
      date: new Date().toISOString().split('T')[0]
    });
    await writeLocalDb(db);
    return { ok: true };
  },

  async getAll() {
    const isSupabaseAvailable = await checkSupabaseAvailable('communications_log');
    if (isSupabaseAvailable) {
      try {
        const { data: logs } = await supabase.from('communications_log').select('*').order('created_at', { ascending: false });
        const rows = logs || [];
        return {
          announcements: rows.filter((r: any) => r.type === 'announcement').map((r: any) => ({
            id: r.id, title: r.subject, message: r.body, category: r.category, date: r.created_at,
          })),
          emails: rows.filter((r: any) => r.type === 'email').map((r: any) => ({
            id: r.id, subject: r.subject, body: r.body, sender: r.category, date: r.created_at,
          })),
          sms: rows.filter((r: any) => r.type === 'sms').map((r: any) => ({
            id: r.id, text: r.body, sender: r.category, date: r.created_at,
          })),
        };
      } catch (err) {
        console.warn('Supabase read failed, falling back to local database:', err);
      }
    }
    const db = await readLocalDb();
    const logs = db.logs || [];
    return {
      announcements: logs.filter((r: any) => r.type === 'announcement'),
      emails: logs.filter((r: any) => r.type === 'email'),
      sms: logs.filter((r: any) => r.type === 'sms'),
    };
  },
};
