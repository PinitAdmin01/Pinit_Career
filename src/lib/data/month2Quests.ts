/**
 * Month 2 (Days 31-60) lesson quests.
 *
 * Every course has a full LongLesson class for Days 31-60, but most course quest lists were
 * written for Month 1 only. This appends one lesson quest per Month 2 day (same id scheme as
 * buildEnrichedDayQuests: `${prefix}-lecture1-day-${n}`), so the lesson page, progress and the
 * 5-day tests (addBlockTests, built from each lesson's check questions) all work for Month 2.
 *
 * Month 2 coding practice tasks are NOT generated here: a practice task is only added when it has
 * a hand-checked reference answer, a failing starter and anti-guess checks (see
 * tests/js_practice_tasks.test.ts and tests/web_track_tasks.test.ts). Existing quest ids never change.
 */
import type { Course, CourseQuest } from './coursesData';
import { parseQuestId } from './curriculumEnricher';
import { MONTH2_LESSON_INDEX } from './month2LessonIndex';

export function withMonth2Lessons(course: Course): Course {
  const parsed = course.quests
    .map((q) => parseQuestId(q.id))
    .filter((p): p is { prefix: string; dayNum: number } => p !== null);
  if (parsed.length === 0) return course;
  const prefix = parsed[0].prefix;
  const lastDay = Math.max(...parsed.map((p) => p.dayNum));
  const entries = (MONTH2_LESSON_INDEX[prefix] || []).filter((e) => e.day > lastDay);
  if (entries.length === 0) return course;

  const existing = new Set(course.quests.map((q) => q.id));
  const added: CourseQuest[] = entries
    .filter((e) => !existing.has(`${prefix}-lecture1-day-${e.day}`))
    .map((e) => ({
      id: `${prefix}-lecture1-day-${e.day}`,
      title: `Day ${e.day}: ${e.title}`,
      desc: e.goal,
      type: 'lecture',
      category: 'learning',
      requiresAvatar: true,
      syllabus: e.summary,
      skillCategory: 'theory',
      xp: 150,
      pins: 5,
    }));

  return { ...course, quests: [...course.quests, ...added] };
}
