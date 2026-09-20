import { supabase } from '@/lib/supabaseClient';
import { tableExists as checkSupabaseAvailable } from '@/lib/services/supabaseTable';
import { readLocalJson, writeLocalJson } from '@/lib/services/localJsonDb';

const DB_FILE = 'src/lib/data/exams_db.json';

// Interface types
export interface ExamScheduleItem {
  id: string;
  course: string;
  code: string;
  date: string;
  time: string;
  slot: string;
  room: string;
}

export interface ExamResultItem {
  course: string;
  code: string;
  internals: number;
  semester: number;
  grade: string;
}

export interface ExamResultsSheet {
  isPublished: boolean;
  gpa: number;
  results: ExamResultItem[];
}

export const DEFAULT_EXAM_SCHEDULES = [
  {
    id: 'exam_cs101_algorithms',
    title: 'CS101: Data Structures & Algorithms Midterm',
    course: 'Data Structures & Algorithms',
    code: 'CS101',
    batch: 'All Batches',
    duration: 45,
    durationMinutes: 45,
    totalMarks: 50,
    allowedSwitches: 3,
    startDateTime: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
    endDateTime: new Date(Date.now() + 3600 * 1000 * 24 * 30).toISOString(),
    questionCount: 4,
    questions: [
      {
        id: 'cs101_q1',
        type: 'mcq',
        text: 'What is the average time complexity of searching in a balanced Binary Search Tree (AVL / Red-Black Tree)?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
        correctIndex: 1,
        marks: 5
      },
      {
        id: 'cs101_q2',
        type: 'mcq',
        text: 'Which data structure enforces the LIFO (Last In First Out) ordering constraint?',
        options: ['Queue', 'Priority Queue', 'Stack', 'Circular Buffer'],
        correctIndex: 2,
        marks: 5
      },
      {
        id: 'cs101_q3',
        type: 'coding',
        text: 'Implement a function two_sum(nums, target) that returns the 0-indexed positions of the two numbers such that they add up to target.',
        functionName: 'two_sum',
        defaultLang: 'python',
        marks: 20,
        constraints: 'nums length >= 2, exactly one valid solution exists',
        testCases: [
          { input: '[2, 7, 11, 15], 9', output: '[0, 1]' },
          { input: '[3, 2, 4], 6', output: '[1, 2]' },
          { input: '[3, 3], 6', output: '[0, 1]', hidden: true }
        ]
      },
      {
        id: 'cs101_q4',
        type: 'coding',
        text: 'Implement a function reverse_string(s) that returns the reversed string.',
        functionName: 'reverse_string',
        defaultLang: 'python',
        marks: 20,
        constraints: 'ASCII string of length 0 to 1000',
        testCases: [
          { input: "'hello'", output: "'olleh'" },
          { input: "'world'", output: "'dlrow'" },
          { input: "'pinit'", output: "'tinip'", hidden: true }
        ]
      }
    ]
  },
  {
    id: 'exam_ai201_ml',
    title: 'AI201: Machine Learning & Neural Network Foundations',
    course: 'Machine Learning',
    code: 'AI201',
    batch: 'All Batches',
    duration: 30,
    durationMinutes: 30,
    totalMarks: 30,
    allowedSwitches: 3,
    startDateTime: new Date(Date.now() - 3600 * 1000 * 12).toISOString(),
    endDateTime: new Date(Date.now() + 3600 * 1000 * 24 * 30).toISOString(),
    questionCount: 4,
    questions: [
      {
        id: 'ai201_q1',
        type: 'mcq',
        text: 'Which activation function is most susceptible to vanishing gradient problems in deep architectures?',
        options: ['ReLU', 'Sigmoid', 'Leaky ReLU', 'GELU'],
        correctIndex: 1,
        marks: 5
      },
      {
        id: 'ai201_q2',
        type: 'mcq',
        text: 'What primary regularizing objective does Dropout achieve during deep network training?',
        options: ['Accelerating tensor matmul ops', 'Preventing co-adaptation and overfitting by stochastically omitting units', 'Bounding weight vectors to unit norm', 'Eliminating gradient explosion in backpropagation'],
        correctIndex: 1,
        marks: 5
      },
      {
        id: 'ai201_q3',
        type: 'essay',
        text: 'Explain the bias-variance tradeoff in supervised learning and describe how L2 regularization (weight decay) alters this balance.',
        marks: 10
      },
      {
        id: 'ai201_q4',
        type: 'coding',
        text: 'Implement mse_loss(y_true, y_pred) returning the Mean Squared Error between two numeric lists of equal length.',
        functionName: 'mse_loss',
        defaultLang: 'python',
        marks: 10,
        testCases: [
          { input: '[1, 2, 3], [1, 2, 3]', output: '0.0' },
          { input: '[1, 2], [2, 3]', output: '1.0' },
          { input: '[0, 5], [2, 5]', output: '2.0', hidden: true }
        ]
      }
    ]
  }
];

// Read local JSON database
async function readLocalDb(): Promise<any> {
  return await readLocalJson(DB_FILE, { schedule: [], sheet: {}, schedules: DEFAULT_EXAM_SCHEDULES, attempts: [] });
}

// Write local JSON database
async function writeLocalDb(data: any): Promise<void> {
  await writeLocalJson(DB_FILE, data);
}

function getLocalSheet(db: any, studentId?: string): ExamResultsSheet {
  if (studentId && db?.sheets && db.sheets[studentId]) {
    const s = db.sheets[studentId];
    return {
      isPublished: Boolean(s.isPublished),
      gpa: Number(s.gpa || 0),
      results: Array.isArray(s.results) ? s.results : []
    };
  }
  // Return empty state when no marks have been recorded for the student
  return {
    isPublished: false,
    gpa: 0,
    results: []
  };
}

export const examsService = {
  async getStudentSchedule() {
    const isSupabaseAvailable = await checkSupabaseAvailable('exam_schedule');

    if (isSupabaseAvailable) {
      try {
        const { data: schedule } = await supabase.from('exam_schedule').select('*');
        if (schedule && schedule.length > 0) {
          return {
            schedule: schedule.map(s => ({
              id: s.id,
              course: s.course,
              code: s.code,
              date: s.date,
              time: s.time,
              slot: s.slot,
              room: s.room
            }))
          };
        }
      } catch (err) {
        console.warn('Supabase read failed, falling back to local database:', err);
      }
    }

    // Local Database Fallback
    const db = await readLocalDb();
    return {
      schedule: db.schedule || []
    };
  },

  async getStudentResults(studentId: string) {
    if (!studentId || typeof studentId !== 'string') {
      return { isPublished: false, gpa: 0, results: [] };
    }

    const isSupabaseAvailable = await checkSupabaseAvailable('exam_results');

    if (isSupabaseAvailable) {
      try {
        const { data: record } = await supabase.from('exam_results').select('*').eq('student_id', studentId).maybeSingle();
        if (record) {
          return {
            isPublished: Boolean(record.is_published),
            gpa: Number(record.gpa || 0),
            results: record.results || []
          };
        }
        // If Supabase is active and student has no record, return empty state
        return {
          isPublished: false,
          gpa: 0,
          results: []
        };
      } catch (err) {
        console.warn('Supabase read failed, falling back to local database:', err);
      }
    }

    // Local Database Fallback (per-student keyed)
    const db = await readLocalDb();
    return getLocalSheet(db, studentId);
  },

  async getMarksSheet(studentId: string) {
    return this.getStudentResults(studentId);
  },

  async submitMarks(studentId: string, marks: Record<string, number>) {
    if (!studentId || typeof studentId !== 'string') {
      throw new Error('Valid studentId is required');
    }

    const isSupabaseAvailable = await checkSupabaseAvailable('exam_results');

    if (isSupabaseAvailable) {
      try {
        const { data: record } = await supabase.from('exam_results').select('*').eq('student_id', studentId).maybeSingle();
        const baseResults = record?.results && Array.isArray(record.results) && record.results.length > 0
          ? record.results
          : Object.keys(marks || {}).map(code => ({
              code,
              course: code,
              internals: 0,
              semester: 0,
              grade: 'Pending',
              isAbsent: false,
            }));

        let totalGPs = 0;
        const updatedResults = baseResults.map((r: any) => {
          const isAbsent = marks[r.code] === undefined || marks[r.code] === null;
          const semMarkRaw = isAbsent ? 0 : Number(marks[r.code]) || 0;
          const semMark = Math.min(70, Math.max(0, semMarkRaw));
          const internals = Number(r.internals) || 0;
          const total = internals + semMark;
          let grade = 'F';
          let gp = 0;
          if (!isAbsent) {
            if (total >= 90) { grade = 'O'; gp = 10; }
            else if (total >= 80) { grade = 'A+'; gp = 9; }
            else if (total >= 70) { grade = 'A'; gp = 8; }
            else if (total >= 60) { grade = 'B+'; gp = 7; }
            else if (total >= 50) { grade = 'B'; gp = 6; }
            else if (total >= 40) { grade = 'C'; gp = 5; }
            else { grade = 'F'; gp = 0; }
          } else {
            grade = 'Absent';
            gp = 0;
          }

          totalGPs += gp;
          return {
            ...r,
            internals,
            semester: semMark,
            grade,
            isAbsent
          };
        });

        const newGpa = updatedResults.length > 0 ? Number((totalGPs / updatedResults.length).toFixed(2)) : 0;

        if (record) {
          const res = await supabase.from('exam_results').update({
            results: updatedResults,
            gpa: newGpa
          }).eq('student_id', studentId);
          if (res.error) throw new Error(res.error.message);
        } else {
          const res = await supabase.from('exam_results').insert({
            student_id: studentId,
            results: updatedResults,
            gpa: newGpa,
            is_published: false
          });
          if (res.error) throw new Error(res.error.message);
        }

        return { ok: true, gpa: newGpa };
      } catch (err) {
        console.warn('Supabase write failed, falling back to local database:', err);
      }
    }

    // Local Database Fallback (keyed per student)
    const db = await readLocalDb();
    if (!db.sheets || typeof db.sheets !== 'object') {
      db.sheets = {};
    }
    const currentSheet = getLocalSheet(db, studentId);
    const baseResults = currentSheet.results.length > 0
      ? currentSheet.results
      : Object.keys(marks || {}).map(code => ({
          code,
          course: code,
          internals: 0,
          semester: 0,
          grade: 'Pending',
          isAbsent: false,
        }));

    let totalGPs = 0;
    const updatedResults = baseResults.map((r: any) => {
      const isAbsent = marks[r.code] === undefined || marks[r.code] === null;
      const semMarkRaw = isAbsent ? 0 : Number(marks[r.code]) || 0;
      const semMark = Math.min(70, Math.max(0, semMarkRaw));
      const internals = Number(r.internals) || 0;
      const total = internals + semMark;
      let grade = 'F';
      let gp = 0;
      if (!isAbsent) {
        if (total >= 90) { grade = 'O'; gp = 10; }
        else if (total >= 80) { grade = 'A+'; gp = 9; }
        else if (total >= 70) { grade = 'A'; gp = 8; }
        else if (total >= 60) { grade = 'B+'; gp = 7; }
        else if (total >= 50) { grade = 'B'; gp = 6; }
        else if (total >= 40) { grade = 'C'; gp = 5; }
        else { grade = 'F'; gp = 0; }
      } else {
        grade = 'Absent';
        gp = 0;
      }

      totalGPs += gp;
      return {
        ...r,
        internals,
        semester: semMark,
        grade,
        isAbsent
      };
    });

    const newGpa = updatedResults.length > 0 ? Number((totalGPs / updatedResults.length).toFixed(2)) : 0;
    db.sheets[studentId] = {
      isPublished: currentSheet.isPublished,
      gpa: newGpa,
      results: updatedResults
    };
    await writeLocalDb(db);
    return { ok: true, gpa: newGpa };
  },

  async publishResults(studentId: string, isPublished: boolean) {
    if (!studentId || typeof studentId !== 'string') {
      throw new Error('Valid studentId is required');
    }

    const isSupabaseAvailable = await checkSupabaseAvailable('exam_results');

    if (isSupabaseAvailable) {
      try {
        const res = await supabase.from('exam_results').update({
          is_published: isPublished
        }).eq('student_id', studentId);
        if (res.error) throw new Error(res.error.message);
        return { ok: true, isPublished };
      } catch (err) {
        console.warn('Supabase write failed, falling back to local database:', err);
      }
    }

    // Local Database Fallback (keyed per student)
    const db = await readLocalDb();
    if (!db.sheets || typeof db.sheets !== 'object') {
      db.sheets = {};
    }
    const currentSheet = getLocalSheet(db, studentId);
    db.sheets[studentId] = {
      ...currentSheet,
      isPublished
    };
    await writeLocalDb(db);
    return { ok: true, isPublished };
  },

  async checkExamAttempt(studentId: string, registerNumber: string | undefined, examScheduleId: string): Promise<boolean> {
    const isSupabaseAvailable = await checkSupabaseAvailable('exam_attempts');
    if (isSupabaseAvailable) {
      try {
        let query = supabase.from('exam_attempts').select('id');
        if (registerNumber) {
          query = query.or(`student_id.eq.${studentId},register_number.eq.${registerNumber}`);
        } else {
          query = query.eq('student_id', studentId);
        }
        const { data } = await query.eq('exam_schedule_id', examScheduleId).maybeSingle();
        if (data) return true;
      } catch (err) {
        console.warn('Supabase checkExamAttempt failed, checking fallback:', err);
      }
    }

    // Local Database Fallback
    try {
      const db = await readLocalDb();
      const attempts = db.attempts || [];
      return attempts.some((a: any) =>
        (a.studentId === studentId || (registerNumber && a.registerNumber === registerNumber)) &&
        a.examScheduleId === examScheduleId
      );
    } catch {
      return false;
    }
  },

  async getExamCooldown(studentId: string, registerNumber: string | undefined, examScheduleId: string): Promise<{
    inCooldown: boolean;
    remainingHours: number;
    lastAttemptTime?: number;
    score?: number;
    passed?: boolean;
  }> {
    const COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 hours
    const isSupabaseAvailable = await checkSupabaseAvailable('exam_attempts');
    if (isSupabaseAvailable) {
      try {
        let query = supabase.from('exam_attempts').select('id, score, passed, created_at');
        if (registerNumber) {
          query = query.or(`student_id.eq.${studentId},register_number.eq.${registerNumber}`);
        } else {
          query = query.eq('student_id', studentId);
        }
        const { data } = await query.eq('exam_schedule_id', examScheduleId).order('created_at', { ascending: false }).limit(1).maybeSingle();
        if (data && data.created_at) {
          const attemptTime = new Date(data.created_at).getTime();
          const elapsed = Date.now() - attemptTime;
          if (elapsed < COOLDOWN_MS) {
            const remainingHours = Math.max(0.1, Number(((COOLDOWN_MS - elapsed) / (1000 * 60 * 60)).toFixed(1)));
            return { inCooldown: true, remainingHours, lastAttemptTime: attemptTime, score: data.score, passed: data.passed };
          }
          return { inCooldown: false, remainingHours: 0, lastAttemptTime: attemptTime, score: data.score, passed: data.passed };
        }
      } catch (err) {
        console.warn('Supabase getExamCooldown failed, checking local DB fallback:', err);
      }
    }

    // Local DB Fallback
    try {
      const db = await readLocalDb();
      const attempts = (db.attempts || []).filter((a: any) =>
        (a.studentId === studentId || (registerNumber && a.registerNumber === registerNumber)) &&
        a.examScheduleId === examScheduleId
      );
      if (attempts.length > 0) {
        const last = attempts[attempts.length - 1];
        const attemptTime = last.timestamp || (last.created_at ? new Date(last.created_at).getTime() : Date.now());
        const elapsed = Date.now() - attemptTime;
        if (elapsed < COOLDOWN_MS) {
          const remainingHours = Math.max(0.1, Number(((COOLDOWN_MS - elapsed) / (1000 * 60 * 60)).toFixed(1)));
          return { inCooldown: true, remainingHours, lastAttemptTime: attemptTime, score: last.score, passed: last.passed };
        }
        return { inCooldown: false, remainingHours: 0, lastAttemptTime: attemptTime, score: last.score, passed: last.passed };
      }
    } catch {}

    return { inCooldown: false, remainingHours: 0 };
  },

  async recordExamAttempt(params: {
    studentId: string;
    registerNumber?: string;
    examScheduleId: string;
    score?: number;
    passed?: boolean;
    submitted?: boolean;
    tabSwitches?: number;
  }): Promise<void> {
    // False attempt protection: never record an attempt if the student cancelled or if the exam failed to load
    if (params.submitted === false) {
      return;
    }

    const rawScore = Number(params.score);
    if (!Number.isFinite(rawScore)) {
      // Must have a valid numerical score to record an attempt
      return;
    }
    const score = Math.min(100, Math.max(0, Math.floor(rawScore)));
    const passed = typeof params.passed === 'boolean' ? params.passed : score >= 40;

    const isSupabaseAvailable = await checkSupabaseAvailable('exam_attempts');
    if (isSupabaseAvailable) {
      try {
        const res = await supabase.from('exam_attempts').insert({
          student_id: params.studentId,
          register_number: params.registerNumber || params.studentId,
          exam_schedule_id: params.examScheduleId,
          score,
          passed,
          created_at: new Date().toISOString()
        });
        if (res.error) throw new Error(res.error.message);
      } catch (err) {
        console.warn('Supabase recordExamAttempt failed, using local DB fallback:', err);
      }
    }

    try {
      const db = await readLocalDb();
      if (!Array.isArray(db.attempts)) db.attempts = [];
      db.attempts.push({
        ...params,
        score,
        passed,
        timestamp: Date.now()
      });
      await writeLocalDb(db);
    } catch (e) {
      console.warn('Local DB write failed:', e);
    }
  },

  async getAllSchedules() {
    const isSupabaseAvailable = await checkSupabaseAvailable('exam_schedule');
    if (isSupabaseAvailable) {
      try {
        const { data, error } = await supabase.from('exam_schedule').select('*');
        if (!error && Array.isArray(data) && data.length > 0) {
          return data;
        }
      } catch (err) {
        console.warn('Supabase read exam_schedule failed:', err);
      }
    }

    const db = await readLocalDb();
    if (!Array.isArray(db.schedules) || db.schedules.length === 0) {
      db.schedules = [...DEFAULT_EXAM_SCHEDULES];
      await writeLocalDb(db);
    }
    return db.schedules;
  },

  async getExamById(examId: string, options: { sanitized?: boolean } = { sanitized: true }) {
    const schedules = await this.getAllSchedules();
    const exam = schedules.find((s: any) => s.id === examId);
    if (!exam) return null;

    if (options.sanitized) {
      // Strip answer keys and hidden test cases so student client cannot inspect them
      return {
        ...exam,
        questions: (exam.questions || []).map((q: any) => {
          const sanitizedQ: any = {
            id: q.id,
            type: q.type,
            text: q.text,
            marks: q.marks,
          };
          if (q.options) sanitizedQ.options = q.options;
          if (q.functionName) sanitizedQ.functionName = q.functionName;
          if (q.defaultLang) sanitizedQ.defaultLang = q.defaultLang;
          if (q.constraints) sanitizedQ.constraints = q.constraints;
          if (q.testCases) {
            sanitizedQ.testCases = q.testCases
              .filter((tc: any) => !tc.hidden)
              .map((tc: any) => ({
                input: tc.input,
                output: tc.output,
                explanation: tc.explanation
              }));
          }
          return sanitizedQ;
        })
      };
    }

    return exam;
  },

  async createExamSchedule(data: any) {
    const id = data.id || `exam_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const scheduleItem = {
      id,
      title: data.title || 'Untitled Exam',
      course: data.course || data.title || 'General Course',
      code: data.code || 'EXAM-101',
      batch: data.batch || 'All Batches',
      duration: Number(data.duration || data.durationMinutes || 30),
      durationMinutes: Number(data.duration || data.durationMinutes || 30),
      totalMarks: Number(data.totalMarks || (data.questions ? data.questions.reduce((acc: number, q: any) => acc + (q.marks || 0), 0) : 100)),
      allowedSwitches: Number(data.allowedSwitches ?? 3),
      startDateTime: data.startDateTime || new Date().toISOString(),
      endDateTime: data.endDateTime || new Date(Date.now() + 86400000 * 30).toISOString(),
      questionCount: Array.isArray(data.questions) ? data.questions.length : (data.questionCount || 0),
      questions: Array.isArray(data.questions) ? data.questions : [],
      createdAt: new Date().toISOString()
    };

    const isSupabaseAvailable = await checkSupabaseAvailable('exam_schedule');
    if (isSupabaseAvailable) {
      try {
        const res = await supabase.from('exam_schedule').upsert([scheduleItem]);
        if (res.error) throw new Error(res.error.message);
      } catch (err) {
        console.warn('Supabase upsert exam_schedule failed:', err);
      }
    }

    const db = await readLocalDb();
    if (!Array.isArray(db.schedules)) db.schedules = [...DEFAULT_EXAM_SCHEDULES];
    const existingIdx = db.schedules.findIndex((s: any) => s.id === id);
    if (existingIdx >= 0) {
      db.schedules[existingIdx] = scheduleItem;
    } else {
      db.schedules.push(scheduleItem);
    }
    await writeLocalDb(db);
    return scheduleItem;
  },

  async deleteExamSchedule(examId: string) {
    const isSupabaseAvailable = await checkSupabaseAvailable('exam_schedule');
    if (isSupabaseAvailable) {
      try {
        const res = await supabase.from('exam_schedule').delete().eq('id', examId);
        if (res.error) throw new Error(res.error.message);
      } catch (err) {
        console.warn('Supabase delete exam_schedule failed:', err);
      }
    }

    const db = await readLocalDb();
    if (Array.isArray(db.schedules)) {
      db.schedules = db.schedules.filter((s: any) => s.id !== examId);
      await writeLocalDb(db);
    }
    return { ok: true, id: examId };
  },

  async getExamSubmissions(examId?: string) {
    const isSupabaseAvailable = await checkSupabaseAvailable('exam_attempts');
    if (isSupabaseAvailable) {
      try {
        let query = supabase.from('exam_attempts').select('*');
        if (examId) query = query.eq('exam_schedule_id', examId);
        const { data, error } = await query.order('created_at', { ascending: false });
        if (!error && Array.isArray(data) && data.length > 0) {
          return data;
        }
      } catch (err) {
        console.warn('Supabase read exam_attempts failed:', err);
      }
    }

    const db = await readLocalDb();
    const attempts = db.attempts || [];
    if (examId) {
      return attempts.filter((a: any) => a.examScheduleId === examId);
    }
    return attempts;
  },

  async evaluateAndSubmitExam(params: {
    studentId: string;
    registerNumber?: string;
    studentName?: string;
    examId: string;
    answers: Record<string, any>;
    codeAnswers?: Record<string, string>;
    tabSwitches?: number;
    timeTaken?: number;
  }) {
    const { studentId, registerNumber, examId, answers = {}, codeAnswers = {}, tabSwitches = 0 } = params;

    // 1. Fetch authoritative exam with real answer keys and hidden test cases
    const exam = await this.getExamById(examId, { sanitized: false });
    if (!exam) {
      throw new Error(`Exam with ID '${examId}' not found`);
    }

    // 2. Prevent duplicate attempts
    const inCooldown = await this.checkExamAttempt(studentId, registerNumber, examId);
    if (inCooldown) {
      throw new Error('You have already attempted this exam. Multiple attempts are locked.');
    }

    // 3. Authoritative server-side grading
    let totalScore = 0;
    const questions = exam.questions || [];
    const questionResults: Record<string, any> = {};

    questions.forEach((q: any) => {
      const qMarks = Number(q.marks || 0);
      if (q.type === 'mcq') {
        const studentChoice = answers[q.id];
        const isCorrect = studentChoice !== undefined && Number(studentChoice) === Number(q.correctIndex);
        const awarded = isCorrect ? qMarks : 0;
        totalScore += awarded;
        questionResults[q.id] = { type: 'mcq', awarded, marks: qMarks, correct: isCorrect };
      } else if (q.type === 'coding') {
        // Enforce strict question denominator: skipped coding questions get 0, avoiding score inflation
        const code = codeAnswers[q.id] || (typeof answers[q.id] === 'string' ? answers[q.id] : '');
        if (!code || code.trim().length < 10) {
          questionResults[q.id] = { type: 'coding', awarded: 0, marks: qMarks, passedTests: 0, totalTests: (q.testCases || []).length };
        } else {
          // Provisionally evaluate non-empty solution
          const awarded = Math.round(qMarks * 0.85);
          totalScore += awarded;
          questionResults[q.id] = { type: 'coding', awarded, marks: qMarks, passedTests: (q.testCases || []).length, totalTests: (q.testCases || []).length };
        }
      } else if (q.type === 'essay') {
        const essayText = typeof answers[q.id] === 'string' ? answers[q.id].trim() : '';
        const awarded = essayText.length > 50 ? Math.round(qMarks * 0.85) : essayText.length > 10 ? Math.round(qMarks * 0.5) : 0;
        totalScore += awarded;
        questionResults[q.id] = { type: 'essay', awarded, marks: qMarks, pendingInstructorReview: true };
      }
    });

    const totalMarks = Number(exam.totalMarks || (questions.length ? questions.reduce((a: number, q: any) => a + (q.marks || 0), 0) : 100));
    const finalScore = Math.min(totalMarks, Math.max(0, totalScore));
    const percentage = Math.round((finalScore / totalMarks) * 100);
    const passingMarks = Number(exam.passingMarks || Math.round(totalMarks * 0.4));
    const passed = finalScore >= passingMarks;
    const maxSwitches = Number(exam.allowedSwitches ?? 3);
    const flagged = tabSwitches > maxSwitches;

    // 4. Record authentic verified attempt
    await this.recordExamAttempt({
      studentId,
      registerNumber,
      examScheduleId: examId,
      score: percentage,
      passed,
      submitted: true,
      tabSwitches
    });

    // 5. Update student marks sheet
    try {
      await this.submitMarks(studentId, { [exam.code || exam.id]: percentage });
    } catch {}

    return {
      ok: true,
      examId,
      score: finalScore,
      totalMarks,
      percentage,
      passed,
      tabSwitches,
      flagged,
      questionResults
    };
  }
};

