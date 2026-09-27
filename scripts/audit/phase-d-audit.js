/**
 * Phase D — Pedagogical & Curriculum Quality Audit
 * Evaluates all 15 flagship courses × 30 days = 450 day-units.
 *
 * Dimensions scored GREEN / YELLOW / RED:
 *   1. objective_quality    — desc is clear, concrete, action-oriented
 *   2. difficulty_alignment — topic fits learner level (test complexity proxy)
 *   3. duplication_score    — title/desc unique within course
 *   4. example_quality      — eDesc + eHint are substantive
 *   5. diagnostic_quality   — eTest has enough cases to catch mistakes
 *   6. recovery_quality     — eHint genuinely explains (not just the answer)
 *   7. assessment_alignment — aTest tests the concept taught, aHint helps
 *   8. prerequisite_status  — no unexplained forward references
 *   9. transfer_status      — aTitle / aDesc differ meaningfully from eTitle/eDesc
 *  10. overall_status       — aggregate
 */

const fs   = require('fs');
const path = require('path');
const BASE = path.join(__dirname, '..', 'src', 'lib', 'data');

// ── Course registry ──────────────────────────────────────────────────────────

const COURSES = [
  { file: 'java30DayData.ts',                 name: 'Java',         fmt: 'java'     },
  { file: 'computerFundamentals30DayData.ts', name: 'CF',           fmt: 'quoted'   },
  { file: 'python30DayData.ts',               name: 'Python',       fmt: 'python'   },
  { file: 'database30DayData.ts',             name: 'SQL',          fmt: 'quoted'   },
  { file: 'excelDataViz30DayData.ts',         name: 'Excel',        fmt: 'quoted'   },
  { file: 'react30DayData.ts',                name: 'React',        fmt: 'react'    },
  { file: 'dsa30DayData.ts',                  name: 'DSA',          fmt: 'quoted'   },
  { file: 'bcomAccounting30DayData.ts',       name: 'BCom Acc',     fmt: 'quoted'   },
  { file: 'bcomFinance30DayData.ts',          name: 'BCom Fin',     fmt: 'quoted'   },
  { file: 'bcomMarketing30DayData.ts',        name: 'BCom Mkt',     fmt: 'quoted'   },
  { file: 'cloud30DayData.ts',                name: 'Cloud',        fmt: 'quoted'   },
  { file: 'devops30DayData.ts',               name: 'DevOps',       fmt: 'quoted'   },
  { file: 'softSkills30DayData.ts',           name: 'Soft Skills',  fmt: 'quoted'   },
  { file: 'quant30DayData.ts',                name: 'Quant',        fmt: 'quoted'   },
  { file: 'fullstack30DayData.ts',            name: 'Fullstack',    fmt: 'quoted'   },
];

// ── Extraction ───────────────────────────────────────────────────────────────

function extractDays(text, fmt) {
  const days = [];

  if (fmt === 'quoted') {
    // "day": N  — standard 12 courses
    const dr = /"day":\s*(\d+)/g;
    const starts = [];
    let m;
    while ((m = dr.exec(text)) !== null) starts.push({ day: parseInt(m[1]), pos: m.index });
    for (let i = 0; i < starts.length; i++) {
      const end = i + 1 < starts.length ? starts[i + 1].pos : text.length;
      days.push({ day: starts[i].day, chunk: text.substring(starts[i].pos, end) });
    }
    return days;
  }

  if (fmt === 'java') {
    // // ── Day N: ... comments mark each block
    const dr = /\/\/ ── Day (\d+):/g;
    const starts = [];
    let m;
    while ((m = dr.exec(text)) !== null) starts.push({ day: parseInt(m[1]), pos: m.index });
    for (let i = 0; i < starts.length; i++) {
      const end = i + 1 < starts.length ? starts[i + 1].pos : text.length;
      days.push({ day: starts[i].day, chunk: text.substring(starts[i].pos, end) });
    }
    return days;
  }

  if (fmt === 'python' || fmt === 'react') {
    // No day field — split by top-level { in the array.
    // Do NOT consume leading whitespace after [ so the first object's indentation
    // is preserved in the body string, allowing /^\s{2}\{/ to match it.
    const arrMatch = text.match(/DayConfig(?:\[\])?\s*=\s*\[([\s\S]*)\];/);
    if (!arrMatch) return days;
    const body = arrMatch[1];
    // Find each top-level object start: '  {' at indent level 2 spaces
    const objRe = /^\s{2}\{/gm;
    const starts2 = [];
    let m2;
    while ((m2 = objRe.exec(body)) !== null) starts2.push(m2.index);
    for (let i = 0; i < starts2.length; i++) {
      const end = i + 1 < starts2.length ? starts2[i + 1] : body.length;
      days.push({ day: i + 1, chunk: body.substring(starts2[i], end) });
    }
    return days;
  }

  return days;
}

// ── Field getter ─────────────────────────────────────────────────────────────

function getField(chunk, field) {
  // Quoted: "field": "value"
  const qRe = new RegExp('"' + field + '":\\s*"((?:[^"\\\\]|\\\\.)*)"', 's');
  let m = chunk.match(qRe);
  if (m) return m[1];
  // Unquoted: field: "value"
  const uRe = new RegExp('(?:^|\\s)' + field + ':\\s*"((?:[^"\\\\]|\\\\.)*)"', 'sm');
  m = chunk.match(uRe);
  if (m) return m[1];
  return '';
}

function decode(s) {
  return s.replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\"/g, '"').replace(/\\\\/g, '\\');
}

// ── Test case counter ────────────────────────────────────────────────────────

function countTestCases(testStr) {
  if (!testStr) return 0;
  const raw = decode(testStr);

  // Count explicit throw new Error( statements (JS/TS tests)
  const throwCount = (raw.match(/throw new Error\(/g) || []).length;
  if (throwCount > 0) return throwCount;

  // Count Python assert statements (may be indented inside async functions)
  const assertCount = (raw.match(/^\s*assert\s+/gm) || []).length;
  if (assertCount > 0) return assertCount;

  // Count jest matchers
  const jestCount = (raw.match(/\.(toBe|toEqual|toStrictEqual|toThrow|toContain)\(/g) || []).length;
  if (jestCount > 0) return jestCount;

  // SQL: count non-blank lines starting with SQL keywords
  const sqlLines = raw.split('\n')
    .filter(l => l.trim() && /^(SELECT|INSERT|UPDATE|DELETE|PRAGMA|CREATE|DROP|ALTER|WITH)\b/i.test(l.trim()))
    .length;
  if (sqlLines > 0) return sqlLines;

  // Fallback: count semicolons (each statement = 1 unit)
  const semiCount = (raw.match(/;\s*$/gm) || []).length;
  return semiCount;
}

// Count effective condition checks inside a single-throw eTest
// (pattern: single throw but checks A && B && C — counts as N checks)
function countConditionsInThrow(testStr) {
  if (!testStr) return 0;
  const raw = decode(testStr);
  const throwCount = (raw.match(/throw new Error\(/g) || []).length;
  if (throwCount >= 2) return throwCount; // multiple throws = fine
  if (throwCount === 1) {
    // Count conditions on the line containing the throw.
    // Using the full line (not [^)] capture) handles nested function calls like h.pop() !== x.
    const throwLine = raw.split('\n').find(l => l.includes('throw new Error('));
    if (throwLine) {
      const ops = (throwLine.match(/&&|\|\|/g) || []).length;
      return 1 + ops;
    }
    return 1;
  }
  return 0;
}

// ── Duplicate checker ────────────────────────────────────────────────────────

function significantWords(str) {
  const STOP = new Set(['a','an','the','and','or','in','of','to','for','with','on','at','by','&',
    'is','are','that','this','it','its','from','as','be','has','have','was','were']);
  return str.toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 3 && !STOP.has(w));
}

function overlapScore(wordsA, wordsB) {
  const setB = new Set(wordsB);
  const shared = wordsA.filter(w => setB.has(w)).length;
  return shared / Math.max(1, Math.min(wordsA.length, wordsB.length));
}

// ── Placeholder detector ─────────────────────────────────────────────────────

function hasPlaceholder(s) {
  return /\b(TODO|FIXME|placeholder|coming soon|TBD|lorem ipsum)\b/i.test(s);
}

// ── Scoring ──────────────────────────────────────────────────────────────────

const G = 'GREEN', Y = 'YELLOW', R = 'RED';

function scoreObjective(desc, title) {
  const d = decode(desc);
  const issues = [];
  if (hasPlaceholder(d)) { issues.push('Placeholder text in desc'); return { score: R, issues }; }
  if (d.length < 55) { issues.push(`desc too short (${d.length} chars)`); return { score: R, issues }; }
  if (d.length < 90) { issues.push(`desc short (${d.length} chars) — add more context`); return { score: Y, issues }; }
  return { score: G, issues };
}

function scoreDifficulty(eTest, aTest, dayNum) {
  // Use effective condition count (handles single-throw-multiple-conditions pattern)
  const eConds = countConditionsInThrow(eTest);
  const eCases = countTestCases(eTest);
  const effective = Math.max(eCases, eConds);
  const aCases = countTestCases(aTest);
  const issues = [];
  if (effective === 0) { issues.push('eTest has no assertions — student gets no feedback'); return { score: R, issues }; }
  if (effective === 1) { issues.push('eTest has only 1 effective check — add edge cases'); return { score: Y, issues }; }
  if (aCases === 0) { issues.push('aTest appears empty'); return { score: R, issues }; }
  return { score: G, issues };
}

// Extra stop-words for course-specific jargon that naturally recurs
const COURSE_STOP = new Set(['time','value','money','financial','accounting','marketing','cloud',
  'devops','kubernetes','docker','strategy','management','analysis','cost','capital',
  'foundation','milestone','capstone','complete','engine','system','implement','function',
  'return','write','calculate','compute']);

function scoreDuplication(title, desc, allTitles, allDescs, dayIdx) {
  const issues = [];
  // Exclude milestone/capstone days from strict title duplication checks
  const isMilestone = /milestone|capstone|final|review/i.test(title);
  const titleWords = significantWords(title).filter(w => !COURSE_STOP.has(w));

  for (let i = 0; i < allTitles.length; i++) {
    if (i === dayIdx) continue;
    // Milestones naturally share vocabulary with the days they summarize — skip
    const otherIsMilestone = /milestone|capstone|final|review/i.test(allTitles[i]);
    if (isMilestone || otherIsMilestone) continue;
    const otherWords = significantWords(allTitles[i]).filter(w => !COURSE_STOP.has(w));
    if (titleWords.length === 0 || otherWords.length === 0) continue;
    const overlap = overlapScore(titleWords, otherWords);
    if (overlap >= 0.75) {
      issues.push(`Title near-duplicate of Day ${i + 1}: "${allTitles[i].substring(0,50)}"`);
      return { score: R, issues };
    }
    if (overlap >= 0.55) {
      issues.push(`Title very similar to Day ${i + 1}: "${allTitles[i].substring(0,50)}"`);
      return { score: Y, issues };
    }
  }
  return { score: G, issues };
}

function scoreExample(eDesc, eHint) {
  const d = decode(eDesc), h = decode(eHint);
  const issues = [];
  if (hasPlaceholder(d) || hasPlaceholder(h)) { issues.push('Placeholder in example'); return { score: R, issues }; }
  if (d.length < 50) { issues.push(`eDesc too short (${d.length} chars)`); return { score: R, issues }; }
  if (h.length < 20) { issues.push(`eHint too short (${h.length} chars) — provide a step`); return { score: R, issues }; }
  if (d.length < 90) { issues.push(`eDesc borderline (${d.length} chars)`); return { score: Y, issues }; }
  if (h.length < 45) { issues.push(`eHint short (${h.length} chars) — expand scaffolding`); return { score: Y, issues }; }
  return { score: G, issues };
}

function scoreDiagnostic(eTest) {
  const issues = [];
  const cases = countTestCases(eTest);
  const conds = countConditionsInThrow(eTest);
  const effective = Math.max(cases, conds);
  if (effective === 0) { issues.push('eTest has no assertions — zero feedback for student'); return { score: R, issues }; }
  if (effective <= 1) { issues.push('eTest checks 1 condition — add at least one edge case'); return { score: Y, issues }; }
  if (effective === 2) { issues.push('eTest has 2 effective checks — consider a third edge case'); return { score: Y, issues }; }
  return { score: G, issues };
}

function scoreRecovery(eHint) {
  const h = decode(eHint);
  const issues = [];
  if (h.length < 18) { issues.push(`eHint trivially short (${h.length} chars)`); return { score: R, issues }; }
  if (/^return\b/i.test(h.trim()) && h.length < 40) {
    issues.push('eHint just says "Return X" — expand to explain the approach');
    return { score: Y, issues };
  }
  if (h.length < 45) { issues.push(`eHint short (${h.length} chars) — add one more sentence`); return { score: Y, issues }; }
  return { score: G, issues };
}

function scoreAssessment(aTitle, aDesc, aHint, aTest, eTitle, eDesc) {
  const issues = [];
  // Exact same title = no variation
  const aNorm = (aTitle || '').toLowerCase().replace(/^(assignment|exam):\s*/,'').trim();
  const eNorm = (eTitle || '').toLowerCase().replace(/^(exam|exercise|example):\s*/,'').trim();
  if (aNorm && eNorm && aNorm === eNorm) {
    issues.push('aTitle identical to eTitle — student gets no new challenge');
    return { score: R, issues };
  }
  const ad = decode(aDesc);
  const ah = decode(aHint);
  if (ad.length < 35) { issues.push(`aDesc too short (${ad.length} chars)`); return { score: R, issues }; }
  const cases = countTestCases(aTest);
  if (cases === 0) { issues.push('aTest appears empty — no way to verify correctness'); return { score: R, issues }; }
  if (ah.length < 12) { issues.push(`aHint very short (${ah.length} chars)`); return { score: Y, issues }; }
  if (ad.length < 65) { issues.push(`aDesc borderline short (${ad.length} chars)`); return { score: Y, issues }; }
  return { score: G, issues };
}

function scorePrerequisite(dayNum, title, desc, eDesc) {
  // Heuristic: flag if day 1-3 references clearly advanced compound concepts
  // without introducing them, OR if eHint is missing on Day 1
  const issues = [];
  // For now: flag if the eDesc for early days contains unexplained jargon complexity
  // Simple heuristic: day 1 should have an eHint that scaffolds from zero
  if (dayNum === 1) {
    // Day 1 should not require prior knowledge
    const advancedTerms = /\b(recursive|memoization|dynamic programming|concurrent|async|callback|closure|prototype|inheritance|polymorphism|generics|pointer|algorithm complexity)\b/i;
    if (advancedTerms.test(decode(eDesc))) {
      issues.push('Day 1 introduces advanced concepts without prerequisites');
      return { score: Y, issues };
    }
  }
  return { score: G, issues };
}

function scoreTransfer(aTitle, aDesc, eTitle, eDesc) {
  const issues = [];
  const et = eTitle.replace(/^(exam|exercise|example):\s*/i,'').toLowerCase();
  const at = aTitle.replace(/^(assignment|practice|apply):\s*/i,'').toLowerCase();
  // Exact same title = RED
  if (et === at && et.length > 0) { issues.push('aTitle identical to eTitle — no transfer'); return { score: R, issues }; }
  // Check word overlap — filter domain stop words to avoid false positives
  const ew = significantWords(et).filter(w => !COURSE_STOP.has(w));
  const aw = significantWords(at).filter(w => !COURSE_STOP.has(w));
  if (ew.length > 0 && aw.length > 0) {
    const titleOv = overlapScore(ew, aw);
    if (titleOv >= 0.85) { issues.push(`aTitle near-identical to eTitle (${Math.round(titleOv*100)}% content overlap)`); return { score: Y, issues }; }
  }
  // Only flag desc overlap if it's extreme (≥80%) — domain vocabulary naturally overlaps
  const edw = significantWords(decode(eDesc)).filter(w => !COURSE_STOP.has(w));
  const adw = significantWords(decode(aDesc)).filter(w => !COURSE_STOP.has(w));
  if (edw.length > 5 && adw.length > 5) {
    const descOv = overlapScore(edw, adw);
    if (descOv >= 0.85) { issues.push(`aDesc almost identical to eDesc (${Math.round(descOv*100)}% overlap)`); return { score: R, issues }; }
  }
  return { score: G, issues };
}

function overallStatus(scores) {
  const vals = Object.values(scores);
  if (vals.includes(R)) return R;
  if (vals.includes(Y)) return Y;
  return G;
}

// ── Audit one course ─────────────────────────────────────────────────────────

function auditCourse(courseDef) {
  const text = fs.readFileSync(path.join(BASE, courseDef.file), 'utf8');
  const dayChunks = extractDays(text, courseDef.fmt);

  if (dayChunks.length === 0) {
    console.error(`!! Could not extract days from ${courseDef.file}`);
    return [];
  }

  // Collect all titles and descs for duplication check
  const allTitles = dayChunks.map(d => decode(getField(d.chunk, 'title')));
  const allDescs  = dayChunks.map(d => decode(getField(d.chunk, 'desc')));

  const results = [];

  for (let i = 0; i < dayChunks.length; i++) {
    const { day, chunk } = dayChunks[i];
    const title  = getField(chunk, 'title');
    const desc   = getField(chunk, 'desc');
    const eTitle = getField(chunk, 'eTitle');
    const eDesc  = getField(chunk, 'eDesc');
    const eHint  = getField(chunk, 'eHint');
    const eTest  = getField(chunk, 'eTest');
    const aTitle = getField(chunk, 'aTitle');
    const aDesc  = getField(chunk, 'aDesc');
    const aHint  = getField(chunk, 'aHint');
    const aTest  = getField(chunk, 'aTest');

    const obj  = scoreObjective(desc, title);
    const diff = scoreDifficulty(eTest, aTest, day);
    const dup  = scoreDuplication(decode(title), decode(desc), allTitles, allDescs, i);
    const exQ  = scoreExample(eDesc, eHint);
    const diagQ = scoreDiagnostic(eTest);
    const recQ = scoreRecovery(eHint);
    const assQ = scoreAssessment(aTitle, aDesc, aHint, aTest, eTitle, eDesc);
    const preQ = scorePrerequisite(day, title, desc, eDesc);
    const trQ  = scoreTransfer(aTitle, aDesc, eTitle, eDesc);

    const dimScores = {
      objective_quality:   obj.score,
      difficulty_alignment: diff.score,
      duplication_score:   dup.score,
      example_quality:     exQ.score,
      diagnostic_quality:  diagQ.score,
      recovery_quality:    recQ.score,
      assessment_alignment: assQ.score,
      prerequisite_status: preQ.score,
      transfer_status:     trQ.score,
    };

    const allIssues = [
      ...obj.issues, ...diff.issues, ...dup.issues,
      ...exQ.issues, ...diagQ.issues, ...recQ.issues,
      ...assQ.issues, ...preQ.issues, ...trQ.issues,
    ];

    results.push({
      course: courseDef.name,
      day,
      title: decode(title),
      ...dimScores,
      overall_status: overallStatus(dimScores),
      issues: allIssues,
    });
  }

  return results;
}

// ── Main ─────────────────────────────────────────────────────────────────────

const allResults = [];
const summary = { courses: {}, totals: { GREEN: 0, YELLOW: 0, RED: 0 } };

for (const course of COURSES) {
  process.stdout.write(`Auditing ${course.name}...`);
  const results = auditCourse(course);
  allResults.push(...results);

  const g = results.filter(r => r.overall_status === G).length;
  const y = results.filter(r => r.overall_status === Y).length;
  const r = results.filter(r => r.overall_status === R).length;
  summary.courses[course.name] = { days: results.length, GREEN: g, YELLOW: y, RED: r };
  summary.totals.GREEN += g;
  summary.totals.YELLOW += y;
  summary.totals.RED += r;
  console.log(` ${results.length} days — 🟢${g} 🟡${y} 🔴${r}`);
}

// Write JSON report
const reportPath = path.join(__dirname, '..', 'scripts', 'phase-d-report.json');
fs.writeFileSync(reportPath, JSON.stringify(allResults, null, 2), 'utf8');

// Write RED/YELLOW summary for quick review
const summaryPath = path.join(__dirname, '..', 'scripts', 'phase-d-summary.json');
const issues = allResults
  .filter(r => r.overall_status !== G)
  .map(r => ({
    course: r.course, day: r.day, title: r.title,
    overall: r.overall_status, issues: r.issues,
    dims: Object.fromEntries(
      Object.entries(r).filter(([k]) => k.endsWith('_quality') || k.endsWith('_alignment') || k.endsWith('_score') || k.endsWith('_status') && k !== 'overall_status')
        .map(([k,v]) => [k, v])
    )
  }));
fs.writeFileSync(summaryPath, JSON.stringify(issues, null, 2), 'utf8');

// Print report
console.log('\n' + '='.repeat(70));
console.log('PHASE D AUDIT RESULTS — 450 Day-Unit Pedagogical Review');
console.log('='.repeat(70));
console.log(`\nTotal: ${allResults.length}/450 days audited`);
console.log(`GREEN:  ${summary.totals.GREEN}`);
console.log(`YELLOW: ${summary.totals.YELLOW}`);
console.log(`RED:    ${summary.totals.RED}`);

console.log('\nPer-course breakdown:');
for (const [name, s] of Object.entries(summary.courses)) {
  const bar = '🟢'.repeat(Math.ceil(s.GREEN/3)) + '🟡'.repeat(Math.ceil(s.YELLOW/3)) + '🔴'.repeat(Math.ceil(s.RED/3));
  console.log(`  ${name.padEnd(14)} ${String(s.days).padStart(2)} days | G:${String(s.GREEN).padStart(2)} Y:${String(s.YELLOW).padStart(2)} R:${String(s.RED).padStart(2)}  ${bar}`);
}

console.log('\nRED day issues:');
allResults.filter(r => r.overall_status === R).forEach(r => {
  console.log(`  [${r.course}] Day ${r.day}: ${r.title.substring(0, 55)}`);
  r.issues.slice(0, 3).forEach(i => console.log(`    • ${i}`));
});

console.log(`\nReport: scripts/phase-d-report.json`);
console.log(`Issues: scripts/phase-d-summary.json`);
