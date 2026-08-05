import fs from 'fs';
import path from 'path';
import { supabase } from '@/lib/supabaseClient';

const DB_PATH = path.join(process.cwd(), 'src/lib/data/communication_db.json');

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
function readLocalDb(): any {
  try {
    if (!fs.existsSync(DB_PATH)) {
      return { logs: [] };
    }
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading local communication database file:', err);
    return { logs: [] };
  }
}

// Write local JSON database
function writeLocalDb(data: any): void {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing local communication database file:', err);
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
    const db = readLocalDb();
    db.logs.unshift({
      id,
      type,
      subject,
      body,
      category,
      date: new Date().toISOString().split('T')[0]
    });
    writeLocalDb(db);
    return { ok: true };
  }
};
