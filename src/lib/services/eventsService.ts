import { supabase } from '@/lib/supabaseClient';
import { readLocalJson, writeLocalJson } from '@/lib/services/localJsonDb';

const DB_FILE = 'src/lib/data/events_db.json';

// Interface types
export interface CampusEvent {
  id: string;
  category: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  capacity: number;
  rsvpCount: number;
  host: string;
  completed: boolean;
}

export interface EventRSVP {
  eventId: string;
  studentName: string;
  hasCertificate: boolean;
  certificateCode?: string;
}

// Read local JSON database
async function readLocalDb(): Promise<any> {
  return await readLocalJson(DB_FILE, { catalog: [], rsvps: [] });
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

export const eventsService = {
  async getStats(studentId: string, studentName: string) {
    const isSupabaseAvailable = await checkSupabaseAvailable('events_catalog');

    if (isSupabaseAvailable) {
      try {
        const { data: catalog } = await supabase.from('events_catalog').select('*');
        const { data: rsvps } = await supabase.from('events_rsvps').select('*').eq('student_id', studentId);

        return {
          catalog: (catalog || []).map(e => ({
            id: e.id,
            category: e.category,
            title: e.title,
            description: e.description,
            date: e.date,
            time: e.time,
            venue: e.venue,
            capacity: e.capacity,
            rsvpCount: e.rsvp_count,
            host: e.host,
            completed: e.completed
          })),
          rsvps: (rsvps || []).map(r => ({
            eventId: r.event_id,
            studentName: r.student_name,
            hasCertificate: r.has_certificate,
            certificateCode: r.certificate_code
          }))
        };
      } catch (err) {
        console.warn('Supabase read failed, falling back to local database:', err);
      }
    }

    // Local Database Fallback — only return RSVPs for the authenticated student
    const db = await readLocalDb();
    const myRsvps = db.rsvps?.filter((r: any) => r.studentName === studentName) || [];

    return {
      catalog: db.catalog || [],
      rsvps: myRsvps
    };
  },

  async rsvp(studentId: string, studentName: string, eventId: string) {
    const isSupabaseAvailable = await checkSupabaseAvailable('events_rsvps');

    if (isSupabaseAvailable) {
      try {
        // Increment rsvp_count
        const { data: evt } = await supabase.from('events_catalog').select('rsvp_count, capacity').eq('id', eventId).single();
        if (evt && evt.rsvp_count < evt.capacity) {
          await supabase.from('events_catalog').update({ rsvp_count: evt.rsvp_count + 1 }).eq('id', eventId);
          await supabase.from('events_rsvps').insert({
            event_id: eventId,
            student_id: studentId,
            student_name: studentName,
            has_certificate: false
          });
          return { ok: true };
        }
        return { ok: false, error: 'Event is full!' };
      } catch (err: any) {
        console.warn('Supabase write failed, falling back to local database:', err);
      }
    }

    // Local Database Fallback
    const db = await readLocalDb();
    const evt = db.catalog.find((e: any) => e.id === eventId);
    if (evt && evt.rsvpCount < evt.capacity) {
      evt.rsvpCount += 1;
      db.rsvps.push({
        eventId,
        studentName,
        hasCertificate: false
      });
      await writeLocalDb(db);
      return { ok: true };
    }
    return { ok: false, error: 'Event is full!' };
  },

  async publish(category: string, title: string, description: string, date: string, time: string, venue: string, capacity: number, host: string) {
    const isSupabaseAvailable = await checkSupabaseAvailable('events_catalog');
    const id = `EVT-${Math.floor(100 + Math.random() * 900)}`;

    if (isSupabaseAvailable) {
      try {
        await supabase.from('events_catalog').insert({ id, category, title, description, date, time, venue, capacity, rsvp_count: 0, host, completed: false });
        return { ok: true };
      } catch (err) {
        console.warn('Supabase write failed, falling back to local database:', err);
      }
    }

    // Local Fallback
    const db = await readLocalDb();
    db.catalog.unshift({ id, category, title, description, date, time, venue, capacity: Number(capacity), rsvpCount: 0, host, completed: false });
    await writeLocalDb(db);
    return { ok: true };
  },

  async issueCert(rsvpId: string) {
    const isSupabaseAvailable = await checkSupabaseAvailable('events_rsvps');
    const certCode = `CERT-${Math.floor(1000 + Math.random() * 9000)}`;

    if (isSupabaseAvailable) {
      try {
        await supabase.from('events_rsvps').update({ has_certificate: true, certificate_code: certCode }).eq('id', rsvpId);
        return { ok: true };
      } catch (err) {
        console.warn('Supabase write failed, falling back to local database:', err);
      }
    }

    // Local Fallback
    const db = await readLocalDb();
    const idx = db.rsvps.findIndex((r: any) => r.eventId === rsvpId || r.id === rsvpId);
    if (idx !== -1) {
      db.rsvps[idx].hasCertificate = true;
      db.rsvps[idx].certificateCode = certCode;
      await writeLocalDb(db);
      return { ok: true };
    }
    return { ok: false };
  }
};
