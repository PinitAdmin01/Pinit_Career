import { supabase } from '@/lib/supabaseClient';
import { tableExists as checkSupabaseAvailable, getCampusSupabaseClient } from '@/lib/services/supabaseTable';
import { readLocalJson, writeLocalJson, StorageWriteResult } from '@/lib/services/localJsonDb';
import crypto from 'crypto';

const DB_FILE = 'src/lib/data/transport_db.json';

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
async function readLocalDb(): Promise<any> {
  const db = await readLocalJson(DB_FILE, { routes: [], drivers: [], allocations: [] });
  return {
    routes: db.routes || [],
    drivers: db.drivers || [],
    allocations: db.allocations || [],
  };
}

// Write local JSON database
async function writeLocalDb(data: any): Promise<StorageWriteResult> {
  return await writeLocalJson(DB_FILE, data);
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
    const db = await readLocalDb();
    const allocation = db.allocations?.find((a: any) => a.student_id === studentId) || { route: null, stop: '', status: 'none' };

    return {
      routes: db.routes || [],
      drivers: db.drivers || [],
      allocation
    };
  },

  async register(studentId: string, routeCode: string, stop: string) {
    const isSupabaseRoutesAvailable = await checkSupabaseAvailable('transport_routes');
    let routeStops: string[] | null = null;

    if (isSupabaseRoutesAvailable) {
      try {
        const { data: r } = await supabase.from('transport_routes').select('stops').eq('code', routeCode).maybeSingle();
        if (r && Array.isArray(r.stops)) {
          routeStops = r.stops;
        }
      } catch (err) {
        console.warn('Failed to query transport_routes in Supabase, falling back to local DB:', err);
      }
    }

    if (!routeStops) {
      const db = await readLocalDb();
      const localRoute = (db.routes || []).find((r: any) => r.code === routeCode);
      if (localRoute && Array.isArray(localRoute.stops)) {
        routeStops = localRoute.stops;
      }
    }

    if (!routeStops) {
      return { ok: false, error: 'Route not found.' };
    }

    if (!routeStops.includes(stop)) {
      return { ok: false, error: 'Invalid boarding stop selected for this route code.' };
    }

    const isSupabaseAvailable = await checkSupabaseAvailable('transport_allocations');
    if (isSupabaseAvailable) {
      try {
        const client = await getCampusSupabaseClient();
        const { data: existing } = await client.from('transport_allocations').select('*').eq('student_id', studentId).maybeSingle();
        const res = existing
          ? await client.from('transport_allocations').update({ route_code: routeCode, stop, status: 'pending' }).eq('student_id', studentId)
          : await client.from('transport_allocations').insert({ student_id: studentId, route_code: routeCode, stop, status: 'pending' });
        if (res.error) throw new Error(res.error.message);
        return { ok: true, stored: 'db' };
      } catch (err) {
        console.warn('Supabase write failed, falling back to local database:', err);
      }
    }

    // Local Database Fallback
    const db = await readLocalDb();
    const index = db.allocations.findIndex((a: any) => a.student_id === studentId);
    const newAlloc = { student_id: studentId, route: routeCode, stop, status: 'pending' };
    if (index >= 0) {
      db.allocations[index] = newAlloc;
    } else {
      db.allocations.push(newAlloc);
    }
    const writeRes = await writeLocalDb(db);
    if (!writeRes.success) {
      return { ok: false, error: 'NOT_SAVED', message: writeRes.error || 'Failed to save transport allocation.', stored: 'none' };
    }
    return { ok: true, stored: writeRes.stored };
  },

  async approveRegistration(studentId: string) {
    const isSupabaseAvailable = await checkSupabaseAvailable('transport_allocations');
    if (isSupabaseAvailable) {
      try {
        const client = await getCampusSupabaseClient();
        const res = await client.from('transport_allocations').update({ status: 'allocated' }).eq('student_id', studentId);
        if (res.error) throw new Error(res.error.message);
        return { ok: true, stored: 'db' };
      } catch (err) {
        console.warn('Supabase write failed, falling back to local database:', err);
      }
    }
    const db = await readLocalDb();
    const alloc = (db.allocations || []).find((a: any) => a.student_id === studentId);
    if (alloc) alloc.status = 'allocated';
    const writeRes = await writeLocalDb(db);
    if (!writeRes.success) {
      return { ok: false, error: 'NOT_SAVED', message: writeRes.error || 'Failed to approve registration.', stored: 'none' };
    }
    return { ok: true, allocation: alloc || { status: 'allocated' }, stored: writeRes.stored };
  },

  async addRoute(code: string, name: string, driverName: string, vehicle: string, stops: string[], timing: string) {
    const isSupabaseAvailable = await checkSupabaseAvailable('transport_routes');
    const route = {
      code: code || `R-${Date.now().toString().slice(-4)}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`,
      name: name || 'New Bus Route',
      driverName: driverName || 'Driver',
      vehicle: vehicle || '',
      stops: stops || [],
      timing: timing || '',
    };
    if (isSupabaseAvailable) {
      try {
        const client = await getCampusSupabaseClient();
        const res = await client.from('transport_routes').insert({
          code: route.code,
          name: route.name,
          driver_name: route.driverName,
          vehicle: route.vehicle,
          stops: route.stops,
          timing: route.timing,
        });
        if (res.error) throw new Error(res.error.message);
        return { ok: true, route, stored: 'db' };
      } catch (err) {
        console.warn('Supabase write failed, falling back to local database:', err);
      }
    }
    const db = await readLocalDb();
    db.routes = db.routes || [];
    db.routes.push(route);
    const writeRes = await writeLocalDb(db);
    if (!writeRes.success) {
      return { ok: false, error: 'NOT_SAVED', message: writeRes.error || 'Failed to save route.', stored: 'none' };
    }
    return { ok: true, route, stored: writeRes.stored };
  },
};
