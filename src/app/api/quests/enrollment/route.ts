import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { requireUserFromRequest } from '@/lib/server/requireAuth';

const DB_FILE = path.join(process.cwd(), 'src', 'lib', 'data', 'enrollments_db.json');

function readLocalDb(): Record<string, any[]> {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Error reading enrollments_db.json:', err);
  }
  return { enrollments: [] };
}

function writeLocalDb(data: Record<string, any[]>): void {
  try {
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.warn('Error writing enrollments_db.json:', err);
  }
}

export async function GET(req: Request) {
  try {
    let userId = 'student-demo';
    const gated = await requireUserFromRequest(req).catch(() => null);
    if (gated && !gated.error && gated.user) {
      userId = gated.user.id;
    }

    // 1. Try Supabase if configured
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (url && serviceKey) {
      try {
        const admin = createClient(url, serviceKey, { auth: { persistSession: false } });
        const { data, error } = await admin
          .from('user_crash_enrollments')
          .select('*')
          .eq('user_id', userId)
          .eq('status', 'active')
          .order('enrolled_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (data && !error) {
          return NextResponse.json({ ok: true, enrollment: data });
        }
      } catch {
        // Fallback to local DB
      }
    }

    // 2. Local DB fallback
    const local = readLocalDb();
    const active = (local.enrollments || []).find(
      (e) => (e.userId === userId || userId === 'student-demo') && e.status === 'active'
    );

    return NextResponse.json({ ok: true, enrollment: active || null });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    let userId = body.userId || 'student-demo';
    const gated = await requireUserFromRequest(req).catch(() => null);
    if (gated && !gated.error && gated.user) {
      userId = gated.user.id;
    }

    const newEnrollment = {
      enrollmentId: body.enrollmentId || `enr-${Date.now()}`,
      userId,
      planId: body.planId,
      track: body.track || 'web_fullstack',
      amountPaid: body.amountPaid || 0,
      paymentId: body.paymentId || 'sandbox_payment',
      orderId: body.orderId || '',
      paymentMethod: body.paymentMethod || 'sandbox',
      status: 'active',
      enrolledAt: body.enrolledAt || new Date().toISOString(),
      currentSprint: body.currentSprint || 1,
      dailyLearningHoursTarget: 1,
      milestoneProgress: body.milestoneProgress || {
        sprint1Approved: false,
        sprint2Approved: false,
      },
      certificatesIssued: body.certificatesIssued || {},
    };

    // Save to local DB fallback
    const local = readLocalDb();
    local.enrollments = local.enrollments || [];
    // Archive older active enrollments for this user
    local.enrollments = local.enrollments.map((e) =>
      e.userId === userId ? { ...e, status: 'completed' } : e
    );
    local.enrollments.unshift(newEnrollment);
    writeLocalDb(local);

    // Try Supabase insert as well
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (url && serviceKey) {
      try {
        const admin = createClient(url, serviceKey, { auth: { persistSession: false } });
        await admin.from('user_crash_enrollments').insert({
          enrollment_id: newEnrollment.enrollmentId,
          user_id: userId,
          plan_id: newEnrollment.planId,
          track: newEnrollment.track,
          amount_paid: newEnrollment.amountPaid,
          payment_id: newEnrollment.paymentId,
          order_id: newEnrollment.orderId,
          payment_method: newEnrollment.paymentMethod,
          status: 'active',
          enrolled_at: newEnrollment.enrolledAt,
          current_sprint: newEnrollment.currentSprint,
          milestone_progress: newEnrollment.milestoneProgress,
          certificates_issued: newEnrollment.certificatesIssued,
        });
      } catch {
        // non-blocking if supabase table doesn't exist yet
      }
    }

    return NextResponse.json({ ok: true, enrollment: newEnrollment });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { enrollmentId, milestoneProgress, currentSprint } = body;
    if (!enrollmentId) {
      return NextResponse.json({ ok: false, error: 'Missing enrollmentId' }, { status: 400 });
    }

    const local = readLocalDb();
    local.enrollments = local.enrollments || [];
    const idx = local.enrollments.findIndex((e) => e.enrollmentId === enrollmentId);
    if (idx !== -1) {
      if (milestoneProgress) {
        local.enrollments[idx].milestoneProgress = {
          ...local.enrollments[idx].milestoneProgress,
          ...milestoneProgress,
        };
      }
      if (currentSprint) {
        local.enrollments[idx].currentSprint = currentSprint;
      }
      writeLocalDb(local);
    }

    return NextResponse.json({ ok: true, enrollment: idx !== -1 ? local.enrollments[idx] : null });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
