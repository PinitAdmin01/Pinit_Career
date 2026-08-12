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

const EMPTY_DUES: StudentDues = { totalTermFees: 0, scholarshipWaiver: 0, fineLevied: 0, installments: [] };

function asDues(value: unknown): StudentDues | null {
  if (!value || typeof value !== 'object') return null;
  const dues = value as StudentDues;
  if (!Array.isArray(dues.installments)) return null;
  return dues;
}

function getDuesForStudent(db: any, studentId: string): StudentDues {
  const mapped = asDues(db.dues?.[studentId]);
  if (mapped) return mapped;
  const legacy = asDues(db.dues);
  if (legacy && db.dues && typeof db.dues === 'object' && !Array.isArray(db.dues.installments)) {
    db.dues = { [studentId]: legacy };
  }
  return { ...EMPTY_DUES, installments: [] };
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
    const isSupabaseAvailable = await checkSupabaseAvailable('finance_dues');
    const transactionId = 'RCP-' + Math.floor(10000 + Math.random() * 90000);
    const email = studentEmail?.trim() || '';

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

    if (isSupabaseAvailable) {
      try {
        const { data: record } = await supabase.from('finance_dues').select('*').eq('student_id', studentId).maybeSingle();
        if (record) {
          const paid = (record.installments || []).find((inst: FinanceInstallment) => inst.id === installmentId);
          const updatedInstallments = markPaid(record.installments || []);
          await supabase.from('finance_dues').update({
            installments: updatedInstallments,
            fine_levied: 0
          }).eq('student_id', studentId);

          await supabase.from('finance_transactions').insert({
            id: transactionId,
            student_id: studentId,
            student_name: studentName,
            student_email: email,
            amount: Number(paid?.amount || 0),
            fine_paid: Number(record.fine_levied || 0),
            type: paid?.name || 'Fee installment'
          });

          return { ok: true, receiptId: transactionId };
        }
      } catch (err) {
        console.warn('Supabase write failed, falling back to local database:', err);
      }
    }

    const db = await readLocalDb();
    const dues = getDuesForStudent(db, studentId);
    const paid = dues.installments.find((inst) => inst.id === installmentId);
    const fineCollected = Number(dues.fineLevied || 0);
    dues.installments = markPaid(dues.installments);
    dues.fineLevied = 0;
    setDuesForStudent(db, studentId, dues);
    db.transactions = db.transactions || [];
    db.transactions.unshift({
      id: transactionId,
      studentId,
      studentName,
      studentEmail: email,
      amount: Number(paid?.amount || 0),
      finePaid: fineCollected,
      type: paid?.name || 'Fee installment',
      timestamp: new Date().toISOString()
    });
    await writeLocalDb(db);
    return { ok: true, receiptId: transactionId };
  },

  async getScholarships() {
    const db = await readLocalDb();
    return {
      scholarships: db.scholarships || []
    };
  },

  async applyScholarship(studentId: string, scholarshipId: string) {
    const val = scholarshipId === 'SCH-MERIT' ? 15000 : 8000;
    const isSupabaseAvailable = await checkSupabaseAvailable('finance_dues');

    if (isSupabaseAvailable) {
      try {
        const { data: record } = await supabase.from('finance_dues').select('*').eq('student_id', studentId).maybeSingle();
        if (record) {
          const updatedInstallments = (record.installments || []).map((inst: FinanceInstallment) => {
            if (inst.status === 'Paid') return inst;
            return { ...inst, amount: Math.max(0, Number(inst.amount || 0) - val) };
          });

          await supabase.from('finance_dues').update({
            scholarship_waiver: val,
            installments: updatedInstallments
          }).eq('student_id', studentId);

          return { ok: true, waiver: val };
        }
      } catch (err) {
        console.warn('Supabase write failed, falling back to local database:', err);
      }
    }

    const db = await readLocalDb();
    const dues = getDuesForStudent(db, studentId);
    dues.scholarshipWaiver = val;
    dues.installments = (dues.installments || []).map((inst) => {
      if (inst.status === 'Paid') return inst;
      return { ...inst, amount: Math.max(0, Number(inst.amount || 0) - val) };
    });
    setDuesForStudent(db, studentId, dues);
    await writeLocalDb(db);
    return { ok: true, waiver: val };
  },

  async getAdminStats() {
    const isSupabaseAvailable = await checkSupabaseAvailable('finance_transactions');

    if (isSupabaseAvailable) {
      try {
        const { data: txs } = await supabase.from('finance_transactions').select('*');
        const transactions = txs || [];
        const summary = summarizeTransactions(transactions);
        return {
          ...summary,
          transactions: transactions.map(t => ({
            id: t.id,
            studentName: t.student_name,
            studentEmail: t.student_email,
            amount: t.amount,
            finePaid: t.fine_paid,
            type: t.type,
            timestamp: t.timestamp || t.created_at
          }))
        };
      } catch (err) {
        console.warn('Supabase read failed, falling back to local database:', err);
      }
    }

    const db = await readLocalDb();
    const transactions = db.transactions || [];
    return {
      ...summarizeTransactions(transactions),
      transactions
    };
  }
};
