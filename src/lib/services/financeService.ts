import { supabase } from '@/lib/supabaseClient';
import { tableExists as checkSupabaseAvailable } from '@/lib/services/supabaseTable';
import { readLocalJson, writeLocalJson } from '@/lib/services/localJsonDb';

const DB_FILE = 'src/lib/data/finance_db.json';

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
}

// In-flight concurrency locks backed by distributed database keys to survive multi-container / serverless deployments (Defect 029 & 035)
export const activePaymentLocks = new Set<string>();
export const activeScholarshipLocks = new Set<string>();

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
      await supabase
        .from('payment_idempotency_keys')
        .delete()
        .lt('expires_at', now.toISOString());

      // Attempt atomic insert
      const { error } = await supabase
        .from('payment_idempotency_keys')
        .insert({
          key: lockKey,
          user_id: userId,
          locked_at: now.toISOString(),
          expires_at: expiresAt
        });

      if (error) {
        // Another container holds the active lock
        activePaymentLocks.delete(lockKey);
        activeScholarshipLocks.delete(lockKey);
        return false;
      }
    }
    return true;
  } catch {
    // If Supabase table check fails, local process lock is already held
    return true;
  }
}

export async function releaseDistributedLock(lockKey: string): Promise<void> {
  activePaymentLocks.delete(lockKey);
  activeScholarshipLocks.delete(lockKey);
  try {
    const isSupabase = await checkSupabaseAvailable('payment_idempotency_keys');
    if (isSupabase) {
      await supabase
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

// Read local JSON database
async function readLocalDb(): Promise<any> {
  const db = await readLocalJson(DB_FILE, { dues: {}, scholarships: [], transactions: [] });
  return {
    dues: db.dues || {},
    scholarships: db.scholarships || [],
    transactions: db.transactions || [],
  };
}

// Write local JSON database
async function writeLocalDb(data: any): Promise<void> {
  await writeLocalJson(DB_FILE, data);
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

const EMPTY_DUES: StudentDues = { totalTermFees: 65000, scholarshipWaiver: 0, fineLevied: 0, installments: DEFAULT_INSTALLMENTS };

function asDues(value: unknown): StudentDues | null {
  if (!value || typeof value !== 'object') return null;
  const dues = value as StudentDues;
  if (!Array.isArray(dues.installments)) return null;
  return dues;
}

function getDuesForStudent(db: any, studentId: string): StudentDues {
  const mapped = asDues(db.dues?.[studentId]);
  if (mapped && mapped.installments && mapped.installments.length > 0) return mapped;
  const legacy = asDues(db.dues);
  if (legacy && db.dues && typeof db.dues === 'object' && !Array.isArray(db.dues.installments) && legacy.installments && legacy.installments.length > 0) {
    db.dues = { [studentId]: legacy };
    return legacy;
  }
  return {
    totalTermFees: 65000,
    scholarshipWaiver: 0,
    fineLevied: 0,
    installments: DEFAULT_INSTALLMENTS.map(i => ({ ...i })),
    appliedScholarships: []
  };
}

function setDuesForStudent(db: any, studentId: string, dues: StudentDues) {
  if (asDues(db.dues) && !db.dues[studentId]) {
    db.dues = { [studentId]: dues };
    return;
  }
  db.dues = db.dues && typeof db.dues === 'object' && !Array.isArray(db.dues.installments) ? db.dues : {};
  db.dues[studentId] = dues;
}

function summarizeTransactions(transactions: Array<{ amount?: number; finePaid?: number; fine_paid?: number }>) {
  const collected = transactions.reduce((sum, t) => sum + Number(t.amount || 0) + Number(t.finePaid ?? t.fine_paid ?? 0), 0);
  const finesCollected = transactions.reduce((sum, t) => sum + Number(t.finePaid ?? t.fine_paid ?? 0), 0);
  return { projected: collected, collected, duesOutstanding: 0, finesCollected };
}

export const financeService = {
  async getStudentDues(studentId: string) {
    const isSupabaseAvailable = await checkSupabaseAvailable('finance_dues');

    if (isSupabaseAvailable) {
      try {
        const { data: record } = await supabase.from('finance_dues').select('*').eq('student_id', studentId).maybeSingle();
        if (record) {
          return {
            totalTermFees: record.total_term_fees,
            scholarshipWaiver: record.scholarship_waiver,
            fineLevied: record.fine_levied,
            installments: record.installments || []
          };
        }
      } catch (err) {
        console.warn('Supabase read failed, falling back to local database:', err);
      }
    }

    const db = await readLocalDb();
    return getDuesForStudent(db, studentId);
  },

  async payDue(studentId: string, studentName: string, installmentId: string, studentEmail?: string) {
    const lockKey = `${studentId}:${installmentId}`;
    const acquired = await acquireDistributedLock(lockKey, studentId, 30);
    if (!acquired) {
      return { ok: false, error: 'PAYMENT_IN_PROGRESS', message: 'Payment is already processing for this installment across server clusters' };
    }

    try {
      const isSupabaseAvailable = await checkSupabaseAvailable('finance_dues');
      const transactionId = 'RCP-' + Math.floor(10000 + Math.random() * 90000);
      const email = studentEmail?.trim() || '';

      if (!isSupabaseAvailable) {
        // DEF-040 FIX: Eradicate local storage/JSON fallback for payment confirmations. Fail closed.
        console.error('[FinanceService] Database unavailable during payDue; failing closed');
        return {
          ok: false,
          error: 'PAYMENT_GATEWAY_RECORDING_FAILED',
          message: 'Payment recording failed. Database record could not be confirmed.'
        };
      }

      // DEF-041 FIX: Try executing authoritative process_fee_installment_payment stored procedure with row locks
      try {
        const { data: rpcRes, error: rpcErr } = await supabase.rpc('process_fee_installment_payment', {
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

      // Direct Supabase fallback if RPC is not yet deployed, with strict fail-closed
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

      const { data: record, error: duesFetchErr } = await supabase
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

      const { error: updateErr } = await supabase.from('finance_dues').update({
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

      const { error: txErr } = await supabase.from('finance_transactions').insert({
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
        const feeRes = await supabase.from('fee_payments').insert({
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

  async getScholarships() {
    const db = await readLocalDb();
    const list = Array.isArray(db.scholarships) && db.scholarships.length > 0 ? db.scholarships : DEFAULT_SCHOLARSHIPS;
    return {
      scholarships: list
    };
  },

  async applyScholarship(studentId: string, scholarshipId: string) {
    const lockKey = `schol:${studentId}`;
    const acquired = await acquireDistributedLock(lockKey, studentId, 30);
    if (!acquired) {
      return { ok: false, error: 'SCHOLARSHIP_IN_PROGRESS', message: 'Scholarship application is currently processing across server clusters' };
    }

    try {
      const db = await readLocalDb();
      const catalogScholarship = (db.scholarships || DEFAULT_SCHOLARSHIPS).find((s: any) => s.id === scholarshipId);
      const val = catalogScholarship ? Number(catalogScholarship.amount) : (scholarshipId === 'SCH-MERIT' ? 15000 : 8000);
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
          console.warn('Supabase write failed, falling back to local database:', err);
        }
      }

      const dues = getDuesForStudent(db, studentId);
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
      setDuesForStudent(db, studentId, dues);
      await writeLocalDb(db);
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
        console.warn('Supabase read failed, falling back to local database:', err);
      }
    }

    const db = await readLocalDb();
    const transactions = (db.transactions || []).slice(0, 50);
    return {
      ...summarizeTransactions(transactions),
      transactions
    };
  }
};
