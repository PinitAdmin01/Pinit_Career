/**
 * What a logged-in student can and cannot do directly against the database, which is exactly
 * what anyone can do from the browser console with the public Supabase key.
 */
import { after, before, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import type { PGlite } from '@electric-sql/pglite';
import { asAnon, asUser, attempt, buildFreshDatabase, createUser } from '../helpers/db';

let db: PGlite;
let studentA: string;
let studentB: string;
let teacher: string;

before(async () => {
  ({ db } = await buildFreshDatabase());
  studentA = await createUser(db, { email: 'a@student.test' });
  studentB = await createUser(db, { email: 'b@student.test', pins: 250 });
  teacher = await createUser(db, { email: 't@staff.test', role: 'teacher' });
});

after(async () => {
  await db?.close();
});

async function profile(id: string) {
  const { rows } = await db.query<{
    display_name: string | null;
    pins: number;
    xp_total: number;
    unlocked_items: unknown;
  }>(`select display_name, pins, xp_total, unlocked_items from public.users where id = $1`, [id]);
  return rows[0];
}

/** Number of rows a visitor who is not logged in can read; a permission error counts as none. */
async function rowsVisibleToVisitor(sql: string) {
  return asAnon(db, sql).then(
    (r) => r.rows.length,
    () => 0
  );
}

describe('login identity', () => {
  test('after every migration runs, the database still recognises the logged-in student', async () => {
    const { rows } = await asUser<{ uid: string | null }>(db, studentA, `select auth.uid() as uid`);
    assert.equal(rows[0].uid, studentA);
  });
});

describe('student profile', () => {
  test('a student can save their own display name', async () => {
    await asUser(db, studentA, `update public.users set display_name = 'Asha' where id = $1`, [studentA]);
    assert.equal((await profile(studentA)).display_name, 'Asha');
  });

  test('a student cannot give themselves pins, XP or paid unlocks', async () => {
    const original = await profile(studentA);
    await attempt(() =>
      asUser(
        db,
        studentA,
        `update public.users
            set pins = 99999, xp_total = 99999, unlocked_items = '{"ai": 99999999999999}'::jsonb
          where id = $1`,
        [studentA]
      )
    );
    const now = await profile(studentA);
    assert.equal(now.pins, original.pins);
    assert.equal(now.xp_total, original.xp_total);
    assert.deepEqual(now.unlocked_items, original.unlocked_items);
  });
});

describe('exam results', () => {
  async function score(studentId: string, examId: string) {
    const { rows } = await db.query<{ score: string }>(
      `select score from public.campus_exam_results where student_id = $1 and exam_id = $2`,
      [studentId, examId]
    );
    return rows.length ? Number(rows[0].score) : null;
  }

  before(async () => {
    await db.query(
      `insert into public.campus_exam_results (exam_id, student_id, score, total_marks)
       values ('MID-1', $1, 40, 100), ('MID-1', $2, 55, 100)`,
      [studentA, studentB]
    );
  });

  test("a student cannot change another student's marks", async () => {
    await attempt(() =>
      asUser(db, studentA, `update public.campus_exam_results set score = 100 where student_id = $1`, [studentB])
    );
    assert.equal(await score(studentB, 'MID-1'), 55);
  });

  test('a student cannot change their own marks', async () => {
    await attempt(() =>
      asUser(db, studentA, `update public.campus_exam_results set score = 100 where student_id = $1`, [studentA])
    );
    assert.equal(await score(studentA, 'MID-1'), 40);
  });

  test('a student cannot add a result for themselves', async () => {
    await attempt(() =>
      asUser(
        db,
        studentA,
        `insert into public.campus_exam_results (exam_id, student_id, score, total_marks) values ('FINAL', $1, 100, 100)`,
        [studentA]
      )
    );
    assert.equal(await score(studentA, 'FINAL'), null);
  });

  test("a student cannot delete another student's result", async () => {
    await attempt(() =>
      asUser(db, studentA, `delete from public.campus_exam_results where student_id = $1`, [studentB])
    );
    assert.equal(await score(studentB, 'MID-1'), 55);
  });

  test('a student sees only their own results', async () => {
    const { rows } = await asUser<{ student_id: string }>(
      db,
      studentA,
      `select student_id from public.campus_exam_results`
    );
    assert.deepEqual(rows.map((r) => r.student_id), [studentA]);
  });

  test('a visitor who is not logged in cannot read exam results', async () => {
    assert.equal(await rowsVisibleToVisitor(`select student_id from public.campus_exam_results`), 0);
  });

  test('a teacher can record marks for a student', async () => {
    await asUser(
      db,
      teacher,
      `insert into public.campus_exam_results (exam_id, student_id, score, total_marks) values ('QUIZ-2', $1, 18, 20)`,
      [studentB]
    );
    assert.equal(await score(studentB, 'QUIZ-2'), 18);
  });
});

describe('course materials', () => {
  async function material(id: string) {
    const { rows } = await db.query<{ title: string }>(
      `select title from public.campus_course_materials where id = $1`,
      [id]
    );
    return rows[0]?.title ?? null;
  }

  before(async () => {
    await db.query(
      `insert into public.campus_course_materials (id, title, subject, semester) values ('m-1', 'DBMS Unit 1', 'DBMS', '3')`
    );
  });

  test('a student cannot delete course materials', async () => {
    await attempt(() => asUser(db, studentA, `delete from public.campus_course_materials where id = 'm-1'`));
    assert.equal(await material('m-1'), 'DBMS Unit 1');
  });

  test('a student cannot edit course materials', async () => {
    await attempt(() =>
      asUser(db, studentA, `update public.campus_course_materials set title = 'hacked' where id = 'm-1'`)
    );
    assert.equal(await material('m-1'), 'DBMS Unit 1');
  });

  test('a student cannot upload course materials', async () => {
    await attempt(() =>
      asUser(
        db,
        studentA,
        `insert into public.campus_course_materials (id, title, subject, semester) values ('m-fake', 'fake', 'x', '1')`
      )
    );
    assert.equal(await material('m-fake'), null);
  });

  test('a student can read course materials', async () => {
    const { rows } = await asUser(db, studentA, `select id from public.campus_course_materials where id = 'm-1'`);
    assert.equal(rows.length, 1);
  });

  test('a visitor who is not logged in cannot read course materials', async () => {
    assert.equal(await rowsVisibleToVisitor(`select id from public.campus_course_materials`), 0);
  });

  test('a teacher can upload course materials', async () => {
    await asUser(
      db,
      teacher,
      `insert into public.campus_course_materials (id, title, subject, semester) values ('m-2', 'OS Unit 2', 'OS', '4')`
    );
    assert.equal(await material('m-2'), 'OS Unit 2');
  });
});

describe('money, XP and badge functions are server-only', () => {
  const SERVER_ONLY_FUNCTIONS = [
    'public.spend_pins(uuid, integer, text)',
    'public.credit_pins(uuid, integer, text, text)',
    'public.increment_xp(uuid, integer, text)',
    'public.award_prestige_badge(uuid, text, text)',
    'public.purchase_ai_minutes(uuid, integer, integer)',
    'public.apply_feature_grace_extension(uuid, text, integer)',
    'public.process_fee_installment_payment(text, text, text, text, text)',
    'public.apply_student_scholarship(text, text, numeric, text)',
    'public.apply_student_scholarship_relational(text, text, numeric, text)',
    'public.perform_daily_pin_reset()',
    'public.get_finance_dashboard_aggregates()',
  ];

  for (const fn of SERVER_ONLY_FUNCTIONS) {
    test(`only the server can call ${fn}`, async () => {
      const { rows } = await db.query(
        `select has_function_privilege('authenticated', $1, 'EXECUTE') as student,
                has_function_privilege('anon', $1, 'EXECUTE') as visitor,
                has_function_privilege('service_role', $1, 'EXECUTE') as server`,
        [fn]
      );
      assert.deepEqual(rows[0], { student: false, visitor: false, server: true });
    });
  }

  test('a student calling credit_pins from the browser gets no pins', async () => {
    const original = await profile(studentA);
    await attempt(() =>
      asUser(db, studentA, `select public.credit_pins($1, 5000, 'free money', 'admin_grant')`, [studentA])
    );
    assert.equal((await profile(studentA)).pins, original.pins);
  });

  test('a visitor who is not logged in cannot read pin balances', async () => {
    const refused = await attempt(() => asAnon(db, `select public.get_pin_balance($1)`, [studentA]));
    assert.ok(refused, 'anon was able to call get_pin_balance');
  });

  test("a student cannot read another student's pin balance", async () => {
    const refused = await attempt(() => asUser(db, studentA, `select public.get_pin_balance($1)`, [studentB]));
    assert.ok(refused, "student A read student B's pin balance");
  });

  test('a student can read their own pin balance', async () => {
    const { rows } = await asUser<{ balance: number }>(
      db,
      studentA,
      `select public.get_pin_balance($1) as balance`,
      [studentA]
    );
    assert.equal(Number(rows[0].balance), (await profile(studentA)).pins);
  });
});
