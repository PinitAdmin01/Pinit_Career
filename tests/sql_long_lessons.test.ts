import test from 'node:test';
import assert from 'node:assert/strict';
import { PGlite } from '@electric-sql/pglite';

import { SQL_LONG_LESSONS } from '../src/lib/data/sqlLongLessons';
import { DATABASE_30_DAYS_CONFIGS } from '../src/lib/data/database30DayData';
import { estimateLessonMinutes, estimateSpokenMinutes, getLongLessonLanguage } from '../src/lib/data/longLessons';
import { runSqlLesson, SQL_TEXT_PARSERS, type SqlDatabase } from '../src/lib/code/sql/sqlCore';

let db: SqlDatabase;
test.before(async () => {
  db = (await PGlite.create({ parsers: SQL_TEXT_PARSERS })) as unknown as SqlDatabase;
});

test('every SQL long lesson code sample shows exactly its stated output, every time', async () => {
  for (const lesson of SQL_LONG_LESSONS) {
    for (const [i, part] of lesson.parts.entries()) {
      if (!part.code) continue;
      const where = `Day ${lesson.day} part ${i + 1} (${part.title})`;
      assert.ok(part.output !== undefined, `${where}: code has no output`);
      assert.equal(await runSqlLesson(db, part.code), part.output, where);
      assert.equal(await runSqlLesson(db, part.code), part.output, `${where}, second run`);
    }
  }
});

// Owner rule (2026-09-28): a class is 20-30 minutes, with about 15 minutes of teaching plus doing.
test('SQL long lessons are complete 20-30 minute classes with at least 14 minutes of teaching', () => {
  assert.equal(getLongLessonLanguage('sql-mastery'), 'sql');
  const days = SQL_LONG_LESSONS.map((l) => l.day);
  assert.equal(new Set(days).size, days.length, 'a day is written twice');
  assert.ok(SQL_LONG_LESSONS.length >= DATABASE_30_DAYS_CONFIGS.length, 'every course day has a long lesson');
  for (const lesson of SQL_LONG_LESSONS) {
    const where = `Day ${lesson.day}`;
    if (lesson.day <= 30) {
      assert.equal(DATABASE_30_DAYS_CONFIGS[lesson.day - 1]?.title, lesson.title, `${where}: title differs from the course day`);
    }
    assert.ok(lesson.parts.length >= 5 && lesson.parts.length <= 7, `${where}: needs 5 to 7 parts`);
    const spoken = estimateSpokenMinutes(lesson);
    const total = estimateLessonMinutes(lesson);
    if (lesson.day <= 30) {
      assert.ok(spoken >= 14, `${where}: only ${spoken} minutes of teaching`);
      assert.ok(total >= 20 && total <= 30, `${where}: ${total} minutes in total`);
    } else {
      assert.ok(spoken >= 20, `${where}: only ${spoken} minutes of teaching for Month 2`);
      assert.ok(total >= 30, `${where}: ${total} minutes in total for Month 2`);
    }
    assert.ok(lesson.summary.length >= 3, `${where}: summary too short`);
    assert.ok(lesson.projectStep && lesson.projectStep.steps.length > 0, `${where}: missing project step`);
    for (const part of lesson.parts) {
      assert.ok(part.say.length >= 3, `${where} "${part.title}": teacher explanation too short`);
      const { options, answer } = part.check;
      assert.ok(options.length >= 2 && answer >= 0 && answer < options.length, `${where} "${part.title}": bad check question`);
      const why = ((part.check as any).why || (part.check as any).explanation || '').trim();
      assert.ok(why.length >= 15, `${where} "${part.title}": check explanation too short (${why.length} chars)`);
      assert.doesNotMatch(why, /^Verified against .* standards\.$/i, `${where} "${part.title}": contains generic rubber-stamp why`);
    }
  }

  // Verify MCQ length balance and option distribution across all 60 days
  let totalChecks = 0;
  let longestWins = 0;
  const ansCounts = [0, 0, 0, 0];
  for (const lesson of SQL_LONG_LESSONS) {
    for (const part of lesson.parts) {
      const lens = part.check.options.map((o) => o.trim().length);
      const maxLen = Math.max(...lens);
      if (lens[part.check.answer] === maxLen && lens.filter((l) => l === maxLen).length === 1) {
        longestWins++;
      }
      ansCounts[part.check.answer] = (ansCounts[part.check.answer] || 0) + 1;
      totalChecks++;
    }
  }
  const longestRate = totalChecks > 0 ? longestWins / totalChecks : 0;
  assert.ok(
    longestRate >= 0.18 && longestRate <= 0.35,
    `SQL Mastery: longest-option win rate is ${(longestRate * 100).toFixed(1)}% (${longestWins}/${totalChecks}), must be 18%-35%`
  );
  for (let a = 0; a < 4; a++) {
    const rate = (ansCounts[a] || 0) / totalChecks;
    assert.ok(rate <= 0.45, `SQL Mastery: option index ${a} bias (${(rate * 100).toFixed(1)}%) must be <= 45%`);
  }
});
