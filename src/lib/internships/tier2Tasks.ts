import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';
import { generateValidatedTask, type GeneratedTask } from './generateTask';
import type { UserStory } from './productBrief';
import type { InternshipTaskLanguage } from './types';

export const TIER2_PYTHON_SKILLS = [
  'Python Classes and Data Structures',
  'Stack and Queue Operations',
  'Dictionary Hash Mapping',
  'Algorithm Efficiency (O(N))',
  'Data Parsing and Validation',
  'Exception Handling and Error States',
  'List Filtering and Transformations',
] as const;

export const TIER2_SQL_SKILLS = [
  'PostgreSQL DDL and Table Constraints',
  'SELECT with WHERE and ORDER BY',
  'Multi-table INNER and LEFT JOINs',
  'GROUP BY and Aggregate Functions (COUNT, SUM, AVG)',
  'Subqueries and EXISTS Filtering',
  'INSERT and Transaction Updates',
  'Indexes and Query Performance',
] as const;

export const TIER2_WEB_REACT_SKILLS = [
  'React Components',
  'JSX and Element Rendering',
  'Props and Typing',
  'State Management (useState)',
  'Event Handling and Form Inputs',
  'Conditional Rendering and Lists',
] as const;

export const TIER2_WEB_NODE_SKILLS = [
  'TypeScript Functions and Generics',
  'Node.js Request Validation',
  'Data Parsing and Transformation',
  'HTTP Status Codes and Error Responses',
  'Asynchronous Async/Await Handling',
  'String and Object Manipulation',
] as const;

export interface Tier2TaskItem {
  seq: number;
  week: number;
  kind: string;
  language: InternshipTaskLanguage;
  storyId: string;
  task: GeneratedTask;
  model: string;
}

export type GenerateTier2TasksResult =
  | {
      ok: true;
      tasks: Tier2TaskItem[];
    }
  | {
      ok: false;
      failedAtSeq: number;
      reasons: string[];
    };

export interface Tier2TaskSpec {
  seq: number;
  week: number;
  kind: string;
  language: InternshipTaskLanguage;
}

export const TIER2_TASK_SPECS: Tier2TaskSpec[] = [
  { seq: 1, week: 1, kind: 'data_validation', language: 'python' },
  { seq: 2, week: 1, kind: 'query_filter', language: 'sql' },
  { seq: 3, week: 2, kind: 'slot_manager', language: 'python' },
  { seq: 4, week: 2, kind: 'multi_table_join', language: 'sql' },
  { seq: 5, week: 3, kind: 'priority_triage', language: 'python' },
  { seq: 6, week: 3, kind: 'subquery_filter', language: 'sql' },
  { seq: 7, week: 4, kind: 'ledger_audit', language: 'python' },
  { seq: 8, week: 4, kind: 'revenue_report', language: 'sql' },
];

export const TIER2_WEB_TASK_SPECS: Tier2TaskSpec[] = [
  { seq: 1, week: 1, kind: 'ui_component', language: 'tsx' },
  { seq: 2, week: 1, kind: 'query_filter', language: 'sql' },
  { seq: 3, week: 2, kind: 'api_handler', language: 'typescript' },
  { seq: 4, week: 2, kind: 'multi_table_join', language: 'sql' },
  { seq: 5, week: 3, kind: 'interactive_feature', language: 'tsx' },
  { seq: 6, week: 3, kind: 'subquery_filter', language: 'sql' },
  { seq: 7, week: 4, kind: 'service_integration', language: 'typescript' },
  { seq: 8, week: 4, kind: 'revenue_report', language: 'sql' },
];

/**
 * Generates 8 weekly checked tasks for a Tier 2 Virtual Internship student (T-26, FR-T2-4).
 * 2 tasks per week (1 Python/TSX/TS, 1 SQL) across 4 weekly sprints.
 * Week 1 Task 1 is open; subsequent tasks are locked.
 */
export async function generateTier2MemberTasks(opts: {
  enrollmentId: string;
  studentId: string;
  stories: UserStory[];
  companyName?: string;
  track?: 'python_ai' | 'web_fullstack' | string;
  seed: string;
  model?: string;
}): Promise<GenerateTier2TasksResult> {
  const isWeb = opts.track === 'web_fullstack';
  const company = opts.companyName || (isWeb ? 'DevPulse Solutions' : 'Virtual Systems Lab');
  const admin = getSupabaseAdmin();
  const getStoryId = (idx: number) => (opts.stories[idx % opts.stories.length]?.id || `US-0${idx + 1}`);

  const specs = isWeb ? TIER2_WEB_TASK_SPECS : TIER2_TASK_SPECS;
  const tasksToInsert: Tier2TaskItem[] = [];

  for (let i = 0; i < specs.length; i++) {
    const spec = specs[i];
    const taskSeed = `${opts.seed}-t2-task-${spec.seq}-${spec.language}`;

    try {
      let skills: readonly string[];
      if (isWeb) {
        if (spec.language === 'tsx') {
          skills = TIER2_WEB_REACT_SKILLS;
        } else if (spec.language === 'typescript') {
          skills = TIER2_WEB_NODE_SKILLS;
        } else {
          skills = TIER2_SQL_SKILLS;
        }
      } else {
        skills = spec.language === 'python' ? TIER2_PYTHON_SKILLS : TIER2_SQL_SKILLS;
      }

      const genRes = await generateValidatedTask({
        tier: 't2_virtual_team',
        kind: spec.kind,
        skills,
        companyProfile: {
          name: company,
          business: isWeb ? 'Full-Stack Web & Cloud Infrastructure' : 'Cloud Software & Healthcare Services',
          description: isWeb
            ? 'Simulated corporate full-stack virtual team project with React, Node.js, and PostgreSQL.'
            : 'Simulated corporate virtual team project.',
        },
        seed: taskSeed,
        language: spec.language,
        model: opts.model,
      });

      if (!genRes.ok) {
        return {
          ok: false,
          failedAtSeq: spec.seq,
          reasons: genRes.reasons || ['Task generation failed'],
        };
      }

      tasksToInsert.push({
        seq: spec.seq,
        week: spec.week,
        kind: spec.kind,
        language: spec.language,
        storyId: getStoryId(i),
        task: genRes.task,
        model: genRes.model,
      });
    } catch (err) {
      return {
        ok: false,
        failedAtSeq: spec.seq,
        reasons: [err instanceof Error ? err.message : String(err)],
      };
    }
  }

  // Insert all 8 tasks into internship_tasks table
  const taskRows = tasksToInsert.map((t, idx) => ({
    internship_enrollment_id: opts.enrollmentId,
    seq: t.seq,
    week: t.week,
    kind: t.kind,
    language: t.language,
    title: t.task.title,
    brief: t.task.brief,
    starter_code: t.task.starter_code,
    visible_tests: t.task.visible_tests,
    hidden_tests: t.task.hidden_tests,
    reference_solution: t.task.reference_solution,
    sql_setup: t.task.sql_setup || null,
    skills: t.task.skills,
    // Week 1 Task 1 starts 'open', all others 'locked'
    status: idx === 0 ? ('open' as const) : ('locked' as const),
    attempts: 0,
    model: t.model,
    generation_meta: { storyId: t.storyId, seed: `${opts.seed}-t${t.seq}` },
  }));

  const { error: insertErr } = await admin.from('internship_tasks').insert(taskRows);
  if (insertErr) {
    console.error('[generateTier2MemberTasks] Insert failed:', insertErr);
    return { ok: false, failedAtSeq: 1, reasons: [insertErr.message] };
  }

  return {
    ok: true,
    tasks: tasksToInsert,
  };
}

/**
 * Unlocks the tasks for week N when sprint N opens.
 */
export async function unlockSprintTasks(
  enrollmentId: string,
  weekNumber: number
): Promise<{ ok: boolean; unlockedCount: number }> {
  const admin = getSupabaseAdmin();

  // Find tasks for this week
  const { data: tasks, error: fetchErr } = await admin
    .from('internship_tasks')
    .select('id, seq, status')
    .eq('internship_enrollment_id', enrollmentId)
    .eq('week', weekNumber)
    .order('seq', { ascending: true });

  if (fetchErr || !tasks || tasks.length === 0) {
    return { ok: false, unlockedCount: 0 };
  }

  // Unlock the first task of the sprint if locked
  const firstTask = tasks[0];
  if (firstTask.status === 'locked') {
    await admin
      .from('internship_tasks')
      .update({ status: 'open' })
      .eq('id', firstTask.id);
    return { ok: true, unlockedCount: 1 };
  }

  return { ok: true, unlockedCount: 0 };
}
