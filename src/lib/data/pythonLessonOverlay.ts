/**
 * Turns a JavaScript course's lesson days into the Python track's version of the same lessons:
 * the lesson text is shared (with JavaScript terms swapped for their Python names), and each code
 * example, code-anatomy snippet and bug-fix example is replaced by a Python one written for it.
 * Used by the "... in Python" courses (DSA in Python, AI Engineering in Python).
 */
import { DayLessonPlan } from '../types/lessonEngine';

/** The Python code written for one lesson block. */
export interface PythonBlockCode {
  run?: { filename: string; initialCode: string; expectedOutput: string };
  anatomy?: { codeSnippet: string; lineNotes: Record<string, string> };
  diff?: { brokenCode: string; fixedCode: string };
}

export interface PythonLessonOptions {
  /** Python code by block id. */
  code: Record<string, PythonBlockCode>;
  /** Course-specific text swaps, applied before the common ones. */
  textSwaps?: [string, string][];
  /** Check answers that differ from a plain conversion of the JavaScript output, by block id. */
  answers?: Record<string, string>;
}

/** Wording that means the same in every course. Applied in this order, after the course's own swaps. */
const COMMON_SWAPS: [string, string][] = [
  ['JavaScript arrays', 'Python lists'],
  ['JSON.parse()', 'json.loads()'],
  ['JSON.stringify()', 'json.dumps()'],
  ['Promise.all()', 'asyncio.gather()'],
  ['Promise.all', 'asyncio.gather'],
  ['Date.now()', 'time.time()'],
  ['JavaScript', 'Python'],
  ['Math.max(', 'max('],
  ['Math.min(', 'min('],
  ['!==', '!='],
  ['===', '=='],
  ['= Infinity', '= infinity'],
  ['with Infinity', 'with infinity'],
];

const snake = (word: string) => word.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);

/** Python wording for text outside maths: camelCase names become snake_case, true/false/null become True/False/None. */
function pythonWords(text: string): string {
  // Names like vLLM (no lower-case letters after the capitals) and "false positives" are English, not code;
  // settings written as key=true (Kafka, HTTP) keep their own lower-case values.
  return text
    .replace(/\b[a-z]+(?:[A-Z][a-z0-9]+)+\b/g, snake)
    .replace(/(?<!=)\btrue\b(?! (?:positive|negative))/g, 'True')
    .replace(/(?<!=)\bfalse\b(?! (?:positive|negative))/g, 'False')
    .replace(/(?<!=)\bnull\b/g, 'None');
}

function toPythonText(text: string, swaps: [string, string][]): string {
  let out = text;
  for (const [from, to] of swaps) out = out.split(from).join(to);
  // Maths between $ signs is left alone: an _ inside \text{} would break the formula.
  return out.split(/(\$[^$]*\$)/).map((part, i) => (i % 2 ? part : pythonWords(part))).join('');
}

/** A printed JS value ("[0,1]", '{"a":true}', "true") as Python prints it ("[0, 1]", "{'a': True}", "True"). */
function toPythonOutput(output: string, swaps: [string, string][]): string {
  const repr = (v: unknown): string =>
    Array.isArray(v) ? `[${v.map(repr).join(', ')}]`
    : v === null ? 'None'
    : typeof v === 'object' ? `{${Object.entries(v as object).map(([k, x]) => `'${k}': ${repr(x)}`).join(', ')}}`
    : typeof v === 'string' ? `'${v}'`
    : typeof v === 'boolean' ? (v ? 'True' : 'False')
    : String(v);
  try {
    const value = JSON.parse(output);
    if (typeof value !== 'string') return repr(value);
  } catch {
    // not a JSON value: fall through
  }
  return toPythonText(output, swaps);
}

/** Every string, except ids, in Python wording. */
function translate(value: unknown, swaps: [string, string][], key = ''): unknown {
  if (typeof value === 'string') return /^(id|conceptId|misconceptionId|primaryMisconceptionId)$/.test(key) ? value : toPythonText(value, swaps);
  if (Array.isArray(value)) return value.map((v) => translate(v, swaps));
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, translate(v, swaps, k)]));
  }
  return value;
}

export function toPythonLessons(days: DayLessonPlan[], options: PythonLessonOptions): DayLessonPlan[] {
  const swaps = [...(options.textSwaps || []), ...COMMON_SWAPS];
  return days.map((day) => {
    const translated = translate(day, swaps) as DayLessonPlan;
    translated.blocks = day.blocks.map((block, i) => {
      const out = translated.blocks[i];
      const code = options.code[block.id];
      out.media = (block.media as any[]).map((media: any, m: number) => {
        const t = out.media[m] as any;
        if (media.type === 'runnable_code' && code?.run) return { ...t, ...code.run };
        if (media.type === 'syntax_anatomy' && code?.anatomy) {
          return { ...t, codeSnippet: code.anatomy.codeSnippet, lineNotes: translate(code.anatomy.lineNotes, swaps) };
        }
        if (media.data?.type === 'broken_fixed_diff' && code?.diff) return { ...t, data: { ...t.data, ...code.diff } };
        // Code the course left in JavaScript would be translated word by word above; keep it exact instead.
        if (media.type === 'runnable_code' || media.type === 'syntax_anatomy') return media;
        return t;
      });
      const check = block.diagnosticCheck as any;
      if (check?.expectedStringOutput) {
        const expected = options.answers?.[block.id] ?? toPythonOutput(check.expectedStringOutput, swaps);
        (out.diagnosticCheck as any).expectedStringOutput = expected;
        (out.diagnosticCheck as any).acceptableAnswers = [expected, ...(check.acceptableAnswers || []).filter((a: string) => a !== expected)];
      }
      return out;
    });
    return translated;
  });
}
