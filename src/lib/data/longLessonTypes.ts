/**
 * Core types, language mappings, and estimation utilities for long-format lessons.
 *
 * Separated from longLessons.ts to allow lightweight imports across workspace
 * hooks, UI components, and build-time gates without forcing Webpack to bundle
 * all 54 multi-megabyte curriculum files into client chunks.
 */

export interface LongLessonCheck {
  question: string;
  options: string[];
  /** Index into options of the right answer. */
  answer?: number;
  /** Why the right answer is right, in one or two plain sentences. */
  why?: string;
  answerIndex?: number;
  explanation?: string;
}

export interface LongLessonPart {
  part?: string | number;
  title: string;
  /** What the teacher says, one paragraph per entry. Shown on screen and spoken aloud. */
  say?: string[] | string;
  content?: string[] | string;
  /** An everyday, non-computer example of the idea. */
  example?: string;
  /** Runnable code that prints its result: JavaScript (console.log) or, for Python courses, Python (print). */
  code?: string;
  rawCode?: string;
  /** What the code prints, so students can compare. */
  output?: string;
  /** Notes for important code lines (1-based line numbers). */
  codeNotes?: ({ line: number; note: string } | string)[];
  /** A small change for the student to make and run. */
  tryIt?: string;
  /**
   * Code for the student's own project on their laptop (a React file or terminal commands).
   * Shown read-only: the in-lesson runner only runs plain JavaScript, not JSX.
   */
  projectCode?: { label: string; code: string };
  check?: LongLessonCheck;
  checks?: LongLessonCheck[];
}

export interface LongLesson {
  id?: string;
  course?: string;
  coursePrefix?: string;
  day: number;
  title: string;
  totalParts?: number;
  duration?: string;
  /** One sentence: what the student can do after this lesson. */
  goal?: string;
  /** Rough lesson length in minutes (lesson only, not practice). */
  minutes?: number;
  /** Short reminder of the previous day, spoken at the start. */
  recap?: string;
  overview?: string;
  description?: string;
  desc?: string;
  parts: LongLessonPart[];
  /** Key points to remember, shown at the end. */
  summary?: string[];
  /** Today's step of the month project. */
  projectStep?: { title?: string; steps?: string[]; tasks?: string[]; goal?: string; description?: string; deliverable?: string; [key: string]: any };
  assignment?: { title?: string; steps?: string[]; tasks?: string[]; goal?: string; description?: string; deliverable?: string; [key: string]: any };
  visualBinding?: {
    schemaVersion?: number;
    type?: string;
    visualHash?: string;
    [key: string]: any;
  };
}

/** Language of each course's lesson code. Python runs in the browser with Pyodide, SQL with PGlite (PostgreSQL), TypeScript is compiled with esbuild, Bash runs via in-memory POSIX shell sandbox, C++ runs via AST structural invariant inspector. */
export type LongLessonLanguage = 'javascript' | 'python' | 'sql' | 'typescript' | 'bash' | 'cpp' | 'java';

export const LONG_LESSON_LANGUAGE: Record<string, LongLessonLanguage> = {
  'react-basics': 'javascript',
  python: 'python',
  'sql-mastery': 'sql',
  'dsa-py': 'python',
  'ai-py': 'python',
  'dist-py': 'python',
  'cloud-py': 'python',
  'nlp-py': 'python',
  'quant-py': 'python',
  'prompt-py': 'python',
  'cyber-py': 'python',
  'train-py': 'python',
  'vec-py': 'python',
  'safe-py': 'python',
  'node-web': 'typescript',
  devops: 'typescript',
  'sre-web': 'typescript',
  'stream-web': 'typescript',
  'aideploy-web': 'typescript',
  cloud: 'typescript',
  design: 'typescript',
  'dsa-optim': 'typescript',
  dist: 'typescript',
  cyber: 'typescript',
  ai: 'typescript',
  comp_fund: 'bash',
  git_vcs: 'bash',
  iot_emb: 'cpp',
  iot_edge: 'python',
  iot_net: 'python',
  iot_sec: 'python',
  'quant-systems': 'cpp',
  excel_viz: 'python',
  bcom_ana: 'python',
  bcom_ops: 'python',
  bcom_ait: 'python',
  ai_prompt: 'python',
  nlp: 'python',
  blockchain: 'typescript',
  'fullstack-js': 'typescript',
  mobile: 'typescript',
  g3d: 'typescript',
  'java-basics': 'javascript',
  'soft-skills': 'javascript',
  soft_skills: 'javascript',
  'bcom-finance': 'python',
  bcom_fin: 'python',
  'bcom-accounting': 'python',
  bcom_acc: 'python',
  bcom_scrm: 'python',
  bcom_ent: 'python',
  bcom_ecom: 'python',
  bcom_dmkt: 'python',
  'bcom-marketing': 'python',
  bcom_mkt: 'python',
  bcom_ban: 'python',
  bcom_law: 'python',
  bcom_tax: 'python',
  bcom_aud: 'python',
};

export function getLongLessonLanguage(prefix: string): LongLessonLanguage {
  return LONG_LESSON_LANGUAGE[prefix] ?? 'javascript';
}

/** Speaking time estimate, at a calm teaching pace of about 120 words a minute. */
export function estimateSpokenMinutes(lesson: LongLesson): number {
  const words = lesson.parts
    .flatMap((p) => [
      ...(p.say || []),
      (p as any).content ?? '',
      p.example ?? '',
      p.tryIt ?? '',
      p.check?.why || (p.check as any)?.explanation || ''
    ])
    .join(' ')
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.round(words / 120);
}

/**
 * Rough time for the hands-on work in a lesson: reading and running each example (half a minute),
 * each "your turn" change (1 minute) and each check question (half a minute).
 */
export function estimateActivityMinutes(lesson: LongLesson): number {
  const minutes = lesson.parts.reduce(
    (total, p) => total + (p.code ? 0.5 : 0) + (p.tryIt ? 1 : 0) + 0.5,
    0
  );
  return Math.round(minutes);
}

/** Rough length of a whole class: teaching (spoken) plus doing (examples, your turn, checks). */
export function estimateLessonMinutes(lesson: LongLesson): number {
  return estimateSpokenMinutes(lesson) + estimateActivityMinutes(lesson);
}
