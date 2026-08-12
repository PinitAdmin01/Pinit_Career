import { supabase } from '@/lib/supabaseClient';
import { readLocalJson, writeLocalJson } from '@/lib/services/localJsonDb';

const DB_FILE = 'src/lib/data/assets_db.json';

// Interface types
export interface Asset {
  id: string;
  assetCode: string;
  name: string;
  category: string;
  location: string;
  status: string;
}

export interface AssetMaintenance {
  id: string;
  assetCode: string;
  issue: string;
  staff: string;
  scheduledDate: string;
  status: string;
}

export interface AssetAmc {
  id: string;
  assetCode: string;
  vendor: string;
  expiryDate: string;
  cost: number;
}

// Read local JSON database
async function readLocalDb(): Promise<any> {
  return await readLocalJson(DB_FILE, { assets: [], maintenance: [], amc: [] });
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

export const assetsService = {
  async getStats() {
    const isSupabaseAvailable = await checkSupabaseAvailable('assets_list');

    if (isSupabaseAvailable) {
      try {
        const { data: assets } = await supabase.from('assets_list').select('*');
        const { data: maintenance } = await supabase.from('assets_maintenance').select('*');
        const { data: amc } = await supabase.from('assets_amc').select('*');

        return {
          assets: (assets || []).map(a => ({ id: a.asset_code, assetCode: a.asset_code, name: a.name, category: a.category, location: a.location, status: a.status })),
          maintenance: (maintenance || []).map(m => ({ id: m.id, assetCode: m.asset_code, issue: m.issue, staff: m.staff, scheduledDate: m.scheduled_date, status: m.status })),
          amc: (amc || []).map(am => ({ id: am.id, assetCode: am.asset_code, vendor: am.vendor, expiryDate: am.expiry_date, cost: am.cost }))
        };
      } catch (err) {
        console.warn('Supabase read failed, falling back to local database:', err);
      }
    }

    // Local Database Fallback
    return await readLocalDb();
  },

  async create(name: string, category: string, location: string) {
    const isSupabaseAvailable = await checkSupabaseAvailable('assets_list');
    const assetCode = `AST-${Math.floor(100 + Math.random() * 900)}`;

    if (isSupabaseAvailable) {
      try {
        await supabase.from('assets_list').insert({ asset_code: assetCode, name, category, location, status: 'Active' });
        return { ok: true };
      } catch (err) {
        console.warn('Supabase write failed, falling back to local database:', err);
      }
    }

    // Local Database Fallback
    const db = await readLocalDb();
    db.assets.unshift({ id: assetCode, assetCode, name, category, location, status: 'Active' });
    await writeLocalDb(db);
    return { ok: true };
  },

  async scheduleMnt(assetCode: string, issue: string, staff: string, scheduledDate: string) {
    const isSupabaseAvailable = await checkSupabaseAvailable('assets_maintenance');
    const id = `MNT-${Math.floor(100 + Math.random() * 900)}`;

    if (isSupabaseAvailable) {
      try {
        await supabase.from('assets_maintenance').insert({ id, asset_code: assetCode, issue, staff, scheduled_date: scheduledDate, status: 'Scheduled' });
        await supabase.from('assets_list').update({ status: 'Maintenance' }).eq('asset_code', assetCode);
        return { ok: true };
      } catch (err) {
        console.warn('Supabase write failed, falling back to local database:', err);
      }
    }

    // Local Database Fallback
    const db = await readLocalDb();
    db.maintenance.unshift({ id, assetCode, issue, staff, scheduledDate, status: 'Scheduled' });
    const idx = db.assets.findIndex((a: any) => a.assetCode === assetCode);
    if (idx !== -1) {
      db.assets[idx].status = 'Maintenance';
    }
    await writeLocalDb(db);
    return { ok: true };
  },

  async completeMnt(mntId: string) {
    const isSupabaseAvailable = await checkSupabaseAvailable('assets_maintenance');

    const db = await readLocalDb();
    const mnt = db.maintenance.find((m: any) => m.id === mntId) || {};

    if (isSupabaseAvailable) {
      try {
        await supabase.from('assets_maintenance').update({ status: 'Completed' }).eq('id', mntId);
        await supabase.from('assets_list').update({ status: 'Active' }).eq('asset_code', mnt.assetCode);
        return { ok: true };
      } catch (err) {
        console.warn('Supabase write failed, falling back to local database:', err);
      }
    }

    // Local Database Fallback
    const idx = db.maintenance.findIndex((m: any) => m.id === mntId);
    if (idx !== -1) {
      db.maintenance[idx].status = 'Completed';
      const aIdx = db.assets.findIndex((a: any) => a.assetCode === mnt.assetCode);
      if (aIdx !== -1) {
        db.assets[aIdx].status = 'Active';
      }
      await writeLocalDb(db);
      return { ok: true };
    }
    return { ok: false };
  },

  async renewAmc(amcId: string, expiryDate: string) {
    const isSupabaseAvailable = await checkSupabaseAvailable('assets_amc');

    if (isSupabaseAvailable) {
      try {
        await supabase.from('assets_amc').update({ expiry_date: expiryDate }).eq('id', amcId);
        return { ok: true };
      } catch (err) {
        console.warn('Supabase write failed, falling back to local database:', err);
      }
    }

    // Local Database Fallback
    const db = await readLocalDb();
    const idx = db.amc.findIndex((a: any) => a.id === amcId);
    if (idx !== -1) {
      db.amc[idx].expiryDate = expiryDate;
      await writeLocalDb(db);
      return { ok: true };
    }
    return { ok: false };
  }
};
