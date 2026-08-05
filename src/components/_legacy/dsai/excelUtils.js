/**
 * excelUtils.js — Excel import/export utilities for BGS Exam Portal
 *
 * Usage:
 *   import { downloadQuestionTemplate, importQuestionsFromExcel, exportResultsExcel, exportStudentsList } from '../utils/excelUtils.js';
 */

/* Lazy-load xlsx to avoid blocking initial render */
async function getXLSX() {
  return import('xlsx');
}

/* Collision-safe unique ID — uses crypto.randomUUID() which is available in all
   modern browsers and Node 14.17+. Falls back to timestamp+random for old envs. */
function makeId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // Fallback for older environments
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

/* Auto column widths */
function autoWidths(ws, rows) {
  if (!rows.length) return;
  ws['!cols'] = rows[0].map((_, ci) => ({
    wch: Math.min(Math.max(10, ...rows.map(r => String(r[ci] ?? '').length)) + 2, 55),
  }));
}

/* ════════════════════════════════════════════════════════
   downloadQuestionTemplate
   Creates a 3-sheet Excel:
     Sheet 1: MCQ_Questions  — standard question types
     Sheet 2: Coding_Questions — coding with test cases
     Sheet 3: Instructions   — usage guide
════════════════════════════════════════════════════════ */
export async function downloadQuestionTemplate(filename = 'question_template.xlsx') {
  const XLSX = await getXLSX();
  const wb   = XLSX.utils.book_new();

  /* ─── Sheet 1: MCQ / Standard questions ─── */
  const h1 = ['question', 'type', 'optionA', 'optionB', 'optionC', 'optionD', 'correct', 'description'];
  const r1 = [
    ['What is Python?',                   'mcq',   'A programming language', 'A snake',   'A database',  'An OS',       '0', ''],
    ['Is the sky blue?',                  'tf',    '',                       '',          '',            '',            '0', ''],
    ['Capital of France is ___',          'fill',  'Paris',                  '',          '',            '',            '',  ''],
    ['Explain supervised learning.',      'essay', '',                       '',          '',            '',            '',  ''],
  ];
  const ws1 = XLSX.utils.aoa_to_sheet([h1, ...r1]);
  autoWidths(ws1, [h1, ...r1]);
  XLSX.utils.book_append_sheet(wb, ws1, 'MCQ_Questions');

  /* ─── Sheet 2: Coding questions ─── */
  const h2 = [
    'question', 'description', 'functionName', 'difficulty', 'defaultLang', 'constraints',
    'tc1_input', 'tc1_output', 'tc1_hidden',
    'tc2_input', 'tc2_output', 'tc2_hidden',
    'tc3_input', 'tc3_output', 'tc3_hidden',
  ];
  const r2 = [
    [
      'Reverse a string',
      'Given a string s, return the string reversed.',
      'reverseString', 'Easy', 'python', '1 ≤ len(s) ≤ 1000',
      '"hello"', 'olleh', 'FALSE',
      '"world"', 'dlrow', 'FALSE',
      '"abcde"', 'edcba', 'TRUE',
    ],
    [
      'Sum of two numbers',
      'Return the sum of integers a and b.',
      'add', 'Easy', 'python', '-10^9 ≤ a,b ≤ 10^9',
      '(3, 5)', '8', 'FALSE',
      '(-1, 1)', '0', 'FALSE',
      '(100, 200)', '300', 'TRUE',
    ],
    [
      'Check palindrome',
      'Return True if the string is a palindrome, False otherwise.',
      'isPalindrome', 'Medium', 'python', '1 ≤ len(s) ≤ 1000',
      '"racecar"', 'True',  'FALSE',
      '"hello"',   'False', 'FALSE',
      '"madam"',   'True',  'TRUE',
    ],
    [
      'Find maximum in list',
      'Given a list of integers, return the maximum value.',
      'findMax', 'Easy', 'python', '1 ≤ len(arr) ≤ 10^5',
      '[1, 3, 2, 5, 4]', '5',  'FALSE',
      '[-10, -3, -7]',   '-3', 'FALSE',
      '[42]',            '42', 'TRUE',
    ],
    [
      'Count vowels',
      'Given a string, return the number of vowels (a,e,i,o,u).',
      'countVowels', 'Easy', 'python', '',
      '"hello"',    '2', 'FALSE',
      '"aeiou"',    '5', 'FALSE',
      '"rhythm"',   '0', 'TRUE',
    ],
  ];
  const ws2 = XLSX.utils.aoa_to_sheet([h2, ...r2]);
  autoWidths(ws2, [h2, ...r2]);
  XLSX.utils.book_append_sheet(wb, ws2, 'Coding_Questions');

  /* ─── Sheet 3: Instructions ─── */
  const instrRows = [
    ['═══ BGS Exam Portal — Question Import Guide ═══'],
    [''],
    ['SHEET 1 — MCQ_Questions'],
    ['  question    Required. The question text.'],
    ['  type        mcq | tf | fill | essay'],
    ['  optionA–D   Answer choices (for mcq only).'],
    ['  correct     0-indexed answer: 0=A, 1=B, 2=C, 3=D. For fill, put correct answer in optionA.'],
    ['  description Optional context shown to student.'],
    [''],
    ['SHEET 2 — Coding_Questions'],
    ['  question      Short title shown in the question list.'],
    ['  description   Full problem statement shown to student.'],
    ['  functionName  Name students must define. e.g. reverseString'],
    ['  difficulty    Easy | Medium | Hard'],
    ['  defaultLang   python | javascript | java | cpp | c'],
    ['  constraints   Optional. e.g. 1 ≤ n ≤ 10^5'],
    [''],
    ['  Test case columns (tc1, tc2, tc3 ... tc10):'],
    ['  tc1_input    Input as a Python/JS literal.'],
    ['  tc1_output   Expected output (exact match, whitespace trimmed).'],
    ['  tc1_hidden   TRUE = graded but hidden. FALSE = shown as example.'],
    [''],
    ['═══ INPUT FORMAT ═══'],
    ['  String:        "hello"        (MUST have quotes)'],
    ['  Number:        42  or  3.14'],
    ['  Boolean:       True  or  False'],
    ['  List:          [1, 2, 3]'],
    ['  Two args:      (3, 5)         → calls fn(3, 5)'],
    ['  Three args:    (1, 2, 3)      → calls fn(1, 2, 3)'],
    [''],
    ['═══ OUTPUT FORMAT ═══'],
    ['  Write exactly what the function should RETURN or PRINT (no quotes around strings).'],
    ['  fn returns 42        → expected: 42'],
    ['  fn returns "hello"   → expected: hello'],
    ['  fn returns [1,2,3]   → expected: [1, 2, 3]'],
    ['  fn returns True      → expected: True'],
    [''],
    ['═══ AUTO-GRADING ═══'],
    ['  Python & JavaScript: run live in browser via Pyodide (real CPython 3.x).'],
    ['  Java, C++, C: saved and graded manually by instructor.'],
    ['  The engine auto-discovers the first defined function and calls it with parsed args.'],
    ['  Students do NOT need to name the function "solution" — any name works.'],
  ];
  const ws3 = XLSX.utils.aoa_to_sheet(instrRows.map(r => [r[0] ?? '']));
  ws3['!cols'] = [{ wch: 90 }];
  XLSX.utils.book_append_sheet(wb, ws3, 'Instructions');

  XLSX.writeFile(wb, filename);
}

/* ════════════════════════════════════════════════════════
   importQuestionsFromExcel
   Handles BOTH MCQ_Questions and Coding_Questions sheets.
   Returns array of question objects ready for Firebase.
════════════════════════════════════════════════════════ */
export async function importQuestionsFromExcel(file) {
  const XLSX = await getXLSX();
  const buf  = await file.arrayBuffer();
  const wb   = XLSX.read(new Uint8Array(buf), { type: 'array' });

  const questions = [];
  const skippedRows = [];

  for (const sheetName of wb.SheetNames) {
    // Skip instructions sheet
    if (sheetName.toLowerCase().includes('instruct')) continue;

    const rows = XLSX.utils.sheet_to_json(wb.Sheets[sheetName], { defval: '' });
    if (!rows.length) continue;

    const firstRow      = rows[0];
    const isCodingSheet =
      'functionName' in firstRow ||
      'tc1_input'    in firstRow ||
      sheetName.toLowerCase().includes('cod');

    rows.forEach((r, rowIndex) => {
      const q = String(r.question || r.Question || '').trim();
      if (!q) {
        // Warn instead of silently skipping — helps teachers find blank rows
        skippedRows.push(`Sheet "${sheetName}", row ${rowIndex + 2} (Excel row): question field is blank — row skipped.`);
        return;
      }

      if (isCodingSheet) {
        /* Parse tc1_input, tc1_output, tc1_hidden, tc2_*, ... */
        const testCases = [];
        for (let n = 1; n <= 10; n++) {
          const inp = String(r[`tc${n}_input`]  || r[`TC${n}_INPUT`]  || '').trim();
          const out = String(r[`tc${n}_output`] || r[`TC${n}_OUTPUT`] || '').trim();
          if (!inp && !out) break;
          const hidden = String(r[`tc${n}_hidden`] || '').trim().toLowerCase() === 'true';
          const expl   = String(r[`tc${n}_explanation`] || '').trim();
          testCases.push({ input: inp, output: out, hidden, ...(expl ? { explanation: expl } : {}) });
        }
        questions.push({
          id:           makeId(),
          question:     q,
          type:         'coding',
          description:  String(r.description  || r.Description  || '').trim(),
          functionName: String(r.functionName || r.function_name || '').trim(),
          difficulty:   String(r.difficulty   || 'Medium').trim(),
          defaultLang:  String(r.defaultLang  || r.default_lang  || 'python').toLowerCase().trim(),
          constraints:  String(r.constraints  || '').trim(),
          testCases,
        });
      } else {
        /* Standard MCQ/tf/fill/essay */
        const type = String(r.type || r.Type || 'mcq').toLowerCase().trim();
        
        // Helper to find option value matching multiple column naming conventions
        const getOptionValue = (row, index) => {
          const letters = ['a', 'b', 'c', 'd'];
          const num = String(index + 1);
          const letter = letters[index];
          for (const key of Object.keys(row)) {
            const k = key.toLowerCase().trim();
            if (
              k === `option${letter}` ||
              k === `option ${letter}` ||
              k === `option_${letter}` ||
              k === `option-${letter}` ||
              k === `option${num}` ||
              k === `option ${num}` ||
              k === `option_${num}` ||
              k === `option-${num}` ||
              k === letter
            ) {
              return String(row[key] ?? '').trim();
            }
          }
          return '';
        };

        const parseCorrectValue = (val) => {
          if (val === undefined || val === null || val === '') return 0;
          const s = String(val).trim().toLowerCase();
          if (s === 'a' || s === '0' || s === 'option a' || s === 'option 1' || s === '1') return 0;
          if (s === 'b' || s === '1' || s === 'option b' || s === 'option 2' || s === '2') return 1;
          if (s === 'c' || s === '2' || s === 'option c' || s === 'option 3' || s === '3') return 2;
          if (s === 'd' || s === '3' || s === 'option d' || s === 'option 4' || s === '4') return 3;
          return parseInt(s) || 0;
        };

        const parseCorrect = (val, qType) => {
          if (val === undefined || val === null || val === '') {
            return qType === 'mcq-multiple' ? [] : 0;
          }
          if (qType === 'mcq-multiple') {
            const s = String(val).trim();
            if (s.includes(',') || s.includes(';') || s.includes(' ')) {
              return s.split(/[;, ]+/).map(p => p.trim()).filter(Boolean).map(parseCorrectValue);
            }
            return [parseCorrectValue(s)];
          }
          if (qType === 'mcq' || qType === 'tf') {
            return parseCorrectValue(val);
          }
          return String(val).trim();
        };

        const opts = [
          getOptionValue(r, 0),
          getOptionValue(r, 1),
          getOptionValue(r, 2),
          getOptionValue(r, 3),
        ].filter(Boolean);

        questions.push({
          id:          makeId(),
          question:    q,
          type,
          description: String(r.description || r.Description || '').trim(),
          options:     type === 'tf' ? ['True', 'False'] : opts,
          correct:     parseCorrect(r.correct ?? r.Correct ?? '', type),
        });
      }
    }); // end rows.forEach
  }

  if (skippedRows.length > 0) {
    console.warn('[importQuestionsFromExcel] Skipped rows with blank question field:\n' + skippedRows.join('\n'));
  }

  return { questions, warnings: skippedRows };
}

/* ════════════════════════════════════════════════════════
   exportResultsExcel
   Creates a 2-sheet file: Results + Summary
════════════════════════════════════════════════════════ */
export async function exportResultsExcel(results, filename = 'exam_results.xlsx') {
  const XLSX = await getXLSX();
  const wb   = XLSX.utils.book_new();

  /* Sheet 1 — All results */
  const headers = [
    'Name', 'Register No.', 'Batch', 'Exam', 'Score', 'Percentage',
    'Grade', 'Time Taken', 'Answered', 'Total Qs', 'Tab Switches', 'Auto-Submit', 'Submitted At',
  ];
  const rows = results.map(r => [
    r.name || r.studentName || '—',
    r.registerNumber || '—',
    r.batch || '—',
    r.examTitle || '—',
    r.score || '—',
    r.percentage || '—',
    r.grade || '—',
    r.timeTaken || '—',
    r.answeredQuestions ?? '—',
    r.totalQuestions ?? '—',
    r.tabSwitches ?? 0,
    r.autoSubmitted ? 'Yes' : 'No',
    r.submittedAt ? new Date(r.submittedAt).toLocaleString() : '—',
  ]);
  const ws1 = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  autoWidths(ws1, [headers, ...rows]);
  XLSX.utils.book_append_sheet(wb, ws1, 'Results');

  /* Sheet 2 — Summary */
  const grades   = { 'A+': 0, A: 0, B: 0, C: 0, D: 0, F: 0 };
  const batches  = {};
  const exams    = {};

  results.forEach(r => {
    if (grades[r.grade] !== undefined) grades[r.grade]++;
    if (r.batch) {
      if (!batches[r.batch]) batches[r.batch] = { count: 0, sum: 0 };
      batches[r.batch].count++;
      batches[r.batch].sum += parseFloat(r.percentage || 0);
    }
    if (r.examTitle) {
      if (!exams[r.examTitle]) exams[r.examTitle] = { count: 0, sum: 0, pass: 0 };
      exams[r.examTitle].count++;
      exams[r.examTitle].sum += parseFloat(r.percentage || 0);
      if (parseFloat(r.percentage || 0) >= 50) exams[r.examTitle].pass++;
    }
  });

  const totalPct = results.length
    ? (results.reduce((a, r) => a + parseFloat(r.percentage || 0), 0) / results.length).toFixed(1)
    : 0;
  const passCount = results.filter(r => ['A+', 'A', 'B', 'C', 'D'].includes(r.grade)).length;

  const sumRows = [
    ['═══ Overall Summary ═══'],
    ['Total Submissions', results.length],
    ['Average Score',     totalPct + '%'],
    ['Pass Rate',         results.length ? ((passCount / results.length) * 100).toFixed(1) + '%' : '—'],
    [''],
    ['═══ Grade Distribution ═══'],
    ['Grade', 'Count', '% of class'],
    ...Object.entries(grades).map(([g, c]) => [g, c, results.length ? ((c / results.length) * 100).toFixed(1) + '%' : '0%']),
    [''],
    ['═══ Batch Breakdown ═══'],
    ['Batch', 'Students', 'Avg Score'],
    ...Object.entries(batches).map(([b, d]) => [b, d.count, (d.sum / d.count).toFixed(1) + '%']),
    [''],
    ['═══ Per-Exam Summary ═══'],
    ['Exam', 'Submissions', 'Avg Score', 'Pass Rate'],
    ...Object.entries(exams).map(([e, d]) => [e, d.count, (d.sum / d.count).toFixed(1) + '%', ((d.pass / d.count) * 100).toFixed(1) + '%']),
  ];
  const ws2 = XLSX.utils.aoa_to_sheet(sumRows);
  ws2['!cols'] = [{ wch: 38 }, { wch: 14 }, { wch: 14 }, { wch: 14 }];
  XLSX.utils.book_append_sheet(wb, ws2, 'Summary');

  XLSX.writeFile(wb, filename);
}

/* ════════════════════════════════════════════════════════
   exportStudentsList
════════════════════════════════════════════════════════ */
export async function exportStudentsList(students, filename = 'students.xlsx') {
  const XLSX = await getXLSX();
  const wb   = XLSX.utils.book_new();
  const h    = ['name', 'registerNumber', 'email', 'phone', 'batch', 'password'];
  const rows = students.map(s => [s.name, s.registerNumber, s.email || '', s.phone || '', s.batch, s.password || 'student123']);
  const ws   = XLSX.utils.aoa_to_sheet([h, ...rows]);
  autoWidths(ws, [h, ...rows]);
  XLSX.utils.book_append_sheet(wb, ws, 'Students');
  XLSX.writeFile(wb, filename);
}
/* ════════════════════════════════════════════════════════
   importStudentsFromExcel
   Parses the first sheet of a student Excel/CSV file.
   Returns array of student objects ready for Firebase.
════════════════════════════════════════════════════════ */
export async function importStudentsFromExcel(file) {
  const XLSX = await getXLSX();
  const buf  = await file.arrayBuffer();
  const wb   = XLSX.read(new Uint8Array(buf), { type: 'array' });
  const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { defval: '' });
  const students = [];
  const warnings = [];
  rows.forEach((r, rowIndex) => {
    if (!r.name && !r.Name) {
      warnings.push(`Row ${rowIndex + 2} (Excel row): name field is blank — row skipped.`);
      return;
    }
    students.push({
      name:           String(r.name           || r.Name           || ''),
      registerNumber: String(r.registerNumber  || r.RegisterNumber || r.ID || ''),
      email:          String(r.email           || r.Email          || ''),
      phone:          String(r.phone           || r.Phone          || ''),
      batch:          String(r.batch           || r.Batch          || 'Batch 1'),
      password:       String(r.password        || r.Password       || 'student123'),
      createdAt:      new Date().toISOString(),
    });
  });
  if (warnings.length > 0) {
    console.warn('[importStudentsFromExcel] Skipped rows with blank name:\n' + warnings.join('\n'));
  }
  return { students, warnings };
}