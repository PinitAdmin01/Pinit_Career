import { supabase } from '@/lib/supabaseClient';
import { tableExists as checkSupabaseAvailable } from '@/lib/services/supabaseTable';
import { readLocalJson, writeLocalJson } from '@/lib/services/localJsonDb';

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
async function writeLocalDb(data: any): Promise<void> {
  await writeLocalJson(DB_FILE, data);
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
    return await readLocalDb();
  },

  async applyLeave(studentId: string, startDate: string, endDate: string, reason: string, type: string) {
    const isSupabaseAvailable = await checkSupabaseAvailable('services_leaves');

    if (isSupabaseAvailable) {
      try {
        await supabase.from('services_leaves').insert({
          student_id: studentId,
          start_date: startDate,
          end_date: endDate,
          reason,
          type,
          status: 'Pending'
        });
        return { ok: true };
      } catch (err) {
        console.warn('Supabase write failed, falling back to local database:', err);
      }
    }

    // Local Database Fallback
    const db = await readLocalDb();
    db.leaves.unshift({
      id: `LEV-${Math.floor(100 + Math.random() * 900)}`,
      startDate,
      endDate,
      reason,
      type,
      status: 'Pending'
    });
    await writeLocalDb(db);
    return { ok: true };
  },

  async fileRequest(studentId: string, category: string, description: string) {
    const isSupabaseAvailable = await checkSupabaseAvailable('services_requests');

    if (isSupabaseAvailable) {
      try {
        await supabase.from('services_requests').insert({
          student_id: studentId,
          category,
          description,
          status: 'Pending'
        });
        return { ok: true };
      } catch (err) {
        console.warn('Supabase write failed, falling back to local database:', err);
      }
    }

    // Local Database Fallback
    const db = await readLocalDb();
    db.requests.unshift({
      id: `REQ-${Math.floor(100 + Math.random() * 900)}`,
      category,
      description,
      status: 'Pending'
    });
    await writeLocalDb(db);
    return { ok: true };
  },

  async bookAppointment(studentId: string, staffName: string, date: string, time: string, purpose: string) {
    const isSupabaseAvailable = await checkSupabaseAvailable('services_appointments');

    if (isSupabaseAvailable) {
      try {
        await supabase.from('services_appointments').insert({
          student_id: studentId,
          staff_name: staffName,
          date,
          time,
          purpose
        });
        return { ok: true };
      } catch (err) {
        console.warn('Supabase write failed, falling back to local database:', err);
      }
    }

    // Local Database Fallback
    const db = await readLocalDb();
    db.appointments.unshift({
      id: `APT-${Math.floor(100 + Math.random() * 900)}`,
      staffName,
      date,
      time,
      purpose
    });
    await writeLocalDb(db);
    return { ok: true };
  },

  async bookCounselling(studentId: string, counselorName: string, date: string, time: string) {
    if (new Date(date).getTime() < new Date().setHours(0, 0, 0, 0)) {
      return { ok: false, error: 'Cannot book counselor appointments on past dates.' };
    }

    const isSupabaseAvailable = await checkSupabaseAvailable('services_counselling');

    if (isSupabaseAvailable) {
      try {
        await supabase.from('services_counselling').insert({
          student_id: studentId,
          counselor_name: counselorName,
          date,
          time,
          status: 'Confirmed'
        });
        return { ok: true };
      } catch (err) {
        console.warn('Supabase write failed, falling back to local database:', err);
      }
    }

    // Local Database Fallback
    const db = await readLocalDb();
    db.counselling.unshift({
      id: `CNS-${Math.floor(100 + Math.random() * 900)}`,
      counselorName,
      date,
      time,
      status: 'Confirmed'
    });
    await writeLocalDb(db);
    return { ok: true };
  },

  async approveLeave(leaveId: string) {
    const isSupabaseAvailable = await checkSupabaseAvailable('services_leaves');

    if (isSupabaseAvailable) {
      try {
        await supabase.from('services_leaves').update({ status: 'Approved' }).eq('id', leaveId);
        return { ok: true };
      } catch (err) {
        console.warn('Supabase write failed, falling back to local database:', err);
      }
    }

    // Local Database Fallback
    const db = await readLocalDb();
    const idx = db.leaves.findIndex((l: any) => l.id === leaveId);
    if (idx !== -1) {
      db.leaves[idx].status = 'Approved';
      await writeLocalDb(db);
      return { ok: true };
    }
    return { ok: false };
  },

  async approveRequest(requestId: string) {
    const isSupabaseAvailable = await checkSupabaseAvailable('services_requests');

    if (isSupabaseAvailable) {
      try {
        await supabase.from('services_requests').update({ status: 'Approved' }).eq('id', requestId);
        return { ok: true };
      } catch (err) {
        console.warn('Supabase write failed, falling back to local database:', err);
      }
    }

    // Local Database Fallback
    const db = await readLocalDb();
    const idx = db.requests.findIndex((r: any) => r.id === requestId);
    if (idx !== -1) {
      db.requests[idx].status = 'Approved';
      await writeLocalDb(db);
      return { ok: true };
    }
    return { ok: false };
  }
};
