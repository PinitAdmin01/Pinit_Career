import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

import { JAVA_BASICS_LONG_LESSONS } from '../src/lib/data/javaBasicsLongLessons';
import { JAVA_30_DAYS_CONFIGS } from '../src/lib/data/java30DayData';

test('Block 2 (Days 6–10) Java Basics Overhaul: Invariants, Word Counts & Pedagogical Depth', () => {
    for (let day = 6; day <= 10; day++) {
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

test('Block 2 (Days 6–10) Java Basics Overhaul: On-Disk Visuals and Gate Contracts', () => {
    const visualsDir = path.join(process.cwd(), 'src/lib/data/lessonVisuals/java-basics');

    for (let day = 6; day <= 10; day++) {
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

test('Block 2 (Days 6–10) Java Basics Overhaul: Challenge & Code Pedagogical Alignment', () => {
    // Day 6: Switch day lookup
    const d6Config = JAVA_30_DAYS_CONFIGS.find((d: any) => d.day === 6);
    assert.ok(d6Config?.title?.includes('Switch Statements'), 'Day 6 title must cover Switch Statements');
    assert.ok(d6Config?.eTitle?.includes('Day Name Lookup'), 'Day 6 challenge must test Day Name Lookup');

    // Day 7: While loop factorial
    const d7Config = JAVA_30_DAYS_CONFIGS.find((d: any) => d.day === 7);
    assert.ok(d7Config?.title?.includes('While Loops'), 'Day 7 title must cover While Loops');
    assert.ok(d7Config?.eTitle?.includes('Calculate Factorial'), 'Day 7 challenge must test Factorial');

    // Day 8: For loop sum of evens
    const d8Config = JAVA_30_DAYS_CONFIGS.find((d: any) => d.day === 8);
    assert.ok(d8Config?.title?.includes('For Loops'), 'Day 8 title must cover For Loops');
    assert.ok(d8Config?.eTitle?.includes('Sum of Even Numbers'), 'Day 8 challenge must test Sum of Even Numbers');

    // Day 9: Custom methods calculateTotal
    const d9Config = JAVA_30_DAYS_CONFIGS.find((d: any) => d.day === 9);
    assert.ok(d9Config?.title?.includes('Custom Methods'), 'Day 9 title must cover Custom Methods');
    assert.ok(d9Config?.eTitle?.includes('Total Price Calculator'), 'Day 9 challenge must test Total Price Calculator');

    // Day 10: Milestone 2 Financial Engine
    const d10Config = JAVA_30_DAYS_CONFIGS.find((d: any) => d.day === 10);
    assert.ok(d10Config?.title?.includes('Call Stack'), 'Day 10 title must cover Call Stack & Milestone 2');
    assert.ok(d10Config?.eTitle?.includes('Milestone 2: Financial Utility Engine'), 'Day 10 challenge must test Milestone 2 Engine');
});
