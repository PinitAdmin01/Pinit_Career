"""
Append Block 6 Tests and 100% Full Course Invariant Test to tests/bcom_tax_aud_long_lessons.test.ts
"""
target_file = "tests/bcom_tax_aud_long_lessons.test.ts"

tests_to_append = '''

test('B.Com Forensic Audit & Assurance Block 6 (Days 26-30): Digital Forensics, Cyber Incidents, Continuous AI & CAE Grand Master Invariants', () => {
  const fs = require('fs');
  const path = require('path');
  const crypto = require('crypto');

  for (let day = 26; day <= 30; day++) {
    const lesson = BCOM_AUD_LONG_LESSONS.find((d: any) => d.day === day);
    assert.ok(lesson, `bcom_aud Day ${day} lesson must be defined in BCOM_AUD_LONG_LESSONS`);
    assert.equal(lesson.coursePrefix, 'bcom_aud');
    assert.equal(lesson.day, day);
    assert.equal(lesson.parts.length, 5, `Day ${day} must have exactly 5 parts`);
    assert.ok(lesson.minutes >= 35 && lesson.minutes <= 40, `Day ${day} declared minutes (${lesson.minutes}) must be between 35 and 40`);

    let dailySayWords = 0;

    // Load Gate v2 visual JSON
    const padded = String(day).padStart(2, '0');
    const visPath = path.resolve(__dirname, `../src/lib/data/lessonVisuals/bcom_aud/day-${padded}.json`);
    assert.ok(fs.existsSync(visPath), `Visual file day-${padded}.json must exist`);
    const visJson = JSON.parse(fs.readFileSync(visPath, 'utf-8'));
    assert.equal(visJson.schemaVersion, 1);
    assert.equal(visJson.prefix, 'bcom_aud');
    assert.equal(visJson.day, day);
    assert.equal(visJson.entries.length, 5, `Visual JSON for Day ${day} must have 5 entries`);

    for (let i = 0; i < 5; i++) {
      const part = lesson.parts[i];
      assert.ok(part.title.length > 0, `Day ${day} Part ${i + 1} must have a title`);
      assert.ok(Array.isArray(part.say), `Day ${day} Part ${i + 1} say must be an array`);
      assert.ok(part.say.length >= 4, `Day ${day} Part ${i + 1} must have >= 4 paragraphs in say`);

      const partWords = part.say.join(' ').split(/\\s+/).filter(Boolean).length;
      assert.ok(partWords >= 580, `Day ${day} Part ${i + 1} say words (${partWords}) must be >= 580 words`);
      dailySayWords += partWords;

      assert.ok(part.example && part.example.length > 0, `Day ${day} Part ${i + 1} must have an example`);
      assert.ok(part.code && (part.code.includes('def ') || part.code.includes('class ')), `Day ${day} Part ${i + 1} must have executable Python`);
      assert.ok(part.tryIt && part.tryIt.length > 0, `Day ${day} Part ${i + 1} must have tryIt instructions`);

      // Socratic check
      const check = part.check;
      assert.ok(check.question && check.question.length > 0, `Day ${day} Part ${i + 1} check question must be non-empty`);
      assert.equal(check.options.length, 4, `Day ${day} Part ${i + 1} check must have exactly 4 options`);
      assert.equal(check.answerIndex, 0, `Day ${day} Part ${i + 1} answerIndex must strictly be 0`);
      assert.ok(check.why && check.why.length > 0, `Day ${day} Part ${i + 1} check explanation must be non-empty`);

      // Visual entry validation
      const visEntry = visJson.entries[i];
      assert.equal(visEntry.partTitle, part.title);
      const computedHash = crypto.createHash('sha256').update(part.code).digest('hex');
      assert.equal(visEntry.codeHash, computedHash, `Visual codeHash must match SHA-256 of part.code`);
      assert.equal(visEntry.spec.template, 'ledger-sheet');
      assert.equal(visEntry.spec.steps.length, 4);
    }

    assert.ok(dailySayWords >= 2950, `Day ${day} daily say words (${dailySayWords}) must be >= 2,950 words (~22+ spoken minutes)`);
    const spoken = estimateSpokenMinutes(lesson);
    assert.ok(spoken >= 20, `Day ${day} estimateSpokenMinutes (${spoken}) must be >= 20 minutes`);
  }
});

test('Course 33 (bcom_aud) 100% Full Course Invariant: Exactly 30 Days Registered & Validated', () => {
  assert.equal(BCOM_AUD_LONG_LESSONS.length, 30, 'Course 33 (bcom_aud) must contain exactly 30 days');
  const days = BCOM_AUD_LONG_LESSONS.map((l: any) => l.day).sort((a: number, b: number) => a - b);
  for (let i = 1; i <= 30; i++) {
    assert.equal(days[i - 1], i, `Day ${i} must exist in sequential order in BCOM_AUD_LONG_LESSONS`);
  }
});
'''

with open(target_file, "a", encoding="utf-8") as f:
    f.write(tests_to_append)

print(f"Appended Block 6 and full course tests to {target_file}")
