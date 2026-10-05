import test from 'node:test';
import assert from 'node:assert/strict';
import { loadPyodide, type PyodideInterface } from 'pyodide';

import { PYTHON_M1_VISUALS } from '../src/lib/data/lessonVisuals/pythonMonth1Visuals';
import { PYTHON_LONG_LESSONS } from '../src/lib/data/pythonLongLessons';
import { LessonVisual, VisualTone } from '../src/lib/types/lessonVisual';

const ALLOWED_TONES: Set<VisualTone> = new Set(['data', 'ok', 'error', 'idle']);

async function runLikeLessonPage(pyodide: PyodideInterface, code: string): Promise<string> {
  const out: string[] = [];
  pyodide.setStdout({ batched: (line: string) => out.push(line) });
  pyodide.setStderr({ batched: (line: string) => out.push(line) });
  const globals = pyodide.globals.get('dict')();
  globals.set('__name__', '__main__');
  let error = '';
  try {
    await pyodide.runPythonAsync(code, { globals });
  } catch (err) {
    const lines = String((err as Error).message).trim().split('\n');
    error = lines[lines.length - 1];
  } finally {
    globals.destroy();
  }
  return [out.join('\n'), error ? `[Error] ${error}` : ''].filter(Boolean).join('\n');
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function checkLabelInText(label: string, textCorpus: string): boolean {
  const cleanLabel = label.trim();
  if (!cleanLabel) return false;
  // Whole word match, case-insensitive
  const regex = new RegExp(`(^|[^a-zA-Z0-9_])${escapeRegex(cleanLabel)}([^a-zA-Z0-9_]|$)`, 'i');
  return regex.test(textCorpus);
}

export async function validateSingleVisual(
  key: string,
  entry: { partTitle: string; visual: LessonVisual },
  part: any,
  pyodide: PyodideInterface
): Promise<void> {
  const visual = entry.visual;

  // Rule 8: Match - partTitle equals the lesson part's title
  if (entry.partTitle !== part.title) {
    throw new Error(`Rule 8: partTitle "${entry.partTitle}" does not match lesson part title "${part.title}"`);
  }

  // Rule 1: Steps: 2 to 5 per visual
  if (visual.steps.length < 2 || visual.steps.length > 5) {
    throw new Error(`Rule 1: Visual must have 2 to 5 steps, but has ${visual.steps.length}`);
  }

  // Rule 2: Shapes: at most 6 nodes, boxes or table rows. Compare has exactly 2 panels. letters.text has at most 10 characters.
  if (visual.template === 'flow') {
    if (visual.nodes.length > 6) {
      throw new Error(`Rule 2: Flow visual has ${visual.nodes.length} nodes (maximum 6)`);
    }
  } else if (visual.template === 'boxes') {
    if (visual.boxes.length > 6) {
      throw new Error(`Rule 2: Boxes visual has ${visual.boxes.length} boxes (maximum 6)`);
    }
  } else if (visual.template === 'table') {
    for (const [sIdx, s] of visual.steps.entries()) {
      if (s.rows.length > 6) {
        throw new Error(`Rule 2: Table visual step ${sIdx + 1} has ${s.rows.length} rows (maximum 6)`);
      }
    }
  } else if (visual.template === 'letters') {
    if (visual.text.length > 10) {
      throw new Error(`Rule 2: Letters visual text "${visual.text}" exceeds 10 characters (${visual.text.length})`);
    }
  }

  // Rule 3: Order - each at exists in part, and comes strictly after previous step's at
  const allowedAtSequence: string[] = ['intro'];
  for (let s = 1; s <= (part.say?.length || 0); s++) {
    allowedAtSequence.push(`say${s}`);
  }
  if (part.example) allowedAtSequence.push('example');
  if (part.tryIt) allowedAtSequence.push('tryIt');

  let prevIdx = -1;
  for (const [sIdx, s] of visual.steps.entries()) {
    const curIdx = allowedAtSequence.indexOf(s.at);
    if (curIdx === -1) {
      throw new Error(`Rule 3: Step ${sIdx + 1} at "${s.at}" does not exist in part (allowed: ${allowedAtSequence.join(', ')})`);
    }
    if (curIdx <= prevIdx) {
      throw new Error(`Rule 3: Step ${sIdx + 1} at "${s.at}" does not come strictly after previous step at "${visual.steps[sIdx - 1]?.at}"`);
    }
    prevIdx = curIdx;
  }

  // Rule 4: Caption: one sentence, at most 80 characters, ending in '.'
  for (const [sIdx, s] of visual.steps.entries()) {
    if (s.caption.length > 80) {
      throw new Error(`Rule 4: Step ${sIdx + 1} caption exceeds 80 characters (${s.caption.length}): "${s.caption}"`);
    }
    if (!s.caption.endsWith('.')) {
      throw new Error(`Rule 4: Step ${sIdx + 1} caption does not end with period: "${s.caption}"`);
    }
  }

  // Rule 5: Labels: every tappable node and box label appears in that part's say, example, code, codeNotes or tryIt
  const textCorpus = [
    ...(part.say || []),
    part.example || '',
    part.code || '',
    ...(part.codeNotes?.map((cn: any) => cn.note) || []),
    part.tryIt || '',
  ].join(' ');

  if (visual.template === 'flow') {
    for (const node of visual.nodes) {
      if (node.tappable !== false) {
        if (!checkLabelInText(node.label, textCorpus)) {
          throw new Error(`Rule 5: Flow node label "${node.label}" not found as whole word in lesson text`);
        }
      }
    }
  } else if (visual.template === 'boxes') {
    for (const box of visual.boxes) {
      if (box.tappable !== false) {
        if (!checkLabelInText(box.label, textCorpus)) {
          throw new Error(`Rule 5: Box label "${box.label}" not found as whole word in lesson text`);
        }
      }
    }
  }

  // Rule 7: Colours: every tone is one of data, ok, error, idle
  if (visual.template === 'flow') {
    for (const s of visual.steps) {
      for (const [nid, tone] of Object.entries(s.tones)) {
        if (!ALLOWED_TONES.has(tone)) {
          throw new Error(`Rule 7: Invalid tone "${tone}" on flow node "${nid}"`);
        }
      }
    }
  } else if (visual.template === 'boxes') {
    for (const s of visual.steps) {
      for (const [bid, tone] of Object.entries(s.tones)) {
        if (!ALLOWED_TONES.has(tone)) {
          throw new Error(`Rule 7: Invalid tone "${tone}" on box "${bid}"`);
        }
      }
    }
  } else if (visual.template === 'table') {
    for (const s of visual.steps) {
      for (const row of s.rows) {
        if (!ALLOWED_TONES.has(row.tone)) {
          throw new Error(`Rule 7: Invalid tone "${row.tone}" on table row`);
        }
      }
    }
  } else if (visual.template === 'letters') {
    for (const s of visual.steps) {
      if (!ALLOWED_TONES.has(s.tone)) {
        throw new Error(`Rule 7: Invalid tone "${s.tone}" on letters step`);
      }
    }
  } else if (visual.template === 'compare') {
    for (const s of visual.steps) {
      if (!ALLOWED_TONES.has(s.left.tone) || !ALLOWED_TONES.has(s.right.tone)) {
        throw new Error(`Rule 7: Invalid tone on compare step panels`);
      }
    }
  }

  // Rule 6: Truth: each string in checks must appear in real output
  if (visual.template === 'compare') {
    for (const [sIdx, s] of visual.steps.entries()) {
      for (const [panelName, panel] of [['left', s.left], ['right', s.right]] as const) {
        const codeToRun = panel.whatIf || panel.code || part.code || '';
        const realOutput = await runLikeLessonPage(pyodide, codeToRun);
        const lines = realOutput.split('\n');
        for (const check of panel.checks) {
          const isErrorCheck = check.endsWith('Error');
          const found = lines.some(l => isErrorCheck ? l.includes(check) : l === check);
          if (!found) {
            throw new Error(`Rule 6: Compare step ${sIdx + 1} ${panelName} check "${check}" not found in output: \n${realOutput}`);
          }
        }
      }
    }
  } else {
    for (const [sIdx, s] of visual.steps.entries()) {
      const codeToRun = s.whatIf || part.code || '';
      if (s.checks || s.mustNotShow || s.lastLine) {
        const realOutput = await runLikeLessonPage(pyodide, codeToRun);
        const lines = realOutput.split('\n');

        if (s.checks) {
          for (const check of s.checks) {
            const isErrorCheck = check.endsWith('Error');
            const found = lines.some(l => isErrorCheck ? l.includes(check) : l === check);
            if (!found) {
              throw new Error(`Rule 6: Step ${sIdx + 1} check "${check}" not found in output: \n${realOutput}`);
            }
          }
        }

        if (s.mustNotShow) {
          for (const forbidden of s.mustNotShow) {
            if (realOutput.includes(forbidden)) {
              throw new Error(`Rule 6: Step ${sIdx + 1} mustNotShow "${forbidden}" was found in output: \n${realOutput}`);
            }
          }
        }

        if (s.lastLine !== undefined) {
          const last = lines[lines.length - 1];
          if (last !== s.lastLine) {
            throw new Error(`Rule 6: Step ${sIdx + 1} lastLine "${s.lastLine}" does not match actual last line "${last}"`);
          }
        }
      }
    }
  }
}

// ── V-03: Rule Enforcement with Deliberately Broken Samples ──────────────────

test('V-03: Rule 1 (Steps count) catches visuals with < 2 or > 5 steps', async () => {
  const pyodide = await loadPyodide();
  const part = PYTHON_LONG_LESSONS[0].parts[0];
  const brokenVisual: LessonVisual = {
    template: 'flow',
    title: 'Broken',
    nodes: [{ id: 'a', label: 'Instructions' }],
    steps: [
      { at: 'say1', caption: 'Only one step.', values: { a: '1' }, tones: { a: 'ok' }, arrows: [] },
    ],
  };

  await assert.rejects(
    () => validateSingleVisual('python:1:0', { partTitle: part.title, visual: brokenVisual }, part, pyodide),
    /Rule 1: Visual must have 2 to 5 steps/
  );
});

test('V-03: Rule 2 (Shapes budget) catches visual with > 6 nodes or > 10 letters', async () => {
  const pyodide = await loadPyodide();
  const part = PYTHON_LONG_LESSONS[0].parts[0];
  const brokenVisual: LessonVisual = {
    template: 'flow',
    title: 'Too many nodes',
    nodes: [
      { id: '1', label: '1' }, { id: '2', label: '2' }, { id: '3', label: '3' },
      { id: '4', label: '4' }, { id: '5', label: '5' }, { id: '6', label: '6' },
      { id: '7', label: '7' },
    ],
    steps: [
      { at: 'say1', caption: 'First step.', values: {}, tones: {}, arrows: [] },
      { at: 'say2', caption: 'Second step.', values: {}, tones: {}, arrows: [] },
    ],
  };

  await assert.rejects(
    () => validateSingleVisual('python:1:0', { partTitle: part.title, visual: brokenVisual }, part, pyodide),
    /Rule 2: Flow visual has 7 nodes \(maximum 6\)/
  );
});

test('V-03: Rule 3 (Order) catches steps out of sequence', async () => {
  const pyodide = await loadPyodide();
  const part = PYTHON_LONG_LESSONS[0].parts[0];
  const brokenVisual: LessonVisual = {
    template: 'flow',
    title: 'Out of order',
    nodes: [{ id: 'instructions', label: 'Instructions' }],
    steps: [
      { at: 'say2', caption: 'Step 1 starts at say2.', values: {}, tones: {}, arrows: [] },
      { at: 'say1', caption: 'Step 2 goes backwards to say1.', values: {}, tones: {}, arrows: [] },
    ],
  };

  await assert.rejects(
    () => validateSingleVisual('python:1:0', { partTitle: part.title, visual: brokenVisual }, part, pyodide),
    /Rule 3: Step 2 at "say1" does not come strictly after/
  );
});

test('V-03: Rule 4 (Caption) catches caption without period or > 80 chars', async () => {
  const pyodide = await loadPyodide();
  const part = PYTHON_LONG_LESSONS[0].parts[0];
  const brokenVisual: LessonVisual = {
    template: 'flow',
    title: 'No period',
    nodes: [{ id: 'instructions', label: 'Instructions' }],
    steps: [
      { at: 'say1', caption: 'This caption does not end with a period', values: {}, tones: {}, arrows: [] },
      { at: 'say2', caption: 'Second step.', values: {}, tones: {}, arrows: [] },
    ],
  };

  await assert.rejects(
    () => validateSingleVisual('python:1:0', { partTitle: part.title, visual: brokenVisual }, part, pyodide),
    /Rule 4: Step 1 caption does not end with period/
  );
});

test('V-03: Rule 5 (Labels) catches tappable label not in lesson text', async () => {
  const pyodide = await loadPyodide();
  const part = PYTHON_LONG_LESSONS[0].parts[0];
  const brokenVisual: LessonVisual = {
    template: 'flow',
    title: 'Invented label',
    nodes: [{ id: 'alien', label: 'Supercalifragilistic' }],
    steps: [
      { at: 'say1', caption: 'First step.', values: {}, tones: {}, arrows: [] },
      { at: 'say2', caption: 'Second step.', values: {}, tones: {}, arrows: [] },
    ],
  };

  await assert.rejects(
    () => validateSingleVisual('python:1:0', { partTitle: part.title, visual: brokenVisual }, part, pyodide),
    /Rule 5: Flow node label "Supercalifragilistic" not found as whole word in lesson text/
  );
});

test('V-03: Rule 6 (Truth) catches incorrect value check', async () => {
  const pyodide = await loadPyodide();
  const part = PYTHON_LONG_LESSONS[1].parts[1]; // Day 2, Part 2 (balance = 500)
  const brokenVisual: LessonVisual = {
    template: 'boxes',
    title: 'Wrong check value',
    boxes: [{ id: 'balance', label: 'balance' }],
    steps: [
      { at: 'say1', caption: 'balance starts at 500.', values: { balance: '500' }, tones: { balance: 'data' }, checks: ['Start: 436'] },
      { at: 'say2', caption: 'After tea.', values: { balance: '480' }, tones: { balance: 'data' } },
    ],
  };

  await assert.rejects(
    () => validateSingleVisual('python:2:1', { partTitle: part.title, visual: brokenVisual }, part, pyodide),
    /Rule 6: Step 1 check "Start: 436" not found in output/
  );
});

test('V-03: Rule 7 (Colours) catches invalid tone string', async () => {
  const pyodide = await loadPyodide();
  const part = PYTHON_LONG_LESSONS[0].parts[0];
  const brokenVisual: any = {
    template: 'flow',
    title: 'Invalid tone',
    nodes: [{ id: 'instructions', label: 'Instructions' }],
    steps: [
      { at: 'say1', caption: 'First step.', values: {}, tones: { instructions: 'purple' }, arrows: [] },
      { at: 'say2', caption: 'Second step.', values: {}, tones: { instructions: 'ok' }, arrows: [] },
    ],
  };

  await assert.rejects(
    () => validateSingleVisual('python:1:0', { partTitle: part.title, visual: brokenVisual }, part, pyodide),
    /Rule 7: Invalid tone "purple"/
  );
});

test('V-03: Rule 8 (Match) catches mismatch between partTitle and lesson part title', async () => {
  const pyodide = await loadPyodide();
  const part = PYTHON_LONG_LESSONS[0].parts[0];
  const brokenVisual: LessonVisual = {
    template: 'flow',
    title: 'Wrong title',
    nodes: [{ id: 'instructions', label: 'Instructions' }],
    steps: [
      { at: 'say1', caption: 'First step.', values: {}, tones: {}, arrows: [] },
      { at: 'say2', caption: 'Second step.', values: {}, tones: {}, arrows: [] },
    ],
  };

  await assert.rejects(
    () => validateSingleVisual('python:1:0', { partTitle: 'Completely Wrong Part Title', visual: brokenVisual }, part, pyodide),
    /Rule 8: partTitle "Completely Wrong Part Title" does not match lesson part title/
  );
});

test('V-03: Rule 9 (Coverage) catches missing or unexpected keys in pilot scope', () => {
  const keys = Object.keys(PYTHON_M1_VISUALS);
  assert.equal(keys.length, 18, `Rule 9: Expected exactly 18 visuals for Days 1-3, found ${keys.length}`);

  for (let day = 1; day <= 3; day++) {
    for (let p = 0; p < 6; p++) {
      const key = `python:${day}:${p}`;
      assert.ok(key in PYTHON_M1_VISUALS, `Rule 9: Key ${key} must exist`);
    }
  }
});

// ── V-04: Full Validation on Real Data ───────────────────────────────────────

test('V-04: All 18 visuals in PYTHON_M1_VISUALS pass all C6 rules', async () => {
  const pyodide = await loadPyodide();

  for (let day = 1; day <= 3; day++) {
    const lesson = PYTHON_LONG_LESSONS.find(l => l.day === day);
    assert.ok(lesson, `Lesson for Day ${day} exists`);

    for (let p = 0; p < 6; p++) {
      const key = `python:${day}:${p}`;
      const entry = PYTHON_M1_VISUALS[key];
      assert.ok(entry, `Entry for ${key} exists`);

      const part = lesson.parts[p];
      assert.ok(part, `Part ${p} for Day ${day} exists`);

      await validateSingleVisual(key, entry, part, pyodide);
    }
  }

  console.log('lesson visuals: all checks passed');
});
