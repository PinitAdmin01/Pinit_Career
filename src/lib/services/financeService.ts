import fs from 'fs';
import path from 'path';
import { supabase } from '@/lib/supabaseClient';

const DB_PATH = path.join(process.cwd(), 'src/lib/data/finance_db.json');

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
function readLocalDb(): any {
  try {
    if (!fs.existsSync(DB_PATH)) {
      return { dues: {}, scholarships: [], transactions: [] };
    }
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading local finance database file:', err);
    return { dues: {}, scholarships: [], transactions: [] };
  }
}

// Write local JSON database
function writeLocalDb(data: any): void {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing local finance database file:', err);
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

    // Local Database Fallback
    const db = readLocalDb();
    return db.dues;
  },

  async payDue(studentId: string, studentName: string, installmentId: string) {
    const isSupabaseAvailable = await checkSupabaseAvailable('finance_dues');
    const transactionId = 'RCP-' + Math.floor(10000 + Math.random() * 90000);

    if (isSupabaseAvailable) {
      try {
        const { data: record } = await supabase.from('finance_dues').select('*').eq('student_id', studentId).maybeSingle();
        if (record) {
          const updatedInstallments = (record.installments || []).map((inst: any) => {
            if (inst.id === installmentId) {
              return {
                ...inst,
                status: 'Paid',
                paidOn: new Date().toISOString(),
                receiptId: transactionId
              };
            }
            return inst;
          });

          await supabase.from('finance_dues').update({
            installments: updatedInstallments,
            fine_levied: 0
          }).eq('student_id', studentId);

          await supabase.from('finance_transactions').insert({
            id: transactionId,
            student_name: studentName,
            student_email: 'student@pinit.in',
            amount: 40000,
            fine_paid: 1500,
            type: 'Tuition Fee (Installment 3)'
          });

          return { ok: true, receiptId: transactionId };
        }
      } catch (err) {
        console.warn('Supabase write failed, falling back to local database:', err);
      }
    }

    // Local Database Fallback
    const db = readLocalDb();
    db.dues.installments = db.dues.installments.map((inst: any) => {
      if (inst.id === installmentId) {
        return {
          ...inst,
          status: 'Paid',
          paidOn: new Date().toISOString(),
          receiptId: transactionId
        };
      }
      return inst;
    });

    db.dues.fineLevied = 0;
    db.transactions.unshift({
      id: transactionId,
      studentName,
      studentEmail: 'student@pinit.in',
      amount: 40000,
      finePaid: 1500,
      type: 'Tuition Fee (Installment 3)',
      timestamp: new Date().toISOString()
    });
    writeLocalDb(db);
    return { ok: true, receiptId: transactionId };
  },

  async getScholarships() {
    const db = readLocalDb();
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
          const updatedInstallments = (record.installments || []).map((inst: any) => {
            if (inst.id === 'Inst-3') {
              return { ...inst, amount: Math.max(0, 40000 - val) };
            }
            return inst;
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

    // Local Database Fallback
    const db = readLocalDb();
    db.dues.scholarshipWaiver = val;
    db.dues.installments = db.dues.installments.map((inst: any) => {
      if (inst.id === 'Inst-3') {
        return { ...inst, amount: Math.max(0, 40000 - val) };
      }
      return inst;
    });
    writeLocalDb(db);
    return { ok: true, waiver: val };
  },

  async getAdminStats() {
    const isSupabaseAvailable = await checkSupabaseAvailable('finance_transactions');

    if (isSupabaseAvailable) {
      try {
        const { data: txs } = await supabase.from('finance_transactions').select('*');
        const transactions = txs || [];
        const addedAmount = transactions.reduce((sum: number, t: any) => sum + t.amount + (t.fine_paid || 0), 0);
        const finesCollected = transactions.reduce((sum: number, t: any) => sum + (t.fine_paid || 0), 0);

        return {
          projected: 4800000,
          collected: 3920000 + addedAmount,
          duesOutstanding: 880000 - addedAmount,
          finesCollected: 124000 + finesCollected,
          transactions: transactions.map(t => ({
            id: t.id,
            studentName: t.student_name,
            studentEmail: t.student_email,
            amount: t.amount,
            finePaid: t.fine_paid,
            type: t.type,
            timestamp: t.created_at
          }))
        };
      } catch (err) {
        console.warn('Supabase read failed, falling back to local database:', err);
      }
    }

    // Local Database Fallback
    const db = readLocalDb();
    const transactions = db.transactions || [];
    const addedAmount = transactions.reduce((sum: number, t: any) => sum + t.amount + (t.finePaid || 0), 0);
    const initialTransactions = [
      { id: 'RCP-84221', studentName: 'Rohan Sharma', studentEmail: 'rohan.s@gmail.com', amount: 40000, finePaid: 0, type: '2nd Installment', timestamp: '2026-07-12T14:10:00Z' },
      { id: 'RCP-82910', studentName: 'Priya Iyer', studentEmail: 'priya@gmail.com', amount: 40000, finePaid: 0, type: '1st Installment', timestamp: '2026-07-11T09:45:00Z' }
    ];
    return {
      projected: 4800000,
      collected: 3920000 + addedAmount,
      duesOutstanding: 880000 - addedAmount,
      finesCollected: 124000 + (transactions.length ? 1500 : 0),
      transactions: [...transactions, ...initialTransactions]
    };
  }
};
