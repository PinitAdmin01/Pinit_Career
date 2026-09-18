import { supabase as defaultSupabase } from '@/lib/supabaseClient';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { tableExists as checkSupabaseAvailable } from '@/lib/services/supabaseTable';
import { generateTxId } from '@/lib/utils/transactionId';

function getFinanceDbClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  if (url && serviceKey) {
    return createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return defaultSupabase as SupabaseClient;
}

const supabase: SupabaseClient = new Proxy(defaultSupabase as any, {
  get(target, prop, receiver) {
    const client = getFinanceDbClient();
    const value = Reflect.get(client, prop, receiver);
    if (typeof value === 'function') {
      return value.bind(client);
    }
    return value;
  }
});

// Interface types
export interface FinanceInstallment {
  id: string;
  name: string;
  amount: number;
  deadline: string;
  status: string;
  paidOn: string | null;
  receiptId: string | null;
}

export interface StudentDues {
  totalTermFees: number;
  scholarshipWaiver: number;
  fineLevied: number;
  installments: FinanceInstallment[];
  appliedScholarships?: string[];
  ok?: boolean;
  error?: string;
  message?: string;
}

// In-flight concurrency locks backed by distributed database keys to survive multi-container / serverless deployments (Defect 029 & 035)
export const activePaymentLocks = new Set<string>();
export const activeScholarshipLocks = new Set<string>();

/**
 * Detects whether the code is running inside a serverless runtime (Vercel, AWS Lambda, production container)
 * where filesystem writes are prohibited and persistent database backing is strictly mandatory.
 */
export function isServerlessRuntime(): boolean {
  return (
    process.env.NODE_ENV === 'production' ||
    !!process.env.VERCEL ||
    !!process.env.AWS_LAMBDA_FUNCTION_NAME ||
    !!process.env.LAMBDA_TASK_ROOT ||
    !!process.env.NETLIFY ||
    process.env.SERVERLESS_RUNTIME === 'true'
  );
}

export async function acquireDistributedLock(lockKey: string, userId: string, ttlSeconds = 30): Promise<boolean> {
  if (activePaymentLocks.has(lockKey) || activeScholarshipLocks.has(lockKey)) {
    return false;
  }
  activePaymentLocks.add(lockKey);
  activeScholarshipLocks.add(lockKey);

  try {
    const isSupabase = await checkSupabaseAvailable('payment_idempotency_keys');
    if (isSupabase) {
      const now = new Date();
      const expiresAt = new Date(now.getTime() + ttlSeconds * 1000).toISOString();

      // Prune expired locks
      try {
        const { error: _pruneErr } = await supabase
          .from('payment_idempotency_keys')
          .delete()
          .lt('expires_at', now.toISOString());
      } catch { /* ignore prune errors */ }

      // Attempt atomic insert with created_at timestamp
      const { error } = await supabase
        .from('payment_idempotency_keys')
        .insert({
          key: lockKey,
          user_id: userId,
          locked_at: now.toISOString(),
          created_at: now.toISOString(),
          expires_at: expiresAt
        });

      if (error) {
        // Check if existing lock is older than 45 seconds (orphaned by crashed container)
        try {
          const { data: existing } = await supabase
            .from('payment_idempotency_keys')
            .select('key, locked_at, created_at, expires_at')
            .eq('key', lockKey)
            .maybeSingle();

          const lockTimestamp = existing?.created_at || existing?.locked_at;
          const isStale = lockTimestamp && (now.getTime() - new Date(lockTimestamp).getTime() >= 45 * 1000);
          const isPastExpiry = existing?.expires_at && new Date(existing.expires_at).getTime() <= now.getTime();

          if (existing && (isStale || isPastExpiry)) {
            // Auto-reclaim expired/orphaned lock
            const { error: _reclaimErr } = await supabase.from('payment_idempotency_keys').delete().eq('key', lockKey);
            const { error: retryError } = await supabase
              .from('payment_idempotency_keys')
              .insert({
                key: lockKey,
                user_id: userId,
                locked_at: now.toISOString(),
                created_at: now.toISOString(),
                expires_at: expiresAt
              });

            if (!retryError) {
              return true;
            }
          }
        } catch { /* ignore fallback query errors */ }

        // Another container holds an active unexpired lock
        activePaymentLocks.delete(lockKey);
        activeScholarshipLocks.delete(lockKey);
        return false;
      }
    } else {
      console.warn('⚠️ [CONCURRENCY NOTICE] `payment_idempotency_keys` table is unavailable. Operating under in-memory process-level idempotency lock.');
      return true;
    }
    return true;
  } catch (err) {
    console.warn('⚠️ [CONCURRENCY NOTICE] Exception during distributed lock check, falling back to in-memory lock:', err);
    return true;
  }
}

export async function releaseDistributedLock(lockKey: string): Promise<void> {
  activePaymentLocks.delete(lockKey);
  activeScholarshipLocks.delete(lockKey);
  try {
    const isSupabase = await checkSupabaseAvailable('payment_idempotency_keys');
    if (isSupabase) {
      const { error: _relErr } = await supabase
        .from('payment_idempotency_keys')
        .delete()
        .eq('key', lockKey);
    }
  } catch {
    // Cleanup ignore
  }
}

export interface FinanceTransaction {
  id: string;
  studentName: string;
  studentEmail: string;
  amount: number;
  finePaid: number;
  type: string;
  timestamp: string;
}

const DEFAULT_INSTALLMENTS: FinanceInstallment[] = [
  { id: 'INST-01', name: 'Semester Tuition Fee - Term 1', amount: 45000, deadline: '2025-08-30', status: 'Pending', paidOn: null, receiptId: null },
  { id: 'INST-02', name: 'Campus Facilities & Lab Fee', amount: 15000, deadline: '2025-10-15', status: 'Pending', paidOn: null, receiptId: null },
  { id: 'INST-03', name: 'Examination & Assessment Fee', amount: 5000, deadline: '2025-12-01', status: 'Pending', paidOn: null, receiptId: null }
];

const DEFAULT_SCHOLARSHIPS = [
  { id: 'SCH-MERIT', name: 'Merit Excellence Waiver', amount: 15000, criteria: 'CGPA >= 8.5' },
  { id: 'SCH-SPORTS', name: 'Athletics & Sports Fellowship', amount: 8000, criteria: 'University Athlete' }
];

// Ephemeral in-memory store strictly for local dev/testing when Supabase is offline.
// ZERO filesystem methods (readLocalJson, writeLocalJson, fs.writeFileSync) are ever invoked.
const inMemoryDues = new Map<string, StudentDues>();
const inMemoryTransactions: FinanceTransaction[] = [];

function getInMemoryDues(studentId: string): StudentDues {
  let dues = inMemoryDues.get(studentId);
  if (!dues) {
    dues = {
      totalTermFees: 65000,
      scholarshipWaiver: 0,
      fineLevied: 0,
      installments: DEFAULT_INSTALLMENTS.map(i => ({ ...i })),
      appliedScholarships: []
    };
    inMemoryDues.set(studentId, dues);
  }
  return dues;
}

function setInMemoryDues(studentId: string, dues: StudentDues) {
  inMemoryDues.set(studentId, dues);
}

function summarizeTransactions(transactions: Array<{ amount?: number; finePaid?: number; fine_paid?: number }>) {
  const collected = transactions.reduce((sum, t) => sum + Number(t.amount || 0) + Number(t.finePaid ?? t.fine_paid ?? 0), 0);
  const finesCollected = transactions.reduce((sum, t) => sum + Number(t.finePaid ?? t.fine_paid ?? 0), 0);
  return { projected: collected, collected, duesOutstanding: 0, finesCollected };
}

export const financeService = {
  async getStudentDues(studentId: string): Promise<StudentDues> {
    // 1. Check relational student_fee_dues schema
    const isRelationalAvailable = await checkSupabaseAvailable('student_fee_dues');
    if (isRelationalAvailable) {
      try {
        const { data: duesRow } = await supabase
          .from('student_fee_dues')
          .select('*')
          .eq('student_id', studentId)
          .maybeSingle();

        const { data: installmentsRows } = await supabase
          .from('fee_installments')
          .select('*')
          .eq('student_id', studentId)
          .order('deadline', { ascending: true });

        const { data: appliedRows } = await supabase
          .from('applied_scholarships')
          .select('scholarship_id')
          .eq('student_id', studentId);

        if (duesRow && installmentsRows && installmentsRows.length > 0) {
          return {
            totalTermFees: Number(duesRow.total_term_fees || 65000),
            scholarshipWaiver: Number(duesRow.scholarship_waiver || 0),
            fineLevied: Number(duesRow.fine_levied || 0),
            installments: installmentsRows.map((inst: any) => ({
              id: inst.installment_id,
              name: inst.name,
              amount: Number(inst.amount),
              deadline: inst.deadline,
              status: inst.status,
              paidOn: inst.paid_on,
              receiptId: inst.receipt_id,
            })),
            appliedScholarships: (appliedRows || []).map((a: any) => a.scholarship_id)
          };
        }
      } catch (err) {
        console.warn('[FinanceService] Supabase read from student_fee_dues failed:', err);
      }
    }

    // 2. Fallback to legacy finance_dues table (for existing deployments/tests)
    const isLegacyAvailable = await checkSupabaseAvailable('finance_dues');
    if (isLegacyAvailable) {
      try {
        const { data: record } = await supabase.from('finance_dues').select('*').eq('student_id', studentId).maybeSingle();
        if (record) {
          return {
            totalTermFees: Number(record.total_term_fees || 65000),
            scholarshipWaiver: Number(record.scholarship_waiver || 0),
            fineLevied: Number(record.fine_levied || 0),
            installments: record.installments || [],
            appliedScholarships: record.applied_scholarships || []
          };
        }
      } catch (err) {
        console.warn('[FinanceService] Supabase read from finance_dues failed:', err);
      }
    }

    // 3. Fail closed in serverless runtimes when database is unreachable
    if (isServerlessRuntime()) {
      console.error('[FinanceService] Database unavailable during getDues in serverless runtime; failing closed');
      return {
        ok: false,
        error: 'LIVE_DB_UNAVAILABLE',
        message: 'Live database persistence is unavailable in serverless runtime.',
        totalTermFees: 0,
        scholarshipWaiver: 0,
        fineLevied: 0,
        installments: []
      };
    }

    // 4. In-memory ephemeral fallback for local dev/testing without filesystem I/O
    console.warn('⚠️ [DEV WARNING] LIVE DATABASE PERSISTENCE DISABLED: Serving dues from ephemeral in-memory state. ZERO filesystem writes performed.');
    return getInMemoryDues(studentId);
  },

  async getDues(studentId: string): Promise<StudentDues> {
    return this.getStudentDues(studentId);
  },

  async payDue(studentId: string, studentName: string, installmentId: string, studentEmail?: string, paymentId?: string) {
    const lockKey = `${studentId}:${installmentId}`;
    const acquired = await acquireDistributedLock(lockKey, studentId, 30);
    if (!acquired) {
      return { ok: false, error: 'PAYMENT_IN_PROGRESS', message: 'Payment is already processing for this installment across server clusters' };
    }

    try {
      const isSupabaseAvailable = await checkSupabaseAvailable('finance_dues');
      const transactionId = paymentId ? paymentId.trim() : generateTxId('rcp');
      const email = studentEmail?.trim() || '';

      if (!isSupabaseAvailable) {
        if (isServerlessRuntime()) {
          console.error('[FinanceService] Database unavailable during payDue; failing closed');
          return {
            ok: false,
            error: 'PAYMENT_GATEWAY_RECORDING_FAILED',
            message: 'Payment recording failed. Database record could not be confirmed.'
          };
        }
        // Local/Testing in-memory dues update
        const inMem = getInMemoryDues(studentId);
        const inst = (inMem.installments || []).find((i: any) => String(i.id) === String(installmentId));
        if (inst) {
          if (inst.status === 'Paid') {
            return { ok: true, receiptId: inst.receiptId || transactionId, alreadyPaid: true };
          }
          inst.status = 'Paid';
          inst.paidOn = new Date().toISOString();
          inst.receiptId = transactionId;
          return { ok: true, receiptId: transactionId };
        }
        return { ok: false, error: 'INSTALLMENT_NOT_FOUND', message: 'Installment not found in in-memory dues.' };
      }

      // Use elevated campus admin client to execute process_fee_installment_payment stored procedure
      const client = await (async () => {
        try {
          const { getCampusSupabaseClient } = await import('@/lib/services/supabaseTable');
          return await getCampusSupabaseClient();
        } catch {
          return supabase;
        }
      })();

      try {
        const { data: rpcRes, error: rpcErr } = await client.rpc('process_fee_installment_payment', {
          p_student_id: studentId,
          p_student_name: studentName,
          p_student_email: email,
          p_installment_id: installmentId,
          p_transaction_id: transactionId
        });

        if (!rpcErr && rpcRes) {
          if (rpcRes.already_paid) {
            return { ok: true, receiptId: rpcRes.receipt_id || transactionId, alreadyPaid: true };
          }
          if (rpcRes.ok) {
            return { ok: true, receiptId: rpcRes.receipt_id || transactionId };
          }
          return {
            ok: false,
            error: rpcRes.error || 'PAYMENT_FAILED',
            message: rpcRes.message || 'Installment payment could not be completed.'
          };
        }

        if (rpcErr) {
          console.warn('[FinanceService] process_fee_installment_payment RPC error, evaluating direct fallback:', rpcErr);
        }
      } catch (rpcEx) {
        console.warn('[FinanceService] process_fee_installment_payment threw:', rpcEx);
      }

      // Direct Supabase fallback if RPC is not deployed, with strict fail-closed
      const markPaid = (installments: FinanceInstallment[]) =>
        (installments || []).map((inst) => {
          if (inst.id !== installmentId) return inst;
          return {
            ...inst,
            status: 'Paid',
            paidOn: new Date().toISOString(),
            receiptId: transactionId
          };
        });

      const { data: record, error: duesFetchErr } = await client
        .from('finance_dues')
        .select('*')
        .eq('student_id', studentId)
        .maybeSingle();

      if (duesFetchErr || !record) {
        console.error('[FinanceService] Failed to query finance_dues for student:', duesFetchErr);
        return {
          ok: false,
          error: 'PAYMENT_GATEWAY_RECORDING_FAILED',
          message: 'Payment recording failed. Dues record not found or inaccessible.'
        };
      }

      const paid = (record.installments || []).find((inst: FinanceInstallment) => inst.id === installmentId);
      if (paid && paid.status === 'Paid') {
        return { ok: true, receiptId: paid.receiptId || transactionId, alreadyPaid: true };
      }

      const updatedInstallments = markPaid(record.installments || []);
      const fineLevied = Number(record.fine_levied || 0);
      const paidAmount = Number(paid?.amount || 0);

      const { error: updateErr } = await client.from('finance_dues').update({
        installments: updatedInstallments,
        fine_levied: 0
      }).eq('student_id', studentId);

      if (updateErr) {
        console.error('[FinanceService] Failed to update finance_dues:', updateErr);
        return {
          ok: false,
          error: 'PAYMENT_GATEWAY_RECORDING_FAILED',
          message: 'Payment recording failed. Dues state could not be updated.'
        };
      }

      // Also update normalized fee_installments table if available
      try {
        const hasFeeInst = await checkSupabaseAvailable('fee_installments');
        if (hasFeeInst) {
          await client
            .from('fee_installments')
            .update({
              status: 'Paid',
              paid_on: new Date().toISOString(),
              receipt_id: transactionId
            })
            .eq('student_id', studentId)
            .eq('installment_id', installmentId);
        }
      } catch (fiErr) {
        console.warn('[FinanceService] fee_installments update notice:', fiErr);
      }

      const { error: txErr } = await client.from('finance_transactions').insert({
        id: transactionId,
        student_id: studentId,
        student_name: studentName,
        student_email: email,
        amount: paidAmount,
        fine_paid: fineLevied,
        type: paid?.name || 'Fee installment'
      });

      if (txErr) {
        console.error('[FinanceService] Failed to insert finance_transactions:', txErr);
        return {
          ok: false,
          error: 'PAYMENT_GATEWAY_RECORDING_FAILED',
          message: 'Payment recording failed. Transaction audit could not be recorded.'
        };
      }

      // Record in append-only fee_payments ledger if table exists
      try {
        const feeRes = await client.from('fee_payments').insert({
          id: transactionId,
          student_id: studentId,
          installment_id: installmentId,
          amount: paidAmount,
          fine_paid: fineLevied,
          receipt_id: transactionId
        });
        if (feeRes.error) {
          console.warn('[FinanceService] fee_payments ledger insert notice:', feeRes.error.message);
        }
      } catch (ledgerErr) {
        console.warn('[FinanceService] fee_payments ledger insert notice:', ledgerErr);
      }

      return { ok: true, receiptId: transactionId };
    } finally {
      await releaseDistributedLock(lockKey);
    }
  },

  async reconcileFeePayments() {
    const isSupabaseAvailable = await checkSupabaseAvailable('finance_dues');
    if (!isSupabaseAvailable) {
      return {
        ok: true,
        report: {
          timestamp: new Date().toISOString(),
          status: 'CLEAN',
          mode: 'in_memory_or_offline',
          totalProcessed: 0,
          reconciled: 0,
          repaired: 0,
          discrepancies: []
        }
      };
    }

    const { getCampusSupabaseClient } = await import('@/lib/services/supabaseTable');
    const client = await getCampusSupabaseClient();

    const { data: payments, error: pErr } = await client
      .from('processed_payments')
      .select('*')
      .like('plan_id', 'installment_%');

    if (pErr) {
      return { ok: false, error: pErr.message };
    }

    let repaired = 0;
    const discrepancies: any[] = [];

    for (const p of payments || []) {
      const installmentId = p.plan_id.replace('installment_', '').trim();
      const userId = p.user_id;

      const { data: duesRecord } = await client
        .from('finance_dues')
        .select('*')
        .eq('student_id', userId)
        .maybeSingle();

      if (duesRecord) {
        const inst = (duesRecord.installments || []).find((i: any) => String(i.id) === String(installmentId));
        if (inst && inst.status !== 'Paid') {
          discrepancies.push({
            paymentId: p.payment_id,
            userId,
            installmentId,
            issue: 'PAYMENT_RECORDED_BUT_INSTALLMENT_DUE',
            repaired: true
          });

          const updatedInstallments = (duesRecord.installments || []).map((i: any) => {
            if (String(i.id) === String(installmentId)) {
              return {
                ...i,
                status: 'Paid',
                paidOn: p.created_at || new Date().toISOString(),
                receiptId: p.payment_id
              };
            }
            return i;
          });

          await client
            .from('finance_dues')
            .update({ installments: updatedInstallments })
            .eq('student_id', userId);

          try {
            const hasFeeInst = await checkSupabaseAvailable('fee_installments');
            if (hasFeeInst) {
              await client
                .from('fee_installments')
                .update({
                  status: 'Paid',
                  paid_on: p.created_at || new Date().toISOString(),
                  receipt_id: p.payment_id
                })
                .eq('student_id', userId)
                .eq('installment_id', installmentId);
            }
          } catch {}

          repaired++;
        }
      }
    }

    return {
      ok: true,
      report: {
        timestamp: new Date().toISOString(),
        status: discrepancies.length === 0 ? 'CLEAN' : 'REPAIRED_DISCREPANCIES',
        totalProcessed: (payments || []).length,
        reconciled: (payments || []).length - discrepancies.length,
        repaired,
        discrepancies
      }
    };
  },

  async getScholarships() {
    return {
      scholarships: DEFAULT_SCHOLARSHIPS
    };
  },

  async applyScholarship(studentId: string, scholarshipId: string) {
    const lockKey = `schol:${studentId}`;
    const acquired = await acquireDistributedLock(lockKey, studentId, 30);
    if (!acquired) {
      return { ok: false, error: 'SCHOLARSHIP_IN_PROGRESS', message: 'Scholarship application is currently processing across server clusters' };
    }

    try {
      const catalogScholarship = DEFAULT_SCHOLARSHIPS.find((s: any) => s.id === scholarshipId);
      const val = catalogScholarship ? Number(catalogScholarship.amount) : (scholarshipId === 'SCH-MERIT' ? 15000 : 8000);

      // 1. Relational schema check (student_fee_dues / applied_scholarships)
      const isRelationalAvailable = await checkSupabaseAvailable('student_fee_dues');
      if (isRelationalAvailable) {
        try {
          const { data: rpcRes, error: rpcErr } = await supabase.rpc('apply_student_scholarship_relational', {
            p_student_id: studentId,
            p_scholarship_id: scholarshipId,
            p_amount: val,
            p_academic_cycle: '2026-2027'
          });

          if (!rpcErr && rpcRes) {
            if (rpcRes.ok) {
              return { ok: true, waiver: Number(rpcRes.waiver || val) };
            }
            if (rpcRes.already_applied) {
              return { ok: false, waiver: Number(rpcRes.waiver || 0), alreadyApplied: true, message: rpcRes.message || 'Scholarship waiver already applied' };
            }
            return { ok: false, error: rpcRes.error, message: rpcRes.message };
          }
        } catch (relRpcErr) {
          console.warn('[FinanceService] apply_student_scholarship_relational notice:', relRpcErr);
        }
      }

      // 2. Legacy schema check (finance_dues / apply_student_scholarship RPC)
      const isSupabaseAvailable = await checkSupabaseAvailable('finance_dues');
      if (isSupabaseAvailable) {
        try {
          // DEF-035 FIX: Database-enforced atomic stored procedure with FOR UPDATE row locking and UNIQUE(student_id, academic_cycle)
          const { data: rpcRes, error: rpcErr } = await supabase.rpc('apply_student_scholarship', {
            p_student_id: studentId,
            p_scholarship_id: scholarshipId,
            p_amount: val,
            p_academic_cycle: '2026-2027'
          });

          if (!rpcErr && rpcRes) {
            if (rpcRes.ok) {
              return { ok: true, waiver: Number(rpcRes.waiver || val) };
            }
            if (rpcRes.already_applied) {
              return { ok: false, waiver: Number(rpcRes.waiver || 0), alreadyApplied: true, message: rpcRes.message || 'Scholarship waiver already applied' };
            }
            return { ok: false, error: rpcRes.error, message: rpcRes.message };
          }

          // Fallback direct table query with atomic validation
          const { data: record } = await supabase.from('finance_dues').select('*').eq('student_id', studentId).maybeSingle();
          if (record) {
            const appliedList: string[] = Array.isArray(record.applied_scholarships) ? record.applied_scholarships : [];
            if (appliedList.includes(scholarshipId) || (record.scholarship_waiver && Number(record.scholarship_waiver) > 0)) {
              return { ok: false, waiver: Number(record.scholarship_waiver), alreadyApplied: true, message: 'Scholarship waiver already applied' };
            }
            let remainingWaiver = val;
            const updatedInstallments = (record.installments || []).map((inst: FinanceInstallment) => {
              if (inst.status === 'Paid' || remainingWaiver <= 0) return inst;
              const currentAmount = Number(inst.amount || 0);
              const deduction = Math.min(currentAmount, remainingWaiver);
              remainingWaiver -= deduction;
              return { ...inst, amount: currentAmount - deduction };
            });

            const res = await supabase.from('finance_dues').update({
              scholarship_waiver: val,
              applied_scholarships: [...appliedList, scholarshipId],
              installments: updatedInstallments
            }).eq('student_id', studentId);
            if (res.error) throw new Error(res.error.message);

            return { ok: true, waiver: val };
          }
        } catch (err) {
          console.warn('Supabase write failed, falling back to local memory:', err);
        }
      }

      // 3. Fail closed in serverless runtimes
      if (isServerlessRuntime()) {
        console.error('[FinanceService] Database unavailable during applyScholarship in serverless runtime; failing closed');
        return {
          ok: false,
          error: 'LIVE_DB_UNAVAILABLE',
          message: 'Live database persistence is unavailable in serverless runtime.'
        };
      }

      // 4. In-memory ephemeral fallback for offline dev/tests (zero filesystem writes)
      console.warn('⚠️ [DEV WARNING] LIVE DATABASE PERSISTENCE DISABLED: Applying scholarship to in-memory state. ZERO filesystem writes performed.');
      const dues = getInMemoryDues(studentId);
      const appliedList: string[] = Array.isArray(dues.appliedScholarships) ? dues.appliedScholarships : [];
      if (appliedList.includes(scholarshipId) || (dues.scholarshipWaiver && Number(dues.scholarshipWaiver) > 0)) {
        return { ok: false, waiver: Number(dues.scholarshipWaiver), alreadyApplied: true, message: 'Scholarship waiver already applied' };
      }
      let remainingWaiver = val;
      dues.scholarshipWaiver = val;
      dues.appliedScholarships = [...appliedList, scholarshipId];
      dues.installments = (dues.installments || []).map((inst) => {
        if (inst.status === 'Paid' || remainingWaiver <= 0) return inst;
        const currentAmount = Number(inst.amount || 0);
        const deduction = Math.min(currentAmount, remainingWaiver);
        remainingWaiver -= deduction;
        return { ...inst, amount: currentAmount - deduction };
      });
      setInMemoryDues(studentId, dues);
      return { ok: true, waiver: val };
    } finally {
      await releaseDistributedLock(lockKey);
    }
  },

  async getAdminStats() {
    const isSupabaseAvailable = await checkSupabaseAvailable('finance_transactions');

    if (isSupabaseAvailable) {
      try {
        // DEF-036 FIX: Aggregate transactions directly in database engine via PostgreSQL RPC in O(1) memory
        const { data: aggData, error: aggErr } = await supabase.rpc('get_finance_dashboard_aggregates');

        // Bounded query: Fetch only recent 50 transactions for display
        const { data: recentTxs } = await supabase
          .from('finance_transactions')
          .select('*')
          .order('timestamp', { ascending: false })
          .limit(50);

        if (!aggErr && aggData) {
          const transactions = (recentTxs || []).map(t => ({
            id: t.id,
            studentName: t.student_name,
            studentEmail: t.student_email,
            amount: Number(t.amount || 0),
            finePaid: Number(t.fine_paid || 0),
            type: t.type,
            timestamp: t.timestamp || t.created_at
          }));

          return {
            projected: Number(aggData.projected ?? aggData.collected ?? 0),
            collected: Number(aggData.collected ?? 0),
            duesOutstanding: Number(aggData.dues_outstanding ?? 0),
            finesCollected: Number(aggData.fines_collected ?? 0),
            transactionCount: Number(aggData.transaction_count ?? transactions.length),
            transactions
          };
        }

        const transactions = recentTxs || [];
        const summary = summarizeTransactions(transactions);
        return {
          ...summary,
          transactions: transactions.map(t => ({
            id: t.id,
            studentName: t.student_name,
            studentEmail: t.student_email,
            amount: Number(t.amount || 0),
            finePaid: Number(t.fine_paid || 0),
            type: t.type,
            timestamp: t.timestamp || t.created_at
          }))
        };
      } catch (err) {
        console.warn('Supabase read failed, falling back to local memory:', err);
      }
    }

    if (isServerlessRuntime()) {
      return {
        projected: 0,
        collected: 0,
        duesOutstanding: 0,
        finesCollected: 0,
        transactionCount: 0,
        transactions: [],
        error: 'LIVE_DB_UNAVAILABLE'
      };
    }

    const transactions = inMemoryTransactions.slice(0, 50);
    return {
      ...summarizeTransactions(transactions),
      transactions
    };
  }
};
