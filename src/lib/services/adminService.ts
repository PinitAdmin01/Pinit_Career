import fs from 'fs';
import path from 'path';
import { supabase } from '@/lib/supabaseClient';

const DB_PATH = path.join(process.cwd(), 'src/lib/data/admin_db.json');

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

// Read local JSON database
function readLocalDb(): any {
  try {
    if (!fs.existsSync(DB_PATH)) {
      return { users: [], audit: [], stats: {} };
    }
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading local admin database file:', err);
    return { users: [], audit: [], stats: {} };
  }
}

// Write local JSON database
function writeLocalDb(data: any): void {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing local admin database file:', err);
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

export const adminService = {
  async getDashboard() {
    const isAvailable = await checkSupabaseAvailable('profiles');
    if (isAvailable) {
      try {
        const { count } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
        const auditRes = await this.getAuditLog();
        return {
          totalUsers: count || 0,
          activeSessions: count || 0,
          pendingAlerts: 0,
          recentActions: auditRes.log?.slice(0, 5) || []
        };
      } catch (err) {
        console.warn('Supabase dashboard query failed, using local db:', err);
      }
    }

    const db = readLocalDb();
    return {
      totalUsers: db.users.length,
      activeSessions: db.users.length,
      pendingAlerts: 0,
      recentActions: db.audit.slice(0, 5)
    };
  },

  async getUsers() {
    const isAvailable = await checkSupabaseAvailable('profiles');
    if (isAvailable) {
      try {
        const { data: usersData, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
        if (!error && usersData) {
          return {
            users: usersData.map(u => ({
              id: u.id,
              display_name: u.display_name || u.full_name || u.email?.split('@')[0] || 'User',
              username: u.username || u.email?.split('@')[0] || u.id,
              role: u.role || 'student',
              ats_score: u.ats_score || 0,
              trust_score: u.trust_score || 0,
              pins: u.pins || 0,
              created_at: u.created_at || new Date().toISOString(),
              suspended: !!u.suspended
            }))
          };
        }
      } catch (err) {
        console.warn('Supabase users query failed, using local db:', err);
      }
    }

    const db = readLocalDb();
    return {
      users: db.users || []
    };
  },

  async getPlatformStats() {
    const isAvailable = await checkSupabaseAvailable('profiles');
    if (isAvailable) {
      try {
        const { data: profiles } = await supabase.from('profiles').select('ats_score, trust_score, pins, role');
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
      } catch (err) {
        console.warn('Supabase stats query failed, using local db:', err);
      }
    }

    const db = readLocalDb();
    return db.stats || {};
  },

  async getAuditLog() {
    const isSupabaseAvailable = await checkSupabaseAvailable('admin_audit_log');

    if (isSupabaseAvailable) {
      try {
        const { data: audit } = await supabase.from('admin_audit_log').select('*').order('timestamp', { ascending: false });
        return {
          log: (audit || []).map(a => ({
            adminId: a.admin_id || a.adminId || 'Admin',
            action: a.action || 'System Action',
            targetId: a.target_id || a.targetId || 'All',
            meta: a.meta || {},
            timestamp: a.timestamp || new Date().toISOString()
          }))
        };
      } catch (err) {
        console.warn('Supabase read failed, falling back to local database:', err);
      }
    }

    const db = readLocalDb();
    return {
      log: db.audit || []
    };
  },

  async logAction(adminId: string, action: string, targetId?: string, meta?: any) {
    const isSupabaseAvailable = await checkSupabaseAvailable('admin_audit_log');

    if (isSupabaseAvailable) {
      try {
        await supabase.from('admin_audit_log').insert({
          admin_id: adminId,
          action,
          target_id: targetId,
          meta: meta || {}
        });
        return { ok: true };
      } catch (err) {
        console.warn('Supabase write failed, falling back to local database:', err);
      }
    }

    const db = readLocalDb();
    const newEntry = {
      adminId,
      action,
      targetId,
      meta,
      timestamp: new Date().toISOString()
    };
    db.audit.unshift(newEntry);
    writeLocalDb(db);
    return { ok: true };
  },

  async broadcast(adminId: string, title: string, message: string, type: string, targetRole: string) {
    await this.logAction(adminId, 'Broadcasting Announcement', targetRole || 'All Users', { title, message, type });

    const isAvailable = await checkSupabaseAvailable('profiles');
    if (isAvailable) {
      try {
        let query = supabase.from('profiles').select('count', { count: 'exact', head: true });
        if (targetRole) query = query.eq('role', targetRole);
        const { count } = await query;
        return { sent: count || 0 };
      } catch {}
    }

    const db = readLocalDb();
    const activeCount = db.users.filter((u: any) => !targetRole || u.role === targetRole).length;
    return { sent: activeCount };
  }
};
