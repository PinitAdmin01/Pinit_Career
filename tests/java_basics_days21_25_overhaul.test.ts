import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

import { JAVA_BASICS_LONG_LESSONS } from '../src/lib/data/javaBasicsLongLessons';
import { JAVA_30_DAYS_CONFIGS } from '../src/lib/data/java30DayData';

test('Block 5 (Days 21–25) Java Basics Overhaul: Invariants, Word Counts & Pedagogical Depth', () => {
    for (let day = 21; day <= 25; day++) {
        const lesson = JAVA_BASICS_LONG_LESSONS.find((l: any) => l.day === day);
        assert.ok(lesson, `Lesson for Day ${day} must exist in JAVA_BASICS_LONG_LESSONS`);
        assert.equal(lesson.parts.length, 5, `Day ${day} must have exactly 5 parts`);

        let dayWordCount = 0;
        lesson.parts.forEach((part: any, pIdx: number) => {
            const content = part.content || '';
            const words = content.trim().split(/\s+/).filter(Boolean).length;
            dayWordCount += words;

            assert.ok(
                words >= 580,
                `Day ${day} Part ${pIdx + 1} ("${part.title}") must have >= 580 words. Actual: ${words}`
            );

            assert.ok(
                part.code && part.code.trim().length > 50,
                `Day ${day} Part ${pIdx + 1} must contain realistic runnable Java code`
            );

            assert.equal(
                part.checks?.length,
                4,
                `Day ${day} Part ${pIdx + 1} must have strictly 4 concept checks`
            );

            part.checks.forEach((chk: any, cIdx: number) => {
                assert.equal(
                    chk.answer,
                    0,
                    `Day ${day} Part ${pIdx + 1} Check ${cIdx + 1} must have correct answer at index 0`
                );
                assert.equal(
                    chk.options?.length,
                    4,
                    `Day ${day} Part ${pIdx + 1} Check ${cIdx + 1} must have exactly 4 options`
                );
                assert.ok(
                    chk.explanation && chk.explanation.length > 20,
                    `Day ${day} Part ${pIdx + 1} Check ${cIdx + 1} must have a detailed explanation`
                );
            });
        });

        assert.ok(
            dayWordCount >= 2900,
            `Day ${day} total words must be >= 2,900 for a 20-25 min lesson. Actual: ${dayWordCount}`
        );
    }
});

test('Block 5 (Days 21–25) Java Basics Overhaul: On-Disk Visuals and Gate Contracts', () => {
    const visualsDir = path.join(process.cwd(), 'src/lib/data/lessonVisuals/java-basics');

    for (let day = 21; day <= 25; day++) {
        const padded = `day-${String(day).padStart(2, '0')}.json`;
        const filePath = path.join(visualsDir, padded);
        assert.ok(fs.existsSync(filePath), `Visual file must exist on disk: ${filePath}`);

        const raw = fs.readFileSync(filePath, 'utf-8');
        const json = JSON.parse(raw);

        assert.equal(json.schemaVersion, 1, `Visual for Day ${day} must have schemaVersion 1`);
        assert.equal(json.entries?.length, 5, `Visual for Day ${day} must contain exactly 5 entries`);

        const lesson = JAVA_BASICS_LONG_LESSONS.find((l: any) => l.day === day);

        json.entries.forEach((entry: any, idx: number) => {
            const expectedPart = lesson.parts[idx];
            assert.equal(
                entry.partTitle,
                expectedPart.title,
                `Day ${day} Entry ${idx + 1} partTitle must match LongLesson part title`
            );

            const expectedHash = crypto
                .createHash('sha256')
                .update(expectedPart.code || '')
                .digest('hex');

            assert.equal(
                entry.codeHash,
                expectedHash,
                `Day ${day} Entry ${idx + 1} codeHash must match sha256 of part.code`
            );

            assert.ok(entry.spec, `Day ${day} Entry ${idx + 1} must have a render spec`);
            assert.equal(entry.spec.template, 'stack-queue', `Day ${day} Entry ${idx + 1} spec template must be stack-queue`);
            assert.ok(entry.spec.steps?.length >= 3, `Day ${day} Entry ${idx + 1} must have at least 3 visual steps`);
        });
    }
});

test('Block 5 (Days 21–25) Java Basics Overhaul: Curriculum & 30-Day Configuration Alignment', () => {
    const expectedTitles: Record<number, string> = {
        21: 'Interfaces, Abstract Contracts & Milestone 4: Payment Gateway Engine',
        22: 'Static Keyword: Static Fields, Methods & Class-Level Memory Topologies',
        23: 'Exception Handling I: Throwable Hierarchy, Try-Catch-Finally & Defensive Recovery',
        24: 'Exception Handling II: The throw Statement, Defensive Validation & Custom Exception Hierarchies',
        25: 'Java Collections Framework I: Dynamic Lists & ArrayList Fundamentals'
    };

    for (let day = 21; day <= 25; day++) {
        const config = JAVA_30_DAYS_CONFIGS.find((c: any) => c.day === day);
        assert.ok(config, `Config for Day ${day} must exist in JAVA_30_DAYS_CONFIGS`);
        assert.equal(
            config.title,
            expectedTitles[day],
            `Day ${day} title in JAVA_30_DAYS_CONFIGS must match expected overhauled curriculum title`
        );

        const lesson = JAVA_BASICS_LONG_LESSONS.find((l: any) => l.day === day);
        assert.equal(
            lesson.title,
            expectedTitles[day],
            `Day ${day} title in JAVA_BASICS_LONG_LESSONS must match expected overhauled curriculum title`
        );
    }
});
