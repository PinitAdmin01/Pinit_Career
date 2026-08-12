import { supabase } from '@/lib/supabaseClient';
import { readLocalJson, writeLocalJson } from '@/lib/services/localJsonDb';

const DB_FILE = 'src/lib/data/procurement_db.json';

// Interface types
export interface ProcurementRequest {
  id: string;
  item: string;
  qty: number;
  dept: string;
  cost: number;
  status: string;
}

export interface ProcurementOrder {
  id: string;
  requestId: string;
  item: string;
  qty: number;
  cost: number;
  vendor: string;
  status: string;
}

export interface ProcurementVendor {
  id: string;
  name: string;
  email: string;
  category: string;
}

export interface ProcurementInventory {
  id: string;
  item: string;
  qty: number;
  dept: string;
}

// Read local JSON database
async function readLocalDb(): Promise<any> {
  return await readLocalJson(DB_FILE, { requests: [], orders: [], vendors: [], inventory: [] });
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

export const procurementService = {
  async getStats() {
    const isSupabaseAvailable = await checkSupabaseAvailable('procurement_requests');

    if (isSupabaseAvailable) {
      try {
        const { data: requests } = await supabase.from('procurement_requests').select('*');
        const { data: orders } = await supabase.from('procurement_orders').select('*');
        const { data: vendors } = await supabase.from('procurement_vendors').select('*');
        const { data: inventory } = await supabase.from('procurement_inventory').select('*');

        return {
          requests: (requests || []).map(r => ({ id: r.id, item: r.item, qty: r.qty, dept: r.dept, cost: r.cost, status: r.status })),
          orders: (orders || []).map(o => ({ id: o.id, requestId: o.request_id, item: o.item, qty: o.qty, cost: o.cost, vendor: o.vendor, status: o.status })),
          vendors: (vendors || []).map(v => ({ id: v.id, name: v.name, email: v.email, category: v.category })),
          inventory: (inventory || []).map(i => ({ id: i.id, item: i.item, qty: i.qty, dept: i.dept }))
        };
      } catch (err) {
        console.warn('Supabase read failed, falling back to local database:', err);
      }
    }

    // Local Database Fallback
    return await readLocalDb();
  },

  async createRequest(item: string, qty: number, dept: string, cost: number) {
    const isSupabaseAvailable = await checkSupabaseAvailable('procurement_requests');
    const id = `REQ-${Math.floor(100 + Math.random() * 900)}`;

    if (isSupabaseAvailable) {
      try {
        await supabase.from('procurement_requests').insert({ id, item, qty, dept, cost, status: 'Pending' });
        return { ok: true };
      } catch (err) {
        console.warn('Supabase write failed, falling back to local database:', err);
      }
    }

    // Local Database Fallback
    const db = await readLocalDb();
    db.requests.unshift({ id, item, qty, dept, cost, status: 'Pending' });
    await writeLocalDb(db);
    return { ok: true };
  },

  async approveRequest(requestId: string) {
    const isSupabaseAvailable = await checkSupabaseAvailable('procurement_requests');

    if (isSupabaseAvailable) {
      try {
        await supabase.from('procurement_requests').update({ status: 'Approved' }).eq('id', requestId);
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
  },

  async issuePo(requestId: string, vendorName: string) {
    const isSupabaseAvailable = await checkSupabaseAvailable('procurement_orders');
    const poId = `PO-${Math.floor(100 + Math.random() * 900)}`;

    const db = await readLocalDb();
    const req = db.requests.find((r: any) => r.id === requestId) || {};

    if (isSupabaseAvailable) {
      try {
        await supabase.from('procurement_orders').insert({
          id: poId,
          request_id: requestId,
          item: req.item || 'Generic Item',
          qty: req.qty || 1,
          cost: req.cost || 0,
          vendor: vendorName,
          status: 'Issued'
        });
        await supabase.from('procurement_requests').update({ status: 'PO Issued' }).eq('id', requestId);
        return { ok: true };
      } catch (err) {
        console.warn('Supabase write failed, falling back to local database:', err);
      }
    }

    // Local Database Fallback
    db.orders.unshift({
      id: poId,
      requestId,
      item: req.item || 'Generic Item',
      qty: req.qty || 1,
      cost: req.cost || 0,
      vendor: vendorName,
      status: 'Issued'
    });
    const reqIdx = db.requests.findIndex((r: any) => r.id === requestId);
    if (reqIdx !== -1) {
      db.requests[reqIdx].status = 'PO Issued';
    }
    await writeLocalDb(db);
    return { ok: true };
  },

  async dispatchPo(orderId: string) {
    const isSupabaseAvailable = await checkSupabaseAvailable('procurement_orders');

    if (isSupabaseAvailable) {
      try {
        await supabase.from('procurement_orders').update({ status: 'Dispatched' }).eq('id', orderId);
        return { ok: true };
      } catch (err) {
        console.warn('Supabase write failed, falling back to local database:', err);
      }
    }

    // Local Database Fallback
    const db = await readLocalDb();
    const idx = db.orders.findIndex((o: any) => o.id === orderId);
    if (idx !== -1) {
      db.orders[idx].status = 'Dispatched';
      await writeLocalDb(db);
      return { ok: true };
    }
    return { ok: false };
  },

  async deliverPo(orderId: string) {
    const isSupabaseAvailable = await checkSupabaseAvailable('procurement_orders');

    const db = await readLocalDb();
    const order = db.orders.find((o: any) => o.id === orderId) || {};

    if (isSupabaseAvailable) {
      try {
        await supabase.from('procurement_orders').update({ status: 'Delivered' }).eq('id', orderId);
        // Update stock
        const { data: itemData } = await supabase.from('procurement_inventory').select('*').eq('item', order.item).maybeSingle();
        if (itemData) {
          await supabase.from('procurement_inventory').update({ qty: itemData.qty + order.qty }).eq('item', order.item);
        } else {
          await supabase.from('procurement_inventory').insert({ item: order.item, qty: order.qty, dept: 'General' });
        }
        return { ok: true };
      } catch (err) {
        console.warn('Supabase write failed, falling back to local database:', err);
      }
    }

    // Local Database Fallback
    const idx = db.orders.findIndex((o: any) => o.id === orderId);
    if (idx !== -1) {
      db.orders[idx].status = 'Delivered';
      const invIdx = db.inventory.findIndex((i: any) => i.item === order.item);
      if (invIdx !== -1) {
        db.inventory[invIdx].qty += order.qty;
      } else {
        db.inventory.push({
          id: `INV-${Math.floor(100 + Math.random() * 900)}`,
          item: order.item,
          qty: order.qty,
          dept: 'General'
        });
      }
      await writeLocalDb(db);
      return { ok: true };
    }
    return { ok: false };
  },

  async clearInvoice(orderId: string) {
    const isSupabaseAvailable = await checkSupabaseAvailable('procurement_orders');

    if (isSupabaseAvailable) {
      try {
        await supabase.from('procurement_orders').update({ status: 'Completed' }).eq('id', orderId);
        return { ok: true };
      } catch (err) {
        console.warn('Supabase write failed, falling back to local database:', err);
      }
    }

    // Local Database Fallback
    const db = await readLocalDb();
    const idx = db.orders.findIndex((o: any) => o.id === orderId);
    if (idx !== -1) {
      db.orders[idx].status = 'Completed';
      await writeLocalDb(db);
      return { ok: true };
    }
    return { ok: false };
  },

  async createVendor(name: string, email: string, category: string) {
    const isSupabaseAvailable = await checkSupabaseAvailable('procurement_vendors');
    const id = `VEN-${Math.floor(100 + Math.random() * 900)}`;

    if (isSupabaseAvailable) {
      try {
        await supabase.from('procurement_vendors').insert({ id, name, email, category });
        return { ok: true };
      } catch (err) {
        console.warn('Supabase write failed, falling back to local database:', err);
      }
    }

    // Local Database Fallback
    const db = await readLocalDb();
    db.vendors.push({ id, name, email, category });
    await writeLocalDb(db);
    return { ok: true };
  }
};
