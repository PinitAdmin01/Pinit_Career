'use client';

/**
 * Question Bank Template & Parser Engine
 * Architecture:
 * 1. Multi-Sheet Question Template Generator (MCQ + Coding + Instructions)
 * 2. Pure TypeScript CSV / TSV Fallback Parser & Normalizer (Zero Dependency)
 * 3. Dynamic XLSX Workbook Importer
 * 4. Results & Performance Analytics Exporter
 */

function makeId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

export interface TestCase {
  input: string;
  output: string;
  hidden: boolean;
}

export interface QuestionRecord {
  id: string;
  question: string;
  type: 'mcq' | 'tf' | 'fill' | 'essay' | 'coding';
  options?: string[];
  correct?: number | string;
  description?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  functionName?: string;
  defaultLang?: string;
  constraints?: string;
  starterCode?: string;
  testCases?: TestCase[];
}

export interface ExamStudentResult {
  studentId: string;
  studentName: string;
  rollNo?: string;
  score: number;
  maxScore: number;
  percentage: number;
  status: 'Pass' | 'Fail';
  completedAt: string;
}

export interface ParseResult {
  questions: QuestionRecord[];
  errors: string[];
  totalParsed: number;
}

/**
 * Parses raw CSV string data into structured QuestionRecords
 */
export function parseQuestionsFromCSV(csvText: string): ParseResult {
  const lines = csvText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const questions: QuestionRecord[] = [];
  const errors: string[] = [];

  if (lines.length <= 1) {
    return { questions: [], errors: ['CSV content is empty or contains only header'], totalParsed: 0 };
  }

  // Parse Header
  const header = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, '').toLowerCase());
  const qIdx = header.indexOf('question');
  const typeIdx = header.indexOf('type');
  const optAIdx = header.indexOf('optiona');
  const optBIdx = header.indexOf('optionb');
  const optCIdx = header.indexOf('optionc');
  const optDIdx = header.indexOf('optiond');
  const corrIdx = header.indexOf('correct');
  const descIdx = header.indexOf('description');

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',').map(c => c.trim().replace(/^["']|["']$/g, ''));
    const qText = cols[qIdx] || cols[0];
    if (!qText) continue;

    const rawType = (cols[typeIdx] ? cols[typeIdx].toLowerCase() : 'mcq') as QuestionRecord['type'];
    const validTypes: QuestionRecord['type'][] = ['mcq', 'tf', 'fill', 'essay', 'coding'];
    const type = validTypes.includes(rawType) ? rawType : 'mcq';

    let options: string[] = [];
    if (type === 'mcq') {
      options = [cols[optAIdx] || cols[2], cols[optBIdx] || cols[3], cols[optCIdx] || cols[4], cols[optDIdx] || cols[5]]
        .filter(Boolean);
    } else if (type === 'tf') {
      options = ['True', 'False'];
    }

    let correct: number | string = 0;
    if (type === 'mcq' || type === 'tf') {
      const rawCorrect = cols[corrIdx] || cols[6] || '0';
      const parsedInt = parseInt(rawCorrect, 10);
      correct = isNaN(parsedInt) ? 0 : parsedInt;
    } else if (type === 'fill') {
      correct = cols[corrIdx] || cols[optAIdx] || cols[2] || '';
    } else {
      correct = cols[corrIdx] || '';
    }

    questions.push({
      id: makeId(),
      question: qText,
      type,
      options: options.length > 0 ? options : undefined,
      correct,
      description: cols[descIdx] || cols[7] || undefined
    });
  }

  return {
    questions,
    errors,
    totalParsed: questions.length
  };
}

/**
 * Downloads question template as standard CSV
 */
export function downloadQuestionTemplateCSV(filename = 'pinit_questions_template.csv'): void {
  const rows = [
    ['question', 'type', 'optionA', 'optionB', 'optionC', 'optionD', 'correct', 'description'],
    ['What is React?', 'mcq', 'A UI library', 'A database', 'An OS', 'A browser', '0', 'Core frontend library'],
    ['JavaScript is statically typed.', 'tf', '', '', '', '', '1', 'False (0=True, 1=False)'],
    ['The HTTP status for not found is ___', 'fill', '404', '', '', '', '', 'Client error code'],
    ['Explain the difference between SQL and NoSQL databases.', 'essay', '', '', '', '', '', 'Database paradigms']
  ];

  const csvContent = rows.map(r => r.map(c => `"${c.replace(/"/g, '""')}"`).join(',')).join('\n');
  if (typeof document !== 'undefined') {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  }
}

/**
 * Exports exam results as CSV
 */
export function exportExamResultsCSV(results: ExamStudentResult[], filename = 'exam_results.csv'): void {
  const headers = ['Student ID', 'Student Name', 'Roll No', 'Score', 'Max Score', 'Percentage (%)', 'Status', 'Completed At'];
  const rows = results.map(r => [
    r.studentId,
    r.studentName,
    r.rollNo || '-',
    String(r.score),
    String(r.maxScore),
    `${r.percentage.toFixed(1)}%`,
    r.status,
    r.completedAt
  ]);

  const csvContent = [headers, ...rows].map(r => r.map(c => `"${c.replace(/"/g, '""')}"`).join(',')).join('\n');
  if (typeof document !== 'undefined') {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  }
}
