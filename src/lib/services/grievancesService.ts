import { supabase } from '@/lib/supabaseClient';
import { tableExists as checkSupabaseAvailable, getCampusSupabaseClient } from '@/lib/services/supabaseTable';
import { readLocalJson, writeLocalJson, StorageWriteResult } from '@/lib/services/localJsonDb';

const DB_FILE = 'src/lib/data/grievances_db.json';

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
  receiptToken?: string;
}

// Read local JSON database
async function readLocalDb(): Promise<any> {
  return await readLocalJson(DB_FILE, { grievances: [] });
}

// Write local JSON database
async function writeLocalDb(data: any): Promise<StorageWriteResult> {
  return await writeLocalJson(DB_FILE, data);
}

export const grievancesService = {
  async getStats(studentId: string, studentName: string, isStaff: boolean = false) {
    const isSupabaseAvailable = await checkSupabaseAvailable('grievances_tickets');

    if (isSupabaseAvailable) {
      try {
        let query = supabase.from('grievances_tickets').select('*');
        if (!isStaff) {
          // Privacy protection: students can only query their own filed grievances
          query = query.eq('student_id', studentId);
        }
        const { data: tickets, error } = await query;
        if (error) {
          console.warn('[grievancesService] Error querying tickets:', error);
          throw error;
        }
        return {
          grievances: (tickets || []).map(t => {
            const isAnon = Boolean(t.anonymous);
            return {
              id: t.id,
              reporterType: isAnon ? 'Anonymous Whistleblower' : (t.reporter_type || 'Student'),
              reporterName: isAnon ? 'Anonymous Candidate' : (t.reporter_name || t.student_name || 'Student'),
              category: t.category,
              title: t.title,
              description: t.description,
              anonymous: isAnon,
              status: t.status,
              filedOn: t.created_at || t.filedOn,
              resolution: t.resolution,
              resolvedOn: t.resolved_at || t.resolvedOn,
              receiptToken: isAnon ? t.receipt_token : undefined
            };
          })
        };
      } catch (err) {
        console.warn('Supabase read failed, falling back to local database:', err);
      }
    }

    // Local Database Fallback (filtered by student unless staff)
    const db = await readLocalDb();
    const all = Array.isArray(db.grievances) ? db.grievances : [];
    const filtered = isStaff
      ? all
      : all.filter((t: any) =>
          t.studentId === studentId ||
          t.reporterId === studentId ||
          (t.reporterName && t.reporterName === studentName && !t.anonymous)
        );

    const sanitized = filtered.map((t: any) => {
      const isAnon = Boolean(t.anonymous);
      return {
        ...t,
        reporterName: isAnon ? 'Anonymous Candidate' : t.reporterName,
        reporterType: isAnon ? 'Anonymous Whistleblower' : t.reporterType
      };
    });
    return {
      grievances: sanitized
    };
  },

  async submit(studentId: string, studentName: string, reporterType: string, category: string, title: string, description: string, anonymous: boolean) {
    const isSupabaseAvailable = await checkSupabaseAvailable('grievances_tickets');
    const effectiveStudentName = anonymous ? 'Anonymous Candidate' : studentName;
    const effectiveReporterType = anonymous ? 'Anonymous Whistleblower' : reporterType;
    const receiptToken = anonymous ? `TRK-${Math.random().toString(36).substring(2, 10).toUpperCase()}` : undefined;

    if (isSupabaseAvailable) {
      try {
        const client = await getCampusSupabaseClient();
        // Schema tolerance: populate both student_id/student_name and reporter_id/reporter_name
        const res = await client.from('grievances_tickets').insert({
          student_id: studentId,
          student_name: effectiveStudentName,
          reporter_id: studentId,
          reporter_name: effectiveStudentName,
          reporter_type: effectiveReporterType,
          receipt_token: receiptToken,
          category,
          title,
          description,
          anonymous,
          status: 'Pending'
        });
        if (res.error) {
          // Fallback schema attempt using standard fields only
          const retryRes = await client.from('grievances_tickets').insert({
            student_id: studentId,
            student_name: effectiveStudentName,
            reporter_type: effectiveReporterType,
            category,
            title,
            description,
            anonymous,
            status: 'Pending'
          });
          if (retryRes.error) throw new Error(retryRes.error.message);
        }
        return { ok: true, receiptToken, stored: 'db' };
      } catch (err) {
        console.warn('Supabase write failed, falling back to local database:', err);
      }
    }

    // Local Database Fallback
    const db = await readLocalDb();
    if (!Array.isArray(db.grievances)) db.grievances = [];
    db.grievances.unshift({
      id: `GRV-${Math.floor(100 + Math.random() * 900)}`,
      studentId,
      reporterId: studentId,
      reporterType: effectiveReporterType,
      reporterName: effectiveStudentName,
      category,
      title,
      description,
      anonymous,
      status: 'Pending',
      filedOn: new Date().toISOString(),
      receiptToken
    });
    const writeRes = await writeLocalDb(db);
    if (!writeRes.success) {
      return { ok: false, error: 'NOT_SAVED', message: writeRes.error || 'Failed to file grievance.', stored: 'none' };
    }
    return { ok: true, receiptToken, stored: writeRes.stored };
  },

  async investigate(ticketId: string) {
    const isSupabaseAvailable = await checkSupabaseAvailable('grievances_tickets');

    if (isSupabaseAvailable) {
      try {
        const client = await getCampusSupabaseClient();
        const res = await client.from('grievances_tickets').update({ status: 'Under Investigation' }).eq('id', ticketId);
        if (res.error) throw new Error(res.error.message);
        return { ok: true, stored: 'db' };
      } catch (err) {
        console.warn('Supabase write failed, falling back to local database:', err);
      }
    }

    // Local Database Fallback
    const db = await readLocalDb();
    const idx = db.grievances.findIndex((g: any) => g.id === ticketId);
    if (idx !== -1) {
      db.grievances[idx].status = 'Under Investigation';
      const writeRes = await writeLocalDb(db);
      if (!writeRes.success) {
        return { ok: false, error: 'NOT_SAVED', message: writeRes.error || 'Failed to update ticket.', stored: 'none' };
      }
      return { ok: true, stored: writeRes.stored };
    }
    return { ok: false, error: 'NOT_FOUND', message: 'Ticket not found' };
  },

  async resolve(ticketId: string, resolution: string) {
    const isSupabaseAvailable = await checkSupabaseAvailable('grievances_tickets');

    if (isSupabaseAvailable) {
      try {
        const client = await getCampusSupabaseClient();
        const res = await client.from('grievances_tickets').update({
          status: 'Resolved',
          resolution,
          resolved_at: new Date().toISOString()
        }).eq('id', ticketId);
        if (res.error) throw new Error(res.error.message);
        return { ok: true, stored: 'db' };
      } catch (err) {
        console.warn('Supabase write failed, falling back to local database:', err);
      }
    }

    // Local Database Fallback
    const db = await readLocalDb();
    const idx = db.grievances.findIndex((g: any) => g.id === ticketId);
    if (idx !== -1) {
      db.grievances[idx].status = 'Resolved';
      db.grievances[idx].resolution = resolution;
      db.grievances[idx].resolvedOn = new Date().toISOString();
      const writeRes = await writeLocalDb(db);
      if (!writeRes.success) {
        return { ok: false, error: 'NOT_SAVED', message: writeRes.error || 'Failed to resolve grievance.', stored: 'none' };
      }
      return { ok: true, stored: writeRes.stored };
    }
    return { ok: false, error: 'NOT_FOUND', message: 'Ticket not found' };
  }
};
