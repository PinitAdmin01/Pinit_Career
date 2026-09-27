import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import {
  COURSE_PLAN_PIN_COSTS,
  COURSE_PLAN_REWARD_PINS,
  COURSE_PLAN_TITLES,
  appendPinHistory,
  buildCourseEnrollment,
  creditPins,
  findActiveCourseEnrollment,
  insertCourseEnrollment,
  isCoursePlanId,
  normalizeTrack,
  type CourseEnrollment,
  type CoursePaymentMethod,
  type CourseTrack,
} from '@/lib/server/courseEnrollments';

// Local JSON files are a development fallback only (no Supabase configured). They are
// never used in production: the serverless filesystem does not persist writes.
const DB_FILE = path.join(process.cwd(), 'src', 'lib', 'data', 'enrollments_db.json');
const WALLET_FILE = path.join(process.cwd(), 'src', 'lib', 'data', 'pin_wallet_db.json');

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

function readWalletDb(): { balance: number; transactions: any[] } {
  try {
    if (fs.existsSync(WALLET_FILE)) {
      return JSON.parse(fs.readFileSync(WALLET_FILE, 'utf8'));
    }
  } catch (err) {
    console.warn('Error reading pin_wallet_db.json:', err);
  }
  return { balance: 1500, transactions: [] };
}

function writeWalletDb(data: { balance: number; transactions: any[] }): void {
  try {
    const dir = path.dirname(WALLET_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(WALLET_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.warn('Error writing pin_wallet_db.json:', err);
  }
}

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return url && serviceKey ? createClient(url, serviceKey, { auth: { persistSession: false } }) : null;
}

const paymentsUnavailable = () => NextResponse.json(
  { ok: false, error: 'PAYMENTS_UNAVAILABLE', message: 'Course enrollment is temporarily unavailable. You have not been charged.' },
  { status: 503 }
);

function enrollmentResponse(
  enrollment: CourseEnrollment,
  wallet: { newBalance: number | null; pinsDeducted: number; rewardPinsCredited: number },
  alreadyEnrolled = false,
) {
  return NextResponse.json({ ok: true, enrollment, alreadyEnrolled, wallet });
}

export async function GET(req: Request) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error || !gated.user) {
      return NextResponse.json({ ok: false, error: 'UNAUTHORIZED' }, { status: 401 });
    }
    const userId = gated.user.id;

    const admin = getAdminClient();
    if (admin) {
      const found = await findActiveCourseEnrollment(admin, userId);
      if (found.error) {
        console.error('[api/quests/enrollment] GET lookup failed:', found.error);
        return NextResponse.json({ ok: false, error: 'ENROLLMENT_LOOKUP_FAILED' }, { status: 503 });
      }
      return NextResponse.json({ ok: true, enrollment: found.enrollment });
    }
    if (process.env.NODE_ENV === 'production') return paymentsUnavailable();

    const local = readLocalDb();
    const active = (local.enrollments || []).find((e) => e.userId === userId && e.status === 'active');
    return NextResponse.json({ ok: true, enrollment: active || null });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

/**
 * Enroll with Pins (or the development sandbox). Card payments are enrolled by
 * /api/payment/verify once Razorpay confirms them, never by this endpoint.
 * Idempotent: while an enrollment for the plan is active, repeat calls return it uncharged.
 */
export async function POST(req: Request) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error || !gated.user) {
      return NextResponse.json({ ok: false, error: 'UNAUTHORIZED' }, { status: 401 });
    }
    const userId = gated.user.id;
    const body = await req.json().catch(() => ({}));

    const planId = String(body.planId || '');
    if (!isCoursePlanId(planId)) {
      return NextResponse.json({ ok: false, error: 'UNKNOWN_PLAN', message: `Unknown course plan '${planId}'.` }, { status: 400 });
    }
    const paymentMethod = String(body.paymentMethod || '');
    if (paymentMethod === 'razorpay') {
      return NextResponse.json(
        { ok: false, error: 'CARD_PAYMENT_VIA_VERIFY', message: 'Card payments are enrolled when the payment is verified.' },
        { status: 400 }
      );
    }
    if (paymentMethod !== 'pins' && paymentMethod !== 'sandbox') {
      return NextResponse.json({ ok: false, error: 'INVALID_PAYMENT_METHOD' }, { status: 400 });
    }
    if (paymentMethod === 'sandbox' && process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { ok: false, error: 'SANDBOX_PAYMENT_DISABLED', message: 'Sandbox payment is disabled in production.' },
        { status: 400 }
      );
    }
    const method = paymentMethod as Exclude<CoursePaymentMethod, 'razorpay'>;
    const track = normalizeTrack(body.track);

    const admin = getAdminClient();
    if (!admin) {
      if (process.env.NODE_ENV === 'production') return paymentsUnavailable();
      return enrollLocally(userId, planId, track, method);
    }

    const existing = await findActiveCourseEnrollment(admin, userId, planId);
    if (existing.error) {
      console.error('[api/quests/enrollment] lookup failed:', existing.error);
      return paymentsUnavailable();
    }
    if (existing.enrollment) {
      return enrollmentResponse(existing.enrollment, { newBalance: null, pinsDeducted: 0, rewardPinsCredited: 0 }, true);
    }

    const title = COURSE_PLAN_TITLES[planId] || planId;
    const pinCost = COURSE_PLAN_PIN_COSTS[planId];
    let newBalance: number | null = null;

    if (method === 'pins') {
      const { data: spendRes, error: spendErr } = await admin.rpc('spend_pins', {
        p_user_id: userId,
        p_amount: pinCost,
        p_reason: `Course Purchase: ${title}`,
      });
      if (spendErr) {
        console.error('[api/quests/enrollment] spend_pins failed:', spendErr.message);
        return paymentsUnavailable();
      }
      if (!spendRes?.ok) {
        return NextResponse.json(
          {
            ok: false,
            error: spendRes?.reason || 'INSUFFICIENT_PINS',
            message: `Insufficient pins balance (${spendRes?.current_balance || 0} pins available, ${pinCost} pins required).`,
            currentBalance: spendRes?.current_balance ?? 0,
          },
          { status: 402 }
        );
      }
      newBalance = typeof spendRes.new_balance === 'number' ? spendRes.new_balance : null;
    }

    const enrollment = buildCourseEnrollment({
      userId,
      planId,
      track,
      paymentMethod: method,
      paymentId: `${method === 'pins' ? 'PINS' : 'SANDBOX'}-${Date.now()}`,
      amountPaid: method === 'pins' ? pinCost : 0,
    });
    const inserted = await insertCourseEnrollment(admin, enrollment);

    if (!inserted.enrollment) {
      let refunded = false;
      if (method === 'pins') {
        const refund = await creditPins(admin, userId, pinCost, `Refund: ${title} enrollment could not be saved`, 'refund');
        refunded = refund.ok;
        if (!refund.ok) {
          console.error(`[api/quests/enrollment] REFUND FAILED: ${pinCost} pins for ${userId} (${planId}). Refund manually.`);
        }
      }
      if (inserted.duplicate) {
        // A concurrent request for the same plan won the unique index; this charge was refunded.
        const winner = await findActiveCourseEnrollment(admin, userId, planId);
        if (winner.enrollment) {
          return enrollmentResponse(winner.enrollment, { newBalance: null, pinsDeducted: 0, rewardPinsCredited: 0 }, true);
        }
      }
      console.error('[api/quests/enrollment] insert failed:', inserted.error);
      return NextResponse.json(
        {
          ok: false,
          error: 'ENROLLMENT_SAVE_FAILED',
          message: method === 'pins' && refunded
            ? 'Enrollment could not be saved. Your pins have been refunded.'
            : 'Enrollment could not be saved. Please contact support.',
        },
        { status: 500 }
      );
    }

    let rewardPinsCredited = 0;
    if (method === 'pins') {
      await appendPinHistory(admin, userId, { type: 'spend', amount: pinCost, reason: `Course Enrollment: ${title}`, source: 'course_enrollment' });
    } else {
      const reward = COURSE_PLAN_REWARD_PINS[planId] || 0;
      const credited = await creditPins(admin, userId, reward, `Scholar Reward Cashback for ${title}`, 'purchase');
      if (credited.ok) {
        rewardPinsCredited = reward;
        newBalance = credited.newBalance;
        await appendPinHistory(admin, userId, { type: 'earn', amount: reward, reason: `Scholar Reward Pins: ${title}`, source: 'purchase' });
      }
    }

    return enrollmentResponse(inserted.enrollment, {
      newBalance,
      pinsDeducted: inserted.enrollment.pinsDeducted,
      rewardPinsCredited,
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

/** Development-only enrollment against the local JSON files (no Supabase configured). */
function enrollLocally(userId: string, planId: string, track: CourseTrack, method: 'pins' | 'sandbox') {
  const local = readLocalDb();
  local.enrollments = local.enrollments || [];
  const existing = local.enrollments.find((e) => e.userId === userId && e.planId === planId && e.status === 'active');
  if (existing) {
    return enrollmentResponse(existing as CourseEnrollment, { newBalance: null, pinsDeducted: 0, rewardPinsCredited: 0 }, true);
  }

  const pinCost = COURSE_PLAN_PIN_COSTS[planId];
  const reward = COURSE_PLAN_REWARD_PINS[planId] || 0;
  const wallet = readWalletDb();
  if (method === 'pins') {
    if (wallet.balance < pinCost) {
      return NextResponse.json(
        { ok: false, error: 'INSUFFICIENT_PINS', message: `Insufficient pins balance (${wallet.balance} pins available, ${pinCost} pins required).` },
        { status: 402 }
      );
    }
    wallet.balance -= pinCost;
  } else {
    wallet.balance += reward;
  }
  writeWalletDb(wallet);

  const enrollment = buildCourseEnrollment({
    userId,
    planId,
    track,
    paymentMethod: method,
    paymentId: `${method === 'pins' ? 'PINS' : 'SANDBOX'}-${Date.now()}`,
    amountPaid: method === 'pins' ? pinCost : 0,
  });
  local.enrollments.unshift(enrollment);
  writeLocalDb(local);
  return enrollmentResponse(enrollment, {
    newBalance: wallet.balance,
    pinsDeducted: enrollment.pinsDeducted,
    rewardPinsCredited: method === 'pins' ? 0 : reward,
  });
}

export async function PATCH(req: Request) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error || !gated.user) {
      return NextResponse.json({ ok: false, error: 'UNAUTHORIZED' }, { status: 401 });
    }
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
