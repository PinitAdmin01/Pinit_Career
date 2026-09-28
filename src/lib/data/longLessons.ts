/**
 * Long-format lessons: a full class for one course day, written in plain words.
 *
 * A day is about one hour: a ~30 minute lesson (5–7 parts), then practice and a project step.
 * Each part is taught the same way: the teacher explains in simple words, gives an everyday
 * example, shows code with a note for the important lines, asks the student to try a change,
 * and ends with one check question. The lesson page speaks `say` aloud and shows everything.
 *
 * When a course day has a long lesson, it replaces that day's older short lesson plan.
 */
import { REACT_LONG_LESSONS } from './reactLongLessons';
import { PYTHON_LONG_LESSONS } from './pythonLongLessons';

export interface LongLessonCheck {
  question: string;
  options: string[];
  /** Index into options of the right answer. */
  answer: number;
  /** Why the right answer is right, in one or two plain sentences. */
  why: string;
}

export interface LongLessonPart {
  title: string;
  /** What the teacher says, one paragraph per entry. Shown on screen and spoken aloud. */
  say: string[];
  /** An everyday, non-computer example of the idea. */
  example?: string;
  /** Runnable code that prints its result: JavaScript (console.log) or, for Python courses, Python (print). */
  code?: string;
  /** What the code prints, so students can compare. */
  output?: string;
  /** Notes for important code lines (1-based line numbers). */
  codeNotes?: { line: number; note: string }[];
  /** A small change for the student to make and run. */
  tryIt?: string;
  /**
   * Code for the student's own project on their laptop (a React file or terminal commands).
   * Shown read-only: the in-lesson runner only runs plain JavaScript, not JSX.
   */
  projectCode?: { label: string; code: string };
  check: LongLessonCheck;
}

export interface LongLesson {
  day: number;
  title: string;
  /** One sentence: what the student can do after this lesson. */
  goal: string;
  /** Rough lesson length in minutes (lesson only, not practice). */
  minutes: number;
  /** Short reminder of the previous day, spoken at the start. */
  recap?: string;
  parts: LongLessonPart[];
  /** Key points to remember, shown at the end. */
  summary: string[];
  /** Today's step of the month project. */
  projectStep?: { title: string; steps: string[] };
}

const LONG_LESSON_SOURCES: Record<string, ReadonlyArray<LongLesson>> = {
  'react-basics': REACT_LONG_LESSONS,
  python: PYTHON_LONG_LESSONS,
};

/** Language of each course's lesson code. Python runs in the browser with Pyodide, SQL with PGlite (PostgreSQL). */
export type LongLessonLanguage = 'javascript' | 'python' | 'sql';

const LONG_LESSON_LANGUAGE: Record<string, LongLessonLanguage> = {
  'react-basics': 'javascript',
  python: 'python',
  'sql-mastery': 'sql',
};

export function getLongLessonLanguage(prefix: string): LongLessonLanguage {
  return LONG_LESSON_LANGUAGE[prefix] ?? 'javascript';
}

/** The long lesson for a course prefix and day number, if one has been written. */
export function getLongLesson(prefix: string, dayNum: number): LongLesson | null {
  const days = LONG_LESSON_SOURCES[prefix];
  if (!days) return null;
  return days.find((d) => d.day === dayNum) ?? null;
}

/** Speaking time estimate, at a calm teaching pace of about 120 words a minute. */
export function estimateSpokenMinutes(lesson: LongLesson): number {
  const words = lesson.parts
    .flatMap((p) => [...p.say, p.example ?? '', p.tryIt ?? '', p.check.why])
    .join(' ')
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.round(words / 120);
}
