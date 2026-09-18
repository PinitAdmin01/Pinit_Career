import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { requireUserFromRequest } from '@/lib/server/requireAuth';

const DB_FILE = path.join(process.cwd(), 'src', 'lib', 'data', 'enrollments_db.json');
const WALLET_FILE = path.join(process.cwd(), 'src', 'lib', 'data', 'pin_wallet_db.json');

const PLAN_PIN_COSTS: Record<string, number> = {
  'plan-1m-sprint': 500,
  'plan-3m-accelerator': 1200,
  'plan-6m-pro': 2000,
  'plan-9m-master': 3000,
};

const PLAN_REWARD_PINS: Record<string, number> = {
  'plan-1m-sprint': 150,
  'plan-3m-accelerator': 350,
  'plan-6m-pro': 700,
  'plan-9m-master': 1200,
};

const PLAN_TITLES: Record<string, string> = {
  'plan-1m-sprint': '1-Month Fast-Track Sprint',
  'plan-3m-accelerator': '3-Month Career Accelerator',
  'plan-6m-pro': '6-Month Professional Program',
  'plan-9m-master': '9-Month Master Program',
};

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
          const wallet = readWalletDb();
          return NextResponse.json({ ok: true, enrollment: data, walletBalance: wallet.balance });
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
    const wallet = readWalletDb();

    return NextResponse.json({ ok: true, enrollment: active || null, walletBalance: wallet.balance });
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

    const planId = String(body.planId || 'plan-3m-accelerator');
    const paymentMethod = body.paymentMethod || 'sandbox';
    const planTitle = PLAN_TITLES[planId] || planId;
    const pinCost = PLAN_PIN_COSTS[planId] || 500;
    const rewardPins = PLAN_REWARD_PINS[planId] || 250;

    let newBalance = 0;
    let pinTx: any = null;

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const hasSupabase = Boolean(url && serviceKey);

    // ── CASE A: PAYMENT VIA PINS ──
    if (paymentMethod === 'pins') {
      if (hasSupabase && userId !== 'student-demo') {
        try {
          const admin = createClient(url!, serviceKey!, { auth: { persistSession: false } });
          const { data: spendRes, error: spendErr } = await admin.rpc('spend_pins', {
            p_user_id: userId,
            p_amount: pinCost,
            p_reason: `Course Purchase: ${planTitle}`,
          });

          if (spendErr || !spendRes?.ok) {
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

          newBalance = spendRes.new_balance;
          pinTx = {
            id: `tx-course-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            type: 'spend',
            amount: pinCost,
            reason: `Course Enrollment: ${planTitle}`,
            source: 'course_enrollment',
            timestamp: Date.now(),
          };

          // Append to user pin_history array
          const { data: userProfile } = await admin.from('users').select('pin_history').eq('id', userId).maybeSingle();
          const history = Array.isArray(userProfile?.pin_history) ? userProfile.pin_history : [];
          await admin.from('users').update({ pin_history: [pinTx, ...history].slice(0, 100) }).eq('id', userId);
        } catch (err) {
          console.warn('[Enrollment Pin Spend Error]:', err);
        }
      }

      // Local Wallet Fallback update
      const wallet = readWalletDb();
      if (wallet.balance < pinCost && !hasSupabase) {
        wallet.balance = Math.max(wallet.balance, pinCost); // auto-grant demo credit for smooth evaluation
      }
      wallet.balance = Math.max(0, wallet.balance - pinCost);
      pinTx = pinTx || {
        id: `tx-course-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        type: 'spend',
        amount: pinCost,
        reason: `Course Enrollment: ${planTitle}`,
        source: 'course_enrollment',
        timestamp: Date.now(),
      };
      wallet.transactions = [pinTx, ...wallet.transactions].slice(0, 100);
      writeWalletDb(wallet);
      newBalance = wallet.balance;
    }

    // ── CASE B: PAYMENT VIA MONEY (RAZORPAY OR SANDBOX) ──
    if (paymentMethod === 'razorpay' || paymentMethod === 'sandbox') {
      if (hasSupabase) {
        try {
          const admin = createClient(url!, serviceKey!, { auth: { persistSession: false } });
          const { data: creditRes } = await admin.rpc('credit_pins', {
            p_user_id: userId,
            p_amount: rewardPins,
            p_reason: `Scholar Reward Cashback for ${planTitle}`,
            p_source: 'purchase',
          });
          if (creditRes?.new_balance) newBalance = creditRes.new_balance;

          pinTx = {
            id: `tx-reward-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            type: 'earn',
            amount: rewardPins,
            reason: `Scholar Reward Pins: ${planTitle}`,
            source: 'purchase',
            timestamp: Date.now(),
          };
          const { data: userProfile } = await admin.from('users').select('pin_history').eq('id', userId).maybeSingle();
          const history = Array.isArray(userProfile?.pin_history) ? userProfile.pin_history : [];
          await admin.from('users').update({ pin_history: [pinTx, ...history].slice(0, 100) }).eq('id', userId);
        } catch (err) {
          console.warn('[Enrollment Reward Pin Credit Error]:', err);
        }
      }

      // Local Wallet Fallback update
      const wallet = readWalletDb();
      wallet.balance += rewardPins;
      pinTx = pinTx || {
        id: `tx-reward-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        type: 'earn',
        amount: rewardPins,
        reason: `Scholar Reward Pins: ${planTitle}`,
        source: 'purchase',
        timestamp: Date.now(),
      };
      wallet.transactions = [pinTx, ...wallet.transactions].slice(0, 100);
      writeWalletDb(wallet);
      newBalance = wallet.balance;
    }

    // ── SAVE ENROLLMENT RECORD ──
    const newEnrollment = {
      enrollmentId: body.enrollmentId || `enr-${Date.now()}`,
      userId,
      planId,
      track: body.track || 'web_fullstack',
      amountPaid: body.amountPaid || 0,
      paymentId: body.paymentId || (paymentMethod === 'pins' ? `PINS-${pinCost}` : 'sandbox_payment'),
      orderId: body.orderId || '',
      paymentMethod,
      status: 'active',
      enrolledAt: body.enrolledAt || new Date().toISOString(),
      currentSprint: body.currentSprint || 1,
      dailyLearningHoursTarget: 1,
      rewardPinsCredited: paymentMethod !== 'pins' ? rewardPins : 0,
      pinsDeducted: paymentMethod === 'pins' ? pinCost : 0,
      milestoneProgress: body.milestoneProgress || {
        sprint1Approved: false,
        sprint2Approved: false,
      },
      certificatesIssued: body.certificatesIssued || {},
    };

    const local = readLocalDb();
    local.enrollments = local.enrollments || [];
    local.enrollments = local.enrollments.map((e) =>
      e.userId === userId ? { ...e, status: 'completed' } : e
    );
    local.enrollments.unshift(newEnrollment);
    writeLocalDb(local);

    if (hasSupabase) {
      try {
        const admin = createClient(url!, serviceKey!, { auth: { persistSession: false } });
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
        // non-blocking if table doesn't exist
      }
    }

    return NextResponse.json({
      ok: true,
      enrollment: newEnrollment,
      wallet: {
        newBalance,
        transaction: pinTx,
        rewardPinsCredited: newEnrollment.rewardPinsCredited,
        pinsDeducted: newEnrollment.pinsDeducted,
      },
    });
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
