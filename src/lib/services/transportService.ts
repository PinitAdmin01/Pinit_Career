import fs from 'fs';
import path from 'path';
import { supabase } from '@/lib/supabaseClient';

const DB_PATH = path.join(process.cwd(), 'src/lib/data/transport_db.json');

// Interface types
export interface TransportRoute {
  code: string;
  name: string;
  driverName: string;
  vehicle: string;
  stops: string[];
  timing: string;
}

export interface TransportDriver {
  name: string;
  phone: string;
  license: string;
  rating: number;
}

export interface TransportAllocation {
  student_id: string;
  route: string;
  stop: string;
  status: string;
}

// Read local JSON database
function readLocalDb(): any {
  try {
    if (!fs.existsSync(DB_PATH)) {
      return { routes: [], drivers: [], allocations: [] };
    }
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading local transport database file:', err);
    return { routes: [], drivers: [], allocations: [] };
  }
}

// Write local JSON database
function writeLocalDb(data: any): void {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing local transport database file:', err);
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

export const transportService = {
  async getStats(studentId: string) {
    const isSupabaseAvailable = await checkSupabaseAvailable('transport_routes');

    if (isSupabaseAvailable) {
      try {
        const { data: routes } = await supabase.from('transport_routes').select('*');
        const { data: drivers } = await supabase.from('transport_drivers').select('*');
        const { data: allocation } = await supabase.from('transport_allocations').select('*').eq('student_id', studentId).maybeSingle();

        return {
          routes: (routes || []).map(r => ({ code: r.code, name: r.name, driverName: r.driver_name, vehicle: r.vehicle, stops: r.stops, timing: r.timing })),
          drivers: (drivers || []).map(d => ({ name: d.name, phone: d.phone, license: d.license, rating: Number(d.rating) })),
          allocation: allocation ? { route: allocation.route_code, stop: allocation.stop, status: allocation.status } : { route: null, stop: '', status: 'none' }
        };
      } catch (err) {
        console.warn('Supabase read failed, falling back to local database:', err);
      }
    }

    // Local Database Fallback
    const db = readLocalDb();
    const allocation = db.allocations?.find((a: any) => a.student_id === studentId) || { route: null, stop: '', status: 'none' };

    return {
      routes: db.routes || [],
      drivers: db.drivers || [],
      allocation
    };
  },

  async register(studentId: string, routeCode: string, stop: string) {
    const isSupabaseAvailable = await checkSupabaseAvailable('transport_allocations');
    const db = readLocalDb();
    const route = db.routes?.find((r: any) => r.code === routeCode);
    if (route && !route.stops.includes(stop)) {
      return { ok: false, error: 'Invalid boarding stop selected for this route code.' };
    }

    if (isSupabaseAvailable) {
      try {
        const { data: existing } = await supabase.from('transport_allocations').select('*').eq('student_id', studentId).maybeSingle();
        if (existing) {
          await supabase.from('transport_allocations').update({ route_code: routeCode, stop, status: 'pending' }).eq('student_id', studentId);
        } else {
          await supabase.from('transport_allocations').insert({ student_id: studentId, route_code: routeCode, stop, status: 'pending' });
        }
        return { ok: true };
      } catch (err) {
        console.warn('Supabase write failed, falling back to local database:', err);
      }
    }

    // Local Database Fallback
    const index = db.allocations.findIndex((a: any) => a.student_id === studentId);
    const newAlloc = { student_id: studentId, route: routeCode, stop, status: 'pending' };
    if (index >= 0) {
      db.allocations[index] = newAlloc;
    } else {
      db.allocations.push(newAlloc);
    }
    writeLocalDb(db);
    return { ok: true };
  }
};
