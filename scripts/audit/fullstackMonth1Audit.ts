/**
 * Independent forensic audit of Full-Stack JS Month 1 (Days 1-30).
 * Replicates the REAL student runtime (browser Web Worker in a sandboxed iframe):
 *   - TS compiled with esbuild (target es2022), wrapped in an async IIFE, lesson helpers injected
 *   - Only Web Worker globals exist: NO require, process, Buffer, global, module, setImmediate
 *   - Only console.log / console.error are captured (warn/info are invisible to the student)
 *   - console values formatted with the platform's own formatter (logFormat.ts)
 * Usage: npx tsx scripts/audit/fullstackMonth1Audit.ts [--json out.json]
 */
import vm from 'node:vm';
import fs from 'node:fs';
import { webcrypto } from 'node:crypto';
import esbuild from 'esbuild';
import { FULLSTACK_JS_LONG_LESSONS } from '../../src/lib/data/fullstackJsLongLessons';
import { FULLSTACK_30_DAYS_CONFIGS } from '../../src/lib/data/fullstack30DayData';
import { formatLogArgs } from '../../src/lib/code/sandbox/logFormat';
import { runLikeStudent } from './studentRuntime';
import { findForbiddenJs } from '../../src/lib/code/js/jsGuard';

type Issue = { day: number; part?: number; kind: string; detail: string };
const issues: Issue[] = [];
const add = (day: number, part: number | undefined, kind: string, detail: string) => issues.push({ day, part, kind, detail });

const norm = (s: string) => (s || '').replace(/\r/g, '').split('\n').map(l => l.trimEnd()).join('\n').trim();
const words = (s: string) => (s || '').trim().split(/\s+/).filter(Boolean).length;
const looksLikeCode = (s: string) => /(=>|\bconst\s+\w+\s*=|\bfunction\s*\w*\(|console\.log|\bclass\s+\w+\s*\{|;\s*\n)/.test(s || '');

const FILLER = [
  'pay close attention to how each state transition is structured',
  'trace how the input parameters flow through',
  'in production engineering and operational workflows, mastering',
  'in today\'s fast-paced', 'delve into', 'it is important to note', 'plays a crucial role',
  'in conclusion', 'tapestry', 'seamlessly integrat', 'robust and scalable solution',
  'this invariant is essential', 'let us explore', 'without further ado',
];

async function main() {
  const answerHist: Record<number, number> = {};
  const paraSeen = new Map<string, string>();

  for (let day = 1; day <= 30; day++) {
    const lesson: any = FULLSTACK_JS_LONG_LESSONS.find((l: any) => l.day === day);
    const cfg: any = FULLSTACK_30_DAYS_CONFIGS.find((c: any) => c.day === day);
    if (!lesson) { add(day, undefined, 'MISSING_LESSON', 'no LongLesson'); continue; }
    if (FULLSTACK_JS_LONG_LESSONS[day - 1]?.day !== day) add(day, undefined, 'INDEX_ORDER', `array index ${day - 1} holds day ${FULLSTACK_JS_LONG_LESSONS[day - 1]?.day}`);
    if (!cfg) add(day, undefined, 'MISSING_CONFIG', 'no DayConfig');
    else {
      if (cfg.title !== lesson.title) add(day, undefined, 'TITLE_MISMATCH', `config="${cfg.title}" lesson="${lesson.title}"`);
      for (const k of ['eTitle', 'eDesc', 'eStarter', 'eTest', 'aTitle', 'aDesc', 'aStarter', 'aTest']) if (!cfg[k] || !String(cfg[k]).trim()) add(day, undefined, 'CONFIG_FIELD_EMPTY', k);
      for (const k of ['eTest', 'aTest', 'eStarter', 'aStarter']) {
        const v = findForbiddenJs(cfg[k] || '');
        if (v) add(day, undefined, 'GUARD_BLOCKS_' + k, `jsGuard rejects "${v}" -> students cannot run it`);
      }
    }
    if (!lesson.goal) add(day, undefined, 'NO_GOAL', '');
    if (!lesson.recap && day > 1) add(day, undefined, 'NO_RECAP', '');
    if (!Array.isArray(lesson.summary) || lesson.summary.length < 4) add(day, undefined, 'SUMMARY_SHORT', String(lesson.summary?.length));
    if (!lesson.projectStep?.steps || lesson.projectStep.steps.length < 3) add(day, undefined, 'PROJECT_STEPS', JSON.stringify(lesson.projectStep)?.slice(0, 80));
    if (lesson.parts.length !== 5) add(day, undefined, 'PART_COUNT', String(lesson.parts.length));

    for (let i = 0; i < lesson.parts.length; i++) {
      const p: any = lesson.parts[i];
      const P = i + 1;
      const say: string[] = Array.isArray(p.say) ? p.say : [p.say || ''];
      if (say.length < 4) add(day, P, 'SAY_PARAGRAPHS', `${say.length} paragraphs`);
      for (const para of say) {
        const key = para.trim().toLowerCase();
        if (key.length > 60) {
          const prev = paraSeen.get(key);
          if (prev) add(day, P, 'DUPLICATE_PARAGRAPH', `same paragraph as ${prev}: "${para.slice(0, 70)}..."`);
          else paraSeen.set(key, `D${day}P${P}`);
        }
      }
      const c = p.check || {};
      const w = words([p.title, ...say, p.example, p.tryIt, c.question, ...(c.options || []), c.why].join(' '));
      if (w < 580) add(day, P, 'WORDS<580', String(w));
      const allText = [p.title, ...say, p.example, p.tryIt, c.question, ...(c.options || []), c.why].join(' ').toLowerCase();
      for (const f of FILLER) if (allText.includes(f)) add(day, P, 'FILLER', f);
      if (/\$[^$\s][^$]{0,40}\$/.test(say.join(' ') + ' ' + (p.example || ''))) add(day, P, 'LATEX_IN_SPOKEN_TEXT', (say.join(' ').match(/\$[^$\s][^$]{0,40}\$/) || [''])[0]);
      if (!p.example || p.example.length < 120) add(day, P, 'EXAMPLE_SHORT', String(p.example?.length));
      else if (looksLikeCode(p.example)) add(day, P, 'EXAMPLE_IS_CODE', p.example.slice(0, 80));
      if (!p.tryIt) add(day, P, 'NO_TRYIT', '');
      if (!c.question || !Array.isArray(c.options) || c.options.length < 4) add(day, P, 'CHECK_OPTIONS', String(c.options?.length));
      const ans = c.answer ?? c.answerIndex;
      if (typeof ans !== 'number' || ans < 0 || ans >= (c.options?.length || 0)) add(day, P, 'CHECK_ANSWER_INVALID', String(ans));
      else answerHist[ans] = (answerHist[ans] || 0) + 1;
      if (!c.why || c.why.length < 40) add(day, P, 'CHECK_WHY_SHORT', String(c.why?.length));
      if (c.options && new Set(c.options).size !== c.options.length) add(day, P, 'CHECK_DUP_OPTIONS', '');
      if (c.options && typeof ans === 'number') {
        const lens = c.options.map((o: string) => o.length);
        const max = Math.max(...lens);
        const second = [...lens].sort((a, b) => b - a)[1];
        if (lens[ans] === max && max > second * 1.8) add(day, P, 'CHECK_ANSWER_GIVEAWAY', `correct option is ${(max / second).toFixed(1)}x longer than any other`);
      }

      if (!p.code || !p.code.trim()) { add(day, P, 'NO_CODE', ''); continue; }
      if (!p.output || !p.output.trim()) add(day, P, 'NO_OUTPUT', '');
      for (const [re, name] of [[/\brequire\s*\(/, 'require()'], [/\bprocess\./, 'process.*'], [/\bBuffer\./, 'Buffer'], [/\bcreateHmac|createHash|timingSafeEqual|randomBytes|scryptSync|pbkdf2/, 'Node crypto API'], [/\bcrypto\.subtle/, 'crypto.subtle'], [/^\s*import\s/m, 'ESM import'], [/^\s*export\s/m, 'ESM export'], [/\bsetImmediate\b/, 'setImmediate'], [/\bfetch\s*\(/, 'fetch()']] as [RegExp, string][]) {
        if (re.test(p.code)) add(day, P, 'NODE_ONLY_API', name);
      }
      if (/Math\.random\(|Date\.now\(|new Date\(\)/.test(p.code)) add(day, P, 'NONDETERMINISTIC_SOURCE', (p.code.match(/Math\.random\(|Date\.now\(|new Date\(\)/) || [''])[0]);
      if (Array.isArray(p.codeNotes)) {
        const n = p.code.split('\n').length;
        for (const cn of p.codeNotes) if (typeof cn === 'object' && (cn.line < 1 || cn.line > n)) add(day, P, 'CODENOTE_LINE_OOB', `line ${cn.line} > ${n}`);
      }

      const r1 = await runLikeStudent(p.code);
      const r2 = await runLikeStudent(p.code);
      if (r1.error) add(day, P, 'STUDENT_RUNTIME_ERROR', r1.error.slice(0, 160));
      if (r1.lost) add(day, P, 'OUTPUT_INVISIBLE_TO_STUDENT', `console.warn/info lines never shown: ${r1.lost.split('\n').length}`);
      const shown = norm([r1.stdout, r1.stderr ? r1.stderr : ''].filter(Boolean).join('\n'));
      if (norm(r1.stdout) !== norm(r2.stdout)) add(day, P, 'NONDETERMINISTIC_OUTPUT', 'two runs differ');
      if (!r1.error && p.output && norm(r1.stdout) !== norm(p.output) && shown !== norm(p.output)) {
        const a = norm(p.output).split('\n'), b = norm(r1.stdout).split('\n');
        let k = 0; while (k < a.length && a[k] === b[k]) k++;
        add(day, P, 'OUTPUT_MISMATCH', `first diff at line ${k + 1}: declared="${(a[k] || '<none>').slice(0, 90)}" actual="${(b[k] || '<none>').slice(0, 90)}" (declared ${a.length} lines, actual ${b.length})`);
      }
      if (/\bundefined\b|NaN|\[object Object\]/.test(r1.stdout)) add(day, P, 'SUSPICIOUS_OUTPUT', (r1.stdout.match(/.*(\bundefined\b|NaN|\[object Object\]).*/) || [''])[0].slice(0, 120));
    }
  }

  const byKind: Record<string, number> = {};
  for (const x of issues) byKind[x.kind] = (byKind[x.kind] || 0) + 1;
  console.log('=== ISSUE COUNTS BY KIND ===');
  for (const [k, v] of Object.entries(byKind).sort((a, b) => b[1] - a[1])) console.log(`${String(v).padStart(4)}  ${k}`);
  console.log('=== CHECK ANSWER INDEX DISTRIBUTION (150 MCQs) ===', JSON.stringify(answerHist));
  console.log(`=== TOTAL ISSUES: ${issues.length} ===`);
  const out = process.argv.indexOf('--json');
  if (out > 0) fs.writeFileSync(process.argv[out + 1], JSON.stringify(issues, null, 2));
  else for (const x of issues) console.log(`D${x.day}${x.part ? 'P' + x.part : ''} ${x.kind}: ${x.detail}`);
}
main().then(() => process.exit(0));
