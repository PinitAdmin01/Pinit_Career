import { supabase } from '@/lib/supabaseClient';
import { readLocalJson, writeLocalJson } from '@/lib/services/localJsonDb';

const DB_FILE = 'src/lib/data/maintenance_db.json';

// Interface types
export interface InfrastructureTicket {
  id: string;
  category: string;
  location: string;
  description: string;
  status: string;
  date: string;
  technician: string;
}

// Read local JSON database
async function readLocalDb(): Promise<any> {
  return await readLocalJson(DB_FILE, { tickets: [] });
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

export const maintenanceService = {
  async getTickets() {
    const isSupabaseAvailable = await checkSupabaseAvailable('infrastructure_tickets');

    if (isSupabaseAvailable) {
      try {
        const { data: tickets } = await supabase.from('infrastructure_tickets').select('*');
        return {
          tickets: (tickets || []).map(t => ({
            id: t.ticket_code,
            category: t.category,
            location: t.location,
            description: t.description,
            status: t.status,
            date: t.created_at?.split('T')[0],
            technician: t.technician || ''
          }))
        };
      } catch (err) {
        console.warn('Supabase read failed, falling back to local database:', err);
      }
    }

    // Local Database Fallback
    const db = await readLocalDb();
    return {
      tickets: db.tickets || []
    };
  },

  async reportTicket(category: string, location: string, description: string) {
    const isSupabaseAvailable = await checkSupabaseAvailable('infrastructure_tickets');
    const ticketCode = 'INF-' + Math.floor(100 + Math.random() * 900);

    if (isSupabaseAvailable) {
      try {
        await supabase.from('infrastructure_tickets').insert({
          ticket_code: ticketCode,
          category,
          location,
          description,
          status: 'Reported'
        });
        return { ok: true, ticket: { id: ticketCode, category, location, description, status: 'Reported', date: new Date().toISOString().split('T')[0], technician: '' } };
      } catch (err) {
        console.warn('Supabase write failed, falling back to local database:', err);
      }
    }

    // Local Database Fallback
    const db = await readLocalDb();
    const newTicket = {
      id: ticketCode,
      category,
      location,
      description,
      status: 'Reported',
      date: new Date().toISOString().split('T')[0],
      technician: ''
    };
    db.tickets.unshift(newTicket);
    await writeLocalDb(db);
    return { ok: true, ticket: newTicket };
  },

  async scheduleTicket(ticketId: string, technician: string) {
    const isSupabaseAvailable = await checkSupabaseAvailable('infrastructure_tickets');

    if (isSupabaseAvailable) {
      try {
        await supabase.from('infrastructure_tickets').update({
          status: 'Scheduled',
          technician
        }).eq('ticket_code', ticketId);
        return { ok: true };
      } catch (err) {
        console.warn('Supabase write failed, falling back to local database:', err);
      }
    }

    // Local Database Fallback
    const db = await readLocalDb();
    const idx = db.tickets.findIndex((t: any) => t.id === ticketId);
    if (idx !== -1) {
      db.tickets[idx].status = 'Scheduled';
      db.tickets[idx].technician = technician;
      await writeLocalDb(db);
      return { ok: true };
    }
    return { ok: false };
  },

  async startTicket(ticketId: string) {
    const isSupabaseAvailable = await checkSupabaseAvailable('infrastructure_tickets');

    if (isSupabaseAvailable) {
      try {
        await supabase.from('infrastructure_tickets').update({
          status: 'In Progress'
        }).eq('ticket_code', ticketId);
        return { ok: true };
      } catch (err) {
        console.warn('Supabase write failed, falling back to local database:', err);
      }
    }

    // Local Database Fallback
    const db = await readLocalDb();
    const idx = db.tickets.findIndex((t: any) => t.id === ticketId);
    if (idx !== -1) {
      db.tickets[idx].status = 'In Progress';
      await writeLocalDb(db);
      return { ok: true };
    }
    return { ok: false };
  },

  async resolveTicket(ticketId: string) {
    const isSupabaseAvailable = await checkSupabaseAvailable('infrastructure_tickets');

    if (isSupabaseAvailable) {
      try {
        await supabase.from('infrastructure_tickets').update({
          status: 'Resolved'
        }).eq('ticket_code', ticketId);
        return { ok: true };
      } catch (err) {
        console.warn('Supabase write failed, falling back to local database:', err);
      }
    }

    // Local Database Fallback
    const db = await readLocalDb();
    const idx = db.tickets.findIndex((t: any) => t.id === ticketId);
    if (idx !== -1) {
      db.tickets[idx].status = 'Resolved';
      await writeLocalDb(db);
      return { ok: true };
    }
    return { ok: false };
  }
};
