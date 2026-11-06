import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

import { JAVA_BASICS_LONG_LESSONS } from '../src/lib/data/javaBasicsLongLessons';
import { JAVA_30_DAYS_CONFIGS } from '../src/lib/data/java30DayData';

test('Block 4 (Days 16–20) Java Basics Overhaul: Invariants, Word Counts & Pedagogical Depth', () => {
    for (let day = 16; day <= 20; day++) {
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

test('Block 4 (Days 16–20) Java Basics Overhaul: On-Disk Visuals and Gate Contracts', () => {
    const visualsDir = path.join(process.cwd(), 'src/lib/data/lessonVisuals/java-basics');

    for (let day = 16; day <= 20; day++) {
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

test('Block 4 (Days 16–20) Java Basics Overhaul: Challenge & Code Pedagogical Alignment', () => {
    // Day 16: BankAccount Class
    const d16Config = JAVA_30_DAYS_CONFIGS.find((d: any) => d.day === 16);
    assert.ok(d16Config?.title?.includes('Classes, Objects'), 'Day 16 title must cover Classes & Objects');
    assert.ok(d16Config?.eTitle?.includes('BankAccount Class'), 'Day 16 challenge must test BankAccount Class');

    // Day 17: User Constructor
    const d17Config = JAVA_30_DAYS_CONFIGS.find((d: any) => d.day === 17);
    assert.ok(d17Config?.title?.includes('Constructors'), 'Day 17 title must cover Constructors & this');
    assert.ok(d17Config?.eTitle?.includes('User Constructor'), 'Day 17 challenge must test User Constructor');

    // Day 18: Secure Bank Account
    const d18Config = JAVA_30_DAYS_CONFIGS.find((d: any) => d.day === 18);
    assert.ok(d18Config?.title?.includes('Encapsulation'), 'Day 18 title must cover Encapsulation');
    assert.ok(d18Config?.eTitle?.includes('Secure Bank Account'), 'Day 18 challenge must test Secure Bank Account');

    // Day 19: Employee & Manager Hierarchy
    const d19Config = JAVA_30_DAYS_CONFIGS.find((d: any) => d.day === 19);
    assert.ok(d19Config?.title?.includes('Inheritance'), 'Day 19 title must cover Inheritance');
    assert.ok(d19Config?.eTitle?.includes('Employee & Manager Hierarchy'), 'Day 19 challenge must test Employee & Manager');

    // Day 20: Polymorphic Payment Fees
    const d20Config = JAVA_30_DAYS_CONFIGS.find((d: any) => d.day === 20);
    assert.ok(d20Config?.title?.includes('Polymorphism'), 'Day 20 title must cover Polymorphism');
    assert.ok(d20Config?.eTitle?.includes('Polymorphic Payment Fees'), 'Day 20 challenge must test Polymorphic Payment Fees');
});
