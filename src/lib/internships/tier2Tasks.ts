import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';
import { generateValidatedTask, type GeneratedTask } from './generateTask';
import type { UserStory } from './productBrief';

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

export interface Tier2TaskItem {
  seq: number;
  week: number;
  kind: string;
  language: 'python' | 'sql';
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

/**
 * 8 high-quality deterministic seed tasks (1 Python + 1 SQL per week for 4 weeks)
 * ensuring 100% reliability for tests and offline fallback.
 */
export function getDeterministicTier2Tasks(stories: UserStory[]): Tier2TaskItem[] {
  const getStoryId = (idx: number) => (stories[idx % stories.length]?.id || `US-0${idx + 1}`);

  return [
    // ── Week 1 ─────────────────────────────────────────────────────────────
    {
      seq: 1,
      week: 1,
      kind: 'data_validation',
      language: 'python',
      storyId: getStoryId(0),
      model: 'seed-task',
      task: {
        title: 'Validate and Clean Patient Intake Records',
        brief: 'Implement `validate_patient_record(payload)` which validates patient email and age, returning cleaned dict or raising ValueError.',
        starter_code: `def validate_patient_record(payload):\n    # TODO: Validate email has @ and age >= 0\n    return {}\n`,
        visible_tests: `assert validate_patient_record({'name': 'John Doe', 'email': 'john@test.com', 'age': 30}) == {'name': 'John Doe', 'email': 'john@test.com', 'age': 30}\nassert validate_patient_record({'name': 'Alice', 'email': 'alice@domain.org', 'age': 25})['age'] == 25\n`,
        hidden_tests: `assert validate_patient_record({'name': 'Baby', 'email': 'b@med.com', 'age': 0}) == {'name': 'Baby', 'email': 'b@med.com', 'age': 0}\ntry:\n    validate_patient_record({'name': 'Bad', 'email': 'no-at', 'age': 20})\n    assert False, 'Should raise ValueError'\nexcept ValueError:\n    pass\ntry:\n    validate_patient_record({'name': 'BadAge', 'email': 'ok@med.com', 'age': -5})\n    assert False, 'Should raise ValueError on negative age'\nexcept ValueError:\n    pass\n`,
        reference_solution: `def validate_patient_record(payload):\n    if '@' not in str(payload.get('email', '')):\n        raise ValueError('Invalid email')\n    age = int(payload.get('age', -1))\n    if age < 0:\n        raise ValueError('Age cannot be negative')\n    return {\n        'name': str(payload.get('name', '')).strip(),\n        'email': str(payload.get('email', '')).strip(),\n        'age': age,\n    }\n`,
        skills: ['Data Parsing and Validation', 'Exception Handling and Error States'],
        sql_setup: null,
      },
    },
    {
      seq: 2,
      week: 1,
      kind: 'query_filter',
      language: 'sql',
      storyId: getStoryId(1),
      model: 'seed-task',
      task: {
        title: 'Filter Active Patient Database Records',
        brief: 'Write a SQL query against the `patients` table to select active patients over age 18 ordered by name.',
        starter_code: `SELECT * FROM patients WHERE false;`,
        visible_tests: `assert count >= 1\nassert results[0]['name'] == 'Alice Johnson'\n`,
        hidden_tests: `assert count == 2\nassert results[1]['name'] == 'Bob Smith'\nassert 'Charlie Brown' not in [r['name'] for r in results]\n`,
        reference_solution: `SELECT id, name, email, age FROM patients WHERE active = true AND age >= 18 ORDER BY name ASC;`,
        skills: ['SELECT with WHERE and ORDER BY'],
        sql_setup: `CREATE TABLE patients (id INT PRIMARY KEY, name TEXT, email TEXT, age INT, active BOOLEAN);\nINSERT INTO patients VALUES (1, 'Alice Johnson', 'alice@test.com', 28, true), (2, 'Bob Smith', 'bob@test.com', 45, true), (3, 'Charlie Brown', 'charlie@test.com', 12, true), (4, 'Diana Prince', 'diana@test.com', 32, false);`,
      },
    },

    // ── Week 2 ─────────────────────────────────────────────────────────────
    {
      seq: 3,
      week: 2,
      kind: 'slot_manager',
      language: 'python',
      storyId: getStoryId(2),
      model: 'seed-task',
      task: {
        title: 'Doctor Appointment Slot Conflict Resolver',
        brief: 'Implement `check_slot_available(booked_slots, requested_slot)` to prevent overlapping time appointments.',
        starter_code: `def check_slot_available(booked_slots, requested_slot):\n    # Return False on collision\n    return True\n`,
        visible_tests: `assert check_slot_available(['09:00', '10:00'], '11:00') is True\nassert check_slot_available(['09:00', '10:00'], '09:00') is False\n`,
        hidden_tests: `assert check_slot_available([], '09:00') is True\nassert check_slot_available(['14:00', '15:00', '16:00'], '15:00') is False\nassert check_slot_available(['14:00', '15:00', '16:00'], '17:00') is True\n`,
        reference_solution: `def check_slot_available(booked_slots, requested_slot):\n    return requested_slot not in set(booked_slots)\n`,
        skills: ['Dictionary Hash Mapping', 'Algorithm Efficiency (O(N))'],
        sql_setup: null,
      },
    },
    {
      seq: 4,
      week: 2,
      kind: 'multi_table_join',
      language: 'sql',
      storyId: getStoryId(3),
      model: 'seed-task',
      task: {
        title: 'Join Doctors with Completed Appointment Totals',
        brief: 'Write a SQL query joining `doctors` and `appointments` to calculate completed appointment count per doctor.',
        starter_code: `SELECT d.name, 0 AS total FROM doctors d;`,
        visible_tests: `assert count >= 1\nassert results[0]['name'] == 'Dr. Evans'\n`,
        hidden_tests: `assert count == 2\nassert results[0]['total'] == 2\nassert results[1]['total'] == 1\n`,
        reference_solution: `SELECT d.name, COUNT(a.id) AS total FROM doctors d JOIN appointments a ON d.id = a.doctor_id WHERE a.status = 'completed' GROUP BY d.name ORDER BY total DESC, d.name ASC;`,
        skills: ['Multi-table INNER and LEFT JOINs', 'GROUP BY and Aggregate Functions (COUNT, SUM, AVG)'],
        sql_setup: `CREATE TABLE doctors (id INT PRIMARY KEY, name TEXT);\nCREATE TABLE appointments (id INT PRIMARY KEY, doctor_id INT, status TEXT);\nINSERT INTO doctors VALUES (1, 'Dr. Evans'), (2, 'Dr. Harris');\nINSERT INTO appointments VALUES (1, 1, 'completed'), (2, 1, 'completed'), (3, 2, 'completed'), (4, 2, 'cancelled');`,
      },
    },

    // ── Week 3 ─────────────────────────────────────────────────────────────
    {
      seq: 5,
      week: 3,
      kind: 'priority_triage',
      language: 'python',
      storyId: getStoryId(4),
      model: 'seed-task',
      task: {
        title: 'Emergency Patient Priority Triage Queue',
        brief: 'Implement `sort_triage_queue(patients)` that sorts patients by emergency triage urgency (1=highest, 5=lowest).',
        starter_code: `def sort_triage_queue(patients):\n    return patients\n`,
        visible_tests: `pts = [{'name': 'A', 'urgency': 3}, {'name': 'B', 'urgency': 1}]\nassert [p['name'] for p in sort_triage_queue(pts)] == ['B', 'A']\n`,
        hidden_tests: `pts = [{'name': 'A', 'urgency': 4}, {'name': 'B', 'urgency': 1}, {'name': 'C', 'urgency': 2}]\nassert [p['name'] for p in sort_triage_queue(pts)] == ['B', 'C', 'A']\nassert sort_triage_queue([]) == []\nassert len(sort_triage_queue([{'name': 'X', 'urgency': 1}])) == 1\n`,
        reference_solution: `def sort_triage_queue(patients):\n    return sorted(patients, key=lambda p: (p.get('urgency', 99), p.get('name', '')))\n`,
        skills: ['Stack and Queue Operations', 'List Filtering and Transformations'],
        sql_setup: null,
      },
    },
    {
      seq: 6,
      week: 3,
      kind: 'subquery_filter',
      language: 'sql',
      storyId: getStoryId(5),
      model: 'seed-task',
      task: {
        title: 'Locate Patients with Urgent Care Flag Subquery',
        brief: 'Write a SQL query using a subquery to find patients who have had at least one appointment with urgency <= 2.',
        starter_code: `SELECT * FROM patients WHERE false;`,
        visible_tests: `assert count >= 1\nassert results[0]['name'] == 'David'\n`,
        hidden_tests: `assert count == 1\nassert results[0]['name'] == 'David'\nassert 'Emma' not in [r['name'] for r in results]\n`,
        reference_solution: `SELECT id, name FROM patients WHERE id IN (SELECT patient_id FROM appointments WHERE urgency <= 2) ORDER BY name ASC;`,
        skills: ['Subqueries and EXISTS Filtering'],
        sql_setup: `CREATE TABLE patients (id INT PRIMARY KEY, name TEXT);\nCREATE TABLE appointments (id INT PRIMARY KEY, patient_id INT, urgency INT);\nINSERT INTO patients VALUES (1, 'David'), (2, 'Emma');\nINSERT INTO appointments VALUES (10, 1, 1), (11, 2, 4);`,
      },
    },

    // ── Week 4 ─────────────────────────────────────────────────────────────
    {
      seq: 7,
      week: 4,
      kind: 'ledger_audit',
      language: 'python',
      storyId: getStoryId(6),
      model: 'seed-task',
      task: {
        title: 'Clinic Revenue Ledger and Fee Reconciliation',
        brief: 'Implement `calculate_revenue(ledger_items)` calculating net revenue after discounts, discarding negative or corrupted fee entries.',
        starter_code: `def calculate_revenue(ledger_items):\n    return 0.0\n`,
        visible_tests: `assert calculate_revenue([{'fee': 100, 'discount': 10}, {'fee': 50, 'discount': 0}]) == 140.0\nassert calculate_revenue([]) == 0.0\n`,
        hidden_tests: `assert calculate_revenue([{'fee': 200, 'discount': 50}]) == 150.0\nassert calculate_revenue([{'fee': -50, 'discount': 0}, {'fee': 100, 'discount': 0}]) == 100.0\nassert calculate_revenue([{'fee': 80, 'discount': 100}]) == 0.0\n`,
        reference_solution: `def calculate_revenue(ledger_items):\n    total = 0.0\n    for item in ledger_items:\n        fee = float(item.get('fee', 0))\n        discount = float(item.get('discount', 0))\n        if fee > 0:\n            net = max(0.0, fee - discount)\n            total += net\n    return round(total, 2)\n`,
        skills: ['Algorithm Efficiency (O(N))', 'Data Parsing and Validation'],
        sql_setup: null,
      },
    },
    {
      seq: 8,
      week: 4,
      kind: 'revenue_report',
      language: 'sql',
      storyId: getStoryId(7),
      model: 'seed-task',
      task: {
        title: 'Generate Monthly Department Revenue Ledger',
        brief: 'Write a SQL query aggregating total revenue and average fee by department for settled transactions.',
        starter_code: `SELECT dept, 0 AS total_rev FROM transactions;`,
        visible_tests: `assert count >= 1\nassert results[0]['dept'] == 'Cardiology'\n`,
        hidden_tests: `assert count == 2\nassert results[0]['total_rev'] == 450\nassert results[1]['total_rev'] == 200\n`,
        reference_solution: `SELECT dept, SUM(amount) AS total_rev, AVG(amount) AS avg_rev FROM transactions WHERE settled = true GROUP BY dept ORDER BY total_rev DESC, dept ASC;`,
        skills: ['GROUP BY and Aggregate Functions (COUNT, SUM, AVG)'],
        sql_setup: `CREATE TABLE transactions (id INT PRIMARY KEY, dept TEXT, amount INT, settled BOOLEAN);\nINSERT INTO transactions VALUES (1, 'Cardiology', 300, true), (2, 'Cardiology', 150, true), (3, 'Pediatrics', 200, true), (4, 'Pediatrics', 100, false);`,
      },
    },
  ];
}

/**
 * Generates 8 weekly checked tasks for a Tier 2 Virtual Internship student (T-26, FR-T2-4).
 * 2 tasks per week (1 Python, 1 SQL) across 4 weekly sprints.
 * Week 1 Task 1 is open; subsequent tasks are locked.
 */
export async function generateTier2MemberTasks(opts: {
  enrollmentId: string;
  studentId: string;
  stories: UserStory[];
  companyName?: string;
  seed: string;
  model?: string;
}): Promise<GenerateTier2TasksResult> {
  const company = opts.companyName || 'Virtual Systems Lab';
  const seedTasks = getDeterministicTier2Tasks(opts.stories);
  const admin = getSupabaseAdmin();

  // Try AI generation or use validated seed tasks
  const tasksToInsert: Tier2TaskItem[] = [];

  for (let i = 0; i < seedTasks.length; i++) {
    const defaultTask = seedTasks[i];
    const taskSeed = `${opts.seed}-t2-task-${defaultTask.seq}-${defaultTask.language}`;

    try {
      const skills = defaultTask.language === 'python' ? TIER2_PYTHON_SKILLS : TIER2_SQL_SKILLS;
      const genRes = await generateValidatedTask({
        tier: 't2_virtual_team',
        kind: defaultTask.kind,
        skills,
        companyProfile: {
          name: company,
          business: 'Cloud Software & Healthcare Services',
          description: 'Simulated corporate virtual team project.',
        },
        seed: taskSeed,
        language: defaultTask.language,
        model: opts.model,
      });

      if (genRes.ok) {
        tasksToInsert.push({
          seq: defaultTask.seq,
          week: defaultTask.week,
          kind: defaultTask.kind,
          language: defaultTask.language,
          storyId: defaultTask.storyId,
          task: genRes.task,
          model: genRes.model,
        });
      } else {
        // Fall back to pre-validated deterministic task
        tasksToInsert.push(defaultTask);
      }
    } catch {
      tasksToInsert.push(defaultTask);
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
