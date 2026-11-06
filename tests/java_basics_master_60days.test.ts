import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as fs from 'fs';
import * as path from 'path';

import { JAVA_BASICS_LONG_LESSONS } from '../src/lib/data/javaBasicsLongLessons';
import { getLongLesson, estimateSpokenMinutes, estimateLessonMinutes } from '../src/lib/data/longLessons';

function getPartWords(part: any): number {
    if (Array.isArray(part.say)) {
        return part.say.reduce((acc: number, p: string) => acc + (p || '').trim().split(/\s+/).filter(Boolean).length, 0);
    }
    if (typeof part.content === 'string') {
        return part.content.trim().split(/\s+/).filter(Boolean).length;
    }
    return 0;
}

test('Java Basics Master Verification: All 60 Days Invariant Audit', () => {
    assert.equal(JAVA_BASICS_LONG_LESSONS.length, 60, 'Must have exactly 60 days in JAVA_BASICS_LONG_LESSONS');

    const visualsDir = path.join(process.cwd(), 'src/lib/data/lessonVisuals/java-basics');

    for (let day = 1; day <= 60; day++) {
        const lesson = JAVA_BASICS_LONG_LESSONS.find((l: any) => l.day === day);
        assert.ok(lesson, `Day ${day} must exist in JAVA_BASICS_LONG_LESSONS`);
        assert.equal(lesson.parts.length, 5, `Day ${day} must have exactly 5 parts`);

        let dayWords = 0;
        lesson.parts.forEach((part: any, pIdx: number) => {
            const words = getPartWords(part);
            dayWords += words;

            assert.ok(
                words >= 580,
                `Day ${day} Part ${pIdx + 1} (${part.title}) has ${words} words, must be >= 580`
            );

            assert.ok(
                part.code && part.code.trim().length > 30,
                `Day ${day} Part ${pIdx + 1} must have runnable code (> 30 chars)`
            );

            // Month 1 (Days 1 to 30) checks verification
            if (day <= 30) {
                const checks = part.checks || (part.check ? [part.check] : []);
                assert.ok(checks.length >= 1, `Day ${day} Part ${pIdx + 1} must have checks`);
            }
        });

        assert.ok(
            dayWords >= 2900,
            `Day ${day} total words (${dayWords}) must be >= 2,900`
        );

        // Check on-disk visuals
        const padded = `day-${String(day).padStart(2, '0')}.json`;
        const vPath = path.join(visualsDir, padded);
        assert.ok(fs.existsSync(vPath), `Visual file must exist on disk: ${vPath}`);
        const vJson = JSON.parse(fs.readFileSync(vPath, 'utf-8'));
        assert.equal(vJson.schemaVersion, 1, `Visual Day ${day} schemaVersion must be 1`);
        assert.equal(vJson.entries?.length, 5, `Visual Day ${day} must have 5 entries`);
    }
});
