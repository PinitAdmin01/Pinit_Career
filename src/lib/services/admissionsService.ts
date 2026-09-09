import { supabase } from '@/lib/supabaseClient';
import { tableExists as checkSupabaseAvailable } from '@/lib/services/supabaseTable';
import { readLocalJson, writeLocalJson } from '@/lib/services/localJsonDb';

const DB_FILE = 'src/lib/data/admissions_db.json';

// Interface types
export interface AdmissionsApplication {
  id: string;
  studentId: string;
  studentName: string;
  course: string;
  rank: number;
  status: string;
  docVerified: boolean;
}

export interface SeatMatrixItem {
  course: string;
  allocated: number;
  capacity: number;
}

// Read local JSON database
async function readLocalDb(): Promise<any> {
  return await readLocalJson(DB_FILE, { applications: [], matrix: [] });
}

// Write local JSON database
async function writeLocalDb(data: any): Promise<void> {
  await writeLocalJson(DB_FILE, data);
}

/**
 * Generates a public application reference.
 *
 * PREVIOUSLY: `APP-${Date.now()}` — a millisecond timestamp. Two problems.
 *
 *  1. SECURITY. Applications submitted close together get adjacent ids, so one
 *     known reference (an attacker's own) leaks its neighbours: scanning a few
 *     thousand milliseconds either side harvests everyone who applied that
 *     minute. The tracking endpoint is public by design, so the id was doing
 *     real access-control work it was never suited for.
 *
 *  2. HONESTY. The UI told users the format was `APP-2026-0105`, while the
 *     generator produced `APP-1757280000000`. An applicant following the
 *     on-screen example would never find their application.
 *
 * NOW: a random, non-sequential, human-typeable reference that matches what the
 * UI has been claiming all along. Ambiguous glyphs (0/O, 1/I) are excluded so
 * references survive being read aloud or copied off a printout.
 *
 * Existing timestamp-style ids keep working — lookup is unchanged and nothing
 * is migrated or deleted. This only affects references issued from now on.
 */
function generateApplicationId(): string {
  const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no O/0, no I/1
  const year = new Date().getFullYear();

  let suffix = '';
  const cryptoObj: Crypto | undefined =
    typeof globalThis !== 'undefined' ? (globalThis as any).crypto : undefined;

  if (cryptoObj && typeof cryptoObj.getRandomValues === 'function') {
    const bytes = new Uint8Array(6);
    cryptoObj.getRandomValues(bytes);
    for (const b of bytes) suffix += ALPHABET[b % ALPHABET.length];
  } else {
    // Fallback only where WebCrypto is unavailable. Lower entropy, but still
    // non-sequential — which is the property that matters here.
    for (let i = 0; i < 6; i++) {
      suffix += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
    }
  }

  return `APP-${year}-${suffix}`;
}

export const admissionsService = {
  async trackApplication(appId: string) {
    const normalizedId = appId.trim();
    if (!normalizedId) {
      return { application: null };
    }

    const isSupabaseAvailable = await checkSupabaseAvailable('admissions_applications');

    if (isSupabaseAvailable) {
      try {
        const { data: app } = await supabase.from('admissions_applications').select('*').eq('id', normalizedId).maybeSingle();
        if (app) {
          return {
            application: {
              id: app.id,
              studentId: app.student_id,
              studentName: app.student_name,
              course: app.course,
              rank: app.rank,
              status: app.status,
              docVerified: app.doc_verified,
            },
          };
        }
        return { application: null };
      } catch (err) {
        console.warn('Supabase read failed, falling back to local database:', err);
      }
    }

    const db = await readLocalDb();
    const found = (db.applications || []).find(
      (a: AdmissionsApplication) => a.id.toLowerCase() === normalizedId.toLowerCase()
    );
    return { application: found || null };
  },

  async getApplications() {
    const isSupabaseAvailable = await checkSupabaseAvailable('admissions_applications');

    if (isSupabaseAvailable) {
      try {
        const { data: apps } = await supabase.from('admissions_applications').select('*');
        return {
          applications: (apps || []).map(a => ({
            id: a.id,
            studentId: a.student_id,
            studentName: a.student_name,
            course: a.course,
            rank: a.rank,
            status: a.status,
            docVerified: a.doc_verified
          }))
        };
      } catch (err) {
        console.warn('Supabase read failed, falling back to local database:', err);
      }
    }

    // Local Database Fallback
    const db = await readLocalDb();
    return {
      applications: db.applications || []
    };
  },

  async getSeatMatrix() {
    const isSupabaseAvailable = await checkSupabaseAvailable('admissions_seat_matrix');

    if (isSupabaseAvailable) {
      try {
        const { data: matrix } = await supabase.from('admissions_seat_matrix').select('*');
        return {
          matrix: (matrix || []).map(m => ({
            course: m.course,
            allocated: m.allocated,
            capacity: m.capacity
          }))
        };
      } catch (err) {
        console.warn('Supabase read failed, falling back to local database:', err);
      }
    }

    // Local Database Fallback
    const db = await readLocalDb();
    return {
      matrix: db.matrix || []
    };
  },

  async verifyDoc(appId: string, action: 'approve' | 'reject') {
    const isSupabaseAvailable = await checkSupabaseAvailable('admissions_applications');

    if (isSupabaseAvailable) {
      try {
        const res = await supabase.from('admissions_applications').update({
          doc_verified: action === 'approve',
          status: action === 'approve' ? 'Documents Verified' : 'Rejected'
        }).eq('id', appId);
        if (res.error) throw new Error(res.error.message);
        return { ok: true };
      } catch (err) {
        console.warn('Supabase write failed, falling back to local database:', err);
      }
    }

    // Local Database Fallback
    const db = await readLocalDb();
    const idx = db.applications.findIndex((a: any) => a.id === appId);
    if (idx !== -1) {
      db.applications[idx].docVerified = action === 'approve';
      db.applications[idx].status = action === 'approve' ? 'Documents Verified' : 'Rejected';
      await writeLocalDb(db);
      return { ok: true };
    }
    return { ok: false };
  },

  async allocateSeats() {
    const isSupabaseAvailable = await checkSupabaseAvailable('admissions_applications');

    if (isSupabaseAvailable) {
      try {
        // Merit-based allocation from rank (lower rank number = better merit)
        const { data: apps } = await supabase.from('admissions_applications').select('*').eq('doc_verified', true).order('rank', { ascending: true });
        const { data: matrix } = await supabase.from('admissions_seat_matrix').select('*');

        const courseLimits: Record<string, { allocated: number; capacity: number }> = {};
        (matrix || []).forEach(m => {
          courseLimits[m.course] = { allocated: 0, capacity: m.capacity };
        });

        for (const app of (apps || [])) {
          const limit = courseLimits[app.course];
          if (limit && limit.allocated < limit.capacity) {
            limit.allocated++;
            const res1 = await supabase.from('admissions_applications').update({ status: 'Seat Allocated' }).eq('id', app.id);
            if (res1.error) throw new Error(res1.error.message);
          } else {
            const res2 = await supabase.from('admissions_applications').update({ status: 'Waiting List' }).eq('id', app.id);
            if (res2.error) throw new Error(res2.error.message);
          }
        }

        // Update seat matrix
        for (const course of Object.keys(courseLimits)) {
          const res3 = await supabase.from('admissions_seat_matrix').update({ allocated: courseLimits[course].allocated }).eq('course', course);
          if (res3.error) throw new Error(res3.error.message);
        }

        return { ok: true };
      } catch (err) {
        console.warn('Supabase seat allocation failed, falling back to local database:', err);
      }
    }

    // Local Database Fallback
    const db = await readLocalDb();
    const courseLimits: Record<string, { allocated: number; capacity: number }> = {};
    db.matrix.forEach((m: any) => {
      courseLimits[m.course] = { allocated: 0, capacity: m.capacity };
    });

    // Sort by rank ascending
    const verifiedApps = db.applications.filter((a: any) => a.docVerified).sort((a: any, b: any) => a.rank - b.rank);
    verifiedApps.forEach((app: any) => {
      const limit = courseLimits[app.course];
      if (limit && limit.allocated < limit.capacity) {
        limit.allocated++;
        app.status = 'Seat Allocated';
      } else {
        app.status = 'Waiting List';
      }
    });

    db.matrix.forEach((m: any) => {
      m.allocated = courseLimits[m.course].allocated;
    });

    await writeLocalDb(db);
    return { ok: true };
  },

  async apply(studentId: string, studentName: string, course: string, rank: number) {
    const isSupabaseAvailable = await checkSupabaseAvailable('admissions_applications');
    const id = generateApplicationId();
    const row = {
      id,
      studentId,
      studentName,
      course: course || 'Computer Science',
      rank: rank || 0,
      status: 'Submitted',
      docVerified: false,
    };
    if (isSupabaseAvailable) {
      try {
        const res = await supabase.from('admissions_applications').insert({
          id,
          student_id: studentId,
          student_name: studentName,
          course: row.course,
          rank: row.rank,
          status: row.status,
          doc_verified: false,
        });
        if (res.error) throw new Error(res.error.message);
        return { ok: true, application: row };
      } catch (err) {
        console.warn('Supabase write failed, falling back to local database:', err);
      }
    }
    const db = await readLocalDb();
    db.applications = db.applications || [];
    db.applications.unshift(row);
    await writeLocalDb(db);
    return { ok: true, application: row };
  },
};
