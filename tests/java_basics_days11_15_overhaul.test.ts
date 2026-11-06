import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

import { JAVA_BASICS_LONG_LESSONS } from '../src/lib/data/javaBasicsLongLessons';
import { JAVA_30_DAYS_CONFIGS } from '../src/lib/data/java30DayData';

test('Block 3 (Days 11–15) Java Basics Overhaul: Invariants, Word Counts & Pedagogical Depth', () => {
    for (let day = 11; day <= 15; day++) {
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

test('Block 3 (Days 11–15) Java Basics Overhaul: On-Disk Visuals and Gate Contracts', () => {
    const visualsDir = path.join(process.cwd(), 'src/lib/data/lessonVisuals/java-basics');

    for (let day = 11; day <= 15; day++) {
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

            const expectedHash = crypto.createHash('sha256').update(expectedPart.code).digest('hex');
            assert.equal(
                entry.codeHash,
                expectedHash,
                `Day ${day} Entry ${idx + 1} codeHash must match sha256 of part.code`
            );

            assert.ok(entry.spec, `Day ${day} Entry ${idx + 1} must have a valid spec`);
            assert.ok(entry.spec.steps?.length >= 4, `Day ${day} Entry ${idx + 1} spec must have >= 4 steps`);
        });
    }
});

test('Block 3 (Days 11–15) Java Basics Overhaul: Challenge & Code Pedagogical Alignment', () => {
    // Day 11: Method Overloading calculateArea
    const d11Config = JAVA_30_DAYS_CONFIGS.find((d: any) => d.day === 11);
    assert.ok(d11Config?.title?.includes('Method Overloading'), 'Day 11 title must cover Method Overloading');
    assert.ok(d11Config?.eTitle?.includes('Overloaded Area Calculator'), 'Day 11 challenge must test Overloaded Area Calculator');

    // Day 12: Arrays findMax
    const d12Config = JAVA_30_DAYS_CONFIGS.find((d: any) => d.day === 12);
    assert.ok(d12Config?.title?.includes('Single-Dimensional Arrays'), 'Day 12 title must cover Single-Dimensional Arrays');
    assert.ok(d12Config?.eTitle?.includes('Find Maximum in Array'), 'Day 12 challenge must test Find Maximum in Array');

    // Day 13: For-Each countPositives
    const d13Config = JAVA_30_DAYS_CONFIGS.find((d: any) => d.day === 13);
    assert.ok(d13Config?.title?.includes('Array Traversal'), 'Day 13 title must cover Array Traversal & For-Each');
    assert.ok(d13Config?.eTitle?.includes('Count Positive Numbers'), 'Day 13 challenge must test Count Positive Numbers');

    // Day 14: 2D Matrices sumDiagonal
    const d14Config = JAVA_30_DAYS_CONFIGS.find((d: any) => d.day === 14);
    assert.ok(d14Config?.title?.includes('Multi-Dimensional Arrays'), 'Day 14 title must cover Multi-Dimensional Arrays');
    assert.ok(d14Config?.eTitle?.includes('Matrix Diagonal Sum'), 'Day 14 challenge must test Matrix Diagonal Sum');

    // Day 15: Binary Search & Milestone 3
    const d15Config = JAVA_30_DAYS_CONFIGS.find((d: any) => d.day === 15);
    assert.ok(d15Config?.title?.includes('Searching Algorithms'), 'Day 15 title must cover Searching Algorithms');
    assert.ok(d15Config?.eTitle?.includes('Milestone 3: Binary Search Ledger'), 'Day 15 challenge must test Milestone 3 Binary Search');
});
