import fs from 'fs';
import path from 'path';
import { supabase } from '@/lib/supabaseClient';

const DB_PATH = path.join(process.cwd(), 'src/lib/data/hostel_db.json');

// Interface types
export interface HostelRoom {
  code: string;
  block: string;
  room: string;
  capacity: number;
  occupied: number;
  residents: string[];
  status: string;
}

export interface HostelAllocation {
  student_id: string;
  student_name: string;
  requested_room: string;
  status: string;
}

export interface HostelComplaint {
  id: string;
  student_id: string;
  student_name: string;
  category: string;
  title: string;
  description?: string;
  status: string;
  timestamp: string;
}

export interface HostelVisitor {
  id: string;
  student_id: string;
  name: string;
  relation: string;
  purpose: string;
  status: string;
  timestamp: string;
}

// Read local JSON file database
function readLocalDb(): any {
  try {
    if (!fs.existsSync(DB_PATH)) {
      return { rooms: [], allocations: [], attendance: [], complaints: [], visitors: [] };
    }
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading local hostel database file:', err);
    return { rooms: [], allocations: [], attendance: [], complaints: [], visitors: [] };
  }
}

// Write local JSON file database
function writeLocalDb(data: any): void {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing local hostel database file:', err);
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

export const hostelService = {
  async getStats(studentId: string, studentName: string) {
    const isSupabaseAvailable = await checkSupabaseAvailable('hostel_rooms');

    if (isSupabaseAvailable) {
      try {
        const { data: rooms } = await supabase.from('hostel_rooms').select('*');
        const { data: allocation } = await supabase.from('hostel_allocations').select('*').eq('student_id', studentId).maybeSingle();
        const { data: attendance } = await supabase.from('hostel_attendance').select('*').eq('student_id', studentId).order('timestamp', { ascending: false });
        const { data: complaints } = await supabase.from('hostel_complaints').select('*').eq('student_id', studentId);
        const { data: visitors } = await supabase.from('hostel_visitors').select('*').eq('student_id', studentId);

        return {
          rooms: rooms || [],
          allocation: allocation ? { requestedRoom: allocation.requested_room, status: allocation.status } : { requestedRoom: null, status: 'none' },
          attendance: (attendance || []).map(a => ({ id: a.id, type: a.type, timestamp: a.timestamp })),
          complaints: (complaints || []).map(c => ({ id: c.id, category: c.category, title: c.title, description: c.description, status: c.status })),
          visitors: (visitors || []).map(v => ({ id: v.id, name: v.name, relation: v.relation, purpose: v.purpose, status: v.status }))
        };
      } catch (err) {
        console.warn('Supabase read failed, falling back to local database:', err);
      }
    }

    // Local Database Fallback
    const db = readLocalDb();
    const allocation = db.allocations?.find((a: any) => a.student_id === studentId) || { requestedRoom: null, status: 'none' };
    const myAttendance = db.attendance?.filter((a: any) => a.student_id === studentId || a.studentName === studentName) || [];
    const myComplaints = db.complaints?.filter((c: any) => c.student_id === studentId || c.studentName === studentName) || [];
    const myVisitors = db.visitors?.filter((v: any) => v.student_id === studentId) || [];

    return {
      rooms: db.rooms || [],
      allocation,
      attendance: myAttendance,
      complaints: myComplaints,
      visitors: myVisitors
    };
  },

  async requestRoom(studentId: string, studentName: string, roomCode: string) {
    const isSupabaseAvailable = await checkSupabaseAvailable('hostel_allocations');

    if (isSupabaseAvailable) {
      try {
        const { data: existing } = await supabase.from('hostel_allocations').select('*').eq('student_id', studentId).maybeSingle();
        if (existing) {
          await supabase.from('hostel_allocations').update({ requested_room: roomCode, status: 'pending' }).eq('student_id', studentId);
        } else {
          await supabase.from('hostel_allocations').insert({ student_id: studentId, student_name: studentName, requested_room: roomCode, status: 'pending' });
        }
        return { ok: true };
      } catch (err) {
        console.warn('Supabase write failed, falling back to local database:', err);
      }
    }

    // Local Database Fallback
    const db = readLocalDb();
    const index = db.allocations.findIndex((a: any) => a.student_id === studentId);
    const newAlloc = { student_id: studentId, student_name: studentName, requestedRoom: roomCode, status: 'pending' };
    if (index >= 0) {
      db.allocations[index] = newAlloc;
    } else {
      db.allocations.push(newAlloc);
    }
    writeLocalDb(db);
    return { ok: true };
  },

  async logAttendance(studentId: string, studentName: string, type: 'check-in' | 'check-out', roomCode: string) {
    const isSupabaseAvailable = await checkSupabaseAvailable('hostel_attendance');

    if (isSupabaseAvailable) {
      try {
        await supabase.from('hostel_attendance').insert({
          student_id: studentId,
          student_name: studentName,
          type,
          room_code: roomCode,
          timestamp: new Date().toISOString()
        });
        return { ok: true };
      } catch (err) {
        console.warn('Supabase write failed, falling back to local db:', err);
      }
    }

    // Local Database Fallback
    const db = readLocalDb();
    db.attendance.unshift({
      id: `ATT-${Math.floor(100 + Math.random() * 900)}`,
      student_id: studentId,
      studentName,
      room: roomCode,
      type,
      timestamp: new Date().toISOString()
    });
    writeLocalDb(db);
    return { ok: true };
  },

  async raiseComplaint(studentId: string, studentName: string, category: string, title: string, description: string) {
    const isSupabaseAvailable = await checkSupabaseAvailable('hostel_complaints');

    if (isSupabaseAvailable) {
      try {
        await supabase.from('hostel_complaints').insert({
          student_id: studentId,
          student_name: studentName,
          category,
          title,
          description,
          status: 'Pending'
        });
        return { ok: true };
      } catch (err) {
        console.warn('Supabase write failed, falling back to local db:', err);
      }
    }

    // Local Database Fallback
    const db = readLocalDb();
    db.complaints.unshift({
      id: `CMP-${Math.floor(100 + Math.random() * 900)}`,
      student_id: studentId,
      studentName,
      category,
      title,
      description,
      status: 'Pending',
      timestamp: new Date().toISOString()
    });
    writeLocalDb(db);
    return { ok: true };
  },

  async registerVisitor(studentId: string, name: string, relation: string, purpose: string) {
    const isSupabaseAvailable = await checkSupabaseAvailable('hostel_visitors');

    if (isSupabaseAvailable) {
      try {
        await supabase.from('hostel_visitors').insert({
          student_id: studentId,
          name,
          relation,
          purpose,
          status: 'checked-in'
        });
        return { ok: true };
      } catch (err) {
        console.warn('Supabase write failed, falling back to local db:', err);
      }
    }

    // Local Database Fallback
    const db = readLocalDb();
    db.visitors.unshift({
      id: `VIS-${Math.floor(100 + Math.random() * 900)}`,
      student_id: studentId,
      name,
      relation,
      purpose,
      status: 'checked-in',
      timestamp: new Date().toISOString()
    });
    writeLocalDb(db);
    return { ok: true };
  },

  async checkoutVisitor(studentId: string, visitorId: string) {
    const isSupabaseAvailable = await checkSupabaseAvailable('hostel_visitors');

    if (isSupabaseAvailable) {
      try {
        await supabase.from('hostel_visitors').update({ status: 'checked-out' }).eq('id', visitorId);
        return { ok: true };
      } catch (err) {
        console.warn('Supabase write failed, falling back to local db:', err);
      }
    }

    // Local Database Fallback
    const db = readLocalDb();
    const visitor = db.visitors.find((v: any) => v.id === visitorId);
    if (visitor) {
      visitor.status = 'checked-out';
      writeLocalDb(db);
    }
    return { ok: true };
  }
};
