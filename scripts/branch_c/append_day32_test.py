with open('tests/ai_web_days31_35_expansion.test.ts', 'r', encoding='utf-8') as f:
    content = f.read()

day32_block = '''
  it('Day 32: Structural integrity, word counts, and pedagogical invariants', () => {
    const day32 = AI_WEB_LONG_LESSONS.find((l) => l.day === 32);
    assert.ok(day32, 'Day 32 must be present in AI_WEB_LONG_LESSONS');
    assert.equal(day32.minutes, 38);
    assert.equal(day32.parts.length, 5, 'Day 32 must have exactly 5 parts');

    let totalWords = 0;
    day32.parts.forEach((part, idx) => {
      assert.ok(part.title, `Part ${idx + 1} must have a title`);
      assert.ok(part.say && Array.isArray(part.say) && part.say.length >= 4, `Part ${idx + 1} must have at least 4 say paragraphs`);
      const words = part.say.join(' ').split(/\\s+/).filter(Boolean).length;
      assert.ok(
        words >= 600,
        `Part ${idx + 1} word count (${words}) must be >= 600 words`
      );
      totalWords += words;

      // Assessment Invariants
      assert.ok(part.check, `Part ${idx + 1} must have an assessment check`);
      assert.equal(part.check.options.length, 4, `Part ${idx + 1} check must have 4 options`);
      assert.equal(part.check.answer, 0, `Part ${idx + 1} check.answer must be 0`);
      assert.equal(part.check.answerIndex, 0, `Part ${idx + 1} check.answerIndex must be 0`);
      assert.ok(part.check.why.length >= 50, `Part ${idx + 1} check.why must be >= 50 characters`);

      // Code / Interactive Invariants
      assert.ok(part.example && part.example.length > 0, `Part ${idx + 1} must have an example`);
      assert.ok(part.code && part.code.length > 0, `Part ${idx + 1} must have runnable code`);
      assert.ok(part.output && part.output.length > 0, `Part ${idx + 1} must have code output`);
      assert.ok(part.tryIt && part.tryIt.length > 0, `Part ${idx + 1} must have tryIt instructions`);
    });

    assert.ok(totalWords >= 3100, `Day 32 total words (${totalWords}) must be >= 3100 words`);
    assert.ok(day32.summary && Array.isArray(day32.summary) && day32.summary.length >= 5, 'Day 32 must have at least 5 summary items');
    assert.ok(day32.projectStep, 'Day 32 must have a projectStep');
    assert.ok(day32.projectStep.title, 'Day 32 projectStep must have a title');
    assert.ok(day32.projectStep.steps && day32.projectStep.steps.length >= 3, 'Day 32 projectStep must have at least 3 steps');
  });

  it('Day 32: Gate v2 Visual Envelope Verification', () => {
    const visualPath = path.resolve(
      process.cwd(),
      'src/lib/data/lessonVisuals/ai/day-32.json'
    );
    assert.ok(fs.existsSync(visualPath), `Visual envelope must exist at ${visualPath}`);

    const envelope = JSON.parse(fs.readFileSync(visualPath, 'utf-8'));
    assert.equal(envelope.schemaVersion, '2.0.0');
    assert.equal(envelope.prefix, 'ai');
    assert.equal(envelope.day, 32);
    assert.equal(envelope.entries.length, 5, 'Must have 5 entries corresponding to the 5 parts');

    envelope.entries.forEach((entry: any, idx: number) => {
      assert.ok(entry.partTitle, `Entry ${idx + 1} must have partTitle`);
      assert.ok(entry.codeHash, `Entry ${idx + 1} must have codeHash`);
      assert.equal(entry.spec.template, 'table', `Entry ${idx + 1} template must be table`);
      assert.ok(entry.spec.title.endsWith('.'), `Entry ${idx + 1} title must end with period`);
      assert.ok(!/[0-9]/.test(entry.spec.title), `Entry ${idx + 1} title must not contain digits`);
      assert.equal(entry.spec.steps.length, 4, `Entry ${idx + 1} must have 4 steps`);

      entry.spec.steps.forEach((step: any, stepIdx: number) => {
        assert.ok(step.caption.length <= 75, `Entry ${idx + 1} step ${stepIdx + 1} caption too long (${step.caption.length})`);
        assert.ok(step.caption.endsWith('.'), `Entry ${idx + 1} step ${stepIdx + 1} caption must end with period`);
        assert.ok(!/[0-9]/.test(step.caption), `Entry ${idx + 1} step ${stepIdx + 1} caption must not contain digits`);
        assert.ok(Array.isArray(step.rows) && step.rows.length >= 2, `Entry ${idx + 1} step ${stepIdx + 1} must have >= 2 rows`);
      });
    });
  });
'''

lines = content.splitlines(keepends=True)
assert lines[-1].strip() == '});', f"Expected last line '}};' but got {repr(lines[-1])}"

new_lines = lines[:-1] + [day32_block, '\n});\n']

with open('tests/ai_web_days31_35_expansion.test.ts', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print('Appended Day 32 cleanly to tests/ai_web_days31_35_expansion.test.ts')
