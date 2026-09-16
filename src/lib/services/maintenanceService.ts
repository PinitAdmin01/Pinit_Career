import { supabase } from '@/lib/supabaseClient';
import { tableExists as checkSupabaseAvailable } from '@/lib/services/supabaseTable';
import { readLocalJson, writeLocalJson } from '@/lib/services/localJsonDb';
import crypto from 'crypto';

const DB_FILE = 'src/lib/data/maintenance_db.json';

// Interface types
export interface InfrastructureTicket {
  id: string;
  studentId?: string;
  reportedBy?: string;
  category: string;
  location: string;
  description: string;
  status: string;
  date: string;
  technician: string;
  urgency?: 'Emergency' | 'High' | 'Normal' | 'Low';
}

// Read local JSON database
async function readLocalDb(): Promise<any> {
  return await readLocalJson(DB_FILE, { tickets: [] });
}

// Write local JSON database
async function writeLocalDb(data: any): Promise<void> {
  await writeLocalJson(DB_FILE, data);
}

export const maintenanceService = {
  async getTickets() {
    const isSupabaseAvailable = await checkSupabaseAvailable('infrastructure_tickets');

    if (isSupabaseAvailable) {
      try {
        const { data: tickets } = await supabase.from('infrastructure_tickets').select('*');
        return {
          tickets: (tickets || []).map(t => {
            const urgency = t.urgency || (t.description?.includes('[EMERGENCY]') ? 'Emergency' : t.description?.includes('[HIGH]') ? 'High' : 'Normal');
            return {
              id: t.ticket_code || t.id,
              studentId: t.student_id || t.studentId || '',
              reportedBy: t.reported_by || t.reportedBy || '',
              category: t.category,
              location: t.location,
              description: t.description,
              status: t.status,
              date: t.created_at?.split('T')[0] || t.date,
              technician: t.technician || '',
              urgency
            };
          })
        };
      } catch (err) {
        console.warn('Supabase read failed, falling back to local database:', err);
      }
    }

    // Local Database Fallback
    const db = await readLocalDb();
    return {
      tickets: (db.tickets || []).map((t: any) => ({
        ...t,
        studentId: t.studentId || t.student_id || '',
        reportedBy: t.reportedBy || t.reported_by || '',
        urgency: t.urgency || (t.description?.includes('[EMERGENCY]') ? 'Emergency' : 'Normal')
      }))
    };
  },

  async reportTicket(
    arg1: string,
    arg2: string,
    arg3?: string,
    arg4?: string,
    arg5?: string,
    arg6: 'Emergency' | 'High' | 'Normal' | 'Low' = 'Normal'
  ) {
    let studentId = '';
    let reportedBy = '';
    let category = '';
    let location = '';
    let description = '';
    let urgency: 'Emergency' | 'High' | 'Normal' | 'Low' = 'Normal';

    if (arg5 !== undefined) {
      // Called with student identity: reportTicket(studentId, reportedBy, category, location, description, urgency)
      studentId = arg1 || '';
      reportedBy = arg2 || '';
      category = arg3 || '';
      location = arg4 || '';
      description = arg5 || '';
      urgency = (arg6 as any) || 'Normal';
    } else {
      // Called with legacy signature: reportTicket(category, location, description, urgency)
      category = arg1 || '';
      location = arg2 || '';
      description = arg3 || '';
      urgency = (arg4 as any) || 'Normal';
    }

    const isSupabaseAvailable = await checkSupabaseAvailable('infrastructure_tickets');
    const ticketCode = `INF-${Date.now()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
    const taggedDesc = urgency === 'Emergency' && !description.includes('[EMERGENCY]') ? `[EMERGENCY] ${description}` : urgency === 'High' && !description.includes('[HIGH]') ? `[HIGH] ${description}` : description;

    if (isSupabaseAvailable) {
      try {
        const payload: Record<string, any> = {
          ticket_code: ticketCode,
          student_id: studentId,
          reported_by: reportedBy,
          category,
          location,
          description: taggedDesc,
          status: 'Reported',
          urgency
        };
        const res = await supabase.from('infrastructure_tickets').insert(payload);
        if (res.error) {
          // Schema tolerance: retry without student_id / reported_by / urgency if columns missing in remote DB
          const retryRes = await supabase.from('infrastructure_tickets').insert({
            ticket_code: ticketCode,
            category,
            location,
            description: taggedDesc,
            status: 'Reported'
          });
          if (retryRes.error) throw new Error(retryRes.error.message);
        }
        return {
          ok: true,
          ticket: {
            id: ticketCode,
            studentId,
            reportedBy,
            category,
            location,
            description: taggedDesc,
            status: 'Reported',
            date: new Date().toISOString().split('T')[0],
            technician: '',
            urgency
          }
        };
      } catch (err) {
        console.warn('Supabase write failed, falling back to local database:', err);
      }
    }

    // Local Database Fallback
    const db = await readLocalDb();
    const newTicket: InfrastructureTicket = {
      id: ticketCode,
      studentId,
      reportedBy,
      category,
      location,
      description: taggedDesc,
      status: 'Reported',
      date: new Date().toISOString().split('T')[0],
      technician: '',
      urgency
    };
    db.tickets.unshift(newTicket);
    await writeLocalDb(db);
    return { ok: true, ticket: newTicket };
  },

  async scheduleTicket(ticketId: string, technician: string) {
    const isSupabaseAvailable = await checkSupabaseAvailable('infrastructure_tickets');

    if (isSupabaseAvailable) {
      try {
        const res = await supabase.from('infrastructure_tickets').update({
          status: 'Scheduled',
          technician
        }).eq('ticket_code', ticketId);
        if (res.error) throw new Error(res.error.message);
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
        const res = await supabase.from('infrastructure_tickets').update({
          status: 'In Progress'
        }).eq('ticket_code', ticketId);
        if (res.error) throw new Error(res.error.message);
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
        const res = await supabase.from('infrastructure_tickets').update({
          status: 'Resolved'
        }).eq('ticket_code', ticketId);
        if (res.error) throw new Error(res.error.message);
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
