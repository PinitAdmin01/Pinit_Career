import { supabase } from '@/lib/supabaseClient';
import { tableExists as checkSupabaseAvailable } from '@/lib/services/supabaseTable';
import { readLocalJson, writeLocalJson } from '@/lib/services/localJsonDb';

const DB_FILE = 'src/lib/data/admin_db.json';

// Interface types
export interface UserRow {
  id: string;
  display_name: string;
  username: string;
  role: string;
  ats_score: number;
  trust_score: number;
  pins: number;
  created_at: string;
  suspended?: boolean;
}

export interface AuditEntry {
  adminId: string;
  action: string;
  targetId?: string;
  meta?: Record<string, any>;
  timestamp: string;
}

export interface DashboardData {
  totalUsers: number;
  activeSessions: number;
  pendingAlerts: number;
  recentActions: AuditEntry[];
}

export interface PlatformStats {
  totalUsers: number;
  activeUsers: number;
  avgAtsScore: string | number;
  avgTrustScore: string | number;
  totalPinsDistributed: number;
}

// Read local JSON database
async function readLocalDb(): Promise<any> {
  return await readLocalJson(DB_FILE, { users: [], audit: [], stats: {} });
}

// Write local JSON database
async function writeLocalDb(data: any): Promise<void> {
  await writeLocalJson(DB_FILE, data);
}

// ============================================================================
// 1. DATA ACCESS LAYER (DAL) — Raw Queries to Supabase / Local Fallback
// ============================================================================
// DEF-057 Fix: Align admin queries strictly to canonical 'users' table
export const adminDataAccess = {
  async fetchRawDashboardCounts(): Promise<{ totalUsers: number; activeSessions: number; pendingAlerts: number }> {
    const isAvailable = await checkSupabaseAvailable('users');
    if (isAvailable) {
      try {
        const { count: totalUsers } = await supabase.from('users').select('*', { count: 'exact', head: true });
        
        let pendingAlerts = 0;
        if (await checkSupabaseAvailable('grievances')) {
          const { count } = await supabase.from('grievances').select('*', { count: 'exact', head: true }).eq('status', 'PENDING');
          pendingAlerts = count || 0;
        }

        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        let activeSessions = totalUsers || 0;
        try {
          const { count: activeCount } = await supabase.from('users').select('*', { count: 'exact', head: true }).gte('last_sign_in_at', twentyFourHoursAgo);
          if (activeCount !== null && activeCount !== undefined) {
            activeSessions = activeCount;
          }
        } catch {
          // fallback to total count if column not present
        }

        return {
          totalUsers: totalUsers || 0,
          activeSessions,
          pendingAlerts
        };
      } catch (err) {
        console.warn('Supabase dashboard query failed, using local db:', err);
      }
    }

    const db = await readLocalDb();
    return {
      totalUsers: db.users?.length || 0,
      activeSessions: db.users?.length || 0,
      pendingAlerts: 0
    };
  },

  async fetchRawUsers(): Promise<any[]> {
    const isAvailable = await checkSupabaseAvailable('users');
    if (isAvailable) {
      try {
        const { data: usersData, error } = await supabase.from('users').select('*').order('created_at', { ascending: false });
        if (!error && usersData) {
          return usersData;
        }
      } catch (err) {
        console.warn('Supabase users query failed, using local db:', err);
      }
    }

    const db = await readLocalDb();
    return db.users || [];
  },

  async fetchRawPlatformProfiles(): Promise<{ profiles: any[] | null; fallbackStats?: any }> {
    const isAvailable = await checkSupabaseAvailable('users');
    if (isAvailable) {
      try {
        const { data: profiles } = await supabase.from('users').select('ats_score, trust_score, pins, role');
        if (profiles) {
          return { profiles };
        }
      } catch (err) {
        console.warn('Supabase stats query failed, using local db:', err);
      }
    }

    const db = await readLocalDb();
    return { profiles: null, fallbackStats: db.stats || {} };
  },

  async fetchRawAuditLog(): Promise<any[]> {
    const isSupabaseAvailable = await checkSupabaseAvailable('admin_audit_log');
    if (isSupabaseAvailable) {
      try {
        const { data: audit } = await supabase.from('admin_audit_log').select('*').order('timestamp', { ascending: false });
        if (audit) return audit;
      } catch (err) {
        console.warn('Supabase read failed, falling back to local database:', err);
      }
    }

    const db = await readLocalDb();
    return db.audit || [];
  },

  async insertRawAuditEntry(entry: { adminId: string; action: string; targetId?: string; meta?: any }): Promise<void> {
    const isSupabaseAvailable = await checkSupabaseAvailable('admin_audit_log');
    if (isSupabaseAvailable) {
      try {
        const res = await supabase.from('admin_audit_log').insert({
          admin_id: entry.adminId,
          action: entry.action,
          target_id: entry.targetId,
          meta: entry.meta || {}
        });
        if (!res.error) return;
        console.warn('Supabase write error, falling back to local db:', res.error.message);
      } catch (err) {
        console.warn('Supabase write failed, falling back to local database:', err);
      }
    }

    const db = await readLocalDb();
    const newEntry = {
      adminId: entry.adminId,
      action: entry.action,
      targetId: entry.targetId,
      meta: entry.meta,
      timestamp: new Date().toISOString()
    };
    db.audit = db.audit || [];
    db.audit.unshift(newEntry);
    await writeLocalDb(db);
  },

  async fetchRawRoleUserCount(targetRole?: string): Promise<number> {
    const isAvailable = await checkSupabaseAvailable('users');
    if (isAvailable) {
      try {
        let query = supabase.from('users').select('count', { count: 'exact', head: true });
        if (targetRole) query = query.eq('role', targetRole);
        const { count } = await query;
        return count || 0;
      } catch {}
    }

    const db = await readLocalDb();
    return (db.users || []).filter((u: any) => !targetRole || u.role === targetRole).length;
  }
};

// ============================================================================
// 2. SERIALIZATION & TRANSFORMER LAYER (Pure Response Mappers)
// ============================================================================
export const adminSerializer = {
  serializeDashboard(counts: { totalUsers: number; activeSessions: number; pendingAlerts: number }, recentActions: AuditEntry[]): DashboardData {
    return {
      totalUsers: counts.totalUsers,
      activeSessions: counts.activeSessions,
      pendingAlerts: counts.pendingAlerts,
      recentActions: recentActions.slice(0, 5)
    };
  },

  serializeUserRows(rawRows: any[]): UserRow[] {
    return rawRows.map(u => ({
      id: u.id,
      display_name: u.display_name || u.full_name || u.email?.split('@')[0] || 'User',
      username: u.username || u.email?.split('@')[0] || u.id,
      role: u.role || 'student',
      ats_score: u.ats_score || 0,
      trust_score: u.trust_score || 0,
      pins: u.pins || 0,
      created_at: u.created_at || new Date().toISOString(),
      suspended: !!u.suspended
    }));
  },

  serializePlatformStats(profiles: any[] | null, fallbackStats?: any): PlatformStats {
    if (profiles) {
      const totalUsers = profiles.length;
      const avgAts = totalUsers ? (profiles.reduce((acc, p) => acc + (p.ats_score || 0), 0) / totalUsers).toFixed(1) : 0;
      const avgTrust = totalUsers ? (profiles.reduce((acc, p) => acc + (p.trust_score || 0), 0) / totalUsers).toFixed(1) : 0;
      const totalPins = profiles.reduce((acc, p) => acc + (p.pins || 0), 0);
      return {
        totalUsers,
        activeUsers: totalUsers,
        avgAtsScore: avgAts,
        avgTrustScore: avgTrust,
        totalPinsDistributed: totalPins
      };
    }
    return fallbackStats || {
      totalUsers: 0,
      activeUsers: 0,
      avgAtsScore: 0,
      avgTrustScore: 0,
      totalPinsDistributed: 0
    };
  },

  serializeAuditEntries(rawAudit: any[]): AuditEntry[] {
    return (rawAudit || []).map(a => ({
      adminId: a.admin_id || a.adminId || 'Admin',
      action: a.action || 'System Action',
      targetId: a.target_id || a.targetId || 'All',
      meta: a.meta || {},
      timestamp: a.timestamp || new Date().toISOString()
    }));
  }
};

// ============================================================================
// 3. SERVICE FACADE (Public Orchestrator)
// ============================================================================
export const adminService = {
  async getDashboard(): Promise<DashboardData> {
    const [counts, auditRes] = await Promise.all([
      adminDataAccess.fetchRawDashboardCounts(),
      this.getAuditLog()
    ]);
    return adminSerializer.serializeDashboard(counts, auditRes.log);
  },

  async getUsers(): Promise<{ users: UserRow[] }> {
    const rawUsers = await adminDataAccess.fetchRawUsers();
    return { users: adminSerializer.serializeUserRows(rawUsers) };
  },

  async getPlatformStats(): Promise<PlatformStats> {
    const { profiles, fallbackStats } = await adminDataAccess.fetchRawPlatformProfiles();
    return adminSerializer.serializePlatformStats(profiles, fallbackStats);
  },

  async getAuditLog(): Promise<{ log: AuditEntry[] }> {
    const rawAudit = await adminDataAccess.fetchRawAuditLog();
    return { log: adminSerializer.serializeAuditEntries(rawAudit) };
  },

  async logAction(adminId: string, action: string, targetId?: string, meta?: any): Promise<{ ok: boolean }> {
    await adminDataAccess.insertRawAuditEntry({ adminId, action, targetId, meta });
    return { ok: true };
  },

  async broadcast(adminId: string, title: string, message: string, type: string, targetRole: string): Promise<{ sent: number }> {
    await this.logAction(adminId, 'Broadcasting Announcement', targetRole || 'All Users', { title, message, type });
    const count = await adminDataAccess.fetchRawRoleUserCount(targetRole);
    return { sent: count };
  }
};
