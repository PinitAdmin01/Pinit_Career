with open('tests/iot_hardware_visuals_verification.test.ts', 'r', encoding='utf-8') as f:
    content = f.read()

block9_test = '''
test('Course 14: IoT Embedded Systems (iot_emb) Block 9 Visuals & Invariants (Days 41–45)', () => {
  clearDayFileCache();
  const prefix = 'iot_emb';
  assert.equal(isCourseVisualsEnabled(prefix), true, `Course "${prefix}" must be enabled in enabledCourses`);

  for (let day = 41; day <= 45; day++) {
    const dayPadded = String(day).padStart(2, '0');
    const filePath = path.resolve(process.cwd(), `src/lib/data/lessonVisuals/${prefix}/day-${dayPadded}.json`);
    assert.ok(fs.existsSync(filePath), `On-disk visual file missing: ${filePath}`);

    const dayFile = loadDayFile(prefix, day);
    assert.ok(dayFile, `loadDayFile failed for ${prefix} Day ${day}`);
    assert.equal(dayFile.schemaVersion, 1);
    assert.equal(dayFile.prefix, prefix);
    assert.equal(dayFile.day, day);
    assert.equal(dayFile.entries.length, 5, `Expected 5 entries in ${prefix} Day ${day}`);

    const lesson = getLongLesson(prefix, day);
    assert.ok(lesson, `LongLesson missing for ${prefix} Day ${day}`);
    assert.equal(lesson.parts.length, 5, `Expected 5 parts in LongLesson for ${prefix} Day ${day}`);

    for (let partIdx = 0; partIdx < 5; partIdx++) {
      const entry = dayFile.entries[partIdx];
      const part = lesson.parts[partIdx];

      assert.equal(entry.partTitle, part.title, `partTitle mismatch at ${prefix} Day ${day} Part ${partIdx}`);
      const expectedHash = crypto.createHash('sha256').update(part.code || '').digest('hex');
      assert.equal(entry.codeHash, expectedHash, `codeHash mismatch at ${prefix} Day ${day} Part ${partIdx}`);

      // Pedagogical checks
      assert.ok(part.check.question.length > 10, 'Question must be substantial');
      assert.equal(part.check.options.length, 4, 'Must have exactly 4 choices');
      assert.equal(part.check.answer, 0, 'Answer index must be 0 for correct option');
      assert.ok(part.check.why.length > 10, 'Pedagogical explanation must be substantial');
      assert.ok(part.say.length >= 4, 'Must have at least 4 say paragraphs');

      const visual = getVisual(prefix, day, partIdx);
      assert.ok(visual, `getVisual returned null for ${prefix} Day ${day} Part ${partIdx}`);
      assert.equal(visual.template, 'register-bits', `Expected template "register-bits" for ${prefix}`);
      assert.equal(visual.steps.length, 4, `Expected 4 synchronized steps for ${prefix} Day ${day} Part ${partIdx}`);
      assert.deepEqual(
        visual.steps.map(s => s.at),
        ['intro', 'say1', 'example', 'tryIt'],
        `Step markers must be ['intro', 'say1', 'example', 'tryIt']`
      );

      const labels = getTappableLabelsForVisual(visual);
      assert.ok(labels.length > 0, `Expected non-empty tappable labels for ${prefix} Day ${day} Part ${partIdx}`);
    }
  }
});
'''

if 'Block 9 Visuals & Invariants (Days 41–45)' not in content:
    content = content.rstrip() + '\n' + block9_test
    with open('tests/iot_hardware_visuals_verification.test.ts', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Successfully appended Block 9 to tests/iot_hardware_visuals_verification.test.ts")
else:
    print("Block 9 already present in tests/iot_hardware_visuals_verification.test.ts")
