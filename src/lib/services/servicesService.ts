import { supabase } from '@/lib/supabaseClient';
import { tableExists as checkSupabaseAvailable, getCampusSupabaseClient } from '@/lib/services/supabaseTable';
import { readLocalJson, writeLocalJson, StorageWriteResult } from '@/lib/services/localJsonDb';

const DB_FILE = 'src/lib/data/services_db.json';

// Interface types
export interface ServiceLeave {
  id: string;
  startDate: string;
  endDate: string;
  reason: string;
  type: string;
  status: string;
}

export interface ServiceRequest {
  id: string;
  category: string;
  description: string;
  status: string;
}

export interface ServiceAppointment {
  id: string;
  staffName: string;
  date: string;
  time: string;
  purpose: string;
}

export interface ServiceCounselling {
  id: string;
  counselorName: string;
  date: string;
  time: string;
  status: string;
}

// Read local JSON database
async function readLocalDb(): Promise<any> {
  return await readLocalJson(DB_FILE, { leaves: [], requests: [], appointments: [], counselling: [] });
}

// Write local JSON database
async function writeLocalDb(data: any): Promise<StorageWriteResult> {
  return await writeLocalJson(DB_FILE, data);
}

export const servicesService = {
  async getStats(studentId: string) {
    const isSupabaseAvailable = await checkSupabaseAvailable('services_leaves');

    if (isSupabaseAvailable) {
      try {
        const { data: leaves } = await supabase.from('services_leaves').select('*').eq('student_id', studentId);
        const { data: requests } = await supabase.from('services_requests').select('*').eq('student_id', studentId);
        const { data: appointments } = await supabase.from('services_appointments').select('*').eq('student_id', studentId);
        const { data: counselling } = await supabase.from('services_counselling').select('*').eq('student_id', studentId);

        return {
          leaves: (leaves || []).map(l => ({ id: l.id, startDate: l.start_date, endDate: l.end_date, reason: l.reason, type: l.type, status: l.status })),
          requests: (requests || []).map(r => ({ id: r.id, category: r.category, description: r.description, status: r.status })),
          appointments: (appointments || []).map(a => ({ id: a.id, staffName: a.staff_name, date: a.date, time: a.time, purpose: a.purpose })),
          counselling: (counselling || []).map(c => ({ id: c.id, counselorName: c.counselor_name, date: c.date, time: c.time, status: c.status }))
        };
      } catch (err) {
        console.warn('Supabase read failed, falling back to local database:', err);
      }
    }

    // Local Database Fallback
    const db = await readLocalDb();
    const myLeaves = (db.leaves || []).filter((l: any) => !studentId || l.studentId === studentId || l.student_id === studentId);
    const myRequests = (db.requests || []).filter((r: any) => !studentId || r.studentId === studentId || r.student_id === studentId);
    const myAppointments = (db.appointments || []).filter((a: any) => !studentId || a.studentId === studentId || a.student_id === studentId);
    const myCounselling = (db.counselling || []).filter((c: any) => !studentId || c.studentId === studentId || c.student_id === studentId);

    return {
      leaves: myLeaves,
      requests: myRequests,
      appointments: myAppointments,
      counselling: myCounselling
    };
  },

  async applyLeave(studentId: string, startDate: string, endDate: string, reason: string, type: string) {
    const isSupabaseAvailable = await checkSupabaseAvailable('services_leaves');

    if (isSupabaseAvailable) {
      try {
        const client = await getCampusSupabaseClient();
        const res = await client.from('services_leaves').insert({
          student_id: studentId,
          start_date: startDate,
          end_date: endDate,
          reason,
          type,
          status: 'Pending'
        });
        if (res.error) throw new Error(res.error.message);
        return { ok: true, stored: 'db' };
      } catch (err) {
        console.warn('Supabase write failed, falling back to local database:', err);
      }
    }

    // Local Database Fallback
    const db = await readLocalDb();
    const id = `LEV-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
    db.leaves.unshift({
      id,
      studentId,
      student_id: studentId,
      startDate,
      endDate,
      reason,
      type,
      status: 'Pending'
    });
    const writeRes = await writeLocalDb(db);
    if (!writeRes.success) {
      return { ok: false, error: 'NOT_SAVED', message: writeRes.error || 'Failed to submit leave request.', stored: 'none' };
    }
    return { ok: true, stored: writeRes.stored };
  },

  async fileRequest(studentId: string, category: string, description: string) {
    const isSupabaseAvailable = await checkSupabaseAvailable('services_requests');

    if (isSupabaseAvailable) {
      try {
        const client = await getCampusSupabaseClient();
        const res = await client.from('services_requests').insert({
          student_id: studentId,
          category,
          description,
          status: 'Pending'
        });
        if (res.error) throw new Error(res.error.message);
        return { ok: true, stored: 'db' };
      } catch (err) {
        console.warn('Supabase write failed, falling back to local database:', err);
      }
    }

    // Local Database Fallback
    const db = await readLocalDb();
    const id = `REQ-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
    db.requests.unshift({
      id,
      studentId,
      student_id: studentId,
      category,
      description,
      status: 'Pending'
    });
    const writeRes = await writeLocalDb(db);
    if (!writeRes.success) {
      return { ok: false, error: 'NOT_SAVED', message: writeRes.error || 'Failed to file request.', stored: 'none' };
    }
    return { ok: true, stored: writeRes.stored };
  },

  async bookAppointment(studentId: string, staffName: string, date: string, time: string, purpose: string) {
    const isSupabaseAvailable = await checkSupabaseAvailable('services_appointments');

    if (isSupabaseAvailable) {
      try {
        const client = await getCampusSupabaseClient();
        const res = await client.from('services_appointments').insert({
          student_id: studentId,
          staff_name: staffName,
          date,
          time,
          purpose
        });
        if (res.error) throw new Error(res.error.message);
        return { ok: true, stored: 'db' };
      } catch (err) {
        console.warn('Supabase write failed, falling back to local database:', err);
      }
    }

    // Local Database Fallback
    const db = await readLocalDb();
    const id = `APT-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
    db.appointments.unshift({
      id,
      studentId,
      student_id: studentId,
      staffName,
      date,
      time,
      purpose
    });
    const writeRes = await writeLocalDb(db);
    if (!writeRes.success) {
      return { ok: false, error: 'NOT_SAVED', message: writeRes.error || 'Failed to book appointment.', stored: 'none' };
    }
    return { ok: true, stored: writeRes.stored };
  },

  async bookCounselling(studentId: string, counselorName: string, date: string, time: string) {
    if (new Date(date).getTime() < new Date().setHours(0, 0, 0, 0)) {
      return { ok: false, error: 'Cannot book counselor appointments on past dates.' };
    }

    const isSupabaseAvailable = await checkSupabaseAvailable('services_counselling');

    if (isSupabaseAvailable) {
      try {
        const client = await getCampusSupabaseClient();
        const { data: conflict } = await client.from('services_counselling')
          .select('id')
          .eq('counselor_name', counselorName)
          .eq('date', date)
          .eq('time', time)
          .maybeSingle();

        if (conflict) {
          return { ok: false, error: 'COUNSELLOR_SLOT_TAKEN: This counselor already has a session booked at this date and time.' };
        }

        const res = await client.from('services_counselling').insert({
          student_id: studentId,
          counselor_name: counselorName,
          date,
          time,
          status: 'Requested'
        });
        if (res.error) throw new Error(res.error.message);
        const sessionObj = { studentId, counselorName, date, time, status: 'Requested' };
        return { ok: true, stored: 'db', session: sessionObj };
      } catch (err) {
        console.warn('Supabase write failed, falling back to local database:', err);
      }
    }

    // Local Database Fallback
    const db = await readLocalDb();
    const conflict = (db.counselling || []).find((c: any) =>
      c.counselorName === counselorName && c.date === date && c.time === time
    );
    if (conflict) {
      return { ok: false, error: 'COUNSELLOR_SLOT_TAKEN: This counselor already has a session booked at this date and time.' };
    }

    const id = `CNS-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
    const sessionObj = {
      id,
      studentId,
      student_id: studentId,
      counselorName,
      date,
      time,
      status: 'Requested'
    };
    db.counselling.unshift(sessionObj);
    const writeRes = await writeLocalDb(db);
    if (!writeRes.success) {
      return { ok: false, error: 'NOT_SAVED', message: writeRes.error || 'Failed to book counselling.', stored: 'none' };
    }
    return { ok: true, stored: writeRes.stored, session: sessionObj };
  },

  async approveLeave(leaveId: string) {
    const isSupabaseAvailable = await checkSupabaseAvailable('services_leaves');

    if (isSupabaseAvailable) {
      try {
        const client = await getCampusSupabaseClient();
        const res = await client.from('services_leaves').update({ status: 'Approved' }).eq('id', leaveId);
        if (res.error) throw new Error(res.error.message);
        return { ok: true, stored: 'db' };
      } catch (err) {
        console.warn('Supabase write failed, falling back to local database:', err);
      }
    }

    // Local Database Fallback
    const db = await readLocalDb();
    const idx = db.leaves.findIndex((l: any) => l.id === leaveId);
    if (idx !== -1) {
      db.leaves[idx].status = 'Approved';
      const writeRes = await writeLocalDb(db);
      if (!writeRes.success) {
        return { ok: false, error: 'NOT_SAVED', message: writeRes.error || 'Failed to approve leave.', stored: 'none' };
      }
      return { ok: true, stored: writeRes.stored };
    }
    return { ok: false, error: 'NOT_FOUND', message: 'Leave record not found' };
  },

  async approveRequest(requestId: string) {
    const isSupabaseAvailable = await checkSupabaseAvailable('services_requests');

    if (isSupabaseAvailable) {
      try {
        const client = await getCampusSupabaseClient();
        const res = await client.from('services_requests').update({ status: 'Approved' }).eq('id', requestId);
        if (res.error) throw new Error(res.error.message);
        return { ok: true, stored: 'db' };
      } catch (err) {
        console.warn('Supabase write failed, falling back to local database:', err);
      }
    }

    // Local Database Fallback
    const db = await readLocalDb();
    const idx = db.requests.findIndex((r: any) => r.id === requestId);
    if (idx !== -1) {
      db.requests[idx].status = 'Approved';
      const writeRes = await writeLocalDb(db);
      if (!writeRes.success) {
        return { ok: false, error: 'NOT_SAVED', message: writeRes.error || 'Failed to approve request.', stored: 'none' };
      }
      return { ok: true, stored: writeRes.stored };
    }
    return { ok: false, error: 'NOT_FOUND', message: 'Request not found' };
  }
};
