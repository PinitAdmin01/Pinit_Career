import fs from 'fs';
import path from 'path';
import { supabase } from '@/lib/supabaseClient';

const DB_PATH = path.join(process.cwd(), 'src/lib/data/grievances_db.json');

// Interface types
export interface GrievanceTicket {
  id: string;
  reporterType: string;
  reporterName: string;
  category: string;
  title: string;
  description: string;
  anonymous: boolean;
  status: string;
  filedOn: string;
  resolution?: string;
  resolvedOn?: string;
}

// Read local JSON database
function readLocalDb(): any {
  try {
    if (!fs.existsSync(DB_PATH)) {
      return { grievances: [] };
    }
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading local grievances database file:', err);
    return { grievances: [] };
  }
}

// Write local JSON database
function writeLocalDb(data: any): void {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing local grievances database file:', err);
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

export const grievancesService = {
  async getStats(studentId: string, studentName: string) {
    const isSupabaseAvailable = await checkSupabaseAvailable('grievances_tickets');

    if (isSupabaseAvailable) {
      try {
        const { data: tickets } = await supabase.from('grievances_tickets').select('*');
        return {
          grievances: (tickets || []).map(t => ({
            id: t.id,
            reporterType: t.reporter_type,
            reporterName: t.reporter_name,
            category: t.category,
            title: t.title,
            description: t.description,
            anonymous: t.anonymous,
            status: t.status,
            filedOn: t.created_at,
            resolution: t.resolution,
            resolvedOn: t.resolved_at
          }))
        };
      } catch (err) {
        console.warn('Supabase read failed, falling back to local database:', err);
      }
    }

    // Local Database Fallback
    const db = readLocalDb();
    return {
      grievances: db.grievances || []
    };
  },

  async submit(studentId: string, studentName: string, reporterType: string, category: string, title: string, description: string, anonymous: boolean) {
    const isSupabaseAvailable = await checkSupabaseAvailable('grievances_tickets');

    if (isSupabaseAvailable) {
      try {
        await supabase.from('grievances_tickets').insert({
          reporter_id: studentId,
          reporter_name: studentName,
          reporter_type: reporterType,
          category,
          title,
          description,
          anonymous,
          status: 'Pending'
        });
        return { ok: true };
      } catch (err) {
        console.warn('Supabase write failed, falling back to local database:', err);
      }
    }

    // Local Database Fallback
    const db = readLocalDb();
    db.grievances.unshift({
      id: `GRV-${Math.floor(100 + Math.random() * 900)}`,
      reporterType,
      reporterName: anonymous ? 'Anonymous' : studentName,
      category,
      title,
      description,
      anonymous,
      status: 'Pending',
      filedOn: new Date().toISOString()
    });
    writeLocalDb(db);
    return { ok: true };
  },

  async investigate(ticketId: string) {
    const isSupabaseAvailable = await checkSupabaseAvailable('grievances_tickets');

    if (isSupabaseAvailable) {
      try {
        await supabase.from('grievances_tickets').update({ status: 'Under Investigation' }).eq('id', ticketId);
        return { ok: true };
      } catch (err) {
        console.warn('Supabase write failed, falling back to local database:', err);
      }
    }

    // Local Database Fallback
    const db = readLocalDb();
    const idx = db.grievances.findIndex((g: any) => g.id === ticketId);
    if (idx !== -1) {
      db.grievances[idx].status = 'Under Investigation';
      writeLocalDb(db);
      return { ok: true };
    }
    return { ok: false };
  },

  async resolve(ticketId: string, resolution: string) {
    const isSupabaseAvailable = await checkSupabaseAvailable('grievances_tickets');

    if (isSupabaseAvailable) {
      try {
        await supabase.from('grievances_tickets').update({
          status: 'Resolved',
          resolution,
          resolved_at: new Date().toISOString()
        }).eq('id', ticketId);
        return { ok: true };
      } catch (err) {
        console.warn('Supabase write failed, falling back to local database:', err);
      }
    }

    // Local Database Fallback
    const db = readLocalDb();
    const idx = db.grievances.findIndex((g: any) => g.id === ticketId);
    if (idx !== -1) {
      db.grievances[idx].status = 'Resolved';
      db.grievances[idx].resolution = resolution;
      db.grievances[idx].resolvedOn = new Date().toISOString();
      writeLocalDb(db);
      return { ok: true };
    }
    return { ok: false };
  }
};
