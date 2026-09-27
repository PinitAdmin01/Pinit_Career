/**
 * Server-side course (crash plan) enrollments, shared by:
 *  - POST /api/quests/enrollment  → Pins (and dev sandbox) purchases
 *  - POST /api/payment/verify     → Razorpay purchases, enrolled at verification time
 *
 * An enrollment is created exactly once per purchase, only after payment is confirmed,
 * and is stored in public.user_crash_enrollments (never in the serverless filesystem).
 */
import type { SupabaseClient } from '@supabase/supabase-js';

export const COURSE_PLAN_PIN_COSTS: Record<string, number> = {
  'plan-1m-sprint': 500,
  'plan-3m-accelerator': 1200,
  'plan-6m-pro': 2200,
  'plan-9m-master': 3500,
  'plan-12m-fellow': 4500,
  'plan-24m-master': 7500,
};

export const COURSE_PLAN_REWARD_PINS: Record<string, number> = {
  'plan-1m-sprint': 150,
  'plan-3m-accelerator': 350,
  'plan-6m-pro': 700,
  'plan-9m-master': 1200,
  'plan-12m-fellow': 1500,
  'plan-24m-master': 2500,
};

export const COURSE_PLAN_TITLES: Record<string, string> = {
  'plan-1m-sprint': '1-Month Fast-Track Sprint',
  'plan-3m-accelerator': '3-Month Career Accelerator',
  'plan-6m-pro': '6-Month Professional Program',
  'plan-9m-master': '9-Month Master Program',
  'plan-12m-fellow': '12-Month Advanced Industry Fellowship',
  'plan-24m-master': '24-Month Master Engineering & Degree Track',
};

export type CourseTrack = 'web_fullstack' | 'python_ai';
export type CoursePaymentMethod = 'razorpay' | 'pins' | 'sandbox';

export interface CourseEnrollment {
  enrollmentId: string;
  userId: string;
  planId: string;
  track: CourseTrack;
  amountPaid: number;
  paymentId: string;
  orderId: string;
  paymentMethod: CoursePaymentMethod;
  status: 'active' | 'completed' | 'paused';
  enrolledAt: string;
  currentSprint: number;
  dailyLearningHoursTarget: number;
  rewardPinsCredited: number;
  pinsDeducted: number;
  milestoneProgress: Record<string, unknown>;
  certificatesIssued: Record<string, unknown>;
}

interface EnrollmentRow {
  enrollment_id: string;
  user_id: string;
  plan_id: string;
  track: string;
  amount_paid: number | string;
  payment_id: string;
  order_id: string | null;
  payment_method: string;
  status: string;
  enrolled_at: string;
  current_sprint: number;
  daily_learning_hours_target: number;
  reward_pins_credited: number;
  pins_deducted: number;
  milestone_progress: Record<string, unknown> | null;
  certificates_issued: Record<string, unknown> | null;
}

const TABLE = 'user_crash_enrollments';

export function isCoursePlanId(planId: string): boolean {
  return Object.prototype.hasOwnProperty.call(COURSE_PLAN_PIN_COSTS, planId);
}

export function normalizeTrack(track: unknown): CourseTrack {
  return track === 'python_ai' ? 'python_ai' : 'web_fullstack';
}

export function toCourseEnrollment(row: EnrollmentRow): CourseEnrollment {
  return {
    enrollmentId: row.enrollment_id,
    userId: row.user_id,
    planId: row.plan_id,
    track: normalizeTrack(row.track),
    amountPaid: Number(row.amount_paid) || 0,
    paymentId: row.payment_id,
    orderId: row.order_id || '',
    paymentMethod: (['razorpay', 'pins', 'sandbox'].includes(row.payment_method) ? row.payment_method : 'sandbox') as CoursePaymentMethod,
    status: (['active', 'completed', 'paused'].includes(row.status) ? row.status : 'active') as CourseEnrollment['status'],
    enrolledAt: row.enrolled_at,
    currentSprint: row.current_sprint || 1,
    dailyLearningHoursTarget: row.daily_learning_hours_target || 1,
    rewardPinsCredited: row.reward_pins_credited || 0,
    pinsDeducted: row.pins_deducted || 0,
    milestoneProgress: row.milestone_progress || { sprint1Approved: false, sprint2Approved: false },
    certificatesIssued: row.certificates_issued || {},
  };
}

export function buildCourseEnrollment(input: {
  userId: string;
  planId: string;
  track: CourseTrack;
  paymentMethod: CoursePaymentMethod;
  paymentId: string;
  orderId?: string;
  amountPaid: number;
}): CourseEnrollment {
  return {
    enrollmentId: `enr-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    userId: input.userId,
    planId: input.planId,
    track: input.track,
    amountPaid: input.amountPaid,
    paymentId: input.paymentId,
    orderId: input.orderId || '',
    paymentMethod: input.paymentMethod,
    status: 'active',
    enrolledAt: new Date().toISOString(),
    currentSprint: 1,
    dailyLearningHoursTarget: 1,
    rewardPinsCredited: input.paymentMethod === 'pins' ? 0 : COURSE_PLAN_REWARD_PINS[input.planId] || 0,
    pinsDeducted: input.paymentMethod === 'pins' ? COURSE_PLAN_PIN_COSTS[input.planId] || 0 : 0,
    milestoneProgress: { sprint1Approved: false, sprint2Approved: false },
    certificatesIssued: {},
  };
}

function toRow(e: CourseEnrollment): EnrollmentRow {
  return {
    enrollment_id: e.enrollmentId,
    user_id: e.userId,
    plan_id: e.planId,
    track: e.track,
    amount_paid: e.amountPaid,
    payment_id: e.paymentId,
    order_id: e.orderId,
    payment_method: e.paymentMethod,
    status: e.status,
    enrolled_at: e.enrolledAt,
    current_sprint: e.currentSprint,
    daily_learning_hours_target: e.dailyLearningHoursTarget,
    reward_pins_credited: e.rewardPinsCredited,
    pins_deducted: e.pinsDeducted,
    milestone_progress: e.milestoneProgress,
    certificates_issued: e.certificatesIssued,
  };
}

type Lookup = { enrollment: CourseEnrollment | null; error: string | null };

export async function findActiveCourseEnrollment(admin: SupabaseClient, userId: string, planId?: string): Promise<Lookup> {
  let query = admin.from(TABLE).select('*').eq('user_id', userId).eq('status', 'active');
  if (planId) query = query.eq('plan_id', planId);
  const { data, error } = await query.order('enrolled_at', { ascending: false }).limit(1).maybeSingle();
  if (error) return { enrollment: null, error: error.message };
  return { enrollment: data ? toCourseEnrollment(data as EnrollmentRow) : null, error: null };
}

export async function findCourseEnrollmentByPayment(admin: SupabaseClient, userId: string, paymentId: string): Promise<Lookup> {
  const { data, error } = await admin.from(TABLE).select('*')
    .eq('user_id', userId).eq('payment_id', paymentId).limit(1).maybeSingle();
  if (error) return { enrollment: null, error: error.message };
  return { enrollment: data ? toCourseEnrollment(data as EnrollmentRow) : null, error: null };
}

/** `duplicate` is true when a unique index rejected the row (concurrent double purchase). */
export async function insertCourseEnrollment(
  admin: SupabaseClient,
  enrollment: CourseEnrollment,
): Promise<Lookup & { duplicate: boolean }> {
  const { data, error } = await admin.from(TABLE).insert(toRow(enrollment)).select('*').single();
  if (error) return { enrollment: null, error: error.message, duplicate: error.code === '23505' };
  return { enrollment: toCourseEnrollment(data as EnrollmentRow), error: null, duplicate: false };
}

export async function creditPins(
  admin: SupabaseClient,
  userId: string,
  amount: number,
  reason: string,
  source: string,
): Promise<{ ok: boolean; newBalance: number | null }> {
  const { data, error } = await admin.rpc('credit_pins', {
    p_user_id: userId,
    p_amount: amount,
    p_reason: reason,
    p_source: source,
  });
  if (error || !data?.ok) return { ok: false, newBalance: null };
  return { ok: true, newBalance: typeof data.new_balance === 'number' ? data.new_balance : null };
}

/** Best-effort passbook entry; balances are authoritative in the pins RPCs. */
export async function appendPinHistory(
  admin: SupabaseClient,
  userId: string,
  tx: { type: 'earn' | 'spend'; amount: number; reason: string; source: string },
): Promise<void> {
  try {
    const { data } = await admin.from('users').select('pin_history').eq('id', userId).maybeSingle();
    const history = Array.isArray(data?.pin_history) ? data.pin_history : [];
    const entry = {
      id: `tx-${tx.source}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      ...tx,
      timestamp: Date.now(),
    };
    await admin.from('users').update({ pin_history: [entry, ...history].slice(0, 100) }).eq('id', userId);
  } catch (err) {
    console.warn('[courseEnrollments] pin_history append failed:', err);
  }
}

/**
 * Card purchases: create the enrollment for a verified payment, once. Returns the
 * existing enrollment if this payment was already fulfilled (retry-safe), and credits
 * the scholar reward pins only when the enrollment is newly created.
 */
export async function fulfilCardCoursePurchase(
  admin: SupabaseClient,
  input: { userId: string; planId: string; track: CourseTrack; paymentId: string; orderId: string; amountPaid: number },
): Promise<{ enrollment: CourseEnrollment | null; rewardPinsCredited: number; error: string | null }> {
  const existing = await findCourseEnrollmentByPayment(admin, input.userId, input.paymentId);
  if (existing.error) return { enrollment: null, rewardPinsCredited: 0, error: existing.error };
  if (existing.enrollment) return { enrollment: existing.enrollment, rewardPinsCredited: 0, error: null };

  const enrollment = buildCourseEnrollment({ ...input, paymentMethod: 'razorpay' });
  const inserted = await insertCourseEnrollment(admin, enrollment);
  if (inserted.error || !inserted.enrollment) {
    if (inserted.duplicate) {
      const raced = await findCourseEnrollmentByPayment(admin, input.userId, input.paymentId);
      if (raced.enrollment) return { enrollment: raced.enrollment, rewardPinsCredited: 0, error: null };
    }
    return { enrollment: null, rewardPinsCredited: 0, error: inserted.error || 'ENROLLMENT_INSERT_FAILED' };
  }

  const reward = COURSE_PLAN_REWARD_PINS[input.planId] || 0;
  if (reward > 0) {
    const title = COURSE_PLAN_TITLES[input.planId] || input.planId;
    const credited = await creditPins(admin, input.userId, reward, `Scholar Reward Cashback for ${title}`, 'purchase');
    if (credited.ok) {
      await appendPinHistory(admin, input.userId, { type: 'earn', amount: reward, reason: `Scholar Reward Pins: ${title}`, source: 'purchase' });
    } else {
      console.error(`[courseEnrollments] Reward pins not credited for ${input.userId} (${input.planId}, ${input.paymentId}).`);
    }
    return { enrollment: inserted.enrollment, rewardPinsCredited: credited.ok ? reward : 0, error: null };
  }
  return { enrollment: inserted.enrollment, rewardPinsCredited: 0, error: null };
}
